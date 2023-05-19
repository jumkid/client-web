import { APIResponse, CommonResponse } from './model/Response';
import { USER_ACTIVITY_NOTIFICATION_API } from '../App.constants';
import restfulClient from './RestfulClient';
import ActivityNotification from '../layout/MainLayout/model/ActivityNotification';

interface IUserService {
  getActivityNotifications():Promise<APIResponse<any>>
  readActivityNotification(id:number):Promise<APIResponse<CommonResponse>>
  deleteActivityNotification(id:number):Promise<APIResponse<any>>
}

class UserService implements IUserService {

  async getActivityNotifications(): Promise<APIResponse<ActivityNotification[]>> {
    return await restfulClient.getWithPromise(USER_ACTIVITY_NOTIFICATION_API);
  }

  async readActivityNotification (id:number): Promise<APIResponse<CommonResponse>> {
    const url = `${USER_ACTIVITY_NOTIFICATION_API}/${id}/unread`;
    return await restfulClient.putWithPromise(url);
  }

  async deleteActivityNotification (id:number): Promise<APIResponse<CommonResponse>> {
    const url = `${USER_ACTIVITY_NOTIFICATION_API}/${id}`;
    return await restfulClient.deleteWithPromise(url);
  }
}

export default UserService;
