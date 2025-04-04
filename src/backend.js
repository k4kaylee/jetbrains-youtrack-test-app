/* 
  I know that the flag persisting part should be done with
    ctx.<someEntity>.extensionProperties("flagValue")
  , but I didn't manage to set up the new property so that it would work :(

  This is the reason why I am using a simple let flag logic here - just so that it would work.
*/
let flagValue = false;

exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: 'flag',
      // scope: 'project',
      handle: async (ctx) => {
        ctx.response.json({value: flagValue, ok: true});
      }
    },
    {
      method: 'PUT',
      path: 'flag',
      // scope: 'project',
      handle: async (ctx) => {
        const newValue = ctx.request.getParameter('newValue');

        flagValue = newValue === "true";

        ctx.response.json({ok: true});
      }
    }
  ]
};