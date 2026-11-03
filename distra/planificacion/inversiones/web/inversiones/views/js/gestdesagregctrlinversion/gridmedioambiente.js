/*analisisinversiones.view.js
 * Vista para analisis
 * @author: Yosniel
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Utilidades.Cmp.GridMedioAmbiente = function(params) {
    scope = this;
    this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando'
        });
    this.stMedioAmbiente = new Ext.data.Store({
        url: 'getPlanEquipo',
        reader: new Ext.data.JsonReader({
            root: "data"/*,
             id: 'idinversion'*/
        }, [{
                name: 'idinversion'
            }])
    });
    this.smMedioAmbiente = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    this.cmMedioAmbiente = new Ext.grid.ColumnModel([{
            header: 'Plan total',
            tooltip: 'Plan total',
            width: 200,
            sortable: true,
            dataIndex: 'codigo'
        }, {
            header: 'Importaciones (MUSD)',
            tooltip: 'Importaciones (MUSD)',
            width: 200,
            sortable: true,
            dataIndex: 'denominacion'
        }
    ]);

    this.gpMedioAmbiente = new Ext.grid.EditorGridPanel({
        title: params.title,
        frame: true,
        id: 'gpMA' + params.id,
//            autoScroll: true,
        anchor: '95%',
        region: params.region,
        disable: false,
        store: this.stMedioAmbiente,
        sm: this.smMedioAmbiente,
        height: 100,
        cm: this.cmMedioAmbiente,
        bbar: (params.paginado) ? new Ext.PagingToolbar({
                pageSize: 20,
                id: 'gpPiedatainver',
                store: this.stPlanEquipo,
                displayInfo: true
            }) : ''
    });

    this.gridMedioAmbiente = function() {
        return this.gpMedioAmbiente;
    };

    this.getSeleccion = function() {
        return this.smMedioAmbiente.getSelected();
    };
};
