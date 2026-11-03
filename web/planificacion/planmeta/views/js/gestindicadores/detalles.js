var winDetalles, panelDetalles, gridDetallesPlanes, gridDetallesActividades, storeDetallesPlanes, storeDetallesActividades;

function irDetalles() {

    storeDetallesPlanes = new Ext.data.Store({
        url: 'listarPlanes',
        baseParams: {
            idindicador: smGpGest.getSelected().id,
            idejercicio: cbEjercicio.getValue(),
            start: 0,
            limit: 20
        },
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        },
        [{
                name: 'denominacion',
                mapping: 'DatEntidadmodelo.DatModelo.denominacion'
            }]
                )
    });

    btnLimpiarFiltrosPlanes = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosPlanes',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbBtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            limpiarfiltrosPlanes();
        }
    });

    btnLimpiarFiltrosAct = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltrosAct',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbBtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            limpiarfiltrosActividades();
        }
    });


    filtrosPlanes = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });

    gridDetallesPlanes = new Ext.grid.GridPanel({
        store: storeDetallesPlanes,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        columns: [
            {
                id: 'denominacion',
                header: "Denominaci&oacute;n",
                width: 75,
                sortable: true,
                dataIndex: 'denominacion'
            }],
        stripeRows: true,
        autoExpandColumn: 'denominacion',
        frame: true,
        height: 342,
        width: 442,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeDetallesPlanes,
            displayInfo: true,
            items: [btnLimpiarFiltrosPlanes, '-'],
            id: 'pgDetallesPlanes'
        }),
        plugins: filtrosPlanes
    });

    storeDetallesActividades = new Ext.data.Store({
        url: 'listarActividades',
        autoLoad: true,
        baseParams: {
            idindicador: smGpGest.getSelected().id,
            idejercicio: cbEjercicio.getValue(),
            start: 0,
            limit: 20
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'codigo',
                mapping: 'NomActividad.codigo'
            }, {
                name: 'denominacion',
                mapping: 'NomActividad.denominacion'
            }])
    });

    filtrosdetalles = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });

    gridDetallesActividades = new Ext.grid.GridPanel({
        store: storeDetallesActividades,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        columns: [
            {
                id: 'codigo',
                header: "C&oacute;digo",
                width: 60,
                sortable: true,
                dataIndex: 'codigo'
            },
            {
                id: 'denominacion',
                header: "Denominaci&oacute;n",
                width: 75,
                sortable: true,
                dataIndex: 'denominacion'
            }

        ],
        stripeRows: true,
        autoExpandColumn: 'denominacion',
        height: 340,
        width: 442,
        frame: true,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: storeDetallesActividades,
            displayInfo: true,
            items: [btnLimpiarFiltrosAct, '-'],
            id: 'pgDetallesActividades'
        }),
        plugins: filtrosdetalles
    });


    panelDetalles = new Ext.FormPanel({
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        width: 905,
        height: 445,
        layout: 'border',
        items: [{
                title: 'Planes',
                region: 'west',
                width: 445,
                margins: '0 10 0 0',
                items: [gridDetallesPlanes]
            }, {
                title: 'Actividades',
                region: 'center',
                width: 445,
                margins: '0 0 10 0',
                items: [gridDetallesActividades]
            }]

    });

    winDetalles = new Ext.Window({
        id: 'idWinDetalles',
        title: 'Detalles',
        layout: 'fit',
        width: 915,
        constrain: true,
        height: 450,
        closeAction: 'destroy',
        items: panelDetalles,
        resizable: false,
        buttons: [{
                text: 'Cancelar',
                iconCls: 'btn',
                icon: perfil.dirImg + 'cancelar.png',
                handler: function() {
                    Ext.getCmp('idWinDetalles').destroy();
                }
            }, {
                text: 'Aceptar',
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                handler: function() {
                    Ext.getCmp('idWinDetalles').destroy();
                    Mod();
                }
            }]
    }).show();
}

function limpiarfiltrosPlanes() {
    filtrosPlanes.clearFilters();
}

function limpiarfiltrosActividades() {
    filtrosdetalles.clearFilters();

}
