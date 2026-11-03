Ext.QuickTips.init();
//UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
lMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando datos...'});
var perfil = window.parent.UCID.portal.perfil;
var tipo;
var v_reportes = Array(), winReporte, formulario;

var FechaInicio, FechaFin;

UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
    v_reportes = UCID.portal.getAccionesReportes();
});

/*----------------------------------Buscar fechas del periodo -------------------------------------------------------------*/
CargarFecha();

function CargarFecha() {

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
    var btnCalcSbm = new Ext.Button({
        disabled: true,
        id: 'calcSub',
        hidden: false,
        text: 'Calcular submayor',
        tooltip: 'Calcular submayor',
//        icon: perfil.dirImg + 'calcular.png ',
        iconCls: 'calcular',
        handler: function() {
            Submayorcliente();
            //btnImprimirSubmF.enable();
        }
    });

    var btnImprimirSubmF = new Ext.Button({
        disabled: true,
        //hidden:true,
        id: 'btnImprimirSubmF',
        text: 'Vista previa',
        tooltip: 'Vista previa',
//        icon: perfil.dirImg + 'imprimir.png ',
        iconCls: 'imprimir',
        handler: function() {
            //FnMostrarWinReporte();
            Ext.Ajax.request({
                method: "POST",
                url: 'cargarDatosReporte',
                params: {
                    idReporte: 664,
                    data: Ext.encode(arrayData),
                    moneda: cbMoneda.getRawValue(),
                    cuenta: cbcuentas.getRawValue(),
                    //grouptext: denomcolumna,
                    typetext: textDuo,
                    total: stsubmayor.getAt(0).json.total
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
            var title = 'Fiscales';
            var referencia = 'copa/submayores/fiscales';
            help.show(title, referencia);
        }
    });

    var lbTotal = new Ext.form.Label({
        id: 'saldototal',
        style: 'font-weight:bold;',
        text: '0.00'
    });

    var derechofiscal = new Ext.form.Radio({
        labelSeparator: '',
        id: 'derechofiscal',
        name: 'fav',
        inputValue: 'Cobro fiscal',
        listeners: {
            check: function(radio, checked) {
                if (checked) {
                    textDuo = this.getGroupValue();
                    //denomcolumna = 'Deudor';
                    btnImprimirSubmF.disable();
                }
            }
        }
    });

    var obligacionfiscal = new Ext.form.Radio({
        labelSeparator: '',
        id: 'obligacionfiscal',
        name: 'fav',
        inputValue: 'Pago fiscal',
        listeners: {
            check: function(radio, checked) {
                if (checked) {
                    textDuo = this.getGroupValue();
                    //denomcolumna = 'Proveedor';
                    btnImprimirSubmF.disable();
                }
            }
        }
    });
    derechofiscal.on('check', derechof);
    function derechof(e) {
        if (e.checked) {
            tipo = 1;
            lMask.show();
            lbTotal.setText('0.00');
            stsubmayor.removeAll();
            stcuenta.removeAll();
            cbcuentas.reset();

            cbMoneda.reset();
            dfDesde.reset();
            dfHasta.reset();
            dfHasta.setMaxValue(FechaFin);
            dfHasta.setMinValue(FechaInicio);
            dfDesde.setMaxValue(FechaFin);
            dfDesde.setMinValue(FechaInicio);
            cbcuentas.setDisabled(false);
            dfDesde.setDisabled(false);
            dfHasta.setDisabled(false);
            btnCalcSbm.setDisabled(true);
            stcuenta.reload({
                params: {idtipo: derechofiscal.getId()},
                callback: function(r, options, success) {
                    lMask.hide();
                }
            });
        }
    }

    obligacionfiscal.on('check', obligacionf);
    function obligacionf(e) {
        if (e.checked) {
            tipo = 2;
            lMask.show();
            lbTotal.setText('0.00');
            stsubmayor.removeAll();
            stcuenta.removeAll();
            cbcuentas.reset();
            cbMoneda.reset();
            dfDesde.reset();
            dfHasta.reset();
            dfHasta.setMaxValue(FechaFin);
            dfHasta.setMinValue(FechaInicio);
            dfDesde.setMaxValue(FechaFin);
            dfDesde.setMinValue(FechaInicio);
            cbcuentas.setDisabled(false);
            dfDesde.setDisabled(false);
            dfHasta.setDisabled(false);
            btnCalcSbm.setDisabled(true);
            stcuenta.reload({
                params: {idtipo: obligacionfiscal.getId()},
                callback: function(r, options, success) {
                    lMask.hide();
                }
            });
        }
    }

    var stcuenta = new Ext.data.Store({
        listeners: {load: function() {
                cuentas = stcuenta.getCount();
                if (cuentas == 0) {
                    cbcuentas.disable();
                    mostrarMensaje(1, 'El submayor solicitado no tiene resultados para mostrar.')
                }
            }},
        sortInfo: {field: "clavedescripcion", direction: "ASC"},
        url: 'cargarcuenta',
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
            }])
    });
//stcuenta.load();

//reader y stores de Moneda
    rdmoneda = new Ext.data.JsonReader({
        id: 'idnommonedaentidad'
    }, [{
            name: 'idnommonedaentidad'
        }, {
            name: 'idnommoneda'
        }, {
            name: 'codigoiso'
        }]);

    var stmoneda = new Ext.data.Store({
        url: 'cargarmonedas',
        sortInfo: {field: "codigoiso", direction: "ASC"},
        reader: rdmoneda
    });

    stmoneda.load();

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
        readOnly: true,
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
        readOnly: true,
        maxValue: null,
        minValue: null,
        anchor: '95%',
        enableKeyEvents: true,
        invalidText: 'Este campo es obligatorio.'
    });

    var cbcuentas = new Ext.form.ComboBox({
        emptyText: 'Cuenta...',
        editable: true,
        forceSelection: true,
        fieldLabel: 'Cuenta',
        store: stcuenta,
        disabled: true,
        valueField: 'idcuenta',
        displayField: 'clavedescripcion',
        hiddenName: 'idcuenta',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        allowBlank: false,
        blankText: "Este campo es obligatorio.",
        anchor: '80%',
        width: 100,
        maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/
    });

    var cbMoneda = new Ext.form.ComboBox({
        emptyText: 'Moneda...',
        forceSelection: true,
        fieldLabel: 'Moneda',
        store: stmoneda,
        disabled: false,
        editable: true,
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

//activar o desactivar el boton calcular submayor segun la seleccion del combox cuenta
    cbcuentas.on('select', function() {
        fechai = dfDesde.getEl().getValue();
        fechaf = dfHasta.getEl().getValue();
        validarform(fechai, fechaf);
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
        var cta = cbcuentas.getValue();
        var moneda = cbMoneda.getValue();
        var fechai = dfDesde.getEl().getValue();
        var fechaf = dfHasta.getEl().getValue();
        //stsubmayor.baseParams = {cuenta:cta,moneda:moneda,fechai:fechai,fechaf:fechaf};
        stsubmayor.load({
            params: {
                cuenta: cta,
                moneda: moneda,
                fechai: fechai,
                fechaf: fechaf,
                tipo: tipo,
                start: 0,
                limit: 0
            }/*,
             callback: function(r, options, success){
             lMask.hide();
             }*/
        });
        /* Esto es lo viejo 
         obtenerTotal(cta, moneda, fechai, fechaf); */
    }

    function obtenerTotal(cuenta, moneda, fechai, fechaf)
    {
        //Busco el total de Submayor
        Ext.Ajax.request({
            url: 'TotalSubmayor',
            params: {cuenta: cuenta, moneda: moneda, fechai: fechai, fechaf: fechaf, tipo: tipo},
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData)
                {
                    if (responseData < 0)
                    {
                        var temp = convertirsaldo((-1) * responseData);
                        lbTotal.setText('(' + temp + ')');
                    }
                    else
                        lbTotal.setText(convertirsaldo(responseData));
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
            name: 'fecha'
        }, {
            name: 'comentario'
        }, {
            name: 'debe'
        }, {
            name: 'haber'
        }, {
            name: 'saldo'
        }]);

//Store del grid
    var stsubmayor = new Ext.data.Store({
        url: 'cargarsubmy',
        sortInfo: {field: 'fecha', direction: "ASC"},
        reader: rdsubmayor,
        listeners: {
            clear: function(store) {
                arrayData = [];
                btnImprimirSubmF.disable();
            },
            datachanged: function(store) {
                arrayData = []; //limpiando el array para el reporte
                if (!stsubmayor.getCount()) {
                    mostrarMensaje(1, 'No existen resultados para mostrar.');
                    btnImprimirSubmF.disable();
                } else {
                    btnImprimirSubmF.enable();
                    /* esto es lo nuevo del total */
                    var firstRecord = this.getAt(0);
                    if (firstRecord.json.total < 0) {
                        var temp = convertirsaldo((-1) * firstRecord.json.total);
                        lbTotal.setText('(' + temp + ')');
                    } else {
                        lbTotal.setText(convertirsaldo(firstRecord.json.total));
                    }
                }
            }
        }
    });

// (seleccion simple)
    var smsubmayor = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

// GridPanel 
    var gpsubmayor = new Ext.grid.GridPanel({
        id: 'gpsubmayor',
        store: stsubmayor,
        region: 'center',
        sm: smsubmayor,
        autoExpandColumn: 'comentario',
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
                sortable: true,
                renderer: formatoMoneda
            }, {
                id: 'haber',
                header: 'Haber',
                dataIndex: 'haber',
                sortable: true,
                renderer: formatoMoneda
            }, {
                id: 'saldo',
                header: 'Saldo',
                dataIndex: 'saldo',
                sortable: true,
                renderer: formatoMoneda
            }]/*,
             bbar : new Ext.PagingToolbar({
             pageSize : 10,
             store : stsubmayor,
             displayInfo : true,
             displayMsg : 'Resultados de {0} - {1} de {2}',
             emptyMsg : "No hay resultados para mostrar."
             })*/
    });

// panel datos de la cuenta
    var pdatos = new Ext.FormPanel({
        id: 'pdatos',
        frame: true,
        region: 'north',
        bodyStyle: 'padding:0px 0px 0px 10px ',
        height: 135,
        width: 600,
        //autoWidth: true,
        labelWidth: 60,
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .45,
                        layout: 'form',
                        style: 'margin:10 0 0 0',
                        items: [cbMoneda, cbcuentas]
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
                        columnWidth: .23,
                        layout: 'form',
                        items: [{
                                xtype: 'fieldset',
                                title: 'Saldo total',
                                autoHeight: true,
                                style: 'margin:39 0 0 5',
                                anchor: '95%',
                                items: [lbTotal]
                            }]
                    }]
            }],
        tbar: [
            derechofiscal, new Ext.Toolbar.TextItem('Cobro fiscal'), new Ext.Toolbar.Spacer(), new Ext.Toolbar.Spacer(),
            obligacionfiscal, new Ext.Toolbar.TextItem('Pago fiscal')
        ]
    });

    p = new Ext.Panel({
        layout: 'border',
        //region: 'north',
        height: 115,
        width: 600,
        //autoWidth: true,
        title: 'Submayor Fiscal',
        items: [pdatos, gpsubmayor],
        tbar: [btnCalcSbm, btnImprimirSubmF, '->', btnAyuda]
    });

//----------------Ventana principal-----------------------//
    var vpCasoUso = new Ext.Viewport({
        id: 'id',
        //renderTo: document.body,
        layout: 'fit',
        items: [p]
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
            },
            [
                {name: 'idformat'},
                {name: 'format'}
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
                buttons: [
                    {id: 'idbtnCancelar',
                        //icon: perfil.dirImg + 'cancelar.png', 
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
                    }
                ]
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
            var v_idcuenta = cbcuentas.getValue();

            /*Le asigno el valor escogido, en caso que este vacia se quedan con null*/
            if (dfDesde.getRawValue())
                v_fechainicio = dfDesde.getRawValue();
            if (dfHasta.getRawValue())
                v_fechafin = dfHasta.getRawValue();

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
                            v_urlreporte = v_reportes[0].reportes[1].url + '&pvalues=' + v_temp + '&format=' + v_formato;
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
                            v_urlreporte = v_reportes[0].reportes[0].url + '&pvalues=' + v_temp + '&format=' + v_formato;
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
                mostrarMensaje(3, "Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).");
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