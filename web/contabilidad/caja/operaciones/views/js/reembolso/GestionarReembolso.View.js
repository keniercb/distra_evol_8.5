/**
 * GestionarReembolso.View
 *
 * @author Ing. Roberto Linares Zamora
 * @version 1.0
 */


Ext.ns('Caja.Operaciones.Reembolso');
Caja.Operaciones.Reembolso.View = {
    init: function (perfil, etiquetas, model, contabilizaReembolso) {
        this.array = Array(1, 2, 3, 4);

        this.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });

        this.btnAdicionar = new Ext.Button({
            text: etiquetas.lbAdicionar,
            tooltip: etiquetas.lbTooAdicionar,
            iconCls: 'adicionar',
            disabled: true
        });

        this.btnModificar = new Ext.Button({
            text: etiquetas.lbModificar,
            tooltip: etiquetas.lbTooModificar,
            disabled: true,
            iconCls: 'modificar'
        });

        this.btnCancelar = new Ext.Button({
            text: etiquetas.lbAnular,
            tooltip: etiquetas.lbTooCancelar,
            disabled: true,
            iconCls: 'cancelar'
        });

        this.btnConfirmar = new Ext.Button({
            text: etiquetas.lbConfirmar,
            tooltip: etiquetas.lbTooConfirmar,
            //icon: perfil.dirImg + 'confirmar.png',
            disabled: true,
            iconCls: 'confirmar'
        });

        this.btnContabilizar = new Ext.Button({
            text: etiquetas.lbContabilizar,
            tooltip: etiquetas.lbTooContabilizar,
            disabled: true,
            hidden: true,
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
            id: 'btnAyudaReembolso',
            text: etiquetas.lbAyuda,
            tooltip: etiquetas.lbTooAyuda,
            iconCls: 'ayuda'
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
            tooltip: etiquetas.lbTtpCajaFondo,
            iconCls: 'fondo'
        });

        this.tfNumero = new Ext.form.TextField({
            name: 'tfNumero',
            anchor: '100%',
            maskRe: /^([0-9])+$/,
            regex: /^([0-9])+$/,
            blankText: etiquetas.blankText,
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            width: 110,
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
            triggerAction: 'all',
            enableKeyEvents: true,
            width: 110,
        });
        this.btnBuscar = new Ext.Button({
            text: etiquetas.lbBuscar,
            tooltip: etiquetas.tooltipBuscar,
            disabled: true,
            iconCls: 'buscar'
        });

        this.smReemb = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.paginToolbar = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            displayInfo: true,
            clearFilter: true,
            displayMsg: etiquetas.lbDisplayMsg,
            emptyMsg: etiquetas.lbEmptyMsg,
            firstText: etiquetas.lbPrimeraPagina,
            lastText: etiquetas.lbUltimaPagina,
            store: model.stReembolso
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

        this.gridReembolso = new Ext.grid.GridPanel({
            store: model.stReembolso,
            stripeRows: true,
            loadMask: true,
            border: false,
            layout: 'fit',
            autoExpandColumn: 'expandir',
            forceFit: true,
            viewConfig: {
                forceFit: true
            },
            sm: this.smReemb,
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'iddocumento'
                }, {
                    header: etiquetas.lbNumero,
                    dataIndex: 'numero',
                    width: 20,
                    sortable: true
                }, {
                    header: etiquetas.lbfecha,
                    dataIndex: 'fecha',
                    width: 20,
                    sortable: true,
                    renderer: 'erpFecha'
                }, {
                    header: etiquetas.lbTipodocumento,
                    dataIndex: 'tipodoc',
                    sortable: true,
                    width: 50
                }, {
                    //id: 'tipodocumento',
                    id: 'expandir',
                    header: etiquetas.lbObservacion,
                    dataIndex: 'comentario',
                    sortable: true
                }, {
                    header: etiquetas.lbStatus,
                    dataIndex: 'estado',
                    width: 20,
                    sortable: true
                }, {
                    header: 'Estado en Banco',
                    dataIndex: 'estadoEnBanco',
                    hidden: contabilizaReembolso ? true: false,
                    width: 20,
                    sortable: true,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (value != null) {
                            if (value == 1 || value == 5)
                                return 'Pendiente a reembolsar';
                            else if (value == 6)
                                return 'Reembolsado';
                            else '';
                        }
                    }
                }, {
                    header: etiquetas.lbImporte,
                    sortable: true,
                    dataIndex: 'importemo',
                    width: 20,
                    renderer: formatoMonedaABS,
                    align: 'right'
                },
                // {
                //     header: etiquetas.lbNoComprobante,
                //     id: 'numcomprobante',
                //     width: 20,
                //     dataIndex: 'numcomprobante',
                //     sortable: true,
                //     align: 'right'
                // },
                this.rowaction
            ],
            tbar: [etiquetas.lbNumeroBusc, this.tfNumero, '-', etiquetas.lbEstadoBusc, this.cbEstado, '-', this.btnBuscar, '->', Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo],
            bbar: this.paginToolbar,
            plugins: this.rowaction
        });

        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            items: [this.gridReembolso],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnCancelar, this.btnConfirmar, this.btnContabilizar, this.btnReporte, '->', this.lfdPeriodo, '-', this.btnFondo, this.tfFondo, '-', this.btnAyuda]
        });

        new Ext.Viewport({
            layout: 'fit',
            items: [this.panel]
        });
    },
    Window: function (etiquetas, model, scope, contabilizaReembolso) {
        this.btnCancelarWin = new Ext.Button({
            text: etiquetas.lbCancelar,
            tooltip: etiquetas.lbtoolCancelar,
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar'
        });

        this.btnAceptar = new Ext.Button({
            text: etiquetas.lbAceptar,
            tooltip: etiquetas.lbtooAceptar,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true
        });

        this.btnNuevo = new Ext.Button({
            text: 'Nuevo',
            tooltip: 'Limpiar los campos',
            iconCls: 'nuevo',
            disabled: true
        });

        this.btnConfirmarr = new Ext.Button({
            iconCls: 'confirmar',
            text: 'Confirmar',
            disabled: true,
            tooltip: 'Confirmar movimiento',
        });

        this.btnPostear = new Ext.Button({
            iconCls: 'contabilidad',
            text: 'Postear',
            disabled: true,
            tooltip: 'Postear movimiento',
        });

        this.tacomentario = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            name: 'tacometario',
            id: 'tacometario',
            maxLength: 100,
            maxLengthText: etiquetas.lbMaximo100Caracteres,
            fieldLabel: etiquetas.lbObservacion,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            //width:300,
            allowBlank: false,
            enableKeyEvents: true,
            anchor: '100%'
        });

        this.dfFecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            name: 'fechaem',
            // fieldLabel: etiquetas.lbTooFechaSolicitud,
            fieldLabel: etiquetas.lbfecha,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            allowBlank: false,
            // maxValue: new Date(),
            value: fechaContable,
            minValue: fechaInicio,
            maxValue: fechaFin,
            readOnly: true,
            anchor: '95%'
            //width: 150
        });

        //Si no está activo el subsistema de Banco hay que contabilizar el reembolso
        if (contabilizaReembolso) {
            this.stCuentaCont = new Ext.data.Store({
                url: 'loadDataCuentaOperacion',
                sortInfo: {
                    field: 'nomcuenta',
                    direction: "ASC"
                },
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [{
                    name: 'idcuenta'
                }, {
                    name: 'nomcuenta'
                }
                ]),
                baseParams: {
                    idmoneda: scope.idmonedaEntidad,
                },
                autoLoad: true
            });

            this.cbCuentaCont = new Ext.form.ComboBox({
                fieldLabel: 'Cuenta',
                store: this.stCuentaCont,
                name: 'cbAddInstFormaPago',
                valueField: 'idcuenta',
                hiddenName: 'idcuenta',
                displayField: 'nomcuenta',
                emptyText: 'Seleccione...',
                disabledClass: 'disabled-component',
                editable: false,
                forceSelection: true,
                allowBlank: false,
                // blankText: this.idioma.lbBlankText,
                resizable: true,
                triggerAction: 'all',
                anchor: '95%',
                mode: 'local'
            });
            var btn = [this.btnCancelarWin, this.btnNuevo, this.btnAceptar, this.btnConfirmarr, this.btnPostear];
        } else {
            var btn = [this.btnCancelarWin, this.btnNuevo, this.btnAceptar, this.btnConfirmarr];
        }

        this.panelsur = new Ext.FormPanel({
            labelAlign: 'top',
            //height: 65,
            autoHeight: true,
            frame: true,
            region: 'south',
            layout: 'fit',
            items: contabilizaReembolso ? [{
                layout: 'column',
                items: [{
                    columnWidth: .12,
                    layout: 'form',
                    items: [this.dfFecha]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [this.cbCuentaCont]
                }, {
                    columnWidth: .68,
                    layout: 'form',
                    items: [this.tacomentario]
                }]
            }] : [{
                layout: 'column',
                items: [{
                    columnWidth: .12,
                    layout: 'form',
                    items: [this.dfFecha]
                }, {
                    columnWidth: .88,
                    layout: 'form',
                    margin: '0 0 0 0 10',
                    items: [this.tacomentario]
                }]
            }]
        });

        this.tftotal = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'idtotal',
            name: 'total',
            value: '',
            width: 150,
            disabled: true,
            allowBlank: false
        });

        this.smDocumento = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpDocumento = new Ext.grid.GridPanel({
            id: 'gpDocumentos',
            store: model.stDocumento,
            stripeRows: true,
            autoScroll: true,
            loadMask: true,
            region: 'center',
            autoExpandColumn: 'idexpandir',
            sm: this.smDocumento,
            forceFit: true,
            //viewConfig: {
            //    forceFit: true
            //},
            columns: [
                this.smDocumento,
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'iddocumento',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (record.data.marcar)
                            this.smDocumento.selectRow(rowIndex, true);
                    }.bind(this)
                }, {
                    header: etiquetas.lbflnumero,
                    dataIndex: 'numero',
                    width: 100,
                    sortable: true,
                    hideable: true,
                    resisable: false
                }, {
                    header: etiquetas.lbfecha,
                    dataIndex: 'fecha',
                    width: 100,
                    sortable: true,
                    hideable: true,
                    renderer: 'erpFecha',
                    resisable: false
                }, {
                    header: etiquetas.lbTipodocumento,
                    dataIndex: 'tipodoc',
                    id: 'idexpandir',
                    sortable: true,
                    hideable: true,
                }, {
                    header: etiquetas.lbImporte,
                    id: 'importe',
                    sortable: true,
                    hideable: true,
                    dataIndex: 'importe',
                    width: 100,
                    align: 'right',
                    renderer: formatoMonedaABS
                }
            ],
            bbar: [/*this.paginToolbar = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: false,
                clearFilter: false,
                displayMsg: etiquetas.lbDisplayMsg,
                emptyMsg: etiquetas.lbEmptyMsg,
                firstText: etiquetas.lbPrimeraPagina,
                lastText: etiquetas.lbUltimaPagina,
                store: model.stDocumento}),*/
                '->', 'Importe Total:', this.labelTotal = new Ext.form.Label({
                    name: 'labelTotal',
                    id: 'labelTotal',
                    text: '0.00'
                })]
        });

        this.tfFondo = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            disabled: true,
            name: 'entidad',
            fieldLabel: etiquetas.lbFondo,
            allowBlank: false,
            //anchor:'100%'
            width: 200
        });

        Ext.apply(Ext.form.VTypes, {
            daterange: function (val, field) {
                var date = field.parseDate(val);

                if (!date) {
                    return;
                }
                if (field.startDateField
                    && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                    var start = Ext.getCmp(field.startDateField);
                    start.setMaxValue(date);
                    start.validate();
                    this.dateRangeMax = date;
                } else if (field.endDateField
                    && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                    var end = Ext.getCmp(field.endDateField);
                    end.setMinValue(date);
                    end.validate();
                    this.dateRangeMin = date;
                }
                return true;
            }
        });

        this.dfdesde = new Ext.form.DateField({
            id: 'dfdesde',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            name: 'fdesde',
            fieldLabel: etiquetas.lbDesde,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            allowBlank: false,
            readOnly: true,
            maxValue: new Date(),
            endDateField: 'dfhasta',
            vtype: 'daterange',
            width: 150
        });

        this.dfhasta = new Ext.form.DateField({
            id: 'dfhasta',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            name: 'fhasta',
            fieldLabel: etiquetas.lbHasta,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            allowBlank: false,
            readOnly: true,
            vtype: 'daterange',
            maxValue: new Date(),
            startDateField: 'dfdesde',
            //anchor:'100%'
            width: 150
        });

        this.btnBuscarAdd = new Ext.Button({
            id: 'btnBuscarAdd',
            text: etiquetas.lbBuscarAdd,
            //icon: perfil.dirImg + 'buscar.png',
            iconCls: 'buscar',
            //disabled: true,
            tooltip: etiquetas.lbTooBuscarporParametros
        });

        this.pgeneral = new Ext.Panel({
            frame: false,
            layout: 'border',
            items: [this.gpDocumento, this.panelsur],
            //tbar: [/*etiquetas.lbFondoText, this.tfFondo,*/ etiquetas.lbDesde, this.dfdesde, etiquetas.lbHasta, this.dfhasta, this.btnBuscarAdd, '->', etiquetas.lbfecha, this.dfFecha]
        });

        this.winAddReembolso = new Ext.Window({
            title: etiquetas.lbAdicionarSolicitudReembolso,
            layout: 'fit',
            width: 850,
            height: 550,
            frame: true,
            modal: true,
            autoValidate: true,
            resizable: true,
            constrain: true,
            closable: true,
            items: [this.pgeneral],
            firstElement: this.dfFecha,
            buttons: btn
        });
    },
    daterange: function (df) {
        var date = field.parseDate(val), otherFieldProp, dateProp, other;

        if (field.startDateField) {
            otherFieldProp = 'startDateField';
            dateProp = 'max';
        } else if (field.endDateField) {
            otherFieldProp = 'endDateField';
            dateProp = 'min';
        }
    },
    windowCacelar: function (etiquetas, fecha, model) {
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
            tooltip: etiquetas.lbtooAceptar,
            iconCls: 'aceptar'
        });

        this.btnCancelarCancel = new Ext.Button({
            text: "Cancelar",
            tooltip: etiquetas.lbtoolCancelar,
            iconCls: 'cancelar'
        });

        this.cbxmotivo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            editable: false,
            width: 50,
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
            emptyText: 'Seleccione...',
            fieldLabel: etiquetas.lbmotivoCancelacion,
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
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
            allowBlank: false,
            value: fechaContable,
            minValue: this.obtenerFechaInicio(fechaInicio, fecha),
            maxValue: fechaFin,
            blankText: 'Este campo es obligatorio.',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
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
            title: etiquetas.lbTitleWinCancelar,
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
                    var contabilizaReembolso = response.contabiliza;

                    //Inicializar el modelo
                    var model = Caja.Operaciones.Reembolso.Model;
                    model.init();

                    //Inicializar la vista.
                    var view = Caja.Operaciones.Reembolso.View;
                    view.init(perfil, etiquetas, model, contabilizaReembolso);

                    if (response.aperturado == 0) {
                        view.panel.disable();
                        mostrarMensaje(1, etiquetas.lbCargaInicial, function (btn) {
                            if (btn == 'ok' || btn == 'cencel')
                                view.panel.disable();
                        });
                        return;
                    }

                    //Verifcar si banco no esta activo para mostrar la opcion de contabilizar
                    if (contabilizaReembolso) {
                        view.btnContabilizar.setVisible(true);
                    }

                    //Inicializar controlador.
                    var controller = Caja.Operaciones.Reembolso.Controller;
                    controller.init(perfil, etiquetas, view, model, contabilizaReembolso);
                    view.btnFondo.fireEvent('click');

                    view.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
                    // view.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                    Ext.Msg.hide();
                }
            }
        });
    }
});
