import { Type } from "./actionType";

export const initialState = {
  cart: [],
  savedForLater: [],
  loading: false,
  error: null,
  products: [],
  productDetail: null,
  user: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case Type.ADD_TO_CART:
      // Safety check: ensure action.item exists
      if (!action.item || !action.item.id) return state;

      const existingItem = state.cart.find(
        (item) => item.id === action.item.id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.item, quantity: 1 }],
        };
      }

    case Type.REMOVE_FROM_CART:
      // Safety check: ensure action.id exists
      if (action.id === undefined) return state;
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.id),
      };

    case Type.INCREMENT_QUANTITY:
      if (action.id === undefined) return state;
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case Type.DECREMENT_QUANTITY:
      if (action.id === undefined) return state;
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };

    case Type.SAVE_FOR_LATER:
      if (!action.item || !action.item.id) return state;
      const itemToSave = state.cart.find((item) => item.id === action.item.id);
      if (!itemToSave) return state;

      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.item.id),
        savedForLater: [...state.savedForLater, { ...itemToSave }],
      };

    case Type.EMPTY_CART: // NEW CASE ADDED HERE
      return {
        ...state,
        cart: [],
      };

    case Type.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case Type.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case Type.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    case Type.SET_PRODUCT_DETAIL:
      return {
        ...state,
        productDetail: action.payload,
      };

    case Type.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case Type.LOGOUT_USER:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};
