import React from 'react';
import { withStyles } from 'material-ui/styles';
import { observer, inject } from 'mobx-react';
import { CircularProgress } from 'material-ui/Progress';
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
  }
});

// @inject('rentHistory') @observer
@inject('rentHistory') @observer
class RentHistoryList extends React.Component {
  componentDidMount = () => {
    this.props.rentHistory.fetchHistory();
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
    })
  }
  renderList = () => {
    const {classes} = this.props;
    const {history} = this.props.rentHistory;
    const historyList = history && history.slice(0);
    if (!historyList) {
      return (
        <CircularProgress className={classes.progress} size={50} />
      );
    }
    return (
      historyList.map((list, i) => (
        <div key={i}>
          <Paper className={classes.root} elevation={4}>
            <Typography variant="headline" component="h3">
              {list.beginTime + '至' + list.endTime}
            </Typography>
            <Typography component="p">
              车辆编号：{list.bicycleID} 花费{list.pay}
            </Typography>
          </Paper>
        </div>
      ))
    );
  }
  render() {
    return (
      <div>
        <AppBar />
        {this.renderList()}
      </div>
    );
  }
}

export default withStyles(styles)(RentHistoryList);
