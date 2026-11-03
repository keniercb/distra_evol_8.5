Ext.ns('Pvd.Nomina.Pago.Retencion');

Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize: true,

    // private
    isValidParent: function (c, target) {
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout: function (ct, target) {
        var rs = ct.items.items, len = rs.length, r, i;

        if (!this.innerCt) {
            target.addClass('ux-row-layout-ct');
            this.innerCt = target.createChild({cls: 'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if (size.width < 1 && size.height < 1) { // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height: h});

        // some rows can be percentages while others are fixed
        // so we need to make 2 passes

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (!r.rowHeight) {
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (r.rowHeight) {
                r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
            }
        }
    }

    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;

Ext.QuickTips.init();

//Vista del componente Gestionar retenciones.
Pvd.Nomina.Pago.Retencion.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar retenciones(Tipo: Pvd.Nomina.Pago.Retencion.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        this.filasSeleccionadas = new Array();
        this.filasSeleccionadasTodasRet = new Array();
        this.idestructura = 0;
        this.idpersona = 0;
        this.recordperiodopagoseleccionado = null;
        this.recordperiodopagoexportarseleccionado = null;
        var self = this;
        var compartimentarCondicionesretenciones = true;

        //Componenete para seleccionar la entidad de la cual obtener las personas.
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelchequear: 3
        });

        this.datosgeneralesub = new Pvd.Nomina.Pago.Datossubmayor({
            modal: true,
        });

        //Ventana para seleccionar la entidad.
        this.btnAceptarEntidad = new Ext.Button({
            text: idioma.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            // icon: perfil.dirImg+'aceptar.png',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnDatos = new Ext.Button({
            text: 'Mostrar datos',
            //tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            // icon: perfil.dirImg+'aceptar.png',
            //disabled: true,
            iconCls: 'aceptar'
        });

        this.winEstructura = new Ext.Window({
            title: idioma.lbTitleWinEstructura,
            modal: true,
            height: 350,
            constrain: true,
            width: 300,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructura],
            buttons: [this.btnAceptarEntidad],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEntidad.handler();
                    }
                }
            ]
        });

        this.gpPersonas = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            heigth: '50%',
            width: '100%',
            split: true,
            singleSelect: false,
            region: 'center',
            modulo: 'NOMINA',
            funcionalidad: 'CESP',
            esretencion: 1,
            identidad: this.idestructura,
            // cliente: 'MINFAR',
            cantidadPorPaginas: 5000
        });

        //Botones de Add, Mod, Elim retenciones.
        this.btnAdicionarRetenc = new Ext.Button({
            id: 'idbtnAdicionarRetenc',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddRetenc,
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarRetenc',
            nextTab: 'idbtnModificarRetenc',
        });

        this.btnModificarRetenc = new Ext.Button({
            id: 'idbtnModificarRetenc',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModRetenc,
            //icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarRetenc',
            nextTab: 'idbtnEliminarRetenc',
        });

        this.btnEliminarRetenc = new Ext.Button({
            id: 'idbtnEliminarRetenc',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimRetenc,
            //  icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarRetenc',
            nextTab: 'idbtnGestionarCondic',
        });

        this.btnCondicionesRetenc = new Ext.Button({
            id: 'idbtnCondicionesRetenc',
            text: idioma.lbBtnCondicionesRetenc,
            tooltip: idioma.textToolTipCondicionesRetenc,
            hidden: compartimentarCondicionesretenciones,
            iconCls: 'comprobante',
            prevTab: 'idbtnEliminarRetenc',
            nextTab: 'idbtnAdicionarRetenc'
        });

        this.btnComprobante = new Ext.Button({
            id: 'btnComprobante',
            text: 'Comprobante',
            tooltip: 'Comprobante de operaciones',
            iconCls: 'comprobante',

        });

        //Objeto del componente del listado de los periodos de pagos
        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            modoview: 2,
            autoScroll: true,
            estado: 1
        });

        //Boton para aceptar los periodos de pago seleccionados
        this.btnAceptarPeriodosPagosCuadrarSubmayor = new Ext.Button({
            id:'btnAceptarPeriodosCuadrar',
            text:'Aceptar',
            tooltip: 'Aceptar per&iacute;dos de pagos',
            disabled: true,
            iconCls: 'aceptar'
        });

        //Ventana para la seleccion del periodo de pago para el cuadrar
        this.winPeriodosPagos = new Ext.Window({
            title      : 'Per&iacute;odos de pago',
            modal      : true,
            height     : 500,
            width      : 750,
            closable   : true,
            closeAction: 'hide',
            constrain: true,
            resizable  : true,
            layout     : 'border',
            items      : [this.objListarPeriodosPagos],
            buttons    : [this.btnAceptarPeriodosPagosCuadrarSubmayor],
            keys       : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptarPeriodosPagos.handler();
                    }
                }
            ]
        });

        //Menu para seleccionar el tipo de cuadre para las retenciones
        this.btnMenuCuadrar = new Ext.Toolbar.MenuButton({
            text: 'Cuadrar submayor',
            tooltip: 'Cuadrar submayor de retenciones',
            iconCls: 'Calcular',
            menu: {
                items: [
                    {
                        id:'idbtncuadraroperaciones',
                        text: 'Cuadrar por operaciones',
                        tooltip: 'Cuadrar submayor por operaciones',
                        iconCls: 'Documentos',
                    },
                    {
                        id:'idbtncuadrarnominas',
                        text: 'Cuadrar por n&oacute;minas',
                        tooltip: 'Cuadrar submayor por n&oacute;minas',
                        iconCls: 'Nomina'
                    }
                ]
            }
        })


        this.btnCuadrarSubmayor = new Ext.Button({
            id: 'btnCuadrarSubmayor',
            text: 'Cuadrar Submayor',
            disabled: true,
            tooltip: 'Cuadrar Submayor por operaciones',
            iconCls: 'calcular',

        });


        this.btnEliminarRetencHist = new Ext.Button({
            id: 'idbtnEliminarRetencHist',
            text: idioma.lbBtnEliminar,
            tooltip: 'Eliminar retencion histórico',
            //icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            disabled: true
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',
            // icon: perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',

        });

        /*********************Reporte******************************/
        //Botones de la ventana de listado de deducciones.
        this.btnCancelarRepRetenc = new Ext.Button({
            id: 'btnCancelarRepRetenc',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'dfFFinRepRetenc',
            nextTab: 'idbtnAplicarRepRetenc'
        });

        this.btnAplicarRepRetenc = new Ext.Button({
            id: 'idbtnAplicarRepRetenc',
            iconCls: 'aplicar',
            //icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarRepRetenc',
            nextTab: 'idbtnAceptarRepRetenc'
        });

        this.btnAceptarRepRetenc = new Ext.Button({
            id: 'idbtnAceptarRepRetenc',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        this.btnCancelarRepRetencTodas = new Ext.Button({
            id: 'btnCancelarRepRetencTodas',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });

        this.btnAceptarRepRetencTodas = new Ext.Button({
            id: 'idbtnAceptarRepRetencTodas',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        this.dfFInicioRepRetenc = new Ext.form.DateField({
            id: 'dfFInicioRepRetenc', fieldLabel: idioma.lbColDesde,
            name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '99%', endDateField: 'dfFFinRepRetenc'
        });

        this.dfFFinRepRetenc = new Ext.form.DateField({
            id: 'dfFFinRepRetenc', fieldLabel: idioma.lbColHasta,
            name: 'fechafin', xtype: 'datefield', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'dfFInicioRepRetenc',
            prevTab: 'iddfFInicioRepRetenc', nextTab: 'idbtnCancelarRepRetenc'
        });

        this.smRepRetenc = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.smRepRetencTodas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpRepRetenc = new Ext.grid.GridPanel({
            id: 'idgpRepRetenc',
            title: idioma.lbTitleGridRetenc,
            region: 'center',
            columns: [
                self.smRepRetenc,
                {
                    header: 'idtiporetencion',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtiporetencion'
                },

                {
                    header: '<center>' + 'Abreviatura' + '</center>',
                    sortable: true,
                    width: 70,
                    dataIndex: 'abreviatura',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + 'Denominación' + '</center>',
                    width: 120,
                    sortable: true,
                    dataIndex: 'denominacion'
                }
                , {
                    header: '<center>' + 'Saldo límite' + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'saldolimite',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + 'Descripción' + '</center>',
                    width: 80,
                    sortable: true,
                    dataIndex: 'descripcion',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: 250,
            //plugins: this.expanderConcepto,
            //viewConfig: {forceFit: true},
            store: modelo.storeRepRetenc,
            sm: this.smRepRetenc,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeRepRetenc,
                displayInfo: true
            })
        });

        this.gpRepRetencTodas = new Ext.grid.GridPanel({
            id: 'idgpRepRetencTodas',
            title: idioma.lbTitleGridRetenc,
            region: 'center',
            columns: [
                self.smRepRetencTodas,
                {
                    header: 'idtiporetencion',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtiporetencion'
                },

                {
                    header: '<center>' + 'Abreviatura' + '</center>',
                    sortable: true,
                    width: 70,
                    dataIndex: 'abreviatura',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + 'Denominación' + '</center>',
                    width: 120,
                    sortable: true,
                    dataIndex: 'denominacion'
                }
                , {
                    header: '<center>' + 'Saldo límite' + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'saldolimite',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + 'Descripción' + '</center>',
                    width: 80,
                    sortable: true,
                    dataIndex: 'descripcion',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: 250,
            //plugins: this.expanderConcepto,
            //viewConfig: {forceFit: true},
            store: modelo.storeRepRetencTodas,
            sm: this.smRepRetencTodas,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeRepRetencTodas,
                displayInfo: true
            })
        });

        this.pRepRetenc = new Ext.Panel({
            region: 'center',
            layout: 'border',
            border: false,
            // height: '90%',
            width: '100%',
            items: [this.gpRepRetenc]
        });

        this.pRepRetencTodas = new Ext.Panel({
            region: 'center',
            layout: 'border',
            border: false,
            // height: '90%',
            width: '100%',
            items: [this.gpRepRetencTodas]
        });

        //Formulario de retenciones.
        this.formularioRepRetenc = new Ext.FormPanel({
            id: 'formularioRepRetenc',
            labelAlign: 'top',
            frame: true,
            width: 550,
            height: 300,
            layout: 'border',

            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [{
                layout: 'column',
                region: 'north',
                height: 50,
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.dfFInicioRepRetenc]},
                    {columnWidth: .5, layout: 'form', items: [this.dfFFinRepRetenc]}

                ]
            }, this.pRepRetenc
            ]
        });

        this.formularioRepRetencTodas = new Ext.FormPanel({
            id: 'formularioRepRetencTodas',
            labelAlign: 'top',
            frame: true,
            width: 550,
            height: 300,
            layout: 'border',
            items: this.pRepRetencTodas
        });

        //Ventana de adicionar y modificar retención.
        this.ventanaRepRetenc = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioRepRetenc],
            buttons: [this.btnCancelarRepRetenc, this.btnAplicarRepRetenc, this.btnAceptarRepRetenc],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarRepRetenc.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarRepRetenc.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarRepRetenc.handler();
                    }
                }
            ]
        });

        this.ventanaRepRetencTodas = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioRepRetencTodas],
            buttons: [this.btnCancelarRepRetencTodas, this.btnAceptarRepRetencTodas]
        });
          //Boton exportar retenciones 
        this.btnExportarRetenciones = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar retenciones',
            iconCls: 'exportar',
            disabled: true,
            menu: {
                items: [
                    {
                        text: 'Sub-Mayor de retenciones por persona', handler: function (items, p) {
                        var winload = new Ext.PVD.comun.window.winLoad({
                            title: 'Por favor espere...',
                            mensaje: 'Generando reporte'
                        });
                        var idpersona = self.gpPersonasRetencionAlta.getSelectionModel().getSelections()[0].data.idpersona;
                        winload.showMask();
                        window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestretencion/exportarRetencionesXpersona?identidad=' + self.idestructura + '&idpersona=' + idpersona);
                        winload.close();
                    }
                    }, {
                        text: 'Listado de deducciones aplicadas',
                        handler: function (items, p) {
                            self.ventanaRepRetenc.setTitle('Exportar retenciones');
                            self.ventanaRepRetenc.show();
                            modelo.storeRepRetenc.load({params: {limit: 10, start: 0}});
                            self.smRepRetenc.selectFirstRow();
                        }
                    }, {
                        text: 'Listado de Personas con Retenciones', handler: function (items, p) {
                            var winload = new Ext.PVD.comun.window.winLoad({
                                title: 'Por favor espere...',
                                mensaje: 'Generando reporte'
                            });
                            winload.showMask();
                            window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestretencion/exportarListadoRetencionesAplicadas?identidad=' + self.idestructura);
                            winload.close();
                        }
                    }]
            }
        });

        this.btnExportarRetencionesTodasPersonas = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar retenciones',
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Listado de cargas iniciales de las retenciones',
                        handler: function (items, p) {
                            self.ventanaRepRetencTodas.setTitle('Exportar retenciones');
                            self.ventanaRepRetencTodas.show();
                            modelo.storeRepRetencTodas.load({params: {limit: 10, start: 0}});
                            self.smRepRetencTodas.selectFirstRow();
                        }
                    }]
            }
        });

        this.btnImportar = new Ext.Button({
            id: 'btnImportar',
            text: 'Importar ',
            tooltip: 'Importar desde un excel',
            iconCls: 'importar',
            disabled: false
        });
        /*********************Reporte******************************/

        //Listado de retenciones.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        function imagenActivo(val) {
            if (val == 0) {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierreno.png" height=16 width=16 /></center>';
            } else {
                return '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierresi.png" height=16 width=16 /></center>';
            }
        };

        this.smRetenc = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpRetenc = new Ext.grid.GridPanel({
            id: 'idgpRetenc',
            title: idioma.lbTitleGridRetenc,
            region: 'north',
            columns: [{header: 'idpersonaretencion', hidden: true, hideable: false, dataIndex: 'idpersonaretencion'}
                , {
                    header: '<center>' + idioma.lbColTipoRetenc + '</center>',
                    sortable: true,
                    width: 110,
                    dataIndex: 'tiporetencion',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + 'Activo' + '</center>',
                    sortable: true,
                    width: 50,
                    dataIndex: 'activo',
                    renderer: imagenActivo
                }
                , {
                    header: '<center>' + idioma.lbColSaldoInicial + '</center>',
                    fixed: true,
                    width: 75,
                    sortable: true,
                    dataIndex: 'saldoinicial',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColMensualidad + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'mensualidad',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColUltMensualidad + '</center>',
                    fixed: true,
                    width: 85,
                    sortable: true,
                    dataIndex: 'ultmensualidad',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColReferencia + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'refdocumentoacredita',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + 'Cuenta contable' + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'denom',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + 'No. Comprobante' + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'numerocomprobante',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColFechaDocumento + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechadocumento',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            resizable : true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: 250,
            //plugins: this.expanderConcepto, 
            viewConfig: {forceFit: true},
            store: modelo.storeRetenc,
            sm: this.smRetenc,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.storeRetenc,
                displayInfo: true
            }),
        });

        //Listado de historico retenciones.
        this.smRetencHistorico = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpRetencHistorico = new Ext.grid.GridPanel({
            id: 'idgpRetencHistorico',
            title: idioma.lbTitleGridRetenc,
            region: 'north',
            columns: [{
                header: 'idhisdatretencionpersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idhisdatretencionpersona'
            }
                , {
                    header: '<center>' + idioma.lbColTipoRetenc + '</center>',
                    sortable: true,
                    width: 110,
                    dataIndex: 'tiporetencion',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColSaldoInicial + '</center>',
                    fixed: true,
                    width: 75,
                    sortable: true,
                    dataIndex: 'saldoinicial',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColMensualidad + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'mensualidad',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColUltMensualidad + '</center>',
                    fixed: true,
                    width: 85,
                    sortable: true,
                    dataIndex: 'ultmensualidad',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColReferencia + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'refdocumentoacredita',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColFechaDocumento + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechadocumento',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    fixed: true,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: 250,
            //plugins: this.expanderConcepto,
            viewConfig: {forceFit: true},
            store: modelo.storeRetencHistorico,
            sm: this.smRetencHistorico,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeRetencHistorico,
                displayInfo: true
            }),
        });

        //Listado de historico operaciones de retenciones.

        this.smHistOperacionRetenc = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpHistOperacionRetenc = new Ext.grid.GridPanel({
            id: 'idgpHistOperacionRetenc',
            title: idioma.lbTitleGridHistRetenc,
            region: 'center',
            columns: [{
                header: 'idhisdatretencionpersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idhisdatretencionpersona'
            }
                , {
                    header: 'N&oacute;mina',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'numeronomina',
                    renderer: centrarValor
                }
                , {
                    header: 'Retenido',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'retenido',
                    renderer: centrarValor
                }
                , {
                    header: 'Saldo del adeudo',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'saldodeladeudo',
                    renderer: centrarValor
                }
                , {
                    header: 'Fecha de la operaci&oacute;n',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'fechaoperacion',
                    renderer: centrarValor
                }
                , {
                    header: 'Retenci&oacute;n pendiente',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'retencionpendiente',
                    renderer: centrarValor
                }
                , {
                    header: 'Saldo del adeudo pendiente',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'saldodeladeudopendiente',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '70%',
            viewConfig: {forceFit: true},
            store: modelo.storeOperacionesRetencHist,
            sm: this.smHistOperacionRetenc,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeOperacionesRetencHist,
                displayInfo: true
            }),
        });

        //Listado de  operaciones de retenciones.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        //Listado de  operaciones de retenciones.
        function pintarTexto(val) {
            return '<span style="color:#006400;">' + val + '</span>';
        }

        this.smHistRetenc = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.smTiposNominas = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpHistRetenc = new Ext.grid.GridPanel({
            id: 'idgpHistRetenc',
            title: idioma.lbTitleGridHistRetenc,
            region: 'center',
            columns: [{
                header: 'idhisretencionpersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idhisretencionpersona'
            }
                , {
                    header: 'N&oacute;mina',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'numeronomina',
                    renderer: centrarValor
                }
                , {
                    header: 'No. Comprobante Operaciones',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'numerocomprobanteoperaciones',
                    renderer: centrarValor
                }
                , {
                    header: 'Retenido',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'retenido',
                    renderer: centrarValor
                }
                , {
                    header: 'Saldo del adeudo',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'saldodeladeudo',
                    renderer: centrarValor
                }
                , {
                    header: 'Fecha de la operaci&oacute;n',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'fechaoperacion',
                    renderer: centrarValor
                }
                , {
                    header: 'Retenci&oacute;n pendiente',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'retencionpendiente',
                    renderer: centrarValor
                }
                , {
                    header: 'Saldo del adeudo pendiente',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'saldodeladeudopendiente',
                    renderer: centrarValor
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '70%',
            viewConfig: {forceFit: true},
            store: modelo.storeRetencHist,
            sm: this.smHistRetenc,
            loadMask: {msg: idioma.lbMaskGridCargando},
            tbar: [this.btnDatos],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.storeRetencHist,
                displayInfo: true
            }),
        });

        this.tpHisRetenciones = new Ext.TabPanel({
            height: '100%',
            width: '60%',
            region: 'east',
            activeTab: 0,
            layoutOnTabChange: true,
            border: true,
            hideBorders: true,
            frame: true,
            items: [
                {
                    id: 'tabActual',
                    title: 'Retenciones',
                    region: 'center',
                    layout: 'ux.row',
                    items: [{
                        rowHeight: .3,
                        width: '100%',
                        border: false,
                        layout: 'fit',
                        tbar: [this.btnAdicionarRetenc, this.btnModificarRetenc, this.btnEliminarRetenc, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', this.btnComprobante, ' ', ' ', ' ', ' ', this.btnCondicionesRetenc, ' ', ' ', ' ', this.btnMenuCuadrar,'->', this.btnExportarRetenciones, this.btnImportar, this.btnAyuda],
                        items: [this.gpRetenc]
                    }, {
                        rowHeight: .7,
                        width: '100%',
                        border: false,
                        layout: 'fit',
                        items: [this.gpHistRetenc]
                    }],
                    keys: [
                        {
                            key: Ext.EventObject.DELETE,
                            stopEvent: true,
                            fn: function () {
                                self.btnEliminarRetenc.handler();
                            }
                        }, {
                            key: 'i',
                            alt: true,
                            stopEvent: true,
                            fn: function () {
                                self.btnAdicionarRetenc.handler();
                            }
                        }, {
                            key: 'm',
                            alt: true,
                            stopEvent: true,
                            fn: function () {
                                self.btnModificarRetenc.handler();
                            }
                        }
                    ]
                },
                {
                    id: 'tabHistorico',
                    title: 'Histórico de retenciones',
                    region: 'center',
                    layout: 'ux.row',
                    tbar: [this.btnEliminarRetencHist],
                    items: [{
                        rowHeight: .3,
                        width: '100%',
                        border: false,
                        layout: 'fit',
                        items: [this.gpRetencHistorico]
                    }, {
                        rowHeight: .7,
                        width: '100%',
                        border: false,
                        layout: 'fit',
                        items: [this.gpHistOperacionRetenc]
                    }],
                    keys: [
                        {
                            key: Ext.EventObject.DELETE,
                            stopEvent: true,
                            fn: function () {
                                self.btnEliminarRetencHist.handler();
                            }
                        }
                    ]
                    //  items: [this.gpRetencHistorico]
                },

            ]
        });

        /**************** botones personas de alta ******************************************************/
        this.btnAceptarPersonas = new Ext.Button({
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: false,
            iconCls: 'aceptar'
        });
        
        this.btnAdicionarPersonas = new Ext.Button({
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Adicionar persona(<b>Alt + I</b>>).',
            disabled: false,
            iconCls: 'adicionar',
            
        });

        this.btnEliminarPersonas = new Ext.Button({
            id: 'btnEliminarPersonas',
            text: 'Eliminar',
            tooltip: 'Eliminar',
            disabled: true,
            iconCls: 'eliminar'
        });

        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar persona(s)',

        });

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscarpersonass',
            allowBlank: true,
            minLength: 3,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar...',
            name: 'tfbuscador',
            // Acción para la busqueda con el Enter
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == 13) {
                        modelo.storePersRetenc.load({
                            params: {
                                identidad: this.idestructura,
                                start: 0,
                                limit: 15,
                                texto: this.tfbuscar.getValue()
                            }
                        });
                    }
                }.createDelegate(this)
            }
        });

        this.btnLimpiar = new Ext.Button({
            disabled: false,
            id: 'btnLimpiar',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtros',

        });
        /**************** botones personas de baja ******************************************************/
        this.btnBuscarBajas = new Ext.Button({
            disabled: false,
            id: 'btnBuscarBajas',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar persona(s) bajas',
        });
        this.tfbuscarBajas = new Ext.form.TextField({
            id: 'tfbuscarBajas',
            allowBlank: true,
            minLength: 3,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar...',
            name: 'tfbuscador',
             // Acción para la busqueda con el Enter
             listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == 13) {
                        modelo.storePersRetencBaj.load({
                            params: {
                                identidad: this.idestructura,
                                start: 0,
                                limit: 15,
                                texto: this.tfbuscarBajas.getValue()
                            }
                        });
                    }
                }.createDelegate(this)
            }
        });
        
        this.btnLimpiarBajas = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarBajas',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtros',
        });
        /***************************** personas retenciones baja *************************/
        this.gidPanelNumPersonasBaja = new Ext.grid.RowNumberer();       
        this.smPersonasRetencionBaja = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gpPersonasRetencionBajas = new Ext.grid.GridPanel({
            id: 'gpPersonasRetencionBajas',
            region: 'center',
            border: false,
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            height: '100%',
            columns: [this.smPersonasRetencionBaja, this.gidPanelNumPersonasBaja, 
                {
                    header: 'Cod. contable',
                    width: 60,
                    sortable: true,
                    dataIndex: 'cdgocontable',
                    renderer: formatearColoresBajas
                }, {
                    header: 'No. identidad',
                    width: 100,
                    sortable: true,
                    dataIndex: 'numero',
                    renderer: formatearColoresBajas
                }, {
                    header: 'Nombre',                  
                    width: 100,
                    sortable: true,
                    dataIndex: 'nombre',
                    renderer: formatearColoresBajas
                }, {
                    header: 'Segundo nombre',                  
                    width: 100,
                    sortable: true,
                    dataIndex: 'snombre',
                    renderer: formatearColoresBajas
                }, {
                    header: 'Primer apellido',                  
                    width: 100,
                    sortable: true,
                    dataIndex: 'papel',
                    renderer: formatearColoresBajas
                 }, {
                    header: 'Segundo apellido',                  
                    width: 100,
                    sortable: true,
                    dataIndex: 'sapel',
                    renderer: formatearColoresBajas
                }, {
                    header: 'Plantilla nominal',
                    width: 100,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'plantillanominal',
                    renderer: fnSeleccionarPlantilla
                }               
            ],
            tbar: ['Buscar persona:', this.tfbuscarBajas, this.btnBuscarBajas, this.btnLimpiarBajas],
            view: new Ext.grid.GroupingView({groupTextTpl: '{text}'}),
            store: modelo.storePersRetencBaj, 
            sm: this.smPersonasRetencionBaja,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storePersRetencBaj,
                displayInfo: true
            })
        });

        function formatearColoresBajas(val, metaData, record, rowIndex, colIndex, store) {
            return '<span style="color:red;">' + val + '</span>';
            ;
        }

        //Panel listado personas bajas
        this.panelPersonasBajas = new Ext.Panel({
            id: 'panelPersonasBajas',
            title: 'Listado personas bajas',
            height: '100%',
            width: '50%',
            region: 'center',
            split: true,
            border: false,
            layout: 'border',
            items: [this.gpPersonasRetencionBajas]
        });
        /******** bentana gpPersonas del listado de personas al adicionar *******************************/
        this.winPersonas = new Ext.Window({
            title: 'Adicionar personas',
            closeAction: 'hide',
            height: 400,
            width: 600,
            constrain: true,
            resizable: true,
            layout: 'fit',
            items: [this.gpPersonas],
            buttons: [this.btnAceptarPersonas]
        });
        /***************************** personas retenciones alta *************************/
        this.smPersonasRetencionAlta = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gidPanelNumPersonasAlta = new Ext.grid.RowNumberer();

        //Grid de listado personas con retencion
        this.gpPersonasRetencionAlta = new Ext.grid.GridPanel({
            id: 'gpPersonasRetencionAlta',
            title:'',
            region: 'center',
            border: false,
            layout: 'fit',          
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            heigth: '400%',         
            modulo: 'NOMINA',
            funcionalidad: 'CESP',
            esretencion: 1,
            identidad: this.idestructura,
            columns: [this.smPersonasRetencionAlta, this.gidPanelNumPersonasAlta,
                {
                    header: 'Cod. contable',
                    width: 60,
                    sortable: true,
                    dataIndex: 'cdgocontable',
                    renderer: formatearColores
                }, {
                    header: 'No. identidad',
                    width: 80,
                    sortable: true,
                    dataIndex: 'numid',
                    renderer: formatearColores
                }, {
                    header: 'Nombre',                  
                    width: 79,
                    sortable: true,
                    dataIndex: 'nombre',
                   renderer: formatearColores
                }, {
                    header: 'Segundo nombre',                  
                    width: 70,
                    sortable: true,
                    dataIndex: 'snombre',
                    renderer: formatearColores
                }, {
                    header: 'Primer apellido',                  
                    width: 80,
                    sortable: true,
                    dataIndex: 'papel',
                    renderer: formatearColores
                }, {
                    header: 'Segundo apellido',                  
                    width: 80,
                    sortable: true,
                    dataIndex: 'sapel',
                    renderer: formatearColores
                }, {
                 
                    header: 'Cargo', 
                    width: 200, 
                    sortable: true, 
                    dataIndex: 'denomcargo', 
                    renderer: formatearColores
                }, {
                    header: 'Plantilla nominal',
                    width: 80,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'plantillanominal',
                    renderer: fnSeleccionarPlantilla
                }
            ],
            tbar: [this.btnAdicionarPersonas, this.btnEliminarPersonas, '|', 'Buscar persona:', this.tfbuscar, this.btnBuscar,  this.btnLimpiar, this.btnExportarRetencionesTodasPersonas],
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({groupTextTpl: '{text}'}),           
            store: modelo.storePersRetenc,
            sm: this.smPersonasRetencionAlta,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storePersRetenc,
                displayInfo: true
            })
        });

        function formatearColores(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('iddatretencionpersona') == null) {
                return '<span style="color:blue;">' + val + '</span>';
            } else {
                if (record.get('saldoentiempo') >= 20) {
                    return '<span style="color:red;">' + val + '</span>';
                } 
                else {
                    return '<span style="color:green;">' + val + '</span>';
                }
            }
            return val;
        }
        function fnSeleccionarPlantilla(val, metaData, record, rowIndex, colIndex, store) {
            return '<span style="color:black;">' + val.split("-")[1] + '</span>';
        }

        //Panel listado personas altas
        this.panelPersonasAltas = new Ext.Panel({
            id: 'panelPersonasAltas',
            title: 'Listado personas altas',
            height: '100%',
            width: '50%',
            region: 'center',
            split: true,
            border: false,
            layout: 'border',
            items: [this.gpPersonasRetencionAlta]
        });

        //TabPanel de las pestañas de las personas altas y bajas por entidades.
        this.tabPanelPersonasSubmayor = new Ext.TabPanel({
            id: 'tabpersonassubmayor',
            border: false,
            activeTab: 0,
            region: 'center',
            items: [
                this.panelPersonasAltas,
                this.panelPersonasBajas
            ]
        });
        //Ventana para gestionar las retenciones de las personas altas y bajas por entidades.
        this.winGestRetenciones = new Ext.Window({
            title: idioma.lbTitleWinGestRetenciones,
            modal: true,
            height: '100%',
            width: '100%',
            closeAction: 'hide',
            constrain: true,
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'border',
            items: [this.tabPanelPersonasSubmayor, this.tpHisRetenciones]          
        });

        /*CONDICIONES RETENCIONES*/
        //Grid de Tipos de Nominas
        this.gpTiposNominas = new Ext.grid.GridPanel({
            id: 'idgpTiposNominas',
            title: idioma.lbTitleGridTiposNominas,
            region: 'center',
            columns: [
                {
                    header: 'idtiponomina',
                    hidden: true,
                    //hideable: false,
                    dataIndex: 'idtiponomina'
                },
                {
                    header: 'Tipo n&oacute;mina',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominaciontiponomina',
                    renderer: pintarTexto
                }
            ],
            //stripeRows: true,
            autoScroll: true,
            border: true,
            width: '50%',
            heigth: 400,
            viewConfig: {forceFit: true},
            store: modelo.stTiposNominas,
            sm: this.smTiposNominas,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.stTiposNominas,
                displayInfo: true
            }),
        });

        //Boton para limpiar las formulas de un periodo de pago
        this.btnLimpiarFormulas = new Ext.Button({
            id: 'idbtnEliminarRetencHist',
            text: 'Limpiar',
            tooltip: 'Limpiar f&oacute;rmulas',
            iconCls: 'limpiar',
            disabled: true
        });

        //Text Areas para definir las formulas
        this.taCondicionRetenciones = new Ext.form.TextArea({
            id: 'idTaCondicionRetenciones', fieldLabel: idioma.lbTitleTaCondicionRetenc,
            name: 'condicionretenc', allowBlank: true,
            anchor: '99%',
            height: 100,
            disabled: true,
            blankText: idioma.lbErrorCampoVacio
        });

        this.taLimiteMaximo = new Ext.form.TextArea({
            id: 'idTaLimiteMaximo', fieldLabel: idioma.lbTitleTaLimiteMaximo,
            name: 'limitemaximo', allowBlank: true,
            anchor: '99%',
            height: 100,
            disabled: true,
            blankText: idioma.lbErrorCampoVacio
        });

        //Formulario de formulas.
        this.formFormulas = new Ext.FormPanel({
            id: 'idformFormulas',
            labelAlign: 'top',
            region: 'east',
            frame: true,
            width: '50%',
            heigth: 400,
            border: true,
            bodyStyle: {
                padding: '0px 0px 10px 0px'
            },
            tbar: [' ', ' ', this.btnLimpiarFormulas],
            items: [{
                xtype: 'fieldset',
                title: 'F&oacute;rmulas',
                autoHeight: true,
                region: 'center',
                bodyStyle: {
                    padding: '0px 0px 0px 7px'
                },
                items: [{
                    layout: 'column',
                    items: [
                        {columnWidth: .99, layout: 'form', items: [this.taCondicionRetenciones]},
                        {columnWidth: .99, layout: 'form', items: [this.taLimiteMaximo]}
                    ]
                }]
            }],
        });

        this.btnCancelarCondic = new Ext.Button({
            id: 'idbtnCancelarCondic',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'dfFFinRetenc'
        });

        this.btnGuardarCondic = new Ext.Button({
            id: 'idbtnGuardarCondic',
            iconCls: 'guardar',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardar,
            prevTab: 'dfFFinRetenc',
            nextTab: 'idbtnAplicarRetenc'
        });

        this.cmboxOperaciones = new Ext.form.ComboBox({
            tid: 'cmboxOperaciones', 
                msgTarget: 'qtip', 
                enableQtip: true,
                store: modelo.cmbOperaciones,
                fieldLabel:'Operaciones Contables', 
                mode: 'local',
                displayField: 'operacion', 
                hiddenName: 'idoperacion', 
                valueField: 'idoperacion',
                typeAhead: true, 
                triggerAction: 'all', 
                forceSelection: true,
                emptyText: 'Seleccione...', 
                anchor: '60%', 
                allowBlank: true, 
                name: 'idoperacion'
        });

        this.formOperaciones = new Ext.FormPanel({
            id: 'formOperaciones',
            region: 'north',
            labelAlign: 'top',
            frame: true,
            width: '100%',
            height: 60,
            border: true,
            bodyStyle: {
                padding: '0px 0px 10px 0px'
            },
            items: [this.cmboxOperaciones],
        });

        this.pCondRetenc = new Ext.Panel({
            region: 'center',
            layout: 'border',
            border: false,
            height: '60%',
            width: '100%',
            items: [this.gpTiposNominas, this.formFormulas]
        });

        //Ventana para gestionar las condiciones de las retenciones.
        this.winGestCondicionesRetenc = new Ext.Window({
            title: idioma.lbTitlewinGestCondicionesRetenc,
            modal: true,
            width: 900,
            height: 450,
            closeAction: 'hide',
            closable: true,
            resizable: true,
            layout: 'border',
            items: [this.formOperaciones, this.pCondRetenc],
            buttons: [this.btnCancelarCondic, this.btnGuardarCondic]
        });

        //Campos de gestionar retenciones.
        this.cbTipoRetenc = new Ext.form.ComboBox({
            id: 'idcbTipoRetenc', fieldLabel: idioma.lbColTipoRetenc,
            valueField: 'idtiporetencion', prevTab: 'idbtnAceptarRetenc',
            nextTab: 'idtfSaldoInicial',
            displayField: 'denominacion', hiddenName: 'idtiporetencion',
            allowBlank: false, mode: 'local',
            store: modelo.storeTipoRetencion, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.chbActivo = new Ext.form.Checkbox({
            id: 'idchbActivo',
            fieldLabel: 'Activo',
            bottonAlign: 'center',
            name: 'activo', anchor: '90%',
            prevTab: 'idcbTipoRetenc',
            nextTab: 'idtfSaldoInicial'

        });

        this.tfSaldoInicial = new Ext.form.NumberField({
            id: 'idtfSaldoInicial', 
            fieldLabel: idioma.lbColSaldoInicial,
            name: 'saldoinicial', 
            allowBlank: false,            
            regex: /^([1-9]+(\d*)?)+$/,
            anchor: '93%',
            blankText: idioma.lbErrorCampoVacio,
        });

        this.tfMensualidad = new Ext.form.NumberField({
            id: 'idtfMensualidad', fieldLabel: idioma.lbColMensualidad,
            name: 'mensualidad', allowBlank: false, anchor: '90%',
            blankText: idioma.lbErrorCampoVacio,
            allowBlank: false,            
            regex: /^([1-9]+(\d*)?)+$/,
        });

        this.tfUMensualidad = new Ext.form.NumberField({
            id: 'idtfUMensualidad', fieldLabel: idioma.lbColUltMensualidad,
            name: 'ultmensualidad', allowBlank: true, anchor: '90%',
            allowBlank: false,            
            regex: /^([1-9]+(\d*)?)+$/,
            // blankText:idioma.lbErrorCampoVacio,
        });

        this.tfReferencia = new Ext.form.TextField({
            id: 'idtfReferencia', fieldLabel: idioma.lbColReferencia,
            name: 'refdocumentoacredita', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
        });

        this.dfFDocumento = new Ext.form.DateField({
            id: 'iddfFDocumento', fieldLabel: idioma.lbColFechaDocumento,
            name: 'fechadocumento', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%'
        });

        this.dfFInicioRetenc = new Ext.form.DateField({
            id: 'dfFInicioRetenc', fieldLabel: idioma.lbColDesde,
            name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'dfFFinRetenc'
        });

        this.dfFFinRetenc = new Ext.form.DateField({
            id: 'dfFFinRetenc', fieldLabel: idioma.lbColHasta,
            name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'dfFInicioRetenc',
            prevTab: 'iddfFInicioRetenc', nextTab: 'idbtnCancelarRetenc'
        });

        this.cbxcuenta = new Ext.contabilidad.util.linkedCombo({
            store: modelo.stcuenta,
            fieldLabel: 'Cuenta contable',
            displayField: 'denom',
            valueField: 'cuentacontable',
            name: 'denom',
            maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            maxLength: 255,
            // disabled: true,
            listHeight: 200,
            tipocta: '',
            id: 'lnkcuenta',
            lazyRender: true,
            allowBlank: true,
            // buttons: [this.btnAddCampo],
            fnCreateNew: Ext.emptyFn
        });

        this.cuentacontable = new Ext.form.Hidden({
            id: 'cuentacontable',
            name: 'cuentacontable',
            allowBlank: false,
            hidden: true
        });

        //Formulario de retenciones.
        this.formularioRetenc = new Ext.FormPanel({
            id: 'idformularioRetenc',
            labelAlign: 'top',
            frame: true,
            width: 380,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .60, layout: 'form', items: [this.cbTipoRetenc]},
                    {columnWidth: .15, layout: 'form', items: [this.chbActivo]},
                    {columnWidth: .25, layout: 'form', items: [this.tfSaldoInicial]},
                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .33, layout: 'form', items: [this.tfMensualidad]},
                    {columnWidth: .33, layout: 'form', items: [this.tfUMensualidad]},
                    {columnWidth: .33, layout: 'form', items: [this.tfReferencia]}
                ]
            },
                this.cuentacontable,
                this.cbxcuenta,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.dfFDocumento]},
                        {columnWidth: .33, layout: 'form', items: [this.dfFInicioRetenc]},
                        {columnWidth: .33, layout: 'form', items: [this.dfFFinRetenc]}
                    ]
                }
            ],
        });

        //Botones de la ventana de adicionar retenciones.
        this.btnCancelarRetenc = new Ext.Button({
            id: 'idbtnCancelarRetenc',
            iconCls: 'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'dfFFinRetenc',
            nextTab: 'idbtnAplicarRetenc',
        });

        this.btnAplicarRetenc = new Ext.Button({
            id: 'idbtnAplicarRetenc',
            iconCls: 'aplicar',
            //icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarRetenc',
            nextTab: 'idbtnAceptarRetenc',
        });

        this.btnAceptarRetenc = new Ext.Button({
            id: 'idbtnAceptarRetenc',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarRetenc',
            nextTab: 'idcbTipoRetenc',
        });

        //Ventana de adicionar y modificar retención.
        this.ventanaRetenc = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioRetenc],
            buttons: [this.btnCancelarRetenc, this.btnAplicarRetenc, this.btnAceptarRetenc],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarRetenc.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarRetenc.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarRetenc.handler();
                    }
                }
            ]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestretencion', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Pago.Retencion.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Pago.Retencion.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Pago.Retencion.Controlador.init(idioma, vista, modelo);

    
    UCID.portal.cargarAcciones(window.frameElement.id, function (res) {      
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'idbtnCondicionesRetenc') {
                compartimentarCondicionesretenciones = true;
            }
        }
    });
});
