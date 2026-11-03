Ext.QuickTips.init();
UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();

var btnaplicar, btnbusc, btncanc, btnacep;
var tfnodoc, tffechaod, tfplazood;
var dfdesdeod, dfhastaod, dffechaod;
var chbxcambplazo, chbxcancelar, chbxcoincide;
var noWindow = true;

var maskguardarconc, Mascara;
var idfuncionalidad = window.parent.idFuncionalidad;
var Record;
var band;
var contMask = 0;
var cont = 0;
var loadData = [];
var plazoInicial = -1;
//var plazoInicial = -1;
var usuario;
var fechaContableConciliacion;
var fechaFinConciliacion;
var fechaInicioConciliacion;

function cargarInterfaz() {
    usuario = perfil.usuario;

    var keyMap = new Ext.KeyMap(Ext.getDoc(), [
        // {
        //     key: 'h',
        //     alt: true,
        //     fn: function () {
        //         if (!btnAyuda.disabled && !btnAyuda.hidden) {
        //             btnAyuda.handler.call();
        //         }
        //     }
        // },
        // {//Buscar Alt+B
        //     key: "b",
        //     alt: true,
        //     fn: function () {
        //         if (!btnbusc.disabled && !btnbusc.hidden) {
        //             btnbusc.handler.call();
        //         }
        //     }
        // },
        {
            key: "r",
            alt: true,
            fn: function () {
                if (!vistaPrevia.vistaPrevia.disabled && !vistaPrevia.vistaPrevia.hidden) {
                    vistaPrevia.handler.call();
                }
            }
        },
        /*{
            key: Ext.EventObject.ENTER,
            fn: function() {
                if (!btnbusc.disabled)
                    btnbusc.handler.call();
            }
        },*/
        {
            key: Ext.EventObject.TAB, //TAB
            fn: function () {
                if (document.activeElement.tabIndex == 8)
                    cbxtipodocod.focus(true, 10);
            }
        },
        {
            key: Ext.EventObject.TAB, //TAB
            shift: true,
            fn: function () {
                if (document.activeElement.tabIndex == 1)
                    btnAyuda.focus();
            }
        }
    ]);

    var soloNumeros = /^[0-9]+$/;
    band = false;
    Mascara = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando...'});
    maskguardarconc = new Ext.LoadMask(Ext.getBody(), {msg: 'Guardando...'});

    // Mascara.show();

    var btnAyuda = new Ext.Button({
        id: 'btnAyuConciliacion',
//        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        text: 'Ayuda',
        tabIndex: 8,
        tooltip: "Mostrar ayuda de la funcionalidad (<b>Alt</b>+<b>H</b>)",
        /*handler: function() {
            var titulo = 'Mostrar ayuda de la funcionalidad';
            var direccion = 'copa/conciliacion/cuenta_cobrar_pagar';
            help.show(titulo, direccion);
        }*/
    });

    btnaplicar = new Ext.Button({
        disabled: true,
        id: 'btnaplicar',
//        icon: perfil.dirImg + 'confirmar.png',
        iconCls: 'confirmar',
        text: 'Confirmar',
        tooltip: 'Confirmar',
        handler: function () {
            aplicar();
        }
    });

    btnbusc = new Ext.Button({
        id: 'btnbuscar',
        tooltip: 'Aceptar configuraci&oacute;n y mostrar datos (<b>Enter</b>)',
        disabled: true,
//        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        text: 'Aceptar',
//        tooltip: 'Buscar cuentas <B> (Alt+B)',
        tabIndex: 6,
        //text: 'Buscar',
        handler: function () {
            buscarantbtn();
            btnaplicar.setDisabled(true);
        }
    });

    vistaPrevia = new Ext.Button({
        id: 'vistaPrevia',
        tooltip: 'Vista reporte (<b>Alt+R</b>)',
        disabled: true,
//        icon: perfil.dirImg + 'abrir.png',
        iconCls: 'vistareporte',
        text: 'Vista <u>r</u>eporte',
        tabIndex: 7,
        //text: 'Buscar',
        handler: function () {
            var array = [];
            var temp = smaddconcod.getSelections();
            temp.sort(function (a, b) {
                return a.get('nobreCliente') - b.get('nobreCliente');
            });
            for (var i = 0; i < temp.length; i++)
                array.push(temp[i].data);

            plazoInicial = -1;
            reporte(array);
        }
    });

    var btnLimpiarTipoA = new Ext.Button({
        id: 'btnbus',
//        disabled: true,
//        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: 'Limpiar campos (<b>Alt</b>+<b>L</b>)',
        text: "<u>L</u>impiar",
        handler: function () {
            staddconc.clearFilter();
            staddconc.baseParams.idtipo = cbxtipodocod.getValue();
            staddconc.load({
                callback: function () {
                    Mascara.hide();
                    cbxclienteod.reset();
                    cbxtipoOp.reset();
                    dfdesdeod.reset();
                    dfhastaod.reset();
                }
            });
        }
    });

    btncanc = new Ext.Button({
        id: 'btncancelar',
//        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        tooltip: 'Cerrar interfaz y cancelar la operaci&oacute;n',
        text: 'Cancelar',
        handler: function () {
            window.parent.Ext.getCmp('win' + idfuncionalidad).close();
            vpconciliacion.hide();
        }
    });

    btnacep = new Ext.Button({
        disabled: true,
        hidden: false,
        tooltip: 'Guardar datos y limpiar los campos',
        id: 'btnaceptar',
//        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        text: 'Aceptar',
        handler: function () {
            guardarconciliaciones();
        }
    });

    tfnodoc = new Ext.form.TextField({
        fieldLabel: 'N&uacute;mero',
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        disabled: true,
        name: 'numero',
        width: 150
    });

    tffechaod = new Ext.form.DateField({
        fieldLabel: 'Fecha',
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        disabled: true,
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        editable: true,
        readOnly: false,
        name: 'fechaemision',
        width: 150,
        format: 'd/m/Y'
    });

    tfplazood = new Ext.form.NumberField({
        fieldLabel: 'Plazo',
        disabled: true,
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        maxLength: 4,
        regexText: 'Solo se permiten n&uacute;meros en este campo.',
        maskRe: soloNumeros,
        maxLengthText: 'Hasta 4 d&iacute;gitos.',
        name: 'plazo',
        width: 85
    });

    dfdesdeod = new Ext.form.DateField({
        tabIndex: 4,
        fieldLabel: 'Desde',
        allowBlank: true,
        name: 'dfdesde',
        anchor: '100%',
        disabledClass: 'disabled-component',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        editable: true,
        selectOnFocus: true,
        readOnly: false,
        format: 'd/m/Y',
        maxValue: null,
        minValue: null,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.',
        enableKeyEvents: true,
        listeners: {
            keypress: function (field, event) {
                if (event.getKey() === event.ENTER && !Ext.isEmpty(cbxclienteod.getValue()) && !btnbusc.disabled) {
                    btnbusc.handler.call();
                }
            }
        },
            focus: function () {
                btnbusc.enable();
        },
    });

    dfhastaod = new Ext.form.DateField({
        tabIndex: 5,
        fieldLabel: 'Hasta',
        allowBlank: true,
        name: 'dfhasta',
        anchor: '100%',
        disabledClass: 'disabled-component',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        editable: true,
        selectOnFocus: true,
        readOnly: false,
        format: 'd/m/Y',
        maxValue: null,
        minValue: null,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.',
        enableKeyEvents: true,
        listeners: {
            keypress: function (field, event) {
                if (event.getKey() === event.ENTER && !Ext.isEmpty(cbxclienteod.getValue()) && !btnbusc.disabled) {
                    btnbusc.handler.call();
                }
            },
            focus: function () {
                btnbusc.enable();
            },
        }
    });

    dffechaod = new Ext.form.DateField({
        fieldLabel: 'Fecha',
        disabledClass: 'disabled-component',
        maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
        editable: true,
        selectOnFocus: true,
        readOnly: false,
        allowBlank: false,
        name: 'dffecha',
        width: 150,
        format: 'd/m/Y',
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.'
    });

    chbxcambplazo = new Ext.form.Checkbox({
        boxLabel: 'Cambio plazo',
        disabled: true,
        hideLabel: true,
        inputValue: 'operacion'
    });

    chbxcancelar = new Ext.form.Checkbox({
        boxLabel: 'Cancelar',
        disabled: true,
        hideLabel: true,
        inputValue: 'operacrg4ggrion'
    });

    chbxcoincide = new Ext.form.Checkbox({
        boxLabel: 'Coincide',
        disabled: true,
        hideLabel: true,
        inputValue: 'adfsaf'
    });

    //*********************combobox****************************\\
    var jsonclienteod = new Ext.data.JsonReader({
        id: 'idclien'
        // }, [{name: 'idestructuracliente'},
    }, [{name: 'idcliente'},
        {name: 'nombre'},
        {name: 'nombrecliente'},
        {name: 'codigo'}
    ]);

    var stclienteod = new Ext.data.Store({
        url: 'cargarcbclient',
        listeners: {
            load: function (options, records) {
                if (stclienteod.getCount() > 0)
                    cbxclienteod.enable();
                else {
                    if (options.baseParams)
                        mostrarMensaje(1, "No existen datos que se correspondan con el criterio de b&uacute;squeda especificado.");
                    else if (cbxtipodocod.getValue() == 1)
                        mostrarMensaje(1, "No existen cuentas por cobrar registradas en el sistema.");
                    else if (cbxtipodocod.getValue() == 2)
                        mostrarMensaje(1, "No existen cuentas por pagar registradas en el sistema.");
                    else if (cbxtipodocod.getValue() == 3)
                        mostrarMensaje(1, "No existen cobros fiscales registrados en el sistema.");
                    else if (cbxtipodocod.getValue() == 4)
                        mostrarMensaje(1, "No existen pagos fiscales registrados en el sistema.");
                }
            },
            beforeload: function (store) {
                store.baseParams.idtipo = cbxtipodocod.getValue();
            },
        },
        reader: jsonclienteod
    });
    //stclienteod.load();
    var cbxclienteod = new Ext.form.ComboBox({
        tabIndex: 2,
        fieldLabel: 'Deudor',
//        width: 280,
        anchor: '100%',
        disabledClass: 'disabled-component',
        // selectOnFocus: true,
        // mode: 'local',
        mode: 'remote',
        hiddenName: 'idcliente',
        // hiddenName: 'idestructuracliente',
//        allowBlank: false,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.',
        emptyText: 'Seleccione...',
        readOnly: false,
        editable: true,
        //typeAhead : true,
        store: stclienteod,
        valueField: 'idcliente',
        // valueField: 'idestructuracliente',
        displayField: 'nombre',
        loadingText: 'Buscando',
        //listWidth: 300,
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
        // forceSelection: true,
        triggerAction: 'all',
        // clearCls: 'x-form-clear-left',
        enableKeyEvents: true,
        pageSize: 20,
        minChars: 3,
        listeners: {
            select: function () {
                btnbusc.enable();
            },
            keypress: function (field, event) {
                if (event.getKey() === event.ENTER && !btnbusc.disabled) {
                    btnbusc.handler.call();
                }
            },
            keyup: function (field, event) {
                if (event.getKey() === event.ENTER && !btnbusc.disabled) {
                    btnbusc.handler.call();
                }else if (event.getKey() === event.DELETE || event.getKey() === event.BACKSPACE) {
                    this.clearValue();
                }
            }
        },
    });
    // cbxclienteod.disable();
    //*********************combobox****************************\\

    var jsontipodoc = new Ext.data.JsonReader({
            root: 'idtipod',
            id: 'idtipo'
        }, [{
            name: 'idtipo'
        }, {
            name: 'descripcion'
        }]
    );

    var sttipodoc = new Ext.data.Store({
        url: 'cargarcbtipodc',
        sortInfo: {
            field: 'idtipo',
            direction: "ASC"
        },
        reader: jsontipodoc,
        listeners: {
            beforeload: function () {
                Ext.Msg.wait('Cargando...', 'Por favor espere...');
            },
            load: function () {
                cbxtipodocod.setValue(sttipodoc.getAt(0).data.idtipo);
                cbxtipodocod.setRawValue(sttipodoc.getAt(0).data.descripcion);
                staddconc.load({
                    params: {
                        idtipo: sttipodoc.getAt(0).data.idtipo
                    },
                    callback: function () {
                        Ext.Msg.hide();
                        if (staddconc.getCount() == 0) {
                            // if (idtipoa == 1)
                            //     mostrarMensaje(1, "No existen cuentas por cobrar posibles a conciliar.");
                            // else
                            //     mostrarMensaje(1, "No existen cobros fiscales posibles a conciliar.");

                            cbxtipodocod.reset();
                            cbxclienteod.reset();
                            dfdesdeod.reset();
                            dfhastaod.reset();
                            // cbxclienteod.disable();
                            cbxclienteod.enable();
                            btnbusc.disable();
                        } else {
                            /*stclienteod.load({
                                params: {
                                    idtipo: sttipodoc.getAt(0).data.idtipo
                                },
                                callback: function () {
                                    Mascara.hide();
                                }
                            });*/
                            stcomboOp.load({
                                params: {
                                    idtipo: sttipodoc.getAt(0).data.idtipo
                                }
                            });
                        }

                    }
                });
            }
        }

    });
    sttipodoc.load();

    var cbxtipodocod = new Ext.form.ComboBox({
        fieldLabel: 'Documento de',
        mode: 'local',
        hiddenName: 'idtipo',
        allowBlank: false,
//        width: 250,
        anchor: '100%',
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        tabIndex: 1,
        blankText: 'Este campo es obligatorio.',
        invalidText: 'Este campo es obligatorio.',
        emptyText: 'Seleccione...',
        readOnly: false,
        editable: true,
        //typeAhead : true,
        store: sttipodoc,
        valueField: 'idtipo',
        displayField: 'descripcion',
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
        forceSelection: true,
        triggerAction: 'all',
        listeners: {
            select: function () {
                btnbusc.disable();
            }
        }
    });


    dfdesdeod.on('change', function () {
        dfhastaod.setMinValue(dfdesdeod.getRawValue());
    });
    dfdesdeod.on('valid', function () {
        dfhastaod.setMinValue(dfdesdeod.getRawValue());
        if (dfdesdeod.getRawValue() != '') {
            dfhastaod.enable();
        }
    });

    dfhastaod.on('change', function () {
        dfdesdeod.setMaxValue(dfhastaod.getRawValue());
    });
    //GridPanel
    var jsonaddconc = new Ext.data.JsonReader({
        root: 'grid',
        totalProperty: "cant",
        id: 'idderechouobligacion'
    }, [{name: 'idderechouobligacion'},
        {name: 'numero'},
        {name: 'fechaemision'},
        {name: 'importemb'},
        {name: 'liquidadomb'},
        {name: 'pagadomb'},
        {name: 'plazo'},
        {name: 'coincide'},
        {name: 'operacion'},
        {name: 'ultimaconciliacion'},
        {name: 'idcondicionpago'},

        {name: 'nobreCliente'},
        {name: 'cuentaCliente'},
        {name: 'comentario'},
        {name: 'estado'},
        {name: 'documento'},
        {name: 'concatcta'},
        {name: 'tipoCuenta'},
        {name: 'operacionDenom'},
        {name: 'cobrospagos'}
    ]);
    var staddconc = new Ext.data.Store({
        url: 'cargargrid',
        baseParams: {
            limit: 20
        },
        reader: jsonaddconc,
        listeners: {
            beforeload: function () {
                if (cont != 0)
                    Mascara.show();
                cont++;
                staddconc.baseParams.idtipo = cbxtipodocod.getValue();
//                staddconc.baseParams.limit = 20;
            },
            load: function () {
                Mascara.hide();
//                cbxclienteod.reset();
//                cbxtipoOp.reset();
                loadData = [];
                for (var i = 0; i < this.getCount(); i++) {
                    loadData.push(this.getAt(i));

//                    if (this.getAt(i).data.coincide == null) {
//                        cbCoincide.setValue('');
//                        cbCoincide.setRawValue('');
//                    } else if (this.getAt(i).data.coincide == 0) {
//                        cbCoincide.setValue('No');
//                        cbCoincide.setRawValue('No');
//                    } else {
//                        cbCoincide.setValue('Si');
//                        cbCoincide.setRawValue('Si');
//                    }
//                    if (this.getAt(i).data.coincide == 1)
//                    this.getAt(i).set('operacion', '');
                }
            }
        }
    });

    //para verificar estados iniciales
    var jsonaddconci = new Ext.data.JsonReader({
        root: 'grid',
        id: 'numero'
    }, [{name: 'idderechouobligacion'},
        {name: 'numero'},
        {name: 'fechaemision'},
        {name: 'importemb'},
        {name: 'liquidadomb'},
        {name: 'pagadomb'},
        {name: 'plazo'},
        {name: 'coincide'},
        {name: 'operacion'},
        {name: 'ultimaconciliacion'},
        {name: 'idcondicionpago'},
        {name: 'nobreCliente'}
    ]);
    var staddconci = new Ext.data.Store({
        url: 'cargargrid',
        reader: jsonaddconci
    });

    var smaddconc = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    smaddconc.on("rowselect", function (a, rowIndex, record) {
        Record = record;
    });

//    stcomboOp = new Ext.data.Store({
//        url: 'cargarcomboop1',
//        reader: new Ext.data.JsonReader({
//            id: 'idRecord',
//            totalproperty: 'totalRecords'
//        }, [
//            {
//                name: 'idop',
//                mapping: 'idestadodcop'
//            },
//            {
//                name: 'denom',
//                mapping: 'descripcion'
//            }
//        ])
//    });

//    var stcomboOp = new Ext.data.SimpleStore({
//        fields: ['idop', 'denom'],
//        data: [
//            ['1', 'Pendiente'],
//            ['2', 'Liquidado parcial'],
//            ['25', 'Litigio'],
//            ['26', 'Proceso judicial'],
//            ['27', 'Incobrable']
//        ]
//    });

    var jsonaddconci = new Ext.data.JsonReader({
        root: 'data',
        id: 'numero'
    }, [
        {name: 'text'},
        {name: 'idcuenta'}
    ]);
    var stcomboOp = new Ext.data.Store({
        url: 'loadTipoCuenta',
        reader: jsonaddconci
    });

    var cbxtipoOp = new Ext.form.ComboBox({
        fieldLabel: 'Cuenta',
        mode: 'local',
        hiddenName: 'idcuenta',
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        //emptyText:'Seleccione...',
        allowBlank: true,
        store: stcomboOp,
        tabIndex: 3,
        valueField: 'idcuenta',
        displayField: 'text',
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
        typeAhead: true,
        forceSelection: true,
        editable: false,
        anchor: '100%',
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function () {
                btnbusc.enable();
            },
            keypress: function (field, event) {
                if (event.getKey() === event.ENTER && !btnbusc.disabled) {
                    btnbusc.handler.call();
                }
            }
        }
    });

    var btnaplicar = new Ext.Button({
        disabled: true,
        hidden: false,
        id: 'btnaplicar',
//        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        text: "Aceptar"
//        handler: function() {
//            Ext.Msg.confirm('Confirmaci&oacute;n', mensajeconfirmacion, function(btnPress) {
//                if (btnPress === 'yes') {
//                    operacion = true;
//                    //var idtipoOpBusq = cbxtipoOp.getValue();          //id de la operacion q selecciono para la busqueda
//                    //var conceptoOperacion = (idtipoOpBusq == 25) ? '30' : '29'; // 29 - Litigio, 30 - Proceso Judicial
//                    var idtipoOpBusq = cbCambiarA.getValue();
//                    var conceptoOperacion = (idtipoOpBusq == 26) ? '30' : (idtipoOpBusq == 27) ? '31' : 29;
//
//                    if ((cbxtipoOp.getValue() == 25 && cbCambiarA.getValue() == 1) || ((cbxtipoOp.getValue() == 26 && cbCambiarA.getValue() == 1) ||
//                            (cbxtipoOp.getValue() == 26 && cbCambiarA.getValue() == 25))) {
//                        var tipoContabilizacion = 2;
//                        var idEstadoDocumento = 1;
//                        var idtipoDoc = cbxtipodoc.getValue();
//                        var params = {};
//                        fLoadDataComprobante(tipoContabilizacion, idEstadoDocumento, idtipoOpBusq, idtipoDoc, params);
//                        operacion = false;
//                    }
//                    else
//                        buildWindOperContable(conceptoOperacion, idtipoOpBusq);
//                } else {
//                    // aki liberar la variable que controla que no se levanten mas ventanas
//                }
//            });
//            //cambiarCta();
//        }
    });

    var stCambiarA = new Ext.data.SimpleStore({
        fields: ['idEstado', 'estado']
    });

    var cbCambiarA = new Ext.form.ComboBox({
        //fieldLabel: 'Cuenta o efecto de',
        mode: 'local',
        hiddenName: 'idEstado',
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        //disabled: true,
        hidden: true,
        emptyText: 'Seleccione...',
        //emptyText:'Seleccione...',
        allowBlank: true,
        store: stCambiarA,
        valueField: 'idEstado',
        displayField: 'estado',
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{estado}" class="x-combo-list-item">{estado}</div></tpl>',
        typeAhead: true,
        forceSelection: true,
        editable: false,
        width: 150,
        triggerAction: 'all',
        enableKeyEvents: true,
//    listeners: {
//        keypress: function(field, event) {
//            if (event.getKey() === event.ENTER && !Ext.isEmpty(cbxcliente.getValue()) && !btnbuscarTipoA.disabled) {
//                btnbuscarTipoA.handler.call();
//            }
//        }
//    }
    });

    var ptRegistroDuo = new Ext.Cont.PagingToolbar({
        pageSize: 20,
        clearFilter: false,
        store: staddconc,
        displayInfo: false,
        items: [
            {
                id: 'btnclear',
//                icon: perfil.dirImg + 'limpiar.png',
                iconCls: 'limpiar',
                tooltip: 'Limpiar filtros y recargar',
                handler: function () {
                    Reset();
                }
            },
            '->', cbCambiarA, {
                id: 'btnaplicar',
                disabled: true,
//                icon: perfil.dirImg + 'cambiar.png',
                iconCls: 'traspaso',
                text: "Traspasar",
                tooltip: 'Traspasar cuenta',
                handler: function () {
                    windowTraspaso();
                }
            }
        ]
    });

    function Reset() {
//        staddconc.clearFilter();
        staddconc.baseParams.idcliente = '',
            staddconc.baseParams.estado = '',
            cbxclienteod.reset();
        cbxtipoOp.reset();
        dfdesdeod.reset();
        dfhastaod.reset();
        staddconc.load();
    }

    function windowTraspaso() {
        btnOperacionCancelar = new Ext.Button({
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            handler: function () {
                winOperacion.close();
            }
            //scope: this
        });

        btnOperacionAceptar = new Ext.Button({
            id: 'btnOperacionAceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            tabIndex: 408,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true,
            handler: function () {
                var selections = smaddconcod.getSelections();
                var tipocuenta = selections[0].json.tipoCuenta;
                var fecha = fechaTraspaso.getValue();
                // cuentaPadre(cbAddClasificadorCuenta.getValue(), tipocuenta);
                // cambio de tipos de mensajes
                if (selections.length == 1) {
                    var mensaje ='¿Esta seguro que quiere traspasar de <b>' + tipocuenta + '</b> a <b>' + cbAddClasificadorCuenta.getRawValue() + '</b>?';
                } else {
                    var mensaje = '¿Esta seguro que quiere traspasar las facturas seleccionadas a la <b>' + cbAddClasificadorCuenta.getRawValue() + '</b>?';
                }
                    mostrarMensaje(2, mensaje, function (btnPress) {
                        if (btnPress === 'ok') {
                            winOperacion.close();
                            fLoadDataComprobante(idCuentaDestino, concatctaCuentaDestino, fecha);
                        }
                    });
            }
        });
        // function cuentaPadre(idcuenta, tipocuenta) {
        //     Ext.Ajax.request({
        //     url: 'cuentaPadre',
        //     method: 'POST',
        //     params: {
        //         idcuenta: idcuenta
        //     },
        //     callback: function(options, success, response)
        //     {
        //         responseData = Ext.decode(response.responseText);
        //       mostrarMensaje(2, '¿Esta seguro que quiere traspasar de <b>' + tipocuenta + '</b> a <b>' + responseData.denominacion + '</b>. Esta operaci&oacute;n generar&aacute; asientos contables.', function(btnPress) {
        //             if (btnPress === 'ok') {
        //                 winOperacion.close();
        //                 fLoadDataComprobante(idCuentaDestino, concatctaCuentaDestino);
        //             }
        //         });
        //     }
        // });
        // }
        var stAddClasificadorCuenta = new Ext.data.Store({
            url: 'cargarCuentas',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'cuenta', mapping: 'id'},
                {name: 'denominacion', mapping: 'text'}
            ])
        });

        var cbAddClasificadorCuenta = new Ext.contabilidad.util.linkedCombo({
            fieldLabel: 'Cuenta', //scope.etiquetas.lbCuenta,
            store: stAddClasificadorCuenta,
            displayField: 'denominacion',
            valueField: 'cuenta',
            listHeight: 500,
            tipocta: '',
            id: 'lnkcuenta',
            lazyRender: true,
            hideTbar: true,
            fnCreateNew: Ext.emptyFn,
            listeners: {
                select: function (combo, record) {
                    idCuentaDestino = record.data.idcuenta;
                    concatctaCuentaDestino = record.data.concatcta;
                    btnOperacionAceptar.enable();
                }
            }
        });

        cbAddClasificadorCuenta.on({
            beforeload: function (treeloader) {
                var selections = smaddconcod.getSelections();
                var tipo = cbxtipodocod.getValue();
                var arrid = [];
                var comunes = [];
                var temparr = [];
                var arridcuentaspresentes = [];
                var num = 0;
                var temp = Ext.decode(selections[0]['data']['cobrospagos']);
                temp.forEach(function (element, index, arr) {
                    if (selections[0]['data']['cuentaCliente'] != element['idcuenta'] && element['idclasificacion'] == tipo)
                        comunes.push(element['idcuenta']);
                });
                if (selections.length != 1) {
                    num = 1;
                }
                for (var i = num; i < selections.length; i++) {
                    if (!arridcuentaspresentes.includes(selections[i]['data']['cuentaCliente']))
                    arridcuentaspresentes.push(selections[i]['data']['cuentaCliente']);
                    var cp = Ext.decode(selections[i]['data']['cobrospagos']);
                    for (var j = 0; j < cp.length; j++) {
                        if (cp[j]['idclasificacion'] == tipo && !arridcuentaspresentes.includes(cp[j]['idcuenta'])) {
                            if (comunes.includes(cp[j]['idcuenta'])) {
                                temparr.push(cp[j]['idcuenta']);
                            }
                        }
                    }
                    comunes = temparr.slice();
                    temparr = [];
                    arrid = comunes.slice();
                }
                if (arrid.length >= 1) {
                    treeloader.baseParams.arrIdCuentas = Ext.encode(arrid);
                } else {
                    mostrarMensaje(1, 'Verifique la configuración de las cuentas asociadas en el catálogo de clientes y provedores.');
                }
            }
        });

        var fechaTraspaso = new Ext.form.DateField({
            id: 'idfechaTraspaso',
            name: 'fechaTraspaso',
            // fieldLabel: 'Fecha de traspaso',
            fieldLabel: 'Fecha',
            allowBlank: false,
            value: fechaContableConciliacion,
            minValue: fechaInicioConciliacion,
            maxValue: fechaFinConciliacion,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            anchor: '100%'
        });


        var fpOperacinCambio = new Ext.FormPanel({
            frame: true,
            border: false,
            id: 'fpOperacinCambio',
            autoHeight: true,
            layout: 'form',
            labelWidth: 50,
            labelAlign: 'top',
            items: [
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: 0.6,
                            layout: 'form',
                            items: [cbAddClasificadorCuenta]
                        },{
                            columnWidth: 0.4,
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            items: [fechaTraspaso]
                        }
                    ]
                }
            ]
        });

        var winOperacion = new Ext.Window({
            modal: true,
            id: 'winOperacion',
            frame: true,
            resizable: true,
            constrain: true,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closable: false,
            defaultButton: 'btnOperacionAceptar',
            title: 'Traspasar cuenta',
            width: '40%',
            autoHeight: true,
            items: [fpOperacinCambio],
            buttons: [btnOperacionCancelar, btnOperacionAceptar]
        });

        var keyMapAdd = new Ext.KeyMap(document, [
            {
                key: Ext.EventObject.ESC,//ESCAPE Cerrar ventana
                alt: false,
                fn: function () {
                    winOperacion.close();
                    keyMapAdd.disable();
                }
            }
        ]);

        winOperacion.show();
    }

    function fLoadDataComprobante(idCuentaDestino, concatctaCuentaDestino, fecha) {
        // Ext.getBody().mask('Cargando...');
        Ext.Msg.wait('Cargando...', 'Por favor espere');

        var arrayCuentaOrigen = new Array();
        var arrayCuentaDestino = new Array();
        var arrayIdDuo = new Array();
        var duo = new Array();
        arrayDuo = smaddconcod.getSelections();

        for (var v = 0; v < arrayDuo.length; v++) {
            arrayCuentaOrigen.push({
                idCuentaClient: arrayDuo[v].json.cuentaCliente,
                idConcatCtaClient: arrayDuo[v].json.concatcta,
                idDuo: arrayDuo[v].json.idderechouobligacion,
                importemb: (parseFloat(arrayDuo[v].json.importemb) - parseFloat(arrayDuo[v].json.liquidadomb)).toFixed(2)
            });
            arrayIdDuo.push(arrayDuo[v].json.idderechouobligacion);
            duo.push(arrayDuo[v].json);
        }
        arrayCuentaDestino.push({
            idCuentaClient: idCuentaDestino,
            idConcatCtaClient: concatctaCuentaDestino
        });

        Ext.Ajax.request({
            url: 'loadDataComprobante',
            method: 'POST',
            params: {
                tipoDuo: cbxtipodocod.getValue(),
                arrayIdDuo: Ext.encode(arrayIdDuo),
                arrayCuentasOrigen: Ext.encode(arrayCuentaOrigen),
                arrayCuentaDestino: Ext.encode(arrayCuentaDestino)
            },
            callback: function (options, success, response) {
                // Ext.getBody().unmask();
                var responseData = Ext.decode(response.responseText);
//            fShowComprobante(responseData.dataComprobante, responseData.idObjeto, responseData.detalle, responseData.observacion, responseData.fechacontable, tipoContabilizacion, parametros);
                Ext.Cont.Comprobante.init(/*responseData.datos.subsistema*/6, responseData.datos.detalle, responseData.datos.descripcion, fecha, responseData.datos.dataComprobante, 3, 1, 1).onSaved(function (idComprobant, numComprobant, fecha) {
                    if (idComprobant) {
                        Ext.Msg.wait('Cambiando estado de la cuenta', 'Por favor espere...');
                        Ext.Ajax.request({
                            url: 'insertarComprobante',
                            method: 'POST',
                            params: {
                                arrayIdDuo: Ext.encode(arrayIdDuo),
                                idcomprobante: idComprobant,
                                numerocomprobante: numComprobant,
                                fecha: fecha
                            },
                            callback: function (options, success, response) {
                                cambiarCta(idComprobant, numComprobant, fecha, arrayCuentaDestino, duo);
                            }
                        });

                    }
                });
            }
        });
    }

    function cambiarCta(idComprobante, numComprobante, fechaComprobante, arrayCuentaDestino, duo) {
//        Ext.Msg.wait('Cambiando estado de la cuenta', 'Por favor espere...');
        Ext.Ajax.request({
            url: 'cambiarcta',
            method: 'POST',
            params: {
                arraydocs: Ext.encode(duo),
                idcuentaOperacion: arrayCuentaDestino[0].idCuentaClient,
                usuario: usuario,

                idComprobante: idComprobante,
                numComprobante: numComprobante,
                fechaComprobante: fechaComprobante
            },
            callback: function (options, success, response) {
                Ext.Msg.hide();
                staddconc.load();
                //
            }
        });
    }

    //
    var rowactionConfirmar = new Ext.grid.RowActions({
        id: 'rowactionConfirmar',
        //header: 'Conciliar',
        align: 'center',
        width: 100,
        actions: [
            {
                id: 'confirmar',
                tooltip: 'Confirmar conciliaci&oacute;n',//this.idioma.lbDelTalonario,
                iconCls: 'confirmar',
                width: 40
            }
        ]
    });
    rowactionConfirmar.on('action', function (grid, record, action, rowIndex, col, e) {
        plazoInicial = loadData[rowIndex].json.plazo;
        var plazoChange = record.data.plazo;
        if (plazoInicial == plazoChange)
            record.set('operacion', '');
        else
            record.set('operacion', 'Cambio de plazo');

        if (record.get('coincide') == 'no')
            record.set('operacion', '');
//            grdaddconcod.getSelectionModel().selection.record.set('operacion', 'Cambio plazo');

        switch (action) {
            case 'confirmar':
                mostrarMensaje(2, '¿Est&aacute; seguro que quiere realizar la conciliaci&oacute;n?', function (btnPress) {
                    if (btnPress === 'ok') {
                        guardarconciliaciones(record);
                    }
                });
                break;
        }
    });

    var stCoincide = new Ext.data.SimpleStore({
        fields: ['coincide'],
        data: [
            ['Si'],
            ['No']
        ]
    });
    var cbCoincide = new Ext.form.ComboBox({
        mode: 'local',
        hiddenName: 'coincide',
//        width: 250,
        disabledClass: 'disabled-component',
        selectOnFocus: true,
        emptyText: 'Seleccione...',
        readOnly: false,
        editable: true,
        //typeAhead : true,
        store: stCoincide,
        valueField: 'coincide',
        displayField: 'coincide',
        resizable: true,
        tpl: '<tpl for="."><div ext:qtip="{coincide}" class="x-combo-list-item">{coincide}</div></tpl>',
        forceSelection: true,
        triggerAction: 'all'
    });

    var smaddconcod = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            selectionchange: function (t) {
                vistaPrevia.setDisabled((t.getCount() == 0));
                Ext.getCmp('btnaplicar').setDisabled(t.getCount() < 1);
            }
        }
    });
    var grdaddconcod = new Ext.grid.EditorGridPanel({
        id: 'grdaddconcod',
        frame: false,
        border: false,
        //loadMask: /*'Cargando...'*/true,
        //layout: 'fit',
        sm: smaddconcod,
        store: staddconc,
        autoScroll: true,
        stripeRows: true,
        autoExpandColumn: 'operacionDenom',
//        height: Ext.lib.Dom.getViewHeight() - 100,//93,
        plugins: [rowactionConfirmar],
        clicksToEdit: 1,
        columns: [
            new Ext.grid.CheckboxSelectionModel(),
            {id: 'idderechouobligacion', hidden: true, hideable: false, dataIndex: 'idderechouobligacion'},
            {id: 'documento', header: 'Documento', dataIndex: 'documento', align: 'left', width: 120, sortable: true},
            {id: 'numero', header: 'N&uacute;mero', dataIndex: 'numero', align: 'center', width: 90, sortable: true},
            {
                id: 'fechaemision',
                header: 'Fecha',
                dataIndex: 'fechaemision',
                renderer: 'erpFecha',
                width: 70,
                align: 'center',
                sortable: true
            },
            {id: 'nombreCliente', header: 'Deudor', dataIndex: 'nobreCliente', width: 170, sortable: true},
            {id: 'cuentaCliente', hidden: true, hideable: false, dataIndex: 'cuentaCliente'},
            {id: 'operacionDenom', header: 'Detalle', dataIndex: 'operacionDenom', width: 150, sortable: true},
            {id: 'concatcta', hidden: true, header: 'Cuenta', dataIndex: 'concatcta', width: 100, sortable: true},
            {id: 'tipoCuenta', header: 'Cuenta', dataIndex: 'tipoCuenta', width: 250, sortable: true},
//            {id: 'comentario', header: 'Detalle', dataIndex: 'comentario', width: 250, sortable: true},
            {id: 'estado', header: 'Estado', hidden: true, dataIndex: 'estado', width: 100, sortable: true},
            {
                id: 'importe',
                header: 'Importe',
                dataIndex: 'importemb',
                width: 100,
                align: 'right',
                renderer: formatoMonedaABS,
                sortable: true
            },
            {
                id: 'liquidado',
                header: 'Liquidado',
                dataIndex: 'liquidadomb',
                width: 100,
                align: 'right',
                renderer: formatoMonedaABS,
                sortable: true
            },
            {
                header: 'Por liquidar',
                dataIndex: 'pendienteliq',
                align: 'right',
                width: 100,
                sortable: true,
                renderer: function (v, m, r) {
                    return formatoMonedaABS((parseFloat(r.get('importemb')) - parseFloat(r.get('liquidadomb'))).toFixed(2));
                }
            },
            {
                id: 'plazo',
                header: 'Plazo (d&iacute;as)',
                dataIndex: 'plazo',
                width: 90,
                align: 'center',
                editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxLength: 4, // asi esta definido en el modelo de datos
                    maxLengthText: 'El tamaño m&aacute;ximo requerido es de 4 d&iacute;gitos.'
//               maxValue: 100000
                })
            },
            {
                id: 'plazo',
                header: '&Uacute;ltima conciliaci&oacute;n',
                dataIndex: 'ultimaconciliacion',
                width: 130,
                align: 'center',
                renderer: function (value, metadata, record) {
                    return (!Ext.isEmpty(value)) ? value : 'No conciliada';
                },
                sortable: true
            },
            {
                id: 'func',
                header: 'Coincide',
                dataIndex: 'coincide',
                width: 70,
                align: 'center',
                sortable: true,
                editor: cbCoincide
            },
            {id: 'operacion', header: 'Operaci&oacute;n', dataIndex: 'operacion', width: 100, sortable: true},
            {id: 'idcondicionpago', hidden: true, hideable: false, dataIndex: 'idcondicionpago'},
            rowactionConfirmar
//            {id: 'eliminarM', dataIndex: 'eliminarM', width: 40, sortable: true, align: 'center', renderer: function(value, metadata, record, rowIndex, colIndex, store) {
//                        return "<img id = 'imgMora" + rowIndex + "' style='margin-right:10px;' class ='modRec' src='" + perfil.dirImg + 'confirmar.png' + "' alt='Eliminar'/>";
//                    }}
        ],
//        tbar: [
//            'Cliente: ', cbxclienteod, '-', '-',
//            'Estado: ', cbxtipoOp, '-', '-',
//            'Desde: ', dfdesdeod, '-', '-',
//            'Hasta: ', dfhastaod, '-', '-', btnbusc, btnLimpiarTipoA/*, '->'*/],
        bbar: ptRegistroDuo
    });
    grdaddconcod.on({
//        'beforeedit': function(objeto) {

//        },
//        afteredit: function(objeto) {
//            if (objeto.field == "plazo") {
//                if (objeto.originalValue != objeto.value)
//                    grdaddconcod.getSelectionModel().selection.record.set('operacion', 'Cambio plazo');
//                else
//                    smaddconc.getSelected().set('operacion', '');
//            }
//        }
    });


    cbxtipodocod.on('select', function (t) {
        Mascara.show();
        btnbusc.enable();
        cbxclienteod.reset();
        cbxtipoOp.reset();
        staddconc.removeAll();

        /*cbxclienteod.disable();
        cbxclienteod.clearValue();
        stclienteod.removeAll();
//        loadData = [];

        staddconc.load({
            params: {
                idtipo: cbxtipodocod.getValue()
            },
            callback: function()
            {

                if (staddconc.getCount() == 0)
                {
                    if (idtipoa == 1)
                        mostrarMensaje(1, "No existen cuentas por cobrar posibles a conciliar.");
                    else
                        mostrarMensaje(1, "No existen cuentas por pagar posibles a conciliar.");

                    cbxtipodocod.reset();
                    cbxclienteod.reset();
                    dfdesdeod.reset();
                    dfhastaod.reset();
                    cbxclienteod.disable();
                    btnbusc.disable();
                } else {*/
        stclienteod.load({
            params: {
                idtipo: cbxtipodocod.getValue()
            }
        });
        stcomboOp.load({
            params: {
                idtipo: cbxtipodocod.getValue()
            }
        });
        var idtipoa = cbxtipodocod.getValue();
        if (idtipoa == 2) {
            setLabel(cbxclienteod, 'Acreedor')
            //cbxclienteod.fieldLabel='Acreedor';
        } else {
            setLabel(cbxclienteod, 'Deudor')
            //cbxclienteod.fieldLabel='Cliente';
        }
        staddconc.baseParams = {};
        staddconc.load({
            params: {
                idtipoa: idtipoa,
            },
            callback: function () {
//                            Ext.Msg.hide();
                Mascara.hide();
            }
        });
        /*}

    }
});*/
    });

    function setLabel(field, label) {
        var el = field.el.dom.parentNode.parentNode;
        if (el.children[0].tagName.toLowerCase() === 'label') {
            el.children[0].innerHTML = label;
        } else if (el.parentNode.children[0].tagName.toLowerCase() === 'label') {
            el.parentNode.children[0].innerHTML = label;
        }

    }

    function buscarfecha() {
//        dffechaod.disable();
        Ext.Ajax.request({
            url: 'buscarfechacontable',
            callback: function (options, success, response) {
//                Ext.Msg.hide();
//                btncanc.focus();
                responseData = Ext.decode(response.responseText);
//                dffechaod.setRawValue(responseData.fecha);

                if (responseData.fecha) {
//                    dffechaod.setMaxValue(responseData.fechamax);
//                    dffechaod.setMinValue(responseData.fechai);
//                    dffechaod.enable();
                    // dfdesdeod.setRawValue(responseData.fechai);
                    // dfhastaod.setRawValue(responseData.fechamax);
                    fechaContableConciliacion = responseData.fecha;
                    fechaFinConciliacion = responseData.fechamax;
                    fechaInicioConciliacion = responseData.fechai;
                }
            }
        });
    }

    buscarfecha();

    function buscarantbtn() {
//        if (cbxtipodocod.isValid() && cbxclienteod.isValid())
//        {
        var idtipoa = cbxtipodocod.getValue();
        var cliente = cbxclienteod.getValue();
        var estado = cbxtipoOp.getValue();
        var ini = dfdesdeod.getRawValue();
        var fin = dfhastaod.getRawValue();

        if (band == true) {
            staddconc.removeAll();
            staddconci.removeAll();
        }
        band = true;
//            staddconc.removeAll();

        staddconc.baseParams.start = 0;
        staddconc.baseParams.idtipo = idtipoa;
        staddconc.baseParams.idcliente = cliente;
        staddconc.baseParams.fini = ini;
        staddconc.baseParams.ffin = fin;
        staddconc.baseParams.estado = estado;
        staddconc.load({
            /*params: {
                idtipo: idtipoa,
                idcliente: cliente,
                fini: ini,
                ffin: fin,
                estado: estado
            },*/
            callback: function () {
                Mascara.hide();
                if (staddconc.getCount() == 0) {
                    if (idtipoa == 1)
                        mostrarMensaje(1, "No existen cuentas por cobrar posibles a conciliar.");
                    else if (idtipoa == 2)
                        mostrarMensaje(1, "No existen cuentas por pagar posibles a conciliar.");
                    else if (idtipoa == 3)
                        mostrarMensaje(1, "No existen cobros fiscales posibles a conciliar.");
                    else if (idtipoa == 4)
                        mostrarMensaje(1, "No existen pagos fiscales posibles a conciliar.");

//                        cbxtipodocod.reset();
//                        cbxclienteod.reset();
//                        dfdesdeod.reset();
//                        dfhastaod.reset();
//                        cbxclienteod.disable();
//                        btnbusc.disable();
                }
            }
        });

//            tfnodoc.reset();
//            tffechaod.reset();
//            tfplazood.reset();
//            dfdesdeod.setMaxValue(null);
//            dfhastaod.setMinValue(null);
//            chbxcambplazo.reset();
//            chbxcancelar.reset();
//            chbxcoincide.reset();
//            chbxcoincide.disable();
//            chbxcancelar.disable();
//            btnaplicar.disable();
//        }
//        else
//        {
//            if (!cbxtipodocod.isValid())
//                cbxtipodocod.markInvalid();
//            if (!cbxclienteod.isValid())
//                cbxclienteod.markInvalid();
//            if (!dfdesdeod.isValid())
//                dfdesdeod.markInvalid();
//            if (!dfhastaod.isValid())
//                dfhastaod.markInvalid();
//        }
    }

    var buscar = new Ext.FormPanel({
        frame: true,
        items: [{
            layout: 'column',
            labelAlign: 'top',
            items: [{
                style: 'margin:5 0 0 10',
                layout: 'form',
                items: [cbxclienteod, cbxtipodocod]
            }, {
                style: 'margin:5 0 0 15',
                layout: 'form',
                items: [dfdesdeod, dfhastaod]
            }]
        }]
    });
    // ---------------------Vista---------------------------
    var fieldsetod = new Ext.FormPanel({
        layout: 'fit',
        frame: true,
        border: true,
        region: 'south',
        height: 197,
        //anchor: '100%',
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
                items: [tfnodoc]
            }, {
                style: 'margin:15 0 0 10',
                labelWidth: 35,
                layout: 'form',
                items: [tffechaod]
            }, {
                items: [{
                    xtype: 'fieldset',
                    title: 'Conciliar',
                    autoHeight: true,
                    style: 'margin:0 0 0 10',
                    width: 360,
                    layout: 'column',
                    items: [{
                        style: 'margin:10 0 -10 0',
                        layout: 'form',
                        labelWidth: 35,
                        columnWidth: .35,
                        items: [chbxcoincide]
                    }, {
                        style: 'margin:2 0 0 7',
                        layout: 'form',
                        columnWidth: .35,
                        items: [{
                            style: 'margin:-5 0 0 5',
                            layout: 'form',
                            items: [chbxcambplazo]
                        }, {
                            style: 'margin:-10 0 -10 5',
                            layout: 'form',
                            items: [chbxcancelar]
                        }]
                    }, {
                        columnWidth: .3,
                        style: 'margin:0 0 -10 15',
                        labelWidth: 50,
                        layout: 'form',
                        items: [tfplazood]
                    }]
                }, {
                    style: 'margin:5 0 0 285',
                    items: [btnaplicar]
                }]
            }],
            buttons: [btncanc, btnacep]
        }]
        // bbar: ['->', btncanc, btnacep]
    });


    var pCriterio = new Ext.FormPanel({
        id: 'topPanel',
        autoHeight: true,
        frame: true,
        border: false,
        buttonAlign: 'right',
        layout: 'form',
        items: [{
            id: 'innerTop',
            labelAlign: 'top',
            layout: 'column',
            items: [{
                columnWidth: .20,
                layout: 'form',
                style: 'margin:10 0 0 10',
                items: [cbxtipodocod]
            }, {
                columnWidth: .20,
                layout: 'form',
                style: 'margin:10 0 0 10',
                items: [cbxclienteod]
            }, {
                columnWidth: .20,
                layout: 'form',
                style: 'margin:10 0 0 10',
                items: [cbxtipoOp]
            }, {
                columnWidth: .20,
                layout: 'form',
                style: 'margin:10 0 0 10',
                items: [dfdesdeod]
            }, {
                columnWidth: .20,
                layout: 'form',
                style: 'margin:10 0 0 10',
                items: [dfhastaod]
            }]
        }],
//        tbar: ["->", 'Fecha', dffechaod, '-', '-', '-', btnAyuda],
        bbar: [btnbusc, vistaPrevia, "->", btnAyuda]
    });


    var pconcoblder = new Ext.Panel({
//        region: 'center',
        frame: false,
        border: false,
        layout: 'fit',
//        height: Ext.lib.Dom.getViewHeight() - 350,
//        autoHeight: true,//'100%',
//        tabIndex: 314,
        tbar: pCriterio,//['Documento de: ', cbxtipodocod, '->', 'Fecha: ', dffechaod, '-', '-', btnAyuda],
        items: [grdaddconcod]
    });

    var vpconciliacion = new Ext.Viewport({
//        frame: true,
//        border: true,
        id: 'viewport',
        layout: 'fit',
        items: [pconcoblder/*, fieldsetod*/],
    });

    //para resetear el grid
    btnbusc.on('click', limpiar);

    function limpiar(c) {
        if (c.click) {
            grdaddconcod.reset();
        }
    }

    chbxcoincide.on('check', activarcamplazo);

    function activarcamplazo(c) {
        if (c.checked) {
            chbxcancelar.disable();
            chbxcambplazo.enable();
            chbxcancelar.reset();
        } else {
            chbxcancelar.enable();
            chbxcambplazo.disable();
            chbxcambplazo.reset();
            tfplazood.disable();
            tfplazood.setValue(smaddconc.getSelected().get('plazo'));
        }
    }

    chbxcambplazo.on('check', acivarplazo);

    function acivarplazo(c) {
        if (c.checked) {
            tfplazood.enable();
        } else {
            tfplazood.disable();
            tfplazood.setValue(smaddconc.getSelected().data.plazo);
        }
    }

    //seleccionar una fila del grid
    grdaddconcod.on('click', select);

    function select() {
        if (smaddconc.getSelected()) {
            //btnacep.enable();
            btnaplicar.enable();
            chbxcoincide.enable();
            chbxcancelar.enable();
            btnaplicar.enable();
            chbxcambplazo.reset();
            chbxcancelar.reset();
            chbxcoincide.reset();
            tfnodoc.setValue(smaddconc.getSelected().get('numero'));
            tffechaod.setValue(smaddconc.getSelected().data.fechaemision);
            tfplazood.setValue(smaddconc.getSelected().data.plazo);
        }
    }

    function buscarvalplazo(idderuobl) {
        for (var i = 0; i < staddconci.getCount(); i++) {
            if (Record.get("idderechouobligacion") == idderuobl)
                return Record.get("plazo");
        }
        return -1;
    }

    //boton aplicar
    function aplicar() {


//        var plazox = tfplazood.getValue();
//        if (chbxcoincide.checked) {
//            smaddconc.getSelected().set('coincide', 'Si');
//            //plazst = buscarvalplazo(smaddconc.getSelected().data.idderechouobligacion);
//            plazst = Record.get("plazo");
//
//            if (chbxcambplazo.checked && tfplazood.getValue() != plazst && plazst != -1) {//smaddconc.getSelected().data.plazo
//                smaddconc.getSelected().set('operacion', 'Cambio plazo');
//                smaddconc.getSelected().set('plazo', plazox);
//            } else {
//                smaddconc.getSelected().set('operacion', '');
//                smaddconc.getSelected().set('plazo', plazst);
//            }
//        } else {
//            smaddconc.getSelected().set('coincide', 'No');
//            if (chbxcancelar.checked) {
//                smaddconc.getSelected().set('operacion', 'Cancelar');
//            } else {
//                smaddconc.getSelected().set('operacion', '');
//            }
//        }
//        btnacep.enable();

    }

    //Guardar las conciliaciones
    function guardarconciliaciones(record) {
        var flag = false;
        if (flag == false) {
            //maskguardarconc.show();
            Ext.Msg.wait('Guardando datos de la conciliacion.', 'Por favor espere...');
            Ext.Ajax.request({
                url: 'adicionarconciliacion',
                method: 'POST',
                params: {
//                    fecha: dfdesdeod.getRawValue(),
                    select: Ext.encode(record.data),
                    plazoini: plazoInicial
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 3)
                        mostrarMensaje(1, responseData.mensaje, function () {
                        });
                    else if (responseData.idsderuobl) {
                        var idsderuobl = responseData.idsderuobl;
                        var doccontb = responseData.doccontb;
                        if (idsderuobl != "-1")
                            EnviarACancelar(idsderuobl, doccontb);
                        else {
                            Ext.Msg.hide();
                            mostrarMensaje(responseData.codM, responseData.mens);
                            staddconc.load({
                                callback: function () {
                                    var data = [];
                                    data.push(record.data);
                                    reporte(data);
                                }
                            });
                            //});
                        }
                    }
                    cbxclienteod.reset();
                    cbxclienteod.disable();
                    btnacep.disable();
                    Ext.getBody().unmask();
                }
            });
        }
    }

    function EnviarACancelar(idsderuobl, doccontb) {
        Ext.Ajax.request({
            url: 'cancelarderuobl',
            params: {
                idderuobls: idsderuobl,
                doccontbs: doccontb
            },
            method: 'POST',
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                //maskguardarconc.hide();
                Ext.Msg.hide();
                mostrarMensaje(1, responseData);
            }
        });
    }

    function reporte(record) {
        keyMap.disable();
        Mascara.show();
        var arrayData = arrayrecord(true);
        cliente = -1;
        stclienteod.each(function (record) {
            // if (record.json.idestructuracliente === cbxclienteod.getValue()) {
            if (record.json.idcliente === cbxclienteod.getValue()) {
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
                codigocliente: (cliente !== -1) ? cliente.codigo : "",
                cliente: (cliente !== -1) ? cliente.nombrecliente : "",
                idReporte: (cbxtipodocod.getValue() == '1') ? 677 : 676,
                data: Ext.encode(record),
                plazoInicial: plazoInicial
            },
            callback: function (options, success, response) {
                Mascara.hide();
                var responseDataReporte = Ext.decode(response.responseText);
                if (responseDataReporte.dataSources) {
                    var defaultComponentValues = {
                        paperSize: "A4",
                        orientation: "Horizontal",
                        reportType: "HTML"
                    };
                    var printView = new SCFPrintView(responseDataReporte.dataSources, "/contabilidad/comun/SCFPrintView/", defaultComponentValues);
                    printView.on({
                        close: function () {
                            keyMap.enable();
                        }
                    });
                    printView.show();
                } else {
                    mostrarMensaje(1, 'No existen datos que mostrar');
                }

            }
        });
    }

    //funcion para el guardarconciliaciones
    function arrayrecord(includeAll) {
        var records = new Array();
        var j = 0;
        for (var i = 0; i < staddconc.getCount(); i++) {
            if (includeAll) {
                var rec = staddconc.getAt(i);
                rec.data.oldplazo = rec.json.plazo;
                records[j] = rec.data;
                j++;
            } else {
                if (staddconc.getAt(i).data.coincide != '') {
                    records[j] = staddconc.getAt(i).data;
                    j++;
                }
            }
        }
        return records;
    }

    //Ventana del buscar cliente
    function WinCrearVentana(titulo, w, h, i) {
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
                    text: '<b>Cancelar</b>',
                    handler: function () {
                        winGestionarproyecto.hide();
                        cbxclienteod.reset();
                        cbxtipodocod.reset();
                        dfdesdeod.reset();
                        dfhastaod.reset();
                    }
                }, {
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    handler: function () {
                        if (buscar.getForm().isValid()) {
                            var idtipoa = cbxtipodocod.getValue();
                            var cliente = cbxclienteod.getValue();
                            var ini = dfdesdeod.getRawValue();
                            var fin = dfhastaod.getRawValue();
                            if (band == true) {
                                staddconc.removeAll();
                            }
                            band = true;
                            staddconc.load({
                                params: {
                                    idtipoa: idtipoa,
                                    cliente: cliente,
                                    dfdesde: ini,
                                    dfhasta: fin
                                }
                            });
                            winGestionarproyecto.hide();
                            cbxclienteod.reset();
                            cbxtipodocod.reset();
                            dfdesdeod.reset();
                            dfhastaod.reset();
                            tfnodoc.reset();
                            tffechaod.reset();
                            tfplazood.reset();
                            chbxcoincide.disable();
                            chbxcancelar.disable();
                            btnaplicar.disable();
                        }
                    }
                }]
        });
        winGestionarproyecto.show();
    }

    //Para validar los rangos de fecha
    Ext.apply(Ext.form.VTypes, {
        daterange: function (val, field) {
            var date = field.parseDate(val);
            var dispUpd = function (picker) {
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

}

cargarInterfaz();
