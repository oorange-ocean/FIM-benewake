import React from 'react';
import Toolbar from '../../components/Toolbar';
import ProductionPlanSecTabs from './ProductionPlanSecondTab';
import Table from '../../components/table/Table';
import columns from './ProductionPlanDefs';
export default function ProductionPlan() {
    const features = ["export", "refresh"]

    return (
        <div className='col full-screen inventoryOccupy'>
            <Toolbar features={features} />
            <ProductionPlanSecTabs />
            <Table
                data={{}}
                columns={columns}
            />
        </div>
    );
};