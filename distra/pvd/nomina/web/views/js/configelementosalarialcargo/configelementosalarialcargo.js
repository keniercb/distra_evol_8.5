/**
 * Configuracion de los elementos salariales al cargo.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Configuraciones.ConfigElementoSalarialCargo
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.ElementoSalarialCargo.ConfigElementoSalarialCargo');
Ext.QuickTips.init();
var variablesGlobales = {};
//Modelo de la vista del Nomenclador de tipos de nómina.
Pvd.Nomina.ElementoSalarialCargo.ConfigElementoSalarialCargo.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function (idioma) {

        this.datosModelo = null;

        this.storePeriodoPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/configelementosalarialcargo/cargarPeriodoPago',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idperiodopago"
            }, [
                {name: 'idperiodopago'},
                {name: 'denominacion'}
            ])
        });

        this.storeGrupoEscala = new Ext.data.Store({
            url: '/pvd/nomina/index.php/configelementosalarialcargo/cargarGrupoEscala',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idgrupoescala"
            }, [
                {name: 'idgrupoescala'},
                {name: 'denominacion'}
            ])
        });

        this.storecbGrupoEscala = new Ext.data.Store({
            url: '/pvd/nomina/index.php/configelementosalarialcargo/cargarGrupoEscala',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idgrupoescala"
            }, [
                {name: 'idgrupoescala'},
                {name: 'denominacion'}
            ])
        });

        this.storeSector = new Ext.data.Store({
            url: '/pvd/nomina/index.php/configelementosalarialcargo/cargarSectorSalarial',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idsectorsalarial"
            }, [
                {name: 'idsectorsalarial'},
                {name: 'denominacion'}
            ])
        });

        this.storeEscalaSueldoCargo = new Ext.data.Store({
            url: '/pvd/nomina/index.php/configelementosalarialcargo/cargarEscalaSueldoxCargo',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idescalasueldocargo"
            }, [
                {name: 'idescalasueldocargo'},
                {name: 'denominacion'}
            ])
        });


//        this.storeCargoSalarioEspecifico = new Ext.data.Store({
//            url: '/pvd/nomina/index.php/configelementosalarialcargo/cargarCargoSalarioEspecifico',
//            autoLoad: true,
//            reader: new Ext.data.JsonReader({
//                root: "datos",
//                totalProperty: "cantidad",
//                id: "idsalarioespecifico"
//            }, [
//                {name: 'idsalarioespecifico'},
//                {name: 'denominacioncargo'}
//            ])
//        });

    }
};

//Vista del componente Nomenclador de tipos de nómina.
Pvd.Nomina.ElementoSalarialCargo.ConfigElementoSalarialCargo.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomTipoNomina_Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var self = this;
        var array = "";
        var idtipo = 0;

        //Listado de tipos de nómina.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smTipoNomina = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });
        this.gpTipoNomina = new Pvd.Nomina.CmpTreeGrid({
            region: 'center',
            width: '50%',
            listeners: {
                render: {
                    fn: function () {

                    }
                }
            }
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de nómina.
        this.btnAdicionarTipoN = new Ext.Button({
            id: 'btnAdicionarTipoN',
            text: idioma.lbBtnAdicionar,
            disabled: true,
            tooltip: idioma.textToolTipAddTipoN,
            iconCls: 'adicionar',
            prevTab: 'btnAyudaTipoN',
            nextTab: 'btnModificarTipoN',
        });

        this.btnModificarTipoN = new Ext.Button({
            id: 'btnModificarTipoN',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModTipoN,
            disabled: true,
            iconCls: 'modificar',
            prevTab: 'btnAdicionarTipoN',
            nextTab: 'btnEliminarTipoN',
        });

        this.btnEliminarTipoN = new Ext.Button({
            id: 'btnEliminarTipoN',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTipoN,
            disabled: true,
            iconCls: 'eliminar',
            prevTab: 'btnModificarTipoN',
            nextTab: 'btnExportReporte',
        });

        this.btnExportReporte = new Ext.Button({
            id: 'btnExportReporte',
            text: idioma.lbBtnExportReporte,
            tooltip: idioma.textToolTipExportReporte,
            //disabled: true,
            iconCls: 'exportar',
            prevTab: 'btnEliminarTipoN',
            nextTab: 'btnAyudaTipoN',
        });

        this.btnSyncronizar = new Ext.Button({
            iconCls: 'arriba',
            // disabled: true,
            text: 'Sync. Elementos',
            tooltip: 'Sincronizar elementos salariales',
        });

        this.btnAyudaTipoN = new Ext.Button({
            id: 'btnAyudaTipoN',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaTipoN,
            iconCls: 'ayuda',
            prevTab: 'btnExportReporte',
            //nextTab: 'btnAddTipoP',

        });

        //Panel contenedor general del grid de tipos de nómina. 
        this.panelNorth = new Ext.Panel({
            id: 'idpanelNorth',
            region: 'north',
            height: 350,
            width: '100%',
            border: false,
            split: true,
            items: [this.gpTipoNomina],
            layout: 'fit',
            tbar: [this.btnAdicionarTipoN, this.btnModificarTipoN, this.btnEliminarTipoN,this.btnExportReporte, this.btnSyncronizar, '->', this.btnAyudaTipoN],
            keys:
                [
                    {
                        //Adicionar
                        key: 'i',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.btnAdicionarTipoN.handler();
                        }
                    },
                    {
                        //Modificar
                        key: 'm',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            if (!self.btnModificarTipoN.disabled) {
                                self.btnModificarTipoN.handler();
                            }

                        }
                    },
                    {
                        //Eliminar
                        key: Ext.EventObject.DELETE,
                        stopEvent: true,
                        fn: function () {
                            if (!self.btnEliminarTipoN.disabled) {
                                self.btnEliminarTipoN.handler();
                            }
                        }
                    },
                    {
                    //Ayuda
                    key: 'h',
                    stopEvent: true,
                    alt: true,
                    fn: function () {
                        self.btnAyudaTipoN.handler();
                    }
                }
                ],

        });


        this.panelSouth = new Ext.Panel({
            id: 'panelSouth',
            region: 'south',
            height: 100,
            width: '100%',
            disabled: true,
            border: true,
        });
        //Campos del formulario de tipos de nómina.
        this.tfDenomTipoN = new Ext.form.TextField({id: 'idtfDenomTipoN', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarTipoN',
        });

        this.cbPeriodoPago = new Ext.form.ComboBox({id: 'idcbPeriodoPago', fieldLabel: idioma.lbColcbPeriodopago,
            tabIndex: 1, valueField: 'idperiodopago',
            displayField: 'denominacion', hiddenName: 'idperiodopago',
            allowBlank: false, mode: 'local',
            // prevTab: 'idcbSistemaPago',
            //nextTab: 'idtfGrupoEscala',
            store: modelo.storePeriodoPago, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.cbSistemaPago = new Ext.components.TreeComboBox({
            anchor: "90%",
            fieldLabel: idioma.lbColcbSistemapago,
            id: 'idcbSistemaPago',
            prevTab: 'btnAyudaTipoN',
            nextTab: 'idcbPeriodoPago',
            allowBlank: false,
            treeConfig: {
                rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: 'cargarSistemaPago',
                    preloadChildren: false,
                    listeners: {
                        beforeload: function (treeLoader, node, response) {
                            this.cbSistemaPago.reset();
                            treeLoader.baseParams.idnodo = node.attributes.idnodo;
                            treeLoader.baseParams.idconfiguracion = self.idconfiguracion;
                        }.createDelegate(this)
                    }
                }),
                border: false,
                autoScroll: true,
                root: new Ext.tree.AsyncTreeNode({
                    id: '-1',
                    text: 'Arbol',
                    idnodo: '-1',
                    animate: false,
                    draggable: false,
                    expanded: false
                }),
                listeners: {
                    click: function (node, e) {
                        cambio = 1;
                        if (node.attributes.leaf == false) {
                            setTimeout('this.Pvd.Nomina.ElementoSalarialCargo.ConfigElementoSalarialCargo.Vista.cbSistemaPago.setRawValue("");', 5);
                        }
                    }.createDelegate(this)
                }
            }
        });

        this.tfGrupoEscala = new Ext.form.TextField({id: 'idtfGrupoEscala', fieldLabel: idioma.lbColtfGrupoEscala,
            tabIndex: 1, valueField: 'idgrupoescala',
            displayField: 'denominacion', hiddenName: 'idtfgrupoescala',
            allowBlank: false, mode: 'local',
            store: modelo.storeGrupoEscala,
            emptyText: 'Seleccione...',
            // prevTab: 'idcbPeriodoPago',
            // nextTab: 'idcbSector',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.cbGrupoEscala = new Ext.form.ComboBox({id: 'idcbGrupoEscala', fieldLabel: idioma.lbColcbGrupoEscala,
            tabIndex: 1, valueField: 'idgrupoescala',
            displayField: 'denominacion',
            allowBlank: false, mode: 'local',
            store: modelo.storecbGrupoEscala,
            emptyText: 'Seleccione...',
            // prevTab: 'idtfGrupoEscala',
            // nextTab: 'idcbEscalaSueldoCargo',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            disabled: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.cbSector = new Ext.form.ComboBox({id: 'idcbSector', fieldLabel: idioma.lbColcbSectorSalarial,
            tabIndex: 1, valueField: 'idsectorsalarial',
            displayField: 'denominacion',
            allowBlank: false, mode: 'local',
            store: modelo.storeSector,
            emptyText: 'Seleccione...',
            // prevTab: 'idtfGrupoEscala',
            // nextTab: 'idcbEscalaSueldoCargo',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            disabled: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.cbEscalaSueldoCargo = new Ext.form.ComboBox({
            id: 'idcbEscalaSueldoCargo',
            fieldLabel: idioma.lbColcbEscalaSueldoCargo,
            tabIndex: 1,
            valueField: 'idescalasueldocargo',
            displayField: 'denominacion',
            hiddenName: 'idescalasueldocargo',
            allowBlank: false,
            mode: 'local',
            store: modelo.storeEscalaSueldoCargo,
            emptyText: 'Seleccione...',
            // prevTab: 'idcbSector',
            //nextTab: 'nfSueldoCargo',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.cbCargoSalarioEspecifico = new Ext.form.ComboBox({id: 'idcbCargoSalarioEspecifico', fieldLabel: idioma.lbColcbCargoSalarioEspecifico,
            tabIndex: 1, valueField: 'idsalarioespecifico',
            displayField: 'denominacioncargo',
            allowBlank: false, mode: 'local',
            store: modelo.storeCargoSalarioEspecifico,
            emptyText: 'Seleccione...',
            // prevTab: 'idcbSector',
            //nextTab: 'nfSueldoCargo',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            disabled: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.nfSueldoCargo = new Ext.form.TextField({id: 'nfSueldoCargo', fieldLabel: idioma.lbColImporte,
            tabIndex: 2, name: 'nfSueldoCargo', allowBlank: true, anchor: '90%',
            prevTab: 'idcbEscalaSueldoCargo',
            nextTab: 'iddfFInicioTipoN',
            maskRe: /[0-9.]/i,
            regex: /^\d+(\.\d{1,2})?$/i,
            regexText: idioma.lbErrorFormatoNum,

        });

        this.checkTodosCargos = new Ext.form.Checkbox({
            id        : 'checkTodosCargos',
            fieldLabel: 'Todos los cargos',
            name      : 'todoscargos',
            anchor    : '80%'
        });

        this.dfFInicioTipoN = new Ext.form.DateField({id: 'iddfFInicioTipoN', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            prevTab: 'nfSueldoCargo',
            nextTab: 'iddfFFinTipoN',
            anchor: '90%', endDateField: 'iddfFFinTipoN'
        });

        this.dfFFinTipoN = new Ext.form.DateField({id: 'iddfFFinTipoN', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            invalidText: idioma.invalidTextFecha,
            prevTab: 'iddfFInicioTipoN',
            nextTab: 'idbtnCancelarTipoN',
            vtype: 'daterange', anchor: '90%', startDateField: 'iddfFInicioTipoN',
            disabled: true,
        });

        this.tfDescripTipoN = new Ext.form.TextArea({id: 'idtfDescripTipoN',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion', maxLength: 250,
            anchor: '99%', prevTab: 'iddfFFinTipoN', nextTab: 'idbtnCancelarTipoN',
            blankText: idioma.lbErrorCampoVacio,
        });

        //Formulario de tipos de nómina.
        this.formularioTipoN = new Ext.FormPanel({
            id: 'idformlarioTipoN',
            labelAlign: 'top',
            frame: true,
            width: 500,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [
                {layout: 'column',
                    items: [
                        {columnWidth: .50, layout: 'form', items: [this.cbSistemaPago]},
                        {columnWidth: .50, layout: 'form', items: [this.cbPeriodoPago]}
                    ]
                },
                {layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.cbEscalaSueldoCargo]},
                        {columnWidth: .33, layout: 'form', items: [this.cbGrupoEscala]},
                        {columnWidth: .33, layout: 'form', items: [this.cbSector]}
                    ]
                },
                {layout: 'column',
                    items: [
                        {columnWidth: .33, layout: 'form', items: [this.tfGrupoEscala]},
                       // {columnWidth: .33, layout: 'form', items: [this.cbCargoSalarioEspecifico]},
                        {columnWidth: .33, layout: 'form', items: [this.nfSueldoCargo]},
                        {columnWidth: .33, layout: 'form', items: [this.checkTodosCargos]},

                    ]
                },
                {layout: 'column',
                    items: [
                        {columnWidth: .50, layout: 'form', items: [this.dfFInicioTipoN]},
                        {columnWidth: .50, layout: 'form', items: [this.dfFFinTipoN]}
                    ]
                }
            ],
        });

        //Botones de la ventana de tipos de nómina
        this.btnCancelarTipoN = new Ext.Button({
            id: 'idbtnCancelarTipoN',
            iconCls: 'cancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            prevTab: 'iddfFFinTipoN',
            nextTab: 'idbtnAplicarTipoN',
        });

        this.btnAplicarTipoN = new Ext.Button({
            id: 'idbtnAplicarTipoN',
            iconCls: 'aplicar',
            // icon: perfil.dirImg + 'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTipoN',
            nextTab: 'idbtnAceptarTipoN',
        });

        this.btnAceptarTipoN = new Ext.Button({
            id: 'idbtnAceptarTipoN',
            iconCls: 'aceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
            prevTab: 'idbtnAplicarTipoN',
            nextTab: 'idtfDenomTipoN',
        });

        //Ventana de adicionar y modificar tipos de nómina.
        this.ventanaTipoN = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioTipoN],
            buttons: [this.btnCancelarTipoN,/*, this.btnAplicarTipoN,*/ this.btnAceptarTipoN],
            keys:
                [
                    {
                        key: Ext.EventObject.ENTER,
                        stopEvent: true,
                        fn: function () {
                            self.btnAceptarTipoN.handler();
                        }
                    },
                    {
                        key: 'p',
                        stopEvent: true,
                        alt: true,
                        ctrl: true,
                        fn: function () {
                            self.btnAplicarTipoN.handler();
                        }
                    },
                    {
                        key: 'x',
                        stopEvent: true,
                        alt: true,
                        fn: function () {
                            self.btnCancelarTipoN.handler();
                        }
                    }
                ]
        });
        this.pconceptosescala = new Pvd.Nomina.gpconceptosescalacomp({
            tipo: 1,
            modoviewform: 1,
            split: true
        });
        //Vista general.
        new Ext.Viewport({
            layout: 'border',
            items: [this.panelNorth, this.pconceptosescala]
        });

    }
};

//Controlador de la vista del Nomenclador de tipos de nómina.
Pvd.Nomina.ElementoSalarialCargo.ConfigElementoSalarialCargo.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomTipoNomina_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de nómina (Tipo: Pvd_Nomina_Nomencladores_NomTipoNomina_Modelo)
     */
    init: function (idioma, vista, modelo) {
        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesTipoN = {
            accion: 'Add',
            cambio: 0,
            cambiogs: 0,
            cambioss: 0,
            tiposalario: -1
        };

        //cargando los combos del formulario
        modelo.storePeriodoPago.load();
        modelo.storeEscalaSueldoCargo.load();

        //Eventos del grid de tipos de nómina.
        vista.gpTipoNomina.on('rowdblclick', function (e) {
            mostrarVentanaModificarTipoN();
        });

        vista.gpTipoNomina.on('destroy', function (e) {
            vista.ventanaTipoN.destroy();
        });


        //Eventos del seleccion model del grid de tipos de nómina.
        vista.gpTipoNomina.selModel.on('rowselect', function () {
            capturarCargo();
        });

        //Eventos de campo de fecha inicio.
        vista.checkTodosCargos.on('check', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        vista.cbSistemaPago.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.cbPeriodoPago.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.tfGrupoEscala.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.cbSector.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.cbEscalaSueldoCargo.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.nfSueldoCargo.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioTipoN.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinTipoN.on('change', function (tf, n, o) {
            variablesTipoN.cambio = 1;
        });

        //Eventos de campo de fecha fin.
        vista.cbGrupoEscala.on('change', function (tf, n, o) {
            variablesTipoN.cambiogs = 1;
            if (variablesTipoN.cambioss == 1) {
                ActivarImporteGrupoEscalaSectorSalarial(vista.cbGrupoEscala.getValue(), vista.cbSector.getValue());
            }
        });
        //Eventos del botón adicionar tipos de nómina.
        vista.btnAdicionarTipoN.setHandler(function(){
            mostrarVentanaAdicionarTipoN();
        });
// ActivarImporteGrupoEscalaSectorSalarial(vista.cbGrupoEscala.getValue(),vista.cbSector.getValue());
        //Evento del combo escala
        vista.cbEscalaSueldoCargo.on('select', function (tf, n, o) {

            if (vista.cbEscalaSueldoCargo.getValue() == 1) {
                vista.cbGrupoEscala.reset();
                vista.cbGrupoEscala.disable();
                vista.cbSector.reset();
                vista.cbSector.disable();

                /*vista.cbCargoSalarioEspecifico.reset();
                vista.cbCargoSalarioEspecifico.disable();*/
                vista.tfGrupoEscala.reset();
                vista.nfSueldoCargo.disable();
                variablesTipoN.tiposalario = 0;
               ActivarImporteGrupoEscala();
            } else if (vista.cbEscalaSueldoCargo.getValue() == 2) {

                vista.cbGrupoEscala.enable();
                vista.tfGrupoEscala.reset();
                vista.tfGrupoEscala.disable();
                vista.nfSueldoCargo.reset();
                vista.nfSueldoCargo.disable();
                /*vista.cbCargoSalarioEspecifico.reset();
                vista.cbCargoSalarioEspecifico.disable();*/
                variablesTipoN.tiposalario = 1;
            }else if (vista.cbEscalaSueldoCargo.getValue() == 3) {

                vista.tfGrupoEscala.reset();
                vista.tfGrupoEscala.disable();
                vista.cbGrupoEscala.disable();
                vista.cbSector.reset();
                vista.cbSector.enable();
                vista.nfSueldoCargo.reset();
                vista.nfSueldoCargo.disable();
                variablesTipoN.tiposalario = 2;
            }
        });
        //Evento del combo Cargo
        /*vista.cbCargoSalarioEspecifico.on('select', function (tf, n, o) {
            ActivarImporteSalarioEspecifico(vista.cbCargoSalarioEspecifico.getValue());
        });*/

        //Evento del combo escala
        vista.cbGrupoEscala.on('select', function (tf, n, o) {
            vista.cbSector.enable();
            if (vista.cbSector.getValue()) {
                ActivarImporteGrupoEscalaSectorSalarial(vista.cbGrupoEscala.getValue(), vista.cbSector.getValue());
            }
        });
        //Evento del combo sector
        vista.cbSector.on('select', function (tf, n, o) {
            vista.cbEscalaSueldoCargo.enable();
            if(vista.cbEscalaSueldoCargo.getValue() == 2)
            {
                if (vista.cbGrupoEscala.getValue()) {
                    ActivarImporteGrupoEscalaSectorSalarial(vista.cbGrupoEscala.getValue(), vista.cbSector.getValue());
                }
            }
            if(vista.cbEscalaSueldoCargo.getValue() == 3)
            {
                //vista.cbCargoSalarioEspecifico.enable();
                //modelo.storeCargoSalarioEspecifico.load({params: {idsectorsalarial:vista.cbSector.getValue()}});
            }
        });
        //Eventos del botón modificar tipos de nómina.
        vista.btnModificarTipoN.setHandler(function(){

            mostrarVentanaModificarTipoN();
        });
        //Eventos del botón eliminar tipos de nómina.
        vista.btnEliminarTipoN.setHandler(function(){
            eliminarTipoNomina();
        });


        //Eventos del botón exportar reporte de elementos salariales al cargo no configurados.
        vista.btnExportReporte.setHandler(function(){
            exportarReporteElemSalarialesCargoNoConfigurado();
        });

        vista.btnSyncronizar.setHandler(function(){
            sincronizarTipoNomina();
        });
        
        // vista.smTipoNomina.on('selectionchange', function (sm) {
        //     console.log(sm);
        //     if(sm.getSelections().length > 0) {
        //         vista.btnSyncronizar.enable();
        //     } else{
        //         vista.btnSyncronizar.disable();
        //     }            
        // });

        vista.pconceptosescala.cbConcepto.on('change', function (tf, n, o) {
            vista.pconceptosescala.cambio = 1;
        });
        vista.pconceptosescala.cbTarifa.on('change', function (tf, n, o) {
            vista.pconceptosescala.cambio = 1;
        });
        vista.pconceptosescala.dfFInicioConcepto.on('change', function (tf, n, o) {
            vista.pconceptosescala.cambio = 1;
        });
        vista.pconceptosescala.dfFFinConcepto.on('change', function (tf, n, o) {
            vista.pconceptosescala.cambio = 1;
        });
        vista.pconceptosescala.gpConcepto.on('click', function (e) {
            var cantidadseleccionados = vista.pconceptosescala.gpConcepto.getSelectionModel().getSelections().length;
            (cantidadseleccionados == 0) ? vista.pconceptosescala.btnEliminarConcepto.disable() : vista.pconceptosescala.btnEliminarConcepto.enable();
            (cantidadseleccionados != 1) ? vista.pconceptosescala.btnModificarConcepto.disable() : vista.pconceptosescala.btnModificarConcepto.enable();
        });
        vista.gpTipoNomina.selModel.on('rowdeselect', function (tf, n, o) {
            vista.pconceptosescala.LimpiarTodo();
        });
        vista.pconceptosescala.btnAceptarEscala.on('click', function () {
            var arreglo = vista.gpTipoNomina.getSelections();
            vista.pconceptosescala.AdicionarModConfiguracionEscala(0, arreglo,0,0);
        });
        vista.pconceptosescala.btnAplicarEscala.on('click', function () {
            var arreglo = vista.gpTipoNomina.getSelections();
            vista.pconceptosescala.AdicionarModConfiguracionEscala(1, arreglo,0,0);
        });
        vista.pconceptosescala.btnAceptarConcepto.on('click', function () {
            vista.array = vista.gpTipoNomina.getSelections();
            var idelemt = vista.gpTipoNomina.getSelectionModel().getSelected().get('idelementosalarialcargo');
            vista.pconceptosescala.AdicionarModificarConceptoPD(vista.array, false, 1, idelemt);
        });
        vista.pconceptosescala.btnAplicarConcepto.on('click', function () {
            vista.array = vista.gpTipoNomina.getSelections();
            var idelemt = vista.gpTipoNomina.getSelectionModel().getSelected().get('idelementosalarialcargo');
            vista.pconceptosescala.AdicionarModificarConceptoPD(vista.array, true, 1, idelemt);
        });
        vista.pconceptosescala.btnCancelarConcepto.on('click', function () {
            vista.pconceptosescala.ventanaConcepto.hide();
        });
        vista.pconceptosescala.btnEliminarConcepto.on('click', function () {
            vista.pconceptosescala.ventanaEliminarConcepto.show();
        });
        vista.pconceptosescala.btnCancelarEliminarConcepto.on('click', function () {
            vista.pconceptosescala.ventanaEliminarConcepto.hide();
        });
        vista.pconceptosescala.btnAceptarEliminarConcepto.on('click', function () {
            var arrayIdElemSalCargo = new Array();
			idConcepPD = vista.pconceptosescala.gpConcepto.getSelectionModel().getSelected().get('idconceptopercepciondescuento');
			
            var arridelemt = vista.gpTipoNomina.getSelectionModel().getSelections();     //getSelected().get('idelementosalarialcargo');
            for(var i = 0; i < arridelemt.length; i++){
			  arrayIdElemSalCargo.push(arridelemt[i].data.idelementosalarialcargo);
			}
			
			
            vista.pconceptosescala.EliminarConceptoPD(arrayIdElemSalCargo, idConcepPD);
            vista.pconceptosescala.ventanaEliminarConcepto.hide();
        });
        vista.pconceptosescala.btnEliminarEscala.on('click', function () {
            var arreglo = vista.gpTipoNomina.getSelections();

            vista.pconceptosescala.eliminarEscala(arreglo);
        });
        //Eventos del botón cancelar tipos de nómina.
        vista.btnCancelarTipoN.setHandler(function(){
            vista.ventanaTipoN.hide();
            vista.cbSector.disable();
        });
        //Eventos del botón aplicar tipos de nómina.
        vista.btnAplicarTipoN.setHandler(function(){
            salvarFormularioTipoN(true);
        });
        //Eventos del botón aceptar tipos de nómina.
        vista.btnAceptarTipoN.setHandler(function(){
            salvarFormularioTipoN(false);
        });
        //Evento de la ventana de adicionar/modificar tipos de nómina.
        vista.ventanaTipoN.on('beforeshow', function (ventana) {
            vista.formularioTipoN.getForm().reset();
            vista.tfDenomTipoN.focus(true, 500);
        });

        /*
         *Función de mostrar la ventana de adicionar tipos de nómina.
         */
        function mostrarVentanaAdicionarTipoN() {
            //cargando los combos del formulario
            modelo.storePeriodoPago.load();
            modelo.storeEscalaSueldoCargo.load();
            vista.formularioTipoN.getForm().reset();
            vista.cbSistemaPago.setValue('');
            vista.cbSistemaPago.focus(true, 500);
            vista.ventanaTipoN.setTitle(idioma.lbTitleVentAdicionarTipoN);
            vista.btnAplicarTipoN.show();
            vista.ventanaTipoN.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTipoN.setNextElement('idbtnAplicarTipoN');
            vista.btnAceptarTipoN.setPreviousElement('idbtnAplicarTipoN');
            variablesTipoN.accion = 'Add';
            vista.cbSistemaPago.setRawValue("");
            //vista.checkTodosCargos.setValue(false);

        }
        function capturarCargo() {
            vista.idtipo = vista.gpTipoNomina.getSelectionModel().getSelected().get('idtipo');

            if (vista.idtipo == 7) {
                vista.btnExportReporte.disable();
                var idelemsalarial = vista.gpTipoNomina.getSelectionModel().getSelected().get('idelementosalarialcargo');
                if (idelemsalarial == null) {
                    vista.btnAdicionarTipoN.enable();
                    vista.btnEliminarTipoN.disable();
                    vista.btnModificarTipoN.disable();

                    vista.pconceptosescala.btnAdicionarConcepto.disable();
                    vista.pconceptosescala.btnModificarConcepto.disable();
                    vista.pconceptosescala.btnEliminarConcepto.disable();
                    vista.pconceptosescala.btnAdicionarEscala.disable();
                    vista.pconceptosescala.btnModificarEscala.disable();
                    vista.pconceptosescala.btnEliminarEscala.disable();
                } else {
                    vista.btnEliminarTipoN.enable();
                    vista.btnAdicionarTipoN.disable();
                    vista.btnModificarTipoN.enable();

                    vista.pconceptosescala.btnAdicionarConcepto.disable();
                    vista.pconceptosescala.btnModificarConcepto.disable();
                    vista.pconceptosescala.btnEliminarConcepto.disable();
                    vista.pconceptosescala.btnAdicionarEscala.disable();
                    vista.pconceptosescala.btnModificarEscala.disable();
                    vista.pconceptosescala.btnEliminarEscala.disable();
                    vista.pconceptosescala.CargarElementosSalariales(idelemsalarial);
                    var allselections = vista.gpTipoNomina.getSelections();
                    for (var i = 0; i < allselections.length; i++) {
                        if (allselections[i]['data']['idtipo'] != 7) {
                            vista.btnAdicionarTipoN.disable();
                            vista.btnEliminarTipoN.disable();
                            vista.btnModificarTipoN.disable();

                        }
                    }
                }
            } else if(vista.idtipo == 3){
                vista.btnExportReporte.enable();
            }else {
                vista.btnEliminarTipoN.disable();
                vista.btnAdicionarTipoN.disable();
                vista.btnModificarTipoN.disable();
                vista.btnExportReporte.disable();

                vista.pconceptosescala.btnAdicionarConcepto.disable();
                vista.pconceptosescala.btnModificarConcepto.disable();
                vista.pconceptosescala.btnEliminarConcepto.disable();
            }
        }
        function ActivarImporteCambioSector() {
            var escala = Ext.getCmp('idcbEscalaSueldoCargo').getRawValue();
            var grupescala = Ext.getCmp('idtfGrupoEscala').getRawValue();
            if (isNaN(escala)) {
                if (escala == "Grupo escala") {
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/configelementosalarialcargo/buscarImporteSalarioEscala',
                        method: 'POST',
                        params: {idgrupoescala: Ext.getCmp('idtfGrupoEscala').getValue(),
                            idsectorsalarial: Ext.getCmp('idcbSector').getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            var result = responseData;
                            Ext.getCmp('nfSueldoCargo').enable();
                            Ext.getCmp('nfSueldoCargo').setValue(result);
                        }
                    });
                }
            } else {
                var aux = 0;
            }
        }
        function ActivarImporteCambioGrupoEscala() {
            var escala = Ext.getCmp('idcbEscalaSueldoCargo').getRawValue();
            var sector = Ext.getCmp('idcbSector').getRawValue();
            if (isNaN(escala) && isNaN(sector)) {
                if (escala == "Grupo escala") {
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/configelementosalarialcargo/buscarImporteSalarioEscala',
                        method: 'POST',
                        params: {idgrupoescala: Ext.getCmp('idtfGrupoEscala').getValue(),
                            idsectorsalarial: Ext.getCmp('idcbSector').getValue(),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            var result = responseData;
                            Ext.getCmp('nfSueldoCargo').enable();
                            Ext.getCmp('nfSueldoCargo').setValue(result);
                        }
                    });
                }
            } else {
                var aux = 0;
            }
        }
        function ActivarImporteGrupoEscala() {
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/configelementosalarialcargo/buscarImporteSalarioEscala',
                method: 'POST',
                params: {
                    idcargo: vista.gpTipoNomina.getSelectionModel().getSelected().get('_id')},
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var result = responseData;
                          vista.tfGrupoEscala.setValue(responseData.grupoescala);
                       // vista.cbGrupoEscala.setValue(responseData.grupoescala);
                    vista.nfSueldoCargo.setValue(responseData.salario);
                }
            });
        }
        function ActivarImporteGrupoEscalaSectorSalarial() {
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/configelementosalarialcargo/buscarImporteSalarioEscalaSectorsalarial',
                method: 'POST',
                params: {idgrupoescala: vista.cbGrupoEscala.getValue(),
                    denom: vista.cbGrupoEscala.getRawValue(),
                    idsectorsalarial: vista.cbSector.getValue()},
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var result = responseData;
                    vista.nfSueldoCargo.setValue(responseData.salario);
                    vista.nfSueldoCargo.disable();
                }
            });
        }

        function ActivarImporteSalarioEspecifico() {
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/configelementosalarialcargo/buscarImporteSalarioEspecifico',
                method: 'POST',
                params: {idsalarioespecifico: vista.cbCargoSalarioEspecifico.getValue()},
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var resp = responseData;
                    // vista.tfGrupoEscala.setValue(responseData.grupoescala);
                    vista.nfSueldoCargo.disable();
                    vista.nfSueldoCargo.readOnly = true;
                    vista.nfSueldoCargo.setValue(resp.salario);
                    vista.btnAceptarTipoN.show();
                }
            });
        }
//        function ActivarImporteCargoSalarioEspSectorSalarial() {
//            Ext.Ajax.request({
//                url: '/pvd/nomina/index.php/configelementosalarialcargo/cargarCargoSalarioEspecifico',
//                method: 'POST',
//                params: {
//                    idsectorsalarial: vista.cbSector.getValue()},
//                callback: function (options, success, response) {
//                    responseData = Ext.decode(response.responseText);
//                    var result = responseData;
//                }
//            });
//        }

        /*
         *Función de mostrar la ventana de modificar tipos de nómina.
         */
        function mostrarVentanaModificarTipoN() {
           //vista.checkTodosCargos.setValue(false);
           modelo.storePeriodoPago.load();
           modelo.storeEscalaSueldoCargo.load();
            vista.cbEscalaSueldoCargo.enable();
            vista.cbSistemaPago.focus(true, 500);
            var idelementosalarial = vista.gpTipoNomina.getSelectionModel().getSelected().get('idelementosalarialcargo');
            vista.ventanaTipoN.show();
         if (idelementosalarial == null) {
                idelementosalarial = null;
            } else {
                if (vista.idtipo == 7) {
                    vista.ventanaTipoN.setTitle(idioma.lbTitleVentModificarTipoN);
                    vista.btnAplicarTipoN.hide();
                    vista.ventanaTipoN.show();
                    //Actualizar la tabulación deL formulario.
                    vista.btnCancelarTipoN.setNextElement('idbtnAceptarTipoN');
                    vista.btnAceptarTipoN.setPreviousElement('idbtnCancelarTipoN');
                    vista.formularioTipoN.getForm().loadRecord(vista.gpTipoNomina.getSelectionModel().getSelected());
                    variablesTipoN.accion = 'Mod';
                    var sistemapago = vista.gpTipoNomina.getSelectionModel().getSelected().get('sistemapago');
                    vista.cbSistemaPago.setValue('');
                    vista.cbSistemaPago.setValue(sistemapago);
                    sistemapago = "";
                }
                var escala = Ext.getCmp('idcbEscalaSueldoCargo').getValue();

                if (escala == 1) {
                    Ext.getCmp('nfSueldoCargo').setValue(vista.gpTipoNomina.getSelectionModel().getSelected().get('importe'));
                    vista.tfGrupoEscala.setValue(vista.gpTipoNomina.getSelectionModel().getSelected().get('grupoescala'));
                    vista.nfSueldoCargo.disable();
                } else if (escala == 2) {
                    vista.cbGrupoEscala.setValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.idgrupoescala);
                    vista.cbGrupoEscala.setRawValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.grupoescala);
                    vista.cbGrupoEscala.enable();
                    vista.cbSector.setValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.idsectorsalarial);
                    vista.cbSector.setRawValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.sectorsalarial);
                    vista.nfSueldoCargo.setValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.importe);
                    vista.nfSueldoCargo.disable();
                }else if (escala == 3){
                    vista.cbSector.setValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.idsectorsalarial);
                    vista.cbSector.setRawValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.sectorsalarial);
                    vista.cbGrupoEscala.disable();
                   // vista.cbCargoSalarioEspecifico.enable();
                    vista.cbSector.enable();
                   // vista.cbCargoSalarioEspecifico.setValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.idsalarioespecifico);
                   // vista.cbCargoSalarioEspecifico.setRawValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.denominacioncargo);
                    vista.nfSueldoCargo.disable();
                    vista.nfSueldoCargo.setValue(vista.gpTipoNomina.getSelectionModel().getSelected().data.importe);
                    vista.tfGrupoEscala.disable();
                }

            }
        }

        /*
        *Función para sincronizar un tipo de pago.
        */
        function sincronizarTipoNomina() {
            var selections = vista.gpTipoNomina.getSelections();

            var arrayidcargos = new Array();
            var arrayidelementos = new Array();
            var arraysalario = new Array();

            for (var i = 0; i < selections.length; i++) {                
                arrayidcargos.push(selections[i]['data']['_id']);
                arrayidelementos.push(selections[i]['data']['idelementosalarialcargo']);
                arraysalario.push(selections[i]['data']['importe']);
            }
            
            if (selections.length > 0) {
                PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, "Sincronizandodatos de tipo elemento salarial");
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/configelementosalarialcargo/sincronizarConfigElementoSalarial',
                    method: 'POST',
                    params: {
                        idcargo: Ext.encode(arrayidcargos),
                        idelementosalarial: Ext.encode(arrayidelementos),
                        salario : Ext.encode(arraysalario),
                    },
                    callback: function (options, success, response) {
                        //Se oculta la máscara de espera.
                        PVD.ocultarMascara('idmaskeleminartipopago');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg > 0) {
                            //Mostrando el mensaje de que se ha el tipo de nómina.
                            mostrarMensaje(1, "El elementos salariales al cargo se ha sincronizado", function (btn) {
    
                            });
                            //Recargando el grid de tipos de nómina.
                            vista.gpTipoNomina.getStore().removeAll();
                            vista.gpTipoNomina.getStore().load({params: {flag: 1}});
                            vista.pconceptosescala.gpConcepto.getStore().removeAll();
                            vista.pconceptosescala.gpConcepto.getStore().load();
                        } else {
                            if (responseData.codMsg == 0)
                                mostrarMensaje(responseData.codMsg, "Los elementos salariales al cargo se encuentran sincronizado");
                        }
                    }
                });
                
            } else{
                mostrarMensaje(2, 'Datos vacios, Seleccione al menos un elemento salarial.');
            }
        }


        /*
         *Función para adicionar/modificar un tipo de pago.
         */
        function salvarFormularioTipoN(boton) {
            var selections = vista.gpTipoNomina.getSelections();

            var arrayidcargos = new Array();
            var arrayidelementos = new Array();
            var idcargo = vista.gpTipoNomina.getSelectionModel().getSelected().get('_id');
            var idelementosalarial = vista.gpTipoNomina.getSelectionModel().getSelected().get('idelementosalarialcargo');
            var urlAction = '/pvd/nomina/index.php/configelementosalarialcargo/adicionarConfigElementoSalarial';
            var idtiponomina = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarTipoN;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTipoN;


            if(selections.length > 1 && vista.cbEscalaSueldoCargo.getValue() != 1)
            {
                mostrarMensaje(3, idioma.lbMsgModificarVariosTipoN, function (btn) {

                });
            }
            else {

                for (var i = 0; i < selections.length; i++) {
                    arrayidcargos.push(selections[i]['data']['_id']);
                    arrayidelementos.push(selections[i]['data']['idelementosalarialcargo']);
                }

                if (variablesTipoN.accion == 'Mod') {
                    lbMsgEspera = idioma.lbMsgModificarTipoN;
                    lbMsgExito = idioma.lbMsgCorrectoModificadoTipoN;
                    urlAction = '/pvd/nomina/index.php/configelementosalarialcargo/modificarConfigElementoSalarial';

                }
                if (variablesTipoN.cambio == 0) {
                    if (variablesTipoN.accion == 'Mod') {
                        //Se oculta la ventana si no ha sido modificado ningún valor.
                        vista.ventanaTipoN.hide();
                    } else {
                        //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                        vista.tfDenomTipoN.markInvalid(idioma.lbErrorCampoVacio);
                        mostrarMensaje(3, idioma.lbErrorFormulario);
                    }
                } else {
                    //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                    var idsistemap
                    if (vista.formularioTipoN.getForm().isValid()) {
                        var idsistemapagbool = vista.cbSistemaPago.getValue();
                        if (isNaN(idsistemapagbool)) {
                            idsistemap = vista.gpTipoNomina.getSelectionModel().getSelected().get('idsistemapago');
                        } else {
                            idsistemap = idsistemapagbool;
                        }
                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtipopago', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);
                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url: urlAction,
                            method: 'POST',
                            params: {
                                idelementosalarial: Ext.encode(arrayidelementos), idsistpago: idsistemap,
                                idperiodopago: vista.cbPeriodoPago.getValue(),
                                idgrupoescala: vista.tfGrupoEscala.getValue(),
                                idcbgrupoescala: vista.cbGrupoEscala.getValue(),
                                idsector: vista.cbSector.getValue(),
                                tiposalarioescala: variablesTipoN.tiposalario,
                                idescalasueldocargo: vista.cbEscalaSueldoCargo.getValue(),
                              //  idsalarioespecifico: vista.cbCargoSalarioEspecifico.getValue(),
                                importe: vista.nfSueldoCargo.getValue(),
                                fechainicio: vista.dfFInicioTipoN.getRawValue(),
                                fechafin: vista.dfFFinTipoN.getRawValue(),
                                idcargo: Ext.encode(arrayidcargos),
                                todoscargos: vista.checkTodosCargos.getValue()
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtipopago');

                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(1, lbMsgExito, function () {
                                        if (!boton) {
                                            vista.ventanaTipoN.hide();

                                        } else {
                                            vista.tfDenomTipoN.focus(true, 500);
                                        }
                                        vista.formularioTipoN.getForm().reset();
                                        vista.gpTipoNomina.getStore().removeAll();
                                        vista.gpTipoNomina.getStore().load({params: {flag: 1, cargararbol: 1}});
                                        variablesTipoN.cambio = 0;
                                        vista.btnEliminarTipoN.disable();
                                        vista.btnAdicionarTipoN.disable();
                                        vista.btnModificarTipoN.disable();
                                        vista.cbSector.disable();
                                       // vista.cbCargoSalarioEspecifico.disable();

                                    });

                                } else {
                                    if (responseData.codMsg)
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                            }
                        });

                    } else {
                        mostrarMensaje(3, idioma.lbErrorFormulario);
                    }
                }
            }

        }

        /*
         *Función para eliminar un tipo de pago.
         */
        function eliminarTipoNomina() {
            var selections = vista.gpTipoNomina.getSelections();
            var arrayidelemtossalariales = new Array();
            for (var i = 0; i < selections.length; i++) {
                arrayidelemtossalariales.push(selections[i]['data']['idelementosalarialcargo']);
            }
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTipoN, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipoN);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/configelementosalarialcargo/eliminarConfigElementoSalarial',
                        method: 'POST',
                        params: {idelementosalarial: Ext.encode(arrayidelemtossalariales)},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTipoN, function (btn) {

                                });
                                //Recargando el grid de tipos de nómina.
                                vista.gpTipoNomina.getStore().removeAll();
                                vista.gpTipoNomina.getStore().load({params: {flag: 1}});
                                vista.pconceptosescala.gpConcepto.getStore().removeAll();
                                vista.pconceptosescala.gpConcepto.getStore().load();
                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, "Hay elementos salariales al cargo que no se pueden eliminar ya que estan siendo usados");
                            }
                        }
                    });
                }

            });
        }
        /*
         *Función para exportar reporte de elementos salariales al cargo no configurados.
         */
        function exportarReporteElemSalarialesCargoNoConfigurado() {
             var selections = vista.gpTipoNomina.getSelectionModel().getSelected().id;

             // var arrayidestructura = new Array();
             // for (var i = 0; i < selections.length; i++) {
             //     console.info(selections[i]);
             //     arrayidestructura.push(selections[i]['id']);
             // }
            //console.info(arrayidestructura);
            //Mostrando el mensaje para aceptar el eliminar.
            // mostrarMensaje(2, idioma.lbTitleEliminarTipoN, function (btn) {
            //     if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    //PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipoN);
                    //Enviando los datos al servidor.
         window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/configelementosalarialcargo/exportarReportgElementoSalarial?idestructura=' + selections);
         //            Ext.Ajax.request({
         //                url: '/pvd/nomina/index.php/configelementosalarialcargo/exportarReportgElementoSalarial',
         //                method: 'POST',
         //                params: {idestructura:selections},
         //                callback: function (options, success, response) {
         //                    //Se oculta la máscara de espera.
         //                    PVD.ocultarMascara('idmaskeleminartipopago');
         //                    responseData = Ext.decode(response.responseText);
         //                    // if (responseData.codMsg == 1) {
         //                    //     //Mostrando el mensaje de que se ha el tipo de nómina.
         //                    //     // mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTipoN, function (btn) {
         //                    //     //
         //                    //     // });
         //                    //     //Recargando el grid de tipos de nómina.
         //                    //     // vista.gpTipoNomina.getStore().removeAll();
         //                    //     // vista.gpTipoNomina.getStore().load({params: {flag: 1}});
         //                    //     // vista.pconceptosescala.gpConcepto.getStore().removeAll();
         //                    //     // vista.pconceptosescala.gpConcepto.getStore().load();
         //                    // } else {
         //                    //     if (responseData.codMsg)
         //                    //         mostrarMensaje(responseData.codMsg, "Hay elementos salariales al cargo que no se pueden eliminar ya que estan siendo usados");
         //                    // }
         //                }
         //            });
               }

            // });
        // }

    }
};


UCID.portal.cargarEtiquetas('configelementosalarialcargo', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    variablesGlobales.perfil = arguments[0];

    var modelo = Pvd.Nomina.ElementoSalarialCargo.ConfigElementoSalarialCargo.Modelo;
    modelo.init(idioma);

    //Inicializando la vista.
    var vista = Pvd.Nomina.ElementoSalarialCargo.ConfigElementoSalarialCargo.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.ElementoSalarialCargo.ConfigElementoSalarialCargo.Controlador.init(idioma, vista, modelo);

});

