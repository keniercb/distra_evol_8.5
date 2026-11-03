Utilidades.Cmp.Cmpgestionarincidencias = function (opcionesConfig) {
    var _this = this;
    var j = 0;
    Ext.Ajax.timeout = 1000000000;
    this.url = '/planificacion/pdo/plan/index.php/cmpgestionarincidencias/';
    this.start = 0;
    this.flagIncAsociadas = true;
    this.flagIncNoAsociadas = true;
    this.arrayIniIncAsoc = [];
    this.arrayIniIncNoAsoc = [];
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    this.objCrudIncidencias = new Utilidades.Cmp.Cmpcrudgestionarincidencias();

    //objeto CRUD-ACTIVIDADES inicializado
    //this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();

    //objeto del componente "clasificador de involucrados"
    //this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();
    //variables     

    this.btnAdicionarIncidencias = new Ext.Button({
        handler: function () {
            _this.objCrudIncidencias.CrearWinFormIncidencias(_this.PostAccionesGestionar, 'Adicionar');
        },
        hidden: opcionesConfig.hiddenAdd,
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar incidencias',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificarIncidencias = new Ext.Button({
        handler: function () {
            _this.VerificarIncidencias();
            //_this.objCrudIncidencias.CrearWinFormIncidencias(_this.PostAccionesGestionar,'Modificar');
        },
        hidden: opcionesConfig.noUsarModificar,
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar incidencia',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });

    this.btnEliminarIncidencias = new Ext.Button({
        handler: function () {
            _this.EliminarIncidencias();
        },
        hidden: opcionesConfig.noUsarEliminar,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar incidencias',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnLimpiarIncidencias = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        hidden: opcionesConfig.noUsarLimpiar,
        iconCls: 'limpiar',
        handler: function () {
            _this.filtrosIncidencia.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnPublicarTodasInc = new Ext.Button({
        id: 'btnPublicarIncidencias',
        tooltip: 'Publicar todas las incidencias',
        hidden: opcionesConfig.noUsarPublicacion,
        iconCls: 'icondistra-publicar sipac-verde',
        handler: function () {
            _this.objCrudIncidencias.CrearVentanaPublicarIncidencias(
                true, _this.stIncidencias, _this.smIncidencias, _this.PostAccionesGestionar);
            _this.stIncidencias.reload;
        },
        key: {
            ctrl: true,
            key: 'P'
        },
        scope: this
    });
    this.btnDespublicarTodasInc = new Ext.Button({
        id: 'btnDespublicartodos',
        tooltip: 'Despublicar todas las incidencias',
        hidden: opcionesConfig.noUsarPublicacion,
        iconCls: 'icondistra-publicar sipac-roja',
        handler: function () {
            _this.objCrudIncidencias.DespublicarTodos(
                _this.stIncidencias, _this.PostAccionesGestionar, _this.smIncidencias, true);
            _this.stIncidencias.reload;
        },
        key: {
            shift: true,
            key: 'P'
        },
        scope: this
    });
    ////*****
    this.btnPublicarInc = new Ext.Button({
        id: 'btnPublicarInc',
        tooltip: 'Publicar incidencia',
        hidden: opcionesConfig.noUsarPublicacion,
        disabled: true,
        iconCls: 'icondistra-publicar',
        handler: function () {
            _this.objCrudIncidencias.CrearVentanaPublicarIncidencias(
                true, _this.stIncidencias, _this.smIncidencias, _this.PostAccionesGestionar);
            _this.stIncidencias.reload;
        },
        key: {
            alt: true,
            key: 'Y'
        },
        scope: this
    });
    this.btnDespublicarInc = new Ext.Button({
        id: 'btnDespublicarInc',
        tooltip: 'Despublicar incidencia',
        hidden: opcionesConfig.noUsarPublicacion,
        iconCls: 'icondistra-publicar sipac-roja',
        disabled: true,
        handler: function () {
            _this.objCrudIncidencias.DespublicarTodos(
                _this.stIncidencias, _this.PostAccionesGestionar, _this.smIncidencias, true);
            _this.stIncidencias.reload;
        },
        key: {
            ctrl: true,
            key: 'Y'
        },
        scope: this
    });
    this.btnEditarPublicacion = new Ext.Button({
        id: 'btnEditarPublicacion',
        tooltip: 'Editar publicidad de la incidencia',
        hidden: opcionesConfig.noUsarPublicacion,
        disabled: true,
        iconCls: 'icondistra-editar',
        handler: function () {
            _this.objCrudIncidencias.CrearVentanaPublicarIncidencias(
                false, _this.stIncidencias, _this.smIncidencias, _this.PostAccionesGestionar);
            _this.stIncidencias.reload;
        },
        key: {
            ctrl: true,
            key: 'E'
        },
        scope: this
    });
    ///*****
    this.btnActivarIncidencia = new Ext.Button({
        handler: function () {
            _this.confirmarDesActivar(1);
        },
        iconCls: 'habilitar',
        id: "btnActivarIncidencia",
        disabled: true,
        tooltip: 'Activar incidencias',
        key: {
            alt: true,
            key: 'X'
        },
        scope: this
    });
    this.btnDesactivarIncidencia = new Ext.Button({
        handler: function () {
            _this.confirmarDesActivar(0);
        },
        iconCls: 'deshabilitar',
        id: "btnDesactivarIncidencia",
        disabled: true,
        tooltip: 'Desactivar incidencias',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });

    this.btnAyudaIncidencias = new Ext.Button({
        id: 'btnAyudaIncidencias',
        text: 'Ayuda',
        hidden: opcionesConfig.noUsarAyuda,
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });

    this.filtrosIncidencia = new Ext.grid.GridFilters({
        filters: [{
            type: 'numeric',
            dataIndex: 'cantidaddesviaciones',
            xtype: 'numberfield',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskReregex: /^([0-9]+ ?[0-9]*)+$/
        }, {
            type: 'string',
            dataIndex: 'denelemento'
        }, {
            type: 'listado',
            dataIndex: 'dennomenclador',
            idcombo: 'idcbftestado',
            urlcb: _this.url + 'cargartiposincidencias',
            idstore: 'idstorenomenclador',
            valueFieldcb: 'idnomenclador',
            displayFieldcb: 'dennomenclador'
        }, {
            type: 'list',
            dataIndex: 'impacto',
            options: ['Bajo', 'Medio', 'Alto']
        }, {
            type: 'list',
            dataIndex: 'publico',
            options: ['Si', 'No']
        }, {
            type: 'list',
            dataIndex: 'activo',
            options: ['Si', 'No']
        }]
    });

    this.stIncidencias = new Ext.data.Store({
        url: _this.url + 'cargarincidencias',
        autoLoad: opcionesConfig.loadstore,
        reader: new Ext.data.JsonReader({
            /*id: 'id',
             root: 'data',
             totalProperty: 'total'*/
            id: 'idincidencia',
            totalProperty: 'total',
            root: 'campos'
        }, [{
            name: 'denelemento'
        }, {
            name: 'idincidencia'
        }, {
            name: 'dennomenclador'
        }, {
            name: 'asociados'
        }, {
            name: 'impacto'
        }, {
            name: 'publico'
        }, {
            name: 'activo'
        }, {
            name: 'cantdocafectados'
        }, {
            name: 'nombreusuario'
        }, {
            name: 'cantidaddesviaciones'
        }]),
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando...');
                s.baseParams.start = _this.start;
            },
            load: function (st, rd) {
                st.each(function (record) {
				if (Ext.get(record.data.idincidencia)) {
					Ext.get(record.data.idincidencia).addListener('click', _this.CrearWinAsociarIncidenciaaDesviaciones, this, {
                        stopPropagation: true,
                        normalized: true,
                        preventDefault: true,
                        store: st,
                        record: record
                    });
				}                    
                });
                _this.BarraProgreso.hide();
                if (st.getCount() == 0) {
                    if (_this.filtrosIncidencia.getFiltrosActivos() == undefined || _this.filtrosIncidencia.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');

                    }
                }
                if (st.lastOptions.params.accion == 'noasociadas' && _this.flagIncNoAsociadas) {
                    _this.flagIncNoAsociadas = false;
                    _this.arrayIniIncNoAsoc = rd;
                }
                if (st.lastOptions.params.accion == 'asociadas' && _this.flagIncAsociadas) {
                    _this.flagIncAsociadas = false;
                    _this.arrayIniIncAsoc = rd;
                }
            }
        }
    });

    this.smIncidencias = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, ri, record) {
                _this.ActualizarEstadoBarraHerramientas();
            },
            rowdeselect: function (sm, ri, record) {
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });
    this.cmIncidencias = [
        _this.smIncidencias,
        {
            header: "CAR",
            width: 150,
            dataIndex: 'idincidencia',
            sortable: true,
            hidden: true
        }, {
            header: "Denominaci&oacute;n",
            id: 'expandir',
            dataIndex: 'denelemento',
            width: 605,
            sortable: true,
            renderer: MostrarImagenTipoElemento
        }, {
            header: "Tipo de incidencias",
            dataIndex: 'dennomenclador',
            width: 150,
            sortable: true
        }, {
            header: "Impacto",
            dataIndex: 'impacto',
            width: 85,
            sortable: true,
            renderer: MostrarImpacto
        }, {
            header: "P&uacute;blico",
            dataIndex: 'publico',
            width: 85,
            sortable: true,
            renderer: MostrarImagenT
        }, {
            header: "Activo",
            dataIndex: 'activo',
            width: 85,
            sortable: true,
            renderer: MostrarImagenActivo
        }, {
            header: "Desviaci&oacute;n generada",
            dataIndex: 'cantidaddesviaciones',
            width: 150,
            sortable: true,
            renderer: MostrarImagenadicionar
        }, {
            header: "Autor",
            dataIndex: 'nombreusuario',
            width: 130,
            sortable: true
        }
    ];

    this.paginadoIncidencias = new Ext.PagingToolbar({
        id: 'paginadoIncidencias',
        pageSize: 1000,
        store: _this.stIncidencias,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });

    this.gdIncidencias = new Ext.grid.GridPanel({
        frame: true,
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        plugins: _this.filtrosIncidencia,
        autoExpandColumn: 'expandir',
        autoExpandMax: 565,
        store: _this.stIncidencias,
        sm: _this.smIncidencias,
        columns: _this.cmIncidencias,
        width: 715,
        bbar: (!opcionesConfig.noUsarPaginado) ? _this.paginadoIncidencias : null,
        listeners: {
            rowcontextmenu: function (t, ri, event) {
                _this.smIncidencias.selectRow(ri);
                var menunom = new Ext.menu.Menu({
                    id: 'menunom',
                    items: [{
                        handler: function () {
                            _this.VerificarIncidencias();
                        },
                        text: 'Modificar incidencia',
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        tooltip: 'Modificar incidencia'
                    }, {
                        handler: function () {
                            _this.EliminarIncidencias();
                        },
                        text: 'Eliminar incidencia',
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar incidencias'
                    }]
                });
                if (_this.smIncidencias.getSelections()[0].data.publico == 0) {
                    menunom.addMenuItem({
                        text: 'Publicar incidencia',
                        itemCls: 'x-menu-item icondistra-publicar',
                        iconCls: 'imagen-none',
                        tooltip: 'Publicar incidencia',
                        handler: function () {
                            _this.objCrudIncidencias.CrearVentanaPublicarIncidencias(
                                false, _this.stIncidencias, _this.smIncidencias, _this.PostAccionesGestionar);
                            _this.stIncidencias.reload;
                        }
                    });
                } else {
                    menunom.addMenuItem({
                        text: 'Despublicar incidencia',
                        //itemCls: 'x-menu-item icondistra-ptr',
                        itemCls: 'x-menu-item icondistra-publicar sipac-roja',
                        iconCls: 'imagen-none',
                        tooltip: 'Eliminar publicidad de la incidencia',
                        hidden: opcionesConfig.noUsarMenuGrid,
                        handler: function () {
                            _this.objCrudIncidencias.DespublicarTodos(
                                _this.stIncidencias, _this.PostAccionesGestionar, _this.smIncidencias, false);
                            _this.stIncidencias.reload;
                        }
                    });
                }
                if (_this.smIncidencias.getSelections()[0].data.activo == 0) {
                    menunom.addMenuItem({
                        handler: function () {
                            _this.confirmarDesActivar(1);
                        },
                        text: 'Activar incidencia',
                        itemCls: 'x-menu-item icondistra-habilitar',
                        iconCls: 'imagen-none',
                        id: "btnActivarIncidencia",
                        tooltip: 'Activar incidencias'
                    });
                } else {
                    menunom.addMenuItem({
                        handler: function () {
                            _this.confirmarDesActivar(0);
                        },
                        text: 'Desactivar incidencia',
                        itemCls: 'x-menu-item icondistra-deshabilitar',
                        iconCls: 'imagen-none',
                        id: "btnDesactivarIncidencia",
                        tooltip: 'Desactivar incidencias'
                    });
                }
                if (_this.smIncidencias.getSelections().length == 1) {
                    //mostrar menu
                    event.stopEvent();
                    var xy = event.getXY();
                    _this.gdIncidencias.contextMenu = menunom;
                    _this.gdIncidencias.contextMenu.showAt(xy);
                }
            },
            rowdblclick: function (t, ri, event) {
                _this.VerificarIncidencias();
            }
        }
    });

    this.PanelGestIncidencias = new Ext.Panel({
        layout: 'fit',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionarIncidencias,
            _this.btnModificarIncidencias, _this.btnEliminarIncidencias,
            _this.btnActivarIncidencia, _this.btnDesactivarIncidencia,
            _this.btnPublicarInc, _this.btnDespublicarInc,
            _this.btnLimpiarIncidencias, _this.btnAyudaIncidencias],

        tbar: [_this.btnAdicionarIncidencias, ' ', _this.btnModificarIncidencias, ' ', _this.btnEliminarIncidencias, ' ',
            _this.btnActivarIncidencia, ' ', _this.btnDesactivarIncidencia, ' ',
            _this.btnPublicarInc, ' ', _this.btnDespublicarInc, ' ',
            _this.btnLimpiarIncidencias, '->', _this.btnAyudaIncidencias],
        header: true,
        noTitle: (opcionesConfig.hasOwnProperty('noTitle')) ? opcionesConfig.noTitle : true,
        items: _this.gdIncidencias
    });

    this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        closable: false,
        graggable: false,
        maximized: true,
        noTitle: true,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.PanelGestIncidencias]
    });

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpIncidencias = function () {
        _this.WinPrincipal.show();
    };
    this.ObtenerPanelIncidencia = function () {
        return _this.PanelGestIncidencias;
    };
    this.ObtenerStore = function () {
        return _this.stIncidencias;
    };
    this.ObtenerSelectionModel = function () {
        return _this.smIncidencias;
    };
    this.ObtenerGridPanel = function () {
        return _this.gdIncidencias;
    };

    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    this.PostAccionesGestionar = function (mensaje, accion) {
        switch (accion) {
            case 0:
                _this.stIncidencias.reload();
                break;
            case 1:
                _this.stIncidencias.reload();
                break;
            case 2:
                _this.stIncidencias.reload();
                _this.ActualizarEstadoBarraHerramientas();
                break;
            case 3:
                _this.smIncidencias.clearSelections();
                _this.stIncidencias.reload();
                _this.ActualizarEstadoBarraHerramientas();
                break;
        }
    };

    this.AccionesPostEjecutar = function () {

    };
    this.ActualizarEstadoBarraHerramientas = function () {
        _this.btnModificarIncidencias.disable();
        _this.btnEliminarIncidencias.disable();
        _this.btnDesactivarIncidencia.disable();
        _this.btnActivarIncidencia.disable();
        _this.btnPublicarInc.disable();
        _this.btnEditarPublicacion.disable();
        _this.btnDespublicarInc.disable();
        if (_this.smIncidencias.hasSelection()) {
            var arrayrecords = _this.smIncidencias.getSelections();
            var totalrecords = arrayrecords.length;
            var contactivo = 0;
            var contdesactivo = 0;
            for (var i = 0; i < totalrecords; i++) {
                if (arrayrecords[i].data.activo == 1) {
                    contactivo++;
                } else {
                    contdesactivo++;
                }
            }
            if (totalrecords > 0 && totalrecords == 1) {
                _this.btnModificarIncidencias.enable();
                _this.btnEliminarIncidencias.enable();
                if (arrayrecords[0].data.activo == 1) {
                    _this.btnActivarIncidencia.disable();
                    _this.btnDesactivarIncidencia.enable();
                } else {
                    _this.btnActivarIncidencia.enable();
                    _this.btnDesactivarIncidencia.disable();
                }
                if (_this.smIncidencias.getSelections()[0].data.publico == 0) {
                    _this.btnPublicarInc.enable();
                } else {
                    _this.btnEditarPublicacion.enable();
                    _this.btnDespublicarInc.enable();
                }
            } else if (totalrecords > 1 && contactivo == totalrecords) {
                _this.btnModificarIncidencias.disable();
                _this.btnDesactivarIncidencia.enable();
                _this.btnActivarIncidencia.disable();
                _this.btnEliminarIncidencias.enable();

            } else if (totalrecords > 1 && contdesactivo == totalrecords) {
                _this.btnModificarIncidencias.disable();
                _this.btnDesactivarIncidencia.disable();
                _this.btnActivarIncidencia.enable();
                _this.btnEliminarIncidencias.enable();
            } else {
                _this.btnModificarIncidencias.disable();
                _this.btnDesactivarIncidencia.disable();
                _this.btnActivarIncidencia.disable();
                _this.btnEliminarIncidencias.enable();
            }

            if (totalrecords > 1) {
                if (arrayrecords[0].data.publico == 1) {
                    for (var i = 0; i < arrayrecords.length - 1; i++) {
                        if (arrayrecords[i].data.publico == arrayrecords[i + 1].data.publico) {
                            _this.btnPublicarInc.disable();
                            _this.btnDespublicarInc.enable();
                        } else {
                            _this.btnPublicarInc.disable();
                            _this.btnDespublicarInc.disable();
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < arrayrecords.length - 1; i++) {
                        if (arrayrecords[i].data.publico == arrayrecords[i + 1].data.publico) {
                            _this.btnPublicarInc.enable();
                            _this.btnDespublicarInc.disable();
                        } else {
                            _this.btnPublicarInc.disable();
                            _this.btnDespublicarInc.disable();
                            break;
                        }
                    }
                }
            }
        }
    };

    function MostrarImagenActivo(valor) {
        if (valor == 0) {
            return '<center><span class="icondistra-jabber sipac-grisclaro"></span></center>';
        } else {
            return '<center><span class="icondistra-jabber sipac-amarilla"></span></center>';
        }
    }

    function MostrarImagenT(val) {
        if (val == 0) {
            return ' ';
        }
        if (val > 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    function MostrarImpacto(val) {
        if (val == 1) {
            return ' Bajo';
        }
        if (val == 2) {
            return ' Medio';
        }
        if (val == 3) {
            return ' Alto';
        }
    }

    function MostrarImagenadicionar(valor, o, record) {
        var retorno = '<center><a href="#" id = "' + record.data.idincidencia + '" style="text-decoration:none" ><span class="icondistra-adicionar"></span></a>' + ' ' + valor + '</center>';
        return retorno;
    }

    this.EliminarIncidencias = function () {
        var arrayrecords = _this.smIncidencias.getSelections();
        var arrayIncidenciasAEliminar = [];
        if (arrayrecords.length > 0) {
            for (var i = 0; i < arrayrecords.length; i++) {
                arrayIncidenciasAEliminar[i] = arrayrecords[i].data.idincidencia;
            }
        }
        if (arrayrecords.length == 1) {
            msj = '¿Est&aacute; seguro que quiere eliminar la incidencia seleccionada?';
            mensajeMascara = 'Eliminando datos de la incidencia...';
        } else {
            msj = '¿Est&aacute; seguro que quiere eliminar las incidencias seleccionadas?';
            mensajeMascara = 'Eliminando datos de las incidencias...';
        }
        mostrarMensaje(2, msj, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajeMascara);
                Ext.Ajax.request({
                    url: 'eliminarincidencias',
                    params: {
                        arrayIdIncidencia: Ext.encode(arrayIncidenciasAEliminar)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            if (arrayrecords.length == 1) {
                                msje = 'La incidencia ha sido eliminada satisfactoriamente.';
                            } else {
                                msje = 'Las incidencias han sido eliminadas satisfactoriamente.';
                            }
                            mostrarMensaje(1, msje);
                            _this.PostAccionesGestionar('Eliminar', 2);
                        }
                    }
                });
            }
        });
    };
    this.confirmarDesActivar = function (valor) {
        var arrayrecords = _this.smIncidencias.getSelections();
        var arrayIncidenciasAActivar = [];
        var mensajeactivar;
        if (arrayrecords.length > 0) {
            for (var i = 0; i < arrayrecords.length; i++) {
                arrayIncidenciasAActivar[i] = arrayrecords[i].data.idincidencia;
            }
        }
        if (valor == 1) {
            if (arrayrecords.length == 1)
                mensajeactivar = '¿Est&aacute; seguro que quiere activar la incidencia seleccionada?';
            else
                mensajeactivar = '¿Est&aacute; seguro que quiere activar las incidencias seleccionadas?';
        } else {
            if (arrayrecords.length == 1)
                mensajeactivar = '¿Est&aacute; seguro que quiere desactivar la incidencia seleccionada?';
            else
                mensajeactivar = '¿Est&aacute; seguro que quiere desactivar las incidencias seleccionadas?';
        }
        mostrarMensaje(2, mensajeactivar, function (btnoprimido) {
            if (btnoprimido == 'ok') {

                Ext.Ajax.request({
                    url: 'desactivar',
                    params: {
                        arrayIdIncidencia: Ext.encode(arrayIncidenciasAActivar), activo: valor
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            _this.stIncidencias.reload();
                            if (valor == 0) {
                                if (arrayrecords.length == 1)
                                    mostrarMensaje(1, 'La incidencia ha sido desactivada satisfactoriamente.');
                                else
                                    mostrarMensaje(1, 'Las incidencias han sido desactivadas satisfactoriamente.');

                            } else {
                                if (arrayrecords.length == 1)
                                    mostrarMensaje(1, 'La incidencia ha sido activada satisfactoriamente.');
                                else
                                    mostrarMensaje(1, 'Las incidencias han sido activadas satisfactoriamente.');
                            }
                        }
                    }
                });
            }
        });
    }

    this.ObtenerDesviacionesAsociadasDadaIncidencia = function (record, storeAsociados) {
        Ext.Ajax.request({
            url: 'verificarincidencia',
            params: {
                idelemento: record.idincidencia
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                var arreglodesviacion = [];
                var arregloidhijo = [];
                arreglodesviacion = responseData.data[0]['desviacion'];

                for (var i = 0; i < arreglodesviacion.length; i++) {
                    arregloidhijo[i] = arreglodesviacion[i].idelementohijo;
                }
                //store de los no asociados
                var storeNoAsociados = _this.objCmpGestionarIncidenciasNoAsociadas.ObtenerStoreDesviaciones();
                storeNoAsociados.load({
                    params: {
                        idincidencia: record.idincidencia,
                        accion: 'noasociadas',
                        iddesviacion: Ext.encode(arregloidhijo)
                    }
                });
                //fin del store
                //store de los asociados
                var storeAsociados = _this.objCmpGestionarIncidenciasAsociadas.ObtenerStoreDesviaciones();
                storeAsociados.load({
                    params: {
                        idincidencia: record.idincidencia,
                        accion: 'asociadas',
                        iddesviacion: Ext.encode(arregloidhijo)
                    }
                });
                //fin del store
            }
        });
    }

    this.CrearWinAsociarIncidenciaaDesviaciones = function (event, elx, obx) {
        var record = obx.record.data;
        _this.objCmpGestionarIncidenciasNoAsociadas = new Utilidades.Cmp.Cmpgestionardesviaciones({
            noUsarModificar: false,
            noUsarEliminar: false,
            noUsarAdicionar: false,
            noUsarLimpiar: false,
            noUsarCerrarWinP: true,
            noUsarPaginado: false,
            singlemodoSeleccionGridDesviaciones: false,
            idcmp: 'local',
            noUsarPublicacion: false,
            noUsarMenuGrid: false,
            usarMensaje: false,
            noUsarAyuda: true,
            noTitle: false
        });
        _this.PanelIncidenciasNoAsociadas = _this.objCmpGestionarIncidenciasNoAsociadas.ObtenerPanelDesviaciones();
        _this.PanelIncidenciasNoAsociadas.setTitle('Registro de desviaciones sin asociar');
        _this.PanelIncidenciasNoAsociadas.region = 'west';
        _this.PanelIncidenciasNoAsociadas.setWidth(482);

        var smNoAsociados = _this.objCmpGestionarIncidenciasNoAsociadas.ObtenerSelectionModelDesviaciones();
        smNoAsociados.addListener('rowselect', _this.asociardesviacion, this);
        smNoAsociados.addListener('rowdeselect', _this.asociardesviacion, this);

        var storeNoAsociados = _this.objCmpGestionarIncidenciasNoAsociadas.ObtenerStoreDesviaciones();
        storeNoAsociados.load({
            params: {
                idincidencia: record.idincidencia,
                accion: 'noasociadas'
            }
        });

        _this.objCmpGestionarIncidenciasAsociadas = new Utilidades.Cmp.Cmpgestionardesviaciones({
            noUsarModificar: true,
            noUsarEliminar: true,
            noUsarAdicionar: true,
            noUsarLimpiar: false,
            noUsarCerrarWinP: true,
            noUsarPaginado: false,
            singlemodoSeleccionGridDesviaciones: false,
            idcmp: 'local',
            noUsarPublicacion: true,
            noUsarAyuda: true,
            noUsarMenuGrid: false,
            usarMensaje: false,
            noTitle: false
        });

        _this.PanelIncidenciasAsociadas = _this.objCmpGestionarIncidenciasAsociadas.ObtenerPanelDesviaciones();
        _this.PanelIncidenciasAsociadas.setTitle('Registro de desviaciones asociadas');
        _this.PanelIncidenciasAsociadas.region = 'east';
        _this.PanelIncidenciasAsociadas.setWidth(470);

        //_this.ObtenerDesviacionesAsociadasDadaIncidencia(record);
        var selectionmodelasociados = _this.objCmpGestionarIncidenciasAsociadas.ObtenerSelectionModelDesviaciones();

        selectionmodelasociados.addListener('rowselect', _this.desasociardesviacion, this);
        selectionmodelasociados.addListener('rowdeselect', _this.desasociardesviacion, this);

        var storeAsociados = _this.objCmpGestionarIncidenciasAsociadas.ObtenerStoreDesviaciones();
        storeAsociados.load({
            params: {
                idincidencia: record.idincidencia,
                accion: 'asociadas'
            }
        });

        _this.btnAsociar = new Ext.Button({
            tooltip: 'Asociar desviación(es)',
            disabled: true,
            iconCls: 'siguiente',
            //icon: perfil.dirImg + 'siguiente.png',
            listeners: {},
            handler: function () {
                _this.AsociarIncidencia(smNoAsociados, storeNoAsociados, storeAsociados);
            }
        });
        _this.btnDesAsociar = new Ext.Button({
            tooltip: 'Desasociar desviación(es)',
            disabled: true,
            iconCls: 'anterior',
            //icon: perfil.dirImg + 'anterior.png',
            handler: function () {
                _this.DesasociarIncidencia(selectionmodelasociados, storeNoAsociados, storeAsociados);
            }
        });
        _this.PanelAsociar = new Ext.Panel({
            region: 'center',
            bodyStyle: 'padding:150px 10px',
            width: 50,
            height: 20,
            items: [_this.btnAsociar, _this.btnDesAsociar]
        });

        _this.WinAsociarDesvAIncidencia = new Ext.Window({
            title: '<center>Gestionar asociación desviación - incidencia </center>',
            layout: 'border',
            closable: true,
            draggable: true,
            maximized: false,
            modal: true,
            width: 1010,
            height: 400,
            resizable: false,
            constrain: true,
            items: [_this.PanelIncidenciasNoAsociadas, _this.PanelAsociar, _this.PanelIncidenciasAsociadas],
            buttons: [
                new Ext.Button({
                    //icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar datos',
                    handler: function () {
                        _this.WinAsociarDesvAIncidencia.destroy();
                    }
                }),
                new Ext.Button({
                    //icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    id: 'btnGuardar',
                    text: 'Aceptar',
                    disabled: true,
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        _this.InsertarAsociacion(storeAsociados, record.idincidencia);
                    }
                })
            ],
            listeners: {
                destroy: function (win) {
                    _this.objCrudIncidencias.flagDesvAsociadas = true;
                    _this.objCrudIncidencias.flagDesvNoAsociadas = true;
                }
            }
        });
        _this.WinAsociarDesvAIncidencia.show();
    }

    this.asociardesviacion = function (sm, rowIndex, record) {
        var arrayrecords = sm.getSelections();
        if (arrayrecords.length == 0) {
            _this.btnAsociar.disable();
        } else
            _this.btnAsociar.enable();
    }
    this.desasociardesviacion = function (sm, rowIndex, record) {
        var arrayrecords = sm.getSelections();
        if (arrayrecords.length == 0) {
            _this.btnDesAsociar.disable();
        } else
            _this.btnDesAsociar.enable();
    }
    this.AsociarIncidencia = function (smNoAsociados, storeNoAsociados, storeAsociados) {
        var stAsociadosIni = _this.objCmpGestionarIncidenciasAsociadas.arrayIniDesvAsoc;
        var stAsociados = storeAsociados.data.items;
        if (smNoAsociados.hasSelection()) {
            var arrayIncidenciaAsociar = smNoAsociados.getSelections();
            if (arrayIncidenciaAsociar.length > 0) {

                for (var i = 0; i < arrayIncidenciaAsociar.length; i++) {
                    storeNoAsociados.remove(arrayIncidenciaAsociar[i]);
                }
                storeAsociados.add(arrayIncidenciaAsociar);
                if (arrayIncidenciaAsociar.length == 1) {
                    var mensaje = 'La desviación ha sido asociada satisfactoriamente.';
                } else {
                    mensaje = 'Las desviaciones han sido asociadas satisfactoriamente.';
                }
                mostrarMensaje(2, mensaje);
            }
            var compararAsociados = _this.compararArray(stAsociadosIni, stAsociados);
            (compararAsociados) ? Ext.getCmp('btnGuardar').disable() : Ext.getCmp('btnGuardar').enable();
        }
        smNoAsociados.clearSelections();
        _this.btnAsociar.disable();
    }
    this.DesasociarIncidencia = function (smAsociados, storeNoAsociados, storeAsociados) {
        var stNoAsociadosIni = _this.objCmpGestionarIncidenciasNoAsociadas.arrayIniDesvNoAsoc;
        var stNoAsociados = storeNoAsociados.data.items;
        if (smAsociados.hasSelection()) {
            var arrayIncidenciaDesasociar = smAsociados.getSelections();
            if (arrayIncidenciaDesasociar.length > 0) {
                for (var i = 0; i < arrayIncidenciaDesasociar.length; i++) {
                    storeAsociados.remove(arrayIncidenciaDesasociar[i]);
                }
                storeNoAsociados.add(arrayIncidenciaDesasociar);
                if (arrayIncidenciaDesasociar.length == 1) {
                    var mensaje = 'La desviación ha sido desasociada satisfactoriamente.';
                } else mensaje = 'Las desviaciones han sido desasociadas satisfactoriamente.';

                mostrarMensaje(2, mensaje);
            }
            var compararNoAsociados = _this.compararArray(stNoAsociadosIni, stNoAsociados);
            (compararNoAsociados) ? Ext.getCmp('btnGuardar').disable() : Ext.getCmp('btnGuardar').enable();
        }
        smAsociados.clearSelections();
        _this.btnDesAsociar.disable();
    }
    this.InsertarAsociacion = function (storeAsociados, idincidencia) {
        var array_iddesviacion = [];

        if (storeAsociados.getCount() != 0) {
            for (var i = 0; i < storeAsociados.getCount(); i++) {
                array_iddesviacion.push(storeAsociados.getAt(i).data.idelemento);
            }
        }
        var mensajeMascara = 'Asociando incidencias a desviaci&oacuten';
        _this.BarraProgreso.show(mensajeMascara);
        Ext.Ajax.request({
            url: 'insertarrelacion',
            params: {
                desviacion: Ext.encode(array_iddesviacion),
                idincidencia: idincidencia
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                var mensaje = '';
                _this.BarraProgreso.hide();
                if (responseData.mensaje == 1) {
                    if (array_iddesviacion.length == 1) {
                        mensaje = 'La asociación ha sido gestionada satisfactoriamente.';
                    } else {
                        mensaje = 'Las asociaciones han sido gestionadas satisfactoriamente.';
                    }
                    mostrarMensaje(2, mensaje);
                    _this.PostAccionesGestionar('', 0);
                    _this.WinAsociarDesvAIncidencia.destroy();
                }
            }
        });
    };

    this.VerificarIncidencias = function () {
        Ext.Ajax.request({
            url: 'verificarincidencia',
            params: {
                idelemento: _this.smIncidencias.getSelections()[0].data.idincidencia
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                _this.objCrudIncidencias.CrearWinFormIncidencias(_this.PostAccionesGestionar, 'Modificar', responseData.data[0], _this.smIncidencias.getSelections()[0].data.idincidencia);
            }
        });
    };

    //funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElemento(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        return '<span class="icondistra-incidencia sipac-azul">' + ' ' + valor + '</span>';
    }

    this.compararArray = function (arrayIni, arrayTemp) {
        var contador = 0;
        var parada = 0;
        if (arrayIni.length == arrayTemp.length) {
            for (var i = 0; i < arrayIni.length; i++) {
                for (var j = 0; j < arrayTemp.length; j++) {
                    if (arrayIni[i].id == arrayTemp[j].id) {
                        contador++;
                        break;
                    } else
                        parada++;
                }
                if (parada == arrayTemp.length) {
                    return false;
                    break;
                }
                else
                    parada = 0;
            }
            if (contador == arrayIni.length)
                return true;
        } else
            return false;
    };

};



