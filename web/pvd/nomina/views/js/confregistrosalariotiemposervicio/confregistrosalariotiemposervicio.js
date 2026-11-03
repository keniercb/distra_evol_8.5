/*
 * Class Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio
 * Modulo Configuracion
 * @author Tte. Ing. Frank Rodriguez Berroa
 */
Ext.ns('Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio');
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
//Modelo
Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function (idioma) {
        this.datosModelo = null;

        this.stTiposNominas = new Ext.data.Store({
            url: 'obtenertiposnomina',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idtiponomina"},
                [{name: 'idtiponomina'}, {name: 'denominaciontiponomina'}
                ])
        });

        this.stSNC = new Ext.data.Store({
            url: 'obtenerconfregistrosalario',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idregistsalartiempservc"},
                [
                    {name: 'idregistsalartiempservc'},
                    {name: 'idtiponomina'},
                    {name: 'expresionmatemdias'},
                    {name: 'textoexpresionmatemdias'},
                    {name: 'expresionmatemimport'},
                    {name: 'textoexpresionmatemimporte'},
                    {name: 'expresionmatemimportdevengado'},
                    {name: 'textoexpresionmatemimportedev'},
                    {name: 'denominacion'}
                ])
        });

        this.stCalendario = new Ext.data.Store({
            url: 'obtenercalendario',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idcalendario"},
                [{name: 'idcalendario'},
                    {name: 'idmes'},
                    {name: 'mes'},
                    {name: 'cantdias'},
                    {name: 'anno'}
                ])
        });

        this.stVariablesAuxiliares = new Ext.data.GroupingStore({
            groupField: 'denomconfreporte',
            url: 'obtenervariablesauxiliares',
            sortInfo: {field: 'idconfreportescertificaciones', direction: "DESC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idvblesgblesregsaltmpserv"},
                [
                    {name: 'idvblesgblesregsaltmpserv'},
                    {name: 'idregistsalartiempservc'},
                    {name: 'idvariablesconfreportescertificaciones'},
                    {name: 'denomvariable'},
                    {name: 'idconfreportescertificaciones'},
                    {name: 'denomconfreporte'},
                    {name: 'anotaciones'}
                ])
        });

        this.stAnnos = new Ext.data.SimpleStore({
            fields: [{name: 'idannos'}, {name: 'denominacion'}
            ],
            data: [
                [1, '2015'],
                [2, '2016'],
                [3, '2017'],
                [4, '2018'],
                [5, '2019'],
                [6, '2020'],
                [7, '2021'],
                [8, '2022'],
                [9, '2023'],
                [10, '2024'],
                [11, '2025'],
                [12, '2026'],
                [13, '2027'],
                [14, '2028'],
                [15, '2029'],
                [16, '2030'],
                [17, '2031'],
                [18, '2032'],
                [19, '2033'],
                [20, '2034'],
                [21, '2035'],
                [22, '2036'],
                [23, '2037'],
                [24, '2038']
            ]
        });

        this.ConvertiraArreglo = function (arrObj) {
            var arr = new Array();
            for (var i = 0; i < arrObj.length; i++) {
                var a = new Array();
                a[0] = arrObj[i].idindicador;
                a[1] = arrObj[i].indicador;
                a[2] = arrObj[i].tipo;
                arr[i] = a;
            }
            return arr;
        }
    }
};

//Vista del componente.
Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio.Vista = {
    /**
     * Inicializar la vista.
     *
     * Class Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio
     * Modulo Configuracion
     * @author Tte. Ing. Frank Rodriguez Berroa
     */
    init: function (perfil, idioma, modelo) {
        var self = this;

        this.idtiponomina = 0;
        this.indice = 0;
        this.idexpresionmatematicadias = -1;
        this.idexpresionmatematicasalario = -1;
        this.idexpresionmatematicasalariodevengado = -1;

        //Gridpanel con el listado de las nominas
        this.smTiposNomina = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.aplicarColorVerde = function (val) {
            return '<span style="color:#006400;">' + val + '</span>';
        };

        this.aplicarColor = function (val, metaData, record, rowIndex, colIndex, store) {
            if ((record.get('expresionmatemdias') == null) && (record.get('expresionmatemimport') == null)) {
                return '<span style="color:#700000;">' + val + '</span>'
            } else {
                return '<span style="color:#0000ff;">' + val + '</span>'
            }
            ;
        };


        this.gpTipoNominas = new Ext.grid.GridPanel({
            id: 'gpTipoNominas',
            region: 'center',
            layout: 'fit',
            border: false,
            columns: [{
                header: 'Denominaci&oacute;n',
                hideable: false,
                dataIndex: 'denominaciontiponomina',
                renderer: this.aplicarColorVerde
            }
            ],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.stTiposNominas,
            sm: this.smTiposNomina,
            loadMask: {msg: 'Cargando'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stTiposNominas,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        //Botones y formulario y ventana de add  de las variables del snc
        this.botonAdicionarVariablesSCN = new Ext.Button({
            id: 'botunAdicionarVariablesSCN',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar variable SNC-225 (<b>Alt+I</b>)',
            iconCls: 'adicionar',
            //disabled: true,
        });

        this.botonModificarVariablesSCN = new Ext.Button({
            id: 'botonModificarVariablesSCN',
            text: "<u>M</u>odificar",
            tooltip: 'Modificar variable SNC-225 (<b>Alt+M</b>)',
            iconCls: 'modificar',
            disabled: true,
        });

        this.botonEliminarVariablesSCN = new Ext.Button({
            id: 'botunAdicionarVariablesSCN',
            text: 'Eliminar',
            tooltip: 'Eliminar variable SNC-225 (<b>DEL</b>)',
            iconCls: 'eliminar',
            disabled: true
        });

        this.tfVariableSNC = new Ext.form.TextField({
            id: 'tfVariableSNC',
            fieldLabel: 'Denominaci&oacute;n',
            //regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            anchor: '99%',
            name: 'denominacion',
            blankText: 'Este campo es obligatorio',
            allowBlank: false,
           // maxLength:2
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',
            // icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',

        });

        this.formularioVariablesSNC = new Ext.FormPanel({
            id: 'formularioVariablesSNC',
            labelAlign: 'top',
            frame: true,
            width: '100%',
            heigth: '100%',
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [this.tfVariableSNC]
        });

        this.botonAceptarVariablesSCN = new Ext.Button({
            id: 'botonAceptarVariablesSCN',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
            iconCls: 'aceptar'
        });

        this.botonCancelarVariablesSCN = new Ext.Button({
            id: 'botonCancelarVariablesSCN',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar datos',
            iconCls: 'cancelar'
        });
        this.botonAplicarVariablesSCN = new Ext.Button({
            id: 'botonAplicarVariablesSCN',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar campos',
            iconCls: 'aplicar'
        });

        this.winVarablesSNC = new Ext.Window({
            id: 'winVarablesSNC',
            title: 'Adicionar variable del snc - 225',
            width: 300,
            heigth: 200,
            closeAction: 'hide',
            constrain: true,
            colapsable: true,
            resizable: true,
            modal: true,
            buttons: [this.botonCancelarVariablesSCN, this.botonAplicarVariablesSCN, this.botonAceptarVariablesSCN],
            items: [this.formularioVariablesSNC]
        });

        //Gridpanel con el listado de las variables del snc
        this.smVariablesSNC = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpSNC = new Ext.grid.GridPanel({
            id: 'gpSNC',
            region: 'center',
            layout: 'fit',
            border: false,
            columns: [{
                header: 'idregistsalartiempservc',
                hideable: true,
                hidden: true,
                dataIndex: 'idregistsalartiempservc',
            }, {
                header: 'idtiponomina',
                hideable: true,
                hidden: true,
                dataIndex: 'idtiponomina',
            }, {
                header: 'Denominaci&oacute;n',
                hideable: true,
                dataIndex: 'denominacion',
                renderer: this.aplicarColor
            }
            ],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.stSNC,
            sm: this.smVariablesSNC,
            loadMask: {msg: 'Cargando'},
            tbar: [this.botonAdicionarVariablesSCN, this.botonModificarVariablesSCN, this.botonEliminarVariablesSCN, '->', this.btnAyuda],
            keys:
                [
                    {
                        key: 'i',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.botonAdicionarVariablesSCN.handler();
                        }
                    },
                    {
                        key: 46,
                        stopEvent: true,
                        fn: function () {
                            if (!self.botonEliminarVariablesSCN.disabled) {
                                self.botonEliminarVariablesSCN.handler();
                            }
                        }
                    }
                ]
        });

        //Gridpanel con el listado de las variables auxiliares de los reportes
        this.botonAdicionarVariablesAuxiliares = new Ext.Button({
            id: 'botonAdicionarVariablesGlobal',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Adicionar variable auxiliar (<b>Alt+I</b>)',
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar'
        });

        this.botonEliminarVariablesAuxiliares = new Ext.Button({
            id: 'botonEliminarVariablesGlobal',
            text: 'Eliminar',
            tooltip: 'Eliminar variable auxiliar (<b>DEL</b>)',
//            icon: perfil.dirImg + 'eliminar.png',
            disabled: true,
            iconCls: 'eliminar'
        });

        this.smVariablesGlobales = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpVariablesAuxiliares = new Ext.grid.GridPanel({
            id: 'gpVariablesAuxiliares',
            region: 'center',
            layout: 'fit',
            border: false,
            columns: [{header: 'Denominaci&oacute;n', hideable: false, dataIndex: 'denomvariable'},
                {header: 'Tipo de reporte', hideable: false, dataIndex: 'denomconfreporte'},
                {header: 'Anotaciones', hideable: false, dataIndex: 'anotaciones'}
            ],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.stVariablesAuxiliares,
            sm: this.smVariablesGlobales,
            loadMask: {msg: 'Cargando'},
            tbar: [this.botonAdicionarVariablesAuxiliares, this.botonEliminarVariablesAuxiliares],
            Keys:
                [
                    {
                        key: 'i',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.botonAdicionarVariablesAuxiliares.handler();
                        }
                    },
                    {
                        key: 46,
                        stopEvent: true,
                        fn: function () {
                            if (!self.botonEliminarVariablesAuxiliares.disabled) {
                                self.botonEliminarVariablesAuxiliares.handler();
                            }
                        }
                    }
                ]
        });

        //Gridpanel con el calendario
        this.cbAnnos = new Ext.form.ComboBox({
            id: 'cbAnnos',
            msgTarget: 'qtip',
            enableQtip: true,
            store: modelo.stAnnos,
            mode: 'local',
            displayField: 'denominacion',
            hiddenName: 'idannos',
            valueField: 'idannos',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '99%',
            allowBlank: true
        });

        this.botonGuardar = new Ext.Button({
            id: 'botonGuardar',
            text: 'Guardar',
            tooltip: 'Guardar',
//            icon: perfil.dirImg + 'guardar.png',
            disabled: true,
            iconCls: 'guardar'
        });

        this.numberDiasHabiles = new Ext.form.NumberField({
            id: 'numberDiasHabiles',
            name: 'cantdias'
        });

        this.smConfigurarCalendario = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.CentrarColumna = function (val) {
            return '<center>' + val + '</center>';
        };

        this.gpConfigurarCalendario = new Ext.grid.EditorGridPanel({
            id: 'gpConfigurarCalendario',
            region: 'center',
            layout: 'fit',
            border: false,
            columns: [{
                header: '<center>Mes</center>',
                hideable: false,
                width: 200,
                dataIndex: 'mes',
                renderer: this.CentrarColumna
            },
                {
                    header: '<center>Cantidad d&iacute;as h&aacute;biles</center>',
                    width: 100,
                    hideable: false,
                    dataIndex: 'cantdias',
                    editor: this.numberDiasHabiles,
                    renderer: this.CentrarColumna
                }
            ],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.stCalendario,
            sm: this.smConfigurarCalendario,
            loadMask: {msg: 'Cargando'},
            tbar: [this.botonGuardar, '->', 'Años:',this.cbAnnos]
        });

        //Formulario con las formulas
        this.taDiasTrabajados = new Ext.form.TextArea({
            id: 'taDiasTrabajados',
            fieldLabel: 'D&iacute;as trabajados',
            name: 'diastrabajados',
            allowBlank: true,
            //hiddenname:'descripcion',
            anchor: '99%',
            readOnly: true
        });


        this.taSalarioDevengado = new Ext.form.TextArea({
            id: 'taSalarioDevengado',
            fieldLabel: 'Salario devengado SNC-225',
            name: 'salariodevengado',
            allowBlank: true,
            //hiddenname:'descripcion',
            anchor: '99%',
            readOnly: true
        });

        this.taSalarioDevengadoCalculoReporte = new Ext.form.TextArea({
            id: 'taSalarioDevengadoCalcReporte',
            fieldLabel: 'Salario devengado',
            name: 'salariodevengadocalcreporte',
            allowBlank: true,
            anchor: '100%',
            readOnly: true
        });

        this.formularioFormulas = new Ext.FormPanel({
            id: 'formularioFormulas',
            labelAlign: 'top',
            frame: true,
            width: '100%',
            heigth: '100%',
            layout: 'fit',
            region: 'center',
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [{
                xtype: 'fieldset',
                title: 'F&oacute;rmulas',
                autoHeight: true,
                region: 'center',
                items: [{
                    layout: 'column',
                    items: [
                        {columnWidth: .3, layout: 'form', items: [this.taDiasTrabajados]},
                        {columnWidth: .4, layout: 'form', items: [this.taSalarioDevengado]}/*,
                        {columnWidth: .3, layout: 'form', items: [this.taSalarioDevengadoCalculoReporte]}*/
                    ]
                }]
            }]
        });

        //Ventana con las variables auxiliares
        this.pTiposReportesCertificaciones = new Pvd.Nomina.TiposReportesyCertificaciones.BuscarTipoReportesyCertificaciones({
            height: 300,
            width: '100%',
            region: 'center',
            layout: 'fit',
            cantidadPorPagina: 1000,
            border: true,
            mostrarVariables: true
        });
        this.tfDenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            allowBlank: false,
            vtype: 'vtdenominaciones',
            anchor: '99%',
            blankText: 'Este campo es obligatorio.'
        });

        this.taVariablesAuxiliaresAnotaciones = new Ext.form.TextArea({
            id: 'taVariablesAuxiliaresAnotaciones',
            region: 'south',
            layout: 'fit',
            fieldLabel: 'Anotaciones',
            emptyText: 'Anotaciones...',
            name: 'anotaciones',
            allowBlank: true,
            anchor: '99%'
        });

        this.fpVariablesAuxiliares = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            region: 'center',
            layout: 'border',
            height: 400,
            width: 600,
            items: [this.pTiposReportesCertificaciones]
        });
        this.btnAceptarAAux = new Ext.Button({
            id: 'btnAceptarAAux',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });
        this.btnAplicarAAux = new Ext.Button({
            id: 'btnAplicarAAux',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar campos',
            iconCls: 'aplicar'
        });
        this.btnCancelarAAux = new Ext.Button({
            id: 'btnCancelarAAux',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los cambios',
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar'
        });
        this.winVariablesAuxiliares = new Ext.Window({
            title: 'Adicionar variable auxiliar',
            modal: true,
            height: 400,
            width: 500,
            constrain: true,
            closeAction: 'hide',
            closable: true,
            resizable: false,
            layout: 'border',
            items: [this.fpVariablesAuxiliares, this.taVariablesAuxiliaresAnotaciones],
            buttons: [this.btnCancelarAAux, this.btnAplicarAAux, this.btnAceptarAAux]
        });

        //Panel de abajo-------------
        //Paneles de la interfaz
        this.panelEast = new Ext.Panel({
            id: 'panelEast',
            title: idioma.lbtitlePanelEast,
            height: '100%',
            width: '100%',
            region: 'south',
            split: true,
            collapsible: true,
            layout: 'fit',
            items: [this.gpVariablesAuxiliares]
        });

        this.panelWest = new Ext.Panel({
            id: 'panelwest',
            title: idioma.lbtitlePanelWest,
            height: '100%',
            width: '30%',
            region: 'west',
            split: true,
            layout: 'fit',
            items: [this.gpTipoNominas]
        });

        this.panelEastContainner = new Ext.Panel({
            id: 'panelEastContainner',
            title: idioma.lbtitlePanelCenter,
            height: '100%',
            width: '50%',
            region: 'east',
            split: true,
            layout: 'ux.row',
            disabled: true,
            items: [{
                rowHeight: .5,
                width: '100%',
                border: false,
                split: true,
                layout: 'fit',
                items: [this.formularioFormulas]
            }, {
                rowHeight: .5,
                width: '100%',
                border: false,
                split: true,
                layout: 'fit',
                items: [this.panelEast]
            }]

        });

        this.panelCenter = new Ext.Panel({
            id: 'panelcenter',
            title: 'Listado variables SNC-225',
            height: '100%',
            width: '20%',
            region: 'center',
            split: true,
            layout: 'fit',
            disabled: true,
            items: [this.gpSNC]
        });

        this.panelNorth = new Ext.Panel({
            id: 'panelnorth',
            height: '50%',
            width: '100%',
            region: 'north',
            split: true,
            layout: 'border',
            items: [this.panelWest, this.panelCenter, this.panelEastContainner/*, this.panelEast*/]
        });

        this.panelSouth = new Ext.Panel({
            id: 'panelsouth',
            title: idioma.lbtitlePanelSouth,
            height: '50%',
            width: '100%',
            region: 'center',
            split: true,
            layout: 'fit',
            items: [this.gpConfigurarCalendario]
        });

        this.winSNC225 = new Ext.Window({
            title: 'Configuraci&oacute;n del registrio de salario y tiempo de servicio',
            modal: true,
            height: 600,
            width: 800,
            closeAction: 'hide',
            constrain: true,
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'ux.row',
            items: [{
                rowHeight: .60,
                width: '100%',
                border: false,
                split: true,
                layout: 'fit',
                items: [this.panelNorth]
            }, {
                rowHeight: .40,
                width: '100%',
                border: false,
                split: true,
                layout: 'fit',
                items: [this.panelSouth]
            }]

        });
    }
};

//Controlador de la vista del componente.
Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * Class Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio
     * Modulo Configuracion
     * @author Tte. Ing. Frank Rodriguez Berroa
     */
    init: function (idioma, vista, modelo) {
        //Variables
        //Logica y eventos
        var variables = {
            accion: 'add',
            idregistsalartiempservc: -1,
            idtiponomina: -1
        };
        vista.winSNC225.show();
        modelo.stTiposNominas.load();

        //Combo del calendario
        vista.cbAnnos.on('select', function (cb, rec, index) {
            vista.botonGuardar.disable();
            modelo.stCalendario.load({params: {anno: rec.data.denominacion}});
        });

        //Grid de nominas
        vista.smTiposNomina.on('rowselect', function (sm, index, record) {

            vista.idtiponomina = record.data.idtiponomina;
            modelo.stSNC.load({params: {idtiponomina: vista.idtiponomina}});

            vista.panelCenter.enable();
            /*Configuracion de los indidadores a cargar*/
            //Hago la peticion para cargar los datos iniciales
            PVD.mostrarMascara('idmaskconfregistrosalariotiemposervicio', 'Por favor espere...', 'Cargando los datos de la configuracion');
            Ext.Ajax.request({
                url: 'obtenerconfiguracioninicial',
                method: 'POST',
                params: {idtiponomina: vista.idtiponomina},
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskconfregistrosalariotiemposervicio');
                    modelo.datosModelo = Ext.decode(response.responseText);
                }.createDelegate(this)
            });
        });
        //Grid de las variables del snc
        vista.smVariablesSNC.on('rowselect', function (sm, index, record) {
            //   console.info(record);

            vista.indice = index;
            vista.idexpresionmatematicadias = record.data.expresionmatemdias;
            vista.idexpresionmatematicasalario = record.data.expresionmatemimport;
            vista.idexpresionmatematicasalariodevengado = record.data.expresionmatemimportdevengado;

            vista.panelEastContainner.enable();
            vista.botonEliminarVariablesSCN.enable();
            vista.botonModificarVariablesSCN.enable();
            vista.botonEliminarVariablesAuxiliares.disable();
            vista.taDiasTrabajados.setValue(record.data.textoexpresionmatemdias);
            vista.taSalarioDevengado.setValue(record.data.textoexpresionmatemimporte);
            vista.taSalarioDevengadoCalculoReporte.setValue(record.data.textoexpresionmatemimportedev);
            modelo.stVariablesAuxiliares.load({params: {idregistsalartiempservc: record.data.idregistsalartiempservc}});
        });

        //Gird del calendario
        vista.gpConfigurarCalendario.on('afteredit', function (sm, index, record) {
            vista.botonGuardar.enable();
        });

        vista.smVariablesGlobales.on('rowselect', function (sm, index, record) {
            vista.botonEliminarVariablesAuxiliares.enable();
        });

        modelo.stSNC.on('load', function (st, rec, option) {
            if (st.getCount() > 0) {
                vista.smVariablesSNC.selectRow(vista.indice);
                //(st.getCount() == 1) ? vista.botonAdicionarVariablesSCN.disable() : vista.botonAdicionarVariablesSCN.enable();
                vista.botonModificarVariablesSCN.enable();
                vista.botonEliminarVariablesSCN.enable();
            } else {
                vista.panelEastContainner.disable();
                //vista.botonAdicionarVariablesSCN.enable()
                vista.botonModificarVariablesSCN.disable();
                vista.botonEliminarVariablesSCN.disable();
            }
        });

        //Eventos de los botones
        vista.botonEliminarVariablesSCN.setHandler(function () {
            this.eliminarVariableSNC();
        }.createDelegate(this));

        vista.botonAdicionarVariablesSCN.setHandler(function () {
            vista.tfVariableSNC.setValue('');
            variables.accion = 'add';
            vista.winVarablesSNC.show();
        });

        vista.botonModificarVariablesSCN.setHandler(function () {
            variables.accion = 'mod';
            variables.idregistsalartiempservc = vista.gpSNC.getSelectionModel().getSelected().get('idregistsalartiempservc');
            variables.idtiponomina = vista.gpSNC.getSelectionModel().getSelected().get('idtiponomina');
            vista.tfVariableSNC.setValue(vista.gpSNC.getSelectionModel().getSelected().get('denominacion'));
            vista.winVarablesSNC.show();
        });

        /* vista.botonAdicionarVariablesAuxiliares.on('click', function () {
             vista.winVariablesAuxiliares.show();
             vista.pTiposReportesCertificaciones.Cargar();
         });*/
        vista.botonAdicionarVariablesAuxiliares.setHandler(function () {
            vista.winVariablesAuxiliares.show();
            vista.pTiposReportesCertificaciones.Cargar();
        });

        /* vista.botonEliminarVariablesAuxiliares.on('click', function () {
             this.eliminarVariableAuxiliar();
         }.createDelegate(this));*/
        vista.botonEliminarVariablesAuxiliares.setHandler(function () {
            this.eliminarVariableAuxiliar();
        }.createDelegate(this));

        vista.botonCancelarVariablesSCN.on('click', function () {
            vista.winVarablesSNC.hide();
        });

        vista.botonAceptarVariablesSCN.on('click', function () {
            this.guardarVariableSNC();
            vista.winVarablesSNC.hide();
        }.createDelegate(this));

        vista.botonAplicarVariablesSCN.on('click', function () {
            this.guardarVariableSNC();
        }.createDelegate(this));

        vista.botonGuardar.on('click', function () {
            var contcalendarioadd = 0;
            var contcalendariomod = 0;
            var anno = vista.cbAnnos.getRawValue();
            var arrayadddias = new Array();
            var arrayaddmes = new Array();
            var arrayidcalendario = new Array();
            var arraymoddias = new Array();
            var recordsModificados = modelo.stCalendario.getModifiedRecords();
            console.info(modelo.stCalendario);
            for (var i = 0; i < recordsModificados.length; i++) {
                if (recordsModificados[i].data.idcalendario == "") {
                    arrayadddias[contcalendarioadd] = recordsModificados[i].data.cantdias;
                    arrayaddmes[contcalendarioadd] = recordsModificados[i].data.idmes;
                    contcalendarioadd++;
                } else {
                    arrayidcalendario[contcalendariomod] = recordsModificados[i].data.idcalendario;
                    arraymoddias[contcalendariomod] = recordsModificados[i].data.cantdias;
                    contcalendariomod++
                }
            }
            PVD.mostrarMascara('idmaskcalendario', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionardatoscalendario',
                params: {
                    arrayadddias: Ext.encode(arrayadddias),
                    arrayaddmes: Ext.encode(arrayaddmes),
                    arrayidcalendario: Ext.encode(arrayidcalendario),
                    arraymoddias: Ext.encode(arraymoddias),
                    anno: anno
                },
                callback: function (options, succes, response) {
                    PVD.ocultarMascara('idmaskcalendario');
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'El calendario fue actualizado correctamente');
                        modelo.stCalendario.load({params: {anno: anno}});
                    } else {
                        mostrarMensaje(3, 'Por favor inserte la cantidad de d&iacute;as h&aacute;biles menor que 31 d&iacute;as')
                    }
                }
            });
            modelo.stCalendario.commitChanges();

        }.createDelegate(this));

        vista.btnAceptarAAux.on('click', function () {
            var selReporteVariable = vista.pTiposReportesCertificaciones.getSeleccion();
            var idregistsalartiempservc = vista.gpSNC.getSelectionModel().getSelected().get('idregistsalartiempservc');
            var idvariablesconfreportescertificaciones = selReporteVariable.data.idvariablesconfreportescertificaciones;
            var anotaciones = vista.taVariablesAuxiliaresAnotaciones.getValue();

            this.guardarVariableAuxiliar(idregistsalartiempservc, idvariablesconfreportescertificaciones, anotaciones);
            vista.winVariablesAuxiliares.hide();
        }.createDelegate(this));

        vista.btnAplicarAAux.on('click', function () {
            var selReporteVariable = vista.pTiposReportesCertificaciones.getSeleccion();
            var idregistsalartiempservc = vista.gpSNC.getSelectionModel().getSelected().get('idregistsalartiempservc');
            var idvariablesconfreportescertificaciones = selReporteVariable.data.idvariablesconfreportescertificaciones;
            var anotaciones = vista.taVariablesAuxiliaresAnotaciones.getValue();

            this.guardarVariableAuxiliar(idregistsalartiempservc, idvariablesconfreportescertificaciones, anotaciones);
        }.createDelegate(this));

        vista.btnCancelarAAux.on('click', function () {
            vista.winVariablesAuxiliares.hide();
        });

        this.guardarVariableSNC = function () {
            if (vista.formularioVariablesSNC.getForm().isValid()) {
                PVD.mostrarMascara('idmaskaddvariable', 'Por favor espere...', 'Enviando datos');
                Ext.Ajax.request({
                    url: (variables.accion == 'add') ? 'adicionarvariablessnc' : 'modificarvariablessnc',
                    params: {
                        idregistsalartiempservc: (variables.accion == 'mod') ? variables.idregistsalartiempservc : -1,
                        idtiponomina: (variables.accion == 'mod') ? variables.idtiponomina : vista.idtiponomina,
                        denominacion: vista.tfVariableSNC.getValue()
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idmaskaddvariable');
                        respuesta = Ext.decode(response.responseText);
                        if (respuesta == 'ok') {
                            var msgpart = (variables.accion == 'add') ? 'adicion&oacute;' : 'modific&oacute;';
                            mostrarMensaje(1, 'La variable del SNC-225 se ' + msgpart + ' satisfactoriamente.');
                            modelo.stSNC.load({params: {idtiponomina: vista.idtiponomina}});
                        }
                    }
                });
            }
        }.createDelegate(this);


        this.eliminarVariableSNC = function () {
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar la variable del snc-225 seleccionada?', function (btn) {
                if (btn == 'ok') {
                    PVD.mostrarMascara('idmaskdelvariable', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'eliminarvariablessnc',
                        params: {
                            idvariableregistrosalario: vista.gpSNC.getSelectionModel().getSelected().get('idregistsalartiempservc')
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idmaskdelvariable');
                            respuesta = Ext.decode(response.responseText);
                            if (respuesta == 'ok') {
                                mostrarMensaje(1, 'La variable del snc - 225 se elimin&oacute; satisfactoriamente');
                                vista.indice = 0;
                                modelo.stSNC.load({params: {idtiponomina: vista.idtiponomina}});
                            } else {
                                mostrarMensaje(3, 'La variable ' + '<b>' + respuesta + '</b>' +
                                    ' no puede ser eliminada, porque est&aacute; siendo utilizada en el Registro de salarios y tiempo de servicio.');
                            }
                        }
                    });
                }
            });
        };

        this.guardarVariableAuxiliar = function (idregistsalartiempservc, idvariablesconfreportescertificaciones, anotaciones) {
            PVD.mostrarMascara('idmaskaddvariableaux', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionarvariablesauxiliares',
                params: {
                    idvariablesnc: idregistsalartiempservc,
                    idvariablesconfreportescertificaciones: idvariablesconfreportescertificaciones,
                    anotaciones: anotaciones
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskaddvariableaux');
                    respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'La viariable auxiliar se adicion&oacute; correctamente');
                        modelo.stVariablesAuxiliares.load({params: {idregistsalartiempservc: idregistsalartiempservc}});
                    }
                }
            });
        };

        this.eliminarVariableAuxiliar = function () {
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar la variable auxiliar seleccionada?', function (bnt) {
                if (bnt == 'ok') {
                    var idconfvariableregistrosalario = vista.gpVariablesAuxiliares.getSelectionModel().getSelected().get('idvblesgblesregsaltmpserv');
                    PVD.mostrarMascara('idmaskdelvaraux', 'Por vafor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                        url: 'eliminarvariablesauxiliares',
                        params: {idconfvariableregistrosalario: idconfvariableregistrosalario},
                        callback: function (option, succes, response) {
                            respuesta = Ext.decode(response.responseText);
                            if (respuesta == 'ok') {
                                PVD.ocultarMascara('idmaskdelvaraux');
                                mostrarMensaje(1, 'La variable auxiliar ha sido eliminada satisfactoriamente');
                                modelo.stVariablesAuxiliares.load({params: {idregistsalartiempservc: vista.gpSNC.getSelectionModel().getSelected().get('idregistsalartiempservc')}});
                            }
                        }
                    });
                }
            });
        };

        this.MostrarFormulaDiasTrabajados = function () {
            //Cargo las variables globales y conceptos de la retribucion monetaria
            var ind = modelo.ConvertiraArreglo(modelo.datosModelo.indicadores);
            //Cargo las variables auxiliares
            if (modelo.stVariablesAuxiliares.getCount() > 0) {
                var arr = modelo.stVariablesAuxiliares.getRange(0, 1000);
                for (var i = 0; i < arr.length; i++) {
                    var a = new Array();
                    a[0] = 'VASP_' + arr[i].data.idvblesgblesregsaltmpserv;
                    a[1] = arr[i].data.denomvariable;
                    a[2] = 'Variables auxiliares';
                    ind.push(a);
                }
            }
            var c = new Array();
            c[0] = 'CLDR';
            c[1] = 'Dias habiles';
            c[2] = 'Calendario';
            ind.push(c);

            //console.info(ind);

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (vista.idexpresionmatematicadias ? vista.idexpresionmatematicadias : -1),
                indicadores: ind,
                agrupado: 1,
                mostrarCondicionales: true,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                operadoresMostrar: [],
                mostrarDenominacion: false
            });
            this.objExpMat.on('expresionsalvada', function (arr) {
                vista.idexpresionmatematicadias = arr.idexpresionmatematica;
                this.salvarExpresionMatematica(vista.idexpresionmatematicadias, 1);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();
        }.createDelegate(this);

        this.MostrarFormulaSalarioDevengado = function () {
            //Cargo las variables globales y conceptos de la retribucion monetaria
            var ind = modelo.ConvertiraArreglo(modelo.datosModelo.indicadores);
            //Cargo las variables auxiliares
            if (modelo.stVariablesAuxiliares.getCount() > 0) {
                var arr = modelo.stVariablesAuxiliares.getRange(0, 1000);
                for (var i = 0; i < arr.length; i++) {
                    var a = new Array();
                    a[0] = 'VASP_' + arr[i].data.idvblesgblesregsaltmpserv;
                    a[1] = arr[i].data.denomvariable;
                    a[2] = 'Variables auxiliares';
                    ind.push(a);
                }
            }
            var c = new Array();
            c[0] = 'CLDR';
            c[1] = 'Dias habiles';
            c[2] = 'Calendario';
            ind.push(c);

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (vista.idexpresionmatematicasalario ? vista.idexpresionmatematicasalario : -1),
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,				
                mostrarCondicionales: true,
                operadoresMostrar: [],
                mostrarDenominacion: false
            });
            this.objExpMat.on('expresionsalvada', function (arr) {
                vista.idexpresionmatematicasalario = arr.idexpresionmatematica;
                this.salvarExpresionMatematica(vista.idexpresionmatematicasalario, 2);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();
        }.createDelegate(this);

        this.MostrarFormulaSalarioDevengadoCalculoReporte = function () {
            //Cargo las variables globales y conceptos de la retribucion monetaria
            var ind = modelo.ConvertiraArreglo(modelo.datosModelo.indicadores);
            //Cargo las variables auxiliares
            if (modelo.stVariablesAuxiliares.getCount() > 0) {
                var arr = modelo.stVariablesAuxiliares.getRange(0, 1000);
                for (var i = 0; i < arr.length; i++) {
                    var a = new Array();
                    a[0] = 'VASP_' + arr[i].data.idvblesgblesregsaltmpserv;
                    a[1] = arr[i].data.denomvariable;
                    a[2] = 'Variables auxiliares';
                    ind.push(a);
                }
            }
            var c = new Array();
            c[0] = 'CLDR';
            c[1] = 'Dias habiles';
            c[2] = 'Calendario';
            ind.push(c);

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (vista.idexpresionmatematicasalariodevengado ? vista.idexpresionmatematicasalariodevengado : -1),
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,				
                mostrarCondicionales: true,
                operadoresMostrar: [],
                mostrarDenominacion: false
            });
            this.objExpMat.on('expresionsalvada', function (arr) {
                vista.idexpresionmatematicasalariodevengado = arr.idexpresionmatematica;
                this.salvarExpresionMatematica(vista.idexpresionmatematicasalariodevengado, 3);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();
        }.createDelegate(this);

        this.salvarExpresionMatematica = function (idexpresionmatematica, tipoexpresion) {
            PVD.mostrarMascara('idmaskformula', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionarformulas',
                params: {
                    idregistsalartiempservc: vista.gpSNC.getSelectionModel().getSelected().get('idregistsalartiempservc'),
                    idexpresionmatematica: idexpresionmatematica,
                    tipoexpresion: tipoexpresion
                },
                callback: function (options, succes, response) {
                    PVD.ocultarMascara('idmaskformula');
                    respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente');
                        modelo.stSNC.load({params: {idtiponomina: vista.idtiponomina}});
                    } else {
                        mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                    }

                }
            });
        }

        vista.taDiasTrabajados.on('focus', function () {
            this.MostrarFormulaDiasTrabajados();
        }.createDelegate(this));

        vista.taSalarioDevengado.on('focus', function () {
            this.MostrarFormulaSalarioDevengado();
        }.createDelegate(this));

        vista.taSalarioDevengadoCalculoReporte.on('focus', function () {
            this.MostrarFormulaSalarioDevengadoCalculoReporte();
        }.createDelegate(this));
    }
};

//Inicializando la vista, el modelo y el controlador.
UCID.portal.cargarEtiquetas('confregistrosalariotiemposervicio', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo
    var modelo = Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio.Modelo;
    modelo.init(idioma);

    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Configuraciones.ConfRegistroSalarioTiempoServicio.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});
