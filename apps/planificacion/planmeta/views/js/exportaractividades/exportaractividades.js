var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('exportaractividades', cargarInterfaz);
var contador = 0;
var mymask = new Ext.LoadMask(Ext.getBody(), {
    msg: 'Cargando...',
    id: 'mask'
});
var array_niveles = [];
function cargarInterfaz() {
    mymask.show();
    // Store grid stGpCT
    stGpActividadesExportar = new Ext.data.Store({
        url: 'listaractividades',
        listeners: {
            beforeload: function(st) {
                Ext.Ajax.timeout = 60000;
                cambiarTituloFiltrarExportActvs();
            },
            load: function() {

            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idactividad'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'nivel'
            }, {
                name: 'idespecialidad'
            }, {
                name: 'plan',
                mapping: 'DatActividadModelo'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'estado'
            }, {
                name: 'normada',
                mapping: 'DatNorma'
            }, {
                name: 'importe'
            }, {
                name: 'importedivisa'
            }])
    });

    btnAyuAct = new Ext.Button({
        disabled: false,
        id: 'btnAyuAct',
        tabIndex: 9,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnHelp,
        text: perfil.etiquetas.lbBtnAyuda,
        handler: function() {
        }
    });

    btnLimpiarAct = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarAct',
        tabIndex: 9,
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnLimpiar,
        text: 'Limpiar',
        handler: function() {
            filtrosActividadesExportar.clearFilters();
            Ext.getCmp('cbnormas').setValue(false);
        }
    });


    filtrosActividadesExportar = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'nivel',
                idcombo: 'cmbFiltroNivelesActividad',
                urlcb: 'listarNiveles',
                idstore: 'stniveles',
                valueFieldcb: 'nivel',
                displayFieldcb: 'nombre',
                numeropeticiones: 2,
                mascara: mymask,
                storegrid: stGpActividadesExportar
            }, {
                type: 'listado',
                dataIndex: 'idespecialidad',
                idcombo: 'cmbFiltroEspecialidadActividad',
                urlcb: 'cargarfiltroespecialidades',
                idstore: 'idespecialidad',
                valueFieldcb: 'idespecialidad',
                displayFieldcb: 'denespecialidad',
                numeropeticiones: 2,
                mascara: mymask,
                storegrid: stGpActividadesExportar
            }, {
                type: 'listado',
                dataIndex: 'plan',
                idcombo: 'cmbFiltroPlanActividad',
                urlcb: 'cargarfiltroplanes',
                idstore: 'idmodelo',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                numeropeticiones: 2,
                mascara: mymask,
                storegrid: stGpActividadesExportar
            }, {
                type: 'boolean',
                dataIndex: 'idaprobacion'
            }, {
                type: 'boolean',
                dataIndex: 'estado'
            }, {
                type: 'boolean',
                dataIndex: 'normada'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'numeric',
                dataIndex: 'importedivisa'
            }]
    });

    Ext.getCmp('cmbFiltroPlanActividad').store.on('load', function() {
        var TopicRecord = Ext.data.Record.create([
            {
                name: 'idmodelo'
            },
            {
                name: 'denominacion'
            }]);
        var myNewRecord = new TopicRecord({
            idmodelo: '-1',
            denominacion: '-'
        });
        Ext.getCmp('cmbFiltroPlanActividad').store.add(myNewRecord);
    });

    // *** Column Model del Grid
    cmGpActividadesExportar = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            sortable: true,
            align: 'left',
            width: 100
        }, {
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            align: 'center',
            width: 100
        }, {
            width: 100,
            header: perfil.etiquetas.lbNivel,
            align: 'center',
            sortable: true,
            dataIndex: 'nivel',
            renderer: renderNivel
        }, {
            header: perfil.etiquetas.lbEspecialidad,
            width: 190,
            sortable: true,
            align: 'center',
            dataIndex: 'idespecialidad',
            renderer: especialidadRender
        }, {
            header: perfil.etiquetas.lbPlan,
            width: 200,
            align: 'center',
            dataIndex: 'plan',
            sortable: true,
            renderer: renderPlan
        }, {
            header: perfil.etiquetas.lbAprobacion,
            width: 100,
            dataIndex: 'idaprobacion',
            sortable: true,
            align: 'center',
            renderer: renderAprobada

        }, {
            width: 100,
            header: perfil.etiquetas.lbEstado,
            dataIndex: 'estado',
            sortable: true,
            align: 'center',
            renderer: renderActivada
        }, {
            header: perfil.etiquetas.lbNormada,
            dataIndex: 'normada',
            width: 100,
            sortable: true,
            align: 'center',
            renderer: renderNorma
        }, {
            header: perfil.etiquetas.lbImporteMN,
            width: 100,
            sortable: true,
            dataIndex: 'importe',
            align: 'center',
            renderer: setImporteX
        }, {
            header: perfil.etiquetas.lbImporteMLC,
            width: 100,
            sortable: true,
            dataIndex: 'importedivisa',
            align: 'center',
            renderer: setImporteX
        }]);
    smGpActividadesExportar = new Ext.grid.RowSelectionModel({});
    gpActividadesExportar = new Ext.grid.GridPanel({
        frame: true,
        title: perfil.etiquetas.lbTitGrip,
        store: stGpActividadesExportar,
        margins: '2 2 2 -4',
        region: 'center',
        sm: smGpActividadesExportar,
        cm: cmGpActividadesExportar,
        plugins: filtrosActividadesExportar,
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpActividadesExportar,
            displayInfo: true
        })
    });
    vpExportarActividades = new Ext.Viewport({
        layout: 'fit',
        id: 'vpExportarActividades',
        items: new Ext.Panel({
            layout: 'border',
            items: [gpActividadesExportar],
            tbar: [new Ext.Toolbar.MenuButton({
                    text: 'Exportar',
                    tooltip: {
                        text: 'Exportar actividades'
                    },
                    icon: perfil.dirImg + 'exportar.png',
                    iconCls: 'btn',
                    menu: {
                        items: [{
                                id: 'btnActividades',
                                icon: perfil.dirImg + 'area.png',
                                iconCls: 'btn',
                                text: 'Actividades',
                                handler: function() {
                                    exportar('actividad');
                                }
                            }, {
                                id: 'btnconNormas',
                                icon: perfil.dirImg + 'norma.png',
                                iconCls: 'btn',
                                text: 'Actividades con normas',
                                handler: function() {
                                    exportar('norma');
                                }
                            }, {
                                id: 'btnconReglas',
                                icon: perfil.dirImg + 'regla.png',
                                iconCls: 'btn',
                                text: 'Actividades con reglas',
                                handler: function() {
                                    exportar('regla');
                                }
                            }, {
                                id: 'btnconSalidas',
                                icon: perfil.dirImg + 'lote.png',
                                iconCls: 'btn',
                                text: 'Actividades con salidas',
                                handler: function() {
                                    exportar('salida');
                                }
                            }]
                    }
                }), '->', btnLimpiarAct, btnAyuAct]
        })
    });
}
function especialidadRender(value) {
    return getRawValue(value, Ext.getCmp('cmbFiltroEspecialidadActividad'));
}
function renderNivel(nivel) {
    var storeniveles = Ext.getCmp('cmbFiltroNivelesActividad').store;
    if (nivel - 1 >= 0 && nivel - 1 < storeniveles.getCount())
        return storeniveles.data.items[nivel - 1].data.nombre
    return "?";
}
function renderPlan(value) {
    if (value[0]) {
        return getRawValue(value[0].idmodelo, Ext.getCmp('cmbFiltroPlanActividad'));
    }
    return '-';
}
function renderAprobada(value) {
    if (value == 4)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}
function renderActivada(value) {
    if (value == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}
function renderNorma(value) {
    if (value.length > 0)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}
function  setImporteX(value) {
    if (value == null)
        return '0.0000';
    return value;
}
function getRawValue(v, cmb) {
    var str = '';
    if (v != '' && cmb.store.getById(v)) {
        str = cmb.store.getById(v).data[cmb.displayField];
    }
    return str;
}
function cambiarTituloFiltrarExportActvs() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosActividadesExportar.getFiltrosActivos() == undefined || filtrosActividadesExportar.getFiltrosActivos().length == 0) {
        gpActividadesExportar.setTitle(perfil.etiquetas.lbTitGrip);
    } else {
        for (i = 0; i < filtrosActividadesExportar.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "nivel") {
                aux = perfil.etiquetas.lbNivel;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "idespecialidad") {
                aux = perfil.etiquetas.lbEspecialidad;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "plan") {
                aux = perfil.etiquetas.lbPlan;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "idaprobacion") {
                aux = perfil.etiquetas.lbAprobacion;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "estado") {
                aux = perfil.etiquetas.lbEstado;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "normada") {
                aux = perfil.etiquetas.lbNormada;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "importe") {
                aux = perfil.etiquetas.lbImporteMN;
            } else if (filtrosActividadesExportar.getFiltrosActivos()[i].dataIndex == "importedivisa") {
                aux = perfil.etiquetas.lbImporteMLC;
            } else {
                aux = "?";
            }
            if (i == filtrosActividadesExportar.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpActividadesExportar.setTitle(perfil.etiquetas.lbTitGrip + "<i> -" + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}
function exportar(valor) {
    filtros = [];
    for (var i = 0; i < filtrosActividadesExportar.filters.items.length; i++) {
        if (filtrosActividadesExportar.filters.items[i].active) {
            var args = new Object();
            args['type'] = filtrosActividadesExportar.filters.items[i].type;
            args['value'] = filtrosActividadesExportar.filters.items[i]
                    .getValue();
            var data = new Object();
            data['data'] = args;
            data['field'] = filtrosActividadesExportar.filters.items[i].dataIndex;
            filtros.push(data);
        }
    }
    Ext.Ajax.timeout = 600000;
    var win = window.open('exportar?filtros=' + Ext.encode(filtros) + '&tipoexp=' + valor);
}