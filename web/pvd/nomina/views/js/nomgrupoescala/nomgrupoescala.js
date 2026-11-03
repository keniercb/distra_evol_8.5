Ext.ns('Pvd.Nomina.Nomencladores.NomGrupoEscala');

Pvd.Nomina.Nomencladores.NomGrupoEscala.Panel = Ext.extend(Ext.Panel,{
    layout:'fit',
    region: 'center',
    heigth: '100%', 
    width:  '100%', 
    html:'dad',
    border: false,
    frame:false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar:1,
    initComponent: function() {
        
        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomGrupoEscala_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomGrupoEscala_Vista();
        this.vista.init( this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomGrupoEscala_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralGrupoE];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

    	Pvd.Nomina.Nomencladores.NomGrupoEscala.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function( x){
            if(this.mostrar == 1){
                this.modelo.storeGrupoE.load({params:{limit:1000, start:0}});
                this.mostrar = 2;
            }    
        },
        destroy : function(x){
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de grupos escala.
var Pvd_Nomina_Nomencladores_NomGrupoEscala_Modelo = function(){
	/**
     * Inicializar el modelo de la vista.
     */
    this.init = function() {

    	//Store del listado de grupos escala.
     	this.storeGrupoE = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/nomgrupoescala/obtenerListadoGruposEscala',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idgrupoescala" }, 
			[ 	 {name: 'idgrupoescala'}
				,{name: 'denominacion'}		
				,{name: 'fechainicio'}	
				,{name: 'fechafin'}	
				,{name: 'descripcion'}	
			])
		});
    }
};

//Vista del componente Nomenclador de grupos escalas.
var Pvd_Nomina_Nomencladores_NomGrupoEscala_Vista = function(){
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de grupos escalas (Tipo: Pvd_Nomina_Nomencladores_NomGrupoEscala_Modelo).
     */
    this.init = function(perfil, idioma, modelo) {

        var self = this;

    	//Listado de grupos escalas.
    	function centrarValor(val){
			if(val)
				return "<center>"+val+"</center>";
		}

        this.expanderGrupoE = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });

        this.smGrupoE = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

        this.gpGrupoE = new Ext.grid.GridPanel({
            id:'idgpGrupoE',
            title:idioma.lbTitleGrupoE,
            region:'center',
            columns: [{header: 'idgrupoescala',	hidden: true, hideable: false, dataIndex: 'idgrupoescala'} 
                    ,this.expanderGrupoE
                    ,{header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
                    ,{header: '<center>'+idioma.lbColDesde+'</center>', width: 90, sortable: true, dataIndex: 'fechainicio', renderer:centrarValor}
                    ,{header: '<center>'+idioma.lbColHasta+'</center>', width: 90, sortable: true, dataIndex: 'fechafin', renderer:centrarValor}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%', 
            heigth: '100%', 
            viewConfig: {forceFit: true},
            store: modelo.storeGrupoE,
            sm: this.smGrupoE,
            plugins:this.expanderGrupoE,
            loadMask:{msg : idioma.lbMaskGridCargando},
            bbar:new Ext.PagingToolbar({ 
                pageSize: 1000, 
                store: modelo.storeGrupoE,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de grupos escalas.
        this.btnAdicionarGrupoE = new Ext.Button({
            id: 'btnAddGrupoE',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddGrupoE,
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaGrupoE',
            nextTab: 'btnModGrupoE',
        });

        this.btnModificarGrupoE = new Ext.Button({
            id: 'btnModGrupoE',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModGrupoE,
           // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddGrupoE',
            nextTab: 'btnElimGrupoE',
        });

        this.btnEliminarGrupoE = new Ext.Button({
            id: 'btnElimGrupoE',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimGrupoE,
            //icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModGrupoE',
            nextTab: 'btnAyudaGrupoE',
        });

        this.btnAyudaGrupoE = new Ext.Button({
            id: 'btnAyudaGrupoE',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaGrupoE,
            //icon:perfil.dirImg+'ayuda.png',
            iconCls:'ayuda',
            prevTab: 'btnElimGrupoE',
            nextTab: 'btnAddGrupoE',
        });

        //Panel contenedor general del grid de grupos escala. 
        this.panelCentralGrupoE = new Ext.Panel({
            id:'idpanelCentralGrupoE',
            region:'center',
            heigth: '100%', 
            width:  '100%', 
            border:false,
            layout:'fit',
            tbar:[this.btnAdicionarGrupoE, this.btnModificarGrupoE, this.btnEliminarGrupoE, '->', this.btnAyudaGrupoE],
            items:[this.gpGrupoE],
        });

        //Campos del formulario de grupos escalas.
        this.tfDenomGrupoE = new Ext.form.TextField({id:'idtfDenomGrupoE', fieldLabel:idioma.lbColDenominacion, 
                                        tabIndex: 2, name: 'denominacion', allowBlank: false,  anchor: '99%',
                                        blankText:idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarGrupoE', 
//                                        regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            vtype        : 'vtdenominaciones',
                                        regexText:idioma.lbDenomIncorr,
                                        blankText:idioma.lbErrorCampoVacio,
										maxLength:100,
                                        maxLengthText:idioma.lbMaxText_100,
        });
                                
        this.dfFInicioGrupoE = new Ext.form.DateField({id:'iddfFInicioGrupoE', fieldLabel:idioma.lbColDesde, 
                                        tabIndex: 3, name: 'fechainicio', allowBlank: false, 
                                        format:'d/m/Y', editable:true, readOnly : false, 
                                        value: new Date().format('d/m/Y'), maxText : idioma.lbFechaMaxima, 
                                        minText : idioma.lbFechaMinima, blankText:idioma.lbErrorCampoVacio, 
                                        invalidText: idioma.invalidTextFecha, vtype:'daterange', 
                                        anchor: '90%', endDateField: 'iddfFFinGrupoE'
                                });
                                
        this.dfFFinGrupoE = new Ext.form.DateField({id:'iddfFFinGrupoE', fieldLabel:idioma.lbColHasta, 
                                        tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
                                        format:'d/m/Y', editable:true, readOnly : false, 
                                        maxText : idioma.lbFechaMaxima, minText : idioma.lbFechaMinima, 
                                        blankText:idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha, 
                                        vtype:'daterange', anchor: '99%', startDateField: 'iddfFInicioGrupoE'
                                });
                                
        this.tfDescripGrupoE = new Ext.form.TextArea({id:'idtfDescripGrupoE',
                                        fieldLabel:idioma.lbColDescripcion, tabIndex: 5, 
                                        name: 'descripcion', allowBlank: true, 
                                        hiddenname:'descripcion',
										maxLength: 255, //regex, regexText, maskRe
										maxLengthText : idioma.lbMaxText_225, 
                                        anchor: '99%', prevTab: 'iddfFFinGrupoE', nextTab: 'idbtnCancelarGrupoE',
                                        blankText:idioma.lbErrorCampoVacio, 
                                });

        //Formulario de grupos escalas.
        this.formularioGrupoE = new Ext.FormPanel({
            id:'idformlarioGrupoE',
            labelAlign: 'top',
            frame:true,
            width: 300,
            autoHeight:true, 
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },  
            items:[{layout:'column',
                        items:[
                            {columnWidth:.99, layout: 'form', items: [this.tfDenomGrupoE]},
                        ]
                    },{layout:'column',
                        items:[
                            {columnWidth:.54, layout: 'form', items: [this.dfFInicioGrupoE]},
                            {columnWidth:.46, layout: 'form', items: [this.dfFFinGrupoE]}
                        ]
                    },
                    this.tfDescripGrupoE
            ],
        });

        //Botones de la ventana de grupos escalas
        this.btnCancelarGrupoE = new Ext.Button({
            id:'idbtnCancelarGrupoE',
            iconCls:'cancelar',
           // icon:perfil.dirImg+'cancelar.png',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idtfDescripGrupoE', 
            nextTab: 'idbtnAplicarGrupoE',
        });
        
        this.btnAplicarGrupoE = new Ext.Button({
            id:'idbtnAplicarGrupoE',
            iconCls:'aplicar',
           // icon:perfil.dirImg+'aplicar.png',
            text:idioma.lbBtnAplicar,   
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarGrupoE', 
            nextTab: 'idbtnAceptarGrupoE',
        });

        this.btnAceptarGrupoE = new Ext.Button({
            id:'idbtnAceptarGrupoE',
            iconCls:'aceptar',
            //icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarGrupoE', 
            nextTab: 'idtfDenomGrupoE',
        });

        //Ventana de adicionar y modificar grupos escala.
        this.ventanaGrupoE = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            constrain: true,
            resizable:false, 
            layout: 'fit',
            autoValidate: true,
            validateDefault: true,
            items:[this.formularioGrupoE],
            buttons: [this.btnCancelarGrupoE, this.btnAplicarGrupoE, this.btnAceptarGrupoE] ,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarGrupoE.disabled) {
                            self.btnAceptarGrupoE.handler();
                        }
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarGrupoE.disabled) {
                            self.btnCancelarGrupoE.handler();
                        }
                    }
                },{
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarGrupoE.disabled) {
                            self.btnAplicarGrupoE.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de grupos escalas.
var Pvd_Nomina_Nomencladores_NomGrupoEscala_Controlador = function(){
	/**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de grupos escala (Tipo: Pvd_Nomina_Nomencladores_NomGrupoEscala_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de grupos escala (Tipo: Pvd_Nomina_Nomencladores_NomGrupoEscala_Modelo)
     */
    this.init = function(idioma, vista, modelo) {
        var _vista=vista;
        /**
         *Variables generales.
         */
        var variablesGrupoE = {
            accion : 'Add',
            cambio : 0,
        };
        
        //Eventos del grid de grupos escala.
        vista.gpGrupoE.on('rowdblclick', function(e){
            mostrarVentanaModificarGrupoE();
        }); 

        vista.gpGrupoE.on('destroy', function(e){
            vista.ventanaGrupoE.destroy();
        }); 

        //Eventos del store de grupos escala.
        modelo.storeGrupoE.on('beforeload', function(store){
            vista.btnModificarGrupoE.disable();
            vista.btnEliminarGrupoE.disable();
            store.removeAll();
        }); 

		modelo.storeGrupoE.on('load', function(store, records, opt){
			if(!records.length){
				mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
			}
        });
        //Eventos del seleccion model del grid de grupos escala.
        vista.smGrupoE.on('rowselect', function(){
            vista.btnModificarGrupoE.enable();
            vista.btnEliminarGrupoE.enable();
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomGrupoE.on('change', function(tf, n, o){
            variablesGrupoE.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioGrupoE.on('change', function(tf, n, o){
            variablesGrupoE.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinGrupoE.on('change', function(tf, n, o){
            variablesGrupoE.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripGrupoE.on('change', function(tf, n, o){
            variablesGrupoE.cambio = 1;
        });

        //Eventos del botón adicionar grupos escala.
        vista.btnAdicionarGrupoE.setHandler(function(){
            mostrarVentanaAdicionarGrupoE();
        });
        
        //Eventos del botón modificar grupos escala.
        vista.btnModificarGrupoE.setHandler(function(){
            mostrarVentanaModificarGrupoE();
        });

        //Eventos del botón eliminar grupos escala.
        vista.btnEliminarGrupoE.setHandler(function(){
            eliminarGrupoEscala();
        });
        


        //Eventos del botón cancelar grupos escala.
        vista.btnCancelarGrupoE.setHandler(function(){
            vista.ventanaGrupoE.hide();
//            vista.formularioGrupoE.purgeListeners();
        });
        
        //Eventos del botón aplicar grupos escala.
        vista.btnAplicarGrupoE.setHandler(function(){
            salvarFormularioGrupoE(true);
        });

        //Eventos del botón aceptar grupos escala.
        vista.btnAceptarGrupoE.setHandler(function(){
            salvarFormularioGrupoE(false);
//            vista.formularioGrupoE.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar grupos escala.
        vista.ventanaGrupoE.on('beforeshow', function(ventana){
			variablesGrupoE.cambio = 0;
            vista.formularioGrupoE.getForm().reset();
            vista.tfDenomGrupoE.focus(true,500);  
        });

        /*
         *Función de mostrar la ventana de adicionar grupos escala.
         */
        function mostrarVentanaAdicionarGrupoE(){
            vista.ventanaGrupoE.setTitle(idioma.lbTitleVentAdicionarGrupoE);
            vista.btnAplicarGrupoE.show();
            vista.ventanaGrupoE.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarGrupoE.setNextElement('idbtnAplicarGrupoE');
            vista.btnAceptarGrupoE.setPreviousElement('idbtnAplicarGrupoE');
            variablesGrupoE.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar grupos escala.
         */
        function mostrarVentanaModificarGrupoE(){
            vista.ventanaGrupoE.setTitle(idioma.lbTitleVentModificarGrupoE);
            vista.btnAplicarGrupoE.hide();
            vista.ventanaGrupoE.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarGrupoE.setNextElement('idbtnAceptarGrupoE');
            vista.btnAceptarGrupoE.setPreviousElement('idbtnCancelarGrupoE');
            vista.formularioGrupoE.getForm().loadRecord(vista.smGrupoE.getSelected());

//            vista.formularioGrupoE.addListener('clientvalidation', function (_form, _valid) {
//                if (comparar(vista.formularioGrupoE.getForm().getValues(), vista.smGrupoE.getSelected().data)) {
//                    vista.btnAceptarGrupoE.setDisabled(true);
//                } else {
//                    vista.btnAceptarGrupoE.enable();
//                }
//            });
            variablesGrupoE.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un grupo escala.
         */
        function salvarFormularioGrupoE(boton){

            var urlAction = '/pvd/nomina/index.php/nomgrupoescala/adicionarGrupoEscala';
            var idgrupoescala = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarGrupoE;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoGrupoE;

            if(variablesGrupoE.accion == 'Mod'){
                lbMsgEspera = idioma.lbMsgModificarGrupoE;
                lbMsgExito = idioma.lbMsgCorrectoModificadoGrupoE;
                urlAction = '/pvd/nomina/index.php/nomgrupoescala/modificarGrupoEscala';
                idgrupoescala = vista.smGrupoE.getSelected().get('idgrupoescala');
            }
            if(variablesGrupoE.cambio == 0){
                if(variablesGrupoE.accion == 'Mod'){
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaGrupoE.hide(); 
                }else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomGrupoE.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }else{
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if(vista.formularioGrupoE.getForm().isValid()){

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodgrupoescala', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method:'POST',
                        params:{idgrupoescala : idgrupoescala,
                                denominacion : vista.tfDenomGrupoE.getValue(), 
                                fechainicio : vista.dfFInicioGrupoE.getRawValue(), 
                                fechafin : vista.dfFFinGrupoE.getRawValue(), 
                                descripcion : vista.tfDescripGrupoE.getValue(), 
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodgrupoescala');

                            if(responseData.codigo == 1){
                                mostrarMensaje(1, lbMsgExito);
                                    if(!boton){
                                        vista.ventanaGrupoE.hide();

                                    }else{
                                         vista.tfDenomGrupoE.focus(true,500);  
                                    }
                                    vista.formularioGrupoE.getForm().reset();
                                    modelo.storeGrupoE.removeAll();
                                    modelo.storeGrupoE.load({params:{limit:1000, start:0}});
                                    variablesGrupoE.cambio = 0;
                               
                                
                            }else{
                                if (responseData.codigo)
                                    mostrarMensaje(3, responseData.mensaje);
                            }
                        }
                    });
                }else{
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }     
            }
        }

        /*
         *Función para eliminar un grupo escala.
         */
        function eliminarGrupoEscala(){
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2,idioma.lbTitleEliminarGrupoE,function(btn){
                if(btn == "ok"){
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminargrupoescala',idioma.lbMsgEsperaEnviarDatos,idioma.lbMsgEliminarGrupoE);                    
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomgrupoescala/eliminarGrupoEscala',
                        method:'POST',
                        params: {idgrupoescala:vista.smGrupoE.getSelected().get('idgrupoescala')},
                        callback: function (options,success,response){
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminargrupoescala');                                 
                            responseData = Ext.decode(response.responseText);
                            if(responseData.codigo == 1){
                                //Mostrando el mensaje de que se ha el grupo escala.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoGrupoE);
                                    //Recargando el grid de grupos escala.
                                    modelo.storeGrupoE.load({params:{limit:1000, start:0}});
                               
                            }else{
						      if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorGrupoEscalaUso);
						  }   
                        }           
                    });
                }
            });
        }

        /**
         *Teclas calientes de la interfaz.
         */
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true, 
            handler: function(k, e) {
               switch(k) {
                    case 73:{ //i para adicionar.
                        if(!vista.btnAdicionarGrupoE.disabled && !vista.ventanaGrupoE.isVisible()){
                               mostrarVentanaAdicionarGrupoE();
                        }
                     break;
                    } 
                    case 77:{ //m para modificar .
                        if(!vista.btnModificarGrupoE.disabled && !vista.ventanaGrupoE.isVisible()){
                            mostrarVentanaModificarGrupoE();
                        }
                     break;
                    }
                    case 72:{ //h para ayuda. 
                         if(!vista.ventanaGrupoE.isVisible()){
                            vista.btnAyudaGrupoE.focus();
							vista.btnAyudaGrupoE.fireEvent('click');
                        }
                        break;
                    }
               }
            }      
        },{
            key: 46,//del para eliminar.
            fn: function(){if(!vista.btnEliminarGrupoE.disabled && !vista.ventanaGrupoE.isVisible()){
                eliminarGrupoEscala();
            }},
        },{
            key: 13,//enter para aceptar.
            fn: function(){if(vista.btnAceptarGrupoE.isVisible()){
                vista.btnAceptarGrupoE.focus();
                vista.btnAceptarGrupoE.fireEvent('click');
            }},
        }]);
    }
};

variablesGlobales.nomgrupoescala_js = 1;
