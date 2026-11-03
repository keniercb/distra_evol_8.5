/**
 * @name analisisft.Cmp - RegimenTrabajo
 * @package P
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *        Beatriz Selema Alvarez
 * @version 1.0
 */
Ext.ns('Pvd.ControlAsistencia.RegimenTrabajo');
Pvd.ControlAsistencia.RegimenTrabajo = Ext.extend(Ext.Panel, {
    title: 'Reporte regimen de trabajo',
    layout: 'border',
    id: 'regimentrabajo',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var self = this;
        var regimen = [];

        this.stcbRegimen = new Ext.data.JsonStore({
            url: '/pvd/regimentrabajo/index.php/nomregimentrabajo/getTipoRegimenTrabajo',
            autoLoad: true,
            fields: [
                {name: 'idregimentrabajo'},
                {name: 'denominacion'}
            ],
            root: 'data',
            totalProperty: 'quantity'
        });

        //Combo de prendas
        this.cbRegimen = new Ext.form.ComboBox({
            fieldLabel: 'Régimen de trabajo',
            name: 'idregimentrabajo',
            emptyText: 'Seleccione...',
            typeAhead: true,
            store: self.stcbRegimen,
            triggerAction: 'all',
            valueField: 'idregimentrabajo',
            hiddenName: 'idregimentrabajo',
            editable: false,
            forceSelection: true,
            anchor: '95%',
            displayField: 'denominacion',
            mode: 'local'
        });


        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscarV',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar <b>(Alt + B)</b>',
            iconCls: 'buscar',
            handler: function () {
                self.stgpRegimen.load({
                    params: {
                        idregimentrabajo: self.cbRegimen.getValue()
                    }
                });

            }.createDelegate(this)
        });

//Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiarV',
            text: '<u>L</u>impiar',
            tooltip: 'Limpiar campos <b>(Alt + L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                self.cbRegimen.reset();
                self.stgpRegimen.removeAll();
            }.createDelegate(this)
        });

//Fuente de datos del listado de altas
        this.stgpRegimen = new Ext.data.Store({
            url: 'getReporte',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'quantity',
                    root: "data"
                },
                [
                    {name: 'idregimentrabajo'},
                    {name: 'idpersona'},
                    {name: 'numid'},
                    {name: 'nombreyapellidos'},
                    {name: 'cargo'},
                    {name: 'idcargo'},
                    {name: 'turnodetrabajo'},
                    {name: 'grupodescanso'}


                ]
            )
        });

        this.smgpRegimen = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });


        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar datos',
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Exportar Régimen de trabajo  <spam style="color: #a61120">(*.pdf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickPDF
                    },
                    {
                        text: 'Exportar Régimen de trabajo <spam style="color: #0a56c8">(*.rtf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickRTF
                    }
                ]
            }
        });


        this.gpRegimen = new Ext.grid.GridPanel({
            region: 'south',
            height: 400,
            title: 'Listado de personas',
            autoHeight: false,
            loadMask: {msg: 'Cargando...'},
            store: self.stgpRegimen,
            autoScroll: true,
            sm: this.smgpRegimen,
            columns: [
                {
                    header: 'No. de identidad',
                    width: 150,
                    dataIndex: 'numid'
                },
                {
                    header: 'Apellidos y nombres',
                    width: 300,
                    dataIndex: 'nombreyapellidos'
                },
                {
                    header: 'Cargo',
                    width: 250,
                    dataIndex: 'cargo'
                },
                {
                    header: 'Grupo de descanso',
                    width: 200,
                    dataIndex: 'grupodescanso'
                },
                {
                    header: 'Turno de trabajo',
                    width: 300,
                    dataIndex: 'turnodetrabajo'
                }
            ],
            bbar: ['->', this.btnExportar]
        });


        this.stcbRegimen.on('load', function (st, rec, op) {
            ActualizarGrafica();
        });

        var series = [
            {name: 'Régimen de trabajo', data: [0, 0, 0, 0]}
        ];

        self.pchar = new Ext.components.HighchartPanel({
            border: true,
            layout: 'fit',
            region: 'center',
            chartConfig: {
                chart: {type: 'line'},
                title: {text: 'Régimen de trabajo '},
                xAxis: {
                    categories: regimen,
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
                series: series
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
                layout: 'fit',
                items: [self.pchar],
                tbar: ['Régimen de trabajo: ', this.cbRegimen, '-', this.btnBuscar, this.btnLimpiar]
            },
            self.gpRegimen
        ];

        this.keys = [
            {
                key: 'b',
                alt: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ]
        function ActualizarGrafica() {

            Ext.Ajax.request({
                url: 'getCantPersonaByRegimen',
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    var ser = new Array();
                    for (i = 0; i < responseData.length; i++) {
                        ser.push(parseInt(responseData[i]['cantidad']));
                        regimen.push(responseData[i]['regimen']);

                    }

                    while (self.pchar.chart.series.length > 0) {
                        self.pchar.chart.series[0].remove(true);
                    }

                    self.pchar.chart.xAxis[0].setCategories(regimen, true);
                    self.pchar.chart.addSeries({name: 'Régimen de trabajo', data: ser});
                }
            })
        }


        function onClickPDF() {
            var params = Ext.urlEncode({
                idregimentrabajo: self.cbRegimen.getValue(),
                denonregimen: self.cbRegimen.getRawValue(),
                exportar: 1
            });

            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Régimen de trabajo',
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
                            '/pvd/regimentrabajo/index.php/reporteregimentrab/getReporte?' + params
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
            Ext.Ajax.request({
                url: '/pvd/regimentrabajo/index.php/reporteregimentrab/getReporte',
                method: 'POST',
                params: {
                    idregimentrabajo: self.cbRegimen.getValue(),
                    denonregimen: self.cbRegimen.getRawValue(),
                    exportar: 2
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    window.open(respuesta.url);
                }
            });
        }

        Pvd.ControlAsistencia.RegimenTrabajo.superclass.initComponent.call(this);
    }
})
;

new Ext.Viewport({
    layout: 'fit',
    items: [new Pvd.ControlAsistencia.RegimenTrabajo()]

});