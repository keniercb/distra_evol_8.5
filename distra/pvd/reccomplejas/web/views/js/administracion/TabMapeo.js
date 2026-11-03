Ext.ns('Ext.reccomplejas');
Ext.reccomplejas.TabMapeo = Ext.extend(Ext.Panel, {
    title: 'Mapeo',
    layout: 'border',
    initComponent: function () {
        var self = this;
		this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        var nodoMetadato = null;
		this.tabTip = this.idioma.tabTipMapeo,
        this.gpMapeo = new Ext.reccomplejas.CmpMapeo({
            region: 'center',
            ddGroup: 'grid2tree1',
			disabled:true,
            enableDragDrop: true,
            listeners: {
                'render': initializeDropZone
            }
        });

		this.gpMapeo.btnEliminar.setHandler(function(){
           eliminarTabla(self.gpMapeo.getSelectionModel().getSelected().get('idmapeo'));
		   self.gpMapeo.btnEliminar.focus();
        });
		this.gpMapeo.btnModificar.setHandler(function(){
            self.WinJoinTable.show();
            var arr = {
                'chkPersisteJoin':self.gpMapeo.getSelectionModel().getSelected().get('persistejoin'),
                'nfIDPersisteJoin':self.gpMapeo.getSelectionModel().getSelected().get('idpersistejoin'),
                'idconexion':self.gpMapeo.getSelectionModel().getSelected().get('tipoconexion')
            }
            var record = new Ext.data.Record(arr);
            self.WinJoinTable.fpConexion.getForm(). loadRecord(record);
        });
		 this.gpMapeo.store.on('load',function(){
			self.gpMapeo.btnModificar.disable();
			self.gpMapeo.btnEliminar.disable();
		},this);

        this.gpMapeo.on('rowclick',function(sm, rowIndex, rec){
            if (rowIndex != 0) {
				var recordGrid=self.gpMapeo.getStore().getAt(rowIndex-1);
                self.gpUnionTabla.enable();
				self.gpUnionTabla.btnModificar.disable();
				self.gpUnionTabla.btnEliminar.disable();

                self.gpUnionTabla.winMapeoCampos.stCampoInicial.baseParams.esquema = recordGrid.data.esquema;
                self.gpUnionTabla.winMapeoCampos.stCampoInicial.baseParams.tabla = recordGrid.data.tabla;

                self.gpUnionTabla.winMapeoCampos.stCampoFinal.baseParams.esquema = self.gpMapeo.getSelectionModel().getSelected().get('esquema');
                self.gpUnionTabla.winMapeoCampos.stCampoFinal.baseParams.tabla = self.gpMapeo.getSelectionModel().getSelected().get('tabla');

                self.gpUnionTabla.store.baseParams.idmapeo = self.gpMapeo.getSelectionModel().getSelected().get('idmapeo');
                self.gpUnionTabla.store.load();
				self.gpUnionTabla.btnAdicionar.focus();
            }else{
                self.gpUnionTabla.disable();
				self.gpUnionTabla.btnModificar.disable();
				self.gpUnionTabla.btnEliminar.disable();
                self.gpUnionTabla.getStore().removeAll();
            }
        });
		
        this.gpUnionTabla = new Ext.reccomplejas.CmpUnionTabla({
            region: 'south',
            config: this.config,
			parent:self
        });
        this.Designer = new Ext.Panel({
            region: 'center',
            layout: 'border',
            margins: '5 0 5 0',
            border: false,
            items:[this.gpMapeo, this.gpUnionTabla]
        });
        this.tpMetadato = new Ext.reccomplejas.CmpMetadato({
            region: 'east',
            config: this.config,
            collapsible: true,
            margins: '5 5 5 0',
            cmargins: '5 5 5 0',
            parent: this,
            ddGroup: 'grid2tree',
            enableDrag: true,
			disabled:true,
        });
        this.tpSelectores = new Ext.reccomplejas.CmpSelectores({
            region: 'west',
			parent: this,
            config: this.config,
            collapsible: true,
            split: true,
            width: 350,
            minSize: 200,
            maxSize: 500,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5'
        });
        this.tpSelectores.getSelectionModel().on('selectionchange', function(sm, node) {
            self.gpUnionTabla.disable();
            self.gpUnionTabla.getStore().removeAll();
            self.gpMapeo.getStore().removeAll();
            if(node.isLeaf()){
				self.tpSelectores.btnAdd.focus();
				self.gpMapeo.enable();
				self.tpMetadato.enable();
                self.gpMapeo.store.load({
                    params: {
                        idcampo: node.attributes.idcampo
                    }
                });
            }
			else{
				self.gpMapeo.disable();
				self.tpMetadato.disable();
				self.tpSelectores.btnAdd.focus();
			}
        });
		this.tpSelectores.getLoader().on('load',function(){
			self.gpMapeo.getStore().removeAll();
			self.gpUnionTabla.getStore().removeAll();
			self.gpUnionTabla.disable();
			self.tpSelectores.btnAdd.focus();
		},this);
        this.WinJoinTable = new Ext.reccomplejas.WinJoinTable({
			parent:self
		});
		this.WinJoinTable.on('show',function(){
			self.WinJoinTable.btnCancelar.focus();
		},this);
		this.WinJoinTable.btnAceptar.setHandler(function(){
            if(self.WinJoinTable.fpConexion.getForm().isValid() && self.WinJoinTable.isVisible()){
                if(nodoMetadato != null){
                    adicionarTabla(nodoMetadato,  self.WinJoinTable.fpConexion.getForm().getValues());
                }else if(self.WinJoinTable.fpConexion.getForm().isDirty()){
                    modificarTabla(self.WinJoinTable.fpConexion.getForm().getValues());
                }
                self.WinJoinTable.hide();
            }
        });
		this.keys=[{
				key:'m',
				alt:true,
				ctrl:true,
				fn:function(){
					 self.gpMapeo.btnModificar.handler(); 
				}
			},{
				key:46,
				alt:true,
				fn:function(){
					if(!self.gpMapeo.btnEliminar.disabled){
						self.gpMapeo.btnEliminar.handler();
					}
				}
			},{
				key:'i',
				alt:true, 
				shift:true,
				fn:function(){
					if(!self.gpUnionTabla.btnAdicionar.disabled && !self.gpMapeo.btnEliminar.disabled ){
						self.gpUnionTabla.btnAdicionar.handler();
					}
				}
			},{
				key:'m',
				ctrl:true,
				fn:function(){
					if(!self.gpUnionTabla.btnModificar.disabled && !self.gpMapeo.btnEliminar.disabled){
						self.gpUnionTabla.btnModificar.handler();
					}
				}
			},{
				key:46,
				ctrl:true, 
				fn:function(){
					if(!self.gpUnionTabla.btnEliminar.disabled && !self.gpMapeo.btnEliminar.disabled){
						self.gpUnionTabla.btnEliminar.handler();
					}
				}
			}	
		];
        this.items = [this.Designer,this.tpMetadato,this.tpSelectores];
        Ext.reccomplejas.TabMapeo.superclass.initComponent.call(this);
        function initializeDropZone(g) {
            GridDropTarget = new Ext.dd.DropTarget(g.getView().el.dom.childNodes[0].childNodes[1], {
                ddGroup    : 'grid2tree',
                notifyDrop : function(ddSource, e, data) {
                    nodoMetadato = ddSource.dragData.node;
                    if (nodoMetadato.attributes.type == 'table'){
                        self.WinJoinTable.show();
                    }else{
                        nodoMetadato = null;
                    }
                },
                notifyOver : function(ddSource, e, data) {
                    nodoMetadato = ddSource.dragData.node;
                    if (nodoMetadato.attributes.type == 'table'){
                        return Ext.dd.DropTarget.prototype.dropAllowed;
                    }else{
                        nodoMetadato = null;
                        return Ext.dd.DropTarget.prototype.dropNotAllowed;
                    }
                }
            })
        }
        function adicionarTabla(node, form){
            PVD.mostrarMascara('adicionarTabla',self.idioma.MsgWait,self.idioma.MsgAddMapeoAccion);
            Ext.Ajax.request({
                url: 'adicionarTablaMapeo',
                method:'POST',
                params: {
                    idcampo: self.tpSelectores.getSelectionModel().getSelectedNode().attributes.idcampo,
                    esquema: node.parentNode.attributes.text,
                    tabla: node.attributes.text,
                    persistejoin: form.chkPersisteJoin,
                    idpersistejoin: form.nfIDPersisteJoin,
                    tipoconexion: form.idconexion
                },
                callback: function (options,success,response){
                    PVD.ocultarMascara('adicionarTabla');
                    responseData = Ext.decode(response.responseText);
                    if(responseData.adicionar == 1){
                        nodoMetadato = null;
                        self.gpMapeo.store.load({
                            params: {
                                idcampo: self.tpSelectores.getSelectionModel().getSelectedNode().attributes.idcampo
                            }
                        });
						Ext.Notification.show({
							title: self.idioma.titleInfo,
							msg: self.idioma.MsgAddMapeoOK,
							time: 3
						});
                    }
					else{
						Ext.Notification.show({
							title: self.idioma.titleInfo,
							msg: self.idioma.MsgAddMapeoFail,
							time: 3
						});
					}
                }
            });
        }
        function modificarTabla(form){
            PVD.mostrarMascara('modificarTabla',self.idioma.MsgWait,self.idioma.MsgAddMapeoAccion);
            Ext.Ajax.request({
                url: 'modificarTablaMapeo',
                method:'POST',
                params: {
                    idmapeo: self.gpMapeo.getSelectionModel().getSelected().get('idmapeo'),
                    idcampo: self.tpSelectores.getSelectionModel().getSelectedNode().attributes.idcampo,
                    esquema: self.gpMapeo.getSelectionModel().getSelected().get('esquema'),
                    tabla: self.gpMapeo.getSelectionModel().getSelected().get('tabla'),
                    persistejoin: form.chkPersisteJoin,
                    idpersistejoin: form.nfIDPersisteJoin,
                    tipoconexion: form.idconexion
                },
                callback: function (options,success,response){
                    PVD.ocultarMascara('modificarTabla');
                    responseData = Ext.decode(response.responseText);
                    if(responseData.modificar == 1){
                        nodoMetadato = null;
						Ext.Notification.show({
							title: self.idioma.titleInfo,
							msg: self.idioma.MsgModMapeoOK,
							time: 3
						});
                        self.gpMapeo.store.load({
                            params: {
                                idcampo: self.tpSelectores.getSelectionModel().getSelectedNode().attributes.idcampo
                            }
                        });
                    }
					else{
						Ext.Notification.show({
							title: self.idioma.titleInfo,
							msg: self.idioma.MsgModMapeoFail,
							time: 3
						});
					}
					 self.gpMapeo.btnEliminar.focus();
                }
            });
        }
        function eliminarTabla(id){
            mostrarMensaje(2,self.idioma.askDelMapeo,function(btn){
                if(btn == "ok"){
                    PVD.mostrarMascara('eliminarTablaMapeo', self.idioma.MsgWait,self.idioma.MsgEliminarMapeoAccion);
                    Ext.Ajax.request({
                        url: 'eliminarTablaMapeo',
                        method:'POST',
                        params: {
                            idmapeo: id
                        },
                        callback: function (options,success,response){
                            PVD.ocultarMascara('eliminarTablaMapeo');
                            responseData = Ext.decode(response.responseText);
                            if(responseData.eliminar == 1){
								Ext.Notification.show({
									title: self.idioma.titleInfo,
									msg: self.idioma.MsgDelMapeoOK,
									time: 3
								});
                                self.gpMapeo.store.load({
                                    params: {
                                        idcampo: self.tpSelectores.getSelectionModel().getSelectedNode().attributes.idcampo
                                    }
                                });
                                self.gpUnionTabla.store.baseParams.idmapeo = 0;
                                self.gpUnionTabla.store.load();
                                self.gpUnionTabla.disable();

                            }
							else{
								Ext.Notification.show({
									title: self.idioma.titleInfo,
									msg: self.idioma.MsgDelMapeoFail,
									time: 3
								});
							}
                        }
                    });
					 self.gpMapeo.btnEliminar.focus();
                }
				else{
					 self.gpMapeo.btnEliminar.focus();
				}
            });
        }
    }
});
