var columnasPlanEconomia, programasPlanEconomia, destinosPlanEconomia, storesCargadosPlanEconomia = 2;
function cargarplanEconomia() {
    btnGraficarPlanEconomia = new Ext.Button({
        disabled: true,
        id: 'btnGraficarPlanEconomia',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbGraficar,
        tooltip: perfil.etiquetas.lbObtenerGrafica,
        handler: function () {
            mymask.show();
            planEconomia(cbEjercicio.getValue());
            // mascaraExportar(perfil.etiquetas.lbExportandoDatos, perfil.etiquetas.lbEsperePorFavor, win);
        }
    });
    stPeriodoPlanEconomia = new Ext.data.Store({
        url: 'listarPeriodos',
        listeners: {
            load: function (t, n, e) {
                stEntidadesClientesPlanEconomia.reload();
            }

        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idtiponomenclador'
            }])
    });
    cbPeriodoPlanEconomia = new Ext.form.ComboBox({
        id: 'cbPeriodoPlanEconomia',
        store: stPeriodoPlanEconomia,
        fieldLabel: perfil.etiquetas.lbPeriodos,
        valueField: 'uridatosnomenclador',
        hiddenName: 'uridatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        typeAhead: true,
        editable: false,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        autoWidth: true,
        listeners: {
            select: function (cb, rec, index) {
                cbColumnasPlanEconomia.clearValue();
                if (cbPeriodoPlanEconomia.getValue() != undefined && cbPeriodoPlanEconomia.getValue() != null && cbPeriodoPlanEconomia.getValue() != '') {
                    stColumnasPlanEconomia.reload();
                    cbColumnasPlanEconomia.enable();
                } else {
                    cbColumnasPlanEconomia.disable();
                }
            }
        }
    });

    stColumnasPlanEconomia = new Ext.data.Store({
        url: 'listarColumnasPorPeriodo',
        listeners: {
            beforeload: function () {
                mymask.show();
                stColumnasPlanEconomia.baseParams.uridatosnomenclador = cbPeriodoPlanEconomia.getValue();
            }, load: function () {
                mymask.hide();
//                planEconomia(cbEjercicio.getValue());
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idtiponomenclador'
            }])
    });
    cbColumnasPlanEconomia = new Ext.ux.form.LovCombo({
        id: 'cbColumnasPlanEconomia',
        store: stColumnasPlanEconomia,
        fieldLabel: perfil.etiquetas.lbColumnas,
        valueField: 'uridatosnomenclador',
        hiddenName: 'uridatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: true,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        autoWidth: true
//        ,
//        listeners: {
//            select: function (cb, rec, index) {
//                planEconomia(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planEconomia(cbEjercicio.getValue());
//            }
//
//        }
    });

    stEntidadesClientesPlanEconomia = new Ext.data.Store({
        url: 'listarEntidadesClientes',
        listeners: {
            load: function (t, n, e) {
                stProgramasPlanEconomia.reload();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identidad'
        }, [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });
    cbEntidadesClientesPlanEconomia = new Ext.ux.form.LovCombo({
        id: 'cbEntidadesClientesPlanEconomia',
        store: stEntidadesClientesPlanEconomia,
        fieldLabel: perfil.etiquetas.lbClientes,
        valueField: 'identidad',
        hiddenName: 'identidad',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: false,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        checkField: 'checked',
        autoWidth: true,
        listWidth: '25%'
//        ,
//        listeners: {
//            select: function (cb, rec, index) {
//                planEconomia(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planEconomia(cbEjercicio.getValue());
//            }
//        }
    });
    cbEntidadesClientesPlanEconomia.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbEntidadesClientesPlanEconomia.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stProgramasPlanEconomia = new Ext.data.Store({
        url: 'listarProgramas',
        listeners: {
            load: function (t, n, e) {
                stDestinosPlanEconomia.reload();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idtiponomenclador'
            }])
    });
    cbProgramasPlanEconomia = new Ext.ux.form.LovCombo({
        id: 'cbProgramasPlanEconomia',
        store: stProgramasPlanEconomia,
        fieldLabel: perfil.etiquetas.lbProgramas,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: false,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        checkField: 'checked',
        autoWidth: true,
        listWidth: '25%'
//        ,
//        listeners: {
//            select: function (cb, rec, index) {
//                planEconomia(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planEconomia(cbEjercicio.getValue());
//            }
//        }
    });
    cbProgramasPlanEconomia.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbProgramasPlanEconomia.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stDestinosPlanEconomia = new Ext.data.Store({
        url: 'listarDestinos',
        listeners: {
            load: function (t, n, e) {
                mymask.hide();
                btnGraficarPlanEconomia.enable();
//                pintar(cbEjercicio.getValue());
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'iddatosnomenclador'
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }, {
                name: 'idtiponomenclador'
            }])
    });
    cbDestinosPlanEconomia = new Ext.ux.form.LovCombo({
        id: 'cbDestinosPlanEconomia',
        store: stDestinosPlanEconomia,
        fieldLabel: perfil.etiquetas.lbDestinos,
        valueField: 'iddatosnomenclador',
        hiddenName: 'iddatosnomenclador',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        disabled: false,
        emptyText: perfil.etiquetas.lbEmptyTextSeleccionar,
        loadingText: perfil.etiquetas.lbCargando,
        checkField: 'checked',
        autoWidth: true,
        listWidth: '25%'
//        ,
//        listeners: {
//            select: function (cb, rec, index) {
//                planEconomia(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planEconomia(cbEjercicio.getValue());
//            }
//        }
    });
    cbDestinosPlanEconomia.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbDestinosPlanEconomia.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    fpPlanEconomia = new Ext.FormPanel({
        id: 'fpPlanEconomia',
        autoHeight: true,
        frame: true,
        items: [{
                xtype: 'fieldset',
                height: 70,
                items: [{
                        layout: 'column',
                        items: [{
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbPeriodoPlanEconomia]
                            }, {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbColumnasPlanEconomia]
                            }
                            , {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbEntidadesClientesPlanEconomia]
                            }
                            , {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [btnGraficarPlanEconomia]
                            }
                        ]
                    }, {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbProgramasPlanEconomia]
                            }, {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbDestinosPlanEconomia]
                            }
                        ]
                    }
                ]
            }

        ]
    });

    pGenPlanEconomia1 = new Ext.Panel({
        id: 'pGenPlanEconomia1',
        layout: 'fit',
        region: 'west',
        width: '50%',
        height: '70%',
        bodyBorder: false,
        html: '<div id="idpGenPlanEconomia1" margin: 0 auto"></div>'
    });
    pGenPlanEconomia2 = new Ext.Panel({
        id: 'pGenPlanEconomia2',
        layout: 'fit',
        region: 'center',
        width: '50%',
        height: '70%',
        bodyBorder: false,
        html: '<div id="idpGenPlanEconomia2" margin: 0 auto"></div>'
    });
    pGenPlanEconomia = new Ext.Panel({
        id: 'pGenPlanEconomia',
        height: 350,
        layout: 'border',
        disabled: false,
        items: [pGenPlanEconomia1, pGenPlanEconomia2]

    });
}
function planEconomia(varidejercicio) {
    //trabajo con las columnas
    //si se selecciono algun periodo
    if (cbPeriodoPlanEconomia.getValue() != '') {
        columnasPlanEconomia = [];
        //si se selecciono alguna columna
        if (cbColumnasPlanEconomia.getCheckedValue().split(',')[0] != '') {
            columnasSelectId = cbColumnasPlanEconomia.getCheckedValue().split(',');
            for (var i = 0; i < columnasSelectId.length; i++) {
                columnasPlanEconomia.push({
                    uridatosnomenclador: columnasSelectId[i]
                });
            }
        } else {
            //si se selecciono algun periodo y no se selecciono ninguna columna
            for (i in stColumnasPlanEconomia.data.items) {
                if (stColumnasPlanEconomia.data.items[i].data) {
                    columnasPlanEconomia.push({
                        uridatosnomenclador: stColumnasPlanEconomia.data.items[i].data.uridatosnomenclador
                    });
                }
            }
        }
    }

    //trabajo con los clientes
    entidadesSelectIdClientesPlanEconomia = cbEntidadesClientesPlanEconomia.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    if (cbEntidadesClientesPlanEconomia.getCheckedValue().split(',')[0] != '') {
        entidadesClientesPlanEconomia = entidadesSelectIdClientesPlanEconomia[0];
        for (var i = 1; i < entidadesSelectIdClientesPlanEconomia.length; i++) {
            entidadesClientesPlanEconomia = entidadesClientesPlanEconomia + ',' + entidadesSelectIdClientesPlanEconomia[i];
        }
    } else {
        //si no se selecciona nada se manda el param con todos los elementos del store
        entidadesClientesPlanEconomia = "";
        for (i in stEntidadesClientesPlanEconomia.data.items) {
            if (stEntidadesClientesPlanEconomia.data.items[i].data) {
                if (i == 0)
                    entidadesClientesPlanEconomia = stEntidadesClientesPlanEconomia.data.items[i].data.identidad;
                else
                    entidadesClientesPlanEconomia = entidadesClientesPlanEconomia + ',' + stEntidadesClientesPlanEconomia.data.items[i].data.identidad;
            }
        }
    }

    //trabajo con los programas
    programasSelectIdPlanEconomia = cbProgramasPlanEconomia.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbProgramasPlanEconomia.getCheckedValue().split(',')[0] != '') {
        programasPlanEconomia = programasSelectIdPlanEconomia[0];
        for (var i = 1; i < programasSelectIdPlanEconomia.length; i++) {
            programasPlanEconomia = programasPlanEconomia + ',' + programasSelectIdPlanEconomia[i];
        }
    } else {
        programasPlanEconomia = null;
    }

    //trabajo con los destinos
    destinosSelectIdPlanEconomia = cbDestinosPlanEconomia.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbDestinosPlanEconomia.getCheckedValue().split(',')[0] != '') {
        destinosPlanEconomia = destinosSelectIdPlanEconomia[0];
        for (var i = 1; i < destinosSelectIdPlanEconomia.length; i++) {
            destinosPlanEconomia = destinosPlanEconomia + ',' + destinosSelectIdPlanEconomia[i];
        }
    } else {
        destinosPlanEconomia = null;
    }
    //llamada al metodo de graficar para traer los datos en el formato deseado
    Ext.Ajax.request({
        url: '/planificacion/planproeza/index.php/modelosestadisticos/graficarPlanEconomia',
        method: 'POST',
        params: {
            //implementar lo del orden en la vista cuando lo analista decida donde va
            //lo mismo con el paginado
            //por ahora se ordena ascendentemente
            orden: 1,
            idejercicio: varidejercicio,
            uriperiodo: cbPeriodoPlanEconomia.getValue(),
            columnas: Ext.encode(columnasPlanEconomia),
            clientes: entidadesClientesPlanEconomia,
            programas: programasPlanEconomia,
            destinos: destinosPlanEconomia

        },
        callback: function (options, success, response) {

            resp = Ext.decode(response.responseText);
            $('#idpGenPlanEconomia1').highcharts(
                    {
                        chart: {
                            height: 350,
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        }, title: {
                            //text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                            text: 'Clientes con mayor importe demandado'
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
//                            title: {
//                                text: 'Clientes'
//                            },
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    }
            );
            $('#idpGenPlanEconomia2').highcharts(
                    {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            height: 350,
                            type: 'pie'
                        }, title: {
                            text: 'Clientes que mayor porcentaje (en cuanto al importe) demandan'
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> del total<br/>'
                        },
                        accessibility: {
                            point: {
                                valueSuffix: '%'
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f}%'
                                }
                            }
                        },
                        series: [{
                                name: 'Cliente',
                                colorByPoint: true,
                                data: resp.dataV
                            }]
                    }
            );
            mymask.hide();
        }
    });
}
