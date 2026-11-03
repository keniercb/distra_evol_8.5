Ext.namespace('Ext.UIVentanaAnticipoSello');
Ext.UIVentanaAnticipoSello = Ext.extend(Ext.Window, {
    lmask: undefined,
    url: undefined,
    etiquetas: undefined,
    tipoAccion: undefined,// 'add', 'mod', 'liq'(solo el anticipo se puede liquidar)
    tipoVentana: undefined,// 2-anticipo 3-Liquidacion
    datosAMod: undefined,
    contador: 0,
    limiteContador: 1,
    signo: undefined,// 46-anticipo sello 47-liquidacion sello
    constructor: function (params) {
        this.url = params.url;
        this.etiquetas = params.etiquetas;
        this.tipoAccion = params.tipoAccion;
        this.tipoVentana = params.tipoVentana;
        this.idmoneda = params.idmoneda;
        this.fechaInicioPeriodo = params.fechainicioperiodo;
        this.fechaFinPeriodo = params.fechafinperiodo;
        this.fechaContablePeriodo = params.fechacontableperiodo;
        this.idCajaFondo = params.idCajaFondo;//new
        this.datosAMod = params.datosAMod;
        this.SaldoFondo = params.SaldoFondo;
        this.desabiliar = this.tipoAccion === 'liq';
        this.signo = (this.tipoVentana === 2 && this.tipoAccion === 'liq') || this.tipoVentana === 3 ? 47 : 46;
        if (this.tipoVentana === 3) {
            this.etiquetas.lbTituloVentanaAnticipo = 'liquidaci&oacute;n';
        }
        var title = this.tipoAccion === 'mod' ? ('Modificar ' + this.etiquetas.lbTituloVentanaAnticipo) : (this.tipoAccion === 'liq' ? 'Liquidar ' + this.etiquetas.lbTituloVentanaAnticipo : 'Adicionar ' + this.etiquetas.lbTituloVentanaAnticipo);
        Ext.apply(this, {
            // autoValidate: !(this.tipoVentana === 3 || this.tipoAccion === 'liq'),
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.40,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: title,
            listeners: {
                scope: this,
                show: function () {
                    if (this.tipoAccion === 'mod' || this.tipoAccion === 'liq') {
                        this.loadMask();
                    } else {
                        this.stOperacion.load();
                        this.formValidation(this.formUIVentanaAnticipoSello, this.btnAceptar);
                    }
                },
                close: function () {
                }
            }
        });
        this.initializeStore(this);
        this.initializeClass(this);
        this.loadDataComponent(this);
        return Ext.UIVentanaAnticipoSello.superclass.constructor.call(this);
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
    initializeStore: function (scope) {
        scope.stOperacion = new Ext.data.Store({
            url: scope.url + 'cargarOperacion',
            baseParams: {
                signo: scope.signo,
                idmoneda: scope.idmoneda
            },
            listeners: {
                loadexception: function (conn, b, respuesta) {
                    var response = Ext.decode(respuesta.responseText);
                    if (response.codMg == -1) {

                    } else if (response.codMg == -2) {
                        mostrarMensaje(1, scope.etiquetas.lbMsgSinOperaciones)
                    }
                    return false
                }
            },
            // autoload: true,
            reader: new Ext.data.JsonReader({
                root: 'operacion',
                totalProperty: 'cantidad',
                idProperty: 'idnomoperaciones'
            }, [
                {
                    name: 'idoperacion', mapping: 'idnomoperaciones'
                },
                {
                    name: 'nombreoperacion', mapping: 'denominacion'
                }
            ])
        });

        scope.stTrabajador = new Ext.data.Store({
            url: scope.url + 'cargarDatosPersona',
            baseParams: {
                query: undefined,
                start: 0,
                limit: 10
            },
            // autoload: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cantidad',
                idProperty: 'idpersona'
            }, [
                {
                    name: 'idpersona'
                },
                {
                    name: 'nombre', mapping: 'nombreapellidos'
                }
            ])
        });

        scope.recordGridLiq = Ext.data.Record.create([
            {name: 'idcuenta'},
            {name: 'nomcuenta'},
            {name: 'idliquidacion', type: 'string'},
            {name: 'importe', type: 'float'}
        ]);


        scope.stGridLiq = new Ext.data.Store({
            url: 'cargarGridLiq',
            // params: scope.tipoAccion === 'mod' ? {idmovimento: scope.datosAMod.get('idmovimentosello') } : {idmovimento: ''},
            autoload: false,
            reader: new Ext.data.JsonReader({
            }, scope.recordGridLiq)
        });

        scope.recordCuenta = Ext.data.Record.create([
            {name: 'idCuenta', mapping: 'Cuenta', type: 'int'}
        ]);

        scope.stCuenta = new Ext.data.Store({
            url: 'cargarCuenta',
            baseParams: undefined,
            autoload: false,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                idProperty: 'idCuenta'
            }, scope.recordCuenta)
            //    data: []
        });

        scope.stCuentaLiq = new Ext.data.Store({
            url: 'loadDataCuenta',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idcuenta'
            },
                {
                    name: 'text'
                }
            ])
        });
    },
    loadDataComponent: function (scope) {
        if (scope.tipoAccion === 'mod' || (scope.tipoAccion === 'liq')) {
            scope.dateFieldFecha.setValue(scope.datosAMod.get('fecha'));
            scope.tfComentario.setValue(scope.datosAMod.get('comentario'));
            scope.nfImporte.setValue(scope.datosAMod.get('importemo'));

            if (scope.tipoAccion === 'mod') {
                scope.limiteContador = 2;
                scope.stOperacion.load({
                    callback: function (records, opt, success) {
                        var index = scope.stOperacion.find('idoperacion', scope.datosAMod.get('idoperacion'));
                        scope.cbOperacion.setValue(scope.datosAMod.get('idoperacion'));
                        scope.cbOperacion.fireEvent('select', null, null, index);
                        scope.storesCargados();
                    }
                });
                if (scope.tipoVentana === 3) {
                    scope.limiteContador = 3;
                    scope.stGridLiq.baseParams.idmovimiento = scope.datosAMod.get('idmovimientosello');
                    scope.stGridLiq.load({
                        callback: function (record, opt, success) {
                            scope.btnAdicionarLiq.enable();
                            scope.cbCuentaLiq.enable();
                            scope.storesCargados();
                        }
                    });
                }
            } else {
                scope.stOperacion.load();
            }

            scope.stTrabajador.load({
                callback: function (record, opt, success) {
                    scope.cbTrabajador.setValue(scope.datosAMod.get('idpersona'));
                    scope.storesCargados();
                }
            });
            scope.tfIdDoc.setValue(scope.datosAMod.get('iddocumento'));
            scope.tfIdMovSello.setValue(scope.datosAMod.get('idmovimientosello'));
        }

        scope.nfTipo.setValue(scope.tipoVentana);
        scope.tfCajafondo.setValue(scope.idCajaFondo);
    },
    initializeClass: function (scope) {
        this.createButtons(scope);
        this.setWindowItems(scope);
        this.initFunctions(scope);
        this.initEventos(scope);
    },
    createButtons: function (scope) {
        scope.btnCancelar = new Ext.Button({
            id: 'Cancelar',
            tooltip: scope.etiquetas.lbToolCancelar,
            text: scope.etiquetas.lbCancelar,
            iconCls: 'cancelar'
        });

        scope.btnAceptar = new Ext.Button({
            id: 'Aceptar',
            tooltip: scope.etiquetas.lbToolAceptar,
            text: scope.etiquetas.lbAceptar,
            iconCls: 'Aceptar'
            // disabled: true
        });

        scope.buttons = [scope.btnCancelar, scope.btnAceptar];
    },
    createForm: function (scope) {
        scope.cbTrabajador = new Ext.form.ComboBox({
            id: 'idcbTrabajador',
            emptyText: 'Seleccione...',
            fieldLabel: scope.etiquetas.lbTrabajador,
            allowBlank: false,
            store: scope.stTrabajador,
            valueField: 'idpersona',
            displayField: 'nombre',
            hiddenName: 'idpersona',
            typeAhead: true,
            anchor: '100%',
            mode: 'remote',
            pageSize: 10,
            minChars: 3,
            resizable: false,
            triggerAction: 'all',
            enableKeyEvents: true,
            disabledClass: 'disabled-component',
            disabled: scope.desabiliar
        });

        scope.dateFieldFecha = new Ext.form.DateField({
            id: 'iddateFieldFecha',
            name: 'fecha',
            fieldLabel: scope.etiquetas.lbFecha,
            hideLabel: false,
            readOnly: false,
            editable: false,
            allowBlank: false,
            hidden: false,
            value: scope.fechaContablePeriodo,
            minValue: scope.fechaInicioPeriodo,
            maxValue: scope.fechaFinPeriodo,
            disabled: scope.desabiliar,
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            anchor: '100%'
        });

        scope.cbOperacion = new Ext.form.ComboBox({
            id: 'idcbOperacion',
            emptyText: 'Seleccione...',
            fieldLabel: scope.etiquetas.lbOperacion,
            allowBlank: false,
            editable: false,
            disabledClass: 'disabled-component',
            store: scope.stOperacion,
            valueField: 'idoperacion',
            displayField: 'nombreoperacion',
            hiddenName: 'idoperacion',
            typeAhead: true,
            anchor: '100%',
            resizable: false,
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true
            // disabled: scope.desabiliar,
        });

        scope.tfComentario = new Ext.form.TextField({
            id: 'idtfComentario',
            name: 'comentario',
            fieldLabel: scope.etiquetas.lbComentario,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 100,
            editable: false,
            disabled: scope.desabiliar,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: false
        });

        scope.nfImporte = new Ext.form.NumberField({
            id: 'idnfImporte',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbImporte,
            name: 'importe',
            style: 'text-align: right',
            allowDecimals: true,
            enableKeyEvents: false,
            allowBlank: false,
            maxLength: 24,
            maxValue: scope.tipoAccion === 'add' ? scope.SaldoFondo : (parseFloat(scope.SaldoFondo) + parseFloat(scope.datosAMod.get('importemo'))),
            maskRe: undefined,
            regex: undefined,
            maxLengthText: undefined,
            regexText: undefined,
            emptyText: '0.00',
            anchor: '100%',
            disabled: scope.desabiliar || scope.tipoVentana === 3
        });

        if (scope.tipoAccion == 'liq') {
            scope.nfImportePendiente = new Ext.form.NumberField({
                id: 'idnfImportePendiente',
                disabledClass: 'disabled-component',
                selectOnFocus: true,
                fieldLabel: scope.etiquetas.lbImporte,
                name: 'importependiente',
                style: 'text-align: right',
                allowDecimals: true,
                allowBlank: false,
                readOnly: true,
                maxValue: parseFloat(scope.datosAMod.get('importemo')),
                maskRe: undefined,
                regex: undefined,
                maxLengthText: undefined,
                regexText: undefined,
                anchor: '100%',
                hidden: true
            });
        }

        scope.nfTipo = new Ext.form.NumberField({
            id: 'idnfTipo',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbTipo,
            name: 'tipo',
            style: 'text-align: right',
            allowDecimals: true,
            enableKeyEvents: false,
            allowBlank: false,
            maxLength: 24,
            maskRe: undefined,
            regex: undefined,
            maxLengthText: undefined,
            regexText: undefined,
            emptyText: '0.00',
            anchor: '100%',
            disabled: false
        });

        scope.tfCajafondo = new Ext.form.TextField({
            id: 'idnfCajafondo',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbCajafondo,
            name: 'idcajafondo',
            style: 'text-align: right',
            anchor: '100%'
        });

        scope.tfIdDoc = new Ext.form.TextField({
            id: 'idnfIdDoc',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbIdDoc,
            name: 'iddocumento',
            style: 'text-align: right',
            anchor: '100%'
        });

        scope.tfIdMovSello = new Ext.form.TextField({
            id: 'idnfidMovSello',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbIdMovSello,
            name: 'idmovimientosello',
            style: 'text-align: right',
            anchor: '100%'
        });


        scope.nfImporteLiq = new Ext.form.NumberField({
            id: 'idnfImporteLiq',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbImporte,
            name: 'ImporteLiq',
            style: 'text-align: right',
            allowDecimals: true,
            enableKeyEvents: false,
            allowBlank: false,
            maxLength: 24,
            maskRe: undefined,
            regex: undefined,
            maxLengthText: undefined,
            regexText: undefined,
            emptyText: '0.00',
            anchor: '100%'
        });

        scope.formUIVentanaAnticipoSello = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [scope.cbTrabajador]
                }
                ]
            },  {
                layout: 'column',
                items: [{
                    columnWidth: scope.tipoVentana !== 3 ? .60 : 1,
                    layout: 'form',
                    items: [scope.dateFieldFecha]
                }, {
                    columnWidth: .40,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    hidden: scope.tipoVentana === 3,
                    items: [scope.nfImporte]
                }
                ]
            },
            {
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [scope.tfComentario]
                }]
            },{
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [scope.cbOperacion]
                }]
            },
            {
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    hidden: !(scope.tipoVentana === 3 || scope.tipoAccion === 'liq'),
                    items: [scope.createGrid(scope)]
                }
                ]
            },
                {
                    layout: 'column',
                    hidden: true,
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.nfTipo]
                    }]
                },
                {
                    layout: 'column',
                    hidden: true,
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.tfIdDoc]
                    }]
                },
                {
                    layout: 'column',
                    hidden: true,
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.tfIdMovSello]
                    }]
                },
                {
                    layout: 'column',
                    hidden: true,
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.tfCajafondo]
                    }]
                },

                {
                    layout: 'column',
                    hidden: true,
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: scope.tipoAccion == 'liq' ? [scope.nfImportePendiente] : undefined
                    }]
                }
            //     {
            //     layout: 'column',
            //     items: [{
            //         columnWidth: 1,
            //         layout: 'form',
            //         items: (this.tipoAccion === 'liq' || this.tipoVentana === 3) ? [this.createGrid(scope)] : undefined
            //     }]
            // },
            ]
        });


        return scope.formUIVentanaAnticipoSello;
    },
    createGrid: function (scope) {
        scope.arrLiqRemovidos = [];

        scope.btnAdicionarLiq = new Ext.Button({
            id: 'idbtnAdicionarLiq',
            tooltip: scope.etiquetas.lbToolAdicionarLiq,
            text: scope.etiquetas.lbAdicionar,
            iconCls: 'adicionar',
            disabled: true
        });

        scope.cbCuentaLiq = new Ext.contabilidad.util.linkedCombo({
            store: scope.stCuentaLiq,
            fieldLabel: 'Cuentas',
            displayField: 'text',
            valueField: 'idcuenta',
            name: 'idcuenta',
            disabled: true,
            hideTbar: true,
            listHeight: 200,
            // tabIndex: 11,
            anchor: '100%',
            mode: 'local',
            loaded: true,
            id: 'cbxCuenta',
            listeners: {
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        scope.nfImporteLiq.focus(true, 100);
                },
                select: function (cb, record) {
                    var index = scope.stGridLiq.find('idcuenta', cb.getValue());
                    if (index != -1) {
                        scope.cbCuentaLiq.reset();
                        mostrarMensaje(1, scope.etiquetas.lbMsgCuentaRepetida);
                    } else {
                        scope.nfImporteLiq.focus(true, 100);
                    }
                }
            }
        });

        scope.nfImporteLiq = new Ext.form.NumberField({
            id: 'idnfImporteLiq',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.etiquetas.lbImporte,
            name: 'ImporteLiq',
            style: 'text-align: right',
            allowDecimals: true,
            enableKeyEvents: false,
            allowBlank: false,
            maxLength: 24,
            maskRe: undefined,
            regex: undefined,
            maxLengthText: undefined,
            regexText: undefined,
            emptyText: '0.00',
            anchor: '100%'
        });

        scope.rowaction = new Ext.grid.RowActions({
            id: 'idRowactionLiq',
            actions: [
                {
                    id: 'eliminar',
                    // tooltip: scope.etiquetas.lbToolDel,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        scope.roweditorLiq = new Ext.Cont.RowEditor({
            id: 'idRoweditorLiq',
            clicksToEdit: 2,
            cancelText: scope.etiquetas.lbCancelar,
            saveText: scope.etiquetas.lbAceptar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar'
            // saveTooltip: scope.etiquetas.lbToolRowEditorAceptar,
            // cancelTooltip: scope.etiquetas.lbToolRowEditorCancelar
        });


        scope.tbarLiq = new Ext.Toolbar({
            hidden: false,
            items: [scope.btnAdicionarLiq]
        });

        scope.selModelLiq = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        scope.columnModelLiq = new Ext.grid.ColumnModel([
            {id: 'idcuenta', header: scope.etiquetas.lbCuenta, dataIndex: 'idcuenta', sortable: false, resizable: false, editor: scope.cbCuentaLiq,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    if (record.data.nomcuenta != '')
                        return record.data.nomcuenta;
                    else return scope.cbCuentaLiq.displayFieldTemp;
                }.bind(this)},
            {header: scope.etiquetas.lbImporte, width: 150, dataIndex: 'importe', sortable: false, resizable: false, editor: scope.nfImporteLiq, renderer: 'usMoney'},
            scope.rowaction
        ]);

        scope.gridPanelLiq = new Ext.grid.EditorGridPanel({
            id: 'idgridPanelLiq',
            // title: scope.etiquetas.lbgridPanelLiq,
            autoExpandColumn: 'idcuenta',
            loadMask : true,
            cm: scope.columnModelLiq,
            store: scope.stGridLiq,
            sm: scope.selModelLiq,
            height: 200,
            tbar: scope.tbarLiq,
            plugins: [scope.roweditorLiq, scope.rowaction]
        });

        scope.initEventosGrid(scope);

        return scope.gridPanelLiq;
    },
    setWindowItems: function (scope) {
        this.items = [this.createForm(scope)];
    },
    initFunctions: function (scope) {
        scope.storesCargados = function () {
            scope.contador = scope.contador + 1;
            if (scope.contador == scope.limiteContador) {
                if (!(scope.tipoVentana === 3 || scope.tipoAccion === 'liq')) {
                    scope.formValidation(scope.formUIVentanaAnticipoSello, scope.btnAceptar);
                }
                scope.lmask.hide();
            }
        };

        scope.deleteLiq = function (grid, record) {
            grid.getStore().remove(record);
            scope.nfImportePendiente.setValue(scope.calcularImporteRestante());
            if (grid.getStore().getCount() == 0)
                scope.cbOperacion.enable();
            else scope.cbOperacion.disable();
        };

        scope.calcularImporteRestante = function () {
            var arrDatos = scope.stGridLiq.getRange();
            var sum = 0;
            for (var i = 0; i < arrDatos.length; i++) {
                if (arrDatos[i].get('importe')) {
                    sum += parseFloat(arrDatos[i].get('importe'));
                } else {
                    sum = 0;
                    break;//Si hay alguno que no tenga importe le asigno 0 a la suma entera y termino el for
                }
            }
            if (sum === 0) {
                return '';
            } else {
                return sum;
            }
        };
    },
    initEventosGrid: function (scope) {
        scope.btnAdicionarLiq.setHandler(function () {
            var total = scope.stGridLiq.getCount();
            scope.stGridLiq.add(new scope.recordGridLiq({
                idcuenta: undefined,
                importe: undefined,
                nomcuenta: ''
            }));
            scope.selModelLiq.selectRow(total);
            scope.roweditorLiq.startEditing(total);
        });

        scope.stGridLiq.on('add', function (store, records, index) {
            scope.cbOperacion.disable();
        });

        scope.stGridLiq.on('remove', function (store, records, index) {
            if (store.getCount() === 0) {
                scope.cbOperacion.enable();
            }
            if (scope.tipoAccion === 'mod' && records.get('idliquidacion')) {
                scope.arrLiqRemovidos.push({
                    idcuenta: records.get('idcuenta'),
                    importemo: records.get('importe'),
                    idliquidacion: records.get('idliquidacion')
                });
            }
        });

        scope.cbOperacion.on('select', function () {
            scope.btnAdicionarLiq.enable();
        });

        scope.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, scope.etiquetas.lbPregEliminar, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.deleteLiq(grid, record);
                        }
                    });
                    break;
            }
        });

        scope.roweditorLiq.on({
            afteredit: function (editor, grid, changes, record, rowIndex) {
                scope.btnAdicionarLiq.enable();
                record.data.nomcuenta = scope.cbCuentaLiq.displayFieldTemp;
                scope.nfImportePendiente.setValue(scope.calcularImporteRestante());
                if (scope.nfImportePendiente.getValue() > parseFloat(scope.datosAMod.get('importemo'))) {
                    mostrarMensaje(1, 'El importe total a liquidar no puede ser mayor que el importe del anticipo.');
                }
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                scope.cbCuentaLiq.setValue(record.data.idcuenta, record.data.nomcuenta);
                scope.nfImportePendiente.setValue(scope.calcularImporteRestante());
            },
            canceledit: function (roweditor, grid, record, rowIndex) {

            },
            validateedit: function (roweditor, grid, changes, record, rowIndex) {

            },
            oninitsetvalue: function (roweditor, field, record) {

            }
        });

    },
    initEventos: function (scope) {
        scope.btnCancelar.setHandler(function () {
            scope.close();
        });

		scope.stOperacion.on({
            load: function (st, records) {
                if (records.length == 1 && scope.tipoAccion != 'mod') {
                    scope.cbOperacion.setValue(records[0].data.idoperacion);
					scope.cbOperacion.setRawValue(records[0].data.nombreoperacion);
                    scope.cbOperacion.fireEvent('select', scope.cbOperacion, records[0], 0);
                }
                // scope.lMask.hide();
            }
        });


        scope.addEvents('success');
        // scope.fireEvent('adicionarAnticipo', scope.formUIVentanaAnticipoSello.getForm().getValues(false))
        scope.btnAceptar.setHandler(function () {
            var formulario = scope.formUIVentanaAnticipoSello.getForm();
            if (formulario.isValid()) {
                if (scope.tipoAccion !== 'liq') {
                    scope.loadMessageBox();
                    if (scope.tipoVentana === 3) {
                        var data = scope.stGridLiq.getRange();
                        var TotalLiq = 0;
                        var arrayCuentas = [];
                        for (var i = 0; i < data.length; i++) {
                            TotalLiq += data[i].get('importe');
                            arrayCuentas.push({
                                idcuenta: data[i].get('idcuenta'),
                                importemo: data[i].get('importe'),
                                idliquidacion: data[i].get('idliquidacion'),
                            });
                        }
                        if (TotalLiq > scope.datosAMod.get('importemo')) {
                            mostrarMensaje(1, 'No puede liquidar más que el importe original.');
                            return false;
                        }
                    }
                    Ext.Ajax.request({
                        scope: this,
                        method: "POST",
                        timeout: 30000,
                        params: {
                            idpersona: scope.cbTrabajador.getValue(),
                            fecha1: scope.dateFieldFecha.getValue(),
                            comentario: scope.tfComentario.getValue(),
                            idoperacion: scope.cbOperacion.getValue(),
                            tipo: scope.nfTipo.getValue(),
                            iddocumento: scope.tfIdDoc.getValue(),
                            idmovimientosello: scope.tfIdMovSello.getValue(),
                            idcajafondo: scope.tfCajafondo.getValue(),
                            fecha: scope.dateFieldFecha.getRawValue(),
                            importe: scope.tipoVentana === 3 ? TotalLiq : scope.nfImporte.getValue(),
                            importeanterior: scope.tipoAccion === 'mod' ? scope.datosAMod.get('importemo') : 0,
                            cuentas: scope.tipoVentana === 3 ? Ext.encode(arrayCuentas) : undefined,
                            cuentasRemovidas: (scope.tipoVentana === 3 && scope.arrLiqRemovidos) ? Ext.encode(scope.arrLiqRemovidos) : undefined,
                            // idcuenta: scope.cbCuentaLiq.getSelections(),
                        },
                        url: scope.url + "adicionarSello",
                        callback: function (options, success, response) {
                            var adicionarSello = Ext.decode(response.responseText);
                            if (adicionarSello.codMg == 1) {
                                if (scope.tfIdMovSello.getValue()) {
                                    mostrarMensaje(1, scope.etiquetas.lbMsgModificacionSatisfactoria);
                                } else {
                                    mostrarMensaje(1, scope.etiquetas.lbMsgAdicionSatisfactoria);
                                }
                                scope.fireEvent('success', true);
                            } else if (adicionarSello.codMg == -1) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgSinOperaciones);
                            } else if (adicionarSello.codMg == -2) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgFondoInsufisiente);
                            } else {
                                if (scope.tfIdMovSello.getValue()) {
                                    mostrarMensaje(1, scope.etiquetas.lbMsgModificacionFallida);
                                } else {
                                    mostrarMensaje(1, scope.etiquetas.lbMsgAdicionFallida);
                                }
                            }
                            Ext.MessageBox.hide();
                            scope.close();
                        }
                    });
                } else {//cuando liq un anticipo
                    var data = scope.stGridLiq.getRange();
                    var TotalLiq = 0;
                    var arrayCuentas = [];
                    for (var i = 0; i < data.length; i++) {
                        TotalLiq += data[i].get('importe');
                        arrayCuentas.push({
                            idcuenta: data[i].get('idcuenta'),
                            importemo: data[i].get('importe'),
                            idliquidacion: data[i].get('idliquidacion'),
                        });
                    }
                    if (TotalLiq > scope.datosAMod.get('importemo')) {
                        mostrarMensaje(1, 'No puede liquidar más que el importe anticipado.');
                        return false;
                    }
                    scope.fireEvent('success', {
                        // idcuenta: scope.cbCuentaLiq.getSelections(),
                        idoperacion: scope.cbOperacion.getValue(),
                        // importe: scope.nfImporteLiq.getValue(),
                        importe: TotalLiq,
                        arrayCuentas: arrayCuentas,
                    });
                    scope.close();
                }
                // formulario.submit({
                //     url: scope.url + 'adicionarSello',
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
            }
        });

        if (scope.tipoVentana === 3 || scope.tipoAccion === 'liq') {
            scope.cbOperacion.on('select', function (combo, record, index) {
                scope.cbCuentaLiq.reset();
                scope.cbCuentaLiq.disable();
                var modelo = scope.stOperacion.data.items[index].json.modelo;
                var idcuenta = [];
                if (modelo) {
                    for (var i = 0; i < modelo.length; i++) {
                        if (modelo[i].cuentas) {
                            var temp = Ext.decode(modelo[i].cuentas);
                            idcuenta.push(temp.idcuenta);
                        }

                    }
                    if (idcuenta.length > 0) {
                        scope.stCuentaLiq.baseParams.arrayIdCuenta = Ext.encode(idcuenta);
                        // scope.stCuentaLiq.load();
                        // Ext.getCmp('btnAdd').enable();
                        scope.cbCuentaLiq.enable();
                    } else {
                        mostrarMensaje(1, scope.etiquetas.lbMsgIncorrectasOperaciones);
                    }
                } else {
                    mostrarMensaje(1, scope.etiquetas.lbMsgNoModelosOperaciones);
                    scope.cbCuentaLiq.disable();
                }
            });
        }

    },
});
