/**
 * @author Tte. Gerardo Lopez Rodriguez.
 */

Ext.ns('Ext.LOG.RegNumInmueble');

Ext.LOG.RegNumInmueble.CmpTreeGrid = Ext.extend(Ext.ux.maximgb.GridPanel, {
    constructor: function (config) {
        var _this = this;
        this.ventana = config.scope;
        this.sm = config.sm;
        Ext.apply(this, config);
        Ext.LOG.RegNumInmueble.CmpTreeGrid.superclass.constructor.apply(this, arguments);
    },
    stripeRows: true,
    autoExpandColumn: '_id',
    master_column_id: '_id',
    expand: true,
    root_title: 'M&oacute;dulo',

    viewConfig: {forceFit: true},
    loadMask: {
        msg: 'Cargando...'
    },
    initComponent: function (config) {
        var _this = this;
        Ext.apply(this, config);
        this.idregNum = _this.idregNum;
        this.Component = _this.Component;
        this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: _this.url,
            autoLoad: true,
            listeners: {
                beforeload: function (st) {
                    st.baseParams = {};
                    st.baseParams.estree = true;
                    st.baseParams.arrayidregNum = Ext.encode(_this.idregNum);
                    st.baseParams.idestructuracomuop = _this.Component.idarearesp;
                },
                beforeexpandnode: function (st, record) {
                    st.baseParams = {};
                    st.baseParams._id = record.get('_id');
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos',
                id: '_id',
                successProperty: 'success'
            }, [
                {
                    name: '_id'
                },
                {
                    name: 'id'
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
                    name: 'responsable'
                },
                {
                    name: 'idespecialidad'
                },
                {
                    name: 'estaentidad'
                },
                {
                    name: 'denominacioncolumnareporte'
                },
                {
                    name: 'idpadremodulo'
                }
            ])
        });
        this.cm = new Ext.grid.ColumnModel([
            this.sm
            , {
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
                    if (record.data.idregnumerico == Ext.LOG.winRegNumInmueble.idregnuminicial) {
                        return '<span style="color:red;">' + images + val + '</span>';
                    } else {
                        return '<span style="color:black;">' + images + val + '</span>';
                    }

                    return images + val;
                }
            }, {
                header: _this.idioma.lbCmbMarcaModelo,
                width: 100,
                dataIndex: 'descripcionmarcamodelo',
                renderer: _this.activarColores
            }, {
                header: _this.idioma.lbCMIdentificador,
                width: 100,
                dataIndex: 'nroinventario',
                renderer: _this.activarColores
            }, {
                header: _this.idioma.lbCMNroSeir,
                width: 100,
                dataIndex: 'nroserie',
                renderer: _this.activarColores
            }, {
                header: _this.idioma.lbCMUbicacion,
                width: 100,
                dataIndex: 'idubicacion',
                renderer: _this.activarColores
            }, {
                header: _this.idioma.lbCMNacionalidad,
                width: 100,
                dataIndex: 'descripcionnacionalidad',
                renderer: _this.activarColores

            }, {
                header: _this.idioma.lbCMValorContable,
                width: 60,
                dataIndex: 'valorcontable',
                renderer: _this.activarColores
            }, {
                header: _this.idioma.lbCMEstado,
                width: 60,
                dataIndex: 'estatustecnico',
                renderer: _this.activarColores
            },
            {
                header: _this.idioma.lbCMResponsable,
                width: 60,
                dataIndex: 'responsable',
                renderer: _this.activarColores
            }
        ]
        );

        Ext.LOG.RegNumInmueble.CmpTreeGrid.superclass.initComponent.call(this);
    },
    activarColores: function (val, metaData, record, rowIndex, colIndex, store) {
        val = (!val || val == null || val == '') ? '' : val;
        if (record.data.idregnumerico == Ext.LOG.winRegNumInmueble.idregnuminicial) {
            return '<span style="color:red;">' + val + '</span>';
        } else {
            return '<span style="color:black;">' + val + '</span>';
        }
    }
});


