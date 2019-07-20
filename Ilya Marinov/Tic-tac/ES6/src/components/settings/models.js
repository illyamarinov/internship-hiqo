const Player = function(id, name = '', symbol = '', color = '#000000') {
  this.label = `Player ${id}`;
  this.label_id = `player-info_name_${id}`;
  this.symbol_id = `player-info_symbol_${id}`;
  this.color_id = `player-info_color_${id}`;
  this.name = name;
  this.symbol = symbol;
  this.color = color;
}

export {
	Player
};