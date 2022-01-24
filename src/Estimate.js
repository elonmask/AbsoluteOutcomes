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
} = require("./Markets/Soccer");
const {
  SetGameTotalPoints,
  SetScoreAfterGames,
  PlayerServiceGameTotalPoints,
  SetTotalGames,
  TotalSets,
  MatchBothPlayersWinSet,
  TwoWay,
  TwoWayBeforeMin,
  GameHandicap,
  BothToWinSet,
  TotalGames,
  PlayerTotalGames,
  PlayerToWinOneSet,
  AnySetWillEndSix,
  SetWinner,
  SetGameHandicap,
  SetCorrectScore,
} = require("./Markets/Tennis");
const {
  FirstHalfTeamTotal,
  ThreeWay,
  HalftimeOddEven,
  SecondHalfThreeWay,
  MatchWinner,
  HandicapWithDraw,
  SecondHalfDrawNoBet,
  WillThereBeOvertime,
  WhichTeamScoresPoint,
  SecondHalfHandicap,
  Total,
  WinnerTotal,
  HandicapTwoWay,
  SecondHalfTotal,
  SecondHalfTotalOddEven,
  Total3Way,
  CompetitorTotal,
  TotalOddEven,
  WhichTeamRaceToPoints,
  QuarterHandicap,
  QuarterOddEven,
  Quarter3Way,
  QuarterTotal,
  Total3WayBeforeMin,
} = require("./Markets/Basketball");
const {
  CompetitorExactGoals,
  OddEven,
  WhichTeamToScore,
  CompetitorCleanSheet,
  ResultRestOfMatch,
  MatchWinnerTotalGoals,
  MatchWinnerBothTeamsToScore,
  PeriodAndWinner,
  CompetitorNoBet,
  PeriodAndMatchBet,
  WinningMargin,
  HighestScoringPeriod,
  CompetitorHighestScoringPeriod,
  ExactGoals,
  ToWinAllPeriods,
  ToScoreInAllPeriods,
  ToWinAnyPeriod,
  TotalGoalsPerPeriod,
  PeriodThreeWay,
  PeriodGoal,
  PeriodHandicap,
  PeriodTotalGoals,
  CompetitorPeriodExactGoals,
  BothTeamsToScoreHockey,
  ResultRestOfPeriod,
  DrawNoBetHockey,
  GoalAndMatchbet,
  CorrectScoreHockey,
  PeriodDoubleChance,
  Goal,
  PeriodMoneyLine,
  TotalGoalsBeforeMin,
  Handicap3WayBeforeMin,
} = require("./Markets/IceHockey");

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
      case "378001":
        Handicap3WayBeforeMin(this.statistics, market);
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
      case "380001":
        Handicap(this.statistics, market);
        break;
      case "17002":
      case "382002":
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
      /*Tennis & Volleyball*/
      case "1024002":
        SetGameTotalPoints(this.statistics, market);
        break;
      case "1030002":
      case "1031002":
        PlayerServiceGameTotalPoints(this.statistics, market);
        break;
      case "1057002":
        SetTotalGames(this.statistics, market);
        break;
      case "291002":
        TotalSets(this.statistics, market);
        break;
      case "1070001":
        MatchBothPlayersWinSet(this.statistics, market);
        break;
      case "175001":
        TwoWay(this.statistics, market);
        break;
      case "176001":
        GameHandicap(this.statistics, market);
        break;
      case "1074002":
        BothToWinSet(this.statistics, market);
        break;
      case "178002":
        TotalGames(this.statistics, market);
        break;
      case "179002":
      case "180002":
        PlayerTotalGames(this.statistics, market);
        break;
      case "181001":
      case "182001":
        PlayerToWinOneSet(this.statistics, market);
        break;
      case "183001":
        AnySetWillEndSix(this.statistics, market);
        break;
      case "189001":
        SetWinner(this.statistics, market);
        break;
      case "190001":
        SetGameHandicap(this.statistics, market);
        break;
      /* Ice hockey */
      case "384002":
      case "385002":
        CompetitorTotal(this.statistics, market);
        break;
      case "389001":
        OddEven(this.statistics, market, false);
        break;
      case "390002":
        WhichTeamToScore(this.statistics, market, true);
        break;
      case "7001":
        ResultRestOfMatch(this.statistics, market);
        break;
      case "391001":
      case "392001":
        CompetitorCleanSheet(this.statistics, market, true, false);
        break;
      case "394001":
        MatchWinnerTotalGoals(this.statistics, market, true);
        break;
      case "395001":
        MatchWinnerBothTeamsToScore(this.statistics, market, true);
        break;
      case "396001":
        PeriodAndWinner(this.statistics, market, true);
        break;
      case "12001":
      case "13001":
        CompetitorNoBet(this.statistics, market);
        break;
      case "398001":
        PeriodAndWinner(this.statistics, market, false);
        break;
      case "401001":
      case "402001":
        HighestScoringPeriod(this.statistics, market, false);
        break;
      case "403001":
        CompetitorHighestScoringPeriod(this.statistics, market);
        break;
      case "404001":
      case "405001":
        ToWinAllPeriods(this.statistics, market);
        break;
      case "406001":
      case "1131001":
        ToWinAnyPeriod(this.statistics, market);
      case "407001":
      case "1132001":
        ToScoreInAllPeriods(this.statistics, market);
        break;
      case "408001":
      case "409001":
        TotalGoalsPerPeriod(this.statistics, market);
        break;
      case "410001":
        PeriodThreeWay(this.statistics, market);
        break;
      case "411001":
        PeriodGoal(this.statistics, market);
        break;
      case "28004":
        WhichTeamToScore(this.statistics, market, false, false);
        break;
      case "412001":
      case "424001":
        PeriodHandicap(this.statistics, market);
        break;
      case "413002":
      case "1133002":
      case "1134002":
        PeriodTotalGoals(this.statistics, market);
        break;
      case "29001":
      case "30001":
        CompetitorCleanSheet(this.statistics, market, false, false);
        break;
      case "416001":
        BothTeamsToScoreHockey(this.statistics, market, true);
        break;
      case "417004":
        WhichTeamToScore(this.statistics, market, false, true);
        break;
      case "33001":
        MatchWinnerBothTeamsToScore(this.statistics, market, false);
        break;
      case "418001":
      case "419001":
        CompetitorCleanSheet(this.statistics, market, false, true);
        break;
      case "35001":
        MatchWinnerTotalGoals(this.statistics, market, false);
        break;
      case "422002":
        ResultRestOfPeriod(this.statistics, market);
        break;
      case "423001":
        DrawNoBetHockey(this.statistics, market, true);
        break;
      case "425001":
        OddEven(this.statistics, market, true);
        break;
      case "174001":
        GoalAndMatchbet(this.statistics, market, true);
        break;
      case "207001":
        WillThereBeOvertime(this.statistics, market);
        break;
      case "483001":
        PeriodDoubleChance(this.statistics, market);
        break;
      case "376001":
        TwoWay(this.statistics, market);
        break;
      case "377001":
        Goal(this.statistics, market);
        break;
      case "400901":
        PeriodMoneyLine(this.statistics, market);
        break;
      case "401101":
        PeriodTotalGoals(this.statistics, market);
        break;
      case "401201":
        PeriodMoneyLine(this.statistics, market);
        break;
      case "400501":
        Total3Way(this.statistics, market);
        break;
      case "401401":
        TotalGoalsBeforeMin(this.statistics, market);
        break;
      case "401501":
        TwoWayBeforeMin(this.statistics, market);
        break;
      case "401601":
        Handicap3WayBeforeMin(this.statistics, market);
        break;
      case "401701":
        Total3WayBeforeMin(this.statistics, market);
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
      case "{!setnr} set - correct score":
        SetCorrectScore(this.statistics, market);
        break;
    }
    if (
      market.name
        .toLowerCase()
        .includes("exact goals (incl. overtime and penalties)")
    ) {
      CompetitorExactGoals(this.statistics, market, false);
      return;
    }
    if (market.name.toLowerCase().includes("exact goals")) {
      if (market.name.includes("period")) {
        if (market.name.includes("competitor")) {
          CompetitorExactGoals(this.statistics, market, true);
        } else {
          ExactGoals(this.statistics, market, true); // 1135
        }
      } else {
        ExactGoals(this.statistics, market, false);
      }
      return;
    }
    if (market.name.includes("Winning margin")) {
      WinningMargin(this.statistics, market);
      return;
    }
    if (market.name.includes("Correct score")) {
      CorrectScoreHockey(this.statistics, market);
      return;
    }
  };
  EstimateMarketBasketBall = (market) => {
    const outcomeID = market.outcomes[0].outcomeId;
    switch (outcomeID) {
      case "64002":
        FirstHalfTeamTotal(this.statistics, market);
        break;
      case "1001":
        ThreeWay(this.statistics, market);
        break;
      case "68001":
        HalftimeOddEven(this.statistics, market);
        break;
      case "76001":
        SecondHalfThreeWay(this.statistics, market);
        break;
      case "206001":
        MatchWinner(this.statistics, market);
        break;
      case "14001":
        HandicapWithDraw(this.statistics, market);
        break;
      case "79001":
        SecondHalfDrawNoBet(this.statistics, market);
        break;
      case "272001":
        WhichTeamScoresPoint(this.statistics, market);
        break;
      case "81001":
      case "218001":
        SecondHalfHandicap(this.statistics, market);
        break;
      case "17002":
      case "212002":
        Total(this.statistics, market);
        break;
      case "273003":
        WinnerTotal(this.statistics, market);
        break;
      case "210001":
        HandicapTwoWay(this.statistics, market);
        break;
      case "82002":
      case "219002":
        SecondHalfTotal(this.statistics, market);
        break;
      case "276001":
      case "86001":
        SecondHalfTotalOddEven(this.statistics, market);
        break;
      case "277001":
        Total3Way(this.statistics, market);
        break;
      case "214002":
      case "215002":
        CompetitorTotal(this.statistics, market);
        break;
      case "216001":
        TotalOddEven(this.statistics, market);
        break;
      case "217001":
        WhichTeamRaceToPoints(this.statistics, market);
        break;
      case "282001":
        QuarterHandicap(this.statistics, market);
        break;
      case "283001":
        QuarterOddEven(this.statistics, market);
        break;
      case "221001":
        Quarter3Way(this.statistics, market);
        break;
      case "222002":
        QuarterTotal(this.statistics, market);
        break;
    }
  };

  Start = () => {
    if (this.statistics.sport_id === "2") {
      this.marketsToEstimate.forEach((market) => {
        this.EstimateMarketBasketBall(market);
      });
    } else {
      this.marketsToEstimate.forEach((market) => {
        this.EstimateMarket(market);
      });
    }

    console.log("Markets estimated.");
  };
}

module.exports = Estimate;
