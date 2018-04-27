import React from 'react';
import {observer, inject} from 'mobx-react';
import { BrowserRouter, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Home from '../views/home/index';
import RentHistory from '../views/rent-history/index';
import SelfCenter from '../views/self-center/index';
import SelfEdit from '../views/self-edit/index';
import SelfWallet from '../views/self-wallet/index';

@observer
class PrivateRoute extends React.Component {
  render() {
    const {isLogin, component: Component, ...rest} = this.props;
    return (
      <Route {...rest} render={(props) =>
        (
          isLogin ?
            <Component {...props} />
            : <Redirect to={{
              pathname: '/signin',
              search: `?from=${rest.path}`
            }} />
        )
      } />
    );
  }
}
// fix mobx edit context
PrivateRoute = withRouter(PrivateRoute);

export default () => {
  return (
    <Switch>
      <Route exact path='/' render={() => <Redirect to='/index' />} />
      <Route path='/index' component={Home} />
      <Route path='/rent' component={RentHistory} />
      <Route path='/self' component={SelfCenter} />
      <Route path='/edit' component={SelfEdit} />
      <Route path='/wallet' component={SelfWallet} />
    </Switch>
  );
};
