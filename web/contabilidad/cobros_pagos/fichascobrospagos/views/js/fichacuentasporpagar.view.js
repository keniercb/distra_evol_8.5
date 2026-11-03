Ext.ns('Vista.Financiamientocuentasporpagar');
Vista.Financiamientocuentasporpagar.Controller = {
    init: function (fechaInicio,fechaFin) {
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
        var scope = this;
        var arrayfichas = new Array();
        var totalliquidar = 0;
        var totalgastos = 0;
        Vista.Financiamientodoc.Controller.id_cuentaspagar = 0;
        Vista.Financiamientodoc.Controller.id_doc = 0;

        this.smoperacionnuevagastos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.model = Fichas.Store.Model;

        this.lfTotalgastos = new Ext.form.Label({
            id: 'lfTotal2cuentaspagar',
            text: (scope.baderaselecion)?'otro':'',
            style: 'font-weight:bold;'
        });

       /* this.filtrosCuentasPagar = new Ext.grid.GridFilters({
            filters: [{
                type: 'string',
                dataIndex: 'numero'
            },
            //     {
            //     type: 'string',
            //     dataIndex: 'denominacion'
            // },
            //     {
            //         type: 'string',
            //         dataIndex: 'denominacionunidadmedida'
            //     },
            //     {
            //         type: 'numeric',
            //         dataIndex: 'valorsatisfaccion'
            //     },
            //     {
            //         type: 'numeric',
            //         dataIndex: 'demanda'
            //     },
            //     {
            //         type: 'numeric',
            //         dataIndex: 'deficits'
            //     },
            //     {
            //         type: 'numeric',
            //         dataIndex: 'porciento'
            //     },
            //     {
            //         type: 'list',
            //         options: ['Si', 'No'],
            //         dataIndex: 'distribuida'
            //     },
            //     {
            //         type: 'list',
            //         options: ['Si', 'No'],
            //         dataIndex: 'sustitucion'
            //     },
            //     {
            //         type: 'string',
            //         dataIndex: 'tiponomenclatura'
            //     },
            //     {
            //         type: 'string',
            //         dataIndex: 'especialidad'
            //     },
            //     {
            //         type: 'string',
            //         dataIndex: 'tipooperaciones'
            //     }, {
            //         type: 'string',
            //         dataIndex: 'municipios'
            //         // type: 'listado',
            //         // dataIndex: 'municipios',
            //         // idcombo: 'idmunicipio',
            //         // urlcb: '/planificacion/sidem/index.php/cmpsatisfacerdemanda/cargarMunicipioDemandaEntidad',
            //         // idstore: 'idmunicipio',
            //         // valueFieldcb: 'idmunicipio',
            //         // displayFieldcb: 'denominacion',
            //         // multiple: 1,
            //
            //     }, {
            //         type: 'string',
            //         dataIndex: 'provincias'
            //     },{
            //         type: 'numeric',
            //         dataIndex:'porcientoDist' ,
             //   }
                ]
        });*/

//        scope.lfTotal.setText('Total liquidar: '+totalliquidar)
        scope.cuentaspagar= new Ext.data.Store({

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
                    scope.lfTotalgastos.setText('Total: '+totalgastos)
                },
                'load': function(store, records, options) {
                    var Store =  scope.Grid2.getStore()
                    for (var i = 0; i <Store.data.items.length ; i++) {
                        totalgastos +=parseFloat(Store.data.items[i].data.importe);
                    }
                    scope.lfTotalgastos.setText('Total: '+totalgastos)

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
                    }

                ]),

        });
        this.stproveedoresGastos = new Ext.data.JsonStore({
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
                },{
                    name:'nombrecontrato'
                }
            ]
        }),

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

        scope.cbcuentaprovgatos = new Ext.contabilidad.util.linkedCombo({
            store: scope.stAddCuenta2,
            fieldLabel: 'Cuenta del proveedor',
            displayField: 'nombrecuenta',
            valueField: 'idcuenta',
            disabled: false,
            hideTbar: false,
            hideBbar: false,
            listHeight: 200,
            mode: 'local',
            loaded: true,
            id: 'cbxCuentaliquidacion',
            listeners:{
                expand: function (){
                    scope.stAddCuenta2.baseParams.id_prov = scope.smoperacionnuevagastos.selections.items[0].data.id_proveedor;
                    scope.stAddCuenta2.baseParams.tipocobrospagos = 2;
                    //scope.stAddCuenta2.reload();
                    scope.cbcuentaprovgatos.reload();
                },
                select: function (cb, record){

                }
            }
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
        scope.stGastosFichas= new Ext.data.Store({

            url: 'loadGastosFichas',
            scope: this,
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty:'total'
            }, [{
                name: 'concatcuemta',
            },
                {
                    name: 'cuenta_gastos_acumulados'
                },
            ]),

        });
        scope.stfichas_gastos= new Ext.data.Store({

            url: 'loadFicasporID',
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty:'total'
            }, [{
                name: 'id_ficha',
            },
                {
                    name: 'no_ficha'
                },{
                    name: 'iddocumento'
                },{
                    name: 'importe'
                },
            ]),

        });



        var scope = this
        scope.rowEditor2 = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            //saveTooltip: this.idioma.lbToolRowEditorAceptar,
            //cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });

        scope.cbprovcuentaspagareditor = new Ext.form.ComboBox({
            id: 'idcbprovcuentaspagar',
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
            store:scope.stproveedoresGastos,
            valueField: 'idclientesproveedores',
            displayField: 'nombrecontrato',
            autoLoad:true,
        });
        // scope.cbfichas = new Ext.form.ComboBox({
        //     id: 'idfichascuentaspagar',
        //     anchor: '98%',
        //     fieldLabel: 'Fichas',
        //     allowBlank: false,
        //     forceSelection: true,
        //     disabled: false,
        //     disabledClass: 'disabled-component',
        //     mode: 'remote',
        //     triggerAction: 'all',
        //     enableKeyEvents: true,
        //     editable: true,
        //    // pageSize: 100,
        //     minChars: 2,
        //     store:scope.stfichas_gastos,
        //     valueField: 'id_ficha',
        //     displayField: 'no_ficha',
        //     autoLoad:true,
        //     listeners: {
        //         select: function (cb, record) {
        //             Ext.Ajax.request({
        //                 url: 'loadFichasCuentasPagar',
        //                 method: 'POST',
        //                 params: {
        //
        //                     fichabuscar: record.data.id_ficha,
        //                     cuentagasto: scope.cbcuentaprov.getValue()
        //
        //                 },
        //                 callback: function (options, success, response) {
        //                     var responseData = Ext.decode(response.responseText);
        //                     scope.importegrid.setValue(responseData.datos[0].importe)
        //                     scope.documentogrid.setValue(responseData.datos[0].no_doc)
        //
        //
        //                 }
        //             });
        //         }
        //     }
        // });

        scope.importegrid = new Ext.form.NumberField({
            allowBlank: false,
            allowNegative: false,
            maxValue: 9999999999999,
            disable:true
        });
        scope.documentogrid = new Ext.form.NumberField({
            allowBlank: false,
            allowNegative: false,
            maxValue: 9999999999999,
            allowBlank: false,
            disable:true
        });

        scope.cbcuentaprovCuentasPagar = new Ext.contabilidad.util.linkedCombo({
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
            id: 'cbxCuentaCuentasPagar',
        });
        scope.importe_real = new Ext.form.NumberField({
            allowBlank: false,
            allowNegative: false,
            minValue: 1,
            maxValue: 9999999999999,
        });
        this.cbprovcuentaspagareditor.on({
            select : function (yo, record, index){

                scope.stAddCuenta2.baseParams.id_prov = scope.cbprovcuentaspagareditor.getValue();
                scope.cbcuentaprovCuentasPagar.reload();
                scope.stAddCuenta2.reload();
                scope.cbcuentaprovCuentasPagar.enable();
            }

        })

        this.cmfinanciamientoCuentasPagar = new Ext.grid.ColumnModel([
            {
                header: "Ficha",
                id:'Numero-financiamiento-CuentasPagar',
                dataIndex: 'no_doc_string',
                valueField: 'id_ficha',
                align: 'right',
                width:100,
                sortable:true,
                editor:new Ext.form.TextField({
                    allowBlank: false,
                    disabled: true,
                    store: scope.stcargarDesgloseobligaciones
                })},
            {
                header: "Importe gasto",
                id:'Importegasto-CuentasPagar',
                dataIndex: 'importe_pendiente',
                valueField: 'importe_pendiente',
                renderer: formatoMoneda(),
                align: 'right',
                width:100,
                sortable:true,
                editor:new Ext.form.TextField({
                    allowBlank: false,
                    disabled: true,
                    store: scope.stcargarDesgloseobligaciones
                })},

            {
                header: "Documento",
                id:'Doc-CuentasPagar',
                dataIndex: 'no_doc',
                valueField: 'no_doc',
                align: 'right',
                width:100,
                sortable:true,
                editor:new Ext.form.TextField({
                    allowBlank: false,
                    disabled: true,
                    store: scope.stcargarDesgloseobligaciones
                })},
            {
                header: "Acreedor",
                dataIndex: 'cliente_proveedor',
                valueField:'id_proveedor',
                id:'Cliente/Proveedor-cuentaspagar',
                width:340,
                align: 'right',
                sortable:true,
                editor:new Ext.form.TextField({
                    allowBlank: false,
                    disabled: true,
                    store: scope.stcargarDesgloseobligaciones
                })},
            {
                header: "Cuenta gastos acumulados",
                id:'Cuenta-financiamiento-CuentasPagar',
                dataIndex: 'concatcuentagastos',
                valueField: 'cuenta_gastos_acumulados',
                align: 'right',
                width:220,
                sortable:true,
                editor:new Ext.form.TextField({
                    allowBlank: false,
                    disabled: true,
                    store: scope.stcargarDesgloseobligaciones
                })},{
                header: "Cuenta liquidaci&oacute;n",
                id:'Cuenta-liquidar-CuentasPagar',
                dataIndex: 'concatcuentaliquidacion',
                valueField: 'idcuentaliquidacion',
                align: 'right',
                width:220,
                sortable:true,
                editor: scope.cbcuentaprovgatos,

            }

            ,{
                header: "Importe",
                id:'Importe2-financiamiento-CuentasPagar',
                dataIndex: 'importe_real',
                valueField: 'importe_real',
                renderer: formatoMoneda(),
                align: 'right',
                width:100,
                editor: scope.importe_real
            }

        ]);
        this.filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            local: false,
            filters: [
                {type: 'string', dataIndex: 'no_doc_string'},
                {type: 'string', dataIndex: 'concatcuentagastos'},
                {type: 'string', dataIndex: 'cliente_proveedor'}
            ]
        });

        this.btnAdicionarObligacion= new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar',
        });
        this.btnAdicionarGastoAcumulado= new Ext.Button({
            text: 'Adicionar',
            disabled: true,
            iconCls: 'adicionar',
        });

        this.recordgastos = Ext.data.Record.create([
            {name: 'idfichas_cuentaspagar', type: 'int'},
            {name: 'id_ficha', type: 'int'},
            {name: 'importe_pendiente', type: 'int'},
            {name: 'importe_real', type: 'int'},
            {name: 'no_doc', type: 'int'},
            {name: 'acreedor', type: 'int'},
            {name: 'cuenta_acreedor', type: 'int'},
            {name: 'cliente_proveedor', type: 'string'},
            {name: 'concatcuentagastos', type: 'string'},


        ]);


        scope.btnAdicionarGastoAcumulado.on({
            click: function(){
                // scope.stAddCuentaTodas.baseParams.tipocuenta= 1;
                // scope.stAddCuentaTodas.reload();
                scope.smoperacionnuevagastos.clearSelections();
                var recTal = new scope.recordgastos({
                    idfichas_cuentaspagar:0,
                    id_ficha:'',
                    importe_pendiente:'',
                    importe_real:'',
                    no_doc:'',
                    acreedor:'',
                    cuenta_acreedor:'',
                    cliente_proveedor:'',
                    concatcuentagastos:'',



                });
                scope.rowEditor2.stopEditing();
                scope.stcargarDesgloseobligaciones.insert(0, recTal);
                scope.Grid2.getView().refresh();
                scope.rowEditor2.startEditing(0, 0);
                // view.cbOperacion.focus(true, 100);



            }
        })



        //***--------------Primera Fila del Formulario FINANCIAMIENTO RECIBIDO---------------------------------

        this.labelNoFicha= new Ext.form.NumberField({
            fieldLabel:'No Ficha',
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'NoFicha',
            pageSize: 100,
            // allowNegative: false,
            maxValue: 9999999999999,
            //allowBlank: false,
            disabled : false,
            //tabIndex:4

        })
        this.cbFechaEmision = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfAddFechaEmisionCuentasPagar',
            fieldLabel: 'Fecha Emisión:', //'Fecha de emisi&oacute;n',
            name: 'fechaemision',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regexText: 'asdasdasd',
            readOnly: true,
            tabIndex: 100,
            maxValue: fechaFin,
            minValue: fechaInicio,
            allowBlank: false,
            blankText: 'Seleccione...', //'Este campo es obligatorio.',
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
            id: 'idTipodocCuentasPagar',
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
            id: 'idTipoOpCuentasPagar',
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

        // this.cboperation.on({
        //
        //     select : function (combo, record, index){
        //         //scope.stAddCuentaTodas.removeAll();
        //         var idcuentas=new Array();
        //         for (var i = 0; i < record.json.modelo.length; i++) {
        //             idcuentas.push(record.json.modelo[i].cuenta)
        //         }
        //         scope.stAddCuentaTodas.baseParams.arrayIdCuenta= Ext.encode(idcuentas);
        //         scope.stAddCuentaTodas.baseParams.tipocuenta= 0;
        //         scope.cbcuentaprov.reload();
        //         scope.cbcuentaprov.setValue('');
        //        // scope.stAddCuentaTodas.reload();
        //         scope.cbcuentaprov.enable();
        //
        //     }
        //
        // })

        // this.cbcuentaprov = new Ext.form.ComboBox({
        //
        //     fieldLabel: 'Cuenta de gastos acumulados',
        //     displayField: 'concatcuemta',
        //     valueField: 'cuenta_gastos_acumulados',
        //     disabledClass: 'disabled-component',
        //     disabled: false,
        //     listHeight: 200,
        //     minChars: 2,
        //     tabIndex: 11,
        //     anchor: '98%',
        //     store: scope.stGastosFichas,
        //     allowBlank: false,
        //     mode: 'remote',
        //     loaded: true,
        //     id: 'cbxCuentasPagar',
        //     triggerAction: 'all',
        //     enableKeyEvents: true,
        //     editable: true,
        //     listeners: {
        //         // specialkey: function (tf, e) {
        //         //     if (e.getCharCode() == Ext.EventObject.ENTER)
        //         //         scope.nfImporte.focus(true, 100);
        //         // },
        //         select: function (cb, record) {
        //           scope.btnAdicionarGastoAcumulado.enable();
        //           scope.stfichas_gastos.baseParams.idgastos = record.data.cuenta_gastos_acumulados
        //           scope.stfichas_gastos.reload();
        //         }
        //     }
        //     // tabIndex: 2
        // });
        this.labelNodoc= new Ext.form.TextField({
            fieldLabel:'No de documento',
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'NoDoc',
            pageSize: 100,
            // allowNegative: false,
            maxValue: 9999999999999,
            allowBlank: false,
            disabled : false,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            //tabIndex:4

        });
        //--------------------------------------------------Tercera Fila del Formulario-------------------------------------------------


        this.labelObservacion= new Ext.form.TextField({
            fieldLabel:'Observación',
            triggerAction: 'all',
            anchor: '99%',
            enableKeyEvents: true,
            editable: true,
            name: 'Observación',
            pageSize: 100,
            // allowNegative: false,
            maxValue: 9999999999999,
            //allowBlank: false,
            disabled : false,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            //tabIndex:4

        });

        this.pdatos = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            height: 150,
            items:[{

                layout: 'column',
                items: [
                    {
                    columnWidth: .3,
                    layout: 'form',
                    items: [scope.cbTipdocument]
                },
                    {
                    columnWidth: .2,
                    layout: 'form',
                    items: [scope.labelNodoc]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [scope.cboperation]
                }, {
                    columnWidth: .2,
                    layout: 'form',
                    items: [scope.cbFechaEmision]
                }]
            },
                {
                    layout: 'column',
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.labelObservacion]
                    },
                    ]
                }]
        });
        this.stcargarDesgloseobligaciones= new Ext.data.GroupingStore({

            url: 'cargarDesgloseobligaciones',
            scope: this,
            autoLoad: false,
            listeners: {
                'beforeload': function(store, options)
                {
                    totalgastos = 0;
                    scope.lfTotalgastos.setText('Total: '+totalgastos)
                },
                'load': function (store, records, options) {
                    var Store = scope.Grid2.getStore()
                    for (var i = 0; i < Store.data.items.length; i++) {
                        if(Store.data.items[i].data.importe_real)
                        totalgastos += parseFloat(Store.data.items[i].data.importe_real);
                    }
                    scope.lfTotalgastos.setText('Total: ' + totalgastos)

                }
            },
            reader: new Ext.data.JsonReader({
                    totalProperty: 'cantidad_filas',
                    root: 'datos'
                },
                [{
                    name: 'concatcuentagastos'
                },
                    {
                        name: 'cliente_proveedor'
                    },
                    {
                        name: 'importe_pendiente'
                    },
                    {
                        name: 'no_doc'
                    },
                    {
                        name: 'id_proveedor'
                    },
                    {
                        name: 'cuenta_gastos_acumulados'
                    },
                    {
                        name: 'importe_real'
                    },
                    {
                        name: 'numero'
                    },
                    {
                        name: 'id_ficha'
                    },
                    {
                        name: 'concatcuentaliquidacion'
                    }
                    ,
                    {
                        name: 'idcuentaliquidacion'
                    },
                    {
                        name: 'id_gastos_acumulados'
                    },{
                        name: 'no_doc_string'
                    },


                ]),
            sortInfo:{field: 'no_doc_string', direction: "ASC"},
            groupField:'no_doc_string',

        });
        this.pagingBar = new Ext.PagingToolbar({
            pageSize: 30,
            displayInfo: true,
            clearFilter: true,
            width:500,
            store: scope.stcargarDesgloseobligaciones,//this.model.stobteneragrupaciones,
            toggleHandler: function(btn, pressed){
                var as = this.Grid2.getView();
                as.showPreview = pressed;
                as.refresh();

            },
            listeners: {
                beforerender:function (){
                    scope.stcargarDesgloseobligaciones.baseParams.start = 0;
                    scope.stcargarDesgloseobligaciones.baseParams.limit = 30;
                    scope.stcargarDesgloseobligaciones.reload();

                }
            }
        });

        this.rowEditor2.on({

            afteredit: function(editor, grid, changes, record, rowIndex){
                var Store =  scope.Grid2.getStore()
                if(record.data.importe_real > record.data.importe_pendiente)
                {
                    var msg="El importe no puede ser mayor que el importe de gasto"
                    mostrarMensaje(6, msg);
                    scope.btnAdicionarGastoAcumulado.disable();
                    scope.btnAceptarfichafinanciamiento.disable();
                }
                else
                {
                    scope.btnAdicionarGastoAcumulado.enable();
                    scope.btnAceptarfichafinanciamiento.enable();
                }
                totalgastos=0;
                scope.lfTotalgastos.setText('Total: '+totalgastos)
                for (var i = 0; i <Store.data.items.length ; i++) {
                    totalgastos+=parseFloat(Store.data.items[i].data.importe_real);
                }
                scope.lfTotalgastos.setText('Total: '+totalgastos)
                var selecteds = scope.smoperacionnuevagastos.getSelections();
                if(selecteds.length == 0)
                {
                    valueaux=scope.cbcuentaprovgatos.getValue();
                    record.data.concatcuentaliquidacion=scope.cbcuentaprovgatos.getRawValue();
                    record.data.idcuentaliquidacion=valueaux;
                    record.data.importe_real=scope.importe_real.getValue();}
                else
                {

                    if(changes['concatcuentaliquidacion']!=null)
                    {
                        valueaux=scope.cbcuentaprovgatos.getValue();
                        record.data.concatcuentaliquidacion=scope.cbcuentaprovgatos.getRawValue();
                        record.data.idcuentaliquidacion=valueaux;
                    }
                    if(changes['importe_real']!=null)
                    {
                        if(record.data.importe_real > record.data.importe_pendiente)
                        {
                            var msg="El importe no puede ser mayor que el importe de gasto"
                            mostrarMensaje(6, msg);
                            scope.btnAdicionarGastoAcumulado.disable();
                            scope.btnAceptarfichafinanciamiento.disable();
                        }
                        else
                        {
                            totalgastos=0;
                            for (var i = 0; i <Store.data.items.length ; i++) {
                                if(Store.data.items[i].data.importe_real)
                                totalgastos+=parseFloat(Store.data.items[i].data.importe_real);
                            }
                            scope.lfTotalgastos.setText('Total: '+totalgastos)
                            scope.btnAdicionarGastoAcumulado.enable();
                            scope.btnAceptarfichafinanciamiento.enable();
                        }
                    }
                    // if(changes['concatcuentagastos']!=null)
                    // {
                    //     valueaux=scope.cbcuentaprovCuentasPagar.getValue();
                    //     record.data.concatcuentagastos=scope.cbcuentaprovCuentasPagar.getRawValue();
                    //     record.data.cuenta_acreedor=valueaux;
                    // }
                    if(changes['numero']!=null)
                    {
                        valueaux=scope.cbfichas.getValue();
                        record.data.numero=scope.cbfichas.getRawValue();
                        record.data.id_ficha=valueaux;
                    }



                }

                scope.stcargarDesgloseobligaciones.commitChanges();
                scope.smoperacionnuevagastos.clearSelections()
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {

            },
            canceledit: function (roweditor, grid, record, rowIndex) {

            },
        });

        this.Grid2=new Ext.grid.EditorGridPanel({
            clicksToEdit: 2,
            singleSelect: false,
            loadMask: true,
            id: 'grid-CuentasPagar',
            region: 'center',
            cm: scope.cmfinanciamientoCuentasPagar,
            //width: 200,
            // height: Ext.lib.Dom.getViewHeight() * 0.5,
            // width: Ext.lib.Dom.getViewWidth() * 0.3,
            sm: scope.smoperacionnuevagastos,
            store:  scope.stcargarDesgloseobligaciones,
            plugins:[scope.rowEditor2,scope.filters],
           // tbar: [scope.btnAdicionarGastoAcumulado],
            frame: true,
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Elementos" : "Elemento"]})'
            }),
            bbar:[scope.pagingBar,'->',scope.lfTotalgastos.setText('Total: '+totalgastos)],
            listeners: {
                afteredit: function (e) {
                    totalgastos=0;
                    var Store =  scope.Grid2.getStore()


                },
                beforeshow:function ()
                {
                }
            }
        });


        this.panel2 = new Ext.Panel({
            title: 'Desglose de Obligaciones',
            //idioma: params.idioma,
            //perfil: params.perfil,
            layout: 'border',
            region: 'center',
            border: false,
            // split: true,
            // frame: true,
            //title: "1",
            // collapsed: true,
            // collapsible: true,
            height:'50%',
            //width: '51%',
            items:[scope.Grid2],
        });
        scope.panel3 = new Ext.Panel({
            scope: this,
            frame: true,
            border: false,
            split: true,
            region: 'north',
            height: Ext.lib.Dom.getViewHeight() * 0.15,
            //height:'50%',
            items:[scope.pdatos],
        });
        this.panelFinanciamientorecibido= new Ext.Panel({
            id: 'panelCuentasPagar',
            frame: false,
            layout: 'border',
            height: 780,
            width:'100%',
            items: [scope.panel3, scope.panel2]
        });



        //**************--------------------WINDOWS FINANCIAMIENTO RECIBIDO---------------------------------**************************************
        scope.AddFichaporcredito = new Ext.Window({
            title: 'Adicionar cuentas por pagar por ficha',
            width: '100%',
            // height: 700,
            //layout: 'fit',
            id:'windCuentasPagar',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            // maximizable: true,
            // maximized:true,
            frame: true,
            items: [scope.panelFinanciamientorecibido],
            buttons: [
                this.btncancelarfichafinanciamiento = new Ext.Button({
                    iconCls: 'cerrar',
                    text: 'Cancelar',
                    handler: function () {
                        scope.AddFichaporcredito.hide();

                    }
                }),
                scope.btnAceptarfichafinanciamiento = new Ext.Button({
                    iconCls: 'aceptar',
                    disabled: true,
                    text: 'Aceptar',

                    handler: function () {
                        if (scope.pdatos.getForm().isValid())
                        {
                            for (var i = 0; i < scope.stcargarDesgloseobligaciones.data.items.length ; i++) {
                                arrayfichas.push(scope.stcargarDesgloseobligaciones.data.items[i].data)
                            }

                            Ext.Ajax.request({
                                url: 'saveCuentaspagar',
                                method: 'POST',
                                params:
                                {
                                    iddocumento:Vista.Financiamientodoc.Controller.id_doc,
                                    id_cuentaspagar:Vista.Financiamientodoc.Controller.id_cuentaspagar,
                                   // cuentagastos: scope.cbcuentaprov.getValue(),
                                    tipo_doc: scope.cbTipdocument.getValue(),
                                    id_operacion: scope.cboperation.getValue(),
                                    fecha_emision: scope.cbFechaEmision.getRawValue(),
                                    observacion: scope.labelObservacion.getValue(),
                                    no_doc: scope.labelNodoc.getValue(),
                                    arrayfichas: Ext.encode(arrayfichas),
                                },
                                callback: function (options, success, response) {
                                    var responseData = Ext.decode(response.responseText);
                                    arrayfichas.splice(0, arrayfichas.length);
                                    if (responseData.codM == 1) {
                                        var msg="Los datos han sido Guardados correctamente..."
                                        mostrarMensaje(1, msg);
                                        scope.selecteds=undefined;
                                        // Vista.Financiamientodoc.Controller.iddoc = responseData.iddoc;
                                        // scope.btnConfirmarfichafinanciamiento.enable();
                                        // scope.btnAceptarfichafinanciamiento.disable();
                                        scope.model.stcuentasporpagar.reload();
                                        scope.AddFichaporcredito.hide();
                                        // scope.stliquidacionProveedor.reload();
                                        // scope.cuentaspagar.reload();

                                        Ext.Msg.hide();
                                    }
                                }
                            });
                        }
                        else
                        {
                            var msg="Existen campos vacios"
                            mostrarMensaje(6, msg);
                        }
                    }
                }),


            ]
        });
    },


    getWindows: function (id_cuentaspagar, no_doc, id_cuenta,fechaemision,operacion,observacion,tipo_documento,id_doc,estado)
    {
        if(id_cuentaspagar)
        {
            this.stcargarDesgloseobligaciones.baseParams.id_cuentaspagar=id_cuentaspagar;
            this.stcargarDesgloseobligaciones.reload();
            Vista.Financiamientodoc.Controller.id_cuentaspagar = id_cuentaspagar;
            Vista.Financiamientodoc.Controller.id_doc = id_doc;
           // this.cbcuentaprov.setValue(id_cuenta);
            this.cbTipdocument.setValue(tipo_documento);
            this.cboperation.setValue(operacion);
            this.cbFechaEmision.setValue(fechaemision);
            this.labelObservacion.setValue(observacion);
            this.labelNodoc.setValue(no_doc);
            this.stfichas_gastos.baseParams.idgastos = id_cuenta;
            this.stfichas_gastos.reload();
            this.btnAdicionarGastoAcumulado.enable();
            this.btnAceptarfichafinanciamiento.disable();

            if(estado=='Posteado' || estado=='Cancelado' || estado=='Confirmado')
            {
                this.btnAceptarfichafinanciamiento.hide();
                this.panel3.disable();
                this.panel2.disable();

            }
            else
            {
                this.btnAceptarfichafinanciamiento.show();
                this.panel3.enable();
                this.panel2.enable();

            }

        }
        else
        {
            this.stcargarDesgloseobligaciones.baseParams.id_cuentaspagar='';
            this.stcargarDesgloseobligaciones.reload();
            this.btnAceptarfichafinanciamiento.disable();
            Vista.Financiamientodoc.Controller.id_cuentaspagar = 0;
            Vista.Financiamientodoc.Controller.id_doc = 0;
            this.stcargarDesgloseobligaciones.baseParams.id_cuentaspagar='';
            this.stcargarDesgloseobligaciones.reload();
            this.stfichas_gastos.baseParams.idgastos ='';
            this.stfichas_gastos.reload();
           // this.cbcuentaprov.setValue('');
            this.cbTipdocument.setValue('');
            this.cboperation.setValue('');
            this.cbFechaEmision.setValue('');
            this.labelObservacion.setValue('');
            this.labelNodoc.setValue('');
            this.btnAdicionarGastoAcumulado.disable();
            this.btnAceptarfichafinanciamiento.show();
            this.panel3.enable();
            this.panel2.enable();

        }


        return this.AddFichaporcredito;
    },

}
