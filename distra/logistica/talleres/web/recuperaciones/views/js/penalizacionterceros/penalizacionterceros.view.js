Ext.ns('Ext.erp.penalizacionterceros');

Ext.erp.penalizacionterceros = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        this.region = 'center';
        this.idioma = {};
        LOG.util.UIManager.apply(this.idioma, Log.tall.penalizacionterceros.Idioma);

        var tipos = [
            ['Solicitud a clientes', '1'],
            ['Solicitud a terceros', '3'],
        ];
        var storeTipo = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'tipo'
                },
                {
                    name: 'idtipo'
                }
            ]
        });
        storeTipo.loadData(tipos);
        this.comboTipoSol = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.labelTipoSol,
            name: 'tipo',
            width: 200,
            store: storeTipo,
            displayField: 'tipo',
            valueField: 'idtipo',
            listeners: {
                'select': function (cb, record) {
                    if (record.data.idtipo == 1) {
                        _this.grid.comboMedio.enable();
                        _this.grid.comboServicio.disable();
                        _this.grid.comboAgencia.disable();
                        _this.grid.comboCliente.enable();

                        _this.grid.comboMedio.reset();
                        _this.grid.comboServicio.reset();
                        _this.grid.comboAgencia.reset();
                        _this.grid.comboCliente.reset();
                        var param = {};
                        param['tipo'] = 1;
                        _this.grid.getStorePrincipal().load({params: param});
                    } else {
                        _this.grid.comboMedio.enable();
                        _this.grid.comboServicio.enable();
                        _this.grid.comboAgencia.enable();
                        _this.grid.comboCliente.disable();

                        _this.grid.comboMedio.reset();
                        _this.grid.comboServicio.reset();
                        _this.grid.comboAgencia.reset();
                        _this.grid.comboCliente.reset();
                        var param = {};
                        param['tipo'] = 2;
                        _this.grid.getStorePrincipal().load({params: param});
                    }
                }
            }
        });
        this.btnImprimir = LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function () {
                _this.grid.getReportes(_this);
            }
        });
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    ctrl: false,
                    key: 'p',
                    fn: function () {
                        if (_this.isVisible() && !_this.btnImprimir.disabled) {
                            _this.grid.getReportes(_this);
                        }
                    }
                }
            ]);

        this.grid = new Ext.erp.grid({
            idioma: this.idioma,
            formaVisualizacion: 'panel',
            comboTipoSol: _this.comboTipoSol,
            btnImprimir: _this.btnImprimir
        });
        this.grid.init();
        this.grid.addEvents('cargainicial');

        Ext.MessageBox.wait(this.idioma.msgCargandoDatosIniciales, this.idioma.msjLoadMask);
        var count = 0;
        Ext.Ajax.request({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
            method: 'POST',
            callback: function (o, s, r) {
                count++;
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                _this.grid.setAgencias(resp['datos']);
                _this.grid.fireEvent('cargainicial');
            }
        });
        Ext.Ajax.request({
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/getEstructurasPorDominio',
            method: 'POST',
            callback: function (o, s, r) {
                count++;
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                _this.grid.setEntidades(resp['datos']);
                _this.grid.fireEvent('cargainicial');
            }
        });
        Ext.Ajax.request({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            method: 'POST',
            callback: function (o, s, r) {
                count++;
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                _this.grid.setClientes(resp['datos']);
                _this.grid.fireEvent('cargainicial');
            }
        });
        this.grid.on({
            'cargainicial': function () {
                if (count > 2) {
                    Ext.MessageBox.hide();
                    _this.grid.getStorePrincipal().load({
                        callback: function () {
                            if (_this.grid.getStorePrincipal().data.items.length == 0) {
                                _this.btnImprimir.disable();
                            }
                            else {
                                _this.btnImprimir.enable();
                            }
                        }
                    });


                }

            },
            'limpiar': function () {
                _this.comboTipoSol.reset();
            }
        });


        var gridPenalizacion = this.grid.view();
        this.grid.store.on({
            load: function () {
                if (_this.grid.store.getCount() != 0) {
                    _this.btnImprimir.enable();
                }
                else {
                    _this.btnImprimir.disable();
                }
            }
        })
        gridPenalizacion.height = 827;
        this.panel = LOG.util.UIManager.initPanel({
            region: 'center',
            labelAlign: 'left',
            layout: 'form',
            items: [gridPenalizacion]
        });


        config.layout = 'border';

        config.items = [
            {
                region: 'north',
                frame: true,
                tbar: [
                    _this.btnImprimir, "->",
                    LOG.util.Prototipos.botonAyuda({
                        tooltip: this.idioma.ttAyuda,
                        id: 'ayudaPenalizacion'
                    })
                ],
                bbar: ["->",
                    new Ext.form.Label({text: _this.idioma.labelTipoSol}),
                    ' ',
                    _this.comboTipoSol
                ]
            },
            this.panel
        ];

        Ext.erp.penalizacionterceros.superclass.constructor.call(this, config);
        this.on({
            'resize': function () {
                var altura = _this.getHeight() - 80;
                gridPenalizacion.setHeight(altura);
            }
        });

    }
});

//Grid de la vista principal
Ext.erp.grid = Ext.extend(LOG.util.UITemplate, {
    /* arrAgencias: undefined,
     arrClientes: undefined,
     idAgencia: undefined,*/
    comboTipoSol: 0,
    constructor: function (config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/penalizacionterceros';
        config.urlBusquedaGridPrincipal = 'getOrdenesPenalizacion';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        this.autoLoad = false;
        this.comboTipoSol = config.comboTipoSol;
        config.idioma = {};
        this.idGridPrincipal = 'idpenalizacionterceros';
        Ext.erp.grid.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.penalizacionterceros.Idioma);
        this.addEvents('limpiar');
        //this.rowexpander =
        //'<p><b>Servicios :</b><br>{servicios}</p><br>'
    },

    render: function (config) {
        var render = Ext.erp.grid.superclass.render.call(this, config);
        var _this = this;
        this.comboMedio = new LOG.util.ComboBox({
            mode: 'local',
            url: '/logistica/talleres/recuperaciones/index.php/penalizacionterceros/getMediosPenalizacion',
            width: 180,
            displayField: 'descripcionmarcamodelo',
            valueField: 'idindicador',
            queryParam: 'criterio',
            pageSize: 10,
            resizable: true,
            minListWidth: 300,
            listeners: {
                select: function (cb, record) {
                    _this.comboServicio.disable();
                    _this.comboAgencia.disable();
                    _this.comboCliente.disable();
                }
            }
        });
        this.comboServicio = new LOG.util.ComboBox({
            mode: 'local',
            width: 180,
            url: '/logistica/talleres/recuperaciones/index.php/penalizacionterceros/getServiciosPenalizacion',
            displayField: 'denominacion',
            valueField: 'idservicio',
            queryParam: 'criterio',
            pageSize: 10,
            resizable: true,
            minListWidth: 300,
            listeners: {
                select: function () {
                    _this.comboMedio.disable();
                    _this.comboAgencia.disable();
                    _this.comboCliente.disable();
                }
            }
        });
        this.comboAgencia = new Ext.form.TriggerField({
            name: 'idagencia',
            width: 180,
            triggerClass: 'x-form-cliente-trigger',
            editable: false,
            tabular: true,
            emptyText: this.idioma.lbSeleccione
        });

        this.comboAgencia.onTriggerClick = function (e) {
            var ventanaSelectAgencia = new Ext.erp.VentanaSelecionAgencia({
                idioma: _this.idioma,
                title: _this.idioma.tlVentanaSelectAgencia,
                proveedores: _this.arrAgencias,
                height: 425,
                width: 605
            });
            ventanaSelectAgencia.show();
            ventanaSelectAgencia.tabPanelGeneral.getListTemplate().each(function (temp) {
                temp.getStorePrincipal().load();
            });
            ventanaSelectAgencia.validacionBtn();
            ventanaSelectAgencia.aceptarFn = function () {
                if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                    var recordSeleccionado = ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                    if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'estructuras') {
                        console.debug(ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador());
                        _this.comboAgencia.setValue(recordSeleccionado.data.entidad);
                        _this.idEstructura = recordSeleccionado.data.idestructura;
                        _this.comboCliente.setValue("");
                        _this.idAgencia = null;
                    }
                    else if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'proveedores') {
                        console.info(recordSeleccionado);
                        _this.comboCliente.setValue(recordSeleccionado.data.idclientesproveedores);
                        _this.idEstructura = null;
                        var name = '';
                        /*Ext.each(_this.arrAgencias, function (r) {
                         if (r['idclientesproveedores'] == _this.idAgencia) {
                         name = r['nombre'];
                         }
                         });*/
                        //_this.comboAgencia.setValue(name);
                        _this.comboAgencia.setValue(recordSeleccionado.data.nombre);
                    }
                }
                _this.comboMedio.disable();
                _this.comboServicio.disable();
                _this.comboCliente.disable();
                this.close();
            }
        };
        var array = Array();
        _this.store = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'nombre'
                },
                {
                    name: 'idcliente'
                }
            ]
        });
        Ext.Ajax.request({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            method: 'POST',
            callback: function (o, s, i) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(i);
                _this.arrClientes = resp['datos'];
                Ext.Ajax.request({
                    url: '/logistica/talleres/recuperaciones/index.php/penalizacionterceros/getClientesPenalizacion',
                    method: 'POST',
                    callback: function (o, s, r) {
                        var respt = LOG.util.UIManager.decodeAjaxResponse(r);
                        Ext.each(_this.arrClientes, function (o) {
                            Ext.each(respt.datos, function (d) {
                                var TopicRecord = Ext.data.Record.create([
                                    {name: 'nombre'},
                                    {name: 'idcliente'},
                                ]);
                                if (o.idclientesproveedores == d.idcliente) {
                                    var myNewRecord = new TopicRecord({
                                        nombre: o.nombre,
                                        idcliente: o.idclientesproveedores
                                    });
                                    _this.store.add(myNewRecord);
                                }
                            })

                        });
                        Ext.apply(_this.comboCliente, {
                            store: _this.store
                        });
                    }
                });
            }
        });

        this.comboCliente = new LOG.util.ComboBox({
            mode: 'local',
            width: 180,
            url: '',
            displayField: 'nombre',
            valueField: 'idcliente',
            queryParam: 'criterio',
            pageSize: 10,
            resizable: true,
            minListWidth: 300,
            listeners: {
                select: function () {
                    _this.comboMedio.disable();
                    _this.comboServicio.disable();
                    _this.comboAgencia.disable();
                }
            }
        });

        _this.btnBuscarMedio = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBuscar,
            handler: function () {
                _this.btnBuscar();
            }
        });
        _this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar, handler: function () {
                _this.btnLimpiar();
            }
        });

        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: true,
                key: 'b',
                fn: function () {
                    if (render.isVisible())
                        _this.btnBuscar();
                }
            },
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        if (render.isVisible())
                            _this.btnLimpiar();
                    }
                }]);
        this.comboEstructura = new LOG.util.LovCombo({
            mode: 'remote',
            autoLoad: false,
            //width: 120,
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/getEstructurasPorDominio',
            displayField: 'text',
            emptyText: 'Seleccione',
            valueField: 'id',
            listeners: {
                select: function (cb, record, index) {
//                    _this.cargarConFiltro();
//                    _this.gridParte.getStorePrincipal().load();
//                    _this.gridResumen.getStorePrincipal().load();
                }
            },
            queryParam: 'criterio',
            pageSize: 10,
            resizable:true
        });

        this.gpPrincipal.getTopToolbar().add(
            '-',
            new Ext.form.Label({text: this.idioma.cgMedio + ':'}),
            ' ',
            this.comboMedio,
            '-',
            new Ext.form.Label({text: this.idioma.ltServicio + ':'}),
            ' ',
            this.comboServicio,
            '-',
            new Ext.form.Label({text: this.idioma.labelAgencia + ':'}),
            ' ',
            this.comboAgencia,
            '-',
            new Ext.form.Label({text: this.idioma.labelCliente + ':'}),
            ' ',
            this.comboCliente,
            new Ext.form.Label({text: 'Estructura:'}),
            ' ',
            _this.comboEstructura,
            '-',
            _this.btnBuscarMedio,
            '-',
            _this.btnLimpiarMedio
        );
        //Ext.apply(this.gpPrincipal.getTopToolbar(),{autoScroll:true});
        this.gpPrincipal.autoExpandColumn = 'agencia';

        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                if (_this.gridServicio) {
                    _this.gridServicio.getStorePrincipal().removeAll();
                }
                Ext.apply(obj.params, {
                    idindicador: _this.comboMedio.getValue(),
                    idservicio: _this.comboServicio.getValue(),
                    idcliente: _this.comboCliente.getValue(),
                    idagencia: _this.idAgencia,
                    idestructurainterna: _this.idEstructura,
                    idestructuracomun: _this.comboEstructura.getValue()
                });
            },
            load:function(){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        });

        this.gridServicio = new Ext.erp.penalizacionterceros.GridServicio({idioma: this.idioma, modelo: this.modelo});
        this.gridServicio.init();
        var vistaServicio = this.gridServicio.view({region: 'south', expandable: true, height: 200});
        Ext.apply(vistaServicio, {
            region: 'south',
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: 'Servicios realizados',
            collapsed: false,
            frame: true,
            height: 200
        });
        this.getPanelPrincipal().add(vistaServicio);
        //vistaServicio.on({
        //    show:function(){
        //        _this.gridServicio.getStorePrincipal().load();
        //    }
        //});
        this.getSmPrincipal().on({
            rowselect: function (sm, index, record) {

                _this.gridServicio.getStorePrincipal().removeAll();
                var topicRecord = Ext.data.Record.create([
                    {name: 'denominacion'}
                ]);
                if (typeof (record.json.servicios) == 'object') {
                    Ext.each(record.json.servicios, function (value) {
                        var myNewRecord = new topicRecord({
                            denominacion: value
                        });
                        _this.gridServicio.getStorePrincipal().add(myNewRecord);
                    });
                }
                else {
                    var myNewRecord = new topicRecord({
                        denominacion: record.json.servicios
                    });
                    _this.gridServicio.getStorePrincipal().add(myNewRecord);
                }
            },
            rowdeselect: function () {
                _this.gridServicio.getStorePrincipal().removeAll();
            }
        });
        return render;
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            agrupador: true,
            header: this.idioma.cgEntidad,
            hidden: true,
//            width: 120,
//            default: true,
            renderer: function (val, metaData, record) {
                var resul = val;
                Ext.each(_this.arrEntidades, function (r) {
                    if (r['id'] == val) {
                        resul = r['text'];
                    }
                });
                return resul;
            }
        });
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: this.idioma.cgNoOrden,
            width: 120,
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idcliente',
            header: this.idioma.cgAdencia,
            width: 120,
            default: true,
            id: 'agencia',
            renderer: function (val, metaData, record) {
                var resul = val;
                var cliente = true;
                if (record.json.idcliente) {
                    Ext.each(_this.arrAgencias, function (r) {
                        if (r['idclientesproveedores'] == val) {
                            resul = r['nombre'];
                            cliente = false;
                        }
                    });
                    if (cliente) {
                        Ext.each(_this.arrClientes, function (r) {
                            if (r['idclientesproveedores'] == val) {
                                resul = r['nombre'];
                                cliente = false;
                            }
                        });
                    }
                } else {
                    resul = record.json.entidad;
                }

                return resul;
            }
        });

        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelo',
            header: this.idioma.cgMedio,
            width: 250,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            width: 250,
            dataIndex: 'marca',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            width: 250,
            dataIndex: 'modelo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            header: this.idioma.cgIdentificador,
            width: 250,
            default: true,
            renderer: function (val) {
                var resul = (val == "") ? '-' : val;
                return resul;
            }
        });
        this.addGridColumn({
            hidden: true,
            width: 120,
            dataIndex: 'servicios',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechainicio',
            header: this.idioma.cgFechaInicio,
            width: 120,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechacierre',
            header: this.idioma.cgFechaSalida,
            width: 120,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'estadia',
            header: this.idioma.cgDias,
            width: 120,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddoc'
        });
    },

    getReportes: function (data) {
        var _this = this;
        var iddoc = _this.getStorePrincipal().getRange(0,0)[0].data.iddoc;
        _this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/ServiciosATerceros',
                    isList: true,
                    params: {
                        idindicador: this.comboMedio.getValue() ? this.comboMedio.getValue() : null,
                        idservicio: this.comboServicio.getValue() ? this.comboServicio.getValue() : null,
                        idestructuras: _this.comboEstructura.getValue() ? _this.comboEstructura.getValue() : null,
                        documentoorigen: null,//ABROB-3
                        //estadodocumento: '{5,6,7,8}',
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema,
                        idcliente: _this.comboCliente.getValue()? _this.comboCliente.getValue() : null,
                        tiposolicitud: _this.comboTipoSol.getValue() != '' ? _this.comboTipoSol.getValue() : null,
                        iddoc: iddoc != '' ? iddoc : null
                    }
                }
            ]
        });
        _this.tipoReportes.view();
    },

    btnBuscar: function () {
        var _this = this;
        var medio = _this.comboMedio.getValue();
        var servicio = _this.comboServicio.getValue();
        var cliente = _this.comboCliente.getValue();
        var agencia = _this.idAgencia;
        var estructura = _this.idEstructura;
        var idestructuracomun = _this.comboEstructura.getValue();
        if (medio || servicio || cliente || agencia || estructura || idestructuracomun) {
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load({
                params: {
                    idindicador: (medio) ? medio : null,
                    idservicio: (servicio) ? servicio : null,
                    idcliente: (cliente) ? cliente : null,
                    idagencia: (agencia) ? agencia : null,
                    idestructurainterna: (estructura) ? estructura : null,
                    idestructuracomun: (idestructuracomun) ? idestructuracomun : null,
                    limit: 30,
                    start: 0
                },
                callback: function () {
                    if (_this.getStorePrincipal().getCount() == 0)
                        mostrarMensaje(1, _this.idioma.msgInfDatosE);
                }
            });
        }
    },

    btnLimpiar: function () {
        var _this = this;
        var medio = _this.comboMedio.getValue();
        var servicio = _this.comboServicio.getValue();
        var cliente = _this.comboCliente.getValue();
        var agencia = _this.idAgencia;
        var estructura = _this.idEstructura;
        var idestructuracomun = _this.comboEstructura.getValue();
        if (medio || servicio || cliente || agencia || estructura || idestructuracomun) {
            _this.comboMedio.reset();
            _this.comboServicio.reset();
            _this.comboAgencia.reset();
            _this.comboCliente.reset();
            _this.comboEstructura.reset();

            _this.idAgencia = null;
            _this.idEstructura = null;
            _this.comboMedio.enable();
            _this.comboServicio.enable();
            _this.comboAgencia.enable();
            _this.comboCliente.enable();
            _this.getStorePrincipal().removeAll();
            _this.getStorePrincipal().filtrado = false;
            _this.getStorePrincipal().load();
            _this.fireEvent('limpiar');
        }

    },

    setAgencias: function (agencias) {
        this.arrAgencias = agencias;
    },
    setClientes: function (clientes) {
        this.arrClientes = clientes;
    },
    setEntidades: function (entidades) {
        this.arrEntidades = entidades;
    }

});

Ext.erp.penalizacionterceros.GridServicio = Ext.extend(LOG.util.UITemplate, {
    idOrdenTrabajo: undefined,
    constructor: function (config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/penalizacionterceros';
        config.urlBusquedaGridPrincipal = 'cargarServicios';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.busquedaAvanzada = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        Ext.erp.penalizacionterceros.GridServicio.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            width: 300,
            default: true
        });
    },
    render: function (config) {
        var render = Ext.erp.penalizacionterceros.GridServicio.superclass.render.call(this, config);
        this.getGridPrincipal().initialConfig.bbar.hide();
        return render;
    }
});

//Ventana para seleccionar la agencia

Ext.erp.VentanaSelecionAgencia = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    panelGeneral: undefined,
    tabPanelGeneral: undefined,
    cerrarAceptar: true,
    constructor: function (config) {
        this.usarAplicar = false;
        this.arrProveedor = config.proveedores;
        Ext.erp.VentanaSelecionAgencia.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();
        this.addEvents('cargainicial');
    },

    initComponent: function () {
        var _this = this;
        Ext.erp.VentanaSelecionAgencia.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.tabPanelGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            formaVisualizacion: 'panel'
        });

        this.tab1 = new Ext.erp.gridEstructuras({
            idioma: _this.idioma,
            title: _this.idioma.tlEstructuras,
            height: 200
        });
        this.tabPanelGeneral.addTabToTemplete(this.tab1);

        this.tab2 = new Ext.erp.gridProveedor({
            idioma: _this.idioma,
            title: _this.idioma.tlProveedor,
            height: 200,
            idestructura: _this.idestructura,
            proveedores: this.arrProveedor
        });
        this.tabPanelGeneral.addTabToTemplete(this.tab2);

        this.tabPanelGeneral.init();
        var x = this.tabPanelGeneral.view();
        x.height = 350;
        x.width = 580;
        x.frame = false;
        this.panelGeneral.add(x);
        this.add(this.panelGeneral);
    },

    validacionBtn: function () {
        var _this = this;
        this.tab2.getSmPrincipal().on({
            rowselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'proveedores') {
                    _this.listaBotones.getItem(2).enable()
                }
            },
            rowdeselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'proveedores') {
                    _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.tab1.getSmPrincipal().on({
            rowselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'estructuras') {
                    _this.listaBotones.getItem(2).enable();
                }
            },
            rowdeselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'estructuras') {
                    _this.listaBotones.getItem(2).disable();
                }
            }
        });

        this.tabPanelGeneral.on({
            tabchange: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                    _this.listaBotones.getItem(2).enable();
                }
                else  _this.listaBotones.getItem(2).disable();
            }
        });
    },


});

Ext.erp.gridEstructuras = Ext.extend(LOG.util.UITemplate, {
    identificador: 'estructuras',
    idComponent: 'estructuras',
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/recuperaciones/index.php/penalizacionterceros';
        this.urlBusquedaGridPrincipal = 'getAgenciasPenalizacion';
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.tall.penalizacionterceros.Idioma);
        this.concepto = this.idioma.ttBuscarEstructura;
        this.textBusquedaSimple = this.idioma.tlEstructura;
        Ext.erp.gridEstructuras.superclass.constructor.call(this, config);


    },

    render: function () {
        var _this = this;
        var vista = Ext.erp.gridEstructuras.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'text';
        this.getStorePrincipal().initBaseParams.tipo = 1;
        return vista;
    },

    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idestructura',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacionMedios,
            width: 120,
            dataIndex: 'entidad',
            default: true,
            id: 'text'
        });
    },
    getIdentificador: function () {
        return this.identificador;
    }
});

Ext.erp.gridProveedor = Ext.extend(LOG.util.UITemplate, {
    identificador: 'proveedores',
    idComponent: 'proveedores',
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.proveedores = config.proveedores;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/recuperaciones/index.php/penalizacionterceros';
        this.urlBusquedaGridPrincipal = 'getAgenciasPenalizacion';
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.tall.penalizacionterceros.Idioma);
        this.concepto = this.idioma.ttBuscarProveedor;
        this.textBusquedaSimple = this.idioma.tlProveeedor;
        Ext.erp.gridProveedor.superclass.constructor.call(this, config);


    },
    render: function () {
        var _this = this;
        var vista = Ext.erp.gridProveedor.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'nombre';
        this.getStorePrincipal().initBaseParams.tipo = 2;
        return vista;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idagencia',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacionMedios,
            width: 120,
            dataIndex: 'idagencia',
            id: 'nombre',
            default: true,
            renderer: function (val, metaData, record) {
                var resul = val;
                if (record.json.idagencia) {
                    Ext.each(_this.proveedores, function (r) {
                        if (r['idclientesproveedores'] == val) {
                            resul = r['nombre'];
                        }
                    });
                }
                return resul;
            }
        });
    },
    getIdentificador: function () {
        return this.identificador;
    }
});

