import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import AnnotationPlugin from 'chartjs-plugin-annotation';

import stepsApi from './StepsApi';
import { getCssVariable, propsStrToObj } from '../../common/utility';

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
  var { startDate, endDate, maxEntries, targetSteps } = propsStrToObj(props);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  targetSteps =
    targetSteps ? targetSteps : 10000;

  useEffect(() => {
    (async () => {
      await stepsApi(startDate, endDate, maxEntries)
        .then((respone) => {
          const { items, pageSize, totalCount } = respone;
          if (items === undefined || !(items instanceof Array)) {
            console.warn('Items is not an array');
            return;
          }
          if (pageSize < totalCount) {
            console.warn(`The returned set of items is not the full set: returned ${pageSize}, set size ${totalCount}`);
          }
          if (items.length !== pageSize) {
            console.debug(`There are fewer items than requested: requested: returned ${items.length}, requested ${pageSize}`);
          }
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
  }, []);

  const targetLineColor = getCssVariable('--stepsChartTargetLineColor');
  const belowTargetColor = getCssVariable('--stepsChartBelowTargetBarColor');
  const aboveTargetColor = getCssVariable('--stepsChartAboveTargetBarColor');

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            backgroundColor: belowTargetColor || 'lightgray',
            data: data.map(function (value) {
              return value < targetSteps ? value : null;
            }),
          },
          {
            backgroundColor: aboveTargetColor || 'green',
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
            type: 'linear',
          },
          x: {
            type: 'category',
            stacked: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Steps',
          },
          annotation: {
            annotations: {
              target: {
                type: 'line',
                yMin: targetSteps,
                yMax: targetSteps,
                borderColor: targetLineColor || 'green',
                borderDash: [20, 30],
              },
            },
          },
        },
      }}
    />
  );
};

export default StepsChart;
