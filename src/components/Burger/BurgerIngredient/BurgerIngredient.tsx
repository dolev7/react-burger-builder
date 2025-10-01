import './BurgerIngredient.css'
import type { IngredientType } from '../../../types'

interface BurgerIngredientProps {
  type: IngredientType
}

const BurgerIngredient = ({ type }: BurgerIngredientProps) => {
  let ingredient = null

  switch (type) {
    case 'bread-bottom':
      ingredient = <div className="bread-bottom"></div>
      break
    case 'bread-top':
      ingredient = (
        <div className="bread-top">
          <div className="seeds1"></div>
          <div className="seeds2"></div>
          <div className="seeds1-alt1"></div>
          <div className="seeds2-alt1"></div>
          <div className="seeds1-alt2"></div>
          <div className="seeds2-alt2"></div>
        </div>
      )
      break
    case 'meat':
      ingredient = <div className="meat"></div>
      break
    case 'cheese':
      ingredient = <div className="cheese"></div>
      break
    case 'bacon':
      ingredient = <div className="bacon"></div>
      break
    case 'salad':
      ingredient = <div className="salad"></div>
      break
    default:
      ingredient = null
  }

  return ingredient
}

export default BurgerIngredient
