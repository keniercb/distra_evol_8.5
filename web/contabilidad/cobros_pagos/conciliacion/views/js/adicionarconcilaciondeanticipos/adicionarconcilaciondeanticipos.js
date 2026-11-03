Ext.QuickTips.init();
UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();
var maskguardandoconc;
var btnaplic, btnbuscar, btncancelar, btnaceptar;
var tfnoinst, tffecha, tfimporte, tfmoneda;
var dfdesde, dfhasta, dffecha;
var chbxcancel, chbxcoincide;
var buscaranticipo;
var labelcl;
var smaddconc, grdaddconc;
var idfuncionalidad = window.parent.idFuncionalidad;
var tipo; //tipo =1 si es un cobro y tipo = 2 si es un pago
var band;
var contMask = 0;
function cargarInterfaz() {
    Ext.Msg.wait('Cargando...', 'Por favor espere...');
    new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'h',
            alt: true,
            fn: function() {
                btnAyuda.handler.call();
            }
        },
        {
            key: 'b',
            alt: true,
            fn: function() {
                if (!btnbuscar.disable)
                    btnbuscar.handler.call();
            }
        }
    ]);

    maskguardandoconc = new Ext.LoadMask(Ext.getBody(), {msg: 'Guardando...'});
    maskCargar = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando...'});
    band = false;

    var btnAyuda = new Ext.Button({
        id: 'btnAyu',
//        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: 'Ayuda',
        tooltip: "Mostrar ayuda de la funcionalidad (<b>Alt</b> + <b>H</b>)",
        handler: function() {
            var titulo = 'Mostrar ayuda de la funcionalidad';
            var direccion = 'copa/conciliacion/anticipos';
            help.show(titulo, direccion);
        }
    });

    btnaplic = new Ext.Button({
        disabled: true,
        id: 'btnadicionar',
//        icon: perfil.dirImg + 'confirmar.png',
        iconCls: 'confirmar',
        text: 'Confirmar',
        tooltip: 'Confirmar',
        handler: function() {
            aplicar();
        }
    });

    btnbuscar = new Ext.Button({
        id: 'btnbuscar',
        tooltip: 'Buscar anticipos (<b>Alt</b> + <b>B</b>)',
        disabled: true,
//        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'buscar',
        text: 'Buscar',
        handler: function() {
            buscarantbtn();
            btnaplic.setDisabled(true);
        }
    });

    btncancelar = new Ext.Button({
        id: 'btncancelar',
//        icon: perfil.dirImg + 'cancelar.png',
        tooltip: 'Cerrar interfaz y cancelar la operaci&oacute;n',
        iconCls: 'cancelar',
        text: 'Cancelar',
        handler: function() {
            window.parent.Ext.getCmp('win' + idfuncionalidad).close();
            vpconciliacion.hide();
            cbxcliente.reset();
            cbxtipodoc.reset();
            dfdesde.reset();
            dfhasta.reset();
        }
    });

    btnaceptar = new Ext.Button({
        disabled: true,
        hidden: false,
        id: 'btnaceptar',
        tooltip: 'Guardar datos y limpiar los campos',
//        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        text: 'Aceptar',
        handler: function() {
            guardarconciliaciones();
        }
    });

    tfnoinst = new Ext.form.TextField({
        fieldLabel: 'N&uacute;mero',
        disabled: true,
        name: 'tfnoinst',
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        width: 150
    });

    tffecha = new Ext.form.DateField({
        disabledClass: 'disabled-component',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        editable: true,
        selectOnFocus: true,
        ReadOnly: false,
        fieldLabel: 'Fecha',
        disabled: true,
        name: 'tffecha',
        width: 150,
        format: 'd/m/Y'
    });

    tfimporte = new Ext.form.TextField({
        fieldLabel: 'Importe',
        disabled: true,
        name: 'tfimporte',
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        width: 85
    });

    tfmoneda = new Ext.form.TextField({
        fieldLabel: 'Moneda',
        disabled: true,
        name: 'tfmoneda',
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        width: 85
    });

    dfdesde = new Ext.form.DateField({
        disabledClass: 'disabled-component',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        editable: true,
        selectOnFocus: true,
        readOnly: false,
        fieldLabel: 'Desde',
        allowBlank: true,
        name: 'dfdesde',
        width: 150,
        format: 'd/m/Y',
        maxValue: null,
        minValue: null,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.'
    });

    dfhasta = new Ext.form.DateField({
        disabledClass: 'disabled-component',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        editable: true,
        selectOnFocus: true,
        readOnly: false,
        fieldLabel: 'Hasta',
        allowBlank: true,
        name: 'dfhasta',
        width: 150,
        format: 'd/m/Y',
        maxValue: null,
        minValue: null,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.'
    });

    dffecha = new Ext.form.DateField({
        disabledClass: 'disabled-component',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        editable: true,
        selectOnFocus: true,
        readOnly: false,
        fieldLabel: 'Fecha',
        allowBlank: false,
        name: 'dffecha',
        width: 150,
        format: 'd/m/Y',
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.'
    });

    chbxcancel = new Ext.form.Checkbox({
        boxLabel: 'Cancelar',
        disabled: true,
        hideLabel: true,
        inputValue: 'recibido'
    });

    chbxcoincide = new Ext.form.Checkbox({
        boxLabel: 'Coincide',
        disabled: true,
        hideLabel: true,
        inputValue: 'recibido'
    });

    dfdesde.on('change', function() {
        dfhasta.setMinValue(dfdesde.getRawValue());
    });
    dfdesde.on('valid', function() {
        dfhasta.setMinValue(dfdesde.getRawValue());
        if (dfdesde.getRawValue() != '') {
            dfhasta.enable();
        }
    });
    dfhasta.on('change', function() {
        dfdesde.setMaxValue(dfhasta.getRawValue());
    });

    //*********************combobox****************************\\
    var jsoncliente = new Ext.data.JsonReader({
        //root : 'nom',
        id: 'idclien'
    }, [{name: 'idestructuracliente'},
        {name: 'nombre'},
        {name: 'text'},
        {name: 'codigo'}
    ]);

    var stcliente = new Ext.data.Store({
        url: 'cargarcbcliente',
        reader: jsoncliente
    });

    var cbxcliente = new Ext.form.ComboBox({
        fieldLabel: 'Deudor/Acreedor',
        mode: 'local',
        width: 280,
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        hiddenName: 'idestructuracliente',
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.',
        emptyText: 'Seleccione...',
        readOnly: false,
        editable: true,
        //typeAhead : true,	      
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
        store: stcliente,
        valueField: 'idestructuracliente',
        displayField: 'text',
        forceSelection: true,
        triggerAction: 'all',
        listeners: {
            select: function() {
                btnbuscar.enable();
//                Ext.getCmp('btnbuscar').enable();
            }
        }
    });

    cbxcliente.disable();

    var jsontipodoc = new Ext.data.JsonReader({
        root: 'idtipod',
        id: 'idtipo'
    }, [{name: 'idtipo', mapping: 'idtipooperacion'},
        {name: 'descripcion'}
    ]);

    var sttipodoc = new Ext.data.Store({
        url: 'cargarcbtipodoc',
        reader: jsontipodoc
    });

    //maskCargar.show();
    sttipodoc.load(/*{
     callback: function(options, success, response){
     //contMask ++;
     maskCargar.hide();
     }
     }*/);

    var cbxtipodoc = new Ext.form.ComboBox({
        fieldLabel: 'Documento de:',
        mode: 'local',
        hiddenName: 'idtipo',
        width: 250,
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        allowBlank: false,
        readOnly: false,
        editable: true,
        //typeAhead : true,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.',
        emptyText: 'Seleccione...',
        store: sttipodoc,
        valueField: 'idtipo',
        displayField: 'descripcion',
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
        forceSelection: true,
        triggerAction: 'all',
        listeners: {
            select: function() {
                btnbuscar.disable();
            }//,
            /*load: function(){
             contMask++;
             //if(contMask == 2)
             //quita la mascara
             maskguardandoconc.hide();
             }*/
        }
    });

    var jsonaddconc = new Ext.data.JsonReader({
        root: 'grid',
        id: 'numero',
        totalProperty: 'totalRecords'
    }, [{name: 'idanticipo'},
        {name: 'numero'},
        {name: 'fecha'},
        {name: 'moneda'},
        {name: 'importe'},
        {name: 'coincide'},
        {name: 'operacion'}
    ]
            );

    var staddconc = new Ext.data.Store({
        url: 'cargargridanticipo',
        listeners: {
            load: function() {
                if (staddconc.getTotalCount() == 0)
                {
                    if (tipo == 1)
                        mostrarMensaje(1, "No existen cobros anticipados posibles a conciliar.");
                    else
                        mostrarMensaje(1, "No existen pagos anticipados posibles a conciliar.");
                }
            }
        },
        reader: jsonaddconc
    });

    staddconc.on('load', function() {
        //si no hay nada seleccionado 
        //y carga valores selecciona la primera fila
        if (staddconc.getTotalCount() == 0)
            mostrarMensaje(1, 'No se encontraron resultados.');
    });

    smaddconc = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    var fieldset = new Ext.FormPanel({
        frame: true,
        region: 'south',
        height: 180,
        items: [{
                title: 'Datos',
                layout: 'column',
                xtype: 'fieldset',
                autoHeight: true,
                autoWidth: true,
                labelAlign: 'top',
                items: [{
                        style: 'margin:15 0 0 0',
                        labelWidth: 50,
                        layout: 'form',
                        items: [tfnoinst]
                    }, {
                        style: 'margin:15 0 0 10',
                        labelWidth: 35,
                        layout: 'form',
                        items: [tffecha]
                    }, {
                        style: 'margin:15 0 0 10',
                        labelWidth: 43,
                        layout: 'form',
                        items: [tfmoneda]
                    }, {
                        style: 'margin:15 0 0 10',
                        labelWidth: 50,
                        layout: 'form',
                        items: [tfimporte]
                    }, {
                        items: [{
                                xtype: 'fieldset',
                                title: 'Conciliar',
                                style: 'margin:0 0 0 10',
                                autoHeight: true,
                                width: 210,
                                layout: 'column',
                                items: [{
                                        style: 'margin:0 0 0 0',
                                        layout: 'form',
                                        labelWidth: 50,
                                        columnWidth: .4,
                                        items: [chbxcoincide]
                                    }, {
                                        style: 'margin:0 0 0 30',
                                        layout: 'form',
                                        columnWidth: .6,
                                        items: [chbxcancel]
                                    }]
                            }, {
                                style: 'margin:5 0 0 134',
                                items: [btnaplic]
                            }]
                    }],
                buttons: [btncancelar, btnaceptar]
            }]
    });

    var grdaddconc = new Ext.grid.GridPanel({
        frame: false,
        border: false,
        loadMask: true,
        iconCls: 'icon-grid',
        //region: 'center',
        autoExpandColumn: 'oper',
        store: staddconc,
        //style: 'margin: 0 10 0 10 ',
        //width:51`0,
        height: Ext.lib.Dom.getViewHeight() - 240,
        //height:230 ,
        sm: smaddconc,
        columns: [
            {id: 'numero', header: 'N&uacute;mero', sortable: true, dataIndex: 'numero', width: 100},
            {id: 'fecha', header: 'Fecha', sortable: true, dataIndex: 'fecha', width: 100, renderer: 'erpFecha', align: 'center'},
            {id: 'moneda', header: 'Moneda', sortable: true, dataIndex: 'moneda', width: 100, align: 'center'},
            {id: 'importe', header: 'Importe', sortable: true, dataIndex: 'importe', width: 200, align: 'right', renderer: formatoMonedaABS},
            {id: 'coincide', header: 'Coincide', sortable: true, dataIndex: 'coincide', width: 80, align: 'center'},
            {id: 'oper', header: 'Operaci&oacute;n', sortable: true, dataIndex: 'oper', width: 200}
        ],
        tbar: [
            'Deudor/Acreedor:', cbxcliente, '-', '-',
            'Desde:', dfdesde, '-', '-',
            'Hasta:', dfhasta, '-', '-', btnbuscar//, '->'
        ]
    });

    cbxtipodoc.on('select', function(t) {
        maskCargar.show();
        cbxcliente.disable();
        cbxcliente.clearValue();
        stcliente.removeAll();
        //    if (cbxtipodoc.getValue() == 1){
        //        tipo = 1;
        //        grdaddconc.getTopToolbar().items.itemAt(2).getEl().innerHTML = 'Deudor: ';
        //    }	
        //    else {	
        //        tipo = 2;
        //        grdaddconc.getTopToolbar().items.itemAt(2).getEl().innerHTML = 'Acreedor: ';
        //    }	

        stcliente.load({
            params: {
                idtipo: cbxtipodoc.getValue()
            },
            callback: function(options, success, response) {
                maskCargar.hide();
                if (stcliente.getCount() > 0)
                    cbxcliente.enable();
                else
                {
                    if (cbxtipodoc.getValue() == 1)
                        mostrarMensaje(1, "No existen cobros anticipados registrados en el sistema.");
                    else
                        mostrarMensaje(1, "No existen pagos anticipados registrados en el sistema.");
                }
            }
        });
    });

    function buscarfecha()
    {
        dffecha.disable();
        Ext.Ajax.request({
            url: 'buscarfechacontable',
            callback: function(options, success, response) {
                btncancelar.focus();
                responseData = Ext.decode(response.responseText);
                dffecha.setRawValue(responseData.fecha);
                if (responseData.fecha)
                {
                    Ext.Msg.hide();
                    dffecha.setMaxValue(responseData.fechamax);
                    dffecha.setMinValue(responseData.fechai);
                    //dffecha.setValue(responseData.fecha);
                    dffecha.enable();
                }
                /*contMask++;
                 if(contMask == 2)
                 maskCargar.hide();*/
            }
        });
    }

    buscarfecha();

    buscaranticipo = new Ext.FormPanel({
        frame: true,
        items: [{
                layout: 'column',
                labelAlign: 'top',
                items: [{
                        style: 'margin:5 0 0 10',
                        layout: 'form',
                        items: [cbxcliente, cbxtipodoc]
                    }, {
                        style: 'margin:5 0 0 15',
                        layout: 'form',
                        items: [dfdesde, dfhasta]
                    }]
            }]
    });
    // ---------------------Vista---------------------------
    var pconcanticipo = new Ext.Panel({
        //title: 'Adicionar conciliaci&oacute;n de anticipo',
        //layout: 'border',
        region: 'center',
        border: false,
        frame: false,
        //items: [grdaddconc, fieldset],
        tbar: ['Documento de:', cbxtipodoc, '->', 'Fecha:', dffecha, '-', '-', btnAyuda],
        items: [grdaddconc]
                //buttons: [btncancelar, btnaceptar]
    });

    var vpconciliacion = new Ext.Viewport
            ({
                id: 'viewport',
                layout: 'border',
                items: [pconcanticipo/*, grdaddconc*/, fieldset]
            });

    //para resetear el gridd
    btnbuscar.on('click', limpiar);
    function limpiar(c) {
        if (c.click) {
            grdaddconc.reset();
        }
    }

    //escojer la fecha de la conciliacion
    dffecha.on('focus', fecha);
    function fecha(c) {
        if (c.validate) {
            //btnbuscar.setDisabled(false);
            //btnaceptar.setDisabled(false);
        }
    }

    //el checkbox coincide
    chbxcoincide.on('check', activarcamplazo);
    function activarcamplazo(c) {
        if (c.checked) {
            chbxcancel.setDisabled(true);
            chbxcancel.reset();
        } else {
            chbxcancel.setDisabled(false);
        }
    }

    //seleccionar una fila del grid
    grdaddconc.on('click', select);
    function select() {
        if (smaddconc.getSelected()) {
            //btnaceptar.enable();
            btnaplic.enable();
            //btnaceptar.enable();
            chbxcoincide.enable();
            chbxcancel.enable();
            chbxcancel.reset();
            chbxcoincide.reset();
            tfnoinst.setValue(smaddconc.getSelected().get('numero'));
            tffecha.setValue(smaddconc.getSelected().data.fecha);
            tfmoneda.setValue(smaddconc.getSelected().get('moneda'));
            tfimporte.setValue(convertirsaldo(smaddconc.getSelected().get('importe')));
        }
    }

    //boton aplicar
    function aplicar() {
        if (chbxcoincide.checked) {
            smaddconc.getSelected().set('coincide', 'Si');
            smaddconc.getSelected().set('oper', '');
        } else {
            smaddconc.getSelected().set('coincide', 'No');
            if (chbxcancel.checked) {
                smaddconc.getSelected().set('oper', 'Cancelar');
            } else {
                smaddconc.getSelected().set('oper', '');
            }
        }
        btnaceptar.enable();
    }

    //Guardar las conciliaciones
    function guardarconciliaciones()
    {
        var flag = false;
        /*for (i = 0; i < staddconc.getCount(); i++) {
         if (staddconc.getAt(i).data.coincide == '') {
         mostrarMensaje(1, 'Faltan datos por registrar.');
         flag = true;
         break;
         }
         }*/

        if (dffecha.isValid()) {
            if (flag == false) {
                //maskguardandoconc.show();
                Ext.Msg.wait('Guardando datos del anticipo.', 'Por favor erpere...');
                Ext.Ajax.request({
                    url: 'adicionarconciliaciona',
                    method: 'POST',
                    params: {
                        fecha: dffecha.getRawValue(),
                        select: Ext.encode(arrayrecord())
                    },
                    callback: function(options, success, response)
                    {
                        Ext.Msg.hide();
                        responseData = Ext.decode(response.responseText);
                        if(responseData.codM == 3) 
                            mostrarMensaje(1, responseData.mensaje, function(){});
                        /* Nuevo lo del Reporte */
                        else
                            reporte();
                        /*FIN NUEVO */
                        
                        cbxtipodoc.reset();
                        cbxcliente.reset();
                        dfdesde.reset();
                        dfhasta.reset();
                        cbxcliente.disable();
                        btnbuscar.disable();
                        maskguardandoconc.hide();
                        staddconc.removeAll();
                        btnaceptar.disable();
                        btnaplic.disable();
                        //dffecha.reset();
                        tfnoinst.reset();
                        tffecha.reset();
                        tfimporte.reset();
                        tfmoneda.reset();
                        chbxcoincide.reset();
                        chbxcoincide.disable();
                        chbxcancel.reset();
                        chbxcancel.disable();
                    }
                });
            }
        }
        else
            mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
    }

    function EnviarAContabilizar(numerodoc)
    {
        Ext.Ajax.request({
            url: 'contabilizar',
            params: {
                iddocumento: numerodoc
            },
            method: 'POST',
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                mostrarMensaje(responseData);
            }
        });
    }

    function reporte() {
        var arrayData = arrayrecord(true);
        cliente = -1;
        stcliente.each(function(record) {
            if (record.json.idestructuracliente === cbxcliente.getValue()) {
                cliente = record.json;
                return false;
            }
        });
        Ext.Ajax.request({
            method: "POST",
            url: 'cargarDatosReporte',
            params: {
//                periodo: periodo,
//                fechacontable: fechacontable,
//                estructura: estructura,
                codigocliente: (cliente !== -1) ? cliente.codigo : "",
                cliente: (cliente !== -1) ? cliente.nombre : "",
                idReporte: (cbxtipodoc.getValue() == '1') ? 680 : 681,
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

    //funcion para el guardar
    function arrayrecord(includeAll) {
        var records = new Array();
        var j = 0;
        for (var i = 0; i < staddconc.getCount(); i++) {
            if (includeAll) {
                records[j] = staddconc.getAt(i).data;
                j++;
            } else {
                if (staddconc.getAt(i).data.coincide != '')
                {
                    records[j] = staddconc.getAt(i).data;
                    j++;
                }
            }
        }
        return records;
    }

    //Ventana del buscar cliente
    function filtroconc(titulo, w, h, i) {
        var winGestionarproyecto = new Ext.Window({
            title: titulo,
            layout: 'fit',
            width: w,
            height: h,
            modal: true,
            closeAction: 'hide',
            items: [i],
            buttons: [
                {
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    id: 'bcanc',
                    text: 'Cancelar',
                    handler: function() {
                        winGestionarproyecto.hide();
                        cbxcliente.reset();
                        cbxtipodoc.reset();
                        dfdesde.reset();
                        dfhasta.reset();
                    }
                }, {
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    handler: function() {
                        if (buscaranticipo.getForm().isValid()) {
                            var idtipoa = cbxtipodoc.getValue();
                            var cliente = cbxcliente.getValue();
                            var ini = dfdesde.getRawValue();
                            var fin = dfhasta.getRawValue();
                            if (band == true) {
                                staddconc.removeAll();
                            }
                            band = true;
                            staddconc.load({
                                params: {
                                    idtipo: idtipoa,
                                    cliente: cliente,
                                    dfdesde: ini,
                                    dfhasta: fin
                                },
                                callback: function() {
                                    if (staddconc.getTotalCount() == 0)
                                        mostrarMensaje(1, 'No existe un registro respecto a su b&uacute;squeda.');
                                }
                            });
                            winGestionarproyecto.hide();
                            cbxcliente.reset();
                            cbxtipodoc.reset();
                            dfdesde.reset();
                            dfhasta.reset();
                            tfnoinst.reset();
                            tffecha.reset();
                            tfimporte.reset();
                            tfmoneda.reset();
                            chbxcancel.reset();
                            chbxcoincide.reset();
                            chbxcoincide.disable();
                            chbxcancel.disable();
                            btnaplic.disable();
                        }
                    }
                }]
        });
        winGestionarproyecto.show();
    }

    function buscarantbtn()
    {
        if (cbxtipodoc.isValid() && cbxcliente.isValid() && dfdesde.isValid() && dfhasta.isValid())
        {

            var idtipoa = cbxtipodoc.getValue();
            var cliente = cbxcliente.getValue();
            var ini = dfdesde.getRawValue();
            var fin = dfhasta.getRawValue();
            if (band == true) {
                staddconc.removeAll();
            }
            band = true;
            staddconc.load({
                params: {
                    idtipo: idtipoa,
                    cliente: cliente,
                    dfdesde: ini,
                    dfhasta: fin
                },
                callback: function()
                {
                    if (staddconc.getCount() == 0)
                    {
                        if (tipo == 1)
                            mostrarMensaje(1, "No existen cobros anticipados posibles a conciliar.", function(){});
                        else
                            mostrarMensaje(1, "No existen cobros o pagos anticipados posibles a conciliar.", function(){});

                        cbxtipodoc.reset();
                        cbxcliente.reset();
                        dfdesde.reset();
                        dfhasta.reset();
                        cbxcliente.disable();
                        btnbuscar.disable();
                    }
                }
            });
            //winGestionarproyecto.hide();
            // cbxcliente.reset();cbxtipodoc.reset();dfdesde.reset();dfhasta.reset();   
            //stcliente.removeAll(); 	
            tfnoinst.reset();
            tffecha.reset();
            tfimporte.reset();
            tfmoneda.reset();
            dfdesde.setMaxValue(null);
            dfhasta.setMinValue(null);
            chbxcancel.reset();
            chbxcoincide.reset();
            chbxcoincide.disable();
            chbxcancel.disable();
            btnaplic.disable();
        }
        else
        {
            if (!cbxtipodoc.isValid())
                cbxtipodoc.markInvalid();
            if (!cbxcliente.isValid())
                cbxcliente.markInvalid();
            if (!dfdesde.isValid())
                dfdesde.markInvalid();
            if (!dfhasta.isValid())
                dfhasta.markInvalid();
        }
        btnaceptar.disable();
    }

    //Para validar los rangos de fecha
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

    function convertirsaldo(v)
    {
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