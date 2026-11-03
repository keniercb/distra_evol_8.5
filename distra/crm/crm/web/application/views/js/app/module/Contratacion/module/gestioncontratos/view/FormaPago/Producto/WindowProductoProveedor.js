Ext.define('GestionContrato.view.FormaPago.Producto.WindowProductoProveedor', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.WindowProductoProveedor',
    // autoScroll: true,
    maximizable: true,
    layout: 'fit',
    // width: 700,
    // height: 220,
    defaultFocus:'descripcion',
    initComponent: function () {
        this.createInitialConfig();
        var self=this;
        self.etiquetas=LangMgr.getLang(self);
        if(this.action=='addproducto'){
            this.title=self.etiquetas.lbAdd+' '+(self.tipo==1?self.etiquetas.lbProd.toLowerCase():self.etiquetas.lbServ.toLowerCase()) //+self.etiquetas.lbProdServSingular.toLowerCase();
        }else if(this.action=='editproducto'){
            this.title=self.etiquetas.lbMod+' '+(self.tipo==1?self.etiquetas.lbProd.toLowerCase():self.etiquetas.lbServ.toLowerCase()) //+self.etiquetas.lbProdServSingular.toLowerCase();
        }
        this.callParent();
        if(self.action=='addproducto'){
            self.down('#tipo').setValue(self.tipo);
            self.down('#cantidad').setValue(1);
        }
        // this.down('form').doLayout();
        // setTimeout(function(){this.focus();},1000);

    },
    createInitialConfig:function(){
        var self=this;
        self.formItems=[
            {
                xtype:'textfield',
                fieldLabel:self.etiquetas.lbDescripcion,
                itemId:'descripcion',
                name:'descripcion',
                columnWidth:1,
                allowBlank:false,
                maxValue:20,
            },
            {
                xtype:'numberfield',
                fieldLabel:'Cantidad',
                itemId:'cantidad',
                name:'cantidad',
                columnWidth:0.33,
                minValue:1,
                value:1,
                allowExponential:false,
                allowDecimals:false,
            },
            {
                xtype:'textfield',
                fieldLabel:'Unidad de medida',
                itemId:'unidadmedida',
                name:'unidadmedida',
                columnWidth:0.34,
                emptyText:'Unidad'
            },
            {
                xtype:'combo',
                fieldLabel:'Tipo',
                itemId:'tipo',
                name:'tipo',
                columnWidth:0.33,
                valueField:'id',
                displayField:'denominacion',
                editable:false,
                // value:self.tipo,
                allowBlank:false,
                store:Ext.create('Ext.data.Store',{
                    fields:['id', 'denominacion'],
                    data:[{'id':1, 'denominacion':'Producto'},
                          {'id':2, 'denominacion':'Servicio'}]
                }),
                listeners:{
                    change:function(yo){
                        if(yo.getValue()==2){
                            self.down('#cantidad').valorAnterior=self.down('#cantidad').getValue();
                            self.down('#cantidad').setValue(1);
                            self.down('#cantidad').setReadOnly(true);
                        }else{
                            self.down('#cantidad').setValue(self.down('#cantidad').valorAnterior);
                            self.down('#cantidad').setReadOnly(false);
                        }
                    }
                }
            },
        ];

        if(self.extrafields){
            self.insertExtraFields();
        }
        self.form=Ext.create('Ext.ux.CustomForm',{
            // xtype: 'form',
            // region:'center',
            // frame:true,
            trackResetOnLoad:true,
            bodyStyle: 'background:#DFE9F6;',
            layout: 'column',
            defaults: {
                margin: 3,
                labelAlign: 'top'
            },
            items: self.formItems
        })
        self.items=[
            self.form
        ];
        // self.doLayout();

    },
    insertExtraFields: function () {
        // var pos = this.formItems.length;
        var me=this;
        Ext.each(this.extrafields, function (field, index) {
            me.formItems.push(this.newHiddenField(field));
            me.formItems.push(this.newNumberField(field, index, this.extrafields.length));
            // this.formItems.splice(pos, 0, this.newHiddenField(field));
            // this.formItems.splice(pos + 1, 0, this.newNumberField(field, index, this.extrafields.length));
            // pos += 2;
        }, this);
    },
    newHiddenField: function (field) {
        return Ext.create('Ext.form.field.Hidden', {
            name: 'idmoneda_' + field.codigoiso.toLowerCase(),
            value: field.idmoneda
        });
    },
    newNumberField: function (field, index, total) {
        var self = this;
        // var number = Ext.create('Ext.form.field.Number', {
        var number = Ext.create('Ext.ux.MoneyField', {
            fieldLabel: field.codigoiso.toUpperCase(),
            itemId: 'montomoneda_' + field.codigoiso.toLowerCase(),
            name: 'montomoneda_' + field.codigoiso.toLowerCase(),
            margin: 3,
            labelAlign: 'top',
            readOnly: false,
            columnWidth: total != 1 ? (100 / total) / 100 : 0.3,
            minValue: 0,
            decimalPrecision: 2,
            allowExponential: false,
            maskRe:/[0-9,.]/,
            nanText:self.etiquetas.vNumDomain.replace(' <#dominio#>', ''),
            // margin: index == total - 1 ? '0 0 0 0' : '0 5 0 0',
            // maxText:'El valor m&aacute;ximo para este campo es {0}.',
            maxText: self.etiquetas.msgNumeroMaximo,
            idmoneda: field.idmoneda,
            idmonedaentidad: field.idmonedaentidad,
        });
        if(this.windowParent.down('#montomoneda_' + field.codigoiso.toLowerCase())){
            if(this.windowParent.down(
                    '#montomoneda_' + field.codigoiso.toLowerCase()).introducidoManual) {
                var sumaUtilizada=0;
                if(this.windowParent.hitopago) {
                    Ext.each(this.windowParent.hitopago.getStore().getRange(), function (value, index) {
                        for (var i in value.get('pago')) {
                            if (value.get('pago')[i]['moneda'] == field.codigoiso && value.get('pago')[i]['monto'])
                                sumaUtilizada += parseFloat(value.get('pago')[i]['monto']);
                        }
                        // if(value.get('pago')['moneda']==field.codigoiso)
                        //     sumaUtilizada+=parseFloat(value.get('pago')['monto']);
                    });
                }
                Ext.each(this.windowParent.down('#gridindicadores').getStore().getRange(), function(value, index){
                    if(field.codigoiso=='CUP' && value.get('precio'))
                        sumaUtilizada+=parseFloat(value.get('precio'));
                    if(field.codigoiso=='CUC' && value.get('preciodivisa'))
                        sumaUtilizada+=parseFloat(value.get('preciodivisa'));
                });
                if(self.action=='edit'){
                    var datos=this.windowParent.down('#gridindicadores').getSelectionModel().getLastSelected().data;
                    if(datos) {
                        if (field.codigoiso == 'CUP')
                            sumaUtilizada = sumaUtilizada - datos.precio;
                        if (field.codigoiso == 'CUC')
                            sumaUtilizada = sumaUtilizada - datos.preciodivisa;
                    }
                }
                // console.log('sumaUtilizada', sumaUtilizada)
                var final=parseFloat(this.windowParent.down(
                    '#montomoneda_' + field.codigoiso.toLowerCase()).getValue())-sumaUtilizada;
                if(final>0 || (sumaUtilizada==this.windowParent.down(
                        '#montomoneda_' + field.codigoiso.toLowerCase()).getValue() && final==0)) {
                    number.setMaxValue(final);
                    number.maxText= self.etiquetas.msgNumeroMaximoProductoServicio+'<b>'+Ext.util.Format.currency(final)+'</b>.'
                }
            }
        }
        return number;
    }
});