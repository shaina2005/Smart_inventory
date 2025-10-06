import axios from "axios";
import { color } from "chart.js/helpers";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Charts({ apiUrl, xDatakey, chartdataKey, chartType, fillColor }) {
  const [data, setData] = useState([]);
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#FF6384",
    "#36A2EB",
  ];

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((res) => {
        console.log(res.data);

        setData(res.data || []);
      })
      .catch((err) => console.log("Error : " + err));
  }, [apiUrl, chartdataKey]);

  const type = chartType.toLowerCase();
  return (
    <ResponsiveContainer height={230} width="100%">
      {type === "line" ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3 " />
          <XAxis dataKey={xDatakey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            dataKey={chartdataKey}
            type="monotone"
            stroke={fillColor}
            strokeWidth={3}
            activeDot={{ r: 5, fill: { fillColor } }}
          />
        </LineChart>
      ) : type === "bar" ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3 " />
          <XAxis dataKey={xDatakey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey={chartdataKey}
            fill={fillColor}
            barSize={50}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      ) : (
        <PieChart>
          <Pie
            data={data}
            dataKey={chartdataKey}
            nameKey={xDatakey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </ResponsiveContainer>
  );
}

export default Charts;
