/**
 * Interfaz para gestionar los permisos a las evaluaciones por entidad *
 * 
 * @author Tte. Ing. Javier Rodr�guez L�pez *
 * @package PVD *
 * @subpackage Evaluaciones *
 * @module Seguridad en evaluaciones *
 */
 
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('seguridadporentidades', cargarInterfaz);


function cargarInterfaz(){
perfil = arguments[0];
labels = arguments[1];

var btnAyudaTP = new Ext.Button({
        id:'btnAyudaTP',
        text:labels.lbBtnAyuda, 
		tooltip:labels.ttpBtnAyuda,
		iconCls:'ayuda',
	    handler : function(){
		    var title	= 'Ayuda del sistema de evaluaciones';
		    var referencia	= 'seguridadevaluaciones/seguridadporentidades';
		    help.show(title,referencia);
	    },
		nextTab:'btnAddPersona',
        prevTab:'btnSave',
	 
});
var btnAddPersona = new Ext.Button({
        id:'btnAddPersona',
        disabled:true,
		iconCls:'adicionar',
		text:labels.lbBtnAdicionar, 
		tooltip:labels.ttpBtnAdicionar,
		handler: showWinAddPersona ,
        prevTab:'btnAyudaTP',
        nextTab:'btnDelPersona',		
		});
		
var btnDelPersona = new Ext.Button({
        id:'btnDelPersona',
        iconCls:'eliminar',disabled:true,
        text:labels.lbBtnEliminar, 
		tooltip:labels.ttpBtnEliminar,
        handler: function(){ mostrarMensaje(2,labels.lbMsgDelPersona,function(btn){
		if(btn == "ok"){
			PVD.mostrarMascara('idmskdelete', labels.lbMsgWait, labels.lbMaskDelPersona);
			Ext.Ajax.request({
				url: 'eliminarpersonaseguridad',
				method:'POST',
				params: {
					idevalseguridadaccesoentidades: gpPersonas.getSelectionModel().getSelected().get('idevalseguridadaccesoentidades')
				},
				callback: function (options,success,response){
					PVD.ocultarMascara('idmskdelete');	
					stPersonas.reload({params:{limit:20, start:0,}});
				}
			});
		}});
	}
});
var btnSave = new Ext.Button({
        id:'btnSave',
        iconCls:'guardar',
		disabled:true, 
		tooltip:labels.ttpBtnGuardar, 
		text:labels.lbBtnGuardar,
	    handler: function(){
		if(tpEstructura.getSelectionModel().getSelectedNode() != null){
			PVD.mostrarMascara('idmsksave', labels.lbMsgWait, labels.lbMaskSavePersona);
			Ext.Ajax.request({
				url: 'aplicarPermisoPersonaEnt',
				method:'POST',
				params: {
					idestructura: tpEstructura.getSelectionModel().getSelectedNode().id,
					idpersona: gpPersonas.getSelectionModel().getSelected().get('idpersona')
				},
				callback: function (options,success,response){
					responseData = Ext.decode(response.responseText);
					PVD.ocultarMascara('idmsksave');	
					stPersonas.reload({params:{limit:20, start:0}});
				}
			});
		}
		else{
			Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar una persona y una estructura.", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING, fn: function(btn, text){
					btnAddPersona.focus();
				}
			});
		}
	}
});

var tlEstructura = new Ext.tree.TreeLoader({
	dataUrl: 'getEstructura',
	preloadChildren: false,
	listeners:{
		beforeload:function(cargadorIndicadores, node, response ){
			if(node.id == '0'){				  
				tlEstructura.baseParams.idnodo = -1;
			}else{
				tlEstructura.baseParams.idnodo = node.id;
			}
		},		
		load:function(tlEstructura, node, response ){node.expand(false,true);}
	}
});
var tpEstructura = new Ext.tree.TreePanel({
	title: labels.lbTitEstructura,		
	root: new Ext.tree.AsyncTreeNode({
		text: 'Dominio de entidades',
		expanded: false,
		id:'0'
	}),
	rootVisible:false,
	region:'center',
	margins: '5 5 5 5',
	autoScroll:true,
	height:350,
	width: '50%',
	layout:'fit',	
	loader : tlEstructura,
	listeners: {
		click: function(node, eventObj) {
			btnAddPersona.enable();
		}
	}
});
var stPersonas = new Ext.data.Store({
	url:'getPersonas',
	reader: new Ext.data.JsonReader({
		totalProperty: "cantidad",
		root: "datos",
		id: "idPersonas" 
	},[
		{name: 'idpersona'},
		{name: 'numid'},
		{name: 'nombre'},
		{name: 'snombre'},
		{name: 'papel'},
		{name: 'sapel'},
		{name: 'idestructura'},			
		{name: 'estructura'},
		{name: 'idevalseguridadaccesoentidades'},
	]),
	listeners: {
		load: function(st, records, options){
			if(records.length > 0){
				gpPersonas.getSelectionModel().selectFirstRow();
				btnDelPersona.enable();
				btnSave.enable();
			}else{
				btnDelPersona.disable();
				btnSave.disable();
			}
			btnAddPersona.focus();
		}
	}
});
var gpPersonas = new Ext.grid.GridPanel({
	title: labels.lbTitPersonas,
	columns: [{header: "CI", sortable: true, width: 95, dataIndex: 'numid'},
		{ header: "Nombre", sortable: true, width: 95, dataIndex: 'nombre'},
		{ header: "Segundo nombre", sortable: true, width: 100, dataIndex: 'snombre', hidden:true},
		{ header: "Primer apellido", sortable: true, width: 100, dataIndex: 'papel'},
		{ header: "Segundo apellido", sortable: true, width: 100, dataIndex: 'sapel'},
		{id:'expandir', header: "Estructura", sortable: true, width: 165, dataIndex: 'estructura'}
	],
	stripeRows: true,
	store: stPersonas,
	autoExpandColumn:'expandir',
	loadMask:{msg:labels.lbGridLoadMask},
	region:'west',
	margins: '5 0 5 5',
	width: '50%',
	height: 350,
	sm: new Ext.grid.RowSelectionModel({
		singleSelect:true,
		listeners:{
			rowselect: function(sm, rowIndex, record){
				btnDelPersona.enable();
				btnSave.enable();
			},
		}
	}),
	bbar: new Ext.PagingToolbar({
		pageSize: 15,
		store: stPersonas,
		displayInfo: true,
		displayMsg: labels.lbDisplayMsg,
		emptyMsg: labels.lbEmptyMsg
	})
});
stPersonas.load({params:{limit:20, start:0}});
var kmIindicadorTexto = [{
		key: 'i', alt:true,
		fn: function(){
			if(!btnAddPersona.disabled){
				btnAddPersona.handler();
			}
		}
	},{
		key: 'g', alt:true,
		fn: function(){
			if(!btnSave.disabled ){
			btnSave.handler();
			}
		}
	},{
		key: 46,
		fn: function(){
			if(!btnDelPersona.disabled ){
				btnDelPersona.handler();
			}
		}
	},{
		key: 'h', alt:true,
		fn: function(){
			btnAyudaTP.handler();
		}
	}
];

var pCentral = new Ext.Panel({
	region: 'center',
	border:false,
	layout:'border',
	tbar: [btnAddPersona,btnDelPersona,btnSave,'->',btnAyudaTP],
	keys:kmIindicadorTexto,
	items:[gpPersonas,tpEstructura]
});	
pCentral.on('active', function(p){
btnAddPersona.focus();
});

var viewport = new Ext.Viewport({
	layout: 'border',
	items: [pCentral]
});

function showWinAddPersona(){
	var winBusPer = new Ext.components.Evaluaciones.WinBuscarPersona({
		singleSelect: true,
	});
    winBusPer.show();
	winBusPer.on('peopleSelected', function(selectedRecords){
		PVD.mostrarMascara('idmskadd', labels.lbMsgWait, labels.lbMaskSavePersona);
		winBusPer.close();
		var arrIdPersonas = new Array();
		for(var i = 0;i < selectedRecords.length; i++){
			arrIdPersonas[i] = selectedRecords[i].get('idpersona');
		}
		Ext.Ajax.request({
			url: 'aplicarPermisoPersonaEnt',
			method:'POST',
			params: {
				idestructura: tpEstructura.getSelectionModel().getSelectedNode().id,
				//arrIdpersonas: Ext.encode(arrIdPersonas)
				idpersona: arrIdPersonas
			},
			callback: function (options,success,response){
				responseData = Ext.decode(response.responseText);
				PVD.ocultarMascara('idmskadd');	
				stPersonas.reload({params:{limit:20, start:0}});
			}
		});
	});
}
	
};//Fin de CargarInterfaz
