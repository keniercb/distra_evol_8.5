Ext.ns('Ext.erp.paralizaciontalleres');
Ext.erp.paralizaciontalleres = Ext.extend(LOG.util.Panel, {
    edades: undefined,
    periodos: undefined,
    entidades: [],
    panelGenereal: undefined,
    listaBotones: undefined,
    params: undefined,
    constructor: function (config) {
        var _this = this;
        this.acciones = config.acciones;
        this.idioma = LOG.util.UIManager.apply(this.idioma, Log.tall.paralizaciontalleres.Idioma);
//        Ext.Ajax.request({
//            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/getEdades',
//            method: 'POST',
//            callback: function (o, s, r) {
//                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
//                _this.edades = resp.datos;
//                _this.bindBody();
//            }.createDelegate(this)
//        });
        this.bindBodyParalizacionEspecf(this);
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            text: this.idioma.lbBtnImprimir,
            disabled: true,
            handler: function () {
                _this.getReportes(_this);
            }
        });
        this.listaBotones = new LOG.util.List();
        this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar, handler: function () {
                _this.btnLimpiar();
            }});

        this.btnExportar = LOG.util.Prototipos.botonExportar({
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/exportarExcel',
            objSubmit: this.params,
            hidden: true,
            disabled: true
        });

        this.listaBotones.add(this.btnExportar);
        this.listaBotones.add(this.btnLimpiarMedio);
        this.listaBotones.add("->");
        this.listaBotones.add(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: 'ayudaParalizacion'
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
                [
                    {
                        alt: true,
                        ctrl: false,
                        key: 'l',
                        fn: function () {
                            if (_this.isVisible())
                                _this.btnLimpiar();
                        }
                    },
                    {
                        alt: true,
                        ctrl: false,
                        key: 'p',
                        fn: function () {
                            _this.getReportes(_this);
                        }
                    }
                ]);
        this.comboTipoMedio = new LOG.util.LovCombo({
            mode: 'remote',
            url: '/logistica/talleres/configuracion/index.php/configuracionparalizacion/cargarReporteParalizacion',
            width: 250,
            displayField: 'denominacion',
            valueField: 'idreporteparalizacion',
            queryParam: 'criterio',
            minChars: 1,
            pageSize: 15,
            resizable: true,
            listeners: {
                'change': function (b, c) {
                    if (c) {
                        _this.gridResumen.btnBuscarMedio.setDisabled(false);
                    } else {
                        _this.gridResumen.btnBuscarMedio.setDisabled(true);
                    }
                }
            }
        });
        this.comboEstructura = new LOG.util.LovCombo({
            mode: 'remote',
            width: 300,
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/getEstructuras',
            disabled: (_this.grantedAction('PPT')) ? false : true,
            displayField: 'denominacion',
            valueField: 'idestructura',
            queryParam: 'criterio',
            pageSize: 10,
            resizable: true
        });
        this.comboEstructura.store.load({
            scope: this,
            callback: function () {
                this.comboEstructura.setValue(estaestructura);
            }
        });
        this.cmbSector = new LOG.util.ComboBox({
            fieldLabel: 'Sector',
            autoLoad: true,
//            url: '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/cargarSector',
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/cargarSector',
            hiddenName: 'idsector',
            valueField: 'idsector',
            displayField: 'denominacion',
            triggerAction: 'all',
            enableQtip: true
        });
        this.comboClienteBA = new LOG.util.ComboBox({
            name: 'clienteba',
            width: 250,
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/cargarClientesba',
            displayField: 'cliente',
            valueField: 'idclientesproveedores',
            fieldLabel: 'Cliente',
            autoLoad: false,
            mode: 'remote',
            minChars: 4,
            pageSize: 15,
            resizable: true
        });
        this.comboClienteBA.store.on({beforeload: function (st, obj) {
                obj.params.explotacion = 1;
                st.baseParams.idestructura = _this.comboEstructura.getValue();
                st.baseParams.idsector = _this.cmbSector.getValue();
            }});
        config.layout = 'border';
        config.items = [{
                region: 'north',
                tbar: this.listaBotones.getArray(),
                bbar: [
                    new Ext.form.Label({text: 'Entidad:'}),
                    ' ',
                    this.comboEstructura,
                    '-',
                    new Ext.form.Label({text: 'Sector:'}),
                    ' ',
                    this.cmbSector,
                    '-',
                    new Ext.form.Label({text: 'Cliente:'}),
                    ' ',
                    this.comboClienteBA,
                    '-',
                    new Ext.form.Label({text: 'Tipo de medio:'}),
                    ' ',
                    this.comboTipoMedio,
                    ' ']
            },
            this.panelGeneral
        ];
        Ext.erp.paralizaciontalleres.superclass.constructor.call(this, config);
    },
    bindBody: function () {
        var _this = this;
        this.gridResumen.getStorePrincipal().on({
            load: function (st, records) {
                if (_this.gridResumen.getVistaPrincipal().isVisible())
                {
                    if (st.getCount() == 0)
                        _this.btnImprimir.disable();
                    else
                        _this.btnImprimir.enable();
                }
            }
        });
        this.panelGeneral.doLayout();
    },
    bindBodyParalizacionEspecf: function (config) {
        var _this = this;
        this.gridResumen = new Ext.erp.paralizaciontalleres.GridResumen({
            formaVisualizacion: 'panel'
            , parent: _this
                    //,
                    // cbestructura : _this.comboEstructura.getValue()
        });
        this.gridResumen.init();
        this.vistaResumen = this.gridResumen.view();
        this.panelGeneral = new LOG.util.UIManager.initPanel({
            layout: 'card',
            activeItem: 0,
            region: 'center',
            frame: true,
            items: [this.vistaResumen]
        });
    },
    btnLimpiar: function () {
        var param = false;
        let recursoPPT = (this.grantedAction('PPT')) ? false : true;
        if (!(this.comboTipoMedio.getValue() || this.comboEstructura.getValue())) {
            param = true;
        }
        if (!recursoPPT) {
            this.comboEstructura.reset();
        }
        this.comboTipoMedio.reset();
        this.comboClienteBA.reset();
        this.cmbSector.reset();
        this.gridResumen.gpPrincipal.filters.clearFilters();
    },
    grantedAction: function (idAccion) {
        var existe = false;
        Ext.each(this.acciones, function (a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    }
});

Ext.erp.paralizaciontalleres.GridResumen = Ext.extend(LOG.util.UITemplate, {
    params: undefined,
    constructor: function (config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres';
        config.urlBusquedaGridPrincipal = 'getMediosParalizados';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.busquedaAvanzada = false;
        config.autoLoad = false;
        this.parent = config.parent;
        this.concepto = 'paralizaci\xf3n(es) en taller';
        this.idGridPrincipal = 'idparalizacion';
        config.idioma = {};
        Ext.erp.paralizaciontalleres.GridResumen.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.paralizaciontalleres.Idioma);

    },
    render: function (config) {
        var render = Ext.erp.paralizaciontalleres.GridResumen.superclass.render.call(this, config);
        var _this = this;
        var fechaseleccionada = '';

        //checkbox del rango de estadia
        _this.radiotodos = new Ext.form.Checkbox({
            id: 'radiotodos',
            disable: false
        });
        _this.radio0 = new Ext.form.Checkbox({
            id: 'radio0',
            disable: false
        });
        _this.radio1 = new Ext.form.Checkbox({
            id: 'radio1',
            disable: false
        });
        _this.radio2 = new Ext.form.Checkbox({
            id: 'radio2',
            disable: false
        });
        _this.radio3 = new Ext.form.Checkbox({
            id: 'radio3',
            disable: false
        });
        _this.radio4 = new Ext.form.Checkbox({
            id: 'radio4',
            disable: false
        });
        _this.radio5 = new Ext.form.Checkbox({
            id: 'radio5',
            disable: false
        });
        _this.internocheckbox = new Ext.form.Checkbox({
            id: 'internocheckbox',
            disable: false,
            listeners: {
                'check': function (b, c) {
                    if (c) {
                        _this.externocheckbox.setValue(false);
                    }
                }
            }
        });
        _this.externocheckbox = new Ext.form.Checkbox({
            id: 'externocheckbox',
            disable: false,
            listeners: {
                'check': function (b, c) {
                    if (c) {
                        _this.internocheckbox.setValue(false);
                    }
                }
            }
        });
        _this.textHasta = new Ext.form.DateField({
            width: 100,
            editable: false
        });
        _this.btnBuscarMedio = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            disabled: true,
            tooltip: this.idioma.ttBtnBuscarParalizacion,
            handler: function () {
                _this.btnBuscar();
            }
        });
        this.btnImprimirgeneral = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimirgen,
            text: this.idioma.lbBtnImprimirgen,
            disabled: true,
            hidden: true,
            handler: function () {
                _this.getReporteParaGeneral();
            }
        });
        _this.btnExportarparaenbase = LOG.util.Prototipos.botonExportar({
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/imprimirexcelenbase',
            disabled: false,
            hidden: false
        });
        _this.btnExportarparaenbase.handler = _this.btnExportarparaenbase.handler.createInterceptor(function () {
            if (_this.getStorePrincipal().getCount() == 0) {
                return false;
            }
            _this.btnExportarparaenbase.objSubmit = {
                rangotodos: (_this.radiotodos.checked == true) ? 1 : 0,
                primerrango: (_this.radio0.checked == true) ? 1 : 0,
                segundorango: (_this.radio1.checked == true) ? 1 : 0,
                tercerrango: (_this.radio2.checked == true) ? 1 : 0,
                maxrango: (_this.radio3.checked == true) ? 1 : 0,
                tipomedio: _this.parent.comboTipoMedio.getValue(),
                estructura: _this.parent.comboEstructura.getValue(),
                clienteba: (_this.parent.comboClienteBA.getValue()) ? _this.parent.comboClienteBA.getValue() : null,
                limit: _this.getStorePrincipal().getTotalCount(),
                start: 0,
                idsector: (_this.parent.cmbSector.getValue()) ? _this.parent.cmbSector.getValue() : null,
                interno: (_this.internocheckbox.checked == true) ? 1 : 0,
                externo: (_this.externocheckbox.checked == true) ? 1 : 0,
                filter: _this.gpPrincipal.filters.buildQuery(_this.gpPrincipal.filters.getFilterData()).filter
            };
        }, _this.btnExportarparaenbase);

        _this.btnExportarResumenGeneral = LOG.util.Prototipos.botonExportar({
            url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/imprimirexcelresumengeneral',
            disabled: false,
            hidden: false,
            text: 'Exportar paralización general',
            tooltip: 'Exportar paralización general',
        });
        _this.btnExportarResumenGeneral.handler = _this.btnExportarResumenGeneral.handler.createInterceptor(function () {
//            if (_this.getStorePrincipal().getCount() == 0) {
//                return false;
//            }
            _this.btnExportarResumenGeneral.objSubmit = {
                rangotodos: (_this.radiotodos.checked == true) ? 1 : 0,
                primerrango: (_this.radio0.checked == true) ? 1 : 0,
                segundorango: (_this.radio1.checked == true) ? 1 : 0,
                tercerrango: (_this.radio2.checked == true) ? 1 : 0,
                maxrango: (_this.radio3.checked == true) ? 1 : 0,
                tipomedio: _this.parent.comboTipoMedio.getValue(),
                estructura: _this.parent.comboEstructura.getValue(),
                clienteba: (_this.parent.comboClienteBA.getValue()) ? _this.parent.comboClienteBA.getValue() : null,
                limit: _this.getStorePrincipal().getTotalCount(),
                start: 0,
                idsector: (_this.parent.cmbSector.getValue()) ? _this.parent.cmbSector.getValue() : null,
                interno: (_this.internocheckbox.checked == true) ? 1 : 0,
                externo: (_this.externocheckbox.checked == true) ? 1 : 0,
                filter: _this.gpPrincipal.filters.buildQuery(_this.gpPrincipal.filters.getFilterData()).filter
            };
        }, _this.btnExportarResumenGeneral);

        this.documentKeyMap = new Ext.KeyMap(document,
                [{
                        alt: true,
                        ctrl: false,
                        key: 'b',
                        fn: function () {
                            if (render.isVisible())
                                _this.btnBuscar();
                        }
                    }, {
                        alt: true,
                        ctrl: true,
                        key: 'x',
                        fn: function () {
                            if (_this.getPanelBusqueda().isVisible()) {
                                _this.btnCerrarBA();
                            }

                        }
                    }, {
                        alt: true,
                        ctrl: false,
                        key: 'v',
                        fn: function () {
                            if (!_this.getPanelBusqueda().isVisible()) {
                                _this.getPanelBusqueda().show();
                                _this.getPanelBusqueda().expand();
                            }
                        }
                    }
                ]);

        //Adicion de los checkbox a la toolbar 
        this.gpPrincipal.getTopToolbar().add(
                new Ext.form.Label({
                    text: 'Rango de estadía: ',
                    style: 'padding: 10px 10px 0px 0px;font-weight: bolder;'
                }),
                ' ',
                _this.radiotodos,
                new Ext.form.Label({
                    text: 'Todos',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                //new Ext.form.Label({text: 'Desde:'}),
                ' ',
                _this.radio0,
                new Ext.form.Label({
                    text: '0-30 días',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                ' ',
                _this.radio1,
                new Ext.form.Label({
                    text: '31-60 días',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                ' ',
                _this.radio2,
                new Ext.form.Label({
                    text: '61-90 días',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                ' ',
                _this.radio3,
                new Ext.form.Label({
                    text: '91-120 días',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                ' ',
                _this.radio4,
                new Ext.form.Label({
                    text: '121-360 días',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                ' ',
                _this.radio5,
                new Ext.form.Label({
                    text: 'Más de 1 año',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                '-',
                _this.internocheckbox,
                new Ext.form.Label({
                    text: 'Interno',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                ' ',
                _this.externocheckbox,
                new Ext.form.Label({
                    text: 'Externo',
                    style: 'padding: 10px 10px 0px 0px'
                }),
                '-',
                _this.btnExportarparaenbase,
                '-',
                _this.btnExportarResumenGeneral,
//                '-',
//                this.btnImprimirgeneral,
                '-',
                _this.btnBuscarMedio
                );
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                // var minDias = -1;
                // var maxDias = -1;
                // this.rangominDias = [];
                // this.rangomaxDias = [];
                // [
                //     {min:0, max:30}
                // ]
                // if (_this.radio0.checked){
                //     this.rangominDias[0] = 0;
                //     this.rangomaxDias[0] = 30;
                // } if (_this.radio1.checked){
                //     this.rangominDias[1] = 31;
                //     this.rangomaxDias[1] = 61;
                // } if (_this.radio2.checked){
                //     this.rangominDias[3] = 90;
                // } else if (_this.radio3.checked){
                //     minDias = 90;
                // }
                // //maxDias = ((_this.radio3.checked) ? -1 : (_this.radio2.checked ? 90 : (_this.radio1.checked ? 60 : (_this.radio0.checked) ? 30 : -1)));
                // if (_this.radiotodos.checked) { 
                //     st.initBaseParams.rangominDias = 0;
                //     st.baseParams.rangomaxDias = 0;
                // }else{
                //     st.initBaseParams.rangominDias = this.rangominDias;
                //     st.baseParams.rangomaxDias = this.rangomaxDias;
                // };
                // //st.initBaseParams.maxdias = maxDias;
                // //st.baseParams.maxdias = maxDias;
                // Ext.apply(obj.params, {data:Ext.encode(_this.params)//,fechainicio:_this.textDesde.getValue(),fechafin:_this.textHasta.getValue()
                // });
            },
            load: function (obj) {
                Ext.apply(obj.params, {data: Ext.encode(_this.params)//,fechainicio:_this.textDesde.getValue(),fechafin:_this.textHasta.getValue()
                });
                if (_this.getStorePrincipal().getCount() == 0) {
                    if (!_this.getStorePrincipal().filtrado) {
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        });
        this.getStorePrincipal().on({
            beforeload: function (store) {
                LOG.util.UIManager.apply(store.baseParams, {
                    rangotodos: (_this.radiotodos.checked == true) ? 1 : 0,
                    primerrango: (_this.radio0.checked == true) ? 1 : 0,
                    segundorango: (_this.radio1.checked == true) ? 1 : 0,
                    tercerrango: (_this.radio2.checked == true) ? 1 : 0,
                    cuartorango: (_this.radio3.checked == true) ? 1 : 0,
                    quintorango: (_this.radio4.checked == true) ? 1 : 0,
                    maxrango: (_this.radio5.checked == true) ? 1 : 0,
                    tipomedio: _this.parent.comboTipoMedio.getValue(),
                    estructura: _this.parent.comboEstructura.getValue(),
                    clienteba: (_this.parent.comboClienteBA.getValue()) ? _this.parent.comboClienteBA.getValue() : null,
                    idsector: (_this.parent.cmbSector.getValue()) ? _this.parent.cmbSector.getValue() : null,
                    limit: _this.getGridPrincipal().initialConfig.bbar.pageSize,
                    start: _this.getGridPrincipal().initialConfig.bbar.cursor,
                    interno: (_this.internocheckbox.checked == true) ? 1 : 0,
                    externo: (_this.externocheckbox.checked == true) ? 1 : 0
                });
            },
            load: function (store) {
            }
        });
        return render;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'entidad',
            header: this.idioma.cgUEB,
            width: 250,
            hidden: true,
//            agrupador: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'agencia',
            header: this.idioma.cgAgencia,
            width: 150,
            filter: {
                type: 'string',
                dataIndex: 'agencia'
            }
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'nroorden',
            header: this.idioma.cgOT,
            hideable: false,
            width: 60,
            filter: {
                type: 'numeric',
                emptyText: this.idioma.cgOT,
                dataIndex: 'nroorden'
            },
//            filter: {
//                type: 'string',
//                dataIndex: 'nroorden'
//            },
            // default: true
        });
        this.addGridColumn({
            dataIndex: 'ubicacion',
            header: this.idioma.cgUbicacion,
            width: 120,
            filter: {
                type: 'combo',
                url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarnomubicaciontall',
                valueField: 'denominacion',
                displayField: 'denominacion',
                dataIndex: 'ubicacion'
            },
        });
        this.addGridColumn({
            dataIndex: 'cliente',
            header: this.idioma.cgCliente,
            hideable: false,
            width: 150,
            // default: true
            filter: {
                type: 'string',
                emptyText: this.idioma.cgCliente,
                dataIndex: 'cliente'
            },
        });
        this.addGridColumn({
            dataIndex: 'matricula',
            header: this.idioma.cgMatricula,
            width: 120,
            filter: {
                type: 'string',
                emptyText: 'Matrícula',
                dataIndex: 'matricula'
            },
            renderer: function (value, metaData, record, dataIndex, col) {
                if (value)
                    return value.replace(/"/g, '');
                return value;
            }
        });
        this.addGridColumn({
            dataIndex: 'marca',
            header: this.idioma.cgMarca,
            width: 120,
            filter: {
                type: 'combo',
                url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/cargarMarcas',
                valueField: 'denominacion',
                displayField: 'denominacion',
                dataIndex: 'marca'
            },
            renderer: function (value, metaData, record, dataIndex, col) {
                if (value)
                    return value.replace(/"/g, '');
                return value;
            }
        });
        this.addGridColumn({
            dataIndex: 'modelo',
            header: this.idioma.cgModelo,
            width: 120,
            filter: {
                type: 'combo',
                url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/cargarModelos',
                valueField: 'denominacion',
                displayField: 'denominacion',
                dataIndex: 'modelo'
            },
            renderer: function (value, metaData, record, dataIndex, col) {
                if (value)
                    return value.replace(/"/g, '');
                return value;
            }
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'fechainicio',
            header: this.idioma.cgFechaEntrada,
            width: 120,
            filter: {
                type: 'date',
                dateFormat: 'd/m/Y',
                dataIndex: 'fechainicio'
            }
        });
        this.addGridColumn({
            dataIndex: 'diasparalizado',
            header: this.idioma.cgDiasParado,
            width: 120,
            align: 'right',
            filter: {
                type: 'numeric',
                emptyText: 'No. de días',
                dataIndex: 'diasparalizado'
            },
            //default: true
            //renderer:function(value){
            //    if(value) {
            //        var arr = value.split("/");
            //        var cadena = arr[1] + "/" + arr[0] + "/" + arr[2];
            //        var value = new Date(cadena);
            //        var actual = new Date();
            //        var dias = Math.floor((actual - value) / 86400000);//cantidad de mls por dia
            //        return dias;
            //    }
            //    return '';
            //}
        });
        this.addGridColumn({
            dataIndex: 'indicativo',
            header: this.idioma.cgIndicativo,
            width: 120,
            filter: {
                type: 'string',
                emptyText: 'Indicativo',
                dataIndex: 'indicativo'
            },
            //default: true
            renderer: function (value, metaData, record, dataIndex, col) {
                if (value == null)
                    value = _this.validarIdentificador(record.json, 'indicativo');
                return value;
            }
        });
        this.addGridColumn({
            dataIndex: 'dictamentecnico',
            header: this.idioma.cgMotivosParalizacion,
            width: 120,
            //default: true
            filter: {
                type: 'string',
                emptyText: this.idioma.cgMotivosParalizacion,
                dataIndex: 'dictamentecnico'
            },
        });
        this.addGridColumn({
            dataIndex: 'fechafin',
            header: this.idioma.cgPronosticoSalida,
            width: 150,
            //default: true
            filter: {
                type: 'date',
                dateFormat: 'd/m/Y',
                dataIndex: 'fechafin'
            }
        });
        this.addGridColumn({
            dataIndex: 'sobreestadia',
            header: this.idioma.cgSobreEstadia,
            width: 150,
            align: 'right',
            filter: {
                type: 'numeric',
                dataIndex: 'sobreestadia'
            }
        });
        this.addGridColumn({
            dataIndex: 'importepiezas',
            header: this.idioma.cgImportePiezas,
            width: 150,
            align: 'right',
            filter: {
                type: 'numeric',
                dataIndex: 'importepiezas'
            },
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            dataIndex: 'importeactividad',
            header: this.idioma.cgImporteActividad,
            width: 150,
            align: 'right',
            filter: {
                type: 'numeric',
                dataIndex: 'importeactividad'
            },
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            dataIndex: 'nropedido',
            header: this.idioma.cgNumPedido,
            width: 150,
            align: 'right',
            filter: {
                type: 'string',
                emptyText: 'No. de pedidos',
                dataIndex: 'nropedido'
            },
            //default: true
        });
        /*this.addGridColumn({
         header: this.idioma.cgFechaPedido,
         dataIndex: 'fechapedido',
         width: 90,
         //default: true
         });*/
        /*this.addGridColumn({
         dataIndex: 'estadoorden',
         header: this.idioma.cgActualmentePendPor,
         width: 120,
         renderer: function (value) {
         if (value == 1)
         return 'Falta de piezas';
         return '';
         }
         });*/
        this.addGridColumn({
            dataIndex: 'pieza',
            hidden: true,
            default: true,
        });
        this.addGridColumn({
            dataIndex: 'observaciones',
            header: this.idioma.cgObservaciones,
            width: 150,
            //default: true
            filter: {
                type: 'string',
                emptyText: this.idioma.cgObservaciones,
                dataIndex: 'observaciones'
            },
        });
        this.addGridColumn({
            dataIndex: 'denoconfiguracion',
            header: 'Tipo medio',
            width: 100,
            //default: true
            filter: {
                type: 'string',
                emptyText: 'Tipo medio',
                dataIndex: 'denoconfiguracion'
            },
        });
    },
    getReportes: function (data) {
        var _this = this;
        var desdePM = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null;
        var hastaPM = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null;

        _this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReports: '/distra/logistica/talleres/recuperaciones/PiezasMasUsadas',
                    name: 'PiezasMasUsadas',
                    isList: true,
                    params: {
                        fechainicio: desdePM,
                        fechafin: hastaPM
                                //idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema
                    }
                }
            ]
        }).view();
    },
    getReporteParaGeneral: function (_this) {

        var _this = this;
        arrtipomedio = '{' + _this.parent.comboTipoMedio.getValue() + '}';
        arrestuctura = '{' + _this.parent.comboEstructura.getValue() + '}';
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/ParalizacionesTaller/ParalizacionGeneralNew',
                    isList: true,
                    params: {
                        tipomedio: arrtipomedio,
                        entidades: arrestuctura
                    }
                }
            ]
        });
        this.tipoReportes.view();
        //  } 
    },
    btnBuscar: function () {
        var _this = this;
        var desde = (_this.textDesde) ? _this.textDesde.getValue() : null;
        var hasta = (_this.textHasta) ? _this.textHasta.getValue() : null;
        var arrrango = [];
        if (_this.parent.comboTipoMedio.getValue()) {
            if (desde || hasta) {
                if (_this.getPanelBusqueda().isVisible()) {
                    _this.getPanelBusqueda().listaBotones.getItem(2).handler(_this.getPanelBusqueda().listaBotones.getItem(2));
                } else {
                    _this.getStorePrincipal().filtrado = true;
                    _this.getStorePrincipal().load();
                }
            } else {
                var limit = _this.getGridPrincipal().initialConfig.bbar.pageSize;
                var start = _this.getGridPrincipal().initialConfig.bbar.cursor;
                _this.getStorePrincipal().filtrado = true;
                _this.getStorePrincipal().load();
            }
        }

    },
    btnLimpiar: function () {
        var _this = this;
        if (_this.textDesde.getValue() || _this.textHasta.getValue() || !_this.params.limp) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            if (_this.getPanelBusqueda().isVisible()) {
                _this.getPanelBusqueda().listaBotones.getItem(1).handler(_this.getPanelBusqueda().listaBotones.getItem(1));
            }
            _this.getStorePrincipal().filtrado = false;
            _this.getStorePrincipal().load();
        }
    },
    btnCerrarBA: function () {
        var _this = this;
        if (_this.getPanelBusqueda().isVisible()) {
            _this.getPanelBusqueda().listaBotones.getItem(0).handler(_this.getPanelBusqueda().listaBotones.getItem(0));
        }
    },
    setParams: function (newParams) {
        this.params = newParams;
    },
    view: function () {
        var _this = this;
        //estructura = '{' + _this.parent.comboEstructura.getValue() + '}';
        // _this.getPanelBusqueda().setColumns(1);
        // var cls = LOG.util.UIManager.initColumnForm({
        //     columnas: 2
        // });
        // this.comboClienteBA = new LOG.util.ComboBox({
        //     name: 'clienteba',
        //     width: 250,
        //     url: '/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/cargarClientesba',
        //     displayField: 'cliente',
        //     valueField: 'cliente',
        //     fieldLabel: 'Cliente',
        //     autoLoad: false,
        //    // baseParams: '{' + _this.parent.comboEstructura.getValue() + '}',
        //     mode: 'remote',
        //     minChars:4,
        //     pageSize : 15,
        //     resizable:true
        // });
        // this.cmbSector = new LOG.util.ComboBox({
        //     fieldLabel: 'Sector',
        //     autoLoad: true,
        //     url: '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/cargarSector',
        //     hiddenName: 'idsector',
        //     valueField: 'idsector',
        //     displayField: 'denominacion',
        //     //loadingText: this.idioma.msgCargandoDatos,
        //     triggerAction: 'all',
        //     enableQtip: true
        // });
        // this.comboAgencia = new Ext.form.TriggerField({
        //     name: 'idagencia',
        //     width: 180,
        //     triggerClass: 'x-form-cliente-trigger',
        //     editable: false,
        //     tabular:true,
        //     fieldLabel:this.idioma.labelAgencia,
        //     emptyText: this.idioma.lbSeleccione
        // });
        // this.comboAgencia.onTriggerClick = function(e) {
        //     var ventanaSelectAgencia = new Ext.erp.VentanaSelecionAgencia({
        //         idioma: _this.idioma,
        //         title: _this.idioma.tlVentanaSelectAgencia,
        //         proveedores: _this.arrAgencias,
        //         height: 425,
        //         width: 605
        //     });
        //     ventanaSelectAgencia.show();
        //     ventanaSelectAgencia.tabPanelGeneral.getListTemplate().each(function (temp) {
        //         temp.getStorePrincipal().load();
        //     });
        //     ventanaSelectAgencia.validacionBtn();
        //     ventanaSelectAgencia.aceptarFn = function () {
        //         if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
        //             var recordSeleccionado = ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
        //             if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'estructuras') {
        //                 _this.comboAgencia.setValue(recordSeleccionado.data.entidad);
        //                 _this.panelBusquedaAvanzada.parametros.idestructuraag = recordSeleccionado.data.idestructura;
        //                 _this.panelBusquedaAvanzada.parametros.idagenciaag = null;
        //             }
        //             else if (ventanaSelectAgencia.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'proveedores') {
        //                 _this.panelBusquedaAvanzada.parametros.idagenciaag = recordSeleccionado.data.idclientesproveedores;
        //                 _this.panelBusquedaAvanzada.parametros.idestructuraag = null;
        //                 _this.comboAgencia.setValue(recordSeleccionado.data.nombre);
        //             }
        //             _this.getPanelBusqueda().listaBotones.getItem(2).enable();
        //         }
        //         this.close();
        //     }
        // };
        // cls.addComponent(this.comboClienteBA);
        // cls.addComponent(this.cmbSector);
        // _this.addFilterComponent(cls);

        return  Ext.erp.paralizaciontalleres.GridResumen.superclass.view.call(this);
    },
    validarIdentificador: function (json, dataIndex) {
        var dinamicos = Ext.decode(json.dinamicos);
        var value = '';
        Ext.each(dinamicos, function (o) {
            if (o[o.name] == json.atributoidentificador && o.name.indexOf(dataIndex) != -1)
                value = o[o.name];
            return;
        });
        return value;
    }

});