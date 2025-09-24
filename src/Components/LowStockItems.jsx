import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import axios from "axios";

function LowStockItems() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/items/low_stock_week")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="lowStock" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default LowStockItems;
