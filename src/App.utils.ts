import * as _ from 'lodash';
import { VehicleFieldValuePair } from './service/VehicleService';

function isJson (item: string | object) {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  return typeof item === 'object' && item !== null;
}

function preloadImages(urls:string[], allImagesLoadedCallback:() => void){
  let loadedCounter = 0;
  const total = urls.length;

  urls.forEach(function(url){
    preloadImage(url, () => {
      loadedCounter++;
      if(loadedCounter == total){
        allImagesLoadedCallback();
      }
    });
  });

  function preloadImage(url:string, loadedCallback:() => void){
    const img = new Image();
    img.onload = loadedCallback;
    img.src = url;
  }

}

function vinVehicleToFieldValuePairs (vinVehicle: object):VehicleFieldValuePair[] {
  const fieldValuePairs:VehicleFieldValuePair[] = [];
  for (const prop in vinVehicle) {
    if (Object.prototype.hasOwnProperty.call(vinVehicle, prop)) {
      type ObjectKey = keyof typeof vinVehicle
      const key = prop as ObjectKey;
      const value = _.toLower(vinVehicle[key]);
      if (value !== 'n/a') {
        fieldValuePairs.push({field: key, value});
      }
    }
  }

  return fieldValuePairs;
}

export {
  isJson,
  preloadImages,
  vinVehicleToFieldValuePairs
};

