export type SetupStep = "login" | "intro" | "account" | "verify" | "done";

export type FormState = {
  password: string;
  confirmPassword: string;
  email: string;
  confirmEmail: string;
  code: string;
};

export type FormErrors = Partial<Record<keyof FormState, string>>;

export const defaultFormState: FormState = {
  password: "",
  confirmPassword: "",
  email: "",
  confirmEmail: "",
  code: "",
};

const countPasswordCategories = (value: string) => {
  const categories = [
    /[A-Z]/.test(value),
    /[a-z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ];

  return categories.filter(Boolean).length;
};

export const isPasswordValid = (value: string) =>
  value.length >= 8 && value.length <= 16 && countPasswordCategories(value) >= 2;

export const isEmailValid = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
