Utilidades.Cmp.CmpImportar = function (opcionesConfig) {
    var _this = this;
    var winImp;
    var dataIndexSelecc = null;
    var columns_selecc = [];
    var tieneAccionActualizar = false;
    var integracion = opcionesConfig.integracion;
    var idconcepto = opcionesConfig.idconcepto;

    Ext.QuickTips.init();

    this.BarraProgreso = new BarraEstado();

    /*********TECLAS CALIENTES**********/
    this.map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Hh',
            alt: true,
            fn: function () {
                mostrarAyuda('Importar');
            }
        }, {
            key: 46,
            fn: function () {
                eliminarElemento(_this.gpImportar.getSelectionModel().getSelections());
            }
        }, {
            key: 'Ll',
            fn: function () {
                seleccBtnLimpiar();
            }
        }, {
            key: 'Ii',
            ctrl: true,
            alt: true,
            fn: function () {
                var idconcepto = _this.cbConcepto.getValue();
                _this.crearWinImportar(idconcepto);
            }
        }
    ]);

    this.btnImp = new Ext.Button({
        handler: function () {
            var idconcepto = _this.cbConcepto.getValue();
            _this.crearWinImportar(idconcepto);
        },
        disabled: true,
        tooltip: 'Importar elementos',
        id: 'btnImp',
        iconCls: 'importar'
    });

    this.btnDel = new Ext.Button({
        handler: function () {
            eliminarElemento(_this.gpImportar.getSelectionModel().getSelections());
        },
        disabled: true,
        id: 'btnDel',
        tooltip: 'Eliminar elemento(s)' + ' (<b>DEL</b>)',
        iconCls: 'eliminar'
    });

    this.btnDelAll = new Ext.Button({
        handler: function () {
            eliminarTodos();
        },
        disabled: true,
        id: 'btnDelAll',
        tooltip: 'Eliminar todos los elementos',
        iconCls: 'eliminar'
    });

    this.btnExportarFichero = new Ext.Button({
        handler: function () {
            exportarFichero();
        },
        disabled: true,
        id: 'btnExportarFichero',
        tooltip: 'Exportar datos erróneos',
        iconCls: 'exportar'
    });

    this.menuToolBarDelete = new Ext.menu.Menu({
        id: 'menuToolBarDelete',
        //disabled: true,
        listeners: {},
        items: [{
            text: 'Eliminar',
            iconCls: 'eliminar',
            id: 'mdEliminarElemento',
            tooltip: 'Eliminar elemento(s)',
            handler: function () {
            }
        }]
    });

    this.btnAyuda = new Ext.Button({
//        handler: function() {
//            mostrarAyuda('Importar');
//        },
        text: 'Ayuda',
        tooltip: 'Ayuda',
        id: 'btnAyuim',
        iconCls: 'ayuda'
    });

    // ********* Limpiar ****************
    this.btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtros',
        handler: function () {
            seleccBtnLimpiar();
        }
    });

    this.reader = new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'id'
        }, [{
            name: 'iddatosnomenclador'
        }]
    );

    this.stCbPaginado = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [20, '20'],
            [100, '100'],
            [500, '500'],
            [1000, '1000'],
            [1500, '1500'],
            [2000, '2000'],
            [2500, '2500'],
            [3000, '3000']]
    });

    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    this.cbPaginado = new Ext.form.ComboBox({
        value: 100,
        store: _this.stCbPaginado,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 60,
        emptyText: 'Seleccione',
        listeners: {
            select: function (cb, record, index) {
                Ext.getCmp('pagtollbar').pageSize = record.data.idnumpag;
                Ext.getCmp('pagtollbar').doLoad(Ext.getCmp('pagtollbar').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    })

    // Store grid stGpImportar
    this.stGpImportar = new Ext.data.GroupingStore({
        url: '/configuracion/importar/importar/index.php/cmpimportar/listar',
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrarImportarElem();
                this.baseParams.idconcepto = Ext.getCmp('tbCmbConcepto').getValue();
            },
            'load': function () {
                if (_this.stGpImportar.getCount() == 0) {
                    if ((_this.gfFiltros.getFiltrosActivos() == undefined || _this.gfFiltros.getFiltrosActivos().length == 0)) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                } else _this.smGpImportar.selectFirstRow();
            }
        },
        reader: _this.reader,
        groupField: 'iddatosnomenclador'
    });
    this.stCmbConcepto = new Ext.data.Store({
        url: '/configuracion/importar/importar/index.php/cmpimportar/listarConceptos',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                this.baseParams.idconcepto = idconcepto;
            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idconcepto'
            }, [{
                name: 'idconcepto'
            }, {
                name: 'denominacion'
            }]
        )
    });
    this.stCmbAccion = new Ext.data.Store({
        url: '/configuracion/importar/importar/index.php/cmpimportar/listarTipoAccion',
        listeners: {
            beforeload: function (_this, records, options) {
                _this.baseParams = {
                    idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
                };
            },
            load: function (_this, records, options) {
                tieneAccionActualizar = false;
                Ext.each(records, function (item, index) {
                    if (item.data.idtipoaccion == 2) {
                        tieneAccionActualizar = true;
                        return;
                    }
                });
            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idtipoaccion'
            }, [{
                name: 'idconfiguracion'
            }, {
                name: 'idtipoaccion'
            }, {
                name: 'denominacion'
            }]
        )
    });
    this.stCmbFormato = new Ext.data.Store({
        url: '/configuracion/importar/importar/index.php/cmpimportar/listarFormatos',
        listeners: {
            beforeload: function (_this, records, options) {
            },
            load: function (_this, records, options) {
            }
        },
        reader: new Ext.data.JsonReader({
                //totalProperty: 'total',
                root: 'data',
                id: 'idformato'
            }, [{
                name: 'idformato'
            }, {
                name: 'nombre'
            }]
        )
    });
    this.stCbTipoDoc = new Ext.data.Store({
        url: '/configuracion/importar/importar/index.php/cmpimportar/listarTipoDoc',
        listeners: {
            beforeload: function (_this, records, options) {
                _this.baseParams = {
                    idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
                };
            },
            load: function (_this, records, options) {
                if (_this.getCount() == 0)
                    mostrarMensaje(1, 'No existen tipos de documentos asociados a la estructura.');
            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'iddoc'
            }, [{
                name: 'iddoc'
            }, {
                name: 'denominacion'
            }]
        )
    });

    this.stCbOperacion = new Ext.data.Store({
        url: '/configuracion/importar/importar/index.php/cmpimportar/listarOperacion',
        listeners: {
            beforeload: function (_this, records, options) {
                _this.baseParams = {
                    idtipodoc: Ext.getCmp('cbTipoDoc').getValue()
                };
            },
            load: function (_this, records, options) {
                if (_this.getCount() == 0)
                    mostrarMensaje(1, 'No existen operaciones asociadas al tipo de documento.');
            }
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idoperacion'
            }, [{
                name: 'idoperacion'
            }, {
                name: 'denominacion'
            }]
        )
    });
    // formulario fpImportar

    this.stEstadosColumnas = new Ext.data.Store({
        url: '/configuracion/importar/importar/index.php/cmpimportar/listarEstadosColumna',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
            name: 'iddatosnomenclador'
        }, {
            name: 'denominacion'
        }, {
            name: 'uridatosnomenclador'
        }]),
        listeners: {
            load: function () {
                this.getAt(this.find('iddatosnomenclador', '-1')).data.denominacion = 'Vacio';
                this.getAt(this.find('iddatosnomenclador', '-1')).commit();
            }
        }
    });
    _this.stEstadosColumnas.load();

    // Selection Model grid smGpImportar
    this.smGpImportar = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (t, rowindex, record) {
                _this.btnDel.enable();
            },
            rowdeselect: function () {
                if (_this.gpImportar.getSelectionModel().getSelections().length == 0)
                    _this.btnDel.disable();
                else
                    _this.btnDel.enable();
            }
        }
    });
    // Grid gestion gpImportar

    this.gfFiltros = new Ext.grid.GridFilters({
        filters: [{
            type: 'listado',
            dataIndex: 'iddatosnomenclador',
            idcombo: 'iddatosnomenclador',
            urlcb: ' /configuracion/importar/importar/index.php/cmpimportar/listarEstadosColumna',
            idstore: 'iddatosnomenclador',
            valueFieldcb: 'iddatosnomenclador',
            displayFieldcb: 'denominacion',
            numeropeticiones: 5,
            store: _this.stEstadosColumnas,
            width: 150
        }
        ]
    });

    this.cbConcepto = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        id: 'tbCmbConcepto',
        store: _this.stCmbConcepto,
        displayField: 'denominacion',
        allowBlank: false,
        triggerAction: 'all',
        readOnly: true,
        valueField: 'idconcepto',
        mode: 'remote',
        width: 200,
        listeners: {
            valid: function () {
                _this.btnDelAll.enable();
            },
            render: function (c) {
            },
            select: function (c, rc, rn) {
                _this.cbPaginado.setValue(100);
                Ext.getCmp('btnImp').enable();
                if (rc) {
                    var barra = Ext.MessageBox.show({
                        msg: 'Cargando concepto...',
                        width: 270,
                        wait: true,
                        progress: true,
                        closable: false

                    });
                    _this.stCmbAccion.reload({
                        callback: function () {
                            barra.hide();
                            Ext.getCmp('tbCmbAccion').enable();
                            Ext.getCmp('btnAceptarAccion').disable();
                            Ext.getCmp('tbCmbAccion').reset();
                            _this.cbTipoDoc.reset();
                            _this.gpImportar.reconfigImportacion(rc.data.idconcepto);
                        }
                    });
                    if (rc.data.idconcepto == '5' || rc.data.idconcepto == '6') _this.cbTipoDoc.enable();
                    else _this.cbTipoDoc.disable();
                    _this.btnExportarFichero.enable();
                } else {
                    Ext.getCmp('tbCmbAccion').disable();
                    _this.btnExportarFichero.disable();
                }
            }
        }
    });

    this.cbAccion = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Tipo de acción',
        id: 'tbCmbAccion',
        disabled: true,
        store: _this.stCmbAccion,
        displayField: 'denominacion',
        allowBlank: false,
        triggerAction: 'all',
        readOnly: true,
        valueField: 'idtipoaccion',
        mode: 'local',
        width: 200,
        listeners: {
            select: function (c, rc, rn) {
                if (rc) {
                    if (_this.cbConcepto.getValue() != '5' && _this.cbConcepto.getValue() != '6') //5-Activo, 6-Utiles
                        Ext.getCmp('btnAceptarAccion').enable();
                    else {
                        if (_this.cbTipoDoc.getValue()) {
                            Ext.getCmp('btnAceptarAccion').enable();
                        } else Ext.getCmp('btnAceptarAccion').disable();
                    }
                } else {
                    Ext.getCmp('btnAceptarAccion').disable();
                }
            }
        }
    });

    this.cbTipoDoc = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Tipo de documento',
        id: 'cbTipoDoc',
        disabled: true,
        store: _this.stCbTipoDoc,
        displayField: 'denominacion',
        allowBlank: false,
        triggerAction: 'all',
        readOnly: true,
        valueField: 'iddoc',
        mode: 'remote',
        width: 250,
        listeners: {
            select: function (c, rc, rn) {
                if (rc) {
                    if (_this.cbAccion.getValue())
                        Ext.getCmp('btnAceptarAccion').enable();
                    else
                        Ext.getCmp('btnAceptarAccion').disable();
                }

            }
        }
    });

    this.cbOperacion = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Operación',
        id: 'cbOperacion',
        disabled: true,
        store: _this.stCbOperacion,
        displayField: 'denominacion',
        allowBlank: false,
        triggerAction: 'all',
        readOnly: true,
        valueField: 'idoperacion',
        forceSelection: true,
        mode: 'remote',
        listeners: {
            select: function (c, rc, rn) {
                if (rc) {
                    if (_this.cbAccion.getValue() && _this.cbTipoDoc.getValue())
                        Ext.getCmp('btnAceptarAccion').enable();
                    else
                        Ext.getCmp('btnAceptarAccion').disable();
                }
            },
            expand: function (combo) {
                combo.clearValue();
                Ext.getCmp('btnAceptarAccion').disable();
                _this.stCbOperacion.reload();
            }
        }
    });

    this.btnAceptar = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarAccion',
        tooltip: 'Aceptar',
        disabled: true,
        search: function (array, id) {
            var indice = -1;
            Ext.each(array, function (item, index) {
                if (item.id === id) {
                    indice = index;
                    return;
                }
            });
            return indice;
        },
        handler: function () {
            var idconcepto = _this.cbConcepto.getValue();
            if (idconcepto == 9 && _this.cbAccion.getValue() == 1) { //Maestro de productos
                _this.crearWinSeleccionarProducto();
            } else _this.realizarAccion();
        }
    });

    this.realizarAccion = function (idProducto) {
        if (_this.winProductos) _this.winProductos.destroy();

        Ext.Msg.wait('Aplicando cambios', 'Por favor espere ...');
        Ext.Ajax.request({
            url: '/configuracion/importar/importar/index.php/cmpimportar/realizaracciondatosimportados',
            timeout: 7200000, //milisegundos = 120 min 2hrs
            params: {
                idaccion: Ext.getCmp('tbCmbAccion').getValue(),
                idconfiguracion: _this.stCmbAccion.getAt(0).data.idconfiguracion,
                idconcepto: Ext.getCmp('tbCmbConcepto').getValue(),
                filtros: Ext.encode(getDataFiltrosActivos()),
                cols_checked: Ext.encode(getColumnCheckeds()),
                iddoc: _this.cbTipoDoc.getValue(),
                idoperacion: _this.cbOperacion.getValue(),
                idproducto: idProducto
            },
            callback: function (opcions, success, response) {
                response = Ext.decode(response.responseText);
                Ext.Msg.hide();
                switch (response.cod) {
                    case -1:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                switch (parseInt(response.idtipoaccion)) {
                                    case 1:
                                        mostrarMensaje(1, 'No existen datos para adicionar.');
                                        break;
                                    case 2:
                                        mostrarMensaje(1, 'No existen datos para actualizar.');
                                        break;
                                    case 3:
                                        mostrarMensaje(1, 'No existen datos para adicionar/actualizar.');
                                        break;
                                    case 4:
                                        mostrarMensaje(1, 'Los datos se encuentran validados correctamente.');
                                        break;
                                    case 5:
                                        mostrarMensaje(1, 'No existen datos para correlacionar.');
                                        break;
                                    case 6:
                                        mostrarMensaje(1, 'No existen datos para asociar a los documentos.');
                                        break;
                                    default:
                                        mostrarMensaje(1, 'No existen datos para realizar la acción seleccionada.');
                                        break;
                                }
                            }
                        });
                        break;
                    case 0:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                switch (parseInt(response.idtipoaccion)) {
                                    case 1:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron adicionados.');
                                        break;
                                    case 2:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron actualizados.');
                                        break;
                                    case 3:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron adicionados o actualizados.');
                                        break;
                                    case 4:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron validados.');
                                        break;
                                    case 5:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron correlacionados.');
                                        break;
                                    case 6:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron asociados a los documentos.');
                                        break;
                                    default:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron realizados según la acción seleccionada.');
                                        break;
                                }
                            }
                        });
                        break;
                    case 1:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                switch (parseInt(response.idtipoaccion)) {
                                    case 1:
                                        mostrarMensaje(1, 'Los datos han sido adicionados satisfactoriamente.');
                                        break;
                                    case 2:
                                        mostrarMensaje(1, 'Los datos han sido actualizados satisfactoriamente.');
                                        break;
                                    case 3:
                                        mostrarMensaje(1, 'Los datos han sido adicionados y actualizados satisfactoriamente.');
                                        break;
                                    case 4:
                                        mostrarMensaje(1, 'Los datos han sido validados satisfactoriamente.')
                                        break;
                                    case 5:
                                        mostrarMensaje(1, 'Los datos han sido correlacionados satisfactoriamente.')
                                        break;
                                    case 6:
                                        mostrarMensaje(1, 'Los datos han sido asociados a los documentos.')
                                        break;
                                    default:
                                        mostrarMensaje(1, 'Los datos han sido realizados según la acción seleccionada.')
                                        break;
                                }
                            }
                        });
                        break;
                    case 2:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                switch (parseInt(response.idtipoaccion)) {
                                    case 1:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron adicionados.');
                                        break;
                                    case 2:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron actualizados.');
                                        break;
                                    case 3:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron adicionados o actualizados.');
                                        break;
                                    case 4:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron validados.');
                                        break;
                                    case 5:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron correlacionados.');
                                        break;
                                    case 6:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron asociados a los documentos.');
                                        break;
                                    default:
                                        mostrarMensaje(1, 'Hubo algunos datos que no fueron realizados según la acción seleccionada.');
                                        break;
                                }
                            }
                        });
                        break;
                    case 3:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, response.tipo);
                            }
                        });
                        break;
                    case 10:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe un período configurado para la entidad.');
                            }
                        });
                        break;
                    case 11:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Hubo un error al verificar el período configurado.');
                            }
                        });
                        break;
                    case 12:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existen operaciones configuradas.');
                            }
                        });
                        break;
                    case 13:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Hubo un error al verificar la operación de cuentas por cobrar configurada.');
                            }
                        });
                        break;
                    case 14:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe un tipo de documento configurado para la operación.');
                            }
                        });
                        break;
                    case 15:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Hubo un error al verificar la operación de cuentas por pagar configurada.');
                            }
                        });
                        break;
                    case 16:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador de estado: APROBADO, en el subsistema de contratación.');
                            }
                        });
                        break;
                    case 17:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador de estado: A LA FIRMA, en el subsistema de contratación.');
                            }
                        });
                        break;
                    case 18:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existen los nomencladores de estado: A LA FIRMA y APROBADO, en el subsistema de contratación.');
                            }
                        });
                        break;
                    case 19:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Debe seleccionar un tipo de documento.');
                            }
                        });
                        break;
                    case 20:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe una operación asociada al tipo de documento.');
                            }
                        });
                        break;
                    case 21:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador tipo de identidad: CARNÉ DE IDENTIDAD y CARNÉ DE IDENTIDAD FAR, en el subsistema de persona.');
                            }
                        });
                        break;
                    case 22:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador tipo de identidad: CARNÉ DE IDENTIDAD, en el subsistema de persona.');
                            }
                        });
                        break;
                    case 23:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador tipo de moneda: PESO CUBANO(CUP) Y PESO CONVERTIBLE(CUC), en el subsistema datos maestros.');
                            }
                        });
                        break;
                    case 24:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador tipo de acreditación del salario: CI y CM, en el subsistema persona.');
                            }
                        });
                        break;
                    case 25:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador tipo de acreditación del salario: CI, en el subsistema persona.');
                            }
                        });
                        break;
                    case 26:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe la moneda CUP.');
                            }
                        });
                        break;
                    case 27:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe la moneda CUC.');
                            }
                        });
                        break;
                    case 28:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador tipo de identidad: CARNÉ DE IDENTIDAD FAR, en el subsistema de persona.');
                            }
                        });
                        break;
                    case 29:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador tipo de acreditación del salario: CM, en el subsistema persona.');
                            }
                        });
                        break;
                    case 30:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existen los datos necesarios generales para importar ÚTILES y/o AFT.');
                            }
                        });
                        break;
                    case 31:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No se encuentra registrado el subsistema.');
                            }
                        });
                        break;
                    case 32:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No se encuentra registrada la fecha en el subsistema.');
                            }
                        });
                        break;
                    case 33:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No se encuentra registrado el período ni el ejercicio en el subsistema.');
                            }
                        });
                        break;
                    case 34:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No se encuentra registrado el ejercicio en el subsistema.');
                            }
                        });
                        break;
                    case 35:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No se encuentra registrado el período en el subsistema.');
                            }
                        });
                        break;
                    case 36:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Debe validar todos los datos validados para poder correlacionarlos.');
                            }
                        });
                        break;
                    case 37:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador de indicadores: INDICADOR.');
                            }
                        });
                        break;
                    case 38:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador de especialidad: NINGUNA.');
                            }
                        });
                        break;
                    case 39:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'No existe el nomenclador de naturaleza: NINGUNA.');
                            }
                        });
                        break;
                    case 40:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Debe seleccionar un producto o servicio.');
                            }
                        });
                        break;
                    case 41:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Debe validar todos los datos correlacionados para poder adicionarlos.');
                            }
                        });
                        break;
                    case 'vacio':
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Por favor verifique que existan valores para importar.');
                            }
                        });
                        break;
                    default:
                        _this.gpImportar.getStore().reload({
                            callback: function () {
                                mostrarMensaje(1, 'Hubo un error al realizar la operación. Contacte con el administrador');
                            }
                        });
                        break;
                }
            }
        });
    }

    this.MenuItemDescargarPlantillaCuentasporCobrar = new Ext.menu.Item({
        text: 'Descargar plantilla: Cuentas por cobrar/pagar (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Cuentas por cobrar-pagar.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de cuentas por cobrar/pagar (Excel).'
    });

    this.MenuItemDescargarPlantillaCobroPagoAnticipado = new Ext.menu.Item({
        text: 'Descargar plantilla: Cobro/pago anticipado (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Cobro-pago anticipado.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de cobro/pago anticipado (Excel).'
    });
    this.MenuItemDescargarPlantillaClientes = new Ext.menu.Item({
        text: 'Descargar plantilla: Clientes y/o proveedores (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Clientes y Proveedores.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de clientes y/o proveedores (Excel).'
    });
    this.MenuItemDescargarPlantillaContratos = new Ext.menu.Item({
        text: 'Descargar plantilla: Contratos (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Contratos.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de contratos (Excel).'
    });
    this.MenuItemDescargarPlantillaActivo = new Ext.menu.Item({
        text: 'Descargar plantilla: Activos fijo (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Activo Fijo.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de activos fijo (Excel).'
    });
    this.MenuItemDescargarPlantillaUtiles = new Ext.menu.Item({
        text: 'Descargar plantilla: Útiles (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Utiles.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de útiles (Excel).'
    });
    this.MenuItemDescargarPlantillaPersona = new Ext.menu.Item({
        text: 'Descargar plantilla: Persona (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Persona.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de personas (Excel).'
    });
    this.MenuItemDescargarPlantillaCuentasClientes = new Ext.menu.Item({
        text: 'Descargar plantilla: Cuentas clientes y/o proveedores (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Cuentas clientes y proveedores.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de cuentas clientes y/o proveedores (Excel).'
    });
    this.MenuItemDescargarPlantillaMaestroProductos = new Ext.menu.Item({
        text: 'Descargar plantilla: Maestro de productos (Excel)',
        handler: function () {
            window.open('/configuracion/importar/importar/resources/plantillas/Plantilla Importar Maestro de Productos.xls');
        },
        iconCls: 'importar',
        tooltip: 'Descargar plantilla de maestro de producctos (Excel).'
    });

    this.menuImportarElemento = new Ext.Toolbar.MenuButton({
        tooltip: 'Intercambio de información',
        //hidden: true,
        iconCls: 'intercambiar',
        menu: {
            items: [_this.MenuItemDescargarPlantillaCuentasporCobrar, _this.MenuItemDescargarPlantillaCobroPagoAnticipado,
                _this.MenuItemDescargarPlantillaClientes, _this.MenuItemDescargarPlantillaContratos, _this.MenuItemDescargarPlantillaActivo,
                _this.MenuItemDescargarPlantillaUtiles, _this.MenuItemDescargarPlantillaPersona, _this.MenuItemDescargarPlantillaCuentasClientes,
                _this.MenuItemDescargarPlantillaMaestroProductos]
        }
    });
    this.gpImportar = new Ext.grid.GridPanel({
        id: 'gpImportar',
        frame: true,
        region: 'center',
        store: _this.stGpImportar,
        margins: '2 2 2 -4',
        sm: _this.smGpImportar,
        md: _this.menuToolBarDelete,
        autoScroll: true,
        autoWidth: true,
        autoExpandColumn: 'expand',
        plugins: [_this.gfFiltros],
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Estados" : "Estado"]})'
        }),
        columns: [{
            // width:100,
            id: 'expand'
        }],
        loadMask: {
            store: _this.stGpImportar
        },
        tbar: [{
            xtype: 'tbtext',
            text: 'Concepto:',
        }, _this.cbConcepto, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbtext',
            text: 'Acción: '
        }, _this.cbAccion, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbtext',
            text: 'Tipo de documento: '
        }, _this.cbTipoDoc, /*{
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbtext',
            text: 'Operación: '
        }, _this.cbOperacion,*/ {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'tbspacer'
        }, _this.btnAceptar
        ],
        bbar: new Ext.PagingToolbar({
            id: 'pagtollbar',
            pageSize: 100,
            store: _this.stGpImportar,
            displayInfo: true,
            items: ['-', _this.btnLimpiarFiltros, '-']
        }),
        listeners: {
            rowdblclick: function (_this, row_index, record) {
            },
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());

            }
        },
        reconfigImportacion: function (conc) {
            var barra = Ext.MessageBox.show({
                msg: 'Cargando...',
                width: 270,
                wait: true,
                progress: true,
                closable: false
            });
            if (conc) {
                Ext.Ajax.request({
                    url: '/configuracion/importar/importar/index.php/cmpimportar/getConfigGrid',
                    params: {
                        idconcepto: conc
                    },
                    callback: function (op, success, r) {
                        r = Ext.decode(r.responseText);
                        if (r.codMsg == 7) {
                            reader = new Ext.data.JsonReader({
                                totalProperty: 'total',
                                root: 'data',
                                id: r.rd[0].name
                            }, r.rd);
                            _this.stGpImportar.reader = reader;
                            _this.stGpImportar.groupField = 'iddatosnomenclador';
                            _this.stGpImportar.sortInfo = {
                                field: 'iddatosnomenclador',
                                direction: 'ASC'
                            };
                            var exist_deno = false;
                            columns_selecc = [];
                            for (var i = 0; i < r.cm.length; i++) {
                                r.cm[i].checked_column = true;
                                if (r.cm[i].dataIndex == 'iddatosnomenclador') {
                                    r.cm[i].checked_column = undefined;
                                    r.cm[i].renderer = function (val) {
                                        if (_this.stEstadosColumnas.getById(val) == undefined)
                                            return '-';
                                        var estcol = _this.stEstadosColumnas.getById(val).data.denominacion;
                                        if (estcol != null)
                                            return estcol;
                                        return '-';
                                    }
                                    break;
                                } else if (r.cm[i] == 'denominacion' && !exist_deno) {
                                    exist_deno = true;
                                    r.cm[i].id = 'expand';
                                }
                                addFilter(r.cm[i].dataIndex, r.cm[i].datatype);
                            }
                            if (!exist_deno && r.cm[0] != null) {
                                r.cm[1].id = 'expand';
                            }
                            cm = new Ext.grid.ColumnModel(r.cm);
                            _this.gpImportar.reconfigure(_this.stGpImportar, cm);
                            _this.stGpImportar.on('beforeload', function () {
                                //_this.BarraProgreso.ocultarMascara('idmask');
                                _this.BarraProgreso.hide();
                                cambiarTituloFiltrarImportarElem();
                            });
                            _this.gpImportar.getStore().reload({
                                params: {
                                    idconcepto: Ext.getCmp('tbCmbConcepto').getValue(),
                                    start: 0,
                                    limit: 100
                                },
                                callback: function () {
                                    barra.hide();
                                }
                            });
                            _this.btnDel.disable();
                        }
                    }
                });
                barra.hide();
            }
        }
    });

    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        region: 'center',
        title: 'Importar elementos',
        id: 'pcontenedor1',
        usarKeymap: true,
        botonesKeymap: [_this.btnImp, _this.btnDel, _this.btnDelAll, _this.menuImportarElemento, _this.btnExportarFichero, _this.btnAyuda],
        tbar: [_this.btnImp, _this.btnDel, _this.btnDelAll, _this.menuImportarElemento, _this.btnExportarFichero, '->', _this.btnAyuda],
        items: [_this.gpImportar]
    });

    this.vpImportar = new Ext.Viewport({
        layout: 'border',
        items: _this.PanPrincipal
    });

    //ventana principal de la vista
    _this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        closable: true,
        closeAction: 'destroy',
        maximized: true,
        noTitle: false,
        modal: true,
        width: 1000,
        height: 510,
        items: _this.PanPrincipal,
        listeners: {
            destroy: function (win) {
                if (win) {
                    win.destroy();
                }
            }
        },
        buttons: []
    });

    //builReplaceValueInColumn(_this.gpImportar);
    //builSeleccInColumn(_this.gpImportar);

    this.cargarCmpImportar = function () {
        if (!integracion)
            this.vpImportar.show();
        else
            _this.WinPrincipal.show();

    }

    // Ventanas para formulario winFp(opcion)

    this.crearWinImportar = function (idconcepto) {
        this.fpImportar = new Ext.FormPanel({
            labelAlign: 'top',
            fileUpload: true,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [new Ext.form.ComboBox({
                        emptyText: 'Seleccione',
                        id: 'cmbConcepto',
                        fieldLabel: 'Concepto a importar',
                        store: _this.stCmbConcepto,
                        displayField: 'denominacion',
                        allowBlank: false,
                        triggerAction: 'all',
                        readOnly: true,
                        valueField: 'idconcepto',
                        mode: 'local',
                        anchor: '95%'
                    })]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [new Ext.form.ComboBox({
                        emptyText: 'Seleccione',
                        fieldLabel: 'Tipo de documento',
                        store: new Ext.data.Store({
                            url: '/configuracion/importar/importar/index.php/cmpimportar/listarTipoDocumentos',
                            autoLoad: 'true',
                            reader: new Ext.data.JsonReader({
                                    totalProperty: 'total',
                                    root: 'data',
                                    id: 'idtipodocumento'
                                }, [{
                                    name: 'idtipodocumento'
                                }, {
                                    name: 'denominacion'
                                }]
                            )
                        }),
                        displayField: 'denominacion',
                        allowBlank: false,
                        triggerAction: 'all',
                        readOnly: true,
                        valueField: 'idtipodocumento',
                        mode: 'local',
                        anchor: '100%'
                    })]
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'fileuploadfield',
                        fieldLabel: 'Documento a importar',
                        id: 'form-file',
                        emptyText: 'Seleccione el fichero',
                        name: 'file',
                        anchor: '98.5%',
                        buttonCfg: {
                            text: '',
                            iconCls: 'buscar'
                        },
                        allowBlank: false
                    }]
                }]
            }]
        });

        if (_this.winImp) _this.winImp.destroy();
        this.winImp = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: 'Importar elementos',
            width: 480,
            height: 180,
            resizable: false,
            items: [_this.fpImportar],
            buttons: [{
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                handler: function () {
                    _this.winImp.destroy();
                }
            }, {
                iconCls: 'aceptar',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                handler: function () {
                    adicionarElemento();
                }
            }]
        });
        _this.fpImportar.getForm().reset();
        Ext.getCmp('cmbConcepto').setValue(Ext.getCmp('tbCmbConcepto').getValue());
        Ext.getCmp('cmbConcepto').disabled = true;

        _this.winImp.show();
    }

    this.crearWinSeleccionarProducto = function () {
        this.arbolProductos = new Utilidades.Cmp.Cmparbolproductos();
        this.tpProductos = _this.arbolProductos.CrearArbolProductos();
        this.pProductos = new Ext.Panel({
            //title: 'Productos y servicios',
            id: 'pProductos',
            layout: 'fit',
            region: 'west',
            collapsible: false,
            collapsed: false,
            margins: '3 3 3 3',
            items: [_this.tpProductos]
        });

        if (_this.winProductos) _this.winProductos.destroy();
        this.winProductos = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: 'Productos y servicios',
            width: 420,
            height: 420,
            resizable: false,
            items: [_this.pProductos],
            buttons: [{
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                handler: function () {
                    _this.winProductos.destroy();
                }
            }, {
                iconCls: 'aceptar',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                handler: function () {
                    var idProducto = _this.arbolProductos.idProductos;
                    if (idProducto && idProducto != 0) _this.realizarAccion(idProducto);
                    else mostrarMensaje(1, 'Debe seleccionar un producto o servicio');
                }
            }]
        });
        _this.winProductos.show();
    }

    function addFilter(dataIndex, type) {
        if (_this.gfFiltros.getFilter(dataIndex) == undefined) {
            if (type == 'numeric')
                _this.gfFiltros.addFilter({
                    type: 'numeric',
                    dataIndex: dataIndex
                });
            else {
                _this.gfFiltros.addFilter({
                    type: 'string',
                    dataIndex: dataIndex
                });
            }


            eliminarElemento = function (elementos) {
                if (_this.gpImportar.getSelectionModel().getSelections().length == 1) {
                    mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar el elmento seleccionado?', eliminar);
                } else {
                    mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar los elmentos seleccionados?', eliminar);
                }

                function eliminar(keypressed) {
                    if (keypressed == 'ok') {
                        var els = new Array();
                        for (var i = 0; i < elementos.length; i++) {
                            els.push(elementos[i].id);
                        }
                        //_this.BarraProgreso.mostrarMascara('elim_mask', 'Por favor espere...', 'Eliminando datos.');
                        _this.BarraProgreso.show('Eliminando datos');
                        Ext.Ajax.request({
                            url: '/configuracion/importar/importar/index.php/cmpimportar/eliminarelementostemptable',
                            timeout: 7200000, //milisegundos = 120 min 2hrs
                            params: {
                                idtempelements: Ext.encode(els),
                                idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
                            },
                            callback: function (opcions, success, response) {
                                //_this.BarraProgreso.ocultarMascara('elim_mask');
                                _this.BarraProgreso.hide();
                                response = Ext.decode(response.responseText);
                                if (response.cod == 1) {
                                    response = Ext.decode(response.responseText);
                                    _this.gpImportar.getStore().reload({
                                        callback: function () {
                                            if (_this.gpImportar.getSelectionModel().getSelections().length == 1) {
                                                mostrarMensaje(2, 'El elemento ha sido eliminado satisfactoriamente.');
                                            } else {
                                                mostrarMensaje(2, 'Los elementos han sido eliminados satisfactoriamente.');
                                            }
                                        }
                                    });
                                } else if (response.cod == 3) {
                                    mostrarMensaje(3, 'Ha ocurrido un error.');
                                }
                            }
                        });
                    }
                }
            }

            eliminarTodos = function () {
                mostrarMensaje(2,
                    'Desea elimiar el(los) elemento(s) selecionado(s)', eliminar);

                function eliminar(keypressed) {
                    if (keypressed == 'ok') {
                        //_this.BarraProgreso.mostrarMascara('elim_mask', 'Por favor espere...', 'Eliminando datos.');
                        _this.BarraProgreso.show('Eliminando datos');
                        Ext.Ajax.request({
                            url: '/configuracion/importar/importar/index.php/cmpimportar/eliminartodoselementos',
                            params: {
                                idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
                            },
                            callback: function (opcions, success, response) {
                                //_this.BarraProgreso.ocultarMascara('elim_mask');
                                _this.BarraProgreso.hide();
                                response = Ext.decode(response.responseText);
                                if (response.cod == 1) {
                                    _this.gpImportar.getStore().reload({
                                        callback: function () {
                                            mostrarMensaje(1,
                                                'El(los) elementos ha(n) sido eliminado(s) satisfactoriamente.');
                                        }
                                    });
                                } else if (response.cod == 3) {
                                    mostrarMensaje(3, 'Ha ocurrido un error.');
                                }
                            }
                        });
                    }
                }
            }

            exportarFichero = function () {
                //_this.BarraProgreso.mostrarMascara('elim_mask', 'Por favor espere...', 'Exportando datos.');
                _this.BarraProgreso.show('Exportando datos');
                Ext.Ajax.request({
                    url: '/configuracion/importar/importar/index.php/cmpimportar/exportarerrortemptable',
                    params: {
                        config: Ext.encode(_this.stCmbAccion.getAt(0).data)
                    },
                    callback: function (opcions, success, response) {
                        //_this.BarraProgreso.ocultarMascara('elim_mask');
                        _this.BarraProgreso.hide();
                        response = Ext.decode(response.responseText);
                        if (response.cod == 1) {
                            var tituloarchivo = response.titulo;
                            window.open('../../resources/descargas/' + tituloarchivo);
                        } else if (response.cod == 0) {
                            mostrarMensaje(1, 'No existen datos erróneos para exportar.');
                        } else if (response.cod == 2) {
                            mostrarMensaje(1, 'No se encuentran los datos en base de datos.');
                        } else mostrarMensaje(3, 'Ha ocurrido un error.');
                    }
                });

            }


            adicionarElemento = function (apl) {
                try {
                    if (_this.fpImportar.getForm().isValid()) {
                        var barra = Ext.MessageBox.show({
                            msg: 'Por favor espere...',
                            width: 270,
                            wait: true,
                            progress: true,
                            closable: false
                        });
                        _this.fpImportar.getForm().submit(
                            {
                                url: '/configuracion/importar/importar/index.php/cmpimportar/importarfichero',
                                timeout: 1800000, //milisegundos = 30 min
                                method: 'POST',
                                params: {
                                    idconcepto: Ext.getCmp('cmbConcepto').getValue()
                                },
                                failure: function (form, action) {
                                    if (action.result.cod == 0 || action.result.cod == 1) {
                                        if (!apl)
                                            _this.winImp.destroy();

                                        _this.gpImportar.getStore().reload(
                                            {
                                                callback: function () {
                                                    if (action.result.cod == 0) {
                                                        mostrarMensaje(1,
                                                            'Faltan las librerías necesarias para leer la información del archivo Excel(.xls).');
                                                    } else if (action.result.cod == 1) {
                                                        mostrarMensaje(1,
                                                            'Los elementos han sido importados satisfactoriamente.');
                                                    }
                                                    barra.hide();
                                                }
                                            });
                                    } else {
                                        barra.hide();
                                        if (action.result.cod == 42)
                                            mostrarMensaje(1, 'El formato del documento Excel debe ser de tipo 97-2003(.xls)');
                                        else if (action.result.cod == 53)
                                            mostrarMensaje(1, 'Solo se puede importar documentos que correspondan con el tipo de documento seleccionado.');
                                        else if (action.result.cod == 54)
                                            mostrarMensaje(1, 'Ha ocurrido un error en la carga de la información del archivo Excel.');
                                    }
                                }
                            }
                        );
                    } else
                        mostrarMensaje(1,
                            'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s)');
                } catch (e) {
                    console.log(e);
                }
            }

            seleccBtnLimpiar = function () {
                _this.gfFiltros.clearFilters();
            }

            cambiarTituloFiltrarImportarElem = function () {
                var filtrado_por = '';
                var sep = '/';
                if (_this.gfFiltros.getFiltrosActivos() == undefined || _this.gfFiltros.getFiltrosActivos().length == 0) {
                    Ext.getCmp('pcontenedor1').setTitle('Importar elementos');
                } else {
                    for (i = 0; i < _this.gfFiltros.getFiltrosActivos().length; i++) {
                        var numberCol = _this.gpImportar.getColumnModel().findColumnIndex(_this.gfFiltros.getFiltrosActivos()[i].dataIndex);
                        if (i == _this.gfFiltros.getFiltrosActivos().length - 1) {
                            sep = '';
                        }
                        filtrado_por += _this.gpImportar.getColumnModel().getColumnHeader(numberCol) + sep;
                    }
                    Ext.getCmp('pcontenedor1').setTitle('Importar elementos' + '<i> ' + 'Filtrado por:' + filtrado_por + '</i>');
                    filtrado_por = '';
                }
                showMenuReplace();
            }

            getDataFiltrosActivos = function () {
                return _this.gfFiltros.getFilterData();
            }

            isActive = function (dataIndex) {
                var filter_activ = _this.gfFiltros.getFiltrosActivos();
                var exist = false;
                for (var i = 0; i < filter_activ.length; i++) {
                    if (filter_activ[i].dataIndex == dataIndex)
                        return true;
                }
                return false;
            }

            isSelected = function (dataIndex) {
                var cm = _this.gpImportar.getColumnModel();
                var exist = false;
                for (var i = 0; i < cm.config.length; i++) {
                    if (cm.config[i].dataIndex != undefined)
                        if (cm.config[i].dataIndex == dataIndex)
                            return cm.config[i].checked_column;
                }
                return false;
            }

            setColumnSelected = function (dataIndex, val) {
                var cm = _this.gpImportar.getColumnModel();
                for (var i = 0; i < cm.config.length; i++) {
                    if (cm.config[i].dataIndex != undefined)
                        if (cm.config[i].dataIndex == dataIndex) {
                            cm.config[i].checked_column = val;
                            return;
                        }
                }
            }

            getColumnCheckeds = function () {
                var cm = _this.gpImportar.getColumnModel();
                var column_checkeds = [];
                for (var i = 0; i < cm.config.length; i++) {
                    if (cm.config[i].dataIndex != undefined)
                        if (cm.config[i].checked_column == true) {
                            column_checkeds.push({
                                column_name: cm.config[i].dataIndex
                            });
                        }
                }
                return column_checkeds;
            }

            builReplaceValueInColumn = function (pgrid) {
                var view = pgrid.getView();
                pgrid.getView().hmenu.addItem(new Ext.menu.Separator({
                    id: 'seperadorreemplazar'
                }));
                pgrid.getView().hmenu.add(new Ext.menu.Item({
                    text: 'Reemplazar',
                    id: 'mnremplazar',
                    //icon: perfil.dirImg + 'buscaryremplazar.png',
                    iconCls: 'buscaryremplazar',
                    menu: new Ext.menu.Menu()
                }));
                //seleccionar columna
                tfreplace = new Ext.menu.TextFieldItem({
                    //icon: perfil.dirImg + 'pegar.png',
                    iconCls: 'pegar'
                });
                tfreplace.loadConfig(
                    'string_adaptado',
                    'tfremplazar',
                    '95%',
                    '',
                    false,
                    '',
                    '',
                    ''
                );
                tfreplace.on('keyup', function (event) {
                    if (event.getKey() == event.ENTER) {
                        replace(dataIndexSelecc, this.getValue());
                        this.setValue('');
                        _this.gpImportar.getView().hmenu.hide(false);
                        return;
                    }
                    if (event.getKey() == event.ESC) {
                        this.setValue('');
                        return;
                    }
                    if (event.getKey() == event.DELETE) {
                        this.setValue('');
                    }
                }, null);
                Ext.getCmp('mnremplazar').menu.add(tfreplace);
                pgrid.on('headermousedown', function (grid, colIndex, e) {
                    dataIndexSelecc = pgrid.getColumnModel().getDataIndex(colIndex);
                });
                pgrid.getView().hmenu.on('beforeshow', function () {
                    showMenuReplace();
                });
            }

            deleteSeleccInColumn = function (pgrid) {
                if (Ext.getCmp('checkmnSelecc') != undefined) {
                    Ext.getCmp('checkmnSelecc').hide();
                    Ext.getCmp('checkmnSelecc').hide();
                }
            }

            builSeleccInColumn = function (pgrid) {
                pgrid.getView().hmenu.addItem(new Ext.menu.Separator({
                    id: 'seperadorselcccolumn'
                }));
                pgrid.getView().hmenu.add(new Ext.menu.CheckItem({
                    text: 'Selccionado',
                    id: 'checkmnSelecc'
                }));
                Ext.getCmp('checkmnSelecc').on('checkchange', function (ck, checked) {
                    setColumnSelected(dataIndexSelecc, checked);
                });
            }

            showMenuReplace = function () {
                if (dataIndexSelecc == 'iddatosnomenclador') {
                    Ext.getCmp('seperadorreemplazar').hide();
                    Ext.getCmp('mnremplazar').hide();
                    Ext.getCmp('seperadorselcccolumn').hide();
                    Ext.getCmp('checkmnSelecc').hide();
                } else {
                    if (Ext.getCmp('seperadorreemplazar')) Ext.getCmp('seperadorreemplazar').show();
                    if (Ext.getCmp('mnremplazar')) Ext.getCmp('mnremplazar').show();
                    if (tieneAccionActualizar) {
                        Ext.getCmp('seperadorselcccolumn').show();
                        Ext.getCmp('checkmnSelecc').show();
                        Ext.getCmp('checkmnSelecc').setChecked(isSelected(dataIndexSelecc));
                    } else {
                        if (Ext.getCmp('seperadorselcccolumn')) Ext.getCmp('seperadorselcccolumn').hide();
                        if (Ext.getCmp('checkmnSelecc')) Ext.getCmp('checkmnSelecc').hide();
                    }
                    if (isActive(dataIndexSelecc))
                        Ext.getCmp('mnremplazar').enable();
                    else if (Ext.getCmp('mnremplazar')) Ext.getCmp('mnremplazar').disable();
                }
            }

            replace = function (dataIndex, valor) {
                //_this.BarraProgreso.mostrarMascara('replace_mask', 'Por favor espere...', 'Reemplazando valores');
                _this.BarraProgreso.show('Reemplazando valores');
                Ext.Ajax.request({
                    url: '/configuracion/importar/importar/index.php/cmpimportar/remplazarValor',
                    timeout: 7200000, //milisegundos = 120 min 2hrs
                    params: {
                        campo: dataIndex,
                        nuevoval: valor,
                        filtros: Ext.encode(getDataFiltrosActivos()),
                        idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
                    },
                    callback: function (opcions, success, response) {
                        //_this.BarraProgreso.ocultarMascara('replace_mask');
                        _this.BarraProgreso.hide();
                        response = Ext.decode(response.responseText);
                        if (response.cod == 1) {
                            _this.gpImportar.getStore().reload({
                                callback: function () {
                                    mostrarMensaje(1, 'El(los) valor(es) de la columna han sido remplazados correctamente.');
                                }
                            });
                        } else if (response.cod == 2) {
                            _this.gpImportar.getStore().reload({
                                callback: function () {
                                    mostrarMensaje(1, 'El(los) valor(es) de la columna no pudieron ser remplazados.');
                                }
                            })
                        }
                    }
                });
            }
        }
    }


}