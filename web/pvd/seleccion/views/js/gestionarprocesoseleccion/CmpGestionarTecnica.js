/*
 * Componente Gestionar técnica de selección.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarTecnica
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion');
Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarTecnica = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    width: '100%',
    //iconCls: 'tecnica',
    initComponent: function() {
        var self = this;
        this.persona;
        var objEval;
        this.btnIniciarTec = new Ext.Button({
            id: 'btnIniciarTec',
            text: this.idioma.btnIniciar_text,
            disabled: true,
            tooltip: this.idioma.btnIniciar_tooltips,
            iconCls : 'iniciar',
            handler: function ()
            {
                var selec = self.gpCandidatosTec.getSelectionModel().getSelections();
                if(selec.length > 0){
                    var candidatos = new Array();
                    for(i = 0; i < selec.length; i++){
                        candidatos.push({idcandidato: selec[i].data.idcandidato,
                            idpersona: selec[i].data.idpersona});
                    }
                    Ext.Ajax.request({
                        url: 'iniciarTecnica',
                        params: {
                            idproceso: self.idproceso,
                            idprocesotecnica: self.idprocesotecnica,
                            candidatos: Ext.encode(candidatos)
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == 1) {
                                mostrarMensaje(1, self.idioma.lbTecnicaIniciadaSucces);
                            } else if (responseData == 0) {
                                mostrarMensaje(6, self.idioma.lbTecnicaIniciadaFail);
                            } else  if (responseData == 2) {
                                mostrarMensaje(6, self.idioma.msgNoTieneAcceso);
                            }
                            self.stCandidatosTec.reload();
                            self.gpCandidatosTec.getSelectionModel().clearSelections();
                        }
                    });
                } else {
                    mostrarMensaje(6, self.idioma.lbTecnicaIniciadaVacia);
                }
            }.createDelegate(this)
        });

        this.btnAplicarTec = new Ext.Button({
            id: 'btnAplicarTec',
            disabled: true,
            text: this.idioma.btnFrmAplicar_text,
            tooltip: this.idioma.lbAplicartec_tooltip,
            iconCls: 'aplicar',
            handler: function ()				
            {	
				self.persona.data.nopersona = 0;		
                windEvaluar = new Pvd.Seleccion.Gestionarprocesoseleccion.EvaluarTecnica({
                    persona: self.persona,
                    idioma: self.idioma,
                    idproceso: self.idproceso,
                    idprocesotecnica: self.idprocesotecnica
                });
                windEvaluar.show();
                windEvaluar.maximize();
                windEvaluar.on('evaluacionConcluida', function ()
                {
                    self.stCandidatosTec.reload();
                });
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
                var obser = self.gpCandidatosTec.getSelectionModel().getSelected().data.observacion;
                self.taObservacion.setValue(obser);
            }
        });

        this.smCandidatosTec = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (sm) {
                    if (sm.hasSelection()) {
                        var habilita = true;
                        for (i = 0; i < sm.getSelections().length; i++) {
                            if (sm.getSelections()[i].data.fdesde) {
                                habilita = false;
                            }
                        }
                        (habilita && self.estado == 'Actual' && self.planillasexp == 0 && (self.cantd == null || self.cantd >= 0))?self.btnIniciarTec.enable():self.btnIniciarTec.disable();
                        if (sm.getSelections().length == 1 && self.estado == 'Actual') {
                            self.btnObservacion.enable();
                            if (sm.getSelected().data.fdesde) {
                                self.btnAplicarTec. enable();
                                self.persona = sm.getSelected();
                            } else {
                                self.btnAplicarTec.disable();
                            }
                        } else {
                            self.btnObservacion.disable();
                        }
                    } else {
                        self.btnObservacion.disable();
                        self.btnIniciarTec.disable();
                        self.btnAplicarTec.disable();
                    }
                }.createDelegate(this)
            }
        });


        this.stCandidatosTec = new Ext.data.Store({
            url: 'getCandidatosTecnicaProceso',
            baseParams: {idproceso:this.idproceso, idprocesotecnica:this.idprocesotecnica},
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'datos', id: 'idcandidato'
            }, [
                {name: 'idcandidato'},
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'foto'},
                {name: 'sexo'},
                {name: 'observacion'},
                {name: 'idresultadotecnica'},
                {name: 'idplanilla'},
                {name: 'idmodelo'},
                {name: 'nombre'},
                {name: 'fdesde'},
                {name: 'fhasta'},
                {name: 'resultado'},
                {name: 'plazo'},
                {name: 'color'}
            ]),
			listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
						if (self.sfBuscarCandTec.getValue() == '') {
							mostrarMensaje(1,this.idioma.lbNoDatos);
						} else {
							mostrarMensaje(1,this.idioma.lbNoDatosBusc);
						}
					}
                }.createDelegate(this)
            }
        });

        this.stCandidatosTec.load({params:{start:0,limit:15}});

        this.sfBuscarCandTec = new Ext.app.SearchField({
            store: this.stCandidatosTec,
			toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarCand,
            emptyText: this.idioma.lbSfBuscar
        });

        //color del resultado
        function colorResultado(val, metaData, record) {
            if(record.get('color') != null && val != null) {
                return '<span style="color:' + record.get('color') + ';"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }
		
		function tiempo(val) {
            if(val != null) {
                return val+' d&iacute;as';
            } else {
                return val;
            }
        }

        //Listado de candidatos.
        this.gpCandidatosTec = new Ext.grid.GridPanel({
            store: this.stCandidatosTec,
            tbar: [this.btnIniciarTec, this.btnAplicarTec,this.btnObservacion, '-', this.sfBuscarCandTec],
            height: 400,
            width: '70%',
            autoScroll: true,
            region: 'center',
            loadMask: {msg: 'Cargando...'},
            sm: this.smCandidatosTec,
            columns: [this.smCandidatosTec,
                // {header: 'Foto', width:100, dataIndex: 'foto'},
                {header: 'No. Registro', width:80, dataIndex: 'idpersona', renderer : colorResultado},
                {header: 'No. Identidad', width:100, dataIndex: 'numid', renderer : colorResultado},
                {header: 'Apellidos y nombres', width:250, dataIndex: 'nombre', renderer : colorResultado},
                {header: 'Fecha inicio', width:80, dataIndex: 'fdesde', renderer : colorResultado},
                {header: 'Fecha fin', width:80, dataIndex: 'fhasta', renderer : colorResultado},
                {header: 'Resultado', width:80, dataIndex: 'resultado', renderer : colorResultado},
                {header: 'Tiempo transcurrido', width:110, dataIndex: 'plazo', renderer : tiempo}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stCandidatosTec,
                displayInfo: true
            })
        });

        this.items = [this.gpCandidatosTec];
        if (self.estado != 'Actual' || (self.cantd != null && self.cantd < 0) || self.planillasexp == 1) {
            self.btnIniciarTec.disable();
            self.btnAplicarTec.disable();
        }
        if (self.cantd != null && self.cantd < 0 || self.planillasexp == 1) {
            Ext.MessageBox.show({
                title: 'Advertencia',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING,
                msg: 'Esta t&eacute;cnica no est&aacute; activa.'
            });
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
                        idprocesotecnica: self.idprocesotecnica,
                        idcandidato: self.gpCandidatosTec.getSelectionModel().getSelected().data.idcandidato,
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
                        self.stCandidatosTec.reload();
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
                    }
                }
            },
			{
				key: 'l',
				alt: true,
				stopEvent: true,
				fn: function () {
					self.sfBuscarCandTec.onTrigger1Click();
				}
			},
			{
				key: 'b',
				alt: true,
				stopEvent: true,
				fn: function () {
					self.sfBuscarCandTec.onTrigger2Click();
				}
			}
        ];
		
        Pvd.Seleccion.Gestionarprocesoseleccion.PanelGestionarTecnica.superclass.initComponent.call(this);
    }
});
