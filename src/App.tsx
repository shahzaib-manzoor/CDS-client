import { useState } from 'react'
import './App.css'    
import MindMap from './components/Mindmap'
import { ReactFlowProvider } from '@xyflow/react'


function App() {
 

  return (
    <>
     <div style={{ height: 1000,width:1500 }}>
      <ReactFlowProvider>
   <MindMap/>
   </ReactFlowProvider>
   </div>
    </>
  )
}

export default App
