Ext.define('SolicitudPago.view.WindowFactura',{
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.sp_facturawindow',
    layout: 'fit',
    // title: 'Adicionar factura',
    width:560,
    minWidth:460,
    minHeight:100,
    defaultFocus:'numero',
    initComponent:function(){
        var me=this;
        me.etiquetas = LangMgr.getLang(this);
        var required = '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>';
        me.archivo=Ext.create('Ext.form.field.File',{
            // xtype: 'filefield',
                // vtype:'fileUpload',
            fieldLabel: me.etiquetas.lbCargarDocumento,
            emptyText: me.etiquetas.lbSeleccioneArchivo,
            // name: 'doc_'+me.realNumber,
            // itemId: 'archivo',
            // afterLabelTextTpl: required,
            hidden: me.detalles,
            regex:/^.*\.(doc|docx|pdf|odt|jpg|jpeg|png|bmp)$/i,
            regexText:me.etiquetas.msgFormatoDocumento,
            // allowBlank: false,
            readOnly:true,
            // readOnly:me.caso=='mod',
            buttonText: '',
            buttonConfig: {
                iconCls: 'icondistra-subirfichero icon-fileupload'
            },
            flex:1, labelAlign:'top',//margin:'3 3 3 3',
            listeners: {
                specialkey: function(field, e){
                    if(e.getKey() == e.DELETE || e.getKey() == e.BACKSPACE) {
                        me.archivo.setValue(0);
                        me.archivo.setRawValue("");
                    }
                },
                render: function (event) {
                    this.getEl().on('change', function (e, t, eOpts) {
                        // formulario.down('#envio_archivo').setValue(1);
                        var division=event.rawValue.split('\\');
                        me.down('#archivoNombre').setValue(division[division.length-1])

                    });
                }
            },
        });
        me.items=[
            {
                xtype:'form',
                frame:true,
                trackResetOnLoad:true,
                defaults:{
                    anchor:'100%',
                    xtype:'container',
                    layout:'hbox',
                    defaults:{
                        flex:1, labelAlign:'top',margin:'3 3 3 3'
                    }
                },
                items:[
                    {
                        items:[
                            {
                                xtype:'textfield',
                                fieldLabel: me.etiquetas.lbNumFactura,
                                name:'numero',
                                afterLabelTextTpl: required,
                                allowBlank: false,
                                itemId:'numero',
                                // regex:/[0-9]/,
                                // regexText:me.etiquetas.msgSoloNumeros,
                                // allowDecimals:false,
                                // allowExponential:false,
                                // minValue:1,
                                // listeners:{change:function(yo){
                                //     console.log('chnageeee:', yo.getValue())
                                //     me.archivo.name='doc_'+yo.getValue();
                                // }}
                            },
                            {
                                xtype:'container',
                                layout:'hbox',
                                items:[
                                    me.archivo,
                                    {
                                        xtype: 'button',
                                        tooltip: me.etiquetas.lbVerDocumento,
                                        itemId: 'mostrarArchivo',
                                        iconCls: 'icondistra-descargar icon-medium',
                                        action: 'showfile',
                                        hidden: true,
                                        flex: null,
                                        // href:'',
                                        margin: '18 3 0 0',
                                        style: {
                                            borderWidth: '1px !important;'
                                        }
                                    },
                                    {
                                        xtype: 'textfield',
                                        itemId: 'archivoNombre',
                                        name: 'archivoNombre',
                                        hidden: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        margin:'3 0 10 2',
                        itemId:'containerImportes',
                        items:[
                            // {
                            //     xtype: 'numberfield',
                            //     fieldLabel: 'Importe CUP',
                            //     name:'importecup',
                            //     allowBlank: false,
                            //     afterLabelTextTpl: required,
                            //     itemId:'importecup',
                            //     decimalSeparator: ',',
                            //     preventMark: true,
                            //     thousandSeparator: '.',
                            //     forcePrecision: true,
                            //     minValue:0,
                            //     allowExponential:false,
                            // },{
                            //     xtype: 'numberfield',
                            //     fieldLabel: 'Importe CUC',
                            //     name:'importecuc',
                            //     afterLabelTextTpl: required,
                            //     allowBlank: false,
                            //     itemId:'importecuc',
                            //     decimalSeparator: ',',
                            //     preventMark: true,
                            //     thousandSeparator: '.',
                            //     forcePrecision: true   ,
                            //     minValue:0,
                            //     allowExponential:false,
                            // }
                        ]
                    },
                    {
                        xtype:'textfield',
                        itemId:'idfactura',
                        name:'idfactura',
                        hidden:true,
                    },
                    // {
                    //     xtype:'textfield',
                    //     itemId:'realnumber',
                    //     name:'realnumber',
                    //     hidden:true,
                    //     value:me.realNumber
                    // }

                ]
            }
        ];

        me.calcularMontos=function(){
            // console.log('me.extrafields', me.extrafields)
            if(me.extrafields){
                me.extrafields.forEach(function(obj){
                    var moneda=0;
                    // console.log('me.montos', me.montos)
                    if(me.montos)
                        me.montos.forEach(function(x){
                            if(obj['idmoneda']==x['idmoneda']){
                                // moneda=x['monto'];
                                moneda=parseFloat(x['restante']);
                                var restante=0;
                                if(me.totales.down('#importepagar'+x['codigoiso'].toLowerCase())){
                                    var sumatoria=parseFloat(me.totales.down('#importepagar' + x['codigoiso'].toLowerCase()).getValue().replace('.', '').replace(',', '.'));
                                    if(me.gridfacturas.caso=='add') {
                                        var restante = sumatoria
                                        // console.log('restante', restante)
                                    }else if(me.gridfacturas.caso=='mod'){
                                        var restante=sumatoria-parseFloat(
                                            me.totales.down('#importepagar' + x['codigoiso'].toLowerCase()).originalValue)
                                    }
                                }
                                if(me.selected.length>0 && me.caso=='mod') {
                                    // console.log('selected',me.selected[0].get('importe'+x['codigoiso'].toLowerCase()))
                                    moneda = moneda + parseFloat(me.selected[0].get('importe' + x['codigoiso'].toLowerCase()));
                                }
                                // console.log('moneda',moneda)
                                // console.log('restante',restante)
                                moneda=moneda-restante;
                            }
                        });
                    me.down('#containerImportes').add(
                        Ext.create('Ext.ux.MoneyField', {
                        // fieldLabel:me.etiquetas.lbImporte+' '+obj['codigoiso'],
                        fieldLabel:obj['codigoiso'],
                        itemId:'importe'+obj['codigoiso'].toLowerCase(),
                        name:'importe'+obj['codigoiso'].toLowerCase(),
                        // xtype:'numberfield',
                        allowBlank: false,
                        afterLabelTextTpl: required,
                       // thousandSeparator: '.',
                       //decimalSeparator: ',',
                        minValue:0,
                        // preventMark: true,
                        decimalPrecision:2,
                        // forcePrecision: true,
                        
                        value:0,
                        maskRe: /[0-9,.]/,
                        nanText: me.etiquetas.vNumDomain.replace(' <#dominio#>', ''),
                        allowExponential:false,
                        maxValue:moneda,
                        maxText:me.etiquetas.msgValorRestanteExcedido+' ('+Ext.util.Format.currency(moneda)+')',
                        // setValue: function(v){
                        //     console.log('metodo set value')
                        //     v = typeof v == 'number' ? v : String(v).replace(",", ".").replace(/,/g, "");
                        //     console.log('v:', v);
                        //     var parseString = '00';
                        //     if(this.decimalPrecision>0) {
                        //         parseString += '.';
                        //
                        //         for(var i=0;i<this.decimalPrecision;i++)
                        //             parseString += '0';
                        //     }
                        //     console.log('parseString:', parseString);
                        //     console.log('this.fixPrecision(String(v)):', this.fixPrecision(String(v)));
                        //     console.log('this.fixPrecision(v):', this.fixPrecision(v));
                        //     //so provide parseString like 00.000 for decimalPrecision==3
                        //     v = Ext.util.Format.number(this.fixPrecision(String(v)), parseString);
                        //     console.log('v:', v);
                        //
                        //     this.setRawValue(this.fixPrecision(v));
                        //     return Ext.form.NumberField.superclass.setValue.call(this, v);
                        // },
                    }))
                });

            }
        };

        me.callParent();

        me.defaultFocus='numero';
        me.calcularMontos();
    }
});