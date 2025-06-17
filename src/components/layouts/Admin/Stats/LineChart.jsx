import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

function LineChart() {
  const [empList, setEmpList] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Hired",
        fill: false,
        tension: 0.5,
        backgroundColor: "white",
        borderColor: "#02C39A",
        borderWidth: 2,
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/getEmpList");
        setEmpList(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (empList.length === 0) return;

    const empCountByYear = {};

    empList.forEach((emp) => {
      const year = new Date(emp.doj).getFullYear();
      empCountByYear[year] = (empCountByYear[year] || 0) + 1;
    });

    const labels = Object.keys(empCountByYear);
    const data = Object.values(empCountByYear);

    setChartData((prev) => ({
      ...prev,
      labels,
      datasets: [{ ...prev.datasets[0], data }],
    }));
  }, [empList]);

  return (
    <div className="chartContainer" style={{ height: "250px", padding: "10px" }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "No. of Employees hired",
              font: { size: 20 },
              position: "bottom",
            },
            legend: {
              display: true,
              position: "right",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
}

export default LineChart;
