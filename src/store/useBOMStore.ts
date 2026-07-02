import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BOMItem {
  id: string;
  name: string;
  image_url: string | null;
  quantity: number;
  category?: string;
  specs?: Record<string, unknown>;
  shopee_link?: string;
}

interface BOMState {
  items: BOMItem[];
  addItem: (item: Omit<BOMItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBOM: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isProjectStudioOpen: boolean;
  setIsProjectStudioOpen: (isOpen: boolean) => void;
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  setItems: (items: BOMItem[]) => void;
}

export const useBOMStore = create<BOMState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      isProjectStudioOpen: false,
      currentProjectId: null,
      setCurrentProjectId: (currentProjectId) => set({ currentProjectId }),
      setItems: (items) => set({ items }),
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      clearBOM: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      setIsProjectStudioOpen: (isProjectStudioOpen) => set({ isProjectStudioOpen }),
    }),
    {
      name: 'bom-storage',
    }
  )
);
