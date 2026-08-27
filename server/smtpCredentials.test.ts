import net from "node:net";
import tls from "node:tls";
import { afterEach, describe, expect, it } from "vitest";

const host = "smtp.gmail.com";
const port = 587;
const username = process.env.SMTP_USERNAME;
const password = process.env.SMTP_PASSWORD;
const sockets: net.Socket[] = [];
const smtpTest = username && password ? it : it.skip;

function connect(socket: net.Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.once("connect", resolve);
    socket.once("error", reject);
    socket.connect(port, host);
  });
}

function readReply(socket: net.Socket): Promise<string> {
  return new Promise((resolve, reject) => {
    let text = "";
    const timeout = setTimeout(() => finish(new Error("Timed out waiting for Gmail SMTP")), 10_000);
    const onData = (chunk: Buffer) => {
      text += chunk.toString("utf8");
      if (/^\d{3} /m.test(text)) finish();
    };
    const onError = (error: Error) => finish(error);
    const finish = (error?: Error) => {
      clearTimeout(timeout);
      socket.off("data", onData);
      socket.off("error", onError);
      if (error) reject(error); else resolve(text);
    };
    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function command(socket: net.Socket, value: string): Promise<string> {
  const reply = readReply(socket);
  socket.write(`${value}\r\n`);
  return reply;
}

afterEach(() => sockets.splice(0).forEach((socket) => socket.destroy()));

describe("Gmail SMTP credential", () => {
  smtpTest("authenticates the configured App Password without sending email", async () => {
    expect(username).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(password).toMatch(/^\S{16,}$/);

    const plainSocket = new net.Socket();
    sockets.push(plainSocket);
    await connect(plainSocket);
    expect((await readReply(plainSocket)).startsWith("220")).toBe(true);
    expect((await command(plainSocket, "EHLO sharavira-notifier")).startsWith("250")).toBe(true);
    expect((await command(plainSocket, "STARTTLS")).startsWith("220")).toBe(true);

    const secureSocket = tls.connect({ socket: plainSocket, servername: host });
    sockets.push(secureSocket);
    await new Promise<void>((resolve, reject) => {
      secureSocket.once("secureConnect", resolve);
      secureSocket.once("error", reject);
    });
    expect((await command(secureSocket, "EHLO sharavira-notifier")).startsWith("250")).toBe(true);
    const token = Buffer.from(`\u0000${username}\u0000${password}`).toString("base64");
    expect((await command(secureSocket, `AUTH PLAIN ${token}`)).startsWith("235")).toBe(true);
    await command(secureSocket, "QUIT");
  }, 20_000);
});
