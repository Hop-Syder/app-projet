import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  basePrice: number;
  quantity: number;
  weight?: number; // en grammes
  weightType?: 'fixed' | 'variable';
  estimatedAmount?: number; // pour poids variable
  cutOption?: string;
  packagingOption?: string;
  seasoningId?: string;
  seasoningName?: string;
  accompanimentIds?: string[];
  accompaniments?: Array<{ id: string; name: string; price: number }>;
  beverageId?: string;
  beverageName?: string;
  extras?: Array<{ id: string; name: string; price: number }>;
  consumptionMode?: 'delivery' | 'pickup' | 'dine_in';
  restaurantId?: string;
  restaurantName?: string;
  tableId?: string;
}

interface CartState {
  items: CartItem[];
  consumptionMode: 'delivery' | 'pickup' | 'dine_in' | null;
  deliveryAddressId?: string;
  restaurantId?: string;
  tableId?: string;
  deliverySlotId?: string;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setConsumptionMode: (mode: 'delivery' | 'pickup' | 'dine_in' | null) => void;
  setDeliveryAddress: (addressId: string) => void;
  setRestaurant: (restaurantId: string, tableId?: string) => void;
  setDeliverySlot: (slotId: string) => void;
  
  // Calculated
  subtotal: () => number;
  totalItems: () => number;
  isEmpty: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      consumptionMode: null,
      deliveryAddressId: undefined,
      restaurantId: undefined,
      tableId: undefined,
      deliverySlotId: undefined,

      addItem: (item) => {
        set((state) => {
          // Vérifier si le produit existe déjà avec les mêmes options
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.weight === item.weight &&
              i.cutOption === item.cutOption &&
              i.seasoningId === item.seasoningId &&
              JSON.stringify(i.accompanimentIds) === JSON.stringify(item.accompanimentIds)
          );

          if (existingIndex > -1) {
            // Mettre à jour la quantité
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity,
            };
            return { items: updatedItems };
          }

          // Ajouter comme nouvel item
          return {
            items: [
              ...state.items,
              { ...item, id: crypto.randomUUID() },
            ],
          };
        });
      },

      updateItem: (itemId, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          consumptionMode: null,
          deliveryAddressId: undefined,
          restaurantId: undefined,
          tableId: undefined,
          deliverySlotId: undefined,
        });
      },

      setConsumptionMode: (mode) => {
        set({ consumptionMode: mode });
      },

      setDeliveryAddress: (addressId) => {
        set({ deliveryAddressId: addressId });
      },

      setRestaurant: (restaurantId, tableId) => {
        set({ restaurantId, tableId });
      },

      setDeliverySlot: (slotId) => {
        set({ deliverySlotId: slotId });
      },

      subtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let itemTotal = item.basePrice * item.quantity;
          
          // Ajouter les options
          if (item.accompaniments) {
            itemTotal += item.accompaniments.reduce((sum, acc) => sum + acc.price, 0);
          }
          if (item.extras) {
            itemTotal += item.extras.reduce((sum, extra) => sum + extra.price, 0);
          }
          
          return total + itemTotal;
        }, 0);
      },

      totalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      isEmpty: () => {
        return get().items.length === 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
