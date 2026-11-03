Ext.ns('Pvd.Nomina.Submayor.Vacaciones');

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

//Vista del componente Gestionar submayor de vacaciones.
Pvd.Nomina.Submayor.Vacaciones.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar submayor de vacaciones(Tipo: Pvd.Nomina.Submayor.Vacaciones.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        //variables
        _this = this;
        var flag = 0;
        var params = 0;
        this.limitetiempo = 0;
        this.idestructura = 0;
        this.idvacacionespersona = 0;
        var compartimentarrecalcular = true;

        //Componente informativo del pago y la persona
        this.btnDatos = new Ext.Button({
            text: 'Mostrar datos',
            iconCls: 'aceptar'
        });

        //Componente informativo del pago y la persona
        this.datosgeneralesub = new Pvd.Nomina.Pago.Datossubmayor({
            modal: true,
        });

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
            tooltip: idioma.lbBtnAceptar,
            disabled: true,
            iconCls: 'aceptar'
        });
        this.winEstructura = new Ext.Panel({
            title: idioma.lbTitleWinEstructura,
            modal: true,
            height: '100%',
            width: '100%',
            layout: 'fit',
            items: [this.pobjestructura]

        });
        this.panelestructuraPersonas = new Ext.Panel({
            id: 'panelestructurapersonas',
            heigth: '100%',
            width: '10%',
            split: true,
            region: 'west',
            layout: 'border',
            items: [{
                xtype: 'panel',
                region: 'center',
                height: '100%',
                width: '100%',
                split: true,
                layout: 'fit',
                items: [this.winEstructura]
            }]
        });

        //Personas altas******************************************************************************
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

        //Personas con derecho submayor
        this.btnAdicionarPersonas = new Ext.Button({
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Adicionar persona(<b>Alt + I</b>>).',
            disabled: true,
            iconCls: 'adicionar'
        });

        this.btnEliminarPersonas = new Ext.Button({
            id: 'btnEliminarPersonas',
            text: 'Eliminar',
            tooltip: 'Eliminar',
            disabled: true,
            iconCls: 'eliminar'
        });

        this.btnBuscar = new Ext.Button({
            disabled: true,
            id: 'btnBuscar',
            //icon :'buscar',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar persona(s)'

        });

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            minLength: 3,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar...',
            name: 'tfbuscador'

        });

        this.btnLimpiar = new Ext.Button({
            disabled: false,
            id: 'btnLimpiar',
            //icon :'buscar',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtros',

        });

        this.smPersonasDerecho = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        //Grid de personas con derecho
        this.gpPersonasDerecho = new Ext.grid.GridPanel({
            id: 'gpPersonasDerecho',
            title: 'Listado de personas submayor de vacaciones',
            region: 'center',
            columns: [this.smPersonasDerecho, new Ext.grid.RowNumberer(), {
                header: 'idpersona',
                sortable: true,
                dataIndex: 'idpersona',
                hidden: true
            }, {
                header: 'Cod. contable',
                width: 80,
                sortable: true,
                dataIndex: 'cdgocontable',
                renderer: formatearColores
            }, {
                header: 'No. identidad',
                width: 80,
                sortable: true,
                dataIndex: 'noidentidad',
                renderer: formatearColores
            }, {
                header: 'Nombre y apellidos',
                sortable: true,
                width: 200,
                dataIndex: 'nombreapellidos',
                renderer: formatearColores
            }, {header: 'Cargo', width: 300, sortable: true, dataIndex: 'cargo', renderer: formatearColores}
                //, {header: 'Plantilla nominal', width: 80, sortable: true, hidden: true, dataIndex: 'plantillanominal'}
                , {
                    header: 'Plantilla nominal',
                    width: 80,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'plantillanominal',
                    renderer: fnSeleccionarPlantilla
                }, {
                    header: 'saldoentiempo',
                    width: 80,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'saldoentiempo'
                }, {header: 'ordencargo', width: 80, sortable: true, hidden: true, dataIndex: 'ordencargo'}
            ],
            tbar: [this.btnAdicionarPersonas, this.btnEliminarPersonas, '|', 'Buscar persona:', this.tfbuscar, this.btnBuscar, this.btnLimpiar],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.storePersonasDerechoSubmayor,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
            }),
            store: modelo.storePersonasDerechoSubmayor,
            sm: this.smPersonasDerecho,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        function formatearColores(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('iddatvacacionespersona') == null) {
                return '<span style="color:blue;">' + val + '</span>';
            } else {
                if (record.get('saldoentiempo') >= 20) {
                    return '<span style="color:red;">' + val + '</span>';
                } else {
                    return '<span style="color:green;">' + val + '</span>';
                }
            }
            return val;
        }

        function fnSeleccionarPlantilla(val, metaData, record, rowIndex, colIndex, store) {
            //return '<span style="color:black;">' + record.get('ordenplantilla').split("-")[1] + '</span>';
            return '<span style="color:black;">' + val.split("-")[1] + '</span>';
        }

        //Ficha de la persona
        this.pfichadelapersona = new Ext.pvd.persona.fichapersona.panelFichapersona({
            id: 'pfichadelapersona',
            region: 'north',
            idficha: 'pfichadelapers',
            width: '100%',
            height: '30%',
            border: true,
            split: true,
            idCmp: 'pfichadelapersona'
        });

        //Ventana de adicionar personas
        this.btnAdicionarVac = new Ext.Button({
            id: 'idbtnAdicionarVac',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddVac,
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarVac',
            nextTab: 'idbtnModificarVac',
        });

        this.btnModificarVac = new Ext.Button({
            id: 'idbtnModificarVac',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModVac,
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarVac',
            nextTab: 'idbtnEliminarVac',
        });

        this.btnEliminarVac = new Ext.Button({
            id: 'idbtnEliminarVac',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimVac,
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarVac',
            nextTab: 'idbtnAdicionarVac',
        });

        this.dfFInicioFechas = new Ext.form.DateField({
            id: 'dfFInicioFechas',
            fieldLabel: 'Fecha inicio',
            tabIndex: 5,
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
            vtype: 'daterange',
            anchor: '90%',
            endDateField: 'dfFFinFechas'
        });

        this.dfFFinFechas = new Ext.form.DateField({
            id: 'dfFFinFechas',
            fieldLabel: 'Fecha fin',
            tabIndex: 6,
            name: 'fechafin',
            xtype: 'datefield',
            allowBlank: true,
            format: 'd/m/Y',
            editable: true,
            readOnly: false,
            maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            blankText: 'Este campo es obligatorio.',
            invalidText: 'Formato: dd/mm/aaaa.',
            vtype: 'daterange',
            anchor: '90%',
            startDateField: 'dfFInicioFechas'
        });

        //Formulario del rango de fechas para exportar.
        this.formularioFechas = new Ext.FormPanel({
            id: 'idformularioHisVac',
            labelAlign: 'top',
            frame: true,
            width: 350,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    //{columnWidth:.33, layout: 'form', items: [this.dfFechaOperacion]},
                    {columnWidth: .5, layout: 'form', items: [this.dfFInicioFechas]},
                    {columnWidth: .5, layout: 'form', items: [this.dfFFinFechas]},
                ]
            }
            ],
        });

        //Botones de la ventana del rango de fechas para exportar.
        this.btnCancelarFechas = new Ext.Button({
            id: 'btnCancelarFechas',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cancelar',
            prevTab: 'nfPromedioImporte',
            nextTab: 'btnAceptarHisVac',
        });

        this.btnAceptarFechas = new Ext.Button({
            id: 'btnAceptarFechas',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            prevTab: 'btnCancelarHisVac',
            nextTab: 'idnfRefNomina',
        });

        //Ventana del rango de fechas para exportar.
        this.ventanaFechas = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioFechas],
            buttons: [this.btnCancelarFechas, this.btnAceptarFechas],
        });

        //Ventana períodos de pagos
        this.btnAceptarPeriodosPagosSA = new Ext.Button({
            id: 'btnAceptarPeriodosPagosSA',
            text: 'Aceptar',
            tooltip: 'Aceptar per&iacute;dos de pagos',
            iconCls: 'aceptar',
            disabled: true
        });

        this.radioPdf = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioPdf',
            align: 'center',
            boxLabel: 'PDF',
            fieldLabel: 'PDF2',
            name: 'formato',
            checked: true
        });

        this.radioExcel = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioExcel',
            align: 'center',
            boxLabel: 'EXCEL',
            fieldLabel: 'EXCEL2',
            name: 'formato'
        });

        this.panelFormato = new Ext.FormPanel({
            id: 'idpanelFormato',
            width: 300,
            autoHeight: true,
            frame: true,
            region: 'south',
            items: [{
                xtype: 'fieldset',
                title: 'Formatos',
                height: 60,
                width: '92%',
                region: 'center',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {columnWidth: .5, layout: 'column', items: [this.radioPdf]},
                            {columnWidth: .5, layout: 'column', items: [this.radioExcel]}
                        ]
                    }
                ]
            }]
        });


        this.smPeriodosPago = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.gpPeriodosPagos = new Ext.grid.GridPanel({
            id: 'idGpPeriodosPagos',
            title: 'Listado de per&iacute;dos de pagos',
            region: 'center',
            border: false,
            loadMask: {text: 'Cargando los per&iacute;dos...'},
            width: 500,
            columns: [this.smPeriodosPago,
                {header: 'idperiodo', dataIndex: 'idperiodo', hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anno', hidden: true},
                {header: 'Mes del per&iacute;odo', dataIndex: 'mes', width: 100},
                //{header: 'fechapago', dataIndex: 'fechapago', width: 100},
                //{header: 'fechainicio', dataIndex: 'fechainicioperiodo', width: 100},
                //{header: 'fechafin', dataIndex: 'fechafinperiodo', width: 100},
            ],
            store: modelo.stPeriodosPago,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smPeriodosPago
        });

        this.ventanaPeriodosPagos = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            modal: true,
            height: 400,
            width: 300,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'border',
            items: [this.gpPeriodosPagos, this.panelFormato],
            buttons: [this.btnAceptarPeriodosPagosSA]
        });

        //ventana para exportar Sub-Mayor Vacaciones con mas de 20 dias
        this.btnAceptarSubMayor = new Ext.Button({
            id: 'btnAceptarSubMayor',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            iconCls: 'aceptar',
            disabled: true
        });

        this.radioPdfSubMayor = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioPdfSubMayor',
            align: 'center',
            boxLabel: 'PDF',
            fieldLabel: 'PDF2',
            name: 'formato',
            checked: true
        });

        this.radioExcelSubMayor = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioExcelSubMayor',
            align: 'center',
            boxLabel: 'EXCEL',
            fieldLabel: 'EXCEL2',
            name: 'formato'
        });

        this.panelFormatoSubMayor = new Ext.FormPanel({
            id: 'panelFormatoSubMayor',
            width: 300,
            autoHeight: true,
            frame: true,
            region: 'south',
            items: [{
                xtype: 'fieldset',
                // title: 'Formatos',
                height: 60,
                width: '92%',
                region: 'center',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {columnWidth: .5, layout: 'column', items: [this.radioPdfSubMayor]},
                            {columnWidth: .5, layout: 'column', items: [this.radioExcelSubMayor]}
                        ]
                    }
                ]
            }]
        });

        this.ventanaSubMayor = new Ext.Window({
            title: 'Formato a exportar.',
            modal: true,
            height: 150,
            width: 300,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            items: [this.panelFormatoSubMayor],
            buttons: [this.btnAceptarSubMayor]
        });

        //Descuadres cargas iniciales y finales
        this.smPeriodosPagoDescCargasIyF = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.gpPeriodosPagosDescCargasIyF = new Ext.grid.GridPanel({
            id: 'idgpPeriodosPagosDescCargasIyF',
            title: 'Listado de per&iacute;dos de pagos',
            region: 'center',
            border: false,
            loadMask: {text: 'Cargando los per&iacute;dos...'},
            width: 500,
            columns: [this.smPeriodosPagoDescCargasIyF,
                {header: 'idperiodo', dataIndex: 'idperiodo', hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anno', hidden: true},
                {header: 'Mes del per&iacute;odo', dataIndex: 'mes', width: 100},
            ],
            store: modelo.stPeriodosPagoDescCargasIyF,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smPeriodosPagoDescCargasIyF
        });

        this.radioSaldoFinalDescCargasIyF = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioSaldoFinal',
            align: 'center',
            boxLabel: 'Saldo final per&iacute;odo - Carga inicial per&iacute;odo posterior',
            name: 'radio',
            checked: true
        });

        this.radioCargaInicialDescCargasIyF = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioCargaInicial',
            align: 'center',
            boxLabel: 'Carga inicial per&iacute;odo -  Saldo final per&iacute;odo anterior',
            name: 'radio',
            //checked: true
        });

        this.panelFormatoDescCargasIyF = new Ext.FormPanel({
            id: 'idpanelFormatoDescCargasIyF',
            width: 300,
            autoHeight: true,
            frame: true,
            region: 'south',
            items: [{
                xtype: 'fieldset',
                title: 'Modo de comparaci&oacute;n',
                height: 80,
                width: '92%',
                //region: 'center',
                items: [
                    {
                        layout: 'column',
                        columnWidth: 1,
                        items: this.radioSaldoFinalDescCargasIyF

                    },
                    {
                        layout: 'column',
                        columnWidth: 1,
                        items: this.radioCargaInicialDescCargasIyF
                    }
                ]
            }]
        });

        this.btnAceptarPeriodosDescCargasIyF = new Ext.Button({
            id: 'btnAceptarPeriodosDescCargasIyF',
            text: 'Aceptar',
            tooltip: 'Aceptar per&iacute;dos de pagos',
            iconCls: 'aceptar',
            //disabled: true
        });

        this.winPeriodosPagosDescCargasIyF = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            layout: 'border',
            modal: true,
            height: 400,
            width: 350,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            items: [this.gpPeriodosPagosDescCargasIyF/*, this.panelFormatoDescCargasIyF*/],
            buttons: [this.btnAceptarPeriodosDescCargasIyF]
        });

        //Descuadres submayor
        this.smPeriodosPagoDescSubmayor = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.gpPeriodosPagosDescSubmayor = new Ext.grid.GridPanel({
            id: 'idgpPeriodosPagosDescSubmayor',
            title: 'Listado de per&iacute;dos de pagos',
            region: 'center',
            border: false,
            loadMask: {text: 'Cargando los per&iacute;dos...'},
            width: 500,
            columns: [this.smPeriodosPagoDescSubmayor,
                {header: 'idperiodo', dataIndex: 'idperiodo', hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anno', hidden: true},
                {header: 'Mes del per&iacute;odo', dataIndex: 'mes', width: 100},
            ],
            store: modelo.stPeriodosPagoDescSubmayor,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smPeriodosPagoDescSubmayor
        });

        this.btnAceptarPeriodosDescSubmayor = new Ext.Button({
            id: 'btnAceptarPeriodosDescSubmayor',
            text: 'Aceptar',
            tooltip: 'Aceptar per&iacute;dos de pagos',
            iconCls: 'aceptar',
            //disabled: true
        });

        this.winPeriodosPagosDescSubmayor = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            layout: 'border',
            modal: true,
            height: 400,
            width: 350,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            items: [this.gpPeriodosPagosDescSubmayor],
            buttons: [this.btnAceptarPeriodosDescSubmayor]
        });

        //Descuadres nominas
        this.smPeriodosPagoDescNomina = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.gpPeriodosPagosDescNomina = new Ext.grid.GridPanel({
            id: 'idgpPeriodosPagosDescNomina',
            title: 'Listado de per&iacute;dos de pagos',
            region: 'center',
            border: false,
            loadMask: {text: 'Cargando los per&iacute;dos...'},
            width: 500,
            columns: [this.smPeriodosPagoDescNomina,
                {header: 'idperiodo', dataIndex: 'idperiodo', hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anno', hidden: true},
                {header: 'Mes del per&iacute;odo', dataIndex: 'mes', width: 100},
            ],
            store: modelo.stPeriodosPagoDescNomina,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smPeriodosPagoDescNomina
        });

        this.btnAceptarPeriodosDescNomina = new Ext.Button({
            id: 'btnAceptarPeriodosDescNomina',
            text: 'Aceptar',
            tooltip: 'Aceptar per&iacute;dos de pagos',
            iconCls: 'aceptar',
            //disabled: true
        });

        this.winPeriodosPagosDescNomina = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            layout: 'border',
            modal: true,
            height: 400,
            width: 350,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            items: [this.gpPeriodosPagosDescNomina],
            buttons: [this.btnAceptarPeriodosDescNomina]
        });


        //Cuadrar submayor vacaciones
        this.btnAceptarPeriodosPagosCuadrarSubmayor = new Ext.Button({
            id: 'btnAceptarPeriodosPagosCuadrarSubmayor',
            text: 'Aceptar',
            tooltip: 'Aceptar per&iacute;dos de pagos',
            disabled: true,
            iconCls: 'aceptar'
        });
        this.smPeriodosPagoCuadrarSubmayor = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gpPeriodosPagosCuadrarSubmayor = new Ext.grid.GridPanel({
            id: 'idgpPeriodosPagosCuadrarSubmayor',
            title: 'Listado de per&iacute;dos de pagos',
            region: 'center',
            height: 250,
            width: '100%',
            border: false,
            loadMask: {text: 'Cargando los per&iacute;dos...'},
            columns: [
                this.smPeriodosPagoCuadrarSubmayor,
                {header: 'idperiodo', dataIndex: 'idperiodo', hidden: true},
                {header: 'A&ntilde;o', dataIndex: 'anno', hidden: true},
                {header: 'Mes del per&iacute;odo', dataIndex: 'mes', width: 100}
            ],
            store: modelo.stPeriodosPagoCuadrarSubmayor,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smPeriodosPagoCuadrarSubmayor
        });

        this.smCamposDias = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.smCamposImporte = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gpCamposDias = new Ext.grid.GridPanel({
            id: 'gpCamposDias',
            title: 'Campos acumulan-liqu&iacute;dan d&iacute;as',
            region: 'center',
            border: false,
            height: '100%',
            width: '50%',
            disabled: true,
            loadMask: {text: 'Cargando los campos...'},
            columns: [
                this.smCamposDias,
                {header: 'idestructurarmodelonomina', dataIndex: 'idestructurarmodelonomina', hidden: true},
                {header: 'idtiponomina', dataIndex: 'idtiponomina', hidden: true},
                {header: 'Tipo n&oacute;mina', dataIndex: 'tiponomina', hidden: true},
                {header: 'Denominaci&oacute;n', dataIndex: 'denominacion', width: 100}
            ],
            store: modelo.stCamposDias,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smCamposDias
        });
        this.gpCamposImporte = new Ext.grid.GridPanel({
            id: 'gpCamposImporte',
            title: 'Campos acumulan-liqu&iacute;dan importe',
            region: 'east',
            border: false,
            height: '100%',
            width: '50%',
            disabled: true,
            loadMask: {text: 'Cargando los campos...'},
            columns: [
                this.smCamposImporte,
                {header: 'idestructurarmodelonomina', dataIndex: 'idestructurarmodelonomina', hidden: true},
                {header: 'idtiponomina', dataIndex: 'idtiponomina', hidden: true},
                {header: 'Tipo n&oacute;mina', dataIndex: 'tiponomina', hidden: true},
                {header: 'Denominaci&oacute;n', dataIndex: 'denominacion', width: 100}
            ],
            store: modelo.stCamposImporte,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smCamposImporte
        });
        this.chbModoCuadre = new Ext.form.Checkbox({
            id: 'idchbModoCuadre',
            //fieldLabel: 'Manual',
            boxLabel: 'Manual',
            bottonAlign: 'center',
            name: 'manual',
            anchor: '99%',
            listeners: {
                check: function (checkBox, checked) {
                    if (checked) {
                        var periodo = new Array();
                        var periodossel = _this.smPeriodosPagoCuadrarSubmayor.getSelections();
                        Ext.each(periodossel, function (sm) {
                            periodo.push(sm.data.idperiodo);
                        });
                        _this.gpCamposDias.enable(), _this.gpCamposImporte.enable();
                        modelo.stCamposDias.load({
                            params: {
                                idestructura: _this.idestructura,
                                idperiodo: Ext.encode(periodo)
                            }
                        });
                        modelo.stCamposImporte.load({
                            params: {
                                idestructura: _this.idestructura,
                                idperiodo: Ext.encode(periodo)
                            }
                        });
                    } else {
                        _this.gpCamposDias.disable(), _this.gpCamposImporte.disable();
                        _this.smCamposDias.clearSelections();
                        _this.smCamposImporte.clearSelections();
                    }
                }
            }
        });
        this.panelChbModoCuadre = new Ext.FormPanel({
            id: 'panelChbModoCuadre',
            region: 'south',
            height: 50,
            width: '100%',
            border: true,
            layout: 'fit',
            frame: true,
            items: [this.chbModoCuadre]
        });
        this.panelCamposCuadreSubmayor = new Ext.Panel({
            id: 'panelCamposCuadreSubmayor',
            title: 'Modo cuadrar submayor',
            region: 'south',
            height: 300,
            width: '100%',
            border: true,
            layout: 'border',
            items: [
                {
                    region: 'center',
                    height: '100%',
                    width: '100%',
                    layout: 'ux.row',
                    split: true,
                    items: [
                        {
                            rowHeight: .20,
                            width: '100%',
                            border: false,
                            layout: 'fit',
                            items: [this.panelChbModoCuadre]
                        },
                        {
                            rowHeight: .80,
                            width: '100%',
                            border: false,
                            layout: 'border',
                            items: [
                                this.gpCamposDias,
                                this.gpCamposImporte
                            ]
                        },
                    ]
                }
            ]
        });
        this.ventanaPeriodosPagosCuadrarSubmayor = new Ext.Window({
            title: 'Cuadrar por n&oacute;minas',
            modal: true,
            height: 500,
            width: 600,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'border',
            items: [this.gpPeriodosPagosCuadrarSubmayor, this.panelCamposCuadreSubmayor],
            buttons: [this.btnAceptarPeriodosPagosCuadrarSubmayor]
        });
        this.btnNotificarVac = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar',
            disabled: true,
            menu: {
                items: [
                    {
                        text: 'Carga Inicial', handler: function (items, p) {
                        var winload = new Ext.PVD.comun.window.winLoad({
                            title: 'Por favor espere...',
                            mensaje: 'Generando reporte'
                        });
                        winload.showMask();
                        window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/gestsubmayorvacaciones/importarCargaInicial?identidad=' + _this.idestructura + '&exportar=' + -1);
                        winload.close();
                    }
                    }, {
                        disabled: true,
                        hidden: true,
                        id: '1', text: 'Sub-Mayor Vacaciones General', handler: function (items, p) {
                            _this.flag = 1;
                        }
                    }, {
                        disabled: true,
                        hidden: true,
                        text: 'Sub-Mayor Vacaciones Individual', handler: function (items, p) {
                        }
                    }, {
                        disabled: true,
                        hidden: true,
                        text: 'Sub-Mayor Vacaciones Combinado', handler: function (items, p) {
                        }
                    }, {
                        text: 'Sub-Mayor Vacaciones Personas con más de 20 días acumulados',
                        handler: function (items, p) {
                        }
                    }, {
                        text: 'Listado de saldos acumulados de vacaciones', handler: function (items, p) {

                        }
                    }, {
                        text: 'Listado de saldos iniciales y finales por per&iacute;odos',
                        handler: function (items, p) {

                        }
                    }
                ]
            }
        });
        
        this.btnCuadrarSub = new Ext.Button({
            id: 'btnRecalcularSub',
            text: 'Cuadrar submayor',
            tooltip: 'Cuadrar submayor de vacaciones(<b>Alt+C</b>)',
            iconCls: 'Calcular verde',
            hidden: compartimentarrecalcular
        });

        this.btnMenuCuadrar = new Ext.Toolbar.MenuButton({
            text: 'Reportes submayor',
            iconCls: 'Calcular',
            menu: {
                items: [
                    {
                        id: 'idbtncuadraroperaciones',
                        text: 'Cuadrar por operaciones',
                        tooltip: 'Cuadrar submayor por operaciones',
                        iconCls: 'Documentos',
                        hidden: false,
                    },
                    {
                        id: 'idbtncuadrarnominas',
                        text: 'Cuadrar por n&oacute;minas',
                        tooltip: 'Cuadrar submayor por n&oacute;minas',
                        iconCls: 'Nomina',
                        hidden: false,
                    },
                    {
                        id: 'idbtnmostrarpersonas',
                        text: 'Listado de saldos finales de las personas por n&oacute;minas',
                        tooltip: 'Personas con errores en el submayor',
                        iconCls: 'Persona',
                    },
                    {
                        id: 'idbtnimportaroperaciones',
                        text: 'Importar operaciones submayor',
                        tooltip: 'Importar operaciones submayor de vacaciones',
                        iconCls: 'importar',
                        disabled: true,
                    },
                    {
                        id: 'idbtndescuadrescargas',
                        text: 'Descuadres cargas iniciales y finales',
                        tooltip: 'Mostrar descuadres entre las cargas iniciales del mes y finales del mes anterior.',
                        iconCls: 'vacaciones',
                    },
                    {
                        id: 'idbtndescuadressubmayor',
                        text: 'Personas faltantes submayor',
                        tooltip: 'Mostrar personas que se encuentran en las n&oacute;minas y no en el submayor.',
                        iconCls: 'nomina',
                    },
                    {
                        id: 'idbtndescuadresnominas',
                        text: 'Personas faltantes n&oacute;minas',
                        tooltip: 'Mostrar personas que se encuentran en el submayor y no en las n&oacute;minas.',
                        iconCls: 'nomina',
                    }]
            }
        });
        this.btnMenuCuadrarBajas = new Ext.Toolbar.MenuButton({
            text: 'Cuadrar submayor',
            tooltip: 'Cuadrar submayor de vacaciones bajas(<b>Alt+C</b>)',
            iconCls: 'Calcular',
            menu: {
                items: [
                    {
                        id: 'idbtncuadraroperaciones',
                        text: 'Cuadrar por operaciones',
                        tooltip: 'Cuadrar submayor por operaciones',
                        iconCls: 'Documentos',
                        handler: function () {
                            mostrarMensaje(2,
                                '<b style="color: red">Con esta acci&oacute;n se cuadrar&aacute;n todas las operaciones del submayor de vacaciones.</b>' +
                                '¿Est&aacute seguro que desea cuadrar las operaciones de todas las persona en la entidad.?  ',
                                function (btn) {
                                    if (btn == 'ok') {
                                        PVD.mostrarMascara('idmaskcuadrarvac', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgCuadrarVac);
                                        Ext.Ajax.request({
                                            url: 'cuadrarSubMayorVacaciones',
                                            method: 'POST',
                                            params: {
                                                identidad: _this.idestructura,
                                                tipo: 1
                                            },
                                            callback: function (options, success, response) {
                                                PVD.ocultarMascara('idmaskcuadrarvac');
                                                var responseData = Ext.decode(response.responseText);
                                                if (responseData == 'ok') {
                                                    mostrarMensaje(1, idioma.lbMsgCorrectoCuadreVac, function (btn) {
                                                        modelo.storeVac.load();
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                        }
                    },
                    {
                        id: 'idbtncuadrarnominas',
                        text: 'Cuadrar por n&oacute;minas',
                        tooltip: 'Cuadrar submayor por n&oacute;minas',
                        iconCls: 'Nomina'
                    }
                ]
            }
        });

        //Operaciones de las personas altas
        this.btnFormula = new Ext.Button({
            id: 'idbtnFormula',
            text: idioma.lbBtnformula,
            tooltip: idioma.textToolTipFormVac,
            iconCls: 'modificar',
        });

        this.btnCargaInicial = new Ext.Button({
            id: 'btnCargaInicial',
            text: 'Importar ',
            tooltip: 'Importar desde un excel',
            iconCls: 'importar',
            disabled: true
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',
            iconCls: 'ayuda',

        });

        //Listado de vacaciones.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smVac = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpVac = new Ext.grid.GridPanel({
            id: 'idgpVac',
            title: idioma.lbTitleGridVac,
            region: 'center',
            columns: [{
                header: 'idvacacionespersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idvacacionespersona'
            }, {
                header: idioma.lbColTiempoInicial,
                sortable: true,
                dataIndex: 'tiempoacumuladoinicial',
                renderer: centrarValor
            }, {
                header: idioma.lbColSaldoInicial,
                width: 80,
                sortable: true,
                dataIndex: 'importeacumuladoinicial',
                renderer: centrarValor
            }, {
                header: "<b style='color: green'>" + idioma.lbColTiempo + "</b>",
                width: 80,
                sortable: true,
                dataIndex: 'tiempoacumulado',
                renderer: function (val) {
                    return "<b style='color: green'><center>" + val + "</center></b>";
                }
            }, {
                header: "<b style='color: green'>" + idioma.lbColSaldo + "</b>",
                width: 90,
                sortable: true,
                dataIndex: 'importeacumulado',
                renderer: function (val) {
                    return "<b style='color: green'><center>" + val + "</center></b>";
                }
            }, {
                header: idioma.lbColDesde,
                fixed: true,
                width: 85,
                sortable: true,
                dataIndex: 'fechainicio',
                renderer: centrarValor
            }, //{
            //     header: idioma.lbColHasta,
            //     fixed: true,
            //     width: 85,
            //     sortable: true,
            //     dataIndex: 'fechafin',
            //     renderer: centrarValor
            // }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            //plugins: this.expanderConcepto, 
            viewConfig: {forceFit: true},
            store: modelo.storeVac,
            sm: this.smVac,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });

        //Listado de histórico de vacaciones.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        function tipoAjuste(val) {
            if (val == 0)
                return "<center>" + 'Ninguno' + "</center>";
            if (val == 1)
                return "<center>" + 'Suma' + "</center>";
            if (val == 2)
                return "<center>" + 'Resta' + "</center>";
            else
                return "<center>" + '' + "</center>";
        }

        function centrarTipoOperValor(val) {
            var v = '';
            if (val == 1) {
                v = "<center>Acumulaci&oacute;n</center>";
            }
            else if (val == 2) {
                v = "<center>Liquidaci&oacute;n</center>";
            }
            else {
                v = "<center>" + val + "</center>";
            }
            return v;
        }

        function obtenerPeriodo(val) {
            //console.info(val);
            var arrPeriodo = val.split("-");
            return arrPeriodo[2] + "-" + arrPeriodo[3];
        }

        this.smHistVac = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        //Botones de Add, Mod, Elim del historico.
        this.btnAdicionarHisVac = new Ext.Button({
            id: 'btnAdicionarHisVac',
            text: 'Ad<u>i</u>cionar',
            disabled: true,
            tooltip: 'Adicionar histórico(<b>Alt + I</b>>).',
            iconCls: 'adicionar',
            prevTab: 'btnEliminarHisVac',
            nextTab: 'btnAjustar',
        });

        this.btnAjustar = new Ext.Button({
            id: 'btnAjustar',
            text: 'Ajustar',
            disabled: true,
            tooltip: 'Modificar',
            iconCls: 'ajustar',
            prevTab: 'btnAdicionarHisVac',
            nextTab: 'btnEliminarHisVac'
        });

        this.btnBorrarAjuste = new Ext.Button({
            id: 'btnBorrarAjuste',
            text: 'Borrar Ajuste',
            disabled: true,
            tooltip: 'Borrar ajustes de la operaci&oacute;n',
            iconCls: 'borrar',
        });

        this.btnEliminarHisVac = new Ext.Button({
            id: 'btnEliminarHisVac',
            text: 'Eliminar',
            disabled: false,
            tooltip: 'Eliminar',
            iconCls: 'eliminar',
            prevTab: 'btnAjustar',
            nextTab: 'btnAdicionarHisVac',
        });

        //Elementos del formulario de historico
        this.dfFechaOperacion = new Ext.form.DateField({
            id: 'iddfFechaOperacion',
            fieldLabel: idioma.lbTitleFechaOperacion,
            tabIndex: 3, name: 'fechaoperacion',
            allowBlank: false, format: 'd/m/Y',
            editable: true, readOnly: false,
            value: new Date().format('d/m/Y'),
            maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            prevTab: 'tfTipoOperacion',
            anchor: '95%'
            //endDateField: 'iddfFFinSalarioE'
        });

        this.nfTiempoAcumulado = new Ext.form.NumberField({
            id: 'nfTiempoAcumulado', fieldLabel: idioma.lbTitleTiempoAcumulado,
            tabIndex: 2,
            name: 'tiempoacumulado',
            allowBlank: false,
            anchor: '90%',
            prevTab: '',
            regexText: '',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 19,
            maxLengthText: '',
        });


        this.nfImporteAcumulado = new Ext.form.NumberField({
            id: 'nfImporteAcumulado', fieldLabel: idioma.lbTitleImporteAcumulado,
            tabIndex: 2,
            name: 'importeacumulado',
            allowBlank: false,
            anchor: '90%',
            prevTab: '',
            regexText: '',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 19,
            maxLengthText: '',
        });

        this.nfSaldoTiempo = new Ext.form.NumberField({
            id: 'nfSaldoTiempo', fieldLabel: idioma.lbTitleSaldoTiempo,
            tabIndex: 2,
            name: 'saldoentiempo',
            allowBlank: false,
            anchor: '90%',
            prevTab: '',
            regexText: '',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 19,
            maxLengthText: '',
            allowDecimals: true,
            decimalPrecision: 4
        });

        this.nfSaldoImporte = new Ext.form.NumberField({
            id: 'nfSaldoImporte', fieldLabel: idioma.lbTitleSaldoImporte,
            tabIndex: 2,
            name: 'saldoenimporte',
            allowBlank: false,
            anchor: '90%',
            prevTab: '',
            regexText: '',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 19,
            maxLengthText: '',
            allowDecimals: true,
            decimalPrecision: 4
        });

        this.nfPromedioImporte = new Ext.form.NumberField({
            id: 'nfPromedioImporte', fieldLabel: idioma.lbTitlePromedioImporte,
            tabIndex: 2,
            name: 'promedioimporte',
            allowBlank: false,
            anchor: '99%',
            prevTab: '',
            regexText: '',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 19,
            maxLengthText: '',
        });

        this.tfDescripAreas = new Ext.form.TextArea({
            id: 'idtfobservaciones',
            fieldLabel: 'Observaciones',
            tabIndex: 5,
            name: 'observaciones',
            allowBlank: true,
            hiddenname: 'observaciones',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_225,
            anchor: '99%',
            prevTab: 'iddfFFinAreas',
            nextTab: 'idbtnCancelarAreas',
            blankText: idioma.lbErrorCampoVacio
        });

        this.cmboxTipoAjuste = new Ext.form.ComboBox({
            id: 'cmboxArea',
            msgTarget: 'qtip',
            enableQtip: true,
            store: modelo.storeAjustes,
            fieldLabel: 'Tipo Ajuste',
            mode: 'local',
            displayField: 'tipoajuste',
            hiddenName: 'tipoajuste',
            valueField: 'valor',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '99%',
            allowBlank: false,
            name: 'cbarea'


        });

        //Formulario de historico de vacaciones.
        this.formularioHisVac = new Ext.FormPanel({
            id: 'idformularioHisVac',
            labelAlign: 'top',
            frame: true,
            width: 350,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    //{columnWidth:.33, layout: 'form', items: [this.dfFechaOperacion]},
                    {columnWidth: .5, layout: 'form', items: [this.nfSaldoTiempo]},
                    {columnWidth: .5, layout: 'form', items: [this.nfSaldoImporte]},
                ]
            }, this.cmboxTipoAjuste, this.tfDescripAreas/*,{layout:'column',
             items:[

             {columnWidth:.5, layout: 'form', items: [this.tfDescripAreas]},
             {columnWidth:.5, layout: 'form', items: [this.nfSaldoImporte]},
             ]
             }*/
            ],
        });
        //Botones de la ventana de historico.
        this.btnCancelarHisVac = new Ext.Button({
            id: 'btnCancelarHisVac',
            iconCls: 'cancelar',
            text: idioma.lbBtnHisCancelar,
            tooltip: idioma.textToolTipHisCancelar,
            prevTab: 'nfPromedioImporte',
            nextTab: 'btnAceptarHisVac',
        });

        this.btnAceptarHisVac = new Ext.Button({
            id: 'btnAceptarHisVac',
            iconCls: 'aceptar',
            text: idioma.lbBtnHisAceptar,
            tooltip: idioma.textToolTipHisAceptar,
            prevTab: 'btnCancelarHisVac',
            nextTab: 'idnfRefNomina',
        });

        //Ventana del historico.
        this.ventanaHisVac = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioHisVac],
            buttons: [this.btnCancelarHisVac, this.btnAceptarHisVac]
        });

        //Grid de historico de altas
        this.gpHistVac = new Ext.grid.GridPanel({
            id: 'idgpHistVac',
            title: idioma.lbTitleGridHistVac,
            region: 'center',
            columns: [{
                header: 'idhisvacacionespersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idhisvacacionespersona'
            }, {
                header: 'idhisvacacionespersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idvacacionespersona'
            }, {
                header: 'idhisvacacionespersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idnomina'
            }, {
                header: 'Per&iacute;odo',
                hidden: true,
                hideable: true,
                dataIndex: 'periodo',
                renderer: obtenerPeriodo
            }, {
                header: idioma.lbColRefNomina,
                width: 75,
                sortable: true,
                dataIndex: 'numeronomina',
                renderer: centrarValor
            }, {
                header: idioma.lbColTipoOper,
                width: 75,
                sortable: true,
                dataIndex: 'tipooperacion',
                renderer: centrarTipoOperValor
            }, {
                header: idioma.lbColFechaOper,
                width: 75,
                sortable: true,
                dataIndex: 'fechaoperacion',
                renderer: centrarValor
            }, {
                header: idioma.lbColTiempoAcumDed,
                width: 75,
                sortable: true,
                dataIndex: 'tiempoacumulado',
                renderer: centrarValor
            }, {
                header: idioma.lbColImporteAcumDed,
                width: 80,
                sortable: true,
                dataIndex: 'importeacumulado',
                renderer: centrarValor
            }, {
                header: "<b style='color: green'>" + idioma.lbColSalTiempo + "</b>",
                width: 80,
                sortable: true,
                dataIndex: 'saldoentiempo',
                renderer: function (val) {
                    return "<b style='color: green'><center>" + val + "</center></b>";
                }
            }, {
                header: "<b style='color: green'>" + idioma.lbColSalImport + "</b>",
                width: 85,
                sortable: true,
                dataIndex: 'saldoenimporte',
                renderer: function (val) {
                    return "<b style='color: green'><center>" + val + "</center></b>";
                }
            }, {
                header: idioma.lbColPromedioImporte,
                width: 85,
                sortable: true,
                dataIndex: 'promedioimporte',
                renderer: centrarValor
            }, {
                header: idioma.lbColAjusteImporte,
                width: 85,
                sortable: true,
                dataIndex: 'ajusteimporte',
                renderer: centrarValor
            }, {
                header: idioma.lbColAjusteTiempo,
                width: 85,
                sortable: true,
                dataIndex: 'ajustetiempo',
                renderer: centrarValor
            }, {
                header: idioma.lbColTipoAjuste,
                width: 85,
                sortable: true,
                dataIndex: 'tipoajuste',
                renderer: tipoAjuste
            }

            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            store: modelo.storeVacHist,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            tbar: [this.btnAjustar, this.btnBorrarAjuste, '-', this.btnDatos],
            sm: this.smHistVac,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });

        this.tfTiempoAcumInc = new Ext.form.TextField({
            id: 'idtfTiempoAcumInc', fieldLabel: idioma.lbColTiempoI,
            name: 'tiempoacumuladoinicial', allowBlank: false,
            anchor: '90%',
            prevTab: 'idbtnAceptarVac',
            nextTab: 'idtfImporteAcumInc',
            blankText: idioma.lbErrorCampoVacio,
        });

        this.tfImporteAcumInc = new Ext.form.TextField({
            id: 'idtfImporteAcumInc', fieldLabel: idioma.lbColSaldoI,
            name: 'importeacumuladoinicial', allowBlank: false,
            anchor: '90%',
            blankText: idioma.lbErrorCampoVacio,
        });

        this.dfFInicioVac = new Ext.form.DateField({
            id: 'iddfFInicioVac', fieldLabel: idioma.lbColDesde,
            name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinVac'
        });

        this.dfFFinVac = new Ext.form.DateField({
            id: 'iddfFFinVac', fieldLabel: idioma.lbColHasta,
            name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioVac',
            prevTab: 'iddfFInicioVac', nextTab: 'idbtnCancelarVac'
        });

        //Formulario de submayor de vacaciones.
        this.formularioVac = new Ext.FormPanel({
            id: 'idformularioVac',
            labelAlign: 'top',
            frame: true,
            width: 475,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .33, layout: 'form', items: [this.tfTiempoAcumInc]},
                    {columnWidth: .33, layout: 'form', items: [this.tfImporteAcumInc]},
                    {columnWidth: .33, layout: 'form', items: [this.dfFInicioVac]},
                    //{columnWidth: .25, layout: 'form', items: [this.dfFFinVac]},
                ]
            }
            ],
        });

        //Botones de la ventana de adicionar vacaciones.
        this.btnCancelarVac = new Ext.Button({
            id: 'idbtnCancelarVac',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'iddfFFinVac',
            nextTab: 'idbtnAceptarVac',
        });

        this.btnAceptarVac = new Ext.Button({
            id: 'idbtnAceptarVac',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnCancelarVac',
            nextTab: 'idtfTiempoAcumInc',
        });

        //Ventana de adicionar y modificar vacaciones.
        this.ventanaVac = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioVac],
            buttons: [this.btnCancelarVac, this.btnAceptarVac],
        });

        //Campos de fórmulas.
        this.cbVarSubVac = new Ext.form.ComboBox({
            id: 'idcbVarSubVac', fieldLabel: idioma.lbColVarSubVac,
            tabIndex: 1, valueField: 'idvacacionesvariables',
            displayField: 'denominacion', hiddenName: 'idvacacionesvariables',
            allowBlank: true, mode: 'local',
            store: modelo.storeFormula, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        this.tfFormulaVar = new Ext.form.TextArea({
            id: 'idtfFormulaVar', fieldLabel: idioma.lbColFormula,
            name: 'formulavar',
            anchor: '99%',
            disabled: true
            // prevTab: 'idbtnAceptarVac',
            // nextTab: 'idtfImporteAcumInc',
        });

        //Botones de Add, Mod, Elim variables auxiliares de fórmula.
        this.btnAdicionarVariable = new Ext.Button({
            id: 'idbtnAdicionarVariable',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddVariable,
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarVariable',
            nextTab: 'idbtnModificarVariable',
        });

        this.btnModificarVariable = new Ext.Button({
            id: 'idbtnModificarVariable',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModVariable,
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarVariable',
            nextTab: 'idbtnEliminarVariable',
        });

        this.btnEliminarVariable = new Ext.Button({
            id: 'idbtnEliminarVariable',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimVariable,
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarVariable',
            nextTab: 'idbtnAdicionarVariable',
        });

        //Listado de variables auxiliares de fórmula.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smVariable = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpVariable = new Ext.grid.GridPanel({
            id: 'idgpVariable',
            title: idioma.lbTitleVariable,
            region: 'south',
            tbar: [this.btnAdicionarVariable, this.btnModificarVariable, this.btnEliminarVariable],
            columns: [{
                header: 'idvariableauxiliarformula',
                hidden: true,
                hideable: false,
                dataIndex: 'idvariableauxiliarformula'
            }, {header: idioma.lbColDenominacion, width: 100, sortable: true, dataIndex: 'denominacion'}, {
                header: '<center>' + idioma.lbColFormaEntrada + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'formaentrada',
                renderer: function (val) {
                    if (val == 1) return 'Manual';
                    else if (val == 2) return 'Reporte';
                    else return val;
                }
            }, {
                header: '<center>' + idioma.lbColDenomReporte + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'denomreporte',
                renderer: centrarValor
            }, {
                header: '<center>' + idioma.lbColDenomVarReporte + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'denomvarreporte',
                renderer: centrarValor
            }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            height: 165,
            viewConfig: {forceFit: true},
            store: modelo.storeVariable,
            sm: this.smVariable,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });

        //Campo del formulario de variables auxiliares.
        this.tfDenomVariable = new Ext.form.TextField({
            id: 'idtfDenomVariable', fieldLabel: idioma.lbColDenominacion,
            prevTab: 'idbtnAceptarVariable', nextTab: 'idcbFormaEntradaVariable',
            name: 'denominacion', allowBlank: false, anchor: '90%',
            blankText: idioma.lbErrorCampoVacio, vtype: 'vtdenominaciones'
        });

        this.cbFormaEntradaVariable = new Ext.form.ComboBox({
            id: 'idcbFormaEntradaVariable', fieldLabel: idioma.lbColFormaEntrada,
            valueField: 'idtipoentrada',
            displayField: 'denominacion', hiddenName: 'idtipoentrada',
            allowBlank: false, mode: 'local',
            store: modelo.storeFormaEntradaVariable, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        this.cbTipoReporteVariable = new Ext.form.ComboBox({
            id: 'idcbTipoReporteVariable', fieldLabel: idioma.lbColDenomReporte,
            valueField: 'idconfreportescertificaciones',
            displayField: 'denominacion', hiddenName: 'idconfreportescertificaciones',
            allowBlank: false, mode: 'local',
            store: modelo.storeTipoReporteVariable, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });
        this.cbVarReporteVariable = new Ext.form.ComboBox({
            id: 'idcbVarReporteVariable', fieldLabel: idioma.lbColDenomVarReporte,
            valueField: 'idvariablesconfreportescertificaciones',
            prevTab: 'idcbTipoReporteVariable', nextTab: 'idbtnCancelarVariable',
            displayField: 'denominacion', hiddenName: 'idvariablesconfreportescertificaciones',
            allowBlank: false, mode: 'local',
            store: modelo.storeVarReporteVariable, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '99%'
        });

        //Formulario de variables auxiliares.
        this.formularioVariable = new Ext.FormPanel({
            id: 'idformularioVariable',
            labelAlign: 'top',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .6, layout: 'form', items: [this.tfDenomVariable]},
                    {columnWidth: .4, layout: 'form', items: [this.cbFormaEntradaVariable]}

                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .6, layout: 'form', items: [this.cbTipoReporteVariable]},
                    {columnWidth: .4, layout: 'form', items: [this.cbVarReporteVariable]}
                ]
            }],
        });

        //Botones de la ventana de adicionar/modificar variables auxiliares.
        this.btnCancelarVariable = new Ext.Button({
            id: 'idbtnCancelarVariable',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idcbVarReporteVariable',
            nextTab: 'idbtnAplicarVariable',
        });

        this.btnAplicarVariable = new Ext.Button({
            id: 'idbtnAplicarVariable',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarVariable',
            nextTab: 'idbtnAceptarVariable',
        });

        this.btnAceptarVariable = new Ext.Button({
            id: 'idbtnAceptarVariable',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarVariable',
            nextTab: 'idtfDenomVariable',
        });

        //Ventana de adicionar y modificar variables globales.
        this.ventanaVariable = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioVariable],
            buttons: [this.btnCancelarVariable, this.btnAplicarVariable, this.btnAceptarVariable]
        });

        //Formulario de formulas.
        this.formularioForm = new Ext.FormPanel({
            id: 'idformularioForm',
            region: 'center',
            labelAlign: 'top',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .99, layout: 'form', items: [this.cbVarSubVac]},
                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .99, layout: 'form', items: [this.tfFormulaVar]},
                ]
            }
            ],
        });

        //Boton de cerrar ventana.
        this.btnCerrar = new Ext.Button({
            id: 'idbtnCerrar',
            iconCls: 'cerrar',
            text: idioma.lbBtnCerrar,
            tooltip: idioma.textToolTipCerrar
        });

        //Ventana de configurar formulas.
        this.ventanaForm = new Ext.Window({
            title: idioma.lbTitleVentFormVac,
            modal: true,
            closeAction: 'hide',
            // autoHeight: true,
            width: 450,
            constrain: true,
            height: 400,
            closable: true,
            resizable: false,
            layout: 'border',
            items: [this.formularioForm, this.gpVariable],
            buttons: [this.btnCerrar]
        });
        this.panelPersonasAltas = new Ext.Panel({
            id: 'panelPersonasAltas',
            title: 'Listado personas altas',
            region: 'center',
            height: '100%',
            width: '50%',
            split: true,
            border: true,
            layout: 'border',
            items: [
                /* {
                    region: 'east',
                    height: '100%',
                    width: '30%',
                    layout: 'fit',
                    split: true,
                    items: [this.panelestructuraPersonas]
				 },*/
                {
                    region: 'center',
                    height: '100%',
                    width: '50%',
                    layout: 'ux.row',
                    split: true,
                    items: [
                        {
                            rowHeight: .33,
                            width: '100%',
                            border: false,
                            split: true,
                            layout: 'fit',
                            items: [this.pfichadelapersona]
                        },
                        {
                            rowHeight: .67,
                            width: '100%',
                            border: false,
                            split: true,
                            layout: 'fit',
                            items: [this.gpPersonasDerecho]
                        },
                    ]
                }, {
                    region: 'east',
                    height: '100%',
                    width: '50%',
                    layout: 'ux.row',
                    split: true,
                    items: [
                        {
                            rowHeight: .25,
                            width: '100%',
                            border: false,
                            layout: 'fit',
                            tbar: [this.btnAdicionarVac, this.btnModificarVac, this.btnEliminarVac, ' ', this.btnNotificarVac, ' ', this.btnMenuCuadrar, this.btnCuadrarSub, '->', this.btnCargaInicial, /*this.btnFormula,*/ this.btnAyuda],
                            items: [this.gpVac]
                        }, {
                            rowHeight: .75,
                            width: '100%',
                            border: false,
                            layout: 'fit',
                            items: [this.gpHistVac]
                        }
                    ]
                }
            ]
        });

        //Personas bajas******************************************************************************
        this.pfichadelapersonaBajas = new Ext.pvd.persona.fichapersona.panelFichapersona({
            id: 'pfichadelapersonabajas',
            region: 'north',
            idficha: 'pfichadelapersbajas',
            width: '100%',
            height: '30%',
            border: true,
            split: true,
            idCmp: 'pfichadelapersonabajas'
        });
        this.btnBuscarBajas = new Ext.Button({
            //disabled: true,
            id: 'btnBuscarBajas',
            //icon :'buscar',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar persona(s) bajas',

        });
        this.tfbuscarBajas = new Ext.form.TextField({
            id: 'tfbuscarbajas',
            allowBlank: true,
            minLength: 3,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar...',
            name: 'tfbuscadorbajas'

        });
        this.btnLimpiarBajas = new Ext.Button({
            disabled: false,
            id: 'btnLimpiar',
            //icon :'buscar',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtros',

        });
        this.smPersonasDerechoBajas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.gpPersonasDerechoBajas = new Ext.grid.GridPanel({
            id: 'gpPersonasDerechoBajas',
            title: 'Listado de personas bajas',
            region: 'center',
            columns: [this.smPersonasDerechoBajas, new Ext.grid.RowNumberer(), {
                header: 'idpersona',
                sortable: true,
                dataIndex: 'idpersona',
                hidden: true
            }, {
                header: 'Cod. contable',
                width: 80,
                sortable: true,
                dataIndex: 'cdgocontable',
                renderer: formatearColoresBajas
            }, {
                header: 'No. identidad',
                width: 80,
                sortable: true,
                dataIndex: 'noidentidad',
                renderer: formatearColoresBajas
            }, {
                header: 'Nombre y apellidos',
                sortable: true,
                width: 200,
                dataIndex: 'nombreapellidos',
                renderer: formatearColoresBajas
            }, {header: 'Cargo', width: 300, sortable: true, dataIndex: 'cargo', renderer: formatearColoresBajas}
                //, {header: 'Plantilla nominal', width: 80, sortable: true, hidden: true, dataIndex: 'plantillanominal'}
                , {
                    header: 'Plantilla nominal',
                    width: 80,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'plantillanominal',
                    renderer: fnSeleccionarPlantilla
                }, {
                    header: 'saldoentiempo',
                    width: 80,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'saldoentiempo'
                }, {header: 'ordencargo', width: 80, sortable: true, hidden: true, dataIndex: 'ordencargo'}
            ],
            tbar: ['Buscar persona:', this.tfbuscarBajas, this.btnBuscarBajas, this.btnLimpiarBajas],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.storePersonasDerechoSubmayorBajas,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
            }),
            store: modelo.storePersonasDerechoSubmayorBajas,
            sm: this.smPersonasDerechoBajas,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        function formatearColoresBajas(val, metaData, record, rowIndex, colIndex, store) {
            return '<span style="color:red;">' + val + '</span>';
            ;
        }

        this.btnModificarVacBajas = new Ext.Button({
            id: 'idbtnModificarVacBajas',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModVac,
            iconCls: 'modificar',
            disabled: true
        });
        this.smVacBajas = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });
        this.gpVacBajas = new Ext.grid.GridPanel({
            id: 'idgpVacBajas',
            title: idioma.lbTitleGridVac,
            region: 'center',
            columns: [{
                header: 'idvacacionespersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idvacacionespersona'
            }, {
                header: idioma.lbColTiempoInicial,
                sortable: true,
                dataIndex: 'tiempoacumuladoinicial',
                renderer: centrarValor
            }, {
                header: idioma.lbColSaldoInicial,
                width: 80,
                sortable: true,
                dataIndex: 'importeacumuladoinicial',
                renderer: centrarValor
            }, {
                header: "<b style='color: green'>" + idioma.lbColTiempo + "</b>",
                width: 80,
                sortable: true,
                dataIndex: 'tiempoacumulado',
                renderer: function (val) {
                    return "<b style='color: green'><center>" + val + "</center></b>";
                }
            }, {
                header: "<b style='color: green'>" + idioma.lbColSaldo + "</b>",
                width: 90,
                sortable: true,
                dataIndex: 'importeacumulado',
                renderer: function (val) {
                    return "<b style='color: green'><center>" + val + "</center></b>";
                }
            }, {
                header: idioma.lbColDesde,
                fixed: true,
                width: 85,
                sortable: true,
                dataIndex: 'fechainicio',
                renderer: centrarValor
            }, {
                header: idioma.lbColHasta,
                fixed: true,
                width: 85,
                sortable: true,
                dataIndex: 'fechafin',
                renderer: centrarValor
            }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            //plugins: this.expanderConcepto,
            viewConfig: {forceFit: true},
            store: modelo.storeVacBajas,
            sm: this.smVacBajas,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });
        this.btnAjustarBajas = new Ext.Button({
            id: 'btnAjustarBajas',
            text: 'Ajustar',
            disabled: true,
            tooltip: 'Modificar',
            iconCls: 'ajustar',
            prevTab: 'btnAdicionarHisVac',
            nextTab: 'btnEliminarHisVac'
        });
        this.btnBorrarAjusteBajas = new Ext.Button({
            id: 'btnBorrarAjusteBajas ',
            text: 'Borrar Ajuste',
            disabled: true,
            tooltip: 'Borrar ajustes de la operaci&oacute;n',
            iconCls: 'borrar',
        });

        //Componente informativo del pago y la persona baja
        this.btnDatosBajas = new Ext.Button({
            id: 'btnDatosBajas',
            text: 'Mostrar datos',
            iconCls: 'aceptar'
        });
        this.datosgeneralesubbajas = new Pvd.Nomina.Pago.Datossubmayor({
            modal: true,
        });
        this.smHistVacBajas = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });
        this.gpHistVacBajas = new Ext.grid.GridPanel({
            id: 'gpHistVacBajas',
            title: idioma.lbTitleGridHistVac,
            region: 'center',
            columns: [{
                header: 'idhisvacacionespersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idhisvacacionespersona'
            }, {
                header: 'idhisvacacionespersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idvacacionespersona'
            }, {
                header: 'idhisvacacionespersona',
                hidden: true,
                hideable: false,
                dataIndex: 'idnomina'
            }, {
                header: 'Per&iacute;odo',
                hidden: true,
                hideable: true,
                dataIndex: 'periodo',
                renderer: obtenerPeriodo
            }, {
                header: idioma.lbColRefNomina,
                width: 75,
                sortable: true,
                dataIndex: 'numeronomina',
                renderer: centrarValor
            }, {
                header: idioma.lbColTipoOper,
                width: 75,
                sortable: true,
                dataIndex: 'tipooperacion',
                renderer: centrarTipoOperValor
            }, {
                header: idioma.lbColFechaOper,
                width: 75,
                sortable: true,
                dataIndex: 'fechaoperacion',
                renderer: centrarValor
            }, {
                header: idioma.lbColTiempoAcumDed,
                width: 75,
                sortable: true,
                dataIndex: 'tiempoacumulado',
                renderer: centrarValor
            }, {
                header: idioma.lbColImporteAcumDed,
                width: 80,
                sortable: true,
                dataIndex: 'importeacumulado',
                renderer: centrarValor
            }, {
                header: "<b style='color: green'>" + idioma.lbColSalTiempo + "</b>",
                width: 80,
                sortable: true,
                dataIndex: 'saldoentiempo',
                renderer: function (val) {
                    return "<b style='color: green'><center>" + val + "</center></b>";
                }
            }, {
                header: "<b style='color: green'>" + idioma.lbColSalImport + "</b>",
                width: 85,
                sortable: true,
                dataIndex: 'saldoenimporte',
                renderer: function (val) {
                    return "<b style='color: green'><center>" + val + "</center></b>";
                }
            }, {
                header: idioma.lbColPromedioImporte,
                width: 85,
                sortable: true,
                dataIndex: 'promedioimporte',
                renderer: centrarValor
            }, {
                header: idioma.lbColAjusteImporte,
                width: 85,
                sortable: true,
                dataIndex: 'ajusteimporte',
                renderer: centrarValor
            }, {
                header: idioma.lbColAjusteTiempo,
                width: 85,
                sortable: true,
                dataIndex: 'ajustetiempo',
                renderer: centrarValor
            }, {
                header: idioma.lbColTipoAjuste,
                width: 85,
                sortable: true,
                dataIndex: 'tipoajuste',
                renderer: tipoAjuste
            }

            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            store: modelo.storeVacHistBajas,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            tbar: [this.btnAjustarBajas, this.btnBorrarAjusteBajas, '-', this.btnDatosBajas],
            sm: this.smHistVacBajas,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });
        //ventana carga inicial bajas
        this.tfTiempoAcumIncBajas = new Ext.form.TextField({
            id: 'idtfTiempoAcumIncBajas',
            fieldLabel: idioma.lbColTiempoI,
            name: 'tiempoacumuladoinicial',
            allowBlank: false,
            anchor: '90%',
            blankText: idioma.lbErrorCampoVacio
        });
        this.tfImporteAcumIncBajas = new Ext.form.TextField({
            id: 'idtfImporteAcumIncBajas',
            fieldLabel: idioma.lbColSaldoI,
            name: 'importeacumuladoinicial',
            allowBlank: false,
            anchor: '90%',
            blankText: idioma.lbErrorCampoVacio,
        });
        this.dfFInicioVacBajas = new Ext.form.DateField({
            id: 'iddfFInicioVacBajas',
            fieldLabel: idioma.lbColDesde,
            name: 'fechainicio',
            allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinVacBajas',
            disabled: true
        });
        this.dfFFinVacBajas = new Ext.form.DateField({
            id: 'iddfFFinVacBajas', fieldLabel: idioma.lbColHasta,
            name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioVacBajas',
            disabled: true
        });
        this.formularioVacBajas = new Ext.FormPanel({
            id: 'idformularioVacBajas',
            labelAlign: 'top',
            frame: true,
            width: 480,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .25, layout: 'form', items: [this.tfTiempoAcumIncBajas]},
                    {columnWidth: .25, layout: 'form', items: [this.tfImporteAcumIncBajas]},
                    {columnWidth: .25, layout: 'form', items: [this.dfFInicioVacBajas]},
                    {columnWidth: .25, layout: 'form', items: [this.dfFFinVacBajas]},
                ]
            }
            ],
        });
        this.btnCancelarVacBajas = new Ext.Button({
            id: 'idbtnCancelarVacBajas',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'iddfFFinVac',
            nextTab: 'idbtnAceptarVac',
        });
        this.btnAceptarVacBajas = new Ext.Button({
            id: 'idbtnAceptarVacBajas',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnCancelarVac',
            nextTab: 'idtfTiempoAcumInc',
        });
        this.ventanaVacBajas = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioVacBajas],
            buttons: [this.btnCancelarVacBajas, this.btnAceptarVacBajas],
        });
        //ventana ajustes bajas
        this.nfSaldoTiempoBajas = new Ext.form.NumberField({
            id: 'nfSaldoTiempoBajas', fieldLabel: idioma.lbTitleSaldoTiempo,
            tabIndex: 2,
            name: 'saldoentiempo',
            allowBlank: false,
            anchor: '90%',
            prevTab: '',
            regexText: '',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 19,
            maxLengthText: '',
            allowDecimals: true,
            decimalPrecision: 4
        });
        this.nfSaldoImporteBajas = new Ext.form.NumberField({
            id: 'nfSaldoImporteBajas', fieldLabel: idioma.lbTitleSaldoImporte,
            tabIndex: 2,
            name: 'saldoenimporte',
            allowBlank: false,
            anchor: '90%',
            prevTab: '',
            regexText: '',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 19,
            maxLengthText: '',
            allowDecimals: true,
            decimalPrecision: 4
        });
        this.tfDescripAjusteBajas = new Ext.form.TextArea({
            id: 'tfDescripAjusteBajas',
            fieldLabel: 'Observaciones',
            tabIndex: 5,
            name: 'observaciones',
            allowBlank: true,
            hiddenname: 'observaciones',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_225,
            anchor: '99%',
            blankText: idioma.lbErrorCampoVacio
        });
        this.cmboxTipoAjusteBajas = new Ext.form.ComboBox({
            id: 'cmboxAreaBajas',
            msgTarget: 'qtip',
            enableQtip: true,
            store: modelo.storeAjustes,
            fieldLabel: 'Tipo Ajuste',
            mode: 'local',
            displayField: 'tipoajuste',
            hiddenName: 'tipoajuste',
            valueField: 'valor',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '99%',
            allowBlank: false,
            name: 'cbarea'
        });
        this.formularioHisVacBajas = new Ext.FormPanel({
            id: 'idformularioHisVacBajas',
            labelAlign: 'top',
            frame: true,
            width: 350,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.nfSaldoTiempoBajas]},
                    {columnWidth: .5, layout: 'form', items: [this.nfSaldoImporteBajas]},
                ]
            }, this.cmboxTipoAjusteBajas, this.tfDescripAjusteBajas
            ],
        });
        this.btnCancelarHisVacBajas = new Ext.Button({
            id: 'btnCancelarHisVacBajas',
            iconCls: 'cancelar',
            text: idioma.lbBtnHisCancelar,
            tooltip: idioma.textToolTipHisCancelar,
            prevTab: 'nfPromedioImporte',
            nextTab: 'btnAceptarHisVac',
        });
        this.btnAceptarHisVacBajas = new Ext.Button({
            id: 'btnAceptarHisVacBajas',
            iconCls: 'aceptar',
            text: idioma.lbBtnHisAceptar,
            tooltip: idioma.textToolTipHisAceptar,
            prevTab: 'btnCancelarHisVac',
            nextTab: 'idnfRefNomina',
        });
        this.ventanaHisVacBajas = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioHisVacBajas],
            buttons: [this.btnCancelarHisVacBajas, this.btnAceptarHisVacBajas]
        });

        //panel baja
        this.panelPersonasBajas = new Ext.Panel({
            id: 'panelPersonasBajas',
            title: 'Listado personas bajas',
            region: 'center',
            height: '100%',
            width: '50%',
            split: true,
            border: true,
            layout: 'border',
            items: [
                {
                    region: 'center',
                    height: '100%',
                    width: '45%',
                    layout: 'ux.row',
                    split: true,
                    items: [
                        {
                            rowHeight: .33,
                            width: '100%',
                            border: false,
                            split: true,
                            layout: 'fit',
                            items: [this.pfichadelapersonaBajas]
                        },
                        {
                            rowHeight: .67,
                            width: '100%',
                            border: false,
                            split: true,
                            layout: 'fit',
                            items: [this.gpPersonasDerechoBajas]
                        },
                    ]
                }, {
                    region: 'east',
                    height: '100%',
                    width: '45%',
                    layout: 'ux.row',
                    split: true,
                    items: [
                        {
                            rowHeight: .25,
                            width: '100%',
                            border: false,
                            layout: 'fit',
                            tbar: [/*this.btnModificarVacBajas, */this.btnMenuCuadrarBajas],
                            items: [this.gpVacBajas]
                        }, {
                            rowHeight: .75,
                            width: '100%',
                            border: false,
                            layout: 'fit',
                            items: [this.gpHistVacBajas]
                        }
                    ]
                }
            ]
        });

        //Ventana para gestionar las vacaciones de las personas altas y bajas por entidades.
        this.winGestVacaciones = new Ext.Window({
            title: idioma.lbTitleWinGestVacaciones,
            modal: true,
            height: '100%',
            width: '100%',
            closeAction: 'hide',
            constrain: true,
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'border',
            items: [this.panelestructuraPersonas,
                new Ext.TabPanel({
                    id: 'tabpersonassubmayor',
                    border: false,
                    activeTab: 0,
                    region: 'center',
                    items: [
                        this.panelPersonasAltas,//Tab 1
                        this.panelPersonasBajas//Tab 2
                    ],
                    listeners: {
                        tabchange: function (a) {
                            /*var idtab = a.getActiveTab().id;
                            if (idtab == 'g1') {
                                self.btnRestaurar.show();
                            } else {
                                self.btnRestaurar.hide();
                            }*/
                        }
                    }
                })
            ]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestsubmayorvacaciones', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Submayor.Vacaciones.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Submayor.Vacaciones.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Submayor.Vacaciones.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.frameElement.id, function (res) {      
        for (i in acciones_reportes) {
            if (acciones_reportes[i].abreviatura == 'btnRecalcularSub') {
                compartimentarrecalcular = true;
            }
        }
    });
});
