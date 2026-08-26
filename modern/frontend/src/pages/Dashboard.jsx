import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList.jsx';
import AddProductForm from '../components/AddProductForm.jsx';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const token = localStorage.getItem('ims_token');
    try {
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('ims_token');
        navigate('/login', { replace: true });
        return;
      }
      const data = await res.json();
      setProducts(data);
    } catch {
      setLoadError('Failed to load products.');
    }
  }

  function handleProductAdded(newProduct) {
    setProducts(prev => [...prev, newProduct]);
  }

  function handleLogout() {
    localStorage.removeItem('ims_token');
    navigate('/login', { replace: true });
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-4 bg-body rounded">
        <h4 className="mb-0">Inventory Management System</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="container">
        <AddProductForm onProductAdded={handleProductAdded} />

        <h5 className="mb-3">Product List</h5>
        {loadError && <div className="alert alert-danger">{loadError}</div>}
        <ProductList products={products} />
      </div>
    </div>
  );
}
