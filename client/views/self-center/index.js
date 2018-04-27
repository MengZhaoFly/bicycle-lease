import React from 'react';
import { withStyles } from 'material-ui/styles';
import { withRouter, Link } from 'react-router-dom'
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AppBar from '../../components/AppBar';
import editInfo from '@imagesPath/editinfo.png';
import history from '@imagesPath/history.png';
import wallet from '@imagesPath/wallet.png';


const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
};

class SelfCenter extends React.Component {
  handlePushState = (e) => {
    const href = e.currentTarget.dataset.go;
    console.log(href);
    this.props.history.push(href);
  }
  render() {
    const {classes} = this.props;
    return (
      <div>
        <AppBar />
        <div className={classes.row}>
          <Avatar
            alt="头像"
            src="http://p7mkbgmyd.bkt.clouddn.com/avatar.jpg"
            className={classes.bigAvatar}
          />
        </div>
        <div>
            <List component="nav">
            <ListItem button data-go="edit" onClick={this.handlePushState}>
              <ListItemIcon>
                <img src={editInfo} alt="个人资料" />
              </ListItemIcon>
              <ListItemText primary="个人资料" />
            </ListItem>
            <Divider />
            <ListItem button data-go="/wallet" onClick={this.handlePushState}>
              <ListItemIcon>
                <img src={wallet} alt="我的钱包"/>
              </ListItemIcon>
              <ListItemText primary="我的钱包" />
            </ListItem>
            <ListItem button onClick={this.handlePushState} data-go="/rent">
              <ListItemIcon>
                <img src={history} alt="骑行历史"/>
              </ListItemIcon>
              <ListItemText primary="骑行历史" />
            </ListItem>
          </List>
          </div>
      </div>
    );
  }
}
SelfCenter = withRouter(SelfCenter);
export default withStyles(styles)(SelfCenter);

