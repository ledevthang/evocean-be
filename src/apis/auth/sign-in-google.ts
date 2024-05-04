import { ENDPOINT } from "@root/shared/constant";
import Elysia, { InternalServerError, t } from "elysia";
import axios from "axios";
import { UserRepository } from "@root/repositories/user.repository";
import { accessJwt } from "@root/plugins/jwt.plugin";

type UserData = {
  sub: string; // google id
  email: string;
};

export const signInGoogle = new Elysia({
  name: "Handler.SignInGoogle"
})
  .use(accessJwt)
  .post(
    ENDPOINT.AUTH.SIGN_IN_GOOGLE,
    async ({ body, accessJwt }) => {
      const resData = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${body.accessToken}`
      );

      const userData: UserData = resData.data;

      // check if the user is existed
      const user = await UserRepository.findByGoogleId(userData.sub);

      if (user) {
        throw new InternalServerError("User is exsited");
      }

      // store into database
      await UserRepository.createUser({
        googleId: userData.sub,
        email: userData.email
      });

      // create the JWT and send the response to client
      return await accessJwt.sign({
        googleId: userData.sub
      });
    },
    {
      body: t.Object({
        accessToken: t.String({
          minLength: 1
        })
      })
    }
  );
