/**
 Uso:Componente para listar los periodos por destajo
 * @extends   Ext.Panel
 * @xtype
 * @autor     Linea Capital Humano - Ing. Aroldo L. Hechavarría Hechavarría
 */
Ext.ns('Pvd.Nomina.Pagos.PagoDestajo');
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

});
var compartimentarTodos = true;
Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
Ext.QuickTips.init();

Pvd.Nomina.Pagos.PagoDestajo.Vista = {
    init: function (perfil, idioma, modelo) {
        _this = this;
        var flag = 0;
        var params = 0;
        this.identidad = (this.identidad) ? this.identidad : null;
 
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

        /*************************seleccionar periodo************ */
        this.btnAceptarTipoBusqueda = new Ext.Button({
            id: 'btnAceptarTipoBusqueda',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true
        });

        this.btnCancelarTipoBusqueda = new Ext.Button({
            id: 'btnCancelarTipoBusqueda',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.rbActual = new Ext.form.Radio({
            id: 'rbActual',
            boxLabel: 'Actual',
            name: 'tipobusqueda',
            inputValue: 1
        });

        this.rbHistorico = new Ext.form.Radio({
            id: 'rbHistorico',
            boxLabel: 'Hist&oacute;rico',
            name: 'tipobusqueda',
            inputValue: 2
        });

        this.rgTipoBusqueda = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.50, .50],
            style: 'padding-left: 20px;',
            items: [this.rbActual, this.rbHistorico]
        });

        this.formularioTipoBusqueda = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 500,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: 'Res&uacute;menes de los periodos',
                height: 80,
                width: '93%',
                region: 'center',
                items: [
                    this.rgTipoBusqueda
                ]
            }]
        });

        this.ventanaTipoBusqueda = new Ext.Window({
            region: 'center',
            title: 'Res&uacute;menes de los per&iacute;odos a destajo',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.formularioTipoBusqueda],
            bbar: ['->', this.btnCancelarTipoBusqueda, this.btnAceptarTipoBusqueda]
        });

        /*********************************bentana periodo destajo */
        this.btnAceptarPeriodosDestajos = new Ext.Button({
            id: 'btnAceptarPeriodosDestajos',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
        }); 

        this.cbTipoDestajo2 = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de destajo',
            valueField: 'idnomtipodestajo',
            displayField: 'denominacion', 
            hiddenName: 'valor',
            allowBlank: false, 
            mode: 'local',
            blankText: 'Este campo es obligatorio.', 
            readOnly: true,
            triggerAction: 'all',
            store: modelo.storeDestajo,
            anchor: '80%'
        });

        this.smPeriodoPagoDestajo = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });
        
        this.gpPeriodoPagoDestajo = new Ext.grid.GridPanel({
            region: 'center',
            clicksToEdit: 1,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            columns: [
                {
                    header: 'Rango fechas', 
                    dataIndex: 'periodo', 
                    width: 250,
                    renderer: formatearColores
                },
                {
                    header: 'Fecha cierre', 
                    dataIndex: 'fechacierre', 
                    width: 200,
                    renderer: formatearColores
                },
                {
                    header: 'Año', 
                    dataIndex: 'anno', 
                    width: 100,
                    sortable: true,
                    hidden: true,
                },
                {
                    header: 'fechainicio', 
                    dataIndex: 'fechainicio', 
                    hidden: true,
                },
                {
                    header: 'fechafin', 
                    dataIndex: 'fechafin', 
                    hidden: true,
                },
            ],
            sm: this.smPeriodoPagoDestajo,
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
            }),
            store: modelo.stPeriodosDestajo,
            loadMask: {msg: idioma.lbMaskGridCargando},
            tbar: ['Tipo destajo:', this.cbTipoDestajo2],
        });

        this.panelPeriodoPagoDestajo = new Ext.Panel({
            region: 'center',
            width: '100%',
            border: false,
            layout: 'fit',
            height: 250,
            items: [this.gpPeriodoPagoDestajo]
        });


        this.winPeriodosDestajos = new Ext.Window({
            closeAction: 'hide',
            layout: 'fit',
            title: 'Per&iacute;odos de Destajo',
            height: 400,
            width: 400,
            modal: true,
            constrain: true,
            items: [this.panelPeriodoPagoDestajo],
            buttons: [this.btnAceptarPeriodosDestajos]
        });

        /***************************Ventana adicionar persona */
        this.gpPersonas = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            heigth: '100%',
            width: '100%',
            modulo: 'NOMINA',
            funcionalidad: 'CESP',
            identidad: this.idestructura,
            singleSelect: false,
            cantidadPorPaginas: 5000
        });

        this.btnAceptarPersonas = new Ext.Button({
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar'
        });

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

        /***************************Ventana adicionar convenio */           
        this.btnCancelarConvenio = new Ext.Button({
            id: 'idbtnCancelarConvenio',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cancelar convenio'
        });

        this.btnAplicarConvenio = new Ext.Button({
            id: 'btnAplicarConvenio',
            iconCls: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Aplicar convenio'
        }); 

        this.btnAceptarConvenio = new Ext.Button({
            id: 'idbtnAceptarConvenio',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Aceptar convenio'
        });
        
        this.tfDenomConvenio = new Ext.form.TextField({
            id: 'idtfDenomConvenio',
            fieldLabel: 'Denominaci&oacute;n',
            tabIndex: 2,
            name: 'denominacion',
            allowBlank: false, 
            anchor: '80%',
            blankText: idioma.lbErrorCampoVacio,
            prevTab: 'idbtnAceptarConvenio',
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr,
            maxLength: 255,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            maxLengthText: idioma.lbMaxText_100
        });

        //Ventana con el monto a distribuir general
        this.tfImporteConvenio = new Ext.form.NumberField({
            name: 'Importe',
            fieldLabel: 'Importe',
            width: '100%',
            anchor: '80%',
            id: 'idtfImporteConvenio',
            allowBlank: false,
            decimalPrecision: 2,
        });

        this.dfFInicioConvenio = new Ext.form.DateField({
            id: 'iddfFInicioConvenio', 
            fieldLabel: 'Fecha inicio',
            tabIndex: 3, 
            name: 'fechainicio', 
            allowBlank: false,
            format: 'd/m/Y', 
            editable: true, 
            readOnly: false,
            value: new Date().format('d/m/Y'), 
            maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, 
            blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, 
            vtype: 'daterange',
            anchor: '80%', 
            endDateField: 'iddfFFinConvenio'
        });

        this.dfFFinConvenio = new Ext.form.DateField({
            id: 'iddfFFinConvenio', 
            fieldLabel: 'Fecha fin',
            tabIndex: 4, 
            name: 'fechafin', 
            xtype: 'datefield',
             allowBlank: true,
            format: 'd/m/Y', 
            editable: true, 
            readOnly: false,
            maxText: idioma.lbFechaMaxima, 
            minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, 
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', 
            anchor: '99%', 
            startDateField: 'iddfFInicioConvenio'
        });

        this.tfDescripConvenio = new Ext.form.TextArea({
            id: 'idtfDescripConvenio',
            fieldLabel: 'Descripci&oacute;n',
            tabIndex: 5,
            name: 'descripcion',
            allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_225,
            anchor: '99%',
            prevTab: 'iddfFFinConvenio',
            nextTab: 'idbtnCancelarConvenio',
            blankText: idioma.lbErrorCampoVacio
        });
        
        this.cbObra = new Ext.form.ComboBox({
            id: 'cbObra',
            fieldLabel: 'Obra',
            displayField: 'denominacion', 
            hiddenName: 'valor',
            allowBlank: false, 
            mode: 'local',
            blankText: 'Este campo es obligatorio.', 
            readOnly: true,
            triggerAction: 'all',
            store: modelo.storeObra,
            anchor: '99%'
        });

        this.formularioConvenio = new Ext.FormPanel({
            id: 'idformlarioConvenio',
            labelAlign: 'top',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .56, layout: 'form', items: [this.tfDenomConvenio]},
                        {columnWidth: .44, layout: 'form', items: [this.cbObra]}

                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .56, layout: 'form', items: [this.tfImporteConvenio]}

                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .56, layout: 'form', items: [this.dfFInicioConvenio]},
                        {columnWidth: .44, layout: 'form', items: [this.dfFFinConvenio]}

                    ]
                },
                this.tfDescripConvenio
            ]
        });
        
        this.winAdicionarConvenio = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            autoValidate: true,
            validateDefault: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioConvenio],
            buttons: [this.btnCancelarConvenio, this.btnAplicarConvenio, this.btnAceptarConvenio],
        });

        /***********Gestionar configuracion *********************** */
        //panel formulario
        this.smConfiguracion = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });
        this.rowaction = new Ext.grid.RowActions({
            actions: [
                {
                    id: 'eliminar',
                    tooltip: 'Eliminar',
                    iconCls:'icondistra-eliminar',
                    marginLeft: 5,
                    width: 16,
                    height: 16
                }
            ]
        });

        this.gpConfiguracion = new Ext.grid.GridPanel({
            id: 'gpConfiguracion',
            title: '',
            region: 'center',
            clicksToEdit: 1,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            columns: [this.smConfiguracion, 
                { header: '<center>' + 'Denominaci&oacute;n' + '</center>', width: 100, sortable: true, dataIndex: 'denominacion'},
                { header: '<center>' + 'Orden' + '</center>',width: 50, sortable: true, dataIndex: 'orden'},
                { header: '<center>' + 'Tipo de entrada' + '</center>',width: 100, sortable: true, dataIndex: 'tipoentrada'},
                { header: '<center>' + 'Entrada' + '</center>',width: 100, sortable: true, dataIndex: 'entrada'},
                { header: '<center>' + 'F&oacute;rmula' + '</center>',width: 100, sortable: true, dataIndex: 'denomformula'},
                { header: '<center>' + 'Descripci&oacute;n' + '</center>',width: 100, sortable: true, dataIndex: 'descripcion'},
                this.rowaction
            ],
            sm: this.smConfiguracion,   
            plugins: [this.rowaction],    
            viewConfig: {forceFit: true},
            store: modelo.storeConfiguracion,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeConfiguracion,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        this.panelConfiguracion = new Ext.Panel({
            id: 'panelConfiguracion',
            region: 'center',
            width: '100%',
            border: false,
            layout: 'fit',
            height: 250,
            items: [this.gpConfiguracion]
        });

        this.btnConfiguracion = new Ext.Button({
            id: 'btnConfiguracion',
            disabled: false,
            text: 'Gestionar Configuraci&oacute;n',
            tooltip: 'Gestionar Configuraci&oacute;n',
            iconCls: 'configuracion',
            hidden: compartimentarTodos
        });

        this.btnCancelarConfiguracion = new Ext.Button({
            id: 'btnCancelarConfiguracion',
            text: 'Cancelar',
            tooltip: 'Cancelar',
            disabled: false,
            iconCls: 'cancelar'
        });  

        this.btnGuardarConfiguracion = new Ext.Button({
            id: 'btnGuardarConfiguracion',
            text: 'Guardar',
            tooltip: 'Guardar',
            disabled: false,
            iconCls: 'guardar'
        });  

        //Formularios
        this.tfDenominacion = new Ext.form.TextField({
            id: 'tfDenominacion',
            fieldLabel: 'Denominaci&oacute;n',
            name: 'denomcampo',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            maxLength: 100,
            anchor: '99%'
        });

        this.cbTipoEntrada = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de entrada',
            displayField: 'denominacion', 
            hiddenName: 'valor',
            allowBlank: false, 
            mode: 'local',
            blankText: 'Este campo es obligatorio.', 
            readOnly: true,
            triggerAction: 'all',
            store: modelo.storeTipoEntrada,
            anchor: '99%'
        });

        this.cbEntrada = new Ext.form.ComboBox({
            fieldLabel: 'Entrada',
            displayField: 'denominacion', 
            disabled: true,
            hiddenName: 'valor',
            allowBlank: false, 
            mode: 'local',
            blankText: 'Este campo es obligatorio.', 
            readOnly: true,
            triggerAction: 'all',
            store: modelo.storeEntrada,
            anchor: '99%'
        });

        this.taFormula = new Ext.form.TextArea({
            id: 'taFormula',
            fieldLabel: 'F&oacute;rmula',
            allowBlank: false,
            mode: 'local',
            emptyText: 'Seleccione...',
            anchor: '99%',
            height: 50
        });

        this.nfOrden = new Ext.form.NumberField({
            id: 'nfOrden',
            fieldLabel: 'Orden',
            name: 'Orden',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            anchor: '99%'
        });

        this.tfDescripcionConfiguracio = new Ext.form.TextArea({
            id: 'tfDescripcionConfiguracio',
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
            blankText: 'Este campo es obligatorio.',
            anchor: '99%',
            height: 50
        });

        this.formConfiguracion = new Ext.FormPanel({
            id: 'formConfiguracion',
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 0px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .99, layout: 'form', items: [this.tfDenominacion]},
                        {columnWidth: .16, layout: 'form', items: [this.nfOrden]},
                        {columnWidth: .42, layout: 'form', items: [this.cbTipoEntrada]},
                        {columnWidth: .42, layout: 'form', items: [this.cbEntrada]},
                        {columnWidth: 1, layout: 'form', items: [this.taFormula]},
                        {columnWidth: 1, layout: 'form', items: [this.tfDescripcionConfiguracio]}
                    ]
                }, this.panelConfiguracion
            ]
        });
        
        this.winConfiguracion = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            autoHeight: true,
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: true,
            width: 600,
            layout: 'fit',
            items: [this.formConfiguracion],
            buttons: [this.btnCancelarConfiguracion, this.btnGuardarConfiguracion],
        });

        /********************************************* */
        this.btnAdicionarPersonas = new Ext.Button({
            id: 'btnAdicionarPersonas',
            text: 'Adicionar',
            tooltip: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar'
        });

        this.btnEliminarPersona = new Ext.Button({
            id: 'btnEliminarPersona',
            text: 'Eliminar',
            tooltip: 'Eliminar',
            disabled: false,
            iconCls: 'eliminar rojo'
        });

        this.btnSyncronizar = new Ext.Button({
            iconCls: 'arriba',
            disabled: true,
            text: 'Sync. Elementos',
            tooltip: 'Sincronizar elementos',
        });

        this.btnCalcular = new Ext.Button({
            id: 'btnCalcular',
            text: 'Calcular',
            tooltip: 'Calcular',
            disabled: true,
            iconCls: 'calcular'
        });

        this.btnAplicarMontoCobrar = new Ext.Button({
            id: 'btnAplicarMontoCobrar',
            text: 'Aplicar',
            tooltip: 'Aplicar',
            disabled: true,
            iconCls: 'aplicar'
        });

        this.btnGuardarEvaluacion = new Ext.Button({
            id: 'btnGuardarEvaluacion',
            text: 'Guardar Evaluaci&oacuten',
            tooltip: 'Guardar',
            disabled: true,
            iconCls: 'guardar'
        });

        this.btnAdicionarConvenio = new Ext.Button({
            id: 'btnAdicionarConvenio',
            text: 'Adicionar',
            tooltip: 'Adicionar',
            disabled: true,
            iconCls: 'adicionar'
        });

        this.btnModificarConvenio = new Ext.Button({
            id: 'btnModificarConvenio',
            text: 'Modificar',
            tooltip: 'Modificar campos',
            iconCls: 'modificar'
        });

        this.btnEliminarConvenio = new Ext.Button({
            id: 'btnEliminarConvenio',
            text: 'Eliminar',
            tooltip: 'Eliminar',
            disabled: false,
            iconCls: 'eliminar rojo'
        });

        this.editorEval = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: true,
            allowNegative: false,
            maxLength: 4,
            maxValue: 1,
            decimalPrecision: 2,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.rowNombre = new Ext.grid.RowNumberer();

        this.smpersonas = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gppersonas = new Ext.grid.EditorGridPanel({
            title     : 'Listado de personas por brigada',
            region    : 'center',
            disabled  : false,
            border    : false,
            stripeRows: true,
            autoScroll: true,
            columns   : [this.rowNombre,
                {
                    header: 'idpersonabrigada',
                    dataIndex: 'idpersonabrigada',
                    hidden: true,
                    hideable: false
                },{
                    header: 'Brigada',
                    hidden: true, 
                    width: 80, 
                    sortable: true, 
                    dataIndex: 'denominacion',
                    renderer: formatearColores
                },
                {
                    header: 'CI', 
                    width: 80, 
                    sortable: true, 
                    dataIndex: 'numid'
                },{
                    header: 'Nombre', 
                    hideable: false, 
                    dataIndex: 'nombreapellidos',                    
                    width: 160, 
                },{
                    header: 'G.E.', 
                    width: 45, 
                    sortable: true, 
                    dataIndex: 'grupoescala'
                },{
                    header: 'S.E.', 
                    width: 80, 
                    sortable: true, 
                    dataIndex: 'importe',
                    align: 'right',
                    renderer: formatoMoneda,
                },{
                    header: 'TRT', 
                    width: 100, 
                    sortable: true, 
                    dataIndex: 'trt',
                    align: 'right',
                    renderer: formatoMoneda,
                },{
                    header: 'FT', 
                    width: 100, 
                    sortable: true, 
                    dataIndex: 'ft',
                    align: 'right',
                    renderer: formatoMoneda,
                },{
                    header: 'Eval', 
                    width: 100,
                    dataIndex: 'evaluacion',
                    editor: this.editorEval,
                    align: 'right',
                    renderer: formatoMoneda,
                },{
                    header: 'Salario x TRT', 
                    width: 100, 
                    sortable: true, 
                    dataIndex: 'salariotrt',
                    align: 'right',
                    renderer: formatoMoneda,
                },{
                    header: 'Salario x Eval', 
                    width: 100, 
                    sortable: true, 
                    dataIndex: 'salarioeval',
                    align: 'right',
                    renderer: formatoMoneda,
                },{
                    header: 'Salario creado', 
                    width: 100, 
                    sortable: true, 
                    dataIndex: 'montocobrar',
                    align: 'right',
                    renderer: formatoMoneda,
                }
            ],
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
            }),
            store     : modelo.storePersonasBrigada,
            sm: this.smpersonas,
            loadMask  : {msg: 'Cargando'},              
        });

        this.nfSalarioCalculado = new Ext.form.TextField({
            id: 'nfSalarioCalculado', 
            fieldLabel: 'Salario de c&aacute;lculo',
            tabIndex: 2, 
            decimalPrecision: 2,            
            allowDecimals: true,
            allowNegative: false,
            maxValue: 999999999999.99,
            maxLength: 12,
            minValue: 0.00,
            nanText: 'Este valor es incorrecto.',
            readOnly: true,
            style: 'text-align: right;',
        });

        this.formSalarioCalculado = new Ext.FormPanel({
            id: 'formSalarioCalculado',
            frame: true,
            bodyStyle: {
                padding: '25px 25px 25px 25px',
            },
            items: [
                {layout: 'fit',
                    items: [
                        {
                            columnWidth: .33, 
                            layout: 'form', 
                            items: [this.nfSalarioCalculado]
                        }
                    ]
                }
            ]
        });

        this.panelListadoPersona = new Ext.Panel({
            id     : 'panelListadoPersona',
            region : 'center',
            height : '100%',
            width  : '100%',
            layout : 'fit',
            items  : [this.gppersonas]
        });

        this.panelSalarioCalculado = new Ext.Panel({
            id: 'panelSalarioCalculado',
            region: 'south',
            height: 80,
            width: '100%',
            items: [ this.formSalarioCalculado]
        });

        this.panelIsquierdo = new Ext.Panel({
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            width: '60%',
            split: true,
            region: 'west',
            layout: 'border',
            tbar: [this.btnAdicionarPersonas, this.btnEliminarPersona, this.btnSyncronizar, this.btnGuardarEvaluacion, this.btnCalcular, this.btnAplicarMontoCobrar, '->',  this.btnConfiguracion],
            items: [this.panelListadoPersona, this.panelSalarioCalculado]
        });

        this.expanderConvenio = new Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smListadoConvenio = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpListadoConvenio = new Ext.grid.GridPanel({
            title     : 'Listado de convenios por obra',
            region    : 'center',
            disabled  : false,
            border    : false,
            stripeRows: true,
            autoScroll: true,
            columns   : [                 
                this.expanderConvenio,
                {
                    header: 'Denominacion', 
                    hideable: false, 
                    dataIndex: 'denominacion'
                },{
                    header: 'Obra', 
                    width: 80,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'obra',
                    renderer: formatearColores
                },{
                    header: 'Importe', 
                    hideable: false, 
                    dataIndex: 'importe',
                    align: 'right',
                    renderer: formatoMoneda,
                },{
                    header: 'Fecha inicio', 
                    hideable: false, 
                    dataIndex: 'fechainicio'
                },{
                    header: 'Fecha fin', 
                    hideable: false, 
                    dataIndex: 'fechafin'
                }
            ],
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
            }),
            store     : modelo.storeConvenios,
            sm        : this.smListadoConvenio,
            plugins   : this.expanderConvenio,
            loadMask  : {msg: 'Cargando...'},  
        });

        this.panelListadoConvenio = new Ext.Panel({
            id     : 'panelListadoConvenio',
            region : 'north',
            height : '60%',
            width  : '100%',
            layout : 'fit',
            items  : [this.gpListadoConvenio]
        });

        this.panelDerecho = new Ext.Panel({
            closeAction: 'center',
            constrain: true,
            resizable: false,
            width: '40%',
            split: true,
            region: 'center',
            layout: 'fit',
            tbar: [this.btnAdicionarConvenio, this.btnModificarConvenio, this.btnEliminarConvenio],
            items: [this.panelListadoConvenio]
        });
        
        this.btnAprobar = new Ext.Button({
            id: 'btnAprobar',
            text: 'Aprobar',
            iconCls: 'aprobar',
        });
        
        this.btnDesaprobar = new Ext.Button({
            id: 'btnDesaprobar',
            text: 'Desaprobar',
            iconCls: 'desaprobar'
        });

        this.btnCerrarResumen = new Ext.Button({
            id: 'btnCerrarResumen',
            text: 'Cerrar',
            tooltip: 'Cerrar resumen de los per&iacute;odos de pago',
            iconCls: 'terminar',
        });
        
        this.btnImprimir = new Ext.MenuButton({
            id: 'btnImprimir',
            text: 'Imprimir',
            iconCls: 'imprimir',
            menu    : {
                items: [
                    {
                        id: 1,
                        text: 'Listado personas periodo destajo.',
                        iconCls: 'importar',
                    }, 
                    {
                        id: 2,
                        text: 'Listado convenios por obra.',
                        iconCls: 'importar',
                    }
                ]
            }
        });
        
        this.btnAceptarExpListadoPeriodo = new Ext.Button({
            id: 'btnAceptarExpListadoPeriodo',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            iconCls: 'aceptar',
            disabled: true
        });

        this.radioPdfExpListadoPeriodo = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioPdfExpListadoPeriodo',
            align: 'center',
            boxLabel: 'PDF',
            fieldLabel: 'PDF2',
            name: 'formato',
            checked: true
        });

        this.radioExcelExpListadoPeriodo = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioExcelSubMayor',
            align: 'center',
            boxLabel: 'EXCEL',
            fieldLabel: 'EXCEL2',
            name: 'formato'
        });

        this.panelExpListadoPeriodo = new Ext.FormPanel({
            id: 'panelFormatoSubMayor',
            width: 300,
            autoHeight: true,
            frame: true,
            region: 'south',
            items: [{
                xtype: 'fieldset',
                height: 60,
                width: '92%',
                region: 'center',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {columnWidth: .5, layout: 'column', items: [this.radioPdfExpListadoPeriodo]},
                            {columnWidth: .5, layout: 'column', items: [this.radioExcelExpListadoPeriodo]}
                        ]
                    }
                ]
            }]
        });

        this.ventanaExpListadoPeriodo = new Ext.Window({
            title: 'Formato a exportar.',
            modal: true,
            height: 150,
            width: 310,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            items: [this.panelExpListadoPeriodo],
            buttons: [this.btnAceptarExpListadoPeriodo]
        });
        
        this.btnAceptarExpConvenio = new Ext.Button({
            id: 'btnAceptarExpConvenio',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            iconCls: 'aceptar',
            disabled: true
        });

        this.radioPdfExpConvenio = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioPdfExpConvenio',
            align: 'center',
            boxLabel: 'PDF',
            fieldLabel: 'PDF2',
            name: 'formato',
            checked: true
        });

        this.radioExcelExpConvenio = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioExcelSubMayor',
            align: 'center',
            boxLabel: 'EXCEL',
            fieldLabel: 'EXCEL2',
            name: 'formato'
        });

        this.panelExpConvenio = new Ext.FormPanel({
            id: 'panelFormatoSubMayor',
            width: 300,
            autoHeight: true,
            frame: true,
            region: 'south',
            items: [{
                xtype: 'fieldset',
                height: 60,
                width: '92%',
                region: 'center',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {columnWidth: .5, layout: 'column', items: [this.radioPdfExpConvenio]},
                            {columnWidth: .5, layout: 'column', items: [this.radioExcelExpConvenio]}
                        ]
                    }
                ]
            }]
        });

        this.ventanaExpConvenio = new Ext.Window({
            title: 'Formato a exportar.',
            modal: true,
            height: 150,
            width: 310,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            items: [this.panelExpConvenio],
            buttons: [this.btnAceptarExpConvenio]
        });

        this.cbTipoDestajo = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de destajo',
            valueField: 'idnomtipodestajo',
            displayField: 'denominacion', 
            hiddenName: 'valor',
            allowBlank: false, 
            mode: 'local',
            blankText: 'Este campo es obligatorio.', 
            readOnly: true,
            triggerAction: 'all',
            store: modelo.storeDestajo,
            anchor: '60%'
        });

        this.cbtipoBrigada = new Ext.form.ComboBox({
            fieldLabel: 'Selección de Brigada',
            allowBlank: false,
            valueField: 'idplantillanominal',
            displayField: 'denominacion', 
            hiddenName: 'valor',
            mode: 'local',
            blankText: 'Este campo es obligatorio.', 
            readOnly: true,
            triggerAction: 'all',
            store: modelo.storeSeleccionBrigada,
            anchor: '60%'
        });

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicio', 
            fieldLabel: 'Fecha inicio',
            tabIndex: 3, 
            name: 'fechainicio', 
            allowBlank: false,
            format: 'd/m/Y', 
            editable: true, 
            readOnly: false,
            value: new Date().format('d/m/Y'), 
            maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, 
            blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, 
            vtype: 'daterange',
            anchor: '35%', 
            endDateField: 'dfFFin'
        });

        this.dfFFin = new Ext.form.DateField({
            id: 'dfFFin', 
            fieldLabel: 'Fecha fin',
            tabIndex: 4, 
            name: 'fechafin', 
            xtype: 'datefield',
             allowBlank: true,
            format: 'd/m/Y', 
            editable: true, 
            readOnly: false,
            maxText: idioma.lbFechaMaxima, 
            minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, 
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', 
            anchor: '35%', 
            startDateField: 'dfFInicio'
        });

        this.nfMontoBrigada = new Ext.form.TextField({
            fieldLabel: 'Monto total Brigada',
            tabIndex: 2, 
            decimalPrecision: 2,            
            allowDecimals: true,
            allowNegative: false,
            maxValue: 999999999999.99,
            maxLength: 12,
            minValue: 0.00,
            nanText: 'Este valor es incorrecto.',
            readOnly: true,
            style: 'text-align: right;',
        });

        this.nfPorcientoTrabajado = new Ext.form.TextField({
            fieldLabel: 'Porciento trabajado',         
            allowDecimals: false,
            allowNegative: false,
            nanText: 'Este valor es incorrecto.',
            editable: false,
            readOnly: true,
            style: 'text-align: right;',
        });

        this.nfCoeficiente = new Ext.form.TextField({
            fieldLabel: 'Coeficiente de distribución',       
            allowDecimals: false,
            allowNegative: false,
            nanText: 'Este valor es incorrecto.',
            editable: false,
            readOnly: true,
            style: 'text-align: right;',
        });

        //Formulario de tipos de nómina.
        this.formularioDest = new Ext.FormPanel({
            id: 'formularioDest',
            labelAlign: 'top',
            frame: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [
                {layout: 'column',
                    items: [
                        {
                            columnWidth: .25, 
                            layout: 'form', 
                            items: [this.dfFInicio]
                        },
                        {
                            columnWidth: .25, 
                            layout: 'form', 
                            items: [this.dfFFin]
                        },
                        {
                            columnWidth: .25, 
                            layout: 'form', 
                            items: [this.nfMontoBrigada]
                        },
                        {
                            columnWidth: .25, 
                            layout: 'form', 
                            items: [this.nfPorcientoTrabajado]
                        }
                    ]
                },
                {layout: 'column',
                    items: [
                        {
                            columnWidth: .25, 
                            layout: 'form', 
                            items: [this.cbTipoDestajo]
                        },
                        {
                            columnWidth: .25, 
                            layout: 'form', 
                            items: [this.cbtipoBrigada]
                        },
                        {
                            columnWidth: .25, 
                            layout: 'form', 
                            items: [this.nfCoeficiente]
                        }
                    ]
                },
            ],
        });

        this.panelFormularioDest = new Ext.Panel({
            region : 'center',
            height: 170,
            width  : '100%',
            layout : 'fit',
            items  : [this.formularioDest]
        });

        this.panelbotones = new Ext.Panel({
            region : 'south',
            width  : '100%',
            tbar  : [this.btnAprobar, ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', this.btnDesaprobar, 
                ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', this.btnImprimir, 
                ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ', this.btnCerrarResumen
            ]
        });

        this.panelNorth = new Ext.Panel({
            id     : 'panelNorth',
            region : 'north',
            height: 170,
            width  : '100%',
            layout: 'border',
            items  : [this.panelFormularioDest, this.panelbotones]
        });

        this.panelSouth = new Ext.Panel({
            id: 'panelSouth',
            region: 'center',
            width: '100%',
            layout: 'border',
            items: [ this.panelIsquierdo, this.panelDerecho]
        });

        this.winPagoDestajo = new Ext.Window({
            title: 'Pago por destajo',
            modal: true,
            height: '100%',
            width: '100%',
            constrain: true,
            resizable: false,
            layout: 'border',
            closeAction: 'hide',
            items: [this.panelNorth, this.panelSouth]
        });

        function formatearColores(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('estado') == null) {
                return '<span style="color:blue;">' + val + '</span>';
            } else {
                if (record.get('estado') == -1) {
                    return '<span style="color:red;">' + val + '</span>';
                } 
                else {
                    return '<span style="color:green;">' + val + '</span>';
                }
            }
            return val;
        }

        //Función auxiliar para centrar los valores del grid.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

    }
}
//Inicializando la vista.
UCID.portal.cargarEtiquetas('pagodestajo', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    UCID.portal.cargarAcciones(window.frameElement.id, function (res) {   
        acciones_reportes.forEach(accion=>{
            
          if(accion.abreviatura == 'btnConfiguracionPagoDestajo'){
            compartimentarTodos = false;
          }
        });
       
        var modelo = Pvd.Nomina.Pagos.PagoDestajo.Modelo;
        modelo.init(idioma);
    
        //Inicializando la vista.
        var vista = Pvd.Nomina.Pagos.PagoDestajo.Vista;
        vista.init(perfil, idioma, modelo);
    
        //Inicializar controlador.
        Pvd.Nomina.Pagos.PagoDestajo.Controlador.init(idioma, vista, modelo);
    });
});
