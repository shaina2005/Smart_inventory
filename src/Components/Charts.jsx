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
} from "recharts";

function Charts({ apiUrl, xDatakey, chartdataKey, chartType, fillColor }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((res) => {
        console.log(res.data);

        setData(res.data|| []);
      })
      .catch((err) => console.log("Error : " + err));
  }, [apiUrl, chartdataKey]);

  const isline = chartType.toLowerCase() === "line";
  return (
    <ResponsiveContainer height={230} width="100%">
      {isline ? (
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
      ) : (
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
      )}
    </ResponsiveContainer>
  );
}

export default Charts;
