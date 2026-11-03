Ext.ns('Caja.DietaExt');
Caja.DietaExt.View = {
    init: function (perfil, etiquetas, model, cargaInicial) {

        this.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });

        this.btnAdicionar = new Ext.Button({
            text: etiquetas.lbAdicionar,
            tooltip: etiquetas.lbAddAnticipo,
            iconCls: 'adicionar'
        });

        this.btnModificar = new Ext.Button({
            text: etiquetas.lbModificar,
            disabled: true,
            tooltip: etiquetas.lbModifAnticipo,
            iconCls: 'modificar'
        });

        this.btnEliminar = new Ext.Button({
            text: etiquetas.lbEliminar,
            disabled: true,
            tooltip: etiquetas.lbTooltipEliminarAnt,
            iconCls: 'eliminar'
        });

        this.btnCancelar = new Ext.Button({
            text: etiquetas.lbBtnCancelar,
            tooltip: etiquetas.lbCancAnticipo,
            disabled: true,
            iconCls: 'cancelar'
        });

        this.btnAprobar = new Ext.Button({
            disabled: true,
            text: etiquetas.lbAprobar,
            tooltip: etiquetas.lbMAprobAnticipo,
            iconCls: 'aprobar'
        });

        this.btnConfirmar = new Ext.Button({
            text: etiquetas.lbConfirmar,
            tooltip: etiquetas.lbConfirmarAnticipo,
            disabled: true,
            iconCls: 'confirmar'
        });

        this.btnContabilizar = new Ext.Button({
            text: etiquetas.lbContabilizar,
            tooltip: etiquetas.lbContAnticipo,
            disabled: true,
            iconCls: 'contabilidad'
        });

        this.btnLiquidar = new Ext.Button({
            text: etiquetas.lbLiquidar,
            tooltip: etiquetas.lbLiquidarAnticipo,
            disabled: true,
            iconCls: 'liquidar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaDietaExt',
            text: etiquetas.lbAyuda,
            tooltip: etiquetas.lbTooAyuda,
            iconCls: 'ayuda'
        });

        this.btnAyudaCI = new Ext.Button({
            id: 'btnAyudaDietaExtCI',
            iconCls: 'ayuda',
            text: etiquetas.lbAyuda,
            tooltip: etiquetas.lbTooAyuda,
        });

        this.tfFondo = new Ext.form.TextField({
            name: 'tfFondo',
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 170,
            enableKeyEvents: true
        });
        this.btnFondo = new Ext.Button({
            text: etiquetas.lbBtnFondo,
            tooltip: etiquetas.lbToolFondo,
            iconCls: 'fondo'
        });

        this.tfNumero = new Ext.form.TextField({
            name: 'tfNumero',
            anchor: '100%',
            fieldLabel: etiquetas.lbNumero,
            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            blankText: etiquetas.blankText,
            maxLength: 8,
            emptyText: 'Criterio a buscar...',
            maxLengthText: etiquetas.lbMaximo8Caracteres,
            enableKeyEvents: true
        });

        this.cbEstado = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: true,
            store: model.stEstado,
            valueField: 'idestado',
            displayField: 'estado',
            hiddenName: 'idestado',
            typeAhead: true,
            mode: 'local',
            //pageSize: 10,
            //minChars: 0,
            triggerAction: 'all',
            enableKeyEvents: true,
            hidden: cargaInicial
        });
        this.btnBuscar = new Ext.Button({
            text: etiquetas.lbBtnBuscar,
            tooltip: etiquetas.lbBuscarAnticipo,
            disabled: true,
            iconCls: 'buscar'
        });

        this.smAnticipos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.paginToolbar = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            displayInfo: true,
            clearFilter: true,
            /*displayMsg: etiquetas.lbDisplayMsg,
             emptyMsg: etiquetas.lbEmptyMsg,*/
            store: model.stAnticipos
        });

        this.gridAnticipo = new Ext.grid.GridPanel({
            autoExpandColumn: 'nombre',
            stripeRows: true,
            border: false,
            store: model.stAnticipos,
            sm: this.smAnticipos,
            columns: [
                {
                    sortable: true,
//                    header: etiquetas.lbNumero,
                    header: 'No.',
                    dataIndex: 'numero',
                    //align: 'center',
                    width: 100,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (record.data.cargainicial == "1") {
                            return 'CI - ' + value;
                        }
                        else {
                            return value;
                        }
                    }
                }, {
                    id: 'nombre',
                    sortable: true,
                    header: etiquetas.lbNombreApell,
                    dataIndex: 'nombreyapellidos',
                    width: 200
                },  {
                    sortable: true,
                    header: etiquetas.lbCentroCosto,
                    dataIndex: 'centrocosto',
                    width: 200
                }, {
                    sortable: true,
                    header: etiquetas.lbLaborARealizar,
                    id: 'laborarealizar',
                    dataIndex: 'laborarealizar',
                    width: 200
                }, {
                    header: etiquetas.lbFechaEmision,
                    dataIndex: 'fechaemision',
                    sortable: true,
                    // align: 'center',
                    width: 100
                }, {
                    id: 'fechavencimiento',
                    sortable: true,
                    header: etiquetas.lbFechaVencimiento,
                    dataIndex: 'fechavencimiento',
                    // align: 'center',
                    width: 100
                    //renderer: 'erpFecha'
                }, {
                    sortable: true,
                    header: 'País',
                    dataIndex: 'nompais',
                    width: 150
                }, {
                    header: etiquetas.lbImporteEntregado,
                    id: 'importe',
                    sortable: true,
                    renderer: formatoMoneda,
                    dataIndex: 'importemo',
                    align: 'right',
                    width: 110
                }, {
                    header: etiquetas.lbImporteUtil,
                    id: 'importe',
                    sortable: true,
                    renderer: formatoMoneda,
                    dataIndex: 'importeLiqmo',
                    align: 'right',
                    width: 100
                }, {
                    id: 'estado',
                    header: etiquetas.lbEstado,
                    dataIndex: 'estado',
                    sortable: true,
                    width: 100,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (record.data.cargainicial == '1' && record.data.idestado == 8) {
                            var index = model.stEstado.find('idestado', 6);
                            if (index >= 0) {
                                record.data.idestado = 6;///Muestra los de carga inicila como posteados para poder liuidarlos
                                var newValue = model.stEstado.getAt(index).data.estado;
                                return newValue;
                            }
                        }
                        else return value;
                    }
                }, {
                    header: etiquetas.lbNo,
                    width: 80,
                    hidden: (cargaInicial) ? true : false,
                    hideable: (cargaInicial) ? false : true,
                    dataIndex: 'numcomprobante',
                    sortable: true
                }
            ],
            tbar: [etiquetas.lbNumeroBusc, this.tfNumero, (cargaInicial) ? '' : '-', (cargaInicial) ? '' : 'Estado:', this.cbEstado, '-', this.btnBuscar],
            bbar: this.paginToolbar
        });

        var tbarbuttons = (cargaInicial) ? [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.lfdPeriodo, '-', this.btnFondo, this.tfFondo, '-', this.btnAyudaCI] :
            [this.btnAdicionar, this.btnModificar, this.btnCancelar, this.btnAprobar, this.btnContabilizar, this.btnLiquidar, '->', this.lfdPeriodo, this.btnFondo, this.tfFondo, '-', this.btnAyuda];

        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            items: [this.gridAnticipo],
            tbar: tbarbuttons
        });

        new Ext.Viewport({
            layout: 'fit',
            items: [this.panel]
        });
    },
    Window: function (etiquetas, action, cargaInicial) {
        this.cbpersona = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbNombreApell,
            resizable: true,
            pageSize: 10,
            minChars: 3,
            maxLength: 50,
            emptyText: 'Seleccione...',
            editable: true,
            store: model.stPersona,
            valueField: 'idpersona',
            displayField: 'nombre',
            hiddenName: 'idpersona',
            forceSelection: true,
            anchor: '100%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: false,
            readOnly: false
        });

        this.dffecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbFechaEmision,
            name: 'fecha',
            enableKeyEvents: true,
            allowBlank: false,
            readOnly: true,
            nimValue: fechaInicio,
            maxValue: fechaFin,
            value: fechaContable,
            anchor: '100%',
            // maxValue: new Date(),
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.'
        });


        this.cantDias = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Días estimados de viaje',
            fieldLabel: etiquetas.lbDiasEstimados,
            name: 'diasviaje',
            // readOnly: true,
            disabled: true,
            enableKeyEvents: true,
            allowBlank: false,
            anchor: '100%'
        });

        this.cantDiasLiq = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbDiasLiq,
            name: 'diasviajeLiq',
            // readOnly: true,
            disabled: true,
            enableKeyEvents: true,
            allowBlank: false,
            anchor: '100%',
            minValue: 0
        });

        //----
        this.cantDiasHosp = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Días hospedado',
            name: 'cantDiasHosp',
            // readOnly: true,
            maxValue: 500,//Dias
            disabled: (action === 'liq') ? true : false,
            enableKeyEvents: true,
            allowBlank: true,
            anchor: '100%',
            minValue: 0,
            validator: function (value) {
                if (this.cantDias.getValue()) {
                    if (value <= this.cantDias.getValue())
                        return true;
                    return 'El valor debe ser menor o igual que ' + this.cantDias.getValue();
                } else return true;
            }.bind(this)
        });

        this.cantDiasLiqHosp = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Días hospedado',
            name: 'cantDiasLiqHosp',
            // readOnly: true,
            maxValue: 500,//Dias
            enableKeyEvents: true,
            allowBlank: true,
            anchor: '100%',
            minValue: 0,
            validator: function (value) {
                if (this.cantDiasLiq.getValue()) {
                    if (value <= this.cantDiasLiq.getValue())
                        return true;
                    return 'El valor debe ser menor o igual que ' + this.cantDiasLiq.getValue();
                } else return true;
            }.bind(this)
        });
        //----

        // Ext.apply(Ext.form.VTypes, {
        //     daterange: function(val, field) {
        //         var date = field.parseDate(val);
        //
        //         if (!date) {
        //             return;
        //         }
        //         if (field.startDateField
        //             && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
        //                 .getTime()))) {
        //             var start = Ext.getCmp(field.startDateField);
        //             start.setMaxValue(date);
        //             start.validate();
        //             this.dateRangeMax = date;
        //         } else if (field.endDateField
        //             && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
        //                 .getTime()))) {
        //             var end = Ext.getCmp(field.endDateField);
        //             end.setMinValue(date);
        //             end.validate();
        //             this.dateRangeMin = date;
        //         }
        //         return true;
        //     }
        // });

        this.dffechae = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            fieldLabel: etiquetas.lbFechaEstimadaSalida,
            name: 'fechae',
            allowBlank: false,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            readOnly: true,
            anchor: '100%',
            disabled: (action === 'liq') ? true : false,
            //vtype: 'daterange',
            endDateField: 'fecharegreso',
            // minValue: new Date(),
            listeners: {
                scope: this,
                change: function (field, newValue, oldValue) {
                    this.dffecharegreso.setMinValue(newValue);
                    if (this.dffecharegreso.getRawValue() != '') {
                        var fechaResta = this.dffecharegreso.getValue() - newValue;
                        var dias = Math.floor(fechaResta / (1000 * 60 * 60 * 24));
                        this.cantDias.setValue(dias + 1);
                        this.cantDiasHosp.setMaxValue(dias + 1);
                    }
                }
            }
        });

        this.dffechaeLiq = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            fieldLabel: etiquetas.lbFechaSalida,
            name: 'fechaeLiq',
            allowBlank: false,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            readOnly: true,
            anchor: '100%',
            //vtype: 'daterange',
            minValue: new Date(),
            endDateField: 'fecharegresoLiq',
            listeners: {
                scope: this,
                change: function (field, newValue, oldValue) {
                    this.dffecharegresoLiq.setMinValue(newValue);
                    if (this.dffecharegresoLiq.getRawValue() != '') {
                        var fechaResta = this.dffecharegresoLiq.getValue() - newValue;
                        var dias = Math.floor(fechaResta / (1000 * 60 * 60 * 24));
                        this.cantDiasLiq.setValue(dias + 1);
                        this.cantDiasLiqHosp.setMaxValue(dias + 1);
                    }
                }
            }
        });

        this.clocktime = new Ext.form.TimeField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbHoraEstimadaSalida,
            emptyText: 'Seleccione...',
            enableKeyEvents: true,
            name: 'clocktime',
            allowBlank: false,
            readOnly: true,
            disabled: (action === 'liq') ? true : false,
            anchor: '100%'
        });

        this.clocktimeLiq = new Ext.form.TimeField({
            //disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbHoraSalida,
            emptyText: 'Seleccione...',
            enableKeyEvents: true,
            name: 'clocktimeLiq',
            allowBlank: false,
            readOnly: true,
            anchor: '100%'
        });

        this.dffecharegreso = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            fieldLabel: etiquetas.lbFechaEstimadaRegreso,
            name: 'fecharegreso',
            allowBlank: false,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            readOnly: true,
            anchor: '100%',
            disabled: (action === 'liq') ? true : false,
            //vtype: 'daterange',
            //minValue: new Date(),
            startDateField: 'fechae',
            listeners: {
                scope: this,
                change: function (field, newValue, oldValue) {
                    this.dffechae.setMaxValue(newValue);
                    if (this.dffechae.getRawValue() != '') {
                        var fechaResta = newValue - this.dffechae.getValue();
                        var dias = Math.floor(fechaResta / (1000 * 60 * 60 * 24));
                        this.cantDias.setValue(dias + 1);
                    }
                    //-------------
                    var fehaVence = new Date(field.getValue()).add(Date.DAY, 3);//Vence 3 dias despues de la fecha de regreso
                    this.dffechaVence.setValue(fehaVence);
                }
            }
        });

        this.dffecharegresoLiq = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            fieldLabel: etiquetas.lbFechaRegreso,
            name: 'fecharegresoLiq',
            allowBlank: false,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            readOnly: true,
            anchor: '100%',
            //vtype: 'daterange',
            //minValue: new Date(),
            startDateField: 'fechaeLiq',
            listeners: {
                scope: this,
                change: function (field, newValue, oldValue) {
                    this.dffechaeLiq.setMaxValue(newValue);
                    if (this.dffechaeLiq.getRawValue() != '') {
                        var fechaResta = newValue - this.dffechaeLiq.getValue();
                        var dias = Math.floor(fechaResta / (1000 * 60 * 60 * 24));
                        this.cantDiasLiq.setValue(dias + 1);
                    }
                    //-------------
                    var fehaVence = new Date(field.getValue()).add(Date.DAY, 3);//Vence 3 dias despues de la fecha de regreso
                    this.dffechaVence.setValue(fehaVence);
                }
            }
        });

        this.clocktimeregreso = new Ext.form.TimeField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbHoraEstimadaRegreso,
            emptyText: 'Seleccione...',
            enableKeyEvents: true,
            disabled: (action === 'liq') ? true : false,
            name: 'clocktimeregreso',
            allowBlank: false,
            readOnly: true,
            anchor: '100%'
        });

        this.clocktimeregresoLiq = new Ext.form.TimeField({
            //disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbHoraRegreso,
            emptyText: 'Seleccione...',
            enableKeyEvents: true,
            name: 'clocktimeregresoLiq',
            allowBlank: false,
            readOnly: true,
            anchor: '100%'
        });

        // this.tflabor = new Ext.form.TextField({
        this.tflabor = new Ext.form.TextArea({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            fieldLabel: etiquetas.lbLaborARealizar,
            maxLength: 255,
            height: 40,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            maxLengthText: etiquetas.lbMaximo255Caracteres,
            name: 'labor',
            anchor: '100%',
            allowBlank: false
        });

        this.dffechaVence = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            fieldLabel: etiquetas.lbFechaVencimiento,
            name: 'fechavence',
            allowBlank: false,
            minValue: new Date(),
            disabled: true,
            anchor: '100%',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.'
        });

        this.dffechaLiq = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            fieldLabel: etiquetas.lbFechaLiq,
            name: 'fechaliq',
            allowBlank: false,
            anchor: '100%',
            minValue: fechaInicio,
            maxValue: fechaFin,
            value: fechaContable,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.'
        });

        this.cbOperaciones = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            resizable: true,
            emptyText: etiquetas.lbSeleccione,
            forceSelection: true,
            fieldLabel: etiquetas.lbOperacionContable,
            store: model.stOperaciones,
            valueField: 'idnomoperaciones',
            displayField: etiquetas.lbDenominacion,
            editable: false,
            hiddenName: 'idnomoperaciones',
            typeAhead: true,
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            anchor: '100%'
        });

        this.cbAutoriza = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Autoriza',
            resizable: true,
            //pageSize: 10,
            //minChars: 0,
            emptyText: 'Seleccione...',
            editable: true,
            store: model.stAutoriza,
            valueField: 'idpersona',
            displayField: 'nombre',
            hiddenName: 'idpersona',
            forceSelection: true,
            anchor: '100%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            readOnly: false
        });

        this.cbAnota = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Anota',
            resizable: true,
            pageSize: 10,
            minChars: 0,
            emptyText: 'Seleccione...',
            editable: true,
            store: model.stPersona,
            valueField: 'idpersona',
            displayField: 'nombre',
            hiddenName: 'idpersona',
            forceSelection: true,
            anchor: '100%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: false,
            readOnly: false
        });

        this.alimentacion = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Alimentaci&oacute;n',
            name: 'alimentacion',
            allowDecimals: true,
            style: 'text-align: right',
            enableKeyEvents: true,
            allowBlank: true,
            emptyText: '0.00',
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            anchor: '100%'
        });

        this.alimentacionLiq = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Alimentaci&oacute;n',
            name: 'alimentacionLiq',
            allowDecimals: true,
            style: 'text-align: right',
            enableKeyEvents: true,
            allowBlank: true,
            emptyText: '0.00',
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            anchor: '100%'
        });

        this.hospedaje = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Hospedaje',
            name: 'hospedaje',
            style: 'text-align: right',
            enableKeyEvents: true,
            allowBlank: true,
            emptyText: '0.00',
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            anchor: '100%'
        });

        this.hospedajeLiq = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Hospedaje',
            name: 'hospedajeLiq',
            style: 'text-align: right',
            enableKeyEvents: true,
            allowDecimals: true,
            allowBlank: true,
            emptyText: '0.00',
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            anchor: '100%'
        });

        this.desayuno = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Desayuno',
            name: 'desayuno',
            style: 'text-align: right',
            enableKeyEvents: true,
            allowDecimals: true,
            allowBlank: true,
            emptyText: '0.00',
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            anchor: '100%'
        });

        this.desayunoLiq = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Desayuno u Otros',
            name: 'desayunoLiq',
            style: 'text-align: right',
            enableKeyEvents: true,
            allowDecimals: true,
            allowBlank: true,
            emptyText: '0.00',
            anchor: '100%'
        });

        this.transporte = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Transporte u Otros',
            name: 'transporte',
            style: 'text-align: right',
            allowDecimals: true,
            enableKeyEvents: true,
            allowBlank: true,
            emptyText: '0.00',
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            anchor: '100%'
        });

        this.transporteLiq = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Transporte',
            name: 'transporteLiq',
            style: 'text-align: right',
            enableKeyEvents: true,
            allowDecimals: true,
            allowBlank: true,
            emptyText: '0.00',
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            anchor: '100%'
        });

        this.total = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: false,
            fieldLabel: 'Total',
            name: 'total',
            disabled: true,
            allowDecimals: true,
            enableKeyEvents: true,
            allowBlank: false,
            emptyText: '0.00',
            anchor: '100%'
        });

        this.totalAnt = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: false,
            fieldLabel: etiquetas.lbTotalEntregado,
            name: 'totalAnt',
            style: 'text-align: right',
            allowBlank: false,
            emptyText: '0.00',
            allowDecimals: true,
            disabled: true,
            enableKeyEvents: true,
            //allowBlank: false,
            anchor: '100%'
        });

        this.totalLiq = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: false,
            fieldLabel: etiquetas.lbTotalUtilizado,
            name: 'totalLiq',
            style: 'text-align: right',
            emptyText: '0.00',
            allowDecimals: true,
            disabled: true,
            enableKeyEvents: true,
            allowBlank: false,
            anchor: '100%'
        });

        this.numTal = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: false,
            fieldLabel: etiquetas.lbNumero,
            maxLength: 8,
            maxLengthText: etiquetas.lbMaximo8Caracteres,
            name: 'numero',
            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            allowBlank: false,
            anchor: '100%'
        });

        //------------------
        this.cbPais = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            name: 'idpais',
            anchor: '100%',
            store: model.stPais,
            typeAhead: true,
            allowBlank: false,
            forceSelection: true,
            mode: 'local',
            //tabIndex: 1,
            valueField: 'idpais',
            hiddenName: 'idpais',
            triggerAction: 'all',
            displayField: 'nombrepais',
            fieldLabel: 'País',
            blankText: 'Este campo es obligatorio',
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{nombrepais}" class="x-combo-list-item">{nombrepais}</div></tpl>'
        });
        // ------------------
        this.cbInstrumento = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            name: 'cbInstrumento',
            anchor: '100%',
            store: model.stInstrumento,
            typeAhead: true,
            allowBlank: false,
            forceSelection: true,
            readOnly: true,
            mode: 'local',
            //tabIndex: 1,
            valueField: 'iddocumento',
            hiddenName: 'iddocumento',
            triggerAction: 'all',
            displayField: 'nominstrumento',
            fieldLabel: 'Instrumento',
            blankText: 'Este campo es obligatorio',
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{importe}" class="x-combo-list-item">{nominstrumento}</div></tpl>'
        });
        //-------------------------------------------------
        //-------------------------------------------------
        //--Registro de Gastos-----------------------
        //Combo CuentaGasto-----------
        /*this.stCuentaGasto = new Ext.data.Store({
            url: 'cargarCuentaGasto',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuentagasto', mapping: 'idcuenta'},
                {name: 'text'}
            ])
        });
        this.cbCuentaGasto = new Ext.form.ComboBox({
            name: 'cbCuenta',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            editable: true,
            emptyText: etiquetas.lbSeleccione,
            width: 100,
            allowBlank: false,
            store: this.stCuentaGasto,
            valueField: 'idcuentagasto',
            displayField: 'text',
            enableKeyEvents: true,
            typeAhead: true,
            resizable: true,
            readOnly: true,
            mode: 'local',
            triggerAction: 'all',
            listeners: {
                scope: this,
                select: function (cb) {
                    this.stCCosto.baseParams = {'idCuenta': cb.getValue()}
                    this.stCCosto.load();
                    this.cbCCosto.enable();
                },
                change: function () {
                    this.cbCCosto.clearValue();
                }
            }
        });*/
        //Combo CCosto-----------
        /*this.stCCosto = new Ext.data.Store({
            url: 'cargarCentrosCosto',
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuentaccosto', mapping: 'idcuenta'},
                {name: 'clavecuenta'},
                {name: 'textcuentaccosto', mapping: 'descripcion'}
            ])
        });
        this.cbCCosto = new Ext.form.ComboBox({
            name: 'cbCCosto',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            editable: true,
            disabled: true,
            resizable: true,
            emptyText: etiquetas.lbSeleccione,
            width: 50,
            allowBlank: false,
            store: this.stCCosto,
            valueField: 'idcuentaccosto',
            displayField: 'textcuentaccosto',
            enableKeyEvents: true,
            typeAhead: true,
            readOnly: true,
            mode: 'local',
            triggerAction: 'all',
            listeners: {
                scope: this,
                select: function (cb) {
                    this.cbEGasto.getStore().baseParams.idcuenta = this.cbCCosto.getValue();
                    this.cbEGasto.enable();
                },
                change: function () {
                    this.cbEGasto.clearValue();
                }
            }
        });*/

        //Combo Elemento Gasto-----------
        /*this.stEGasto = new Ext.data.Store({
            url: 'cargarElementosGastos',
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuentaelemento', mapping: 'idcuenta'},
                // {name: 'clavecuenta'},
                // {name: 'descripcion'},
                {name: 'idcuenta'},
                {name: 'text'},
                {name: 'textcuentaelemento', mapping: 'text'}
            ])
        });

        this.cbEGasto = new Ext.contabilidad.util.linkedCombo({
            store: this.stEGasto,
            // displayField: 'descripcion',
            // valueField: 'idcuentagasto',
            listHeight: 200,
            disabled: true,
            resizable: true,
            displayField: 'textcuentaelemento',
            valueField: 'idcuentaelemento',
            lazyRender: true,
            fnCreateNew: Ext.emptyFn,
            listeners: {
                scope: this,
                beforeload: function () {
                    this.cbEGasto.setBaseParams({
                        idcuenta: this.cbCCosto.getValue()
                    })
                },
                expand: function () {
                    if (this.cbCCosto.getValue() != '') {
                        if (this.cbEGasto.getStore().getCount() && this.cbEGasto.tree.rendered && (this.idCentroCostoOld != this.cbCCosto.getValue())) {
                            this.cbEGasto.tLoader.load(this.cbEGasto.root);
                        }
                        this.idCentroCostoOld = this.cbCCosto.getValue();
                    }
                },
                select: function (combo, record, index) {
                    var index = this.stAnexoGasto.find('idcuentaelemento', combo.getValue());
                    if (index >= 0) {
                        mostrarMensaje(1, etiquetas.lbGastoRegistrado);
                        combo.reset();
                    }
                    this.nfImporte.enable();
                }
            }
        });*/

        this.stCuenta = new Ext.data.Store({
            url: 'cargarCuentaGasto',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuenta'},
                {name: 'text'},
                {name: 'idmoneda'},
                {name: 'codigoiso'}
            ])
        });

        this.cbxCuenta = new Ext.contabilidad.util.linkedCombo({
            store: this.stCuenta,
            fieldLabel: etiquetas.lbCuentaGasto,
            displayField: 'text',
            valueField: 'idcuenta',
            mode: 'local',
            hideTbar: true,
            listHeight: 200,
            tabIndex: 4,
            anchor: '97%',
            // disabled: true,
            listeners: {
                scope: this,
                // specialkey: function (tf, e) {
                //     if (e.getCharCode() == Ext.EventObject.ENTER)
                //         this.nfImporte.enable();
                //         this.nfImporte.focus();
                // },
                select: function (cb) {
                    var index = this.stAnexoGasto.find('idcuentaelemento', cb.getValue());
                    if (index != -1) {
                        cb.reset();
                        mostrarMensaje(1, etiquetas.lbGastoRegistrado);
                    } else {
                        this.nfImporte.enable();
                        this.nfImporte.focus();
                    }
                }
            }
        });

        this.nfImporte = new Ext.form.NumberField({
            allowBlank: false,
            disabled: true,
            allowNegative: false,
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            }
        });

        this.recordData = Ext.data.Record.create([
            // {name: 'idcuentagasto', type: 'int'},
            // {name: 'idcuentaccosto', type: 'int'},
            // {name: 'textcuentaccosto', type: 'string'},
            {name: 'idcuentaelemento', type: 'int'},
            {name: 'textcuentaelemento', type: 'string'},
            {name: 'importemo', type: 'float'}
        ]);

        this.roweditor = new Ext.Cont.RowEditor({
            id: 'idRoweditor',
            clicksToEdit: 2,
            cancelText: etiquetas.lbCancelar,
            saveText: etiquetas.lbAceptar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            saveTooltip: etiquetas.lbToolRowEditorAceptar,
            cancelTooltip: etiquetas.lbToolRowEditorCancelar
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: etiquetas.lbToolDel,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        this.stAnexoGasto = new Ext.data.Store({
            //url: 'cargarAnexoGasto',
            scope: this,
            reader: new Ext.data.JsonReader({
                // root: 'datos'
            }, [
                // {name: 'idcuentagasto'},
                // {name: 'idcuentaccosto'},
                // {name: 'textcuentaccosto'},
                {name: 'idcuentaelemento'},
                {name: 'textcuentaelemento'},
                {name: 'importemo'}
            ]),
            sortInfo: {field: 'idcuentaelemento', direction: 'DESC'}
        });

        this.gpAnexoGasto = new Ext.grid.EditorGridPanel({
            title: 'Registro de gastos',//etiquetas.lbGetTalonario,
            region: 'center',
            layout: 'fit',
            // width: 600,
            height: 200,
            hidden: (action === 'liq') ? false : true,
            stripeRows: true,
            border: false,
            frame: true,
            clicksToEdit: 2,
            store: this.stAnexoGasto,
            autoExpandColumn: 'idcuentaelemento',
            forceFit: true,
            loadMask: true,
            columns: [
                /*{
                    id: 'idcuentagasto',
                    header: etiquetas.lbCuentaGasto,
                    dataIndex: 'idcuentagasto',
                    width: 200,
                    align: 'left',
                    editor: this.cbCuentaGasto,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = this.cbCuentaGasto.store;
                            if (store) {
                                var index = store.find('idcuentagasto', value);
                                if (index >= 0) {
                                    var newValue = store.getAt(index).data.text;
                                    return newValue;
                                }
                            }
                        }
                    }.bind(this)
                }, {
                    header: etiquetas.lbCCosto,
                    id: 'idcuentaccosto',
                    dataIndex: 'idcuentaccosto',
                    // width: 200,
                    align: 'left',
                    editor: this.cbCCosto,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = this.cbCCosto.store;
                            if (store.getCount()) {
                                var index = store.find('idcuentaccosto', value);
                                if (index >= 0) {
                                    var newValue = store.getAt(index).data.textcuentaccosto;
                                    record.data.textcuentaccosto = newValue;
                                    return newValue;
                                }
                            } else return record.data.textcuentaccosto;
                        }
                    }.bind(this)
                }, */
                {
                    id: 'idcuentaelemento',
                    header: etiquetas.lbEGasto,
                    dataIndex: 'idcuentaelemento',
                    width: 250,
                    align: 'left',
                    editor: this.cbxCuenta,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = this.cbxCuenta.getStore();
                            if (store.getTotalCount()) {
                                var index = store.find('idcuenta', value);
                                if (index >= 0) {
                                    var newValue = store.getAt(index).data.text;
                                    record.data.textcuentaelemento = newValue;
                                    return newValue;
                                }
                            } else return record.data.textcuentaelemento;
                        }
                    }.bind(this)
                }, {
                    header: etiquetas.lbImporte,
                    dataIndex: 'importemo',
                    width: 80,
                    align: 'right',
                    editor: this.nfImporte,
                    renderer: formatoMonedaABS
                },
                this.rowaction
            ],
            plugins: [this.roweditor, this.rowaction],
            sm: this.smAnexoGasto = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            forceFit: true,
            tbar: [{
                scope: this,
                text: etiquetas.lbAdicionar,
                iconCls: 'adicionar',
                tooltip: etiquetas.lbToolAddGasto,
                handler: function () {
                    var record = new this.recordData({
                        // idcuentagasto: '',
                        // idcuentaccosto: '',
                        // textcuentaccosto: '',
                        idcuentaelemento: '',
                        textcuentaelemento: '',
                        importemo: '',
                    });
                    this.roweditor.stopEditing();
                    var total = this.stAnexoGasto.getCount();
                    this.stAnexoGasto.insert(total, record);
                    this.gpAnexoGasto.getSelectionModel().selectRow(total);
                    this.roweditor.startEditing(total);
                }
            }],
            bbar: ['->', new Ext.Toolbar.TextItem('Total:'), this.labelTotal = new Ext.form.Label({
                text: '0.00'
            })]
        });
        //-------------------------------------------------
        //-------------------------------------------------

        var formLiq = (action === 'liq') ? {
            labelAlign: 'top',
            layout: 'column',
            title: 'Importe utilizado',
            xtype: 'fieldset',
            //checkboxToggle: true,
            //height: Ext.lib.Dom.getViewHeight() * 0.39,
            height: '150',
            anchor: '100%',
            items: [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .20,
                items: [this.alimentacionLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [this.hospedajeLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [this.desayunoLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [this.transporteLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .20,
                items: [this.totalLiq]
            }]
        } : {};

        var fieldSetLiq = (action === 'liq') ? {
            labelAlign: 'top',
            // layout: 'column',
            title: 'Liquidación',
            xtype: 'fieldset',
            //checkboxToggle: true,
            //height: Ext.lib.Dom.getViewHeight() * 0.39,
            height: '150',
            anchor: '100%',
            items: [{
                labelAlign: 'top',
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.dffechaeLiq]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.clocktimeLiq]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.dffecharegresoLiq]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.clocktimeregresoLiq]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .14,
                    items: [this.cantDiasLiq]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .14,
                    items: [this.cantDiasLiqHosp]
                }
                ]
            }, /*formLiq*/this.gpAnexoGasto
            ]
        } : {};
//-------------------------
        var fieldSetAnt = {
            labelAlign: 'top',
            // layout: 'column',
            title: 'Anticipo',
            xtype: 'fieldset',
            checkboxToggle: (action === 'liq') ? true : false,
            collapsed: (action === 'liq') ? true : false,
            //height: Ext.lib.Dom.getViewHeight() * 0.39,
            height: '150',
            anchor: '100%',
            items: [{
                labelAlign: 'top',
                layout: 'column',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .17,
                    items: [this.dffechae]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.clocktime]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .19,
                    items: [this.dffecharegreso]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.clocktimeregreso]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .14,
                    items: [this.cantDias]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .14,
                    items: [this.cantDiasHosp]
                }]
            }, {
                labelAlign: 'top',
                layout: 'column',
                title: etiquetas.lbImporteEntregado,
                xtype: 'fieldset',
                //height: Ext.lib.Dom.getViewHeight() * 0.39,
                height: '150',
                // id: 'fsAnticipo',
                anchor: '100%',
                items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.alimentacion]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.hospedaje]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.desayuno]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .18,
                    items: [this.transporte]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .28,
                    items: [this.cbInstrumento]
                }, {
                    style: 'margin:0 0 0 0',
                    layout: 'form',
                    hidden: true,
                    items: [this.totalAnt]
                }]
            }]
        };
        //----------------
        this.fpanel = new Ext.FormPanel({
            frame: true,
            border: false,
            autoHeight: true,
            layout: 'form',
            items: [
                {
                    labelAlign: 'top',
                    //autoHeight: true,
                    layout: 'column',
                    items: [{
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: cargaInicial ? .1 : 0,
                        items: cargaInicial ? this.numTal : {}
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: cargaInicial ? .3 : .4,
                        items: this.cbpersona
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .15,
                        items: this.dffecha
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .15,
                        items: this.dffechaVence
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .30,
                        items: [this.cbPais]
                    }]
                }, {
                    labelAlign: 'top',
                    layout: 'column',
                    frame: false,
                    border: false,
                    region: 'center',
                    items: [{
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: 1,
                        items: [this.tflabor]
                    }]
                }, fieldSetAnt, fieldSetLiq,
                {
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        hidden: (action === 'liq') ? false : true,
                        columnWidth: (action === 'liq') ? .15 : 0,
                        items: (action === 'liq') ? [this.dffechaLiq] : {}
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: (action === 'liq') ? .35 : .50,
                        items: [this.cbOperaciones]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [this.cbAnota]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .25,
                        items: [this.cbAutoriza]
                    }]
                }]
        });

        this.btnAddCerrar = new Ext.Button({
            text: etiquetas.lbCancelar,
            tooltip: etiquetas.lbCancelarForm,
            iconCls: 'cancelar'
        });

        this.btnNuevo = new Ext.Button({
            text: 'Nuevo',
            tooltip: 'Limpiar los campos',
            iconCls: 'nuevo'
        });

        this.btnAplicar = new Ext.Button({
            text: 'Aplicar',
            tooltip: etiquetas.toolAplicar,
            iconCls: 'aplicar'
        });

        this.btnAceptar = new Ext.Button({
            text: etiquetas.lbAceptar,
            //disabled: (action === 'add') ? true : false,
            disabled: true,
            tooltip: etiquetas.toolAceptar,
            iconCls: 'aceptar'
        });

        this.btnAprobarAddMod = new Ext.Button({
            text: 'Aprobar',
            disabled: false,
            tooltip: 'Aprobar anticipos',
            iconCls: 'aprobar',
            hidden: true
        });

        this.btnContabilizarAddMod = new Ext.Button({
            text: etiquetas.lbContabilizar,
            disabled: true,
            tooltip: 'Contabilzar anticipos',
            iconCls: 'contabilidad',
            hidden: true
        });

        this.btnLiquidarAddMod = new Ext.Button({
            text: etiquetas.lbAddLiquidar,
            tooltip: 'Liquidar anticipos',
            iconCls: 'liquidar'
        });

        this.winAddMod = new Ext.Window({
            title: (action == 'add') ? etiquetas.lbAnticipoExt : etiquetas.lbModAnticipoViajExt,
            layout: 'fit',
            width: 900,
            frame: true,
            border: false,
            autoHeight: true,
            modal: true,
            autoValidate: false,
            resizable: false,
            constrain: true,
            closeAction: 'hide',
            items: [this.fpanel],
            //bbar: [/*'Días estimados de viaje', this.cantDias, */'->', 'Total dieta: ', this.total],
            bbar: ['->', this.labelDiferencia = new Ext.form.Label({
                name: 'labelDiferencia',
                text: ''
            })],
            buttons: (action == 'add') ? [this.btnAddCerrar, this.btnAplicar, this.btnAceptar, this.btnAprobarAddMod, this.btnContabilizarAddMod] : [this.btnAddCerrar, this.btnAceptar, this.btnAprobarAddMod, this.btnContabilizarAddMod]
        });
    },
    WindowCancelar: function (etiquetas, fecha) {
        this.cbmotivo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbMotivoCancelacion,
            mode: 'local',
            name: 'cbxmotivo',
            tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
            resizable: true,
            emptyText: etiquetas.lbSeleccione,
            store: model.stMotivo,
            hiddenName: 'idmotivocancelacion',
            valueField: 'idmotivocancelacion',
            displayField: 'motivo',
            editable: false,
            typeAhead: true,
            msgTarget: 'qtip',
            maskRe: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, nÃºmeros y espacios
            regex: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
            regexText: etiquetas.lbSoloLetrasyNo,
            allowBlank: false,
            blankText: etiquetas.lbCampoObligatorio,
            anchor: '100%',
            triggerAction: 'all'
        });

        this.dffechacancelacion = new Ext.form.DateField({
            name: 'dffechacancelacion',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbFechaCanc,
            readOnly: true,
            msgTarget: 'qtip',
            allowBlank: false,
            blankText: etiquetas.lbCampoObligatorio,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            minValue: fecha,
            maxValue: new Date(),
            editable: false,
            anchor: '100%'
        });

        this.fpCancelar = new Ext.FormPanel({
            region: 'north',
            labelAlign: 'top',
            frame: true,
            border: true,
            layout: 'form',
            autoHeight: true,
            modal: true,
            bodyStyle: 'padding:0px 10px 0px 10px',
            items: [this.cbmotivo, this.dffechacancelacion]
        });
        this.btnCancelarCerrar = new Ext.Button({
            text: etiquetas.lbCerrar,
            tooltip: etiquetas.lbCancelarForm,
            iconCls: 'cancelar'
        });

        this.btnCancelarAceptar = new Ext.Button({
            text: etiquetas.lbAceptar,
            disabled: true,
            tooltip: etiquetas.lbAceptarForm,
            iconCls: 'aceptar'
        });
        this.winCancelar = new Ext.Window({
            title: 'Cancelar',
            layout: 'fit',
            width: 300,
            frame: true,
            autoValidate: false,
            border: false,
            autoHeight: true,
            modal: true,
            resizable: false,
            constrain: true,
            closeAction: 'close',
            items: [this.fpCancelar],
            buttons: [this.btnCancelarCerrar, this.btnCancelarAceptar]
        });
    }
}
;
