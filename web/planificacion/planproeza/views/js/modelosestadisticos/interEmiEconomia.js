var columnasinterEmiEcon, programasInterEmiEcon, destinosInterEmiEcon, storesCargadosInterEmiEcon = 2;
function cargarInterEmiEconomia() {
    btnGraficarInterEmiEconomia = new Ext.Button({
        disabled: true,
        id: 'btnGraficarInterEmiEconomia',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbGraficar,
        tooltip: perfil.etiquetas.lbObtenerGrafica,
        handler: function () {
            mymask.show();
            interEmiEconomia(cbEjercicio.getValue());
            // mascaraExportar(perfil.etiquetas.lbExportandoDatos, perfil.etiquetas.lbEsperePorFavor, win);
        }
    });
    stPeriodoInterEmiEcon = new Ext.data.Store({
        url: 'listarPeriodos',
        listeners: {
            load: function (t, n, e) {
                stEntidadesClientesInterEmiEcon.reload();
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
    cbPeriodoInterEmiEcon = new Ext.form.ComboBox({
        id: 'cbPeriodoInterEmiEcon',
        store: stPeriodoInterEmiEcon,
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
                cbColumnasInterEmiEcon.clearValue();
                if (cbPeriodoInterEmiEcon.getValue() != undefined && cbPeriodoInterEmiEcon.getValue() != null && cbPeriodoInterEmiEcon.getValue() != '') {
                    stColumnasInterEmiEcon.reload();
                    cbColumnasInterEmiEcon.enable();
                } else {
                    cbColumnasInterEmiEcon.disable();
                }
            }
        }
    });
    stColumnasInterEmiEcon = new Ext.data.Store({
        url: 'listarColumnasPorPeriodo',
        listeners: {
            beforeload: function () {
                mymask.show();
                stColumnasInterEmiEcon.baseParams.uridatosnomenclador = cbPeriodoInterEmiEcon.getValue();
            }, load: function () {
                mymask.hide();
//                interEmiEconomia(cbEjercicio.getValue());
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
    cbColumnasInterEmiEcon = new Ext.ux.form.LovCombo({
        id: 'cbColumnasInterEmiEcon',
        store: stColumnasInterEmiEcon,
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
////            change: function (cb, new_value, old_value) {
////                controlarObjetosReporteA();
////            },
//            select: function (cb, rec, index) {
//                interEmiEconomia(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                interEmiEconomia(cbEjercicio.getValue());
//            }
//
//        }
    });
    stEntidadesClientesInterEmiEcon = new Ext.data.Store({
        url: 'listarEntidadesClientes',
        listeners: {
            load: function (t, n, e) {
                stProgramasInterEmiEcon.reload();
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
    cbEntidadesClientesInterEmiEcon = new Ext.ux.form.LovCombo({
        id: 'cbEntidadesClientesInterEmiEcon',
        store: stEntidadesClientesInterEmiEcon,
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
//                interEmiEconomia(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                interEmiEconomia(cbEjercicio.getValue());
//            }
//        }
    });
    cbEntidadesClientesInterEmiEcon.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbEntidadesClientesInterEmiEcon.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    stProgramasInterEmiEcon = new Ext.data.Store({
        url: 'listarProgramas',
        listeners: {
            load: function (t, n, e) {
                stDestinosInterEmiEcon.reload();
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
    cbProgramasInterEmiEcon = new Ext.ux.form.LovCombo({
        id: 'cbProgramasInterEmiEcon',
        store: stProgramasInterEmiEcon,
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
//                interEmiEconomia(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                interEmiEconomia(cbEjercicio.getValue());
//            }
//        }
    });
    cbProgramasInterEmiEcon.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbProgramasInterEmiEcon.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stDestinosInterEmiEcon = new Ext.data.Store({
        url: 'listarDestinos',
        listeners: {
            load: function (t, n, e) {
                mymask.hide();    
                 btnGraficarInterEmiEconomia.enable();
               // pintar(cbEjercicio.getValue());
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
    cbDestinosInterEmiEcon = new Ext.ux.form.LovCombo({
        id: 'cbDestinosInterEmiEcon',
        store: stDestinosInterEmiEcon,
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
//                interEmiEconomia(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                interEmiEconomia(cbEjercicio.getValue());
//            }
//        }
    });
    cbDestinosInterEmiEcon.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbDestinosInterEmiEcon.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    fpInterEmiEconomia = new Ext.FormPanel({
        id: 'fpInterEmiEconomia',
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
                                items: [cbPeriodoInterEmiEcon]
                            }, {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbColumnasInterEmiEcon]
                            }
                            , {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbEntidadesClientesInterEmiEcon]
                            }
                            , {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [btnGraficarInterEmiEconomia]
                            }
                        ]
                    }, {
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbProgramasInterEmiEcon]
                            }, {
                                columnWidth: 0.25,
                                layout: 'form',
                                items: [cbDestinosInterEmiEcon]
                            }
                        ]
                    }
                ]
            }

        ]
    });
    pGenInterEmiEconomia = new Ext.Panel({
        id: 'pGenInterEmiEconomia',
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        height: '60%',
        html: '<div id="idpGenInterEmiEconomia" margin: 0 auto"></div>'

    });
}
function interEmiEconomia(varidejercicio) {

    //trabajo con las columnas
    //si se selecciono algun periodo
    if (cbPeriodoInterEmiEcon.getValue() != '') {
        columnasinterEmiEcon = [];
        //si se selecciono alguna columna
        if (cbColumnasInterEmiEcon.getCheckedValue().split(',')[0] != '') {
            columnasSelectId = cbColumnasInterEmiEcon.getCheckedValue().split(',');
            for (var i = 0; i < columnasSelectId.length; i++) {
                columnasinterEmiEcon.push({
                    uridatosnomenclador: columnasSelectId[i]
                });
            }
        } else {
            //si se selecciono algun periodo y no se selecciono ninguna columna
            for (i in stColumnasInterEmiEcon.data.items) {
                if (stColumnasInterEmiEcon.data.items[i].data) {
                    columnasinterEmiEcon.push({
                        uridatosnomenclador: stColumnasInterEmiEcon.data.items[i].data.uridatosnomenclador
                    });
                }
            }
        }
    }

    //trabajo con los clientes
    entidadesSelectIdClientesInterEmiEcon = cbEntidadesClientesInterEmiEcon.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    if (cbEntidadesClientesInterEmiEcon.getCheckedValue().split(',')[0] != '') {
        entidadesClientesInterEmiEcon = entidadesSelectIdClientesInterEmiEcon[0];
        for (var i = 1; i < entidadesSelectIdClientesInterEmiEcon.length; i++) {
            entidadesClientesInterEmiEcon = entidadesClientesInterEmiEcon + ',' + entidadesSelectIdClientesInterEmiEcon[i];
        }
    } else {
        //si no se selecciona nada se manda el param con todos los elementos del store
        entidadesClientesInterEmiEcon = "";
        for (i in stEntidadesClientesInterEmiEcon.data.items) {
            if (stEntidadesClientesInterEmiEcon.data.items[i].data) {
                if (i == 0)
                    entidadesClientesInterEmiEcon = stEntidadesClientesInterEmiEcon.data.items[i].data.identidad;
                else
                    entidadesClientesInterEmiEcon = entidadesClientesInterEmiEcon + ',' + stEntidadesClientesInterEmiEcon.data.items[i].data.identidad;
            }
        }
    }

    //trabajo con los programas
    programasSelectIdInterEmiEcon = cbProgramasInterEmiEcon.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbProgramasInterEmiEcon.getCheckedValue().split(',')[0] != '') {
        programasInterEmiEcon = programasSelectIdInterEmiEcon[0];
        for (var i = 1; i < programasSelectIdInterEmiEcon.length; i++) {
            programasInterEmiEcon = programasInterEmiEcon + ',' + programasSelectIdInterEmiEcon[i];
        }
    } else {
        programasInterEmiEcon = null;
    }

    //trabajo con los destinos
    destinosSelectIdInterEmiEcon = cbDestinosInterEmiEcon.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbDestinosInterEmiEcon.getCheckedValue().split(',')[0] != '') {
        destinosInterEmiEcon = destinosSelectIdInterEmiEcon[0];
        for (var i = 1; i < destinosSelectIdInterEmiEcon.length; i++) {
            destinosInterEmiEcon = destinosInterEmiEcon + ',' + destinosSelectIdInterEmiEcon[i];
        }
    } else {
        destinosInterEmiEcon = null;
    }
    //llamada al metodo de graficar para traer los datos en el formato deseado
    Ext.Ajax.request({
        url: '/planificacion/planproeza/index.php/modelosestadisticos/graficarInterEmiyEconomia',
        method: 'POST',
        params: {
            //implementar lo del orden en la vista cuando lo analista decida donde va
            //lo mismo con el paginado
            //por ahora se ordena ascendentemente
            orden: 1,
            idejercicio: varidejercicio,
            uriperiodo: cbPeriodoInterEmiEcon.getValue(),
            columnas: Ext.encode(columnasinterEmiEcon),
            clientes: entidadesClientesInterEmiEcon,
            programas: programasInterEmiEcon,
            destinos: destinosInterEmiEcon

        },
        callback: function (options, success, response) {

            resp = Ext.decode(response.responseText);
            $('#idpGenInterEmiEconomia').highcharts(
                    {
                        chart: {
                            height: 350, //pGenInterEmiEconomia.getInnerHeight(),                           
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        }, subtitle: {
                            //text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                            text: 'Clientes priorizados'
                        },
                        title: {
                            text: 'Inter-Emi y economía'
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
                        series: resp.data
                    }
            );
            mymask.hide();
        }
    });
}
