import * as C from '../App.constants';
import * as _ from 'lodash';
import { APIResponse, ContentMetadata } from './model/Response';
import restfulClient from './RestfulClient';

export interface IContentService {
  getContentMetadata(id:string):Promise<APIResponse<ContentMetadata>>
  getContentSteam(id:string):Promise<any>
  getGalleryItemIds(galleryId:string):Promise<string[]>
  upload(file:Blob, accessScope: "public" | "private"):Promise<APIResponse<any>>
}

class ContentService implements IContentService{
  async getContentSteam(id: string): Promise<any> {
    return await restfulClient.getBase64WithPromise(`${C.CONTENT_STREAM_API}/${id}`);
  }

  async getContentMetadata(id:string):Promise<APIResponse<ContentMetadata>> {
    return await restfulClient.getWithPromise(`${C.CONTENT_METADATA_API}/${id}`);
  }

  async getGalleryItemIds(galleryId:string) {
    const response = await this.getContentMetadata(galleryId);
    if (response.status === 200 && !_.isNull(response.data)) {
      return response.data.children.map(metadata => metadata.uuid);
    } else {
      return [];
    }
  }

  async upload(file:Blob, accessScope: "public" | "private") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("accessScope", accessScope);
    return await restfulClient.postWithPromise(C.CONTENT_UPLOAD_API, null, formData);
  }

}

export default ContentService;
