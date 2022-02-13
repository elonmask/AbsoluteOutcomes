export const InningThreeWay = (statistics, market) => {
  const homeScore = statistics.periods[`p${market.specifiers['inningnr']}`].home;
  const awayScore = statistics.periods[`p${market.specifiers['inningnr']}`].away;

  if (homeScore > awayScore) {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
    market.outomes[2].status = 3;
  } else {
    if (homeScore < awayScore) {
      market.outomes[0].status = 3;
      market.outomes[1].status = 3;
      market.outomes[2].status = 2;
    } else {
      market.outomes[0].status = 3;
      market.outomes[1].status = 2;
      market.outomes[2].status = 3;
    }
  }
}

export const InningTotalRuns = (statistics, market) => {
  const inning = market.specifiers['inningnr'];
  const total = market.specifiers['total'];
  const totalRuns = statistics.total;

  if (totalRuns < total) {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
  } else {
    market.outomes[0].status = 3;
    market.outomes[1].status = 2;
  }
}