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
};

const BetradarBasketEventTeam = (event, source) => {
  return event.team.length > 3
    ? event.team === "home"
      ? source.data.match.teams.home.name
      : source.data.match.teams.away.name
    : "";
};

const BetradarBaseballEventTeam = (event, source) => {
  return event.team.length > 3
    ? event.team === "home"
      ? source.data.match.teams.home.name
      : source.data.match.teams.away.name
    : "";
};

const BetradarBasketEvent = (event, team) => {
  if (event.time === -1) {
    if (team.length > 1) {
      if (event.type === "goal" && event.scorer?.name.length > 1) {
        return event.name + " - " + team + " - " + event.scorer.name;
      } else {
        return event.name + " - " + team;
      }
    } else {
      return event.name;
    }
  } else {
    if (team.length > 1) {
      if (event.type === "goal" && event.scorer.name.length > 1) {
        return (
          event.name +
          " - " +
          team +
          " - " +
          event.scorer.name +
          " - " +
          event.time +
          "' " +
          event.updated_uts
        );
      } else {
        return (
          event.name +
          " - " +
          team +
          " - " +
          event.time +
          "' " +
          event.updated_uts
        );
      }
    } else {
      return event.name + " - " + event.time + "'";
    }
  }
};

const BetradarBaseballEvent = (event, team) => {
  /*if (event.time === -1) {
    if (team.length > 1) {
      if (event.type === "goal" && event.scorer?.name.length > 1) {
        return event.name + " - " + team + " - " + event.scorer.name;
      } else {
        return event.name + " - " + team;
      }
    } else {
      if (event.type === "periodscore") {
        return (
          event.name +
          " - " +
          `${event.periodnumber} Period Score` +
          ` ${event.periodscore.home + ":" + event.periodscore.away}`
        );
      } else {
        return event.name;
      }
    }
  } else {*/
  if (event.type === "goal" && event.scorer?.name.length > 1) {
    return (
      event.name +
      " - " +
      team +
      " - " +
      event.scorer.name +
      " - " +
      event.time +
      "' " +
      event.updated_uts
    );
  } else {
    if (event.type === "periodscore") {
      if (event.periodnumber) {
        return (
          event.name +
          " - " +
          `${event.periodnumber} Period Score` +
          ` ${event.periodscore.home + ":" + event.periodscore.away}`
        );
      } else {
        return (
          event.name +
          " - " +
          `${event.name} Period Score` +
          ` ${event.periodscore.home + ":" + event.periodscore.away}`
        );
      }
    } else {
      if (team.length > 1) {
        return event.name + " - " + team + " - " + event.updated_uts;
      } else {
        return event.name + " - " + event.updated_uts;
      }
    }
  }
  //}
};

const BetradarTennisEvent = (event, team) => {
  if (team.length > 1) {
    if (event.type === "score_change_tennis" && event.pointflag.length > 1) {
      return event.name + " - " + team + " - " + event.pointflag;
    }
    if (event.type === "periodscore") {
      return (
        event.name + " periodscore" + " - " + team + " - " + event.pointflag
      );
    }
    return event.name + " - " + team;
  } else {
    return event.name;
  }
};

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

const getCurrentSetNumber = (statistics) => {
  const setsArray = [];
  statistics.events.forEach((event) => {
    if (
      event.text.includes("st set") ||
      event.text.includes("nd set") ||
      event.text.includes("rd set") ||
      event.text.includes("th set")
    ) {
      setsArray.push(parseInt(event.text[0]));
    }
  });

  return setsArray[setsArray.length - 1];
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
  BetradarTennisEvent,
  getCurrentSetNumber,
  BetradarBasketEvent,
  BetradarBasketEventTeam,
  BetradarBaseballEvent,
  BetradarBaseballEventTeam,
};
