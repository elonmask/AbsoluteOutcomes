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
  FromTo3WayResult,
  GoalBetween,
  HalftimeMinuteResult,
  SecondHTotalGoalsOverUnder,
  TeamToScoreLast,
  ToScoreInBoth,
  ToWinBoth,
  HighestScoringHalf,
  ToWinEitherHalf,
  HalfTime3Way,
  CorrectScore,
  HalfTimeDoubleChance,
  TeamToScore,
  HalfTimeTotalGoals,
  NumberOfGoals,
  AnyTimeCorrectScore,
} = require("./Functions");
const { mark } = require("yarn/lib/cli");

class Estimate {
  constructor(statistics, marketsToEstimate) {
    this.statistics = statistics;
    this.marketsToEstimate = marketsToEstimate;
  }

  EstimateMarket = (market) => {
    const outcomeID = market.outcomes[0].outcomeId;
    console.log(outcomeID);

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
        4;
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
      case "902001":
        FromTo3WayResult(this.statistics, market);
        break;
      case "896001":
        GoalBetween(this.statistics, market);
        break;
      case "905001":
        HalftimeMinuteResult(this.statistics, market);
        break;
      case "82002":
        SecondHTotalGoalsOverUnder(this.statistics, market);
        break;
      case "916001":
        TeamToScoreLast(this.statistics, market);
        break;
      case "920001":
        ToScoreInBoth(this.statistics, market);
        break;
      case "921001":
        ToWinBoth(this.statistics, market);
        break;
      case "27001":
        BothTeamsToScore(this.statistics, market);
        break;
      case "42001":
        HalfTimeFullTime(this.statistics, market);
        break;
      case "47001":
        HighestScoringHalf(this.statistics, market);
        break;
      case "950001":
        ToWinEitherHalf(this.statistics, market);
        break;
      case "55001":
        HalfTime3Way(this.statistics, market);
        break;
      case "889002":
        CorrectScore(this.statistics, market);
        break;
      case "1050011":
        AnyTimeCorrectScore(this.statistics, market);
        break;
      case "58001":
        HalfTimeDoubleChance(this.statistics, market);
        break;
      case "956001":
        TeamToScore(this.statistics, market);
        break;
      case "62002":
        HalfTimeTotalGoals(this.statistics, market);
        break;
      case "895003":
        NumberOfGoals(this.statistics, market);
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
