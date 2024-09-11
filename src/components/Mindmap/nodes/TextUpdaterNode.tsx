import React, { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";


const DEFAULT_HANDLE_STYLE = {
  width: 20,
  height: 20,
  bottom: -5,

};

// Interface for the TextUpdaterNode component props
interface TextUpdaterNodeProps {
  data: {
    id: string;
    text: string;
    conditions: { key: string; expression: string; value: string }[];
    outputs: string[];
    saveNodeToBackend: () => void;
    onChangeOutputs: (outputs: string[]) => void;
    onChange: (value: string) => void;
    onChangeConditions: (
      conditions: { key: string; expression: string; value: string }[]
    ) => void;    
  };
  isConnectable: boolean;
}

// The component for the dynamic condition node
function TextUpdaterNode({ data }: TextUpdaterNodeProps) {
  const { setNodes, setEdges, addEdges, getNode, getEdges } = useReactFlow();

  const [typeToAdd, setTypeToAdd] = useState("condition");

  // State to hold multiple condition rows
  const [conditions, setConditions] = useState([
    { key: "", expression: "", value: "" },
  ]);
  const [outputs, setOutputs] = useState<string[]>([]);

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

  const addOutput = () => {
    const newOutputs = [...outputs, ""];
    setOutputs(newOutputs);
    // data?.onChangeOutputs(newOutputs);
    // Update node conditions in React Flow state
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id
          ? { ...node, data: { ...node.data, outputs: newOutputs } }
          : node
      )
    );
  };

  // Function to handle adding a new condition row
  const addConditionRow = () => {
    if (typeToAdd === "output") {
      console.log(">>>", typeToAdd);
      addOutput();
      return;
    } else {
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
    }
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

  const deleteOutputRow = (index: number) => {
    const updatedOutputs = outputs.filter((_, i) => i !== index);
    setOutputs(updatedOutputs);
    data?.onChangeOutputs(updatedOutputs);

    // Update node conditions in React Flow state
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id
          ? { ...node, data: { ...node.data, outputs: updatedOutputs } }
          : node
      )
    );
  };

  const updateOutputRow = (index: number, field: string, value: string) => {
    const updatedOutputs = outputs.map((row, i) =>
      i === index ? value : row
    );
    setOutputs(updatedOutputs);

    data?.onChangeOutputs(updatedOutputs);

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id
          ? { ...node, data: { ...node.data, outputs: updatedOutputs } }
          : node
      )
    );
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
      className="bg-white rounded-lg shadow-lg p-4"
      onContextMenu={handleRightClick}
    >
      <div className="flex flex-col p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="w-full flex items-center mb-6">
            <input
              type="text"
              placeholder="Node label"
              value={data.text}
              onChange={onChange}
              className="bg-transparent w-full px-6 py-3 rounded-lg shadow text-black"
            />
            <button
              type="button"
              title="Delete Node"
              onClick={handleDelete}
              className="ml-4 font-bold text-black px-4 py-2 rounded-lg "
            >
              <RxCross2 />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <select
            title="Output"
            value={typeToAdd}
            onChange={(e) => setTypeToAdd(e.target.value)}
            className="bg-transparent   px-6 py-3 rounded-lg shadow   text-black"
          >
            <option value="condition">Condition</option>
            <option value="output">Output</option>
          </select>
          <button
            onClick={addConditionRow}
            type="button"
            title="Add"
            className="ml-4 font-bold   text-black px-4 py-2 rounded-lg "
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {data?.conditions?.map((condition, index) => (
        <div
          key={index}
          className="p-4 border-b border-gray-200 bg-[#f0f0f0] rounded-lg  "
        >
          <input
            type="text"
            placeholder="Condition"
            name="key"
            value={condition.key}
            onChange={(e) => updateConditionRow(index, "key", e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2.5"
          />
          <select
            title="Operator"
            name="expression"
            value={condition.expression}
            onChange={(e) =>
              updateConditionRow(index, "expression", e.target.value)
            }
            className="w-20 p-1 border border-gray-300 rounded-md mr-2.5"
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
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2.5"
          />
          <button
            type="button"
            title="Delete"
            onClick={() => deleteConditionRow(index)}
            className="bg-transparent border-none text-lg text-gray-800 cursor-pointer"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ))}

      {data?.outputs?.map((output: any, index: number) => (
        <div
          key={index}
          className="p-3 border-b border-gray-200 bg-[#f0f0f0] rounded-lg mt-3 flex justify-between "
        >
          <input
            type="text"
            placeholder="Output"
            name="output"
            value={output}
            onChange={(e) =>
              updateOutputRow(index, "output", e.target.value)
            }
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2 w-11/12"
          />
          <button
            type="button"
            title="Delete"
            onClick={() => deleteOutputRow(index)}
            className="bg-transparent border-none text-lg text-gray-800 cursor-pointer"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ))}

      {/* <button
        onClick={data?.saveNodeToBackend}
        title="Add Row"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 "
      >
        Save
      </button> */}

     
      <Handle
        type="target"
        position={Position.Bottom}
        
        isConnectable={true}
         style={{ ...DEFAULT_HANDLE_STYLE, background: '#B2DEFF' }}
      />
       <Handle
        type="source"
        position={Position.Top}
        style={{ ...DEFAULT_HANDLE_STYLE, background:"#B2DEFF"
         }}

        isConnectable={true}
        
      />  
    </div>
  );
}

export default TextUpdaterNode;
