import {GET_NOTIFICATIONS} from './notificationsTypes';

export function getNotifications(info){
 return{
     type:GET_NOTIFICATIONS,
     payload:info
 }
}