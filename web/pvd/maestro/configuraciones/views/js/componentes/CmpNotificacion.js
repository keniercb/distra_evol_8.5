/**
 * Script para definir el componente visual de la configuración "Notificaciones".
 * @file CmpNotificacion.js
 * @package PVD.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 19/10/2017 Ing. Orestes Rodríguez Lorenzo
 * @version 1.0.0
 */

Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.CmpNotificacion = Ext.extend(Ext.Panel, {
    id: 'pNotificacion',
    layout: 'border',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        /* Inicializando componente */
        var self = this;
        this.accion = 'add';
        this.setTitle(this.idioma.tituloTab);
        /***** Barra de herramientas *****/
        //Adicionar
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: this.idioma.gestion.btn_TextAdd,
            tooltip: this.idioma.gestion.btn_ttAdd,
            iconCls: 'adicionar',
            handler: function () {
                self.ventanaGestion.setTitle(self.idioma.ventana.win_TituloAdd);
                self.ventanaGestion.show();
                self.accion = 'add';
            }
        });
        //Modificar
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: this.idioma.gestion.btn_TextMod,
            tooltip: this.idioma.gestion.btn_ttMod,
            iconCls: 'modificar',
            handler: function () {
                self.ventanaGestion.setTitle(self.idioma.ventana.win_TituloMod);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.accion = 'mod';
                self.cbDominio.setValue(self.smNotificacion.getSelected().get('iddominio'));
                self.cbDominio.setRawValue(self.smNotificacion.getSelected().get('dominio'));
                self.tfServidor.setValue(self.smNotificacion.getSelected().get('servidor'));
                self.nfPuerto.setValue(self.smNotificacion.getSelected().get('puerto'));
                if (self.smNotificacion.getSelected().get('smtpaut') === 0)
                    self.fsSMTPAuth.collapse();
                self.tfRemitente.setValue(self.smNotificacion.getSelected().get('remitente'));
                self.tfPassword.setValue(Base64.decode(self.smNotificacion.getSelected().get('contrasena')));
                self.tfNombreRemitente.setValue(self.smNotificacion.getSelected().get('nombremitente'));
            }
        });
        //Eliminar
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: this.idioma.gestion.btn_TextDel,
            tooltip: this.idioma.gestion.btn_ttDel,
            iconCls: 'eliminar',
            handler: function () {
                self.accion = 'del';
                var ids = new Array();
                var sm = self.gpNotificacion.getSelectionModel().getSelections();
                for (var i = 0; i < sm.length; i++) {
                    ids.push(sm[i].id);
                }
                var msg = '';
                var msg_mask = '';
                var msg_ok_del = '';
                if (ids.length > 1) {
                    msg = self.idioma.mensajes.confirm_dels;
                    msg_mask = self.idioma.mensajes.mask_dels;
                    msg_ok_del = self.idioma.mensajes.success_dels;
                } else {
                    msg = self.idioma.mensajes.confirm_del;
                    msg_mask = self.idioma.mensajes.mask_del;
                    msg_ok_del = self.idioma.mensajes.success_del;
                }
                mostrarMensaje(2, msg, function (btnMsgPress) {
                    if (btnMsgPress == 'ok') {
                        Ext.getBody().mask(msg_mask);
                        Ext.Ajax.request({
                            url: '/pvd/maestro/configuraciones/index.php/notificacion/gestionarConfiguraciones',
                            params: {
                                accion: self.accion,
                                idnotificacion: Ext.encode(ids)
                            },
                            callback: function (options, success, response) {
                                if (success) {
                                    var r = Ext.decode(response.responseText);
                                    if (r.exito) {
                                        mostrarMensaje(1,msg_ok_del);
                                        self.stNotificacion.reload();
                                    } else {
                                        mostrarMensaje(6, self.idioma.mensajes.error_generico);
                                    }
                                } else {
                                    mostrarMensaje(6, self.idioma.mensajes.error_generico);
                                }
                                Ext.getBody().unmask();
                            }
                        });
                    }
                });
            }
        });
        //Barra de herramientas
        this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar];
        /*** Grid ***/
        //Store
        this.stNotificacion = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/notificacion/obtenerConfig',
            reader: new Ext.data.JsonReader({
                root: "", id: "idnotificacion"
            }, [
                {name: 'idnotificacion'},
                {name: 'identidad'},
                {name: 'iddominio'},
                {name: 'servidor'},
                {name: 'puerto'},
                {name: 'smtpaut'},
                {name: 'remitente'},
                {name: 'nombremitente'},
                {name: 'dominio'},
                {name: 'contrasena'}
            ]),
            listeners: {
                load: function () {
                    habilitarAcciones(false);
                }
            }
        });
        this.stNotificacion.load();
        //Selection model
        this.smNotificacion = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                'selectionchange': function () {
                    habilitarAcciones();
                }
            }
        });
        //Row expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>' + this.idioma.grid.row_exp1 + ': </b> {remitente}</p>' +
                '<p><b>' + this.idioma.grid.row_exp2 + ': </b> {nombremitente}</p>'
            )
        });
        //GridPanel
        this.gpNotificacion = new Ext.grid.GridPanel({
            store: this.stNotificacion,
            sm: this.smNotificacion,
            loadMask: {msg: this.idioma.grid.loadMask},
            region: 'center',
            autoScroll: true,
            plugins: this.expander,
            columns: [
                this.expander,
                {header: this.idioma.grid.columna1, width: 300, dataIndex: 'dominio'},
                {header: this.idioma.grid.columna2, width: 300, dataIndex: 'servidor'},
                {header: this.idioma.grid.columna3, width: 100, dataIndex: 'puerto'},
                {header: this.idioma.grid.columna4, width: 100,  align: 'center', dataIndex: 'smtpaut', renderer: renderizarAuth},
            ]
        });
        /*** Ventana de gestión ***/
        //Dominio de solución
        this.stDominio = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/notificacion/obtenerDominios',
            reader: new Ext.data.JsonReader(
                {root: "", id: "iddominio"},
                [{name:'iddominio'},{name:'denominacion'}]
            )
        });
        this.cbDominio = new Ext.form.ComboBox({
            id: 'cbDominio'+self.id,
            store: this.stDominio,
            displayField: 'denominacion',
            valueField: 'iddominio',
            hiddenName: 'iddominio',
            forceSelection: true,
            fieldLabel: this.idioma.formulario.cb_lbDominio,
            typeAhead: true,
            allowBlank: false,
            anchor: '100%',
            width: '100%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: this.idioma.formulario.cb_emptyText,
            editable: false
        });
        //Servidor SMTP
        this.tfServidor = new Ext.form.TextField({
            id: 'tfServidor'+self.id,
            fieldLabel: this.idioma.formulario.tf_servidor,
            allowBlank : false,
            minLength: 3,
            maxLength: 200,
            enableKeyEvents: true,
            anchor:	'99%',
            name : 'servidor'
        });
        //Puerto
        this.nfPuerto = new Ext.form.NumberField({
            id: 'nfPuerto' + self.id,
            fieldLabel: this.idioma.formulario.nf_puerto,
            allowBlank: false,
            allowNegative: false,
            maxLength: 5,
            minValue: 0,
            maxValue: 65535,
            maxLengthText: this.idioma.formulario.nf_maxpuerto,
            anchor: '99%',
            name: 'puerto'
        });
        //Remitente
        this.tfNombreRemitente = new Ext.form.TextField({
            id: 'tfNombreRemitente'+self.id,
            fieldLabel: this.idioma.formulario.tf_nombremitente,
            minLength: 3,
            maxLength: 200,
            enableKeyEvents: true,
            anchor:	'100%',
            name : 'nombremitente'
        });
        //Remitente
        this.tfRemitente = new Ext.form.TextField({
            id: 'tfRemitente'+self.id,
            fieldLabel: this.idioma.formulario.tf_remitente,
            minLength: 3,
            maxLength: 200,
            enableKeyEvents: true,
            anchor:	'99%',
            name : 'remitente'
        });
        //Password
        this.tfPassword = new Ext.form.TextField({
            id: 'tfPassword'+self.id,
            fieldLabel: this.idioma.formulario.tf_passwd,
            inputType: 'password',
            minLength: 3,
            maxLength: 200,
            enableKeyEvents: true,
            anchor:	'100%',
            name : 'contrasena'
        });
        this.fsSMTPAuth = new Ext.form.FieldSet({
            title: this.idioma.formulario.fs_smtpauth,
            name: 'smtpauth',
            id: 'fsSMTPAuth',
            checkboxToggle: true,
            collapsed: false,
            layout: 'column',
            autoHeight: true,
            width: 322,
            items: [
                {
                    columnWidth: .5,
                    layout: 'form',
                    items: this.tfRemitente
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.tfPassword]
                }, {
                    columnWidth: 1.0,
                    layout: 'form',
                    items: [this.tfNombreRemitente]
                }
            ],
            listeners: {
                'collapse': function() {
                    self.ventanaGestion.setHeight(210);
                    establecerObligatorio(false);
                },
                'expand': function() {
                    self.ventanaGestion.setHeight(330);
                    establecerObligatorio(true);
                }
            }
        });
        //Botón aplicar
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            iconCls: 'aplicar',
            text: this.idioma.formulario.btn_textAplicar,
            tooltip: this.idioma.formulario.btn_ttipAplicar,
            handler: function () {
                guardarDatos('APL');
            }.createDelegate(this)
        });
        //Botón aceptar
        this.btnAceptar = new Ext.Button({
            nextTab: 'cbDominio'+self.id,
            iconCls: 'aceptar',
            text: this.idioma.formulario.btn_textAceptar,
            tooltip:this.idioma.formulario.btn_ttipAceptar,
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });
        //Botón cancelar
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            text: this.idioma.formulario.btn_textCancelar,
            tooltip:this.idioma.formulario.btn_ttipCancelar,
            handler: function () {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });
        /* Formulario */
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.cbDominio]
                }, {
                    columnWidth: .7,
                    layout: 'form',
                    items: [this.tfServidor]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [this.nfPuerto]
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.fsSMTPAuth]
                }]
            },{
                xtype: 'hidden',
                name: 'idnotificacion'
            }]
        });
        /* Ventana */
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            closable: true,
            resizable: false,
            constrain: true,
            layout: 'fit',
            width: 360,
            height: 330,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {'beforeshow': function() {self.stDominio.load();}}
        });
        /*** Elementos del panel general ***/
        this.items = [this.gpNotificacion];
        /***** Funciones generales *****/
        //Función para renderizar los elementos no gestionables en el grid
        function renderizarAuth(val, metaData, record) {
            if (record.get('smtpaut') == 1) {
                    return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
            }
        }
        //Función para habilitar las acciones
        function habilitarAcciones(habilitar) {
            if (self.smNotificacion.getCount() > 0) {
                if (self.smNotificacion.getCount() > 1) {
                    self.btnModificar.disable();
                    var sgest = false;
                    var selections = self.smNotificacion.getSelections();
                    for(var i = 0; i < self.smNotificacion.getCount(); i++) {
                        if(selections[i].data.gestion == 0) {
                            sgest = true;
                        }
                    }
                    if (sgest) {
                        self.btnEliminar.disable();
                    } else {
                        self.btnEliminar.enable();
                    }
                } else {
                    if(self.smNotificacion. getSelected().data.gestion == 0) {
                        self.btnModificar.disable();
                        self.btnEliminar.disable();
                    } else {
                        self.btnModificar.enable();
                        self.btnEliminar.enable();
                    }
                }
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
        }
        //Función para establecer campos obligatorios
        function establecerObligatorio(obligatorio) {
            if(obligatorio) {
                self.tfRemitente.allowBlank = false;
            } else {
                self.tfRemitente.allowBlank = true;
            }
        }
        //Función para guardar datos
        function guardarDatos(btnpress) {
            if(self.formularioGestion.getForm().isValid()) {
                Ext.Ajax.request({
                    url: '/pvd/maestro/configuraciones/index.php/notificacion/gestionarConfiguraciones',
                    params: {
                        accion: self.accion,
                        idnotificacion: self.accion == 'add' ? -1 : self.gpNotificacion.getSelectionModel().getSelected().get('idnotificacion'),
                        iddominio: self.cbDominio.getValue(),
                        servidor: self.tfServidor.getValue(),
                        puerto: self.nfPuerto.getValue(),
                        smtpaut: self.tfRemitente.getValue() != null ? 1 : 0,
                        remitente: self.tfRemitente.getValue(),
                        nombremitente: self.tfNombreRemitente.getValue(),
                        contrasena: Base64.encode(self.tfPassword.getValue())
                    },
                    callback: function (options, success, response) {
                        if (success) {
                            var r = Ext.decode(response.responseText);
                            if (r.exito) {
                                if (self.accion == 'add')
                                    mostrarMensaje(1, self.idioma.mensajes.success_add);
                                else if (self.accion == 'mod')
                                    mostrarMensaje(1, self.idioma.mensajes.success_add);
                            } else {
                                if (Object.keys(r.excepcion).length === 0) {
                                    mostrarMensaje(6, self.idioma.mensajes.error_generico);
                                }
                                else {
                                    mostrarMensaje(4, self.idioma.mensajes.error_generico, null, r.excepcion);
                                }
                            }
                        } else {
                            mostrarMensaje(6,'fail');
                        }
                        if (btnpress == 'ACP')
                            self.ventanaGestion.hide();
                        self.stNotificacion.reload();
                        self.formularioGestion.getForm().reset();
                    }
                });
            }
        }
        Pvd.Maestro.Configuraciones.CmpNotificacion.superclass.initComponent.call(this);
    }
});