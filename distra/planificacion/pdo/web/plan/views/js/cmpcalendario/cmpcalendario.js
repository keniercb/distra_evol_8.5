Utilidades.Cmp.Cmpcalendario = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.prevrow = -1;
    this.idtipodocumento = 3;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.primercambio = 0;
    this.busqueda = 0;
    var prevrow = -1;
    var prevrow2 = -1;
    var categactivado = 0;
    var tipoactivado = 0;
    var tiponom = null;

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    // declaraciones que permiten utilizar las funciones implementadas en calendar.js 
    var tmptest = new Ext.ECalendar({});
    var weekrange = tmptest.getDateRangeOfWeekByDate(0, new Date());
    //botones de la interfaz
    this.btnBusqueda = new Ext.Button({
        handler: function () {
            _this.BuscarActividadesCalendario();
        },
        text: 'Buscar',
        //icon:perfil.dirImg+'buscar.png', 
        iconCls: 'buscar',
        tooltip: 'Buscar actividad(es)'
    });

    this.btnRefrescarCalendario = new Ext.Button({
        handler: function () {
            _this.ActualizarCalendario();
        },
        //icon:perfil.dirImg+'actualizar.png', 
        iconCls: 'actualizar',
        tooltip: 'Actualizar'
    });
    this.btnLimpiarBusq = new Ext.Button({
        handler: function () {
            _this.LimpiarCalendarioBusq();
        },
        //icon:perfil.dirImg+'limpiar.png', 
        text: 'Limpiar',
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)'
    });


    this.LimpiarCalendarioBusq = function () {

        _this.objclasificadorinvol.ResetearArbolesBusqueda();

        _this.objcmprelaciones.PostCancelar();

        if (_this.tgcategact) {

            if (_this.tgcategact.getSelectionModel().hasSelection())
                _this.tgcategact.getSelectionModel().clearSelections();

        }
        if (_this.tgtipoact) {

            if (_this.tgtipoact.getSelectionModel().hasSelection())
                _this.tgtipoact.getSelectionModel().clearSelections();

        }

        if (_this.tabCalendario.getActiveTab().id == 'busqueda') {
            _this.objCrudCalendarioBsuqueda.busquedaefectuada = 0;
            _this.tabCalendario.getActiveTab().store.removeAll();
        }
        else {
            //_this.pOpcionesDeBusqueda.collapse();
            _this.tabCalendario.getActiveTab().store.reload();
        }


    }
    //arboles para la busqueda de elementos por autores e involucrados
    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusquedaCalendario(tipoelemento = 3, function () {
        _this.GenerarCalendariosPorUsuarios();
    });
    //Panel de las opciones de busqueda de tareas por categoria
    this.sttgcategact = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarNomencladores',
        reader: new Ext.data.JsonReader(
            {
                id: 'idnom',
                root: 'data',
                totalProperty: 'total'
            },
            [
                {
                    name: 'idnom'
                },

                {
                    name: 'denom'
                },

                {
                    name: '_parent'
                },

                {
                    name: '_is_leaf'
                },

                {
                    name: 'superior'
                }
            ]
        )
    });
    this.smtgcategact = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgcategact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgcategact.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else prevrow = -1;
            },
            rowdeselect: function (sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgcategact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgcategact.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else prevrow = -1;
            }
        }
    });
    this.tgcategact = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.sttgcategact,
        title: 'Por categoría de actividad',
        id: 'tgcategact',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        sm: _this.smtgcategact,
        root_title: ' ',
        loadMask: {
            msg: 'Cargando tipos de actividad'
        },
        columns: [
            _this.smtgcategact,
            {
                hidden: true,
                dataIndex: 'idnom'
            }, {
                hidden: true,
                dataIndex: 'superior'
            }, {
                id: 'expandir',
                header: 'Denominación',
                dataIndex: 'denom'
            },
        ],
        listeners: {
            activate: function (p) {
                if (categactivado == 0) {
                    categactivado = 1;
                    tiponom = 2;
                    _this.sttgcategact.removeAll();
                    _this.sttgcategact.load({
                        params: {
                            tiponom: tiponom
                        }
                    });
                }
            }
        }
    });
    _this.tgcategact.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1) return "superior";
        else return "";
    }
    //Panel de las opciones de busqueda de tareas por tipo
    this.smtgtipoact = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indice, record) {
                if (prevrow2 >= 0 && prevrow2 != indice) {
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).removeClass('superior2');
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).addClass('superior2');
                    prevrow2 = indice;
                } else prevrow2 = -1;
            },
            rowdeselect: function (sm, indice, record) {
                if (prevrow2 >= 0 && prevrow2 != indice) {
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).removeClass('superior2');
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).addClass('superior2');
                    prevrow2 = indice;
                } else prevrow2 = -1;
            }
        }
    });
    this.sttgtipoact = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarNomencladores',
        reader: new Ext.data.JsonReader(
            {
                id: 'idnom',
                root: 'data',
                totalProperty: 'total'
            },
            [
                {
                    name: 'idnom'
                },

                {
                    name: 'denom'
                },

                {
                    name: '_parent'
                },

                {
                    name: '_is_leaf'
                },

                {
                    name: 'superior'
                }
            ]
        )
    });
    this.tgtipoact = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.sttgtipoact,
        title: 'Por tipo de actividad',
        id: 'tgtipoact',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        sm: _this.smtgtipoact,
        root_title: ' ',
        loadMask: {
            msg: 'Cargando categorias de actividad'
        },
        columns: [
            _this.smtgtipoact,
            {
                hidden: true,
                dataIndex: 'idnom'
            }, {
                hidden: true,
                dataIndex: 'superior'
            }, {
                id: 'expandir',
                header: 'Denominación',
                dataIndex: 'denom'
            },
        ],
        listeners: {
            activate: function (p) {
                if (tipoactivado == 0) {
                    tipoactivado = 1;
                    tiponome = 3;
                    _this.sttgtipoact.removeAll();
                    _this.sttgtipoact.load({
                        params: {
                            tiponom: tiponome
                        }
                    });
                }
            }
        }
    });
    _this.tgtipoact.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1) return "superior";
        else return "";
    }

    //panel donde mustro a que debe de tributar las actividades que salgan en el calendario
    this.pRelacionesIniciales = _this.objcmprelaciones.CrearCmpRelacionesIniciales(3, function () {
        (_this.stTGCmpActividades) ? _this.stTGCmpActividades.reload() : null;
    }, false);
    this.pRelacionesIniciales.setTitle('Relacionado con');
    //tabpanel donde muestro las opciones de busqueda
    this.tpOpcionesDeBusqueda = new Ext.TabPanel({
        activeTab: 0,
        frame: true,
        border: false,
        enableTabScroll: true,
        items: [
            {
                title: 'Por autores e involucrados',
                layout: 'fit',
                items: [_this.tpAutoresInvolucrados]
            },
            _this.tgcategact, _this.tgtipoact, _this.pRelacionesIniciales
            //			{
            //				title:'Relacionado con',
            //				layout:'fit',
            //                                border:false,
            //				items:[_this.pRelacionesIniciales]
            //			}
        ]
    });

    //
    this.pOpcionesDeBusqueda = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        shadow: true,
        id: 'pbusq',
        collapsed: true,
        collapsible: true,
        height: 300,
        region: 'north',
        layout: 'fit',
        items: [_this.tpOpcionesDeBusqueda],
        buttons: [_this.btnBusqueda, _this.btnLimpiarBusq
        ]
    });

    //tabpanel donde muestro al componente calendario
    this.tabCalendario = new Ext.TabPanel({
        activeTab: 0,
        region: 'center',
        frame: true,
        border: true,
        plain: true,
        layoutOnTabChange: true,  //needed for the calendar 
        deferredRender: true,
        margins: '3 3 3 0',
        cmargins: '3 3 3 3',
        defaults: {
            autoHeight: true
        },
        enableTabScroll: true,
        closable: true,
        //bbar:[_this.btnRefrescarCalendario],
        listeners: {
            beforetabchange: function (TabPanel, newTab, currentTab) {
                if (_this.primercambio == 0 && newTab.id == 'busqueda') {
                    _this.objCrudCalendarioBsuqueda.recargarStore(_this.objCalendarioBusqueda.store);
                    _this.primercambio++;
                }
            }
        }
    });
    //calendario personal
    //objeto del componente "CRUD-CALENDARIO"   
    this.objCrudCalendarioPersonal = new Utilidades.Cmp.Cmpcrudcalendario();
    this.objCalendarioPersonal = _this.objCrudCalendarioPersonal.CrearObjCalendario(personal = 1, busqueda = 0, nodogenerador = null, _this.objclasificadorinvol,
        _this.smtgcategact, _this.smtgtipoact, _this.objcmprelaciones);
    _this.tabCalendario.add(_this.objCalendarioPersonal);
    //calendario busqueda
    this.objCrudCalendarioBsuqueda = new Utilidades.Cmp.Cmpcrudcalendario();
    this.objCalendarioBusqueda = _this.objCrudCalendarioBsuqueda.CrearObjCalendario(personal = 0, busqueda = 1, nodogenerador = null, _this.objclasificadorinvol,
        _this.smtgcategact, _this.smtgtipoact, _this.objcmprelaciones);
    _this.tabCalendario.add(_this.objCalendarioBusqueda);

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        closable: false,
        graggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        //kitar luegod e rectificar el formatod ehoras
        /*tbar:[
            new Ext.Button({
                handler:function(){
                    //he aki el invento para actualziar los formatos de hora
                    _this.VerificarFormatosDeHoraExistentes();
                },
                text:'Rectificar formato de hora',
                icon:perfil.dirImg+'buscar.png',
                iconCls:'btn',
                tooltip:'Rectificar formato de hora de las actividades'
            })
        ],*/
        //
        items: [_this.pOpcionesDeBusqueda, _this.tabCalendario],
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinP,
                //icon:perfil.dirImg+'cerrar.png',
                iconCls: 'cerrar',
                handler: function () {
                    _this.WinPrincipal.hide();
                }
            }
        ]
    });


    //funcion que carga el componente Calendario
    this.CargarCmpCalendario = function (idelemento, tipoelemento, parentelemento, AccionesAlRelacionar) {
        _this.AccionesAlRelacionar = AccionesAlRelacionar;
        _this.idelementohijo = idelemento;
        _this.tipoelementohijo = tipoelemento;
        if (parentelemento == 'padre') {
            _this.idelementopadre = idelemento;
            _this.tipoelementopadre = tipoelemento;
        }
        _this.WinPrincipal.show();
        _this.BarraProgreso.show('Cargando actividades en el calendario');
    }

    this.MostrarActividadesPorBusqueda = function () {
        var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
        var arraycategorias = _this.ObtenerCategoriasActividad();
        var arraytipos = _this.ObtenerTipoActividad();
        var arrayelementostributa = _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales();
        //_this.MostrarActividadesInicialmente();

    }

    this.MostrarActividadesInicialmente = function (objCalendario, personal, busqueda, objclasificadorinvol, objclasificadorinvol, ObtenerCategoriasActividad, ObtenerTipoActividad, objcmprelaciones) {
        var idcalendario = objCalendario.id;
        var arrayautores = objclasificadorinvol.ObtenerAutoresBusqueda();
        var arrayinvolucrados = objclasificadorinvol.ObtenerInvolucradosBusqueda();
        var arraycategorias = ObtenerCategoriasActividad();
        var arraytipos = ObtenerTipoActividad();
        var arrayelementostributa = objcmprelaciones.ObtenerElementosRelacionadosIniciales();
        objCalendario.reload({
            params: {
                arrayautores: Ext.encode(arrayautores),
                arrayinvolucrados: Ext.encode(arrayinvolucrados),
                arraycategorias: Ext.encode(arraycategorias),
                arraytipos: Ext.encode(arraytipos),
                arrayelementostributa: Ext.encode(arrayelementostributa),
                personal: personal,
                busqueda: busqueda,
                idcalendario: idcalendario
            }
        });

    }

    this.BuscarActividadesCalendario = function () {
        if (_this.tabCalendario.getActiveTab().id == 'busqueda') {
            _this.objCrudCalendarioBsuqueda.busquedaefectuada = 1;
        }
        _this.pOpcionesDeBusqueda.collapse();
        _this.tabCalendario.getActiveTab().store.reload();//.store.reload();

    }

    this.GenerarCalendariosPorUsuarios = function () {
        var nodo = _this.objclasificadorinvol.nodomenu;
        var idusuario = nodo.idusuario;
        var objCalendarioUser = _this.tabCalendario.findById(idusuario);
        if (!objCalendarioUser) {
            var objCalendario = new Utilidades.Cmp.Cmpcrudcalendario();
            var objCalendarioUser = objCalendario.CrearObjCalendario(personal = false, busqueda = false, nodo, _this.objclasificadorinvol,
                _this.smtgcategact, _this.smtgtipoact, _this.objcmprelaciones);
            _this.tabCalendario.add(objCalendarioUser);

        }
        _this.tabCalendario.activate(objCalendarioUser);
        _this.pOpcionesDeBusqueda.collapse();

    }

    this.ActualizarCalendario = function () {
        _this.tabCalendario.getActiveTab.ObtenerActividadesVistaCalendario();
    }

    this.VerificarFormatosDeHoraExistentes = function () {
        mostrarMensaje(2, 'Desea verificar si existen actividades con el formato de hora  incorrecto(distinto a la hora militar)?', function (btnoprimido) {
            alert(btnoprimido);
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show('Verificando formatos de hora');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpcalendario/verificarformatoshora',
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(2, 'Existen actividades con formatos de hora incorrecta(distinta al formato de hora militar). Desea rectficarlas?', function (btnoprimido2) {
                                if (btnoprimido2 == 'ok') {
                                    _this.BarraProgreso.show('Rectificando formatos de hora');
                                    Ext.Ajax.request({
                                        url: '/planificacion/pdo/plan/index.php/cmpcalendario/rectificarformatoshora',
                                        callback: function (options, success, response) {
                                            _this.BarraProgreso.hide();
                                            responseData = Ext.decode(response.responseText);
                                            if (responseData.mensaje == 1) {
                                                mostrarMensaje(1, 'Formatos de hora rectificados satisfactoriamente.');
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, 'Todas las actividades estan con el formato de hora deseado(hora militar).');
                        }
                    }
                });
            }
        });
    }

}


