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
import PubSub from 'pubsub-js';

import bloodPressureApi from './BloodPressureApi';
import { getCssVariable, propsStrToObj } from '../../common/utility';
import { TOP_LEVEL_TOPIC } from '../../common/const';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TOPIC_NAME = `${TOP_LEVEL_TOPIC}:blood-pressure-chart`;

const BloodPressureChart = (props) => {
  const [labels, setLabels] = useState();
  const [systolicData, setSystolicData] = useState();
  const [diastolicData, setDiastolicData] = useState();
  const [refresh, setRefresh] = useState(false);

  const topicListener = (msg, data) => {
    console.log(msg, data);
    if (data && 'refresh' in data && data.refresh) {
      setRefresh(true);
    } else {
      console.info(`Unknown message - ${msg}`, data);
    }
  };

  useEffect(() => {
    PubSub.subscribe(TOP_LEVEL_TOPIC, topicListener);
    PubSub.subscribe(TOPIC_NAME, topicListener);

    return () => {
      PubSub.unsubscribe(topicListener);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { startDate, endDate, maxEntries } = propsStrToObj(props);
      await bloodPressureApi(startDate, endDate, maxEntries)
        .then((respone) => {
          const { items, pageSize, totalCount } = respone;
          if (items === undefined || !(items instanceof Array)) {
            console.warn('Items is not an array');
            return;
          }
          if (pageSize < totalCount) {
            console.warn(
              `The returned set of items is not the full set: returned ${pageSize}, set size ${totalCount}`
            );
          }
          if (items.length !== pageSize) {
            console.debug(
              `There are fewer items than requested: requested: returned ${items.length}, requested ${pageSize}`
            );
          }
          var dates = [];
          var systolicReadings = [];
          var diastolicReadings = [];
          items.reverse().forEach((element) => {
            const { systolic, diastolic, readingDate } = element;
            dates.push(new Date(readingDate).getDate());
            systolicReadings.push(systolic);
            diastolicReadings.push(diastolic);
          });
          setLabels(dates);
          setSystolicData(systolicReadings);
          setDiastolicData(diastolicReadings);
        })
        .catch((reason) => console.error(reason));
        setRefresh(false);
    })();
  }, [props, refresh]);

  const sysPointColor = getCssVariable('--bloodPressureChartSysPointColor');
  const sysLineColor = getCssVariable('--bloodPressureChartSysLineColor');
  const diaLPointColor = getCssVariable('--bloodPressureChartDiaPointColor');
  const diaLLineColor = getCssVariable('--bloodPressureChartDiaLineColor');

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: 'SYS',
            backgroundColor: sysPointColor || 'orange',
            borderColor: sysLineColor || 'orange',
            data: systolicData,
          },
          {
            label: 'DIA',
            backgroundColor: diaLPointColor || 'red',
            borderColor: diaLLineColor || 'red',
            data: diastolicData,
          },
        ],
      }}
      options={{
        responsive: true,
        scales: {
          y: {
            type: 'linear',
            min: 50,
            max: 200,
          },
          x: {
            type: 'category',
            offset: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Blood Pressure',
          },
          legend: {
            position: 'top',
          },
        },
      }}
    />
  );
};

export default BloodPressureChart;
