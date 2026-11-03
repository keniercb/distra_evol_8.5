/**
 * Treegree con el arbol de estructura.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.CmpTreeGrid
 * @copyright UCID
 * @version 1.0
 */
Ext.ns("Pvd.Nomina.CmpTreeGrid");
Pvd.Nomina.CmpTreeGrid = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel, {
    stripeRows: true,
    autoExpandColumn: '_id',
    master_column_id: '_id',
    expand: true,

    title: 'Listado de elementos salariales',
    root_title: 'Cargos',
    viewConfig: {forceFit: true},
    loadMask: {
        msg: 'Cargando...'
    },

    initComponent: function () {
        var self = this;

        this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            autoLoad: true,
            url: '/pvd/nomina/index.php/configelementosalarialcargo/obtenerListadoConfigElementoSalarial',//self.url,
            listeners: {
                beforeexpandnode: function (st, record) {

                    st.baseParams._id = record.get('_id');
                },
                beforeload: function (st, record) {
                    //st.baseParams.idplanilla = self.idplanilla;
                    //st.baseParams.idpersonaevaluacion = self.idpersonaevaluacion || '';
                },
                load: function (store, record, options) {
                }
            },
            reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: '_id',

                    successProperty: 'success'
                },
                [
                    {
                        name: '_id'
                    },
                    {
                        name: 'descripcion'
                    },
                    {
                        name: '_parent'
                    },
                    {
                        name: '_children'
                    },
                    {
                        name: '_expand'
                    },
                    {
                        name: '_is_leaf'
                    },
                    {
                        name: '_expand'
                    },
                    {
                        name: 'idtipo'
                    },
                    {
                        name: 'icon'
                    },
                    {
                        name: 'idelementosalarialcargo'
                    },
                    {
                        name: 'idsistemapago'
                    },
                    {
                        name: 'sistemapago'
                    },
                    {
                        name: 'idperiodopago'
                    },
                    {
                        name: 'periodopago'
                    },
                    {
                        name: 'idgrupoescala'
                    },
                    {
                        name: 'grupoescala'
                    },
                    {
                        name: 'idsectorsalarial'
                    },
                    {
                        name: 'sectorsalarial'
                    },
                    {
                        name: 'idsalarioespecifico'
                    },
                    {
                        name: 'denominacioncargo'
                    },
                    {
                        name: 'idescalasueldocargo'
                    },
                    {
                        name: 'escalasueldocargo'
                    },

                    {
                        name: 'importe'
                    },
                    {
                        name: 'fechainicio'
                    },
                    {
                        name: 'fechafin'
                    },
                    {
                        name: 'idcargo'
                    }
                ]
            )
        });

        this.sm = new Ext.grid.CheckboxSelectionModel();

        this.columns = [self.sm
            , {id: '_id', header: "Estructura", width: 200, sortable: true, dataIndex: 'descripcion', renderer: self.showImageTipoIndicador}
            , {header: 'idtipo', hidden: true, width: 200, sortable: true, dataIndex: 'idtipo'}
            , {header: 'idelementosalarialcargo', hidden: true, hideable: false, dataIndex: 'idelementosalarialcargo'}
            , {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idsistemapago'}
            , {header: 'Sistema de pago', width: 100, sortable: true, dataIndex: 'sistemapago'}
            , {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idperiodopago'}
            , {header: 'Per&iacute;odo de pago', width: 100, sortable: true, dataIndex: 'periodopago'}
            , {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idgrupoescala'}
            , {header: 'Grupo escala', width: 100, sortable: true, dataIndex: 'grupoescala'}
            , {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idsectorsalarial'}
            ,{header: 'Sector salarial', width: 100, sortable: true, dataIndex: 'sectorsalarial'}
            , {header: '',hidden: true,width: 100, sortable: true, dataIndex: 'idsalarioespecifico'}
            ,{header: 'Cargo por salario específico', width: 100, sortable: true, dataIndex: 'denominacioncargo'}
            , {header: '', hidden: true, width: 100, sortable: true, dataIndex: 'idescalasueldocargo'}
            , {header: 'Escala sueldo por cargo', width: 140, sortable: true, dataIndex: 'escalasueldocargo'}
            , {header: 'Sueldo por cargo', width: 100, sortable: true, dataIndex: 'importe'}
            , {header: 'Fecha inicio', width: 100, sortable: true, dataIndex: 'fechainicio'}
            , {header: 'Fecha fin', width: 70, sortable: true, dataIndex: 'fechafin'}
            , {header: '', hidden: true, width: 70, sortable: true, dataIndex: 'idcargo'}
        ];
        /*var smMovimientos = new Ext.grid.CheckboxSelectionModel({
         singleSelect:true
         });*/

        Pvd.Nomina.CmpTreeGrid.superclass.initComponent.call(this);
    },
    showImageTipoIndicador: function (val, fn, record) {
        return val;
    }
});
