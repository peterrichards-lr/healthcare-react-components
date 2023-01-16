import HeartRateChart from './heart-rate-chart/HeartRateChart';
import BloodPressureChart from './blood-pressure-chart/BloodPressureChart';
import WeightChart from './weight-chart/WeightChart';
import StepsChart from './steps-chart/StepsChart';

const App = ({route, ...props}) => {
  if (route === 'weight') {
    return <WeightChart {...props} />;
  }
  if (route === 'steps') {
    return <StepsChart {...props} />;
  }
  if (route === 'blood-pressure') {
    return <BloodPressureChart {...props} />;
  }
  if (route === 'heart-rate') {
    return <HeartRateChart {...props} />;
  }
  return <HeartRateChart {...props} />;
};

export default App;
