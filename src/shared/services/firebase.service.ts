import { Injectable } from "@nestjs/common";
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { DateTime } from "luxon";

import { InjectStorage } from "@root/libs/requirement/requirement.module";

type TargetFolder = "meme";

@Injectable()
export class FirebaseService {
  constructor(@InjectStorage() private storage: FirebaseStorage) {}

  public async upload(file: Express.Multer.File, folder: TargetFolder) {
    const objLink = file.originalname.replace(/\s+/g, "");

    const objRef = ref(
      this.storage,
      `${folder}/${DateTime.now().toMillis()}_${objLink}`
    );

    const response = await uploadBytes(objRef, file.buffer);

    return getDownloadURL(response.ref);
  }
}
