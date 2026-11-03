/**
 * @name analisisft.Cmp - Situacion Defensa
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *        Beatriz Selema Alvarez
 * @version 1.0
 */
Ext.ns('Pvd.Persona.AnalisisPersona');
Pvd.Persona.AnalisisPersona.SituacionDefensa = Ext.extend(Ext.Panel, {
    layout: 'border',
    id: 'idsituaciondefensa',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var self = this;
        var asignacion = [];
        var series = [];

        this.stasignacion = new Ext.data.JsonStore({
            url: '/pvd/persona/index.php/nomasigdefensa/getAsiganacionDefensa',
            autoLoad: true,
            fields: [
                {name: 'idasignaciondefensa'},
                {name: 'denominacion'}
            ],
            root: 'data',
            totalProperty: 'quantity'
        });

        //Combo de prendas
        this.cbAsignacion = new Ext.form.ComboBox({
            fieldLabel: 'Asignación defensa',
            name: 'idasignaciondefensa',
            emptyText: 'Seleccione...',
            typeAhead: true,
            store: self.stasignacion,
            triggerAction: 'all',
            valueField: 'idasignaciondefensa',
            hiddenName: 'idasignaciondefensa',
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
                self.stSituacion.load({
                    params: {
                        idasignaciondefensa: self.cbAsignacion.getValue()
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
                self.cbAsignacion.reset();
                self.stSituacion.removeAll();
            }.createDelegate(this)
        });

//Fuente de datos del listado de altas
        this.stSituacion = new Ext.data.Store({
            url: 'reporteSituaDefensa',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'quantity',
                    root: "data"
                },
                [
                    {name: 'idsituaciondefensa'},
                    {name: 'idpersona'},
                    {name: 'numid'},
                    {name: 'nombreyapellidos'},
                    {name: 'idasignacion'},
                    {name: 'cargo'},
                    {name: 'idcargo'},
                    {name: 'cargodefensa'}

                ]
            )
        });

        this.stSituacion.load();

        this.smgpSituacion = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });


        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar datos',
            // disabled: true,
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Exportar Situación en la defensa  <spam style="color: #a61120">(*.pdf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickPDF
                    },
                    {
                        text: 'Exportar Situación en la defensa <spam style="color: #0a56c8">(*.rtf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickRTF
                    }
                ]
            }
        });

        this.gpSituacion = new Ext.grid.GridPanel({
            region: 'south',
            height: 400,
            title: 'Listado de personas',
            autoHeight: false,
            loadMask: {msg: 'Cargando...'},
            store: self.stSituacion,
            autoScroll: true,
            sm: this.smgpSituacion,
            columns: [
                {
                    header: 'No. de identidad',
                    width: 200,
                    dataIndex: 'numid'
                },
                {
                    header: 'Apellidos y nombres',
                    width: 320,
                    dataIndex: 'nombreyapellidos'
                },
                {
                    header: 'Cargo',
                    width: 300,
                    dataIndex: 'cargo'
                },
                {
                    header: 'Cargo defensa',
                    width: 150,
                    dataIndex: 'cargodefensa'
                }
            ],
            bbar: ['->', this.btnExportar]
        });


        this.stasignacion.on('load', function (st, rec, op) {
            ActualizarGrafica();
        });



        self.pchar = new Ext.components.HighchartPanel({
            border: true,
            layout: 'fit',
            region: 'center',
            chartConfig: {
                chart: {type: 'line'},
                title: {text: 'Situación en la  defensa '},
                xAxis: {
                    categories: asignacion,
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
                tbar: ['Asignación defensa: ', this.cbAsignacion, '-', this.btnBuscar, this.btnLimpiar]
            },
            self.gpSituacion
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
                url: 'getCantPersonaBySituacion',
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    var ser = new Array();
                    for (i = 0; i < responseData.length; i++) {
                        ser.push(parseInt(responseData[i]['cantidad']));
                        asignacion.push(responseData[i]['asignaciondefensa']);

                    }

                    while (self.pchar.chart.series.length > 0) {
                        self.pchar.chart.series[0].remove(true);
                    }

                    self.pchar.chart.xAxis[0].setCategories(asignacion, true);
                    self.pchar.chart.addSeries({name: 'Asignación en la  defensa', data: ser});
                }
            })
        }


        function onClickPDF() {
            var params = Ext.urlEncode({
                idasignaciondefensa: self.cbAsignacion.getValue(),
                exportar: 1
            });
            var idIframe = Ext.id();

            new Ext.Window({
                title: 'Situación defensa',
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
                            '/pvd/persona/index.php/analisispersona/reporteSituaDefensa?' + params
                    }
                }
            }).show();
            Ext.getCmp('winsit').maximize();
            Ext.getBody().mask('Por favor espere...');
            //PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de altas.');
            document.getElementById(idIframe).onload = function () {
                //PVD.ocultarMascara('rep01');
                Ext.getBody().unmask()
            }
        }

        function onClickRTF() {
            Ext.Ajax.request({
                url: '/pvd/persona/index.php/analisispersona/reporteSituaDefensa',
                method: 'POST',
                params: {
                    idasignaciondefensa: self.cbAsignacion.getValue(),
                    exportar: 2
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    window.open(respuesta.url);
                }
            });
        }

        Pvd.Persona.AnalisisPersona.SituacionDefensa.superclass.initComponent.call(this);
    }
})
;