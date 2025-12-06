'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingImage } from '@/types';
import { cn, getImageUrl } from '@/lib/utils';

interface ImageCarouselProps {
  images: ListingImage[];
  className?: string;
}

export default function ImageCarousel({ images, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn("w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg", className)}>
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className={cn("relative group w-full h-[400px] rounded-lg overflow-hidden bg-gray-100", className)}>
      <Image
        src={getImageUrl(images[currentIndex].url)}
        alt={`Listing image ${currentIndex + 1}`}
        fill
        className="object-cover"
        priority={currentIndex === 0}
        unoptimized
      />
      
      {/* Left Arrow */}
      <button
        type="button"
        aria-label="Previous slide"
        className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-4 items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors z-10" 
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* Right Arrow */}
      <button
        type="button"
        aria-label="Next slide"
        className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 right-4 items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors z-10" 
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center py-2 gap-2 z-10">
        {images.map((_, slideIndex) => (
          <button
            type="button"
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            aria-current={currentIndex === slideIndex ? 'true' : undefined}
            className={`h-2 w-2 rounded-full transition-all ${
              currentIndex === slideIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
