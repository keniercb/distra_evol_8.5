
Ext.QuickTips.init();
//UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
lMask = new Ext.LoadMask(Ext.getBody(), {
    msg: 'Cargando datos...'
});
Ext.Ajax.timeout = 9000000;
var perfil = window.parent.UCID.portal.perfil;
var cuentas = 0;
var tipo = 0;/*Para saber que estoy haciendo , 1 para los derechos , 2 para las obligaciones , 3 cobro antici y 4 pago anticipado*/
//denomcolumna = 'Cliente/Proveedor';textDuo;
var v_reportes = Array(), winReporte, formulario;
var FechaInicio, FechaFin;

UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
    v_reportes = UCID.portal.getAccionesReportes();
});

/*----------------------------------Buscar fechas del periodo -------------------------------------------------------------*/
CargarFecha();

function CargarFecha()
{
    Ext.Ajax.request({
        url: 'CargarFechaPeriodo',
        method: 'POST',
        params: {
        },
        callback: function(options, success, response)
        {
            responseData = Ext.decode(response.responseText);
            FechaInicio = responseData.inicio;
            FechaFin = responseData.fin;
        }
    });
}

var arrayData = [];

function cargarInterfaz() {
    var hotKeys = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'h',
            alt: true,
            fn: function() {
                btnAyuda.handler.call();
            }
        }
    ]);

    var denomcolumna = 'Deudor/Acreedor';
    var textDuo;
    //loadMask('Cargando...');	
    var btnCalcSbm = new Ext.Button({
        disabled: true,
        //hidden:true,
        id: 'calcSub',
        text: 'Calcular submayor',
//        icon: perfil.dirImg + 'calcular.png ',
        tooltip: 'Calcular submayor',
        iconCls: 'calcular',
        handler: function() {
            Submayorcliente();
            //btnImprimirSubmCP.enable();
        }
    });

    var btnImprimirSubmCP = new Ext.Button({
        disabled: true,
        //hidden:true,
        id: 'btnImprimirSubmCP',
        text: 'Vista previa',
//        icon: perfil.dirImg + 'imprimir.png ',
        tooltip: 'Vista previa',
        iconCls: 'imprimir',
        handler: function() {
            //FnMostrarWinReporte();
            Ext.Ajax.request({
                method: "POST",
                url: 'cargarDatosReporte',
                params: {
                    idReporte: 665,
                    data: Ext.encode(arrayData),
                    moneda: cbMoneda.getRawValue(),
                    cuenta: cbcuentas.getRawValue(),
                    grouptext: denomcolumna,
                    typetext: textDuo
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
    });

    var btnAyuda = new Ext.Button({
        id: 'btnAyu',
//        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: "Mostrar ayuda de la funcionalidad (<b>Alt</b>+<b>H</b>)",
        text: 'Ayuda',
        handler: function() {
            var title = 'Deudores y acreedores';
            var referencia = 'copa/submayores/clienteprov';
            help.show(title, referencia);
        }
    });

    var lbTotal = new Ext.form.Label({
        id: 'saldototallabel',
        style: 'font-weight:bold;',
        text: '0.00'
    });

    var lbInformacion = new Ext.form.Label({
        id: 'lbinformacion',
        style: 'font-weight:bold;',
        text: 'No hay resultados para mostrar.'
    });

    var derechocobro = new Ext.form.Radio({
        labelSeparator: '',
        id: 'derechocobro',
        name: 'fav',
        inputValue: 'Cuentas por cobrar',
        listeners: {
            check: function(radio, checked) {
                if (checked) {
                    textDuo = this.getGroupValue();
                    denomcolumna = 'Deudor';
                    btnImprimirSubmCP.disable();
                }
            }
        }
    });

    var obligacionpago = new Ext.form.Radio({
        labelSeparator: '',
        id: 'obligacionpago',
        name: 'fav',
        inputValue: 'Cuentas por pagar',
        listeners: {
            check: function(radio, checked) {
                if (checked) {
                    textDuo = this.getGroupValue();
                    denomcolumna = 'Acreedor';
                    btnImprimirSubmCP.disable();
                }
            }
        }
    });

    var cobroanticipado = new Ext.form.Radio({
        labelSeparator: '',
        id: 'cobroanticipado',
        name: 'fav',
        inputValue: 'Cobro anticipado',
        listeners: {
            check: function(radio, checked) {
                if (checked) {
                    textDuo = this.getGroupValue();
                    denomcolumna = 'Deudor';
                    btnImprimirSubmCP.disable();
                }
            }
        }
    });

    var pagoanticipado = new Ext.form.Radio({
        labelSeparator: '',
        id: 'pagoanticipado',
        name: 'fav',
        inputValue: 'Pago anticipado',
        listeners: {
            check: function(radio, checked) {
                if (checked) {
                    textDuo = this.getGroupValue();
                    denomcolumna = 'Acreedor';
                    btnImprimirSubmCP.disable();
                }
            }
        }
    });

    //accion a ejecutar si activa el radio button derecho de cobro
    derechocobro.on('check', derechoc);
    function derechoc(e)
    {
        if (e.checked)
        {
            tipo = 1;
            lMask.show();
            stsubmayor.removeAll();
            lbTotal.setText('0.00');
            lbInformacion.setText('No hay resultados para mostrar.');
            stcuenta.removeAll();
            cbcuentas.reset();
            stcliente.removeAll();
            cbcliente.reset();

            cbMoneda.reset();
            cbproveedor.reset();
            dfDesde.reset();
            dfHasta.reset();
            dfDesde.setMaxValue(null);
            dfHasta.setMinValue(null);
            cbcuentas.setDisabled(false);
            cbproveedor.setDisabled(true);
            btnCalcSbm.setDisabled(true);
            stcuenta.load({
                params: {
                    idtipo: derechocobro.getId()
                }
            });
            lMask.hide();
        }
    }

    function comprobar()
    {
        if (stcuenta.getCount() == 0)
        {
            cbcuentas.setDisabled(true);
            mostrarMensaje(1, 'El submayor solicitado no tiene resultados para mostrar.');
        }
    }

    //accion a ejecutar si activa el radio button pago anticipado
    pagoanticipado.on('check', pagoanticip);
    function pagoanticip(e)
    {
        if (e.checked)
        {
            lMask.show();
            tipo = 4;
            // denomcolumna='proveedor';
            stsubmayor.removeAll();
            lbTotal.setText('0.00');
            lbInformacion.setText('No hay resultados para mostrar.');
            stcuenta.removeAll();
            cbcuentas.reset();
            stcliente.removeAll();
            cbcliente.reset();
            cbproveedor.reset();
            cbMoneda.reset();
            dfDesde.reset();
            dfHasta.reset();
            // dfDesde.setMaxValue(null);
            dfHasta.setMaxValue(FechaFin);
            dfHasta.setMinValue(FechaInicio);
            dfDesde.setMaxValue(FechaFin);
            //dfDesde.setMinValue(FechaInicio);
            //dfHasta.setMinValue(null);
            cbcuentas.setDisabled(false);
            // dfDesde.setDisabled(false);
            //dfHasta.setDisabled(false);   
            cbcliente.setDisabled(true);
            //  cbproveedor.setDisabled(false);
            btnCalcSbm.setDisabled(true);
            stcuenta.reload({
                params: {
                    idtipo: pagoanticipado.getId()
                }
                /*callback: function(r, options, success){
                 stcliente.reload({
                 params:{idtipo:pagoanticipado.getId()},
                 callback: function(r, options, success){
                 lMask.hide();	
                 }
                 });
                 }*/
            });
            lMask.hide();
        }
    }

    //accion a ejecutar si activa el radio button cobro anticipado
    cobroanticipado.on('check', cobroanticipad);
    function cobroanticipad(e) {
        if (e.checked) {
            tipo = 3;
            //denomcolumna='cliente';
            lMask.show();
            stsubmayor.removeAll();
            lbTotal.setText('0.00');
            lbInformacion.setText('No hay resultados para mostrar.');
            stcuenta.removeAll();
            cbcuentas.reset();
            stcliente.removeAll();
            cbcliente.reset();
            cbMoneda.reset();
            cbproveedor.reset();
            dfDesde.reset();
            dfHasta.reset();
            dfHasta.setMaxValue(FechaFin);
            dfHasta.setMinValue(FechaInicio);
            dfDesde.setMaxValue(FechaFin);
            //dfDesde.setMinValue(FechaInicio);
            //dfDesde.setMaxValue(null);
            //dfHasta.setMinValue(null);
            cbcuentas.setDisabled(false);
            //cbcliente.setDisabled(false);
            //dfDesde.setDisabled(false);
            //dfHasta.setDisabled(false);   
            cbproveedor.setDisabled(true);
            btnCalcSbm.setDisabled(true);
            stcuenta.reload({
                params: {
                    idtipo: cobroanticipado.getId()
                }
                /*callback: function(r, options, success){
                 stcliente.reload({
                 params:{idtipo:cobroanticipado.getId()},
                 callback: function(r, options, success){
                 lMask.hide();	
                 }
                 });
                 }*/
            });
            lMask.hide();
        }
    }

    //accion a ejecutar si activa el radio button obligacion de pago
    obligacionpago.on('check', obligacionp);
    function obligacionp(e) {
        if (e.checked) {
            tipo = 2;
            lMask.show();
            // denomcolumna='proveedor';
            stsubmayor.removeAll();
            lbTotal.setText('0.00');
            lbInformacion.setText('No hay resultados para mostrar.');
            stcuenta.removeAll();
            cbcuentas.reset();
            stcliente.removeAll();
            cbcliente.reset();
            cbproveedor.reset();
            cbMoneda.reset();
            dfDesde.reset();
            dfHasta.reset();
            dfHasta.setMaxValue(FechaFin);
            dfHasta.setMinValue(FechaInicio);
            dfDesde.setMaxValue(FechaFin);
            //dfDesde.setMinValue(FechaInicio);
            cbcuentas.setDisabled(false);
            // dfDesde.setDisabled(false);
            //dfHasta.setDisabled(false);   
            cbcliente.setDisabled(true);
            //cbproveedor.setDisabled(false);
            btnCalcSbm.setDisabled(true);
            stcuenta.reload({
                params: {
                    idtipo: obligacionpago.getId()
                }
                /*callback: function(r, options, success){
                 stcliente.reload({
                 params:{idtipo:obligacionpago.getId()},
                 callback: function(r, options, success){
                 lMask.hide();	
                 }
                 });
                 }*/
            });
            lMask.hide();
        }
    }

    Ext.apply(Ext.form.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);
            var dispUpd = function(picker) {
                var ad = picker.activeDate;
                picker.activeDate = null;
                picker.update(ad);
            };
            if (field.startDateField) {
                var sd = Ext.getCmp(field.startDateField);
                sd.maxValue = date;
                if (sd.menu && sd.menu.picker) {
                    sd.menu.picker.maxDate = date;
                    dispUpd(sd.menu.picker);
                }
            } else if (field.endDateField) {
                var ed = Ext.getCmp(field.endDateField);
                ed.minValue = date;
                if (ed.menu && ed.menu.picker) {
                    ed.menu.picker.minDate = date;
                    dispUpd(ed.menu.picker);
                }
            }
            return true;
        }
    });

    var dfHasta = new Ext.form.DateField({
        fieldLabel: 'Hasta',
        name: 'hasta',
        id: 'hasta',
        allowBlank: true,
        vtype: 'daterange',
        startDateField: 'desde',
        width: 100,
        disabled: true,
        format: 'd/m/Y',
        anchor: '95%',
        //readOnly : true,
        maxValue: null,
        minValue: null,
        enableKeyEvents: true,
        invalidText: 'Este campo es obligatorio.'
    });

    // datefield desde
    var dfDesde = new Ext.form.DateField({
        fieldLabel: 'Desde',
        name: 'desde',
        id: 'desde',
        width: 100,
        disabled: true,
        vtype: 'daterange',
        endDateField: 'hasta',
        allowBlank: true,
        format: 'd/m/Y',
        //readOnly : true,
        maxValue: FechaFin,
        //minValue :FechaInicio,
        anchor: '95%',
        enableKeyEvents: true,
        invalidText: 'Este campo es obligatorio.'
    });

    //reader y stores de Moneda
    rdmoneda = new Ext.data.JsonReader({
        id: 'idnommonedaentidad'
    }, [{
            name: 'idnommonedaentidad'
        }, {
            name: 'idnommoneda'
        }, {
            name: 'codigoiso'
        }
    ]);

    var stmoneda = new Ext.data.Store({
        url: 'cargarmonedas',
        sortInfo: {
            field: "codigoiso",
            direction: "ASC"
        },
        reader: rdmoneda
    });

    stmoneda.load();

    var stcuenta = new Ext.data.Store({
        url: 'cargarcuenta',
        listeners: {
            load: function() {
                cuentas = stcuenta.getCount();
                comprobar();
            }
        },
        sortInfo: {
            field: "clavedescripcion",
            direction: "ASC"
        },
        reader: new Ext.data.JsonReader({
            id: 'idcuenta'
        }, [{
                name: 'idcuenta'
            }, {
                name: 'clavecuenta'
            }, {
                name: 'descripcion'
            }, {
                name: 'clavedescripcion'
            }
        ])
    });

    var stcliente = new Ext.data.Store({
        url: 'cargarcliente',
        sortInfo: {
            field: "cliente",
            direction: "ASC"
        },
        reader: new Ext.data.JsonReader({
            id: 'idcliente'
        }, [{
                name: 'idcliente'
            }, {
                name: 'cliente'
            }
        ])
    });

    var cbcuentas = new Ext.form.ComboBox({
        id: 'cbcuenta',
        emptyText: 'Cuenta...',
        fieldLabel: 'Cuenta',
        editable: true,
        forceSelection: true,
        store: stcuenta,
        disabled: true,
        valueField: 'idcuenta',
        displayField: 'clavedescripcion',
        hiddenName: 'idcuenta',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '80%',
        width: 100,
        allowBlank: false,
        blankText: "Este campo es obligatorio.",
        maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
        listeners: {
            keydown: function(t, e) {
                if ((e.getKey() != 8) && (e.getKey() != 46))
                    e.stopEvent();
                else
                    t.clearValue();
            },
            specialKey: function(t, e) {
                if (e.getKey() == e.ENTER)
                    Submayorcliente();
                //Filtrar(tfnro.getValue(),dfecha.getValue(),cmbCliente.getValue(),cmbTins.getValue());
            }
        }
    });

    var cbMoneda = new Ext.form.ComboBox({
        id: 'cbmoneda',
        emptyText: 'Moneda...',
        fieldLabel: 'Moneda',
        forceSelection: true,
        editable: true,
        store: stmoneda,
        disabled: false,
        valueField: 'idnommonedaentidad',
        displayField: 'codigoiso',
        hiddenName: 'idnommonedaentidad',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '80%',
        maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/
    });

    var cbcliente = new Ext.form.ComboBox({
        id: 'cbcliente',
        emptyText: 'Deudor...',
        forceSelection: true,
        fieldLabel: 'Deudor',
        store: stcliente,
        disabled: true,
        editable: true,
        valueField: 'idcliente',
        displayField: 'cliente',
        hiddenName: 'idcliente',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '80%',
        maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/
    });

    var cbproveedor = new Ext.form.ComboBox({
        id: 'cbprovedor',
        emptyText: 'Acreedor...',
        forceSelection: true,
        fieldLabel: 'Acreedor',
        store: stcliente,
        disabled: true,
        editable: true,
        valueField: 'idcliente',
        displayField: 'cliente',
        hiddenName: 'idcliente',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '80%',
        maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/
    });

// panel datos de la cuenta
    var pdatos = new Ext.FormPanel({
        frame: true,
        region: 'north',
        bodyStyle: 'padding:0px 0px 0px 10px ',
        height: 155,
        width: 600,
        labelWidth: 60,
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .45,
                        layout: 'form',
                        anchor: '0%',
                        style: 'margin:10 0 0 0',
                        buttonAlign: "left",
                        items: [cbMoneda, cbcuentas, cbcliente, cbproveedor]
                    }, {
                        columnWidth: .30,
                        layout: 'form',
                        items: [{
                                xtype: 'fieldset',
                                title: 'Per&iacute;odo',
                                autoHeight: true,
                                anchor: '100%',
                                items: [dfDesde, dfHasta]
                            }]
                    }, {
                        columnWidth: .15,
                        layout: 'form',
                        items: [{
                                xtype: 'fieldset',
                                title: 'Saldo total',
                                style: 'margin:39 0 0 5',
                                autoHeight: true,
                                anchor: '95%',
                                items: [lbTotal]
                            }]
                    }]
            }],
        tbar: [
            derechocobro, new Ext.Toolbar.TextItem('Cuentas por cobrar'), new Ext.Toolbar.Spacer(), new Ext.Toolbar.Spacer(),
            obligacionpago, new Ext.Toolbar.TextItem('Cuentas por pagar'), new Ext.Toolbar.Spacer(), new Ext.Toolbar.Spacer(),
            cobroanticipado, new Ext.Toolbar.TextItem('Cobro anticipado'), new Ext.Toolbar.Spacer(), new Ext.Toolbar.Spacer(),
            pagoanticipado, new Ext.Toolbar.TextItem('Pago anticipado')
        ]
    });

//activar o desactivar el boton calcular submayor segun la seleccion del combox cuenta
    cbcuentas.on('select', function() {
        fechai = dfDesde.getEl().getValue();
        fechaf = dfHasta.getEl().getValue();
        validarform(fechai, fechaf);

        dfDesde.setDisabled(false);
        dfHasta.setDisabled(false);
        switch (tipo) {
            case 1:
                cbcliente.setDisabled(false);
                stcliente.reload({
                    params: {
                        idtipo: derechocobro.getId(),
                        idcuenta: cbcuentas.getValue()
                    }
                });
                lMask.hide();
                break;
            case 2:
                cbproveedor.setDisabled(false);
                stcliente.reload({
                    params: {
                        idtipo: obligacionpago.getId(),
                        idcuenta: cbcuentas.getValue()
                    }
                });
                lMask.hide();
                break;
            case 3:
                cbcliente.setDisabled(false);
                stcliente.reload({
                    params: {
                        idtipo: cobroanticipado.getId(),
                        idcuenta: cbcuentas.getValue()
                    }
                });
                lMask.hide();
                break;
            case 4:
                cbproveedor.setDisabled(false);
                stcliente.reload({
                    params: {
                        idtipo: pagoanticipado.getId(),
                        idcuenta: cbcuentas.getValue()
                    }
                });
                lMask.hide();
                break;
        }
    });

    dfHasta.on('blur', function() {
        fechai = dfDesde.getEl().getValue();
        fechaf = dfHasta.getEl().getValue();
        validarform(fechai, fechaf);
    });

    dfDesde.on('blur', function() {
        fechai = dfDesde.getEl().getValue();
        fechaf = dfHasta.getEl().getValue();
        validarform(fechai, fechaf);
    });

    dfDesde.on('keyup', function() {
        if (Ext.EventObject.getKey() == 8 || Ext.EventObject.getKey() == 46) {
            dfHasta.setMinValue(null);
            dfDesde.reset();
        }
    });

    dfHasta.on('keyup', function() {
        if (Ext.EventObject.getKey() == 8 || Ext.EventObject.getKey() == 46) {
            dfDesde.setMaxValue(null);
            dfHasta.reset();
        }
    });


    function validarform(fechai, fechaf)
    {
        if (fechai && !fechaf) {
            dfHasta.markInvalid();
            btnCalcSbm.setDisabled(true);
            return false;
        }
        else if (!fechai && fechaf) {
            dfDesde.markInvalid();
            btnCalcSbm.setDisabled(true);
            return false;
        }
        else if (cbcuentas.getEl().getValue() != 'Cuenta...' && cbcuentas.getEl().getValue() != '') {
            dfHasta.clearInvalid();
            dfDesde.clearInvalid();
            btnCalcSbm.setDisabled(false);
            return true;
        }
        else {
            btnCalcSbm.setDisabled(true);
            return false;
        }
    }

    function Submayorcliente()
    {
        //lMask.show();
        var cta = cbcuentas.getValue();
        if (tipo == 1 || tipo == 3) {
            var cliente = cbcliente.getValue();
        } else {
            var cliente = cbproveedor.getValue();
        }

        var moneda = cbMoneda.getValue();
        var fechai = dfDesde.getEl().getValue();
        var fechaf = dfHasta.getEl().getValue();
        //stsubmayor.baseParams = {cuenta:cta,moneda:moneda,cliente:cliente,fechai:fechai,fechaf:fechaf};
        stsubmayor.load({
            params: {
                cuenta: cta,
                moneda: moneda,
                cliente: cliente,
                fechai: fechai,
                fechaf: fechaf,
                tipo: tipo
            }/*,
             callback: function(r, options, success){
             lMask.hide();
             }*/
        });
        obtenerTotal(cta, moneda, cliente, fechai, fechaf);
    }

    function obtenerTotal(cuenta, moneda, cliente, fechai, fechaf)
    {
        //Busco el total de Submayor
        Ext.Ajax.request({
            url: 'TotalSubmayor',
            params: {
                cuenta: cuenta,
                cliente: cliente,
                moneda: moneda,
                fechai: fechai,
                fechaf: fechaf,
                tipo: tipo
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData)
                {
                    lbTotal.setText(responseData);
                }
            }
        });
    }

//El reader del grid
    var rdsubmayor = new Ext.data.JsonReader({
        root: 'campos',
        totalProperty: 'cantidad',
        id: 'numerodocumento'
    }, [{
            name: 'id'
        }, {
            name: 'numero'
        }, {
            name: 'comprobante'
        }, {
            name: 'fecha'
        }, {
            name: 'comentario'
        }, {
            name: 'debe'
        }, {
            name: 'haber'
        }, {
            name: 'saldo'
        }, {
            name: 'clienteprov'
        }, {
            name: 'color'
        }
    ]);

//Store del grid
    var stsubmayor = new Ext.data.GroupingStore({
        url: 'cargarsubmy',
        reader: rdsubmayor,
        sortInfo: {
            field: 'id',
            direction: "ASC"
        },
        groupField: 'clienteprov',
        listeners: {
            clear: function(store) {
                arrayData = [];
                btnImprimirSubmCP.disable();
            }
        }
    });

    stsubmayor.on('datachanged', function() {
        arrayData = []; //limpiando el array para el reporte
        if (!stsubmayor.getCount()) {
            mostrarMensaje(1, 'No existen resultados para mostrar.');
            btnImprimirSubmCP.disable();
        }
        else {
            btnImprimirSubmCP.enable();
            lbInformacion.setText('Se encontraron ' + stsubmayor.getTotalCount() + ' registros.');
        }
    });

// (seleccion simple)
    var smsubmayor = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    var gpsubmayor = new Ext.grid.GridPanel({
        store: stsubmayor,
        region: 'center',
        sm: smsubmayor,
        autoExpandColumn: 'comentario',
        loadMask: [{
                store: stsubmayor,
                msg: 'Cargando Datos...'
            }],
        columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'id'
            }, {
                id: 'numero',
                header: 'No. documento',
                dataIndex: 'numero',
                sortable: true,
                renderer: function(value, attr, record) {
                    arrayData.push(record.json);
                    return value;
                }
            }, {
                id: 'comprobante',
                header: 'No. comprobante',
                dataIndex: 'comprobante',
                sortable: true
            }, {
                id: 'fecha',
                header: 'Fecha',
                dataIndex: 'fecha',
                renderer: 'erpFecha',
                sortable: true
            }, {
                id: 'comentario',
                header: 'Comentario',
                dataIndex: 'comentario',
                sortable: true
            }, {
                id: 'debe',
                header: 'Debe',
                dataIndex: 'debe',
                align: 'right',
                sortable: true,
                renderer: formatoMoneda
            }, {
                id: 'haber',
                header: 'Haber',
                dataIndex: 'haber',
                align: 'right',
                sortable: true,
                renderer: formatoMoneda
            }, {
                id: 'saldo',
                header: 'Saldo',
                align: 'right',
                renderer: formatoMoneda, //Ext.util.Format.erpMoneyParentesis,
                dataIndex: 'saldo',
                sortable: true
            }, {
                id: 'Deudor/Acreedor',
                hidden: true,
                header: denomcolumna,
                dataIndex: 'clienteprov',
                sortable: true

            }, {
                id: 'color',
                hidden: true,
                header: 'Color',
                dataIndex: 'color',
                sortable: true
            }],
        bbar: new Ext.Toolbar({
            autoHeight: true,
            items: [{
                    xtype: 'tbspacer'
                }, {
                    xtype: 'tbspacer'
                }, {
                    xtype: 'tbspacer'
                }, {
                    xtype: 'tbspacer'
                }, lbInformacion]
        }),
        view: new Ext.grid.GroupingView({
            forceFit: true,
            ShowGroupName: true,
            enableNoGroup: false,
            enableGropingMenu: false,
            hideGroupedColumn: false,
            groupTextTpl: '{text} ({[values.rs.length]} {["en total"]})'
        }),
        frame: false,
        collapsible: true,
        animCollapse: false
    });

//pintar las filas de los subtotales
    gpsubmayor.getView().getRowClass = function(record, index, rowParams, store) {
        if (record.data.color == 1)
            return 'FilaSubtotal';
    };

//crear elpanel
    p = new Ext.Panel({
        layout: 'border',
        height: 115,
        width: 600,
        title: 'Submayor deudor acreedor',
        items: [pdatos, gpsubmayor],
        tbar: [btnCalcSbm, btnImprimirSubmCP, '->', btnAyuda]

    });

// ----------------Ventana principal-----------------------//
    var vpCasoUso = new Ext.Viewport({
        id: 'id',
        renderTo: document.body,
        layout: 'fit',
        items: p
    });

    function FnMostrarWinReporte() {
        var v_identidad;
        var v_idsubsistema;
        var v_idusuario;

        Ext.Ajax.request({
            url: 'obtenerdatosglobales',
            method: 'POST',
            callback: function(options, success, response)
            {
                responseData = Ext.decode(response.responseText);
                v_identidad = responseData.estructura;
                v_idsubsistema = responseData.subsistema;
                v_idusuario = responseData.usuario;
            }
        });

        //----------------------------------------------------------------------------------------------------------------------
        //Store para cargar los formatos de los reportes	
        var strFormatoReporte = new Ext.data.Store({
            url: 'obtenerformatodocumento',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'strFormatoReporte'
            }, [{
                    name: 'idformat'
                }, {
                    name: 'format'
                }
            ])
        });

        //Combo para cargar los formatos de los reportes
        var cmbFormatoReporte = new Ext.form.ComboBox({
            id: 'cmbFormatoReporte',
            store: strFormatoReporte,
            fieldLabel: 'Formato Reporte',
            displayField: 'format',
            hiddenName: 'idformat',
            valueField: 'idformat',
            //listWidth: 215,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: false,
            selectOnFocus: true,
            anchor: '90%'
        });

//cmbFormatoReporte.setDisabled(true);
        /*Ventana para escoger el formato*/
// Formulario de los reportes	
        formulario = new Ext.FormPanel({
            labelAlign: 'top',
            autoHeight: true,
            // width:600,
            frame: true,
            items: [cmbFormatoReporte]

        });

        if (!winReporte)
            winReporte = new Ext.Window({
                modal: true,
                closeAction: 'hide',
                layout: 'fit',
                resizable: false,
                width: 300,
                title: 'Par' + String.fromCharCode(225) + 'metros',
                items: [formulario],
                listeners: {/*hide:function(){
						cmbFormatoReporte.reset();
						cmbReportes.reset();
					}, beforehide :function(){
						ClearAllCancelar();
					}*/},
                buttons: [{
                        id: 'idbtnCancelar',
//                        icon: perfil.dirImg + 'cancelar.png',
                        iconCls: 'cancelar',
                        text: 'Cancelar',
                        handler: function() {
                            winReporte.hide();
                            cmbFormatoReporte.reset();
                        }
                    }, {
                        id: 'idbtnAceptar',
//                        icon: perfil.dirImg + 'aceptar.png',
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        handler: function() {
                            FnMostrarReporte();
                        }
                    }]
            });
        winReporte.show();

        function FnMostrarReporte() {
            var v_formato = cmbFormatoReporte.getRawValue();
            var v_urlreporte;
            var v_fechainicio = 'null';
            var v_fechafin = 'null';
            var v_idcliente = 'null';
            var v_idProveedor = 'null';
            var v_idmoneda = 'null';
            ;
            var v_idcuenta = cbcuentas.getValue();

            /*Le asigno el valor escogido, en caso que este vacia se quedan con null*/
            if (dfDesde.getRawValue())
                v_fechainicio = dfDesde.getRawValue();
            if (dfHasta.getRawValue())
                v_fechafin = dfHasta.getRawValue();
            if (cbcliente.getValue())
                v_idcliente = cbcliente.getValue();
            if (cbproveedor.getValue())
                v_idProveedor = cbproveedor.getValue();
            if (cbMoneda.getValue())
                v_idmoneda = cbMoneda.getValue();

            var v_parametros = [];

            if (cmbFormatoReporte.getRawValue())
            {
                switch (tipo) {
                    case 1:
                        {	//Derechos de cobro
                            //Los par�metros son en el mismo orden que en la funci�n de BD
                            v_parametros.push(v_idmoneda);
                            v_parametros.push(v_idcuenta);
                            v_parametros.push(v_idcliente);
                            v_parametros.push(v_fechainicio);
                            v_parametros.push(v_fechafin);
                            v_parametros.push(v_identidad);
                            v_parametros.push(v_idusuario);
                            v_temp = Ext.encode(v_parametros);

                            if (cbcliente.getValue())
                                v_urlreporte = v_reportes[0].reportes[0].url + '&pvalues=' + v_temp + '&format=' + v_formato;

                            else
                                v_urlreporte = v_reportes[0].reportes[7].url + '&pvalues=' + v_temp + '&format=' + v_formato;
                        }
                        break;

                    case 2:
                        {	//Derechos de cobro
                            //Los par�metros son en el mismo orden que en la funci�n de BD
                            v_parametros.push(v_idmoneda);
                            v_parametros.push(v_idcuenta);
                            v_parametros.push(v_idProveedor);
                            v_parametros.push(v_fechainicio);
                            v_parametros.push(v_fechafin);
                            v_parametros.push(v_identidad);
                            v_parametros.push(v_idusuario);
                            v_temp = Ext.encode(v_parametros);

                            if (cbproveedor.getValue())
                                v_urlreporte = v_reportes[0].reportes[2].url + '&pvalues=' + v_temp + '&format=' + v_formato;
                            else
                                v_urlreporte = v_reportes[0].reportes[1].url + '&pvalues=' + v_temp + '&format=' + v_formato;
                        }
                        break;

                    case 3:
                        {	//Derechos de cobro
                            //Los par�metros son en el mismo orden que en la funci�n de BD
                            v_parametros.push(v_idmoneda);
                            v_parametros.push(v_idcuenta);
                            v_parametros.push(v_idcliente);
                            v_parametros.push(v_fechainicio);
                            v_parametros.push(v_fechafin);
                            v_parametros.push(v_identidad);
                            v_parametros.push(v_idusuario);
                            v_temp = Ext.encode(v_parametros);

                            if (cbcliente.getValue())
                                v_urlreporte = v_reportes[0].reportes[5].url + '&pvalues=' + v_temp + '&format=' + v_formato;

                            else
                                v_urlreporte = v_reportes[0].reportes[3].url + '&pvalues=' + v_temp + '&format=' + v_formato;
                        }
                        break;

                    case 4:
                        {	//Derechos de cobro
                            //Los par�metros son en el mismo orden que en la funci�n de BD
                            v_parametros.push(v_idmoneda);
                            v_parametros.push(v_idcuenta);
                            v_parametros.push(v_idProveedor);
                            v_parametros.push(v_fechainicio);
                            v_parametros.push(v_fechafin);
                            v_parametros.push(v_identidad);
                            v_parametros.push(v_idusuario);
                            v_temp = Ext.encode(v_parametros);

                            if (cbproveedor.getValue())
                                v_urlreporte = v_reportes[0].reportes[6].url + '&pvalues=' + v_temp + '&format=' + v_formato;

                            else
                                v_urlreporte = v_reportes[0].reportes[4].url + '&pvalues=' + v_temp + '&format=' + v_formato;
                        }
                        break;
                }
                //if(formulario.getForm().isValid())
                {
                    var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1;
                    var ventana = window.open(v_urlreporte, 'ventana1', wCfg);
                    //ClearAll();
                }
                cmbFormatoReporte.reset();
            }
            else
                mostrarMensaje(1, "Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).");
        }
    }
    function convertirsaldo(v) {
        if (v == '')
            return '0.00';
        v = (Math.round((v - 0) * 100)) / 100;
        v = (v < 0) ? v * (-1) : v;
        if (isNaN(v))
            return '0.00';
        return v.toFixed(2);
    }
}

cargarInterfaz();

