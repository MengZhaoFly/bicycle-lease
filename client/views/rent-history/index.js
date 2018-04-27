import React from 'react';
import { withStyles } from 'material-ui/styles';
import {observer, inject} from 'mobx-react';
import { RentHistory } from '../../store/store';
import AppBar from '../../components/AppBar';


const styles = {
};

// @inject('rentHistory') @observer
@inject('rentHistory') @observer
class RentHistoryList extends React.Component {
  componentDidMount = () => {
    this.props.rentHistory.fetchHistory()
    // setTimeout(() => {
    //   this.props.appState.changeLoginStatus(true);
    // }, 2000)
  }
  render() {
    // const {classes} = this.props;
    let {history} = this.props.rentHistory;
    history = history.slice(0);
    console.log('history', history.slice(0));
    return (
      <div>
        <AppBar />
        List:
        {history.map((list, i) => (
          <p key={i}>
            {list.beginTime}
            {list.endTime}
          </p>
        ))}
        {/*{this.props.appState.isLogin ? 'true': 'false'}*/}
      </div>
    );
  }
}

export default withStyles(styles)(RentHistoryList);
