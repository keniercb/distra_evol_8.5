/*analisisinversiones.view.js
 * Vista para analisis
 * @author: Yosniel
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Utilidades.Cmp.GridDesgloseEquipos = function(params) {
    scope = this;
    this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando'
        });
    this.stDesgloseEquipo = new Ext.data.Store({
        id: 'st' + params.id,
        url: 'getPlanEquipo',
        reader: new Ext.data.JsonReader({
            root: "data"/*,
             id: 'idinversion'*/
        }, [{
                name: 'idinversion'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'provincia'
            }, {
                name: 'forma'
            }, {
                name: 'programa'
            }, {
                name: 'tipoinv'
            }, {
                name: 'objetivo'
            }])
    });
    this.smDesgloseEquipo = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    this.cmDesgloseEquipo = new Ext.grid.ColumnModel([{
            header: 'Plan total unidades',
            tooltip: 'Plan total unidades',
            width: 100,
            sortable: true,
            dataIndex: 'total'
        }/*, {
            header: 'Plan cantidad reposici\xF3n',
            tooltip: 'Plan cantidad reposici\xF3n',
            width: 200,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            header: 'Plan cantidad incremento',
            tooltip: 'Plan cantidad incremento',
            width: 100,
            sortable: true,
            dataIndex: 'tipoinv'
        }*/
    ]);

    this.gpDesgloseEquipo = new Ext.grid.EditorGridPanel({
        title: params.title,
        frame: true,
        id: 'gpEquipoDesglose' + params.id,
//            autoScroll: true,
        region: params.region,
        disable: false,
        store: this.stDesgloseEquipo,
        sm: this.smDesgloseEquipo,
        height: 100,
        cm: this.cmDesgloseEquipo/*,
        bbar: (params.paginado) ? new Ext.PagingToolbar({
                pageSize: 20,
                id: 'gpPiedatainver',
                store: this.stDesgloseEquipo,
                displayInfo: true
            }) : ''*/
    });

    this.gridDesgloseEquipo = function() {
        return this.gpDesgloseEquipo;
    };

    this.getSeleccion = function() {
        return this.smDesgloseEquipo.getSelected();
    };
};
