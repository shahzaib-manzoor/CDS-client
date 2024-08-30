import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { RiDeleteBinLine } from 'react-icons/ri';
import axios from 'axios';

// Styles for the handles
const handleStyle = { left: 10, };

// Interface for the TextUpdaterNode component props
interface TextUpdaterNodeProps {
  data: {
    id: string;
    text: string;
    onChange: (value: string) => void;
  };
  isConnectable: boolean;
}

// The component for the dynamic condition node
function TextUpdaterNode({ data, isConnectable }: TextUpdaterNodeProps) {
  const { setNodes, setEdges, addEdges, getNode } = useReactFlow();

  // State to hold multiple condition rows
  const [conditions, setConditions] = useState([
    { condition: 'Fever', operator: '>', value: '101°F' },
  ]);

  // Function to handle text input change
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      data.onChange(evt.target.value);
    },
    [data]
  );

  // Function to delete the current node
  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== data.id));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== data.id && edge.target !== data.id)
    );
  };

  // Function to handle adding a new condition row
  const addConditionRow = () => {
    setConditions([...conditions, { condition: '', operator: '', value: '' }]);
    setNodes((nodes) => [
      ...nodes,
      {
        id: `${data.id}-${nodes.length + 1}`,
        type: 'textUpdater',
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { text: 'New Node', lalal: 'ssss' },
      },
    ]);
  };

  // Function to handle deleting a specific condition row
  const deleteConditionRow = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to update a specific condition row
  const updateConditionRow = (index: number, field: string, value: string) => {
    setConditions((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default context menu

    const sourceNode = getNode(data.id); // Get the source node
    if (sourceNode) {
      addEdges({ id: `${sourceNode.id}-edge`, source: sourceNode.id, target: '' });
    }
  };

  // Update node data with conditions when Save is clicked
  const handleSave = async () => {
    try {
      // Example of sending updated node data to the backend
      await axios.put(`/api/nodes/${data.id}`, { ...data, conditions });
    } catch (error) {
      console.error('Failed to save node data:', error);
    }
  };

  return (
    <div
      className="text-updater-node"
      style={{
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        border: '1px solid #ddd',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '650px',
        fontFamily: 'Arial, sans-serif',
      }}
      onContextMenu={handleRightClick} // Right-click handler to start an edge
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          borderBottom: '1px solid #ddd',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <input
              type="text"
              placeholder="Text"
              value={data.text}
              onChange={onChange}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                marginRight: '10px',
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '18px',
              color: '#333',
              cursor: 'pointer',
            }}
          >
            &#10006;
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '150px',
          }}
        >
          <select
            title="Output"
            style={{
              width: '80px',
              fontSize: '17px',
              padding: '4px',
              border: 'none',
              outline: 'none',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            <option value="">output</option>
          </select>
          <button
            type="button"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>

      {conditions.map((condition, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: '#f0f0f0',
          }}
        >
          <input
            type="text"
            placeholder="Condition"
            value={condition.condition}
            onChange={(e) =>
              updateConditionRow(index, 'condition', e.target.value)
            }
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginRight: '10px',
            }}
          />
          <select
            title="Operator"
            value={condition.operator}
            onChange={(e) =>
              updateConditionRow(index, 'operator', e.target.value)
            }
            style={{
              width: '80px',
              padding: '4px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginRight: '10px',
            }}
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
            <option value="%">%</option>
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
            <option value="=">{'='}</option>
          </select>
          <input
            type="text"
            placeholder="Value"
            value={condition.value}
            onChange={(e) =>
              updateConditionRow(index, 'value', e.target.value)
            }
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginRight: '10px',
            }}
          />
          <button
            title="Delete"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            type="button"
            onClick={() => deleteConditionRow(index)}
          >
            <RiDeleteBinLine color="black" size={24} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addConditionRow}
        style={{
          width: '30%',
          padding: '10px',
          backgroundColor: 'rgb(168, 222, 240)',
          color: 'rgb(31, 31, 201)',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Add Condition
      </button>

      {/* <button
        type="button"
        onClick={handleSave}
        style={{
          width: '30%',
          padding: '10px',
          backgroundColor: 'rgb(31, 31, 201)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Save
      </button> */}

      <Handle
        type="source"
        position={Position.Left}
        id="b"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Right}
        
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      
    </div>
  );
}

export default TextUpdaterNode;