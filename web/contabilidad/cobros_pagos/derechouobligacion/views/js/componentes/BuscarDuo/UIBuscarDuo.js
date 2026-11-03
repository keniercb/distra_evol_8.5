Ext.namespace('Ext.UIBuscarDuo');
Ext.UIBuscarDuo = Ext.extend(Ext.Window, {
    constructor: function (scope) {
        scope.btnBuscarCerrar = new Ext.Button({
            id: 'btnBuscarCerrar',
            text: scope.etiquetas.lbBtnCancelar, //'Cerrar',
            tooltip: scope.etiquetas.tooltipCloseSearchh.replace('<#tipoDuo>', scope.textDuoPlural.toLowerCase()),
            tabIndex: 107,
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            scope: this
        });

        scope.btnBuscarAceptar = new Ext.Button({
            id: 'btnBuscarAceptar',
            text: scope.etiquetas.lbBtnAceptar, //'Aceptar',
            tooltip: scope.etiquetas.tooltipAceptSearch.replace('<#tipoDuo>', scope.textDuoPlural.toLowerCase()),
            tabIndex: 108,
            disabled: true,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this
        });

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

        scope.tfBuscarNumeroDocumento = new Ext.form.TextField({// Misma validacion que el numero de instrumento
            disabledClass: 'disabled-component',
            id: 'tfBuscarNumeroDocumento',
            fieldLabel: scope.etiquetas.lbNumDocumento, //'N&uacute;mero documento',
            name: 'tfBuscarNumeroDocumento',
            tabIndex: 101,
            selectOnFocus: true,
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\-\_]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            regexText: 'Solo admite caracteres alfanuméricos y el(los) caracter(es) especial(es) (-,/,#,.,_).',
            anchor: '100%',
            maxLength: 100,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es de 100 caracteres.',
            //style: 'text-align:right;',
            enableKeyEvents: true
            // listeners: {
            //     keyup: function(field, e) {
            //         if (field.getValue().length > 0 || !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) ||
            //             !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) ||
            //             !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()) || !Ext.isEmpty(scope.cbBuscarComprobante.getValue()) ||
            //             !Ext.isEmpty(scope.cbBuscarEstado.getValue()))
            //                 scope.btnBuscarAceptar.enable();
            //         else
            //             scope.btnBuscarAceptar.disable();
            //     }
            // }
        });

        scope.tfBuscarNumeroContrato = new Ext.form.TextField({// Misma validacion que el numero de instrumento
            disabledClass: 'disabled-component',
            id: 'tfBuscarNumeroContrato',
            fieldLabel: scope.etiquetas.lbNumContrato, //'N&uacute;mero contrato',
            name: 'tfBuscarNumeroContrato',
            selectOnFocus: true,
            anchor: '100%',
            style: 'text-align:right;'
        });

        scope.tfBuscarImporte = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: scope.etiquetas.lbImporte, //'Importe',
            id: 'tfimportebuscar',
            //style: 'text-align:right;',
            anchor: '100%',
            tabIndex: 104,
            maxLength: 16, // asi esta definido en el modelo de datos
            maxLengthText: 'El tamaño m&aacute;ximo requerido es de 16 caracteres.',
            selectOnFocus: true,
            maskRe: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            regexText: 'Solo admite n&uacute;meros reales positivos.',
            enableKeyEvents: true
            // listeners: {
            //     blur: function() {
            //         if (!Ext.isEmpty(scope.cbBuscarComprobante.getValue()) || !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) ||
            //                 !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) ||
            //                 !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()) ||
            //                 !Ext.isEmpty(scope.cbBuscarEstado.getValue()))
            //             scope.btnBuscarAceptar.enable();
            //         else
            //             scope.btnBuscarAceptar.disable();
            //     },
            //     keyup: function(field, event) {
            //         if (!Ext.isEmpty(scope.cbBuscarComprobante.getValue()) || !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) ||
            //                 !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) ||
            //                 !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()) ||
            //                 !Ext.isEmpty(scope.cbBuscarEstado.getValue()))
            //             scope.btnBuscarAceptar.enable();
            //         else
            //             scope.btnBuscarAceptar.disable();
            //     }
            // }
        });

        scope.lfBuscarVacio = new Ext.form.Label({
            id: 'lfvacio',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        scope.lfBuscarEspVacio = new Ext.form.Label({
            id: 'lfvacio',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        scope.dfBuscarDesde = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.lbFechaDesde, //'Desde',
            enableKeyEvents: true,
            tabIndex: 403,
            vtype: 'daterange',
            name: 'dfDesde',
            id: 'dfDesde',
            endDateField: 'dfHasta',
            anchor: '100%',
            readOnly: true,
            format: 'd/m/Y'
        });

        scope.dfBuscarHasta = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.lbFechaHasta, //'Hasta',
            enableKeyEvents: true,
            vtype: 'daterange',
            startDateField: 'dfDesde',
            tabIndex: 404,
            name: 'dfHasta',
            id: 'dfHasta',
            anchor: '100%',
            allowBlank: false,
            readOnly: true,
            format: 'd/m/Y'
        });

        scope.cbBuscarTipoDoc = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarTipoDoc',
            fieldLabel: scope.etiquetas.lbTipoDoc, //'Tipo documento',
            mode: 'local',
            forceSelection: true,
            resizable: true,
            tabIndex: 100,
            selectOnFocus: true,
            store: scope.stBuscarTipoDoc,
            valueField: 'iddoc',
            displayField: 'denominacion',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true
            // listeners: {
            //     select: function() {
            //         scope.btnBuscarAceptar.enable();
            //     },
            //     blur: function(field) {
            //         if (!Ext.isEmpty(field.getValue()) || !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) ||
            //             !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) ||
            //             !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()) || !Ext.isEmpty(scope.cbBuscarComprobante.getValue()) ||
            //             !Ext.isEmpty(scope.cbBuscarEstado.getValue()))
            //                 scope.btnBuscarAceptar.enable();
            //         else
            //             scope.btnBuscarAceptar.disable();
            //     },
            //     keypress: function(combo, e) {
            //         if ((e.getKey() == 8) || (e.getKey() == 46)) // suprimir y borrar
            //             combo.reset();
            //         /*else
            //             e.stopEvent();*/
            //     }
            // }
        });

        scope.cbBuscarClienteProveedor = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarClienteProveedor',
            fieldLabel: scope.nombreClienteProveedor,
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarClienteProveedor,
            tabIndex: 105,
            valueField: 'idcliente',
            displayField: 'nombrecliente',
            forceSelection: true,
            anchor: '100%',
            triggerAction: 'all',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\-\_\.]+ ?[a-zA-Z]*)+$/,
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombrecliente}" class="x-combo-list-item">{nombrecliente}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                // select: function() {
                //     scope.btnBuscarAceptar.enable();
                // },
                // blur: function(field) {
                //     if (!Ext.isEmpty(field.getValue()) || !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) ||
                //         !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) ||
                //         !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) || !Ext.isEmpty(scope.cbBuscarComprobante.getValue()) ||
                //         !Ext.isEmpty(scope.cbBuscarEstado.getValue()))
                //         scope.btnBuscarAceptar.enable();
                //     else
                //         scope.btnBuscarAceptar.disable();
                // },
                beforequery: function (queryEvent) {
                    //intersecto la query para convertira en un regex para que considere la palabra completa y no el inicio
                    if (queryEvent.query) {
                        var len = queryEvent.query.length;
                        queryEvent.query = new RegExp(Ext.escapeRe(queryEvent.query), 'i');
                        queryEvent.query.length = len;//es nesesario hacer esto sino el  metodo que llama el combobox no pincha
                    } else {
                        queryEvent.combo.clearValue();
                    }
                }
            }
        });

        scope.cbBuscarDocFiscales = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarDocFiscales',
            fieldLabel: scope.etiquetas.lbDocFiscal, //'Documentos fiscales',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarCliente,
            valueField: 'idcliente',
            displayField: 'nombre',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarEspecialidad = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarEspecialidad',
            fieldLabel: scope.etiquetas.lbEspecialidad, //'Especialidad',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodas,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarEspecialidad,
            valueField: 'idespecialidad',
            displayField: 'especialidad',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{especialidad}" class="x-combo-list-item">{especialidad}</div></tpl>',
            enableKeyEvents: true
        });


        scope.cbBuscarComprobante = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarComprobante',
            fieldLabel: scope.etiquetas.lbNoComprobante, //'No. Comprobante',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarComprobante,
            tabIndex: 106,
            valueField: 'numcomprobante',
            displayField: 'numcomprobante',
            forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{numcomprobante}" class="x-combo-list-item">{numcomprobante}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                // select: function() {
                //     scope.btnBuscarAceptar.enable();
                // },
                // blur: function(field) {
                //     if (!Ext.isEmpty(field.getValue()) || !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) ||
                //         !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) ||
                //         !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()) ||
                //         !Ext.isEmpty(scope.cbBuscarEstado.getValue()))
                //         scope.btnBuscarAceptar.enable();
                //     else
                //         scope.btnBuscarAceptar.disable();
                // },
                keypress: function (combo, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // suprimir y borrar
                        combo.reset();
                    /*else
                        e.stopEvent();*/
                }
            }
        });

        scope.cbBuscarEstado = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarEstado',
            fieldLabel: scope.etiquetas.lbEstado, //'Estado',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarEstado,
            tabIndex: 102,
            valueField: 'idestado',
            displayField: 'estado',
            forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{estado}" class="x-combo-list-item">{estado}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                // select: function() {
                //     scope.btnBuscarAceptar.enable();
                // },
                // blur: function(field) {
                //     if (!Ext.isEmpty(field.getValue()) || !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) ||
                //         !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) ||
                //         !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()) ||
                //         !Ext.isEmpty(scope.cbBuscarComprobante.getValue()))
                //         scope.btnBuscarAceptar.enable();
                //     else
                //         scope.btnBuscarAceptar.disable();
                // },
                keypress: function (combo, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // suprimir y borrar
                        combo.reset();
                    /*else
                        e.stopEvent();*/
                }
            }
        });

        scope.cbBuscarTipoFecha = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarTipoFecha',
            fieldLabel: scope.etiquetas.lbTipoFecha, //'Tipo fecha',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarTipoFecha,
            valueField: 'idtipofecha',
            displayField: 'tipofecha',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{tipofecha}" class="x-combo-list-item">{tipofecha}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarRangoFecha = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarRangoFecha',
            // fieldLabel: (scope.tipoDuo == 1) ? 'Edad de las cuentas por cobrar' : 'Edad de las cuentas por pagar',
            fieldLabel: 'Edad del documento',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarRangoFecha,
            valueField: 'idrango',
            displayField: 'nombreRango',
            forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombreRango}" class="x-combo-list-item">{nombreRango}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarEjercicio = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarEjercicio',
            fieldLabel: scope.etiquetas.lbEjercicio, //'Ejercicio',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarEjercicio,
            valueField: 'idejercicio',
            displayField: 'nombre',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarPeriodo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarPeriodo',
            fieldLabel: scope.etiquetas.lbPeriodo, //'Per&iacute;odo',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarPeriodo,
            valueField: 'idperiodo',
            displayField: 'nombre',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarCuenta = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarCuenta',
            fieldLabel: scope.etiquetas.lbCuenta, //'Cuenta',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodas,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarCuenta,
            valueField: 'idcuenta',
            displayField: 'nombre',
            tabIndex: 103,
            forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                // select: function() {
                //     scope.btnBuscarAceptar.enable();
                // },
                // blur: function(field) {
                //     if (!Ext.isEmpty(field.getValue()) || !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) ||
                //         !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarEstado.getValue()) ||
                //         !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()) ||
                //         !Ext.isEmpty(scope.cbBuscarComprobante.getValue()))
                //         scope.btnBuscarAceptar.enable();
                //     else
                //         scope.btnBuscarAceptar.disable();
                // },
                keypress: function (combo, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // suprimir y borrar
                        combo.reset();
                    /*else
                        e.stopEvent();*/
                }
            }
        });

        scope.cbBuscarSubsistema = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarSubsistema',
            fieldLabel: scope.etiquetas.lbSubsistema, //'Subsistema',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarSubsistema,
            valueField: 'idsubsistema',
            displayField: 'nombre',
            forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.formCobrosPagos = [/*{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .25,
                items: [scope.cbBuscarSubsistema]
            }, */{
            style: 'margin:0 0 0 10',
            layout: 'form',
            columnWidth: .5,
            items: [scope.cbBuscarCuenta]
        }, {
            style: 'margin:0 0 0 10',
            layout: 'form',
            columnWidth: .5,
            items: [scope.tfBuscarImporte]
        }];
        scope.formCobrosPagosFiscales = [{
            style: 'margin:0 0 0 5',
            layout: 'form',
            columnWidth: .5,
            items: [scope.cbBuscarSubsistema]
        }, {
            style: 'margin:0 0 0 10',
            layout: 'form',
            columnWidth: .5,
            items: [scope.tfBuscarImporte]
        }];

        scope.fpBuscarDuo = new Ext.FormPanel({
            frame: true,
            border: false,
            id: 'fpBuscarDuo',
            autoHeight: true,
            region: 'center',
            //layout: 'fit',
            items: [{
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .35,
                    items: [scope.cbBuscarTipoDoc]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .35,
                    items: [scope.tfBuscarNumeroDocumento]
                }, /*{
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.tfBuscarNumeroContrato]
                        }, */{
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .30,
                    items: [scope.cbBuscarEstado]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: /*(scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.formCobrosPagos : scope.formCobrosPagosFiscales*/[{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .35,
                    items: [scope.cbBuscarSubsistema]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .35,
                    items: [scope.cbBuscarRangoFecha]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .30,
                    items: [scope.tfBuscarImporte]
                }]
            }, {
                labelAlign: 'top',
                autoHeight: true,
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .35,
                    items: [scope.cbBuscarClienteProveedor]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .35,
                    items: [scope.cbBuscarCuenta]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .30,
                    items: [scope.cbBuscarComprobante]
                }]
            }/*, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: (scope.confEspecialidad) ? .75 : .25,
                            items: [(scope.confEspecialidad) ? scope.cbBuscarEspecialidad : scope.cbBuscarTipoFecha]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [(scope.confEspecialidad) ? scope.cbBuscarTipoFecha : scope.lfBuscarEspVacio]
                        }]
                }, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.cbBuscarEjercicio]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.cbBuscarPeriodo]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.dfBuscarDesde]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.dfBuscarHasta]
                        }]
                }*/]
        });
//
        Ext.apply(this, {
            modal: true,
            id: 'winbuscar',
            labelAlign: 'top',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closable: true,
            layout: 'fit',
            autoValidate: false,
            defaultButton: 'btnBuscarCerrar',
            title: (scope.tipoDuo == 1) ? 'Buscar cuentas por cobrar' : 'Buscar cuentas por pagar',//scope.etiquetas.lbBuscar, //'Buscar',
            width: '45%',
            constrain: true,
            items: [scope.fpBuscarDuo],
            buttons: [scope.btnBuscarCerrar, scope.btnBuscarAceptar],
            keys: {
                key: 13,
                stopEvent: true,
                fn: function () {
                    if (!scope.btnBuscarAceptar.disabled) {
                        scope.btnBuscarAceptar.fireEvent('click');
                    }
                },
                scope: this
            }
        });

        return Ext.UIBuscarDuo.superclass.constructor.call(this);
    }
});
