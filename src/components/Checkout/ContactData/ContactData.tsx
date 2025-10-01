import { useForm } from 'react-hook-form'
import type { Ingredients } from '../../../types'
import './ContactData.css'

interface ContactDataProps {
  ingredients: Ingredients
  totalPrice: number
  onOrderSubmit: (orderData: CustomerData) => void
  loading?: boolean
}

export interface CustomerData {
  name: string
  email: string
  address: {
    street: string
    zipCode: string
    country: string
  }
  deliveryMethod: 'fastest' | 'cheapest'
}

function ContactData({ ingredients, totalPrice, onOrderSubmit, loading }: ContactDataProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CustomerData>({
    defaultValues: {
      deliveryMethod: 'fastest'
    }
  })

  const onSubmit = (data: CustomerData) => {
    onOrderSubmit(data)
  }

  return (
    <div className="contact-data">
      <h4>Enter your Contact Data</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
        
        {/* Name Field */}
        <div className="form-group">
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            placeholder="Your Name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Please enter a valid email address'
              }
            })}
            type="email"
            placeholder="Your Email"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        {/* Street Address */}
        <div className="form-group">
          <input
            {...register('address.street', {
              required: 'Street address is required',
              minLength: {
                value: 5,
                message: 'Please enter a complete address'
              }
            })}
            placeholder="Street Address"
            className={errors.address?.street ? 'error' : ''}
          />
          {errors.address?.street && <span className="error-message">{errors.address.street.message}</span>}
        </div>

        {/* Zip Code */}
        <div className="form-group">
          <input
            {...register('address.zipCode', {
              required: 'Zip code is required',
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: 'Please enter a valid zip code (12345 or 12345-6789)'
              }
            })}
            placeholder="Zip Code"
            className={errors.address?.zipCode ? 'error' : ''}
          />
          {errors.address?.zipCode && <span className="error-message">{errors.address.zipCode.message}</span>}
        </div>

        {/* Country */}
        <div className="form-group">
          <select
            {...register('address.country', {
              required: 'Please select a country'
            })}
            className={errors.address?.country ? 'error' : ''}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
          </select>
          {errors.address?.country && <span className="error-message">{errors.address.country.message}</span>}
        </div>

        {/* Delivery Method */}
        <div className="form-group">
          <label>Delivery Method:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                {...register('deliveryMethod')}
                type="radio"
                value="fastest"
              />
              Fastest (Extra $5)
            </label>
            <label className="radio-label">
              <input
                {...register('deliveryMethod')}
                type="radio"
                value="cheapest"
              />
              Cheapest
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h5>Order Summary:</h5>
          <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="order-button"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? 'Placing Order...' : 'ORDER NOW'}
        </button>
      </form>
    </div>
  )
}

export default ContactData
