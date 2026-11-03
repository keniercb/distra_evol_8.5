Ext.QuickTips.init();
labels = Object();
UCID.portal.cargarEtiquetas('causanoevaluado', cargarInterfaz);
Ext.ns('Ext.components.Evaluaciones');
var idcausanoevaluado;
///////// GRID PANEL DE CAUSA NO EVALUADO////////
Ext.components.Evaluaciones.gpCausaNoEvaluado = Ext.extend(Ext.grid.GridPanel, {
        title: 'Listado de causas no evaluado',
        region: 'center',
        loadMask: true,
        stripeRows: true,
        autoExpandColumn: 'den',
        initComponent: function () {
            var self = this;
            var expander = new Ext.grid.RowExpander({
                tpl: new Ext.Template(
                    '<div><b>Descripcion: </b> {descripcion}</div>'
                )
            });
            this.cm = new Ext.grid.ColumnModel({
                columns: [expander,
                    {id: 'den', header: "Denominaci&oacute;n ", sortable: true, dataIndex: 'denominacion'},
                    {header: "Fecha de inicio ", sortable: true, width: 110, dataIndex: 'fechainicio'},
                    {header: "Fecha de fin", sortable: true, width: 110, dataIndex: 'fechafin'}
                ]
            });
            this.store = new Ext.data.JsonStore({
                url: 'getCausanoevaluado',
                root: 'data',
                totalProperty: 'total',
                fields: [
                    {name: 'idcausanoevaluado'},
                    {name: 'denominacion'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'descripcion'},
                ]
            });
            this.plugins = expander;

            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: {
                        fn: function (sm, index, record) {
                            idcausanoevaluado = record.data.idcausanoevaluado;
                            self.btnModificar.enable();
                            self.btnEliminar.enable();
                            self.btnAdicionar.focus();
                        }
                    }
                }
            });
            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            this.pbacceso = new Ext.PagingToolbar({
                pageSize: 15,
                store: this.store,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: labels.lbPagdinVacio
            });

            this.tfBuscar = new Ext.form.TextField({
                id: 'tfBuscar',
                fieldLabel: labels.lbDenominacion,
                name: 'denom',
                anchor:'95%',
                maxLength: 255,
                regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
                emptyText: 'Criterio a buscar...',
                listeners: {
                    specialkey: function(field, e){
                        if (e.getKey() == e.ENTER) {
                            self.btnBuscar.handler();
                        }
                    }
                }

            });
            this.btnBuscar = new Ext.Button({
                iconCls: 'buscar',
                id: "btn_Buscar",
                tooltip: 'Buscar causa no evaluado(<b>Alt+B</b>)',
                text: 'Buscar',
                handler:function(){
                    self.store.baseParams.tfBuscar = self.tfBuscar.getValue();
                    self.store.load({
                        params:{
                            start:0,
                            limit:15
                        }
                    });
                }
            });

            this.btnLimpiar= new Ext.Button({
                tooltip: 'Limpiar filtros (<b>Alt+L</b>)',
                id: 'btnLimpiar',
                iconCls: 'limpiar',
                text: 'Limpiar',
                handler: function(){
                    self.tfBuscar.reset();
                    self.store.baseParams.tfBuscar = self.tfBuscar.getValue();
                    self.store.load({
                        params: {
                            limit: 15,
                            start: 0
                        }
                    });
                },
                nextTab:'btnAdicionar',
                prevTab:'btnBuscar'
            });

            this.btnAdicionar = new Ext.Button({
                text: labels.btnAdicionar,
                tooltip: labels.lbBtnAdicionarCausaNE,
                iconCls: 'adicionar',
                id:'btnAdicionar',
                nextTab:'btnModificar',
                prevTab:'btnLimpiar',
                handler: function () {
                    var winAdd = new Ext.components.Evaluaciones.wAdicionar({
                        accion: 'add',
                        title: 'Adicionar causa no evaludo',
                        parent: self
                    });
                    winAdd.show();
                    winAdd.on('show', function () {
                        winAdd.btnAceptar.focus();
                    }, this)
                }
            });
            this.btnModificar = new Ext.Button({
                text: labels.btnModificar,
                id: 'btnModificar',
                tooltip: labels.lbBtnModificarCausaNE,
                iconCls: 'modificar',
                nextTab:'btnEliminar',
                prevTab:'btnAdicionar',
                handler: function () {
                    var winMod = new Ext.components.Evaluaciones.wAdicionar({
                        accion: 'mod',
                        title: 'Modificar causa no evaluado',
                        parent: self
                    });
                    winMod.show();
                    winMod.fAdicionar.getForm().loadRecord(self.getSelectionModel().getSelected());
                    winMod.on('show', function () {
                        winMod.btnAceptar.focus();
                    }, this)
                }
            });
            this.btnEliminar = new Ext.Button({
                text: labels.btnEliminar,
                id: 'btnEliminar',
                tooltip: labels.lbBtnEliminar,
                iconCls: 'eliminar',
                nextTab:'tfBuscar',
                prevTab:'btnModificar',
                handler: function () {
                    Ext.Msg.show({
                        title: 'Confirmaci&oacute;n',
                        msg: labels.lbDelCausaNE,
                        icon: Ext.Msg.QUESTION,
                        buttons: Ext.Msg.OKCANCEL,
                        fn: function (btn) {
                            if (btn == 'ok') {
                                PVD.mostrarMascara('idmskmodify', labels.lbMsgWait, labels.lbEnAccionCausaNE);
                                Ext.Ajax.request({
                                    url: 'eliminarCausanoevaluado',
                                    params: {
                                        id: idcausanoevaluado
                                    },
                                    callback: function (options, success, response) {
                                        PVD.ocultarMascara('idmskmodify');
                                        responseData = Ext.decode(response.responseText);
                                        if (responseData.success) {
                                            /*Ext.Notification.show({
                                                title: 'Informaci&oacute;n',
                                                msg: labels.lbDelSatisfactoriamenteCausaNE,
                                                time: 3
                                            });*/
                                            mostrarMensaje(1, labels.lbDelSatisfactoriamenteCausaNE);
                                            self.store.load({
                                                params: {
                                                    limit: 15,
                                                    start: 0
                                                }
                                            });
                                        } else {
                                            self.close();
                                            /*Ext.Notification.show({
                                                title: 'Informaci&oacute;n',
                                                msg: labels.lbDelEnUsoCausaNE,
                                                time: 3
                                            });*/
                                            mostrarMensaje(1, labels.lbDelEnUsoCausaNE);
                                        }
                                        self.tfBuscar.focus();
                                        self.btnModificar.disable();
                                        self.btnEliminar.disable();
                                    }
                                });
                            }
                        }
                    });
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyudaCausanoevaluado',
                text: "Ayuda",
                tooltip: "Ayuda",
                iconCls: 'ayuda'

            });


            this.bbar = this.pbacceso;
            Ext.components.Evaluaciones.gpCausaNoEvaluado.superclass.initComponent.call(this);
            this.store.on('load', function () {
                self.tfBuscar.focus();
                self.btnEliminar.disable();
                self.btnModificar.disable();
            });
        }
    }
);
/***********************************************************************/
////// VENTANA DE ADICIONAR CAUSA NO EVALUADO//////////
Ext.components.Evaluaciones.wAdicionar = Ext.extend(Ext.Window, {
        modal: true,
        initComponent: function () {
            var self = this;

            this.fAdicionar = new Ext.components.Evaluaciones.fpAsistencia();
            this.btnAceptar = new Ext.Button({
                iconCls: 'aceptar',
                id: 'aceptar' + self.id,
                nextTab: self.fAdicionar.denominacion.id,
                prevTab: 'aplicar' + self.id,
                text: labels.BtnAceptar,
                tooltip: labels.lbBtnAceptar,
                handler: this.accion == 'add' ?
                    function () {
                        if (self.fAdicionar.getForm().isValid()) {
                            PVD.mostrarMascara('idmskmodify', labels.lbMsgWait, labels.lbMsgBarraCausaNE);
                            Ext.Ajax.request({
                                url: 'adicionarCausanoevaluado',
                                params: {
                                    denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
                                    fechainicio: self.fAdicionar.getForm().findField('fechainicio').getRawValue(),
                                    fechafin: self.fAdicionar.getForm().findField('fechafin').getRawValue(),
                                    descripcion: self.fAdicionar.getForm().findField('descripcion').getValue()
                                },
                                callback: function (options, success, response) {
                                    PVD.ocultarMascara('idmskmodify');
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.existe) {
                                        self.close();
                                        /*Ext.Notification.show({
                                            title: 'Informaci&oacute;n',
                                            msg: labels.lbAddSatisfactoriamenteCausaNE,
                                            time: 3
                                        });*/
                                        mostrarMensaje(1, labels.lbAddSatisfactoriamenteCausaNE);
                                        self.parent.store.load({
                                            params: {
                                                limit: 15,
                                                start: 0
                                            }
                                        });
                                    } else {
                                        self.close();
                                        /*Ext.Notification.show({
                                            title: 'Informaci&oacute;n',
                                            msg: labels.lbAddsExisteCausaNE,
                                            time: 3
                                        });*/
                                        mostrarMensaje(1, labels.lbAddsExisteCausaNE);
                                    }
                                    self.parent.tfBuscar.focus();
                                   /* self.parent.btnModificar.disable();
                                    self.parent.btnEliminar.disable();*/
                                }
                            });
                        }

                    } : function () {
                    if (self.fAdicionar.getForm().isValid()) {
                        PVD.mostrarMascara('idmskmodify', labels.lbMsgWait, labels.lbMsgBarraCausaNE);
                        Ext.Ajax.request({
                            url: 'modificarCausanoevaluado',
                            params: {
                                id: idcausanoevaluado,
                                denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
                                fechainicio: self.fAdicionar.getForm().findField('fechainicio').getRawValue(),
                                fechafin: self.fAdicionar.getForm().findField('fechafin').getRawValue(),
                                descripcion: self.fAdicionar.getForm().findField('descripcion').getValue(),
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmskmodify');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.existe) {
                                    self.close();
                                    /*Ext.Notification.show({
                                        title: 'Informaci&oacute;n',
                                        msg: labels.lbModSatisfactoriamenteCausaNE,
                                        time: 3
                                    });*/
                                    mostrarMensaje(1, labels.lbModSatisfactoriamenteCausaNE);
                                    self.parent.store.load({
                                        params: {
                                            limit: 15,
                                            start: 0
                                        }
                                    });
                                } else {
                                    self.close();
                                    /*Ext.Notification.show({
                                        title: 'Informaci&oacute;n',
                                        msg: labels.lbModExisteCausaNE,
                                        time: 3
                                    });*/
                                    mostrarMensaje(1, labels.lbModExisteCausaNE);
                                }
                                self.parent.tfBuscar.focus();
                               /* self.parent.btnModificar.disable();
                                self.parent.btnEliminar.disable();*/

                            }
                        });
                    }

                }
            });
            this.btnAplicar = new Ext.Button({
                iconCls: 'aplicar',
                id: 'aplicar' + self.id,
                hidden: this.accion == 'add' ? false : true,
                text: labels.BtnAplicar,
                tooltip: labels.lbBtnAplicar,
                handler: function () {
                    if (self.fAdicionar.getForm().isValid()) {
                        PVD.mostrarMascara('idmskmodify', labels.lbMsgWait, labels.lbMsgBarraCausaNE);
                        Ext.Ajax.request({
                            url: 'adicionarCausanoevaluado',
                            params: {
                                denominacion: self.fAdicionar.getForm().findField('denominacion').getValue(),
                                fechainicio: self.fAdicionar.getForm().findField('fechainicio').getRawValue(),
                                fechafin: self.fAdicionar.getForm().findField('fechafin').getRawValue(),
                                descripcion: self.fAdicionar.getForm().findField('descripcion').getValue(),
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmskmodify');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.existe) {
                                    /*Ext.Notification.show({
                                        title: 'Informaci&oacute;n',
                                        msg: labels.lbAddSatisfactoriamenteCausaNE,
                                        time: 3
                                    });*/
                                    mostrarMensaje(1, labels.lbAddSatisfactoriamenteCausaNE);
                                    self.parent.store.load({
                                        params: {
                                            limit: 15,
                                            start: 0
                                        }
                                    });
                                    self.fAdicionar.getForm().reset();
                                } else {
                                    /*Ext.Notification.show({
                                        title: 'Informaci&oacute;n',
                                        msg: labels.lbAddsExisteCausaNE,
                                        time: 3
                                    });*/
                                    mostrarMensaje(1, labels.lbAddsExisteCausaNE);
                                    self.fAdicionar.getForm().reset();
                                }

                            }
                        });
                    }
                }
            });
            this.btnCancelar = new Ext.Button({
                iconCls: 'cancelar',
                id: 'cancelar' + self.id,
                text: labels.BtnCancelar,
                tooltip: labels.lbBtnCancelar,
                handler: function () {
                    self.close();
                    self.parent.btnAdicionar.focus();
                }
            });
            this.keys = [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        self.btnAceptar.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    fn: function () {
                        self.btnAplicar.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    fn: function () {
                        self.btnCancelar.handler();
                    }
                }
            ];
            this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];

            this.items = [this.fAdicionar];
            Ext.components.Evaluaciones.wAdicionar.superclass.initComponent.call(this);
        }
    }
);
/***********************************************************************/
    ///////// FORMULARIO ///////////////////////////
Ext.components.Evaluaciones.fpAsistencia = Ext.extend(Ext.form.FormPanel, {
        labelAlign: 'top',
        frame: true,
        region: 'center',
        width: 400,
        autoHeight: true,
        autoShow: true,
        initComponent: function () {
            var self = this;
            this.denominacion = new Ext.form.TextField({
                fieldLabel: labels.lbDenominacion,
                name: 'denominacion',
                id: 'denominacion' + self.id,
                nextTab: 'fechainicio' + self.id,
                anchor: '99%',
                maskRe: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ ]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*)+$/,
                regex: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ ]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*)+$/,
                regexText: 'Solo se admite caracteres alfanuméricos',
                allowBlank: false,
                maxLength: 250,
                blankText: labels.lbCampoVacio
            });
            this.fechaI = new Ext.form.DateField({
                fieldLabel: labels.lbFechaInicio,
                name: 'fechainicio',
                //emptyText: 'Seleccione',
                id: 'fechainicio' + self.id,
                prevTab: 'denominacion' + self.id,
                nextTab: 'fehcafin' + self.id,
                allowBlank: false,
                value: new Date().format('d/m/Y'),
                maxText: labels.lbFechaMaxima,
                minText: labels.lbFechaMinima,
                endDateField: 'fehcafin' + self.id,
                hiddenname: 'fechaI',
                anchor: '99%',
                format: 'd/m/Y',
                readOnly: false,
                msgTarget: 'qtip',
                invalidText: labels.invalidTextFecha,
                vtype: 'daterange',
            });
            this.fechaF = new Ext.form.DateField({
                fieldLabel: labels.lbFechaFin,
                name: 'fechafin',
                //emptyText: 'Seleccione',
                id: 'fehcafin' + self.id,
                prevTab: 'fechainicio' + self.id,
                nextTab: 'descripcion' + self.id,
                maxText: labels.lbFechaMaxima,
                minText: labels.lbFechaMinima,
                stratDateField: 'fechainicio' + self.id,
                hiddenname: 'fechaF',
                anchor: '99%',
                format: 'd/m/Y',
                readOnly: false,
                msgTarget: 'qtip',
                invalidText: labels.invalidTextFecha,
                vtype: 'daterange',
                listeners: {change: function (tf, n, o) {
                    cambio = 1;
                }}
            });

            this.descripcion = new Ext.form.TextArea({
                fieldLabel: labels.lbDescripcion,
                name: 'descripcion',
                id: 'descripcion' + self.id,
                prevTab: 'fehcafin' + self.id,
                anchor: '99%',
                maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
                regex: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
                regexText: 'Solo se admite caracteres alfanuméricos',
                maxLength: 250
            });

            this.items = [this.denominacion,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.fechaI]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.fechaF]
                        }
                    ]
                },
                this.descripcion];
            Ext.components.Evaluaciones.fpAsistencia.superclass.initComponent.call(this);
        }
    }
);

function cargarInterfaz() {

    labels = arguments[1];

    var gpCausaNoEvaluado = new Ext.components.Evaluaciones.gpCausaNoEvaluado({
        height: '100%',
        width: '100%',
        margins: '5 5 5 5'
    });

    var pFiltros = new Ext.Panel({
        layout: 'column',
        margins: '5 5 5 5',
        frame:true,
        defaults:{
            layout:'form',
            border:false,
            labelAlign:'top',
            buttonAlign:'right'
        },
        cls: 'x-toolbar',
        height:65,
        autoScroll:true,
        autoShow:true,
        region:'north',
        items: [{
            columnWidth:.3,
            layout: 'form',
            items:[gpCausaNoEvaluado.tfBuscar]
        },{
            layout:'form',
            bodyStyle:'padding:19px 0 0 0;',
            columnWidth:'35px',
            items:[gpCausaNoEvaluado.btnBuscar]
        },{
            layout:'form',
            bodyStyle:'padding:19px 0 0 0;',
            columnWidth:'35px',
            items:[gpCausaNoEvaluado.btnLimpiar]
        }]
    });

    var kmIindicadorTexto = [{
        key: 'i',
        alt:true,
        fn: function(){
            gpCausaNoEvaluado.btnAdicionar.handler();
        }
    },{
        key: 'm',
        alt:true,
        fn: function(){
            if(!gpCausaNoEvaluado.btnModificar.disabled ){
                gpCausaNoEvaluado.btnModificar.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!gpCausaNoEvaluado.btnEliminar.disabled ){
                gpCausaNoEvaluado.btnEliminar.handler();
            }
        }
    },{
        key: 'b',
        alt:true,
        fn: function(){
            if(!gpCausaNoEvaluado.btnBuscar.disabled ){
                gpCausaNoEvaluado.btnBuscar.handler();
            }
        }
    },{
        key: 'l',
        alt:true,
        fn: function(){
            if(!gpCausaNoEvaluado.btnLimpiar.disabled ){
                gpCausaNoEvaluado.btnLimpiar.handler();
            }
        }
    },{
        key: 'h',
        alt:true,
        fn: function(){
            gpCausaNoEvaluado.btnAyuda.handler();
        }
    }
    ];

    var pContenedor = new Ext.Panel({
        bodyBorder:false,
        tbar: [gpCausaNoEvaluado.btnAdicionar, gpCausaNoEvaluado.btnModificar, gpCausaNoEvaluado.btnEliminar,'->',gpCausaNoEvaluado.btnAyuda],
        region:'center',
        layout:'border',
        keys:kmIindicadorTexto,
        items: [pFiltros, gpCausaNoEvaluado]
    });
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [pContenedor]
    });
};

