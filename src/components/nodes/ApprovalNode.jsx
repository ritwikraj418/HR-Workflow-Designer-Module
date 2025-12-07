import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const ApprovalNode = ({ data, selected }) => {
  return (
    <div
      className={`approval-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '12px 16px',
        background: '#f59e0b',
        color: 'white',
        borderRadius: '8px',
        minWidth: '150px',
        boxShadow: selected ? '0 0 0 2px #d97706' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
        {data?.title || 'Approval'}
      </div>
      {data?.approverRole && (
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          👔 {data.approverRole}
        </div>
      )}
      {data?.autoApproveThreshold > 0 && (
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          ⚡ Auto: {data.autoApproveThreshold}
        </div>
      )}
      <Handle type="target" position={Position.Top} style={{ background: '#d97706' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#d97706' }} />
    </div>
  );
};

export default memo(ApprovalNode);

