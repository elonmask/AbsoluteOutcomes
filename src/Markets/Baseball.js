const InningThreeWay = (statistics, market) => {
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

const InningTotalRuns = (statistics, market) => {
  const inning = market.specifiers['inningnr'];
  const total = market.specifiers['total'];

  let inningReached = false;
  const in_reg = new RegExp(`${inning}{2} inning - 16`);
  const out_reg = new RegExp(`${inning + 1}{2} inning - 16`);
  let totalRuns = 0;
  for (const event of statistics.events) {
    if (event.name.text.match(in_reg)) {
      inningReached = true;
    }
    if (inningReached && event.name.text.includes("Goal")) {
      totalRuns++;
    }
    if (event.name.text.match(out_reg)) {
      break;
    }
  }

  if (totalRuns < total) {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
  } else {
    market.outomes[0].status = 3;
    market.outomes[1].status = 2;
  }
}

const InningsTotal = (statistics, market) => {
  const inning = market.specifiers['inningnr'];
  const total = market.specifiers['total'];

  let inningReached = false;
  const in_reg = new RegExp(`1st inning - 16`);
  const out_reg = new RegExp(`${inning + 1}{2} inning - 16`);
  let totalRuns = 0;
  for (const event of statistics.events) {
    if (event.name.text.match(in_reg)) {
      inningReached = true;
    }
    if (inningReached && event.name.text.includes("Goal")) {
      totalRuns++;
    }
    if (event.name.text.match(out_reg)) {
      break;
    }
  }

  if (totalRuns < total) {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
  } else {
    market.outomes[0].status = 3;
    market.outomes[1].status = 2;
  }
}

export default {
  InningThreeWay,
  InningTotalRuns,
  InningsTotal
}