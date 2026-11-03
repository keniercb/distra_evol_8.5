Utilidades.Cmp.Cmpasignarentidades = function () {
    var _this = this;
    var pgactual = 0;
    this.BarraProgreso = new BarraEstado();
    //objeto CRUD-ARC inicializado
    this.objCrudAsigEnt = new Utilidades.Cmp.Cmpcrudasignarentidades();

    //botones para asignar entidades a usuarios
    this.btnAdicionar = new Ext.Button({
        handler: function () {
            _this.objCrudAsigEnt.CrearVentanaCrudAsignar(_this.PostAccionesGestionar, null, null, 'add');
        },
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar relación',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificar = new Ext.Button({
        handler: function () {
            _this.objCrudAsigEnt.CrearVentanaCrudAsignar(_this.PostAccionesGestionar, _this.smRelaciones.getSelected().data.idusuario, _this.smRelaciones.getSelected().data.idestructura, 'mod');
        },
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar relación',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminar = new Ext.Button({
        handler: function () {
            _this.EliminarAsoc();
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar relación',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaAsignarEntidades',
        text: 'Ayuda',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });

    this.btnActivarRelacion = new Ext.Button({
        handler: function () {
            _this.activarDesactivarRelacion('activar');

        },
        iconCls: 'habilitar',
        id: "btnActivarRelacion",
        disabled: true,
        tooltip: 'Activar relación',
        key: {
            alt: true,
            key: 'X'
        },
        scope: this
    });
    this.btnDesctivarRelacion = new Ext.Button({
        handler: function () {
            _this.activarDesactivarRelacion('desactivar');
        },
        iconCls: 'deshabilitar',
        id: "btnDesctivarRelacion",
        disabled: true,
        tooltip: 'Desactivar relación',
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
            _this.estructuraUsuario.clearFilters();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.menuGrid = new Ext.menu.Menu({
        id: 'menuGrid'
    });

    this.PanelSecundario = new Ext.Panel({
        frame: true,
        region: 'center'
    });

    this.stRelaciones = new Ext.data.Store({
        url: 'listarAsociacionUserEstruc',
        autoLoad: true,
        reader: new Ext.data.JsonReader(
            {
                id: 'idusuarioestructura',
                root: 'data',
                totalProperty: 'total'
            },
            [//visibles
                {
                    name: 'estructura'
                }, {
                name: 'usuario'
            }, {
                name: 'fechaasociacion'
            }, {
                name: 'activo'
            }, {
                name: 'autor'
            }, {
                name: 'superior'
            }, {
                name: 'iconestruc'
            }, {
                name: 'idusuario'
            }, {
                name: 'idestructura'
            }
            ]
        ),
        listeners: {
            beforeload: function (s) {
                _this.BarraProgreso.show('Cargando');
                s.baseParams.start = pgactual;
                // s.baseParams.limit = _this.cbpaginadorelaciones.getValue();
            },
            load: function (st) {
                _this.BarraProgreso.hide();
                _this.smRelaciones.clearSelections();
                if (st.getCount() == 0) {
                    _this.btnActivarRelacion.disable();
                    _this.btnDesctivarRelacion.disable();
                    _this.btnEliminar.disable();
                    _this.btnModificar.disable();
                }
                if (_this.smRelaciones.getSelected() == undefined) {
                    _this.btnActivarRelacion.disable();
                    _this.btnDesctivarRelacion.disable();
                    _this.btnEliminar.disable();
                    _this.btnModificar.disable();
                }
                if (st.getCount() == 0) {
                    if (_this.estructuraUsuario.getFiltrosActivos() == undefined || _this.estructuraUsuario.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
            }
        }
    });

    this.smRelaciones = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, ri, record) {
                if (record.data.activo == '0') {
                    _this.btnActivarRelacion.enable();
                } else
                    _this.btnDesctivarRelacion.enable();
                _this.btnEliminar.enable();
                _this.btnModificar.enable();
            },
            rowdeselect: function (sm, ri, record) {
                _this.btnActivarRelacion.disable();
                _this.btnDesctivarRelacion.disable();
                _this.btnEliminar.disable();
                _this.btnModificar.disable();
            }
        }
    });

    this.cmRelaciones = [
        {
            id: 'expandir',
            header: "Estructura",
            width: 100,
            sortable: true,
            dataIndex: 'estructura',
            renderer: MostrarImagenTipoEstructura
        }, {
            header: "Usuario",
            width: 150,
            dataIndex: 'usuario',
            sortable: true
        }, {
            header: "Fecha",
            width: 95,
            dataIndex: 'fechaasociacion',
            sortable: true
        }, //&*&* programar actualizar el si o no
        {
            header: "Activo",
            width: 95,
            dataIndex: 'activo',
            sortable: true,
            renderer: MostrarImagenActivo
        }, {
            header: "Autor",
            width: 150,
            dataIndex: 'autor',
            sortable: true
        }
    ];

    this.pgrelaciones = new Ext.PagingToolbar({
        pageSize: 1000,
        store: _this.stRelaciones,
        id: 'pgrelaciones',
        displayInfo: true
    });

    this.estructuraUsuario = new Ext.grid.GridFilters({
        filters: [{
            type: 'date',
            dataIndex: 'fechaasociacion'
        }, {
            type: 'list',
            dataIndex: 'activo',
            options: ['Si', 'No']
        }]
    });

    this.gdRelaciones = new Ext.grid.GridPanel({
        id: 'gdRelaciones',
        frame: true,
        region: 'center',
        iconCls: 'icon-grid',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        plugins: _this.estructuraUsuario,
        store: _this.stRelaciones,
        stripeRows: true,
        sm: _this.smRelaciones,
        root_title: 'Relaciones',
        loadMask: {
            msg: 'Cargando relaciones'
        },
        listeners: {
            rowcontextmenu: function (t, ri, event) {
                _this.smRelaciones.selectRow(ri);
                event.stopEvent();
                _this.Mostrarmenugrid(event.getXY(), _this.smRelaciones.getSelected().data.activo);
            },
            rowdblclick: function (t, ri, event) {
                _this.objCrudAsigEnt.CrearVentanaCrudAsignar(
                    _this.PostAccionesGestionar, _this.smRelaciones.getSelected().data.idusuario,
                    _this.smRelaciones.getSelected().data.idestructura, 'mod');
            }
        },
        columns: _this.cmRelaciones,
        bbar: _this.pgrelaciones
    });

    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        region: 'center',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar,
            _this.btnActivarRelacion, _this.btnDesctivarRelacion, _this.btnLimpiarCalendar, _this.btnAyuda],
        tbar: [_this.btnAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar, ' ',
            _this.btnActivarRelacion, ' ', _this.btnDesctivarRelacion, ' ', _this.btnLimpiarCalendar, '->', _this.btnAyuda],
        items: _this.gdRelaciones
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        //title: 'Asignar entidades a usuarios',
        layout: 'border',
        closable: false,
        noTitle:true,
        graggable: false,
        maximized: true,
        modal: true,
        width: 1000,
        height: 510,
        items: _this.PanPrincipal
    });

    _this.gdRelaciones.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };

    this.Inicializar = function () {
        _this.WinPrincipal.show();
    };

    function MostrarImagenActivo(valor) {
        if (valor == 0) {
            return '<center><span class="icondistra-jabber sipac-grisclaro"></span></center>';
        } else {
            return '<center><span class="icondistra-jabber sipac-amarilla"></span></center>';
        }
    }

    function MostrarImagenTipoEstructura(valor, m, rec) {
        return '<span><img src="' + rec.data.iconestruc + ' " height="15" width="15" >' + ' ' + valor + '</span>';
    }

    this.activarDesactivarRelacion = function (accion) {
        if (accion == 'activar') {
            $text_msje = 'activar';
            $text_barraProg = 'Activando';
        } else {
            $text_msje = 'desactivar';
            $text_barraProg = 'Desactivando';
        }
        msje = '¿Está seguro que quiere' + ' ' + $text_msje + ' ' + 'la relación seleccionada?';
        mostrarMensaje(2, msje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show($text_barraProg + ' ' + 'relación');
                Ext.Ajax.request({
                    url: 'activarDesactivarRelacion',
                    params: {
                        idrelacion: _this.smRelaciones.getSelected().id,
                        accion: accion
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.resp == 1 && responseData.accion == 'activar') {
                            mostrarMensaje(1, 'La relación ha sido activada satisfactoriamente.');
                            _this.PostAccionesGestionar(responseData.resp, responseData.accion);
                        } else {
                            mostrarMensaje(1, 'La relación ha sido desactivada satisfactoriamente.');
                            _this.PostAccionesGestionar(responseData.resp, responseData.accion);
                        }
                    }
                });
            }
        });
    };

    this.PostAccionesGestionar = function (mensaje, accion) {
        switch (mensaje) {
            case 0:
                break;
            case 1:
                if (accion == 'add') {
                    _this.stRelaciones.reload({
                        params: {
                            start: 0
                            //limit:20
                        }
                    });
                } else if (accion == 'mod') {
                    _this.stRelaciones.reload({
                        params: {
                            start: 0
                            //limit:20
                        }
                    });
                } else {
                    _this.stRelaciones.reload({
                        params: {
                            start: 0
                            //limit:20
                        }
                    });
                }
                break;
        }
    };

    this.EliminarAsoc = function () {
        msje = '¿Está seguro que quiere eliminar la relación seleccionada?';
        mostrarMensaje(2, msje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.btnEliminar.disable();
                _this.BarraProgreso.show('Eliminando relación');
                Ext.Ajax.request({
                    url: 'eliminarAsociacion',
                    params: {
                        idrelacion: _this.smRelaciones.getSelected().id
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.resp == 1) {
                            mostrarMensaje(1, 'La relación ha sido eliminada satisfactoriamente.')
                            _this.stRelaciones.reload();
                        } else if (responseData.resp == 4) {
                            mostrarMensaje(1, 'No se pudo eliminar, existen permisos configurados para esta asociación.');
                        } else {
                            mostrarMensaje(1, 'La asociación que usted quiere modificar ya no se encuentra en los registros.', function () {
                                _this.stRelaciones.reload();
                            });
                        }
                    }
                });
            }
        });
    };

    this.Mostrarmenugrid = function (xy, activo) {
        if (_this.menuGrid.items.length == 0) {
            _this.menuGrid.addMenuItem({
                handler: function () {
                    _this.EliminarAsoc();
                },
                text: 'Eliminar relación',
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                tooltip: 'Eliminar relación'
            });
            _this.menuGrid.addMenuItem({
                handler: function () {
                    _this.objCrudAsigEnt.CrearVentanaCrudAsignar(_this.PostAccionesGestionar, _this.smRelaciones.getSelected().data.idusuario, _this.smRelaciones.getSelected().data.idestructura, 'mod');
                },
                text: 'Modificar relación',
                itemCls: 'x-menu-item icondistra-modificar',
                iconCls: 'imagen-none',
                tooltip: 'Modificar relación'
            });
            _this.menuGrid.addMenuItem({
                handler: function () {
                    _this.activarDesactivarRelacion('activar');

                },
                text: 'Activar relación',
                itemCls: 'x-menu-item icondistra-habilitar',
                iconCls: 'imagen-none',
                id: "btnActivarRelacionmenu",
                tooltip: 'Activar relación',
                disabled: (activo == 1) ? true : false
            });
            _this.menuGrid.addMenuItem({
                handler: function () {
                    _this.activarDesactivarRelacion('desactivar');
                },
                text: 'Desactivar relación',
                itemCls: 'x-menu-item icondistra-deshabilitar',
                iconCls: 'imagen-none',
                id: "btnDesctivarRelacionmenu",
                tooltip: 'Desactivar relación',
                disabled: (activo == 1) ? false : true
            });
        } else {
            _this.menuGrid.removeAll();
            _this.Mostrarmenugrid(xy, activo);
        }
        _this.menuGrid.showAt(xy);
    }


};
