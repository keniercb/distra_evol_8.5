var programasResumenDestinos, destinosResumenDestinos, storesCargadosDestinos = 2;
function cargarresumenDestinos() {
    btnGraficarDestinos = new Ext.Button({
        disabled: true,
        id: 'btnGraficarDestinos',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbGraficar,
        tooltip: perfil.etiquetas.lbObtenerGrafica,
        handler: function () {
            mymask.show();
            resumenDestinos(cbEjercicio.getValue());
        }
    });
    stProgramasResumenDestinos = new Ext.data.Store({
        url: 'listarProgramas',
        listeners: {
            load: function (t, n, e) {
                stDestinosResumenDestinos.reload();
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
    cbProgramasResumenDestinos = new Ext.ux.form.LovCombo({
        id: 'cbProgramasResumenDestinos',
        store: stProgramasResumenDestinos,
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
//                resumenDestinos(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                resumenDestinos(cbEjercicio.getValue());
//            }
//        }
    });
    cbProgramasResumenDestinos.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbProgramasResumenDestinos.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stDestinosResumenDestinos = new Ext.data.Store({
        url: 'listarDestinos',
        listeners: {
            load: function (t, n, e) {
//                pintar(cbEjercicio.getValue());
                mymask.hide();
                btnGraficarDestinos.enable();
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
    cbDestinosResumenDestinos = new Ext.ux.form.LovCombo({
        id: 'cbDestinosResumenDestinos',
        store: stDestinosResumenDestinos,
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
//                resumenDestinos(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                resumenDestinos(cbEjercicio.getValue());
//            }
//        }
    });
    cbDestinosResumenDestinos.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbDestinosResumenDestinos.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    fpResumenDestinos = new Ext.FormPanel({
        id: 'fpResumenDestinos',
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
                                items: [cbProgramasResumenDestinos]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [cbDestinosResumenDestinos]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [btnGraficarDestinos]
                            }
                        ]
                    }
                ]
            }

        ]
    });
    pResumenDestinos1 = new Ext.Panel({
        id: 'pResumenDestinos1',
        layout: 'fit',
        region: 'west',
        width: '50%',
        height: '70%',
        bodyBorder: false,
        html: '<div id="idpResumenDestinos1" margin: 0 auto"></div>'
    });
    pResumenDestinos2 = new Ext.Panel({
        id: 'pResumenDestinos2',
        layout: 'fit',
        region: 'center',
        width: '50%',
        height: '70%',
        bodyBorder: false,
        html: '<div id="idpResumenDestinos2" margin: 0 auto"></div>'
    });
    pGeneralDestinos = new Ext.Panel({
        id: 'pGeneralDestinos',
        height: 400,
        layout: 'border',
        disabled: false,
        items: [pResumenDestinos1, pResumenDestinos2]

    });
}
function resumenDestinos(varidejercicio) {
    //trabajo con los programas
    programasSelectIdResumenProgramas = cbProgramasResumenDestinos.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbProgramasResumenDestinos.getCheckedValue().split(',')[0] != '') {

        programasResumenDestinos = programasSelectIdResumenProgramas[0];
        for (var i = 1; i < programasSelectIdResumenProgramas.length; i++) {
            programasResumenDestinos = programasResumenDestinos + ',' + programasSelectIdResumenProgramas[i];
        }
    } else {
        programasResumenDestinos = null;
    }

    //trabajo con los destinos
    destinosSelectIdResumenDestinos = cbDestinosResumenDestinos.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbDestinosResumenDestinos.getCheckedValue().split(',')[0] != '') {
        destinosResumenDestinos = destinosSelectIdResumenDestinos[0];
        for (var i = 1; i < destinosSelectIdResumenDestinos.length; i++) {
            destinosResumenDestinos = destinosResumenDestinos + ',' + destinosSelectIdResumenDestinos[i];
        }
    } else {
        destinosResumenDestinos = null;
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
            clasificacion: 'iddestino',
            programas: programasResumenDestinos,
            destinos: destinosResumenDestinos

        },
        callback: function (options, success, response) {
            resp = Ext.decode(response.responseText);
            $('#idpResumenDestinos1').highcharts(
                    {
                        chart: {
                            height: 375,                           
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Porciento que representa cada uno de los destinos del total de producciones'
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
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    }
            );
            $('#idpResumenDestinos2').highcharts(
                    {
                        chart: {
                            height: 375,                            
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Importe por cada uno de los destinos'
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
