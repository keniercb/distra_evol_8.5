Ext.namespace('Fichas');
Ext.QuickTips.init();

Fichas.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        var fechaInicio = null;
        var fechaFin = null;
        var scope = this;
        Ext.Msg.wait('Cargando...', 'Por favor espere...');
        Ext.Ajax.request({
            url: 'loadDataIni',
            method: 'POST',
            params: {
                seleccion: 3,
            },
            callback: function (options, success, response) {
                if (success) {
                    var response = Ext.decode(response.responseText);
                    fechaContable = response.dataFecha.fechacontable;
                    periodoActual = response.dataFecha.nombre;
                    fechaInicio = response.dataFecha.inicio;
                    fechaFin = response.dataFecha.fin;
                    ejercicioActual = response.ejercicio;
                    bandera = response.bandera;
                    scope.model.stfichas.reload();
                    this.vistafinanciamiento = Vista.Financiamiento.Controller;
                    this.vistafinanciamiento.init(fechaInicio,fechaFin);

                    this.vistacuentasporpagar = Vista.Financiamientocuentasporpagar.Controller;
                    this.vistacuentasporpagar.init(fechaInicio,fechaFin);
                    //********WINDOWS FICHA POR CREDITO DOCUMENTARIO
                    scope.vistafinanciamientodoc = Vista.Financiamientodoc.Controller;
                    scope.vistafinanciamientodoc.init(fechaInicio,fechaFin);
                    scope.cbFechaliquid.setMaxValue(fechaFin);
                    scope.cbFechaliquid.setMinValue(fechaInicio);
                }
                Ext.Msg.hide();
            }
        });
        this.smCancelarLiquidacion = new Ext.grid.CheckboxSelectionModel();
        function formatoMoneda(v) {
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
            v = String(v);
            var ps = v.split(".");
            var whole = ps[0];
            var sub = ps[1] ? "." + ps[1] : ".00";
            var r = /(\d+)(\d{3})/;
            while (r.test(whole))
                whole = whole.replace(r, "$1" + "," + "$2");
            v = whole + sub;
            if (v.charAt(0) == "-")//caso saldo negativo
                return "(" + v.substr(1) + ")";
            return v;
        }

        var noComprobante = new Ext.Cmpaction();
        scope.baderaselecion = 0;
        scope.baderacancelarn = 0;

        //********WINDOWS FICHA FINANCIAMIENTO RECIBIDO
        this.vistafinanciamiento = Vista.Financiamiento.Controller;
        this.vistafinanciamiento.init();

        this.vistacuentasporpagar = Vista.Financiamientocuentasporpagar.Controller;
        this.vistacuentasporpagar.init();
        //********WINDOWS FICHA POR CREDITO DOCUMENTARIO
        scope.vistafinanciamientodoc = Vista.Financiamientodoc.Controller;
        scope.vistafinanciamientodoc.init();

        this.stliquidEstatico = new Ext.data.SimpleStore({
            fields: ['cuenta', 'importe', 'concat_cuenta'],
            //data:[[],[],[]]
        });

        this.model = Fichas.Store.Model;
        this.model.init(this);
        this.seleccion = null;
        this.tipocontabilizacionparacomprobante = null; //tipo 1 es para las fichas y tipo 2 es para cuentas por pagar
        this.cancelaractivo = 0; //tipo 1 es para las fichas y tipo 2 es para cuentas por pagar

        this.pagingBar = new Ext.PagingToolbar({
            pageSize: 30,
            displayInfo: true,
            clearFilter: true,
            store: scope.model.stfichas,//this.model.stobteneragrupaciones,
            toggleHandler: function (btn, pressed) {
                var as = this.GridPrincipal.getView();
                as.showPreview = pressed;
                as.refresh();
            }
        });
        this.pagingBar2 = new Ext.PagingToolbar({
            pageSize: 30,
            displayInfo: true,
            clearFilter: true,
            store: scope.model.stcuentasporpagar,
            toggleHandler: function (btn, pressed) {
                var as = this.GridCuentas.getView();
                as.showPreview = pressed;
                as.refresh();
            }
        });

        this.btnLiquidar = new Ext.Button({
            text: 'Liquidar',
            disabled: true,
            id: 'liquidar',
            iconCls: 'liquidar',
            handler: function () {
                scope.stliquidEstatico.removeAll();
                scope.lfTotaliquid.setText('Total: ' + 0);
                scope.fichaselect = scope.smoperacion.getSelections();
                scope.cboperationliquidarficha.setValue('');
                scope.cbFechaliquid.setValue('');
                scope.comenarioliquid.setValue('');
                scope.labelInstrumento.setValue('');
                //scope.GridLiquidFicha.getStore().reload();
                scope.datos.getForm().clearInvalid();

                scope.LiquidarFicha.show();
                scope.labelImportependiente.setValue(scope.fichaselect[0].data.importetotal - scope.fichaselect[0].data.importe_liquidado);
            }

        });

        //*************** Ventana Para liquidar la Ficha *************************************

        this.rowactionDelLiquidacion = new Ext.grid.RowActions({
            id: 'idRowactionliquidacion',
            widthSlope: 30,
            align: 'right',
            //header: "",
            actions: [
                {
                    id: 'eliminar',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'Eliminar',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16,
                    //hideIndex: 'shEliminar',
                    //textIndex: 'um'
                },
            ]
        });
        this.rowactionDelCacelarLiquidacion = new Ext.grid.RowActions({
            id: 'idRowactioncancelarliquidacion',
            widthSlope: 30,
            align: 'right',
            //header: "",
            actions: [
                {
                    id: 'cancelarliquid',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'cancelar',
                    iconCls: 'cancelar',
                    marginLeft: 5,
                    width: 20,
                    height: 16,
                    //hideIndex: 'shEliminar',
                    //textIndex: 'um'
                },
            ]
        });

        scope.rowactionDelCacelarLiquidacion.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'cancelarliquid':
                    //var selecteds = view.smoperacionnueva.getSelections();

                    mostrarMensaje(2, "Seguro que desea cancelar la liquidación", function (btnPress) {
                        if (btnPress === 'ok') {
                            var seleccionado = scope.GridCacelarLiquidacion.getSelectionModel().getSelected();
                            var windowCancelar = new Fichas.WindowCancelar(this);
                            windowCancelar.show();
                            windowCancelar.on({
                                scope: this,
                                close: function () {
                                    //  this.scope.keyMap.enable();
                                }
                            });
                            //scope.GridCacelarLiquidacion.getStore().remove(seleccionado);

                        }
                    });
                    break;
            }
        });

        scope.stAddCuentaLiquid = new Ext.data.Store({

            url: 'loadDataTodasCuenta',
            scope: this,
            listeners: {
                'beforeexpandnode': function (st, rec) {

                },
                'beforeload': function (store, options) {

                },
                'load': function (store, records, options) {
                    if (store.data.items[0].data.text == '') {
                        scope.btnAdicionarLiquidFicha.disable();
                        var msg = "No exixte cuenta asociada a esta operacion"
                        mostrarMensaje(1, msg);
                    } else
                        scope.btnAdicionarLiquidFicha.enable();

                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idcuenta',
                mapping: 'concatcuentagastos'
            },
                {
                    name: 'text'
                }
            ]),

        });

        this.cbcuentaLiquid = new Ext.contabilidad.util.linkedCombo({
            fieldLabel: 'Cuenta',
            displayField: 'nombrecuenta',
            valueField: 'idcuenta',
            allowBlank: false,
            disabled: true,
            hideTbar: false,
            hideBbar: false,
            listHeight: 200,
            tabIndex: 11,
            anchor: '98%',
            store: scope.stAddCuentaLiquid,
            mode: 'local',
            loaded: true,
            id: 'cbxCuentaLiquid',
            listeners: {
                expand: function () {
                    //this.reload();
                }
            }
            // tabIndex: 2
        });

        this.smLiquidFicha = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.cmLiquidFicha = new Ext.grid.ColumnModel([
            {
                header: "Cuenta",
                id: 'Cuenta-cmLiquidFicha',
                dataIndex: 'concatcuentaliquidacion',
                valueField: 'cuenta',
                align: 'right',
                width: 220,
                sortable: true,
                editor: scope.cbcuentaLiquid,

            }

            , {
                header: "Importe",
                id: 'Importe2-cmLiquidFicha',
                dataIndex: 'importe_real',
                valueField: 'importe_real',
                renderer: 'usMoney',
                align: 'right',
                width: 100,
                editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    minValue:1,
                    maxValue: 9999999999999,
                })
            }, scope.rowactionDelLiquidacion

        ]);

        scope.rowEditorLiquidFicha = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            listeners: {
                afteredit: function (editor, grid, changes, record, rowIndex) {
                    var totalliquidarficha = 0;
                    var Store = scope.GridLiquidFicha.getStore().data
                    for (let i = 0; i < Store.length; i++) {
                        totalliquidarficha += Store.items[i].data.importe_real;
                    }
                    if (totalliquidarficha > scope.labelImportependiente.getValue()) {
                        scope.btnAceptarfichafinanciamiento.disable();
                        scope.btnAdicionarLiquidFicha.disable();
                        var msg = "El total de los importes no puede sobrepasar el pendiente"
                        mostrarMensaje(6, msg);
                    } else {
                        if (totalliquidarficha == 0)
                            scope.btnAceptarfichafinanciamiento.disable();
                        else
                            scope.btnAceptarfichafinanciamiento.enable();
                        scope.btnAdicionarLiquidFicha.enable();
                    }

                    scope.lfTotaliquid.setText('Total: ' + totalliquidarficha)
                    valueaux = scope.cbcuentaLiquid.getValue();
                    record.data.concatcuentaliquidacion = scope.cbcuentaLiquid.getRawValue();
                    record.data.cuenta = valueaux;
                    // record.data.importe_real=scope.importe_real.getValue();
                    scope.stliquidEstatico.commitChanges();
                },
            }
        });

        this.lfTotaliquid = new Ext.form.Label({
            id: 'lfTotal2cuentaspagar',
            text: (scope.baderaselecion) ? 'otro' : '',
            style: 'font-weight:bold;'
        });

        this.btnAdicionarLiquidFicha = new Ext.Button({
            text: 'Adicionar',
            disabled: true,
            iconCls: 'adicionar',
            handler: function () {

            }
        });

        this.recordliquid = Ext.data.Record.create([
            {name: 'cuenta', type: 'int'},
            {name: 'importe', type: 'int'},
            {name: 'concat_cuenta', type: 'string'},
        ]);

        scope.btnAdicionarLiquidFicha.on({
            click: function () {
                scope.smLiquidFicha.clearSelections();
                var recTal = new scope.recordliquid({
                    cuenta: '',
                    importe: '',
                    concat_cuenta: '',
                });
                scope.rowEditorLiquidFicha.stopEditing();
                scope.stliquidEstatico.insert(0, recTal);
                scope.GridLiquidFicha.getView().refresh();
                scope.rowEditorLiquidFicha.startEditing(0, 0);
                // view.cbOperacion.focus(true, 100);


            }
        })

        scope.rowactionDelLiquidacion.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    //var selecteds = view.smoperacionnueva.getSelections();

                    mostrarMensaje(2, "Seguro que desea eliminar", function (btnPress) {
                        if (btnPress === 'ok') {
                            var totalliquidarficha = 0;
                            var Store = scope.GridLiquidFicha.getStore().data
                            for (let i = 0; i < Store.length; i++) {
                                totalliquidarficha += Store.items[i].data.importe_real;
                            }
                            var seleccionado = scope.GridLiquidFicha.getSelectionModel().getSelected();
                            totalliquidarficha -= seleccionado.data.importe_real
                            if (totalliquidarficha == 0)
                                scope.btnAceptarfichafinanciamiento.disable()
                            else
                                scope.btnAceptarfichafinanciamiento.enable();
                            if (totalliquidarficha < scope.labelImportependiente.getValue() && totalliquidarficha != 0) {
                                scope.btnAceptarfichafinanciamiento.enable();
                                scope.btnAdicionarLiquidFicha.enable();
                            }

                            scope.lfTotaliquid.setText('Total: ' + (totalliquidarficha));
                            scope.GridLiquidFicha.getStore().remove(seleccionado);
                        }
                    });
                    scope.rowEditorLiquidFicha.stopEditing(true);
                    break;
            }
        });

        this.GridLiquidFicha = new Ext.grid.EditorGridPanel({
            clicksToEdit: 2,
            singleSelect: false,
            loadMask: true,
            id: 'grid-CuentasPagar',
            region: 'center',
            cm: scope.cmLiquidFicha,
            //width: 200,
            // height: Ext.lib.Dom.getViewHeight() * 0.5,
            // width: Ext.lib.Dom.getViewWidth() * 0.3,
            sm: scope.smLiquidFicha,
            store: scope.stliquidEstatico,
            plugins: [scope.rowEditorLiquidFicha, scope.rowactionDelLiquidacion],
            tbar: [scope.btnAdicionarLiquidFicha],
            frame: true,
            bbar: [/*scope.pagingBar,*/'->', scope.lfTotaliquid.setText('Total: ' + 0)],
            listeners: {
                afteredit: function (e) {
                    // scope.lfTotaliquid=0;


                },
                beforeshow: function () {
                }
            }
        });

        this.stoperacionliquidar = new Ext.data.JsonStore({
            url: 'loadDataOperacionesContablesLiquidacion',
            root: 'result',
            totalProperty: 'cantidad',
            autoLoad: true,
            fields: [
                {
                    name: 'idnomoperaciones'
                }, {
                    name: 'denominacion'
                }
            ],
        }),


            this.cboperationliquidarficha = new Ext.form.ComboBox({
                id: 'cboperationliquidarficha',
                anchor: '98%',
                fieldLabel: 'Operación',
                allowBlank: false,
                forceSelection: true,
                disabled: false,
                disabledClass: 'disabled-component',
                mode: 'remote',
                triggerAction: 'all',
                enableKeyEvents: true,
                editable: true,
                // pageSize: 100,
                minChars: 2,
                store: this.stoperacionliquidar,
                valueField: 'idnomoperaciones',
                displayField: 'denominacion',
                autoLoad: true,
                // tabIndex: 2
            });
        this.cboperationliquidarficha.on({

            select: function (combo, record, index) {
                scope.rowEditorLiquidFicha.stopEditing(true);
                scope.cbcuentaLiquid.setValue('');;
                if(record.json.modelo.length<1)
                {
                    var msg = "La operación no tiene asociada un modelo"
                    mostrarMensaje(6, msg);
                }
                else
                {
                    var idcuentas = new Array();
                    for (var i = 0; i < record.json.modelo.length; i++) {
                        idcuentas.push(record.json.modelo[i].cuenta)
                    }
                    if(idcuentas.length>0)
                    {
                        scope.stAddCuentaLiquid.baseParams.arrayIdCuenta = Ext.encode(idcuentas);
                        scope.stAddCuentaLiquid.baseParams.tipocuenta = 1;
                        scope.stAddCuentaLiquid.reload();
                        //scope.cbcuentaLiquid.reload();
                        scope.cbcuentaLiquid.setValue('');
                        scope.cbcuentaLiquid.enable();
                    }
                    else
                    {
                        var msg = "El modelo de la operacion no tiene cuentas asociadas"
                        mostrarMensaje(6, msg);
                    }


                }



            }

        })

        this.cbFechaliquid = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'cbFechaliquid',
            fieldLabel: 'Fecha', //'Fecha de emisi&oacute;n',
            name: 'cbFechaliquid',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regexText: 'asdasdasd',
            readOnly: true,
            tabIndex: 100,
            allowBlank: false,
            //minValue: fechaInicio,
            //maxValue: fechaFin,
            blankText: 'Seleccione...', //'Este campo es obligatorio.',
            anchor: '98%',
            format: 'd/m/Y',
            enableKeyEvents: true
        });

        this.comenarioliquid = new Ext.form.TextField({
            fieldLabel: 'Comentario',
            triggerAction: 'all',
            anchor: '98%',
            enableKeyEvents: true,
            editable: true,
            name: 'comenarioliquid',
            pageSize: 100,
            // allowNegative: false,
            maxValue: 9999999999999,
            allowBlank: false,
            disabled: false,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            //tabIndex:4

        });
        scope.labelImportependiente = new Ext.form.NumberField({
            fieldLabel: 'Pendiente',
            triggerAction: 'all',
            anchor: '98%',
            id: 'labelImportependiente',
            enableKeyEvents: true,
            editable: true,
            name: 'labelImportependienteLiquid',
            pageSize: 100,
            allowBlank: false,
            //renderer: formatoMonedaABS,
            renderer: formatoMoneda(),
            // allowNegative: false,
            maxValue: 9999999999999,
            //allowBlank: false,
            disabled: true,
            //tabIndex:4

        });
        scope.labelInstrumento = new Ext.form.NumberField({
            fieldLabel: 'Instrumento',
            triggerAction: 'all',
            anchor: '96%',
            id: 'labelInstrumento',
            enableKeyEvents: true,
            editable: true,
            name: 'labelInstrumentoLiquid',
            pageSize: 100,
            allowBlank: false,
            // allowNegative: false,
            maxValue: 9999999999999,
            //allowBlank: false,
            disabled: false,
            //tabIndex:4

        });

        this.datos = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            height: 150,
            items: [{

                layout: 'column',
                items: [
                    {
                        columnWidth: .4,
                        layout: 'form',
                        items: [scope.cboperationliquidarficha]
                    },
                    {
                        columnWidth: .3,
                        layout: 'form',
                        items: [scope.cbFechaliquid]
                    }, {
                        columnWidth: .3,
                        layout: 'form',
                        items: [scope.labelImportependiente]
                    }]
            },
                {
                    layout: 'column',
                    items: [{
                        columnWidth: .7,
                        layout: 'form',
                        items: [scope.comenarioliquid]
                    }, {
                        columnWidth: .3,
                        layout: 'form',
                        items: [scope.labelInstrumento]
                    },]
                }]
        });


        scope.panelsuperior = new Ext.Panel({
            scope: this,
            frame: true,
            border: false,
            split: true,
            region: 'north',
            height: Ext.lib.Dom.getViewHeight() * 0.15,
            //height:'50%',
            items: [scope.datos],
        });
        scope.panelinferior = new Ext.Panel({
            layout: 'border',
            region: 'center',
            border: false,
            // height:'50%',
            height: Ext.lib.Dom.getViewHeight() * 0.15,
            //width: '51%',
            items: [scope.GridLiquidFicha],
        });

        this.panelliquid = new Ext.Panel({
            id: 'panelliquid',
            frame: false,
            layout: 'border',
            height: 500,
            width: '100%',
            items: [scope.panelsuperior, scope.panelinferior]
        });


        scope.LiquidarFicha = new Ext.Window({
            title: 'Liquidar ficha',
            width: '30%',
            height: '200',
            //layout: 'fit',
            id: 'windliquidarficha',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            // maximizable: true,
            // maximized:true,
            frame: true,
            items: [scope.panelliquid],
            buttons: [
                this.btncancelarfichafinanciamiento = new Ext.Button({
                    iconCls: 'cerrar',
                    text: 'Cancelar',
                    handler: function () {
                        scope.LiquidarFicha.hide();

                    }
                }),
                scope.btnAceptarfichafinanciamiento = new Ext.Button({
                    iconCls: 'aceptar',
                    disabled: true,
                    text: 'Aceptar',

                    handler: function () {
                        if (scope.datos.getForm().isValid()) {
                            scope.fichaselect
                            scope.baderacancelarn = 3;
                            scope.tipocontabilizacionparacomprobante = 3;
                            scope.seleccion = scope.fichaselect;
                            var msg = (scope.seleccion.length > 1)
                                ? 'Seguro que desea liquidar las fichas seleccionadas.'
                                : 'Seguro que desea liquidar la ficha seleccionada.';
                            mostrarMensaje(2, msg, function (btnPress) {
                                if (btnPress === 'ok') {
                                    this.btnPostear.disable();
                                    scope.contabilizarDesagregacion();
                                }
                            }.bind(scope));
                        } else {
                            var msg = "Existen campos vacios"
                            mostrarMensaje(6, msg);
                        }
                    }
                }),


            ]
        });


        //***********************************************************************************************************************************************
        //***************GRID PARA CANDELAR LAS LIQUIDACIONES DE LAS FICHAS*********
        this.cmLiquidarFicha = new Ext.grid.ColumnModel([
            scope.smCancelarLiquidacion,
            {
                header: "No Instrumento",
                renderer: formatoMoneda(),
                dataIndex: 'num_instrumento',
                valueField: 'num_instrumento',
                sortable: true,
                id: 'importe_instrumentFicha1',
                align: 'right',
                width: 50

            },
            {
                header: "Cuenta",
                id: 'cuentacmliquidarficha1',
                dataIndex: 'concatcuenta',
                valueField: 'idcuenta',
                align: 'right',
                width: 50
            },
            {
                header: "Liquidado",
                renderer: 'usMoney',
                dataIndex: 'importemo',
                valueField: 'importemo',
                sortable: true,
                id: 'importe_liquidadoLiquidarFicha2',
                align: 'right',
                width: 50

            }, scope.rowactionDelCacelarLiquidacion
        ]);

        scope.GridCacelarLiquidacion = new Ext.grid.GridPanel({
            loadMask: true,
            singleSelect: true,
            id: 'cacelliquidacion',
            region: 'center',
            cm: scope.cmLiquidarFicha,
            layout: 'fit',
            sm: scope.smCancelarLiquidacion,
            tbar:[
            scope.btncancelarconjuntoliquid = new Ext.Button({
                iconCls: 'cancelar',
                text: 'Cancelar todas',
                hidden:true,
                handler: function () {
                    mostrarMensaje(2, "Seguro que desea cancelar las liquidaciones", function (btnPress) {
                        if (btnPress === 'ok') {
                            //var seleccionado = scope.GridCacelarLiquidacion.getSelectionModel().getSelected();
                            var windowCancelar = new Fichas.WindowCancelar(this);
                            windowCancelar.show();
                            windowCancelar.on({
                                scope: this,
                                close: function () {
                                    //  this.scope.keyMap.enable();
                                }
                            });
                            //scope.GridCacelarLiquidacion.getStore().remove(seleccionado);

                        }
                    });

                }
            }),
            ],
            store: scope.model.stcancelarliquidacionfichas,
            plugins: [scope.rowactionDelCacelarLiquidacion],
            viewConfig: {
                forceFit: true
            },
            frame: true
        });

        scope.GridCacelarLiquidacion.on({
            rowclick: function (grid, rowIndex) {
                if(scope.smCancelarLiquidacion.getSelections().length>1)
                {
                    scope.btncancelarconjuntoliquid.show();
                }

                else
                    scope.btncancelarconjuntoliquid.hide();
            },
            show: function (grid, rowIndex) {
                scope.btncancelarconjuntoliquid.hide();
            }
        })


        this.panelCacelarLiquidacion = new Ext.Panel({
            // layout: 'border',
            // title:  'Cancelar Liquidacion',
            region: 'center',
            layout: 'fit',
            height: 780,
            width: '100%',
            items: scope.GridCacelarLiquidacion
        });

        scope.WindCacelarLiquidacion = new Ext.Window({
            title: 'Liquidar ficha',
            // width: '1000',
            // height: '1000',
            //layout: 'fit',
            maximized: true,
            id: 'windcancelarliquidarficha',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            // maximizable: true,
            // maximized:true,
            frame: true,
            items: [scope.panelCacelarLiquidacion],
            buttons: [
                this.btncancelarfichafinanciamiento = new Ext.Button({
                    iconCls: 'cerrar',
                    text: 'Cancelar',
                    handler: function () {
                        scope.WindCacelarLiquidacion.hide();

                    }
                }),
                /* scope.btnAceptarfichafinanciamiento = new Ext.Button({
                     iconCls: 'aceptar',
                     disabled: false,
                     text: 'Aceptar',

                     handler: function () {
                         if (scope.datos.getForm().isValid())
                         {
                             scope.fichaselect
                             scope.baderacancelarn=3;
                             scope.tipocontabilizacionparacomprobante = 3;
                             scope.seleccion = scope.fichaselect;
                             var msg = (scope.seleccion.length > 1)
                                 ? 'Seguro que desea liquidar las fichas seleccionadas.'
                                 : 'Seguro que desea liquidar la ficha seleccionada.';
                             mostrarMensaje(2,msg, function (btnPress) {
                                 if (btnPress === 'ok') {
                                     this.btnPostear.disable();
                                     scope.contabilizarDesagregacion();
                                 }
                             }.bind(scope));
                         }
                         else
                         {
                             var msg="Existen campos vacios"
                             mostrarMensaje(6, msg);
                         }
                     }
                 }),*/


            ]
        });


        //**********************************************************************************************

        //** GRID PARA EL TAB DE CUENTAS POR PAGAR

        var noComprobantecuentapagar = new Ext.Cmpaction();
        this.smcuentaspagar = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.btnAdicionarcuentapagar = new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar',
            handler: function () {
                scope.vistacuentasporpagar.getWindows().show();
            }
        });
        this.btnModificarcuentapagar = new Ext.Button({
            text: 'Modificar',
            disabled: true,
            iconCls: 'modificar',
            handler: function () {
                var selecteds = scope.smcuentaspagar.getSelections();
                if (selecteds[0].data.nomEstado == 'Guardado') {
                    var id_cuentaspagar = selecteds[0].data.id_cuentaspagar;
                    var no_doc = selecteds[0].data.no_doc;
                    var id_cuenta = selecteds[0].data.id_cuenta;
                    var fechaemision = selecteds[0].data.fechaemision;
                    var operacion = selecteds[0].data.operacion;
                    var observacion = selecteds[0].data.observacion;
                    var tipo_documento = selecteds[0].data.tipo_documento;
                    var id_doc = selecteds[0].data.id_doc;
                    var estado = selecteds[0].data.nomEstado;

                }
                scope.vistacuentasporpagar.getWindows(id_cuentaspagar, no_doc, id_cuenta, fechaemision, operacion, observacion, tipo_documento, id_doc, estado).show();

            }
        });
        this.btnCancelarcuentapagar = new Ext.Button({
            text: 'Cancelar',
            disabled: true,
            iconCls: 'cancelar',
            handler: function () {
                scope.baderacancelarn = 2
                scope.tipocontabilizacionparacomprobante = 2;
                scope.seleccion = scope.smcuentaspagar.getSelections();
                if (scope.seleccion.length > 0) {
                   // if (scope.seleccion[0].json.nomEstado != 'Guardado') {
                        mostrarMensaje(2, 'Esta seguro que quiere efectuar esta cancelación', function (btnPress) {
                            if (btnPress === 'ok') {
                                var windowCancelar = new Fichas.WindowCancelar(this, scope.seleccion[0].data.fechaemision);
                                windowCancelar.show();
                                windowCancelar.on({
                                    scope: this,
                                    close: function () {
                                        //  this.scope.keyMap.enable();
                                    }
                                });
                            }
                            if (btnPress === 'cancel') {
                                // this.scope.keyMap.enable();
                            }
                        }.bind(this));
                    //}
                }

            }
        });

        this.btnConfirmarcuentapagar = new Ext.Button({
            text: 'Confirmar',
            disabled: true,
            iconCls: 'confirmar',
            handler: function () {
                var selecteds = scope.smcuentaspagar.getSelections();
                Ext.Ajax.request({
                    url: 'confirmarEstado',
                    method: 'POST',
                    params: {

                        iddocumento: selecteds[0].data.id_doc,

                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codM == 1) {
                            var msg = "Se realizó la operación con exito..."
                            mostrarMensaje(1, msg);

                            scope.btnConfirmarcuentapagar.disable();
                            scope.btnPostearcuentapagar.disable();
                            scope.model.stcuentasporpagar.reload();
                            scope.btnModificarcuentapagar.disable();
                            Ext.Msg.hide();
                        }
                    }
                });
            }
        });

        this.btnPostearcuentapagar = new Ext.Button({
            text: 'Postear',
            disabled: true,
            iconCls: 'contabilidad',
            handler: function () {
                scope.baderacancelarn = 2;
                scope.tipocontabilizacionparacomprobante = 2;
                scope.seleccion = scope.smcuentaspagar.getSelections();
                var msg = (scope.seleccion.length > 1)
                    ? 'Seguro que desea postear las operaciones seleccionadas.'
                    : 'Seguro que desea postear la operacion seleccionada.';
                mostrarMensaje(2, msg, function (btnPress) {
                    if (btnPress === 'ok') {
                        this.btnPostearcuentapagar.disable();
                        scope.contabilizarDesagregacion();
                    }
                }.bind(scope));
            }
        });


        this.cmcuentapagar = new Ext.grid.ColumnModel([
            {
                header: "No documento",
                id: 'nofichacuentapagar',
                dataIndex: 'no_doc',
                valueField: 'no_doc',
                align: 'right',
                width: 20
            },
            {
                header: "Fecha",
                id: 'cuentaproveedorcuentapagar',
                dataIndex: 'fechaemision',
                valueField: 'fechaemision',
                align: 'right',
                width: 100
            }, {
                header: "Estado",
                id: 'estadocuentapagar',
                dataIndex: 'nomEstado',
                valueField: 'nomEstado',
                align: 'right',
                width: 50
            }, {
                header: "Importe",
                renderer: formatoMoneda(),
                dataIndex: 'importetotalreal',
                valueField: 'importetotalreal',
                sortable: true,
                id: 'importe_totalcuentapagar',
                align: 'right',
                width: 50

            },
            //  noComprobante,
            noComprobantecuentapagar
        ]);


        scope.GridCuentas = new Ext.grid.GridPanel({
            loadMask: true,
            singleSelect: false,
            id: 'button-grid-cuentaspagargastos',
            region: 'center',
            cm: scope.cmcuentapagar,
            layout: 'fit',
            sm: scope.smcuentaspagar,
            bbar: scope.pagingBar2,
            store: scope.model.stcuentasporpagar,
            plugins: [noComprobantecuentapagar],
            viewConfig: {
                forceFit: true
            },

            tbar: [scope.btnAdicionarcuentapagar, '', '', '', scope.btnModificarcuentapagar, '', '', '', scope.btnCancelarcuentapagar, '', '', '', scope.btnConfirmarcuentapagar, '', '', '', scope.btnPostearcuentapagar,
            ],
            frame: true
        });


        //** FIN GRID PARA EL TAB DE CUENTAS POR PAGAR

        Fichas.WindowCancelar = Ext.extend(Ext.Window, {
            constructor: function (scope, fecha) {
                Ext.applyIf(this, {
                    layout: 'fit',
                    border: false,
                    scope: scope,
                    autoValidate: true,
                    title: 'Cancelar Documento',//scope.idioma.lbTitleCancelar,
                    modal: true,
                    resizable: false,
                    layout: 'fit',
                    closeAction: 'close',
                    id: 'windowCancelar',
                    autoHeight: true,
                    border: false,
                    width: 300,
                    height: 200,
                    items: [this.fPanelCancelar = this.fPanelCancelar(scope, fecha)],
                });
                this.createButtons();
                return Fichas.WindowCancelar.superclass.constructor.call(this);
            },


            fPanelCancelar: function (scope, fecha) {
                //ComboBox Motivo de wincajacancelar
                this.stMotivo = new Ext.data.Store({
                    url: 'cargarMotivosCancelacion',
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                    }, [{
                        name: 'idmotivocancelacion',
                        mapping: 'idmotivocancelacion',
                        type: 'string'
                    }, {
                        name: 'motivo',
                        mapping: 'descripcion'
                    }
                    ]),
                    sortInfo: {
                        field: 'motivo',
                        direction: 'ASC'
                    },
                    autoLoad: true,
                    listeners: {
                        beforeload: function (s, options) {
                            this.stMotivo.clearFilter(true);
                            this.stMotivo.removeAll();
                        }.bind(this)
                    }
                });
                this.btnbuscar = new Ext.Button({
                    iconCls: 'buscaravanzada',
                    disabled: true,
                    text: 'Buscar',
                    tooltip: 'Buscar',
                });
                this.labelbuscar = new Ext.form.NumberField({
                    fieldLabel: '',
                    triggerAction: 'all',
                    anchor: '96%',
                    enableKeyEvents: true,
                    editable: true,
                    name: 'buscar',
                    // allowNegative: false,
                    maxValue: 9999999999999,
                    //allowBlank: false,
                    disabled: false,
                    //tabIndex:4

                })

                this.firstElement = this.cbMotivo = new Ext.form.ComboBox({
                    disabledClass: 'disabled-component',
                    selectOnFocus: true,
                    fieldLabel: 'Motivo de la Cancelacion',//scope.idioma.lbMotivoCancel,
                    mode: 'local',
                    name: 'cbxmotivo',
                    id: 'cbxmotivo',
                    tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
                    resizable: true,
                    emptyText: 'Seleccione...',
                    store: this.stMotivo,
                    hiddenName: 'idmotivocancelacion',
                    valueField: 'idmotivocancelacion',
                    displayField: 'motivo',
                    editable: false,
                    typeAhead: true,
                    msgTarget: 'qtip',
                    maskRe: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
                    regex: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
                    regexText: 'Este campo solo permite letras y n&uacute;meros.',
                    allowBlank: false,
                    blankText: 'Este campo es obligatorio.',
                    anchor: '95%',
                    triggerAction: 'all'
                });

                //Fecha wincajacancelar
                this.dfCancelacion = new Ext.form.DateField({
                    disabledClass: 'disabled-component',
                    selectOnFocus: true,
                    fieldLabel: 'Fecha Contable',
                    msgTarget: 'qtip',
                    allowBlank: false,
                    blankText: 'Este campo es obligatorio.',
                    format: 'd/m/Y',
                    editable: false,
                    anchor: '95%',
                    name: 'dfCancelacion',
                    id: 'dfCancelacion',
                    maxValue: fechaFin,
                    minValue: fechaInicio,
                    value: fecha, //fechaContable,
                    /// minValue: fechaInicio,
                    //maxValue: fechaFin,
                    invalidText: 'El formato establecido: dd/mm/aaaa.',
                    enableKeyEvents: true
                });
                this.fpCancelacion = new Ext.FormPanel({
                    id: 'fpcancelacion',
                    region: 'north',
                    labelAlign: 'top',
                    frame: true,
                    border: true,
                    layout: 'form',
                    autoHeight: true,
                    modal: true,
                    plain: true,
                    trackResetOnLoad: true,
                    bodyStyle: 'padding:10px 0 0 10px',
                    items: [this.cbMotivo, this.dfCancelacion]
                });
                return this.fpCancelacion
            },
            createButtons: function () {
                this.btnCancelar = new Ext.Button({
                    id: 'btnCancelar',
                    //icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    selectOnFocus: true,
                    text: 'Cancelar',//this.scope.idioma.lbBtnCancelar,
                    tooltip: 'Cancelar',//this.scope.idioma.tooltipCloseAdd,
                    scope: this,
                    handler: function () {
                        this.close();
                    }.bind(this)
                });

                this.btnAceptar = new Ext.Button({
                    id: 'btnAceptar',
                    //icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: 'Aceptar',//this.scope.idioma.lbBtnAceptar,
                    tooltip: 'Aceptar',//this.scope.idioma.tooltipAcept,
                    handler: function () {
                        if (this.fpCancelacion.getForm().isValid()) {
                            scope.cancelarDeposito(this.cbMotivo.getValue(), this.dfCancelacion.getRawValue());
                            this.close();
                        }
                    }.bind(this)
                });
                this.buttons = [this.btnCancelar, this.btnAceptar];
            }


        });

        this.cancelarDeposito = function (idmotivo, fecha) {
            var params = {
                idmotivo: idmotivo,
                fecha: fecha,
                tipoContabilizacion: 2,
                descripcion: 'Cancelando documento: ',
            };

            if (scope.seleccion[0].data.nomEstado != 'Posteado') {
                params.contabilizado = 0;
                this.guardarCancelacion(null, null, null, params)
            } else {
                params.contabilizado = 1;
                this.fLoadDataComprobante(params);
            }
        };

        this.guardarCancelacion = function (idComprobante, numComprobante, fechaComprobante, params) {
            Ext.Msg.wait(/*this.idioma.lbCancelandoDeposito*/'Cancelando documento', "espere" /*this.idioma.lbEspere*/);

            var arrayIdDoc = new Array();

            if (scope.seleccion[0].json.nomEstado == "Confirmado")
                var estado = 5;
            else if (scope.seleccion[0].json.nomEstado == "Guardado")
                var estado = 4;

            else
                var estado = 6;
            var arrayseleccion = [];
            for (var i = 0; i < scope.seleccion.length; i++) {
                arrayIdDoc.push((scope.seleccion[i].data.iddocumento).toString());
                arrayseleccion.push(scope.seleccion[i].data);
            }
            var arrayaLiquidar = [];
            if (scope.baderacancelarn == 3) {
                var select = scope.GridCacelarLiquidacion.getSelectionModel().getSelections();
                for (let i = 0; i < select.length; i++) {
                    arrayaLiquidar.push({
                        idcueta: select[i].data.idcuenta,
                        importe: select[i].data.importemo,
                        instrumento: select[i].data.num_instrumento,
                        idderechouobligacion: select[i].data.idderechouobligacion,
                        idliquidacion: select[i].data.idliquidacion,

                    });
                }
            }
            else{
                var arrayaLiquidar = [];
                var select = scope.GridCacelarLiquidacion.getSelectionModel().getSelections();
                for (let i = 0; i < select.length; i++) {
                    arrayaLiquidar.push({
                        idcueta: select[i].data.idcuenta,
                        importe: select[i].data.importemo,
                        idderechouobligacion: select[i].data.idderechouobligacion,
                        idliquidacion: select[i].data.idliquidacion,

                    });
                }
            }

            Ext.Ajax.request({
                method: "POST",
                url: 'cancelarDeposito',
                scope: this,
                params: {
                    seleccion: Ext.encode(arrayseleccion),
                    baderacancelarn: scope.baderacancelarn,
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    arrayaLiquidar: Ext.encode(arrayaLiquidar),
                    idestado: estado,
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante,
                    //idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    contabilizado: params.contabilizado,
                    enestadocuenta: scope.seleccion[0].data.idestado ? true : false,
                    idDocInst: params.idDocInst,
                    //idmonedaEntidad: Caja.Deposito.Fondo.idmonedaEntidad
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    scope.btnCancelar.disable();
                    scope.btnCancelarcuentapagar.disable();
                    this.model.stfichas.reload();
                    scope.model.stcuentasporpagar.reload();
                    if( scope.baderacancelarn==3)
                    {
                        scope.model.stcancelarliquidacionfichas.reload()
                    }
                    if (params.contabilizado)
                        mostrarMensaje(1, 'Se cancelo y contabilizo el comprobante '/*this.idioma.lbMsgCancelContabilizado*/ + ' ' + numComprobante + '.');
                    else mostrarMensaje(1, 'El deposito ha sido cancelado'/*s.idioma.lbMsgCancelDeposito*/);

                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                    }
                }.bind(this)
            });
        };


        scope.stfichas = new Ext.data.Store({

            url: 'loadFichas',
            scope: this,
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                    totalProperty: 'cantidad_filas',
                    root: 'datos'
                },
                [{
                    name: 'no_ficha'
                },
                    {
                        name: 'id_ficha'
                    },
                    {
                        name: 'nomEstado'
                    },
                    {
                        name: 'idcuenta'
                    }, {
                    name: 'tipo_ficha'
                }, {
                    name: 'id_cuenta_proveedor'
                }, {
                    name: 'concatcuentaproveedor'
                }, {
                    name: 'concatproveedor'
                }, {
                    name: 'concatoperacion'
                }, {
                    name: 'concattipodoc'
                }, {
                    name: 'id_operacion'
                }, {
                    name: 'id_proveedor'
                }, {
                    name: 'observacion'
                }

                ]),

        });
        this.smoperacion = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.cbDenominacion_Operacion = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            typeAhead: true,
            mode: 'local',
            align: 'right',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            store: this.model.store_operacion,
            triggerAction: 'all',
            lazyRender: true,
            allowBlank: false,
        });

        this.menu = new Ext.menu.Menu({
            id: 'mainMenu',
            items: [
                this.btnFinaciamiento = new Ext.menu.Item({
                    text: 'Financiamiento recibido',
                    tooltip: 'Financiamiento recibido',
                    iconCls: 'adicionar'
                }),
                this.btnCarta_Credito = new Ext.menu.Item({
                    text: 'Carta crédito',
                    tooltip: 'Carta crédito',
                    iconCls: 'adicionar'
                }),
            ]
        });


        scope.btnFinaciamiento.on({
            click: function () {
                //this.vistafinanciamiento.init();
                //scope.vistafinanciamientodoc.closeVentana()
                scope.vistafinanciamiento.getWindows().show();

            }
        });
        scope.btnCarta_Credito.on({
            click: function () {
                // this.vistafinanciamientodoc.init();
                // scope.vistafinanciamiento.closeVentana()

                scope.vistafinanciamientodoc.getWindows().expand();
                scope.vistafinanciamientodoc.getWindows().show();

            }
        });


        //****--------- Botones-----------***********
        this.btnAdicionar = new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar',
            menu: scope.menu
        });

        this.btnCancelar = new Ext.Button({
            text: 'Cancelar',
            disabled: true,
            iconCls: 'cancelar',
            handler: function () {
                scope.baderacancelarn = 1;
                scope.tipocontabilizacionparacomprobante = 1;
                scope.cancelaractivo = 1;
                scope.seleccion = scope.smoperacion.getSelections();
                if (scope.seleccion.length > 0) {
                    if (scope.seleccion[0].json.nomEstado != 'Guardado') {
                        mostrarMensaje(2, 'Esta seguro que quiere efectuar esta cancelación', function (btnPress) {
                            if (btnPress === 'ok') {
                                var windowCancelar = new Fichas.WindowCancelar(this, scope.seleccion[0].data.fecha_emision);
                                windowCancelar.show();
                                windowCancelar.on({
                                    scope: this,
                                    close: function () {
                                        //  this.scope.keyMap.enable();
                                    }
                                });
                            }
                            if (btnPress === 'cancel') {
                                // this.scope.keyMap.enable();
                            }
                        }.bind(this));
                    }
                }

            }
        });
        this.btnCancelarLiquid = new Ext.Button({
            text: 'Cancelar Liquidación',
            disabled: true,
            iconCls: 'cancelar',
            handler: function () {
                scope.baderacancelarn = 3;
                scope.tipocontabilizacionparacomprobante = 3;
                scope.seleccion = scope.smoperacion.getSelections();
                scope.model.stcancelarliquidacionfichas.baseParams.idderechoobligacion = scope.seleccion[0].data.id_derecho_obligacion;
                scope.model.stcancelarliquidacionfichas.reload();
                scope.WindCacelarLiquidacion.show();

            }
        });

        this.btnModificar = new Ext.Button({
            text: 'Modificar',
            disabled: true,
            iconCls: 'modificar',
            handler: function () {
                var selecteds = scope.smoperacion.getSelections();
                if (selecteds[0].data.nomEstado == 'Guardado' && selecteds[0].data.tipo_ficha == 2) {

                    var idficha = selecteds[0].data.id_ficha;
                    var tipo_ficha = selecteds[0].data.tipo_ficha;
                    var fecha_emision = selecteds[0].data.fecha_emision;
                    var observacion = selecteds[0].data.observacion;
                    var no_ficha = selecteds[0].data.no_ficha;
                    var no_doc = selecteds[0].data.no_doc;
                    var concatcuentaproveedor = selecteds[0].data.concatcuentaproveedor;
                    var concatproveedor = selecteds[0].data.concatproveedor;
                    var concatoperacion = selecteds[0].data.concatoperacion;
                    var concattipodoc = selecteds[0].data.concattipodoc;
                    var tipo_doc = selecteds[0].data.tipo_doc;
                    var id_operacion = selecteds[0].data.id_operacion;
                    var id_proveedor = selecteds[0].data.id_proveedor;
                    var estado = selecteds[0].data.nomEstado;
                    var id_cuenta_proveedor = selecteds[0].data.id_cuenta_proveedor;
                    var iddocumento = selecteds[0].data.iddocumento;
                    var tasa_actual = selecteds[0].data.tasa_actual;
                    var tasa_apertura = selecteds[0].data.tasa_apertura;
                    var importe_total = selecteds[0].data.importe_total;
                    var id_operacion = selecteds[0].data.id_operacion;
                    scope.vistafinanciamientodoc.getWindows(idficha, tipo_ficha, fecha_emision, observacion, no_ficha, no_doc, concatcuentaproveedor, concatproveedor, concatoperacion, concattipodoc, tipo_doc, id_operacion, id_proveedor, id_cuenta_proveedor, estado, iddocumento, tasa_actual, tasa_apertura, importe_total).show();

                }

                if (selecteds[0].data.nomEstado == 'Guardado' && selecteds[0].data.tipo_ficha == 1) {
                    var idficha = selecteds[0].data.id_ficha;
                    var tipo_ficha = selecteds[0].data.tipo_ficha;
                    var fecha_emision = selecteds[0].data.fecha_emision;
                    var observacion = selecteds[0].data.observacion;
                    var no_ficha = selecteds[0].data.no_ficha;
                    var no_doc = selecteds[0].data.no_doc;
                    var concatcuentaproveedor = selecteds[0].data.concatcuentaproveedor;
                    var concatproveedor = selecteds[0].data.concatproveedor;
                    var concatoperacion = selecteds[0].data.concatoperacion;
                    var concattipodoc = selecteds[0].data.concattipodoc;
                    var tipo_doc = selecteds[0].data.tipo_doc;
                    var estado = selecteds[0].data.nomEstado;
                    var id_operacion = selecteds[0].data.id_operacion;
                    var id_proveedor = selecteds[0].data.id_proveedor;
                    var id_cuenta_proveedor = selecteds[0].data.id_cuenta_proveedor;
                    var iddocumento = selecteds[0].data.iddocumento;
                    var tasa_actual = selecteds[0].data.tasa_actual;
                    var tasa_apertura = selecteds[0].data.tasa_apertura;
                    var importe_total = selecteds[0].data.importe_total;
                    var id_operacion = selecteds[0].data.id_operacion;
                    scope.vistafinanciamiento.getWindows(idficha, tipo_ficha, fecha_emision, observacion, no_ficha, no_doc, concatcuentaproveedor, concatproveedor, concatoperacion, concattipodoc, tipo_doc, id_operacion, id_proveedor, id_cuenta_proveedor, estado, iddocumento, tasa_actual, tasa_apertura, importe_total).show();

                }
            }
        });
        this.btnConfirmar = new Ext.Button({
            text: 'Confirmar',
            disabled: true,
            iconCls: 'confirmar',
            handler: function () {
                var selecteds = scope.smoperacion.getSelections();
                Ext.Ajax.request({
                    url: 'confirmarEstado',
                    method: 'POST',
                    params: {

                        iddocumento: selecteds[0].data.iddocumento,

                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codM == 1) {
                            var msg = "Se realizó la operación con exito..."
                            mostrarMensaje(1, msg);

                            scope.btnConfirmar.disable();
                            scope.btnPostear.disable();
                            scope.model.stfichas.reload();
                            scope.btnModificar.disable();
                            Ext.Msg.hide();
                        }
                    }
                });
            }
        });
        this.btnPostear = new Ext.Button({
            text: 'Postear',
            disabled: true,
            iconCls: 'contabilidad',
            handler: function () {
                scope.baderacancelarn = 1;
                scope.tipocontabilizacionparacomprobante = 1;
                scope.cancelaractivo = 0;
                scope.seleccion = scope.smoperacion.getSelections();
                var msg = (scope.seleccion.length > 1)
                    ? 'Seguro que desea postear las operaciones seleccionadas.'
                    : 'Seguro que desea postear la operacion seleccionada.';
                mostrarMensaje(2, msg, function (btnPress) {
                    if (btnPress === 'ok') {
                        this.btnPostear.disable();
                        scope.contabilizarDesagregacion();
                    }
                }.bind(scope));
            }
        });

        this.contabilizarDesagregacion = function () {
            var param = {
                tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                descripcion: 'Posteando documento: ',
            };
            this.fLoadDataComprobante(param);
        };
        this.fLoadDataComprobante = function (params) {
            var arrayIdDoc = [];
            var arrayIdDocPres = [];
            var arrayaLiquidar = [];

            var arraySelections = scope.seleccion;
            for (var i = 0; i < arraySelections.length; i++) {
                arrayIdDoc.push(arraySelections[i].json.iddocumento);
                arrayIdDocPres.push(arraySelections[i].json.iddocumento);
            }
            var selecteds = scope.seleccion;
            Ext.Msg.wait(/*this.idioma.lbLoadDataComprobante*/'Realizando Operacion', 'Realizando Operacion'/*this.idioma.lbEspere*/);
            params.arrayIdDoc = arrayIdDoc;

            if (scope.tipocontabilizacionparacomprobante == 3) {
                var Store = scope.stliquidEstatico.data.items
                if (Store.length == 0) {
                    var select = scope.GridCacelarLiquidacion.getSelectionModel().getSelections();
                    for (let i = 0; i < select.length; i++) {
                        arrayaLiquidar.push({
                            idcueta: select[i].data.idcuenta,
                            importe: select[i].data.importemo
                        });
                    }
                } else {
                    for (let i = 0; i < Store.length; i++) {
                        arrayaLiquidar.push({
                            idcueta: Store[i].data.cuenta,
                            importe: Store[i].data.importe_real
                        });
                    }
                }

                Ext.Ajax.request({
                    url: 'cargarcomprobante',
                    method: 'POST',
                    scope: this,
                    params: {
                        tipocontabilizacionparacomprobante: scope.tipocontabilizacionparacomprobante,
                        arrayIdDoc: Ext.encode(arrayIdDoc),
                        arrayIdDocPres: Ext.encode(arrayIdDocPres),
                        arrayaLiquidar: Ext.encode(arrayaLiquidar),
                        idoperacion: scope.cboperationliquidarficha.getValue(),
                        fecha: scope.cbFechaliquid.getRawValue(),
                        instrumento: scope.labelInstrumento.getValue(),
                        tipoContabilizacion: params.tipoContabilizacion,
                        comentario: scope.comenarioliquid.getValue(),
                        fichaseleccion: Ext.encode(scope.seleccion[0].data)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codM) {
                            if (responseData.codM == -2) {
                                mostrarMensaje(1, this.idioma.msgCambioEstado);
                                Ext.MessageBox.hide();
                            }
                        }
                        else if (responseData.codM == -3){
                            mostrarMensaje(1, 'Esta ficha tiene liquidaciones pendientes');
                            Ext.MessageBox.hide();
                        }
                        else {
                            this.fShowComprobante(responseData, params);
                            Ext.MessageBox.hide();
                        }
                    }.bind(this)
                });


            } else {
                Ext.Ajax.request({
                    url: 'cargarcomprobante',
                    method: 'POST',
                    scope: this,
                    params: {
                        tipocontabilizacionparacomprobante: scope.tipocontabilizacionparacomprobante,
                        arrayIdDoc: Ext.encode(arrayIdDoc),
                        arrayIdDocPres: Ext.encode(arrayIdDocPres),
                        tipoContabilizacion: params.tipoContabilizacion,
                        fichaseleccion: Ext.encode(scope.seleccion[0].data),
                        flagcancelar:scope.cancelaractivo

                        //idDocInst: params.idDocInst
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codM) {
                            if (responseData.codM == -2) {
                                mostrarMensaje(1, this.idioma.msgCambioEstado);
                                Ext.MessageBox.hide();
                            }
                        }
                         if (responseData == -3){
                            mostrarMensaje(1, 'Esta ficha tiene liquidaciones pendientes');
                            Ext.MessageBox.hide();
                        }

                        else {
                            this.fShowComprobante(responseData, params);
                            Ext.MessageBox.hide();
                        }
                    }.bind(this)
                });
            }

        };


        this.fShowComprobante = function (respData, params) {
            var idSubsistema = 6;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;
            var arrayseleccion = [];
            for (let i = 0; i < scope.seleccion.length; i++) {
                arrayseleccion.push(scope.seleccion[i].data)
            }

            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait("Guardando Comprobante", "Por favor espere...");
                if (params.tipoContabilizacion === 1) {
                    if (scope.baderacancelarn == 1)
                        this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, arrayseleccion, params);
                    else if (scope.baderacancelarn == 2)
                        this.fGuardarComprobante2(idComprobante, numComprobante, fechaComprobante, arrayseleccion, params);
                    else if (scope.baderacancelarn == 3) {
                        var Store = scope.stliquidEstatico.data.items
                        var arrayaLiquidar = [];
                        for (let i = 0; i < Store.length; i++) {
                            arrayaLiquidar.push({
                                idcueta: Store[i].data.cuenta,
                                importe: Store[i].data.importe_real
                            });
                        }
                        this.fGuardarComprobante3(arrayaLiquidar, idComprobante, numComprobante, fechaComprobante, arrayseleccion, params);

                    }

                } else
                    this.guardarCancelacion(idComprobante, numComprobante, fechaComprobante, params);
            }.bind(this)).onClose(function () {
                // this.scope.keyMap.enable();
                noWindow = true;//para indicar que se cerro la ventana
                this.btnPostear.enable();
            }.bind(this));
        };

        this.fGuardarComprobante3 = function (arrayaLiquidar, idComprobante, numeroComprobante, fechaComprobante, arrayseleccion, params, fnPostear) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarDeposito',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    baderacancelarn: scope.baderacancelarn,
                    arrayaLiquidar: Ext.encode(arrayaLiquidar),
                    idoperacion: scope.cboperationliquidarficha.getValue(),
                    fecha: scope.cbFechaliquid.getRawValue(),
                    instrumento: scope.labelInstrumento.getValue(),
                    comentario: scope.comenarioliquid.getValue(),
                    seleccion: Ext.encode(arrayseleccion),
                    //idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                },
                callback: function (options, success, response) {
                    // var responseData = Ext.decode(response.responseText);
                    scope.stliquidEstatico.removeAll();
                    scope.model.stfichas.reload();
                    scope.model.stcuentasporpagar.reload();
                    scope.LiquidarFicha.hide();
                    mostrarMensaje(1, /*this.idioma.lbMsgContabilizado*/'Contabilizado ' + ' ' + numeroComprobante + '.');
                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                    }
                    if (typeof fnPostear === 'function') {
                        fnPostear();
                    }
                    Ext.MessageBox.hide();
                }.bind(this)
            });
        };


        this.fGuardarComprobante2 = function (idComprobante, numeroComprobante, fechaComprobante, arrayseleccion, params, fnPostear) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarDeposito',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    baderacancelarn: scope.baderacancelarn,
                    seleccion: Ext.encode(arrayseleccion),
                    //idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                },
                callback: function (options, success, response) {
                    // var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    scope.model.stfichas.reload();
                    scope.model.stcuentasporpagar.reload();

                    mostrarMensaje(1, /*this.idioma.lbMsgContabilizado*/'Contabilizado ' + ' ' + numeroComprobante + '.');
                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                    }
                    if (typeof fnPostear === 'function') {
                        fnPostear();
                    }
                }.bind(this)
            });
        };


        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, arrayseleccion, params, fnPostear) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarDeposito',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    baderacancelarn: scope.baderacancelarn,
                    seleccion: Ext.encode(arrayseleccion),
                    //idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                },
                callback: function (options, success, response) {
                    // var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    scope.model.stfichas.reload();
                    scope.model.stcuentasporpagar.reload();

                    mostrarMensaje(1, /*this.idioma.lbMsgContabilizado*/'Contabilizado ' + ' ' + numeroComprobante + '.');
                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                    }
                    if (typeof fnPostear === 'function') {
                        fnPostear();
                    }
                }.bind(this)
            });
        };


        //****--------- Botones-----------***********
        //****--------- Grid-----------***********

        //AQUI ESTAN LOS COMBOS

        this.cbBuscarNo = new Ext.form.ComboBox({
            id: 'BuscarNo',
            anchor: '100%',
            fieldLabel: 'Buscar No',
            allowBlank: false,
            forceSelection: true,
            disabled: false,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 3,
            store: this.tipo_operacion, /*this.stgrupo = new Ext.data.JsonStore({
                url: 'obtenerCentroCosto',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idcentrogrupo'
                    }, {
                        name: 'text'
                    }
                ]
            }),
            valueField: 'idcentrogrupo',
            displayField: 'text',
            autoLoad:true,*/
        });


        var noComprobante = new Ext.Cmpaction();

        //---COLUMN MODEL DEL GRIP PRINCIPAL DE AFUERA
        this.cm = new Ext.grid.ColumnModel([
            {
                header: "No ficha",
                id: 'noficha',
                dataIndex: 'no_doc_string',
                valueField: 'no_ficha',
                align: 'left',
                width: 50
            }, {
                header: "Cuenta proveedor",
                id: 'cuentaproveedor',
                dataIndex: 'concatcuentaproveedor',
                valueField: 'concatcuentaproveedor',
                align: 'left',
                width: 50
            }, {
                header: "Estado",
                id: 'estado',
                dataIndex: 'nomEstado',
                valueField: 'nomEstado',
                align: 'left',
                width: 50
            }, {
                header: "Detalle",
                id: 'observacion',
                dataIndex: 'observacion',
                valueField: 'observacion',
                align: 'left'
            }, {
                header: "Importe",
                renderer: formatoMoneda(),
                dataIndex: 'importetotal',
                valueField: 'importetotal',
                sortable: true,
                id: 'importe_total',
                align: 'right',
                width: 50

            }, {
                header: "Liquidado",
                renderer: formatoMoneda(),
                dataIndex: 'importe_liquidado',
                valueField: 'importe_liquidado',
                sortable: true,
                id: 'importe_liquid',
                align: 'right',
                width: 50
            }, {
                header: "Pendiente",
                renderer: formatoMoneda(),
                dataIndex: 'importependiente',
                valueField: 'importependiente',
                sortable: true,
                id: 'importe_pendiente',
                align: 'right',
                width: 50
            },
            //  noComprobante,
            {
                header: "Ganancia/Perdida",
                renderer: function change(v) {
                    if (v > 0)
                        return '<span style="color:green;">' + formatoMoneda(v) + '</span>';
                    else if (v < 0)
                        return '<span style="color:red;">' + formatoMoneda(v) + '</span>';
                    else
                        return formatoMoneda(v)
                },
                dataIndex: 'perdidaganancia',
                valueField: 'perdidaganancia',
                sortable: true,
                id: 'ganacia/perdida',
                align: 'right',
                width: 50
            },
            noComprobante
        ]);
        this.searchField = new Ext.Cont.SearchField({
            // width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            emptyText: 'Ficha a buscar...',
            //maskRe: /^[0-9]*$/,
            scope: this,
            fnOnSearch: function () {
                scope.buscarFicha();
            },
            fnOnClear: function () {
                scope.limpiarBuscar();
            }
        });

        this.buscarFicha = function () {
            scope.model.stfichas.baseParams.fichabuscar = scope.searchField.getValue();
            scope.model.stfichas.baseParams.start = 0;
            scope.model.stfichas.baseParams.limit = 20;
            scope.model.stfichas.load({
                callback: function () {
                    scope.searchField.focus(true, 10);
                }
            });
        };

        this.limpiarBuscar = function () {
            scope.model.stfichas.baseParams = {};
            scope.model.stfichas.reload();
        };

        scope.GridPrincipal = new Ext.grid.GridPanel({
            bbar: scope.pagingBar,
            loadMask: true,
            singleSelect: false,
            id: 'button-grid',
            region: 'center',
            cm: scope.cm,
            layout: 'fit',
            sm: scope.smoperacion,
            store: scope.model.stfichas,//scope.model.stobteneragrupaciones,
            plugins: [/*scope.rowEditor,*/noComprobante/*,scope.rowactionDel*/],
            /* handler: function () {
                 this.rowEditor.stopEditing();
                 this.rowEditor.startEditing(0, 0);
                             },*/
            viewConfig: {
                forceFit: true
            },
            autoExpandColumn: 'observacion',
            tbar: [scope.btnAdicionar, '', '', '', scope.btnModificar, '', '', '', scope.btnCancelar, '', '', '', scope.btnConfirmar, '', '', '', scope.btnPostear, '', '', '', scope.btnLiquidar, '', '', '', scope.btnCancelarLiquid, '->', scope.searchField
            ],
            frame: true
        });


        scope.winConfig = new Ext.Window({
            title: 'Configuracion',
            width: '40%',
            height: 400,
            layout: 'fit',
            constrain: true,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            maximizable: true,
            frame: true,
            items: this.pgeneral,
            buttons: [
                this.btnCerrar = new Ext.Button({
                    iconCls: 'cerrar',
                    //tooltip: etiquetas.lbBtnTooltipCerrar,
                    text: 'Cerrar',
                    handler: function () {
                        //this.GridConfig.resumeEvents();
                        this.winConfig.hide();
                        // this.GridConfig.removeAll();

                    }.bind(this)
                })
            ]
        });

        scope.GridPrincipal.on({

            rowdblclick: function (grid, rowIndex) {

                var selecteds = scope.smoperacion.getSelections();
                if (selecteds[0].data.tipo_ficha == 2) {

                    var idficha = selecteds[0].data.id_ficha;
                    var tipo_ficha = selecteds[0].data.tipo_ficha;
                    var fecha_emision = selecteds[0].data.fecha_emision;
                    var observacion = selecteds[0].data.observacion;
                    var no_ficha = selecteds[0].data.no_ficha;
                    var no_doc = selecteds[0].data.no_doc;
                    var concatcuentaproveedor = selecteds[0].data.concatcuentaproveedor;
                    var concatproveedor = selecteds[0].data.concatproveedor;
                    var concatoperacion = selecteds[0].data.concatoperacion;
                    var concattipodoc = selecteds[0].data.concattipodoc;
                    var tipo_doc = selecteds[0].data.tipo_doc;
                    var tasa_actual = selecteds[0].data.tasa_actual;
                    var tasa_apertura = selecteds[0].data.tasa_apertura;
                    var importe_total = selecteds[0].data.importe_total;
                    var id_operacion = selecteds[0].data.id_operacion;
                    var estado = selecteds[0].data.nomEstado;
                    var id_proveedor = selecteds[0].data.id_proveedor;
                    var id_cuenta_proveedor = selecteds[0].data.id_cuenta_proveedor;
                    var iddocumento = selecteds[0].data.iddocumento;
                    scope.vistafinanciamientodoc.getWindows(idficha, tipo_ficha, fecha_emision, observacion, no_ficha, no_doc, concatcuentaproveedor, concatproveedor, concatoperacion, concattipodoc, tipo_doc, id_operacion, id_proveedor, id_cuenta_proveedor, estado, iddocumento, tasa_actual, tasa_apertura, importe_total).show();

                }

                if (selecteds[0].data.tipo_ficha == 1) {

                    var idficha = selecteds[0].data.id_ficha;
                    var tipo_ficha = selecteds[0].data.tipo_ficha;
                    var fecha_emision = selecteds[0].data.fecha_emision;
                    var observacion = selecteds[0].data.observacion;
                    var no_ficha = selecteds[0].data.no_ficha;
                    var no_doc = selecteds[0].data.no_doc;
                    var concatcuentaproveedor = selecteds[0].data.concatcuentaproveedor;
                    var concatproveedor = selecteds[0].data.concatproveedor;
                    var concatoperacion = selecteds[0].data.concatoperacion;
                    var concattipodoc = selecteds[0].data.concattipodoc;
                    var tipo_doc = selecteds[0].data.tipo_doc;
                    var tasa_actual = selecteds[0].data.tasa_actual;
                    var tasa_apertura = selecteds[0].data.tasa_apertura;
                    var importe_total = selecteds[0].data.importe_total;
                    var id_operacion = selecteds[0].data.id_operacion;
                    var estado = selecteds[0].data.nomEstado;
                    var id_operacion = selecteds[0].data.id_operacion;
                    var id_proveedor = selecteds[0].data.id_proveedor;
                    var id_cuenta_proveedor = selecteds[0].data.id_cuenta_proveedor;
                    var iddocumento = selecteds[0].data.iddocumento;
                    scope.vistafinanciamiento.getWindows(idficha, tipo_ficha, fecha_emision, observacion, no_ficha, no_doc, concatcuentaproveedor, concatproveedor, concatoperacion, concattipodoc, tipo_doc, id_operacion, id_proveedor, id_cuenta_proveedor, estado, iddocumento, tasa_actual, tasa_apertura, importe_total).show();

                }
            },
            rowclick: function (grid, rowIndex) {
                var selecteds = scope.smoperacion.getSelections();
                if (selecteds[0].data.nomEstado == 'Guardado' && selecteds.length == 1) {
                    scope.btnModificar.enable();
                    scope.btnConfirmar.enable();
                    scope.btnCancelar.disable();
                    scope.btnPostear.disable();
                    scope.btnLiquidar.disable()
                    scope.btnCancelarLiquid.disable();
                }
                else if(selecteds[0].data.importependiente==0)
                {
                    scope.btnModificar.disable();
                    scope.btnConfirmar.disable();
                    scope.btnCancelar.disable();
                    scope.btnPostear.disable();
                    scope.btnLiquidar.disable();
                    scope.btnCancelarLiquid.enable();
                }
                else if (selecteds[0].data.nomEstado == 'Confirmado' && selecteds.length == 1) {
                    scope.btnPostear.enable();
                    scope.btnConfirmar.disable();
                    scope.btnCancelar.enable();
                    scope.btnModificar.disable();
                    scope.btnLiquidar.disable()
                    scope.btnCancelarLiquid.disable();
                } else if (selecteds[0].data.nomEstado == 'Posteado' && selecteds.length == 1) {
                    scope.btnPostear.disable();
                    scope.btnConfirmar.disable();
                    if (selecteds[0].data.importe_liquidado > 0) {
                        scope.btnCancelar.disable();
                        scope.btnCancelarLiquid.enable();
                    } else
                        scope.btnCancelar.enable();
                    scope.btnModificar.disable();
                    scope.btnLiquidar.enable()
                }
                else {
                    scope.btnModificar.disable();
                    scope.btnPostear.disable();
                    scope.btnConfirmar.disable();
                    scope.btnCancelar.disable();
                    scope.btnLiquidar.disable()
                    scope.btnCancelarLiquid.disable();
                }
            }
        })


        //****--------- Paneles-----------***********


        this.panelFichas = new Ext.Panel({
            layout: 'border',
            title: 'Fichas Cobros y Pagos',
            region: 'center',
            layout: 'fit',
            items: [scope.GridPrincipal]
        });
        this.panelCuentaspagar = new Ext.Panel({
            layout: 'border',
            title: 'Liquidar mercancia',
            region: 'center',
            layout: 'fit',
            items: [scope.GridCuentas]
        });

        this.tpbanco = new Ext.TabPanel({
            activeTab: 0,
            defaults: {
                autoScroll: true
            },
            border: false,
            items: [{
                id: 'tab1',
                title: 'Fichas',
                layout: 'fit',
                items: scope.panelFichas
            }, scope.tab2 = {
                id: 'tab2',
                title: 'Liquidar mercancia',
                layout: 'fit',
                disabled: false,
                items: scope.panelCuentaspagar
            }]
        });
        this.panelTabs = new Ext.Panel({
            layout: 'border',
            title: 'Fichas Cobros y Pagos',
            region: 'center',
            layout: 'fit',
            //hidden:true,
            items: [scope.tpbanco]
        });


        scope.GridCuentas.on({

            rowdblclick: function (grid, rowIndex) {

                var selecteds = scope.smcuentaspagar.getSelections();
                var id_cuentaspagar = selecteds[0].data.id_cuentaspagar;
                var no_doc = selecteds[0].data.no_doc;
                var id_cuenta = selecteds[0].data.id_cuenta;
                var fechaemision = selecteds[0].data.fechaemision;
                var operacion = selecteds[0].data.operacion;
                var observacion = selecteds[0].data.observacion;
                var tipo_documento = selecteds[0].data.tipo_documento;
                var id_doc = selecteds[0].data.id_doc;
                var estado = selecteds[0].data.nomEstado;


                scope.vistacuentasporpagar.getWindows(id_cuentaspagar, no_doc, id_cuenta, fechaemision, operacion, observacion, tipo_documento, id_doc, estado).show();


            },
            rowclick: function (grid, rowIndex) {
                var selecteds = scope.smcuentaspagar.getSelections();
                if (selecteds[0].data.nomEstado == 'Guardado' && selecteds.length == 1) {
                    scope.btnModificarcuentapagar.enable();
                    scope.btnConfirmarcuentapagar.enable();
                    scope.btnCancelarcuentapagar.enable();
                } else if (selecteds[0].data.nomEstado == 'Confirmado' && selecteds.length == 1) {
                    scope.btnPostearcuentapagar.enable();
                    scope.btnConfirmarcuentapagar.disable();
                    scope.btnCancelarcuentapagar.enable();
                    scope.btnModificarcuentapagar.disable();
                } else if (selecteds[0].data.nomEstado == 'Posteado' && selecteds.length == 1) {
                    scope.btnPostearcuentapagar.disable();
                    scope.btnConfirmarcuentapagar.disable();
                    scope.btnCancelarcuentapagar.enable();
                    scope.btnModificarcuentapagar.disable();
                } else {
                    scope.btnModificarcuentapagar.disable();
                    scope.btnPostearcuentapagar.disable();
                    scope.btnConfirmarcuentapagar.disable();
                    scope.btnCancelarcuentapagar.disable();
                }
            }
        })


        //****--------- Paneles-----------***********
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            //idioma: params.idioma,
            items: [this.panelTabs]
        });

        var controller = Fichas.Pagos.Controller;
        controller.init(this, this.model);


        Fichas.Viewport.superclass.constructor.call(this, params);

    },
    recargar: function (params) {
        this.stfichas.reload();
    },

});
new Fichas.Viewport();