export default function ProductList({ products }) {
  if (!products.length) {
    return <p className="text-muted text-center">No products found.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered text-center">
        <thead className="table-primary text-uppercase">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.product_id}>
              <td>{index + 1}</td>
              <td>{product.product_name}</td>
              <td>{product.price.toLocaleString()}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
