import React from 'react';
// import { useConnection } from '@xyflow/react';

interface AppProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

const App: React.FC<AppProps> = ({ fromX, fromY, toX, toY }) => {
  // const { fromHandle } = useConnection();

  return (
    <g>
      <path
        fill="none"
        stroke='#B2DEFF'
        strokeWidth={8}

        
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}  
        fill="#fff"
        r={3}
   
        stroke =  "#B2DEFF"
         strokeWidth=  {8}
      />
    </g>
  );
};

export default App;