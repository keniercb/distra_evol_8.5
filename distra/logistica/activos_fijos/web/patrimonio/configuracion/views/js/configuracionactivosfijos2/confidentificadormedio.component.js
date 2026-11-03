/**
 * Created by yoendy on 3/28/2016.
 */

Ext.ns('Ext.aft.Conf');

Ext.aft.Conf.indicadorIdentificador = Ext.extend(Ext.grid.GridPanel, {

    constructor: function (config) {
        var _this = this;

        Ext.apply(this, config);
        _this.plugins = new Array();
        for (var i = 0; i < arrCampos.length; i++) {
            _this.attatchPlugin(arrCampos[i]);
        }
        _this.campos = LOG.aft.RegOperativo.Campos;
        for (var i = 0; i < _this.plugins.length; i++) {
            _this.plugins[i].init(_this)
        }
        Ext.aft.Conf.camposIndicador = _this.campos;
        Ext.aft.Conf.propiedadesIndicador = {};
        for (var cmp  in Ext.aft.Conf.camposIndicador) {
            var objeto = Ext.aft.Conf.camposIndicador[cmp];
            Ext.aft.Conf.propiedadesIndicador[objeto['dataIndex']] = objeto['header'];
        }
        this.cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({
            header: 'N\xBA.',
            width: 30
        }),
            {
                width: 180,
                header: _this.idioma.lbCmDescripcion,
                dataIndex: 'denominacionIndicador'

            }, {
                width: 180,
                header: _this.idioma.lbCmIdentificador,
                dataIndex: 'identificador',
                renderer: function (v, p, record) {
                    return Ext.aft.Conf.propiedadesIndicador[v];
                }

            }
        ]);
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            moveEditorOnEnter: false,
            listeners: {
                'rowselect': function (sel, row, record) {
                    //rowindex = row;

                }
            }
        });
        this.region = 'center';

        this.store = new Ext.data.Store({
            url: '/logistica/activos_fijos/configuracion/index.php/confidentificadormedio/cargarIndicadores',
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "datos",
                id: "idindicador"
            }, [
                {
                    name: 'denominacion'
                },
                {
                    name: 'idindicador'
                },
                {
                    name: 'denominacionIndicador'
                },
                {
                    name: 'identificador'
                },
                {
                    name: 'nombretabla'
                }
            ]),
            listeners:{
                'load':function(st, record, op){
                    _this.maskGrid.hide();
                    if (st.getCount()>0) {
                        _this.sm.selectFirstRow();
                    }
                },
                'beforeload':function(){
                    _this.maskGrid.show();
                }
            }
        });
        this.bbar = new Ext.PagingToolbar({
            pageSize: 25,
            store: _this.store,
            displayInfo: true,
            displayMsg: 'Mostrando {0} - {1} de {2}',
            emptyMsg: "No hay datos que mostrar"
        });

        this.maskGrid = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});

        Ext.aft.Conf.indicadorIdentificador.superclass.constructor.call(this, config);
    },
    adicionarIndicador: function (config) {
        var _this = this;
        config.scope = _this;
        _this.winAdd = new Ext.aft.Conf.winAddIndicador(config);
        _this.winAdd.show();

    },
    attatchPlugin: function (plugin) {
        this.plugins.push(plugin);
    },
    verificarWinAdd:function(){
        var _this = this;
        return (_this.winAdd && _this.winAdd.isVisible() ||(Ext.MessageBox.isVisible()));
    }
});

Ext.aft.Conf.indicadorPanel = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        this.title = config.idioma.lbTitleTabConfindicador;
        this.layout = 'border';
        this.region = 'center';
        this.id = 'tabtindicador';
        var _this = this;
        var gridtiposmedios = new Ext.aft.Conf.indicadorIdentificador({
            idioma: config.idioma
        });
        gridtiposmedios.fireEvent = gridtiposmedios.fireEvent.createSequence(function (e) {
            if (e == 'celldblclick') {
                _this.btnModificarRelacion.handler();
            }
        });
        gridtiposmedios.getSelectionModel().fireEvent = gridtiposmedios.getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'rowselect') {
                _this.btnModificarRelacion.enable();
                _this.btnEliminarRelacion.enable();
            }
            if (e == 'rowdeselect') {
                _this.btnModificarRelacion.disable();
                _this.btnEliminarRelacion.disable();
            }
        });


        this.btnAdicionarRelacion = new Ext.Button({
            iconCls: 'adicionar',
            text: config.idioma.lbBtnAdicionar,
            tooltip: config.idioma.lbTtBtnAdicionar,
            handler: function () {
                var parametros = {
                    idioma: config.idioma
                };
                gridtiposmedios.adicionarIndicador(parametros);
            }
        });
        this.btnModificarRelacion = new Ext.Button({
            iconCls: 'modificar',
            disabled: true,
            text: config.idioma.lbBtnModificar,
            tooltip: config.idioma.lbTtBtnModificar,
            handler: function () {
                var parametros = {
                    idioma: config.idioma,
                    modificar:true,
                    record : gridtiposmedios.getSelectionModel().getSelected()
                };
                gridtiposmedios.adicionarIndicador(parametros);
            }
        });
        this.btnEliminarRelacion = new Ext.Button({
            iconCls: 'eliminar',
            text: config.idioma.lbBtnEliminar,
            disabled: true,
            tooltip: config.idioma.lbBtnEliminarToolTip,
            handler: function () {
                mostrarMensaje(2, "\xbfEst\xe1 seguro que desea eliminar la relaci\xf3n seleccionada\x3f", function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait("Eliminando relaci\xf3n", "Por favor espere...");
                        Ext.Ajax.request({
                            url: '/logistica/activos_fijos/configuracion/index.php/confidentificadormedio/eliminarRelacion',
                            method: 'POST',
                            params: {idindicador: gridtiposmedios.getSelectionModel().getSelected().data.idindicador},
                            callback: function (options, success, response) {
                                Ext.MessageBox.hide();
                                var rd = Ext.decode(response.responseText);
                                if (rd.CodMsg == 1) {
                                    mostrarMensaje(1, "La relaci\xf3n ha sido eliminada satisfactoriamente.");
                                    gridtiposmedios.getStore().load();
                                } else {
                                    mostrarMensaje(3, "La relaci\xf3n no se ha podido eliminar.");
                                }
                            }
                        });
                    }
                });
            }
        });
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                ctrl: false,
                key: 'I',
                fn: function () {
                    if (!(gridtiposmedios.verificarWinAdd())) {
                        _this.btnAdicionarRelacion.handler();
                    }

                }
            },
                {
                    alt: true,
                    ctrl: false,
                    key: 'M',
                    fn: function () {
                        if (!(gridtiposmedios.verificarWinAdd()) && !_this.btnModificarRelacion.disabled) {
                            _this.btnModificarRelacion.handler();
                        }
                    }
                },
                {
                    key: Ext.EventObject.DELETE,
                    shift: false,
                    alt: false,
                    ctrl: false,
                    fn: function () {
                        if (!(gridtiposmedios.verificarWinAdd()) && !_this.btnEliminarRelacion.disabled) {
                            _this.btnEliminarRelacion.handler();
                        }
                    }
                }

            ]);
        this.tbar = [_this.btnAdicionarRelacion, _this.btnModificarRelacion, _this.btnEliminarRelacion];

        this.items = [gridtiposmedios];

        this.listeners = {
            'activate': function () {
                gridtiposmedios.store.load();
            }
        };

        Ext.aft.Conf.indicadorPanel.superclass.constructor.apply(this, arguments);
    }
});

Ext.aft.Conf.winAddIndicador = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var _this = this;

        Ext.apply(this, config);
        this.title = (_this.modificar)? _this.idioma.lbTtWinM:_this.idioma.lbTtWinI;
        this.width = 600;
        this.height = 150;
        this.frame = true;
        this.closeAction = 'close';
        this.constrain = true;

        var arrayData = Array();
        this.modal = true;
        for (var cmp  in Ext.aft.Conf.camposIndicador) {
            var objeto = Ext.aft.Conf.camposIndicador[cmp];
            var nombreT = "";
            if(objeto['name'] == 'nroserie'){
                nombreT = 'dat_registronumerico';
            }else if (objeto['nameplugin'] == 'Datos transporte'){
                nombreT = 'dat_regnumericoactivotransp';
            }else{
                nombreT = 'dat_regnumericoactivo';
            }
            if (objeto['xtype'] != "datefield" && objeto['xtype'] != "combobox") {
                arrayData.push({
                    identificador: objeto['dataIndex'],
                    denominacion: objeto['header'],
                    nombretabla: nombreT
                });
            }
        }
        this.storeCombo = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                //id: "identificador"
            }, [
                {
                    name: 'identificador'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'nombretabla'
                }
            ])
        });
        this.storeCombo.loadData(arrayData);
        this.validateDefault = true;
        this.combo = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbCmIdentificador,
            store: _this.storeCombo,
            valueField: 'identificador',
            displayField: 'denominacion',
            hiddenName: 'identificador',
            emptyText: (_this.modificar) ? Ext.aft.Conf.propiedadesIndicador[_this.record.data.identificador] : "Seleccione...",
            mode: 'local',
            allowBlank: false,
            listeners:{
                'select':function(combo, record, index){
                    _this.idNombreTablaH.setValue(record.data.nombretabla);
                }
            }
        });
        this.denomIndicador = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbCmDescripcion,
            name: 'denominacionIndicador',
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'focus': function () {
                    _this.mostrarWinIndicadores();
                }
            }
        });
        var panelColum = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        panelColum.addComponent(_this.denomIndicador);
        panelColum.addComponent(_this.combo);
        this.idIndicadorH = new Ext.form.Hidden({
            name: 'idindicador'
        });
        this.idNombreTablaH = new Ext.form.Hidden({
            name: 'nombretabla'
        });

        panelColum.addComponent(this.idIndicadorH);
        panelColum.addComponent(this.idNombreTablaH);

        var panel = LOG.util.UIManager.initForm({
            frame: true,
            items: [panelColum]


        });
        if (_this.modificar) {
            _this.denomIndicador.setValue(_this.record.data.denominacionIndicador);
            _this.idIndicadorH.setValue(_this.record.data.idindicador);
            _this.idNombreTablaH.setValue(_this.record.data.nombretabla);
            this.denomIndicador.disable();
        }

        var btnAceptar = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonAceptar({
            tooltip: _this.idioma.lbTtBtnAceptarI,
            handler: function () {
                var objeto = panel.getForm().getValues();
                objeto.denominacion = _this.combo.getRawValue();
                _this.adicionarRelacion(objeto);
            }
        }));
        var btnAplicar = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonAplicar({
            tooltip: _this.idioma.lbTtBtnAceptarA,
            hidden:_this.modificar,
            handler: function () {
                var objeto = panel.getForm().getValues();
                objeto.denominacion = _this.combo.getRawValue();
                _this.adicionarRelacion(objeto, true);
            }
        }));

        var btnCancelar = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            tooltip: _this.idioma.lbTtBtnCancelarI,
            handler: function () {
                _this.close();
            }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                ctrl: false,
                key: 'X',
                fn: function () {
                    if (_this.isVisible()) {
                        btnCancelar.handler(btnCancelar);
                    }
                }
            },{
                alt: true,
                ctrl: true,
                key: 'P',
                fn: function () {
                    if (_this.isVisible()) {
                        btnAplicar.handler(btnAplicar);
                    }
                }
            },
              {
                    key: Ext.EventObject.ENTER,
                    shift: false,
                    alt: false,
                    ctrl: false,
                    fn: function () {
                        if (_this.isVisible()) {
                                btnAceptar.handler(btnAceptar);
                        }
                    }
                }

            ]);
        this.items = [panel];
        this.buttons = [btnCancelar, btnAplicar, btnAceptar];
        Ext.aft.Conf.winAddIndicador.superclass.constructor.call(this, config);
    },
    mostrarWinIndicadores: function () {
        var _this = this;
        var arrayIds = _this.scope.getStore().collect('idindicador');
        var params = {
            explotacion: 1
        };
        if (arrayIds) {
            params.idseleccionados = Ext.encode(arrayIds);
        }
        LOG.inv.maestroproductos.Loader.init(function () {
            _this.ventanaActivos = new LOG.lb.maestroproductos.UIProductos({
                tipo: 1,
                width: 750,
                height: 350,
                usarAplicar: false,
                usarMarcaModelo: true,
                modoSeleccion: 1,
                showArbol: false,
                parametros: params,
                doAction: function (recordSeleccionado, e) {
                    if (recordSeleccionado != null) {
                        _this.denomIndicador.setValue(recordSeleccionado[0].data.denominacion);
                        _this.idIndicadorH.setValue(recordSeleccionado[0].data.idindicador);
                    }
                }
            });

            _this.ventanaActivos.show();
        });

    },
    adicionarRelacion: function (valores, aplicar) {
        var _this = this;
        Ext.MessageBox.wait("Adicionando relaci\xf3n", "Espere por favor...");
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/configuracion/index.php/confidentificadormedio/adicionarRelacion',
            method: 'POST',
            params: valores,
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.CodMsg == 1) {
                    var msn = (_this.modificar) ? "La relaci\xf3n ha sido modificada satisfactoriamente." :
                        "La relaci\xf3n ha sido adicionada satisfactoriamente.";
                    mostrarMensaje(1, msn);

                    if(!aplicar)
                    {
                        Ext.MessageBox.hide();
                        _this.scope.store.load();
                        _this.close();
                    }else{
                        _this.scope.store.load({
                            callback:function()
                            {
                                Ext.MessageBox.hide();
                                _this.denomIndicador.setValue("");
                                _this.denomIndicador.focus(false, 500);
                                _this.idIndicadorH.setValue(null);
                                _this.idNombreTablaH.setValue(null);
                                _this.combo.clearValue();

                            }
                        });

                    }

                } else {
                    var msn = (_this.modificar) ? "La relaci\xf3n no se ha podido modificar." :
                        "La relaci\xf3n no se ha podido modificar.";
                    mostrarMensaje(3, msn);
                }
            }
        });

    }

});
