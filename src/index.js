
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route, Switch, Redirect } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';

import registerServiceWorker from './registerServiceWorker';

import './assets/css/index.css';
import Slider from './components/Slider.js';
import VideoPlayer from './components/Video-player.js';
import MyFancyComponent from './components/Map.js';

const history = createHistory();
const middleware = routerMiddleware(history);

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  compose(
    applyMiddleware(middleware, reduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path='/' component={MyFancyComponent} />
        <Redirect to='/' />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();


// ReactDOM.render(
//   <Provider store={store}>
//     <ConnectedRouter history={history}>
//       <Switch>
//         <Route exact path='/' component={Slider} />
//         <Route path='/play/:videoId' component={VideoPlayer} />
//         <Redirect to='/' />
//       </Switch>
//     </ConnectedRouter>
//   </Provider>,
//   document.getElementById('root')
// );
// registerServiceWorker();
