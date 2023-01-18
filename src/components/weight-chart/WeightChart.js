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

import weightApi from './WeightApi';
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

const TOPIC_NAME = `${TOP_LEVEL_TOPIC}:weight-chart`;

const WeightChart = (props) => {
  const [labels, setLabels] = useState();
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(true);

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
      await weightApi(startDate, endDate, maxEntries)
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
          var readings = [];
          items.reverse().forEach((element) => {
            const { weight, readingDate } = element;
            dates.push(new Date(readingDate).getDate());
            readings.push(weight);
          });
          setLabels(dates);
          setData(readings);
          setRefresh(false);
        })
        .catch((reason) => console.error(reason));
    })();
  }, [props,refresh]);

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
