const fs = require("fs");

try {
  const oddTypes = fs.readFileSync("./odd-types.json", "utf8");
  const markets = JSON.parse(fs.readFileSync("./soccer.json", "utf8"));

  const newMarkets = [];
  const marketsWithoutOddTypes = [];

  markets.data.forEach((market) => {
    if (market.odd_types_id) {
      if (market.odd_types_id.includes(",")) {
        const firstID = parseInt(market.odd_types_id.split(",")[0]).toString();
        const secondID = parseInt(market.odd_types_id.split(",")[1]).toString();

        const firstMarket = {
          market_name: market.market_name,
          common_id: market.common_id,
          odd_types_id: firstID,
        };
        const secondMarket = {
          market_name: market.market_name,
          common_id: (parseInt(firstMarket.common_id) + 1000).toString(),
          odd_types_id: secondID,
        };

        newMarkets.push(firstMarket);
        newMarkets.push(secondMarket);
      } else {
        newMarkets.push(market);
      }
    } else {
      marketsWithoutOddTypes.push(market);
    }
  });

  const markets_soccer = JSON.parse(
    fs.readFileSync("./soccer_markets.json", "utf8")
  );
  marketsWithoutOddTypes.forEach((market) => {
    markets_soccer.markets.forEach((market_soccer) => {
      if (market.common_id === market_soccer.common_id) {
        if (market_soccer.Outcomes) {
          market.outcomes = [];
          market_soccer.Outcomes.split(",").forEach((outcome_name, idx) => {
            if (market_soccer.commod_outcomes_id) {
              market.outcomes.push({
                outcome: outcome_name,
                common_outcomeId:
                  market_soccer.commod_outcomes_id.split(",")[idx],
              });
            } else {
              market.outcomes.push({
                outcome: outcome_name,
                common_outcomeId:
                  (parseInt(market_soccer.common_id) + 10000).toString() +
                  `00${idx}`,
              });
            }
          });
        }
      }
    });
    newMarkets.push(market);
  });

  newMarkets.forEach((market) => {
    const id = parseInt(market.odd_types_id);

    if (typeof id === "number") {
      JSON.parse(oddTypes)[0].response[0].data.forEach((odd) => {
        if (id === odd.id) {
          market.market_name = odd.name;
          if (odd.outcomes) {
            market.outcomes = [];
            odd.outcomes.forEach((outcome) => {
              market.outcomes.push(outcome);
            });
          } else {
            market.outcomes = "not_available";
          }
        }
      });
    }
  });

  fs.writeFile(
    "markets_parsed.json",
    JSON.stringify(newMarkets),
    "utf8",
    function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    }
  );
} catch (err) {
  console.error(err);
}
