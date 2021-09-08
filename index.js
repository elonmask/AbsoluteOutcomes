const Request = require("./src/Request");
const Estimate = require("./src/Estimate");

const EVENT_ID = "106122931";
const TOKEN = "85271-bP30yXDU77GIT9";

/*

  marketsToEstimate array example:

  [ {"odd-types": 27}, {"prematch": 40}, {"common": 10002} ]

  27 - Odd types ID of Both Team to Score market
  40 - Prematch ID of Full Time Result market
  10002 - Common ID of Half Time/Full Time market

  * */
const marketIDsOne = [{ odd_types: 27 }, { prematch: 40 }, { common: 10002 }];

/*

marketsToEstimate array example 2:

[ { live: 10565 }, { odd_types: 1 }, { prematch: 42 } ]

10565 - Live ID of Both Team to Score market
1 - Odd types ID of Full Time Result market
42 - Prematch ID of Half Time/Full time market

* */
const marketsIDsTwo = [{ live: 10565 }, { odd_types: 1 }, { prematch: 42 }];

/*********MAIN EXECUTION***********/

const request = new Request(EVENT_ID, TOKEN);

request.requestStatistics().then((data) => {
  const statistics = data.results[0];

  //Calculate all markets in first test array by statistics
  const estimation = new Estimate(statistics, marketIDsOne);
  estimation.Start();
  const estimationResult = estimation.GetResults();
  console.log("Result for first markets set: ", estimationResult);

  //Calculate all markets in second test array by statistics
  const estimation2 = new Estimate(statistics, marketsIDsTwo);
  estimation2.Start();
  const estimationResult2 = estimation2.GetResults();
  console.log("Result for second markets set: ", estimationResult2);
});
