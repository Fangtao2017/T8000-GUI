import React from 'react';
import Overview from './Overview';

const Home: React.FC = () => {
	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<div style={{ flex: 1, overflow: 'hidden' }}>
				<Overview />
			</div>
		</div>
	);
};

export default Home;

