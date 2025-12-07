import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StartNode from './nodes/StartNode';
import TaskNode from './nodes/TaskNode';
import ApprovalNode from './nodes/ApprovalNode';
import AutomatedNode from './nodes/AutomatedNode';
import EndNode from './nodes/EndNode';
import NodeSidebar from './NodeSidebar';
import NodeEditPanel from './NodeEditPanel';
import WorkflowTestPanel from './WorkflowTestPanel';
import { NODE_TYPES, createNodeData } from '../types/workflow';

const nodeTypes = {
  [NODE_TYPES.START]: StartNode,
  [NODE_TYPES.TASK]: TaskNode,
  [NODE_TYPES.APPROVAL]: ApprovalNode,
  [NODE_TYPES.AUTOMATED]: AutomatedNode,
  [NODE_TYPES.END]: EndNode,
};

const initialNodes = [];
const initialEdges = [];

function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onNodesDelete = useCallback((deleted) => {
    if (selectedNode && deleted.find((n) => n.id === selectedNode.id)) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const onEdgesDelete = useCallback(() => {
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      
      if (!nodeType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: nodeType,
        position,
        data: createNodeData(nodeType),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case NODE_TYPES.START:
                return '#10b981';
              case NODE_TYPES.TASK:
                return '#3b82f6';
              case NODE_TYPES.APPROVAL:
                return '#f59e0b';
              case NODE_TYPES.AUTOMATED:
                return '#8b5cf6';
              case NODE_TYPES.END:
                return '#ef4444';
              default:
                return '#6b7280';
            }
          }}
          style={{ backgroundColor: '#f3f4f6' }}
        />
        <Panel position="top-center" style={{ marginTop: '10px' }}>
          <button
            onClick={() => setShowTestPanel(!showTestPanel)}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {showTestPanel ? 'Hide Test Panel' : 'Show Test Panel'}
          </button>
        </Panel>
      </ReactFlow>

      <NodeSidebar />
      {selectedNode && (
        <NodeEditPanel
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
      {showTestPanel && (
        <WorkflowTestPanel onClose={() => setShowTestPanel(false)} />
      )}
    </div>
  );
}

export default WorkflowCanvas;
