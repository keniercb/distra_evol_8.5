Ext.ns('Pvd.Nomina.Configuracion.CamposReporteCorreo');

Pvd.Nomina.Configuracion.CamposReporteCorreo.Panel = Ext.extend(Ext.Panel, {
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
        this.modelo = new Pvd_Nomina_Configuracion_CamposReporteCorreo_Modelo();
        this.modelo.init();

        //Inicializando la vista.
        this.vista = new Pvd_Nomina_Configuracion_CamposReporteCorreo_Vista();
        this.vista.init(this.perfil, this.idioma, this.modelo);

        //Inicializar controlador.
        this.controlador = new Pvd_Nomina_Configuracion_CamposReporteCorreo_Controlador();
        this.controlador.init(this.idioma, this.vista, this.modelo);

        this.items = [this.vista.panelCentralCamposReporteCorreo];

        //Teclas calientes de la interfaz
        this.keyMap = this.controlador.keyMap;

        Pvd.Nomina.Configuracion.CamposReporteCorreo.Panel.superclass.initComponent.call(this);
    },
    listeners: {
        afterlayout: function (x) {
            if (this.mostrar == 1) {
                //this.modelo.storeCamposReporteCorreo.load({params: {limit: 20, start: 0}});
                this.mostrar = 2;
            }
        },
        destroy: function (x) {

        }
    }
});

var Pvd_Nomina_Configuracion_CamposReporteCorreo_Modelo = function () {
    this.init = function () {
        this.storeCamposReporteCorreo = new Ext.data.Store({
            url: '/pvd/nomina/index.php/confgeneral/obtenerCamposReporteCorreo',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", /*autoLoad: true,*/ root: "datos", id: "idcamporeportecorreo"},
                [
                    {name: 'idcamporeportecorreo'},
                    {name: 'denominacion'},
                    {name: 'idformula'},
                    {name: 'denomformula'},
                    {name: 'orden'},
                    {name: 'identidad'},
                    {name: 'descripcion'},
                    {name: 'mostrarvacaciones', type: 'float'},
                    {name: 'mostrarsnc', type: 'float'},
                    {name: 'estotal', type: 'float'}
                ])
        });
    }
};

var Pvd_Nomina_Configuracion_CamposReporteCorreo_Vista = function () {
    this.init = function (perfil, idioma, modelo) {
        var self = this;

        function centrarCampos(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        function centrarFormulas(val) {
            var arrayindicadoresformula = val.split(';');
            var cadenafinal = "";
            var cont = 0;
            Ext.each(arrayindicadoresformula, function (value) {
                cont++;
                cadenafinal += (cont % 1 == 0) ? value + "</br>" : ((cont == arrayindicadoresformula.length) ? value : value + " <b>;</b> ");
            });
            return "<center>" + cadenafinal + "</center>";
        }

        function imagenActivo(val) {
            if (val == 0) {
                return '<center><img src="/pvd/nomina/views/images/no.gif" height=16 width=16 title="No"/></center>';
            } else {
                return '<center><img src="/pvd/nomina/views/images/si.gif" height=16 width=16 title="Si"/></center>';
            }
        };

        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar'
        });

        //Vista para el componente Buscar estructura
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

        //****Replicar campos correo
        this.btnAceptarReplicarCorreo = new Ext.Button({
            id: 'btnAceptarEntidadreplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });
        this.pobjestructurareplicarcorreo = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            padre: 'ESTRUCTURACOMPLETA',
            nivel: 5,
            nivelachequear: [3,5]

        });
        this.winEstructurasReplicarCorreo = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructurareplicarcorreo],
            buttons: [this.btnAceptarReplicarCorreo]
        });

        //Botones
        this.btnAdicionarCamposReporteCorreo = new Ext.Button({
            id: 'btnAdicionarCamposReporteCorreo',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddCampo,
            iconCls: 'adicionar',
        });
        this.btnModificarCamposReporteCorreo = new Ext.Button({
            id: 'btnModificarCamposReporteCorreo',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModCampo,
            iconCls: 'modificar'
        });
        this.btnEliminarCamposReporteCorreo = new Ext.Button({
            id: 'btnEliminarCamposReporteCorreo',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimCampo,
            iconCls: 'eliminar'
        });
        this.btnAyudaCamposReporteCorreo = new Ext.Button({
            id: 'btnAyudaCamposReporteCorreo',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.lbBtnAyuda,
            iconCls: 'ayuda',
        });
        this.btnDenominacionEntidad = new Ext.Button({
            id: 'btnDenominacionEntidad',
            text: 'Entidad: ',
            handleMouseEvents: false

        });
        this.btnReplicarCamposReporteCorreo = new Ext.Button({
            id: 'btnReplicarCamposReporteCorreo',
            text: 'Replicar',
            tooltip: '<u>R</u>>eplicar',
            disabled: true,
            iconCls: 'adicionar',
            handler: function () {
            }.createDelegate(this)
        });

        //Grid
        this.smCamposReporteCorreo = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });
        this.expanderCamposReporteCorreo = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style=""><p>&nbsp;&nbsp;<strong>Descripci&oacute;n:</strong>&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });
        this.gpCamposReporteCorreo = new Ext.grid.GridPanel({
            id: 'gpCamposReporteCorreo',
            title: 'Listado de agrupadores reporte correo',
            region: 'center',
            columns: [
                this.smCamposReporteCorreo,
                this.expanderCamposReporteCorreo,
                {header: 'idcamporeportecorreo', hidden: true,hideable: false,  dataIndex: 'idcamporeportecorreo'},
                {header: 'identidad', hidden: true, hideable: false, dataIndex: 'idcamporeportecorreoentidad'},
                {header: 'idformula', hidden: true, hideable: false, dataIndex: 'idformula'},
                {
                    header: /*'<center>' + */idioma.lbColDenominacion/* + '</center>'*/,
                    width: 40,
                    sortable: true,
                    dataIndex: 'denominacion'
                },
                {
                    header: '<center>' + idioma.lbColOrden + '</center>',
                    width: 20,
                    sortable: true,
                    dataIndex: 'orden',
                    renderer: centrarCampos
                },
                {
                    header: '<center>' + idioma.lbColFormula + '</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'denomformula',
                    renderer: centrarFormulas
                },
                {
                    header: '<center>' + idioma.lbColVacaciones + '</center>',
                    width: 40,
                    sortable: true,
                    dataIndex: 'mostrarvacaciones',
                    renderer: imagenActivo
                },
                {
                    header: '<center>' + idioma.lbColSNC + '</center>',
                    width: 40,
                    sortable: true,
                    dataIndex: 'mostrarsnc',
                    renderer: imagenActivo
                },
                {
                    header: '<center>' + idioma.lbColEsTotal + '</center>',
                    width: 40,
                    sortable: true,
                    dataIndex: 'estotal',
                    renderer: imagenActivo
                }
            ],
            clicksToEdit: 1,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeCamposReporteCorreo,
            sm: this.smCamposReporteCorreo,
            plugins: this.expanderCamposReporteCorreo,
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.storeCamposReporteCorreo,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarCamposReporteCorreo.disabled) {
                            self.btnEliminarCamposReporteCorreo.handler();
                        }
                    }
                },{
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarCamposReporteCorreo.disabled) {
                            self.btnAdicionarCamposReporteCorreo.handler();
                        }
                    }
                },{
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarCamposReporteCorreo.disabled) {
                            self.btnModificarCamposReporteCorreo.handler();
                        }
                    }
                },{
                    key: 'r',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnReplicarCamposReporteCorreo.disabled) {
                            self.btnReplicarCamposReporteCorreo.handler();
                        }
                    }
                }
            ]
        });

        //Panel
        this.panelCentralCamposReporteCorreo = new Ext.Panel({
            id: 'idpanelCentralCamposReporteCorreo',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [this.btnDenominacionEntidad, '', '|', '', this.btnAdicionarCamposReporteCorreo, this.btnModificarCamposReporteCorreo, this.btnEliminarCamposReporteCorreo, '', '|', '', this.btnReplicarCamposReporteCorreo, '->', this.btnAyudaCamposReporteCorreo],
            items: [this.gpCamposReporteCorreo]
        });

        //Campos
        this.tfDenominacionCorreo = new Ext.form.TextField({
            id: 'idtfDenominacionCorreo',
            fieldLabel: idioma.lbColDenominacion,
            name: 'denomcampo',
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 100,
            anchor: '99%'
        });
        this.nfOrdenCampoCorreo = new Ext.form.NumberField({
            id: 'idnfOrdenCampoCorreo',
            fieldLabel: idioma.lbColOrden,
            name: 'orden',
            allowBlank: false,
            blankText: idioma.lbErrorCampoVacio,
            anchor: '99%'
        });
        this.taFormulaCampos = new Ext.form.TextArea({
            id: 'idtaFormulaCampos',
            fieldLabel: 'Campos correo',
            name: 'denomformula',
            allowBlank: true,
            mode: 'local',
            emptyText: 'Seleccione...',
            anchor: '99%',
            height: 50
        });
        this.cbSubmayorVacacionesCorreo = new Ext.form.Checkbox({
            id: 'idcbSubmayorVacacionesCorreo',
            fieldLabel: 'Mostrar vacaciones',
            bottonAlign: 'center',
            //name: 'mostrarvacaciones',
            anchor: '99%',
            checked: false
        });
        this.cbSNCCorreo = new Ext.form.Checkbox({
            id: 'idcbSNCCorreo',
            fieldLabel: 'Mostrar SNC',
            bottonAlign: 'center',
            name: 'mostrarsnc',
            anchor: '99%',
            checked: false
        });
        this.cbEsTotalCorreo = new Ext.form.Checkbox({
            id: 'cbEsTotalCorreo',
            fieldLabel: 'Campo total',
            bottonAlign: 'center',
            name: 'estotal',
            anchor: '99%',
            checked: false
        });
        this.tfDescripcionCampoCorreo = new Ext.form.TextArea({
            id: 'tfDescripcionCampoCorreo',
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            maxLengthText: idioma.lbMaxText_255,
            blankText: idioma.lbErrorCampoVacio,
            anchor: '99%',
            height: 50
        });
        //Formularios
        this.formCamposReporteCorreo = new Ext.FormPanel({
            id: 'idformCamposReporteCorreo',
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 0px 10px 10px'
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .67, layout: 'form', items: [this.tfDenominacionCorreo]},
                        {columnWidth: .33, layout: 'form', items: [this.nfOrdenCampoCorreo]},
                        {columnWidth: .33, layout: 'form', items: [this.cbSubmayorVacacionesCorreo]},
                        {columnWidth: .33, layout: 'form', items: [this.cbSNCCorreo]},
                        {columnWidth: .33, layout: 'form', items: [this.cbEsTotalCorreo]},
                        {columnWidth: 1, layout: 'form', items: [this.taFormulaCampos]},
                        {columnWidth: 1, layout: 'form', items: [this.tfDescripcionCampoCorreo]}
                    ]
                }
            ]
        });

        //Botones
        this.btnAplicarCamposReporteCorreo = new Ext.Button({
            id: 'idbtnAplicarCamposReporteCorreo',
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar
        });
        this.btnAceptarCamposReporteCorreo = new Ext.Button({
            id: 'idbtnAceptarCamposReporteCorreo',
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar
        });
        this.btnCancelarCamposReporteCorreo = new Ext.Button({
            id: 'idbtnCancelarCamposReporteCorreo',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });

        //Ventana
        this.winCamposReporteCorreo = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            resizable: false,
            width: 400,
            layout: 'fit',
            items: [this.formCamposReporteCorreo],
            buttons: [this.btnCancelarCamposReporteCorreo, this.btnAplicarCamposReporteCorreo, this.btnAceptarCamposReporteCorreo]
        });
    }
};

var Pvd_Nomina_Configuracion_CamposReporteCorreo_Controlador = function () {
    this.init = function (idioma, vista, modelo) {
        var variables = {
            identidad: -1,
            accion: 'Add',
            cambio: 0,
            idformula: -1,
            arrayindicadores: new Array(),
            nodosseleccionados: new Array(),
            orden: -1,
            flagactiveformula: 0
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
        vista.btnAceptarEntidades.setHandler(function () {
            vista.panelCentralCamposReporteCorreo.show();
            vista.winEstEntidades.hide();
            //Cargando los pagos por resultados
            modelo.storeCamposReporteCorreo.load({params: {identidad: variables.identidad}});
        });

        //Replicar
        vista.pobjestructurareplicarcorreo.on('uncheckednode', function (sm, nodo) {
            if (nodo.attributes.id != variables.identidad) {
                var index = variables.nodosseleccionados.indexOf(nodo.attributes.id);
                if (index > -1) {
                    variables.nodosseleccionados.splice(index, 1);
                }
            }
        });
        vista.pobjestructurareplicarcorreo.on('checkednode', function (sm, nodo) {
            if (nodo.attributes.id != variables.identidad) {
                variables.nodosseleccionados.push(nodo.attributes.id);
            }
        });
        vista.btnAceptarReplicarCorreo.on('click', function () {
            replicarCamposReporteCorreo();
        });

        //Grid
        vista.smCamposReporteCorreo.on('rowselect', function (sel) {
            var cantseleccionados = vista.smCamposReporteCorreo.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarCamposReporteCorreo.enable() : vista.btnModificarCamposReporteCorreo.disable();
            (cantseleccionados > 0) ? vista.btnEliminarCamposReporteCorreo.enable() : vista.btnEliminarCamposReporteCorreo.disable();
            (cantseleccionados > 0) ? vista.btnReplicarCamposReporteCorreo.enable() : vista.btnReplicarCamposReporteCorreo.disable();

            if (variables.accion == 'Mod' && cantseleccionados == 1) {
                variables.orden = sel.getSelected().get('orden');
            }
        });
        vista.smCamposReporteCorreo.on('rowdeselect', function (sel) {
            var cantseleccionados = vista.smCamposReporteCorreo.getSelections().length;
            (cantseleccionados == 1) ? vista.btnModificarCamposReporteCorreo.enable() : vista.btnModificarCamposReporteCorreo.disable();
            (cantseleccionados > 0) ? vista.btnEliminarCamposReporteCorreo.enable() : vista.btnEliminarCamposReporteCorreo.disable();
            (cantseleccionados > 0) ? vista.btnReplicarCamposReporteCorreo.enable() : vista.btnReplicarCamposReporteCorreo.disable();
            if (variables.accion == 'Mod' && cantseleccionados == 1) {
                variables.orden = sel.getSelected().get('orden');
            }
        });
        modelo.storeCamposReporteCorreo.on('beforeload', function (store) {
            vista.btnModificarCamposReporteCorreo.disable();
            vista.btnEliminarCamposReporteCorreo.disable();
            vista.btnReplicarCamposReporteCorreo.disable();
            store.removeAll();
        });

        //Botones
        vista.btnAplicarCamposReporteCorreo.setHandler(function () {
            salvarformCamposReporteCorreo();
        });
        vista.btnAceptarCamposReporteCorreo.setHandler(function () {
            salvarformCamposReporteCorreo();
            vista.winCamposReporteCorreo.hide();
        });
        vista.btnCancelarCamposReporteCorreo.setHandler(function () {
            vista.winCamposReporteCorreo.hide();
        });
        vista.btnAdicionarCamposReporteCorreo.setHandler(function () {
            variables.tipoadd = 0;
            mostrarVentanaAdicionarCamposReporteCorreo(0);
        });

        vista.btnModificarCamposReporteCorreo.setHandler(function () {
            mostrarVentanaModificarCamposReporteCorreo();
        });
        vista.btnEliminarCamposReporteCorreo.setHandler(function () {
            eliminarCamposReporteCorreo();
        });
        vista.btnReplicarCamposReporteCorreo.setHandler(function () {
            vista.winEstructurasReplicarCorreo.show();
        });

        //Eventos
        vista.taFormulaCampos.on('focus', function () {
            variables.idformula = (variables.accion == "Mod")
                ? vista.gpCamposReporteCorreo.getSelectionModel().getSelected().data.idformula : -1;
            //Cargando los indicadores
            Ext.Ajax.request({
                url: 'obtenerIndicadoresFormulasCamposCorreo',
                method: 'POST',
                params: {
                    identidad: variables.identidad
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    variables.arrayindicadores = responseData.indicadores;
                    mostrarComponenteFormulaCampos();
                }.createDelegate()
            });
        });
        vista.cbSubmayorVacacionesCorreo.on('check', function (checkbox, ischeked) {
            if (ischeked || vista.cbSNCCorreo.checked) {
                vista.taFormulaCampos.disable();
                vista.taFormulaCampos.setValue('');
                variables.idformula = -1;
            } else {
                vista.taFormulaCampos.enable();
                if (variables.accion == 'Mod') {
                    var arrdatos = vista.smCamposReporteCorreo.getSelected().data;
                    vista.taFormulaCampos.setValue(arrdatos['denomformula']);
                }
            }
        });
        vista.cbSNCCorreo.on('check', function (checkbox, ischeked) {
            if (ischeked || vista.cbSubmayorVacacionesCorreo.checked) {
                vista.taFormulaCampos.disable();
                vista.taFormulaCampos.setValue('');
                variables.idformula = -1;
            } else {
                vista.taFormulaCampos.enable();
                if (variables.accion == 'Mod') {
                    var arrdatos = vista.smCamposReporteCorreo.getSelected().data;
                    vista.taFormulaCampos.setValue(arrdatos['denomformula']);
                }
            }
        });
        //Ventanas
        vista.winCamposReporteCorreo.on('beforeshow', function () {
            vista.formCamposReporteCorreo.getForm().reset();
            vista.tfDenominacionCorreo.focus(true, 500);
        });

        function mostrarComponenteFormulaCampos() {
            var ind = new Array();
            var a = new Array();
            for (var i = 0; i < variables.arrayindicadores.length; i++) {
                a = new Array();
                if (parseInt(variables.arrayindicadores[i].aplicarorden == 1)) {
                    if (parseInt(variables.arrayindicadores[i].orden) < parseInt(variables.orden)) {
                        a[0] = variables.arrayindicadores[i].idindicador;
                        a[1] = variables.arrayindicadores[i].indicador;
                        a[2] = variables.arrayindicadores[i].tipo;
                        ind.push(a);
                    }
                } else {
                    a[0] = variables.arrayindicadores[i].idindicador;
                    a[1] = variables.arrayindicadores[i].indicador;
                    a[2] = variables.arrayindicadores[i].tipo;
                    ind.push(a);
                }
            }
            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (variables.idformula != null) ? variables.idformula : -1,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: true,
                mostrarDenominacion: false
            });

            this.objExpMat.on('expresionsalvada', function (arr) {
                if (arr) {
                    vista.taFormulaCampos.setValue(arr['elementosMostrar']);
                    variables.idformula = arr['idexpresionmatematica'];
                    this.objExpMat.close();
                    mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente');
                } else {
                    mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar');
                }
            }.createDelegate(this));

            this.objExpMat.show();
        }

        function mostrarVentanaAdicionarCamposReporteCorreo() {
            variables.accion = 'Add';
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/confgeneral/obtenerOrdenDisponibleCorreo',
                method: 'POST',
                params: {identidad: variables.identidad},
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    vista.winCamposReporteCorreo.setTitle('Adicionar campos reporte correo');
                    vista.winCamposReporteCorreo.show();
                    vista.nfOrdenCampoCorreo.setValue(responseData.orden);
                    vista.tfDenominacionCorreo.focus(true, 500);
                    vista.btnAplicarCamposReporteCorreo.show();
                }
            });
        }

        function mostrarVentanaModificarCamposReporteCorreo() {
            var arrdatos = vista.smCamposReporteCorreo.getSelected().data;
            vista.winCamposReporteCorreo.setTitle('Modificar campos reporte correo');
            vista.winCamposReporteCorreo.show();
            //vista.formCamposReporteCorreo.getForm().loadRecord(vista.gpCamposReporteCorreo.getSelectionModel().getSelected());
            vista.btnAplicarCamposReporteCorreo.hide();
            vista.tfDenominacionCorreo.setValue(arrdatos['denominacion']);
            vista.nfOrdenCampoCorreo.setValue(arrdatos['orden']);
            vista.taFormulaCampos.setValue(arrdatos['denomformula']);
            vista.tfDescripcionCampoCorreo.setValue(arrdatos['descripcion']);
            vista.cbSubmayorVacacionesCorreo.setValue(arrdatos['mostrarvacaciones']);
            vista.cbSNCCorreo.setValue(arrdatos['mostrarsnc']);
            vista.cbEsTotalCorreo.setValue(arrdatos['estotal']);
            variables.accion = 'Mod';
        }

        function salvarformCamposReporteCorreo() {
            var urlAction = '/pvd/nomina/index.php/confgeneral/adicionarCamposReporteCorreo';
            var idcamporeportecorreo = -1;
            if (variables.accion == 'Mod') {
                urlAction = '/pvd/nomina/index.php/confgeneral/modificarCamposReporteCorreo';
                idcamporeportecorreo = vista.smCamposReporteCorreo.getSelected().get('idcamporeportecorreo');
                if (variables.cambio == 0)
                    vista.winCamposReporteCorreo.hide();

                var idformulaviejo = vista.smCamposReporteCorreo.getSelected().get('idformula');
                var idformulanuevo = variables.idformula;
                variables.idformula = (idformulaviejo == -1 && idformulanuevo != -1) ? idformulanuevo : idformulaviejo;
            }
            var vacaciones = (vista.cbSubmayorVacacionesCorreo.checked == true) ? 1 : 0;
            var snc = (vista.cbSNCCorreo.checked == true) ? 1 : 0;
            var estotal = (vista.cbEsTotalCorreo.checked == true) ? 1 : 0;
            var form = vista.formCamposReporteCorreo;
            PVD.mostrarMascara('idmaskaddmodcampos', 'Espere por favor', 'Enviando datos...');
            Ext.Ajax.request({
                url: urlAction,
                method: 'POST',
                params: {
                    identidad: variables.identidad,
                    idcamporeportecorreo: idcamporeportecorreo,
                    denominacion: vista.tfDenominacionCorreo.getRawValue(),
                    orden: vista.nfOrdenCampoCorreo.getValue(),
                    mostrarvacaciones: vacaciones,
                    mostrarsnc: snc,
                    idformula: variables.idformula,
                    descripcion: vista.tfDescripcionCampoCorreo.getRawValue(),
                    estotal: estotal
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskaddmodcampos');
                    var msgok = (variables.tipoadd == 1) ? 'Los campos se han' : 'El campo se ha';
                    var msgerror = (variables.tipoadd == 1) ? 'Los campos no se pudieron' : 'El campo no se pudo';
                    switch (responseData.respuesta) {
                        case 'ADD-1':
                            mostrarMensaje(1, msgok + " adicionado satisfactoriamente.");
                            break;
                        case 'ADD-2':
                            mostrarMensaje(3, "El campo que desea adicionar ya existe.");
                            break;
                        case 'ADD-3':
                            mostrarMensaje(3, msgerror + " adicionar.");
                            break;
                        case 'MOD-1':
                            mostrarMensaje(1, "El campo se ha modificado satisfactoriamente.");
                            break;
                        case 'MOD-3':
                            mostrarMensaje(3, "El campo no se pudo modificar.");
                            break;
                    }
                    //Capturando el orden
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/confgeneral/obtenerOrdenDisponibleCorreo',
                        method: 'POST',
                        params: {identidad: variables.identidad},
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            vista.formCamposReporteCorreo.getForm().reset();
                            vista.nfOrdenCampoCorreo.setValue(responseData.orden);
                        }
                    });

                    form.getForm().reset();
                    vista.tfDenominacionCorreo.focus(true, 500);
                    modelo.storeCamposReporteCorreo.removeAll();
                    modelo.storeCamposReporteCorreo.load({params: {identidad: variables.identidad}});
                    variables.cambio = 0;
                }
            });
        }

        function eliminarCamposReporteCorreo() {
            var seleccionados = vista.gpCamposReporteCorreo.getSelectionModel().getSelections();
            var r = new Array();
            Ext.each(seleccionados, function (value) {
                    r.push(value.data.idcamporeportecorreo);
                }
            );
            var msg = (r.length > 1) ? 'los campos seleccionados?' : 'el campo seleccionado?';
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar ' + msg,
                function (btn) {
                    if (btn == 'ok') {
                        var urlAction = '/pvd/nomina/index.php/confgeneral/eliminarCamposReporteCorreo';
                        PVD.mostrarMascara('idmaskdel', 'Espere por favor', 'Enviando datos...');
                        Ext.Ajax.request({
                            url: urlAction,
                            method: 'POST',
                            params: {
                                idcamporeportecorreo: Ext.encode(r),
                                identidad: variables.identidad
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmaskdel');
                                var msgok = (r.length > 1) ? 'Los campos se han' : 'El campo se ha';
                                var msgerror = (r.length > 1) ? 'Los campos no se pudieron' : 'El campo no se pudo';
                                if (responseData == 1) {
                                    mostrarMensaje(1, msgok + " eliminado satisfactoriamente.");
                                } else {
                                    mostrarMensaje(3, msgerror + " eliminar.");
                                }

                                modelo.storeCamposReporteCorreo.load({params: {identidad: variables.identidad}});
                                variables.cambio = 0;
                            }
                        });
                    }
                });
        }

        function replicarCamposReporteCorreo() {
            var arrentidades = new Array();
            var s = vista.pobjestructurareplicarcorreo.getSeleccionados();
            if (s.length <= 0) {
                mostrarMensaje(3, 'Debe seleccionar una entidad.');
                return;
            }
            for (var i = 0; i < s.length; i++) {
                if (s[i].id != variables.identidad) {
                    arrentidades.push(s[i].id);
                }
            }
            if (variables.nodosseleccionados.length > 0) {
                var arridcamposreportecorreo = new Array();
                var datos = vista.gpCamposReporteCorreo.getSelectionModel().getSelections();
                Ext.each(datos, function (rec) {
                    arridcamposreportecorreo.push(rec.get('idcamporeportecorreo'));
                });

                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Replicando datos'
                });
                winload.showMask();
                Ext.Ajax.request({
                    url: 'replicarCamposReporteCorreo',
                    method: 'POST',
                    params: {
                        arridcamporeportecorreo: (datos.length > 0 ? Ext.encode(arridcamposreportecorreo) : null),
                        arridentidad: Ext.encode(arrentidades)
                    },
                    callback: function (options, success, response) {
                        winload.hideMask();
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.respuesta == 'REP-1') {
                            mostrarMensaje(1, 'La r&eacute;plica se efectu&oacute; satisfactoriamente.');
                        }
                        vista.winEstructurasReplicarCorreo.hide();
                    }.createDelegate(this)
                });
            } else {
                mostrarMensaje(3, 'Por favor seleccione la(s) entidad(es) a la(s) que desea replicar la configuraci&oacute;n.');
            }
        }
    }
};

variablesGlobales.confcamposreportecorreo_js = 1;
