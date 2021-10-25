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
  HalfTimeAnyTimeCorrectScore,
  HalfTimeResultTotal,
  GoalScorer,
  HalfTimeTeamTotalGoals,
  SecondHalf3Way,
  SecondHalfAnyTimeCorrectScore,
  SecondTimeTotalGoals,
  SecondHalfTeamTotalGoals,
  BothTeamsToScoreHalfTime,
  HalfTimeCorrectScore,
  TotalGoalsInFirst10Minutes,
  TotalThrowInsInFirst10Minutes,
  TeamTotalSaves,
  TotalSaves,
  HalfTimeTeamTotalThrowIns,
  HalfTimeTeamTotalShots,
  TotalCorners,
  TeamTotalCorners,
  TotalOffsides,
  TotalShotsOnGoal,
  HalfTimeTotalShotsOnGoal,
  FirstToScore,
  ToScoreTwoOrMoreGoals,
  HalfTimeGoals,
  SetGameTotalPoints,
  SetScoreAfterGames,
  PlayerServiceGameTotalPoints,
} = require("./Functions");
const { mark } = require("yarn/lib/cli");

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
      case "902001":
        FromTo3WayResult(this.statistics, market);
        break;
      case "896001":
        GoalBetween(this.statistics, market);
        break;
      case "905001":
        HalftimeMinuteResult(this.statistics, market);
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
      case "1051017":
        HalfTimeAnyTimeCorrectScore(this.statistics, market);
        break;
      case "1054006":
        HalfTimeResultTotal(this.statistics, market);
        break;
      case "63002":
      case "64002":
        HalfTimeTeamTotalGoals(this.statistics, market);
        break;
      case "76001":
        SecondHalf3Way(this.statistics, market);
        break;
      case "90004":
        SecondHalfAnyTimeCorrectScore(this.statistics, market);
        break;
      case "82002":
        SecondTimeTotalGoals(this.statistics, market);
        break;
      case "83002":
      case "84002":
        SecondHalfTeamTotalGoals(this.statistics, market);
        break;
      case "69001":
        BothTeamsToScoreHalfTime(this.statistics, market);
        break;
      case "75004":
        HalfTimeCorrectScore(this.statistics, market);
        break;
      case "5000000760":
        TotalGoalsInFirst10Minutes(this.statistics, market);
        break;
      case "5000000790":
        TotalThrowInsInFirst10Minutes(this.statistics, market);
        break;
      case "5000000730":
      case "5000000740":
        TeamTotalSaves(this.statistics, market);
        break;
      case "5000000720":
        TotalSaves(this.statistics, market);
        break;
      case "5000000700":
      case "5000000670":
        HalfTimeTeamTotalThrowIns(this.statistics, market);
        break;
      case "5000000630":
      case "5000000660":
        HalfTimeTeamTotalShots(this.statistics, market);
        break;
      case "156002":
        TotalCorners(this.statistics, market);
        break;
      case "157002":
      case "158002":
        TeamTotalCorners(this.statistics, market);
        break;
      case "5000000090":
        TotalOffsides(this.statistics, market);
        break;
      case "5000000110":
        TotalShotsOnGoal(this.statistics, market);
        break;
      case "5000000310":
        HalfTimeTotalShotsOnGoal(this.statistics, market);
        break;
      case "918001":
        HalfTimeGoals(this.statistics, market);
        break;
      /*Tennis*/
      case "1024002":
        SetGameTotalPoints(this.statistics, market);
        break;
      case "1030002":
      case "1031002":
        PlayerServiceGameTotalPoints(this.statistics, market);
        break;
      default:
        console.log(`Market with outcome id ${outcomeID} undefined.`);
    }
    switch (market.name) {
      case "{!goalnr} goalscorer":
        GoalScorer(this.statistics, market);
        break;
      case "First to score for their team":
        FirstToScore(this.statistics, market);
        break;
      case "To score 2 or more goals":
        ToScoreTwoOrMoreGoals(this.statistics, market);
        break;
      /*Tennis*/
      case "{!set} set score after {game} games":
        SetScoreAfterGames(this.statistics, market);
        break;
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
