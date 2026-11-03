/*
 * Componente Gestionar seguimiento de candidatos.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarSeguimiento
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion');
Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarSeguimiento = Ext.extend(Ext.Panel, {
    layout: 'fit', 
	id: 'gestseguimiento',
	title: 'Seguimiento',
	region: 'center',
	height: '100%',
	closable: true,
	//iconCls: 'seguimiento',
    initComponent: function() {
        var self = this;
        var accion, objseg;
		this.btnAddSeg = new Ext.Button({
            id: 'btnAddSeg',
            text: this.idioma.btnAdd_text,
            tooltip: this.idioma.btnAddSeg_tooltips,
            iconCls: 'adicionar',
			handler: function ()
            {
                self.windaddCandidato.setTitle('Adicionar seguimiento');
                self.windaddCandidato.show();
                self.btnAplicar.show();
                self.smCandidatos.singleSelect = false;
                self.stCandidatos.load({params:{start:0,limit:15}});
                self.formularioGestion.getForm().reset();
                self.gpCandidatos.getSelectionModel().clearSelections();
                accion = 'add';
            }.createDelegate(this)
		});

        this.btnModSeg = new Ext.Button({
            id: 'btnModSeg',
            disabled: true,
            text: this.idioma.btnModProceso_text,
            tooltip: this.idioma.btnModSeg_tooltips,
            iconCls: 'modificar',
            handler: function ()
            {
                self.windaddCandidato.setTitle('Modificar seguimiento');
                self.windaddCandidato.show();
                self.btnAplicar.hide();
                self.smCandidatos.singleSelect = true;
                self.stCandidatos.load({params:{start:0,limit:15}});
                self.cbMotivoSeguimiento.setValue(objseg.idmotivoseguimiento);
                self.cbMotivoSeguimiento.setRawValue(objseg.motivoseguimiento);
                self.dfFInicio.setRawValue(objseg.fdesde);
                self.dfFFin.setRawValue(objseg.fhasta);
                accion = 'mod';
            }.createDelegate(this)
        });

		this.btnConcluir = new Ext.Button({
            id: 'btnConcluir',
            text: 'Concluir',
            tooltip: this.idioma.btnConcluirSeg_tooltips,
            iconCls: 'terminar',
			disabled: true,
			handler: function ()
            {
               var selec = self.gpCandidatosSeg.getSelectionModel().getSelections();
                if(selec.length > 0){
					var candidatos = new Array();
					for(i = 0; i < selec.length; i++){	
						candidatos.push(selec[i].data.idseguimiento);
					}
					Ext.Ajax.request({
						url: 'updateCandidatosSeguimiento',
						params: {
                            idproceso: self.idproceso,
                            concluir: 1,
							candidatos: Ext.encode(candidatos)
						},
						success: function (r){
							var responseData = Ext.decode(r.responseText);
							if (responseData == true) {
								mostrarMensaje(1, 'El seguimiento ha sido concluido satisfactoriamente.');
							} else if (responseData == 0) {
                                mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                            }
							self.stCandidatosSeg.reload();
							self.gpCandidatosSeg.getSelectionModel().clearSelections();
						}
					});
				} else {
					mostrarMensaje(6, 'Debe seleccionar al menos un elemento.');
				}
            }.createDelegate(this)
		});

        this.btnEliminarSeguimiento = new Ext.Button({
            id: 'btnEliminarSeguimiento',
            text: 'Eliminar',
            tooltip: this.idioma.btnDelSeg_tooltips,
            iconCls: 'eliminar',
            disabled: true,
            handler: function ()
            {
                var selec = self.gpCandidatosSeg.getSelectionModel().getSelections();
                var candidatos = new Array();
                for(i = 0; i < selec.length; i++){
                    candidatos.push(selec[i].data.idseguimiento);
                }
                var mensaje = '';
                if (selec.length == 1) {
                    mensaje = self.idioma.msgDelSeg_confirmSin;
                } else {
                    mensaje = self.idioma.msgDelSeg_confirmPlu;
                }
                mostrarMensaje(2, mensaje, function (btnPress){
                    if (btnPress == 'ok') {
                        Ext.getBody().mask('Eliminando...');
                        Ext.Ajax.request({
                            url     : 'deleteCandidatosSeguimiento',
                            params  : {
                                idproceso: self.idproceso,
                                candidatos: Ext.encode(candidatos)
                            },
                            callback : function() {Ext.getBody().unmask();},
                            success : function (r) {
                                var responseData = Ext.decode(r.responseText);
                                if(responseData == true) {
                                    if (selec.length == 1) {
                                        mostrarMensaje(1, 'El seguimiento fue eliminado satisfactoriamente.');
                                    } else {
                                        mostrarMensaje(1, 'Los seguimientos fueron eliminados satisfactoriamente.');
                                    }
                                    self.stCandidatosSeg.reload();
                                    self.gpCandidatosSeg.getSelectionModel().clearSelections();
                                } else if(responseData == false){
                                    if (selec.length == 1) {
                                        mostrarMensaje(6, 'El seguimiento no puede ser eliminado debido a que se encuenta en uso.');
                                    } else {
                                        mostrarMensaje(6, 'Alguno de los seguimientos no pueden ser eliminados debido a que se encuentan en uso.');
                                    }
                                } else {
                                    mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                                }
                            }
                        });
                    }
                });

            }.createDelegate(this)
        });

        this.smCandidatos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.smCandidatosSeg = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false,
            listeners: {
                selectionchange: function (sm) {
                    if (sm.hasSelection() && self.estado == 'Actual') {
                        self.btnConcluir.enable();
                        if (sm.getSelections().length == 1) {
                            self.btnModSeg.enable();
                        } else {
                            self.btnModSeg.disable();
                        }
                        self.btnEliminarSeguimiento.enable();
                        objseg = sm.getSelected().data;
                        if (objseg.estado != 'Actual') {
                            self.btnConcluir.disable();
                        }
                    } else {
                        self.btnConcluir.disable();
                        self.btnModSeg.disable();
                        self.btnEliminarSeguimiento.disable();
                    }
                }.createDelegate(this)
            }
		});		
		
		this.stCandidatosSeg = new Ext.data.GroupingStore({
            url: 'getCandidatosSeguimiento',
			baseParams: {idproceso:this.idproceso},
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'datos', id: 'idseguimiento'
            }, [
				{name: 'idseguimiento'},
                {name: 'idcandidato'},
                {name: 'idpersona'},
                {name: 'numid'},			
                {name: 'nombre'},
                {name: 'estado'},
                {name: 'idmotivoseguimiento'},
				{name: 'motivoseguimiento'},
                {name: 'fdesde'},
                {name: 'fhasta'}
            ]),
            sortInfo: {field: 'estado', direction: "ASC"},
            groupField: 'estado',
            listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
                        if (self.sfBuscarSeg.getValue() == '') {
                            mostrarMensaje(1,this.idioma.lbNoDatos);
                        } else {
                            mostrarMensaje(1,this.idioma.lbNoDatosBusc);
                        }
                    }
                }.createDelegate(this)
            }
        });
		this.stCandidatosSeg.load({params:{start:0,limit:15}});
		
		this.sfBuscarSeg = new Ext.app.SearchField({
            store: this.stCandidatosSeg,
            toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarCand,
            emptyText: this.idioma.lbSfBuscar
        });		

		//Listado de candidatos.
        this.gpCandidatosSeg = new Ext.grid.EditorGridPanel({
            store: this.stCandidatosSeg,
			tbar: [this.btnAddSeg, this.btnModSeg, this.btnEliminarSeguimiento, this.btnConcluir, '-', this.sfBuscarSeg],
			height: 400,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
			region: 'center',
			loadMask:{msg: this.idioma.lbCargando},
			sm: this.smCandidatosSeg,
            columns: [this.smCandidatosSeg,
                {width:300, dataIndex: 'estado', hidden: true},
                {header: 'No. Identidad', width:100, dataIndex: 'numid'},
                {header: 'Apellidos y nombres', width:250, dataIndex: 'nombre'},
                {header: 'Motivo de seguimiento', width:300, dataIndex: 'motivoseguimiento'},
                {header: 'Fecha inicio', width:100, dataIndex: 'fdesde'},
                {header: 'Fecha fin', width:100, dataIndex: 'fhasta'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stCandidatosSeg,
                displayInfo: true
            })
        });

        this.stMotivoSeg = new Ext.data.Store({
            url: 'getMotivosSeguimiento',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idmotivoseguimiento"},
                [{name:'idmotivoseguimiento'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        this.stMotivoSeg.load();

        this.cbMotivoSeguimiento = new Ext.form.ComboBox({
            store: this.stMotivoSeg,
            displayField: 'denominacion',
            valueField: 'idmotivoseguimiento',
            hiddenName: 'idmotivoseguimiento',
            forceSelection: true,
            fieldLabel: 'Motivo de seguimiento',
            typeAhead: true,
            allowBlank: false,
            anchor: '99%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            editable: false
        });

        var fecha = new Date();
        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicioSeg',
            fieldLabel: this.idioma.dfFDesde_label,
            name: 'fdesde',
            hiddenname:'fdesde',
            anchor:'98%',
            value: fecha.format('d/m/Y'),
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: this.idioma.lbEmptyTextFecha
        });

        this.dfFFin = new Ext.form.DateField({
            id: 'dfFFinSeg',
            fieldLabel: this.idioma.dfFHasta_label,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'98%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            startDateField: 'dfFInicioSeg',
            vtype:'daterange',
            emptyText: this.idioma.lbEmptyTextFecha
        });

        this.stCandidatos = new Ext.data.Store({
            url: 'getCandidatosByProceso',
            baseParams: {idproceso:this.idproceso},
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'datos', id: 'idcandidato'
            }, [
                {name: 'idcandidato'},
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'nombre'}
            ]),
            listeners: {
                load: function (st, rec, opt) {
                    if (accion == 'mod') {
                        var candselect = self.stCandidatos.getById(objseg.idcandidato);
                        var objrec = [];
                        objrec.push(candselect);
                        self.smCandidatos.selectRecords(objrec);
                    }
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

        this.sfBuscar = new Ext.app.SearchField({
            store: this.stCandidatos,
            toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarCand,
            emptyText: this.idioma.lbSfBuscar
        });

        //Listado de candidatos.
        this.gpCandidatos = new Ext.grid.EditorGridPanel({
            title: 'Listado de candidatos',
            store: this.stCandidatos,
            tbar: ['Buscar: ', this.sfBuscar],
            height: 310,
            width: '99%',
            autoScroll: true,
            region: 'center',
            loadMask:{msg: this.idioma.lbCargando},
            sm: this.smCandidatos,
            columns: [this.smCandidatos,
                {header: 'No. Identidad', width:100, dataIndex: 'numid'},
                {header: 'Apellidos y nombres', width:250, dataIndex: 'nombre'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stCandidatos,
                displayInfo: true
            })
        });


        //Formulario de gestion.
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
                        items: [this.cbMotivoSeguimiento]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFInicio]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFFin]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.gpCandidatos]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.btnFrmCancelar_tooltips,
            text: this.idioma.btnFrmCancelar_text,
            handler: function ()
            {
                self.windaddCandidato.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: this.idioma.btnFrmAceptar_tooltips,
            text: this.idioma.btnFrmAceptar_text,
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            tooltip: this.idioma.btnFrmAplicar_tooltips,
            text: this.idioma.btnFrmAplicar_text,
            handler: function ()
            {
                guardarDatos('APL');
            }.createDelegate(this)
        });

        this.windaddCandidato = new Ext.Window({
            layout: 'fit',
            title:  this.idioma.lbAddCandidato,
            modal: true,
            closeAction: 'hide',
            constrain:true,
            resizable: false,
            width: 450,
            height: 400,
            maximizable: false,
            buttons: [this.btnCancelar,  this.btnAplicar, this.btnAceptar],
            items: [this.formularioGestion],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function ()
                    {
                        self.btnAceptar.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function ()
                    {
                        if (!self.btnCancelar.disabled) {
                            self.btnCancelar.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    ctrl:true,
                    alt: true,
                    stopEvent: true,
                    fn: function ()
                    {
                        if (!self.btnAplicar.disabled) {
                            self.btnAplicar.handler();
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
            ]
        });
		
        this.items = [this.gpCandidatosSeg];

        this.gpCandidatosSeg.on('render',function(){
            self.btnAddSeg.focus();
        });

        if (self.estado != 'Actual') {
            self.btnAddSeg.disable();
            self.btnModSeg.disable();
            self.btnConcluir.disable();
            self.btnEliminarSeguimiento.disable();
        }

        function guardarDatos(btn) {
            var selec = self.gpCandidatos.getSelectionModel().getSelections();
            if(self.formularioGestion.getForm().isValid()){
                if(selec.length > 0){
                    var candidatos = new Array();
                    for(i = 0; i < selec.length; i++){
                        candidatos.push(selec[i].data.idcandidato);
                    }
                    Ext.Ajax.request({
                        url: (accion == 'add')?'addCandidatosSeguimiento':'updateCandidatosSeguimiento',
                        params: {
                            idseguimiento: (accion == 'add')?-1:self.gpCandidatosSeg.getSelectionModel().getSelected().data.idseguimiento,
                            motivoseguimiento: self.cbMotivoSeguimiento.getValue(),
                            fdesde: self.dfFInicio.getRawValue(),
                            fhasta: self.dfFFin.getRawValue(),
                            candidatos: Ext.encode(candidatos),
                            concluir: (accion == 'add')?null:2,
                            idproceso: self.idproceso
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                var mens = (accion == 'add')?'adicionado':'modificado';
                                mostrarMensaje(1, 'El seguimiento ha sido '+mens+' satisfactoriamente.');
                                self.stCandidatosSeg.reload();
                            } else if (responseData == false) {
                                if (selec.length == 1) {
                                    mostrarMensaje(6, 'El candidato seleccionado ya se encuentra en seguimiento.');
                                } else {
                                    mostrarMensaje(6, 'Alguno de los candidatos seleccionados ya se encuentra en seguimiento.');
                                }
                                self.stCandidatosSeg.reload();
                            }  else {
                                mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                            }
                            if (btn == 'ACP') {
                                self.windaddCandidato.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.gpCandidatos.getSelectionModel().clearSelections();
                        }
                    });
                } else {
                    mostrarMensaje(6, 'Debe seleccionar al menos un candidato.');
                }
            }
        }

        this.keys = [
            {
                key: 'i',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnAddSeg.disabled) {
                        self.btnAddSeg.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnModSeg.disabled) {
                        self.btnModSeg.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                stopEvent: true,
                fn: function () {
                    if (!self.btnEliminarSeguimiento.disabled) {
                        self.btnEliminarSeguimiento.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                stopEvent: true,
                fn: function () {
                    self.sfBuscarSeg.onTrigger1Click();
                }
            },
            {
                key: 'b',
                alt: true,
                stopEvent: true,
                fn: function () {
                    self.sfBuscarSeg.onTrigger2Click();
                }
            }
        ];
        Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarSeguimiento.superclass.initComponent.call(this);
    }
});
