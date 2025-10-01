import './OrderSummary.css'
import type { Ingredients } from '../../../types'

interface OrderSummaryProps {
  ingredients: Ingredients
  price: number
  purchaseCancelled: () => void
  purchaseContinued: () => void
}

const OrderSummary = ({ ingredients, price, purchaseCancelled, purchaseContinued }: OrderSummaryProps) => {
  const ingredientSummary = Object.keys(ingredients)
    .map(ingredientKey => {
      const count = ingredients[ingredientKey as keyof typeof ingredients]
      return (
        <li key={ingredientKey}>
          <span style={{ textTransform: 'capitalize' }}>{ingredientKey}</span>: {count}
        </li>
      )
    })

  return (
    <div className="order-summary">
      <h3>Your Order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>
        {ingredientSummary}
      </ul>
      <p><strong>Total Price: ${price.toFixed(2)}</strong></p>
      <p>Continue to Checkout?</p>
      <div className="order-summary-buttons">
        <button 
          className="order-summary-button order-summary-button--cancel"
          onClick={purchaseCancelled}
        >
          CANCEL
        </button>
        <button 
          className="order-summary-button order-summary-button--continue"
          onClick={purchaseContinued}
        >
          CONTINUE
        </button>
      </div>
    </div>
  )
}

export default OrderSummary
