import { create } from "zustand"

type UiState = {
  activeSection: string
  selectedSystem: string
  selectedCadSubsystem: string
  cadViewMode: "full" | "powertrain"
  mobileNavOpen: boolean
  noteDialogOpen: boolean
  setActiveSection: (section: string) => void
  setSelectedSystem: (system: string) => void
  setSelectedCadSubsystem: (subsystem: string) => void
  setCadViewMode: (mode: "full" | "powertrain") => void
  setMobileNavOpen: (open: boolean) => void
  setNoteDialogOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  activeSection: "hero",
  selectedSystem: "super-structure",
  selectedCadSubsystem: "full",
  cadViewMode: "full",
  mobileNavOpen: false,
  noteDialogOpen: false,
  setActiveSection: (activeSection) => set({ activeSection }),
  setSelectedSystem: (selectedSystem) => set({ selectedSystem }),
  setSelectedCadSubsystem: (selectedCadSubsystem) =>
    set({ selectedCadSubsystem }),
  setCadViewMode: (cadViewMode) => set({ cadViewMode }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setNoteDialogOpen: (noteDialogOpen) => set({ noteDialogOpen }),
}))
