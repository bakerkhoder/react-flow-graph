import React from 'react';
import { Node } from 'reactflow';
import { FieldErrors, UseFormRegister, UseFormHandleSubmit } from 'react-hook-form';
import { NodeType } from '../utils/validation';

interface SidebarFormProps {
  nodes: Node[];
  selectedNode: Node | null;
  register: UseFormRegister<NodeType>;
  handleSubmit: UseFormHandleSubmit<NodeType>;
  errors: FieldErrors<NodeType>;
  nodeType: string;
  onSubmit: (data: NodeType) => void;
  onDeleteNode: (id: string) => void;
}

export default function SidebarForm({
  nodes,
  selectedNode,
  register,
  handleSubmit,
  errors,
  nodeType,
  onSubmit,
  onDeleteNode,
}: SidebarFormProps) {
  return (
    <aside className="w-1/3 p-4 bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select {...register('type')} className="w-full p-2 border" disabled={!!selectedNode}>
          <option value="user">User Node</option>
          <option value="habit">Habit Node</option>
        </select>
        <input {...register('name')} placeholder="Node Name" className="w-full p-2 border" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        {nodeType === 'user' && (
          <div>
            <input {...register('userData.username')} placeholder="Username" className="w-full p-2 border" />
            {errors.userData?.username && <p className="text-red-500">{errors.userData.username.message}</p>}
          </div>
        )}

        {nodeType === 'habit' && (
          <div>
            <select {...register('habitType')} className="w-full p-2 border">
              <option value="reading">Reading</option>
              <option value="exercise">Exercise</option>
              <option value="coding">Coding</option>
              <option value="other">Other</option>
            </select>
            {errors.habitType && <p className="text-red-500">{errors.habitType.message}</p>}
          </div>
        )}

        <select {...register('parentId')} className="w-full p-2 border">
          <option value="">Select Parent (Optional)</option>
          <optgroup label="User Nodes">
            {nodes
              .filter((node) => node.type === 'user' && node.id !== selectedNode?.id)
              .map((node) => (
                <option key={node.id} value={node.id}>
                  {node.data.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Habit Nodes">
            {nodes
              .filter((node) => node.type === 'habit' && node.id !== selectedNode?.id)
              .map((node) => (
                <option key={node.id} value={node.id}>
                  {node.data.label}
                </option>
              ))}
          </optgroup>
        </select>

        <button type="submit" className="w-full p-2 bg-blue-500 text-white">
          {selectedNode ? 'Update Node' : 'Add Node'}
        </button>
        {selectedNode && (
          <button
            type="button"
            onClick={() => onDeleteNode(selectedNode.id)}
            className="w-full p-2 bg-red-500 text-white mt-2"
          >
            Delete Node
          </button>
        )}
      </form>
    </aside>
  );
}
