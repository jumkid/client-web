import * as _ from 'lodash';
import { contentService } from './service';
import { Buffer } from 'buffer';

function currencyFormatter (amount:number | null | undefined):string {
  return _.isNil(amount) ? '0.00' : amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

function dateFormatter (datetime: string | undefined):string {
  const [dateString] = getDatetimeParts(datetime);
  const currentYear = new Date().getFullYear().toString();
  return dateString.startsWith(currentYear) ? dateString.substring(5) : dateString;
}

function timeFormatter (datetime: string | undefined, hideSecond?:boolean):string {
  const parts = getDatetimeParts(datetime);
  return !parts ? '' : hideSecond ? parts[1].substring(0, 5) : parts[1];
}

const getDatetimeParts = (datetime: string | undefined):string[] => {
  if (!datetime) { return [] }
  return datetime.split("T");
}

function isJson (item: string | object) {
  try {
    item = JSON.parse(JSON.stringify(item));
  } catch (e) {
    return false;
  }

  return item !== null && _.isObject(item);
}

async function preloadContentThumbnails (contentIds: (string | undefined)[], thumbnailSize: string): Promise<string[]> {
  try {
    const requests:Promise<string>[] = contentIds.map((contentId) => preloadContentThumbnail(contentId, thumbnailSize));
    return await Promise.all(requests);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function preloadContentThumbnail (contentId: string | undefined, thumbnailSize: string): Promise<string> {
  if (!contentId) {
    return '';
  }
  const { status, data, headers } = await contentService.getContentThumbnail(contentId, thumbnailSize);
  if (status === 200) {
    const base64 = Buffer.from(data, 'binary').toString('base64');
    return `data:${headers['content-type']};base64,${base64}`;
  } else {
    return '';
  }

}

function preloadImages(urls:string[], allImagesLoadedCallback:() => void) {
  let loadedCounter = 0;
  const total = urls.length;

  urls.forEach(function(url){
    preloadImage(url, () => {
      loadedCounter++;
      if (loadedCounter == total) {
        allImagesLoadedCallback();
      }
    });
  });
}

function preloadImage(url:string, loadedCallback:() => void){
  const img = new Image();
  img.onload = loadedCallback;
  img.src = url;
}

export {
  isJson,
  currencyFormatter,
  dateFormatter,
  timeFormatter,
  preloadContentThumbnails,
  preloadContentThumbnail,
  preloadImage,
  preloadImages
};

