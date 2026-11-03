Ext.ns('Fichas.Store');
Fichas.Store.Model = {
   init:function (view) {

       this.stfichas= new Ext.data.Store({

           url: 'loadFichas',
           scope: this,
           autoLoad: false,
           reader: new Ext.data.JsonReader({

                   root: 'datos',
                   totalProperty:'cantidad_filas'
               },
               [{
                   name: 'no_ficha'
               },
                   {
                       name: 'id_ficha'
                   },
                   {
                       name: 'nomEstado'
                   },
                   {
                       name: 'idcuenta'
                   },{
                   name: 'tipo_ficha'
               },{
                   name: 'id_cuenta_proveedor'
               },{
                   name: 'fecha_emision'
               },{
                   name: 'no_doc'
               },{
                   name: 'observacion'
               },{
                   name: 'id_proveedor'
               },{
                   name: 'id_operacion'
               },{
                   name: 'concatcuentaproveedor'
               },{
                   name: 'concatproveedor'
               },{
                   name: 'concatoperacion'
               },{
                   name: 'concattipodoc'
               },{
                   name: 'tipo_doc'
               },{
                   name: 'iddocumento'
               },{
                   name: 'showCmp'
               },{
                   name: 'numcomprobante'
               },{
                   name: 'importetotal'
               },{
                   name: 'tasa_actual'
               },{
                   name: 'tasa_apertura'
               },{
                   name: 'importe_total'
               },{
                   name: 'importe_liquidado'
               },{
                   name: 'id_derecho_obligacion'
               },{
                   name: 'importependiente'
               },{
                   name: 'no_doc_string'
               },{
                   name: 'perdidaganancia'
               }

               ]),

       });

       this.stcuentasporpagar= new Ext.data.Store({

           url: 'loadCuentaspagar',
           scope: this,
           autoLoad: true,
           // listeners:{
           //     'beforeload': function(store, options)
           //     {
           //         Ext.Msg.wait('Cargando... por favor espere!');
           //     },
           //     'load': function(store, options)
           //     {
           //
           //         Ext.Msg.hide()
           //     }
           // },
           reader: new Ext.data.JsonReader({
                   totalProperty: 'cantidad_filas',
                   root: 'datos'
               },
               [{
                   name: 'fechaemision'
               },
                   {
                       name: 'no_doc'
                   },
                   {
                       name: 'nomEstado'
                   },
                   {
                       name: 'showCmp'
                   },
                   {
                       name: 'id_cuentaspagar'
                   },
                   {
                       name: 'id_cuenta'
                   },
                   {
                       name: 'tipo_documento'
                   },
                   {
                       name: 'operacion'
                   },
                   {
                       name: 'concattipodoc'
                   },
                   {
                       name: 'concatoperacion'
                   },
                   {
                       name: 'observacion'
                   },
                   {
                       name: 'id_doc'
                   },
                   {
                       name: 'iddocumento'
                   },{
                   name: 'numcomprobante'
               },{
                   name: 'importetotalreal'
               }

               ]),

       });


       this.stcancelarliquidacionfichas= new Ext.data.Store({

           url: 'liquidarFicha',
           scope: this,
           autoLoad: false,
           reader: new Ext.data.JsonReader({

                   root: 'datos',
                   totalProperty:'cantidad_filas'
               },
               [{
                   name: 'importemo'
               },{
                   name: 'idcuenta'
               },{
                   name: 'idliquidacion'
               },{
                   name: 'idderechouobligacion'
               },{
                   name: 'concatcuenta'
               },{
                   name: 'num_instrumento'
               },


               ]),

       });
    }
};