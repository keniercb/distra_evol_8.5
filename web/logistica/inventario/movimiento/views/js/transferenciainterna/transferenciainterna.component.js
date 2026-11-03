Ext.ns('LOG.inv.transferenciainterna');
LOG.inv.transferenciainterna.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    constructor: function (config) {
        var _this = this;
        this.listaAcciones = new LOG.util.List(config.acciones);
        LOG.util.UIManager.apply(config.idioma, LOG.inv.transferenciainterna.Idioma);
        LOG.inv.transferenciainterna.VentanaAdicionar.superclass.constructor.call(this, config);
    },

    builComponent: function () {

        this.idioma = this.idioma || LOG.lb.documento.Idioma;
        var _this = this;
        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            title: _this.idioma.tlPanelGeneral,
            frame: true,
            animCollapse: false,
            collapsible: true,
            collapsed: false,
            height: 200,
            width: 200,
            layout: 'fit',
            html: 'fit',
            split: true,
            titleCollapse: true
        });
        this.panelInferior = LOG.util.UIManager.initPanel({
            region: 'east',
            title:'Lote(s)',
            frame: true,
            animCollapse: false,
            collapsible: true,
            collapsed: true,
            width: 600,
            layout: 'fit',
            html: 'fit',
            minSize: 500,
            maxSize: 600,
            split: true,
            titleCollapse: true
        });

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            region: 'center',
            bodyBorder: false,
            frame: false
        });

        //Diseño de la ventana
        var superiorCentral = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var superiorWest = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        var superiorCentral2=LOG.util.UIManager.initColumnForm({
            columnas: 1
        });


        /*this.cbTipoTransferencia = new Ext.erp.comboNomenclador({
            fieldLabel: _this.idioma.lbCbTipoTransferenciaArea,
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTipotransfinterna',
            idnom: 'idtipotransfinterna',
            name: 'idtipotransfinterna',
            hiddenName: 'idtipotransfinterna',
            autoCargar: true,
            allowBlank: false,
            mode: 'remote',
            emptyText: _this.idioma.lbSeleccione,
            combo: true,
            listeners: {               
                select: function (_cb, _r) {
                    
                    _this.cbAreaOrigen.fireEvent('expand', _this.cbAreaOrigen);
                    _this.cbAreaOrigen.setValue(null);
                    _this.cbConceptoRetenido.setValue(null);
                    _this.cbAreaDestino.setValue(null);
    
                    _this.cbAreaDestino.disable();
                    _this.cbConceptoRetenido.disable();
                    _this.cbAreaOrigen.enable();
    
                    _this.cbAreaOrigen.getStore().load({
                        params:{
                            idtipotransfinterna: _this.cbTipoTransferencia.getValue()
                        }
                    });
                },
                'change': function(){
                    _this.cbAreaOrigen.fireEvent('expand', _this.cbAreaOrigen);
    
                    _this.cbAreaOrigen.setValue(null);
                    _this.cbConceptoRetenido.setValue(null);
                    _this.cbAreaDestino.setValue(null);
    
                    _this.cbAreaDestino.disable();
                    _this.cbConceptoRetenido.disable();
                    _this.cbAreaOrigen.enable();
                    _this.cbAreaOrigen.getStore().load({
                        params:{
                            idtipotransfinterna: _this.cbTipoTransferencia.getValue()
                        }
                    });
                }
            }
        });*/

        /*this.cbTipoTransferencia.getStore().on({
            'load': function(st, records, options) {
                if (records.length == 0) {
                    mostrarMensaje(3, 'Debe configurar el tipo de transferencia interna en nomencladores generales');  
                }
            }
        });


        this.cbTipoTransferencia.fireEvent = this.cbTipoTransferencia.fireEvent.createSequence(function(eventName){

        });*/

        /*_this.storigenDestino = new Ext.data.Store({
            url: 'cargarAreasOrigenDestino',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                    id: "idfila",
    
                    root: "datos"
                },
                [
                    {name: 'idfila'},
                    {name: 'text'},
                    {name: 'retenido'},
                    {name: 'iddeposorigen'},
                    {name: 'iddeposdestino'},
                ])
        });*/

        _this.cbAreaOrigen =  new LOG.util.SelectorTF({
            fieldLabel :_this.idioma.lbCbAreaOrigen,
            title :_this.idioma.lbCbAreaOrigen,
            emptyText: _this.idioma.lbSeleccione,
            url: 'cargarAreasOrigenDestino',
            controller : '',
            valueField : 'idfila',
            displayField : 'text',
            hiddenName : 'iddeposorigen',
            columns : [/*{
                    header : _this.idioma.cgCodigo,
                    dataIndex : 'codigo',
                    width : 250,
                    autoExpand : true
                },*/{
                    header : _this.idioma.lbCbAreaOrigen,
                    dataIndex : 'text',
                    width : 250,
                    autoExpand : true
                }
            ],
            listeners: {
                select: function (cmb) {
                    _this.listaBotones.getItem(2).enable();
                },
                render: function (cmb){
                    var record = _this.record;
                    if(record != null){
                        cmb.setValue(record.data.idareaorigen);
                        cmb.setRawValue(record.data.areaorigen);
                    }
                }

            }
        });

        _this.cbAreaDestino =  new LOG.util.SelectorTF({
            fieldLabel :_this.idioma.lbCbAreaDestino,
            title :_this.idioma.lbCbAreaDestino,
            emptyText: _this.idioma.lbSeleccione,
            url: 'cargarAreasOrigenDestino',
            controller : '',
            valueField : 'idfila',
            displayField : 'text',
            hiddenName : 'iddeposdestino',
            disabled: true,
            columns : [/*{
                    header : _this.idioma.cgCodigo,
                    dataIndex : 'codigo',
                    width : 250,
                    autoExpand : true
                },*/{
                    header : _this.idioma.lbCbAreaOrigen,
                    dataIndex : 'text',
                    width : 250,
                    autoExpand : true
                }
            ],
            listeners: {
                select: function (cmb) {
                    _this.listaBotones.getItem(2).enable();
                },
                render: function (cmb){
                    var record = _this.record;
                    if(record != null){
                        cmb.setValue(record.data.idareaorigen);
                        cmb.setRawValue(record.data.areaorigen);
                    }
                }
            }
        });

        /*_this.cbAreaOrigen = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbAreaOrigen,
            store: _this.storigenDestino,
            //url: 'cargarAreasOrigenDestino',
            name: 'iddeposorigen',
            hiddenName: 'iddeposorigen',
            valueField: 'idfila',
            displayField: 'text',
            editable: true,
            allowBlank: false,
            disabled: true,
            combo: true
        });*/

        _this.stOperacionOrigen = new Ext.data.Store({
            url: 'cargarOperacionesOrigen',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                    id: "idnomoperaciones",
                    root: "datos"
                },
                [
                    {name: 'idnomoperaciones'},
                    {name: 'denominacion'}
                ])
        });

        //sacar las operaciones del mismo combo que tiene documento de salida de operaciones 
        _this.cbOperacionOrigen = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbOperacionOrigen,
            store: _this.stOperacionOrigen,
            name: 'idoperacionorigen',
            hiddenName: 'idoperacionorigen',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            editable: true,
            allowBlank: true,
            disabled: false,
            //autoLoad:true,
            combo: true
        });

        _this.stOperacionDestino = new Ext.data.Store({
            url: 'cargarOperacionesDestino',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                    id: "idnomoperaciones",
                    root: "datos"
                },
                [
                    {name: 'idnomoperaciones'},
                    {name: 'denominacion'}
                ])
        });

        //sacar las operaciones del mismo combo que tiene documento de recepcion de operaciones
        _this.cbOperacionDestino = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbOperacionDestino,
            store: _this.stOperacionDestino,
            name: 'idoperaciondestino',
            hiddenName: 'idoperaciondestino',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            editable: true,
            allowBlank: true,
            disabled: false,
            combo: true
        });

        //   _this.cbConceptoRetenido = new Ext.erp.comboNomenclador({
        //     fieldLabel: _this.idioma.lbCbConceptoRetenido,
        //     controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
        //     modelo: 'NomConceptoRetenido',
        //     idnom: 'idconceptorete',
        //     name: 'idconcepretenido',
        //     hiddenName: 'idconcepretenido',
        //     autoCargar: true,
        //     allowBlank: false,
        //     editable: false,
        //     emptyText: _this.idioma.lbSeleccione,
        //     combo: true,
        //     disabled: true,
        //     listeners:{
        //     'focus' : function(){                    
        //         if (_this.cbConceptoRetenido.getStore().getCount() == 0) {
        //             mostrarMensaje(3, 'Debe configurar el concepto retenido en nomencladores generales');
        //         }
        //     }
        // }
        // });
        
        /*_this.cbAreaDestino = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbCbAreaDestino,
            //store: this.storDestino,
            store: _this.storigenDestino,
            //url: 'cargarAreasOrigenDestino',
            name: 'iddeposdestino',
            hiddenName: 'iddeposdestino',
            valueField: 'idfila',
            displayField: 'text',
            editable: true,
            allowBlank: false,
            disabled: true,
            combo: true,
            listeners:{
                'select':function(cmb, rec){
                    // console.info(rec);
                    if (_this.cbAreaOrigen.getValue() == cmb.getValue()) {
                        mostrarMensaje(3, _this.idioma.msgErrorSelecCombo);
                        cmb.reset();
                    }
    
                    if (rec.data.retenido == 1) {
                        _this.cbConceptoRetenido.enable();
                    } else {
                        _this.cbConceptoRetenido.disable();
                    }
                }
            }
        });*/

        // _this.cbMotivoDevolucion = new Ext.erp.comboNomenclador({
        //     fieldLabel: _this.idioma.lbCbMotivoDevolucion,
        //     controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
        //     modelo: 'NomMotivodevolucion',
        //     idnom: 'idmotivodevolucion',
        //     name: 'idmotivodevolucion',
        //     hiddenName: 'idmotivodevolucion',
        //     autoCargar: true,
        //     allowBlank: false,
        //     editable: false,
        //     disabled: true,
        //     emptyText: _this.idioma.lbSeleccione,
        //     combo: true,
        //     listeners:{
        //     'focus' : function(){                    
        //         if (_this.cbMotivoDevolucion.getStore().getCount() == 0) {
        //             mostrarMensaje(3, 'Debe configurar el motivo de devoluci\xf3n en nomencladores generales');
        //         }
        //     }
        // }
        // });
        /*_this.cbTipoTransferencia.getStore().on({
            'load': function (store) {
                if (_this.record && _this.record.data.idtipotransfinterna) {
                    _this.cbTipoTransferencia.setValue(_this.cbTipoTransferencia.getValue());
                    _this.cbTipoTransferencia.originalValue = _this.cbTipoTransferencia.getValue();
                }
            }
        });*/

        _this.cbAreaOrigen.on('change', function (field) {
            if (field.getValue()) {
                _this.cbAreaDestino.enable();
                //_this.cbAreaDestino.getStore().load();
            }
            if (_this.cbAreaDestino.getValue() == field.getValue()) {
                mostrarMensaje(3, _this.idioma.msgErrorSelecCombo);
                field.reset();
            }
        });

        _this.cbAreaOrigen.on('select', function (field, newValue, oldValue) {
            _this.cbAreaDestino.enable();
            //var bandera = false;
            
            if (_this.cbAreaDestino.getValue() == field.getValue()) {
                mostrarMensaje(3, _this.idioma.msgErrorSelecCombo);
                field.reset();
                //bandera = true;
            }/*
            if (!bandera) {
                var store = _this.gridProductosG.getStorePrincipal().data.items;
                var arrElimLogica = new Array();

                Ext.each(store, function (rec) {
                    arrElimLogica.push(rec.data);
                });

                if (arrElimLogica.length > 0) {
                    _this.modelo.eliminarProducto(arrElimLogica, function (e) {
                        _this.gridProductosG.getStorePrincipal().load();
                        _this.gridEntregaG.getStorePrincipal().load();
                    });
                }

            }*/
        });

        _this.cbAreaDestino.on('select', function (field, newValue, oldValue) {
            //_this.cbAreaDestino.enable();
            
            if (_this.cbAreaOrigen.getValue() == field.getValue()) {
                mostrarMensaje(3, _this.idioma.msgErrorSelecCombo);
                field.reset();
            }
        });
/*
        _this.cbAreaOrigen.store.on({
            'load': function (store) {
                if (_this.record && _this.record.data.iddeposorigen) {
                    _this.cbAreaOrigen.setValue(_this.cbAreaOrigen.getValue());
                }
            }
        });
*/
        /*_this.cbAreaDestino.store.on({
            'load': function (store) {
                if (_this.record && _this.record.data.iddeposdestino) {
                    _this.cbAreaDestino.setValue(_this.cbAreaDestino.getValue());
                }
            }
        });*/

        _this.cbOperacionOrigen.store.on({
            'load': function (store) {
                if (_this.record && _this.record.data.idoperacionorigen) {
                    _this.cbOperacionOrigen.setValue(_this.cbOperacionOrigen.getValue());
                }
            }
        });
/*
        _this.cbAreaDestino.getStore().on({
            beforeload: function (st) {
                st.baseParams.destino = "true";
            }
        });*/

        // _this.cbConceptoRetenido.store.on({
        //     'load': function (store) {
        //         if (_this.record && _this.record.data.idconcepretenido) {
        //             _this.cbConceptoRetenido.setValue(_this.cbConceptoRetenido.getValue());
        //             //_this.cbConceptoRetenido.setValue(_this.cbConceptoRetenido.getValue());
        //         }
        //     }
        // });

        // this.checkDevolucion = new Ext.form.Checkbox({
        //     fieldLabel: _this.idioma.lbCbDevolucion,
        //     name: 'devolucion',
        //     listeners: {
        //         'check': function (Checkbox, bool) {
        //             if (bool) {
        //                 _this.cbMotivoDevolucion.enable();
        //             } else {
        //                 _this.cbMotivoDevolucion.disable();
        //                 _this.cbMotivoDevolucion.setValue(null);
        //                 // _this.cbMotivoDevolucion.reset();

        //             }
        //         }
        //     }
        // });

        // _this.cbMotivoDevolucion.store.on({
        //     'load': function (store) {
        //         if (_this.record && _this.record.data.idmotivodevolucion) {
        //             _this.cbMotivoDevolucion.setValue(_this.cbMotivoDevolucion.getValue());
        //         }
        //     }
        // });

        this.taObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbObservaciones,
            name: 'observaciones',
            tabular: true,
            height: 70,
            minLength: 2,
            maxLength: 255,
            minLengthText: this.idioma.msjMinLengthText,
            maxLengthText: this.idioma.msjMaxLengthText,
            width: '98%',
            obs: true
        });
       // superiorWest.addComponent(_this.cbTipoTransferencia);
        superiorWest.addComponent(_this.cbAreaOrigen);
        superiorWest.addComponent(_this.cbAreaDestino);
        superiorWest.addComponent(_this.cbOperacionOrigen);
        superiorWest.addComponent(_this.cbOperacionDestino);
       // superiorWest.addComponent(_this.cbConceptoRetenido);
       // superiorWest.addComponent(this.checkDevolucion);
       // superiorWest.addComponent(_this.cbMotivoDevolucion);
        superiorCentral2.addComponent(this.taObservaciones);
        superiorCentral.addComponent(superiorWest);
        superiorCentral.addComponent(superiorCentral2);
        //superiorCentral.addComponent(superiorCentral2);
        

        this.formularioGeneral.add(superiorCentral);
        this.formularioGeneral.setHeight(150);
        this.gridProductosG = new LOG.inv.transferenciainterna.GridViewProducto({
            idioma: this.idioma,
            acciones: this.acciones,
            autoHeigth: true,
            region: 'center',
            gridEditable: true,
            iddeposorigen: undefined,
            autoLoad: true,
            scope: _this,
            initDefaultButtons: function () {
                //Botones de la ventana
                var _scope = this;

                this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
                    disabled: true,
                    tooltip: this.idioma.ttBtnProducto,
                    handler: function () {
                        var excluir = _this.gridProductosG.getStorePrincipal().collect('idproducto', false);
                        var iddeposorigen = -1;
                        if (_this.record) {
                            if (_this.cbAreaOrigen.getValue()) {
                                iddeposorigen = parseInt(_this.cbAreaOrigen.getValue());
                            } else {
                                iddeposorigen = parseInt((_this.record.data.iddeposorigen) ? _this.record.data.iddeposorigen : -1);
                            }

                        } else {
                            iddeposorigen = parseInt((_this.cbAreaOrigen.getValue()) ? _this.cbAreaOrigen.getValue() : -1);
                        }
                       // console.info(_this.scope)
                        var arrayNotInidnaturaleza = new Array();
                        arrayNotInidnaturaleza.push(-8,-7);
                        var _p = new LOG.lb.documento.VentanaProductos({
                            idioma: _this.idioma,
                            //excluir: excluir,
                            _parent: _scope,
                            usarFiltroArea: false,
                            usarFiltroDeposito: true,
                            modoSeleccion:3,
                            parametros: {
                                idestructura:_this.cbAreaOrigen.getValue(),
                                idseleccionados: Ext.encode(_scope.getStorePrincipal().collect('idproducto')),
                                iddocumento: _this.modelo.iddocumento || -1,
                                conexistencia:1,
                                condisponible:1,
                                //idnaturaleza: (_this.record && _this.record.data.tipodestino == 4) ? -5 : 0,
                                //idnaturalezaexcluir: (_this.record && _this.record.data.tipodestino == 4) ? arrayNotInidnaturaleza : 0,
                                asentado: -1
                            // tipoproducto: "[1, 4]"
                        },
                        doAction: function (r) {console.log(r);
                            var _t = this;
                           //console.info(r);
                           //console.info(_this.scope.winGestionarDocumento )
                            if (_this.scope.winGestionarDocumento != undefined) {
                                var arrayProd = new Array();
                                var params = {};
                                Ext.each(r, function (rec) {
                                   // excluir.push(rec.data.idproducto); 
                                    arrayProd.push(rec.data);
                                });
                                _t.getStorePrincipal().remove(r);
                                params['productos'] = Ext.encode(arrayProd);
                                if (_this.modelo.iddocumento == null) {
                                    _this.modelo.salvar({
                                        idestructuracomun: _this.idDeposito,
                                        idproductos: Ext.encode(arrayProd)
                                    }, function (resp) {
                                        _t.postSalvar.createDelegate(_this.winGestionarDocumento, [resp]).call();
                                    });
                                } else {
                                    params['iddocumento']=_this.record.data.iddocumento;
                                    _this.modelo.adicionarProductosTransfInterna(params, _this.gridProductosG.getStorePrincipal(),function (resp) {
                                        _t.postSalvar.createDelegate(_this.winGestionarDocumento, [resp]).call();
                                    });
                                    
                                }
                                   /* Ext.each(r, function (rec) {
                                        excluir.push(rec.data.idproducto);
                                   
                                    });
                                    _t.getStorePrincipal().remove(r);
                                    console.info(_t.getStorePrincipal().find(r));
                                    _t.getStorePrincipal().reload();
                    }
                                    //_t.getStorePrincipal().load;
                                    
                                    _this.modelo.adicionarMovimientos({
                                        idproductos: Ext.encode(_productos)
                                    }, function (resp) {
                                        _t.postSalvar.createDelegate(_this.winGestionarDocumento, [resp]).call();
                                    });*/
                                }
                            
                        },
                       postSalvar: function (r) {
                            _this.winGestionarDocumento.record.data.cantproductos = r.cantproductos;
                            _p.getStorePrincipal().reload({params: {iddocumento: r.iddocumento}});
                            _p.reiniciarBusqueda();
                            _this.habilitarElementos();
                        }

                    });
                    _p.init();
                   var vistaProductos=_p.view();
                   vistaProductos.show();

                   /* _p.postSalvar = _p.postSalvar.createSequence(function (r) {
                        _this.winGestionarDocumento.record.data.cantproductos = r.cantproductos;
                        _p.getStorePrincipal().initBaseParams.iddocumento = _this.modelo.iddocumento;
                        _p.reiniciarBusqueda();
                        _this.habilitarElementos();
                    });
                   _p.init();
                   var vistaProductos=_p.view();
                   _p.getVistaPrincipal().aceptarFn= function () {
                    console.info(_p.view());   
                    var selections = _p.getSmPrincipal().getSelections();
                    var arrayProd = new Array();
                    var params = {};
                    Ext.each(selections, function (b) {
                        arrayProd.push(b.data);
                    });
                    params['productos'] = Ext.encode(arrayProd);
                    if (_this.record) {
                        params['iddocumento'] = _this.record.data.iddocumento;
                    } else {
                        params['iddocumento'] = _this.gridProductosG.recordDoc.iddocumento
                    }
                    _this.modelo.adicionarProductosTransfInterna(params, _this.gridProductosG.getStorePrincipal());
                    Ext.each(selections, function (rec) {
                        _p.excluir.push(rec.data.codigo);
                    });
                    _p.getStorePrincipal().remove(selections);
                };
                _p.getStorePrincipal().load();
                //ventanaSelec.getStorePrincipal().load();

                    //_p.tipoProducto.disable();
                    vistaProductos.show();*/
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                            b.setVisible(true);
                        } else b.setVisible(false);


                        if (this.scope.record && this.scope.record.data.estado == 1 && this.scope.scope.winMod) {
                            b.enable();
                        } else
                            b.disable();

                    }
                }));
                this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
                    disabled: true,
                    tooltip: this.idioma.ttBtnEliminarProd,
                    handler: function () {
                        var selections = _this.gridProductosG.getSmPrincipal().getSelections();
                        var arrElimLogica = new Array();
                        Ext.each(selections, function (rec) {
                            //si esta en la bd guardado

                            if (rec.data.codigo) {
                                arrElimLogica.push(rec.data);
                            }
                        });


                        if (arrElimLogica.length > 0) {
                            mostrarMensaje(2, "\xbfEst\xe1 seguro que desea eliminar el(los) dato(s) seleccionado(s)\x3f", function (btn) {
                                if (btn == 'ok') {
                                    //_this.gridProductosG.getStorePrincipal().remove(selections);
                                    _this.modelo.eliminarProducto(arrElimLogica, function (d) {
                                        _this.gridProductosG.getStorePrincipal().load();
                                        _this.gridEntregaG.getStorePrincipal().load();
                                    });
                                }
                            });
                        } else {
                            _this.gridProductosG.getStorePrincipal().remove(selections);
                            mostrarMensaje(1, "Los productos han sido eliminados satisfactoriamente.");
                        }

                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                            b.setVisible(true);
                        } else b.setVisible(false);
                    }
                }));
                this.addToolbarButton(LOG.util.UIManager.createBtn({
                    text: _this.idioma.desubicar,
                    tooltip: '',
                    iconCls: 'ajustar',
                    //disabled: true,
                    handler: function () {
                        LOG.inv.ubicacion.Loader.init(function () {
                            this.winUbicaciones = new LOG.lb.ubicacion.proceso({
                                cantidadAlternativa: true,
                                idioma: _this.idioma,
                                record: _this.gridProductosG.getGridPrincipal().getSelectionModel().getSelected().json,
                                desubicar: true
                            });
                            this.winUbicaciones.init();
                            this.winUbicaciones.view();
                        });
                    },
                    controlFn: function (b, _caller) {
                        if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                            b.show();
                            LOG.util.UIManager.encadenaFn(_this.gridProductosG.getGridPrincipal().getSelectionModel(), 'fireEvent', function (e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() == 1 && _this.record && _this.record.data.estado == 1 && !this.getSelected().json.ubicacionunica /*&& ((this.getSelected().data.existencia) - (this.getSelected().data.cantidad) != 0)*/) {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'ajustar');
                        } else {
                            b.hide();
                        }
                    }
                }));
                /*this.addToolbarButton(LOG.util.Prototipos.botonNuevo({
                    tooltip: this.idioma.ttBtnLote,
                    iconCls: 'lote',
                    text: this.idioma.btnLote,
                    scope: this,
                    handler: function(){

                    },
                    controlFn: function() {
                        //_this.controlFnGuardar(_this.btnNuevo, true);
                    }
                }));*/

            }
        });
        this.gridProductosG.init();
        this.panelGridProductosG = this.gridProductosG.view();

        this.gridEntregaG = new LOG.inv.transferenciainterna.GridEntrega({
            idioma: this.idioma,
            acciones: this.acciones,
            autoHeigth: true,
            region: 'center',
            gridProductosG: _this.gridProductosG,
            scope: this,
            initDefaultButtons: function () {
                //Botones de la ventana
                var _scope = this;

                _scope.btnAdicionarLote = new LOG.util.Prototipos.botonAdicionar({
                    disabled: true,
                    tooltip:this.idioma.ttBtnLote,
                    handler: function () {
                        var producto = _this.gridProductosG.getSmPrincipal().getSelected();

                        var last = _this.gridProductosG.getSmPrincipal().last;

                        if (producto.data.idtransfinterna) {
                            var excluir = _this.gridEntregaG.getStorePrincipal().collect('idlote', false);

                            _scope.gridLote = new LOG.inv.transferenciainterna.GridLote({
                                idioma: _this.idioma,
                                text: 'Lote',
                                excluir: excluir,
                                idproducto: producto.data.idproducto,
                                idtransfinterna: producto.data.idtransfinterna
                            });

                            _scope.gridLote.init();
                            _scope.gridLote.getVistaPrincipal().title = 'Seleccionar lote';
                            _scope.gridLote.getVistaPrincipal().width = 900;
                            _scope.gridLote.getVistaPrincipal().height = 500;
                            _scope.gridLote.getVistaPrincipal().constrain = true;
                            _scope.gridLote.getVistaPrincipal().resizable = false;
                            _scope.gridLote.view();

                            _scope.gridLote.vistaPrincipal.listaBotones.getItem(1).disable();
                            _scope.gridLote.vistaPrincipal.listaBotones.getItem(2).disable();
                            _scope.gridLote.getVistaPrincipal().aceptarFn = function () {
                                var registred = true;
                                _scope.gridLote.getSmPrincipal().each(function (lote) {
                                    if (lote.data.cantpasar) {
                                    } else {
                                        registred = false;
                                    }
                                });
                                if (registred) {
                                    var modified = [];
                                    var modifiedrecord = _scope.gridLote.getStorePrincipal().getModifiedRecords();
                                    console.log(modifiedrecord);
                                    _scope.gridLote.getVistaPrincipal().getEl().mask();
                                   /* _scope.gridLote.getSmPrincipal().each(function (rec) {
                                        _scope.gridLote.excluir.push(rec.data.idlote);
                                        modified.push(rec.data);
                                    });*/
                                   Ext.each( modifiedrecord,function (rec) {
                                       _scope.gridLote.excluir.push(rec.data.idlote);
                                       modified.push(rec.data);
                                    });
                                    //_this.gridEntregaG.btnGuardarLote.enable();
                                    _this.gridEntregaG.btnEliminarLote.disable();
                                    _this.modelo.guardarLote({
                                        record: Ext.encode(modified),
                                        iddocumento: _this.record.data.iddocumento,
                                        idprodtransfinterna: producto.data.idprodtransfinterna
                                    }, function () {
                                        _this.gridProductosG.getStorePrincipal().load({
                                            callback: function () {
                                                _this.gridProductosG.getSmPrincipal().selectRow(last);
                                                _scope.gridLote.getStorePrincipal().load({
                                                    callback: function () {
                                                        _scope.gridLote.getVistaPrincipal().getEl().unmask();
                                                    }
                                                });
                                            }
                                        });
                                    });
                                } else {
                                    mostrarMensaje(3, 'Existen lotes sin cantidades registradas.');
                                    _scope.gridLote.show();
                                }
                            };
                        } else {
                            mostrarMensaje(3, "Se necesita guardar para realizar este acción");
                        }
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                            b.setVisible(true);
                        } else b.setVisible(false);
                        b.disable();
                        _this.gridProductosG.getGridPrincipal().getSelectionModel().fireEvent = _this.gridProductosG.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {

                            if (e == 'selectionchange') {
                                if (this.getCount() == 1) {
                                    b.enable();
                                    if (_this.record && _this.record.data.estado == 1)
                                        b.enable();
                                    else
                                        b.disable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    }
                });
                this.addToolbarButton(_scope.btnAdicionarLote);

                _scope.btnEliminarLote = new LOG.util.Prototipos.botonEliminar({
                    tooltip:this.idioma.ttBtnEliminarLote,
                    handler: function () {
                        mostrarMensaje(2, "\xbfEst\xe1 seguro que desea eliminar el(los) dato(s) seleccionado(s)\x3f", function (btn) {
                            if (btn == 'ok') {
                                var producto = _this.gridProductosG.getSmPrincipal().getSelected();
                                var last = _this.gridProductosG.getSmPrincipal().last;
                                var selections = _this.gridEntregaG.getSmPrincipal().getSelections();
                                var arrLoteDel = new Array();
                                var parametros = new Array();
                                
                                Ext.each(selections, function (rec) {                                 //si esta en la bd guardado

                                    if (rec.data.idtransfinternalote) {
                                        arrLoteDel.push(rec.data.idtransfinternalote);
                                    }
                                });
                                _this.gridEntregaG.getStorePrincipal().remove(selections);
                                if (arrLoteDel.length > 0) {
                                    Ext.MessageBox.wait("Eliminando datos", "Por favor espere..." || '...');
                                    //pasar parametros
                                    parametros = {
                                        arrLoteDel: Ext.encode(arrLoteDel),
                                        idprodtransfinterna: producto.data.idprodtransfinterna
                                    }
                                    _this.modelo.eliminarLote(parametros, function (response) {
                                        _this.gridProductosG.getStorePrincipal().load({
                                            callback: function () {
                                                _this.gridProductosG.getSmPrincipal().selectRow(last);
                                            }
                                        });
                                    });
                                } else {
                                    // mostrarMensaje(1, "Los productos han sido eliminados satisfactoriamente.");
                                }
                            }
                        });
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                            b.setVisible(true);
                        } else b.setVisible(false);
                        b.disable();
                        _this.gridProductosG.getGridPrincipal().getSelectionModel().fireEvent = _this.gridProductosG.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {

                            }
                        });
                    }
                });

                this.addToolbarButton(_scope.btnEliminarLote);
               /* this.addToolbarButton(_scope.btnAnterior = LOG.util.Prototipos.botonGeneral({
                    text: LOG.util.Idioma.lbBtnAnterior,
                    iconCls: 'anterior',
                    disabled: true,
                    handler: function () {
                        _this.gridProductosG.getSmPrincipal().selectPrevious();
                    },
                    controlFn: function (b, _caller) {
                        _this.gridProductosG.getGridPrincipal().getSelectionModel().fireEvent = _this.gridProductosG.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                b.setDisabled(this.getCount() == 0);
                            }
                        });
                    }
                }));
                this.addToolbarButton(_scope.btnSiguiente = LOG.util.Prototipos.botonGeneral({
                    text: LOG.util.Idioma.lbBtnSiguiente,
                    iconCls: 'siguiente',
                    disabled: true,
                    handler: function () {
                        _this.gridProductosG.getSmPrincipal().selectNext();
                    },
                    controlFn: function (b, _caller) {
                        _this.gridProductosG.getGridPrincipal().getSelectionModel().fireEvent = _this.gridProductosG.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                b.setDisabled(this.getCount() == 0);
                            }
                        });
                    }
                }));*/
                _scope.btnGuardarLote = new LOG.util.Prototipos.botonGuardar({
                    handler: function () {
                        var recorddata = new Array();
                        var record = _this.gridEntregaG.getStorePrincipal().getModifiedRecords();

                        Ext.each(record, function (e) {
                            recorddata.push(e.data)
                        });

                        _this.modelo.guardarLote({
                            record: Ext.encode(recorddata),
                            iddocumento: _this.record.data.iddocumento
                        });
                        _this.gridEntregaG.getStorePrincipal().commitChanges();
                        _this.gridEntregaG.getStorePrincipal().load();
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RGuardar')) {
                            b.setVisible(true);
                        } else b.setVisible(false);
                        b.disable();
                        _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'change' || e == 'add' || e == 'remove' || e == 'load') {
                                if (this.getCount() >= 1) {
                                    var recProdSelect = _this.gridProductosG.getGridPrincipal().getSelectionModel().getSelected();
                                    if (_this.record && _this.record.data.estado == 1)
                                        b.enable();
                                    else
                                        b.disable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    }
                })
                // this.addToolbarButton(_scope.btnGuardarLote);
            }
        });
        this.gridEntregaG.init();
        this.panelGridEntregaG = this.gridEntregaG.view();
        this.panelInferior.add(this.panelGridEntregaG);

        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            handler: function () {
                console.info("primero");
                _this.salvarHandlerTransInterna();                
            },
            scope: this,
            controlFn: function () {
                _this.controlFnGuardar(_this.btnSalvar);
            }
        });
        this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            tooltip: 'this.idioma.ttBtnNuevo',
            handler: this.onResetHandler,
            scope: this,
            controlFn: function () {
                _this.controlFnGuardar(_this.btnNuevo, true);
            }
        });
        this.btnCerrar = LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            text: 'this.idioma.lbBtnCerrar',
            scope: this
        }, true);

        this.modelo.addActionButton(this.btnSalvar);
        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            layout: 'border',
            items: [this.panelSuperior, this.panelGridProductosG, this.panelInferior/*,this.panelContenedorGrids*/],
            buttons: [this.btnCerrar, this.btnSalvar]
        });
        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
        this.fireEvent = this.fireEvent.createSequence(function (e) {
            if (e == 'resize') {
                _this.definirAltura();
            }
        });
    },
    onRenderHandler: function () {
        LOG.util.UIManager.applyKey(this.btnSalvar, this);
        LOG.util.UIManager.applyKey(this.btnCerrar, this);
        //LOG.util.UIManager.applyKey(this.btnNuevo, this);

    },
    initDefaultColumns: function () {
    },
    habilitarBtn: function () {
        Ext.each(this.fromularioGestion.getForm().items.items, function (e) {
            if (e.combo) {
                if (e.hiddenName == "idmotivodevolucion" && !e.getValue() || e.hiddenName == "idconcepretenido" && !e.getValue()) {
                    e.disable();
                } else {
                    e.enable();
                }
            } else {
                e.enable();
            }
        });


        this.gridProductosG.listaBotones.getItem(0).enable();
        this.gridProductosG.listaBotones.getItem(1).enable();

        this.gridEntregaG.listaBotones.getItem(0).enable();
        this.gridEntregaG.listaBotones.getItem(1).enable();
    },
    desHabilitarBtn: function () {

        Ext.each(this.fromularioGestion.getForm().items.items, function (e) {
            e.disable();
        });
        this.gridProductosG.listaBotones.getItem(0).disable();
        this.gridProductosG.listaBotones.getItem(1).disable();

        this.gridEntregaG.listaBotones.getItem(0).disable();
        this.gridEntregaG.listaBotones.getItem(1).disable();


    },
    initDefaultButtons: function () {
        //Botones de la ventana
        var _this = this;
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonEliminar({
            handler: function () {
                _this.modelo.eliminar({id: _this.record.data.iddocumento}, function () {
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.record = null;
                    _this.onResetHandler;
                    _this.controlBtns();
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                if (_caller.record && _caller.record.data.estado == 1) {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));

        this.addToolbarButtonVentana(LOG.util.Prototipos.botonConfirmar({
            text: 'Confirmar',
            tooltip:_this.idioma.ttBtnConfirmar,
            handler: function () {
                Ext.MessageBox.wait('Validando datos', _this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: 'getValidarConfirmar',
                    method: 'POST',
                    params: {
                        iddocumento: _this.record.data.iddocumento
                    },
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (resp.msg == 1) {
                                mostrarMensaje(3, 'El documento que desea confirmar no contiene productos.');//para cuando no hay productos
                            }
                            if (resp.msg == 2) {
                                mostrarMensaje(3, 'Existen productos sin cantidades registradas.');// para cuando no tienen lotes los productos
                            }
                            if (resp.msg == 0) {
                                _this.modelo.confirmar({iddocumento: _this.record.data.iddocumento}, function () {
                                    _this.getTitleDocumento(_this.record.data.iddocumento);
                                    _this.record.data.estado = 2;
                                    _this.controlBtns();
                                    _this.desHabilitarBtn();
                                    var cGdSouth = _this.gridEntregaG;
                                    var cm = _this.gridEntregaG.gpPrincipal.getColumnModel();//cGdSouth.getColumnModel();
                                    cm.setEditable(6, false);
                                });
                            }
                        }
                    }

                });
            }/*handler: function () {

                if (_this.record.data.estado == 1) {
                    if (_this.gridProductosG.storePrincipal.data.length == 0) {
                        mostrarMensaje(3, 'El documento que desea confirmar no contiene productos.');//para cuando no hay productos
                    } else {
                        var bandera = false;
                        Ext.each(_this.gridProductosG.storePrincipal.data.items, function (e) {
                            if (e.data.cantidad == 0) {
                                bandera = true;
                            }
                        });
                        if (bandera) {
                            mostrarMensaje(3, 'Existen productos sin cantidades registradas.');// para cuando no tienen lotes los productos
                        } else {
                            _this.modelo.cargarLote(_this.gridProductosG.idtransfinterna, function (d) {
                                var banderaaux = false;
                                Ext.each(d, function (x) {
                                    if (x.cantpasar == 0) {
                                        banderaaux = true;
                                    }
                                });
                                if (banderaaux) {
                                    mostrarMensaje(3, 'Existen productos sin cantidades registradas.');// para cuando no tienen cantidades los lotes
                                } else {
                                    _this.modelo.confirmar({iddocumento: _this.record.data.iddocumento}, function () {
                                        _this.getTitleDocumento(_this.record.data.iddocumento);
                                        _this.record.data.estado = 2;
                                        _this.controlBtns();
                                        _this.desHabilitarBtn();
                                        var cGdSouth = _this.gridEntregaG;
                                        var cm = _this.gridEntregaG.gpPrincipal.getColumnModel();//cGdSouth.getColumnModel();
                                        cm.setEditable(6, false);
                                    });
                                }
                            });

                        }
                    }
                }

            }*/,
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                if (_caller.record && _caller.record.data.estado == 1) {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            text: 'Anular estado',
            tooltip:this.idioma.ttBtnAnular,
            handler: function () {

                _this.modelo.anularestado({iddocumento: _this.record.data.iddocumento}, function () {
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.record.data.estado = 1;
                    _this.controlBtns();
                    _this.habilitarBtn();
                    // _this.gridEntregaG.gridEditable = true;
                    var cGdSouth = _this.gridEntregaG;
                    var cm = _this.gridEntregaG.gpPrincipal.getColumnModel();//cGdSouth.getColumnModel();
                    cm.setEditable(6, true);

                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                if (_caller.record && _caller.record.data.estado == 2) {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonAprobar({
            text: 'Aprobar',
            tooltip:this.idioma.ttBtnAprobar,
            handler: function () {

                _this.modelo.aprobar({iddocumento: _this.record.data.iddocumento}, function () {

                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.record.data.estado = 3;
                    _this.controlBtns();
                    _this.desHabilitarBtn();
                    /*if (this.record.data.estado == 3) {
                        _this.listaBotonesVentana.getItem(3).disable();
                    }*/
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                if (_caller.record && _caller.record.data.estado == 2) {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));

    },
    definirAltura: function () {
        var alto = this.getHeight() - 126;
        var altoInferior = alto - 150;
        // this.panelContenedorGrids.setHeight(altoInferior);
        // this.panelGridProductosG.setHeight((altoInferior-5)/2);
        //  this.panelInferior.setHeight((altoInferior-5)/2);
        // this.panelGridEntregaG.setHeight((altoInferior-5)/2);
    },
    prepareDocModify: function (d, noCargar) {
        var _this = this;
        this.fromularioGestion.getForm().loadRecord(d);
        this.gridProductosG.idtransfinterna = d.data.iddocumento;
        this.gridProductosG.getStorePrincipal().load();
        if (!noCargar) {
            this.modelo.loadRecord();
        }
        this.record = d;
        this.getTitleDocumento(this.record.data.iddocumento);
        this.getHabilitarDesabilitarAbrir();
        _this.cbAreaOrigen.setRawValue(this.record.data.areaorigen);
        _this.cbAreaDestino.setRawValue(this.record.data.areadestino);
        //_this.cbOperacionOrigen.setRawValue(this.record.data.);
        //_this.cbOperacionDestino.setRawValue(this.record.data.);

    },
    ocultarColumna: function () {

    },
    salvarHandlerTransInterna: function (params) {
        params = params || {};
        var _this = this.scope || this;
       
        if(this.gridProductosG.getStorePrincipal().getModifiedRecords().length > 0){
            //var recProductSelect = this.gridProductosG.getStorePrincipal().getModifiedRecords()
            params['productos'] = Ext.encode(this.gridProductosG.getRecordsToSave());
        }
        /*console.info(this.gridProductosG.getGridPrincipal().getSelectionModel().getSelected());
        console.info(this.gridProductosG.getStorePrincipal().getModifiedRecords());
        console.info(this.gridProductosG.getRecordsToSave());*/
        
        if (this.gridEntregaG.storePrincipal.data.length > 0 && this.gridEntregaG.getStorePrincipal().getModifiedRecords().length > 0) {

            var recProductSelect = this.gridProductosG.getGridPrincipal().getSelectionModel().getSelected();
            params['lote'] = Ext.encode(this.gridEntregaG.getRecordsToSave());
            params['idprodtransfinterna'] = recProductSelect.data.idprodtransfinterna;
            //params['cantidad'] = recProductSelect.data.cantidad;
        }
        
        _this.modelo.salvar(params, function (r) {

            _this.idtransfinterna = r.datos.iddocumento;
            _this.winGestionarDocumento.gridProductosG.idtransfinterna = r.datos.iddocumento;
            if (_this.winGestionarDocumento.gridEntregaG.getStorePrincipal().getModifiedRecords().length > 0) {
                // _this.winGestionarDocumento.gridEntregaG.getStorePrincipal().load();
                //_this.winGestionarDocumento.gridProductosG.getStorePrincipal().load();
            }
            _this.winGestionarDocumento.gridProductosG.getStorePrincipal().load();

            _this.winGestionarDocumento.gridProductosG.listaBotones.getItem(0).enable();
            _this.tipoVentana = 2;

            // if (_this.record == null) {
            _this.record = {};
            Ext.apply(_this.record, {
                data: {
                    iddocumento: r.datos.iddocumento,
                    estado: "1"
                }
            });

            // }
            _this.winGestionarDocumento.listaBotonesVentana.getItem(1).enable();
            _this.winGestionarDocumento.listaBotonesVentana.getItem(0).enable();
            _this.winGestionarDocumento.gridProductosG.scope.record = _this.record;
            _this.winGestionarDocumento.gridEntregaG.scope.record = _this.record;


            _this.winGestionarDocumento.getTitleDocumento(r.datos.iddocumento);
            _this.listaBotonesVentana.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);
        });
    },
    controlBtns: function () {
        var _this = this;
        _this.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_this, [b, _this]).call();
            }
        }, _this);
    },
    grantedAction: function (idAccion) {
        var existe = false;
        this.listaAcciones.each(function (a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    onResetHandler: function () {
        var _this = this.scope || this;
        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.fromularioGestion.getForm()._record = null;
            _this.gridProductosG.getStorePrincipal().removeAll();
            _this.gridEntregaG.getStorePrincipal().removeAll();
            _this.record = null;
            _this.setTitle(_this.idioma.tlAdicionar);
            _this.onShowHandler();
            _this.modelo.gridEditado = false;
        }
    },
    onCloseHandler: function (p) {
        var _this = this;
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
            _this.gridProductosG.getStorePrincipal().removeAll();
            _this.gridEntregaG.getStorePrincipal().removeAll();
            _this.modelo.gridEditado = false;
            _this.getHabilitarDesabilitarNuevo();

        }
        if (_this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento) {
            var id = _this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento;
            _this.modelo.cargaInicial({
                cargando: true,
                url: '/logistica/utiles/documento/index.php/desbloqueo/desbloquearDocumento',
                id: Ext.encode([id])
            });
        }
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    getHabilitarDesabilitarNuevo: function () {
        var _this = this;
        _this.scope.winGestionarDocumento.gridProductosG.listaBotones.getItem(0).disable();
        _this.scope.winGestionarDocumento.gridProductosG.listaBotones.getItem(1).disable();
        _this.scope.winGestionarDocumento.gridEntregaG.listaBotones.getItem(0).disable();
        _this.scope.winGestionarDocumento.gridEntregaG.listaBotones.getItem(1).disable();
        /*Ext.each(_this.fromularioGestion.getForm().items.items, function (e) {
            if (e.combo) {
                if (e.hiddenName == 'idtipotransfinterna') {
                    e.enable();
                } else {
                    e.disable();
                }
            } else {
                e.enable();
            }

        });*/
    },
    getHabilitarDesabilitarAbrir: function () {
        var _this = this;
        
        if (_this.record.data.estado == 1 || !_this.record) {
            _this.scope.winGestionarDocumento.gridProductosG.listaBotones.getItem(0).enable();
            Ext.each(_this.fromularioGestion.getForm().items.items, function (e) {
                if (e.combo) {
                    if (_this.record.data.idtipotransfinterna != "" && e.hiddenName == 'idtipotransfinterna') {
                        e.enable();
                    }
                    if (_this.record.data.iddeposorigen != "" && e.hiddenName == 'iddeposorigen') {
                        e.getStore().load({
                            params: {
                                idtipotransfinterna: _this.record.data.idtipotransfinterna
                            }
                        });
                        e.enable();
                    }
                    if (_this.record.data.idmotivodev != "" && e.hiddenName == 'idmotivodev') {
                        e.enable();
                        e.getStore().load();
                    }
                    if (_this.record.data.iddeposdestino != "" && e.hiddenName == 'iddeposdestino') {
                        e.enable();
                    }
                    if (_this.record.data.idconcepretenido != "" && e.hiddenName == 'idconcepretenido') {
                        e.enable();
                    }
                    
                    if (e.hiddenName == 'idoperaciondestino') {
                        e.enable();
                    }
                    if (e.hiddenName == 'idoperacionorigen') {
                        e.enable();
                    }
                } else {
                    e.enable();
                }

            });
        } else {
            // _this.scope.winGestionarDocumento.gridProductosG.listaBotones.getItem(1).enable();
            Ext.each(_this.fromularioGestion.getForm().items.items, function (e) {
                e.disable();
                /* if (e.combo) {
                     if (e.hiddenName == 'iddeposorigen') {
                         e.getStore().load({
                             params:{
                                 idtipotransfinterna:_this.record.data.idtipotransfinterna
                             }
                         });
                     }  else {
                         e.getStore().load();
                     }
                 }*/
            });
        }
    },
    cargarProductos: function () {

    }
});

LOG.inv.transferenciainterna.GridViewProducto = Ext.extend(LOG.util.UITemplate, {
    idtransfinterna: undefined,
    recordDoc: undefined,
    constructor: function (config) {
        this.busquedaBasica = false;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 3;
        this.scope = config.scope;
        this.dirController = '/logistica/inventario/movimiento/index.php/transferenciainterna';
        config.urlBusquedaGridPrincipal = 'cargarProductosTransferanciaInterna';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.inv.transferenciainterna.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.gridEditable = true;
        LOG.inv.transferenciainterna.GridViewProducto.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        /*this.addGridColumn({
            dataIndex: 'idprodtransfinterna',
            hidden: true
        });*/

        this.addGridColumn({
            dataIndex: 'idprodtransfinterna',
            hidden: true
        });

        this.addGridColumn({
            dataIndex: 'idtransfinterna',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idmovimiento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idnaturaleza',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'tienelote',
            hidden: true
        });
        this.addGridColumn({
            header: 'Desubicar',
            width: 80,
            align: 'center',
            dataIndex: 'ubicacionunica',
            editor: null,
            renderer: function(v, m, rd) {
                if (!rd.json.ubicacionunica)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
            }
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            width: 120,
            filter: {
                type: 'string',
                dataIndex: 'codigo'
            }
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            width: 200,
            autoExpand: true,
            id: 'denominacion',
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });

        if(farmacia == 1){
            this.addGridColumn({
                dataIndex: 'naturaleza',
                header: 'Naturaleza',
                width: 100,
                agrupador: true
            });
            this.addGridColumn({
                dataIndex: 'presentacion',
                header: this.idioma.cgPresentacion,
                width: 100
                // editor: new Ext.form.DateField({}),
                /* renderer:function(value , c , record){
                     return _this.formatDate(value, c , record)
                 },*/
            });
        }
    
        this.addGridColumn({
            dataIndex: 'um',
            header: this.idioma.cgUM,
            align: 'center',
            width: 50
            // editor: new Ext.form.DateField({}),
            /*renderer:function(value , c , record){
                return _this.formatDate(value, c , record)
            }*/
        });

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'cantidad',
            header: this.idioma.lbCantidad,
            align: 'right',
            id:'cantidad',
            /* renderer:function(value , c , record){
                    return _this.formatDate(value, c , record)
                },*/
            width: 100
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'existencia',
            align: 'right',
            header: this.idioma.cgExistencia,
            width: 100
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'disponible',
            align: 'right',
            header: this.idioma.cgDisponible,
            width: 100
        }));
        /*this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'precioventa',
            header: this.idioma.cgPrecioVenta,
            width: 100
        }));*/
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'precio',
            align: 'right',
            header: this.idioma.cgPreciocosto,
            width: 100
        }));
       /* this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'importeventa',
            header: this.idioma.cgImporteVenta,
            width: 100
        }));*/
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'importe',
            align: 'right',
            header: this.idioma.cgImporteCosto,
            width: 100
        }));
    },
    render: function () {
        var _this = this;
         //var record = (_this.scope.scope.smGridPrincipal.selections.items[0].data) ? _this.scope.scope.smGridPrincipal.selections.items[0].data: false;

        var vista = LOG.inv.transferenciainterna.GridViewProducto.superclass.render.call(this);
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            if (e == 'afteredit') {
                if (obj.field == 'cantidad') {
                    /*if (obj.record.data.cantidad < obj.value) {
                        obj.value = obj.originalValue;
                        obj.record.dirty = false;
                        obj.record.data.cantpasar = obj.record.json.cantpasar;
                        obj.cancel = true;
                        _this.gpPrincipal.getView().refresh();
                        mostrarMensaje(3, 'La cantidad a pasar no puede ser mayor a la existencia.');

                    } else {*/
                        if (_this.scope.record && _this.scope.record.data.estado == 1)
                            _this.scope.modelo.gridEditado = true;
                        
                        if (_this.scope.modelo.isValid()) {
                            _this.scope.modelo.habilitarBotones();
                        } else {
                            _this.scope.modelo.habilitarBotones(true);
                        }
                    //}
                }
            }
            
            /*if (e == 'beforeedit') {
                if (obj.field == 'cantidad') {
                    if (_this.scope.record && _this.scope.record.data.estado != 1)
                    _this.scope.modelo.gridEditado = false;
                }
            }*/
        });

        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                if (_this.idtransfinterna && !_this.scope.scope.winMod) {
                    obj.params.idtransfinterna = (_this.idtransfinterna) ? _this.idtransfinterna : -1;
                }
                if (_this.idtransfinterna && _this.scope.scope.winMod) {
                    obj.params.idtransfinterna = _this.idtransfinterna;
                }
                obj.params.iddeposorigen = (_this.scope.cbAreaOrigen.getValue()) ? _this.scope.cbAreaOrigen.getValue() : -1;
            },
            load: function (st, record, obj){
                if(record.length > 0){
                    _this.scope.cbAreaOrigen.disable();
                }

            }
        });

        this.getSmPrincipal().on(
            'rowselect', function (sm, index) {
                var record = sm.getSelected();
                _this.scope.gridEntregaG.getStorePrincipal().load({
                    params: {
                        iddocumento: (sm.getSelections().length > 1) ? -1 : _this.idtransfinterna,
                        idproducto: (sm.getSelections().length > 1) ? -1 : record.data.idproducto
                    }
                });

                if (sm.hasSelection() && _this.scope.record.data.estado == 1) {
                    _this.listaBotones.getItem(1).enable();
                }

                if (record && record.data.idtransfinterna) {

                    if (_this.scope.record && _this.scope.record.data.estado == 1) {
                        _this.scope.gridEntregaG.btnAdicionarLote.enable();
                    }
                }
                if(_this.scope.record.data.estado != 1){
                    var cm= _this.scope.gridProductosG.getGridPrincipal().getColumnModel().getColumnById('cantidad');
                    cm.editor=null;
                }else if(record.data.tienelote == 0 && _this.scope.record.data.estado == 1){
                    var cantidad = new LOG.util.Prototipos.inputDecimal({
                        width: 100,
                        maxLength: '19'
                    });
                    var cm = _this.scope.gridProductosG.getGridPrincipal().getColumnModel().getColumnById('cantidad');
                    cm.editor=cantidad;
                    _this.scope.panelInferior.collapse(true);
                }
                if(record.data.tienelote == 1){
                    var cm= _this.scope.gridProductosG.getGridPrincipal().getColumnModel().getColumnById('cantidad');
                    cm.editor=null;
                    _this.scope.panelInferior.expand(true);
                }

            });
        this.getSmPrincipal().on(
            'rowdeselect', function (sm, index) {
                var record = sm.getSelected();
                if (!sm.hasSelection()) {
                    _this.listaBotones.getItem(1).disable();
                    _this.scope.gridEntregaG.getStorePrincipal().removeAll();
                }

                /*_this.scope.gridEntregaG.getStorePrincipal().load({
                    params: {
                        iddocumento: (sm.getSelections().length > 1) ? -1 : _this.idtransfinterna,
                        idproducto: (sm.getSelections().length > 1) ? -1 : record.data.idproducto
                    }
                });*/

            });


        return vista;
    },
    getRecordsToSave: function () {
        var arr = new Array();
        this.getStorePrincipal().each(function (rec) {
            // if(rec.data.idproductotransfinterna || rec.dirty) {
            arr.push(rec.data);
            //}
        });
        return arr;
    },
    formatDate: function (value, c, record) {
        if (value) {
            if (typeof value == "object") {
                return value.dateFormat('d/m/Y');
            }
        }
        return value;
    }
});

LOG.inv.transferenciainterna.GridEntrega = Ext.extend(LOG.util.UITemplate, {
    recordDoc: undefined,
    constructor: function (config) {
        this.busquedaBasica = false;
        this.formaVisualizacion = (config.formaVisualizacion) ? config.formaVisualizacion : 'panel';
        this.modoSeleccion = 3;

        this.scope = config.scope;
        this.autoLoad = (config.autoLoad) ? config.autoLoad : false;
        // this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        this.urlBusquedaGridPrincipal = (config.urlBusquedaGridPrincipal) ? config.urlBusquedaGridPrincipal : 'cargarLote';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.inv.transferenciainterna.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.params = (config.params) ? config.params : {};
        this.gridProductosG = config.gridProductosG;
        this.gridEditable = true;
        LOG.inv.transferenciainterna.GridEntrega.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idlote',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idprodtransfinterna',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtransfinternalote',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrolote',
            header: this.idioma.cgNroLote,
            width: 120,
            autoExpand: true,
            filter: {
                type: 'string',
                dataIndex: 'nrolote'
            }
        });
        this.cantidadapassar = new LOG.util.Prototipos.inputDecimal({//
            width: 100,
            maxLength: '19'
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'cantpasar',
            header: 'Cantidad a pasar',
            align: 'right',
            width: 120,
            editor: _this.cantidadapassar
        }));
        this.addGridColumn({
            dataIndex: 'fechavencimiento',
            header: this.idioma.cgFechaVencimiento,
            width: 120
        });
        this.addGridColumn({
            dataIndex: 'fechafabricacion',
            header: this.idioma.cgFechaFabricacion,
            width: 120
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'cantidad',
            align: 'right',
            header: this.idioma.lbExistencia,
            width: 120
        }));
        this.addGridColumn({
            dataIndex: 'ubicacion',
            header: this.idioma.cgUbicacion,
            width: 120
        });

    },
    getRecordsToSave: function () {
        var arr = new Array();
        Ext.each(this.getStorePrincipal().getModifiedRecords(), function (rec) {
            // if(rec.data.idproductotransfinterna || rec.dirty) {
            arr.push(rec.data);
            //}
        });
        this.getStorePrincipal().commitChanges();
        return arr;
    },
    render: function () {
        var _this = this;
        var vista = LOG.inv.transferenciainterna.GridEntrega.superclass.render.call(this);
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            if (e == 'afteredit') {
                if (obj.field == 'cantpasar') {
                    if (obj.record.data.cantidad < obj.value) {
                        obj.value = obj.originalValue;
                        obj.record.dirty = false;
                        obj.record.data.cantpasar = obj.record.json.cantpasar;
                        obj.cancel = true;
                        _this.gpPrincipal.getView().refresh();
                        mostrarMensaje(3, 'La cantidad a pasar no puede ser mayor a la existencia.');
                    } else {
                        if (_this.scope.record && _this.scope.record.data.estado == 1)
                            _this.scope.modelo.gridEditado = true;

                        if (_this.scope.modelo.isValid()) {
                            _this.scope.modelo.habilitarBotones();
                        } else {
                            _this.scope.modelo.habilitarBotones(true);
                        }
                    }
                }
            }
        });

        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.iddocumento = (_this.gridProductosG.idtransfinterna) ? _this.gridProductosG.idtransfinterna : -1;
                var gridProdrecord = (_this.gridProductosG.getSmPrincipal().getSelected()) ? _this.gridProductosG.getSmPrincipal().getSelected() : null;
                obj.params.idproducto = (gridProdrecord && gridProdrecord.data.idproducto) ? gridProdrecord.data.idproducto : -1;
            },
            update: function () {

                /*  if(_this.scope.record && _this.scope.record.data.estado == 1 && !bandera)
                      _this.scope.modelo.gridEditado = true;

                  if (_this.scope.modelo.isValid() && !bandera) {
                      _this.scope.modelo.habilitarBotones();
                  } else {
                      _this.scope.modelo.habilitarBotones(true);
                  }*/
            }
        });

        this.getSmPrincipal().on(
            'rowselect', function (sm, index) {
                var record = sm.getSelections();

                if (record.length >= 1 && _this.scope.record.data.estado == 1) {
                    _this.btnEliminarLote.enable();
                }
                if (record.length == 0) {
                    _this.btnEliminarLote.disable();
                }

            });

        this.getSmPrincipal().on(
            'rowdeselect', function (sm, index) {
                var record = sm.getSelections();

                if (record.length >= 1 && _this.scope.record.data.estado == 1) {
                    _this.btnEliminarLote.enable();
                }
                if (record.length == 0 && _this.scope.record.data.estado == 1) {
                    _this.btnEliminarLote.disable();
                }

            });
        return vista;
    }
});

//Seleccionar Producto
LOG.inv.transferenciainterna.WinSelectProducto = Ext.extend(LOG.util.UITemplate, {
    excluir: undefined,
    idtransfinterna: undefined,
    constructor: function (config) {
        this.busquedaBasica = false;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.iddeposorigen = config.iddeposorigen;
        //this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        config.urlBusquedaGridPrincipal = 'cargarCodificador';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.inv.transferenciainterna.Idioma);
        this.concepto = 'productos';
        LOG.inv.transferenciainterna.WinSelectProducto.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idtransfinterna',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idmovimiento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idlineaprod',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            width: 100,
            autoExpand: true,
            filter: {
                type: 'string',
                dataIndex: 'codigo'
            }

        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            width: 200,
            id: 'descripcion',
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });

        this.addGridColumn({
            dataIndex: 'um',
            header: this.idioma.cgUEmd,
            width: 130
            // editor: new Ext.form.DateField({}),
            /*renderer:function(value , c , record){
             return _this.formatDate(value, c , record)
             }*/
        });
        this.addGridColumn({
            dataIndex: 'presentacion',
            header: this.idioma.cgPresentacion,
            width: 130
        });
        /*this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'precioventa',
            header: this.idioma.cgPrecioVenta,
            width: 130
        }));*/
        /*this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'importeventa',
            header: this.idioma.cgImporteVenta,
            width: 130,
            renderer: function (value, metaData, record) {
                return record.data.precioventa * record.data.existencia
            }
        }));*/
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'preciocosto',
            header: this.idioma.cgPreciocosto,
            width: 130
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'importecosto',
            header: this.idioma.cgImporteCosto,
            width: 130,
            renderer: function (value, metaData, record) {
                return record.data.preciocosto * record.data.existencia
            }
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'existencia',
            header: this.idioma.cgExistencia,
            width: 130
        }));
        this.addGridColumn({
            dataIndex: 'denomlineaprod',
            header: this.idioma.lbLineaprod,
            width: 130,
          //  agrupador: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.inv.transferenciainterna.WinSelectProducto.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.activo = 1;
                obj.params.excluir = Ext.encode(_this.excluir);
                obj.params.iddeposorigen = Ext.encode(_this.iddeposorigen);
                obj.params.idtransfinterna = _this.idtransfinterna;
            }
        });

        this.getSmPrincipal().on(
            'rowselect', function (sm, index) {
                var record = sm.getSelections();

                if (record.length >= 1) {
                    _this.vistaPrincipal.listaBotones.getItem(1).enable();
                    _this.vistaPrincipal.listaBotones.getItem(2).enable();
                }
                if (record.length == 0) {
                    _this.vistaPrincipal.listaBotones.getItem(1).disable();
                    _this.vistaPrincipal.listaBotones.getItem(2).disable();
                }

            });

        this.getSmPrincipal().on(
            'rowdeselect', function (sm, index) {
                var record = sm.getSelections();
                if (record.length >= 1) {
                    _this.vistaPrincipal.listaBotones.getItem(1).enable();
                    _this.vistaPrincipal.listaBotones.getItem(2).enable();
                }
                if (record.length == 0) {
                    _this.vistaPrincipal.listaBotones.getItem(1).disable();
                    _this.vistaPrincipal.listaBotones.getItem(2).disable();
                }

            });
    }
});

LOG.inv.transferenciainterna.GridLote = Ext.extend(LOG.util.UITemplate, {
    excluir: new Array(),
    constructor: function (config) {
        this.busquedaBasica = false;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.autoLoad = false;
        this.gridEditable = true;
        // this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        this.urlBusquedaGridPrincipal = 'cargarLoteAdd';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.inv.transferenciainterna.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.idproducto = config.idproducto;
        this.idtransfinterna = config.idtransfinterna;
        LOG.inv.transferenciainterna.GridLote.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'identrega',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtransfinternalote',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idlote',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrolote',
            header: this.idioma.cgNroLote,
            width: 120,
            autoExpand: true,
            filter: {
                type: 'string',
                dataIndex: 'nrolote'
            }
        });
        this.addGridColumn({
            dataIndex: 'fechafabricacion',
            header: this.idioma.cgFechaFabricacion,
            width: 120
        });
        this.addGridColumn({
            dataIndex: 'fechavencimiento',
            header: this.idioma.cgFechaVencimiento,
            width: 120
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'cantidad',
            header: this.idioma.lbCantidad,
            width: 120
        }));
        this.cantidadapassar = new LOG.util.Prototipos.inputDecimal({//inputDecimal
            width: 100,
            maxLength: '19'
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            dataIndex: 'cantpasar',
            header: 'Cantidad a pasar',
            width: 120,
            editor: _this.cantidadapassar
        }));
        this.addGridColumn({
            dataIndex: 'ubicacion',
            header: this.idioma.cgUbicacion,
            width: 120
        });
        this.addGridColumn({
            dataIndex: 'enuso',
            header: 'En uso',
            width: 120,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        });

    },

    render: function () {
        var _this = this;
        var vista = LOG.inv.transferenciainterna.GridLote.superclass.render.call(this);
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            if (e == 'afteredit') {
                if (obj.field == 'cantpasar') {
                    if (obj.record.data.cantidad < obj.value) {
                        obj.value = obj.originalValue;
                        obj.record.dirty = false;
                        obj.record.data.cantpasar = obj.record.json.cantpasar;
                        obj.cancel = true;
                        _this.gpPrincipal.getView().refresh();
                        mostrarMensaje(3, 'La cantidad a pasar no puede ser mayor a la existencia.');

                    }
                }

            }
        });

        _this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.activo = 1;
                if (_this.idproducto) {
                    obj.params.idproducto = _this.idproducto;
                }
                if (_this.idtransfinterna) {
                    obj.params.idtransfinterna = _this.idtransfinterna;
                }
                obj.params.excluir = Ext.encode(_this.excluir);
            }
           
        });

        this.getSmPrincipal().on(
            'rowselect', function (sm, index) {
                var record = sm.getSelections();

                var enusoselect = record[0].data.enuso;
                Ext.each(record, function (e) {
                    if (e.data.enuso != enusoselect) {
                        sm.clearSelections();
                        sm.selectRecords([e]);
                        enusoselect = e.data.enuso;
                    }
                });

                if (record.length >= 1 && enusoselect == 0) {
                    _this.vistaPrincipal.listaBotones.getItem(1).enable();
                    _this.vistaPrincipal.listaBotones.getItem(2).enable();
                }
                if (record.length == 0 && enusoselect == 1) {
                    _this.vistaPrincipal.listaBotones.getItem(1).disable();
                    _this.vistaPrincipal.listaBotones.getItem(2).disable();
                }

            });

        this.getSmPrincipal().on(
            'rowdeselect', function (sm, index) {
                var record = sm.getSelections();
                /*  console.info(sm);
                  var enusoselect = record[0].data.enuso;
                      Ext.each(record, function(e){
                          if (e.data.enuso != enusoselect) {
                             sm.clearSelections();
                             sm.selectRecords([e]);
                             enusoselect = e.data.enuso;
                          }
                      });*/
                /*if (record.length >= 1 && enusoselect == 0){
                    _this.vistaPrincipal.listaBotones.getItem(1).enable();
                    _this.vistaPrincipal.listaBotones.getItem(2).enable();
                }*/
                if (record.length == 0) {
                    _this.vistaPrincipal.listaBotones.getItem(1).disable();
                    _this.vistaPrincipal.listaBotones.getItem(2).disable();
                }

            });
        _this.getStorePrincipal().load();


        return vista;
    }
});

