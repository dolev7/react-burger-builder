import './BuildControls.css'
import BuildControl from './BuildControl/BuildControl'
import type { IngredientDefinition } from '../../../types'

interface BuildControlsProps {
  ingredientAdded: (type: string) => void
  ingredientRemoved: (type: string) => void
  disabled: { [key: string]: boolean }
  price: number
  purchasable: boolean
  ordered: () => void
  ingredientDefinitions?: IngredientDefinition[]
}

const BuildControls = ({ ingredientAdded, ingredientRemoved, disabled, price, purchasable, ordered, ingredientDefinitions = [] }: BuildControlsProps) => {
  return (
    <div className="build-controls">
      <p>Current Price: <strong>${price.toFixed(2)}</strong></p>
      {ingredientDefinitions.map(ingredient => (
        <BuildControl
          key={ingredient.id}
          label={ingredient.displayName}
          added={() => ingredientAdded(ingredient.name)}
          removed={() => ingredientRemoved(ingredient.name)}
          disabled={disabled[ingredient.name]}
        />
      ))}
      <button 
        className="order-button"
        disabled={!purchasable}
        onClick={ordered}
      >
        ORDER NOW
      </button>
    </div>
  )
}

export default BuildControls
