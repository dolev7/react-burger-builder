
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Burger from '../Burger/Burger'
import BuildControls from '../Burger/BuildControls/BuildControls'
import Modal from '../UI/Modal/Modal'
import OrderSummary from '../Burger/OrderSummary/OrderSummary'
import type { Ingredients, IngredientDefinition } from '../../types'
import FirestoreService from '../../services/firestoreService'

const BurgerBuilder = () => {
  const [ingredients, setIngredients] = useState<Ingredients>({})
  const [ingredientDefinitions, setIngredientDefinitions] = useState<IngredientDefinition[]>([])
  const [totalPrice, setTotalPrice] = useState(4) // Base price for bread
  const [purchasable, setPurchasable] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Fetch ingredients from database on component mount
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const ingredientDefs = await FirestoreService.getIngredients()
        
        if (ingredientDefs.length === 0) {
          // Initialize default ingredients if none exist
          await FirestoreService.initializeIngredients()
          const newIngredientDefs = await FirestoreService.getIngredients()
          setIngredientDefinitions(newIngredientDefs)
        } else {
          setIngredientDefinitions(ingredientDefs)
        }
        
        // Initialize ingredients state with 0 values, but meat with 1 (minimum requirement)
        const initialIngredients: Ingredients = {}
        ingredientDefs.forEach(def => {
          initialIngredients[def.name] = def.name === 'meat' ? 1 : 0
        })
        
        setIngredients(initialIngredients)
        
        // Calculate initial price
        const initialPrice = FirestoreService.calculatePrice(initialIngredients, ingredientDefs)
        setTotalPrice(initialPrice)
        setPurchasable(true) // We have meat, so it's purchasable
        
      } catch (err) {
        console.error('Failed to fetch ingredients:', err)
        setError('Failed to load ingredients. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchIngredients()
  }, [])

  const updatePurchaseState = (updatedIngredients: Ingredients) => {
    const sum = Object.values(updatedIngredients).reduce((sum: number, el: number) => sum + el, 0)
    setPurchasable(sum > 0)
  }

  const addIngredientHandler = (type: string) => {
    const oldCount = ingredients[type] || 0
    const updatedCount = oldCount + 1
    const updatedIngredients = {
      ...ingredients,
      [type]: updatedCount
    }
    setIngredients(updatedIngredients)
    updatePurchaseState(updatedIngredients)
    
    // Calculate new price using dynamic ingredient definitions
    const newPrice = FirestoreService.calculatePrice(updatedIngredients, ingredientDefinitions)
    setTotalPrice(newPrice)
  }

  const removeIngredientHandler = (type: string) => {
    const oldCount = ingredients[type] || 0
    if (oldCount <= 0) {
      return
    }
    
    // Prevent removing the last meat - must always have at least 1 meat
    if (type === 'meat' && (ingredients.meat || 0) <= 1) {
      return // Must keep at least 1 meat
    }
    
    const updatedCount = oldCount - 1
    const updatedIngredients = {
      ...ingredients,
      [type]: updatedCount
    }
    setIngredients(updatedIngredients)
    updatePurchaseState(updatedIngredients)
    
    // Calculate new price using dynamic ingredient definitions
    const newPrice = FirestoreService.calculatePrice(updatedIngredients, ingredientDefinitions)
    setTotalPrice(newPrice)
  }

  const purchaseHandler = () => {
    setPurchasing(true)
  }


  const purchaseCancelHandler = () => {
    setPurchasing(false)
  }

  const purchaseContinueHandler = async () => {
    if (!currentUser) {
      alert('Please sign in to place an order');
      navigate('/auth');
      return;
    }

    const orderData = {
      ingredients: ingredients,
      price: totalPrice,
      userId: currentUser.uid, // Associate order with current user
      userEmail: currentUser.email || undefined, // Store user email for reference
      customer: {
        name: currentUser.displayName || 'Customer',
        email: currentUser.email || 'no-email@example.com',
        address: {
          street: 'Address to be provided',
          zipCode: '00000',
          country: 'To be specified'
        },
        deliveryMethod: 'fastest' as const
      },
      createdAt: new Date().toISOString() // Add timestamp
    };

    try {
      const result = await FirestoreService.createOrder(orderData);
      console.log('Order created successfully:', result.id);
      setPurchasing(false);
      
      // Reset burger builder
      const initialIngredients: Ingredients = {}
      ingredientDefinitions.forEach(def => {
        initialIngredients[def.name] = def.name === 'meat' ? 1 : 0
      })
      setIngredients(initialIngredients)
      const initialPrice = FirestoreService.calculatePrice(initialIngredients, ingredientDefinitions)
      setTotalPrice(initialPrice)
      
      // Redirect to orders page to see the new order
      navigate('/orders');
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Order submission failed. Please try again.');
    }
  }

  const disabledInfo: { [key: string]: boolean } = {}
  for (let key in ingredients) {
    const ingredientCount = ingredients[key] || 0
    if (key === 'meat') {
      // Disable meat removal if there's only 1 meat left
      disabledInfo[key] = ingredientCount <= 1
    } else {
      // For other ingredients, disable if count is 0
      disabledInfo[key] = ingredientCount <= 0
    }
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading ingredients...</h2>
        <p>Please wait while we prepare your burger builder.</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#8f5c2c', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        <OrderSummary 
          ingredients={ingredients}
          price={totalPrice}
          purchaseCancelled={purchaseCancelHandler}
          purchaseContinued={purchaseContinueHandler}
        />
      </Modal>
      <Burger ingredients={ingredients} />
      <BuildControls
        ingredientAdded={addIngredientHandler}
        ingredientRemoved={removeIngredientHandler}
        disabled={disabledInfo}
        price={totalPrice}
        purchasable={purchasable}
        ordered={purchaseHandler}
        ingredientDefinitions={ingredientDefinitions}
      />
    </>
  )
}

export default BurgerBuilder
