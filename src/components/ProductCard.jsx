import 'react';
import { ExternalLink, Tag, Activity, Clock } from 'lucide-react';
import { getAffiliateLink } from '../utils/affiliate';

const ProductCard = ({ product }) => {
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0];

  const timeAgo = (dateString) => {
    if (!dateString) return null;
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-4 flex flex-col h-full">
        <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isLive && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-tighter">
                <Activity className="w-3 h-3" /> Live
              </span>
            )}
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Tag className="w-3 h-3" />
              Best: ₹{lowestPrice.price.toLocaleString()}
            </span>
          </div>
          {product.lastUpdated && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {timeAgo(product.lastUpdated)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-4 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>

          <div className="space-y-2">
            {sortedPrices.map((priceOption, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                  priceOption === lowestPrice
                    ? 'bg-green-50 border-green-200 shadow-sm'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">{priceOption.store}</span>
                  <span className={`text-sm font-bold ${priceOption === lowestPrice ? 'text-green-700' : 'text-gray-900'}`}>
                    ₹{priceOption.price.toLocaleString()}
                  </span>
                </div>
                <a
                  href={getAffiliateLink(priceOption.url, priceOption.store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    priceOption === lowestPrice
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Buy <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
