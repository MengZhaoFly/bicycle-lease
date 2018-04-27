import { observable, computed, action, autorun } from 'mobx';

class RentHistory {
  constructor () {
    this.history = [];
  }
  @observable history
  @action fetchHistory (history) {
    /* eslint-disable */
    window.fetch(`${apiPrefix}/rent/list`, {
      mode: 'cors'
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log('fetch res---------------', data);
        this.history = data;
      })
      .catch(err => {
        console.log(err);
    })
  }
  toJson () {
    return {
      history: this.history
    }
  }
}


export default RentHistory;
