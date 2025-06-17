import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

function BarChart2() {
  const [chartData, setChartData] = useState({
    labels: ["Leave Request", "Bonus Request", "Loan Request"],
    datasets: [
      {
        label: "Request count",
        backgroundColor: "#ffe0b3",
        borderColor: "orange",
        borderWidth: 2,
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const res = await axios.get("/api/admin", {
          headers: { "x-auth-token": token },
        });

        const { leaveRequests, bonusRequests, loanRequests } = res.data.user;

        const data = [
          leaveRequests.length,
          bonusRequests.length,
          loanRequests.length,
        ];

        setChartData((prev) => ({
          ...prev,
          datasets: [{ ...prev.datasets[0], data }],
        }));
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };

    fetchAdminData();
  }, []);

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
              text: "No. of requests per subject",
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

export default BarChart2;
