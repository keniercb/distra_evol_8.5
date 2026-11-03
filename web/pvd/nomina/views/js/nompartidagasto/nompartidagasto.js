Ext.ns('Pvd.Nomina.Nomencladores.NomPartidagasto');

Pvd.Nomina.Nomencladores.NomPartidagasto.Panel = Ext.extend(Ext.Panel, {
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

        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomPartidagasto_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomPartidagasto_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomPartidagasto_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralPartidagasto];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomPartidagasto.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storePartidaG.load({params: {limit: 20, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        }
    }
});

//Modelo de la vista del Nomenclador de partidas de pago.
var Pvd_Nomina_Nomencladores_NomPartidagasto_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado de tipos de conceptos de percepciones y descuentos.
        /*this.storePartidaG = new Ext.data.Store({
         url: '/pvd/nomina/index.php/nompartidagasto/obtenerListadoPartidaGasto',
         reader:new Ext.data.JsonReader(
         {totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idpartidagasto" },
         [ 	 {name: 'idpartidagasto'}
         ,{name: 'denominacion'}
         ,{name: 'fechainicio'}
         ,{name: 'fechafin'}
         ,{name: 'descripcion'}
         ,{name: 'idtipopartidagasto'}
         ])
         });*/

        this.storePartidaG = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/nompartidagasto/obtenerListadoPartidaGasto',
            //groupField:'nomenclador',
            sortInfo: {field: 'nomenclador', direction: "DESC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idnivelactiveconom"},
                [
                    {name: 'idnivelactiveconom'},
                    {name: 'denominacion'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'descripcion'},
                    //{name: 'idtipopartidagasto'},
                    {name: 'nomenclador'}

                ])
        });


        this.storeTipoPartidagastos = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nompartidagasto/obtenerTipoPartidagasto',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idtipopartidagasto"},
                [{name: 'idtipopartidagasto'}, {name: 'denominacion'}
                ])
        });
    }
};

//Vista del componente Nomenclador de de partidas de pago.
var Pvd_Nomina_Nomencladores_NomPartidagasto_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de conceptos
     *  de percepciones y descuentos (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado de tipos de conceptos de percepciones y descuentos.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderPartidaG = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smPartidaG = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpPartidaG = new Ext.grid.GridPanel({
            id: 'idgpPartidaG',
            title: idioma.lbTitlePartidaG,
            region: 'center',
            columns: [{
                header: 'idnivelactiveconom',
                hidden: true,
                hideable: false,
                dataIndex: 'idnivelactiveconom'
            }, this.expanderPartidaG, {
                header: idioma.lbColDenominacion,
                width: 500,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: 'Nomenclador',
                hidden: true,
                hideable: false,
                width: 500,
                sortable: true,
                dataIndex: 'nomenclador'
            }, {
                header: '<center>' + idioma.lbColDesde + '</center>',
                width: 90,
                sortable: true,
                dataIndex: 'fechainicio',
                renderer: centrarValor
            }, {
                header: '<center>' + idioma.lbColHasta + '</center>',
                width: 90,
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

            store: modelo.storePartidaG,
            sm: this.smPartidaG,
            plugins: this.expanderPartidaG,
            loadMask: {msg: idioma.lbMaskGridCargando},
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storePartidaG,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de conceptos de percepciones y descuentos.
        this.btnAdicionarPartidaG = new Ext.Button({
            id: 'btnAddPartidaG',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddPartidaG,
            iconCls: 'adicionar',
            prevTab: 'btnAyudaPartidaG',
            nextTab: 'btnModPartidaG'
        });

        this.btnModificarPartidaG = new Ext.Button({
            id: 'btnModPartidaG',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModPartidaG,
           // icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddPartidaG',
            nextTab: 'btnElimPartidaG'
        });

        this.btnEliminarPartidaG = new Ext.Button({
            id: 'btnElimPartidaG',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimPartidaG,
          //  icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModPartidaG',
            nextTab: 'btnAyudaPartidaG'
        });

        this.btnAyudaPartidaG = new Ext.Button({
            id: 'btnAyudaPartidaG',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaPartidaG,
           // icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimPartidaG',
            nextTab: 'btnAddPartidaG'
        });

        //Panel contenedor general del grid de tipos de conceptos de percepciones y descuentos. 
        this.panelCentralPartidagasto = new Ext.Panel({
            id: 'idpanelCentralPartidagasto',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarPartidaG, this.btnModificarPartidaG, this.btnEliminarPartidaG, '->', this.btnAyudaPartidaG],
            items: [this.gpPartidaG]
        });

        //Campos del formulario de tipos de conceptos de percepciones y descuentos.
        this.tfDenomPartidaG = new Ext.form.TextField({
            id: 'idtfDenomPartidaG', fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarPartidaG',
            //regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText: idioma.lbDenomIncorr, //maskRe
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100
        });
        //this.cbTipoPartidagasto = new Ext.form.ComboBox({id: 'idcbTipoPartidagasto', fieldLabel: 'Tipo de partida de gastos',
        //                                tabIndex:3 ,
        //                                valueField: 'idtipopartidagasto',
        //                                displayField: 'denominacion',
        //                                hiddenName: 'idtipopartidagasto',
        //                                allowBlank: false, mode: 'local',
        //                                store: modelo.storeTipoPartidagastos,
        //                                emptyText: 'Seleccione...',
        //                                blankText: idioma.lbErrorCampoVacio, readOnly: true,
        //                                triggerAction: 'all', anchor: '99%'
        //                            });

        this.dfFInicioPartidaG = new Ext.form.DateField({
            id: 'iddfFInicioPartidaG', fieldLabel: idioma.lbColDesde,
            tabIndex: 4, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinPartidaG'
        });

        this.dfFFinPartidaG = new Ext.form.DateField({
            id: 'iddfFFinPartidaG', fieldLabel: idioma.lbColHasta,
            tabIndex: 5, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioPartidaG'
        });

        this.tfDescripPartidaG = new Ext.form.TextArea({
            id: 'idtfDescripPartidaG',
            fieldLabel: idioma.lbColDescripcion, tabIndex: 6,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'iddfFFinPartidaG', nextTab: 'idbtnCancelarPartidaG',
            blankText: idioma.lbErrorCampoVacio
        });

        //Formulario de tipos de conceptos de percepciones y descuentos.
        this.formularioPartidaG = new Ext.FormPanel({
            id: 'idformlarioPartidaG',
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .99, layout: 'form', items: [this.tfDenomPartidaG]}
                    //{columnWidth:.99, layout: 'form', items: [this.cbTipoPartidagasto]},
                ]
            }, {
                layout: 'column',
                items: [
                    {columnWidth: .54, layout: 'form', items: [this.dfFInicioPartidaG]},
                    {columnWidth: .46, layout: 'form', items: [this.dfFFinPartidaG]}
                ]
            },
                this.tfDescripPartidaG
            ]
        });

        //Botones de la ventana de tipos de conceptos de percepciones y descuentos.
        this.btnCancelarPartidaG = new Ext.Button({
            id: 'idbtnCancelarPartidaG',
            iconCls: 'cancelar',
            icon: perfil.dirImg + 'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripPartidaG',
            nextTab: 'idbtnAplicarPartidaG'
        });

        this.btnAplicarPartidaG = new Ext.Button({
            id: 'idbtnAplicarPartidaG',
            iconCls: 'aplicar',
            //icon: perfil.dirImg + 'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarPartidaG',
            nextTab: 'idbtnAceptarPartidaG'
        });

        this.btnAceptarPartidaG = new Ext.Button({
            id: 'idbtnAceptarPartidaG',
            iconCls: 'aceptar',
           // icon: perfil.dirImg + 'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarPartidaG',
            nextTab: 'idtfDenomPartidaG'
        });

        //Ventana de adicionar y modificar tipos de conceptos de percepciones y descuentos.
        this.ventanaPartidaG = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            autoValidate: true,
            validateDefault: true,
            items: [this.formularioPartidaG],
            buttons: [this.btnCancelarPartidaG, this.btnAplicarPartidaG, this.btnAceptarPartidaG],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarPartidaG.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarPartidaG.handler();
                    }
                },{
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarPartidaG.handler();
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de de partidas de pago.
var Pvd_Nomina_Nomencladores_NomPartidagasto_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de conceptos de percepciones y descuentos.
     * (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de conceptos de percepciones y descuentos.
     * (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var vista = vista;
        /**
         *Variables generales.
         */
        var variablesPartidaG = {
            accion: 'Add',
            cambio: 0
        };
        modelo.storeTipoPartidagastos.load();
        //Eventos del grid de tipos de conceptos de percepciones y descuentos.
        vista.gpPartidaG.on('rowdblclick', function (e) {
            mostrarVentanaModificarPartidaG();
        });

        vista.gpPartidaG.on('destroy', function (e) {
            vista.ventanaPartidaG.destroy();
        });

        //Eventos del store de tipos de conceptos de percepciones y descuentos.
        modelo.storePartidaG.on('beforeload', function (store) {
            vista.btnModificarPartidaG.disable();
            vista.btnEliminarPartidaG.disable();
            store.removeAll();
        });

        modelo.storePartidaG.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de tipos de conceptos de percepciones y descuentos.
        vista.smPartidaG.on('rowselect', function () {
            vista.btnModificarPartidaG.enable();
            vista.btnEliminarPartidaG.enable();
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomPartidaG.on('change', function (tf, n, o) {
            variablesPartidaG.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioPartidaG.on('change', function (tf, n, o) {
            variablesPartidaG.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinPartidaG.on('change', function (tf, n, o) {
            variablesPartidaG.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripPartidaG.on('change', function (tf, n, o) {
            variablesPartidaG.cambio = 1;
        });

        //Eventos del botón adicionar tipos de conceptos de percepciones y descuentos.
        vista.btnAdicionarPartidaG.setHandler(function () {
            mostrarVentanaAdicionarPartidaG();
        });

        //Eventos del botón modificar tipos de conceptos de percepciones y descuentos.
        vista.btnModificarPartidaG.setHandler(function () {
            mostrarVentanaModificarPartidaG();
        });

        //Eventos del botón eliminar tipos de conceptos de percepciones y descuentos.
        vista.btnEliminarPartidaG.setHandler(function () {
            eliminarPGasto();
        });



        //Eventos del botón cancelar tipos de conceptos de percepciones y descuentos.
        vista.btnCancelarPartidaG.setHandler(function () {
            vista.ventanaPartidaG.hide();
        });

        //Eventos del botón aplicar tipos de conceptos de percepciones y descuentos.
        vista.btnAplicarPartidaG.setHandler(function () {
            salvarFormularioPartidaG(true);
        });

        //Eventos del botón aceptar tipos de conceptos de percepciones y descuentos.
        vista.btnAceptarPartidaG.setHandler(function () {
            salvarFormularioPartidaG(false);
        });

        //Evento de la ventana de adicionar/modificar tipos de conceptos de percepciones y descuentos.
        vista.ventanaPartidaG.on('beforeshow', function (ventana) {
            vista.formularioPartidaG.getForm().reset();
            vista.tfDenomPartidaG.focus(true, 500);
        });

        /*
         *Función de mostrar la ventana de adicionar tipos de conceptos de percepciones y descuentos.
         */
        function mostrarVentanaAdicionarPartidaG() {
            vista.ventanaPartidaG.setTitle(idioma.lbTitleVentAdicionarPartidaG);
            vista.btnAplicarPartidaG.show();
            vista.ventanaPartidaG.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarPartidaG.setNextElement('idbtnAplicarPartidaG');
            vista.btnAceptarPartidaG.setPreviousElement('idbtnAplicarPartidaG');
            variablesPartidaG.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar tipos de conceptos de percepciones y descuentos.
         */
        function mostrarVentanaModificarPartidaG() {
            vista.ventanaPartidaG.setTitle(idioma.lbTitleVentModificarPartidaG);
            vista.btnAplicarPartidaG.hide();
            vista.ventanaPartidaG.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarPartidaG.setNextElement('idbtnAceptarPartidaG');
            vista.btnAceptarPartidaG.setPreviousElement('idbtnCancelarPartidaG');
            vista.formularioPartidaG.getForm().loadRecord(vista.smPartidaG.getSelected());
            variablesPartidaG.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un tipo de concepto de percepciones y descuentos.
         */
        function salvarFormularioPartidaG(boton) {

            var urlAction = '/pvd/nomina/index.php/nompartidagasto/adicionarPartidaGasto';
            var idtipoconceptopd = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarPartidaG;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoPartidaG;

            if (variablesPartidaG.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarPartidaG;
                lbMsgExito = idioma.lbMsgCorrectoModificadoPartidaG;
                urlAction = '/pvd/nomina/index.php/nompartidagasto/modificarPartidaGasto';
                idtipoconceptopd = vista.smPartidaG.getSelected().get('idnivelactiveconom');
            }
            if (variablesPartidaG.cambio == 0) {
                if (variablesPartidaG.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaPartidaG.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomPartidaG.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioPartidaG.getForm().isDirty()) {
                    if (vista.formularioPartidaG.getForm().isValid()) {

                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtconceptopd', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url: urlAction,
                            method: 'POST',
                            params: {
                                idpartidagasto: idtipoconceptopd,
                                denominacion: vista.tfDenomPartidaG.getValue(),
                                fechainicio: vista.dfFInicioPartidaG.getRawValue(),
                                fechafin: vista.dfFFinPartidaG.getRawValue(),
                                descripcion: vista.tfDescripPartidaG.getValue()
                                //idtipopartidagasto : vista.cbTipoPartidagasto.getValue()
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtconceptopd');

                                if (responseData.codigo == 1) {
                                    mostrarMensaje(1, lbMsgExito);
                                    if (!boton) {
                                        vista.ventanaPartidaG.hide();

                                    } else {
                                        vista.tfDenomPartidaG.focus(true, 500);
                                    }
                                    vista.formularioPartidaG.getForm().reset();
                                    modelo.storePartidaG.removeAll();
                                    modelo.storePartidaG.load({params: {limit: 20, start: 0}});
                                    variablesPartidaG.cambio = 0;


                                } else {
                                    if (responseData.codigo)
                                        mostrarMensaje(3, responseData.mensaje);
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
         *Función para eliminar un tipo de concepto de percepciones y descuentos.
         */
        function eliminarPGasto() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarPartidaG, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarPartidaG', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarPartidaG);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nompartidagasto/eliminarPartidaGasto',
                        method: 'POST',
                        params: {idnivelactiveconom: vista.gpPartidaG.getSelectionModel().getSelected().get('idnivelactiveconom')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarPartidaG');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de concepto de percepciones y descuentos.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoPartidaG);
                                //Recargando el grid de tipos de conceptos de percepciones y descuentos.
                                modelo.storePartidaG.load({params: {limit: 20, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorConceptoPDUso);
                            }
                        }
                    });
                }
            });
        }

        /**
         *Teclas calientes de la interfaz.
         */
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 73:
                    { //i para adicionar.
                        if (!vista.btnAdicionarPartidaG.disabled && !vista.ventanaPartidaG.isVisible()) {
                            mostrarVentanaAdicionarPartidaG();
                        }
                        break;
                    }
                    case 77:
                    { //m para modificar .
                        if (!vista.btnModificarPartidaG.disabled && !vista.ventanaPartidaG.isVisible()) {
                            mostrarVentanaModificarPartidaG();
                        }
                        break;
                    }
                    case 72:
                    { //h para ayuda.
                        if (!vista.ventanaPartidaG.isVisible()) {
                            vista.btnAyudaPartidaG.focus();
                            vista.btnAyudaPartidaG.fireEvent('click');
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar.
            fn: function () {
                if (!vista.btnEliminarPartidaG.disabled && !vista.ventanaPartidaG.isVisible()) {
                    eliminarPGasto();
                }
            }
        }, {
            key: 13,//enter para aceptar.
            fn: function () {
                if (vista.btnAceptarPartidaG.isVisible()) {
                    vista.btnAceptarPartidaG.focus();
                    vista.btnAceptarPartidaG.fireEvent('click');
                }
            }
        }]);
    }
};

variablesGlobales.nompartidagasto_js = 1;
