Ext.ns('Ext.Log.ExpTec');

Ext.Log.ExpTec.TreeGrid = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel, {
    constructor: function(config) {
        var _this = this;
        _this.layout = 'fit';
        Ext.apply(this, config);
        Ext.Log.ExpTec.TreeGrid.superclass.constructor.apply(this, arguments);
    },
    stripeRows: true,
    autoExpandColumn: '_id',
    master_column_id: '_id',
    expand: true,
    root_title: 'Modulos',
    viewConfig: {forceFit: true},
    loadMask: {
        msg: 'Cargando...'
    },

    initComponent: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: _this.url,
            listeners: {
                beforeexpandnode: function(st, record) {
                    st.baseParams._id = record.get('_id');
                },
                load:function(st)
                {
                    st.baseParams={};
                    if(st.getCount()==0){
                        mostrarMensaje(2,_this.etiquetas.MsgNoExistenDatos , function(btn) {
                            if (btn == 'ok') {
                                _this.fn();
                            }
                        })
                    }
                },
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos',
                id: '_id',
                successProperty: 'success'
            }, [
                {
                    name: '_id'
                }, {
                    name: 'idregnumerico'
                }, {
                    name: 'esmodulo'
                }, {
                    name: 'asignado'
                }, {
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: '_expand'
                }, {
                    name: 'icon'
                },{
                    name: 'denominacion'
                }, {
                    name: 'text'
                }, {
                    name: 'codigo'
                }, {
                    name: 'nroinventario'
                }, {
                    name: 'nroserie'
                }, {
                    name: 'descripciongrupo'
                }, {
                    name: 'descripcionnacionalidad'
                }, {
                    name: 'valorcontable'
                }, {
                    name: 'fechaadq'
                }, {
                    name: 'fechaexpini'
                }, {
                    name: 'fechaexpfin'
                }, {
                    name: 'estatustecnico'
                }, {
                    name: 'ordenizqmodulo'
                }, {
                    name: 'ordendermodulo'
                },{
                    name: 'descripcionmarcamodelo'
                },{
                    name:'tipocombustible'
            }])
        });

        this.cm = new Ext.grid.ColumnModel([
            {
                id: '_id',
                header: _this.etiquetas.lbCMDenominacion,
                width: 160,
                dataIndex: 'denominacion',
                renderer: function(val, fn, record) {
                    var _this = this;
                    var images = '';
                    if (record.get('_is_leaf')){
                           images = '<span style="margin-top: 4px;"><img src="/configuracion/comun/views/images/treegrid/no-modulo.png"></span>';
                    } else{
                        images = '<span style="margin-top: 4px;"><img src="/configuracion/comun/views/images/treegrid/modulo.png"></span>';                        
                    }
                    return images + val;
                }
            }, {
                header: _this.etiquetas.lbCMGrupo,
                width: 90,
                dataIndex: 'descripciongrupo',
            }, {
                header: _this.etiquetas.lbCmbMarcaModelo,
                width: 120,
                dataIndex: 'descripcionmarcamodelo'
            },{
                header: _this.etiquetas.lbCMNroInventario,
                width: 90,
                dataIndex: 'nroinventario',
            }, {
                header: _this.etiquetas.lbCMNroSeir,
                width: 90,
                dataIndex: 'nroserie',
            }, {
                header: _this.etiquetas.lbCMNacionalidad,
                width: 80,
                dataIndex: 'descripcionnacionalidad'
            }, {
                header: _this.etiquetas.lbCMFechaAdquisicion,
                width: 110,
                dataIndex: 'fechaadq'
            }, {
                header: _this.etiquetas.lbCMEstado,
                width: 100,
                dataIndex: 'estatustecnico'
            }, {
                header: _this.etiquetas.lbCMTipoComb,
                width: 100,
                dataIndex: 'tipocombustible'
            }
        ]);

        Ext.Log.ExpTec.TreeGrid.superclass.initComponent.call(this);
    }
});


