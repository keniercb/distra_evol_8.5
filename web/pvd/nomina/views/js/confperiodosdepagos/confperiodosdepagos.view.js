Ext.ns('Pvd.Nomina.Configuracion.PeriodosDePagos');
Ext.QuickTips.init();

//Vista del componente Configurar variables globales.
Pvd.Nomina.Configuracion.PeriodosDePagos.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Configurar Periodos De Pagos (Tipo: Pvd.Nomina.Configuracion.PeriodosDePagos.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var self = this;

        //PANEL ESTRUCTURAS******************************************************************************
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: idioma.btnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
        });

        //Vista para el componente Buscar estructura
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            closable: false,
            constrain: true,
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

        //BOTONES***************************************************************************************
        this.btnRecargarPeriodosP = new Ext.Button({
            id: 'btnRecargarPeriodosP',
            text: '<u>R</u>ecargar',
            tooltip: '<u>R</u>ecargar períodos (<b>Alt+R</b>)',
            iconCls: 'recargar',
        });

        //Boton adicionar fechas
        this.btnAdicionarFechas = new Ext.Button({
            id: 'idbtnAdicionarFechas',
            text: '<u>A</u>dicionar',
            tooltip: '<u>A</u>dicionar períodos (<b>Alt+I</b>)',
            iconCls: 'adicionar',
            disabled: true
        });

        //Boton modificar fechas
        this.btnModificarFechas = new Ext.Button({
            id: 'idbtnModificarFechas',
            text: '<u>M</u>odificar',
            tooltip: '<u>M</u>odificar períodos (<b>Alt+M</b>)',
            iconCls: 'modificar',
            disabled: true
        });

        //Boton eliminar fechas
        this.btnEliminarFechas = new Ext.Button({
            id: 'idbtnEliminarFechas',
            text: 'Eliminar',
            tooltip: 'Eliminar períodos (<b>DEL</b>)',
            iconCls: 'eliminar',
            disabled: true
        });

        //Botones de la ventana de las fechas de los periodos

        this.btnCancelarPeriodo = new Ext.Button({
            id: 'idbtnCancelarPeriodo',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        this.btnAplicarPeriodo = new Ext.Button({
            id: 'idbtnAplicarPeriodo',
            iconCls: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt + P</b>)',
        });

        this.btnAceptarPeriodo = new Ext.Button({
            id: 'idbtnAceptarPeriodo',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)'
        });
        //FORMS*****************************************************************************************
        //Campos del formulario de las fechas de los periodos
        this.dfInicioPeriodo = new Ext.form.DateField({
            id: 'iddfInicioPeriodo',
            fieldLabel: 'Fecha inicio',
            name: 'fechainicio',
            allowBlank: false,
            format: 'd/m/Y',
            editable: true,
            readOnly: false,
            value: new Date().format('d/m/Y'),
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            blankText: 'Este campo es obligatorio.',
            invalidText: 'Formato: dd/mm/aaaa.',
            anchor: '90%',
            endDateField: 'iddfFinPeriodo'
        });

        this.dfFinPeriodo = new Ext.form.DateField({
            id: 'iddfFinPeriodo',
            fieldLabel: 'Fecha fin',
            name: 'fechafin',
            allowBlank: false,
            format: 'd/m/Y',
            editable: true,
            readOnly: false,
            value: new Date().format('d/m/Y'),
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            blankText: 'Este campo es obligatorio.',
            invalidText: 'Formato: dd/mm/aaaa.',
            anchor: '99%',
            startDateField: 'iddfInicioPeriodo'
        });

        //Formulario de las fechas de los periodos
        this.formularioPeriodos = new Ext.FormPanel({
            id: 'idformularioPeriodos',
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.dfInicioPeriodo]},
                        {columnWidth: .5, layout: 'form', items: [this.dfFinPeriodo]}
                    ]
                }
            ]
        });

        //GRIDS*****************************************************************************************
        //Grid panel de los periodos
        this.smTiposPagosConfPP = new Ext.grid.CheckboxSelectionModel();
        this.gpTiposPagos = new Ext.grid.EditorGridPanel({
            store: modelo.stTiposPagos,
            region: 'center',
            border: true,
            loadMask: {text: 'Cargando...'},
            width: 300,
            columns: [
                this.smTiposPagosConfPP,
                {header: 'idtipopago', dataIndex: 'idtipopago', width: 100, hidden: true},
                {header: 'Denominacion', dataIndex: 'denominacion', width: 100},
            ],
            viewConfig: {
                forceFit: true
            },
            sm: this.smTiposPagosConfPP
        });

        //Grid panel de los periodos
        this.gpPeriodos = new Ext.grid.EditorGridPanel({
            store: modelo.stPeriodosPago,
            region: 'center',
            collapsible: true,
            border: true,
            loadMask: {text: 'Cargando...'},
            width: '30%',
            columns: [
                {header: 'idperiodo', dataIndex: 'idperiodopago', width: 100, hidden: true},
                {header: 'Denominacion', dataIndex: 'denominacion', width: 100},
            ],
            viewConfig: {
                forceFit: true
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            tbar: [this.btnRecargarPeriodosP],
        });

        //Seleccion del año de periodos de pagos
        function fnAnno(val) {
            return val.split('-')[1];
        }

        //Grid panel de las fechas
        this.smFechasInicioFin = new Ext.grid.CheckboxSelectionModel();
        this.gpFechasInicioFin = new Ext.grid.EditorGridPanel({
            store: modelo.stFechasInicioFin,
            region: 'center',
            collapsible: true,
            autoExpandMax: 100,
            border: true,
            loadMask: {text: 'Cargando...'},
            width: 300,
            columns: [
                this.smFechasInicioFin,
                {header: 'iddesgloseperiodos', dataIndex: 'iddesgloseperiodos', hidden: true},
                {header: 'idperiodostipospago', dataIndex: 'idperiodostipospago', hidden: true},
                {header: 'idestructura', dataIndex: 'idestructura', hidden: true},
                {header: 'idtipopago', dataIndex: 'idtipopago', hidden: true},
                {header: 'idperiodopago', dataIndex: 'idperiodopago', hidden: true},
                {header: 'Fecha inicio', dataIndex: 'fechainicio', type: 'date', width: 100},
                {header: 'Fecha fin', dataIndex: 'fechafin', type: 'date', width: 100},
                {header: 'Tipo de pago', dataIndex: 'denomtipopago', width: 100},
                {header: 'Año', dataIndex: 'anno', hidden: true, renderer: fnAnno},
                {header: 'orden', dataIndex: 'orden', type: 'float', hidden: true}
            ],
            viewConfig: {
                forceFit: true
            },
            sm: this.smFechasInicioFin,
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            tbar: [this.btnAdicionarFechas, this.btnModificarFechas, this.btnEliminarFechas],
        });

        //PANELS***************************************************************************************
        //Panel de Tipos de Pagos
        this.pTipoPagos = new Ext.Panel({
            title: 'Tipos de pago',
            region: 'west',
            layout: 'border',
            width: '30%',
            collapsible: true,
            split: true,
            items: [this.gpTiposPagos]
        });

        //Panel de periodos
        this.pPeridos = new Ext.Panel({
            title: 'Per&iacute;odos de pago',
            region: 'center',
            layout: 'border',
            width: '30%',
            collapsible: false,
            split: true,
            items: [this.gpPeriodos]
        });

        //Panel de fechas
        this.pRangoFechas = new Ext.Panel({
            title: 'Rango de fechas',
            region: 'east',
            layout: 'border',
            width: '40%',
            collapsible: false,
            split: true,
            items: [this.gpFechasInicioFin]
        });

        //WINDOW**************************************************************************************
        //ventana para la adicion y modificacion de periodos de pagos
        this.ventanaPeriodos = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioPeriodos],
            buttons: [this.btnCancelarPeriodo, this.btnAplicarPeriodo, this.btnAceptarPeriodo],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarPeriodo.disabled) {
                            self.btnAceptarPeriodo.handler();
                        }
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarPeriodo.disabled) {
                            self.btnCancelarPeriodo.handler();
                        }
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarPeriodo.disabled) {
                            self.btnAplicarPeriodo.handler();
                        }
                    }
                }
            ]
        });

        //Ventana principal
        this.winPeriodosPagosPrincipal = new Ext.Window({
            title: 'Configuraci&oacute;n de los per&iacute;odos de pagos',
            modal: true,
            constrain: true,
            resizable: false,
            layout: 'border',
            closeAction: 'hide',
            items: [this.pTipoPagos, this.pPeridos, this.pRangoFechas],
            keys: [
                {
                    key: 'r',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnRecargarPeriodosP.disabled) {
                            self.btnRecargarPeriodosP.handler();
                        }
                    }
                },{
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarFechas.disabled) {
                            self.btnEliminarFechas.handler();
                        }
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarFechas.disabled) {
                            self.btnAdicionarFechas.handler();
                        }
                    }
                }, {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarFechas.disabled) {
                            self.btnModificarFechas.handler();
                        }
                    }
                }
            ]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('confperiodosdepagos', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.PeriodosDePagos.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuracion.PeriodosDePagos.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.PeriodosDePagos.Controlador.init(idioma, vista, modelo);
});
