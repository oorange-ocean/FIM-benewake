import React from 'react';
import './CustomModal.css';

const CustomModal = ({ isVisible, onOk, onCancel, splitCount, setSplitCount }) => {
  return (
    isVisible && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-row">
            <label>请输入拆分数量：</label>
            <input
              type="number"
              value={splitCount}
              onChange={(e) => setSplitCount(e.target.value)}
              min={1}
            />
          </div>
          <div className="modal-row">
            <button className="cancel-button" onClick={onCancel}>取消</button>
            <button className="confirm-button" onClick={onOk}>确认</button>
          </div>
        </div>
      </div>
    )
  );
};

export default CustomModal;
