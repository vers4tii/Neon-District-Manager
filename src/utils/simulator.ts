import { useCityStore } from "../store/cityStore";

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function simulateEvent() {
  const store = useCityStore.getState();
  const events = [
    () => {
      const pop = randomInt(5, 20);
      store.increasePopulation(pop);
      store.addEvent(`Population increased by ${pop}`);
    },
    () => {
      const energy = randomInt(5, 15);
      store.spendEnergy(energy);
      store.addEvent(`Energy decreased by ${energy}`);
    },
    () => {
      const money = randomInt(10, 50);
      store.spendBudget(money);
      store.addEvent(`Budget decreased by ${money}`);
    },
  ];

  const event = events[randomInt(0, events.length - 1)];
  event();
}