import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

function BarChart() {
  const [empList, setEmpList] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "emp count",
        backgroundColor: "#b3d1ff",
        borderColor: "#0066ff",
        borderWidth: 2,
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchEmpList = async () => {
      try {
        const res = await axios.get("/api/admin/getEmpList");
        setEmpList(res.data);
      } catch (err) {
        console.error("Error fetching employee list:", err);
      }
    };

    fetchEmpList();
  }, []);

  useEffect(() => {
    if (empList.length === 0) return;

    const teamDict = {};
    empList.forEach((emp) => {
      teamDict[emp.team] = (teamDict[emp.team] || 0) + 1;
    });

    const labels = Object.keys(teamDict);
    const data = Object.values(teamDict);

    setChartData((prev) => ({
      ...prev,
      labels,
      datasets: [{ ...prev.datasets[0], data }],
    }));
  }, [empList]);

  return (
    <div className="chartContainer" style={{ height: "250px", padding: "10px" }}>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: { beginAtZero: true },
          },
          plugins: {
            title: {
              display: true,
              text: "No. of employees per team",
              font: { size: 20 },
              position: "bottom",
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

export default BarChart;
