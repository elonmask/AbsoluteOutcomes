const {
  fullTimeResult,
  HalfTimeFullTime,
  BothTeamsToScore,
  WhichTeamToScoreNGoal,
  DoubleChance,
  CorrectScoreComninations,
  DrawNoBet,
  GoalScoredInBoth,
} = require("./Functions");

class Estimate {
  constructor(statistics, marketsToEstimate) {
    this.statistics = statistics;
    this.marketsToEstimate = marketsToEstimate;
    //this.estimatedOutcomes = [];
  }
  /*
  AddResult = (marketResult) => {
    this.estimatedOutcomes.push(marketResult);
  };
*/

  /*
  EstimateCommon = (id) => {
    switch (id) {
      case 10001:
        this.AddResult(fullTimeResult(this.statistics));
        break;
      case 10002:
        this.AddResult(HalfTimeFullTime(this.statistics));
        break;
      case 10032:
        this.AddResult(BothTeamsToScore(this.statistics));
        break;
    }
  };

  EstimateLive = (id) => {
    switch (id) {
      case 1777:
        this.AddResult(fullTimeResult(this.statistics));
        break;
      case 10560:
        this.AddResult(HalfTimeFullTime(this.statistics));
        break;
      case 10565:
        this.AddResult(BothTeamsToScore(this.statistics));
        break;
    }
  };

  EstimatePrematch = (id) => {
    switch (id) {
      case 40:
        this.AddResult(fullTimeResult(this.statistics));
        break;
      case 42:
        this.AddResult(HalfTimeFullTime(this.statistics));
        break;
      case 10150:
        this.AddResult(BothTeamsToScore(this.statistics));
        break;
    }
  };

  EstimateOddTypes = (id) => {
    switch (id) {
      case 1:
        this.AddResult(fullTimeResult(this.statistics));
        break;
      case 42:
        this.AddResult(HalfTimeFullTime(this.statistics));
        break;
      case 27:
        this.AddResult(BothTeamsToScore(this.statistics));
        break;
    }
  };
  */

  EstimateMarket = (market) => {
    const outcomeID = market.outcomes[0].outcomeId;

    switch (outcomeID) {
      case "1001":
        //Estimate Full Time Result market
        fullTimeResult(this.statistics, market);
        break;
      case "8001":
        //Estimate which team to score N Goal market
        WhichTeamToScoreNGoal(this.statistics, market);
        break;
      case "10001":
        //Estimate Double Chance market
        DoubleChance(this.statistics, market);
        break;
      case "1034001":
        CorrectScoreComninations(this.statistics, market);
        break;
      case "11001":
        DrawNoBet(this.statistics, market);
        break;
      case "1035001":
        GoalScoredInBoth(this.statistics, market);
        break;
      default:
        console.log(`Market with outcome id ${outcomeID} undefined.`);
    }
  };
  /*
  GetResults = () => {
    return this.estimatedOutcomes;
  };
*/
  Start = () => {
    this.marketsToEstimate.forEach((market) => {
      this.EstimateMarket(market);
    });

    console.log("Markets estimated.");
  };
}

module.exports = Estimate;
