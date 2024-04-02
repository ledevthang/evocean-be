import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./modules/app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Evocean API document")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(8080);
}

bootstrap();

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
// apiKey: "AIzaSyAMRhWU3TC7iAbAmHQHTiI5DeTUPS4aFvw",
// authDomain: "evocean-25bc7.firebaseapp.com",
// projectId: "evocean-25bc7",
// storageBucket: "evocean-25bc7.appspot.com",
// messagingSenderId: "158885515212",
// appId: "1:158885515212:web:81e895d24cb0d8de409769",
// measurementId: "G-KPGSF02E06"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
