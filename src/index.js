import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import Root from './root';
import registerServiceWorker from './registerServiceWorker';

const render = Component => {
	ReactDOM.render(
		<Component />,
		document.querySelector('#root')
	);
}

render(Root);

registerServiceWorker();