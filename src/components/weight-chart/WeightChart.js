import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import weightApi from "./WeightApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightChart = (props) => {
  const { startDate, endDate, maxEntries = 7 } = props;
  const [labels, setLabels] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      await weightApi(startDate, endDate, maxEntries)
        .then((respone) => {
          const { items, pageSize, totalCount } = respone;
          if (items === undefined || !(items instanceof Array)) {
            console.warn("Items is not an array");
            return;
          }
          if (pageSize < totalCount) {
            console.warn("The returned set of items is not the full set");
          }
          if (items.length !== pageSize) {
            console.info("There are fewer items than requested");
          }
          console.log(items);
          var dates = [];
          var readings = [];
          items.reverse().forEach((element) => {
            const { weight, readingDate } = element;
            dates.push(new Date(readingDate).getDate());
            readings.push(weight);
          });
          setLabels(dates);
          setData(readings);
        })
        .catch((reason) => console.error(reason));
    })();
  }, [startDate, endDate, maxEntries]);

  console.log(labels);
  console.log(data);

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            backgroundColor: "white",
            borderColor: "green",
            data,
          },
        ],
      }}
      options={{
        responsive: true,
        scales: {
          y: {
            type: "linear",
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Weight',
          }
        },
      }}
    />
  );
};

export default WeightChart;