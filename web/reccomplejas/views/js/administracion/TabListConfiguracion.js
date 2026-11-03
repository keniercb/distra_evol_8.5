Ext.apply(Ext.form.VTypes, {
    password: function (val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },
    passwordText: 'Las claves no coinciden'
});
Ext.ns('Ext.reccomplejas');

Ext.reccomplejas.WinCodeEditor = Ext.extend(Ext.Window, {
    title: 'Texto',
    width: 350,
    height: 250,
    layout: 'fit',
    modal: true,
    maximizable: true,
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.textArea = new Ext.form.HtmlEditor({
            value: this.value,
            width: 800,
            height: 300,
			maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
			regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
			regexText:this.idioma.MsgAlert
        });
        this.items = [this.textArea];
		this.btnAceptarWinCodeEditor = new Ext.Button({
			text: this.idioma.btnAceptar,
			iconCls:'aceptar',
			tooltip:this.idioma.tooltipBtnAceptar,
			handler: function () {
                self.fireEvent('acepted', self.textArea.getValue());
                self.close();
            }
		});
		this.btnCancelarWinCodeEditor = new Ext.Button({
			text: this.idioma.btnCancelar,
			iconCls:'cancelar',
			tooltip: this.idioma.tooltipBtnCancelar,
			handler: function () {
					self.close();
            }
		});
        this.keys=[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){self.btnAceptarWinCodeEditor.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){self.btnCancelarWinCodeEditor.handler();}
		}
		];
		this.buttons = [this.btnCancelarWinCodeEditor,this.btnAceptarWinCodeEditor];
        Ext.reccomplejas.WinCodeEditor.superclass.initComponent.call(this);
        this.on('show', function () {
            self.textArea.toggleSourceEdit(true);
        });
    }
});
Ext.reccomplejas.WinGenerarProyecto = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    plain: true,
    title: 'Generar proyecto',
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.fpGenProy = new Ext.FormPanel({
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            defaults: {width: 350},
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'Identificador',
                    name: 'idconfiguracion',
                    value: this.idconfiguracion,
					maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
					regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
					regexText:this.idioma.MsgAlert,
                    readOnly: true
                },
                {
                    fieldLabel: 'Titulo del listado',
                    name: 'tituloListado',
                    value: 'Listado de personas',
					maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
					regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
					regexText:this.idioma.MsgAlert,
                    allowBlank: false,
                    maxLength: 255
                },
                {
                    fieldLabel: 'Titulo del reporte',
                    name: 'tituloReporte',
                    value: 'Reporte de personas',
					maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
					regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
					regexText:this.idioma.MsgAlert,
                    allowBlank: false,
                    maxLength: 255
                },
                {
                    fieldLabel: 'Titulo de la configuracion',
                    name: 'tituloConf',
                    value: 'Configuracion',
					maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
					regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
					regexText:this.idioma.MsgAlert,
                    allowBlank: false,
                    maxLength: 255
                },
                {
                    hideLabel: true,
                    width: 450,
                    xtype: 'checkboxgroup',
                    columns: 2,
                    items: [
                        {boxLabel: 'Ocultar boton exportar', name: 'hideBtnRtf', checked: false, },
                        {boxLabel: 'Usar mapa', name: 'useMap', checked: false},
                        {boxLabel: 'No usar gestor de avisos', name: 'noUsarGestAvisos', checked: false},
                        {boxLabel: 'Ocultar boton de cantidad', name: 'hideBtnOperCant', checked: false},
                        {boxLabel: 'Permitir reporte de seleccion simple', name: 'allowSingleSelectReport', checked: false}
                    ]
                }
            ]
        });
        this.items = [this.fpGenProy];
		this.btnAceptarWinGenerarProyecto = new Ext.Button({
			text: this.idioma.btnAceptar,
			iconCls: 'aceptar',
			tooltip:this.idioma.tooltipBtnAceptar,
			handler: function () {
				if (self.fpGenProy.getForm().isValid()) {
					var formValues = self.fpGenProy.getForm().getValues();
					var hideBtnRtf = (formValues.hideBtnRtf == "on") ? true : false;
					var useMap = (formValues.useMap == "on") ? true : false;
					var noUsarGestAvisos = (formValues.noUsarGestAvisos == "on") ? true : false;
					var hideBtnOperCant = (formValues.hideBtnOperCant == "on") ? true : false;
					var allowSingleSelectReport = (formValues.allowSingleSelectReport == "on") ? true : false;
					var code = "var cmpRecomplejas = new Ext.components.Reccomplejas({\n" +
							"    idconfiguracion=" + "'" + formValues.idconfiguracion + "',\n"
							+ '    tituloListado=' + "'" + formValues.tituloListado + "',\n"
							+ '    tituloReporte=' + "'" + formValues.tituloReporte + "',\n"
							+ '    tituloConf=' + "'" + formValues.tituloConf + "',\n"
							+ '    hideBtnRtf=' + "'" + hideBtnRtf + "',\n"
							+ '    useMap=' + "'" + useMap + "',\n"
							+ '    noUsarGestAvisos =' + "'" + noUsarGestAvisos + "',\n"
							+ '    hideBtnOperCant=' + "'" + hideBtnOperCant + "',\n"
							+ '    allowSingleSelectReport=' + "'" + allowSingleSelectReport + "'\n"
							+ '});'
						;
					var win = new Ext.reccomplejas.WinCodeEditor({
						width: 450,
						height: 350,
						value: code
					});
					win.show();
					self.close();
				}
			}
		 });
		this.btnCancelarWinGenerarProyecto = new Ext.Button({
			text: this.idioma.btnCancelar,
			iconCls: 'cancelar',
			tooltip: this.idioma.tooltipBtnCancelar,
			handler: function () {
				self.close();
			}
		 });
         this.keys=[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){self.btnAceptarWinGenerarProyecto.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){self.btnCancelarWinGenerarProyecto.handler();}
		}
		];
		this.buttons = [this.btnCancelarWinGenerarProyecto,this.btnAceptarWinGenerarProyecto];
        Ext.reccomplejas.WinGenerarProyecto.superclass.initComponent.call(this);
    }
});
Ext.reccomplejas.WinGestConfig = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    plain: true,
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
			tooltip:this.idioma.tooltipBtnCancelar,
            text: this.idioma.btnCancelar,
            handler: function () {
			   self.close();
            }
        });
		this.on('close',function(){
			if(self.accion == 'mod' && self.pass){
				self.parent.parent.btnAdd.focus();
			 }
			 else{
				 self.parent.btnAdd.focus();
			 }
		});
        var btnAplicar= new Ext.Button({
            iconCls: 'aplicar',
			tooltip:this.idioma.tooltpBtnAplicar,
			id:'btnAplicar'+self.id,
            text: this.idioma.btnAplicar,
            hidden: this.accion == ('mod'||'dup')? true : false,
            handler: function () {
                enviarDatos('aplicar');
            }
        });
        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
			tooltip:this.idioma.tooltipBtnAceptar,
			id:'btnAceptar'+self.id,
			nextTab:'idconfiguracion'+self.id,
			prevTab:'btnAplicar'+self.id,
            text: this.idioma.btnAceptar,
            handler: this.accion=='dup'?
				function(){
					if (self.fpGestConfig.getForm().isValid()) {
					 PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgAddConfAccion);
					 Ext.Ajax.request({
		        		url:'duplicarConfiguracion',
		        		params:{
							idConfigOrigal:	self.parent.getSelectionModel().getSelected().get('idconfiguracion'),
							idconfiguracion:self.fpGestConfig.getForm().findField('idconfiguracion').getValue(),
		        			denominacion:   self.fpGestConfig.getForm().findField('denominacion').getValue(),
							password:       self.fpGestConfig.getForm().findField('claveproteccion').getValue()
		        		},callback: function (options, success, response){
							self.close();
							PVD.ocultarMascara('idmskmodify');
							responseData = Ext.decode(response.responseText);
							if(responseData.duplicarOK==1){
								Ext.Notification.show({
									title: self.idioma.titleInfo,
									msg: self.idioma.MsgAddConfOK,
									time: 3
								});
							self.parent.getStore().reload();
							}
						}

					});
				}else{
					Ext.Notification.show({
                        title: self.idioma.titleInfo,
                        msg: self.idioma.MsgDatosFail,
                        time: 3
                    });
				}
				}:
				function () {
					enviarDatos(self.idioma.btnAceptar);
				}
        });
        function enviarDatos(btn) {
            if (self.fpGestConfig.getForm().isValid()) {
                var values = self.fpGestConfig.getForm().getValues();
                values.accion = self.accion;
                PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgAddConfAccion);
                Ext.Ajax.request({
                    url: 'adicionarConfiguracion',
                    method: 'POST',
                    params: values,
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idmskmodify');
						responseData = Ext.decode(response.responseText);
						if(self.accion == 'add' && responseData.existe){
							Ext.Notification.show({
								title:self.idioma.titleInfo,
								msg:self.idioma.MsgAddConfExiste,
								time: 3
							});
							self.close();
						}
						else{
							self.parent.getStore().reload();
							Ext.Notification.show({
								title:self.idioma.titleInfo,
								msg: self.accion == 'add' ? self.idioma.MsgAddConfOK : self.idioma.MsgModConfOK,
								time: 3
							});
							if (btn === self.idioma.btnAceptar) {
								self.close();
							} else {
								self.fpGestConfig.getForm().reset();
							}
						}
                    }
                });
            }
        }
		this.idConfiguracion=new Ext.form.TextField({
			fieldLabel: this.idioma.tfIdentificador,
            name: 'idconfiguracion',
			id:'idconfiguracion'+self.id,
			prevTab:'btnAceptar'+self.id,
			maskRe : /^([_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
			regex : /^([_a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[_a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
			regexText:this.idioma.MsgAlert,
            allowBlank: false,
            readOnly: this.accion == 'mod' ? true : false,
            maxLength: 30
		});
		this.denominacion=new Ext.form.TextField({
            fieldLabel: this.idioma.tfDenominacion,
            name: 'denominacion',
            allowBlank: false,
            maxLength: 255,
			maskRe : /^([_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
			regex : /^([_a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[_a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
			regexText:this.idioma.MsgAlert
        });
		this.password=new Ext.form.TextField({
            fieldLabel: this.idioma.tfClave,
            name: 'claveproteccion',
            id: 'claveproteccion' + self.id,
			maxLength: 50,
        });
		this.servidor=new Ext.form.TextField({
            fieldLabel: this.idioma.tfServidor,
            name: 'servidor',
            allowBlank: false,
			vtype:'vtdirip',
            maxLength: 15
        });
		this.puerto=new Ext.form.TextField({
            fieldLabel: this.idioma.tfPerto,
            name: 'puerto',
            allowBlank: false,
            maxLength: 4,
            xtype: 'numberfield',
			maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
			regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
			regexText:this.idioma.MsgAlert,
			value: 5432
        });
		this.basedato=new Ext.form.TextField({
            fieldLabel: this.idioma.tfBD,
            name: 'basedato',
            allowBlank: false,
			regexText:this.idioma.MsgAlert,
            maxLength: 100
        });
		this.usuario=new Ext.form.TextField({
            fieldLabel:this.idioma.tfUsuario,
            name: 'usuario',
            allowBlank: false,
			maskRe : /^([_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
			regex : /^([_a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[_a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
			regexText:this.idioma.MsgAlert,
			maxLength: 100
        });
		this.contrasena=new Ext.form.TextField({
            fieldLabel: this.idioma.tfContrasenna,
            name: 'contrasena',
            allowBlank: false,
            maxLength: 50,
            inputType: 'password'
        });
		this.esquema=new Ext.form.TextField({
            fieldLabel: this.idioma.tfEsquema,
            name: 'esquema',
            readOnly: true
        });
        this.tablaBase = new Ext.components.CmpReccomplejas.TreeComboBox({
            id: 'aux' + this.id,
            fieldLabel: 'Tabla',
            name: 'tabla',
            treeConfig: {
                rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: 'getMetadato',
                    preloadChildren: false,
                    listeners: {
                        beforeload: function (tloader, node, response) {
                            var values = self.fpGestConfig.getForm().getValues();
                            tloader.baseParams.servidor = values.servidor;
                            tloader.baseParams.puerto = values.puerto;
                            tloader.baseParams.usuario = values.usuario;
                            tloader.baseParams.contrasena = values.contrasena;
                            tloader.baseParams.basedato = values.basedato;
                            tloader.baseParams.type = node.attributes.type;
                            tloader.baseParams.text = node.attributes.text;
                            tloader.baseParams.maxlevel = 'table';
                            tloader.baseParams.passclaro = 1;
                            if (node.attributes.type == 'table') {
                                tloader.baseParams.schema = node.attributes.schema;
                            } else {
                                tloader.baseParams.schema = '';
                            }
                        }
                    }
                }),
                border: false,
                autoScroll: true,
                root: new Ext.tree.AsyncTreeNode({
                    text: this.idioma.tfBD,
                    iconCls: 'datosmaestros',
                    animate: false,
                    draggable: false,
                    expanded: false
                }),
                listeners: {
                    click: function (node) {
                        if (node.attributes.type == 'table') {
                            self.fpGestConfig.getForm().findField('esquema').setValue(node.parentNode.text);
                        } else {
                            return false;
                        }
                    }
                }
            },
            listeners:{
                expand: function(cb){
                    cb.treeConfig.root.reload();
                }
            }
        });

        this.fpGestConfig = new Ext.form.FormPanel({
            labelWidth: 85,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            defaults: {width: 240},
            defaultType: 'textfield',
            items: [
                this.idConfiguracion,
                this.denominacion,
                this.servidor,
                this.puerto,
                this.basedato,
                this.usuario,
                this.contrasena,
                {
                    xtype: 'fieldset',
                    title: self.idioma.tfTablaBase,
                    autoHeight: true,
                    autoWidth: true,
                    defaultType: 'textfield',
                    defaults: {width: 210, allowBlank: false},
                    items: [
                        this.esquema,
                        this.tablaBase
                    ]
                },
                {
                    xtype: 'fieldset',
					hidden: this.accion == 'mod'? true : false,
                    checkboxToggle: true,
                    title: self.idioma.chkClave,
                    autoHeight: true,
                    autoWidth: true,
                    defaultType: 'textfield',
                    collapsed: true,
                    defaults: {width: 210, inputType: 'password', vtype: 'password', maxLength: 50},
                    items: [
                        this.password,
                        {
                            fieldLabel: this.idioma.tfRepetirClave,
                            name: 'claveproteccion1',
                            initialPassField: 'claveproteccion' + self.id
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: this.idioma.tfComprobarConexion,
                    iconCls: 'validar',
                    handler: function () {
                        if (self.fpGestConfig.getForm().isValid()) {
                            self.parent.checkConnection(self.fpGestConfig.getForm().getValues());
                        }
                    }
                }
            ]
        });
        this.items = [this.fpGestConfig];
		this.keys=[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){btnAceptar.handler();}
		},{
			key:'p',
			alt:true,
			ctrl:true,
			fn:function(){btnAplicar.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){btnCancelar.handler();}
		}
		];
		this.buttons = [btnCancelar, btnAplicar, btnAceptar];
        Ext.reccomplejas.WinGestConfig.superclass.initComponent.call(this);
    }
});
Ext.reccomplejas.WinEditConfig = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    layout: 'fit',
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;

        this.btnClose = new Ext.Button({
            iconCls: 'cerrar',
			tooltip:this.idioma.tooltipBtnCerrar,
            text: this.idioma.btnCerrar,
            handler: function () {
                self.close();
				self.parent.getSelectionModel().clearSelections();
				self.parent.btnAdd.focus();
            }
        });

        this.btnGenerateXML = new Ext.Button({
            text:this.idioma.btnGnerarConf,
            iconCls: 'generadorreportes',
            tooltip:this.idioma.tooltipBtnGenerarConf,
            handler: function () {
                self.parent.btnGenerarXML.handler();
            }
        });

        this.pMapeo = new Ext.reccomplejas.TabMapeo({
            config: this.config,
			parent:self
        });

        this.pGestCampos = new Ext.reccomplejas.TabGestCampo({
            config: this.config,
			parent:self
        });

        this.Compartimentacion = new Ext.components.CmpReccomplejas.Compartimentacion({
            tabTip: 'Compartimentaci&oacute;n de los campos por roles <b>(Alt+3)</b>',
            config: this.config,
            parent:self
        });

        this.pFileCompartimentacion = new Ext.reccomplejas.TabFileCompartimentacion({
            config: this.config,
            parent:self
        });

        this.tbp = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
			border: false,
            items: [this.pGestCampos, this.pMapeo, this.Compartimentacion, this.pFileCompartimentacion],
			keys:[{
					key:'1',
					alt:true,
					fn:function(){self.tbp.setActiveTab(0);}
				},{
					key:'2',
					alt:true,
					fn:function(){self.tbp.setActiveTab(1);}
				},{
                    key:'3',
                    alt:true,
                    fn:function(){self.tbp.setActiveTab(3);}
                },{
                    key:'4',
                    alt:true,
                    fn:function(){self.tbp.setActiveTab(4);}
                }
			]
        });

        this.items = [this.tbp];
		this.keys=[
			{
				key:'x',
				alt:true,
				ctrl:true,
				fn:function(){btnCerrar.handler();}
			},{
				key:'1',
				alt:true,
				fn:function(){self.tbp.setActiveTab(0);}
			},{
				key:'2',
				alt:true,
				fn:function(){self.tbp.setActiveTab(1);}
			},{
                key:'3',
                alt:true,
                fn:function(){self.tbp.setActiveTab(2);}
            }
		];
        this.buttons = [this.btnClose, this.btnGenerateXML];
        Ext.reccomplejas.WinEditConfig.superclass.initComponent.call(this);
		this.on('show', function () {
           this.tbp.focus();
        },this);


    }
});
Ext.reccomplejas.TabListConfiguracion = Ext.extend(Ext.grid.GridPanel, {
    title: 'Listado de configuraciones',
    stripeRows: true,
    autoExpandColumn: 'denom',
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.loadMask = {
            msg: self.idioma.MsgCargando
        };
        var btnAyuda = new Ext.Button({
			text: this.idioma.btnAyuda,
			id:'btnAyuda'+self.id,
			nextTab:'btnAdd'+self.id,
			prevTab:'tfBuscar'+self.id,
			tooltip:this.idioma.tooltipBtnAyuda,
			iconCls: 'ayuda',
			handler:function(){
				var title = self.idioma.titleAyuda;
				var referencia = 'conf_recuperaciones';
				help.show(title, referencia);
			}
		});
        this.btnAdd = new Ext.Button({
            text: this.idioma.btnAdicionar,
			id:'btnAdd'+self.id,
            iconCls: 'adicionar',
			prevTab:'btnAyuda'+self.id,
			tooltip:this.idioma.tooltipBtnAdicionarConf,
            handler: function () {
                var win = new Ext.reccomplejas.WinGestConfig({
                    title: self.idioma.titleWinAddConf,
                    parent: self,
                    accion: 'add'
                });
                win.show();
            }
        });
        this.btnMod = new Ext.Button({
            text: this.idioma.btnModificar,
            iconCls: 'modificar',
			tooltip:this.idioma.tooltipBtnModificarConf,
            disabled: true,
			handler:function(){
				compPass(self.getSelectionModel().getSelected(),'MOD');
			}
        });
        this.btnDel = new Ext.Button({
            text: this.idioma.btnEliminar,
			tooltip: this.idioma.tooltipBtnEliminarConf,
            iconCls: 'eliminar',
            disabled: true,
			handler:function(){
				compPass(self.getSelectionModel().getSelected(),'DEL');
			}
        });
        this.btnGenerarXML = new Ext.Button({
            text:this.idioma.btnGnerarConf,
            iconCls: 'generadorreportes',
			tooltip:this.idioma.tooltipBtnGenerarConf,
            disabled: true,
            handler: function () {
                PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgGenerandoConf);
                Ext.Ajax.request({
                    url: 'generarXMLs',
                    method: 'POST',
                    params: {
                        idconfiguracion: self.getSelectionModel().getSelected().get('idconfiguracion'),
                        idtablabase: self.getSelectionModel().getSelected().get('idtablabase'),
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idmskmodify');
                        var data = Ext.util.JSON.decode(response.responseText);
						Ext.Notification.show({
							title:self.idioma.titleInfo,
							msg: self.idioma.MsgGenerarConfOK,
							time: 3
						});
						self.btnAdd.focus();
                    }
                });
            }
        });
        this.btnGenerarProy = new Ext.Button({
            text: '<u>G</u>enerar proyecto',
			tooltip:'Generar proyecto',
			hidden:true,
            disabled: true,
            handler: function () {
                new Ext.reccomplejas.WinGenerarProyecto({
                    idconfiguracion: self.getSelectionModel().getSelected().get('idconfiguracion')
                }).show();
            }
        });
        this.btnEditConfig = new Ext.Button({
            text: this.idioma.btnEditarConf,
			tooltip:this.idioma.tooltipBtnEditarConf,
            iconCls: 'habilitar',
            disabled: true,
            handler: function () {
                showWinEditConfig(self.getSelectionModel().getSelected());
            }
        });
        this.btnCheckConn = new Ext.Button({
            text: this.idioma.btnComprobarConexion,
			tooltip:this.idioma.tooltipBtnComprobarConexion,
            disabled: true,
            iconCls: 'validar',
            handler: function () {
                var rec = self.getSelectionModel().getSelected();
                self.checkConnection({
                    servidor: rec.get('servidor'),
                    puerto: rec.get('puerto'),
                    usuario: rec.get('usuario'),
                    contrasena: rec.get('contrasena'),
                    basedato: rec.get('basedato'),
                    passencrypted: true
                });
				self.btnAdd.focus();
            }
        });
		this.btnDuplicar = new Ext.Button({
            text: 'Duplicar',
			tooltip:'Duplicar configuraci&oacute;n',
			hidden:false,
            iconCls: 'duplicar',
            disabled: true,
			handler:function(){
				duplicarConfiguracion();
			}
        });
		this.btnPassword = new Ext.Button({
            text: this.idioma.btnPassword,
			tooltip:this.idioma.tooltipBtnPassword,
            iconCls: 'cambiarcontrasena',
            disabled: false,
			handler:function(){
				cambiarPassConfiguracion();
			}
        });

        this.store = new Ext.data.Store({
            url: 'getConfiguraciones',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
                {name: 'idconfiguracion'},
                {name: 'denominacion'},
                {name: 'servidor'},
                {name: 'puerto'},
                {name: 'basedato'},
                {name: 'usuario'},
                {name: 'contrasena'},
                {name: 'claveproteccion'},
                {name: 'esquema'},
                {name: 'tabla'},
                {name: 'idtablabase'}
            ])
        });
		this.store.on('load',function(){
			if(this.store.reader.jsonData.cantidad == 0){
				Ext.Notification.show({
						title: self.idioma.titleInfo,
						msg: self.idioma.MsgNoDatos,
						time: 3
				});
			}
		},this);
        this.columns = [
            {header: 'Identificador', width: 100, sortable: true, dataIndex: 'idconfiguracion'},
            {id: 'denom', header: 'Denominaci&oacute;n', sortable: true, dataIndex: 'denominacion'},
            {header: 'Servidor', sortable: true, dataIndex: 'servidor', width: 90},
            {header: 'Base de datos', sortable: true, dataIndex: 'basedato', width: 100}
        ];
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (sm) {
                    if (sm.hasSelection()) {
                        self.btnGenerarXML.enable();
                        self.btnGenerarProy.enable();
                        self.btnMod.enable();
                        self.btnDel.enable();
                        self.btnEditConfig.enable();
                        self.btnCheckConn.enable();
						self.btnDuplicar.enable();
						self.btnPassword.enable();
						self.btnAdd.focus();
                    } else {
                        self.btnGenerarXML.disable();
                        self.btnGenerarProy.disable();
                        self.btnMod.disable();
                        self.btnDel.disable();
                        self.btnEditConfig.disable();
                        self.btnCheckConn.disable();
						self.btnDuplicar.disable();
						self.btnPassword.disable();
						self.btnAdd.focus();
                    }
                }
            }
        });
		var bucar = new Ext.app.SearchField({
			store: this.store,
			id:'tfBuscar'+self.id,
			emptyText: this.idioma.tfBuscar,
			maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
			regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
			regexText:this.idioma.MsgAlert,
		})
        this.tbar = [this.btnAdd,this.btnDuplicar ,this.btnMod, this.btnDel, this.btnPassword, this.btnCheckConn, this.btnEditConfig, '-', this.btnGenerarXML, this.btnGenerarProy, bucar, '->', btnAyuda];
        this.bbar = new Ext.PagingToolbar({
            pageSize: 15,
            store: this.store,
            displayInfo: true
        });
		this.store.on('load',function(){self.btnAdd.focus();},this);
		this.keys=[{
				key:'i',
				alt:true,
				fn:function(){self.btnAdd.handler();}
			},{
				key:'m',
				alt:true,
				fn:function(){
					if(!self.btnMod.disabled ){
						self.btnMod.handler();
            		}
				}
			},{
				key:46,
				fn:function(){
				if(!self.btnDel.disabled){
					self.btnDel.handler();
					}
				}
			},{
				key:'c',
				shift:true,
				fn:function(){
				if(!self.btnPassword.disabled){
					self.btnPassword.handler();
					}
				}
			},{
				key:'c',
				ctrl:true,
				fn:function(){
				if(!self.btnCheckConn.disabled){
					self.btnCheckConn.handler();
					}
				}
			},{
				key:'e',
				ctrl:true,
				alt:true,
				fn:function(){
				if(!self.btnEditConfig.disabled){
					self.btnEditConfig.handler();
					}
				}
			},{
				key:'g',
				ctrl:true,
				alt:true,
				fn:function(){
				if(!self.btnGenerarXML.disabled){
					self.btnGenerarXML.handler();
					}
				}
			},{
				key:'h',
				alt:true,
				fn:function(){
				if(!btnAyuda.disabled){
					btnAyuda.handler();
					}
				}
			}
		];

        Ext.reccomplejas.TabListConfiguracion.superclass.initComponent.call(this);
        this.store.load();
        this.checkConnection = function (params) {
            PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgVerifDatos);
            Ext.Ajax.request({
                url: 'comprobarConexion',
                method: 'POST',
                params: params,
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmskmodify');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.conexion == 1) {
                        Ext.Notification.show({
                            title:self.idioma.titleInfo,
                            msg: self.idioma.MsgConexionOK,
                            time: 3
                        });
                    }
                    else {
                        Ext.Notification.show({
                            title:self.idioma.titleInfo,
                            msg: self.idioma.MsgConexionFail,
                            time: 3
                        });
                    }
					self.btnAdd.focus();
                }
            });
        };
        this.on('rowdblclick', function (grid, rowIndex, e) {
            showWinEditConfig(self.getStore().getAt(rowIndex));
        });
        function showWinEditConfig(recConfig) {
            if (Ext.isEmpty(self.getSelectionModel().getSelected().data.claveproteccion)) {
                var win = new Ext.reccomplejas.WinEditConfig({
                    title: recConfig.get('denominacion'),
                    parent: self,
                    config: recConfig
                });
                win.show();
                win.maximize();
            } else {
                var WinConfirmPass = new Ext.reccomplejas.WinConfirmPass({
                    title: self.idioma.titleConfirmacion,
                    parent: self,
                    config: recConfig,
                });
                WinConfirmPass.show();
                WinConfirmPass.fpConfPass.focus();
            }
        }

		function compPass(recConfig,accionBtn) {
                if(accionBtn=='DEL'){
					mostrarMensaje(2, self.idioma.askDelConf, function (btn) {
						if (btn === 'ok') {
							PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgEliminarConfAccion);
							Ext.Ajax.request({
								url: 'eliminarConfiguracion',
								method: 'POST',
								params: {
									idconfiguracion: self.getSelectionModel().getSelected().get('idconfiguracion')
								},
								callback: function (options, success, response) {
									PVD.ocultarMascara('idmskmodify');
									self.getStore().reload();
									Ext.Notification.show({
										title:self.idioma.titleInfo,
										msg: self.idioma.MsgDelConfOK,
										time: 3
									});
									self.btnAdd.focus();
								}
							});
						}
						self.btnAdd.focus();
					});
					self.btnAdd.focus();
				}else{
						PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgVerifDatos);
						var win = new Ext.reccomplejas.WinGestConfig({
							title: self.idioma.titleWinModConf,
							parent: self,
							pass:false,
							accion: 'mod'
						});
						var contra_mod;
						Ext.Ajax.request({
							url: 'obtenerPass',
							method: 'POST',
							params: {
								contrasenna: self.getSelectionModel().getSelected().get('contrasena')
							},
							callback: function (options, success, response) {
								responseData = Ext.decode(response.responseText);
								PVD.ocultarMascara('idmskmodify');
								win.show();
								win.fpGestConfig.getForm().loadRecord(self.getSelectionModel().getSelected());
								win.contrasena.reset();
								win.contrasena.setValue(responseData.pass);
							}
						});
				}
        }
		function duplicarConfiguracion(){
			var win = new Ext.reccomplejas.WinGestConfig({
				title: self.idioma.titleDuplicarConf,
				parent: self,
				accion: 'dup'
			});
			win.show();
			win.fpGestConfig.getForm().loadRecord(self.getSelectionModel().getSelected());
			win.tablaBase.disable();
			win.idConfiguracion.reset();
			win.denominacion.reset();
			win.password.reset();
			win.servidor.disable();
			win.puerto.disable();
			win.basedato.disable();
			win.usuario.disable();
			win.contrasena.disable();
			win.esquema.disable();
		}
		function cambiarPassConfiguracion(){
			var win = new Ext.reccomplejas.WinCambiarfirmPass({
				title: self.idioma.titleChangePass,
				parent: self,
				record:self.getSelectionModel().getSelected()
			});
			win.show();
		}
    }

});
Ext.reccomplejas.WinConfirmPass = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    layout: 'fit',
    width: 360,
    height: 120,
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.tfcontrasenna = new Ext.form.TextField({
			fieldLabel: this.idioma.tfContrsenna,
			id:'tfcontraseña'+self.id,
			prevTab:'aceptConfirmPass'+self.id,
			nextTab:'btnCancelar'+self.id,
			regexText:this.idioma.MsgAlert,
			name: 'claveEntrada',
			inputType: 'password',
            maxLength: 50,
			enableKeyEvents: true,
			selectOnFocus: true,
			anchor: '95%',
			allowBlank: false,
			readOnly: false
		});
		this.fpConfPass = new Ext.FormPanel({
            frame: true,
            labelWidth: 125,
            defaultType: 'textfield',
            items: [this.tfcontrasenna]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
			id:'btnCancelar'+self.id,
            text: this.idioma.btnCancelar,
			tooltip: this.idioma.tooltipBtnCancelar,
            handler: function () {
                self.close();
            }
        });
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
			id:'aceptConfirmPass'+self.id,
			nextTab:'tfcontraseña'+self.id,
			prevTab:'btnCancelar'+self.id,
            text: this.idioma.btnAceptar,
			tooltip:this.idioma.tooltipBtnAceptar,
            handler:function(){
					habilitarEdicion();
				}
        });

		this.on('show',function(){
			self.tfcontrasenna.focus(false, 300);
		},this)
        this.items = [self.fpConfPass];
		this.keys=[
			{
				key:Ext.EventObject.ENTER,
				fn: habilitarEdicion,
                scope: this
			},{
				key:'x',
				alt:true,
				fn:function(){self.btnCancelar.handler();}
			}
		];

        this.buttons = [this.btnCancelar, this.btnAceptar];
        Ext.reccomplejas.WinConfirmPass.superclass.initComponent.call(this);

        function habilitarEdicion(){
            PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgVerifDatos);
            Ext.Ajax.request({
                url: 'verificarPermiso',
                params: {
                    claveproteccion: self.config.get('claveproteccion'),
                    claveEntrada: self.fpConfPass.getForm().findField('claveEntrada').getValue(),
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmskmodify');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.cont == 1) {
                        var win = new Ext.reccomplejas.WinEditConfig({
                            title: self.config.get('denominacion'),
                            parent: self.parent,
                            config: self.config
                        });

                        win.show();
                        win.maximize();
                        self.close();
                    }
                    else {
                        mostrarMensaje(3, self.idioma.MsgPassFail);
                        self.fpConfPass.getForm().reset();
                    }
                }
            });
        }
    }
});
Ext.reccomplejas.WinConfirmPassDelMod = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    layout: 'fit',
    width: 360,
    height: 120,
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
         var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.tfcontrasenna = new Ext.form.TextField({
			fieldLabel: this.idioma.tfContrsenna,
			id:'tfcontraseña'+self.id,
			prevTab:'btnAceptar'+self.id,
			nextTab:'btnCancelar'+self.id,
			regexText:this.idioma.MsgAlert,
			name: 'claveEntrada',
			inputType: 'password',
            maxLength: 50,
			enableKeyEvents: true,
			selectOnFocus: true,
			anchor: '95%',
			allowBlank: false,
			readOnly: false,
			listeners:{
				'specialkey': function(t, e){
					if(e.keyCode==13){
						habilitarEdicion();
					}
				}
			}
		});
		this.fpConfPass = new Ext.FormPanel({
            frame: true,
            labelWidth: 125,
            defaultType: 'textfield',
            items: [this.tfcontrasenna]
        });

		this.on('show',function(){
			self.tfcontrasenna.focus(false, 300);
		},this)

        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
			id:'btnCancelar'+self.id,
            text: this.idioma.btnCancelar,
			tooltip: this.idioma.tooltipBtnCancelar,
            handler: function () {
                self.close();
				self.parent.btnAdd.focus();
            }
        });
        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
			id:'btnAceptar'+self.id,
			nextTab:'tfcontraseña'+self.id,
			prevTab:'btnCancelar'+self.id,
            text: this.idioma.btnAceptar,
			tooltip:this.idioma.tooltipBtnAceptar,
            handler:this.accion=='del'?
				function(){
						PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgVerifDatos);
						Ext.Ajax.request({
							url: 'verificarPermiso',
							params: {
								claveproteccion: self.config.get('claveproteccion'),
								claveEntrada: self.fpConfPass.getForm().findField('claveEntrada').getValue(),
							},
							callback: function (options, success, response) {
								PVD.ocultarMascara('idmskmodify');
								responseData = Ext.decode(response.responseText);
								if (responseData.cont == 1) {
										self.close();
										mostrarMensaje(2,this.idioma.askDelConf,function (btn) {
										if (btn === 'ok') {
											PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgEliminarConfAccion);
											Ext.Ajax.request({
												url: 'eliminarConfiguracion',
												method: 'POST',
												params: {
													idconfiguracion: self.config.get('idconfiguracion')
												},
												callback: function (options, success, response) {
													PVD.ocultarMascara('idmskmodify');
													self.parent.getStore().reload();
													Ext.Notification.show({
														title: self.idioma.titleInfo,
														msg: self.idioma.MsgDelConfOK,
														time: 3
													});
												}
											});
										}
										self.parent.btnAdd.focus();
									});
								}
								else {
									Ext.Notification.show({
										title: self.idioma.titleInfo,
										msg: self.idioma.MsgPassFail,
										time: 3
									});
									self.fpConfPass.getForm().reset();
								}
							}
						});

				}:function(){
						PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgVerifDatos);
						Ext.Ajax.request({
							url: 'verificarPermiso',
							params: {
								claveproteccion: self.config.get('claveproteccion'),
								claveEntrada: self.fpConfPass.getForm().findField('claveEntrada').getValue(),
							},
							callback: function (options, success, response) {
								responseData = Ext.decode(response.responseText);
								if (responseData.cont == 1) {
									var win = new Ext.reccomplejas.WinGestConfig({
										title: self.idioma.titleWinModConf,
										parent: self,
										accion: 'mod',
										pass:true
									});
									var contra_mod;
									Ext.Ajax.request({
										url: 'obtenerPass',
										method: 'POST',
										params: {
											contrasenna: self.parent.getSelectionModel().getSelected().get('contrasena')
										},
										callback: function (options, success, response) {
											responseData = Ext.decode(response.responseText);
											self.close();
											PVD.ocultarMascara('idmskmodify');
											win.show();
											win.fpGestConfig.getForm().loadRecord(self.parent.getSelectionModel().getSelected());
											win.contrasena.reset();
											win.contrasena.setValue(responseData.pass);
										}
									});
								}
								else {
									Ext.Notification.show({
										title: self.idioma.titleInfo,
										msg: self.idioma.MsgPassFail,
										time: 3
									});
									self.fpConfPass.getForm().reset();
								}
							}
						});

				}
        });
        this.items = [self.fpConfPass];
		this.keys=[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){btnAceptar.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){btnCancelar.handler();}
		}
		];
		this.buttons = [btnCancelar, btnAceptar];
        Ext.reccomplejas.WinConfirmPassDelMod.superclass.initComponent.call(this);
		this.checkConnection = function (params) {
            PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgVerifDatos);
            Ext.Ajax.request({
                url: 'comprobarConexion',
                method: 'POST',
                params: params,
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmskmodify');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.conexion == 1) {
                        Ext.Notification.show({
                            title:self.idioma.titleInfo,
                            msg: self.idioma.MsgConexionOK,
                            time: 3
                        });
                    }
                    else {
                        Ext.Notification.show({
                            title:self.idioma.titleInfo,
                            msg: self.idioma.MsgConexionFail,
                            time: 3
                        });
                    }
                }
            });
        };
    }
});
Ext.reccomplejas.WinCambiarfirmPass = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    layout: 'fit',
    width: 400,
    height: 180,
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
		var oldPass = this.record.get('claveproteccion');

		this.oldpassword=new Ext.form.TextField({
			fieldLabel:this.idioma.tfClavaAnterior,
			name: 'oldpassword',
			id:'oldpass'+self.id,
			prevTab:'btnAcep'+self.id,
			disabled:oldPass == '' ? true:false,
			regexText:this.idioma.MsgAlert,
			inputType :'password',
			anchor:'99%',
			allowBlank:false,
            maxLength: 50,
		});
		this.newpassword=new Ext.form.TextField({
			fieldLabel:this.idioma.tfNuevaClave,
			id:'newpass'+self.id,
			name: 'newpass',
			prevTab:oldPass == '' ? 'btnAcep'+self.id : 'oldpass'+self.id,
			inputType :'password',
			anchor:'99%',
			allowBlank:false,
			regexText:this.idioma.MsgAlert,
            maxLength: 50,
		});
		this.retypepassword=new Ext.form.TextField({
			fieldLabel: this.idioma.tfRepetirClave,
			name: 'retypepass',
			inputType :'password',
			anchor:'99%',
			allowBlank:false,
            maxLength: 50,
			initialPassField:'newpass'+self.id,
			regexText:this.idioma.MsgAlert,
		});
		this.fpCambiarPass = new Ext.FormPanel({
			frame:true,
			items:[this.oldpassword,this.newpassword,this.retypepassword]
        });

        this.btnCancelarCP = new Ext.Button({
            iconCls: 'cancelar',
			id:'btnCancelar'+self.id,
            text: this.idioma.btnCancelar,
			tooltip:this.idioma.tooltipBtnCancelar,
            handler: function () {
                self.close();
				self.parent.btnAdd.focus();
            }
        });
        this.btnAceptarCP = new Ext.Button({
            iconCls: 'aceptar',
            text: this.idioma.btnAceptar,
			tooltip:this.idioma.tooltipBtnAceptar,
			id:'btnAcep'+self.id,
			nextTab:oldPass == '' ? 'newpass'+self.id : 'oldpass'+self.id,
			prevTab:'btnCancelar'+self.id,
            handler: function(){
				if(self.newpassword.getValue() == self.retypepassword.getValue()){
					if(self.fpCambiarPass.getForm().isValid()){
						PVD.mostrarMascara('idmskmodify',self.idioma.MsgWait,self.idioma.MsgSavePassAction);
						Ext.Ajax.request({
							url:'cambiasPass',
							params:{
								idconfiguracion: self.record.get('idconfiguracion'),
								oldPass: self.oldpassword.getValue(),
								newPass:  self.newpassword.getValue(),
								viejaclave:self.record.get('claveproteccion')
							},
							callback: function (options, success, response){
								PVD.ocultarMascara('idmskmodify');
								self.close();
								responseData = Ext.decode(response.responseText);
								if(responseData.codMsg==1){
									Ext.Notification.show({
											title: self.idioma.titleInfo,
											msg: self.idioma.MsgPassSaveOK,
											time: 3
									});
									self.parent.store.reload();
									self.parent.btnAdd.focus();
								}
								else{
									Ext.Notification.show({
										title: self.idioma.titleInfo,
										msg: self.idioma.MsgPassSaveFail,
										time: 3
									});
									self.parent.btnAdd.focus();
								}
							}

						});
					}
				}
				else{
					Ext.Notification.show({
						title: self.idioma.titleInfo,
						msg: self.idioma.MsgPassDistintasFail,
						time: 3
					});
					self.fpCambiarPass.getForm().reset();

				}
			}
        });

		this.items = [this.fpCambiarPass];
		this.keys=[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){self.btnAceptarCP.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){self.btnCancelarCP.handler();}
		}
		];
        this.buttons = [this.btnCancelarCP, this.btnAceptarCP];
        Ext.reccomplejas.WinCambiarfirmPass.superclass.initComponent.call(this);
    }
});


