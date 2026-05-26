import 'react';
import { Search, ShoppingCart } from 'lucide-react';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-2 rounded-lg">
            <ShoppingCart className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 m-0">DealDost</h1>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Search for products (Amazon, Flipkart, etc.)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="hidden md:block">
          <span className="text-sm text-gray-500">Your shopping friend for the best deals</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
