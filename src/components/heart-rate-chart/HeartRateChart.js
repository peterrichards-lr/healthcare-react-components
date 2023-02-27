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
import PubSub from 'pubsub-js';

import heartRateApi from './HeartRateApi';
import { getCssVariable, propsStrToObj } from '../../common/utility';
import { TOP_LEVEL_TOPIC } from '../../common/const';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TOPIC_NAME = `${TOP_LEVEL_TOPIC}:heart-rate-chart`;

const HeartRateChart = (props) => {
  const [labels, setLabels] = useState();
  const [data, setData] = useState();
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
      await heartRateApi(startDate, endDate, maxEntries)
        .then((response) => {
          const { items, pageSize, totalCount } = response;
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
        setRefresh(false);
    })();
  }, [props, refresh]);

  const heartRateBarColor = getCssVariable('--heartRateChartBarColor');

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            backgroundColor: heartRateBarColor || 'orange',
            data,
          },
        ],
      }}
      options={{
        responsive: true,
        scales: {
          y: {
            type: 'linear',
            min: 25,
            max: 220,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Heart Rate',
          },
        },
      }}
    />
  );
};

export default HeartRateChart;
