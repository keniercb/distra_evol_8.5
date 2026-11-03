Ext.ns('Pvd.Nomina.Configuracion.OrdenCamposNomina');

Pvd.Nomina.Configuracion.OrdenCamposNomina.Panel = Ext.extend(Ext.Panel, {
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
    mostrar: 1,
    initComponent: function () {
        //Inicializando el modelo.
        this.modelo = new Pvd_Nomina_Configuracion_OrdenCamposNomina_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Configuracion_OrdenCamposNomina_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Configuracion_OrdenCamposNomina_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelConfigCamposNomina];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Configuracion.OrdenCamposNomina.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                this.modelo.storeOrdenCamposNomina.load({params: {limit: 1000, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {

        },
    },
});

var Pvd_Nomina_Configuracion_OrdenCamposNomina_Modelo = function () {
    this.init = function () {
        this.storeTipoNomina = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerTiposNominas',
            sortInfo: {field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtiponomina"},
                [
                    {name: 'idtiponomina'},
                    {name: 'denominacion'},
                    {name: 'acumulavacaciones'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'descripcion'},
                    {name: 'orden'}
                ])
        });

        this.storeOrdenCamposNomina = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerCamposEstructuraNomina',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idestructuramodelodomina"},
                [
                    {name: 'idestructuramodelodomina'},
                    {name: 'idtiponomina'},
                    {name: 'denominacion'},
                    {name: 'ordenreporte'},
                    {name: 'sc_4_06'}
                ])
        });
    }
};

var Pvd_Nomina_Configuracion_OrdenCamposNomina_Vista = function () {
    this.init = function (perfil, idioma, modelo) {
        var self = this;

        function centrarVal(val) {
            return "<center>" + val + "</center>";
        }

        function imagenActivo(val) {
            if (val == 1)
                return '<center><img src="/pvd/nomina/views/images/si.gif" height=16 width=16 title="Si"/></center>';
            else
                return '<center><img src="/pvd/nomina/views/images/no.gif" height=16 width=16 title="No"/></center>';

        };
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar'
        });
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.pEstEntidades],
            buttons: [this.btnAceptarEntidades],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEntidades.handler();
                    }
                }
            ]
        });

        //Botones
        this.btnSubirOrden = new Ext.Button({
            id: 'btnSubirOrden',
            text: idioma.lbBtnSubirOrdenCamposNomina,
            tooltip: idioma.textToolTipSubirOrdenCamposNomina,
            iconCls: 'subir'
        });
        this.btnBajarOrden = new Ext.Button({
            id: 'btnBajarOrden',
            text: idioma.lbBtnBajarOrdenCamposNomina,
            tooltip: idioma.textToolTipBajarOrdenCamposNomina,
            iconCls: 'bajar'
        });
        this.btnGuardarOrden = new Ext.Button({
            id: 'btnGuardarOrden',
            iconCls: 'guardar',
            disabled: true,
            text: idioma.lbBtnGuardarOrdenCamposNomina,
            tooltip: idioma.textToolTipGuardarOrdenCamposNomina
        });
        this.btnVistaPrevia = new Ext.Button({
            id: 'btnVistaPrevia',
            text: idioma.lbBtnVistaPreviaNomina,
            tooltip: idioma.textToolTipVistaPreviaNomina,
            iconCls: 'vistaprevia'
        });
        this.btnAyudaCamposNomina = new Ext.Button({
            id: 'btnAyudaCamposNomina',
            text: idioma.lbBtnAyudaOrdenCamposNomina,
            tooltip: idioma.textToolTipAyudaOrdenCamposNomina,
            iconCls: 'ayuda'
        });
        this.btnDenominacionEntidad = new Ext.Button({
            id: 'btnDenominacionEntidad',
            text: 'Entidad: ',
            handleMouseEvents: false

        });

        //Grids
        this.smTipoNominaCamposNomina = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });
        this.gpTipoNominaCamposNomina = new Ext.grid.GridPanel({
            id: 'gpTipoNominaCamposNomina',
            title: idioma.lbTitleTiposNominas,
            region: 'center',
            columns: [
                {header: 'idtiponomina', hidden: true, hideable: false, dataIndex: 'idtiponomina'},
                {header: 'Denominaci&oacute;n', width: 420, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            height: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeTipoNomina,
            sm: this.smTipoNominaCamposNomina,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        //Number field para especificar el orden reporte de un campo
        this.nfOrdenReporte = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false,
            maxValue: 999999,
            minValue: 1,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.',
            listeners: {
                click: function (f, e) {

                }.createDelegate(this)
            }
        });
        this.smOrdenCamposNomina = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });
        this.gpOrdenCamposNomina = new Ext.grid.EditorGridPanel({
            id: 'gpOrdenCamposNomina',
            title: idioma.lbTitleOrdenCamposNomina,
            region: 'center',
            columns: [
                {
                    header: 'idestructuramodelodomina',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idestructuramodelodomina'
                },
                {header: 'idtiponomina', hidden: true, hideable: false, dataIndex: 'idtiponomina'},
                {
                    header: '<center>' + idioma.lbColDenominacionCamposNomina + '</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominacion',
                },
                {
                    header: '<center>' + idioma.lbColOrdenCamposNomina + '</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'ordenreporte',
                    renderer: centrarVal,
                    editor: this.nfOrdenReporte
                },
                {
                    header: '<center>' + idioma.lbColVisibleCamposNomina + '</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'sc_4_06',
                    renderer: imagenActivo
                }
            ],
            clicksToEdit: 1,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            height: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeOrdenCamposNomina,
            sm: this.smOrdenCamposNomina,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeOrdenCamposNomina,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            listeners: {
                afteredit: function (obj) {
                    self.btnGuardarOrden.enable();
                }
            },
            keys: [
                {
                    key: 's',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnSubirOrden.disabled)
                            self.btnSubirOrden.handler();
                    }
                }, {
                    key: 'b',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnBajarOrden.disabled)
                            self.btnBajarOrden.handler();
                    }
                }, {
                    key: 'g',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnGuardarOrden.disabled)
                            self.btnGuardarOrden.handler();
                    }
                }, {
                    key: 'e',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnVistaPrevia.disabled)
                            self.btnVistaPrevia.handler();
                    }
                },
            ]
        });

        //Paneles
        this.panelIzquierdoTiposNominas = new Ext.Panel({
            id: 'idpanelIzquierdoTiposNominas',
            region: 'west',
            width: '30%',
            height: '100%',
            border: true,
            layout: 'fit',
            split: true,
            items: [this.gpTipoNominaCamposNomina]
        });

        this.panelCentralCamposNomina = new Ext.Panel({
            id: 'idpanelCentralCamposNomina',
            region: 'center',
            width: '70%',
            height: '100%',
            border: true,
            layout: 'fit',
            split: true,
            tbar: [this.btnSubirOrden, this.btnBajarOrden, this.btnGuardarOrden, '->', this.btnVistaPrevia],
            items: [this.gpOrdenCamposNomina]
        });

        this.panelConfigCamposNomina = new Ext.Panel({
            id: 'idpanelConfigCamposNomina',
            region: 'center',
            width: '100%',
            heigth: '100%',
            border: true,
            modal: true,
            layout: 'border',
            split: true,
            tbar: [this.btnDenominacionEntidad, '->', this.btnAyudaCamposNomina],
            items: [this.panelIzquierdoTiposNominas, this.panelCentralCamposNomina]
        });
    }
};

var Pvd_Nomina_Configuracion_OrdenCamposNomina_Controlador = function () {
    this.init = function (idioma, vista, modelo) {
        var variables = {
            identidad: -1,
            idtiponomina: -1
        };

        //Mostrar interfaz para selecionar entidad.
        vista.winEstEntidades.show();
        vista.pEstEntidades.on('estructuraselecionada', function (o, nodo) {
            if (nodo.attributes.tipoestructura == 3 || nodo.attributes.tipoestructura == 5) {
                variables.identidad = nodo.id;
                vista.btnAceptarEntidades.enable();

                //Pintando el nombre de la entidad en el tbar del panel general
                var r = (nodo.text).split("-");
                var entidad = (r.length == 2) ? r[1] : nodo.text;
                vista.btnDenominacionEntidad.setText('Entidad: <b style="color: #006600;">' + entidad + '</b>');
            } else {
                variables.identidad = null;
                vista.btnAceptarEntidades.disable();
            }
        });

        modelo.storeOrdenCamposNomina.on('beforeload', function(){
            modelo.storeOrdenCamposNomina.baseParams.identidad = variables.identidad;
            modelo.storeOrdenCamposNomina.baseParams.idtiponomina = variables.idtiponomina;
        });

        vista.btnAceptarEntidades.setHandler(function () {
            vista.panelConfigCamposNomina.show();
            vista.winEstEntidades.hide();
            modelo.storeTipoNomina.load({params: {identidad: variables.identidad}});
        });

        //Acciones de los elementos del Panel
        vista.smTipoNominaCamposNomina.on('rowselect', function () {
            variables.idtiponomina = vista.gpTipoNominaCamposNomina.getSelectionModel().getSelected().get('idtiponomina');
            modelo.storeOrdenCamposNomina.load({
                params: {
                    identidad: variables.identidad,
                    idtiponomina: variables.idtiponomina,
                    start: 0,
                    limit: 1000
                }
            });
        });
        vista.smOrdenCamposNomina.on('rowselect', function () {
            var cantseleccionados = vista.smOrdenCamposNomina.getSelections().length;
            if (cantseleccionados == 1) {
                vista.btnSubirOrden.enable();
                vista.btnBajarOrden.enable();
            } else {
                vista.btnSubirOrden.disable();
                vista.btnBajarOrden.disable();
            }
        });
        vista.smOrdenCamposNomina.on('rowdeselect', function () {
            var cantseleccionados = vista.smOrdenCamposNomina.getSelections().length;
            if (cantseleccionados == 1) {
                vista.btnSubirOrden.enable();
                vista.btnBajarOrden.enable();
            } else {
                vista.btnSubirOrden.disable();
                vista.btnBajarOrden.disable();
            }
        });
        modelo.storeOrdenCamposNomina.on('beforeload', function (store) {
            vista.btnSubirOrden.disable();
            vista.btnBajarOrden.disable();
            store.removeAll();
        });

        //Botones
        vista.btnSubirOrden.setHandler(function () {
            vista.btnGuardarOrden.enable();
            var indexOriginal = vista.smOrdenCamposNomina.last;
            var indexPrevio = vista.smOrdenCamposNomina.last - 1;
            if (vista.smOrdenCamposNomina.hasPrevious()) {
                vista.btnBajarOrden.enable();
                /*indexOriginal = vista.smOrdenCamposNomina.last;
                indexPrevio = vista.smOrdenCamposNomina.last - 1;*/
                invertirOrden(vista.gpOrdenCamposNomina.getStore(), indexPrevio, indexOriginal);
                vista.smOrdenCamposNomina.selectRow(indexPrevio);
            } else {
                vista.btnSubirOrden.disable();
            }
        }.createDelegate(this));

        vista.btnBajarOrden.setHandler(function () {
            vista.btnGuardarOrden.enable();
            var indexOriginal = vista.smOrdenCamposNomina.last;
            var indexPrevio = vista.smOrdenCamposNomina.last + 1;
            if (vista.smOrdenCamposNomina.hasNext()) {
                vista.btnSubirOrden.enable();
                /*indexOriginal = vista.smOrdenCamposNomina.last;
                indexPrevio = vista.smOrdenCamposNomina.last + 1;*/
                invertirOrden(vista.gpOrdenCamposNomina.getStore(), indexPrevio, indexOriginal);
                vista.smOrdenCamposNomina.selectRow(indexPrevio);
            } else {
                vista.btnBajarOrden.disable();
            }

        }.createDelegate(this));

        vista.btnGuardarOrden.setHandler(function () {
            mostrarMensaje(2, "¿Est&aacute; seguro que desea guardar los cambios realizados?", function (boton) {
                if (boton == "ok") {
                    fnModificarOrdenReporteCampoNomina();
                }
            });
        }.createDelegate(this));

        vista.btnVistaPrevia.setHandler(function () {
            fnExportarVistaPreviaNomina();
        });

        //Funciones
        function fnModificarOrdenReporteCampoNomina() {
            var filasModificadas = dameIdOrden(vista.gpOrdenCamposNomina.getStore().modified);
            PVD.mostrarMascara('idMasGuardarOrden', 'Por favor espere...', 'Modificando el orden de los campos, del reporte de n&oacute;mina');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/confgeneral/modificarOrdenReporteCampoNomina',
                params: {
                    filasModificadas: Ext.encode(filasModificadas)
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idMasGuardarOrden');
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, 'El orden de los campos del reporte de n&oacute;mina, ha sido modificado satisfactoriamente.');
                        modelo.storeOrdenCamposNomina.load({
                            params: {
                                identidad: variables.identidad,
                                idtiponomina: variables.idtiponomina,
                                start: 0,
                                limit: 1000
                            }
                        });

                    } else {
                        mostrarMensaje(3, 'Ocurrió un error al modificar el orden de los campos de n&oacute;minas.');
                    }
                }
            });
        }

        function dameIdOrden(array) {
            var miArray = new Array();
            for (var i = 0; i < array.length; i++) {
                miobjeto = {
                    idestructuramodelodomina: array[i].data.idestructuramodelodomina,
                    ordenreporte: array[i].data.ordenreporte
                }
                miArray.push(miobjeto);
            }
            return miArray;
        }

        function invertirOrden(storeOriginal, indexPrevio, indexOriginal) {
            var filaOriginal = storeOriginal.getAt(indexOriginal);
            var filaPrevia = storeOriginal.getAt(indexPrevio);
            var ordenOriginal = filaOriginal.data.ordenreporte;
            var ordenPrevio = filaPrevia.data.ordenreporte;

            storeOriginal.remove(filaOriginal);
            storeOriginal.insert(indexPrevio, filaOriginal);

            storeOriginal.getAt(indexOriginal).set('ordenreporte', ordenOriginal);
            storeOriginal.getAt(indexPrevio).set('ordenreporte', ordenPrevio);
            return storeOriginal;
        }

        function fnExportarVistaPreviaNomina() {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host +
                '/pvd/nomina/index.php/confgeneral/exportarVistaPreviaNomina' +
                '?identidad=' + variables.identidad + '&idtiponomina=' + variables.idtiponomina;
            iframe.style.display = 'none';
            //var that = this;
            iframe.onload = function () {
                winload.hideMask();
                //that.destroy();
            }
            document.body.appendChild(iframe);
        }
    }
};

variablesGlobales.confordencamposnomina_js = 1;
