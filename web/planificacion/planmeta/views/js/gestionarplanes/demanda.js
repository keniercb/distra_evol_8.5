/**
 * Created by madrid on 27/03/2017.
 */

function cargarAccionesDemanda() {

    var offsetGpdemandacentrobalancePlanes = 0;

    var cmGpdemandacentrobalancePlanes = new Ext.grid.ColumnModel([
        {
            id: 'expandir',
            header: 'Especialidad',
            width: 100,
            dataIndex: 'denomentidadpadre',
            tooltip: 'Especialidad',
            renderer: crearToolTipPlanes
        },
        {
            header: 'Entidad',
            width: 100,
            dataIndex: 'denominacionenti',
            tooltip: 'Entidad',
            renderer: crearToolTipPlanes

        },
        {
            header: 'Plan',
            width: 180,
            dataIndex: 'denominacionmodelo',
            tooltip: 'Plan',
            renderer: crearToolTipPlanes

        }, {
            header: 'C&oacute;digo',
            width: 75,
            dataIndex: 'codigo',
            tooltip: 'C&oacute;digo',
            renderer: crearToolTipPlanes
        }, {
            header: 'N&uacute;mero de pieza',
            width: 100,
            dataIndex: 'numeropieza',
            tooltip: 'N&uacute;mero de pieza',
            renderer: crearToolTipPlanes

        }, {
            header: 'Indicador',
            width: 100,
            dataIndex: 'denominacionind',
            tooltip: 'Indicador',
            renderer: crearToolTipPlanes

        }, {
            header: 'Cantidad',
            width: 100,
            dataIndex: 'cantidadreal',
            tooltip: 'Cantidad',
            renderer: crearToolTipPlanes


        }, {
            header: 'Ajuste',
            width: 100,
            dataIndex: 'ajuste',
            tooltip: 'Ajuste',
            renderer: crearToolTipPlanes


        }, {
            header: 'Cantidad final',
            width: 100,
            dataIndex: 'necesidad',
            tooltip: 'Cantidad final',
            renderer: crearToolTipPlanes


        }, {
            header: 'Importe',
            width: 100,
            dataIndex: 'importe',
            tooltip: 'Importe',
            renderer: crearToolTipPlanes
        }


    ]);

    var smGpdemandacentrobalancePlanes = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    var stCmbDenominacionModeloPlanes = new Ext.data.Store({
        url: 'listarModelos',
        storeId: 'stCmbDenominacionModeloPlanes',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }])
    });

   /* filtrosGpdemandacentrobalancePlanes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'denomentidadpadre',
                idcombo: 'identi',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                st: stCmbEspecialidadPlanes,
                mode: 'local'
            },
            {
                type: 'listado',
                dataIndex: 'denominacionmodelo',
                idcombo: 'cbdenominacionmodelo',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                st: stCmbDenominacionModeloPlanes,
                mode: 'local'
            },
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'string_adaptado',
                dataIndex: 'numeropieza',
                xtype: 'numberfield',
                idTextField: 'filtropieza',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'string_adaptado',
                dataIndex: 'denominacionind',
                xtype: 'numberfield',
                idTextField: 'filtrodenominacionind',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'numeric',
                dataIndex: 'necesidad'
            },
            {
                type: 'numeric',
                dataIndex: 'cantidadreal'
            },
            {
                type: 'numeric',
                dataIndex: 'ajuste'
            },
            {
                type: 'numeric',
                dataIndex: 'importe'
            }
        ]
    });
*/
    var stcbCtroBalancePlanes = new Ext.data.Store({
        url: 'ListarComboCentroBalance',
        listeners: {
            beforeload: function(st) {
                st.baseParams.identidad = identidadselectedPlanes;
                st.baseParams.rector = objciPlanes.acciones.rector;
            },
            load: function(st, rec, opt) {
                if (identidadselectedPlanes) {
                    cbCtroBalancePlanes.setValue(identidadselectedPlanes);
                    cbCtroBalancePlanes.setRawValue(denom_ent);
                } else {
                    cbCtroBalancePlanes.setValue(st.data.items[0].data.identidad);
                    cbCtroBalancePlanes.setRawValue(st.data.items[0].data.denominacion);
                }
                stGpdemandacentrobalancePlanes.reload()
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'denominacion'
            }, {
                name: 'identidad'
            }])
    });

    var cbCtroBalancePlanes = new Ext.form.ComboBox({
        id: 'cbCtroBalancePlanes',
        store: stcbCtroBalancePlanes,
        valueField: 'identidad',
        hiddenName: 'identidad',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function(cb, rec, index) {
                stGpdemandacentrobalancePlanes.reload();
            }
        }
    });

    var btnExportardemandaPlanes = new Ext.Button({
        disabled: false,
        id: 'btnExportardemandaPlanes',
        hidden: false,
        iconCls: 'exportar',
        tooltip: 'Exportar demanda <b>(ALt+E)</b>',
        handler: function() {
            var win = window.open('exportarDemanda?identiCB=' + cbCtroBalancePlanes.getValue() 
                    + '&idejercicio=' + cbEjercicioPlanes.getValue()                    
                    /*+ '& filtros=' + Ext.encode(filtrosGpdemandacentrobalancePlanes.getFilterData())*/
                    );

        }
    });

    stGpdemandacentrobalancePlanes = new Ext.data.Store({
        url: 'listarIndXCentroBalance',
        listeners: {
            load: function() {
                siexistecolumFiltradaPlanes();
            },
            beforeload: function() {
                Ext.Ajax.timeout = 600000;
                stGpdemandacentrobalancePlanes.baseParams.identiCB = cbCtroBalancePlanes.getValue();
                stGpdemandacentrobalancePlanes.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stGpdemandacentrobalancePlanes.baseParams.start = offsetGpdemandacentrobalancePlanes;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [
            {
                name: 'denomentidadpadre'
            }, {
                name: 'denominacionenti'
            }, {
                name: 'denominacionmodelo'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacionind'
            }, {
                name: 'necesidad'
            }, {
                name: 'ajuste'
            }, {
                name: 'cantidadreal'
            }, {
                name: 'importe'
            }])
    });

    var stCmbEspecialidadPlanes = new Ext.data.Store({
        url: 'listarHijosRector',
        storeId: 'stCmbEspecialidadPlanes',
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 120000;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identi'
        }, [{
                name: 'identi'
            }, {
                name: 'denominacion'
            }])
    });

    var btnLimpiarFiltrosDemandaPlanes = new Ext.Button({
        id: 'btntodos',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            //filtrosGpdemandacentrobalancePlanes.clearFilters();
            stCmbEspecialidadPlanes.reload();
        }
    });

    var stCbPaginadoPlanes = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [10, '10'],
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });

    var cbPaginadoPlanes = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginadoPlanes,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 55,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('ptGpdemandacentrobalance').pageSize = record.data.idnumpag;
                Ext.getCmp('ptGpdemandacentrobalance').doLoad(Ext.getCmp('ptGpdemandacentrobalance').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    var pgGpdemandacentrobalancePlanes = new Ext.PagingToolbar({
        pageSize: 20,
        id: 'pgGpdemandacentrobalancePlanes',
        store: stGpdemandacentrobalancePlanes,
        displayInfo: true,
        items: [btnLimpiarFiltrosDemandaPlanes, '-', {
                xtype: 'tbtext',
                text: 'Resultados por p&aacute;gina : '
            }, cbPaginadoPlanes],
        listeners: {
            beforechange: function(p, e) {
                offsetGpdemandacentrobalancePlanes = e.start;
            }
        }
    });

    var GpdemandacentrobalancePlanes = new Ext.grid.GridPanel({
        frame: true,
        id: 'Gpdemandacentrobalance',
        autoExpandColumn: 'expandir',
        store: stGpdemandacentrobalancePlanes,
        margins: '2 2 2 -4',
        region: 'center',
       // plugins: filtrosGpdemandacentrobalancePlanes,
        sm: smGpdemandacentrobalancePlanes,
        cm: cmGpdemandacentrobalancePlanes,
        loadMask: {
            msg: 'Cargando...'
        },
        tbar: [{
                xtype: 'tbtext',
                text: 'Centro de Balance:'
            }, cbCtroBalancePlanes, '-', btnExportardemandaPlanes],
        bbar: pgGpdemandacentrobalancePlanes
    });

    var btnCancelarDemandaPlanes = new Ext.Toolbar.Button({
        id: 'btnCancelarDemanda',
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function() {
            winDemandaCentroBalancePlanes.destroy();
            cbCtroBalancePlanes.clearValue();
            //stGpdemandacentrobalancePlanes.reload();
        }
    });

    winDemandaCentroBalancePlanes = new Ext.Window({
        title: "Demanda por Entidades a los centros de balance",
        width: 1000,
        layout: 'fit',
        height: 500,
        constrain: true,
        modal: true,
        //cls: 'ventanaAdelante',
        closeAction: 'destroy',
        buttons: [btnCancelarDemandaPlanes],
        items: [GpdemandacentrobalancePlanes],
        listeners: {
            beforeshow: function() {
                stcbCtroBalancePlanes.load();
                guardarEstadoPanelesDemanda();
            }, beforeclose: function() {
                habilitarPanelVerDemanda();
            }, beforedestroy: function() {
                habilitarPanelVerDemanda();
            }, beforehide: function() {
                habilitarPanelVerDemanda();
            }
        }
    });
    winDemandaCentroBalancePlanes.show();
    function habilitarPanelVerDemanda() {
        if (estadoTreePlanes)
            pPlanes.disable();
        if (estadoGridInd)
            pModeloPlanes.disable();
        if (estadoPanelInd)
            Ext.getCmp('idpcmPlanes').disable();
    }
    function guardarEstadoPanelesDemanda() {
        estadoTreePlanes = pPlanes.disabled;
        estadoGridInd = pModeloPlanes.disabled;
        estadoPanelInd = Ext.getCmp('idpcmPlanes').disabled;
        pPlanes.enable();
        pModeloPlanes.enable();
        Ext.getCmp('idpcmPlanes').enable();
    }
}

