/**
 * @name analisisft.Cmp - Estado de la vivienda
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *        Beatriz Selema Alvarez
 * @version 1.0
 */
Ext.ns('Pvd.Persona.AnalisisPersona');
Pvd.Persona.AnalisisPersona.EstadoVivienda = Ext.extend(Ext.Panel, {
    layout: 'border',
    id: 'idestadovivienda',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    border: false,
    initComponent: function () {
        var self = this;
        var estado = [];
        var situacion = [];
        var seriesE = [];
        var seriesS = [];

        ActualizarGrafica();
        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar datos',
            // disabled: true,
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Exportar Estado de la vivienda  <spam style="color: #a61120">(*.pdf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickPDF
                    },
                    {
                        text: 'Exportar Estado de la vivienda<spam style="color: #0a56c8">(*.rtf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickRTF
                    }
                ]
            }
        });


//Fuente de datos del listado de altas
        this.stgp = new Ext.data.GroupingStore({
            url: 'estadoVivienda',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'quantity',
                    root: "data"
                },
                [
                    {name: 'idpersona'},
                    {name: 'idestadovivienda'},
                    {name: 'idconvivencia'},
                    {name: 'idpersona'},
                    {name: 'numid'},
                    {name: 'nombreyapellidos'},
                    {name: 'cargo'},
                    {name: 'idcargo'},
                    {name: 'ueb'},
                    {name: 'estadovivienda'},
                    {name: 'convivencia'}

                ]
            ),
            sortInfo: {field: 'ueb', direction: "DESC"},
            groupField: 'ueb'
        });


        this.smgp = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });


        this.gpEstado = new Ext.grid.GridPanel({
            id: 'gpEstado',
            region: 'south',
            height: 400,
            title: 'Listado de personas',
            //  autoHeight: false,
            loadMask: {msg: 'Cargando...'},
            store: self.stgp,
            autoScroll: true,
            sm: this.smgp,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: true,
                groupTextTpl: '{group}'
            }),
            columns: [
                {
                    header: 'No. de identidad',
                    width: 100,
                    fixed: true,
                    dataIndex: 'numid'
                },
                {
                    header: 'Apellidos y nombre',
                    dataIndex: 'nombreyapellidos'
                },
                {
                    header: 'Cargo',
                    width: 250,
                    fixed: true,
                    dataIndex: 'cargo'
                },
                {
                    header: 'Estado de la vivienda',
                    width: 120,
                    fixed: true,
                    dataIndex: 'estadovivienda'
                },
                {
                    header: 'Situación de la convivencia',
                    width: 150,
                    fixed: true,
                    dataIndex: 'convivencia'
                },
                {
                    header: '',
                    hidden: true,
                    dataIndex: 'ueb'
                }
            ],
            bbar: ['->', this.btnExportar]
        });

        (function () {
            self.stgp.load();
        }).defer(100);

        /*  var seriesE = [
         {name: 'Estados', data: []}
         ];*/

        self.pcharestado = new Ext.components.HighchartPanel({
            border: true,
            region: 'center',
            width: '50%',
            chartConfig: {
                chart: {type: 'line'},
                title: {text: 'Estado de la vivienda '},
                xAxis: {
                    categories: estado,
                    labels: {rotation: -45, align: 'right'}
                },
                yAxis: {min: 0, title: {text: 'Cantidad de personas'}},
                tooltip: {
                    headerFormat: '<span style="font-size:11px"><b>{point.key}</b></span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0;font-size:11px">{series.name}: </td>' +
                        '<td style="padding:0;font-size:11px"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: seriesE
            }
        });


        self.pcharsituacion = new Ext.components.HighchartPanel({
            border: true,
            region: 'west',
            width: '50%',
            chartConfig: {
                chart: {type: 'line'},
                title: {text: 'Situación de convivencia '},
                xAxis: {
                    categories: situacion,
                    labels: {rotation: -45, align: 'right'}
                },
                yAxis: {min: 0, title: {text: 'Cantidad de personas'}},
                tooltip: {
                    headerFormat: '<span style="font-size:11px"><b>{point.key}</b></span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0;font-size:11px">{series.name}: </td>' +
                        '<td style="padding:0;font-size:11px"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: seriesS
            }
        });

        self.items = [
            {
                region: 'center',
                xtype: 'panel',
                id: 'north-panel',
                height: '50%',
                border: false,
                collapsible: true,
                layout: 'border',
                items: [  self.pcharestado, self.pcharsituacion]
            },
            self.gpEstado
        ];


        function ActualizarGrafica() {

            Ext.Ajax.request({
                url: 'getCantPersonaByEstado',
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);

                    while (self.pcharestado.chart.series.length > 0) {
                        self.pcharestado.chart.series[0].remove(true);
                    }

                    Ext.each(responseData.arrayentidades, function (entidades) {
                        seriesE.push(entidades.denominacion);
                    });

                    self.pcharestado.chart.xAxis[0].setCategories(seriesE, true);
                    Ext.each(responseData.datosgraficar, function (serie) {
                        self.pcharestado.chart.addSeries(serie);
                    });
                   // self.pcharestado.chart.addSeries(responseData.datosgraficar);

                }
            })
        }


        function onClickPDF() {
            var params = Ext.urlEncode({
                exportar: 1
            });
            var idIframe = Ext.id();

            new Ext.Window({
                title: 'Estado de la vivienda',
                width: 800,
                height: 500,
                id: 'winsit',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                            '/pvd/persona/index.php/analisispersona/estadoVivienda?' + params
                    }
                }
            }).show();
            Ext.getCmp('winsit').maximize();
            Ext.getBody().mask('Por favor espere...');
            document.getElementById(idIframe).onload = function () {
                Ext.getBody().unmask()
            }
        }


        function onClickRTF() {
            Ext.getBody().mask('Por favor espere...');
            Ext.Ajax.request({
                url: '/pvd/persona/index.php/analisispersona/estadoVivienda',
                method: 'POST',
                params: {
                    exportar: 2
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    window.open(respuesta.url);
                    Ext.getBody().unmask()
                }
            });
        }

        Pvd.Persona.AnalisisPersona.EstadoVivienda.superclass.initComponent.call(this);
    }
})
;