import * as C from '../App.constants';
import { APIResponse } from './model/Response';
import restfulClient from './RestfulClient';

export interface IContentService {
  upload(file:Blob, accessScope: "public" | "private"):Promise<APIResponse>
}

class ContentService implements IContentService{

  async upload(file:Blob, accessScope: "public" | "private") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("accessScope", accessScope);
    return await restfulClient.postWithPromise(C.CONTENT_UPLOAD_API, formData);
  }

}

export default ContentService;
