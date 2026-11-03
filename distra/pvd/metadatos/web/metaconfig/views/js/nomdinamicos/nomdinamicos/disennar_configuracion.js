/**
 * Autor: Tte. Ing. Roberto León Socarrás
 */
Ext.ns('PVD.Persona.Nomdinamicos');
//Modelo de la vista del componente.
PVD.Persona.Nomdinamicos.Disenno = {
    init: function (idioma, configuracion) {
//Variables
        var self = this;
        var modselect, accion;
        var busc = 0;
        this.idconfiguracion = -1;
        this.identificadorconfiguracion = -1;
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            text: "Ayuda",
            iconCls: 'ayuda',
            disabled: false
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text:"Adicionar",
            tooltip: idioma.datentidad.textToolTipAdicionar,
            iconCls: 'adicionar',
            disabled: true,
            handler: function () {
                self.ventanaGestion.setTitle(idioma.datentidad.textVentanaAdicionar);
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.formularioGestion.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: idioma.datentidad.BtnModificar,
            disabled: true,
            tooltip: idioma.datentidad.textToolTipModificar,
            iconCls: 'modificar',
            handler: function () {
                self.ventanaGestion.setTitle(idioma.datentidad.textVentanaModificar);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tfdenom.setValue(modselect.denominacion);
                self.tadescripcion.setValue(modselect.descripcion);
                self.tfnombretabla.setValue(modselect.nombretabla);
                self.tfidentificador.setValue(modselect.identificador);
                self.cbMensaje.setValue(modselect.mensaje);
                self.hcbMensaje.setValue(modselect.idmensaje);
                self.nfAnchoFormulario.setValue(modselect.anchoform);
                accion = 'mod';
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            text: idioma.datentidad.BtnEliminar,
            disabled: true,
            tooltip: idioma.datentidad.textToolTipEliminar,
            iconCls: 'eliminar',
            handler: function () {
                eliminar();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: idioma.datentidad.BtnBuscar,
            tooltip: idioma.datentidad.lbBtnBuscarR,
            iconCls: 'buscar',
            handler: function () {
                self.stEntidad.load({params: {denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
                busc = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            text: idioma.datentidad.BtnLimpiar,
            tooltip: idioma.datentidad.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function () {
                self.tfbuscar.reset();
                self.stEntidad.load({params: {start: 0, limit: 15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank: true,
            width: 140,
            name: 'tfbuscador'
        });


        //Fuente de datos del listado.
        this.stEntidad = new Ext.data.Store({
            url: 'getEntidad',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "identidad", totalProperty: "cantidad"},
                [{name: 'identidad'},
                    {name: 'denominacion'},
                    {name: 'descripcion'},
                    {name: 'nombretabla'},
                    {name: 'identificador'},
                    {name: 'anchoform'},
                    {name: 'idconfiguracion'},
                    {name: 'idmensaje'},
                    {name: 'mensaje'},
                ]
            ),
            listeners: {
                load: function (st) {
                    modselect = null;
                    self.btnModificar.disable();
                    self.btnMostrarConceptoSeleccionado.disable();
                    self.btnEliminar.disable();
                    if (busc == 1 && st.getCount() == 0) {
                        mostrarMensaje(1, idioma.datentidad.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount() == 0) {
                        mostrarMensaje(1, idioma.datentidad.lbNoDatos);
                    }
                },
                beforeload: function (st) {
                    st.baseParams.idconfiguracion = self.idconfiguracion;
                    st.baseParams.denominacion = self.tfbuscar.getValue();
                }
            }
        });


        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="No gestionable"';
            }
            return val;
        }

        function cambiarRadio(val) {
            if (val) {
                return "<center><img src='/metadatos/metaconfig/views/js/nomdinamicos/images/checked.png' /></center>";
            } else {
                return "<center><img src='/metadatos/metaconfig/views/js/nomdinamicos/images/unchecked.png' /></center>";
            }
        }

        this.btnMostrarConceptoSeleccionado = new Ext.Button({
            text: "Ver concepto",
            disabled: true,
            tooltip: "Muestra el concepto seleccionado",
            iconCls: 'ver',
            id: "btnbtnMostrarConceptosSeleccionados",
            handler: function () {
                cargarConfiguracion(self.gpEntidad.selModel.getSelected());
            }.createDelegate(this)
        });

        this.btnMostrarReportes = new Ext.Button({
            text: "Ver reportes",
            tooltip: "Muestra la ventana de administración de reportes",
            iconCls: 'reporte',
            id: "btnbtnMostrarConceptosSeleccionados",
            handler: function () {
                var ventanreportes=Misitio.Funciones.VentanaAdministracionReportes({
                    id:"ventanareportes",
                    titulo:"Administración de reportes"
                });
                ventanreportes.show();
                ventanreportes.maximize();
            }.createDelegate(this)
        });

        function cargarConfiguracionSi(lastFilaSeleccionada) {
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

            var panel = null;

            if (lastFilaSeleccionada != null) {

                myMask.show();
                Ext.Ajax.request({
                    url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                    method: 'POST',
                    params: {
                        metodo: 'cargarConfiguracion',
                        identidad: lastFilaSeleccionada.id,
                        //identificador: lastFilaSeleccionada.data.identificador
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.success) {
                            if (respuesta.datos.length != 0) {
                                var pos = 0;
                                while (!respuesta.datos[pos].primaria) {
                                    pos++;
                                }
                                var ventanaConceptoSeleccionado;

                                var configuracionMensajes = {femenino: respuesta.datos[0].femenino,
                                    numero: [ respuesta.datos[0].singular, respuesta.datos[0].plural]};

                                if (Ext.getCmp('ventana' + lastFilaSeleccionada.id) == null) {
                                    var nuevo = new Misitio.Panel_Gestion.GestionGridPanel({
                                        title: lastFilaSeleccionada.data.denominacion + ': ' + lastFilaSeleccionada.data.descripcion,
                                        region: 'center',
                                        id: 'conceptos' + lastFilaSeleccionada.id,
                                        nombre:lastFilaSeleccionada.data.denominacion,
                                        configuracionMensajes: configuracionMensajes,
                                        collapsible: true,
                                        anchoForm: respuesta.datos[0].anchoformulario,
                                        autoScroll: true,
                                        animeCollapse: true,
                                        autoCargar: true,
                                        urlListar: 'listarGenerico',
                                        urlGuardar: 'guardarGenerico',
                                        urlEliminar: 'eliminarGenerico',
                                        tabla: lastFilaSeleccionada.data.nombretabla,
                                        idtabla: respuesta.datos[pos].index,
                                        configuracion: respuesta.datos

                                    });


                                    ventanaConceptoSeleccionado = new Ext.Window({
                                        modal: true,
                                        enableTabScroll: true,
                                        id: 'ventana' + lastFilaSeleccionada.id,

                                        closeAction: 'hide',
                                        height: screen.height * 0.50,
                                        width: screen.width * 0.50,
                                        closable: true,
                                        resizable: false,
                                        maximizable: true,
                                        constrain: true,
                                        minimizable: true,
                                        layout: 'fit',
                                        items: [nuevo]
                                    });
                                    console.log(respuesta);
                                    ventanaConceptoSeleccionado.show();
                                } else {
                                    Ext.getCmp('conceptos' + lastFilaSeleccionada.id).ventanaGestion.destroy();

                                    var nuevo = new Misitio.Panel_Gestion.GestionGridPanel({
                                        title: lastFilaSeleccionada.data.denominacion + ': ' + lastFilaSeleccionada.data.descripcion,
                                        region: 'center',
                                        id: 'conceptos' + lastFilaSeleccionada.id,
                                        nombre:lastFilaSeleccionada.data.denominacion,
                                        configuracionMensajes: configuracionMensajes,
                                        collapsible: true,
                                        anchoForm: respuesta.datos[0].anchoformulario,
                                        autoScroll: true,
                                        animeCollapse: true,
                                        autoCargar: true,
                                        urlListar: 'listarGenerico',
                                        urlGuardar: 'guardarGenerico',
                                        urlEliminar: 'eliminarGenerico',
                                        tabla: lastFilaSeleccionada.data.nombretabla,
                                        idtabla: respuesta.datos[pos].index,
                                        configuracion: respuesta.datos
                                    });


                                    Ext.getCmp('ventana' + lastFilaSeleccionada.id).remove('conceptos' + lastFilaSeleccionada.id);
                                    Ext.getCmp('ventana' + lastFilaSeleccionada.id).add(nuevo);

                                    Ext.getCmp('ventana' + lastFilaSeleccionada.id).show();
                                }

                            } else {
                                Ext.Msg.show({
                                    title: 'Error',
                                    msg: 'Configuración aún incompleta.',
                                    buttons: Ext.Msg.OK,
                                    animEl: 'elIda',
                                    icon: Ext.MessageBox.ERROR
                                });
                            }

                            myMask.hide();
                        } else {
                            myMask.hide();
                            var error = respuesta.error;

                        }

                    }
                });

            }


            // return panel;
        };

        function cargarConfiguracion(lastFilaSeleccionada) {
            Misitio.Panel_Gestion.PanelGestionGenerico({
                identificadorconfiguracion:self.identificadorconfiguracion,
                identificadorentidad:lastFilaSeleccionada.data.identificador
            },function (respuesta,configuracion) {
                if (Ext.getCmp('ventana' + lastFilaSeleccionada.id) == null) {
                   var nuevo = new Misitio.Panel_Gestion.GestionGridPanel({
                        title: lastFilaSeleccionada.data.denominacion + ': ' + lastFilaSeleccionada.data.descripcion,
                        nombre:lastFilaSeleccionada.data.denominacion,
                        configuracionMensajes: configuracion.configuracionMensajes,
                        id: 'conceptos' + lastFilaSeleccionada.id,
                        region: 'center',
                        anchoForm: configuracion.anchoForm,
                        collapsible: true,
                        animCollapse: true,
                        autoScroll: true,
                        tabla: configuracion.tabla,
                        idtabla: configuracion.idtabla,
                        configuracion: configuracion.configuracion
                    });


                    var ventanaConceptoSeleccionado = new Ext.Window({
                        modal: true,
                        enableTabScroll: true,
                        id: 'ventana' + lastFilaSeleccionada.id,
                        closeAction: 'hide',
                        height: screen.height * 0.50,
                        width: screen.width * 0.50,
                        closable: true,
                        resizable: false,
                        maximizable: true,
                        constrain: true,
                        minimizable: true,
                        layout: 'fit',
                        items: [nuevo]
                    });

                    ventanaConceptoSeleccionado.show();
                }else {
                    Ext.getCmp('conceptos' + lastFilaSeleccionada.id).ventanaGestion.destroy();

                    var nuevo = new Misitio.Panel_Gestion.GestionGridPanel({
                        title: lastFilaSeleccionada.data.denominacion + ': ' + lastFilaSeleccionada.data.descripcion,
                        nombre:lastFilaSeleccionada.data.denominacion,
                        configuracionMensajes: configuracion.configuracionMensajes,
                        id: 'conceptos' + lastFilaSeleccionada.id,
                        region: 'center',
                        anchoForm: configuracion.anchoForm,
                        collapsible: true,
                        animCollapse: true,
                        autoScroll: true,
                        tabla: configuracion.tabla,
                        idtabla: configuracion.idtabla,
                        configuracion: configuracion.configuracion
                    });

                    Ext.getCmp('ventana' + lastFilaSeleccionada.id).remove('conceptos' + lastFilaSeleccionada.id);
                    Ext.getCmp('ventana' + lastFilaSeleccionada.id).add(nuevo);

                    Ext.getCmp('ventana' + lastFilaSeleccionada.id).show();
                }
            });



        };

        self.mascaraGrid = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});
        //Listado de necesidades de capacitacion.
        this.gpEntidad = new Ext.grid.GridPanel({
            store: this.stEntidad,
            region: 'center',
            width: screen.width * 0.25,
            plugins: this.expander,
            loadMask: self.mascaraGrid,
            tbar: [
                '-', '',
                idioma.datentidad.lbDenominacion + ':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar, '', '-'
            ],
            columns: [this.expander,
                {
                    header: idioma.datentidad.lbDenominacion,
                    width: 200,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: 'Nombre tabla',
                    width: 200,
                    dataIndex: 'nombretabla',
                    renderer: mostrartt
                },
                {
                    header: 'Identificador',
                    width: 150,
                    dataIndex: 'identificador',
                    renderer: mostrartt
                }, {
                    header: idioma.datentidad.lbAnchoForm,
                    width: 120,
                    dataIndex: 'anchoform',
                    renderer: mostrartt
                }, {
                    header: 'idmensaje',
                    width: 120,
                    hidden:true,
                    dataIndex: 'idmensaje',
                    renderer: mostrartt
                }, {
                    header: 'Mensaje',
                    width: 120,
                    dataIndex: 'mensaje',
                    renderer: mostrartt
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stEntidad,
                displayInfo: true
            }),
            keys: [
                {
                    key: 'i',
                    alt: true,
                    fn: function () {
                        if (!self.btnAdicionar.disabled) {
                            self.btnAdicionar.handler();
                        }

                    }
                },
                {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificar.disabled) {
                            self.btnModificar.handler();
                        }
                    }
                },
                {
                    key: 46,//Eliminar
                    fn: function () {
                        if (!self.btnEliminar.disabled) {
                            self.btnEliminar.handler();
                        }
                    }
                },
                {
                    key: 'h',
                    alt: true,
                    fn: function () {
                        if (!self.btnAyuda.disabled) {
                            self.btnAyuda.handler();
                        }
                    }
                },
                {
                    key: 'b',
                    alt: true,
                    fn: function () {
                        if (!self.btnBuscar.disabled) {
                            self.btnBuscar.handler();
                        }
                    }
                },
                {
                    key: 'l',
                    alt: true,
                    fn: function () {
                        if (!self.btnLimpiar.disabled) {
                            self.btnLimpiar.handler();
                        }
                    }
                }
            ]
        });

        // panel para add, mod, del, ayuda
        this.panelNorte = new Ext.Panel({
            title: 'Listado de entidades',
            layout: 'fit',
            region: 'north',

            border: false,
            tbar: [
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar, '-', self.btnMostrarConceptoSeleccionado,
                self.btnMostrarReportes,
                '->', '', '-', this.btnAyuda]
        });

        this.panelCentral = new Ext.Panel({
            layout: 'border',
            region: 'center',
            split: true,
            //width : (screen.width * 0.5) * 0.75,
            //height      :  '50%',
            border: false,
            items: [this.panelNorte, this.gpEntidad]
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenomcEntidad',
            fieldLabel: idioma.datentidad.lbDenominacion,
            allowBlank: false,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: idioma.datentidad.msgCaracteres,
            anchor: '99%',
            name: 'denominacion'
        });

        //textfield denominacion
        this.tfnombretabla = new Ext.form.TextField({
            id: 'tfnombretabla' + self.id,
            fieldLabel: idioma.datentidad.lbNombreTabla,
            allowBlank: false,
            maxLength: 100,
            regex: /^([a-z0-9\_.]+)$/,
            maskRe: /^([a-z0-9\_.]+)$/,
            regexText: idioma.datentidad.msgCaracteres,
            anchor: '99%',
            name: 'nombretabla'
        });


        this.tfidentificador = new Ext.form.TextField({
            id: 'tfidentificador',
            fieldLabel: idioma.datentidad.lbIdentificador,
            allowBlank: false,
            maxLength: 100,
            regex: /^([a-z0-9]+)$/,
            maskRe: /^([a-z0-9]+)$/,
            regexText: idioma.datentidad.msgCaracteres,
            anchor: '99%',
            name: 'identificador'
        });

        this.nfAnchoFormulario = new Ext.form.NumberField({
            id: 'nfAnchoFormulario',
            fieldLabel: idioma.datentidad.lbAnchoForm,
            name: 'anchoformulario',
            allowBlank: false,
            maxLength: 6,
            maxValue: 99999,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false
        });


        // Area de texto Descripción del curso
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: idioma.datentidad.lbDescripcion,
            name: 'descripcion',
            anchor: '99%',
            height: 100,
            hiddenname: 'descripcion',
            // maxLength: 255,
            /*regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,*/
            regexText: idioma.datentidad.lbRegexTextDescripcion,
            allowBlank: true
        });


        this.stcbMensaje = new Ext.data.Store({

            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                fields: ['idmensaje', 'denominacion']
            })
        });

        this.hcbMensaje = new Ext.form.Hidden({
            id: 'hcbMensaje',
            name: 'idmensaje'
        });

        this.cbMensaje = new Ext.form.ComboBox({
            fieldLabel: 'Mensaje',
            anchor: '100%',
            store: self.stcbMensaje,
            valueField: 'idmensaje',
            displayField: 'denominacion',
            hiddenName: 'idmensaje',
            name: 'idmensaje',
            triggerAction: 'all',
            forceSelection: true,
            mode: 'local',
            emptyText: 'Seleccione...',
            allowBlank: false,
            listeners: {
                select: function (combo, record, index) {
                    Ext.getCmp('hcbMensaje').setValue(combo.getValue());
                }
            }
        });

        var consulta = 'SELECT * FROM mod_nomdinamicos.nom_mensaje';
        listarFilasCombo(self.stcbMensaje, consulta);

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            autoHeight: true,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [self.tfdenom]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [self.tfnombretabla]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [self.tfidentificador]
                    }, {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [self.nfAnchoFormulario]
                    }, {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [self.cbMensaje]
                    }, {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [self.tadescripcion]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenomcEntidad',
            iconCls: 'cancelar',
            tooltip: idioma.datentidad.textToolTipCancelar,
            text: idioma.datentidad.lbtnCancelar,
            handler: function () {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'tfdenomc' + self.id,
            iconCls: 'aceptar',
            tooltip: idioma.datentidad.textToolTipAceptar,
            text: idioma.datentidad.lbtnAceptar,
            listeners: {
                'enable': function () {
                    self.btnCancelar.nextTab = 'btnAplicarc';
                },
                'disable': function () {
                    self.btnCancelar.nextTab = 'tfdenomcEntidad';
                }
            },
            handler: function () {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarc',
            iconCls: 'aplicar',
            tooltip: idioma.datentidad.textToolTipAplicar,
            text: idioma.datentidad.lbtnAplicar,
            handler: function () {
                guardarDatos('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            autoHeight: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function () {
                    self.tfdenom.focus(true, 500);
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnCancelar.disabled) {
                        self.btnCancelar.handler();
                    }
                }
            },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicar.disabled) {
                            self.btnAplicar.handler();
                        }
                    }
                },
                {
                    key: 13,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptar.disabled) {
                            self.btnAceptar.handler();
                        }
                    }
                }]
        });


        this.panelNorte.on('render', function () {
            self.btnAdicionar.focus();
        });

        this.ventanaGestion.on('hide', function () {
            self.btnAdicionar.focus();
        });

        function guardarDatos(btnpress) {

            if (self.formularioGestion.getForm().isValid()) {
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addEntidad' : 'modEntidad'),
                    params: {
                        identidad: accion == 'add' ? -1 : modselect.identidad,
                        descripcion: self.tadescripcion.getValue(),
                        denominacion: self.tfdenom.getValue(),
                        nombretabla: self.tfnombretabla.getValue(),
                        identificador: self.tfidentificador.getValue(),
                        anchoform: self.nfAnchoFormulario.getValue(),
                        idconfiguracion: self.idconfiguracion,
                        idmensaje: self.hcbMensaje.getValue()
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);


                        if (responseData != false) {
                            if (accion == 'mod') {
                                mostrarMensaje(1, idioma.datentidad.msgModCSucces);
                            } else {
                                mostrarMensaje(1, idioma.datentidad.msgAddCSucces);
                            }
                            if (btnpress == 'ACP') {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stEntidad.removeAll();
                            self.stEntidad.reload();
                        } else {
                            if (accion == 'mod') {
                                mostrarMensaje(1, idioma.datentidad.msgModCExistem);
                            } else {
                                mostrarMensaje(1, idioma.datentidad.msgAddCExistem);
                            }

                        }
                    }
                });
            }
        }

        function eliminar() {
            var ids = new Array();
            var s = self.gpEntidad.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.identidad);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la entidad seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las entidades seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.datentidad.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: 'delEntidad',
                        params: {entidades: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La entidad seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Algunas de las entidades seleccionadas no pueden ser eliminadas debido a que se encuentran en' +
                                        ' uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La entidad ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las entidades seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stEntidad.removeAll();
                            self.stEntidad.reload();
                            self.stAtributo.reload();
                        }
                    });
                }
            });
        }

        this.keys = [
            {
                key: 'i',
                alt: true,
                fn: function () {
                    if (!self.btnAdicionar.disabled) {
                        self.btnAdicionar.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnModificar.disabled) {
                        self.btnModificar.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                fn: function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ];

        /*************************************************************************************************************************/
        //Codigo para los atributos
        /*************************************************************************************************************************/
        var modselectAtributo, accionAtributo;
        //Expander
        this.expanderAtributo = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            text: idioma.nomatributo.BtnAyuda,
            iconCls: 'ayuda',
            disabled: false
        });

        //Botón para adicionar.
        this.btnAdicionarAtributo = new Ext.Button({
            text: idioma.nomatributo.BtnAdicionar,
            tooltip: idioma.nomatributo.textToolTipAdicionar,
            disabled: true,
            iconCls: 'adicionar',
            handler: function () {
                self.ventanaGestionAtributo.setTitle(idioma.nomatributo.textVentanaAdicionar);
                self.ventanaGestionAtributo.show();
                self.btnAplicarAtributo.show();
                self.formularioGestionAtributo.getForm().reset();
                habilitarTodo();
                accionAtributo = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificarAtributo = new Ext.Button({
            text: idioma.nomatributo.BtnModificar,
            disabled: true,
            tooltip: idioma.nomatributo.textToolTipModificar,
            iconCls: 'modificar',
            handler: function () {
                habilitarTodo();
                self.ventanaGestionAtributo.setTitle(idioma.nomatributo.textVentanaModificar);
                self.ventanaGestionAtributo.show();
                self.btnAplicarAtributo.hide();
                self.tfdenomAtributo.setValue(modselectAtributo.denominacion);
                self.tadescripcionAtributo.setValue(modselectAtributo.descripcion);
                self.tfGridHeader.setValue(modselectAtributo.gridheader);
                self.nfAnchoGrid.setValue(modselectAtributo.ancho);
                self.nfAnchoForm.setValue(modselectAtributo.anchoform);
                self.nfOrden.setValue(modselectAtributo.orden);
                self.chbNulo.setValue(modselectAtributo.nulo);
                self.chbPrimaria.setValue(modselectAtributo.primaria);
                self.chbUnico.setValue(modselectAtributo.unico);
                self.chbMostrarFiltro.setValue(modselectAtributo.mostrarfiltro);
                self.hcbConfTipoAtributo.setValue(modselectAtributo.idconftipoatributo);
                self.hcbTipoAtributo.setValue(modselectAtributo.idtipoatributo);
                self.cbTipoAtributo.setValue(modselectAtributo.denomtipoatributo);
                self.cbConfTipoAtributo.setValue(modselectAtributo.denomconftipoatributo);
                if(modselectAtributo.idtipoatributo===7){
                    deshabilitarOcultar();
                }
                if(modselectAtributo.idtipoatributo===6){
                    self.cbConfTipoAtributo.disable();
                }
                accionAtributo = 'mod';
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminarAtributo = new Ext.Button({
            text: idioma.nomatributo.BtnEliminar,
            disabled: true,
            tooltip: idioma.nomatributo.textToolTipEliminar,
            iconCls: 'eliminar',
            handler: function () {
                eliminarAtributo();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscarAtributo = new Ext.Button({
            text: idioma.nomatributo.BtnBuscar,
            tooltip: idioma.nomatributo.lbBtnBuscarR,
            iconCls: 'buscar',
            handler: function () {
                self.stAtributo.load({
                    params: {
                        denominacion: self.tfbuscarAtributo.getValue(),
                        start: 0,
                        limit: 15
                    }
                });
                busc = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiarAtributo = new Ext.Button({
            text: idioma.nomatributo.BtnLimpiar,
            tooltip: idioma.nomatributo.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function () {
                self.tfbuscarAtributo.reset();
                self.stAtributo.load({params: {start: 0, limit: 15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscarAtributo = new Ext.form.TextField({
            allowBlank: true,
            minLength: 3,
            enableKeyEvents: true,

            width: 140,
            name: 'tfbuscador'
        });

        //Fuente de datos del listado.
        this.stAtributo = new Ext.data.Store({
            url: 'getAtributo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idatributo", totalProperty: "cantidad"},
                [{name: 'idatributo'},
                    {name: 'denominacion'},
                    {name: 'descripcion'},
                    {name: 'identidad'},
                    {name: 'idconftipoatributo'},
                    {name: 'primaria'},
                    {name: 'idtipoatributo'},
                    {name: 'denomtipoatributo'},
                    {name: 'denomconftipoatributo'},
                    {name: 'gridheader'},
                    {name: 'orden'},
                    {name: 'ancho'},
                    {name: 'unico'},
                    {name: 'mostrarfiltro'},
                    {name: 'nulo'},
                    {name: 'anchoform'}]
            ),
            listeners: {
                load: function (st) {
                    modselectAtributo = null;
                    self.btnModificarAtributo.disable();
                    self.btnEliminarAtributo.disable();
                    if (busc == 1 && st.getCount() == 0) {
                        mostrarMensaje(1, idioma.nomatributo.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount() == 0) {
                        mostrarMensaje(1, idioma.nomatributo.lbNoDatos);
                    }
                },
                beforeload: function (st) {
                    st.baseParams.identidad = modselect.identidad;
                    st.baseParams.denominacion = self.tfbuscarAtributo.getValue();
                }
            }
        });

        this.gpEntidad.getSelectionModel().on('rowselect', function (n, rowIndex, r) {
            modselect = n.getSelected().data;
            self.btnAdicionarAtributo.enable();
            self.btnModificar.enable();
            self.btnMostrarConceptoSeleccionado.enable();
            self.btnEliminar.enable();
            self.stAtributo.load({
                params: {
                    start: 0,
                    limit: 15,
                    identidad: r.data.identidad
                }
            });


        }, this);

        this.gpEntidad.getSelectionModel().on('rowdeselect', function (n) {

            self.btnMostrarConceptoSeleccionado.disable();
            self.btnModificar.disable();
            self.btnEliminar.disable();
            self.btnAdicionarAtributo.disable();
        }, this);

        self.mascaraGridAtributo = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});
        //Listado de necesidades de capacitacion.
        this.gpAtributo = new Ext.grid.GridPanel({
            store: this.stAtributo,
            region: 'center',
            loadMask: self.mascaraGridAtributo,
            width: screen.width * 0.25,
            plugins: this.expanderAtributo,
            tbar: [
                '-', '',
                idioma.nomatributo.lbDenominacion + ':',
                this.tfbuscarAtributo,
                this.btnBuscarAtributo,
                this.btnLimpiarAtributo, '', '-'
            ],
            columns: [this.expanderAtributo,
                {
                    header: 'Orden',
                    width: 50,
                    dataIndex: 'orden',
                    renderer: mostrartt
                },
                {
                    header: idioma.datentidad.lbDenominacion,
                    width: 200,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: 'Primaria',
                    width: 60,
                    dataIndex: 'primaria',
                    renderer: cambiarRadio
                },
                {
                    header: 'Tipo atributo',
                    width: 100,
                    hidden: true,
                    dataIndex: 'idtipoatributo',
                    renderer: mostrartt
                },
                {
                    header: 'Tipo atributo',
                    width: 100,
                    dataIndex: 'denomtipoatributo',
                    renderer: mostrartt
                },
                {
                    header: 'Configuracion',
                    width: 100,
                    hidden: true,
                    dataIndex: 'idconftipoatributo',
                    renderer: mostrartt
                }, {
                    header: 'Configuración',
                    width: 100,
                    dataIndex: 'denomconftipoatributo',
                    renderer: mostrartt
                },
                {
                    header: 'Header del grid',
                    width: 100,
                    dataIndex: 'gridheader',
                    renderer: mostrartt
                },
                {
                    header: 'Ancho grid',
                    width: 70,
                    dataIndex: 'ancho',
                    // renderer: mostrartt
                },
                {
                    header: 'Único',
                    width: 50,
                    dataIndex: 'unico',
                    renderer: cambiarRadio
                },
                {
                    header: 'Buscador',
                    width: 70,
                    dataIndex: 'mostrarfiltro',
                    renderer: cambiarRadio
                },
                {
                    header: 'Nulo',
                    width: 50,
                    dataIndex: 'nulo',
                    renderer: cambiarRadio
                },
                {
                    header: 'Ancho formulario',
                    width: 100,
                    dataIndex: 'anchoform',
                    //renderer: mostrartt
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stAtributo,
                displayInfo: true
            })
        });


        // panel para add, mod, del, ayuda
        this.panelBotones = new Ext.Panel({
            title: 'Listado de atributos',
            layout: 'fit',
            region: 'north',
            border: false,
            tbar: [
                this.btnAdicionarAtributo,
                this.btnModificarAtributo,
                this.btnEliminarAtributo, '-',
                '->', '', '-', this.btnAyuda]
        });

        this.gpAtributo.getSelectionModel().on('rowselect', function (n) {
            modselectAtributo = n.getSelected().data;
            self.btnModificarAtributo.enable();
            self.btnEliminarAtributo.enable();

        }, this);

        this.gpAtributo.getSelectionModel().on('rowdeselect', function (n) {

            self.btnModificarAtributo.disable();
            self.btnEliminarAtributo.disable();

        }, this);


        //textfield denominacion
        this.tfdenomAtributo = new Ext.form.TextField({
            id: 'tfdenomcAtributo' + self.id,
            fieldLabel: idioma.datentidad.lbDenominacion,
            allowBlank: false,
            maxLength: 100,
            regex: /^[a-z_]*[a-z]+$/,
            regexText: 'Solo admite letras minúsculas y _',
            anchor: '99%',
            name: 'denominacion'
        });

        //textfield gridheader
        this.tfGridHeader = new Ext.form.TextField({
            id: 'tfGridHeader',
            fieldLabel: 'Header del grid',
            allowBlank: false,
            maxLength: 100,
            regexText: idioma.datentidad.msgCaracteres,
            anchor: '99%',
            name: 'gridheader'
        });

        //textfield gridheader
        this.chbPrimaria = new Ext.form.Checkbox({
            fieldLabel: 'Primaria',
            id: 'chbPrimaria',
            name: 'primaria',
            anchor: '99%'
        });

        this.chbPrimaria.on('check',function (_this,checked) {
            if(checked){
                self.tfGridHeader.disable();
                self.chbUnico.disable();
                self.chbNulo.disable();
                self.tfGridHeader.disable();
                self.chbMostrarFiltro.disable();
                self.nfAnchoGrid.disable();
                self.nfAnchoForm.disable();
                self.nfOrden.disable();
                self.cbConfTipoAtributo.disable();
                self.cbTipoAtributo.disable();
                self.tadescripcion.disable();
            }else{
                self.tfGridHeader.enable();
                self.chbUnico.enable();
                self.chbNulo.enable();
                self.tfGridHeader.enable();
                self.chbMostrarFiltro.enable();
                self.nfAnchoGrid.enable();
                self.nfAnchoForm.enable();
                self.nfOrden.enable();
                self.cbConfTipoAtributo.enable();
                self.cbTipoAtributo.enable();
                self.tadescripcion.enable();
            }
            
        });

        this.chbUnico = new Ext.form.Checkbox({
            fieldLabel: 'Único',
            id: 'chbUnico',
            name: 'unico',
            anchor: '99%'
        });

        this.chbNulo = new Ext.form.Checkbox({
            fieldLabel: 'Nulo',
            id: 'chbNulo',
            name: 'nulo',
            anchor: '99%'
        });

        this.chbMostrarFiltro = new Ext.form.Checkbox({
            fieldLabel: 'Buscador',
            id: 'chbMostrarFiltro',
            name: 'mostrarfiltro',
            anchor: '99%'
        });


        this.nfAnchoGrid = new Ext.form.NumberField({
            fieldLabel: 'Ancho grid',
            id: 'nfAnchoGrid',
            name: 'anchogrid',
            anchor: '99%',
            allowBlank: true,
            minValue:50,
            minText: 'El mínimo valor permitido es 50',
            allowDecimals: false,
            allowNegative: false,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.nfAnchoForm = new Ext.form.NumberField({
            fieldLabel: 'Ancho formulario',
            id: 'idnfAnchoForm',
            name: 'anchoform',
            anchor: '99%',
            allowBlank: true,
            maxValue: 1,
            maxText: 'El máximo valor permitido es 1',
            minValue: 0.00000000000001,
            minText: 'El mínimo valor permitido es 0.00000000000001',
            /*regex: /^([0-9.]+)$/,
            maskRe: /^([0-9.]+)$/,*/
            allowDecimals: true,
            allowNegative: true,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.nfOrden = new Ext.form.NumberField({
            fieldLabel: 'Orden',
            id: 'nfOrden',
            name: 'orden',
            anchor: '99%',
            allowBlank: true,
            allowDecimals: false,
            allowNegative: false,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.stcbTipoAtributo = new Ext.data.SimpleStore({
            fields: ['idtipoatributo', 'denominacion'],
            data: [
                [1, 'texto'],
                [2, 'fecha'],
                [3, 'numero'],
                [4, 'logico'],
                [5, 'lista'],
                [6, 'imagen'],
                [7, 'oculto']
            ]
        });

        this.hcbTipoAtributo = new Ext.form.Hidden({
            id: 'hcbTipoAtributo',
            name: 'idtipoatributo'
        });

        this.cbTipoAtributo = new Ext.form.ComboBox({
            fieldLabel: 'Tipo atributo',
            anchor: '100%',
            store: self.stcbTipoAtributo,
            valueField: 'idtipoatributo',
            displayField: 'denominacion',
            hiddenName: 'idtipoatributocombo',
            name: 'idtipoatributocombo',
            triggerAction: 'all',
            forceSelection: true,
            mode: 'local',
            emptyText: 'Seleccione...',
            allowBlank: false,
            listeners: {
                select: function (combo, record, index) {
                    Ext.getCmp('hcbTipoAtributo').setValue(combo.getValue());
                    habilitarTodo();
                    var consulta = 'SELECT idconftexto as idconftipoatributo,denominacion FROM mod_nomdinamicos.conf_texto';
                    switch (record.data.idtipoatributo) {
                        //texto
                        case 1:
                            consulta = 'SELECT idconftexto as idconftipoatributo,denominacion FROM mod_nomdinamicos.conf_texto';
                            break;
                        //Fecha
                        case 2:
                            consulta = 'SELECT idconffecha as idconftipoatributo,denominacion FROM mod_nomdinamicos.conf_fecha';
                            break;
                        //Numero
                        case 3:
                            consulta = 'SELECT idconfnumero as idconftipoatributo,denominacion FROM mod_nomdinamicos.conf_numero';
                            break;
                        //Logico
                        case 4:
                            consulta = 'SELECT idconflogico as idconftipoatributo,denominacion FROM mod_nomdinamicos.conf_logico';
                            break;
                        //Lista
                        case 5:
                            consulta = 'SELECT idconflista as idconftipoatributo,denominacion FROM mod_nomdinamicos.conf_lista';
                            break;
                        //Imagen
                        case 6:
                            self.cbConfTipoAtributo.disable();
                            return;
                            break;
                        //Oculto
                        case 7:
                            deshabilitarOcultar();
                            return;
                            break;

                    }

                    listarFilasCombo(self.stcbConfTipoAtributo, consulta);
                }
            }
        });






        function listarFilasCombo(store, consulta) {

            Ext.Ajax.request({
                url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
                method: 'POST',
                params: {
                    metodo: 'listarGenerico',
                    consulta: consulta
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.success) {
                        store.loadData(respuesta);
                    } else {
                        var error = respuesta.error;
                        self.mostrarError(error, self, 1);
                    }
                }
            });
        }

        function deshabilitarOcultar() {
            function deshabilitar(elemento) {
                if(elemento.disabled===false){
                    elemento.disable()
                }
            }
            deshabilitar(self.cbConfTipoAtributo);
            deshabilitar(self.nfOrden);
            deshabilitar(self.tfGridHeader);
            deshabilitar(self.nfAnchoForm);
            deshabilitar(self.nfAnchoGrid);
            deshabilitar(self.chbMostrarFiltro);
            deshabilitar(self.chbPrimaria);
            deshabilitar(self.chbNulo);
            deshabilitar(self.chbUnico);


        }

        function habilitarTodo() {

            function habilitar(elemento) {
                if(elemento.disabled===true){
                    elemento.enable()
                }
            }
            habilitar(self.cbConfTipoAtributo);
            habilitar(self.cbTipoAtributo);
            habilitar(self.nfOrden);
            habilitar(self.tfGridHeader);
            habilitar(self.nfAnchoForm);
            habilitar(self.nfAnchoGrid);
            habilitar(self.chbMostrarFiltro);
            habilitar(self.chbPrimaria);
            habilitar(self.chbNulo);
            habilitar(self.chbUnico);

        }

        this.stcbConfTipoAtributo = new Ext.data.Store({

            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                fields: ['idconftipoatributo', 'denominacion']
            })
        });

        this.hcbConfTipoAtributo = new Ext.form.Hidden({
            id: 'hcbConfTipoAtributo',
            name: 'idconftipoatributo'
        });

        this.cbConfTipoAtributo = new Ext.form.ComboBox({
            fieldLabel: 'Configuración atributo',
            anchor: '100%',
            store: self.stcbConfTipoAtributo,
            valueField: 'idconftipoatributo',
            displayField: 'denominacion',
            hiddenName: 'idconftipoatributocombo',
            name: 'idconftipoatributocombo',
            triggerAction: 'all',
            forceSelection: true,
            mode: 'local',
            disabled:true,
            emptyText: 'Seleccione...',
            allowBlank: false,
            listeners: {
                select: function (combo, record, index) {
                    Ext.getCmp('hcbConfTipoAtributo').setValue(combo.getValue());
                }
            }
        });


        // Area de texto Descripción del curso
        this.tadescripcionAtributo = new Ext.form.TextArea({
            fieldLabel: idioma.datentidad.lbDescripcion,
            name: 'descripcionAtributo',
            anchor: '99%',
            hiddenname: 'descripcion',
            // maxLength: 255,
            /*regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,*/
            regexText: idioma.datentidad.lbRegexTextDescripcion,
            allowBlank: true
        });

        //Formulario de gestion.
        this.formularioGestionAtributo = new Ext.FormPanel({
            labelAlign: 'top',
            autoHeight: true,
            frame: true,
            bodyStyle: 'padding:3px;margin:3px',
            items: [{
                layout: 'column',
                // bodyStyle: 'padding:3px;margin:3px',
                items: [
                    self.hcbTipoAtributo,
                    self.hcbConfTipoAtributo,
                    {
                        columnWidth: 0.2,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.nfOrden]
                    },
                    {
                        columnWidth: 0.8,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.tfdenomAtributo]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.tfGridHeader]
                    },
                    {
                        columnWidth: 0.25,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.chbPrimaria]
                    },
                    {
                        columnWidth: 0.25,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.chbMostrarFiltro]
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.chbNulo]
                    },
                    {
                        columnWidth: 0.25,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.chbUnico]
                    },

                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.nfAnchoForm]
                    },
                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.nfAnchoGrid]
                    },
                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.cbTipoAtributo]
                    },
                    {
                        columnWidth: 0.5,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.cbConfTipoAtributo]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        bodyStyle: 'padding:3px',
                        items: [self.tadescripcionAtributo]
                    }
                ]
            }]
        });

        this.btnCancelarAtributo = new Ext.Button({
            nextTab: 'tfdenomc' + self.id,
            iconCls: 'cancelar',
            tooltip: idioma.datentidad.textToolTipCancelar,
            text: idioma.datentidad.lbtnCancelar,
            handler: function () {
                self.formularioGestionAtributo.getForm().reset();
                self.ventanaGestionAtributo.hide();
            }.createDelegate(this)
        });

        this.btnAceptarAtributo = new Ext.Button({
            nextTab: 'tfdenomc' + self.id,
            iconCls: 'aceptar',
            tooltip: idioma.datentidad.textToolTipAceptar,
            text: idioma.datentidad.lbtnAceptar,
            listeners: {
                'enable': function () {
                    self.btnCancelarAtributo.nextTab = 'btnAplicarc';
                },
                'disable': function () {
                    self.btnCancelarAtributo.nextTab = 'tfdenomc' + self.id;
                }
            },
            handler: function () {
                guardarDatosAtributo('ACP');
            }.createDelegate(this)
        });

        this.btnAplicarAtributo = new Ext.Button({
            id: 'btnAplicarc',
            iconCls: 'aplicar',
            tooltip: idioma.nomatributo.textToolTipAplicar,
            text: idioma.datentidad.lbtnAplicar,
            handler: function () {
                guardarDatosAtributo('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestionAtributo = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 500,
            autoHeight: true,
            items: [this.formularioGestionAtributo],
            buttons: [
                this.btnCancelarAtributo,
                this.btnAplicarAtributo,
                this.btnAceptarAtributo
            ],
            listeners: {
                'beforeshow': function () {
                    self.tfdenomAtributo.focus(true, 500);
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnCancelarAtributo.disabled) {
                        self.btnCancelarAtributo.handler();
                    }
                }
            },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarAtributo.disabled) {
                            self.btnAplicarAtributo.handler();
                        }
                    }
                },
                {
                    key: 13,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarAtributo.disabled) {
                            self.btnAceptarAtributo.handler();
                        }
                    }
                }]
        });


        this.ventanaGestionAtributo.on('hide', function () {
            self.btnAdicionarAtributo.focus();
        });


        this.keys = [
            {
                key: 'i',
                alt: true,
                fn: function () {
                    if (!self.btnAdicionar.disabled) {
                        self.btnAdicionar.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnModificar.disabled) {
                        self.btnModificar.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                fn: function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ];


        this.panelDerecho = new Ext.Panel({
            layout: 'border',
            collapsible: true,
            split: true,
            region: 'south',
            height: (screen.height * 0.5) - 100,
            border: false,
            items: [this.panelBotones, this.gpAtributo]
        });


        function guardarDatosAtributo(btnpress) {

            if (self.formularioGestionAtributo.getForm().isValid()) {
                Ext.Ajax.request({
                    url: (accionAtributo == 'add' ? 'addAtributo' : 'modAtributo'),
                    params: {
                        idatributo: accionAtributo == 'add' ? -1 : modselectAtributo.idatributo,
                        identidad: modselect.identidad,
                        descripcion: self.tadescripcionAtributo.getValue(),
                        denominacion: self.tfdenomAtributo.getValue(),
                        gridheader: self.tfGridHeader.getValue(),
                        unico: self.chbUnico.getValue(),
                        nulo: self.chbNulo.getValue(),
                        mostrarfiltro: self.chbMostrarFiltro.getValue(),
                        primaria: (self.chbPrimaria.getValue())?'on':'off',
                        ancho: (self.nfAnchoGrid.getValue())?self.nfAnchoGrid.getValue():null,
                        anchoform: (self.nfAnchoForm.getValue())?self.nfAnchoForm.getValue():null,
                        orden: (self.nfOrden.getValue())?self.nfOrden.getValue():null,
                        idconftipoatributo: (self.hcbConfTipoAtributo.getValue())?self.hcbConfTipoAtributo.getValue():null,
                        idtipoatributo: (self.hcbTipoAtributo.getValue())?self.hcbTipoAtributo.getValue():null
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        console.log(responseData);

                        if (responseData != false) {
                            if (responseData === 'pkduplicada') {
                                mostrarMensaje(8, 'Ya existe una llave primaria');
                            } else {
                                if (accionAtributo == 'mod') {
                                    mostrarMensaje(1, idioma.nomatributo.msgModCSucces);
                                } else {
                                    mostrarMensaje(1, idioma.nomatributo.msgAddCSucces);
                                }
                                if (btnpress == 'ACP') {
                                    self.ventanaGestionAtributo.hide();
                                }
                                self.formularioGestionAtributo.getForm().reset();
                                self.stAtributo.removeAll();
                                self.stAtributo.reload();
                            }


                        } else {
                            if (accionAtributo == 'mod') {
                                mostrarMensaje(1, idioma.nomatributo.msgModCExistem);
                            } else {
                                mostrarMensaje(1, idioma.nomatributo.msgAddCExistem);
                            }
                        }
                    }
                });
            }
        }

        function eliminarAtributo() {
            var ids = new Array();
            var s = self.gpAtributo.getSelectionModel().getSelections();
            for (i = 0; i < s.length; i++) {
                ids.push(s[i].data.idatributo);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el atributo seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los atributos seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.datentidad.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: 'delAtributo',
                        params: {atributos: Ext.encode(ids)},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El atributo seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Algunos de los atributos no pueden ser eliminados debido a que se encuentran en' +
                                        ' uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El atributo ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los atributos seleccionados han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stAtributo.removeAll();
                            self.stAtributo.reload();
                        }
                    });
                }
            });
        }

        this.panelPrincipal = new Ext.Panel(
            {
                layout: 'border',
                region: 'east',
                width: screen.width * 0.7,
                collapsible: true,
                split: true,
                //tbar: ['->', self.btnAyuda],
                items: [self.panelDerecho, self.panelCentral]

            });
        //return this.panelPrincipal;


    }
};