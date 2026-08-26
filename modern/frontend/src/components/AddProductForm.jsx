import { useState } from 'react';

export default function AddProductForm({ onProductAdded }) {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    setLoading(true);
    try {
      const token = localStorage.getItem('ims_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product_name: productName,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10)
        })
      });
      const data = await res.json();
      if (res.status === 201) {
        setSuccess('Product added successfully.');
        setProductName('');
        setPrice('');
        setQuantity('');
        onProductAdded(data);
      } else {
        setError(data.error || 'Failed to add product.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Add New Product</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label htmlFor="product_name" className="form-label">Product Name</label>
              <input
                id="product_name"
                type="text"
                className="form-control"
                maxLength={30}
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. iPhone 15"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                id="price"
                type="number"
                className="form-control"
                min="0.01"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 999.99"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input
                id="quantity"
                type="number"
                className="form-control"
                min="1"
                step="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Adding…' : 'Add Item'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
