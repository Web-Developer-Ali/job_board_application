import React, { useRef } from 'react';
import Image from 'next/image';
import { Pen } from 'lucide-react';

const Avatar = ({ src, alt, onImageChange }: { src: string; alt: string; onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <Image
        onClick={handleClick}
        className="h-24 w-24 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer transition-transform transform hover:scale-105"
        width={70}
        height={70}
        src={src}
        alt={alt}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onImageChange}
        style={{ display: 'none' }}
      />
      <div
        onClick={handleClick}
        className="absolute bottom-0 right-0 bg-white dark:bg-black p-1 rounded-full shadow-md cursor-pointer transition-transform transform hover:scale-105"
      >
        <Pen className="text-black dark:text-gray-300 h-5 w-5" />
      </div>
    </div>
  );
};

export default Avatar;
