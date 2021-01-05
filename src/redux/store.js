import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userAuthReducer from "./userAuth/userAuthReducer";
import taskStatesReducer from "./taskStates/taskStatesReducer";
import stateUpdateReducer from "./stateUpdate/stateUpdateReducer";
import visionMenuReducer from "./visionMenu/visionMenuReducer";
import userPhotosReducer from "./userPhotos/userPhotosReducer";
import taskDeptsReducer from "./taskDepts/taskDeptsReducer";
import taskCompanyReducer from "./taskCompany/taskCompanyReducer";
import tasks from "./tasks/taskReducer";
import taskShopReducer from "./taskShop/taskShopReducer";
import taskVisibleReducer from "./taskVisible/taskVisibleReducer";
import taskItemReducer from "./taskItem/taskItemReducer";
import vinculatedUsersReducer from "./vinculatedUsers/vinculatedUsersReducer";
import taskTopicUpdateReducer from "./taskTopicUpdate/taskTopicUpdateReducer";
import taskCsdsReducer from "./taskCsds/taskCsdsReducer";
import modalUpdateReducer from "./modalUpdate/modalUpdateReducer";
import topicUpdateReducer from "./topicUpdate/topicUpdateReducer";
import userInfoReducer from "./userInfo/userInfoReducer";
// import loadingScreenReducer from './loadingScreen/loadingScreenReducer';
import taskUsersPhotos from './taskUsersPhotos/taskUsersPhotosReducer';
import filterTasksReducer from './filterTasks/filterTasksReducer';
import orderTasksReducer from './orderTasks/orderTasksReducer';
import seeAdminReducer from './seeAdmin/seeAdminReducer';

const appReducer = combineReducers({
  permissions: userAuthReducer,
  taskStates: taskStatesReducer,
  stateUpdate: stateUpdateReducer,
  visionMenu: visionMenuReducer,
  userPhotos: userPhotosReducer,
  taskDepts: taskDeptsReducer,
  taskCompanies: taskCompanyReducer,
  tasks,
  taskShop: taskShopReducer,
  taskVisible: taskVisibleReducer,
  taskItemControl: taskItemReducer,
  vinculatedUsers: vinculatedUsersReducer,
  updateTopic: taskTopicUpdateReducer,
  taskCsds: taskCsdsReducer,
  modalUpdate: modalUpdateReducer,
  topicUpdate: topicUpdateReducer,
  userInfo: userInfoReducer,
  filterTask: filterTasksReducer,
  // loading: loadingScreenReducer,
  taskUsersPhotos,
  orderTask : orderTasksReducer,
  seeAdminSet : seeAdminReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOFF') {
    state = undefined
  }

  return appReducer(state, action)
}

const persistConfig = {
  key: "primary",
  storage,
};

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export const persistor = persistStore(store);
