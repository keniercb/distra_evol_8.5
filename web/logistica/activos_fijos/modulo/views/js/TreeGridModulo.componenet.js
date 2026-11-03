/**
 * @author Tte. Gerardo Lopez Rodriguez.
 */

Ext.ns('Ext.LOG.moduloMedio');

Ext.LOG.moduloMedio.CmpTreeGrid = Ext.extend(Ext.ux.maximgb.GridPanel, {
    master_column_id: '_id',
    autoScroll: true,
    expand: true,
    stripeRows: true,
    enableDragDrop: true,
   // paginado: 1,
    notab: '',
    root_title: 'M\xf3dulos',
    ddGroup: 'firstGridDDGroup',
    viewConfig: {enableRowBody: true},
    constructor: function(config) {
        var _this = this;
        this.ventana = config.scope;
        Ext.apply(this, config);
        Ext.LOG.moduloMedio.start = null;
        Ext.LOG.moduloMedio.limit = null;
        Ext.LOG.moduloMedio.CmpTreeGrid.superclass.constructor.apply(this, arguments);
    }, 
    loadMask: {
        msg: 'Cargando...'
    },
    initComponent: function(config) {
        Ext.apply(this, config);
        var _this = this;

        this.plugins = new Array();
        for (var i = 0; i < arrElementosGridPlugin.length; i++) {
            this.attatchPlugin(arrElementosGridPlugin[i]);
        }
        this.readerstore = [
            {
                name: '_id'
            },
            {
                name: 'idregnumerico'
            },
            {
                name: 'esmodulo'
            },
            {
                name: 'asignado'
            },
            {
                name: '_parent'
            },
            {
                name: '_is_leaf'
            },
            {
                name: '_expand'
            },
            {
                name: 'icon'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'denominacionpm'
            },
            {
                name: 'codigo'
            },
            {
                name: 'nroinventario'
            },
            {
                name: 'nroserie'
            },
            {
                name: 'idubicacion'
            },
            {
                name: 'descripcionnacionalidad'
            },
            {
                name: 'valorcontable'
            },
            {
                name: 'fechaadq'
            },
            {
                name: 'fechaexpini'
            },
            {
                name: 'fechaexpfin'
            },
            {
                name: 'denomestadotecnico'
            },
            {
                name: 'estatustecnico'
            },
            {
                name: 'ordenizqmodulo'
            },
            {
                name: 'ordendermodulo'
            },
            {
                name: 'descripcionmarcamodelo'
            },
            {
                name: 'idprod'
            },
            {
                name: 'idindicador'
            },
            {
                name: 'idpadremodulo'
            },
            {
                name: 'imagenes'
            },
            {
                name: 'responsable'
            },
            {
                name: 'inscrito'
            },
            {
                name: 'idespecialidad'
            },
            {
                name: 'estaentidad'
            }, {
                name: 'denominacioncolumnareporte'
            }, {
                name: 'transformador'
            }, {
                name: 'vidautil'

            }, {
                name: 'denomTipoCom'
            }, {
                name: 'vidautilfecha'
            },{
                name: 'valorcontablealternativo'
            },{
                name: 'idarbol'
            }
        ];

        this.columnmodel = [
            {
                header: _this.idioma.lbCodigo,
                width: 100,
                dataIndex: 'codigo',
                hidden: true
            }, {
                id: '_id',
                header: _this.idioma.lbCMDenominacion,
                width: 170,
                dataIndex: 'denominacion',
                renderer: function(val, fn, record) {
                    var _this = this;
                    var images = '';
                    if (record.get('_is_leaf')) {
                        images = '<img src="../../views/images/no-modulo.png">';

                    } else {
                        images = '<img src="../../views/images/modulo.png">';

                    }
                    return images + val;
                }
            }, {
                header: _this.idioma.lbCmbMarcaModelo,
                width: 100,
                dataIndex: 'descripcionmarcamodelo'
            }, {
                header: _this.idioma.lbCmTipo,
                width: 60,
                dataIndex: 'esmodulo',
               // align: 'center',
                renderer: function(val) {
                    if (val == 1) {
                        return "A";
                    } else if (val == 2) {
                        return "M";
                    }
                }
            }, {
                header: _this.idioma.lbCMIdentificador,
                width: 100,
                dataIndex: 'nroinventario'
            }, {
                header: _this.idioma.lbCMNroSeir,
                width: 105,
                dataIndex: 'nroserie'
            }, {
                header: _this.idioma.lbCMUbicacion,
                width: 100,
                dataIndex: 'idubicacion'
            }, {
                header: _this.idioma.lbCMNacionalidad,
                width: 100,
                dataIndex: 'descripcionnacionalidad'
            }, {
                header: _this.idioma.lbCMValorContable ,
                //header: (alternativa) ? _this.idioma.lbCMValorContable +" "+ nommonedacontable: _this.idioma.lbCMValorContable,
                width: 100,
                dataIndex: 'valorcontable'
            }, {
                header: _this.idioma.lbCMEstado,
                width: 100,
                dataIndex: 'denomestadotecnico'
            },
            {
                header: _this.idioma.lbCMResponsable,
                width: 100,
                dataIndex: 'responsable'
            },
            {
                dataIndex: 'idarbol'
            }
        ];

        /*if (alternativa) {
            var dat = {
                header: "Valor contable alternativo"+" "+nommonedaalternativa,
                width: 100,
                dataIndex: 'valorcontablealternativo'
            }
            this.columnmodel.splice(9,0,dat);
        }*/

        Ext.each(this.plugins, function(plugin) {
            plugin.init(_this);
        });
        this.store = new Ext.ux.maximgb.AdjacencyListStore({
            url: _this.url,
            listeners: {
                beforeexpandnode: function(st, record) {
                    st.baseParams._id = record.get('_id');
                    st.baseParams.limit = Ext.LOG.moduloMedio.limit;
                    st.baseParams.start = Ext.LOG.moduloMedio.start;
                    st.baseParams.idarea = _this.scope.comboDeposito.getValue();
                },
                beforeLoad: function(st) {
                    st.baseParams.estree = true;
                },
                load: function(st, rd) {
                    st.baseParams = {};
                    st.baseParams.limit = Ext.LOG.moduloMedio.limit;
                    st.baseParams.start = Ext.LOG.moduloMedio.start;
                    st.baseParams.idarea = _this.scope.idPadreNodoSeleccionado;
                    //_this.idPadreNodoSeleccionado
                    /* if (st.getCount() == 0) {
                     mostrarMensaje(2, _this.idioma.MsgNoExistenDatos, function (btn) {
                     if (btn == 'ok') {
                     _this.ventana.getWinAreasResponsabilidad();
                     }
                     });
                     }*/
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos',
                id: '_id',
                successProperty: 'success'
            }, _this.readerstore/* [
             {name: '_id'
             },
             {name: 'idregnumerico'
             },
             {
             name: 'esmodulo'
             },
             {
             name: 'asignado'
             },
             {
             name: '_parent'
             },
             {
             name: '_is_leaf'
             },
             {
             name: '_expand'
             },
             {
             name: 'icon'
             },
             {
             name: 'denominacion'
             },
             {
             name: 'denominacionpm'
             },
             {
             name: 'codigo'
             },
             {
             name: 'nroinventario'
             },
             {
             name: 'nroserie'
             },
             {
             name: 'idubicacion'
             },
             {
             name: 'descripcionnacionalidad'
             },
             {
             name: 'valorcontable'
             },
             {
             name: 'fechaadq'
             },
             {
             name: 'fechaexpini'
             },
             {
             name: 'fechaexpfin'
             },
             {
             name: 'denomestadotecnico'
             },
             {
             name: 'ordenizqmodulo'
             },
             {
             name: 'ordendermodulo'
             },
             {
             name: 'descripcionmarcamodelo'
             },
             {
             name: 'idprod'
             },
             {
             name: 'idpadremodulo'
             },
             {
             name: 'responsable'
             }
             ]*/)
        });

        // this.sm = new Ext.grid.CheckboxSelectionModel();
        this.cm = new Ext.grid.ColumnModel(_this.columnmodel/*[
         //this.sm, new Ext.LOG.PagingRowNumberer,
         {
         header: _this.idioma.lbCodigo,
         width: 100,
         dataIndex: 'codigo',
         hidden: true
         }, {
         id: '_id',
         header: _this.idioma.lbCMDenominacion,
         width: 160,
         dataIndex: 'denominacion',
         renderer: function (val, fn, record) {
         var _this = this;
         var images = '';
         if (record.get('_is_leaf')) {
         images = '<img src="../../views/images/no-modulo.png">';
         
         } else {
         images = '<img src="../../views/images/modulo.png">';
         
         }
         return images + val;
         }
         }, {
         header: _this.idioma.lbCmbMarcaModelo,
         width: 100,
         dataIndex: 'descripcionmarcamodelo'
         }, {
         header: _this.idioma.lbCmTipo,
         width: 100,
         dataIndex: 'esmodulo',
         align: 'center',
         renderer:function(val){
         if(val == 1){
         return "A";
         }else  if(val==2){
         return "M";
         }
         }
         }, {
         header: _this.idioma.lbCMIdentificador,
         width: 100,
         dataIndex: 'nroinventario',
         }, {
         header: _this.idioma.lbCMNroSeir,
         width: 100,
         dataIndex: 'nroserie',
         }, {
         header: _this.idioma.lbCMUbicacion,
         width: 100,
         dataIndex: 'idubicacion',
         }, {
         header: _this.idioma.lbCMNacionalidad,
         width: 100,
         dataIndex: 'descripcionnacionalidad'
         }, {
         header: _this.idioma.lbCMValorContable,
         width: 60,
         dataIndex: 'valorcontable',
         }, {
         header: _this.idioma.lbCMEstado,
         width: 60,
         dataIndex: 'denomestadotecnico'
         },
         {
         header: _this.idioma.lbCMResponsable,
         width: 60,
         dataIndex: 'responsable'
         }
         ]*/);
        this.bbar = new Ext.PagingToolbar({
            store: this.store,
            displayInfo: false,
            pageSize: 20,
            filter: '',
            doLoad: function(start) {
                this.store.active_node = null;

                this.store.fireEvent('activenodechange', null, this.store.active_node, null);


                var o = {}//, pn =  this.store.baseParams//this.getParams();

                o['start'] = start;
                o['limit'] = this.pageSize;
                Ext.LOG.moduloMedio.limit = this.pageSize;
                Ext.LOG.moduloMedio.start = start;
                var newP = {
                    idarearesp: (_this.idarea) ? _this.idarea : _this.scope.comboDeposito.getValue(),
                    _id: '',
                    anode: ''
                }
                Ext.apply(o, newP);

                if (this.fireEvent('beforechange', this, o) !== false) {
                    this.store.load({
                        params: o
                    });
                }
            }
        });
        Ext.LOG.moduloMedio.CmpTreeGrid.superclass.initComponent.call(this);
    },
    attatchPlugin: function(plugin) {
        this.plugins.push(plugin);
    }
});


