/**
 * @author Tte. Gerardo Lopez Rodriguez.
 */

Ext.ns('Ext.LOG.moduloMedio');

Ext.LOG.moduloMedio.CmpTreeGridP = Ext.extend(Ext.ux.maximgb.GridPanel, {
    
    
    constructor: function(config) {
        var _this = this;
        this.ventana = config.scope;
        Ext.apply(this, config);
        Ext.LOG.moduloMedio.start = null;
        Ext.LOG.moduloMedio.limit = null;
        Ext.LOG.moduloMedio.CmpTreeGridP.superclass.constructor.apply(this, arguments);
    },
    enableDragDrop: true,
    ddGroup: 'firstGridDDGroup',
    stripeRows: true,
   // autoExpandColumn: '_id',
    master_column_id: '_id',
    expand: true,
    root_title: 'M\xf3dulos',
    viewConfig: {enableRowBody: true},
    loadMask: {
        msg: 'Cargando...'
    },
    initComponent: function(config) {
        Ext.apply(this, config);
        var _this = this;
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
            }, {
                name: 'registro'
            }, {
                name: 'denomRegistro'
            },{
                name: 'espadre'
            },{
                name: 'valorcontablealternativo'
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
                width: 160,
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
            },/* {
                header: _this.idioma.lbCMNroSeir,
                width: 100,
                dataIndex: 'nroserie',
            },*/ {
                header: _this.idioma.lbCMUbicacion,
                width: 100,
                dataIndex: 'idubicacion'
            }, /*{
                header: _this.idioma.lbCMNacionalidad,
                width: 100,
                150: 'descripcionnacionalidad'
            },*/ {
                header: (alternativa) ? _this.idioma.lbCMValorContable +" "+ nommonedacontable: _this.idioma.lbCMValorContable,
                width: 150,
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
            }, {
                header: "Inscrito",
                width: 100,
                dataIndex: 'inscrito',
                renderer: _this.siestaInscrito
            }, {
                header: "Registro",
                width: 100,
                dataIndex: 'denomRegistro'
            }];
        if (alternativa) {
            var dat = {
                header: "Valor contable alternativo"+" "+nommonedaalternativa,
                width: 150,
                dataIndex: 'valorcontablealternativo'
            }
            this.columnmodel.splice(6,0,dat);
        }

        /* Ext.each(this.plugins, function(plugin) {
         plugin.init(_this);
         });*/
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
                    _this.getSelectionModel().clearSelections();
                    if(st.data.items.length == 0){
                         mostrarMensaje(1, _this.idioma.MsgNoExistenDatosGrid);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos',
                id: '_id',
                successProperty: 'success'
            }, _this.readerstore)
        });

        this.cm = new Ext.grid.ColumnModel(_this.columnmodel);
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
        Ext.LOG.moduloMedio.CmpTreeGridP.superclass.initComponent.call(this);
    },
    siestaInscrito: function(val, metaData, record) {        
        if (val == 1 ) {
            metaData.css = 'activo';
        } else if (val != 1) {
            metaData.css = 'inactivo';
        }
    },
    activarColores: function(val, metaData, record, rowIndex, colIndex, store) {
        val = (!val || val == null || val == '') ? '' : val;
        if (record.data.estaentidad == 0) {
            return '<span style="color:red;">' + val + '</span>';
        } else {
            return '<span style="color:black;">' + val + '</span>';
        }
    }
});


