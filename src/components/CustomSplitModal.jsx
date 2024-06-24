import React from 'react';

const CustomSplitModal = ({ isVisible, onClose, onConfirm, splitCount, setSplitCount }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-80 p-6">
        <h2 className="text-xl font-bold mb-4">拆分询单</h2>
        <div className="mb-4">
          <label htmlFor="splitCount" className="block text-sm font-medium text-gray-700 mb-2">拆分数量：</label>
          <input
            id="splitCount"
            type="number"
            value={splitCount}
            onChange={(e) => setSplitCount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomSplitModal;