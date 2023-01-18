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
import PubSub from 'pubsub-js';

import stepsApi from './StepsApi';
import { getCssVariable, propsStrToObj, isNumeric } from '../../common/utility';
import { TOP_LEVEL_TOPIC } from '../../common/const';

ChartJS.register(
  AnnotationPlugin,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TOPIC_NAME = `${TOP_LEVEL_TOPIC}:steps-chart`;

const StepsChart = (props) => {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  console.debug(`Param props.targetSteps=${props.targetSteps}`);
  const targetStepsInt = isNumeric(props.targetSteps)
    ? Number(props.targetSteps)
    : undefined;
  const targetSteps = Number.isInteger(targetStepsInt)
    ? parseInt(targetStepsInt)
    : 10000;
  console.debug(`Using targetSteps=${targetSteps}`);

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
      await stepsApi(startDate, endDate, maxEntries)
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
            const { stepCount, readingDate } = element;
            dates.push(new Date(readingDate).getDate());
            readings.push(stepCount);
          });
          setLabels(dates);
          setData(readings);
        })
        .catch((reason) => console.error(reason));
        setRefresh(false);
    })();
  }, [props, refresh]);

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
            data: data.map((value) => value < targetSteps ? value : null),
          },
          {
            backgroundColor: aboveTargetColor || 'green',
            data: data.map((value) => value >= targetSteps ? value : null),
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
