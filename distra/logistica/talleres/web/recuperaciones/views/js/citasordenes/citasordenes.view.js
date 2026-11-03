Ext.ns('Ext.erp.citasordenes');
Ext.erp.citasordenes = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/citasordenes';
        config.urlBusquedaGridPrincipal = 'getCitasOrdenes';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.busquedaAvanzada = true;
        config.autoShow = true;
        config.idioma = {};
        Ext.erp.citasordenes.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.citasordenes.Idioma);
    },
    render: function(config) {
        var render = Ext.erp.citasordenes.superclass.render.call(this, config);
        var _this = this;

        _this.tfNroCita = new LOG.util.Prototipos.inputTexto({
            name: 'nrocita',
            emptyText: _this.idioma.cgNroCita
        });

        _this.textDesde = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeDOC',
            endDateField: 'hastaDOC'
        });

        _this.textHasta = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaDOC',
            endDateField: 'desdeDOC'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;

        _this.btnBuscarCitasOrd = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBtnBuscarP,
            handler: function() {
                _this.btnBuscar();
            }});
        _this.btnLimpiarCitasOrd = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar,
            tooltip: this.idioma.ttBtnLimpiar, handler: function() {
                _this.customTriggerClear();
            }});
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function() {
                        if (render.isVisible())
                            _this.btnBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function() {
                        if (render.isVisible())
                            _this.customTriggerClear();
                    }
                }
            ]);

        this.gpPrincipal.getTopToolbar().add(
            '-',
            _this.tfNroCita,
            '-',
            new Ext.form.Label({text: _this.idioma.cgDesde}),
            _this.textDesde,
            '-',
            new Ext.form.Label({text: _this.idioma.cgHasta}),
            _this.textHasta,
            '-',
            _this.btnBuscarCitasOrd,
            '-',
            _this.btnLimpiarCitasOrd
        );

        return render;

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgNroCita,
            width: 100,
            dataIndex: 'nrodoc',
            default: true,
            filter: {
                type: 'string',
                emptyText: this.idioma.cgNroCita,
                dataIndex: 'nrodoc'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 100,
            dataIndex: 'estado',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            },
            filter: {
                type: 'list',
                options: [[1, 'Elaboraci\xf3n'], [2, 'Preparado'], [3, 'Aprobado'], [5, 'Eliminado'], [6, 'Anulado'], [9, 'Cerrado']],
                dataIndex: 'estado'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFechaCreacion,
            width: 120,
            dataIndex: 'fechadocumento',
            default: true,
            filter: {
                type: 'date',
                dateFormat: 'd/m/Y',
                dataIndex: 'fechadocumento'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFechaCita,
            width: 120,
            dataIndex: 'fechacita',
            default: true,
            filter: {
                type: 'date',
                dateFormat: 'd/m/Y',
                dataIndex: 'fechacita'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFechaTerminacion,
            width: 120,
            dataIndex: 'fechaterminacion',
            default: true,
            filter: {
                type: 'date',
                dateFormat: 'd/m/Y',
                dataIndex: 'fechaterminacion'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgContratClient,
            width: 350,
            dataIndex: 'cliente',
            default: true,
            filter: {
                type: 'combo',
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
                valueField: 'idclientesproveedores',
                displayField: 'nombre',
                dataIndex: 'cliente'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 100,
            align: 'right',
            dataIndex: 'importetotal',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            dataIndex: 'idcliente'
        });
        this.addGridColumn({
            header: this.idioma.cgOrdenTrabajo,
            width: 80,
            align: 'right',
            dataIndex: 'nroorden',
            default: true,
            filter: {
                type: 'string',
                emptyText: this.idioma.cgNroOrdenT,
                dataIndex: 'nroorden'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCL,
            width: 100,
            align: 'center',
            dataIndex: 'capacidadliquida',
            default: true,
            renderer: function (value, metaData) {
                if (value > 0) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttCapacidadActivo + '"';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttCapacidadNoActivo + '"';
                }
            },
            filter: {
                type: 'boolean',
                yesText: 'Habilitado',
                noText: 'No habilitado',
                dataIndex: 'capacidadliquida'
            }
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            disabled: true,
            tooltip: this.idioma.ttImprimir,
            handler: function() {
                _this.getReportes(_this);
            },
            controlFn: function(b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function(e) {
                    if (e == 'load') {
                        if (_caller.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: 'ayudacitas'
        }));

    },
    getReportes: function(data) {
        let _this = this;
        let filtros = _this.getGridPrincipal().filters.getFilterData();
        console.info(filtros);
        filtros.map(f=>{
            if(f['field'] ==='estado') {
                _this.estado = "{"+f['data']['value'].join(',')+"}";
            }
        });
        var desdePM = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null;
        var hastaPM = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null;
        var fechadocumentoPM = (_this.FechaDocumentoBA.getValue()) ? _this.FechaDocumentoBA.getValue().format('d-m-Y') : (filtros[0] && filtros[0].field == 'fechadocumento' && filtros[0].data.value ? filtros[0].data.value : null);
        var fechacitaPM = (_this.FechaCitaBA.getValue()) ? _this.FechaCitaBA.getValue().format('d-m-Y') : (filtros[0] && filtros[0].field == 'fechacita' && filtros[0].data.value ? filtros[0].data.value : null);
        var fechaterminacionPM = (_this.FechaTerminacionBA.getValue()) ? _this.FechaTerminacionBA.getValue().format('d-m-Y') : (filtros[0] && filtros[0].field == 'fechaterminacion' && filtros[0].data.value ? filtros[0].data.value : null);
        var idestadoPM = (_this.comboEstadoBA.getValue()) ? _this.comboEstadoBA.getValue() : (filtros[0] && filtros[0].field == 'estado' && filtros[0].data.value ? _this.estado : null);
        var idclientePM = (_this.comboClientesBA.getValue()) ? _this.comboClientesBA.getValue() : (filtros[0] && filtros[0].field == 'cliente' && filtros[0].data.value ? filtros[0].data.value : null);
        var nrocitaPM = (_this.tfNroCita.getValue()) ? _this.tfNroCita.getValue() : (filtros[0] && filtros[0].field == 'nrodoc' && filtros[0].data.value ? filtros[0].data.value : null);
        var nroordenPM = (_this.tfNroOT.getValue()) ? _this.tfNroOT.getValue() :(filtros[0] && filtros[0].field == 'nroorden' && filtros[0].data.value ? filtros[0].data.value : null);
        var desdeCP = (_this.FechaDesdeBA.getValue()) ? _this.FechaDesdeBA.getValue().format('d-m-Y') : null;
        var hastaCP = (_this.FechaHastaBA.getValue()) ? _this.FechaHastaBA.getValue().format('d-m-Y') : null;
        var medioCP = (_this.textoMedioBA.getValue()) ? _this.textoMedioBA.getValue() : null;
        var conordentrabajoPM = (_this.checkboxConOT.getValue()) ? _this.checkboxConOT.getValue() : null;
        var sinordentrabajoPM = (_this.checkboxSinOT.getValue()) ? _this.checkboxSinOT.getValue() : null;
        var capacidadliquidaPM = (_this.checkboxCapacidad.getValue()) ? _this.checkboxCapacidad.getValue() : null;
        var servicioPM = (_this.comboServicioBA.getValue()) ? "{"+_this.comboServicioBA.getValue()+"}" : null;
        /*filtros.map((objeto)=>{
            params[objeto.field+objeto.data.comparison] = objeto.data.value;
        });*/
        _this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/CitasOrdenes',
                    name: 'CitasOrdenes',
                    isList: true,
                    params: {
                        idestructura: idEntidad || null,
                        fechainicio: desdePM,
                        fechafin: hastaPM,
                        fechadocumento: fechadocumentoPM,
                        fechacita: fechacitaPM,
                        fechaterminacion: fechaterminacionPM,
                        idestado: idestadoPM,
                        idcliente: idclientePM,
                        nrocita: nrocitaPM,
                        nroorden: nroordenPM,
                        fechadesde: desdeCP,
                        fechahasta: hastaCP,
                        medio: medioCP,
                        cordentrabajo: conordentrabajoPM,
                        sordentrabajo: sinordentrabajoPM,
                        capacidadliquida: capacidadliquidaPM,
                        servicio: servicioPM,
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema
                    }
                }
            ]
        }).view();
    },
    getDateDesde: function() {
        return (this.textDesde.getValue()) ? this.textDesde.getValue().format('d-m-Y') : null;
    },
    getDateHasta: function() {
        return (this.textHasta.getValue()) ? this.textHasta.getValue().format('d-m-Y') : null;
    },
    btnBuscar: function() {
        var _this = this;
        var desde = _this.textDesde.getValue();
        var hasta = _this.textHasta.getValue();
        var nrocita = _this.tfNroCita.getValue();
        if(desde || hasta || nrocita) {
            _this.storePrincipal.initBaseParams.criterio = (nrocita) ? nrocita : null;
            _this.storePrincipal.initBaseParams.desdeDOC = (desde) ? desde : null;
            _this.storePrincipal.initBaseParams.hastaDOC = (hasta) ? hasta : null;
            _this.storePrincipal.initBaseParams.start = 0;
            _this.storePrincipal.initBaseParams.limit = 30;
            _this.getStorePrincipal().load();
            _this.getStorePrincipal().filtrado = true;
        }

    },
    view:function(){
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.comboServicioBA = new LOG.util.LovCombo({
            fieldLabel: this.idioma.lbServicio,
            url: '/logistica/talleres/citas/index.php/citastalleres/cargarActividadesExistentes',
            name: 'idservicio',
            displayField: 'denominacion',
            valueField: 'idactividad',
            queryParam: 'criterio',
            mode: 'remote',
            emptyText: this.idioma.lbSeleccione,
            autoLoad: false,
            validarEnFormBasico: true
        });
        cls.addComponent(this.comboServicioBA);

        this.comboClientesBA = new LOG.util.ComboBox({
            name: 'cliente',
            queryParam: 'criterio',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            fieldLabel: this.idioma.lbCliente,
            mode: 'remote',
            minChars: 1,
            pageSize: 20
        });
        this.comboClientesBA.on('select', function (sb, record) {
            _this.getPanelBusqueda().parametros['cliente'] = record.data.idclientesproveedores;
        });

        cls.addComponent(this.comboClientesBA);

        this.textoMedioBA = new LOG.util.ComboBox({
            name: 'idindicador',
            autoLoad: false,
            displayField: 'descripcionmarcamodelo',
            valueField: 'idindicador',
            fieldLabel: 'Medio',
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            queryParam: 'criterio',
            mode: 'remote',
            minChars: 1,
            pageSize: 20
        });
        this.textoMedioBA.store.on({
            beforeload: function (st, obj) {
                obj.params.explotacion = 1;
            }
        });

        cls.addComponent(this.textoMedioBA);

        this.comboEstadoBA = new LOG.util.LovCombo({
            fieldLabel: this.idioma.cgEstado,
            hiddenName: 'idestado',
            valueField: 'idestado',
            displayField: 'estado',
            editable: false,
            mode: 'local',
            minChars: 1,
            emptyText: this.idioma.lbSeleccione,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [3, LOG.lb.documento.Estado[3]],
                    [5, LOG.lb.documento.Estado[5]],
                    [6, LOG.lb.documento.Estado[6]],
                    [9, LOG.lb.documento.Estado[9]]
                ]
            }),
            getXType: function () {
                return 'combobox';
            }
        });

        cls.addComponent(this.comboEstadoBA);

        this.FechaTerminacionBA = new Ext.form.DateField({
            fieldLabel: this.idioma.cgFechaTerminacion,
            name: 'fechaterminacion',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });

        cls.addComponent(this.FechaTerminacionBA);

        this.tfNroOT = new LOG.util.Prototipos.inputTexto({
            name: 'nroorden',
            fieldLabel: _this.idioma.cgNroOrdenT
        });

        cls.addComponent(this.tfNroOT);

        _this.addFilterComponent(cls);

        var clsFsRangoFecha = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var clsFsRFInterno = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.FechaCitaBA = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaCita,
            name: 'fechacita',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });
        clsFsRFInterno.addComponent(this.FechaCitaBA);
        this.FechaDocumentoBA = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaDocumento,
            name: 'fechadocumento',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });
        clsFsRFInterno.addComponent(this.FechaDocumentoBA);

        clsFsRangoFecha.addComponent(
            new Ext.form.FieldSet({
                title: _this.idioma.lbRangoFechaComienzo,
                items: clsFsRFInterno,
            })
        );
        _this.addFilterComponent(clsFsRangoFecha);

        var clsFsRangoFechaPeriodo = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        var clsFsRFInternoPeriodo = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.FechaDesdeBA = new Ext.form.DateField({
            fieldLabel: 'Desde',
            name: 'desdeBA',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeBA',
            endDateField: 'hastaBA',
            editable: false
        });
        clsFsRFInternoPeriodo.addComponent(this.FechaDesdeBA);

        this.FechaHastaBA = new Ext.form.DateField({
            fieldLabel: 'Hasta',
            name: 'hastaBA',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaBA',
            startDateField: 'desdeBA',
            editable: false
        });
        clsFsRFInternoPeriodo.addComponent(this.FechaHastaBA);

        clsFsRangoFechaPeriodo.addComponent(
            new Ext.form.FieldSet({
                title: _this.idioma.lbRangoFechaPeriodo,
                items: clsFsRFInternoPeriodo,
            })
        );
        _this.addFilterComponent(clsFsRangoFechaPeriodo);

        var cls1 = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.checkboxConOT = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbCbxConOT,
            name: 'cordentrabajo',
            style: 'margin:10px 0px 0px 15px',
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked == true) {
                        _this.checkboxSinOT.disable();
                    } else {
                        _this.checkboxSinOT.enable();
                    }
                }
            }
        });

        cls1.addComponent(this.checkboxConOT);

        this.checkboxCapacidad = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbCbxCapacidad,
            name: 'capacidadliquida',
            style: 'margin:10px 0px 0px 15px',
            listeners: {
                check: function(check, checked) {
                    _this.capacidadliquida = (checked) ? 1 : 0;
                }
            }
        });

        cls1.addComponent(this.checkboxCapacidad);

        this.checkboxSinOT = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbCbxSinOT,
            name: 'sordentrabajo',
            style: 'margin:10px 0px 0px 15px',
            listeners: {
                check: function(_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked == true) {
                        _this.checkboxConOT.disable();
                    } else {
                        _this.checkboxConOT.enable();
                    }
                }
            }
        });

        cls1.addComponent(this.checkboxSinOT);

        _this.addFilterComponent(cls1);

        return Ext.erp.citasordenes.superclass.view.call(this);
    },
    customTriggerClear: function() {
        var _this = this;
        if(_this.textDesde.getValue() || _this.textHasta.getValue() || _this.tfNroCita.getValue()) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.tfNroCita.reset();
            _this.storePrincipal.initBaseParams.desdeDOC = null;
            _this.storePrincipal.baseParams.desdeDOC = null;
            _this.storePrincipal.initBaseParams.hastaDOC = null;
            _this.storePrincipal.baseParams.hastaDOC = null;
            _this.storePrincipal.initBaseParams.criterio = null;
            _this.storePrincipal.baseParams.criterio = null;
            _this.getStorePrincipal().load();
            _this.getStorePrincipal().filtrado = false;
        }
    }
});