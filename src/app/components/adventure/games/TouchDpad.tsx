import { useCallback } from 'react';
import { motion } from 'motion/react';

interface TouchDpadProps {
  onDirection: (dir: string, pressed: boolean) => void;
  layout: 'cross' | 'horizontal';
  shootButton?: boolean;
}

const BTN_STYLE = {
  background: 'rgba(110,231,255,0.08)',
  border: '1px solid rgba(110,231,255,0.2)',
  color: '#6EE7FF',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  userSelect: 'none' as const,
  touchAction: 'none' as const,
};

function DpadBtn({ dir, label, onDir }: { dir: string; label: string; onDir: (d: string, p: boolean) => void }) {
  return (
    <motion.button
      onPointerDown={(e) => { e.preventDefault(); onDir(dir, true); }}
      onPointerUp={() => onDir(dir, false)}
      onPointerLeave={() => onDir(dir, false)}
      whileActive={{ scale: 0.92, background: 'rgba(110,231,255,0.2)' } as never}
      style={{ ...BTN_STYLE, width: 44, height: 44, fontSize: '16px' }}
    >
      {label}
    </motion.button>
  );
}

export function TouchDpad({ onDirection, layout, shootButton }: TouchDpadProps) {
  const handle = useCallback((dir: string, pressed: boolean) => {
    onDirection(dir, pressed);
  }, [onDirection]);

  if (layout === 'horizontal') {
    return (
      <div className="flex items-center justify-center gap-3 mt-2 shrink-0">
        <DpadBtn dir="left" label="◀" onDir={handle} />
        {shootButton && (
          <DpadBtn dir="up" label="▲" onDir={handle} />
        )}
        <DpadBtn dir="right" label="▶" onDir={handle} />
      </div>
    );
  }

  // Cross layout for snake
  return (
    <div className="shrink-0 mt-2">
      <div className="flex justify-center mb-1">
        <DpadBtn dir="up" label="▲" onDir={handle} />
      </div>
      <div className="flex justify-center gap-2 mb-1">
        <DpadBtn dir="left" label="◀" onDir={handle} />
        <div style={{ width: 44, height: 44 }} />
        <DpadBtn dir="right" label="▶" onDir={handle} />
      </div>
      <div className="flex justify-center">
        <DpadBtn dir="down" label="▼" onDir={handle} />
      </div>
    </div>
  );
}
