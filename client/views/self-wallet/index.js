import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from '../../components/AppBar';


const styles = {
};

class RentHistory extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <div>
        <AppBar />
        个人钱包
      </div>
    );
  }
}

export default withStyles(styles)(RentHistory);
