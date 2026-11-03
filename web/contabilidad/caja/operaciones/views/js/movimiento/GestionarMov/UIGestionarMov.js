Ext.namespace('Ext.UIGestionarMov');
Ext.UIGestionarMov.ViewPort = Ext.extend(Ext.Viewport, {
    etiquetas: undefined,
    constructor: function (scope, params) {
        Ext.applyIf(this, {
            renderTo: document.body,
            layout: 'fit'
        });
        return Ext.UIGestionarMov.ViewPort.superclass.constructor.call(this, params);
    }
});

Ext.UIGestionarMov.loadMask = function (body, msg) {
    return new Ext.LoadMask(body, {
        msg: msg
    });
};

Ext.UIGestionarMov.pnlContenedor = Ext.extend(Ext.Panel, {
    constructor: function (scope, titulo) {
        Ext.applyIf(this, {
            layout: 'fit',
            border: false,
            id: 'idPanelGeneral',
            items: [scope.gpRegistroMov = this.fGetGridMov(scope)]
        });
        this.createButons(scope);
        return this;
    },
    createButons: function (scope) {
        scope.btnAdicionarMov = new Ext.Button({
            text: scope.etiquetas.lbBtnAdicionar,
            tooltip: scope.etiquetas.tpAdicionar,
            tabIndex: 312,
            hidden: true,
            //icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar'
        });

        scope.btnModificarMov = new Ext.Button({
            text: scope.etiquetas.lbBtnModificar,
            tooltip: scope.etiquetas.tpModificar,
            tabIndex: 312,
            hidden: true,
            disabled: true,
            //icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar'
        });

        scope.btnCancelarMov = new Ext.Button({
            text: scope.etiquetas.lbBtnAnular,
            tooltip: scope.etiquetas.tpCancelar,
            tabIndex: 312,
            hidden: true,
            disabled: true,
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar'
        });

        scope.btnEliminarMov = new Ext.Button({
            text: scope.etiquetas.lbBtnEliminar,
            tooltip: scope.etiquetas.tpEliminar,
            tabIndex: 312,
            hidden: true,
            disabled: true,
            //icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar'
        });
        scope.btnImportar = new Ext.Button({
            id:'btnImportar',
            text:'Importar',
            tooltip: 'Importar Dieta Nacional',
            //hidden: (this.aperturadoCaja == 0) ? true : false,
            tabIndex: 314,
            iconCls: 'importar',
            hidden:scope.cargaInicial ? 0 : 1
        })
        scope.btnConfirmarMov = new Ext.Button({
            text: scope.etiquetas.lbBtnConfirmar,
            tooltip: scope.etiquetas.tpConfirmar,
            tabIndex: 312,
            hidden: true,
            disabled: true,
            //icon: perfil.dirImg + 'confirmar.png',
            iconCls: 'confirmar'
        });

        scope.btnContabilizarMov = new Ext.Button({
            text: scope.etiquetas.lbBtnContabilizar,
            tooltip: scope.etiquetas.tpContabilizar,
            tabIndex: 312,
            hidden: true,
            disabled: true,
            iconCls: 'contabilidad'
        });

        scope.btnAvisoDebitoMov = new Ext.Button({
            text: scope.etiquetas.lbAvisoDebito,
            tooltip: scope.etiquetas.lbTtpAvisoDebito,
            tabIndex: 312,
            disabled: true,
            //icon: perfil.dirImg + 'imprimir.png',
            iconCls: 'imprimir'
        });

        scope.btnReporte = new Ext.Button({
            text: scope.etiquetas.lbBtnVistaReporte,
            tooltip: scope.etiquetas.tpVistaReporte,
            tabIndex: 312,
            disabled: true,
            iconCls: 'vistareporte'
        });

        scope.btnDefinirFondo = new Ext.Button({
            text: scope.etiquetas.lbFondo,
            tooltip: scope.etiquetas.lbTtpCajaFondo,
            tabIndex: 312,
            //icon: perfil.dirImg + 'abrirventana.png',
            iconCls: 'fondo'
        });

        scope.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });

        scope.btnVerMov = new Ext.Button({
            text: scope.etiquetas.lbBtnVer,
            // tooltip: scope.etiquetas.tpVer,
            tabIndex: 312,
            disabled: true,
            iconCls: 'ver'
        });

        scope.btnGraficarMov = new Ext.Button({
            text: scope.etiquetas.lbBtnGraficar,
            tooltip: scope.etiquetas.tpGraficar,
            tabIndex: 313,
            //icon: perfil.dirImg + 'planificacion.png',
            iconCls: 'planificacion'
        });
        //Boton para busqueda avanzada
        scope.btnBuscarMov = new Ext.Button({
            text: scope.etiquetas.lbBuscarAvanz,
            tooltip: scope.etiquetas.lbToolBuscarAvanz,
            tabIndex: 312,
            iconCls: 'buscaravanzada',
            hidden: scope.cargaInicial
        });
        scope.btnAyuda = new Ext.Button({
            id: 'btnAyudaMovimiento',
            iconCls: 'ayuda',
            text: scope.etiquetas.lbBtnAyuda,
            tooltip: scope.etiquetas.tpAyuda,
            hidden: scope.cargaInicial
        });
        scope.btnAyudaCI = new Ext.Button({
            id: 'btnAyudaMovimientoCI',
            iconCls: 'ayuda',
            text: scope.etiquetas.lbBtnAyuda,
            tooltip: scope.etiquetas.tpAyuda,
            hidden: !scope.cargaInicial
        });

        scope.tfFondoActual = new Ext.form.TextField({
            id: 'tfFondoActual',
            name: 'idfondo',
            allowBlank: false,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '100%',
            maxLength: 100,
            editable: false,
            disabled: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        this.tbar = new Ext.Toolbar({
            hidden: false,
            items: [scope.btnAdicionarMov, scope.btnModificarMov, scope.btnCancelarMov, scope.btnEliminarMov,scope.btnImportar, scope.btnConfirmarMov, scope.btnContabilizarMov, scope.btnReporte/*, scope.btnAvisoDebitoMov, scope.btnGraficarMov*/, scope.btnBuscarMov, '->', scope.lfdPeriodo, '-', scope.btnDefinirFondo, scope.tfFondoActual, scope.btnAyuda]
        })
    },
    fGetGridMov: function (scope) {
        /* MENU CONTEXTUAL */
        scope.menuItemMod = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnModificar,
            iconCls: 'modificar'
        });
        scope.menuItemEliminar = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnEliminar,
            iconCls: 'eliminar'
        });
        scope.menuItemCancel = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnCancelar,
            iconCls: 'cancelar'
        });
        scope.menuItemConfirm = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnConfirmar,
            iconCls: 'confirmar',
        });
        scope.menuItemContab = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnContabilizar,
            iconCls: 'contabilidad'
        });
        scope.menuItemVer = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnVer,
            iconCls: 'ver'
        });
        scope.menuContextual = new Ext.menu.Menu({
            floating: false,
            shadow: "drop",
            hideBorders: true,
            items: [scope.menuItemMod, scope.menuItemEliminar, scope.menuItemCancel, scope.menuItemConfirm,
                scope.menuItemContab, scope.menuItemVer]
        });
        /* FIN MENU CONTEXTUAL */

        scope.tfNumero = new Ext.form.TextField({
            name: 'tfNumero',
            anchor: '100%',
            maskRe: /^([0-9])+$/,
            regex: /^([0-9])+$/,
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            width: 110,
        });

        var dataEstados = [[8, 'Guardado'], [5, 'Confirmado'], [6, 'Posteado'], [4, 'Depositado'], [7, 'Cancelado']];

        scope.stEstado = new Ext.data.SimpleStore({
            fields: ['idestado', 'nombre'],
        });

        scope.stEstado.loadData(dataEstados);

        scope.tfEstado = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: true,
            store: scope.stEstado,
            valueField: 'idestado',
            displayField: 'nombre',
            hiddenName: 'idestado',
            typeAhead: true,
            mode: 'local',
            width: 110,
            hidden: scope.cargaInicial,
            triggerAction: 'all',
            enableKeyEvents: true
        });

        scope.btnBuscar = new Ext.Button({
            text: scope.etiquetas.lbBuscar,
            tooltip: scope.etiquetas.lbToolBuscar,
            disabled: true,
            iconCls: 'buscar'
        });

        scope.smGestionarMov = new Ext.grid.RowSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
            id: 'smGestionarMov',
            width: 30,
            sortable: true,
            listeners: {
                rowselect: function (smodel, rowIndex, record) {
                    scope.RowClick(smodel, rowIndex, record);
                    Ext.getCmp('gpGestionarMov').getView().addRowClass(rowIndex, "negrita");
                },
                rowdeselect: function (smodel, rowIndex, record) {
                    scope.RowClick(smodel, rowIndex, record);
                    Ext.getCmp('gpGestionarMov').getView().removeRowClass(rowIndex, "negrita");
                },
                selectionchange: function (selectionModel) {
                    if (!selectionModel.hasSelection()) {
                        scope.btnModificarMov.disable();
                        scope.btnEliminarMov.disable();
                        scope.btnConfirmarMov.disable();
                        scope.btnContabilizarMov.disable();
                        scope.btnCancelarMov.disable();
                    }
                }
            }
        });

        scope.rowaction = new Ext.grid.RowActions({
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
                    textIndex: 'numcomprobante'
                },
            ]
        });

        scope.gpGestionarMov = new Ext.grid.GridPanel({
            frame: false,
            border: false,
            autoScroll: true,
            forceFit: true,
            id: 'gpGestionarMov',
            loadMask: true,
            autoExpandColumn: 'expandir',
            sm: scope.smGestionarMov,
            store: scope.stGestionarMov,
            cm: new Ext.grid.ColumnModel([
                {
                    header: scope.etiquetas.lbNumero,
                    sortable: true,
                    hideable: true,
                    dataIndex: 'numero',
                    width: 60,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (record.data.cargainicial == 1)
                            return 'CI-' + value;
                        else return value;
                    }
                }, {
                    header: 'Tipo documento',
                    sortable: true,
                    hideable: true,
                    hidden: false,
                    dataIndex: 'tipoDocumento',
                    width: 110
                }, {
                    header: scope.etiquetas.lbAcreedorDeudor,
                    sortable: true,
                    hideable: true,
                    dataIndex: 'nombrePersona',
                    width: 200
                }, {
                    header: 'Elaborado por',
                    sortable: true,
                    hideable: true,
                    id: 'recibidoPor',
                    dataIndex: 'nombreCajero',
                    width: 200
                }, {
                    header: 'Importe',
                    sortable: true,
                    hideable: true,
                    align: 'right',
                    renderer: formatoMoneda,
                    dataIndex: 'importemo'
                }, {
                    header: 'Fecha',
                    renderer: 'erpFecha',
                    sortable: true,
                    hideable: true,
                    dataIndex: 'fecha',
                    align: 'center'
                }, {
                    header: scope.etiquetas.lbEstado,
                    sortable: true,
                    hideable: true,
                    dataIndex: 'estado',
                    align: 'left'
                }, {
                    header: scope.etiquetas.lbObservacion,
                    sortable: true,
                    hideable: true,
                    dataIndex: 'comentario',
                    id: 'expandir'
                }, {
                    header: 'No. Comprobante',
                    width: 60,
                    dataIndex: 'numcomprobante',
                    hideable: false,
                    sortable: true,
                    hidden: true,
                }, {
                    hidden: true,
                    sortable: true,
                    hideable: false,
                    dataIndex: 'idfondo',
                    id: 'idfondo'
                }, {
                    hidden: true,
                    sortable: true,
                    hideable: false,
                    dataIndex: 'cajero',
                    id: 'cajero'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'iddocumento',
                    id: 'iddocumento'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idperiodo',
                    id: 'idperiodo'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestadodoc',
                    id: 'idestadodoc'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtipodocumento',
                    id: 'idtipodocumento'
                },
                scope.rowaction,
            ]),
            tbar: [scope.etiquetas.lbNumeroBusc, scope.tfNumero, (scope.cargaInicial) ? '' : '-', (scope.cargaInicial) ? '' : scope.etiquetas.lbBuscarEstado, scope.tfEstado, '-', scope.btnBuscar, '->', Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo],
            bbar: scope.ptRegistroMov = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                scope: this,
                store: scope.stGestionarMov,
                displayInfo: true,
                clearFilter: true,
                listeners: {
                    'beforechange': function () {
                        scope.stGestionarMov.baseParams.idcajafondo = scope.idCajaFondo;
                        scope.stGestionarMov.baseParams.cargaInicial = scope.cargaInicial;
                        instance = new PagingToolbarSelections({
                            'selections': Ext.getCmp('gpGestionarMov').getSelectionModel().getSelections(),
                            'activePage': this.getPageData().activePage
                        });
                        instance.saveSelectionsOnPage(scope.arrayValues);
                    },
                    'change': function () {
                        Ext.MessageBox.hide();
                        instance = new PagingToolbarSelections({
                            'activePage': this.getPageData().activePage
                        });
                        instance.setSelectionsOnPage(scope.arrayValues, Ext.getCmp('gpGestionarMov'));
                    }
                }
            }),
            plugins: scope.rowaction
        });

        return scope.gpGestionarMov;
    }
});

Ext.UIGestionarMov.windowCancelar = Ext.extend(Ext.Window, {
    constructor: function (scope, fecha, params) {
        Ext.applyIf(this, {
            layout: 'fit',
            border: false,
            autoValidate: true,
            title: Ext.isEmpty(params) ? scope.etiquetas.lbTitleCancelar : scope.etiquetas.lbTitleCancelarInst,
            modal: true,
            resizable: false,
            layout: 'fit',
            closeAction: 'close',
            id: 'windowCancelar',
            autoHeight: true,
            border: false,
            width: 300,
            height: 200,
            items: [this.fPanelCancelar = this.fPanelCancelar(scope, fecha)],
        });
        this.createButtons(scope, params);
        return Ext.UIGestionarMov.windowCancelar.superclass.constructor.call(this);
    },
    fPanelCancelar: function (scope, fecha) {
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
        //ComboBox Motivo de cancelacion
        scope.stMotivo = new Ext.data.Store({
            url: 'cargarmotivocancelacion',
            reader: new Ext.data.JsonReader({
                root: 'datos',
            }, [{
                name: 'idmotivocancelacion',
                mapping: 'idmotivocancelacion',
                type: 'string'
            }, {
                name: 'motivo',
                mapping: 'descripcion'
            }
            ]),
            sortInfo: {
                field: 'motivo',
                direction: 'ASC'
            },
            autoLoad: true,
            listeners: {
                beforeload: function (s, options) {
                    scope.stMotivo.clearFilter(true);
                    scope.stMotivo.removeAll();
                }
            }
        });

        this.firstElement = scope.cbMotivo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Motivo de cancelaci&oacute;n',
            mode: 'local',
            name: 'cbxmotivo',
            id: 'cbxmotivo',
            tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
            resizable: true,
            emptyText: 'Seleccione...',
            store: scope.stMotivo,
            hiddenName: 'idmotivocancelacion',
            valueField: 'idmotivocancelacion',
            displayField: 'motivo',
            editable: false,
            typeAhead: true,
            msgTarget: 'qtip',
            maskRe: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, //Solo letras, n�meros y espacios
            regex: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
            regexText: 'Este campo solo permite letras y n&uacute;meros.',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            anchor: '95%',
            triggerAction: 'all'
        });

        //Fecha cancelacion
        scope.dfCancelacion = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Fecha',
            //readOnly : true,
            msgTarget: 'qtip',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            format: 'd/m/Y',
            editable: false,
            anchor: '95%',
            name: 'dfCancelacion',
            id: 'dfCancelacion',
            value: fechaContable,
            minValue: this.obtenerFechaInicio(fechaInicio, fecha),
            maxValue: fechaFin,
            invalidText: 'El formato establecido: dd/mm/aaaa.',
            enableKeyEvents: true
        });
        scope.fpCancelacion = new Ext.FormPanel({
            id: 'fpcancelacion',
            region: 'north',
            labelAlign: 'top',
            frame: true,
            border: true,
            layout: 'form',
            autoHeight: true,
            modal: true,
            plain: true,
            trackResetOnLoad: true,
            bodyStyle: 'padding:10px 0 0 10px',
            items: [scope.cbMotivo, scope.dfCancelacion]
        });
        return scope.fpCancelacion
    },
    createButtons: function (scope, params) {
        scope.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            selectOnFocus: true,
            //disabled: true,
            text: scope.etiquetas.lbBtnCancelar,
            tooltip: scope.etiquetas.tooltipCloseAdd,
            scope: this,
            handler: function () {
                this.close();
            }
        });

        scope.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'aceptar',
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: scope.etiquetas.tooltipAcept,
            scope: this,
            handler: function () {
                if (!params)//Si no viene params es porque estoy cancelando un movimiento
                    scope.fShowComprobanteCancelarMov(scope.cbMotivo.getValue(), scope.dfCancelacion.getRawValue());
                else {//Cancelacion de Instrumento
                    params.idmotivo = scope.cbMotivo.getValue();
                    params.fecha = scope.dfCancelacion.getRawValue();
                    scope.scopeGestionarMov.fLoadDataComprobante(params);
                }
                this.close();
            }
        });
        this.buttons = [scope.btnCancelar, scope.btnAceptar];
    }
});
