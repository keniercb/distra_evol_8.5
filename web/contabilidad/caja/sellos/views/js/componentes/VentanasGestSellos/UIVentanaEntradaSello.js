Ext.namespace('Ext.UIVentanaEntradaSello');
Ext.UIVentanaEntradaSello= Ext.extend(Ext.Window, {
    lmask: undefined,
    url: '',
    etiquetas: undefined,
    tipoAccion: undefined,// 'add', 'mod'
    signo: undefined,//48-Entrada sello
    idmoneda: undefined,
    datosAMod: undefined,
    idProveedor: undefined,
    idAnticipo: -1,
    contador: 0,
    limiteContador: 1,
    constructor: function (params) {
        this.url = params.url;
        this.etiquetas = params.etiquetas;
        this.tipoAccion = params.tipoAccion;
        this.idmoneda = params.idmoneda;
        this.signo = 48;
        this.fechaInicioPeriodo = params.fechainicioperiodo;
        this.fechaFinPeriodo = params.fechafinperiodo;
        this.fechaContablePeriodo = params.fechacontableperiodo;
        this.datosAMod = params.datosAMod;
        this.idProveedor = params.idproveedor;
        this.idCajaFondo = params.idCajaFondo;
        this.desabiliar = this.tipoAccion !== 'add';
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.40,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: this.tipoAccion === 'add' ? ('Adicionar ' + this.etiquetas.lbTituloVentanaEntrada) : ('Modificar ' + this.etiquetas.lbTituloVentanaEntrada),
            listeners: {
                scope: this,
                show: function () {
                    if (this.tipoAccion === 'mod') {
                        this.loadMask();
                    }
                    this.formValidation(this.formUIVentanaEntradaSello, this.btnAceptar);
                },
                close: function () {
                }
            }
        });
        this.initializeStore(this);
        this.initializeClass(this);
        this.loadDataComponent(this);
        return Ext.UIVentanaEntradaSello.superclass.constructor.call(this);
    },
    loadMask: function (message = 'Cargando...') {
        this.lmask = new Ext.LoadMask(this.body, {
            msg: message
        });
        this.lmask.show();
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },//manera de ocultarlo Ext.MessageBox.hide();
    initializeStore: function (scope)
    {
        scope.stOperacion = new Ext.data.Store({
            url: scope.url + 'cargarOperacionEntrada',
            baseParams: {
                idProveedor: scope.idProveedor,
                idMoneda: scope.idmoneda,
                idAnticipo: scope.idAnticipo// pa mod me parece, por defecto -1
            },
            listeners: {
                loadexception: function (conn, b, respuesta) {
                    var response = Ext.decode(respuesta.responseText);
                    if (response.codMg == -1) {
                        mostrarMensaje(1, scope.etiquetas.lbMsgProveedorSinAnticipo)
                    } else if (response.codMg == -2) {
                        mostrarMensaje(1, scope.etiquetas.lbMsgSinOperaciones)
                    } else if (response.codMg == -3) {
                        mostrarMensaje(1, scope.etiquetas.lbMsgSinProveedor)
                    }
                    return false
                },
            },
            // autoload: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idnomoperaciones'
            }, {
                name: 'denominacion'
            }, /*{
                name: 'saldodisponible'
            }, */{
                name: 'idCuentaProveedor'
            }
            ]),
        });

        scope.stInstrumento = new Ext.data.Store({
            url: scope.url + 'cargarInstrumento',
            baseParams: undefined,
            autoload: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                idProperty: 'idInstrumento',
            }, [
                {
                    name: 'idInstrumento'
                },
            ]),
        //    data: []
        });

        scope.stAnticipo = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                idProperty: 'idanticipo',
                // totalProperty: 'total'
            }, [{
                name: 'idanticipo'
            }, {
                name: 'numerodocumento'
            }, {
                name: 'iddocumento'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'importemo'
            }, {
                name: 'pendiente'
            }])
        });
    },
    loadDataComponent: function(scope)
    {
        if (scope.tipoAccion === 'mod') {
            scope.dateFieldFecha.setValue(scope.datosAMod.get('fecha'));
            scope.nfImporte.setValue(scope.datosAMod.get('importemo'));

            scope.stOperacion.load({
                callback: function (record, opt, success) {
                    scope.cbOperacion.setValue(scope.datosAMod.get('idoperacion'));
                    var indexAnticipo = scope.stAnticipo.find('idanticipo', scope.datosAMod.get('idanticipo'));
                    var dataAnticipo = scope.stAnticipo.getAt(indexAnticipo);
                    if (dataAnticipo)
                    scope.smGpAnticipo.fireEvent('rowselect', scope.smGpAnticipo, indexAnticipo, dataAnticipo);
                    scope.storesCargados();
                    scope.formValidation(scope.formUIVentanaEntradaSello, scope.btnAceptar);
                    // scope.cbAnticipo.setValue(scope.datosAMod.get('idanticipo'));
                    // scope.cbAnticipo.setRawValue(scope.datosAMod.get('numerodocumentoinst'));
                }
            });
        } else {
			scope.stOperacion.load();
		}
    },
    initializeClass: function (scope) {
        this.createButtons(scope);
        this.createForm(scope);
        this.initFunctions(scope);
        this.initEventos(scope);
    },
    //Funcion para habilitar o desabilitar el boton aceptar en depencia de si es correcto o no el formulario
    //se le pasa el Ext.FormPanel , Ext.Button y una funcion opcional para mas comprobacion
    formValidation: function (formPanel, button, adicionalFuncion = undefined) {
        if (formPanel instanceof Ext.FormPanel && button instanceof Ext.Button) {
            if (formPanel.hasListener('clientvalidation')) {
                formPanel.events['clientvalidation'].clearListeners();
            }
            var valorInicial = formPanel.getForm().getValues(true);
            formPanel.on({
                clientvalidation: function (fpanel, valid) {
                    var valor = fpanel.getForm().getValues(true);
                    if (typeof adicionalFuncion === 'function') {
                        button.setDisabled(!(valorInicial !== valor && valid && adicionalFuncion()))
                    } else {
                        button.setDisabled(!(valorInicial !== valor && valid));
                    }
                }
            });
        }
    },
    createButtons: function (scope) {
        scope.btnCancelar = new Ext.Button({
            id:'idbtnCancelar',
            tooltip: scope.etiquetas.lbToolCancelar,
            text: scope.etiquetas.lbCancelar,
            iconCls: 'cancelar',
        });

        scope.btnAceptar = new Ext.Button({
            id:'idbtnAceptar',
            tooltip: scope.etiquetas.lbToolAceptar,
            text: scope.etiquetas.lbAceptar,
            iconCls: 'aceptar',
            disabled: true
        });

        scope.buttons = [scope.btnCancelar, scope.btnAceptar];
    },
    createForm: function (scope) {

        //Grid Anticipo renderizado en el combox----------------------------------

        scope.gpAnticipo = new Ext.grid.GridPanel({
            border: false,
            height: 200,
            split: true,
            autoExpanColunm: 'numerodocumento',
            frame: false,
            loadMask: true,
            viewConfig: {
                forceFit: true
            },
            store: scope.stAnticipo,
            sm: scope.smGpAnticipo = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [
                {
                    sortable: true,
                    header: scope.etiquetas.lbNoInstrumento,
                    hideable: true,
                    id: 'numerodocumento',
                    dataIndex: 'numerodocumento'
                }, {
                    sortable: true,
                    width: 50,
                    header: scope.etiquetas.lbFecha,
                    hideable: true,
                    dataIndex: 'fechacreacion'
                }, {
                    header: scope.etiquetas.lbImportePendiente,
                    sortable: true,
                    hideable: true,
                    width: 50,
                    dataIndex: 'pendiente',
                    renderer: formatoMoneda
                }
            ]
        });
        scope.smGpAnticipo.on('rowselect', function (sm, index, record) {
            scope.cbAnticipo.setValue(record.data.idanticipo);
            scope.cbAnticipo.setRawValue(record.data.numerodocumento);
            if (scope.tipoAccion === 'mod' && record.data.idanticipo == scope.datosAMod.get('idanticipo'))
                var totalPendiente = parseFloat(record.data.pendiente) + parseFloat(scope.datosAMod.get('importemo'));
            else totalPendiente = record.data.pendiente;
            // me.nfImportePendiente.setRawValue(formatoMoneda(totalPendiente));
            scope.nfImportePendiente.setValue(parseFloat(totalPendiente).toFixed(2));
            scope.nfImporte.enable();
            scope.nfImporte.focus();
            scope.cbAnticipo.collapse();
        });

        scope.cbAnticipo = new Ext.form.ComboBox({
            fieldLabel: 'No. Instrumento',
            // fieldLabel: scope.etiquetas.lbInstrumento,
            store: scope.stCbAnticipo = new Ext.data.SimpleStore({
                fields: [{name: 'idanticipo'}, {name: 'numerodocumento'}],
                data: [[]]
            }),
            valueField: 'idanticipo',
            hiddenName: 'idanticipo',
            mode: 'local',
            displayField: 'numerodocumento',
            disabledClass: 'disabled-component',
            // forceSelection: true,
            allowBlank: false,
            resizable: false,
            // readOnly: true,
            editable: false,
            triggerAction: 'all',
            anchor: '98%',
            tpl: '<div id = \"cmbanticipo\" style = \"height:200px; !important;\"></div>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                expand: function (combo) {
                    if (!scope.gpAnticipo.rendered) {
                        scope.gpAnticipo.render('cmbanticipo');
                    }
                }
            }

        });
        //---------------------------------------

        // scope.cbInstrumento = new Ext.form.ComboBox({
        //     emptyText: 'Seleccione...',
        //     fieldLabel: scope.etiquetas.lbInstrumento,
        //     allowBlank: false,
        //     store: scope.stInstrumento,
        //     valueField: 'idInstrumento',
        //     displayField: 'Instrumento',
        //     hiddenName: 'idInstrumento',
        //     typeAhead: true,
        //     anchor: '100%',
        //     mode: 'remote',
        //     pageSize: 20,
        //     minChars: 3,
        //     resizable: false,
        //     triggerAction: 'all',
        //     enableKeyEvents: true,
        //     forceSelection: true,
        // });

        scope.dateFieldFecha = new Ext.form.DateField({
            id: 'iddateFieldFecha',
            name: 'dateFieldFecha',
            fieldLabel: scope.etiquetas.lbFecha,
            hideLabel: false,
            readOnly: false,
            editable: false,
            hidden: false,
            disabled: false,
            value: scope.fechaContablePeriodo,
            minValue: scope.fechaInicioPeriodo,
            maxValue: scope.fechaFinPeriodo,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            anchor: '100%'
        });

        scope.nfImportePendiente = new Ext.form.NumberField({
            id: 'idnfImportePendiente',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbImportePendiente,
            name: 'ImportePendiente',
            style: 'text-align: right',
            allowDecimals: true,
            enableKeyEvents: false,
            allowBlank: false,
            maxLength: 24,
            disabled: true,
            emptyText: '0.00',
            anchor: '100%'
        });

        scope.nfImporte = new Ext.form.NumberField({
            id: 'idnfImporte',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbImporte,
            name: 'Importe',
            style: 'text-align: right',
            allowDecimals: true,
            disabled: true,
            enableKeyEvents: false,
            allowBlank: false,
            maxLength: 24,
            emptyText: '0.00',
            anchor: '100%',
            validator: function (value) {
                //---Validar importe pendiente
                if (value > scope.nfImportePendiente.getValue())
                    return 'El importe no puede ser mayor que ' + scope.nfImportePendiente.getRawValue();
                else if (value == 0)
                    return 'El importe no puede ser 0.';
                else return true;
            },
        });

        scope.cbOperacion = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            fieldLabel: scope.etiquetas.lbOperacion,
            allowBlank: false,
            store: scope.stOperacion,
            valueField: 'idnomoperaciones',
            hiddenName: 'idnomoperaciones',
            displayField: 'denominacion',
            typeAhead: true,
            anchor: '100%',
            mode: 'local',
            //pageSize: 20,
            //minChars: 3,
            resizable: false,
            triggerAction: 'all',
            enableKeyEvents: true,
            forceSelection: true,
			//selectOnFocus: true,
        });

        scope.formUIVentanaEntradaSello = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            // trackResetOnLoad: true,
            items: [
                {
                    layout: 'column',
                    items: [{
                        columnWidth: .75,
                        layout: 'form',
                        items: [scope.cbOperacion]
                    },{
                        columnWidth: .25,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [scope.dateFieldFecha]
                    },
                    ]
                },
                {
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [scope.cbAnticipo]
                },{
                    columnWidth: .25,
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    items: [scope.nfImportePendiente]
                },{
                    columnWidth: .25,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    items: [scope.nfImporte]
                },
                ]
            }
            ]
        });

        scope.items = [scope.formUIVentanaEntradaSello];
    },
    initFunctions: function (scope) {

        scope.storesCargados = function () {
            scope.contador = scope.contador + 1;
            if (scope.contador == scope.limiteContador) {
                scope.lmask.hide();
            }
        };

    },
    initEventos: function (scope) {
        scope.btnCancelar.setHandler(function () {
            scope.close();
        });

        scope.addEvents('success');
        scope.btnAceptar.setHandler(function () {
            var formulario = scope.formUIVentanaEntradaSello.getForm();
            if (formulario.isValid()) {
                scope.loadMessageBox();
                // formulario.submit({
                //     url: scope.url + 'adicionarEntrada',
                //     reset: false,
                //     success: function (form, action) {
                //         Ext.MessageBox.hide();
                //         scope.fireEvent('success', true);
                //         scope.close();
                //     },
                //     failure: function (form, action) {
                //         scope.close();
                //     }
                // });
                var index = scope.stAnticipo.find('idanticipo', scope.cbAnticipo.getValue());
                var record = scope.stAnticipo.getAt(index);
                Ext.Ajax.request({
                    scope: this,
                    method: "POST",
                    timeout: 30000,
                    params: {
                        idOperacion: scope.cbOperacion.getValue(),
                        idmovimientosello: scope.tipoAccion === 'mod' ? scope.datosAMod.get('idmovimientosello') : -1,
                        importe: scope.nfImporte.getValue(),
                        idCajaFondo: scope.idCajaFondo,
                        fecha: scope.dateFieldFecha.getRawValue(),
                        idDocumentoAnt: record.get('iddocumento'),
                        idAnticipo: scope.cbAnticipo.getValue(),
                    },
                    url: scope.url + "saveEntradaSello",
                    callback: function (options, success, response) {
                        var saveEntradaSello = Ext.decode(response.responseText);
                        Ext.MessageBox.hide();
                        if (saveEntradaSello.codMg == 1) {
                            if (scope.datosAMod) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgModificacionSatisfactoriaEntrada);
                            } else {
                                mostrarMensaje(1, scope.etiquetas.lbMsgAdicionSatisfactoriaEntrada);
                            }
                            scope.fireEvent('success', true);
                        } else if (saveEntradaSello.codMg == 2) {
                            mostrarMensaje(1, scope.etiquetas.lbMsgSinOperaciones);
                        } else {
                            if (scope.datosAMod) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgModificacionFallidaEntrada);
                            } else {
                                mostrarMensaje(1, scope.etiquetas.lbMsgAdicionFallidaEntrada);
                            }
                        }
                        scope.close();
                    }
                });
            }
        });

        // scope.stOperacion.on({
        //     load: function () {
        //         // scope.cbOperacion.setValue(select.data.idoperacion);
        //         //Seleccionar el anticipo
        //         var indexAnticipo = scope.stAnticipo.find('idanticipo', scope.cbAnticipo.getValue());
        //         var dataAnticipo = scope.stAnticipo.getAt(indexAnticipo);
        //         scope.smGpAnticipo.fireEvent('rowselect', scope.smGpAnticipo, indexAnticipo, dataAnticipo);
        //
        //         // this.lMask.hide();
        //     }
        // });

        scope.stOperacion.on({
            load: function (st, records) {
                if (records.length == 1) {
                    scope.cbOperacion.setValue(records[0].data.idnomoperaciones);
					scope.cbOperacion.setRawValue(records[0].data.denominacion);
                    scope.cbOperacion.fireEvent('select', scope.cbOperacion, records[0]);
                }
                // scope.lMask.hide();
            },
            beforeload: function (st) {
                // if (st.getTotalCount() == 0)
                // scope.lMaskCargando();
            },
            loadexception: function (st) {
                var respuesta = Ext.decode(scope.stOperacion.reader.jsonData);
                if (respuesta.codMg == -1) {
                    // mostrarMensaje(1, scope.idioma.lbNoCtaPagoAntcipado);
                }
                if (respuesta.codMg == -2) {
                    // mostrarMensaje(1, scope.idioma.lbNoOperacionRecarga);
                }
                // scope.lMask.hide();
                // scope.close();
            }
        });

        scope.cbOperacion.on({
            select: function (cb, record) {
                scope.stAnticipo.loadData(record.json.data_anticipo);
                scope.idCuentaProveedor = record.data.idCuentaProveedor;

                /* var totalDisponible = 0;
                if (me.action == 'add')
                    totalDisponible = parseFloat(record.data.saldodisponible);
                else
                    totalDisponible = parseFloat(record.data.saldodisponible) + parseFloat(me.scope.smRecarga.getSelected().data.importemo);

                me.nfSaldoDisponible.setValue(totalDisponible);
                me.nfSaldoDisponible.setRawValue(formatoMoneda(totalDisponible));*/

                // if (record.data.saldodisponible == 0) {
                if (record.json.data_anticipo.length == 0) {
                    // mostrarMensaje(1, scope.idioma.lbNoSaldoDisp);
                    // scope.nfImporte.reset();
                    // scope.nfImporte.isValid();
                }
            }
        });

    },
});