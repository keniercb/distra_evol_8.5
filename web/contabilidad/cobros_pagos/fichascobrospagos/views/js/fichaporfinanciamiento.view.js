Ext.ns('Vista.Financiamiento');
Vista.Financiamiento.Controller = {
    init: function (fechaInicio,fechaFin) {
        var scope = this;
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
        Vista.Financiamiento.Controller.idfichatrabajo = 0;
        Vista.Financiamiento.Controller.iddoc = 0;
        var arraygastos = new Array();
        var arrayobligaciones = new Array();
        this.seleccion = new Array();
        this.fechaInicio=null;
        this.fechaFin=null;
        this.model = Fichas.Store.Model;

        scope.obligaciones= new Ext.data.Store({

            url: 'loadObligaciones',
            scope: this,
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                    root: 'datos'
                },
                [{
                    name: 'numero'
                },
                    {
                        name: 'cliente_proveedor'
                    },
                    {
                        name: 'id_cuenta'
                    },
                    {
                        name: 'importe'
                    },
                    {
                        name: 'id_ficha'
                    },
                    {
                        name: 'nombrecontrato'
                    },
                    {
                        name: 'concatcuentagastos'
                    }

                ]),

        });

        this.stProveedores = new Ext.data.JsonStore({
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

        scope.stAddCuentaTodas= new Ext.data.Store({

            url: 'loadDataTodasCuenta',
            scope: this,
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idcuenta'
            },
                {
                    name: 'text'
                }
            ]),

        });

        scope.gastosfinanciamiento= new Ext.data.Store({

            url: 'loadGastos',
            scope: this,
            autoLoad: false,
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

        var scope = this

        this.rowEditorrecibidofinanciamiento = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            //saveTooltip: this.idioma.lbToolRowEditorAceptar,
            //cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });


        this.rowEditorgastosfinanciamiento2 = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            //saveTooltip: this.idioma.lbToolRowEditorAceptar,
            //cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });



        this.rowactionDelgastosfinanciamiento = new Ext.grid.RowActions({
            id: 'idRowactionfinan',
            widthSlope: 30,
            align: 'right',
            actions: [
                {
                    id: 'eliminarfinan',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'eliminar',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16,
                    //hideIndex: 'shEliminar',
                    //textIndex: 'um'
                },
            ]
        });

        this.rowactionDelgastosfinanciamiento2 = new Ext.grid.RowActions({
            id: 'idRowactionfinan2',
            widthSlope: 30,
            align: 'right',
            actions: [
                {
                    id: 'eliminarfinan2',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'eliminar',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16,
                    //hideIndex: 'shEliminar',
                    //textIndex: 'um'
                },
            ]
        });


        //-------COMBOS PARA GRID 2 ----------------------------
        scope.cbprovgastos = new Ext.form.ComboBox({
            id: 'idPvGastos',
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
            listeners:{
                expand: function (){
                    scope.stAddCuenta2.baseParams.id_prov = scope.cbprovgastos.getValue();;
                    scope.stAddCuenta2.baseParams.tipocobrospagos = 2;
                    scope.cbcuentaprovgatos.reload();
                   // scope.stAddCuenta2.reload();
                },
                select: function (cb, record){
                    // scope.stAddCuenta2.baseParams.tipocobrospagos = '';
                    // scope.stAddCuenta2.reload();
                }
            },
            id: 'cbxCuentagastos',
        });

        this.cbprovgastos.on({
            select : function (){
                scope.cbcuentaprovgatos.setValue('');
                scope.cbcuentaprovgatos.enable();

            }

        })


        //-------COMBOS PARA GRID 2 ----------------------------



//-------COMBOS PARA GRID 1 ----------------------------
        scope.cbprovfinanciamientoeditor = new Ext.form.ComboBox({
            id: 'idcbprovfinac',
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
            store:this.stProveedores,
            valueField: 'idclientesproveedores',
            displayField: 'nombrecontrato',
            autoLoad:true,
        });


        scope.cbcuentaprovfinanciamientoeditor = new Ext.contabilidad.util.linkedCombo({
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
            id: 'cbxCuentafinanciamientoeditor',
        });

        this.cbprovfinanciamientoeditor.on({
            select : function (yo, record, index){

                scope.stAddCuenta2.baseParams.id_prov = scope.cbprovfinanciamientoeditor.getValue();
                scope.stAddCuenta2.baseParams.tipocobrospagos = 2;
                scope.stAddCuenta2.reload();
                scope.cbcuentaprovfinanciamientoeditor.enable();
            }

        })
        //-------COMBOS PARA GRID 1 ----------------------------

        this.cmfinanciamientogastosfinanciamiento = new Ext.grid.ColumnModel([
            {
                header: "Número",
                id:'Numero-financiamiento-gastosfinanciamiento',
                dataIndex: 'numero',
                valueField: 'numero',
                align: 'right',
                width:82,
                editor:new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                    allowBlank: false,
                })

            },
            {
                header: "Cliente/Proveedor",
                dataIndex: 'cliente_proveedor',
                valueField:'idcliente_proveedor',
                width:185,
                id:'Cliente/Proveedor-financiamiento-gastosfinanciamiento',
                editor:scope.cbprovgastos,

            },
            {
                header: "Cuenta",
                id:'Cuenta-financiamiento-gastosfinanciamiento',
                dataIndex: 'concatcuentagastos',
                valueField: 'idcuentagastos',
                align: 'right',
               // disable: true,
                width:280,
                 editor:scope.cbcuentaprovgatos
            },{
                header: "Importe",
                id:'Importe-financiamiento-gastosfinanciamiento',
                dataIndex: 'importe',
                valueField: 'importe',
                renderer: formatoMoneda(),
                align: 'right',
                width:85,
                editor:new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                    allowBlank: false,
                })
            },scope.rowactionDelgastosfinanciamiento

        ]);

        this.cmfinanciamientopagofinanciamiento = new Ext.grid.ColumnModel([
            {
                header: "Número",
                id:'Numero-financiamiento-pagofinanciamiento',
                dataIndex: 'numero',
                valueField: 'numero',
                align: 'right',
                width:100,
                editor:new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                    allowBlank: false,
                })
            }, {
                header: "Cliente/Proveedor",
                dataIndex: 'nombrecontrato',
                valueField:'cliente_proveedor',
                id:'Cliente/Proveedor-financiamiento-pagofinanciamiento',
                width:170,
                //renderer:,
                align: 'right',
                sortable: true,
                readOnly: true,
                editor:scope.cbprovfinanciamientoeditor


            }, {
                header: "Cuenta",
                id:'Cuenta-financiamiento-pagofinanciamiento',
                dataIndex: 'concatcuentagastos',
                valueField: 'idcuentagastos',
                align: 'right',
                width:100,
                editor: scope.cbcuentaprovfinanciamientoeditor
            },{
                header: "Importe",
                id:'Importe-financiamiento-pagofinanciamiento',
                dataIndex: 'importe',
                valueField: 'importe',
                renderer: formatoMoneda(),
                align: 'right',
                width:100,
                editor:new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                    allowBlank: false,})
            },
            scope.rowactionDelgastosfinanciamiento2
        ]);

        scope.smoperacionnuevaobligacionesfinanciamiento = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        scope.smoperacionnuevagastosfinanciamiento = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });


        scope.btnAdicionarObligacionfinanciamiento= new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar',
        });
        scope.btnAdicionarGastoAcumuladofinanciamiento= new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar',
        });


        this.recordobligaciones = Ext.data.Record.create([
            {name: 'numero', type: 'string'},
            {name: 'idcliente_proveedor', type: 'string'},
            {name: 'importe', type: 'int'},
            {name: 'idcuenta', type: 'int'},
            {name: 'id_ficha', type: 'int'},

        ]);

        scope.btnAdicionarObligacionfinanciamiento.on({
            click: function(){
                scope.smoperacionnuevaobligacionesfinanciamiento.clearSelections()
                var recTal2 = new scope.recordobligaciones({
                    numero:'',
                    idcliente_proveedor:'',
                    idcuenta:"",
                    importe:'',
                    id_ficha:0,




                });
                scope.rowEditorrecibidofinanciamiento.stopEditing();
                scope.obligaciones.insert(0, recTal2);
                scope.Grid1financiamiento.getView().refresh();
                scope.rowEditorrecibidofinanciamiento.startEditing(0, 0);
                // view.cbOperacion.focus(true, 100);



            }
        })

//***********************EDITOR DEL 1 GRID******************************************

        this.rowEditorrecibidofinanciamiento.on({

            afteredit: function(editor, grid, changes, record, rowIndex){
                var selecteds = scope.smoperacionnuevaobligacionesfinanciamiento.getSelections();
                if(selecteds.length == 0)
                {
                    valueaux=scope.cbprovfinanciamientoeditor.getValue();
                    record.data.nombrecontrato=scope.cbprovfinanciamientoeditor.getRawValue();
                    record.data.idcliente_proveedor=valueaux;

                    valueaux=scope.cbcuentaprovfinanciamientoeditor.getValue();
                    record.data.concatcuentagastos=scope.cbcuentaprovfinanciamientoeditor.getRawValue();
                    record.data.idcuenta=valueaux;

                }
                else
                {
                    if(changes['cliente_proveedor']!=null)
                    {
                        valueaux=scope.cbprovfinanciamientoeditor.getValue();
                        record.data.cliente_proveedor=scope.cbprovfinanciamientoeditor.getRawValue();
                        record.data.idcliente_proveedor=valueaux;
                    }
                    if(changes['cuenta']!=null)
                    {
                        valueaux=scope.cbcuentaprovfinanciamientoeditor.getValue();
                        record.data.cuenta=scope.cbcuentaprovfinanciamientoeditor.getRawValue();
                        record.data.idcuenta=valueaux;
                    }



                }
                scope.obligaciones.commitChanges();
                scope.smoperacionnuevagastosfinanciamiento.clearSelections()
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


//***********************EDITOR DEL 2 GRID******************************************
        this.rowEditorgastosfinanciamiento2.on({

            afteredit: function(editor, grid, changes, record, rowIndex){
                var selecteds = scope.smoperacionnuevagastosfinanciamiento.getSelections();
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
               scope.gastosfinanciamiento.commitChanges();
               scope.smoperacionnuevagastosfinanciamiento.clearSelections()
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

        this.recordgastos = Ext.data.Record.create([
            {name: 'idgastos', type: 'int'},
            {name: 'numero', type: 'int'},
            {name: 'idcliente_proveedor', type: 'string'},
            {name: 'cuenta', type: 'sting'},
            {name: 'importe', type: 'int'},

        ]);

        scope.btnAdicionarGastoAcumuladofinanciamiento.on({
            click: function(){
                scope.stAddCuentaTodas.baseParams.tipocuenta= 1;
                scope.stAddCuentaTodas.reload();
                scope.smoperacionnuevagastosfinanciamiento.clearSelections()
                var recTal = new scope.recordgastos({
                    idgastos:0,
                    numero:'',
                    idcliente_proveedor:'',
                    cuenta:'',
                    especialidad:'',
                    importe:'false',



                });
                scope.rowEditorgastosfinanciamiento2.stopEditing();
                scope.gastosfinanciamiento.insert(0, recTal);
                scope.Grid2financiamiento.getView().refresh();
                scope.rowEditorgastosfinanciamiento2.startEditing(0, 0);
               // view.cbOperacion.focus(true, 100);



            }
        })

//***********************EDITOR DEL 2 GRID******************************************

        //***--------------Primera Fila del Formulario FINANCIAMIENTO RECIBIDO---------------------------------

        scope.labelNoFichafinanciamiento= new Ext.form.TextField({
            fieldLabel:'No Ficha',
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'NoFichafinanciamiento',
            id:'Nofinanciamiento',
            pageSize: 100,
            // allowNegative: false,
            maxValue: 9999999999999,
            allowBlank: false,
            disabled : false,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            //tabIndex:4

        })
        scope.cbFechaEmisionfinanciamiento = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfAddFechaEmisionfinanciamiento',
            fieldLabel: 'Fecha Emisión:', //'Fecha de emisi&oacute;n',
            name: 'fechaemisionf',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regexText: 'asdasdasd',
            readOnly: true,
            maxValue: fechaFin,
            minValue: fechaInicio,
            tabIndex: 100,
            allowBlank: false,
            blankText: 'Seleccione...', //'Este campo es obligatorio.',
            anchor: '98%',
            format: 'd/m/Y',
            enableKeyEvents: true
        });
        this.sttipdocumento = new Ext.data.JsonStore({
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
        });

        scope.cbTipdocumentfinanciamiento = new Ext.form.ComboBox({
            id: 'idTipodocfinanciamiento',
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
            store: this.sttipdocumento,
            valueField: 'iddoc',
            displayField: 'denominacion',
            autoLoad:true,
        });

        this.stoperacionfrom = new Ext.data.JsonStore({
            url: 'loadDataOperacionesContablesLiquidacion',
            root: 'result',
            autoLoad:true,
            totalProperty: 'cantidad',
            fields: [
                {
                    name: 'idnomoperaciones'
                }, {
                    name: 'denominacion'
                }
            ]
        });
        scope.cboperationfinanciamiento = new Ext.form.ComboBox({
            id: 'idTipoOpfinanciamiento',
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
            store:this.stoperacionfrom,
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',

        });

        //--------------------------------Segunda fila del formulario---------------------------------------------------

        scope.cbprovfinanciamiento = new Ext.form.ComboBox({
            id: 'idPvFinanciamiento2',
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
            store:  this.stProveedores,
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            autoLoad:true,
        });

        this.cbprovfinanciamiento.on({
            select : function (){
                scope.cbcuentaprovfinanciamiento.enable();
                scope.cbcuentaprovfinanciamiento.setValue('');

            }

        })


        scope.cbcuentaprovfinanciamiento = new Ext.contabilidad.util.linkedCombo({
            store: scope.stAddCuenta2,
            fieldLabel: 'Cuenta del proveedor',
            displayField: 'nombrecuenta',
            valueField: 'idcuenta',
            disabled: true,
            hideTbar: false,
            hideBbar: false,
            listHeight: 200,
            allowBlank: false,
            tabIndex: 11,
            anchor: '98%',
            mode: 'local',
            loaded: true,
            id: 'cbxCuentafinanciamiento',
            listeners: {
                expand: function (){
                    scope.stAddCuenta2.baseParams.id_prov = scope.cbprovfinanciamiento.getValue();
                    scope.stAddCuenta2.baseParams.tipocobrospagos = 1;
                    scope.cbcuentaprovfinanciamiento.reload();
                },
                select: function (cb, record){
                    scope.stAddCuenta2.baseParams.tipocobrospagos = '';
                    scope.stAddCuenta2.reload();
                }
            }
        });
        scope.labelNodocfinanciamiento= new Ext.form.TextField({
            fieldLabel:'No de documento',
            triggerAction: 'all',
            anchor: '96%',
            id:'numfinanciamiento',
            enableKeyEvents: true,
            editable: true,
            name: 'NoDoc',
            pageSize: 100,
            allowBlank: false,
            // allowNegative: false,
           // maxValue: 9999999999999,
            disabled : false,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            //tabIndex:4

        });
        //--------------------------------------------------Tercera Fila del Formulario-------------------------------------------------
        // this.labelTasaapertura= new Ext.form.NumberField({
        //     fieldLabel:'Tasa de apertura',
        //     triggerAction: 'all',
        //     anchor: '96%',
        //     enableKeyEvents: true,
        //     editable: true,
        //     name: 'TasadeApertura',
        //     pageSize: 100,
        //     allowNegative: false,
        //     maxValue: 9999999999999,
        //     allowBlank: false,
        //     disabled : false,
        //     //tabIndex:4
        //
        // });
        // this.labelTasaactual= new Ext.form.NumberField({
        //     fieldLabel:'Tasa actual',
        //     triggerAction: 'all',
        //     anchor: '96%',
        //     enableKeyEvents: true,
        //     editable: true,
        //     name: 'TasaActual',
        //     pageSize: 100,
        //     allowNegative: false,
        //     maxValue: 9999999999999,
        //     allowBlank: false,
        //     disabled : false,
        //     //tabIndex:4
        //
        // });
        // this.labelImportotal= new Ext.form.NumberField({
        //     fieldLabel:'Importe Total',
        //     triggerAction: 'all',
        //     anchor: '96%',
        //     enableKeyEvents: true,
        //     editable: true,
        //     name: 'NoFicha',
        //     pageSize: 100,
        //     allowNegative: false,
        //     maxValue: 9999999999999,
        //     allowBlank: false,
        //     disabled : false,
        //     //tabIndex:4
        //
        // })
        scope.labelObservacionfinanciamiento= new Ext.form.TextField({
            fieldLabel:'Observación',
            triggerAction: 'all',
            anchor: '99%',
            id:'obfinanciamiento',
            enableKeyEvents: true,
            editable: true,
            name: 'Observación',
            pageSize: 100,
            // allowNegative: false,
           // maxValue: 9999999999999,
            allowBlank: false,
            disabled : false,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            //tabIndex:4

        });

        scope.pdatosfinanciamiento = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            height: 150,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .1,
                    layout: 'form',
                    items: [scope.labelNoFichafinanciamiento]
                },{
                    columnWidth: .2,
                    layout: 'form',
                    items: [scope.cbFechaEmisionfinanciamiento]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [scope.cbTipdocumentfinanciamiento]
                }, {
                    columnWidth: .4,
                    layout: 'form',
                    items: [scope.cboperationfinanciamiento]
                }]
            },
                {
                    layout: 'column',
                    items: [
                        {
                        columnWidth: .5,
                        layout: 'form',
                        items: [scope.cbprovfinanciamiento]
                    },{
                        columnWidth: .3,
                        layout: 'form',
                        items: [scope.cbcuentaprovfinanciamiento]
                    },
                        {
                        columnWidth: .2,
                        layout: 'form',
                        items: [scope.labelNodocfinanciamiento]
                    }]
                },
                {
                    layout: 'column',
                    items: [
                        // {
                        //     columnWidth: 0.1,
                        //     layout: 'form',
                        //     items: [scope.labelTasaapertura]
                        // },
                        // {
                        //     columnWidth: 0.1,
                        //     layout: 'form',
                        //     items: [scope.labelTasaactual]
                        // },
                        // {
                        //     columnWidth: 0.1,
                        //     layout: 'form',
                        //     items: [scope.labelImportotal]
                        // }
                        // ,
                        {
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.labelObservacionfinanciamiento]
                    }]
                }]
        });


        scope.Grid1financiamiento=new Ext.grid.EditorGridPanel({
            clicksToEdit: 2,
            singleSelect: false,
            loadMask: true,
            id: 'grid-1',
            region: 'east',
            // height: Ext.lib.Dom.getViewHeight() * 0.5,
            // width: Ext.lib.Dom.getViewWidth() * 0.3,
            cm: scope.cmfinanciamientopagofinanciamiento,
            sm: scope.smoperacionnuevaobligacionesfinanciamiento,
            store: scope.obligaciones,
            plugins:[scope.rowEditorrecibidofinanciamiento,this.rowactionDelgastosfinanciamiento2],
            tbar: [scope.btnAdicionarObligacionfinanciamiento],
            frame: true
        });

        scope.Grid2financiamiento=new Ext.grid.EditorGridPanel({
            clicksToEdit: 2,
            singleSelect: false,
            loadMask: true,
            id: 'grid-2',
            region: 'center',
            cm: scope.cmfinanciamientogastosfinanciamiento,
            //width: 200,
            // height: Ext.lib.Dom.getViewHeight() * 0.5,
            // width: Ext.lib.Dom.getViewWidth() * 0.3,
            sm: scope.smoperacionnuevagastosfinanciamiento,
            store: scope.gastosfinanciamiento,
            plugins:[scope.rowEditorgastosfinanciamiento2,scope.rowactionDelgastosfinanciamiento],
            tbar: [scope.btnAdicionarGastoAcumuladofinanciamiento],
            frame: true
        });

        this.rowactionDelgastosfinanciamiento.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminarfinan':
                    //var selecteds = view.smoperacionnueva.getSelections();
                    mostrarMensaje(2, "Seguro que desea eliminar", function (btnPress) {
                        if (btnPress === 'ok') {

                            var seleccionado = scope.Grid2financiamiento.getSelectionModel().getSelected();
                            scope.Grid2financiamiento.getStore().remove(seleccionado);
                           // var Store =  scope.Grid2financiamiento.getStore()
                            // totalgastos=0;
                            // scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                            // for (var i = 0; i <Store.data.items.length ; i++) {
                            //     totalgastos+=parseFloat(Store.data.items[i].data.importe);
                            // }
                            // scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                        }
                    });
                    scope.rowEditorgastosfinanciamiento2.stopEditing(true);
                    break;
            }
        });this.rowactionDelgastosfinanciamiento2.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminarfinan2':
                    //var selecteds = view.smoperacionnueva.getSelections();
                    mostrarMensaje(2, "Seguro que desea eliminar", function (btnPress) {
                        if (btnPress === 'ok') {

                            var seleccionado = scope.Grid1financiamiento.getSelectionModel().getSelected();
                            scope.Grid1financiamiento.getStore().remove(seleccionado);
                           // var Store =  scope.Grid2financiamiento.getStore()
                            // totalgastos=0;
                            // scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                            // for (var i = 0; i <Store.data.items.length ; i++) {
                            //     totalgastos+=parseFloat(Store.data.items[i].data.importe);
                            // }
                            // scope.lfTotalgastos.setText('Total gastos: '+totalgastos)
                        }
                    });
                    scope.rowEditorrecibidofinanciamiento.stopEditing(true);
                    break;
            }
        });



        scope.panel1financiamiento = new Ext.Panel({
            title: 'Financiamiento recibido',
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
            items:[scope.Grid1financiamiento],
        });


        scope.panel2financiamiento = new Ext.Panel({
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
            items:[scope.Grid2financiamiento],
        });
        scope.panel3financiamiento = new Ext.Panel({
            //idioma: params.idioma,
            //perfil: params.perfil,
            //layout: 'fit',
            scope: this,
            frame: true,
            border: false,
            split: true,
            region: 'north',
            height: Ext.lib.Dom.getViewHeight() * 0.2,
            //height:'50%',
            items:[scope.pdatosfinanciamiento],
        });
        scope.panelFinanciamientorecibidofinanciamiento= new Ext.Panel({
            id: 'otrofinanciamiento',
            frame: false,
            layout: 'border',
            height: 780,
            width:'100%',
            items: [scope.panel3financiamiento, scope.panel2financiamiento,scope.panel1financiamiento ]
        });


        //**************--------------------WINDOWS FINANCIAMIENTO RECIBIDO---------------------------------**************************************
        scope.AddFicha = new Ext.Window({
            title: 'Adicionar ficha por financiamiento recibido',
            id:'identfinanciamiento',
            constrain: true,
            modal: true,
            closeAction: 'hide',
           maximized:true,
            resizable: true,
           // maximizable: true,
            frame: true,
            items: [scope.panelFinanciamientorecibidofinanciamiento],
            buttons: [
                this.btncancelarficha = new Ext.Button({
                    iconCls: 'cerrar',
                    text: 'Cancelar',
                    handler: function () {
                        // //this.GridConfig.resumeEvents();
                        scope.AddFicha.hide();
                        // this.model.store_desagregacion.baseParams.id_docpresupuesto = 0;
                        // this.model.store_desagregacion.reload();
                        // // this.GridConfig.removeAll();

                    }

                }),
                this.btnAceptarficha = new Ext.Button({
                    iconCls: 'aceptar',
                    disabled: false,
                    text: 'Aceptar',
                    handler: function () {
                        if (scope.pdatosfinanciamiento.getForm().isValid()&& scope.labelNoFichafinanciamiento.getValue() !='' && scope.labelObservacionfinanciamiento.getValue() !='' && scope.labelNodocfinanciamiento.getValue() !='')
                        {
                            var idficha = 0;
                            for (var i = 0; i < scope.gastosfinanciamiento.data.items.length ; i++) {
                                arraygastos.push(scope.gastosfinanciamiento.data.items[i].data)
                            }
                            for (var i = 0; i < scope.obligaciones.data.items.length; i++) {
                                arrayobligaciones.push(scope.obligaciones.data.items[i].data)
                            }
                            if(arraygastos.length <1 && arrayobligaciones.length <1)
                            {
                                var msg="No existen datos relacionados con financiamiento recibisdo y gastos acumulados"
                                mostrarMensaje(6, msg);
                            }
                            else{
                                Ext.Ajax.request({
                                    url: 'saveFichas',
                                    method: 'POST',
                                    params: {

                                        no_ficha: scope.labelNoFichafinanciamiento.getValue(),
                                        id_ficha: Vista.Financiamiento.Controller.idfichatrabajo,
                                        fecha_emision: scope.cbFechaEmisionfinanciamiento.getRawValue(),
                                        tipo_doc: scope.cbTipdocumentfinanciamiento.getValue(),
                                        id_operacion: scope.cboperationfinanciamiento.getValue(),
                                        id_proveedor: scope.cbprovfinanciamiento.getValue(),
                                        id_cuenta_proveedor: scope.cbcuentaprovfinanciamiento.getValue(),
                                        no_doc: scope.labelNodocfinanciamiento.getValue(),
                                        observacion:scope.labelObservacionfinanciamiento.getValue(),
                                        tipo_ficha:1,
                                  //      tasa_actual: scope.labelTasaactual.getValue(),
                                   //     tasa_apertura: scope.labelTasaapertura.getValue(),
                                  //      importe_total: scope.labelImportotal.getValue(),
                                        arraygastos: Ext.encode(arraygastos),
                                        arrayobligaciones: Ext.encode(arrayobligaciones),



                                    },
                                    callback: function (options, success, response) {
                                        var responseData = Ext.decode(response.responseText);
                                        arraygastos.splice(0, arraygastos.length);
                                        arrayobligaciones.splice(0, arrayobligaciones.length);
                                        if (responseData.codM == 1) {
                                            Vista.Financiamiento.Controller.iddoc = responseData.iddoc
                                            var msg="Los datos han sido Guardados correctamente..."
                                            mostrarMensaje(1, msg);
                                            scope.selecteds=undefined;
                                            scope.btnConfirmarficha.enable();
                                            scope.btnAceptarficha.disable();
                                            scope.model.stfichas.reload();
                                            scope.gastosfinanciamiento.reload();
                                            scope.obligaciones.reload();

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


                scope.btnConfirmarficha = new Ext.Button({
                    iconCls: 'confirmar',
                    disabled: true,
                    text: 'Confirmar',
                    handler: function () {
                        Ext.Ajax.request({
                            url: 'confirmarEstado',
                            method: 'POST',
                            params: {

                                ficha: scope.labelNoFichafinanciamiento.getValue(),

                            },
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.codM == 1) {
                                    var msg="Se realizó la operación con exito..."
                                    mostrarMensaje(1, msg);

                                    scope.btnConfirmarficha.disable();
                                    scope.btnAceptarficha.disable();
                                    scope.btnPostearficha.enable();
                                    scope.model.stfichas.reload();
                                    Ext.Msg.hide();
                                }
                            }
                        });
                    }
                }),
                scope.btnPostearficha = new Ext.Button({
                    text: 'Postear',
                    disabled: true,
                    iconCls: 'contabilidad',
                    handler: function () {
                        var msg ='Seguro que desea postear la operacion seleccionada.';
                        mostrarMensaje(2,msg, function (btnPress) {
                            if (btnPress === 'ok') {
                                scope.btnPostearficha.disable();
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
            this.seleccion.push({
                id_operacion:id_operacion,
                iddocumento:iddocumento,
                id_cuenta_proveedor:id_cuenta_proveedor,
                id_proveedor:id_proveedor,
                id_ficha:idfichabuscar,
            });
            Vista.Financiamiento.Controller.iddoc = iddocumento;
            this.btnAceptarficha.enable()
            this.btnConfirmarficha.enable()
            Vista.Financiamiento.Controller.idfichatrabajo = idfichabuscar;
            this.stoperacionfrom.reload();
            this.labelNoFichafinanciamiento.setValue(no_ficha);
            // this.labelTasaapertura.setValue(tasa_apertura);
            // this.labelTasaactual.setValue(tasa_actual);
            // this.labelImportotal.setValue(importe_total);
            this.cbTipdocumentfinanciamiento.setValue(tipo_doc);
            this.cboperationfinanciamiento.setValue(id_operacion);
            this.cbprovfinanciamiento.store.loadData({datos: [{idclientesproveedores: id_proveedor, nombre: concatproveedor,count: 1 }]});
            this.cbprovfinanciamiento.setValue(id_proveedor);
            this.cbcuentaprovfinanciamiento.setValue(id_cuenta_proveedor,concatcuentaproveedor );
            this.labelNoFichafinanciamiento.disable();
            this.cbFechaEmisionfinanciamiento.setValue(fecha_emision);
            this.labelNodocfinanciamiento.setValue(no_doc);
            this.labelObservacionfinanciamiento.setValue(observacion);
            this.gastosfinanciamiento.baseParams.ficha = idfichabuscar;
            this.gastosfinanciamiento.baseParams.tipo_ficha = tipo_ficha;
            this.gastosfinanciamiento.reload();
            this.obligaciones.baseParams.ficha = idfichabuscar;
            this.obligaciones.baseParams.tipo_ficha = tipo_ficha;
            this.obligaciones.reload();
            if(estado=='Posteado' || estado=='Cancelado')
            {
                this.btnConfirmarficha.hide();
                this.btnAceptarficha.hide();
                this.btnPostearficha.hide();
                this.btnPostearficha.disable();
                this.panel3financiamiento.disable();
                this.panel2financiamiento.disable();
                this.panel1financiamiento.disable();

            } else if(estado=='Confirmado')
            {
                this.btnConfirmarficha.hide();
                this.btnAceptarficha.hide();
                this.btnPostearficha.show();
                this.btnPostearficha.enable();
                this.panel3financiamiento.disable();
                this.panel2financiamiento.disable();
                this.panel1financiamiento.disable();

            }
            else
            {
                this.btnConfirmarficha.show();
                this.btnAceptarficha.show();
                this.btnPostearficha.show();
                this.btnPostearficha.disable();
                this.panel3financiamiento.enable();
                this.panel2financiamiento.enable();
                this.panel1financiamiento.enable();
            }

        }
        else
        {
            Vista.Financiamiento.Controller.iddoc = 0;
            this.btnConfirmarficha.show();
            this.btnAceptarficha.show();
            this.btnPostearficha.show();
            this.panel3financiamiento.enable();
            this.panel2financiamiento.enable();
            this.panel1financiamiento.enable();

           this.btnAceptarficha.enable()
           this.btnConfirmarficha.disable()
           Vista.Financiamiento.Controller.idfichatrabajo = 0;
           this.labelNoFichafinanciamiento.setValue('');
            // this.labelTasaapertura.setValue('');
            // this.labelTasaactual.setValue('');
            // this.labelImportotal.setValue('');
           this.labelNoFichafinanciamiento.enable();
           this.cbFechaEmisionfinanciamiento.setValue('');
           this.labelNodocfinanciamiento.setValue('');
           this.cboperationfinanciamiento.setValue('');
           this.cbprovfinanciamiento.setValue('');
           this.cbcuentaprovfinanciamiento.setValue('');
           this.cbcuentaprovfinanciamiento.disable();
           this.cbTipdocumentfinanciamiento.setValue('');
           this.labelObservacionfinanciamiento.setValue('');
           this.gastosfinanciamiento.baseParams.ficha = -1;
           this.gastosfinanciamiento.baseParams.tipo_ficha = -1;
           this.gastosfinanciamiento.removeAll();
           this.obligaciones.baseParams.ficha = -1;
           this.obligaciones.baseParams.tipo_ficha = -1;
           this.obligaciones.removeAll();
           this.obligaciones.reload();
           this.gastosfinanciamiento.reload();
        //
        }
        this.contabilizarDesagregacion = function () {
            var param = {
                tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                descripcion: 'Posteando depósito: ',};
            this.fLoadDataComprobante(param);
        };
        this.fLoadDataComprobante = function (params) {
            var arrayIdDoc = [];
            var arrayIdDocPres = [];
            arrayIdDoc.push(Vista.Financiamiento.Controller.iddoc);
            arrayIdDocPres.push(Vista.Financiamiento.Controller.iddoc);
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
                    tipocontabilizacionparacomprobante:1
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
                        this.fShowComprobante(responseData, params);
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
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params);
                else
                    this.guardarCancelacion(idComprobante, numComprobante, fechaComprobante, params);
            }.bind(this)).onClose(function () {
               // this.scope.keyMap.enable();
                noWindow = true;//para indicar que se cerro la ventana
                this.btnPostearficha.enable();

                //this.btnContatabDeposito.enable();
            }.bind(this));
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params, fnPostear) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarDeposito',
                scope: this,
                params: {
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
                    this.model.stfichas.reload();
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

            return this.AddFicha;
    },
}
