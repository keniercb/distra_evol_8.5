PVD.IncluirJSUnaVez('/pvd/nomina/views/js/nomgrupoescala/nomgrupoescala_combo.js');

Ext.ns('Pvd.Nomina.Nomencladores.NomSalarioEscala');

Pvd.Nomina.Nomencladores.NomSalarioEscala.Panel = Ext.extend(Ext.Panel, {
    layout: 'fit',
    region: 'center',
    heigth: '100%',
    width: '100%',
    border: false,
    frame: false,
    hideBorders: true,
    perfil: this.perfil,
    idioma: this.idioma,
    mostrar: 1,
    initComponent: function () {

        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Nomencladores_NomSalarioEscala_Modelo();
        this.modelo.init(variablesGlobales.nomsalarioescala_estruc);

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Nomencladores_NomSalarioEscala_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo, variablesGlobales.nomsalarioescala_estruc);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Nomencladores_NomSalarioEscala_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo, variablesGlobales.nomsalarioescala_estruc);

        this.items = [this.vista.panelCentralSalEsc];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Nomencladores.NomSalarioEscala.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeSalEsc.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {
            this.keyMap.disable();
        },
    },
});

//Modelo de la vista del Nomenclador de salarios escalas.
var Pvd_Nomina_Nomencladores_NomSalarioEscala_Modelo = function () {
    /**
     * Inicializar el modelo de la vista.
     */
    this.init = function (estruc) {

        //Arreglo de campos del store de salarios escalas.
        this.campos = [{name: 'idgrupoescala'}
            , {name: 'denomgrupoescala'}
            , {name: 'arrayidsalesc'}
            , {name: 'fechainicio',}
            , {name: 'fechafin'}
        ];

        //Agregando los demás campos al store.
        var cant = estruc.campos.length;
        //Recorriendo el arreglo de estructura.
        for (var i = 0; i < cant; i++) {
            this.campos.push({name: estruc.campos[i]['name']});
        }

        //Store del listado de salarios escalas.
        this.storeSalEsc = new Ext.data.Store({
            url: '/pvd/nomina/index.php/nomsalarioescala/obtenerListadoSalariosEscalas',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idgrupoescala"}, this.campos)
        });
    }
};

//Vista del componente Nomenclador de salarios escalas.
var Pvd_Nomina_Nomencladores_NomSalarioEscala_Vista = function () {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de salarios escalas (Tipo: Pvd_Nomina_Nomencladores_NomSalarioEscala_Modelo).
     */
    this.init = function (perfil, idioma, modelo, estruc) {

        var self = this;

        //Listado de salarios escalas.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smSalEsc = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.cmEscSal = [{
            header: 'idgrupoescala',
            hidden: true,
            width: 50,
            dataIndex: 'idgrupoescala'
        } /*new Ext.grid.RowNumberer() */
            , {
                header: '<center>' + idioma.lbColGrupEsc + '</center>',
                width: 50,
                sortable: true,
                dataIndex: 'denomgrupoescala',
                renderer: centrarValor
            }
        ];

        //Agregando las otras columnas al colunmodel.
        var cant = estruc.campos.length;
        //Recorriendo el arreglo de estructura.
        for (var i = 0; i < cant; i++) {
            //Construyendo el colum model del grid.
            this.cmEscSal.push({
                header: '<center>' + estruc.campos[i]['header'] + '</center>',
                width: 50,
                sortable: true,
                dataIndex: estruc.campos[i]['name'],
                renderer: centrarValor
            });
        }

        this.cmEscSal.push({
            header: '<center>' + idioma.lbColDesde + '</center>',
            width: 100,
            fixed: true,
            sortable: true,
            dataIndex: 'fechainicio',
            renderer: centrarValor
        });
        this.cmEscSal.push({
            header: '<center>' + idioma.lbColHasta + '</center>',
            width: 100,
            fixed: true,
            sortable: true,
            dataIndex: 'fechafin',
            renderer: centrarValor
        });

        this.gpSalEsc = new Ext.grid.GridPanel({
            id: 'idgpSalEs',
            title: idioma.lbTitleSalEsc,
            region: 'center',
            columns: this.cmEscSal,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeSalEsc,
            sm: this.smSalEsc,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeSalEsc,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
        });

        //Botones de Add, Mod, Elim, Ayud de salarios escalas.
        this.btnAdicionarSalEsc = new Ext.Button({
            id: 'btnAddSalEsc',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddSalEsc,
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'btnAyudaSalEsc',
            nextTab: 'btnModSalEsc',
        });

        this.btnModificarSalEsc = new Ext.Button({
            id: 'btnModSalEsc',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModSalEsc,
            //icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'btnAddSalEsc',
            nextTab: 'btnElimSalEsc',
        });

        this.btnEliminarSalEsc = new Ext.Button({
            id: 'btnElimSalEsc',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimSalEsc,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'btnModSalEsc',
            nextTab: 'btnAyudaSalEsc',
        });

        this.btnExportarSalEsc = new Ext.Button({
            id: 'btnExportarSalEsc',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar'
        });

        this.btnAyudaSalEsc = new Ext.Button({
            id: 'btnAyudaSalEsc',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.textToolTipAyudaSalEsc,
            //icon:perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'btnElimSalEsc',
            nextTab: 'btnAddSalEsc',
        });

        //Panel contenedor general del grid de salarios escalas. 
        this.panelCentralSalEsc = new Ext.Panel({
            id: 'idpanelCentralSalEsc',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnAdicionarSalEsc, this.btnModificarSalEsc, this.btnEliminarSalEsc, this.btnExportarSalEsc, '->', this.btnAyudaSalEsc],
            items: [this.gpSalEsc],
        });

        //Campos del formulario de salarios escalas.				
        this.cbGrupEsc = new Pvd.Nomina.Nomencladores.NomGrupoEscala.comboGrupoEsc({
            id: 'idcbGrupEsc',
            fieldLabel: idioma.lbColGrupEsc,
            anchor: '90%',
            prevTab: 'idbtnAceptarSalEsc',
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio,
        });

        this.dfFInicioSalEsc = new Ext.form.DateField({
            id: 'iddfFInicioSalEsc', fieldLabel: idioma.lbColDesde,
            name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'iddfFFinSalEsc'
        });

        this.dfFFinSalEsc = new Ext.form.DateField({
            id: 'iddfFFinSalEsc', fieldLabel: idioma.lbColHasta,
            name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'iddfFInicioSalEsc',
            prevTab: 'iddfFInicioSalEsc', nextTab: 'idbtnCancelarSalEsc',
        });

        //Formulario de salarios escalas.
        this.formularioSalEsc = new Ext.FormPanel({
            id: 'idformlarioSalEsc',
            labelAlign: 'top',
            frame: true,
            width: 350,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
        });

        //Botones de la ventana de salarios escalas.
        this.btnCancelarSalEsc = new Ext.Button({
            id: 'idbtnCancelarSalEsc',
            iconCls: 'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'iddfFFinSalEsc',
            nextTab: 'idbtnAplicarSalEsc',
        });

        this.btnAplicarSalEsc = new Ext.Button({
            id: 'idbtnAplicarSalEsc',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarSalEsc',
            nextTab: 'idbtnAceptarSalEsc',
        });

        this.btnAceptarSalEsc = new Ext.Button({
            id: 'idbtnAceptarSalEsc',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarSalEsc',
            nextTab: 'idcbGrupEsc'
        });

        //Ventana de adicionar y modificar salarios escalas.
        this.ventanaSalEsc = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            closable: true,
            resizable: false,
            layout: 'fit',

            items: [this.formularioSalEsc],
            buttons: [this.btnCancelarSalEsc, this.btnAplicarSalEsc, this.btnAceptarSalEsc],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarSalEsc.disabled) {
                            self.btnAceptarSalEsc.handler();
                        }
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelarSalEsc.disabled) {
                            self.btnCancelarSalEsc.handler();
                        }
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarSalEsc.disabled) {
                            self.btnAplicarSalEsc.handler();
                        }
                    }
                }
            ]
        });
    }
};

//Controlador de la vista del Nomenclador de salarios escalas.
var Pvd_Nomina_Nomencladores_NomSalarioEscala_Controlador = function () {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomenclador de salarios escalas (Tipo: Pvd_Nomina_Nomencladores_NomSalarioEscala_Vista)
     * @param modelo Modelo de la vista del componente Nomenclador de salarios escalas (Tipo: Pvd_Nomina_Nomencladores_NomSalarioEscala_Modelo)
     */
    this.init = function (idioma, vista, modelo, estruc) {
        initViewModel();

        var _vista = vista;
        /**
         *Variables generales.
         */
        var variablesSalEsc = {
            accion: 'Add',
            cambio: 0,
        };

        vista.cbGrupEsc.cargarStore();

        //Eventos del grid de salarios escalas.
        vista.gpSalEsc.on('rowdblclick', function (e) {
            mostrarVentanaModificarSalEsc();
        });

        vista.gpSalEsc.on('destroy', function (e) {
            vista.ventanaSalEsc.destroy();
        });

        //Eventos del store de salarios escalas.
        modelo.storeSalEsc.on('beforeload', function (store) {

            vista.btnModificarSalEsc.disable();
            vista.btnEliminarSalEsc.disable();
            store.removeAll();
        });

        modelo.storeSalEsc.on('load', function (store, records, opt) {
            if (!records.length) {
                mostrarMensaje(1, idioma.lbMsgNoExistenDatos);
            }
        });

        //Eventos del seleccion model del grid de salarios escalas.
        vista.smSalEsc.on('rowselect', function () {
            vista.btnModificarSalEsc.enable();
            vista.btnEliminarSalEsc.enable();
        });

        //Eventos de campo de grupo escala. 
        vista.cbGrupEsc.on('change', function (tf, n, o) {
            variablesSalEsc.cambio = 1;
        });

        vista.cbGrupEsc.on('render', function (comp) {
            if (estruc.campos.length == 0) {
                comp.setNextElement('iddfFInicioSalEsc');
            } else {
                comp.setNextElement('id' + estruc.campos[0]['name']);
            }
        });

        //Eventos de campo de fecha inicio. 
        vista.dfFInicioSalEsc.on('change', function (tf, n, o) {
            variablesSalEsc.cambio = 1;
        });

        vista.dfFInicioSalEsc.on('render', function (comp) {
            if (estruc.campos.length == 0) {
                comp.setPreviousElement('idcbGrupEsc');
            }
        });

        //Eventos de campo de fecha fin. 
        vista.dfFFinSalEsc.on('change', function (tf, n, o) {
            variablesSalEsc.cambio = 1;
        });

        //Eventos del botón adicionar salarios escalas.
        vista.btnAdicionarSalEsc.setHandler(function () {
            mostrarVentanaAdicionarSalEsc();
        });

        //Eventos del botón modificar salarios escalas.
        vista.btnModificarSalEsc.setHandler(function () {
            mostrarVentanaModificarSalEsc();
        });

        //Eventos del botón eliminar salarios escalas.
        vista.btnEliminarSalEsc.setHandler(function () {
            eliminarSalEsc();
        });

        //Exportar
        vista.btnExportarSalEsc.on('click', function () {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/nomsalarioescala/exportarNomenclador';
            iframe.style.display = 'none';
            var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            };
            document.body.appendChild(iframe);
        });

        //Eventos del botón cancelar salarios escalas.
        vista.btnCancelarSalEsc.setHandler(function () {
            vista.ventanaSalEsc.hide();
//            vista.formularioSalEsc.purgeListeners();
        });

        //Eventos del botón aplicar salarios escalas.
        vista.btnAplicarSalEsc.setHandler(function () {
            salvarFormularioSalEsc(true);
        });

        //Eventos del botón aceptar salarios escalas.
        vista.btnAceptarSalEsc.setHandler(function () {
            salvarFormularioSalEsc(false);
//            vista.formularioSalEsc.purgeListeners();
        });

        //Evento de la ventana de adicionar/modificar salarios escalas.
        vista.ventanaSalEsc.on('beforeshow', function (ventana) {
            // vista.cbGrupEsc.cargarStore();
            vista.formularioSalEsc.getForm().reset();
            vista.cbGrupEsc.focus(true, 500);
        });


        /*
         *Función que inicializa la estructura de la vista y el modelo.
         */
        function initViewModel() {

            //Campos del formulario de adicionar y modificaro salarios escalas.
            var campos = new Array();

            //Insertando el combo de grupo escala.
            campos.push({
                columnWidth: .333,
                layout: 'form',
                items: vista.cbGrupEsc
            });
            var aux = 1;

            var cant = estruc.campos.length;
            //Recorriendo el arreglo de estructura.
            for (var i = 0; i < cant; i++) {
                //Creando los campos del formulario.
                aux++;
                //Creando el componente.
                var compt = new Ext.form.NumberField({
                    id: 'id' + estruc.campos[i]['name'],
                    fieldLabel: estruc.campos[i]['header'],
                    // maxLength: 10,
                    // maxLengthText : idioma.lbMaxText_10,
                    maskRe: /[0-9.]/i,
                    regex: /^\d+(\.\d{1,2})?$/i,
                    regexText: idioma.lbErrorFormatoNum,
                    maxValue: 99999,
                    maxText: idioma.lbErrorFormatoNum,
                    name: estruc.campos[i]['name'],
                    anchor: (aux == 3) ? '99%' : '90%',
                    blankText: idioma.lbErrorCampoVacio,
                    allowBlank: false,
                    listeners: {
                        change: function (tf, n, o) {
                            variablesSalEsc.cambio = 1;
                        }
                    },
                });

                //Insertando el componente en el arreglo.
                campos.push({
                    columnWidth: .333,
                    layout: 'form',
                    items: compt
                });

                //Reseteando la variable auxiliar.
                if (aux == 3) {
                    aux = 0;
                }

                if (i == 0) {
                    compt.on('render', function (elemt) {
                        elemt.setPreviousElement('idcbGrupEsc');
                    });
                }
            }

            //Insertando los campos de grupo escala y sectores salariales.
            vista.formularioSalEsc.add({
                layout: 'column',
                items: campos
            });

            //Insertando las fechas de los salarios escalas.
            vista.formularioSalEsc.add({
                layout: 'column',
                items: [{
                    columnWidth: .54,
                    layout: 'form',
                    anchor: '50%',
                    items: [vista.dfFInicioSalEsc]
                }, {
                    columnWidth: .46,
                    layout: 'form',
                    items: [vista.dfFFinSalEsc]
                }]
            });
        }

        /*
         *Función de mostrar la ventana de adicionar salarios escalas.
         */
        function mostrarVentanaAdicionarSalEsc() {
            vista.ventanaSalEsc.setTitle(idioma.lbTitleVentAdicionarSalEsc);
            vista.btnAplicarSalEsc.show();
            vista.ventanaSalEsc.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSalEsc.setNextElement('idbtnAplicarSalEsc');
            vista.btnAceptarSalEsc.setPreviousElement('idbtnAplicarSalEsc');
            variablesSalEsc.accion = 'Add';
        }

        /*
         *Función de mostrar la ventana de modificar salarios escalas.
         */
        function mostrarVentanaModificarSalEsc() {
            vista.ventanaSalEsc.setTitle(idioma.lbTitleVentModificarSalEsc);
//           vista.ventanaSalEsc.setTitle(idioma.lbTitleVentModificarSalEsc);
            vista.btnAplicarSalEsc.hide();
            vista.ventanaSalEsc.show();
            //Actualizar la tabulación deL formulario.
            vista.btnCancelarSalEsc.setNextElement('idbtnAceptarSalEsc');
            vista.btnAceptarSalEsc.setPreviousElement('idbtnCancelarSalEsc');
            vista.formularioSalEsc.getForm().loadRecord(vista.smSalEsc.getSelected());

            variablesSalEsc.accion = 'Mod';
        }

        /*
         *Función para adicionar/modificar un salario escala.
         */
        function salvarFormularioSalEsc(boton) {

            var urlAction = '/pvd/nomina/index.php/nomsalarioescala/adicionarSalariosEscalas';
            var lbMsgEspera = idioma.lbMsgAdicionarSalEsc;
            var lbMsgExito = idioma.lbMsgCorrectoAdicionadoSalEsc;
            var idsalescal = new Array();

            /*Recorriendo los campos de salarios que se crean de forma dinámica 
                y guandando e valor en un array.*/
            var importes = new Array();
            for (var i = 0; i < estruc.campos.length; i++) {
                var campo = estruc.campos[i]['name'];
                var importe = Ext.getCmp('id' + estruc.campos[i]['name']).getValue();
                importes.push(campo + '-' + importe);
            }

            if (variablesSalEsc.accion == 'Mod') {
                lbMsgEspera = idioma.lbMsgModificarSalEsc;
                lbMsgExito = idioma.lbMsgCorrectoModificadoSalEsc;
                urlAction = '/pvd/nomina/index.php/nomsalarioescala/modificarSalariosEscalas';
                idsalescal = vista.smSalEsc.getSelected().get('arrayidsalesc');
            }
            if (variablesSalEsc.cambio == 0) {
                if (variablesSalEsc.accion == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    vista.ventanaSalEsc.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    vista.cbGrupEsc.markInvalid(idioma.lbErrorCampoVacio);
                    for (var i = 0; i < estruc.campos.length; i++) {
                        Ext.getCmp('id' + estruc.campos[i]['name']).markInvalid(idioma.lbErrorCampoVacio);
                    }
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }


            } else {
                //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
                if (vista.formularioSalEsc.getForm().isValid()) {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodsalesc', idioma.lbMsgEsperaEnviarDatos, lbMsgEspera);

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: urlAction,
                        method: 'POST',
                        params: {
                            idgrupoescala: vista.cbGrupEsc.getValue(),
                            idsalescal: Ext.encode(idsalescal),
                            fechainicio: vista.dfFInicioSalEsc.getRawValue(),
                            fechafin: vista.dfFFinSalEsc.getRawValue(),
                            salarios: Ext.encode(importes)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodsalesc');

                            if (responseData.codigo == 1) {
                                mostrarMensaje(1, lbMsgExito);
                                if (!boton) {
                                    vista.ventanaSalEsc.hide();

                                } else {
                                    vista.cbGrupEsc.focus(true, 500);
                                }
                                vista.formularioSalEsc.getForm().reset();
                                modelo.storeSalEsc.removeAll();
                                modelo.storeSalEsc.load({params: {limit: 1000, start: 0}});
                                variablesSalEsc.cambio = 0;
                                variablesSalEsc.cantdin = 0;


                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(3, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(3, idioma.lbErrorFormulario);
                }
            }
        }

        /*
         *Función para eliminar un salario escala.
         */
        function eliminarSalEsc() {
            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, idioma.lbTitleEliminarSalEsc, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminarsalesc', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarSalEsc);
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/nomsalarioescala/eliminarSalariosEscalas',
                        method: 'POST',
                        params: {idgrupoescala: vista.smSalEsc.getSelected().get('idgrupoescala')},
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminarsalesc');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codigo == 1) {
                                //Mostrando el mensaje de que se ha el salario escala.
                                mostrarMensaje(1, idioma.lbMsgCorrectoEliminadoSalEsc, function (btn) {
                                    //Recargando el grid de salarios escalas.
                                    modelo.storeSalEsc.load({params: {limit: 1000, start: 0}});
                                });
                            } else {
                                if (responseData.codigo)
                                    mostrarMensaje(responseData.codigo, idioma.lbMsgErrorSalarioEscUso);
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
            handler: function (k, e) {
                switch (k) {
                    case 73: { //i para adicionar.
                        if (!vista.btnAdicionarSalEsc.disabled && !vista.ventanaSalEsc.isVisible()) {
                            mostrarVentanaAdicionarSalEsc();
                        }
                        break;
                    }
                    case 77: { //m para modificar .
                        if (!vista.btnModificarSalEsc.disabled && !vista.ventanaSalEsc.isVisible()) {
                            mostrarVentanaModificarSalEsc();
                        }
                        break;
                    }
                    case 72: { //h para ayuda.
                        if (!vista.ventanaSalEsc.isVisible()) {
                            vista.btnAyudaSalEsc.focus();
                            vista.btnAyudaSalEsc.fireEvent('click');
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar.
            fn: function () {
                if (!vista.btnEliminarSalEsc.disabled && !vista.ventanaSalEsc.isVisible()) {
                    eliminarSalEsc();
                }
            },
        }, {
            key: 13,//enter para aceptar.
            fn: function () {
                if (vista.btnAceptarSalEsc.isVisible()) {
                    vista.btnAceptarSalEsc.focus();
                    vista.btnAceptarSalEsc.fireEvent('click');
                }
            },
        }]);
    }
};

Ext.Ajax.request({
    url: '/pvd/nomina/index.php/nomsalarioescala/obtenerArregloEstructura',
    method: 'POST',
    callback: function (options, success, response) {
        variablesGlobales.nomsalarioescala_estruc = Ext.decode(response.responseText);
        variablesGlobales.nomsalarioescala_js = 1;
    }
});

