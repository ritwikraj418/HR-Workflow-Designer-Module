import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const AutomatedNode = ({ data, selected }) => {
  return (
    <div
      className={`automated-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '12px 16px',
        background: '#8b5cf6',
        color: 'white',
        borderRadius: '8px',
        minWidth: '150px',
        boxShadow: selected ? '0 0 0 2px #7c3aed' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
        {data?.title || 'Automated Step'}
      </div>
      {data?.actionId && (
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          ⚙️ {data.actionId}
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ background: '#7c3aed' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#7c3aed' }} />
    </div>
  );
};

export default memo(AutomatedNode);

