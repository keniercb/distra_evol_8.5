Ext.namespace('Ext.UIBuscarMov');
Ext.UIBuscarMov = Ext.extend(Ext.Window, {
    constructor: function (scope)
    {
        scope.btnBuscarCerrar = new Ext.Button({
            text: scope.etiquetas.lbBtnCancelar, //'Cerrar',
            tooltip: 'Cerrar ventana sin buscar el(los) movimiento(s)',
            tabIndex: 409,
            iconCls: 'cancelar',
            scope: this
        });

        scope.btnBuscarAceptar = new Ext.Button({
            id: 'btnBuscarAceptar',
            text: scope.etiquetas.lbBtnAceptar, //'Aceptar',
            tooltip: 'Buscar el(los) movimiento(s) y cerrar ventana', //'Aceptar',
            tabIndex: 408,
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
            selectOnFocus: true,
            anchor: '100%',
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?)+$/, //CF
            style: 'text-align:right;'
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
            style: 'text-align:right;',
            anchor: '100%',
            // maxLength: 16,
            // maxLengthText: "El tamaño máximo requerido es 16 caracteres.",
            selectOnFocus: true,
            maskRe: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            enableKeyEvents: true
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
            maxValue: new Date(),
            readOnly: true,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.'
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
            maxValue: new Date(),
            allowBlank: false,
            readOnly: true,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.'
        });

        scope.cbBuscarNumeroContrato = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarNumeroContrato',
            fieldLabel: scope.etiquetas.lbNumContrato, //'Tipo documento',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarNumeroContrato,
            valueField: 'idcontrato',
            displayField: 'numerocontrato',
            anchor: '100%',
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{numerocontrato}" class="x-combo-list-item">{numerocontrato}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarTipoDoc = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarTipoDoc',
            fieldLabel: scope.etiquetas.lbTipoDoc, //'Tipo documento',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarTipoDoc,
            valueField: 'iddoc',
            displayField: 'denominacion',
            anchor: '100%',
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true
        });

        // scope.cbBuscarClienteProveedor = new Ext.form.ComboBox({
        //     disabledClass: 'disabled-component',
        //     id: 'cbBuscarClienteProveedor',
        //     fieldLabel: scope.nombreClienteProveedor,
        //     mode: 'local',
        //     resizable: true,
        //     selectOnFocus: true,
        //     store: scope.stBuscarClienteProveedor,
        //     valueField: 'idcliente',
        //     displayField: 'nombrecliente',
        //     anchor: '100%',
        //     triggerAction: 'all',
        //     tpl: '<tpl for="."><div ext:qtip="{nombrecliente}" class="x-combo-list-item">{nombrecliente}</div></tpl>',
        //     enableKeyEvents: true
        // });

        scope.cbBuscarDocFiscales = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarDocFiscales',
            fieldLabel: scope.etiquetas.lbDocFiscal, //'Documentos fiscales',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarCliente,
            valueField: 'idcliente',
            displayField: 'nombre',
            anchor: '100%',
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarEspecialidad = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarEspecialidad',
            fieldLabel: scope.etiquetas.lbEspecialidad, //'Especialidad',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarEspecialidad,
            valueField: 'idespecialidad',
            displayField: 'especialidad',
            anchor: '100%',
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{especialidad}" class="x-combo-list-item">{especialidad}</div></tpl>',
            enableKeyEvents: true
        });


        scope.cbBuscarComprobante = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarComprobante',
            fieldLabel: scope.etiquetas.lbNoComprobante, //'No. Comprobante',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarComprobante,
            valueField: 'idcomprobante',
            displayField: 'numcomprobante',
            anchor: '100%',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{numcomprobante}" class="x-combo-list-item">{numcomprobante}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarEstado = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarEstado',
            fieldLabel: scope.etiquetas.lbEstado, //'Estado',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarEstado,
            emptyText: 'Seleccione...',
            valueField: 'idestado',
            displayField: 'estado',
            anchor: '100%',
            editable: false,
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{estado}" class="x-combo-list-item">{estado}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarTipoFecha = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarTipoFecha',
            fieldLabel: scope.etiquetas.lbTipoFecha, //'Tipo fecha',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarTipoFecha,
            valueField: 'idtipofecha',
            displayField: 'tipofecha',
            anchor: '100%',
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{tipofecha}" class="x-combo-list-item">{tipofecha}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarEjercicio = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarEjercicio',
            fieldLabel: scope.etiquetas.lbEjercicio, //'Ejercicio',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarEjercicio,
            valueField: 'idejercicio',
            displayField: 'nombre',
            anchor: '100%',
            triggerAction: 'all',
            editable: false,
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarPeriodo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarPeriodo',
            fieldLabel: scope.etiquetas.lbPeriodo, //'Per&iacute;odo',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarPeriodo,
            valueField: 'idperiodo',
            displayField: 'nombre',
            anchor: '100%',
            editable: false,
            emptyText: 'Seleccione...',
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarCuenta = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarCuenta',
            fieldLabel: scope.etiquetas.lbCuenta, //'Cuenta',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarCuenta,
            valueField: 'idcuenta',
            displayField: 'nombre',
            anchor: '100%',
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarSubsistema = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarSubsistema',
            fieldLabel: scope.etiquetas.lbSubsistema, //'Subsistema',
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarSubsistema,
            valueField: 'idsubsistema',
            displayField: 'nombre',
            anchor: '100%',
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarClienteProveedor = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarClienteProveedor',
            fieldLabel: 'Acreedor/Deudor',
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

        scope.fpBuscarMg = new Ext.FormPanel({
            frame: true,
            border: false,
            id: 'fpBuscarMg',
            autoHeight: true,
            region: 'center',
            items: [{
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.tfBuscarNumeroDocumento]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.cbBuscarComprobante]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.cbBuscarEstado]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.tfBuscarImporte]
                        }]
                }, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .5,
                            items: [scope.cbBuscarClienteProveedor]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.cbBuscarEjercicio]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.cbBuscarPeriodo]
                        }]
                }, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .5,
                            items: [scope.dfBuscarDesde]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .5,
                            items: [scope.dfBuscarHasta]
                        }]
                }]
        });

        Ext.apply(this, {
            modal: true,
            id: 'winbuscar',
            autoValidate: false,
            labelAlign: 'top',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closable: false,
            layout: 'fit',
            title: scope.etiquetas.lbBuscarAvanz, //'Buscar',
            defaultButton: 'btnBuscarAceptar',
            width: '40%',
            items: [scope.fpBuscarMg],
            buttons: [scope.btnBuscarCerrar, scope.btnBuscarAceptar]
        });

        return Ext.UIBuscarMov.superclass.constructor.call(this);
    }
});

