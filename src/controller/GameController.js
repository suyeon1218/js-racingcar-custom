import Car from '../model/Car.js';
import { dice } from '../utils/gameSupport.js';
import CarView from '../view/CarView.js';

export default class GameController {
  #cars;
  #carView;

  constructor(round) {
    GameController.validateRound(round);

    this.round = round;
    this.#cars = [];
    this.#carView = new CarView();
  }

  async startGame() {
    const carNames = await this.#carView.inputCarName();
    this.#cars = carNames.split(',').map((name) => new Car(name));

    for (let currRound = 0; currRound < this.round; currRound++) {
      this.#proceedRound();
      const carInfo = this.#cars.map((car) => ({
        name: car.name,
        position: car.position,
      }));
      this.#carView.printMovedCar(carInfo);
    }

    const winners = this.#getWinnersName();
    this.#carView.printWinners(winners);

    return winners;
  }

  #proceedRound() {
    this.#cars.filter((car) => {
      return (
        car.move(1, [
          () => {
            const result = dice(10, 0);
            return result > 4 ? true : false;
          },
        ]) === true
      );
    });
  }

  #getWinnersName() {
    const maxPosition = Math.max(...this.#cars.map((car) => car.position));

    return this.#cars
      .filter((car) => car.position === maxPosition)
      .map((car) => car.name);
  }

  static validateRound(round) {
    if (typeof round !== 'number') {
      throw new Error('라운드 횟수는 숫자 타입이어야 합니다.');
    }

    if (round < 1 && 10 < round) {
      throw new Error('라운드 횟수는 1 ~ 10 사이의 숫자여야 합니다.');
    }
  }
}