
Ext.ns('LOG.aft.reportespatrimonio');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.aft.reportespatrimonio.Idioma, LOG.util.Idioma);
    var Viewport = new LOG.aft.reportespatrimonio.ViewReportes({
        idioma: idioma,
        acciones: acciones_reportes

    });
});
LOG.aft.reportespatrimonio.ViewReportes = Ext.extend(Ext.Viewport, {
    constructor: function(config) {
        Ext.apply(this, config);
        this.Especialidad = true;
        this.Reporte = true;
        this.idsistempresarial = null;
        var _this = this;

        _this.idioma = config.idioma;
        _this.id = 'viewport';
        _this.bodyStyle = 'margin: 10px;';
        _this.layout = 'border';
        
       /*Ext.Ajax.request({
            url: 'cargarEspecialidadSistEmp',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                patrimonio.reportes.idsistempresarial = rd
            }
        });*/
        var data = new Array();
        for (var i = 0; i < _this.acciones.length; i++) {
            switch (_this.acciones[i].abreviatura) {
                case 'constAloj':
                    data.push(['constAloj', 'Especialidad de Campamento']);
                    break;
                case 'sistemaEmp':
                    data.push(['sistemaEmp', 'Sistema empresarial']);
                    break;
                case 'ingenieria':
                    data.push(['ingenieria', 'Especialidad de Ingenieria']);
                    break;
                case 'vivienda':
                    data.push(['vivienda', 'Especialidad de Vivienda']);
                    break;
            }
        }

        this.storeEspecialidad = new Ext.data.SimpleStore({
            fields: ['idespecialidad', 'denominacionespecialidad'],
            data: data,
            autoLoad: false
        });
        /*this.storeEspecialidad = new Ext.data.Store({
            url: 'cargarEspecialidad',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [
                {
                    name: 'idespecialidad'
                },
                {
                    name: 'denominacionespecialidad'
                }
            ]),
            listeners: {
            }
        });*/
        var arregloData = new Array();
        this.cmbEspecialidad = new Ext.form.ComboBox({
            name: 'idespecialidad',
            fieldLabel: _this.idioma.lbEspecialidad,
            allowBlank: false,
            valueField: 'idespecialidad',
            displayField: 'denominacionespecialidad',
            store: this.storeEspecialidad,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local',
            width: 350,
            listeners: {
                'select': function(combo, record) {
                    if (combo.getValue() != _this.idsistempresarial) {//Revisar yoendy
                        _this.Especialidad = false;
                        if (!_this.Reporte) {
                            _this.FechaDesde.reset();
                            _this.FechaHasta.reset();
                            _this.FechaDesde.disable();
                            _this.FechaHasta.disable();
                        }
                        if (combo.getValue() == 'vivienda') {
                            var dataNueva = new Array();
                            dataNueva.push(['4', 'Fondo de viviendas']);
                            store.loadData(dataNueva, true);

                        } else {
                            store.loadData(arregloData);
                        }

                    } else {
                        _this.Especialidad = true;
                        _this.FechaDesde.enable();
                        _this.FechaHasta.enable();
                    }
                }
            }
        });

        arregloData.push(['1', 'Situación documental de los inmuebles']);
        arregloData.push(['2', 'Situación del registro, valor y certificado contable']);
        arregloData.push(['3', 'Estado del registro contable de los bienes inmuebles de la FAR']);
        var store = new Ext.data.SimpleStore({
            fields: ['idreporte', 'denreporte'],
            data: arregloData,
            autoLoad: false
        });

        this.cmbReporte = new Ext.form.ComboBox({
            name: 'idespecialidadd',
            fieldLabel: _this.idioma.lbReporte,
            valueField: 'idreporte',
            displayField: 'denreporte',
            store: store,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local',
            width: 350,
            selectOnFocus: true,
            listeners: {
                'select': function(combo, record) {
                    if (combo.getValue() == 3 || combo.getValue() == 4) {
                        _this.Reporte = false;
                        if (!_this.Especialidad) {
                            _this.FechaDesde.reset();
                            _this.FechaHasta.reset();
                            _this.FechaDesde.disable();
                            _this.FechaHasta.disable();
                        }
                    } else {
                        _this.FechaDesde.enable();
                        _this.FechaHasta.enable();
                    }
                }
            }
        });

        var numtrimestre = 1;
        this.anno = 0;
        var validarFecha = function() {
            var fechaini = _this.FechaDesde.getRawValue();
            var mes = fechaini.split('/')[1];
            if (mes > 3 && mes <= 6)
                numtrimestre = 2;
            else if (mes > 6 && mes <= 9)
                numtrimestre = 3;
            else if (mes > 9 && mes <= 12)
                numtrimestre = 4;
            else
                numtrimestre = 1;
            _this.anno = fechaini.split('/')[2];
            var e = Number(mes);
            switch (e) {
                case 1:
                case 2:
                case 3:
                    _this.FechaDesde.suspendEvents();
                    _this.FechaHasta.suspendEvents();

                    var trim1 = new Date('1/1/' + _this.anno);
                    var trim1fin = new Date('3/31/' + _this.anno);

                    _this.FechaDesde.setValue(trim1);
                    _this.FechaHasta.setValue(trim1fin);

                    _this.FechaDesde.resumeEvents();
                    _this.FechaHasta.resumeEvents();
                    break;
                case 4:
                case 5:
                case 6:
                    _this.FechaDesde.suspendEvents();
                    _this.FechaHasta.suspendEvents();

                    var trim1 = new Date('4/1/' + _this.anno);
                    var trim1fin = new Date('6/30/' + _this.anno);

                    _this.FechaDesde.setValue(trim1);
                    _this.FechaHasta.setValue(trim1fin);

                    _this.FechaDesde.resumeEvents();
                    _this.FechaHasta.resumeEvents();
                    break;
                case 7:
                case 8:
                case 9:
                    _this.FechaDesde.suspendEvents();
                    _this.FechaHasta.suspendEvents();

                    var trim1 = new Date('7/1/' + _this.anno);
                    var trim1fin = new Date('9/30/' + _this.anno);

                    _this.FechaDesde.setValue(trim1);
                    _this.FechaHasta.setValue(trim1fin);

                    _this.FechaDesde.resumeEvents();
                    _this.FechaHasta.resumeEvents();
                    break;
                case 10:
                case 11:
                case 12:
                    _this.FechaDesde.suspendEvents();
                    _this.FechaHasta.suspendEvents();

                    var trim1 = new Date('10/1/' + _this.anno);
                    var trim1fin = new Date('12/31/' + _this.anno);

                    _this.FechaDesde.setValue(trim1);
                    _this.FechaHasta.setValue(trim1fin);

                    _this.FechaDesde.resumeEvents();
                    _this.FechaHasta.resumeEvents();
                    break;
            }
        };

        this.FechaDesde = new Ext.form.DateField({
            width: 350,
            fieldLabel: _this.idioma.lbFechaInicio,
            // readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio,
            listeners: {
                'valid': function(datefield, newValue, oldValue) {
                    validarFecha();
                }
            }
        });

        this.FechaHasta = new Ext.form.DateField({
            width: 350,
            fieldLabel: _this.idioma.lbFechaFin,
            readOnly: true,
            editable: false,
            hideTrigger: true,
            format: 'd/m/Y',
            enableKeyEvents: true
        });


        this.btnLimpiar = new Ext.Button({
            text: _this.idioma.btnLimpiar,
            tooltip: _this.idioma.btnTtLimpiar,
            iconCls: 'limpiar',
            handler: function() {
                _this.cmbEspecialidad.reset();
                _this.cmbReporte.reset();
                _this.FechaDesde.reset();
                _this.FechaHasta.reset();
            }
        });

        this.btnMostrar = new Ext.Button({
            text: _this.idioma.btnMostrar,
            tooltip: _this.idioma.btnTtMostrar,
            iconCls: 'mostrar',
            handler: function() {
                if (_this.cmbEspecialidad.getValue()) {
                    if (_this.cmbReporte.getValue()) {
                        if (!_this.FechaDesde.disabled && _this.FechaDesde.getValue() == '')
                        {
                            mostrarMensaje(1, "Debe seleccionar una fecha.");
                            return;
                        }
                            var fechaini = _this.FechaDesde.getValue();
                            var fechafin = _this.FechaHasta.getValue();
                        var params = {
                            especialidad: _this.cmbEspecialidad.getValue(),
                            // denoespecialidad: _this.cmbEspecialidad.getRawValue(),
                            reporte: _this.cmbReporte.getValue(),
                            fechainicio: (fechaini) ? fechaini.format('d-m-Y') : null,
                            fechafin: (fechafin) ? fechafin.format('d-m-Y') : null,
                            numtrimestre: numtrimestre,
                            anno: _this.anno
                        };
                            Ext.Ajax.request({
                                url: 'reporteEspecialidad',
                                method: 'POST',
                                params: params,
                                callback: function (options, success, response) {
                                    var response = Ext.decode(response.responseText);
                                    var dirReport = '';
                                    switch (response.idreporte) {
                                        case  39:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Situacion_Documental_Campamento';
                                            break;
                                        case  40:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Registro_Contable_Campamento';
                                            break;
                                        case  41:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Estado_Bienes_Campamento';
                                            break;
                                        case  19:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Situacion_Documental_Vivienda';
                                            break;
                                        case  34:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Registro_Contable_Vivienda';
                                            break;
                                        case  35:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Estado_Bienes_Vivienda';
                                            break;
                                        case  36:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Situacion_Documental_Empresarial';
                                            break;
                                        case  37:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Registro_Contable_Empresarial';
                                            break;
                                        case  38:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Estado_Bienes_Empresarial';
                                            break;
                                        case  42:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Situacion_Documental_Ingenieria';
                                            break;
                                        case  43:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Registro_Contable_Ingenieria';
                                            break;
                                        case  44:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Estado_Bienes_Ingenieria';
                                            break;
                                        case  45:
                                            dirReport = '/distra/logistica/activofijo/patrimonio/Listado_Vivienda';
                                            break;
                                    }
                                    params.idestructura = response.idestructura;
                                    var report = new LOG.util.Report({
                                        reports: [
                                            {
                                                name: 'Vista principal',
                                                params: params,
                                                dirReport: dirReport,
                                                detailFirma: {}
                                            }
                                        ]
                                    }).view();

                                }
                            });

                            // var report = new Ext.erp.LogisticaReport({});

                            // report.showReport('reporteEspecialidad', {parametros: Ext.encode(params)});

                    } else {
                        mostrarMensaje(1, "Debe seleccionar un tipo de reporte.");
                    }
                } else {
                    mostrarMensaje(1, "Debe seleccionar una especialidad.");
                }

            }
        });

        this.PanelReporte1 = new Ext.Panel({
            frame: true,
            anchor: '100%',
            bodyStyle: 'margin: 10px;',
            border: false,
            height: 180,
            width: 800,
            buttons: [this.btnLimpiar, this.btnMostrar],
            buttonAlign: 'right',
            items: [
                {
                    layout: 'column',
                    border: false,
                    defaults: {
                        columnWidth: '.50',
                        border: false,
                    },
                    items: [
                        {
                            layout: 'form',
                            labelAlign: 'top',
                            items: [this.cmbEspecialidad, this.FechaDesde]
                        },
                        {
                            layout: 'form',
                            labelAlign: 'top',
                            items: [this.cmbReporte, this.FechaHasta]
                        }
                    ]
                }
            ]
        });

        this.PanelReporte = new Ext.Panel({
            region: 'center',
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            border: false,
            items: [this.PanelReporte1]
        });

        _this.items = [this.PanelReporte];


        LOG.aft.reportespatrimonio.ViewReportes.superclass.constructor.call(this, arguments);

    }
});

