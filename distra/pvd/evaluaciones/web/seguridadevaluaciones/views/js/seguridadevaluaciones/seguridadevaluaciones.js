/**
 * Interfaz para gestionar los permisos a las evaluaciones*
 * 
 * @author Tte. Ing. Javier Rodr�guez L�pez*
 * @package PVD *
 * @subpackage Evaluaciones *
 * @copyright UCID-ERP Cuba 10 *
 */
 
Ext.QuickTips.init();
var perfil = window.parent.parent.UCID.portal.perfil;
perfil.etiquetas = Object();
var esEntidad = false;

Ext.form.Field.prototype.msgTarget = 'side';
UCID.portal.cargarEtiquetas('seguridadevaluaciones', function(){
	cargarInterfaz();verTipoEstructura(); }
);
//Zona para las variables grobales
var tfFiltroPersona,mskAux,tfFiltro,cbFormaEval,stFormaEval,gpEvaluadores,stEvaluadores,gpEvaluados,stEvaluados,cbTipoPermiso,stTipoPermiso;
var btnBuscarFiltro,btnAplicarAddEvaldor,btnBuscarPersEvaldores,btnSelProcesoEval,btnAyuda,btnAddEvaldos,btnAddEvaldores,btnElimEvaldos,btnElimEvaldores,btnAceptarSelPE,btnCancelarSelPE,btnGuardarPermisos,btnCancelarAddPersona,btnAceptarAddPersona,btnAplicarPermisoEnt,btnQuitarPermisoEnt;
var winAddEvaldos,tpFormaEval,pProcesoEval,winSelProcesoEval,gpSelProcesoEval,stSelProcesoEval,winAddPersona,stPersonas,gpPersonas,cargadorEstructura,tpEstructura,stAddPersona,gpAddPersona,gpAddEvaldos,stAddEvaldos;
var idPrepProcesoEvaluativo = -1; //Variable para llevar el control del proceso evaluativo con el que se esta trabajando.
var idPersonaSegAccesoEnt = -1;
var idEstructuraSegAccesoEnt = -1;
var tipoPersona = true; //true para cuando se valla a adicionar un evaluador, el caso contrario es para un evaluado.

Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config); if(!this.id){ this.id = Ext.id(); }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype = {
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent(); var index = this.grid.getView().findRowIndex(t); var record = this.grid.store.getAt(index);  record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },
    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};

function cargarInterfaz(){
	mskAux = new Ext.LoadMask(Ext.getBody(), {msg:perfil.etiquetas.lbMsgWaitSend});
	btnSelProcesoEval = new Ext.Button({disabled:true,id:'btnSelProcesoEval', text:perfil.etiquetas.lbBtnSelProcesoEval, tooltip:perfil.etiquetas.ttBtnSelProcesoEval, handler: function(){gpEvaluados.setDisabled(false); winSelProcesoEval.show(); stSelProcesoEval.load({params:{start:0,limit:15}}); }});
	var btnAyudaTP = new Ext.Button({
	    id: 'ayudaTP',
	    text:'Ayuda',
		tooltip:'Ayuda',
	    iconCls:'ayuda',
	    handler : function(){
		//Para ejecutar ayuda
				var urlayuda = "../../../../template/evaluaciones/evaluacion/seguridad_evaluaciones.html";	
				window.open(urlayuda,"Ayuda","width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
			}
    });
    //btnAyuda = new Ext.Button({id:'btnAyuda', icon:perfil.dirImg+'ayuda.png', iconCls:'btn', text:perfil.etiquetas.lbtnAyuda, /*handler:function(){winForm('Ins');} */ });
	btnBuscarPersEvaldores = new Ext.Button({id:'btnBuscarPersEvaldores', text:perfil.etiquetas.lbBtnBuscar, iconCls:'buscar', tooltip:perfil.etiquetas.ttpBuscarPersEvaldores, handler: function(){ stAddPersona.load({params:{start:0,limit:15, filtro: tfFiltro.getValue()}}); } });
	btnElimEvaldos = new Ext.Button({disabled:true,id:'btnElimEvaldos', iconCls:'eliminar', text:perfil.etiquetas.lbBtnEliminar, tooltip:perfil.etiquetas.ttpElimEvaldos, handler: elimEvaldoProcEval });
	btnElimEvaldores = new Ext.Button({disabled:true,id:'btnElimEvaldores', iconCls:'eliminar', text:perfil.etiquetas.lbBtnEliminar, tooltip:perfil.etiquetas.ttpElimEvaldores, handler: elimEvaldorProcEval });
	btnAddEvaldos = new Ext.Button({id:'btnAddEvaldos', iconCls:'adicionar', text:perfil.etiquetas.lbBtnAdicionar, tooltip:perfil.etiquetas.ttpAddEvaldos, handler: function(){ tipoPersona=false; showWinPersonEval(); } });
	btnAddEvaldores = new Ext.Button({id:'btnAddEvaldores', iconCls:'adicionar', text:perfil.etiquetas.lbBtnAdicionar, tooltip:perfil.etiquetas.ttpAddEvaldores, handler: function(){ tipoPersona=true; showWinPersonEval(); } });
	btnCancelarSelPE = new SeguridadEvaluaciones.showBtnCancel({id:'btnCancelarSelPE', handler: function(){winSelProcesoEval.hide();}});
	btnAceptarSelPE = new Ext.Button({id:'btnAceptarSelPE',iconCls:'aceptar',text:perfil.etiquetas.lbBtnAceptar, handler: cargarEvaldres });
	btnGuardarPermisos = new Ext.Button({disabled:true,id:'btnGuardarPermisos', iconCls:'guardar', text:perfil.etiquetas.lbBtnGuardar, tooltip:perfil.etiquetas.ttpGuardarPermisos, handler: guardarPermisosEvaldosPE });
	btnCancelarAddPersona = new SeguridadEvaluaciones.showBtnCancel({id:'btnCancelarAddPersona',handler: function(){winAddPersona.hide();gpEvaluados.setDisabled(true);}});
	btnAplicarAddEvaldor = new Ext.Button({text:perfil.etiquetas.lbBtnAplicar, iconCls:'aplicar', handler: function(){ addPersonaProcEval('aplic'); } });
	btnAceptarAddPersona = new Ext.Button({id:'btnAceptarAddPersona',iconCls:'aceptar',text:perfil.etiquetas.lbBtnAceptar, handler: function(){ addPersonaProcEval('acep'); } });
	btnAplicarPermisoEnt = new Ext.Button({disabled:true,id:'btnAplicarPermisoEnt',iconCls:'aplicar',text:perfil.etiquetas.lbBtnAplicar, handler: aplicarPermisoPersonaEnt });
	btnQuitarPermisoEnt = new Ext.Button({disabled:true,id:'btnQuitarPermisoEnt', iconCls:'eliminar', text:perfil.etiquetas.lbBtnQuitar, tooltip:perfil.etiquetas.ttpBtnQuitar, handler: quitarPermisoEnt });
	btnBuscarFiltro = new Ext.Button({id:'btnBuscarFiltro', text:perfil.etiquetas.lbBtnBuscar, iconCls:'buscar', tooltip:perfil.etiquetas.ttpBuscarPersEvaldores, handler: function(){ stPersonas.baseParams.filtro = tfFiltroPersona.getValue(); stPersonas.load({params:{limit:15, start:0}}); } });
	
	stFormaEval = new Ext.data.SimpleStore({
        fields: ['idFormaEval', 'formaEval'],
        data : [[1,"Proceso evaluativo"], [2,"Proceso seleccion"], [3,"Fuera de proceso"]]
    });
    cbFormaEval = new Ext.form.ComboBox({
        store: stFormaEval,       
        valueField:'idFormaEval',
        displayField:'formaEval',        
        typeAhead: true,
        editable:false,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText:'Seleccione...',
        selectOnFocus:true,
		listeners: {
        	select: function(cb, record, index){
        		if(record.get('idFormaEval') == '1'){ btnSelProcesoEval.setDisabled(false); } //Habilito la tabla de evaluados en caso de ser un permiso personalizado
        		else{ btnSelProcesoEval.setDisabled(true); idPrepProcesoEvaluativo = -1; }
        	}
        }
    });

	stSelProcesoEval = new Ext.data.GroupingStore({
		url:'getProcesosEvalPreparados',
        reader: new Ext.data.JsonReader({
			totalProperty: "cantidad",
			root: "datos",
			id: "idSelProcesoEval" 
		},[
			{name: 'iddefprocesoevaluativo'},
			{name: 'denom'},
			{name: 'idpreprocesoevaluativo'},
			{name: 'fechainicioevalua'},
			{name: 'fechafinevalua'},
			{name: 'fechainicioproceso'},
			{name: 'fechafinproceso'},
		]),
		sortInfo:{field: 'fechainicioevalua', direction: "ASC"},
		groupField:'denom'
	});
	
	gpSelProcesoEval = new Ext.grid.GridPanel({
        store: stSelProcesoEval,
        columns: [
            {id:'denom',header: "Denominaci&oacute;n", width: 60, sortable: true, dataIndex: 'denom'},
            {header: "Inicio evaluaci&oacute;n", width: 30, sortable: true, dataIndex: 'fechainicioevalua', renderer: Ext.util.Format.dateRenderer('m/d/Y')},
            {header: "Fin evaluaci&oacute;n", width: 30, sortable: true, dataIndex: 'fechafinevalua', renderer: Ext.util.Format.dateRenderer('m/d/Y')},
            {header: "Inicio proceso", width: 30, sortable: true, dataIndex: 'fechainicioproceso'},
            {header: "Fin proceso", width: 30, sortable: true, dataIndex: 'fechafinproceso'}
        ],
        view: new Ext.grid.GroupingView({
            forceFit:true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Procesos" : "Proceso"]})'
        }),
		border:false,
		loadMask:{msg: perfil.etiquetas.lbGridLoadMask},
        width: 700,
        height: 450,
        sm: new Ext.grid.RowSelectionModel({
        	singleSelect:true
        }),
		bbar: new Ext.PagingToolbar({
			pageSize: 15,
			store: stSelProcesoEval,
			displayInfo: true,
			displayMsg: perfil.etiquetas.lbDisplayMsg,
			emptyMsg: perfil.etiquetas.lbEmptyMsg
		})
    });

	winSelProcesoEval= new Ext.Window({
		title: perfil.etiquetas.titWinSelProcEval,
		layout:'fit',
		modal: true,
		closable:true,
		resizable:false,
		closeAction: 'hide',
		autoHeight:true,
		items:[gpSelProcesoEval],
		buttons: [btnCancelarSelPE, btnAceptarSelPE]
	});
	
	tfFiltro = new Ext.form.TextField({
		id: 'idtffiltro',
		name : 'tffiltro',
		emptyText: perfil.etiquetas.lbEmptyTextBuscar,
		width : 135,
		listeners: {
			specialkey: function(field, e){
				if (e.getKey() == e.ENTER) {
					stAddPersona.load({params:{start:0,limit:15, filtro: tfFiltro.getValue()}});
				}
			}
		}
	});
		
	stAddPersona = new Ext.data.GroupingStore({
		url:'getPersonasAddByEntidad',
        reader: new Ext.data.JsonReader({
			totalProperty: "cantidad",
			root: "datos",
			id: "idpersona" 
		},[
			{name: 'idpersona'},
			{name: 'numid'},
			{name: 'nombre'}
		])
	});
	
	gpAddPersona = new Ext.grid.GridPanel({
        store: stAddPersona,
		tbar:['->',tfFiltro,' ',btnBuscarPersEvaldores],
        columns: [
            {header: "CI", width: 75, sortable: true, dataIndex: 'numid'},
            {id:'expandir',header: "Nombre", width: 270, sortable: true, dataIndex: 'nombre'}
        ],
		border:false,
		autoExpandColumn: 'expandir',
		loadMask:{msg: perfil.etiquetas.lbGridLoadMask},
        width: 700,
        height: 450,
        sm: new Ext.grid.RowSelectionModel({
        	singleSelect:true
        }),
		bbar: new Ext.PagingToolbar({
			pageSize: 15,
			store: stAddPersona,
			displayInfo: true,
			displayMsg: perfil.etiquetas.lbDisplayMsg,
			emptyMsg: perfil.etiquetas.lbEmptyMsg
		})
    });
	
	winAddPersona = new Ext.Window({
		title:perfil.etiquetas.titwinAddPersona,
		layout:'fit',
		modal: true,
		closable:true,
		resizable:false,
		closeAction: 'hide',
		autoHeight:true,
		items:[gpAddPersona],
		buttons: [btnCancelarAddPersona, btnAplicarAddEvaldor, btnAceptarAddPersona]
	});
	
	/*
	stAddEvaldos = new Ext.data.GroupingStore({
		url:'getPersonasAddByEntidad',
        reader: new Ext.data.JsonReader({
			totalProperty: "cantidad",
			root: "datos",
			id: "idpersona" 
		},[
			{name: 'idpersona'},
			{name: 'numid'},
			{name: 'nombre'}
		])
	});
	
	gpAddEvaldos = new Ext.grid.GridPanel({
        store: stAddEvaldos,
		tbar:['->',tfFiltro,' ',btnBuscarPersEvaldores],
        columns: [
            {header: "CI", width: 75, sortable: true, dataIndex: 'numid'},
            {id:'expandir',header: "Nombre", width: 270, sortable: true, dataIndex: 'nombre'}
        ],
		border:false,
		autoExpandColumn: 'expandir',
		loadMask:{msg: perfil.etiquetas.lbGridLoadMask},
        width: 700,
        height: 450,
        sm: new Ext.grid.RowSelectionModel({
        	singleSelect:true
        }),
		bbar: new Ext.PagingToolbar({
			pageSize: 15,
			store: stAddEvaldos,
			displayInfo: true,
			displayMsg: perfil.etiquetas.lbDisplayMsg,
			emptyMsg: perfil.etiquetas.lbEmptyMsg
		})
    });
	
	winAddEvaldos = new Ext.Window({
		title:perfil.etiquetas.titWinAddEvaldos,
		layout:'fit',
		modal: true,
		closable:true,
		resizable:false,
		closeAction: 'hide',
		autoHeight:true,
		//items:[gpAddPersona],
		buttons: [btnCancelarAddEvaldos, btnAceptarAddEvaldos]
	});
	*/

	function cargarEvaldres(){
		if(gpSelProcesoEval.getSelectionModel().hasSelection()){
			var record = gpSelProcesoEval.getSelectionModel().getSelected();
			idPrepProcesoEvaluativo = record.get('idpreprocesoevaluativo');
			stEvaluadores.baseParams.idpreprocesoevaluativo = idPrepProcesoEvaluativo;
			stEvaluadores.baseParams.formaevaluacion = cbFormaEval.getValue();
			stEvaluadores.load({params:{start:0, limit:15}});
			winSelProcesoEval.hide();
		}
		else{
			Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar un proceso evaluativo", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
		}
	}
	
	function addPersonaProcEval(accion){
		if(gpAddPersona.getSelectionModel().hasSelection()){
			mskAux.show();
			if(tipoPersona){//Caso en el que sea un evaluador
				Ext.Ajax.request({
					url: 'adicionarEvaldorProcEval',
					method:'POST',
					params: {
						idpersona: gpAddPersona.getSelectionModel().getSelected().get('idpersona'),
						formaevaluacion: cbFormaEval.getValue(),
						idPrepProcesoEvaluativo: idPrepProcesoEvaluativo
					},
					callback: function (options,success,response){
						mskAux.hide();
						if(accion == 'acep'){
							winAddPersona.hide();
							gpEvaluados.setDisabled(true);						
						}
						stEvaluadores.reload({params:{start:0,limit:15,idpreprocesoevaluativo: idPrepProcesoEvaluativo,formaevaluacion: cbFormaEval.getValue()}});
					}
				});
			}
			else{ //Caso en el que sea un evaluado				
				Ext.Ajax.request({
					url: 'adicionarEvaldoProcEval',
					method:'POST',
					params: {
						idpersona: gpAddPersona.getSelectionModel().getSelected().get('idpersona'),
						idevaluador: gpEvaluadores.getSelectionModel().getSelected().get('idpersona'),
						idprocesoevaluadores: gpEvaluadores.getSelectionModel().getSelected().get('idprocesoevaluadores'),
						idevalseguridadevalentidad: gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad'),
						idpreprocesoevaluativo: gpSelProcesoEval.getSelectionModel().getSelected().get('idpreprocesoevaluativo'),
						tipopersona: gpEvaluadores.getSelectionModel().getSelected().get('tipopersona'),
					},
					callback: function (options,success,response){
						if(success){
							stEvaluados.reload({params:{start:0, limit:15, idevalseguridadevalentidad: gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad')}});
						}
						if(accion == 'acep'){
							winAddPersona.hide();						
						}
						mskAux.hide();
					}
				});
			}
		}else{
			Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar una persona", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
		}
	}
	
	function elimEvaldoProcEval(){
		if(gpEvaluados.getSelectionModel().hasSelection()){
			Ext.MessageBox.confirm(perfil.etiquetas.lbTitConfirm, perfil.etiquetas.lbMsgConfirm, function(btn){
				if (btn == 'yes'){
					mskAux.show();
					Ext.Ajax.request({
						url: 'eliminarEvaldoProcEval',
						method:'POST',
						params: {
							idevalaccesoevalentidad: gpEvaluados.getSelectionModel().getSelected().get('idevalaccesoevalentidad'),
							idpersona: gpEvaluados.getSelectionModel().getSelected().get('idpersona'),
							tipopersona: gpEvaluadores.getSelectionModel().getSelected().get('tipopersona'),
							idprocesoevaluadores: gpEvaluadores.getSelectionModel().getSelected().get('idprocesoevaluadores'),
							idpreprocesoevaluativo: gpSelProcesoEval.getSelectionModel().getSelected().get('idpreprocesoevaluativo')
						},
						callback: function (options,success,response){
							btnElimEvaldos.setDisabled(true);
							mskAux.hide();
							stEvaluados.reload({params:{start:0, limit:15, idevalseguridadevalentidad: gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad')}});
						}
					});
					
				}	         
			});
		}
		else{
			Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar una persona", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
		}
	}
	
	function guardarPermisosEvaldosPE(){
		var arrEvaldos  = new Array();
		var arrRecordEvaldos = stEvaluados.getModifiedRecords();
		if(arrRecordEvaldos.length > 0){
			for(var i=0 ; i < arrRecordEvaldos.length; i++){
				var arrAux = new Array();
				arrAux[0] = arrRecordEvaldos[i].get('idevalaccesoevalentidad');
				arrAux[1] = arrRecordEvaldos[i].get('ver');
				arrAux[2] = arrRecordEvaldos[i].get('modificar');
				arrEvaldos[i]= arrAux;
			}		
			mskAux.show();
			Ext.Ajax.request({
				url: 'guardarPermisosEvaldosPE',
				method:'POST',
				params: {
					arrEvaldos: Ext.encode(arrEvaldos)
				},
				callback: function (options,success,response){				
					mskAux.hide();
					stEvaluados.reload({params:{start:0, limit:15, idevalseguridadevalentidad: gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad')}});
				}
			});
		}else{
			Ext.MessageBox.show({title: 'Informaci&oacute;', msg: "No se ha cambiado ning&uacute;n permiso.", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
		}
	}
	
	function elimEvaldorProcEval(){
		if(gpEvaluadores.getSelectionModel().hasSelection()){
			Ext.MessageBox.confirm(perfil.etiquetas.lbTitConfirm, perfil.etiquetas.lbMsgConfirm, function(btn){
				if (btn == 'yes'){
					mskAux.show();
					Ext.Ajax.request({
						url: 'eliminarEvaldorProcEval',
						method:'POST',
						params: {
							idevalseguridadevalentidad: gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad')
						},
						callback: function (options,success,response){
							btnElimEvaldores.setDisabled(true);
							mskAux.hide();
							stEvaluadores.reload({params:{start:0,limit:15,idpreprocesoevaluativo: idPrepProcesoEvaluativo,formaevaluacion: cbFormaEval.getValue()}});
							gpEvaluados.setDisabled(true);
							stEvaluados.removeAll();
						}
					});
				}	         
			});
		}else{
			Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar una persona", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
		}
	}
	
	function aplicarPermisoPersonaEnt(){		
		if(gpPersonas.getSelectionModel().hasSelection() && tpEstructura.getSelectionModel().getSelectedNode() != null){
			var idpersona = gpPersonas.getSelectionModel().getSelected().get('idpersona');
			var idestructura = tpEstructura.getSelectionModel().getSelectedNode().id;
			mskAux.show();
			Ext.Ajax.request({
				url: 'aplicarPermisoPersonaEnt',
				method:'POST',
				params: {
					idpersona: idpersona,
					idestructura: idestructura
				},
				callback: function (options,success,response){
					mskAux.hide();
					gpPersonas.getStore().reload({params:{start:0,limit:15}});
				}
			});
		}
		else{
			Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar una persona y una estructura", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
		}
	}
	
	function quitarPermisoEnt(){
		mskAux.show();
		Ext.Ajax.request({
			url: 'quitarPermisoAccesoEnt',
			method:'POST',
			params: {
				idevalseguridadaccesoentidades: gpPersonas.getSelectionModel().getSelected().get('idevalseguridadaccesoentidades')
			},
			callback: function (options,success,response){				
				btnQuitarPermisoEnt.setDisabled(true);
				mskAux.hide();
				gpPersonas.getStore().reload({params:{start:0,limit:15}});
			}
		});
	}
	
	function showWinPersonEval(){ 
		if(idPrepProcesoEvaluativo != -1){ 
			if(!tipoPersona){
				if(gpEvaluadores.getSelectionModel().hasSelection()){
					gpEvaluados.setDisabled(false);
					winAddPersona.show(); stAddPersona.load({params:{start:0,limit:15}});
				}else{
					Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar un evaluador", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
				}
			}else{
				gpEvaluados.setDisabled(false);
				winAddPersona.show(); stAddPersona.load({params:{start:0,limit:15}});
			}
		}else{
			Ext.MessageBox.show({title: 'Alerta', msg: "Debe seleccionar un proceso evaluativo", buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING });
		}
	}
	
	function cambiarPermisoEvaldor(idevalseguridadevalentidad, todo){
		mskAux.show();
		Ext.Ajax.request({
			url: 'cambiarPermisoEvaldor',
			method:'POST',
			params: {
				idevalseguridadevalentidad: idevalseguridadevalentidad,
				todo: todo
			},
			callback: function (options,success,response){
				mskAux.hide();
			}
		});
	}

    var checkVer = new Ext.grid.CheckColumn({
       header: "Ver", dataIndex: 'ver', width: 55,
    });
    
    var checkMod = new Ext.grid.CheckColumn({
		header: "Modificar", dataIndex: 'modificar', width: 55,
    });
    
    stTipoPermiso = new Ext.data.SimpleStore({
        fields: ['idpermiso', 'permiso'],
        data : [['1',"Ver todo"], ['2',"Ver y modificar todo"],['3','Personalizado']]
    });
    cbTipoPermiso = new Ext.form.ComboBox({
        store: stTipoPermiso,       
        valueField:'idpermiso',
        displayField:'permiso',
        typeAhead: true,
        editable:false,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText:'Seleccione...',
        selectOnFocus:true,
        listeners: {
        	select: function(cb, record, index){
        		if(record.get('idpermiso') == '3'){ gpEvaluados.setDisabled(false); } //Habilito la tabla de evaluados en caso de ser un permiso personalizado
        		else{ gpEvaluados.setDisabled(true); }
				var idevalseguridadevalentidad = gpEvaluadores.getSelectionModel().getSelected().get('idevalseguridadevalentidad');
				cambiarPermisoEvaldor(idevalseguridadevalentidad, record.get('idpermiso'));
        	}
        }
    });

	stEvaluados = new Ext.data.Store({
		url:'getEvaldosPe',
		pruneModifiedRecords: true,
        reader: new Ext.data.JsonReader({
			totalProperty: "cantidad",
			root: "datos",
			id: "idEvaldos" 
		},[
			{name: 'idevalaccesoevalentidad'},
			{name: 'idpersona'},
			{name: 'nombre'},
			{name: 'numid'}, 
			{name: 'ver'}, 
			{name: 'modificar'}
		])
	});
	
    gpEvaluados = new Ext.grid.EditorGridPanel({
        id:'gpEvaluados',
        title: perfil.etiquetas.lbTitEvaluados,
        columns: [
			{header: "CI", sortable: true, width: 85, dataIndex: 'numid'},
			{id:'expandir', header: "Nombre", sortable: true, width: 75, dataIndex: 'nombre'}
			, checkVer, checkMod],		
		tbar:[btnAddEvaldos,'-',btnElimEvaldos,'-',btnGuardarPermisos],
        plugins:[checkVer, checkMod],
        clicksToEdit:1,
        store: stEvaluados,
        autoExpandColumn:'expandir',
        loadMask:{msg :perfil.etiquetas.lbGridLoadMask},
        region:'center',
        margins: '5 5 5 5',
        width: '50%',
		height: 350,
		bbar: new Ext.PagingToolbar({
			pageSize: 15,
			store: stEvaluados,
			displayInfo: true,
			displayMsg: perfil.etiquetas.lbDisplayMsg,
			emptyMsg: perfil.etiquetas.lbEmptyMsg
		}),
		sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
		listeners: {
			rowclick: function(grid, rowIndex, event){
				btnElimEvaldos.setDisabled(false);
				btnGuardarPermisos.setDisabled(false);
			}
		}
	});
		
	stEvaluadores = new Ext.data.Store({
		url:'getEvaldoresPe',
        reader: new Ext.data.JsonReader({
			totalProperty: "cantidad",
			root: "datos",
			id: "idEvaldores" 
		},[
			{name:'idevalseguridadevalentidad'},
			{name: 'idpersona'},
			{name: 'nombre'},
			{name: 'numid'},
			{name: 'todo'}, //equivale a permisos
			{name: 'tipopersona'},
			{name: 'idprocesoevaluadores'}
		])
	});
	
	gpEvaluadores = new Ext.grid.EditorGridPanel({
        id:'gpEvaluadores',
        clicksToEdit:1,
		tbar:[btnAddEvaldores,'-',btnElimEvaldores],
        title: perfil.etiquetas.lbTitEvaluadores,
        columns: [
			{header: "CI", sortable: true, width: 85, dataIndex: 'numid', renderer:colorTipoPersona},
			{id:'expandir', header: "Nombre", sortable: true, width: 75, dataIndex: 'nombre', renderer:colorTipoPersona},
			{header: "Permiso", sortable: false, width: 130, renderer: permisoToString, dataIndex: 'todo', editor:cbTipoPermiso}
		],
        store: stEvaluadores,
        autoExpandColumn:'expandir',
        loadMask:{msg: perfil.etiquetas.lbGridLoadMask},
        region:'west',
        margins: '5 0 5 5',
        width: '50%',
		height: 350,
		sm: new Ext.grid.RowSelectionModel({ singleSelect:true }),
        bbar: new Ext.PagingToolbar({
			pageSize: 15,
			store: stEvaluadores,
			displayInfo: true,
			displayMsg: perfil.etiquetas.lbDisplayMsg,
			emptyMsg: perfil.etiquetas.lbEmptyMsg
		}),
		listeners: {
			cellclick : function(grid, rowIndex, colIndex, event){				
				if(stEvaluadores.getAt(rowIndex).get('todo') == '3'){ gpEvaluados.setDisabled(false); } //Habilito la tabla de evaluados en caso de ser un permiso personalizado
        		else{ gpEvaluados.setDisabled(true); }
				if(colIndex == 0 || colIndex == 1){ //Controlo cuando haga click en la columna nombre para cargar su evaluados.
					stEvaluados.load({
						params:{ start:0, limit:15, idevalseguridadevalentidad: stEvaluadores.getAt(rowIndex).get('idevalseguridadevalentidad')}
					});
				}
				btnElimEvaldores.setDisabled(false);
			}
		}
	});
	
	stPersonas = new Ext.data.Store({
		url:'getPersonas',
        reader: new Ext.data.JsonReader({
			totalProperty: "cantidad",
			root: "datos",
			id: "idPersonas" 
		},[
			{name: 'idpersona'},
			{name: 'numid'},
			{name: 'nombre'},
			{name: 'idestructura'},			
			{name: 'estructura'},
			{name: 'idevalseguridadaccesoentidades'},
		])			
	});
	(!esEntidad) ? stPersonas.load({params:{limit:15, start:0}}) : false;

	tfFiltroPersona = new Ext.form.TextField({
		id: 'idtfFiltroPersona',
		emptyText: perfil.etiquetas.lbEmptyTextBuscar,
		width: 150,
		listeners: {
			specialkey: function(field, e){
				if (e.getKey() == e.ENTER) {
					stPersonas.baseParams.filtro = field.getValue();
					stPersonas.load({params:{limit:15, start:0}});
				}
			}
		}
	});
	
	gpPersonas = new Ext.grid.GridPanel({
		tbar:[tfFiltroPersona,btnBuscarFiltro,'->',btnQuitarPermisoEnt,'-',btnAplicarPermisoEnt,'-'],
        id:'idgpPersonas',
        title: perfil.etiquetas.lbTitPersonas,
        columns: [{header: "CI", sortable: true, width: 105, dataIndex: 'numid'},
			{id:'expandir', header: "Nombre", sortable: true, width: 105, dataIndex: 'nombre'},
			{header: "Estructura", sortable: true, width: 165, dataIndex: 'estructura'}
		],
        stripeRows: true,
        store: stPersonas,
        autoExpandColumn:'expandir',
        loadMask:{msg :perfil.etiquetas.lbGridLoadMask},
        region:'west',
        margins: '5 0 5 5',
        width: '50%',
		height: 350,
		sm: new Ext.grid.RowSelectionModel({
			singleSelect:true,
			listeners:{
				rowselect: function(sm, rowIndex, record){
					tpEstructura.getSelectionModel().clearSelections();
					btnAplicarPermisoEnt.setDisabled(false);
					(record.get('idevalseguridadaccesoentidades') != '') ? btnQuitarPermisoEnt.setDisabled(false) : btnQuitarPermisoEnt.setDisabled(true);
				}
			}
		}),
        bbar: new Ext.PagingToolbar({
			pageSize: 15,
			store: stPersonas,
			displayInfo: true,
			displayMsg: perfil.etiquetas.lbDisplayMsg,
			emptyMsg: perfil.etiquetas.lbEmptyMsg
		})
	});
	
	cargadorEstructura = new Ext.tree.TreeLoader({
		dataUrl: 'getEstructura',
		preloadChildren: false,
		listeners:{
			beforeload:function(cargadorIndicadores, node, response ){
				if(node.id == '0'){				  
					cargadorEstructura.baseParams.idnodo = -1;
				}else{
					cargadorEstructura.baseParams.idnodo = node.id;
				}
			},		
			load:function(cargadorEstructura, node, response ){node.expand(false,true);}
		}
	});
	tpEstructura = new Ext.tree.TreePanel({
		id: 'idtpEstructura',
		title: perfil.etiquetas.lbTitEstructura,		
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
		loader : cargadorEstructura
	});	
	
	pProcesoEval = new Ext.Panel({
		id:'idpProcesoEval',
		title:'Proceso evaluativo', 
		layout:'border',
		items:[gpEvaluadores,gpEvaluados]
	});
	pPermisoPorEnt = new Ext.Panel({
		id:'idpPermisoPorEnt',
		title:'Permiso por entidades', 
		layout:'border',
		disabled: true,//(esEntidad) ? true : false,
		items:[gpPersonas,tpEstructura]
	});
	
	tpFormaEval = new Ext.TabPanel({
		region:'center',
		margins:'5 5 5 5',
		activeTab: 0,
		deferredRender: false,
		items:[pProcesoEval,pPermisoPorEnt]
	});
	var pCentral = new Ext.Panel({
		region: 'center',
		border:false,
		layout:'border',
		tbar: ['-','Forma de evaluaci&oacute;n: ',cbFormaEval,'-',btnSelProcesoEval,'-','->',btnAyudaTP,'-'],
		items:[tpFormaEval]
	});	
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: pCentral
	});
	
	
};//Fin de CargarInterfaz

//Funciones auxiliares
function permisoToString(val){
	if(val == '1'){
		return "Ver todo";
	}
	else if(val == '2'){
		return "Ver y modificar todo";
	}
	else if(val == '3'){
		return "Personalizado";
	}
	else{
		return "";
	}
}

function verTipoEstructura(){
	Ext.Ajax.request({
		url: 'verTipoEstructura',
		method:'POST',
		callback: function (options,success,response){
			var datos = Ext.util.JSON.decode(response.responseText);
			if(datos.idTipo == 3){
				esEntidad = true;
			}else{
				esEntidad = false;
				Ext.getCmp('idpPermisoPorEnt').setDisabled(false);
			}
		}
	});		
}

function colorTipoPersona(val, metaData, record, rowIndex, colIndex, store){
	if(record.get('tipopersona') == 1){
		return '<span style="color:green;">' + val + '</span>';
	}else if(record.get('tipopersona') == 2){
		return '<span style="color:blue;">' + val + '</span>';
	}
	return val;
}
