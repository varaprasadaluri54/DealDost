import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import LoadingSpinner from './components/LoadingSpinner';
import { products as initialProducts } from './data/products';
import { productService } from './services/productService';
import { AlertCircle, RefreshCw } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [displayProducts, setDisplayProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['All', ...new Set(initialProducts.map(p => p.category))];

  const fetchLiveProducts = useCallback(async (query, cat) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await productService.searchProducts(query, cat);
      setDisplayProducts(results);
      setIsLive(results.length > 0 && results[0].isLive);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLiveProducts(searchTerm, category);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, category, fetchLiveProducts]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-left">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Compare Prices</h2>
              {isLoading && <LoadingSpinner size="small" />}
              {!isLoading && (
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                  isLive
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {isLive ? 'Live Mode' : 'Simulated Data'}
                </span>
              )}
            </div>
            <p className="text-gray-600">Get the best deals from top online stores with live tracking</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
            <button 
              onClick={() => fetchLiveProducts(searchTerm, category)}
              className="ml-auto text-sm font-bold flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : isLoading && displayProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner />
            <p className="mt-4 text-gray-500 font-medium">Fetching live prices from stores...</p>
          </div>
        ) : displayProducts.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 DealDost. All rights reserved. Affiliate links may earn us a commission.
          </p>
          <p className="text-gray-400 text-xs mt-1">Live data is simulated for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
