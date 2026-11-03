Ext.ns('Desagregacion.Store');
Desagregacion.Store.Model = {
   init:function (seleccion,view) {
            this.store_desagregacion = new Ext.data.Store({
            url: 'cargardesagregacion',
            scope: this,
                listeners: {
                    'beforeexpandnode': function(st, rec)
                    {

                    },
                    'beforeload': function(store, options)
                    {

                    },
                    'load': function(store, records, options) {
                        var totalfilter =  store.reader.jsonData.totalfiltrado;
                        if(totalfilter>0)
                        {
                            view.lfTotalfiltrado.setText('Total filtrado: '+ totalfilter+'');
                            view.lfTotalfiltrado.show();
                        }
                        else
                            view.lfTotalfiltrado.hide();
                    }
                },
              baseParams : {
                seleccion: seleccion,
              },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                nodoc:'nodoc'
            }, [{
                name: 'iddesagregacion'
            },{
                name: 'operacion'
            },{
                name: 'totalfiltrado'
            }, {
                name: 'unidadm'
            }, {
                name: 'grupo'
            }, {
                name: 'especialidad'
            }, {
                name: 'partida'
            }, {
                name: 'importe'
            },{
                name: 'iddocumento'
            },

                {
                name: 'nomEstado'
            }, {
                name: 'idestado'
            }, {
                    name: 'idoperacion'
            },{
                name: 'operacion2'
            }, {
                name: 'unidad_militar'
            }, {
                name: 'descripcion_NAE'
            },{
                name: 'especialidadcargar'
            },
                {
                    name: 'elemento_gasto'
                },
                {
                    name:'numcomprobante'
                },
                {
                    name:'shEliminar'
                },
                {
                    name:'showCmp'
                },
                {
                    name:'fecha'
                },
                {
                    name:'fechaoperacion',
                    type:'date',
                    dateFormat:'d/m/Y',
                }, {
                    name:'naturaleza_cuenta'
                },
                {
                    name:'string_cuenta'
                },




            ]),
            autoLoad: false
        });
            this.stentidades = new Ext.data.Store({
           url: 'obtenerEntidadesParaBusqueda',
           baseParams : {
               seleccion: seleccion
           },
           reader: new Ext.data.JsonReader({
               totalProperty: 'cantidad',
               root: 'datos',
           },[
               {
                   name: 'idcuenta'
               }, {
                   name: 'text'
               }
           ])
       }),
           this.stdocpresupuesto = new Ext.data.Store({
           url: 'obtenerPresupuesto',
           baseParams : {
               seleccion: seleccion
           },
           reader: new Ext.data.JsonReader({
               totalProperty: 'cantidad',
               root: 'datos',
           },[
               {
                   name: 'id_docpresupuesto'
               }, {
                   name: 'iddocumento'
               }
           ])
       }),

                this.stobteneragrupaciones = new Ext.data.Store({
                    url: 'obtenerAgrupaciones',
                    autoLoad:true,
                    baseParams : {
                        seleccion: seleccion
                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'cantidad',
                        root: 'datos',
                    },[
                        {
                            name: 'id_docpresupuesto'
                        },
                        {
                            name: 'iddocumento'
                        },{
                            name: 'numerodoc'
                        }, {
                            name: 'descripcion'
                        }, {
                            name: 'nomEstado'
                        }, {
                            name: 'idestado'
                        },{
                            name: 'showCmp'
                        },{
                            name: 'importedebe'
                        },{
                            name: 'importehaber'
                        }, {
                            name: 'fecha_operacion',
                            type:'date',
                            dateFormat:'d/m/Y',
                        },
                        {
                            name:'numcomprobante'
                        },
                        {
                            name:'importe_total'
                        }
                    ])
                }),


       this.store_tipo_operacion = new Ext.data.Store({
           url: 'cargaroperaciones',
           baseParams : {
               seleccion: seleccion
           },
           listeners: {
               'beforeload': function(store, options)
               {
               },
               'load': function(store, records, options) {
                   var bandera = false;
                   for (let i = 0; i < store.data.items.length; i++) {
                       if(!store.data.items[i].data.id)
                       {
                           bandera = true
                           break
                       }
                   }
                    if(bandera)
                    {
                        view.btnAdicionarPresupuesto.disable();
                    }
                    else
                    {
                        view.btnAdicionarPresupuesto.enable();
                    }
               }
           },
           scope: this,
           reader: new Ext.data.JsonReader({
               root: 'root',
           }, [{
               name: 'id'
           }, {
               name: 'nombre_operacion',
               },
               {
                   name: 'nombre_tipo',
               },
               {
                   name: 'tipo_operacion',
               },
               {
                   name: 'nombre_operacion_movimiento',
               },
               {
                   name: 'id_credito_movimiento',
               },
           ]),
           autoLoad: true
       });

       this.store_operacion = new Ext.data.Store({
           url: 'cargaroperaciones',
           baseParams : {
               seleccion: seleccion
           },
           scope: this,
           reader: new Ext.data.JsonReader({
               root: 'operacion',
           }, [{
               name: 'denominacion'
           }, {
               name: 'idnomoperaciones',
           },{
               name: 'idoperacionesentidad',
           },
           ]),
           autoLoad: true
       });
    }
};