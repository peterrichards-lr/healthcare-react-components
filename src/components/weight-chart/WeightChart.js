import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import weightApi from './WeightApi';
import { getCssVariable, propsStrToObj } from '../../common/utility';

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
  const [labels, setLabels] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    const { startDate, endDate, maxEntries} = propsStrToObj(props);
    (async () => {
      await weightApi(startDate, endDate, maxEntries)
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
            const { weight, readingDate } = element;
            dates.push(new Date(readingDate).getDate());
            readings.push(weight);
          });
          setLabels(dates);
          setData(readings);
        })
        .catch((reason) => console.error(reason));
    })();
  }, [props]);

  const weightPointColor = getCssVariable('--weightChartPointColor');
  const weightLineColor = getCssVariable('--weightChartLineColor');

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            backgroundColor: weightPointColor || 'white',
            borderColor: weightLineColor || 'green',
            data,
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
            offset: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Weight',
          },
        },
      }}
    />
  );
};

export default WeightChart;
