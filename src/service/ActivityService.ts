import { APIResponse } from './model/Response';
import restfulClient from './RestfulClient';
import { VEHICLE, ACTIVITIES_API, ACTIVITY_API } from '../App.constants';
import * as _ from 'lodash';
import { Activity, Priority } from '../store/model/Activity';

interface IActivityService {
  getById: (id: number) => Promise<APIResponse<object>>
  getByEntityId: (entityId: string) => Promise<APIResponse<[]>>

  getActivityStatuses: () => Promise<APIResponse<[]>>
  getActivityPriorities: () => Promise<APIResponse<object>>

  saveNewActivity: (activity: Activity) => Promise<APIResponse<object>>
  updateActivity: (activity: Activity) => Promise<APIResponse<object>>
  deleteActivity: (activityId: number) => Promise<APIResponse<any>>
}

class ActivityService implements IActivityService {

  async getActivityStatuses (): Promise<APIResponse<[]>> {
    const url = `${ACTIVITY_API}/statuses`;
    return await restfulClient.getWithPromise(url);
  }

  async getActivityPriorities (): Promise<APIResponse<Priority[]>> {
    const url = `${ACTIVITY_API}/priorities`;
    return await restfulClient.getWithPromise(url);
  }

  async getById (id: number): Promise<APIResponse<Activity>> {
    if (!_.isNull(id)) {
      const url = `${ACTIVITIES_API}/${id}`;
      return await restfulClient.getWithPromise(url);
    } else {
      return Promise.resolve({ status:202, data: null })
    }
  }

  async getByEntityId (entityId: string): Promise<APIResponse<[]>> {
    if (!_.isNull(entityId)) {
      const params = {entityId: entityId, entityName: VEHICLE}
      return await restfulClient.getWithPromise(ACTIVITIES_API, params);
    } else {
      return Promise.resolve({ status:202, data:[] });
    }
  }

  async saveNewActivity (activity: Activity): Promise<APIResponse<Activity>> {
    const url = `${ACTIVITIES_API}`;
    return await restfulClient.postWithPromise(url, null, activity);
  }

  async updateActivity (activity: Activity): Promise<APIResponse<Activity>> {
    const url = `${ACTIVITIES_API}/${activity.id}`;
    return await restfulClient.putWithPromise(url, activity);
  }

  async deleteActivity (activityId: number): Promise<APIResponse<any>>{
    const url = `${ACTIVITIES_API}/${activityId}`;
    return await restfulClient.deleteWithPromise(url);
  }

}

export default ActivityService;
