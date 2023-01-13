import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import bloodPressureApi from './BloodPressureApi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );

const BloodPressureChart = (props) => {
  const [labels, setLabels] = useState();
  const [diastolicData, setDiastolicData] = useState();
  const [systolicData, setSystolicData] = useState();

  useEffect(() => {
    (async () => {
      await bloodPressureApi(props.startDate, props.endDate, props.maxEntries)
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
          var diastolicReadings = [];
          var systolicReadings = [];
          items.reverse().forEach((element) => {
            const { diastolic, systolic, readingDate } = element;
            dates.push(new Date(readingDate).getDate());
            diastolicReadings.push(diastolic);
            systolicReadings.push(systolic);
          });
          setLabels(dates);
          setDiastolicData(diastolicReadings);
          setSystolicData(systolicReadings);
        })
        .catch((reason) => console.error(reason));
    })();
  }, [props.startDate, props.endDate, props.maxEntries]);

  console.log(labels);
  console.log(diastolicData);
  console.log(systolicData);

  return (
    <Line 
      data={{
        labels,
        datasets: [
            {
                label: 'SYS',
                backgroundColor: 'red',
                borderColor: 'red',
                data: systolicData
            },
            {
                label: 'DIA',
                backgroundColor: 'orange',
                borderColor: 'orange',
                data: diastolicData
            }
        ]
      }}
      options={{
        responsive: true,
        scales: {
            y: {
                type: 'linear',
                min: 50,
                max: 200
            }
        }
      }}
    />
  );
};

export default BloodPressureChart;
