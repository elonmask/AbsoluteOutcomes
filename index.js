const axios = require("axios");

const app = require("express")();
const PORT = 3000;

const Estimate = require("./src/Estimate");
const StatisticsComposer = require("./src/StatisticsComposer");

app.get("/estimation", (req, res) => {
  const sportID = parseInt(req.query.sport_id);
  const odds =
    sportID === 1
      ? require("./json/soccer/event.json").odds
      : sportID === 5
      ? require("./json/tennis/event1_outcomes.json").odds
      : null;
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
      case 5:
        return [
          {
            source: "betradar",
            data: require("./json/tennis/event1_statistics_live.json").doc[0]
              .data,
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
