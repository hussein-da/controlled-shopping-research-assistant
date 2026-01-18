import { X, Check } from 'lucide-react';
import { ProductCard } from '@shared/schema';

interface AllProductsModalProps {
  products: ProductCard[];
  ratings: Record<string, 'interested' | 'not_interested' | null>;
  onClose: () => void;
  onProductClick?: (product: ProductCard) => void;
}

export function AllProductsModal({ products, ratings, onClose, onProductClick }: AllProductsModalProps) {
  const likedCount = Object.values(ratings).filter(r => r === 'interested').length;
  const notInterestedCount = Object.values(ratings).filter(r => r === 'not_interested').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-testid="all-products-modal">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">All products</h2>
            <p className="text-sm text-gray-500 mt-1">
              {likedCount} liked · {notInterestedCount} not interested
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            data-testid="close-all-products-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(85vh-88px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => {
              const rating = ratings[product.id];
              const isLiked = rating === 'interested';
              
              return (
                <div 
                  key={product.id}
                  className="relative group cursor-pointer"
                  onClick={() => onProductClick?.(product)}
                  data-testid={`product-grid-item-${product.id}`}
                >
                  {isLiked && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-700 border border-gray-200">
                      <Check className="w-3 h-3" />
                      <span>Liked</span>
                    </div>
                  )}
                  
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-3 group-hover:shadow-md transition-shadow overflow-hidden">
                    <div className="w-16 h-20 bg-amber-100 rounded flex items-center justify-center">
                      <span className="text-2xl text-amber-500">C</span>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.price} · {product.merchant}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
