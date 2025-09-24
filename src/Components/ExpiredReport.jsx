import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
// import { Line } from "react-chartjs-2";

function TotalItemsChart() {
  let [chartData, setChartData] = useState([]);

    chartData = [
    { name: "Mon", total: 3 },
    { name: "Tue", total: 5 },
    { name: "Wed", total: 2 },
    { name: "Thu", total: 6 },
    { name: "Fri", total: 4 },
    { name: "Sat", total: 1 },
    { name: "Sun", total: 6 },
  ];
  // useEffect(() => {
  //   const fetchItems = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/items"); // your API endpoint
  //       const items = res.data;

  //       // Count items per day (Mon-Sun)
  //       const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //       const counts = Array(7).fill(0); // start with 0 counts for all days

  //       items.forEach((item) => {
  //         const addedDate = new Date(item.item_added_date); // change to your field
  //         const dayIndex = addedDate.getDay(); // 0 = Sun, 1 = Mon...
  //         counts[dayIndex] += 1;
  //       });

  //       // Convert to recharts format
  //       const formattedData = days.map((day, index) => ({
  //         name: day,
  //         total: counts[index],
  //       }));

  //       setChartData(formattedData);
  //     } catch (error) {
  //       console.error("Error fetching items:", error);
  //     }
  //   };

  //   fetchItems();
  // }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2 style={{ textAlign: "center" }}>Total Items Added This Week</h2>
      <ResponsiveContainer>
        <BarChart data={chartData}> 
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={"preserveStartEnd"} />
          <YAxis allowDecimals={false} />
          <Legend />
          <Tooltip />
          <Bar dataKey="total" fill="#3c958d" radius={[8 , 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

    <ResponsiveContainer>
      <LineChart >
        <Line></Line>
      </LineChart>
    </ResponsiveContainer>

    </div>
  );
}

export default TotalItemsChart;
