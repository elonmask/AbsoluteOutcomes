const {
  fullTimeResult,
  HalfTimeFullTime,
  BothTeamsToScore,
  WhichTeamToScoreNGoal,
  DoubleChance,
  CorrectScoreComninations,
  DrawNoBet,
  GoalScoredInBoth,
  MatchBetBothScore,
  WinOver,
  Handicap3Way,
  BothToScoreTotalGoals,
  ToWinToNil,
  Handicap,
  TotalGoals,
  BothToScoreNoDraw,
  TeamTotalGoals,
  OneMinuteEvents,
  BothToScoreInBothHalves,
  TotalGoalsOddEven,
} = require("./Functions");

class Estimate {
  constructor(statistics, marketsToEstimate) {
    this.statistics = statistics;
    this.marketsToEstimate = marketsToEstimate;
  }

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
      case "1036002":
        MatchBetBothScore(this.statistics, market);
        break;
      case "1037002":
        WinOver(this.statistics, market);
        break;
      case "14001":
        Handicap3Way(this.statistics, market);
        break;
      case "1038004":
        BothToScoreTotalGoals(this.statistics, market);
        break;
      case "1039002":
      case "1040002":
        ToWinToNil(this.statistics, market);
        break;
      case "16001":
        Handicap(this.statistics, market);
        break;
      case "17002":
        TotalGoals(this.statistics, market);
        break;
      case "1041001":
        BothToScoreNoDraw(this.statistics, market);
        break;
      case "18002":
      case "19002":
        TeamTotalGoals(this.statistics, market);
        break;
      case "1043010":
        OneMinuteEvents(this.statistics, market);
        break;
      case "1044001":
        BothToScoreInBothHalves(this.statistics, market);
        break;
      case "24001":
        TotalGoalsOddEven(this.statistics, market);
        break;
      default:
        console.log(`Market with outcome id ${outcomeID} undefined.`);
    }
  };

  Start = () => {
    this.marketsToEstimate.forEach((market) => {
      this.EstimateMarket(market);
    });

    console.log("Markets estimated.");
  };
}

module.exports = Estimate;
