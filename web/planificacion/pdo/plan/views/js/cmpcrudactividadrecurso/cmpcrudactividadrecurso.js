Utilidades.Cmp.Cmpcrudactividadrecurso = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    var pgactual = 0;
    var pgactual2 = 0;
    var arrayidrecursosdesasoc = [], arrayidrecursosasociados = [];
    var contasociados = 0, contdesasociados = 0;

    /** Crud donde se muestran los recursos para asociarlas con las actividades*/
    this.dosgrids = function (accion, idactividad, decalendario, estamodificando, recursosDisable, proyecto) {
        /*store del primer grid*/
        this.filtrosfirstgrid = new Ext.grid.GridFilters({
            filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }]
        });
        this.stRecursoSinAsociar = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarrecursossinasociar',
            autoLoad: true,
            listeners: {
                beforeload: function (st) {
                    st.baseParams.start = pgactual;
                    st.baseParams.limit = _this.cbpaginadoRecursoSinAsociar.getValue();
                    if (accion == 'Modificar' || accion == 'Ver datos de la' || accion == 'Relacionar elementos a la' || accion == 'Control de reasignaciones de la') {
                        st.baseParams.estamodificando = estamodificando;
                        st.baseParams.idactividad = idactividad;
                    } else {
                        st.baseParams.estamodificando = 0;
                    }
                },
                load: function (st, records, options) {
                    arrayidrecursosdesasoc = [];
                    contdesasociados = 0;
                    for (i = 0; i < records.length; i++) {
                        if (records[i].data.idcategoria) {
                            arrayidrecursosdesasoc[contdesasociados] = records[i].data.idcategoria;
                            contdesasociados++;
                        }
                    }
                    if (st.getCount() == 0) {
                        if (_this.filtrosfirstgrid.getFiltrosActivos() == undefined || _this.filtrosfirstgrid.getFiltrosActivos().length == 0) {
                            // mostrarMensaje(1, 'No existen datos que mostrar.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacutesqueda especificados.');
                        }
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "data",
                id: "idcategoria",
                totalProperty: 'total'
            }, [{
                name: 'idcategoria'
            }, {
                name: 'denominacion'
            }, {
                name: 'um'
            }, {
                name: 'cantidad'
            }, {
                name: 'indicador'
            }])
        });

        this.filtrossecondgrid = new Ext.grid.GridFilters({
            filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }]
        });
        //store de los recursos asociados
        this.stRecursoAsocidos = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/cargarrecursosasociados',
            autoLoad: true,
            listeners: {
                beforeload: function (st) {
                    st.baseParams.start = pgactual2;
                    st.baseParams.limit = _this.cbpaginadoRecursosAsociados.getValue();
                    if (accion == 'Modificar' || accion == 'Ver datos de la' || accion == 'Relacionar elementos a la' || accion == 'Control de reasignaciones de la') {
                        st.baseParams.estamodificando = estamodificando;
                        st.baseParams.idactividad = idactividad;
                    } else {
                        st.baseParams.estamodificando = 0;
                    }
                },
                load: function (st, records, options) {
                    arrayidrecursosasociados = [];
                    contasociados = 0;
                    for (i = 0; i < records.length; i++) {
                        if (records[i].data.idcategoria) {
                            arrayidrecursosasociados[contasociados] = records[i].data.idcategoria;
                            contasociados++;
                        }
                    }
                    if (st.getCount() == 0) {
                        if (_this.filtrosfirstgrid.getFiltrosActivos() == undefined || _this.filtrosfirstgrid.getFiltrosActivos().length == 0) {
                            //  mostrarMensaje(1, 'No existen datos que mostrar.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacutesqueda especificados.');
                        }
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "data",
                id: "idcategoria",
                totalProperty: 'total'
            }, [{
                name: 'idcategoria'
            }, {
                name: 'denominacion'
            }, {
                name: 'um'
            }, {
                name: 'cantidad'
            }, {
                name: 'indicador'
            }])
        });
        //fin del store

        this.stcbpaginadoRecursoSinAsociar = new Ext.data.SimpleStore({
            fields: ['idnumpag', 'dennumpag'],
            data: [
                [10, '10'],
                [20, '20'],
                [40, '40'],
                [80, '80'],
                [100, '100'],
                [200, '200'],
                [500, '500'],
                [1000, '1000']
            ]
        });

        //combo del modo donde muestro la cantidad de elementos por paginas del grid
        this.cbpaginadoRecursoSinAsociar = new Ext.form.ComboBox({
            value: 80,
            store: _this.stcbpaginadoRecursoSinAsociar,
            displayField: 'dennumpag',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idnumpag',
            valueField: 'idnumpag',
            width: 35,
            emptyText: 'Seleccionar',
            listeners: {
                select: function (cb, record, index) {
                    _this.paginadoRecursoSinAsociar.pageSize = _this.cbpaginadoRecursoSinAsociar.getValue();
                    _this.stcbpaginadoRecursoSinAsociar.removeAll();
                    _this.stcbpaginadoRecursoSinAsociar.load();
                }
            }
        });

        this.paginadoRecursoSinAsociar = new Ext.PagingToolbar({
            id: "paginadoCalendar",
            pageSize: _this.cbpaginadoRecursoSinAsociar.getValue(),
            store: _this.stRecursoSinAsociar,
            displayInfo: true,
            //width: 365,
            listeners: {
                beforechange: function (p, e) {
                    //if (e.activePage)
                    pgactual = e.start;//(e.activePage - 1) * (_this.cbpaginadoLoad.getValue());
                    // pgultima = (e.pages - 1) * (_this.cbpaginadoLoad.getValue());
                }
            }
        });

        this.stcbpaginadoRecursosAsociados = new Ext.data.SimpleStore({
            fields: ['idnumpag', 'dennumpag'],
            data: [
                [10, '10'],
                [20, '20'],
                [40, '40'],
                [80, '80'],
                [100, '100'],
                [200, '200'],
                [500, '500'],
                [1000, '1000']
            ]
        });

        //combo del modo donde muestro la cantidad de elementos por paginas del grid
        this.cbpaginadoRecursosAsociados = new Ext.form.ComboBox({
            value: 80,
            store: _this.stcbpaginadoRecursosAsociados,
            displayField: 'dennumpag',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idnumpag',
            valueField: 'idnumpag',
            width: 35,
            emptyText: 'Seleccionar',
            listeners: {
                select: function (cb, record, index) {
                    _this.paginadoRecursosAsociados.pageSize = _this.cbpaginadoRecursosAsociados.getValue();
                    _this.stcbpaginadoRecursosAsociados.removeAll();
                    _this.stcbpaginadoRecursosAsociados.load();
                }
            }
        });

        this.paginadoRecursosAsociados = new Ext.PagingToolbar({
            id: "paginadoCalendar",
            pageSize: _this.cbpaginadoRecursosAsociados.getValue(),
            store: _this.stRecursoAsocidos,
            displayInfo: true,
            width: 365,
            listeners: {
                beforechange: function (p, e) {
                    //if (e.activePage)
                    pgactual2 = e.start;//(e.activePage - 1) * (_this.cbpaginadoLoad.getValue());
                    // pgultima = (e.pages - 1) * (_this.cbpaginadoLoad.getValue());
                }
            }
        });

        //selection model
        this.smGRecursosAsociados = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function () {
                    if (_this.smGRecursosAsociados.hasSelection()) {
                        _this.btnDesAsociarEstado.enable();
                    } else {
                        _this.btnDesAsociarEstado.disable();
                    }
                },
                rowselect: function () {
                    //   ActualizarBotonesDesAsociar();
                },
                rowdeselect: function () {
                    // ActualizarBotonesDesAsociar();
                }
            }
        });
        this.smGRecursossinAsociar = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function () {
                    if (_this.smGRecursossinAsociar.hasSelection()) {
                        _this.btnAsociarEstado.enable();
                    } else {
                        _this.btnAsociarEstado.disable();
                    }
                },
                rowdeselect: function () {
                    // ActualizarBotonesDesAsociar();
                },
                rowdeselect: function () {
                    // ActualizarBotonesDesAsociar();
                }
            }
        });
        //filtros

        // declare the source Grid
        this.firstGrid = new Ext.grid.GridPanel({
            store: _this.stRecursoSinAsociar,
            plugins: _this.filtrosfirstgrid,
            sm: _this.smGRecursossinAsociar,
            frame: true,
            width: 480,
            margins: '2 2 2 -4',
            region: 'west',
            //ddText : "{0} recurso{1} seleccionado{1}",
            //ddGroup          : 'secondGridDDGroup',
            //stripeRows       : true,
            //selType: 'checkboxmodel',
            // autoExpandColumn : 'name',
            //enableDragDrop   : true,
            //height:600,
            columns: [_this.smGRecursossinAsociar,
                {
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }, {
                    header: "UM",
                    dataIndex: 'um',
                    width: 80,
                    tooltip: 'Unidad de medida',
                    sortable: true
                }],
            title: 'Recursos sin asociar',
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: 'Cargando datos...'
            },
            tbar: ['-', {
                iconCls: 'actualizar',
                tooltip: 'Actualizar listado de recursos',
                handler: function () {
                    _this.stRecursoSinAsociar.reload();
                }
            }, {
                iconCls: 'limpiar',
                tooltip: 'Limpiar filtro(s)',
                handler: function () {
                    _this.filtrosfirstgrid.clearFilters();
                }
            }]
            , bbar: _this.paginadoRecursoSinAsociar
        });

        // create the destination Grid
        this.secondGrid = new Ext.grid.EditorGridPanel({
            sm: _this.smGRecursosAsociados,
            store: _this.stRecursoAsocidos,
            plugins: _this.filtrossecondgrid,
            width: 300,
            region: 'east',
            margins: '2 2 2 -4',
            frame: true,
            title: 'Recursos asociados',
            //enableDragDrop   : true,
            //stripeRows       : true,
            //ddGroup          : 'firstGridDDGroup',
            //ddText : "{0} recursos seleccionados{1}",
            //  cm:colModel,
            //height:600,
            columns: [_this.smGRecursosAsociados,
                {
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir',
                    renderer: mostrarTooltip
                }, {
                    header: "UM",
                    dataIndex: 'um',
                    //width: 80,
                    width: 40,
                    tooltip: 'Unidad de medida',
                    sortable: true
                }, {
                    header: "Cantidad",
                    dataIndex: 'cantidad',
                    //width: 70,
                    width: 60,
                    tooltip: 'Cantidad',
                    sortable: true,
                    renderer: valorPorDefecto,
                    editor: new Ext.form.NumberField({
                        allowBlank: false
                    })
                }],
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: 'Cargando datos...'
            },
        });
        this.btnAsociarEstado = new Ext.Button({
            tooltip: 'Asociar recurso(s)',
            disabled: true,
            iconCls: 'siguiente',
            handler: function () {
                _this.asociarRecurso();
            }
        });
        this.btnDesAsociarEstado = new Ext.Button({
            tooltip: 'Desasociar recurso(s)',
            disabled: true,
            iconCls: 'anterior',
            handler: function () {
                _this.desasociarRecurso();
            }
        });

        //funcion para mostrar el icono "accion"
        function mostrarTooltip(valor, m) {
            m.attr = 'ext:qtip="<b>' + valor + '</b>"';
            valor = '<span class="icondistra-recursos sipac-azul">' + ' ' + valor + '</span>';
            return valor;
        }

        //funcion para mostrar el valor de la cantidad por defecto
        function valorPorDefecto(valor) {
            if (valor) {
                return valor;
            } else {
                return 1;
            }
        }


        this.pasociar = new Ext.Panel({
            region: 'center',
            disabled: (recursosDisable == undefined) ? false : recursosDisable,
            //bodyStyle: 'padding:150px 15px',
            bodyStyle: 'padding:190px 5px',
            bodyCfg: {
                tag: 'center',
                cls: 'x-panel-body'
            },
            items: [_this.btnAsociarEstado, _this.btnDesAsociarEstado]
            //  items:[GUsuariosSinAsociar]
        });

        //Simple 'border layout' panel to house both grids
        if (decalendario) {
            this.displayPanel = new Ext.Panel({
                width: 650,
                frame: (proyecto == 1) ? true : false,
                layout: 'border',
                items: [_this.firstGrid, _this.pasociar, _this.secondGrid]
            });
        } else {
            this.displayPanel = new Ext.Panel({
                width: 650,
                layout: 'border',
                renderTo: Ext.getBody(),
                items: [_this.firstGrid, _this.pasociar, _this.secondGrid]
            });
        }

        this.eliminar = function (id, array) {
            var arreglonuevo = [];
            var cont = 0;
            for (var i = 0; i < array.length; i++) {
                if (array[i] != id) {
                    arreglonuevo[cont] = array[i]
                }
            }
            return arreglonuevo;
        };
        return _this.displayPanel;
    };

    this.asociarRecurso = function () {
        if (_this.smGRecursossinAsociar.hasSelection()) {
            var arrayusuariosparadesasociar = _this.smGRecursossinAsociar.getSelections();
            if (arrayusuariosparadesasociar.length > 0) {
                for (var i = 0; i < arrayusuariosparadesasociar.length; i++) {
                    _this.stRecursoAsocidos.add(arrayusuariosparadesasociar[i]);
                    arrayidrecursosasociados[arrayidrecursosasociados.length] = arrayusuariosparadesasociar[i].data.idcategoria;
                    arrayidrecursosdesasoc = _this.eliminar(arrayusuariosparadesasociar[i].data.idcategoria, arrayidrecursosdesasoc);

                    _this.stRecursoSinAsociar.remove(arrayusuariosparadesasociar[i]);
                }
            }
        }
    };
    this.desasociarRecurso = function () {
        if (_this.smGRecursosAsociados.hasSelection()) {
            var arrayusuariosparadesasociar = _this.smGRecursosAsociados.getSelections();
            if (arrayusuariosparadesasociar.length > 0) {
                for (var i = 0; i < arrayusuariosparadesasociar.length; i++) {
                    _this.stRecursoSinAsociar.add(arrayusuariosparadesasociar[i]);
                    arrayidrecursosdesasoc[arrayidrecursosdesasoc.length] = arrayusuariosparadesasociar[i].data.idcategoria;
                    arrayidrecursosasociados = _this.eliminar(arrayusuariosparadesasociar[i].data.idcategoria, arrayidrecursosasociados);
                    _this.stRecursoAsocidos.remove(arrayusuariosparadesasociar[i]);
                }

            }

        }
    };

    this.retornarasociados = function () {
        return arrayidrecursosasociados;
    };

    this.retornardesasociados = function () {
        return arrayidrecursosdesasoc;
    };

    this.botonAplicar = function () {
        _this.stRecursoSinAsociar.reload();
        _this.stRecursoAsocidos.reload();
        /*_this.objclasificadorinvol.stGInvolucrados.reload({
            params: {
                idelemento: arrayidelementos[0].id,
                idtipoelemento: 9
            }
        });*/
    };


};
































































































