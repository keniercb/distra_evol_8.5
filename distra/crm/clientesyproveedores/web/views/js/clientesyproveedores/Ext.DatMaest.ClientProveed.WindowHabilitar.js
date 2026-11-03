Ext.ns('Ext.DatMaest.ClientProveed');
Ext.DatMaest.ClientProveed.WindowHabilitar=Ext.extend(Ext.Window,{
    autoScroll: false,
    maximizable: true,
    refhelp: '',
    layout: 'fit',
    // height: 250,
    width: 500,
    model:true,
    constrain:true,
    constructor: function (params) {
        var me=this;
        me.etiquetas = params.etiquetas || {};
        // console.log('params:', params)
        // console.log('params guardar:', params.guardar)
        // console.log('me.guardar:', me.guardar)
        me.guardar=params.guardar;
        me.title=me.guardar?'Habilitar cliente/proveedor':'Ver argumento';
        me.height=me.guardar?240:300;
        me.tfEstado=new Ext.form.TextField({
            anchor: '100%',
            readOnly:true,
            name: 'estado',
            hidden: me.guardar,
            fieldLabel: 'Estado',
        });
        me.tfHabilitadoPor=new Ext.form.TextField({
            anchor: '100%',
            readOnly:true,
            name: 'argumentousuario',
            hidden: me.guardar,
            fieldLabel: 'Realizado por',
        });
        me.container=new Ext.form.FieldSet({
            anchor: '100%',
            layout:'column',
            hidden: me.guardar,
            height:60,
            items:[
                {
                    columnWidth: 0.30,
                    // labelAlign: 'top',
                    layout: 'form',
                    margin: '0 10 0 0',
                    items: me.tfEstado
                },
                {
                    columnWidth: 0.70,
                    // labelAlign: 'top',
                    layout: 'form',
                    items: me.tfHabilitadoPor
                }
            ]
        });
        me.taArgumento = new Ext.form.TextArea({
            readOnly:!me.guardar,
            anchor: '100%',
            name: 'argumento',
            maxLength: 255,
            height:140,
            // tabIndex: 16,
            allowBlank: false,
            // labelSeparator: '',
            // labelSeparator: ':' + '<span style="color:red;font-weight:bold" qtip="Obligatorio">*</span>',
            fieldLabel: _this.etiquetas.lbArgumento+'<span style="color:red;font-weight:bold" qtip="Obligatorio">*</span>',
            // fieldLabel: 'fhdfhfdhdfhdhdhdfh',
            blankText: _this.etiquetas.textCampoObligatorio,
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield, event) {
                    if(textfield.getValue()){
                        me.btnAccept.enable();
                    }else{
                        me.btnAccept.disable();
                    }
                }
            }
        });
        var items=[this.taArgumento];
        if(!me.guardar)items.splice(0, 0, me.container);
        this.form = new Ext.form.FormPanel({
            frame: true,
            border: false,
            region: 'north',
            trackResetOnLoad: true,
            // height: 70,
            labelAlign: 'top',
            items: items
            // items: [this.tfHabilitadoPor, this.taArgumento]
        });
        me.items=[
            this.form
        ];

        this.btnAccept = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            text: this.etiquetas.lbBtnAceptar,
            tooltip: this.etiquetas.lbTtAceptar,
            handler: function () {
                var _this=this,
                    records = me.gridclienteproveedor.smClienteProveedor.getSelections();
                  //  console.log('records:', records);
                // console.log('_this.habilitar:', me.habilitar)
                me.principal.onloadMessageBox(me.etiquetas.lbEsperando, me.habilitar==1?'Habilitando cliente/proveedor':'Deshabilitando cliente/proveedor');
                Ext.Ajax.request({
                    url: 'habilitarClienteProveedor',
                    method: 'POST',
                    params: {
                        idclienteproveedorentidad: records[0].data.idclienteproveedorentidad,
						idclienteproveedor: records[0].data.idclientesproveedores,
						idtipo: records[0].data.idtipo,
                        argumento: me.taArgumento.getValue(),
                        habilitar: me.habilitar
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.code == -1) {
                            mostrarMensaje(1, me.habilitar==1?me.etiquetas.msgHabilitadoClienteProveedor:
                                me.etiquetas.msgDeshabilitadoClienteProveedor);
                        }
                        Ext.MessageBox.hide();
                        // _this.keyMap.enable();
                        me.close();
                        me.gridclienteproveedor.store.load();
                    }
                });
            }
        });

        this.defaultButton = this.btnCancel = new Ext.Button({
            iconCls: 'cancelar',
            text: this.etiquetas.lbBtnCancelar,
            tooltip: this.etiquetas.lbTtCancelar,
            handler: function () {
                me.destroy();
            }
        });

        this.btnCerrar = new Ext.Button({
            iconCls: 'cerrar',
            text: this.etiquetas.lbCerrar,
            tooltip: this.etiquetas.lbCerrar,
            handler: function () {
                me.destroy();
            }
        });
        me.buttons = this.guardar?[this.btnCancel, this.btnAccept]:[this.btnCerrar];

        Ext.DatMaest.ClientProveed.WindowHabilitar.superclass.constructor.call(this, params);

    }
});