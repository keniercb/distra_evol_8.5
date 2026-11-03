Utilidades.Cmp.Cmpejecucion = function (opcionesConfig) {

    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.idtarea = 0;
    this.arrayEjecutadosAdicionados = [];
    this.arrayEjecutadosEliminados = [];
    this.permitirActualizarValorreal = false;

    this.crearWinEjecucion = function (idproyecto) {

        this.btnAdicionar = new Ext.Button({
            handler: function () {
                _this.addFilaEjecutar();
            },
            disabled: true,
            iconCls: 'adicionar',
            tooltip: 'Adicionar ejecución'
        });
        this.btnGuardar = new Ext.Button({
            handler: function () {
                _this.guardarDatos();
            },
            disabled: true,
            iconCls: 'guardar',
            tooltip: 'Guardar ejecución'
        });
        this.btnEliminar = new Ext.Button({
            handler: function () {
                _this.removeFilaEjecutar();
            },
            disabled: true,
            iconCls: 'eliminar',
            tooltip: 'Eliminar ejecución'
        });
        this.btnLimpiar = new Ext.Button({
            disabled: false,
            handler: function () {
                _this.ftTareas.clearFilters();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro(s)'
        });

        this.smTareas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (sm.hasSelection()) {
                        _this.idtarea = record.data.idelemento;
                        _this.TGEjecucion.expand(true);
                        _this.btnGuardar.disable();
                        _this.btnAdicionar.enable();
                        _this.btnEliminar.disable();
                        _this.stTGEjecucion.reload({
                            params: {
                                idtarea: record.data.idelemento
                            }
                        });
                    }

                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.TGEjecucion.toggleCollapse(false);
                    if (!sm.hasSelection()) {
                        _this.btnAdicionar.disable();
                        _this.btnGuardar.disable();
                    }
                },
                beforerowselect: function (sm, indiceFila, keep, record) {

                },
                selectionchange: function (sm) {
                }
            }
        });
        this.stTareas = new Ext.data.Store({
            autoLoad: true,
            //remoteSort: true,
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerTareasDadoProyecto',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                    st.baseParams.start = (_this.start == null) ? 0 : _this.start;
                },
                load: function (store, record, options) {
                    if (_this.gpTareas.getStore().getCount() == 0) {
                        if (_this.ftTareas.getFiltrosActivos() == undefined || _this.ftTareas.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con el criterio de búsqueda especificado.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                id: 'idelemento',
                totalProperty: "total",
                root: "campos"
            }, [{
                name: 'idelemento'
            }, {
                name: 'denominacion'
            }, {
                name: 'idautor'
            }, {
                name: 'unidadmedida'
            }, {
                name: 'valorreal'
            }, {
                name: 'valormeta'
            }, {
                name: 'costo'
            }, {
                name: 'costoplan'
            }, {
                name: 'costoreal'
            }])
        });

        this.ftTareas = new Ext.grid.GridFilters({
            filters: [{
                type: 'string_adaptado',
                dataIndex: 'idelemento',
                xtype: 'numberfield',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'unidadmedida'
            }, {
                type: 'numeric',
                dataIndex: 'valorreal'
            }, {
                type: 'numeric',
                dataIndex: 'valormeta'
            }, {
                type: 'numeric',
                dataIndex: 'costo'
            }, {
                type: 'numeric',
                dataIndex: 'costoplan'
            }, {
                type: 'numeric',
                dataIndex: 'costoreal'
            }]
        });

        this.pagTareas = new Ext.PagingToolbar({
            pageSize: 15,
            width: 810,
            store: _this.stTareas,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.start = evento.start;
                }
            }
        });

        this.gpTareas = new Ext.grid.GridPanel({
            //title: 'Tareas',
            sm: _this.smTareas,
            frame: true,
            iconCls: 'icon-grid',
            store: _this.stTareas,
            plugins: _this.ftTareas,
            autoExpandColumn: 'tareaspan',
            region: 'center',
            width: 800,
            height: 500,
            tbar: [_this.btnLimpiar],
            bbar: [_this.pagTareas],
            loadMask: {
                msg: 'Cargando tareas...'
            },
            columns: [
                _this.smTareas,
                {
                    header: "idelemento",
                    dataIndex: 'idelemento',
                    hidden: true
                }, {
                    header: "Tarea",
                    id: "tareaspan",
                    sortable: true,
                    dataIndex: 'denominacion',
                    tooltip: 'Tarea',
                    renderer: MostrarImagenTipoElemento
                }, {
                    header: "UM",
                    dataIndex: 'unidadmedida',
                    width: 45,
                    sortable: true,
                    align: 'center',
                    tooltip: 'Unidad de medida',
                    renderer: function (val) {
                        if (val)
                            return '<b>' + val + '</b>';
                        else
                            return '';
                    }
                }, {
                    header: "Valor Meta",
                    dataIndex: 'valormeta',
                    width: 90,
                    sortable: true,
                    align: 'right',
                    tooltip: 'Valor Meta',
                    renderer: function (val) {
                        if (val)
                            return '<b>' + val + '</b>';
                        else
                            return '<b>' + 0 + '</b>';
                    }
                }, {
                    header: "Valor Real",
                    dataIndex: 'valorreal',
                    width: 90,
                    sortable: true,
                    align: 'right',
                    tooltip: 'Valor Real',
                    renderer: function (val) {
                        if (val)
                            return '<b>' + val + '</b>';
                        else
                            return '<b>' + 0 + '</b>';
                    }
                }, {
                    header: "Costo",
                    dataIndex: 'costo',
                    width: 90,
                    sortable: true,
                    align: 'right',
                    tooltip: 'Costo',
                    renderer: function (val) {
                        if (val)
                            return '<b>' + val + '</b>';
                        else
                            return '<b>' + 0 + '</b>';
                    }
                }, {
                    header: "Costo Plan",
                    dataIndex: 'costoplan',
                    width: 90,
                    sortable: true,
                    align: 'right',
                    tooltip: 'Costo Plan',
                    renderer: function (val, b, r) {
                        val = r.data.valormeta * r.data.costo;
                        return '<b>' + val + '</b>';

                    }
                }, {
                    header: "Costo Real",
                    dataIndex: 'costoreal',
                    width: 90,
                    sortable: true,
                    align: 'right',
                    tooltip: 'Costo Total',
                    renderer: function (val, b, r) {
                        val = r.data.valorreal * r.data.costo;
                        return '<b>' + val + '</b>';
                    }
                }]
        });

        this.reader = new Ext.data.JsonReader({
            id: 'idrelacion',
            root: 'campos',
            totalProperty: 'total'
        }, [
            {
                name: 'idtarea'
            }, {
                name: 'fecha'
            }, {
                name: 'cantidad'
            }
        ]);

        this.stTGEjecucion = new Ext.data.Store({
            autoLoad: false,
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/realPorFechaEjecutado',
            reader: _this.reader,
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idtarea = _this.idtarea;
                    st.baseParams.start = (_this.start == null) ? 0 : _this.start;
                },
                load: function (store, record, options) {
                    _this.arrayEjecutadosAdicionados = [];
                    _this.arrayEjecutadosEliminados = [];
                    if (_this.permitirActualizarValorreal) {
                        _this.actualizarValorReal();
                    }
                }
            }
        });
        this.smTGEjecucion = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (sm.hasSelection()) {
                        _this.btnEliminar.enable();
                    }
                },
                rowdeselect: function (sm, indiceFila, record) {
                    if (!sm.hasSelection()) {
                        _this.btnEliminar.disable();
                    }
                }
            }
        });
        this.pagEjecucion = new Ext.PagingToolbar({
            pageSize: 15,
            width: 810,
            store: _this.stTGEjecucion,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.start = evento.start;
                }
            }
        });
        this.TGEjecucion = new Ext.grid.EditorGridPanel({
            title: 'Real por fecha ejecutado',
            store: _this.stTGEjecucion,
            region: 'south',
            stripeRows: true,
            border: false,
            collapsible: true,
            collapsed: true,
            height: 300,
            clicksToEdit: 1,
            sm: _this.smTGEjecucion,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando ejecución...'
            },
            listeners: {
                'beforeedit': function (e) {
                },
                'beforerender': function (e) {
                }
            },
            columns: [_this.smTGEjecucion,
                {
                    header: "Fecha",
                    width: 150,
                    dataIndex: 'fecha',
                    sortable: true,
                    renderer: formatDate,
                    align: 'left',
                    editor: new Ext.form.DateField({
                        format: 'd/m/Y',
                        allowBlank: false,
                        invalidText: 'Formato: d/m/a'
                    })
                }, {
                    header: "Cantidad",
                    dataIndex: 'cantidad',
                    width: 150,
                    sortable: true,
                    align: 'left',
                    editor: new Ext.form.NumberField({
                        value: 0,
                        //maxValue: 100,
                        //maxText: 'Solo admite n&uacute;meros menor que 100 ',
                        //minValue: 0,
                        //minText: 'Solo admite n&uacute;meros mayor que 0 '
                    })
                }
            ],
            tbar: [_this.btnAdicionar, '-', _this.btnGuardar, '-', _this.btnEliminar],
            bbar: _this.pagEjecucion
        });

        //****** FUNCIONES GENERALES *********

        //*** PANEL DETALLES *** *** *** **** ****
        this.pEjecucion = new Ext.Panel({
            layout: 'border',
            items: [_this.gpTareas, _this.TGEjecucion]
        });

        this.WinEjecucion = new Ext.Window({
            title: 'Ejecución',
            layout: 'fit',
            constrain: true,
            //tbar: [],
            closable: true,
            graggable: false,
            modal: true,
            width: 850,
            height: 550,
            //usarKeymap: true,
            //botonesKeymap: [_this.btnAyuda],
            items: _this.pEjecucion,
            listeners: {
                close: function () {
                }
            }
        });
        _this.WinEjecucion.doLayout();
        _this.WinEjecucion.show();
    };

    function MostrarImagenTipoElemento(valor, m, p) {
        return '<span class="icondistra-tarea sipac-azul">' + ' ' + valor + '</span>';
    }

    function formatDate(value) {
        if (Ext.isDate(value)) {
            return value.format('d/m/Y');
        } else {
            return value;
        }
    }

    this.addFilaEjecutar = function () {
        if (_this.smTareas.hasSelection()) {
            _this.btnGuardar.enable();
            var arrayrecords = _this.smTareas.getSelections();
            var date = new Date();
            var record = new Ext.data.Record({
                idtarea: arrayrecords[0].data.idelemento,
                fecha: date.format('d/m/Y'),
                cantidad: 0
            });
            _this.stTGEjecucion.add(record);
            _this.arrayEjecutadosAdicionados.push({
                idtarea: arrayrecords[0].data.idelemento,
                fecha: date.format('d/m/Y'),
                cantidad: 0
            });
        } else {
            var mensaje = 'Debe seleccionar una tarea.';
            mostrarMensaje(1, mensaje);
        }
    };
    this.removeFilaEjecutar = function () {
        _this.btnGuardar.enable();
        var arrayrecords = _this.smTGEjecucion.getSelections();
        for (var i = 0; i < arrayrecords.length; i++) {
            var record = arrayrecords[i];
            _this.arrayEjecutadosEliminados.push({
                idtarea: record.data.idtarea,
                fecha: Ext.isDate(record.data.fecha) ? record.data.fecha.format('d/m/Y') : record.data.fecha,
                cantidad: record.data.cantidad
            });
            _this.stTGEjecucion.remove(record);
        }
    };
    this.getArrayListadoEjecutados = function () {
        var array_ejecutados = [];
        for (var i = 0; i < _this.stTGEjecucion.getCount(); i++) {
            array_ejecutados.push({
                idtarea: _this.stTGEjecucion.getAt(i).data.idtarea,
                fecha: _this.stTGEjecucion.getAt(i).data.fecha,
                cantidad: _this.stTGEjecucion.getAt(i).data.cantidad
            });
        }
        return array_ejecutados;
    };
    this.getArrayListadoEjecutadosModificados = function () {
        var records = _this.stTGEjecucion.getModifiedRecords();

        for (var i = 0; i < records.length; i++) {
            var eliminado = false;
            for (var j = 0; j < _this.arrayEjecutadosEliminados.length; j++) {
                if (records[i].data.idtarea == _this.arrayEjecutadosEliminados[j].idtarea &&
                    (Ext.isDate(records[i].data.fecha) ? records[i].data.fecha.format('d/m/Y') : records[i].data.fecha) == _this.arrayEjecutadosEliminados[j].fecha)
                    eliminado = true;
                break;
            }
            if (!eliminado) {
                _this.arrayEjecutadosAdicionados.push({
                    idtarea: records[i].data.idtarea,
                    fecha: Ext.isDate(records[i].data.fecha) ? records[i].data.fecha.format('d/m/Y') : records[i].data.fecha,
                    cantidad: records[i].data.cantidad
                });
            }
        }
        //console.log(_this.arrayEjecutadosAdicionados);
        return _this.arrayEjecutadosAdicionados;
    };
    this.guardarDatos = function () {
        _this.BarraProgreso.show();
        _this.arrayEjecutadosAdicionados = _this.getArrayListadoEjecutadosModificados();

        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/guardarEjecutados',
            params: {
                arrayEjecutadosAdicionados: Ext.encode(_this.arrayEjecutadosAdicionados),
                arrayEjecutadosEliminados: Ext.encode(_this.arrayEjecutadosEliminados)
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.permitirActualizarValorreal = true;
                    var mensajeconfirmacion = 'El(Los) valor(es) ha(n) sido guardado(s) satisfactoriamente.';
                    mostrarMensaje(1, mensajeconfirmacion);
                    _this.stTGEjecucion.removeAll();
                    _this.stTGEjecucion.reload({
                        params: {
                            idtarea: _this.idtarea
                        }
                    });
                } else {
                    var mensajeconfirmacion = 'El(Los) valor(es) no se ha(n) podido guardar.';
                    mostrarMensaje(1, mensajeconfirmacion);
                }
                _this.arrayEjecutadosAdicionados = [];
                _this.arrayEjecutadosEliminados = [];
            }
        });
    };

    this.actualizarValorReal = function () {
        var valor_real = 0;
        for (var i = 0; i < _this.stTGEjecucion.getCount(); i++) {
            valor_real = parseFloat(_this.stTGEjecucion.getAt(i).data.cantidad) + parseFloat(valor_real);
        }
        var arrayrecords = _this.smTareas.getSelections();
        var record = arrayrecords[0];
        record.set("valorreal", valor_real);
        record.commit();

        var costo_real = record.data.valorreal * record.data.costo;
        record.set("costoreal", valor_real);
        record.commit();

        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/eliminarEjecutados',
            params: {
                idtarea: record.data.idelemento,
                valorreal: valor_real
            },
            callback: function (options, success, response) {
                //_this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.permitirActualizarValorreal = false;
                } else {
                }
            }
        });

    };

};