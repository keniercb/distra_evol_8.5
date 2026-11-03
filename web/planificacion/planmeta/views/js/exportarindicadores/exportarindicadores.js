Ext.QuickTips.init();
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('exportarindicadores', cargarInterfaz);
var mensaje, stCmbCentroBalance, cbcentrobalance, cbOrganoS, stCmbOrganoS;
var fpGest, winFpGest, cmb, stCmbNaturaleza;
objci = {};
var contador = 0;
var mymask_i = new Ext.LoadMask(Ext.getBody(), {
    msg: 'Cargando...',
    id: 'mask_i'
});
function cargarInterfaz() {
    mymask_i.show();
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    // Store grid stGpCT
    stGpIndicadoresExportar = new Ext.data.Store({
        url: 'listarindicadores',
        listeners: {
            beforeload: function(st) {
                stGpIndicadoresExportar.baseParams.idejercicio = cbEjercicio.getValue();
            },
            load: function() {
                cambiarTitulo();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'nivelarbol'
            }, {
                name: 'naturaleza'
            }, {
                name: 'idcentrobalance',
                mapping: 'DatIndicadorcentrobalance'
            }, {
                name: 'idumedida'
            }, {
                name: 'estado'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'nivel'
            }, {
                name: 'idviaadquisicion',
                mapping: 'DatIndicadorviaadquisicion'
            }, {
                name: 'idorganosatisface',
                mapping: 'DatIndicadorviaadquisicion'
            }, {
                name: 'precio'
            }])
    });
    btnExportarInd = new Ext.Button({
        disabled: false,
        id: 'btnExportarInd',
        tabIndex: 9,
        icon: perfil.dirImg + 'exportar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnExportar,
        text: perfil.etiquetas.lbBtnExportar,
        handler: function() {
            exportarInd();
        }
    });


    btnAyuInd = new Ext.Button({
        disabled: false,
        id: 'btnAyuInd',
        tabIndex: 9,
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnHelp,
        text: 'Ayuda',
        handler: function() {
        }
    });
    btnLimpiarInd = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarInd',
        tabIndex: 9,
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnLimpiar,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            filtrosIndicadoresExportar.clearFilters();
        }
    });
    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);

            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }])
    });
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function(cb, rec, index) {

                stGpIndicadoresExportar.reload({
                    params: {
                        limit: 20,
                        start: 0
                    }
                });

            }
        }
    });
    filtrosIndicadoresExportar = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'list',
                dataIndex: 'nivelarbol',
                options: [{
                        idnivelarbol: 1,
                        nivelarbol: 'Genérico'
                    }, {
                        idnivelarbol: 2,
                        nivelarbol: 'Subgenérico'
                    }, {
                        idnivelarbol: 3,
                        nivelarbol: 'Específico'
                    }, {
                        idnivelarbol: 4,
                        nivelarbol: 'Surtido'
                    }],
                id: 'idnivelarbol',
                labelField: 'nivelarbol'
            }, {
                type: 'listado',
                dataIndex: 'naturaleza',
                idcombo: 'cbFiltroNaturaleza',
                urlcb: 'cargarfiltronaturaleza',
                idstore: 'iddatosnomenclador',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'nom_datosnomenclador_denominacion',
                numeropeticiones: 5,
                mascara: mymask_i,
                storegrid: stGpIndicadoresExportar,
                width: 150
            }, {
                type: 'listado',
                dataIndex: 'idcentrobalance',
                idcombo: 'cbFiltroCB',
                urlcb: 'cargarfiltrocentrobalance',
                idstore: 'idcentrobalance',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance',
                numeropeticiones: 5,
                mascara: mymask_i,
                storegrid: stGpIndicadoresExportar,
                width: 250
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'cbFiltroUM',
                urlcb: 'cargarfiltrounidadmedida',
                idstore: 'idunidadmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                numeropeticiones: 5,
                mascara: mymask_i,
                storegrid: stGpIndicadoresExportar,
                width: 150
            }, {
                type: 'boolean',
                dataIndex: 'estado'
            }, {
                type: 'boolean',
                dataIndex: 'idaprobacion'
            }, {
                type: 'boolean',
                dataIndex: 'nivel'
            }, {
                type: 'listado',
                dataIndex: 'idviaadquisicion',
                idcombo: 'cbFiltroviaadquisicion',
                urlcb: 'cargarfiltroviaadquisicion',
                idstore: 'idviaadquisicion',
                valueFieldcb: 'idviaadquisicion',
                displayFieldcb: 'denominacion',
                numeropeticiones: 5,
                mascara: mymask_i,
                store: stGpIndicadoresExportar,
                width: 150
            }, {
                type: 'listado',
                dataIndex: 'idorganosatisface',
                idcombo: 'cbFiltroorgano',
                urlcb: 'cargarfiltroorgano',
                idstore: 'idorganosatisface',
                valueFieldcb: 'idorganosatisface',
                displayFieldcb: 'denominacion',
                numeropeticiones: 5,
                mascara: mymask_i,
                storegrid: stGpIndicadoresExportar,
                width: 150
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }]
    });
    teclas = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 'Ee',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function(_this) {
                if (!Ext.getCmp('btnExportarInd').disabled) {
                    Ext.getCmp('btnExportarInd').handler.call(this);
                }
            }
        }, {
            key: 'Ll',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function() {
                if (!btnLimpiarInd.hidden) {
                    if (!btnLimpiarInd.disabled)
                        filtrosIndicadoresExportar.clearFilters();
                }
            }
        }

    ]);
    teclas.enable();

    // *** Column Model del Grid
    cmGpIndicadoresExportar = new Ext.grid.ColumnModel([{
            header: 'Código',
            dataIndex: 'codigo',
            tooltip: 'Código',
            sortable: true,
            align: 'left',
            width: 90,
            renderer: crearToolTip
        }, {
            width: 100,
            header: 'Número de pieza',
            align: 'center',
            sortable: true,
            dataIndex: 'numeropieza',
            tooltip: 'Número de pieza',
            renderer: crearToolTip
        }, {
            width: 100,
            header: 'Denominación',
            align: 'center',
            sortable: true,
            dataIndex: 'denominacion',
            tooltip: 'Denominación',
            renderer: crearToolTip
        }, {
            width: 100,
            header: 'Nivel',
            align: 'center',
            sortable: true,
            dataIndex: 'nivelarbol',
            tooltip: 'Nivel',
            renderer: modificarNivel
        }, {
            header: 'Naturaleza',
            width: 100,
            sortable: true,
            align: 'center',
            dataIndex: 'naturaleza',
            tooltip: 'Naturaleza',
            renderer: renderNaturaleza
        }, {
            header: 'Centro de balance',
            width: 115,
            align: 'center',
            dataIndex: 'idcentrobalance',
            sortable: true,
            tooltip: 'Centro de balance',
            renderer: renderCentroBalance
        }, {
            header: 'Unidad de medida',
            width: 100,
            dataIndex: 'idumedida',
            sortable: true,
            tooltip: 'Unidad de medida',
            align: 'center',
            renderer: renderUM

        }, {
            width: 80,
            header: 'Aprobado',
            dataIndex: 'idaprobacion',
            tooltip: 'Aprobado',
            sortable: true,
            align: 'center',
            renderer: modificarAprobado
        }, {
            header: 'Nivel de planificación',
            dataIndex: 'nivel',
            width: 115,
            sortable: true,
            tooltip: 'Nivel de planificación',
            align: 'center',
            renderer: modificarNivelPlanificacion
        }, {
            header: 'Activado',
            width: 85,
            sortable: true,
            dataIndex: 'estado',
            tooltip: 'Activado',
            align: 'center',
            renderer: modificarActivado
        }, {
            header: 'Via de adquisición',
            width: 115,
            sortable: true,
            dataIndex: 'idviaadquisicion',
            tooltip: 'Via de adquisición',
            align: 'center',
            renderer: rendervia
        }, {
            header: 'Organo que satisface',
            width: 115,
            sortable: true,
            dataIndex: 'idorganosatisface',
            align: 'center',
            tooltip: 'Órgano que satisface',
            renderer: renderorgano
        }, {
            header: 'Precio',
            width: 85,
            sortable: true,
            dataIndex: 'precio',
            tooltip: 'Precio',
            align: 'center',
            renderer: crearToolTip
        }]);
    smGpIndicadoresExportar = new Ext.grid.RowSelectionModel({});
    gpIndicadoresExportar = new Ext.grid.GridPanel({
        frame: true,
        title: 'Indicadores',
        region: 'center',
        store: stGpIndicadoresExportar,
        margins: '2 2 2 -4',
        sm: smGpIndicadoresExportar,
        cm: cmGpIndicadoresExportar,
        plugins: filtrosIndicadoresExportar,
        loadMask: {
            msg: 'Por favor espere...',
            store: stGpIndicadoresExportar
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpIndicadoresExportar,
            displayInfo: true,
            items: [btnLimpiarInd]
        })
    });
    vpExportarIndicadores = new Ext.Viewport({
        layout: 'fit',
        id: 'vpExportarIndicadores',
        items: new Ext.Panel({
            layout: 'border',
            items: [gpIndicadoresExportar],
            tbar: [btnExportarInd, '-', 'Ejercicio:', cbEjercicio, '->', btnAyuInd]
        })
    });

}// Endof cargarInterfaz

function modificarNivel(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    switch (value) {
        case '1' :
            return 'Genérico';
            break;
        case '2' :
            return 'Subgenérico';
            break;
        case '3' :
            return 'Específico';
            break;
        default :
            return 'Surtido';
    }
    return x;
}

function modificarAprobado(val) {
    if (val == 4)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}

function modificarActivado(val) {
    if (val == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}

function modificarNivelPlanificacion(val) {
    if (val == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
    return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
}

function renderCentroBalance(value, m) {
    result = '';
    for (var i = 0; i < value.length; i++) {
        result += getRawValue(
                value[i].DatEntidaddatosnomenclador.idcentrobalance, Ext.getCmp('cbFiltroCB'));
        if (value.length - 1 > i)
            result += ', ';
    }
    m.attr = 'ext:qtip="' + result + '"';
    return result;
}
function renderDenominacion(value) {
    result = '';
    for (var i = 0; i < value.length; i++) {
        result += getRawValue(
                value[i].DatEntidaddatosnomenclador.idcentrobalance, Ext.getCmp('cbFiltroCB'));
        if (value.length - 1 > i)
            result += ', ';
    }
    return result;
}
function renderUM(value) {
    return getRawValue(value, Ext.getCmp('cbFiltroUM'));
}

function renderorgano(value, m) {
    result = '';

    for (var i = 0; i < value.length; i++) {
        for (var j = 0; j < value[i].DatIndicadorviaadquisicionorganosatisface.length; j++) {
            result += (value[i].DatIndicadorviaadquisicionorganosatisface[j].NomOrganosatisface != null) ? getRawValue(value[i].DatIndicadorviaadquisicionorganosatisface[j].NomOrganosatisface.idorganosatisface, Ext.getCmp('cbFiltroorgano')) : '';
            if (value[i].DatIndicadorviaadquisicionorganosatisface.length - 1 > i)
                result += ', ';
        }
    }
    m.attr = 'ext:qtip="' + result + '"';
    return result;
}

function renderNaturaleza(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return getRawValue(value, Ext.getCmp('cbFiltroNaturaleza'));
}
function rendervia(value) {
    result = '';
    for (var i = 0; i < value.length; i++) {
        if (value[i].NomViaadquisicion.denominacion != null)
        {

            result += value[i].NomViaadquisicion.denominacion;
        }
    }

    return result;
}
function getRawValue(v, cmb) {

    var str = '';
    if ((v != '') && (cmb.store.getById(v))) {
        str = cmb.store.getById(v).data[cmb.displayField];
    }
    return str;
}

function cambiarTitulo() {
    filters = filtrosIndicadoresExportar.getFilterData();
    var title = '';
    if (filters.length > 0) {
        coma = '/';
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].field == 'codigo') {
                title += 'Código';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'denominacion') {
                title += 'Denominación';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'numeropieza') {
                title += 'Número de pieza';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'nivelarbol') {
                title += 'Nivel árbol';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'naturaleza') {
                title += 'Naturaleza';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'idcentrobalance') {
                title += 'Centro de balance';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'idumedida') {
                title += 'Unidad de medida';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'idaprobacion') {
                title += 'Aprobado';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'estado') {
                title += 'Activado';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'idviaadquisicion') {
                title += 'Vía de adquisición';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'idorganosatisface') {
                title += 'Organo que satisface';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'precio') {
                title += 'Precio';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
            if (filters[i].field == 'nivel') {
                title += 'Nivel de planificación';
                if (filters[i + 1]) {
                    title += coma;
                }
            }
        }
        gpIndicadoresExportar.setTitle('Indicadores - Filtrado por: ' + title);
    }
    else
        gpIndicadoresExportar.setTitle('Indicadores');
}

function exportarInd() {
    var array = [];

    filtros = filtrosIndicadoresExportar.getFilterData();
    var idejercicio = cbEjercicio.getValue();
    var win = window.open('exportar?filtros=' + Ext.encode(filtros) + '&idejercicio=' + cbEjercicio.getValue());
    setTimeout(function() {
        win.close()
    }, 60003000);
    mascaraExportar('Exportando indicadores', 'Por favor espere, solo tomará unos segundos', win);
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
