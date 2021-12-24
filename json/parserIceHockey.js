const fs = require("fs");

try {
  const oddTypes = fs.readFileSync("./odd-types.json", "utf8");
  const markets = JSON.parse(
    fs.readFileSync("./iceHockey/hockey.json", "utf8")
  );

  const newMarkets = [];
  const marketsWithoutOddTypes = [];

  markets.sport.forEach((market) => {
    delete market["Odd-types outcomes ID"];
    delete market["Group ID,"];
    delete market["Special outcome value"];
    delete market["Settled in Over-time"];
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

  marketsWithoutOddTypes.forEach((market) => {
    markets.sport.forEach((market_sport) => {
      //console.log("Market: ", market_basket);
      if (market.common_id === market_sport.common_id) {
        if (
          typeof market_sport?.common_outcomes_id === "undefined" ||
          market_sport?.common_outcomes_id === null
        ) {
          try {
            const outcomes = [];
            market_sport?.outcomes.split(",").forEach((outcome, idx) => {
              outcomes.push({
                common_id: market.common_id + "000" + idx,
                outcome: market.outcomes.split(",")[idx],
              });
            });
            market.outcomes = outcomes;
          } catch (e) {
            console.log(market_sport);
          }
        } else {
          try {
            const outcomes = [];
            market_sport?.outcomes.split(",").forEach((outcome, idx) => {
              outcomes.push({
                common_id: market.common_outcomes_id.split(",")[idx],
                outcome: market.outcomes.split(",")[idx],
              });
            });
            market.outcomes = outcomes;
          } catch (e) {
            console.log(market_sport);
          }
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

  newMarkets.forEach((market) => {
    delete market["common_outcomes_id"];
  });

  fs.writeFile(
    "markets_parsed_ice-hockey.json",
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
