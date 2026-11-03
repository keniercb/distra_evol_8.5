Ext.ns('LOG.tall.trabajooperarios');
LOG.tall.trabajooperarios.GridPrincipal = Ext.extend(LOG.util.UITemplate, {
    name: 'Trabajo operarios',
    dirReport: '/logistica/talleres/trabajooperarios/',
    arrPersonas: undefined,
    ejercicioActual: undefined,
    periodoActual: undefined,
    autoSelect: false,
    autoLoad: false,
    ultimasOpcionesCargadas: {},
    constructor: function (config) {
        this.busquedaBasica = true;
        this.busquedaAvanzada = false;
        // this.autoSelect = false;
        // this.autoLoad = false;
        this.gridEditable = true;
        this.pruneModifiedRecords = true;
        // this.baseParams = {};
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.dirController = '/logistica/talleres/trabajooperarios/index.php/trabajooperarios';
        config.urlBusquedaGridPrincipal = 'cargarPersonasTrabajo';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.trabajooperarios.Idioma);
        // this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = 'Nombre y apellidos, CI';
        LOG.tall.trabajooperarios.GridPrincipal.superclass.constructor.call(this, config);
        this.smGridPrincipal = new Ext.grid.RowSelectionModel({
            singleSelect: this.modoSeleccion == 2 ? false : true,
            moveEditorOnEnter: false
        });

        // this.modelo = new LOG.tall.trabajooperarios.Model({
        //     idioma: config.idioma,
        //     st: this.getStorePrincipal()
        // });
        // this.autoExpandColumn = 'idnomservicio';
        // this.winGestionarDocumento = new LOG.tall.citas.VentanaAdicionar({
        //     idioma: config.idioma,
        //     modelo: this.modelo,
        //     scope: this,
        //     //title: (config.idioma.tlCrearCita) ? config.idioma.tlCrearCita : config.idioma.tlVentanaGestion,
        //     title: config.idioma.tlCrearCita,
        //     // width: 400,
        //     acciones: this.acciones
        // });

    },
    setPersonas: function (arr) {
        this.arrPersonas = arr;
    },
    desHabilitarEdicion: function () {
        var columnmodel = this.getGridPrincipal().getColumnModel();
        columnmodel.setEditable(columnmodel.findColumnIndex('importeacobrar'), false);
        columnmodel.setEditable(columnmodel.findColumnIndex('observacion'), false);
    },
    habilitarEdicion: function () {
        var columnmodel = this.getGridPrincipal().getColumnModel();
        columnmodel.setEditable(columnmodel.findColumnIndex('importeacobrar'), true);
        columnmodel.setEditable(columnmodel.findColumnIndex('observacion'), true);
    },
    initDefaultColumns: function () {
        var _this = this;
        // this.addGridColumn({
        //     dataIndex: 'iddocumento',
        //     hidden: true
        // });
        this.addGridColumn({
            dataIndex: 'idtrabajooperarios',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idbonpen',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtipobonpen',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idresponsable',
            header: 'CI',
            width: 120,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return _this.getCIById(value);
            }
        });

        this.addGridColumn({
            header: 'Nombre y Apellidos',
            width: 140,
            dataIndex: 'idresponsable',
            autoExpand: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return _this.getUsuarioById(value);
            }
        });

        this.addGridColumn({
            dataIndex: 'importereal',
            align: 'right',
            header: 'Importe real',
            hidden: true,
            width: 120,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
        });

        this.addGridColumn({
            dataIndex: 'importebase',
            align: 'right',
            header: 'Importe base',
            hidden: true,
            width: 120,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
        });

        this.addGridColumn({
            dataIndex: 'bonpen',
            align: 'right',
            header: 'Bonificaion/Penalizacion',
            hidden: true,
            width: 120,
            renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                var positivoNegativo = 1;
                var SigPN = ' (<b>+</b>)';
                if (record.get('idbonpen') == 1) {
                    positivoNegativo = -1;
                    SigPN = ' (<b>-</b>)';
                }
                if (record.get('idtipobonpen') === '0') {
                    return (value * positivoNegativo)+ ' %';
                } else if (record.get('idtipobonpen') === '1') {
                    return Ext.util.Format.number((value), '0,000.00') + SigPN;
                } else if (record.get('idtipobonpen') === '2') {
                    return Ext.util.Format.number((value), '0,000.00');
                } else {
                    return Ext.util.Format.number(value, '0,000.00');
                }
            },
        });

        this.addGridColumn({
            dataIndex: 'importeacobrar',
            align: 'right',
            header: 'Monto a cobrar',
            width: 120,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            // editor: new LOG.util.Prototipos.inputDecimal({
            //     decimalPrecision: 2,
            //     validarEnFormBasico: false,
            //     minValue: 0
            // })
        });

        this.addGridColumn({
            dataIndex: 'observacion',
            align: 'left',
            header: 'Observacion',
            width: 120,
            // editor: new LOG.util.Prototipos.inputTexto({
            //     // anchor: '95%',
            //     // autoCreate: true,
            //     // allowBlank: false,
            //     // regex: /^[0-9]+(\.[0-9][0-9]?)?$/
            // }),
        });

        this.addGridColumn({
            dataIndex: 'aprobado',
            align: 'left',
            header: 'Aprobado',
            width: 100,
        });

    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
            // text: this.idioma.lbBtnNuevo,
            // tooltip: this.idioma.ttBtnAdicionarCita,
            // scope: _this,
            disabled: true,
            handler: function () {
                _this.aprobarSalario();
                // _this.initVentanaGestion(null, 1, null, null);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: 'Desaprobar',
            // tooltip: this.idioma.ttBtnAdicionarCita,
            // scope: _this,
            disabled: true,
            iconCls: 'desaprobar',
            handler: function () {
                _this.desAprobarSalario();
                // _this.initVentanaGestion(null, 1, null, null);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            // tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: 'Imprimir listado',
                    // tooltip: this.idioma.ttBtnImprimir,
                    iconCls: 'icondistra-imprimir',
                    handler: _this.viewReport.createDelegate(this, [1])
                }),
                new Ext.menu.Item({
                    text: 'Imprimir listado detallado',
                    // tooltip: this.idioma.ttBtnImprimir,
                    iconCls: 'icondistra-imprimir',
                    // hidden: true,
                    handler: _this.viewReport.createDelegate(this, [2])
                })
            ],
            controlFn: function (b, _caller) {
                if (_this.grantedAction('ct') || _this.grantedAction('all') || _this.grantedAction('RCRUD') || _this.grantedAction('RImprimir')) {
                    b.setVisible(true);
                    // LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                    //     if (e == 'selectionchange') {
                    //         b.menu.get(1).setVisible(this.getCount() == 1);
                    //     }
                    // }, 'imprimir');
                    // LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                    //     if (e == 'load') {
                    //         b.setVisible(this.getCount() > 0);
                    //     }
                    // }, 'imprimir');
                } else {
                    b.setVisible(false);
                }
            }
        }));

    },
    // view: function () {
    //     console.log('view');
    //     return LOG.tall.trabajooperarios.View.superclass.view.call(this);
    // },
    render: function () {
        var _this = this;
        var vista = LOG.tall.trabajooperarios.GridPrincipal.superclass.render.call(this);
        // this.gpPrincipal.autoExpandColumn = 'idnomservicio';
        // this.crearDateFieldInicioFin();
        this.crearComboEjercicioMes();
        this.crearComboArea();
        var comboEjercicio = this.getComboEjercicio();
        var comboMeses = this.getComboMes();
        var comboArea = this.getComboArea();
        // var dateinicio = this.getDateFieldInicio();
        // var datefin = this.getDateFieldFin();
        this.getGridPrincipal().getTopToolbar().add(comboEjercicio, '-', comboMeses, '->');
        this.getPanelSuperior().getTopToolbar().add('->', comboArea);

        this.getStorePrincipal().on({
            beforeload: function (st, opt) {
                var params = _this.cargarParametrosBase();
                Ext.apply(opt.params, params);
            },
            load: function (st, records, opt) {
                _this.ultimasOpcionesCargadas = opt;
            }
        });

        comboMeses.on({
            select: function (cb, record, index) {
                _this.getStorePrincipal().load();
            }
        });

        comboArea.on({
            select: function (cb, record, index) {
                _this.getStorePrincipal().load();
            }
        });

        this.getSmPrincipal().on({
            selectionchange: function (sm) {
                if (_this.listaBotones.getItem(0).isVisible()) {
                    var records = sm.getSelections();

                    if (records.length && comboMeses.getValue() == _this.periodoActual) {
                        _this.listaBotones.getItem(0).enable();
                        _this.listaBotones.getItem(1).enable();
                    } else {
                        _this.listaBotones.getItem(0).disable();
                        _this.listaBotones.getItem(1).disable();
                    }
                }
            }
        });

        this.validador = new LOG.util.ComprobarCond();
        this.validador
            .add('', _this.validador.AND, function () {
                return _this.grantedAction('RPuedeEditar');
            })
            .add('', _this.validador.AND, function () {
                return (comboMeses.getValue() == _this.periodoActual);
            })
            .add('', _this.validador.AND, function (data) {
                return (!data.aprobado);
            })
        ;

        this.getGridPrincipal().on({
            // beforeedit: function (obj) {
            //     if (!(_this.validador.comprobarCond(obj.record.data))) {
            //         return false;
            //     }
            // },
            celldblclick: function (grid, rowIndex, columnIndex, eventObject) {
                var dataindex = grid.getColumnModel().getDataIndex(columnIndex);
                var data = _this.getStorePrincipal().getAt(rowIndex);
                if (dataindex === 'importeacobrar' && _this.validador.comprobarCond(data.data) && data.data.idtrabajooperarios) {
                    var datos = _this.getComboMes().getRecordSelected();
                    var venta = new LOG.tall.trabajooperarios.GridBonificacionPenalizacion({
                        idioma: _this.idioma,
                        idtrabajooperarios: data.data.idtrabajooperarios,
                        idresponsable: data.data.idresponsable,
                        idperiodo: datos.json.idperiodo,
                        importebase: data.data.importebase
                    });
                    venta.init();
                    venta.view();
                    venta.on({
                        close: function () {
                            _this.getStorePrincipal().load();
                        }
                    });
                    // venta.getStorePrincipal().load();
                    // venta.getVistaPrincipal().aceptarFn = function () {
                    //     var arrSelected = venta.getSmPrincipal().getSelections();
                    //     _this.adicionarRecords(arrSelected);
                    //     // Ext.each(arrSelected, function (recDelete) {
                    //     //     venta.getStorePrincipal().remove(recDelete);
                    //     // });
                    // }
                } else if(dataindex === 'importeacobrar' && data.data.idtrabajooperarios) {
                    var datos = _this.getComboMes().getRecordSelected();
                    var venta = new LOG.tall.trabajooperarios.GridBonificacionPenalizacion({
                        idioma: _this.idioma,
                        modo: 2,//1-normal, 2-solo ver
                        idtrabajooperarios: data.data.idtrabajooperarios,
                        idresponsable: data.data.idresponsable,
                        idperiodo: datos.json.idperiodo,
                        importebase: data.data.importebase
                    });
                    venta.init();
                    venta.view();
                    venta.on({
                        close: function () {
                            _this.getStorePrincipal().load();
                        }
                    });
                }
            }
        });

        // dateinicio.on({
        //     change: function (field, newVal, oldVal) {
        //         _this.getStorePrincipal().load();
        //     }
        // });
        // datefin.on({
        //     change: function (field, newVal, oldVal) {
        //         _this.getStorePrincipal().load();
        //     }
        // });


        return vista;
    },
    cargarParametrosBase: function () {
        var params = {};
        var datos = this.getComboMes().getRecordSelected();
        if (datos) {
            params.fechaInicio = datos.json.inicio;
            params.fechaFin = datos.json.fin;
            params.idPeriodo = datos.json.idperiodo;
        }
        if (this.getComboArea().getValue()) {
            params.idArea = this.getComboArea().getValue();
        }

        return params;
    },
    setDatosEjerMes: function (datos) {
        var ejercicios = datos.ejercicios;
        var periodoss = datos.periodos;
        this.ejercicioActual = datos.ejercicioactual;
        this.periodoActual = datos.periodoactual;

        this.getComboEjercicio().getStore().loadData({datos: ejercicios});
        this.getComboEjercicio().setValue(this.ejercicioActual);
        this.getComboMes().getStore().loadData({datos: periodoss});
        this.getComboMes().setValue(this.periodoActual);
    },
    aprobarSalario: function () {
        var _this = this;
        var records = this.getSmPrincipal().getSelections();
        var ids = [];
        Ext.each(records, function (r) {
            if (r.get('idtrabajooperarios')) {
                ids.push(r.get('idtrabajooperarios'));
            }
            // r.set('aprobado', 'Aprobado');
        });
        if (!ids.length) {
            return;
        }
        var parametros = {
            idstrabajooperarios: json_encode(ids)
        };

        Ext.Ajax.request({
            url: '/logistica/talleres/trabajooperarios/index.php/trabajooperarios/aprobarSalario',
            method: 'POST',
            scope: undefined,
            params: parametros,
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);
                if (responseData.success) {
                    mostrarMensaje(1, 'Se ha aprobado correctamente.');
                    _this.getStorePrincipal().load();
                }
            }
        });
    },
    desAprobarSalario: function () {
        var _this = this;
        var records = this.getSmPrincipal().getSelections();
        var ids = [];
        Ext.each(records, function (r) {
            if (r.get('idtrabajooperarios') && r.get('aprobado')) {
                ids.push(r.get('idtrabajooperarios'));
            }
            // r.set('aprobado', '');
        });
        if (!ids.length) {
            return;
        }
        var parametros = {
            idstrabajooperarios: json_encode(ids)
        };

        Ext.Ajax.request({
            url: '/logistica/talleres/trabajooperarios/index.php/trabajooperarios/desAprobarSalario',
            method: 'POST',
            scope: undefined,
            params: parametros,
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);
                if (responseData.success) {
                    mostrarMensaje(1, 'Se ha desaprobado correctamente.');
                    _this.getStorePrincipal().load();
                }
            }
        });
    },
    crearComboEjercicioMes: function () {

        this.comboEjercicio = new LOG.util.ComboBox({
            autoLoad: false,
            valueField: 'idejercicio',
            displayField: 'nombre',
            fieldLabel: 'Ejercicio',
            emptyText: 'Seleccione ejercicio',
            width: 100,
        });

        this.comboMes = new LOG.util.ComboBox({
            autoLoad: false,
            valueField: 'idperiodo',
            displayField: 'nombre',
            fieldLabel: 'Meses',
            emptyText: 'Seleccione mes',
            width: 100,
            url: this.dirController + '/cargarMeses',
            // mode: 'remote'
        });

        this.comboEjercicio.on({
            scope: this,
            select: function (cb) {
                this.comboMes.clearValue();
                this.comboMes.getStore().load({
                    params: {
                        idejercicio: cb.getValue()
                    }
                });
            }
        });
    },
    getComboEjercicio: function () {
        return this.comboEjercicio;
    },
    getComboMes: function () {
        return this.comboMes;
    },
    crearComboArea: function () {
        this.comboArea = new LOG.util.ComboBox({
            autoLoad: true,
            valueField: 'id',
            displayField: 'denominacion',
            fieldLabel: 'Area',
            emptyText: 'Seleccione area',
            url: this.dirController + '/cargarAreasDelTaller',
            // width: 100,
        });
    },
    getComboArea: function () {
        return this.comboArea;
    },
    crearDateFieldInicioFin: function () {

        this.dateFieldInicio = new Ext.form.DateField({
            fieldLabel: 'Fecha incicio',
            allowBlank: true,
            value: this.fechaInicio,
            maxValue: this.fechaContable,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            anchor: '100%'
        });

        this.dateFieldFin = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            allowBlank: true,
            value: this.fechaContable,
            maxValue: this.fechaContable,
            minValue: this.fechaInicio,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            anchor: '100%'
        });

        this.dateFieldInicio.on({
            scope: this,
            change: function (field, newVal, oldVal) {
                this.dateFieldFin.setMinValue(newVal);
                // var storeLiq = this.gridPanelObligaciones.getStore();
                // storeLiq.baseParams.fechainicio = newVal.toLocaleDateString();
            }
        });

        this.dateFieldFin.on({
            scope: this,
            change: function (field, newVal, oldVal) {
                this.dateFieldInicio.setMaxValue(newVal);
                // var storeLiq = this.gridPanelObligaciones.getStore();
                // storeLiq.baseParams.fechafin = newVal.toLocaleDateString();
            }
        });
    },
    getDateFieldInicio: function () {
        return this.dateFieldInicio;
    },
    getDateFieldFin: function () {
        return this.dateFieldFin;
    },
    getUsuarioById: function (value) {
        var denom = value;
        Ext.each(this.arrPersonas, function (r) {
            if (value == r['idpersona']) {
                denom = r['nombreapellidos'];
            }
        });
        return denom;
    },
    getCIById: function (value) {
        var denom = value;
        Ext.each(this.arrPersonas, function (r) {
            if (value == r['idpersona']) {
                denom = r['numid'];
            }
        });
        return denom;
    },
    viewReport: function (tipo) {
        var _this = this;
        new LOG.util.Report({
            typeRequest: 'auto',
            typeFormat: 'HTML',
            content: 'text/HTML',
            paginated: true,
            isAttachment: false,
            reports: [_this.buildReport(tipo)]
        }).view();
    },
    buildReport: function (tipo) {
        return {
            name: (tipo === 2 ? 'OrdenTrabajoOperariosDetallado' : 'OrdenTrabajoOperarios'),
            description: 'Lol',
            isList: true,
            params: this.getParamsReport(),
            dirReport: '/distra/logistica/talleres/ordentrabajo/' + (tipo === 2 ? 'OrdenTrabajoOperariosDetallado' : 'OrdenTrabajoOperarios'),
            // uiSearch: (btn.isList && this.busquedaAvanzada) ? this.panelBusquedaAvanzada : {}
        };
    },
    getParamsReport: function () {
        var params = this.ultimasOpcionesCargadas.params;
        var ret = {};
        if (idEntidad) {
            ret.idestructura = idEntidad
        }
        if (params.idPeriodo) {
            ret.idperiodo = params.idPeriodo
        }
        if (params.idArea) {
            ret.idarea = params.idArea
        }
        if (params.fechaInicio) {
            ret.fechainicio = params.fechaInicio
        }
        if (params.fechaFin) {
            ret.fechafin = params.fechaFin
        }
        if (params.criterio) {
            ret.criterioper = params.criterio
        }
        return ret;
    },
    isValid: function () {
        var result = false;

        var records = this.getStorePrincipal().getModifiedRecords();
        if (records.length) {
            result = true;
        }

        return result;
    },
    getModificaciones: function () {
        var result = [];
        var records = this.getStorePrincipal().getModifiedRecords();
        Ext.each(records, function (record) {
            result.push(record.data);
        });
        return result;
    }
});

LOG.tall.trabajooperarios.GridDetalle = Ext.extend(LOG.util.UITemplate, {
    name: 'Trabajo operarios',
    dirReport: '/logistica/talleres/trabajooperarios/',
    idPersonaOrdenTrabajo: undefined,
    ultimasOpcionesCargadas: {},
    constructor: function (config) {
        this.busquedaBasica = true;
        this.busquedaAvanzada = false;
        this.autoLoad = false;
        this.gridEditable = true;
        this.pruneModifiedRecords = true;
        // this.baseParams = {};
        config.orderField = 'nrodoc';
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 1;
        this.dirController = '/logistica/talleres/trabajooperarios/index.php/trabajooperarios';
        config.urlBusquedaGridPrincipal = 'cargarPersonasTrabajoActividades';
        // this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.trabajooperarios.Idioma);
        this.idioma = config.idioma;
        // this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = 'No. Orden de trabajo';
        LOG.tall.trabajooperarios.GridDetalle.superclass.constructor.call(this, config);
        this.smGridPrincipal = new Ext.grid.RowSelectionModel({
            singleSelect: this.modoSeleccion == 2 ? false : true,
            moveEditorOnEnter: false
        });
    },
    desHabilitarEdicion: function () {
        var columnmodel = this.getGridPrincipal().getColumnModel();
        columnmodel.setEditable(columnmodel.findColumnIndex('coeficiente'), false);
        columnmodel.setEditable(columnmodel.findColumnIndex('dimension'), false);
        columnmodel.setEditable(columnmodel.findColumnIndex('importeacobrar'), false);
    },
    habilitarEdicion: function () {
        var columnmodel = this.getGridPrincipal().getColumnModel();
        columnmodel.setEditable(columnmodel.findColumnIndex('coeficiente'), true);
        columnmodel.setEditable(columnmodel.findColumnIndex('dimension'), true);
        columnmodel.setEditable(columnmodel.findColumnIndex('importeacobrar'), true);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'tipo',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'importebase',
            header: 'Importe base',
            hidden: true,
            // renderer: function (v) {
            //     return Ext.util.Format.number(v, '0,000.00');
            // },
        });
        this.addGridColumn({
            dataIndex: 'gastosbase',
            header: 'Gasto base',
            hidden: true,
            // renderer: function (v) {
            //     return Ext.util.Format.number(v, '0,000.00');
            // },
        });
        this.addGridColumn({
            dataIndex: 'idtrabajooperariosdetallado',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtrabajooperarios',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: 'Orden Trabajo',
            hidden: true,
            agrupador: true,
            renderer: function (v) {
                if (v) {
                    return 'Orden de trabajo # ' + v;
                } else {
                    return Ext.util.Format.number(v, '0,000.00');
                }
            },
        });

        this.addGridColumn({
            dataIndex: 'actividad',
            header: 'Actividad',
            width: 120,
            autoExpand: true,
        });

        this.addGridColumn({
            dataIndex: 'minimo',
            align: 'left',
            header: 'Mínimo',
            width: 100,
            // renderer: function (v) {
            //     return Ext.util.Format.number(v, '0,000.00');
            // },
            // renderer: function (v) {
            //     if (isNaN(v)) {
            //         return v;
            //     } else {
            //         return v + ' %';
            //     }
            // },
        });
        this.addGridColumn({
            dataIndex: 'maximo',
            align: 'left',
            header: 'Máximo',
            width: 100,
            // renderer: function (v) {
            //     return Ext.util.Format.number(v, '0,000.00');
            // },
            // renderer: function (v) {
            //     if (isNaN(v)) {
            //         return v;
            //     } else {
            //         return v + ' %';
            //     }
            // },
        });

        this.addGridColumn({
            dataIndex: 'coeficiente',
            align: 'left',
            header: 'Coeficiente',
            width: 100,
            // renderer: function (v) {
            //     return Ext.util.Format.number(v, '0,000.00');
            // },
            editor: new LOG.util.Prototipos.inputDecimal({
                decimalPrecision: 2,
                validarEnFormBasico: false,
                minValue: 0
            })
            // renderer: function (v) {
            //     if (isNaN(v)) {
            //         return v;
            //     } else {
            //         return v + ' %';
            //     }
            // },
        });

        this.addGridColumn({
            dataIndex: 'dimension',
            align: 'left',
            header: 'Dimensión',
            width: 80,
            editor: new LOG.util.Prototipos.inputDecimal({
                decimalPrecision: 2,
                validarEnFormBasico: false,
                minValue: 0
            })
            // renderer: function (v) {
            //     return Ext.util.Format.number(v, '0,000.00');
            // },
        });

        this.addGridColumn({
            dataIndex: 'importeacobrar',
            align: 'right',
            header: 'Importe',
            width: 100,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            },
            // editor: new LOG.util.Prototipos.inputEntero({
            //     validarEnFormBasico: false,
            //     minValue: 0,
            //     // maxValue: 100
            // }),
            editor: new LOG.util.Prototipos.inputDecimal({
                decimalPrecision: 2,
                validarEnFormBasico: false,
                minValue: 0
            })
        });

        this.addGridColumn({
            dataIndex: 'nrofactura',
            align: 'left',
            header: 'No. factura',
            width: 100,
            hidden: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            handler: _this.viewReport.createDelegate(this),
            // itemId: 'btnImprimir',
            // tooltip: this.idioma.ttBtnImprimir,
            // menu: [
            //     new Ext.menu.Item({
            //         text: 'Imprimir listado',
            //         // tooltip: this.idioma.ttBtnImprimir,
            //         iconCls: 'icondistra-imprimir',
            //         // handler: _this.onReport.createDelegate(this)
            //     }),
            //     new Ext.menu.Item({
            //         text: 'Imprimir listado detallado',
            //         // tooltip: this.idioma.ttBtnImprimir,
            //         iconCls: 'icondistra-imprimir',
            //         // hidden: true,
            //         // handler: _this.onReport.createDelegate(this)
            //     })
            // ],
            controlFn: function (b, _caller) {
                if (_this.grantedAction('ct') || _this.grantedAction('all') || _this.grantedAction('RCRUD') || _this.grantedAction('RImprimir')) {
                    b.setVisible(true);
                    // LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                    //     if (e == 'selectionchange') {
                    //         b.menu.get(1).setVisible(this.getCount() == 1);
                    //     }
                    // }, 'imprimir');
                    // LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                    //     if (e == 'load') {
                    //         b.setVisible(this.getCount() > 0);
                    //     }
                    // }, 'imprimir');
                } else {
                    b.setVisible(false);
                }
            }
        }));

    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.trabajooperarios.GridDetalle.superclass.render.call(this);
        // this.gpPrincipal.autoExpandColumn = 'idnomservicio';
        var cbservicio = this.getComboServicio();
        var cbactividad = this.getComboActividad();
        this.getGridPrincipal().getTopToolbar().add(cbservicio, '-', cbactividad, '->');

        this.getStorePrincipal().on({
            beforeload: function (st, opt) {
                opt.params = Ext.apply(opt.params, _this.paramsTO);
                opt.params.idpersona = _this.idPersonaOrdenTrabajo;
                // opt.params.fechaInicio = _this.fechaInicio;
                // opt.params.fechaFin = _this.fechaFin;
                // opt.params.idPeriodo = _this.idPeriodo;
                opt.params.idservicio = cbservicio.getValue();
                opt.params.idactividad = cbactividad.getValue();
                cbservicio.clearValue();
                cbactividad.clearValue();
                cbservicio.getStore().removeAll();
                cbactividad.getStore().removeAll();
            },
            load: function (st, records, opt) {
                if (_this.idPersonaOrdenTrabajo === undefined) {
                    st.removeAll();
                } else {
                    cbservicio.getStore().load();
                    cbactividad.getStore().load();
                }
                _this.ultimasOpcionesCargadas = opt;
            }
        });

        cbservicio.getStore().on({
            beforeload: function (st, opt) {
                opt.params.idpersona = _this.idPersonaOrdenTrabajo;
                opt.params.fechaInicio = _this.fechaInicio;
                opt.params.fechaFin = _this.fechaFin;
            }
        });

        cbservicio.on({
            select: function () {
                _this.getStorePrincipal().load();
            }
        });

        cbactividad.on({
            select: function () {
                _this.getStorePrincipal().load();
            }
        });

        cbactividad.getStore().on({
            beforeload: function (st, opt) {
                opt.params.idpersona = _this.idPersonaOrdenTrabajo;
                opt.params.fechaInicio = _this.fechaInicio;
                opt.params.fechaFin = _this.fechaFin;
            }
        });

        this.getGridPrincipal().on({
            // validateedit: function (e) {
            //
            // },
            beforeedit: function (e) {
                if (!_this.sePuedeEditar()) {
                    return false;
                }
            },
            afteredit: function (e) {
                if (e.field === 'coeficiente') {
                    var importe = _this.calcularImporteACobrar(
                        e.record.get('tipo'),
                        e.record.get('importebase'),
                        e.record.get('gastosbase'),
                        e.record.get('coeficiente'),
                        e.record.get('dimension'),
                    );
                    e.record.set('importeacobrar', importe);
                }
                if (e.field === 'dimension') {
                    var importe = _this.calcularImporteACobrar(
                        e.record.get('tipo'),
                        e.record.get('importebase'),
                        e.record.get('gastosbase'),
                        e.record.get('coeficiente'),
                        e.record.get('dimension'),
                    );
                    e.record.set('importeacobrar', importe);
                }
            },
        });

        return vista;
    },
    getComboServicio: function () {
        if (typeof this.comboServicio === 'undefined') {
            this.comboServicio = new LOG.util.ComboBox({
                autoLoad: false,
                valueField: 'idactividad',
                displayField: 'denominacion',
                fieldLabel: 'Servicio',
                emptyText: 'Seleccione servicio',
                width: 150,
                url: this.dirController +  '/cargarActividadesPadrePersona',
            });
        }
        return this.comboServicio;
    },
    getComboActividad: function () {
        if (typeof this.comboActividad === 'undefined') {
            this.comboActividad = new LOG.util.ComboBox({
                autoLoad: false,
                valueField: 'idactividad',
                displayField: 'denominacion',
                fieldLabel: 'Actividad',
                emptyText: 'Seleccione actividad',
                width: 150,
                url: this.dirController + '/cargarActividadesPersona',
            });
        }
        return this.comboActividad;
    },
    cargarComponente: function (idpersona, paramsTO, sePuedeEditar) {
        if (idpersona) {
            this.idPersonaOrdenTrabajo = idpersona;
            this.paramsTO = paramsTO;
            this.fechaInicio = paramsTO.fechainicio;
            this.fechaFin = paramsTO.fechafin;
            this.idPeriodo = paramsTO.idperiodo;
            this.sePuedeEditar = sePuedeEditar;
            this.habilitarBtnCampos();
            this.getGridPrincipal().getStore().load();
        }
    },
    limpiarComponente: function () {
        if (this.idPersonaOrdenTrabajo) {
            this.idPersonaOrdenTrabajo = undefined;
            this.fechaInicio = undefined;
            this.fechaFin = undefined;
            this.idPeriodo = undefined;
            this.comboServicio.clearValue();
            this.comboActividad.clearValue();
            this.gridFilter.tfBusqueda.setValue(null);
            // console.log(this.gridFilter);
            this.getStorePrincipal().removeAll();
            this.deshabilitarBtnCampos();
        }
    },
    deshabilitarBtnCampos: function () {
        // this.listaBotones.getItem(0).disable();
        this.getVistaPrincipal().disable();
        // var columnmodel = this.getGridPrincipal().getColumnModel();
        // columnmodel.setEditable(columnmodel.findColumnIndex('idresponsable'), false);
    },
    habilitarBtnCampos: function () {
        // this.listaBotones.getItem(0).disable();
        this.getVistaPrincipal().enable();
        // var columnmodel = this.getGridPrincipal().getColumnModel();
        // columnmodel.setEditable(columnmodel.findColumnIndex('idresponsable'), false);
    },
    viewReport: function () {
        var _this = this;
        new LOG.util.Report({
            typeRequest: 'auto',
            typeFormat: 'HTML',
            content: 'text/HTML',
            paginated: true,
            isAttachment: false,
            reports: [_this.buildReport()]
        }).view();
    },
    buildReport: function () {
        return {
            name: 'OrdenTrabajoOperariosDetallado',
            description: 'Lol',
            isList: true,
            params: this.getParamsReport(),
            dirReport: '/distra/logistica/talleres/ordentrabajo/' + 'OrdenTrabajoOperariosDetallado',
            // uiSearch: (btn.isList && this.busquedaAvanzada) ? this.panelBusquedaAvanzada : {}
        };
    },
    getParamsReport: function () {
        var params = this.ultimasOpcionesCargadas.params;
        var ret = {};
        if (idEntidad) {
            ret.idestructura = idEntidad
        }
        if (params.idPeriodo) {
            ret.idperiodo = params.idPeriodo
        }
        if (params.idArea) {
            ret.idarea = params.idArea
        }
        if (params.fechaInicio) {
            ret.fechainicio = params.fechaInicio
        }
        if (params.fechaFin) {
            ret.fechafin = params.fechaFin
        }
        if (params.idpersona) {
            ret.idpersona = params.idpersona
        }
        if (params.idservicio) {
            ret.idservicio = params.idservicio
        }
        if (params.idactividad) {
            ret.idactividad = params.idactividad
        }
        if (params.criterioper) {
            ret.criterioper = params.criterioper
        }
        if (params.criterio) {
            ret.criterio = params.criterio
        }
        return ret;
    },
    getImporteActividadPorcentual: function (importeActividad, gastoMateriales, coeficiente) {
        var importe = 0;
        if (coeficiente) {
            if (gastoMateriales) {
                importe = (importeActividad - gastoMateriales)*(coeficiente/100);
            } else {
                importe = (importeActividad)*(coeficiente/100);
            }
        }
        return importe ? (Math.round(importe * 100) / 100) : importe;
    },
    getImporteActividadUM: function (gastoMateriales, coeficiente, dimension) {
        var importe = 0;
        if (coeficiente && dimension) {
            if (gastoMateriales) {
                importe = (dimension*coeficiente) - gastoMateriales;
            } else {
                importe = dimension*coeficiente;
            }
        }
        return importe ? (Math.round(importe * 100) / 100) : importe;
    },
    getImporteActividadFija: function (gastoMateriales, coeficiente) {
        var importe = 0;
        if (coeficiente) {
            if (gastoMateriales) {
                importe = (coeficiente) - gastoMateriales;
            } else {
                importe = coeficiente;
            }
        }
        return importe ? (Math.round(importe * 100) / 100) : importe;
    },
    calcularImporteACobrar: function (tipo, importeActividad, gastoMateriales, coeficiente, dimension) {
        if (tipo == 1) {
            return this.getImporteActividadPorcentual(importeActividad, gastoMateriales, coeficiente)
        } else if (tipo == 2) {
            return this.getImporteActividadUM(gastoMateriales, coeficiente, dimension);
        } else if (tipo == 3) {
            return this.getImporteActividadFija(gastoMateriales, coeficiente);
        }
        return 0;
    },
    isValid: function () {
        var result = false;

        var records = this.getStorePrincipal().getModifiedRecords();
        if (records.length) {
            result = true;
        }

        return result;
    },
    getModificaciones: function () {
        var result = [];
        var records = this.getStorePrincipal().getModifiedRecords();
        Ext.each(records, function (record) {
            result.push(record.data);
        });
        return result;
    }
});

LOG.tall.trabajooperarios.GridBonificacionPenalizacion = Ext.extend(LOG.util.UITemplate, {
    modo: 1,//1-normal, 2-solo ver
    nombrepersona: '',
    fechaactual: '',
    idtrabajooperarios: '',
    idresponsable: '',
    idperiodo: '',
    importebase: '',
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = true;
        this.panelBotonesVisible = true;
        this.dirController = '/logistica/talleres/trabajooperarios/index.php/trabajooperarios';
        this.urlBusquedaGridPrincipal = 'cargarBonPen';
        this.busquedaBasica = false;
        var _this = this;
        this.addEvents('close');
        config.viewConfig = {
            buttons: [
                LOG.util.Prototipos.botonCancelar({
                    handler: function () {
                        _this.fireEvent('close');
                        _this.getVistaPrincipal().close();
                    }
                }, true)
            ]
        };
        // this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.trabajooperarios.GridBonificacionPenalizacion.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = 'Aplicar Bonificacion/Penalizacion';
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idbonificacionpenalizacion',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtrabajooperarios',
            hidden: true
        });
        //0-bonificacion
        //1-penalizacion
        this.addGridColumn({
            dataIndex: 'idbonpen',
            hidden: true
        });
        //0-cancelado
        //1-estado por def
        this.addGridColumn({
            dataIndex: 'idestado',
            hidden: true
        });
        //1-por porciento del importe original
        //2-por un importe especifico
        this.addGridColumn({
            dataIndex: 'idtipobonpen',
            hidden: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Importe original',
            width: 120,
            dataIndex: 'importebase',
            default: true
        }));
        this.addGridColumn({
            header: 'Bon/Pen',
            width: 120,
            dataIndex: 'bonpen',
            default: true,
            renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                var positivoNegativo = 1;
                var SigPN = ' (<b>+</b>)';
                if (record.get('idbonpen') == 1) {
                    positivoNegativo = -1;
                    SigPN = ' (<b>-</b>)';
                }
                if (record.get('idtipobonpen') === '0') {
                    return Ext.util.Format.number((value * positivoNegativo), '0,000.00') + ' %';
                } else if (record.get('idtipobonpen') === '1') {
                    return Ext.util.Format.number((value), '0,000.00') + SigPN;
                } else if (record.get('idtipobonpen') === '2') {
                    return Ext.util.Format.number((value), '0,000.00');
                } else {
                    return 'arrr';
                }
            }
        });
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Importe actual',
            width: 120,
            renderer: function (v, k, j) {
                return _this.calcularImporteSegunTipoBonPen(
                    j.data.idbonpen,
                    j.data.idtipobonpen,
                    j.data.importebase,
                    j.data.bonpen
                );
            }
        }));
        this.addGridColumn({
            header: 'Observacion',
            width: 120,
            dataIndex: 'observacion',
            default: true
        });
        this.addGridColumn({
            header: 'Usuario',
            width: 120,
            dataIndex: 'user',
            default: true
        });
        this.addGridColumn({
            header: 'Observacion cancel',
            width: 120,
            dataIndex: 'observacioncancel',
            default: true
        });
        this.addGridColumn({
            header: 'Usuario cancel',
            width: 120,
            dataIndex: 'usercancel',
            default: true
        });

    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonAdicionar({
            // tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                var venta = new LOG.tall.trabajooperarios.VentanaAddBonificacionPenalizacion({
                    idioma: _this.idioma,
                    idtrabajooperarios: _this.idtrabajooperarios,
                    idresponsable: _this.idresponsable,
                    idperiodo: _this.idperiodo,
                    importebase: _this.importebase,
                });
                venta.init();
                var view = venta.view();
                view.on({
                    addbonpen: function (idadd, idtrabajooperarios) {
                        _this.idtrabajooperarios = idtrabajooperarios;
                        _this.getStorePrincipal().load();
                    }
                });
            },
            controlFn: function (b, _caller) {
                // if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                //     b.setVisible(true);
                // }
                // else  b.setVisible(false);

                if (_this.modo === 1) {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonCancelar({
            isContextual: true,
            disabled: true,
            handler: function () {
                var selected = _this.getGridPrincipal().getSelectionModel().getSelected();
                var venta = new LOG.tall.trabajooperarios.VentanaCancelBonificacionPenalizacion({
                    idioma: _this.idioma,
                    idtrabajooperarios: selected.get('idtrabajooperarios'),
                    idbonificacionpenalizacion: selected.get('idbonificacionpenalizacion')
                });
                venta.init();
                var view = venta.view();
                view.on({
                    cancelbonpen: function () {
                        _this.getStorePrincipal().load();
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_this.modo === 2) {
                    b.disable();
                } else {
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            var selected = _caller.getGridPrincipal().getSelectionModel().getSelected();
                            if (this.getCount() == 1 && selected.get('idestado') == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                        if (e == 'rowdeselect' && this.getCount() == 0) {
                            b.disable();
                        }
                    });
                }
            }
        }));
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.trabajooperarios.GridBonificacionPenalizacion.superclass.render.call(this);
        this.storePrincipal.on('beforeload', function (store) {
            store.initBaseParams = {
                idtrabajooperarios: _this.idtrabajooperarios
            };
        });
        this.storePrincipal.load();
        // this.storePrincipal.on('load', function (store, records) {
        //     if (store.getCount() == 0) {
        //         mostrarMensaje(1, _this.idioma.msjNoExistenActv);
        //     }
        // });

        // this.gpPrincipal.autoExpandColumn = 'nombreapellidosCA';
        return vista;
    },
    calcularImporteSegunTipoBonPen: function (idbonpen, tipobonpen, importebase, bonpen) {
        var importe = 0;
        importebase = parseFloat(importebase);
        bonpen = parseFloat(bonpen);
        if (idbonpen == 0) {
            bonpen = bonpen*1;
        } else if (idbonpen == 1) {
            bonpen = bonpen*-1;
        }

        if (tipobonpen == 0) {
            importe = importebase + (importebase * (bonpen/100));
        } else if (tipobonpen == 1) {
            importe = importebase + bonpen;
        } else if (tipobonpen == 2) {
            importe = bonpen;
        }
        return (Math.round(importe * 100) / 100);
    }
});

LOG.tall.trabajooperarios.VentanaAddBonificacionPenalizacion = Ext.extend(LOG.util.UITemplate, {
    idtrabajooperarios: '',
    idresponsable: '',
    idperiodo: '',
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = false;
        // this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        // this.urlBusquedaGridPrincipal = 'cargarBonPen';
        this.busquedaBasica = false;
        // this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.trabajooperarios.VentanaAddBonificacionPenalizacion.superclass.constructor.call(this, config);

        this.modelo = new LOG.tall.trabajooperarios.VentanaAddBonificacionPenalizacionModel({
            idioma: this.idioma
        });

        this.modelo.idtrabajooperarios = config.idtrabajooperarios;
        this.modelo.idresponsable = config.idresponsable;
        this.modelo.idperiodo = config.idperiodo;
        this.modelo.importebase = config.importebase;

        this.getVistaPrincipal().title = 'Adicionar';
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 430;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().getButton(1).setVisible(false);
    },
    render: function (config) {
        var _this = this;
        var vista = this.vistaPrincipal;
        vista.addEvents('addbonpen');
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            region: 'center',
            animCollapse: false,
            animate: false,
            autoHeight: true,
            frame: true
        });
        this.panelPrincipal.add(this.panelBotones);
        this.builComponent();
        this.setTemplateView(config || {});
        this.vistaPrincipal.show();
        this.vistaPrincipal.doLayout();

        this.getVistaPrincipal().getButton(0).setHandler(
            function () {
                _this.modelo.reset();
                _this.record = null;
                _this.getVistaPrincipal().close();
            }
        );

        this.getVistaPrincipal().getButton(2).setHandler(
            function () {
                _this.modelo.salvar(null, function (resp) {
                    _this.getVistaPrincipal().close();
                    vista.fireEvent('addbonpen', resp.idadd, resp.idtrabajooperarios);
                }, function (resp) {
                    if (resp.cod === -1) {
                        mostrarMensaje(1, 'Solo puede tener una activa, cancele la ultima.');
                        _this.getVistaPrincipal().close();
                    }
                }, 'Aplicado correctamente.');
            }
        );


        return vista;
    },
    builComponent: function () {
        var _this = this;
        // this.panelPrincipal = LOG.util.UIManager.initPanel({
        //     region: 'center',
        //     animCollapse: false,
        //     animate: false,
        //     autoHeight: true,
        //     frame: true
        // });
        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        var cls3 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        _this.modelo.idbonpen = 0;
        this.gRadioBonPen = new Ext.form.RadioGroup({
            name: 'radios',
            columns: 2,
            vertical: true,
            items: [{
                boxLabel: 'Bonificacion',
                name: 'rbbonpen',
                inputValue: 0,
                checked: true
            }, {
                boxLabel: 'Penalizacion',
                name: 'rbbonpen',
                inputValue: 1
            }],
            listeners: {
                change: function (rb, newValue, oldValue) {
                    // _this.modelo.posecionmedio = newValue.inputValue;
                    // if (_this.modelo.basicForm.isValid()) {
                    //     _this.modelo.habilitarBotones();
                    // } else _this.modelo.habilitarBotones(true);
                    if (newValue) {
                        _this.modelo.idbonpen = newValue.inputValue;
                    }
                }
            }
        });

        cls1.addComponent(this.gRadioBonPen);

        _this.modelo.idtipobonpen = 0;

        this.gRadioTipoBonPen = new Ext.form.RadioGroup({
            name: 'radios',
            columns: 3,
            vertical: true,
            items: [{
                boxLabel: 'Porciento',
                name: 'rbtipobonpen',
                inputValue: 0,
                checked: true
            }, {
                boxLabel: 'Agrego',
                name: 'rbtipobonpen',
                inputValue: 1
            }, {
                boxLabel: 'Fijo',
                name: 'rbtipobonpen',
                inputValue: 2
            }],
            listeners: {
                change: function (rb, newValue, oldValue) {
                    // if (newValue.getRawValue() === '0') {
                    //     _this.importeBonPen.setMaxValue(100);
                    // } else {
                    //     _this.importeBonPen.setMaxValue(null);
                    // }
                    // _this.importeBonPen.isValid();
                    if (newValue) {
                        _this.modelo.idtipobonpen = newValue.inputValue;
                    }
                }
            }
        });

        cls3.addComponent(this.gRadioTipoBonPen);

        var fsContenedor1 = new Ext.form.FieldSet({
            title: 'Tipo',
            width: '94%',
            items: [cls1]
        });

        var fsContenedor2 = new Ext.form.FieldSet({
            title: 'Tipo',
            width: '94%',
            items: [cls3]
        });

        var cls2 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.importeBonPen = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Importe',
            name: 'bonpen',
            validarEnFormBasico: true,
            decimalPrecision: 2,
            minValue: 0.01,
            allowBlank: false
            // maxValue: 100
        });

        cls2.addComponent(this.importeBonPen);

        this.taObservacion = new Ext.form.TextArea({
            fieldLabel: 'Observacion',
            name: 'observacion',
            height: 60,
            maxLength: 255,
            minLength: 2,
            enableKeyEvents: true,
            allowBlank: false
        });

        cls2.addComponent(this.taObservacion);

        this.formularioGeneral = new LOG.util.Panel({
            // frame: true,
            labelAlign: 'top',
            autoHeight: true,
            items: [fsContenedor1, fsContenedor2, cls2]
        });


        // _this.modelo.addActionButton(this.btnSalvar);

        this.basicFormulario = new LOG.util.UIManager.initForm({
            region: 'center',
            frame: true,
            autoHeight: true
        });
        this.basicFormulario.add(this.formularioGeneral);
        this.panelPrincipal.add(this.basicFormulario);
        this.prepareForm();
    },
    prepareForm: function (d) {
        if (this.basicFormulario) {
            this.modelo.addActionButton(this.getVistaPrincipal().getButton(2));
            // this.record = d;
            // this.basicFormulario.getForm().loadRecord(this.record);
            this.modelo.bindForm(this.basicFormulario);
            // this.modelo.loadRecord();

        }
    },
});

LOG.tall.trabajooperarios.VentanaCancelBonificacionPenalizacion = Ext.extend(LOG.util.UITemplate, {
    idtrabajooperarios: '',
    idbonificacionpenalizacion: '',
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = false;
        // this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        // this.urlBusquedaGridPrincipal = 'cargarBonPen';
        this.busquedaBasica = false;
        // this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.ordentrabajo.Idioma);
        LOG.tall.trabajooperarios.VentanaCancelBonificacionPenalizacion.superclass.constructor.call(this, config);

        this.modelo = new LOG.tall.trabajooperarios.VentanaCancelBonificacionPenalizacionModel({
            idioma: this.idioma
        });

        this.modelo.idbonificacionpenalizacion = config.idbonificacionpenalizacion;
        this.modelo.idtrabajooperarios = config.idtrabajooperarios;

        this.getVistaPrincipal().title = 'Cancelar';
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 200;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().getButton(1).setVisible(false);
    },
    render: function (config) {
        var _this = this;
        var vista = this.vistaPrincipal;
        vista.addEvents('cancelbonpen');
        this.panelPrincipal = LOG.util.UIManager.initPanel({
            region: 'center',
            animCollapse: false,
            animate: false,
            autoHeight: true,
            frame: true
        });
        this.panelPrincipal.add(this.panelBotones);
        this.builComponent();
        this.setTemplateView(config || {});
        this.vistaPrincipal.show();
        this.vistaPrincipal.doLayout();

        this.getVistaPrincipal().getButton(0).setHandler(
            function () {
                _this.modelo.reset();
                _this.record = null;
                _this.getVistaPrincipal().close();
            }
        );

        this.getVistaPrincipal().getButton(2).setHandler(
            function () {
                _this.modelo.salvar(null, function () {
                    _this.getVistaPrincipal().close();
                    vista.fireEvent('cancelbonpen');
                }, function (resp) {
                    if (resp.cod === -1) {
                        mostrarMensaje(1, 'No puede volver a cancelar.');
                        _this.getVistaPrincipal().close();
                    }
                }, 'Aplicado correctamente.');
            }
        );


        return vista;
    },
    builComponent: function () {
        var _this = this;
        // this.panelPrincipal = LOG.util.UIManager.initPanel({
        //     region: 'center',
        //     animCollapse: false,
        //     animate: false,
        //     autoHeight: true,
        //     frame: true
        // });

        var cls2 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.taObservacion = new Ext.form.TextArea({
            fieldLabel: 'Observacion',
            name: 'observacion',
            height: 70,
            maxLength: 255,
            minLength: 2,
            enableKeyEvents: true,
            allowBlank: false
        });

        cls2.addComponent(this.taObservacion);

        this.formularioGeneral = new LOG.util.Panel({
            // frame: true,
            labelAlign: 'top',
            autoHeight: true,
            items: [cls2]
        });


        // _this.modelo.addActionButton(this.btnSalvar);

        this.basicFormulario = new LOG.util.UIManager.initForm({
            region: 'center',
            frame: true,
            autoHeight: true
        });
        this.basicFormulario.add(this.formularioGeneral);
        this.panelPrincipal.add(this.basicFormulario);
        this.prepareForm();
    },
    prepareForm: function (d) {
        if (this.basicFormulario) {
            this.modelo.addActionButton(this.getVistaPrincipal().getButton(2));
            // this.record = d;
            // this.basicFormulario.getForm().loadRecord(this.record);
            this.modelo.bindForm(this.basicFormulario);
            // this.modelo.loadRecord();

        }
    },
});