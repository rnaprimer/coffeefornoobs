import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface ProductSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string) => void;
}

export function ProductSelectorModal({ isOpen, onClose, onConfirm }: ProductSelectorModalProps) {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen && products.length === 0) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    if (!supabase) return;
    let req = supabase.from('products').select('*');
    if (query) {
      req = req.ilike('name', `%${query}%`);
    } else {
      req = req.order('created_at', { ascending: false }).limit(20);
    }

    const { data } = await req;
    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (isOpen) {
        fetchProducts(search);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-brand-white w-full max-w-4xl h-[80vh] border-4 border-brand-dark shadow-[8px_8px_0px_#111111] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-brand-dark">
          <h2 className="font-black text-xl uppercase tracking-widest">Select Product</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border-2 border-brand-dark rounded-full hover:bg-brand-pink transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b-4 border-brand-dark bg-gray-50">
          <div className="flex-1 flex gap-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-2 pl-10 border-2 border-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-brand-pink mb-4" />
              <p className="font-bold">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <p className="font-bold">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`relative p-4 border-4 cursor-pointer bg-brand-white flex items-center gap-4 transition-transform duration-200 
                    ${selectedId === p.id ? 'border-brand-pink shadow-inner' : 'border-brand-dark shadow-[4px_4px_0px_#111111] hover:-translate-y-1'}`}
                >
                  <div className="w-16 h-16 relative flex-shrink-0 border-2 border-brand-dark overflow-hidden">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} fill className="object-cover" unoptimized={p.image_url.startsWith('http')} />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight line-clamp-2">{p.name}</h3>
                    {p.price && <p className="text-sm font-medium text-brand-pink">${(p.price / 100).toFixed(2)}</p>}
                  </div>
                  
                  {selectedId === p.id && (
                    <div className="absolute top-2 right-2 z-10 bg-brand-pink text-white w-6 h-6 flex items-center justify-center rounded-full border-2 border-brand-dark">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-4 border-brand-dark bg-brand-white flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 font-bold uppercase tracking-widest border-2 border-brand-dark hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => selectedId && onConfirm(selectedId)}
            disabled={!selectedId}
            className="px-6 py-2 font-bold uppercase tracking-widest border-2 border-brand-dark bg-brand-lime hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select Product
          </button>
        </div>

      </div>
    </div>
  );
}
