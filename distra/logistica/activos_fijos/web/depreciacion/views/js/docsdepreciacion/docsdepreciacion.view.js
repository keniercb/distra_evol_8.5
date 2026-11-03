Ext.ns('LOG.aft.docsdepreciacion');
LOG.aft.docsdepreciacion.View = Ext.extend(LOG.util.UITemplate, {
    dirReport: '/logistica/activofijo/depreciacion/',
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma.init());
        this.modelo = new LOG.aft.docsdepreciacion.Model({
            idioma: config.idioma
        });
        //this.concepto = config.idioma.ttBuscar;
        this.concepto = 'documentos de depreciacion';
        this.idGridPrincipal = 'docsdepreciacion';
        this.textBusquedaSimple = 'Nro doc.';
        LOG.aft.docsdepreciacion.View.superclass.constructor.call(this, config);
        this.dirController = '/logistica/activos_fijos/depreciacion/index.php/docsdepreciacion';
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        this.autoLoad = true;
        this.panelBotonesVisible = true;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: 'Nro doc',
            width: 50,
            dataIndex: 'nrodoc',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'nrodoc'
            }
        });
        this.addGridColumn({
            header: 'Año',
            width: 50,
            dataIndex: 'anno',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'anno'
            }
        });
        this.addGridColumn({
            header: 'Fecha',
            width: 100,
            dataIndex: 'fecha',
            default: true,
            filter: {
                type: 'date',
                dataIndex: 'fecha'
            }
        });
        this.addGridColumn({
            header: 'Estado',
            width: 100,
            dataIndex: 'estado',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'estado'
            }
        });
        this.addGridColumn({
            header: 'Tipo de documento',
            width: 150,
            dataIndex: 'tipodoc',
            default: true
        });
        this.addGridColumn({
            header: 'Operación',
            width: 150,
            dataIndex: 'operacion',
            default: true
        });
        this.addGridColumn({
            header: 'Activos',
            width: 50,
            dataIndex: 'activos',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'activos'
            }
        });
        this.addGridColumn({
            header: 'importe',
            width: 80,
            dataIndex: 'importe',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'importe'
            }
        });
        this.addGridColumn({
            header: 'Comprobante',
            width: 90,
            dataIndex: 'comprobante',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'comprobante'
            }
        });
        this.addGridColumn({
            header: 'usuario',
            width: 100,
            dataIndex: 'usuario',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'usuario'
            }
        });
        this.addGridColumn({
            header: 'Observaciones',
            width: 525,
            dataIndex: 'observaciones',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'observaciones'
            }
        });
        this.addGridColumn({
            dataIndex: 'idcomprobante',
        });
    },
    buildReport: function (btn, record) {
        if (!btn.isList) {
            return {
                params: {
                    iddocumento: (this.getGridPrincipal().getSelectionModel().hasSelection()) ? (this.getSmPrincipal().getSelected().json.iddocumento) : null
                },
                dirReport: '/distra/logistica/activofijo/depreciacion/DocumentosModelo'

            }
        }
        else {
            return {
                params: {},
                dirReport: '/distra/logistica/activofijo/depreciacion/ReporteListadoImprimir',
            }
        };
    },
    onReport: function (btn) {
        new LOG.util.Report({
            typeRequest: this.typeRequest,
            typeFormat: this.typeFormat,
            content: this.content,
            paginated: this.paginated,
            isAttachment: this.isAttachment,
            reports: [this.buildReport(btn)]

        }).view();
    },
    initReport: function (id, params) {
        switch (id) {
            case 'LISTADO':
                return {
                    params: {},
                    dirReport: '/distra/logistica/activofijo/depreciacion/ReporteListadoImprimir',
                }
            case 'MODELO':
                return {
                    params: params,
                    dirReport: '/distra/logistica/activofijo/depreciacion/DocumentosModelo'
                }
            case 'MODELO_CENTROCOSTO':
                return {
                    params: params,
                    dirReport: '/distra/logistica/activofijo/depreciacion/DocumentoModeloCentrocosto'
                }
            case 'MODELO_CUENTAS':
                return {
                    params: params,
                    dirReport: '/distra/logistica/activofijo/depreciacion/DocumentosModeloCuentas'
                }
            /*case 'MODELO_MENSUAL':
            return {  
                params: params,
                dirReport: '/distra/logistica/activofijo/depreciacion/RegistroMensualActivos' 
            }
            case 'MODELO_ANUAL':
            return {  
                params: params,
                dirReport: '/distra/logistica/activofijo/depreciacion/RegistroAnualActivos' 
            }*/



            default:
                console.error('ID REPORTE INVALIDO');
                break;
        }
        console.info(id)
    },
    showReport: function (id, params) {
        new LOG.util.Report({
            reports: [this.initReport(id, params)]

        }).view();
    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnActivos,
            tooltip: 'Activos',
            iconCls: 'activosfijos',
            handler: function () {

                if (_this.getSmPrincipal().getSelected().json.iddocumento) {
                    var act = new LOG.aft.docsdepreciacion.activos({
                        iddocumento: _this.getSmPrincipal().getSelected().json.iddocumento,
                        viewConfig: {
                            width: '80%',
                            height: window.innerHeight / 1.3,
                            iddocumento : _this.getSmPrincipal().getSelected().json.iddocumento,
                            title: _this.idioma.tlActivosDepreciados + ' ' + _this.getSmPrincipal().getSelected().json.fecha,
                        }
                    });
                    act.init();
                    act.view();
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('btnActivos')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
            
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnRevertirDepreciacion,
            tooltip: 'Revertir depreciación seleccionada',
            iconCls: 'cerrar',
            handler: function () {
                if (_this.getSmPrincipal().getSelected().json.iddocumento) {
                    mostrarMensaje(2, '¿Est&aacute; seguro que desea revertir la ultima depreciación?', function (btn) {
                        if (btn == "ok") {
                            _this.modelo.revertirUltimaDepreciacion(
                                _this.getGridPrincipal().store,
                                _this.getSmPrincipal().getSelected().json.iddocumento
                            );
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('btnRevertirDepreciacion')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            },

        }));
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            tooltip: this.idioma.ttBtnImprimir,
            hidden: true,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    tooltip: this.idioma.ttBtnImprimir,
                    isList: true,
                    iconCls: 'icondistra-imprimir',
                    name: this.name + 'Listado',
                    handler: _this.onReport.createDelegate(this)
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    tooltip: this.idioma.ttBtnImprimir,
                    isList: false,
                    name: this.name + 'Modelo',
                    iconCls: 'icondistra-imprimir',
                    handler: function () {
                        var params = {
                            iddocumento: (_this.getGridPrincipal().getSelectionModel().hasSelection()) ? (_this.getSmPrincipal().getSelected().json.iddocumento) : null
                        }
                        _this.showReport('MODELO', params)
                    }
                }),
                new Ext.menu.Item({
                    text: 'Modelo centro de costo',
                    tooltip: 'Imprimir Modelo centro de costo',
                    isList: false,
                    name: 'Modelo centro de costo',
                    iconCls: 'icondistra-imprimir',
                    handler: function () {
                        var params = {
                            iddocumento: (_this.getGridPrincipal().getSelectionModel().hasSelection()) ? (_this.getSmPrincipal().getSelected().json.iddocumento) : null
                        }
                        _this.showReport('MODELO_CENTROCOSTO', params)
                    }
                }),
                new Ext.menu.Item({
                    text: 'Modelo activos por cuentas',
                    tooltip: 'Imprimir Modelo depreciación de activos por cuentas',
                    isList: false,
                    name: 'Modelo activos por cuentas',
                    iconCls: 'icondistra-imprimir',
                    handler: function () {
                        var params = {
                            iddocumento: (_this.getGridPrincipal().getSelectionModel().hasSelection()) ? (_this.getSmPrincipal().getSelected().json.iddocumento) : null
                        }
                        _this.showReport('MODELO_CUENTAS', params)
                    }
                }),
                /*new Ext.menu.Item({
                    text: 'Registro de depreciación',
                    tooltip: 'Imprimir Registro de depreciación',
                    isList: false,
                    name: 'Registro de depreciación',
                    iconCls: 'icondistra-imprimir',
                    handler: function(){ 
                         _this.mostrarVentana();
                    }             
                })*/
            ],
            controlFn: function (b, _caller) {

                LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            b.menu.get(1).enable();
                        } else {
                            b.menu.get(1).disable();
                        }
                    }
                }, 'imprimir');
                LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'load') {
                        b.setVisible(this.getCount() > 0);
                    }
                }, 'imprimir');

            }
        }));


    },
    init: function () {
        var _this = this;
        LOG.aft.docsdepreciacion.View.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
            Ext.apply(_this.gpPrincipal, {
                viewConfig: {
                    getRowClass: function (rec, index, rowParams, store) {
                        if (rec.data.estado == 'REVERTIDO')
                            return 'greyrow-text';
                    }
                }
            });

        });
    },
    /*mostrarVentana: function () {
        var _this = this;
        var radioGroup = new Ext.form.RadioGroup({
            fieldLabel: 'Single Column',
            itemCls: 'x-check-group-alt',
            columns: 1,
            anchor: '95%',
            items: [
                { boxLabel: 'Agrupado por meses', name: 'tipo_reporte', inputValue: 'MODELO_MENSUAL', checked: true },
                { boxLabel: 'Agrupado por años', name: 'tipo_reporte', inputValue: 'MODELO_ANUAL' },
            ]
        });

        var comboEjercicio = new Ext.form.ComboBox({
            name: 'ejercicio',
            anchor: '95%',
            displayField: 'nombre',
            valueField: 'idejercicio',
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione un año...',
            selectOnFocus: true,
            store: new Ext.data.Store({
                autoLoad: true,
                url: this.dirController + '/obtenerEjercicios',
                reader: new Ext.data.JsonReader({
                    fields: ['nombre', 'idejercicio'],
                    root: "datos",
                    id: "idejercicio"
                })
            })
        });

        var form = new Ext.FormPanel({
            frame: true,
            minWidth: 480,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    items: [radioGroup]
                },
                {
                    columnWidth: .5,
                    items: [comboEjercicio]
                }]
            }],

        });

        var winReporte = new Ext.Window({
            title: 'Configurar reporte de registro de depreciación',
            closeAction: 'hide',
            constrain: true,
            width: 480,
            modal: true,
            items: [form],
            buttons: [{
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                iconCls: 'cerrar',
                handler: function () {
                    winReporte.hide();
                }
            }, {
                text: 'Imprimir',
                tooltip: 'Imprimir reporte',
                isList: false,
                iconCls: 'icondistra-imprimir',
                name: 'Imprimir',
                handler: function () {
                    var params = {
                        idejercicio: comboEjercicio.getValue()
                    }
                    var idreporte = radioGroup.getValue().getGroupValue();
                    _this.showReport(idreporte, params)
                }
            }
            ]
        });
        winReporte.show();
    }*/

});

LOG.aft.docsdepreciacion.activos = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.data = config.data;
        this.busquedaBasica = true;
        this.iddocumento = config.iddocumento;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'cargarSustitutos';
        this.dirController = '/logistica/activos_fijos/depreciacion/index.php/docsdepreciacion';
        this.autoLoad = false;
        this.autoSelect = false;

        this.crearContenidoVentana();
        LOG.aft.docsdepreciacion.activos.superclass.constructor.call(this, config);
    },
    initDefaultButtons : function () {
        var _this = this;       
        this.btnExportar = LOG.util.Prototipos.botonExportar({
            url: 'imprimirExcel',
    
            objSubmit:({
                iddocumento : _this.iddocumento
            }),   
                      //  obj.params.limit = _this.getGridPrincipal().initialConfig.bbar.pageSize;           
            disabled:false,
            hidden: false,
            handler: function (){
            }
            });
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: 'Nro inventario',
            width: 100,
            dataIndex: 'nroinventario',
            default: true,
            tooltip: 'Nro inventario actual',
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        this.addGridColumn({
            header: 'Valor contable',
            width: 100,
            dataIndex: 'valorcontable',
            default: true,
            align : 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            tooltip: 'Valor contable al momento de la depreciación',
            filter: {
                type: 'numeric',
                dataIndex: 'valorcontable'
            }
        });
        this.addGridColumn({
            header: 'Depreciación del mes',
            width: 150,
            dataIndex: 'depreciacion',
            default: true,
            align : 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            filter: {
                type: 'numeric',
                dataIndex: 'depreciacion'
            }
        });
        this.addGridColumn({
            header: 'Depreciación acumulada',
            width: 150,
            dataIndex: 'depreciacionacumulada',
            tooltip: 'Depreciacion acumulada al momento de la depreciación',
            default: true,
            align : 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            filter: {
                type: 'numeric',
                dataIndex: 'depreciacionacumulada'
            }
        });
        this.addGridColumn({
            header: 'Tasa fiscal',
            width: 100,
            dataIndex: 'tasafiscal',
            tooltip: 'Tasa fiscal al momento de la depreciación',
            default: true,
            align : 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            filter: {
                type: 'numeric',
                dataIndex: 'tasafiscal'
            }
        });
        this.addGridColumn({
            header: 'Método',
            width: 100,
            dataIndex: 'metodo',
            tooltip: 'Método al momento de la depreciación',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'metodo'
            }
        });
        this.addGridColumn({
            header: 'Denominación',
            width: 150,
            dataIndex: 'denominacion',
            default: true,
            tooltip: 'Denominación al momento de la depreciación',
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        this.addGridColumn({
            header: 'Matrícula',
            width: 100,
            dataIndex: 'nromatricula',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nromatricula'
            }
        });
        this.addGridColumn({
            header: 'Marca',
            width: 100,
            dataIndex: 'marca',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'marca'
            }
        });
        this.addGridColumn({
            header: 'Modelo',
            width: 100,
            dataIndex: 'modelo',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'modelo'
            }
        });
        this.addGridColumn({
            header: 'Recursos consumidos',
            width: 150,
            dataIndex: 'recursoconsumido',
            align : 'right',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            filter: {
                type: 'numeric',
                dataIndex: 'recursoconsumido'
            }
        });
        this.addGridColumn({
            header: 'Grupo',
            width: 150,
            dataIndex: 'grupo',
            default: true,
            tooltip: 'Grupo al momento de la depreciación',
            filter: {
                type: 'string',
                dataIndex: 'grupo'
            }
        });
        this.addGridColumn({
            header: 'Naturaleza',
            width: 100,
            dataIndex: 'naturaleza',
            tooltip: 'Naturaleza al momento de la depreciación',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'naturaleza'
            }
        });
        this.addGridColumn({
            header: 'Centro costo',
            width: 100,
            dataIndex: 'centrocosto',
            tooltip: 'Centro costo al momento de la depreciación',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'centrocosto'
            }
        });
        this.addGridColumn({
            header: 'Cuenta',
            width: 100,
            dataIndex: 'cuenta',
            tooltip: 'Cuenta al momento de la depreciación',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'cuenta'
            }
        });
    },
    crearContenidoVentana: function () {
    },
    render: function () {
        var _this = this;
        var render = LOG.aft.docsdepreciacion.activos.superclass.render.call(this);

        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            iddocumento: _this.iddocumento
        });
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getStorePrincipal().load();
        _this.getVistaPrincipal().addButton(_this.btnExportar);    
       
        return render;
    }

})