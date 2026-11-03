Ext.ns('LOG.lb.dispositivos');

LOG.lb.dispositivos.View = Ext.extend(LOG.util.UITemplate, {
    seleccion: undefined,
    constructor: function(config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.lb.dispositivos.Idioma);
        this.dirController = '/logistica/utiles/dispositivos/index.php/dispositivos';
        this.urlBusquedaGridPrincipal = 'cargarDispositivos';
        this.modoSeleccion = 3;
        this.busquedaBasica = false;
        //this.autoLoad = false;
        this.gridEditable = true;
        this.modelo = new LOG.lb.dispositivos.Modelo({
            idioma: config.idioma
        });
        LOG.lb.dispositivos.View.superclass.constructor.call(this, config);
    },
    render: function() {
        var _this = this;
        var vis = LOG.lb.dispositivos.View.superclass.render.call(this);
        _this.getGridPrincipal().on('beforeedit', function(e) {
            if (_this.getGridPrincipal().getSelectionModel().getSelected().data.activo == 1) {
                e.cancel = true;
            }
        })
        return vis;
    },
    initDefaultColumns: function() {
        var _this = this;
        /*this.addGridColumn({
            dataIndex: 'identificador',
            hidden: true
        });*/
        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idalmacen',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'llave',
            hidden: true
        });
        this.addGridColumn({
            header: 'Dispositivo',
            width: 300,
            dataIndex: 'identificador',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: 'Almacen',
            width: 350,
            dataIndex: 'almacen',
            default: true,
            editor: new Ext.form.TriggerField({
                name: 'idalmacen',
                triggerClass: 'x-form-cliente-trigger',
                editable: false,
                onTriggerClick: function(e) {
                    _this.showDepositos(_this.getGridPrincipal().getSelectionModel().getSelected());
                },
                listeners: {
                    onSelect: function(record) {
                        if (record.combo.isDirty())
                        {

                        }
                        else
                            record.combo.setValue("");
                    }
                }
            })/*,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                /!*if(value){
                    if(this.editor.isDirty()){
                        if(value == this.editor.getValue()) {
                            record.set('idnomoperaciones',this.editor.getValue());
                            value = this.editor.getRawValue();
                        }
                    }
                    return value;
                }
                return '';*!/
            }*/
        });

        this.addGridColumn({
            header: 'Activo',
            width: 120,
            dataIndex: 'activo',
            default: true,
            renderer: function(v, m, rd) {
                if (rd.data.activo == 1)
                    m.css = 'icondistra-aceptar verde';
                else
                    m.css = 'icondistra-aceptar rojo';
            }
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                    btn.show();                   
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                Ext.MessageBox.wait('Adicionando nuevo dispositivo', 'Espere por favor');
                Ext.Ajax.request({
                    url: 'adicionarDispositivo',
                    method: 'post',
                    params: {
                    },
                    success: function (rp) {
                        var obj = Ext.decode(rp.responseText);
                        window.open(obj.file)
                        Ext.MessageBox.hide();                        
                        _this.getGridPrincipal().getStore().reload();
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.btnHabilitar,
            tooltip: _this.idioma.ttBtnHabilitar,
            iconCls: 'habilitar',
            idItem: 'Habilitar',
            isContextual: true,
            //scope: this,
            disabled: true,
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                    btn.show();
                    btn.disable();
                    _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                Ext.each(seleccion, function (uno) {
                                    if (uno.data.activo == "1") {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                _this.habilitar(1);
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.btnDeshabilitar,
            tooltip: _this.idioma.ttBtnDeshabilitar,
            iconCls: 'deshabilitar',
            idItem: 'Deshabilitar',
            isContextual: true,
            //scope: this,
            disabled: true,
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                    btn.show();
                    btn.disable();
                    _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length > 0) {
                                btn.enable();
                                Ext.each(seleccion, function (uno) {
                                    if (uno.data.activo != "1") {
                                        btn.disable();
                                    }
                                });
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                _this.habilitar(2);
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: 'Exportar Llave',
            tooltip: 'Exportar el fichero <b>.key</b> con las llaves del equipo',
            iconCls: 'exportar',
            idItem: 'Llave',
            isContextual: true,
            //scope: this,
            disabled: true,
            controlFn: function (btn, called) {
                if (called.grantedAction('CT') || called.grantedAction('RCRUD')) {
                    btn.show();
                    btn.disable();
                    _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                        if (e == "selectionchange") {
                            if (seleccion.length == 1) {
                                btn.enable();                                
                            } else {
                                btn.disable();
                            }
                        }
                    });
                } else {
                    btn.hide();
                }
            },
            handler: function () {
                window.open(_this.getGridPrincipal().getSelectionModel().getSelected().data.llave);
            }
        }));

    },
    habilitar: function(accion) {
        var _this = this;
        Ext.MessageBox.wait((accion == 1 ? _this.idioma.msgHabilitando : _this.idioma.msgDeshabilitando), _this.idioma.msgEspere || '...');
        var seleccionados = _this.getGridPrincipal().getSelectionModel().getSelections();
        var seleccion = [];
        Ext.each(seleccionados, function (uno) {
            seleccion.push("'"+uno.json.identificador+"'");
        });
        Ext.Ajax.request({
            url: 'habilitar',
            method: 'post',
            params: {
                dispositivos: Ext.encode(seleccion),
                accion: accion
            },
            success: function (rp) {
                Ext.MessageBox.hide();
                //var value = Ext.decode(rp.responseText);
                if (seleccion.length > 1) {
                    mostrarMensaje(1, (accion == 1 ? _this.idioma.lbMsgDispositivosHabilidados : _this.idioma.lbMsgDispositivosDeshabilidados));
                } else {
                    mostrarMensaje(1, (accion == 1 ? _this.idioma.lbMsgDispositivoHabilidado : _this.idioma.lbMsgDispositivoDeshabilidado));
                }
                _this.getGridPrincipal().getStore().reload();
            }
        });
    },
    showDepositos: function(dispositivo) {
        var _this = this;
        var ventanaDeposito = new LOG.lb.dispositivos.addAlmacen({
            //idclientesproveedores: Ext.encode(idclientes),
            idioma: _this.idioma,
            urlBusquedaGridPrincipal: 'cargarDepositos'
        });
        ventanaDeposito.init();
        ventanaDeposito.getVistaPrincipal().title = 'Dep\xf3sitos';
        ventanaDeposito.view();
        ventanaDeposito.getGridPrincipal().on('rowdblclick', function(g) {
            ventanaDeposito.aceptarFn();
            ventanaDeposito.close();
        });
        //ventanaDeposito.getGridPrincipal().store.load();
        var botonAceptar = ventanaDeposito.getVistaPrincipal().listaBotones.getItem(2);
        botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
            ventanaDeposito.aceptarFn();
        });
        ventanaDeposito.aceptarFn = function() {
            var record = ventanaDeposito.getGridPrincipal().getSelectionModel().getSelected();
            Ext.MessageBox.wait('Guardando los datos', _this.idioma.msgEspere || '...');
            Ext.Ajax.request({
                url: 'modificarDispositivo',
                method: 'POST',
                params: {
                    idalmacen: record.data.iddeposito,
                    identificador: dispositivo.data.identificador
                },
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                        _this.getGridPrincipal().getStore().reload();
                    }
                    ventanaDeposito.close();
                }
            });
        }
    }
}
);

LOG.lb.dispositivos.addAlmacen = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        config.modoSeleccion = 1;
        //this.dirController = '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion';
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        this.busquedaBasica = true;
        config = Ext.apply(_this, config);
        LOG.lb.dispositivos.addAlmacen.superclass.constructor.call(this, config);

    },
    init: function () {
        var _this = this;
        LOG.lb.dispositivos.addAlmacen.superclass.init.call(this);
        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 350;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    aceptarFn: function(){
        console.info('aceptar');
    },
    close: function () {
        var _this = this;
        _this.getVistaPrincipal().close();
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddeposito'
        });
        this.addGridColumn({
            header: _this.idioma.lbDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
    },
    render: function () {
        var _this = this;
        var p = LOG.lb.dispositivos.addAlmacen.superclass.render.call(this);
        _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'selectionchange') {
                if (this.getCount()> 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }else{
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                /*st.initBaseParams.tipocliente = _this.tipocliente;
                st.initBaseParams.idclientesproveedores = _this.idclientesproveedores;*/
                st.baseParams.start = 0;
                st.baseParams.limit = 30;
            }
        });
        return p;
    }
});

