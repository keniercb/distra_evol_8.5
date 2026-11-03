Ext.ns('Ext.erp.resumengeneral');
Ext.erp.resumengeneral = Ext.extend(LOG.util.Panel, {
    html: '<div id="graficogeneral"></div>',
    compras: 0,
    ventas: 0,
    comprasXdepositos: [],
    ventasXdepositos: [],
    depositos: [],
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.autoShow = true;
        config.idioma = {};
        config.tbar = ['-', '->',
            LOG.util.Prototipos.botonAyuda({id:'idResumenGeneral'})
        ];
        Ext.erp.resumengeneral.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.resumengeneral.Idioma);
        var _this = this;
        this.modelo = new Ext.erp.resumengeneral.Model({
            idioma: this.idioma
        });
        this.modelo.cargarDatos({}, function(r) {
            _this.ventas = r[0].ventas;
            _this.ventasalt = r[0].ventasalt;
            _this.compras = r[0].compras;
            _this.comprasalt = r[0].comprasalt;
            _this.depositos = r[0].depositos;
            _this.comprasXdepositos = _this.parsearNumero(r[0].comprasXdepositos);
            _this.comprasXdepositosAlt = _this.parsearNumero(r[0].comprasXdepositosAlt);
            _this.ventasXdepositos = _this.parsearNumero(r[0].ventasXdepositos);
            _this.ventasXdepositosAlt = _this.parsearNumero(r[0].ventasXdepositosAlt);
            _this.grafica();
        });
    },
    /**
     * Grafica los datos de compra/venta deinventario.
     * @returns {undefined}
     */
    grafica: function() {
        var _this = this;
        Highcharts.setOptions({
            lang: {
                numericSymbols: [" 000", " 000 000", "G", "T", "P", "E"]
            }
        });
        var colors = Highcharts.getOptions().colors;
        var codigo = '';
        if (alternativa) {
            codigo = ' ' + codigoContable;
        }
        var categories = [_this.idioma.lbCompras + codigo, _this.idioma.lbVentas + codigo];
        var name = _this.idioma.tlResumengeneral;
        var data = [{
                y: _this.compras,
                color: colors[1],
                drilldown: {
                    name: _this.idioma.lbCompras + codigo,
                    categories: _this.depositos,
                    data: _this.comprasXdepositos,
                    color: colors[1]
                }
            }, {
                y: _this.ventas,
                color: colors[0],
                drilldown: {
                    name: _this.idioma.lbVentas + codigo,
                    categories: _this.depositos,
                    data: _this.ventasXdepositos,
                    color: colors[0]
                }
            }
        ];
        if (alternativa) {
            data.push({
                y: _this.comprasalt,
                color: colors[1],
                drilldown: {
                    name: _this.idioma.lbCompras + ' ' + codigoAlternativa,
                    categories: _this.depositos,
                    data: _this.comprasXdepositosAlt,
                    color: colors[1]
                }
            });
            data.push({
                y: _this.ventasalt,
                color: colors[0],
                drilldown: {
                    name: _this.idioma.lbVentas + ' ' + codigoAlternativa,
                    categories: _this.depositos,
                    data: _this.ventasXdepositosAlt,
                    color: colors[0]
                }
            });
            categories.push(_this.idioma.lbCompras + ' ' + codigoAlternativa);
            categories.push(_this.idioma.lbVentas + ' ' + codigoAlternativa);
        }

        function setChart(name, categories, data, color) {
            chart.xAxis[0].setCategories(categories, false);
            chart.series[0].remove(false);
            chart.addSeries({
                name: name,
                data: data,
                color: color || 'white'
            }, false);
            chart.redraw();
        }

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'graficogeneral',
                type: 'column'
            },
            title: {
                text: _this.idioma.tlGeneral
            },
            subtitle: {
                text: _this.idioma.msjOrientacion
            },
            numericSymbols: [" - miles", "M", "G", "T", "P", "E"],
            xAxis: {
                categories: categories,
                min: 0,
                labels: {
                    align: 'center',
                    enabled: true,
                    rotation: -70,
                    x: 0,
                    y: 40
                }
            },
            yAxis: {
                title: {
                    text: _this.idioma.lbTotal
                }
            },
            plotOptions: {
                column: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                var drilldown = this.drilldown;
                                if (drilldown) { // drill down
                                    setChart(drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
                                } else { // restore
                                    setChart(name, categories, data);
                                }
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        color: colors[0],
                        style: {
                            fontWeight: 'bold'
                        },
                        formatter: function() {
                            return this.y;
                        }
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            tooltip: {
                formatter: function() {
                    var point = this.point,
                        s = this.x + ':<b>' + this.y + '';
                    if (point.drilldown) {
                        s += _this.idioma.ttOrientacion;
                    } else {
                        s += _this.idioma.ttRetorno;
                    }
                    return s;
                }
            },
            series: [{
                    name: name,
                    data: data,
                    color: 'yelow'
                }
            ]
        });
        this.add(chart);
    },
    /**
     * Convierte los valores del arreglo en numeros.
     * @param {Array} array
     * @returns {Array}
     */
    parsearNumero: function(array) {
        var result = Array();
        if (Ext.isArray(array)) {
            Ext.each(array, function(item) {
                result.push(parseFloat(item));
            });
        }
        return result;
    }
});


