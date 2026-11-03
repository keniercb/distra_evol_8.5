var perfil = window.parent.UCID.portal.perfil
Ext.QuickTips.init();
perfil.etiquetas = {};
var treesel;
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas

// function CargarInterfaz
function cargarInterfaz(){
/***	Panel para inicio de la gestión ***/
pB = new Ext.Panel({
	id:'pb',
	title:'Detalles de bienvenida'
});
/***	Panel para detalles del plan	***/
pP = new Ext.Panel({
	id:'pp',
	title:'Detalles del plan'
});
/***	Panel con layout card	***/
pC = new Ext.Panel({
	id:'pc',
	region:'center',
	layout:'card',
	border:false,
	activeItem:0,
	items:[pB,pP,pM]
});
/***	Panel con layout card	***/
pT = new Ext.Panel({
	title:' Planes ',
	id:'pt',
	region:'west',
	collapsible:true,
	split:true,
	width:150,
	layout:'fit',
	items:trCasoUso
});
// viewport de la plantilla
	vpCasoUso = new Ext.Viewport({
		layout:'fit',
		items:{
			xtype:'panel',
			layout:'border',
			title:'Gestión de planes',
			//frame:true,
			items:[pC,pT]
		}
	});
}// Endof cargarInterfaz
cargarInterfaz();
// function adicionarTipoIndPlan












