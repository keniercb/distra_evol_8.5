/**
 * Created by madrid on 05/04/2017.
 */


function cargarActividades() {
    var stGpVerActPlanes = new Ext.data.Store({
        url: urlListarVerActXIndPlanes,
        listeners: {
            load: function (st, rec, opt) {
                if (st.data.length === 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoActXInd);
                }
            },
            beforeload: function () {
                this.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                this.baseParams.identidad = identidadselectedPlanes;
                this.baseParams.idindicador = smGpGestModeloPlanes.getSelected().data.idindicador;
                this.baseParams.start = 0;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [
            {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'nivel'
            }, {
                name: 'denespecialidad'
            }, {
                name: 'denentidad'
            }])
    });

    var filtrosGpVerActPlanes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'denominacion'
            }, {
                type: 'string_adaptado',
                dataIndex: 'codigo'
            }, {
                type: 'numeric',
                dataIndex: 'nivel'
            }]
    });

    var smGpVerActPlanes = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    var btnLimpiarFiltrosVerActPlanes = new Ext.Button({
        id: 'btnLimpiarFiltrosVerActPlanes',
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        handler: function () {
            filtrosGpVerActPlanes.clearFilters();
        }
    });

    var cmGpVerActPlanes = new Ext.grid.ColumnModel([
        {
            header: 'C&oacute;digo de la actividad',
            width: 150,
            dataIndex: 'codigo',
            tooltip: 'C&oacute;digo de la actividad',
            renderer: crearToolTipPlanes

        }, {
            header: 'Entidad',
            width: 180,
            dataIndex: 'denentidad',
            tooltip: 'Entidad',
            renderer: crearToolTipPlanes
        }, {
            header: 'Especialidad',
            width: 180,
            dataIndex: 'denespecialidad',
            tooltip: 'Especialidad',
            renderer: crearToolTipPlanes
        }, {
            header: 'Denominaci&oacute;n',
            width: 200,
            dataIndex: 'denominacion',
            tooltip: 'Denominaci&oacute;n',
            renderer: crearToolTipPlanes
        },
        {
            header: 'Nivel de actividad',
            width: 1505,
            dataIndex: 'nivel',
            tooltip: 'Nivel de actividad',
            id: 'expandir',
            renderer: crearToolTipPlanes
        }
    ]);

    var GpVerActPlanes = new Ext.grid.GridPanel({
        id: 'GpVerActPlanes',
        autoExpandColumn: 'expandir',
        store: stGpVerActPlanes,
        margins: '2 2 2 -4',
        region: 'center',
        plugins: filtrosGpVerActPlanes,
        sm: smGpVerActPlanes,
        cm: cmGpVerActPlanes,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptGpVerActPlanes',
            store: stGpVerActPlanes,
            displayInfo: true,
            items: [btnLimpiarFiltrosVerActPlanes]
        })
    });

    var btnCancelarActPlanes = new Ext.Toolbar.Button({
        id: 'btnCancelarActPlanes',
        iconCls: 'cancelar',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function () {
            winVerActividadesPlanes.hide();

        }
    });

    var winVerActividadesPlanes = new Ext.Window({
        title: "Ver actividades",
        width: 800,
        layout: 'fit',
        height: 400,
        modal: true,
        constrain: true,
        closeAction: 'hide',
        buttons: [btnCancelarActPlanes],
        items: [GpVerActPlanes],
        listeners: {
            beforeshow: function () {
                stGpVerActPlanes.load();
            }
        }
    });

    winVerActividadesPlanes.show();
}

