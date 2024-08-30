import { useCallback, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  BackgroundVariant,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(5); // Track node ids

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  // Function to add a new   node
  const addNewNode = useCallback(() => {
    setNodes((nds) => [
      ...nds,
      {
        id: `new-node-${nodeId}`,
        type: "textUpdater",
        position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position for now
        data: { label: `New Node ${nodeId}`,id:`new-node-${nodeId}` },
      },
    ]);
    setNodeId((id) => id + 1); // Increment node ID
  }, [nodeId, setNodes]);

  // Function to handle edge click
  const onEdgeClick =  useCallback((event:MouseEvent,edge:any)=>{
  event.preventDefault();
  event.stopPropagation();
  setEdges((edges) => edges.filter((e) => e.id !== edge.id));
  },[setEdges])

console.log(nodes)
  return (
    <>
      <button type="button" onClick={addNewNode}>Add Textable Node</button>

      <ReactFlow  
        nodes={nodes}
         style={{
          width: '100%',
          height: '100vh',
          backgroundColor: '#f0f0f0',
         }}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick} 
        onConnect={onConnect}
        fitView
        fitViewOptions={
          {
            padding: 20,
          }
        }
      >
        <Background gap={33}  size={4} variant={BackgroundVariant.Dots}/>
        {/* <Controls /> */}
      </ReactFlow>
    </>
  );
}
