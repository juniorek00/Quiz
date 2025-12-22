import React, { useEffect } from 'react';

interface AvatarModalProps {
  src: string | null;
  onClose: () => void;
}

const AvatarModal: React.FC<AvatarModalProps> = ({ src, onClose }) => {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative max-w-[90vw] max-h-[90vh] p-4">
        <img
          src={src}
          alt="Avatar"
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-[80vh] rounded-lg object-contain shadow-2xl border border-white/20"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/000/fff?text=?')}
        />
      </div>
    </div>
  );
};

export default AvatarModal;
