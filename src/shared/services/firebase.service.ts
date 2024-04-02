import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectStorage } from "@root/libs/requirement/requirement.module";
import { FirebaseStorage } from "firebase/storage";
import { Effect as E } from "effect";

type TagetFolder = "meme";

@Injectable()
export class FirebaseService {
  constructor(@InjectStorage() private storage: FirebaseStorage) {}

  async upload(file: Express.Multer.File, folder: TagetFolder) {
    return;
  }
}
