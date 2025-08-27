import React, { useState, useEffect } from 'react';
import { getItems } from '../../utilities/equipment-api';
import Button from '../Button/Button';
import './Items.module.scss';

export default function Items({ user, onAddToCart }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await getItems();
      setItems(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  };

  const handleAddToCart = async (item) => {
    try {
      // Decrement quantity in database
      await fetch(`/api/items/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ quantity: item.quantity - 1 })
      });

      // Update items page locally
      setItems(prev =>
        prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity - 1 } : i)
      );

      // Add to localStorage cart
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = savedCart.find(i => i._id === item._id);

      let updatedCart;
      if (existing) {
        updatedCart = savedCart.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedCart = [...savedCart, { ...item, quantity: 1 }];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      onAddToCart && onAddToCart(); // notify parent
    } catch (err) {
      console.error(err);
      setError('Failed to add item to cart');
    }
  };

  if (loading) return <div className="items-loading">Loading equipment...</div>;

  return (
    <div className="items-container">
      <div className="items-header">
        <h2>Equipment Catalog</h2>
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item._id} className="item-card">
            <div className="item-image">
              {item.picture ? <img src={item.picture} alt={item.name} /> : <div className="no-image">No Image</div>}
            </div>

            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <div className="item-meta">
                <p><strong>Return Policy:</strong> {item.returnPolicy}</p>
                <p><strong>Deadline:</strong> {item.deadline} day(s)</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Threshold:</strong> {item.threshold}</p>
              </div>

              {item.location && (
                <p className="item-location">
                  <strong>Location:</strong> {item.location.campus}, {item.location.building}, {item.location.classroom}
                </p>
              )}

              <div className="item-actions">
                <Button
                  variant="secondary"
                  onClick={() => window.open(`/items/${item._id}`, '_blank')}
                >
                  View Details
                </Button>
                {user && item.quantity > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="no-items">
          <p>No equipment found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
