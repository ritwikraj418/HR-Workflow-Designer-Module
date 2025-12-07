import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const EndNode = ({ data, selected }) => {
  return (
    <div
      className={`end-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '12px 16px',
        background: '#ef4444',
        color: 'white',
        borderRadius: '8px',
        minWidth: '120px',
        textAlign: 'center',
        fontWeight: '600',
        boxShadow: selected ? '0 0 0 2px #dc2626' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '14px' }}>{data?.endMessage || 'End'}</div>
      <Handle type="target" position={Position.Top} style={{ background: '#dc2626' }} />
    </div>
  );
};

export default memo(EndNode);

