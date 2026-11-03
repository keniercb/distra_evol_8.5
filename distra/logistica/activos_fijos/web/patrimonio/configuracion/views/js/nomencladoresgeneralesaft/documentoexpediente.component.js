/**
 * Created with JetBrains PhpStorm.
 * User: yoendy
 * Date: 8/2/13
 * Time: 8:51 AM
 * To change this template use File | Settings | File Templates.
 */



Ext.erp.nomdocexpediente = Ext.extend(Ext.erp.gridPanelNomenclador, {
    posId: '',
    idtabla: '',
    constructor: function(config) {
        var _this = this;
        config.campoIdNomenclador = 'idexpediente';
        Ext.apply(this, config);
        this.codigo = false;
        this.modelo = 'DocumentoExpediente';
        _this.columnsFields = [
            {
                header: ' Culminación del expediente',
                width: 152,
                dataIndex: 'culminacion',
                align: 'center',
                renderer: function(value, metaData) {

                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }
        ];
        _this.storeFields = [
            {
                name: 'culminacion'
            }, {
                name: 'idtabla'
            }

        ];

        Ext.erp.nomdocexpediente.superclass.constructor.apply(this, arguments);
        var date = new Date();
        this.posId = date.getFullYear() + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes() + date.getMilliseconds();

        this.check = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbFinExpediente,
            name: 'culminacion',
            hideLabel: false,
            inputValue: 1
        })
        this.panelEstOperativos = new Ext.Panel({
            height: 40,
            width: 100,
            items: [this.check]
        });

        _this.formFields = [this.panelEstOperativos];
        this.selectionModeNomenclador.singleSelect = true;
        this.pContenedor = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            border: false,
            bodyBorder: false,
            items: [
                {}
            ]
        });
    }
});



Ext.erp.nomdocexpediente2 = Ext.extend(Ext.erp.gridPanelNomenclador, {
    posId: '',
    idtabla: '',
    constructor: function(config) {
        var _this = this;
        config.campoIdNomenclador = 'idexpediente';
        Ext.apply(this, config);
        this.codigo = false;
        this.bussinesModel = 'DocumentoExpediente';
        var date = new Date();
        this.posId = date.getFullYear() + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes() + date.getMilliseconds();

        _this.columnsFields = [
            {
                header: ' Culminación del expediente',
                width: 152,
                dataIndex: 'culminacion',
                align: 'center',
                renderer: function(value, metaData) {

                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }
        ];
        _this.storeFields = [
            {
                name: 'culminacion'
            }, {
                name: 'idtabla'
            }

        ];
        this.panelEstOperativos = new Ext.Panel({
            height: 40, width: 100,
            items: [
                {
                    xtype: 'checkbox',
                    boxLabel: _this.idioma.lbFinExpediente,
                    name: 'culminacion',
                    hideLabel: false,
                    inputValue: 1
                }
            ]
        });

        _this.formFields = [this.panelEstOperativos];
        Ext.erp.nomdocexpediente.superclass.constructor.apply(this, arguments);
        this.selectionModeNomenclador.singleSelect = true;

        this.pContenedor = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            border: false,
            bodyBorder: false,
            items: [
                {}
            ]
        });

        /**
         *  Grid para la gestión de atributos dinámicos
         *  
         */
        this.gridAtribDinamicos = new Ext.erp.gridAtribDinamicos({
            schema: 'mod_datosmaestrosmeta',
            descripcionOrigen: 'Nomenclador_documentoexpediente',
            prefijoTabla: 'docexp',
            llavesGlobal: ['idexpediente'],
            llavesHijos: ['idexpdocumento'],
            globalHide: true,
            globalDefault: false,
            fnShowVentanaGestion: function(open) {
                _this.blockHotKeys = open;
            },
            listeners: {
                'show': function(grid) {

                    var pContenedor = _this.panelOperativos;
                    pContenedor.add(grid);
                    pContenedor.doLayout(true);

                    _this.selectionModeNomenclador.on({
                        'rowselect': function() {
                            _this.gridAtribDinamicos.getStore().load();
                            _this.loadAtribDinamicos();
                        },
                        'rowdeselect': function() {
                        }
                    });
                }
            },
            preOperacion: function() {

                this.idObjeto = _this.selectionModeNomenclador.getSelected().data.idexpediente;//_this.cmpSeleccionado.getDataNodoSeleccionado().idindicador;
                /*  var dataRecord = _this.getCmpSeleccionado().getDataNodoSeleccionado();*/

                _this.gridAtribDinamicos.getStore().baseParams = {
                    arridtablas: _this.selectionModeNomenclador.getSelected().data.idtabla, //dataRecord.arridtablas,
                    arridtablasgenerales: _this.selectionModeNomenclador.getSelected().data.idexpediente
                };
                this.idtabla = _this.selectionModeNomenclador.getSelected().data.idtabla;
            },
            /**
             *  Función ha ejecutarse tras insertar un nuevo atributo dinámico
             */
            postAdicionar: function(idtabla, columna) {
                Ext.Ajax.request({
                    url: '/logistica/activos_fijos/configuracion/index.php/nomdocumentoexpediente/actualizaridtabla',
                    method: 'POST',
                    params: {
                        idtabla: idtabla,
                        idexpediente: _this.selectionModeNomenclador.getSelected().data.idexpediente
                    },
                    callback: function(options, success, response) {
                        var resp = Ext.decode(response.responseText);
                        if (resp.success) {
                            mostrarMensaje(1, _this.idioma.lbMsgModConfigInterfaz);
                            var record = _this.gridPanelNomenclador.getSelectionModel().getSelected();
                            _this.gridPanelNomenclador.getStore().load({
                                'callback': function() {
                                    _this.gridPanelNomenclador.getSelectionModel().selectRecords([record]);
                                }
                            });

                            _this.actualizarIdTabla(idtabla, columna, function() {
                                _this.loadAtribDinamicos();
                            });
                        } else {
                            mostrarMensaje(3, _this.idioma.msjAsignarAtributoDinamico);
                        }
                    }
                });



                /*_this.actualizarIdTabla(idtabla, columna, function() {
                 _this.loadAtribDinamicos();
                 });*/
            },
            postModificar: function() {
                _this.loadAtribDinamicos();
            },
            /**
             *  Función ha ejecutarse tras eliminar un atributo dinámico
             */
            postEliminar: function(idtabla, columna) {
                _this.loadAtribDinamicos();
            }
        });
        this.panelOperativos = new Ext.Panel({
            title: 'Atributos del indicador',
            layout: 'fit',
            region: 'south',
            height: 250,
            collapsible: true,
            collapseMode: 'mini',
            collapsed: true,
            titleCollapse: true
        });

        this.add(_this.panelOperativos);

    },
    actualizarIdTabla: function(idtabla, columna, _fn) {
        var _this = this;
        var dataRecord = _this.selectionModeNomenclador.getSelected();//_this.cmpSeleccionado.getDataNodoSeleccionado();
        /*
         *  En caso de que el idtabla ó idtablageneral sea distinto al parámetro, significa que es nueva la tabla metadata
         *  de atributos dinámicos
         */
        /* if (dataRecord.data[(columna == 'idtablas') ? 'idtabla' : 'idtablageneral'] != idtabla) {
         var parametros = {
         idindicador: dataRecord.data.idexpediente
         };
         parametros[(columna == 'idtablas') ? 'idtabla' : 'idtablageneral'] = idtabla;
         
         Ext.Ajax.request({
         url: Ext.erp.indicadores.urlControladora + 'modificarIndicador',
         method: 'POST',
         params: parametros,
         callback: function(options, success, response) {
         var resp = Ext.decode(response.responseText);
         if (resp.success) {
         mostrarMensaje(1, _this.idioma.lbMsgModConfigInterfaz);
         
         _this.cmpSeleccionado.setDataNodoSeleccionado((columna == 'idtablas') ? 'idtabla' : 'idtablageneral', idtabla);
         _this.cmpSeleccionado.setDataNodoSeleccionado('arr' + columna, (dataRecord['arr' + columna] + ',' + idtabla));
         
         _fn();
         
         } else {
         mostrarMensaje(3, _this.idioma.lbMsgGuardarError);
         }
         }
         });*/

        //  } else {
        //_fn();
        //}

    },
    loadAtribDinamicos: function() {

        var _this = this;
        var data = this.selectionModeNomenclador.getSelected();
        /*if (_this.gridAtribDinamicos && _this.gridAtribDinamicos.getStore()) {
         if (data.arridtablas || data.arridtablasgenerales) {
         
         _this.gridAtribDinamicos.getStore().load();
         } else {
         _this.gridAtribDinamicos.getStore().removeAll();
         }
         }*/

        if (data.id == 0) {
            if (_this.gridAtribDinamicos && _this.gridAtribDinamicos.btnAdicionar) {
                _this.gridAtribDinamicos.btnAdicionar.enable();
            }
            _this.panelOperativos.collapse();

        } else {
            if (_this.gridAtribDinamicos) {
                if (_this.gridAtribDinamicos.btnAdicionar) {
                    _this.gridAtribDinamicos.btnAdicionar.enable();
                }

                _this.panelOperativos.expand();
                //_this.panelOperativos.collapse();
            }
        }
    },
    onBtnAdicionarClick: function() {
        var _this = this;
        Ext.erp.nomestatus.superclass.onBtnAdicionarClick.call(this);
    },
    onBtnAceptarClick: function(modificar, _fn, msgerr, text) {

        var _this = this;
        var msgWait = (modificar == true) ? _this.idioma.lbMsgWaitModificado : _this.idioma.lbMsgWaitAdicionado;
        var url = _this.urlController + ((modificar == false) ? 'insertarnomenclador' : 'modificarnomenclador');
        var tempFp = _this.fpGestionarNomenclador.getForm();

        if (!tempFp.isValid()) {
            mostrarMensaje(1, _this.idioma.lbMsgCamposInvalidos);
            return;
        }
        if (modificar && !tempFp.isDirty()) {
            _this.winGestionarNomenclador.close();
            return;
        }

        tempFp.submit({
            url: url,
            waitMsg: msgWait,
            method: 'POST', params: {
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel
            },
            success: function(form, action) {
                if (typeof _fn == 'function') {
                    _fn.call();
                }
            },
            failure: function(form, action) {
                if (action.result.etiqueta && action.result.cod == '1') {
                    mostrarMensaje(1, (msgerr) ? msgerr : _this.idioma[action.result.etiqueta]);
                } else if (action.result.etiqueta && action.result.cod == '3') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);

                } else
                    (action.result.etiqueta)
                {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                }
            }
        });
    },
    onAceptarEliminar: function(tecnico, idnomenclador, _fn, msgp, msgr, msge) {
        var _this = this;

        mostrarMensaje(2, (msgp) ? msgp : _this.idioma.lbMsgConfirmarEliminar, function(btn) {
            if (btn == 'ok') {
                var ldMsgmascara = _this.idioma.lbMsgEliminandoNomenclador;
                if (!tecnico) {
                    ldMsgmascara = _this.idioma.lbMsgEliminandoNomencladorOperativo;
                }
                Ext.getBody().mask(ldMsgmascara);
                Ext.Ajax.request({
                    url: _this.urlController + 'eliminarnomenclador',
                    params: {
                        idpadre: _this.selectionModeNomenclador.getSelected().id,
                        idnom: Ext.encode(idnomenclador),
                        pkid: (tecnico) ? _this.campoIdNomenclador : 'idestatusoperativo',
                        modelo: (tecnico) ? _this.modelo : 'NomEstatusoperativo'
                    },
                    method: 'POST',
                    callback: function(o, s, r) {
                        var dataResp = Ext.decode(r.responseText);
                        Ext.getBody().unmask();
                        if (dataResp.success) {
                            mostrarMensaje(1, (msgr) ? msgr : _this.idioma.lbMsgNomencladorEliminado);
                            _this.storeNomenclador.load();
                            if (typeof _fn == 'function') {
                                _fn.call();
                            }
                        } else {
                            mostrarMensaje(3, (msge) ? msge : _this.idioma.lbMsgErrorEliminado);
                        }
                    }
                });
            }
        });
    },
    onAceptarUsarEntidad: function(idnomencladores, valorUsar, _fn) {

        var _this = this;
        if (valorUsar == 1 || valorUsar == 2) {
            Ext.getBody().mask(_this.idioma.lbMsgAsociandoNomenclador);
            Ext.Ajax.request({
                url: _this.urlController + 'habilitardesabiltarentidad',
                params: {
                    idnom: Ext.encode(idnomencladores),
                    pkid: _this.campoIdNomenclador,
                    modelo: _this.modelo,
                    habilitarentidad: valorUsar
                },
                method: 'POST',
                callback: function(o, s, r) {
                    var dataResp = Ext.decode(r.responseText);
                    Ext.getBody().unmask();
                    if (dataResp.success) {

                        msgUsar = (valorUsar == 1) ? 'lbMsgUsarCorrecto' : 'lbMsgNoUsarCorrecto';
                        mostrarMensaje(1, _this.idioma[msgUsar]);
                        if (typeof _fn == 'function') {
                            _fn.call();
                        }
                    } else {
                        msgUsar = (valorUsar == 1) ? 'lbMsgErrorUsar' : 'lbMsgErrorNoUsar';
                        mostrarMensaje(3, _this.idioma[msgUsar]);
                    }
                }
            });
        }
    },
});
