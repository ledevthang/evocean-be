import Elysia from "elysia";

export const loggerPlugin = new Elysia({
  name: "Plugin.Logger"
}).onRequest(({ request }) => {
  console.log(`${request.method} ${request.url}`);
});
// .onResponse({ as: "global" }, ({ set }) => {
//   console.log(`status: ${set.status}`);
// });
