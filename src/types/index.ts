// Shared types for the burger application

// Dynamic ingredient definition from database
export interface IngredientDefinition {
  id: string
  name: string
  displayName: string
  price: number
  type: 'bread-bottom' | 'bread-top' | 'meat' | 'cheese' | 'bacon' | 'salad'
  available: boolean
  order: number // For display ordering
}

// Dynamic ingredients object (key-value pairs)
export interface Ingredients {
  [key: string]: number
}

export interface Order {
  ingredients: Ingredients
  price: number
  customer: {
    name: string
    email: string
    address: {
      street: string
      zipCode: string
      country: string
    }
    deliveryMethod: 'fastest' | 'cheapest'
  }
}

export type IngredientType = 'bread-bottom' | 'bread-top' | 'meat' | 'cheese' | 'bacon' | 'salad'

// Dynamic ingredient prices (key-value pairs)
export interface IngredientPrices {
  [key: string]: number
}
