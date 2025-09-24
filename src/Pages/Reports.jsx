import React from "react";
import ExpiredItemChart from "../Components/ExpiredItemChart";
import NewItemAdded from "../Components/NewItemAdded";
import LowStockItems from "../Components/LowStockItems";
import "../Reports.css";

const Reports = () => {
  return (
    <div className="main-reports-container">
      {/* box 1  */}
      <div className="chart-box">
        <div className="heading">Expired Items</div>
        <div className="chart-container">
          <ExpiredItemChart />
        </div>
      </div>

      {/* box 2  */}
      <div className="chart-box">
        <div className="heading">New Items Added</div>
        <div className="chart-container">
         <NewItemAdded />
        </div>
      </div>

      {/* box 3  */}
      <div className="chart-box">
        <div className="heading">Low Stock Items</div>
        <div className="chart-container">
        <LowStockItems />
        </div>
      </div>

      {/* box 4  */}
      <div className="chart-box">
        <div className="heading">-</div>
        <div className="chart-container">
          -
        </div>
      </div>
    </div>
  );
};

export default Reports;
