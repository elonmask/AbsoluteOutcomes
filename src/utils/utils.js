const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, "g"), replace);
};

const nameToFitFormat = (eventName) => {
  if (
    eventName.includes("st") ||
    eventName.includes("nd") ||
    eventName.includes("rd") ||
    eventName.includes("th")
  ) {
    let formedName = [];
    eventName.split(" ").forEach((part, idx) => {
      if (idx !== 2) {
        if (eventName.split(" ").length - 1 === idx) {
          formedName.push(part);
        } else {
          formedName.push(part + " ");
        }
      }
    });

    return replaceAll(formedName.toString(), ",", "");
  } else {
    return eventName;
  }
};

const eventNameToCommon = (eventName) => {
  return eventName
    .replace("Corner kick", "Corner")
    .replace("Yellow card", "Yellow Card");
};

const BetradarEventWithPlayer = (event, team) => {
  if (event.player) {
    if (event.player.name.includes(",")) {
      return (
        event.time +
        "'" +
        " - " +
        event.name +
        " - " +
        event.player.name.replace(" ", "").split(",")[1] +
        " " +
        event.player.name.replace(" ", "").split(",")[0] +
        " (" +
        team +
        ")"
      );
    } else {
      return (
        event.time +
        "'" +
        " - " +
        event.name +
        " - " +
        event.player.name +
        " (" +
        team +
        ")"
      );
    }
  }
  if (event.scorer) {
    if (event.scorer.name.includes(",")) {
      return (
        event.time +
        "'" +
        " - " +
        event.name +
        " - " +
        event.scorer.name.replace(" ", "").split(",")[1] +
        " " +
        event.scorer.name.replace(" ", "").split(",")[0] +
        " (" +
        team +
        ")"
      );
    } else {
      return (
        event.time +
        "'" +
        " - " +
        event.name +
        " - " +
        event.scorer.name +
        " (" +
        team +
        ")"
      );
    }
  }
};

const BetradarEventWithoutPlayer = (event, team) => {
  return event.time + "'" + " - " + event.name + " - " + team;
};

const BetradarEventTeam = (event, source) => {
  return event.team.length > 3
    ? event.team === "home"
      ? source.data.match.teams.home.name
      : source.data.match.teams.away.name
    : "";
};

const BetradarTennisEventTeam = (event, source) => {
  return event.team.length > 3
    ? event.team === "home"
      ? source.data.match.teams.home.name
      : source.data.match.teams.away.name
    : "";
}

const BetradarTennisEvent = (event, team) => {
  if (team.length > 1) {
    if (event.type === "score_change_tennis" && event.pointflag.length > 1) {
      return event.name + " - " + team + " - " + event.pointflag;
    }
    if (event.type === "periodscore") {
      return event.name + " periodscore" + " - " + team + " - " + event.pointflag
    }
    return event.name + " - " + team;
  } else {
    return event.name;
  }
}

const Validate = (sources, event) => {
  if (event.confirmations >= sources.length) {
    return 1;
  }
  if (event.confirmations === sources.length / 2) {
    return 2;
  }
  if (event.confirmations < sources.length / 2) {
    return 3;
  }
};

module.exports = {
  replaceAll,
  nameToFitFormat,
  eventNameToCommon,
  BetradarEventWithPlayer,
  BetradarEventWithoutPlayer,
  BetradarEventTeam,
  Validate,
  BetradarTennisEventTeam,
  BetradarTennisEvent
};
