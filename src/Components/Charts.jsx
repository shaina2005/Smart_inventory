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
    "#23927eff", // Teal
    "#FFBB28", // Yellow
    "#FF8042", // Orange
    "#480562ff", // Purple
    "#FF6384", // Pink
    "#36A2EB", // Light Blue
    "#8E44AD", // Violet
    "#2ECC71", // Green
    "#E67E22", // Amber
    "#E74C3C", // Red
    "#1ABC9C", // Aqua
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
            outerRadius={60} // slightly larger and centered
            innerRadius={10} // makes it a donut chart (looks cleaner)
            paddingAngle={2} // small space between slices
            labelLine={false} // removes long connecting lines
            // label={({ name, value }) => `${name}: ${value}`} // neat labels
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
