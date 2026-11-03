/*
 * Componente Gestionar selección de candidatos.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarSeleccion
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion');
Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarSeleccion = Ext.extend(Ext.Panel, {
    layout: 'fit', 
	id: 'gestseleccion',
	title: 'Gestionar selecci&oacute;n',
	region: 'center',
	height: '100%',
	closable: true,
	//iconCls: 'seleccion',
    initComponent: function() {
        var self = this;	
		var seleccion;
		this.btnAplicarMod = new Ext.Button({
            id: 'btnAplicarMod',
            text: this.idioma.btnFrmAplicar_text,
            tooltip: this.idioma.btnAplicarMod_text,
            iconCls: 'aplicar',
			handler: function ()
            {
                if (self.idexpresionmatematica) {
                    Ext.Ajax.request({
                        url: 'aplicarModeloSeleccion',
                        params: {
                            idproceso: self.idproceso,
                            idexpresionmatematica: self.idexpresionmatematica
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, self.idioma.lbModeloAplicadoSucces);
                            } else  if (responseData.codigo == 2) {
                                mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                            } else {
                                mostrarMensaje(6, self.idioma.lbModeloAplicadoFail);
                            }
                            self.stCandidatosPres.reload();
                            self.gpCandidatosPres.getSelectionModel().clearSelections();
                        }
                    });
                } else {
                    mostrarMensaje(6, 'El modelo de selecci&oacute;n para este proceso no est&aacute; definido.');
                }
			}
		});

        this.btnObservacion = new Ext.Button({
            id: 'btnObservacion',
            disabled: true,
            text: this.idioma.btnObservaciontext,
            tooltip: this.idioma.btnObservaciontooltip,
            iconCls : 'ver',
            handler: function ()
            {
                self.windObservacionCandidatos.show();
                var obser = self.gpCandidatosPres.getSelectionModel().getSelected().data.observacion;
                self.taObservacion.setValue(obser);
            }
        });

        this.btnObservacionSelec = new Ext.Button({
            id: 'btnObservacion',
            disabled: true,
            text: this.idioma.btnObservaciontext,
            tooltip: this.idioma.btnObservaciontooltip,
            iconCls : 'ver',
            handler: function ()
            {
                self.windObservacionCandidatos.show();
                var obser = self.gpCandidatosSelect.getSelectionModel().getSelected().data.observacion;
                self.taObservacion.setValue(obser);
            }
        });
		
		this.stCandidatosPres = new Ext.data.Store({
            url: 'getCandidatosPreseleccionados',
			baseParams: {idproceso:this.idproceso},
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'data', id: 'idcandidato'
            }, [
                {name: 'idcandidato'},
				{name: 'idresultadoseleccion'},
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'observacion'},
                {name: 'foto'},
				{name: 'sexo'},
				{name: 'idresultadotecnica'},
				{name: 'idplanilla'},
				{name: 'idmodelo'},
                {name: 'nombre'}
            ]),
			listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
						if (self.sfBuscarCandPre.getValue() == '') {
							mostrarMensaje(1,this.idioma.lbNoDatos);
						} else {
							mostrarMensaje(1,this.idioma.lbNoDatosBusc);
						}
					}
                }.createDelegate(this)
            }
        });
		this.stCandidatosPres.load({params:{start:0,limit:15}});
		
		this.sfBuscarCandPre = new Ext.app.SearchField({
            store: this.stCandidatosPres,
			toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarCand,
            emptyText: this.idioma.lbSfBuscar
        });
		
		this.smCandidatosPres = new Ext.grid.CheckboxSelectionModel({
			singleSelect: true,
			listeners: {
                selectionchange: function(sm){
                    if (self.estado == 'Actual' && sm.hasSelection()) {
                        self.btnObservacion.enable();
                    } else {
                        self.btnObservacion.disable();
                    }
                }.createDelegate(this)
            }
		});
		
		function preSelectDropTarget(g)
		{
            if (self.estado == 'Actual') {
                var preseleccionados = g.getView().el.dom.childNodes[0].childNodes[1];
                seleccionadasDropTarget = new Ext.dd.DropTarget(preseleccionados, {
                    ddGroup: 'preseleccionados',
                    copy: true,
                    notifyDrop: function (ddSource, e, data)
                    {
                        seleccion = 0;
                        setSeleccionCand(ddSource.dragData.selections);
                        return true;
                    }
                });
            }
		}
		
		//Listado de candidatos.
        this.gpCandidatosPres = new Ext.grid.GridPanel({            
            store: this.stCandidatosPres,	
			title: this.idioma.lbListadoPreselec,
			tbar: [this.btnAplicarMod,  this.btnObservacion, '-', this.sfBuscarCandPre],
			height: 400,
			enableDragDrop: true,
			ddGroup: 'seleccionados',
			width: '50%',
			autoScroll: true,
			border: false,
			region: 'center',
            loadMask: {msg: 'Cargando...'},
			sm: this.smCandidatosPres,
            columns: [this.smCandidatosPres,
                {header: 'No. Identidad', width:80, dataIndex: 'numid'},
                {header: 'Apellidos y nombres', width:250, dataIndex: 'nombre'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stCandidatosPres,
                displayInfo: false
            }),
			listeners: {
				render: preSelectDropTarget
			}
        });			
		
		this.stCandidatosSelect = new Ext.data.Store({
            url: 'getCandidatosSeleccionados',
			baseParams: {idproceso:this.idproceso},
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'data', id: 'idcandidato'
            }, [
                {name: 'idcandidato'},
				{name: 'idresultadoseleccion'},
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'foto'},
				{name: 'sexo'},
                {name: 'observacion'},
				{name: 'idresultadotecnica'},
				{name: 'idplanilla'},
				{name: 'idmodelo'},
                {name: 'nombreapellidos'},
                {name: 'ubicacion'}
            ]),
			listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
						if (self.sfBuscarCandSelect.getValue() == '') {
							mostrarMensaje(1,this.idioma.lbNoDatos);
						} else {
							mostrarMensaje(1,this.idioma.lbNoDatosBusc);
						}
					}
                }.createDelegate(this)
            }
        });
		
		this.stCandidatosSelect.load({params:{start:0,limit:15}});
		
		this.sfBuscarCandSelect = new Ext.app.SearchField({
            store: this.stCandidatosSelect,
			toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarCand,
            emptyText: this.idioma.lbSfBuscar
        });
		
		this.smCandidatosSelect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: true,
			listeners: {
                selectionchange: function(sm){
                    if (self.estado == 'Actual' && sm.hasSelection()) {
                        self.btnDesUbicar.enable();
                        self.btnObservacionSelec.enable();
                    } else {
                        self.btnObservacionSelec.disable();
                        self.btnDesUbicar.disable();
                    }
                }.createDelegate(this)
            }
		});

        this.btnDesUbicar = new Ext.Button({
            id: 'btnDesUbicar',
            disabled: true,
            text: this.idioma.btnDesubicar_text,
            tooltip: this.idioma.btnDesubicar_tooltips,
            iconCls: 'deshacer',
            handler: function ()
            {
                var idresultselec = self.gpCandidatosSelect.getSelectionModel().getSelected().data.idresultadoseleccion;
                if(self.gpCandidatosSelect.getSelectionModel().getSelected().data.ubicacion) {
                    Ext.Ajax.request({
                        url: 'guardarUbicacion',
                        params: {
                            idproceso: self.idproceso,
                            idresultadoseleccion: idresultselec
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, self.idioma.msgDesubicadoSucces);
                                self.stCandidatosSelect.reload();
                            } else if (responseData.codigo == 2) {
                                mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(6, self.idioma.msgNoUbicacion);
                }
            }
        });

		function seleccionadosDropTarget(g)
		{
            if (self.estado == 'Actual') {
                var seleccionadosEl = g.getView().el.dom.childNodes[0].childNodes[1];
                preseleccionadasDropTarget = new Ext.dd.DropTarget(seleccionadosEl, {
                    ddGroup: 'seleccionados',
                    copy: true,
                    notifyDrop: function (ddSource, e, data)
                    {
                        var cantaselecionar = ddSource.dragData.selections.length;
                        var canseleccionados = self.stCandidatosSelect.totalLength;
                        var aux = canseleccionados+cantaselecionar;
                        if (self.cantrecurso!=-1 && self.cantrecurso < aux) {
                            mostrarMensaje(6, 'El candidato no puede ser seleccionado porque excede la cantidad de recursos definidos en el proceso.');
                        } else	{
                            seleccion = 1;
                            setSeleccionCand(ddSource.dragData.selections);
                            return true;
                        }
                    }
                });
            }
		}

        //Ubicación

		var cbTreeEstructura = new Ext.components.TreeComboBox({
            anchor: "98%",
            allowBlank: true,
            emptyText: 'Seleccione...',
            treeConfig: {
                rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: 'getEstructura',
					baseParams: {idproceso: self.idproceso,},
                    preloadChildren: false
                }),
                border: false,
                autoScroll: true,
                root: new Ext.tree.AsyncTreeNode({
                    id: '-1',
                    text: 'Arbol'
                }),
                listeners: {
                    click: function(node, e) {
                        var idresultselec = self.gpCandidatosSelect.getSelectionModel().getSelected().data.idresultadoseleccion;
                        Ext.Ajax.request({
                            url: 'guardarUbicacion',
                            params: {
                                idproceso: self.idproceso,
                                ubicacion: node.id,
                                idresultadoseleccion: idresultselec
                            },
                            success: function (r){
                                var responseData = Ext.decode(r.responseText);
                                if (responseData.codigo == 1) {
                                    mostrarMensaje(1, self.idioma.msgUbicadoSucces);
                                } else if (responseData.codigo == 2) {
                                    mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                                } else if (responseData.codigo == 3) {
									mostrarMensaje(6, 'Este proceso no responde a los cargos definidos en esta ubicaci&oacute;n.');
								} 
                                self.stCandidatosSelect.reload();
                            }
                        });
                    }
                }
            }
        });
		
		//Listado de candidatos.
        this.gpCandidatosSelect = new Ext.grid.EditorGridPanel({
            store: this.stCandidatosSelect,
			title: this.idioma.lbListadoSelec,
			tbar: [' ',this.btnObservacionSelec, this.sfBuscarCandSelect, '->', this.btnDesUbicar],
			height: 400,
            clicksToEdit: 1,
            width: '50%',
			border: false,
			autoScroll: true,
			enableDragDrop: true,
			ddGroup: 'preseleccionados',
			region: 'center',
            loadMask: {msg: 'Cargando...'},
			sm: this.smCandidatosSelect,
            columns: [this.smCandidatosSelect,
                {header: 'No. Identidad', width:80, dataIndex: 'numid'},
                {header: 'Apellidos y nombres', width:250, dataIndex: 'nombreapellidos'},
                {header: 'Preubicaci&oacute;n', width:200, dataIndex: 'ubicacion', editor: cbTreeEstructura}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stCandidatosSelect,
                displayInfo: false
            }),
			listeners: {
				render: seleccionadosDropTarget
			}
        });
		
		function setSeleccionCand(record)
		{
			var arrcand = new Array();
			Ext.each(record, function (rec)
			{
				arrcand.push(rec.get('idresultadoseleccion'));
			});
			
			Ext.Ajax.request({
				url: 'setSelecCand',				
				params: {
                    idproceso: self.idproceso,
					seleccion: seleccion,
					arrcand: Ext.encode(arrcand)
				},
				success: function (r){
					var responseData = Ext.decode(r.responseText);
					if (responseData == true) {
						mostrarMensaje(1, self.idioma.msgSave_success);
					} else  if (responseData == 0) {
                        mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                    }
					self.stCandidatosPres.reload();	
					self.stCandidatosSelect.reload();	
					self.gpCandidatosPres.getSelectionModel().clearSelections();
					self.gpCandidatosSelect.getSelectionModel().clearSelections();
				}
			});
		}
		
		this.pGeneral = new Ext.Panel({
            layout: 'border', 
			border: false,
			region: 'center',
			height: '100%',
			items: [{region: 'west',
					 xtype: 'panel',
					 id: 'west-panel',
					 width: '50%',                
					 border: true,
                     split: true,
					 layout: 'fit',					 
					 items: [this.gpCandidatosPres]
				},{     
					region: 'center',				
					xtype: 'panel',
					id: 'center-panel',
					width: '50%',                
					border: true,
                    split: true,
					layout: 'fit',
					items: [this.gpCandidatosSelect]
				}
			]
        });
        this.items = [this.pGeneral];
        if (self.estado != 'Actual') {
            self.btnAplicarMod.disable();
            self.btnDesUbicar.disable();
            self.btnObservacionSelec.disable();
            self.btnObservacion.disable();
        }
        if (self.otro == 1) {
            self.btnAplicarMod.hide();
            self.btnDesUbicar.hide();
            self.btnObservacionSelec.hide();
            self.btnObservacion.hide();
        }

        this.btnAcept = new Ext.Button({
            iconCls  : 'aceptar',
            text     : this.idioma.btnFrmAceptar_text,
            tooltip  : this.idioma.btnFrmAceptar_tooltips,
            handler: function ()
            {
                var idcandidato, gp;
                if (self.gpCandidatosPres.getSelectionModel().getSelected()) {
                    idcandidato = self.gpCandidatosPres.getSelectionModel().getSelected().data.idcandidato;
                    gp = 1;
                } else {
                    idcandidato = self.gpCandidatosSelect.getSelectionModel().getSelected().data.idcandidato;
                    gp = 2;
                }
                Ext.Ajax.request({
                    url: 'addObservacion',
                    params: {
                        idproceso: self.idproceso,
                        idcandidato: idcandidato,
                        observacion: self.taObservacion.getValue()
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == 1) {
                            mostrarMensaje(1, self.idioma.msgaddObsSucces);
                        } else if (responseData == 2) {
                            mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                        } else {
                            mostrarMensaje(6, self.idioma.msgaddObsFails);
                        }
                        self.windObservacionCandidatos.hide();
                        if (gp == 1)self.stCandidatosPres.reload(); else self.stCandidatosSelect.reload();
                    }
                });
            }
        });

        this.btnCancel = new Ext.Button({
            iconCls  : 'cancelar',
            text     : this.idioma.btnFrmCancelar_text,
            tooltip  : this.idioma.btnFrmCancelar_tooltips,
            handler: function ()
            {
                self.windObservacionCandidatos.hide();
                self.taObservacion.reset();
            }
        });

        this.taObservacion = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observacion',
            anchor: '100%',
            height: 200,
            hiddenname: 'descripcion',
            allowBlank: true
        });

        this.fObservacion = new Ext.form.FormPanel({
            frame: true,
            bodyStyle: 'padding: 3px 3px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [this.taObservacion]
        });

        this.windObservacionCandidatos = new Ext.Window({
            layout: 'fit',
            title:  'Observaci&oacute;n del candidato',
            modal: true,
            constrain:true,
            closeAction: 'hide',
            resizable: false,
            width: 350,
            height: 310,
            maximizable: false,
            items: [this.fObservacion],
            buttons: [this.btnCancel, this.btnAcept],
			keys: [{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancel.disabled) {
                            self.btnCancel.handler();
                        }
                    }
                },
                {
                    key: 13,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAcept.disabled) {
                            self.btnAcept.handler();
                        }
                    }
                }]			
        });
		
		this.keys = [            
            {
                key: 'b',
                alt: true,
                ctrl: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnObservacion.disabled) {
                        self.btnObservacion.handler();
                    } else if (!self.btnObservacionSelec.disabled) {
                        self.btnObservacionSelec.handler();
                    }
                }
            },
			{
				key: 'l',
				alt: true,
				stopEvent: true,
				fn: function () {
					if (self.sfBuscarCandPre.getValue() != '') {
						self.sfBuscarCandPre.onTrigger1Click();
					} else if (self.sfBuscarCandSelect.getValue() != '') {
						self.sfBuscarCandSelect.onTrigger1Click();
					}
				}
			},
			{
				key: 'b',
				alt: true,
				stopEvent: true,
				fn: function () {
					if (self.sfBuscarCandPre.getValue() != '') {
						self.sfBuscarCandPre.onTrigger2Click();
					} else if (self.sfBuscarCandSelect.getValue() != '') {
						self.sfBuscarCandSelect.onTrigger2Click();
					}
				}
			}
        ];
		
        Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarSeleccion.superclass.initComponent.call(this);
    }   
});
