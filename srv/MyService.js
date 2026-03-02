///DPC_EXT - Service implementation, IF_HTTP_HANDLER
const cds = require('@sap/cds');

module.exports = class MyService extends cds.ApplicationService { init() {

  this.on ('shalini', async (req) => {
    //only focus on business logic
    const userName = req.data.anubhav;
    return "Hey Amigio !! Welcome " + userName;

  })

  return super.init()
}}
