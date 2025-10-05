import { collection, addDoc, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Order, Ingredients, IngredientDefinition } from '../types';
import ingredientsConfig from '../config/ingredients.json';

export class FirestoreService {
  // Submit order to Firestore
  static async createOrder(orderData: Order): Promise<{ id: string }> {
    try {
      const docRef = await addDoc(collection(db, 'burger-db'), orderData);
      return { id: docRef.id };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order. Please try again.');
    }
  }

  // Get all orders from Firestore
  static async getOrders(): Promise<{ [key: string]: Order }> {
    try {
      const querySnapshot = await getDocs(collection(db, 'burger-db'));
      const orders: { [key: string]: Order } = {};
      
      querySnapshot.forEach((doc) => {
        orders[doc.id] = doc.data() as Order;
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders.');
    }
  }

  // Get order by ID from Firestore
  static async getOrder(orderId: string): Promise<Order> {
    try {
      const docRef = doc(db, 'burger-db', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as Order;
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order.');
    }
  }

  // Get ingredients from single document
  static async getIngredients(): Promise<IngredientDefinition[]> {
    try {
      const docRef = doc(db, 'config', 'ingredients');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const ingredients: IngredientDefinition[] = [];
        
        // Convert document fields to ingredient definitions
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          if (value && typeof value === 'object') {
            ingredients.push({
              id: key,
              name: key,
              displayName: value.displayName || key,
              price: value.price || 0,
              type: value.type || 'salad',
              available: value.available !== false, // default to true
              order: value.order || 0
            });
          }
        });
        
        // Sort by order
        return ingredients.sort((a, b) => a.order - b.order);
      } else {
        // Document doesn't exist, create it
        await this.initializeIngredients();
        return this.getIngredients(); // Recursive call after initialization
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw new Error('Failed to fetch ingredients.');
    }
  }

  // Initialize default ingredients in single document
  static async initializeIngredients(): Promise<void> {
    try {
      // Use the imported JSON configuration
      const ingredientsData = ingredientsConfig;

      const docRef = doc(db, 'config', 'ingredients');
      await setDoc(docRef, ingredientsData);
      
    } catch (error) {
      console.error('Error initializing ingredients:', error);
      throw new Error('Failed to initialize ingredients.');
    }
  }

  // Calculate order price using dynamic ingredient prices
  static calculatePrice(ingredients: Ingredients, ingredientDefinitions: IngredientDefinition[]): number {
    const BASE_PRICE = 4; // Base price for bread
    
    const ingredientPrice = Object.entries(ingredients).reduce(
      (total, [ingredientName, count]) => {
        const ingredientDef = ingredientDefinitions.find(def => def.name === ingredientName);
        const price = ingredientDef?.price || 0;
        return total + (price * count);
      },
      0
    );
    
    return BASE_PRICE + ingredientPrice;
  }
}

export default FirestoreService;
