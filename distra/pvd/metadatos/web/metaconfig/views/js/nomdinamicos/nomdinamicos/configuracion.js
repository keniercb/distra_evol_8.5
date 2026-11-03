/**
 * Autor: Tte. Ing. Roberto León Socarrás
 */
Ext.ns('PVD.Persona.Nomdinamicos');
Ext.QuickTips.init();
PVD.Persona.Nomdinamicos.Configuracion = {
    init: function (idioma) {

        //Variables
        var self = this;
        var modselect, accion;
        var busc = 0;

        this.btnGestionarConfiguracion = new Ext.Button({
            text   : "Gestionar configuración",
            hidden : false,
            tooltip: "Gestiona las configuraciones para los atributos",
            iconCls: 'configuracion',
            id     : "btnGestionarConfiguracion",
        });

        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            text    : idioma.nomconfiguracion.BtnAyuda,
            iconCls : 'ayuda',
            disabled: false
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text   : idioma.nomconfiguracion.BtnAdicionar,
            tooltip: idioma.nomconfiguracion.textToolTipAdicionar,
            iconCls: 'adicionar',
            handler: function () {
                self.ventanaGestion.setTitle(idioma.nomconfiguracion.textVentanaAdicionar);
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.formularioGestion.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text    : idioma.nomconfiguracion.BtnModificar,
            disabled: true,
            tooltip : idioma.nomconfiguracion.textToolTipModificar,
            iconCls : 'modificar',
            handler : function () {
                self.ventanaGestion.setTitle(idioma.nomconfiguracion.textVentanaModificar);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tfdenom.setValue(modselect.denominacion);
                self.tadescripcion.setValue(modselect.descripcion);
                accion = 'mod';
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            text    : idioma.nomconfiguracion.BtnEliminar,
            disabled: true,
            tooltip : idioma.nomconfiguracion.textToolTipEliminar,
            iconCls : 'eliminar',
            handler : function () {
                eliminar();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text   : idioma.nomconfiguracion.BtnBuscar,
            tooltip: idioma.nomconfiguracion.lbBtnBuscarR,
            iconCls: 'buscar',
            handler: function () {
                self.stEntidad.load({params: {denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
                busc = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            text   : idioma.nomconfiguracion.BtnLimpiar,
            tooltip: idioma.nomconfiguracion.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function () {
                self.tfbuscar.reset();
                self.stEntidad.load({params: {start: 0, limit: 15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank: true,
            width     : 140,
            name      : 'tfbuscador'
        });

        //Fuente de datos del listado.
        this.stEntidad = new Ext.data.Store({
            url      : 'getConfiguracion',
            reader   : new Ext.data.JsonReader(
                {root: "datos", id: "idconfiguracion", totalProperty: "cantidad"},
                [{name: 'idconfiguracion'}, {name: 'denominacion'}, {name: 'descripcion'}
                    , {name: 'fechacreacion'}]
            ),
            listeners: {
                load: function (st) {
                    modselect = null;
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    if (busc == 1 && st.getCount() == 0) {
                        mostrarMensaje(1, idioma.nomconfiguracion.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount() == 0) {
                        mostrarMensaje(1, idioma.nomconfiguracion.lbNoDatos);
                    }
                }
            }
        });

        this.stEntidad.load({params: {start: 0, limit: 15}});

        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="No gestionable"';
            }
            return val;
        }

        self.mascaraGrid = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});
        //Listado de necesidades de capacitacion.
        this.gpConfiguracion = new Ext.grid.GridPanel({
            store   : this.stEntidad,
            region  : 'center',
            width   : 800,
            plugins : this.expander,
            loadMask: self.mascaraGrid,
            tbar    : [
                '-', '',
                idioma.nomconfiguracion.lbDenominacion + ':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar, '', '-'
            ],
            columns : [this.expander,
                {
                    header   : 'Identificador',
                    width    : 120,
                    dataIndex: 'denominacion',
                    renderer : mostrartt
                }, {
                    header   : 'Fecha creación',
                    width    : 100,
                    dataIndex: 'fechacreacion',
                    renderer : mostrartt
                }
            ],
            bbar    : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : this.stEntidad,
                displayInfo: true
            }),
            keys    : [
                {
                    key: 'i',
                    alt: true,
                    fn : function () {
                        if (!self.btnAdicionar.disabled) {
                            self.btnAdicionar.handler();
                        }

                    }
                },
                {
                    key      : 'm',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnModificar.disabled) {
                            self.btnModificar.handler();
                        }
                    }
                },
                {
                    key: 46,//Eliminar
                    fn : function () {
                        if (!self.btnEliminar.disabled) {
                            self.btnEliminar.handler();
                        }
                    }
                },
                {
                    key: 'h',
                    alt: true,
                    fn : function () {
                        if (!self.btnAyuda.disabled) {
                            self.btnAyuda.handler();
                        }
                    }
                },
                {
                    key: 'b',
                    alt: true,
                    fn : function () {
                        if (!self.btnBuscar.disabled) {
                            self.btnBuscar.handler();
                        }
                    }
                },
                {
                    key: 'l',
                    alt: true,
                    fn : function () {
                        if (!self.btnLimpiar.disabled) {
                            self.btnLimpiar.handler();
                        }
                    }
                }
            ]
        });

        // panel para add, mod, del, ayuda
        this.panelNorte = new Ext.Panel({
            title : 'Listado de configuraciones',
            layout: 'fit',
            region: 'north',

            border: false,
            tbar  : [
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar, '-',
                this.btnGestionarConfiguracion
            ]
        });

        this.panelCentral = new Ext.Panel({
            layout: 'border',
            region: 'center',
            split : true,
            width : 800,
            border: false,
            items : [this.panelNorte, this.gpConfiguracion]
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id             : 'tfdenomc' + self.id,
            fieldLabel     : idioma.nomconfiguracion.lbDenominacion,
            allowBlank     : false,
            maxLength      : 100,
            enableKeyEvents: true,
            regex          : /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe         : /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText      : idioma.nomconfiguracion.msgCaracteres,
            anchor         : '99%',
            name           : 'denominacion'
        });

        // Area de texto Descripción del curso
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: idioma.nomconfiguracion.lbDescripcion,
            name      : 'descripcion',
            anchor    : '99%',
            height    : 100,
            hiddenname: 'descripcion',
            // maxLength: 255,
            regex     : /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe    : /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText : idioma.nomconfiguracion.lbRegexTextDescripcion,
            allowBlank: true
        });


        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame     : true,
            autoHeight: true,
            bodyStyle : 'padding:5px 5px 0',
            items     : [{
                layout: 'column',
                items : [
                    {
                        columnWidth: 1.0,
                        layout     : 'form',
                        items      : [this.tfdenom]
                    }, {
                        columnWidth: 1.0,
                        layout     : 'form',
                        items      : [this.tadescripcion]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenomc' + self.id,
            iconCls: 'cancelar',
            tooltip: idioma.nomconfiguracion.textToolTipCancelar,
            text   : idioma.nomconfiguracion.lbtnCancelar,
            handler: function () {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            nextTab  : 'tfdenomc' + self.id,
            iconCls  : 'aceptar',
            tooltip  : idioma.nomconfiguracion.textToolTipAceptar,
            text     : idioma.nomconfiguracion.lbtnAceptar,
            listeners: {
                'enable' : function () {
                    self.btnCancelar.nextTab = 'btnAplicarc';
                },
                'disable': function () {
                    self.btnCancelar.nextTab = 'tfdenomc' + self.id;
                }
            },
            handler  : function () {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id     : 'btnAplicarc',
            iconCls: 'aplicar',
            tooltip: idioma.nomconfiguracion.textToolTipAplicar,
            text   : idioma.nomconfiguracion.lbtnAplicar,
            handler: function () {
                guardarDatos('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal      : true,
            closeAction: 'hide',
            constrain  : true,
            resizable  : false,
            layout     : 'fit',
            width      : 400,
            autoHeight : true,
            items      : [this.formularioGestion],
            buttons    : [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners  : {
                'beforeshow': function () {
                    self.tfdenom.focus(true, 500);
                }
            },
            keys       : [{
                key      : 'x',
                alt      : true,
                stopEvent: true,
                fn       : function () {
                    if (!self.btnCancelar.disabled) {
                        self.btnCancelar.handler();
                    }
                }
            },
                {
                    key      : 'p',
                    alt      : true,
                    ctrl     : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAplicar.disabled) {
                            self.btnAplicar.handler();
                        }
                    }
                },
                {
                    key      : 13,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnAceptar.disabled) {
                            self.btnAceptar.handler();
                        }
                    }
                }]
        });


        this.gpConfiguracion.getSelectionModel().on('rowselect', function (n) {
            modselect = n.getSelected().data;
            self.btnModificar.enable();
            self.btnEliminar.enable();
        }, this);


        this.gpConfiguracion.getSelectionModel().on('rowdeselect', function (n) {

            self.btnModificar.disable();
            self.btnEliminar.disable();
        }, this);


        this.panelNorte.on('render', function () {
            self.btnAdicionar.focus();
        });

        this.ventanaGestion.on('hide', function () {
            self.btnAdicionar.focus();
        });

        function guardarDatos(btnpress) {

            if (self.formularioGestion.getForm().isValid()) {
                Ext.Ajax.request({
                    url    : (accion == 'add' ? 'addConfiguracion' : 'modConfiguracion'),
                    params : {
                        idconfiguracion: accion == 'add' ? -1 : modselect.idconfiguracion,
                        descripcion    : self.tadescripcion.getValue(),
                        denominacion   : self.tfdenom.getValue()
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        console.log(responseData);

                        if (responseData != false) {
                            if (accion == 'mod') {
                                mostrarMensaje(1, idioma.nomconfiguracion.msgModCSucces);
                            } else {
                                mostrarMensaje(1, idioma.nomconfiguracion.msgAddCSucces);
                            }
                            if (btnpress == 'ACP') {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stEntidad.removeAll();
                            self.stEntidad.reload();
                        } else {
                            if (accion == 'mod') {
                                mostrarMensaje(1, idioma.nomconfiguracion.msgModCExistem);
                            } else {
                                mostrarMensaje(1, idioma.nomconfiguracion.msgAddCExistem);
                            }

                        }
                    }
                });
            }
        }

        function eliminar() {
            var ids = new Array();
            var s = self.gpConfiguracion.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.idconfiguracion);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la configuración seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las configuraciones seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.nomconfiguracion.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url     : 'delConfiguracion',
                        params  : {
                            configuraciones: Ext.encode(ids)
                        },
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success : function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La configuración seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Algunas de las configuraciones seleccionadas no pueden ser eliminadas debido a que se encuentran en' +
                                        ' uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La configuración ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las configuraciones seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stEntidad.removeAll();
                            self.stEntidad.reload();
                        }
                    });
                }
            });
        }

        this.keys = [
            {
                key      : 'i',
                alt      : true,
                stopEvent: true,
                fn       : function () {
                    if (!self.btnAdicionar.disabled) {
                        self.btnAdicionar.handler();
                    }

                }
            },
            {
                key      : 'm',
                alt      : true,
                stopEvent: true,
                fn       : function () {
                    if (!self.btnModificar.disabled) {
                        self.btnModificar.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                fn : function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            },
            {
                key      : 'h',
                alt      : true,
                stopEvent: true,
                fn       : function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            },
            {
                key      : 'b',
                alt      : true,
                stopEvent: true,
                fn       : function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key      : 'l',
                alt      : true,
                stopEvent: true,

                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ];


    }
};


    /*//Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;


        var panel=undefined;
        //Inicializando la vista.
        Misitio.Funciones.PanelMaestroDetalleMultiple({
            id            : 'idMDM',
            identificadorconfiguracion: 'mdpersona'
        }, function (panelMDM) {

            var configuracion = PVD.Persona.Nomdinamicos.Configuracion;
            configuracion.init(idioma);

            var gestionarconfiguracion = PVD.Persona.Nomdinamicos.GestionarConfiguraciones;
            gestionarconfiguracion.init(idioma, panelMDM);


            //Inicializando la vista.
            var disenno = PVD.Persona.Nomdinamicos.Disenno;
            disenno.init(idioma, configuracion);

            //Inicializar controlador.
            var controller = PVD.Persona.Nomdinamicos.Controlador;
            controller.init(idioma, configuracion, disenno, gestionarconfiguracion);

        });
*/

