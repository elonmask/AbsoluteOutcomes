const Request = require("./src/Request");
const Estimate = require("./src/Estimate");

const EVENT_ID = "106122931";
const TOKEN = "95603-ONW0LPXBHKYRXI";

const marketIDs = [{ odd_types: 27 }, { prematch: 40 }, { common: 10002 }];
/*

  marketsToEstimate array example:

  [ {"odd-types": 27}, {"prematch": 40}, {"common": 10002} ]

  27 - Odd types ID of Both Team to Score market
  40 - Prematch ID of Full Time Result market
  10002 - Common ID of Half Time/Full Time market

  * */

const request = new Request(EVENT_ID, TOKEN);

request.requestStatistics().then((data) => {
  const statistics = JSON.parse(data);
  const estimation = new Estimate(statistics, marketIDs);

  //Calculate all markets by statistics
  estimation.Start();
});
