Ext.ns('Ext.reccomplejas');

Ext.reccomplejas.WinGestCarpeta = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    plain: true,
    initComponent: function() {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: this.idioma.btnCancelar,
			tooltip:this.idioma.tooltipBtnCancelar,
            handler: function() {
                self.close();
				self.parent.btnAdd.focus();
            }
        });
		
        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: this.idioma.btnAplicar,
			tooltip:this.idioma.tooltpBtnAplicar,
            hidden: this.accion == 'mod' ? true : false,
            handler: function() {
                enviarDatos('aplicar');
            }
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: this.idioma.btnAceptar,
			tooltip:this.idioma.tooltipBtnAceptar,
            handler: function() {
                enviarDatos('aceptar');
            }
        });

        this.form = new Ext.form.FormPanel({
            labelWidth: 85,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            defaults: {width: 240},
            defaultType: 'textfield',
            items: [{
                    fieldLabel: this.idioma.tfDenominacion,
                    name: 'denominacion',
					maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,   
					regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,      
					regexText:this.idioma.MsgAlert, 
                    value: this.denominacion || '',
                    allowBlank: false,
                    maxLength: 255
                }, {
                    fieldLabel:this.idioma.tfDescripcion,
                    name: 'descripcion',
					maskRe : /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,   
					regex : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,      
					regexText:this.idioma.MsgAlert, 
                    value: this.descripcion || '',
                    maxLength: 255
                }
            ]
        });
		
		this.on('close',function(){self.parent.btnAdd.focus();},this);
		this.keys=[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){self.btnAceptar.handler();}
		},{
			key:'p',
			alt:true,
			ctrl:true,
			fn:function(){self.btnAplicar.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){self.btnCancelar.handler();}
		}
		];
        this.items = [this.form];
        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
        Ext.reccomplejas.WinGestCarpeta.superclass.initComponent.call(this);

        function enviarDatos(btn) {
            if (self.form.getForm().isValid()) {
                var selectedNode = self.parent.getSelectionModel().getSelectedNode();
                var values = self.form.getForm().getValues();
                values.idconfiguracion = self.config.get('idconfiguracion');
                values.accion = self.accion;
                values.idcampo = selectedNode.attributes.idcampo;
				PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgSaveAgrupacionAccion);
                Ext.Ajax.request({
                    url: 'gestCarpetaCampo',
                    method: 'POST',
                    params: values,
                    callback: function(options, success, response) {
						PVD.ocultarMascara('idmskmodify');
                        if (self.accion === 'add') {
                            self.parent.getLoader().load(selectedNode);
                            selectedNode.expand(false, true);
							Ext.Notification.show({
								title: self.idioma.titleInfo,
								msg: self.idioma.MsgAddAgrupacionOK,
								time: 3
							});
                        } else {
                            var nodoPadre = selectedNode.parentNode;
                            self.parent.getLoader().load(nodoPadre);
                            nodoPadre.expand(false, true);
							Ext.Notification.show({
								title: self.idioma.titleInfo,
								msg: self.idioma.MsgModAgrupacionOK,
								time: 3
							});
                        }
                        if (btn === 'aceptar') {
                            self.close();
                        } else {
                            self.form.getForm().reset();
                        }
						self.parent.btnAdd.focus();
                    }
                });
            }
        }
    }
});

Ext.reccomplejas.CmpSelectores = Ext.extend(Ext.tree.TreePanel, {
    title: 'Campos',
    autoScroll: true,
    containerScroll: true,
    animate: true,
    rootVisible: true,
    root: {
        nodeType: 'async',
        idcampo: null,
        text: 'BD',
        animate: false,
        draggable: false,
        expanded: true
    },
    initComponent: function() {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.btnExpanAll = new Ext.Button({
            tooltip: this.idioma.tooltipBtnExpandAll,
            iconCls: 'expandir',
			id:'btnExpnadir'+self.id,
            handler: function() {
                self.expandAll();
            }
        });

        this.btnColapseAll = new Ext.Button({
            tooltip: this.idioma.tooltipBtnColapseAll,
			id:'btnContraer'+self.id,
			nextTab:'btnAdicionar'+self.id,
			prevTab:'btnExpnadir'+self.id,
            iconCls: 'contraer',
            handler: function() {
                self.collapseAll();
            }
        });

        this.btnReload = new Ext.Button({
            iconCls: 'actualizar',
            tooltip: this.idioma.tooltipBtnReload,
            handler: function() {
                self.getLoader().load(self.getRootNode());
                self.getRootNode().expand(false, true);
				self.btnAdd.focus();
            }
        });

        this.btnAdd = new Ext.Button({
            text:this.idioma.btnAdicionar,
			tooltip:this.idioma.tooltipBtnAddCampo,
			id:'btnAdicionar'+self.id,
			prevTab:'btnContraer'+self.id,
            iconCls: 'adicionar',
            handler: function() {
                var win = new Ext.reccomplejas.WinGestCarpeta({
                    title: self.idioma.titleWinAddCampo,
                    accion: 'add',
                    config: self.config,
                    parent: self
                });
                win.show();
            }
        });

        this.btnMod = new Ext.Button({
            text: this.idioma.btnModificar,
			tooltip:this.idioma.tooltipBtnModCampo,
            iconCls: 'modificar',
            disabled: true,
            handler: function() {
                var win = new Ext.reccomplejas.WinGestCarpeta({
                    title: self.idioma.titleWinModCampo,
                    accion: 'mod',
                    config: self.config,
                    parent: self,
                    denominacion: self.getSelectionModel().getSelectedNode().text,
                    descripcion: self.getSelectionModel().getSelectedNode().attributes.descripcion
                });
                win.show();
            }
        });

        this.btnDel = new Ext.Button({
            text: this.idioma.btnEliminar,
			tooltip:this.idioma.tooltipBtnEliminarCampo,
            iconCls: 'eliminar',
            disabled: true,
            handler: function() {
                self.eliminarCampo(self);
            }
        });

        this.btnArriba = new Ext.Button({
            text: 'Arriba',
            tooltip:'Subir el campo una posicion',
            iconCls: 'arriba',
            disabled: true,
            handler: function() {
                self.cambiarOrden(self,1);
            }
        });
        this.btnAbajo = new Ext.Button({
            text: 'Abajo',
            tooltip:'Bajar el campo una posicion',
            iconCls: 'abajo',
            disabled: true,
            handler: function() {
                self.cambiarOrden(self,-1);
            }
        });

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: 'getCampos',
            preloadChildren: false,
            listeners: {
                beforeload: function(tloader, node, response) {
                    tloader.baseParams.idconfiguracion = self.config.get('idconfiguracion');
                    tloader.baseParams.idcampo = node.attributes.idcampo;
                }
            }
        });
		this.loader.on('load',function(){
			this.btnAdd.focus();
			this.parent.parent.tbp.on('tabchange',function(tabpanel,panel){
                if(panel.tpSelectores){
                    panel.tpSelectores.btnAdd.focus();
                }
			},this);
		},this);
		
        this.tbar = [this.btnAdd, this.btnMod, this.btnDel,this.btnArriba,this.btnAbajo, '->', this.btnReload, this.btnExpanAll, this.btnColapseAll];
		this.keys = [{
				key:'i',
				alt:true, 
				fn:function(){
				self.btnAdd.handler();
				}
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
				key:'z',
				alt:true,
				ctrl:true,
				fn:function(){
				if(!self.btnReload.disabled){
					self.btnReload.handler();
					}
				}
			},{ 
				key:'e',
				shift:true,
				fn:function(){
				if(!self.btnExpanAll.disabled){
					self.btnExpanAll.handler();
					}
				}
			},{ 
				key:'c',
				shift:true,
				fn:function(){
				if(!self.btnColapseAll.disabled){
					self.btnColapseAll.handler();
					self.btnExpanAll.focus();
					}
				}
			}
		];
        Ext.reccomplejas.CmpSelectores.superclass.initComponent.call(this);
        this.on('render', function() {
            this.getRootNode().setText(self.config.get('denominacion'));
            this.getSelectionModel().select(this.getRootNode());
        });

        this.getSelectionModel().on('selectionchange', function(sm, node) {
            this.btnMod.disable();
            this.btnDel.disable();
            this.btnArriba.disable();
            this.btnAbajo.disable();
            this.btnAdd.disable();
			this.btnAdd.focus();
            if (node) {
                this.btnAdd.enable();
                if (node.attributes.idcampo != null) {
                    this.btnDel.enable();
                    this.btnArriba.enable();
                    this.btnAbajo.enable();
                    if (!node.isLeaf()) {
                        this.btnMod.enable();
                    }
                }
            }
        }, this);
		
    },
    adicionarCampos: function(arrNodos, nodoPadre) {
        var selectedNode = nodoPadre;
        var self = this;
        if (selectedNode && !selectedNode.isLeaf()) {
            var arrCampos = new Array();
            Ext.each(arrNodos, function(node) {
                arrCampos.push({
                    campo: node.text,
                    tabla: node.attributes.table,
                    esquema: node.attributes.schema
                });
            });
			PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgAddCampoAccion);
            Ext.Ajax.request({
                url: 'adicionarCampos',
                method: 'POST',
                params: {
                    arrCampos: Ext.encode(arrCampos),
                    idconfiguracion: this.config.get('idconfiguracion'),
                    esquemabase: this.config.get('esquema'),
                    tablabase: this.config.get('tabla'),
                    idpadre: selectedNode.attributes.idcampo
                },
                callback: function(options, success, response) {
					PVD.ocultarMascara('idmskmodify');
                    self.getLoader().load(selectedNode);
					Ext.Notification.show({
                        title: self.idioma.titleInfo,
                        msg: self.idioma.MsgAddCampoOK,
                        time: 3
                    });
                }
            });
        } else {
            mostrarMensaje(1, self.idioma.MsgAlertCampo);
        }
    },
    eliminarCampo: function(self) {
		var selectedNode = self.getSelectionModel().getSelectedNode();
		var parentNode = selectedNode.parentNode;
		Ext.Msg.show({
			title:this.idioma.titleConfirmacion,
			msg: self.idioma.askDelCampo,
			icon:Ext.Msg.QUESTION,
			buttons:Ext.Msg.OKCANCEL,
			fn:function(btn){
				if(btn =='ok'){
					PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgDelCampoAccion);
					Ext.Ajax.request({
						url: 'eliminarCampo',
						method: 'POST',
						params: {
							idcampo: selectedNode.attributes.idcampo
						},
						callback: function(options, success, response) {
							PVD.ocultarMascara('idmskmodify');
							self.getLoader().load(parentNode);
							parentNode.expand();
                            mostrarMensaje(1, self.idioma.MsgDelCampoOK);
							self.btnAdd.focus();
						}
					});
				}
				else{
					self.btnAdd.enable();
					self.btnAdd.focus();
				}
			}
		});
	},
    cambiarOrden: function(self,posicion) {
        var selectedNode = self.getSelectionModel().getSelectedNode();
        var parentNode = selectedNode.parentNode;

        Ext.Msg.show({
            title:this.idioma.titleConfirmacion,
            msg: 'Esta seguro que quiere cambiar el orden del campo.',
            icon:Ext.Msg.QUESTION,
            buttons:Ext.Msg.OKCANCEL,
            fn:function(btn){
                if(btn =='ok'){
                    PVD.mostrarMascara('idmskmodify', self.idioma.MsgWait, self.idioma.MsgDelCampoAccion);
                    Ext.Ajax.request({
                        url: 'ordenarCampo',
                        method: 'POST',
                        params: {
                            idcampo: selectedNode.attributes.idcampo,
                            idpadre: selectedNode.attributes.idpadre,
                            posicion:posicion

                        },
                        callback: function(options, success, response) {
                            PVD.ocultarMascara('idmskmodify');
                            self.getLoader().load(parentNode);
                            parentNode.expand();
                            mostrarMensaje(1, 'El campo se ha actualizado satisfactoriamnete.');
                            self.btnAdd.focus();
                        }
                    });
                }
                else{
                    self.btnAdd.enable();
                    self.btnAdd.focus();
                }
            }
        });
    }
});