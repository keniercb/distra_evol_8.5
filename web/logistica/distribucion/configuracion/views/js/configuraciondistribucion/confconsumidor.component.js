Ext.ns('Ext.erp');
Ext.erp.confconsumidor = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    listaBotonesPanel: undefined,
    globalproducto: null,
    globalcliente: new Array(),
    idparamscliente: null,
    urlController: '/logistica/distribucion/configuracion/index.php/configuraciondistribucion/',
    _this_idioma_msgGuardadoSatisfactorio: "",
    contratados: 0,
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesPanel = new LOG.util.List();
        this._this_idioma_msgGuardadoSatisfactorio = this.idioma.msgGuardadoSatisfactorio;
        this.addToolbarButton();
        this.buildUI();
        this.createEvents();
        this.listeners = {
            'activate': function(p) {
                if (_this.cmbCriterio.getValue() == 3) {
                    _this.storeProductoConsumidor.load();
                }
                p._parent.botonGuardar.hide();
                _this.onButtonEnable();
            },
            'deactivate': function(p) {
                if (_this.cmbCriterio.getValue() == 3) {
                    _this.storeProductoConsumidor.load();
                }
                p._parent.botonGuardar.show();
            },
            'afterrender': function(p) {
                var auxHeight = p._parent.items.items[0].getSize().height + p._parent.items.items[0].getSize().height;
                var height = p._parent.getSize().height - p._parent.fpGeneral.getSize().height;
                p.setHeight(height - auxHeight);
            }
        };
        Ext.erp.confconsumidor.superclass.constructor.call(this, config);
    },
    onButtonEnable: function() {
        if (this._parent.configDatas.data) {
            this.btnAdicionarConsumidor.setDisabled((this._parent.configDatas.data.insertar != "1") ? true : (this.cmbCriterio.getValue() == 3) ? true : (this.cmbValor.hasOwnProperty('value') && this.cmbValor.value) ? false : true);
            this.btnImportarConsumidor.setDisabled(this._parent.configDatas.data.importar != "1");
        } else {
            this.btnAdicionarConsumidor.setDisabled(true);
            this.btnImportarConsumidor.setDisabled(true);
        }
    },
    addToolbarButton: function() {
        var _this = this;
        this.addToolbarButtonPanel(_this.btnAdicionarConsumidor = LOG.util.Prototipos.botonAdicionar({
            disabled: true,
            text: LOG.util.UIManager.ireplaceStyle(_this.idioma.lbBtnAdicionar, 'i', 'span', 'text-decoration: underline;'),
            idItem: 'n',
            tooltip: _this.idioma.toolAdicionar
        }));
        this.addToolbarButtonPanel(_this.btnEliminarConsumidor = LOG.util.Prototipos.botonEliminar({
            disabled: true,
            idItem: 'n',
            tooltip: _this.idioma.toolEliminar
        }));
        this.addToolbarButtonPanel(_this.btnImportarConsumidor = LOG.util.UIManager.createBtn({
            text: _this.idioma.lbImportar,
            iconCls: 'importar',
            key: {
                ctrl: true,
                alt: true,
                key: 'iI'
            },
            tooltip: _this.idioma.toolImportar
        }));
        this.addToolbarButtonPanel(_this.btnExportarConsumidor = LOG.util.UIManager.createBtn({
            text: _this.idioma.lbExportar,
            iconCls: 'exportar',
            key: {
                alt: true,
                key: 'eE'
            },
            tooltip: _this.idioma.toolExportar
        }));
        _this.btnAdicionarConsumidor.on({
            'click': function(b) {
                if (_this._parent.configDatas.data && _this._parent.configDatas.data.insertar === "1") {
                    _this.runShowWindowAdd();
                } else {
                    b.disable();
                    mostrarMensaje(3, _this.idioma.msgErrorNoTienesPermisos);
                }
            }
        });
        _this.btnEliminarConsumidor.on({
            'click': function() {
                _this.eliminarContratadosConsumidor();
            }
        });
        _this.btnImportarConsumidor.on({
            'click': function(b) {
                if (_this._parent.configDatas.data && _this._parent.configDatas.data.importar === "1") {
                    _this.importarData();
                } else {
                    b.disable();
                    mostrarMensaje(3, _this.idioma.msgErrorNoTienesPermisos);
                }
            }
        });
        _this.btnExportarConsumidor.on({
            'click': function() {
                _this.exportarData();
            }
        });

    },
    addToolbarButtonPanel: function(b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    buildUI: function() {
        var _this = this;
        _this.panelContenido = LOG.util.UIManager.initPanel({
            layout: 'border',
            region: 'center',
            items: [_this.buildPanelCenter(), _this.buildPanelWest()]
        });
        this.title = _this.idioma.lbtitle4;
        this.frame = true;
        this.layout = 'border';
        this.activeTab = 0;
        this.layoutOnTabChange = true;
        this.items = [
            LOG.util.UIManager.initPanel({
                region: 'north',
                tbar: [_this.btnAdicionarConsumidor, _this.btnEliminarConsumidor, _this.btnImportarConsumidor, _this.btnExportarConsumidor]
            }),
            LOG.util.UIManager.initPanel({
                layout: 'border',
                region: 'center',
                items: [_this.buildPanelNorth(), _this.panelContenido]
            })
        ];
    },
    buildPanelNorth: function() {
        var _this = this;
        _this.stCriterio = new Ext.data.SimpleStore({
            fields: ['no', 'criterio'],
            data: [[3, _this.idioma.lbTodos], [2, _this.idioma.lbProducto], [1, _this.idioma.lbCliente]]
        });
        _this.cmbCriterio = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbCmbCriterio,
            id: "idcmbCriterio",
            name: 'ncriterio',
            store: _this.stCriterio,
            hiddenName: 'no',
            valueField: 'no',
            displayField: 'criterio',
            triggerAction: 'all',
            mode: 'local',
            value: 3,
            emptyText: _this.idioma.lbemptyText,
            editable: false,
            width: 200
        });
        _this.cmbCriterio.on({
            'select': function(combo, rec, index) {
                _this.cambioCriterio(rec.get('no'));
            }
        });
        _this.cmbValor = new Ext.form.TriggerField({
            fieldLabel: _this.idioma.lbCmbValor,
            disabled: true,
            name: 'valor',
            triggerClass: 'x-form-cliente-trigger',
            editable: false,
            width: 160,
            anchor: '95%'
        });
        _this.cmbValor.onTriggerClick = function(e) {
            if (_this.cmbCriterio) {
                if (_this.cmbCriterio.getValue() == 1) {
                    _this.extensionClientes = new LOG.util.Client({
                        idioma: _this.idioma,
                        urlBusquedaGridPrincipal: _this.urlController + 'cargarTodosClientes',
                        formaVisualizacion: 'ventana',
                        modoSeleccion: 1,
                        autoShow: true,
                        height: 470,
                        width: 1000,
                        title: _this.idioma.tlPanelClientes,
                        usarAplicar: true,
                        gColumns: _this.buildColumns(3)
                    });

                    _this.extensionClientes.init();
                    _this.vistaClientes = _this.extensionClientes.view();
                    _this.vistaClientes.listeners = {
                        'show': function(win) {
                            _this.keyMap.stopEvent = true;
                        },
                        'hide': function(win) {
                            _this.keyMap.stopEvent = false;
                        }
                    };
                    _this.extensionClientes.vistaPrincipal.aceptarFn = function(r) {
                        if (_this.extensionClientes.smGridPrincipal.hasSelection()) {
                            _this.onButtonEnable();
                            _this.procesarContratos('NoAdicionar',
                                _this.extensionClientes.smGridPrincipal.getSelections());
                        }
                    };
                } else if (_this.cmbCriterio.getValue() == 2) {
                    _this.CrearWinIndicadores(true);
                }
            }
        };
        _this.chxVerCumplimiento = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbChxVerCumplimiento,
            hideLabel: true,
            name: 'cumplimiento',
            id: 'chxcumplimiento',
            inputValue: 0
        });
        _this.chxVerCumplimiento.on({
            'check': function(e, a) {
                _this.verCumplimiento(e, a);
            }
        });
        _this.fsSeleccionCondiciones = new Ext.form.FieldSet({
            title: _this.idioma.lbFsCondiciones,
            anchor: '95%',
            style: '-moz-border-radius:5px', //para poner los bordes redondeados
            autoHeight: true,
            layout: 'column',
            items: [
                {
                    columnWidth: .33,
                    layout: 'form',
                    items: [_this.cmbCriterio]
                },
                {
                    columnWidth: .33,
                    layout: 'form',
                    items: [_this.cmbValor]
                },
                {
                    columnWidth: .33,
                    layout: 'form',
                    bodyStyle: 'padding:15px 0px 0',
                    items: [_this.chxVerCumplimiento]
                }
            ]
        });
        _this.fpanelContenido = LOG.util.UIManager.initPanel({
            labelAlign: 'top',
            height: 100,
            frame: true,
            region: 'north',
            layout: 'form',
            items: [_this.fsSeleccionCondiciones]
        });
        return _this.fpanelContenido;
    },
    buildColumns: function(item) {
        var _this = this;
        var arrayColumns = new LOG.util.List();
        arrayColumns.add({
            header: _this.idioma.lbDenominacion,
            dataIndex: 'nombre',
            autoExpand: true,
            width: 200
        });
        arrayColumns.add({
            header: _this.idioma.lbCodigo,
            dataIndex: 'codigo',
            width: 170
        });
        arrayColumns.add({
            header: _this.idioma.lbTipocliente,
            dataIndex: 'tipocliente',
            width: 170
        });
        arrayColumns.add({dataIndex: 'idclientesproveedores'});
        arrayColumns.add({dataIndex: 'idtipo'});

        return arrayColumns;
    },
    buildPanelWest: function() {
        var _this = this;
        _this.tfAplicarColumna = new Ext.form.NumberField({
            fieldLabel: _this.idioma.lbAplicarValor,
            autoCreate: true,
            disabled: true,
            width: 120,
            maskRe: /^([0-9]*)$/,
            regex: /^([0-9]*)$/,
            minLength: _this.idioma.lbMinLengthCodigo,
            minLengthText: _this.idioma.lbMsgMinLongCodigo,
            maxLength: _this.idioma.lbMaxLengthCodigo,
            maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
            inputType: 'numeric',
            //    allowBlank: false,
            listeners: {
                'blur': function(campo) {
                    if (campo.getValue() != '' && campo.isValid() && _this.cmbColumna.getValue()) {
                        _this.btnAplicarValor.setDisabled(false);
                    } else {
                        _this.btnAplicarValor.setDisabled(true)
                    }
                },
                change: function(campo, newValue) {
                    if (campo.getValue() != '' && campo.isValid() && _this.cmbColumna.getValue()) {
                        _this.btnAplicarValor.setDisabled(false);
                    } else {
                        _this.btnAplicarValor.setDisabled(true)
                    }
                },
                invalid: function(campo) {
                    _this.btnAplicarValor.setDisabled(true)

                }
            }
        });
        /*Aplicar valor a columnas*/
        _this.stgridPanelProductoConsumidorColumna = new Ext.data.SimpleStore({
            fields: ['idcolumna', 'descripcion'],
            data: [
                [-1, _this.idioma.lbSD],
                ['planconsumo', _this.idioma.lbPlanConsumo],
                ['existencia', _this.idioma.lbExistencia],
                ['politicacobertura', _this.idioma.lbPoliticaCobertura],
                ['maximo', _this.idioma.lbMaximo],
                ['minimo', _this.idioma.lbMinimo]
            ]});
        _this.cmbColumna = new Ext.form.ComboBox({
            store: _this.stgridPanelProductoConsumidorColumna,
            name: 'columna',
            disabled: false,
            hiddenName: 'idcolumna',
            valueField: 'idcolumna',
            displayField: 'descripcion',
            width: 120,
            emptyText: _this.idioma.lbemptyText,
            mode: 'local',
            editable: true,
            forceSelection: true,
            fieldLabel: _this.idioma.lbCmpColumna,
            //    allowBlank: false,
            listeners: {
                'select': function(campo) {
                    if (_this.tfAplicarColumna.getValue() && _this.tfAplicarColumna.isValid()) {
                        _this.btnAplicarValor.setDisabled(false);
                    }
                },
                deselect: function(campo, newValue) {
                    _this.btnAplicarValor.setDisabled(true);
                }
            }
        });
        _this.btnAplicarValor = LOG.util.Prototipos.botonAplicar({
            iconCls: 'btn',
            text: _this.idioma.lbBtnAplicar,
            disabled: true,
            tooltip: _this.idioma.toolAplicarValor
        });
        _this.btnAplicarValor.on({
            'click': function(b) {
                if (!b.disabled) {
                    _this.aplicarValor();
                }
            }
        });
        _this.fpAplicarValor = LOG.util.UIManager.initPanel({
            labelAlign: 'top',
            collapsible: true,
            width: 150,
            frame: true,
            region: 'west',
            layout: 'form',
            title: _this.idioma.lbAplicarValorC,
            items: [
                _this.tfAplicarColumna,
                _this.cmbColumna,
                _this.btnAplicarValor
            ]

        });
        return _this.fpAplicarValor;
    },
    buildPanelCenter: function() {
        var _this = this;
        _this.storeProductoConsumidor = new Ext.data.GroupingStore({
            url: _this.urlController + 'cargarPlanConsumo',
            autoLoad: false,
            listeners: {
                beforeload: function(st, objeto) {
                    if (_this.cmbValor.getValue()) {
                        _this.btnAdicionarConsumidor.enable();
                    } else {
                        _this.btnAdicionarConsumidor.disable();
                    }
                    st.baseParams = {};
                    st.baseParams.idprod = (_this.cmbCriterio.getValue() == 2) ? (_this.cmbValor.value) ? _this.cmbValor.value : _this.cmbValor.getValue() : '';
                    st.baseParams.codigo = _this.filterGpCodigoProducto.getValue();
                    st.baseParams.idcliente = ((_this.cmbCriterio.getValue() == 1)) ? (_this.cmbValor.value) ? _this.cmbValor.value : _this.cmbValor.getValue() : _this.cbCliente.rawValue;
                    st.baseParams.descripcion = _this.filterGpDescripcion.getValue();
                    st.baseParams.limit = _this.gridPanelProductoConsumidor.getBottomToolbar().cbPageSize.getValue();
                },
                load: function(st, rd) {
                    if (rd.length != 0) {
                        if (_this._parent.configDatas.data) {
                            _this.tfAplicarColumna.setDisabled((_this._parent.configDatas.data.insertar != "1"));
                        }
                    } else {
                        //  mostrarMensaje(1, _this.idioma.msgNoExistenDatosDelCriterio);entes
                        mostrarMensaje(1, _this.idioma.msgNoExistenDatos);
                    }
                    _this.btnEliminarConsumidor.disable();
                }
            },
            sortInfo: {field: 'cliente', direction: "ASC"},
            groupField: 'cliente',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos"
            },
            [
                {name: 'idplanconsumo'},
                //{name: 'clienteproducto'},
                {name: 'descripcion'},
                {name: 'planconsumo', type: 'float'},
                {name: 'codigo'},
                {name: 'entregado', type: 'float'},
                {name: 'enproceso', type: 'float'},
                {name: 'pendiente', type: 'float'},
                {name: 'cumplimiento', type: 'float'},
                {name: 'existencia', type: 'float'},
                {name: 'politicacobertura', type: 'float'},
                {name: 'idestructura'},
                {name: 'fecha'},
                {name: 'idproducto'},
                {name: 'idcontrato'},
                {name: 'contrato'},
                {name: 'idprod'},
                {name: 'idcliente'},
                {name: 'cliente'},
                {name: 'maximo', type: 'float'},
                {name: 'minimo', type: 'float'},
                {name: 'fechaplanconsumo'},
                {name: 'fechaexistencia'},
                {name: 'fechamaximo'},
                {name: 'fechaminimo'},
                {name: 'fechapoliticacobertura'},
                {name: 'pciento', type: 'float'}
            ])
        });
        _this.textItemReceptor = new Ext.Toolbar.TextItem({
            text: _this.idioma.lbReceptor
        });
        _this.cbCliente = new Ext.form.TriggerField({
            fieldLabel: _this.idioma.lbCmbValor,
            disabled: false,
            name: 'clienteplanesconsumo',
            triggerClass: 'x-form-cliente-trigger',
            editable: false,
            width: 160,
            anchor: '85%'
        });
        _this.cbCliente.onTriggerClick = function(e) {
            _this.extensionClientes = new LOG.util.Client({
                idioma: _this.idioma,
                urlBusquedaGridPrincipal: _this.urlController + 'cargarTodosClientes',
                formaVisualizacion: 'ventana',
                modoSeleccion: 1,
                autoShow: true,
                height: 470,
                width: 1000,
                title: _this.idioma.tlPanelClientes,
                autoLoad: true,
                usarAplicar: true,
                gColumns: _this.buildColumns(3)
            });
            _this.extensionClientes.init();
            _this.vistaClientes = _this.extensionClientes.view();
            _this.vistaClientes.listeners = {
                'show': function(win) {
                    _this.keyMap.stopEvent = true;
                },
                'hide': function(win) {
                    _this.keyMap.stopEvent = false;
                }
            };
            _this.extensionClientes.vistaPrincipal.aceptarFn = function(r) {
                if (_this.extensionClientes.smGridPrincipal.hasSelection()) {
                    var r = _this.extensionClientes.smGridPrincipal.getSelections();
                    _this.idparamscliente = r[0].json.idclientesproveedores;
                    _this.cbCliente.rawValue = r[0].json.idclientesproveedores;
                    _this.cbCliente.setRawValue(r[0].json.idclientesproveedores);
                    _this.cbCliente.setValue(r[0].json.nombre);
                }
            };
        };
        _this.cmProductoConsumidor = new Ext.grid.ColumnModel([
            {
                header: _this.idioma.lbCodigo,
                width: 100,
                align: 'right',
                dataIndex: 'codigo'
            },
            {
                header: _this.idioma.lbHeaderDenominacion,
                width: 110,
                dataIndex: 'descripcion',
                id: 'iddescripcion'
            },
            {
                header: _this.idioma.lbCliente,
                width: 160,
                dataIndex: 'cliente',
                hidden: true
            },
            //columnas editables
            {
                header: _this.idioma.lbExistencia, width: 80, align: 'right', dataIndex: 'existencia',
                editor: new Ext.form.NumberField({
                    enableKeyEvents: true,
                    allowNegative: false,
                    allowDecimals: true,
                    minLength: _this.idioma.lbMinLengthCodigo,
                    minLengthText: _this.idioma.lbMsgMinLongCodigo,
                    maxLength: _this.idioma.lbMaxLengthCodigo,
                    maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
                    decimalPrecision: 6
                })
            },
            {
                header: _this.idioma.lbPlanConsumo, width: 110, align: 'right', dataIndex: 'planconsumo',
                editor: new Ext.form.NumberField({
                    enableKeyEvents: true,
                    allowNegative: false,
                    allowDecimals: true,
                    minLength: _this.idioma.lbMinLengthCodigo,
                    minLengthText: _this.idioma.lbMsgMinLongCodigo,
                    maxLength: _this.idioma.lbMaxLengthCodigo,
                    maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
                    decimalPrecision: 6
                })
            },
            //noy nuevas no editables
            {
                header: _this.idioma.lbEntregado,
                width: 100,
                align: 'right',
                dataIndex: 'entregado',
                hidden: true
            },
            {
                header: _this.idioma.lbEnProceso, width: 100, align: 'right', dataIndex: 'enproceso', hidden: true},
            {
                header: _this.idioma.lbPendiente, width: 100, align: 'right', dataIndex: 'pendiente', hidden: true},
            _this.growthColumn = new Ext.ux.grid.ProgressColumn({
                header: _this.idioma.lbCumplimiento,
                dataIndex: 'pciento',
                hidden: true,
                width: 120,
                align: 'right',
                textPst: '%',
                actionEvent: 'click', // click event (defaults to 'dblclick')
                colored: true, // True for pretty colors, false for just blue (defaults to false)
                editor: new Ext.form.TextField() // Define an editor if you want to edit
            }),
            {
                header: _this.idioma.lbPoliticaCobertura,
                width: 130,
                align: 'right',
                dataIndex: 'politicacobertura',
                renderer: function(v) {
                    return v + '&nbsp;<b>' + _this.idioma.txtDay + '</b>';
                },
                editor: new Ext.form.NumberField({
                    enableKeyEvents: true,
                    style: 'text-align:left',
                    allowNegative: false,
                    allowDecimals: true,
                    minLength: _this.idioma.lbMinLengthCodigo,
                    minLengthText: _this.idioma.lbMsgMinLongCodigo,
                    maxLength: _this.idioma.lbMaxLengthCodigo,
                    maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
                    decimalPrecision: 6
                })
            },
            {
                header: _this.idioma.lbMaximo, width: 70, align: 'right', dataIndex: 'maximo',
                editor: new Ext.form.NumberField({
                    enableKeyEvents: true,
                    allowNegative: false, allowDecimals: true,
                    minLength: _this.idioma.lbMinLengthCodigo,
                    minLengthText: _this.idioma.lbMsgMinLongCodigo,
                    maxLength: _this.idioma.lbMaxLengthCodigo,
                    maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
                    decimalPrecision: 6
                })
            },
            {
                header: _this.idioma.lbMinimo, width: 70, align: 'right', dataIndex: 'minimo',
                editor: new Ext.form.NumberField({
                    enableKeyEvents: true,
                    allowNegative: false, allowDecimals: true,
                    minLength: _this.idioma.lbMinLengthCodigo,
                    minLengthText: _this.idioma.lbMsgMinLongCodigo,
                    maxLength: _this.idioma.lbMaxLengthCodigo,
                    maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
                    decimalPrecision: 6
                })
            },
            {
                header: _this.idioma.lbFechaExistencia,
                width: 140,
                dataIndex: 'fechaexistencia',
                align: 'right'
            },
            {
                header: _this.idioma.lbFechaPlanConsumo,
                width: 140,
                align: 'right',
                dataIndex: 'fechaplanconsumo'
            },
            {
                header: _this.idioma.lbFechaPoliticaCobertura,
                width: 160,
                align: 'right',
                dataIndex: 'fechapoliticacobertura'
            },
            {
                header: _this.idioma.lbFechaMaximo,
                width: 100,
                align: 'right',
                dataIndex: 'fechamaximo'
            },
            {
                header: _this.idioma.lbFechaMinimo,
                width: 100,
                align: 'right',
                dataIndex: 'fechaminimo'
            }
        ]);
        //Modo de Seleccion del Grid (Simple)
        _this.smGridProductoConsumidor = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            moveEditorOnEnter: false
        });
        ////Activando un evento para despues de seleccionar una fila del grid
        _this.smGridProductoConsumidor.on(
            'rowselect', function(smodel, rowIndex, keepExisting, record) {
                if (smodel.getSelections().length == 0)
                    this.btnEliminarConsumidor.disable();
                else
                    this.btnEliminarConsumidor.enable();
            },
            this);
        _this.smGridProductoConsumidor.on(
            'rowdeselect', function(smodel, rowIndex, keepExisting, record) {
                if (smodel.getSelections().length == 0)
                    this.btnEliminarConsumidor.disable();
                else
                    this.btnEliminarConsumidor.enable();
            },
            this);
        _this.filterGpDescripcion = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbHeaderDenominacion,
            name: 'descripcion',
            anchor: '95%',
            maskRe: LOG.util.Regex.cadena,
            regex: LOG.util.Regex.cadena,
            minLength: _this.idioma.lbMinLengthText,
            minLengthText: _this.idioma.lbMsgMinLongText,
            maxLength: _this.idioma.lbMaxLengthText,
            maxLengthText: _this.idioma.lbMsgMaxLongText,
            inputType: 'string'
        });
        _this.filterGpCodigoProducto = new Ext.form.NumberField({
            name: 'codigoproducto',
            anchor: '95%',
            // maskRe: /^([a-zA-Z]*|[0-9]*)+\s?([a-zA-Z]*|[0-9]*)+\s?$/,
            // regex: /^([a-zA-Z]*|[0-9]*)+\s?([a-zA-Z]*|[0-9]*)+\s?$/,
            minLength: _this.idioma.lbMinLengthCodigo,
            minLengthText: _this.idioma.lbMsgMinLongCodigo,
            maxLength: _this.idioma.lbMaxLengthCodigo10,
            maxLengthText: _this.idioma.lbMsgMaxLongCodigo10
        });
        _this.btnBuscar = LOG.util.Prototipos.botonBuscar({
            tooltip: _this.idioma.tipBtnBuscar,
            text: _this.idioma.btnBuscar
        });
        _this.btnBuscar.on({
            'click': function() {
                _this.storeProductoConsumidor.reload();
            }
        });
        _this.btnLimpiar = LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.tipBtnLimpiar,
            text: _this.idioma.btnLimpiar
        });
        LOG.util.UIManager.applyKey(_this.btnLimpiar, _this);
        _this.btnLimpiar.on({
            'click': function() {
                _this.filterGpCodigoProducto.reset();
                _this.filterGpCodigoProducto.setValue("");
                _this.cbCliente.reset();
                _this.cbCliente.rawValue = null;
                _this.filterGpDescripcion.reset();
                _this.filterGpDescripcion.setValue("");
                _this.storeProductoConsumidor.reload();
            }
        });
        _this.gridPanelProductoConsumidor = new Ext.grid.EditorGridPanel({
            title: _this.idioma.lbHeaderListadoT,
            store: _this.storeProductoConsumidor,
            cm: _this.cmProductoConsumidor,
            sm: _this.smGridProductoConsumidor,
            autoExpandColumn: 'iddescripcion',
            region: 'center',
            clicksToEdit: 1,
            frame: true,
            iconCls: 'icon-grid',
            _parent: this,
            autoScroll: "true",
            loadMask: {
                msg: _this.idioma.msgCargandoDatos
            },
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{[(Ext.getCmp("idcmbCriterio").getValue() == 3) ?  "' + _this.idioma.txtConsumidor + '" + values.rs[0].data.contrato : ""]} {text} ({[values.rs.length]} {[values.rs.length > 1 ? "' + _this.idioma.txtElementos + '" : "' + _this.idioma.txtElemento + '"]})'
            }),
            listeners: {
                'beforeedit': _this.onBeforeEditGrid,
                'afteredit': _this.onAfterEditGrid,
                'render': function(grid) {
                    grid.getColumnModel().config.forEach(function(col, index) {
                        if (col.dataIndex === 'politicacobertura') {
                            if (_this._parent.configDatas.data) {
                                col.editor.setMaxValue(parseInt(_this._parent.configDatas.data.duracionplan));
                            }
                            col.editor.setMinValue(1);
                        }
                    });
                }
            },
            tbar: [
                new Ext.Toolbar.TextItem({
                    text: _this.idioma.lbCodigo
                }), _this.filterGpCodigoProducto,
                new Ext.menu.Separator(), new Ext.Toolbar.TextItem({
                    text: _this.idioma.lbHeaderDenominacion
                }), _this.filterGpDescripcion,
                new Ext.menu.Separator(), _this.textItemReceptor,
                _this.cbCliente,
                _this.btnBuscar,
                _this.btnLimpiar
            ],
            keys: [
                {
                    key: [13],
                    fn: function() {
                        if (_this.gridPanelProductoConsumidor.getSelectionModel().hasSelection()) {
                            _this.modificarFila(_this.gridPanelProductoConsumidor.getSelectionModel().getSelected(), _this._this_idioma_msgGuardadoSatisfactorio);                            
                        }
                    }
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: _this.storeProductoConsumidor,
                displayInfo: true
            })
        });
        return _this.gridPanelProductoConsumidor;
    },
    createEvents: function() {
        var _this = this;
        _this.keyMap = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: "bB", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        _this.btnBuscar.fireEvent('click');
                }
            },
            {
                key: Ext.EventObject.DELETE, // or
                ctrl: false,
                shift: false,
                alt: false,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        if (!_this.btnEliminarConsumidor.disabled)
                            _this.btnEliminarConsumidor.fireEvent('click');
                }
            },
            {
                key: "lL", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        _this.btnLimpiar.fireEvent('click');
                }
            },
            {
                key: "iI", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        if (!_this.btnAdicionarConsumidor.disabled)
                            _this.btnAdicionarConsumidor.fireEvent('click');
                }
            },
            {
                key: "eE", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        if (!_this.btnExportarConsumidor.disabled)
                            _this.btnExportarConsumidor.fireEvent('click');
                }
            },
            {
                key: "iI", // or
                ctrl: true,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        if (!_this.btnImportarConsumidor.disabled)
                            _this.btnImportarConsumidor.fireEvent('click');
                }
            },
            {
                key: "hH", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        _this.btnAyudaConsumidor.fireEvent('click');
                }
            },
            {
                key: "pP", // or
                ctrl: true,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        _this.btnAplicarValor.fireEvent('click');
                }
            }
        ]);
    },
    verCumplimiento: function(e, a) {
        var cmPlan = this.gridPanelProductoConsumidor.getColumnModel();
        cmPlan.setHidden(cmPlan.findColumnIndex('cliente'), !a);
        cmPlan.setHidden(cmPlan.findColumnIndex('existencia'), a);
        cmPlan.setHidden(cmPlan.findColumnIndex('entregado'), !a);
        cmPlan.setHidden(cmPlan.findColumnIndex('enproceso'), !a);
        cmPlan.setHidden(cmPlan.findColumnIndex('pendiente'), !a);
        cmPlan.setHidden(cmPlan.findColumnIndex('pciento'), !a);
        cmPlan.setHidden(cmPlan.findColumnIndex('politicacobertura'), a);
        cmPlan.setHidden(cmPlan.findColumnIndex('maximo'), a);
        cmPlan.setHidden(cmPlan.findColumnIndex('minimo'), a);
        cmPlan.setHidden(cmPlan.findColumnIndex('fechaexistencia'), a);
        cmPlan.setHidden(cmPlan.findColumnIndex('fechapoliticacobertura'), a);
        cmPlan.setHidden(cmPlan.findColumnIndex('fechamaximo'), a);
        cmPlan.setHidden(cmPlan.findColumnIndex('fechaminimo'), a);
    },
    eliminarContratadosConsumidor: function() {
        var _this = this;
        var _this_idioma_msgConfirmarGenerico = "";
        var _this_idioma_msgQuestionEliminarGenerico = "";
        if (!this.smGridProductoConsumidor.getSelected()) {
            if (_this.btnEliminarConsumidor.idItem == "n")
                _this_idioma_msgQuestionEliminarGenerico = _this.idioma.msgQuestionEliminar;
            else if (_this.btnEliminarConsumidor.idItem == "c")
                _this_idioma_msgQuestionEliminarGenerico = _this.idioma.msgQuestionEliminarP;
            else if (_this.btnEliminarConsumidor.idItem == "p")
                _this_idioma_msgQuestionEliminarGenerico = _this.idioma.msgQuestionEliminarC;
            mostrarMensaje(1, _this_idioma_msgQuestionEliminarGenerico);
        } else {
            var datos = new Array();
            var seleccion = new Array();
            seleccion = this.smGridProductoConsumidor.getSelections();
            for (var i = 0; i < seleccion.length; i++) {
                datos[i] = {idplanconsumo: seleccion[i].data.idplanconsumo};
            }
            if (_this.btnEliminarConsumidor.idItem == "n")
                _this_idioma_msgConfirmarGenerico = _this.idioma.confirmarEliminar;
            else if (_this.btnEliminarConsumidor.idItem == "c")
                _this_idioma_msgConfirmarGenerico = _this.idioma.confirmarEliminarP;
            else if (_this.btnEliminarConsumidor.idItem == "p")
                _this_idioma_msgConfirmarGenerico = _this.idioma.confirmarEliminarC;
            _this.keyMap.stopEvent = true;
            mostrarMensaje(2, _this_idioma_msgConfirmarGenerico, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    _this.onLoadMask(_this.idioma.msgEliminando);
                    Ext.Ajax.request({
                        url: _this.urlController + 'eliminaValoresConsumo',
                        method: 'POST',
                        params: {
                            datos: Ext.encode(datos)
                        },
                        callback: function(options, success, response) {
                            _this.onUnMask();
                            var responseData = Ext.decode(response.responseText);
                            var _this_idioma_msgEliminadoGenerico = "";
                            var _this_idioma_msgErrorEliminadoGenerico = "";
                            if (_this.btnEliminarConsumidor.idItem == "n") {
                                _this_idioma_msgEliminadoGenerico = _this.idioma.msgAlgunosEliminadoPlan;
                                _this_idioma_msgErrorEliminadoGenerico = _this.idioma.msgErrorEliminadoPlan;
                            } else if (_this.btnEliminarConsumidor.idItem == "c") {
                                _this_idioma_msgEliminadoGenerico = _this.idioma.msgAlgunosEliminadoProducto;
                                _this_idioma_msgErrorEliminadoGenerico = _this.idioma.msgErrorEliminadoProducto;
                            } else if (_this.btnEliminarConsumidor.idItem == "p") {
                                _this_idioma_msgEliminadoGenerico = _this.idioma.msgAlgunosEliminadoCliente;
                                _this_idioma_msgErrorEliminadoGenerico = _this.idioma.msgErrorEliminadoCliente;
                            }
                            if (responseData.codigoMsg == 1) {
                                mostrarMensaje(1, _this_idioma_msgEliminadoGenerico);
                                _this.gridPanelProductoConsumidor.getStore().reload();
                            } else {
                                mostrarMensaje(3, _this_idioma_msgErrorEliminadoGenerico);
                            }
                        }
                    });
                }
                _this.keyMap.stopEvent = false;
            });
        }
    },
    aplicarValor: function() {
        var _this = this;
        if (_this._parent.configDatas.data && _this._parent.configDatas.data.modificar === "1") {
            var cant = this.storeProductoConsumidor.getCount();
            var result = new Array(cant);
            for (var i = 0; i < cant; i++) {
                result[i] = {idplanconsumo: this.storeProductoConsumidor.getAt(i).get('idplanconsumo')};
            }

            var pvalor = _this.tfAplicarColumna.getValue();
            var pcolumna = _this.cmbColumna.getValue();
            if (pvalor && pcolumna) {
                _this.onLoadMask(_this.idioma.msgAplicarValor);
                Ext.Ajax.request({
                    url: _this.urlController + 'modificarValorColumna',
                    method: 'POST',
                    params: {
                        valor: pvalor,
                        columna: pcolumna,
                        datos: Ext.encode(result)
                    },
                    callback: function(options, success, response) {
                        _this.onUnMask();
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codigoMsg == 1) {
                            mostrarMensaje(1, _this.idioma.msgAplicadoSatisfactorio);
                            _this.gridPanelProductoConsumidor.getStore().reload({params: {start: 0, limit: 10}});
                            _this.tfAplicarColumna.reset();
                            _this.cmbColumna.reset();
                            _this.cmbColumna.disable();
                            _this.btnAplicarValor.disable();
                        }
                    }

                });
            } else {
                mostrarMensaje(3, _this.idioma.msgCriteriosVacios);
            }
        }
    },
    onBeforeEditGrid: function(e) {
        if (e.grid._parent._parent.configDatas.data.modificar === "1") {
            if (e.value != e.originalValue) {
                e.grid._parent.runBeforeEdit(e);
            } else {
                return false;
            }
            //   e.grid._parent.runBeforeEdit(e);
        } else {
            mostrarMensaje(3, e.grid._parent.idioma.msgErrorNoTienesPermisos);
            return false;
        }
    },
    runBeforeEdit: function(e) {
        var _this = this;
        if (e.field == 'consumo' || e.field == 'existencia' || e.field == 'politicacobertura' ||
            e.field == 'maximo' || e.field == 'minimo' || e.field == 'fecha') {

            if ((_this.cmbCriterio.getValue() == 1) && (!_this.cmbValor.getValue()))
                mostrarMensaje(1, _this.idioma.msgEscogerCliente);
            else if ((_this.cmbCriterio.getValue() == 2) && (!_this.cmbValor.getValue()))
                mostrarMensaje(1, _this.idioma.msgEscogerProducto);
        }
        var mod = _this.gridPanelProductoConsumidor.getStore().getModifiedRecords();
        if (mod.length > 0) {
            _this.modificarFila(mod[0], _this._this_idioma_msgGuardadoSatisfactorio);
            /*if (mod[0].getChanges().planconsumo) {
                var st = _this.gridPanelProductoConsumidor.getStore();
                st.baseParams = {};
                st.reload();
            }*/
        }
    },
    onAfterEditGrid: function(e) {
        e.grid._parent.runAfterEdit(e);
    },
    runAfterEdit: function(e) {
        var _this = this;
        var expReg;
        if (e.record.data.entero == 1) {
            expReg = numeroComa(25, 0, 0);
            if (!expReg.test(e.value)) {
                mostrarMensaje(3, _this.idioma.msgUnidadMediaEntera, function(btn) {
                    e.grid.stopEditing();
                    e.grid.getStore().selectRow(e.row);
                    e.record.set(e.field, e.originalValue);
                    e.record.commit();
                    e.grid.startEditing(e.row, e.column);
                });
            }
        }
    },
    cambioCriterio: function(jvalor) {
        var _this = this;
        _this.cmbValor.disable();
        _this.cmbValor.reset();
        _this.tfAplicarColumna.disable();
        _this.storeProductoConsumidor.removeAll();
        if (jvalor == 2) {
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('codigo'), true);
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('descripcion'), true);
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('cliente'), false);
            _this.gridPanelProductoConsumidor.getStore().srtInfo = {
                field: 'descripcion', direction: "ASC"
            };
            _this.gridPanelProductoConsumidor.getStore().groupField = 'descripcion';
            _this.gridPanelProductoConsumidor.setTitle(_this.idioma.lbHeaderListadoC);
            _this.btnAdicionarConsumidor.setTooltip(_this.idioma.toolAdicionarP);
            _this.btnEliminarConsumidor.setTooltip(_this.idioma.toolEliminarP);
            _this.btnAdicionarConsumidor.idItem = "p";
            _this.btnEliminarConsumidor.idItem = "p";
            _this.cmbValor.enable();
            //  _this.btnAdicionarConsumidor.enable();
            _this.cbCliente.show();
            _this.textItemReceptor.show();
        } else if (jvalor == 3) {
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('codigo'), false);
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('descripcion'), false);
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('cliente'), true);
            _this.gridPanelProductoConsumidor.getStore().srtInfo = {
                field: 'cliente', direction: "ASC"
            };
            _this.gridPanelProductoConsumidor.getStore().groupField = 'cliente';
            _this.cmbValor.disable();
            _this.btnAdicionarConsumidor.disable();
            _this.gridPanelProductoConsumidor.getStore().baseParams = {};
            _this.storeProductoConsumidor.load({params: {start: 0, limit: 10}});
            _this.btnAdicionarConsumidor.setTooltip(_this.idioma.toolAdicionar);
            _this.btnEliminarConsumidor.setTooltip(_this.idioma.toolEliminar);
            _this.btnAdicionarConsumidor.idItem = "n";
            _this.btnEliminarConsumidor.idItem = "n";
            _this.cbCliente.show();
            _this.textItemReceptor.show();
        } else if (jvalor == 1) {
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('codigo'), false);
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('descripcion'), false);
            _this.gridPanelProductoConsumidor.getColumnModel().setHidden(_this.gridPanelProductoConsumidor.getColumnModel().findColumnIndex('cliente'), true);
            _this.gridPanelProductoConsumidor.getStore().srtInfo = {
                field: 'cliente', direction: "ASC"
            };
            _this.gridPanelProductoConsumidor.getStore().groupField = 'cliente';
            _this.cmbValor.enable();
            //   _this.btnAdicionarConsumidor.enable();
            _this.gridPanelProductoConsumidor.setTitle(_this.idioma.lbHeaderListadoP);
            _this.btnAdicionarConsumidor.setTooltip(_this.idioma.toolAdicionarC);
            _this.btnEliminarConsumidor.setTooltip(_this.idioma.toolEliminarC);
            _this.btnAdicionarConsumidor.idItem = "c";
            _this.btnEliminarConsumidor.idItem = "c";
            _this.cbCliente.hide();
            _this.textItemReceptor.hide();
        }
    },
    runShowWindowAdd: function() {
        var _this = this;
        if (this.cmbCriterio.getValue() == 2) {
            _this.extensionClientes = new LOG.util.Client({
                idioma: _this.idioma,
                urlBusquedaGridPrincipal: _this.urlController + 'cargarTodosClientes',
                formaVisualizacion: 'ventana',
                modoSeleccion: 3,
                autoShow: true,
                height: 470,
                width: 1000,
                autoLoad: false,
                title: _this.idioma.tlPanelClientes,
                usarAplicar: false,
                gColumns: _this.buildColumns(3)
            });
            _this.extensionClientes.init();
            _this.vistaClientes = _this.extensionClientes.view();
            _this.extensionClientes.getStorePrincipal().on({
                'beforeload': function(st, opts) {
                    st.initBaseParams.idclientes = Ext.encode(_this.getClientesIdByStore());
                }
            });
            _this.extensionClientes.getStorePrincipal().load({
                params: {
                    idclientes: Ext.encode(_this.getClientesIdByStore())
                }
            });
            _this.vistaClientes.listeners = {
                'show': function(win) {
                    _this.keyMap.stopEvent = true;
                },
                'hide': function(win) {
                    _this.keyMap.stopEvent = false;
                }
            };
            _this.extensionClientes.vistaPrincipal.aceptarFn = function(r) {
                if (_this.extensionClientes.smGridPrincipal.hasSelection()) {
                    _this.procesarContratos('Adicionar',
                        _this.extensionClientes.smGridPrincipal.getSelections());
                }
            };
        } else if (this.cmbCriterio.getValue() == 1) {
            this.CrearWinIndicadores(false);
        }
        contratados = 0;
    },
    getClientesIdByStore: function() {
        var ids = new Array();
        this.gridPanelProductoConsumidor.getStore().data.items.forEach(function(item, index) {
            ids.push(item.get('idcliente'));
        });
        return ids;
    },
    importarData: function() {
        var _this = this;
        if (!this.winImport) {
            this.fileImport = new Ext.ux.form.FileUploadField({
                xtype: 'fileuploadfield',
                emptyText: _this.idioma.txtEmptyTextExaminar,
                name: 'filexml',
                invalidText: _this.idioma.txtInvalidTextExaminar,
                buttonText: _this.idioma.txtButtonExaminar,
//                buttonCfg: {
//                    width: 70
//                },
                listeners: {
                    'fileselected': function(field, v) {
                        if (v)
                            _this.winImport.getButton(2).setDisabled(false);
                    }
                }
            });
            this.formImport = new Ext.FormPanel({
                fileUpload: true,
                frame: true,
                region: 'center',
                bodyStyle: 'padding: 10px 10px 0 10px;',
                labelWidth: 50,
                defaults: {
                    anchor: '95%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                items: [this.fileImport]
            });
            this.winImport = new LOG.util.Window({
                title: _this.idioma.ttlWindowImportarDatos,
                layout: 'fit',
                items: [this.formImport],
                _parent: this,
                height: 120,
                width: 580,
                aceptarFn: function() {
                    if (_this.formImport.getForm().isValid()) {
                        _this.winImport.getButton(2).setDisabled(false);
                        _this.formImport.getForm().submit({
                            url: _this.urlController + 'cargarPlanConsumo',
                            waitTitle: _this.idioma.msgWaitTitle,
                            waitMsg: _this.idioma.msgCargandoDatos,
                            success: function(fp, o) {
                                if (o.result.codigoMsg == 1) {
                                    if (o.result.exists.length > 1)
                                        mostrarMensaje(1, _this.idioma.msgExistenProductoAsociodos);
                                    mostrarMensaje(1, (_this.contratados == 1) ? _this.idioma.msgClienteContratosAsociados : _this.idioma.msgClienteProductoAsociados);
                                } else {
                                    mostrarMensaje(3, _this.idioma.msgErrorClienteProductoAsociados);
                                }
                                _this.gridPanelProductoConsumidor.getStore().reload();
                            },
                            failure: function(fp, o) {
                                if (o.result.codigoMsg === 2) {
                                    mostrarMensaje(3, _this.idioma.msgErrorFormatoXml);
                                } else if (o.result.codigoMsg === 1) {
                                    mostrarMensaje(3, _this.idioma.msgErrorClienteProductoAsociados);
                                } else if (o.result.codigoMsg === 3) {
                                    mostrarMensaje(3, _this.idioma.msgExistenProductoAsociodos);
                                } else if (o.result.codigoMsg === 4) {
                                    mostrarMensaje(3, _this.idioma.msgErrorFormatoTypeXml);
                                }
                            }
                        });
                    }
                },
                usarAplicar: false,
                listeners: {
                    'show': function(win) {
                        _this.keyMap.stopEvent = true;
                        win.getButton(2).setDisabled(true);
                    },
                    'hide': function(win) {
                        _this.keyMap.stopEvent = false;
                    }
                }
            });
        }
        this.winImport.show();
    },
    exportarData: function() {
        var _this = this, baseParams = {};
        baseParams.idprod = (_this.cmbCriterio.getValue() == 2) ? (_this.cmbValor.rawValue) ? _this.cmbValor.rawValue : _this.cmbValor.getRawValue() : '';
        baseParams.codigo = _this.filterGpCodigoProducto.getValue();
        baseParams.idcliente = ((_this.cmbCriterio.getValue() == 1)) ? (_this.cmbValor.value) ? _this.cmbValor.value : _this.cmbValor.getValue() : (_this.cbCliente.value) ? _this.cbCliente.value : _this.cbCliente.getValue();
        baseParams.descripcion = _this.filterGpDescripcion.getValue();
//        baseParams.limit = _this.gridPanelProductoConsumidor.getBottomToolbar().cbPageSize.getValue();
        window.open(_this.urlController + 'exportarPlanConsumo?datas=' + Ext.encode(baseParams), '');
    },
    CrearWinIndicadores: function(seleccionSimple) {
        var _this = this;
        /*var winProductos = new LOG.lb.producto.View({
            idioma: _this.idioma,
            usarFiltroArea: false,
            modoSeleccion: (seleccionSimple) ? 1 : 3,
            _parent: _this,
            parametros: {
                idestructura: _this.idDeposito
            },
            doAction: function(records) {
                if (seleccionSimple)
                    _this.onButtonEnable();
                _this.runAddIndicadores(records, seleccionSimple);
            }
        });
        winProductos.init();
        _this.vistaProductos = winProductos.view();*/

        LOG.inv.maestroproductos.Loader.init(function() {
            _this.vistaProductos = new LOG.lb.maestroproductos.UIProductos({
                tipo: 1,
                parametros: {
                    idestructura: _this.idDeposito
                },
                doAction: function(records) {
                    if (seleccionSimple)
                        _this.onButtonEnable();
                    _this.runAddIndicadores(records, seleccionSimple);
                }
            });
            _this.vistaProductos.listeners = {
                'show': function(win) {
                    _this.keyMap.stopEvent = true;
                },
                'hide': function(win) {
                    _this.keyMap.stopEvent = false;
                }
            };
            _this.vistaProductos.show();
        });

        /*_this.vistaProductos.listeners = {
            'show': function(win) {
                _this.keyMap.stopEvent = true;
            },
            'hide': function(win) {
                _this.keyMap.stopEvent = false;
            }
        };
        _this.vistaProductos.show();*/
    },
    runAddIndicadores: function(record_seleccionado, seleccionSimple) {
        var _this = this;
        var gp = _this.gridPanelProductoConsumidor;
        var st = gp.getStore();
        if (record_seleccionado.length == 0) {
            mostrarMensaje(1, _this.msgPorFavorSeleccionProductos);
        } else {
            if (seleccionSimple) {
                _this.globalproducto = record_seleccionado[0].json.idindicador;
                _this.cmbValor.setValue(record_seleccionado[0].data.idindicador);
                _this.cmbValor.value = (record_seleccionado[0].data.idindicador);
                _this.cmbValor.rawValue = record_seleccionado[0].json.denominacion;
                _this.cmbValor.setRawValue(record_seleccionado[0].json.denominacion);
                st.reload();
            } else {
                if (record_seleccionado && record_seleccionado.length > 0) {
                    var arrayids = Array();
                    for (var i = 0; i < record_seleccionado.length; i++) {
                        var idprod = record_seleccionado[i].json.idindicador;
                        arrayids.push(idprod);
                    }
                    Ext.Ajax.request({
                        method: 'POST',
                        params: {
                            productos: Ext.encode(arrayids),
                            clientes: Ext.encode(_this.globalcliente)
                        },
                        url: _this.urlController + 'asociarClientesProducto',
                        callback: function(opt, sus, resp) {
                            var rd = Ext.decode(resp.responseText);
                            var _this_idioma_msgAsociadosGenerico = "";
                            if (_this.contratados == 1)
                                _this_idioma_msgAsociadosGenerico = _this.idioma.msgClienteContratosAsociados;
                            else if (_this.contratados == 0)
                                _this_idioma_msgAsociadosGenerico = _this.idioma.msgClienteProductoAsociados;
                            if (rd.codigoMsg == 1) {
                                if (rd.flags == 1)
                                    mostrarMensaje(1, _this.idioma.msgExistenProductoAsociodos);
                                mostrarMensaje(1, _this_idioma_msgAsociadosGenerico);
                            } else {
                                mostrarMensaje(3, _this.idioma.msgErrorClienteProductoAsociados);
                            }
                            st.reload();
                        }
                    });
                }
            }
        }
    },
    modificarFila: function(datos, _this_idioma_msgGuardadoSatisfactorio) {
        var _this = this;
        if (datos != undefined) {
            var modificados = datos.getChanges();
            modificados.idplanconsumo = datos.data.idplanconsumo;
            _this.onLoadMask(_this.idioma.tbContenidomsgGuardando);
            Ext.Ajax.request({
                url: _this.urlController + 'modificarfila',
                method: 'POST',
                params: {datos: Ext.encode(modificados)},
                callback: function(options, success, response) {
                    _this.onUnMask();
                    var responseData = Ext.decode(response.responseText);
                    mostrarMensaje(1, _this_idioma_msgGuardadoSatisfactorio);
                    if (modificados.politicacobertura){
                        datos.set('fechapoliticacobertura', responseData.fechaactualizacion);
                        datos.set('politicacobertura', modificados.politicacobertura);
                    }
                    if (modificados.maximo){
                        datos.set('fechamaximo', responseData.fechaactualizacion);
                        datos.set('maximo', modificados.maximo);
                    }
                    if (modificados.minimo){
                        datos.set('fechaminimo', responseData.fechaactualizacion);
                        datos.set('minimo', modificados.minimo);
                    }
                    if (modificados.planconsumo){
                        datos.set('fechaplanconsumo', responseData.fechaactualizacion);
                        datos.set('planconsumo', modificados.planconsumo);
                    }
                    if (modificados.existencia){
                        datos.set('fechaexistencia', responseData.fechaactualizacion);
                        datos.set('existencia', modificados.existencia);
                    }
                    datos.commit();
                    var st = _this.gridPanelProductoConsumidor.getStore();
                    st.reload();
                }
            });
        }
    },
    procesarContratos: function(opcion, contratos) {
        var _this = this;
        var st = _this.gridPanelProductoConsumidor.getStore();
        switch (opcion) {
            case 'NoAdicionar' :
                {
                    _this.cmbValor.setValue(contratos[0].data.idclientesproveedores);
                    _this.cmbValor.setRawValue(contratos[0].data.nombre);
                    _this.cmbValor.value = contratos[0].data.idclientesproveedores;
                    _this.cmbValor.rawValue = contratos[0].data.nombre;
                    _this.globalcliente[0] = {
                        idcliente: contratos[0].data.idclientesproveedores,
                        idcontrato: contratos[0].data.idcontrato
                    };
                    st.baseParams = {};
                    st.baseParams.idcliente = contratos[0].data.idclientesproveedores;
                    st.baseParams.idcontrato = contratos[0].data.idcontrato;
                    st.baseParams.limit = 20;
                    st.load();
                }
                break;
            case 'Adicionar' :
                {
                    var arrayclientres = new Array();
                    for (var i = 0; i < contratos.length; i++) {
                        arrayclientres[i] = {
                            idcliente: contratos[i].data.idclientesproveedores,
                            idcontrato: contratos[i].data.idcontrato
                        }
                    }
                    Ext.Ajax.request({
                        url: _this.urlController + 'asociarClientesProducto',
                        method: 'POST',
                        params: {
                            clientes: Ext.encode(arrayclientres),
                            productos: Ext.encode(_this.globalproducto)
                        },
                        callback: function(options, success, response) {
                            var responseText = Ext.decode(response.responseText);
                            _this.onUnMask();
                            if (responseText.codigoMsg == 1) {
                                mostrarMensaje(1, _this.idioma.msgClientesAndProductosAsociados);
                                st.baseParams = {};
                                st.baseParams.limit = 20;
                                st.baseParams.idprod = _this.globalproducto;
                                st.load();
                            } else {
                                mostrarMensaje(3, _this.idioma.msgErrorClientesAndProductosAsociados);
                            }
                        }
                    });
                }
        }
    },
    onLoadMask: function(msg) {
        var myMask = new Ext.LoadMask(this.gridPanelProductoConsumidor.getEl(), {msg: msg});
        myMask.show();
    },
    onUnMask: function() {
        this.gridPanelProductoConsumidor.getEl().unmask();
    }
});
LOG.util.Client = Ext.extend(LOG.util.UITemplate, {
    busquedaBasica: true,
    formaVisualizacion: 'panel',
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.concepto = this.idioma.toolBuscarCliente;
        LOG.util.Client.superclass.constructor.call(this, config);
        if (config.formaVisualizacion === 'ventana') {
            LOG.util.UIManager.apply(this.getVistaPrincipal(), {
                height: config.height,
                width: config.width,
                title: config.title,
                aceptarFn: config.aceptarFn,
                usarAplicar: config.usarAplicar
            });
        }
    },
    initDefaultColumns: function() {
        var _this = this;
        for (var i = 0; i < _this.gColumns.count(); i++) {
            _this.addGridColumn(_this.gColumns.getItem(i));
        }
    },
    render: function() {
        var _this = this;
        var p = LOG.util.Client.superclass.render.call(this);
        return p;
    }
});
/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux.form');
/**
 * @class Ext.ux.form.FileUploadField
 * @extends Ext.form.TextField
 * Creates a file upload field.
 * @xtype fileuploadfield
 */
Ext.ux.form.FileUploadField = Ext.extend(Ext.form.TextField, {
    /**
     * @cfg {String} buttonText The button text to display on the upload button (defaults to
     * 'Browse...').  Note that if you supply a value for {@link #buttonCfg}, the buttonCfg.text
     * value will be used instead if available.
     */
    buttonText: 'Browse...',
    /**
     * @cfg {Boolean} buttonOnly True to display the file upload field as a button with no visible
     * text field (defaults to false).  If true, all inherited TextField members will still be available.
     */
    buttonOnly: false,
    /**
     * @cfg {Number} buttonOffset The number of pixels of space reserved between the button and the text field
     * (defaults to 3).  Note that this only applies if {@link #buttonOnly} = false.
     */
    buttonOffset: 3,
    /**
     * @cfg {Object} buttonCfg A standard {@link Ext.Button} config object.
     */

    // private
    readOnly: true,
    /**
     * @hide
     * @method autoSize
     */
    autoSize: Ext.emptyFn,
    // private
    initComponent: function() {
        Ext.ux.form.FileUploadField.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event fileselected
             * Fires when the underlying file input field's value has changed from the user
             * selecting a new file from the system file selection dialog.
             * @param {Ext.ux.form.FileUploadField} this
             * @param {String} value The file value returned by the underlying file input field
             */
            'fileselected'
            );
    },
    // private
    onRender: function(ct, position) {
        Ext.ux.form.FileUploadField.superclass.onRender.call(this, ct, position);
        this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-file-wrap'});
        this.el.addClass('x-form-file-text');
        this.el.dom.removeAttribute('name');
        this.createFileInput();
        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.wrap,
            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
        }));
        if (this.buttonOnly) {
            this.el.hide();
            this.wrap.setWidth(this.button.getEl().getWidth());
        }

        this.bindListeners();
        this.resizeEl = this.positionEl = this.wrap;
    },
    bindListeners: function() {
        this.fileInput.on({
            scope: this,
            mouseenter: function() {
                this.button.addClass(['x-btn-over', 'x-btn-focus'])
            },
            mouseleave: function() {
                this.button.removeClass(['x-btn-over', 'x-btn-focus', 'x-btn-click'])
            },
            mousedown: function() {
                this.button.addClass('x-btn-click')
            },
            mouseup: function() {
                this.button.removeClass(['x-btn-over', 'x-btn-focus', 'x-btn-click'])
            },
            change: function() {
                var v = this.fileInput.dom.value;
                this.setValue(v);
                this.fireEvent('fileselected', this, v);
            }
        });
    },
    createFileInput: function() {
        this.fileInput = this.wrap.createChild({
            id: this.getFileInputId(),
            name: this.name || this.getId(),
            cls: 'x-form-file',
            tag: 'input',
            type: 'file',
            size: 1
        });
    },
    reset: function() {
        if (this.rendered) {
            this.fileInput.remove();
            this.createFileInput();
            this.bindListeners();
        }
        Ext.ux.form.FileUploadField.superclass.reset.call(this);
    },
    // private
    getFileInputId: function() {
        return this.id + '-file';
    },
    // private
    onResize: function(w, h) {
        Ext.ux.form.FileUploadField.superclass.onResize.call(this, w, h);
        this.wrap.setWidth(w);
        if (!this.buttonOnly) {
            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
            this.el.setWidth(w);
        }
    },
    // private
    onDestroy: function() {
        Ext.ux.form.FileUploadField.superclass.onDestroy.call(this);
        Ext.destroy(this.fileInput, this.button, this.wrap);
    },
    onDisable: function() {
        Ext.ux.form.FileUploadField.superclass.onDisable.call(this);
        this.doDisable(true);
    },
    onEnable: function() {
        Ext.ux.form.FileUploadField.superclass.onEnable.call(this);
        this.doDisable(false);
    },
    // private
    doDisable: function(disabled) {
        this.fileInput.dom.disabled = disabled;
        this.button.setDisabled(disabled);
    },
    // private
    preFocus: Ext.emptyFn,
    // private
    alignErrorIcon: function() {
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    }

});
Ext.reg('fileuploadfield', Ext.ux.form.FileUploadField);
// backwards compat
Ext.form.FileUploadField = Ext.ux.form.FileUploadField;
