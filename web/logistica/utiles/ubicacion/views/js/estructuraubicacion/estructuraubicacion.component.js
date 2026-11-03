Ext.ns('Ext.erp');
Ext.erp.estructuraubicacion = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    listaBotonesPanel: undefined,
    nodoSeleccionadoArbol: undefined,
    posicionArbol: undefined,
    estructuraTotal: undefined,
    constructor: function (config) {
        var _this = this;
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesPanel = new LOG.util.List();
        this.modificar = false;

        this.addButtonPanel(LOG.util.Prototipos.botonGuardar({
            text: config.idioma.lbGuardar,
            tooltip: config.idioma.tiplbGuardar,
            handler: function () {
                this.setDisabled(true);
                _this.salvarConfiguracion(config);
            }
        }));
        this.botonAdicionar = LOG.util.Prototipos.botonAdicionar({
            disabled: true,
            tooltip: config.idioma.tiplbAdicionar,
            handler: function () {
                _this.modificar = false;
                _this.ventanaGestionEstructuras(config);
            }
        });
        this.botonModificar = LOG.util.Prototipos.botonModificar({
            disabled: true,
            text: config.idioma.lbModificar,
            tooltip: config.idioma.tiplbModificar,
            handler: function () {
                _this.modificar = true;
                _this.ventanaGestionEstructuras(config);
            }
        });
        this.botonEliminar = LOG.util.Prototipos.botonEliminar({
            disabled: true,
            text: config.idioma.lbEliminar,
            tooltip: config.idioma.tiplbEliminar,
            handler: function () {
                _this.eliminarEstructuras(config);
            }
        });
        this.addToolbarButtonPanel(this.botonAdicionar);

        this.addToolbarButtonPanel(this.botonModificar);

        this.addToolbarButtonPanel(this.botonEliminar);

        this.stEstructura = new Ext.data.SimpleStore({
            fields: ['no', 'medios'],
            data: [
                ['1', 'Dep\xf3sito'],
                ['2', '\xc1rea de responsabilidad']
            ],
            autoLoad: false
        });

        this.cmbOpcion = new LOG.util.ComboBox({
            store: this.stEstructura,
            displayField: 'medios',
            autoLoad: false,
            valueField: 'no',
            typeAhead: true,
            hidden: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: config.idioma.lbTipoEstrucUbicCombo,
            selectOnFocus: true,
            editable: false
        });
        //var recordOpcion = _this.stEstructura.getAt(_this.stEstructura.find('no', 1));
        //_this.cmbOpcion.select(1,true);
        //_this.cmbOpcion.fireEvent('select', _this.cmbOpcion, recordOpcion);

        this.stFormato = new Ext.data.Store({
            url: '/logistica/utiles/ubicacion/index.php/estructuraubicacion/cargarComboformato',
            reader: new Ext.data.JsonReader({
                id: 'idformato',
                root: 'datos',
                fields: [
                    {
                        name: 'idformato'
                    },
                    {
                        name: 'nombre'
                    },
                    {
                        name: 'partes'
                    },
                    {
                        name: 'ultimo_nivel'
                    }
                ]
            })
        });

        this.treeLoader = new Ext.tree.TreeLoader({
            dataUrl: '/logistica/utiles/ubicacion/index.php/estructuraubicacion/cargarArbol',
            listeners: {
                beforeload: function (loader, nodo, fnCallBack) {
                    loader.baseParams.idestructuraubic = nodo.attributes.idestructuraubic;
                    if (_this.cmbOpcion.getValue() == '2') {
                        _this.tpEstructuras.enable();
                        loader.baseParams.tipo = _this.cmbOpcion.getValue();
                    } else {
                        _this.tpEstructuras.enable();
                        loader.baseParams.tipo = _this.cmbOpcion.getValue();
                    }
                    if (nodo.attributes.idformato) {
                        var idformato = nodo.attributes.idformato;
                        var record = _this.stFormato.getAt(_this.stFormato.find('idformato', idformato));
                        loader.baseParams.nivel = record.data.ultimo_nivel;
                    }
                },
                load: function (obj, node, response) {
                    var result = response.responseText;
                    var jsonData = Ext.decode(result);
                    if (jsonData.length > 0) {
                        _this.nodopadre.expand();
                    }
                    _this.listaBotonesVentanaToolbar.getArray()[0].setDisabled(true);
                    _this.listaBotonesVentanaToolbar.getArray()[1].setDisabled(true);
                    _this.listaBotonesVentanaToolbar.getArray()[2].setDisabled(true);
                }
            }
        });

        this.tpEstructuras = new Ext.tree.TreePanel({
            enableDD: true,
            autoScroll: true,
            style: 'margin: 2 2 2 2',
            loader: this.treeLoader,
            frame: true,
            height: 350,
            layout: 'fit',
            region: 'center',
            disabled: true,
            bodyStyle: 'background-color: white',
            listeners: {
                'click': function (node, e) {
                    _this.nodoSeleccionadoArbol = node;
                    _this.posicionArbol = _this.nodoSeleccionadoArbol.getDepth();
                    if (_this.posicionArbol == 1) {
                        _this.listaBotonesVentanaToolbar.getArray()[0].setDisabled(false);
                        _this.listaBotonesVentanaToolbar.getArray()[1].setDisabled(true);
                        _this.listaBotonesVentanaToolbar.getArray()[2].setDisabled(true);

                    } else if (_this.posicionArbol >= 2 && !node.isLeaf()) {
                        _this.listaBotonesVentanaToolbar.getArray()[0].setDisabled(node.attributes.ultimonivel);
                        _this.listaBotonesVentanaToolbar.getArray()[1].setDisabled(false);
                        _this.listaBotonesVentanaToolbar.getArray()[2].setDisabled(false);

                    } else if (node.getDepth() >= 2 && node.isLeaf()) {
                        _this.listaBotonesVentanaToolbar.getArray()[0].setDisabled(true);
                        _this.listaBotonesVentanaToolbar.getArray()[1].setDisabled(false);
                        _this.listaBotonesVentanaToolbar.getArray()[2].setDisabled(false);

                    } else if (node.id == 0) {
                        _this.listaBotonesVentanaToolbar.getArray()[0].setDisabled(true);
                        _this.listaBotonesVentanaToolbar.getArray()[1].setDisabled(true);
                        _this.listaBotonesVentanaToolbar.getArray()[2].setDisabled(true);
                    }

                }
            }
        });

        this.nodopadre = new Ext.tree.AsyncTreeNode({
            text: config.idioma.titleTabEstructuraUbicacion,
            draggable: false,
            id: '0',
            animate: false
        });

        this.tpEstructuras.setRootNode(this.nodopadre);

        this.cmbOpcion.on('select', function (cmb, record, index) { //step 1
//            index = 0;
            if (index == 0) {
                _this.botonAdicionar.setTooltip(config.idioma.tiplbAdicionar + config.idioma.tiplAreaUbic);
                _this.botonModificar.setTooltip(config.idioma.tiplbModificar + config.idioma.tiplAreaUbic);
                _this.botonEliminar.setTooltip(config.idioma.tiplbEliminar + config.idioma.tiplAreaUbic);
            } else {

                _this.botonAdicionar.setTooltip(config.idioma.tiplbAdicionar + config.idioma.tiplEstrucResp);
                _this.botonModificar.setTooltip(config.idioma.tiplbModificar + config.idioma.tiplEstrucResp);
                _this.botonEliminar.setTooltip(config.idioma.tiplbEliminar + config.idioma.tiplEstrucResp);
            }
            _this.botonAdicionar.toolKey = false;
            _this.botonModificar.toolKey = false;
            _this.botonEliminar.toolKey = false;
            _this.botonAdicionar.setKey = false;
            _this.botonModificar.setKey = false;
            _this.botonEliminar.setKey = false;
            LOG.util.UIManager.applyKey(_this.botonAdicionar, _this);
            LOG.util.UIManager.applyKey(_this.botonModificar, _this);
            LOG.util.UIManager.applyKey(_this.botonEliminar, _this);
            var tree = this.tpEstructuras;
            tree.getRootNode().reload();
            var subsistema = (index === 0) ? 10 : 11;
            this.stFormato.load({
                params: {
                    idsubsistema: subsistema
                }
            });
        }, this);


        this.chSegunCapacidad = new Ext.form.Checkbox({
            boxLabel: config.idioma.lbCheckCapacidad,
            height: 40,
            name: 'capacidad',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (_this.panelCheck.getForm().isValid() && _this.panelCheck.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[0].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[0].disable();
                    }
                }
            }
        });
        this.chSegunTipo = new Ext.form.Checkbox({
            boxLabel: config.idioma.lbCheckProducto,
            height: 40,
            name: 'producto',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (_this.panelCheck.getForm().isValid() && _this.panelCheck.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[0].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[0].disable();
                    }
                }
            }
        });
        this.chSegunOperaciones = new Ext.form.Checkbox({
            boxLabel: config.idioma.lbCheckOperacion,
            height: 40,
            name: 'operaciones',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (_this.panelCheck.getForm().isValid() && _this.panelCheck.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[0].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[0].disable();
                    }
                }
            }
        });
        this.chSegunVolumen = new Ext.form.Checkbox({
            boxLabel: config.idioma.lbCheckVolumen,
            height: 40,
            name: 'volumen',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (_this.panelCheck.getForm().isValid() && _this.panelCheck.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[0].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[0].disable();
                    }
                }
            }
        });

        this.chSegunPeso = new Ext.form.Checkbox({
            boxLabel: config.idioma.lbCheckPeso,
            height: 40,
            name: 'peso',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (_this.panelCheck.getForm().isValid() && _this.panelCheck.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[0].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[0].disable();
                    }
                }
            }
        });
        this.chUsarEstructura = new Ext.form.Checkbox({
            boxLabel: config.idioma.lbCheckUsaTodo,
            height: 40,
            name: 'estructura',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (_this.panelCheck.getForm().isValid() && _this.panelCheck.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[0].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[0].disable();
                    }
                }
            }
        });

        this.stEstrategia = new Ext.data.SimpleStore({
            fields: ['no', 'estrategia'],
            data: [
                ['1', 'Primero en vencer primero en salir']
            ],
            autoLoad: false
        });

        this.cmbEstrategiaUbicacion = new LOG.util.ComboBox({
            store: this.stEstrategia,
            displayField: 'estrategia',
            valueField: 'no',
            fieldLabel: config.idioma.lbEstrategia,
            typeAhead: true,
            name: 'estrategiasalida',
            hiddenName: 'no',
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: config.idioma.lbEstrategia,
            selectOnFocus: true,
            editable: false,
            allowBlank: false,
            width: 200,
            listeners: {
                'select': function () {
                    if (_this.panelCheck.getForm().isValid() && _this.panelCheck.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[0].enable();
                    } else {
                        _this.listaBotonesPanel.arrayData[0].disable();
                    }
                }
            }
        });

        this.panelEstrategia = LOG.util.UIManager.initPanel({
            region: 'south',
            labelAlign: 'top',
            layout: 'form',
            items: [this.cmbEstrategiaUbicacion]
        });

        this.panelCheck = LOG.util.UIManager.initForm({
            region: 'center',
            frame: true,
            items: [this.chSegunCapacidad, this.chSegunTipo, this.chSegunOperaciones, this.chSegunVolumen,
                this.chSegunPeso, this.chUsarEstructura, this.panelEstrategia]
        });

        this.panelGuardar = LOG.util.UIManager.initPanel({
            region: 'south',
            buttons: [this.listaBotonesPanel.getArray()]
        });

        config.panelOeste = LOG.util.UIManager.initPanel({
            region: 'west',
            bodyStyle: 'padding:20px 10px 0',
            width: 300,
            layout: 'border',
            title: config.idioma.titlePanelReglas,
            collapsible: true,
            items: [this.panelGuardar, this.panelCheck]

        });
        _this.cargarConfiguracionInicial(config);

        this.panelBotones = LOG.util.UIManager.initPanel({
            tbar: [this.listaBotonesVentanaToolbar.getArray(), '->', this.cmbOpcion],
            region: 'north'
        });

        config.panelEste = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            items: [this.panelBotones, this.tpEstructuras]
        });
        config.layout = 'border';
        config.items = [config.panelOeste, config.panelEste];
        config.tbar = ['->', LOG.util.Prototipos.botonAyuda({
            id: 'configuracionubicacion'
        })];
        config.panelEste.onRender = config.panelEste.onRender.createSequence(function () {
            _this.listaBotonesVentanaToolbar.each(function (b) {
                LOG.util.UIManager.applyKey(LOG.util.UIManager.reconfigureButton(b), config.panelEste);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(this, [b, this]).call();
                }
            });
        });

        Ext.erp.estructuraubicacion.superclass.constructor.call(this, config);
    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addButtonPanel: function (b, f) {
        this.listaBotonesPanel.add(LOG.util.UIManager.reconfigureButton(b));
    },
    ventanaGestionEstructuras: function (config) {
        var _this = this;
        //Si es nivel 1
        if (this.cmbOpcion.getValue() == '1') {
            if (this.tpEstructuras.getSelectionModel().selNode.attributes.idformato) {
                var idformato = this.tpEstructuras.getSelectionModel().selNode.attributes.idformato;
                var record = _this.stFormato.getAt(_this.stFormato.find('idformato', idformato));

                if (this.tpEstructuras.getSelectionModel().selNode.getDepth() <= record.data.partes.length + 1) {
                    var pos_next_node = this.tpEstructuras.getSelectionModel().selNode.getDepth();
                    var ultimoNodo = false;

                    for (var i = 0; i < record.data.partes.length; i++) {

                        if (record.data.partes[i].nivel == pos_next_node) {
                            var long_cod = record.data.partes[i].longitud;
                        }
                        if (record.data.partes.length <= pos_next_node) {
                            var ultimoNodo = true;
                        }
                    }

                    var mostrarTipoUbicacion = false;
                    if (this.estructuraTotal || ultimoNodo) {
                        mostrarTipoUbicacion = true;
                    }
                    this.winMediosAlmacen = new Ext.erp.winMediosAlmacen({
                        parent: _this,
                        long_cod: long_cod,
                        mostrarTipoUbicacion: mostrarTipoUbicacion
                    });
                    this.winMediosAlmacen.show();

                } else {
                    mostrarMensaje(1, config.idioma.lbMsgNoAdicionarEstructura);
                }

            } else {
                var mostrarTipoUbicacion = false;
                if (this.estructuraTotal || ultimoNodo) {
                    mostrarTipoUbicacion = true;
                }
                this.winMediosAlmacen = new Ext.erp.winMediosAlmacen({
                    parent: _this,
                    mostrarTipoUbicacion: mostrarTipoUbicacion
                });
                this.winMediosAlmacen.show();
            }
        }
        if (this.cmbOpcion.getValue() === '2') {
            if (this.tpEstructuras.getSelectionModel().selNode.attributes.idformato) {
                var idformato = this.tpEstructuras.getSelectionModel().selNode.attributes.idformato;
                var record = _this.stFormato.getAt(_this.stFormato.find('idformato', idformato));
                if (this.tpEstructuras.getSelectionModel().selNode.getDepth() <= record.data.partes.length + 1) {
                    var pos_next_node = this.tpEstructuras.getSelectionModel().selNode.getDepth();
                    for (var i = 0; i < record.data.partes.length; i++) {
                        if (record.data.partes[i].nivel == pos_next_node)
                            var long_cod = record.data.partes[i].longitud;
                    }
                    this.winAreaResponsabilidad = new Ext.erp.winAreaResponsabilidad({
                        parent: _this,
                        long_cod: long_cod
                    });
                    this.winAreaResponsabilidad.show();
                } else {
                    mostrarMensaje(1, config.idioma.lbMsgNoAdicionarEstructura);
                }
            } else {
                this.winAreaResponsabilidad = new Ext.erp.winAreaResponsabilidad({
                    parent: _this
                });
                this.winAreaResponsabilidad.show();
            }
        }
    },
    eliminarEstructuras: function (config) {
        var _this = this;
        var url = '';
        var pregElim = '';
        var msgEliminar = '';
        if (this.cmbOpcion.getValue() === '1') {
            if (this.tpEstructuras.getSelectionModel().selNode.getDepth() === 2) {
                url = 'eliminarArea';
                pregElim = config.idioma.msgEliminarArea;
                msgEliminar = config.idioma.msgEliminarOk;
                msgEliminarError = config.idioma.msgEliminarError;
            } else {
                url = 'eliminarEstructura';
                pregElim = config.idioma.msgEliminarEstructura;
                msgEliminar = config.idioma.msgEliminarOkE;
                msgEliminarError = config.idioma.msgEliminarErrorE;
            }
        } else {
            if (this.tpEstructuras.getSelectionModel().selNode.getDepth() === 2) {
                url = 'eliminarArea';
                pregElim = config.idioma.msgEliminarEstructura;
                msgEliminar = config.idioma.msgEliminarOkE;
                msgEliminarError = config.idioma.msgEliminarErrorE;
            } else {
                url = 'eliminarEstructura';
                pregElim = config.idioma.msgEliminarEstructura;
                msgEliminar = config.idioma.msgEliminarOkE;
                msgEliminarError = config.idioma.msgEliminarErrorE;
            }
        }


        mostrarMensaje(2, pregElim, function (btn) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url: '/logistica/utiles/ubicacion/index.php/estructuraubicacion/' + url,
                    method: 'POST',
                    params: {
                        idestu: _this.nodoSeleccionadoArbol.attributes.id
                    },
                    callback: function (opt, success, resp) {
                        respMsg = Ext.decode(resp.responseText);
                        if (respMsg.val) {
                            mostrarMensaje(1, msgEliminar);
                            _this.tpEstructuras.getSelectionModel().getSelectedNode().parentNode.attributes.leaf = (_this.tpEstructuras.getSelectionModel().getSelectedNode().parentNode.childNodes.length - 1 == 0);
                            _this.tpEstructuras.getSelectionModel().getSelectedNode().parentNode.reload();
                        } else {
                            mostrarMensaje(3, msgEliminarError);
                        }
                    }
                });
            }
        });
    },
    salvarConfiguracion: function (config) {
        var _this = this;
        var fp = _this.panelCheck.getForm();
        if (!fp.isValid()) {
            mostrarMensaje(3, config.idioma.msgValoresIncorrectosWinGest);
            return;
        }
        Ext.getBody().mask(config.idioma.msgEsperaGuardarCnf);
        fp.submit({
            url: '/logistica/utiles/ubicacion/index.php/estructuraubicacion/salvarconfiguracion',
            method: 'POST',
            success: function () {
                Ext.getBody().unmask();
                mostrarMensaje(1, config.idioma.msgGuardarCnf);
                _this.cargarConfiguracionInicial(config);
            },
            failure: function () {
                Ext.getBody().unmask();
                mostrarMensaje(3, config.idioma.msgErrorGuardarCnf);
            }
        });
    },
    cargarConfiguracionInicial: function (config) {
        var _this = this;
        Ext.getBody().mask(config.idioma.msgEsperaCnf);
        Ext.Ajax.request({
            url: '/logistica/utiles/ubicacion/index.php/estructuraubicacion/cargarconfiguracion',
            method: 'POST',
            callback: function (opt, scs, resp) {
                Ext.getBody().unmask();
                if (scs) {
                    aux = Ext.decode(resp.responseText);
                    var record = {
                        data: aux.datos
                    };
                    _this.panelCheck.getForm().loadRecord(record);
                    _this.listaBotonesPanel.arrayData[0].disable();

                    if (record.data.estructura == 1) {
                        _this.estructuraTotal = true;
                    } else {
                        _this.estructuraTotal = false;
                    }
                    _this.cmbEstrategiaUbicacion.setValue(record.data.estrategiasalida);
                    _this.cmbOpcion.setValue(1);
                    var index = _this.cmbOpcion.getStore().find('no', 1);
                    _this.cmbOpcion.fireEvent('select', _this.cmbOpcion, _this.cmbOpcion.getStore().getAt(index), index);
                }
            }
        });
    }
});
