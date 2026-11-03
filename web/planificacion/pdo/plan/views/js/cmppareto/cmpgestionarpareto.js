Ext.chart.Chart.CHART_URL = '../../../comun/recursos/charts.swf';
Utilidades.Cmp.Cmpgestionarpareto = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.BarraProgreso = new BarraEstado();
    Ext.apply(Ext.form.VTypes, {
        daterange: function (val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        }
    });
    this.fechaInicio = new Ext.form.DateField({
        fieldLabel: 'Fecha de inicio',
        format: 'd/m/Y',
        name: 'fechainipareto',
        id: 'fechainipareto',
        //value: new Date().format('d/m/Y'),
        endDateField: 'fechafinpareto',
        allowBlank: true,
        vtype: 'daterange',
        anchor: '90%',
        emptyText: 'Seleccione',
        width: 100,
        menuListeners: {
            select: function (df, date) {
                if(_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y-m-d');
                }
                if(_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y-m-d');
                }
                _this.fechaInicio.setValue(date);
                _this.CargarCmpPareto(_this.cbPlanes.getValue(),
                    fechaInicio, fechaFin,
                    _this.cbObtenerResult.getValue());
            }
        }
    });
    this.fechaFin = new Ext.form.DateField({
        fieldLabel: 'Fecha de fin',
        disabled: false,
        format: 'd/m/Y',
        name: 'fechafinpareto',
        id: 'fechafinpareto',
        //value: new Date().format('d/m/Y'),
        vtype: 'daterange',
        emptyText: 'Seleccione',
        anchor: '90%',
        width: 100,
        menuListeners: {
            select: function (df, date) {
                if(_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y-m-d');
                }
                if(_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y-m-d');
                }
                _this.fechaFin.setValue(date);
                _this.CargarCmpPareto(_this.cbPlanes.getValue(),
                   fechaInicio, fechaFin,
                    _this.cbObtenerResult.getValue());
            }
        }
    });

    this.btnLimpiar = new Ext.Button({
        iconCls: 'limpiar',
        disabled: false,
        handler: function () {
            _this.cbPlanes.reset();
            _this.fechaInicio.reset();
            _this.fechaFin.reset();
            _this.cbObtenerResult.reset();
            _this.CargarCmpPareto();
        },
        tooltip: 'Limpiar filtros',
        key: {
            alt: true ,
            key: 'L'
        },
        scope: this
    });


    this.btnGenerarPareto = new Ext.Button({
        iconCls: 'graficar',
        disabled: false,
        handler: function () {
            _this.CargarCmpPareto();
            _this.cbPlanes.reset();
            _this.fechaInicio.reset();
            _this.fechaFin.reset();
            _this.cbObtenerResult.reset();
        },
        tooltip: 'Generar diagrama de Pareto',
        key: {
            ctrl: true ,
            key: 'G'
        },
        scope: this
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaPareto',
        text: 'Ayuda',
        iconCls: 'ayuda',
        disabled: false,
        key: {
            alt: true ,
            key: 'H'
        },
        scope: this
    });
    this.stcbcbPlanes = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
        //url: '/planificacion/pdo/plan/index.php/cmppareto/cargarComboPlanes',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idplan',
            root: "data"
        }, [{
            name: 'idplan'
        }, {
            name: 'denominacion'
        }])
    });
    this.cbPlanes = new Ext.form.ComboBox({
        store: _this.stcbcbPlanes,
        displayField: 'denominacion',
        valueField: 'idplan',
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        width: 100,
        emptyText: 'Seleccione',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            expand: function (combo) {
                _this.stcbcbPlanes.reload();
            },
            select: function (cb, record, index) {
                if(_this.fechaFin.getValue() == ''){
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y-m-d');
                }
                if(_this.fechaInicio.getValue() == ''){
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y-m-d');
                }
                _this.CargarCmpPareto(cb.value,
                    fechaInicio, fechaFin,
                    _this.cbObtenerResult.getValue());
            }
        }
    });
    this.stcbObtenerResult = new Ext.data.SimpleStore({
        fields: ['idresult', 'denominacion'],
        data: [
            [1, 'Puntual'],
            [2, 'Antecesor'],
            [3, 'Sucesor'],
            [4, 'Global']
        ]
    });
    this.cbObtenerResult = new Ext.form.ComboBox({
        store: _this.stcbObtenerResult,
        displayField: 'denominacion',
        valueField: 'idresult',
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        width: 100,
        emptyText: 'Seleccione',
        listeners: {
            select: function (cb, record, index) {
                if(_this.fechaFin.getValue() == ''){
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y-m-d');
                }
                if(_this.fechaInicio.getValue() == ''){
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y-m-d');
                }
                _this.CargarCmpPareto(_this.cbPlanes.getValue(),
                    fechaInicio, fechaFin,  cb.value);
            }
        }
    });


    this.PanelGeneralPareto = new Ext.Panel({
        id: 'container',
        layout: 'fit',
        html: "<div id = 'container' style='width: 100%; height: 100%;'></div>"
    });
    this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        closable: false,
        maximized: true,
        noTitle:true,
        modal: true,
        tbar: [_this.btnGenerarPareto, '-', 'Planes :', _this.cbPlanes, '-',
            'Fecha de inicio : ', _this.fechaInicio,
            '-', 'Fecha de fin : ', _this.fechaFin, '-', 'Resultado :',
            _this.cbObtenerResult, '-', _this.btnLimpiar,
            '->', _this.btnAyuda],
        usarKeymap:true,
        botonesKeymap:[_this.btnGenerarPareto, _this.btnLimpiar,  _this.btnAyuda],
        items: _this.PanelGeneralPareto
    });

    this.CargarCmpGraficas = function () {
        _this.WinPrincipal.show();
        _this.CargarCmpPareto();
    };

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpPareto = function (idplan, fechaIni, fechaFin, tipoR) {
        _this.BarraProgreso.show('Cargando diagrama');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmppareto/generarDiagramaPareto',
            params: {
                //actividadpadre: mipadre
                idplan: idplan,
                fechainicio: fechaIni,
                fechafin: fechaFin,
                tipoR: tipoR
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                var important = [];
                if (respuesta.acumulado != null) {
                    var pos = -1;
                    for (var i = 0; i < respuesta.acumulado.length; i++) {
                        if (respuesta.acumulado[i] < 80) {
                            pos = i;
                        }
                    }
                    var poin = 0;
                    if (pos == -1) {
                        important[0] = respuesta.acumulado[0];
                    } else {
                        important[0] = respuesta.acumulado[pos + 1];
                        poin = pos + 1;
                    }
                }
                $(function () {
                    $('#container').highcharts({
                            chart: {
                                zoomType: 'xy',
                                height: 500,
                                width: screen.width
                                //height: _this.PanelGeneralPareto.getInnerHeight()
                            },
                            title: {
                                text: 'An\xe1lisis de Pareto para actividades por plan'
                            },
                            xAxis: [{
                                categories: respuesta.CAR,
                                labels: {
                                    rotation: -45,
                                    style: {
                                        fontSize: '10px',
                                        fontFamily: 'Arial'
                                    }
                                }
                            }],
                            yAxis: [{
                                labels: {
                                    format: '{value} %'
                                }, title: {
                                    text: ''
                                }
                            }],
                            tooltip: {
                                shared: true
                            },
                           plotOptions: {
                                line: {
                                    dataLabels: {
                                        enabled: true
                                    }
                                },
                                series: {
                                    shadow: true
                                },
                                column: {
                                    pointPadding: 0.2
                                }
                            },
                            series: [
                                {
                                    name: '% que representa',
                                    type: 'column',
                                    data: respuesta.porciento_re,
                                    tooltip: {
                                       pointFormat: '<span style="font-size: 12px"><b>Denominaci\xf3n: </b>{point.text} </span><br/>'+
                                       '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y} %</b><br/>'
                                    }
                                }, {
                                    name: 'Acumulado',
                                    type: 'spline',
                                    data: respuesta.acumulado,
                                    tooltip: {
                                        valueSuffix: ' %'
                                    }
                                }, {
                                    name: 'Corte',
                                    type: 'line',
                                    data: important,
                                    color: 'red',
                                    lineWidth: 0,
                                    pointStart: poin,
                                    tooltip: {
                                        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}<br/>'
                                    }
                                }
                            ]
                        }
                    );
                });
            }
        });
    }

};
