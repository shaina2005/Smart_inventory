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

function NewItemAdded() {
  const [data , setData] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:5000/items/new_items_added")
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
        <Line dataKey="newItems" type="monotone" stroke="#0f766e" strokeWidth={2}/>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default NewItemAdded;
