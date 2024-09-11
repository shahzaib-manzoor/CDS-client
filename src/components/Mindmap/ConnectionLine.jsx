import React from 'react';
import { useConnection } from '@xyflow/react';

const ConnectionLine =  ({ fromX, fromY, toX, toY }) => {
  const { fromHandle } = useConnection();

  return (
    <g>
      <path
        fill="none"
        stroke={fromHandle.id}
        strokeWidth={8}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}  
        fill="#fff"
        r={3}
        stroke={fromHandle.id}
        strokeWidth={8}
      />
    </g>
  );
};

export default ConnectionLine;
