Ext.define('SolicitudPago.view.WindowSolicitudPago', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.sp_solicitudpagowindow',
    layout: 'fit',
    // title: 'Adicionar Solicitud de Pago',
    height: 410,
    // minWidth:
    width: 550,
    modal: true,
    constrain:true,
    // autoShow: true,
    detalles:false,
    defaultFocus:'codigo',
    resizable: false,
    btnApply:true,
    initComponent: function () {
        var me=this;
        // console.log('detalles', me.detalles)
        me.etiquetas = LangMgr.getLang(this);
        var required = '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>';

        var medio_pago = Ext.create('Ext.data.Store',{
            // autoLoad:true,
            proxy:{
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarMediosPago'}, ModuleMgr.get('SolicitudPago')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                },
                extraParams: {idcontrato:me.idcontrato},
            },
            fields:['idmediodepago','nombre','denominacion']
        });

        me.items=[
            {
                xtype:'form',
                trackResetOnLoad:true,
                // frame:true,
                items:[
                    {
                        xtype:'tabpanel',
                        itemId:'tabpanel',
                        layout:'fit',
                        // frame:true,
                        items:[
                            {
                                title: me.etiquetas.lbInformacionGeneral,
                                frame:true,
                                defaults:{
                                    labelAlign:'top',
                                    flex:1,
                                    margin:'5 5 5 5'
                                },
                                items:[
                                    {
                                        xtype:'container',
                                        layout:'hbox',
                                        items:[
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: me.etiquetas.lbContrato,
                                                labelAlign:'top',
                                                labelWidth:60,
                                                itemId:'contrato',
                                                name: 'contrato',
                                                readOnly : true,
                                                flex:1,
                                                margin:'5 0 0 3'
                                            },
                                            {
                                                xtype:'button',
                                                iconCls: 'seleccion',
                                                action:'seleccionarcontrato',
                                                hidden:true,
                                                // hidden:me.detalles,
                                                tooltip: me.etiquetas.lbSeleccionarContrato,
                                                margin:'22 0 0 0',
                                            },
                                            {
                                                xtype:'button',
                                                iconCls: 'detalles',
                                                action:'contractdetail',
                                                tooltip: me.etiquetas.qtipDetailContrato,
                                                margin:'22 3 0 0',
                                            },
                                        ]
                                    },
                                    {
                                        xtype:'container',
                                        layout:'hbox',
                                        defaults:{
                                            labelAlign:'top',
                                            flex:1,
                                            margin:'5 3 0 3'
                                        },
                                        items:[
                                            Ext.create('GestionContrato.view.CmbArea', {
                                                localId: 'idarea',
                                                itemId: 'nombrearea',
                                                name: 'nombrearea',
                                                fieldLabel: me.etiquetas.lbAreaResponsable,
                                                labelAlign:'top',
                                                flex: 1,
                                                allowBlank: false,
                                                editable:false
                                            }),
                                            Ext.create('Ext.form.field.Hidden', {
                                                itemId: 'idarea',
                                                name: 'idarea'
                                            }),
                                            {
                                                xtype:'textfield',
                                                fieldLabel: me.etiquetas.lbCodigo,
                                                name: 'codigo',
                                                // afterLabelTextTpl: me.detalles?'':required,
                                                maxLength : 30,
                                                readOnly:true,
                                                emptyText:me.etiquetas.lbBlankCodigo,
                                                // enforceMaxLength: true,
                                                maxLengthText: me.etiquetas.msgMaximoValorPermitido,
                                                itemId: 'codigo',
                                                allowBlank: false,
                                                // regex:/^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/,
                                                // maskRe:/^[\w@.]$/,
                                                // width:100
                                            },

                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        defaults: {
                                            labelAlign: 'top',
                                            flex:1,
                                            margin:'5 3 0 3'
                                        },
                                        items: [
                                            // {
                                            //     xtype:'textfield',
                                            //     fieldLabel: me.etiquetas.lbAreaResponsable,
                                            //     readOnly : me.detalles,
                                            //     name: 'entidad_responsable',
                                            //     itemId: 'entidad_responsable',
                                            //     afterLabelTextTpl: required,
                                            //     allowBlank: false,
                                            // },

                                            // Ext.create('Ext.ux.CmbSelectField',
                                            //     {
                                            //         // xtype: 'combo',
                                            //         fieldLabel: me.etiquetas.lbFormaPago,
                                            //         name: 'medio_pago',
                                            //         readOnly: me.detalles,
                                            //         emptyText:'Seleccione…',
                                            //         itemId:'mediopago',
                                            //         name: 'mediopago',
                                            //         triggerAction:'all',
                                            //         queryMode: 'remote',
                                            //         afterLabelTextTpl: me.detalles?'':required,
                                            //         // allowBlank: false,
                                            //         typeAhead: true,
                                            //         multiSelect :false,
                                            //         store: medio_pago,
                                            //         displayField: 'denominacion',
                                            //         valueField: 'id',
                                            //         labelAlign:'top',
                                            //         mapping: 'NomMedioPago.nombre',
                                            //         module: 'Nomencladores',
                                            //         validator: function(){
                                            //             // console.log('validator', this.findRecord('nombre', this.getValue()))
                                            //             if(this.findRecord('nombre', this.getValue())) {
                                            //                 return true;
                                            //             }
                                            //             return me.etiquetas.msgValorInvalidoFormaPago;
                                            //         }
                                            //     }),
                                            {
                                                xtype:'combo',
                                                fieldLabel: me.etiquetas.lbFormaPago,
                                                store: medio_pago,
                                                afterLabelTextTpl: me.detalles?'':required,
                                                itemId:'mediopago',
                                                name: 'mediopago',
                                                displayField: 'nombre',
                                                valueField: 'idmediodepago',
                                                emptyText:'Seleccione…',

                                                validateOnBlur: true,
                                                enableKeyEvents: true,
                                                pickerrender: false,
                                                multiSelect: false,
                                                queryMode: 'remote',
                                                queryDelay: 400,
                                                minChars: 1,
                                                pageSize: 10,
                                                autoExpand: false,
                                                listLoadingText: 'Cargando...',
                                                listEmptyText: 'No existen datos que mostrar.',
                                                listQtipBtnAdd: 'Adicionar',
                                                listQtipBtnSearch: 'Buscar',
                                                navigateKeys: [9, 27, 35, 36, 36, 37, 38, 39, 40],
                                                listConfig: {
                                                    loadingText: me.etiquetas.msgLoading,
                                                    emptyText: '<div class="x-grid-empty">' + me.etiquetas.msgVacio + '</div>'
                                                },
                                                validator: function(){
                                                    if(this.findRecord('nombre', this.getRawValue())) {
                                                        return true;
                                                    }
                                                    return me.etiquetas.msgValorInvalidoFormaPago;
                                                }
                                            },
                                            {
                                                xtype:'textfield',
                                                itemId:'idformapago',
                                                name:'idformapago',
                                                allowBlank: false,
                                                hidden:true,
                                            },
                                            {

                                                xtype:'datefield',
                                                allowBlank: false,
                                                fieldLabel: me.etiquetas.lbFechaRecibo,
                                                itemId:'fecharecibo',
                                                // readOnly: me.detalles,
                                                afterLabelTextTpl: me.detalles?'':required,
                                                name:'fecharecibo',
                                                format: 'd/m/Y',
                                                readOnly:true,
                                                value:me.caso=='add'?new Date():null
                                            },
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        // margin:'0 0 5 0',
                                        layout: {
                                            type:'vbox',
                                            align:'stretch'
                                        },
                                        defaults: {
                                            labelAlign: 'top',
                                            margin:'5 3 0 3'
                                        },
                                        items:[
                                            {
                                                xtype     : 'textareafield',
                                                labelAlign : 'top',
                                                // grow      : true,
                                                afterLabelTextTpl: me.detalles?'':required,
                                                allowBlank: false,
                                                height:146,
                                                maxLength : 255,
                                                lengthText:me.etiquetas.msgMaximoValorPermitido,
                                                // enforceMaxLength: true,
                                                name      : 'descripcion',
                                                itemId      : 'descripcion',
                                                fieldLabel: me.etiquetas.lbDescripcion,
                                                readOnly: me.detalles,
                                            },
                                            
                                        ]
                                    },
                                ]
                            },
                            {
                                title: 'Objetivos'+(me.detalles?'':' <span style="color:red;font-weight:bold" data-qtip="'+
                                    me.etiquetas.lbFacturasObligatorio+'">*</span>'),
                                itemId:'tabobjetivos',
                                // frame:true,
                                tbar:[
                                    {
                                        text:'Generar facturas',
                                        tooltip: 'Generar facturas',
                                        itemId:'generarfacturas',
                                        action:'generarfacturas',
                                        iconCls:'gestionarfacturas',
                                        disabled:true
                                    }
                                ],
                                items:[
                                    {
                                        xtype: 'tabpanel',
                                        layout:'fit',
                                        itemId:'tabpanelobjetivos',
                                        frame:true,
                                        items:[
                                            {
                                                title:  me.etiquetas.lbObjetivos,
                                                itemId:'tabobjetivocomplimentado',
                                                layout:'fit',
                                                items:[
                                                    {
                                                        xtype     : 'textareafield',
                                                        labelAlign : 'top',
                                                        // grow      : true,
                                                        afterLabelTextTpl: me.detalles?'':required,
                                                        // allowBlank: false,
                                                        name      : 'objetivos',
//                                                         height:80,
                                                        height: 272,
                                                        maxLength : 255,
                                                        lengthText:me.etiquetas.msgMaximoValorPermitido,
                                                        // enforceMaxLength: true,
                                                        // validateOnChange:true,
                                                        readOnly: me.detalles,
                                                        itemId      : 'objetivos',
                                                        margin:'10 3 12 3',
                                                        listeners:{
                                                            change: function(yo, value){
                                                                me.down('#hitospago').setDisabled(yo.getValue());
                                                                me.down('#productos').setDisabled(yo.getValue());
                                                                me.down('#objetivosvalido').setValue(yo.getValue()?'valido':'');
                                                                if(yo.getValue())me.down('#generarfacturas').setDisabled(true);
                                                            }
                                                        }
//                                                         fieldLabel: me.etiquetas.lbObjetivos,
                                                    }

                                                ]
                                            },
//                                             {
//                                                 title:'Obligaciones financieras',
//                                                 items:[
                                                    Ext.create('GestionContrato.view.FormaPago.Hito.GridHitoPago',{
                                                        itemId:'hitospago',
                                                        title:'Obligaciones financieras',
                                                        sinAcciones:true,
                                                        height: 325,
//                                                         selType:'checkbox'
                                                        selModel: Ext.create('Ext.selection.CheckboxModel',{
                                                            listeners:{
                                                                selectionchange: function(sm, records){
                                                                    me.down('#tabobjetivocomplimentado').setDisabled(records.length>0);
                                                                    me.down('#productos').setDisabled(records.length>0);
                                                                    me.down('#objetivosvalido').setValue(records.length>0?'valido':'');
                                                                    me.down('#generarfacturas').setDisabled(records.length==0);
                                                                    me.down('#generarfacturas').setTooltip(records.length==0?
                                                                        'Generar facturas':'Generar facturas a partir de las obligaciones financieras');
                                                                    var hitos=[];
                                                                    if(records.length>0){
                                                                        records.forEach(function(x){
                                                                            hitos.push(parseInt(x.get('idhito')));
                                                                        });
                                                                    }
                                                                    me.down('#hitos').setValue(Ext.encode(hitos));
                                                                }
                                                            }
                                                        })
                                                    }),
//                                                 ]
//                                             },
//                                             {
//                                                 title:'Productos/Servicios',
//                                                 items:[
                                                    Ext.create('GestionContrato.view.FormaPago.Producto.GridProducto', {
                                                        itemId:'productos',
                                                        title:'Productos/Servicios',
                                                        sinAcciones:true,
                                                        editGrid:false,
                                                        height: 310,
                                                        selModel: Ext.create('Ext.selection.CheckboxModel',{
                                                            listeners:{
                                                                selectionchange: function(sm, records){
                                                                    me.down('#tabobjetivocomplimentado').setDisabled(records.length>0);
                                                                    me.down('#hitospago').setDisabled(records.length>0);
                                                                    me.down('#objetivosvalido').setValue(records.length>0?'valido':'');
                                                                    me.down('#generarfacturas').setDisabled(records.length==0);
                                                                    me.down('#generarfacturas').setTooltip(records.length==0?
                                                                        'Generar facturas':'Generar facturas a partir de los productos/servicios');
                                                                    var indicadores=[];
                                                                    if(records.length>0){
                                                                        records.forEach(function(x){
                                                                            indicadores.push(parseInt(x.get('idindicadorcontrato')));
                                                                        });
                                                                    }
                                                                    me.down('#indicadores').setValue(Ext.encode(indicadores));
                                                                }
                                                            }
                                                        })
                                                    })
//                                                 ]
//                                             }
                                        ]
                                    }
                                ]
                            },
                            {
                                title:me.etiquetas.lbFacturas+(me.detalles?'':' '
                                    +'<span style="color:red;font-weight:bold" data-qtip="'+
                                    me.etiquetas.lbFacturasObligatorio+'">*</span>'),
                                itemId:'tabfacturas',
                                // frame:true,
                                // layout:'anchor',
                                layout:{type:'vbox',align:'stretch'},
                                items:[
                                    Ext.create('SolicitudPago.view.GridFacturas',{
                                        // title:me.etiquetas.lbFacturas+' '
                                        // +'<span style="color:red;font-weight:bold" data-qtip="'+me.etiquetas.lbFacturasObligatorio+'">*</span>',
                                        selType: me.detalles?'rowmodel':'checkboxmodel',
                                        detalles:me.detalles,
                                        extrafields:me.extrafields,
                                        monedas_contrato:me.monedas_contrato,
                                        montos:me.montos, caso:me.caso,
                                        flex:1, height:165
                                    }),
                                    {
                                        xtype:'panel',
                                        frame:true,
                                        items:[
                                            {
                                                xtype: 'fieldset',
                                                title:me.etiquetas.lbImportesAPagar,
                                                itemId: 'totalesAPagar',
                                                anchor: '100%',
                                                layout: 'hbox',//frame:true,
                                                defaults: {
                                                    labelAlign: 'top',
                                                    readOnly: true,
                                                    flex: 1,
                                                    xtype: 'textfield',
                                                    margin: '0 2 5 2',
                                                    value: 0,
                                                    thousandSeparator: '.',
                                                    decimalSeparator: ',',
                                                    decimalPrecision: 2,
                                                    allowExponential: false,
                                                }
                                            },
                                            {
                                                xtype: 'fieldset',
                                                title:me.etiquetas.lbImportesContrato,
                                                itemId: 'totalesContratos',
                                                anchor: '100%',
                                                layout: 'hbox',//frame:true,
                                                defaults: {
                                                    labelAlign: 'top',
                                                    readOnly: true,
                                                    flex: 1,
                                                    xtype: 'textfield',
                                                    margin: '0 2 5 2',
                                                    value: 0,
                                                    thousandSeparator: '.',
                                                    decimalSeparator: ',',
                                                    decimalPrecision: 2,
                                                    allowExponential: false,
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        xtype:'container',
                                        itemId:'documentos_adjuntados',
                                        hidden:true,
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        xtype:'textfield',
                        itemId:'idsolicitudpago',
                        name:'idsolicitudpago',
                        hidden:true,
                    },
                    {
                        xtype:'textfield',
                        itemId:'idcontrato',
                        name:'idcontrato',
                        hidden:true,
                    },
                    {
                        xtype:'textfield',
                        hidden:true,
                        itemId:'facturasvalido',
                        allowBlank:false
                    },
                    {
                        xtype:'textfield',
                        hidden:true,
                        itemId:'objetivosvalido',
                        allowBlank:false
                    },
                    {
                        xtype:'textfield',
                        itemId:'hitos',
                        name:'hitos',
                        hidden:true,
                        value: '[]'
                    },
                    {
                        xtype:'textfield',
                        itemId:'indicadores',
                        name:'indicadores',
                        hidden:true,
                        value: '[]'
                    },
                ]
            }
        ];
        me.configurarMontos=function(){
            if(me.extrafields){
                me.extrafields.forEach(function(obj){
                    var contrato=0, montorestante=0, montosolicitudpago=0, textfieldimporte=null;
                    // console.log('monedas_contrato', me.monedas_contrato);
                    if(me.monedas_contrato)
                        me.monedas_contrato.forEach(function(x){
                            if(obj['idmonedaentidad']==x['idmonedaentidad']){
                                contrato=x['monto'];
                                montorestante=x['montorestante'];
                            }
                        });
                    if(me.down('#totalesContratos').down('#montocontrato'+obj['codigoiso'].toLowerCase())){
                        me.down('#totalesContratos').down('#montocontrato'+obj['codigoiso'].toLowerCase()).setValue(Ext.util.Format.currency(contrato));
                    }else {
                        me.down('#totalesContratos').add({
                            // fieldLabel: me.etiquetas.lbImporteContrato + ' (' + obj['codigoiso'] + ')',
                            fieldLabel: obj['codigoiso'],
                            itemId: 'montocontrato' + obj['codigoiso'].toLowerCase(),
                            name: 'montocontrato' + obj['codigoiso'].toLowerCase(),
                            value: Ext.util.Format.currency(contrato),
                        });
                    }
                    // console.log('me.montos', me.montos);
                    // if(me.montos)
                    //     me.monedas_contrato.forEach(function(y){
                    //         if(obj['idmonedaentidad']==y['idmoneda'])
                    //             montosolicitudpago=y['valor'];
                    //     });
                    // console.log('contrato',contrato)
                    var textfieldimporte=me.down('#totalesAPagar').down('#importepagar'+obj['codigoiso'].toLowerCase());
                    if(!textfieldimporte)
                        me.down('#totalesAPagar').add({
                            // fieldLabel:me.etiquetas.lbImporteAPagar+' '+obj['codigoiso'],
                            fieldLabel:obj['codigoiso'],
                            itemId:'importepagar'+obj['codigoiso'].toLowerCase(),
                            name:'importepagar'+obj['codigoiso'].toLowerCase(),
                            value:Ext.util.Format.currency(montosolicitudpago),
                            maxValue: montorestante,
                            maxText:montorestante?me.etiquetas.msgValorContratoExcedido+' ('+Ext.util.Format.currency(moneda)+')':''
                        });
                    textfieldimporte=me.down('#totalesAPagar').down('#importepagar'+obj['codigoiso'].toLowerCase());
                    if(montorestante<parseFloat(textfieldimporte.getValue()))
                        textfieldimporte.markInvalid(me.etiquetas.msgValorContratoExcedido+' ('+Ext.util.Format.currency(moneda)+')');
                });
            }
        }
        me.buttons=[me.btnCancelar, me.btnAplicar, me.btnAceptar];
        me.callParent();
        // if(me.caso=='add') {
            me.down('#gridfacturas').getStore().on('datachanged', function (store) {
                if(me.down('#facturasvalido'))
                    me.down('#facturasvalido').setRawValue(store.getCount() == 0 ? '' : 'validos');
                me.down('form').fireEvent('validitychange', me.down('form'), !me.down('form').hasInvalidField());
                // console.log('datachanged:', store.getCount(), me.down('#facturasvalido').getValue())
            });
        // }
        me.configurarMontos();


    }
});