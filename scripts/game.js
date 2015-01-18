(function() {
  "use strict";
  var player = new dotNinjas.PlayerEntity(dotNinjas.config.cols - 1,
                                          dotNinjas.config.rows - 1,
                                          "green"),
      enemy = new dotNinjas.EnemyEntity(0, 0, player),
      updateableEntities = [player, enemy];
  setInterval(function() {
    _(updateableEntities).forEach(function(entity) {
      entity.update();
    });
  }, dotNinjas.config.updateInterval);
}) ();
