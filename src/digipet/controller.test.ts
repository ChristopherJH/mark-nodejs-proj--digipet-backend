import {
  feedDigipet,
  hatchDigipet,
  ignoreDigipet,
  trainDigipet,
  walkDigipet,
} from "./controller";
import { getDigipet, INITIAL_DIGIPET, setDigipet } from "./model";

describe("feedDigipet", () => {
  it("increases digipet nutrition by 10 and decreases discipline by 5", () => {
    // setup
    setDigipet(INITIAL_DIGIPET);
    expect(getDigipet()).toStrictEqual(INITIAL_DIGIPET);

    // act
    feedDigipet();

    // assert
    expect(getDigipet()).toStrictEqual({
      happiness: INITIAL_DIGIPET.happiness,
      nutrition: INITIAL_DIGIPET.nutrition + 10,
      discipline: INITIAL_DIGIPET.discipline - 5,
    });
  });

  it("cannot increase nutrition past 100", () => {
    // setup
    setDigipet({ happiness: 50, nutrition: 95, discipline: 50 });

    // act
    feedDigipet();

    // assert
    expect(getDigipet()).toHaveProperty("nutrition", 100);
  });

  it("cannot decrease discipline below 0", () => {
    // setup
    setDigipet({ happiness: 50, nutrition: 50, discipline: 0 });

    // act
    feedDigipet();

    // assert
    expect(getDigipet()).toHaveProperty("discipline", 0);
  });
});

describe("hatchDigipet", () => {
  test("when there is no current digipet, it creates a digipet with default initial values and returns it", () => {
    // setup
    setDigipet(undefined);

    // act
    const digipet = hatchDigipet();

    // assert
    expect(digipet).toStrictEqual(INITIAL_DIGIPET);
    expect(getDigipet()).toStrictEqual(INITIAL_DIGIPET);
  });

  test("when there is a current digipet, it throws an error", () => {
    // setup
    setDigipet({ happiness: 50, nutrition: 50, discipline: 50 });

    // assert error gets thrown
    expect(() => hatchDigipet()).toThrowError();
  });
});

describe("trainDigipet", () => {
  it("increases digipet discipline by 10 and decreases happiness by 5", () => {
    // setup
    setDigipet(INITIAL_DIGIPET);
    expect(getDigipet()).toStrictEqual(INITIAL_DIGIPET);

    // act
    trainDigipet();

    // assert
    expect(getDigipet()).toStrictEqual({
      happiness: INITIAL_DIGIPET.happiness - 5,
      nutrition: INITIAL_DIGIPET.nutrition,
      discipline: INITIAL_DIGIPET.discipline + 10,
    });
  });

  it("cannot increase discipline past 100", () => {
    // setup
    setDigipet({ happiness: 50, nutrition: 50, discipline: 95 });

    // act
    trainDigipet();

    // assert
    expect(getDigipet()).toHaveProperty("discipline", 100);
  });

  it("cannot decrease happiness below 0", () => {
    // setup
    setDigipet({ happiness: 0, nutrition: 50, discipline: 50 });

    // act
    trainDigipet();

    // assert
    expect(getDigipet()).toHaveProperty("happiness", 0);
  });
});

describe("ignoreDigipet", () => {
  it("decreases all of digipets stats by 10", () => {
    // setup
    setDigipet(INITIAL_DIGIPET);
    expect(getDigipet()).toStrictEqual(INITIAL_DIGIPET);

    // act
    ignoreDigipet();

    // assert
    expect(getDigipet()).toStrictEqual({
      happiness: INITIAL_DIGIPET.happiness - 10,
      nutrition: INITIAL_DIGIPET.nutrition - 10,
      discipline: INITIAL_DIGIPET.discipline - 10,
    });
  });

  it("cannot decrease happiness past 0", () => {
    // setup
    setDigipet({ happiness: 5, nutrition: 50, discipline: 50 });

    // act
    ignoreDigipet();

    // assert
    expect(getDigipet()).toHaveProperty("happiness", 0);
  });

  it("cannot decrease nutrition below 0", () => {
    // setup
    setDigipet({ happiness: 50, nutrition: 0, discipline: 50 });

    // act
    ignoreDigipet();

    // assert
    expect(getDigipet()).toHaveProperty("nutrition", 0);
  });

  it("cannot decrease discipline below 0", () => {
    // setup
    setDigipet({ happiness: 50, nutrition: 50, discipline: 0 });

    // act
    ignoreDigipet();

    // assert
    expect(getDigipet()).toHaveProperty("discipline", 0);
  });
});

