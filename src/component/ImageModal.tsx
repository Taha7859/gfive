"use client"
import { X } from "lucide-react";
import Image from "next/image";
type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
};

export default function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-4 max-w-3xl w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-red-500"
        >
          <X size={24} />
        </button>

        {/* Image */}
        
<Image
  src={imageUrl} // yaha aapki dynamic ya static image ka URL
  alt="Selected"
  width={800}     // width specify karna mandatory hai
  height={600}    // height specify karna mandatory hai
  className="rounded-lg object-cover w-full h-auto"
/>

        {/* Customize Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => alert("Customize ka form yahan link hoga")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}
