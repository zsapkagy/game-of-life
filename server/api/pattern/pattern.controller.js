'use strict';

import _ from 'lodash';

/**
 * A neighbour is alive if it is in the alive array
 */
function isNeighbourAlive(alive, neighbourIndex, w, h) {
  if(
    // Index is out of the possible alive neighbours
    neighbourIndex < 0 || neighbourIndex > w * h - 1
  ) {
    // The neighbour is not alive
    return 0;
  } else if(_.sortedIndexOf(alive, neighbourIndex) > -1) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * The neighbours of the 4
 * 0- 1 -2
 * 3-(4)-5
 * 6- 7 -8
 */
function getAliveNeighboursCount(alive, index, w, h) {
  return isNeighbourAlive(alive, index - w - 1, w, h)
    + isNeighbourAlive(alive, index - w, w, h)
    + isNeighbourAlive(alive, index - w + 1, w, h)
    + isNeighbourAlive(alive, index + 1, w, h)
    + isNeighbourAlive(alive, index + w + 1, w, h)
    + isNeighbourAlive(alive, index + w, w, h)
    + isNeighbourAlive(alive, index + w - 1, w, h)
    + isNeighbourAlive(alive, index - 1, w, h);
}

/**
 * Game of life rules
 */
function isAlive(liveCell, aliveNeighboursCount) {
  if(liveCell && aliveNeighboursCount < 2) {
    return false;
  } else if(liveCell && aliveNeighboursCount < 4) {
    return true;
  } else if(!liveCell && aliveNeighboursCount === 3) {
    return true;
  } else {
    return false;
  }
}

/**
 * Calculates the next generation
 *
 * @param {Object} req
 * @param req.body.width the width of the game board
 * @param req.body.height the height of the game board
 * @param req.body.alive the index of the alive cells
 * @param {Object} res
 * @returns {Array} the alive indexes in the nex generation
 */
export function nextGeneration(req, res) {
  let aliveInNextGeneration = [];
  if(req.body.alive && req.body.width && req.body.height) {
    const firstPossibleAliveIndex = req.body.alive[0] - req.body.width - 1;
    const lastPossibleAliveIndex = req.body.alive[req.body.alive.length - 1] + req.body.width + 1;
    for(let i = firstPossibleAliveIndex; i <= lastPossibleAliveIndex; i++) {
      // TODO slice the alive array to remove the indexes that is not relevant for the current i
      if(isAlive(
          _.sortedIndexOf(req.body.alive, i) > -1,
          getAliveNeighboursCount(req.body.alive, i, req.body.width, req.body.height)
      )) {
        aliveInNextGeneration.push(i);
      }
    }
  }
  return res.status(200).json(aliveInNextGeneration);
}
