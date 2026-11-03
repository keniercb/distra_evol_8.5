Ext.namespace('Ext.UIAdicionarDuo');

Ext.UIAdicionarDuo = Ext.extend(Ext.Window, {
    constructor: function (scope)
    {
        scope.btnAddCerrar = new Ext.Button({
            id: 'btnAddCerrar',
            text: scope.etiquetas.lbBtnCerrar, //'Cerrar',
            tooltip: scope.etiquetas.tooltipCloseAdd, //'Cerrar',
            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'btn',
            scope: this
        });

        scope.btnAddNuevo = new Ext.Button({
            id: 'btnAddNuevo',
            text: scope.etiquetas.lbBtnNuevo, //'Nuevo',
            tooltip: scope.etiquetas.tooltipNewAdd, //'Nuevo',
            icon: perfil.dirImg + 'nuevo.png',
            iconCls: 'btn',
            scope: this
        });

        scope.btnAddGuardar = new Ext.Button({
            id: 'btnAddGuardar',
            text: scope.etiquetas.lbBtnAceptar, //'Aceptar',
            tooltip: scope.etiquetas.tooltipAceptAdd.replace('<#artDuo>', scope.artTexto.toLowerCase()).replace('<#tipoDuo>', scope.textDuo.toLowerCase()), //'Aceptar',
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            scope: this
        });

        scope.btnAddConfirmar = new Ext.Button({
            id: 'btnAddConfirmar',
            disabled: true,
            text: scope.etiquetas.lbBtnConfirmar, //'Confirmar',
            tooltip: scope.etiquetas.tooltipConfAdd.replace('<#artDuo>', scope.artTexto.toLowerCase()).replace('<#tipoDuo>', scope.textDuo.toLowerCase()), //'Confirmar',
            icon: perfil.dirImg + 'confirmar.png',
            iconCls: 'btn',
            scope: this
        });

        scope.btnAddContabilizar = new Ext.Button({
            id: 'btnAddContabilizar',
            disabled: true,
            text: scope.etiquetas.lbBtnContabilizar, //'Contabilizar',
            tooltip: scope.etiquetas.tooltipContAdd.replace('<#artDuo>', scope.artTexto.toLowerCase()).replace('<#tipoDuo>', scope.textDuo.toLowerCase()), //'Contabilizar',
            icon: perfil.dirImg + 'contabilidad.png',
            iconCls: 'btn',
            scope: this
        });

        scope.btnAddOpAdicionar = new Ext.Button({
            id: 'btnAddOpAdicionar',
            disabled: false,
            tooltip: scope.etiquetas.lbBtnAdicionar, //'Adicionar',
            icon: perfil.dirImg + 'adicionar.png ',
            iconCls: 'btn',
            scope: this
        });

        scope.btnAddOpModificar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpModificar',
            tooltip: scope.etiquetas.lbBtnModificar, //'Modificar',
            icon: perfil.dirImg + 'modificar.png ',
            iconCls: 'btn',
            scope: this
        });

        scope.btnAddOpEliminar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpEliminar',
            tooltip: scope.etiquetas.lbBtnEliminar, //'Eliminar',
            icon: perfil.dirImg + 'eliminar.png ',
            iconCls: 'btn',
            scope: this
        });

        scope.btnAddOpCancelar = new Ext.Button({
            disabled: true,
            id: 'btnAddOpCancelar',
            tooltip: scope.etiquetas.lbBtnCancelar, //'Cancelar operaci&oacute;n',
            icon: perfil.dirImg + 'cancelar.png ',
            iconCls: 'btn',
            scope: this
        });

        scope.tfAddNumeroDocumento = new Ext.form.TextField({
            id: 'tfAddNumeroDocumento',
            fieldLabel: scope.etiquetas.lbNumDocumento, //'N&uacute;mero documento',
            name: 'numerodocumento',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            anchor: '100%',
            maxLength: 100,
            editable: false,
            maskRe: /^([a-zA-Z0-9-_/ \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddNumeroContrato = new Ext.form.TextField({
            id: 'tfAddNumeroContrato',
            fieldLabel: scope.etiquetas.lbNumContrato, //'N&uacute;mero contrato',
            name: 'numerocontrato',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            anchor: '100%',
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddImporte = new Ext.form.NumberField({
            id: 'tfAddImporte',
            fieldLabel: scope.etiquetas.lbImporte, //'Importe',
            name: 'importe',
            anchor: '100%',
            allowNegative: false,
            emptyText: '0.00',
            allowBlank: true,
            style: 'text-align: right',
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            maxLength: 15,
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            editable: false,
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
            id: 'dfAddFechaEmision',
            fieldLabel: scope.etiquetas.lbFechaEmision, //'Fecha de emisi&oacute;n',
            name: 'fechaemision',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            readOnly: false,
            editable: true,
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            anchor: '100%',
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.dfAddFechaEntrega = new Ext.form.DateField({
            id: 'dfAddFechaEntrega',
            fieldLabel: scope.nombreFecha,
            name: 'fechaentrega',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
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
            fieldLabel: scope.etiquetas.lbFechaRecepcion, //'Fecha de recepci&oacute;n',
            name: 'fecharecepcion',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            readOnly: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            allowBlank: (scope.tipoDuo == 1) ? true : false,
            anchor: '100%',
            format: 'd/m/Y',
            editable: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.ckbAddExcepcional = new Ext.form.Checkbox({
            id: 'ckbAddExcepcional',
            boxLabel: scope.etiquetas.lbExcepcional, //'Excepcional',
            hideLabel: true,
            name: 'excepcional',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.ckbAddServicio = new Ext.form.Checkbox({
            id: 'ckbAddServicio',
            boxLabel: scope.etiquetas.lbServicio, //'Servicio',
            hideLabel: true,
            name: 'servicio'
        });

        scope.tfAddComentario = new Ext.form.TextField({
            id: 'tfAddComentario',
            fieldLabel: scope.etiquetas.lbDetalle, //'Detalle',//'Comentario',
            name: 'comentario',
            maxLength: 255,
            maxLengthText: scope.etiquetas.lbMaxLengthText, //"Este campo admite como m&aacute;ximo 255 caracteres.",
            anchor: '100%',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText, //'Este campo es obligatorio.',
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.tfAddImporteTotal = new Ext.form.TextField({
            id: 'tfAddImporteTotal',
            disabled: true,
            fieldLabel: scope.etiquetas.lbImpTotalCont, //'Importe total contable',
            name: 'importecontable',
            anchor: '100%',
            editable: false,
            disabledClass: 'disabled-component',
            selectOnFocus: true
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
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            //typeAhead : true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.cbAddNumeroContrato = new Ext.form.ComboBox({
            id: 'cbAddNumeroContrato',
            fieldLabel: scope.etiquetas.lbNumContrato,
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
            resizable: true,
            //typeAhead : true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numerocontrato}" class="x-combo-list-item">{numerocontrato}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.cbAddCuenta = new Ext.form.ComboBox({
            id: 'cbAddCuenta',
            editable: true,
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            //typeAhead : true,
            name: 'idcuenta',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            fieldLabel: scope.etiquetas.lbCuenta, //'Cuenta',
            triggerAction: 'all',
            anchor: '100%',
            displayField: 'nombre',
            valueField: 'idcuenta',
            hiddenName: 'idcuenta',
            store: scope.stAddCuenta,
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.cbAddParrafoFiscal = new Ext.CONT.UIXCombo({
            fieldLabel: scope.etiquetas.lbParrafoFiscal, //'Parrafo fiscal'
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            hiddenTbar: true
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
                    name: '_is_leaf',
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
            fieldLabel: scope.etiquetas.lbEspecialidad,
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            disabled: true,
            hiddenTbar: true
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
            enableKeyEvents: true
        });

        scope.cbAddCondicionPago = new Ext.form.ComboBox({
            id: 'cbAddCondicionPago',
            editable: true,
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            name: 'idcondicionpago',
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
            enableKeyEvents: true
        });

        scope.cbAddOperacion = new Ext.form.ComboBox({
            id: 'cbAddOperacion',
            fieldLabel: scope.etiquetas.lbOperacion, //'Operaci&oacute;n',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
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
            editable: true,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.cbAddMoneda = new Ext.form.ComboBox({
            id: 'cbAddMoneda',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            forceSelection: true,
            editable: true,
            fieldLabel: scope.etiquetas.lbMoneda, //'Moneda',
            store: scope.stAddMoneda,
            valueField: 'idnommonedaentidad',
            displayField: 'codigoiso',
            hiddenName: 'idnommonedaentidad',
            mode: 'local',
            allowBlank: true,
            triggerAction: 'all',
            anchor: '100%',
            resizable: true,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.cbAddTasa = new Ext.form.ComboBox({
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            forceSelection: true,
            editable: false,
            disabled: true,
            fieldLabel: scope.etiquetas.lbTasa, //'Tasa',
            id: 'cbAddTasa',
            store: scope.stAddTasa,
            valueField: 'idtasa',
            displayField: 'mostrar',
            hiddenName: 'idtasa',
            anchor: '100%',
            mode: 'local',
            resizable: true,
            allowBlank: true,
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
            height: 100,
            stripeRows: true,
            autoExpandColumn: 'operacion',
            columns: [{
                    id: 'operacion',
                    header: scope.etiquetas.lbOperacion, //'Operaci&oacute;n',
                    dataIndex: 'operacion',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    id: 'moneda',
                    header: scope.etiquetas.lbMoneda, //'Moneda',
                    dataIndex: 'moneda',
                    width: 130,
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    id: 'compra',
                    header: scope.etiquetas.lbTasa, //'Tasa',
                    dataIndex: 'compra',
                    width: 130,
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    id: 'importaux',
                    header: scope.etiquetas.lbImporte, //'Importe',
                    renderer: formatoMonedaABS,
                    dataIndex: 'importaux',
                    align: 'right',
                    width: 130,
                    sortable: true
                }, {
                    id: 'importe',
                    header: scope.etiquetas.lbImporteContable, //'Importe',
                    renderer: formatoMonedaABS,
                    dataIndex: 'importe',
                    align: 'right',
                    width: 130,
                    sortable: true
                }, {
                    id: 'iva',
                    header: scope.etiquetas.lbIVA, //'Importe',
                    renderer: formatoMonedaABS,
                    dataIndex: 'iva',
                    align: 'right',
                    width: 130,
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
                    dataIndex: 'anexo',
                    id: 'anexo',
                    sortable: true
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idanexo',
                    id: 'idanexo',
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

        scope.fpAddDuo = new Ext.FormPanel({
            layout: 'border',
            region: 'center',
            frame: true,
            items: [{
                    border: false,
                    region: 'north',
                    height: 235,
                    items: [{
                            labelAlign: 'top',
                            layout: 'column',
                            items: [{
                                    style: 'margin:0 0 0 10',
                                    columnWidth: (scope.confEspecialidad) ? .5 : .75,
                                    layout: 'form',
                                    items: [(scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.cbAddClienteProveedor : scope.cbAddParrafoFiscal]
                                }, {
                                    style: 'margin:0 10 0 10',
                                    columnWidth: (scope.confEspecialidad) ? .5 : .25,
                                    layout: 'form',
                                    items: [(scope.confEspecialidad) ? scope.cbAddEspecialidad : scope.lfAddEspVacio]//scope.cbAddCuenta
                                }]
                        }, {
                            labelAlign: 'top',
                            layout: 'column',
                            items: [{
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .5,
                                    items: [scope.cbAddCuenta]//scope.cbAddEspecialidad
                                }, {
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .25,
                                    items: [scope.cbAddTipoDoc]
                                }, {
                                    style: 'margin:0 10 0 10',
                                    layout: 'form',
                                    columnWidth: .25,
                                    items: [scope.cbAddCondicionPago]
                                }]
                        }, {
                            labelAlign: 'top',
                            layout: 'column',
                            items: [{
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .25,
                                    items: [scope.tfAddNumeroDocumento]
                                }, {
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .5,
                                    items: [scope.cbAddNumeroContrato]
                                }, {
                                    style: 'margin:12 0 0 10',
                                    layout: 'form',
                                    columnWidth: .25,
                                    items: [scope.ckbAddExcepcional]
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
                                    style: 'margin:0 0 0 10',
                                    layout: 'form',
                                    columnWidth: .25,
                                    items: (scope.confFechaRecepcion) ? [scope.dfAddFechaRecepcion] : {}
                                }, {
                                    style: 'margin:12 0 0 10',
                                    layout: 'form',
                                    columnWidth: .25,
                                    items: (scope.confFechaRecepcion) ? [(scope.tipoDuo == 1 || scope.tipoDuo == 3) ? scope.lfAddServVacio : scope.ckbAddServicio] : {}
                                }]
                        }, {
                            layout: 'form',
                            labelWidth: 70,
                            labelAlign: 'left',
                            style: 'margin: 5 10 0 10',
                            items: [scope.tfAddComentario]
                        }]
                }, {
                    title: scope.etiquetas.lbOperaciones,
                    xtype: 'fieldset',
                    height: 100,
                    anchor: '100%',
                    layout: 'border',
                    region: 'center',
                    items: [{
                            height: 65,
                            region: 'north',
                            items: [{
                                    layout: 'form',
                                    labelAlign: 'left',
                                    labelWidth: 60,
                                    items: [scope.cbAddOperacion]
                                }, {
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
                                            columnWidth: .4,
                                            labelWidth: 80,
                                            style: 'margin:0 0 0 10',
                                            items: [scope.tfAddImporte]
                                        }, {
                                            style: 'margin:0 0 0 5',
                                            items: [scope.btnAddOpAdicionar]
                                        }, {
                                            style: 'margin:0 0 0 5',
                                            items: [scope.btnAddOpModificar]
                                        }, {
                                            style: 'margin: 0 0 0 5',
                                            items: [scope.btnAddOpEliminar]
                                        }, {
                                            style: 'margin: 0 0 0 5',
                                            items: [scope.btnAddOpCancelar]
                                        }]
                                }]
                        },
                        scope.gpAddGridOperaciones]
                }]
        });

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
            items: [scope.fpAddDuo],
            buttons: [scope.btnAddCerrar, scope.btnAddNuevo, scope.btnAddGuardar, scope.btnAddConfirmar, scope.btnAddContabilizar]
        });

        if (scope.action == 2)
            scope.btnAddNuevo.hide();

        return Ext.UIAdicionarDuo.superclass.constructor.call(this);
    }
});