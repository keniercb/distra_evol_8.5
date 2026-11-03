Ext.ns('Pvd.Nomina.Configuracion.Modulos');

Pvd.Nomina.Configuracion.Modulos.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Configuracion_Modulos_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Configuracion_Modulos_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Configuracion_Modulos_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralModulo];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Configuracion.Modulos.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                // this.modelo.storeModulos.load({params: {limit: 20, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {

        },
    },
});

var Pvd_Nomina_Configuracion_Modulos_Modelo = function () {
    this.init = function () {

        this.storeModulos = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerListadoModulos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idmodulo"},
                [
                    {name: 'idmoduloentidad'},
                    {name: 'identificador'},
                    {name: 'denominacion'},
                    {name: 'cobroypago'},
                    {name: 'apertura'},
                    {name: 'parrafofiscal'},
                    {name: 'fijaretencionesporpagar'},
                    {name: 'tabla'}
                ])
        });

        //Tipo dato
        this.storeTiposModulos = new Ext.data.SimpleStore({
            fields: [{name: 'idtipomodulo'}, {name: 'modulo'}]
        });
        var data = [[0, "persona"], [1, "asistencia"], [2, "nomina"], [3, "seleccion"], [3, "evaluacion"]];
        this.storeTiposModulos.loadData(data);
    }
};

var Pvd_Nomina_Configuracion_Modulos_Vista = function () {
    this.init = function (perfil, idioma, modelo) {
        /**Variables y funciones*/
        var self = this;

        function centrarVal(val) {
            return "<center>" + val + "</center>";
        }

        function imagenActivo(val) {
            if (val == 0) {
                return '<center><img src="/pvd/nomina/views/images/no.gif" height=16 width=16 title="No"/></center>';
            } else {
                return '<center><img src="/pvd/nomina/views/images/si.gif" height=16 width=16 title="Si"/></center>';
            }
        };

        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar'
        });

        //Vista para el componente Buscar estructura
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            constrain: true,
            closable: true,
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
        /**Panel incluido en el viewport**/
        //Grid
        this.smModulos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });
        this.gpModulos = new Ext.grid.GridPanel({
            id: 'gpModulos',
            title: idioma.lbTitleModulos,
            region: 'center',
            columns: [
                this.smModulos,
                {header: 'idmoduloentidad', hidden: true, hideable: false, dataIndex: 'idmoduloentidad'},
                {
                    header: '<center>' + idioma.lbColIdentificador + '</center>',
                    width: 80,
                    sortable: true,
                    dataIndex: 'identificador',
                },
                {
                    header: '<center>' + idioma.lbColDenominacion + '</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominacion',
                },
                {
                    header: '<center>Postea Comprobantes</center>',
                    width: 50,
                    sortable: true,
                    dataIndex: 'apertura',
                    renderer: imagenActivo
                },
                {
                    header: '<center>' + idioma.lbColCobroyPago + '</center>',
                    width: 50,
                    sortable: true,
                    dataIndex: 'cobroypago',
                    renderer: imagenActivo
                },
                {
                    header: '<center>Fija retenciones por pagar</center>',
                    width: 50,
                    sortable: true,
                    dataIndex: 'fijaretencionesporpagar',
                    renderer: imagenActivo
                }
            ],
            clicksToEdit: 1,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeModulos,
            sm: this.smModulos,
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeModulos,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones
        this.btnAdicionarModulo = new Ext.Button({
            id: 'btnAdicionarModulo',
            text: idioma.lbBtnAdicionarModulos,
            tooltip: idioma.textToolTipAddModulos,
            iconCls: 'adicionar'
        });
        this.btnModificarModulo = new Ext.Button({
            id: 'btnModificarModulo',
            text: idioma.lbBtnModificarModulos,
            tooltip: idioma.textToolTipModModulos,
            iconCls: 'modificar'
        });
        this.btnEliminarModulo = new Ext.Button({
            id: 'btnEliminarModulo',
            text: idioma.lbBtnEliminarModulos,
            tooltip: idioma.textToolTipElimModulos,
            iconCls: 'eliminar'
        });
        this.btnAyudaModulo = new Ext.Button({
            id: 'btnAyudaModulo',
            text: idioma.lbBtnAyudaModulos,
            tooltip: idioma.textToolTipAyudaModulos,
            iconCls: 'ayuda'
        });
        this.btnDenominacionEntidad = new Ext.Button({
            text: 'Entidad: ',
            handleMouseEvents: false
        });

        //Panel
        this.panelCentralModulo = new Ext.Panel({
            id: 'idpanelCentralModulo',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnDenominacionEntidad, '', '|', '', this.btnAdicionarModulo, this.btnModificarModulo, this.btnEliminarModulo, '->', this.btnAyudaModulo],
            items: [this.gpModulos],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarModulo.disabled) {
                            self.btnEliminarModulo.handler();
                        }
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarModulo.disabled) {
                            self.btnAdicionarModulo.handler();
                        }
                    }
                }, {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarModulo.disabled) {
                            self.btnModificarModulo.handler();
                        }
                    }
                }
            ]
        });

        /**Ventana de modulos**/
        //Campos
        this.tfDenomModulo = new Ext.form.TextField({
            id: 'idtfDenomModulo',
            fieldLabel: idioma.lbColDenominacion,
            name: 'denominacion',
            allowBlank: false,
            anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
        });
        this.cbIdModulo = new Ext.form.ComboBox({
            id: 'idcbIdModulo',
            fieldLabel: idioma.lbColIdentificador,
            anchor: '99%',
            triggerAction: 'all',
            valueField: 'idtipomodulo',
            displayField: 'modulo',
            hiddenName: 'idtipomodulo',
            allowBlank: false,
            mode: 'local',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            store: modelo.storeTiposModulos
        });
        this.chbCobroyPago = new Ext.form.Checkbox({
            id: 'idchbCobroyPago',
            fieldLabel: idioma.lbColCobroyPago,
            bottonAlign: 'center',
            name: 'cobroypago',
            anchor: '99%'
        });
        this.chbApertura = new Ext.form.Checkbox({
            id: 'idchbApertura',
            fieldLabel: 'Postea comprobantes',
            bottonAlign: 'center',
            name: 'apertura',
            anchor: '99%'
        });
        this.chbFijaRetencionesPorPagar = new Ext.form.Checkbox({
            id: 'chbFijaRetencionesPorPagar',
            fieldLabel: 'Fija retenciones por pagar',
            bottonAlign: 'center',
            name: 'fijaretencionesporpagar',
            anchor: '99%'
        });
        
        this.radioConfGeneral = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioConfGeneral',
            align: 'center',
            boxLabel: 'General',
            fieldLabel: 'Tipo de Configuración',
            name: 'formato',
            checked: true
        });

        this.radioConfPropia = new Ext.form.Radio({
            hideLabel: false,
            id: 'radioConfPropia',
            align: 'center',
            boxLabel: 'Propia',
            fieldLabel: 'Tipo de Configuración',
            name: 'formato'
        });

        //Formulario
        this.formularioModulo = new Ext.FormPanel({
            id: 'idformularioModulo',
            labelAlign: 'top',
            frame: true,
            width: 500,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 0px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .99, layout: 'form', items: [this.tfDenomModulo]},
                        {columnWidth: .99, layout: 'form', items: [this.cbIdModulo]},
                        {columnWidth: .33, layout: 'form', items: [this.chbApertura]},
                        {columnWidth: .33, layout: 'form', items: [this.chbCobroyPago]},
                        {columnWidth: .33, layout: 'form', items: [this.chbFijaRetencionesPorPagar]},
                        {columnWidth: .33, layout: 'form', items: [this.radioConfGeneral]},
                        {columnWidth: .33, layout: 'form', items: [this.radioConfPropia]}
                    ]
                }
            ]
        });

        //Botones
        this.btnCancelarModulo = new Ext.Button({
            id: 'idbtnCancelarModulo',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });
        this.btnAplicarModulo = new Ext.Button({
            id: 'idbtnAplicarModulo',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar
        });
        this.btnAceptarModulo = new Ext.Button({
            id: 'idbtnAceptarModulo',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        //Ventana
        this.ventanaModulo = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: false,
            width: 600,
            layout: 'fit',
            items: [this.formularioModulo],
            buttons: [this.btnCancelarModulo, this.btnAplicarModulo, this.btnAceptarModulo],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarModulo.disabled) {
                            self.btnAceptarModulo.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarModulo.disabled) {
                            self.btnCancelarModulo.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarModulo.disabled) {
                            self.btnAplicarModulo.handler();
                        }
                    }
                }
            ]
        });
    }
};

var Pvd_Nomina_Configuracion_Modulos_Controlador = function () {
    this.init = function (idioma, vista, modelo) {
        /**Variables*/
        var variablesModulo = {
            accion: 'Add',
            cambio: 0,
            identidad: -1,
            formato: 1
        };
        
        vista.radioConfGeneral.on('check', function (ch, checked) {
            if (checked == true)
                variablesModulo.formato = 1;
        });

        vista.radioConfPropia.on('check', function (ch, checked) {
            if (checked == true)
                variablesModulo.formato = 2;
        });

        vista.winEstEntidades.show();
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            if (nodo.attributes.tipoestructura == 3 || nodo.attributes.tipoestructura == 5) {
                variablesModulo.identidad = nodo.id;
                vista.btnAceptarEntidades.enable();
                //Pintando el nombre de la entidad en el tbar del panel general
                var r = (nodo.text).split("-");
                var entidad = (r.length == 2) ? r[1] : nodo.text;
                vista.btnDenominacionEntidad.setText('Entidad: <b style="color: #006600;">' + entidad + '</b>');
            } else {
                variablesModulo.identidad = null;
                vista.btnAceptarEntidades.disable();
            }
        });

        vista.btnAceptarEntidades.setHandler(function () {
            vista.panelCentralModulo.show();
            vista.winEstEntidades.hide();
            modelo.storeModulos.load({params: {identidad: variablesModulo.identidad, limit: 20, start: 0}});
        });

        /**Acciones de los elementos del Panel**/
        //Grid
        vista.gpModulos.on('rowdblclick', function (e) {
            mostrarVentanaModificarModulo();
        });
        vista.gpModulos.on('destroy', function (e) {
            vista.ventanaModulo.destroy();
        });
        vista.smModulos.on('rowselect', function () {
            var cantseleccionados = vista.smModulos.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarModulo.enable() : vista.btnModificarModulo.disable();
            (cantseleccionados > 0) ? vista.btnEliminarModulo.enable() : vista.btnEliminarModulo.disable();
        });
        vista.smModulos.on('rowdeselect', function () {
            var cantseleccionados = vista.smModulos.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarModulo.enable() : vista.btnModificarModulo.disable();
            (cantseleccionados > 0) ? vista.btnEliminarModulo.enable() : vista.btnEliminarModulo.disable();
        });
        modelo.storeModulos.on('beforeload', function (store) {
            vista.btnModificarModulo.disable();
            vista.btnEliminarModulo.disable();
            store.removeAll();
        });
        //Botones
        vista.btnCancelarModulo.setHandler(function () {
            vista.ventanaModulo.hide();
        });
        vista.btnAplicarModulo.setHandler(function () {
            salvarFormularioModulo(true);
        });
        vista.btnAceptarModulo.setHandler(function () {
            salvarFormularioModulo(false);
        });

        //Botones
        vista.btnAdicionarModulo.setHandler(function () {
            mostrarVentanaAdicionarModulo();
        });
        vista.btnModificarModulo.setHandler(function () {
            mostrarVentanaModificarModulo();
        });
        vista.btnEliminarModulo.setHandler(function () {
            eliminarModulo();
        });
        //Ventanas
        vista.ventanaModulo.on('beforeshow', function (ventana) {
            vista.formularioModulo.getForm().reset();
            vista.tfDenomModulo.focus(true, 500);
        });

        /**Funciones*/
        function mostrarVentanaAdicionarModulo() {
            vista.ventanaModulo.setTitle(idioma.lbTitleVentAdicionarModulos);
            vista.btnAplicarModulo.show();
            vista.ventanaModulo.show();
            variablesModulo.accion = 'Add';
            modelo.stOrganizaciones.load();
        }

        vista.chbApertura.on('check', function (cb, checked) {
            if (checked == false) {
                vista.chbCobroyPago.setValue(false);
            }
        });

        vista.chbCobroyPago.on('check', function (cb, checked) {
            if (checked == true) {
                vista.chbApertura.setValue(true);
            }
        });

        function mostrarVentanaModificarModulo() {
            var arrdatos = vista.smModulos.getSelected().data;
            vista.ventanaModulo.setTitle(idioma.lbTitleVentModificarModulos);
            vista.btnAplicarModulo.hide();
            vista.ventanaModulo.show();
            vista.tfDenomModulo.setValue(arrdatos['denominacion']);
            vista.cbIdModulo.setValue(arrdatos['identificador']);
            vista.chbCobroyPago.setValue(arrdatos['cobroypago']);
            vista.chbApertura.setValue(arrdatos['apertura']);
            vista.chbFijaRetencionesPorPagar.setValue(arrdatos['fijaretencionesporpagar']);

            //Modificando las variables
            variablesModulo.accion = 'Mod';
            modelo.stOrganizaciones.load();
        }

        function salvarFormularioModulo(boton) {
            var urlAction = '/pvd/nomina/index.php/confgeneral/adicionarModulos';
            var idmodulo = -1;
            if (variablesModulo.accion == 'Mod') {
                urlAction = '/pvd/nomina/index.php/confgeneral/modificarModulos';
                tabla = vista.smModulos.getSelected().data.tabla;
                var idmoduloentidad = vista.smModulos.getSelected().json.idmoduloentidad;
                if (variablesModulo.cambio == 0) {
                    vista.ventanaModulo.hide();
                }
            }

            //Se verifica si el formulario es válido
            if (vista.formularioModulo.getForm().isValid()) {
                PVD.mostrarMascara('idmaskaddmodmodulo', 'Espere por favor', 'Enviando datos...');
                Ext.Ajax.request({
                    url: urlAction,
                    method: 'POST',
                    params: {
                        tabla: tabla,
                        idmoduloentidad: idmoduloentidad,
                        identificador: vista.cbIdModulo.getRawValue(),
                        denominacion: vista.tfDenomModulo.getValue(),
                        cobroypago: (vista.chbCobroyPago.checked == true) ? 1 : 0,
                        apertura: (vista.chbApertura.checked == true) ? 1 : 0,
                        fijaretencionesporpagar: (vista.chbFijaRetencionesPorPagar.checked == true) ? 1 : 0,
                        identidad: variablesModulo.identidad,
                        formato: variablesModulo.formato
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddmodmodulo');

                        if (responseData == 'ok') {
                            mostrarMensaje(1, "El m&oacute;dulo se ha guardado satisfactoriamente.");
                        } else if (responseData == 'existe') {
                            mostrarMensaje(3, "El m&oacute;dulo que desea adicionar ya existe.");
                        } else {
                            mostrarMensaje(3, "No se pudo adicionar el m&oacute;dulo.");
                        }

                        if (!boton) {
                            vista.ventanaModulo.hide();
                        } else {
                            vista.tfDenomModulo.focus(true, 500);
                        }
                        vista.formularioModulo.getForm().reset();
                        modelo.storeModulos.removeAll();
                        modelo.storeModulos.load({params: {identidad: variablesModulo.identidad, limit: 20, start: 0}});
                        variablesModulo.cambio = 0;
                    }
                });
            } else {
                mostrarMensaje(3, 'El formulario contiene campos inv&aacute;lidos.');
            }

        }

        function eliminarModulo() {
            var seleccionados = vista.gpModulos.getSelectionModel().getSelections();
            var arridmodulo = new Array();
            Ext.each(seleccionados, function (value) {
                arridmodulo.push(value.data);
            });
            var msgconfirm = (seleccionados.length > 1) ? ' los m&oacute;dulos seleccionados?' : ' el m&oacute;dulo seleccionado?';
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar' + msgconfirm, function (boton) {
                if (boton == "ok") {
                    var urlAction = '/pvd/nomina/index.php/confgeneral/eliminarModulos';
                    PVD.mostrarMascara('idmaskdelmodulo', 'Espere por favor', 'Enviando datos...');
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            arridmodulo: Ext.encode(arridmodulo)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskdelmodulo');
                            var msg = (arridmodulo.length > 1) ? "Los m&oacute;dulos se han " : "El m&oacute;dulo se ha ";
                            var msgerror = (arridmodulo.length > 1) ? "Los m&oacute;dulos no se pudieron "
                                : "El m&oacute;dulo no se pudo ";
                            var msgerroruso = (arridmodulo.length > 1) ? " Est&aacute;n en uso." : " Est&aacute; en uso.";
                            if (responseData == 'ok') {
                                mostrarMensaje(1, msg + "eliminado satisfactoriamente.");
                            } else {
                                mostrarMensaje(3, msgerror + "eliminar." + msgerroruso);
                            }

                            modelo.storeModulos.load({params: {identidad: variablesModulo.identidad, limit: 20, start: 0}});
                            variablesModulo.cambio = 0;
                        }
                    });
                }
            });
        }
    }
};

variablesGlobales.confmodulos_js = 1;
