Ext.ns("Configuracion.Especialidad");
Configuracion.Especialidad.GestionarEspView = {

	init:function(idioma,Model){
	
	
		//crear arbol
		this.idioma  = idioma;
		this.modelo = Model;
		var toolbar_buscar = new Ext.Toolbar({
			id:'tb_buscar',
			items:[
				{
					xtype:'textfield',
					id:'tf_buscar'
				},
				{
					id:'btn_buscar',
					iconCls:'buscar',
					handler:function(){
						alert("implementar el filtrar del arbol");
					}
				}
			]
		});
		this.trEE = new Ext.tree.TreePanel({
			width:200,
			autoScroll : true,
			split:true,
			tbar:toolbar_buscar,
			layoutConfig : {
				animate : true
			},
			region : 'west',
			enableDD : true,
			loader : this.modelo.treeLoader
		});
		var trEESort = new Ext.tree.TreeSorter(this.trEE, {
			folderSort: true,
			dir: "asc",
			caseSensitive:true
		});
		
		// Crear nodo padre del arbol
    var nodoPadre = new Ext.tree.AsyncTreeNode({
        text : this.idioma.etiquetas.lbRootArbol,
        draggable : false,
        id : '0',
        expanded:true
    });

    // //Crear lista de hijos
    this.trEE.setRootNode(nodoPadre);
	
	//Crear botones para el formulario
	this.btnAdicionar = new Ext.Button({
		iconCls:'adicionar',
		text:this.idioma.etiquetas.btnAdicionar,
		disabled: true,
		tooltip:this.idioma.etiquetas.lbTAdicionar
		//scope:this,
		/*handler:function(){
			alert("implementar la acion adicionar especialidad");
		}*/
	});
	this.btnModificar = new Ext.Button({
		iconCls:'modificar',
		text:this.idioma.etiquetas.lbTModificar,
		disabled:true,
		tooltip:this.idioma.etiquetas.lbTModificar
		/*handler:function(){
			alert('implementar la accion modificar especialidad');
		}*/
	});
	 this.btnEliminar = new Ext.Button({
        iconCls:'eliminar',
        text:this.idioma.etiquetas.btnEliminar,
        disabled:true,
        tooltip:this.idioma.etiquetas.bTtEliminar
       /* handler:function(){
			alert("implementar el eliminar");
            //mostrarMensaje(2,perfil.etiquetas.lbTEliminar,OnbtnAceptarEliminar);
        }*/
    });
	this.btnAyuda = new Ext.Button({
        iconCls: 'ayuda',
        id: 'bntAyudaEspecialidad',
        //hidden: true,
        tooltip: this.idioma.etiquetas.lntooltipWindAyuda,
        text: this.idioma.etiquetas.lbBtnAyuda
    });
	
	//Crear Formulario para adicionar, modificar especialidades
	/*var pDetalles = new Ext.Panel({
		frame: false,
		border:false,
		tbar:[this.btnAdicionar,this.btnModificar,this.btnEliminar],
		layout: 'column',
		autoScroll:true,
		items:[
			{   //columna 1
				layout:'form',
				columnWidth:0.3,

				items:[
					{
						xtype:'textfield',
						name:'codespecialidad1',
						fieldLabel:this.idioma.etiquetas.lbCodigo,
						readOnly:true,
						anchor:'95%',

					},
					{
						xtype: 'textfield',
						name: 'fechaini1',
						fieldLabel:this.idioma.etiquetas.lbFechaini,
						readOnly:true,
						anchor:'95%'

					}
				]
			},
			{
				//columna 2
				layout: 'form',
				columnWidth:0.33,
				items:[
					{
						xtype: 'textfield',
						name: 'denespecialidad1',
						fieldLabel:this.idioma.etiquetas.lbDenominacion,
						readOnly:true,
						anchor:'95%'

					},
					{
						xtype: 'textfield',
						name: 'fechafin1',
						fieldLabel:this.idioma.etiquetas.lbFechafin,
						readOnly:true,
						anchor:'95%'

					}
				]
			},
			{
				//columna3
				layout:'form',
				columnWidth:0.33,
				items:[
					{
						xtype: 'textfield',
						name: 'abrevespecialidad1',
						fieldLabel:this.idioma.etiquetas.lbAbreviatura,
						readOnly:true,
						anchor:'95%'

					}
				]
			}
		]
		
	});*/
	this.fpDetalles = new Ext.FormPanel({
			title: this.idioma.etiquetas.lbDetalles,
			frame: true,
			layout: 'form',
			labelAlign: 'top',
			region: 'center',
			items: [{
					layout: 'column',
					items: [{
							columnWidth: .5,
							style: 'margin:0 0 0 10',
							layout: 'form',
							items: [{
									xtype: 'textfield',
									name: 'codespecialidad1',
									fieldLabel: this.idioma.etiquetas.lbCodigo,
									readOnly: true,
									anchor: '100%'
								}]
						}, {
							columnWidth: .5,
							style: 'margin:0 0 0 10',
							layout: 'form',
							items: [{
									xtype: 'textfield',
									name: 'abrevespecialidad1',
									fieldLabel: this.idioma.etiquetas.lbAbreviatura,
									readOnly: true,
									anchor: '100%'
								}]
						}]
				}, {
					layout: 'column',
					items: [{
							columnWidth: 1,
							style: 'margin:0 0 0 10',
							layout: 'form',
							items: [{
									xtype: 'textfield',
									name: 'denespecialidad1',
									fieldLabel: this.idioma.etiquetas.lbDenominacion,
									readOnly: true,
									anchor: '100%'
								}]
						}]
				}, {
					layout: 'column',
					items: [{
							columnWidth: .5,
							style: 'margin:0 0 0 10',
							layout: 'form',
							items: [{
									xtype: 'textfield',
									name: 'fechaini1',
									fieldLabel: this.idioma.etiquetas.lbFechaini,
									readOnly: true,
									anchor: '100%'
								}]
						}, {
							columnWidth: .5,
							style: 'margin:0 0 0 10',
							layout: 'form',
							items: [{
									xtype: 'textfield',
									name: 'fechafin1',
									fieldLabel: this.idioma.etiquetas.lbFechafin,
									readOnly: true,
									anchor: '100%'

								}]
						}]
				}],
			listeners: {
				resize: function() {//evento al ocultarse
					this.doLayout();
				}
			}
		}
	);
	
	var pfondo = new Ext.Panel({
			id : 'id',
			region : 'center',
			layout : 'border',
			items : [this.trEE,this.fpDetalles],
			tbar : [this.btnAdicionar,this.btnModificar,this.btnEliminar,this.btnAyuda]
			
		});
		
		//Viewpor
		var vpPrincipal = new Ext.Viewport({
			layout:'fit',
			id:'id',
			autoScroll:true,
			items:[pfondo]
		});
	},
	//Funcion crear ventana
	crearVentana:function(opt){
		//level = (parseFloat(this.trEE.getSelectionModel().getSelectedNode().attributes.id) == 0) ? 0 : this.trEE.getSelectionModel().getSelectedNode().attributes.nivel;
	//Botones 
		this.btncancelar = new Ext.Button(
			{
				iconCls : 'cancelar',
				id:'btn_cancelar',
				text : perfil.etiquetas.btnCancelar
				/*handler : function() {
				this.close();
				//pform.getForm().reset();
				}*/
			}
		);


		this.especialidad = new Ext.form.Hidden({
			name: 'idespecialidad'
		});
		var denom = new Ext.form.TextField({
			blankText: this.idioma.etiquetas.textCampoObligado,
			allowBlank: false,
			id:'denom',
			name: 'denespecialidad',
			fieldLabel: this.idioma.etiquetas.lbDenominacion,
			maskRe: /^([a-zA-Z0-9 \xC1\xC9\xD3\xDA\xCD\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\"\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-?, ?, ?, ?, ?, ?, ?, xfc-?   Espacios y caracteres especiales
			regex: /^([a-zA-Z0-9 \xC1\xC9\xD3\xDA\xCD\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\"\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-?, ?, ?, ?, ?, ?, ?, xfc-?  Espacios y caracteres especiales
			regexText: this.idioma.etiquetas.textValorIncorrecto,
			anchor: '100%',
			tabIndex: 2
		});
		var codigo = new Ext.form.TextField({
			blankText: this.idioma.etiquetas.textCampoObligado,
			allowBlank: false,
			maxLength: 3,
			id:'codigo',
			maxLengthText: this.idioma.etiquetas.textTamanno,
			name: 'codespecialidad',
			fieldLabel: this.idioma.etiquetas.lbCodigo,
			regex: /^[0-9]+$/,
			maskRe: /^[0-9]+$/,
			regexText: this.idioma.etiquetas.textValorIncorrecto,
			anchor: '100%',
			tabIndex: 1
		});
		codigo.on('change', function(tf, nv, vv){
			oldvalue = vv;
		})
		var abreviatura = new Ext.form.TextField({
			blankText: this.idioma.etiquetas.textCampoObligado,
			allowBlank: true,
			id:'abreviatura',
			hiddenName: 'abrevespecialidad',
			fieldLabel: this.idioma.etiquetas.lbAbreviatura,
			maskRe: /^([a-zA-Z0-9 \xC1\xC9\xD3\xDA\xCD\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\"\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-?, ?, ?, ?, ?, ?, ?, xfc-?   Espacios y caracteres especiales
			regex: /^([a-zA-Z0-9 \xC1\xC9\xD3\xDA\xCD\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\"\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-?, ?, ?, ?, ?, ?, ?, xfc-?  Espacios y caracteres especiales
			anchor: '100%',
			tabIndex: 3
		});
		var fechaini = new Ext.form.DateField({
			name: 'fechaini',
			id:'fechaini',
			readOnly: true,
			fieldLabel: this.idioma.etiquetas.lbFechaini,
			anchor: '100%',
			value: new Date(),
			format: 'd/m/Y',
			tabIndex: 5
		});
		var fechafin = new Ext.form.DateField({
			name: 'fechafin',
			id:'fechafin',
			readOnly: true,
			fieldLabel: this.idioma.etiquetas.lbFechafin,
			minText: this.idioma.etiquetas.textMinTextFecha,
			anchor: '100%',
			tabIndex: 6
		});
		this.pform = new Ext.FormPanel({
			layout: 'form',
			frame: true,
			region: 'center',
			labelAlign: 'top',
			trackResetOnLoad: true,
			items: [
				this.especialidad, {
					layout: 'column',
					items: [{
							style: 'margin:0 0 0 10',
							columnWidth: .5,
							layout: 'form',
							items: [codigo]
						}, {
							style: 'margin:0 0 0 10',
							columnWidth: .5,
							layout: 'form',
							items: [abreviatura]
						}]
				}, {
					layout: 'column',
					items: [{
							style: 'margin:0 0 0 10',
							columnWidth: 1,
							layout: 'form',
							items: [denom]
						}]
				}, {
					layout: 'column',
					items: [{
							style: 'margin:0 0 0 10',
							columnWidth: .5,
							layout: 'form',
							items: [fechaini]
						}, {
							style: 'margin:0 0 0 10',
							columnWidth: .5,
							layout: 'form',
							items: [fechafin]
						}]
				}]
		});
		
		this.win = new Ext.Window({
			//title : perfil.etiquetas.lbTAdicionar,
                id : 'win2',
                layout : 'fit',
                width : 500,
                constrain:true,
                height : 240,
                resizable : false,
                modal : true,
                //closeAction : 'hide',
                buttons:[
				this.btncancelar,
                {
                    iconCls : 'aplicar',
					id:'btnaplicar',
                    text : perfil.etiquetas.btnAplicar
                    /*handler : function() {
                        aceptar('apl');
                    }*/
                },						

                {
                    iconCls : 'aceptar',
					id:'btnaceptar',
                    text : perfil.etiquetas.btnAceptar
                    /*handler : function() {
                        aceptar();
                    }*/
                }
                ],
                /*keys : ({
                    key:Ext.EventObject.ENTER, 
                    handler:function(){
                        aceptar();
                    }
                }),*/
                items : [this.pform]
			
		});
		
		switch(opt){
			case "add":
				level = (parseFloat(this.trEE.getSelectionModel().getSelectedNode().attributes.id) == 0) ? 0 : this.trEE.getSelectionModel().getSelectedNode().attributes.nivel;
				level = parseFloat(level) + 1;
				this.win.setTitle(this.idioma.etiquetas.lbTAdicionar + level);
			break;
			case"mod":
				this.win.setTitle(this.idioma.etiquetas.lbTModificar);
			break;
		}
		
		this.win.show(this.btnAdicionar);
	}
};