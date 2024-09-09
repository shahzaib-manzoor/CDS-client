import React, { useState} from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { RiDeleteBinLine } from "react-icons/ri";

// Styles for the handles
const handleStyle = { left: 10 };

// Interface for the TextUpdaterNode component props
interface TextUpdaterNodeProps {
  data: {
    id: string;
    text: string;
    conditions: { key: string; expression: string; value: string }[];
    onChange: (value: string) => void;
    onChangeConditions: (
      conditions: { key: string; expression: string; value: string }[]
    ) => void;
  };
  isConnectable: boolean;
}

// The component for the dynamic condition node
function TextUpdaterNode({ data }: TextUpdaterNodeProps) {
  const { setNodes, setEdges, addEdges, getNode, getEdges } =
    useReactFlow();

  // State to hold multiple condition rows
  const [conditions, setConditions] = useState([
    { key: "", expression: "", value: "" },
  ]);

  // Function to handle text input change (updates node text)
  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newText = evt.target.value;
    data?.onChange(newText);

    // Update node title in React Flow state
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id
          ? { ...node, data: { ...node.data, text: newText } }
          : node
      )
    );
  };

  // Function to handle adding a new condition row
  const addConditionRow = () => {
    const newConditions = [
      ...data.conditions,
      { key: "", expression: "", value: "" },
    ];
    setConditions(newConditions);
    data?.onChangeConditions(newConditions);
    // Update node conditions in React Flow state
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id
          ? { ...node, data: { ...node.data, conditions: newConditions } }
          : node
      )
    );
  };

  
  // Function to delete the current node
  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== data.id));

    setEdges((edges) =>
      edges.filter((edge) => edge.source !== data.id && edge.target !== data.id)
    );
  };

  // Function to handle deleting a specific condition row
  const deleteConditionRow = (index: number) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
    data?.onChangeConditions(updatedConditions);

    // Update node conditions in React Flow state
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id
          ? { ...node, data: { ...node.data, conditions: updatedConditions } }
          : node
      )
    );
  };

  // Function to update a specific condition row
  const updateConditionRow = (index: number, field: string, value: string) => {
    const updatedConditions = conditions.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setConditions(updatedConditions);

    data?.onChangeConditions(updatedConditions);

    // Update node conditions in React Flow state
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id
          ? { ...node, data: { ...node.data, conditions: updatedConditions } }
          : node
      )
    );
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();

    const sourceNode = getNode(data.id);
    if (sourceNode) {
      addEdges({
        id: `${sourceNode.id}-edge-${Date.now()}`,
        source: sourceNode.id,
        target: "",
        type: "smoothstep",
      });
    }
  };

  // const handleSave = async () => {
  //   try {
  //     await axios.put(`/api/nodes/${data.id}`, { ...data, conditions });
  //   } catch (error) {
  //     console.error("Failed to save node data:", error);
  //   }
  // };

  // useEffect(() => {

  //   setNodes((nodes) =>
  //     nodes.map((node) =>
  //       node.id === data.id ? { ...node, data: { ...node.data, conditions } } : node
  //     )
  //   );
  // }, [conditions, data.id, setNodes]);

  console.log(">>>L<>>>", getEdges());

  return (
    <div
      className="text-updater-node"
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        border: "1px solid #ddd",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "650px",
        fontFamily: "Arial, sans-serif",
      }}
      onContextMenu={handleRightClick}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          borderBottom: "1px solid #ddd",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <input
              type="text"
              placeholder="Text"
              value={data.text}
              onChange={onChange}
               className=""
            />
          </div>
          <button
            type="button"
            title="Delete Node"
            onClick={handleDelete}
             className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
          >
            X
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "150px",
          }}
        >
          <select
            title="Output"
            style={{
              width: "80px",
              fontSize: "17px",
              padding: "4px",
              border: "none",
              outline: "none",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <option value="">output</option>
          </select>
          <button
            type="button"
            title="Save"
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
      </div>

      {data?.conditions?.map((condition, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "10px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <input
            type="text"
            placeholder="Condition"
            name="key"
            value={condition.key}
            onChange={(e) => updateConditionRow(index, "key", e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          />
          <select
            title="Operator"
            name="expression"
            value={condition.expression}
            onChange={(e) =>
              updateConditionRow(index, "expression", e.target.value)
            }
            style={{
              width: "80px",
              padding: "4px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          >
            <option value=">">{">"}</option>
            <option value="<">{"<"}</option>
            <option value="=">{"="}</option>
          </select>
          <input
            type="text"
            placeholder="Value"
            name="value"
            value={condition.value}
            onChange={(e) => updateConditionRow(index, "value", e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          />
          <button
            type="button"
            title="Delete"
            onClick={() => deleteConditionRow(index)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "20px",
              color: "#333",
              cursor: "pointer",
            }}
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ))}

      <button
        onClick={addConditionRow}
        title="Add Row"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5spx",
          cursor: "pointer",
        }}
      >
        Add Row
      </button>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={true}
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={true}
        style={handleStyle}
      />
    </div>
  );
}

export default TextUpdaterNode;
