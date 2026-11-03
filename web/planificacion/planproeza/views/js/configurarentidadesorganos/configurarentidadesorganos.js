Utilidades.Cmp.Cmpconfigurarentidadorgano = function (opcionesConfig) {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.idcmp = opcionesConfig.idcmp;
    this.start = 0;
    this.parametros = ({});
    this.posteliminar = false;

    this.objCrudRelacion = new Utilidades.Cmp.Cmpcrudconfigurarentidadesorganos();

    this.btnAdicionar = new Ext.Button({
        hidden: opcionesConfig.noUsarAdicionar,
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar relación entidad-órgano',
        id: 'btnAdicionarRelacion',
        prevTab: '',
        nextTab: '',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this,
        handler: function () {
            _this.parametros = ({
                accion: 'Adicionar',
                sm: _this.smCmpConfigurarEntidadOrgano,
                gp: _this.gpCmpConfigurarEntidadOrgano,
                st: _this.stCmpConfigurarEntidadOrgano
            });
            _this.objCrudRelacion.CrearWinCrudRelacionEntidadOrgano(_this.parametros, _this.PostAccionesGestionar);
        }
    });

    this.btnEliminar = new Ext.Button({
        hidden: opcionesConfig.noUsarEliminar,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar relación entidad-órgano',
        id: 'btnEliminarRelacion',
        prevTab: '',
        nextTab: '',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this,
        handler: function () {
            _this.parametros = ({
                accion: 'Eliminar',
                sm: _this.smCmpConfigurarEntidadOrgano,
                gp: _this.gpCmpConfigurarEntidadOrgano,
                st: _this.stCmpConfigurarEntidadOrgano
            });
            _this.objCrudRelacion.eliminarRelacionEntidadOrgano(_this.parametros, _this.PostAccionesGestionar);
        }
    });

    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaRelacion',
        text: 'Ayuda',
        iconCls: 'ayuda',
        hidden: opcionesConfig.noUsarAyuda,
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });

    this.cmCmpConfigurarEntidadOrgano = new Ext.grid.ColumnModel(
        [{
            header: '&Oacutergano que satisface',
            tooltip: '',
            dataIndex: 'denomorgano',
            id: 'expandir',
            sortable: true,
        }, {
            header: 'Entidades',
            tooltip: '',
            dataIndex: 'denomentidad',
            sortable: true,
            width: 700,
        }]
    );
    this.smCmpConfigurarEntidadOrgano = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        id: 'smCmpConfigurarEntidadOrgano',
        listeners: {
            rowselect: function () {
                _this.ActualizarEstadoBarraHerramientas();
            }, rowdeselect: function () {
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });

    this.stCmpConfigurarEntidadOrgano = new Ext.data.Store({
        url: 'listarRelacionEntidadOrgano',
        autoLoad: true,
        listeners: {
            beforeload: function (st) {
                st.baseParams.start = _this.start;
            },
            load: function (record) {
                if (_this.gpCmpConfigurarEntidadOrgano.getStore().getCount() == 0 && !_this.posteliminar) {
                    if ((_this.gfCmpConfigurarEntidadOrgano.getFiltrosActivos() == undefined || _this.gfCmpConfigurarEntidadOrgano.getFiltrosActivos().length == 0)) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                _this.posteliminar = false;
                _this.ActualizarEstadoBarraHerramientas();
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'identidadorganosatisface',
            totalProperty: "total",
            root: "campos"
        }, [{
            name: 'identidadorganosatisface'
        }, {
            name: 'identidad'
        }, {
            name: 'denomentidad'
        }, {
            name: 'idorganosatisface'
        }, {
            name: 'denomorgano'
        }])
    });

    this.gfCmpConfigurarEntidadOrgano = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'denomorgano'
        }, {
            type: 'string',
            dataIndex: 'denomentidad'
        }]
    });

    this.ptbGPCmpConfigurarEntidadOrgano = new Ext.PagingToolbar({
        pageSize: 20,
        store: _this.stCmpConfigurarEntidadOrgano,
        displayInfo: true,
        listeners: {
            beforechange: function (p, e) {
                _this.start = e.start;
            }
        }
    });

    this.gpCmpConfigurarEntidadOrgano = new Ext.grid.EditorGridPanel({
        store: _this.stCmpConfigurarEntidadOrgano,
        title: '',
        id: 'gpCmpConfigurarEntidadOrgano',
        region: 'center',
        sm: _this.smCmpConfigurarEntidadOrgano,
        cm: _this.cmCmpConfigurarEntidadOrgano,
        frame: true,
        autoExpandColumn: 'expandir',
        //plugins: _this.gfCmpConfigurarEntidadOrgano,
        margins: '2 2 2 -4',
        bbar: _this.ptbGPCmpConfigurarEntidadOrgano,
        loadMask: {
            msg: 'Cargando datos'
        },
        listeners: {
            beforeedit: function (e) {
            },
            validateedit: function (e) {
            },
            click: function (n) {
            }
        }
    });

    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        region: 'center',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnEliminar, _this.btnAyuda],
        tbar: [_this.btnAdicionar, _this.btnEliminar, '->', _this.btnAyuda],
        items: [_this.gpCmpConfigurarEntidadOrgano]
    });


    this.WinPrincipal = new Ext.Window({
        title: 'Relacionar entidad-&oacutergano que satisface',
        layout: 'border',
        closable: !opcionesConfig.noUsarCerrarWinP,
        draggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        noTitle: opcionesConfig.maxWinPrincipal,
        modal: true,
        items: [_this.PanPrincipal]
    });

    this.vpPrincipal = new Ext.Viewport({
        layout: 'border',
        id: 'vpPrincipal',
        items: [_this.PanPrincipal]
    });

    this.CargarCmpConfigurarEntidadOrgano = function () {
        //_this.WinPrincipal.show();
        _this.vpPrincipal.show();
    };

    this.PostAccionesGestionar = function (mensaje, accion) {
        switch (mensaje) {
            case 0:
                _this.stCmpConfigurarEntidadOrgano.reload({
                    params: {
                        start: _this.start
                    }
                });
                break;
            case 1:
                if (accion == 'Adicionar') {
                    _this.PaginaActual(null);
                } else if (accion == 'Eliminar') {
                    if (_this.start != 0)
                        _this.posteliminar = true;
                    _this.PaginaActual(null);
                } else if (accion == 'Cancelar-Cerrar') {
                    _this.UltimaPagina();
                }
                break;
        }
    };
    this.PaginaActual = function (anode) {
        _this.smCmpConfigurarEntidadOrgano.clearSelections();
        _this.start = (_this.ptbGPCmpConfigurarEntidadOrgano.getPageData().activePage - 1) * (_this.ptbGPCmpConfigurarEntidadOrgano.cbPageSize.getValue());
        _this.stCmpConfigurarEntidadOrgano.reload({
            params: {
                anode: anode,
                start: _this.start
            },
            callback: function () {
                if (_this.stCmpConfigurarEntidadOrgano.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.ptbGPCmpConfigurarEntidadOrgano.cbPageSize.getValue();
                    _this.stCmpConfigurarEntidadOrgano.reload({
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
        _this.smCmpConfigurarEntidadOrgano.clearSelections();
        var numentero = Math.floor(_this.stCmpConfigurarEntidadOrgano.getTotalCount() / _this.ptbGPCmpConfigurarEntidadOrgano.cbPageSize.getValue());
        _this.start = numentero * _this.ptbGPCmpConfigurarEntidadOrgano.cbPageSize.getValue();
        _this.stCmpConfigurarEntidadOrgano.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.btnEliminar.disable();
        if (_this.smCmpConfigurarEntidadOrgano.hasSelection()) {
            var selected = _this.smCmpConfigurarEntidadOrgano.getSelections();
            if (selected.length > 0) {
                _this.btnEliminar.enable();
            } else _this.btnEliminar.disable();
        }


    }

}