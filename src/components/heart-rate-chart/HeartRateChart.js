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

import heartRateApi from './HeartRateApi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const HeartRateChart = (props) => {
  const { startDate, endDate, maxEntries = 7 } = props;
  const [labels, setLabels] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      await heartRateApi(startDate, endDate, maxEntries)
        .then((respone) => {
          const { items, pageSize, totalCount } = respone;
          if (items === undefined || !(items instanceof Array)) {
            console.warn('Items is not an array');
            return;
          }
          if (pageSize < totalCount) {
            console.warn('The returned set of items is not the full set');
          }
          if (items.length !== pageSize) {
            console.info('There are fewer items than requested');
          }
          console.log(items);
          var dates = [];
          var readings = [];
          items.reverse().forEach((element) => {
            const { lowest, highest, readingDate } = element;
            dates.push(new Date(readingDate).getDate());
            readings.push([lowest, highest]);
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
    <Bar 
      data={{
        labels,
        datasets: [
            {
                backgroundColor: 'orange',
                data
            }
        ]
      }}
      options={{
        responsive: true,
        scales: {
            y: {
                type: 'linear',
                min: 25,
                max: 220
            }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Heart Rate',
          }
        }
      }}
    />
  );
};

export default HeartRateChart;