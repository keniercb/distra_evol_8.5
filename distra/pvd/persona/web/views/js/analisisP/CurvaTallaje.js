/**
 * @name analisisft.Cmp - Curvas de tallaje.
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Yaricel Guerra Velázquez
 * @version 1.0
 */
Ext.ns('Pvd.Persona.AnalisisPersona');
Pvd.Persona.AnalisisPersona.CurvaTallaje = Ext.extend(Ext.Panel, {
    layout: 'border',
    id: 'idcurvtallaje',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var self = this;
        var tallas=[];
        var uniqueTallas=[];
        var prenda='';


        this.stprendas = new Ext.data.JsonStore({
            url: '/pvd/persona/index.php/nomprenda/getWear',
            autoLoad: true,
            fields: [
                {name: 'idprenda'},
                {name: 'denominacion'}
            ],
            root: 'data',
            totalProperty: 'quantity'
        });

        //Combo de prendas
        this.cbPrendas = new Ext.form.ComboBox({
            fieldLabel: 'Prenda',
            name: 'idprenda',
            emptyText: 'Seleccione...',
            typeAhead: true,
            store: self.stprendas,
            triggerAction: 'all',
            valueField: 'idprenda',
            hiddenName: 'idprenda',
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
                self.stCurva.load({
                    params: {
                        idprenda: self.cbPrendas.getValue()
                    }
                });
               self.gpCurvasTallaje.setTitle('Listado de personas'+ '&nbsp;'+ '&nbsp;'+ '&nbsp;'+ '&nbsp;'+ '&nbsp;'+
               '&nbsp;'+ '&nbsp;'+ '&nbsp;'+ '&nbsp;'+ '&nbsp;'+ '&nbsp;'+'&nbsp;' +'Prenda:'+ self.cbPrendas.getRawValue());
            }.createDelegate(this)
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiarV',
            text: '<u>L</u>impiar',
            tooltip: 'Limpiar campos <b>(Alt + L)</b>',
            iconCls: 'limpiar',
            handler: function () {
                self.cbPrendas.reset();
                self.stCurva.load();
                ActualizarGrafica();
            }.createDelegate(this)
        });

        //Fuente de datos del listado de altas
        this.stCurva = new Ext.data.Store({
            url: 'getCurvaTallaje',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'quantity',
                    root: "data", id: "idtallaje"
                },
                [
                    {name: 'idtallaje'},
                    {name: 'idpersona'},
                    {name: 'numid'},
                    {name: 'nombreyapellidos'},
                    {name: 'idtalla'},
                    {name: 'denomtalla'},
                    {name: 'idnorma'},
                    {name: 'denomnorma'},
                    {name: 'idprenda'},
                    {name: 'cargo'},
                    {name: 'idcargo'},
                    {name: 'denomprenda'}
                ]
            )
        });

        this.stCurva.load();


        this.sttallas = new Ext.data.JsonStore({
            url: '/pvd/persona/index.php/nomtalla/getSize',
            autoLoad: true,
            fields: [
                {name: 'idtalla'},
                {name: 'denominacion'}
            ],
            root: 'data',
            totalProperty: 'quantity'
        });

        this.smselectPro = new Ext.grid.RowSelectionModel({
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
                        text: 'Exportar Curva de Tallaje  <spam style="color: #a61120">(*.pdf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickPDF
                    },
                    {
                        text: 'Exportar Curva de Tallaje <spam style="color: #0a56c8">(*.rtf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickRTF
                    }
                ]
            }
        });

        this.gpCurvasTallaje = new Ext.grid.GridPanel({
            region: 'south',
            height: 400,
            title: 'Listado de personas',
            autoHeight: false,
            loadMask: {msg: 'Cargando...'},
            store: self.stCurva,
            autoScroll: true,
            sm: this.smselectPro,
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
                    header: 'Norma',
                    width: 150,
                    dataIndex: 'denomnorma'
                },
                {
                    header: 'Talla',
                    width: 150,
                    dataIndex: 'denomtalla'
                }
            ],
            bbar: ['->', this.btnExportar]
        });


        this.sttallas.on('load',function(st,rec,op){

            Ext.each(st.getRange(), function (rec)
            {
                tallas.push(rec.data.denominacion)
            }, this);
             uniqueTallas = Array.from(new Set(tallas))


        });
        this.cbPrendas.on('select',function(cb,rec,op){
            ActualizarGrafica();
        });

        var series = [{name: 'Tallas', data: []}];
        self.pchar = new Ext.components.HighchartPanel({
            border: true,
            layout: 'fit',
            region: 'center',
            chartConfig: {
                chart: {type: 'line'},
                title: {text: 'Registro de prendas'},
                xAxis: {
                    categories: [],
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

        self.items = [{
            region: 'center',
            xtype: 'panel',
            id: 'north-panel',
            height: '50%',
            border: false,
            collapsible: true,
            layout: 'fit',
            items: [self.pchar],
            tbar: ['Prendas: ', this.cbPrendas, '-', this.btnBuscar, this.btnLimpiar]
        }, self.gpCurvasTallaje];



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
            Ext.Ajax.request({
                url: 'getCantTallasbyPersona',
                params: {
                    idprenda: self.cbPrendas.getValue()
                },
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    var ser = new Array();

                    for (i = 0; i < responseData.length; i++) {

                        ser.push(parseInt(responseData[i]));
                    }

                    while (self.pchar.chart.series.length > 0) {
                        self.pchar.chart.series[0].remove(true);
                    }

                    self.pchar.chart.xAxis[0].setCategories(uniqueTallas,true);
                    self.pchar.chart.addSeries({name: 'Tallas', data: ser});
                }
            })
        }

        function onClickPDF() {
            var params = Ext.urlEncode({
                idprenda: self.cbPrendas.getValue(),
                exportar: 1
            });
            var idIframe = Ext.id();

            new Ext.Window({
                title: 'Datos de tallaje',
                width: 800,
                height: 500,
                id: 'winregistro',
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
                        '/pvd/persona/index.php/analisispersona/getCurvaTallaje?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            Ext.getBody().mask('Por favor espere...');
            //PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de altas.');
            document.getElementById(idIframe).onload = function () {
                //PVD.ocultarMascara('rep01');
                Ext.getBody().unmask()
            }
        }

        function onClickRTF() {
            Ext.Ajax.request({
                url: '/pvd/persona/index.php/analisispersona/getCurvaTallaje',
                method: 'POST',
                params: {
                    idprenda: self.cbPrendas.getValue(),
                    exportar: 2
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    window.open(respuesta.url);
                }
            });
        }

        Pvd.Persona.AnalisisPersona.CurvaTallaje.superclass.initComponent.call(this);
    }
});