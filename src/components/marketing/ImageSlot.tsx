import type { BrandImageSource } from './brandImages';

interface ImageSlotProps {
  image: BrandImageSource;
  priority?: boolean;
  className?: string;
}

export function ImageSlot({ image, priority = false, className }: ImageSlotProps) {
  return (
    <picture className={className ? `brand-picture ${className}` : 'brand-picture'}>
      <source srcSet={image.webp} type="image/webp" />
      <img
        src={image.png}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}
