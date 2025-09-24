import React from "react";
import ExpiredReport from "../Components/ExpiredReport";

const Reports = () => {
  // Mock data for now (replace with API later)
  const expiredItemsData = [3, 1, 8, 4, 2, 1, 6];
  const addedItem = [4,0,8,12,7,5,9];

  return (
    <div style={{ width: "400px", height: "350px", margin: "0 auto" } }>

      {/* Chart */}
      <ExpiredReport data={expiredItemsData} />
      {/* <ExpiredReport data={addedItem}/> */}

      {/* You can add summary cards and table here later */}
    </div>
  );
};

export default Reports;
