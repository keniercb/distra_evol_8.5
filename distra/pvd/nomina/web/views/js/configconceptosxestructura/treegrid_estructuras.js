/**
 * Treegree con el arbol de estructura.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.TreeGridEstructuras
 * @copyright UCID
 * @version 1.0
 */
Ext.ns("Pvd.Nomina.TreeGridEstructuras");
Pvd.Nomina.TreeGridEstructuras = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel,{
    stripeRows: true,
    autoExpandColumn: '_id',
    master_column_id : '_id',
    expand : true,
    
    title: 'Listado de elementos salariales',
    root_title: 'Cargos',
    viewConfig: {forceFit: true},
    loadMask:{
        msg: 'Cargando...'
    },
    
   initComponent: function(){
         var self = this;
         
   this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            autoLoad: true,
            url: '/pvd/nomina/index.php/configconceptosxestructura/obtenerListadoEntidades',//self.url,
            listeners:{
                beforeexpandnode: function(st, record){
					
					st.baseParams._id = record.get('_id');
                },
                beforeload:function(st, record){
				    
                    //st.baseParams.idplanilla = self.idplanilla;
                    //st.baseParams.idpersonaevaluacion = self.idpersonaevaluacion || '';
                },
                load :function(store,record,options) {

                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: '_id',
                    
                successProperty: 'success'
            },
            [{
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
                name: 'idtipo'
            },
            {
                name: 'icon'
            }
            ]
            )
        });

        this.sm = new Ext.grid.CheckboxSelectionModel();
   
        this.columns = [self.sm
       ,{id:'_id', header: "Estructura", width: 200, sortable: true, dataIndex: 'descripcion', renderer: self.showImageTipoIndicador}
       ,{header: 'idtipo', hidden:true, width: 200, sortable: true, dataIndex: 'idtipo'}
       
        ];
    
        
        Pvd.Nomina.TreeGridEstructuras.superclass.initComponent.call(this);
    },
    showImageTipoIndicador: function(val, fn, record) {
        return val;
    }
});
