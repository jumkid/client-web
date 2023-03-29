import * as C from '../App.constants';
import { APIResponse, ContentMetadata } from './model/Response';
import restfulClient from './RestfulClient';
import { ContentResource } from '../store/model/Activity';

export interface IContentService {
  getContentMetadata(id:string):Promise<APIResponse<ContentMetadata>>
  getContentMetadataList(contentIdList: ContentResource[]): Promise<(ContentMetadata | null)[]>
  getContentThumbnail(id:string, thumbnailSize:'large' | 'medium' | 'small'):Promise<any>
  getContentSteam(id:string):Promise<any>
  getGalleryItemIds(galleryId:string):Promise<string[]>

  upload(file:Blob, accessScope: "public" | "private"):Promise<APIResponse<ContentMetadata>>
}

class ContentService implements IContentService{
  async getContentThumbnail(id: string, thumbnailSize: string): Promise<any> {
    return await restfulClient.getBase64WithPromise(`${C.CONTENT_THUMBNAIL_API}/${id}?size=${thumbnailSize}`);
  }

  async getContentSteam(id: string): Promise<any> {
    return await restfulClient.getBase64WithPromise(`${C.CONTENT_STREAM_API}/${id}`);
  }

  async getContentMetadata(id: string):Promise<APIResponse<ContentMetadata>> {
    return await restfulClient.getWithPromise(`${C.CONTENT_METADATA_API}/${id}`);
  }

  async getContentMetadataList(contentResources: ContentResource[]): Promise<(ContentMetadata | null)[]> {
    const promises:Promise<ContentMetadata | null>[] = [];
    contentResources.forEach(contentResource => {
      const promise = this.getContentMetadata(contentResource.contentResourceId).then(
        (response) => {
          return response.data;
        }
      );
      promises.push(promise);
    });

    return Promise.all(promises);

  }

  async getGalleryItemIds(galleryId:string):Promise<string[]> {
    try {
      const response = await this.getContentMetadata(galleryId);
      const data = response?.data;
      return data?.children.map(metadata => metadata.uuid) || [];
    } catch (error) {
      console.error(`Error getting gallery item IDs: ${error}`);
      return [];
    }
  }

  async upload(file:Blob, accessScope: "public" | "private"):Promise<APIResponse<ContentMetadata>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("accessScope", accessScope);
    return await restfulClient.postWithPromise(C.CONTENT_UPLOAD_API, null, formData);
  }

}

export default ContentService;
