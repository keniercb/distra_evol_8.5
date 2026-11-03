var programasResumenProgramas, destinosResumenProgramas, storesCargadosProgramas = 2;
function cargarResumenProgramas() {
    btnGraficarProgramas = new Ext.Button({
        disabled: true,
        id: 'btnGraficarProgramas',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbGraficar,
        tooltip: perfil.etiquetas.lbObtenerGrafica,
        handler: function () {
            mymask.show();
            resumenProgramas(cbEjercicio.getValue());
        }
    });
    stProgramasResumenProgramas = new Ext.data.Store({
        url: 'listarProgramas',
        listeners: {
            load: function (t, n, e) {
                stDestinosResumenProgramas.reload();
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
    cbProgramasResumenProgramas = new Ext.ux.form.LovCombo({
        id: 'cbProgramasResumenProgramas',
        store: stProgramasResumenProgramas,
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
//                resumenProgramas(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                resumenProgramas(cbEjercicio.getValue());
//            }
//        }
    });
    cbProgramasResumenProgramas.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbProgramasResumenProgramas.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stDestinosResumenProgramas = new Ext.data.Store({
        url: 'listarDestinos',
        listeners: {
            load: function (t, n, e) {
//                pintar(cbEjercicio.getValue());
                mymask.hide();
                btnGraficarProgramas.enable();
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
    cbDestinosResumenProgramas = new Ext.ux.form.LovCombo({
        id: 'cbDestinosResumenProgramas',
        store: stDestinosResumenProgramas,
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
//                resumenProgramas(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                resumenProgramas(cbEjercicio.getValue());
//            }
//        }
    });
    cbDestinosResumenProgramas.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbDestinosResumenProgramas.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    fpResumenProgramas = new Ext.FormPanel({
        id: 'fpResumenProgramas',
        autoHeight: true,
        frame: true,
        items: [{
                xtype: 'fieldset',
                height: 50,
                items: [{
                        layout: 'column',
                        items: [{
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [cbProgramasResumenProgramas]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [cbDestinosResumenProgramas]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [btnGraficarProgramas]
                            }
                        ]
                    }
                ]
            }

        ]
    });
    pResumenProgramas1 = new Ext.Panel({
        id: 'pResumenProgramas1',
        layout: 'fit',
        region: 'west',
        width: '50%',
        height: '70%',
        bodyBorder: false,
        html: '<div id="idpResumenProgramas1" margin: 0 auto"></div>'
    });
    pResumenProgramas2 = new Ext.Panel({
        id: 'pResumenProgramas2',
        layout: 'fit',
        region: 'center',
        width: '50%',
        height: '70%',
        bodyBorder: false,
        html: '<div id="idpResumenProgramas2" margin: 0 auto"></div>'
    });
    pGeneralProgramas = new Ext.Panel({
        id: 'pGeneralProgramas',
        height: 400,
        layout: 'border',
        disabled: false,
        items: [pResumenProgramas1, pResumenProgramas2]

    });
}
function resumenProgramas(varidejercicio) {
    //trabajo con los programas
    programasSelectIdResumenProgramas = cbProgramasResumenProgramas.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbProgramasResumenProgramas.getCheckedValue().split(',')[0] != '') {
        programasResumenProgramas = programasSelectIdResumenProgramas[0];
        for (var i = 1; i < programasSelectIdResumenProgramas.length; i++) {
            programasResumenProgramas = programasResumenProgramas + ',' + programasSelectIdResumenProgramas[i];
        }
    }

    //trabajo con los destinos
    destinosSelectIdResumenProgramas = cbDestinosResumenProgramas.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbDestinosResumenProgramas.getCheckedValue().split(',')[0] != '') {
        destinosResumenProgramas = destinosSelectIdResumenProgramas[0];
        for (var i = 1; i < destinosSelectIdResumenProgramas.length; i++) {
            destinosResumenProgramas = destinosResumenProgramas + ',' + destinosSelectIdResumenProgramas[i];
        }
    }
    //llamada al metodo de graficar para traer los datos en el formato deseado
    Ext.Ajax.request({
        url: '/planificacion/planproeza/index.php/modelosestadisticos/graficarProgramasODestinos',
        method: 'POST',
        params: {
            //implementar lo del orden en la vista cuando lo analista decida donde va
            //lo mismo con el paginado
            //por ahora se ordena ascendentemente
            orden: 1,
            idejercicio: varidejercicio,
            clasificacion: 'idprograma',
            programas: programasResumenProgramas,
            destinos: destinosResumenProgramas

        },
        callback: function (options, success, response) {
            resp = Ext.decode(response.responseText);
            $('#idpResumenProgramas1').highcharts(
                    {
                        chart: {
                            height: 375, //pGenInterEmiEconomia.getInnerHeight(),                           
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Porciento que representa cada uno de los programas del total de producciones'
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
                                text: 'Porciento'
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
            $('#idpResumenProgramas2').highcharts(
                    {
                        chart: {
                            height: 375, //pGenInterEmiEconomia.getInnerHeight(),                           
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Importe por cada uno de los programas'
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
                        series: resp.dataImp
                    }
            );
            mymask.hide();

        }
    });
}
