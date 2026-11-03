var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('formulatablacalorica', cargarInterfaz);
var offset = 0, offsetInd = 0, offsetFormula = 0, offsetEnFormula = 0;
var indicadores_modificados = [];
//inicio de cargar interfaz
function cargarInterfaz() {
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'I',
            alt: true,
            fn: function () {
                if (validarBtn(btnAdd)) {
                    btnAddFunction();
                }
            }
        }, {
            key: 46,
            fn: function () {
                if (validarBtn(btnDel)) {
                    btnDelFunction();
                }
            }
        }, {
            key: 'G',
            alt: true,
            fn: function () {
                if (validarBtn(btnGuardar)) {
                    btnGuardarFunction();
                }
            }
        }, {
            key: 'D',
            alt: true,
            fn: function () {
                if (validarBtn(btnVer)) {
                    btnVerFunction();
                }
            }
        }, {
            key: 'X',
            alt: true,
            fn: function () {
                if (validarBtn(btnActivar)) {
                    btnActivarFunction();
                }
            }
        }, {
            key: 'Y',
            alt: true,
            fn: function () {
                if (validarBtn(btnDesactivar)) {
                    btnDesactivarFunction();
                }
            }
        },
    ]);

    validarBtn = function (btn) {
        return btn.hidden == false && !btn.disabled
    };

    //botones del tabPanel
    btnAdd = new Ext.Toolbar.Button({
        id: 'btnAdd',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbAdicionar + ' <b>(Alt+I)</b>',
        handler: function () {
            btnAddFunction();
        }
    });
    btnAddFunction = function () {
        winAddInd.show();
        stAddIndicador.load();
    };

    btnDel = new Ext.Toolbar.Button({
        id: 'btnDel',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbEliminar + ' <b>(Del)</b>',
        disabled: true,
        handler: function () {
            btnDelFunction();
        }
    });
    btnDelFunction = function () {
        accionEliminar();
    };

    btnGuardar = new Ext.Toolbar.Button({
        id: 'btnGuardar',
        disabled: true,
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardar + ' <b>(Alt+G)</b>',
        handler: function () {
            btnGuardarFunction();
        }
    });
    btnGuardarFunction = function () {
        accionActualizar('null');
        btnGuardar.disable();
    };

    btnVer = new Ext.Toolbar.Button({
        id: 'btnVer',
        disabled: true,
        iconCls: 'ver',
        itemCls: 'x-menu-item icondistra-ver',
        tooltip: perfil.etiquetas.lbVerDetalles + ' <b>(Alt+D)</b>',
        handler: function () {
            btnVerFunction();
        }
    });
    btnVerFunction = function () {
        stVerFormula.load();
        winVerFormula.show();
    };

    btnActivar = new Ext.Toolbar.Button({
        id: 'btnActivar',
        iconCls: 'habilitar',
        tooltip: perfil.etiquetas.lbActivar + ' <b>(Alt+X)</b>',
        disabled: true,
        handler: function () {
            btnActivarFunction();
        }
    });
    btnActivarFunction = function () {
        accionActualizar('true');
    };

    btnDesactivar = new Ext.Toolbar.Button({
        id: 'btnDesactivar',
        iconCls: 'deshabilitar',
        tooltip: perfil.etiquetas.lbDesactivar + ' <b>(Alt+Y)</b>',
        disabled: true,
        handler: function () {
            btnDesactivarFunction();
        }
    });
    btnDesactivarFunction = function () {
        accionActualizar('false');
    };

    btnExportar = new Ext.Toolbar.Button({
        id: 'btnExportar',
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportar,
        handler: function () {
            btnExportarFunction();
        }
    });
    btnExportarFunction = function () {
        accionExportar();
    };

    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudaTablaCalorica',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbAyuda,
        tooltip: perfil.etiquetas.lbAyuda,
        handler: function () {
            btnAyudaFunction();
        }
    });
    btnAyudaFunction = function () {

    };

    btnLimpiar = new Ext.Toolbar.Button({
        id: 'btnLimpiar',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        disabled: false,
        handler: function () {
            btnLimpiarFunction();
        }
    });
    btnLimpiarFunction = function () {
        limpiarFiltros(filtrosTablaCalorica);
    };
    //***************************Filtros*********************************

    stum = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/bpgestactividades/cargarunidadmedida',
        id: 'stum',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        },
                [{
                        name: 'idunidadmedida'
                    }, {
                        name: 'denominacionunidadmedida'
                    }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
                stGridpTablaCalorica.reload();
            }
        }
    });
    stum.reload();
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtrosTablaCalorica = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaTC',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'numeric',
                dataIndex: 'kcal'
            }, {
                type: 'numeric',
                dataIndex: 'grasas'
            }, {
                type: 'numeric',
                dataIndex: 'proteinas'
            }, {
                type: 'numeric',
                dataIndex: 'carbohidratos'
            }, {
                type: 'list',
                dataIndex: 'enuso',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'enuso',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }]
    });
    /** **************** Fin de filtros************************ */

    //inicio del grid de datos
    stGridpTablaCalorica = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarTablaCalorica',
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrar(GridpTablacalorica, filtrosTablaCalorica, perfil.etiquetas.lbTablaCalorica);
                stGridpTablaCalorica.baseParams.start = offset;
            },
            load: function (options, success, response) {
                if (filtrosTablaCalorica.getFiltrosActivos().length > 0 && stGridpTablaCalorica.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    btnExportar.disable();
                } else {
                    btnExportar.enable();
                }
                indicadores_modificados = [];
                actualizarEstados();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idtablacalorica',
            totalProperty: 'total'
        }, [{
                name: 'idtablacalorica'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'cantidad'
            }, {
                name: 'kcal'
            }, {
                name: 'grasas'
            }, {
                name: 'proteinas'
            }, {
                name: 'carbohidratos'
            }, {
                name: 'enuso'
            }, {
                name: 'estado'
            }])
    });
    smTablaCalorica = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                actualizarEstados();
            },
            rowdeselect: function (sm, indiceFila, record) {
                actualizarEstados();
            }
        }
    });
    //inicio del grid
    cmTablaCalorica = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM

        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            sortable: true,
            dataIndex: 'precio',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            sortable: true,
            dataIndex: 'cantidad',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                invalidText: perfil.etiquetas.msgMayorQueCero,
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbKcal,
            tooltip: perfil.etiquetas.lbKilocalorias,
            sortable: true,
            dataIndex: 'kcal',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                invalidText: perfil.etiquetas.msgMayorQueCero,
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbGrasas,
            tooltip: perfil.etiquetas.lbGrasas,
            sortable: true,
            dataIndex: 'grasas',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                invalidText: perfil.etiquetas.msgMayorQueCero,
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbProteinas,
            tooltip: perfil.etiquetas.lbProteinas,
            sortable: true,
            dataIndex: 'proteinas',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                invalidText: perfil.etiquetas.msgMayorQueCero,
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbCarbohidratos,
            tooltip: perfil.etiquetas.lbCarbohidratos,
            sortable: true,
            dataIndex: 'carbohidratos',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 6,
                invalidText: perfil.etiquetas.msgMayorQueCero,
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbEnUso,
            tooltip: perfil.etiquetas.lbEnUso,
            width: 60,
            sortable: true,
            align: 'center',
            dataIndex: 'enuso',
            renderer: modificarEstado
        }, {
            header: perfil.etiquetas.lbActivado,
            tooltip: perfil.etiquetas.lbActivado,
            width: 60,
            sortable: true,
            align: 'center',
            dataIndex: 'estado',
            renderer: modificarEstado
        }
    ]);
    GridpTablacalorica = new Ext.grid.EditorGridPanel({
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        store: stGridpTablaCalorica,
        plugins: filtrosTablaCalorica,
        sm: smTablaCalorica,
        cm: cmTablaCalorica,
        title: perfil.etiquetas.lbTablaCalorica,
        autoExpandColumn: 'expandir',
        frame: true,
        enableKeyEvents: true,
        clicksToEdit: 2,
        height: 600,
        bbar: new Ext.PagingToolbar({
            store: stGridpTablaCalorica,
            displayInfo: true,
            items: ['-', btnLimpiar],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function (sm) {
                btnGuardar.enable();
                indicadores_modificados.push({
                    data: sm.record.data
                });
            }
        }
    });
    //fin del grid
    pTablaCalorica = new Ext.Panel({
        id: 'panelTablaCalorica',
        layout: 'fit',
        tbar: [btnAdd, btnDel, btnGuardar, btnVer, btnActivar, btnDesactivar, '-', btnExportar, '->', btnAyuda],
        items: [GridpTablacalorica]
                //usarKeymap: true,
                // botonesKeymap: [btnAdd]
    });
    /*      INDICADORES     */
    //Adicionar Indicadores a la tabla calórica
    checkSmAddIndicador = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                actualizarEstadosAdd();
            },
            rowdeselect: function (sm, indiceFila, record) {
                actualizarEstadosAdd();
            }
        }
    });
    filtrosindicadores = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddTC',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }]
    });
    cmAddIndicador = new Ext.grid.ColumnModel([checkSmAddIndicador, {
            id: 'mscolumn',
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNoPieza,
            tooltip: perfil.etiquetas.lbNumeroPieza,
            width: 120,
            sortable: true,
            dataIndex: 'numeropieza',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            id: 'precio',
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            width: 80,
            sortable: true,
            align: 'right',
            dataIndex: 'precio',
            renderer: crearToolTip
        }
    ]);
    stAddIndicador = new Ext.data.Store({
        url: 'listarIndicadoresAddTablaCalorica',
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrar(gpAddIndicador, filtrosindicadores, perfil.etiquetas.lbAddIndicador);
                stAddIndicador.baseParams.start = offsetInd;
            },
            load: function () {
                if (stAddIndicador.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                }
                actualizarEstadosAdd();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }])
    });
    // Grid panel para los elementos
    btnLimpiarInd = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarInd',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            limpiarFiltros(filtrosindicadores);
        }
    });
    gpAddIndicador = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        store: stAddIndicador,
        plugins: filtrosindicadores,
        sm: checkSmAddIndicador,
        cm: cmAddIndicador,
        title: perfil.etiquetas.lbAddIndicador,
        autoExpandColumn: 'expandir',
        stripeRows: true,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stAddIndicador,
            displayInfo: true,
            items: ['-', btnLimpiarInd],
            listeners: {
                beforechange: function (p, e) {
                    offsetInd = e.start;
                }
            }
        })
    });
    pAddIndicador = new Ext.Panel({
        id: 'panelAddIndicador',
        layout: 'fit',
        items: [gpAddIndicador]
    });
    winAddInd = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        width: 960,
        layout: 'fit',
        items: pAddIndicador,
        constrain: true,
        height: 500,
        title: perfil.etiquetas.lbAdicionar,
        listeners: {
            hide: function () {
                //filtrosindicadores.clearFilters();
                stGridpTablaCalorica.reload();
            }
        },
        buttons: [{
                id: 'btnAddCancelar',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbTtCancelar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winAddInd.hide();
                }
            }, {
                id: 'btnAddAplicar',
                iconCls: 'aplicar',
                tooltip: perfil.etiquetas.lbTtAplicar,
                text: perfil.etiquetas.lbAplicar,
                handler: function () {
                    adicionarIndicador(true);
                }
            }, {
                id: 'btnAddAceptar',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.lbTtAceptar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    adicionarIndicador();
                }
            }]
    });
    /*---VER FORMULAS RELACIONADAS---*/
    filtrosformula = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'list',
                dataIndex: 'tipoporciento',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'string',
                dataIndex: 'salida'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadsalida'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddTC',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'kcalformula'
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }]
    });
    cmVerFormula = new Ext.grid.ColumnModel([//checkSmVerFormula,
        {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbTipoFormula,
            tooltip: perfil.etiquetas.lbTtTipoFormula,
            sortable: true,
            dataIndex: 'tipoporciento',
            renderer: modificarTipo
        }, {
            header: perfil.etiquetas.lbSalida,
            tooltip: perfil.etiquetas.lbSalida,
            sortable: true,
            dataIndex: 'salida',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbKcalFormula,
            tooltip: perfil.etiquetas.lbKilocaloriasFormula,
            align: 'right',
            sortable: true,
            dataIndex: 'kcalformula',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCantidadSalida,
            tooltip: perfil.etiquetas.lbCantidadSalida,
            align: 'right',
            sortable: true,
            dataIndex: 'cantidadsalida',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUMSalida,
            tooltip: perfil.etiquetas.lbUnidadMedidaSalida,
            sortable: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbEstado,
            tooltip: perfil.etiquetas.lbEstado,
            width: 60,
            sortable: true,
            align: 'center',
            dataIndex: 'estado',
            renderer: modificarEstado
        }
    ]);
    smVerFormula = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                stVerEnFormula.load();
            },
            rowdeselect: function (sm, indiceFila, record) {
            }
        }
    });
    stVerFormula = new Ext.data.Store({
        url: 'listarFormulasRelacionadas',
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrar(gpVerFormula, filtrosformula, perfil.etiquetas.lbVerFormula);
                stVerFormula.baseParams.start = offsetFormula;
                recordsSel = GridpTablacalorica.getSelectionModel().getSelections();
                stVerFormula.baseParams.idtablacalorica = recordsSel[0].data.idtablacalorica;
            },
            load: function () {
                if (stVerFormula.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idformula'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'tipoporciento'
            }, {
                name: 'idindicadorsalida'
            }, {
                name: 'salida'
            }, {
                name: 'cantidadsalida'
            }, {
                name: 'idumedida'
            }, {
                name: 'kcalformula'
            }, {
                name: 'estado'
            }])
    });
    stVerEnFormula = new Ext.data.Store({
        url: 'listarIndicadorEnLaFormula',
        listeners: {
            beforeload: function () {
                cambiarTituloFiltrar(gpVerFormula, filtrosformula, perfil.etiquetas.lbVerFormula);
                recordsSel = GridpTablacalorica.getSelectionModel().getSelections();
                formulaSel = gpVerFormula.getSelectionModel().getSelections();
                stVerEnFormula.baseParams.start = offsetEnFormula;
                stVerEnFormula.baseParams.idtablacalorica = recordsSel[0].data.idtablacalorica;
                stVerEnFormula.baseParams.idformula = formulaSel[0].data.idformula;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'idformula'
            }, {
                name: 'porciento'
            }, {
                name: 'cantidad'
            }, {
                name: 'kcal'
            }, {
                name: 'grasas'
            }, {
                name: 'proteinas'
            }, {
                name: 'carbohidratos'
            }, {
                name: 'importe'
            }])
    });
    // Grid panel para los elementos
    btnLimpiarFormula = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFormula',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            limpiarFiltros(filtrosformula);
        }
    });
    gpVerFormula = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        store: stVerFormula,
        plugins: filtrosformula,
        sm: smVerFormula,
        cm: cmVerFormula,
        title: perfil.etiquetas.lbVerFormula,
        autoExpandColumn: 'expandir',
        stripeRows: true,
        region: 'center',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stVerFormula,
            displayInfo: true,
            items: ['-', btnLimpiarFormula],
            listeners: {
                beforechange: function (p, e) {
                    offsetFormula = e.start;
                }
            }
        })
    });
    filtrosenformula = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }]
    });
    cmVerEnFormula = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            align: 'right',
            sortable: true,
            dataIndex: 'cantidad',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPorCiento,
            tooltip: perfil.etiquetas.lbPorCiento,
            align: 'right',
            sortable: true,
            dataIndex: 'porciento',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbKcal,
            tooltip: perfil.etiquetas.lbKilocalorias,
            align: 'right',
            sortable: true,
            dataIndex: 'kcal',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbGrasas,
            tooltip: perfil.etiquetas.lbGrasas,
            align: 'right',
            sortable: true,
            dataIndex: 'grasas',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbProteinas,
            tooltip: perfil.etiquetas.lbProteinas,
            align: 'right',
            sortable: true,
            dataIndex: 'proteinas',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbCarbohidratos,
            tooltip: perfil.etiquetas.lbCarbohidratos,
            align: 'right',
            sortable: true,
            dataIndex: 'carbohidratos',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbImporte,
            tooltip: perfil.etiquetas.lbImporte,
            align: 'right',
            sortable: true,
            dataIndex: 'importe',
            renderer: crearToolTip
        }
    ]);
    btnLimpiarEnFormula = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFormula',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            limpiarFiltros(filtrosenformula);
        }
    });
    gpVerEnFormula = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        store: stVerEnFormula,
        plugins: filtrosenformula,
        cm: cmVerEnFormula,
        title: perfil.etiquetas.lbVerEnFormula,
        region: 'south',
        height: 200,
        autoWidth: true,
        bbar: new Ext.PagingToolbar({
            store: stVerEnFormula,
            displayInfo: true, //,
            items: ['-', btnLimpiarEnFormula],
            listeners: {
                beforechange: function (p, e) {
                    offsetEnFormula = e.start;
                }
            }
        })
    });
    panelFormula = new Ext.Panel({
        id: 'panelFormula',
        layout: 'border',
        items: [gpVerFormula, gpVerEnFormula]
    });
    winVerFormula = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        width: 800,
        layout: 'fit',
        items: [panelFormula],
        constrain: true,
        height: 500,
        title: perfil.etiquetas.lbVerFormula,
        listeners: {
            hide: function () {
                filtrosformula.clearFilters();
            }
        },
        buttons: [{
                iconCls: 'cancelar',
                id: 'btnCancelarVerFormula',
                tooltip: perfil.etiquetas.lbTtCerrar,
                text: perfil.etiquetas.lbCerrar,
                handler: function () {
                    winVerFormula.hide();
                }
            }]
    });
    ////View port para la interfaz
    MiView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            title: perfil.etiquetas.titGpColumnas,
            layout: 'fit',
            items: pTablaCalorica,
            listeners: {
                afterlayout: function () {
                    Ext.getCmp('btnAyudaTablaCalorica').focus();
                }
            }
        })
    });
}//fin de caragar interfaz

function modificarEstado(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
    }
}

function modificarTipo(val, m) {
    if (val == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbTipoPorcentual + '"';
        return perfil.etiquetas.lbTipoPorcentual;
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbTipoDirecta + '"';
        return perfil.etiquetas.lbTipoDirecta;
    }
}

function crearToolTip(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return val;
}

function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stum.data.items)
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.denominacionunidadmedida;
        }
}

function limpiarFiltros(obj) {
    obj.clearFilters();
    actualizarEstados();
}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + "<i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function actualizarEstados() {
//controlando campos editables
    /* if (smTablaCalorica.getSelected().data.enuso == 1) {
     cmTablaCalorica.setEditable(5, false);
     cmTablaCalorica.setEditable(6, true);
     cmTablaCalorica.setEditable(7, false);
     cmTablaCalorica.setEditable(8, false);
     cmTablaCalorica.setEditable(9, false);
     } else {
     cmTablaCalorica.setEditable(5, true);
     cmTablaCalorica.setEditable(6, true);
     cmTablaCalorica.setEditable(7, true);
     cmTablaCalorica.setEditable(8, true);
     cmTablaCalorica.setEditable(9, true);
     } */

    recordsSel = GridpTablacalorica.getSelectionModel().getSelections();
    if (recordsSel.length > 0) {
        btnDel.enable();
        btnActivar.enable();
        btnDesactivar.enable();
        if (recordsSel.length == 1) {
//Si la selección es simple
            if (recordsSel[0].data.enuso == 1) {
//Si está en uso
                btnVer.enable();
                btnDel.disable();
            }
            if (recordsSel[0].data.estado == 1 || recordsSel[0].data.kcal == 0) {
//Si está activado
                btnActivar.disable();
            } else {
//Si está desactivado
                btnDesactivar.disable();
            }
        }
    } else {
        btnDel.disable();
        btnVer.disable();
        btnActivar.disable();
        btnDesactivar.disable();
    }
}

function actualizarEstadosAdd() {
    recordsSelAdd = gpAddIndicador.getSelectionModel().getSelections();
    if (recordsSelAdd.length > 0) {
        Ext.getCmp('btnAddAplicar').enable();
        Ext.getCmp('btnAddAceptar').enable();
    } else {
        Ext.getCmp('btnAddAplicar').disable();
        Ext.getCmp('btnAddAceptar').disable();
    }
}

function adicionarIndicador(apl) {
    recordsAdd = gpAddIndicador.getSelectionModel().getSelections();
    indicadoresAdd = [];
    if (recordsAdd.length > 0) {
        for (var i = 0; i < recordsAdd.length; i++) {
            indicadoresAdd.push({
                indicador: recordsAdd[i].data
            });
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'adicionarIndicadoresTablaCalorica',
            params: {
                indicadores: Ext.encode(indicadoresAdd)
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgN == 1) {
                    if (apl) {
                        stAddIndicador.reload();
                    } else {
                        winAddInd.hide();
                    }
                    mostrarMensaje(2, perfil.etiquetas.msgAdicionarOK);
                }
            }
        });
        gpAddIndicador.getSelectionModel().clearSelections();
    }
}

function accionEliminar() {
    recordsDel = GridpTablacalorica.getSelectionModel().getSelections();
    if (recordsDel.length == 1) {
        mensajeDeVuelta = perfil.etiquetas.msgEliminarSingularOK;
        mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarSingular, eliminar);
    } else {
        mensajeDeVuelta = perfil.etiquetas.msgEliminarPluralOK;
        mostrarMensaje(2, perfil.etiquetas.msgConfirmarEliminarPlural, eliminar);
    }
    eliminarEnUso = 0;
    function eliminar(keypressed) {
        if (keypressed == 'ok') {
            indicadoresDel = [];
            for (var i = 0; i < recordsDel.length; i++) {
                if (recordsDel[i].data.enuso == 1) {
                    eliminarEnUso++;
                } else {
                    indicadoresDel.push(recordsDel[i].data);
                }
            }
            mymask.show();
            if (eliminarEnUso > 0) {
                mensajeDeVuelta = perfil.etiquetas.msgEliminarPluralNoOK;
            }
            if (indicadoresDel.length > 0) {
                Ext.Ajax.request({
                    url: 'eliminarIndicadoresTablaCalorica',
                    params: {
                        indicadores: Ext.encode(indicadoresDel)
                    },
                    callback: function (opcions, success, response) {
                        mymask.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgN == 1) {
                            stGridpTablaCalorica.reload();
                            mostrarMensaje(2, mensajeDeVuelta);
                        }
                    }
                });
            } else {
                mymask.hide();
                mostrarMensaje(2, mensajeDeVuelta);
            }
        }
    }
}

function accionActualizar(active) {
    recordsUpd = [];
    actualizarEnUso = 0;
    activarEnUso = 0;
    if (active == 'null') {
        recordsUpd = indicadores_modificados;
    } else {
        recordsUpd = GridpTablacalorica.getSelectionModel().getSelections();
    }

    indicadoresUpd = [];
    if (recordsUpd.length > 0) {
        for (var i = 0; i < recordsUpd.length; i++) {
            if (recordsUpd[i].data.enuso == 1) {
                if (active == 'null') {
                    actualizarEnUso++;
                } else {
                    activarEnUso++;
                }
            }
            indicadoresUpd.push({
                indicador: recordsUpd[i].data
            });
        }
        if (active == 'true') {
            if (activarEnUso == 0) {
                mensajeDeVuelta = perfil.etiquetas.msgActivarOK;
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarActivar, actualizar_fn);
            } else {
                mensajeDeVuelta = perfil.etiquetas.msgActivarOK;
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarActivarEnUso, actualizar_fn);
            }
        } else if (active == 'false') {
            if (activarEnUso == 0) {
                mensajeDeVuelta = perfil.etiquetas.msgDesactivarOK;
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarDesactivar, actualizar_fn);
            } else {
                mensajeDeVuelta = perfil.etiquetas.msgDesactivarOK;
                mostrarMensaje(3, perfil.etiquetas.msgConfirmarDesactivarEnUso, actualizar_fn);
            }
        } else if (active == 'null') {
            if (actualizarEnUso == 0) {
                mensajeDeVuelta = perfil.etiquetas.msgActualizarOK;
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarGuardar, actualizar_fn);
            } else {
                mensajeDeVuelta = perfil.etiquetas.msgActualizarOK;
                mostrarMensaje(2, perfil.etiquetas.msgConfirmarActualizarEnUso, actualizar_fn);
            }
        }
    }

    function actualizar_fn(keypressed) {
        if (keypressed == 'ok') {
            mymask.show();
            Ext.Ajax.request({
                url: 'actualizarIndicadoresTablaCalorica',
                params: {
                    indicadores: Ext.encode(indicadoresUpd),
                    activar: active
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgN == 1) {
                        stGridpTablaCalorica.reload();
                        mostrarMensaje(2, mensajeDeVuelta);
                    }
                }
            });
            gpAddIndicador.getSelectionModel().clearSelections();
        } else {
            stGridpTablaCalorica.reload();
        }
    }
    indicadores_modificados = [];
}

function accionExportar() {
    var win = window.open('exportarIndicadoresTablaCalorica?'
            + '&filtros=' + Ext.encode(filtrosTablaCalorica.getFilterData()));
    //mascaraExportar(perfil.etiquetas.msgExportandoTabla, perfil.etiquetas.msgEspere, win);
}

