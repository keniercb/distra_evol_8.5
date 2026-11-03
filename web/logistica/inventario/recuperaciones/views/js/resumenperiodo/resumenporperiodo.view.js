Ext.ns('Ext.erp.resumenporperiodo');
Ext.erp.resumenporperiodo = Ext.extend(LOG.util.Panel, {
    html: '<div id="graficoperiodo"></div>',
    seleccionados: [],
    arrSelect: [],
    nameSelect: [],
    ventas: [],
    compras: [],
    constructor: function(config)
    {
        var temp = this;
        config.idioma = Log.inv.resumenporperiodo.Idioma;
        config.tbar = ['-', '->', LOG.util.UIManager.createBtn({
                text: config.idioma.btnReiniciar,
                tooltip: config.idioma.ttBtnReiniciar,
                isContextual: true,
                iconCls: 'actualizar',
                handler: function() {
                    temp.fireEvent('afterrender');
                }
            }),'-',
            LOG.util.Prototipos.botonAyuda({id:'idResumenPeriodo'})
        ];

        Ext.erp.resumenporperiodo.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.resumenporperiodo.Idioma);

        var _this = this;
        this.on({
            'afterrender': function() {
                var winSeleccionPeriodos = new Ext.erp.seleccionperiodo.View({
                    idioma: _this.idioma
                });

                winSeleccionPeriodos.attachPlugin(new LOG.lb.plugin.ComboEjercicios());
                winSeleccionPeriodos.init();

                winSeleccionPeriodos.getVistaPrincipal().aceptarFn = function() {
                    this.seleccionados = winSeleccionPeriodos.getGridPrincipal().getSelectionModel().getSelections();
                    var temp = Array();
                    var selec = Array();
                    Ext.each(this.seleccionados, function(rec) {
                        temp.push(rec['data']['idperiodo']);
                        selec.push((rec['data']['nombre']).substring(0, 3));
                    });
                    _this.arrSelect = temp;
                    _this.nameSelect = selec;

                    this.model = new Ext.erp.resumenporperiodo.Model({
                        idioma: _this.idioma
                    });
                    this.model.cargarDatos({idperiodo: Ext.encode(_this.arrSelect)}, function(r) {
                        _this.ventas = r[0].ventas;
                        for (i = 0; i < _this.ventas.length; i++) {
                            if (_this.ventas[i] == null) {
                                _this.ventas[i] = 0;
                            }
                            else
                            {
                                _this.ventas[i] = parseFloat(_this.ventas[i]);
                            }
                        }
                        _this.compras = r[0].compras;
                        _this.grafica();
                    });

                };
                winSeleccionPeriodos.view();
            }

        });
    },
    grafica: function() {
        var _this = this;
        Highcharts.setOptions({
            lang: {
                numericSymbols: [" 000", " 000 000", "G", "T", "P", "E"]
            }
        });
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'graficoperiodo',
                type: 'line',
                marginRight: 130,
                marginBottom: 25
            },
            title: {
                text: _this.idioma.tlResumenPeriodo,
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
                categories: _this.nameSelect,
                min: 0,
                labels: {
                    align: 'center',
                    enabled: true,
                    rotation: -75,
                    x: 0,
                    y: -30
                }
            },
            yAxis: {
                title: {
                    text: _this.idioma.lbEjeY
                },
                plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: [{
                    name: _this.idioma.lbVentas,
                    data: _this.ventas
                }, {
                    name: _this.idioma.lbCompras,
                    data: _this.compras
                }]
        });
        this.add(chart);
    }
});





