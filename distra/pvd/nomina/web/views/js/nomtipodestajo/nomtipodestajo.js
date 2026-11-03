/**
 * Nomenclador de tipos de nomina.
 *
 * @author Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Nomencladores.NomTipoDestajo.Panel
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Nomencladores.NomTipoDestajo');

Pvd.Nomina.Nomencladores.NomTipoDestajo.Panel = Ext.extend(Ext.Panel,{
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
        this.modelo = new Pvd_Nomina_Nomencladores_NomTipoDestajo_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomTipoDestajo_Vista();
        this.vista.init( this.perfil, this.idioma, this.modelo);

         //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomTipoDestajo_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralDestajo];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

    	Pvd.Nomina.Nomencladores.NomTipoDestajo.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function( x){
            if(this.mostrar == 1){
                this.modelo.storeDestajo.load({params:{limit:20, start:0}});
                this.mostrar = 2;
            }    
        },
        destroy : function(x){
            this.keyMap.disable();
        }
    }
});

//Modelo de la vista del Nomenclador de tipos de destajo.
var Pvd_Nomina_Nomencladores_NomTipoDestajo_Modelo = function(){
	/**
     * Inicializar el modelo de la vista.
     */
    this.init = function() {

    	//Store del listado de tipos de destajo.
     	this.storeDestajo = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/nomtipodestajo/obtenerListadoDestajo',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idnomtipodestajo" }, 
			[ 	 {name: 'idnomtipodestajo'}
				,{name: 'denominacion'}		
				,{name: 'fechainicio'}	
				,{name: 'fechafin'}	
				,{name: 'descripcion'}	
			])
		});
		
	}
};

//Vista del componente Nomenclador de tipos de destajo.
var Pvd_Nomina_Nomencladores_NomTipoDestajo_Vista = function(){    
/**
 * Inicializar la vista.
 *
 * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
 * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
 * @param modelo Modelo de la vista del componente Nomenclador de área (Tipo: Pvd_Nomina_Nomencladores_NomDestajo_Modelo).
 */

    this.init = function(perfil, idioma, modelo) 
    {        

        var self = this;

        //Listado de tipos de nómina.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }  

        /**************************************vista principal   */        
        //Botones de Add, Mod, Elim, Ayud de área.
        this.btnAdicionarDestajo = new Ext.Button({
            id: 'btnAddDestajo',
            text: 'Ad<u>i</u>cionar',
            tooltip: idioma.textToolTipAddDestajo,
            iconCls: 'adicionar',
            prevTab: 'btnAyudaDestajo',
            nextTab: 'btnAddDestajo'
        });

        this.btnModificarDestajo = new Ext.Button({
            id: 'btnModDestajo',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModDestajo,
            iconCls: 'modificar',
            prevTab: 'btnAddDestajo',
            nextTab: 'btnElimDestajo'
        });

        this.btnEliminarDestajo = new Ext.Button({
            id: 'btnElimDestajo',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimDestajo,
            iconCls: 'eliminar',
            prevTab: 'btnModDestajo',
            nextTab: 'btnAyudaDestajo'
        });

        this.btnAyudaDestajo = new Ext.Button({
            id: 'btnAyudaDestajo',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaDestajo,
            iconCls: 'ayuda',
            prevTab: 'btnElimDestajo',
            nextTab: 'btnAddDestajo'
        });

        this.smDestajo = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.expanderDestajo = new Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.gpDestajo = new Ext.grid.GridPanel({
            id        : 'gpDestajo',
            title     : idioma.lbTitleDestajo,
            region    : 'center',
            columns   : [
                {
                    header: 'idnomtipodestajo', 
                    hidden: true, 
                    hideable: false, 
                    dataIndex: 'idnomtipodestajo'
                },                 
                this.expanderDestajo,
                {
                    header: '<center>' + idioma.lbColDenominacion + '</center>', 
                    width: 130, 
                    sortable: true, 
                    dataIndex: 'denominacion'
                }, {
                    header: '<center>' + idioma.lbColDesde + '</center>', 
                    width: 90, 
                    sortable: true, 
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                },{
                    header: '<center>' + idioma.lbColHasta + '</center>', 
                    width: 90, 
                    sortable: true, 
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }/*,{
                    header: '<center>' + idioma.lbColDescripcion + '</center>', 
                    width: 200, 
                    sortable: true, 
                    dataIndex: 'descripcion'
                }*/
            ],
            stripeRows: true,
            autoScroll: true,
            border    : false,
            width     : '100%',
            heigth    : '100%',
            viewConfig: {forceFit: true},
            store     : modelo.storeDestajo,
            sm        : this.smDestajo,
            plugins   : this.expanderDestajo,
            loadMask  : {msg: idioma.lbMaskGridCargando},
            bbar      : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : modelo.storeDestajo,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            }),
        });

        //Panel contenedor general del grid de grupos escala.
        this.panelCentralDestajo = new Ext.Panel({
            id: 'idpanelCentralDestajo',
            region: 'center',
            heigth: '80%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarDestajo, this.btnModificarDestajo, this.btnEliminarDestajo, '->', this.btnAyudaDestajo],
            items: [this.gpDestajo]
        });
    
        this.btnCancelarDestajo = new Ext.Button({
            id: 'idbtnCancelarDestajo',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripDestajo',
            nextTab: 'idbtnAplicarDestajo'
        });
        this.btnAplicarDestajo = new Ext.Button({
            id: 'idbtnAplicarDestajo',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarDestajo',
            nextTab: 'idbtnAceptarDestajo'
        });
        this.btnAceptarDestajo = new Ext.Button({
            id: 'idbtnAceptarDestajo',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarDestajo',
            nextTab: 'idtfDenomDestajo'
        });

        //Campos del formulario de grupos escalas.
        this.tfDenomDestajo = new Ext.form.TextField({
            id: 'idtfDenomDestajo',
            fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2,
            name: 'denominacion',
            allowBlank: false, anchor: '99%',
            blankText: idioma.lbErrorCampoVacio,
            prevTab: 'idbtnAceptarDestajo',
            vtype: 'vtdenominaciones',
            regexText: idioma.lbDenomIncorr,
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100
        });

        this.dfFInicioDestajo = new Ext.form.DateField({
            id: 'iddfFInicioDestajo', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinDestajo'
        });
        this.dfFFinDestajo = new Ext.form.DateField({
            id: 'iddfFFinDestajo', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioDestajo'
        });

        this.tfDescripDestajo = new Ext.form.TextArea({
            id: 'idtfDescripDestajo',
            fieldLabel: idioma.lbColDescripcion,
            tabIndex: 5,
            name: 'descripcion',
            allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_225,
            anchor: '99%',
            prevTab: 'iddfFFinDestajo',
            nextTab: 'idbtnCancelarDestajo',
            blankText: idioma.lbErrorCampoVacio
        });

        this.formularioDestajo = new Ext.FormPanel({
            id: 'idformlarioDestajo',
            labelAlign: 'top',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [
                this.tfDenomDestajo,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .56, layout: 'form', items: [this.dfFInicioDestajo]},
                        {columnWidth: .44, layout: 'form', items: [this.dfFFinDestajo]}

                    ]
                },
                this.tfDescripDestajo
            ]
        });

    	this.ventanaDestajo = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            autoValidate: true,
            validateDefault: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioDestajo],
            buttons: [this.btnCancelarDestajo, this.btnAplicarDestajo, this.btnAceptarDestajo],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarDestajo.disabled) {
                            self.btnAceptarDestajo.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarDestajo.disabled) {
                            self.btnCancelarDestajo.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarDestajo.disabled) {
                            self.btnAplicarDestajo.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de tipos de nómina.
var Pvd_Nomina_Nomencladores_NomTipoDestajo_Controlador = function(){
    this.init = function(idioma, vista, modelo) {
        var variables = {
            identidad: 100000001,
            idcargo: 0,
            idarea: 0,
            accion: 'Add',
            cambio: 0,
            ramal: true,
            ramalinst: true,
            treeCargados: 0,
            composicion: 1
        };

        var _vista = vista;
        /***Variables generales***/
        var variablesDestajo = {
            accion: 'Add',
            cambio: 0,
        };

        vista.gpDestajo.on('destroy', function (e) {
            vista.ventanaDestajo.destroy();
        });

        //Eventos del grid de tipos de nómina.
        vista.gpDestajo.on('rowdblclick', function (e) {
            mostrarVentanaModificarDestajo();
        });

        //Eventos del store de tipos de nómina.
        modelo.storeDestajo.on('beforeload', function (store) {
            vista.btnModificarDestajo.disable();
            vista.btnEliminarDestajo.disable();
            store.removeAll();
        });
        
        modelo.storeDestajo.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de tipos de nómina.
        vista.smDestajo.on('rowselect', function () {
            vista.btnModificarDestajo.enable();
            vista.btnEliminarDestajo.enable();
        });

        //Eventos de campo de denominacion.
        vista.tfDenomDestajo.on('change', function (tf, n, o) {
            variablesDestajo.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioDestajo.on('change', function (tf, n, o) {
            variablesDestajo.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinDestajo.on('change', function (tf, n, o) {
            variablesDestajo.cambio = 1;
        });

        //Eventos de campo de descripcion. 
        vista.tfDescripDestajo.on('change', function (tf, n, o) {
            variablesDestajo.cambio = 1;
        });

        /*******************************Eventos de los botones de la vista prinsipal ****************************************************************/

        //Eventos del botón adicionar destajo.
        vista.btnAdicionarDestajo.setHandler(function () {
            mostrarVentanaAdicionarDestajo();
        });

        //Eventos del botón modificar tipos de destajo.
        vista.btnModificarDestajo.setHandler(function () {
            mostrarVentanaModificarDestajo();
        });

        //Eventos del botón eliminar tipos de destajo.
        vista.btnEliminarDestajo.setHandler(function () {
            eliminarTipoDestajo();
        });

        /***Acciones de los botónes de la ventana adicionar tipo destajo***/
        
        //Eventos del botón cancelar.
        vista.btnCancelarDestajo.setHandler(function () {
            vista.ventanaDestajo.hide();
        });

        //Eventos del botón aplicar.
        vista.btnAplicarDestajo.setHandler(function () {
            salvarFormularioDestajo(true);
        });

        //Eventos del botón aceptar.
        vista.btnAceptarDestajo.setHandler(function () {
            salvarFormularioDestajo(false);
        });        

        /*
        *Función de mostrar la ventana de adicionar area**
        */
        function mostrarVentanaAdicionarDestajo() {
            vista.ventanaDestajo.setTitle(idioma.textToolTipAddDestajoTitulo);
            vista.btnAplicarDestajo.show();
            vista.ventanaDestajo.show();
            vista.btnCancelarDestajo.setNextElement('idbtnAplicarDestajo');
            vista.btnAceptarDestajo.setPreviousElement('idbtnAplicarDestajo');
            variablesDestajo.accion = 'Add';
        }

        /*
        *Función de mostrar la ventana de modificar tipos de nómina.
        */
        function mostrarVentanaModificarDestajo() {
            vista.ventanaDestajo.setTitle(idioma.textToolTipModDestajoTitulo);
            vista.btnAplicarDestajo.hide();
            vista.ventanaDestajo.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarDestajo.setNextElement('idbtnAceptarDestajo');
            vista.btnAceptarDestajo.setPreviousElement('idbtnCancelarDestajo');
            vista.formularioDestajo.getForm().loadRecord(vista.smDestajo.getSelected());
            variablesDestajo.accion = 'Mod';
        }

        /***Función para adicionar/modificar un area***/
        function salvarFormularioDestajo(boton) {
            var idnomtipodestajo = 0;
            var urlAction = '/pvd/nomina/index.php/nomtipodestajo/adicionarDestajo';
            var lbMsgEspera = 'Guardando datos de destajo...';
            var lbMsgExito = 'El destajo ha sido adicionada satisfactoriamente.';
            if (variablesDestajo.accion == 'Mod') {
                lbMsgEspera = 'Guardando datos de destajo...';
                lbMsgExito = 'El destajo ha sido modificado satisfactoriamente.';
                urlAction = '/pvd/nomina/index.php/nomtipodestajo/modificarDestajo';
                idnomtipodestajo = vista.smDestajo.getSelected().get('idnomtipodestajo');
            }
            if (variablesDestajo.cambio == 0) {
                if (variablesDestajo.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaDestajo.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenomDestajo.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioDestajo.getForm().isValid()) {
                    PVD.mostrarMascara('idmaskaddmodDestajo', 'Por favor espere…', lbMsgEspera);
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idnomtipodestajo: idnomtipodestajo,
                            denominacion: vista.tfDenomDestajo.getValue(),
                            fechainicio: vista.dfFInicioDestajo.getRawValue(),
                            fechafin: vista.dfFFinDestajo.getRawValue(),
                            descripcion: vista.tfDescripDestajo.getValue()
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmaskaddmodDestajo');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaDestajo.hide();
                                } else {
                                    vista.tfDenomDestajo.focus(true, 500);
                                }
                                vista.formularioDestajo.getForm().reset();
                                modelo.storeDestajo.removeAll();
                                modelo.storeDestajo.load({params: {limit: 1000, start: 0}});
                                variablesDestajo.cambio = 0;
                            } else {
                                if (responseData.codigo == 3)
                                    mostrarMensaje(3, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            }
        }

        /*
         *Función para eliminar un tipo de pago.
         */
        function eliminarTipoDestajo() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTipoDestajo, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipoDestajo);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/nomtipodestajo/eliminarTiposDestajo',
                        method  : 'POST',
                        params  : {
                            idnomtipodestajo: vista.smDestajo.getSelected().get('idnomtipodestajo')
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbTitleModifivarTipoDestajo);
                                //Recargando el grid de tipos de nómina.
                                modelo.storeDestajo.load({params: {limit: 1000, start: 0}});

                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorTipoNomUso);
                            }
                        }
                    });
                }
            });
        }

        /****************************************************************************Teclas calientes de la interfaz******************************************************/
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'imh',
                alt: true,
                stopEvent: true,
                handler: function (k, e) {
                    switch (k) {
                        case 73: { //i para adicionar.
                            if (!vista.btnAdicionarDestajo.disabled && !vista.ventanaDestajo.isVisible()) {
                                mostrarVentanaAdicionarDestajo();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificarDestajo.disabled && !vista.ventanaDestajo.isVisible()) {
                                // mostrarVentanaModificarDestajo();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.ventanaDestajo.isVisible()) {
                                vista.btnAyudaDestajo.focus();
                                vista.btnAyudaDestajo.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminarDestajo.disabled && !vista.ventanaDestajo.isVisible()) {
                        eliminarTipoDestajo();
                    }
                }
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptarDestajo.isVisible()) {
                        vista.btnAceptarDestajo.focus();
                        vista.btnAceptarDestajo.fireEvent('click');
                    }
                }
            }
        ]);


    }
   
};

variablesGlobales.nomtipodestajo_js = 1;
