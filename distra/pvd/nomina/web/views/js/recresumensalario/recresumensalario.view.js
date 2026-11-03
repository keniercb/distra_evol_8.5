Ext.ns('Pvd.Nomina.Recuperacion.Resumensalario');

Ext.QuickTips.init();

Pvd.Nomina.Recuperacion.Resumensalario.Vista = {
    init: function (perfil, idioma, modelo) {
        var self = this;

           this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            //hidden: true,
            tooltip: 'Exportar a Excel',
            iconCls: 'exportar',
            text: 'Exportar'
        });

        this.pEstEntidades = new Ext.estructura.panel.PanelEstructura({
            checker: [1, 2, 3, 4, 5],
            checked: false,
            cargos: false,
            menu: false,
            limit: [5]
        });

        this.pEntidades = new Ext.Panel({
            title: 'Entidades',
            region: 'west',
            layout: 'fit',
            width: '60%',
            collapsible: true,
            resizable: true,
            split: true,
            items: [this.pEstEntidades]
        });

        this.smTipoPagos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpTiposPago = new Ext.grid.GridPanel({
            title: 'Tipos de pagos',
            autoExpandColumn: 'denominacion',
            columns: [this.smTipoPagos,
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'Denominación', dataIndex: 'denominacion', id: 'denominacion', width: 200}
                /*,{header: 'Descripción', dataIndex: 'descripcion', width: 200}*/
            ],
            id: 'this.gpTiposPago',
            store: modelo.stTipoPago,
            sm: this.smTipoPagos,
            region: 'center',
            border: true,
            width: 100,
            split: true,
            stripeRows: true,
            hideBorders: true,
            loadMask: {msg: 'Cargando...'},
            autoScroll: true

        });

        this.smPeriodoPago = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.formatoPeriodosPago = function (val, metadata, record, ri, ci) {
            if (record.data.estado == 1)
                return '<span style="color:blue;">' + val + '</span>';
            else if (record.data.estado == 2)
                return '<span style="color:green;">' + val + '</span>';
            else return val;
        }.createDelegate(this);

        this.gpPeriodosPagos = new Ext.grid.EditorGridPanel({
            title: 'Períodos de pagos',
            store: modelo.stPeriodosPago,
            region: 'east',
            layout: 'fit',
            border: true,
            split: true,
            stripeRows: true,
            hideBorders: true,
            loadMask: {text: 'Cargando...'},
            width: 500,
            //height:600,
            columns: [
                {header: 'idelaborarpagos', dataIndex: 'idelaborarpagos', width: 100, hidden: true},
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'idperiodopago', dataIndex: 'idperiodopago', width: 100, hidden: true},
                {header: 'estado', dataIndex: 'estado', width: 100, hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anyo', width: 100, hidden: true},
                {header: 'mesanyopago', dataIndex: 'mesanyopago', width: 100, hidden: true},
                {
                    header: 'Per&iacute;odo',
                    dataIndex: 'idperiodopago',
                    width: 100,
                    hidden: true,
                    renderer: this.formatoPeriodosPago
                },
                {
                    header: 'Tipo de pago',
                    dataIndex: 'denomtipopago',
                    width: 100,
                    renderer: this.formatoPeriodosPago,
                    hidden: true
                },
                {header: 'Rango fechas', dataIndex: 'periodopago', width: 150, renderer: this.formatoPeriodosPago},
                {
                    header: 'Fecha inicio período',
                    dataIndex: 'fechainicioperiodo',
                    width: 100,
                    renderer: this.formatoPeriodosPago
                },
                {
                    header: 'Fecha fin período',
                    dataIndex: 'fechafinperiodo',
                    width: 100,
                    renderer: this.formatoPeriodosPago
                },
                {
                    header: 'Fecha de pago',
                    dataIndex: 'fechapago',
                    width: 120,
                    renderer: this.formatoPeriodosPago,
                    hidden: true
                },
                {header: 'Mes', dataIndex: 'mes', width: 150, hidden: true, renderer: this.formatoPeriodosPago}
            ],
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smPeriodoPago
        });

        //Panel de Caja
        this.pPeriodosPago = new Ext.Panel({
            //title      : 'Tipos y periodos de pago',
            region: 'center',
            layout: 'border',
            collapsible: true,
            resizable: true,
            split: true,
            items: [this.gpTiposPago, this.gpPeriodosPagos]
        });

        //Grid Salario Total
        this.stResumen = new Ext.data.GroupingStore({
            fields: ['id', 'plantillanominal'],
            sortInfo: {field: 'plantillanominal', direction: "ASC"},
            groupField: 'plantillanominal'
        });
        this.cmResumen = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
                {header: "Entidad", id: 'entidad', width: 500, sortable: true, dataIndex: 'id'},
                {header: "Valores...", width: 500, sortable: true, dataIndex: 'id'}
            ]
        });
        this.smCamposResumen = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, rowIndex, r) {
                }.createDelegate(this),
                rowdeselect: function (sm, rowIndex, r) {

                }.createDelegate(this)
            }
        });
        this.gpResumen = new Ext.grid.GridPanel({
            title: 'Salario total',
            id: 'idGpResumen',
            store: this.stResumen,
            colModel: this.cmResumen,
            sm: this.smCamposResumen,
            region: 'center',
            autoExpandColumn: 'entidad',
            border: true,
            split: true,
            stripeRows: true,
            hideBorders: true,
            tbar: [self.btnExportar],

            loadMask: {msg: 'Cargando...'},
            autoScroll: true

        });

        //Grid Salario Mujeres
        this.stResumenMujeres = new Ext.data.GroupingStore({
            fields: ['id', 'plantillanominal'],
            sortInfo: {field: 'plantillanominal', direction: "ASC"},
            groupField: 'plantillanominal'
        });
        this.cmResumenMujeres = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
                {header: "Entidad", id: 'entidad', width: 500, sortable: true, dataIndex: 'id'},
                {header: "Valores...", width: 500, sortable: true, dataIndex: 'id'}
            ]
        });
        this.smCamposResumenMujeres = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, rowIndex, r) {
                }.createDelegate(this),
                rowdeselect: function (sm, rowIndex, r) {

                }.createDelegate(this)
            }
        });
        this.gpResumenMujeres = new Ext.grid.GridPanel({
            title: 'Salario total mujeres',
            id: 'idGpResumenMujeres',
            store: this.stResumenMujeres,
            colModel: this.cmResumenMujeres,
            sm: this.smCamposResumenMujeres,
            region: 'center',
            autoExpandColumn: 'entidad',
            border: true,
            split: true,
            stripeRows: true,
            hideBorders: true,
            tbar: [self.btnExportar],
            loadMask: {msg: 'Cargando...'},
            autoScroll: true
        });

        //Grid Salario Hombres
        this.stResumenHombres = new Ext.data.GroupingStore({
            fields: ['id', 'plantillanominal'],
            sortInfo: {field: 'plantillanominal', direction: "ASC"},
            groupField: 'plantillanominal'
        });
        this.cmResumenHombres = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
                {header: "Entidad", id: 'entidad', width: 500, sortable: true, dataIndex: 'id'},
                {header: "Valores...", width: 500, sortable: true, dataIndex: 'id'}
            ]
        });
        this.smCamposResumenHombres = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, rowIndex, r) {
                }.createDelegate(this),
                rowdeselect: function (sm, rowIndex, r) {

                }.createDelegate(this)
            }
        });
        this.gpResumenHombres = new Ext.grid.GridPanel({
            title: 'Salario total hombres',
            id: 'idGpResumenHombres',
            store: this.stResumenHombres,
            colModel: this.cmResumenHombres,
            sm: this.smCamposResumenHombres,
            region: 'center',
            autoExpandColumn: 'entidad',
            border: true,
            split: true,
            stripeRows: true,
            hideBorders: true,
            tbar: [self.btnExportar],
            loadMask: {msg: 'Cargando...'},
            autoScroll: true
        });

        //Grafica
        this.btnGraficar = new Ext.Button({
            text: 'Graficar',
            iconCls: 'chart_bar',
            handler: function () {
            }
        });
        this.configChartResumen = new Array();
        
        this.configChartResumen.push({
            titulo: 'Cantidad de personas por sexo',
            tipo: 'pie',
            series: [{
                nombre: 'Cantidad', 
                datos: [] 
            }],
            x: {},
            y: {}
        });
       this.chartResumen = new PVD.Graficas.Contenedor({
            title: 'Gráfica',
            id: 'contenedorChart',
            config: this.configChartResumen,
            columnas: 1,
            height: 100,
            idpanel:'contenedorChart'
        });

        this.tabPanelResumen = new Ext.TabPanel({
            id:'idTabpanel',
            region: 'center',
            margins: '0 5 5 0',
            height: '100%',
            width: '45%',
            border: false,
            split: true,
            enableTabScroll: true,
            autoScroll: true,
            layoutOnTabChange: true,
            activeTab: 0,
            items: [this.gpResumen,this.gpResumenMujeres, this.gpResumenHombres]
        });
        
        if (this.pResumenDummy) {
            this.pResumenDummy.destroy();
        }

        this.pResumen = new Ext.Panel({
            id: 'idpanelresumen', 
            title: 'Resumen de salarios',
            region: 'south',
            layout: 'border',
            height: 300,
            collapsible: true,
            resizable: true,
            split: true,
            items: [this.tabPanelResumen] 
        });

        //Ventana Principal
        this.winExportarBanco = new Ext.Window({
            modal: true,
            height: 600,
            width: 800,
            closable: false,
            constrain: true,
            collapsible: false,
            resizable: false,
            layout: 'border',
            //tbar: [this.btnCerrarResumen, '->', this.btnDescAplicados, this.btnResumenGeneral, '|', this.btnAyuda],
            items: [this.pEntidades, this.pPeriodosPago, this.pResumen]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('recresumensalario', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Recuperacion.Resumensalario.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Recuperacion.Resumensalario.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Recuperacion.Resumensalario.Controlador.init(idioma, vista, modelo);
});
