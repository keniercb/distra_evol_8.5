Ext.define('GestionContratoImportacion.view.FormaPago.Hito.HitoPagoWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.HitoPagoWindowimportacion',

    autoScroll: false,
    maximizable: true,
    layout: 'border',
    width: 800,
    height: 430,
    resizable:false,
    // height: 520,

    initComponent: function () {
        this.createInitialConfig();

        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        if(this.action=='add'){
            this.title=me.etiquetas.lbAdicionarHito;
        }else if(this.action=='edit'){
            this.title=me.etiquetas.lbModificarHito;
            // this.title='Modificar hito de pago';
        }
        me.numero = Ext.create('Ext.form.field.Hidden', {
            name: 'numero'
        });

        me.first = me.descripcion = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbDescripcion,
            name: 'descripcion',
            enableVar: false,
            allowBlank: false,
            first: true,
            enableSourceEdit: false,
            maxLength: 255,
            columnWidth: 1,
            height: 70,
            editable:false,
        });

        me.hfiguala= Ext.create('Ext.form.field.Hidden', {
            context: 'hitopagoiguala',
            name: 'idperiodicidad'
        });

        me.cmbIguala=Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbIguala,
            name: 'periodicidad',
            mapping: 'NomPeriodicidad.denominacion',
            localId: 'idperiodicidad',
            module: 'Nomencladores',
            noactions: true,
            context: 'hitopagoiguala',
            allowBlank: false,
            controller: 'gestioncontratomainwindowperiodicidad',
            flex: 1,
            columnWidth: 0.24,
            margin: '0 10 0 0',
        });

        me.vigencia = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbDuracion,
            name: 'vigencia',
            columnWidth: 0.13,
            margin: '0 10 0 0',
            allowBlank: false,
            maxValue: 999,
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            nanText: me.etiquetas.msgErrorValorVigencia,
            minText: me.etiquetas.msgErrorValorVigencia,
            maxText: me.etiquetas.msgErrorValorVigencia
        });

        me.storeUnidadTiempo = Ext.create('Ext.data.Store', {
            fields: ['idunidadtiempo', 'denominacion'],
            data: [
                {"idunidadtiempo": 1, "denominacion": me.etiquetas.lbUTDay},
                {"idunidadtiempo": 2, "denominacion": me.etiquetas.lbUTWeek},
                {"idunidadtiempo": 3, "denominacion": me.etiquetas.lbUTMonth}
            ]
        });

        me.unidadTiempo = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '',
            hideLabel: true,
            store: me.storeUnidadTiempo,
            queryMode: 'local',
            valueField: 'idunidadtiempo',
            displayField: 'denominacion',
            value:1,
            columnWidth: 0.13,
            name: 'unidadtiempo',
            editable: false,
            margin: '17 10 0 0',
            allowBlank: false
        });

        me.hfresponsable = Ext.create('Ext.form.field.Hidden', {
            name: 'idpersona'
        });

        me.cmbreponsable = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbResponsableContrato,
            name: 'nombrepersona',
            mode: 'remote',
            minChars: 0,
            pageSize: 10,
            flex: 1,
            autoExpand: false,
            hidden: true,
            store: me.stresponsable,
            valueField: 'nombreapellidos',
            displayField: 'nombreapellidos',
            queryParam: 'nombreapellidos',
            localId: 'idpersona',
            allowBlank: true,
            columnWidth: 0.5,
            margin: '0 5 0 0'
        });

        me.fechaEstimada = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaEstimada,
            name: 'fechaestimada',
            columnWidth: 0.16,
            margin: '0 0 0 0',
            minText: me.etiquetas.msgFechaEstimadamenorFechafirma
        });

        me.calcularFechaEstimada=Ext.create('Ext.button.Button',{
            itemId:'calcularFechaEstimada',
            iconCls:'icondistra-calcular',
            ui:'default-toolbar-small',
            tooltip:'Calcular fecha estimada a partir de fecha de firma.',
            margin: '18 10 0 0',
            columnWidth: 0.04,
            disabled:true
        });

        me.hfarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea'
        });

        me.cmbarea = Ext.create('GestionContratoImportacion.view.CmbArea', {
            localId: 'idarea',
            name: 'nombrearea',
            fieldLabel: me.etiquetas.lbArea,
            columnWidth: 0.30,
            allowBlank: false,
            editable:false,
            listeners: {
                select: function (yo, records) {
                    me.hfarea.setValue(records[0].data[yo.localId]);
                },
                change: function (yo, value) {
                    if(Ext.isEmpty(value)){
                        me.hfarea.setValue('');
                    }
                }
            }
        });

        me.meses = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbMeses,
            name: 'meses',
            columnWidth: 0.25,
            minValue: 0,
            value: 0,
            decimalSeparator: '.',
            decimalPrecision: 40,
            flex: 1
        });

        me.formItems = [
            me.numero, me.descripcion,
            me.vigencia,me.unidadTiempo,me.hfiguala, me.cmbIguala, me.hfresponsable, me.cmbreponsable,
            me.fechaEstimada,me.calcularFechaEstimada,me.cmbarea,me.hfarea
        ];

        me.pagoAlternativo = Ext.create('GestionContratoImportacion.view.FormaPago.Alternativo.PagoAlternativo');
        if (me.extrafields) {
            me.insertExtraFields();
        }

        me.form = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',
            margin: '5 5 0 5',
            region: 'north',
            height: 160,
            trackResetOnLoad:true,
            items: me.formItems
        });

        me.productosservicios = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
            region: 'center',
            // storeId: 'hitoIndicadorStoreImportacion',
            indicadorStoreId: 'hitoIndicadorStoreImportacion',
            margin: '5 5 5 5',
            context:me.context,
            title: me.etiquetas.lbProdServ
        });

        me.items = [
            me.form,
            me.productosservicios
        ];
    },
    insertExtraFields: function () {
        var pos = this.formItems.length;
        Ext.each(this.extrafields, function (field, index) {
            this.formItems.splice(pos, 0, this.newHiddenField(field));
            this.formItems.splice(pos + 1, 0, this.newNumberField(field, index, this.extrafields.length));
            pos += 2;
        }, this);
    },
    newHiddenField: function (field) {
        return Ext.create('Ext.form.field.Hidden', {
            name: 'idmoneda_' + field.codigoiso.toLowerCase(),
            value: field.idmoneda
        });
    },
    newNumberField: function (field, index, total) {
        var self=this;
        // var number= Ext.create('Ext.form.field.Number', {
        var number= Ext.create('Ext.ux.MoneyField', {
            fieldLabel: field.codigoiso.toUpperCase(),
            itemId:'montomoneda_' + field.codigoiso.toLowerCase(),
            name: 'montomoneda_' + field.codigoiso.toLowerCase(),
            readOnly: false,
            columnWidth: total != 1 ? (100 / total) / 100 : 0.3,
            minValue: 0,
            decimalPrecision: 2,
            allowExponential:false,
            maskRe:/[0-9,.]/,
            nanText:self.etiquetas.vNumDomain.replace(' <#dominio#>', ''),
            margin: index == total - 1 ? '0 0 0 0' : '0 10 0 0',
            maxText:self.etiquetas.msgNumeroMaximoHito+' <b>({0})</b>.',
            idmoneda:field.idmoneda,
            idmonedaentidad:field.idmonedaentidad,
            // enableKeyEvents:true,
            // validator:function(valor){
            //     var suma = {'cup': 0, 'cuc': 0};
            //     Ext.each(self.productosservicios.getStore().getRange(), function (valor) {
            //         suma['cup'] += parseFloat(valor.get('precio'));
            //         suma['cuc'] += parseFloat(valor.get('preciodivisa'));
            //     });
            //     console.log(suma);
            //     if (valor.replace(',', '.') < parseFloat(suma[this.getItemId().split('_')[1]])) {
            //         return self.etiquetas.msgSumaServicioProductos +
            //             ' <b>(' + Ext.util.Format.currency(suma[this.getItemId().split('_')[1]]) + ')</b>'
            //     }
            //     return true;
            // },
            // listeners: {
            //     keyup: function (yo, e) {
            //         self.introducidoManual(yo);
            //     }
            // }
        });
        // number.addListener('spin', function(){
        //     setTimeout(function(){
        //         self.introducidoManual(number);
        //     },200)
        // }, number);
        if(this.wincontrato.formaPago.down('#montomoneda_' + field.codigoiso.toLowerCase())){
            if(this.wincontrato.formaPago.down(
                    '#montomoneda_' + field.codigoiso.toLowerCase()).introducidoManual) {
                var sumaUtilizada=0;
                Ext.each(this.wincontrato.formaPago.hitopago.getStore().getRange(), function(value, index){
                    for(var i in value.get('pago')){
                        if(value.get('pago')[i]['moneda']==field.codigoiso && value.get('pago')[i]['monto'])
                            sumaUtilizada+=parseFloat(parseFloat(value.get('pago')[i]['monto']).toFixed(2));
                    }
                    sumaUtilizada+=parseFloat(parseFloat(value.get('pago')['monto']).toFixed(2));
                });
                Ext.each(this.wincontrato.formaPago.indicadores.getStore().getRange(), function(value, index){
                    if(field.codigoiso=='CUP' && value.get('precio'))
                        sumaUtilizada+=parseFloat(parseFloat(value.get('precio')).toFixed(2));
                    if(field.codigoiso=='CUC' && value.get('preciodivisa'))
                        sumaUtilizada+=parseFloat(parseFloat(value.get('preciodivisa')).toFixed(2));
                });
                if(self.action=='edit'){
                    var pagos=self.wincontrato.formaPago.hitopago.getSelectionModel().getSelection()[0].data.pago;
                    for(var i in pagos){
                        if(pagos[i]['moneda']==field.codigoiso)
                            sumaUtilizada=sumaUtilizada-pagos[i]['monto'];
                    }
                }
                var final=this.wincontrato.formaPago.down(
                    '#montomoneda_' + field.codigoiso.toLowerCase()).getValue()-sumaUtilizada;
                if(final>0 || (sumaUtilizada==this.wincontrato.formaPago.down(
                        '#montomoneda_' + field.codigoiso.toLowerCase()).getValue() && final==0)){
                    number.setMaxValue(final);
                    number.maxText=self.etiquetas.msgNumeroMaximoHito+'<b>'+Ext.util.Format.currency(final)+'</b>.';
                }
            }
        }
        // if(this.getMainWindow())
        return number;
    },
    introducidoManual:function(campo){
        var manual=!campo.up('window').comprobarVacioMontos()
            Ext.each(campo.up('window').extrafields,function (field, index) {
                var actual=campo.up('window').down('#montomoneda_'+field.codigoiso.toLowerCase());
                if(actual){
                    actual.introducidoManual=true;
                    manual?actual.addCls('introducidomanual'):actual.removeCls('introducidomanual');
                }
            });
    },
    comprobarVacioMontos: function(){
        var valor=false, self=this;
        Ext.each(self.extrafields,function (field, index) {
            if(self.down('#montomoneda_'+field.codigoiso.toLowerCase())){
                if(['', undefined, null].indexOf(
                        self.down('#montomoneda_'+field.codigoiso.toLowerCase()).getValue())==-1)
                    valor=true;
            }
        });
        return !valor;
    },
    cambiarMontosPorHitosIndicadores: function(){
        // console.log('cambiarMontosPorHitosIndicadores')
        var self=this,
            montosIndicadores=self.calcularTotalMontosIndicadoresDetallados();
        Ext.each(self.extrafields,function (field, index) {
            var actual=self.down('#montomoneda_'+field.codigoiso.toLowerCase());
            // console.log('actual ccc:', montosIndicadores[field.codigoiso],actual)
            if(actual){
                if(!actual.introducidoManual){
                    actual.setValue(montosIndicadores[field.codigoiso]);
                }
            }
        })
    },
    calcularTotalMontosIndicadoresDetallados:function(usandoCantidad){
        var self=this, sumaUtilizada={'total':0, 'CUP':0, 'CUC':0};
        if(usandoCantidad==undefined)usandoCantidad=true;
        Ext.each(self.productosservicios.getStore().getRange(), function(value, index){
            var cup=parseFloat(value.get('precio').toFixed(2));
            var cuc=parseFloat(value.get('preciodivisa').toFixed(2));
            if(usandoCantidad){
                cup=cup*parseFloat(value.get('cantidad'));
                cuc=cuc*parseFloat(value.get('cantidad'));
            }
            sumaUtilizada['CUP']+=cup;
            // if(field.codigoiso=='CUC')
            sumaUtilizada['CUC']+=cuc;
            sumaUtilizada['total']+=cup+cuc;
        });
        return sumaUtilizada;
    },
});
