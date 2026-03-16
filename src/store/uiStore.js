import { create } from 'zustand'

export const useUiStore = create((set) => ({
  authPromptOpen: false,
  openAuthPrompt: () => set({ authPromptOpen: true }),
  closeAuthPrompt: () => set({ authPromptOpen: false }),
}))
