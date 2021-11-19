import supertest from "supertest";
import {
  feedDigipet,
  hatchDigipet,
  ignoreDigipet,
  trainDigipet,
  walkDigipet,
} from "./digipet/controller";
import { INITIAL_DIGIPET, setDigipet } from "./digipet/model";
import app from "./server";

/**
 * The below line mock all imports from './digipet/controller'.
 *
 * We're mocking here for separation of concerns - we're testing the rough structure of server responses and whether they're calling the right controllers, but we don't care here what the controllers do.
 *
 * (There's a separate suite of integration tests that tests endpoint responses _and_ side effects.)
 *
 * On mocking: https://circleci.com/blog/how-to-test-software-part-i-mocking-stubbing-and-contract-testing/
 *
 * On mocking in jest: https://jestjs.io/docs/en/jest-object#jestmockmodulename-factory-options
 */
jest.mock("./digipet/controller");

describe("GET /", () => {
  it("provides a nod to instructions in the response body", async () => {
    const response = await supertest(app).get("/");
    expect(response.body.devMessage).toMatch("/instructions");
  });
});

describe("GET /instructions", () => {
  it("responds with a description that has important keywords", async () => {
    const response = await supertest(app).get("/instructions");
    const keywords = ["/digipet", "hatch", "feed", "ignore", "train", "walk"];
    for (let keyword of keywords) {
      // check the keyword is mentioned in the response body
      expect(response.body.devMessage).toMatch(keyword);
    }
  });
});

describe("GET /digipet", () => {
  test("if the user has a digipet, it responds with the digipet data and a description about the user's digipet", async () => {
    setDigipet(INITIAL_DIGIPET);
    const response = await supertest(app).get("/digipet");
    expect(response.body.digipet).toStrictEqual(INITIAL_DIGIPET);
    expect(response.body.description).toMatch(/your digipet/i);
  });

  test("if the user has no digipet, it responds with a description about not having a digipet", async () => {
    setDigipet(undefined);
    const response = await supertest(app).get("/digipet");
    expect(response.body.digipet).not.toBeDefined();
    expect(response.body.description).toMatch(/don't have/i);
  });
});

describe("GET /digipet/hatch", () => {
  test("if the user has a digipet, it responds with a description explaining that a digipet can't be hatched whilst the user has another", async () => {
    // setup
    if (jest.isMockFunction(hatchDigipet) /* type guard */) {
      hatchDigipet.mockReset();
    }
    setDigipet(INITIAL_DIGIPET);

    // act
    const response = await supertest(app).get("/digipet/hatch");

    // assert
    expect(response.body.description).toMatch(/can't hatch/i);
    expect(hatchDigipet).toHaveBeenCalledTimes(0);
  });

  test("if the user has no digipet, it responds with a description about successfully hatching a digipet and calls hatchDigipet", async () => {
    // setup
    if (jest.isMockFunction(hatchDigipet) /* type guard */) {
      hatchDigipet.mockReset();
    }
    setDigipet(undefined);

    // act
    const response = await supertest(app).get("/digipet/hatch");

    // assert
    expect(response.body.description).toMatch(/success/i);
    expect(response.body.description).toMatch(/hatch/i);
    expect(hatchDigipet).toHaveBeenCalledTimes(1);
  });
});

describe("action routes", () => {
  test("when the user does not have a digipet, action routes direct them to hatch a digipet and do not call their relevant controllers", async () => {
    const routesAndControllers = {
      /* test for these once written */
      // "/digipet/feed": feedDigipet,
      // '/digipet/train': trainDigipet,
      "/digipet/walk": walkDigipet,
    };

    for (let [route, controller] of Object.entries(routesAndControllers)) {
      // reset mock of the controller
      if (jest.isMockFunction(controller) /* type guard */) {
        controller.mockReset();
      }
      setDigipet(undefined);
      const response = await supertest(app).get(route);
      expect(response.body.description).toMatch(/you don't have/i);
      expect(response.body.devMessage).toMatch(/try/i);
      // suggest a helpful endpoint
      expect(response.body.devMessage).toMatch("/digipet/hatch");

      // expect relevant controller not to have been called
      expect(controller).toHaveBeenCalledTimes(0);
    }
  });

  describe("GET /digipet/feed", () => {
    test("if the user has a digipet, it calls the feedDigipet controller and responds with a description about feeding the digipet", async () => {
      // setup: reset digipet
      setDigipet(INITIAL_DIGIPET);

      const response = await supertest(app).get("/digipet/feed");

      // response includes a relevant description
      expect(response.body.description).toMatch(/fed/i);

      // response includes digipet data
      expect(response.body.digipet).toHaveProperty("happiness");
      expect(response.body.digipet).toHaveProperty("nutrition");
      expect(response.body.digipet).toHaveProperty("discipline");
    });

    it("delegates state change to the feedDigipet function", async () => {
      // setup: reset digipet and mock function
      setDigipet(INITIAL_DIGIPET);

      if (jest.isMockFunction(feedDigipet) /* type guard */) {
        feedDigipet.mockReset();
      }
      // act
      await supertest(app).get("/digipet/feed");
      // assert
      expect(feedDigipet).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /digipet/train", () => {
    test("if the user has a digipet, it calls the trainDigipet controller and responds with a description about training the digipet", async () => {
      // setup: reset digipet
      setDigipet(INITIAL_DIGIPET);

      const response = await supertest(app).get("/digipet/train");

      // mock function has been called once

      // response includes a relevant description
      expect(response.body.description).toMatch(/train/i);

      // response includes digipet data
      expect(response.body.digipet).toHaveProperty("happiness");
      expect(response.body.digipet).toHaveProperty("nutrition");
      expect(response.body.digipet).toHaveProperty("discipline");
    });

    it("delegates state change to the trainDigipet function", async () => {
      // setup: reset digipet and mock function
      setDigipet(INITIAL_DIGIPET);
      if (jest.isMockFunction(trainDigipet) /* type guard */) {
        trainDigipet.mockReset();
      }
      // act
      await supertest(app).get("/digipet/train");
      // assert
      expect(trainDigipet).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /digipet/walk", () => {
    test("if the user has a digipet, it responds with a description about the walk", async () => {
      // setup: reset digipet
      setDigipet(INITIAL_DIGIPET);

      const response = await supertest(app).get("/digipet/walk");

      // response includes a relevant description
      expect(response.body.description).toMatch(/walk/i);

      // response includes digipet data
      expect(response.body.digipet).toHaveProperty("happiness");
      expect(response.body.digipet).toHaveProperty("nutrition");
      expect(response.body.digipet).toHaveProperty("discipline");
    });

    it("delegates state change to the walkDigipet function", async () => {
      // setup: reset digipet and mock function
      setDigipet(INITIAL_DIGIPET);
      if (jest.isMockFunction(walkDigipet) /* type guard */) {
        walkDigipet.mockReset();
      }
      // act
      await supertest(app).get("/digipet/walk");
      // assert
      expect(walkDigipet).toHaveBeenCalledTimes(1);
    });
  });
});

describe("GET /digipet/ignore", () => {
  test("if the user has a digipet, it responds with a description about the ignore", async () => {
    // setup: reset digipet
    setDigipet(INITIAL_DIGIPET);

    const response = await supertest(app).get("/digipet/ignore");

    // response includes a relevant description
    expect(response.body.description).toMatch(/ignore/i);

    // response includes digipet data
    expect(response.body.digipet).toHaveProperty("happiness");
    expect(response.body.digipet).toHaveProperty("nutrition");
    expect(response.body.digipet).toHaveProperty("discipline");
  });

  it("delegates state change to the ignoreDigipet function", async () => {
    // setup: reset digipet and mock function
    setDigipet(INITIAL_DIGIPET);
    if (jest.isMockFunction(ignoreDigipet) /* type guard */) {
      ignoreDigipet.mockReset();
    }
    // act
    await supertest(app).get("/digipet/ignore");
    // assert
    expect(ignoreDigipet).toHaveBeenCalledTimes(1);
  });
});