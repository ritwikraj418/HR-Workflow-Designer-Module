import { NODE_TYPES, NODE_LABELS } from '../types/workflow';

const NodeSidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: NODE_TYPES.START, label: NODE_LABELS[NODE_TYPES.START], color: '#10b981' },
    { type: NODE_TYPES.TASK, label: NODE_LABELS[NODE_TYPES.TASK], color: '#3b82f6' },
    { type: NODE_TYPES.APPROVAL, label: NODE_LABELS[NODE_TYPES.APPROVAL], color: '#f59e0b' },
    { type: NODE_TYPES.AUTOMATED, label: NODE_LABELS[NODE_TYPES.AUTOMATED], color: '#8b5cf6' },
    { type: NODE_TYPES.END, label: NODE_LABELS[NODE_TYPES.END], color: '#ef4444' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 4,
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        minWidth: '180px',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
        Node Types
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {nodeTypes.map(({ type, label, color }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            style={{
              padding: '10px 12px',
              background: color,
              color: 'white',
              borderRadius: '6px',
              cursor: 'grab',
              fontSize: '13px',
              fontWeight: '500',
              userSelect: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <p style={{ margin: '12px 0 0 0', fontSize: '11px', color: '#666' }}>
        Drag nodes onto canvas
      </p>
    </div>
  );
};

export default NodeSidebar;

