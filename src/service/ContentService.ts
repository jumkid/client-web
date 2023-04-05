import * as C from '../App.constants';
import { APIResponse, ContentMetadata } from './model/Response';
import restfulClient from './RestfulClient';
import { ContentResource } from '../store/model/Activity';

export interface IContentService {
  getContentMetadata(uuid:string):Promise<APIResponse<ContentMetadata>>
  getContentMetadataList(contentIdList: ContentResource[]): Promise<(ContentMetadata | null)[]>
  getContentThumbnail(uuid:string, thumbnailSize:'large' | 'medium' | 'small'):Promise<any>
  getContentSteam(uuid:string):Promise<any>
  getGalleryItemIds(galleryId:string):Promise<string[]>

  upload(file:Blob, accessScope: "public" | "private"):Promise<APIResponse<ContentMetadata>>
  download(uuid:string, fileName:string | undefined):void

  deleteContentMetadata(id:string):Promise<APIResponse<any>>
}

class ContentService implements IContentService{

  async getContentThumbnail(uuid: string, thumbnailSize: string): Promise<any> {
    return await restfulClient.getBase64WithPromise(`${C.CONTENT_THUMBNAIL_API}/${uuid}?size=${thumbnailSize}`);
  }

  async getContentSteam(uuid: string): Promise<any> {
    return await restfulClient.getBase64WithPromise(`${C.CONTENT_STREAM_API}/${uuid}`);
  }

  async getContentMetadata(uuid: string):Promise<APIResponse<ContentMetadata>> {
    return await restfulClient.getWithPromise(`${C.CONTENT_METADATA_API}/${uuid}`);
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
      const {data} = await this.getContentMetadata(galleryId);
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

  download(uuid: string, fileName:string | undefined): void {
    restfulClient.download(`${C.CONTENT_DOWNLOAD_API}/${uuid}`, fileName);
  }

  async deleteContentMetadata(uuid: string): Promise<APIResponse<any>> {
    return await restfulClient.deleteWithPromise(`${C.CONTENT_METADATA_API}/${uuid}`);
  }
}

export default ContentService;
