/*
 * Componente Gestionar candidatos.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarCandidato
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion');
Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarCandidato = Ext.extend(Ext.Panel, {
    layout: 'fit',
    border: false,
	id: 'gestcandidatos',
	title: 'Gestionar candidatos',
	region: 'center',
	height: '100%',
	closable: true,
	//iconCls: 'candidatos',
    initComponent: function() {
        var self = this;
		this.btnAddCandidato = new Ext.Button({
            id: 'btnAddCandidato',
            text: this.idioma.btnAdd_text,
            tooltip: this.idioma.btnAddCandida_tooltips,
            iconCls: 'adicionar',
			handler: function ()
            {
                self.windaddCandidato.show();
            }.createDelegate(this)
		});

		this.btnExcluir = new Ext.Button({
            id: 'btnExcluir',
            text: this.idioma.btnExcluir_text,
            tooltip: this.idioma.btnExcluir_tooltips,
            iconCls: 'excluir',
			disabled: true,
			handler: function ()
            {
                self.windExc.show();
                self.taObservacionExc.reset();
                self.cbMotivoExc.reset();
            }.createDelegate(this)
		});
		
		this.btnEliminarCandidato = new Ext.Button({
            id: 'btnEliminarCandidato',
            text: 'Eliminar',
            tooltip: this.idioma.btnDelCandidato_tooltips,
            iconCls: 'eliminar',
            disabled: true,
            handler: function ()
            {
                var selec = self.gpCandidatos.getSelectionModel().getSelections();
                var candidatos = new Array();
                for(i = 0; i < selec.length; i++){
                    candidatos.push(selec[i].data.idcandidato);
                }
                var mensaje = '';
                if (selec.length == 1) {
                    mensaje = self.idioma.msgDelCand_confirmSin;
                } else {
                    mensaje = self.idioma.msgDelCand_confirmPlu;
                }
                mostrarMensaje(2, mensaje, function (btnPress){
                    if (btnPress == 'ok') {
                        Ext.getBody().mask('Eliminando...');
                        Ext.Ajax.request({
                            url     : 'deleteCandidatos',
                            params  : {
                                idproceso: self.idproceso,
                                candidatos: Ext.encode(candidatos)
                            },
                            callback : function() {Ext.getBody().unmask();},
                            success : function (r) {
                                var responseData = Ext.decode(r.responseText);
                                if(responseData == true) {
                                    if (selec.length == 1) {
                                        mensaje = self.idioma.msgDelCand_successSin;
                                    } else {
                                        mensaje = self.idioma.msgDelCand_successPlu;
                                    }
                                    mostrarMensaje(1, mensaje);
                                    self.stCandidatos.reload();
                                    self.gpCandidatos.getSelectionModel().clearSelections();
                                } else if(responseData == false){
                                    if (selec.length == 1) {
                                        mensaje = 'El candidato seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                    } else {
                                        mensaje = 'Alguno de los candidatos seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                    }
                                    mostrarMensaje(6, mensaje);
                                } else {
                                    mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                                }
                            }
                        });
                    }
                });

            }.createDelegate(this)
        });
		
		this.btnListExcluido = new Ext.Button({
            id: 'btnListExcluido',
            text: 'Excluidos',
            tooltip: self.idioma.btnListExcluidos_tooltips,
            iconCls: 'informe',
			handler: function () {
				self.winListarExcluido.show();
				self.stExcluidos.load({params : {start : 0, limit : 15}});
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
                var obser = self.gpCandidatos.getSelectionModel().getSelected().data.observacion;
                self.taObservacion.setValue(obser);
            }
        });

		this.smCandidatos = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false,
            listeners: {
                selectionchange: function (sm) {
                    if (sm.hasSelection() && self.estado == 'Actual') {
                        self.btnExcluir.enable();
						self.btnEliminarCandidato.enable();
                        if (sm.selections.items.length == 1) {self.btnObservacion.enable();} else {self.btnObservacion.disable();}
                    } else {
                        self.btnExcluir.disable();
						self.btnEliminarCandidato.disable();
                        self.btnObservacion.disable();
                    }
                }.createDelegate(this)
            }
		});		
		
		this.stCandidatos = new Ext.data.Store({
            url: 'getCandidatosByProceso',
			baseParams: {idproceso:this.idproceso},
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'datos', id: 'idcandidato'
            }, [
                {name: 'idcandidato'},
                {name: 'idpersona'},
                {name: 'procesoorigen'},
                {name: 'numid'},
                {name: 'foto'},				
                {name: 'nombre'},
                {name: 'observacion'},
				{name: 'seleccion'},
                {name: 'denominacion'},
                {name: 'idviareclutamiento'}
            ]),
			listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
						if (self.sfBuscar.getValue() == '') {
							mostrarMensaje(1,this.idioma.lbNoDatos);
						} else {
							mostrarMensaje(1,this.idioma.lbNoDatosBusc);
						}
					}
                }.createDelegate(this)
            }
        });
		this.stCandidatos.load({params:{start:0,limit:15}});
		
		this.sfBuscar = new Ext.app.SearchField({
            store: this.stCandidatos,
            emptyText: this.idioma.lbSfBuscar,
			toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarCand
        });
		
		function representarImagen(dataindex){ 
			if (dataindex)
				return "<img src=data:image/jpg;base64,"+dataindex+" width='80' height='70' />"; 
			else
				return '<img src="/pvd/persona/views/images/persona/no-photo-male.png" width=80 height=70 />'; 
		}
		
		function colorTexto(val, metaData, record, rowIndex, colIndex, store) {
			if(record.get('seleccion') != null && val != null) {
				if(record.get('seleccion') == "1")
					return '<span style="color:#008000;"><b>' + val + '</b></span>';
				else if(record.get('seleccion') == "0")
					return '<span style="color:#0000FF;"><b>' + val + '</b></span>';
				else
					return val;
			} else {
				return val;
			}
		}

        //Fuente de datos del listado.
        this.stViaRecGrid = new Ext.data.Store({
            url: 'getViasReclutamiento',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idviareclutamiento"},
                [{name:'idviareclutamiento'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        this.stViaRecGrid.load();

        var cbViaReclutamientoGrid = new Ext.form.ComboBox({
            store: this.stViaRecGrid,
            anchor: '40%',
            height: 100,
            id: 'cbViaReclutamientoGrid',
            hiddenName:'idviareclutamiento',
            displayField: 'denominacion',
            valueField: 'idviareclutamiento',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                select: function () {
                    Ext.Ajax.request({
                        url: 'updateViaRecCandidato',
                        params: {
                            idproceso: self.idproceso,
                            idviareclutamiento: cbViaReclutamientoGrid.getValue(),
                            idcandidato: self.gpCandidatos.getSelectionModel().getSelected().data.idcandidato
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == 0) {
                                mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                            }
                            self.stCandidatos.reload();
                        }
                    });
                }.createDelegate(this)
            }
        });
		
		//Leyenda
		var leyendaSel = "<div class='leyendaSel'><div>";
		var leyendaTextSel = "<b class='leyendaTextSel'>" + this.idioma.leyendaTextSel + "</b>";
		var leyendaPreSel = "<div class='leyendaPreSel'><div>";
		var leyendaTextPreSel = "<b class='leyendaTextPreSel'>" + this.idioma.leyendaTextPreSel + "</b>";
		
		//Listado de candidatos.
        this.gpCandidatos = new Ext.grid.EditorGridPanel({
            store: this.stCandidatos,
			tbar: [this.btnAddCandidato, this.btnEliminarCandidato, this.btnExcluir, this.btnListExcluido, this.btnObservacion, '-', this.sfBuscar, '->', '-', this.idioma.leyendaGestCand, leyendaSel, leyendaTextSel, leyendaPreSel, leyendaTextPreSel],
			height: 400,
			region: 'center',
			loadMask:{msg: this.idioma.lbCargando},
			sm: this.smCandidatos,
            columns: [this.smCandidatos,
                {header: 'Foto', width:100, dataIndex: 'foto',renderer: representarImagen},
                {header: 'No. Identidad', width:100, dataIndex: 'numid', renderer:colorTexto},
                {header: 'Apellidos y nombres', width:250, dataIndex: 'nombre', renderer: colorTexto},
                {header: 'Fuente de reclutamiento', width:200, dataIndex: 'denominacion', renderer:colorTexto, editor: cbViaReclutamientoGrid},
                {header: 'Proceso origen', width:250, dataIndex: 'procesoorigen', renderer:colorTexto}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stCandidatos,
                displayInfo: true
            })
        });

        var connObjPerDisponibles = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getPersonasAll',
            method : 'POST'
        });

        this.stPersonasAll = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy(connObjPerDisponibles),
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "quantity"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'}]
            ),
            listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
                        if (self.sfBuscarPerson.getValue() == '') {
                            mostrarMensaje(1,this.idioma.lbNoDatos);
                        } else {
                            mostrarMensaje(1,this.idioma.lbNoDatosBusc);
                        }
                    }
                }.createDelegate(this)
            }
        });

        this.smPersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.sfBuscarPerson = new Ext.app.SearchField({
            store: this.stPersonasAll,
            pageSize: 15,
            disabled: false,
            toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarPer,
            emptyText: 'Criterio a buscar...'
        });

        this.gpPersonas = new Ext.grid.GridPanel({
            title: 'Listado de todas las personas',
            store: this.stPersonasAll,
            tbar: ['Buscar: ', this.sfBuscarPerson],
            height: 340,
            region: 'center',
            loadMask:{msg: this.idioma.lbCargando},
            sm: this.smPersonas,
            columns: [this.smPersonas,
                {header: 'No. Identidad', width:100, dataIndex: 'numid'},
                {header: 'Nombres y apellidos', width:350, dataIndex: 'nombreapellidos'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stPersonasAll,
                displayInfo: true
            })
        });

        this.stPersonasComp = new Ext.data.Store({
            url: 'getCandidatosSeleccionados',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "quantity"},
                [{name:'idpersona'}, {name:'idproceso'}, {name:'numid'}, {name:'nombreapellidos'}]
            ),
            listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
                        if (self.sfBuscarCandCom.getValue() == '') {
                            mostrarMensaje(1,this.idioma.lbNoDatos);
                        } else {
                            mostrarMensaje(1,this.idioma.lbNoDatosBusc);
                        }
                    }
                }.createDelegate(this)
            }
        });

        this.smPersonasComp = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.stProcesosComp = new Ext.data.Store({
            url: 'getProcesosComp',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idproceso"},
                [{name:'idproceso'},{name:'denominacion'},{name:'entidad'}]
            )
        });

        this.stProcesosComp.baseParams.idproceso = this.idproceso;
        this.stProcesosComp.load();

        var resultTpl = new Ext.XTemplate(
            '<tpl for="."><div class="search-item">',
            '<h3>{entidad}</h3>',
            '{denominacion}',
            '</div></tpl>'
        );

        this.cbProcesosComp = new Ext.form.ComboBox({
            store: this.stProcesosComp,
            width: 300,
            height: 100,
            tpl: resultTpl,
            hiddenName:'idproceso',
            displayField: 'denominacion',
            valueField: 'idproceso',
            typeAhead: false,
            pageSize:10,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            loadingText: 'Buscando...',
            selectOnFocus: true,
            itemSelector: 'div.search-item',
            readOnly: false,
            listeners: {
                select: function (obj) {
                    self.stPersonasComp.baseParams.idproceso = obj.getValue();
                    self.stPersonasComp.load();
                    self.sfBuscarCandCom.enable();
                }
            }
        });

        this.sfBuscarCandCom = new Ext.app.SearchField({
            store: this.stPersonasComp,
            disabled: true,
            toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarPer,
            emptyText: this.idioma.lbSfBuscar
        });

        this.gpPersonasComp = new Ext.grid.GridPanel({
            title: 'Listado de personas de otros procesos',
            tbar: ['Proceso de selecci&oacute;n: ', this.cbProcesosComp, ' ',this.sfBuscarCandCom],
            store: this.stPersonasComp,
            height: 340,
            region: 'center',
            loadMask:{msg: this.idioma.lbCargando},
            sm: this.smPersonasComp,
            columns: [this.smPersonasComp,
                {header: 'No. Identidad', width:100, dataIndex: 'numid'},
                {header: 'Nombres y apellidos', width:350, dataIndex: 'nombreapellidos'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stPersonasComp,
                displayInfo: true
            })
        });

        this.tabPanel = new Ext.TabPanel({
            region: 'center',
            margins: '0 5 5 0',
            height: '100%',
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.gpPersonas, this.gpPersonasComp],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });
		
 		this.btnCancelarAddCand = new Ext.Button({
            iconCls: 'cancelar',
            text: this.idioma.btnFrmCancelar_text,
            tooltip: this.idioma.btnFrmCancelar_tooltips,
			handler: function ()
            {
                self.windaddCandidato.hide();
            }.createDelegate(this)	
        });
		
		 this.btnAceptarAddCand = new Ext.Button({
            iconCls: 'aceptar',
            text: this.idioma.btnFrmAceptar_text,
            tooltip: this.idioma.btnFrmAceptar_tooltips,
			handler: function ()
            {
				var selecall = self.gpPersonas.getSelectionModel().getSelections();
                var seleccomp = self.gpPersonasComp.getSelectionModel().getSelections();
                if(selecall.length > 0 || seleccomp.length > 0){
					var candidatos = new Array();
					for(i = 0; i < selecall.length; i++){
						candidatos.push(selecall[i].data);
					}

                    for(i = 0; i < seleccomp.length; i++){
                        candidatos.push(seleccomp[i].data);
                    }
					Ext.Ajax.request({
						url: 'addCandidato',				
						params: {
							idproceso: this.idproceso,
                            idviareclutamiento: self.cbViaReclutamiento.getValue(),
							candidatos: Ext.encode(candidatos)
						},
						success: function (r){
							var responseData = Ext.decode(r.responseText);
							if (responseData == 0) {
								mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
							} else if (responseData == 2) {
                                if (candidatos.length == 1) {
                                    mostrarMensaje(6, self.idioma.msgAddListPersona_ExisteSin);
                                } else {
                                    mostrarMensaje(6, self.idioma.msgAddListPersona_ExistePlu);
                                }
							} else {
                                if (candidatos.length == 1) {
                                    mostrarMensaje(1, self.idioma.msgAddCand_successSin);
                                } else {
                                    mostrarMensaje(1, self.idioma.msgAddCand_successPlu);
                                }
							}
							self.windaddCandidato.hide();
							self.stCandidatos.reload();		
						}
					});
				} else {
					mostrarMensaje(6, self.idioma.msgAddCand_noselec);
				}
            }.createDelegate(this)
        });

        //Fuente de datos del listado.
        this.stViaRec = new Ext.data.Store({
            url: 'getViasReclutamiento',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idviareclutamiento"},
                [{name:'idviareclutamiento'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        this.stViaRec.load();

        this.cbViaReclutamiento = new Ext.form.ComboBox({
            store: this.stViaRec,
            anchor: '40%',
            height: 100,
            hiddenName:'idviareclutamiento',
            fieldLabel: 'Fuente de reclutamiento',
            displayField: 'denominacion',
            valueField: 'idviareclutamiento',
            typeAhead: true,
            allowBlank: true,
            blankText : 'Este campo es obligatorio',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            selectOnFocus: true,
            readOnly: true
        });

        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tabPanel]
                    },{
                        columnWidth: 1.0,
                        bodyStyle:'padding:5px 5px 0',
                        layout: 'form',
                        items: [this.cbViaReclutamiento]
                    }]
            }]
        });

        this.windaddCandidato = new Ext.Window({
            layout: 'fit',
            title:  this.idioma.lbAddCandidato,
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain:true,
            width: 800,
            height: 510,
            maximizable: false,
            buttons: [this.btnCancelarAddCand, this.btnAceptarAddCand],
            items: [this.formularioGestion],
			listeners: {
                show: function ()
                {
                    self.sfBuscarPerson.onTrigger1Click();
                    //self.gpPersonas.getSelectionModel().clearSelections();
                    self.stPersonasAll.removeAll();
                    self.sfBuscarCandCom.reset();
                    self.sfBuscarCandCom.disable();
                    self.cbProcesosComp.reset();
                    //self.gpPersonasComp.getSelectionModel().clearSelections();
                    self.stPersonasComp.removeAll();
                    self.cbViaReclutamiento.reset();
                }.createDelegate(this)
            },
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function ()
                    {
                        self.btnAceptarAddCand.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function ()
                    {
                        if (!self.btnCancelarAddCand.disabled) {
                            self.btnCancelarAddCand.handler();
                        }
                    }
                }
            ]
        });
		
		/* --- VENTANA LISTA DE EXCLUIDOS --- */
		//Store del grid de candidatos excluidos
		this.stExcluidos = new Ext.data.GroupingStore({
            url        : 'getExcluidos',
			baseParams : {idproceso:this.idproceso},
            reader     : new Ext.data.JsonReader({
							totalProperty : 'cantidad',
							root          : 'datos',
							id            : 'idexcluido'
						}, [
                            {name : 'idexcluido'},
							{name : 'idcandidato'},
							{name : 'idpersona'},
							{name : 'numid'},
							{name : 'nombre'},
							{name : 'fhasta'},
							{name : 'exc_user'},
							{name : 'exc_proceso'},
                            {name : 'motivo'}
						]),
			sortInfo   : {
							field: 'fhasta',
							direction: "DESC"
						},
			groupField : 'fhasta',
			listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
						if (self.sfBuscarExcluido.getValue() == '') {
							mostrarMensaje(1,this.idioma.lbNoDatos);
						} else {
							mostrarMensaje(1,this.idioma.lbNoDatosBusc);
						}
					}
                }.createDelegate(this)
            }
        });
		//
		this.smExcluidos = new Ext.grid.CheckboxSelectionModel({
			singleSelect : false,
			listeners    : { selectionchange : function(sm) {
								if(sm.hasSelection()) {
									var selExc = self.gpExcluidos.getSelectionModel().getSelections();
									var activar = true;
									for(i = 0; i < selExc.length; i++) {
										if(selExc[i].data.exc_user != 2)
											activar = false;
									}
									if(activar == true && self.estado == 'Actual')
										self.btnReincorporar.enable();
									else
										self.btnReincorporar.disable();
								} else {
									self.btnReincorporar.disable();
								}
							}.createDelegate(this)
						}});	
		//Cargar Imágenes para columna Excluido por proceso
		function loadImgProcess(val, metaData, record) {
			if(record.get('exc_proceso') == 1) {
                if (record.get('motivo')) {
                    metaData.attr = 'ext:qtip="Motivo: ' + record.get('motivo') + '"';
                } else {
                    metaData.attr = 'ext:qtip="Motivo: No cumple las condiciones requeridas."';
                }
                return '<center><img src="/pvd/seleccion/views/images/true.png"/></center>';
            } else {
                return '<center><img src="/pvd/seleccion/views/images/false.png"/></center>';
            }
		}
		//Cargar Imágenes para columna Excluido por usuario
		function loadImgUser(val, metaData, record) {
            if (record.get('exc_user') == 2) {
                if (record.get('motivo')) {
                    metaData.attr = 'ext:qtip="Motivo: ' + record.get('motivo') + '"';
                } else {
                    metaData.attr = 'ext:qtip="Motivo: No conocido."';
                }
                return '<center><img src="/pvd/seleccion/views/images/true.png"/></center>';
            } else
				return '<center><img src="/pvd/seleccion/views/images/false.png"/></center>';
		}
		//Campo de búsqueda del grid de candidatos excluidos
		this.sfBuscarExcluido = new Ext.app.SearchField({
            store: this.stExcluidos,
			toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarCand,
            emptyText: this.idioma.lbSfBuscar
        });
		//Grid de candidatos excluidos
		this.gpExcluidos = new Ext.grid.GridPanel({            
            store    : this.stExcluidos,
			region   : 'center',
			tbar     : [this.sfBuscarExcluido],
			loadMask : {msg : this.idioma.lbCargando},
			sm       : this.smExcluidos,
			view     : new Ext.grid.GroupingView({
						forceFit       : true,
						startCollapsed : false,
						groupTextTpl   : '{group}'
					}),
            columns  : [
						 this.smExcluidos,
						{hidden : true,                            dataIndex : 'idcandidato'},
						{hidden : true,                            dataIndex : 'fhasta'},
						{header : this.idioma.gpExcluidos_NumID,   width : 100, dataIndex : 'numid'},
						{header : this.idioma.gpExcluidos_nombre,  width : 315, dataIndex : 'nombre'},
						{header : this.idioma.gpExcluidos_excProc, width : 115, dataIndex : 'exc_proceso', renderer : loadImgProcess},
						{header : this.idioma.gpExcluidos_excUser, width : 115, dataIndex : 'exc_user',    renderer : loadImgUser}
					],
            bbar     : new Ext.PagingToolbar({
						pageSize    : 15,
						store       : this.stExcluidos,
						displayInfo : true
					})
		});
		//Botón para reincorporar un candidato excluido por un usuario al proceso
		this.btnReincorporar = new Ext.Button({
            id       : 'btnReincorporar',
            text     : this.idioma.btnReincorporar_text,
            tooltip  : this.idioma.btnReincorporar_tooltips,
			disabled : true,
			iconCls  : 'restaurarpersona',
			handler  : function() {
                self.windReincorporar.show();
                self.cbMotivoRein.reset();
            }
		});
		//Ventana para la gestión de candidatos excluidos
		this.winListarExcluido = new Ext.Window({
            layout      : 'border',
            title       :  this.idioma.winListarExcluido_tittle,
            modal       : true,
            closeAction : 'hide',
            constrain:true,
            resizable   : false,
            width       : 950,
            height      : 500,
            maximizable : true,
            buttons     : [this.btnReincorporar],
			items       : [this.gpExcluidos],
			keys : [  				
				{
					key: 'l',
					alt: true,
					stopEvent: true,
					fn: function () {
						self.sfBuscarExcluido.onTrigger1Click();
					}
				},
				{
					key: 'b',
					alt: true,
					stopEvent: true,
					fn: function () {
						self.sfBuscarExcluido.onTrigger2Click();
					}
				}
			]
        });

        this.items = [this.gpCandidatos];

        this.btnAddCandidato.on('render',function(){
            self.btnAddCandidato.focus();
        });

        if (self.estado != 'Actual') {
            self.btnAddCandidato.disable();
            self.btnExcluir.disable();
			self.btnEliminarCandidato.disable();
            self.btnReincorporar.disable();
        }

        this.btnAcept = new Ext.Button({
            iconCls  : 'aceptar',
            text     : this.idioma.btnFrmAceptar_text,
            tooltip  : this.idioma.btnFrmAceptar_tooltips,
            handler: function ()
            {
                Ext.Ajax.request({
                    url: 'addObservacion',
                    params: {
                        idproceso: self.idproceso,
                        idcandidato: self.gpCandidatos.getSelectionModel().getSelected().data.idcandidato,
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
                        self.stCandidatos.reload();
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
            constrain:true,
            title:  'Observaci&oacute;n del candidato',
            modal: true,
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

        this.stMotivoExclu = new Ext.data.Store({
            url: 'getMotivosExclusion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idmotivoexclusion"},
                [{name:'idmotivoexclusion'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        this.stMotivoExclu.load();

        this.cbMotivoExc = new Ext.form.ComboBox({
            store: this.stMotivoExclu,
            displayField: 'denominacion',
            valueField: 'idmotivoexclusion',
            hiddenName: 'idmotivoexclusion',
            forceSelection: true,
            fieldLabel: 'Motivo de exclusi&oacute;n',
            typeAhead: true,
            allowBlank: false,
            anchor: '99%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            editable: false
        });

        this.taObservacionExc = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observacion',
            anchor: '100%',
            height: 150,
            hiddenname: 'descripcion',
            allowBlank: true
        });

        this.fObservacionExc = new Ext.form.FormPanel({
            frame: true,
            bodyStyle: 'padding: 3px 3px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [this.cbMotivoExc, this.taObservacionExc]
        });

        this.btnAceptExc = new Ext.Button({
            iconCls  : 'aceptar',
            text     : this.idioma.btnFrmAceptar_text,
            tooltip  : this.idioma.btnFrmAceptar_tooltips,
            handler: function ()
            {
                var selec = self.gpCandidatos.getSelectionModel().getSelections();
                if(selec.length > 0){
                    var candidatos = new Array();
                    for(i = 0; i < selec.length; i++){
                        candidatos.push(selec[i].data.idcandidato);
                    }
                    Ext.Ajax.request({
                        url: 'excluirCandidato',
                        params: {
                            idproceso: self.idproceso,
                            idmotivo: self.cbMotivoExc.getValue(),
                            observacion: self.taObservacionExc.getValue(),
                            candidatos: Ext.encode(candidatos)
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                if (candidatos.length == 1) {
                                    mostrarMensaje(1, self.idioma.msgExcluidos_successSin);
                                } else {
                                    mostrarMensaje(1, self.idioma.msgExcluidos_successPlu);
                                }
                            } else if (responseData == 0) {
                                mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                            }
                            self.windExc.hide();
                            self.stCandidatos.reload();
                            self.gpCandidatos.getSelectionModel().clearSelections();
                        }
                    });
                } else {
                    mostrarMensaje(6, self.idioma.msgExcluidos_noselec);
                }
            }
        });

        this.btnCancelExc = new Ext.Button({
            iconCls  : 'cancelar',
            text     : this.idioma.btnFrmCancelar_text,
            tooltip  : this.idioma.btnFrmCancelar_tooltips,
            handler: function ()
            {
                self.windExc.hide();
            }
        });

        this.windExc = new Ext.Window({
            layout: 'fit',
            constrain:true,
            title:  'Excluir candidato',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 350,
            height: 310,
            maximizable: false,
            items: [this.fObservacionExc],
            buttons: [this.btnCancelExc, this.btnAceptExc],
            keys: [{
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancelExc.disabled) {
                        self.btnCancelExc.handler();
                    }
                }
            },
                {
                    key: 13,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptExc.disabled) {
                            self.btnAceptExc.handler();
                        }
                    }
                }]
        });

        // Reincorporar candidato
        this.stMotivoRein= new Ext.data.Store({
            url: 'getMotivosReincorporacion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idmotivoreicorporacion"},
                [{name:'idmotivoreicorporacion'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        this.stMotivoRein.load();

        this.cbMotivoRein = new Ext.form.ComboBox({
            store: this.stMotivoRein,
            displayField: 'denominacion',
            valueField: 'idmotivoreicorporacion',
            hiddenName: 'idmotivoreicorporacion',
            forceSelection: true,
            fieldLabel: 'Motivo de reincorporaci&oacute;n',
            typeAhead: true,
            allowBlank: false,
            anchor: '99%',
            mode: 'local',
            triggerAction: 'all',
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            emptyText: 'Seleccione...',
            editable: false
        });

        this.taObservacionReinc = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observacion',
            anchor: '100%',
            height: 150,
            hiddenname: 'descripcion',
            allowBlank: true
        });

        this.fObservacionRein = new Ext.form.FormPanel({
            frame: true,
            bodyStyle: 'padding: 3px 3px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [this.cbMotivoRein, self.taObservacionReinc]
        });

        this.btnAceptRein = new Ext.Button({
            iconCls  : 'aceptar',
            text     : this.idioma.btnFrmAceptar_text,
            tooltip  : this.idioma.btnFrmAceptar_tooltips,
            handler: function ()
            {
                var arrExc = new Array();
                var selec = self.gpExcluidos.getSelectionModel().getSelections();
                for(i = 0; i < selec.length; i++){
                    var cand = {
                        idcandidato: selec[i].data.idcandidato,
                        idexcluido: selec[i].data.idexcluido
                    };
                    arrExc.push(cand);
                }
                Ext.Ajax.request({
                    url: 'reincorporarCandidato',
                    params  : {
                        idproceso : self.idproceso,
                        idmotivo: self.cbMotivoRein.getValue(),
                        observacion: self.taObservacionReinc.getValue(),
                        arrIncorp : Ext.encode(arrExc)
                    },
                    success : function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == 0) {
                            mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                        } else if (responseData.success == true) {
                            if(responseData.msg == true) {
                                if (selec.length == 1) {
                                    mostrarMensaje(1, self.idioma.msgReincorporar_successSin);
                                } else {
                                    mostrarMensaje(1, self.idioma.msgReincorporar_successPlu);
                                }
                            } else {
                                mostrarMensaje(6, self.idioma.msgReincorporar_fail_ok);
                            }
                        } else {
                            mostrarMensaje(6, self.idioma.msgReincorporar_fail);
                        }
                        self.windReincorporar.hide();
                        self.stExcluidos.reload();
                        self.stCandidatos.reload();
                    }
                });
            }
        });

        this.btnCancelRein = new Ext.Button({
            iconCls  : 'cancelar',
            text     : this.idioma.btnFrmCancelar_text,
            tooltip  : this.idioma.btnFrmCancelar_tooltips,
            handler: function ()
            {
                self.windReincorporar.hide();
            }
        });

        this.windReincorporar = new Ext.Window({
            layout: 'fit',
            constrain:true,
            title:  'Reincorporar candidato',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 350,
            height: 310,
            maximizable: false,
            items: [this.fObservacionRein],
            buttons: [this.btnCancelRein, this.btnAceptRein],
            keys: [{
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancelRein.disabled) {
                        self.btnCancelRein.handler();
                    }
                }
            },
                {
                    key: 13,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptRein.disabled) {
                            self.btnAceptRein.handler();
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
                    }
                }
            },
			{
				key: 'l',
				alt: true,
				stopEvent: true,
				fn: function () {
					self.sfBuscar.onTrigger1Click();
				}
			},
			{
				key: 'b',
				alt: true,
				stopEvent: true,
				fn: function () {
					self.sfBuscar.onTrigger2Click();
				}
			}
        ];

        Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarCandidato.superclass.initComponent.call(this);
    }
});
