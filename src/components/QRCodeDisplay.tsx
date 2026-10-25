import React from 'react';

interface QRCodeDisplayProps {
  token: string;
  size?: number;
  label?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  token,
  size = 180,
  label = 'SCAN TO VERIFY BOOKING'
}) => {
  // Deterministic pattern generator based on token string hash
  const generateMatrix = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    const gridSize = 21;
    const matrix: boolean[][] = Array(gridSize)
      .fill(false)
      .map(() => Array(gridSize).fill(false));

    // Corner finder patterns (7x7)
    const setFinder = (startRow: number, startCol: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[startRow + r][startCol + c] = true;
          }
        }
      }
    };

    setFinder(0, 0); // Top Left
    setFinder(0, gridSize - 7); // Top Right
    setFinder(gridSize - 7, 0); // Bottom Left

    // Fill data area pseudo-randomly based on string
    let seed = Math.abs(hash);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder pattern zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= gridSize - 8;
        const inBL = r >= gridSize - 8 && c < 8;
        if (!inTL && !inTR && !inBL) {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          matrix[r][c] = (seed % 3) === 0;
        }
      }
    }

    return { matrix, gridSize };
  };

  const { matrix, gridSize } = generateMatrix(token);
  const cellSize = size / gridSize;

  return (
    <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl shadow-inner border border-slate-200/80">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        {matrix.map((row, rIdx) =>
          row.map((filled, cIdx) => {
            if (!filled) return null;
            return (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx * cellSize}
                y={rIdx * cellSize}
                width={cellSize - 0.2}
                height={cellSize - 0.2}
                rx={1}
                fill="#0F172A"
              />
            );
          })
        )}
      </svg>
      {label && (
        <span className="mt-2 text-[10px] font-mono tracking-wider text-slate-500 font-semibold uppercase">
          {label}
        </span>
      )}
    </div>
  );
};
