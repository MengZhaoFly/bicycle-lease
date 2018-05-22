import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { observer, inject } from 'mobx-react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import AccountCircle from 'material-ui-icons/AccountCircle';
import LOGO from '@imagesPath/bicycle.svg';
import { get, post } from '../http/axios';

const styles = {
  root: {
    flexGrow: 1,
    '& a': {
      textDecoration: 'none',
      color: '#fff'
    },
    '& a:active': {
      color: '#fff'
    }
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  fullLogo: {
    width: '100%',
    height: '100%',
    paddingRight: 5
  },
  fullLogoSubtitle: {
    fontSize: '76%',
    letterSpacing: '.2em',
    fontWeight: 'bold'
  }
};

@inject('appState') @observer
class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };
  componentDidMount = () => {
    get('/sign/auth')
      .then(res => {
        if (res.status === 200) {
          this.props.appState.changeLoginStatus(true, res.userId);
          this.props.appState.changeAvatarSrc(res.avatarSrc);
          setTimeout(() => {
            this.props.onFinishAuth && this.props.onFinishAuth();
          }, 0);
        }
        
      });
  }
  // login logout control
  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton>
              <span dangerouslySetInnerHTML={{__html: LOGO}} className={classes.fullLogo} onClick={() => {
                this.props.history.push('/');
              }}>
              </span>

            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Link to="/" className={classes.fullLogoSubtitle}>
                   自行车租赁
              </Link>
            </Typography>
            {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <Link to="/self">
                    <AccountCircle />
                  </Link>
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};
MenuAppBar = withRouter(MenuAppBar);
export default withStyles(styles)(MenuAppBar);

