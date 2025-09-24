import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function ExpiredItemChart() {
//   const sampleData = [
//     {
//       day: "mon",
//       expired: 2,
//     },
//     {
//       day: "tue",
//       expired: 3,
//     },
//     {
//       day: "wed",
//       expired: 5,
//     },
//     {
//       day: "thur",
//       expired: 7,
//     },
//     {
//       day: "fri",
//       expired: 1,
//     },
//     {
//       day: "sat",
//       expired: 2,
//     },
//     {
//       day: "sun",
//       expired: 4,
//     },
//   ];
  const [data , setData] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:5000/items/expired_items")
    .then((res)=>{
        console.log("data : " + res.data);
        
        setData(res.data)})
    .catch((err)=>console.log("error: " + err))
  } , []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid  strokeDasharray="3 3"/>
        <XAxis dataKey="day" interval="preserveEnd" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line dataKey="expired" type="monotone" stroke="rgba(231, 88, 48, 1)" strokeWidth={2}/>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ExpiredItemChart;
