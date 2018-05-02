import { observable, computed, action, autorun, toJS } from 'mobx';
import { get } from '../http/axios';

class RentHistory {
  constructor() {
    this.history = null;
    this.temp = 90;
  }
  @observable history
  @observable temp
  @action fetchHistory(history) {
    /* eslint-disable */
    return new Promise((resolve, reject) => {
      get(`/rent/list`)
        .then(data => {
          console.log('fetch res---------------', data);
          this.history = data;
          resolve(data)
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  }
  @action changeTemp(val) {
    this.temp = val;
  }
  toJson() {
    return {
      history: toJS(this.history)
    }
  }
}


export default RentHistory;
