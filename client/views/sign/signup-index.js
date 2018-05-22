import React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { withRouter, Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import AppBar from '../../components/AppBar';
import { post } from '../../http/axios';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import AccountCircle from 'material-ui-icons/AccountCircle';

// theme.globalClass.heightFull
const styles = theme => {
  console.log(theme);
  return {
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
    buttonLike: {
      color: theme.palette.primary.main
    }
  };
};

class Signin extends React.Component {
  state = {
    phoneNum: '',
    phoneNumError: false,
    password: '',
    repassword: '',
    pwdError: false,
    rePwdError: false,
    weight: '',
    weightRange: '',
    showPassword: false,
    showrePassword: false,
    dialogOpen: false,
    dialogMsg: null
  };
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };
  handlePhoneBlur = () => {
    const reg = /^1[0-9]{10}$/;
    const {phoneNum} = this.state;
    if (phoneNum.length === 0) return false;
    if (reg.test(phoneNum)) {
      this.setState({
        phoneNumError: false
      });
    }
    else {
      this.setState({
        phoneNumError: true
      });
    }
  }
  handleValidate = (pwd) => {
    if (pwd.length < 6) {
      return false;
    }
    if (!/[0-9]/.test(pwd) || !/[a-zA-z]/.test(pwd)) {
      return false;
    }
    return true;
  }
  handlePasswordBlur = () => {
    const {password, repassword} = this.state;
    if (!this.handleValidate(password)) {
      this.setState({
        pwdError: true
      });
      return false;
    }
    // 先focus pwd 然后 blur pwdError: true 之后没有设为 false
    if (this.handleValidate(password) && password !== repassword) {
      this.setState({
        rePwdError: true
      });
    }
    else {
      this.setState({
        rePwdError: false
      });
    }
  }
  handleRepasswordBlur = () => {
    const {password, repassword} = this.state;
    if (password.length === 0 && repassword.length === 0) return false;
    if (password !== repassword) {
      this.setState({
        rePwdError: true
      });
    }
    else {
      this.setState({
        rePwdError: false
      });
    }
  }
  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  handleClickShowrePassword = () => {
    this.setState({ showrePassword: !this.state.showrePassword });
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
  handleSignup = () => {
    const {password, repassword, phoneNum} = this.state;
    post('/sign/up', {
      phoneNum,
      password
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            dialogOpen: true,
            dialogMsg: res.msg
          });

        }
        else {
          this.setState({
            dialogOpen: true,
            dialogMsg: res.msg
          });
        }
      });
  }
  render() {
    const {classes} = this.props;
    const {phoneNumError, pwdError, rePwdError} = this.state;
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
            <span onClick={this.handleClose} className={classes.buttonLike}>
              OK
            </span>
          </DialogActions>
        </Dialog>
        <AppBar />
        <div className={classNames(classes.formContent, classes.formWrap)}>
          <div className={classes.formContent}>
            <FormControl className={classNames(classes.margin, classes.textField, classes.firstControl)} error={phoneNumError} aria-describedby="name-error-text">
              <InputLabel htmlFor="phoneNum">手机号码</InputLabel>
              <Input
                id="phoneNum"
                type={'text'}
                value={this.state.phoneNum}
                onChange={this.handleChange('phoneNum')}
                onBlur={this.handlePhoneBlur}
                endAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                }
              />
              {phoneNumError && <FormHelperText id="name-error-text">手机号码不合法</FormHelperText>}
            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)} error={pwdError} aria-describedby="name-error-text">
              <InputLabel htmlFor="password">密码</InputLabel>
              <Input
                id="password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.handleChange('password')}
                onBlur={this.handlePasswordBlur}
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
              {pwdError && <FormHelperText id="name-error-text">密码由字母数字组成，长度大于６</FormHelperText>}
            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)}
              error={rePwdError}
              aria-describedby="pwd-error-text">
              <InputLabel htmlFor="repassword">再次输入密码</InputLabel>
              <Input
                id="repassword"
                type={this.state.showrePassword ? 'text' : 'password'}
                value={this.state.repassword}
                onChange={this.handleChange('repassword')}
                onBlur={this.handleRepasswordBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowrePassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {rePwdError && <FormHelperText id="pwd-error-text">两次密码不一致</FormHelperText>}

            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <Link to="signin">
                <Typography component="p">有账号？去登录</Typography>
              </Link>
            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <Button variant="raised" color="primary" className={classes.button} onClick={this.handleSignup}>
                注册
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

