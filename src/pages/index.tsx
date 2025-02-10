import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import UserNode from '../components/UserNode';
import HabitNode from '../components/HabitNode';
import useFlowApp from '../hooks/useFlowApp';
import SidebarForm from '../components/SidebarForm';

const nodeTypes = {
  user: UserNode,
  habit: HabitNode,
};

export default function FlowApp() {
  const {
    nodes,
    edges,
    selectedNode,
    register,
    handleSubmit,
    errors,
    nodeType,
    onSubmit,
    onConnect,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onDeleteNode,
    onEdgeClick,
  } = useFlowApp();

  return (
    <div className="flex">
      <SidebarForm
        nodes={nodes}
        selectedNode={selectedNode}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        nodeType={nodeType}
        onSubmit={onSubmit}
        onDeleteNode={onDeleteNode}
      />
      <div className="w-2/3 h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}