Ext.ns('Pvd.Nomina.Pagos.ElaborarPagos');
//Tipo de layout auxiliar
Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize: true,

    // private
    isValidParent: function (c, target) {
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout     : function (ct, target) {
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

Pvd.Nomina.Pagos.ElaborarPagos.Vista = {
    init: function (perfil, idioma, modelo) {
        this.filasSeleccionadas = null;
        var self = this;
        this.recordperiodopagoexportarseleccionado = null;

        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5,
            cargarsubordinacion : true
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: idioma.btnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar'
        });

        //Vista para el componente Buscar estructura 
        this.winEstEntidades = new Ext.Window({
            title: idioma.winEstructura,
            modal: true,
            height: 350,
            width: '30%',
            constrain: true,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pEstEntidades],
            buttons: [this.btnAceptarEntidades],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEntidades.handler();
                    }
                }
            ]
        });

        this.btnAdicionarPeriodo = new Ext.Button({
            id: 'btnAdicionarPeriodo',
            //text: idioma.btnAdicionar,
            tooltip: 'Ad<u>i</u>cionar per&iacute;odo de pago (<b>Alt+I</b>)',
            disabled: true,
            // icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar'
        });

        this.btnModificarPeriodo = new Ext.Button({
            id: 'btnModificarPeriodo',
            //text: idioma.btnAdicionar,
            tooltip: '<u>M</u>odificar per&iacute;odo de pago (<b>Alt+M</b>)',
            disabled: true,
            // icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar'
        });

        this.btnEliminarPeriodo = new Ext.Button({
            id: 'btnEliminarPeriodo',
            //text: idioma.btnEliminar,
            tooltip: 'Eliminar per&iacute;odo de pago (<b>DEL</b>)',
            disabled: true,
            // icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar'
        });

        this.btnConcluirPeriodo = new Ext.Button({
            id: 'btnConcluirPeriodo',
            //text: idioma.btnEliminar,
            tooltip: 'Concluir per&iacute;odo de pago',
            disabled: true,
            //icon: perfil.dirImg + 'terminar.png',
            iconCls: 'terminar'
        });

        this.gpConfigPeriodosPagos = new Ext.grid.EditorGridPanel({
            store: modelo.stConfigPeriodosPago,
            region: 'center',
            border: false,
            loadMask: {text: idioma.lbcargando},
            width: 500,
            columns: [
                {header: 'iddesgloseperiodos', dataIndex: 'iddesgloseperiodos', width: 100, hidden: true},
                {header: 'idperiodostipospago', dataIndex: 'idperiodostipospago', width: 100, hidden: true},
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'idperiodopago', dataIndex: 'idperiodopago', width: 100, hidden: true},
                {header: 'Fecha inicio', dataIndex: 'fechainicioperiodo', width: 200},
                {header: 'Fecha fin', dataIndex: 'fechafinperiodo', width: 200},
                {header: 'A&ntilde;o', dataIndex: 'anno', width: 100, hidden: true, renderer: fnAnno}
            ],
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })
        });

        this.btnAceptarConfigPeriodos = new Ext.Button({
            id: 'btnAceptarConfigPeriodos',
            iconCls: 'aceptar',
            disabled: true,
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)'
        });

        this.btnCancelarConfigPeriodos = new Ext.Button({
            id: 'btnCancelarConfigPeriodos',
            iconCls: 'cancelar',
            disabled: false,
            text: 'Cancelar',
            closeAction: 'hide',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)'
        });

        this.winConfigPeriodosPago = new Ext.Window({
            title: "Listado de per&iacute;odos de pago",
            modal: true,
            height: 300,
            width: 500,
            constrain: true,
            resizable: false,
            layout: 'border',
            closeAction: 'hide',
            items: [this.gpConfigPeriodosPagos],
            buttons: [this.btnCancelarConfigPeriodos, this.btnAceptarConfigPeriodos],
        });


        this.cbTipoPago = new Ext.form.ComboBox({
            id: 'cbTipoPagoep',
            fieldLabel: idioma.lbtipopago,
            valueField: 'idtipopago',
            displayField: 'denominacion', hiddenName: 'idtipopago',
            allowBlank: false,
            mode: 'local',
            width: 250,
            store: modelo.stTipoPago,
            emptyText: 'Seleccione...',
            blankText: idioma.lbestecampoobligatorio,
            readOnly: true,
            triggerAction: 'all'
        });

        this.cbPeriodoPago = new Ext.form.ComboBox({
            id: 'cbPeriodoPago',
            fieldLabel: idioma.lbcbperiodopago,
            valueField: 'idperiodopago',
            displayField: 'denominacion', hiddenName: 'idperiodopago',
            allowBlank: false,
            mode: 'local',
            store: modelo.stPeriodoPago,
            emptyText: 'Seleccione...',
            blankText: idioma.lbestecampoobligatorio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '98%'
        });

        this.cbMes = new Ext.form.ComboBox({
            id: 'cbMes',
            fieldLabel: idioma.lbmes,
            valueField: 'valor',
            displayField: 'denominacion', hiddenName: 'valor',
            allowBlank: false,
            mode: 'local',
            store: modelo.stMes,
            emptyText: 'Seleccione...',
            blankText: idioma.lbestecampoobligatorio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '98%'
        });

        this.dfFechaPago = new Ext.form.DateField({
            id: 'dfFechaPago', fieldLabel: 'Fecha de pago',
            name: 'fechapago', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            blankText: idioma.lbestecampoobligatorio,
            invalidText: idioma.invalidTextFecha,
            value: new Date().format('d/m/Y'),
            anchor: '98%'
        });

        this.dfFInicioPeriodo = new Ext.form.DateField({
            id: 'dfFInicioPeriodo', fieldLabel: idioma.lbfinicio,
            name: 'fechainicioperiodo', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            blankText: idioma.lbestecampoobligatorio,
            invalidText: idioma.invalidTextFecha,
            anchor: '98%',
            xtype: 'datefield',

            vtype: 'daterange',
            endDateField: 'dfFFinPeriodo'
        });

        this.dfFFinPeriodo = new Ext.form.DateField({
            id: 'dfFFinPeriodo', fieldLabel: idioma.lbffin,
            name: 'fechafinperiodo', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            blankText: idioma.lbestecampoobligatorio,
            invalidText: idioma.invalidTextFecha,
            anchor: '98%',
            xtype: 'datefield',
            vtype: 'daterange',
            //startDateField: 'dfFInicioPeriodo'
        });

        this.fpPeriodosPago = new Ext.FormPanel({
            id: 'fpPeriodosPago',
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.cbPeriodoPago, this.dfFechaPago]},
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.cbMes, this.dfFInicioPeriodo, this.dfFFinPeriodo]
                        }
                    ]
                }
            ],
        });

        //Botones de la ventana de tipos de tarifa
        this.btnCancelarPeriodo = new Ext.Button({
            id: 'btnCancelarPeriodo',
            iconCls: 'cancelar',
            // icon: perfil.dirImg + 'cancelar.png',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            prevTab: 'idtfDescripTarifa',
            nextTab: 'idbtnAplicarTarifa',
        });

        this.btnAplicarPeriodo = new Ext.Button({
            id: 'btnAplicarPeriodo',
            iconCls: 'aplicar',
            //icon: perfil.dirImg + 'aplicar.png',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt+P</b>)',
            prevTab: 'idbtnCancelarTarifa',
            nextTab: 'idbtnAceptarTarifa',
        });

        this.btnAceptarPeriodo = new Ext.Button({
            id: 'btnAceptarPeriodo',
            iconCls: 'aceptar',
            // icon: perfil.dirImg + 'aceptar.png',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            prevTab: 'idbtnAplicarTarifa',
            nextTab: 'idtfDenomTarifa',
        });

        this.winPeriodo = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.fpPeriodosPago],
            buttons: [this.btnCancelarPeriodo, this.btnAplicarPeriodo, this.btnAceptarPeriodo],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarPeriodo.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarPeriodo.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarPeriodo.handler();
                    }
                }
            ]
        });

        this.formatoPeriodosPago = function (val, metadata, record, ri, ci) {

            if (ci == 11) {
                var i = modelo.stMes.find('valor', val);
                if (i != -1) {
                    val = modelo.stMes.getAt(i).data.denominacion;
                }
            }
            else if (ci == 8) {
                val = modelo.stPeriodoPago.getAt(modelo.stPeriodoPago.find('idperiodopago', record.data.idperiodopago)).data.denominacion;
            }


            if (record.data.estado == 1)
                return '<span style="color:blue;">' + val + '</span>';
            else if (record.data.estado == 2)
                return '<span style="color:green;">' + val + '</span>';
            else return val;
        }

        //Seleccion del año de periodos de pagos
        function fnAnno(val) {
            return val.split('-')[1];
        }


        this.gpPeriodosPagos = new Ext.grid.EditorGridPanel({
            store: modelo.stPeriodosPago,
            region: 'center',
            border: false,
            loadMask: {text: idioma.lbcargando},
            width: 200,
            columns: [
                {header: 'idelaborarpagos', dataIndex: 'idelaborarpagos', width: 100, hidden: true},
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'idperiodopago', dataIndex: 'idperiodopago', width: 100, hidden: true},
                {header: 'fechainicioperiodo', dataIndex: 'fechainicioperiodo', width: 100, hidden: true},
                {header: 'fechafinperiodo', dataIndex: 'fechafinperiodo', width: 100, hidden: true},
                {header: 'estado', dataIndex: 'estado', width: 100, hidden: true},
                {header: idioma.lbanyo, dataIndex: 'anyo', width: 100, hidden: true/*, renderer: fnAnno*/},
                {header: 'mesanyopago', dataIndex: 'mesanyopago', width: 100, hidden: true},
                {header: 'Per&iacute;odo', dataIndex: 'idperiodopago', width: 100, renderer: this.formatoPeriodosPago},
                {header: 'Rango fechas', dataIndex: 'periodopago', width: 150, renderer: this.formatoPeriodosPago},
                {header: idioma.lbfechapago, dataIndex: 'fechapago', width: 120, renderer: this.formatoPeriodosPago},
                {header: idioma.lbmes, dataIndex: 'mes', width: 150, hidden: true, renderer: this.formatoPeriodosPago}
            ],
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            tbar: [this.btnAdicionarPeriodo, this.btnModificarPeriodo, this.btnEliminarPeriodo, this.btnConcluirPeriodo, '->', idioma.lbtipopago, this.cbTipoPago],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminarPeriodo.handler();
                    }
                },
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionarPeriodo.handler();
                    }
                },
                {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnModificarPeriodo.handler();
                    }
                }
            ]
        });

        this.pPeriodospago = new Ext.Panel({
            title: idioma.lbperiodospago,
            region: 'west',
            layout: 'border',
            width: 500,
            collapsible: true,
            split: true,
            items: [this.gpPeriodosPagos]
        });

        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            modoview: 2,
            estado: 1
        });

        this.btnAceptarPeriodosPagosReferenciados = new Ext.Button({
            id: 'btnAdicionarPeriodosReferenciados',
            iconCls: 'adicionar',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Adicionar per&iacute;odos de pagos referenciados',
        });

        this.winPeriodosPagos = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            modal: true,
            height: 400,
            width: 700,
            closable: true,
            constrain: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'border',
            items: [this.objListarPeriodosPagos],
            buttons: [this.btnAceptarPeriodosPagosReferenciados]
        });

        this.btnAdicionarPeriodosReferenciados = new Ext.Button({
            id: 'btnAdicionarPeriodosReferenciados',
            iconCls: 'adicionar',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Adicionar per&iacute;odos de pagos referenciados',
            disabled: true
        });

        this.btnEliminarPeriodosReferenciados = new Ext.Button({
            id: 'btnEliminarPeriodosReferenciados',
            iconCls: 'eliminar',
            disabled: true,
            // icon: perfil.dirImg + 'eliminar.png',
            text: 'Eliminar',
            tooltip: 'Eliminar per&iacute;odos de pagos referenciados',
            disabled: true
        });

        var smcheck = new Ext.grid.CheckboxSelectionModel({
            multiSelect: true
        });

        this.gpPeriodosPagosReferenciados = new Ext.grid.EditorGridPanel({
            store: modelo.stPeriodosPagoReferenciados,
            region: 'center',
            border: false,
            loadMask: {text: idioma.lbcargando},
            width: 200,
            columns: [smcheck,
                {
                    header: 'idelaborarpagosreferenciados',
                    dataIndex: 'idelaborarpagosreferencia',
                    width: 100,
                    hidden: true
                },
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'idperiodopago', dataIndex: 'idperiodopago', width: 100, hidden: true},
                {header: 'fechainicioperiodo', dataIndex: 'fechainicioperiodo', width: 100, hidden: true},
                {header: 'fechafinperiodo', dataIndex: 'fechafinperiodo', width: 100, hidden: true},
                {header: 'estado', dataIndex: 'estado', width: 100, hidden: true},
                {header: idioma.lbanyo, dataIndex: 'anyo', width: 100, hidden: true},
                {header: 'mesanyopago', dataIndex: 'mesanyopago', width: 100, hidden: true},
                //{header: 'Per&iacute;odo', dataIndex: 'idperiodopago', width: 100, renderer: this.formatoPeriodosPago},
                {header: 'Tipo de pago', dataIndex: 'denomtipopago', width: 250, renderer: this.formatoPeriodosPago},
                {header: 'Rango fechas', dataIndex: 'periodopago', width: 150, renderer: this.formatoPeriodosPago},
                {header: idioma.lbfechapago, dataIndex: 'fechapago', width: 120, renderer: this.formatoPeriodosPago},
                {header: idioma.lbmes, dataIndex: 'mes', width: 150, hidden: true, renderer: this.formatoPeriodosPago}
            ],
            tbar: [this.btnAdicionarPeriodosReferenciados, this.btnEliminarPeriodosReferenciados],
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: smcheck
        });

        this.pPeriodospago = new Ext.Panel({
            title: idioma.lbperiodospago,
            region: 'center',
            layout: 'border',
            width: 500,
            collapsible: true,
            split: true,
            items: [this.gpPeriodosPagos]
        });

        this.pPeriodospagoReferenciados = new Ext.Panel({
            title: 'Periodos de pagos referenciados',
            region: 'south',
            layout: 'border',
            width: 500,
            disabled: true,
            //height: '50%',
            collapsible: true,
            split: true,
            items: [this.gpPeriodosPagosReferenciados]
        });

        this.pTodosPeriodospago = new Ext.Panel({
            region: 'west',
            layout: 'ux.row',
            width: 500,
            collapsible: true,
            split: true,
            items : [
                {
                    rowHeight: .60,
                    width    : '100%',
                    border   : false,
                    split    : true,
                    layout   : 'fit',
                    items    : [this.pPeriodospago]
                },
                {
                    rowHeight: .40,
                    width    : '100%',
                    border   : false,
                    split    : true,
                    layout   : 'fit',
                    items    : [this.pPeriodospagoReferenciados]
                }
            ]
        });

        this.btnAdicionarPersona = new Ext.Button({
            id: 'btnAdicionarPersona',
            iconCls: 'adicionar',
            // icon: perfil.dirImg + 'adicionar.png',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Ad<u>i</u>cionar personas (<b>Alt+I</b>)',
        });

        this.btnEliminarPersona = new Ext.Button({
            id: 'btnEliminarPersona',
            iconCls: 'eliminar',
            disabled: true,
            // icon: perfil.dirImg + 'eliminar.png',
            text: 'Eliminar',
            tooltip: 'Eliminar personas(<b>DEL</b>)'
        });

        this.btnExcluirPersona = new Ext.Button({
            id: 'btnExcluirPersona',
            iconCls: 'Excluir',
            disabled: true,
            // icon: perfil.dirImg + 'actualizar.png',
            text: 'Excluir',
            tooltip: 'Excluir personas de la n&oacute;mina'
        });

        this.btnIncluirPersona = new Ext.Button({
            id: 'btnIncluirPersona',
            iconCls: 'incluir',
            disabled: true,
            // icon: perfil.dirImg + 'incluir.png',
            text: 'Incluir',
            tooltip: 'Incluir personas excluidas, a la n&oacute;mina'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',

        });

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Causa de exclusi&oacute;n:</b> {causaexclusion}</p>'
            )
        });

        this.smPersonasPeriodosPagos = new Ext.grid.CheckboxSelectionModel({});

        this.smPersonasIncluidasPeriodosPagos = new Ext.grid.CheckboxSelectionModel({});

        this.formatoPersonaPeriodosPago = function (val, metadata, record, ri, ci) {
            if (record.data.excluido == 1) {
                return '<span style="color:red;">' + val + '</span>';
            }
            else return val;
        }

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            anchor: '90%',
            name: 'tfbuscador'
        });

        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar',
            // icon : perfil.dirImg + 'buscar.png',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar persona (<b>Alt+B</b>)'
        });

        this.gpPersonasPeriodosPagos = new Ext.grid.EditorGridPanel({
            store: modelo.stPersonasPeriodosPago,
            region: 'west',
            loadMask: {text: idioma.lbcargando},
            width: 600,
            disabled: true,
            split: true,
            cm: new Ext.grid.ColumnModel([this.expander, this.smPersonasPeriodosPagos, new Ext.grid.RowNumberer(),
                {header: 'idpersonaelaborarpagos', dataIndex: 'idpersonaelaborarpagos', width: 100, hidden: true},
                {header: 'idelaborarpagos', dataIndex: 'idelaborarpagos', width: 100, hidden: true},
                {header: 'idpersona', dataIndex: 'idpersona', width: 40, hidden: true},
                {header: 'excluido', dataIndex: 'excluido', width: 40, hidden: true},
                {header: 'idcausaexclusion', dataIndex: 'idcausaexclusion', width: 100, hidden: true},
                {header: 'Cod. contable', dataIndex: 'codcontable', width: 55},
                {header: 'CI', dataIndex: 'ci', width: 60},
                {
                    header: 'Nombre y apellidos',
                    dataIndex: 'nombreyapellidos',
                    width: 200,
                    renderer: this.formatoPersonaPeriodosPago
                },
                {header: 'Causa de exclusi&oacute;n', dataIndex: 'causaexclusion', width: 100, hidden: true},
                {
                    header: 'Plantilla nominal', hidden: true, dataIndex: 'nombreplantilla',
                    renderer: function (val) {
                        var arrval = val.split("-");
                        return '<span style="color:green;">' + arrval[1] + '</span>';
                    }
                }
            ]),
            plugins: [this.expander],
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
            }),
            sm: this.smPersonasPeriodosPagos,
            tbar: [this.btnAdicionarPersona, this.btnEliminarPersona, this.btnExcluirPersona, this.btnIncluirPersona, '-', this.tfbuscar, this.btnBuscar, '->', this.btnAyuda],
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stPersonasPeriodosPago,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminarPersona.handler();
                    }
                },
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionarPersona.handler();
                    }
                },
                {
                    key: 'b',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnBuscar.handler();
                    }
                },
                {
                    key: 'h',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAyuda.handler();
                    }
                }
            ]
        });

        this.gpPersonasExcluidas = new Ext.grid.EditorGridPanel({
            store: modelo.stPersonasExcluidas,
            region: 'center',
            loadMask: {text: idioma.lbcargando},
            width: 600,
            disabled: false,
            split: true,
            cm: new Ext.grid.ColumnModel([this.expander, this.smPersonasIncluidasPeriodosPagos,
                {header: 'idpersonaelaborarpagos', dataIndex: 'idpersonaelaborarpagos', width: 100, hidden: true},
                {header: 'idelaborarpagos', dataIndex: 'idelaborarpagos', width: 100, hidden: true},
                {header: 'idpersona', dataIndex: 'idpersona', width: 40, hidden: true},
                {header: 'excluido', dataIndex: 'excluido', width: 40, hidden: true},
                {header: 'idcausaexclusion', dataIndex: 'idcausaexclusion', width: 100, hidden: true},
                {
                    header: 'Nombre y apellidos',
                    dataIndex: 'nombreyapellidos',
                    width: 200,
                    renderer: this.formatoPersonaPeriodosPago
                },
                {header: 'Causa de exclusi&oacute;n', dataIndex: 'causaexclusion', width: 100, hidden: true}
            ]),
            plugins: [this.expander],
            viewConfig: {
                forceFit: true
            },
            sm: this.smPersonasIncluidasPeriodosPagos


        });

        this.pfichadelapersona = new Ext.pvd.persona.fichapersona.panelFichapersona({
            id: 'pfichadelapersona',
            region: 'north',
            idficha: 'pfichadelapers',
            height: 160,
            border: true,
            split: true,
            idCmp: 'pfichadelapersona'
        });

        this.gpCargos = new Ext.grid.GridPanel({
            title: 'Listado de cargos',
            collapsible: true,
            region: 'north',
            split: true,
            disabled: true,
            columns: [
                {header: 'Cargo', width: 300, sortable: true, dataIndex: 'denomcargo'},
                {header: 'Situaci&oacute;n laboral', width: 200, sortable: true, dataIndex: 'denomsituacionlaboral'},
                {header: 'idcargosocupados', width: 300, sortable: true, dataIndex: 'idcargosocupados', hidden: true},
                {header: 'idcargo', width: 300, sortable: true, dataIndex: 'idcargo', hidden: true},
                {
                    header: 'idsituacionlaboral',
                    width: 300,
                    sortable: true,
                    dataIndex: 'idsituacionlaboral',
                    hidden: true
                }
            ],
            stripeRows: true,
            width: '100%',
            heigth: 150,
            viewConfig: {forceFit: true},
            store: modelo.stCargos,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {msg: 'Cargando...'},
        });

        this.btnGuardarVariables = new Ext.Button({
            id: 'btnGuardarVariables',
            text: '<u>G</u>uardar',
            tooltip: '<u>G</u>uardar variables (<b>Alt+G</b>)',
            //icon: perfil.dirImg + 'guardar.png',
            iconCls: 'guardar'
        });

        this.expanderV = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Detalles:</b> {detalles}</p>'
            )
        });

        this.gpVariablesPersonas = new Ext.grid.EditorGridPanel({
            title: 'Variables',
            store: modelo.stVariablesPersona,
            region: 'center',
            loadMask: {text: idioma.lbcargando},
            width: '50%',
            split: true,
            disabled: true,
            columns: [this.expanderV,
                {
                    header: 'idvariablespersonaelaborarpagos',
                    dataIndex: 'idvariablespersonaelaborarpagos',
                    width: 100,
                    hidden: true
                },
                {header: 'idpersonaelaborarpagos', dataIndex: 'idpersonaelaborarpagos', width: 100, hidden: true},
                {
                    header: 'idvariableauxconceptospdformasysistemaspago',
                    dataIndex: 'idvariableauxconceptospdformasysistemaspago',
                    width: 100,
                    hidden: true
                },
                {header: 'idvariableauxiliarformula', dataIndex: 'idvariableauxiliarformula', width: 100, hidden: true},
                {
                    header: 'idconceptopercepciondescuento',
                    dataIndex: 'idconceptopercepciondescuento',
                    width: 100,
                    hidden: true
                },
                {header: 'origenvariable', dataIndex: 'origenvariable', width: 100, hidden: true},
                {header: 'Variables', dataIndex: 'variable', width: 100},
                {
                    header: 'Valor', dataIndex: 'valor', width: 100, editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999
                })
                },
                {header: 'Tipo', dataIndex: 'tipo', width: 100, hidden: true},
                {header: 'Detalles', dataIndex: 'detalles', width: 100, hidden: true}
            ],
            clicksToEdit: 1,
            viewConfig: {
                forceFit: true
            },
            plugins: [this.expanderV],
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            tbar: [this.btnGuardarVariables],
            keys: [
                {
                    key: 'g',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnGuardarVariables.handler();
                    }
                }
            ]
        });

        this.pCargosVariablesPersona = new Ext.Panel({
            region: 'center',
            layout: 'fit',//Aqui va un layout 'border'
            width: '50%',
            split: true,
            border: false,
            items: [this.gpCargos/*, this.gpVariablesPersonas*/]
        });

        this.pPersonaElaborarPago = new Ext.Panel({
            region: 'center',
            layout: 'border',
            width: '50%',
            border: false,
            split: true,
            items: [this.pfichadelapersona, this.gpPersonasPeriodosPagos, this.pCargosVariablesPersona]
        });

        this.btnAceptarFuentePersona = new Ext.Button({
            id: 'btnAceptarFuentePersona',
            iconCls: 'aceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        });

        this.rbEntidad = new Ext.form.Radio({
            fieldLabel: 'Entidad',
            id: 'rbEntidad',
            name: 'rb',
            inputValue: 1,
            checked: true
        });

        this.rbReporte = new Ext.form.Radio({fieldLabel: 'Reporte', id: 'rbReporte', name: 'rb', inputValue: 2});

        this.fpSelecFuentePersona = new Ext.FormPanel({
            id: 'fpSelecFuentePersona',
//            labelAlign: 'top',
            frame: true,
            width: 400,
            region: 'center',
            autoHeight: true,
            items: [
                this.rbEntidad, this.rbReporte
                /*{xtype: 'radiogroup', hideLabel: false, items: [this.rbEntidad, this.rbReporte]}*/
            ]
        });

        this.winSelecFuentePersona = new Ext.Window({
            title: 'Selecci&oacute;n de personas',
            modal: true,
            height: 120,
            width: 200,
            resizable: false,
            constrain: true,
            layout: 'border',
            closeAction: 'hide',
            items: [this.fpSelecFuentePersona],
            buttons: [this.btnAceptarFuentePersona],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarFuentePersona.handler();
                    }
                }
            ]
        });

        this.cbCausaExclusion = new Ext.form.ComboBox({
            id: 'cbCausaExclusion',
            fieldLabel: 'Causa de exclusi&oacute;n',
            valueField: 'idcausaexclusion',
            displayField: 'denominacion', hiddenName: 'idcausaexclusion',
            allowBlank: false,
            mode: 'local',
            store: modelo.stCausaExclusion,
            emptyText: 'Seleccione...',
            blankText: idioma.lbestecampoobligatorio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '98%'
        });

        this.fpCausaExclusion = new Ext.FormPanel({
            id: 'CausaExclusion',
            labelAlign: 'top',
            frame: true,
            width: 250,
            region: 'center',
            autoHeight: true,
            items: [this.cbCausaExclusion],
        });

        this.btnAceptarCausaExclusion = new Ext.Button({
            id: 'btnAceptarCausaExclusion',
            iconCls: 'aceptar',
            // icon: perfil.dirImg + 'aceptar.png',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        });

        this.winCausaExclusion = new Ext.Window({
            title: 'Seleccionar causa de exclusi&oacute;n',
            modal: true,
            height: 130,
            width: 250,
            resizable: false,
            constrain: true,
            layout: 'border',
            closeAction: 'hide',
            items: [this.fpCausaExclusion],
            buttons: [this.btnAceptarCausaExclusion],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarCausaExclusion.handler();
                    }
                }
            ]
        });

        this.winElaborarPago = new Ext.Window({
            title: idioma.winelaborarpago,
            modal: true,
            height: 600,
            width: 800,
            constrain: true,
            resizable: false,
            layout: 'border',
            closeAction: 'hide',
            items: [this.pTodosPeriodospago, this.pPersonaElaborarPago]
        });

        this.btnAceptarIncluirPersona = new Ext.Button({
            id: 'btnAceptarIncluirPersona',
            iconCls: 'aceptar',
            disabled: true,
            // icon: perfil.dirImg + 'aceptar.png',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        });

        this.btnCancelarIncluirPersona = new Ext.Button({
            id: 'btnCancelarIncluirPersona',
            iconCls: 'cancelar',
            disabled: false,
            icon: perfil.dirImg + 'cancelar.png',
            text: 'Cancelar',
            closeAction: 'hide',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
        });

        this.winIncluirPersona = new Ext.Window({
            title: 'Incluir personas a la n&oacute;mina ',
            modal: true,
            height: 400,
            width: 600,
            constrain: true,
            layout: 'fit',
            closeAction: 'close',
            items: [this.gpPersonasExcluidas],
            buttons: [this.btnCancelarIncluirPersona, this.btnAceptarIncluirPersona],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarIncluirPersona.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarIncluirPersona.handler();
                    }
                }
            ]
        });

    }
}
