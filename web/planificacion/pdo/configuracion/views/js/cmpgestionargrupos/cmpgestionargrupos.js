Utilidades.Cmp.Cmpgestionargrupos = function (opcionesConfig) {
    var perfil = window.parent.UCID.portal.perfil;
    perfil.etiquetas = Object();
    Ext.QuickTips.init();
    Ext.Ajax.timeout = 1000000000;

    var _this = this;
    this.prevrow = -1;
    this.idtipodocumento = 0;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.idcomponente = opcionesConfig.idcomponente;

    //otras variables
    this.arrayidgrupos = [];
    this.arraygruposseleccionados = [];
    this.permitirmodificar = 0;
    this.permitireliminar = 0;
    this.permitiractivar = 0;
    this.permitirdesactivar = 0;
    this.pgactual = 0;
    this.start = 0;
    this.posteliminar = false;
	this.url = '/planificacion/pdo/configuracion/index.php/cmpgestionargrupos/',

    //validacion de fechas
    Ext.apply(Ext.form.VTypes, {
        daterange: function (val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        }
    });

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //objeto CRUD-PLAN inicializado
    this.objCrudGrupo = new Utilidades.Cmp.Cmpcrudgrupos();

    //objeto del componente observaciones inicializado
    //this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //botones para la gestion de los planes
    this.btnAdicionar = new Ext.Button({
        handler: function () {
            _this.objCrudGrupo.CrearWinCrudGrupo('Adicionar', _this.PostAccionesGestionar, _this.arrayidgrupos);
        },
        hidden: opcionesConfig.noUsarAdicionar,
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar grupo de usuarios y estructuras',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificar = new Ext.Button({
        handler: function () {
            _this.objCrudGrupo.CrearWinCrudGrupo('Modificar', _this.PostAccionesGestionar, _this.arrayidgrupos);
        },
        hidden: opcionesConfig.noUsarModificar,
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar grupo de usuarios y estructuras',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminar = new Ext.Button({
        handler: function () {
            _this.objCrudGrupo.EliminarGrupos(_this.arrayidgrupos, _this.PostAccionesGestionar);
        },
        hidden: opcionesConfig.noUsarEliminar,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar grupo de usuarios y estructuras',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnActivar = new Ext.Button({
        handler: function () {
            _this.objCrudGrupo.ActivarDesactivarGrupo(_this.arrayidgrupos, _this.PostAccionesGestionar, 'activar');
        },
        hidden: opcionesConfig.noUsarActivar,
        disabled: true,
        iconCls: 'habilitar',
        tooltip: 'Activar grupo de usuarios y estructuras',
        key: {
            alt: true,
            key: 'X'
        },
        scope: this
    });
    this.btnDesactivar = new Ext.Button({
        handler: function () {
            _this.objCrudGrupo.ActivarDesactivarGrupo(_this.arrayidgrupos, _this.PostAccionesGestionar, 'desactivar');
        },
        hidden: opcionesConfig.noUsarDesactivar,
        disabled: true,
        iconCls: 'deshabilitar',
        tooltip: 'Desactivar grupo de usuarios y estructuras',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });
    this.btnAlias = new Ext.Button({
        disabled: true,
        id: 'btnAlias',
        iconCls: 'buscarclitepersona',
        text: 'Cambiar alias a usuarios',
        handler: function () {
            //CreaVentanaCambiarAlias();
        },
        tooltip: 'Cambiar el alias a los usuarios',
        key: {
            ctrl: true,
            alt: true,
            key: 'U'
        },
        scope: this
    });
    this.btnLimpiar = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        handler: function () {
            if (_this.ftCmpgrupos)
                _this.ftCmpgrupos.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaGestionarGrupos',
        text: 'Ayuda',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    //eventual para el traspaso de usuarios
    this.btnTraspaso = new Ext.Button({
        iconCls: 'buscarclitepersona',
        text: 'Traspasar',
        handler: function () {
            _this.BarraProgreso.show('Traspasando datos y usuarios del grupo');
            Ext.Ajax.request({
                url: _this.url + 'traspasarusuariosdelgrupo',
                params: {
                    arrayidgrupos: Ext.encode(_this.arrayidgrupos)
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    msj = 'No se pudo realizar el traspaso.';
                    icono = 3;
                    var ms = 0;
                    if (responseData.mensaje == 1) {
                        msj = 'El traspaso se realiz&oacute; correctamente.';
                    }
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, msj);
                        _this.PostAccionesGestionar(ms, 'Adicionar');
                    } else {
                        mostrarMensaje(icono, msj);
                        _this.PostAccionesGestionar(ms, 'Adicionar');
                    }
                }
            });
        }
    });

    //store del grid donde muestro los grupos
    this.stgrupos = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad: true,
        url: _this.url + 'cargargrupos',
        listeners: {
            beforeload: function (st) {
                st.baseParams.idgrupo = _this.arrayidgrupos[0];
                //st.baseParams.start = _this.pgactual;                
            },
            load: function (st) {
                if (_this.ggrupos.getStore().getCount() == 0 && !_this.posteliminar) {
                    if (_this.ftCmpgrupos.getFiltrosActivos() == undefined
                        || _this.ftCmpgrupos.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                _this.posteliminar = false;
                _this.ActualizarEstadoBarraHerramientas();
            }
        },
        reader: new Ext.data.JsonReader(
            {
                totalProperty: "total",
                root: "campos",
                id: "idgrupo"
            }, [{
                name: 'idgrupo'
            }, {
                name: 'dengrupo'
            }, {
                name: 'descgrupo'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'idusuariocrea'
            }, {
                name: 'activo'
            }, {
                name: 'personal'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'tipo'
            }, {
                name: 'icono'
            }])
    });

    //barra de paginado del grid donde se cargan los grupos    
    this.ptbggrupo = new Ext.ux.maximgb.treegrid.PagingToolbar({
        pageSize: 1000,
        store: _this.stgrupos,
        displayInfo: true,
        id: 'ptbggrupo',
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }

    });

    // modo de seleccion del grid de grupos
    this.smgrupos = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                _this.ActualizarEstadoBarraHerramientas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });

    //plugins para los filtros del grid
    this.ftCmpgrupos = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'dengrupo'
        }, {
            type: 'list',
            dataIndex: 'activo',
            options: ['Si', 'No']
        }]
    });

    // Defino el grid de Grupos
    this.ggrupos = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.stgrupos,
        plugins: _this.ftCmpgrupos,
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        autoExpandMin: 165,
        /*height:500,*/
        stripeRows: true,
        viewConfig: {
            forcefit: true
        },
        sm: _this.smgrupos,
        margins: '3 3 3 3',
        loadMask: {
            msg: 'Cargando grupos'
        },
        root_title: 'Registro de grupos',
        columns: [_this.smgrupos,
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idgrupo'
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idusuariocrea'
            }, {
                id: 'expandir',
                header: 'Denominación',
                renderer: MostrarImagenGrupo,
                dataIndex: 'dengrupo'
            }, {
                header: 'Activo',
                dataIndex: 'activo',
                renderer: MostrarImagenActivo,
                width: 100
            }
        ],
        listeners: {
            rowcontextmenu: function (grid, row, e) {

            },
            rowdblclick: function () {
            }
        },
        bbar: _this.ptbggrupo,
        tbar: [_this.btnAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar, ' ',
            _this.btnActivar, ' ', _this.btnDesactivar, ' ', _this.btnLimpiar, '->', _this.btnAyuda]
    });
    _this.pUsuario = new Ext.Panel({
        layout: 'fit',
        items: [_this.ggrupos/*,GpUsuarios*/],
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, '-', _this.btnModificar, '-', _this.btnEliminar, '-',
            _this.btnActivar, '-', _this.btnDesactivar, '-', _this.btnLimpiar, '->', _this.btnAyuda],
    });
    //panel donde muestro el grid de grupos
   /* this.PanPrincipal = new Ext.Window({
        layout: 'fit',
        maximized: true,
        closable: false,
        noTitle:true,
        // items: [_this.ggrupos/!*,GpUsuarios*!/]
        items: [_this.pUsuario]
    });
    this.PanPrincipal.show();*/

    this.winPrincipal = new Ext.Window({
        layout: 'fit',
        maximized: true,
        closable: false,
        // items: [_this.ggrupos/*,GpUsuarios*/]
        items: [_this.pUsuario]
    });
    //funcion donde se procede a cargar la plantilla
    this.CargarCmpGrupo = function () {
        if (opcionesConfig.tipoComponente == 'panel') {
            _this.winPrincipal.show();
            //return _this.PanPrincipal;
        }
    };

    //funcion para actualizar el estado de la barra de herramientas
    this.ActualizarEstadoBarraHerramientas = function () {
        _this.arrayidgrupos = [];
        _this.arraygruposseleccionados = [];
        _this.btnModificar.disable();
        _this.btnEliminar.disable();
        _this.btnActivar.disable();
        _this.btnDesactivar.disable();
        _this.btnAlias.disable();
        _this.permitirmodificar = 0;
        _this.permitireliminar = 0;
        _this.permitiractivar = 0;
        _this.permitirdesactivar = 0;
        if (_this.smgrupos.hasSelection()) {
            var arrayrecords = _this.smgrupos.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                var puedemodificar = 1;
                var puedeeliminar = 1;
                var todosdesactivados = 0;
                var todosactivados = 1;
                for (var i = 0; i < arrayrecords.length; i++) {
                    if (arrayrecords[i].data.modificar == 0
                        || arrayrecords[i].data.tipo == 'usuario') {
                        puedemodificar = 0;
                    }
                    if (arrayrecords[i].data.eliminar == 0
                        || arrayrecords[i].data.tipo == 'usuario') {
                        puedeeliminar = 0;
                    }
                    if (arrayrecords[i].data.activo == 1
                        || arrayrecords[i].data.tipo == 'usuario') {
                        todosdesactivados = 1;
                    }
                    if (arrayrecords[i].data.activo == 0
                        || arrayrecords[i].data.tipo == 'usuario') {
                        todosactivados = 0;
                    }
                    if ((arrayrecords[i].data.tipo == 'estructura'
                        || arrayrecords[i].data.tipo == 'usuario')
                        && arrayrecords[i].data._is_leaf) {
                        puedemodificar = 0;
                        puedeeliminar = 0;
                        todosdesactivados = 1;
                        todosactivados = 0;
                    }
                    _this.arrayidgrupos[i] = arrayrecords[i].data.idgrupo;
                    var gruposeleccionado = {};
                    gruposeleccionado = {
                        idgrupo: arrayrecords[i].data.idgrupo,
                        denominacion: arrayrecords[i].data.denominacion,
                        autorelemento: arrayrecords[i].data.nombreautor,
                        idautorelemento: arrayrecords[i].data.idusuariocrea
                    };
                    _this.arraygruposseleccionados.push(gruposeleccionado);
                }
                if (puedemodificar == 1 && totalrecords == 1) {
                    _this.btnModificar.enable();
                    _this.permitirmodificar = 1;
                }
                if (puedeeliminar == 1) {
                    _this.btnEliminar.enable();
                    _this.permitireliminar = 1;
                }
                if (todosdesactivados == 0) {
                    _this.btnActivar.enable();
                }
                if (todosactivados == 1) {
                    _this.btnDesactivar.enable();
                }
                if (totalrecords == 1) {
                    _this.btnAlias.enable();
                }
            }
        }
    };

    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    /*this.PostAccionesGestionar = function(mensaje, accion)
     {
     switch (mensaje) {
     case 0:
     _this.stgrupos.reload({
     params: {
     anode: null
     }
     });
     break;
     case 1:
     var rec = _this.stgrupos.getById(_this.arrayidgrupos[0]);
     if (accion == 'Adicionar') {
     var start = 0;
     if (_this.ptbggrupo.getLastStart() > 0) {
     start = _this.ptbggrupo.getLastStart();
     }
     _this.stgrupos.reload({
     params: {
     anode: null
     // start: start
     }
     });
     }
     if (accion == 'Modificar') {
     var start = 0;
     _this.stgrupos.reload({
     params: {
     anode: null
     //start: start
     }
     });
     }
     if (accion == 'Eliminar') {
     _this.smgrupos.clearSelections();
     var start = 0;
     _this.stgrupos.reload({
     params: {
     anode: null
     //start: start
     }
     });
     }
     if (accion == 'DesAct') {
     var start = 0;
     _this.stgrupos.reload({
     params: {
     anode: null
     //start: start
     }
     });
     }
     break;
     default:
     var start = 0;
     _this.stgrupos.reload({
     params: {
     anode: null
     //start: start
     }
     });
     }
     }*/

    this.PostAccionesGestionar = function (mensaje, accion) {
        switch (mensaje) {
            case 0:
                _this.PaginaActual(null);
                break;
            case 1:
                if (accion == 'Adicionar' || accion == 'Aplicar-Cerrar') _this.UltimaPagina();
                else if (accion == 'Eliminar') {
                    if (accion == 'Eliminar' && _this.start != 0)_this.posteliminar = true;
                    _this.PaginaActual(null);
                }
                else if (accion == 'DesAct' || accion == 'Modificar') _this.PaginaActual(null);

                break;
            default:
                _this.PaginaActual(null);
        }
    };

    //Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
    this.PaginaActual = function (anode) {
        _this.smgrupos.clearSelections();
        _this.start = (_this.ptbggrupo.getPageData().activePage - 1) * (_this.ptbggrupo.cbPageSize.getValue());
        _this.stgrupos.reload({
            params: {
                anode: anode,
                start: _this.start
            },
            callback: function () {
                if (_this.stgrupos.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.ptbggrupo.cbPageSize.getValue();
                    _this.stgrupos.reload({
                        params: {
                            anode: anode,
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    this.UltimaPagina = function () {
        _this.smgrupos.clearSelections();
        var numentero = Math.floor(_this.stgrupos.getTotalCount() / _this.ptbggrupo.cbPageSize.getValue());
        _this.start = numentero * _this.ptbggrupo.cbPageSize.getValue();
        _this.stgrupos.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    //funcion para cambiarle el titulo al grid de Grupos cuando filtre    
    this.changeTitleGrupos = function () {
        /*var filtrado_por = "";
         var sep = "/";
         if (_this.ftCmpPlan.getFiltrosActivos() == undefined || _this.ftCmpPlan.getFiltrosActivos().length == 0) {
         _this.WinPrincipal.setTitle('Registro de planes');
         } else {
         for (i = 0; i < _this.ftCmpPlan.getFiltrosActivos().length; i++) {
         var aux = "";
         if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "denominacion") {
         aux = 'Denominaci&oacute;n';
         } else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "idelemento") {
         aux = 'CAR';
         } else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "fechainicio") {
         aux ='Fecha de Inicio' ;
         } else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "fechafin") {
         aux = 'Fecha de Fin';
         } else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "nombreautor") {
         aux = 'Autor';
         } else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "textocumplimiento") {
         aux = 'Estado de cumplimiento';
         } else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "nombreestadoaprob") {
         aux ='Estado de aprobaci&oacute;n';
         } else if (_this.ftCmpPlan.getFiltrosActivos()[i].dataIndex == "gradocumplimiento") {
         aux ='Porciento de cumplimiento';
         } else {
         aux = 'Observ.';
         }
         if (i == _this.ftCmpPlan.getFiltrosActivos().length - 1) {
         sep = "";
         }
         filtrado_por += aux + sep;
         }
         _this.WinPrincipal.setTitle('Registro de planes <i>- Filtrado por: ' + filtrado_por + '</i>'); 
         filtrado_por = "";*/
        //}
    };

    //funcion para mostrar el icono de desactivado o activado
    function MostrarImagenActivo(valor) {
        switch (valor) {
            case '0':
                return '<center><span class="icondistra-jabber sipac-grisclaro"></span></center>';
                break;
            case '1':
                return '<center><span class="icondistra-jabber sipac-amarilla"></span></center>';
                break;
            default:
                return '<center><span>------</span></center>';
        }
    }

    //funcion para mostrar la imagen del grupo o usuario
    function MostrarImagenGrupo(valor, e, record) {
        // imagen = '<span class="icondistra-rolesygrupos sipac-azul">' + ' ' + valor + '</span>';
        // var arraycadena = valor.split('&');
        // if (arraycadena[1] == 'usuario') {
        //     imagen = '<span class="icondistra-usuario sipac-azul">' + ' ' + arraycadena[0] + '</span>';
        // }
        // if (arraycadena[1] == 'estructura') {
        //     imagen = '<span><img src=' + record.data.icono + ' height="15" width="15">' + ' ' + arraycadena[0] + '</span>';
        // }
        // if (arraycadena[1] == undefined) {
        //     imagen = '<span class="icondistra-usuario sipac-azul">' + ' ' + arraycadena[0] + '</span>';
        // }
        // return imagen;

        imagen = '<span class="icondistra-rolesygrupos sipac-azul">' + ' ' + valor + '</span>';
        var arraycadena = valor.split('&');
        switch(arraycadena[1]) {
            case 'usuario':
                imagen = '<span class="icondistra-usuario sipac-azul">' + ' ' + arraycadena[0] + '</span>';
                return imagen;
                break;
            case 'estructura':
                imagen = '<span><img src=' + record.data.icono + ' height="15" width="15">' + ' ' + arraycadena[0] + '</span>';
                return imagen;
                break;
            case undefined:
                imagen = '<span class="icondistra-usuario sipac-azul">' + ' ' + arraycadena[0] + '</span>';
                return imagen;
                break;
            default:
                return imagen;
        }
    }

    if (opcionesConfig.tipoComponente == "integracion") {
        this.panelPrincipal = new Ext.Panel({
            layout: 'fit',
            width: 1000,
            height: 510,
            closable: opcionesConfig.cerrarPestaña,
            closeAction: 'destroy',
            id: opcionesConfig.idPanelPincipal,
            //region: 'center',
            modal: true,
            items: [_this.pUsuario]
        });

        var paneles = {
            panelGrupos: _this.panelPrincipal,
            stGrupos: _this.stgrupos
        };
        return paneles;
    }

};