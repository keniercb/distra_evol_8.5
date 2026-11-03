Ext.ns('Ext.component.persona');

Ext.component.persona.Vista={

	init: function(perfil, idioma, modelo) {
		/*----------------  FORMULARIO  ----------------*/
		//Botón aceptar
		this.btnAceptar = new Ext.Button({
			id      : 'btnAceptar',
			text    : idioma.lbBtnAceptar,
			tooltip : idioma.ttBtnAceptar,
			icon    : perfil.dirImg + 'aceptar.png',
			iconCls : 'btn'
		});

        this.btnModificar = new Ext.Button({
            id      : 'btnModificar',
            text    : 'Modificar',
            tooltip : 'Modificar',
            icon    : perfil.dirImg + 'modificar.png',
            iconCls : 'btn'
        });

		//Botón cancelar
		this.btnCancelar = new Ext.Button({
			id      : 'btnCancelar',
			text    : idioma.lbBtnCancelar,
			tooltip : idioma.ttBtnCancelar,
			icon    : perfil.dirImg + 'cancelar.png',
			iconCls : 'btn'
		});

		//Componente de recuperaciones complejas
		this.objRecComplejas = new Ext.components.CmpReccomplejas.Interfaz({
            margins: '5 0 5 0',
			title: 'Reporte de personas',
			width: '100%',
			height: 330,
			region: 'center',
			border: true,
			idconfiguracion: 'personas',
			tituloReporte: 'Reporte de personas',
			tituloConfiguracion: 'Configuración de la búsqueda',
			tituloGrid: 'Listado de personas',			
			hideBtnRtf: false,
			singleSelect: true,
			noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
			useMap: false,
			hideBtnOperCant: false,
			renderers: getRenderes()
		});

		function getRenderes() {
			return Ext.apply({
				showSexo: function (val) {
					if (val == 0) {
						return '<center><img src="/pvd/credenciales/views/images/female.png" /></center>';
					} else {
						return '<center><img src="/pvd/credenciales/views/images/male.png" /></center>';
					}
				}, showGradoMilitar: function (val, opt, rec) {
					// grado
					if (!Ext.isEmpty(val)) {
						return '<center><img ext:qtip="<b>' + rec.data.grado + '</b>" style="height: 16px;cursor: pointer" src="' + val + '" /></center>';
					} else {
						return '<center><img src="' + Ext.BLANK_IMAGE_URL + '" /></center>';
					}
				}
			});
		};

		//Combobox para la causa de limitación
		this.cbCausa = new Ext.form.ComboBox({
            name           : 'cbCausa',
			triggerAction  :   'all',
			id             : 'idcausa',
			fieldLabel     : idioma.lbCBCausaLimit,
			labelSeparator : ' ',
			anchor         : '80%',
			forceSelection : true,
			editable       : false,
			store          : modelo.storeCausas,
			displayField   : 'dencausa',
			valueField     : 'idcausa',
			queryMode      : 'local',
			emptyText      : "Seleccione la causa de la limitación...",
			typeAhead      : true,
            allowBlank     : false
        });
		//Fecha desde
		this.dfDesde = new Ext.form.DateField({
            name: 'fdesde',
            fieldLabel     : idioma.lbDFfdesde,
			labelSeparator : ' ',
            anchor         : '80%',
            format         : 'd/m/Y',
            editable       : true,
            readOnly       : false,
            allowBlank     : false,
            value          : new Date().format('d/m/Y')
        });
		//Fecha hasta
		this.dfHasta = new Ext.form.DateField({
            name           : 'dfHasta',
            fieldLabel     : idioma.lbDFfhasta,
			labelSeparator : ' ',
            anchor         : '80%',
            format         : 'd/m/Y',
            editable       : true,
            readOnly       : false,
            allowBlank     : true
        });
		//Formulario
		this.fpDatos = new Ext.FormPanel({
			layout     : 'column',
			frame      : true,
			region     : 'south',
			width      : '100%',
			autoHeight : true,
			autoShow   : true,
			items      : [{
							columnWidth : 0.40,
							layout      : 'form',
							items       : [this.cbCausa]
						},{
							columnWidth : 0.30,
							layout      : 'form',
							items       : [this.dfDesde]
						},{
							columnWidth : 0.30,
							layout      : 'form',
							items       : [this.dfHasta]
						}]
    });
        //Panel de adicionar
		this.panelForm = new Ext.Panel({
			layout       : 'border',
			region       : 'south',
			collapseMode : 'mini',
			width        : '100%',
			height       : 400,
			bbar         : ['->', this.btnAceptar, this.btnModificar, this.btnCancelar],
			//items        : [this.fpDatos]
			items        : [this.objRecComplejas, this.fpDatos]
		});
		/*----------------  PANEL PRINCIPAL  ----------------*/
		//Botón para adicionar reserva
		this.btnAdicionar = new Ext.Button({
			id      : 'btnAdicionar',
			text    : idioma.lbBtnAdicionar,
			tooltip : idioma.ttBtnAdicionar,
			icon    : perfil.dirImg + 'adicionar.png',
			iconCls : 'btn'
		});

        this.btnModificar = new Ext.Button({
            id      : 'btnModificar',
            text    : 'Modificar',
            tooltip : 'Modificar limitación',
            icon    : perfil.dirImg + 'modificar.png',
            iconCls : 'btn'
        });

        this.btnRemove = new Ext.Button({
            id      : 'btnRemove',
            text    : 'Eliminar',
            tooltip : 'Eliminar una limitación',
            icon    : perfil.dirImg + 'eliminar.png',
            iconCls : 'btn'
        });

        this.searchField = new Ext.app.SearchField({
            store: this.stPersonas

        });
		//Botón Ayuda
		this.btnAyuda = new Ext.Button({
			id      : 'btnAyuda',
			text    : idioma.lbBtnAyuda,
			tooltip : idioma.lbBtnAyuda,
			icon    : perfil.dirImg + 'ayuda.png',
			iconCls : 'btn'
		});
		//Expander
		this.expander = new Ext.grid.RowExpander({
			tpl : new Ext.Template('<div><b>Causa: </b>{causa} <br/> <div><b>Fecha inicio: </b>{fdesde} <br/> <b>Fecha fin: </b>{fhasta}</div>')
		});
		this.gpLimitados = new Ext.grid.GridPanel({         
            title: 'Listado de limitados',
            width: '100%',  
            region:'center',
            border: false,         
            stripeRows: true,         
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: true,
                groupTextTpl: '{group}'
            }),        
            store: modelo.store,                    
            columns    : [
				//this.expander,
				{id : 'identificacion', header : '',                 dataIndex : 'identificacion', menuDisabled : true, sortable : true, hidden:true},
                {id : 'idpersona',      header: 'No Registro',            dataIndex: 'registro',         menuDisable: true, sortable : true},
                {id : 'idnombre',        header : 'Nombre',            dataIndex : 'nombre',          menuDisabled : true, sortable : true},
                {id : 'idpapel',       header : 'Primer apellido',  dataIndex : 'apellido',     menuDisabled : true, sortable : true},
                {id : 'idsapel',       header : 'Segundo apellido', dataIndex : 'apellido2',     menuDisabled : true, sortable : true},
				{id : 'idfdesde',       header : 'Fecha inicio',     dataIndex : 'fdesde',         menuDisabled : true, sortable : true},
				{id : 'idfhasta',       header : 'Fecha fin',        dataIndex : 'fhasta',         menuDisabled : true, sortable : true},
                {id : 'idcausa',        header : 'Causa',            dataIndex : 'causa',          menuDisabled : true, sortable : true}
			],
            bbar:new Ext.PagingToolbar({
                pageSize: 18,
                store:modelo.store,
                displayMsg: 'Mostrando {0} - {1} de {2} ',
                emptyMsg: 'No hay elementos que mostrar',
                displayInfo: true
            })
        }); 
		//Panel principal
		this.pPrincipal = new Ext.Panel({			
			region     : 'center',
			layout     :'border',
			width      : '100%',
			autoScroll : true,
			tbar       : [this.btnAdicionar, this.btnModificar, this.btnRemove, '->', this.searchField , this.btnAyuda],
			items      : [this.gpLimitados, this.panelForm]
		});
		/*----------------  VIEWPORT  ----------------*/
		var viewport = new Ext.Viewport({
			layout : 'fit',
			items  :[this.pPrincipal]
		});
	}
}

var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarlimitacion', function(perfil, idioma) {
	//Escogiendo la configuración del idioma según la versión del MT.
	idioma = (idioma) ? idioma : perfil.etiquetas;
	//Inicializando el modelo
	var modelo = Ext.component.persona.Modelo;
	modelo.init(perfil);
	//modelo.storeCausas.load();
	//Inicializando la vista.
	var vista = Ext.component.persona.Vista;
	vista.init(perfil,idioma, modelo);
	//Inicializar controlador.
	var controller = Ext.component.persona.Controlador;
	controller.init(perfil,idioma, vista, modelo);
});