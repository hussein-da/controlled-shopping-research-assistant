import { X } from 'lucide-react';
import { ProductCard } from '@shared/schema';

interface ProductDetailModalProps {
  product: ProductCard;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      data-testid="product-detail-modal"
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10"
            data-testid="close-modal-button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-44 bg-amber-200 rounded-lg mx-auto mb-2 flex items-center justify-center shadow-lg">
                  <span className="text-5xl text-amber-600">C</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-4 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  i === 1 ? 'border-2 border-gray-900' : 'border border-gray-200'
                } bg-amber-50`}
              >
                <span className="text-lg text-amber-600">C</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-1">
                {product.title}
              </h2>
              <p className="text-gray-500">
                {product.merchant} • {product.price}
              </p>
            </div>
            <button
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0"
              data-testid="visit-button"
            >
              Visit
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Excellent brewing combined with a unique and elegant design, inspired by a coffee bean. 
              Handcrafted in Italy from high-quality materials, this product represents the perfect 
              blend of style and functionality for coffee enthusiasts who appreciate both aesthetics 
              and performance.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <p className="text-xs text-gray-400 text-center">
            ChatGPT kann Fehler machen. Überprüfe wichtige Informationen. Siehe Cookie-Voreinstellungen.
          </p>
        </div>
      </div>
    </div>
  );
}
