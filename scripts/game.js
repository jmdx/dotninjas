(function() {
  "use strict";
  var currentScore = 0,
      scoreDiv = $("#scoreArea");
  function incrementScore() {
    scoreDiv.text(++currentScore);
  }
  var player = new dotNinjas.PlayerEntity(dotNinjas.config.cols - 1,
                                          dotNinjas.config.rows - 1,
                                          "green"),
      enemy = new dotNinjas.EnemyEntity(0, 0, player),
      coin = new dotNinjas.CoinEntity(5, 0, player, incrementScore, "yellow"),
      updateableEntities = [player, enemy, coin];
  setInterval(function() {
    _(updateableEntities).forEach(function(entity) {
      entity.update();
    });
    _(updateableEntities).forEach(function(entity) {
      entity.clearPreviousDraw();
    });
    _(updateableEntities).forEach(function(entity) {
      entity.draw();
    });
  }, dotNinjas.config.updateInterval);
}) ();
