import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { Product } from '@shared/schema';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnails = [1, 2, 3, 4, 5];
  const priceFormatted = `${product.price_eur.toFixed(2).replace('.', ',')} €`;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      data-testid="product-detail-modal"
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
            data-testid="back-button"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
            data-testid="close-modal-button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="aspect-square bg-gray-50 flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-44 bg-amber-200 rounded-lg mx-auto flex items-center justify-center shadow-lg">
                  <span className="text-5xl text-amber-600">C</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-4 overflow-x-auto">
            {thumbnails.map((i, index) => (
              <button 
                key={i}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedImageIndex === index 
                    ? 'border-2 border-gray-900' 
                    : 'border border-gray-200 hover:border-gray-300'
                } bg-amber-50`}
                data-testid={`thumbnail-${i}`}
              >
                <span className="text-lg text-amber-600">C</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-xl font-medium text-gray-900">
              {product.name}
            </h2>
            <button
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0 text-sm font-medium"
              data-testid="visit-button"
            >
              Visit
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {product.brand} · {priceFormatted}
          </p>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Beschreibung</h3>
            <ul className="text-gray-600 text-sm leading-relaxed space-y-1">
              {product.short_bullets.map((bullet, idx) => (
                <li key={idx}>• {bullet}</li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed">
              Geschmacksnoten: {product.tasting_notes.join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
