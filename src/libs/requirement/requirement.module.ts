import { Global, Inject, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { initializeApp } from "firebase/app";
import type { FirebaseStorage } from "firebase/storage";
import { getStorage } from "firebase/storage";

import { readConfigOrExit } from "@root/utils/read-config";

export type Secrets = 1;

export const SecretsToken: unique symbol = Symbol("SecretsToken");

export const FirebaseStorageToken: unique symbol = Symbol(
  "FirebaseStorageToken"
);

export const InjectSecrets = () => Inject(SecretsToken);

export const InjectStorage = () => Inject(FirebaseStorageToken);

@Global()
@Module({
  providers: [
    {
      provide: SecretsToken,
      useFactory: (configService: ConfigService): Secrets => {
        return 1;
      },
      inject: [ConfigService]
    },
    {
      provide: FirebaseStorageToken,
      useFactory: (configService: ConfigService): FirebaseStorage => {
        const apiKey = readConfigOrExit("FIREBASE_API_KEY")(configService);
        const authDomain = readConfigOrExit("FIREBASE_AUTH_DOMAIN")(
          configService
        );
        const projectId = readConfigOrExit("FIREBASE_PROJECT_ID")(
          configService
        );
        const storageBucket = readConfigOrExit("FIREBASE_STORAGE_BUCKET")(
          configService
        );
        const messagingSenderId = readConfigOrExit(
          "FIREBASE_MESSAGING_SENDER_ID"
        )(configService);
        const appId = readConfigOrExit("FIREBASE_APP_ID")(configService);

        const app = initializeApp({
          apiKey,
          appId,
          authDomain,
          projectId,
          storageBucket,
          messagingSenderId
        });
        const firebaseStorage = getStorage(app);

        return firebaseStorage;
      },
      inject: [ConfigService]
    }
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.${process.env.APP || "local"}.env`
    })
  ],
  exports: [SecretsToken, FirebaseStorageToken]
})
export class RequirementModule {}
