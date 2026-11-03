/*analisisinversiones.view.js
 * Vista para analisis
 * @author: Yosniel
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Utilidades.Cmp.GridPlanEquipos = function(params) {
    scope = this;
    this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando'
        });
    this.stPlanEquipo = new Ext.data.Store({
        url: 'getPlanAprobadoEquipo',
        reader: new Ext.data.JsonReader({
            //root: "data"
        }, [])
    });
    this.smPlanEquipo = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    this.cmPlanEquipo = new Ext.grid.ColumnModel([]);

    this.gpPlanEquipo = new Ext.grid.GridPanel({
        title: params.title,
        frame: true,
        id: 'gpEquipo' + params.id,
        region: params.region,
        disable: false,
        store: this.stPlanEquipo,
        sm: this.smPlanEquipo,
        height: 200,
        cm: this.cmPlanEquipo,
        bbar: (params.paginado) ? new Ext.PagingToolbar({
                pageSize: 20,
                id: 'gpPiedatainver',
                store: this.stPlanEquipo,
                displayInfo: true
            }) : ''
    });

    this.gridPlanEquipo = function() {
        return this.gpPlanEquipo;
    };

    this.getSeleccion = function() {
        return this.smPlanEquipo.getSelected();
    };

    this.getSeleccionModel = function() {
        return this.smPlanEquipo;
    };
};
