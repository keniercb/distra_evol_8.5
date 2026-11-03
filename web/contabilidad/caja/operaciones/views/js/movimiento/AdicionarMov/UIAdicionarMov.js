Ext.namespace('Ext.UIAdicionarMov');
Ext.UIAdicionarMov = Ext.extend(Ext.Window, {
    constructor: function (scope) {
        scope.btnAddCerrar = new Ext.Button({
            id: 'btnAddCerrar',
            text: scope.etiquetas.lbBtnCancelar,
            tooltip: scope.etiquetas.tooltipCloseAdd,
            //icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cancelar',
            scope: this
        });

        scope.btnAddNuevo = new Ext.Button({
            id: 'btnAddNuevo',
            text: scope.etiquetas.lbBtnNuevo,
            tooltip: scope.etiquetas.tooltipNewAdd,
            //icon: perfil.dirImg + 'nuevo.png',
            iconCls: 'nuevo',
            scope: this
        });

        scope.btnAddAplicar = new Ext.Button({
            id: 'btnAdd',
            text: scope.etiquetas.lbBtnAplicar,
            tooltip: scope.etiquetas.tooltipAplicar,
            iconCls: 'aplicar',
            scope: this,
            disabled: true,
        });

        scope.btnAddGuardar = new Ext.Button({
            id: 'btnAddGuardar',
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: scope.etiquetas.tooltipAceptAdd, //'Aceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this,
            disabled: true,
        });

        scope.btnNuevo = new Ext.Button({
            text: 'Nuevo',
            tooltip: 'Limpiar los campos',
            iconCls: 'nuevo'
        });

        scope.btnConfirmar = new Ext.Button({
            iconCls: 'confirmar',
            text: 'Confirmar',
            disabled: true,
            // hidden: (this.flujoNormal == 0)
            tooltip: 'Confirmar movimiento',
        });

        scope.btnPostear = new Ext.Button({
            iconCls: 'contabilidad',
            text: 'Postear',
            disabled: true,
            // hidden: (this.flujoNormal == 0)
            tooltip: 'Postear movimiento',
        });

        scope.btnAddConfirmar = new Ext.Button({
            id: 'btnAddConfirmar',
            disabled: true,
            text: scope.etiquetas.lbBtnConfirmar,
            tooltip: scope.etiquetas.tooltipConfAdd, //'Confirmar',
            //icon: perfil.dirImg + 'confirmar.png',
            iconCls: 'confirmar',
            scope: this,
            hidden: true,
        });

        scope.btnAddContabilizar = new Ext.Button({
            id: 'btnAddContabilizar',
            disabled: true,
            text: scope.etiquetas.lbBtnContabilizar,
            tooltip: scope.etiquetas.tooltipContAdd, //'Contabilizar',
            //icon: perfil.dirImg + 'contabilidad.png',
            iconCls: 'contabilidad',
            scope: this,
            hidden: true,
        });

        scope.btnAddOpAdicionar = new Ext.Button({
            id: 'btnAddOpAdicionar',
            disabled: false,
            tooltip: scope.etiquetas.lbBtnAdicionar,
            //icon: perfil.dirImg + 'adicionar.png ',
            iconCls: 'adicionar',
            scope: this
        });

        scope.btnAddOpModificar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpModificar',
            tooltip: scope.etiquetas.lbBtnModificar,
            //icon: perfil.dirImg + 'modificar.png ',
            iconCls: 'modificar',
            scope: this
        });

        scope.btnAddOpEliminar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpEliminar',
            tooltip: scope.etiquetas.lbBtnEliminar,
            //icon: perfil.dirImg + 'eliminar.png ',
            iconCls: 'eliminar',
            scope: this
        });

        scope.btnAddOpCancelar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpCancelar',
            tooltip: scope.etiquetas.lbBtnCancelar,
            //icon: perfil.dirImg + 'cancelar.png ',
            iconCls: 'cancelar',
            scope: this
        });

        scope.btnAddLiquidarTodo = new Ext.Button({
            disabled: false,
            id: 'btnAddLiquidarTodo',
            text: scope.etiquetas.lbLiquidarTodo,
            tooltip: scope.etiquetas.lbTtpLiquidarTodo,
            //icon: perfil.dirImg + 'aplicar.png ',
            iconCls: 'aplicar',
            scope: this
        });

        scope.btnAddActualizar = new Ext.Button({
            disabled: false,
            id: 'btnAddActualizar',
            text: scope.etiquetas.lbActualizarCxc,
            tooltip: scope.etiquetas.lbTtpActualizarCxc,
            //icon: perfil.dirImg + 'actualizar.png ',
            iconCls: 'actualizar',
            scope: this
        });

        scope.checkGpInstrumentos = new Ext.form.TextField({
            name: 'check',
            allowBlank: true,
            anchor: '100%',
            hidden: true
        });

        scope.cbAddOperacion = new Ext.form.ComboBox({
            id: 'cbAddOperacion',
            fieldLabel: scope.etiquetas.lbOperacion,
            emptyText: scope.etiquetas.lbSeleccione,
            mode: 'local',
            disabled: true,
            hiddenName: 'idoperacion',
            store: scope.stAddOperacion,
            valueField: 'idoperacion',
            displayField: 'denominacion',
            forceSelection: true,
            triggerAction: 'all',
            anchor: '100%',
            resizable: true,
            allowBlank: true,
            editable: false,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        //CB Acreedor/Deudor
        var dataAcreedorDeudor = (scope.tipoMovimiento == 1) ? [[1, 'Trabajador'], [3, 'Proveedor']] : [[1, 'Trabajador'], [2, 'Cliente']];
        scope.stAcreedorDeudor = new Ext.data.SimpleStore({
            fields: ['idacreedordeudor', 'acreedordeudor']
        });
        scope.stAcreedorDeudor.loadData(dataAcreedorDeudor);
        this.firstElement = scope.cbAcreedorDeudor = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            //fieldLabel: scope.etiquetas.lbAcreedorDeudor,
            fieldLabel: (scope.tipoMovimiento == 1) ? scope.etiquetas.lbAcreedor : scope.etiquetas.lbDeudor,
            mode: 'local',
            resizable: true,
            selectOnFocus: true,
            store: scope.stAcreedorDeudor,
            emptyText: 'Seleccione...',
            valueField: 'idacreedordeudor',
            displayField: 'acreedordeudor',
            anchor: '100%',
            editable: false,
            allowBlank: false,
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{acreedordeudor}" class="x-combo-list-item">{acreedordeudor}</div></tpl>',
            enableKeyEvents: true
        });
        //////---------------------------------------------

        scope.cbAddTrabajadorCliente = new Ext.form.ComboBox({
            id: 'cbAddTrabajadorCliente',
            disabledClass: 'disabled-component',
            // fieldLabel: (scope.tipoMovimiento == 1) ? scope.etiquetas.lbRecibidoPor : scope.etiquetas.lbRecibidoDe,
            store: scope.stAddTrabajadorCliente,
            labelSeparator: '',
            name: 'idcliente',
            valueField: 'idcliente',
            hiddenName: 'idcliente',
            displayField: 'nombre',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            editable: true,
            disabled: true,
            forceSelection: true,
            allowBlank: false,
            mode: 'remote',
            blankText: scope.etiquetas.lbBlankText,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            minChars: 0, //Para la nueva busqueda poner contraria esta linea
            pageSize: 20, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\-\.]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.dfAddFechaEmisionMovGen = new Ext.form.DateField({
            id: 'dfAddFechaEmisionMovGen',
            // fieldLabel: scope.etiquetas.lbFechaEmision,
            fieldLabel: scope.etiquetas.lbFecha,
            name: 'fechaemision',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            readOnly: false,
            editable: true,
            allowBlank: false,
            value: fechaContable,
            minValue: !scope.cargaInicial ? fechaInicio : null,
            maxValue: fechaFin,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.cbAddRecibidoPor = new Ext.form.ComboBox({
            id: 'cbAddRecibidoPor',
            fieldLabel: scope.etiquetas.lbRecibidoPor,
            store: scope.stAddNumeroContrato,
            name: 'idcontrato',
            valueField: 'idcontrato',
            hiddenName: 'idcontrato',
            displayField: 'numerocontrato',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            editable: true,
            forceSelection: true,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numerocontrato}" class="x-combo-list-item">{numerocontrato}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddImporteTotalMovGen = new Ext.form.TextField({
            id: 'tfAddImporteTotalMovGen',
            fieldLabel: scope.etiquetas.lbImpTotalMovGen, //'N&uacute;mero documento',
            // name: 'importetotal',
            allowBlank: false,
            disabled: true,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            anchor: '100%',
            width: 100,
            maxLength: 100,
            value: '0.00',
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            style: 'text-align: right',
            enableKeyEvents: true
        });

        scope.tfAddImpLetras = new Ext.form.TextField({
            id: 'tfAddImpLetras',
            fieldLabel: scope.etiquetas.lbImpEnLetras, //'N&uacute;mero documento',
            name: 'importeletras',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            anchor: '100%',
            editable: false,
            disabled: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddFaltanteMovGen = new Ext.form.TextField({
            id: 'tfAddFaltanteMovGen',
            fieldLabel: scope.etiquetas.lbFaltante, //'N&uacute;mero documento',
            name: 'faltante',
            allowBlank: true,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            anchor: '100%',
            maxLength: 100,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddComentarioMovGen = new Ext.form.TextField({
            id: 'tfAddComentarioMovGen',
            fieldLabel: scope.etiquetas.lbObservacion,
            name: 'comentario',
            maxLength: 100,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            maxLengthText: scope.etiquetas.lbMaxLengthText,
            anchor: '100%',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                invalid: function (cmp, msg) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                },
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });
        //Numero para Carga Inicial
        scope.tfAddNumeroMovGen = new Ext.form.TextField({
            id: 'tfAddNumeroMovGen',
            fieldLabel: scope.etiquetas.lbNumero,
            name: 'tfAddNumeroMovGen',
            maxLength: 16,
            maxLengthText: scope.etiquetas.lbMaxNumero,
            anchor: '100%',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            editable: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                invalid: function (cmp, msg) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                },
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        scope.tfAddImpLiquidar = new Ext.form.NumberField({
            name: 'tfAddImpLiquidar',
            id: 'tfAddImpLiquidar',
            allowNegative: false,
            style: 'text-align:right;',
            allowDecimals: true,
            enableKeyEvents: true,
            maxLength: 15,
            //maxLengthText: scope.etiquetas.lbMaxNumero,
            maskRe: /^[0-9.\,]+$/,
            regex: /^\d+(\.\d{1,2})?$/,
            // validator: function (value) {
            //     var record = scope.stAddGridLiquidacionInst.getAt(scope.stAddGridLiquidacionInst.find('idderechouobligacion', scope.gpAddGridLiquidacionInst.getSelectionModel().getSelected().data.idderechouobligacion));
            //     if (parseFloat(parseFloat(record.data.importeliquidado) + parseFloat(value)).toFixed(2) <= parseFloat(record.data.importeOriginal)) {
            //         return true;
            //     }
            //     return 'El importe a liquidar es incorrecto.';
            // },
            /*blur: function (cb) {
                var record = scope.stAddGridLiquidacionInst.getAt(scope.stAddGridLiquidacionInst.find('idderechouobligacion', scope.gpAddGridLiquidacionInst.getSelectionModel().getSelected().data.idderechouobligacion));
                    var startValue = scope.tfAddImpLiquidar.startValue != '' ? scope.tfAddImpLiquidar.startValue : 0;
                    record.data.importeliquidado -= startValue;
                    record.set('importeliquidado', record.data.importeliquidado += parseFloat(scope.tfAddImpLiquidar.getValue()));
            }*/
        });

        scope.cbAddInstBanco = new Ext.form.ComboBox({
            id: 'cbAddInstBanco',
            fieldLabel: scope.etiquetas.lbBanco,
            hideLabel: scope.idFormaPago == 1 ? true : false,
            store: scope.stAddBanco,
            name: 'cbAddInstBanco',
            valueField: 'idbanco',
            hiddenName: 'idbanco',
            displayField: 'nombre',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddInstImporte = new Ext.form.NumberField({
            id: 'tfAddInstImporte',
            fieldLabel: scope.etiquetas.lbImpInstrumento, //'N&uacute;mero documento',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            anchor: '100%',
            maxLength: 15,
            maskRe: /^[0-9.\,]+$/,
            regex: /^\d+(\.\d{1,2})?$/,
            //regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            //editable: false,
            disabledClass: 'disabled-component',
            //disabled: true,
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddInstNumero = new Ext.form.TextField({
            id: 'tfAddInstNumero',
            fieldLabel: scope.etiquetas.lbNumeroInstrumento,
            hideLabel: scope.idFormaPago == 1 ? true : false,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 16,
            maxLengthText: scope.etiquetas.lbMaxNumero,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+?$/,
            invalidText: 'El formato correcto debe ser numeros o numeros-letras',
            enableKeyEvents: true,
            listeners: {
                scope: this,
                invalid: function (cmp, msg) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                },
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        scope.tfAddInstClaveConformacion = new Ext.form.TextField({
            id: 'tfAddInstClaveConformacion',
            fieldLabel: scope.etiquetas.lbClaveConformacion, //'N&uacute;mero documento',
            // name: 'importetotal',
            allowBlank: true,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 100,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddInstComentario = new Ext.form.TextField({
            id: 'tfAddInstComentario',
            fieldLabel: scope.etiquetas.lbObservacion,
            // name: 'importetotal',
            allowBlank: true,
            blankText: scope.etiquetas.lbBlankText,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            anchor: '95%',
            maxLength: 100,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                invalid: function (cmp, msg) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                },
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        scope.cbAddOperacionLiq = new Ext.form.ComboBox({
            id: 'cbAddOperacionLiq',
            fieldLabel: scope.etiquetas.lbOperacion,
            store: scope.stAddClienteProveedor,
            name: 'idcliente',
            valueField: 'idcliente',
            hiddenName: 'idcliente',
            displayField: 'nombre',
            emptyText: scope.etiquetas.lbSeleccione,
            disabledClass: 'disabled-component',
            editable: true,
            forceSelection: true,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddImporteTotalLiquidar = new Ext.form.TextField({
            id: 'tfAddImporteTotalLiquidar',
            fieldLabel: scope.etiquetas.lbImpTotalLiquidar,
            // name: 'importetotal',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            width: 100,
            maxLength: 100,
            editable: false,
            disabled: true,
            value: '0.00',
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddImporteTotalOtrasOper = new Ext.form.TextField({
            id: 'tfAddImporteTotalOtrasOper',
            // name: 'importetotal',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            width: 100,
            maxLength: 100,
            editable: false,
            disabled: true,
            value: '0.00',
            style: 'text-align: right',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddMonedaAnt = new Ext.form.TextField({
            id: 'tfAddMonedaAnt',
            fieldLabel: scope.etiquetas.lbMoneda,
            // name: 'importetotal',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 100,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.cbOtrasOperaciones = new Ext.form.ComboBox({
            id: 'cbOtrasOperaciones',
            fieldLabel: scope.etiquetas.lbMovimiento,
            store: scope.stOtrasOperaciones,
            name: 'cbOtrasOperaciones',
            valueField: 'idoperacion',
            hiddenName: 'idoperacion',
            displayField: 'denominacion',
            emptyText: scope.etiquetas.lbSeleccione,
            disabledClass: 'disabled-component',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            resizable: true,
            triggerAction: 'all',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        scope.cbCuentaOper.focus();
                },
                select: function (tf, record) {
                    if (!scope.cargaInicial) {
                        scope.stCuentaOper.removeAll();
                        if (record.data.arrayIdCuenta.length) {
                            scope.stCuenta.baseParams.arrayIdCuenta = Ext.encode(record.data.arrayIdCuenta);
                            scope.cbxCuenta.reset();
                            scope.cbxCuenta.load();
                        } else {
                            if (record.data.idtipomovimientocaja == 3)//Ancitipo
                                mostrarMensaje(1, scope.etiquetas.msgNoCuentaConfigAnticipo);
                            else mostrarMensaje(1, scope.etiquetas.msgNoCuentaConfigOtrasOper);
                        }
                    }
                }
            }
        });

        scope.cbCuentaOper = new Ext.form.ComboBox({
            id: 'cbCuentaOper',
            store: scope.stCuentaOper,
            name: 'cbCuentaOper',
            valueField: 'idcuenta',
            hiddenName: 'idcuenta',
            displayField: 'nomcuenta',
            emptyText: scope.etiquetas.lbSeleccione,
            disabledClass: 'disabled-component',
            editable: true,
            forceSelection: true,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            resizable: true,
            triggerAction: 'all',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        scope.tfAddImporteAnt.focus();
                },
                select: function (tf, record) {
                    var index = scope.stAddGridOtrasOper.find('idcuenta', tf.value);
                    if (index != -1) {
                        scope.cbCuentaOper.reset();
                        mostrarMensaje(1, scope.etiquetas.lbExistCuenta);
                    }
                }
            }
        });

//--Cargar las cuentas de otras operaciones
        scope.stCuenta = new Ext.data.Store({
            url: 'cargarcuentas',
            // autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuenta'},
                {name: 'text'},
                {name: 'idmoneda'},
                {name: 'codigoiso'}
            ])
        });

        scope.cbxCuenta = new Ext.contabilidad.util.linkedCombo({
            store: scope.stCuenta,
            fieldLabel: scope.etiquetas.lbCuenta,
            displayField: 'text',
            valueField: 'idcuenta',
            hideTbar: true,
            listHeight: 200,
            tabIndex: 4,
            anchor: '97%',
            disabled: true,
            id: 'cbxCuenta',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.tfAddImporteAnt.focus();
                },
                select: function (cb) {
                    var index = scope.stAddGridOtrasOper.find('idcuenta', cb.getValue());
                    if (index != -1) {
                        cb.reset();
                        mostrarMensaje(1, scope.etiquetas.lbExistCuenta);
                    }
                }
            }
        });
//----------------------------------------
        scope.tfAddImporteAnt = new Ext.form.NumberField({
            id: 'tfAddImporteAnt',
            fieldLabel: scope.etiquetas.lbImporte,
            // name: 'importetotal',
            blankText: scope.etiquetas.lbBlankText,
            maxLength: 15,
            maskRe: /^[0-9.\,]+$/,
            regex: /^\d+(\.\d{1,2})?$/,
            allowNegative: false,
            allowDecimals: true,
            allowBlank: false,
            disabledClass: 'disabled-component',
            style: 'text-align:right;',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        scope.tfAddComentarioAnt.focus();
                }
            },
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            }
        });

        scope.tfAddComentarioAnt = new Ext.form.TextField({
            id: 'tfAddComentarioAnt',
            fieldLabel: scope.etiquetas.lbObservacion,
            // name: 'importetotal',
            allowBlank: true,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 100,
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?)+$/, //CF
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        scope.rowEditor.focus();
                }
            }
        });

        scope.btnAddRegistrarInstrumento = new Ext.Button({
            id: 'btnAddRegistrarInstrumento',
            text: scope.etiquetas.lbBtnAddInstrumento,
            tooltip: scope.etiquetas.lbTtpAddInstrumento,
            //icon: perfil.dirImg + 'adicionar.png ',
            iconCls: 'guardar',
            scope: this
        });

        scope.btnAddLimpiarInstrumento = new Ext.Button({
            id: 'btnAddLimpiarInstrumento',
            // text: scope.etiquetas.lbBtnLimpiarInstrumento,
            text: 'Nuevo',
            // tooltip: scope.etiquetas.lbTtpLimpiarInstrumento,
            tooltip: 'Nuevo instrumento',
            //icon: perfil.dirImg + 'limpiar.png ',
            iconCls: 'nuevo',
            scope: this
        });

        scope.lfAddVacio = new Ext.form.Label({
            id: 'lfAddVacio',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        scope.rowActionInst = new Ext.grid.RowActions({
            id: 'idRowActionInst',
            widthSlope: 12,
            actions: [{
                id: 'eliminar',
                tooltip: scope.etiquetas.lbDelInstrumento,
                iconCls: 'eliminar',
                // marginLeft: 5,
                hide: scope.verInfo,//No mostrar el RowActions
                width: 16,
                height: 16
            }, {
                id: 'cancelar',
                tooltip: scope.etiquetas.lbRowActionCancelar,
                iconCls: 'cancelar',
                marginLeft: -20,
                //hide: 'showCmp',//Mostrar el RowActions
                hideIndex: 'hideCancel',
                width: 16,
                height: 16
            }]
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

        scope.gpAddGridInstrumentos = new Ext.grid.GridPanel({
            id: 'gpAddGridInstrumentos',
            store: scope.stAddGridInstrumentos,
            sm: scope.smAddGridInstrumentos,
            title: scope.etiquetas.lbInstrumentos,
            region: 'center',
            stripeRows: true,
            autoExpandColumn: 'idNumeroIntrumento',
            columns: [{
                header: scope.etiquetas.lbFormaPago,
                dataIndex: 'formaPago',
                align: 'left',
                width: 65,
                sortable: true,
                renderer: function (v, m, r) {
                    return scope.createToolTip(v, m, r);
                }
            }, {
                header: scope.etiquetas.lbNumeroInstrumento,
                dataIndex: 'numeroIntrumento',
                id: 'idNumeroIntrumento',
                sortable: true,
                renderer: function (v, m, r) {
                    return r.data.idFormaPago == 1 ? '' : r.data.numeroIntrumento;
                }
            }, {
                header: scope.etiquetas.lbImporte,
                dataIndex: 'importeIntrumento',
                align: 'right',
                width: 70,
                sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    scope.importeTotalIntrumento();
                    return formatoMonedaABS(value);
                }
            }, {
                header: scope.etiquetas.lbEstado,
                sortable: true,
                dataIndex: 'nomestado',
                width: 70,
                align: 'left'
            }, scope.rowActionInst
            ],
            plugins: [scope.rowActionInst],
            bbar: ['->', new Ext.Toolbar.TextItem(scope.etiquetas.lbImpTotalMovGen + ": "), scope.tfAddImporteTotalMovGen]
        });

        scope.gpAddGridInstrumentos.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('idestadodoc') == 6)
                return 'FilaVerde';
            if (record.get('idestadodoc') == 7)
                return 'FilaRoja';
        };

        scope.smGridLiquidacionInst = new Ext.grid.CheckboxSelectionModel({
            // singleSelect: true,
            id: 'row',
            width: 40,
            // header: 'test',
            align: 'right',
            moveEditorOnEnter: false
        });

        scope.gpAddGridLiquidacionInst = new Ext.grid.EditorGridPanel({
            id: 'gpAddGridLiquidacionInst',
            store: scope.stAddGridLiquidacionInst,
            sm: scope.smGridLiquidacionInst,
            region: 'center',
            stripeRows: true,
            autoExpandColumn: 'cuenta',
            columns: [
                scope.smGridLiquidacionInst,
                {
                header: scope.etiquetas.lbNumero,
                dataIndex: 'numeroduo',
                sortable: true,
                renderer: function (v, m, r) {
                    return scope.createToolTip(v, m, r);
                }
            }, {
                header: scope.etiquetas.lbFecha,
                dataIndex: 'fechaemision',
                sortable: true,
                renderer: function (v, m, r) {
                    return scope.createToolTip(v, m, r);
                }
            }, {
                id: 'cuenta',
                header: scope.etiquetas.lbCuenta,
                dataIndex: 'nombrecuentaduo',
                sortable: true,
                renderer: function (v, m, r) {
                    return scope.createToolTip(v, m, r);
                }
            }, {
                header: scope.etiquetas.lbImporte, //'Importe',
                renderer: formatoMonedaABS,
                dataIndex: 'importeOriginal',
                align: 'right',
                width: 100,
                sortable: true
            }, {
                header: scope.etiquetas.lbImporteLiquidado,
                dataIndex: 'importeliquidado',
                align: 'right',
                width: 120,
                sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    // return formatoMonedaABS(parseFloat(value));
                    return formatoMonedaABS(value);
                }
            }, {
                header: scope.etiquetas.lbImportePendiente,
                // dataIndex: 'importeliquidado',
                align: 'right',
                width: 120,
                sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    return formatoMonedaABS(record.data.importeOriginal - record.data.importeliquidado);
                }
            }, {
                id: 'importeliquidar',
                header: scope.etiquetas.lbImporteLiquidar,
                dataIndex: 'liquidarimp',
                editor: scope.tfAddImpLiquidar,
                align: 'right',
                width: 120,
                sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    // scope.importeTotalLiquidar();
                    // if (value) {
                    //     return formatoMonedaABS(value);
                    // }
                    // if (!value) {
                    //     record.set('liquidarimp', record.data.importeOriginal - record.data.importeliquidado);
                    //     return formatoMonedaABS(record.data.importeOriginal - record.data.importeliquidado);
                    // } else {
                    //     record.set('liquidarimp', value);
                        return value;
                    // }
                }
            }],
            bbar: [/*scope.btnAddLiquidarTodo, */scope.btnAddActualizar, '->', new Ext.Toolbar.TextItem(scope.etiquetas.lbImpTotalLiquidar + ": "), scope.tfAddImporteTotalLiquidar]
        });

        scope.gpAddGridLiquidacionInst.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('liquidarimp'))
                return 'FilaVerde';
            if (scope.gpAddGridLiquidacionInst.getSelectionModel().isSelected(record)) {
                return 'FilaVerde';
            } else {
                return '';
            }
        };

        scope.rowEditor = new Ext.Cont.RowEditor({
            id: 'idRoweditor',
            saveText: scope.etiquetas.lbBtnAceptar,
            cancelText: scope.etiquetas.lbBtnCancelar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
        });

        scope.rowActionOper = new Ext.grid.RowActions({
            id: 'idRowactionOper',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: scope.etiquetas.lbDelOperacion,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 16,
                    height: 16,
                    //hide: true,
                    hide: scope.verInfo//No mostrar el RowActions
                }
            ]
        });

        scope.gpAddGridOtrasOper = new Ext.grid.EditorGridPanel({
            id: 'gpAddGridOtrasOper',
            store: scope.stAddGridOtrasOper,
            sm: scope.smAddGridOtrasOper,
            forceFit: true,
            region: 'center',
            stripeRows: true,
            autoExpandColumn: 'idoperacion',
            columns: [{
                id: 'idoperacion',
                header: scope.etiquetas.lbOperacion,
                dataIndex: 'idoperacion',
                editor: scope.cbOtrasOperaciones,
                align: 'left',
                sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (!Ext.isEmpty(value)) {
                        var store = scope.cbOtrasOperaciones.store;
                        if (store) {
                            var index = store.find('idoperacion', value);
                            if (index >= 0) {
                                var newValue = store.getAt(index).data.denominacion;
                                return newValue;
                            }
                        }
                    }
                }
            }, {
                header: scope.etiquetas.lbCuenta,
                dataIndex: 'idcuenta',
                // editor: scope.cbCuentaOper,
                editor: scope.cbxCuenta,
                align: 'left',
                width: 400,
                sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    var store = scope.stCuenta;
                    if (store.getCount()) {
                        var index = store.find('idcuenta', value);
                        if (index >= 0) {
                            var newValue = store.getAt(index).data.text;
                            record.data.nomcuenta = newValue;
                            return newValue;
                        }
                        return record.data.nomcuenta;
                    } else return record.data.nomcuenta;
                    //--------------------
                }
            }, {
                header: scope.etiquetas.lbImporte,
                dataIndex: 'importe',
                editor: scope.tfAddImporteAnt,
                align: 'right',
                width: 100,
                sortable: true,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (value) {
                        scope.importeTotalOtrasOper();
                        return formatoMonedaABS(value);
                    }
                }
            }, {
                header: scope.etiquetas.lbObservacion,
                dataIndex: 'observacion',
                editor: scope.tfAddComentarioAnt,
                align: 'left',
                hidden: true,
                hideable: false,
                sortable: false
            }, {
                dataIndex: 'idtipomovimientocaja',
                hidden: true,
                hideable: false,
                sortable: false,
            }, {
                dataIndex: 'idanticipo',
                hidden: true,
                hideable: false,
                sortable: false
            }, {
                dataIndex: 'idmovimientocaja',
                hidden: true,
                hideable: false,
                sortable: false
            },
                scope.rowActionOper
            ],
            tbar: [scope.btnAddOtrasOper = new Ext.Button({
                scope: this,
                text: scope.etiquetas.lbAddOper,
                iconCls: 'adicionar',
                tooltip: scope.etiquetas.lbToolAddOper,
                handler: function () {
                    var restoInstrumento = parseFloat(scope.tfAddInstImporte.getValue()) - (parseFloat(scope.tfAddImporteTotalLiquidar.getValue()) + parseFloat(scope.tfAddImporteTotalOtrasOper.getValue()));
                    var myRecord = new Ext.data.Record({
                        idmovimiento: '',
                        importe: parseFloat(restoInstrumento).toFixed(2),
                        observacion: '',
                        idtipomovimientocaja: '',
                        idcuenta: '',
                        nomcuenta: ''
                    });

                    scope.rowEditor.stopEditing();
                    scope.stAddGridOtrasOper.insert(0, myRecord);
                    scope.gpAddGridOtrasOper.getView().refresh();
                    scope.rowEditor.startEditing(0, 0);
                    // scope.cbxCuenta.reset();
                }
            })],
            plugins: [scope.rowEditor, scope.rowActionOper],
            bbar: ['->', new Ext.Toolbar.TextItem(scope.etiquetas.lbImpTotalOtrasOper + ": "), scope.tfAddImporteTotalOtrasOper]
        });

        var numObsr = (scope.cargaInicial) ? {
            layout: 'column',
            items: [{
                columnWidth: .2,
                items: [{
                    layout: 'form',
                    labelAlign: 'top',
                    style: 'margin:0 2 0 0',
                    items: [scope.tfAddNumeroMovGen]
                }]
            }, {
                columnWidth: .8,
                items: [{
                    layout: 'form',
                    labelAlign: 'top',
                    style: 'margin:0 0 0 2',
                    items: [scope.tfAddComentarioMovGen]
                }]
            }]
        } : scope.tfAddComentarioMovGen;
        scope.fpAddMovGen = new Ext.FormPanel({
            frame: true,
            border: false,
            layout: 'column',
            region: 'center',
            items: [{
                layout: 'form',
                columnWidth: 1,
                labelWidth: 70,
                items: [{
                    layout: 'column',
                    labelWidth: 70,
                    items: [
                        {
                            style: 'margin:0 0 0 0',
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: .07,
                            items: [scope.cbAcreedorDeudor]
                        }, {
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: .18,
                            items: [scope.cbAddTrabajadorCliente]
                        }, {
                            style: 'margin:0 0 0 5',
                            labelAlign: 'top',
                            layout: 'form',
                            columnWidth: .08,
                            items: [scope.dfAddFechaEmisionMovGen]
                        }, {
                            style: 'margin:0 0 0 5',
                            labelAlign: 'top',
                            layout: 'form',
                            id: 'numObsr',
                            columnWidth: .67,
                            items: [numObsr]
                        }]
                }]
            }, {
                layout: 'form',
                columnWidth: .25,
                labelWidth: 70,
                items: [{
                    style: 'margin:0 0 0 0',
                    region: 'center',
                    layout: 'fit',
                    height: Ext.lib.Dom.getViewHeight() * 0.70,
                    items: [scope.gpAddGridInstrumentos]
                }, {
                    layout: 'column',
                    style: 'margin:0 0 0 150',
                    items: [{
                        layout: 'form',
                        style: 'margin:5 0 0 0',
                        items: [scope.btnAddLimpiarInstrumento]
                    }, {
                        layout: 'form',
                        style: 'margin:5 0 0 5',
                        items: [scope.btnAddRegistrarInstrumento]
                    }]
                }]
            }, {
                id: 'registroIntrumento',
                style: 'margin:0 0 0 10',
                title: scope.etiquetas.lbRegistroInst,
                layout: 'form',
                columnWidth: .75,
                labelWidth: 60,
                items: [{
                    layout: 'form',
                    labelWidth: 70,
                    region: 'north',
                    labelAlign: 'top',
                    items: [{
                        labelAlign: 'top',
                        layout: 'column',
                        style: 'margin:5 0 0 0',
                        items: [{
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .20,
                            labelWidth: 75,
                            hidden: scope.idFormaPago == 1 ? true : false,
                            items: [scope.cbAddInstBanco]
                        }, {
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .15,
                            labelWidth: 95,
                            hidden: scope.idFormaPago == 1 ? true : false,
                            items: [scope.tfAddInstNumero]
                        }, {
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            columnWidth: .15,
                            labelWidth: 95,
                            items: [scope.tfAddInstImporte]
                        }]
                    }]
                }, {
                    title: scope.etiquetas.lbLiquidacionCxC,
                    xtype: 'fieldset',
                    hidden: scope.cargaInicial == 1 ? true : false,
                    height: Ext.lib.Dom.getViewHeight() * 0.30,
                    anchor: '100%',
                    layout: 'border',
                    region: 'center',
                    items: [scope.gpAddGridLiquidacionInst]
                }, {
                    title: scope.etiquetas.lbOtrasOper,
                    xtype: 'fieldset',
                    height: scope.cargaInicial == 1 ? Ext.lib.Dom.getViewHeight() * 0.60 : Ext.lib.Dom.getViewHeight() * 0.35,
                    // height: Ext.lib.Dom.getViewHeight() * 0.65,
                    id: 'fsAnticipo',
                    anchor: '100%',
                    layout: 'border',
                    region: 'south',
                    items: [scope.gpAddGridOtrasOper]
                }, {
                    layout: 'form',
                    items: [scope.checkGpInstrumentos]
                }]
            }]
        });

        scope.panelContenedor = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            border: false,
            items: scope.fpAddMovGen
        });

//Para mostrar los Botones en dependecia si esta en carga inicial o el flujo normal
        if (scope.cargaInicial) {
            arrayButtons = [scope.btnAddCerrar, scope.btnNuevo, scope.btnAddGuardar];
        } else if (scope.action == 1) {
            arrayButtons = [scope.btnAddCerrar, scope.btnNuevo, scope.btnAddGuardar, scope.btnConfirmar, scope.btnPostear];
        } else {
            arrayButtons = [scope.btnAddCerrar, scope.btnAddGuardar, scope.btnConfirmar, scope.btnPostear];
        }

        Ext.apply(this, {
            modal: true,
            bodyStyle: 'padding:5px 5px 0',
            border: false,
            closable: false,
            resizable: false,
            closeAction: 'hide',
            layout: 'border',
            title: scope.titulo,
            width: '100%',
            items: [scope.panelContenedor],
            autoValidate: false,
            buttons: arrayButtons,
            //buttons: [scope.btnAddCerrar, scope.btnAddNuevo, scope.btnAddGuardar, scope.btnAddConfirmar, scope.btnAddContabilizar]
        });
        if (scope.action == 2)
            scope.btnAddAplicar.hide();
        return Ext.UIAdicionarMov.superclass.constructor.call(this);
    }
})
;
