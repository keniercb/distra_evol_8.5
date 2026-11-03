Ext.namespace('Ext.UIAdicionarDuo');

Ext.UIAdicionarDuo = Ext.extend(Ext.Window, {
    constructor: function (scope) {
        scope.btnAddCerrar = new Ext.Button({
            id: 'btnAddCerrar',
            text: scope.etiquetas.lbBtnCancelar,
            tooltip: scope.etiquetas.tooltipCloseAdd,
            iconCls: 'cerrar',
            tabIndex: 10,
            scope: this
        });

        /*scope.btnAddNuevo.setText('Aplicar');
         scope.btnAddNuevo.setIconClass('aplicar');*/

        scope.btnAddNuevo = new Ext.Button({
            id: 'btnAddNuevo',
            text: scope.etiquetas.lbBtnNuevo,
            tooltip: scope.etiquetas.tooltipNewAdd,
            iconCls: 'nuevo',
            tabIndex: 11,
            scope: this
        });

        scope.btnAddCuentaGasto = new Ext.Button({
            id: 'btnAddCuentaGasto',
            tooltip: 'Desglose de cuentas',
            iconCls: 'nuevo',
            hidden: true,
            // hidden: (scope.aperturado == 0) ? true : false,
            tabIndex: 11,
            scope: this
        });

        scope.btnAddGuardar = new Ext.Button({
            id: 'btnAddGuardar',
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: scope.etiquetas.tooltipAceptAdd.replace('<#artDuo>', scope.artTexto.toLowerCase()).replace('<#tipoDuo>', scope.textDuo.toLowerCase()),
            iconCls: 'aceptar',
            disabled: true,
            tabIndex: 12,
            scope: this
        });

        scope.btnAddAplicar = new Ext.Button({
            id: 'btnAddAplicar',
            text: 'Aplicar',
            tooltip: 'Guardar los datos',
            iconCls: 'aplicar',

            disabled: true,
            tabIndex: 12,
            scope: this
        });

        scope.btnAddConfirmar = new Ext.Button({
            id: 'btnAddConfirmar',
            disabled: true,
            hidden: (scope.aperturado == 0) ? true : false,
            text: scope.etiquetas.lbConfirmar,
            tooltip: scope.etiquetas.tooltipConfAdd.replace('<#artDuo>', scope.artTexto.toLowerCase()).replace('<#tipoDuo>', scope.textDuo.toLowerCase()),
            iconCls: 'confirmar',
            tabIndex: 13,
            scope: this
        });

        scope.btnAddContabilizar = new Ext.Button({
            id: 'btnAddContabilizar',
            disabled: true,
            hidden: (scope.aperturado == 0) ? true : false,
            text: scope.etiquetas.lbContabilizar,
            tooltip: scope.etiquetas.tooltipContAdd.replace('<#artDuo>', scope.artTexto.toLowerCase()).replace('<#tipoDuo>', scope.textDuo.toLowerCase()),
            iconCls: 'contabilidad',
            tabIndex: 14,
            scope: this
        });

        scope.btnAddOpAdicionar = new Ext.Button({
            id: 'btnAddOpAdicionar',
            disabled: false,
            tooltip: scope.etiquetas.lbBtnAdicionar,
            iconCls: 'adicionar',
            scope: this
        });

        scope.btnAddOpModificar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpModificar',
            tooltip: scope.etiquetas.lbBtnModificar,
            iconCls: 'modificar',
            scope: this
        });

        scope.btnAddOpEliminar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpEliminar',
            tooltip: scope.etiquetas.lbBtnEliminar,
            iconCls: 'eliminar',
            scope: this
        });

        scope.btnAddOpCancelar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpCancelar',
            tooltip: scope.etiquetas.lbBtnCancelar,
            iconCls: 'cancelar',
            scope: this
        });

        scope.tfAddNumeroDocumento = new Ext.form.TextField({
            id: 'tfAddNumeroDocumento',
            fieldLabel: scope.etiquetas.lbNumDocumento,
            name: 'numero',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            maxLength: 16,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',
            tabIndex: 2,
            enableKeyEvents: true
        });

        scope.cbAddNumeroContrato = new Ext.form.ComboBox({
            id: 'cbAddNumeroContrato',
            editable: false,
            forceSelection: true,
            allowBlank: true,
            resizable: true,
            //name: 'idcondicionpago',
            emptyText: scope.etiquetas.lbSeleccione,
            fieldLabel: scope.etiquetas.lbNumContrato,
            triggerAction: 'all',
            anchor: '100%',
            displayField: 'numerocontrato',
            valueField: 'idcontrato',
            //hiddenName: 'idcondicionpago',
            //store: scope.stAddCondicionPago,
            store: scope.stAddNumeroContrato,
            mode: 'local',
            //maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numerocontrato}" class="x-combo-list-item">{numerocontrato}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 6,
            enableKeyEvents: true
        });

        scope.tfAddNumeroContrato = new Ext.form.TextField({
            id: 'tfAddNumeroContrato',
            fieldLabel: scope.etiquetas.lbNumContrato,
            name: 'numerocontrato',
            blankText: scope.etiquetas.lbBlankText,
			maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda _\-\+\.\/\(\)]*$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+([+--_ */.()]?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\(\)]+)*)+$/,
            regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales (-,+,_,/,.,(,)) entre caracteres alfanuméricos.',
            anchor: '100%',
            maxLength: 100,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 100 caracteres.',
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 6,
            enableKeyEvents: true
        });

        scope.tfAddImporte = new Ext.form.TextField({
            id: 'tfAddImporte',
            fieldLabel: scope.etiquetas.lbImporte,
            name: 'importe',
            anchor: '100%',
            allowBlank: false,
            allowNegative: false,
            disabled: (scope.aperturado) ? true : false,
            // disabled: true,
            emptyText: '0.00',
            style: 'text-align: right',
            blankText: scope.etiquetas.lbBlankText,
            maxLength: 16,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 9,
            enableKeyEvents: true
        });

        scope.tfAddLiquidado = new Ext.form.TextField({
            id: 'tfAddLiquidado',
            fieldLabel: scope.etiquetas.lbLiquidado,
            name: 'liquidado',
            anchor: '100%',
            allowBlank: true,
            allowNegative: false,
            emptyText: '0.00',
            style: 'text-align: right',
            blankText: scope.etiquetas.lbBlankText,
            maxLength: 16,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 16 caracteres.',
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 9,
            enableKeyEvents: true
        });

        scope.lfAddServVacio = new Ext.form.Label({
            id: 'lfAddServVacio',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        scope.lfAddCheckVacio = new Ext.form.Label({
            id: 'lfAddCheckVacio',
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

        scope.lfAddTextFechaEntrega = new Ext.form.Label({
            id: 'lfAddTextFechaEntrega',
            text: 'Fecha entrega:',
            anchor: '100%',
        });

        scope.lfAddTextFechaEmision = new Ext.form.Label({
            id: 'lfAddTextFechaEmision',
            text: 'Fecha emisión:',
            anchor: '100%',
        });

        scope.lfAddVacioTrabajador = new Ext.form.Label({
            id: 'lfAddVacioTrabajador',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        scope.dfAddFechaEmision = new Ext.form.DateField({
            id: 'dfAddFechaEmision',
            fieldLabel: scope.etiquetas.lbFechaEmision,
            name: 'fechaemision',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            readOnly: false,
            editable: true,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 3,
            enableKeyEvents: true
        });

        scope.dfAddFechaEntrega = new Ext.form.DateField({
            id: 'dfAddFechaEntrega',
            fieldLabel: (scope.tipoDuo == 1) ? scope.nombreFecha : 'Fecha recibo',
            name: 'fechaentrega',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            blankText: scope.etiquetas.lbBlankText,
            readOnly: false,
            editable: true,
            allowBlank: false,
            anchor: '100%',
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.dfAddFechaRecepcion = new Ext.form.DateField({
            id: 'dfAddFechaRecepcion',
            fieldLabel: scope.etiquetas.lbFechaRecepcion,
            name: 'fecharecepcion',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            readOnly: false,
            blankText: scope.etiquetas.lbBlankText,
            allowBlank: (scope.tipoDuo == 1) ? true : false,
            anchor: '100%',
            format: 'd/m/Y',
            editable: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.ckbAddClienteProv = new Ext.form.Checkbox({
            id: 'ckbAddClienteProv',
            disabledClass: 'disabled-component',
            boxLabel: (scope.tipoDuo == 1 || scope.tipoDuo == 3) ? 'Cliente:' : 'Proveedor:',
            hideLabel: true,
            checked: true,
            name: 'clienteprov',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.ckbAddTrabajador = new Ext.form.Checkbox({
            id: 'ckbAddTrabajador',
            disabledClass: 'disabled-component',
            boxLabel: 'Trabajador',
            hideLabel: true,
            name: 'trabajador',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.ckbAddFisco = new Ext.form.Checkbox({
            id: 'ckbAddFisco',
            disabledClass: 'disabled-component',
            boxLabel: 'Presupuesto',
            hideLabel: true,
            name: 'fisco',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.ckbAddExcepcional = new Ext.form.Checkbox({
            id: 'ckbAddExcepcional',
            boxLabel: scope.etiquetas.lbExcepcional,
            hideLabel: true,
            name: 'excepcional',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.ckbAddServicio = new Ext.form.Checkbox({
            id: 'ckbAddServicio',
            boxLabel: scope.etiquetas.lbServicio,
            hideLabel: true,
            name: 'servicio'
        });

        scope.tfAddComentario = new Ext.form.TextArea({
            id: 'tfAddComentario',
            fieldLabel: scope.etiquetas.lbDetalle,
            name: 'comentario',
            height: 35,
            maxLength: 255,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255 caracteres.',
            maskRe: /^([a-zA-Z0-9-()./_, \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            anchor: '100%',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 7,
            enableKeyEvents: true
        });

        scope.tfAddImporteTotal = new Ext.form.TextField({
            id: 'tfAddImporteTotal',
            disabled: true,
            fieldLabel: scope.etiquetas.lbImpTotalCont,
            name: 'importecontable',
            anchor: '50%',
            allowBlank: false,
            editable: false,
            disabledClass: 'disabled-component',
            tabIndex: 9,
            selectOnFocus: true
        });

        scope.cbAddClienteProveedor = new Ext.form.ComboBox({
            id: 'cbAddClienteProveedor',
            store: scope.stAddClienteProveedor,
            name: 'idcliente',
            valueField: 'idcliente',
            hiddenName: 'idcliente',
            hideLabel: true,
            displayField: 'nombre',
            emptyText: scope.etiquetas.lbSeleccione,
            disabledClass: 'disabled-component',
            editable: true,
            pageSize: 10,
            minChars: 3,
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'remote',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\-\.]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            readOnly: false,
            tabIndex: 4,
            enableKeyEvents: true
        });

        scope.cbAddCuenta = new Ext.contabilidad.util.linkedCombo({
            id: 'combocuentascontables',
            disabledClass: 'disabled-component',
            store: scope.stAddCuenta,
            fieldLabel: scope.etiquetas.lbCuenta,
            displayField: 'nombrecuenta',
            valueField: 'idcuenta',
            listHeight: 200,
            lazyRender: true,
            fnCreateNew: Ext.emptyFn
        });

        scope.cbAddParrafoFiscal = new Ext.contabilidad.util.linkedCombo({
            id: 'cbAddParrafoFiscal',
            store: scope.stAddParrafoFiscal,
            fieldLabel: scope.etiquetas.lbParrafoFiscal,
            displayField: 'text',
            valueField: 'idparrafofiscal',
            listHeight: 200,
            lazyRender: true,
            fnCreateNew: Ext.emptyFn
        });

        scope.cbAddEspecialidad = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
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
            fieldLabel: scope.etiquetas.lbTipoDoc,
            mode: 'local',
            id: 'cbAddTipoDoc',
            name: 'iddoc',
            hiddenName: 'iddoc',
            emptyText: scope.etiquetas.lbSeleccione,
            store: scope.stAddTipoDoc,
            valueField: 'iddoc',
            displayField: 'denominacion',
            forceSelection: true,
            triggerAction: 'all',
            resizable: true,
            anchor: '100%',
            allowBlank: false,
            editable: true,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 1,
            enableKeyEvents: true
        });

        scope.cbAddCondicionPago = new Ext.form.ComboBox({
            id: 'cbAddCondicionPago',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            name: 'idcondicionpago',
            emptyText: scope.etiquetas.lbSeleccione,
            fieldLabel: scope.etiquetas.lbCondPago,
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

        scope.cbAddOperacion = new Ext.form.ComboBox({
            id: 'cbAddOperacion',
            fieldLabel: scope.etiquetas.lbOperacion,
            emptyText: scope.etiquetas.lbSeleccione,
            mode: 'local',
            hiddenName: 'idnomoperaciones',
            store: scope.stAddOperacion,
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            forceSelection: true,
            triggerAction: 'all',
            anchor: '100%',
            resizable: true,
            allowBlank: false,
            editable: false,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: false,
            tabIndex: 7,
            enableKeyEvents: true
        });

        scope.cbAddMoneda = new Ext.form.ComboBox({
            id: 'cbAddMoneda',
            emptyText: scope.etiquetas.lbSeleccione,
            forceSelection: true,
            editable: true,
            fieldLabel: scope.etiquetas.lbMoneda,
            store: scope.stAddMoneda,
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            hiddenName: 'idmoneda',
            mode: 'local',
            allowBlank: true,
            disabled: true,
            triggerAction: 'all',
            anchor: '100%',
            resizable: true,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 8,
            enableKeyEvents: true
        });

        scope.cbAddTasa = new Ext.form.ComboBox({
            emptyText: scope.etiquetas.lbSeleccione,
            forceSelection: true,
            disabled: true,
            editable: false,
            fieldLabel: scope.etiquetas.lbTasa,
            id: 'cbAddTasa',
            store: scope.stAddTasa,
            valueField: 'idtasa',
            displayField: 'mostrar',
            hiddenName: 'idtasa',
            anchor: '100%',
            mode: 'local',
            resizable: true,
            // allowBlank: false,
            triggerAction: 'all',
            tpl: '<tpl for="."><div ext:qtip="{mostrar}" class="x-combo-list-item">{mostrar}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
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

        scope.gpAddGridOperaciones = new Ext.grid.GridPanel({
            id: 'gpAddGridOperaciones',
            store: scope.stAddGridOperaciones,
            sm: scope.smAddGridOperaciones,
            region: 'center',
            height: 30,
            stripeRows: true,
            autoExpandColumn: 'operacion',
            columns: [{
                id: 'operacion',
                header: scope.etiquetas.lbOperacion,
                dataIndex: 'operacion',
                sortable: true,
                renderer: function (v, m, r) {
                    return scope.createToolTip(v, m, r);
                }
            }, {
                id: 'moneda',
                header: scope.etiquetas.lbMoneda,
                dataIndex: 'moneda',
                width: 90,
                sortable: true,
                renderer: function (v, m, r) {
                    return scope.createToolTip(v, m, r);
                }
            }, {
                id: 'compra',
                header: scope.etiquetas.lbTasa,
                dataIndex: 'compra',
                width: 90,
                sortable: true,
                renderer: function (v, m, r) {
                    return scope.createToolTip(v, m, r);
                }
            }, {
                id: 'importe',
                header: scope.etiquetas.lbImporte,
                renderer: formatoMonedaABS,
                dataIndex: 'importe',
                align: 'right',
                width: 110,
                sortable: true
            }, {
                id: 'importecontable',
                header: scope.etiquetas.lbImporteContable,
                renderer: formatoMonedaABS,
                dataIndex: 'importecontable',
                align: 'right',
                width: 120,
                sortable: true
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idoperacion',
                id: 'idoperacion',
                sortable: true
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idoperacioncontable',
                id: 'idoperacioncontable',
                sortable: true
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idtasa',
                id: 'idtasa',
                sortable: true
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'idmoneda',
                id: 'idmoned',
                sortable: true
            }, {
                hidden: true,
                hideable: false,
                dataIndex: 'factordeconversion',
                id: 'factordeconversion',
                sortable: true
            }, {
                hidden: true,
                hideable: false,
                renderer: formatoMonedaABS,
                dataIndex: 'importaux',
                id: 'importaux',
                sortable: true
            }
            ],
            bbar: ['->', new Ext.Toolbar.TextItem(scope.etiquetas.lbImpTotalCont), scope.tfAddImporteTotal]
        });

        scope.formCobrosPagos = [
        {
            style: 'margin:0 10 0 10',
            layout: 'form',
            columnWidth: .25,
            items: [scope.cbAddCondicionPago]
        }];
        scope.formCobrosPagosFiscales = [{
            style: 'margin:0 0 0 10',
            layout: 'form',
            columnWidth: .5,
            items: [scope.cbAddTipoDoc]
        }, {
            style: 'margin:0 10 0 10',
            layout: 'form',
            columnWidth: .5,
            items: [scope.cbAddCondicionPago]
        }];

        scope.fpAddDuo = new Ext.FormPanel({
            layout: 'border',
            region: 'center',
            frame: true,
            items: [{
                border: false,
                region: 'north',
                height: 205,
                items: [{
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                        style: 'margin:0 0 0 10',
                        columnWidth: (scope.confEspecialidad) ? .25 : .5,
                        layout: 'form',
                        items: [scope.cbAddTipoDoc]
                    }, {
                        style: 'margin:0 0 0 10',
                        columnWidth: (scope.confEspecialidad) ? .25 : .5,
                        layout: 'form',
                        items: [scope.tfAddNumeroDocumento]
                    }, {
                        style: 'margin:0 10 0 10',
                        columnWidth: (scope.confEspecialidad) ? .5 : .25,
                        layout: 'form',
                        items: [(scope.confEspecialidad) ? scope.cbAddEspecialidad : scope.lfAddEspVacio]
                    }]
                }, {
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [scope.dfAddFechaEmision]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [scope.dfAddFechaEntrega]
                    }, {
                        style: 'margin:0 10 0 0',
                        layout: 'form',
                        columnWidth: .5,
                        items: [{
                            style: 'margin:-7 0 0 10',
                            layout: 'column',
                            items: [{
                                layout: 'form',
                                columnWidth: .3,
                                items: [scope.ckbAddClienteProv]
                            }, {
                                style: 'margin:0 0 0 10',
                                layout: 'form',
                                columnWidth: .3,
                                items: [scope.ckbAddTrabajador]
                            }, {
                                style: 'margin:0 0 0 10',
                                layout: 'form',
                                columnWidth: .4,
                                items: [scope.ckbAddFisco]
                            }]
                        }, {
                            style: 'margin:-11 0 0 10',
                            layout: 'form',
                            items: [(scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.cbAddClienteProveedor : scope.cbAddParrafoFiscal]
                        }]
                    }]
                    }, {
                        labelAlign: 'top',
                        layout: 'column',
                        items: [{
                            id: 'fpCuentaAcreedorDeudor',
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .5,
                            items: [scope.cbAddCuenta]
                        },{
                            style: 'margin:0 0 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [scope.cbAddCondicionPago]
                        }, {
                            style: 'margin:0 10 0 10',
                            layout: 'form',
                            columnWidth: .25,
                            items: [/*scope.tfAddNumeroContrato*/scope.cbAddNumeroContrato]
                        }]
                    }, {
                        layout: 'form',
                        labelWidth: 45,
                        labelAlign: 'top',
                        style: 'margin: 0 10 0 10',
                        items: [scope.tfAddComentario]
                    }]
            }, {
                // title: scope.etiquetas.lbOperacion,
                // xtype: 'fieldset',
                // height: '30%',
                anchor: '100%',
                // layout: 'fit',
                region: 'center',
                items: [{
                    // height: 65,
                    region: 'north',
                    items: [{
                        layout: 'column',
                        labelAlign: 'left',
                        labelWidth: 60,
                        width: '100%',
                        items: [{
                            layout: 'form',
                            labelAlign: 'top',
                            labelWidth: 60,
                            style: 'margin: 0 10 0 10',
                            columnWidth: 1,
                            width: '100%',
                            items: [scope.cbAddOperacion]
                        }, {
                            layout: 'form',
                            items: [scope.btnAddCuentaGasto]
                        }]
                    },(scope.aperturado) ? {
                        // height: '30%',
                        // anchor: '100%',
                        // layout: 'fit',
                        style: 'margin: 5 0 0 0',
                        region: 'center',
                        items:[{
                            height: 150,
                            layout: 'fit',
                            region: 'center',
                            items: [scope.objAnexoGasto = new Ext.AnexoGasto()]
                        }]

                    } : {}, (/*scope.aperturado*/true) ? {
                        style: 'margin:5 0 -2 0',
                        labelAlign: 'left',
                        layout: 'column',
                        items: [{
                            layout: 'form',
                            columnWidth: .5,
                            labelWidth: 60,
                            items: [scope.cbAddMoneda]
                        }, /*{
                            layout: 'form',
                            columnWidth: .3,
                            labelWidth: 30,
                            style: 'margin:0 0 0 10',
                            items: [scope.cbAddTasa]
                        },*/ {
                            layout: 'form',
                            columnWidth: .5,
                            labelWidth: 55,
                            style: 'margin:0 0 0 10',
                            items: [scope.tfAddImporte]
                        }]
                    } : {
                            style: 'margin:5 0 -2 0',
                            labelAlign: 'left',
                            layout: 'column',
                            items: [{
                                layout: 'form',
                                columnWidth: .3,
                                labelWidth: 60,
                                items: [scope.cbAddMoneda]
                            }, {
                                layout: 'form',
                                columnWidth: .3,
                                labelWidth: 30,
                                style: 'margin:0 0 0 10',
                                items: [scope.cbAddTasa]
                            }, {
                                layout: 'form',
                                columnWidth: .2,
                                labelWidth: 55,
                                style: 'margin:0 0 0 10',
                                items: [scope.tfAddImporte]
                            }, {
                                layout: 'form',
                                columnWidth: .2,
                                labelWidth: 55,
                                style: 'margin:0 0 0 10',
                                items: [scope.tfAddLiquidado]
                            }]
                        }]
                }

                ]
            }
            ]
        });

        var botones = [];
        if (scope.action == 3) {
            botones = [scope.btnAddCerrar];
        } else {
            botones = (scope.aperturado) ? [scope.btnAddCerrar, scope.btnAddNuevo, scope.btnAddGuardar, scope.btnAddConfirmar, scope.btnAddContabilizar]
                : [scope.btnAddCerrar, scope.btnAddAplicar, scope.btnAddGuardar];
        }

        Ext.apply(this, {
            modal: true,
            bodyStyle: 'padding:5px 5px 0',
            border: false,
            closable: true,
            resizable: false,
            closeAction: 'close',
            layout: 'border',
            title: scope.titulo,
            defaultButton: scope.action == 3 ? 'btnAddCerrar' : 'btnAddGuardar',
            width: 700,
            autoValidate: false,
            height: (scope.aperturado) ? 520 : 380,
            // autoHeight: true,
            constrain: true,
            items: [scope.fpAddDuo],
            buttons: botones
        });

        if (scope.action == 2) {
            if (!scope.aperturado) {
                scope.btnAddAplicar.hide();
            } else {
                scope.btnAddNuevo.hide();
            }
        }

        return Ext.UIAdicionarDuo.superclass.constructor.call(this);
    }
});