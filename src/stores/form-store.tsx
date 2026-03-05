import { RegisterFormData } from "@/lib/validation-schemas";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthFlow = "signup" | "login" | null;
export type AuthStep = "form" | "otp";

type RegisterFormState = Partial<RegisterFormData> & {
  setData: (data: Partial<RegisterFormData>) => void;
  authFlow: AuthFlow;
  authStep: AuthStep;
  setAuthStep: (step: AuthStep) => void;
  setAuthFlow: (flow: AuthFlow) => void;
  clearAuthState: () => void;
};

const initialAuthState = {
  authFlow: null as AuthFlow,
  authStep: "form" as AuthStep,
};

export const useUserStore = create<RegisterFormState>()(
  persist(
    (set) => ({
      ...initialAuthState,
      setData: (data) => set(data),
      setAuthStep: (authStep) => set({ authStep }),
      setAuthFlow: (authFlow) => set({ authFlow }),
      clearAuthState: () =>
        set({
          email: undefined,
          password: undefined,
          name: undefined,
          confirmPassword: undefined,
          ...initialAuthState,
        }),
    }),
    {
      name: "pep-gallery-auth-form",
      // localStorage survives tab kill/restore on mobile (sessionStorage does not)
      storage: createJSONStorage<
        Partial<RegisterFormState> & { authFlow: AuthFlow; authStep: AuthStep }
      >(() =>
        typeof window !== "undefined"
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        email: state.email,
        name: state.name,
        password: state.password,
        confirmPassword: state.confirmPassword,
        authFlow: state.authFlow,
        authStep: state.authStep,
      }),
    }
  )
);
