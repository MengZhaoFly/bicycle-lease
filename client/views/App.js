import React from 'react';
import RouterConfig from '../config/router';
import { Link, Route } from 'react-router-dom';
import Home from './home/index';
import { withStyles } from 'material-ui/styles';
import RentHistory from './rent-history/index';

const styles = {
};

class App extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <RouterConfig />
      </div>
    );
  }
}

export default withStyles(styles)(App);

