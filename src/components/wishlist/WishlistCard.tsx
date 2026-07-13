import Link from 'next/link';
import Image from 'next/image';
import { RemoveWishlistButton } from './RemoveWishlistButton';

interface WishlistCardProps {
  item: any; // data from getWishlistProducts or getWishlistBeans
}

export function WishlistCard({ item }: WishlistCardProps) {
  const isProduct = item.entity_type === 'product';
  const data = item.data; // product or bean data
  
  if (!data) return null; // Defensive check
  
  const title = data.name;
  const href = isProduct ? `/gear/${data.slug}` : `/beans/${data.slug}`;
  const imageUrl = data.image_url || '/placeholder-image.jpg';
  
  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={href} className="absolute inset-0 z-0" />
      
      {/* Top Image Section */}
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Remove Button Overlay */}
        <div className="absolute top-2 right-2 z-10">
          <RemoveWishlistButton entityType={item.entity_type} entityId={item.entity_id} />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs font-medium text-amber-600 mb-1">
          {isProduct ? 'Gear' : 'Coffee Beans'}
        </div>
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between z-10">
          <span className="font-bold text-neutral-900">
            {data.price ? `₹${data.price}` : 'Price unavailable'}
          </span>
          <Link 
            href={href}
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
