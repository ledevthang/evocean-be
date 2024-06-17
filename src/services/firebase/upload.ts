import * as FirebaseStorage from "firebase/storage";
import { DateTime } from "luxon";

import { firebaseStorage } from "./config";

export enum StorageType {
  ZIP,
  IMAGE,
  AVATAR
}

export const uploadFile = async (file: File, storageType: StorageType) => {
  const filename = file.name.replace(/\s+/g, "");

  const time = DateTime.now().toMillis();
  let location;

  switch (storageType) {
    case StorageType.ZIP:
      location = `themes/zip/${time}_${filename}`;
      break;
    case StorageType.IMAGE:
      location = `themes/preview-images/${time}_${filename}`;
      break;
    case StorageType.AVATAR:
      location = `themes/avatar/${time}_${filename}`;
      break;

    default:
      break;
  }

  const objRef = FirebaseStorage.ref(firebaseStorage, location);

  const buffer = await file.arrayBuffer();

  const response = await FirebaseStorage.uploadBytes(objRef, buffer);

  return FirebaseStorage.getDownloadURL(response.ref);
};
