Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';
var perfil = window.parent.UCID.portal.perfil;
//UCID.portal.cargarEtiquetas('cierreperiodo', function(){cargarInterfaz();});  
//UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

var fechacontable;
var periodo;
var ultimoPeriodo;
var aperturado;
var estructura;
var arrayData = [];
var cd = {};

function cargarInterfaz(datosVerificados) {
    lfdPeriodo = new Ext.form.Label({
        id: 'lfdPeriodo',
        text: ' ',
        style: 'font-weight:bold;'
    });
    lfdPeriodo.setText('Per\u00EDodo actual : ' + cd.periodo + ' Fecha contable: ' + cd.fecha);

    var kmTeclasCalientes = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'h',
            alt: true,
            fn: function() {
                btnAyuda.handler.call();
            }
        }
    ]);

    var btnAyuda = new Ext.Button({
        id: 'btnAyuCierreContable',
        iconCls: 'ayuda',
        text: 'Ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt</b>+<b>H</b>)'
    });

    var btnCPC = new Ext.Button({
        id: 'btnCPC',
        hidden: true,
        iconCls: 'cierre',
        text: 'Cerrar per&iacute;odo contable',
        tooltip: 'Cerrar per&iacute;odo contable',
        handler: function() {
            stCierre.removeAll();
            CerrarPeriodo();
        },
        abreviatura: 'cerrarperiodocontable_cierre'

    });
    // validate.addButton(btnCPC);

    var btnCEC = new Ext.Button({
        id: 'btnCEC',
        hidden: true,
        iconCls: 'cierre',
        text: 'Cerrar ejercicio contable',
        tooltip: 'Cerrar ejercicio contable',
        handler: function() {
            stCierre.removeAll();
            CerrarEjercicio();
        },
        abreviatura: 'cerrarejerciciocontable_cierre'

    });
    // validate.addButton(btnCEC);

    var btnVP = new Ext.Button({
        id: 'btnVP',
        tooltip: 'Vista previa',
        iconCls: 'vistareporte',
        text: 'Vista previa',
        disabled: true,
        handler: function() {
            reporte();
        },
        abreviatura: 'vistaprevia_cierre'

    });
    // validate.addButton(btnVP);
    //Ocultando primero todos los botones
    //Validando permisos de acceso a los recurdos en los botones
    // validate.checkPermisos();

    var btnVerComp = new Ext.Button({
        id: 'btnVerComp',
        tooltip: 'Abrir comprobante de operaciones',
        iconCls: 'comprobante',
        text: 'Abrir comprobante',
        hidden: true,
        handler: function() {
            var seleccionado = sm.getSelected().json;
            new Ext.ClassComprobante({
                readOnlyComprobante: true,
                accion: 2,
                tipoComprobante: 2,
                idComprobante: seleccionado.idcomprobante,
                idEstructurae: seleccionado.idestructurae,
                idSubsistema: seleccionado.idsubsistema * 1,
                comprobanteBlock: false,
                comprobanteEditable: false,
                reloadGridRegistroComprobantes: false
            });
        }
    });

    var stCierre = new Ext.data.GroupingStore({
        reader: new Ext.data.JsonReader({},
            [{
                name: 'checktype'
            }, {
                name: 'texto'
            }
        ]),
        sortInfo: {
            field: "checktype",
            direction: "ASC"
        },
        groupField: 'texto'
    });

    var sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(selmodel, rowIndex, record) {
                if(Ext.isEmpty(record.json.idcomprobante)){
                    btnVerComp.hide();
                }
                else {
                    btnVerComp.show();
                }
            },
            rowdeselect: function(selmodel, rowIndex, record) {
                if(selmodel.getCount() === 0) {
                    btnVerComp.hide();
                }
            }
        }
    });

    var gpCierre = new Ext.grid.GridPanel({
        store: stCierre,
        sm: sm,
        columns: [
            {
                width: 22, sortable: false, dataIndex: 'motivos',
                renderer: function(value, attr, record) {
                    switch (record.json.checktype)
                    {
                        case 1:
                            var text = "La cuenta " + record.json.cuenta + " posee saldo contable de " + record.json.saldoC + " y un saldo en Cobros y Pagos de " + record.json.saldo + " con una diferencia de " + record.json.diferencia;
                            arrayData.push({type: 1, text: text});
                            return text;
                        case 2:
                            var text = "La cuenta " + record.json.cuenta + " posee saldo de " + record.json.saldo + " y su naturaleza es " + record.json.naturaleza;
                            arrayData.push({type: 2, text: text});
                            return text;
                        case 3:
                            var text = record.json.tipo + "" + record.json.numero + " realizada el d&iacute;a " + record.json.fecha + " asociada a la cuenta " + record.json.cuenta + " no se encuentra posteada";
                            arrayData.push({type: 3, text: text});
                            return text;
                        case 4:
                            var text = record.json.tipo + [(record.json.numero) ? [" n&uacute;mero " + record.json.numero] : ""] + " realizado el d&iacute;a " + record.json.fecha + " con importe " + record.json.importe + " en la moneda " + record.json.moneda + " asociado a la cuenta " + record.json.cuenta + " no se encuentra posteado";
                            arrayData.push({type: 4, text: text});
                            return text;
                        case 5:
                            var text = "El contrato n&uacute;mero " + record.json.numero + " en la moneda " + record.json.moneda + " del d&iacute;a " + record.json.fecha + " no se encuentra posteado";
                            arrayData.push({type: 5, text: text});
                            return text;
                        case 6:
                            var text = record.json.tipoinstrumento + " n&uacute;mero " + record.json.numero + " en la moneda " + record.json.moneda + " del d&iacute;a " + record.json.fecha + " no se encuentra posteado.";
                            arrayData.push({type: 6, text: text});
                            return text;
                        case 7:
                            var text = record.json.tipoinstrumento + " n&uacute;mero " + record.json.numero + " en la moneda " + record.json.moneda + " del d&iacute;a " + record.json.fecha + " no se encuentra posteado.";
                            arrayData.push({type: 7, text: text});
                            return text;
                        case 8:
                            var text = record.json.denominacion;
                            arrayData.push({type: 8, text: text});
                            return text;
                        case 9:
                            var text = record.json.concatcta + ' ' + record.json.descripcion;
                            arrayData.push({type: 9, text: text});
                            return text;
                        case 10:
                            var text = record.json.texto;
                            arrayData.push({type: 10, text: text});
                            return text;
                    }
                }
            },
            {
                header: "<font color=\"FF0000\">MOTIVOS",
                hidden: true,
                hiddeable: false,
                sortable: false,
                dataIndex: 'texto', renderer: function(value, attr, record) {
                    switch (record.json.checktype)
                    {
                        case 1:
                            return "Las siguientes cuentas presentan descuadre de saldo";
                        case 2:
                            return "Las siguientes cuentas presentan saldos contrarios a su naturaleza";
                        case 3:
                            return "Las siguientes cuentas por cobrar o pagar no han sido posteadas";
                        case 4:
                            return "Los siguientes cobros o pagos anticipados no han sido posteados";
                        case 5:
                            return "Los siguientes contratos no han sido posteados";
                        case 6:
                            return "Los siguientes instrumentos no han sido posteados en el m&oacute;dulo Banco";
                        case 7:
                            return "Los siguientes instrumentos no han sido posteados en el m&oacute;dulo Caja";
                        case 8:
                            return "Los siguientes subsistemas no han cerrado el per&iacute;odo contable actual";
                        case 9:
                            return "Los siguientes cuentas no presentan saldo.";
                        case 10:
                            return "Los siguientes comprobantes de operaciones no han sido asentados";
                    }
                }
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Motivos" : "Motivo"]})'
        }),
        border: false,
        frame: false,
        autoScroll: true,
        stripeRows: true,
        region: 'center',
        width: 300,
        collapsible: true,
        animCollapse: false
    });

    var panel1 = new Ext.Panel({
        layout: 'fit',
        region: 'north',
        border: false,
        frame: false,
        tbar: ['->', lfdPeriodo],
        bbar: [btnCPC, btnCEC, btnVP, btnVerComp, '->', btnAyuda], // lfdPeriodo],
        listeners: {
            render: function() {
                btnCPC.focus();
            }
        }
    });

    var MiView = new Ext.Viewport({
        border: false,
        layout: 'border',
        items: [panel1, gpCierre],
        renderTo: document.body
    });

    function CerrarPeriodo() {
        Ext.Msg.show({
            title: 'Confirmaci&oacute;n',
            msg: 'Este proceso dar&aacute; por terminadas las operaciones en el per&iacute;odo contable. <br> &iquest;Est&aacute; seguro que quiere efectuar el cierre?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn, text) {
                if (btn == 'ok') {
                    Ext.Msg.wait('Cerrando per&iacute;odo contable...', 'Por favor espere...');
                    Ext.Ajax.request({
                        url: 'cerrarperiodo',
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.v == 1)
                            {
                                Ext.Msg.hide();
                                btnVP.setDisabled(true);
                                mostrarMensaje(1, responseData.d);
                                
                                //Actualizar el label
                                var text = 'Per\u00EDodo actual: ' + responseData.nombrePer + '. Desde ' + responseData.inicioPer + ' hasta ' + responseData.finPer + '. Fecha contable: ' + responseData.fechaC;
                                lfdPeriodo.setText(text);
                                ultimoPeriodo = responseData.ultimoperiodo;
                                verificarUltimoPeriodo();
                                btnCPC.focus();
                            }
                            else if (responseData.v == 0)
                            {
                                Ext.Msg.hide();
                                btnVP.setDisabled(false);
                                mostrarMensaje(1, "No se puede efectuar el cierre del per&iacute;odo contable. Por favor revise las causas.");
                                if (responseData.nosaldocuenta == 1) {
                                    mostrarMensaje(1, "No existen cuentas contables con saldo en este per&iacute;odo.");
                                }

                                stCierre.removeAll();
                                stCierre.loadData(responseData.datos);
                                btnCPC.focus();
                                btnVerComp.hide();
                            }
                            else
                            {
                                Ext.Msg.hide();
                                btnCPC.focus();
                            }
                        }
                    });
                }
            }
        });
    }

    function CerrarEjercicio() {
        Ext.Msg.show({
            title: 'Confirmaci&oacute;n',
            msg: 'Este proceso dar&aacute; por terminadas las operaciones en el ejercicio contable. <br> &iquest;Est&aacute; seguro que quiere efectuar el cierre?',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn, text) {
                if (btn == 'ok') {
                    Ext.Msg.wait('Cerrando ejercicio contable...', 'Por favor espere...');
                    Ext.Ajax.request({
                        url: 'cerrarejercicio',
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.v == 1)
                            {
                                Ext.Msg.hide();
                                btnVP.setDisabled(true);
                                mostrarMensaje(1, responseData.d);
                                
                                //Actualizar el label
                                var text = 'Per\u00EDodo actual: ' + responseData.nombrePer + '. Desde ' + responseData.inicioPer + ' hasta ' + responseData.finPer + '. Fecha contable: ' + responseData.fechaC;
                                lfdPeriodo.setText(text);
                                ultimoPeriodo = responseData.ultimoperiodo;
                                verificarUltimoPeriodo();

                                btnCEC.focus();
                            }
                            else if (responseData.v == 0)
                            {
                                Ext.Msg.hide();
                                btnVP.setDisabled(false);
                                mostrarMensaje(1, "No se puede efectuar el cierre del ejercicio contable.", function() {
                                });
                                if (responseData.nosaldocuenta == 1) {
                                    mostrarMensaje(1, "No existen cuentas contables con saldo en este cierre de ejercicio.");
                                }

                                stCierre.removeAll();
                                stCierre.loadData(responseData.datos);
                                btnCEC.focus();
                                btnVerComp.hide();
                            }
                            else
                            {
                                Ext.Msg.hide();
                                btnCEC.focus();
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
                idReporte: 673,
                data: Ext.encode(arrayData)
            },
            callback: function(options, success, response) {
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
    }

    function verificarUltimoPeriodo(){
        if(ultimoPeriodo == 1) {
            btnCEC.show();
            btnCPC.hide();
        } else {
            btnCEC.hide();
            btnCPC.show();
        }
        if(aperturado == 0){
            btnCPC.hide();
            mostrarMensaje(1, 'Cobros y pagos no ha cerrado las operaciones de la carga inicial');
        } else {
            btnCPC.show();
        }
    }
    verificarUltimoPeriodo();
	stCierre.loadData(datosVerificados);
    // btnCEC.setVisible((ultimoPeriodo == 1) ? true : false);
    // btnCPC.setVisible((ultimoPeriodo == 0) ? true : false);
}

Ext.Msg.wait('Cargando...', 'Por favor espere...');
Ext.Ajax.request({
    url: 'fecha',
    callback: function(options, success, response) {
        if (success) {
            cd = Ext.decode(response.responseText);
            fechacontable = cd.fecha;
            periodo = cd.periodo;
            ultimoPeriodo = cd.ultimoperiodo
            estructura = cd.estructura;
            Ext.Msg.hide();
            aperturado = cd.aperturado;
            cargarInterfaz(cd.datos);
			
        }
    }
});
