Ext.ns('Ext.aft.indicadores');
Ext.ns('Ext.LOG.NComboBox');

/**
 * @class movimiento
 * Interfaz de Gestión de Movimientos
 *
 * @author Manuel Yhon Figueroa
 * @copyright XETID Cuba
 * @version 1.0
 */
var datos = new Array();
Ext.aft.movimiento = Ext.extend(Ext.Window, {
    maximized: true,
    smCentral: false,
    columnsCentral: false,
    stCentral: false,
    autoExpandColumn: 'expandir',
    tbarGeneral: false,
    tbarGridCentral: [],
    gridCentral: false,
    pContenedor: false,
    closeAction: 'close',
    constructor: function (config) {
        Ext.aft.movimiento.superclass.constructor.apply(this, arguments);

    },
    initSmDefault: function () {


        if (this.smCentral == false) {
            return new Ext.grid.RowSelectionModel({
                singleSelect: true,
                moveEditorOnEnter: false
            });
        }
        return this.smCentral;
    },
    getTbarDefault: function () {
        var _this = this;

        this.btnAdicionarProd = new Ext.Button({
            iconCls: 'adicionar',
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.lbTtBtnProductos
        });

        this.btnEliminarProd = new Ext.Button({
            iconCls: 'eliminar',
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.lbTtBtnEliminar,
            disabled: true
        });

        this.btnGuardarCant = new Ext.Button({
            iconCls: 'guardar',
            text: this.idioma.lbBtnGuardarCant,
            tooltip: this.idioma.lbTtBtnGuardarCant
        });

        this.btnConfirmarDoc = new Ext.Button({
            iconCls: 'confirmar',
            text: this.idioma.lbBtnConfirmar,
            tooltip: this.idioma.lbTtBtnConfirmar,
            disabled: true
        });

        this.btnAnularDoc = new Ext.Button({
            iconCls: 'anular',
            text: this.idioma.lbBtnAnularEstatus,
            tooltip: this.idioma.lbTtBtnAnularEstatus,
            disabled: true
        });

        this.btnAprobarDoc = new Ext.Button({
            iconCls: 'aprobar',
            text: this.idioma.lbBtnAprobar,
            tooltip: this.idioma.lbTtBtnAprobar,
            disabled: true
        });

        this.btnImpromirMod = new Ext.Button({
            iconCls: 'imprimir',
            text: this.idioma.lbBtnImprimir,
            tooltip: this.idioma.lbTtBtnImprimir,
            disabled: true
        });

        this.btnImportarListado = new Ext.Button({
            iconCls: 'importar',
            text: this.idioma.lbImportarListado,
            tooltip: this.idioma.lbTtBtnImportarListado,
            disabled: true
        });

        this.btnAyuda = new Ext.Button({
            iconCls: 'ayuda',
            text: this.idioma.lbBtnAyuda,
            tooltip: this.idioma.lbTtBtnTitleAyuda
        });

        this.btnAdicionarProd.on('click', function () {
            _this.onBtnAdicionarProdClick();
        });
        this.btnEliminarProd.on('click', function () {
            _this.onBtnEliminarProdClick();
        })
        this.btnAprobarDoc.on('click', function () {
            _this._parent.onBtnCambiarEstadoDocumentoClick({iddocumento: _this.datos.iddocumento, concepto: 'aprobar'});
        });
        this.btnConfirmarDoc.on('click', function () {
            _this._parent.onBtnCambiarEstadoDocumentoClick({
                iddocumento: _this.datos.iddocumento,
                concepto: 'confirmar'
            });
        });
        this.btnAnularDoc.on('click', function () {
            _this._parent.onBtnCambiarEstadoDocumentoClick({
                iddocumento: _this.datos.iddocumento,
                concepto: 'cancelar'
            });
        });
        this.btnImpromirMod.on('click', function () {
        });

        return [this.btnAdicionarProd, this.btnEliminarProd, /*this.btnGuardarCant,  */this.btnImportarListado, this.btnConfirmarDoc, this.btnAnularDoc, this.btnAprobarDoc, /* this.btnImpromirMod,*/ '->', this.btnAyuda];
    },
    initComponent: function () {
        var _this = this;
        //if (this.columnsCentral == false)
        //throw ('El atributo columnsCentral es obligatorio')

        //if (this.stCentral == false)
        //throw ('El atributo stCentral es obligatorio')

        this.gridCentral = new Ext.grid.EditorGridPanel({
            iconCls: 'icon-grid',
            region: 'center',
            clicksToEdit: 1,
            expansible: true,
            autoScroll: true,
            autoExpandColumn: _this.autoExpandColumn,
            sm: _this.initSmDefault(),
            store: _this.stCentral,
            columns: _this.columnsCentral,
            tbar: _this.tbarGridCentral,
            loadMask: {
                store: _this.stCentral
            },
            view: this.view,
            bbar: new Ext.PagingToolbar({
                pageSize: 30,
                store: _this.stCentral,
                displayInfo: true                
            })
        })

        _this.stCentral.on({
            'load': function (store, records, options) {
                if (store.getCount() > 0) {

                    if (store.reader.jsonData.indicadoresNoMostrar) {
                        _this.indicadoresNoMostrar = store.reader.jsonData.indicadoresNoMostrar;
                    }
                } else {
                    _this.indicadoresNoMostrar = new Array();
                }
            }
        });

        this.pContenedor = new Ext.Panel({
            border: false,
            bodyBorder: false,
            region: 'center',
            layout: 'border',
            tbar: (_this.tbarGeneral == false) ? _this.getTbarDefault() : _this.tbarGeneral,
            items: [_this.gridCentral]
        })

        Ext.apply(this, {
            layout: 'border',
            items: _this.pContenedor,
            buttons: [
                {
                    iconCls: 'cerrar',
                    id: 'idBtnCerrarMovimientos',
                    text: _this.idioma.lbBtnCerrar,
                    tooltip: _this.idioma.lbTtBtnCerrar,
                    handler: function () {
                        _this.hide();
                    }
                }
            ]
        })

        Ext.aft.movimiento.superclass.initComponent.call(this);
    },
    //    initInventario: function () {
    //
    //        this.ubicarprodBtn = new Ext.Button({
    //            id: 'idubicproductoBtn',
    //            iconCls: 'ubicarproducto',
    //            text: this.idioma.lbBtnUbicarProd,
    //            tooltip: this.idioma.lbTtBtnUbicarProd,
    //            handler: function () {
    //                _this.onBtnUbicacionClick();
    //            }
    //        });
    //
    //        this.registrarmedicionprodBtn = new Ext.Button({
    //            id: 'idregmedicproductoBtn',
    //            iconCls: 'filtrar',
    //            text: this.idioma.lbBtnRegistrarMedicion,
    //            tooltip: this.idioma.lbTtRegistrarMedicion,
    //            disabled: true,
    //            handler: function () {
    //                _this._parent.registrarmedicion();
    //            }
    //        });
    //
    //        this.nropieza = new Ext.form.TextField({
    //            enableKeyEvents: true,
    //            id: 'idnropieza',
    //            autoCreate: true,
    //            width: 120,
    //            maskRe: '/^([a-zA-ZáéíóúñüÑ0-9-_/.]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.]*)+$/',
    //            regex: '/^([a-zA-ZáéíóúñüÑ0-9-_/.]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.]*)+$/',
    //            regexText: this.idioma.lbMsgInfoCaract
    //        });
    //
    //        this.stProducto = new Ext.data.Store({
    //            url: 'cargarproductosdocumento',
    //            autoLoad: true,
    //            listeners: {
    //                beforeload: function (stProducto, objeto) {
    //                    stProducto.baseParams.iddeposito = _this.iddeposito;
    //                    /*if(Ext.getCmp('idcodigo').getValue())
    //                     stProducto.baseParams.codigo = Ext.getCmp('idcodigo').getValue();
    //                     else
    //                     stProducto.baseParams.codigo ={};
    //                     if(Ext.getCmp('idnropieza').getValue())
    //                     stProducto.baseParams.nropieza = Ext.getCmp('idnropieza').getValue();
    //                     else
    //                     stProducto.baseParams.nropieza ={};
    //                     if(Ext.getCmp('iddescripcion').getValue())
    //                     stProducto.baseParams.descripcion = Ext.getCmp('iddescripcion').getValue();
    //                     else
    //                     stProducto.baseParams.descripcion ={};*/
    //
    //                    stProducto.baseParams.iddoc = _this.iddocumento;
    //                },
    //                load: function (stProducto, objeto) {
    //                    if (stProducto.getCount() > 0) {
    //                        _this.gpProducto.getSelectionModel().selectRow(0);
    //                        _this.btnImpromirMod.enable();
    //                        _this.btnEliminarProd.enable();
    //                    } else if (stProducto.getCount() == 0 || ! _this.gpProducto.getSelectionModel().hasSelection()) {
    //                        _this.desabilitarBotones();
    //                        mostrarMensaje(1, _this.idioma.MsgInfoNoDatos);
    //                    }
    //                }
    //            },
    //            reader: new Ext.data.JsonReader({
    //                root: 'datos',
    //                totalProperty: 'cantidad',
    //                id: 'idmovimiento',
    //                fields: [
    //                    {
    //                        name: 'idmovimiento'
    //                    },
    //                    {
    //                        name: 'idproducto'
    //                    },
    //                    {
    //                        name: 'codigoprod'
    //                    },
    //                    {
    //                        name: 'descripcion'
    //                    },
    //                    {
    //                        name: 'numeropieza'
    //                    },
    //                    {
    //                        name: 'descripcionumedida'
    //                    },
    //                    {
    //                        name: 'idumedida'
    //                    },
    //                    {
    //                        name: 'precio'
    //                    },
    //                    {
    //                        name: 'cantidad'
    //                    },
    //                    {
    //                        name: 'importecontable'
    //                    },
    //                    {
    //                        name: 'minimo'
    //                    },
    //                    {
    //                        name: 'maximo'
    //                    },
    //                    {
    //                        name: 'text'
    //                    },
    //                    {
    //                        name: 'idlineaproducto'
    //                    },
    //                    {
    //                        name: 'lineaproducto'
    //                    },
    //                    {
    //                        name: 'idpais'
    //                    },
    //                    {
    //                        name: 'pais'
    //                    }
    //                ]
    //            })
    //        });
    //
    //        this.stLineaProducto = new Ext.data.Store({
    //            url: 'cargarlineaproducto',
    //            autoLoad: true,
    //            reader: new Ext.data.JsonReader({
    //                id: "idlineaproducto"
    //            }, [
    //                {
    //                    name: 'idlineaproducto'
    //                },
    //                {
    //                    name: 'denominacion'
    //                },
    //                {
    //                    name: 'codigo'
    //                }
    //            ])
    //        });
    //
    //        this.stPais = new Ext.data.Store({
    //            url: 'cargarnacionalidad',
    //            autoLoad: true,
    //            reader: new Ext.data.JsonReader({
    //                id: "id"
    //            }, [
    //                {
    //                    name: 'idpais'
    //                },
    //                {
    //                    name: 'pais', mapping: 'nombrepais'
    //                }
    //            ])
    //        });
    //
    //        this.smProducto = new Ext.grid.RowSelectionModel({
    //            singleSelect: true,
    //            moveEditorOnEnter: false
    //        });
    //
    //        this.gpProducto = new Ext.grid.EditorGridPanel({
    //            iconCls: 'icon-grid',
    //            region: 'center',
    //            clicksToEdit: 1,
    //            expansible: true,
    //            autoScroll: true,
    //            autoExpandColumn: 'expandir',
    //            loadMask: {
    //                store: _this.stProducto
    //            },
    //            sm: _this.smProducto,
    //            store: _this.stProducto,
    //            columns: [
    //                new Ext.grid.RowNumberer({ header: 'N.\xb0', width: 30}), {id: 'expandir', header: this.idioma.lbGridCodigoDescrip, width: 40, dataIndex: 'text', sortable: false}, {header: this.idioma.lbNopieza, width: 100, dataIndex: 'numeropieza', sortable: false}, {header: this.idioma.lbGridLineaProd, width: 140, dataIndex: 'lineaproducto', sortable: true,
    //                    editor: new Ext.form.ComboBox({
    //                        id: 'idlineaProd',
    //                        name: 'idlineaproducto',
    //                        hiddenName: 'denominacion',
    //                        valueField: 'denominacion', // valor que se envia para la BD al seleccionar
    //                        displayField: 'denominacion', // valor que se muestra en la interfaz para el usuario
    //                        lazyRender: true,
    //                        store: _this.stLineaProducto, // store que tiene los datos a mostrar
    //                        autoCreate: true,
    //                        typeAhead: true,
    //                        triggerAction: 'all',
    //                        //editable : false,
    //                        mode: 'local',
    //                        emptyText: this.idioma.lbMsgEmptylineaProd,
    //                        anchor: '90%',
    //                        readOnly: true,
    //                        listeners: {
    //                            select: function (combo, record, index) {
    //                                _this.smProducto.getSelected().set('idlineaproducto', record.get('idlineaproducto'));
    //                            }
    //                        }
    //                    })
    //                }, {header: this.idioma.lbGridUM, width: 60, dataIndex: 'descripcionumedida', sortable: false}, {header: this.idioma.lbGridPrecio, width: 80, dataIndex: 'precio', sortable: false,
    //                    editor: new Ext.form.NumberField({
    //                        id: 'idprecionum',
    //                        allowBlank: true,
    //                        enableKeyEvents: true,
    //                        allowNegative: false,
    //                        allowDecimals: true,
    //                        decimalPrecision: 6,
    //                        listeners: {
    //                            'focus': function (campo) {
    //                                if (campo.getValue() == 0)
    //                                    campo.setValue('');
    //                            },
    //                            'keyup': function (field, eventobj) {
    //                                prec = field.getValue();
    //                            },
    //                            blur: function () {
    //                                // calcularImporte();
    //                            }
    //                        }
    //                    })
    //                }, {header: this.idioma.lbGridCantidad, width: 60, dataIndex: 'cantidad', sortable: false,
    //                    editor: new Ext.form.NumberField({
    //                        allowBlank: true,
    //                        enableKeyEvents: true,
    //                        allowNegative: false,
    //                        allowDecimals: true,
    //                        decimalPrecision: 6,
    //                        listeners: {
    //                            'focus': function (campo) {
    //                                if (campo.getValue() == 0)
    //                                    campo.setValue('');
    //                            },
    //                            'keyup': function (field, eventobj) {
    //                                exist = field.getValue();
    //                            },
    //                            'blur': function () {
    //                                //calcularImporte();
    //                            }
    //                        }
    //                    })
    //                }, {header: this.idioma.lbGridImporte, width: 80, dataIndex: 'importe', sortable: false}, {header: this.idioma.lbGridMinimo, width: 80, dataIndex: 'minimo', sortable: false,
    //                    editor: new Ext.form.NumberField({
    //                        id: 'idminimo',
    //                        allowNegative: false,
    //                        enableKeyEvents: true,
    //                        allowDecimals: true,
    //                        decimalPrecision: 6,
    //                        listeners: {
    //                            'focus': function (campo) {
    //                                if (campo.getValue() == 0)
    //                                    campo.setValue('');
    //                            }
    //                        }
    //                    })
    //                }, {header: this.idioma.lbGridMaximo, width: 80, dataIndex: 'maximo', sortable: false,
    //                    editor: new Ext.form.NumberField({
    //                        id: 'idmaximo',
    //                        allowNegative: false,
    //                        enableKeyEvents: true,
    //                        allowDecimals: true,
    //                        decimalPrecision: 6,
    //                        listeners: {
    //                            'focus': function (campo) {
    //                                if (campo.getValue() == 0)
    //                                    campo.setValue('');
    //                            }
    //                        }
    //                    })
    //                }, {header: this.idioma.lbGridPais, width: 100, dataIndex: 'pais', sortable: false,
    //                    editor: new Ext.form.ComboBox({
    //                        id: 'idcmbPais',
    //                        hiddenName: 'idpais',
    //                        valueField: 'pais',
    //                        displayField: 'pais',
    //                        store: _this.stPais,
    //                        autoCreate: true,
    //                        typeAhead: true,
    //                        triggerAction: 'all',
    //                        readOnly: true,
    //                        mode: 'local',
    //                        width: 120,
    //                        enableKeyEvents: true,
    //                        listeners: {
    //                            'select': function (combo, record, index) {
    //                                _this.smProducto.getSelected().set('pais', record.get('pais'));
    //                                _this.smProducto.getSelected().set('idpais', record.get('idpais'));
    //                            }
    //                        }
    //                    })
    //                }
    //            ],
    //            tbar: (! this.tbarGridProd) ? [
    //                new Ext.menu.TextItem(this.idioma.lbCodigo), '-', this.codigo, '-', new Ext.menu.TextItem(this.idioma.lbNopieza), '-', this.nropieza, '-', new Ext.menu.TextItem(this.idioma.lbDescrip), '-', this.descripcion, ' ', this.btnBuscar, this.btnLimpiar, new Ext.menu.Separator(), ' ', new Ext.menu.TextItem(this.idioma.lbImpTotal + ':'), '' + '$', this.importet = new Ext.form.Label({
    //                    autoCreate: true,
    //                    id: 'importet',
    //                    width: 100
    //                })
    //            ] : this.tbarGridProd,
    //            bbar: new Ext.PagingToolbar({
    //                pageSize: 30,
    //                store: _this.stProducto,
    //                displayInfo: true
    //            })
    //        });
    //
    //        this.gpProducto.on('keypress', function (e) {
    //            if (e.getKey() == 13) {
    //                if (_this.smProducto.getSelected().data.minimo > _this.smProducto.getSelected().data.maximo) {
    //                    mostrarMensaje(1, _this.idioma.MsgInfoMin);
    //
    //                } else if (_this.smProducto.getSelected().data.minimo > _this.smProducto.getSelected().data.maximo) {
    //                    mostrarMensaje(1, _this.idioma.MsgInfoMax);
    //
    //                } else if (_this.smProducto.getSelected().data.lineaproducto != '' && _this.smProducto.getSelected().dirty) {
    //                    _this.salvarDatosProducto();
    //                } else {
    //                    mostrarMensaje(1, _this.idioma.MsgInfoLineaProd);
    //                }
    //            }
    //        });
    //
    //        Ext.apply(this, {
    //            modal: true,
    //            closeAction: 'hide',
    //            maximized: true,
    //            layout: 'fit',
    //            tbar: btns,
    //            items: [
    //                new Ext.Panel({
    //                    frame: false,
    //                    layout: 'border',
    //                    id: 'panelMedio',
    //                    tbar: (this.formFieldSet) ? null : tbarPanel,
    //                    items: (this.arrayItems) ? [(this.panelSur) ? ({
    //                        xtype: 'panel',
    //                        region: 'center',
    //                        layout: 'border',
    //                        items: [
    //                            {
    //                                xtype: 'panel',
    //                                region: 'center',
    //                                layout: 'fit',
    //                                items: [this.getGridProductos()]
    //                            },
    //                            this.panelSur
    //                        ]
    //                    }) : this.getGridProductos()].concat(_this.arrayItems) : [this.gpProducto]
    //                })
    //            ]
    //        });
    //    },
    /**
     * Funcionalidad que muestra la interfaz de los indicadores
     */
    onBtnAdicionarProdClick: function () {
        var _this = this;

        if (_this._parent.tipocomportamiento == 2) {

            _this.winPro = new Ext.aft.indicadores.WindowIndicadores({
                singleSelect: false,
                indicadoresNoMostrar: _this.indicadoresNoMostrar,
                doAction: function (record_seleccionado) {
                    _this.procesarecordsNomProductos(record_seleccionado);
                },
                arrColumnasOcultas: ['estatus', 'descripcionnaturaleza', 'descripcionumedida', 'precio', 'centrobalance', 'flete', 'contingencia', 'idaprobacion', 'nivelplanif'],
                arrColumnasSinMenu: ['estatus']
            });
            _this.winPro.getUrlControladora();
        } else {
            _this.winPro.setUrlControladora();
        }

    },
    onBtnEliminarProdClick: function () {

    },
    /**
     * Funcionalidad que muestra la interfaz ubicar productos
     */
    onBtnUbicacionClick: function () {
        new Ext.aft.ubicacion();
    },
    procesarecordsNomProductos: function (record_seleccionado) {
        var _this = this;
        Ext.getBody().mask(_this.idioma.MaskAddProducto, 'x-mask-loading');
        for (var i = 0; i < record_seleccionado.length; i++) {
            datos.push(record_seleccionado[i].data.idindicador);
        }
        Ext.Ajax.request({
            url: 'salvarrproductosdocumento',
            method: 'POST',
            params: {
                iddocumento: _this.iddocumento,
                iddeposito: _this.iddeposito,
                idprod: [datos]
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.getBody().unmask();
                if (responseData.codMsg == 1) {
                    mostrarMensaje(1, _this.idioma.MsgAddProductoOk)
                    datos = new Array();
                    _this.stProducto.reload();
                } else
                    mostrarMensaje(3, 'El(Los) producto(s) no se ha(n) adicionado.');
            }
        });
    },
    /**
     * Funcionalidad que permite realizar busquedas a los productos
     */
    buscarProductos: function () {
        var _this = this;
        _this.stProducto.load({params: {start: 0, limit: 50}});
    },
    salvarDatosProducto: function () {
        var _this = this;
        Ext.getBody().mask(_this.idioma.MaskAdicionandoProd, 'x-mask-loading');
        var stRecModificados = _this.stProducto.getModifiedRecords();
        var datosEnvio = new Array();
        Ext.each(stRecModificados, function (_obj, _pos, _arr) {
            datosEnvio.push(_obj.data);
        }, _this);
        Ext.Ajax.request({
            url: 'salvardatosproducto',
            method: 'POST',
            params: {
                productos: Ext.encode(datosEnvio)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.getBody().unmask();
                if (responseData && responseData.codMsg == 1) {
                    _this.stProducto.reload();
                } else
                    mostrarMensaje(3, 'El estatus del documento no se pudo anular.');
            }
        });
    },
    /**
     * Funcionalidad que desabilita los botones de la ventana productos
     */
    desabilitarBotones: function () {
        _this = this;
        _this.btnEliminarProd.disable();
        _this.btnAprobarDoc.disable();
        _this.btnConfirmarDoc.disable();
        _this.btnAnularDoc.disable();
        _this.registrarmedicionprodBtn.disable();
        _this.ubicarprodBtn.disable();
        _this.btnImpromirMod.disable();
    },
    /**
     * Funcionalidad que devuelve el grid de productos
     */
    getGridProductos: function () {
        if (null == this.gpProducto) {

        }
        return null;
    }
});
