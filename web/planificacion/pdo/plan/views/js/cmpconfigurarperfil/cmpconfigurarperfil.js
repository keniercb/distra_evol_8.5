Utilidades.Cmp.Cmpconfigurarperfil = function (opciones) {
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    var pgactual = 0;
    var ocultarBotonSeleccionar = true;
    this.url = '/planificacion/pdo/configuracion/index.php/cmpconfigurarperfil/';

    this.objCrudCargaPorDefecto = new Utilidades.Cmp.Cmpcrudcargapordefecto();

    //******* comienza el panel para configurar cargas por defecto ************
    this.btnAdicionarLoad = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto('Adicionar', 2, _this.PostAccionesGestionar, null);
            _this.btnAdicionarLoad.focus();
        },
        id: 'btnAdicionarLoad',
        prevTab: 'btnSeleccionarLoad',
        nextTab: 'btnModificarLoad',
        disabled: false,
        selectOnFocus: true,
        iconCls: 'adicionar',
        tooltip: 'Adicionar configuraci&oacute;n de cargas por defectos',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificarLoad = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto('Modificar', 2, _this.PostAccionesGestionar, _this.smCargasPorDefecto);
        },
        disabled: true,
        prevTab: 'btnAdicionarLoad',
        nextTab: 'btnEliminarLoad',
        iconCls: 'modificar',
        tooltip: 'Modificar configuraci&oacute;n de cargas por defectos',
        id: 'btnModificarLoad',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminarLoad = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.eliminarCargaxDefecto(_this.smCargasPorDefecto.getSelections(), _this.PostAccionesGestionar);
        },
        disabled: true,
        id: 'btnEliminarLoad',
        prevTab: 'btnModificarLoad',
        nextTab: 'btnActualLoad',
        iconCls: 'eliminar',
        tooltip: 'Eliminar configuraci&oacute;n de cargas por defectos',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    this.btnActualLoad = new Ext.Button({
        handler: function () {
            _this.definirActual(2);
        },
        disabled: true,
        id: 'btnActualLoad',
        prevTab: 'btnEliminarLoad',
        nextTab: 'btnLimpiarLoad',
        iconCls: 'actual',
        tooltip: 'Definir configuración actual'
    });

    this.btnLimpiarLoad = new Ext.Button({
        text: '',
        disabled: true,
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        prevTab: 'btnActualLoad',
        nextTab: 'btnCerrarLoad',
        id: 'btnLimpiarLoad',
        handler: function () {
            _this.filtroLoad.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.filtroLoad = new Ext.grid.GridFilters({
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
            dataIndex: 'descripcion'
        }, {
            type: 'date',
            dataIndex: 'fechacreacion'
        }, {
            type: 'numeric',
            dataIndex: 'gradocumplimiento'
        }, {
            type: 'listado',
            dataIndex: 'nombreestadoaprob',
            idcombo: 'idcbftestado',
            urlcb: _this.url + 'cargarcmbestados',
            idstore: 'idstespecialidad',
            valueFieldcb: 'idestado',
            displayFieldcb: 'denominacion'
        }, {
            type: 'list',
            dataIndex: 'actual',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'fip',
            options: ['Activo']
        }, {
            type: 'list',
            dataIndex: 'actividad',
            options: ['Activo']
        }, {
            type: 'list',
            dataIndex: 'plan',
            options: ['Activo']
        }, {
            type: 'list',
            dataIndex: 'objetivo',
            options: ['Activo']
        }]
    });
    this.stCargasPorDefecto = new Ext.data.Store({
        url: _this.url + 'listarCargasxDefecto',
        reader: new Ext.data.JsonReader(
            {
                id: 'id',
                root: 'data',
                totalProperty: 'total'
            },
            [{
                name: 'denominacion'
            }, {
                name: 'objetivo'
            }, {
                name: 'plan'
            }, {
                name: 'actividad'
            }, {
                name: 'fip'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'actual'
            }, {
                name: 'descripcion'
            }, {
                name: 'idconfiguracionperfil'
            }, {
                name: 'igual'
            }, {
                name: 'mayor'
            }, {
                name: 'menor'
            }]
        ),
        listeners: {
            beforeload: function (s) {
                s.baseParams.start = pgactual;
            },
            load: function (st) {
                _this.gdCargasPorDefecto.getColumnModel().setColumnHeader(0, '');
                _this.gdCargasPorDefecto.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                _this.BarraProgreso.hide();
                if (_this.smCargasPorDefecto.getSelected() == undefined) {
                    _this.btnModificarLoad.disable();
                    _this.btnActualLoad.disable();
                    _this.btnEliminarLoad.disable();
                }
                if (st.getCount() == 0) {
                    if (pgactual != 0) {
                        pgactual = 0;
                        st.reload();
                    } else {
                        if (_this.filtroLoad.getFiltrosActivos() == undefined || _this.filtroLoad.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                            _this.btnLimpiarLoad.disable();
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            _this.btnLimpiarLoad.enable();
                        }
                    }
                    _this.btnModificarLoad.disable();
                    _this.btnActualLoad.disable();
                    _this.btnEliminarLoad.disable();
                } else {
                    if (_this.filtroLoad.getFiltrosActivos() == undefined || _this.filtroLoad.getFiltrosActivos().length == 0) {
                        _this.btnLimpiarLoad.disable();
                    } else {
                        _this.btnLimpiarLoad.enable();
                    }
                }
            }
        }
    });
    this.smCargasPorDefecto = new Ext.grid.CheckboxSelectionModel({
        id: 'checker',
        listeners: {
            rowselect: function (sm, ri, record) {
                var arrayrecords = sm.getSelections();
                if (sm.getSelections().length == 1) {
                    if (arrayrecords[0].data.actual != "1") {
                        _this.btnEliminarLoad.enable();
                    }
                    _this.btnModificarLoad.enable();
                    _this.btnActualLoad.enable();
                } else if (sm.getSelections().length > 1) {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        if (arrayrecords[i].data.actual == "1") {
                            _this.btnEliminarLoad.disable();
                        }
                    }
                    _this.btnModificarLoad.disable();
                    _this.btnActualLoad.disable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                var arrayrecords = sm.getSelections();
                var cont = 0;
                _this.gdCargasPorDefecto.getColumnModel().setColumnHeader(0, '');
                _this.gdCargasPorDefecto.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                if (sm.getSelections().length == 0) {
                    _this.btnActualLoad.disable();
                    _this.btnModificarLoad.disable();
                    _this.btnEliminarLoad.disable();
                } else if (sm.getSelections().length == 1) {
                    _this.btnActualLoad.enable();
                    _this.btnModificarLoad.enable();
                    if (arrayrecords[0].data.actual == "1") {
                        _this.btnEliminarLoad.disable();
                    } else {
                        _this.btnEliminarLoad.enable();
                    }
                } else {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        if (arrayrecords[i].data.actual == "1") {
                            _this.btnEliminarLoad.disable();
                            break;
                        } else {
                            _this.btnEliminarLoad.enable();
                        }
                    }
                }
            },
            selectionchange: function (sm) {
                if (sm.getSelections().length == 1) {
                    Ext.getCmp('btnSeleccionarLoad').enable();
                } else {
                    Ext.getCmp('btnSeleccionarLoad').disable();
                }
            }
        }
    });
    this.cmCargasPorDefecto = [
        _this.smCargasPorDefecto,
        {
            id: 'expandir',
            header: "Denominación",
            width: 150,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            header: "Plan",
            width: 50,
            dataIndex: 'plan',
            sortable: true,
            renderer: MostrarImagenTick
        }, {
            header: "Objetivo",
            width: 55,
            dataIndex: 'objetivo',
            sortable: true,
            renderer: MostrarImagenTick
        }, {
            header: "Actividad",
            width: 60,
            dataIndex: 'actividad',
            sortable: true,
            renderer: MostrarImagenTick
        }, {
            header: "FIP",
            width: 50,
            dataIndex: 'fip',
            sortable: true,
            renderer: MostrarImagenTick
        }, {
            header: "Fecha",
            width: 100,
            dataIndex: 'fechacreacion',
            sortable: true
        }, {
            header: "Actual",
            width: 50,
            dataIndex: 'actual',
            sortable: true,
            renderer: MostrarImagenTick
        }
    ];

    this.paginadoLoad = new Ext.PagingToolbar({
        id: "paginadoLoad",
        pageSize: 1000,
        store: _this.stCargasPorDefecto,
        displayInfo: true
    });
    this.gdCargasPorDefecto = new Ext.grid.GridPanel({
        id: 'gdCargasPorDefecto',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        loadMask: {
            msg: 'Cargando configuraciones'
        },
        plugins: _this.filtroLoad,
        store: _this.stCargasPorDefecto,
        sm: _this.smCargasPorDefecto,
        columns: _this.cmCargasPorDefecto,
        bbar: _this.paginadoLoad
    });
    this.PanelConfLoadCentro = new Ext.Panel({
        layout: 'fit',
        botonesKeymap: [_this.btnAdicionarLoad, _this.btnModificarLoad, _this.btnEliminarLoad,
            _this.btnActualLoad, _this.btnLimpiarLoad],
        usarKeymap: true,
        tbar: [_this.btnAdicionarLoad, _this.btnModificarLoad, _this.btnEliminarLoad,
            _this.btnActualLoad, _this.btnLimpiarLoad],
        id: 'PanelConfLoadCentro',
        title: (opciones.mostrarVentana) ? 'Configurar cargas por defecto' : '',
        items: [_this.gdCargasPorDefecto]
    });

    this.selectionmodel = function () {
        return _this.smCargasPorDefecto;
    };

    this.definirActual = function (tipoconf) {
        //alert('gassgsg');
        var arraytipos = [];
        if (tipoconf == 2) {
            var selected = _this.smCargasPorDefecto.getSelected().data;
            if (selected.actividad == 1)
                arraytipos.push(3);
            if (selected.plan == 1)
                arraytipos.push(0);
            if (selected.fip == 1)
                arraytipos.push(2);
            if (selected.objetivo == 1)
                arraytipos.push(1);
        }

        if (tipoconf == 3) {
            var selected = _this.smComport.getSelected().data;
            if (selected.actividad == 1)
                arraytipos.push(3);
            if (selected.arc == 1)
                arraytipos.push(4);
            if (selected.fip == 1)
                arraytipos.push(2);
            if (selected.objetivo == 1)
                arraytipos.push(1);
        }

        if (tipoconf == 1) {
            var selected = _this.smCalendar.getSelected().data;
        }
        mostrarMensaje(2, '¿Está seguro que quiere definir la configuración seleccionada como actual?', function (btnoprimido) {
            if (btnoprimido == 'ok') {

                _this.BarraProgreso.show('Actualizando');
                Ext.Ajax.request({
                    url: _this.url + 'definirActual',
                    params: {
                        idconfiguracionperfil: selected.idconfiguracionperfil,
                        arraytipoelemento: Ext.encode(arraytipos),
                        tipoconf: tipoconf
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'La configuración de cargas por defecto seleccionada ha sido definida como actual satisfactoriamente.');
                            _this.PostAccionesGestionar('Actual', tipoconf);
                        } else {
                            mostrarMensaje(3, 'Error');
                        }
                    }
                });
            }
        });
    };

    this.PostAccionesGestionar = function (accion, tipoconf) {
        switch (tipoconf) {
            case 1:
                _this.stCalendar.reload();
                break;
            case 2:
                _this.stCargasPorDefecto.reload();
                break;
            case 3:
                _this.stComport.reload();
                break;
        }
    };


    function MostrarImagenTick(val) {
        if (val > 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    this.verConfiguracionperfil = function (cargarConfiguracionPerfil, idelemento) {
        Wincargadefecto = new Ext.Window({
            layout: 'fit',
            title: 'Configurar cargas por defecto',
            closable: true,
            graggable: false,
            maximized: false,
            constrain: true,
            modal: true,
            closeAction: 'hide',
            defaultButton: 'btnAdicionarLoad',
            width: 640,
            height: 450,
            items: [_this.PanelConfLoadCentro],
            buttons: [
                {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    id: 'btnCerrarLoad',
                    nextTab: 'btnSeleccionarLoad',
                    prevTab: 'btnLimpiarLoad',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        Wincargadefecto.hide();
                    }
                }, {
                    iconCls: 'seleccion ',
                    text: 'Seleccionar',
                    nextTab: 'btnAdicionarLoad',
                    prevTab: 'btnCerrarLoad',
                    id: 'btnSeleccionarLoad',
                    disabled: ocultarBotonSeleccionar,
                    tooltip: 'Seleccionar carga por defecto y cerrar ventana',
                    handler: function () {
                        cargarConfiguracionPerfil(idelemento/*3*/, _this.selectionmodel().getSelections()[0].data.idconfiguracionperfil);
                        Wincargadefecto.hide();
                    }
                }
            ]
        });
        Wincargadefecto.on('beforeshow', function () {
            _this.btnAdicionarLoad.focus(true, 700);
            _this.stCargasPorDefecto.load({
                params: {
                    idelemento: idelemento
                }
            });
        });
        Wincargadefecto.doLayout();
        Wincargadefecto.show();
        _this.btnAdicionarLoad.focus(false, 1024);
    }

};



