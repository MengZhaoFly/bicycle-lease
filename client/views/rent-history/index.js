import React from 'react';
import { withStyles } from 'material-ui/styles';
import { observer, inject } from 'mobx-react';
import { CircularProgress } from 'material-ui/Progress';
import { withRouter, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { RentHistory } from '../../store/store';
import AppBar from '../../components/AppBar';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
  progress: {
    margin: theme.spacing.unit * 2,
  },
  container: {
    position: 'relative'
  },
  loading: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)'
  }
});

// @inject('appState') @observer
// @inject('rentHistory', 'appState') @observer()
// @inject('rentHistory') @observer()
@inject('rentHistory', 'appState') @observer(['rentHistory', 'appState'])
class RentHistoryList extends React.Component {
  componentDidMount = () => {
    if (this.props.appState.isLogin) {
      this.props.rentHistory.fetchHistory(this.props.appState.userId);
    }
    else {
      console.warn('not login');
      this.props.history.push('/signin');
    }
    setTimeout(() => {
      this.props.rentHistory.changeTemp(100);
    }, 3000);
  }
  asyncBootstrap = () => {
    console.log('asyncBootstrap', this.props.rentHistory.fetchHistory());
    return this.props.rentHistory.fetchHistory().then((res) => {
      console.log('asyncBootstrap res', res);
      return true;
    })
      .catch(err => {
        return false;
      });
  }
  renderList = () => {
    const {classes} = this.props;
    const {history} = this.props.rentHistory;
    const historyList = history && history.slice(0);
    console.log('historyList', historyList);
    if (!historyList) {
      return (
        <div className={classes.loading}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
      );
    }
    if (historyList.length === 0) {
      return (
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            暂无记录
          </Typography>
          <Typography component="p">
            快去选择一辆车吧。
          </Typography>
        </Paper>
      );
    }
    return (
      historyList.map((list, i) => (
        <Paper className={classes.root} elevation={4} key={i}>
          <Typography variant="headline" component="h3">
            {list.beginTime + '至' + list.endTime}
          </Typography>
          <Typography component="p">
            车辆编号：{list.bicycleID} 花费{list.pay}
          </Typography>
        </Paper>
      ))
    );
  }
  render() {
    const {classes} = this.props;
    return (
      <div>
        <AppBar />
        <div className={classes.container}>
          {this.renderList()}
        </div>
      </div>
    );
  }
}
RentHistoryList = withRouter(RentHistoryList);
export default withStyles(styles)(RentHistoryList);
