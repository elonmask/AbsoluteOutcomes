const axios = require("axios");

class Request {
  constructor(EVENT_ID, TOKEN) {
    this.EVENT_ID = EVENT_ID;
    this.TOKEN = TOKEN;
  }
  requestStatistics = () => {
    return axios
      .get(
        `https://api.b365api.com/v1/bet365/result?token=${this.TOKEN}&pretty=1&event_id=${this.EVENT_ID}`
      )
      .then((response) => response.data);
  };
}

module.exports = Request;
