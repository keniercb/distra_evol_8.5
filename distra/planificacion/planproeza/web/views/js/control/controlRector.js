var offsetGestionarObservacionRector = 0;
function cargarControlRector() {
    var importesRector = [];
    btnLimpiarControlRector = new Ext.Button({
        id: 'idbtnLimpiarControlRector',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosControlRector.clearFilters();
        }
    });
    stControlRector = new Ext.data.Store({
        id: 'stControlRector',
        url: 'listarControlEmpresaRector',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddemanda'
        }, [{
                name: 'iddemanda'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'identidaduim'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'tieneobservacion'
            }, {
                name: 'idprograma'
            }, {
                name: 'iddestino'
            }, {
                name: 'estimado'
            }, {
                name: 'plan'
            }, {
                name: 'ajuste'
            }, {
                name: 'planfinal'
            }, {
                name: 'cantreal'
            }, {
                name: 'diferencia'
            }, {
                name: 'importeplan'
            }, {
                name: 'importeajustado'
            }, {
                name: 'importereal'
            }, {
                name: 'diferenciaimporte'
            }, {
                name: 'importeplandivisa'
            }, {
                name: 'importeajustadodivisa'
            }, {
                name: 'importerealdivisa'
            }, {
                name: 'diferenciaimportedivisa'
            }, {
                name: 'enero'
            }, {
                name: 'febrero'
            }, {
                name: 'marzo'
            }, {
                name: 'abril'
            }, {
                name: 'mayo'
            }, {
                name: 'junio'
            }, {
                name: 'julio'
            }, {
                name: 'agosto'
            }, {
                name: 'septiembre'
            }, {
                name: 'octubre'
            }, {
                name: 'noviembre'
            }, {
                name: 'diciembre'
            }, {
                name: 'extraplan'
            }, {
                name: 'importeplantotalmn'
            }
            , {
                name: 'importeplantotalcuc'
            }
            , {
                name: 'importeajustadototalmn'
            }
            , {
                name: 'importeajustadototalcuc'
            }
            , {
                name: 'importerealtotalmn'
            }
            , {
                name: 'importerealtotalcuc'
            }
            , {
                name: 'diferenciaimportetotalmn'
            }
            , {
                name: 'diferenciaimportetotalcuc'
            }
        ]),
        listeners: {
            beforeload: function () {
                mymask.show();
                stControlRector.baseParams.start = offsetControlRector;
                stControlRector.baseParams.identidad = nodoEntidadControl.id;
                stControlRector.baseParams.idejercicio = cbEjercicioControl.getValue();
                stControlRector.baseParams.tipo = cbComportamientoControl.getValue();
            },
            load: function () {
                cambiarTituloFiltrar(gpControlRector, filtrosControlRector, 'Controles');
                gpControlRector.enable();
                if (stControlRector.getCount() == 0) {
                    btnExportarControl.disable();
                    btnGestionarObservacionRector.disable();
                    if (filtrosControlRector.getFiltrosActivos() == undefined || filtrosControlRector.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);
                } else {
                    upColorCellControlRector(stControlRector, cmControlRector, gpControlRector);
                    calcularImporteTotalRector();
                    if (importesRector[cbImportesRector.getValue()] != undefined) {
                        var importeRector = separadorDeMilesRector(importesRector[cbImportesRector.getValue()]);
                        tfimportetotalRector.setValue(importeRector);
                    } else {
                        tfimportetotalRector.setValue('0.000');
                    }
                    upColorControl(stControlRector, cmControlRector, gpControlRector);
                    btnExportarControl.enable();
                    Ext.getCmp('btnExportarControlRector').show();
                    Ext.getCmp('btnExportarControlProductor').hide();
                    Ext.getCmp('btnExportarControlEmpresa').hide();
                }
                gpControlRector.getSelectionModel().clearSelections();
                mymask.hide();
            }
        }
    });
    stTieneObservRector = new Ext.data.SimpleStore({
        id: 'stTieneObservRector',
        fields: [{
                name: 'tieneobservacion'
            }, {
                name: 'denominacion'
            }],
        data: [['0', perfil.etiquetas.lbNo], ['1', perfil.etiquetas.lbSi]]
    });
    filtrosControlRector = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedidaAddTC',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'identidaduim',
                idcombo: 'idcbentidadempresa',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesEmpresa,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'identidadcliente',
                idcombo: 'idcbentidadcliente',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesCliente,
                autoload: false,
                mode: 'local'
            }, {
                type: 'list',
                dataIndex: 'tieneobservacion',
                options: [[0, perfil.etiquetas.lbNo], [1, perfil.etiquetas.lbSi]]
            }, {
                type: 'listado',
                dataIndex: 'idprograma',
                idcombo: 'idcbprograma',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stPrograma,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'iddestino',
                idcombo: 'idcbdestino',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                st: stDestino,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'estimado'
            }, {
                type: 'numeric',
                dataIndex: 'plan'
            }, {
                type: 'numeric',
                dataIndex: 'ajuste'
            }, {
                type: 'numeric',
                dataIndex: 'planfinal'
            }, {
                type: 'numeric',
                dataIndex: 'cantreal'
            }, {
                type: 'numeric',
                dataIndex: 'diferencia'
            }, {
                type: 'numeric',
                dataIndex: 'importeplan'
            }, {
                type: 'numeric',
                dataIndex: 'importeajustado'
            }, {
                type: 'numeric',
                dataIndex: 'importereal'
            }, {
                type: 'numeric',
                dataIndex: 'diferenciaimporte'
            }, {
                type: 'numeric',
                dataIndex: 'importeplandivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importeajustadodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'importerealdivisa'
            }, {
                type: 'numeric',
                dataIndex: 'diferenciaimportedivisa'
            }, {
                type: 'numeric',
                dataIndex: 'enero'
            }, {
                type: 'numeric',
                dataIndex: 'febrero'
            }, {
                type: 'numeric',
                dataIndex: 'marzo'
            }, {
                type: 'numeric',
                dataIndex: 'abril'
            }, {
                type: 'numeric',
                dataIndex: 'mayo'
            }, {
                type: 'numeric',
                dataIndex: 'junio'
            }, {
                type: 'numeric',
                dataIndex: 'julio'
            }, {
                type: 'numeric',
                dataIndex: 'agosto'
            }, {
                type: 'numeric',
                dataIndex: 'septiembre'
            }, {
                type: 'numeric',
                dataIndex: 'octubre'
            }, {
                type: 'numeric',
                dataIndex: 'noviembre'
            }, {
                type: 'numeric',
                dataIndex: 'diciembre'
            }]
    });
    cmControlRector = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 100,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUM,
            width: 60,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbEntidadUIM,
            tooltip: perfil.etiquetas.lbEntidadUIM,
            width: 120,
            dataIndex: 'identidaduim',
            renderer: renderEntidadesEmpresa
        }, {
            header: perfil.etiquetas.lbCliente,
            tooltip: perfil.etiquetas.lbCliente,
            width: 120,
            dataIndex: 'identidadcliente',
            renderer: renderEntidadesCliente
        }
        , {
            header: perfil.etiquetas.lbObservacion,
            tooltip: perfil.etiquetas.lbObservacion,
            width: 80,
            dataIndex: 'tieneobservacion',
            renderer: renderBinario
        }, {
            header: perfil.etiquetas.lbPrograma,
            tooltip: perfil.etiquetas.lbPrograma,
            hidden: false,
            width: 120,
            dataIndex: 'idprograma',
            renderer: renderProgramas
        }, {
            header: perfil.etiquetas.lbDestino,
            hidden: false,
            tooltip: perfil.etiquetas.lbDestino,
            width: 120,
            dataIndex: 'iddestino',
            renderer: renderDestinos
        }, {
            header: perfil.etiquetas.lbEstimado,
            tooltip: perfil.etiquetas.lbEstimado,
            width: 100,
            dataIndex: 'estimado',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbPlan,
            tooltip: perfil.etiquetas.lbPlan,
            width: 100,
            dataIndex: 'plan',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAjuste,
            tooltip: perfil.etiquetas.lbAjuste,
            width: 100,
            dataIndex: 'ajuste',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbPlanFinal,
            tooltip: perfil.etiquetas.lbPlanFinal,
            width: 100,
            dataIndex: 'planfinal',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbReal,
            tooltip: perfil.etiquetas.lbReal,
            width: 100,
            dataIndex: 'cantreal',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferencia,
            tooltip: perfil.etiquetas.lbDiferencia,
            width: 100,
            dataIndex: 'diferencia',
            renderer: crearToolTip,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImportePlan,
            tooltip: perfil.etiquetas.lbImportePlan,
            width: 100,
            dataIndex: 'importeplan',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteAjustado,
            tooltip: perfil.etiquetas.lbImporteAjustado,
            width: 100,
            dataIndex: 'importeajustado',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteReal,
            tooltip: perfil.etiquetas.lbImporteReal,
            width: 100,
            dataIndex: 'importereal',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferenciaImporte,
            tooltip: perfil.etiquetas.lbDiferenciaImporte,
            width: 100,
            dataIndex: 'diferenciaimporte',
            renderer: renderUsuarios,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImportePlanDivisa,
            tooltip: perfil.etiquetas.lbImportePlanDivisa,
            width: 100,
            dataIndex: 'importeplandivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteAjustadoDivisa,
            tooltip: perfil.etiquetas.lbImporteAjustadoDivisa,
            width: 100,
            dataIndex: 'importeajustadodivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbImporteRealDivisa,
            tooltip: perfil.etiquetas.lbImporteRealDivisa,
            width: 100,
            dataIndex: 'importerealdivisa',
            renderer: crearToolTip,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiferenciaImporteDivisa,
            tooltip: perfil.etiquetas.lbDiferenciaImporteDivisa,
            width: 100,
            dataIndex: 'diferenciaimportedivisa',
            renderer: renderUsuarios,
            hidden: true,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbEnero,
            tooltip: perfil.etiquetas.lbEnero,
            width: 80,
            dataIndex: 'enero',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbFebrero,
            tooltip: perfil.etiquetas.lbFebrero,
            width: 80,
            dataIndex: 'febrero',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbMarzo,
            tooltip: perfil.etiquetas.lbMarzo,
            width: 80,
            dataIndex: 'marzo',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAbril,
            tooltip: perfil.etiquetas.lbAbril,
            width: 80,
            dataIndex: 'abril',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbMayo,
            tooltip: perfil.etiquetas.lbMayo,
            width: 80,
            dataIndex: 'mayo',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbJunio,
            tooltip: perfil.etiquetas.lbJunio,
            width: 80,
            dataIndex: 'junio',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbJulio,
            tooltip: perfil.etiquetas.lbJulio,
            width: 80,
            dataIndex: 'julio',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbAgosto,
            tooltip: perfil.etiquetas.lbAgosto,
            width: 80,
            dataIndex: 'agosto',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbSeptiembre,
            tooltip: perfil.etiquetas.lbSeptiembre,
            width: 80,
            dataIndex: 'septiembre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbOctubre,
            tooltip: perfil.etiquetas.lbOctubre,
            width: 80,
            dataIndex: 'octubre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbNoviembre,
            tooltip: perfil.etiquetas.lbNoviembre,
            width: 80,
            dataIndex: 'noviembre',
            renderer: renderMeses,
            align: 'right'
        }, {
            header: perfil.etiquetas.lbDiciembre,
            tooltip: perfil.etiquetas.lbDiciembre,
            width: 80,
            dataIndex: 'diciembre',
            renderer: renderMeses,
            align: 'right'
        }
    ]);
     btnGestionarObservacionRector = new Ext.Button({
        id: 'btnGestionarObservacionRector',
        iconCls: 'info',
        disabled: true,
        hidden: true,
        tooltip: perfil.etiquetas.lbGestionarObservacion,
        handler: function () {
            gestionarObservacionRector();
        }
    });
    smControlRector = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {             
                btnGestionarObservacionRector.enable();
            },
            rowdeselect: function () {             
                btnGestionarObservacionRector.disable();
            }
        }
    });
    tfimportetotalRector = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importetotalRector',
        width: 100,
        align: 'right',
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000',
        disabled: true
    });
    stCbImportesRector = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImportePlan],
            [2, perfil.etiquetas.lbImporteAjustado],
            [3, perfil.etiquetas.lbImporteReal],
            [4, perfil.etiquetas.lbDiferenciaImporte],
            [5, perfil.etiquetas.lbImportePlanDivisa],
            [6, perfil.etiquetas.lbImporteAjustadoDivisa],
            [7, perfil.etiquetas.lbImporteRealDivisa],
            [8, perfil.etiquetas.lbDiferenciaImporteDivisa]
        ]
    });
    cbImportesRector = new Ext.form.ComboBox({
        value: 1,
        store: stCbImportesRector,
        displayField: 'denominacion',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 110,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        listeners: {
            select: function () {
                if (importesRector[cbImportesRector.getValue()] != undefined) {
                    var importeRector = separadorDeMilesRector(importesRector[cbImportesRector.getValue()]);
                    tfimportetotalRector.setValue(importeRector);
                } else {
                    tfimportetotalRector.setValue('0.000');
                }
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    gpControlRector = new Ext.grid.GridPanel({
        store: stControlRector,
        autoScroll: true,
        title: 'Controles',
        id: 'idgpControlRector',
        sm: smControlRector,
        cm: cmControlRector,
        plugins: filtrosControlRector,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stControlRector,
            displayInfo: true,
            items: ['-', btnLimpiarControlRector, '-', cbImportesRector, tfimportetotalRector],
            listeners: {
                beforechange: function (p, e) {
                    offsetControlRector = e.start;
                }
            }
        })
    });
    panelControlRector = new Ext.Panel({
        id: 'panelControlRector',
        layout: 'fit',
        region: 'center',
        items: [gpControlRector]
    });
    function separadorDeMilesRector(nStr) {
        nStr += '';
        ds = nStr.replace(/,/g, '');
        nStr = ds;
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    function setearImporteRector() {
        importesRector = [];
        importesRector.push('0.000'); //indice 0
        importesRector.push('0.000'); //indice 1 lbImportePlan
        importesRector.push('0.000'); //indice 2 lbImporteAjustado   
        importesRector.push('0.000'); //indice 3 lbImporteReal
        importesRector.push('0.000'); //indice 4 lbDiferenciaImporte
        importesRector.push('0.000'); //indice 5 lbImportePlanDivisa   
        importesRector.push('0.000'); //indice 6 lbImporteAjustadoDivisa
        importesRector.push('0.000'); //indice 7 lbImporteRealDivisa   
        importesRector.push('0.000'); //indice 8 lbDiferenciaImporteDivisa   
    }
    function calcularImporteTotalRector() {
        setearImporteRector();
        if (stControlRector.getCount() > 0) {
            importesRector[1] = stControlRector.getAt(0).data.importeplantotalmn;
            importesRector[2] = stControlRector.getAt(0).data.importeajustadototalmn;
            importesRector[3] = stControlRector.getAt(0).data.importerealtotalmn;
            importesRector[4] = stControlRector.getAt(0).data.diferenciaimportetotalmn;
            importesRector[5] = stControlRector.getAt(0).data.importeplantotalcuc;
            importesRector[6] = stControlRector.getAt(0).data.importeajustadototalcuc;
            importesRector[7] = stControlRector.getAt(0).data.importerealtotalcuc;
            importesRector[8] = stControlRector.getAt(0).data.diferenciaimportetotalcuc;

            var importeRector = separadorDeMilesRector(importesRector[cbImportesRector.getValue()]);
            tfimportetotalRector.setValue(importeRector);
        } else {
            var importeRector = separadorDeMilesRector(importesRector[cbImportesRector.getValue()]);
            tfimportetotalRector.setValue(importeRector);
        }
    }
    function upColorCellControlRector(storeDin, cmDin, gpDin) {
    for (var i = 0; i < storeDin.getCount(); i++) {
        for (var j = 0; j < cmDin.getColumnCount(); j++) {
            //cumplido
                if (storeDin.getAt(i).data.diferencia == 0) {
                    Ext.get(gpDin.getView().getCell(i, j)).applyStyles('background-color:#CCFFCC');
                } else
                //sobrecumplido
                if (storeDin.getAt(i).data.diferencia < 0) {
                    Ext.get(gpDin.getView().getCell(i, j)).applyStyles('background-color:#8FBC8B');
                }
        }
    }
}
}
function gestionarObservacionRector() {
    stMesesRector = new Ext.data.Store({
        url: 'cargarMeses',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }])
    });
    cbMesRector = new Ext.form.ComboBox({
        store: stMesesRector,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        width: 150,
        listeners: {
            select: function () {
                stGestionarObservacionRector.reload();
            }
        }
    });
    stGestionarObservacionRector = new Ext.data.Store({
        id: 'stGestionarObservacionRector',
        url: 'listarObservacionesControl',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idobservacioncontrol'
        }, [{
                name: 'idobservacioncontrol'
            }, {
                name: 'iddemandatiempo'
            }
            , {
                name: 'idmes'
            }
            , {
                name: 'identidad'
            }
            , {
                name: 'idusuario'
            }, {
                name: 'observacion'
            }, {
                name: 'fecha'
            }
        ]), listeners: {
            beforeload: function () {
                mymask.show();
                stGestionarObservacionRector.baseParams.iddemanda = smControlRector.getSelected().data.iddemanda;
                stGestionarObservacionRector.baseParams.identidad = nodoEntidadControl.id;
                stGestionarObservacionRector.baseParams.idmes = cbMesRector.getValue();
                stGestionarObservacionRector.baseParams.start = offsetGestionarObservacionRector;
                stGestionarObservacionRector.baseParams.tipo = cbComportamientoControl.getValue();
            },
            load: function () {
                cambiarTituloFiltrar(gpGestionarObservacionRector, filtrosGestionarObservacionRector, perfil.etiquetas.lbTtleGestionarObservacion);
                if (stGestionarObservacionRector.getCount() == 0) {
                    if (filtrosGestionarObservacionRector.getFiltrosActivos() == undefined || filtrosGestionarObservacionRector.getFiltrosActivos().length == 0)
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatos);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosFiltro);

                }
                smGestionarObservacionRector.clearSelections();
                gpGestionarObservacionRector.enable();
                controlarObjetosObservacionRector();
                mymask.hide();
            }
        }
    });
    filtrosGestionarObservacionRector = new Ext.grid.GridFilters({
        filters: [{
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'listado',
                dataIndex: 'idusuario',
                idcombo: 'cbidusuarioObservacion',
                valueFieldcb: 'idusuario',
                displayFieldcb: 'nombreusuario',
                st: stUsuarios,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'identidad',
                idcombo: 'idcbentidad',
                valueFieldcb: 'idestructura',
                displayFieldcb: 'denominacion',
                st: stEntidadesEjecutor,
                autoload: true,
                mode: 'local'
            }, {
                type: 'string',
                dataIndex: 'observacion'
            }]
    });
    cmGestionarObservacionRector = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbTaller,
            tooltip: perfil.etiquetas.lbTaller,
            width: 120,
            dataIndex: 'identidad',
            renderer: renderEntidadesEjecutor
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            width: 80,
            dataIndex: 'fecha',
            renderer: renderFecha
        }, {
            header: perfil.etiquetas.lbUsuario,
            tooltip: perfil.etiquetas.lbUsuario,
            width: 80,
            dataIndex: 'idusuario',
            renderer: renderUsuarios
        }, {
            header: perfil.etiquetas.lbObservacion,
            tooltip: perfil.etiquetas.lbObservacion,
            width: 290,
            dataIndex: 'observacion',
            renderer: crearToolTip
        }
    ]);

    smGestionarObservacionRector = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function () {
              
                controlarObjetosObservacionRector();
            },
            rowdeselect: function () {
                controlarObjetosObservacionRector();
            }
        }
    });
    btnLimpiarGestionarObservacionRector = new Ext.Button({
        id: 'btnLimpiarGestionarObservacionRector',
        disabled: false,
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosGestionarObservacionRector.clearFilters();
        }
    });
    gpGestionarObservacionRector = new Ext.grid.GridPanel({
        plugins: filtrosGestionarObservacionRector,
        store: stGestionarObservacionRector,
        cm: cmGestionarObservacionRector,
        sm: smGestionarObservacionRector,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGestionarObservacionRector,
            displayInfo: true,
            items: ['-', btnLimpiarGestionarObservacionRector],
            listeners: {
                beforechange: function (p, e) {
                    offsetGestionarObservacionRector = e.start;
                }
            }
        }),
        region: 'center',
        width: 325,
        title: perfil.etiquetas.lbTtleGestionarObservacion,
        id: 'gpGestionarObservacionRector',
        tbar: [cbMesRector]
    });
    textAreaObservacionRector = new Ext.form.TextArea({
        id: 'textAreaObservacionRector',
        frame: true,
        height: 150,
        anchor: '100%',
        maxLength: 255,
        readOnly: true,
        //allowBlank: false,
        fieldLabel: perfil.etiquetas.lbObservacion/*,
         enableKeyEvents: true*/
    });
    fpGestionarObservacionRector = new Ext.form.FormPanel({
        region: 'east',
        disabled: true,
        title: 'Ver/Editar Observacion',
        frame: true,
        labelWidth: 80,
        width: 325,
        items: [
            textAreaObservacionRector
        ]
    });
    pGestionarObservacionRector = new Ext.Panel({
        width: 650,
        height: 300,
        layout: 'border',
        items: [
            gpGestionarObservacionRector,
            fpGestionarObservacionRector
        ]
    });
    wingestionarObservacionRector = new Ext.Window({
        id: 'wingestionarObservacionRector',
        modal: true,
        closeAction: 'destroy',
        width: 930,
        height: 350,
        layout: 'fit',
        resizable: false,
        items: [pGestionarObservacionRector],
        title: perfil.etiquetas.lbGestionarObservacion,
        listeners: {
            destroy: function () {
                stControlRector.reload();
            }
        }

    });
    wingestionarObservacionRector.show();
    // stGestionarObservacion.reload();
    function guardarObservacionRector() {
        mymask.show();
        selec1Rector = smControlRector.getSelected();
        txtObservacionRector = textAreaObservacionRector.getValue();
        Ext.Ajax.request({
            url: 'guardarObservacionControl',
            params: {
                iddemandatiempo: selec1Rector.data.iddemandatiempo,
                identidad: nodoEntidadControl.id,
                idmes: cbMesRector.getValue(),
                observacion: txtObservacionRector

            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {
                    mostrarMensaje(1, perfil.etiquetas.lbObservacionAddOK);
                } else {
                    mostrarMensaje(1, perfil.etiquetas.lbObservacionAddNO);
                }
                stGestionarObservacionRector.reload();
            }
        });
    }
    function controlarObjetosObservacionRector() {

        //btnGuardarObservacion.disable();
        selecObservRector = smGestionarObservacionRector.getSelected();
        textAreaObservacionRector.disable();
        fpGestionarObservacionRector.disable();

        if (selecObservRector != undefined) {
            if (idusariologueado == selecObservRector.data.idusuario)
            {
                textAreaObservacionRector.enable();
                fpGestionarObservacionRector.enable();
            }
            textAreaObservacionRector.reset();
            textAreaObservacionRector.setValue(selecObservRector.data.observacion);
            fpGestionarObservacionRector.enable();
        } else {
            textAreaObservacionRector.reset();           
        }


    }

   
    function renderBinario(val, m) {
        if (val === 1) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
            m.css = 'icondistra-true verde'
        } else if (val === 0) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
            m.css = 'icondistra-false rojo'
        }
    }
}