import AppState from './appState';
import RentHistory from './rent-history';
export default {
  AppState,
  RentHistory
}

export const createStoreMap = () => {
  return {
    appState: new AppState()
  };
};
