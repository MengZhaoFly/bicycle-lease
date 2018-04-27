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
        个人中心编辑
      </div>
    );
  }
}

export default withStyles(styles)(RentHistory);
