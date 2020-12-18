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
export {loadingScreen} from './loadingScreen/loadingScreenActions';
export {getUsersPhotos} from './taskUsersPhotos/taskUsersPhotosActions';

