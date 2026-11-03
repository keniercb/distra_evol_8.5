Ext.namespace('Ext.UIGestionarDuo');

Ext.UIGestionarDuo.ViewPort = Ext.extend(Ext.Viewport, {
    etiquetas: undefined,
    constructor: function (scope, params) {
        Ext.applyIf(this, {
            renderTo: document.body,
            layout: 'fit'
        });
        return Ext.UIGestionarDuo.ViewPort.superclass.constructor.call(this, params);
    }
});

Ext.UIGestionarDuo.loadMask = function (body, msg) {
    return new Ext.LoadMask(body, {
        msg: msg
    });
};

Ext.UIGestionarDuo.pnlContenedor = Ext.extend(Ext.Panel, {
    constructor: function (scope, titulo) {
        Ext.applyIf(this, {
            layout: 'fit',
            border: false,
            items: [scope.gpRegistroDuo = this.fGetGridDuo(scope)]
        });
        return this;
    },
    fGetGridDuo: function (scope) {
        /* MENU CONTEXTUAL */
        scope.menuItemMod = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnModificar,
            iconCls: 'modificar'
        });
        scope.menuItemDel = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnEliminar,
            iconCls: 'eliminar'
        });
        scope.menuItemCancel = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnCancelar,
            iconCls: 'cancelar'
        });
        scope.menuItemConfirm = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnConfirmar,
            iconCls: 'confirmar'
        });
        scope.menuItemContab = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnContabilizar,
            iconCls: 'contabilidad'
        });
        scope.menuItemLiquidar = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnLiquidar,
            iconCls: 'liquidar'
        });
        scope.menuItemLiquidarCancelar = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnCancelar + ' Liquidaci&oacute;n',
            iconCls: 'cancelar'
        });
        scope.menuItemTrasp = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnTraspasar,
            iconCls: 'cambiar'
        });
        scope.menuItemNotaCredito = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnNotaCredito,
            iconCls: 'cambiar'
        });
        scope.menuItemIncobrable = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnIncobrable,
            iconCls: 'cambiar'
        });
        scope.menuItemDocOrigen = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnDocorigen,
            iconCls: 'cargardocumento'
        });

        scope.menuContextual = new Ext.menu.Menu({
            floating: false,
            shadow: true,
            hideBorders: true,
            items: [scope.menuItemMod, scope.menuItemDel, scope.menuItemCancel, scope.menuItemConfirm,
                scope.menuItemContab, scope.menuItemLiquidar, scope.menuItemDocOrigen/*,scope.menuItemTrasp, scope.menuItemIncobrable, (scope.confNotaCredito) ? scope.menuItemNotaCredito : '', scope.menuItemVer*/]
        });

        scope.btnAdicionarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnAdicionar,
            tooltip: scope.etiquetas.tpAdicionar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
            iconCls: 'adicionar',
            abreviatura: 'add'
        });
        validate.addButton(scope.btnAdicionarDuo);

        scope.btnModificarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnModificar,
            tooltip: scope.etiquetas.tpModificar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
            iconCls: 'modificar',
            abreviatura: 'add'
        });
        validate.addButton(scope.btnModificarDuo);

        scope.btnEliminarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnEliminar,
            tooltip: scope.etiquetas.tpEliminar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
            iconCls: 'eliminar',
            abreviatura: 'del'
        });
        validate.addButton(scope.btnEliminarDuo);

        scope.btnCancelarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnCancelar,
            tooltip: scope.etiquetas.tpCancelar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            hidden: (scope.aperturado == 0) ? true : false,
            disabled: true,
            iconCls: 'cancelar',
            abreviatura: 'cancelar'
        });

        scope.searchField = new Ext.Cont.SearchField({
            width: 120,
            // maskRe: /^[0-9]*$/,
            scope: this,
            emptyText: 'Número a buscar...',
            fnOnSearch: function () {
                //scope.ptRegistroDuo.changePage(0);
                scope.stGestionarDuo.baseParams.start = 0;
                scope.stGestionarDuo.baseParams.numero = scope.searchField.getRawValue();
                scope.stGestionarDuo.baseParams.searching = 1;
                scope.stGestionarDuo.load({
                    callback: function (records, opt, succes) {
                        if (records.length == 0) {
                            mostrarMensaje(1, 'No existen datos que se correpondan con los criterios de búsqueda especificados.')
                        }
                    }
                });
            },
            fnOnClear: function () {
                scope.stGestionarDuo.baseParams.numero = null;
                scope.stGestionarDuo.baseParams.searching = null;
                scope.stGestionarDuo.load();
            }
        });

        if (scope.aperturado == 1)
            validate.addButton(scope.btnCancelarDuo);

        scope.btnCancelarLiquidacionDuo = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnCancelar + ' liquidaci&oacute;n de factura',
            tooltip: scope.etiquetas.tpCancelarLiq.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            hidden: (scope.aperturado == 0) ? true : false,
            disabled: true,
            iconCls: 'cancelar',
            abreviatura: 'cancelar'
        });

        if (scope.aperturado == 1)
            validate.addButton(scope.btnCancelarLiquidacionDuo);

        scope.btnCancelarLiquidacionByClienteProveedorDuo = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnCancelar + ' liquidaciones',
            // tooltip: scope.etiquetas.tpCancelarLiq.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tooltip: 'Cancelar liquidaciones realizadas (<b>Ctr+X</b>)',
            hidden: (scope.aperturado == 0) ? true : false,
            disabled: false,
            iconCls: 'cancelar',
            abreviatura: 'cancelar'
        });

        if (scope.aperturado == 1)
            validate.addButton(scope.btnCancelarLiquidacionByClienteProveedorDuo);

        scope.btnConfirmarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnConfirmar,
            tooltip: scope.etiquetas.tpConfirmar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
            hidden: (scope.aperturado == 0) ? true : false,
            iconCls: 'confirmar',
            abreviatura: 'confirmar'
        });

        if (scope.aperturado == 1)
            validate.addButton(scope.btnConfirmarDuo);

        scope.btnContabilizarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnContabilizar,
            tooltip: scope.etiquetas.tpContabilizar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
            hidden: (scope.aperturado == 0) ? true : false,
            iconCls: 'contabilidad',
            abreviatura: 'postear'
        });

        if (scope.aperturado == 1)
            validate.addButton(scope.btnContabilizarDuo);

        scope.btnLiquidarDuo = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnLiquidar + ' obligación',
            // tooltip: scope.etiquetas.tpLiquidar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase())',
            tooltip: 'Liquidar obligación seleccionada (<b>Alt+L</b>)',
            tabIndex: 312,
            disabled: true,
            hidden: (scope.aperturado == 0) ? true : false,
            iconCls: 'liquidar',
            abreviatura: 'liq'
        });

        if (scope.aperturado == 1)
            validate.addButton(scope.btnLiquidarDuo);

        scope.btnLiquidar2Duo = new Ext.menu.Item({
            text: 'Liquidar obligaciones',
            // tooltip: scope.etiquetas.tpLiquidar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tooltip: 'Liquidar obligaciones pendientes (<b>Ctr+L</b>)',
            tabIndex: 312,
            // disabled: true,
            hidden: (scope.aperturado == 0) ? true : false,
            iconCls: 'liquidar',
            abreviatura: 'liqall'
        });

        if (scope.aperturado == 1)
            validate.addButton(scope.btnLiquidar2Duo);

        scope.menuLiquidar = new Ext.menu.Menu({
            text: 'Liquidaciones',
            // tooltip: scope.etiquetas.lbToolAdicionarSello,
            // iconCls: 'liquidar',
            items: [
                scope.btnLiquidarDuo,
                //scope.btnCancelarLiquidacionDuo,
                scope.btnLiquidar2Duo,
                scope.btnCancelarLiquidacionByClienteProveedorDuo
            ]
        });

        scope.btnLiquidaciones = new Ext.Button({
            id: 'addLiquidaciones',
            text: 'Liquidaciones',
            tooltip: 'Liquidar obligaciones/Cancelar liquidaciones',
            iconCls: 'liquidar',
            hidden: (scope.aperturado == 0) ? true : false,
            menu: scope.menuLiquidar
        });

        scope.btnVerDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnVer,
            tooltip: scope.etiquetas.tpVer.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
            iconCls: 'ver',
            abreviatura: 'vergraficar'
        });
        validate.addButton(scope.btnVerDuo);

        scope.btnExpDuo = new Ext.Button({
            text: 'Expediente',
            disabled: true,
            hidden: true,
            iconCls: 'ver'
        });
        // validate.addButton(scope.btnVerDuo);

        scope.btnGraficarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnGraficar,
            tooltip: scope.etiquetas.tpGraficar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 313,
            disabled: true,
            hidden: (scope.aperturado == 0) ? true : false,
            iconCls: 'graficar',
            abreviatura: 'vergraficar'
        });
        if (scope.aperturado == 1)
            validate.addButton(scope.btnGraficarDuo);

        scope.btnBuscarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnBuscar,
            tooltip: scope.etiquetas.tpBuscar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
            iconCls: 'buscaravanzada',
            abreviatura: 'busqueda'
        });
        validate.addButton(scope.btnBuscarDuo);

        scope.btnTraspasoDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnTraspaso,
            tooltip: scope.etiquetas.tpTraspaso.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 313,
            iconCls: 'cambiar'
        });

        scope.btnTraspasoAvanzadoDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnTraspaso,
            tooltip: scope.etiquetas.tpTraspaso.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 313,
            iconCls: 'cambiar'
        });

        scope.btnNotaCreditoDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnNotaCredito,
            tooltip: scope.etiquetas.tpNotaCredito,
            tabIndex: 313,
            disabled: true,
            iconCls: 'cambiar'
        });

        scope.btnIncobrableDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnIncobrable,
            tooltip: scope.etiquetas.tpIncobrable,
            tabIndex: 313,
            disabled: true,
            iconCls: 'cambiar'
        });

        scope.btnDocOrigen = new Ext.Button({
            text: scope.etiquetas.lbBtnDocorigen,
            tooltip: scope.etiquetas.tpDocOrigen,
            disabled: true,
            // hidden: (scope.aperturado == 0) ? true : false,
            hidden: true,
            iconCls: 'cargardocumento'
        });

        scope.btnAyuda = new Ext.Button({
            id: scope.aperturado == 1 ? ((scope.tipoDuo == 1) ? 'btnAyuCuentasCobrar' : 'btnAyuCuentasPagar') : ((scope.tipoDuo == 1) ? 'btnAyuCuentasCobrarCI' : 'btnAyuCuentasPagarCI'),
            iconCls: 'ayuda',
            text: scope.etiquetas.lbBtnAyuda,
            tooltip: scope.etiquetas.tpAyuda
        });

        scope.dateMenu = new Ext.menu.DateMenu({
            id: 'dateMenu',
            format: 'd/m/Y'
        });
        scope.btnFecha = new Ext.Button({
            text: 'Pasar fecha',
            tooltip: 'Pasar fecha',
            iconCls: 'calendario',
            menu: scope.dateMenu,
            hidden: (scope.aperturado == 0) ? true : false,
            abreviatura: 'pasarfecha'
        });

        if (scope.aperturado == 1)
            validate.addButton(scope.btnFecha);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();

        scope.smGestionarDuo = new Ext.grid.RowSelectionModel({
            id: 'smGestionarDuo',
            width: 30,
            sortable: true,
            listeners: {
                rowselect: function (smodel, rowIndex, record) {
                    scope.RowClick(smodel, rowIndex, record);
                    Ext.getCmp('gpGestionarDuo').getView().addRowClass(rowIndex, "negrita");
                },
                rowdeselect: function (smodel, rowIndex, record) {
                    scope.RowClick(smodel, rowIndex, record);
                    Ext.getCmp('gpGestionarDuo').getView().removeRowClass(rowIndex, "negrita");
                }
            }
        });

        scope.lfdPeriodo = new Ext.form.Label({
            id: 'lfdPeriodo',
            text: ' ',
            style: 'font-weight:bold;'
        });
        scope.lfdFechaContable = new Ext.form.Label({
            id: 'lfdFechaContable',
            text: ' ',
            style: 'font-weight:bold;'
        });

        scope.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            widthSlope: 100,
            header: "No. Comprobante",
            actions: [
                {
                    id: 'vistareporte',
                    // tooltip: this.idioma.lbtpEliminar,
                    // tooltip: 'Ver comprobante',
                    qtipIndex: 'numcomprobante',
                    iconCls: 'vistareporte',
                    marginLeft: 5,
                    width: 200,
                    height: 16,
                    hideIndex: 'showcomprobante',
                    textIndex: 'numcomprobante',
                },
            ]
        });

        var columnas = [];
        var tiposfilter = [];
        var autoexpand = undefined;
        // console.log(scope.gridColumns);
        for (var i = 0; i < scope.gridColumns.length; i++) {
            var obj = {
                header: scope.gridColumns[i].header,
                width: parseInt(scope.gridColumns[i].width),
                dataIndex: scope.gridColumns[i].dataindex,
                align: scope.gridColumns[i].align,
                // id: scope.gridColumns[i].identificador ? scope.gridColumns[i].identificador : '',
                sortable: scope.gridColumns[i].sortable == 1 ? true : false,
                hidden: scope.gridColumns[i].hidden == 1 ? true : false,
                hideable: scope.gridColumns[i].hideable == 1 ? true : false,
                renderer: this.getRendereFunc(scope.gridColumns[i].render, scope),
            };
            if (scope.gridColumns[i].identificador) {
                obj.id = scope.gridColumns[i].identificador;
            }
            if (scope.gridColumns[i].filtrar == 1) {
                tiposfilter.push({
                    type: scope.gridColumns[i].type,
                    dataIndex: scope.gridColumns[i].dataindex,
                });
            }
            columnas.push(obj);

            if (scope.gridColumns[i].autoexpandir == 1 && scope.gridColumns[i].identificador) {
                autoexpand = scope.gridColumns[i].identificador;
            }
        }
        columnas.push(scope.rowaction);

        var filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            local: false,
            filters: tiposfilter
        });

        // console.log(columnas);
        // console.log(autoexpand);

        scope.gpGestionarDuo = new Ext.grid.GridPanel({
            frame: false,
            border: false,
            autoScroll: true,
            id: 'gpGestionarDuo',
            autoExpandColumn: autoexpand,
            sm: scope.smGestionarDuo,
            store: scope.stGestionarDuo,
            cm: new Ext.grid.ColumnModel(columnas),
            /*cm: new Ext.grid.ColumnModel([
                {
                    header: 'Documento', //scope.etiquetas.lbTipoDoc,
                    width: 150,
                    dataIndex: 'denominacion',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: 'Operaci&oacute;n', //scope.etiquetas.lbDetalle,
                    width: 150,
                    dataIndex: 'operacionDenom',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: 'N&uacute;mero', //scope.etiquetas.lbNumDocumento,
                    dataIndex: 'numero',
                    width: 110,
                    align: 'left',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    hidden: true,
                    hideable: false,
                    header: scope.nombreFecha,
                    width: 80,
                    dataIndex: 'fechaentrega',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbFechaEmision,
                    width: 80,
                    align: 'left',
                    dataIndex: 'fechaemision',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbFechaRecepcion,
                    width: 80,
                    dataIndex: 'fecharecepcion',
                    sortable: true,
                    hidden: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbFechaEntrega,
                    width: 80,
                    dataIndex: 'fechaentrega',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    id: 'nombrecliente',
                    header: scope.nombreCliente,
                    width: 150,
                    dataIndex: 'nombrecliente',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbCuenta,
                    dataIndex: 'concatcta',
                    width: 100,
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbMoneda,
                    dataIndex: 'codigoiso',
                    width: 50,
                    align: 'center',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbImporte,
                    dataIndex: 'importemb',
                    align: 'right',
                    width: 90,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {//Nuevos campo para el importe y moneda original de la factura en moneda extranjera
                    header: 'Moneda original',
                    dataIndex: 'monedaOrigen',
                    width: 95,
                    align: 'center',
                    sortable: true,
                    hidden: true,
                    hideable: true,
                }, {
                    header: 'Importe original',
                    dataIndex: 'importeOrigen',
                    align: 'right',
                    width: 95,
                    sortable: true,
                    hidden: true,
                    hideable: true,
                    renderer: formatoMonedaABS
                }, {//--------------------------------------------------------
                    header: 'Liquidado',
                    dataIndex: 'liquidadomb',
                    align: 'right',
                    width: 90,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    header: 'Por liquidar',
                    dataIndex: 'pendienteliq',
                    align: 'right',
                    width: 90,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    hidden: true,
                    header: 'Cobranza',
                    dataIndex: 'estadodcop',
                    width: 80,
                    sortable: true
                }, {
                    hidden: true,
                    hideable: false,
                    header: scope.etiquetas.lbFechaContable,
                    width: 100,
                    dataIndex: 'fechacontable',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbEdad,
                    width: 70,
                    align: 'center',
                    dataIndex: 'edad',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    hidden: true,
                    id: 'vence',
                    header: 'Vence', //scope.etiquetas.lbNoComprobante,
                    width: 80,
                    align: 'left',
                    dataIndex: 'vence',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbEstado,
                    width: 70,
                    dataIndex: 'estadodescripcion',
                    align: 'left',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    hidden: true,
                    id: 'comentario',
                    header: scope.etiquetas.lbDetalle,
                    width: 120,
                    dataIndex: 'comentario',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    header: scope.etiquetas.lbEspecialidad,
                    width: 120,
                    hidden: true,
                    hideable: (scope.confEspecialidad) ? true : false,
                    dataIndex: 'especialidad',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    id: 'nombresubsistema',
                    hidden: true,
                    header: scope.etiquetas.lbSubsistema,
                    width: 100,
                    dataIndex: 'nombresubsistema',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    hidden: true,
                    hideable: false,
                    header: scope.etiquetas.lbEntidadOrigen,
                    width: 100,
                    dataIndex: 'estructuraorigen',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idderechouobligacion',
                    id: 'idderechouobligacion'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'pagadomb',
                    id: 'pagadomb'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestadodocumento',
                    id: 'idestadodocumento'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestadodcop',
                    id: 'idestadodcop'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcondicionpago',
                    id: 'idcondicionpago'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtipo',
                    id: 'idtipo'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'iddoc',
                    id: 'iddoc'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestructuraorigen',
                    id: 'idestructuraorigen'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtipoderechouobligacion',
                    id: 'idtipoderechouobligacion'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idperiodo',
                    id: 'idperiodo'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcondicionpago',
                    id: 'idcondicionpago'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'condicionpago',
                    id: 'condicionpago'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'version',
                    id: 'version'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'id',
                    id: 'id'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcuenta',
                    id: 'idcuenta'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idnaturaleza',
                    id: 'idnaturaleza'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'text',
                    id: 'text'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcliente',
                    id: 'idcliente'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idsubsistema',
                    id: 'idsubsistema'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'documentoexterno',
                    id: 'documentoexterno'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'abreviatura',
                    id: 'abreviatura'
                }, scope.rowaction
            ]),*/
            view: new Ext.grid.GroupingView({
                // forceFit: true,
                groupTextTpl: "{[values.rs[0].data.nombresubsistema]}"
            }),
            tbar: scope.tbGpDuo = new Ext.Toolbar({
                hidden: false,
                items: [scope.btnAdicionarDuo, scope.btnModificarDuo, scope.btnEliminarDuo, scope.btnCancelarDuo, scope.btnConfirmarDuo, scope.btnContabilizarDuo, scope.btnLiquidaciones, scope.btnVerDuo, scope.btnExpDuo, scope.btnGraficarDuo, scope.btnFecha, scope.btnBuscarDuo/*, scope.btnDocOrigen*/, scope.searchField, '->', scope.lfdFechaContable, scope.btnAyuda],
            }),
            plugins: [scope.rowaction, filters],
            bbar: scope.ptRegistroDuo = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                scope: this,
                clearFilter: true,
                autoHeight: true,
                store: scope.stGestionarDuo,
                displayInfo: true,
                listeners: {
                    'beforechange': function () {
                        scope.stGestionarDuo.baseParams.tipoduo = scope.tipoDuo;
                        scope.stGestionarDuo.baseParams.aperturado = scope.aperturado;
                        instance = new PagingToolbarSelections({
                            'selections': Ext.getCmp('gpGestionarDuo').getSelectionModel().getSelections(),
                            'activePage': this.getPageData().activePage
                        });
                        instance.saveSelectionsOnPage(scope.arrayValues);
                    },
                    'change': function () {
                        instance = new PagingToolbarSelections({
                            'activePage': this.getPageData().activePage
                        });
                        instance.setSelectionsOnPage(scope.arrayValues, Ext.getCmp('gpGestionarDuo'));
                    }
                }
            })
        });

        return scope.gpGestionarDuo;
    },
    getRendereFunc: function (renderer, scope) {
        if (renderer === 'createToolTip') {
            return function (v, m, r) {
                return scope.createToolTip(v, m, r);
            };
        } else if (renderer === 'formatoMonedaABS') {
            return formatoMonedaABS;
        } else {
            return undefined;
        }
    }
});