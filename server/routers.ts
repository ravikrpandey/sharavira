import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const contactInput = z.object({
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  company: z.string().min(1).max(240),
  email: z.string().email().max(320),
  country: z.string().min(1).max(120),
  reason: z.string().min(1).max(200),
  message: z.string().max(4000),
  marketingConsent: z.boolean(),
  idempotencyKey: z.string().min(8).max(200),
});

async function forwardSubmission(path: string, payload: Record<string, unknown>, idempotencyKey: string) {
  const baseURL = process.env.CONTENT_API_BASE;
  if (!baseURL) return { success: true, storage: "preview" as const };
  const response = await fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new TRPCError({ code: response.status === 409 ? "CONFLICT" : "BAD_REQUEST", message: body?.message ?? "Unable to submit your request" });
  }
  return { success: true, storage: "portable-api" as const };
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  site: router({
    contact: publicProcedure.input(contactInput).mutation(({ input }) => {
      const { idempotencyKey, ...payload } = input;
      return forwardSubmission("/contact", payload, idempotencyKey);
    }),
    newsletter: publicProcedure.input(z.object({ email: z.string().email().max(320), idempotencyKey: z.string().min(8).max(200) })).mutation(({ input }) =>
      forwardSubmission("/newsletter", { email: input.email }, input.idempotencyKey)
    ),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
