/**
 * Interfaz para gestionar los permisos a las evaluaciones por personas *
 * 
 * @author Tte. Ing. Javier Rodr�guez L�pez *
 * @package PVD *
 * @subpackage Evaluaciones *
 * @module Seguridad en evaluaciones *
 */ 
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('seguridadporprocesoeval', cargarInterfaz);

function cargarInterfaz(){
perfil = arguments[0];
labels = arguments[1];

var btnAceptarPE = new Ext.Button({
	iconCls:'aceptar',
	disabled: true,
	text:labels.lbBtnAceptar, 
	handler: showWinSeguridadXProcesoEval
});

var gpListProces = new Ext.components.Evaluaciones.gpListProcesEvaluativos({
	region:'center',
	labels: labels,
	pageSize: 8,
	border: false,
	listeners: {
		rowdblclick: function(grid, rowIndex, eventObj) {
			var selectedRecord = gpListProces.getStore().getAt(rowIndex);
			var win = new Ext.components.Evaluaciones.SeguridadEvaluaciones.WinSeguridadXProcesoEval({
				labels: labels,
				procesoEval: selectedRecord
			});
			win.show();
			win.maximize();
		}
	}
});
gpListProces.getStore().on('load', function(st, records, options){
	if(records.length>0){
		gpListProces.getSelectionModel().selectFirstRow();
		btnAceptarPE.enable();
	}else{
		btnAceptarPE.disable();
	}
});

var winListProcesEval = new Ext.Window({
	title:labels.lbTitWinListProces,
	layout:'border',
	closable:false,
	width: 650,
	height: 450,
	items: gpListProces,
	buttons: [btnAceptarPE]
});
winListProcesEval.show();
gpListProces.getStore().load({params:{limit:8, start:0}});

function showWinSeguridadXProcesoEval(){
	var selectedRecord = gpListProces.getSelectionModel().getSelected();
	var win = new Ext.components.Evaluaciones.SeguridadEvaluaciones.WinSeguridadXProcesoEval({
		labels: labels,
		procesoEval: selectedRecord
	});
	win.show();
	win.maximize();
}


};//Fin de CargarInterfaz
