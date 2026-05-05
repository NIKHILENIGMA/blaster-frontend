import { create } from 'zustand'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface FranchiseStore {
    saveStatus: SaveStatus
    lastSavedAt: Date | null
    setSaveStatus: (status: SaveStatus) => void
}

export const useFranchiseStore = create<FranchiseStore>((set) => ({
    saveStatus: 'idle',
    lastSavedAt: null,
    setSaveStatus: (status) =>
        set({
            saveStatus: status,
            lastSavedAt: status === 'saved' ? new Date() : null
        })
}))
