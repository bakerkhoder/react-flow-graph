import { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { Node, Edge, Connection, NodeChange, EdgeChange, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nodeSchema, NodeType } from '../utils/validation';

const useFlowApp = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<NodeType>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      type: 'habit', // Set default type to 'habit'
      name: '',
      userData: undefined,
      habitType: undefined,
      parentId: '',
    },
    shouldUnregister: true,
  });

  const nodeType = watch('type');

  const onSubmit: SubmitHandler<NodeType> = (data) => {
    const newNode: Node = {
      id: selectedNode ? selectedNode.id : nanoid(),
      type: data.type,
      data: {
        label: data.name,
        ...(data.type === 'user' ? { ...data.userData } : {}),
        ...(data.type === 'habit' ? { habitType: data.habitType } : {}),
      },
      position: selectedNode ? selectedNode.position : { x: Math.random() * 400, y: Math.random() * 400 },
      draggable: true,
    };

    setNodes((prevNodes) =>
      selectedNode
        ? prevNodes.map((node) => (node.id === selectedNode.id ? newNode : node))
        : [...prevNodes, newNode]
    );

    if (data.parentId && !edges.find(e => e.source === data.parentId && e.target === newNode.id)) {
      setEdges((prevEdges) => addEdge({ id: nanoid(), source: data.parentId as string, target: newNode.id }, prevEdges));
    }

    reset({
      type: data.type,
      name: '',
      userData: undefined,
      habitType: undefined,
      parentId: '',
    });
    setSelectedNode(null);
  };

  const onConnect = (connection: Connection) => {
    setEdges((prevEdges) => addEdge({ ...connection, id: nanoid() }, prevEdges));
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNode(node);
    setValue('type', node.type as 'user' | 'habit');
    setValue('name', node.data.label);
    if (node.type === 'user') {
      setValue('userData', node.data);
    } else {
      setValue('habitType', node.data.habitType);
    }
    setValue('parentId', node.parentId || '');
  };

  const onDeleteNode = (nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  };

  return {
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
  };
};

export default useFlowApp;
