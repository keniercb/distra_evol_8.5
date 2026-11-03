addactividadcarta = function () {

//Objetos del panel actividades
    stActividadesCT = new Ext.data.Store({
        url: 'listarActividadesCT',
        listeners: {
            beforeload: function () {
                if (smGpCT.getSelections().length == 1) {
                    stActividadesCT.baseParams.idcartatecnologica = smGpCT.getSelected() != undefined ? Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idcartatecnologica : null;
                } else {
                    stActividadesCT.baseParams.idcartatecnologica = null;
                }
                stActividadesCT.baseParams.start = offsetActCT;
            },
            load: function (mi, record) {
                cambiarTituloFiltrar(gpActividadesCT, filtrosActCT, perfil.etiquetas.lbActividadesDe + smGpCT.getSelected().data.denominacion);
                controlarObjetosAct();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idcartatecnologicaactividad"
        }, [{
                name: 'idcartatecnologicaactividad'
            }, {
                name: 'idactividad'
            }, {
                name: 'numero'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'plazo'
            }, {
                name: 'duracion'
            }, {
                name: 'idetapa'
            }, {
                name: 'diacero'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }, {
                name: 'porciento'
            }])
    });
    stetapas = new Ext.data.Store({
        url: 'listarEtapas',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idetapa',
            root: 'data'
        }, [{
                name: 'idetapa'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function () {
            },
            load: function () {
            }
        }
    });
    cbEtapas = new Ext.form.ComboBox({
        id: 'cbEtapas',
        store: stetapas,
        valueField: 'idetapa',
        fieldLabel: perfil.etiquetas.lbEtapas,
        hiddenName: 'idetapa',
        displayField: 'denominacion',
        anchor: '100%',
        listWidth: 130,
        mode: 'local',
        editable: true,
        allowBlank: false,
        typeAhead: true,
        triggerAction: 'all',
        listeners: {
            select: function (a, b, c) {
                for (var i = 0; i < gpActividadesCT.getSelections().length; i++) {
                    stActividadesCT.getById(smActividadesCT.getSelections()[i].id).set('idetapa', a.getValue());
                }
            }
        },
        enableKeyEvents: true
    });
    filtrosActCT = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: '',
                dataIndex: 'numero'
            }, {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'numeric',
                dataIndex: 'plazo'
            }, {
                type: 'numeric',
                dataIndex: 'duracion'
            }, {
                type: 'listado',
                dataIndex: 'idetapa',
                idcombo: 'cbEtapas',
                valueFieldcb: 'idetapa',
                displayFieldcb: 'denominacion',
                st: stetapas,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'porciento'
            }, {
                type: 'list',
                dataIndex: 'diacero',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo]
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuario',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }]
    });
    smActividadesCT = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function (sm) {
                controlarObjetosAct();
                arrayPadre = [];
                for (var j = 0; j < smActividadesCT.getSelections().length; j++) {
                    arrayPadre.push(smActividadesCT.getSelections()[j].data);
                }
            },
            rowdeselect: function () {
                arrayPadre = [];
                for (var j = 0; j < smActividadesCT.getSelections().length; j++) {
                    arrayPadre.push(smActividadesCT.getSelections()[j].data);
                }
            }
        }
    });
    cmActividadesCT = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(), {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPlazoInicio,
            tooltip: perfil.etiquetas.lbPlazoInicio,
            width: 100,
            dataIndex: 'plazo',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 0,
                allowBlank: false,
                maxLength: 5
            })
        }, {
            header: perfil.etiquetas.lbDuracion,
            tooltip: perfil.etiquetas.lbDuracionHoras,
            sortable: true,
            width: 150,
            align: 'right',
            dataIndex: 'duracion',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                decimalPrecision: 2,
                invalidText: perfil.etiquetas.msgValorMayorquecero,
                validator: function (val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbEtapas,
            tooltip: perfil.etiquetas.lbEtapas,
            sortable: true,
            width: 130,
            renderer: rendercbEtapa,
            dataIndex: 'idetapa',
            editor: cbEtapas
        }, {
            header: perfil.etiquetas.lbPorciento,
            tooltip: perfil.etiquetas.lbPorcientoRendimiento,
            width: 100,
            dataIndex: 'porciento',
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 2,
                allowBlank: false,
                invalidText: perfil.etiquetas.msgValidarPorciento,
                validator: function (val) {
                    if (val == 0 || val > 100) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbDiaCero,
            tooltip: perfil.etiquetas.lbDiaCero,
            sortable: true,
            dataIndex: 'diacero',
            renderer: renderActivado
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            dataIndex: 'fecha',
            sortable: false,
            hidden: true,
            width: 120,
            renderer: renderFecha
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            dataIndex: 'idusuario',
            sortable: false,
            hidden: true,
            width: 120,
            renderer: renderUsuario
        }]);
    btnAdicionarActividadCT = new Ext.Button({
        handler: function () {
            accionvalidar = 'adicionar_Act';
            addActividad();
        },
        tooltip: perfil.etiquetas.lbAdicionarActividadCT,
        disabled: false,
        id: 'btnAdicionarActividadCT',
        iconCls: 'adicionar'
    });
    btnDuplicarActividadCT = new Ext.Button({
        handler: function () {
            accionvalidar = 'duplicar_Act';
            duplicarActividadesCarta();
        },
        tooltip: perfil.etiquetas.lbDuplicarActividadCT,
        disabled: false,
        id: 'btnDuplicarActividadCT',
        iconCls: 'duplicar'
    });
    btnGuardarActividadCT = new Ext.Button({
        handler: function () {
            GuardarTodos();
        },
        tooltip: perfil.etiquetas.lbGuardarActividadCT,
        disabled: false,
        id: 'btnGuardarActividadCT',
        iconCls: 'guardar'
    });
    btnEliminarActividadCT = new Ext.Button({
        handler: function () {
            accionvalidar = 'eliminar_Act';
            EliminarActividadesCarta();
        },
        tooltip: perfil.etiquetas.lbEliminarActividadCT,
        id: 'btnEliminarActividadCT',
        iconCls: 'eliminar'
    });
    btnDiaCeroActividadCT = new Ext.Button({
        handler: function () {
            definirDiaCero();
        },
        tooltip: perfil.etiquetas.lbDefinirDiaCero,
        id: 'btnDiaCeroActividadCT',
        iconCls: 'actual'
    });
    btnImportarCT = new Ext.Button({
        disabled: true,
        id: 'btnImportarCT',
        iconCls: 'importar',
        tooltip: perfil.etiquetas.lbImportar,
        handler: function () {
            initimportaractividadescarta();
            offsetdin = 0;
            winImportar(fpbuscar);
        }
    });
    btnLimpiarActCT = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarActCT',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosActCT.clearFilters();
            controlarObjetosAct();
        }
    });
    btnMostrarNorma = new Ext.Button({
        disabled: true,
        iconCls: 'mostrar',
        tooltip: perfil.etiquetas.lbMostrarNorma,
        id: 'btnmostrarnorma',
        handler: function () {
            winNorma.setTitle(perfil.etiquetas.lbNormaActividad + smActividadesCT.getSelected().data.denominacion);
            winNorma.show();
            stNorma.reload();
        }
    });
    gpActividadesCT = new Ext.grid.EditorGridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        plugins: filtrosActCT,
        store: stActividadesCT,
        sm: smActividadesCT,
        cm: cmActividadesCT,
        title: perfil.etiquetas.lbActividadesDe,
        region: 'center',
        enableKeyEvents: true,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            store: stActividadesCT,
            displayInfo: true,
            items: ['-', btnLimpiarActCT],
            listeners: {
                beforechange: function (p, e) {
                    offsetActCT = e.start;
                }
            }
        }),
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                var col = me.colModel.getColumnById(me.colModel.getColumnId(col_id));
                if (col && col.dataIndex == 'plazo' && smActividadesCT.getSelected().data.diacero == 1) {
                    gpActividadesCT.getColumnModel().setEditable(col_id, false);
                }
            },
            afteredit: function () {
                btnGuardarActividadCT.enable();
            }
        },
        tbar: [btnAdicionarActividadCT, btnDuplicarActividadCT, btnGuardarActividadCT, btnEliminarActividadCT, '-', btnDiaCeroActividadCT, '-', btnMostrarNorma, '-', btnImportarCT]
    });

    //******************FILTRO***************************
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    Ext.grid.filter.String_adaptadoFilter.prototype.icon = perfil.dirImg + 'find.png';
    //Ventana de Norma
    // *** Column Model del Grid
    cmNorma = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            width: 100,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNroPieza,
            tooltip: perfil.etiquetas.lbNumeroPieza,
            sortable: true,
            hidden: true,
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
            header: perfil.etiquetas.lbNaturaleza,
            tooltip: perfil.etiquetas.lbNaturaleza,
            align: 'center',
            dataIndex: 'idnaturaleza',
            sortable: true,
            hidden: true,
            renderer: renderNaturaleza
        }, {
            header: perfil.etiquetas.lbCentroBalance,
            tooltip: perfil.etiquetas.lbCentroBalance,
            dataIndex: 'idcentrobalance',
            sortable: true,
            hidden: true,
            renderer: renderCentroBalance
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            width: 100,
            align: 'center',
            dataIndex: 'idumedida',
            sortable: true,
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbAprobado,
            tooltip: perfil.etiquetas.lbAprobado,
            align: 'center',
            dataIndex: 'idaprobacion',
            sortable: true,
            hidden: true,
            renderer: renderAprobado
        }, {
            header: perfil.etiquetas.lbNivelPlanif,
            tooltip: perfil.etiquetas.lbNivelPlanif,
            align: 'center',
            dataIndex: 'nivelplanif',
            sortable: true,
            hidden: true,
            renderer: renderNivelPlanif
        }, {
            header: perfil.etiquetas.lbActivado,
            tooltip: perfil.etiquetas.lbActivado,
            width: 100,
            align: 'center',
            dataIndex: 'estado',
            sortable: true,
            renderer: renderActivado
        }, {
            header: perfil.etiquetas.lbPrecioMN,
            tooltip: perfil.etiquetas.lbPrecioMN,
            width: 100,
            align: 'right',
            dataIndex: 'precio',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNorma,
            tooltip: perfil.etiquetas.lbNorma,
            align: 'right',
            hidden: true,
            dataIndex: 'cantplanif',
            renderer: crearToolTip,
            sortable: true
        }, {
            header: perfil.etiquetas.lbBase,
            tooltip: perfil.etiquetas.lbBase,
            dataIndex: 'cantbase',
            width: 100,
            align: 'right',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNecesidad,
            tooltip: perfil.etiquetas.lbNecesidad,
            dataIndex: 'necesidad',
            width: 100,
            align: 'right',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbImporteMN,
            tooltip: perfil.etiquetas.lbImporteMN,
            dataIndex: 'importe',
            width: 100,
            align: 'right',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbPrecioMLC,
            tooltip: perfil.etiquetas.lbPrecioMLC,
            dataIndex: 'preciodivisa',
            align: 'right',
            sortable: true,
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbImporteMLC,
            tooltip: perfil.etiquetas.lbImporteMLC,
            dataIndex: 'importedivisa',
            align: 'right',
            sortable: true,
            hidden: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            dataIndex: 'idusuario',
            sortable: true,
            hidden: true,
            renderer: renderUsuario
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            dataIndex: 'fecha',
            sortable: true,
            hidden: true,
            renderer: crearToolTip
        }]);
    // Store grid stGpCT
    stNorma = new Ext.data.Store({
        url: 'listarNormas',
        listeners: {
            beforeload: function (st) {
                this.baseParams.start = offsetNorma;
                this.baseParams.idactividad = smActividadesCT.getSelected().data.idactividad;

            },
            load: function () {
                cambiarTituloFiltrar(gpNorma, filtrosNorma, perfil.etiquetas.lbIndicadoresNorma);
                if (stNorma.getCount() == 0) {
                    if (filtrosNorma.getFiltrosActivos() == undefined || filtrosNorma.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idnorma'
        }, [{
                name: 'idnorma'
            }, {
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'idnaturaleza'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'idumedida'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'nivelplanif'
            }, {
                name: 'estado'
            }, {
                name: 'precio'
            }, {
                name: 'cantplanif'
            }, {
                name: 'cantbase'
            }, {
                name: 'necesidad'
            }, {
                name: 'importe'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'importedivisa'
            }, {
                name: 'idusuario'
            }, {
                name: 'fecha'
            }])
    });
    // Selection Model grid 
    smNorma = new Ext.grid.RowSelectionModel({});
    btnLimpiarNorma = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarNorma',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosNorma.clearFilters();
        }
    });
    filtrosNorma = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idnaturaleza',
                idcombo: 'idcbnaturalezas',
                valueFieldcb: 'naturaleza',
                displayFieldcb: 'denominacion',
                st: stNaturaleza,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idcentrobalance',
                idcombo: 'idcbcentrobalanceindicadornorma',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance',
                st: stCB,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbumrendimiento',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [perfil.etiquetas.lbNo,
                    perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbRector]
            }, {
                type: 'list',
                dataIndex: 'nivelplanif',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [perfil.etiquetas.lbSi,
                    perfil.etiquetas.lbNo]
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'cantplanif'
            }, {
                type: 'numeric',
                dataIndex: 'cantbase'
            }, {
                type: 'numeric',
                dataIndex: 'necesidad'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importedivisa'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'idcbusuarioNormas',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }]
    });
    // Grid gestion 
    gpNorma = new Ext.grid.GridPanel({
        store: stNorma,
        plugins: filtrosNorma,
        autoExpandColumn: 'expandir',
        sm: smNorma,
        cm: cmNorma,
        region: 'center',
        frame: true,
        title: perfil.etiquetas.lbIndicadoresNorma,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stNorma,
            displayInfo: true,
            items: ['-', btnLimpiarNorma],
            listeners: {
                beforechange: function (p, e) {
                    offsetNorma = e.start;
                }
            }
        })
    });
    // Colum Model grid Norma

    panelNorma = new Ext.Panel({
        layout: 'border',
        id: 'panelNorma',
        items: [gpNorma]
    });
    winNorma = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        width: 850,
        height: 600,
        layout: 'fit',
        title: perfil.etiquetas.lbNorma,
        items: panelNorma,
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbTtCerrar,
                text: perfil.etiquetas.lbCerrar,
                handler: function () {
                    winNorma.hide();
                }
            }]
    });
    //Termina Ventana de Norma

    filtrosActividad = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }]
    });
    //***********grid panel****************
    stActividad = new Ext.data.Store({
        url: 'listarActividades',
        baseParams: {
            identidadCT: identidadCT
        },
        listeners: {
            beforeload: function () {
                stActividad.baseParams.start = offsetActividad;
                stActividad.baseParams.identidadCT = nodoEst.id;
            },
            load: function () {
                cambiarTituloFiltrar(gpActividad, filtrosActividad, perfil.etiquetas.lbActividades);
                if (stActividad.getCount() == 0) {
                    if (filtrosActividad.getFiltrosActivos() == undefined || filtrosActividad.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                    }
                }
            }
        },
        enableKeyEvents: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            id: 'idactividad',
            root: 'data'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }])
    });
    //**********checbox************************************
    checkActividad = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    //***************************************************

    cmActividad = new Ext.grid.ColumnModel([checkActividad, {
            width: 100,
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            id: 'expandir',
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            width: 100,
            header: perfil.etiquetas.lbDescripcion,
            tooltip: perfil.etiquetas.lbDescripcion,
            sortable: true,
            dataIndex: 'descripcion',
            renderer: crearToolTip
        }]);
    smActividad = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    btnLimpiarActividad = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarActividad',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosActividad.clearFilters();
        }
    });
    gpActividad = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        id: 'gpActividad',
        store: stActividad,
        plugins: filtrosActividad,
        sm: checkActividad,
        cm: cmActividad,
        region: 'west',
        autoExpandColumn: 'expandir',
        height: 480,
        width: 750,
        margins: '2 2 2 2',
        anchor: '95%',
        title: perfil.etiquetas.lbActividades,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        listeners: {
            celldblclick: function () {
                adicionarActividadesCarta();
                gpActividad.getSelectionModel().clearSelections();
            }
        },
        bbar: new Ext.PagingToolbar({
            store: stActividad,
            displayInfo: true,
            items: ['-', btnLimpiarActividad],
            listeners: {
                beforechange: function (p, e) {
                    offsetActividad = e.start;
                }
            }
        })
    });
    //***************window principal************
    winActividad = new Ext.Window({
        modal: true,
        id: 'winActividad',
        constrain: true,
        closeAction: 'hide',
        items: [gpActividad],
        layout: 'fit',
        title: perfil.etiquetas.lbAdicionarActividadCT,
        buttons: [{
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.msgCerrarSinGuardar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winActividad.hide();
                    gpActividad.getSelectionModel().clearSelections();
                }
            }, {
                id: 'btnaplicar',
                iconCls: 'aplicar',
                tooltip: perfil.etiquetas.msgGuardarSinCerrar,
                text: perfil.etiquetas.lbAplicar,
                handler: function () {
                    adicionarActividadesCarta(true);
                    gpActividad.getSelectionModel().clearSelections();
                }
            }, {
            id: 'btnaceptaractividad',
                iconCls: 'aceptar',
                tooltip: perfil.etiquetas.msgGuardaryCerrar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    adicionarActividadesCarta();
                    gpActividad.getSelectionModel().clearSelections();
                }
            }]
    });
}

function actionDependencia() {
    var _this = this;
    var idEntidad = id_entidad_seleccionada;
    Ext.Ajax.request({
        url: 'gestDependecia',
        params: {
            idEntidad: idEntidad,
            actPadres: Ext.encode(_this.arrayPadre),
            actChildren: Ext.encode(_this.arrayChildren)
        },
        callback: function (options, success, response) {

        }
    });
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderUsuarios(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stUsuarios.data.items)
        if (stUsuarios.data.items[i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            return stUsuarios.data.items[i].data.nombreusuario;
        }
}

function getRawValue(v, cmb) {
    var arrid = (v != null) ? v.split(",") : '';
    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
        for (var j = 1; j < arrid.length; j++) {
            str += ((cmb.store.find(cmb.valueField, arrid[j]) != -1) ? ','
                    + cmb.store.getAt(cmb.store.find(cmb.valueField,
                            arrid[j])).data[cmb.displayField] : '');
        }
    }
    return str;
}

function rendercbEtapa(value, m) {
    if (value == null) {
        m.attr = 'ext:qtip="-"';
        return '-';
    } else {
        dd = getRawValue(value, cbEtapas);
        m.attr = 'ext:qtip="' + dd + '"';
        return getRawValue(value, cbEtapas);
    }
}


function EliminarActividadesCarta() {
    if (gpActividadesCT.getSelectionModel().getSelections().length == 0) {
        mostrarMensaje(1, perfil.etiquetas.lbMsgInfSeleccionarActividad);
    } else {
        mostrarMensaje(2, perfil.etiquetas.msgEliminarActividad, eliminarActividadesSeleccionadas);
    }
}

function eliminarActividadesSeleccionadas(btnPresionado) {
    if (btnPresionado == 'ok') {
        var mensajeElim = Ext.MessageBox.show({
            title: 'Por favor espere...',
            msg: 'Eliminando las actividades',
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6'
        });
        var recordsSel = gpActividadesCT.getSelectionModel().getSelections(), actElim = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                actElim.push(recordsSel[i].data.idcartatecnologicaactividad);
            Ext.Ajax.request({
                url: 'eliminarActACarta',
                params: {
                    idscartaactividad: Ext.encode(actElim)
                },
                callback: function (options, success, response) {
                    mensajeElim.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 24) {
                        gpActividadesCT.getStore().reload();
                        mostrarMensaje(1, perfil.etiquetas.lbMsgInfEliminarActividad);
                    } else {
                        if (responseData.mensaje != null)
                            mostrarMensaje(2, responseData.mensaje);
                        else
                            mostrarMensaje(2, 'Ha ocurrido un error.');
                    }
                }
            });
        }
    }
}


function addActividad() {
    if (Ext.getCmp('gpCT').getSelectionModel().getSelections().length <= 0) {
        mostrarMensaje(1, 'Debe seleccionar al menos una carta tecnológica.');
    } else {
        winActividad.show();
        accion = 2;
        stActividad.reload();
    }
}

function adicionarActividadesCarta(aplicar) {
//mymask.show();
    var mensajeConf = Ext.MessageBox.show({
        title: 'Por favor espere...',
        msg: 'Adicionando la(s) actividad(es)',
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        id: 'idmensaje'
    });
    var actividades_sel = [];
    for (i = 0; i < gpActividad.getSelectionModel().getCount(); i++) {
        actividades_sel.push(
                gpActividad.getSelectionModel().getSelections()[i].data.idactividad
                );
    }
    Ext.Ajax.request({
        url: 'adicionarActACarta',
        params: {
            idactividades: Ext.encode(actividades_sel),
            idcartatecnologica: Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idcartatecnologica
        },
        callback: function (options, success, response) {
            mensajeConf.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 24) {
                mostrarMensaje(1, perfil.etiquetas.msgAdicionarActividad);
                if (!aplicar) {
                    winActividad.hide();
                }
            } else {
                mostrarMensaje(2, 'Ha ocurrido un error.');
            }
            stActividadesCT.reload();
        }
    });
}

/**
 * funcion que dado un numero en horas te devuleve una cadena string o un objeto segun lo que desees
 * *
 * @param number
 * @returns {string}
 */
function mostrarDuracion(equivalenciaMinutos, bandera) {
    var tiempo = '';
    var objectTiempo = {
        dias: 0,
        horas: 0,
        minutos: 0
    };
    var restoDias = equivalenciaMinutos % (1440);
    var equivalenciaDias = equivalenciaMinutos / (1440);
    var restoHoras = restoDias % (60);
    var equivalenciaHoras = restoDias / (60);
    var restoMinutos = restoDias % (60);
    var equivalenciaDuracion = {
        equivalenciaDias: (parseInt(equivalenciaDias) != 0) ? parseInt(equivalenciaDias) : 0,
        equivalenciaHoras: (parseInt(equivalenciaHoras) != 0) ? parseInt(equivalenciaHoras) : 0,
        restoMinutos: (restoMinutos != 0) ? restoMinutos : 0
    };
    if (equivalenciaMinutos >= 60) {
        if (equivalenciaDuracion.equivalenciaDias != 0) {
            tiempo = parseInt(equivalenciaDuracion.equivalenciaDias) + ' dias';
            objectTiempo.dias = parseInt(equivalenciaDuracion.equivalenciaDias);
        } else
            tiempo = '';
        if (equivalenciaDuracion.equivalenciaHoras != 0) {
            tiempo += ' ' + parseInt(equivalenciaDuracion.equivalenciaHoras) + ' horas';
            objectTiempo.horas = parseInt(equivalenciaDuracion.equivalenciaHoras);
        } else
            tiempo += '';
        if (equivalenciaDuracion.restoMinutos != 0) {
            tiempo += ' ' + Math.round(equivalenciaDuracion.restoMinutos) + ' min';
            objectTiempo.minutos = Math.round(equivalenciaDuracion.restoMinutos);
        } else
            tiempo += '';
    } else {
        tiempo = Math.round(equivalenciaMinutos) + ' min';
        objectTiempo.minutos = Math.round(equivalenciaMinutos);
    }
//m.attr = 'ext:qtip="' + tiempo + '"';
    return bandera ? tiempo : objectTiempo;
}

function EsconderBotonesActividadesCartaTecnologica(idaprobacion) {
    if (idaprobacion == 3 || idaprobacion == 4) {
        Ext.getCmp('btnduplicaractividad').hide();
        //Ext.getCmp('btnmodetapas').hide();
        Ext.getCmp('btneliminaractividad').hide();
    } else {
        Ext.getCmp('btnduplicaractividad').show();
        //Ext.getCmp('btnmodetapas').show();
        Ext.getCmp('btneliminaractividad').show();
    }

}

function definirDiaCero() {
    if (smActividadesCT.getSelected().data.plazo == 0) {
        Ext.Ajax.request({
            url: 'definirDiaCero',
            params: {
                idactividad: smActividadesCT.getSelected().data.idactividad,
                idcartatecnologica: Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idcartatecnologica,
                idcartatecnologicaactividad: smActividadesCT.getSelected().data.idcartatecnologicaactividad
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 'ok') {
                    mostrarMensaje(1, 'La actividad seleccionada ha sido definida como \'día cero\'.');
                } else {
                    mostrarMensaje(2, 'Ha ocurrido un error.');
                }
                stActividadesCT.reload();
            }
        });
    } else {
        mostrarMensaje(2, 'La actividad seleccionada no tiene el plazo definido con valor 0.');
    }
}

function GuardarTodos() {
    mensajeBox = Ext.MessageBox.show({
        title: 'Por favor espere...',
        msg: 'Guardando datos de la(s) actividad(es)',
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6'
    });
    var recordsEnviar = [];
    var modified = gpActividadesCT.getStore().getModifiedRecords();
    if (!Ext.isEmpty(modified)) {
        Ext.each(modified, function (record) {
            recordsEnviar.push(Ext.apply(record.data));
        });
        Ext.Ajax.request({
            url: 'modificarActACarta',
            params: {
                idcartatecnologica: smGpCT.getSelected().data.idcartatecnologica,
                valores: Ext.encode(recordsEnviar)
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 24) {
                    /*for (i = 0; i < recordsEnviar.length; i++) {
                     stGpActividades.getById(recordsEnviar[i].idcartatecnologicaactividad).commit();
                     }*/
                    mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente.')
                    stActividadesCT.reload();
                } else {
                    mostrarMensaje(2, responseData.mensaje);
                }
                mensajeBox.hide();
            }
        });
    }
}

function ViewDuracion(dias, horas, minutos, objeto) {

    var btnAceptar = new Ext.Button({
        text: 'Aceptar',
        iconCls: 'aceptar',
        handler: function () {
            win.close();
            objeto.duracion = calculoNumberField(diass.getValue(), horass.getValue(), minutoss.getValue());
            GuardarDuracion(objeto);
        }
    });
    var btnCancelar = new Ext.Button({
        text: 'Cancelar',
        iconCls: 'cancelar',
        handler: function () {
            win.close();
        }
    });
    var diass = new Ext.form.NumberField({
        allowNegative: false,
        fieldLabel: 'Dias',
        value: dias,
        maxLength: 3,
        maxLengthText: 'El tamaño máximo requerido es 3 dígitos.'
    });
    var horass = new Ext.form.NumberField({
        allowNegative: false,
        fieldLabel: 'Horas',
        value: horas,
        maxValue: 24,
        maxLength: 2,
        maxLengthText: 'El tamaño máximo requerido es 2 dígitos.'
    });
    var minutoss = new Ext.form.NumberField({
        allowNegative: false,
        fieldLabel: 'Minutos',
        value: minutos,
        maxValue: 59,
        maxLength: 2,
        maxLengthText: 'El tamaño máximo requerido es 2 dígitos.'
    });
    var top = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        width: 180,
        layout: 'column',
        items: [{
                layout: 'form',
                items: [diass, horass, minutoss]
            }]
    });
    var win = new Ext.Window({
        title: 'Duraci&oacute;n de la actividad',
        // withSlider: true,
        //collapsible: true,
        //height:300,
        //width: 200,
        frame: true,
        layout: 'form',
        modal: true,
        items: [top],
        buttons: [btnCancelar, btnAceptar],
        listeners: {
            'close': function () {
            }
        }
    });
    return win;
}

/**
 * funcion dado dias, horas, minutos te devuelve un entero que significa dias:horas:minutos llevado a  minuto solamente
 * @param dias
 * @param horas
 * @param minutos
 * @returns {*}
 */
function calculoNumberField(dias, horas, minutos) {
//obtener lo que representa determinada cantidad de dias llevados a minutos
    var diasMin = parseInt(dias) * 24 * 60;
    //obtener lo que representa determinada cantidad de horas llevados a minutos
    var horasMin = parseInt(horas) * 60;
    // devolver numero final
    return parseInt(diasMin + horasMin + minutos);
}

function GuardarDuracion(record) {
    /*mensajeBox = Ext.MessageBox.show({
     title: 'Por favor espere...',
     msg: 'modificando la duraci&oacute;n de la actividad',
     width: 300,
     wait: true,
     progress: true,
     closable: false,
     animEl: 'mb6'
     });*/
    var recordsEnviar = [];
    // Ext.each(modified, function (record) {
    recordsEnviar.push(Ext.apply(record));
    //});
    Ext.Ajax.request({
        url: 'modificarActACarta',
        params: {
            idcartatecnologica: smGpCT.getSelected().data.idcartatecnologica,
            valores: Ext.encode(recordsEnviar)
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 24) {
                for (i = 0; i < recordsEnviar.length; i++) {
                    stActividadesCT.getById(recordsEnviar[i].idcartatecnologicaactividad).commit();
                }
                // mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente.', function () {
                //recargaNormal(CartstGpActividades);
                //})
                stActividadesCT.reload();
                //btnGuardarActividadCT.enable();
            } else {
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });
}

function controlarObjetosAct() {
    if (chkGlobal.getValue() == true) {
        btnAdicionarActividadCT.disable();
        cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('plazo'), false);
        cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('duracion'), false);
        cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('idetapa'), false);
        btnDuplicarActividadCT.disable();
        btnGuardarActividadCT.disable();
        btnEliminarActividadCT.disable();
        btnDiaCeroActividadCT.disable();
        btnImportarCT.disable();
    }
    if (chkGlobal.getValue() == false) {
        cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('duracion'), false);
        btnDuplicarActividadCT.disable();
        btnGuardarActividadCT.disable();
        btnEliminarActividadCT.disable();
        btnDiaCeroActividadCT.disable();
        if (smGpCT.getSelected() != undefined && smGpCT.getSelected().data.idaprobacion == 1) {
            btnImportarCT.enable();
            btnAdicionarActividadCT.enable();
            if (smActividadesCT.getSelections().length == 1) {
                if (smActividadesCT.getSelected().data.plazo == 0 && smActividadesCT.getSelected().data.diacero == 0 && smGpCT.getSelected().data.idaprobacion == 1) {
                    btnDiaCeroActividadCT.enable();
                }
            }
            if (smActividadesCT.getSelected() != undefined) {
                btnDuplicarActividadCT.enable();
                btnEliminarActividadCT.enable();
                cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('plazo'), true);
                cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('duracion'), true);
                cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('idetapa'), true);
                if (smActividadesCT.getSelections().length > 1) {
                    cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('plazo'), false);
                    cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('duracion'), false);
                }
            }
        }
        if (smGpCT.getSelected() != undefined && smGpCT.getSelected().data.idaprobacion != 1) {
            btnImportarCT.disable();
            btnAdicionarActividadCT.disable();
            btnDuplicarActividadCT.disable();
            btnGuardarActividadCT.disable();
            btnEliminarActividadCT.disable();
            cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('plazo'), false);
            cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('duracion'), false);
            cmActividadesCT.setEditable(cmActividadesCT.findColumnIndex('idetapa'), false);
        }

    }
    btnMostrarNorma.disable();
    if (smActividadesCT.getSelections().length == 1) {
        btnMostrarNorma.enable();
    }
}


function duplicarActividadesCarta() {
    Ext.MessageBox.prompt('Días', 'Introduzca el(los) plazo(s) de inicio para la(s) nueva(s) actividad(es), separados por coma (,):', function (btn, text) {
        if (btn == 'ok') {
            flag = false;
            array_dias = text.split(',');
            arraycorrectos = [];
            msg = '';
            for (i = 0; i < array_dias.length; i++) {
                if (isNaN(parseInt(array_dias[i]))) {
                    flag = true;
                } else {
                    arraycorrectos.push(parseInt(array_dias[i]));
                    msg = msg + parseInt(array_dias[i]) + ' ';
                }
            }
            if (flag)
                mostrarMensaje(2, 'Existen errores en los datos. Solo se duplicará la actividad para los plazos siguientes: ' + msg + '.', duplicarAct);
            else {
                mostrarMensaje(2, 'Se duplicará la actividad para los siguientes plazos: ' + text + '.', duplicarAct);
            }
        }
    });

    function duplicarAct(boton) {
        if (boton == 'ok') {
            var mensajeConf = Ext.MessageBox.show({
                title: 'Por favor espere...',
                msg: 'Duplicando las actividades',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6'
            });
            if (gpActividadesCT.getSelectionModel().getSelections().length == 0) {
                mostrarMensaje(1, perfil.etiquetas.lbMsgInfSeleccionarActividad);
            } else {
                var actividades_sel = [];
                for (i = 0; i < gpActividadesCT.getSelectionModel().getCount(); i++) {
                    actividades_sel.push(
                            gpActividadesCT.getSelectionModel().getSelections()[i].data
                            );
                }
                Ext.Ajax.request({
                    url: 'duplicarActACarta',
                    params: {
                        cartatecnologicaactividad: Ext.encode(actividades_sel),
                        idcartatecnologica: Ext.getCmp('gpCT').getSelectionModel().getSelected().data.idcartatecnologica,
                        dias: Ext.encode(arraycorrectos)
                    },
                    callback: function (options, success, response) {
                        mensajeConf.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 24) {
                            mostrarMensaje(1, perfil.etiquetas.msgDuplicarActividad);
                            stActividadesCT.reload();
                        } else {
                            mostrarMensaje(2, 'Se ha producido un error.');
                        }
                    }
                });
            }
        }
    }

}


