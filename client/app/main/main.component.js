import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  currentGeneration = {
    width: 5,
    height: 5,
    alive: [11, 12, 13]
  };
  run = false;

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
  }

  stop() {
    this.run = false;
  }
  play() {
    this.run = true;
    this.startGenerationLoop();
  }

  startGenerationLoop() {
    if(this.run) {
      this.getNextGeneration()
        .then(() => {
          setTimeout(() => {
            this.startGenerationLoop();
          }, 500);
        });
    }
  }

  getNextGeneration() {
    return this.$http.post('/api/patterns/next-generation', this.currentGeneration)
      .then(response => {
        this.currentGeneration.alive = response.data;
      });
  }

  getHeight() {
    return new Array(this.currentGeneration.height);
  }

  getWidth() {
    return new Array(this.currentGeneration.width);
  }

  isActive(index) {
    // TODO properly inject lodash
    return _.sortedIndexOf(this.currentGeneration.alive, index) > -1;
  }

  getClass(heightIndex, widthIndex) {
    return this.isActive(widthIndex + this.currentGeneration.width * heightIndex) ? 'live' : '';
  }

  // ADD REMOVE HEIGHT/WIDTH BUTTONS
  changeGameBoardWidth(amount) {
    this.currentGeneration.alive = this.currentGeneration.alive.map(value =>
      value + amount * (Math.ceil(value / this.currentGeneration.width) - 1)
    );
    this.currentGeneration.width += amount;
  }
  addWidth() {
    this.changeGameBoardWidth(1);
  }
  removeWidth() {
    this.changeGameBoardWidth(-1);
  }
  addHeight() {
    this.currentGeneration.height++;
  }
  removeHeight() {
    this.currentGeneration.height--;
  }
}

export default angular.module('app.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
