import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import AnnotationPlugin from 'chartjs-plugin-annotation';

import stepsApi from "./StepsApi";

ChartJS.register(
  AnnotationPlugin,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StepsChart = (props) => {
  const { startDate, endDate, maxEntries = 7, targetSteps = 10000 } = props;
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      await stepsApi(startDate, endDate, maxEntries)
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
            const { stepCount, readingDate } = element;
            dates.push(new Date(readingDate).getDate());
            readings.push(stepCount);
          });
          setLabels(dates);
          setData(readings);
        })
        .catch((reason) => console.error(reason));
    })();
  }, [startDate, endDate, maxEntries, targetSteps]);

  console.log(labels);
  console.log(data);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            backgroundColor: "lightgray",
            data: data.map(function (value) {
              return value < targetSteps ? value : null;
            }),
          },
          {
            backgroundColor: "green",
            data: data.map(function (value) {
              return value >= targetSteps ? value : null;
            }),
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
            text: "Steps",
          },
          annotation: {
            annotations: {
              target: {
                type: 'line',
                yMin: targetSteps,
                yMax: targetSteps,
                borderColor: 'green',
                borderDash: [20, 30]
              }
            }
          }
        }
      }}
    />
  );
};

export default StepsChart;