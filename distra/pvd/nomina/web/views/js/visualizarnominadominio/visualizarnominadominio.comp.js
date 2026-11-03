/**
 Uso:Componente para visualizar los modelos de nomina por dominio

 * ---------------------------------------------

 * 25 de Junio de  2012 |   Nomina
 *

 * @extends Ext.Window
 * @xtype
 * @autor   Linea Capital Humano - Ing. Dainier Velazquez Labrada
 * @version 1.0.0
 */
Ext.ns('Pvd.Nomina.VisualizarNominaDominio')
Ext.QuickTips.init();
Pvd.Nomina.VisualizarNominaDominio.Utils = function () {
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
var utils = new Pvd.Nomina.VisualizarNominaDominio.Utils();
Ext.QuickTips.init();

Pvd.Nomina.VisualizarNominaDominio.winReporte = Ext.extend(Ext.Window, {
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
        Pvd.Nomina.VisualizarNominaDominio.winReporte.superclass.initComponent.call(this);
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
Pvd.Nomina.VisualizarNominaDominio.winCampos = Ext.extend(Ext.Window, {
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
        Pvd.Nomina.VisualizarNominaDominio.winCampos.superclass.initComponent.call(this);
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
            iframe.onload = function () {
                winload.hideMask();
                that.destroy();
            };
            document.body.appendChild(iframe);
        } else {
            mostrarMensaje(3, 'Las n&oacute;minas deben estar al menos certificadas.');
        }

    }
});


Pvd.Nomina.VisualizarNominaDominio.winVisualizarNomina = Ext.extend(Ext.Window, {
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
        this.layout = (this.layout ? this.layout : 'border');
        this.datosPeriodo = (this.datosPeriodo ? this.datosPeriodo : null);
        this.identidad = (this.identidad ? this.identidad : null);
        this.direccionarchivo = '';
        this.modovisualizar = 1;
        this.certificadaaprobada = 0;
        this.estado = '';
        this.idComprobante = 0;

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

        this.stModelosPlantillas = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/visualizarnominadominio/obtenermodelosplantillasnomina',
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

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: '',
            disabled: false,
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',

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

        /*this.cbVisualizar = new Ext.form.ComboBox({
            id: 'cbVisualizar',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            mode: 'local',
            readOnly: true,
            triggerAction: 'all',
            store: this.stVisualizar
        });*/

        /*this.cbVisualizar.on('select', function (st, rec, index) {
            if (rec.data.valor == 1) {
                this.modovisualizar = 1;
                this.CargarPlantillasModelos(this.modovisualizar, this);
            } else {
                this.modovisualizar = 2;
                this.CargarPlantillasModelos(this.modovisualizar, this);
            }
        }.createDelegate(this));*/

        this.btnBuscar.setHandler(function (tf, n) {
            this.Buscador(this.tfbuscar.getValue());
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
                    } else {
                    }
                    if (flagaprob == 0) {
                    } else {
                    }
                    if (contst != 0) {

                        this.GenerarNomina(selch.getSelections(), 0);
                    } else {
                        this.LimpiarNomina();
                    }
                }.createDelegate(this)
            }
        });


        this.ventanaTipoBusqueda = new Ext.Window({
            region: 'center',
            layout: 'fit',
            modal:true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
        });

        this.btnExportarNomina = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar datos de la nomina(<b>Alt+E</b>)',
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        id: 'idmodelos',
                        text: 'Modelo SC-4-01 Control Datos N&oacute;minas', handler: function (items, pepe){
                        var cont = scope.stModelosPlantillas.getCount();
                        var datosPlantModelo = scope.stModelosPlantillas.getRange(0, cont - 1);
                        var idelaborarpago = scope.datosPeriodo.idelaborarpagos;
                        var winReporteEvento = new Pvd.Nomina.VisualizarNominaDominio.winReporte({
                            idestructura: scope.identidad,
                            idelaborarpago: idelaborarpago,
                            estado: scope.estadonominas,
                            datosPlantModelo: datosPlantModelo,
                            direccion: scope.direccionarchivo,
                            seleccionados: scope.gpModelosPlantillas.getSelectionModel().getSelections()
                        });
                        winReporteEvento.show();    
                        }
                    },
                    {
                        disable: true,
                        id: 'iddescuentos',
                        text:'Descuentos No Aplicados', handler:function(items, pepe){
                        PVD.mostrarMascara('idmaskdescuentos', 'Por favor espere…', 'Generando reporte');
                        Ext.Ajax.request({
                            timeout:50000000,
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
                    },
                    {
                        id: 'idcamposespecificos',
                        text: 'Campos espec&iacute;ficos', handler: function (items, a) {
                        var winCampos = new Pvd.Nomina.VisualizarNominaDominio.winCampos({
                            identidad: scope.identidad,
                            idelaborarpagos: scope.datosPeriodo.idelaborarpagos,
                            estado: scope.estadonominas
                        });
                        winCampos.show();  
                    }
                }
                
                ]

            }
        });

        function mostrarVentanaEleccionFormatos() {
            scope.ventanaTipoBusqueda.show();
        }

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
            tbar: ['Denominaci&oacute;n:', this.tfbuscar, this.btnBuscar, this.btnExportarNomina,'->', /*'Modo vizualizar:', this.cbVisualizar,*/ this.btnAyuda],
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
            } else if (cont == acumuladocont && cont != 0 && selection.length != 0) {
            } else {

            }
        }.createDelegate(this));

        this.gpModelosPlantillas.selModel.on('rowselect', function (grid, n, o) {
            this.cant_plantillas_sel = grid.getSelections().length;
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

            if (flagcertificar == 0) {
            } else {
                //Estado elaborado
                this.estado = 'DESAPROBADAS';
                this.estadonomina = 0;
            }
            if (flagaprobar == 0) {
            } else {
                //Estado certificado
                this.estado = 'CERTIFICADAS';
                this.estadonomina = 0;
            }
            if (flagaprobada == 1) {
                //Estado aprobado
                this.estado = 'APROBADAS';
                this.estadonomina = 1;
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
            items: [this.pDatosPeriodoPago, this.gpModelosPlantillas]
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
        };

        this.smpersonasnomina = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, rowIndex, r) {
                }.createDelegate(this),
                rowdeselect: function (sm, rowIndex, r) {

                }.createDelegate(this)
            }
        })

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
                forceFit: true/*,
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

        this.mascara = null;

        this.items = [this.pDatosModelosNomina, this.gpNomina];

        Pvd.Nomina.VisualizarNominaDominio.winVisualizarNomina.superclass.initComponent.call(this);
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
            url: '/pvd/nomina/index.php/visualizarnominadominio/sincronizarmodelosplantillasnomina',
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
                    if (actualizar == 1) {
                        var cont = this.stModelosPlantillas.getCount();
                        var todos = this.stModelosPlantillas.getRange(0, cont - 1);
                        this.GenerarNomina(todos, -1);
                    }
                }
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
        } else if (echo == 1) {
            accion = 'APROBAR';
        }
        if (accion == 'CERTIFICAR' || accion == 'APROBAR') {
            winload.showMask();
        }
        Ext.Ajax.request({
            timeout: 50000000,
            url: '/pvd/nomina/index.php/visualizarnominadominio/generarnomina',
            method: 'POST',
            params: {
                idelaborarpago: this.datosPeriodo.idelaborarpagos,
                identidad: this.identidad,
                modovisualizar: this.modovisualizar,
                idnomina: Ext.encode(arrayidnomina),
                idplantillanominal: Ext.encode(arrayidplantillanominal),
                direccion: this.direccionarchivo,
                accion: accion,
                estado: this.estado
            },
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
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
                    } else if (respuesta.codigo == 'NO-ACTUALIZADA') {
                        mostrarMensaje(3, 'No se pudieron aprobar las n&oacute;minas. Por favor realize el reporte del pago de vacaciones correspondiente a este per&iacute;odo. Luego presione el bot&oacute;n actualizar para mostrar la liquidaci&oacute;n de las vacaciones');
                    } else if (respuesta.codigo == 'NO-CONFIG-VARIABLE-GLOBAL') {
                        mostrarMensaje(3, 'No se pudieron aprobar las n&oacuteminas. Faltan por configurar variables globales en la configuraci&oacute;n de la f&oacute;rmula del registro de salarios y tiempo de servicio');
                    } else if (respuesta.codigo == 'NODATOSPERSONASCERTIFICADOS') {
                        mostrarMensaje(3, 'No se pudieron aprobar las n&oacuteminas. Faltan los datos certificados de las personas. Por favor <b>descertifique</b>, <b>sincronize</b> y <b>certifique</b> las n&oacute;minas nuevamente');
                    }
                    this.CargarPlantillasModelos(this.modovisualizar, this);
                }
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
            }
        });
    },
    Buscador: function (txt) {
        if (txt != '') {
            if (this.tfbuscar.isValid()) {
                this.stModelosPlantillas.filter('plantillanominal', txt, true, false);
            }
        } else {
            this.stModelosPlantillas.clearFilter();
        }
    },
    CambiarTitulos: function (estadonominas) {
        var text = (estadonominas != 1) ? 'Pre-n&oacute;mina' : 'N&oacute;mina';
        if (estadonominas != 1) {
            this.estadonominas = estadonominas;
            this.gpModelosPlantillas.setTitle('Plantillas y modelos de ' + text);
            this.pDatosModelosNomina.setTitle(text + 's');
            this.setTitle('Modelos de ' + text);
        } else {
            this.estadonominas = 1;
            this.gpModelosPlantillas.setTitle('Plantillas y modelos de ' + text);
            this.pDatosModelosNomina.setTitle(text + 's');
            this.setTitle('Modelos de ' + text);
        }
    },
    DeshabilitarComp: function () {
        // this.cbVisualizar.disable();
        this.tfbuscar.disable();
        this.btnBuscar.disable();
    },
    HabilitarComp: function () {
        // this.cbVisualizar.enable();
        this.tfbuscar.enable();
        this.btnBuscar.enable();
    }
});

