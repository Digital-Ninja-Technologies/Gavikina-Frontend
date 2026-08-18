interface ImageSlotProps {
  src: string;
  placeholder: string;
  credit?: string;
  creditHref?: string;
  alt?: string;
}

// Static React equivalent of the design's <image-slot> custom element:
// a full-bleed photo with a small bottom-left attribution overlay.
export default function ImageSlot({ src, placeholder, credit, creditHref, alt }: ImageSlotProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <img
        src={src}
        alt={alt || placeholder}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {credit && (
        <div
          style={{
            position: 'absolute',
            left: 10,
            bottom: 10,
            fontSize: 10.5,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,.85)',
            background: 'rgba(16,19,40,.45)',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            borderRadius: 20,
            pointerEvents: 'auto',
          }}
        >
          {creditHref ? (
            <a href={creditHref} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
              {credit}
            </a>
          ) : (
            credit
          )}
        </div>
      )}
    </div>
  );
}
