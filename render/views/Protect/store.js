import { observable, action } from 'mobx';
import env from '$config/base';

class Store {
  @observable
  currentEnv = '';
  @observable
  currentUrlPrefix = '';

  @action.bound
  initValue() {
    this.currentEnv = env.currentEnv;
    this.currentUrlPrefix = env.getUrl();
  }

}
const store = new Store();

export default store;
