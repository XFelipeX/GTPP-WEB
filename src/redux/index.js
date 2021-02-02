export { logIn, logOff } from "./userAuth/userAuthActions";
export { getStates } from "./taskStates/taskStatesActions";
export { updateTask } from "./stateUpdate/stateUpdateActions";
export {
  setOrder,
  setCol,
  setDateVisi,
  setPriorityVisi,
  setStateVisi,
  setVincVisi,
  setCompanyVisi,
  setShopVisi,
} from "./visionMenu/visionMenuActions";
export { setPhotos } from "./userPhotos/userPhotosActions";
export { getDepts } from "./taskDepts/taskDeptsActions";
export { getCompany } from "./taskCompany/taskCompanyActions";
export { getTask } from "./tasks/taskActions";
export { getShop } from "./taskShop/taskShopActions";
export { taskVisibleUpdate } from "./taskVisible/taskVisibleActions";
export { taskInfoShow } from "./taskVisible/taskVisibleActions";
export { setItemCheck } from "./taskItem/taskItemActions";
// export { taskProgress } from './taskVisible/taskVisibleActions';
export { getVinculatedUsers } from './vinculatedUsers/vinculatedUsersActions';
export { updateTaskTopic} from './taskTopicUpdate/taskTopicUpdateActions';
export {getTaskCsds} from './taskCsds/taskCsdsActions';
export {updateModal} from './modalUpdate/modalUpdateActions';
export {updateTopic} from './topicUpdate/topicUpdateActions';
export {sendInfoModal} from './taskVisible/taskVisibleActions';
export {getUserInfo} from './userInfo/userInfoActions';
// export {loadingScreen} from './loadingScreen/loadingScreenActions';
export {getUsersPhotos} from './taskUsersPhotos/taskUsersPhotosActions';
export {taskInfoOwner} from './taskVisible/taskVisibleActions';
export {getTaskFilter} from './filterTasks/filterTasksActions';
export {orderTasks} from './orderTasks/orderTasksActions';
export {seeAdmin} from './seeAdmin/seeAdminActions';
export {getWebSocketState} from './webSocket/webSocketActions';
export {getWebSocketMessage} from './webSocket/webSocketActions';
export {getWebSocket} from './webSocket/webSocketActions';
export {updateStateAdmin} from './adminStateUpdate/adminStateUpdateActions'
export {getWebSocketHistoric} from './webSocket/webSocketActions';
export {
  setDoVisi,
  setDoingVisi,
  setAnalyzeVisi,
  setStoppedVisi,
  setBlockedVisi,
  setCanceledVisi,
  setDoneVisi,
} from "./filterTasks/filterTasksActions";
export {getUsersOnline} from './webSocket/webSocketActions';
export {addUsersOnline} from './webSocket/webSocketActions';
export {getWarning} from './warning/warningActions';
export {removeWarning} from './warning/warningActions';
export {getNotifications} from './notifications/notificationsActions';
