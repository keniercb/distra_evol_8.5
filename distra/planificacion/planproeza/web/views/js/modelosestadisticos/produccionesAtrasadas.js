var programasproduccionesAtrasadas, destinosproduccionesAtrasadas, storesCargadosAtrasadas = 2;
function cargarproduccionesAtrasadas() {
  btnGraficarProduccionesAtrasadas = new Ext.Button({
        disabled: true,
        id: 'btnGraficarProduccionesAtrasadas',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbGraficar,
        tooltip: perfil.etiquetas.lbObtenerGrafica,
        handler: function () {
            mymask.show();
            produccionesAtrasadas(cbEjercicio.getValue());
            // mascaraExportar(perfil.etiquetas.lbExportandoDatos, perfil.etiquetas.lbEsperePorFavor, win);
        }
    });
    stProgramasproduccionesAtrasadas = new Ext.data.Store({
        url: 'listarProgramas',
        listeners: {
            load: function (t, n, e) {
                stDestinosproduccionesAtrasadas.reload();
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
    cbProgramasProduccionesAtrasadas = new Ext.ux.form.LovCombo({
        id: 'cbProgramasProduccionesAtrasadas',
        store: stProgramasproduccionesAtrasadas,
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
//                produccionesAtrasadas(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                produccionesAtrasadas(cbEjercicio.getValue());
//            }
//        }
    });
    cbProgramasProduccionesAtrasadas.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbProgramasProduccionesAtrasadas.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';

    stDestinosproduccionesAtrasadas = new Ext.data.Store({
        url: 'listarDestinos',
        listeners: {
            load: function (t, n, e) {
                  mymask.hide();    
                 btnGraficarProduccionesAtrasadas.enable();
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
    cbDestinosProduccionesAtrasadas = new Ext.ux.form.LovCombo({
        id: 'cbDestinosProduccionesAtrasadas',
        store: stDestinosproduccionesAtrasadas,
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
//                produccionesAtrasadas(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                produccionesAtrasadas(cbEjercicio.getValue());
//            }
//        }
    });
    cbDestinosProduccionesAtrasadas.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbDestinosProduccionesAtrasadas.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    fpProduccionesAtrasadas = new Ext.FormPanel({
        id: 'fpProduccionesAtrasadas',
        autoHeight: true,
        frame: true,
        items: [{
                xtype: 'fieldset',
                //title: perfil.etiquetas.lbEspere,
                // 
                height: 65,
                //collapsible: true,
                items: [{
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [cbProgramasProduccionesAtrasadas]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [cbDestinosProduccionesAtrasadas]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [btnGraficarProduccionesAtrasadas]
                            }
                        ]
                    }
                ]
            }

        ]
    });
    pGenProduccionesAtrasadas = new Ext.Panel({
        id: 'pGenProduccionesAtrasadas',
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        height: '60%',
        html: '<div id="idpGenProduccionesAtrasadas" margin: 0 auto"></div>'
    });
}
function produccionesAtrasadas(varidejercicio) {
    //trabajo con los programas
    programasSelectIdproduccionesAtrasadas = cbProgramasProduccionesAtrasadas.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbProgramasProduccionesAtrasadas.getCheckedValue().split(',')[0] != '') {
        programasproduccionesAtrasadas = programasSelectIdproduccionesAtrasadas[0];
        for (var i = 1; i < programasSelectIdproduccionesAtrasadas.length; i++) {
            programasproduccionesAtrasadas = programasproduccionesAtrasadas + ',' + programasSelectIdproduccionesAtrasadas[i];
        }
    } else {
        programasproduccionesAtrasadas = null;
    }

    //trabajo con los destinos
    destinosSelectIdproduccionesAtrasadas = cbDestinosProduccionesAtrasadas.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbDestinosProduccionesAtrasadas.getCheckedValue().split(',')[0] != '') {
        destinosproduccionesAtrasadas = destinosSelectIdproduccionesAtrasadas[0];
        for (var i = 1; i < destinosSelectIdproduccionesAtrasadas.length; i++) {
            destinosproduccionesAtrasadas = destinosproduccionesAtrasadas + ',' + destinosSelectIdproduccionesAtrasadas[i];
        }
    } else {
        destinosproduccionesAtrasadas = null;
    }
    //llamada al metodo de graficar para traer los datos en el formato deseado
    Ext.Ajax.request({
        url: '/planificacion/planproeza/index.php/modelosestadisticos/graficarProduccionesAtrasadasSobrecumplimientos',
        method: 'POST',
        params: {
            //implementar lo del orden en la vista cuando lo analista decida donde va
            //lo mismo con el paginado
            //por ahora se ordena ascendentemente            
            orden: 1,
            atraso: 1,
            idejercicio: varidejercicio,
            programas: programasproduccionesAtrasadas,
            destinos: destinosproduccionesAtrasadas

        },
        callback: function (options, success, response) {

            resp = Ext.decode(response.responseText);
            $('#idpGenProduccionesAtrasadas').highcharts(
                    {
                        chart: {
                            height: 350, //pGenInterEmiEconomia.getInnerHeight(),                           
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
//                        subtitle: {
//                            //text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
//                            text: 'Producciones atrasadas'
//                        },
                        title: {
                            text: 'Empresas con producciones atrasadas'
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
            mymask.hide();
        }
    });
}
