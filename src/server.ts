import express from "express";
import cors from "cors";
import { getDigipet } from "./digipet/model";
import { feedDigipet, hatchDigipet, ignoreDigipet, trainDigipet, walkDigipet } from "./digipet/controller";

const app = express();

/**
 * Simplest way to connect a front-end. Unimportant detail right now, although you can read more: https://flaviocopes.com/express-cors/
 */
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    devMessage:
      "If in doubt, check out the /instructions endpoint!",
    description: "Welcome to Digipet, the totally original digital pet game! Keep your pet happy, healthy and well-disciplined to win the game.",
    });
});

app.get("/instructions", (req, res) => {
  res.json({
    devMessage:
      "You can check out your digipet's stats with /digipet, and add various actions after that with the /digipet/[action], for actions like walk, train, feed, ignore and hatch. For example, try /digipet/walk to walk a digipet!",
  });
});

app.get("/digipet", (req, res) => {
  const digipet = getDigipet();
  if (digipet) {
    res.json({
      description: "Your digipet is waiting for you!",
      digipet, // equivalent to digipet: digipet
    });
  } else {
    res.json({
      description: "You don't have a digipet yet!",
      devMessage: "Try hatching one with /hatch",
      digipet: undefined,
    });
  }
});

app.get("/digipet/hatch", (req, res) => {
  const digipet = getDigipet();
  if (digipet) {
    res.json({
      description: "You can't hatch a digipet now because you already have one!",
      digipet,
    });
  } else {
    const digipet = hatchDigipet();
    res.json({
      description:
        "You have successfully hatched an adorable new digipet. Just the cutest.",
      digipet,
    });
  }
});

app.get("/digipet/walk", (req, res) => {
  // check the user has a digipet to walk
  if (getDigipet()) {
    walkDigipet();
    res.json({
      description: "You walked your digipet. It looks happier now!",
      digipet: getDigipet(),
    });
  } else {
    res.json({
      description:
        "You don't have a digipet to walk!",
      devMessage: "Try hatching one with /digipet/hatch",
    });
  }
});

app.get("/digipet/train", (req, res) => {
  // check the user has a digipet to train
  if (getDigipet()) {
    trainDigipet();
    res.json({
      description: "You trained your digipet. It seems more disciplined now!",
      digipet: getDigipet(),
    });
  } else {
    res.json({
      description:
        "You don't have a digipet to train!",
      devMessage: "Try hatching one with /digipet/hatch",
    });
  }
});

app.get("/digipet/feed", (req, res) => {
  // check the user has a digipet to feed
  if (getDigipet()) {
    feedDigipet();
    res.json({
      description: "You fed your digipet. It seems more disciplined now!",
      digipet: getDigipet(),
    });
  } else {
    res.json({
      description:
        "You don't have a digipet to feed!",
      devMessage: "Try hatching one with /digipet/hatch",
    });
  }
});

app.get("/digipet/ignore", (req, res) => {
  // check the user has a digipet to ignore
  if (getDigipet()) {
    ignoreDigipet();
    res.json({
      description: "You ignored your digipet.",
      digipet: getDigipet(),
    });
  } else {
    res.json({
      description:
        "You don't have a digipet to ignore stupid!",
      devMessage: "Try hatching one with /digipet/hatch",
    });
  }
});

export default app;
