Ext.ns('Pvd.Nomina.Nomencladores.NomAreas');
Pvd.Nomina.Nomencladores.NomAreas.Panel = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    heigth: '100%',
    width: '100%',
    html: 'dad',
    border: false,
    frame: false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar: 1,
    initComponent: function () {
        var _this = this;
        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomAreas_Modelo();
        this.modelo.init();
        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomAreas_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);
        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomAreas_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);
        this.items = [this.vista.panelCentralAreas];
        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;
        Pvd.Nomina.Nomencladores.NomAreas.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeAreas.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        }
    }
});
//Modelo de la vista del Nomenclador de área.
var Pvd_Nomina_Nomencladores_NomAreas_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {
        //Store del listado de área.
        this.storeAreas = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomareas/obtenerListadoAreasla',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idarea"
                },
                [
                    {name: 'idarea'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'idcomposicion'}
                    ,
                    {name: 'denomcomposicion'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'orden'}
                    ,
                    {name: 'multipleseleccioncargos'}
                    ,
                    {name: 'denommultipleseleccioncargos'}
                ])
        });
        //Store del árbol de plantilla nominal.
        this.storeArbolPlantilla = new Ext.tree.TreeLoader({
            url: '/pvd/nomina/index.php/nomareas/obtenerEstructuraPlantillaNominal',
            autoLoad: false,
            baseParams: {idarea: 0}
        });
        //Store del árbol de estructuras restantes.
        this.storeArbolRest = new Ext.tree.TreeLoader({
            url: '/pvd/nomina/index.php/nomareas/obtenerEstructuraRestante',
            baseParams: {identidad: 0, composicion: 1, multipleseleccioncargos: 0}
        });
        //Store del árbol de estructuras insertadas.
        this.storeArbolInsert = new Ext.tree.TreeLoader({
            url: '/pvd/nomina/index.php/nomareas/obtenerEstructuraInsertadas',
            baseParams: {
                idarea: 0,
                identidad: 0
            }
        });

        this.storeComposicion = new Ext.data.SimpleStore({
            fields: [
                {name: 'idcomposicion'}
                ,
                {name: 'denomcomposicion'}
            ],
            data: [
                [1, 'Cargos'],
                [2, 'Entidad']
            ]
        });
    }
};
//Vista del componente Nomenclador de área.
var Pvd_Nomina_Nomencladores_NomAreas_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de área (Tipo: Pvd_Nomina_Nomencladores_NomAreas_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {
        var self = this;
        this.idestructura = perfil.idestructuracomun;

        //Listado de área.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderAreas = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });
        this.smAreas = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.gpAreas = new Ext.grid.GridPanel({
            id: 'idgpAreas',
            title: idioma.lbTitleAreas,
            region: 'center',
            columns: [
                {header: 'idarea', hidden: true, hideable: false, dataIndex: 'idarea'}
                ,
                this.expanderAreas
                ,
                {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
                ,
                {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    width: 90,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    width: 90,
                    sortable: true,
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }
                ,
                {header: 'idcomposicion', hidden: true, dataIndex: 'idcomposicion'}
                ,
                {
                    header: '<center>' + idioma.lbComposicion + '</center>',
                    width: 90,
                    sortable: true,
                    dataIndex: 'denomcomposicion',
                    renderer: centrarValor
                },
                {header: 'Multip. Sel. Cargos', width: 90, sortable: true, dataIndex: 'denommultipleseleccioncargos'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeAreas,
            sm: this.smAreas,
            plugins: this.expanderAreas,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeAreas,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });
        //Botones de Add, Mod, Elim, Ayud de área.
        this.btnAdicionarAreas = new Ext.Button({
            id: 'btnAddAreas',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddAreas,
            iconCls: 'adicionar',
            prevTab: 'btnAyudaAreas',
            nextTab: 'btnModAreas'
        });
        this.btnModificarAreas = new Ext.Button({
            id: 'btnModAreas',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModAreas,
            iconCls: 'modificar',
            prevTab: 'btnAddAreas',
            nextTab: 'btnElimAreas'
        });
        this.btnEliminarAreas = new Ext.Button({
            id: 'btnElimAreas',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimAreas,
            iconCls: 'eliminar',
            prevTab: 'btnModAreas',
            nextTab: 'btnAyudaAreas'
        });
        this.btnExportarArea = new Ext.Button({
            id: 'btnExportarArea',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });
        this.btnAyudaAreas = new Ext.Button({
            id: 'btnAyudaAreas',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaAreas,
            iconCls: 'ayuda',
            prevTab: 'btnElimAreas',
            nextTab: 'btnAddAreas'
        });
        /***********************************Estructurar Areas**********************************************/
        this.btnEstructurarPlantillaN = new Ext.Button({
            id: 'btnEstructurarPlantillaN',
            text: idioma.lbBtnEstructurar,
            tooltip: idioma.textToolTipEstructurarPlantillaN,
            iconCls: 'estructura',
            prevTab: 'btnElimPlantillaN',
            nextTab: 'btnBuscarPlantillaN ',
        });
        //Tree de vista previa.
        this.smArbolPlantilla = new Ext.tree.DefaultSelectionModel({});
        this.ArbolPlantilla = new Ext.tree.TreePanel({
            title: idioma.lbTitleArbolPlantillaNominal,
            region: 'east',
            width: '40%',
            split: false,
            border: true,
            rootVisible: false,
            autoScroll: true,
            layout: 'fit',
            loader: modelo.storeArbolPlantilla,
            selModel: this.smArbolPlantilla,
            root: new Ext.tree.AsyncTreeNode(
                {
                    text: 'Escala',
                    id: 'root'
                }),
        });
        //Tree de cargos restantes.
        this.smTreeRest = new Ext.tree.DefaultSelectionModel({});
        this.TreeRest = new Ext.tree.TreePanel({
            title: idioma.lbTitleTreeRest,
            region: 'center',
            width: '100%',
            height: 435,
            split: false,
            border: true,
            rootVisible: false,
            autoScroll: true,
            layout: 'fit',
            loader: modelo.storeArbolRest,
            selModel: this.smTreeRest,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Escala',
                id: 'root'
            }),
            bodyStyle: {
                background: '#ffffff',
                padding: '7px'
            },
        });
        //Tree de cargos insertados.
        this.smTreeInsert = new Ext.tree.DefaultSelectionModel({});
        this.TreeInsert = new Ext.tree.TreePanel({
            title: idioma.lbTitleTreeInsert,
            region: 'center',
            width: '100%',
            split: false,
            height: 435,
            border: true,
            rootVisible: false,
            autoScroll: true,
            layout: 'fit',
            loader: modelo.storeArbolInsert,
            selModel: this.smTreeInsert,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Escala',
                id: 'root'
            }),
            bodyStyle: {
                background: '#ffffff',
                padding: '7px'
            }
        });
        //Botones de adicionar y eliminar cargos.
        this.btnAddestructura = new Ext.Button({
            disabled: true,
            id: 'idbtnAddestructura',
            style: 'margin-left:10px;margin-top:155px',
            tooltip: idioma.textToolTipAddEstructP,
            iconCls: 'siguiente',
        });
        this.btnElimestructura = new Ext.Button({
            disabled: true,
            id: 'idbtnElimestructura',
            style: 'margin-left:10px;margin-top:70px',
            tooltip: idioma.textToolTipElimEstructP,
            iconCls: 'anterior',
        });


        //Formulario de estructura de plantilla.
        this.formularioEstructA = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            region: 'center',
            height: 450,
            width: 700,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .47,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'panel',
                                    border: false,
                                    layout: 'fit',
                                    items: [this.TreeRest]
                                }
                            ]
                        },
                        {
                            columnWidth: .06,
                            layout: 'form',
                            items: [this.btnAddestructura, this.btnElimestructura],
                            anchor: '100%'
                        },
                        {
                            columnWidth: .47,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'panel',
                                    border: true,
                                    frame: false,
                                    layout: 'fit',
                                    items: [this.TreeInsert]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        this.btnCerrarEstructP = new Ext.Button({
            id: 'idbtnCerrarEstructP',
            iconCls: 'cerrar',
            text: idioma.lbBtnCerrar,
            tooltip: idioma.textToolTipCerrar,
        });
        //Ventana de adicionar y eliminar estructura de plantilla.
        this.ventanaEstructuraP = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioEstructA],
            buttons: [this.btnCerrarEstructP],
        });
        /***********************************Estructurar Areas**********************************************/
        //Panel contenedor general del grid de grupos escala.
        this.panelCentralAreas = new Ext.Panel({
            id: 'idpanelCentralAreas',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'border',
            tbar: [this.btnAdicionarAreas, this.btnModificarAreas, this.btnEliminarAreas, this.btnExportarArea, '->', this.btnEstructurarPlantillaN, this.btnAyudaAreas],
            items: [this.gpAreas, this.ArbolPlantilla]
        });
        //Campos del formulario de grupos escalas.
        this.tfDenomAreas = new Ext.form.TextField({
            id: 'idtfDenomAreas',
            fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2,
            name: 'denominacion',
            allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
            prevTab: 'idbtnAceptarAreas',
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100
        });
        this.nfOrden = new Ext.form.NumberField({
            id: 'idnfOrden',
            fieldLabel: 'Orden',
            anchor: '78%',
            allowBlank: false,
            tabIndex: 2,
            name: 'orden',
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100
        });
        this.dfFInicioAreas = new Ext.form.DateField({
            id: 'iddfFInicioAreas', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinAreas'
        });
        this.dfFFinAreas = new Ext.form.DateField({
            id: 'iddfFFinAreas', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioAreas'
        });

        this.cbComposicion = new Ext.form.ComboBox({
            id: 'cbComposicion',
            fieldLabel: idioma.lbComposicion,
            valueField: 'idcomposicion',
            displayField: 'denomcomposicion',
            hiddenName: 'idcomposicion',
            mode: 'local',
            anchor: '100%',
            store: modelo.storeComposicion,
            emptyText: 'Seleccione...',
            readOnly: true,
            triggerAction: 'all',
            allowBlank: false
        });

        this.tfDescripAreas = new Ext.form.TextArea({
            id: 'idtfDescripAreas',
            fieldLabel: idioma.lbColDescripcion,
            tabIndex: 5,
            name: 'descripcion',
            allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_225,
            anchor: '99%',
            prevTab: 'iddfFFinAreas',
            nextTab: 'idbtnCancelarAreas',
            blankText: idioma.lbErrorCampoVacio
        });

        this.checkMultipleSeleccionCargos = new Ext.form.Checkbox({
            id: 'checkMultipleSeleccionCargos',
            fieldLabel: 'Multip. selec. cargos',
            name: 'multipleseleccioncargos',
            anchor: '80%'
        });

        //Formulario de grupos escalas.
        this.formularioAreas = new Ext.FormPanel({
            id: 'idformlarioAreas',
            labelAlign: 'top',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [
                this.tfDenomAreas,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.checkMultipleSeleccionCargos]},
                        {columnWidth: .23, layout: 'form', items: [this.nfOrden]},
                        {columnWidth: .43, layout: 'form', items: [this.cbComposicion]}
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .56, layout: 'form', items: [this.dfFInicioAreas]},
                        {columnWidth: .44, layout: 'form', items: [this.dfFFinAreas]}

                    ]
                },
                this.tfDescripAreas
            ]
        });
        //Botones de la ventana de área
        this.btnCancelarAreas = new Ext.Button({
            id: 'idbtnCancelarAreas',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripAreas',
            nextTab: 'idbtnAplicarAreas'
        });
        this.btnAplicarAreas = new Ext.Button({
            id: 'idbtnAplicarAreas',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarAreas',
            nextTab: 'idbtnAceptarAreas'
        });
        this.btnAceptarAreas = new Ext.Button({
            id: 'idbtnAceptarAreas',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarAreas',
            nextTab: 'idtfDenomAreas'
        });
        //Ventana de adicionar y modificar área.
        this.ventanaAreas = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            autoValidate: true,
            validateDefault: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioAreas],
            buttons: [this.btnCancelarAreas, this.btnAplicarAreas, this.btnAceptarAreas],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarAreas.disabled) {
                            self.btnAceptarAreas.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarAreas.disabled) {
                            self.btnCancelarAreas.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarAreas.disabled) {
                            self.btnAplicarAreas.handler();
                        }
                    }
                }
            ]
        });
    }
};
//Controlador de la vista del Nomenclador de grupos escalas.
var Pvd_Nomina_Nomencladores_NomAreas_Controlador = function () {
    this.init = function (idioma, vista, modelo) {
        var variables = {
            identidad: 100000001,
            idcargo: 0,
            idarea: 0,
            accion: 'Add',
            cambio: 0,
            ramal: true,
            ramalinst: true,
            treeCargados: 0,
            composicion: 1
        };
        vista.btnEstructurarPlantillaN.disable();
        var _vista = vista;
        /***Variables generales***/
        var variablesAreas = {
            accion: 'Add',
            cambio: 1
        };
        //Eventos del grid del área.
        vista.gpAreas.on('rowdblclick', function (e) {
            mostrarVentanaModificarAreas();
        });
        vista.gpAreas.on('destroy', function (e) {
            vista.ventanaAreas.destroy();
        });
        //Eventos del store del área.
        modelo.storeAreas.on('beforeload', function (store) {
            vista.btnModificarAreas.disable();
            vista.btnEliminarAreas.disable();
            vista.btnExportarArea.disable();
            store.removeAll();
        });
        modelo.storeAreas.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });
        //Eventos del seleccion model del grid de área.
        vista.smAreas.on('rowselect', function (sm) {
            vista.btnModificarAreas.enable();
            vista.btnEliminarAreas.enable();
            vista.btnExportarArea.enable();
            vista.btnEstructurarPlantillaN.enable();
            vista.idarea = sm.getSelected().get('idarea');
            modelo.storeArbolPlantilla.baseParams.idarea = sm.getSelected().get('idarea');
            modelo.storeArbolInsert.baseParams.idarea = sm.getSelected().get('idarea');
            modelo.storeArbolPlantilla.load(vista.ArbolPlantilla.getRootNode());
            PVD.mostrarMascara('idEstructurarAreas', 'Cargando...', idioma.lbMaskArbolCargando);
        });
        //Eventos de campo de denominacion.
        vista.tfDenomAreas.on('change', function (tf, n, o) {
            variablesAreas.cambio = 1;
        });
        //Eventos de campo de fecha inicio. 
        vista.dfFInicioAreas.on('change', function (tf, n, o) {
            variablesAreas.cambio = 1;
        });
        //Eventos de campo de fecha fin. 
        vista.dfFFinAreas.on('change', function (tf, n, o) {
            variablesAreas.cambio = 1;
        });
        //Eventos de campo de descripcion. 
        vista.tfDescripAreas.on('change', function (tf, n, o) {
            variablesAreas.cambio = 1;
        });
        //Eventos de campo de descripcion.
        vista.nfOrden.on('change', function (tf, n, o) {
            variablesAreas.cambio = 1;
        });

        vista.checkMultipleSeleccionCargos.on('check', function (checkbox, checked) {
            variablesAreas.cambio = 1;
        });

        //Eventos del botón adicionar.
        vista.btnAdicionarAreas.setHandler(function () {
            mostrarVentanaAdicionarAreas();
        });
        //Eventos del botón modificar.
        vista.btnModificarAreas.on('click', function () {
            mostrarVentanaModificarAreas();
        });

        //Exportar
        vista.btnExportarArea.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomareas/exportarNomenclador' +
                '?idarea=' + vista.idarea + '&area=' + vista.smAreas.getSelected().get('denominacion');
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón estructurar plantilla nominal.
        vista.btnEstructurarPlantillaN.on('click', function () {
            mostrarVentanaAddElimEstructP();
        });
        //Eventos del botón cerrar estructurar plantilla.
        vista.btnCerrarEstructP.on('click', function () {
            vista.ventanaEstructuraP.hide();
            PVD.mostrarMascara('idEstructurarAreas', 'Cargando...', idioma.lbMaskArbolCargando);
        });
        //Eventos del botón eliminar.
        vista.btnEliminarAreas.setHandler(function () {
            eliminarAreas();
        });
        //Eventos del botón cancelar.
        vista.btnCancelarAreas.setHandler(function () {
            vista.ventanaAreas.hide();
        });
        //Eventos del botón aplicar.
        vista.btnAplicarAreas.setHandler(function () {
            salvarFormularioAreas(true);
        });
        //Eventos del botón aceptar.
        vista.btnAceptarAreas.setHandler(function () {
            salvarFormularioAreas(false);
        });
        //Evento de la ventana de adicionar/modificar área.
        vista.ventanaAreas.on('beforeshow', function (ventana) {
            variablesAreas.cambio = 1;
            vista.formularioAreas.getForm().reset();
            vista.tfDenomAreas.focus(true, 500);
        });
        vista.ventanaAreas.on('show', function (ventana) {
            if (vista.btnAceptarAreas.disabled) {
                vista.btnCancelarAreas.nextTab = 'idtfDenomAreas';
                vista.tfDenomAreas.prevTab = 'idbtnCancelarAreas';
            }
        });

        /**Función de mostrar la ventana de adicionar area***/
        function mostrarVentanaAdicionarAreas() {
            vista.ventanaAreas.setTitle(idioma.lbTitleVentAdicionarAreas);
            vista.btnAplicarAreas.show();
            vista.ventanaAreas.show();
            vista.btnCancelarAreas.setNextElement('idbtnAplicarAreas');
            vista.btnAceptarAreas.setPreviousElement('idbtnAplicarAreas');
            variablesAreas.accion = 'Add';
        }

        /***Función de mostrar la ventana de modificar area***/
        function mostrarVentanaModificarAreas() {
            vista.ventanaAreas.setTitle(idioma.lbTitleVentModificarAreas);
            vista.btnAplicarAreas.hide();
            vista.ventanaAreas.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarAreas.setNextElement('idbtnAceptarAreas');
            vista.btnAceptarAreas.setPreviousElement('idbtnCancelarAreas');
            vista.formularioAreas.getForm().loadRecord(vista.smAreas.getSelected());
            variablesAreas.accion = 'Mod';
        }

        /***Función para adicionar/modificar un area***/
        function salvarFormularioAreas(boton) {
            var urlAction = '/pvd/nomina/index.php/nomareas/adicionarAreas';
            var idareas = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarAreas;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoAreas;
            if (variablesAreas.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarAreas;
                lbMsgExito = idioma.lbMsgCorrectoModificadoAreas;
                urlAction = '/pvd/nomina/index.php/nomareas/modificarAreas';
                idareas = vista.smAreas.getSelected().get('idarea');
            }
            if (variablesAreas.cambio == 0) {
                if (variablesAreas.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaAreas.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomAreas.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioAreas.getForm().isValid()) {
                    PVD.mostrarMascara('idmaskaddmodareas', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idarea: vista.idarea,
                            denominacion: vista.tfDenomAreas.getValue(),
                            fechainicio: vista.dfFInicioAreas.getRawValue(),
                            fechafin: vista.dfFFinAreas.getRawValue(),
                            //composicion     : vista.cbComposicion.getRawValue(),
                            composicion: vista.cbComposicion.getValue(),
                            descripcion: vista.tfDescripAreas.getValue(),
                            orden: vista.nfOrden.getValue(),
                            multipleseleccioncargos: vista.checkMultipleSeleccionCargos.getValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmaskaddmodareas');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaAreas.hide();
                                } else {
                                    vista.tfDenomAreas.focus(true, 500);
                                }
                                vista.formularioAreas.getForm().reset();
                                modelo.storeAreas.removeAll();
                                modelo.storeAreas.load({params: {limit: 1000, start: 0}});
                                variablesAreas.cambio = 0;
                            } else {
                                if (responseData.codigo == 3)
                                    mostrarMensaje(3, responseData.msg);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        //Función para eliminar un area.
        function eliminarAreas() {
            mostrarMensaje(2, idioma.lbTitleEliminarAreas, function (btn) {
                if (btn == "ok") {
                    PVD.mostrarMascara('idmaskeleminarareas', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarAreas);
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomareas/eliminarAreas',
                        method: 'POST',
                        params: {idarea: vista.smAreas.getSelected().get('idarea')},
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idmaskeleminarareas');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoAreas);
                                modelo.storeAreas.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorAreasUso);
                            }
                        }
                    });
                }
            });
        }

        /***Teclas calientes de la interfaz***/
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'imh',
                alt: true,
                stopEvent: true,
                handler: function (k, e) {
                    switch (k) {
                        case 73: { //i para adicionar.
                            if (!vista.btnAdicionarAreas.disabled && !vista.ventanaAreas.isVisible()) {
                                mostrarVentanaAdicionarAreas();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarAreas.disabled && !vista.ventanaAreas.isVisible()) {
                                mostrarVentanaModificarAreas();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaAreas.isVisible()) {
                                vista.btnAyudaAreas.focus();
                                vista.btnAyudaAreas.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarAreas.disabled && !vista.ventanaAreas.isVisible()) {
                        eliminarAreas();
                    }
                }
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarAreas.isVisible()) {
                        vista.btnAceptarAreas.focus();
                        vista.btnAceptarAreas.fireEvent('click');
                    }
                }
            }
        ]);

        function mostrarVentanaAddElimEstructP() {
            vista.ventanaEstructuraP.setTitle(idioma.lbTitleVentAddElimEstrucP);
            vista.ventanaEstructuraP.show();
        }

        //Evento de la ventana de estructura de plantilla.
        vista.ventanaEstructuraP.on('beforeshow', function (ventana) {
            vista.btnAddestructura.disable();
            vista.btnElimestructura.disable();
            if (variables.treeCargados) {
                variables.idarea = vista.smAreas.getSelected().get('idarea');
                modelo.storeArbolRest.load(vista.TreeRest.getRootNode());

                modelo.storeArbolInsert.baseParams.idarea = vista.smAreas.getSelected().get('idarea');
                modelo.storeArbolInsert.load(vista.TreeInsert.getRootNode());
            }
            variables.treeCargados = 1;
        });
        //Eventos del store de estructura de plantilla.
        modelo.storeArbolPlantilla.on('load', function (store) {
            PVD.ocultarMascara('idEstructurarAreas');
        });
        //Eventos del store de estructura de restante.
        modelo.storeArbolRest.on('beforeload', function (store) {
            store.baseParams.identidad = variables.identidad;
            store.baseParams.idarea = vista.smAreas.getSelected().get('idarea');
            store.baseParams.composicion = vista.smAreas.getSelected().get('idcomposicion');
            store.baseParams.multipleseleccioncargos = vista.smAreas.getSelected().get('multipleseleccioncargos');
        });
        //Evento de selección del arbol de restantes;
        vista.TreeRest.on('checkchange', function (node, checked) {
            if (!node.isLeaf()) {
                node.suspendEvents();
                node.attributes.checked = false;
                node.getUI().toggleCheck(false);
                return false;
            } else {
                if (checked) vista.btnAddestructura.enable();
            }
        });
        vista.TreeInsert.on('checkchange', function (node, checked) {
            if (vista.TreeInsert.getChecked().length > 0)
                vista.btnElimestructura.enable();
            else
                vista.btnElimestructura.disable();
            if (checked == true) {
                var aux = (node.getPath()).split('/');
                for (var i = 2; i < aux.length; i++) {
                    var nes = vista.TreeInsert.getNodeById(aux[i]);
                    if (!nes.attributes.checked) {
                        variables.ramalinst = false;
                        nes.attributes.checked = true;
                        nes.getUI().toggleCheck(true);
                    }
                }
                if (variables.ramalinst) {
                    node.cascade(function (n) {
                        if (!n.attributes.checked) {
                            n.attributes.checked = true;
                            n.getUI().toggleCheck(true);
                        }
                    });
                }
            } else {
                node.cascade(function (n) {
                    if (n.attributes.checked) {
                        n.attributes.checked = false;
                        n.getUI().toggleCheck(false);
                    }
                });
                if (node.parentNode != null) {
                    var chech = false;
                    node.parentNode.eachChild(function (nod) {
                        if (nod.attributes.checked) {
                            chech = true;
                        }
                    });
                    if (!chech) {
                        node.parentNode.attributes.checked = false;
                        node.parentNode.getUI().toggleCheck(false);
                    }
                }
            }
            variables.ramalinst = true;
        });
        //Evento de carga del arbol de restantes.
        vista.TreeRest.on('load', function (node) {
            if (node.parentNode != null && node.attributes.checked) {
                if (node.hasChildNodes()) {
                    node.eachChild(function (node) {
                        if (node.attributes.checked != null) {
                            node.attributes.checked = true;
                            node.getUI().toggleCheck(true);
                        }
                    });
                }
            }
        });

        vista.btnAddestructura.setHandler(function () {
            adicionarEstructuraArea();
        });
        vista.btnElimestructura.setHandler(function () {
            eliminarEstructuraArea();
        });
        vista.ventanaEstructuraP.on('hide', function (ventana) {
            modelo.storeArbolPlantilla.load(vista.ArbolPlantilla.getRootNode());
        });

        /***Funcion recursiva que busca en todo el arbol y devuelve los cargos seleccionados***/
        function buscarNodosMarcados(nodo, arraynoselec) {
            if (nodo.isLeaf() && nodo.attributes.checked == true) {
                arraynoselec.push(nodo.id);
            } else {
                for (var i = 0; i < nodo.childNodes.length; i++)
                    buscarNodosMarcados(nodo.childNodes[i], arraynoselec);
            }
        }

        /***Función para adicionar una estructura plantilla nominal***/
        function adicionarEstructuraArea() {
            var arraynoselec = new Array();
            var raiz = vista.TreeRest.getNodeById(vista.idestructura);
            buscarNodosMarcados(raiz, arraynoselec);
            PVD.mostrarMascara('idmaskaddestrucplant', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgAddEstructuraP);
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/nomareas/adicionarEstructuraArea',
                method: 'POST',
                params: {
                    idarea: vista.smAreas.getSelected().get('idarea'),
                    identidad: vista.idestructura,
                    array: Ext.encode(arraynoselec)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskaddestrucplant');
                    if (responseData.codigo == 1) {
                        mostrarMensaje(1, idioma.lbMsgCorrectoAddEstructuraP, function () {
                            vista.btnAddestructura.disable();
                            vista.btnElimestructura.disable();
                            modelo.storeArbolRest.load(vista.TreeRest.getRootNode());
                            modelo.storeArbolInsert.load(vista.TreeInsert.getRootNode());
                        });
                    } else {
                        if (responseData.codigo)
                            mostrarMensaje(responseData.codigo, responseData.mensaje);
                    }
                }
            });
        }

        /***Función para eliminar una estructura plantilla nominal***/
        function eliminarEstructuraArea() {
            var array = new Array();
            vista.TreeInsert.getRootNode().cascade(function (n) {
                if (n.attributes.checked && (n.attributes.tipoestructura == 7)) {
                    array.push(parseInt(n.id));
                }
            });
            PVD.mostrarMascara('idmaskeleminarestrucplant', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarEstructuraP);
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/nomareas/eliminarEstructuraArea',
                method: 'POST',
                params: {
                    idarea: vista.smAreas.getSelected().get('idarea'),
                    array: Ext.encode(array)
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskeleminarestrucplant');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codigo) {
                        mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoEstructuraP, function (btn) {
                            vista.btnAddestructura.disable();
                            vista.btnElimestructura.disable();
                            modelo.storeArbolRest.load(vista.TreeRest.getRootNode());
                            modelo.storeArbolInsert.load(vista.TreeInsert.getRootNode());
                        });
                    }
                }
            });
        }
    }
};
variablesGlobales.nomareas_js = 1;
