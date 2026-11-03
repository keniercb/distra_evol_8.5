/**
 Uso:Componente para visualizar los modelos de nomina

 * ---------------------------------------------

 * 25 de Junio de  2012 |   Nomina
 *

 * @extends Ext.Window
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Pvd.Nomina.Nomina');
Ext.QuickTips.init();
Pvd.Nomina.Nomina.Utils = function () {
    return {
        loadMask: function (msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function () {
            this.lMask.hide();
        }
    };
};

// var compartimentarCertificar = true;
// var compartimentarElaborar = true;
// var compartimentarAprobar = true;
// var compartimentarContabilizar = true;

var utils = new Pvd.Nomina.Nomina.Utils();
Ext.QuickTips.init();

//Para la ventana de reportes
Pvd.Nomina.Nomina.winReporte = Ext.extend(Ext.Window, {
    initComponent: function () {
        this.id = (this.id) ? this.id : 'winReporteEvt';
        this.datosPlantModelo = (this.datosPlantModelo) ? this.datosPlantModelo : null;
        this.direccion = (this.direccion) ? this.direccion : null;
        var idCmp = this.id;
        var self = this;
        this.tiporeporte = 'Pdf';
        this.tipovisualizacion = 'General';
        this.formatohoja = 'Letter';
        this.cajacajero = 0;
        var btnAcpReporte = new Ext.Button({
            disabled: true,
            nextTab: 'denominacion',
            id: 'btnAcpReporte&' + idCmp,
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            handler: function () {
                if (this.aceptarReporte(true))
                    this.destroy();
            }.createDelegate(this)
        });
        var btnCancReporte = new Ext.Button({
            disabled: false,
            prevTab: 'dfFechaFin',
            id: 'btnCancReporte&' + idCmp,
            // icon: perfil.dirImg + 'cancelar.png',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
            iconCls: 'cancelar',
            text: 'Cancelar',
            handler: function () {
                this.destroy();
            }.createDelegate(this)
        });
        this.layout = 'fit',
            this.modal = true;
        this.closeAction = 'destroy';
        this.title = 'Exportar nómina';
        this.resizable = false;
        this.width = 385;
        this.height = 320;
        this.buttons = [btnCancReporte, btnAcpReporte];

        //Formato
        this.radioGeneral = new Ext.form.Radio({
            //disabled: true,
            hideLabel: true,
            id: 'rad3',
            align: 'center',
            boxLabel: 'General',
            name: 'tipoacceso',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        self.tiporeporte = 'Pdf';
                        self.tipovisualizacion = 'General';
                        btnAcpReporte.enable();
                        self.cbTiposHoja.enable();
                    }
                }.createDelegate(this)
            }
        });
        this.radioPlantillas = new Ext.form.Radio({
            //disabled: true,
            hideLabel: true,
            id: 'rad4',
            align: 'center',
            boxLabel: 'Por plantillas',
            name: 'tipoacceso',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        self.tiporeporte = 'Pdf';
                        self.tipovisualizacion = 'Plantillas';
                        btnAcpReporte.enable();
                        self.cbTiposHoja.enable();
                    }
                }.createDelegate(this)
            }
        });
        this.cbTiposHoja = new Ext.pvd.nomina.tipoHoja({
            //disabled: true,
            fieldLabel: 'Tipos de hoja',
            anchor: '90%',
            listeners: {
                'select': function (obj, ischeck) {
                    var val = obj.getRawValue().split('/>');
                    if (this.radioGeneral.getValue() || this.radioPlantillas.getValue()) {
                        //btnAcpReporte.enable();
                        if (ischeck) {
                            self.formatohoja = val[1];
                        }
                    }
                }.createDelegate(this)
            }
        });
        this.fsRadiosPdf = new Ext.form.FieldSet({
            title: 'Formatos de hoja',
            height: 120,
            //disabled: true,
            items: [
                this.radioGeneral,
                this.radioPlantillas,
                this.cbTiposHoja
            ]
        });

        //Forma de pago
        this.radioTodos = new Ext.form.Radio({
            hideLabel: true,
            id: 'radiocajacajero',
            align: 'center',
            boxLabel: 'Todos',
            name: 'cajacajero',
            checked: true,
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        self.cajacajero = 0;
                    }
                }.createDelegate(this)
            }
        });
        this.radioCaja = new Ext.form.Radio({
            hideLabel: true,
            id: 'radiocaja',
            align: 'center',
            boxLabel: 'Por Caja',
            name: 'cajacajero',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        self.cajacajero = 1;
                    }
                }.createDelegate(this)
            }
        });
        this.radioCajero = new Ext.form.Radio({
            hideLabel: true,
            id: 'radiocajero',
            align: 'center',
            boxLabel: 'Por Cajero',
            name: 'cajacajero',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        self.cajacajero = 2;
                    }
                }.createDelegate(this)
            }
        });
        this.fsFormaPago = new Ext.form.FieldSet({
            title: 'Formas de pago',
            height: 60,
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.radioTodos]},
                        {columnWidth: .33, layout: 'form', items: [this.radioCaja]},
                        {columnWidth: .33, layout: 'form', items: [this.radioCajero]}
                    ]
                }
            ]
        });

        this.items = [
            {
                bodyStyle: 'padding:5px;',
                frame: true,
                items: [
                    this.fsFormaPago,
                    {
                        xtype: 'radio',
                        hideLabel: true,
                        id: 'rad1',
                        align: 'center',
                        boxLabel: 'Hojas de c&aacute;lculo (EXCEL)',
                        name: 'tipoacceso',
                        inputValue: 'ultimo',
                        listeners: {
                            'check': function (obj, ischeck) {
                                if (ischeck) {
                                    btnAcpReporte.enable();
                                    this.tiporeporte = 'Exel';
                                    this.radioGeneral.disable();
                                    this.radioPlantillas.disable();
                                    this.cbTiposHoja.disable();
                                    this.fsRadiosPdf.disable();
                                }
                            }.createDelegate(this)
                        }
                    },
                    {
                        xtype: 'radio',
                        hideLabel: true,
                        checked: true,
                        align: 'center',
                        boxLabel: 'Formato de documento port&aacute;til (PDF)',
                        id: 'rad2',
                        name: 'tipoacceso',
                        inputValue: 'nuevo',
                        listeners: {
                            'check': function (obj, ischeck) {
                                if (ischeck) {
                                    this.radioGeneral.enable();
                                    this.radioPlantillas.enable();
                                    this.cbTiposHoja.enable();
                                    this.fsRadiosPdf.enable();
                                }
                            }.createDelegate(this)
                        }
                    },
                    this.fsRadiosPdf

                ]
            }];
        this.on('beforedestroy', function () {
        });
        Pvd.Nomina.Nomina.winReporte.superclass.initComponent.call(this);
    },
    aceptarReporte: function () {
        var winload = new Ext.PVD.comun.window.winLoad({
            title: 'Por favor espere...',
            mensaje: 'Generando reporte'
        });

        winload.showMask();
        if (this.estado == 0) {
            var arrayidnomina = new Array();
            for (var i = 0; i < this.seleccionados.length; i++) {
                arrayidnomina.push(this.seleccionados[i]['data']['idnomina']);
            }
        }
        var iframe = document.createElement("iframe");
        iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/nomina/exportarnomina?identidad=' +
            this.idestructura + '&id=' + this.idelaborarpago + '&formato=' + this.tiporeporte + '&tipovisualizacion=' + this.tipovisualizacion + '&estado=' + this.estado + '&arrayidnomina=' +
            Ext.encode(arrayidnomina) + '&direccion=' + this.direccion + '&formatohoja=' + this.formatohoja + '&cajacajero=' + this.cajacajero;
        iframe.style.display = 'none';
        that = this;
        iframe.onload = function () {
            winload.hideMask();
            that.destroy();
        }
        document.body.appendChild(iframe);

    }
});

//Para la ventana de campos especificos
Pvd.Nomina.Nomina.winCampos = Ext.extend(Ext.Window, {
    initComponent: function () {
        var scope = this;
        this.id = (this.id) ? this.id : 'winCamposEvt';
        this.identidad = (this.identidad) ? this.identidad : null;
        this.idelaborarpagos = (this.idelaborarpagos) ? this.idelaborarpagos : null;
        this.estado = (this.estado) ? this.estado : null;
        var idCmp = this.id;
        var btnAcpReporte = new Ext.Button({
            nextTab: 'denominacion',
            id: 'btnAcpReporte&' + idCmp,
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            handler: function () {
                if (this.aceptarCampos(true))
                    this.destroy();
            }.createDelegate(this)
        });
        var btnCancReporte = new Ext.Button({
            disabled: false,
            prevTab: 'dfFechaFin',
            id: 'btnCancReporte&' + idCmp,
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
            iconCls: 'cancelar',
            text: 'Cancelar',
            handler: function () {
                this.destroy();
            }.createDelegate(this)
        });
        this.layout = 'fit';
        this.modal = true;
        this.closeAction = 'destroy';
        this.title = 'Seleccionar campos';
        this.resizable = false;
        this.width = 500;
        this.height = 300;
        this.buttons = [btnCancReporte, btnAcpReporte];
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                fn: function () {
                    btnAcpReporte.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    btnCancReporte.handler();
                }
            }
        ];

        //Grid de campos
        this.storeCampos = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomina/obtenerCamposEstModNom',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idcampo"},
                [
                    {name: 'idcampo'}
                    ,
                    {name: 'denominacion'}
                ])
        });
        this.storeCampos.load({params: {identidad: this.identidad, idelaborarpagos: this.idelaborarpagos}});
        this.smCampos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gpCampos = new Ext.grid.GridPanel({
            id: 'idgpCampos',
            title: 'Listado de campos espec&iacute;ficos',
            region: 'center',
            columns: [
                this.smCampos, new Ext.grid.RowNumberer(),
                {header: 'idcampo', hidden: true, width: 50, dataIndex: 'idcampo'}
                ,
                {header: 'Denominaci&oacute;n', width: 150, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {
                forceFit: true
            },
            store: this.storeCampos,
            sm: this.smCampos,
            loadMask: {
                msg: 'Cargando...'
            }
            /*,
             bbar: new Ext.PagingToolbar({
             pageSize: 20,
             store: this.storeCampos,
             displayInfo: true,
             displayMsg: 'Mostrando  {0} - {1} de {2}',
             emptyMsg: "0 Resultado a mostrar"
             })*/
        });
        this.items = this.gpCampos;
        this.smCampos.on('rowselect', function (sm) {
            var seleccionados = scope.gpCampos.getSelectionModel().getSelections().length;
            (seleccionados > 0) ? btnAcpReporte.enable() : btnAcpReporte.disable();
        });
        this.smCampos.on('rowdeselect', function (sm) {
            var seleccionados = scope.gpCampos.getSelectionModel().getSelections().length;
            (seleccionados > 0) ? btnAcpReporte.enable() : btnAcpReporte.disable();
        });
        Pvd.Nomina.Nomina.winCampos.superclass.initComponent.call(this);
    },
    aceptarCampos: function () {
        //Array campos
        var arrdatos = this.gpCampos.getSelectionModel().getSelections();
        var arrcampos = new Array();
        Ext.each(arrdatos, function (rec) {
            arrcampos.push({
                idcampo: rec.get('idcampo')
            });
        });

        if (this.estado != 0) {
            //Mascara
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();

            //Frame
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/nomina/exportarCamposEspecificos?identidad=' +
                this.identidad + '&idelaborarpagos=' + this.idelaborarpagos + '&campos=' + Ext.encode(arrcampos);
            iframe.style.display = 'none';
            that = this;
            // iframe.onload = function () {
                winload.hideMask();
                that.destroy();
            // };
            document.body.appendChild(iframe);
        } else {
            mostrarMensaje(3, 'Las n&oacute;minas deben estar al menos certificadas.');
        }

    }
});

Pvd.Nomina.Nomina.winVisualizarNomina = Ext.extend(Ext.Window, {
    title: 'Modelos de Pre-n&oacute;mina',
    layout: 'border',
    width: 800,
    height: 600,
    closeAction: 'hide',
    closable: true,
    modal: true,
    plain: false,
    datosPeriodo: null,
    identidad: null,
    estadonominas: null,
    cant_plantillas_sel: 0,

    initComponent: function () {
        var scope = this;
        var idtipopagoaux = 0;
        //this.title = (this.title ? this.title : 'Modelos de n&oacute;mina');
        this.layout = (this.layout ? this.layout : 'border');
        this.datosPeriodo = (this.datosPeriodo ? this.datosPeriodo : null);
        this.identidad = (this.identidad ? this.identidad : null);
        this.direccionarchivo = '';
        this.modovisualizar = 1;
        this.certificadaaprobada = 0;
        this.estado = '';
        this.idComprobante = 0;
        this.tiporeporte = 'centroscosto';

        this.plantillaDatos1 = new Ext.XTemplate(
            '<div>',
            '<p><span style="color:grey;"><b>Datos pago </b></span></p>',
            '<p><span style="color:blue;"><b>Tipo de pago: </b>{tipopago}</span></p>',
            '<p><span style="color:blue;"><b>Per&iacute;odo de pago: </b>{periodopago}</span></p>',
            '<p><span style="color:blue;"><b>Fecha de pago: </b>{fechapago}</span></p>',
            '<p><span style="color:blue;"><b>Rango de fechas: </b>{rangofechas}</span></p>',
            '<p></p><p></p>',
            '<p><span style="color:grey;"><b>Datos contables </b></span></p>',
            '<p><span style="color:green;"><b>N&uacute;mero de comprobante de operaciones: </b>{numerocomprobanteoperaciones}</span></p>',
            '<p><span style="color:green;"><b>N&uacute;mero de comprobante de cancelaci&oacute;n: </b>{numerocomprobantecancelacion}</span></p>',
            '<p><span style="color:green;"><b>N&uacute;mero de comprobante de cuentas x cobrar: </b>{numerocomprobantecuentaxcobrar}</span></p>',
            '<p><span style="color:green;"><b>Cantidad personas: </b>{totalpersonas}</span></p>',
            '<p><span style="color:green;"><b>Cantidad personas en Centros de costo: </b>{totalpersonascc}</span></p>',
            //'<p><span style="color:green;"><b>Salario total: </b>{salariototal}</span></p>',
            '<tpl for="datoscontables">',
            '<p><span style="color:green;"><b>{denominacion}:</b> {importeconceptocontable}</span></p>',
            '</tpl>',
            '</div>'
        );

        this.plantillaDatos2 = new Ext.XTemplate(
            '<div>',
            '<p><span style="color:grey;"><b>Datos pago </b></span></p>',
            '<p><span style="color:blue;"><b>Tipo de pago: </b>{tipopago}</span></p>',
            '<p><span style="color:blue;"><b>Per&iacute;odo de pago: </b>{periodopago}</span></p>',
            '<p><span style="color:blue;"><b>Fecha de pago: </b>{fechapago}</span></p>',
            '<p><span style="color:blue;"><b>Mes: </b>{mespago}</span></p>',
            '<p></p><p></p>',
            '<p><span style="color:grey;"><b>Datos contables </b></span></p>',
            '<p><span style="color:green;"><b>N&uacute;mero de comprobante de operaciones: </b>{numerocomprobanteoperaciones}</span></p>',
            '<p><span style="color:green;"><b>N&uacute;mero de comprobante de cancelaci&oacute;n: </b>{numerocomprobantecancelacion}</span></p>',
            '<p><span style="color:green;"><b>N&uacute;mero de comprobante de cuentas x cobrar: </b>{numerocomprobantecuentaxcobrar}</span></p>',
            '<p><span style="color:green;"><b>Cantidad personas: </b>{totalpersonas}</span></p>',
            '<p><span style="color:green;"><b>Cantidad personas en Centros de costo: </b>{totalpersonascc}</span></p>',
            //'<p><span style="color:green;"><b>Salario total: </b>{salariototal}</span></p>',
            '<tpl for="datoscontables">',
            '<p><span style="color:green;"><b>{denominacion}:</b> {importeconceptocontable}</span></p>',
            '</tpl>',
            '</div>'
        );
        this.plantillaDatos1.compile();
        this.plantillaDatos2.compile();

        this.pDatosPeriodoPago = new Ext.Panel({
            title: 'Informaci&oacute;n',
            region: 'west',
            height: 150,
            width: 300,
            split: true,
            autoScroll: true,
            collapsible: true
        });

        this.taReferencia = new Ext.form.TextArea({
            id: 'taReferencia',
            allowBlank: true,
            anchor: '100%'
        });

        this.pDescripcion = new Ext.Panel({
            title: 'Referencia',
            region: 'east',
            height: 150,
            width: 300,
            layout: 'fit',
            split: true,
            autoScroll: true,
            collapsible: true,
            collapsed: true,
            items: [this.taReferencia]
        });

        this.stModelosPlantillas = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/nomina/obtenermodelosplantillasnomina',
            groupField: 'plantillanominal',
            reader: new Ext.data.JsonReader({totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idnomina"},
                [
                    {name: 'idnomina'},
                    {name: 'idelaborarpago'},
                    {name: 'idplantillanominal'},
                    {name: 'idconfmodelonomina'},
                    {name: 'idtiponomina'},
                    {name: 'cajacajero'},
                    {name: 'numeronomina'},
                    {name: 'aprobada'},
                    {name: 'acumulada'},
                    {name: 'acumuladasnc'},
                    {name: 'tiponomina'},
                    {name: 'plantillanominal'},
                    {name: 'denomcajacajero'}
                ]),
            sortInfo: {field: 'idtiponomina', direction: "ASC"},
        });

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d\s]+ ?[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d\s]*)+$/,
            anchor: '90%',
            name: 'tfbuscador',
            prevTab: '',
            nextTab: ''
        });

        this.tfbuscarpersona = new Ext.form.TextField({
            id: 'tfbuscarpersona',
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d\s]+ ?[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d\s]*)+$/,
            anchor: '90%',
            name: 'tfbuscadorpersona',
            prevTab: '',
            nextTab: ''
        });

        this.tfbuscar.on('specialkey', function (t, e) {
            if (e.keyCode == 13) {
                this.Buscador(t.getValue());
            }
        }, this)

        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar',
            //icon: perfil.dirImg + 'buscar.png',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar plantilla nominal(<b>Alt+B</b>)',
            handler: function () {
                this.Buscador(this.tfbuscar.getValue());
            }.createDelegate(this)
        });

        this.btnLimpiar = new Ext.Button({
            disabled: false,
            id: 'btnLimpiar',
            //icon: perfil.dirImg + 'buscar.png',
            iconCls: 'limpiar',
            text: '<u>L</u>impiar',
            tooltip: 'Limpiar filtro',
            handler: function () {
                //console.log(this.estadonominas)
            this.tfbuscar.setValue("");   
            this.stModelosPlantillas.clearFilter();
            if(this.estadonominas == 0){
                this.btnCertificarTodasNomina.enable();
                
            }
            else if(this.estadonominas == -1){
                
                this.btnAprobarTodasNomina.enable();
                this.btnElaborar.enable();
            }
            }.createDelegate(this)
        });

        this.btnBuscarPersona = new Ext.Button({
            disabled: false,
            id: 'btnBuscarPersona',
            //icon: perfil.dirImg + 'buscar.png',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar personas(<b>Alt+B</b>)',
            handler: function () {
                this.BuscadorPersona(this.tfbuscarpersona.getValue());
            }.createDelegate(this)
        });

        this.btnElaborar = new Ext.Button({
            id: 'btnElaborar',
            text: 'Elaborar',
            tooltip: 'Desaprobar pre-nómina',
            // disabled: true,
            // icon: perfil.dirImg + 'aprobar.png',
            iconCls: 'desaprobar',
            hidden: true,
            handler: function () {
                this.ventanaDesaprobacion.show();
            }.createDelegate(this)
        });

        //Radios de tipos de formato
        //Ventana para escoger la asociación automática o manual
        this.rbExcel = new Ext.form.Radio({
            id: 'rbExcel',
            boxLabel: 'Excel',
            name: 'tipobusqueda',
            inputValue: 1,
            handler: function () {
                scope.btnAceptarTipoBusqueda.enable();
            }.createDelegate(this)
        });

        this.rbPDF = new Ext.form.Radio({
            id: 'rbPDF',
            boxLabel: 'PDF',
            name: 'tipobusqueda',
            inputValue: 2,
            handler: function () {
                scope.btnAceptarTipoBusqueda.enable();
            }.createDelegate(this)
        });

        this.rgTipoBusqueda = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.50, .50],
            style: 'padding-left: 30px;',
            items: [this.rbExcel, this.rbPDF]
        });

        this.formularioTipoBusqueda = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 450,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: 'Tipos de formato a exportar',
                height: 80,
                width: '93%',
                region: 'center',
                items: [
                    this.rgTipoBusqueda
                ]
            }]
        });

        this.btnAceptarTipoBusqueda = new Ext.Button({
            id: 'btnAceptarTipoBusqueda',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true,
            handler: function () {
                //console.info(scope.tiporeporte);
                switch (scope.tiporeporte) {
                    case 'centroscosto':
                        if (scope.rbPDF.getGroupValue() == 1) {
                            scope.exportarComprobantesCentrosCosto(1);
                        } else {
                            scope.exportarComprobantesCentrosCosto(2);
                        }
                        break;
                    case 'comprobacion':
                        if (scope.rbPDF.getGroupValue() == 1) {
                            scope.exportarComprobantesComprobacion(1);
                        } else {
                            scope.exportarComprobantesComprobacion(2);
                        }
                        break;
                }
                scope.ventanaTipoBusqueda.hide();
            }.createDelegate(this)
        });

        this.btnCancelarTipoBusqueda = new Ext.Button({
            id: 'btnCancelarTipoBusqueda',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                scope.ventanaTipoBusqueda.hide();
            }.createDelegate(this)
        });

        this.ventanaTipoBusqueda = new Ext.Window({
            region: 'center',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.formularioTipoBusqueda],
            //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
            bbar: ['->', this.btnCancelarTipoBusqueda, this.btnAceptarTipoBusqueda]
        });

        this.btnExportarNomina = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar datos de la nomina(<b>Alt+E</b>)',
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        id: 'idmodelos',
                        text: 'Modelo SC-4-01 Control Datos N&oacute;minas', handler: function (items, pepe) {
                        var cont = scope.stModelosPlantillas.getCount();
                        var datosPlantModelo = scope.stModelosPlantillas.getRange(0, cont - 1);
                        var idelaborarpago = scope.datosPeriodo.idelaborarpagos;
                        var winReporteEvento = new Pvd.Nomina.Nomina.winReporte({
                            idestructura: scope.identidad,
                            idelaborarpago: idelaborarpago,
                            estado: scope.estadonominas,
                            datosPlantModelo: datosPlantModelo,
                            direccion: scope.direccionarchivo,
                            seleccionados: scope.gpModelosPlantillas.getSelectionModel().getSelections()
                        });
                        winReporteEvento.show();
                    }
                    },//0
                    {
                        disabled: true,
                        id: 'iddescuentos',
                        text: 'Descuentos No Aplicados', handler: function (items, pepe) {
                        PVD.mostrarMascara('idmaskdescuentos', 'Por favor espere…', 'Generando reporte');
                        Ext.Ajax.request({
                            timeout: 50000000,
                            url: '/pvd/nomina/index.php/nomina/exportardescuentosnoaplicados',
                            method: 'POST',
                            params: {
                                identidad: scope.identidad,
                                idelaborarpagos: scope.datosPeriodo.idelaborarpagos,
                                accionvalidar: 1
                            },
                            callback: function (options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                if (respuesta['msg'] == 'NO-CAMPOS-VALORES-NEGATIVOS') {
                                    PVD.ocultarMascara('idmaskdescuentos');
                                    mostrarMensaje(3, 'El tipo de n&oacute;mina, ' + '<b>' + respuesta['denomtiponomina'] + '</b>' + ', no tiene configurado campos que acepten valores negativos.');
                                } else if (respuesta['msg'] == 'NO-PERSONAS-IMPORTES-NEGATIVOS') {
                                    PVD.ocultarMascara('idmaskdescuentos');
                                    mostrarMensaje(3, 'En este pago no existen personas con importes negativos.');
                                } else {
                                    var iframe = document.createElement("iframe");
                                    iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/nomina/exportardescuentosnoaplicados?identidad=' +
                                        scope.identidad + '&idelaborarpagos=' + scope.datosPeriodo.idelaborarpagos;
                                    iframe.style.display = 'none';
                                    iframe.onload = function () {
                                        PVD.ocultarMascara('idmaskdescuentos');
                                    };
                                    document.body.appendChild(iframe);
                                }
                            }.createDelegate(this)
                        });
                    }
                    },//1
                    {
                        id: 'idcamposespecificos',
                        text: 'Campos espec&iacute;ficos', handler: function (items, a) {
                        var winCampos = new Pvd.Nomina.Nomina.winCampos({
                            identidad: scope.identidad,
                            idelaborarpagos: scope.datosPeriodo.idelaborarpagos,
                            estado: scope.estadonominas
                        });
                        winCampos.show();
                    }
                    },//2
                    {
                        id: 'idcomprobantescentroscosto',
                        text: 'Comprobante centros costo', handler: function (items, a) {
                        scope.tiporeporte = 'centroscosto';
                        mostrarVentanaEleccionFormatos();
                    }
                    },//3
                    {
                        id: 'idcomprobantecomprobacion',
                        text: 'Comprobante de comprobaci&oacute;n', handler: function (items, a) {
                        scope.tiporeporte = 'comprobacion';
                        mostrarVentanaEleccionFormatos();
                    }
                    },//4
                ]
            }
        });

        function mostrarVentanaEleccionFormatos() {
            scope.ventanaTipoBusqueda.show();
        }


        this.btnAprobarTodasNomina = new Ext.Button({
            id: 'btnAprobarTodasNomina',
            text: 'Aprobar',
            tooltip: 'Aprobar pre-nómina',
            hidden : true,
            // icon: perfil.dirImg + 'aprobar.png',
            iconCls: 'aprobar',
            handler: function () {

                mostrarMensaje(2, 'Est&aacute; seguro que desea <b>APROBAR</b> las <b>N&Oacute;MINAS</b>. Con esta acci&oacute;n los datos de las mismas no podr&aacute;n ser modificados jam&aacute;s y estas quedar&aacute;n listas para pagar.', function (btn) {
                    if(btn == 'ok'){
                        var cont = this.stModelosPlantillas.getCount();
                        var todos = this.stModelosPlantillas.getRange(0, cont - 1);
                        this.GenerarNomina(todos, 1);
                    }
                }.createDelegate(this));

            }.createDelegate(this)
        });

        this.btnCertificarTodasNomina = new Ext.Button({
            id: 'btnCertificarTodasNomina',
            text: 'Certificar',
            tooltip: 'Certificar pre-nómina',
            // hidden : true,
            // icon: perfil.dirImg + 'crearreporte.png',
            iconCls: 'crearreporte',
            hidden: true,
            handler: function () {
                var cont = this.stModelosPlantillas.getCount();
                var todos = this.stModelosPlantillas.getRange(0, cont - 1);
                this.GenerarNomina(todos, -1);

            }.createDelegate(this)
        });

        this.btnAcumularLiquidarVacacionesNomina = new Ext.Button({
            id: 'btnAcumularLiquidarVacacionesNomina',
            text: 'Acumular/Liquidar',
            tooltip: '',
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            handler: function () {

                var cont = this.stModelosPlantillas.getCount();
                var todos = this.stModelosPlantillas.getRange(0, cont - 1);
                //var s = this.gpModelosPlantillas.getSelectionModel().getSelected();
                this.acumularLiquidarVacacionesNomina(todos);

            }.createDelegate(this)
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: '',
            disabled: false,
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',

        });
		
		//Radios de tipos de Exportacion Fichero Contabilizacion
        //Ventana para escoger el tipo de Exportacion Fichero Contabilizacion
        this.rbExportarXMLContabilizacion = new Ext.form.Radio({
            id: 'rbExportarXMLContabilizacion',
            boxLabel: 'XML SABIC',
            name: 'tipoficherocontabilizacion',
            inputValue: 1
        });

        this.rbExportarDBFContabilizacion = new Ext.form.Radio({
            id: 'rbExportarDBFContabilizacion',
            boxLabel: 'DBF SABIC',
            name: 'tipoficherocontabilizacion',
            inputValue: 2
        });

        this.rgTipoFicheroContabilizacion = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.50, .50],
            style: 'padding-left: 20px;',
			items: [this.rbExportarXMLContabilizacion, this.rbExportarDBFContabilizacion]
        });
		
		this.formularioTipoFicheroContabilizacion = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 500,
            heigth: 450,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: 'Tipos de Ficheros a Contabilizar en Sistemas Externos ',
                height: 80,
                width: '93%',
                region: 'center',
                items: [
                    this.rgTipoFicheroContabilizacion
                ]
            }]
        });

        this.btnAceptarTipoFicheroContabilizacion = new Ext.Button({
            id: 'btnAceptarTipoFicheroContabilizacion',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true,
			listeners: {
                'click': function (btn) {
						var tipofichero = 1;
						if (scope.rbExportarXMLContabilizacion.getGroupValue() == 1) {
							tipofichero = 1;
						} else {
							tipofichero = 2;
						}
						var winload = new Ext.PVD.comun.window.winLoad({
                            title: 'Por favor espere...',
                            mensaje: 'Generando fichero contabilizaci&oacute;n'
                        });
                        winload.showMask();

                        window.open(document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/nomina/exportarFicheroContabilizacionSistemaExterno?idelaborarpago=' + scope.datosPeriodo.idelaborarpagos + '&idtipopago=' + scope.datosPeriodo.idtipopago + '&identidad=' + scope.identidad + '&tipofichero=' + tipofichero);
                        winload.hideMask();

                        Ext.Ajax.request({
                            timeout: 50000000,
                            url: '/pvd/nomina/index.php/nomina/exportarFicheroContabilizacionSistemaExterno',
                            method: 'POST',
                            params: {
                                idelaborarpago: scope.datosPeriodo.idelaborarpagos,
                                idtipopago: scope.datosPeriodo.idtipopago,
                                identidad: scope.identidad,
                                tipofichero: tipofichero,
                                crc: 1
                            },
                            callback: function (options, success, response) {
                                winload.hideMask();
                                var respuesta = Ext.decode(response.responseText);
                                //XML
                                if(tipofichero == 1){
                                    alert('El código crc generado es: ' + respuesta + '.');
                                //DBF
                                }else{
                                    if (respuesta.codigo == 'OK') {
                                        window.open(respuesta.url);
                                    }
                                }

                            }.createDelegate(this)
                        });


                }.createDelegate(this)
            }
        });

        this.btnCancelarTipoFicheroContabilizacion = new Ext.Button({
            id: 'btnCancelarTipoFicheroContabilizacion',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
			listeners: {
                'click': function (btn) {
                    this.ventanaTipoFicheroContabilizacion.hide();
                }.createDelegate(this)
            }
        });
		
		this.rbExportarXMLContabilizacion.on('check', function (ch, checked) {
            scope.btnAceptarTipoFicheroContabilizacion.enable();
        });

        this.rbExportarDBFContabilizacion.on('check', function (ch, checked) {
            scope.btnAceptarTipoFicheroContabilizacion.enable();
        });

        this.ventanaTipoFicheroContabilizacion = new Ext.Window({
            region: 'center',
            title: 'Ficheros a Contabilizar en Sistemas Externos',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.formularioTipoFicheroContabilizacion],
            //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
            bbar: ['->', this.btnCancelarTipoFicheroContabilizacion, this.btnAceptarTipoFicheroContabilizacion]
        });

        this.btnContabilizar = new Ext.Toolbar.MenuButton({
            id: 'btnContabilizar',
            text: 'Contabilizar',
            tooltip: 'Contabilizar los comprobantes de operaciones o de cancelaciones',
            iconCls: 'contabilidad',
            hidden: true,
            menu: {
                items: [
                    {
                        text: 'Contabilizar comprobante de operaciones', handler: function (items, pepe) {
                        var personasseleccionadas = scope.gpNomina.getSelectionModel().getSelections();

                        Ext.Ajax.request({
                            //timeout: 50000000,
                            url: '/pvd/nomina/index.php/nomina/comprobantes',
                            method: 'POST',
                            params: {
                                idelaborarpago: scope.datosPeriodo.idelaborarpagos,
                                accion: 1
                            },
                            callback: function (options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                if (respuesta['error'] == 'EXISTE-COMP-OPERACION') {
                                    mostrarMensaje(3, 'El per&iacute;odo de pago ya tiene un comprobante de operaciones.');
                                } else {
                                    var cont = scope.stModelosPlantillas.getCount();
                                    var todos = scope.stModelosPlantillas.getRange(0, cont - 1);
                                    scope.fLoadDataComprobante(items, 1, scope.datosPeriodo.idelaborarpagos, personasseleccionadas, 1, scope.idComprobante, todos, scope.identidad);
                                }
                            }.createDelegate(this)
                        });
                    }
                    },
                    {
                        text: 'Contabilizar comprobante de cancelaci&oacute;n', handler: function (items, val) {
                            mostrarMensaje(2, 'Esta seguro que desea cancelar el comprobante', function(btn){
                                if(btn == 'ok'){
                                    var personasseleccionadas = scope.gpNomina.getSelectionModel().getSelections();
                                    PVD.mostrarMascara('compcanc', 'Por favor espere...', 'Enviando datos');
                                    Ext.Ajax.request({
                                        //timeout: 50000000,
                                        url: '/pvd/nomina/index.php/nomina/comprobantes',
                                        method: 'POST',
                                        params: {
                                            idelaborarpago: scope.datosPeriodo.idelaborarpagos,
                                            accion: 2
                                        },
                                        callback: function (options, success, response) {
                                            PVD.ocultarMascara('compcanc');
                                            var respuesta = Ext.decode(response.responseText);
                                            if (respuesta['error'] == 'NO-EXISTE-COMP-OPERACION') {
                                                mostrarMensaje(3, 'El per&iacute;odo de pago no tiene comprobante de operaciones.');
                                            } else if (respuesta['error'] == 'EXISTE-COMP-CANCELACION') {
                                                mostrarMensaje(3, 'El per&iacute;odo de pago ya tiene un comprobante de cancelaci&oacute;n.');
                                            } else {
                                                /*if (personasseleccionadas.length == 0) {
                                                    mostrarMensaje(3, 'No hay personas seleccionadas.');
                                                } else*/
                                                var cont = scope.stModelosPlantillas.getCount();
                                                var todos = scope.stModelosPlantillas.getRange(0, cont - 1);
                                                scope.fLoadDataComprobante(items, 1, scope.datosPeriodo.idelaborarpagos, personasseleccionadas, 2, scope.idComprobante, todos, scope.identidad);
                                            }
                                        }.createDelegate(this)
                                    });
                                }
                            })
                        }
                    },
                    {
                        text: 'Exportar Ficheros Contabilizaci&oacute;n', handler: function (items, val) {
                        /*var winload = new Ext.PVD.comun.window.winLoad({
                            title: 'Por favor espere...',
                            mensaje: 'Generando reporte xml'
                        });
                        winload.showMask();
                        window.open(document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/nomina/exportarxmlcontabilidad?idelaborarpago=' + scope.datosPeriodo.idelaborarpagos + '&idtipopago=' + scope.datosPeriodo.idtipopago + '&identidad=' + scope.identidad);
                        winload.hideMask();
                        
                        Ext.Ajax.request({
                            timeout: 50000000,
                            url: '/pvd/nomina/index.php/nomina/exportarxmlcontabilidad',
                            method: 'POST',
                            params: {
                                idelaborarpago: scope.datosPeriodo.idelaborarpagos,
                                idtipopago: scope.datosPeriodo.idtipopago,
                                identidad: scope.identidad,
                                crc: 1,
                            },
                            callback: function (options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                alert('El código crc generado es: ' + respuesta + '.');
                            }.createDelegate(this)
                        });*/
						scope.ventanaTipoFicheroContabilizacion.show();
                    }
                    }
                ]
            }
        });

        this.btnActualizar = new Ext.Button({
            id: 'btnActualizar',
            text: 'Actualizar',
            tooltip: '',
            icon: perfil.dirImg + 'actualizar.png',
            iconCls: 'btn',
            hidden: true,
            handler: function () {
                this.SincronizarPlantillasModelos(1, -1, 1);
            }.createDelegate(this)
        });

        this.tfDescripDesaprobacion = new Ext.form.TextArea({
            id: 'tfDescripDesaprobacion',
            fieldLabel: 'Descripci&oacute;n', tabIndex: 5,
            name: 'descripcion', allowBlank: false,
            hiddenname: 'descripcion',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 255 caracteres.',
            anchor: '99%', prevTab: 'iddfFFinTarifa', nextTab: 'idbtnCancelarTarifa',
            blankText: 'Este campo es obligatorio.',
        });

        //Formulario de tipos de tarifa.
        this.formularioDesaprobacion = new Ext.FormPanel({
            id: 'formularioDesaprobacion',
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [this.tfDescripDesaprobacion],
        });

        //Botones de la ventana de tipos de tarifa
        this.btnCancelarDesaprobacion = new Ext.Button({
            id: 'idbtnCancelarTarifa',
            iconCls: 'cancelar',
            // icon: perfil.dirImg + 'cancelar.png',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            prevTab: 'idtfDescripTarifa',
            nextTab: 'idbtnAplicarTarifa',
        });

        this.btnAceptarDesaprobacion = new Ext.Button({
            id: 'btnAceptarDesaprobacion',
            iconCls: 'aceptar',
            // icon: perfil.dirImg + 'aceptar.png',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            prevTab: 'idbtnAplicarTarifa',
            nextTab: 'idtfDenomTarifa',
        });

        //Ventana de adicionar y modificar tipos de tarifa.
        this.ventanaDesaprobacion = new Ext.Window({
            modal: true,
            title: 'Causa de la desaprobaci&oacute;n',
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioDesaprobacion],
            buttons: [this.btnCancelarDesaprobacion, this.btnAceptarDesaprobacion],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        scope.btnAceptarDesaprobacion.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        scope.btnCancelarDesaprobacion.handler();
                    }
                }
            ]
        });

        this.stVisualizar = new Ext.data.SimpleStore({
            fields: [
                {name: 'valor'},
                {name: 'denominacion'}
            ]
        });
        var a = [
            [1, 'Plantillas'],
            [2, 'General']
        ];
        this.stVisualizar.loadData(a);

        this.cbVisualizar = new Ext.form.ComboBox({
            id: 'cbVisualizar',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            mode: 'local',
            readOnly: true,
            triggerAction: 'all',
            store: this.stVisualizar
        });

        this.cbVisualizar.on('select', function (st, rec, index) {
            if (rec.data.valor == 1) {
                this.modovisualizar = 1;
                this.CargarPlantillasModelos(this.modovisualizar, this);
            } else {
                this.modovisualizar = 2;
                this.CargarPlantillasModelos(this.modovisualizar, this);
            }
        }.createDelegate(this));

        this.btnAceptarDesaprobacion.setHandler(function (tf, n) {
            if (this.tfDescripDesaprobacion.getValue() != "") {
                this.ventanaDesaprobacion.hide();
                //Si la nomina no postea comprobantes de operaciones o si postea comprobantes y no tiene un comprobante asociado
                if((this.datosPeriodo.posteacomprobantes == 0) || ((this.datosPeriodo.posteacomprobantes == 1) && (this.datosPeriodo.numerocomprobanteoperaciones == null || this.datosPeriodo.numerocomprobanteoperaciones == ''))){
                    this.ElaborarNomina();
                }else{

                    mostrarMensaje(3, 'Por favor cancele el comprobante de operaciones, luego sincronice las n&oacute;mina y vuelva a desaprobarlas.')
                }
            }
        }.createDelegate(this));

        this.btnBuscar.setHandler(function (tf, n) {
            this.Buscador(this.tfbuscar.getValue());
        }.createDelegate(this));

        this.btnBuscarPersona.setHandler(function (tf, n) {
            this.BuscadorPersona(this.tfbuscarpersona.getValue());
        }.createDelegate(this));

        this.btnCancelarDesaprobacion.setHandler(function (tf, n) {
            this.ventanaDesaprobacion.hide();
        }.createDelegate(this));

        this.ventanaDesaprobacion.on('show', function (win) {
            this.tfDescripDesaprobacion.setValue("");
        }.createDelegate(this));

        this.selectionModel = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (selch) {
                    var multisel = selch.getSelections();
                    var flagcert = 0;
                    var flagaprob = 0;
                    //var flagacumul = 0;
                    var contst = selch.getSelections().length;
                    //Ciclo para verificar el estado de las nominas
                    for (k = 0; k < contst; k++) {
                        if (multisel[k]['data']['aprobada'] == 0) {
                            flagcert = 1;
                        }
                        if (multisel[k]['data']['aprobada'] == -1) {
                            flagaprob = 1;
                        }
                    }
                    //Ciclo para verificar el estado de las nominas
                    for (k = 0; k < contst; k++) {
                        if (multisel[k]['data']['aprobada'] == 0 || multisel[k]['data']['aprobada'] == -1) {
                            flagacumul = 1;
                        }
                    }
                    if (flagcert == 0) {
                        //  this.btnCertificarTodasNomina.disable();
                    } else {
                        // this.btnCertificarTodasNomina.enable();
                    }
                    if (flagaprob == 0) {
                        // this.btnAprobarTodasNomina.disable();
                    } else {
                        // this.btnAprobarTodasNomina.enable();
                    }
                    if (contst != 0) {

                        this.GenerarNomina(selch.getSelections(), 0);
                    } else {
                        this.LimpiarNomina();
                    }
                }.createDelegate(this)
            }
        });

        this.gpModelosPlantillas = new Ext.grid.EditorGridPanel({
            title: 'Plantillas y modelos de Pre-n&oacute;mina',
            store: this.stModelosPlantillas,
            region: 'center',
            height: 150,
            split: true,
            loadMask: {text: 'Cargando...'},
            columns: [this.selectionModel, {header: 'idnomina', dataIndex: 'idnomina', width: 100, hidden: true},
                {header: 'idelaborarpago', dataIndex: 'idelaborarpago', width: 100, hidden: true},
                {header: 'idplantillanominal', dataIndex: 'idplantillanominal', width: 100, hidden: true},
                {header: 'idconfmodelonomina', dataIndex: 'idconfmodelonomina', width: 100, hidden: true},
                {header: 'idtiponomina', dataIndex: 'idtiponomina', width: 85, hidden: true},
                {header: 'aprobada', dataIndex: 'aprobada', width: 100, hidden: true},
                {header: 'No. n&oacute;mina', dataIndex: 'numeronomina', width: 50, renderer: this.ActivarColores},
                {header: 'Tipo de n&oacute;mina', dataIndex: 'tiponomina', width: 150, renderer: this.ActivarColores},
                {header: 'Caja o Cajero', dataIndex: 'denomcajacajero', width: 40, renderer: this.ActivarColores},
                {
                    header: 'Plantilla nominal',
                    dataIndex: 'plantillanominal',
                    width: 150,
                    renderer: this.MostrarPlantilla,
                    hidden: true
                },
                {
                    header: '<center>Acumulada/Liquidada vacaciones</center>',
                    dataIndex: 'acumulada',
                    width: 95,
                    renderer: formatearAcumulada
                },
                {
                    header: '<center>SNC-225</center>',
                    dataIndex: 'acumuladasnc',
                    width: 95,
                    renderer: formatearAcumuladaSNC
                }
            ],
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.selectionModel,
            tbar: [this.btnCertificarTodasNomina, this.btnElaborar, this.btnContabilizar, this.btnAprobarTodasNomina, this.btnExportarNomina, this.btnActualizar, 'Denominaci&oacute;n:', this.tfbuscar, this.btnBuscar,this.btnLimpiar/*, 'Persona:', this.tfbuscarpersona, this.btnBuscarPersona*/, '->', 'Modo vizualizar:', this.cbVisualizar, this.btnAyuda],
            keys: [
                {
                    key: 'b',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        scope.btnBuscar.handler();
                    }
                },
                {
                    key: 'h',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        scope.btnAyuda.handler();
                    }
                }
            ]
        });

        function formatearAcumulada(val) {
            if (val == 0) {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierreno.png" height=16 width=16 /></center>';
            } else {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierresi.png" height=16 width=16 /></center>';
            }
        };

        function formatearAcumuladaSNC(val) {
            if (val == 0) {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierreno.png" height=16 width=16 /></center>';
            } else {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierresi.png" height=16 width=16 /></center>';
            }
        };

        this.gpModelosPlantillas.selModel.on('rowdeselect', function (grid, n, o) {
            var selection = grid.getSelections();
            //Deshabilitando el boton exportar cuando la nomina esta desaprobada y no hay platillas nominales seleccionadas
            this.cant_plantillas_sel = selection.length;
            (scope.estadonominas == 0 && this.cant_plantillas_sel == 0) ? this.btnExportarNomina.disable() : this.btnExportarNomina.enable();

            var cont = 0;
            for (var k = 0; k < selection.length; k++) {
                if (selection[k]['data']['aprobada'] == 1) {
                    cont++;
                } else {
                    cont--;
                }
            }
            var acumuladocont = 0 - selection.length;
            if (cont == selection.length && cont != 0 && selection.length != 0) {
                //this.btnElaborar.enable();
            } else if (cont == acumuladocont && cont != 0 && selection.length != 0) {
            } else {
                //this.btnAprobarCertificar.disable();
                //this.btnElaborar.disable();
            }
        }.createDelegate(this));

        this.gpModelosPlantillas.selModel.on('rowselect', function (grid, n, o) {
            this.cant_plantillas_sel = grid.getSelections().length;
            //Deshabilitando el boton exportar cuando la nomina esta desaprobada y no hay platillas nominales seleccionadas
            (scope.estadonominas == 0 && this.cant_plantillas_sel == 0) ? this.btnExportarNomina.disable() : this.btnExportarNomina.enable();
        }.createDelegate(this));

        this.stModelosPlantillas.on('load', function (st, n, index) {
            var flagcertificar = 0;
            var flagaprobar = 0;
            var flagaprobada = 0;
            var flagacumularliquidar = 0;
            var flagacumvacsnc = 0;
            var flagcomprobante = 0;
            var flagactualizar = 0;
            var contstore = st.getCount();
            var todoselementos = st.getRange(0, contstore - 1);

            //Ciclo para verificar el estado de las nominas
            for (k = 0; k < contstore; k++) {
                if (todoselementos[k]['data']['aprobada'] == 0) {
                    flagcertificar = 1;
                }
                if (todoselementos[k]['data']['aprobada'] == -1) {
                    flagaprobar = 1;
                    flagactualizar = 1;
                }
                if (todoselementos[k]['data']['aprobada'] == 1) {
                    flagaprobada = 1;
                }
            }

            if (flagactualizar == 1) {
                //this.btnActualizar.enable();
            } else {
               // this.btnActualizar.disable();
            }

            //Ciclo para verificar el estado de las nominas
            for (k = 0; k < contstore; k++) {
                if (todoselementos[k]['data']['aprobada'] == 0 || todoselementos[k]['data']['aprobada'] == -1) {
                    flagacumularliquidar = 1;

                }
                if ((todoselementos[k]['data']['aprobada'] == 1)) {
                    if (todoselementos[k]['data']['acumulada'] == 0 || todoselementos[k]['data']['acumuladasnc'] == 0) {
                        flagacumvacsnc = 1;
                    }

                }
                if ((todoselementos[k]['data']['aprobada'] == 0)) {
                    flagcomprobante = 1;
                }
            }

            if (flagacumularliquidar == 1) {
                this.btnAcumularLiquidarVacacionesNomina.disable();
            } else {
                this.btnAcumularLiquidarVacacionesNomina.enable();
            }

            if (flagcomprobante == 1) {
                this.btnContabilizar.disable();
            } else {
                if (this.datosPeriodo.idcomprobanteoperaciones) {
                    this.btnContabilizar.enable();
                } else {
                    this.btnContabilizar.enable();
                }
                if (this.datosPeriodo.idcomprobantecancelacion) {
                    //this.btnContabilizarPagosIndebidos.enable();
                } else {
                    //this.btnContabilizarPagosIndebidos.enable();
                }
            }

            if (flagacumvacsnc == 1) {
                this.btnAcumularLiquidarVacacionesNomina.enable();
            } else {
                this.btnAcumularLiquidarVacacionesNomina.disable();
            }

            if (flagcertificar == 0) {
                this.btnElaborar.enable();
                this.btnCertificarTodasNomina.disable();

                //Habilitando el botón del talón de pago si las nóminas están al menos certificadas.
                //this.btnExportarNomina.menu.items.get('idtalondepago').enable();

            } else {
                //Estado elaborado
                this.btnCertificarTodasNomina.enable();
                this.btnElaborar.disable();
                this.estado = 'DESAPROBADAS';
                this.estadonomina = 0;

                //Deshabilitando el botón del talón de pago si las nóminas están desaprobadas.
                //this.btnExportarNomina.menu.items.get('idtalondepago').disable();
            }
            if (flagaprobar == 0) {
                this.btnAprobarTodasNomina.disable();
            } else {
                //Estado certificado
                this.btnAprobarTodasNomina.enable();
                this.estado = 'CERTIFICADAS';
                this.estadonomina = 0;
            }
            if (flagaprobada == 1) {
                //Estado aprobado
                this.btnElaborar.disable();
                this.estado = 'APROBADAS';
                this.estadonomina = 1;
            }
            if (this.cbVisualizar.getValue() == 2) {
                this.btnCertificarTodasNomina.disable();
                this.btnAprobarTodasNomina.disable();
                this.btnElaborar.disable();
            }

        }.createDelegate(this));

        this.pDatosModelosNomina = new Ext.Panel({
            title: 'Pre-N&oacute;minas',
            region: 'north',
            layout: 'border',
            border: false,
            split: true,
            height: 200,
            collapsible: true,
            items: [this.pDatosPeriodoPago, this.gpModelosPlantillas, this.pDescripcion]
        });

        this.stNomina = new Ext.data.GroupingStore({
            fields: ['id', 'plantillanominal'],
            sortInfo: {field: 'plantillanominal', direction: "ASC"},
            groupField: 'plantillanominal'
        });

        this.cmNomina = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: [
                {header: "Elementos...", width: 30, sortable: true, dataIndex: 'id'},
                {header: 'plantillanominal', width: 30, sortable: true, dataIndex: 'plantillanominal', hidden: true}
            ]
        });

        this.errores = null;

        this.buscarErrores = function (idp, idc) {
            if (this.errores.length != 0) {
                for (var idpers in this.errores) {
                    if (idpers == 'p' + idp) {
                        var arrP = this.errores[idpers];
                        for (var idcao in arrP) {
                            if (idcao == idc) {
                                return arrP[idcao];
                            }
                        }
                    }
                }
            }
            return new Array();
        }

        this.smpersonasnomina = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, rowIndex, r) {
                }.createDelegate(this),
                rowdeselect: function (sm, rowIndex, r) {

                }.createDelegate(this)
            }
        })

        //  this.summary = new Ext.grid.GroupSummary();

//grid para la suma
        this.gpNomina = new Ext.grid.GridPanel({
            id: 'this.gpNomina',
            store: this.stNomina,
            colModel: this.cmNomina,
            sm: this.smpersonasnomina,
            region: 'center',
            border: true,
            height: 400,
            split: true,
            stripeRows: true,
            hideBorders: true,
            loadMask: {msg: 'Cargando...'},
            autoScroll: true,
            resizable: true,
            // plugins: this.summary,
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
                /*forceFit: true,
                 showGroupName: false,
                 enableNoGroups: false,
                 hideGroupedColumn: true*/
            })/*,
             plugins: summaryComp*/, listeners: {
                cellclick: function (Grid, rowIndex, columnIndex, e) {
                    var record = Grid.getStore().getAt(rowIndex);
                    var fieldName = Grid.getColumnModel().getDataIndex(columnIndex);
                    var err = this.buscarErrores(record.data.id, fieldName);
                    if (err.length != 0) {
                        var str = "";
                        for (var i = 0; i < err.length; i++) {
                            str += err[i] + " <br>";
                        }
                        mostrarMensaje(3, str);
                    }

                }.createDelegate(this)
            }

        });

        this.on('show', function (win) {
            /* if(this.modovisualizar == 2){
             this.btnAprobarCertificar.disable();
             this.btnAprobar.disable();
             }*/

        });

        this.mascara = null;

        this.items = [this.pDatosModelosNomina, this.gpNomina];
        Pvd.Nomina.Nomina.winVisualizarNomina.superclass.initComponent.call(this);
    },
    setModoVista: function (modovista) {
        //this.modovisualizar = modovista;
    },
    CambiarDatos: function (datos) {
        this.datosPeriodo = datos;
        if (datos.modopago == 1) {
            this.plantillaDatos1.overwrite(this.pDatosPeriodoPago.body, this.datosPeriodo);
        } else {
            this.plantillaDatos2.overwrite(this.pDatosPeriodoPago.body, this.datosPeriodo);
        }

    },
    CambiarEntidad: function (pidentidad) {
        this.identidad = pidentidad;
    },
    SincronizarPlantillasModelos: function (modoview, estadonominas, actualizar) {
        this.CambiarTitulos(estadonominas);
        PVD.mostrarMascara('idmasksincronizar', 'Por favor espere…', 'Sincronizando la(s) nómina(s)');
        Ext.Ajax.request({
            timeout: 5000000000000000000000,
            url: '/pvd/nomina/index.php/nomina/sincronizarmodelosplantillasnomina',
            method: 'POST',
            params: {
                identidad: this.identidad,
                idelaborarpago: this.datosPeriodo.idelaborarpagos,
                idtipopago: this.datosPeriodo.idtipopago,
                fechapago: this.datosPeriodo.fechapago,
                actualizar: actualizar
            },
            callback: function (options, success, response) {
                PVD.ocultarMascara('idmasksincronizar');
                var respuesta = Ext.decode(response.responseText);
                this.direccionarchivo = respuesta.direccion;
                if (respuesta.codigo == 'NOPLANTILLAS') {
                    this.DeshabilitarComp();
                    this.stModelosPlantillas.removeAll();
                    mostrarMensaje(3, 'No existen plantillas nominales configuradas.');
                    return;
                } else if (respuesta.codigo == 'NOCONFMODELOS') {
                    this.DeshabilitarComp();
                    this.stModelosPlantillas.removeAll();
                    mostrarMensaje(3, 'No existen modelos de n&oacute;mina configurados.');
                    return;
                } else if (respuesta.codigo == 'NO-PERSONAS') {
                    this.DeshabilitarComp();
                    this.stModelosPlantillas.removeAll();
                    mostrarMensaje(3, 'Por favor adici&oacute;nele personas a este per&iacute;odo de pago.');
                    return;
                } else if (respuesta.codigo == 'NO-CAMPOS') {
                    this.DeshabilitarComp();
                    this.stModelosPlantillas.removeAll();
                    mostrarMensaje(3, 'Por favor adici&oacute;nele campos a este tipo de n&oacute;mina.');
                    return;
                } else if (respuesta.codigo == 'OK') {
                    this.HabilitarComp();
                    this.taReferencia.setValue(respuesta.descripcion);
                    if (actualizar == 1) {
                        var cont = this.stModelosPlantillas.getCount();
                        var todos = this.stModelosPlantillas.getRange(0, cont - 1);
                        this.GenerarNomina(todos, -1);
                    }
                }

                //this.modovisualizar = modoview;
                this.CargarPlantillasModelos(this.modovisualizar, this);
            }.createDelegate(this)
        });
    },
    LimpiarNomina: function () {
        var cmGrid = new Ext.grid.ColumnModel([
            {
                header: "Elementos...",
                width: 200,
                dataIndex: 'id',
                sortable: true
            },
            {header: "plantillanominal", hidden: true, dataIndex: 'plantillanominal', sortable: true}
        ]);
        var storeGrid = new Ext.data.GroupingStore({
            sortInfo: {field: 'id', direction: "ASC"},
            groupField: 'plantillanominal',
            reader: new Ext.data.JsonReader({
                    //totalProperty: "cantidad",
                    //autoLoad:true,
                    //root: "datos",
                    id: "id"
                },
                [
                    {name: 'id'},
                    {name: 'plantillanominal'}
                ])
        });
        this.gpNomina.reconfigure(storeGrid, cmGrid);
        this.gpNomina.doLayout();
    },
    ActivarColores: function (val, metaData, record, rowIndex, colIndex, store) {
        if (record.get('aprobada') == -1 && val != null) {
            return '<span style="color:blue;">' + val + '</span>';
        } else if (record.get('aprobada') == 1 && val != null) {
            return '<span style="color:green;">' + val + '</span>';
        } else {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    },
    MostrarPlantilla: function (val, metaData, record, rowIndex, colIndex, store) {
        var arrPlantilla = val.split("-");
        //val = arrPlantilla[1] + "-" + arrPlantilla[2];
        val = arrPlantilla[2];
        return val;
    },
    visualizar: function (respuesta) {

        this.errores = null;
        this.errores = respuesta.errores;
        var camposStore = new Array();

        var arrObjCM = new Array();
        arrObjCM[0] = this.smpersonasnomina;
        arrObjCM[1] = new Ext.grid.RowNumberer();
        arrObjCM[2] = {
            id: 'id',
            header: "ID",
            dataIndex: 'id',
            summaryType: 'count',
            sortable: true,
            hidden: true,
            hideable: false
        };

        var renderizarDatos = function (val, metadata, record, rowIndex, colIndex, store) {
            //var arrPlantilla = val.split("-");
            //val = arrPlantilla[1] + "-" + arrPlantilla[2];


            var fieldName = this.gpNomina.getColumnModel().getDataIndex(colIndex);

            var err = this.buscarErrores(record.data.id, fieldName);

            if (err.length != 0) {
                return '<center><span style="color:red;">' + val + '</span></center>';
            }
            else {
                return '<center><span style="color:green;">' + val + '</span></center>';
            }


        }.createDelegate(this)

        var mostrarPlantilla = function (val, metadata, record, rowIndex, colIndex, store) {
            var arrPlantilla = val.split("-");
            //val = arrPlantilla[1] + "-" + arrPlantilla[2];
            val = arrPlantilla[2];

            var fieldName = this.gpNomina.getColumnModel().getDataIndex(colIndex);

            var err = this.buscarErrores(record.data.id, fieldName);

            if (err.length != 0) {
                return '<center><span style="color:red;">' + val + '</span></center>';
            }
            else {
                return '<center><span style="color:green;">' + val + '</span></center>';
            }
        }.createDelegate(this)

        camposStore.push({name: 'id'});
        for (var i = 0; i < respuesta.campos.length; i++) {
            camposStore.push({name: respuesta.campos[i].indice});
            if (respuesta.campos[i].tipocampo != "1") {
                if (respuesta.campos[i].indice != "plantillanominal") {
                    arrObjCM.push({
                        header: respuesta.campos[i].denominacion,
                        dataIndex: respuesta.campos[i].indice,
                        hidden: !respuesta.campos[i].visible,
                        hideable: true,
                        sortable: true,
                        width: 100,
                        summaryType: 'sum',
                        tooltip: respuesta.campos[i].mostrarvalor,
                        renderer: renderizarDatos
                    });
                } else {
                    arrObjCM.push({
                        header: respuesta.campos[i].denominacion,
                        dataIndex: respuesta.campos[i].indice,
                        hidden: true,
                        hideable: true,
                        summaryType: 'count',
                        sortable: true,
                        width: 100,
                        tooltip: respuesta.campos[i].mostrarvalor,
                        //renderer: renderizarDatos
                        renderer: mostrarPlantilla
                    });
                }
            } else {
                if (respuesta.campos[i].indice != "plantillanominal") {
                    arrObjCM.push({
                        header: respuesta.campos[i].denominacion,
                        dataIndex: respuesta.campos[i].indice,
                        summaryType: 'count',
                        hideable: true,
                        sortable: true,
                        tooltip: respuesta.campos[i].mostrarvalor,
                        hidden: !respuesta.campos[i].visible,
                        width: 100
                    });
                } else {
                    arrObjCM.push({
                        header: respuesta.campos[i].denominacion,
                        dataIndex: respuesta.campos[i].indice,
                        hideable: true,
                        sortable: true,
                        summaryType: 'count',
                        hidden: true,
                        width: 100,
                        tooltip: respuesta.campos[i].mostrarvalor,
                        renderer: mostrarPlantilla
                    });
                }
            }
        }

        var st = new Ext.data.GroupingStore({
            reader: new Ext.data.JsonReader({
                fields: camposStore

            }),
            sortInfo: {field: 'id', direction: "ASC"},
            groupField: 'plantillanominal'
        });

        st.loadData(respuesta.valores);

        var cm = null;
        cm = new Ext.grid.ColumnModel(arrObjCM);

        this.gpNomina.reconfigure(st, cm);
        this.gpNomina.doLayout();

    },

    vizualizarviejo: function (respuesta) {
        var camposStore = new Array();

        var arrObjCM = new Array();
        arrObjCM[0] = new Ext.grid.RowNumberer();
        arrObjCM[1] = {
            id: 'id',
            header: "id",
            dataIndex: 'id',
            hidden: true,
            hideable: false
        };

        camposStore.push({name: 'id'});
        for (var i = 0; i < respuesta.campos.length; i++) {
            camposStore.push({name: respuesta.campos[i].indice});
            if (respuesta.campos[i].tipocampo != "1") {
                if (respuesta.campos[i].indice != "plantillanominal") {
                    arrObjCM.push({
                        header: respuesta.campos[i].denominacion,
                        dataIndex: respuesta.campos[i].indice,
                        //hidden: respuesta.campos[i].visible,
                        hideable: true,
                        renderer: function (val) {
                            if (val != "0.00") return '<center><span style="color:green;">' + val + '</span></center>';
                            else return "<center>" + val + "</center>";
                        }
                    });
                } else {
                    arrObjCM.push({
                        header: respuesta.campos[i].denominacion,
                        dataIndex: respuesta.campos[i].indice,
                        hideable: true,
                        hidden: true,
                        renderer: function (val) {
                            if (val != "0.00") return '<center><span style="color:green;">' + val + '</span></center>';
                            else return "<center>" + val + "</center>";
                        }
                    });
                }
            } else {
                if (respuesta.campos[i].indice != "plantillanominal") {
                    arrObjCM.push({
                        header: respuesta.campos[i].denominacion,
                        dataIndex: respuesta.campos[i].indice,
                        hideable: true,
                        renderer: function (val) {
                            return val;
                        }
                    });
                } else {
                    arrObjCM.push({
                        header: respuesta.campos[i].denominacion,
                        dataIndex: respuesta.campos[i].indice,
                        hideable: true,
                        hidden: true,
                        renderer: function (val) {
                            return val;
                        }
                    });
                }
            }

        }

        var recCampos = Ext.data.Record.create(camposStore);

        var storeGrid = new Ext.data.GroupingStore({
            sortInfo: {field: 'plantillanominal', direction: "ASC"},
            groupField: 'plantillanominal',
            reader: new Ext.data.ArrayReader({}, recCampos)
        });


        var d = new Array();

        for (var i = 0; i < respuesta.valores.length; i++) {
            var a = new Array();
            a.push(respuesta.valores[i].id);
            for (var j = 1; j < camposStore.length; j++) {
                eval("var v = respuesta.valores[i]." + (camposStore[j].name) + ";");
                a.push(v);
            }
            d.push(a);
        }

        storeGrid.loadData(d);

        var cmGrid = new Ext.grid.ColumnModel(arrObjCM);
        cmGrid.defaultSortable = true;

        this.gpNomina.reconfigure(storeGrid, cmGrid);
        this.gpNomina.doLayout();
    },
    GenerarNomina: function (datosPlantModelo, echo) {
        this.gpNomina.doLayout();
        this.mascara = new Ext.LoadMask(this.gpNomina.body, {msg: "Cargando..."});
        var winload = new Ext.PVD.comun.window.winLoad({
            title: 'Por favor espere...',
            mensaje: 'Generando la(s) nómina(s)'
        });
        this.mascara.show();
        var accion = '';
        var arrayidnomina = new Array();
        var arrayidplantillanominal = new Array();
        var arrayidconfmodelonomina = new Array();

        for (var i = 0; i < datosPlantModelo.length; i++) {
            arrayidnomina.push(datosPlantModelo[i]['data']['idnomina']);
            arrayidconfmodelonomina.push(datosPlantModelo[i]['data']['idconfmodelonomina']);
            arrayidplantillanominal.push(datosPlantModelo[i]['data']['idplantillanominal']);
        }
        if (echo == 0) {
            accion = 'GENERAR';
        } else if (echo == -1) {
            accion = 'CERTIFICAR';
            winload.showMask();
        } else if (echo == 1) {
            accion = 'APROBAR';
            winload.showMask();
        }

        Ext.Ajax.request({
            //timeout: 50000000,
            url: '/pvd/nomina/index.php/nomina/generarnomina',
            method: 'POST',
            params: {
                idelaborarpago: this.datosPeriodo.idelaborarpagos,
                identidad: this.identidad,
                modovisualizar: this.modovisualizar,
                idnomina: Ext.encode(arrayidnomina),
                idplantillanominal: Ext.encode(arrayidplantillanominal),
                direccion: this.direccionarchivo,
                referencia: this.taReferencia.getValue(),
                accion: accion,
                estado: this.estado
            },
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                //PVD.ocultarMascara('idmaskgennomina');
                //winload.hideMask();
                this.mascara.hide();
                if (accion == 'GENERAR') {
                    if (respuesta.codigo == 'ERRORES') {
                        mostrarMensaje(3, respuesta.errores);
                        return;
                    } else {
                        this.visualizar(respuesta);
                    }

                } else if (accion == 'CERTIFICAR') {
                    winload.hideMask();

                    if (respuesta.codigo == 'NO-SALDO-NEGATIVO') {
                        mostrarMensaje(3, 'Los saldos a liquidar en tiempo e importe de la persona <b>' + respuesta.persona + '</b>' +
                            ' son mayores que los acumulados en el <b>Submayor de vacaciones</b>, por favor elimine la persona en el ' +
                            '<b>Reporte de vacaciones</b> y vuelva a insertarla o recargue los valores del reporte.');
                        return;
                    }

                    if (respuesta.codigo == 'ERRORES') {
                        mostrarMensaje(3, respuesta.errores);
                        return;
                    }
                    if (respuesta.cobrosypagos == -1) {
                        mostrarMensaje(3, 'Las personas ' + respuesta.personas + ' no tienen contabilizadas la carga inicial en el submayor de retenciones');
                        return;
                    }
                    if (respuesta.codigovac == -1) {
                        if (respuesta.codigo == 'CERTIFICADA') {
                            mostrarMensaje(1, 'Las n&oacute;minas fueron certificadas satisfactoriamente');
                            this.estadonominas = -1;
                            if (respuesta.count > 0) {
                                mostrarMensaje(3, 'Los neto de la(s) persona(s) <b>' + respuesta.personas + '</b>' + ' se encuentra en cero.');
                            }
                        } else if (respuesta.codigo == 'ACTUALIZADA') {
                            mostrarMensaje(1, 'Las n&oacute;minas fueron actualizadas satisfactoriamente');
                            this.estadonominas = -1;
                        }
                    } else {
                        if (respuesta.codigovac == 1) {
                            if (respuesta.codigo == 'CERTIFICADA') {
                                mostrarMensaje(2, 'Las n&oacute;minas fueron certificadas satisfactoriamente', function (btn) {
                                    if (btn == 'ok') {
                                        mostrarMensaje(1, respuesta.textovac);
                                    }
                                });
                            }
                        } else {
                            mostrarMensaje(3, respuesta.textovac);
                        }

                    }
                    this.CargarPlantillasModelos(this.modovisualizar, this);
                } else if (accion == 'APROBAR') {
                    winload.hideMask();
                    if (respuesta.codigo == 'APROBADA') {
                        mostrarMensaje(1, 'Las n&oacuteminas fueron aprobadas satisfactoriamente');
                        this.estadonominas = 1;

                        //Actualizando cobros y pagos
                        var arrayidnomina = new Array();
                        for (var i = 0; i < datosPlantModelo.length; i++) {
                            arrayidnomina.push(datosPlantModelo[i]['data']['idnomina']);
                        }
                        //Si el modulo de nominas fija obligaciones en el modulo de cobros y pagos
                        if(this.datosPeriodo.cobroypago == 1){
                            PVD.mostrarMascara('actcobpagos', 'Por favor espere...', 'Actualizando los datos en el m&oacute;dulo de cobros y pagos');
                            Ext.Ajax.request({
                                timeout: 50000000,
                                url: 'actualizarCobrosyPagos',
                                method: 'POST',
                                params: {
                                    idelaborarpago: this.datosPeriodo.idelaborarpagos,
                                    identidad: this.identidad,
                                    arrayidnomina: Ext.encode(arrayidnomina)
                                },
                                callback: function (options, success, response) {
                                    PVD.ocultarMascara('actcobpagos');
                                    responseData2 = Ext.decode(response.responseText);
                                    if(responseData2 == 'ok'){
                                        mostrarMensaje(1, 'Los datos fueron actualizados correctamente en el m&oacute;dulo de cobros y pagos')
                                    }

                                }.createDelegate(this)
                            });
                        }
                        //this.acumularRegistroSalarioTiempoServicio(this.datosPeriodo, arrayidnomina, arrayidconfmodelonomina, echo);
                    } else if (respuesta.codigo == 'NO-ACTUALIZADA') {
                        mostrarMensaje(3, 'No se pudieron aprobar las n&oacute;minas. Por favor realize el reporte del pago de vacaciones correspondiente a este per&iacute;odo. Luego presione el bot&oacute;n actualizar para mostrar la liquidaci&oacute;n de las vacaciones');
                    } else if (respuesta.codigo == 'NO-CONFIG-VARIABLE-GLOBAL') {
                        mostrarMensaje(3, 'No se pudieron aprobar las n&oacuteminas. Faltan por configurar variables globales en la configuraci&oacute;n de la f&oacute;rmula del registro de salarios y tiempo de servicio');
                    } else if (respuesta.codigo == 'NODATOSPERSONASCERTIFICADOS') {
                        mostrarMensaje(3, 'No se pudieron aprobar las n&oacuteminas. Faltan los datos certificados de las personas. Por favor <b>descertifique</b>, <b>sincronice</b> y <b>certifique</b> las n&oacute;minas nuevamente');
                    }else if (respuesta.codigo == 'NO-CAMPOS-REGISTRO-SALARIO') {
                        mostrarMensaje(3, 'Por favor configure las f&oacute;rmulas de los indicadores del Registro de Salarios y Tiempo de Servicio');
                    }else if (respuesta.codigo == 'NO-CONTABILIZADA') {
                        mostrarMensaje(3, 'Por favor contabilice y postee el comprobante de operaciones');
                    }
                    this.CargarPlantillasModelos(this.modovisualizar, this);

                }
            }.createDelegate(this)
        });

    },
    ElaborarNomina: function () {
        var todoselementos = this.stModelosPlantillas.getRange(0, 0);
        var accion = todoselementos[0]['data']['aprobada'];

        this.mascara = new Ext.LoadMask(this.gpNomina.body, {msg: "Cargando..."});
        var winload = new Ext.PVD.comun.window.winLoad({
            title: 'Por favor espere...',
            mensaje: 'Desaprobando la(s) nómina(s)'
        });
        this.mascara.show();
        winload.showMask();
        //PVD.mostrarMascara('idmaskelaborar', 'Por favor espere…', 'Desaprobando la(s) nómina(s)');
        Ext.Ajax.request({
            //timeout: 5000000000000000000000,
            url: '/pvd/nomina/index.php/nomina/elaborarnomina',
            method: 'POST',
            params: {
                //arrnomina: Ext.encode(arrnomina),
                identidad: this.identidad,
                idelaborarpago: this.datosPeriodo.idelaborarpagos,
                causadesaprobacion: this.tfDescripDesaprobacion.getValue(),
                accion: accion
            },
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                winload.hideMask();
                this.mascara.hide();
                /*if(response){
                    PVD.ocultarMascara('idmaskelaborar');
                }*/
                if (respuesta.codigo == "OK") {
                    mostrarMensaje(1, "La n&oacute;mina ha sido pasada al estado de elaborada satisfactoriamente.");
                    this.estadonominas = 0;
                } else {
                    mostrarMensaje(3, respuesta.errores);
                    return;
                }
                this.LimpiarNomina();
                this.CargarPlantillasModelos(this.modovisualizar, this);
            }.createDelegate(this)
        });
    },
    acumularLiquidarVacacionesNomina: function (idelaborarpago) {
        PVD.mostrarMascara('idmaskacumularliquidar', 'Por favor espere…', 'Acumulando/Liquidando las vacaciones');
        Ext.Ajax.request({
            url: '/pvd/nomina/index.php/nomina/acumularLiquidarVacacionesNomina',
            timeout: 500000,
            method: 'POST',
            params: {
                idelaborarpago: idelaborarpago,
                identidad: this.identidad
            },
            callback: function (options, success, response) {
                PVD.ocultarMascara('idmaskacumularliquidar');
                var respuesta = Ext.decode(response.responseText);
                mostrarMensaje(respuesta.codigo, respuesta.texto);
                this.LimpiarNomina();
                this.CargarPlantillasModelos(this.modovisualizar);
            }.createDelegate(this)
        });
    },
    acumularRegistroSalarioTiempoServicio: function (datosperiodo, arrayidnomina, arrayidconfmodelonomina, estadonomina) {
        PVD.mostrarMascara('idmaskacumularregistrosalario', 'Por favor espere…', 'Acumulando el registro de salario y tiempo de servicio');
        Ext.Ajax.request({
            url: '/pvd/nomina/index.php/nomina/acumularRegistroSalarioTiempoServicio',
            timeout: 500000,
            method: 'POST',
            params: {
                identidad: this.identidad,
                idelaborarpago: datosperiodo.idelaborarpagos,
                idnomina: Ext.encode(arrayidnomina),
                modopago: datosperiodo.modopago,
                idconfmodelonomina: Ext.encode(arrayidconfmodelonomina)
            },
            callback: function (options, success, response) {
                PVD.ocultarMascara('idmaskacumularregistrosalario');
                var respuesta = Ext.decode(response.responseText);
                var tiponomina = '';
                var variables = '';
                if (respuesta == 'ok') {
                    mostrarMensaje(1, 'El registro de salarios y tiempo de servicio fue acumulado satisfactoriamente');
                    this.LimpiarNomina();
                    this.CargarPlantillasModelos(this.modovisualizar, this);
                    mostrarMensaje(1, "La(s) n&oacute;mina(s) ha(n) sido(s) aprobada(s) satisfactoriamente.");
                    this.CambiarTitulos(estadonomina);
                } else {
                    tiponomina = respuesta.split('->')[0];
                    variables = respuesta.split('->')[1];
                    if (variables.split(' , ').length > 1) {
                        mostrarMensaje(3, "Las configuraciones de los indicadores " + "<b>" + variables + "</b>" +
                            " del registro de salario y tiempo de servicio del tipo de n&oacute;mina " + "<b>" + tiponomina + "</b>" +
                            " no tienen configuradas expresiones matem&aacute;ticas.");
                        this.LimpiarNomina();
                        this.CargarPlantillasModelos(this.modovisualizar, this);
                        return;
                    } else {
                        mostrarMensaje(3, "La configuraci&oacute;n del indicador " + "<b>" + variables + "</b>" +
                            " del registro de salario y tiempo de servicio del tipo de n&oacute;mina " + "<b>" + tiponomina + "</b>" +
                            " no tiene configurada expresiones matem&aacute;ticas.");
                        this.LimpiarNomina();
                        this.CargarPlantillasModelos(this.modovisualizar, this);
                        return;
                    }
                }
            }.createDelegate(this)
        });
    },
    AprobarCertificarNomina: function (aprobadocertificado) {
        var winload = new Ext.PVD.comun.window.winLoad({
            title: 'Por favor espere...',
            mensaje: (aprobadocertificado == 1) ? 'Aprobando la(s) nómina(s)' : 'Certificando la(s) nómina(s)'
        });

        var arrayidnomina = new Array();
        var arrayidplantillanominal = new Array();
        for (var i = 0; i < datosPlantModelo.length; i++) {
            arrayidnomina.push(datosPlantModelo[i]['data']['idnomina']);
            arrayidplantillanominal.push(datosPlantModelo[i]['data']['idplantillanominal']);
        }

        //Se muestra la máscara de espera.
        winload.showMask();
        Ext.Ajax.request({
            url: '/pvd/nomina/index.php/nomina/aprobarcertificarnomina',
            timeout: 5000000000000000000000,
            method: 'POST',
            params: {
                identidad: this.identidad,
                modovisualizar: this.modovisualizar,
                idnomina: Ext.encode(arrayidnomina),
                idplantillanominal: Ext.encode(arrayidplantillanominal),
                accion: (aprobadocertificado == -1) ? 'CERTIFICAR' : 'APROBAR'
            },
            callback: function (options, success, response) {
                //Se oculta la máscara de espera.
                winload.hideMask();
                var respuesta = Ext.decode(response.responseText);

                if (respuesta.codigo == 'PLANTILLAS-SIN-CARGOS-ASOCIADOS') {
                    if (respuesta.campos > 1) {
                        mostrarMensaje(3, 'Las plantillas "' + '<b>' + respuesta.valores + '</b>' + '" no tienen cargos asociados.');
                    } else {
                        mostrarMensaje(3, 'La plantilla "' + '<b>' + respuesta.valores + '</b>' + '" no tiene cargos asociados.');
                    }
                    return;
                }

                if (respuesta.codigo == "OK") {
                    if (aprobadocertificado == 1) {
                        this.acumularRegistroSalarioTiempoServicio(this.datosPeriodo, arrayidnomina, arrayidconfmodelonomina);

                    } else {
                        this.acumularLiquidarVacacionesNomina(this.datosPeriodo.idelaborarpagos);
                        mostrarMensaje(1, "La(s) n&oacute;mina(s) ha(n) sido certificada(s) satisfactoriamente.");
                    }
                    this.certificadaaprobada = 1;
                } else if (respuesta.codigo == "YAAPROBADA") {
                    mostrarMensaje(3, "La plantilla nominal<b>" + respuesta.texto + "</b> ya esta aprobada/certificada.");
                    this.certificadaaprobada = 0;
                    return;
                } else if (respuesta.codigo == "NOPERMISO") {
                    mostrarMensaje(3, "No puede aprobar/certificar la n&oacute;mina seleccionada.");
                    this.certificadaaprobada = 0;
                    return;
                } else if (respuesta.codigo == "NOCARGO") {
                    mostrarMensaje(3, "La persona no tiene un cargo configurado.");
                    this.certificadaaprobada = 0;
                    return;
                } else if (respuesta.codigo == "NOPERSONA") {
                    mostrarMensaje(3, "El usuario no tiene una persona asignada a su perfil.");
                    this.certificadaaprobada = 0;
                    return;
                } else {
                    return;
                }
                this.LimpiarNomina();
                this.CargarPlantillasModelos(this.modovisualizar, this);
            }.createDelegate(this)
        });
    },
    CargarPlantillasModelos: function (modovisualizar, scope) {
        this.gpModelosPlantillas.enable();
        this.stModelosPlantillas.removeAll();
        this.stModelosPlantillas.baseParams.identidad = this.identidad;
        this.stModelosPlantillas.baseParams.modovisualizar = this.modovisualizar;
        this.stModelosPlantillas.baseParams.idelaborarpago = this.datosPeriodo.idelaborarpagos;
        this.stModelosPlantillas.baseParams.idtipopago = this.datosPeriodo.idtipopago;
        this.stModelosPlantillas.baseParams.fechainicioperiodo = this.datosPeriodo.fechainicioperiodo;
        this.stModelosPlantillas.baseParams.fechafinperiodo = this.datosPeriodo.fechafinperiodo;
        this.stModelosPlantillas.load({
            callback: function (r, options, success) {
                // var respuesta = Ext.decode(options.responseText);
                // console.log(r[0].data.aprobada);
                if (r[0].data.aprobada == 1 || r[0].data.aprobada == -1) {
                    scope.taReferencia.setDisabled(true);
                }
            }
        });
    },
    ExportarNomina: function (items, pepe) {
        //var s = this.gpModelosPlantillas.getSelectionModel().getSelected();
        if (items.text == "Pre-N&oacute;mina aprobada") {
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/nomina/exportarnomina?id=' + this.datosPeriodo.idelaborarpagos);
        } else if (items.text == "Anticipos Salariales") {
            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/nomina/exportarasm?id=' + this.datosPeriodo.idelaborarpagos);
        } else if (items.text == "Contabilizar subtotales") {

            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });

            winload.showMask();

            var iframecont = document.createElement("iframe");
            iframecont.src = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/nomina/exportarresultadonominal?id=' + this.datosPeriodo.idelaborarpagos + '&idtipopago=' + this.datosPeriodo.idtipopago;
            iframecont.style.display = 'none';
            that = this;
            iframecont.onload = function () {
                //PVD.ocultarMascara('rep01');
                winload.hideMask();
                //that.destroy();
            }
            document.body.appendChild(iframecont);
            //window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/nomina/exportarresultadonominal?id=' + this.datosPeriodo.idelaborarpagos + '&idtipopago=' + this.datosPeriodo.idtipopago);
            /*Ext.Ajax.request({
             url: '/pvd/nomina/index.php/nomina/exportarresultadonominal',
             method: 'POST',
             params: {
             id:this.datosPeriodo.idelaborarpagos,
             idtipopago:this.datosPeriodo.idtipopago,
             },
             callback: function (options,success,response){
             var respuesta = Ext.decode(response.responseText);
             if(respuesta.codigo == "OK"){
             window.open(respuesta.dir);
             }
             }.createDelegate(this)
             });*/
        } else {
            //window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/nomina/exportarresultadonominal?id=' + s.data.idelaborarpago);
        }

        /*var s = this.gpModelosPlantillas.getSelectionModel().getSelected();
         Ext.Ajax.request({
         url: '/pvd/nomina/index.php/nomina/exportarresultadonominal',
         method: 'POST',
         params: {
         id: s.data.idelaborarpago
         },
         callback: function (options,success,response){
         var respuesta = Ext.decode(response.responseText);
         if(respuesta.codigo == "OK"){
         window.open(respuesta.dir);
         }
         }.createDelegate(this)
         });*/
    },
    exportarComprobantesCentrosCosto: function (formato) {
        /*var winloadformato = new Ext.PVD.comun.window.winLoad({
         title: 'Por favor espere...',
         mensaje: 'Generando reporte'
         });

         winloadformato.showMask();
         that = this;
         var iframecontform = document.createElement("iframeform");
         iframecontform.src = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/nomina/exportarComprobanteCentrosCosto?formato=' + formato + '&idelaborarpagos=' + this.datosPeriodo.idelaborarpagos;
         iframecontform.style.display = 'none';

         iframecontform.onload = function () {
         //PVD.ocultarMascara('rep01');
         winloadformato.hideMask();
         //that.destroy();
         }
         document.body.appendChild(iframecontform);*/

        window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/nomina/exportarComprobanteCentrosCosto?formato=' + formato + '&idelaborarpagos=' + this.datosPeriodo.idelaborarpagos + '&identidad=' + this.identidad);

        Ext.Ajax.request({
            timeout: 50000000,
            url: 'exportarComprobanteCentrosCosto',
            method: 'POST',
            params: {
                formato: formato,
                idelaborarpagos: this.datosPeriodo.idelaborarpagos
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
            }.createDelegate(this)
        });
    },
    exportarComprobantesComprobacion: function (formato) {
        PVD.mostrarMascara('idmaskreporte', 'Por favor espere…', 'Exportando reporte.');
        Ext.Ajax.request({
            timeout: 500000,
            url: 'validarExistenAsociacionesCuentas',
            method: 'POST',
            params: {
                identidad: this.identidad,
                idelaborarpagos: this.datosPeriodo.idelaborarpagos
            },
            callback: function (options, success, response) {
                PVD.ocultarMascara('idmaskreporte');
                responseData = Ext.decode(response.responseText);
                //console.info(responseData);
                if (responseData == 'NO-CONFIG') {
                    mostrarMensaje(3, "Por favor configure la asociación de las cuentas contables en <b>Configuración general/Asociaci&oacute;n cuentas contables</b>, para este tipo de n&oacute;mina.");
                } else {
                    window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/nomina/exportarComprobanteComprobacion?' +
                        'formato=' + formato +
                        '&idelaborarpagos=' + this.datosPeriodo.idelaborarpagos +
                        '&identidad=' + this.identidad);
                }
            }.createDelegate(this)
        });
    },
    Buscador: function (txt) {
        //console.log(this.estadonominas)
        if (txt != '') {
            if (this.tfbuscar.isValid()) {
                /*Filtro del grouping store para plantillas nominales*/
                this.stModelosPlantillas.filter('plantillanominal', txt, true, false);
                if(this.estadonominas == 0){
                    this.btnCertificarTodasNomina.disable();
                }
                else if(this.estadonominas == -1){
                    this.btnAprobarTodasNomina.disable();
                    this.btnElaborar.disable();
                }
                
            }
        } else {
            this.stModelosPlantillas.clearFilter();
            if(this.estadonominas == 0){
                this.btnCertificarTodasNomina.enable();
                
                
            }
            else if(this.estadonominas == -1){
                this.btnAprobarTodasNomina.enable();
                this.btnElaborar.enable();
            }
        }
    }, BuscadorPersona: function (txt) {
        //console.info(this.stNomina);
        if (txt != '') {
            if (this.tfbuscarpersona.isValid()) {
                /*Filtro del grouping store para plantillas nominales*/
                this.stNomina.filter('', 'ALICIA', true, false);
            }
        } else {
            this.stNomina.clearFilter();
        }
    },
    fLoadDataComprobante: function (items, tipoContabilizacion, idelaborarpagos, personasseleccionadas, tipocomprobante, scopeidComprobante, datosPlantModelo, identidad) {
        if (items.text == "Contabilizar comprobante de operaciones") {
            var params = {
                tipoContabilizacion: tipoContabilizacion,
                idelaborarpago: this.datosPeriodo.idelaborarpagos,
                tipocomprobante: tipocomprobante,
                idtipopago: this.datosPeriodo.idtipopago

            };
        } /*else if (items.text == 'Contabilizar cuentas por cobrar') {
            var params = {
                tipoContabilizacion: tipoContabilizacion,
                idelaborarpago: this.datosPeriodo.idelaborarpagos,
                tipocomprobante: tipocomprobante,
                idtipopago: this.datosPeriodo.idtipopago

            };
        }*/
         else {
            var arraypersonas = new Array();
            for (var i = 0; i < personasseleccionadas.length; i++) {
                arraypersonas.push(personasseleccionadas[i].data.id);
            }

            var params = {
                tipoContabilizacion: tipoContabilizacion,
                idelaborarpago: this.datosPeriodo.idelaborarpagos,
                tipocomprobante: tipocomprobante,
                idtipopago: this.datosPeriodo.idtipopago,
                arraypersonasidcargosocupago: Ext.encode(arraypersonas)
            };
        }
        var winload = new Ext.PVD.comun.window.winLoad({
            title: 'Por favor espere...',
            mensaje: 'Contabilizando las n&oacute;minas'
        });
        winload.showMask();
        Ext.Ajax.request({
            timeout: 5000000000,
            url: 'loadDataComprobante',
            method: 'POST',
            params: params,
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                winload.hideMask();
                if (responseData.text == "HAY-PERSONAS-SIN-CENTROS-COSTO") {
                    mostrarMensaje(3, "La(s) persona(s) <b>" + responseData.elements + "</b> no tiene(n) asignado(as) un centro de costo.");
                } else if (responseData.text == "NO-OPERACION-NOMENCLADOR-TIPONOMINA") {
                    mostrarMensaje(3, "Por favor as&oacute;ciele una operaci&oacute;n contable a este tipo de n&oacute;mina.");
                } else if (responseData.text == "NO-MODELO-VALORES") {
                    mostrarMensaje(3, "Por favor as&oacute;cie las cuentas con los conceptos contables.");
                } else if (responseData.text == "NO-MODELO-CONTABLE") {
                    mostrarMensaje(3, "La operaci&oacute;n contable de este tipo de n&oacute;mina no tiene asociado un modelo contable.");
                } else if (responseData.text == "NO-CUENTA-CENTROCOSTO") {
                    mostrarMensaje(3, "El centro de costo <b>" + responseData.cc + "</b> no tiene asignado una cuenta de gasto.");
                } else if (responseData.text == "NO-CUENTA-CONCAT") {
                    mostrarMensaje(3, "No existe una cuenta contable aperturada por el concat: <b>" + responseData.concat + "</b>");
                } else if (responseData.text == 'NO-PERSONAS-COD-CONTABLE') {
                    mostrarMensaje(3, "Las personas: <b>" + responseData.texto + "</b>. no tienen asignado codigos contables");
                }else if (responseData.text == 'RESPONSABILIDAD-MATERIAL-NO-FIJADA-COBROS-PAGOS') {
                    mostrarMensaje(3, "Las retenciones de responsabilidad material no han sido fijadas en cobros y pagos desde el submayor de retenciones.");
                }else if (responseData.text == 'NOM-RETENCIONES-SIN-CUENTAS-CONTABLES') {
                    mostrarMensaje(3, "Por favor asociele cuantas contables a las retenciones: <b>" + responseData.retenciones + "</b> en el Nomenclador de Retenciones.");
                } else if (responseData == 'NO-COMPROBANTE-OPERACIONES-CANCELAR') {
                    mostrarMensaje(3, "El comprobante a cancelar no existe.");
                }else if (responseData.text == 'CONCEPTOS-CONTABLES-SIN-CUENTAS-CONTABLES') {
                    mostrarMensaje(3, "Por favor asociele una cuenta contable a los conceptos contables: <b>" + responseData.conceptocontable + "</b> .");
                }else if (responseData == 'COMPROBANTE-OPERACIONES-CANCELADO') {
                    mostrarMensaje(1, "El comprobante fue cancelado satisfactoriamente.");
                }else if (responseData == 'NO-CANCELAR-NOMINAS-APROBADAS') {
                    mostrarMensaje(3, "No puede cancelar el comprobante de n&oacute;minas aprobadas.");
                }else if (responseData == 'NO-CANCELAR-NOMINAS-DESAPROBADAS') {
                    mostrarMensaje(3, "No puede cancelar el comprobante de n&oacute;minas desaprobadas.");
                }else if (responseData.text == 'NOMINA-REINTEGRO-SIN-CAMPO-CONCEPTO-SALARIO') {
                    mostrarMensaje(3, "La N&oacute;mina de Reintegros no tiene configurada un campo de pago salario en Estructurar Modelos de N&oacute;mina. Por favor configurelo.");
                }else if (responseData.text == 'PERSONA-NOMINA-REINTEGRO-CON-MAS-SALDO-CUENTA-POR-PAGAR') {
                    mostrarMensaje(3, responseData.mensaje);
                }else {
                    Ext.Cont.Comprobante.init(responseData.idsubsistema, responseData.detalle, responseData.observacion, responseData.fechaContable, responseData.dataComprobante, responseData.idtipocomprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                        //Actualizando en elaborarpagos si es un comprobante de operaciones o un comprobante de cancelacion
                        var idtasa = responseData.dataComprobante[0].idtasa;
                        var idmoneda = responseData.dataComprobante[0].idmoneda;
                        var idoperacion = responseData.dataComprobante[0].idoperacion;
                        Ext.Ajax.request({
                            timeout: 50000000,
                            url: 'actualizarPeriodoPagoContabilizadoYComprobanteCentroCosto',
                            method: 'POST',
                            params: {
                                idelaborarpago: idelaborarpagos,
                                idComprobante: idComprobante,
                                tipocomprobante: tipocomprobante,
                                numComprobante: numComprobante
                            },
                            callback: function (options, success, response) {
                                responseData1 = Ext.decode(response.responseText);
                            }.createDelegate(this)
                        });
                        //Actualizando cobros y pagos cuando es un comprobante de operaciones y no uno de cancelacion
                        if (tipocomprobante == 1) {
			                if (idComprobante) {
                                mostrarMensaje(1, 'El comprobante fue posteado satisfactoriamente');
                                scopeidComprobante = idComprobante;
                                this.fireEvent('comprobantecontabilizado', idComprobante);
                        }
			        }
                    }).onClose(function () {
                        noWindow = true; //para indicar que se cerro la ventana
                    });
                }
            }.createDelegate(this)
        });
    },
    CambiarTitulos: function (estadonominas) {
        var text = (estadonominas != 1) ? 'Pre-n&oacute;mina' : 'N&oacute;mina';
        if (estadonominas != 1) {
            //Deshabilitando el boton exportar cuando la nomina esta desaprobada y no hay platillas nominales seleccionadas
            (estadonominas == 0 && this.cant_plantillas_sel == 0) ? this.btnExportarNomina.disable() : this.btnExportarNomina.enable();
            this.estadonominas = estadonominas;
            this.gpModelosPlantillas.setTitle('Plantillas y modelos de ' + text);
            this.pDatosModelosNomina.setTitle(text + 's');
            this.setTitle('Modelos de ' + text);
            this.btnExportarNomina.menu.items.items[0].setText('Modelo SC-4-01 Control Datos N&oacute;mina');
        } else {
            this.btnExportarNomina.enable();
            this.estadonominas = 1;
            this.gpModelosPlantillas.setTitle('Plantillas y modelos de ' + text);
            this.pDatosModelosNomina.setTitle(text + 's');
            this.setTitle('Modelos de ' + text);
            this.btnExportarNomina.menu.items.items[0].setText('Modelo SC-4-06 N&oacute;mina');
        }
        /*Deshabilitando el menu items Descuentos No Aplicados*/
        (estadonominas != 0) ? this.btnExportarNomina.menu.items.items[1].enable() : this.btnExportarNomina.menu.items.items[1].disable();

    },
    DeshabilitarComp: function () {
        this.btnCertificarTodasNomina.disable();
        this.btnAprobarTodasNomina.disable();
        this.btnExportarNomina.disable();
        this.cbVisualizar.disable();
        this.btnContabilizar.disable();
        this.tfbuscar.disable();
        this.btnBuscar.disable();
    },
    HabilitarComp: function () {
        this.cbVisualizar.enable();
        this.btnContabilizar.enable();
        this.tfbuscar.enable();
        this.btnBuscar.enable();
    },
    fShowComprobante: function (dataComprobante, idObjeto, detalle, observacion, tipoContabilizacion, fechacontable) {
        var idSubsistema = 7;
        var idTipoComprobante = 3;
        var arrayAnotaciones = [];
        var anexos = [];

        observacion = observacion;

        if (dataComprobante.length > 0) {
            var anexos = [];
            for (i = 0; i < dataComprobante.length; i++) {

                if (dataComprobante[i].anexo) {
                    anexos = [];

                    for (var k = 0; k < dataComprobante[i].anexo.length; k++) {
                        anexos.push(new Ext.Cont.Comprobante.Anexo({
                            idcentronivel: dataComprobante[i].anexo[k].idcentronivel,
                            centronivel: dataComprobante[i].anexo[k].centronivel,
                            idelementouobjeto: dataComprobante[i].anexo[k].idelementouobjeto,
                            elementouobjeto: dataComprobante[i].anexo[k].elementouobjeto,
                            importe: dataComprobante[i].anexo[k].importe
//                                importe: dataComprobante[i].anexo[k].importemb
                        }));
                    }

                }
                objAnotacion = new Ext.Cont.Comprobante.Anotacion({
                    numerodocumento: dataComprobante[i].numerodocumento,
                    iddocumento: dataComprobante[i].iddocumento,
                    cuenta: dataComprobante[i].concatcta,
                    idcuenta: dataComprobante[i].idcuenta,
                    moneda: dataComprobante[i].moneda,
                    idmoneda: dataComprobante[i].idmoneda,
                    idtasa: dataComprobante[i].idtasa,
                    idoperacion: dataComprobante[i].idoperacion,
                    tipo: dataComprobante[i].contabilidadAdicional //DETERMINA SI ES  CONTABILIDAD ADICIONAL 0|1
                });
                if (dataComprobante[i].debito)
                    objAnotacion.data.debito = dataComprobante[i].debito;
                if (dataComprobante[i].credito)
                    objAnotacion.data.credito = dataComprobante[i].credito;

                if (dataComprobante[i].anexo)
                    objAnotacion.data.anexos = anexos;
                arrayAnotaciones.push(objAnotacion);
            }
        }
        Ext.MessageBox.hide();
        Ext.Cont.Comprobante.init(idSubsistema, idTipoComprobante, detalle, observacion, fechacontable, arrayAnotaciones, idObjeto).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
            /* scope.loadMessageBox(scope.mascPrincipal);

             if (actionContabiliza == 'traspaso')
             scope.fAddTraspasoDuo(idComprobante, numComprobante, fechaComprobante, parametros, detalle, observacion);
             else if (actionContabiliza == 'traspasoavanzado')
             scope.fAddTraspasoAvanzadoDuo(idComprobante, numComprobante, fechaComprobante, parametros, detalle, observacion);
             else if (actionContabiliza == 'incobrable' || actionContabiliza == 'notaCredito' || actionContabiliza == 'contabilizar')
             scope.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, parametros);*/

        }).onClose(function () {
            /*if (!parametros.adicionarDuo)
             scope.objWindowsDuo = '';*/
        });
    }.createDelegate(this)
});

