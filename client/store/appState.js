import { observable, computed, action, autorun, toJS } from 'mobx';

class AppState {
  constructor () {
    this.isLogin = false;
    this.userId = null;
    this.avatarSrc = null;
  }
  @observable isLogin
  @observable userId
  @observable avatarSrc
  @action changeLoginStatus (status, userId, avatarSrc) {
    this.isLogin = status;
    this.userId = userId;
    if (avatarSrc) {
      this.avatarSrc = avatarSrc;
    }
    
  }
  @action changeAvatarSrc (avatarSrc) {
    this.avatarSrc = avatarSrc;
  }
  toJson () {
    return {
      isLogin: this.isLogin,
      userId: toJS(this.userId),
      avatarSrc: toJS(this.avatarSrc)
    };
  }
}


export default AppState;