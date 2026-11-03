Ext.namespace('Ext.UIGestionarDuo');

Ext.UIGestionarDuo.ViewPort = Ext.extend(Ext.Viewport, {
    etiquetas: undefined,
    constructor: function(scope, params)
    {
        //this.etiquetas = etiquetas;
        var arrayValues = new Array();//almacena el record para el paginado
        Ext.applyIf(this, {
            renderTo: document.body,
            layout: 'fit'
        });
        return Ext.UIGestionarDuo.ViewPort.superclass.constructor.call(this, params);
    }
});

Ext.UIGestionarDuo.loadMask = function(body, msg) {
    return new Ext.LoadMask(body, {
        msg: msg
    });
};

Ext.UIGestionarDuo.pnlContenedor = Ext.extend(Ext.Panel, {
    constructor: function(scope, titulo)
    {
        Ext.applyIf(this, {
            layout: 'fit',
            border: false,
            items: [scope.gpRegistroDuo = this.fGetGridDuo(scope)]
        });
        return this;
    },
    fGetGridDuo: function(scope)
    {
        scope.menuItemMod = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnModificar,
//            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar'
        });
        scope.menuItemDel = new Ext.menu.Item({
            text: scope.etiquetas.lbBtnEliminar,
//            icon: perfil.dirImg + 'eliminar.png'
            iconCls: 'eliminar'
        });
//        scope.menuItemVer = new Ext.menu.Item({
//            text: scope.etiquetas.lbBtnVer,
//            icon: perfil.dirImg + 'ver.png'
//        });

        scope.menuContextual = new Ext.menu.Menu({
            floating: false,
            shadow: true,
            hideBorders: true,
            items: [scope.menuItemMod, scope.menuItemDel/*,scope.menuItemVer*/]
        });

        scope.btnAdicionarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnAdicionar,
            tooltip: scope.etiquetas.tpAdicionar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            abreviatura: 'add'

        });
        validate.addButton(scope.btnAdicionarDuo);

        scope.btnModificarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnModificar,
            tooltip: scope.etiquetas.tpModificar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
//            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            abreviatura: 'add'

        });
        validate.addButton(scope.btnModificarDuo);

        scope.btnEliminarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnEliminar,
            tooltip: scope.etiquetas.tpEliminar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            abreviatura: 'del'

        });
        validate.addButton(scope.btnEliminarDuo);

        scope.btnCancelarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnCancelar,
            tooltip: scope.etiquetas.tpCancelar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar'
        });

        scope.btnConfirmarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnConfirmar,
            tooltip: scope.etiquetas.tpConfirmar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
//            icon: perfil.dirImg + 'confirmar.png',
            iconCls: 'confirmar'
        });

        scope.btnContabilizarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnContabilizar,
            tooltip: scope.etiquetas.tpContabilizar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: true,
//            icon: perfil.dirImg + 'contabilidad.png',
            iconCls: 'contabilidad'
        });

        scope.btnVerDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnVer,
            tooltip: scope.etiquetas.tpVer.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: false,
//            icon: perfil.dirImg + 'ver.png',
            iconCls: 'ver'
        });

        scope.btnBuscarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnBuscar,
            tooltip: scope.etiquetas.tpBuscar.replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()),
            tabIndex: 312,
            disabled: false,
//            icon: perfil.dirImg + 'buscaravanzada.png',
            iconCls: 'buscaravanzada',
            abreviatura: 'busqueda'

        });
        validate.addButton(scope.btnBuscarDuo);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();

        scope.btnImportarDuo = new Ext.Button({
            text: scope.etiquetas.lbBtnImportar,
            tooltip: (scope.tipoDuo == 1) ? scope.etiquetas.tpImportarCobrar : scope.etiquetas.tpImportarPagar,
            tabIndex: 312,
            disabled: false,
//            icon: perfil.dirImg + 'importar.png',
            iconCls: 'importar'
        });

        scope.btnAyuda = new Ext.Button({
            id: (scope.tipoDuo == 1) ? 'btnAyuCuentasCobrarCI' : 'btnAyuCuentasPagarCI',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            text: scope.etiquetas.lbBtnAyuda,
            tooltip: scope.etiquetas.tpAyuda
            /*handler: function() {
                if (scope.tipoDuo == 1) {
                    titulo = scope.etiquetas.lbVpTituloDerecho;
                    direccion = 'copa/ci/cuenta_cobrar';
                } else if (scope.tipoDuo == 2) {
                    titulo = scope.etiquetas.lbVpTituloObligacion;
                    direccion = 'copa/ci/cuenta_pagar';
                } else if (scope.tipoDuo == 3) {
                    titulo = scope.etiquetas.lbVpTituloDerechoF;
                    direccion = 'copa/ci/cobro_fiscal';
                } else if (scope.tipoDuo == 4) {
                    titulo = scope.etiquetas.lbVpTituloObligacionF;
                    direccion = 'copa/ci/pago_fiscal';
                }
                help.show(titulo, direccion);
            }*/
        });

        scope.smGestionarDuo = new Ext.grid.RowSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
            id: 'smGestionarDuo',
            width: 30,
            sortable: true,
            listeners: {
                rowselect: function(smodel, rowIndex, record) {
                    scope.RowClick(smodel, rowIndex, record);
                    Ext.getCmp('gpGestionarDuo').getView().addRowClass(rowIndex, "negrita");
                },
                rowdeselect: function(smodel, rowIndex, record) {
                    scope.RowClick(smodel, rowIndex, record);
                    Ext.getCmp('gpGestionarDuo').getView().removeRowClass(rowIndex, "negrita");
                }
            }
        });

        return new Ext.grid.GridPanel({
            frame: false,
            border: false,
            autoScroll: true,
            id: 'gpGestionarDuo',
            stripeRows: true,
            autoExpandColumn: 'comentario',
            sm: scope.smGestionarDuo,
            store: scope.stGestionarDuo,
            cm: new Ext.grid.ColumnModel([
                {
                    header: 'Documento',//scope.etiquetas.lbTipoDoc,
                    width: 100,
                    dataIndex: 'denominacion',
                    align: 'center',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    header: scope.etiquetas.lbNumDocumento,
                    dataIndex: 'numero',
                    width: 100,
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    header: scope.etiquetas.lbFechaEmision,
                    width: 130,
                    dataIndex: 'fechaemision',
                    align: 'center',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    hideable: false,
                    hidden: true,
                    header: scope.nombreFecha,
                    width: 130,
                    dataIndex: 'fechaentrega',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    hideable: false,
                    hidden: true,
                    header: scope.etiquetas.lbFechaRecepcion,
                    id: 'fecharecepcion',
                    width: 130,
                    dataIndex: 'fecharecepcion',
//                    hidden: (scope.confFechaRecepcion) ? false : true,
//                    hideable: (scope.confFechaRecepcion) ? true : false,
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    header: scope.nombreCliente,
                    width: 300,
                    dataIndex: 'nombrecliente',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }

                },
                {
                    id: 'comentario',
                    header: scope.etiquetas.lbDetalle,
                    width: 250,
                    dataIndex: 'comentario',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    header: scope.etiquetas.lbEspecialidad,
                    width: 250,
                    hidden: true,
                    hideable: (scope.confEspecialidad) ? true : false,
                    dataIndex: 'especialidad',
                    sortable: true,
                    renderer: function (v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    header: scope.etiquetas.lbNumContrato,
                    dataIndex: 'numerocontrato',
                    width: 130,
                    align: 'right',
                    hidden: true,
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
//                    hidden: true,
                    header: scope.etiquetas.lbCuenta,
                    dataIndex: 'concatcta',
                    width: 100,
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    header: scope.etiquetas.lbImporte,
                    dataIndex: 'importemb',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                },
                {
                    header: 'Liquidado',//scope.etiquetas.lbImporte,
                    dataIndex: 'pagadomb',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                },
                {
                    header: 'Estado',
                    dataIndex: 'estadodescripcion',
                    // dataIndex: 'estadodcop',
                    width: 130,
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbEspecialidad,
                    width: 250,
                    hidden: true,
                    hideable: false,
                    dataIndex: 'especialidad',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    hidden: true,
                    header: scope.etiquetas.lbFechaContable,
                    width: 100,
                    dataIndex: 'fechacontable',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    hidden: true,
                    hideable: false,
                    header: scope.etiquetas.lbEdad,
                    width: 100,
                    dataIndex: 'edad',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    hidden: true,
                    header: scope.etiquetas.lbSubsistema,
                    width: 100,
                    dataIndex: 'nombresubsistema',
                    sortable: true,
                    renderer: function(v, m, r) {
                        return scope.createToolTip(v, m, r);
                    }
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idderechouobligacion',
                    id: 'idderechouobligacion'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestadodcop',
                    id: 'idestadodcop'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcondicionpago',
                    id: 'idcondicionpago'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtipo',
                    id: 'idtipo'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'iddoc',
                    id: 'iddoc'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestructuracomun',
                    id: 'idestructuracomun'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idperiodo',
                    id: 'idperiodo'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'version',
                    id: 'version'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'id',
                    id: 'id'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcuenta',
                    id: 'idcuenta'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'text',
                    id: 'text'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcliente',
                    id: 'idcliente'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idsubsistema',
                    id: 'idsubsistema'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'abreviatura',
                    id: 'abreviatura'
                }
            ]),
            tbar: scope.tbGpDuo = new Ext.Toolbar({
                hidden: false,
                items: [scope.btnAdicionarDuo, scope.btnModificarDuo, scope.btnEliminarDuo, /*scope.btnVerDuo, scope.btnImportarDuo, */scope.btnBuscarDuo, '->', scope.btnAyuda]
            }),
            bbar: scope.ptRegistroDuo = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                clearFilter: true,
                scope: this,
                store: scope.stGestionarDuo,
                displayInfo: true,
                listeners: {
                    'beforechange': function()
                    {
//                        scope.loadMessageBox(scope.etiquetas.lbMsgLoadData);
                        scope.stGestionarDuo.baseParams.tipoduo = scope.tipoDuo;
                        instance = new PagingToolbarSelections({
                            'selections': Ext.getCmp('gpGestionarDuo').getSelectionModel().getSelections(),
                            'activePage': this.getPageData().activePage
                        });
                        instance.saveSelectionsOnPage(scope.arrayValues);
                    },
                    'change': function()
                    {
                        Ext.MessageBox.hide();
                        instance = new PagingToolbarSelections({
                            'activePage': this.getPageData().activePage
                        });
                        instance.setSelectionsOnPage(scope.arrayValues, Ext.getCmp('gpGestionarDuo'));
                    }
                }
            })
        });
    }
});