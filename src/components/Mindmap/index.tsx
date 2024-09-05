import React, { useState, useEffect, MouseEvent as ReactMouseEvent } from "react";
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
  Edge,
  Node,
  Edge as FlowEdge,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import axios from 'axios';

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(initialEdges);
  const [nodeId, setNodeId] = useState<number>(5); // Track node ids

  const transformNodesForBackend = (nodes: Node[]) => {
    return nodes.map((node) => ({
      name: node.data?.text || '', // Ensure 'name' matches with your schema, use default value if needed
      type: node.type,
      nodeId: node.id,
      inputs: [], // Handle or map inputs if needed
      output: [], // Handle or map output if needed
      isActive: true, // Default value, handle if needed
      rules: null, // Handle or map rules if needed
      measured: {
        height: node.measured?.height || 0,
        width: node.measured?.width || 0,
      }, 
      position: node.position,
      branches: [], // Handle or map branches if needed
      conditions: node.data?.conditions || [],
    }));
  };

  const transformNodesFromBackend = (backendNodes: any[]) => {
    return backendNodes?.map((node) => ({
      id: node.nodeId  ,
      type: node.type,
      position: {
        x: node.position?.x || 0,
        y: node.position?.y || 0,
      },

      data: {
        text: node.name,
        conditions: node.conditions || [],
        onChange: (newText: string) => {
        setNodes((nodes) =>
          nodes.map((n) =>
            n.id === node.nodeId ? { ...n, data: { ...n.data, text: newText } } : n
          )
        );
      },
       onChangeConditions: (newConditions: { key: string; expression: string; value: string }[]) => {
        setNodes((nodes) =>
          nodes.map((n) =>
            n.id === node.nodeId ? { ...n, data: { ...n.data, conditions: newConditions } } : n
          )
        );  
      }
      },
      measured: {
        height: node.measured?.height || 0,
        width: node.measured?.width || 0,
      },
    }));
  };

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/node');
        const backendNodes = response.data.result;
        const backendEdges = response.data.edges;
        setNodes(transformNodesFromBackend(backendNodes));
        setEdges(backendEdges);
      } catch (error) {
        console.error('Error fetching nodes:', error);
      }
    };
    fetchNodes();
  }, [setNodes, setEdges]);

  // Function to save nodes to the backend
  const saveNodesToBackend = async () => {
    try {
      console.log('Saving nodes:', nodes);
      console.log('Saving edges:', edges);
      const response = await axios.post('http://localhost:3000/api/node', {
        nodes: transformNodesForBackend(nodes),
        edges: edges?.map((edge) => ({
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })),
      });
      console.log('Nodes saved successfully', response.data);
    } catch (error) {
      console.error('Error saving nodes:', error);
    }
  };

  // Function to add a new node
  const addNewNode = () => {
    const uniqueId  =  Math.random().toString(36).substring(7);
    setNodes((nds) => [
      ...nds,
      {
        id: `${uniqueId}`,
        type: "textUpdater",
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { id: uniqueId, text: "New Node", conditions: [] },
      },
    ]);
    
  };

  // Function to handle edge click
  const onEdgeClick = (event: ReactMouseEvent<Element, MouseEvent>, edge: FlowEdge) => {
    event.preventDefault();
    event.stopPropagation();
    setEdges((edges) => edges.filter((e) => e.id !== edge.id));
  };

  return (
    <>
      <button type="button" onClick={addNewNode} className="bg-blue-500 text-white  px-4 py-2 rounded-lg shadow hover:bg-blue-700 ">Add Node</button>
      <button type="button" onClick={saveNodesToBackend} className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
        Save Nodes
      </button>

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
        onConnect={(connection) => setEdges((edges) => addEdge(connection, edges))}
        fitView
        fitViewOptions={{
          padding: 20,
        }}
      >
        <Background gap={33} size={4} variant={BackgroundVariant.Dots} />
        {/* <Controls /> */}
      </ReactFlow>
    </>
  );
}
