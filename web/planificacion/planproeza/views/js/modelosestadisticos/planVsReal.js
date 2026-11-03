var storesCargadosplanVsReal = 2;
function cargarplanVsReal() {
    btnGraficarPlanVsReal = new Ext.Button({
        disabled: true,
        id: 'btnGraficarPlanVsReal',
        iconCls: 'aceptar',
        align: 'right',
        text: perfil.etiquetas.lbGraficar,
        tooltip: perfil.etiquetas.lbObtenerGrafica,
        handler: function () {
            mymask.show();
            planVsReal(cbEjercicio.getValue());
        }
    });
    stEntidadesClientesplanVsReal = new Ext.data.Store({
        url: 'listarEntidadesClientes',
        listeners: {
            load: function (t, n, e) {
                stEntidadesUIMplanVsReal.reload();
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
    cbEntidadesClientesplanVsReal = new Ext.ux.form.LovCombo({
        id: 'cbEntidadesClientesplanVsReal',
        store: stEntidadesClientesplanVsReal,
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
//                planVsReal(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planVsReal(cbEjercicio.getValue());
//            }
//        }
    });
    cbEntidadesClientesplanVsReal.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbEntidadesClientesplanVsReal.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    stEntidadesUIMplanVsReal = new Ext.data.Store({
        url: 'listarEntidadesUIM',
        listeners: {
            load: function (t, n, e) {
                // pintar(cbEjercicio.getValue());
                mymask.hide();
                btnGraficarPlanVsReal.enable();
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
    cbEntidadesUIMplanVsReal = new Ext.ux.form.LovCombo({
        id: 'cbEntidadesUIMplanVsReal',
        store: stEntidadesUIMplanVsReal,
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
//                planVsReal(cbEjercicio.getValue());
//            },
//            deselect: function (cb, rec, index) {
//                planVsReal(cbEjercicio.getValue());
//            }
//        }
    });
    cbEntidadesUIMplanVsReal.tpl = '<tpl for=".">'
            + '<div ext:qtip="{denominacion}" class="x-combo-list-item">'
            + '<img src="' + Ext.BLANK_IMAGE_URL + '" '
            + 'class="ux-lovcombo-icon ux-lovcombo-icon-'
            + '{[values.' + cbEntidadesUIMplanVsReal.checkField + '?"checked":"unchecked"' + ']}">'
            + '<div class="ux-lovcombo-item-text">{denominacion}</div>'
            + '</div>'
            + '</tpl>';
    fpPlanVsReal = new Ext.FormPanel({
        id: 'fpPlanVsReal',
        autoHeight: true,
        frame: true,
        items: [{
                xtype: 'fieldset',
                height: 50,
                items: [{
                        columnWidth: 1,
                        layout: 'column',
                        items: [{
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [cbEntidadesClientesplanVsReal]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [cbEntidadesUIMplanVsReal]
                            }
                            , {
                                columnWidth: 0.33,
                                layout: 'form',
                                items: [btnGraficarPlanVsReal]
                            }
                        ]
                    }
                ]
            }

        ]
    });

    pPlanVsRealMes = new Ext.Panel({
        id: 'pPlanVsRealMes',
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        html: '<div id="idpPlanVsRealMes" margin: 0 auto"></div>'
    });
    pPlanVsRealTrim = new Ext.Panel({
        id: 'pPlanVsRealTrim',
        layout: 'fit',
        region: 'west',
        width: '50%',
        height: '50%',
        bodyBorder: false,
        html: '<div id="idpPlanVsRealTrim" margin: 0 auto"></div>'
    });
    pPlanVsRealSem = new Ext.Panel({
        id: 'pPlanVsRealSem',
        layout: 'fit',
        region: 'center',
        width: '50%',
        height: '50%',
        bodyBorder: false,
        html: '<div id="idpPlanVsRealSem" margin: 0 auto"></div>'
    });
    pGenplanVsReal = new Ext.Panel({
        id: 'pGenplanVsReal',
        height: 350,
        layout: 'border',
        disabled: false,
        items: [pPlanVsRealTrim, pPlanVsRealSem]

    });


}
function planVsReal(varidejercicio) {
    //trabajo con los clientes
    entidadesSelectIdClientesplanVsReal = cbEntidadesClientesplanVsReal.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    if (cbEntidadesClientesplanVsReal.getCheckedValue().split(',')[0] != '') {
        entidadesClientesplanVsReal = entidadesSelectIdClientesplanVsReal[0];
        for (var i = 1; i < entidadesSelectIdClientesplanVsReal.length; i++) {
            entidadesClientesplanVsReal = entidadesClientesplanVsReal + ',' + entidadesSelectIdClientesplanVsReal[i];
        }
    } else {
        //si no se selecciona nada se manda el param con todos los elementos del store
        entidadesClientesplanVsReal = "";
        for (i in stEntidadesClientesplanVsReal.data.items) {
            if (stEntidadesClientesplanVsReal.data.items[i].data) {
                if (i == 0)
                    entidadesClientesplanVsReal = stEntidadesClientesplanVsReal.data.items[i].data.identidad;
                else
                    entidadesClientesplanVsReal = entidadesClientesplanVsReal + ',' + stEntidadesClientesplanVsReal.data.items[i].data.identidad;
            }
        }
    }

    //trabajo con los proveedores
    entidadesSelectIdProveedorPlanInterEmi = cbEntidadesUIMplanVsReal.getCheckedValue().split(',');
    //tomar todos los seleccionados y guardarlos en una variable separados por coma
    if (cbEntidadesUIMplanVsReal.getCheckedValue().split(',')[0] != '') {
        entidadesProveedorPlanInterEmi = entidadesSelectIdProveedorPlanInterEmi[0];
        for (var i = 1; i < entidadesSelectIdProveedorPlanInterEmi.length; i++) {
            entidadesProveedorPlanInterEmi = entidadesProveedorPlanInterEmi + ',' + entidadesSelectIdProveedorPlanInterEmi[i];
        }
    } else {
        //si no se selecciona nada se manda el param con todos los elementos del store
        entidadesProveedorPlanInterEmi = "";
        for (i in stEntidadesUIMplanVsReal.data.items) {
            if (stEntidadesUIMplanVsReal.data.items[i].data) {
                if (i == 0)
                    entidadesProveedorPlanInterEmi = stEntidadesUIMplanVsReal.data.items[i].data.identidad;
                else
                    entidadesProveedorPlanInterEmi = entidadesProveedorPlanInterEmi + ',' + stEntidadesUIMplanVsReal.data.items[i].data.identidad;
            }
        }
    }
    //llamada al metodo de graficar para traer los datos en el formato deseado
    Ext.Ajax.request({
        url: '/planificacion/planproeza/index.php/modelosestadisticos/graficarPlanVsReal',
        method: 'POST',
        params: {
            //implementar lo del orden en la vista cuando lo analista decida donde va
            //lo mismo con el paginado
            //por ahora se ordena ascendentemente            
            orden: 1,
            idejercicio: varidejercicio,
            proveedores: entidadesProveedorPlanInterEmi,
            clientes: entidadesClientesplanVsReal

        },
        callback: function (options, success, response) {

            resp = Ext.decode(response.responseText);
            $('#idpPlanVsRealMes').highcharts(
                    {
                        chart: {
                            height: 300,
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Meses'
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
                            categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataMes
                    }
            );
            $('#idpPlanVsRealTrim').highcharts(
                    {
                        chart: {
                            height: 350,
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Trimestres'
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
                            categories: ['1er trimestre', '2do trimestre', '3er trimestre', '4to trimestre']
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataTrim
                    }
            );
            $('#idpPlanVsRealSem').highcharts(
                    {
                        chart: {
                            height: 350,
                            renderTo: 'chart',
                            type: 'column',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Semestres'
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
                            categories: ['1er semestre', '2do semestre']
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataSem
                    }
            );
            mymask.hide();
        }
    });
}
