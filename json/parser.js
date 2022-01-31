const fs = require("fs");

const sports = new Map([
  ["1", "soccer"],
  ["2", "basketball"],
  ["4", "ice-hockey"],
  ["5", "tennis"],
  ["23", "volleyball"],
  ["3", "baseball"],
]);
const SPORT_ID = "3";
try {
  const oddTypes = fs.readFileSync("./odd-types.json", "utf8");
  const markets = JSON.parse(
    fs.readFileSync(
      `./${sports.get(SPORT_ID)}/${sports.get(SPORT_ID)}.json`,
      "utf8"
    )
  );

  const newMarkets = [];
  const marketsWithoutOddTypes = [];

  markets.sport.forEach((market) => {
    if (market.odd_types_id) {
      const string_type = market.odd_types_id;
      market.odd_types_id = string_type.toString();
    }
  });

  markets.sport.forEach((market) => {
    delete market["Odd-types outcomes ID"];
    delete market["Group ID,"];
    delete market["Special outcome value"];
    delete market["Settled in Over-time"];
    delete market["Market Type"];
    delete market["Outcome Type"];
    delete market["Return"];
    delete market["Score Type"];
    delete market["Over time"];
    delete market["Time Type"];
    delete market["Group ID"];
    delete market["Odd-types OutcomeId"];
    delete market["Common Outcomes ID"];
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
            // console.log(e);
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
            // console.log(e);
          }
        }
      }
    });
    newMarkets.push(market);
  });

  const addZeros = (str) => (str.length > 1 ? str.toString() : `0${str}`);

  newMarkets.forEach((market, idx) => {
    const id = parseInt(market.odd_types_id);
    if (typeof id === "number") {
      JSON.parse(oddTypes)[0].response[0].data.forEach((odd) => {
        if (id === odd.id) {
          // add specifiers
          if (odd.specifiers) {
            // console.log(`odd ${odd.name}`, odd.specifiers);
            market.specifiers = odd.specifiers;
          }
          market.odd_types_name = odd.name;
          if (odd.outcomes) {
            market.outcomes = [];
            odd.outcomes.forEach((outcome, idx) => {
              if (!outcome.outcomeId) {
                if (odd.odd_types_id) {
                  outcome.outcomeId = odd.odd_types_id + addZeros(idx);
                } else {
                  outcome.outcomeId = odd.common_id + addZeros(idx);
                }
              }
              market.outcomes.push(outcome);
            });
          } else {
            market.outcomes = "not_available";
          }
        }
      });
      if (!market.outcomes) {
        market.outcomes = [];
        if (market.Outcomes) {
          market.Outcomes.split(",").forEach((name, idx) => {
            const outcome = {};

            if (!outcome.outcomeId) {
              outcome.outcomeId = market.common_id + addZeros(idx);
              outcome.outcome = name;
            }
            market.outcomes.push(outcome);
          });
        }
      }
    }
  });

  const marketsFormated = [];

  newMarkets.forEach((market) => {
    //delete market["common_outcomes_id"];
    //delete market["Outcomes"];

    if (market.odd_types_id) {
      const externalOutcomes = [];
      if (market.Outcomes) {
        market.Outcomes.split(",").forEach((outcome) => {
          externalOutcomes.push({
            outcome: outcome,
            feedName: "bet365",
          });
        });
      }
      const externalIds = [];
      if (market.live_id) {
        externalIds.push({
          feedName: "bet365",
          externalId: market.live_id,
          marketName: market.market_name,
        });
      }
      if (market.prematch_id) {
        externalIds.push({
          feedName: "bet365",
          externalId: market.prematch_id,
          market_name: market.market_name,
        });
      }

      JSON.parse(oddTypes)[0].response[0].data.forEach((odd) => {
        if (parseInt(market.odd_types_id) === odd.id) {
          odd.externalIds.forEach((exId) => {
            externalIds.push(exId);
          });
        }
      });
      const marketFormat = {
        id: parseInt(market.odd_types_id),
        name: market.odd_types_name,
        outcomes: market.outcomes,
        externalOutcomes: externalOutcomes,
        externalIds: externalIds,
        specifiers: market.specifiers,
      };

      if (externalIds.length === 0) {
        delete marketFormat.externalIds;
      }

      if (marketFormat.outcomes !== "not_available") {
        marketsFormated.push(marketFormat);
      } else {
        console.log(marketFormat);
      }
    } else {
      const externalOutcomes = [];
      if (market.Outcomes) {
        market.Outcomes.split(",").forEach((outcome) => {
          externalOutcomes.push({
            outcome: outcome,
            feedName: "bet365",
          });
        });
      }
      const externalIds = [];
      if (market.live_id) {
        externalIds.push({
          feedName: "bet365",
          externalId: market.live_id,
          marketName: market.market_name,
        });
      }
      if (market.prematch_id) {
        externalIds.push({
          feedName: "bet365",
          externalId: market.prematch_id,
          market_name: market.market_name,
        });
      }

      const marketFormat = {
        id: parseInt(market.common_id),
        name: market.market_name,
        outcomes: market.outcomes,
        externalOutcomes: externalOutcomes,
        externalIds: externalIds,
      };

      if (externalIds.length === 0) {
        delete marketFormat.externalIds;
      }

      if (
        marketFormat.outcomes !== "not_available" &&
        marketFormat.id !== null &&
        !isNaN(marketFormat.id)
      ) {
        //console.log(marketFormat.id);
        marketsFormated.push(marketFormat);
      } else {
        console.log(marketFormat);
      }
    }
  });

  fs.writeFile(
    `markets_parsed_${sports.get(SPORT_ID)}.json`,
    JSON.stringify(marketsFormated),
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
