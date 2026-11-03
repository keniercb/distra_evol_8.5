Ext.namespace('Ext.UIBuscarDuo');
Ext.UIBuscarDuo = Ext.extend(Ext.Window, {
    constructor: function(scope)
    {
        scope.btnBuscarCerrar = new Ext.Button({
            id: 'btnBuscarCerrar',
            text: scope.etiquetas.lbBtnCancelar,
            tooltip: scope.etiquetas.tooltipCloseSearch,
            tabIndex: 6,
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.btnBuscarAceptar = new Ext.Button({
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: scope.etiquetas.tooltipAceptSearch.replace('<#tipoDuo>',scope.textDuoPlural.toLowerCase()),
            tabIndex: 7,
            disabled: true,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this
        });

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

        scope.tfBuscarNumeroDocumento = new Ext.form.TextField({// Misma validacion que el numero de instrumento
            disabledClass: 'disabled-component',
            id: 'tfBuscarNumeroDocumento',
            fieldLabel: /*scope.etiquetas.lbNumDocumento, //*/'N&uacute;mero documento',
            name: 'tfBuscarNumeroDocumento',
            selectOnFocus: true,
			tabIndex: 2,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda \-\+\/\(\)]*$/,
            anchor: '100%',
            //style: 'text-align:right;',
            enableKeyEvents: true,
            listeners: {
                keyup: function(field, e) {
                    if (Ext.getCmp('fpBuscarDuo').getForm().isValid()) {
                        if (field.getValue().length > 0 || !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()))
                            scope.btnBuscarAceptar.enable();
                        else
                            scope.btnBuscarAceptar.disable();
                    }
                    else
                        scope.btnBuscarAceptar.disable();
                }
            }
        });

        scope.tfBuscarNumeroContrato = new Ext.form.TextField({// Misma validacion que el numero de instrumento
            disabledClass: 'disabled-component',
            id: 'tfBuscarNumeroContrato',
            fieldLabel: /*scope.etiquetas.lbNumContrato, //*/'N&uacute;mero contrato',
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
			tabIndex: 4,
            selectOnFocus: true,
            maxLength: 16, // asi esta definido en el modelo de datos
            maxLengthText: 'El tamaño m&aacute;ximo requerido es de 16 caracteres.',
            maskRe: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function(field, e) {
                    if (Ext.getCmp('fpBuscarDuo').getForm().isValid()) {
                        if (field.getValue().length > 0 || !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) || !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()))
                            scope.btnBuscarAceptar.enable();
                        else
                            scope.btnBuscarAceptar.disable();
                    }
                    else
                        scope.btnBuscarAceptar.disable();
                }
            }
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

        scope.cbBuscarNumeroContrato = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarNumeroContrato',
            fieldLabel: scope.etiquetas.lbNumContrato, //'Tipo documento',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarNumeroContrato,
            valueField: 'idcontrato',
            displayField: 'numerocontrato',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{numerocontrato}" class="x-combo-list-item">{numerocontrato}</div></tpl>',
            enableKeyEvents: true
        });

        scope.cbBuscarTipoDoc = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarTipoDoc',
            fieldLabel: scope.etiquetas.lbTipoDoc, //'Tipo documento',
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
			tabIndex: 1,
            store: scope.stBuscarTipoDoc,
            valueField: 'iddoc',
            displayField: 'denominacion',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                select: function() {
                    if(Ext.getCmp('fpBuscarDuo').getForm().isValid())
                        scope.btnBuscarAceptar.enable();
                },
                keypress: function(field, e) {
                    if (!Ext.isEmpty(Ext.getCmp('fpBuscarDuo').getForm().isValid() && scope.tfBuscarNumeroDocumento.getValue()) || !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()))
                        scope.btnBuscarAceptar.enable();
                    else
                        scope.btnBuscarAceptar.disable();
                }
            }
        });

        scope.cbBuscarClienteProveedor = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarClienteProveedor',
            fieldLabel: scope.nombreClienteProveedor,
            mode: 'local',
//            emptyText: scope.etiquetas.lbTodos,
            resizable: true,
            selectOnFocus: true,
			tabIndex: 5,
            store: scope.stBuscarClienteProveedor,
            valueField: 'idcliente',
            displayField: 'nombre',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                select: function() {
                    if(Ext.getCmp('fpBuscarDuo').getForm().isValid())
                        scope.btnBuscarAceptar.enable();
                },
                keypress: function(field, e) {
                    if (Ext.getCmp('fpBuscarDuo').getForm().isValid() && !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) || !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarCuenta.getValue()) || !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()))
                        scope.btnBuscarAceptar.enable();
                    else
                        scope.btnBuscarAceptar.disable();
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
            valueField: 'idcomprobante',
            displayField: 'numcomprobante',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{numcomprobante}" class="x-combo-list-item">{numcomprobante}</div></tpl>',
            enableKeyEvents: true
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
            valueField: 'idestado',
            displayField: 'estado',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{estado}" class="x-combo-list-item">{estado}</div></tpl>',
            enableKeyEvents: true
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
			tabIndex: 3,
            store: scope.stBuscarCuenta,
            valueField: 'idcuenta',
            displayField: 'nombre',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                select: function() {
                    if(Ext.getCmp('fpBuscarDuo').getForm().isValid())
                        scope.btnBuscarAceptar.enable();
                },
                keypress: function(field, e) {
                    if (Ext.getCmp('fpBuscarDuo').getForm().isValid() && !Ext.isEmpty(scope.tfBuscarNumeroDocumento.getValue()) || !Ext.isEmpty(scope.tfBuscarImporte.getValue()) || !Ext.isEmpty(scope.cbBuscarClienteProveedor.getValue()) || !Ext.isEmpty(scope.cbBuscarTipoDoc.getValue()))
                        scope.btnBuscarAceptar.enable();
                    else
                        scope.btnBuscarAceptar.disable();
                }
            }
        });

        scope.cbBuscarSubsistema = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cbBuscarSubsistema',
            fieldLabel: scope.etiquetas.lbSubsistema,
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stBuscarSubsistema,
            valueField: 'idsubsistema',
            displayField: 'nombre',
            //forceSelection : true,
            anchor: '100%',
            triggerAction: 'all',
            //typeAhead: true,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true
        });

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
                            columnWidth: .5,
                            items: [scope.cbBuscarTipoDoc]
                        }, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .5,
                            items: [scope.tfBuscarNumeroDocumento]
                        }/*, {
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .33,
                            items: [scope.tfBuscarNumeroContrato]
                        }*/]
                }, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [ {
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .5,
                            items: [scope.cbBuscarCuenta]
                        },{
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .5,
                            items: [scope.tfBuscarImporte]
                        }]
                }, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: 1,
                            items: [scope.cbBuscarClienteProveedor]
                        }]
                }/*, {
                    labelAlign: 'top',
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: (scope.confEspecialidad) ? 1 : .25,
                            items: [(scope.confEspecialidad) ? scope.cbBuscarEspecialidad : scope.lfBuscarEspVacio]
                        }]
                }*/]
        });

        Ext.apply(this, {
            modal: true,
            id: 'winbuscar',
            labelAlign: 'top',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closable: false,
			autoValidate: false,
            layout: 'fit',
            defaultButton: 'btnBuscarCerrar',
            title: (scope.tipoDuo == 1) ? 'Buscar cuentas por cobrar' : 'Buscar cuentas por pagar',//'Buscar',
            width: '45%',
            items: [scope.fpBuscarDuo],
            buttons: [scope.btnBuscarCerrar, scope.btnBuscarAceptar]
        });

        return Ext.UIBuscarDuo.superclass.constructor.call(this);
    }
});

