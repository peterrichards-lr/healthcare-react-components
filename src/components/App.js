import HeartRateChart from './heart-rate-chart/HeartRateChart';

const App = ({ route }) => {
	return <HeartRateChart
		startDate={new Date(2023,0,8)}
	/>
};

export default App;