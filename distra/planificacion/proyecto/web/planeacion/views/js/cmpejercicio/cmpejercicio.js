Utilidades.Cmp.Cmpejercicio = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    //variables
    this.start = 0;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "gestionar estructura"
    this.objestructura = new Utilidades.Cmp.Cmpgestionarestructura();

    //objeto crud-ejercicio inicializado
    this.objCrudejercicio = new Utilidades.Cmp.Cmpcrudejercicio(opcionesConfig);

    //selection model del grid panel de los ejercicios
    this.smEjercicio = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                _this.actualizarBarraHerramientas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                _this.actualizarBarraHerramientas();
            }
        }
    });

    //column model del grid panel de los ejercicios
    this.cmEjercicio = new Ext.grid.ColumnModel([
        _this.smEjercicio,
        {
            header: "Denominación",
            sortable: true,
            dataIndex: 'denominacion',
            id: 'ejeospan',
            tooltip: 'Denominación',
            renderer: mostrarTooltip
        },
        {
            header: "Descripción",
            sortable: true,
            dataIndex: 'descripcion',
            tooltip: 'Descripción',
            renderer: mostrarTooltip
        }, {
            header: "Duración estimada",
            sortable: true,
            dataIndex: 'duracionest',
            tooltip: 'Duración estimada',
            renderer: mostrarDuracionEstimada
        }, {
            header: "Tiempo real",
            sortable: true,
            dataIndex: 'tiempo',
            tooltip: 'Tiempo real',
            renderer: mostrarTooltip
        }, {
            header: "Estado",
            sortable: true,
            dataIndex: 'estado',
            tooltip: 'Estado',
            renderer: mostrarEstado
        }, {
            header: "Fecha",
            sortable: true,
            dataIndex: 'fecha',
            tooltip: 'Fecha',
            renderer: mostrarTooltip
        }, {
            header: "Autor",
            sortable: true,
            dataIndex: 'autor',
            tooltip: 'Autor',
            renderer: mostrarTooltip
        }
    ]);

    //store del grid panel de los ejercicios
    this.stEjercicio = new Ext.data.Store({
        url: '/planificacion/proyecto/planeacion/index.php/cmpejercicio/listarEjercicios',
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando...');
                s.baseParams.idEstructura = _this.objestructura.idEstructura;
                s.baseParams.start = _this.start;
            },
            load: function (st) {
                _this.BarraProgreso.hide();
                if (st.getCount() == 0) {
                    if (_this.ftEjercicio.getFiltrosActivos() == undefined || _this.ftEjercicio.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');


                    }
                }
                if (_this.ftEjercicio.getFiltrosActivos() == undefined || _this.ftEjercicio.getFiltrosActivos().length == 0) {
                    _this.btnLimpiar.disable();
                }
                else {
                    _this.btnLimpiar.enable();
                }
                _this.actualizarBarraHerramientas();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [{
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }, {
            name: 'duracionest'
        }, {
            name: 'tiempo'
        }, {
            name: 'estado'
        }, {
            name: 'fecha'
        }, {
            name: 'autor'
        }, {
            name: 'idejercicio'
        }
        ])
    });

    //barra de paginado del del grid panel de los ejercicios
    this.pagEjercicio = new Ext.PagingToolbar({
        pageSize: 15,
        store: _this.stEjercicio,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });

    //plugins para los filtros del grid panel de los ejercicios
    this.ftEjercicio = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'numeric',
                dataIndex: 'tiempo'
            }, {
                type: 'list',
                dataIndex: 'estado',
                multiple: true,
                options: [[1, 'Creado'], [2, 'En ejecución'], [3, 'Concluido']]
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }]
    });


    //grid panel de los ejercicios
    this.gdEjercicio = new Ext.grid.GridPanel({
        frame: true,
        iconCls: 'icon-grid',
        store: _this.stEjercicio,
        sm: _this.smEjercicio,
        cm: _this.cmEjercicio,
        bbar: _this.pagEjercicio,
        plugins: _this.ftEjercicio,
        loadMask: {
            msg: 'Cargando Registros...'
        }
    });

    //panel de los ejercicios
    this.pEjercicio = new Ext.Panel({
        title: '/Registro de ejercicios',
        id: 'Ejercicios',
        layout: 'fit',
        region: 'center',
        items: [_this.gdEjercicio]
    });

    //actualizando barra de herramientas
    this.actualizarBarraHerramientas = function () {
        _this.btnAdicionar.disable();
        _this.btnModificar.disable();
        _this.btnEliminar.disable();
        _this.btnCalcular.disable();
        _this.btnPert.disable();

        if (_this.objestructura.idEstructura != ''
            && _this.objestructura.idEstructura != null
            && _this.objestructura.idEstructura != 'nodo2') {
            _this.btnAdicionar.enable();

        }

        if (_this.smEjercicio.hasSelection()) {
            var arrayrecords = _this.smEjercicio.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords == 1) {
                _this.btnModificar.enable();
                _this.btnEliminar.enable();
                _this.btnCalcular.enable();
                _this.btnPert.enable();
                _this.btnModificar.enable();
            }
            if (totalrecords > 0) {
                _this.btnEliminar.enable();
            }
        }
    };

    //crando arbol de estructuras
    this.tpEstructuras = _this.objestructura.CrearArbolEstructura(_this.stEjercicio, _this.smEjercicio, _this.gdEjercicio, _this.actualizarBarraHerramientas);

    //panel de las estructuras
    this.pEstructura = new Ext.Panel({
        title: 'Estructuras',
        id: 'Estructura',
        layout: 'fit',
        collapsible: true,
        collapsed: false,
        width: 280,
        region: 'west',
        items: [_this.tpEstructuras]
    });


    //botones para acciones sobre ejercicios
    this.btnAdicionar = new Ext.Button({
        handler: function () {
            _this.objCrudejercicio.CrearWinCrudejercicio('Adicionar', _this.objestructura.idEstructura, _this.PostAccionesGestionar, null, null, null);
        },
        disabled: true,
        iconCls: 'adicionar',
        tooltip: 'Adicionar ejercicio',
        key: {
            alt: true,
            key: 'I'
        }
    });


    this.btnModificar = new Ext.Button({
        handler: function () {
            _this.objCrudejercicio.CrearWinCrudejercicio('Modificar', _this.objestructura.idEstructura, _this.PostAccionesGestionar,
                _this.smEjercicio.getSelected().data.idejercicio, _this.smEjercicio.getSelected().data.denominacion, _this.smEjercicio.getSelected().data.descripcion);
        },
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar ejercicio',
        key: {
            alt: true,
            key: 'M'
        }
    });
    this.btnEliminar = new Ext.Button({
        handler: function () {
            _this.EliminarEjercicio();
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar ejercicio',
        key: {
            key: Ext.EventObject.DELETE
        }
    });
    this.btnCalcular = new Ext.Button({
        handler: function () {
            var datos = _this.smEjercicio.getSelections()[0].data;
            _this.ObjCalculo = new Utilidades.Cmp.Cmpcalculotarea({
                maxWinPrincipal: false,
                nombrePanel: 'Cronometrar Ejercicio: ',
                useRemoto: true,
                proyectoSelect: _this.smEjercicio.getSelections()[0].data
            });
            _this.ObjCalculo.InicializarCalculoEjercicio()
        },
        disabled: true,
        iconCls: 'calcular',
        tooltip: 'Calcular tiempo'

    });
    this.btnPert = new Ext.Button({
        handler: function () {
        },
        disabled: true,
        hidden: true,
        iconCls: 'graficar',
        tooltip: 'Generar Pert',
        key: {
            alt: true,
            ctrl: true,
            key: 'M'
        }
    });

    //boton para limpiar filtros
    this.btnLimpiar = new Ext.Button({
        handler: function () {
            _this.stEjercicio.reload({
                params: {
                    idEstructura: _this.objestructura.idEstructura
                }
            });
        },
        disabled: true,
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        }
    });

    //boton para la ayuda
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaEjercicio',
        text: 'Ayuda',
        iconCls: 'ayuda',
        hidden: false,
        tooltip: 'Mostrar ayuda de la funcionalidad'
    });

    //panel general
    this.pGeneral = new Ext.Panel({
        layout: 'border',
        items: [_this.pEstructura, _this.pEjercicio],
        tbar: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnCalcular, _this.btnPert, _this.btnLimpiar, '->', _this.btnAyuda],
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnPert, _this.btnLimpiar]
    });

    //ventana principal de la vista
    this.WinPrincipalEjercicio = new Ext.Window({
        layout: 'fit',
        maximized: opcionesConfig.maxWinPrincipal,
        closable: !opcionesConfig.noUsarCerrarWinP,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.pGeneral]
    });

    this.EliminarEjercicio = function () {
        var mensaje = '', mensajemascara = '';
        if (_this.smEjercicio.getSelections().length > 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar los ejercicios seleccionados?';
            mensajemascara = 'Eliminando ejercicios...';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar el ejercicio seleccionado?';
            mensajemascara = 'Eliminando ejercicio...';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                if (_this.smEjercicio.hasSelection()) {
                    var arrayidejercicios = [];
                    var arrayrecords = _this.smEjercicio.getSelections();
                    var totalrecords = arrayrecords.length;
                    if (totalrecords > 0) {

                        for (var i = 0; i < totalrecords; i++) {
                            arrayidejercicios[i] = arrayrecords[i].data.idejercicio;
                        }
                    }
                }
                Ext.Ajax.request({
                    url: '/planificacion/proyecto/planeacion/index.php/cmpejercicio/eliminarEjercicio',
                    params: {
                        arrayidejercicios: Ext.encode(arrayidejercicios)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            var mensajeconfirmacion = '';
                            if (arrayidejercicios.length > 1)
                                mensajeconfirmacion = 'Los ejercicios han sido eliminados satisfactoriamente.';
                            else
                                mensajeconfirmacion = 'El ejercicio ha sido eliminado satisfactoriamente.';

                            mostrarMensaje(1, mensajeconfirmacion);
                            _this.stEjercicio.reload({
                                params: {
                                    idEstructura: _this.objestructura.idEstructura
                                }
                            });
                            _this.actualizarBarraHerramientas();
                        }
                    }
                });
            } else {
                if (_this.smEjercicio.hasSelection()) {
                    _this.smEjercicio.clearSelections();
                }
            }
        });
    };

    this.PostAccionesGestionar = function () {
        _this.smEjercicio.clearSelections();
        _this.actualizarBarraHerramientas();
        _this.stEjercicio.reload({
            params: {
                idEstructura: _this.objestructura.idEstructura
            }
        });
    };

    //toolTips
    function mostrarTooltip(v, m) {
        m.attr = 'ext:qtip="' + v + '"';
        return v;
    }

    function mostrarDuracionEstimada(equivalenciaMinutos, m) {
        var tiempo = '';
        var restoDias = equivalenciaMinutos % (1440);
        var equivalenciaDias = equivalenciaMinutos / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);
        _this.equivalenciaDuracion = {
            equivalenciaDias: (parseInt(equivalenciaDias) != 0) ? parseInt(equivalenciaDias) : 0,
            equivalenciaHoras: (parseInt(equivalenciaHoras) != 0) ? parseInt(equivalenciaHoras) : 0,
            restoMinutos: (restoMinutos != 0) ? restoMinutos : 0
        };
        if (equivalenciaMinutos >= 60) {
            if (_this.equivalenciaDuracion.equivalenciaDias != 0)
                tiempo = parseInt(_this.equivalenciaDuracion.equivalenciaDias) + ' dias';
            else
                tiempo = '';
            if (_this.equivalenciaDuracion.equivalenciaHoras != 0)
                tiempo += ' ' + parseInt(_this.equivalenciaDuracion.equivalenciaHoras) + ' horas';
            else
                tiempo += '';
            if (_this.equivalenciaDuracion.restoMinutos != 0)
                tiempo += ' ' + Math.round(_this.equivalenciaDuracion.restoMinutos) + ' min';
            else
                tiempo += '';
        } else {
            tiempo = Math.round(equivalenciaMinutos) + ' min';
        }
        m.attr = 'ext:qtip="' + tiempo + '"';
        return tiempo;
    }

    function mostrarEstado(v, m) {
        if (v == 1)
            var temp = "Creado";
        if (v == 2)
            var temp = "En ejecución";
        if (v == 3)
            var temp = "Concluido";

        m.attr = 'ext:qtip="' + temp + '"';
        return temp;
    }

    //inicializando el componente
    this.InicializarEjercicio = function () {
        _this.WinPrincipalEjercicio.show();
    };
};



