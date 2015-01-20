var dotNinjas = (function(dn) {
  "use strict";
  var canvas = document.getElementById("gameCanvas");
  canvas.width = 500;
  canvas.height = 500;
  var ctx = canvas.getContext("2d");
  var gameConfig = {
    entityColor: "white",
    bgColor: "black",
    rows: 10,
    cols: 15,
    dotPadding: 5,
    updateInterval: 500,
    wrapX: true
  }
  gameConfig.rowHeight = Math.round(canvas.height / gameConfig.rows),
  gameConfig.columnWidth = Math.round(canvas.width / gameConfig.cols);
  // A bunch of unit vectors corresponding to the arrow keys.
  var up = {x: 0, y: -1},
      down = {x: 0, y: 1},
      left = {x: -1, y: 0},
      right = {x: 1, y: 0};
  var keys = {
    38: up,
    40: down,
    37: left,
    39: right
  }
  // A more mainstream version of a % b, where if a is negative, then mod(a, b)
  // is still within [0, b), but unlike in Math.mod is the the additive inverse
  // of -a.
  function mod(a, b) {
    return b * (a / b - Math.floor(a / b));
  }
  // Given two objects with attributes x and y, determines whether the x's and
  // y's are within 0.0001 between each object.
  // TODO: Maybe have a vector2d prototype?
  function vectorEquals(u, v) {
    var xDifference = u.x - v.x, yDifference = u.y - v.y;
    return Math.abs(xDifference) < 0.0001 && Math.abs(yDifference) < 0.0001;
  }
  // Returns a random integer between min (included) and max (excluded)
  // Using Math.round() will give you a non-uniform distribution!
  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function drawDot(coords, color) {
    ctx.fillStyle = color;
    var rectX = coords.x * gameConfig.columnWidth + gameConfig.dotPadding;
    var rectY = coords.y * gameConfig.rowHeight + gameConfig.dotPadding;
    var rectWidth = gameConfig.columnWidth - 2 * gameConfig.dotPadding;
    var rectHeight = gameConfig.rowHeight - 2 * gameConfig.dotPadding;
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  }

  // Constructs a rectangular entity to be drawn on the grid configured in
  // gameConfig.
  function RectangularEntity(xPos, yPos, color) {
    this.color = color || gameConfig.entityColor;
    this.moveTo({
      x: xPos || 0,
      y: yPos || 0
    });
  }
  // Moves this entity to newPosition, where newPosition is of the form
  // {x: <Number>, y: <Number>}
  RectangularEntity.prototype.moveTo = function(newPosition) {
    var xWithinBounds = newPosition.x >= 0 && newPosition.x < gameConfig.cols,
        yWithinBounds = newPosition.y >= 0 && newPosition.y < gameConfig.rows;
    if(gameConfig.wrapX || xWithinBounds) {
      if(gameConfig.wrapY || yWithinBounds) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x = mod(newPosition.x, gameConfig.cols);
        this.y = mod(newPosition.y, gameConfig.rows);
      }
    }
  }
  // Moves this entity by delta, where delta is of the form
  // {x: <Number>, y: <Number>}
  RectangularEntity.prototype.moveBy = function(delta) {
    this.moveTo({
      x: this.x + delta.x,
      y: this.y + delta.y
    });
  }
  RectangularEntity.prototype.clearPreviousDraw = function() {
    var prevCoords = {x: this.prevX, y: this.prevY};
    drawDot(prevCoords, gameConfig.bgColor);
  }
  RectangularEntity.prototype.draw = function() {
    drawDot(this, this.color);
  }

  // A RectangularEntity that responds to keypresses.
  function PlayerEntity(xPos, yPos, color) {
    RectangularEntity.call(this, xPos, yPos, color);
    this.currentDirection = right;
    var player = this;
    $(document).keydown(function(event) {
      player.currentDirection = keys[event.which] || player.currentDirection;
    });
  }
  PlayerEntity.prototype = Object.create(RectangularEntity.prototype);
  PlayerEntity.prototype.update = function() {
    this.moveBy(this.currentDirection);
  }

  // A RectangularEntity that follows another entity.
  function EnemyEntity(xPos, yPos, playerToFollow, color) {
    RectangularEntity.call(this, xPos, yPos, color);
    this.attractor = playerToFollow;
  }
  EnemyEntity.prototype = Object.create(RectangularEntity.prototype);
  EnemyEntity.prototype.update = function() {
    var xDistance = this.attractor.x - this.x,
        yDistance = this.attractor.y - this.y;
    if(vectorEquals(this, this.attractor)) {
      // This only happens when the player and enemy are in the same
      // spot, so the loss screen should eventually be triggered here.
      return;
    }
    if(Math.abs(xDistance) > Math.abs(yDistance)) {
      this.moveBy({
        x: xDistance > 0 ? 1 : -1,
        y: 0
      });
    }
    else {
      this.moveBy({
        x: 0,
        y: yDistance > 0 ? 1 : -1
      });
    }
  }

  function CoinEntity(xPos, yPos, player, scoreCallback, color) {
    RectangularEntity.call(this, xPos, yPos, color);
    this.onScore = scoreCallback;
    this.consumer = player;
  }
  CoinEntity.prototype = Object.create(RectangularEntity.prototype);
  CoinEntity.prototype.update = function() {
    if(vectorEquals(this, this.consumer)) {
      this.moveTo({
        x: getRandomInt(0, gameConfig.cols),
        y: getRandomInt(0, gameConfig.rows)
      });
      if(this.onScore instanceof Function) {
        this.onScore();
      }
    }
  }
  // TODO: maybe use requireJS for this?
  dn.RectangularEntity = RectangularEntity;
  dn.PlayerEntity = PlayerEntity;
  dn.EnemyEntity = EnemyEntity;
  dn.CoinEntity = CoinEntity;
  dn.config = gameConfig;
  return dn;
}) (dotNinjas || {});
