import HeartRateChart from "./heart-rate-chart/HeartRateChart";
import BloodPressureChart from "./blood-pressure-chart/BloodPressureChart";
import WeightChart from "./weight-chart/WeightChart";
import StepsChart from "./steps-chart/StepsChart";

const App = ({ route }) => {
  if (route === 'weight') {
    return <WeightChart startDate={new Date(2023, 0, 8)} />;
  }
  if (route === 'steps') {
    return <StepsChart startDate={new Date(2023, 0, 8)} />;
  }
  if (route === 'blood-pressure') {
    return <BloodPressureChart startDate={new Date(2023, 0, 8)} />;
  }
  return <HeartRateChart startDate={new Date(2023, 0, 8)} />;
};

export default App;
