import axios from "axios";
import React from "react";
import Chart from "react-apexcharts";
import { configuration } from "../../../configuration";
import { ApexCharts } from "./IChart";

export default class StatsChart extends React.Component<ApexChart, any> {
  private loading: boolean = true;
  constructor(props = {}) {
    super(props);

    this.getData();
  }

  componentDidMount(){
    this.loading = false
  }

  async getData() {
    await axios
      .get(configuration.API_URL + "/admin/home", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(async (resp) => {
        // console.log(resp.data)
        if (!this.loading) {
            let chartData  = await resp.data.chartData
            this.setState ({
              series: [
                {
                  name: "Amount",
                  data: [chartData.Monday, chartData.Tuesday, chartData.Wednesday,chartData.Thursday, chartData.Friday, chartData.Saturday, chartData.Sunday],
                },
              ],
              options: {
                chart: {
                  height: 350,
                  type: "line",
                  zoom: {
                    enabled: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "straight",
                },
                title: {
                  text: "Recognized amount of people this week",
                  align: "left",
                },
                grid: {
                  row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5,
                  },
                },
                xaxis: {
                  categories: [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
                  ],
                },
              },
            });
        }
      });
  }

  render() {
    return (
      <div id="chart">
        {this.loading ? <></> :
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={450}
        />}
      </div>
    );
  }
}
