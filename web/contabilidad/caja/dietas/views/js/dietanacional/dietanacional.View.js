Ext.ns('Caja.DietaNacional');
Caja.DietaNacional.View = {
    init: function (perfil, etiquetas, model, cargaInicial) {

        this.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });

        this.btnAddMenu = new Ext.menu.Menu({
            text: etiquetas.lbAdicionar,
            tooltip: etiquetas.lbAddAnticipo,
            iconCls: 'adicionar',
            items: [
                this.btnAddAnt = new Ext.menu.Item({
                    text: etiquetas.lbAnticipo,
                    tooltip: etiquetas.lbToolAddAnt,
                    iconCls: 'clausulacrm'
                }),
                this.btnAddLiq = new Ext.menu.Item({
                    text: etiquetas.lbLiquidacion,
                    tooltip: etiquetas.lbToolAddLiq,
                    iconCls: 'cargadoacuenta'
                })]
        });

        /*if (cargaInicial) {
            this.btnAdicionar = new Ext.Button({
                text: etiquetas.lbAdicionar,
                tooltip: etiquetas.lbAddAnticipoCI,
                iconCls: 'adicionar'
            });
        } else {
            this.btnAdicionar = new Ext.Button({
                text: etiquetas.lbAdicionar,
                tooltip: etiquetas.lbAddAnticipo,
                iconCls: 'adicionar',
                menu: this.btnAddMenu
            });
        }*/

        this.btnAdicionar = new Ext.Button({
            text: etiquetas.lbAdicionar,
            tooltip: etiquetas.lbAddAnticipo,
            iconCls: 'adicionar',
            menu: this.btnAddMenu
        });

        this.btnModificar = new Ext.Button({
            text: etiquetas.lbModificar,
            disabled: true,
            tooltip: etiquetas.lbModifAnticipo,
            iconCls: 'modificar'
        });
        this.btnImportar = new Ext.Button({
            id:'btnImportar',
            text:'Importar',
            tooltip: 'Importar Dieta Nacional',
            hidden: (this.aperturadoCaja == 0) ? true : false,
            tabIndex: 314,
            iconCls: 'importar',
            hidden: cargaInicial ? 0 : 1,

        })

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

        this.btnReporte = new Ext.Button({
            text: etiquetas.lbVistaReporte,
            tooltip: etiquetas.lbToolVistaReporte,
            disabled: true,
            iconCls: 'vistareporte'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaDietaNac',
            text: etiquetas.lbAyuda,
            tooltip: etiquetas.lbTooAyuda,
            iconCls: 'ayuda'
        });

        this.btnAyudaCI = new Ext.Button({
            id: 'btnAyudaDietaNacCI',
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
            maxLength: 8,
            maxLengthText: etiquetas.lbMaximo8Caracteres,
            fieldLabel: etiquetas.lbNumero,
            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            blankText: etiquetas.blankText,
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            width: 110
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
            hidden: cargaInicial,
            width: 110
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

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            widthSlope: 100,
            header: "No. Comprobante",
            actions: [
                {
                    id: 'vistareporte',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'Ver comprobante',
                    iconCls: 'vistareporte',
                    marginLeft: 5,
                    width: 200,
                    height: 16,
                    hideIndex: 'showCmp',
                    textIndex: 'numcomprobante',
                },
            ]
        });

        this.gridAnticipo = new Ext.grid.GridPanel({
            autoExpandColumn: 'laborarealizar',
            stripeRows: true,
            border: false,
            loadMask: true,
            store: model.stAnticipos,
            sm: this.smAnticipos,
            viewConfig: {
                forceFit: true
            },
            columns: [
                {
                    id: 'numero',
                    sortable: true,
//                    header: etiquetas.lbNumero,
                    header: 'No.',
                    dataIndex: 'numero',
                    //align: 'center',
                    width: 40,
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
                    width: 120
                }, {
                    sortable: true,
                    header: etiquetas.lbCentroCosto,
                    dataIndex: 'centrocosto',
                    width: 100
                }, {
                    sortable: true,
                    header: etiquetas.lbLaborARealizar,
                    id: 'laborarealizar',
                    dataIndex: 'laborarealizar',
                    width: 250
                }, {
                    header: etiquetas.lbTipoDieta,
                    dataIndex: 'nomtipodieta',
                    sortable: true,
                    // align: 'center',
                    width: 60
                }, {
                    header: etiquetas.lbFechaEmision,
                    dataIndex: 'fechaemision',
                    sortable: true,
                    // align: 'center',
                    width: 70
                }, {
                    id: 'fechavencimiento',
                    sortable: true,
                    header: etiquetas.lbFechaVencimiento,
                    dataIndex: 'fechavencimiento',
                    // align: 'center',
                    width: 70
                    //renderer: 'erpFecha'
                }, /*{
                    id: 'clasificacion',
                    sortable: true,
                    header: etiquetas.lbClasificacion,
                    dataIndex: 'clasificacion',
                    width: 125,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var index = model.stcbclasificacion.find('idclasificacion', value);
                        if (index >= 0) {
                            var newValue = model.stcbclasificacion.getAt(index).data.nombre;
                            return newValue;
                        }
                    }
                },*/ {
                    header: etiquetas.lbImporteEntregado,
                    id: 'importe',
                    sortable: true,
                    renderer: formatoMoneda,
                    dataIndex: 'importemo',
                    align: 'right',
                    width: 70
                }, {
                    header: etiquetas.lbImporteUtil,
                    id: 'importe',
                    sortable: true,
                    renderer: formatoMoneda,
                    dataIndex: 'importeLiqmo',
                    align: 'right',
                    width: 70
                }, {
                    header: 'Importe tarjeta',
                    sortable: true,
                    renderer: formatoMoneda,
                    hidden: true,
                    hiddeable: false,
                    dataIndex: 'importeTotalGatosIslaAzul',
                    align: 'right',
                    width: 70
                }, {
                    id: 'estado',
                    header: etiquetas.lbEstado,
                    dataIndex: 'estado',
                    sortable: true,
                    width: 70,
                    /*renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (record.data.cargainicial == '1' && record.data.idestado == 8) {
                            var index = model.stEstado.find('idestado', 6);
                            if (index >= 0) {
                                record.data.idestado = 6;///Muestra los de carga inicila como posteados para poder liquidarlos
                                var newValue = model.stEstado.getAt(index).data.estado;
                                return newValue;
                            }
                        }
                        else return value;
                    }*/
                },
                // {
                //     header: etiquetas.lbNo,
                //     width: 40,
                //     hidden: (cargaInicial) ? true : false,
                //     hideable: (cargaInicial) ? false : true,
                //     dataIndex: 'numcomprobante',
                //     sortable: true
                // },
                this.rowaction
            ],
            tbar: [etiquetas.lbNumeroBusc, this.tfNumero, (cargaInicial) ? '' : '-', (cargaInicial) ? '' : 'Estado:', this.cbEstado, '-', this.btnBuscar, '->', Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo],
            bbar: this.paginToolbar,
            plugins: this.rowaction
        });

        var tbarbuttons = (cargaInicial) ? [this.btnAdicionar, this.btnModificar, this.btnEliminar,this.btnImportar, '->', this.lfdPeriodo, '-', this.btnFondo, this.tfFondo, '-', this.btnAyudaCI] :
            [this.btnAdicionar, this.btnModificar, this.btnCancelar, this.btnConfirmar, this.btnContabilizar, this.btnLiquidar, this.btnReporte, '->', this.lfdPeriodo, this.btnFondo, this.tfFondo, '-', this.btnAyuda];

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
    Window: function (etiquetas, action, cargaInicial, scope, modoVer) {
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
            allowBlank: false,
            readOnly: false,
            maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
        });

        this.dffecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbFechaEmision,
            name: 'fecha',
            enableKeyEvents: true,
            allowBlank: false,
            readOnly: true,
            value: fechaContable,
            minValue: !cargaInicial ? fechaInicio : null,
            maxValue: new Date(),
            anchor: '100%',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
        });

        this.cbclasificacion = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            resizable: true,
            emptyText: etiquetas.lbSeleccione,
            editable: false,
            store: model.stcbclasificacion,
            forceSelection: true,
            name: 'clasificacion',
            valueField: 'idclasificacion',
            displayField: 'nombre',
            hiddenName: 'idclasificacion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            fieldLabel: etiquetas.lbClasificacion,
            anchor: '100%'
        });

        this.cantDias = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbDiasEstimados,
            name: 'diasviaje',
            readOnly: true,
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
            anchor: '100%'
        });
        //----
        this.cantDiasHosp = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Días hospedado',
            name: 'cantDiasHosp',
            //maxValue: 500,//Dias
            // readOnly: true,
            disabled: (action === 'liq') ? true : false,
            enableKeyEvents: true,
            allowBlank: true,
            anchor: '100%',
            maskRe: /^\d*$/,
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
            //maxValue: 500,//Dias
            // readOnly: true,
            enableKeyEvents: true,
            allowBlank: true,
            anchor: '100%',
            maskRe: /^\d*$/,
            validator: function (value) {
                if (this.cantDiasLiq.getValue()) {
                    if (value <= this.cantDiasLiq.getValue())
                        return true;
                    return 'El valor debe ser menor o igual que ' + this.cantDiasLiq.getValue();
                } else return true;
            }.bind(this)
        });

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
            minValue: !cargaInicial ? fechaInicio : null,
            listeners: {
                scope: this,
                change: function (field, newValue, oldValue) {
                    this.dffecharegreso.setMinValue(newValue);
                    if (this.dffecharegreso.getRawValue() != '') {
                        var fechaResta = this.dffecharegreso.getValue() - newValue;
                        var dias = Math.floor(fechaResta / (1000 * 60 * 60 * 24));
                        this.cantDias.setValue(dias + 1);
                        // this.cantDiasHosp.setMaxValue(dias + 1);
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
            endDateField: 'fecharegresoLiq',
            listeners: {
                scope: this,
                change: function (field, newValue, oldValue) {
                    this.dffecharegresoLiq.setMinValue(newValue);
                    if (this.dffecharegresoLiq.getRawValue() != '') {
                        var fechaResta = this.dffecharegresoLiq.getValue() - newValue;
                        var dias = Math.floor(fechaResta / (1000 * 60 * 60 * 24));
                        this.cantDiasLiq.setValue(dias + 1);
                        // this.cantDiasLiqHosp.setMaxValue(dias + 1);
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
                    //Calcular dias habiles-------------
                    var newFecha = new Date(field.getValue());
                    var cantDias = 3;
                    var numDiaSemana = newFecha.format('N');//Dias de la semana 1-Lunes, 7-Domingo
                    if (numDiaSemana == 6)
                        cantDias++;
                    else if (numDiaSemana >=3 && numDiaSemana < 6)
                        cantDias = cantDias + 2;

                    var fehaVence = new Date(field.getValue()).add(Date.DAY, cantDias);//Vence 3 dias habiles despues de la fecha de regreso
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
            enableKeyEvents: true,
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
            hideTrigger: true,
            anchor: '100%', invalidText: 'El formato establecido: dd/mm/aaaa.',
            format: 'd/m/Y'
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
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
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
            allowBlank: false,
            mode: 'local',
            readOnly: false,
            maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
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
            allowBlank: false,
            readOnly: false,
            maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
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
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            emptyText: '0.00',
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
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            emptyText: '0.00',
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
            anchor: '100%',
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
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
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            emptyText: '0.00',
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
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            emptyText: '0.00',
            anchor: '100%'
        });

        this.transporte = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Otros',
            name: 'transporte',
            style: 'text-align: right',
            allowDecimals: true,
            enableKeyEvents: true,
            allowBlank: true,
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            emptyText: '0.00',
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
            maxLength: 24,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            regex: /^([0-9.\,]+ ?[0-9.]*)+$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            regexText: etiquetas.lbSoloNumregexText,
            emptyText: '0.00',
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
            name: 'numero',
            maxLength: 8,
            maxLengthText: etiquetas.lbMaximo8Caracteres,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            allowBlank: false,
            anchor: '100%'
        });
//--Registro de Gastos--------------------------------
        //--Cargar las cuentas de gastos
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
            id: 'cbxCuenta',
            store: this.stCuenta,
            fieldLabel: etiquetas.lbCuentaGasto,
            displayField: 'text',
            valueField: 'idcuenta',
            mode: 'local',
            hideTbar: false,
            listHeight: 200,
            tabIndex: 4,
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
                        mostrarMensaje(1, etiquetas.lbGastoRegistrado);
                        cb.reset();
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
                root: 'datos'
            }, [
                {name: 'idcuentaelemento'},
                {name: 'textcuentaelemento'},
                {name: 'importemo'}
            ]),
            sortInfo: {field: 'idcuentaelemento', direction: 'DESC'}
        });

        this.btnAddGridAnexo = new Ext.Button({
            scope: this,
            text: etiquetas.lbAdicionar,
            iconCls: 'adicionar',
            tooltip: etiquetas.lbToolAdd,
            //icon: this.perfil.dirImg + 'adicionar.png',
            handler: function () {
                var record = new this.recordData({
                    //idcuentagasto: '',
                    //idcuentaccosto: '',
                    //textcuentaccosto: '',
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
        });

        this.gpAnexoGasto = new Ext.grid.EditorGridPanel({
            // title: 'Registro de gastos',//etiquetas.lbGetTalonario,
            region: 'center',
            layout: 'fit',
            loadMask: true,
            // width: 600,
            height: 190,
            //hidden: (action === 'liq') ? false : true,
            stripeRows: true,
            border: false,
            frame: false,
            clicksToEdit: 2,
            store: this.stAnexoGasto,
            autoExpandColumn: 'idcuentaelemento',
            columns: [
                {
                    id: 'idcuentaelemento',
                    header: etiquetas.lbEGasto,
                    dataIndex: 'idcuentaelemento',
                    align: 'left',
                    editor: this.cbxCuenta,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        /* if (!Ext.isEmpty(value)) {
                             var store = this.cbxCuenta.getStore();
                             if (store.getTotalCount()) {
                                 var index = store.find('idcuenta', value);
                                 if (index >= 0) {
                                     var newValue = store.getAt(index).data.text;
                                     record.data.textcuentaelemento = newValue;
                                     return newValue;
                                 }
                             } else return record.data.textcuentaelemento;
                         }*/
                        return record.data.textcuentaelemento;
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
            tbar: [this.btnAddGridAnexo],
            bbar: ['->', new Ext.Toolbar.TextItem('Total:'), this.labelTotal = new Ext.form.Label({
                text: '0.00'
            })]
        });

        this.nfImporteIslaAzul = this.nfImporte.cloneConfig({disabled: false, id: 'importeislaazul'});

        //Grid Anticipo renderizado en el combox----------------------------------
        var me = this;
        this.stAnticipo = new Ext.data.Store({
            url: 'cargarAnticiposPorProveedor',
            autoload: false,
            reader: new Ext.data.JsonReader({
                // root: 'data',
                // totalProperty: 'total'
            }, [{
                name: 'idanticipo'
            }, {
                name: 'numerodocumento'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'importemo'
            }, {
                name: 'pendiente'
            }, {
                name: 'pendienteoriginal', mapping: 'pendiente'
            }])
        });

        this.gpAnticipo = new Ext.grid.GridPanel({
            border: false,
            height: 200,
            split: true,
            autoExpanColunm: 'numerodocumento',
            frame: false,
            loadMask: true,
            viewConfig: {
                forceFit: true
            },
            store: this.stAnticipo,
            sm: this.smGpAnticipo = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [
                {
                    sortable: true,
                    header: 'No. Instrumento',
                    hideable: true,
                    id: 'numerodocumento',
                    dataIndex: 'numerodocumento'
                }, {
                    sortable: true,
                    width: 50,
                    header: 'Fecha',
                    hideable: true,
                    dataIndex: 'fechacreacion'
                }, {
                    header: 'Pendiente',
                    sortable: true,
                    hideable: true,
                    width: 50,
                    dataIndex: 'pendiente',
                    renderer: formatoMoneda
                }
            ]
        });

        this.smGpAnticipo.on('rowselect', function (sm, index, record) {
            me.cbAnticipo.setValue(record.data.idanticipo);
            me.cbAnticipo.setRawValue(record.data.numerodocumento);
            // if (me.action == 'mod' && record.data.idanticipo == me.scope.smRecarga.getSelected().data.idanticipo)
            //     var totalPendiente = parseFloat(record.data.pendiente) + parseFloat(me.scope.smRecarga.getSelected().data.importemo);
            // else totalPendiente = record.data.pendiente;
            // // me.nfImportePendiente.setRawValue(formatoMoneda(totalPendiente));
            // me.nfImportePendiente.setValue(parseFloat(totalPendiente).toFixed(2));
            // me.nfImporte.enable();
            // me.nfImporte.focus();

            me.nfImporteIslaAzul.__proto__.maxValue = record.get('pendiente');
            me.nfImporteIslaAzul.isValid();
            me.cbAnticipo.collapse();
        });

        this.cbAnticipo = new Ext.form.ComboBox({
            id: 'anticipoislaazul',
            fieldLabel: 'No. Instrumento',
            store: this.stCbAnticipo = new Ext.data.SimpleStore({
                fields: [{name: 'idanticipo'}, {name: 'numerodocumento'}],
                data: [[]]
            }),
            valueField: 'idanticipo',
            hiddenName: 'idanticipo',
            mode: 'local',
            displayField: 'numerodocumento',
            disabledClass: 'disabled-component',
            // forceSelection: true,
            allowBlank: false,
            resizable: false,
            // readOnly: true,
            editable: false,
            triggerAction: 'all',
            anchor: '98%',
            tpl: '<div id = \"cmbanticipo\" style = \"height:200px; !important;\"></div>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                expand: function (combo) {
                    if (!this.gpAnticipo.rendered) {
                        this.gpAnticipo.render('cmbanticipo');
                    }
                }
            }

        });
        //---------------------------------------

        this.cbxCuentaIslaAzul = new Ext.contabilidad.util.linkedCombo({
            id: 'cbxCuentaIslaAzul',
            store: this.stCuenta,
            fieldLabel: etiquetas.lbCuentaGasto,
            displayField: 'text',
            valueField: 'idcuenta',
            mode: 'local',
            hideTbar: false,
            listHeight: 200,
            tabIndex: 4,
            // disabled: true,
            listeners: {
                scope: this,
                select: function (cb) {
                    // var index = this.stAnexoGasto.find('idcuentaelemento', cb.getValue());
                    // if (index != -1) {
                    //     mostrarMensaje(1, etiquetas.lbGastoRegistrado);
                    //     cb.reset();
                    // } else {
                    //     this.nfImporte.enable();
                    //     this.nfImporte.focus();
                    // }
                }
            }
        });

        this.cbxTarjetaIzlaAzulGasto = new Ext.form.ComboBox({
            // disabledClass: 'disabled-component',
            // disabled: true,
            id: 'tarjetaislaazulgasto',
            store: this.stTarjetaIslaAzulGasto = new Ext.data.Store({
                baseParams: {
                    'idCaja': scope.idcaja
                },
                url: '/contabilidad/caja/tarjetaotros/index.php/tarjetaotros/cargartarjetas',
                autoLoad: false,
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'idtarjeta'},
                    {name: 'numero'}
                ])
            }),
            // fieldLabel: 'Tarjeta isla azul',
            mode: 'local',
            allowBlank: false,
            displayField: 'numero',
            valueField: 'idtarjeta',
            // listHeight: 300,
            triggerAction: 'all',
            enableKeyEvents: true,
            anchor: '100%',
            forceSelection: true,
            editable: false,
        });

        this.recordDataIslaAzul = Ext.data.Record.create([
            {name: 'idcuentaelemento', type: 'int'},
            {name: 'textcuentaelemento', type: 'string'},
            {name: 'importemo', type: 'float'},
            {name: 'idanticipo', type: 'int'},
            {name: 'numanticipo', type: 'int'},
            {name: 'idtarjeta', type: 'int'},
            {name: 'numtarjeta', type: 'int'},
        ]);

        this.stAnexoIslaAzul = new Ext.data.Store({
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, this.recordDataIslaAzul),
            sortInfo: {field: 'idcuentaelemento', direction: 'DESC'}
        });

        this.roweditorIslaAzul = new Ext.Cont.RowEditor({
            id: 'idRoweditorIslaAzul',
            clicksToEdit: 2,
            cancelText: etiquetas.lbCancelar,
            saveText: etiquetas.lbAceptar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            saveTooltip: etiquetas.lbToolRowEditorAceptar,
            cancelTooltip: etiquetas.lbToolRowEditorCancelar
        });

        this.rowactionIslaAzul = new Ext.grid.RowActions({
            id: 'idRowactionIslaAzul',
            actions: [
                {
                    id: 'eliminarIslaAzul',
                    tooltip: etiquetas.lbToolDel,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        this.btnAddGridIslaAzul = new Ext.Button({
            scope: this,
            text: etiquetas.lbAdicionar,
            iconCls: 'adicionar',
            tooltip: etiquetas.lbToolAdd,
            //icon: this.perfil.dirImg + 'adicionar.png',
            handler: function () {
                var record = new this.recordDataIslaAzul({
                    idcuentaelemento: '',
                    textcuentaelemento: '',
                    importemo: '',
                    idanticipo: '',
                    numanticipo: '',
                    idtarjeta: '',
                    numtarjeta: '',
                });
                this.roweditorIslaAzul.stopEditing();
                var total = this.stAnexoIslaAzul.getCount();
                this.stAnexoIslaAzul.insert(total, record);
                this.gpAnexoIslaAzul.getSelectionModel().selectRow(total);
                this.roweditorIslaAzul.startEditing(total);
            }
        });

        this.gpAnexoIslaAzul = new Ext.grid.EditorGridPanel({
            // title: 'Registro de gastos',//etiquetas.lbGetTalonario,
            region: 'center',
            layout: 'fit',
            loadMask: true,
            // width: 600,
            height: 190,
            //hidden: (action === 'liq') ? false : true,
            stripeRows: true,
            border: false,
            frame: false,
            clicksToEdit: 2,
            store: this.stAnexoIslaAzul,
            autoExpandColumn: 'idcuentaelementoislaazul',
            columns: [
                {
                    id: 'idcuentaelementoislaazul',
                    header: etiquetas.lbEGasto,
                    dataIndex: 'idcuentaelemento',
                    align: 'left',
                    editor: this.cbxCuentaIslaAzul,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return record.data.textcuentaelemento;
                    }.bind(this)
                }, {
                    header: 'Pago anticipado',
                    dataIndex: 'idanticipo',
                    width: 300,
                    align: 'left',
                    editor: this.cbAnticipo,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return record.data.numanticipo;
                    }.bind(this)
                }, {
                    header: 'Tarjeta',
                    dataIndex: 'idtarjeta',
                    align: 'left',
                    width: 200,
                    editor: this.cbxTarjetaIzlaAzulGasto,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return record.data.numtarjeta;
                    }.bind(this)
                }, {
                    header: etiquetas.lbImporte,
                    dataIndex: 'importemo',
                    width: 80,
                    align: 'right',
                    editor: this.nfImporteIslaAzul,
                    renderer: formatoMonedaABS
                },
                this.rowactionIslaAzul
            ],
            plugins: [this.roweditorIslaAzul, this.rowactionIslaAzul],
            sm: this.smAnexoIslaAzul = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            forceFit: true,
            tbar: [this.btnAddGridIslaAzul],
            bbar: ['->', new Ext.Toolbar.TextItem('Total:'), this.labelTotalIslaAzul = new Ext.form.Label({
                text: '0.00'
            })]
        });

        this.nfImporteCargaInicial = new Ext.form.NumberField({
            allowBlank: false,
            disabled: false,
            allowNegative: false,
            fieldLabel: 'Importe',
            anchor: '100%',
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            }
        });

        this.tabgeneral = new Ext.TabPanel({
            activeTab: 0,
            region: 'center',
            height: 200,
            defaults: {
                autoScroll: true
            },
            border: false,
            items: [
                {
                    // id: element.idconf,
                    title: 'Registro de gastos',
                    layout: 'fit',
                    items: this.gpAnexoGasto
                }, {
                    id: 'anexotarjetaislaazul',
                    title: 'Tarjeta isla azul',
                    layout: 'fit',
                    disabled: true,
                    items: this.gpAnexoIslaAzul
                }
            ]
        });

        this.confTAb = cargaInicial == 0 ? {
            labelAlign: 'top',
            layout: 'fit',
            items: [this.tabgeneral]
        } : {};

        if (cargaInicial == 0) {
            this.confLiq = [{
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
            ];
        } else {
            this.confLiq = [{
                style: 'margin:0 0 0 5',
                layout: 'form',
                columnWidth: .16,
                items: [this.dffechaeLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .16,
                items: [this.clocktimeLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .16,
                items: [this.dffecharegresoLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .16,
                items: [this.clocktimeregresoLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .13,
                items: [this.cantDiasLiq]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .13,
                items: [this.cantDiasLiqHosp]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .1,
                items: [this.nfImporteCargaInicial]
            }
            ];
        }

        this.checkGp = new Ext.form.TextField({
            name: 'check',
            allowBlank: false,
            anchor: '100%',
            hidden: true
        });
        //------Liquidacion----------------------------------------------------
        this.fieldSetLiqDieta = new Ext.form.FieldSet({
            labelAlign: 'top',
            // layout: 'column',
            title: etiquetas.lbLiquidacion,
            xtype: 'fieldset',
            //checkboxToggle: (action === 'liq' || action === 'mod') ? false : true,
            //collapsed: true,
            // collapsible: true,
            collapsed: (action === 'liq') ? false : true,
            collapsedCls: 'x-panel-collapsed',
            //height: Ext.lib.Dom.getViewHeight() * 0.39,
            height: '150',
            anchor: '100%',
            items: [
                {
                    labelAlign: 'top',
                    layout: 'column',
                    items: this.confLiq
                }, this.confTAb,
                {
                    hidden: true,
                    items:[!cargaInicial ? this.checkGp : {}]
                }
            ]
        })/* : {}*/;
//------Anticipo-------------------
        this.fieldSetAntDieta = new Ext.form.FieldSet({
            labelAlign: 'top',
            // layout: 'column',
            title: etiquetas.lbAnticipo,
            xtype: 'fieldset',
            collapsedCls: 'x-panel-collapsed',
            //checkboxToggle: (action === 'liq' || action === 'mod') ? false : true,
            collapsed: false,//(action === 'liq') ? true : false,
            //height: Ext.lib.Dom.getViewHeight() * 0.39,
            //hidden: (action === 'liq') ? true : false,
            height: '150',
            anchor: '100%',
            items: [
                {
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: .18,
                        items: [this.dffechae]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .18,
                        items: [this.clocktime]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .18,
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
                    title: 'Efectivo entregado',
                    xtype: 'fieldset',
                    //height: Ext.lib.Dom.getViewHeight() * 0.39,
                    height: '150',
                    anchor: '100%',
                    items: [{
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: .20,
                        items: [this.alimentacion]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .20,
                        items: [this.hospedaje]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .20,
                        items: [this.desayuno]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .20,
                        items: [this.transporte]
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .20,
                        items: [this.totalAnt]
                    }]
                }]
        });

        this.cbxTarjetaIzlaAzul = new Ext.contabilidad.util.linkedCombo({
            // disabledClass: 'disabled-component',
            // disabled: true,
            store: this.stTarjetaIslaAzul = new Ext.data.Store({
                // url: 'obtenerCtaPorNivel',
                // autoLoad: true,
                baseParams: {
                    'idCaja': scope.idcaja
                },
                url: '/contabilidad/caja/tarjetaotros/index.php/tarjetaotros/cargartarjetas',
                autoLoad: false,
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'idtarjeta'},
                    {name: 'numero'}
                ])
            }),
            fieldLabel: 'Tarjeta isla azul',
            loaded: true,
            allowBlank: true,
            singleSelection: false,
            leafSelect: false,
            qtip: 'text',
            displayField: 'numero',
            valueField: 'idtarjeta',
            selectField:'numero',
            listHeight: 300,
            anchor: '100%'
        });

        this.fieldSetIslaAzul = new Ext.form.FieldSet({
            labelAlign: 'top',
            // layout: 'column',
            title: 'Tarjeta entregada',
            xtype: 'fieldset',
            collapsedCls: 'x-panel-collapsed',
            //checkboxToggle: (action === 'liq' || action === 'mod') ? false : true,
            collapsed: true,
            //height: Ext.lib.Dom.getViewHeight() * 0.39,
            //hidden: (action === 'liq') ? true : false,
            height: '150',
            anchor: '100%',
            items: [
                {
                    labelAlign: 'top',
                    layout: 'column',
                    items: [{
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: 1,
                        items: [this.cbxTarjetaIzlaAzul]
                    }]
                }]
        });

        this.fpanel = new Ext.FormPanel({
            maskDisabled: false,
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
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: cargaInicial ? .1 : 0,
                        items: cargaInicial ? this.numTal : {}
                    }, {
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: cargaInicial ? .4 : .5,
                        items: this.cbpersona
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .20,
                        items: this.cbclasificacion
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .15,
                        items: this.dffecha
                    }, {
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        columnWidth: .15,
                        items: [this.dffechaVence]
                    }]
                }, {
                    labelAlign: 'top',
                    layout: 'column',
                    frame: false,
                    border: false,
                    region: 'center',
                    items: [{
                        style: 'margin:0 0 0 5',
                        layout: 'form',
                        columnWidth: 1,
                        items: [this.tflabor]
                    }]
                }, this.fieldSetAntDieta , this.fieldSetLiqDieta , this.fieldSetIslaAzul,
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
            tooltip: etiquetas.toolAceptar,
            iconCls: 'aceptar'
        });

        this.btnConfirmarr = new Ext.Button({
            iconCls: 'confirmar',
            text: 'Confirmar',
            disabled: true,
            // hidden: (this.flujoNormal == 0)
            // tooltip: 'Limpiar los campos',
        });

        this.btnPostearr = new Ext.Button({
            iconCls: 'contabilidad',
            text: 'Postear',
            disabled: true,
            // hidden: (this.flujoNormal == 0)
            // tooltip: 'Limpiar los campos',
        });

        this.btnAprobarAddMod = new Ext.Button({
            text: 'Aprobar',
            disabled: true,
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

        this.panelContenedor = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            border: false,
            items: this.fpanel
        });

        var btns = [];
        if (modoVer) {
            btns = [this.btnAddCerrar];
        } else if (cargaInicial == 1) {
            btns = [this.btnAddCerrar, this.btnNuevo, this.btnAceptar];
        } else if (action === 'add') {
            btns = [this.btnAddCerrar, this.btnNuevo, this.btnAceptar, this.btnConfirmarr, this.btnPostearr];
        } else if (action === 'mod') {
            btns = [this.btnAddCerrar, this.btnAceptar, this.btnConfirmarr, this.btnPostearr];
        } else if (action === 'liq') {
            btns = [this.btnAddCerrar, this.btnAceptar];
        }

        this.winAddMod = new Ext.Window({
            title: (action == 'add') ? etiquetas.lbAnticipoNAcional : etiquetas.lbModAnticipoViajNac,
            layout: 'fit',
            width: 900,
            frame: true,
            border: false,
            autoHeight: true,
            modal: true,
            autoValidate: false,
            resizable: false,
            constrain: true,
            closeAction: 'close',
            items: [this.panelContenedor],
            firstElement: (action != 'liq') ? this.cbpersona: this.dffechaeLiq,
            //bbar: [/*'Días estimados de viaje', this.cantDias, */'->', 'Total dieta: ', this.total],
            bbar: ['->', this.labelDiferencia = new Ext.form.Label({
                name: 'labelDiferencia',
                text: ''
            })],
            buttons: btns
        });
    },
    WindowCancelar: function (etiquetas, fecha) {
        this.obtenerFechaInicio = function (fechaInicio, fechaDocumento) {
            var arrFI = fechaInicio.split('/');
            var arrDO = fechaDocumento.split('/');
            var fechafi = new Date(+arrFI[2], arrFI[1] - 1, +arrFI[0]).setUTCHours(0, 0, 0, 0);
            var fechado = new Date(+arrDO[2], arrDO[1] - 1, +arrDO[0]).setUTCHours(0, 0, 0, 0);
            if (fechafi > fechado) {
                return fechaInicio;
            } else {
                return fechaDocumento;
            }
        };

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
            value: fechaContable,
            minValue: this.obtenerFechaInicio(fechaInicio, fecha),
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
            autoValidate: true,
            border: false,
            autoHeight: true,
            modal: true,
            resizable: false,
            constrain: true,
            closeAction: 'close',
            firstElement: this.cbmotivo,
            items: [this.fpCancelar],
            buttons: [this.btnCancelarCerrar, this.btnCancelarAceptar]
        });
    }
}
