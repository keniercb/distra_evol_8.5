/**
 * @name componentes.CmpPieFirma - Componente para la configuración de las personas que aprueba o elaboran el registro de persona.
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Beatriz Selema Alvarez
 * @version 1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.CmpPieFirma = Ext.extend(Ext.Panel, {
    id           : 'pPieFirma',
    title        : 'Pie de firma',
    tabTip       : 'Pie de firma',
    layout       : 'fit',
    region       : 'center',
    height       : '100%',
    closable     : true,
    initComponent: function () {
        var self = this;


        var variables = {
            identidad          : null,
            denominacionentidad: '',
            iddocumento        : -1,
            iddocumentofirma   : -1,
            idpersona          : -1,
            idtipofirma        : -1,
            personaseleccionada: 0,
            nombrepersona      : '',
            idfirmadocumento   : -1,
            accion             : '',
            cambio             : 0
        };

        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel : 3
        });

        this.gpPersonas = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            /* heigth       : '50%',
             width        : '100%',*/
            split        : true,
            region       : 'center',
            funcionalidad: 'TODAS',
            modulo       : 'PERSONA',
            layout       : 'fit'


            //cantidadPorPaginas: 25
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id      : 'btnAceptarEntidades',
            text    : this.idioma.btnAceptar,
            tooltip : 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls : 'aceptar'
        });

        this.btnAceptarPersonas = new Ext.Button({
            id      : 'btnAceptarPersonas',
            text    : this.idioma.btnAceptar,
            tooltip : 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls : 'aceptar'
        });

        this.btnCancelarPersonas = new Ext.Button({
            id     : 'idbtnCancelarPersonas',
            iconCls: 'cancelar',
            text   : 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        //Vista para el componente Buscar estructura
        this.winEstEntidades = new Ext.Window({
            title    : 'Entidades',
            modal    : true,
            height   : 350,
            width    : '30%',
            closable : true,
            constrain: true,
            resizable: false,
            layout   : 'fit',
            items    : [this.pEstEntidades],
            buttons  : [this.btnAceptarEntidades],
            keys     : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptarEntidades.handler();
                    }
                }
            ]
        });

        this.winPersonas = new Ext.Window({
            title       : 'Personas',
            modal       : true,
            height      : 500,
            width       : '50%',
            closable    : false,
            constrain   : true,
            autoValidate: false,
            resizable   : true,
            layout      : 'fit',
            items       : [self.gpPersonas],
            buttons     : [self.btnCancelarPersonas, self.btnAceptarPersonas],
            keys        : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptarPersonas.handler();
                    }
                },
                {
                    key      : 'x',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnCancelarPersonas.disabled) {
                            self.btnCancelarPersonas.handler();
                        }
                    }
                }
            ]
        });


        this.winEstEntidades.show();


        //Store del listado de tipos de pagos
        this.stDocFirma = new Ext.data.GroupingStore({
            url       : '/pvd/maestro/configuraciones/index.php/confpiefirma/obtenerDocFirma',
            groupField: 'modulo',
            sortInfo  : {field: 'modulo', direction: "DESC"},
            reader    : new Ext.data.JsonReader(
                {totalProperty: "cantidad",
                    root      : "datos",
                    id        : "iddocumentofirma"
                },
                [
                    {name: 'iddocumentofirma'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'modulo'}
                ])
        });

        this.smDocFirma = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        //Grid panel de los periodos
        this.gpDocFirma = new Ext.grid.EditorGridPanel({
            store     : this.stDocFirma,
            region    : 'center',
            border    : true,
            loadMask  : {text: 'Cargando...'},
            width     : 300,
            columns   : [
                {header: 'iddocumentofirma', dataIndex: 'iddocumentofirma', width: 100, hidden: true},
                {header: 'Denominacion', dataIndex: 'denominacion', width: 100},
                {header: 'Modulo', dataIndex: 'modulo', width: 100}
            ],
            viewConfig: {
                forceFit: true
            },
            view      : new Ext.grid.GroupingView({
                forceFit    : true,
                groupTextTpl: '{text}'
            }),
            sm        : this.smDocFirma
        });


        /********************************GestionarConfDocFirma**********************************/

            //Botones de la ventana

        this.btnCancelarConfDoc = new Ext.Button({
            id     : 'idbtnCancelarPeriodo',
            iconCls: 'cancelar',
            text   : 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        this.btnAplicarConfDoc = new Ext.Button({
            id     : 'idbtnAplicarPeriodo',
            iconCls: 'aplicar',
            text   : 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',
        });

        this.btnAceptarConfDoc = new Ext.Button({
            id     : 'idbtnAceptarPeriodo',
            iconCls: 'aceptar',
            text   : 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)'
        });

        this.tfOrden = new Ext.form.NumberField({
            id        : 'idtfOrden',
            fieldLabel: 'Orden',
            name      : 'orden',
            anchor    : '70%',
            allowBlank: false,
            minValue  : 0,
            maxValue  : 100
        });

        //Store del listado de conceptos de percepciones y descuentos.
        this.storeConfDoc = new Ext.data.Store({
            url   : '/pvd/maestro/configuraciones/index.php/confpiefirma/obtenerTipoFirma',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idtipofirma"
            }, [
                {name: 'idtipofirma'}

                ,
                {name: 'tipofirma', mapping: 'denominacion'}

            ])
        });


        this.cbConfDoc = new Ext.form.ComboBox({
            fieldLabel   : 'Tipo de firma',
            anchor       : '100%',
            triggerAction: 'all',
            valueField   : 'idtipofirma',
            displayField : 'tipofirma',
            hiddenName   : 'tipofirma',
            name         : 'idtipofirma',
            allowBlank   : false,
            mode         : 'local',
            blankText    : 'Este campo es obligatorio.',
            readOnly     : true,
            store        : self.storeConfDoc
        });

        //Store del listado de conceptos de percepciones y descuentos.
        this.storePersona = new Ext.data.Store({
            //  url   : '/pvd/maestro/configuraciones/index.php/confpiefirma/obtenerTipoFirma',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idpersona"
            }, [
                {name: 'idpersona'}

                ,
                {name: 'persona'}

            ])
        });


        this.cbPersona = new Ext.form.ComboBox({
            fieldLabel   : 'Persona',
            anchor       : '100%',
            triggerAction: 'all',
            valueField   : 'idpersona',
            displayField : 'persona',
            hiddenName   : 'persona',
            name         : 'idpersona',
            allowBlank   : false,
            mode         : 'local',
            blankText    : 'Este campo es obligatorio.',
            readOnly     : true,
            store        : self.storePersona
        });


        //Formulario de grupos escalas.
        this.formularioConfDoc = new Ext.FormPanel({
            id        : 'idformularioConfDoc',
            labelAlign: 'top',
            frame     : true,
            width     : 440,
            height    : 140,
            layout    : 'form',
            bodyStyle : {
                padding: '10px 10px 10px 10px'
            },
            items     : [
                {
                    layout: 'column',
                    items : [
                        {columnWidth: .70, layout: 'form', items: [this.cbConfDoc]},
                        {columnWidth: .30, layout: 'form', items: [this.tfOrden]}
                    ]
                },
                {
                    layout: 'column',
                    items : [
                        {columnWidth: .90, layout: 'form', items: [self.cbPersona]}
                    ]
                }

            ]
        });

        //Ventana de adicionar y modificar
        this.ventanaConfDoc = new Ext.Window({
            modal          : true,
            closeAction    : 'hide',
            autoHeight     : true,
            //width          : 700,
            closable       : true,
            autoValidate   : true,
            validateDefault: true,
            constrain      : true,
            resizable      : false,
            layout         : 'fit',
            items          : [this.formularioConfDoc],
            buttons        : [this.btnCancelarConfDoc, this.btnAplicarConfDoc, this.btnAceptarConfDoc],
            keys           : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAceptarConfDoc.disabled) {
                            self.btnAceptarConfDoc.handler();
                        }

                    }
                },
                {
                    key      : 'x',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnCancelarConfDoc.disabled) {
                            self.btnCancelarConfDoc.handler();
                        }
                    }
                },
                {
                    key      : 'p',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAplicarConfDoc.disabled) {
                            self.btnAplicarConfDoc.handler();
                        }
                    }
                }
            ]
        });


        /********************************GestionarConfDocFirma**********************************/


        /********************************ConfXdoc**********************************/
            //BOTONES***************************************************************************************
            //Boton adicionar
        this.btnAdicionarConfDoc = new Ext.Button({
            id      : 'idbtnAdicionarFechas',
            text    : '<u>A</u>dicionar',
            tooltip : '<u>A</u>dicionar períodos (<b>Alt+G</b>)',
            iconCls : 'adicionar',
            disabled: true
        });

        //Boton modificar
        this.btnModificarConfDoc = new Ext.Button({
            id      : 'idbtnModificarFechas',
            text    : '<u>M</u>odificar',
            tooltip : '<u>M</u>odificar períodos (<b>Alt+G</b>)',
            iconCls : 'modificar',
            disabled: true
        });

        //Boton eliminar
        this.btnEliminarConfDoc = new Ext.Button({
            id      : 'btnEliminarConfDoc',
            text    : '<u>E</u>liminar',
            tooltip : '<u>E</u>liminar períodos (<b>Alt+G</b>)',
            iconCls : 'eliminar',
            disabled: true
        });


        //Store del listado de tipos de pagos
        this.stConfDoc = new Ext.data.Store({
            url   : '/pvd/maestro/configuraciones/index.php/confpiefirma/obtenerConfFirma',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad",
                    root      : "datos",
                    id        : "idfirmadocumento"}, [
                    {name: 'idfirmadocumento'},
                    {name: 'idtipofirma'},
                    {name: 'idpersona'},
                    {name: 'tipofirma'},
                    {name: 'persona'},
                    {name: 'orden'}
                ])
        });

        this.smConfDoc = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpConfDoc = new Ext.grid.GridPanel({
            store        : this.stConfDoc,
            region       : 'center',
            collapsible  : true,
            autoExpandMax: 100,
            border       : true,
            loadMask     : {text: 'Cargando...'},
            width        : 300,
            columns      : [

                {header: 'idfirmadocumento', dataIndex: 'idfirmadocumento', hidden: true},
                {header: 'idtipofirma', dataIndex: 'idtipofirma', hidden: true},
                {header: 'idpersona', dataIndex: 'idpersona', hidden: true},
                {header: 'Tipo de firma', dataIndex: 'tipofirma', width: 100},
                {header: 'Persona', dataIndex: 'persona', width: 100},
                {header: 'Orden', dataIndex: 'orden', width: 100}
            ],
            viewConfig   : {
                forceFit: true
            },
            sm           : this.smConfDoc,
            tbar         : [this.btnAdicionarConfDoc, this.btnModificarConfDoc, this.btnEliminarConfDoc]
        });

        //Panel de configuraciones por documentos
        this.pConfDoc = new Ext.Panel({
            title      : 'Listado de configuraciones por documentos',
            region     : 'east',
            layout     : 'fit',
            width      : '70%',
            collapsible: false,
            split      : true,
            items      : [this.gpConfDoc]
        });

        /********************************ConfXdoc**********************************/





            //Panel de Documentos
        this.pDocFirma = new Ext.Panel({
            title      : 'Listado de firmas de documentos',
            region     : 'center',
            layout     : 'fit',
            width      : '30%',
            collapsible: true,
            split      : true,
            items      : [this.gpDocFirma]
        });


        //Ventana principal
        this.winPieFirmaPrincipal = new Ext.Window({
            title      : 'Configuraci&oacute;n de los pie de firma',
            modal      : true,
            constrain  : true,
            resizable  : false,
            layout     : 'border',
            closeAction: 'hide',
            items      : [this.pDocFirma, this.pConfDoc]
        });


        /*********************Eventos**************************/
            //Eventos del objeto del ábol de entidades.
        this.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
				variables.identidad = nodo.id;
                variables.denominacionentidad = nodo.text;
                self.btnAceptarEntidades.enable();                
            
        });

        this.btnAceptarEntidades.setHandler(function () {
            if (variables.identidad != null) {
                //Cargar los documentos firmas
                // self.winEstEntidades.hide();
                self.winPieFirmaPrincipal.show();
                self.winPieFirmaPrincipal.maximize();
                self.stDocFirma.load();

            }
        });

        this.smDocFirma.on('rowselect', function (sm, index, record) {
            variables.iddocumentofirma = record.data.iddocumentofirma;
            variables.iddocumento = record.data.iddocumentofirma;
            self.btnAdicionarConfDoc.enable();
            self.stConfDoc.load({
                params: {
                    identidad  : variables.identidad,
                    iddocumento: variables.iddocumento
                }});

        });

        this.smConfDoc.on('rowselect', function (sm, index, record) {
            self.btnModificarConfDoc.enable();
            self.btnEliminarConfDoc.enable();
            variables.idfirmadocumento = record.data.idfirmadocumento;
        });

        this.smConfDoc.on('rowdeselect', function (sm, index, record) {
            self.btnModificarConfDoc.disable();
            self.btnEliminarConfDoc.disable();
        });


        this.gpPersonas.on('personaselecionada', function (record) {
            self.btnAceptarConfDoc.enable();
            self.btnModificarConfDoc.enable();
            self.btnAceptarPersonas.enable();
            variables.nombrepersona = record.data.nombre + ' ' + record.data.papel + ' ' + record.data.sapel;
            variables.idpersona = record.data.idpersona;
            variables.personaseleccionada = 1;
            // console.log(variables.nombrepersona);
        });

        this.gpPersonas.on('personanoselecionada', function (record) {
            // console.log(record);
            self.btnAceptarConfDoc.disable();
            self.btnModificarConfDoc.disable();
            self.btnAceptarPersonas.disable();
            variables.personaseleccionada = 0;
        });

        //Evento de la ventana de adicionar/modificar
        self.ventanaConfDoc.on('beforeshow', function (ventana) {
            //variablesConceptoRM.cambio = 0;
            self.formularioConfDoc.getForm().reset();
            // self.cbConfDoc.focus(true, 500);
        });


        //Eventos del botón adicionar.
        this.btnAdicionarConfDoc.setHandler(function () {
            mostrarVentanaAdicionarConfDoc();
        });


        //Eventos del botón modificar.
        self.btnModificarConfDoc.on('click', function () {
            mostrarVentanaModificarAreas();
        });

        self.cbPersona.on('focus', function () {
            self.winPersonas.show();
            self.gpPersonas.Buscar();
        });

        self.cbConfDoc.on('select', function () {
            variables.idtipofirma = self.cbConfDoc.getValue();
        });

        //Eventos del botón eliminar.
        self.btnEliminarConfDoc.setHandler(function () {
            eliminarConfDoc();
        });

        self.btnCancelarConfDoc.setHandler(function ()   {
            self.ventanaConfDoc.hide();
        });


        self.btnCancelarPersonas.setHandler(function () {
            self.winPersonas.hide();
        });

        self.btnAceptarConfDoc.setHandler(function () {
            salvarFormularioConfDoc(false);
        });

        self.btnAceptarPersonas.setHandler(function () {
            self.cbPersona.setRawValue(variables.idpersona);
            self.cbPersona.setValue(variables.nombrepersona);
            self.winPersonas.hide();
        });

        self.btnAplicarConfDoc.setHandler(function () {
            salvarFormularioConfDoc(true);
        });

        function mostrarVentanaAdicionarConfDoc() {
            self.ventanaConfDoc.setTitle("Adicionar configuración");
            self.btnAplicarConfDoc.show();
            self.ventanaConfDoc.show();
            //Actualizar la tabulación deL formulario.
            /* self.btnCancelarAreas.setNextElement('idbtnAplicarAreas');
             self.btnAceptarAreas.setPreviousElement('idbtnAplicarAreas');*/
            variables.accion = 'Add';

            self.storeConfDoc.load();
        }

        /*
         *Función de mostrar la ventana de modificar area.
         */
        function mostrarVentanaModificarAreas() {
            variables.idpersona = self.smConfDoc.getSelected().data.idpersona;
            variables.idtipofirma = self.smConfDoc.getSelected().data.idtipofirma;
            // console.log(variables.idpersona);
            self.ventanaConfDoc.setTitle("Modificar configuración");
            self.btnAplicarConfDoc.hide();
            self.ventanaConfDoc.show();
            //Actualizar la tabulación deL formulario.
            /*  self.btnCancelarAreas.setNextElement('idbtnAceptarAreas');
             self.btnAceptarAreas.setPreviousElement('idbtnCancelarAreas');*/

            self.storeConfDoc.load();

            variables.accion = 'Mod';
            self.formularioConfDoc.getForm().loadRecord(self.smConfDoc.getSelected());
        }

//        console.info(vista.formularioAreas);
        /*
         *Función para adicionar/modificar un area.
         */
        function salvarFormularioConfDoc(boton) {

            var urlAction = '/pvd/maestro/configuraciones/index.php/confpiefirma/adicionarConfFirma';
            var idfirmadocumento = 0;
            var lbMsgEspera = 'Guardando datos de configuraci&oacute;n...';
            var lbMsgExito = 'La configuraci&oacute;n ha sido adicionada satisfactoriamente.';

            if (variables.accion == 'Mod') {
                lbMsgEspera = 'Guardando datos de configuraci&oacute;n...';
                lbMsgExito = 'La configuraci&oacute;n ha sido modificada satisfactoriamente.'
                urlAction = '/pvd/maestro/configuraciones/index.php/confpiefirma/actualizarConfFirma';
                idfirmadocumento = self.smConfDoc.getSelected().get('idfirmadocumento');

            }
            variables.cambio = 1;

            if (variables.cambio == 0) {
                if (variables.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    self.ventanaConfDoc.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    self.tfDenomAreas.markInvalid('Este campo es obligatorio.');
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            } else {

                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (self.formularioConfDoc.getForm().isValid()) {
                    if (variables.accion == 'Add') {
                        variables.idtipofirma = self.cbConfDoc.getValue();
                        //variables.idpersona=self.cbPersona.getValue;
                    }

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodareas', 'Por favor espere…', lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : urlAction,
                        method  : 'POST',
                        params  : {
                            idfirmadocumento: variables.idfirmadocumento,
                            iddocumentofirma: variables.iddocumentofirma,
                            idtipofirma     : variables.idtipofirma,
                            idpersona       : variables.idpersona,
                            identidad       : variables.identidad,
                            orden           : self.tfOrden.getValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodareas');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    self.ventanaConfDoc.hide();

                                } else {
                                    self.cbConfDoc.focus(true, 500);
                                }
                                self.formularioConfDoc.getForm().reset();
                                self.stConfDoc.removeAll();
                                //self.gpPersonas.Buscar();
                                self.stConfDoc.reload();
                                self.btnEliminarConfDoc.disable();
                                self.btnModificarConfDoc.disable();
                                self.gpPersonas.limipiarSeleccion();
                                variables.cambio = 0;


                            } else {
                                if (variables.accion == 'Add')
                                    mostrarMensaje(3, 'La configuraci&oacute;n que intenta adicionar ya existe.');
                                if (variables.accion == 'Mod')
                                    mostrarMensaje(3, 'La configuraci&oacute;n que intenta modificar ya existe.');
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            }
        }

        /*
         *Función para eliminar un area.
         */
        function eliminarConfDoc() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, 'Est&aacute; seguro que desea eliminar la configuraci&oacute;n seleccionada', function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarareas', 'Espere', 'Eliminado configuraci&oacute;n');
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/maestro/configuraciones/index.php/confpiefirma/eliminarConfFirma',
                        method  : 'POST',
                        params  : {
                            idconfdocumento: variables.idfirmadocumento

                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarareas');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha eliminado el area.
                                mostrarMensaje(1, 'La configuraci&oacute;n ha sido eliminada correctamente.');
                                //Recargando el grid de area.
                                self.stConfDoc.reload();
                                self.btnEliminarConfDoc.disable();
                                self.btnModificarConfDoc.disable();
                                self.gpPersonas.limipiarSeleccion();


                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, 'No se pudo eliminar la  configuraci&oacute;n porque se encuentra en uso');
                            }
                        }
                    });
                }
            });
        }

        /*********************Eventos**************************/
        Pvd.Maestro.Configuraciones.CmpPieFirma.superclass.initComponent.call(this);
    }
});