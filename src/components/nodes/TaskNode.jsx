import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const TaskNode = ({ data, selected }) => {
  return (
    <div
      className={`task-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '12px 16px',
        background: '#3b82f6',
        color: 'white',
        borderRadius: '8px',
        minWidth: '150px',
        boxShadow: selected ? '0 0 0 2px #2563eb' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
        {data?.title || 'Task'}
      </div>
      {data?.assignee && (
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          👤 {data.assignee}
        </div>
      )}
      {data?.dueDate && (
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          📅 {data.dueDate}
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ background: '#2563eb' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#2563eb' }} />
    </div>
  );
};

export default memo(TaskNode);

