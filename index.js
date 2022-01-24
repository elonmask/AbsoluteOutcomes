const axios = require("axios");

const app = require("express")();
const PORT = 3000;

const Estimate = require("./src/Estimate");
const StatisticsComposer = require("./src/StatisticsComposer");

app.get("/estimation", (req, res) => {
  const sportID = parseInt(req.query.sport_id);
  let odds = null;
  switch (sportID) {
    case 1:
      odds = require("./json/soccer/event.json").odds;
      break;
    case 2:
      odds = require("./json/basketball/outcomes.json").odds;
      break;
    case 4:
      odds = require("./json/ice-hockey/1392500.json").odds;
      break;
    case 5:
      odds = require("./json/tennis/event1_outcomes.json").odds;
      break;
    case 23:
      odds = require("./json/volleyball/event.json").odds;
  }

  if (odds) {
    axios
      .get(`http://localhost:${PORT}/statistics/?sport_id=${sportID}`)
      .then((response) => {
        // handle success
        const statistics = response.data;
        const estimation = new Estimate(statistics, odds);
        estimation.Start();

        res.send(odds);
      })
      .catch(function (error) {
        console.log(error);
        // handle error
        res.send(error);
      });
  }
});

app.get("/", (req, res) => {
  res.redirect("/estimation");
});

app.get("/statistics", (req, res) => {
  const getStatisticsData = (sportID) => {
    switch (sportID) {
      case 1:
        return [
          {
            source: "betradar",
            data: require("./json/soccer/timeline.json").doc[0].data,
          },
        ];
      case 4:
        return [
          {
            source: "betradar",
            data: require("./json/ice-hockey/29057798.stats.json").doc[0].data,
          },
        ];
      case 5:
      case 23:
        return [
          {
            source: "betradar",
            data: require("./json/tennis/event1_statistics_ended.json").doc[0]
              .data,
          },
        ];
      case 2:
        return [
          {
            source: "betradar",
            data: require("./json/basketball/timeline.json").doc[0].data,
          },
        ];
    }
  };
  const id = parseInt(req.query.sport_id);
  const stat = new StatisticsComposer(getStatisticsData(id)).Compose(id);

  res.send(stat);
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
