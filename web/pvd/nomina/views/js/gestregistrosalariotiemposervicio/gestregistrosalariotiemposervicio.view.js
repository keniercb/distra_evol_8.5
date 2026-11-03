/*Componente para gestionar el registro de Salarios y tiempo de servicio (SNC - 225)
 *@author 1er Tte. Frank Rodriguez Berroa
 *@email fberroa@xetid.cu
 */
Ext.ns('Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio');
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

//Vista del componente Gestionar registro de salarios y tiempo de servicios.
Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar registro de salarios y tiempo de servicios(Tipo: Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Modelo).
     */
    init: function (perfil, idioma, modelo) {

        this.idestructura = 0;
        this.idpersona = 0;
        this.idregistrosalario = 0;
        this.recordperiodopagoseleccionado = null;
        this.recordperiodopagoexportarseleccionado = null;
        var self = this;

        //Componenete para seleccionar la entidad de la cual obtener las personas.
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelchequear: 3
        });

        //Ventana para seleccionar la entidad.
        this.btnAceptarEntidad = new Ext.Button({
            text: idioma.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            //  icon: perfil.dirImg + 'aceptar.png',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.winEstructura = new Ext.Window({
            title: idioma.lbTitleWinEstructura,
            modal: true,
            height: 350,
            width: 300,
            closable: false,
            constrain: true,
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
            title: 'Listado de personas',
            id: 'g1',
            heigth: '50%',
            width: '100%',
            split: true,
            region: 'center',
            modulo: 'NOMINA',
            funcionalidad: 'REGSALTIEMPSERV',
            identidad: this.idestructura,
            // cliente: 'MINFAR',
            cantidadPorPaginas: 5000
        });

        this.gpPersonasHistorico = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            title: 'Historial de personas',
            id: 'g2',
            heigth: '50%',
            width: '100%',
            split: true,
            region: 'east',
            modulo: 'NOMINA',
            funcionalidad: 'CESPHIST',
            identidad: this.idestructura,
            // cliente: 'MINFAR',
            cantidadPorPaginas: 5000
        });

        //Botones de Add, Mod, Elim .
        this.btnAdicionar = new Ext.Button({
            id: 'idbtnAdicionar',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Ad<u>i</u>cionar registro de salario y tiempo de servicio(<b>Alt+I</b>)',
            //icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            disabled: true,
        });

        this.btnModificar = new Ext.Button({
            id: 'idbtnModificar',
            text: '<u>M</u>odificar',
            tooltip: '<u>M</u>odificar registro de salario y tiempo de servicio(<b>Alt+B</b>)',
            // icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            disabled: true,
        });

        this.btnEliminar = new Ext.Button({
            id: 'idbtnEliminar',
            text: idioma.lbBtnEliminar,
            tooltip: 'Eliminar registro de salario y tiempo de servicio(<b>DEL</b>)',
            // icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            disabled: true,
        });

        //Exportar Modelo SC-4-08
        this.btnExportaSNC = new Ext.Button({
            id: 'idbtnbtnExportaSNC',
            disabled: true,
            text: 'Modelo SC-4-08',
            iconCls: 'exportar',
            //icon: perfil.dirImg + 'exportar.png',
            tooltip: '<u>E</u>xportar Modelo SC-4-08 (<b>Alt+E</b>)'
        });

        this.btnCancelarModeloSC408 = new Ext.Button({
            id: 'btnCancelarModeloSC408',
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                self.ventanaExportarSC408.hide();
            }
        });

        this.btnAceptarModeloSC408 = new Ext.Button({
            id: 'btnAceptarModeloSC408',
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true
        });

        this.chbTipoExportModeloSC408 = new Ext.form.Checkbox({
            id: 'chbTipoExportModeloSC408',
            fieldLabel: 'Todos los a&ntilde;os',
            bottonAlign: 'center',
            name: 'todosannos', anchor: '99%',
            checked: true
        });

        this.cbAnnosModeloSC408 = new Ext.form.ComboBox({
            id: 'cbAnnosModeloSC408',
            fieldLabel: 'A&ntilde;o',
            enableQtip: true,
            store: modelo.storeCbAnnos,
            mode: 'local',
            displayField: 'denominacion',
            hiddenName: 'idannos',
            valueField: 'idannos',
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '99%',
            allowBlank: true,
            disabled: true
        });

        this.formularioExportarSC408 = new Ext.FormPanel({
            id: 'formularioExportarSC408',
            labelAlign: 'left',
            height: 300,
            frame: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [{
                layout: 'column',
                items: [{
                    labelAlign: 'top',
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [this.chbTipoExportModeloSC408]
                }, {
                    labelAlign: 'top',
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [this.cbAnnosModeloSC408]
                }]
            }]
        });

        this.ventanaExportarSC408 = new Ext.Window({
            plain: true,
            title: 'Exportar modelo SC-4-08',
            closeAction: 'hide',
            modal: true,
            frame: true,
            constrain: true,
            resizable: true,
            width: 300,
            height: 150,
            items: [this.formularioExportarSC408],
            buttons: [this.btnCancelarModeloSC408, this.btnAceptarModeloSC408],
        });

        //Exportar Modelo SC-4-09
        this.btnExportaSNC09 = new Ext.Button({
            id: 'btnExportaSNC09',
            disabled: true,
            text: 'Modelo SC-4-09',
            iconCls: 'exportar',
            //icon: perfil.dirImg + 'exportar.png',
            tooltip: '<u>E</u>xportar Modelo SC-4-09 (<b>Alt+E</b>)'
        });

        this.btnCancelarModeloSC409 = new Ext.Button({
            id: 'btnCancelarModeloSC409',
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cerrar ventana',
            handler: function () {
                self.ventanaExportarSC409.hide();
            }
        });

        this.btnAceptarModeloSC409 = new Ext.Button({
            id: 'btnAceptarModeloSC409',
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        });

        this.radioAscSNC = new Ext.form.Radio({
            hideLabel: true,
            id: 'radioAscSNC',
            align: 'center',
            boxLabel: 'Ascendentes',
            name: 'orden',
            checked: true
        });
        this.radioDescSNC = new Ext.form.Radio({
            hideLabel: true,
            id: 'radioDescSNC',
            align: 'center',
            boxLabel: 'Descendentes',
            name: 'orden',
        });
        this.fsOrdenAnnos = new Ext.form.FieldSet({
            title: 'Orden a&ntilde;os',
            height: 60,
            width: 250,
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.radioAscSNC]},
                        {columnWidth: .5, layout: 'form', items: [this.radioDescSNC]}
                    ]
                }
            ]
        });

        this.formularioExportarSC409 = new Ext.FormPanel({
            id: 'formularioExportarSC409',
            labelAlign: 'left',
            height: 300,
            frame: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: this.fsOrdenAnnos
        });

        this.ventanaExportarSC409 = new Ext.Window({
            plain: true,
            title: 'Exportar modelo SC-4-09',
            closeAction: 'hide',
            modal: true,
            frame: true,
            constrain: true,
            resizable: true,
            width: 300,
            height: 150,
            items: [this.formularioExportarSC409],
            buttons: [this.btnCancelarModeloSC409, this.btnAceptarModeloSC409],
        });

        //Restaurar SNC
        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            modoview: 2,
            estado: 1
        });

        this.btnAceptarPeriodosPagos = new Ext.Button({
            id: 'btnAceptarPeriodosPagos',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
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
            buttons: [this.btnAceptarPeriodosPagos]
        });

        this.btnRestaurar = new Ext.Toolbar.MenuButton({
            id: 'btnRestaurar',
            text: 'Restaurar',
            tooltip: 'Restaurar el submayor',
            iconCls: 'recargar',
            menu: {
                items: [
                    {
                        text: 'General', handler: function (items, p) {
                    }
                    }, {
                        text: 'Específicos', handler: function (items, p) {
                        }
                    }
                ]
            }
        });

        this.btnExportarSNCRango = new Ext.Button({
            id: 'btnExportarSNCRango',
            text: 'Exportar',
            tooltip: 'Exportar en Excel',
            disabled: true,
            iconCls: 'exportar'
        });

        this.btnAceptarExportarSNC = new Ext.Button({
            id: 'btnAceptarExportarSNC',
            text: 'Aceptar',
            tooltip: 'Exportar en Excel',
            disabled: false,
            iconCls: 'aceptar'
        });

        this.btnCancelarExportarSNC = new Ext.Button({
            id: 'btnCancelarExportarSNC',
            text: 'Cancelar',
            tooltip: 'Cancelar',
            disabled: false,
            iconCls: 'cancelar'
        });

        this.cbTiposNominaExp = new Ext.form.ComboBox({
            id: 'cbTiposNominaExp',
            msgTarget: 'qtip',
            enableQtip: true,
            fieldLabel: 'Tipos N&oacute;minas',
            valueField: 'idtiponomina',
            displayField: 'denominacion',
            hiddenName: 'idtiponomina',
            mode: 'local',
            forceSelection: true,
            store: modelo.storeCbTipoNomina,
            emptyText: 'Seleccione...',
            readOnly: false,
            allowBlank:true,
            triggerAction: 'all',
            anchor: '99%'
        });

        this.dfFechaDesde = new Ext.form.DateField({
            fieldLabel: 'Fecha desde',
            anchor: '90%',
            name: 'dfFechaDesde',
            id: 'dfFechaDesde',
            format: 'd/m/Y',
            allowBlank: false,
            prevTab: 'cbTiposNominaExp',
            nextTab: 'dfFechaHasta'
        });

        this.dfFechaHasta = new Ext.form.DateField({
            fieldLabel: 'Fecha hasta',
            anchor: '90%',
            name: 'dfFechaHasta',
            id: 'dfFechaHasta',
            format: 'd/m/Y',
            allowBlank: false,
            prevTab: 'dfFechaDesde',
            nextTab: 'cbTiposNominaExp'
        });

        this.formularioExportarExcel= new Ext.FormPanel({
            id: 'formularioExportarExcel',
            labelAlign: 'top',
            height: '99%',
            frame: true,
            items:[this.cbTiposNominaExp,{
                border: true,
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.dfFechaDesde]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.dfFechaHasta]
                    }]
                }]
            }]  
        });

        this.ventanaExportarSNC = new Ext.Window({
            title: 'Exportar Registros de Salario',
            modal: true,
            height: 250,
            width: 300,
            closable: true,
            constrain: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.formularioExportarExcel],
            buttons: [this.btnCancelarExportarSNC,this.btnAceptarExportarSNC]
        });
		
		//Ventana con los radios para escojer si se va a restaurar desde reportes serializados en la bd o desde reportes actuales
        this.rbReportesGuardadosSincBD = new Ext.form.Radio({
            id: 'rbReportesGuardadosSincBD',
            boxLabel: 'Reportes guardados base de datos',
            name: 'tiporeportes',
            inputValue: 1,
			checked: true 
        });
		
		this.rbReportesActuales = new Ext.form.Radio({
            id: 'rbReportesActuales',
            boxLabel: 'Reportes actuales',
            name: 'tiporeportes',
            inputValue: 2
        });

        this.rgTipoBusqueda = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.50, .50],
            style: 'padding-left: 20px;',
            items: [this.rbReportesGuardadosSincBD, this.rbReportesActuales]
        });
		
		this.formularioTipoBusqueda = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 750,
            heigth: 450,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [this.rgTipoBusqueda]
        });
		
		this.btnAceptarTipoBusqueda = new Ext.Button({
            id: 'btnAceptarTipoBusqueda',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana'
        });

        this.btnCancelarTipoBusqueda = new Ext.Button({
            id: 'btnCancelarTipoBusqueda',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaTipoBusqueda = new Ext.Window({
            region: 'center',
            title: 'Tipos de busqueda',
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

        //Ventana para seleccionar si se va a restaurar desde una configuracion actual o desde una formula con campos nomina antiguos
        this.rbConfiguracionFormulaActual = new Ext.form.Radio({
            id: 'rbConfiguracionFormulaActual',
            boxLabel: 'Configuraci&oacute;n f&oacute;rmula actual',
            name: 'tipoformula',
            inputValue: 1,
            checked: true
        });

        this.rbFormulaCamposNominaAntiguos = new Ext.form.Radio({
            id: 'rbFormulaCamposNominaAntiguos',
            boxLabel: 'F&oacute;rmula campos nomina antiguos (Salario Devengado)',
            name: 'tipoformula',
            inputValue: 2
        });

        this.rgTipoConfiguracionFormula = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.50, .50],
            style: 'padding-left: 20px;',
            items: [this.rbConfiguracionFormulaActual, this.rbFormulaCamposNominaAntiguos]
        });

        this.formularioTipoConfiguracionFormula = new Ext.FormPanel({
            id: 'formularioTipoConfiguracionFormula',
            width: 750,
            heigth: 450,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [this.rgTipoConfiguracionFormula]
        });

        this.btnAceptarTipoConfiguracionFormula = new Ext.Button({
            id: 'btnAceptarTipoConfiguracionFormula',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana'
        });

        this.btnCancelarTipoConfiguracionFormula = new Ext.Button({
            id: 'btnCancelarTipoConfiguracionFormula',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaTipoConfiguracionFormula = new Ext.Window({
            region: 'center',
            title: 'Tipos de configuraci&oacute;n de la f&oacute;rmula',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.formularioTipoConfiguracionFormula],
            bbar: ['->', this.btnCancelarTipoConfiguracionFormula, this.btnAceptarTipoConfiguracionFormula]
        });

        //Boton importar SNC
        this.btnImportarSNC = new Ext.Button({
            id: 'idbtnImportarSNC',
            text: 'Importar',
            iconCls: 'importar',
            tooltip: '<u>I</u>mportar(<b>Alt+I</b>)'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',
            // icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',

        });

        //Ficha de la persona.
        this.pfichadelapersona = new Ext.pvd.persona.fichapersona.panelFichapersona({
            id: 'pfichadelapersona',
            region: 'north',
            idficha: 'pfichadelapers',
            width: '100%',
            heigth: 250,
            border: true,
            split: true,
            idCmp: 'pfichadelapersona'
        });

        //Listado de histórico de retenciones.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smRegSalario = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpRegSalario = new Ext.grid.GridPanel({
            id: 'gpRegSalario',
            title: 'Registro de salario y tiempo de servicio',
            region: 'center',
            columns: [
                {
                    header: 'Año',
                    fixed: false,
                    width: 10,
                    sortable: true,
                    dataIndex: 'anno',
                    hidden: true,
                    renderer: centrarValor
                }, {
                    header: '<center>Mes</center>',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'mes',
                    renderer: centrarValor
                }, {
                    header: '<center>Leyenda</center>',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'confregistsalartiempservc',
                    renderer: centrarValor
                }, {
                    header: '<center>N&oacute;mina</center>',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominaciotiponomina',
                    renderer: centrarValor
                }, {
                    header: '<center>D&iacute;as acumulados</center>',
                    fixed: false,
                    width: 100,
                    sortable: true,
                    dataIndex: 'diasacumulados',
                    renderer: centrarValor
                }, {
                    header: '<center>Salario devengado</center>',
                    fixed: false,
                    width: 150,
                    sortable: true,
                    dataIndex: 'salariodevengado',
                    renderer: centrarValor
                }, {
                    header: 'idtiponomina',
                    width: 50,
                    sortable: true,
                    dataIndex: 'idtiponomina',
                    hidden: true
                }, {
                    header: 'idregistrosalariotiemposervicio',
                    width: 50,
                    sortable: true,
                    dataIndex: 'idregistrosalariotiemposervicio',
                    hidden: true
                }/*,{
                 header: 'Salario devengado c&aacute;lculo reporte',
                 fixed: false,
                 width: 150,
                 sortable: true,
                 dataIndex: 'salariodevengadoreporte',
                 renderer: centrarValor
                 //hidden: true,
                 }*/
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '70%',
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.storeRegistroSalario,
            sm: this.smRegSalario,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeRegistroSalario,
                displayInfo: true
            })
        });

        //Ventana para gestionar las retenciones de las personas por entidades.
        this.winRegSalario = new Ext.Window({
            //title: 'Gestionar registro de salarios y tiempo de servicio',
            modal: true,
            height: '100%',
            width: '100%',
            constrain: true,
            closeAction: 'hide',
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'border',
            items: [
                new Ext.TabPanel({
                    id: 'tabpersonas',
                    border: false,
                    activeTab: 0,
                    region: 'center',
                    items: [this.gpPersonas, this.gpPersonasHistorico],
                    listeners: {
                        tabchange: function (a) {
                            var idtab = a.getActiveTab().id;
                            if (idtab == 'g1') {
                                self.btnRestaurar.show();
                                self.btnImportarSNC.show();
                                self.btnAdicionar.show();
                                self.btnModificar.show();
                                self.btnEliminar.show();
                            } else {
                                self.btnRestaurar.hide();
                                self.btnImportarSNC.hide();
                                self.btnAdicionar.hide();
                                self.btnModificar.hide();
                                self.btnEliminar.hide();
                            }
                        }
                    }
                }),
                {
                    region: 'east',
                    height: '100%',
                    width: '60%',
                    layout: 'ux.row',
                    items: [{
                        rowHeight: .3,
                        width: '100%',
                        border: false,
                        layout: 'fit',
                        items: [this.pfichadelapersona]
                    }, {
                        rowHeight: .7,
                        width: '100%',
                        border: false,
                        layout: 'fit',
                        tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnExportaSNC, this.btnExportaSNC09, '->', this.btnExportarSNCRango, this.btnRestaurar, this.btnImportarSNC, this.btnAyuda],
                        items: [this.gpRegSalario]
                    }]
                }],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminar.handler();
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionar.handler();
                    }
                }, {
                    key: 'e',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnExportaSNC.handler();
                    }
                }
            ]
        });

        //Formulario de registro de salarios y tiempo de servicios.
        this.cbAnnos = new Ext.form.ComboBox({
            id: 'cbAnnos',
            fieldLabel: 'Año',
            valueField: 'idannos',
            displayField: 'denominacion',
            hiddenName: 'idannos',
            allowBlank: false,
            blankText: 'Este campo es obligatorio',
            mode: 'local',
            store: modelo.storeCbAnnos,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '90%'
        });

        this.cbMeses = new Ext.form.ComboBox({
            id: 'cbMeses',
            fieldLabel: 'Mes',
            valueField: 'idmes',
            displayField: 'denominacion',
            hiddenName: 'idmes',
            allowBlank: false,
            blankText: 'Este campo es obligatorio',
            mode: 'local',
            store: modelo.storeCbMeses,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            triggerAction: 'all',
            anchor: '90%'
        });

        this.cbTiposNomina = new Ext.form.ComboBox({
            id: 'cbTiposNomina',
            fieldLabel: 'Tipos N&oacute;minas',
            valueField: 'idtiponomina',
            displayField: 'denominacion',
            hiddenName: 'idtiponomina',
            mode: 'local',
            store: modelo.storeCbTipoNomina,
            emptyText: 'Seleccione...',
            readOnly: false,
            triggerAction: 'all',
            anchor: '99%'
        });

        this.nfDiasAcumulados = new Ext.form.NumberField({
            id: 'nfDiasAcumulados',
            fieldLabel: 'D&iacute;as acumulados',
            blankText: 'Este campo es obligatorio',
            allowBlank: false,
            anchor: '90%',
            maxLength: 20
        });

        this.nfSalarioDevengado = new Ext.form.NumberField({
            id: 'nfSalarioDevengado',
            fieldLabel: 'Salario devengado',
            allowBlank: false,
            blankText: 'Este campo es obligatorio',
            anchor: '90%',
            maxLength: 20
        });

        this.formularioRegSalario = new Ext.FormPanel({
            id: 'formularioRegSalario',
            labelAlign: 'top',
            frame: true,
            width: 900,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .10, layout: 'form', items: [this.cbAnnos]},
                    {columnWidth: .10, layout: 'form', items: [this.cbMeses]},
                    {columnWidth: .50, layout: 'form', items: [this.cbTiposNomina]},
                    {columnWidth: .15, layout: 'form', items: [this.nfDiasAcumulados]},
                    {columnWidth: .15, layout: 'form', items: [this.nfSalarioDevengado]}
                ]
            }]
        });

        //Botones
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            iconCls: 'aplicar',
            //icon: perfil.dirImg + 'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt+P</b>)',
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptarRS',
            iconCls: 'aceptar',
            //   icon: perfil.dirImg + 'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        });

        //Ventana de adicionar y modificar registro de salarios.
        this.ventanaRegSalario = new Ext.Window({
            title: 'Adicionar registro de salarios y tiempo de servicios',
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioRegSalario],
            buttons: [this.btnCancelar, this.btnAceptar],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptar.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelar.handler();
                    }
                }
            ]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestregistrosalariotiemposervicio', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Controlador.init(idioma, vista, modelo);
});
