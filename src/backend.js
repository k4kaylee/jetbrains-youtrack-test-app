let flagValue = false;

exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: 'flag',
      // scope: 'project',
      handle: async (ctx) => {
        ctx.response.json({value: flagValue});
      }
    },
    {
      method: 'PUT',
      path: 'flag',
      // scope: 'project',
      handle: async (ctx) => {
        const newValue = ctx.request.getParameter('newValue');

        flagValue = newValue === "true";

        ctx.response.json({status: `OK, ${newValue}`});
      }
    }
  ]
};


