import { FormEvent, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { contactReasons } from "@/data/site";
import { validateContact } from "@/lib/forms";
import { trpc } from "@/lib/trpc";
import styles from "@/styles/Site.module.css";

type FormState = { firstName: string; lastName: string; company: string; email: string; country: string; reason: string; message: string; consent: boolean };
const emptyForm: FormState = { firstName: "", lastName: "", company: "", email: "", country: "", reason: "", message: "", consent: false };

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const submissionKey = useRef(crypto.randomUUID());
  const contactMutation = trpc.site.contact.useMutation();
  const set = (key: keyof FormState, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateContact(form);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }
    setError(""); setStatus("sending");
    const duplicateKey = `ascend-contact-${form.email.toLowerCase()}-${form.reason}`;
    if (window.sessionStorage.getItem(duplicateKey)) { setError("We already received this inquiry in this session. We will be in touch shortly."); setStatus("error"); return; }
    try {
      await contactMutation.mutateAsync({ ...form, marketingConsent: form.consent, idempotencyKey: submissionKey.current });
      window.sessionStorage.setItem(duplicateKey, "1"); submissionKey.current = crypto.randomUUID(); setStatus("success"); setForm(emptyForm);
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "We could not send your inquiry. Please try again."); setStatus("error");
    }
  };

  if (status === "success") return <div className={styles.formSuccess} role="status"><CheckCircle2 size={28} aria-hidden="true" /><div><span className={styles.eyebrow}>Inquiry received</span><h3>Thank you for starting the conversation.</h3><p>We have recorded your request and will respond using the email address you provided.</p><button type="button" onClick={() => setStatus("idle")}>Send another inquiry <ArrowRight size={15} aria-hidden="true" /></button></div></div>;

  return <form className={`${styles.contactForm}${compact ? ` ${styles.contactFormCompact}` : ""}`} onSubmit={submit} noValidate>
    <div className={styles.formRow}><label>First name <span>*</span><input value={form.firstName} onChange={(event) => set("firstName", event.target.value)} required autoComplete="given-name" /></label><label>Last name <span>*</span><input value={form.lastName} onChange={(event) => set("lastName", event.target.value)} required autoComplete="family-name" /></label></div>
    <div className={styles.formRow}><label>Company <span>*</span><input value={form.company} onChange={(event) => set("company", event.target.value)} required autoComplete="organization" /></label><label>Email <span>*</span><input value={form.email} onChange={(event) => set("email", event.target.value)} required autoComplete="email" inputMode="email" /></label></div>
    <div className={styles.formRow}><label>Country <span>*</span><select value={form.country} onChange={(event) => set("country", event.target.value)} required><option value="">Select a country</option><option>United States</option><option>United Kingdom</option><option>India</option><option>Singapore</option><option>Germany</option><option>Other</option></select></label><label>How can we help? <span>*</span><select value={form.reason} onChange={(event) => set("reason", event.target.value)} required><option value="">Select a reason</option>{contactReasons.map((reason) => <option key={reason}>{reason}</option>)}</select></label></div>
    <label className={styles.fullLabel}>Tell us a little more <textarea value={form.message} onChange={(event) => set("message", event.target.value)} placeholder="A short note about your opportunity or challenge" rows={compact ? 3 : 5} /></label>
    <label className={styles.checkboxLabel}><input type="checkbox" checked={form.consent} onChange={(event) => set("consent", event.target.checked)} /><span>I would like to receive occasional perspectives and event updates. I can unsubscribe at any time.</span></label>
    {status === "error" && <p className={styles.formError} role="alert">{error}</p>}
    <div className={styles.formSubmit}><p>Fields marked <span>*</span> are required. By submitting, you consent to a follow-up about this inquiry.</p><button type="submit" disabled={status === "sending" || contactMutation.isPending}>{status === "sending" ? <><LoaderCircle className={styles.spinning} size={16} aria-hidden="true" /> Sending</> : <>Submit inquiry <ArrowRight size={16} aria-hidden="true" /></>}</button></div>
  </form>;
}
