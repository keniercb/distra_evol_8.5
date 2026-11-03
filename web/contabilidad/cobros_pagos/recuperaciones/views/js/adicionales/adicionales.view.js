//Empaquetando el componente tipo Reportes.
Ext.ns('Copa.Reportes');

Copa.Reportes.View = {
    /**
     * Inicializar la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param model Modelo de la vista del componente Reportes
     */

    init: function (idioma, etiquetas, model) {
        var self = this;
        this.cambio = 1;
        this.mostrarVerDetalles = 0;
        this.tipoReporte = 'cpc';
        this.filaSeleccionada = null;
        this.idreporte = null;
        this.responseData;

        this.recordT = Ext.data.Record.create([
            {name: 'idreporte'},
            {name: 'denominacion'},
            {name: 'url'}
        ]);

        this.cuentasC = new this.recordT({idreporte: '1', denominacion: '<b>-- Cuentas por cobrar --</b>'});
        this.cuentasP = new this.recordT({idreporte: '2', denominacion: '<b>-- Cuentas por pagar --</b>'});
        this.conciliaciones = new this.recordT({idreporte: '3', denominacion: '<b>-- Conciliaciones --</b>'});
        this.prndientes = new this.recordT({idreporte: '4', denominacion: '<b>-- Importes pendientes --</b>'});
        this.listado = new this.recordT({idreporte: '5', denominacion: '<b>-- Listado de las cuentas --</b>'});
        this.todas = new this.recordT({idreporte: '6', denominacion: '<b>-- Todas de las cuentas --</b>'});

        // this.p1 = new this.recordT({idreporte: '80001', denominacion: 'ESTADO DE LAS CUENTAS POR COBRAR Y POR PAGAR SICF-Anexo 4'});
        // this.p2 = new this.recordT({idreporte: '80002', denominacion: 'INFORME DE LOS DA\xD1OS MATERIALES Y PERJUICIOS ECON\xD3MICOS CAUSADOS A LA PROPIEDAD DEL ESTADO SICF-Anexo 5'});
        // this.p3 = new this.recordT({idreporte: '80003', denominacion: 'RESUMEN DEL BALANCE DE ANTIGUEDAD DE LAS CUENTAS POR COBRAR'});

        this.p7 = new this.recordT({idreporte: '669', denominacion: 'TODAS LAS CUENTAS POR PAGAR'});
        this.p10 = new this.recordT({idreporte: '672', denominacion: 'TODAS LAS CUENTAS POR COBRAR'});
        this.p22 = new this.recordT({idreporte: '688-689', denominacion: 'SUBMAYOR DE CUENTAS POR PAGAR'});
        this.p23 = new this.recordT({idreporte: '686-687', denominacion: 'SUBMAYOR DE CUENTAS POR COBRAR'});
        this.p24 = new this.recordT({idreporte: '690-691', denominacion: 'SUBMAYOR DE COBROS ANTICIPADOS'});
        this.p25 = new this.recordT({idreporte: '692-693', denominacion: 'SUBMAYOR DE PAGOS ANTICIPADOS'});
        //BALANCE DE ANTIGUEDAD
        this.p32 = new this.recordT({idreporte: '80003', denominacion: 'BALANCE DE ANTIGUEDAD DE LAS CUENTAS POR PAGAR'});
        this.p33 = new this.recordT({idreporte: '80004', denominacion: 'BALANCE DE ANTIGUEDAD DE LAS CUENTAS POR COBRAR'});
        this.p35 = new this.recordT({idreporte: '80005', denominacion: 'BALANCE DE ANTIGUEDAD DE COBROS ANTICIPADOS'});
        this.p36 = new this.recordT({idreporte: '80006', denominacion: 'BALANCE DE ANTIGUEDAD DE PAGOS ANTICIPADOS'});

        // this.p4 = new this.recordT({idreporte: '666', denominacion: 'RELACION DE INCOBRABLE RESIDENCIAL'});
        // this.p5 = new this.recordT({idreporte: '667', denominacion: 'CUENTAS POR PAGAR POR ESPECIALIDAD'});
        // this.p6 = new this.recordT({idreporte: '668', denominacion: 'CUENTAS POR PAGAR POR PROVEEDORES'});
        // this.p8 = new this.recordT({idreporte: '670', denominacion: 'CUENTAS POR COBRAR POR ESPECIALIDAD'});
        // this.p9 = new this.recordT({idreporte: '671', denominacion: 'CUENTAS POR COBRAR POR CLIENTES'});
        // this.p11 = new this.recordT({idreporte: '675', denominacion: 'CERTIFICACION DE LAS CUENTAS POR PAGAR VENCIDAS POR MAS DE SEIS MESES'});
        // this.p12 = new this.recordT({idreporte: '676', denominacion: 'CONCILIACION DE CUENTAS POR PAGAR'});
        // this.p13 = new this.recordT({idreporte: '677', denominacion: 'CONCILIACION DE CUENTAS POR COBRAR'});
        // this.p15 = new this.recordT({idreporte: '678', denominacion: 'CONCILIACION DE COBROS FISCALES'});
        // this.p14 = new this.recordT({idreporte: '679', denominacion: 'CONCILIACION DE PAGOS FISCALES'});
        // this.p16 = new this.recordT({idreporte: '681', denominacion: 'CONCILIACION DE PAGOS ANTICIPADOS'});
        // this.p17 = new this.recordT({idreporte: '680', denominacion: 'CONCILIACION DE COBROS ANTICIPADOS'});
        // this.p18 = new this.recordT({idreporte: '682', denominacion: 'IMPORTE TOTAL DE CUENTAS POR PAGAR PENDIENTES'});
        // this.p19 = new this.recordT({idreporte: '683', denominacion: 'IMPORTE TOTAL DE CUENTAS POR COBRAR PENDIENTES'});
        // this.p20 = new this.recordT({idreporte: '684', denominacion: 'LISTADO DE CUENTAS POR COBRAR'});
        // this.p21 = new this.recordT({idreporte: '685', denominacion: 'LISTADO DE CUENTAS POR PAGAR'});
        // this.p26 = new this.recordT({idreporte: '697', denominacion: 'ANALISIS POR EDADES DE DEUDORES'});
        // this.p27 = new this.recordT({idreporte: '696', denominacion: 'ANALISIS POR EDADES DE ACREEDORES'});
        // this.p28 = new this.recordT({idreporte: '698', denominacion: 'ANTIGUEDAD DE ACREEDORES POR PARTIDAS PENDIENTES'});
        // this.p29 = new this.recordT({idreporte: '699', denominacion: 'ANTIGUEDAD DE DEUDORES POR PARTIDAS PENDIENTES'});
        // this.p30 = new this.recordT({idreporte: '694', denominacion: 'SUBMAYOR DE COBROS FISCALES'});
        // this.p31 = new this.recordT({idreporte: '695', denominacion: 'SUBMAYOR DE PAGOS FISCALES'});

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaRecuperaciones',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            tooltip: etiquetas.tooltipAyuda,
            text: etiquetas.lbAyuda
        });

        this.cbReportes = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbReportes',
            store: model.stReportes,
            fieldLabel: 'Reporte',
            allowBlank: false,
            displayField: 'denominacion',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            hiddenName: 'idreporte',
            valueField: 'idreporte',
            mode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            resizable: true,
            anchor: '100%',
            maxHeight: 420,
            editable: false
        });

        this.reportes = [['q'], ['qq']];

        this.cbxEntidad = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            allowBlank: false,
            fieldLabel: 'Entidad',
            tabIndex: 1
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'obtenerEntidadesParaBusqueda',
            autoLoad: false,
            tbar: [new Ext.Button({
                iconCls: 'deshabilitar amarillo',
                text: 'No Consolidar',
                id: 'btnNoConsolidar',
                hidden: true
            }), new Ext.Button({
                iconCls: 'habilitar amarillo',
                text: 'Consolidar',
                id: 'btnConsolidar',
                hidden: true
            })],
            singleSelect: false,
            reader: this.jrEntidad = new Ext.data.JsonReader({
                id: 'idestructurae',
                root: 'datos'
            }, [{
                name: '_parent',
                mapping: 'idestructuraepadre'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'text'
            }, {
                name: 'idestructurae'
            }, {
                name: 'id',
                mapping: 'idestructuracomun'
            }, {
                name: 'idestructuraepadre'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }])
        });
//
        this.cbxEjercicio = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            //allowBlank: false,
            fieldLabel: 'Ejercicio',
            tabIndex: 2
        }, {
            identificador: 'Ejercicio',
            displayText: 'Ejercicio',
            url: 'obtenerEjerciciosParaBusqueda',
            autoLoad: false,
            singleSelect: true,
            reader: this.jrEjercicio = new Ext.data.JsonReader({
                id: 'idejercicio',
                root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf',
                mapping: 'isLeaf'
            }, {
                name: 'text'
            }, {
                name: 'idejercicio'
            }, {
                name: 'nombre'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'inicio'
            }, {
                name: 'fin'
            }])
        });

        this.cbxPeriodo = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione',
            fieldLabel: 'Per&iacute;odo',
            tabIndex: 3
        }, {
            identificador: 'Periodo',
            displayText: 'Per&iacute;odo',
            url: 'obtenerPeriodosParaBusqueda',
            autoLoad: false,
            singleSelect: false,
            reader: this.jrPeriodo = new Ext.data.JsonReader({
                id: 'idperiodo',
                root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf',
                mapping: 'isLeaf'
            }, {
                name: 'text'
            }, {
                name: 'idperiodo'
            }, {
                name: 'nombre'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'idejercicio'
            }, {
                name: 'inicio'
            }, {
                name: 'fin'
            }, {
                name: 'apertura'
            }])
        });

        this.cbxEspecialidad = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            fieldLabel: 'Especialidad',
            tabIndex: 6
        }, {
            identificador: 'Especialidad',
            displayText: 'Especialidad',
            singleSelect: false,
            url: 'cargararbolespecialidades',
            reader: this.jrEspecialidad = new Ext.data.JsonReader({
                id: 'idespecialidad',
                root: 'datos'
            }, [{
                name: 'text',
                mapping: 'especialidad'
            }, {
                name: 'codigo',
                mapping: 'especialidad'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf',
                mapping: 'isLeaf'
            }])
        });

        this.cbxClienteProveedor = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            fieldLabel: 'Deudores - Acreedores',
            allowBlank: false,
            //hidden:true,
            tabIndex: 7
        }, {
            identificador: 'ClienteProveedor',
            displayText: 'Deudores - Acreedores',
            singleSelect: false,
            url: 'obtenerclientesprovedores',
            reader: this.jrClienteProveedor = new Ext.data.JsonReader({
                id: 'id',
                root: 'datos'
            }, [{
                name: 'text',
                mapping: 'nombre'
            }, {
                name: 'codigo',
                mapping: 'nombre'
            }, {
                name: 'id',
                mapping: 'id'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf',
                mapping: 'isLeaf'
            }])
        });

        Ext.apply(Ext.form.VTypes, {
            daterange: function (val, field) {
                var date = field.parseDate(val);
                var dispUpd = function (picker) {
                    var ad = picker.activeDate;
                    picker.activeDate = null;
                    picker.update(ad);
                };
                if (field.startDateField) {
                    var sd = Ext.getCmp(field.startDateField);
                    sd.maxValue = date;
                    if (sd.menu && sd.menu.picker) {
                        sd.menu.picker.maxDate = date;
                        dispUpd(sd.menu.picker);
                    }
                } else if (field.endDateField) {
                    var ed = Ext.getCmp(field.endDateField);
                    ed.minValue = date;
                    if (ed.menu && ed.menu.picker) {
                        ed.menu.picker.minDate = date;
                        dispUpd(ed.menu.picker);
                    }
                }
                return true;
            }
        });

        this.fechaInicio = new Ext.form.DateField({
            fieldLabel: 'Fecha Inicio',
            enableKeyEvents: true,
            tabIndex: 4,
            vtype: 'daterange',
            name: 'dfDesde',
            id: 'dfDesde',
            //endDateField : 'dfHasta',
            anchor: '100%',
            readOnly: false,
            format: 'd/m/Y',
            allowBlank: true
        });

        this.fechaFin = new Ext.form.DateField({
            fieldLabel: 'Fecha Fin',
            enableKeyEvents: true,
            vtype: 'daterange',
            //startDateField : 'dfDesde',
            tabIndex: 5,
            name: 'dfHasta',
            id: 'dfHasta',
            anchor: '100%',
            allowBlank: false,
            readOnly: true,
            format: 'd/m/Y'
        });

        this.btnAceptar = new Ext.Button({
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true,
            text: etiquetas.lbAceptar,
            tooltip: 'Aceptar configuraci&oacute;n y mostrar reporte'//etiquetas.ttAceptar
        });

        this.pReportes = new Ext.FormPanel({
            id: 'topPanel',
            autoHeight: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            layout: 'form',
            items: [{
//                    id: 'innerTop',
                labelAlign: 'top',
                layout: 'column',
                items: [{
                    columnWidth: .30,
                    style: 'margin: 0 0 0 10',
                    layout: 'form',
                    items: this.cbxEntidad
                }, {
                        columnWidth: .10,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: this.cbxEjercicio
                    }, {
                        columnWidth: .10,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: this.cbxPeriodo
                    }, {
                        columnWidth: .10,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: this.fechaInicio
                    }, {
                        columnWidth: .10,
                        style: 'margin: 0 0 0 10',
                        layout: 'form',
                        items: this.fechaFin
                    }, {
                        columnWidth: .30,
                        layout: 'form',
                        style: 'margin:0 10 0 10',
                        items: [this.cbReportes]
                    }]
            }],
            bbar: [this.btnAceptar, this.btnAyuda]
        });

        this.btnVistaPreliminar = new Ext.Button({
            id: 'btnVistaPreliminar',
            hidden: true,
            //icon: perfil.dirImg + 'abrir.png',
            iconCls: 'vistareporte',
            text: etiquetas.lbVistaPreliminar,
            tooltip: etiquetas.ttVistaPreliminar
        });

        this.btnAbrirComprobante = new Ext.Button({
            id: 'btnAbrirComprobante',
            hidden: true,
//            icon: perfil.dirImg + 'comprobante.png',
            iconCls: 'comprobante',
            text: etiquetas.textAbrir,
            tooltip: etiquetas.txtAbrirOp
        });

        this.stGestionarDuo = new Ext.data.GroupingStore({
            url: 'cargarDatosDesglose',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                id: 'idderechouobligacion',
                totalProperty: 'cantidad',
                root: 'datos'
            }, [{
                name: 'idderechouobligacion'
            }, {
                name: 'fechaemision'
            }, {
                name: 'fechaentrega'
            },  {
                name: 'numero'
            },  {
                name: 'comentario'
            }, {
                name: 'importemb',
                type: 'float'
            }, {
                name: 'pendienteliq',
                type: 'float'
            }, {
                name: 'pagadomb',
                type: 'float'
            }, {
                name: 'liquidadomb', type: 'float'
            }, {
                name: 'nombrecliente'
            }, {
                name: 'concatcta'
            }, {
                name: 'numcomprobante',
            }, {
                name: 'codigoiso'
            }, {
                name: 'edad'
            }, {
                name: 'plazo'
            }, {
                name: 'operacionDenom'
            }
            ]),
            sortInfo: {
                field: "nombrecliente",
                direction: "ASC"
            },
            groupField: 'nombrecliente'
        });

        this.gpGestionarDuo = new Ext.grid.GridPanel({
            frame: false,
            border: false,
            autoScroll: true,
            loadMask: new Ext.LoadMask(Ext.getBody(), {
                msg: 'Cargando desglose'
            }),
            id: 'gpGestionarDuo',
            autoExpandColumn: 'IdColComentario',
            store: self.stGestionarDuo,
            cm: new Ext.grid.ColumnModel([
                {
                    header: 'N&uacute;mero', //scope.etiquetas.lbNumDocumento,
                    dataIndex: 'numero',
                    width: 100,
                    align: 'left',
                    sortable: true,
                }, {
                    header: 'Fecha emisión',
                    width: 90,
                    align: 'left',
                    dataIndex: 'fechaemision',
                    sortable: true,
                    //hidden: true
                }, {
                    header: 'Fecha entrega',
                    hidden: true,
                    width: 90,
                    id: 'IdColFechaentrega',
                    dataIndex: 'fechaentrega',
                    hideable: false,
                    sortable: true,
                }, {
                    header: 'Acreedor/Deudor',
                    width: 250,
                    id: 'nombrecliente',
                    dataIndex: 'nombrecliente',
                    sortable: true,
                    hidden: true,
                    hideable: false,
                }, {
                    header: 'Detalle',
                    width: 200,
                    id: 'IdColComentario',
                    dataIndex: 'comentario',
                    sortable: true,
                    hideable: true,
                }, {
                    header: 'Cuenta',
                    dataIndex: 'concatcta',
                    width: 100,
                    sortable: true,
                }, {
                    header: 'Moneda',
                    dataIndex: 'codigoiso',
                    width: 60,
                    align: 'center',
                    sortable: true,
                }, {
                    header: 'Importe',
                    dataIndex: 'importemb',
                    align: 'right',
                    width: 100,
                    sortable: true,
                    renderer: formatoMoneda
                }, {
                    header: 'Liquidado',
                    dataIndex: 'liquidadomb',
                    align: 'right',
                    width: 100,
                    sortable: true,
                    renderer: formatoMoneda
                }, {
                    header: 'Pendiente',
                    dataIndex: 'pendienteliq',
                    align: 'right',
                    width: 100,
                    sortable: true,
                    renderer: formatoMoneda
                }, {
                    header: 'Antiguedad',
                    width: 80,
                    align: 'center',
                    dataIndex: 'edad',
                    sortable: true,
                }, {
                    id: 'comprobante',
                    header: 'Comprobante',
                    width: 100,
                    align: 'left',
                    dataIndex: 'numcomprobante',
                    sortable: true,
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idderechouobligacion',
                    id: 'idderechouobligacion'
                }
            ]),
            view: new Ext.grid.GroupingView({
                forceFit: false,
                groupTextTpl: "{[values.rs[0].data.nombrecliente]}"
            })
        });

        this.btnCerrarVentana = new Ext.Button({
            id: 'idbtnAceptarVentana',
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar la ventana'
        });

        this.btnVistaDesglose = this.btnVistaPreliminar.cloneConfig({hidden: false});

        //Ventana de adicionar y modificar.
        this.ventanaVerDetalles = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            height: 600,
            width: 1200,
            closable: true,
            autoValidate: true,
            validateDefault: true,
            constrain: true,
            resizable: true,
            layout: 'fit',
            items: [self.gpGestionarDuo],
            buttons: [self.btnVistaDesglose, self.btnCerrarVentana],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCerrarVentana.disabled) {
                            self.btnCerrarVentana.handler();
                        }
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarVentana.disabled) {
                            self.btnCancelarVentana.handler();
                        }
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarVentana.disabled) {
                            self.btnAplicarVentana.handler();
                        }
                    }
                }
            ],
            listener: {
                beforeshow: function (_this) {
                    self.btnAplicarVentana.disable();
                    self.btnCerrarVentana.disable();
                }
            }
        });

        this.btnVerDetalles = new Ext.Button({
            id: 'btnVerDetalles',
            disabled: true,
            hidden: true,
            iconCls: 'detalles',
            text: 'Ver detalles',
            tooltip: 'Permite visualizar el desglose del monto total'
        });

        this.pnlSouth = new Ext.FormPanel({
            layout: 'fit',
            region: 'center',
            frame: false,
            border: false,
            items: [this.gpDatosReporte = new Ext.grid.GridPanel({
                id: 'gpReportes',
                autoScroll: true,
                frame: false,
                layout: 'fit',
                border: false,
                sm: this.smDatosReporte = new Ext.grid.RowSelectionModel({
                    singleSelect: false
                }),
                store: this.stReportes = new Ext.data.SimpleStore({
                    fields: [],
                    data: [[]]
                }),
                columns: [],
                tbar: [this.btnVistaPreliminar, this.btnVerDetalles, this.btnAbrirComprobante],
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    ShowGroupName: true,
                    enableRowBody: true,
                    enableNoGroup: false,
                    enableGropingMenu: false,
                    hideGroupedColumn: true,
                    groupTextTpl: '{text}'
                    // groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Elementos" : "Elemento"]})'
                })
            })]
        });

        this.pGeneral = new Ext.Panel({
            layout: 'fit',
            frame: false,
            border: false,
            items: [this.pReportes]
        });

        this.vpServicios = new Ext.Viewport({
            id: 'viewport',
            layout: 'fit',
            items: [this.pGeneral]
        });
    }
};

Ext.QuickTips.init();
var perfil = window.parent.perfil;
perfil.etiquetas = Object();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        var etiquetas = Ext.decode(response.responseText);
        var model = Copa.Reportes.Model;
        model.init();

        var view = Copa.Reportes.View;
        view.init(perfil, etiquetas, model);

        var controller = Copa.Reportes.Controller;
        controller.init(etiquetas, view, model);
    }
});