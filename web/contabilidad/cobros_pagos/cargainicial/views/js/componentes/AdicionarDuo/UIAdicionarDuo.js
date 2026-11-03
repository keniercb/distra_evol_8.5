Ext.namespace('Ext.UIAdicionarDuo');

Ext.UIAdicionarDuo = Ext.extend(Ext.Window, {
    constructor: function (scope) {
        scope.btnAddCerrar = new Ext.Button({
            id: 'btnAddCerrar',
            text: scope.etiquetas.lbBtnCancelar, //'Cerrar',
            tabIndex: 113,
            tooltip: 'Cerrar ventana sin guardar los datos',//scope.etiquetas.tooltipCloseAdd, //'Cerrar',
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.btnAddNuevo = new Ext.Button({
            id: 'btnAddNuevo',
            text: /*scope.etiquetas.lbBtnNuevo, //*/'Aplicar',
            tabIndex: 114,
            tooltip: 'Guardar datos y limpiar los campos',//scope.etiquetas.tooltipNewAdd, //'Nuevo',
//            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            scope: this
        });

        scope.btnAddGuardar = new Ext.Button({
            id: 'btnAddGuardar',
            text: scope.etiquetas.lbBtnAceptar, //'Aceptar',
            tabIndex: 115,
            tooltip: 'Guardar datos y cerrar ventana',//scope.etiquetas.tooltipAceptAdd.replace('<#artDuo>', scope.artTexto.toLowerCase()).replace('<#tipoDuo>', scope.textDuo.toLowerCase()), //'Aceptar',
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: (scope.action == 1) ? false : true,
            scope: this
        });

        scope.btnAddAddOp = new Ext.Button({
            disabled: false,
            id: 'btnAddAddOp',
            tooltip: scope.etiquetas.lbBtnAdicionar, //'Adicionar',
//            icon: perfil.dirImg + 'adicionar.png ',
            iconCls: 'adicionar',
            scope: this
        });

        scope.btnAddModOp = new Ext.Button({
            disabled: true,
            id: 'btnAddModOp',
            tooltip: scope.etiquetas.lbBtnModificar, //'Modificar',
//            icon: perfil.dirImg + 'modificar.png ',
            iconCls: 'modificar',
            scope: this
        });

        scope.btnAddDelOp = new Ext.Button({
            disabled: true,
            id: 'btnAddDelOp',
            tooltip: scope.etiquetas.lbBtnEliminar, //'Eliminar',
//            icon: perfil.dirImg + 'eliminar.png ',
            iconCls: 'eliminar',
            scope: this
        });

        scope.btnAddCancOp = new Ext.Button({
            disabled: true,
            id: 'btnAddCancOp',
            tooltip: scope.etiquetas.lbBtnCancelar, //'Cancelar operaci&oacute;n',
//            icon: perfil.dirImg + 'cancelar.png ',
            iconCls: 'cancelar',
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

        scope.tfAddNumeroDocumento = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            id: 'tfAddNumeroDocumento',
            fieldLabel: /*scope.etiquetas.lbNumDocumento, //*/'N&uacute;mero documento',
            name: 'numero',
            allowBlank: false,
            selectOnFocus: true,
            enableKeyEvents: true,
            tabIndex: 105,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            // maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda _\-]*$/,
            // regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+([--_]?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+)*)+$/,
            // regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales (-,_).',
            anchor: '100%',
            maxLength: 100, // asi esta definido en el modelo de datos
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 100 caracteres.',//scope.etiquetas.msgMaxLength.replace("<#>", '100'),
            editable: false,
            /*listeners: {

             }*/
        });

        scope.tfAddNumeroContrato = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            id: 'tfAddNumeroContrato',
            fieldLabel: /*scope.etiquetas.lbNumContrato, //*/'N&uacute;mero contrato',
            name: 'numerocontrato',
//            allowBlank: false,
            selectOnFocus: true,
            tabIndex: 106,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda _\-\+\.\/\(\)]*$/,
            //regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda \-\+\/\(\)]*$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+([+--_ */.()]?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\(\)]+)*)+$/,
            regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales (-,+,_,/,.,(,)) entre caracteres alfanuméricos.',
             enableKeyEvents: true,
            anchor: '100%',
            maxLength: 100,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 100 caracteres.',
            editable: false
        });

        scope.tfAddImporteOriginal = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: scope.etiquetas.lbImporteOriginal, //'Importe',
            id: 'tfAddImporteOriginal',
            name: 'importe',
            anchor: '100%',
            tabIndex: 109,
            allowNegative: false,
            emptyText: '0.00',
            allowBlank: false,
            selectOnFocus: true,
            style: 'text-align: right',
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            maxLength: 16,
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            enableKeyEvents: true,
            editable: false,
            listeners: {
                blur: function (tf) {
                    tf.setValue(scope.fSaldo(tf.getValue()));
                }
            }
        });

        scope.tfAddImporteContable = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: 'Importe',/*scope.etiquetas.lbImporteContable, */
            id: 'tfAddImporteContable',
            name: 'importe',
            anchor: '100%',
            allowNegative: false,
            tabIndex: 110,
            emptyText: '0.00',
            allowBlank: false,
            selectOnFocus: true,
            style: 'text-align: right',
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            maxLength: 16,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',//scope.etiquetas.m
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            enableKeyEvents: true,
            editable: false,
            listeners: {
                blur: function (tf) {
                    tf.setValue(scope.fSaldo(tf.getValue()));
                }
            }
        });

        scope.tfAddLiquidadoOriginal = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: scope.etiquetas.lbLiquidadoOriginal, //'Importe',
            id: 'tfAddLiquidadoOriginal',
            name: 'importe',
            anchor: '100%',
            allowNegative: false,
            tabIndex: 111,
            emptyText: '0.00',
            allowBlank: false,
            selectOnFocus: true,
            style: 'text-align: right',
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            maxLength: 16,
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            enableKeyEvents: true,
            editable: false,
            listeners: {
                blur: function (tf) {
                    tf.setValue(scope.fSaldo(tf.getValue()));
                }
            }
        });

        scope.tfAddLiquidadoContable = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: 'Liquidado',//scope.etiquetas.lbLiquidadoContable, //'Importe',
            id: 'tfAddLiquidadoContable',
            name: 'importe',
            anchor: '100%',
            allowNegative: false,
            tabIndex: 112,
            emptyText: '0.00',
            allowBlank: true,
            selectOnFocus: true,
            style: 'text-align: right',
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            maxLength: 16,
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            enableKeyEvents: true,
            editable: false,
            listeners: {
                blur: function (tf) {
                    tf.setValue(scope.fSaldo(tf.getValue()));
                }
            }
        });

        scope.cbAddOperacion = new Ext.form.ComboBox({
            id: 'cbAddOperacion',
            fieldLabel: scope.etiquetas.lbOperacion, //'Operaci&oacute;n',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            mode: 'local',
            hiddenName: 'idnomoperaciones',
            store: scope.stAddOperacion,
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            //typeAhead : true,
            forceSelection: true,
            triggerAction: 'all',
            anchor: '100%',
            resizable: true,
            allowBlank: false,
            editable: true,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.lfAddServVacio = new Ext.form.Label({
            id: 'lfAddServVacio',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        scope.lfAddEspVacio = new Ext.form.Label({
            id: 'lfAddEspVacio',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        scope.dfAddFechaEmision = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfAddFechaEmision',
            fieldLabel: scope.etiquetas.lbFechaEmision, //'Fecha de emisi&oacute;n',
            name: 'fechaemision',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regex: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            regexText: 'asdasdasd',
            readOnly: true,
            tabIndex: 100,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            anchor: '100%',
            format: 'd/m/Y',
            enableKeyEvents: true
        });

        scope.dfAddFechaEntrega = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfAddFechaEntrega',
            fieldLabel: scope.nombreFecha,
            name: 'fechaentrega',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            selectOnFocus: true,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            readOnly: false,
            editable: true,
            allowBlank: false,
            anchor: '100%',
            format: 'd/m/Y',
            enableKeyEvents: true,
            listeners: {
                keypress: function (t, e) {
                    if (e.getKey() == 13) // Enter
                    {
                        if (!scope.dfAddFechaEntrega.getValue())
                            scope.dfAddFechaEntrega.setValue(scope.fechaContable);
                        return;
                    }
                }
            }
        });

        scope.dfAddFechaRecepcion = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfAddFechaRecepcion',
            fieldLabel: scope.etiquetas.lbFechaRecepcion, //'Fecha de recepci&oacute;n',
            name: 'fecharecepcion',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            selectOnFocus: true,
            readOnly: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            allowBlank: (scope.tipoDuo == 1) ? true : false,
            anchor: '100%',
            format: 'd/m/Y',
            editable: true,
            enableKeyEvents: true,
            listeners: {
                keypress: function (t, e) {
                    if (e.getKey() == 13) // Enter
                    {
                        if (!scope.dfAddFechaRecepcion.getValue())
                            scope.dfAddFechaRecepcion.setValue(scope.fechaContable);
                        return;
                    }
                }
            }
        });

        scope.ckbAddExcepcional = new Ext.form.Checkbox({
            boxLabel: scope.etiquetas.lbExcepcional, //'Excepcional',
            hideLabel: true,
            selectOnFocus: true,
            enableKeyEvents: true,
            id: 'ckbexcepcional',
            name: 'excepcional'
        });

        scope.ckbAddServicio = new Ext.form.Checkbox({
            boxLabel: scope.etiquetas.lbServicio, //'Servicio',
            hideLabel: true,
            id: 'ckbservicio',
            name: 'servicio'
        });

        scope.tfAddComentario = new Ext.form.TextArea({
            disabledClass: 'disabled-component',
            id: 'tfAddComentario',
            fieldLabel: scope.etiquetas.lbDetalle, //'Detalle',//'Comentario',
            name: 'comentario',
            maxLength: 255,
            tabIndex: 107,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255 caracteres.', //"Este campo admite como m&aacute;ximo 255 caracteres.",
            anchor: '100%',
            allowBlank: false,
            selectOnFocus: true,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',      
            enableKeyEvents: true,
            editable: false
        });

        scope.tfAddImporteTotal = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            id: 'tfAddImporteTotal',
            disabled: true,
            fieldLabel: scope.etiquetas.lbImpTotalCont, //'Importe total contable',
            name: 'importecontable',
            selectOnFocus: true,
            anchor: '100%',
            editable: false
        });

        scope.tfAddLiquidadoTotal = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            id: 'tfAddLiquidadoTotal',
            disabled: true,
            fieldLabel: scope.etiquetas.lbImpTotalCont, //'Importe total contable',
            name: 'importecontable',
            selectOnFocus: true,
            anchor: '100%',
            editable: false
        });

        scope.cbAddClienteProveedor = new Ext.form.ComboBox({
            id: 'cbAddClienteProveedor',
            fieldLabel: scope.nombreCliente,
            store: scope.stAddClienteProveedor,
            name: 'idcliente',
            valueField: 'idcliente',
            hiddenName: 'idcliente',
            displayField: 'nombre',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            editable: true,
            pageSize: 10,
            minChars: 3,
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            //typeAhead : true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'remote',
            //mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            readOnly: false,
            tabIndex: 4,
            enableKeyEvents: true
        });

        scope.cbAddCuenta = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            editable: true,
            forceSelection: true,
            allowBlank: false,
            selectOnFocus: true,
            resizable: true,
            id: 'cbAddCuenta',
            // disabled: true,
            //typeAhead : true,
            name: 'idcuenta',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            fieldLabel: scope.etiquetas.lbCuenta, //'Cuenta',
            triggerAction: 'all',
            anchor: '100%',
            displayField: 'nombrecuenta',
            valueField: 'idcuenta',
            hiddenName: 'idcuenta',
            store: scope.stAddCuenta,
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombrecuenta}" class="x-combo-list-item">{nombrecuenta}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keypress: function (t, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                        this.clearValue();
                }
            }
        });
        
        scope.cbAddClasificadorCuenta = new Ext.contabilidad.util.linkedCombo({
            fieldLabel: scope.etiquetas.lbCuenta,
            store: scope.stAddClasificadorCuenta,
            displayField: 'denominacion',
            valueField: 'cuenta',
//            disabled: true,
            listHeight: 200,
            tipocta: '',
            id: 'lnkcuenta',
            lazyRender: true,
//            buttons: [this.btnAddCampo],
            fnCreateNew: Ext.emptyFn
        });

        scope.cbAddParrafoFiscal = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            hiddenTbar: true,
            fieldLabel: scope.etiquetas.lbParrafoFiscal
        }, {
            identificador: 'Parrafo',
            displayText: 'Parrafo',
            singleSelect: true,
            url: scope.url + 'loadTreeParrafoFiscal',
            reader: scope.jrParrafoFiscal = new Ext.data.JsonReader({
                id: 'idparrafofiscal'
            }, [{
                name: 'text',
                mapping: 'descripcion'
            }, {
                name: 'codigo',
                mapping: 'descripcion'
            }, {
                name: '_parent',
                mapping: 'padre'
            }, {
                name: 'isLeaf',
                mapping: 'leaf'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }, {
                name: 'idparrafofiscal'
            }])
        });

        scope.cbAddEspecialidad = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            disabled: true,
            hiddenTbar: true,
            fieldLabel: 'Especialidad'
        }, {
            identificador: 'Especialidad',
            displayText: 'Especialidad',
            singleSelect: true,
            url: scope.url + 'loadTreeEspecialidad',
            reader: scope.jrEspecialidad = new Ext.data.JsonReader({
                id: 'idespecialidad'
            }, [{
                    name: 'text',
                    mapping: 'especialidad'
                }, {
                    name: 'codigo',
                    mapping: 'especialidad'
                }, {
                    name: 'codespecialidad',
                    mapping: 'codespecialidad'
                }, {
                    name: '_parent',
                    mapping: 'padre'
                }, {
                    name: '_is_leaf',
                    mapping: 'leaf'
                }, {
                    name: 'ordenizq'
                }, {
                    name: 'ordender'
                }, {
                    name: 'idespecialidad'
                }])
        });

        scope.cbAddTipoDoc = new Ext.form.ComboBox({
            fieldLabel: scope.etiquetas.lbTipoDoc, //'Tipo documento',
            mode: 'local',
            id: 'cbAddTipoDoc',
            name: 'iddoc',
            hiddenName: 'iddoc',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            store: scope.stAddTipoDoc,
            tabIndex: 103,
            valueField: 'iddoc',
            displayField: 'denominacion',
            //typeAhead : true,	
            forceSelection: true,
            triggerAction: 'all',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            resizable: true,
            anchor: '100%',
            allowBlank: false,
            editable: true,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keypress: function (t, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                        this.clearValue();
                }
            }
        });

        scope.cbAddCondicionPago = new Ext.form.ComboBox({
            id: 'cbAddCondicionPago',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            //typeAhead : true,
            name: 'idcondicionpago',
            // name: 'idcondicionpago',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            fieldLabel: scope.etiquetas.lbCondPago, //'Cuenta',
            triggerAction: 'all',
            anchor: '100%',
            displayField: 'denominacion',
            valueField: 'idcondicionpago',
            hiddenName: 'idcondicionpago',
            store: scope.stAddCondicionPago,
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 5,
            enableKeyEvents: true
        });

        scope.cbAddMoneda = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            forceSelection: true,
            id: 'cbAddMoneda',
            editable: true,
            fieldLabel: scope.etiquetas.lbMoneda, //'Moneda',
            store: scope.stAddMoneda,
            valueField: 'idmoneda',
            tabIndex: 108,
            displayField: 'codigoiso',
            hiddenName: 'idmoneda',
            //typeAhead : true,
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '100%',
            resizable: true,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keypress: function (t, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                        this.clearValue();
                }
            }
        });

        scope.gpAddGridOperaciones = new Ext.grid.GridPanel({
            id: 'gpAddGridOperaciones',
            store: scope.stAddGridOperaciones,
            sm: scope.smAddGridOperaciones,
            region: 'center',
            height: 100,
            autoExpandColumn: 'moneda',
            columns: [
                {
                    id: 'moneda',
                    header: scope.etiquetas.lbMoneda, //'Moneda',
                    dataIndex: 'moneda',
                    width: 130,
                    sortable: true,
//                    renderer: formatoMonedaABS
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    id: 'importeoriginal',
                    header: scope.etiquetas.lbImporteOriginal, //'Importe',
                    dataIndex: 'importeoriginal',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    id: 'importecontable',
                    header: scope.etiquetas.lbImporteContable, //'Importe contable',
                    dataIndex: 'importecontable',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    id: 'liquidadomo',
                    header: scope.etiquetas.lbLiquidadoOriginal, //'Importe',
                    dataIndex: 'liquidadomo',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    id: 'liquidadomb',
                    header: scope.etiquetas.lbLiquidadoContable, //'Importe contable',
                    dataIndex: 'liquidadomb',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idoperacion',
                    id: 'idoperacion',
                    sortable: true
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idmoneda',
                    id: 'idmoneda',
                    sortable: true
                }, {
                    hidden: true,
                    hideable: false,
                    //renderer: formatoMonedaABS,
                    dataIndex: 'importaux',
                    id: 'importaux',
                    sortable: true
                }
            ],
            bbar: ['->', new Ext.Toolbar.TextItem(scope.etiquetas.lbImpTotalCont), scope.tfAddImporteTotal, new Ext.Toolbar.TextItem(scope.etiquetas.lbImpTotalLiq), scope.tfAddLiquidadoTotal]
        });

        scope.fpAddDuo = new Ext.FormPanel({
            origen:'center',
            baseCls: 'x-plain',
            labelWidth: 55,
            url:'save-form.php',
            defaultType: 'textfield',

            items: [{
                fieldLabel: 'Send To',
                name: 'to',
                anchor:'100%'  // anchor width by percentage
            },{
                fieldLabel: 'Subject',
                name: 'subject',
                anchor: '100%'  // anchor width by percentage
            }, {
                xtype: 'textarea',
                hideLabel: true,
                name: 'msg',
                anchor: '100% -53'  // anchor width by percentage and height by raw adjustment
            }]
        });


        Ext.apply(this, {
            modal: true,
            bodyStyle: 'padding:5px 5px 0',
            border: false,
            closable: false,
            resizable: false,
            closeAction: 'hide',
            constrain: true,
            layout: 'border',
            autoValidate: false,
            title: scope.titulo,
            width: 750,
            height: 405,
            items: [scope.fpAddDuo],
            buttons: [scope.btnAddCerrar, scope.btnAddNuevo, scope.btnAddGuardar]
        });

        if (scope.action == 2)
            scope.btnAddNuevo.hide();

        return Ext.UIAdicionarDuo.superclass.constructor.call(this);
    }
});