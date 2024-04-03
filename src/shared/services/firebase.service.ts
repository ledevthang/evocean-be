import { Injectable } from "@nestjs/common";
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { DateTime } from "luxon";

import { InjectStorage } from "@root/libs/requirement/requirement.module";

type Option = {
  object_id: string | number;
  target: "theme_zip" | "theme_preview";
};

@Injectable()
export class FirebaseService {
  constructor(@InjectStorage() private storage: FirebaseStorage) {}

  public async upload(
    file: Express.Multer.File,
    { target, object_id }: Option
  ) {
    const filename = file.originalname.replace(/\s+/g, "");

    const time = DateTime.now().toMillis();

    let location = `themes/zip/${object_id}/${time}_${filename}`;

    if (target === "theme_preview") {
      location = `themes/previews/${object_id}/${time}_${filename}`;
    }

    const objRef = ref(this.storage, location);

    const response = await uploadBytes(objRef, file.buffer);

    return getDownloadURL(response.ref);
  }
}
