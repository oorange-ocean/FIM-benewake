import React from 'react';
import Toolbar from '../../components/Toolbar';
import './InventoryOccupy.css';
import InventoryOccupyTable from './InventoryOccupyTable';
import mockData from './mockInventoryOccupyData.js';
import columns from './InventoryOccupyDefs';
export default function InventoryOccupy() {
    const features = ["pin", "unpin", "export", "refresh", 'visibility']

    return (
        <div className='col full-screen inventoryOccupy'>
            <Toolbar features={features} />
            <InventoryOccupyTable
                data={mockData}
                columns={columns}
            />
        </div>
    );
};