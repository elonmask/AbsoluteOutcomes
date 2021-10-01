const axios = require("axios");

const app = require("express")();
const PORT = 3000;

const Estimate = require("./src/Estimate");
const StatisticsComposer = require("./src/StatisticsComposer");

const getStatisticsData = () => {
  /*const bet365 = require("./json/bet365_statistics.json").results[0];
  const betradar = require("./json/betradar_statistics.json").doc[0].data;

  return [
    {
      source: "bet365",
      data: bet365,
    },
    {
      source: "betradar",
      data: betradar,
    },
  ];*/
  //const betradar = require("./json/test/betradar_statistics.json").doc[0].data;
  const betradar = require("./json/timeline.json").doc[0].data;
  return [
    {
      source: "betradar",
      data: betradar,
    },
  ];
};

app.get("/estimation", (req, res) => {
  //const odds = require("./json/match_to_estimate.json").odds;
  //const odds = require("./json/match_estimated.json").odds;
  //const statistics = require("./json/bet365_statistics.json").results[0];

  const odds = require("./json/event.json").odds;
  //console.log(odds);
  axios
    .get(`http://localhost:${PORT}/statistics`)
    .then((response) => {
      // handle success
      const statistics = response.data;
      const estimation = new Estimate(statistics, odds);
      estimation.Start();

      console.log(odds);

      res.send(odds);
    })
    .catch(function (error) {
      // handle error
      res.send(error);
    });
});

app.get("/", (req, res) => {
  res.redirect("/estimation");
});

app.get("/statistics", (req, res) => {
  const stat = new StatisticsComposer(getStatisticsData()).Compose();

  res.send(stat);
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

//const EVENT_ID = "106122931";
//const TOKEN = "85271-bP30yXDU77GIT9";

/*

  marketsToEstimate array example:

  [ {"odd-types": 27}, {"prematch": 40}, {"common": 10002} ]

  27 - Odd types ID of Both Team to Score market
  40 - Prematch ID of Full Time Result market
  10002 - Common ID of Half Time/Full Time market

  * */
//const marketIDsOne = [{ odd_types: 27 }, { prematch: 40 }, { common: 10002 }];

/*

marketsToEstimate array example 2:

[ { live: 10565 }, { odd_types: 1 }, { prematch: 42 } ]

10565 - Live ID of Both Team to Score market
1 - Odd types ID of Full Time Result market
42 - Prematch ID of Half Time/Full time market

* */
//const marketsIDsTwo = [{ live: 10565 }, { odd_types: 1 }, { prematch: 42 }];

//const request = new Request(EVENT_ID, TOKEN);

/*request.requestStatistics().then((data) => {
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
});*/
