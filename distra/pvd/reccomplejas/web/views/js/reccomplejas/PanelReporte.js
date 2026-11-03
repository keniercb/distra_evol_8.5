Ext.ns("Ext.components.CmpReccomplejas.");
/*****************************Nuevo panel para exportar las personas*************************/
Ext.components.CmpReccomplejas.winReporte = Ext.extend(Ext.Window, {
    initComponent : function () {
        var self = this;
        this.tiporeporte = 'Exel';
        this.tipovisualizacion = 'General';

        //this.formatExcel = false;
        this.formatExcel = '';

        var btnAcpReporte = new Ext.Button({
            nextTab: 'denominacion',
            id     : 'btnAcpReporte&',
            iconCls: 'aceptar',
            text   : 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            handler: function () {
                if (this.aceptarReporte(true))
                    this.destroy();
            }.createDelegate(this)
        });
        var btnCancReporte = new Ext.Button({
            disabled: false,
            id      : 'btnCancReporte&',
            tooltip : 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
            iconCls : 'cancelar',
            text    : 'Cancelar',
            handler : function () {
                this.destroy();
            }.createDelegate(this)
        });
        this.layout = 'fit',
        this.modal = true;
        this.closeAction = 'destroy';
        this.title = 'Seleccionar formato';
        this.resizable = false;
        this.width = 385;
        this.height = 300;
        this.buttons = [btnCancReporte, btnAcpReporte];
        this.keys = [
            {
                key      : Ext.EventObject.ENTER,
                stopEvent: true,
                fn       : function () {
                    btnAcpReporte.handler();
                }
            },
            {
                key      : 'x',
                alt      : true,
                stopEvent: true,
                fn       : function () {
                    btnCancReporte.handler();
                }
            }
        ];

        this.radioGeneral = new Ext.form.Radio({
            disabled : true,
            hideLabel: true,
            id       : 'rad3',
            align    : 'center',
            boxLabel : 'General',
            name     : 'tipoacceso',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        if(self.formatExcel=='excel'){
                            self.tiporeporte = 'Excel';
                            self.tipovisualizacion = 'General';
                            btnAcpReporte.enable();
                        }
                        else if(self.formatExcel=='pdf')
                        {
                            self.tiporeporte = 'Pdf';
                            self.tipovisualizacion = 'General';
                            btnAcpReporte.enable();
                        }else{
                            self.tiporeporte = 'Word';
                            self.tipovisualizacion = 'General';
                            btnAcpReporte.enable();
                        }

                    }
                }.createDelegate(this)
            }
        });
        this.radioPlantillas = new Ext.form.Radio({
            disabled : true,
            hideLabel: true,
            id       : 'rad4',
            align    : 'center',
            boxLabel : 'Página actual',
            name     : 'tipoacceso',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        if(self.formatExcel=='excel'){
                            self.tiporeporte = 'Excel';
                            self.tipovisualizacion = 'Plantillas';
                            btnAcpReporte.enable();
                        }
                        else if(self.formatExcel=='pdf')
                        {   self.tiporeporte = 'Pdf';
                            self.tipovisualizacion = 'Plantillas';
                            btnAcpReporte.enable();
                        }else{
                            self.tiporeporte = 'Word';
                            self.tipovisualizacion = 'Plantillas';
                            btnAcpReporte.enable();
                        }

                    }
                }.createDelegate(this)
            }
        });

        this.radioSeleccionado = new Ext.form.Radio({
            disabled : true,
            hideLabel: true,
            id       : 'rad8',
            align    : 'center',
            boxLabel : 'Personas seleccionadas',
            name     : 'tipoacceso',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        if(self.formatExcel=='excel'){
                            self.tiporeporte = 'Excel';
                            self.tipovisualizacion = 'Seleccionado';
                            btnAcpReporte.enable();
                        }
                        else if(self.formatExcel=='pdf')
                        {   self.tiporeporte = 'Pdf';
                            self.tipovisualizacion = 'Seleccionado';
                            btnAcpReporte.enable();
                        }else{
                            self.tiporeporte = 'Word';
                            self.tipovisualizacion = 'Seleccionado';
                            btnAcpReporte.enable();
                        }

                    }
                }.createDelegate(this)
            }
        });

        this.fsRadiosPdf = new Ext.form.FieldSet({
            autoHeight : true,
            defaultType: 'radio',
            items      : [
                this.radioGeneral,
                this.radioPlantillas,
                this.radioSeleccionado
            ]
        });

        this.items = [
            {
                bodyStyle: 'padding-left:5px;',
                frame    : true,
                items    :

                {
                    xtype      : 'fieldset',
                    title      : 'Formatos',
                    autoHeight : true,
                    defaultType: 'radio',  // each item will be a radio button
                    items      : [
                        {
                            xtype     : 'radio',
                            hideLabel : true,
                            id        : 'rad1',
                            align     : 'center',
                            boxLabel  : 'Hojas de c&aacute;lculo (EXEL)',
                            name      : 'tipoacceso',
                            inputValue: 'ultimo',
                            listeners : {
                                'check': function (obj, ischeck) {
                                    if (ischeck) {
                                        btnAcpReporte.disable();
                                        this.radioGeneral.enable();
                                        this.radioPlantillas.enable();
                                        this.radioSeleccionado.enable();
                                        self.formatExcel = 'excel';

                                    }
                                }.createDelegate(this)
                            }
                        },
                        {
                            xtype     : 'radio',
                            hideLabel : true,
                            align     : 'center',
                            boxLabel  : 'Formato de documento port&aacute;til (PDF)',
                            id        : 'rad2',
                            name      : 'tipoacceso',
                            inputValue: 'nuevo',
                            listeners : {
                                'check': function (obj, ischeck) {
                                    if (ischeck) {
                                        btnAcpReporte.disable();
                                        self.formatExcel = 'pdf';
                                        this.radioGeneral.enable();
                                        this.radioPlantillas.enable();
                                        this.radioSeleccionado.enable();
                                    }
                                }.createDelegate(this)
                            }
                        },
                        {
                            xtype     : 'radio',
                            hideLabel : true,
                            id        : 'rad',
                            align     : 'center',
                            boxLabel  : 'Formato word (DOC)',
                            name      : 'tipoacceso',
                            inputValue: 'ultimo',
                            listeners : {
                                'check': function (obj, ischeck) {
                                    if (ischeck) {
                                        btnAcpReporte.disable();
                                        this.radioGeneral.enable();
                                        this.radioPlantillas.enable();
                                        this.radioSeleccionado.enable();
                                        self.formatExcel = 'word';

                                    }
                                }.createDelegate(this)
                            }
                        },
                        this.fsRadiosPdf
                    ]
                }
            }
        ];
        this.on('beforedestroy', function () {

        });
        Ext.components.CmpReccomplejas.winReporte.superclass.initComponent.call(this);
    },
    aceptarReporte:function(){
            this.parent.exportarReporte(this.tiporeporte,this.tipovisualizacion);
            self.close();

    }
});

Ext.components.CmpReccomplejas.FiltroReporteTexto = Ext.extend(Ext.form.TextField, {
    maxLength: 255,
    initComponent: function () {
        var self = this;
        self.emptyText = self.idioma.lbCriterioBuscarText;
        Ext.components.CmpReccomplejas.FiltroReporteTexto.superclass.initComponent.call(this);
    },
    listeners: {
        specialkey: function (field, e) {
            if (e.getKey() == e.ENTER) {
                this.panelreporte.Buscar();
            }
        }
    }
});
Ext.reg('CmpReccomplejas_FiltroReporteTexto', Ext.components.CmpReccomplejas.FiltroReporteTexto);
Ext.components.CmpReccomplejas.FiltroReporteNumero = Ext.extend(Ext.form.NumberField, {
    allowNegative: false,
    initComponent: function () {
        var self = this;
        self.emptyText = self.idioma.lbCriterioBuscarText;
        Ext.components.CmpReccomplejas.FiltroReporteNumero.superclass.initComponent.call(this);
    },
    listeners: {
        specialkey: function (field, e) {
            if (e.getKey() == e.ENTER) {
                this.panelreporte.Buscar();
            }
        }
    }
});
Ext.reg('CmpReccomplejas_FiltroReporteNumero', Ext.components.CmpReccomplejas.FiltroReporteNumero);
Ext.components.CmpReccomplejas.FiltroReporteFecha = Ext.extend(Ext.form.DateField, {
    width: 177,
    format: 'd/m/Y',
    listeners: {
        specialkey: function (field, e) {
            if (e.getKey() == e.ENTER) {
                this.panelreporte.Buscar();
            }
        }
    },
    initComponent: function () {
        var self = this;
        Ext.components.CmpReccomplejas.FiltroReporteFecha.superclass.initComponent.call(this);
    }
});
Ext.reg('CmpReccomplejas_FiltroReporteFecha', Ext.components.CmpReccomplejas.FiltroReporteFecha);
Ext.components.CmpReccomplejas.FiltroReporteHora = Ext.extend(Ext.form.TimeField, {
    width: 150,
    minValue: '0:00am',
    maxValue: '11:59pm',
    increment: 30,
    listeners: {
        specialkey: function (field, e) {
            if (e.getKey() == e.ENTER) {
                this.panelreporte.Buscar();
            }
        }
    },
    initComponent: function () {
        var self = this;
        self.emptyText = self.idioma.lbCriterioBuscarDate;
        Ext.components.CmpReccomplejas.FiltroReporteHora.superclass.initComponent.call(this);
    }
});
Ext.reg('CmpReccomplejas_FiltroReporteHora', Ext.components.CmpReccomplejas.FiltroReporteHora);
Ext.components.CmpReccomplejas.WinTituloReporte = Ext.extend(Ext.Window, {
    width: 350,
    height: 130,
    modal: true,
    title: 'Exportar reporte',
    initComponent: function () {
        var self = this;
        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: self.idioma.lbBtnAceptar,
            tooltip: self.idioma.ttpBtnAceptar,
            handler: cargarReporte,
            id: 'btnAceptar' + self.id,
            nextTab: 'tfTituloreporte' + self.id,
            prevTab: 'btnCancelar' + self.id
        });
        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: self.idioma.lbBtnCancelar,
            tooltip: self.idioma.ttpBtnCancelar,
            handler: function () {
                self.close();
            },
            id: 'btnCancelar' + self.id
        });
        var titulo = new Ext.form.TextField({
            fieldLabel: 'Denominación del reporte',
            allowBlank: false,
            maxLength: 255,
            id: 'tfTituloreporte' + self.id,
            anchor: '100%',
            prevTab: 'btnAceptar' + self.id,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        cargarReporte();
                    }
                }
            }
        });
        titulo.focus(false, 150);
        this.items = [
            {
                xtype: 'form',
                region: 'center',
                labelAlign: 'top',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: titulo
            }
        ];
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    btnAceptar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    btnCancelar.handler();
                }
            }
        ];

        this.buttons = [btnCancelar, btnAceptar];
        function cargarReporte() {
            if (titulo.isValid()) {
                self.parent.exportarReporte(titulo.getValue());
                self.close();
            }
        }

        Ext.components.CmpReccomplejas.WinTituloReporte.superclass.initComponent.call(this);
    }
});
Ext.reg('CmpReccomplejas_WinTituloReporte', Ext.components.CmpReccomplejas.WinTituloReporte);
var params;
var cantidadoper;
Ext.components.CmpReccomplejas.PanelReporte = Ext.extend(Ext.Panel, {
    region: 'center',
    layout: 'border',
    iconCls: 'table',
    singleSelect: this.singleSelect || true,
    hideBtnExportar: this.hideBtnExportar || false,
    limit: this.limit || 18,
    parent: this,
    initComponent: function () {
        /***************Variables para pintar****************/
        var bandera = true;
        var camporender;
        /****************************************************/
        this.idioma = Ext.idioma.es.cmpreccomplejas.reccomplejas.etiquetas;
        var self = this;
        this.autoLoadList = self.hasOwnProperty('autoLoadList') ? self.autoLoadList : true;
        this.smReporte = null;
        if (this.idPanel)
            this.id = this.idPanel
        this.mskAux = new Ext.LoadMask(Ext.getBody(), {
            msg: self.idioma.lbMsgWait
        });
        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            text: self.idioma.lbBtnBuscar,
            tooltip: self.idioma.ttpBtnBuscar,
            handler: function () {
                self.Buscar()
            }
        });
        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            text: self.idioma.lbBtnLimpiar,
            tooltip: self.idioma.ttpBtnFiltros,
            handler: limpiarTodo
        });

        var btnGenerarRTF = new Ext.Button({
            id: 'genRTF' + self.id,
            text: self.idioma.lbBtnExportar,
            iconCls: 'exportar',
            tooltip: self.idioma.ttpBtnExportarReporte,
            handler: function () {
                var winReporteEvento = new Ext.components.CmpReccomplejas.winReporte({
                    idioma: self.idioma,
                    parent: self
                });
                winReporteEvento.show();

            }
        });

        var btnGraficar = new Ext.Button({
            id: 'graficar',
            text: 'Graficar',
            iconCls: 'graficar',
            hidden: true,
            tooltip: 'Graficar lo mostrado en el listado',
            handler: function () {
                var arrRecords = self.gpReporte.getSelectionModel().getSelections();
                if(arrRecords.length>=1){
                    self.graficarReporteEstadistico(true,cantidadoper,params);
                }else{
                    mostrarMensaje(3, 'Debe seleccionar al menos un valor para graficar');
                }
            }
        });
        self.columnas = new Array();
        self.indices = new Array();
        this.sqlGenerado = '';

        var selfKeys = [
            {
                key: 'b',
                alt: true,
                fn: function () {
                    self.Buscar();
                }
            },
            {
                key: 'l',
                alt: true,
                fn: limpiarTodo
            },
            {
                key: 'e',
                alt: true,
                fn: btnGenerarRTF.handler
            },
            {
                key: '2',
                alt: true,
                fn: function () {
                    self.parent.setActiveTab(1);
                }
            }
        ];
        this.keys = selfKeys;
        this.setHotKeys = function (arrObjsKeys) {
            var j = selfKeys.length;
            for (var i = 0; i < arrObjsKeys.length; i++) {
                selfKeys[j] = arrObjsKeys[i];
                j++;
            }
            self.keys = [selfKeys];
        }
        this.pChart = new Ext.Panel({
            title: '',
            layoutConfig: {
                animate: true
            },
           // region: 'north',
            region: 'east',
            width: '50%',
            split: true,
            layout: 'fit',
            html: '<head>' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
                '<script type="text/javascript" src="/reccomplejas/views/comun/highchart/jquery-1.8.2/jquery-1.8.2.min.js"></script>' +
                '<script src="/reccomplejas/views/comun/highchart/js/highcharts.js"></script>' +
                '<script src="/reccomplejas/views/comun/highchart/js/modules/exporting.js"></script>' +
                '</head>' +
                '<body>' +
                '<br>' +
                '<br>' +
                '<br>' +
                '<br>' +
                '<div id="pie""></div>' +
                '</body>'
        });
       /*this.pChartc = new Ext.Panel({
            title: '',
            layoutConfig: {
                animate: true
            },
            region: 'center',
            width: '50%',
            split: true,
            layout: 'fit',
            html: '<head>' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
                '<title>Tráfico mensual</title>' +
                '<script type="text/javascript" src="/reccomplejas/views/comun/highchart/jquery-1.8.2/jquery-1.8.2.min.js"></script>' +
                '<script src="/reccomplejas/views/comun/highchart/js/highcharts.js"></script>' +
                '<script src="/reccomplejas/views/comun/highchart/js/modules/exporting.js"></script>' +
                '</head>' +
                '<body>' +
                '<div id="dona" style="width: 30%; height: 350px; margin: 0 auto;float:left;"></div>' +
                '</body>'
        });
        this.pContenedoreast = new Ext.Panel({
            title: '',
            layoutConfig: {
                animate: true
            },
            region: 'east',
            width: '50%',
            split: true,
            layout: 'border',
            items: [this.pChart,this.pChartc]
        });*/

       /* this.panelGrafnorth = new Ext.components.HighchartPanel({
            title: 'Resumen de personas',
            border: false,
            region: 'north',
            width: '50%',
            height:260,
            split: true,
            layout: 'fit',
            chartConfig: {
                chart: {
                    type:'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text:  ''
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad en porciento'
                    }
                },
                series: []
            }
        });*/

        this.panelGrafcenter = new Ext.components.HighchartPanel({
            title: 'Resumen de personas por busqueda',
            border: false,
            region: 'center',
            width: '50%',
            split: true,
            layout: 'fit',
            chartConfig: {
                chart: {
                    type:'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text:  ''
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad de personas'
                    }
                },
                series: []
            }
        });

       /* this.pContenedorcenter = new Ext.Panel({
            title: '',
            layoutConfig: {
                animate: true
            },
            region: 'center',
            width: '50%',
            split: true,
            layout: 'border',
            items: [this.panelGrafnorth,this.panelGrafcenter]
        });*/
        this.pContenedor = new Ext.Panel({
            title: ' ',
            collapsible: true,
            //collapsed:true,
            layoutConfig: {
                animate: true
            },
            hidden: true,
            region: 'east',
            split: true,
            width: '100%',
            layout: 'border',
           // items: [this.pContenedoreast,this.pContenedorcenter]
            items: [this.pChart,this.panelGrafcenter]
        });

        this.pFiltros = new Ext.Panel({
            layout: 'column',
            margins: '5 5 5 5',
            frame: true,
            cls: 'x-toolbar',
            defaults: {
                layout: 'form',
                border: false,
                labelAlign: 'top',
                buttonAlign: 'right'
            },
            height: 70,
            bodyBorder: false,
            border: false,
            autoScroll: true,
            autoShow: true,
            hideBorders: true,
            region: 'north'
        });

        this.stReporte = new Ext.data.GroupingStore({
            url: '/reccomplejas/index.php/reccomplejas/obtenerReporte',			
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
                {
                    name: 'aux'
                }
            ]),
            listeners: {
                load: function (store, records, options) {
                    if (records.length == 0) {
                        mostrarMensaje('3', self.idioma.MsgEmptySearch);
                    }
                }
            }
        });

        if (this.singleSelect) {
            this.smReporte = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });
        } else {
            this.smReporte = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            });
        }

        this.cmReporte = [this.smReporte,
            {
                dataIndex: 'aux',
                sortable: true,
                header: self.idioma.lbLoadColums,
                width: 140
            }
        ];

        this.paginadoGpReporte = new Ext.PagingToolbar({
            pageSize: self.limit,
            autoWidth: true,
            store: self.stReporte,
            displayInfo: true,
            displayMsg: 'Mostrando {0} - {1} de {2}',
            emptyMsg: self.idioma.lbEmptyMsg
        });

        var gpReporteConfig = {
            title: self.tituloGrid,
            store: self.stReporte,
            columns: self.cmReporte,
            id: self.idGrid ? self.idGrid : 'gpReporte' + self.id,
            margins: '0 5 5 5',
            region: 'center',
            width: '100%',
            minWidth: 370,
            loadMask: {
                msg: self.idioma.lbGridLoadMask
            },
            viewConfig: {
                enableRowBody: true
            },
            sm: this.smReporte,
            bbar: self.paginadoGpReporte,
            view: new Ext.grid.GroupingView({
                enableRowBody: true,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Elementos" : "Elemento"]})'
            })
        };
        Ext.apply(gpReporteConfig, this.viewGridConfig || {});
        this.gpReporte = new Ext.grid.GridPanel(gpReporteConfig);

        function limpiarTodo() {
            var items = self.pFiltros.items;
            var cant = items.length - 2; //Menos los dos botones
            for (var i = 0; i < cant; i++) {
                var tfFiltro = self.pFiltros.items.items[i].items.items[0];
                tfFiltro.reset();
            }
            self.Buscar();
        }

        function getParametrosBusqueda() {
            var arrCampos = new Array();
            var arrCondiciones = new Array();
            var arrCamposOrdenar = new Array();
            var arrOperacion = {};

            if (self.parent.pConfiguracion) {
                arrCampos = self.parent.pConfiguracion.obtenerCamposAMostrar();
                arrCondiciones = self.parent.pConfiguracion.obtenerCondicionesAEvaluar();
                arrCamposOrdenar = self.parent.pConfiguracion.getFieldsOrderBy();
                arrOperacion = self.parent.pConfiguracion.arrOperacion;

                if (self.parent.pConfiguracion.validarCondiciones(false) == false) {
                    self.parent.setActiveTab(1);
                    return;
                }
            }

            // Obtiene las condiciones de los filtros basicos
            var cantCondiciones = arrCondiciones.length;

            for (var i = 0; i < self.pFiltros.items.length - 2; i++) {
                var tfFiltro = self.pFiltros.items.items[i].items.items[0];

                if (!tfFiltro.isValid()) {
                    return;
                }
                if (tfFiltro.getValue() != '') {
                    if (cantCondiciones > 0) {
                        arrCondiciones[cantCondiciones - 1].logico = 'and';//Se le adiciona el operador logico AND a la ultima condicion
                    }
                    var value = '';

                    if (tfFiltro.tipo == 'TEXTO' || tfFiltro.tipo == 'NUMERO' || tfFiltro.tipo == 'NOMENCLADOR' || tfFiltro.tipo == 'NOMENCLADORCOMPLEJO' || tfFiltro.tipo == 'MULTIPLESVALORES') {
                        value = tfFiltro.getValue();
                    }
                    else if (tfFiltro.tipo == 'FECHA' || tfFiltro.tipo == 'HORA') {
                        value = tfFiltro.getRawValue();
                    }
                    else {
                        value = tfFiltro.valor;
                    }

                    var filtro = {
                        idcampo: tfFiltro.idcampo,
                        esquema: tfFiltro.esquema,
                        tabla: tfFiltro.tabla,
                        campo: tfFiltro.campo,
                        condicion: tfFiltro.condicion,
                        valor: value,
                        logico: 'AND',
                        tipo: tfFiltro.tipo
                    };
                    arrCondiciones[cantCondiciones] = filtro;
                    cantCondiciones++;
                }
            }
            /**
             * Adicionar condiciones por defecto al recuperador complejo
             * Ejemplo:
             * {
             *     idcampo: 121,        NOT NULL
             *     condicion: '%x%',    NOT NULL
             *     valor: 'angel',      NOT NULL
             *     tipo: 'TEXTO'        NULL
             * }
             */

            self.filters = self.filters || [];
            if (self.filters.length > 0) {

                if (cantCondiciones > 0) {
                    arrCondiciones[cantCondiciones - 1].logico = 'AND';
                }

                Ext.each(self.filters, function (filter) {
                    filter.logico = 'AND';
                    arrCondiciones[cantCondiciones++] = filter;
                });
            }

            if (cantCondiciones > 0) {
                arrCondiciones[cantCondiciones - 1].logico = '';
            }

            return {
                arrCampos: arrCampos,
                arrCondiciones: arrCondiciones,
                arrCamposOrdenar: arrCamposOrdenar,
                arrOperacion: arrOperacion
            };
        }

        this.Buscar = function (parametro) {

            params = parametro;
            /*if(bandera==false){
                bandera=true;
                self.parent.pConfiguracion.generarReporte();

            }*/
            /*  else
            {*/
                bandera = false;

                var p = getParametrosBusqueda();

                if (!p.arrCampos) {
                    return;
                }
                var arrCampos = p.arrCampos;
                var arrCondiciones = p.arrCondiciones;
                var arrCamposOrdenar = p.arrCamposOrdenar;
                var arrOperacion = p.arrOperacion;

                if (arrOperacion.length!=0) {
                    camporender = arrOperacion[0].campo;
                    if(arrOperacion.length==2 ){
                        arrOperacion[1].nombreOperacion = 'Cant';
                    }
                }

                self.columnas = new Array();
                self.indices = new Array();
                self.expander = new Array();
                var isOperacion = false;
                if (arrOperacion[0]!=undefined) {
                    if(arrOperacion.length ==2 && parametro.length>0){
                        isOperacion = true;
                        self.columnas = [
                            {
                                dataIndex: arrOperacion[0].campo,
                                sortable: true,
                                tooltip: arrOperacion[0].tooltip,
                                header: arrOperacion[0].campo,
                                width: 250,
                                renderer:self.showEstado
                            }
                        ];
                        self.indices = [
                            {
                                name: arrOperacion[0].campo
                            },
                            {
                                name: arrOperacion[0].nombreOperacion
                            },
                            {
                                name: arrOperacion[1].campo
                            },
                            {
                                name: arrOperacion[1].nombreOperacion
                            },
                            {
                                name:'total'
                            }
                        ];
                        var contindice = 5;

                        for(var i=0;i<parametro.length;i++){
                            self.columnas[i+1] = {
                                dataIndex:  parametro[i].campo,
                                header: parametro[i].campo,
                                width: 250,
                                renderer:self.showEstado
                            };
                            self.indices[contindice] = {
                                name: parametro[i].campo
                            };
                            contindice++;
                        }

                    }
                    else
                    { isOperacion = true;
                        self.columnas = [
                            {
                                dataIndex: arrOperacion[0].campo,
                                sortable: true,
                                tooltip: arrOperacion[0].tooltip,
                                header: arrOperacion[0].campo,
                                width: 250
                            },
                            {
                                dataIndex: arrOperacion[0].nombreOperacion,
                                sortable: true,
                                header: arrOperacion[0].nombreOperacion,
                                width: 100
                            }
                        ];
                        self.indices = [
                            {
                                name: arrOperacion[0].campo
                            },
                            {
                                name: arrOperacion[0].nombreOperacion
                            }
                        ];
                    }
                }
                else {
                    var cant = 1;
                    for (var i = 0; i < arrCampos.length; i++) {
                        if (arrCampos[i].expander == 1) {
                            self.expander.push({
                                header: arrCampos[i].text,
                                text: '{' + arrCampos[i].alias + '}'
                            });
                        } else {
                            var obj = {};
                            obj.dataIndex = arrCampos[i].alias;
                            obj.hidden = parseInt(arrCampos[i].agruparcampo);
                            obj.tooltip = arrCampos[i].qtip;
                            obj.header = arrCampos[i].text;
                            obj.width = parseInt(arrCampos[i].anchocolumna)
                            if (arrCampos[i].renderer) {
                                //Hace el llamado a la funcion renderer definida cuando se instancia el componente
                                obj.renderer = eval('self.parent.renderers.' + arrCampos[i].renderer);
                            }
                            self.columnas.push(obj);
                        }
                        self.indices[i] = {
                            name: arrCampos[i].alias
                        };
                        cant++;
                    }
                    if (self.hiddenIndex) {
                        var cantHiddenIdx = self.hiddenIndex.length;
                        for (var i = 0; i < cantHiddenIdx; i++) {
                            self.indices.push(self.hiddenIndex[i]);

                        }
                    }
                }

                var expanderPlugin = null;
                if (self.expander && self.expander.length > 0) {
                    expanderPlugin = self.getExpander(self.expander);
                    if (expanderPlugin) {
                        self.columnas.unshift(expanderPlugin);
                    }
                }
                var columnModel = null;
                if (Ext.isEmpty(self.columnas)) {
                    columnModel = self.gpReporte.getColumnModel();
                } else {
                    //self.columnas.unshift(self.smReporte);
                    columnModel = new Ext.grid.ColumnModel(self.columnas);

                }
                var plantilla = new Ext.data.Record.create(self.indices);
                var myReader = new Ext.data.JsonReader({
                    totalProperty: 'cantidad',
                    root: 'datos'
                }, plantilla);

                var baseParams = {
                    idconfiguracion: self.idconfiguracion,
                    campos: Ext.encode(arrCampos),
                    condiciones: Ext.encode(arrCondiciones),
                    orderby: Ext.encode(arrCamposOrdenar),
                    operacion: Ext.encode(arrOperacion)
                };

                var sortField = self.groupField ? (isOperacion ? 'Cantidad' : self.groupField) : null;


                if (self.columnas.length > 0) {

                    var stReporteAux = new Ext.data.GroupingStore({
                        url: '/reccomplejas/index.php/reccomplejas/obtenerReporte',
						timeout:3600000,
                        reader: myReader,
                        baseParams: baseParams,
                        sortInfo: sortField ? {field: sortField, direction: 'DESC'} : null,
                        groupField: (self.groupField && !isOperacion) ? self.groupField : null
                    });


                    stReporteAux.on('load', function (store, records, options) {
                        self.sqlGenerado = store.reader.jsonData.sql;

                        if (records.length == 0) {
                            mostrarMensaje('3', self.idioma.MsgEmptySearch);
                        }
                        if (store.getCount() == 0) {
                            Ext.MessageBox.show({
                                title: self.idioma.titleInfo,
                                msg: self.idioma.msgEmptySearch,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO,
                                fn: function () {
                                    self.getTopToolbar().items.items[0].focus();
                                }
                            });
                        }
                    });
                    self.gpReporte.reconfigure(stReporteAux, columnModel);
                    self.gpReporte.getBottomToolbar().unbind(self.gpReporte.getStore());
                    self.gpReporte.getBottomToolbar().bind(stReporteAux);
                    self.gpReporte.doLayout();


                }
                self.gpReporte.getStore().baseParams = baseParams;
                self.gpReporte.getStore().load({
                    params: {
                        limit: self.limit,
                        start: 0
                    }
                });

                self.gpReporte.getStore().on('load', function (st, records, options) {
                    self.gpReporte.fireEvent('busquedaMostrada', st, records);
                    cantidadoper = arrOperacion.length;
                       // self.graficarReporteEstadistico(arrOperacion[0].idcampo ? true : false,arrOperacion,parametro);


                });

        /*    }*/

        };

        this.showEstado = function (val, m, record) {
            if (val) {
                var cant = record.length;

                if (val== 'TOTAL') {
                    return '<span style="color:#8b3626;' +  val + '"><b>' + val +'</b></span>';
                }else if (val.length==2 || val.length==3)
                {
                    return '<span style="color:#8b3626;' +  val + '"><b>' + val +'</b></span>';
                }else{
                    return val ;
                }


            } else {
                return '';
            }
        }

        this.exportarReporte = function (reporte,visualizacion) {

            var p = getParametrosBusqueda();
            if (!p.arrCampos) {
                return;
            }
            var arrCampos = p.arrCampos;
            var arrCondiciones = p.arrCondiciones;
            var arrCamposOrdenar = p.arrCamposOrdenar;
            var arrOperacion = p.arrOperacion;

            if (self.parent.pConfiguracion.validarCondiciones(false) == false) {
                self.parent.setActiveTab(1);
                return;
            }

            var cantCondiciones = arrCondiciones.length;
            for (var i = 0; i < self.pFiltros.items.length - 2; i++) {
                var tfFiltro = self.pFiltros.items.items[i].items.items[0];
                if (tfFiltro.getValue() != '') {
                    if (cantCondiciones > 0) {
                        arrCondiciones[cantCondiciones - 1][2] = 'and';
                    }
                    var filtro = new Array();
                    var value = '';
                    if (tfFiltro.tipo == 'TEXTO' || tfFiltro.tipo == 'NOMENCLADOR') {
                        value = tfFiltro.getValue();
                    }
                    else if (tfFiltro.tipo == 'FECHA' || tfFiltro.tipo == 'HORA') {
                        value = tfFiltro.getRawValue();
                    }
                    else {
                        value = tfFiltro.valor;
                    }
                    filtro[0] = tfFiltro.condicion;
                    filtro[1] = value;
                    filtro[2] = 'AND';
                    filtro[3] = tfFiltro.idcondicion;
                    filtro[4] = tfFiltro.idmetadato;
                    filtro[5] = tfFiltro.tipo;
                    arrCondiciones[cantCondiciones] = filtro;
                    cantCondiciones++;
                }
            }
            if (cantCondiciones > 0) {
                arrCondiciones[cantCondiciones - 1][2] = '';
            }

            self.columnas = new Array();
            self.indices = new Array();
            if (arrOperacion.length > 0) {
                self.columnas = [
                    {
                        dataIndex: arrOperacion.campo,
                        sortable: true,
                        header: arrOperacion.campo,
                        width: 250
                    },
                    {
                        dataIndex: arrOperacion.campo,
                        sortable: true,
                        header: arrOperacion.text,
                        width: 100
                    }
                ];
                self.indices = [
                    {
                        name: arrOperacion.campo
                    },
                    {
                        name: arrOperacion.text
                    }
                ];
            }
            else {
                for (var i = 0; i < arrCampos.length; i++) {
                    self.columnas[i] = {
                        dataIndex: '_' + arrCampos[i].idcampo,
                        header: arrCampos[i].text,
                        width: parseInt(arrCampos[i].anchocolumna)
                    };
                    self.indices[i] = {
                        name: '_' + arrCampos[i].idcampo
                    };
                }
            }
            var strColumn = '';
            var colmod = self.gpReporte.getColumnModel();
            for (var i = 0; i < colmod.getColumnCount(); i++) {
                strColumn = strColumn + '-' + colmod.getColumnHeader(i);
            }
           var selection = self.gpReporte.getSelectionModel().getSelections();

           var data = new Array();

             if(selection.length>=1){
                 for(var i = 0;i<selection.length;i++){
                     data[i] = selection[i].data;
                 }
             }

            var params = Ext.urlEncode({
                idconfiguracion: self.idconfiguracion,
                title: 'Listado de personas',
                reporte: reporte,
                visualizacion: visualizacion,
                strColumn: strColumn,
                campos: Ext.encode(arrCampos),
                condiciones: Ext.encode(arrCondiciones),
                orderby: Ext.encode(arrCamposOrdenar),
                operacion: Ext.encode(arrOperacion),
                limit: self.paginadoGpReporte.pageSize,
                start: self.paginadoGpReporte.cursor,
                seleccionados:Ext.encode(data)
            });

            if(reporte == 'Pdf'){
                var idIframeResolucion = Ext.id();
                new Ext.Window({
                    title: 'Exportar listado de personas',
                    width: 800,
                    height: 500,
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrainHeader: true,
                    border: false,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframeResolucion,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                                '/reccomplejas/index.php/reccomplejas/getRTF?' + params
                        }
                    }
                }).show();

                document.getElementById(idIframeResolucion).onload = function () {

                }
            }
            else if(reporte == 'Excel')
            {
                var winload = new Ext.PVD.comun.window.winLoad({
                    title  : 'Por favor espere...',
                    mensaje: 'Generando reporte'
                });

                winload.showMask();
                var iframe = document.createElement("iframe");
                iframe.src = document.location.protocol + '//' + document.location.host + '/reccomplejas/index.php/reccomplejas/getRTF?' + params
                iframe.style.display = 'none';
                that = this;
                iframe.onload = function () {
                    winload.hideMask();
                    mostrarMensaje(1, 'Las personas se han exportado satisfactoriamente.');

                }
                document.body.appendChild(iframe);


            }else{
                PVD.mostrarMascara('idplanillasend', 'Enviando....', 'Generando reporte...');
                Ext.Ajax.request({
                    url: '/reccomplejas/index.php/reccomplejas/getWord',
                    method: 'POST',
                    params: {
                        idconfiguracion: self.idconfiguracion,
                        title: 'Listado de personas',
                        reporte: reporte,
                        visualizacion: visualizacion,
                        strColumn: strColumn,
                        campos: Ext.encode(arrCampos),
                        condiciones: Ext.encode(arrCondiciones),
                        orderby: Ext.encode(arrCamposOrdenar),
                        operacion: Ext.encode(arrOperacion),
                        limit: self.paginadoGpReporte.pageSize,
                        start: self.paginadoGpReporte.cursor,
                        seleccionados:Ext.encode(data)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idplanillasend');
                        var respuesta = Ext.decode(response.responseText);

                        window.open(respuesta.url);
                    }
                });
            }


        }

        this.getSQLReporte = function () {
            var p = getParametrosBusqueda();
            PVD.mostrarMascara('mskgenerarSLQ', self.idioma.lbporfavorespere, 'Generando sql.');
            Ext.Ajax.request({
                url: '/reccomplejas/index.php/reccomplejas/getSqlReporte',
                method: 'POST',
                params: {
                    idconfiguracion: self.idconfiguracion,
                    campos: Ext.encode(p.arrCampos),
                    condiciones: Ext.encode(p.arrCondiciones),
                    orderby: Ext.encode(p.arrCamposOrdenar),
                    operacion: Ext.encode(p.arrOperacion)
                },
                callback: function (options, success, response) {
                    var sql = Ext.decode(response.responseText);
                    PVD.ocultarMascara('mskgenerarSLQ');
                    self.fireEvent('sqlRipeado', sql);
                }
            });
        };

        //Función que devuelve la carga incial del panel de reporte
        this.cargaInicial = function () {
            Ext.Ajax.request({
                url: '/reccomplejas/index.php/reccomplejas/cargaInicial',
                method: 'POST',
                params: {
                    idconfiguracion: self.idconfiguracion
                },
                failure: function () {
                    mostrarMensaje(3, self.idioma.lbFailureMsg);
                },
                callback: function (options, success, response) {
                    if (success) {
                        var result = Ext.util.JSON.decode(response.responseText);
                        self.hiddenIndex = result.hiddenIndex;
                        self.indices = result.indices;
                        if (result.groupField) {
                            self.groupField = result.groupField ? result.groupField : null;
                        }
                        var posTabIndex = 1;
                        //Agrego los campos de filtro al panel
                        for (var i = 0; i < result.filtros.length; i++) {
                            var objFiltro = null;
                            var datosFiltro = result.filtros[i];
                            datosFiltro.idconfiguracion = self.idconfiguracion;
                            datosFiltro.panelreporte = self;
                            datosFiltro.idioma = self.idioma;
                            datosFiltro.anchor = '95%';
                            datosFiltro.tabIndex = posTabIndex++;
                            if (result.filtros[i].tipo == 'FECHA') {
                                objFiltro = new Ext.components.CmpReccomplejas.FiltroReporteFecha(datosFiltro);
                            }
                            else if (result.filtros[i].tipo == 'NOMENCLADOR' || result.filtros[i].tipo == 'NOMENCLADORCOMPLEJO' || result.filtros[i].tipo == 'MULTIPLESVALORES') {
                                objFiltro = new Ext.components.CmpReccomplejas.ComboBoxNomenclador(datosFiltro);
                                objFiltro.on('specialkey', function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        if (this.store instanceof Ext.data.Store) {
                                            if (Ext.isEmpty(this.getValue())) {
                                                this.clearValue();
                                            } else {
                                                self.Buscar();
                                            }
                                        }
                                    }
                                });
                            }
                            else if (result.filtros[i].tipo == 'HORA') {
                                objFiltro = new Ext.components.CmpReccomplejas.FiltroReporteHora(datosFiltro);
                            }
                            else if (result.filtros[i].tipo == 'NUMERO') {
                                objFiltro = new Ext.components.CmpReccomplejas.FiltroReporteNumero(datosFiltro);
                            }
                            else {
                                objFiltro = new Ext.components.CmpReccomplejas.FiltroReporteTexto(datosFiltro);
                            }

                            self.pFiltros.add({
                                columnWidth: self.getWidthPerColumn(result.filtros.length, result.filtros[i].tipo),
                                layout: 'form',
                                items: [objFiltro]
                            });
                        }
                        //Agrega el botón Buscar
                        self.pFiltros.add({
                            columnWidth: '35px',
                            layout: 'form',
                            bodyStyle: 'padding:19px 0 0 0;',
                            items: [self.btnBuscar]
                        });
                        self.btnBuscar.tabIndex = posTabIndex++;
                        //Agrega el botón Limpiar
                        self.pFiltros.add({
                            columnWidth: '35px',
                            layout: 'form',
                            bodyStyle: 'padding:19px 0 0 0;',
                            items: [self.btnLimpiar]
                        });
                        self.btnLimpiar.tabIndex = posTabIndex++;
                        self.pFiltros.doLayout();
                        var expander = self.getExpander(result.expander);
                        if (expander) {
                            result.columnas.unshift(expander);
                        }
                        if (!self.singleSelect) {
                            result.columnas.unshift(self.smReporte);
                        }

                        //Se evalua la funcion render de cada columna en caso que la tenga
                        Ext.each(result.columnas, function (column) {
                            if (column.renderer) {
                                column.renderer = eval(column.renderer);
                            }
                        });

                        var columnModel = new Ext.grid.ColumnModel(result.columnas);

                        //Adiciona los indeces de los campos ocultos al store
                        var cantHiddenIdx = self.hiddenIndex.length;
                        for (var i = 0; i < cantHiddenIdx; i++) {
                            self.indices.push(self.hiddenIndex[i]);
                        }

                        var plantilla = new Ext.data.Record.create(self.indices);
                        var myReader = new Ext.data.JsonReader({
                            totalProperty: 'cantidad',
                            root: 'datos',
                            sql: 'sql'
                        }, plantilla);

                        var params = getParametrosBusqueda();

                        var stReporteAux = new Ext.data.GroupingStore({
                            url: '/reccomplejas/index.php/reccomplejas/obtenerReporteInicial',
                            reader: myReader,
                            baseParams: {
                                idconfiguracion: self.idconfiguracion,
                                condiciones: Ext.encode(params.arrCondiciones)
                            },
                            sortInfo: {field: self.groupField ? self.groupField : 'pkey0', direction: 'DESC'},
                            groupField: self.groupField
                        });
                        stReporteAux.on('load', function (store, records, options) {
                            self.sqlGenerado = store.reader.jsonData.sql;
                            self.fireEvent('load', store, records, options);
                            if (records.length == 0) {
                                mostrarMensaje('3', self.idioma.MsgEmptySearch);
                            }
                            self.getTopToolbar().items.items[0].focus();
                        });
                        stReporteAux.on('beforeload', function (store, options) {
                            self.fireEvent('beforeload', store, options);
                        });

                        self.gpReporte.reconfigure(stReporteAux, columnModel);
                        if (expander) {
                            self.gpReporte.plugins = expander;
                            self.gpReporte.initPlugins(expander);
                        }

                        //NECESARIO PARA SUSCRIBIRSE A LOS EVENTOS
                        self.fireEvent('reconfigure', self, self.gpReporte, stReporteAux);

                        if (self.autoLoadList) {
                            stReporteAux.load({
                                params: {
                                    'limit': self.limit,
                                    'start': 0
                                }
                            });
                        }
                        self.gpReporte.getBottomToolbar().unbind(self.gpReporte.getStore());
                        self.gpReporte.getBottomToolbar().bind(stReporteAux);
                        self.gpReporte.doLayout();

                        self.btnLimpiar.setNextElement(self.getTopToolbar().items.items[0].getId());
                        self.btnLimpiar.setPreviousElement(self.btnBuscar.getId());
                        self.getTopToolbar().items.items[0].setPreviousElement(self.btnLimpiar.getId());
                        var cantElementToolBar = self.getTopToolbar().items.length;
                        //Al ultimo elemento del toolbar le pongo como siguiente el primer elemento del panel de filtros
                        self.getTopToolbar().items.items[cantElementToolBar - 1].setNextElement(
                            self.pFiltros.items.items[0].items.items[0].getId()
                        );
                        if (cantElementToolBar >= 3) {
                            //Al ultimo elemento del toolbar le pongo como anterior el ante-penultimo elemento del panel de filtros
                            self.getTopToolbar().items.items[cantElementToolBar - 1].setPreviousElement(
                                self.getTopToolbar().items.items[cantElementToolBar - 3].getId()
                            );
                        }
                        //Al primer elemento del panel de filtros le pongo como anterior el ultimo elemento del ToolBar
                        self.pFiltros.items.items[0].items.items[0].setPreviousElement(
                            self.getTopToolbar().items.items[cantElementToolBar - 1].getId()
                        );
                        //Le coloco el foco al primer elemento del ToolBar
                        self.getTopToolbar().items.items[0].focus();
                    }
                }
            });
        }

        this.getWidthPerColumn = function (cantColumn, typeColumn) {
            var width = 1;
            if (cantColumn == 1 && typeColumn == 'TEXTO') {
                width = .25;
            }
            else if (typeColumn == 'HORA') {
                width = .09;
            }
            else if (typeColumn == 'FECHA') {
                width = .14;
            }
            else {
                width = .18;
            }
            return width;
        }

        this.items = [this.pFiltros, this.gpReporte,this.pContenedor];

        this.keyMapGroup = true;

        Ext.components.CmpReccomplejas.PanelReporte.superclass.initComponent.call(this);
        this.on('activate', function (panel) {
            if (panel.getTopToolbar().items.length > 0) {
                self.getTopToolbar().items.items[0].focus();
            }
            else {
                self.pFiltros.items.items[0].items.items[0].focus(false, 200);
            }
        });
        this.on('render', function (cmp) {
            this.cargaInicial();
            var cantItems = cmp.getTopToolbar().items.length;
			if (cantItems >= 3) {
                    cmp.getTopToolbar().insertButton(cantItems - 2, new Ext.Toolbar.Separator());
                    cmp.getTopToolbar().insertButton(cantItems - 1, btnGraficar);
                } else {
                    cmp.getTopToolbar().insertButton(0, btnGraficar);
                }
            
            if (self.hideBtnExportar == false) {
                if (cantItems >= 3) {
                    cmp.getTopToolbar().insertButton(cantItems - 2, new Ext.Toolbar.Separator());
                    cmp.getTopToolbar().insertButton(cantItems - 1, btnGenerarRTF);
                } else {
                    cmp.getTopToolbar().insertButton(0, btnGenerarRTF);
                }
            }

        }, this);

    this.graficarReporteEstadistico = function (show,cantidadoper,param) {
        if (show) {
            //self.gpReporte.getStore().getRange();
            var arrRecords = self.gpReporte.getSelectionModel().getSelections();
            var data = new Array();
            var name = self.gpReporte.getColumnModel().getColumnHeader(0);
            self.pChart.setTitle(self.idioma.textCantX + name);
            self.panelGrafcenter.setTitle(self.idioma.textCantX + name);
           // self.panelGrafnorth.setTitle(self.idioma.textCantX + name);

            if(cantidadoper==2){
                Ext.each(arrRecords, function (record) {
                    if(record.get('total')=='' || record.get('total')==null){
                        record.data.Cant = 0;
                        record.data.total = 0;
                    }

                    data.push({
                        label: record.get(name),
                        data: parseInt(record.get('total'))
                    });


                });
            }else{
                Ext.each(arrRecords, function (record) {
                    data.push({
                        label: record.get(name),
                        data: parseInt(record.get('Cantidad'))
                    });
                });
            }

            if(cantidadoper==2){
                /************************Para graficar de forma general*****************************/
                /*  var nombrecompleto = new Array();
                nombrecompleto[0] ='TOTAL GENERAL';

                var arrNodos = nombrecompleto;
                if (arrNodos.length > 0) {
                    var ticks = new Array();
                    var arrIds = new Array();
                    var xCategories = new Array();

                    for (var i = 0; i < arrNodos.length; i++) {
                        var aux = [i + 1, arrNodos[i]];
                        arrIds[i] = parseInt(arrNodos[i]);
                        ticks.push(aux);
                        xCategories.push(arrNodos[i]);
                    }

                    self.panelGrafnorth.chart.xAxis[0].setCategories(xCategories);

                    while(self.panelGrafnorth.chart.series.length > 0){
                        self.panelGrafnorth.chart.series[0].remove(true);
                    }

                    var d1 = [];
                    var d2 = [];

                    Ext.each(data, function (campo) {
                        if(campo.data!=0){
                            porciento =  Math.round((campo.data * 100)/data[data.length-1].data);
                        }else{
                            porciento = 0;
                        }
                        d1.push({data:[parseInt(porciento)],name:campo.label});
                        d2.push({data:[parseInt(campo.data)],name:parseInt(campo.data)+" Persona/s"});
                    });

                    Ext.each(d1, function (serie) {
                        self.panelGrafnorth.chart.addSeries(serie);
                    });
                }*/
                /**************************************************************************************/
                /*********************Para graficar por categorias*****************************/
                var nuevo  = [];
                Ext.each(arrRecords, function (record) {
                    var barra  = [];
                    Ext.each(param, function (p) {
                        if(record.get(p.campo)=="" || record.get(p.campo)==null){
                            var valor = 0;
                        }else{
                            var valor = record.get(p.campo)
                        }
                        barra.push(
                            [ p.campo+"",parseInt(valor)]
                        );
                        return;
                    });

                    nuevo.push({
                        name: record.get(name)+"",
                        data: barra
                    });
                });

                var nombreejex = new Array();
                Ext.each(param, function (campo) {
                    nombreejex.push(campo.campo);

                });
                var arrNodos = nombreejex;

                if (arrNodos.length > 0) {
                    var ticks = new Array();
                    var arrIds = new Array();
                    var xCategories = new Array();

//                //Se prepara la columna y que muestra los nombres de los indicadores
                    for (var i = 0; i < arrNodos.length; i++) {
                        var aux = [i + 1, arrNodos[i]];
                        arrIds[i] = parseInt(arrNodos[i]);
                        ticks.push(aux);
                        xCategories.push(arrNodos[i]);
                    }
                    self.panelGrafcenter.chart.xAxis[0].setCategories(xCategories);
                    while( self.panelGrafcenter.chart.series.length > 0){
                        self.panelGrafcenter.chart.series[0].remove(true);
                    }
                    Ext.each(nuevo, function (serie) {
                        self.panelGrafcenter.chart.addSeries(serie);
                    });
                }
                /*************************************************************************************/
                var d1 = [];
                var d2 = [];

                Ext.each(data, function (campo) {
                    if(campo.data!=0){
                        porciento =  Math.round((campo.data * 100)/data[data.length-1].data);
                    }else{
                        porciento = 0;
                    }
                    d1.push({data:[parseInt(porciento)],name:campo.label});
                });
                var a = [];
                var contador = 0;
                Ext.each(d1, function (campo) {
                    if(contador==0){
                        a.push({name:campo.name,y: campo.data[0],sliced: true,
                            selected: true});
                    }else{
                        a.push({name:campo.name,y: campo.data[0]});
                    }
                    contador++;
                });
                var seriepie = [{
                    name: 'Porciento',
                    colorByPoint: true,
                    data:a
                }];
               /* var b = [];
                Ext.each(d2, function (campo) {
                    b.push([campo.name,parseInt(campo.data)]);
                });
                var seriedona = [{
                    type: 'pie',
                    name:'Porciento',
                    innerSize: '50%',
                    data:b
                }];*/

                $('#pie').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '% CANTIDAD DE LA CATEGORIA POR TOTAL DE PERSONAS'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true,
                            dataLabels: {
                                enabled: true,
                                format: '<b>{series.name}</b>: {point.percentage:.1f}%',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series:seriepie

                });
               /* $('#dona').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false

                    },
                    title: {
                        text: 'Representación en gráfico dona'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true,
                            dataLabels: {
                                enabled: true,
                                format: '<b>{series.name}</b>: {point.percentage:.1f}%',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: seriedona


                });*/
               //this.panelGrafcenter.enable();
                //this.pChartc.enable();
                //this.pChart.enable();
               // this.panelGrafcenter.show();
                //this.panelGrafnorth.show();
                //this.pChartc.show();
                //this.pChart.show();
               /* self.pContenedor.setVisible(true);
                self.doLayout();*/
            }
            else{
                /************************Para graficar de forma general*****************************/
                //this.panelGrafcenter.disable();
                //this.pChartc.disable();
                //this.pChart.disable();
                //this.panelGrafcenter.hide();
                //this.pChartc.hide();
                //this.pChart.hide();
               /* self.pContenedor.setVisible(true);
                self.doLayout();*/
               /* var nombrecompleto = new Array();
                nombrecompleto[0] ='TOTAL GENERAL';

                var arrNodos = nombrecompleto;
                if (arrNodos.length > 0) {
                    var ticks = new Array();
                    var arrIds = new Array();
                    var xCategories = new Array();

                    for (var i = 0; i < arrNodos.length; i++) {
                        var aux = [i + 1, arrNodos[i]];
                        arrIds[i] = parseInt(arrNodos[i]);
                        ticks.push(aux);
                        xCategories.push(arrNodos[i]);
                    }

                    self.panelGrafnorth.chart.xAxis[0].setCategories(xCategories);


                    while(self.panelGrafnorth.chart.series.length > 0){
                        self.panelGrafnorth.chart.series[0].remove(true);
                    }

                    var d1 = [];
                    var d2 = [];

                    Ext.each(data, function (campo) {
                        if(campo.data!=0){
                            porciento =  Math.round((campo.data * 100)/data[data.length-1].data);
                        }else{
                            porciento = 0;
                        }
                        d1.push({data:[parseInt(porciento)],name:campo.label});
                        d2.push({data:[parseInt(campo.data)],name:parseInt(campo.data)+" Persona/s"});
                    });

                    Ext.each(d1, function (serie) {
                        self.panelGrafnorth.chart.addSeries(serie);
                    });
                }*/
                var nombrecompleto = new Array();
                nombrecompleto[0] ='TOTAL GENERAL';

                var arrNodos = nombrecompleto;
                if (arrNodos.length > 0) {
                    var ticks = new Array();
                    var arrIds = new Array();
                    var xCategories = new Array();

                    for (var i = 0; i < arrNodos.length; i++) {
                        var aux = [i + 1, arrNodos[i]];
                        arrIds[i] = parseInt(arrNodos[i]);
                        ticks.push(aux);
                        xCategories.push(arrNodos[i]);
                    }

                    self.panelGrafcenter.chart.xAxis[0].setCategories(xCategories);


                    while(self.panelGrafcenter.chart.series.length > 0){
                        self.panelGrafcenter.chart.series[0].remove(true);
                    }

                    var d1 = [];

                    Ext.each(data, function (campo) {

                        d1.push({data:[parseInt(campo.data)],name:campo.label});
                    });

                    Ext.each(d1, function (serie) {
                        self.panelGrafcenter.chart.addSeries(serie);
                    });
                }
                /********************************GRAFICAR EN PASTEL PARA UNO SOLO*******************************************************/
                var a = [];
                var contador = 0;
                Ext.each(d1, function (campo) {
                    if(contador==0){
                        a.push({name:campo.name,y: campo.data[0],sliced: true,
                            selected: true});
                    }else{
                        a.push({name:campo.name,y: campo.data[0]});
                    }
                    contador++;
                });
                var seriepie = [{
                    name: 'Porciento',
                    colorByPoint: true,
                    data:a
                }];
                $('#pie').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '% CANTIDAD DE LA CATEGORIA POR TOTAL DE PERSONAS'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true,
                            dataLabels: {
                                enabled: true,
                                format: '<b>{series.name}</b>: {point.percentage:.1f}%',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series:seriepie

                });
            }
        }
        self.pContenedor.setVisible(show);
        self.doLayout();
        }
    },
    getExpander: function (objExpander) {
        var expander = null;
        if (Ext.grid.RowExpander) {
            if (objExpander && objExpander instanceof Array && objExpander.length > 0) {
                var html_Text = '<div style="word-wrap:break-word;white-space:normal;">';
                for (var i = 0; i < objExpander.length; i++) {
                    html_Text += '<p><b>' + objExpander[i].header.replace('"', "'") + ':</b></br>';
                    html_Text += objExpander[i].text.replace('"', "'") + '</p>';
                }
                html_Text += '</div>';
                expander = new Ext.grid.RowExpander({
                    tpl: new Ext.Template(html_Text),
                    enableCaching: false
                });
            }
        }
        return expander;
    },
    getFilaSeleccionada: function () {
        if (this.items.items[1].getSelectionModel().hasSelection()) {
            return this.items.items[1].getSelectionModel().getSelected();
        } else {
            return false;
        }
    }
});
//Ext.reg('CmpReccomplejas_pReporte', Ext.components.CmpReccomplejas.PanelReporte);

/*
//Inicializando la vista.
UCID.portal.cargarEtiquetas('reccomplejas', function (perfil, idioma) {
     idioma = (idioma) ? idioma : perfil.etiquetas;
     var modelo = Pvd.Reccomplejas.PanelReporte.Modelo;
     modelo.init();

     var vista = Pvd.Reccomplejas.Reccomplejas.Vista;
     vista.init(idioma, modelo);

     Pvd.Reccomplejas.Reccomplejas.Controlador.init(idioma, vista, modelo);
     UCID.portal.cargarAcciones(window.frameElement.id);
});
*/