var dotNinjas = (function(dn) {
  "use strict";
  var canvas = document.getElementById("gameCanvas");
  canvas.width = 500;
  canvas.height = 500;
  var ctx = canvas.getContext("2d");
  var gameConfig = {
    entityColor: "white",
    bgColor: "black",
    rows: 5,
    cols: 7,
    dotPadding: 5,
    updateInterval: 300,
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
  // A more mainstream inverse of a % b, where if a is negative, then mod(a, b)
  // is still within [0, b), but unlike in Math.mod is the the additive inverse
  // of -a.
  function mod(a, b) {
    return b * (a / b - Math.floor(a / b));
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
  function GameEntity(xPos, yPos, color) {
    this.color = color || gameConfig.entityColor;
    this.moveTo({
      x: xPos || 0,
      y: yPos || 0
    });
  }
  // Moves this entity to newPosition, where newPosition is of the form
  // {x: <Number>, y: <Number>}
  GameEntity.prototype.moveTo = function(newPosition) {
    var xWithinBounds = newPosition.x >= 0 && newPosition.x < gameConfig.cols,
        yWithinBounds = newPosition.y >= 0 && newPosition.y < gameConfig.rows;
    if(gameConfig.wrapX || xWithinBounds) {
      if(gameConfig.wrapY || yWithinBounds) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x = mod(newPosition.x, gameConfig.cols);
        this.y = mod(newPosition.y, gameConfig.rows);
        this.draw();
      }
    }
  }
  // Moves this entity by delta, where delta is of the form
  // {x: <Number>, y: <Number>}
  GameEntity.prototype.moveBy = function(delta) {
    this.moveTo({
      x: this.x + delta.x,
      y: this.y + delta.y
    });
  }
  GameEntity.prototype.draw = function() {
    var prevCoords = {x: this.prevX, y: this.prevY};
    drawDot(prevCoords, gameConfig.bgColor);
    drawDot(this, this.color);
  }

  // A GameEntity that responds to keypresses.
  function PlayerEntity(xPos, yPos, color) {
    GameEntity.call(this, xPos, yPos, color);
    this.currentDirection = right;
    var player = this;
    $(document).keydown(function(event) {
      player.currentDirection = keys[event.which];
    });
    setInterval(function() {
      player.moveBy(player.currentDirection);
    }, gameConfig.updateInterval);
  }
  PlayerEntity.prototype = Object.create(GameEntity.prototype);

  // A GameEntity that follows another entity.  TODO add this logic
  function EnemyEntity(xPos, yPos, color, playerToFollow) {
    GameEntity.call(this, xPos, yPos, color);
  }
  EnemyEntity.prototype = Object.create(GameEntity.prototype);
  // TODO: maybe use requireJS for this?
  dn.GameEntity = GameEntity;
  dn.PlayerEntity = PlayerEntity;
  dn.EnemyEntity = EnemyEntity;
  return dn;
}) (dotNinjas || {});
