Ext.ns('Pvd.Nomina.Nomencladores.NomCuentasCierre');

Pvd.Nomina.Nomencladores.NomCuentasCierre.Panel = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    heigth: '100%',
    width: '100%',
    html: 'dad',
    border: false,
    frame: false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar: 1
    ,
    initComponent: function () {

        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomCuentasCierre_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomCuentasCierre_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomCuentasCierre_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentral];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomCuentasCierre.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeC.load({params: {limit: 20, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disabled();
        },
    },
});

//Modelo de la vista del Nomenclador
var Pvd_Nomina_Nomencladores_NomCuentasCierre_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function () {

        //Store del listado
        this.storeC = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomcuentascierre/obtenerListadoCuentas',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "id"},
                [
                    {name: 'id'}, 
                    {name: 'idcuenta'},
                    {name: 'tipo'},
                    {name: 'cuenta'}
                ])
        });
    
    
        //Store de las cuentas con su id y denominacion
        this.storeCuentas = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomcuentascierre/obtenerCuentas', 
            autoLoad: true,           
            reader: new Ext.data.JsonReader(
                {totalProperty: "cont", root: "datos", id:"idcuenta"},
                [   
                    {name: 'idcuenta'},
                    {name: 'cuenta'},
                    {name: 'denomcuenta'}
                ])
        });

        //Store de los tipos
        this.storeTipo = new Ext.data.SimpleStore({
            fields: [
                {name:'denom'},
                {name:'tipo'}
            ],
            data: [
                ['1','1'],
                ['2','2'],
               
            ]
        });
    }
}
//Vista del componente Nomenclador
var Pvd_Nomina_Nomencladores_NomCuentasCierre_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de  (Tipo: Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Modelo).
     */
    this.init = function (perfil, idioma, modelo) {

        var self = this;

        //Listado
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderC= new Ext.grid.RowNumberer({});

        this.smC = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpC = new Ext.grid.GridPanel({
            id: 'gpC',
            title: idioma.lbTitle,
            region: 'center',
            //son los nombres de las columnas
            columns: [ this.smC, this.expanderC
                ,{header: 'id', hidden: true  ,hideable: false, width: 500, dataIndex: 'id'}
                ,{header: 'Cuenta',  hideable: false, width: 500, dataIndex: 'cuenta'}
                , {header:'IdCuenta' , hidden: true ,sortable: true, dataIndex: 'idcuenta'}
                , {header:idioma.lbColTipo , width: 500, sortable: true, dataIndex: 'tipo'}
                 ],
            stripeRows: true,
            autoScroll: true,
        
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeC,
            sm: this.smC,
            // plugins: this.expanderC,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });
        

        //Botones de Add, Mod, Elim, Ayud
        this.btnSincronizar = new Ext.Button({
            id: 'btnSincronizar',
            text: idioma.lbBtnSincronizar,
            tooltip: idioma.textToolTipS,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'sincronizar',
        });
        
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAdd,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyuda',
            nextTab: 'btnModificar',
        });

        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            disabled: true,
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipMod,
            //icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAdicionar',
            nextTab: 'btnEliminar',
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.lbBtnEliminar,            
            disabled: true,
            tooltip: idioma.textToolTipElim,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModificar',
            nextTab: 'btnExportar',
        });

        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyuda,
            // icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnEliminar',
            nextTab: 'btnSincronizar',
        });
        
      

        //Panel contenedor general del grid 
        this.panelCentral = new Ext.Panel({
            id: 'idpanelCentral',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnExportar, '->', this.btnAyuda,this.btnSincronizar],
            items: [this.gpC],
          
        });

        //Campos del formulario
        //Campos del formulario NomCuentasCierre
             
        this.cbDenom = new Ext.form.ComboBox({
            id: 'idcbDenom', 
            fieldLabel: idioma.lbColDenom,
            tabIndex : 1, 
            valueField: 'idcuenta',
            displayField: 'cuenta', 
            hiddenName: 'idcuenta',
            allowBlank: false, 
            mode: 'local',
            store: modelo.storeCuentas, 
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, 
            readOnly: false,
            triggerAction: 'all', 
            anchor: '90%'
        });
        
        this.cbTipo = new Ext.form.ComboBox({
            id: 'idcbTipo', 
           fieldLabel: idioma.lbColTipo,
            tabIndex : 2, 
            valueField: 'denom',
            displayField: 'denom',
            hiddenName: 'tipo',
            allowBlank: false, 
            mode: 'local',
            store:modelo.storeTipo, 
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, 
            readOnly: true,
            triggerAction: 'all', 
            anchor: '90%'
        });

        //Formulario
        this.formulario = new Ext.FormPanel({
            id: 'idformulario',
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .99, layout: 'form', items: [this.cbDenom]},
                    {columnWidth: .99, layout: 'form', items: [this.cbTipo]},
                    
                ]
            }]            
        });
          //Botones de la ventana 
             
        this.btnCancelar = new Ext.Button({
            id: 'idbtnCancelar',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idcbTipo',
            nextTab: 'idbtnAplicar',
        });

        this.btnAplicar = new Ext.Button({
            id: 'idbtnAplicar',
            iconCls: 'aplicar',
            //icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelar',
            nextTab: 'idbtnAceptar',
        });

        this.btnAceptar = new Ext.Button({
            id: 'idbtnAceptar',
            iconCls: 'aceptar',
            disabled: true,
            //icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idcbTipo',
        });
        this.btnAceptarModif = new Ext.Button({
            id: 'idbtnAceptarModif',
            iconCls: 'aceptar',
            disabled: true,
            //icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            
        });

        //Ventana de adicionar y modificar .
        this.ventanaC = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            layout: 'fit', 
            constrain: true,
            autoValidate: true,
            validateDefault: true,
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
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelar.disabled) {
                            self.btnCancelar.handler();
                        }
                    }
                }, {
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
    }
};


//Controlador de la vista del Nomenclador
var Pvd_Nomina_Nomencladores_NomCuentasCierre_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de  (Tipo: Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de  (Tipo: Pvd_Nomina_Nomencladores_NomCausasExclusionNomina_Modelo)
     */
    this.init = function (idioma, vista, modelo) {
        var vista = vista;
        /**
         *Variables generales.
         */
        var variables= {
            accion: 'Add',
            cambio: 0,
        };
        //Eventos del grid
        vista.gpC.on('rowdblclick', function (e) {
            mostrarVentanaModificar();
        });
        vista.gpC.on('destroy', function (e) {
            vista.ventanaC.destroy();
        });
         vista.gpC.on('destroy', function (e) {
            vista.btnAceptar.enable();
        });
        

        //Eventos del store
        modelo.storeC.load(
            {params:{
            start: 0,limit: 10}
        });
         modelo.storeC.on('beforeload', function (store) {
            vista.btnModificar.disabled = true;
            vista.btnEliminar.disabled = true;
            store.removeAll();
        });
       
           modelo.storeC.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        vista.smC.on('selectionchange', function (sm) {
            if(sm.getSelections().length > 0) {
                vista.btnEliminar.enable();
                vista.btnModificar.enable();
                // variables.id=vista.smC.getSelected().get('id');
            } else{
                vista.btnEliminar.disable();
                vista.btnModificar.disable();
            }            
        });

        //Eventos del campo denominacion. 
        vista.cbDenom.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de tipo. 
        vista.cbTipo.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        
        //Eventos del botón adicionar .
        vista.btnAdicionar.setHandler(function () {
            mostrarVentanaAdicionar();
           
        });
       
         //Eventos del botón modificar .
        vista.btnModificar.setHandler(function () {
            mostrarVentanaModificar();
        });

    //Eventos del botón Sincronizar .
        vista.btnSincronizar.on('click',function(){
            modelo.storeC.load({params: {limit: 20, start: 0}});
        }),

      
        //Eventos del botón eliminar .
        vista.btnEliminar.on('click',function () {
            mostrarMensaje(2, idioma.lbTitleEliminar, function (btn) {
                if (btn == "ok") {
                    var arryidcuenta = Array(); 
                    var arrdatos = vista.smC.getSelections(); //console.info(arrdatos);
                    Ext.each(arrdatos, function (v) {
                        arryidcuenta.push(v.data.idcuenta); //console.info(arrypersonas);
                    });			
                    PVD.mostrarMascara('idmaskval', 'Por favor espere...', 'Enviando datos');
                    Ext.Ajax.request({
                    //Enviando los datos al servidor.
                        url: '/pvd/nomina/index.php/nomcuentascierre/eliminarCC',
                        method: 'POST',
                        params: { arryidcuenta: Ext.encode(arryidcuenta) },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskval');
                           responseData = Ext.decode(response.responseText);   //console.info(responseData);                    
                           if (responseData.codigo == 1) {
                                mostrarMensaje(1, 'La(s) cuenta(s) fue(ron) eliminada(s).');
                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(3, 'La(s) cuenta(s) no pudieron ser eliminada(s).');
                            }
                            
                        }
                    });
                }
                modelo.storeC.load();
            });
        });
        

        //Exportar
        vista.btnExportar.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomcuentascierre/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar .
        vista.btnCancelar.setHandler(function () {
            vista.ventanaC.hide();
        });

        //Eventos del botón aplicar .
        vista.btnAplicar.setHandler(function () {
            salvarFormulario(true);            
            vista.ventanaC.show();
            modelo.storeC.load({params: {limit: 20, start: 0}});
        });

        //Eventos del botón aceptar .
        vista.btnAceptar.setHandler(function () {
            salvarFormulario(true);
            vista.ventanaC.hide();
            modelo.storeC.load({params: {limit: 20, start: 0}});
        });
        
        vista.btnAceptarModif.setHandler(function () {
            salvarFormulario(true);
            vista.ventanaC.hide();
            modelo.storeC.load({params: {limit: 20, start: 0}});
        });    
        
        
        //Evento de la ventana de adicionar/modificar .
        vista.ventanaC.on('beforeshow', function (ventana) {
            vista.formulario.getForm().reset();
            variables.cambio = 0;
            vista.cbDenom.focus(true, 400);
            vista.cbTipo.focus(true, 400);
        });
     
        /*
         *Función de mostrar la ventana de adicionar .
         */
        function mostrarVentanaAdicionar() {
            vista.ventanaC.setTitle(idioma.lbTitleVentAdicionar);
            vista.ventanaC.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelar.setNextElement('idbtnAplicar');
            vista.btnAceptar.setPreviousElement('idbtnAplicar');
            variables.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar .
         */
        function mostrarVentanaModificar() {
            vista.ventanaC.setTitle(idioma.lbTitleVentModificar);
            vista.ventanaC.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelar.setNextElement('idbtnAplicar');
            vista.btnAceptar.setPreviousElement('idbtnAplicar');
            vista.formulario.getForm().loadRecord(vista.smC.getSelected());
            variables.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un tipo de pago.
         */
        function salvarFormulario(boton) {
            var urlAction = '/pvd/nomina/index.php/nomcuentascierre/adicionarCC';
            var id= 0;
            var lbMsgEspera = idioma.lbMsgAdicionar;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionado;

            if (variables.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificar;
                lbMsgExito = idioma.lbMsgCorrectoModificado;
                urlAction = '/pvd/nomina/index.php/nomcuentascierre/modificarCC';
                id = vista.smC.getSelected().get('id');
            }
            if (variables.cambio == 0) {
                if (variables.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaC.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.cbDenom.markInvalid(idioma.lbErrorCampoVacio);
                    vista.cbTipo.markInvalid(idioma.lbErrorCampoVacio);
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }

            } else {
               
                //Se verifica si el formulario es válido 
                if (vista.formulario.getForm().isValid()) {
                   
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmod', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);
                   
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {id: id, 
                                 tipo: vista.cbTipo.getValue(), 
                                 idcuenta: vista.cbDenom.getValue()},
                        callback: function (options, success, response) { //console.info(id);
                            //Ocultando máscara de enviar datos.
                             PVD.ocultarMascara('idmaskaddmod');
                            responseData = Ext.decode(response.responseText);   //console.info(responseData);                    
                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, idioma.lbMsgExito);
                                if (!boton) {
                                    vista.ventanaC.hide();
                                  } else {
                                    vista.cbTipo.focus(true, 500);
                                    vista.cbDenom.focus(true, 500);
                                }
                                vista.formulario.getForm().reset();
                                //modelo.storeC.removeAll();
                                mostrarMensaje(2, 'Acci&oacute;n realizada satisfactoriamente ');
                                modelo.storeC.load({params: {limit: 20, start: 0}});
                                variables.cambio = 0;
                                // vista.ventanaC.hide();
                            }
                            else {
                                if (responseData.codigo)
                                    mostrarMensaje(3, responseData.msg, idioma.lbMsgErrorUso);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
             }
                vista.ventanaC.hide();
        }

        /**
         *Teclas calientes de la interfaz.
         */
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 73: { //i para adicionar.
                        if (!vista.btnAdicionar.disabled && !vista.ventanaC.isVisible()) {
                            mostrarVentanaAdicionar();
                        }
                        break;
                    }
                    case 77: { //m para modificar .
                        if (!vista.btnModificar.disabled && !vista.ventanaC.isVisible()) {
                            mostrarVentanaModificar();
                        }
                        break;
                    }
                    case 72: { //h para ayuda.
                        if (!vista.ventanaC.isVisible()) {
                            vista.btnAyuda.focus();
                            vista.btnAyuda.fireEvent('click');
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar.
            fn: function () {
                if (!vista.btnEliminar.disabled && !vista.ventanaC.isVisible()) {
                    eliminarCC();
                }
            },
        }, {
            key: 13,//enter para aceptar.
            fn: function () {
                if (vista.btnAceptar.isVisible()) {
                    vista.btnAceptar.focus();
                    vista.btnAceptar.fireEvent('click');
                }
            },
        }]);
    }
};

variablesGlobales.nomcuentascierre_js = 1;