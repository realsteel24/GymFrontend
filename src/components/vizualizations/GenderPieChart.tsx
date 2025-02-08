import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface GenderPieChartProps {
  maleCount: number;
  femaleCount: number;
  otherCount: number;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({
  maleCount,
  femaleCount,
  otherCount,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Prepare data for pie chart
      const genderData = [
        { name: "Male", value: maleCount },
        { name: "Female", value: femaleCount },
        { name: "Other", value: otherCount },
      ];
      // Initialize ECharts instance
      const chart = echarts.init(chartRef.current);
      chartInstanceRef.current = chart; // Store instance in ref

      // Set up pie chart options
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          left: "right",
          top: "bottom",
          textStyle: {
            color:
              localStorage.getItem("darkMode") === "true" ? "White" : "Black",
          },
          data: genderData.map((item) => item.name),
        },
        series: [
          {
            name: "Gender",
            type: "pie",
            radius: ["40%", "60%"],
            avoidLabelOverlap: false,
            right: "20%",
            left: "20%",
            label: {
              show: true,
              position: "outside",
              formatter: " {d}%",
              fontWeight: "bold",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: genderData,
          },
        ],
      };

      // Set chart options and resize on window resize
      chart.setOption(option);
      const handleResize = () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.resize();
        }
      };
      window.addEventListener("resize", handleResize);
      // Clean up ECharts instance on component unmount
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null; // Clear instance from ref
        }
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [maleCount, femaleCount]);

  return (
    <div
      className="grid md:col-span-1"
      ref={chartRef}
      style={{ width: "100%", height: "400px" }}
    />
  );
};

export default GenderPieChart;
