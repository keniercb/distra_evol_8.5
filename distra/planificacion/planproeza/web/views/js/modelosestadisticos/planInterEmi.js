var columnasinterEmiEcon, programasPlanInterEmi, destinosPlanInterEmi, storesCargadosPlanInterEmi = 2;
function cargarplanInterEmi() {
    btnGraficarInterEmi = new Ext.Button({
        disabled: true,
        id: 'btnGraficarInterEmi',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbGraficar,
        tooltip: perfil.etiquetas.lbObtenerGrafica,
        handler: function () {
             mymask.show();
             planInterEmi(cbEjercicio.getValue());
        
            // mascaraExportar(perfil.etiquetas.lbExportandoDatos, perfil.etiquetas.lbEsperePorFavor, win);
        }
    });
    stEntidadesUIMplanInterEmi = new Ext.data.Store({
        url: 'listarEntidadesUIM',
        listeners: {
            load: function (t, n, e) {
                stProgramasplanInterEmi.reload();
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
    cbEntidadesUIMplanInterEmi = new Ext.ux.form.LovCombo({
        id: 'cbEntidadesUIMplanInterEmi',
        store: stEntidadesUIMplanInterEmi,
        fieldLabel: perfil.etiquetas.lbEntidadesUIM,
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
//                planInterEmi(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planInterEmi(cbEjercicio.getValue());
//            }
//        }
    });
    cbEntidadesUIMplanInterEmi.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbEntidadesUIMplanInterEmi.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';


    stProgramasplanInterEmi = new Ext.data.Store({
        url: 'listarProgramas',
        listeners: {
            load: function (t, n, e) {
                stDestinosplanInterEmi.reload();
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
    cbProgramasplanInterEmi = new Ext.ux.form.LovCombo({
        id: 'cbProgramasplanInterEmi',
        store: stProgramasplanInterEmi,
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
//                planInterEmi(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planInterEmi(cbEjercicio.getValue());
//            }
//        }
    });
    cbProgramasplanInterEmi.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbProgramasplanInterEmi.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stDestinosplanInterEmi = new Ext.data.Store({
        url: 'listarDestinos',
        listeners: {
            load: function (t, n, e) {
                 mymask.hide();    
                 btnGraficarInterEmi.enable();
                //pintar(cbEjercicio.getValue());
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
    cbDestinosplanInterEmi = new Ext.ux.form.LovCombo({
        id: 'cbDestinosplanInterEmi',
        store: stDestinosplanInterEmi,
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
//                planInterEmi(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planInterEmi(cbEjercicio.getValue());
//            }
//        }
    });
    cbDestinosplanInterEmi.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbDestinosplanInterEmi.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    fpPlanInterEmi = new Ext.FormPanel({
        id: 'fpplanInterEmi',
        autoHeight: true,
        frame: true,
        items: [{
                xtype: 'fieldset',
                height: 50,
                items: [{
                        layout: 'column',
                        items: [{
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbEntidadesUIMplanInterEmi]
                            }, {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbProgramasplanInterEmi]
                            }
                            , {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbDestinosplanInterEmi]
                            }
                            , {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [btnGraficarInterEmi]
                            }
                        ]
                    }
                ]
            }

        ]
    });
    pGenplanInterEmi1 = new Ext.Panel({
        id: 'pGenplanInterEmi1',
        layout: 'fit',
        region: 'west',
        width: '50%',
        height: '70%',
        bodyBorder: false,
        html: '<div id="idpGenplanInterEmi1" margin: 0 auto"></div>'
    });
    pGenplanInterEmi2 = new Ext.Panel({
        id: 'pGenplanInterEmi2',
        layout: 'fit',
        region: 'center',
        width: '50%',
        height: '70%',
        bodyBorder: false,
        html: '<div id="idpGenplanInterEmi2" margin: 0 auto"></div>'
    });
    pGeneral = new Ext.Panel({
        id: 'pGeneral',
        height: 400,
        layout: 'border',
        disabled: false,
        items: [pGenplanInterEmi1, pGenplanInterEmi2]
    });
}
function planInterEmi(varidejercicio) {
    //trabajo con los proveedores
    entidadesSelectIdProveedorPlanInterEmi = cbEntidadesUIMplanInterEmi.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    if (cbEntidadesUIMplanInterEmi.getCheckedValue().split(',')[0] != '') {
        entidadesProveedorPlanInterEmi = entidadesSelectIdProveedorPlanInterEmi[0];
        for (var i = 1; i < entidadesSelectIdProveedorPlanInterEmi.length; i++) {
            entidadesProveedorPlanInterEmi = entidadesProveedorPlanInterEmi + ',' + entidadesSelectIdProveedorPlanInterEmi[i];
        }
    } else {
        //si no se selecciona nada se manda el param con todos los elementos del store
        entidadesProveedorPlanInterEmi = "";
        for (i in stEntidadesUIMplanInterEmi.data.items) {
            if (stEntidadesUIMplanInterEmi.data.items[i].data) {
                if (i == 0)
                    entidadesProveedorPlanInterEmi = stEntidadesUIMplanInterEmi.data.items[i].data.identidad;
                else
                    entidadesProveedorPlanInterEmi = entidadesProveedorPlanInterEmi + ',' + stEntidadesUIMplanInterEmi.data.items[i].data.identidad;
            }
        }
    }
    //trabajo con los programas
    programasSelectIdPlanInterEmi = cbProgramasplanInterEmi.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbProgramasplanInterEmi.getCheckedValue().split(',')[0] != '') {
        programasPlanInterEmi = programasSelectIdPlanInterEmi[0];
        for (var i = 1; i < programasSelectIdPlanInterEmi.length; i++) {
            programasPlanInterEmi = programasPlanInterEmi + ',' + programasSelectIdPlanInterEmi[i];
        }
    } else {
        programasPlanInterEmi = null;
    }

    //trabajo con los destinos
    destinosSelectIdPlanInterEmi = cbDestinosplanInterEmi.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbDestinosplanInterEmi.getCheckedValue().split(',')[0] != '') {
        destinosPlanInterEmi = destinosSelectIdPlanInterEmi[0];
        for (var i = 1; i < destinosSelectIdPlanInterEmi.length; i++) {
            destinosPlanInterEmi = destinosPlanInterEmi + ',' + destinosSelectIdPlanInterEmi[i];
        }
    } else {
        destinosPlanInterEmi = null;
    }
    //llamada al metodo de graficar para traer los datos en el formato deseado
    Ext.Ajax.request({
        url: '/planificacion/planproeza/index.php/modelosestadisticos/graficarPlanInterEmi',
        method: 'POST',
        params: {
            //implementar lo del orden en la vista cuando lo analista decida donde va
            //lo mismo con el paginado
            //por ahora se ordena ascendentemente
            orden: 1,
            idejercicio: varidejercicio,
            proveedores: entidadesProveedorPlanInterEmi,
            programas: programasPlanInterEmi,
            destinos: destinosPlanInterEmi

        },
        callback: function (options, success, response) {
            resp = Ext.decode(response.responseText);
            $('#idpGenplanInterEmi1').highcharts(
                    {
                        chart: {
                            height: 375, //pGenInterEmiEconomia.getInnerHeight(),                           
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Empresas con mayor cantidad de productos demandados'
                        }, plotOptions: {
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
                                text: 'Cantidad'
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
            $('#idpGenplanInterEmi2').highcharts(
                    {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            height: 375,
                            type: 'pie'
                        }, title: {
                            text: 'Empresas que mayor porcentaje (en cuanto al importe) de producciones debe realizar'
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
                                name: 'Plan',
                                colorByPoint: true,
                                data: resp.dataV
                            }]
                    }
            );
            mymask.hide();
        }
    });
}
