import { RegisterFormData } from "@/lib/validation-schemas";
import { create } from "zustand";

type RegisterFormState = Partial<RegisterFormData> & {
  setData: (data: Partial<RegisterFormData>) => void;
};

export const useUserStore = create<RegisterFormState>((set) => ({
  setData: (data) => set(data),
}));