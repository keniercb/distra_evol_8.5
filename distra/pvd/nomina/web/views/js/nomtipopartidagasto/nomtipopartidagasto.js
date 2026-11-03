Ext.ns('Pvd.Nomina.Nomencladores.NomTipoPartidagasto');

Pvd.Nomina.Nomencladores.NomTipoPartidagasto.Panel = Ext.extend(Ext.Panel,{
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomTipoPartidagasto_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomTipoPartidagasto_Vista();
        this.vista.init( this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomTipoPartidagasto_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralTipoPartidagasto];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomTipoPartidagasto.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function( x){
            if(this.mostrar == 1){
                this.modelo.storeTPartidaG.load({params:{limit:20, start:0}});
                this.mostrar = 2;
            }
        },
        destroy : function(x){
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de tipos de conceptos de percepciones y descuentos.
var Pvd_Nomina_Nomencladores_NomTipoPartidagasto_Modelo = function(){
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function() {

        //Store del listado de tipos de conceptos de percepciones y descuentos.
        this.storeTPartidaG= new Ext.data.Store({
             url: '/pvd/nomina/index.php/nomtipopartidagasto/obtenerListadoTiposPartidaGasto',
            reader:new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idtipopartidagasto" },
                [ 	 {name: 'idtipopartidagasto'}
                    ,{name: 'denominacion'}
                    ,{name: 'fechainicio'}
                    ,{name: 'fechafin'}
                    ,{name: 'descripcion'}
                ])
        });
    }
};

//Vista del componente Nomenclador de tipos de conceptos de percepciones y descuentos.
var Pvd_Nomina_Nomencladores_NomTipoPartidagasto_Vista = function(){
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de conceptos
     *  de percepciones y descuentos (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Modelo).
     */
    this.init = function(perfil, idioma, modelo) {

        var self = this;

        //Listado de tipos de conceptos de percepciones y descuentos.
        function centrarValor(val){
            if(val)
                return "<center>"+val+"</center>";
        }

        this.expanderTPartidaG = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });

        this.smTPartidaG  = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

        this.gpTPartidaG = new Ext.grid.GridPanel({
            id:'idgpTPartidaG',
            title:idioma.lbTitleTPartidaG,
            region:'center',
            columns: [{header: 'idtipopartidagasto',	hidden: true, hideable: false, dataIndex: 'idtipopartidagasto'}
                , this.expanderTPartidaG
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
            store: modelo.storeTPartidaG,
            sm: this.smTPartidaG,
            plugins: this.expanderTPartidaG,
            loadMask:{msg : idioma.lbMaskGridCargando},
            bbar:new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeTPartidaG,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de tipos de conceptos de percepciones y descuentos.
        this.btnAdicionarTPartidaG = new Ext.Button({
            id: 'btnAddTPartidaG',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddTPartidaG,
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaTPartidaG',
            nextTab: 'btnModTPartidaG',
        });

        this.btnModificarTPartidaG = new Ext.Button({
            id: 'btnModTPartidaG',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModTPartidaG,
           // icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddTPartidaG',
            nextTab: 'btnElimTPartidaG',
        });

        this.btnEliminarTPartidaG = new Ext.Button({
            id: 'btnElimTPartidaG',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTPartidaG,
           // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModTPartidaG',
            nextTab: 'btnAyudaTPartidaG',
        });

        this.btnAyudaTPartidaG = new Ext.Button({
            id: 'btnAyudaTPartidaG',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaTPartidaG,
          //  icon:perfil.dirImg+'ayuda.png',
            iconCls:'ayuda',
            prevTab: 'btnElimTPartidaG',
            nextTab: 'btnAddTPartidaG',
        });

        //Panel contenedor general del grid de tipos de conceptos de percepciones y descuentos. 
        this.panelCentralTipoPartidagasto = new Ext.Panel({
            id:'idpanelCentralTipoPartidagasto',
            region:'center',
            heigth: '100%',
            width:  '100%',
            border:false,
            layout:'fit',
            tbar:[this.btnAdicionarTPartidaG, this.btnModificarTPartidaG, this.btnEliminarTPartidaG, '->', this.btnAyudaTPartidaG],
            items:[this.gpTPartidaG],
        });

        //Campos del formulario de tipos de conceptos de percepciones y descuentos.
        this.tfDenomTPartidaG = new Ext.form.TextField({id:'idtfDenomTPartidaG', fieldLabel:idioma.lbColDenominacion,
            tabIndex: 2, name: 'denominacion', allowBlank: false,  anchor: '99%',
            blankText:idioma.lbErrorCampoVacio, prevTab: 'idbtnAceptarTPartidaG',
            regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText:idioma.lbDenomIncorr, //maskRe
            maxLength:100,
            maxLengthText:idioma.lbMaxText_100,
        });

        this.dfFInicioTPartidaG = new Ext.form.DateField({id:'iddfFInicioTPartidaG', fieldLabel:idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format:'d/m/Y', editable:true, readOnly : false,
            value: new Date().format('d/m/Y'), maxText : idioma.lbFechaMaxima,
            minText : idioma.lbFechaMinima, blankText:idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype:'daterange',
            anchor: '90%', endDateField: 'iddfFFinTPartidaG'
        });

        this.dfFFinTPartidaG = new Ext.form.DateField({id:'iddfFFinTPartidaG', fieldLabel:idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format:'d/m/Y', editable:true, readOnly : false,
            maxText : idioma.lbFechaMaxima, minText : idioma.lbFechaMinima,
            blankText:idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype:'daterange', anchor: '99%', startDateField: 'iddfFInicioTPartidaG'
        });

        this.tfDescripTPartidaG = new Ext.form.TextArea({id:'idtfDescripTPartidaG',
            fieldLabel:idioma.lbColDescripcion, tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname:'descripcion',
            maxLength: 255,
            maxLengthText : idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'iddfFFinTPartidaG', nextTab: 'idbtnCancelarTPartidaG',
            blankText:idioma.lbErrorCampoVacio,
        });

        //Formulario de tipos de conceptos de percepciones y descuentos.
        this.formularioTPartidaG = new Ext.FormPanel({
            id:'idformlarioTPartidaG',
            labelAlign: 'top',
            frame:true,
            width: 300,
            autoHeight:true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items:[{layout:'column',
                items:[
                    {columnWidth:.99, layout: 'form', items: [this.tfDenomTPartidaG]},
                ]
            },{layout:'column',
                items:[
                    {columnWidth:.54, layout: 'form', items: [this.dfFInicioTPartidaG]},
                    {columnWidth:.46, layout: 'form', items: [this.dfFFinTPartidaG]}
                ]
            },
                this.tfDescripTPartidaG
            ],
        });

        //Botones de la ventana de tipos de conceptos de percepciones y descuentos.
        this.btnCancelarTPartidaG = new Ext.Button({
            id:'idbtnCancelarTPartidaG',
            iconCls:'cancelar',
          //  icon:perfil.dirImg+'cancelar.png',
            text:idioma.lbBtnCancelar,
            tooltip:idioma.textToolTipCancelar,
            prevTab: 'idtfDescripTPartidaG',
            nextTab: 'idbtnAplicarTPartidaG',
        });

        this.btnAplicarTPartidaG = new Ext.Button({
            id:'idbtnAplicarTPartidaG',
            iconCls:'aplicar',
           // icon:perfil.dirImg+'aplicar.png',
            text:idioma.lbBtnAplicar,
            tooltip:idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTPartidaG',
            nextTab: 'idbtnAceptarTPartidaG',
        });

        this.btnAceptarTPartidaG = new Ext.Button({
            id:'idbtnAceptarTPartidaG',
            iconCls:'aceptar',
           // icon:perfil.dirImg+'aceptar.png',
            text:idioma.lbBtnAceptar,
            tooltip:idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarTPartidaG',
            nextTab: 'idtfDenomTPartidaG',
        });

        //Ventana de adicionar y modificar tipos de conceptos de percepciones y descuentos.
        this.ventanaTPartidaG = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable:true,
            resizable:false,
            layout: 'fit',
            constrain :true,
            autoValidate: true,
            validateDefault: true,
            items:[this.formularioTPartidaG],
            buttons: [this.btnCancelarTPartidaG, this.btnAplicarTPartidaG, this.btnAceptarTPartidaG] ,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarTPartidaG.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarTPartidaG.handler();
                    }
                },{
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarTPartidaG.handler();
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de tipos de conceptos de percepciones y descuentos.
var Pvd_Nomina_Nomencladores_NomTipoPartidagasto_Controlador = function(){
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de tipos de conceptos de percepciones y descuentos.
     * (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de tipos de conceptos de percepciones y descuentos.
     * (Tipo: Pvd_Nomina_Nomencladores_NomTipoConceptoPD_Modelo)
     */
    this.init = function(idioma, vista, modelo) {
        var vista=vista;
        /**
         *Variables generales.
         */
        var variablesTPartidaG = {
            accion : 'Add',
            cambio : 0,
        };

        //Eventos del grid de tipos de conceptos de percepciones y descuentos.
        vista.gpTPartidaG.on('rowdblclick', function(e){
            mostrarVentanaModificarTPartidaG();
        });

        vista.gpTPartidaG.on('destroy', function(e){
            vista.ventanaTPartidaG.destroy();
        });

        //Eventos del store de tipos de conceptos de percepciones y descuentos.
        modelo.storeTPartidaG.on('beforeload', function(store){
            vista.btnModificarTPartidaG.disable();
            vista.btnEliminarTPartidaG.disable();
            store.removeAll();
        });

        modelo.storeTPartidaG.on('load', function(store, records, opt){
            if(!records.length){
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de tipos de conceptos de percepciones y descuentos.
        vista.smTPartidaG.on('rowselect', function(){
            vista.btnModificarTPartidaG.enable();
            vista.btnEliminarTPartidaG.enable();
        });

        //Eventos de campo de denominacion. 
        vista.tfDenomTPartidaG.on('change', function(tf, n, o){
            variablesTPartidaG.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioTPartidaG.on('change', function(tf, n, o){
            variablesTPartidaG.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinTPartidaG.on('change', function(tf, n, o){
            variablesTPartidaG.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripTPartidaG.on('change', function(tf, n, o){
            variablesTPartidaG.cambio = 1;
        });

        //Eventos del botón adicionar tipos de conceptos de percepciones y descuentos.
        vista.btnAdicionarTPartidaG.setHandler(function(){
            mostrarVentanaAdicionarTPartidaG();
        });

        //Eventos del botón modificar tipos de conceptos de percepciones y descuentos.
        vista.btnModificarTPartidaG.setHandler(function(){
            mostrarVentanaModificarTPartidaG();
        });

        //Eventos del botón eliminar tipos de conceptos de percepciones y descuentos.
        vista.btnEliminarTPartidaG.setHandler(function(){
            eliminarTipoPartidaGasto();
        });



        //Eventos del botón cancelar tipos de conceptos de percepciones y descuentos.
        vista.btnCancelarTPartidaG.setHandler(function(){
            vista.ventanaTPartidaG.hide();
        });

        //Eventos del botón aplicar tipos de conceptos de percepciones y descuentos.
        vista.btnAplicarTPartidaG.setHandler(function(){
            salvarFormularioTPartidaG(true);
        });

        //Eventos del botón aceptar tipos de conceptos de percepciones y descuentos.
        vista.btnAceptarTPartidaG.setHandler(function(){
            salvarFormularioTPartidaG(false);
        });

        //Evento de la ventana de adicionar/modificar tipos de conceptos de percepciones y descuentos.
        vista.ventanaTPartidaG.on('beforeshow', function(ventana){
            vista.formularioTPartidaG.getForm().reset();
            vista.tfDenomTPartidaG.focus(true,500);
        });

        /*
         *Función de mostrar la ventana de adicionar tipos de conceptos de percepciones y descuentos.
         */
        function mostrarVentanaAdicionarTPartidaG(){
            vista.ventanaTPartidaG.setTitle(idioma.lbTitleVentAdicionarTPartidaG);
            vista.btnAplicarTPartidaG.show();
            vista.ventanaTPartidaG.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTPartidaG.setNextElement('idbtnAplicarTPartidaG');
            vista.btnAceptarTPartidaG.setPreviousElement('idbtnAplicarTPartidaG');
            variablesTPartidaG.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar tipos de conceptos de percepciones y descuentos.
         */
        function mostrarVentanaModificarTPartidaG(){
            vista.ventanaTPartidaG.setTitle(idioma.lbTitleVentModificarTPartidaG);
            vista.btnAplicarTPartidaG.hide();
            vista.ventanaTPartidaG.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarTPartidaG.setNextElement('idbtnAceptarTPartidaG');
            vista.btnAceptarTPartidaG.setPreviousElement('idbtnCancelarTPartidaG');
            vista.formularioTPartidaG.getForm().loadRecord(vista.smTPartidaG.getSelected());
            variablesTPartidaG.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un tipo de concepto de percepciones y descuentos.
         */
        function salvarFormularioTPartidaG(boton){

              var urlAction = '/pvd/nomina/index.php/nomtipopartidagasto/adicionarTiposPartidaGasto';
            var idtipoconceptopd = 0;
            var lbMsgEspera = idioma.lbMsgAdicionarTPartidaG;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoTPartidaG;

            if(variablesTPartidaG.accion == 'Mod'){
                lbMsgEspera = idioma.lbMsgModificarTPartidaG;
                lbMsgExito = idioma.lbMsgCorrectoModificadoTPartidaG;
                urlAction = '/pvd/nomina/index.php/nomtipopartidagasto/modificarTiposPartidaGasto';
                idtipoconceptopd = vista.smTPartidaG.getSelected().get('idtipopartidagasto');
            }
            if(variablesTPartidaG.cambio == 0){
                if(variablesTPartidaG.accion == 'Mod'){
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaTPartidaG.hide();
                }else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomTPartidaG.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }else{
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if(vista.formularioTPartidaG.getForm().isDirty()){
                if(vista.formularioTPartidaG.getForm().isValid()){

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtconceptopd', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method:'POST',
                        params:{idtipopartidagasto : idtipoconceptopd,
                            denominacion : vista.tfDenomTPartidaG.getValue(),
                            fechainicio : vista.dfFInicioTPartidaG.getRawValue(),
                            fechafin : vista.dfFFinTPartidaG.getRawValue(),
                            descripcion : vista.tfDescripTPartidaG.getValue(),
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtconceptopd');

                            if(responseData.codigo == 1){
                                mostrarMensaje(1, lbMsgExito);
                                if(!boton){
                                    vista.ventanaTPartidaG.hide();

                                }else{
                                    vista.tfDenomTPartidaG.focus(true,500);
                                }
                                vista.formularioTPartidaG.getForm().reset();
                                modelo.storeTPartidaG.removeAll();
                                modelo.storeTPartidaG.load({params:{limit:20, start:0}});
                                variablesTPartidaG.cambio = 0;


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
        }

        /*
         *Función para eliminar un tipo de concepto de percepciones y descuentos.
         */
        function eliminarTipoPartidaGasto(){
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2,idioma.lbTitleEliminarTPartidaG,function(btn){
                if(btn == "ok"){
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarTPartidaG',idioma.lbMsgEsperaEnviarDatos,idioma.lbMsgEliminarTPartidaG);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                         url: '/pvd/nomina/index.php/nomtipopartidagasto/eliminarTiposPartidaGasto',
                        method:'POST',
                        params: {idtipopartidagasto:vista.gpTPartidaG.getSelectionModel().getSelected().get('idtipopartidagasto')},
                        callback: function (options,success,response){
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarTPartidaG');
                            responseData = Ext.decode(response.responseText);

                            if(responseData.codigo == 1){
                                //Mostrando el mensaje de que se ha el tipo de concepto de percepciones y descuentos.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoTPartidaG);
                                //Recargando el grid de tipos de conceptos de percepciones y descuentos.
                                modelo.storeTPartidaG.load({params:{limit:20, start:0}});

                            }else{
                                if (responseData.codigo)
                                    mostrarMensaje(3, responseData.mensaje);
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
                        if(!vista.btnAdicionarTPartidaG.disabled && !vista.ventanaTPartidaG.isVisible()){
                            mostrarVentanaAdicionarTPartidaG();
                        }
                        break;
                    }
                    case 77:{ //m para modificar .
                        if(!vista.btnModificarTPartidaG.disabled && !vista.ventanaTPartidaG.isVisible()){
                            mostrarVentanaModificarTPartidaG();
                        }
                        break;
                    }
                    case 72:{ //h para ayuda. 
                        if(!vista.ventanaTPartidaG.isVisible()){
                            vista.btnAyudaTPartidaG.focus();
                            vista.btnAyudaTPartidaG.fireEvent('click');
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar.
            fn: function(){if(!vista.btnEliminarTPartidaG.disabled && !vista.ventanaTPartidaG.isVisible()){
                eliminarTipoPartidaGasto();
            }}
        },{
            key: 13,//enter para aceptar.
            fn: function(){if(vista.btnAceptarTPartidaG.isVisible()){
                vista.btnAceptarTPartidaG.focus();
                vista.btnAceptarTPartidaG.fireEvent('click');
            }}
        }]);
    }
};

variablesGlobales.nomtipopartidagasto_js = 1;
