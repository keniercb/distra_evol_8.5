Ext.ns('Pvd.Nomina.Configuracion.AsociacionCuentasContables');

Pvd.Nomina.Configuracion.AsociacionCuentasContables.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Configuracion_AsociacionCuentasContables_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Configuracion_AsociacionCuentasContables_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Configuracion_AsociacionCuentasContables_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelConfigCuentasContables];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Configuracion.AsociacionCuentasContables.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                //this.modelo.storeAsociacionCuentasContables.load({params: {limit: 20, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {

        },
    },
});

var Pvd_Nomina_Configuracion_AsociacionCuentasContables_Modelo = function () {
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

        this.storeAsociacionCuentasContables = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerAsociacionCuentasContables',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idasociacioncuentascont"},
                [
                    {name: 'idasociacioncuentascont'},
                    {name: 'identidad'},
                    {name: 'idtiponomina'},
                    {name: 'denominacion'},
                    {name: 'descripcion'}
                ])
        });

        this.storeCuentasContablesDeudoras = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerCuentasContablesDeudoras',
            sortInfo: {field: 'denominacion', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idcuentadeudora"},
                [
                    {name: 'idcuentadeudora'},
                    {name: 'idtiponomina'},
                    {name: 'denominacion'},
                    {name: 'valorcontable'},
                ])
        });

        this.storeCuentasContablesAcreedoras = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerCuentasContablesAcreedoras',
            sortInfo: {field: 'denominacion', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idcuentaacreedora"},
                [
                    {name: 'idcuentaacreedora'},
                    {name: 'idtiponomina'},
                    {name: 'denominacion'},
                    {name: 'valorcontable'},
                ])
        });
    }
};

var Pvd_Nomina_Configuracion_AsociacionCuentasContables_Vista = function () {
    this.init = function (perfil, idioma, modelo) {
        //variables y funciones
        var self = this;
        //Panel de estructura y composición por cargos hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: idioma.lbBtnAceptarCuentasContables,
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
            ],

        });

        //Botones
        this.btnDenominacionEntidad = new Ext.Button({
            id: 'btnDenominacionEntidad',
            text: 'Entidad: ',
            handleMouseEvents: false

        });
        this.btnReplicarCuentas = new Ext.Button({
            id: 'btnReplicarCuentas',
            iconCls: 'buscaryremplazar',
            text: idioma.lbBtnReplicarCuentasContables,
            tooltip: idioma.textToolTipReplicarCuentasContables,
            disabled: true
        });
        this.btnAyudaCuentas = new Ext.Button({
            id: 'btnAyudaCuentas',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.lbBtnAyuda,
            iconCls: 'ayuda',
        });
        this.btnAsociarCuenta = new Ext.Button({
            id: 'btnAsociarCuenta',
            iconCls: 'asociar',
            text: idioma.lbBtnAsociarCuentasContables,
            tooltip: idioma.textToolTipAsociarCuentasContables,
            disabled: true,
        });
        this.btnEliminarCuenta = new Ext.Button({
            id: 'btnEliminarCuenta',
            iconCls: 'eliminar',
            text: idioma.lbBtnEliminarCuentasContables,
            tooltip: idioma.textToolTipEliminarCuentasContables,
            disabled: true
        });

        //Grids
        this.smTipoNominaCuentasContables = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });//Tipos nominas
        this.gpTipoNominaCuentasContables = new Ext.grid.GridPanel({
            id: 'gpTipoNominaCuentasContables',
            title: idioma.lbTitleTiposNominasCC,
            region: 'center',
            columns: [
                this.smTipoNominaCuentasContables,
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
            sm: this.smTipoNominaCuentasContables,
            loadMask: {msg: idioma.lbMaskGridCargando},
            tbar: [this.btnReplicarCuentas]
        });
        this.expanderDescripcion = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>{descripcion}</p><br/></div>'
            ), enableCaching: false
        });
        this.smAsociacionCuentasContables = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });//Asociacion cuentas contables
        this.gpAsociacionCuentasContables = new Ext.grid.GridPanel({
            id: 'gpAsociacionCuentasContables',
            title: idioma.lbTitleAsociacionCuentasContables,
            region: 'center',
            columns: [
                this.smAsociacionCuentasContables,
                this.expanderDescripcion,
                {
                    header: 'idasociacioncuentascont',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idasociacioncuentascont'
                },
                {header: 'identidad', hidden: true, hideable: false, dataIndex: 'identidad'},
                {header: 'idcuentadeudora', hidden: true, hideable: false, dataIndex: 'idcuentadeudora'},
                {header: 'idcuentaacreedora', hidden: true, hideable: false, dataIndex: 'idcuentaacreedora'},
                {header: 'idtiponomina', hidden: true, hideable: false, dataIndex: 'idtiponomina'},
                {
                    header: '<center>Denominaci&oacute;n</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominacion',
                }
            ],
            clicksToEdit: 1,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            height: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeAsociacionCuentasContables,
            sm: this.smAsociacionCuentasContables,
            plugins: this.expanderDescripcion,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeAsociacionCuentasContables,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            tbar: [this.btnAsociarCuenta, this.btnEliminarCuenta]
        });

        //Ventana de las cuentas acreedoras
        this.btnAceptarCuenta = new Ext.Button({
            id: 'btnAceptarCuenta',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptarCuentasContables,
            tooltip: idioma.textToolTipAceptarCuentasContables,
            //disabled: true
        });
        this.btnCancelarCuenta = new Ext.Button({
            id: 'btnCancelarCuenta',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelarCuentasContables,
            tooltip: idioma.textToolTipCancelarCuentasContables
        });
        this.tfDenominacionAsociacion = new Ext.form.TextArea({
            id: 'tfDenominacionAsociacion',
            fieldLabel: idioma.lbDenominacionAsociacion,
            textLabel: idioma.lbDenominacionAsociacion,
            name: 'descripcion',
            allowBlank: false,
            hiddenname: 'descripcion',
            anchor: '99.9%',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 255,
        });
        this.formDenominacionAsc = new Ext.FormPanel({
            id: 'formDenominacionAsc',
            autoHeight: true,
            region: 'north',
            width: '99.9%',
            frame: true,
            items: [{
                layout: 'column',
                border: true,
                items: [
                    {
                        columnWidth: .99,
                        layout: 'form',
                        items: [this.tfDenominacionAsociacion]
                    }
                ]
            }]
        });

        this.smCuentasDeudoras = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });//Cuentas deudoras
        this.gpCuentasDeudoras = new Ext.grid.GridPanel({
            id: 'gpCuentasDeudoras',
            title: idioma.lbTitleCuentasDeudoras,
            region: 'west',
            columns: [
                this.smCuentasDeudoras,
                {header: 'idcuentadeudora', hidden: true, dataIndex: 'idcuentadeudora'},
                {header: 'idtiponomina', hidden: true, dataIndex: 'idtiponomina'},
                {
                    header: '<center>Denominaci&oacute;n</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominacion',
                },
                {
                    header: '<center>Valor contable</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'valorcontable',
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            width: '50%',
            height: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeCuentasContablesDeudoras,
            sm: this.smCuentasDeudoras,
            loadMask: {msg: idioma.lbMaskGridCargando},
            split: true
        });
        this.smCuentasAcreedoras = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });//Cuentas deudoras
        this.gpCuentasAcreedoras = new Ext.grid.GridPanel({
            id: 'gpCuentasAcreedoras',
            title: idioma.lbTitleCuentasAcreedoras,
            region: 'center',
            columns: [
                this.smCuentasAcreedoras,
                {header: 'idcuentaacreedora', hidden: true, dataIndex: 'idcuentaacreedora'},
                {header: 'idtiponomina', hidden: true, dataIndex: 'idtiponomina'},
                {
                    header: '<center>Denominaci&oacute;n</center>',
                    width: 100,
                    dataIndex: 'denominacion',
                    sortable: true,
                },
                {
                    header: '<center>Valor contable</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'valorcontable',
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            width: '50%',
            height: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeCuentasContablesAcreedoras,
            sm: this.smCuentasAcreedoras,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });
        this.winAsociarCuentas = new Ext.Window({
            title: 'Asociar cuentas contables',
            modal: true,
            closeAction: 'hide',
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: true,
            width: 800,
            height: 400,
            layout: 'border',
            items: [
                this.gpCuentasDeudoras,
                this.gpCuentasAcreedoras,
                this.formDenominacionAsc
            ],
            buttons: [this.btnCancelarCuenta, this.btnAceptarCuenta]
        });

        //Ventana de replicar cuentas
        this.btnAceptarReplicarCuentas = new Ext.Button({
            id: 'idBtnAceptarReplicarCuentas',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar'
        });
        this.pnReplicarCuentas = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            padre: 'ESTRUCTURACOMPLETA',
            nivel: 5,
            nivelachequear: [3, 5]
        });
        this.winReplicarCuentas = new Ext.Window({
            id: 'idWinReplicarCuentas',
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.pnReplicarCuentas],
            buttons: [this.btnAceptarReplicarCuentas]
        });

        //Paneles
        this.panelIzquierdoTiposNominas = new Ext.Panel({
            id: 'idpanelIzquierdoTiposNominas',
            region: 'west',
            width: '20%',
            height: '100%',
            border: true,
            layout: 'fit',
            split: true,
            items: [this.gpTipoNominaCuentasContables]
        });
        this.panelDerechoAsociacionCuentas = new Ext.Panel({
            id: 'panelDerechoAsociacionCuentas',
            region: 'center',
            width: '80%',
            heigth: '100%',
            border: true,
            layout: 'fit',
            split: true,
            items: [this.gpAsociacionCuentasContables]
        });
        this.panelConfigCuentasContables = new Ext.Panel({
            id: 'idpanelConfigCuentasContables',
            region: 'center',
            width: '100%',
            heigth: '100%',
            border: true,
            modal: true,
            layout: 'border',
            split: true,
            tbar: [this.btnDenominacionEntidad, '->', this.btnAyudaCuentas],
            items: [this.panelIzquierdoTiposNominas, this.panelDerechoAsociacionCuentas],
            keys: [
                {
                    key: 'r',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnReplicarCuentas.disabled)
                            self.btnReplicarCuentas.handler();
                    }
                },
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarCuenta.disabled) {
                            self.btnEliminarCuenta.handler();
                        }
                    }
                }, {
                    key: 'a',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAsociarCuenta.disabled)
                            self.btnAsociarCuenta.handler();
                    }
                }
            ]
        });
    }
};

var Pvd_Nomina_Configuracion_AsociacionCuentasContables_Controlador = function () {
    this.init = function (idioma, vista, modelo) {
        var variables = {
            identidad: -1,
            arridentidadreplicar: new Array(),
            idtiponomina: -1,
        };
        //Mostrar interfaz para seleccionar entidad.
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
        vista.btnAceptarEntidades.setHandler(function () {
            vista.panelConfigCuentasContables.show();
            vista.winEstEntidades.hide();
            modelo.storeTipoNomina.load({params: {identidad: variables.identidad}});
        });

        //Eventos Selection Models
        vista.smTipoNominaCuentasContables.on('rowselect', function (sm) {
            var cant = sm.getSelections().length;
            vista.btnReplicarCuentas.enable();
            vista.btnEliminarCuenta.disable();
            if (cant > 1) {
                vista.btnAsociarCuenta.disable();
                modelo.storeAsociacionCuentasContables.removeAll();
            } else {
                vista.btnAsociarCuenta.enable();
                variables.idtiponomina = sm.getSelected().get('idtiponomina');
                modelo.storeAsociacionCuentasContables.load({
                    params: {
                        identidad: variables.identidad,
                        idtiponomina: variables.idtiponomina
                    }
                });
            }
        });
        vista.smTipoNominaCuentasContables.on('rowdeselect', function (sm) {
            var cant = sm.getSelections().length;
            vista.btnEliminarCuenta.disable();
            if (cant > 0) {
                vista.btnReplicarCuentas.enable();
                if (cant > 1) {
                    vista.btnAsociarCuenta.disable();
                    modelo.storeAsociacionCuentasContables.removeAll();
                } else {
                    vista.btnAsociarCuenta.enable();
                    variables.idtiponomina = sm.getSelected().get('idtiponomina');
                    modelo.storeAsociacionCuentasContables.load({
                        params: {
                            identidad: variables.identidad,
                            idtiponomina: variables.idtiponomina
                        }
                    });
                }
            } else {
                modelo.storeAsociacionCuentasContables.removeAll();
                vista.btnReplicarCuentas.disable();
                vista.btnAsociarCuenta.disable();
            }
        });
        vista.smAsociacionCuentasContables.on('rowselect', function (sm) {
            var cant = sm.getSelections().length;
            (cant > 0) ? vista.btnEliminarCuenta.enable() : vista.btnEliminarCuenta.disable();
        });
        vista.smAsociacionCuentasContables.on('rowdeselect', function (sm) {
            var cant = sm.getSelections().length;
            (cant > 0) ? vista.btnEliminarCuenta.enable() : vista.btnEliminarCuenta.disable();
        });

        //Eventos Botones
        vista.btnAsociarCuenta.setHandler(function () {
            vista.winAsociarCuentas.show();
            vista.tfDenominacionAsociacion.setRawValue('');
            modelo.storeCuentasContablesDeudoras.load({
                params: {
                    identidad: variables.identidad,
                    idtiponomina: variables.idtiponomina
                }
            });

            modelo.storeCuentasContablesAcreedoras.load({
                params: {
                    identidad: variables.identidad,
                    idtiponomina: variables.idtiponomina
                }
            });
        });
        vista.btnCancelarCuenta.setHandler(function () {
            vista.winAsociarCuentas.hide();
        });
        vista.btnAceptarCuenta.setHandler(function () {
            fnAsociarCuentasAcreedoras();
        });
        vista.btnEliminarCuenta.setHandler(function () {
            fnEliminarCuentasAcreedoras();
        });

        //Replicar cuentas
        vista.btnReplicarCuentas.setHandler(function () {
            vista.winReplicarCuentas.show();
        });
        vista.pnReplicarCuentas.on('checkednode', function (sm, nodo) {
            if (nodo.id != variables.identidad)
                variables.arridentidadreplicar.push(nodo.id);

            (variables.arridentidadreplicar.length > 0) ?
                vista.btnAceptarReplicarCuentas.enable() :
                vista.btnAceptarReplicarCuentas.disable();
        });
        vista.pnReplicarCuentas.on('uncheckednode', function (sm, nodo) {
            if (nodo.id != variables.identidad) {
                var index = variables.arridentidadreplicar.indexOf(nodo.id);
                if (index > -1) {
                    variables.arridentidadreplicar.splice(index, 1);
                }
            }

            (variables.arridentidadreplicar.length > 0) ?
                vista.btnAceptarReplicarCuentas.enable() :
                vista.btnAceptarReplicarCuentas.disable();
        });
        vista.btnAceptarReplicarCuentas.on('click', function () {
            fnReplicarCuentasAsociadas();
        });

        //Funciones
        function fnAsociarCuentasAcreedoras() {
            var selcuentasdeudoras = vista.gpCuentasDeudoras.getSelectionModel().getSelections();
            var selcuentasacreedoras = vista.gpCuentasAcreedoras.getSelectionModel().getSelections();
            var arrcuentasdeudoras = new Array();
            var arrcuentasacreedoras = new Array();
            Ext.each(selcuentasdeudoras, function (cuenta) {
                arrcuentasdeudoras.push(cuenta.get('idcuentadeudora'));
            });
            Ext.each(selcuentasacreedoras, function (cuenta) {
                arrcuentasacreedoras.push(cuenta.get('idcuentaacreedora'));
            });

            if (arrcuentasdeudoras.length == 0) {
                mostrarMensaje(3, 'Debe seleccionar al menos, una cuenta deudora.');
                return;
            } else {
                if (arrcuentasacreedoras.length == 0) {
                    mostrarMensaje(3, 'Debe seleccionar al menos, una cuenta acreedora.');
                    return;
                }
            }

            PVD.mostrarMascara('idmaskaddcuentas', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgAsociarCuentasContables);
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/confgeneral/asociarCuentasAcreedoras',
                params: {
                    identidad: variables.identidad,
                    arrcuentasdeudoras: Ext.encode(arrcuentasdeudoras),
                    arrcuentasacreedoras: Ext.encode(arrcuentasacreedoras),
                    idtiponomina: variables.idtiponomina,
                    denominacion: vista.tfDenominacionAsociacion.getValue(),
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskaddcuentas');
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.respuesta == 'ok') {
                        mostrarMensaje(1, idioma.lbMsgCorrectoAsociarCuentasContablesPlural);
                        modelo.storeAsociacionCuentasContables.load({
                            params: {
                                identidad: variables.identidad,
                                idtiponomina: variables.idtiponomina
                            }
                        });

                        vista.winAsociarCuentas.hide();
                    } else {
                        mostrarMensaje(3, 'Ocurri&oacute; un error.');
                    }
                }
            });
        }

        function fnEliminarCuentasAcreedoras() {
            var selcuentas = vista.gpAsociacionCuentasContables.getSelectionModel().getSelections();
            var arrcuentas = new Array();
            Ext.each(selcuentas, function (cuenta) {
                arrcuentas.push(cuenta.get('idasociacioncuentascont'));
            });

            var msg = (arrcuentas.length > 1) ? 'las asociaciones seleccionadas?' : 'la asociaci&oacute;n seleccionada?';
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar ' + msg,
                function (btn) {
                    if (btn == 'ok') {
                        PVD.mostrarMascara('idmaskdelcuentas', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminarCuentasContables);
                        Ext.Ajax.request({
                            url: '/pvd/nomina/index.php/confgeneral/eliminarCuentasAcreedoras',
                            params: {
                                arrcuentaacreedoras: Ext.encode(arrcuentas)
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmaskdelcuentas');
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.respuesta == 'ok') {
                                    var msg = (arrcuentas.length > 1) ? idioma.lbMsgCorrectoEliminarCuentasContablesPlural :
                                        idioma.lbMsgCorrectoEliminarCuentasContables;
                                    mostrarMensaje(1, msg);
                                    modelo.storeAsociacionCuentasContables.load({
                                        params: {
                                            identidad: variables.identidad,
                                            idtiponomina: variables.idtiponomina
                                        }
                                    });

                                } else {
                                    mostrarMensaje(3, 'Ocurri&oacute; un error.');
                                }
                            }
                        });
                    }
                });
        }

        function fnReplicarCuentasAsociadas() {
            if (variables.arridentidadreplicar.length > 0) {
                var seltiponominas = vista.gpTipoNominaCuentasContables.getSelectionModel().getSelections();
                var arridtiponominareplicar = new Array();
                Ext.each(seltiponominas, function (cuenta) {
                    arridtiponominareplicar.push(cuenta.get('idtiponomina'));
                });

                PVD.mostrarMascara('idmaskreplicarcuentas', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgReplicarCuentasContables);
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/confgeneral/replicarCuentasAsociadas',
                    method: 'POST',
                    params: {
                        identidad: variables.identidad,
                        arridentidades: Ext.encode(variables.arridentidadreplicar),
                        arridtiponominas: Ext.encode(arridtiponominareplicar)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('idmaskreplicarcuentas');
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.respuesta == 'ok') {
                            mostrarMensaje(1, 'La configuraci&oacute;n, de las cuentas contables, fue replicada satisfactoriamente.');
                        }
                        vista.winReplicarCuentas.hide();
                    }.createDelegate(this)
                });
            } else {
                mostrarMensaje(3, 'Por favor seleccione la(s) entidad(es) a la(s) que desea replicar la configuraci&oacute;n.');
            }
        }
    }
};

variablesGlobales.confasociacioncuentascontables_js = 1;
