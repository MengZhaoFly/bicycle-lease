import React from 'react';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import { withRouter, Link } from 'react-router-dom';
import AppBar from '../../components/AppBar';
import Snackbar from 'material-ui/Snackbar';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Button from 'material-ui/Button';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import IconButton from 'material-ui/IconButton';
import { get, post } from '../../http/axios';

const styles = theme => {
  return {
    row: {
      display: 'flex',
      justifyContent: 'center',
    },
    bigAvatar: {
      width: 60,
      height: 60,
      margin: 10,
    },
    margin: {
      margin: theme.spacing.unit,
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
    uploadFile: {
      width: 60,
      height: 60,
      marginTop: 10,
      position: 'absolute',
      backgroundColor: '#666',
      opacity: 0.8,
      borderRadius: '50%',
      userSelect: 'none',
      '& > input': {
        width: 0,
        height: 0,
        display: 'none'
      },
      '& > label': {
        display: 'block',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        lineHeight: '50px',
        fontSize: 60,
        cursor: 'pointer',
        fontWeight: 200
      }
    }
  }
}

@inject('appState') @observer
class RentHistory extends React.Component {
  constructor() {
    super();
    this.fileInput = null;
    this.state = {
      open: false,
      Transition: null,
      snacksMsg: null,
      password: '',
      repassword: '',
      pwdError: false,
      rePwdError: false,
      showPassword: false,
      showrePassword: false
    }
  }
  handleClick = (state) => {
    this.setState({ open: true, ...state });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  handleClickShowrePassword = () => {
    this.setState({ showrePassword: !this.state.showrePassword });
  };
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
      })
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
  handleChangePwd = () => {
    const {pwdError, rePwdError, repassword} = this.state;
    if (!pwdError && !rePwdError && this.props.appState.userId) {
      post('/user/edit', {
        passWord: repassword,
        userId: this.props.appState.userId
      })
      .then(res => {
        if (res.status === 200) {
          this.handleClick({ vertical: 'bottom', horizontal: 'center', snacksMsg: '更换资料成功' });
          this.props.appState.changeLoginStatus(false, null);
          this.props.appState.changeAvatarSrc(null);
          setTimeout(() => {
            this.props.history.push('/signin');
          }, 1000);
        }
        else {
          this.handleClick({ vertical: 'bottom', horizontal: 'center', snacksMsg: '更换资料失败' });
        }
      })
    }
  }
  handleMouseDownPassword = event => {
    event.preventDefault();
  };
  handleFileChange = (e) => {
    if (this.fileInput && this.fileInput.files) {
      let data = new FormData();
      let file = this.fileInput.files[0];
      data.append('file', file);
      if (this.props.appState.userId) {
        data.append('userId', this.props.appState.userId);
      }
      console.log(data);
      post('/upload', data)
        .then(res => {
          if (res.status === 200) {
            this.handleClick({ vertical: 'bottom', horizontal: 'center', snacksMsg: '更换头像成功' });
            this.props.appState.changeAvatarSrc(res.avatarSrc);
          }
          else {
            this.handleClick({ vertical: 'bottom', horizontal: 'center', snacksMsg: '更换头像失败' });
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
  render() {
    window.appState = this.props.appState;
    const { classes } = this.props;
    const { snacksMsg, vertical, horizontal, open, rePwdError, pwdError } = this.state;
    const { avatarSrc } = this.props.appState;
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleClose}
          autoHideDuration={2000}
          contentprops={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{snacksMsg}</span>}
        />
        <AppBar />
        <div className={classes.row}>
          {
            avatarSrc ?
              (
                <React.Fragment>
                  <Avatar
                    alt="头像"
                    src={avatarSrc}
                    className={classes.bigAvatar}
                  />
                  <div className={classes.uploadFile}>
                    <input type="file" name="file"
                      accept="image/gif, image/jpeg, image/png"
                      id="file"
                      onChange={this.handleFileChange} ref={(ref) => {
                        this.fileInput = ref;
                      }} />
                    <label htmlFor="file">+</label>
                  </div>
                </React.Fragment>
              ) :
              <div>头像加载中</div>
          }
        </div>
        <div className={classNames(classes.formContent, classes.formWrap)}>
          <div className={classes.formContent}>
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
              <Button variant="raised" color="primary" className={classes.button} onClick={this.handleChangePwd}>
                修改密码
            </Button>
            </FormControl>
          </div>
        </div>
      </div>
    );
  }
}
RentHistory = withRouter(RentHistory);
export default withStyles(styles)(RentHistory);
