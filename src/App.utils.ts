import * as _ from 'lodash';
import { VehicleFieldValuePair } from './service/VehicleService';
import { contentService } from './service';
import { Buffer } from 'buffer';

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
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  return typeof item === 'object' && item !== null;
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
  if (!contentId) return '';
  const { data, headers } = await contentService.getContentThumbnail(contentId, thumbnailSize);
  const base64 = Buffer.from(data, 'binary').toString('base64');
  return `data:${headers['content-type']};base64,${base64}`;
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

function vinVehicleToFieldValuePairs(vinVehicle: Record<string, unknown>): VehicleFieldValuePair[] {
  const fieldValuePairs: VehicleFieldValuePair[] = [];

  for (const [key, value] of Object.entries(vinVehicle)) {
    if (value !== 'n/a') {
      fieldValuePairs.push({ field: key, value: _.toLower(String(value)) });
    }
  }

  return fieldValuePairs;
}

export {
  isJson,
  dateFormatter,
  timeFormatter,
  preloadContentThumbnails,
  preloadContentThumbnail,
  preloadImage,
  preloadImages,
  vinVehicleToFieldValuePairs
};

