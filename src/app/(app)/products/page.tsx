import type { NextPage } from 'next';
import { ProductsClient } from './components/products-client';

const ProductsPage: NextPage = () => {
  return (
    <div className="container mx-auto">
      <ProductsClient />
    </div>
  );
};

export default ProductsPage;
