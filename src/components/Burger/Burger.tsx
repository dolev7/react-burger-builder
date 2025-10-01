import './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'
import type { Ingredients } from '../../types'

interface BurgerProps {
  ingredients: Ingredients
}

const Burger = ({ ingredients }: BurgerProps) => {
  // Transform ingredients object into array of components
  let transformedIngredients = Object.keys(ingredients)
    .map(ingredientKey => {
      return [...Array(ingredients[ingredientKey as keyof typeof ingredients])].map((_, i) => {
        return <BurgerIngredient key={ingredientKey + i} type={ingredientKey as any} />
      })
    })
    .reduce((arr, el) => {
      return arr.concat(el)
    }, [])
    console.log(transformedIngredients)

  // Show message if no ingredients
  if (transformedIngredients.length === 0) {
    transformedIngredients = [<p key="empty">Please start adding ingredients!</p>]
  }

  return (
    <div className="burger">
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  )
}

export default Burger
