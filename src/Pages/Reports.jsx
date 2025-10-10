import React from "react";
import Charts from "../Components/Charts";
import "../Reports.css";

const Reports = () => {
  return (
    <div className="main-reports-container ">
      {/* box 1  */}
      <div className="chart-box">
        <div className="heading">Expired Items</div>
        <div className="chart-container">
          <Charts
            apiUrl="http://localhost:5000/items/expired_items"
            xDatakey="day"
            chartdataKey="expired"
            chartType="bar"
            fillColor="rgba(231, 88, 48, 1)"
          />
        </div>
      </div>

      {/* box 2  */}
      <div className="chart-box">
        <div className="heading">New Items Added</div>
        <div className="chart-container">
          <Charts
            apiUrl="http://localhost:5000/items/new_items_added"
            xDatakey="day"
            chartdataKey="newItems"
            chartType="line"
            fillColor="#0f766e"
          />
        </div>
      </div>

      {/* box 3  */}
      <div className="chart-box">
        <div className="heading">Low Stock Items</div>
        <div className="chart-container">
          <Charts
            apiUrl="http://localhost:5000/items/get_lowstock_items"
            xDatakey="day"
            chartdataKey="lowStock"
            chartType="bar"
            fillColor="#f59e0b"
          />
        </div>
      </div>

      {/* box 4  */}
      <div className="chart-box">
        <div className="heading">Department-wise Inventory</div>
        <div className="chart-container">
          <Charts
            apiUrl="http://localhost:5000/items/department_count" // backend endpoint
            xDatakey="department"
            chartdataKey="count"
            chartType="pie"
            fillColor="" // not used for Pie chart as slices have COLORS array
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
