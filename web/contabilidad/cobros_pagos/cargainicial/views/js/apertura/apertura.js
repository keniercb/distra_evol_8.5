Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';
var perfil = window.parent.UCID.portal.perfil
//UCID.portal.cargarEtiquetas('cierreperiodo', function(){cargarInterfaz();});  
UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

var fechacontable;
var periodo;
var estructura;
var arrayData = [];

function cargarInterfaz() {
    lfdPeriodo = new Ext.form.Label({
        id: 'lfdPeriodo',
        text: ' ',
        style: 'font-weight:bold;'
    });

    btnCPC = new Ext.Button({
        id: 'btnCPC',
        hidden: false,
        disabled: true,
//        icon: perfilmodificar.dirImg + 'aceptar.png',
        iconCls: 'cierre',
        text: 'Realizar cierre',
        tooltip: 'Realizar cierre de la carga inicial',
        handler: function () {
            CerrarPeriodo();
        },
        abreviatura: 'realizarcierre_cierre'

    });
    validate.addButton(btnCPC);

    btnVistaPrevia = new Ext.Button({
        id: 'btnVP',
        tooltip: 'Vista previa',
//        icon: perfil.dirImg + 'imprimir.png',
        iconCls: 'vistareporte',
        text: 'Vista previa',
        disabled: true,
        handler: function () {
            reporte();
        },
        abreviatura: 'vistaprevia_cierre'

    });
    validate.addButton(btnVistaPrevia);
    //Ocultando primero todos los botones
    //Validando permisos de acceso a los recurdos en los botones
    validate.checkPermisos();

    var btnAyuda = new Ext.Button({
        id: 'btnAyuCierreCI',
//        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: 'Ayuda',
        tooltip: 'Ayuda'
        /*handler: function () {
            titulo = 'Cierre';
            direccion = 'copa/ci/cierre';
            help.show(titulo, direccion);
        }*/
    });

    var area = new Ext.form.TextArea({
        value: '',
        inputType: 'text',
        readOnly: true
    });

    var stCierre = new Ext.data.GroupingStore({
        reader: new Ext.data.JsonReader({}, [{
            name: 'cuenta'
        }, {
            name: 'saldo'
        }, {
            name: 'saldoC'
        }, {
            name: 'texto'
        }
        ]),
        sortInfo: {
            field: "saldo",
            direction: "ASC"
        },
        groupField: 'texto'
    });

    var gpCierre = new Ext.grid.GridPanel({
        store: stCierre,
        columns: [
            {
                width: 22, sortable: false, dataIndex: 'motivos',
                renderer: function (value, attr, record) {
                    var text = "La cuenta " + record.json.cuenta + " posee saldo contable de " + Math.abs(record.json.saldoC).toFixed(2) + " y un saldo en Cobros y Pagos de " + Math.abs(record.json.saldo).toFixed(2);
                    arrayData.push({type: 1, text: text});
                    return text;
                }
            },
            {
                header: "<font color=\"FF0000\">Las siguientes cuentas presentan descuadre de saldo",
                hidden: true,
                hiddeable: false,
                sortable: false,
                dataIndex: 'texto', renderer: function (value/*,attr,record*/) {
                    return " ";
                }
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '{text}'
        }),
        border: false,
        autoScroll: true,
        stripeRows: true,
        frame: false,
        region: 'center',
        collapsible: true,
        animCollapse: false
    });

    var panel1 = new Ext.Panel({
        layout: 'fit',
        border: false,
        frame: true,
        region: 'north',
        bbar: [btnCPC, btnVistaPrevia, '->', lfdPeriodo, '-', btnAyuda]
    });

    var MiView = new Ext.Viewport({
        border: true,
        layout: 'border',
        items: [panel1, gpCierre],
        renderTo: document.body
    });

    Ext.Ajax.request({
        url: 'fecha',
        callback: function (options, success, response) {
            if (success) {
                var cd = Ext.decode(response.responseText);
                fechacontable = cd.fecha;
                estructura = cd.estructura;
                if (cd.periodo) {
                    periodo = cd.periodo;
                    Ext.getCmp('lfdPeriodo').setText('Per\u00EDodo actual: ' + cd.periodo + '  Fecha contable: ' + fechacontable);
                }
                if (cd.aperturado == 1) {
                    btnCPC.disable();
                    mostrarMensaje(1, 'Cobros y pagos ha cerrado las operaciones de la carga inicial', function () {
                    });
                } else {
                    btnCPC.enable();
                    if (cd.datos) {
                        btnVistaPrevia.setDisabled(false);
                        mostrarMensaje(1, "No se puede efectuar el cierre.");
                        stCierre.loadData(cd.datos);
                    } else {
                        mostrarMensaje(1, "El subsistema está listo para efectuar el cierre de la carga inicial.");
                    }
                }
            }
        }
    });

    function CerrarPeriodo() {
        Ext.Msg.show({
            title: 'Confirmaci&oacute;n',
            msg: 'Este proceso da inicio a las operaciones en el m&oacute;dulo de Cobros y pagos. <br> &iquest;Est&aacute; seguro que quiere efectuar el cierre?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            fn: function (btn, text) {
                if (btn == 'ok') {
                    area.setValue("");
                    lMaskk = new Ext.LoadMask(Ext.getBody(), {
                        msg: 'Cargando...'
                    });
                    lMaskk.show();
                    Ext.Ajax.request({
                        timeout: 1800000,
                        url: 'comenzar',
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.v == 1) {
                                lMaskk.hide();
                                btnVistaPrevia.setDisabled(true);
                                mostrarMensaje(1, responseData.d);
                                btnCPC.disable();
                                mostrarMensaje(1, 'Cobros y pagos ha cerrado las operaciones de la carga inicial', function () {
                                });
                            } else if (responseData.v == 0) {
                                lMaskk.hide();
                                btnVistaPrevia.setDisabled(false);
                                mostrarMensaje(1, "No se puede efectuar el cierre.");
                                //area.setValue(responseData.d);
                                stCierre.loadData(responseData.datos);
                            } else {
                                lMaskk.hide();
                            }
                        }
                    });
                }
            }
        });
    }

    function reporte() {
        Ext.Ajax.request({
            method: "POST",
            url: 'cargarDatosReporte',
            params: {
                periodo: periodo,
                fechacontable: fechacontable,
                estructura: estructura,
                idReporte: 674,
                data: Ext.encode(arrayData)
            },
            callback: function (options, success, response) {
                var responseDataReporte = Ext.decode(response.responseText);
                if (responseDataReporte.dataSources) {
                    var defaultComponentValues = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                    var printView = new SCFPrintView(responseDataReporte.dataSources, "/contabilidad/comun/SCFPrintView/", defaultComponentValues);
                    printView.show();
                } else {
                    mostrarMensaje(1, 'No existen datos que mostrar');
                }
            }
        });

        /*var f = document.getElementById('formreporte');
         var nuevaventrep = 'titlebar=yes,status=no,location=no,resizable=no,scrollbars=yes,width=' + screen.width + ',height=' + screen.height;//se obtiene el tamanno de la pantalla
         f.periodo.value = ' ' + periodo;
         f.fecha.value = fechacontable;
         f.textarea.value = 'asdasdad'; //area.getValue();
         f.estructura.value = estructura;
         ventana = window.open('reportecierre', 'Reportecierre', nuevaventrep);
         ventana.focus();//Le doy el focus a la ventana de trabajo	
         f.submit();*/
    }
}

cargarInterfaz();

// Array data for the grids

