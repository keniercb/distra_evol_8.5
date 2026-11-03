Ext.ns('Pvd.Nomina.CalculoPagoResultado');
Ext.QuickTips.init();
Pvd.Nomina.CalculoPagoResultado.Vista = {
    /**
     * Autor: Leyner
     */
    init: function (opc, modelo) {
        var scope = this;
        this.composicion = 2;
        this.identidades = -1;
        this.idarea = -1;

        this.BtnSBC = new Ext.Button({
            text: Pvd.Nomina.CalculoPagoResultado.Idioma.lbBtnSBC,
            tooltip: Pvd.Nomina.CalculoPagoResultado.Idioma.textToolTipBtnCalcular,
            iconCls: 'calcular',
            disabled: true
        });

        /*this.panelestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
         region:'west',
         width:'25%',
         layout: 'border',
         nivel: 3
         });   */

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda',
            iconCls: 'ayuda',

        });
        this.panelestructura = new Ext.components.TreeEstructura({
            region: 'west',
            split: true,
            width: '24%',
            checker: false,
            border: false,
            title: 'Estructuras',
            collapsible: true,
            animCollapse: false,
            animate: false,
            margins: '0 0 0 5'
        });
        //Ventana para escoger la forma de calculo de los montos(automatica, manual)
        this.rbAutomatica = new Ext.form.Radio({
            id: 'rbAutomatica',
            boxLabel: 'Autom&aacute;tica',
            name: 'tipobusqueda',
            inputValue: 1
        });

        this.rbManual = new Ext.form.Radio({
            id: 'rbManual',
            boxLabel: 'Manual',
            name: 'tipobusqueda',
            inputValue: 2
        });

        this.rgTipoBusqueda = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.50, .50],
            style: 'padding-left: 30px;',
            items: [this.rbAutomatica, this.rbManual]
        });

        this.formularioTipoBusqueda = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 450,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: 'Formas de calcular el monto de las &aacute;reas',
                height: 80,
                width: '93%',
                region: 'center',
                items: [
                    this.rgTipoBusqueda
                ]
            }]
        });

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

        this.ventanaTipoBusqueda = new Ext.Window({
            id: 'ventanaTipoBusqueda',
            region: 'center',
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

        //Ventana con el monto a distribuir general
        this.nfMontoDistribuir = new Ext.form.NumberField({
            name: 'montodistribuir',
            width: '100%',
            anchor: '90%',
            id: 'nfMontoDistribuir',
            fieldLabel: 'Monto',
            //allowBlank: false,
            decimalPrecision: 2,
        });

        /*
         * Componente para mostrar los diferentes pagos de meses anteriores por tipos de pagos
         * */
        this.btnLimpiarPeriodos = new Ext.Button({
            text: "Limpiar",
            tooltip: "Limpiar per&iacute;odos",
            iconCls: 'borrar',
        });

        this.objListarPeriodosPagosAuto = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTituloPanelPeriodoPago,
            autoScroll: true,
            modoview: 2,
            //tbar: ['->',' ', ' ',this.btnLimpiarPeriodos]
        });

        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            id:'objListarPeriodosPagos',
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTituloPanelPeriodoPago,
            autoScroll: true,
            modoview: 2,
            //tbar: ['->',' ', ' ',this.btnLimpiarPeriodos]
        });


        this.btnLimpiarAreas = new Ext.Button({
            text: "Limpiar",
            tooltip: "Limpiar montos",
            iconCls: 'borrar',
        });

        this.tfMonto = new Ext.form.NumberField({
            id: 'tfMonto',
            width: '80%'
        });
        this.smAreas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gpAreas = new Ext.grid.EditorGridPanel({
            id: 'gpAreas',
            store: modelo.stPlantillaNAreas,
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTituloPanelAreas,
            region: 'south ',
            loadMask: {text: 'Cargando...'},
            height: 450,
            sm: this.smAreas,
            columns: [this.smAreas
                , {header: 'idarea', hidden: true, hideable: false, dataIndex: 'idplantillanominal'}
                , {header: '<center>' + '&Aacute;rea' + '<\center>', width: 400, dataIndex: 'area'}
                , {
                    header: '<center>' + 'Monto' + '<\center>',
                    width: 200,
                    sortable: true,
                    dataIndex: 'monto',
                    editor: this.tfMonto
                }

            ],
            tbar: ['->',' ', ' ',this.btnLimpiarAreas],
            clicksToEdit: 1

        });

        this.dfFInicioPeriodo = new Ext.form.DateField({id: 'dfFInicioPeriodo', fieldLabel: 'Fecha inicio',
            tabIndex                                    : 5, name: 'fechainiciop', allowBlank: true,
            format                                      : 'd/m/Y', editable: true, readOnly: false,
            value                                       : /*new Date().format('d/m/Y')*/'d/m/Y', maxText: 'Fecha invalida',
            minText                                     : 'Fecha invalida', blankText: 'Este campo no puede estar vac&iacute;o',
            invalidText                                 : 'Fecha invalida', vtype: 'daterange',
            anchor                                      : '85%', endDateField: 'dfFFinPeriopdo'
        });

        this.dfFFinPeriopdo = new Ext.form.DateField({id: 'dfFFinPeriopdo', fieldLabel: 'Fecha fin',
            tabIndex                                    : 5, name: 'fechafinp', allowBlank: true,
            format                                      : 'd/m/Y', editable: true, readOnly: false,
            value                                       : 'd/m/Y', maxText: 'Fecha invalida',
            minText                                     : 'Fecha invalida', blankText: 'Este campo no puede estar vac&iacute;o',
            invalidText                                 : 'Fecha invalida', vtype: 'daterange',
            anchor                                      : '85%', startDateField: 'dfFInicioPeriodo'
        });

        /*this.dfFFinPeriopdo = new Ext.form.DateField({id: 'dfFFinPeriopdo', fieldLabel: 'Fecha fin',
            tabIndex                                 : 6, name: 'fechafinp', xtype: 'datefield', allowBlank: true,
            format                                   : 'd/m/Y', editable: true, readOnly: false,
            value                                    : new Date().format('d/m/Y'),
            maxText                                  : 'Fecha invalida', minText: 'Fecha invalida',
            blankText                                : 'Este campo no puede estar vac&iacute;o', invalidText: 'Fecha invalida',
            vtype                                    : 'daterange', anchor: '99%', startDateField: 'dfFInicioPeriodo',  vtype: 'daterange'
        });*/

        this.btnAceptarPeriodosPagos = new Ext.Button({
            id: 'btnAceptarPeriodosPagos',
            text: 'Aceptar',
            tooltip: '',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.winPeriodosPagos = new Ext.Window({
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTituloVentana,
            modal: true,
            width: 700,
            height: 400,
            constrain: true,
            autoScroll: true,
            closable: true,
            closeAction: 'hide',
            resizable: true,
            layout: 'fit',

            items: new Ext.TabPanel({
                id:'tabentradas',
                border: false,
                activeTab: 0,
                items: [this.objListarPeriodosPagos, this.gpAreas]
            }),
            buttons: [this.btnAceptarPeriodosPagos],
            tbar: ['Fecha inicio:',' ', this.dfFInicioPeriodo,
                ' ', ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','Fecha fin:',' ',this.dfFFinPeriopdo,
                ' ', ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','Monto:',' ',this.nfMontoDistribuir]});

        this.btnAceptarMontosAreas = new Ext.Button({
            id: 'btnAceptarMontosAreas',
            text: 'Aceptar',
            tooltip: '',
            //disabled: true,
            iconCls: 'aceptar'
        });

        this.smAreasRecalculo = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gpAreasRecalculo = new Ext.grid.EditorGridPanel({
            store: modelo.stPlantillaNAreas,
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTituloPanelAreas,
            region: 'south ',
            loadMask: {text: 'Cargando...'},
            height: 450,
            sm: this.smAreasRecalculo,
            columns: [this.smAreasRecalculo
                , {header: 'idarea', hidden: true, hideable: false, dataIndex: 'idplantillanominal'}
                , {header: '<center>' + '&Aacute;rea' + '<\center>', width: 400, dataIndex: 'area'}
                , {
                    header: '<center>' + 'Monto' + '<\center>',
                    width: 200,
                    sortable: true,
                    dataIndex: 'monto',
                    editor: this.tfMonto
                }

            ],
            tbar: ['->',' ', ' ',this.btnLimpiarAreas],
            clicksToEdit: 1

        });
        this.winMontosAreasRecalcular = new Ext.Window({
            title: "Montos por &aacute;reas",
            modal: true,
            width: 700,
            height: 400,
            constrain: true,
            autoScroll: true,
            closable: true,
            closeAction: 'hide',
            resizable: true,
            layout: 'fit',
            items: new Ext.TabPanel({
                border: false,
                activeTab: 0,
                items: [this.gpAreasRecalculo]
            }),
            buttons: [this.btnAceptarMontosAreas]
        });

        this.gridPagosResultados = new Ext.grid.GridPanel({
            frame: true,
            tbar: [this.BtnSBC, '->', this.btnAyuda],
            region: 'center',
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTitGrid,
            disabled: false,
            autoExpandColumn: 'idexpadir',
            split: true,
            autoScroll: true,
            stripeRows: true,
            store: modelo.stPagosResultados,
            columns: [{header: "Tipo de pago ", id: 'idexpadir', dataIndex: 'dentipopago'},
                {header: 'Referencia', dataIndex: 'referencia', width: 100},
                {header: 'Fecha inicio', dataIndex: 'fechainicio', width: 100},
                {header: 'Fecha fin', dataIndex: 'fechafin', width: 100}]
        });


        this.panelDerecho = new Pvd.Nomina.CalculoPagoResultado.detallesEntrada({idpago: 3});
        this.primerPanel = new Ext.Panel({
            title: 'Pagos por resultados',
            layout: 'border',
            items: [this.panelestructura, this.gridPagosResultados, {
                region: 'east',
                title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTituloPanelDetalle,
                collapsible: true,
                split: true,
                width: 300,
                minSize: 175,
                maxSize: 400,
                layout: 'fit',
                margins: '0 5 0 0',
                items: [this.panelDerecho]
            }]
        });

        this.segundoPanel = new Pvd.Nomina.CalculoPagoResultado.mostrarresultado();
        this.BtnAnterior = new Ext.Button({
            text: Pvd.Nomina.CalculoPagoResultado.Idioma.lbBtnAnterior,
            tooltip: Pvd.Nomina.CalculoPagoResultado.Idioma.textToolTipBtnCalcular,
            iconCls: 'anterior',
            disabled: true
        });

        this.Btnsiguiente = new Ext.Button({
            text: Pvd.Nomina.CalculoPagoResultado.Idioma.lbBtnsiguiente,
            iconCls: 'siguiente',
            disabled: false
        });

        this.BtnCalcular = new Ext.Button({
            text: Pvd.Nomina.CalculoPagoResultado.Idioma.lbBtnCalcular,
            tooltip: Pvd.Nomina.CalculoPagoResultado.Idioma.textToolTipBtnCalcular,
            iconCls: 'calcular',
            disabled: true
        });

        this.BtnGuardar = new Ext.Button({
            text: Pvd.Nomina.CalculoPagoResultado.Idioma.lbBtnGuardar,
            tooltip: Pvd.Nomina.CalculoPagoResultado.Idioma.textToolTipBtnGuardar,
            iconCls: 'guardar',
            hidden: true
        });

        this.panelPrincipal = new Ext.Panel({
            region: 'center',
            layout: 'card',
            activeItem: 0,
            bbar: ['->', this.BtnAnterior, this.Btnsiguiente, this.BtnCalcular, this.BtnGuardar],
            items: [this.primerPanel, this.segundoPanel]
        });

        this.viewport = new Ext.Viewport({
            layout: 'border',
            items: [this.panelPrincipal]
        });
    }

};
Pvd.Nomina.CalculoPagoResultado.Cmp = function (opc) {
    //Inicializando el modelo
    var modelo = Pvd.Nomina.CalculoPagoResultado.Modelo;
    modelo.init();

    //Inicializando la vista.
    this.vista = Pvd.Nomina.CalculoPagoResultado.Vista;
    this.vista.init(opc, modelo);

    /*//Inicializando la vista.
    this.compcalculo =  Pvd.Nomina.CalculoPagoResultado.mostrarresultado;
    this.compcalculo.init(opc, modelo, vista);*/

    //Inicializar controlador.
    Pvd.Nomina.CalculoPagoResultado.Controlador.init(this.vista, modelo, this.compcalculo);
    // return this.vista.panel;
}
Pvd.Nomina.CalculoPagoResultado.Cmp();

