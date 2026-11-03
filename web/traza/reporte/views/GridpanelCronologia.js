/**
 * Created by angel on 28/01/16.
 */
Ext.define("Traces.view.GridpanelCronologia", {
    require: [
        "Ext.grid.Panel"

    ],
    extend: "Ext.grid.Panel",
    alias: "widget.gridpanelCronologia",
    id: 'gridpanelCronologia',


    initComponent: function () {
        this.myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});
        var me = this;
        me.store = Ext.create('Traces.store.gridcronologia.storegridCronologia');
        me.pageSize = me.pageSize || 20;

        me.features = [
            {
                ftype:'grouping',
                groupHeaderTpl: 'Ip--Fecha: {name} ({rows.length} {[values.rows.length > 1 ? (values.rows.length == '+ me.pageSize+' ? "Trazas  en esta p&aacute;gina" : "Trazas") : "Traza"]})',
            }
        ];
/////////////
        me.viewConfig = {
            loadingText: 'Cargando...'
        };
        me.columns = [
            {
                header: 'IP--Fecha',
                width: 140,
                align: 'center',
                dataIndex: 'ip_fecha'
            },
            {
                header: 'Hora',
                width: 100,
                align: 'center',
                dataIndex: 'hora'
            },
            {
                header: 'T. ejecuci&oacute;n',
                width: 80,
                align: 'center',
                dataIndex: 'tiempoejecucion'
            },
            {
                header: 'Memoria',
                width: 60,
                align: 'center',
                dataIndex: 'memoria'
            },
            {
                header: 'Subsistema',
                width: 150,
                align: 'center',
                dataIndex: 'categoria'
            },
            {
                header: 'Descripci&oacute;n',
                dataIndex: 'descripcion',
                //align: 'center',
                flex: 1
            },
            {
                header: 'Tipo',
                width: 150,
                align: 'center',
                dataIndex: 'tipotraza',
            },
            {
                name: 'usuario_sesion',
                hidden: true,
                hideable: false,
                dataIndex: 'usuario_sesion'
            },
            {
                name: 'usuario',
                hidden: true,
                hideable: false,
                dataIndex: 'usuario'
            },
            {
                name: 'idcategoriatraza',
                hidden: true,
                hideable: false,
                dataIndex: 'idcategoriatraza'
            },
            {
                name: 'idtrazapadre',
                hidden: true,
                hideable: false,
                dataIndex: 'idtrazapadre'
            },
            {
                name: 'idtipotraza',
                hidden: true,
                hideable: false,
                dataIndex: 'idtipotraza'
            },
            {
                name: 'idtraza',
                hidden: true,
                hideable: false,
                dataIndex: 'idtraza'
            }
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            pageSize: me.pageSize,
            displayInfo: true,
            displayMsg: 'Mostrando de {0} - {1} de {2}',
            emptyMsg: '0 Resultado a mostrar',
            beforePageText: 'Página',
            afterPageText: 'de {0}',
            firstText: 'Primera Página',
            prevText: 'Página anterior',
            nextText: 'Página siguiente',
            lastText: 'Última Página',
            refreshText: 'Actualizar'

        });

        this.callParent(arguments);

    }
});


