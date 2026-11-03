/*analisisinversiones.view.js
 * Vista para analisis
 * @author: Yosniel
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Utilidades.Cmp.GridDesagregacionInversion = function(params) {
    scope = this;
    this.mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando'
    });

    this.stPlanAprobadoIver = new Ext.data.Store({
        url: 'getPlanAprobado',
        reader: new Ext.data.JsonReader({
        }, [])
    });
    this.smPlanAprobadoInver = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    this.gpPlanAprobadoInv = new Ext.grid.EditorGridPanel({
        frame: true,
        title: params.title,
        id: 'gpPlanaprobado' + params.id,
        autoScroll: true,
        height: (params.height) ? params.height : 100,
        region: params.region,
        disable: false,
        store: this.stPlanAprobadoIver,
        sm: this.smPlanAprobadoInver,
        cm: params.cm,
        bbar: (params.paginado) ? new Ext.PagingToolbar({
            pageSize: 20,
            id: 'gpPiedatainver',
            store: this.stPlanAprobadoIver,
            displayInfo: true
        }) : '',
        listeners:{
            afteredit:function(e){
                console.info(e);
            }
        }
    });

    this.gridDesagregacionInversion = function() {
        return this.gpPlanAprobadoInv;
    };
    
    this.getSeleccionPlanInv = function() {
        return this.smPlanAprobadoInver.getSelected();
    };
};
