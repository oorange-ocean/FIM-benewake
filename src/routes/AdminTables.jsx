import { NavLink } from "react-router-dom";
import { useUpdateTabContext } from "../hooks/useCustomContext";
import adminSchemas from '../constants/adminSchemas'

const AdminTables = () => {
    const updateTabs = useUpdateTabContext()

    const handleClick = (name, path) => {
        const newTab = { name: name, path: path, type: "admin" }
        updateTabs({ type: "ADD_TAB", tab: newTab })
    }

    return (
        <div className='col full-screen admin-tables'>
            <h1>数据管理</h1>
            <nav className="row">
                {Object.keys(adminSchemas).map((key, i) =>
                    <NavLink
                        key={i}
                        to={"/admin/" + key}
                        onClick={() => handleClick(adminSchemas[key].cn, key)}>
                        {adminSchemas[key].cn}
                    </NavLink>
                )}
            </nav >
        </div>
    )
}

export default AdminTables;