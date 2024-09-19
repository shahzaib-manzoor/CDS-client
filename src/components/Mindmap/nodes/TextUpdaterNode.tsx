import React, { useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import Select from "react-select";
import axios from "axios";

const DEFAULT_HANDLE_STYLE = {
  width: 20,
  height: 20,
  right: 0,
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

// Type for the options used in the Select component
interface OptionType {
  label: string;
  value: string;
}

// The component for the dynamic condition node
function TextUpdaterNode({ data }: TextUpdaterNodeProps) {
  const { setNodes, setEdges, addEdges, getNode } = useReactFlow();
  const [typeToAdd, setTypeToAdd] = useState("condition");

  // State to hold multiple condition rows
  const [conditions, setConditions] = useState([
    { key: "", expression: "", value: "" },
  ]);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [configOptions, setConfigOptions] = useState<OptionType[]>([]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  useEffect(() => {
    // Fetch configurations for the dropdown
    axios.get(`${import.meta.env.VITE_API_URL}/configs`).then((response) => {
      const options = response.data.result.map((config: any) => ({
        label: config.name,
        value: config._id,
      }));
      setConfigOptions(options);
    }).catch(error => {
      console.error("Error fetching configurations:", error);
    });
  }, []);

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
    console.log("index", field);
    const updatedOutputs = outputs.map((row, i) => (i === index ? value : row));
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

  const positionHandle = (index: number) => {
    const calculated = data?.conditions.length * 76 + 210 + index * 80;
    return calculated;
  };

  const handleSelectChange = (option: OptionType | null) => {
    setSelectedOption(option);
    if (option) {
      console.log("Selected option:", option);
    }
  };

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
            className="bg-transparent px-6 py-3 rounded-lg shadow text-black"
          >
            <option value="condition">Criteria</option>
            <option value="output">Output</option>
          </select>
          <button
            onClick={addConditionRow}
            type="button"
            title="Add"
            className="ml-4 font-bold text-black px-4 py-2 rounded-lg "
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <Select
        options={configOptions}
        placeholder="Search configurations..."
        className="mt-4"
        value={selectedOption}
        onChange={handleSelectChange}
      />

      {data?.conditions?.map((condition, index) => (
        <div
          key={index}
          className="p-4 border-b border-gray-200 bg-[#f0f0f0] rounded-lg"
        >
          <input
            type="text"
            placeholder="Criteria"
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
          className="p-3 border-b border-gray-200 bg-[#f0f0f0] rounded-lg mt-3 flex justify-between"
        >
          <input
            type="text"
            placeholder="Output"
            name="output"
            value={output}
            onChange={(e) => updateOutputRow(index, "output", e.target.value)}
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
          <Handle
            type="source"
            id={`${data.id}-output-${index}`}
            position={Position.Right}
            style={{
              ...DEFAULT_HANDLE_STYLE,
              background: "#B2DEFF",
              top: positionHandle(index),
            }}
            isConnectable={true}
          />
        </div>
      ))}

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={true}
        style={{ ...DEFAULT_HANDLE_STYLE, background: "#B2DEFF" }}
      />
   
    </div>
  );
}

export default TextUpdaterNode;