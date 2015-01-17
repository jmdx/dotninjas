(function() {
  var canvas = document.getElementById("gameCanvas");
  var ctx = canvas.getContext("2d");
  var rows = 5, columns = 7;
  var dotPadding = 5;
  var rowHeight = Math.round(canvas.height / rows),
      columnWidth = Math.round(canvas.width / columns);
  var enemy = {
    x: 0,
    y: 0
  };
  var player = {
    x: 2,
    y: 2
  };
  var playerPrev = _.clone(player);
  var enemyPrev = _.clone(enemy);
  function drawDot(coords, color) {
    ctx.fillStyle = color;
    var rectX = coords.x * columnWidth + dotPadding;
    var rectY = coords.y * rowHeight + dotPadding;
    var rectWidth = columnWidth - 2 * dotPadding;
    var rectHeight = rowHeight - 2 * dotPadding;
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  }
  function updateCanvas() {
    drawDot(playerPrev, "black");
    drawDot(enemyPrev, "black");
    drawDot(player, "white");
    drawDot(enemy, "white");
    playerPrev = _.clone(player);
    enemyPrev = _.clone(enemy);
  }
  function addPoints(p1, p2) {
    return {
      x: p1.x + p2.x,
      y: p1.y + p2.y
    }
  }
  var up = {x: 0, y: -1},
      down = {x: 0, y: 1},
      left = {x: -1, y: 0},
      right = {x: 1, y: 0};
  keys = {
    38: up,
    40: down,
    37: left,
    39: right
  }
  $(document).keydown(function(event) {
    var direction = keys[event.which];
    var newPos = addPoints(player, direction);
    if(newPos.x >= 0 && newPos.x < columns) {
      if(newPos.y >= 0 && newPos.y < rows) {
        player = newPos;
      }
    }
  });
  setInterval(updateCanvas, 50);
}) ();
