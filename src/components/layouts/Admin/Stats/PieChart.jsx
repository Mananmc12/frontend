import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";

function PieChart() {
  const [empList, setEmpList] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Gender",
        backgroundColor: ["#cbb4ca", "#A8DCD9"],
        borderColor: "white",
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

    let male = 0;
    let female = 0;

    empList.forEach((emp) => {
      if (emp.gender === "Male") male++;
      else female++;
    });

    setChartData((prev) => ({
      ...prev,
      datasets: [{ ...prev.datasets[0], data: [male, female] }],
    }));
  }, [empList]);

  return (
    <div className="chartContainer" style={{ height: "250px", padding: "10px" }}>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Male to Female ratio",
              font: { size: 20 },
              position: "bottom",
            },
            legend: {
              display: true,
              position: "left",
            },
          },
        }}
      />
    </div>
  );
}

export default PieChart;
