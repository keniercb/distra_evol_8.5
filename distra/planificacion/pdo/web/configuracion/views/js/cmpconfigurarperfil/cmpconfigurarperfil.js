Utilidades.Cmp.Cmpconfigurarperfil = function () {
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.start = 0;
    //objeto CRUD-ARC inicializado

    this.objCrudCargaPorDefecto = new Utilidades.Cmp.Cmpcrudcargapordefecto();
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaConfigurarPerfil',
        text: 'Ayuda',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad'
    });
    this.btnCalendario = new Ext.Button({
        id: 'btnCalendario',
        iconCls: 'calendario',
        tooltip: 'Configuración de calendario',
        handler: function () {
            onClickConfCalendar();
        }
    });
    this.btnLoad = new Ext.Button({
        id: 'btnLoad',
        iconCls: 'filtrar',
        tooltip: 'Configuración de cargas por defecto',
        handler: function () {
            onClickConfLoad();
        }
    });
    this.btnComportamiento = new Ext.Button({
        id: 'btnComportamiento',
        iconCls: 'clienteproveedorcrm',
        tooltip: 'Configuración de comportamiento',
        handler: function () {
            onClickConfComport();
        }
    });
    /*this.btnTraspaso = new Ext.Button({
        id: 'btnTraspaso',
        iconCls: 'traspaso',
        tooltip: 'Configuración de traspaso de información',
        handler: function () {
            onClickConfTrasp();
        }
    });*/

    //comienza el panel para configurar calendarios
    this.btnAdicionarCalendar = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto(
                'Adicionar', 1, _this.PostAccionesGestionar, _this.smCalendar);
        },
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar configuraci&oacute;n de calendario',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificarCalendar = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto(
                'Modificar', 1, _this.PostAccionesGestionar, _this.smCalendar);
        },
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar configuraci&oacute;n de calendario',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminarCalendar = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.eliminarCalendario(
                _this.smCalendar.getSelections(), _this.PostAccionesGestionar);
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar configuraci&oacute;n de calendario',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnActualCalendar = new Ext.Button({
        handler: function () {
            _this.definirActual(1);
        },
        disabled: true,
        iconCls: 'actual',
        tooltip: 'Definir configuración actual',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });
    this.btnLimpiarCalendar = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        handler: function () {
            _this.filtrosCalendar.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.filtrosCalendar = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'idelemento',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, /*{
         type: 'string',
         dataIndex: 'descripcion'
         },*/ {
            type: 'date',
            dataIndex: 'fechacreacion'
        }, {
            type: 'list',
            dataIndex: 'actual',
            options: ['Si', 'No']
        }]
    });
    this.stCalendar = new Ext.data.Store({
        url: 'listarConfCalendarios',
        reader: new Ext.data.JsonReader(
            {
                id: 'id',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'denominacion'
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
                _this.BarraProgreso.show('Cargando');
                s.baseParams.start = _this.start;
            },
            load: function (st) {
                _this.gdCalendar.getColumnModel().setColumnHeader(0, '');
                _this.gdCalendar.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                _this.BarraProgreso.hide();
                if (_this.smCalendar.getSelected() == undefined) {
                    _this.btnModificarCalendar.disable();
                    _this.btnEliminarCalendar.disable();
                    _this.btnActualCalendar.disable();
                }
                if (st.getCount() == 0) {
                    if (_this.start != 0) {
                        _this.start = 0;
                        st.reload();
                    } else {
                        if (_this.filtrosCalendar.getFiltrosActivos() == undefined || _this.filtrosCalendar.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                            _this.btnLimpiarCalendar.disable();
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            _this.btnLimpiarCalendar.enable();
                        }
                    }
                    _this.btnModificarCalendar.disable();
                    _this.btnActualCalendar.disable();
                    _this.btnEliminarCalendar.disable();
                } else {
                    if (_this.filtrosCalendar.getFiltrosActivos() == undefined || _this.filtrosCalendar.getFiltrosActivos().length == 0) {
                        _this.btnLimpiarCalendar.disable();
                    } else {
                        _this.btnLimpiarCalendar.enable();
                    }
                }
            }
        }
    });
    this.smCalendar = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, ri, record) {
                var arrayrecords = sm.getSelections();
                if (sm.getSelections().length == 1) {
                    if (arrayrecords[0].data.actual != "1") {
                        _this.btnEliminarCalendar.enable();
                        _this.btnActualCalendar.enable();
                    } else {
                        _this.btnEliminarCalendar.disable();
                        _this.btnActualCalendar.disable();
                    }
                    _this.btnModificarCalendar.enable();
                } else if (sm.getSelections().length > 1) {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        if (arrayrecords[i].data.actual == "1") {
                            _this.btnEliminarCalendar.disable();
                            break;
                        }
                        _this.btnEliminarCalendar.enable();
                    }
                    _this.btnModificarCalendar.disable();
                    _this.btnActualCalendar.disable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                var arrayrecords = sm.getSelections();
                _this.gdCalendar.getColumnModel().setColumnHeader(0, '');
                _this.gdCalendar.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                if (sm.getSelections().length == 0) {
                    _this.btnModificarCalendar.disable();
                    _this.btnEliminarCalendar.disable();
                    _this.btnActualCalendar.disable();
                } else if (sm.getSelections().length == 1) {
                    if (arrayrecords[0].data.actual != "1") {
                        _this.btnEliminarCalendar.enable();
                        _this.btnActualCalendar.enable();
                    } else {
                        _this.btnEliminarCalendar.disable();
                        _this.btnActualCalendar.disable();
                    }
                    _this.btnModificarCalendar.enable();
                } else {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        if (arrayrecords[i].data.actual == "1") {
                            _this.btnEliminarCalendar.disable();
                            break;
                        } else {
                            _this.btnEliminarCalendar.enable();
                        }
                    }
                }
            }
        }
    });
    this.cmCalendar = [
        _this.smCalendar,
        {
            id: 'expandir',
            header: "Denominación",
            //  width: 350,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            header: "Fecha",
            width: 200,
            dataIndex: 'fechacreacion',
            sortable: true
        }, {
            header: "Actual",
            width: 100,
            dataIndex: 'actual',
            sortable: true,
            renderer: MostrarImagenTick
        }/*{
         header: "Descripción",
         width: 200,
         dataIndex: 'descripcion',
         sortable: true
         }*/
    ];
    this.paginadoCalendar = new Ext.PagingToolbar({
        id: "paginadoCalendar",
        pageSize: 1000,
        store: _this.stCalendar,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });

    this.gdCalendar = new Ext.grid.GridPanel({
        id: 'gdCalendar',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.filtrosCalendar,
        autoExpandColumn: 'expandir',
        store: _this.stCalendar,
        sm: _this.smCalendar,
        columns: _this.cmCalendar,
        bbar: _this.paginadoCalendar,
        listeners: {
            rowcontextmenu: function (t, ri, event) {
            },
            rowdblclick: function (t, ri, event) {
                _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto(
                    'Modificar', 1, _this.PostAccionesGestionar, _this.smCalendar);
            }
        }
    });
    this.PanelConfCalendarCentro = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionarCalendar, _this.btnModificarCalendar, _this.btnEliminarCalendar,
            _this.btnActualCalendar, _this.btnLimpiarCalendar],
        tbar: [_this.btnAdicionarCalendar, ' ', _this.btnModificarCalendar, ' ', _this.btnEliminarCalendar, ' ',
            _this.btnActualCalendar, ' ', _this.btnLimpiarCalendar],
        id: 'PanelConfCalendarCentro',
        title: 'Configurar calendarios',
        items: _this.gdCalendar
    });
    //comienza el panel para configurar cargas por defecto 
    this.btnAdicionarLoad = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto('Adicionar', 2, _this.PostAccionesGestionar, null);
        },
        disabled: false,
        id: 'btnAdicionarLoad',
        prevTab: '',
        nextTab: '',
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
            _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto(
                'Modificar', 2, _this.PostAccionesGestionar, _this.smCargasPorDefecto);
        },
        disabled: true,
        id: 'btnModificarLoad',
        prevTab: '',
        nextTab: '',
        iconCls: 'modificar',
        tooltip: 'Modificar configuraci&oacute;n de cargas por defectos',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminarLoad = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.eliminarCargaxDefecto(
                _this.smCargasPorDefecto.getSelections(), _this.PostAccionesGestionar);
        },
        disabled: true,
        id: 'btnEliminarLoad',
        prevTab: '',
        nextTab: '',
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
        prevTab: '',
        nextTab: '',
        iconCls: 'actual',
        tooltip: 'Definir configuración actual',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });

    this.btnLimpiarLoad = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        id: 'btnLimpiarLoad',
        prevTab: '',
        nextTab: '',
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
        }, /*{
         type: 'string',
         dataIndex: 'descripcion'
         },*/ {
            type: 'date',
            dataIndex: 'fechacreacion'
        }, {
            type: 'numeric',
            dataIndex: 'gradocumplimiento'
        }, {
            type: 'listado',
            dataIndex: 'nombreestadoaprob',
            idcombo: 'idcbftestado',
            urlcb: 'cargarcmbestados',
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
        url: 'listarCargasxDefecto',
        reader: new Ext.data.JsonReader(
            {
                id: 'id',
                root: 'data',
                totalProperty: 'total'
            }, [{
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
            }]
        ),
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando');
                s.baseParams.start = _this.start;
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
                    if (_this.start != 0) {
                        _this.start = 0;
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
                        _this.btnActualLoad.enable();
                    }
                    _this.btnModificarLoad.enable();

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
                    _this.btnModificarLoad.enable();
                    if (arrayrecords[0].data.actual == "1") {
                        _this.btnEliminarLoad.disable();
                        _this.btnActualLoad.disable();
                    } else {
                        _this.btnEliminarLoad.enable();
                        _this.btnActualLoad.enable();
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
        }/*{
         header: "Descripción",
         width: 150,
         dataIndex: 'descripcion',
         sortable: true
         }*/
    ];
    this.paginadoLoad = new Ext.PagingToolbar({
        id: "paginadoLoad",
        pageSize: 1000,
        store: _this.stCargasPorDefecto,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });

    this.gdCargasPorDefecto = new Ext.grid.GridPanel({
        id: 'gdCargasPorDefecto',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        plugins: _this.filtroLoad,
        store: _this.stCargasPorDefecto,
        sm: _this.smCargasPorDefecto,
        columns: _this.cmCargasPorDefecto,
        bbar: _this.paginadoLoad,
        listeners: {
            rowcontextmenu: function (t, ri, event) {
            },
            rowdblclick: function (t, ri, event) {
                _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto(
                    'Modificar', 2, _this.PostAccionesGestionar, _this.smCargasPorDefecto);
            }
        }
    });

    this.PanelConfLoadCentro = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionarLoad, _this.btnModificarLoad, _this.btnEliminarLoad,
            _this.btnActualLoad, _this.btnInicialLoad, _this.btnLimpiarLoad],
        tbar: [_this.btnAdicionarLoad, ' ', _this.btnModificarLoad, ' ', _this.btnEliminarLoad, ' ',
            _this.btnActualLoad, ' ', _this.btnLimpiarLoad],
        id: 'PanelConfLoadCentro',
        title: 'Configurar cargas por defecto',
        items: _this.gdCargasPorDefecto
    });
    //comienza el panel para configurar comportamientos

    this.btnAdicionarComport = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto(
                'Adicionar', 3, _this.PostAccionesGestionar, null);
        },
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar configuraci&oacute;n de comportamientos',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificarComport = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto(
                'Modificar', 3, _this.PostAccionesGestionar, _this.smComport);
        },
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar configuraci&oacute;n de comportamientos',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminarComport = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.eliminarConfComportamiento(_this.smComport.getSelections(), _this.PostAccionesGestionar);
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar configuraci&oacute;n de comportamientos',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnActualComport = new Ext.Button({
        handler: function () {
            _this.definirActual(3);
        },
        disabled: false,
        iconCls: 'actual',
        tooltip: 'Definir configuración actual',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });

    this.btnLimpiarComport = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        handler: function () {
            _this.filtroConfComportamientos.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
//filtros julio hizo esto
    this.filtroConfComportamientos = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'idelemento',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, /*{
         type: 'string',
         dataIndex: 'descripcion'
         },*/ {
            type: 'date',
            dataIndex: 'fechacreacion'
        }, {
            type: 'numeric',
            dataIndex: 'gradocumplimiento'
        }, {
            type: 'listado',
            dataIndex: 'nombreestadoaprob',
            idcombo: 'idcbftestado',
            urlcb: 'cargarcmbestados',
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
            dataIndex: 'arc',
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
//fin del filtro
    this.stComport = new Ext.data.Store({
        url: 'listarConfComportamientos',
        reader: new Ext.data.JsonReader(
            {
                id: 'idconfiguracionperfil',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'denominacion'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'actual'
            }, {
                name: 'descripcion'
            }, {
                name: 'autor'
            }, {
                name: 'actividad'
            }, {
                name: 'arc'
            }, {
                name: 'fip'
            }, {
                name: 'objetivo'
            }, {
                name: 'idconfiguracionperfil'
            }]
        ),
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando');
                s.baseParams.start = _this.start;
            },
            load: function (st) {
                _this.gdComport.getColumnModel().setColumnHeader(0, '');
                _this.gdComport.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                _this.BarraProgreso.hide();
                if (_this.smComport.getSelected() == undefined) {
                    _this.btnModificarComport.disable();
                    _this.btnEliminarComport.disable();
                    _this.btnActualComport.disable();
                }
                if (st.getCount() == 0) {
                    if (_this.start != 0) {
                        _this.start = 0;
                        st.reload();
                    } else {
                        if (_this.filtroConfComportamientos.getFiltrosActivos() == undefined || _this.filtroConfComportamientos.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                    }
                    _this.btnModificarComport.disable();
                    _this.btnEliminarComport.disable();
                    _this.btnActualComport.disable();
                }
            }
        }
    });
    this.smComport = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (sm, ri, record) {
                var arrayrecords = sm.getSelections();
                if (sm.getSelections().length == 1) {
                    if (arrayrecords[0].data.actual == "1") {
                        _this.btnEliminarComport.disable();
                        _this.btnActualComport.disable();
                    } else {
                        _this.btnEliminarComport.enable();
                        _this.btnActualComport.enable();
                    }
                    _this.btnModificarComport.enable();

                } else if (sm.getSelections().length > 1) {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        if (arrayrecords[i].data.actual == "1") {
                            _this.btnEliminarComport.disable();
                            break;
                        }
                        _this.btnEliminarComport.enable();
                    }
                    _this.btnModificarComport.disable();
                    _this.btnActualComport.disable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                var arrayrecords = sm.getSelections();
                _this.gdComport.getColumnModel().setColumnHeader(0, '');
                _this.gdComport.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                if (sm.getSelections().length == 0) {
                    _this.btnModificarComport.disable();
                    _this.btnEliminarComport.disable();
                    _this.btnActualComport.disable();
                } else if (sm.getSelections().length == 1) {
                    if (arrayrecords[0].data.actual == "1") {
                        _this.btnEliminarComport.disable();
                        _this.btnActualComport.disable();
                    } else {
                        _this.btnEliminarComport.enable();
                        _this.btnActualComport.enable();
                    }
                    _this.btnModificarComport.enable();
                } else {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        if (arrayrecords[i].data.actual == "1") {
                            _this.btnEliminarComport.disable();
                            break;
                        } else {
                            _this.btnEliminarComport.enable();
                        }
                    }
                }
            }
        }
    });
    this.cmComport = [
        this.smComport,
        {
            id: 'expandir',
            header: "Denominación",
            width: 150,
            sortable: true,
            dataIndex: 'denominacion'
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
            header: "ARC",
            width: 50,
            dataIndex: 'arc',
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
        } /*{
         header: "Descripción",
         width: 200,
         dataIndex: 'descripcion',
         sortable: true
         }*/
    ];

    this.paginadoComport = new Ext.PagingToolbar({
        id: "paginadoComport",
        pageSize: 1000,
        store: _this.stComport,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });
    this.gdComport = new Ext.grid.GridPanel({
        id: 'gdComport',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        store: _this.stComport,
        sm: _this.smComport,
        plugins: _this.filtroConfComportamientos,
        columns: _this.cmComport,
        bbar: _this.paginadoComport,
        listeners: {
            rowcontextmenu: function (t, ri, event) {
            },
            rowdblclick: function (t, ri, event) {
                _this.objCrudCargaPorDefecto.CrearWinFormCargaPorDefecto(
                    'Modificar', 3, _this.PostAccionesGestionar, _this.smComport);
            }
        }
    });

    this.PanelConfComportCentro = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionarComport, _this.btnModificarComport, _this.btnEliminarComport,
            _this.btnActualComport, _this.btnLimpiarComport],
        tbar: [_this.btnAdicionarComport, ' ', _this.btnModificarComport, ' ', _this.btnEliminarComport, ' ',
            _this.btnActualComport, ' ', _this.btnLimpiarComport],
        id: 'PanelConfComportCentro',
        title: 'Configurar comportamientos',
        items: _this.gdComport
    });

    //panel de traspaso
    this.btnAdicionarTrasp = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormConfTraspaso('Adicionar', _this.PostAccionesGestionar, null);
        },
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar configuraci&oacute;n de traspaso',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificarTrasp = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.CrearWinFormConfTraspaso(
                'Modificar', _this.PostAccionesGestionar, _this.smComport);
        },
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar configuraci&oacute;n de traspaso',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminarTrasp = new Ext.Button({
        handler: function () {
            _this.objCrudCargaPorDefecto.eliminarConfComportamiento(_this.smTrasp.getSelections(), _this.PostAccionesGestionar);
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar configuraci&oacute;n de traspaso',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnActualTrasp = new Ext.Button({
        handler: function () {
            _this.definirActual(3);
        },
        disabled: false,
        iconCls: 'actual',
        tooltip: 'Definir configuración actual',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });

    this.btnLimpiarTrasp = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        handler: function () {
            _this.filtroConfTraspaso.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
//filtros julio hizo esto
    this.filtroConfTraspaso = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'idelemento',
            xtype: 'numberfield',
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, /*{
         type: 'string',
         dataIndex: 'descripcion'
         },*/ {
            type: 'date',
            dataIndex: 'fechacreacion'
        }, {
            type: 'numeric',
            dataIndex: 'gradocumplimiento'
        }, {
            type: 'listado',
            dataIndex: 'nombreestadoaprob',
            idcombo: 'idcbftestado',
            urlcb: 'cargarcmbestados',
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
            dataIndex: 'arc',
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
    this.stTrasp = new Ext.data.Store({
        url: 'listarConfTraspaso',
        reader: new Ext.data.JsonReader(
            {
                id: 'idconfiguracionperfil',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'denominacion'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'actual'
            }, {
                name: 'descripcion'
            }, {
                name: 'autor'
            }, {
                name: 'actividad'
            }, {
                name: 'arc'
            }, {
                name: 'fip'
            }, {
                name: 'objetivo'
            }, {
                name: 'idconfiguracionperfil'
            }]
        ),
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando');
                s.baseParams.start = _this.start;
            },
            load: function (st) {
                _this.gdTrasp.getColumnModel().setColumnHeader(0, '');
                _this.gdTrasp.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                _this.BarraProgreso.hide();
                if (_this.smTrasp.getSelected() == undefined) {
                    _this.btnModificarTrasp.disable();
                    _this.btnEliminarTrasp.disable();
                    _this.btnActualTrasp.disable();
                }
                if (st.getCount() == 0) {
                    if (_this.start != 0) {
                        _this.start = 0;
                        st.reload();
                    } else {
                        if (_this.filtroConfTraspaso.getFiltrosActivos() == undefined || _this.filtroConfTraspaso.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                    }
                    _this.btnModificarTrasp.disable();
                    _this.btnEliminarTrasp.disable();
                    _this.btnActualTrasp.disable();
                }
            }
        }
    });
    this.smTrasp = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (sm, ri, record) {
                var arrayrecords = sm.getSelections();
                if (sm.getSelections().length == 1) {
                    if (arrayrecords[0].data.actual == "1") {
                        _this.btnEliminarTrasp.disable();
                        _this.btnActualTrasp.disable();
                    } else {
                        _this.btnEliminarTrasp.enable();
                        _this.btnActualTrasp.enable();
                    }
                    _this.btnModificarTrasp.enable();

                } else if (sm.getSelections().length > 1) {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        if (arrayrecords[i].data.actual == "1") {
                            _this.btnEliminarTrasp.disable();
                            break;
                        }
                        _this.btnEliminarTrasp.enable();
                    }
                    _this.btnModificarTrasp.disable();
                    _this.btnActualTrasp.disable();
                }
            },
            rowdeselect: function (sm, ri, record) {
                var arrayrecords = sm.getSelections();
                _this.gdComport.getColumnModel().setColumnHeader(0, '');
                _this.gdComport.getColumnModel().setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                if (sm.getSelections().length == 0) {
                    _this.btnModificarTrasp.disable();
                    _this.btnEliminarTrasp.disable();
                    _this.btnActualTrasp.disable();
                } else if (sm.getSelections().length == 1) {
                    if (arrayrecords[0].data.actual == "1") {
                        _this.btnEliminarTrasp.disable();
                        _this.btnActualTrasp.disable();
                    } else {
                        _this.btnEliminarTrasp.enable();
                        _this.btnActualTrasp.enable();
                    }
                    _this.btnModificarTrasp.enable();
                } else {
                    for (var i = 0; i < arrayrecords.length; i++) {
                        if (arrayrecords[i].data.actual == "1") {
                            _this.btnEliminarTrasp.disable();
                            break;
                        } else {
                            _this.btnEliminarTrasp.enable();
                        }
                    }
                }
            }
        }
    });
    this.cmTrasp = [
        this.smTrasp,
        {
            id: 'expandir',
            header: "Denominación",
            width: 150,
            sortable: true,
            dataIndex: 'denominacion'
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
            header: "ARC",
            width: 50,
            dataIndex: 'arc',
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
        } /*{
         header: "Descripción",
         width: 200,
         dataIndex: 'descripcion',
         sortable: true
         }*/
    ];

    this.paginadoTrasp = new Ext.PagingToolbar({
        id: "paginadoTraspaso",
        pageSize: 1000,
        store: _this.stTrasp,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });
    this.gdTrasp = new Ext.grid.GridPanel({
        id: 'gdTraspaso',
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        store: _this.stTrasp,
        sm: _this.smTrasp,
        plugins: _this.filtroConfTraspaso,
        columns: _this.cmTrasp,
        bbar: _this.paginadoTrasp
    });

    this.PanelConfTraspaso = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionarTrasp, _this.btnModificarTrasp, _this.btnEliminarTrasp,
            _this.btnActualTrasp, _this.btnLimpiarTrasp],
        tbar: [_this.btnAdicionarTrasp, ' ', _this.btnModificarTrasp, ' ', _this.btnEliminarTrasp, ' ',
            _this.btnActualTrasp, ' ', _this.btnLimpiarTrasp],
        id: 'PanelConfTraspaso',
        title: 'Configurar traspaso de la información',
        items: _this.gdTrasp
    });

    this.PanelCards = new Ext.Panel({
        layout: 'card',
        region: 'center',
        activeItem: 0,
        items: [_this.PanelConfCalendarCentro, _this.PanelConfLoadCentro, _this.PanelConfComportCentro, _this.PanelConfTraspaso]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        closable: false,
        resizable: false,
        noTitle: true,
        maximized: true,
        modal: true,
        width: 1000,
        height: 510,
        tbar: [_this.btnCalendario, ' ', _this.btnLoad, ' ', _this.btnComportamiento, /*_this.btnTraspaso,*/ '->', _this.btnAyuda],
        items: _this.PanelCards
    });
    this.Inicializar = function () {
        _this.WinPrincipal.show();
        onClickConfCalendar();
    };

    function onClickConfCalendar(event, elx, obx) {
        _this.start = 0;
        _this.BarraProgreso.show('Cargando configuraciones');
        _this.stCalendar.load();
        _this.PanelCards.layout.setActiveItem('PanelConfCalendarCentro');
    }

    function onClickConfLoad(event, elx, obx) {
        _this.start = 0;
        _this.BarraProgreso.show('Cargando configuraciones');
        _this.stCargasPorDefecto.load();
        _this.PanelCards.layout.setActiveItem('PanelConfLoadCentro');
    }

    function onClickConfComport(event, elx, obx) {
        _this.start = 0;
        _this.BarraProgreso.show('Cargando configuraciones');
        _this.stComport.load();
        _this.PanelCards.layout.setActiveItem('PanelConfComportCentro');
    }

    function onClickConfTrasp(event, elx, obx) {
        _this.start = 0;
        _this.BarraProgreso.show('Cargando configuraciones');
        _this.stTrasp.load();
        _this.PanelCards.layout.setActiveItem('PanelConfTraspaso');
    }

    this.definirActual = function (tipoconf) {
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
        if (tipoconf == 4) {
            var selected = _this.smTrasp.getSelected().data;
        }
        mostrarMensaje(2, '¿Está seguro que quiere definir la configuración seleccionada como actual?', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show('Actualizando');
                Ext.Ajax.request({
                    url: 'definirActual',
                    params: {
                        idconfiguracionperfil: selected.idconfiguracionperfil,
                        arraytipoelemento: Ext.encode(arraytipos),
                        tipoconf: tipoconf
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'La configuración seleccionada ha sido definida como actual satisfactoriamente.');
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
            case 4:
                _this.stTrasp.reload();
                break;
        }
    };

    function MostrarImagenTick(val) {
        if (val > 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }


};
