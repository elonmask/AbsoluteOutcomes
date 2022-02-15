const e = require("express");

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
  const out_reg = new RegExp(`${parseInt(inning) + 1}{2} inning - 16`);
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

const FirstFiveInningsTotalRuns = (statistics, market) => {
  const inning = market.specifiers['inningnr'];
  const total = market.specifiers['total'];

  let inningReached = false;
  const in_reg = new RegExp(`1st inning - 16`);
  const out_reg = new RegExp(`5th inning - 16`);
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

const RaceToRuns = (statistics, market) => {
  const runnr = market.specifiers['runnr'];
  let homeRuns = 0, awayRuns = 0;
  for (const event of statistics.events) {
    if (event.name.text.includes("Goal")) {
      if (event.name.includes(statistics.home.name)) {
        homeRuns++;
      } else {
        awayRuns++;
      }
      if (homeRuns === runnr || awayRuns === runnr) {
        break;
      }
    }
  }

  if (homeRuns === runnr) {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
    market.outomes[2].status = 3;
  } else {
    if (awayRuns === runnr) {
      market.outomes[0].status = 3;
      market.outomes[1].status = 2;
      market.outomes[2].status = 3;
    }
    else {
      market.outomes[0].status = 3;
      market.outomes[1].status = 3;
      market.outomes[2].status = 2;
    }
  }
}

const CompetitorTotalRuns = (statistics, market) => {
  const total = market.specifiers['total'];
  const team = market.name.includes('competitor1') ? 'home' : 'away';
  const teamName = statistics[team].name;
  let runs = 0;
  for (const event of statistics.events) {
    if (event.name.text.includes("Goal")) {
      if (event.name.includes(teamName)) {
        runs++;
      }
      if (runs > runnr) {
        break;
      }
    }
  }

  if (runs < total) {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
  } else {
    market.outomes[0].status = 3;
    market.outomes[1].status = 2;
  }
}

// TODO when hits statistic arrive
const InningTotalHits = (statistics, market) => {
  const inning = market.specifiers['inningnr'];
  const total = market.specifiers['total'];
  let hits = 0;
  let inningReached = false;
  const in_reg = new RegExp(`1st inning - 16`);
  const out_reg = new RegExp(`5th inning - 16`);
  for (const event of statistics.events) {
    if (event.name.text.match(in_reg)) {
      inningReached = true;
    }
    if (inningReached && event.name.text.includes("Hit")) {
      hits++;
    }
    if (event.name.text.match(out_reg)) {
      break;
    }
  }

  if (runs < total) {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
  } else {
    market.outomes[0].status = 3;
    market.outomes[1].status = 2;
  }
}

// TODO when hits statistic arrive
const InningMostHits = (statistics, market) => {
  const inning = market.specifiers['inningnr'];
  const total = market.specifiers['total'];
  let homeHits = 0, awayHits = 0;
  let inningReached = false;
  const in_reg = new RegExp(`${inning}{2} inning - 16`);
  const out_reg = new RegExp(`${parseInt(inning) + 1}{2} inning - 16`);
  for (const event of statistics.events) {
    if (event.name.text.match(in_reg)) {
      inningReached = true;
    }
    if (inningReached && event.name.text.includes("Hit")) {
      if (event.name.includes(statistics.home.name)) {
        homeHits++;
      } else {
        awayHits++;
      }
    }
    if (event.name.text.match(out_reg)) {
      break;
    }
  }

  if (homeHits === awayHits) {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
    market.outomes[2].status = 3;
  } else {
    if (homeHits > awayHits) {
      market.outomes[0].status = 3;
      market.outomes[1].status = 2;
      market.outomes[2].status = 3;
    } else {
      market.outomes[0].status = 3;
      market.outomes[1].status = 3;
      market.outomes[2].status = 2;
    }
  }
}

const FirstTeamToScore = (statistics, market) => {
  let goalScorer = 'no goal';
  statistics.events.forEach((event) => {
    if (event.text.includes("Goal")) {
      if (event.text.includes("competitor1")) {
        goalScorer = 'home';
      } else {
        goalScorer = 'away';
      }
      break;
    }
  });
  if (goalScorer === 'no goal') {
    market.outomes[0].status = 3;
    market.outomes[1].status = 2;
    market.outomes[2].status = 3;
  } else {
    if (goalScorer === 'home') {
      market.outomes[0].status = 2;
      market.outomes[1].status = 3;
      market.outomes[2].status = 3;
    } else {
      market.outomes[0].status = 3;
      market.outomes[1].status = 3;
      market.outomes[2].status = 2;
    }
  }
}

const LastTeamToScore = (statistics, market) => {
  let goalScorer = 'no goal';
  statistics.events.forEach((event) => {
    if (event.text.includes("Goal")) {
      if (event.text.includes("competitor1")) {
        goalScorer = 'home';
      } else {
        goalScorer = 'away';
      }
    }
  });
  if (goalScorer === 'home') {
    market.outomes[0].status = 2;
    market.outomes[1].status = 3;
    market.outomes[2].status = 3;
  } else {
    market.outomes[0].status = 3;
    market.outomes[1].status = 3;
    market.outomes[2].status = 2;
  }
}
}

module.exports = {
  InningThreeWay,
  InningTotalRuns,
  InningsTotal,
  FirstFiveInningsTotalRuns,
  RaceToRuns,
  CompetitorTotalRuns,
  InningTotalHits,
  InningMostHits,
  FirstTeamToScore,
  LastTeamToScore
}