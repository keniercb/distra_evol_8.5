Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('compararpersonas', cargarInterfaz);

function cargarInterfaz(){
perfil = arguments[0];
labels = arguments[1];


/*////////////////////INICIO DE LO QUE HIZO JENNIFER DE  FICHA DE PROCESO EVALUATIVO//////////////////////*/

var fichaPE = new Ext.PVD.Evaluaciones.Analisis.FichaProcesoEval({
	title:'Ficha de Procesos Evaluativos',
	region:'center'
	
	
	
});

var vp = new Ext.Viewport({
	layout:'border',
	items:[fichaPE]
});


/*////////////////////FIN  DE LO QUE HIZO  JENNIFER DE  FICHA DE PROCESO EVALUATIVO//////////////////////*/

};//Fin de CargarInterfaz