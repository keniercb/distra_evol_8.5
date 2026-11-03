Ext.define('GestionContratoImportacion.view.WindowPedido', {
    extend: 'Ext.ux.CustomWindow',
    title: 'Adicionar pedido',
    alias: 'widget.windowPedidoimportacion',
    itemId: 'windowpedido',
    layout: 'anchor',
    constrain: true,
    modal: true,
    // frame: false,
    border: false,
    width: 800,
    minWidth: 580,
    height: window.innerHeight*0.95,
    resizable: false,
    // height: 300,
    // minHeight: 120,
    // layout:{
    //     type: 'hbox',
    //     align: 'stretch'
    // },
    maximizable: false,
    defaultFocus:'descripcion',
    onlyDetails: false,
    layout:{
        type: 'vbox',
        align: 'stretch'
    },
    // default
    initComponent: function(){
        var me=this;

        me.items= [
            Ext.create('Ext.ux.CustomForm', {
                // bodyStyle: 'background:#DFE9F6;',
                // margin: '5 5 0 5',
                frame: true,
                // region: 'north',
                // height: 160,
                trackResetOnLoad:true,
                layout: 'column',
                closeAction: 'destroy',
                items: [
                    {
                        xtype: 'textarea',
                        labelAlign: 'top',
                        fieldLabel: 'Descripción',
                        itemId: 'descripcion',
                        name: 'descripcion',
                        anchor: '100%',
                        allowBlank: false,
                        columnWidth: 1,
                        height: 90,
                        readOnly: me.onlyDetails

                    },
                    {
                        xtype: 'datefield',
                        labelAlign: 'top',
                        fieldLabel: 'Fecha creación',
                        name: 'fechacreacion',
                        anchor: '100%',
                        readOnly: true,
                        value: new Date(),
                        columnWidth: .5,
                        margin: '0 5 0 0',
                        endDateField: 'fechaestimada'

                    },
                    {
                        xtype: 'datefield',
                        labelAlign: 'top',
                        fieldLabel: 'Fecha estimada',
                        name: 'fechaestimada',
                        anchor: '100%',
                        allowBlank: false,
                        columnWidth: .5,
                        // minValue: new Date(),
                        readOnly: me.onlyDetails,

                    },
                    {
                        xtype: 'textfield',
                        hidden: true,
                        itemId: 'validogridpedidos',
                        allowBlank: false
                    }

                ],
                // listeners:{
                //     validitychange: function(yo, valid){
                //         console.log('validity change 1')
                //         me.btnAceptar.setDisabled(!valid)
                //     }
                // }
            }),
            Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                title: 'Listado de productos del contrato',
                itemId: 'gridproductopedidocontrato',
                selType: 'checkboxmodel',
                sinAcciones: true,
                // height: 180,
                minHeight: 180,
                flex:1,
                indicadorStoreId: 'productoPedidoContratoStore',
                editGrid: false,
                monedasentidad: me.extrafields,
                visibleColumns: [
                    'numero', 'codigo', 'denominacion', 'cantidad',
                    'total', 'importe', 'cantidad_max', 'tipo'],
                selModel: Ext.create('Ext.selection.CheckboxModel',{
                    listeners: {
                        selectionchange: function(yo, records){
                            me.down('#adicionaralpedido').setDisabled(records.length==0)
                        }
                    }
                }),
                hidden: me.onlyDetails,
                // viewConfig: {
                //     stripeRows: false,
                //     getRowClass: function (record, rowIndex, rowParams, store) {
                //         console.log(record.get('cantidad')<=record.get('cantidad_max'), record.get('cantidad'),record.get('cantidad_max'))
                //         if(record.get('cantidad')<=record.get('cantidad_max'))
                //             return 'eliminado';
                //         return '';
                //     }
                // }
            }),
            {
                xtype: 'toolbar',
                align: 'center',
                hidden: me.onlyDetails,
                items:[
                    {
                        text: 'Adicionar al pedido',
                        tooltip: 'Adicionar productos al pedido',
                        iconCls: 'adicionar',
                        itemId: 'adicionaralpedido',
                        disabled: true,
                        handler: function(){
                            var exists=[], agotados=[];
                            me.down('#gridproductopedidocontrato').getSelectionModel().getSelection().forEach(function(x){
                                console.log(x.data['codigo'], x.data['activo'], '--', me.down('#gridproductopedido').getStore().find('codigo', x.data['codigo'], 0, false, false, true))
                                if(x.data['activo']===false) {
                                    agotados.push(x.data.codigo);
                                }else{
                                    if (me.down('#gridproductopedido').getStore().find('codigo', x.data['codigo'], 0, false, false, true) == -1) {
                                        var cloneRecord = x.copy();
                                        Ext.data.Model.id(cloneRecord);
                                        cloneRecord.data['cantidad'] = cloneRecord.data['cantidad_max'];
                                        me.down('#gridproductopedido').getStore().add(cloneRecord);
                                    } else {
                                        exists.push(x.data.codigo);
                                    }
                                }
                            });
                            if(exists.length>0 || agotados.length>0){
                                var mensaje='';
                                if(exists.length>0)
                                    mensaje+='Ya están adicionados al pedido:<br>-'+exists.join('<br>-');
                                if(agotados.length>0)
                                    mensaje+='Ya están agotados:<br>-'+agotados.join('<br>-');
                                mostrarMensaje(7, mensaje);
                            }

                        }
                    },
                    {
                        text: 'Eliminar del pedido',
                        tooltip: 'Eliminar productos del pedido',
                        iconCls: 'eliminar',
                        itemId: 'eliminardelpedido',
                        disabled: true,
                        handler: function(){
                            var dialog = Ext.create('Ext.window.MessageBox', {
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        text: 'Aceptar',
                                        iconCls: 'aceptar',
                                        handler: function () {
                                            me.down('#gridproductopedido').getStore().remove(me.down('#gridproductopedido').getSelectionModel().getSelection())
                                            dialog.close();
                                        }
                                    },
                                    {
                                        text: 'Cancelar',
                                        iconCls: 'cancelar',
                                        handler: function () {
                                            dialog.close();
                                        }
                                    }
                                ]
                            });
                            dialog.show({
                                title: me.etiquetas.lbConfirmacion,
                                msg: '¿Está seguro que desea quitar del pedido?',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    }
                ]
            },
            Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                title: 'Productos del pedido',
                itemId: 'gridproductopedido',
                selType: me.onlyDetails?'selmodel':'checkboxmodel',
                // sinAcciones: true,
                sinToolbar: true,
                // height: me.onlyDetails? 200:150,
                minHeight: 180,
                flex:1,
                indicadorStoreId: 'productoPedidoStoreImportacion',
                desdeSeguimiento: true,
                editGrid: !me.onlyDetails,
                monedasentidad: me.extrafields,
                visibleColumns: [
                    'numero', 'codigo', 'denominacion', 'cantidad',
                    'total', 'importe'],
                selModel: Ext.create('Ext.selection.CheckboxModel',{
                    listeners: {
                        selectionchange: function(yo, records){
                            me.down('#eliminardelpedido').setDisabled(records.length==0);
                        }
                    }
                })
            })
        ];

        me.callParent();
        if(me.onlyDetails){
            me.btnAceptar.setVisible(false);
            me.btnCancelar.setText('Cerrar');
        }
    }

});