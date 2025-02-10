import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeData } from '../types';

const HabitNode = ({ data }: { data: NodeData }) => (
  <div style={{ padding: 10, border: '1px solid black', borderRadius: 5 }}>
    <Handle type="target" position={Position.Top} />
    <strong>{data.label}</strong>
    <div>{data.habitType}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export default HabitNode;
