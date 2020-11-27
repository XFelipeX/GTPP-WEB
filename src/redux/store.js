import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userAuthReducer from './userAuth/userAuthReducer';
import taskStatesReducer from './taskStates/taskStatesReducer';
import stateUpdateReducer from './stateUpdate/stateUpdateReducer';
import visionMenuReducer from './visionMenu/visionMenuReducer';
import userPhotosReducer from './userPhotos/userPhotosReducer';
import taskDeptsReducer from './taskDepts/taskDeptsReducer';
import taskCompanyReducer from './taskCompany/taskCompanyReducer';
import tasks from './tasks/taskReducer';
import taskShopReducer from './taskShop/taskShopReducer';
import taskVisibleReducer from './taskVisible/taskVisibleReducer'
import taskItemReducer from './taskItem/taskItemReducer';
import vinculatedUsersReducer from './vinculatedUsers/vinculatedUsersReducer';
import taskTopicUpdateReducer from './taskTopicUpdate/taskTopicUpdateReducer';
import updateTaskVisible from './taskVisibleUpdate/taskVisibleUpdateReducer';

const rootReducer = combineReducers({
  permissions: userAuthReducer,
  taskStates: taskStatesReducer,
  stateUpdate: stateUpdateReducer,
  visionMenu: visionMenuReducer,
  userPhotos: userPhotosReducer,
  taskDepts : taskDeptsReducer, 
  taskCompanies : taskCompanyReducer,
  tasks,
  taskShop : taskShopReducer,
  taskVisible : taskVisibleReducer,
  taskItemControl: taskItemReducer,
  vinculatedUsers:vinculatedUsersReducer,
  updateTopic: taskTopicUpdateReducer,
  updateTaskVisible,
})

const persistConfig = {
  key: 'primary',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export const persistor = persistStore(store);


