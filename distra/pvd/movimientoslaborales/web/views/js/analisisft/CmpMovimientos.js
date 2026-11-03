/**
 * @name analisisft.CmpMovimientos - Movimientos.
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Yaricel Guerra Velázquez
 * @version 1.0
 */
Ext.ns('Pvd.MovimientosLaborales.Analisisft');
Pvd.MovimientosLaborales.Analisisft.Movimientos = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'dbMovimientos',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var self = this;
        //Fechas para el buscar
        var fechab = new Date();
        var f = fechab.format('d/m/Y');
        this.dfFIniciob = new Ext.form.DateField({
            id: 'dfFIniciobM',
            name: 'fdesde',
            hiddenname:'fdesde',
            width:160,
            format:'d/m/Y',
            value: '01/01/'+f.split('/')[2],
            editable:false,
            readOnly : true,
            maxValue:fechab.format('d/m/Y'),
            endDateField: 'dfFFinbM',
            //maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900'
        });

        /*this.dfFIniciob.on('valid',function(n, m, o){
            var fselect = n.getRawValue();
            if(fselect.split('/')[2] < f.split('/')[2]) {
                self.dfFFinb.setMaxValue('31/12/'+fselect.split('/')[2]);
                self.dfFFinb.setValue('31/12/'+fselect.split('/')[2]);
            } else if (fselect.split('/')[2] == f.split('/')[2]) {
                self.dfFFinb.setMaxValue(f);
                self.dfFFinb.setValue(f);
            }
        });*/

        this.dfFFinb = new Ext.form.DateField({
            id: 'dfFFinbM',
            name: 'fhasta',
            hiddenname:'fhasta',
            width:160,
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            value: f,
            maxValue: fechab.format('d/m/Y'),
            // maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            startDateField: 'dfFIniciobM'
        });

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscarV',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar bajas <b>(Alt + B)</b>',
            iconCls: 'buscar',
            handler: function ()
            {
                self.stMov.load({ params:{
                    fdesde: self.dfFIniciob.getRawValue(),
                    fhasta: self.dfFFinb.getRawValue()
                }
                });
                ActualizarGrafica();
            }.createDelegate(this)
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiarV',
            text: '<u>L</u>impiar',
            tooltip: 'Limpiar campos <b>(Alt + L)</b>',
            iconCls: 'limpiar',
            handler: function ()
            {
                self.dfFIniciob.reset();
                self.dfFFinb.reset();
                self.stMov.load();
                ActualizarGrafica();
                self.dfFFinb.setMaxValue(fechab.format('d/m/Y'));
            }.createDelegate(this)
        });
        this.stMov = new Ext.data.GroupingStore({
            url: 'getMovByMes',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idsituacionlaboralp"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'situacion'}, {name:'idsituacionlaboralp'}, {name:'fdesde'}
                    , {name:'fhasta'}, {name:'mes'}, {name:'year'}, {name: 'm_a'}, {name: 'cargo'}, {name: 'denomarea'}, {name: 'denomentidad'}]
            ),
            sortInfo   : {
                field: 'm_a',
                direction: "DESC"
            },
            groupField : 'm_a',
            remoteGroup: true,
            listeners: {
                load: function(st, data) {
                    if (data.length == 0) {
                        mostrarMensaje(1, "No existen datos que mostrar.");
                        self.btnExportar.disable();
                    } else {
                        self.btnExportar.enable();
                    }
                }
            }
        });

        this.stMov.load();

        this.smselectPro = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar datos',
            disabled: true,
            iconCls: 'exportar',
            menu: {items: [
                {text: 'Registro de movimientos <spam style="color: #a61120">(*.pdf)</spam>', iconCls: 'registrodecomprobante', disabled: false, id: 'pdf', handler: onClickPDF},
                {text: 'Registro de movimientos <spam style="color: #0a56c8">(*.rtf)</spam>', iconCls: 'registrodecomprobante', disabled: false, id: 'rtf', handler: onClickRTF}
            ]}
        });

        this.gpMov = new Ext.grid.GridPanel({
            region: 'west',
            split: true,
            width: '50%',
            autoHeight: false,
            store: self.stMov,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: true,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            sm: this.smselectPro,
            columns: [
                {
                    header: 'No. de identidad',
                    width: 180,
                    dataIndex: 'numid'
                },
                {
                    header:'Apellidos y nombres',
                    width: 250,
                    dataIndex: 'nombreyapellidos'
                },
                {
                    header:'Fecha de movimiento',
                    width: 120,
                    dataIndex: 'fhasta'
                },
                {
                    header:'Entidad',
                    width: 100,
                    dataIndex: 'denomentidad'
                },
                {
                    header:'Área',
                    width: 100,
                    dataIndex: 'denomarea'
                },
                {
                    header:'Cargo',
                    width: 100,
                    dataIndex: 'cargo'
                },
                {
                    width: 100,
                    hidden: true,
                    dataIndex: 'm_a',
                    renderer: mostrarMes
                }
            ],
            tbar: ['Desde: ', this.dfFIniciob,'Hasta: ' , this.dfFFinb,'-' , this.btnBuscar, this.btnLimpiar],
            bbar: ['->', this.btnExportar]
        });

        var series = [];
        this.pchar = new Ext.components.HighchartPanel({
            border: true,
            layout: 'fit',
            region: 'center',
            chartConfig: {
                chart: {type: 'line'},
                title: {text: 'Registro de movimientos'},
                xAxis: {
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

        self.items = [{region: 'center',
            xtype: 'panel',
            id: 'center-panelb',
            width: '50%',
            border: false,
            collapsible: true,
            layout: 'fit',
            items: [self.pchar]
        },self.gpMov];

        ActualizarGrafica();

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
        ];

        function ActualizarGrafica(){
            Ext.getBody().mask('Cargando datos...');
            Ext.Ajax.request({
                url: 'getCantMovByMes',
                params: {
                    fdesde: self.dfFIniciob.getRawValue(),
                    fhasta: self.dfFFinb.getRawValue()
                },
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    var xCategories = new Array();
                    for (p = 0; p < responseData.meses.length; p++) {
                        xCategories.push(mostrarMes(responseData.meses[p].mes, 'g', responseData.meses[p].year));
                    }
                    self.pchar.chart.xAxis[0].setCategories(xCategories);

                    var ser = new Array();
                    for (i = 0; i < responseData.cantidades.length; i++) {
                        ser.push(parseInt(responseData.cantidades[i]));
                    }

                    while (self.pchar.chart.series.length > 0) {
                        self.pchar.chart.series[0].remove(true);
                    }
                    self.pchar.chart.addSeries({name: 'Movimientos', data: ser});
                }
            })
        }

        function mostrarMes(valor, metaData, record) {
            var year = (metaData == 'g')?record:record.get('year');
            var val = (metaData == 'g')?valor:record.get('mes');
            if (val == 1) {
                return 'Enero/'+year;
            } else if (val == 2) {
                return 'Febrero/'+year;
            } else if (val == 3) {
                return 'Marzo/'+year;
            } else if (val == 4) {
                return 'Abril/'+year;
            } else if (val == 5) {
                return 'Mayo/'+year;
            } else if (val == 6) {
                return 'Junio/'+year;
            } else if (val == 7) {
                return 'Julio/'+year;
            } else if (val == 8) {
                return 'Agosto/'+year;
            }  else if (val == 9) {
                return 'Septiembre/'+year;
            }  else if (val == 10) {
                return 'Octubre/'+year;
            }  else if (val == 11) {
                return 'Noviembre/'+year;
            } else {
                return 'Diciembre/'+year;
            }
        }

        function onClickPDF()
        {
            var params = Ext.urlEncode({
                fdesde: self.dfFIniciob.getRawValue(),
                fhasta: self.dfFFinb.getRawValue(),
                exportar: 1
            });
            var idIframe = Ext.id();

            new Ext.Window({
                title: 'Registro de movimientos',
                width: 800,
                height: 500,
                id: 'winregistrom',
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
                        '/pvd/movimientoslaborales/index.php/analisisft/getMovByMes?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistrom').maximize();
            Ext.getBody().mask('Por favor espere...');
            //PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de movimientos.');
            document.getElementById(idIframe).onload = function () {
                //PVD.ocultarMascara('rep01');
                Ext.getBody().unmask()
            }
        }

        function onClickRTF()
        {
            Ext.Ajax.request({
                url: '/pvd/movimientoslaborales/index.php/analisisft/getMovByMes',
                method : 'POST',
                params: {fdesde: self.dfFIniciob.getRawValue(),
                    fhasta: self.dfFFinb.getRawValue(),
                    exportar: 2
                },
                callback: function(options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    window.open(respuesta.url);
                }
            });
        }

        Pvd.MovimientosLaborales.Analisisft.Movimientos.superclass.initComponent.call(this);
    }
});