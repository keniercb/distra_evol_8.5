var programasproduccionesSobreCump, destinosproduccionesSobreCump, storesCargadosSobreCump = 2;
function cargarproduccionesSobreCump() {
    btnGraficarProduccionesSobreCump = new Ext.Button({
        disabled: true,
        id: 'btnGraficarProduccionesSobreCump',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbGraficar,
        tooltip: perfil.etiquetas.lbObtenerGrafica,
        handler: function () {
            mymask.show();
            produccionesSobreCump(cbEjercicio.getValue());
        }
    });
    stProgramasSobreCump = new Ext.data.Store({
        url: 'listarProgramas',
        listeners: {
            load: function (t, n, e) {
                stDestinosSobreCump.reload();
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

    stDestinosSobreCump = new Ext.data.Store({
        url: 'listarDestinos',
        listeners: {
            load: function (t, n, e) {
                //pintar(cbEjercicio.getValue());
                  mymask.hide();    
                 btnGraficarProduccionesSobreCump.enable();
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

    cbProgramasProduccionesSobreCump = new Ext.ux.form.LovCombo({
        id: 'cbProgramasProduccionesSobreCump',
        store: stProgramasSobreCump,
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
//                produccionesSobreCump(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                produccionesSobreCump(cbEjercicio.getValue());
//            }
//        }
    });
    cbProgramasProduccionesSobreCump.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbProgramasProduccionesSobreCump.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';


    cbDestinosProduccionesSobreCump = new Ext.ux.form.LovCombo({
        id: 'cbDestinosProduccionesSobreCump',
        store: stDestinosSobreCump,
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
//                produccionesSobreCump(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                produccionesSobreCump(cbEjercicio.getValue());
//            }
//        }
    });
    cbDestinosProduccionesSobreCump.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbDestinosProduccionesSobreCump.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    fpProduccionesSobreCump = new Ext.FormPanel({
        id: 'fpProduccionesSobreCump',
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
                                items: [cbProgramasProduccionesSobreCump]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [cbDestinosProduccionesSobreCump]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [btnGraficarProduccionesSobreCump]
                            }
                        ]
                    }
                ]
            }

        ]
    });
    pGenProduccionesSobreCump = new Ext.Panel({
        id: 'pGenProduccionesSobreCump',
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        height: '60%',
        html: '<div id="idpGenProduccionesSobreCump" margin: 0 auto"></div>'
    });
}
function produccionesSobreCump(varidejercicio) {
    //trabajo con los programas
    programasSelectIdproduccionesSobreCump = cbProgramasProduccionesSobreCump.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbProgramasProduccionesSobreCump.getCheckedValue().split(',')[0] != '') {
        programasproduccionesSobreCump = programasSelectIdproduccionesSobreCump[0];
        for (var i = 1; i < programasSelectIdproduccionesSobreCump.length; i++) {
            programasproduccionesSobreCump = programasproduccionesSobreCump + ',' + programasSelectIdproduccionesSobreCump[i];
        }
    } else {
        destinosproduccionesSobreCump = null;
    }

    //trabajo con los destinos
    destinosSelectIdproduccionesSobreCump = cbDestinosProduccionesSobreCump.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    //si no se selecciona nada se manda el param vacio
    if (cbDestinosProduccionesSobreCump.getCheckedValue().split(',')[0] != '') {
        destinosproduccionesSobreCump = destinosSelectIdproduccionesSobreCump[0];
        for (var i = 1; i < destinosSelectIdproduccionesSobreCump.length; i++) {
            destinosproduccionesSobreCump = destinosproduccionesSobreCump + ',' + destinosSelectIdproduccionesSobreCump[i];
        }
    } else {
        destinosproduccionesSobreCump = null;
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
            atraso: 2,
            idejercicio: varidejercicio,
            programas: programasproduccionesSobreCump,
            destinos: destinosproduccionesSobreCump

        },
        callback: function (options, success, response) {
            resp = Ext.decode(response.responseText);
            $('#idpGenProduccionesSobreCump').highcharts(
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
                            text: 'Empresas con producciones sobre cumplidas'
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
