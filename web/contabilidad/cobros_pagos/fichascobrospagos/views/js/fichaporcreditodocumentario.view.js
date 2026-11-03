Ext.ns('Vista.Financiamientodoc');
Vista.Financiamientodoc.Controller = {
    init: function (fechaInicio,fechaFin) {
        Vista.Financiamientodoc.Controller.idfichatrabajo = 0;
        Vista.Financiamientodoc.Controller.iddoc = 0;
        function formatoMoneda(v){
                v=(Math.round((v-0)*100))/100;
                v=(v==Math.floor(v))?v+".00":((v*10==Math.floor(v*10))?v+"0":v);
                v=String(v);
                var ps=v.split(".");
                var whole=ps[0];
                var sub=ps[1]?"."+ps[1]:".00";
                var r=/(\d+)(\d{3})/;
                while(r.test(whole))
                    whole=whole.replace(r,"$1"+","+"$2");
                v=whole+sub;
                if(v.charAt(0)=="-")//caso saldo negativo
                    return"("+v.substr(1)+")" ;
                return v;
            }
        //var tipo_ficha = tipo_ficha;
        var scope = this;
        var arraygastos = new Array();
        var rowscheck = new Array();
        var arrayliquidar = new Array();
        this.seleccion = new Array();
        var totalliquidar = 0;
        var totalgastos = 0;

        this.model = Fichas.Store.Model;
        this.banderamod = false;

        this.lfTotal = new Ext.form.Label({
            id: 'lfTotal1',
            text: '',
            style: 'font-weight:bold;'
        });
        this.lfTotalgastos = new Ext.form.Label({
            id: 'lfTotal2',
            text: (scope.baderaselecion)?'otro':'',
            style: 'font-weight:bold;'
        });
            scope.lfTotal.setText('Total liquidar: '+totalliquidar)

        scope.stAddCuenta2 = new Ext.data.Store({
            url: 'loadDataCuenta',
            scope: this,
            listeners: {
                'beforeexpandnode': function(st, rec)
                {

                },
                'beforeload': function(store, options)
                {

                },
                'load': function(store, records, options) {
                    if (store.getCount() <= 0)
                    {
                        var msg="No existe cuenta asociada a este cliente-proveedor"
                        mostrarMensaje(1, msg);
                    }

                }
            },
            reader: new Ext.data.JsonReader({
                root: 'result',
                totalProperty: 'total',
            }, [{
                name: 'idcuenta'
            }, {
                name: 'nombrecuenta',
            },
                {
                    name: 'nombreterminopago',
                },
                {
                    name: 'idclienteproveedor',
                },
                {
                    name: 'idmoneda',
                },
            ]),
            autoLoad: false,

        });

        scope.gastos= new Ext.data.Store({

            url: 'loadGastos',
            scope: this,
            autoLoad: false,
            listeners: {
                'beforeexpandnode': function(st, rec)
                {

                },
                'beforeload': function(store, options)
                {
                    totalgastos = 0;
                    scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                },
                'load': function(store, records, options) {
                    var Store =  scope.Grid2.getStore()
                    for (var i = 0; i <Store.data.items.length ; i++) {
                        totalgastos +=parseFloat(Store.data.items[i].data.importe);
                    }
                    scope.lfTotalgastos.setText('Total gastos: '+totalgastos)

                }
            },
            reader: new Ext.data.JsonReader({
                    root: 'datos'
                },
                [{
                    name: 'numero'
                },
                    {
                        name: 'importe'
                    },
                    {
                        name: 'cuenta_gastos_acumulados'
                    },
                    {
                        name: 'concatcuentagastos'
                    },
                    {
                        name: 'idcuentagastos'
                    },
                    {
                        name: 'idcliente_proveedor'
                    },
                    {
                        name: 'cliente_proveedor'
                    }

                ]),

        });


        scope.stliquidacionProveedor= new Ext.data.Store({

            url: 'loadLiquidProveedor',
            scope: this,
            autoLoad: false,
            listeners: {
                'beforeexpandnode': function(st, rec)
                {

                },
                'beforeload': function(store, options)
                {
                    totalliquidar = 0;
                },
                'load': function(store, records, options) {
                    if (store.getCount() <= 0)
                    {
                        scope.lfTotal.setText('Total liquidar: '+totalliquidar)
                        var msg="Este Proveedor no tiene liquidaciones pendientes"
                        mostrarMensaje(1, msg);
                    }
                    else
                    {
                        for (var i = 0; i < store.data.items.length; i++) {
                            var monto;
                            if(store.data.items[i].data.montoreal =='')
                                monto = 0
                            else
                                monto=parseFloat(store.data.items[i].data.montoreal)
                            totalliquidar+=monto

                        }
                        scope.lfTotal.setText('Total liquidar: '+totalliquidar)
                    }

                }
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            },
                [{
                name: 'numero'
            },
                {
                    name: 'idclienteproveedorfiscal'
                },{
                    name: 'comentario'
                },
                {
                    name: 'clienteproveedor'
                },
                {
                    name: 'idcuenta'
                },
                {
                    name: 'concatcta'
                },
                {
                    name: 'importependiente'
                },
                {
                    name: 'liquidadomb'
                },
                {
                    name: 'idderechouobligacion'
                },
                {
                    name: 'montoreal'
                }
            ]),

        });


        scope.stAddCuentaTodas= new Ext.data.Store({

            url: 'loadDataTodasCuenta',
            scope: this,
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idcuenta',
                mapping: 'concatcuentagastos'
            },
                {
                    name: 'text'
                }
            ]),

        });



        scope.check = new Ext.grid.CheckboxSelectionModel();

        var scope = this
        scope.rowEditor = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            //saveTooltip: this.idioma.lbToolRowEditorAceptar,
            //cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });
        scope.rowEditor2 = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            //saveTooltip: this.idioma.lbToolRowEditorAceptar,
            //cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });

        this.rowactionDel = new Ext.grid.RowActions({
            id: 'idRowaction',
            widthSlope: 30,
            align: 'right',
            //header: "",
            actions: [
                {
                    id: 'eliminar',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'Eliminar',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16,
                    //hideIndex: 'shEliminar',
                    //textIndex: 'um'
                },
            ]
        });


        this.rowEditor2.on({

            afteredit: function(editor, grid, changes, record, rowIndex){
                var Store =  scope.Grid2.getStore()
                totalgastos=0;
                scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                for (var i = 0; i <Store.data.items.length ; i++) {
                    totalgastos+=parseFloat(Store.data.items[i].data.importe);
                }
                scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                var selecteds = scope.smoperacionnuevagastos.getSelections();
                if(selecteds.length == 0)
                {
                    valueaux=scope.cbprovgastos.getValue();
                    record.data.cliente_proveedor=scope.cbprovgastos.getRawValue();
                    record.data.idcliente_proveedor=valueaux;

                    valueaux=scope.cbcuentaprovgatos.getValue();
                    record.data.concatcuentagastos=scope.cbcuentaprovgatos.getRawValue();
                    record.data.idcuenta=valueaux;

                }
                else
                {
                    if(changes['cliente_proveedor']!=null)
                    {
                        valueaux=scope.cbprovgastos.getValue();
                        record.data.cliente_proveedor=scope.cbprovgastos.getRawValue();
                        record.data.idcliente_proveedor=valueaux;
                    }

                    if(changes['cuenta']!=null)
                    {
                        valueaux=scope.cbcuentaprovgatos.getValue();
                        record.data.cuenta=scope.cbcuentaprovgatos.getRawValue();
                        record.data.idcuenta=valueaux;
                    }



                }
                // scope.model.stfichas.commitChanges();
                scope.gastos.commitChanges();
                scope.smoperacionnuevagastos.clearSelections()
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                // if(record.data.idestado==8 ||  record.data.idestado==6)
                //     return true;
                // else
                //     return false;
            },
            canceledit: function (roweditor, grid, record, rowIndex) {
                // //view.smoperacion.clearSelections()
                // view.smoperacionnueva.clearSelections();

            },
        });

        scope.cbprovgastos = new Ext.form.ComboBox({
            id: 'idPvGastoscredito',
            anchor: '98%',
            fieldLabel: 'Proveedor:',
            allowBlank: false,
            forceSelection: true,
            disabled: false,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 2,
            store: this.stop = new Ext.data.JsonStore({
                url: 'getProveedores',
                root: 'datos',
                totalProperty: 'total',
                fields: [
                    {
                        name: 'idclientesproveedores'
                    }, {
                        name: 'nombre'
                    },{
                        name:'count'
                    }
                ]
            }),
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            autoLoad:false,
        });
        this.cbprovgastos.on({
            select : function (){
                scope.cbcuentaprovgatos.enable();
                scope.cbcuentaprovgatos.setValue('');


            }

        })

        scope.cbcuentaprovgatos = new Ext.contabilidad.util.linkedCombo({
            store: scope.stAddCuenta2,
            fieldLabel: 'Cuenta del proveedor',
            displayField: 'nombrecuenta',
            valueField: 'idcuenta',
            disabled: true,
            hideTbar: false,
            hideBbar: false,
            listHeight: 200,
            mode: 'local',
            loaded: true,
            id: 'cbxCuentagastoscredito',
            listeners:{
                expand: function (){
                    scope.stAddCuenta2.baseParams.id_prov = scope.cbprovgastos.getValue();
                    scope.stAddCuenta2.baseParams.tipocobrospagos = 2;
                    scope.cbcuentaprovgatos.reload();
                },
                select: function (cb, record){
                    scope.stAddCuenta2.baseParams.tipocobrospagos = '';
                    scope.stAddCuenta2.reload();
                }
            },
        });

        this.cmfinanciamientogastos = new Ext.grid.ColumnModel([
            {
                header: "Número",
                id:'Numero-financiamiento-gastos',
                dataIndex: 'numero',
                valueField: 'numero',
                align: 'right',
                width:82,
                editor:new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                    allowBlank: false,
                }),


            },
            {
                header: "Cliente/Proveedor",
                dataIndex: 'cliente_proveedor',
                valueField:'idcliente_proveedor',
                id:'Cliente/Proveedor-financiamiento-gastos',
                width:160,
                align: 'right',
                sortable: true,
                readOnly: true,
                editor:scope.cbprovgastos,


            },
            {
                header: "Cuenta",
                id:'Cuenta-financiamiento-gastos',
                dataIndex: 'concatcuentagastos',
                valueField: 'cuenta_gastos_acumulados',
                align: 'right',
                width:270,
                editor:scope.cbcuentaprovgatos,
            },{
                header: "Importe",
                id:'Importe-financiamiento-gastos',
                dataIndex: 'importe',
                valueField: 'importe',
                renderer: formatoMoneda(),
                align: 'right',
                width:100,
                editor:new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                }),
            },scope.rowactionDel

        ]);

        this.cmfinanciamientopago = new Ext.grid.ColumnModel([
            scope.check,
            {
                header: "Número",
                id:'Numero-financiamiento-pago',
                dataIndex: 'numero',
                valueField: 'numero',
                align: 'right',
                width:65,
            }, {
                header: "Cliente/Proveedor",
                dataIndex: 'clienteproveedor',
                valueField:'idclienteproveedorfiscal',
                id:'Cliente/Proveedor-financiamiento-pago',
                width:150,
                align: 'right',
                sortable: true,
                readOnly: true,


            },{
                header: "Detalle",
                dataIndex: 'comentario',
                valueField:'comentario',
                id:'Observacionfinanciamiento-pago',
                width:100,
                align: 'right',
                sortable: true,
                readOnly: true,


            }, {
                header: "Cuenta",
                id:'Cuenta-financiamiento-pago',
                dataIndex: 'concatcta',
                valueField: 'idcuenta',
                align: 'right',
                //renderer: formatoMoneda(),
                width:80,
            },{
                header: "Pendiente",
                id:'pendiente',
                dataIndex: 'importependiente',
                valueField: 'importependiente',
                renderer: formatoMoneda(),
                align: 'right',
                width:80,
            },{
                header: "A liquidar",
                id:'liquidar',
                dataIndex: 'montoreal',
                valueField: 'montoreal',
                renderer: formatoMoneda(),
                align: 'right',
                width:80,
                editor:new Ext.form.NumberField({
                    //allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                    disabled: false,
                }),
            },
            //scope.rowactionDel
        ]);

        this.smoperacionnuevaobligaciones = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.smoperacionnuevagastos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });


        this.btnAdicionarObligacion= new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar',
        });
        this.btnAdicionarGastoAcumulado= new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar',
        });

        this.recordgastos = Ext.data.Record.create([
            {name: 'idgastos', type: 'int'},
            {name: 'numero', type: 'int'},
            {name: 'cliente_proveedor', type: 'string'},
            {name: 'cuenta', type: 'sting'},
            {name: 'importe', type: 'int'},

        ]);


        scope.btnAdicionarGastoAcumulado.on({
            click: function(){
                scope.stAddCuentaTodas.baseParams.tipocuenta= 1;
                scope.stAddCuentaTodas.reload();
                scope.smoperacionnuevagastos.clearSelections();
                var recTal = new scope.recordgastos({
                    idgastos:0,
                    numero:'',
                    cliente_proveedor:'',
                    cuenta:'',
                    especialidad:'',
                    importe:'false',



                });
                scope.rowEditor2.stopEditing();
                scope.gastos.insert(0, recTal);
                scope.Grid2.getView().refresh();
                scope.rowEditor2.startEditing(0, 0);
                // view.cbOperacion.focus(true, 100);



            }
        })



        //***--------------Primera Fila del Formulario FINANCIAMIENTO RECIBIDO---------------------------------

        this.labelNoFicha= new Ext.form.TextField({
            fieldLabel:'No Ficha',
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'NoFicha',
            pageSize: 100,
            allowNegative: false,
            allowBlank: false,
            disabled : false,
            //tabIndex:4

        })
        this.cbFechaEmision = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfAddFechaEmision',
            fieldLabel: 'Fecha Emisión:', //'Fecha de emisi&oacute;n',
            name: 'fechaemision',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regexText: 'asdasdasd',
            readOnly: true,
            maxValue: fechaFin,
            minValue: fechaInicio,
            tabIndex: 100,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            anchor: '98%',
            format: 'd/m/Y',
            enableKeyEvents: true
        });
        this.sttipodoc = new Ext.data.JsonStore({
            url: 'loadDataAddDuo',
            root: 'tipoDocumentos',
            totalProperty: 'cantidad',
            autoLoad:true,
            fields: [
                {
                    name: 'iddoc'
                }, {
                    name: 'denominacion'
                }
            ]
        }),

        this.cbTipdocument = new Ext.form.ComboBox({
            id: 'idTipodoccredito',
            anchor: '98%',
            fieldLabel: 'Tipo Documento',
            allowBlank: false,
            forceSelection: true,
            disabled: false,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 2,
            store: this.sttipodoc,
            valueField: 'iddoc',
            displayField: 'denominacion',
            autoLoad:true,

            // tabIndex: 2
        });
        this.stoperacion = new Ext.data.JsonStore({
            url: 'loadDataOperacionesContablesLiquidacion',
            root: 'result',
            totalProperty: 'cantidad',
            autoLoad:true,
            fields: [
                {
                    name: 'idnomoperaciones'
                }, {
                    name: 'denominacion'
                }
            ],
        }),

        this.cboperation = new Ext.form.ComboBox({
            id: 'idTipoOpcredito',
            anchor: '98%',
            fieldLabel: 'Tipo operación:',
            allowBlank: false,
            forceSelection: true,
            disabled: false,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
           // pageSize: 100,
            minChars: 2,
            store:  this.stoperacion,
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            autoLoad:true,
            // tabIndex: 2
        });

        //--------------------------------Segunda fila del formulario---------------------------------------------------
        this.stproveedores = new Ext.data.JsonStore({
            url: 'getProveedores',
            root: 'datos',
            totalProperty: 'total',
            autoLoad:false,
            fields: [
                {
                    name: 'idclientesproveedores'
                }, {
                    name: 'nombre'
                },{
                    name:'count'
                }
            ]
        }),

        this.cbprov = new Ext.form.ComboBox({
                id: 'idPvcredito',
                anchor: '98%',
                fieldLabel: 'Proveedor:',
                allowBlank: false,
                forceSelection: true,
                disabled: false,
                disabledClass: 'disabled-component',
                mode: 'remote',
                triggerAction: 'all',
                enableKeyEvents: true,
                editable: true,
                pageSize: 100,
                minChars: 2,
                store: this.stproveedores,
                valueField: 'idclientesproveedores',
                displayField: 'nombre',
                //autoLoad:true,
            // tabIndex: 2
        });


        scope.cbprov.on({
            select : function (combo, record, index){
                // var idcuentas=new Array();
                // for (var i = 0; i < record.json.modelo.length; i++) {
                //     idcuentas.push(record.json.modelo[i].cuenta)
                // }
                scope.cbcuentaprov.enable();
                scope.cbcuentaprov.setValue('');
                scope.stliquidacionProveedor.baseParams.idclienteproveedor= scope.cbprov.getValue();
                scope.stliquidacionProveedor.baseParams.tipoDuo=1 ;
                scope.stliquidacionProveedor.baseParams.subordinadas=false ;
                scope.stliquidacionProveedor.baseParams.trabajador=false ;
                scope.stliquidacionProveedor.reload();

            }

        })

        // this.cbprovgastos.on({
        //     select : function (){
        //         scope.cbcuentaprovgatos.enable();
        //         scope.cbcuentaprovgatos.setValue('');
        //
        //
        //     }
        //
        // })
        //
        // scope.cbcuentaprovgatos = new Ext.contabilidad.util.linkedCombo({
        //     store: scope.stAddCuenta2,
        //     fieldLabel: 'Cuenta del proveedor',
        //     displayField: 'nombrecuenta',
        //     valueField: 'idcuenta',
        //     disabled: true,
        //     hideTbar: false,
        //     hideBbar: false,
        //     listHeight: 200,
        //     mode: 'local',
        //     loaded: true,
        //     id: 'cbxCuentagastoscredito',
        //     listeners:{
        //         expand: function (){
        //             scope.stAddCuenta2.baseParams.id_prov = scope.cbprovgastos.getValue();
        //             scope.stAddCuenta2.baseParams.tipocobrospagos = 2;
        //             scope.cbcuentaprovgatos.reload();
        //         },
        //         select: function (cb, record){
        //             scope.stAddCuenta2.baseParams.tipocobrospagos = '';
        //             scope.stAddCuenta2.reload();
        //         }
        //     },
        // });


        this.cbcuentaprov = new Ext.contabilidad.util.linkedCombo({

            fieldLabel: 'Cuenta del proveedor',
            displayField: 'nombrecuenta',
            valueField: 'idcuenta',
            allowBlank: false,
            disabled: true,
            hideTbar: false,
            hideBbar: false,
            listHeight: 200,
            tabIndex: 11,
            anchor: '98%',
            store: scope.stAddCuenta2,
            mode: 'local',
            loaded: true,
            id: 'cbxCuenta',
            listeners:{
                expand: function (){
                                scope.stAddCuenta2.baseParams.id_prov = scope.cbprov.getValue();
                                scope.stAddCuenta2.baseParams.tipocobrospagos = 1;
                                scope.cbcuentaprov.reload();
                            },
                            select: function (cb, record){
                                scope.stAddCuenta2.baseParams.tipocobrospagos = '';
                                scope.stAddCuenta2.reload();
                            }
            }
            // tabIndex: 2
        });
        this.labelNodoc= new Ext.form.TextField({
            fieldLabel:'No de documento',
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'NoDoc',
            pageSize: 100,
            allowNegative: false,
            selectOnFocus: true,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            //maxValue: 9999999999999,
            allowBlank: false,
            disabled : false,
            //tabIndex:4

        });
        //--------------------------------------------------Tercera Fila del Formulario-------------------------------------------------
        this.labelTasaapertura= new Ext.form.NumberField({
            fieldLabel:'Tasa de apertura',
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'TasadeApertura',
            pageSize: 100,
            allowNegative: false,
            maxValue: 9999999999999,
            allowBlank: false,
            disabled : false,
            //tabIndex:4

        });
        this.labelTasaactual= new Ext.form.NumberField({
            fieldLabel:'Tasa actual',
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'TasaActual',
            pageSize: 100,
            allowNegative: false,
            maxValue: 9999999999999,
            allowBlank: false,
            disabled : false,
            //tabIndex:4

        });
        this.labelImportotal= new Ext.form.NumberField({
            fieldLabel:'Importe Total',
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'NoFicha',
            pageSize: 100,
            allowNegative: false,
            maxValue: 9999999999999,
            allowBlank: false,
            disabled : false,
            //tabIndex:4

        })


        this.labelObservacion= new Ext.form.TextField({
            fieldLabel:'Observación',
            triggerAction: 'all',
            anchor: '99%',
            enableKeyEvents: true,
            editable: true,
            name: 'Observación',
            pageSize: 100,
            maxValue: 9999999999999,
            disabled : false,
            allowBlank: false,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            //tabIndex:4

        });

        this.pdatos = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            height: 150,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .1,
                    layout: 'form',
                    items: [scope.labelNoFicha]
                },{
                    columnWidth: .2,
                    layout: 'form',
                    items: [scope.cbFechaEmision]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [scope.cbTipdocument]
                }, {
                    columnWidth: .4,
                    layout: 'form',
                    items: [scope.cboperation]
                }]
            },
                {
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [scope.cbprov]
                    },{
                        columnWidth: .3,
                        layout: 'form',
                        items: [scope.cbcuentaprov]
                    },{
                        columnWidth: .2,
                        layout: 'form',
                        items: [scope.labelNodoc]
                    }]
                }
                , {
                    layout: 'column',
                    items: [{
                        columnWidth: 0.1,
                        layout: 'form',
                        items: [scope.labelTasaapertura]
                    },
                        {
                            columnWidth: 0.1,
                            layout: 'form',
                            items: [scope.labelTasaactual]
                        },
                        {
                            columnWidth: 0.1,
                            layout: 'form',
                            items: [scope.labelImportotal]
                        }
                        ,{
                        columnWidth: 0.7,
                        layout: 'form',
                        items: [scope.labelObservacion]
                    }


                    ]
                }]
        });
        this.filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            filters: [
                //{type: 'numeric', dataIndex: 'no_doc_string'},
                {type: 'string', dataIndex: 'concatcta'},
            ]
        });

        this.Grid1=new Ext.grid.EditorGridPanel({
            clicksToEdit: 2,
            singleSelect: false,
            loadMask: true,
            id: 'grid-obligpago',
            region: 'east',
            // height: Ext.lib.Dom.getViewHeight() * 0.5,
            // width: Ext.lib.Dom.getViewWidth() * 0.3,
            cm: scope.cmfinanciamientopago,
            sm: scope.check,
            store: scope.stliquidacionProveedor,
            plugins: [scope.filters],
            frame: true,
            bbar:['->',scope.lfTotal],
            listeners: {
                afteredit: function (e) {
                    rowscheck.push(e.row);
                    totalliquidar=0;
                    var Store =  scope.Grid1.getStore()
                    // if (!selectejerciciocerrado) {
                    for (var i = 0; i <Store.totalLength; i++) {
                        if(Store.data.items[i].data.montoreal =='')
                            var montofloat=0
                        else
                            montofloat = parseFloat(Store.data.items[i].data.montoreal)

                        totalliquidar +=montofloat;
                    }
                    scope.lfTotal.setText('Total liquidar: '+totalliquidar)


                },
                beforeshow:function ()
                {

                }
            }
        });

        this.Grid2=new Ext.grid.EditorGridPanel({
            clicksToEdit: 2,
            singleSelect: false,
            loadMask: true,
            id: 'grid-obligpagogastos',
            region: 'center',
            cm: scope.cmfinanciamientogastos,
            //width: 200,
            // height: Ext.lib.Dom.getViewHeight() * 0.5,
            // width: Ext.lib.Dom.getViewWidth() * 0.3,
            sm: scope.smoperacionnuevagastos,
            store:  scope.gastos,
            plugins:[scope.rowEditor2,scope.rowactionDel],
            tbar: [scope.btnAdicionarGastoAcumulado],
            frame: true,
            bbar:['->',scope.lfTotalgastos.setText('Total gastos:')],
            listeners: {
                afteredit: function (e) {
                    totalgastos=0;
                    var Store =  scope.Grid2.getStore()
                    // if (!selectejerciciocerrado) {
                    // for (var i = 0; i <Store.totalLength; i++) {
                    //     if(Store.data.items[i].data.montoreal =='')
                    //         var montofloat=0
                    //     else
                    //         montofloat = parseFloat(Store.data.items[i].data.montoreal)
                    //
                    //     totalliquidar +=montofloat;
                    // }
                   // scope.lfTotalgastos.setText('Total liquidar: '+totalliquidar)


                },
                beforeshow:function ()
                {
                }
            }
        });



        this.panel1 = new Ext.Panel({
            title: 'Desglose de obligaciones de cobro a liquidar',
            //idioma: params.idioma,
            //perfil: params.perfil,
            layout: 'fit',
            scope: this,
            // frame: true,
            border: false,
            // split: true,
            region: 'center',
            height:'50%',
            width: '50%',
            items:[scope.Grid1],
        });


        this.panel2 = new Ext.Panel({
            title: 'Cuenta de gastos acumulados',
            //idioma: params.idioma,
            //perfil: params.perfil,
            layout: 'border',
            region: 'east',
            border: false,
            // split: true,
            // frame: true,
            //title: "1",
            // collapsed: true,
            // collapsible: true,
            height:'50%',
            width: '51%',
            items:[scope.Grid2],
        });
        scope.panel3 = new Ext.Panel({
            //idioma: params.idioma,
            //perfil: params.perfil,
            layout: 'fit',
            scope: this,
            frame: true,
            border: false,
            split: true,
            region: 'north',
            height: Ext.lib.Dom.getViewHeight() * 0.2,
            //height:'50%',
            items:[scope.pdatos],
        });
        this.panelFinanciamientorecibido= new Ext.Panel({
            id: 'otro',
            frame: false,
            layout: 'border',
            height: 780,
            width:'100%',
            items: [scope.panel3, scope.panel2,scope.panel1 ]
        });



        scope.rowactionDel.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    //var selecteds = view.smoperacionnueva.getSelections();

                    mostrarMensaje(2, "Seguro que desea eliminar", function (btnPress) {
                        if (btnPress === 'ok') {

                                var seleccionado = scope.Grid2.getSelectionModel().getSelected();
                                scope.Grid2.getStore().remove(seleccionado);
                            var Store =  scope.Grid2.getStore()
                            totalgastos=0;
                            scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                            for (var i = 0; i <Store.data.items.length ; i++) {
                                totalgastos+=parseFloat(Store.data.items[i].data.importe);
                            }
                            scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                        }
                    });
                    scope.rowEditor2.stopEditing(true);
                    break;
            }
        });

        this.contabilizarDesagregacion = function () {
            var param = {
                tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                descripcion: 'Posteando depósito: ',};
            scope.fLoadDataComprobante(param);
        };

        this.fLoadDataComprobante = function (params) {
            var arrayIdDoc = [];
            var arrayIdDocPres = [];
            var fichasseleccion = [];
            fichasseleccion.push({
                id_operacion: this.cboperation.getValue(),
                tasa_apertura: this.labelTasaapertura.getRawValue(),
                tasa_actual: this.labelTasaactual.getRawValue(),
            });
            var este = fichasseleccion[0];
            arrayIdDoc.push(Vista.Financiamientodoc.Controller.iddoc);
            arrayIdDocPres.push(Vista.Financiamientodoc.Controller.iddoc);
            Ext.Msg.wait(/*this.idioma.lbLoadDataComprobante*/'Realizando Operacion', 'Realizando Operacion'/*this.idioma.lbEspere*/);
            params.arrayIdDoc = arrayIdDoc;

            Ext.Ajax.request({
                url: 'cargarcomprobante',
                method: 'POST',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    arrayIdDocPres: Ext.encode(arrayIdDocPres),
                    tipoContabilizacion: params.tipoContabilizacion,
                    tipocontabilizacionparacomprobante:1,
                    fichaseleccion: Ext.encode(este)
                    //idDocInst: params.idDocInst
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM) {
                        if (responseData.codM == -2) {
                            mostrarMensaje(1, this.idioma.msgCambioEstado);
                            Ext.MessageBox.hide();
                        }
                    } else{
                        scope.fShowComprobante(responseData, params);
                        Ext.MessageBox.hide();}
                }.bind(this)
            });
        };

        this.fShowComprobante = function (respData, params) {
            var idSubsistema = 6;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;
            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait("Guardando Comprobante", "Por favor espere...");
                if (params.tipoContabilizacion === 1)
                    scope.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params);
                else
                    this.guardarCancelacion(idComprobante, numComprobante, fechaComprobante, params);
            }.bind(this)).onClose(function () {
               // scope.scope.keyMap.enable();
                noWindow = true;//para indicar que se cerro la ventana
                this.btnPostearfichafinanciamiento.enable();
                //this.btnContatabDeposito.enable();
            }.bind(this));
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params, fnPostear) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarDeposito',
                params: {
                    no_doc: scope.labelNodoc.getValue(),
                    tipo_ficha:2,
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    seleccion: Ext.encode(this.seleccion),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,

                    //idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                },
                callback: function (options, success, response) {
                    // var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    scope.model.stfichas.reload();
                    mostrarMensaje(1, /*this.idioma.lbMsgContabilizado*/'Contabilizado ' + ' ' + numeroComprobante + '.');
                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                        this.model.stfichas.reload();
                    }
                    if (typeof fnPostear === 'function') {
                        fnPostear();
                    }
                }.bind(this)
            });
        };



        //**************--------------------WINDOWS FINANCIAMIENTO RECIBIDO---------------------------------**************************************
        scope.AddFichaporcredito = new Ext.Window({
            title: 'Adicionar ficha por credito documentario',
            id:'credito',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            maximized:true,
            resizable: true,
            //maximizable: true,
            frame: true,
            items: [scope.panelFinanciamientorecibido],
            buttons: [
                this.btncancelarfichafinanciamiento = new Ext.Button({
                    iconCls: 'cerrar',
                    text: 'Cancelar',
                    handler: function () {
                        // //this.GridConfig.resumeEvents();
                        scope.AddFichaporcredito.hide();
                        // this.model.store_desagregacion.baseParams.id_docpresupuesto = 0;
                        // this.model.store_desagregacion.reload();
                        // // this.GridConfig.removeAll();

                    }
                }),
                scope.btnAceptarfichafinanciamiento = new Ext.Button({
                    iconCls: 'aceptar',
                    disabled: false,
                    text: 'Aceptar',

                    handler: function () {
                        if (scope.pdatos.getForm().isValid() && scope.labelNoFicha.getValue() !='' && scope.labelNodoc.getValue() !='' && scope.labelObservacion.getValue() !='')
                        {
                            var idficha = 0;
                            for (var i = 0; i < scope.gastos.data.items.length ; i++) {
                                arraygastos.push(scope.gastos.data.items[i].data)
                            }
                            scope.check.clearSelections();
                            scope.check.selectRows(rowscheck);
                            for (var i = 0; i < scope.check.getSelections().length; i++) {
                                if(scope.check.getSelections()[i].data.montoreal>0)
                                    arrayliquidar.push(scope.check.getSelections()[i].data)
                            }
                            rowscheck.splice(0, rowscheck.length);

                            if(arrayliquidar.length <1 && arraygastos.length <1)
                            {
                                var msg="No existen datos relacionados con financiamiento recibisdo y gastos acumulados"
                                mostrarMensaje(6, msg);
                            }
                            else
                            {
                                Ext.Ajax.request({
                                    url: 'saveFichas',
                                    method: 'POST',
                                    params: {

                                        no_ficha: scope.labelNoFicha.getValue(),
                                        id_ficha: Vista.Financiamientodoc.Controller.idfichatrabajo,
                                        fecha_emision: scope.cbFechaEmision.getRawValue(),
                                        tipo_doc: scope.cbTipdocument.getValue(),
                                        id_operacion: scope.cboperation.getValue(),
                                        id_proveedor: scope.cbprov.getValue(),
                                        id_cuenta_proveedor: scope.cbcuentaprov.getValue(),
                                        no_doc: scope.labelNodoc.getValue(),
                                        tasa_actual: scope.labelTasaactual.getValue(),
                                        tasa_apertura: scope.labelTasaapertura.getValue(),
                                        importe_total: scope.labelImportotal.getValue(),
                                        observacion:scope.labelObservacion.getValue(),
                                        tipo_ficha:2,
                                        arraygastos: Ext.encode(arraygastos),
                                        arrayliquidar: Ext.encode(arrayliquidar),



                                    },
                                    callback: function (options, success, response) {
                                        var responseData = Ext.decode(response.responseText);
                                        arraygastos.splice(0, arraygastos.length);
                                        arrayliquidar.splice(0, arrayliquidar.length);
                                        if (responseData.codM == 1) {
                                            var msg="Los datos han sido Guardados correctamente..."
                                            mostrarMensaje(1, msg);
                                            scope.selecteds=undefined;
                                            Vista.Financiamientodoc.Controller.iddoc = responseData.iddoc;
                                            scope.btnConfirmarfichafinanciamiento.enable();
                                            scope.btnAceptarfichafinanciamiento.disable();
                                            scope.model.stfichas.reload();
                                            scope.stliquidacionProveedor.baseParams.iddoc = responseData.iddoc;
                                            scope.stliquidacionProveedor.reload();
                                            scope.stliquidacionProveedor.baseParams.iddoc = '';
                                            scope.gastos.reload();

                                            Ext.Msg.hide();
                                        }else if (responseData.codM == 2) {
                                            var msg="Número de ficha existente..."
                                            mostrarMensaje(3, msg);
                                        }
                                    }
                                });
                            }

                        }
                        else
                        {
                            var msg="Existen campos vacios"
                            mostrarMensaje(6, msg);
                        }

                    }
                }),
                scope.btnConfirmarfichafinanciamiento = new Ext.Button({
                    iconCls: 'confirmar',
                    disabled: true,
                    text: 'Confirmar',
                    handler: function () {
                        Ext.Ajax.request({
                            url: 'confirmarEstado',
                            method: 'POST',
                            params: {

                                ficha: scope.labelNoFicha.getValue(),

                            },
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.codM == 1) {
                                    var msg="Se realizó la operación con exito..."
                                    mostrarMensaje(1, msg);

                                    scope.btnConfirmarfichafinanciamiento.disable();
                                    scope.btnAceptarfichafinanciamiento.disable();
                                    scope.btnPostearfichafinanciamiento.enable();
                                    scope.model.stfichas.reload();
                                    Ext.Msg.hide();
                                }
                            }
                        });
                    }
                }),
                scope.btnPostearfichafinanciamiento = new Ext.Button({
                    text: 'Postear',
                    disabled: true,
                    iconCls: 'contabilidad',
                    handler: function () {
                        var msg ='Seguro que desea postear la operacion seleccionada.';
                        mostrarMensaje(2,msg, function (btnPress) {
                            if (btnPress === 'ok') {
                                scope.btnPostearfichafinanciamiento.disable();
                                scope.contabilizarDesagregacion();
                            }
                        }.bind(scope));
                    }
                }),
            ]
        });
    },


    getWindows: function (idfichabuscar,tipo_ficha, fecha_emision, observacion, no_ficha, no_doc, concatcuentaproveedor, concatproveedor, concatoperacion, concattipodoc, tipo_doc, id_operacion, id_proveedor,id_cuenta_proveedor,estado,iddocumento,tasa_actual,tasa_apertura,importe_total)
    {
        if(idfichabuscar)
        {
            this.filters.clearFilters();
            this.seleccion.splice(0, this.seleccion.length);
            this.seleccion.push({
                id_operacion:id_operacion,
                tipo_ficha:tipo_ficha,
                iddocumento:iddocumento,
                id_cuenta_proveedor:id_cuenta_proveedor,
                id_proveedor:id_proveedor,
                id_ficha:idfichabuscar,
                no_doc:no_doc
            });
            Vista.Financiamientodoc.Controller.iddoc = iddocumento;
            this.btnAceptarfichafinanciamiento.enable()
            this.btnConfirmarfichafinanciamiento.enable()
            Vista.Financiamientodoc.Controller.idfichatrabajo = idfichabuscar;
            //this.stoperacion.reload();
           // this.stproveedores.reload();
            this.labelNoFicha.setValue(no_ficha);
            //this.cbTipdocument.setRawValue(concattipodoc);
            this.cbTipdocument.setValue(tipo_doc);

           // this.cboperation.setRawValue(concattipodoc);
            this.cboperation.setValue(id_operacion);

           // var datosPerMod = {datos: [{idclientesproveedores: 1, nombre: 'nombre'}]};
            //this.stproveedores.loadData(datosPerMod);

            this.cbprov.store.loadData({datos: [{idclientesproveedores: id_proveedor, nombre: concatproveedor,count: 1 }]});
            this.cbprov.setValue(id_proveedor);
            this.cbcuentaprov.setValue(id_cuenta_proveedor,concatcuentaproveedor );
            this.stliquidacionProveedor.baseParams.noficha=no_ficha;
            this.stliquidacionProveedor.baseParams.idficha=idfichabuscar;
            this.stliquidacionProveedor.baseParams.idclienteproveedor=id_proveedor;
            this.stliquidacionProveedor.baseParams.tipoDuo=1;
            this.stliquidacionProveedor.reload();
            this.labelNoFicha.disable();
            this.cbFechaEmision.setValue(fecha_emision);
            this.labelTasaapertura.setValue(tasa_apertura);
            this.labelTasaactual.setValue(tasa_actual);
            this.labelImportotal.setValue(importe_total);
            this.labelNodoc.setValue(no_doc);
            this.labelObservacion.setValue(observacion);
            this.gastos.baseParams.ficha = idfichabuscar;
            this.gastos.baseParams.tipo_ficha = tipo_ficha;
            this.gastos.reload();

            if(estado=='Posteado' || estado=='Cancelado')
            {
                this.btnConfirmarfichafinanciamiento.hide();
                this.btnAceptarfichafinanciamiento.hide();
                this.btnPostearfichafinanciamiento.hide();
                this.btnPostearfichafinanciamiento.disable();
                this.panel3.disable();
                this.panel2.disable();
                this.panel1.disable();

            }
            else if(estado=='Confirmado')
            {
                this.btnConfirmarfichafinanciamiento.hide();
                this.btnAceptarfichafinanciamiento.hide();
                this.btnPostearfichafinanciamiento.show();
                this.btnPostearfichafinanciamiento.enable();
                this.panel3.disable();
                this.panel2.disable();
                this.panel1.disable();
            }
            else
            {
                this.btnConfirmarfichafinanciamiento.show();
                this.btnAceptarfichafinanciamiento.show();
                this.btnPostearfichafinanciamiento.show();
                this.btnPostearfichafinanciamiento.disable();
                this.panel3.enable();
                this.panel2.enable();
                this.panel1.enable();
            }
        }
        else
        {
            this.filters.clearFilters();
            Vista.Financiamientodoc.Controller.iddoc = 0;
            this.btnConfirmarfichafinanciamiento.show();
            this.btnAceptarfichafinanciamiento.show();
            this.btnPostearfichafinanciamiento.show();
            this.panel3.enable();
            this.panel2.enable();
            this.panel1.enable();

            this.btnAceptarfichafinanciamiento.enable()
            this.btnConfirmarfichafinanciamiento.disable()
            this.cbcuentaprov.setValue('');
            Vista.Financiamientodoc.Controller.idfichatrabajo = 0;
            this.stliquidacionProveedor.baseParams.noficha='';
            this.stliquidacionProveedor.baseParams.idficha='';
            this.stliquidacionProveedor.baseParams.idclienteproveedor='';
            this.stliquidacionProveedor.baseParams.tipoDuo=1;
            this.stliquidacionProveedor.reload();
            this.labelNoFicha.setValue('');
            this.labelTasaapertura.setValue(0);
            this.labelTasaactual.setValue(0);
            this.labelImportotal.setValue(0);
            this.labelNoFicha.enable();
            this.cbFechaEmision.setValue('');
            this.labelNodoc.setValue('');
            this.cboperation.setValue('');
            this.cbprov.setValue('');
            this.cbcuentaprov.setValue('');
            this.cbcuentaprov.disable();
            this.cbTipdocument.setValue('');
            this.labelObservacion.setValue('');
            this.gastos.baseParams.ficha = -1;
            this.gastos.baseParams.tipo_ficha = -1;
            this.gastos.removeAll();
            this.stliquidacionProveedor.removeAll();
            this.stliquidacionProveedor.reload();
            this.gastos.reload();

        }
        return this.AddFichaporcredito;
    },

}
