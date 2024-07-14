import React from 'react';
import './SplitQuantityComponent.css';

const SplitQuantityComponent = ({ isVisible, onOk, onCancel, splitCount, setSplitCount }) => {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="splitquantity">
                <div className="input-group">
                    <label htmlFor="split-quantity">拆分数量：</label>
                    <input
                        type="text"
                        id="split-quantity"
                        value={splitCount}
                        onChange={(e) => setSplitCount(e.target.value)}
                    />
                </div>
                <div className="button-group">
                    <button className="cancel" onClick={onCancel}>
                        取消
                    </button>
                    <button className="confirm" onClick={onOk}>
                        确认
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SplitQuantityComponent;
