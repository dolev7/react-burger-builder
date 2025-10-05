import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import FirestoreService from '../../services/firestoreService'
import type { Order } from '../../types'
import './Orders.css'

function Orders() {
  const [orders, setOrders] = useState<{ [key: string]: Order }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const fetchedOrders = await FirestoreService.getOrders()
        console.log('Fetched orders:', fetchedOrders) // Debug log
        
        // Filter orders to show only current user's orders
        const userOrders: { [key: string]: Order } = {}
        Object.entries(fetchedOrders).forEach(([id, order]) => {
          if (order.userId === currentUser.uid) {
            userOrders[id] = order
          }
        })
        
        console.log('User orders:', userOrders) // Debug log
        setOrders(userOrders)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError('Failed to load orders. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentUser])

  const orderArray = Object.entries(orders)
    .map(([id, order]) => ({
      id,
      ...order
    }))
    .filter(order => order && typeof order === 'object') // Filter out invalid orders
  
  console.log('Processed order array:', orderArray) // Debug log

  if (loading) {
    return (
      <div className="orders">
        <div className="orders-container">
          <h2>Your Orders</h2>
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders">
        <div className="orders-container">
          <h2>Your Orders</h2>
          <div className="orders-error">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="orders">
      <div className="orders-container">
        <h2>Your Orders</h2>
        
        {orderArray.length === 0 ? (
          <div className="orders-placeholder">
            <div className="placeholder-icon">🍔</div>
            <h3>No orders yet</h3>
            <p>Start building your first burger to see orders here.</p>
          </div>
        ) : (
          <div className="orders-list">
            <p className="orders-count">
              You have {orderArray.length} order{orderArray.length !== 1 ? 's' : ''}
            </p>
            
            {orderArray.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-header">
                  <h3>Order #{order.id.slice(-6)}</h3>
                  <span className="order-price">
                    ${(order.price || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="order-ingredients">
                  <h4>Ingredients:</h4>
                  <div className="ingredients-list">
                    {order.ingredients && Object.entries(order.ingredients).map(([ingredient, count]) => (
                      count > 0 && (
                        <span key={ingredient} className="ingredient-item">
                          {ingredient}: {count}
                        </span>
                      )
                    ))}
                  </div>
                </div>
                
                <div className="order-customer">
                  <h4>Delivery Details:</h4>
                  <p><strong>Name:</strong> {order.customer?.name || 'Unknown'}</p>
                  <p><strong>Email:</strong> {order.customer?.email || 'No email'}</p>
                  <p><strong>Address:</strong> 
                    {order.customer?.address ? 
                      `${order.customer.address.street}, ${order.customer.address.zipCode}, ${order.customer.address.country}` : 
                      'No address provided'
                    }
                  </p>
                  <p><strong>Delivery:</strong> {order.customer?.deliveryMethod === 'fastest' ? 'Fastest' : 'Cheapest'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
