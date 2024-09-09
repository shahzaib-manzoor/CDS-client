import { useEffect, MouseEvent as ReactMouseEvent } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge as FlowEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios from "axios";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function App() {
  const { ruleId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<FlowEdge>(initialEdges);

  const transformNodesForBackend = (nodes: Node[]) => {
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
      branches: [],
      conditions: node.data?.conditions || [],
    }));
  };

  const transformEdgesForBackend = (edges: FlowEdge[]) => {
    return edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      edgeId: edge.id,
      rules: ruleId,
    }));
  };

  const transformEdgesFromBackend = (backendEdges: any[]) => {
    return backendEdges?.map((edge) => ({
      id: edge.edgeId,
      source: edge.source,
      target: edge.target,
      type: edge.type,
    }));
  };
  const transformNodesFromBackend = (backendNodes: any[]) => {
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
        conditions: node.conditions || [],
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
  }, []);

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
  return (
    <>
      <button
        type="button"
        onClick={addNewNode}
        className="bg-blue-500 text-white  px-4 py-2 rounded-lg shadow hover:bg-blue-700 "
      >
        Add Node
      </button>
      <button
        type="button"
        onClick={saveNodesToBackend}
        className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
      >
        Save Nodes
      </button>

      <ReactFlow
        nodes={nodes}
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#f0f0f0",
        }}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={(connection) => {
          setEdges((edges) => addEdge(connection, edges));
        }}
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
