import { observable, computed, action, autorun } from 'mobx';

class AppState {
  constructor () {
    this.isLogin = false;
  }
  @observable isLogin
  @action changeLoginStatus (status) {
    this.isLogin = status;
  }
  toJson () {
    return {
      isLogin: this.isLogin
    };
  }
}


export default AppState;



