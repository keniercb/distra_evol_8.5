/**
 * GestionarArqueo.View
 *
 * @author Ing. Roberto Linares Zamora
 * @version 1.0
 */
Ext.ns('Caja.Operaciones.Arqueo');
Caja.Operaciones.Arqueo.View = {
    init: function (perfil, etiquetas, model, cargaInicial) {
        this.cargaInicial = cargaInicial;
        this.lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...'
        });

        this.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });

        this.btnAdicionar = new Ext.Button({
            text: etiquetas.lbBtnAdicionar,
            tooltip: etiquetas.lbTooltipBtnAdicionar,
            iconCls: 'adicionar'
        });

        this.btnModificar = new Ext.Button({
            text: etiquetas.lbBtnModificar,
            tooltip: etiquetas.lbTooltipBtnModificar,
            iconCls: 'modificar',
            disabled: true,
        });

        this.btnVer = new Ext.Button({
            // text: etiquetas.lbBtnModificar,
            // tooltip: etiquetas.lbTooltipBtnModificar,
            // iconCls: 'modificar',
            // disabled: true,
        });

        this.btnCancelarDoc = new Ext.Button({
            text: etiquetas.lbBtnCancelar,
            tooltip: etiquetas.lbTooltipBtnCancelar,
            iconCls: 'cancelar',
            disabled: true
        });

        this.btnEliminarDoc = new Ext.Button({
            text: etiquetas.lbEliminar,
            tooltip: etiquetas.lbTooltipBtnEliminar,
            iconCls: 'eliminar',
            disabled: true
        });

        this.btnConfirmar = new Ext.Button({
            text: etiquetas.lbBtnConfirmar,
            tooltip: etiquetas.lbTooltipBtnConfirmar,
            disabled: true,
            iconCls: 'confirmar'
        });

        this.btnContabilizar = new Ext.Button({
            text: etiquetas.lbBtnContabilizar,
            tooltip: etiquetas.lbTooltipBtnContabilizar,
            disabled: true,
            iconCls: 'contabilidad'
        });

        this.btnAvisoDebito = new Ext.Button({
            text: etiquetas.lbBtnAvisoDebito,
            tooltip: etiquetas.lbTooltipBtnAvisoDebito,
            disabled: true,
            iconCls: 'abrir'
        });

        this.btnContabilizarDif = new Ext.Button({
            text: etiquetas.lbBtnContabilizar,
            tooltip: etiquetas.lbTooltipBtnContabilizar,
            disabled: true,
            iconCls: 'contabilidad'
        });

        this.btnReporte = new Ext.Button({
            text: 'Vista <u>r</u>eporte',
            tooltip: 'Vista reporte <b>(Alt + R)</b>',
            tabIndex: 312,
            disabled: true,
            iconCls: 'vistareporte'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaArqueo',
            text: etiquetas.lbAyuda,
            tooltip: etiquetas.lbTooAyuda,
            iconCls: 'ayuda'
        });

        this.btnAyudaCI = new Ext.Button({
            id: 'btnAyudaArqueoCI',
            iconCls: 'ayuda',
            text: etiquetas.lbAyuda,
            tooltip: etiquetas.lbTooAyuda,
        });

        this.tfNumero = new Ext.form.TextField({
            name: 'tfNumero',
            anchor: '100%',
            //maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            //regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            maskRe: /^([0-9])+$/,
            regex: /^([0-9])+$/,
            emptyText: 'Criterio a buscar...',
            blankText: etiquetas.blankText,
            enableKeyEvents: true,
            width: 110,
        });
        this.tfEstado = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: true,
            store: model.stEstado,
            valueField: 'idestado',
            displayField: 'nombre',
            hiddenName: 'idestado',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true,
            hidden: cargaInicial,
            width: 110,
        });
        this.btnBuscar = new Ext.Button({
            text: etiquetas.lbBuscar,
            tooltip: etiquetas.tooltipBuscar,
            //icon: perfil.dirImg + 'buscar.png',
            disabled: true,
            iconCls: 'buscar'
        });

        this.tfFondo = new Ext.form.TextField({
            name: 'tfFondo',
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 170,
            enableKeyEvents: true
        });
        this.btnFondo = new Ext.Button({
            text: 'Fondo',
            tooltip: etiquetas.lbtoolFondo,
            iconCls: 'fondo'
        });

        this.smArqueos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.paginToolbar = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            displayInfo: true,
            clearFilter: true,
            displayMsg: etiquetas.lbDisplayMsg,
            emptyMsg: etiquetas.lbEmptyMsg,
            store: model.stArqueos
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

        this.gridArqueos = new Ext.grid.GridPanel({
            autoExpandColumn: 'idExpandir',
            store: model.stArqueos,
            stripeRows: true,
            loadMask: true,
            border: false,
            // layout: 'fit',
            region: 'center',
            sm: this.smArqueos,
            viewConfig: {
                forceFit: true
            },
            columns: [
                {
                    header: etiquetas.lbNumero,
                    dataIndex: 'numero',
                    width: 20,
                    sortable: true,
                    align: 'left',
                    /*renderer: function (value, metaData, record, rowIndex, colIndex) {
                     if (record.data.cargainicial == '1') {
                     return 'CI-' + value;
                     }
                     else return value;
                     }*/
                }, {
                    header: etiquetas.lbFecha,
                    dataIndex: 'fecha',
                    width: 20,
                    sortable: true,
                    align: 'center'
                }, {
                    width: 50,
                    sortable: true,
                    header: etiquetas.lbRealizado,
                    dataIndex: 'denominacion'
                }, {
                    id: 'idExpandir',
                    sortable: true,
                    header: etiquetas.lbObservacion,
                    dataIndex: 'comentario'
                }, {
                    header: etiquetas.lbImporte,
                    dataIndex: 'importemo',
                    width: 20,
                    sortable: true,
                    align: 'right',
                    renderer: formatoMoneda
                }, {
                    header: etiquetas.lbFaltante,
                    dataIndex: 'diferenciafaltante',
                    width: 20,
                    sortable: true,
                    align: 'right',
                    renderer: formatoMoneda
                }, {
                    header: etiquetas.lbSobrante,
                    dataIndex: 'diferenciasobrante',
                    width: 20,
                    sortable: true,
                    renderer: formatoMoneda,
                    align: 'right'
                }, {
                    header: etiquetas.lbCierre,
                    dataIndex: 'cierre',
                    width: 20,
                    sortable: true,
                    align: 'center'
                }, {
                    header: etiquetas.lbEstado,
                    sortable: true,
                    width: 20,
                    dataIndex: 'nomEstado',
                    // renderer: function (value, metaData, record, rowIndex, colIndex) {
                    //     if (record.data.cargainicial) {
                    //         var index = model.stEstado.find('idestado', 5);
                    //         if (index >= 0) {
                    //             var newValue = model.stEstado.getAt(index).data.nombre;
                    //             return newValue;
                    //         }
                    //     }
                    //     else return value;
                    // }
                }, this.rowaction
                // {
                //     header: etiquetas.lbNoCO,
                //     sortable: true,
                //     width: 20,
                //     dataIndex: 'numcomprobante',
                //     hidden: cargaInicial ? true : false,
                //     hideable: cargaInicial ? false : true,
                // }
            ],
            tbar: [etiquetas.lbNumeroBusc, this.tfNumero, (cargaInicial) ? '' : '-', (cargaInicial) ? '' : etiquetas.lbBuscarEstado, this.tfEstado, '-', this.btnBuscar, '->', Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo],
            bbar: this.paginToolbar,
            plugins: this.rowaction
        });

        this.tfnombreentidad = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'nombreentidad',
            disabled: true,
            anchor: '100%',
            fieldLabel: etiquetas.lbEntidad
        });
//--------------------
        this.tffondo = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'fondo',
            disabled: true,
            anchor: '100%',
            fieldLabel: etiquetas.lbFondoArqueado
        });

        this.tfnumero = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'numero',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            maskRe: /^[0-9]/,
            enableKeyEvents: true,
            anchor: '100%',
            disabled: true,
            fieldLabel: etiquetas.lbNumero
        });

        this.cbcierre = new Ext.form.ComboBox({
            id: "cbcierre",
            editable: false,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            triggerAction: 'all',
            fieldLabel: etiquetas.lbCierre,
            hideLabel: false,
            autoCreate: true,
            mode: 'local',
            emptyText: etiquetas.lbEmptyText,
            selectOnFocus: true,
            value: 0,
            forceSelection: true,
            anchor: '100%',
            store: model.stCierre,
            displayField: 'val',
            valueField: 'cierre',
            hiddenName: 'cierre'
        });

        this.cbcajero = new Ext.form.ComboBox({
            id: 'cbCajeroAdd',
            disabledClass: 'disabled-component',
            fieldLabel: 'Recibido por', //etiquetas.lbCajero,
            name: 'cbcajero',
            emptyText: etiquetas.lbEmptyText,
            store: model.stCajero,
            anchor: '100%',
            selectOnFocus: true,
            valueField: 'idpersona',
            displayField: 'fullname',
            hiddenName: 'idpersona',
            mode: 'local',
            readOnly: true,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            triggerAction: 'all',
            hideTrigger: true
        });
//---------------------
        this.btnCancelar = new Ext.Button({
            id: 'btncancelarR',
            iconCls: 'cancelar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana sin guardar los datos',
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnaplicar',
            iconCls: 'aplicar',
            text: 'Aplicar', //etiquetas.lbAceptar,
            tooltip: 'Guardar datos y limpiar los campos'//etiquetas.tooltipAceptar
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnaceptar',
            iconCls: 'aceptar',
            text: etiquetas.lbAceptar,
            tooltip: etiquetas.tooltipAceptar
        });

        this.panel = new Ext.Panel({
            layout: 'border',
            border: false,
            items: [this.gridArqueos/*, this.pDataArqueo*/], // this.pTipoDocumentos],
            tbar: cargaInicial ? [this.btnAdicionar, this.btnModificar, this.btnEliminarDoc, '->', this.lfdPeriodo, '-', this.btnFondo, this.tfFondo, '-', this.btnAyudaCI] : [this.btnAdicionar, this.btnModificar, this.btnCancelarDoc, this.btnConfirmar/*, this.btnContabilizarDif*/, this.btnReporte, '->', this.lfdPeriodo, this.btnFondo, this.tfFondo, '-', this.btnAyuda]
        });

        new Ext.Viewport({
            layout: 'fit',
            id: 'idViewport',
            items: [this.panel]
        });

    },
    windowAddModArqueo: function (etiquetas, model, controller) {

        this.dffecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: etiquetas.lbFecha,
            name: 'fecha',
            id: 'fechaAdd',
            anchor: '100%',
            allowBlank: false,
            // value: new Date(),
            value: fechaContable,
            minValue: fechaInicio,
            maxValue: fechaFin,
            blankText: 'Este campo es obligatorio.',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            readOnly: false
        });

        this.ckCierre = new Ext.form.Checkbox({
            id: "ckCierre",
            fieldLabel: etiquetas.lbCierre,
            value: 0
        });

        this.tftotalarqueoD = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'totalarqueoD',
            disabled: true,
            anchor: '100%',
            fieldLabel: etiquetas.lbTotalArqueado,
            style: 'text-align: right'
        });

        this.tacomentarioD = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'comentarioD',
            allowBlank: false,
            blankText: "Este campo es obligatorio.",
            anchor: '100%',
            maxLength: 100,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            maxLengthText: "El tamaño máximo requerido es 100 caracteres.",
            fieldLabel: etiquetas.lbObservacion
        });

        this.nfSaldoFondo = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            disabled: true,
            anchor: '100%',
            fieldLabel: controller.tipoMovimiento == 1 ? etiquetas.lbFondoAprob : etiquetas.lbFondoIni,
            style: 'text-align: right'
        });

        this.tfdiferenciaD = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'diferenciaD',
            disabled: true,
            anchor: '100%',
            fieldLabel: 'Diferencia',
            style: 'text-align: right'
        });

        this.btnCerrar = new Ext.Button({
            id: 'btnCerrar',
            iconCls: 'cancelar',
            text: etiquetas.lbCancelar,
            tooltip: etiquetas.tooltipCancelar
        });

        this.btnAceptarForm = new Ext.Button({
            id: 'btnaceptar',
            iconCls: 'aceptar',
            text: etiquetas.lbAceptar,
            tooltip: etiquetas.tooltipAceptar
        });

        this.btnNuevoForm = new Ext.Button({
            text: 'Nuevo',
            tooltip: 'Limpiar los campos',
            iconCls: 'nuevo',
            disabled: true
        });

        this.btnConfirmarForm = new Ext.Button({
            iconCls: 'confirmar',
            text: 'Confirmar',
            disabled: true,
            tooltip: 'Confirmar movimiento'
        });

        //Billetes
        this.nfcantidadbilletes = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            width: 50,
            name: 'cantidadbilletes',
            value: 0,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            maxLength: 16,
            maskRe: /^\d*$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            id: 'cantidadbilletes'
        });

        //gridBilletes--------------------
        this.smBilletes = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpBilletes = new Ext.grid.EditorGridPanel({
            height: Ext.lib.Dom.getViewHeight() * 0.60,
            frame: false,
            border: true,
            title: etiquetas.lbBilletes,
            clicksToEdit: 2,
            anchor: '100%',
            autoExpandColumn: 'expandir',
            store: model.stBilletes,
            sm: this.smBilletes,
            columns: [{
                header: etiquetas.lbCantidad,
                width: 70,
                sortable: true,
                align: 'right',
                dataIndex: 'cantidad',
                editor: this.nfcantidadbilletes
            }, {
                id: 'expandir',
                header: etiquetas.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: etiquetas.lbValor,
                sortable: true,
                dataIndex: 'valor',
                hidden: true
            }, {
                header: etiquetas.lbImporte,
                width: 70,
                sortable: true,
                align: 'right',
                dataIndex: 'importe',
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (!this.nfcantidadbilletes.startValue)
                        this.nfcantidadbilletes.startValue = 0;
                    return controller.calcImporteBilletes(record.data.cantidad, record.data.valor);
                }.bind(this)
            }],
            bbar: ['->', new Ext.Toolbar.TextItem(etiquetas.lbTotalBilletes), this.labelBilletes = new Ext.form.Label({
                name: 'labelBilletes',
                text: '0.00',
                id: 'labelBilletes'
            })]
        });


        //Sellos
        this.nfcantidadSellos = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            width: 50,
            name: 'cantidadSellos',
            value: 0,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            maxLength: 16,
            maskRe: /^\d*$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            id: 'cantidadbilletes'
        });

        //gridSellos--------------------
        this.smSellos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpSellos = new Ext.grid.EditorGridPanel({
            height: Ext.lib.Dom.getViewHeight() * 0.60,
            width: Ext.lib.Dom.getViewWidth() * 0.4,
            frame: false,
            border: true,
            title: etiquetas.lbSellos,
            clicksToEdit: 2,
            anchor: '100%',
            autoExpandColumn: 'expandir',
            store: model.stSellos,
            sm: this.smSellos,
            columns: [{
                header: etiquetas.lbCantidad,
                width: 70,
                sortable: true,
                align: 'right',
                dataIndex: 'cantidad',
                editor: this.nfcantidadSellos
            }, {
                id: 'expandir',
                header: etiquetas.lbDenominacion,
                sortable: true,
                width: 70,
                dataIndex: 'denominacion'
            }, {
                header: etiquetas.lbValor,
                sortable: true,
                dataIndex: 'valor',
                hidden: true
            }, {
                header: etiquetas.lbImporte,
                width: 70,
                sortable: true,
                align: 'right',
                dataIndex: 'importemo',
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (!this.nfcantidadbilletes.startValue)
                        this.nfcantidadbilletes.startValue = 0;
                    return controller.calcImporteSellos(record.data.cantidad, record.data.valor);
                }.bind(this)
            }],
            bbar: ['->', new Ext.Toolbar.TextItem(etiquetas.lbTotalSellos), this.labelSellos = new Ext.form.Label({
                name: 'labelSellos',
                text: '0.00',
                id: 'labelSellos'
            })]
        });

        // Monedas
        this.nfcantidadmonedas = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            width: 50,
            name: 'cantidadmonedas',
            value: 0,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            maxLength: 16,
            maskRe: /^\d*$/,
            maxLengthText: etiquetas.LbCampomaxLengthText24,
            id: 'cantidadmonedas'
        });

        this.smMonedas = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpMonedas = new Ext.grid.EditorGridPanel({
            height: Ext.lib.Dom.getViewHeight() * 0.60,
            title: etiquetas.lbMonedas,
            frame: false,
            border: true,
            store: model.stMonedas,
            anchor: '100%',
            autoExpandColumn: 'expandir',
            sm: this.smMonedas,
            //viewConfig: {forceFit:true},
            columns: [{
                header: etiquetas.lbCantidad,
                width: 70,
                sortable: true,
                align: 'right',
                dataIndex: 'cantidad',
                editor: this.nfcantidadmonedas
            }, {
                id: 'expandir',
                header: etiquetas.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: etiquetas.lbValor,
                sortable: true,
                dataIndex: 'valor',
                hidden: 'true'
            }, {
                header: etiquetas.lbImporte,
                width: 70,
                sortable: true,
                align: 'right',
                dataIndex: 'importe',
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (!this.nfcantidadmonedas.startValue)
                        this.nfcantidadmonedas.startValue = 0;
                    return controller.calcImporteMonedas(record.data.cantidad, record.data.valor);
                }.bind(this)
            }],
            bbar: ['->', new Ext.Toolbar.TextItem(etiquetas.lbTotalMonedas), this.labelMonedas = new Ext.form.Label({
                name: 'labelMonedas',
                text: '0.00',
                id: 'labelMonedas'
            })]
        });

        this.smInstrumentos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gpInstrumento = new Ext.grid.EditorGridPanel({
            id: 'gpinstrumento',
            title: etiquetas.lbDocumentoValor,
            store: model.stInstrumentos,
            loadMask: 'Cargando datos ...',
            autoExpandColumn: 'idexpandir',
            anchor: '100%',
            frame: false,
            border: true,
            sm: this.smInstrumentos,
            height: Ext.lib.Dom.getViewHeight() * 0.60,
            region: 'center',
            view: new Ext.grid.GroupingView({
                hideGroupedColumn: true,
                groupTextTpl: "{[values.rs[0].data.numDocMov]}"
                //groupTextTpl:  controller.tipoFondo != 1 ? "{[values.rs[0].data.nomtipodocumento]} No. {[values.rs[0].data.numDocMov]}" : "{[values.rs[0].data.nomtipodocumento]}"
            }),
            columns: [this.smInstrumentos,
                {
                    header: etiquetas.lbNumeroDoc,
                    width: 100,
                    sortable: true,
                    dataIndex: 'numero'
                }, {
                    header: etiquetas.lbObservacion,
                    id: 'idexpandir',
                    sortable: true,
                    dataIndex: 'comentario'
                },/*{
                    sortable: true,
                    dataIndex: 'numDocMov',
                    hideable: false
                },*/{
                    sortable: true,
                    dataIndex: 'numero_mov',
                    hideable: false
                }, {
                    hidden: true,
                    sortable: true,
                    dataIndex: 'iddocumentoarqueo',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (record.data.iddocumentoarqueo) {
                            this.smInstrumentos.selectRow(rowIndex, true);
                        }
                    }.bind(this)
                }, {
                    header: etiquetas.lbFecha,
                    width: 70,
                    sortable: true,
                    dataIndex: 'fecha'
                }, {
                    header: etiquetas.lbImporte,
                    width: 70,
                    sortable: true,
                    dataIndex: 'importe',
                    align: 'right',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        return formatoMonedaABS(value);
                    }
                }],
            bbar: [/*etiquetas.lbTotalEfectivo, this.labelEfectivo = new Ext.form.Label({
             name: 'labelEfectivo',
             id: 'labelEfectivo',
             text: '0.00'
             }),*/
                '->', new Ext.Toolbar.TextItem(etiquetas.lbTotalDoc), this.labelDocument = new Ext.form.Label({
                    name: 'labelDocument',
                    //id: 'labelDocument',
                    text: '0.00'
                })]
        });

        this.pDatosDocumentos = new Ext.form.FormPanel({
            maskDisabled: false,
            region: 'east',
            border: false,
            layout: 'form',
            labelAlign: 'top',
            frame: false,
            //height: (Ext.lib.Dom.getViewHeight()) * 0.2,
            //autoHeight: true,
            items: [{
                layout: 'column',
                items: [{
                    style: 'margin:10 0 0 5',
                    columnWidth: .12,
                    layout: 'form',
                    items: this.dffecha
                }, {
                    columnWidth: .12,
                    layout: 'form',
                    style: 'margin:10 0 0 5',
                    items: this.tftotalarqueoD
                }, {
                    style: 'margin:10 0 0 5',
                    columnWidth: .12,
                    layout: 'form',
                    items: this.nfSaldoFondo
                }, {
                    style: 'margin:10 0 0 5',
                    columnWidth: .10,
                    layout: 'form',
                    items: this.tfdiferenciaD
                }, {
                    style: 'margin:10 0 0 5',
                    columnWidth: .49,
                    layout: 'form',
                    items: this.tacomentarioD
                }, {
                    style: 'margin:10 0 0 5',
                    columnWidth: .05,
                    layout: 'form',
                    items: this.ckCierre
                }]
            }]
        });

        this.pDataArqueo = new Ext.Panel({
            region: 'south',
            border: false,
            layout: 'form',
            frame: true,
            autoHeight: true,
            items: [{
                layout: 'column',
                frame: false,
                border: false,
                items: [{
                    border: false,
                    labelAlign: 'top',
                    // columnWidth: controller.tipoFondo != 1 && controller.tipoFondo != 3 ? .50 : .30,
                    columnWidth: controller.idFormaPago == 3 ? 1 : (controller.idFormaPago == 2 || controller.tipoFondo == 5 || controller.tipoFondo == 4) ? .50 : .30,
                    layout: 'form',
                    hidden: (controller.idFormaPago == 2) ? true : false,//1-Efectivo, 2-Cheque, 3-Sello
                    items: (controller.idFormaPago == 3) ? this.gpSellos : this.gpBilletes
                }, {
                    border: false,
                    labelAlign: 'top',
                    style: 'margin:0 0 0 10',
                    // columnWidth: controller.tipoFondo != 1 && controller.tipoFondo != 3 ? .50 : .30,
                    columnWidth: (controller.idFormaPago == 2 || controller.tipoFondo == 5 || controller.tipoFondo == 4) ? .50 : .30,
                    layout: 'form',
                    hidden: (controller.idFormaPago == 2 || controller.idFormaPago == 3) ? true : false,//1-Efectivo, 2-Cheque
                    items: this.gpMonedas
                }, {
                    border: false,
                    labelAlign: 'top',
                    style: 'margin:0 0 0 10',
                    columnWidth: (controller.idFormaPago == 2 || controller.idFormaPago == 3) ? 1 : .40,
                    layout: 'form',
                    //hidden: (controller.idFormaPago == 2 || controller.tipoFondo == 1 || controller.tipoFondo == 3) ? false : true,//1-Efectivo, 2-Cheque (Mostrar solo cuando sea forma de pago cheque o fonde de pagos menores(para lso documentos pendientes a reembolsar))
                    hidden: (controller.idFormaPago == 3 || controller.tipoFondo == 5 || controller.tipoFondo == 4), //Mostrar solo cuando sea forma de pago cheque o fondo de pagos menores(para los documentos pendientes a reembolsar))
                    items: this.gpInstrumento
                }/*, {
                 border: false,
                 labelAlign: 'top',
                 style: 'margin:0 0 0 10',
                 columnWidth: .2,
                 layout: 'form',
                 items: this.pDatosDocumentos
                 }*/]
            }, this.pDatosDocumentos]
        });

        var btns = [];
        if (controller.accion == 'ver') {
            btns = [this.btnCerrar];
        } else if (this.cargaInicial == 1) {
            btns = [this.btnCerrar, this.btnAceptarForm];
        } else if (controller.accion == 'add') {
            btns = [this.btnCerrar, this.btnNuevoForm, this.btnAceptarForm, this.btnConfirmarForm];
        } else if (controller.accion == 'mod') {
            btns = [this.btnCerrar, this.btnAceptarForm, this.btnConfirmarForm];
        }

        this.winAddArqueo = new Ext.Window({
            title: 'Adicionar arqueo',
            //layout: 'border',
            //width: Ext.lib.Dom.getViewWidth(),
            // width: (controller.idFormaPago == 1 && (controller.tipoFondo == 1 || controller.tipoFondo == 3)) ? 1200 : 900,
            width: (controller.idFormaPago == 1 && (controller.tipoFondo != 5 || controller.tipoFondo != 4)) ? 1200 : 900,
            //height: 500,
            autoValidate: false,
            // height: (Ext.lib.Dom.getViewHeight() - 10) * 0.8,
            constrain: true,
            border: false,
            modal: true,
            closable: true,
            resizable: false,
            closeAction: 'close',
            firstElement: this.dffecha,
            items: [this.pDataArqueo],
            buttons: btns
        });
        controller.initEventWinAddMod(this, controller, etiquetas, model);
    },
    Window: function (etiquetas, action) {
        this.winTalonario = new Ext.Window({
            title: 'Adicionar arqueo',
            layout: 'border',
            width: Ext.lib.Dom.getViewWidth(),
            height: 600,
            autoValidate: true,
            constrain: true,
            border: false,
            modal: true,
            closable: true,
            items: [this.pNorth, this.pTipoDocumentos]
        });
    },
    windowCacelar: function (etiquetas, model, fecha) {
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

        this.btnAceptarCancel = new Ext.Button({
            text: etiquetas.lbAceptar,
            tooltip: etiquetas.tooltipAceptar,
            iconCls: 'aceptar'
        });

        this.btnCancelarCancel = new Ext.Button({
            text: "Cancelar",
            tooltip: etiquetas.tooltipCancelar,
            iconCls: 'cancelar'
        });

        this.cbxmotivo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            editable: true,
            width: 30,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            store: model.stMotivo,
            valueField: 'idmotivocancelacion',
            displayField: 'motivo',
            hiddenName: 'idmotivocancelacion',
            selectOnFocus: true,
            resizable: true,
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            fieldLabel: etiquetas.lbMotCancelacion,
            anchor: '100%',
            //tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
            enableKeyEvents: true
        });

        this.dffechac = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Fecha',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            width: 248,
            anchor: '100%',
            readOnly: false,
            value: new Date(),
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            // minValue: fecha,
            value: fechaContable,
            minValue: this.obtenerFechaInicio(fechaInicio, fecha),
            maxValue: fechaFin,
            editable: true
        });

        this.pcancelacion = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'pcancelacion',
            region: 'north',
            autoHeight: true,
            frame: true,
            items: [this.cbxmotivo, this.dffechac]
        });

        this.winCancelar = new Ext.Window({
            title: etiquetas.lbWinCancelar,
            frame: true,
            border: false,
            modal: true,
            width: 300,
            autoValidate: true,
            closeAction: 'hide',
            autoHeight: true,
            layout: 'fit',
            resizable: false,
            firstElement: this.cbxmotivo,
            items: [this.pcancelacion],
            buttons: [this.btnCancelarCancel, this.btnAceptarCancel]
        });
    }
};

//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil;
perfil.etiquetas = Object();

Caja.Operaciones.NewArqueo = Ext.extend(Ext.Component, {
    constructor: function (cargaInicial) {
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            callback: function (options, success, response) {
                var etiquetas = Ext.decode(response.responseText);
                Ext.Msg.wait(etiquetas.lbCargando, etiquetas.lbEspere);
                Ext.Ajax.request({
                    url: 'loadDataIni',
                    callback: function (options, success, response) {
                        if (success) {
                            var response = Ext.decode(response.responseText);
                            fechaContable = response.dataFecha.fechacontable;
                            periodoActual = response.dataFecha.nombre;
                            fechaInicio = response.dataFecha.inicio;
                            fechaFin = response.dataFecha.fin;
                            ejercicioActual = response.ejercicio;
                            //estructura = cd.estructura;

                            //Inicializar el modelo
                            var model = Caja.Operaciones.Arqueo.Model;
                            model.init();

                            //Inicializar la vista.
                            var view = Caja.Operaciones.Arqueo.View;
                            view.init(perfil, etiquetas, model, cargaInicial);

                            if (response.aperturado == 1 && cargaInicial == 1) {
                                //view.panel.disable();
                                mostrarMensaje(1, etiquetas.lbCargaInicialCerrada, function (btn) {
                                    //if (btn == 'ok' || btn == 'cencel')
                                        view.panel.disable();
                                });
                                return;
                            }
                            if (response.aperturado != 1 && cargaInicial != 1) {
                                //view.panel.disable();
                                mostrarMensaje(1, etiquetas.lbCargaInicial, function (btn) {
                                    //if (btn == 'ok' || btn == 'cencel')
                                        view.panel.disable();
                                });
                                return;
                            }

                            //Inicializar controlador.
                            controller = Caja.Operaciones.Arqueo.Controller;
                            controller.init(perfil, etiquetas, view, model, cargaInicial);
                            // view.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                            view.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
                            //Ext.Msg.hide();
                        }
                    }
                });
            }
        });
    }
});
