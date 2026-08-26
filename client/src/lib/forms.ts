export type ContactFields = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  country: string;
  reason: string;
  message: string;
};

export function validateContact(fields: ContactFields): string | null {
  if (!fields.firstName.trim() || !fields.lastName.trim() || !fields.company.trim() || !fields.country || !fields.reason) {
    return "Please complete each required field.";
  }
  if (!/^\S+@\S+\.\S+$/.test(fields.email.trim())) {
    return "Please enter a valid email address.";
  }
  if (fields.message.length > 4000) {
    return "Please keep your message under 4,000 characters.";
  }
  return null;
}
