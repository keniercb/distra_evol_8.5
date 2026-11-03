
comun = function(config){
		var grid = config ;
		//typeof config=='object'? grid = config:grid = config.grid;
		return{
			QuitarColGrid:function(columns ){
				//grid = new Ext.grid.GridPanel()
				var cm = grid.colModel;
				//columns =[1,2,3];
				for(var i = 0;i<columns.length;i++){
					if(cm.config){
						var colIndex = columns[i];
						cm.setHidden(colIndex,true);
					}
				}
			}
	}
}
