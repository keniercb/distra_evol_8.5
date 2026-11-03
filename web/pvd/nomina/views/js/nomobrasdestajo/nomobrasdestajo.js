/**
 * Nomenclador de tipos de nomina.
 *
 * @author Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Nomencladores.NomObrasDestajo.Panel
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Nomencladores.NomObrasDestajo');

Pvd.Nomina.Nomencladores.NomObrasDestajo.Panel = Ext.extend(Ext.Panel,{
    layout: 'fit',
    region: 'center',
    heigth: '100%', 
    width:  '100%', 
    html: 'dad',
    border: false,
    frame: false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar: 1,
    initComponent: function() {
        
        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomObrasDestajo_Modelo();
        this.modelo.init(this.vista);

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomObrasDestajo_Vista();
        this.vista.init( this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomObrasDestajo_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralObrasDestajo];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

    	Pvd.Nomina.Nomencladores.NomObrasDestajo.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function(x){
            if(this.mostrar == 1){
                this.modelo.storeObrasDestajo.load({params:{limit:20, start:0}});
                this.mostrar = 2;
            } 
        },
        destroy : function(x){
            this.keyMap.disable();
        },
    }
});

//Modelo de la vista del Nomenclador de tipos de destajo.
var Pvd_Nomina_Nomencladores_NomObrasDestajo_Modelo = function(){

    this.init = function (vista) {

    	//Store del listado de tipos de destajo.
     	this.storeObrasDestajo = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/nomobrasdestajo/obtenerListadoObras',
			reader:new Ext.data.JsonReader(
			{
                totalProperty: "cantidad", 
                autoLoad: true, 
                root: "datos", 
                id: "idnomobrasdestajo" 
            }, 
			[ 	 {name: 'idnomobrasdestajo'}
				,{name: 'codigo'}		
				,{name: 'denominacion'}	
				,{name: 'estado'}	
				,{name: 'fechainicio'}	
				,{name: 'fechafin'}		
				,{name: 'identidad'}	
				,{name: 'activo'}	
			]),
            listeners: {
                beforeload: function () {
                },
                load: function () {
                    
                }
            }
		});

    }
};

//Vista del componente Nomenclador de tipos de destajo.
var Pvd_Nomina_Nomencladores_NomObrasDestajo_Vista = function(){  
    // Inicializar la vista.
    this.init = function(perfil, idioma, modelo) 
    {       
        var self = this;  

        /**********Ventana adicionar nomenclador****************** */
    
        this.btnCancelar = new Ext.Button({
            id: 'idbtnCancelar',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescrip',
            nextTab: 'idbtnAplicar'
        });

        this.btnAplicar = new Ext.Button({
            id: 'idbtnAplicar',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelar',
            nextTab: 'idbtnAceptar'
        });

        this.btnAceptar = new Ext.Button({
            id: 'idbtnAceptar',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicar',
            nextTab: 'idtfDenom'
        });

        //Campos del formulario de grupos escalas.
        this.nfCodigo = new Ext.form.NumberField({
            id: 'nfCodigo',
            fieldLabel: idioma.lbColCodigo,
            name: idioma.lbColCodigo,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            anchor: '99%'
        });

        this.tfDenominacion = new Ext.form.TextField({
            id: 'tfDenominacion',
            fieldLabel: idioma.lbColDenominacion,
            tabIndex: 2,
            name: 'denominacion',
            allowBlank: false, anchor: '99%',
            blankText: 'Error campo vacio',
            prevTab: 'idbtnAceptarDestajo',
            vtype: 'vtdenominaciones',
            regexText: 'Denominacion incorrecta',
            maxLength: 100,
            maxLengthText: idioma.lbMaxText_100
        });

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicio', fieldLabel: idioma.lbColDesde,
            tabIndex: 3, name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'dfFFin'
        });

        this.dfFFin = new Ext.form.DateField({
            id: 'dfFFin', fieldLabel: idioma.lbColHasta,
            tabIndex: 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'dfFInicio'
        });

        this.formulario = new Ext.FormPanel({
            id: 'formulario',
            labelAlign: 'top',
            frame: true,
            width: 400,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px'
            },
            items: [
                this.tfDenominacion,
                this.nfCodigo,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .56, layout: 'form', items: [this.dfFInicio]},
                        {columnWidth: .44, layout: 'form', items: [this.dfFFin]}

                    ]
                }
            ]
        });

    	this.winAdicionarNom = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            autoValidate: true,
            validateDefault: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formulario],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptar.disabled) {
                            self.btnAceptar.handler();
                        }
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelar.disabled) {
                            self.btnCancelar.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicar.disabled) {
                            self.btnAplicar.handler();
                        }
                    }
                }
            ]
        });

        
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: 'Ad<u>i</u>cionar',
            tooltip: idioma.textToolTipAdd,
            iconCls: 'adicionar',
            nextTab: 'btnAdd'
        });

        this.btnModificar = new Ext.Button({
            id: 'btnMod',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipMod,
            iconCls: 'modificar',
            prevTab: 'btnAdd',
            nextTab: 'btnElim'
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnElim',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElim,
            iconCls: 'eliminar rojo',
            nextTab: 'btnAyuda'
        });

        this.btnUsar = new Ext.Button({
            id: 'btnUsar',
            text: idioma.lbBtnUsar,
            tooltip: idioma.textToolTipUsarEntidad,
            iconCls: 'usarentidad verde',
            nextTab: 'btnAyuda',
            disabled: true,
        });

        this.btnNoUsar = new Ext.Button({
            id: 'btnElim',
            text: idioma.lbBtnNoUsar,
            tooltip: idioma.textToolTipNoUsarEntidad,
            iconCls: 'usarentidad rojo',
            disabled: true,
        });

        this.btnHavilitar = new Ext.Button({
            id: 'btnHavilitar',
            text: idioma.lbBtnHabilitar,
            tooltip: idioma.textToolTipHabilitar,
            iconCls: 'habilitar verde',
        });

        this.btnNoHavilitar = new Ext.Button({
            id: 'btnNoHavilitar',
            text: idioma.lbBtnNoHabilitar,
            tooltip: idioma.textToolTipNoHabilitar,
            iconCls: 'habilitar rojo',
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyuda,
            iconCls: 'ayuda',
        });

        this.tfBuscar = new Ext.form.TextField({
            id: 'tfBuscar',            
            name: 'tfBuscar',
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar...'
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: 'Buscar',
            tooltip: 'Buscar',
            border: true,
            disabled: false,
            iconCls: 'buscar',            
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar',
            disabled: false,
            iconCls: 'limpiar',
            handler: function () {
                modelo.storeObrasDestajo.load();
                this.tfBuscar.setValue('');
            }.createDelegate(this)
        });

        this.smObras = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        
        this.rowObras = new Ext.grid.RowNumberer();

        this.gpObras = new Ext.grid.GridPanel({
            id        : 'gpObras',
            region    : 'center',
            columns   : [this.rowObras,
                {
                    header: 'Estado', 
                    hidden: false, 
                    hideable: false, 
                    width: 30,
                    dataIndex: 'estado',
                    renderer: fnEstadoEntidad
                },
                {
                    header: 'Entidad', 
                    hidden: false, 
                    hideable: false,
                    width: 30, 
                    dataIndex: 'activo',
                    renderer: fnEntidadActiva
                },
                {
                    header: 'C&oacute;digo', 
                    hidden: false, 
                    hideable: false, 
                    width: 30,
                    dataIndex: 'codigo'
                },
                {
                    header: 'Denominaci&oacute;n', 
                    hidden: false, 
                    hideable: false, 
                    width: 90,
                    dataIndex: 'denominacion'
                },
                {
                    header: 'Fecha inicio', 
                    hidden: false, 
                    hideable: false, 
                    width: 40,
                    dataIndex: 'fechainicio'
                },
                {
                    header: 'Fecha fin', 
                    hidden: false, 
                    hideable: false, 
                    width: 40,
                    dataIndex: 'fechafin'
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border    : false,
            width     : '100%',
            heigth    : '100%',
            viewConfig: {forceFit: true},
            store     : modelo.storeObrasDestajo,
            sm        : this.smObras,
            loadMask  : {msg: idioma.lbMaskGridCargando},
            bbar      : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : modelo.storeObrasDestajo,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            }),
        });

        
        this.panelObras = new Ext.Panel({
            id: 'panelObras',
            region: 'center',
            border: false,
            layout: 'fit',
            tbar: ['Denominaci&oacute;n:', this.tfBuscar, this.btnBuscar, this.btnLimpiar],
            items: [this.gpObras]
        });

        //Panel contenedor general del grid de grupos escala.
        this.panelCentralObrasDestajo = new Ext.Panel({
            id: 'panelCentralObrasDestajo',
            region: 'center',
            heigth: '80%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '|', this.btnUsar, this.btnNoUsar, this.btnHavilitar, this.btnNoHavilitar, '->', this.btnAyuda],
            items: [this.panelObras]
        });
        
        function fnEstadoEntidad(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('estado') == 1) {
                metaData.css = 'icondistra-true verde';
            } else {
                metaData.css = 'icondistra-false rojo';
            }
        }
        
        function fnEntidadActiva(val, metaData, record, rowIndex, colIndex, store) {

            if (record.get('activo') == 1) {
                metaData.css = 'icondistra-usarentidad verde';
            } else if (record.get('activo') == 0) {
                metaData.css = 'icondistra-usarentidad rojo';
            }
        }
    }
};

//Controlador de la vista del Nomenclador 
var Pvd_Nomina_Nomencladores_NomObrasDestajo_Controlador = function(){
    this.init = function(idioma, vista, modelo) {
        var variables = {
            identidad: 100000001,
            accion: 'Add',
            cambio: 0,
            selecction: null,
        };

        var _vista = vista;

        vista.gpObras.on('destroy', function (e) {
            vista.winAdicionarNom.destroy();
        });
        
        modelo.storeObrasDestajo.on('load', function (store, records, opt) {

            vista.gpObras.getSelectionModel().selectFirstRow();

            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos de campo de descripcion. 
        vista.nfCodigo.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de denominacion.
        vista.tfDenominacion.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicio.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFin.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        modelo.storeObrasDestajo.on('beforeload', function (store) {
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
            vista.btnHavilitar.disable();
            vista.btnNoHavilitar.disable();
            store.removeAll();
        });

        vista.smObras.on('selectionchange', function (sm) {
            if(sm.getSelections().length > 0) {
                if(sm.getSelections() > 0) {
                    vista.btnModificar.enable();
                    vista.btnEliminar.enable();
                } else if(sm.getSelections() < 0){
                    vista.btnModificar.disable();
                    vista.btnEliminar.disable();
                }  
                
                if(sm.getSelections()[0].data.activo == 1){
                    vista.btnUsar.disable();
                    vista.btnNoUsar.enable();
                } else{
                    vista.btnUsar.enable();
                    vista.btnNoUsar.disable();
                }
                
                if(sm.getSelections()[0].data.estado == 1){                    
                    vista.btnHavilitar.disable();
                    vista.btnNoHavilitar.enable();
                } else{                  
                    vista.btnHavilitar.enable();
                    vista.btnNoHavilitar.disable();
                }
            }
        });

        //Eventos del seleccion model del grid 
        vista.smObras.on('rowselect', function () {
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
        });

        //Eventos del grid 
        vista.gpObras.on('rowdblclick', function (e) {
            mostrarVentanaModificar();
        });

        vista.btnAdicionar.setHandler(function () {
            mostrarVentanaAdicionar();
        });
        /*
        *Función de mostrar la ventana de adicionar **
        */
        function mostrarVentanaAdicionar() {
            variables.accion = 'Add';

            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/nomobrasdestajo/obtenerNumeroDeCodigo',
                method: 'POST',
                params: {

                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    vista.winAdicionarNom.setTitle(idioma.textToolTipAddTitulo);
                    vista.btnAplicar.show();
                    vista.winAdicionarNom.show();
                    vista.btnCancelar.setNextElement('idbtnAplicar');
                    vista.btnAceptar.setPreviousElement('idbtnAplicar');
                    vista.btnAceptar.show();
                    vista.nfCodigo.setValue(responseData.codigo);
                    vista.tfDenominacion.focus(true, 500);
                }
            });
        }

        //Eventos del botón modificar 
        vista.btnModificar.setHandler(function () {
            mostrarVentanaModificar();
        });
        /*
        *Función de mostrar la ventana de modificar 
        */
        function mostrarVentanaModificar() {
            vista.winAdicionarNom.setTitle(idioma.textToolTipModTitulo);
            vista.btnAplicar.hide();
            vista.winAdicionarNom.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelar.setNextElement('idbtnAceptar');
            vista.btnAceptar.setPreviousElement('idbtnCancelar');
            vista.formulario.getForm().loadRecord(vista.smObras.getSelected());
            variables.accion = 'Mod';
        }
        
        //Eventos del botón eliminar 
        vista.btnEliminar.setHandler(function () {
            eliminarNomenclador();
        });

        vista.btnCancelar.setHandler(function () {
            vista.winAdicionarNom.hide();
        });

        vista.btnAplicar.setHandler(function () {
            salvarFormularioNomenclador(true)
        });

        vista.btnAceptar.setHandler(function () {
            salvarFormularioNomenclador(false)
        });

        vista.btnUsar.setHandler(function () {
            modificarNomencladorEntidad(1);
        });

        vista.btnNoUsar.setHandler(function () {
            modificarNomencladorEntidad(0);
        });

        vista.btnHavilitar.setHandler(function () {
            modificarNomencladorEstado(1);
        });

        vista.btnNoHavilitar.setHandler(function () {
            modificarNomencladorEstado(0);
        });

        vista.btnBuscar.setHandler(function () {

            modelo.storeObrasDestajo.load(
                {
                    params: {
                        start: 0,
                        limit: 15,
                        texto: vista.tfBuscar.getValue()
                    }
                });

        });

        vista.tfBuscar.on('specialkey', function (btn, e) {
            if (e.getKey() == 13) {
                modelo.storeObrasDestajo.load({
                    params: {
                        start: 0,
                        limit: 15,
                        texto: vista.tfBuscar.getValue()
                    }
                });
            }
            
        });

        /********************************************** *******************************************************************************/
        function modificarNomencladorEntidad(activo) {
            mostrarMensaje(2, idioma.lbTitleUsarent, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipo);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/nomobrasdestajo/modificarNomencladorEntidad',
                        method  : 'POST',
                        params  : {
                            idnomobrasdestajo: vista.smObras.getSelected().get('idnomobrasdestajo'),
                            activo: activo
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbTitleAccion);
                                modelo.storeObrasDestajo.removeAll();
                                modelo.storeObrasDestajo.load({params: {limit: 1000, start: 0}});

                            } 
                        }
                    });
                }
            });
        }

        function modificarNomencladorEstado(estado) {
            mostrarMensaje(2, idioma.lbTitleHabilitar, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEstadoTipo);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/nomobrasdestajo/modificarNomencladorEstado',
                        method  : 'POST',
                        params  : {
                            idnomobrasdestajo: vista.smObras.getSelected().get('idnomobrasdestajo'),
                            estado: estado
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbTitleAccion);
                                modelo.storeObrasDestajo.removeAll();
                                modelo.storeObrasDestajo.load({params: {limit: 1000, start: 0}});

                            }
                        }
                    });
                }
            });
        }

        /***********************funsiones para el panel de brigada************************************************************************************* */
        function salvarFormularioNomenclador(boton) {
            var idnomobrasdestajo = 0;
            var urlAction = '/pvd/nomina/index.php/nomobrasdestajo/adicionarNomencladorObras';
            var lbMsgEspera = 'Guardando datos de destajo...';
            var lbMsgExito = 'El destajo ha sido adicionada satisfactoriamente.';

            if (variables.accion == 'Mod') {
                lbMsgEspera = 'Guardando datos de destajo...';
                lbMsgExito = 'El destajo ha sido modificado satisfactoriamente.';
                urlAction = '/pvd/nomina/index.php/nomobrasdestajo/modificarNomencladorObras';
                idnomobrasdestajo = vista.smObras.getSelected().get('idnomobrasdestajo');
            }

            if (variables.cambio == 0) {
                if (variables.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.winAdicionarNom.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.tfDenominacion.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formulario.getForm().isValid()) {
                    PVD.mostrarMascara('idmaskaddmodDestajo', 'Por favor espere…', lbMsgEspera);
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idnomobrasdestajo: idnomobrasdestajo,
                            codigo: vista.nfCodigo.getValue(),
                            denominacion: vista.tfDenominacion.getValue(),
                            fechainicio: vista.dfFInicio.getRawValue(),
                            fechafin: vista.dfFFin.getRawValue(),
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmaskaddmodDestajo');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, responseData.mensaje);
                                if (!boton) {
                                    vista.winAdicionarNom.hide();
                                } else {
                                    vista.tfDenominacion.focus(true, 500);
                                }
                                vista.formulario.getForm().reset();
                                modelo.storeObrasDestajo.removeAll();
                                modelo.storeObrasDestajo.load({params: {limit: 1000, start: 0}});
                                variables.cambio = 0;
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
        function eliminarNomenclador() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarTipo, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarTipo);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/nomobrasdestajo/eliminarNomenclador',
                        method  : 'POST',
                        params  : {
                            idnomobrasdestajo: vista.smObras.getSelected().get('idnomobrasdestajo')
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, idioma.lbTitleModifivarTipo);
                                modelo.storeObrasDestajo.removeAll();
                                modelo.storeObrasDestajo.load({params: {limit: 1000, start: 0}});

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
                            if (!vista.btnAdicionar.disabled && !vista.winAdicionarNom.isVisible()) {
                                mostrarVentanaAdicionar();
                            }
                            break;
                        }
                        case 77: { //m para modificar .
                            if (!vista.btnModificar.disabled && !vista.winAdicionarNom.isVisible()) {
                                // mostrarVentanaModificar();
                            }
                            break;
                        }
                        case 72: { //h para ayuda.
                            if (!vista.winAdicionarNom.isVisible()) {
                                vista.btnAyuda.focus();
                                vista.btnAyuda.fireEvent('click');
                            }
                            break;
                        }
                    }
                }
            },
            {
                key: 46,//del para eliminar.
                fn: function () {
                    if (!vista.btnEliminar.disabled && !vista.winAdicionarNom.isVisible()) {
                        eliminarTipo();
                    }
                }
            },
            {
                key: 13,//enter para aceptar.
                fn: function () {
                    if (vista.btnAceptar.isVisible()) {
                        vista.btnAceptar.focus();
                        vista.btnAceptar.fireEvent('click');
                    }
                }
            }
        ]);

    }
   
};

variablesGlobales.nomobrasdestajo_js = 1;
