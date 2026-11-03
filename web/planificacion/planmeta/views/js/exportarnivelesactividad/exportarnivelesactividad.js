Ext.QuickTips.init();
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('exportarnivelesactividad', cargarInterfaz);
var winImp;

var contador = 0;
var mymask_na = new Ext.LoadMask(Ext.getBody(), {
    msg: 'Cargando...',
    id: 'mask_i'
});

// function CargarInterfaz
function cargarInterfaz() {
    mymask_na.show();

    // Store grid stGpCT
    stGpNivelesActividadExportar = new Ext.data.Store({
        url: 'listarNivelesActividad',
        listeners: {
            beforeload: function(st) {
            },
            load: function() {
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data'
        }, [{
                name: 'codigo'
            }, {
                name: 'idespecialidad'
            }, {
                name: 'importe'
            }, {
                name: 'plan',
                mapping: 'DatActividadModelo'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'nivelactividad'
            }])
    });

    btnExportarNivelAct = new Ext.Button({
        disabled: false,
        id: 'btnExportarNivelAct',
        tabIndex: 9,
        icon: perfil.dirImg + 'exportar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAyu,
        text: 'Exportar',
        handler: function() {
        }
    });

    btnAyuNivelAct = new Ext.Button({
        disabled: false,
        id: 'btnAyuNivelAct',
        tabIndex: 9,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAyu,
        text: 'Ayuda',
        handler: function() {
        }
    });
    Ext.grid.filter.String_adaptadoFilter.prototype.icon = perfil.dirImg
            + 'find.png';
    filtrosNivelesActividadExportar = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'listado',
                dataIndex: 'especialidad',
                idcombo: 'cbFiltroespecialidad',
                urlcb: 'cargarfiltroespecialidades',
                idstore: 'idespecialidad',
                valueFieldcb: 'idespecialidad',
                displayFieldcb: 'denespecialidad',
                numeropeticiones: 2,
                mascara: mymask_na,
                store: stGpNivelesActividadExportar
            }, {
                type: 'string',
                dataIndex: 'importe'
            }, {
                type: 'listado',
                dataIndex: 'plan',
                idcombo: 'cbFiltroplan',
                urlcb: 'cargarfiltroplanes',
                idstore: 'idmodelo',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                numeropeticiones: 2,
                mascara: mymask_na,
                store: stGpNivelesActividadExportar

            }, {
                type: 'boolean',
                dataIndex: 'nivelaprobacion'
            }, {
                type: 'string',
                dataIndex: 'nivelactividad'
            }]
    });

    // *** Column Model del Grid
    cmGpNivelesActividadExportar = new Ext.grid.ColumnModel([{
            header: 'Código',
            dataIndex: 'codigo',
            sortable: true,
            align: 'center',
            width: 100
        }, {
            width: 200,
            header: 'Especialidad',
            align: 'center',
            sortable: true,
            dataIndex: 'idespecialidad',
            renderer: renderEspecialidad
        }, {
            header: 'Importe',
            width: 100,
            sortable: true,
            align: 'center',
            dataIndex: 'importe'
        }, {
            header: 'Plan',
            width: 200,
            align: 'center',
            dataIndex: 'plan',
            sortable: true,
            renderer: renderPlan
        }, {
            header: 'Nivel de aprobada',
            width: 100,
            dataIndex: 'idaprobacion',
            sortable: true,
            align: 'center',
            renderer: renderNivelAprobada

        }, {
            width: 100,
            header: 'Nivel de actividad',
            dataIndex: 'nivelactividad',
            sortable: true,
            align: 'center'
        }]);
    smGpNivelesActividadExportar = new Ext.grid.RowSelectionModel({});
    gpNivelesActividadExportar = new Ext.grid.GridPanel({
        frame: true,
        title: 'Niveles de actividad',
        store: stGpNivelesActividadExportar,
        region: 'center',
        margins: '2 2 2 -4',
        sm: smGpNivelesActividadExportar,
        cm: cmGpNivelesActividadExportar,
        plugins: filtrosNivelesActividadExportar,
        loadMask: {
            msg: 'Por favor espere...'
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpNivelesActividadExportar,
            displayInfo: true
        })
    });
    vpExportarNivelesActividad = new Ext.Viewport({
        layout: 'fit',
        id: 'vpExportarNivelesActividad',
        items: new Ext.Panel({
            layout: 'border',
            items: [gpNivelesActividadExportar],
            tbar: [btnExportarNivelAct, '->', btnAyuNivelAct]
        })
    });
}
function renderPlan(value) {
    return getRawValue(value[0].idmodelo, Ext.getCmp('cbFiltroplan'));
}
function renderEspecialidad(value) {
    return getRawValue(value, Ext.getCmp('cbFiltroespecialidad'));
}
function renderNivelAprobada(value) {
    if (value == 4)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}
function getRawValue(v, cmb) {
    var str = '';
    if (v != '' && cmb.store.getById(v)) {
        str = cmb.store.getById(v).data[cmb.displayField];
    }
    return str;
}
