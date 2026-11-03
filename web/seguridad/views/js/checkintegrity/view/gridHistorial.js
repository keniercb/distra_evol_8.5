/**
 * Created by kmilo on 15/6/2018.
 */
Ext.define('CheckIntegrity.view.gridHistorial', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridHistorial',
    store: 'StoreHistorial',
    region: 'center',
    columnLines: true,
    margins: '5 0 5 5',

    initComponent: function () {
        this.columns = [
            {
                header: Zeolides.etiquetas.headerEstadoIntegridad, dataIndex: 'violacion',flex : 1,
                renderer: function (value) {
                    if (value)
                        return Ext.String.format('<label style="color: red; font-weight: bold;">'+ Zeolides.etiquetas.lbIntegridadComprometida+'</label>');
                    else
                        return Ext.String.format('<label style="color: green; font-weight: bold;">'+ Zeolides.etiquetas.lbIntegridadCorrecta+'</label>');
                }
            },
            {header: Zeolides.etiquetas.headerFechaEscaneo, dataIndex: 'fechaanalisis', width : 150},
            {
                header: Zeolides.etiquetas.headerTipoEscaneo, dataIndex: 'escaneoautomatico', width : 110,
                renderer: function (value) {
                    if (value)
                        return Ext.String.format('<span class="icondistra-rayo" >'+Zeolides.etiquetas.lbChequeoAutomatico+'</span> ');
                    else
                        return Ext.String.format('<label class="icondistra-probar">'+Zeolides.etiquetas.lbChequeoManual+'</label>');
                }
            }

        ];
        this.dockedItems = [{
            xtype: 'pagingtoolbar',
            store: 'StoreHistorial',   // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true
        }],
        this.callParent(arguments);
    }
});