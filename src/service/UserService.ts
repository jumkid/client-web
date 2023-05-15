import { APIResponse } from './model/Response';
import { USER_ACTIVITY_API } from '../App.constants';
import restfulClient from './RestfulClient';
import UserActivity from '../layout/MainLayout/model/UserActivity';

interface IUserService {
  getUserActivities():Promise<APIResponse<any>>
  closeUserActivity(id:number):Promise<APIResponse<any>>
}

class UserService implements IUserService {
  async getUserActivities(): Promise<APIResponse<UserActivity[]>> {
    return await restfulClient.getWithPromise(USER_ACTIVITY_API);
  }

  async closeUserActivity (id:number): Promise<APIResponse<any>> {
    const url = `${USER_ACTIVITY_API}/${id}/unread`;
    return await restfulClient.putWithPromise(url);
  }

}

export default UserService;
