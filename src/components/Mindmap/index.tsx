import { useEffect, MouseEvent as ReactMouseEvent, useState } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge as FlowEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function App() {
  const { ruleId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    initialNodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(
    initialEdges || []
  );
 const [rule, setRule] = useState<any>(null);
  const transformNodesForBackend = (nodes: Node[] = []) => {
    return nodes.map((node) => ({
      name: node.data?.text || "",
      type: node.type,
      nodeId: node.id,
      inputs: [],
      output: [],
      isActive: true,
      rules: null,
      measured: {
        height: node.measured?.height || 0,
        width: node.measured?.width || 0,
      },
      position: node.position,
      outputs: node.data?.outputs || [],
      branches: [],
      conditions: node.data?.conditions || [],
    }));
  };

  const transformEdgesForBackend = (edges: FlowEdge[] = []) => {
    return edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      edgeId: edge.id,
      rules: ruleId,
    }));
  };

  const transformEdgesFromBackend = (backendEdges: any[] = []) => {
    return backendEdges?.map((edge) => ({
      id: edge.edgeId,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#B2DEFF',
      },
      style: {
        stroke: "#B2DEFF", strokeWidth: 8,
      },
    }));
  };

  const transformNodesFromBackend = (backendNodes: any[] = []) => {
    return backendNodes?.map((node) => ({
      id: node.nodeId,
      type: node.type,
      position: {
        x: node.position?.x || 0,
        y: node.position?.y || 0,
      },
      data: {
        id: node.nodeId,
        text: node.name,
        outputs: node.outputs || [],
        conditions: node.conditions || [],
        onChangeOutputs: (newOutputs: string[]) => {
          setNodes((nodes) =>
            nodes.map((n) =>
              n.id === node.nodeId
                ? { ...n, data: { ...n.data, outputs: newOutputs } }
                : n
            )
          );
        },
        onChange: (newText: string) => {
          setNodes((nodes) =>
            nodes.map((n) =>
              n.id === node.nodeId
                ? { ...n, data: { ...n.data, text: newText } }
                : n
            )
          );
        },
        onChangeConditions: (
          newConditions: { key: string; expression: string; value: string }[]
        ) => {
          setNodes((nodes) =>
            nodes.map((n) =>
              n.id === node.nodeId
                ? { ...n, data: { ...n.data, conditions: newConditions } }
                : n
            )
          );
        },
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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/node?id=${ruleId}`
        );
        const backendNodes = response.data.result.nodes;
        const backendEdges = response.data.result.edges;
        
        setNodes(transformNodesFromBackend(backendNodes));
        setEdges(transformEdgesFromBackend(backendEdges));
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchNodes();
    fetchRule(ruleId??'');
  }, [ruleId]);

  const saveNodesToBackend = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/node`,
        {
          ruleId: ruleId,
          nodes: transformNodesForBackend(nodes),
          edges: transformEdgesForBackend(edges),
        }
      );
      if (response.status === 200) {
        toast.success("Nodes saved successfully");
      }
    } catch (error) {
      console.error("Error saving nodes:", error);
    }
  };

  const addNewNode = () => {
    const uniqueId = Math.random().toString(36).substring(7);

    setNodes((nds) => [
      ...nds,
      {
        id: `${uniqueId}`,
        type: "textUpdater",
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: {
          id: uniqueId,
          text: "", 
          conditions: [],
          onChange: () => {},
          onChangeConditions: () => {},
          onChangeOutputs: () => {},
        },
      },
    ]);
  };

  const onEdgeClick = (
    event: ReactMouseEvent<Element, MouseEvent>,
    edge: FlowEdge
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setEdges((edges) => edges.filter((e) => e.id !== edge.id));
  };

  const fetchRule = async (nodeId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/rules/${nodeId}`
      );
      if (response.status === 200) {
       setRule(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching node:", error);
    }

    return null;
  }


   return (
    <>
      <div className="fixed top-5 left- z-50 bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center w-9/12">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">
            {rule?.name}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={addNewNode} title="Add" className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 hover:text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <span className="text-sm text-gray-500 cursor-pointer">Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={saveNodesToBackend} title="Save" className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 hover:text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <span className="text-sm text-gray-500 cursor-pointer">Save</span>
          </div>
      </div>
  
      
        <ReactFlow
          nodes={nodes}
          edges={edges}
          style={{ width: "100%", height: "calc(100vh - 64px)", backgroundColor: "#f0f0f0" }} // Adjust height to account for the fixed bar
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineStyle={{ stroke: "#B2DEFF", strokeWidth: 8,strokeLinecap:"square", }}
          connectionLineContainerStyle={{ stroke: "#B2DEFF", strokeWidth: 8,strokeLinecap:"square", }}
          connectionRadius={2}
          defaultMarkerColor="#B2DEFF"
          connectOnClick={true}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeClick={onEdgeClick}

          
          onConnect={(connection) => {
            console.log("onConnect", connection);
            const edge = {
              ...connection,
              type: "smoothstep",
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#B2DEFF',
              },
              style: {
                stroke: "#B2DEFF", strokeWidth: 8,
              },
            }
            setEdges((edges) => addEdge(edge, edges));
          }}
          fitView
          fitViewOptions={{ padding: 20 }}
        >
          <Background gap={33} size={4} variant={BackgroundVariant.Dots} />
        </ReactFlow>
   
    </>
  );
}
