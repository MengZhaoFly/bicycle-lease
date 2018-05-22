import React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import AppBar from '../../components/AppBar';
import { post } from '../../http/axios';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import MenuItem from 'material-ui/Menu/MenuItem';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import AccountCircle from 'material-ui-icons/AccountCircle';


const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  button: {
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 100,
    margin: '0 40px'
  },
  formWrap: {
    height: theme.globalClass.heightFull,
    justifyContent: 'center'
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  toSignup: {
    margin: '20px 0 5px 0'
  },
  buttonLike: {
    color: theme.palette.primary.main
  }
});

@inject('appState') @observer
class Signin extends React.Component {
  state = {
    phoneNum: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
    dialogOpen: false,
    dialogMsg: null
  };
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };
  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  handlePushState = (e) => {
    const href = e.currentTarget.dataset.go;
    console.log(href);
    this.props.history.push(href);
  }
  handleClose = () => {
    this.setState({
      dialogOpen: false,
      dialogMsg: null
    });
  }
  handleSignIn = () => {
    const { phoneNum, password } = this.state;
    post('/sign/in', {
      phoneNum,
      password
    })
      .then(res => {
        if (res.status === 200) {
          if (res.jwt) {
            localStorage.setItem('jwt', res.jwt);
          }
          console.log('登陆结果', res);
          this.setState({
            dialogOpen: true,
            dialogMsg: res.msg
          });
          this.props.appState.changeLoginStatus(true, res.userID);
          this.props.appState.changeAvatarSrc(res.avatarSrc);
        }
        else {
          this.setState({
            dialogOpen: true,
            dialogMsg: res.msg
          });
        }
      });
  }
  handleOK = () => {
    const search = this.props.history.location && this.props.history.location.search;
    // ?from=/index
    this.setState({
      dialogOpen: false,
      dialogMsg: null
    });
    if (search) {
      let searchVal = search.split('=');
      this.props.history.push(searchVal[1]);
    }
  }
  render() {
    const {classes} = this.props;
    return (
      <div>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">提示信息</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.dialogMsg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <span onClick={this.handleOK} className={classes.buttonLike}>
              OK
            </span>
          </DialogActions>
        </Dialog>
        <AppBar />
        <div className={classNames(classes.formContent, classes.formWrap)}>
          <div className={classes.formContent}>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="phoneNum">phoneNum</InputLabel>
              <Input
                id="phoneNum"
                type={'text'}
                value={this.state.phoneNum}
                onChange={this.handleChange('phoneNum')}
                endAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <Link to="signup" className={classes.toSignup}>
                <Typography component="p">没有账号？去注册</Typography>
              </Link>
            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)}>

              <Button variant="raised" color="primary" className={classes.button} onClick={this.handleSignIn}>
                登录
              </Button>
            </FormControl>
          </div>
        </div>
      </div>
    );
  }
}
Signin = withRouter(Signin);
export default withStyles(styles)(Signin);

