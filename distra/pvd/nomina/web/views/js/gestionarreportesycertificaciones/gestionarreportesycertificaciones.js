Ext.ns('Pvd.Nomina.ReportesyCertificaciones.GestReportesyCertificaciones');
Ext.QuickTips.init();
var variablesGlobales = {};
//Modelo de la vista del componente Nomencladores de nóminas.
Pvd.Nomina.ReportesyCertificaciones.GestReportesyCertificaciones.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function (idioma) {
        //Store para cargar los reportes y certificaciones
        this.stRepCertActual = new Ext.data.GroupingStore({
            url: 'obtenerreportesycertificacionesactual',
            groupField: 'anno',
            sortInfo: {field: 'fechainicio', direction: "DESC"},
            baseParams: {idconfreportescertificaciones: -1, identidad: -1},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idreportescertificaciones"},
                [{name: 'idreportescertificaciones'},
                    {name: 'idconfreportescertificaciones'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'estado'},
                    {name: 'identidad'},
                    {name: 'idusuario'},
                    {name: 'descripcion'},
                    {name: 'anno'}
                ])
        });

        //Store para cargar los reportes y certificaciones
        this.stRepCertHistorico = new Ext.data.GroupingStore({
            url: 'obtenerreportesycertificacioneshistorico',
            groupField: 'anno',
            sortInfo: {field: 'fechainicio', direction: "DESC"},
            baseParams: {idconfreportescertificaciones: -1, identidad: -1},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idreportecertificacion"},
                [
                    {name: 'idreportecertificacion'},
                    {name: 'idconfreportescertificaciones'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'estado'},
                    {name: 'identidad'},
                    {name: 'idusuario'},
                    {name: 'anno'}
                ])
        });

        this.stEstado = new Ext.data.SimpleStore({
            fields: [{name: 'valor'}, {name: 'denominacion'}]
        });

        this.cargarConfiguracion = function () {

            var a = new Array();
            for (var i = 0; i < this.datosModelo.estado.length; i++) {
                var t = new Array();
                t[0] = this.datosModelo.estado[i].valor;
                t[1] = this.datosModelo.estado[i].denominacion;
                a[i] = t;
            }
            this.stEstado.loadData(a);
        }

    }
};

//Vista del componente Nomencladores de nóminas.
Pvd.Nomina.ReportesyCertificaciones.GestReportesyCertificaciones.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var estado = 0;
        var self = this;
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelchequear: 3

        });

        this.btnAceptarEntidad = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            // icon: perfil.dirImg + 'aceptar.png',
            disabled: true,
            iconCls: 'aceptar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.winEstructura = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructura],
            buttons: [this.btnAceptarEntidad],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEntidad.handler();
                    }
                }
            ]
        });

        this.pTiposReportesCertificaciones = new Pvd.Nomina.TiposReportesyCertificaciones.BuscarTipoReportesyCertificaciones({
            height: 300,
            width: '35%',
            split: true,
            region: 'west',
            cantidadPorPagina: 1000
        });

        this.dfFechaInicio = new Ext.form.DateField({
            id: 'dfFechaInicio',
            fieldLabel: 'Fecha inicio',
            allowBlank: false,
            format: 'd/m/Y',
            editable: true,
            readOnly: false,
            value: new Date().format('d/m/Y'),
            blankText: 'Este campo es obligatorio.',
            invalidText: 'El formato es dd/mm/aaaa.',
            anchor: '95%'
        });

        this.dfFechaFin = new Ext.form.DateField({
            id: 'dfFechaFin',
            fieldLabel: 'Fecha fin',
            allowBlank: true,
            format: 'd/m/Y',
            editable: true,
            readOnly: false,
            blankText: 'Este campo es obligatorio.',
            invalidText: 'El formato es dd/mm/aaaa.',
            anchor: '95%'
        });

        this.tfDescripcion = new Ext.form.TextArea({
            id: 'tfDescripcion',
            fieldLabel: 'Referencia', tabIndex: 5,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion',
            maxLength: 255, //regex, regexText, maskRe
            maxLengthText: idioma.lbMaxText_255,
            anchor: '99%', prevTab: 'iddfFFinTipoN', nextTab: 'idbtnCancelarTipoN',
            blankText: idioma.lbErrorCampoVacio,
        });

        this.fpRepCert = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.dfFechaInicio]},
                    {columnWidth: .5, layout: 'form', items: [this.dfFechaFin]}
                ]
            }, this.tfDescripcion
            ]
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt+P</b>)',
            // icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            // icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar'/*,
             prevTab: 'btnAyudaFormP',
             nextTab: 'btnModFormP',*/,
            handler: function () {
            }.createDelegate(this)
        });

        this.winRepCert = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.fpRepCert],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptar.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelar.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicar.handler();
                    }
                }
            ]
        });

        this.btnAdicionar = new Ext.Button({
            id: 'btnadicionarreportecertificacion',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Ad<u>i</u>cionar reporte de antiguedad(<b>Alt+I</b>)',
            hidden: false,
            iconCls: 'adicionar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btnModificar = new Ext.Button({
            id: 'btnmodificarreportecertificacion',
            text: '<u>M</u>odificar',
            tooltip: '<u>M</u>odificar reporte de antiguedad(<b>Alt+M</b>)',
            disabled: true,
            hidden: false,
            iconCls: 'modificar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btnEliminar = new Ext.Button({
            id: 'btneliminarreportecertificacion',
            text: 'Eliminar',
            tooltip: 'Eliminar reporte de antiguedad(<b>Alt+M</b>)',
            disabled: true,
            hidden: false,
            iconCls: 'eliminar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btnElementos = new Ext.Button({
            id: 'btnelementosreportecertificacion',
            text: 'Elementos',
            tooltip: 'Elementos',
            disabled: true,
            iconCls: 'comprobante'
        });

        //Duplicar reporte
        this.btnDuplicarReporte = new Ext.Button({
            id: 'btnDuplicarReporte',
            text: 'Duplicar',
            tooltip: 'Duplicar reportes',
            disabled: true,
            iconCls: 'activarplanilla'
        });


        this.btnElementosHistorico = new Ext.Button({
            id: 'btnElementosHistorico',
            text: 'Elementos',
            tooltip: 'Elementos',
            disabled: true,
            //icon: perfil.dirImg + 'comprobante.png',
            iconCls: 'comprobante'/*,
             prevTab: 'btnModFormP',
             nextTab: 'btnAyudaFormP',*/
        });

        this.btnActivar = new Ext.Button({
            id: 'btnActivar',
            text: 'Activar',
            tooltip: 'Activar',
            disabled: true,
            //  icon: perfil.dirImg + 'actualizar.png',
            iconCls: 'Activar'/*,
             prevTab: 'btnModFormP',
             nextTab: 'btnAyudaFormP',*/
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',

        });


        this.btnConformar = new Ext.Button({
            id: 'btnconformarreportecertificacion', text: 'Conformar',
            tooltip: 'Conformar', hidden: true, iconCls: 'crearreporte'
        });
        this.btnAprobar = new Ext.Button({
            id: 'btnaprobarreportecertificacion', text: 'Aprobar', tooltip: 'Aprobar (<b>Alt+Q</b>)',
            hidden: true, iconCls: 'aprobar'
        });
        this.btnElaborar = new Ext.Button({
            id: 'btnelaborarreportecertificacion', text: 'Elaborar', tooltip: 'Elaborar',
            hidden: true, iconCls: 'aprobar'
        });
        this.btnAdicionarElemento = new Ext.Button({
            id: 'btnadicionarelementoreportecertificaciones',
            iconCls: 'adicionar', text: "Ad<u>i</u>cionar", tooltip: 'Adicionar elementos (<b>Alt+I</b>)', hidden: true
        });
        this.btnEliminarElemento = new Ext.Button({
            id: 'btneliminarelementoreportecertificaciones',
            iconCls: 'eliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar elementos (<b>DEL</b>)',
            disabled: true,
            hidden: true
        });
        this.btnGuardar = new Ext.Button({
            disabled: false, id: 'btnguardarelementosreportecertificaciones',
            iconCls: 'guardar', text: '<u>G</u>uardar', tooltip: '<u>G</u>uardar datos de la(s) personas (Alt+G)',
            hidden: true
        });

        //Grid reportes actual
        this.cmRepCert = new Ext.grid.ColumnModel([{
            id: 'idreportescertificaciones',
            header: "idreportescertificaciones",
            dataIndex: 'idreportescertificaciones',
            hidden: true,
            hideable: true
        }, {
            header: "idconfreportescertificaciones",
            dataIndex: 'idconfreportescertificaciones',
            hidden: true,
            hideable: true
        }, {
            header: "A&ntilde;o",
            dataIndex: 'anno',
            width: 100,
            hidden: true,
            hideable: true,
            renderer: function (val) {
                var anno = val.split("-");
                return '<center>' + anno[1] + '</center>';
            }.createDelegate(this)
        }, {
            header: "<center>Fecha de inicio</center>",
            dataIndex: 'fechainicio',
            width: 100,
            renderer: function (val) {
                return '<center>' + val + '</center>';
            }.createDelegate(this)
        }, {
            header: "<center>Fecha de fin</center>",
            dataIndex: 'fechafin',
            width: 100,
            renderer: function (val) {
                return '<center>' + val + '</center>';
            }.createDelegate(this)
        }, {
            header: "<center>Estado del reporte</center>",
            dataIndex: 'estado',
            width: 150,
            renderer: function (val) {
                if (val != '' || val != null || val) {
                    return '<center>' + modelo.stEstado.getAt(modelo.stEstado.find('valor', val)).get('denominacion') + '</center>';
                } else return '<center>' + val + '</center>';
            }.createDelegate(this)
        }, {
            header: "<center>Referencia</center>",
            dataIndex: 'descripcion',
            width: 200,
            renderer: function (val) {
                if (val != '' && val != null)
                    return '<center>' + val + '</center>';
            }.createDelegate(this)
        }, {
            header: "identidad",
            dataIndex: 'identidad',
            hidden: true,
            hideable: false
        }, {
            header: "idusuario",
            dataIndex: 'idusuario',
            hidden: true,
            hideable: false
        }
        ]);
        this.cmRepCert.defaultSortable = true;
        this.gpRepCert = new Ext.grid.GridPanel({
            region: 'center',
            split: true,
            store: modelo.stRepCertActual,
            autoScroll: true,
            cm: this.cmRepCert,
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            width: 600,
            height: 300,
            border: false,
            hideBorders: true,
            viewConfig: {forceFit: true},
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stRepCertActual,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
        });

        //Grid reportes historico
        this.cmRepCertHistorico = new Ext.grid.ColumnModel([{
            id: 'idreportecertificacion',
            header: "idreportecertificacion",
            dataIndex: 'idreportecertificacion',
            hidden: true,
            hideable: true
        }, {
            header: "idconfreportescertificaciones",
            dataIndex: 'idconfreportescertificaciones',
            hidden: true,
            hideable: true
        }, {
            header: "A&ntilde;o",
            dataIndex: 'anno',
            width: 100,
            hidden: true,
            hideable: true,
            renderer: function (val) {
                var anno = val.split("-");
                return '<center>' + anno[1] + '</center>';
            }.createDelegate(this)
        }, {
            header: "<center>Fecha de inicio</center>",
            dataIndex: 'fechainicio',
            width: 100,
            renderer: function (val) {
                return '<center>' + val + '</center>';
            }.createDelegate(this)
        }, {
            header: "<center>Fecha de fin</center>",
            dataIndex: 'fechafin',
            width: 100,
            renderer: function (val) {
                return '<center>' + val + '</center>';
            }.createDelegate(this)
        }, {
            header: "<center>Estado del reporte</center>",
            dataIndex: 'estado',
            width: 150,
            renderer: function (val) {
                if (val != '' || val != null || val) {
                    return '<center>' + modelo.stEstado.getAt(modelo.stEstado.find('valor', val)).get('denominacion') + '</center>';
                } else return '<center>' + val + '</center>';
            }.createDelegate(this)
        }, /* {
            header: "<center>Referencia</center>",
            dataIndex: 'descripcion',
            width: 200,
            renderer: function (val) {
                if (val != '' && val != null)
                    return '<center>' + val + '</center>';
            }.createDelegate(this)
        }, */{
            header: "identidad",
            dataIndex: 'identidad',
            hidden: true,
            hideable: false
        }, {
            header: "idusuario",
            dataIndex: 'idusuario',
            hidden: true,
            hideable: false
        }
        ]);
        this.cmRepCertHistorico.defaultSortable = true;
        this.gpRepCertHistorico = new Ext.grid.GridPanel({
            region: 'center',
            split: true,
            store: modelo.stRepCertHistorico,
            autoScroll: true,
            cm: this.cmRepCertHistorico,
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            width: 600,
            height: 300,
            border: false,
            hideBorders: true,
            viewConfig: {forceFit: true},
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stRepCertHistorico,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
        });

        //Paneles y ventanas
        this.CargarReportesCertificaciones = function (identidad, idconfreportescertificaciones) {
            var at = this.tpReportesCertificaciones.getActiveTab().id;
            if (at == 'tabActual') {
                modelo.stRepCertActual.removeAll();
                this.btnModificar.disable();
                this.btnEliminar.disable();
                this.btnElementos.disable();
                this.btnDuplicarReporte.disable();
                modelo.stRepCertActual.baseParams.identidad = identidad;
                modelo.stRepCertActual.baseParams.idconfreportescertificaciones = idconfreportescertificaciones;
                modelo.stRepCertActual.load({params: {start: 0, limit: 1000}});
            } else {
                modelo.stRepCertHistorico.removeAll();
                this.btnElementosHistorico.disable();
                this.btnActivar.disable();
                modelo.stRepCertHistorico.baseParams.identidad = identidad;
                modelo.stRepCertHistorico.baseParams.idconfreportescertificaciones = idconfreportescertificaciones;
                modelo.stRepCertHistorico.load({params: {start: 0, limit: 1000}});
            }

        };

        this.tpReportesCertificaciones = new Ext.TabPanel({
            width: 450,
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            border: false,
            hideBorders: true,
            frame: true,
            items: [
                {
                    id: 'tabActual',
                    title: 'Actual',
                    layout: 'border',
                    region: 'center',
                    items: [this.gpRepCert],
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnElementos, this.btnDuplicarReporte, '->', this.btnAyuda],
                    keys: [
                        {
                            key: Ext.EventObject.DELETE,
                            stopEvent: true,
                            fn: function () {
                                self.btnEliminar.handler();
                            }
                        }, {
                            key: 'i',
                            alt: true,
                            stopEvent: true,
                            fn: function () {
                                self.btnAdicionar.handler();
                            }
                        }, {
                            key: 'm',
                            alt: true,
                            stopEvent: true,
                            fn: function () {
                                self.btnModificar.handler();
                            }
                        }, {
                            key: 'h',
                            alt: true,
                            stopEvent: true,
                            fn: function () {
                                self.btnAyuda.handler();
                            }
                        }
                    ]

                },
                {
                    id: 'tabHistorico',
                    title: 'Hist&oacute;rico',
                    layout: 'border',
                    region: 'center',
                    items: [this.gpRepCertHistorico],
                    tbar: [this.btnElementosHistorico, this.btnActivar],
                    keys: [
                        {
                            key: 'x',
                            alt: true,
                            stopEvent: true,
                            fn: function () {
                                self.btnActivar.handler();
                            }
                        }
                    ]
                }
            ]
        });


        this.pReportesCertificaciones = new Ext.Panel({
            title: 'Reportes y certificaciones',
            region: 'center',
            height: 300,
            width: '65%',
            split: true,
            layout: 'border',
            items: [this.tpReportesCertificaciones]
        });


        this.winReportesCertificaciones = new Ext.Window({
            title: 'Gestionar reportes y certificaciones',
            modal: true,
            height: 600,
            width: 800,
            closeAction: 'hide',
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'border',
            items: [this.pTiposReportesCertificaciones, this.pReportesCertificaciones]
        });

    }
};

//Controlador de la vista del componente Nomencladores de nóminas.
Pvd.Nomina.ReportesyCertificaciones.GestReportesyCertificaciones.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Vista)
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo)
     */
    init: function (idioma, vista, modelo) {
        this.identidad = null;
        var identidadaux = 0;
        var self = this;
        var btnAprobar;
        this.accion = '';

        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            vista.btnAceptarEntidad.enable();
            this.identidad = nodo.id;
            identidadaux = nodo.id;
            //}
        }.createDelegate(this));

        vista.btnAceptarEntidad.setHandler(function () {
            vista.winReportesCertificaciones.show();
            vista.pTiposReportesCertificaciones.Cargar();
        });

        this.tiporeportescertificaciones = null;
        vista.pTiposReportesCertificaciones.on('seleccion', function (sm, fila) {
            
            this.tiporeportescertificaciones = fila;
            vista.pReportesCertificaciones.setTitle(fila.data.denominacion);
            vista.CargarReportesCertificaciones(this.identidad, fila.data.idconfreportescertificaciones);

        }.createDelegate(this));

        vista.winEstructura.show();

        vista.tpReportesCertificaciones.on('tabchange', function (tp, tab) {
            if (vista.tpReportesCertificaciones.isVisible())
                vista.CargarReportesCertificaciones(this.identidad, this.tiporeportescertificaciones.data.idconfreportescertificaciones);
        }.createDelegate(this));

        vista.btnAdicionar.setHandler(function () {
            this.accion = 'ADD';
            this.MostrarVentanaADDMODReporteCertificaciones(this.accion);

        }.createDelegate(this));

        vista.btnModificar.setHandler(function () {
            var estado = this.reportecertificacionactualseleccionado.data.estado;
            if (estado == 1) {
                //if (this.reportecertificacionactualseleccionado.data.idusuario == modelo.datosModelo.idusuario) {
                this.accion = 'MOD';
                this.MostrarVentanaADDMODReporteCertificaciones(this.accion);
                /*} else {
                 mostrarMensaje(1, 'No puede modificar el reporte.');
                 }*/
            } else {
                var msg = (estado == 2 ? 'No puede modificar el reporte, ha sido conformado.' : 'No puede modificar el reporte, ha sido aprobado.');
                mostrarMensaje(1, msg);
            }
        }.createDelegate(this));

        vista.btnEliminar.setHandler(function () {
            estado = this.reportecertificacionactualseleccionado.data.estado;
            //if(estado == 1 || ){
            // if(this.reportecertificacionactualseleccionado.data.idusuario == modelo.datosModelo.idusuario){
            mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar el reporte y certificaci&oacute;n seleccionado?', function (boton) {
                if (boton == "ok") {
                    this.accion = 'DEL';
                    this.ADDMODDELReportesCertificaciones(this.accion, 'ACEPTAR', this.obtenerDatosRepCert(this.accion));
                }
                return;
            }.createDelegate(this));
            /* }else{
             mostrarMensaje(1, 'No puede modificar el reporte.');
             }*/
            /* }else{
             var msg = (estado == 2 ? 'No puede modificar el reporte, ha sido conformado.' : 'No puede modificar el reporte, ha sido aprobado.');
             mostrarMensaje(1, msg);
             }*/
        }.createDelegate(this));

        vista.btnDuplicarReporte.on('click', function () {
            this.accion = 'DUPLICAR';
            this.MostrarVentanaADDMODReporteCertificaciones(this.accion);
        }.createDelegate(this));

        this.reportecertificacionactualseleccionado = null;
        vista.gpRepCert.getSelectionModel().on('rowselect', function (sm, ri, r) {
            this.reportecertificacionactualseleccionado = r;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.btnElementos.enable();
            vista.btnDuplicarReporte.enable();
        }.createDelegate(this));

        this.reportecertificacionhistoricoseleccionado = null;
        vista.gpRepCertHistorico.getSelectionModel().on('rowselect', function (sm, ri, r) {
            this.reportecertificacionhistoricoseleccionado = r;
            vista.btnElementosHistorico.enable();
            vista.btnActivar.enable();
        }.createDelegate(this));

        vista.btnAceptar.setHandler(function () {
            this.ADDMODDELReportesCertificaciones(this.accion, 'ACEPTAR', this.obtenerDatosRepCert(this.accion));
        }.createDelegate(this));

        vista.btnAplicar.setHandler(function () {
            this.ADDMODDELReportesCertificaciones(this.accion, 'APLICAR', this.obtenerDatosRepCert(this.accion));
        }.createDelegate(this));

        vista.btnCancelar.setHandler(function () {
            vista.winRepCert.hide();
        }.createDelegate(this));

        vista.btnElaborar.setHandler(function () {
            var idreporte = vista.winRepCert.idreportescertificaciones;
            vista.winRepCert.hide();
            modelo.stRepCertActual.load({params: {idconfreportescertificaciones: idreporte}});
            modelo.stRepCertHistorico.load({params: {idconfreportescertificaciones: idreporte}});
        }.createDelegate(this));

        this.MostrarVentanaADDMODReporteCertificaciones = function (accion) {
            var titulo = '';
            this.LimpiarFormularioRepCert();
            if (accion == 'ADD') {
                titulo = 'Adicionar reporte y certificaci&oacute;n';
                /*vista.cbEstado.setValue(1);
                 vista.cbEstado.disable();*/
                vista.btnAplicar.setVisible(true);
            } else if (accion == 'MOD') {
                titulo = 'Modificar reporte y certificaci&oacute;n';
                /*vista.cbEstado.enable();
                 vista.cbEstado.setValue(this.reportecertificacionactualseleccionado.data.estado);*/
                vista.dfFechaInicio.setValue(this.reportecertificacionactualseleccionado.data.fechainicio);
                vista.dfFechaFin.setValue(this.reportecertificacionactualseleccionado.data.fechafin);
                vista.tfDescripcion.setValue(this.reportecertificacionactualseleccionado.data.descripcion);
                vista.btnAplicar.setVisible(false);
            } else if (accion == 'DUPLICAR') {
                var titulo = "Duplicar reporte y certificaci&oacute;n";
                vista.dfFechaInicio.setValue(this.reportecertificacionactualseleccionado.data.fechainicio);
                vista.dfFechaFin.setValue(this.reportecertificacionactualseleccionado.data.fechafin);
                vista.tfDescripcion.setValue(this.reportecertificacionactualseleccionado.data.descripcion);
                vista.btnAplicar.hide();
            }
            vista.winRepCert.setTitle(titulo);
            vista.winRepCert.show();
        }.createDelegate(this);

        this.LimpiarFormularioRepCert = function () {
            vista.fpRepCert.getForm().reset();
            vista.dfFechaInicio.setValue(new Date().format('d/m/Y'));
            vista.dfFechaFin.setValue('');
            vista.tfDescripcion.setValue('');
            /*vista.cbEstado.setValue(1);
             vista.cbEstado.disable();*/
        };

        this.obtenerDatosRepCert = function (accion) {
            if (accion == 'ADD') {
                return {
                    idreportescertificaciones: null,
                    fechainicio: vista.dfFechaInicio.getValue().format('Y-m-d'),
                    fechafin: (vista.dfFechaFin.getValue() != '' ? vista.dfFechaFin.getValue().format('Y-m-d') : null),
                    estado: 1,
                    identidad: this.identidad,
                    idconfreportescertificaciones: this.tiporeportescertificaciones.data.idconfreportescertificaciones
                };
            } else if (accion == 'MOD') {
                return {
                    idreportescertificaciones: this.reportecertificacionactualseleccionado.data.idreportescertificaciones,
                    fechainicio: vista.dfFechaInicio.getRawValue(),
                    fechafin: (vista.dfFechaFin.getRawValue() != '' ? vista.dfFechaFin.getRawValue() : null),
                    estado: 1,
                    identidad: this.identidad,
                    idconfreportescertificaciones: this.tiporeportescertificaciones.data.idconfreportescertificaciones
                };
            } else if (accion == 'DEL') {
                return {
                    idreportescertificaciones: this.reportecertificacionactualseleccionado.data.idreportescertificaciones,
                };
            } else if (accion == 'DUPLICAR') {
                return {
                    idreportescertificaciones: this.reportecertificacionactualseleccionado.data.idreportescertificaciones,
                    fechainicio: vista.dfFechaInicio.getRawValue(),
                    fechafin: vista.dfFechaFin.getRawValue()
                };
            }
        }.createDelegate(this);

        this.ADDMODDELReportesCertificaciones = function (accion, boton, datos) {
            var estadodelete = 0;
            var url = '';
            switch (accion) {
                case 'ADD':
                    url = 'adicionarreportesycertificaciones';
                    break;
                case 'MOD':
                    url = 'modificarreportesycertificaciones';
                    break;
                case 'DEL':
                    estadodelete = this.reportecertificacionactualseleccionado.data.estado;
                    url = 'eliminarreportesycertificaciones';
                    break;
                case 'DUPLICAR':
                    url = 'duplicareportesycertificaciones';
                    break;
            }

            if (this.tiporeportescertificaciones) {
                if (accion != 'DEL') {
                    if (this.tiporeportescertificaciones.data.aplicaren == 1 && vista.dfFechaFin.getValue() == '') {
                        mostrarMensaje(1, 'La fecha de fin es un campo obligatorio.');
                        return;
                    }
                    if (vista.dfFechaInicio.getValue() > vista.dfFechaFin.getValue()) {
                        mostrarMensaje(1, 'La fecha de inicio debe ser menor que la fecha de fin.');
                        return;
                    }
                }
                if (vista.fpRepCert.getForm().isValid()) {
                    var winload = new Ext.PVD.comun.window.winLoad({
                        title: 'Por favor espere...',
                        mensaje: 'Enviando datos'
                    });
                    winload.showMask();
                    Ext.Ajax.request({
                        url: url,
                        timeout: 3000000,
                        method: 'POST',
                        params: {
                            estadodelete: estadodelete,
                            idreportescertificaciones: (datos.idreportescertificaciones ? datos.idreportescertificaciones : null),
                            fechainicio: (datos.fechainicio ? datos.fechainicio : null),
                            fechafin: (datos.fechafin ? datos.fechafin : null),
                            estado: (datos.estado ? datos.estado : null),
                            identidad: (datos.identidad ? datos.identidad : null),
                            tiposeleccionpersonas: this.tiporeportescertificaciones.data.tiposeleccionpersonas,
                            descripcion: vista.tfDescripcion.getValue(),
                            idconfreportescertificaciones: (datos.idconfreportescertificaciones ? datos.idconfreportescertificaciones : null)
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            winload.hideMask();
                            if (respuesta.codigo == 'ADD-1') {
                                mostrarMensaje(1, 'El reporte y certificaci&oacute;n se adicion&oacute; satisfactoriamente.');

                            } else if (respuesta.codigo == 'MOD-1') {
                                mostrarMensaje(1, 'El reporte y certificaci&oacute;n se modific&oacute; satisfactoriamente.');
                            } else if (respuesta.codigo == 'DEL-1') {
                                mostrarMensaje(1, 'El reporte y certificaci&oacute;n se elimin&oacute; satisfactoriamente.');
                            } else if (respuesta.codigo == 'DUP-1') {
                                mostrarMensaje(1, 'El reporte y certificaci&oacute;n se duplic&oacute; satisfactoriamente.');
                            }

                            if (boton == 'APLICAR' && accion == 'ADD') {
                                this.LimpiarFormularioRepCert();
                            } else if (boton == 'ACEPTAR' && accion != 'DEL') {
                                vista.winRepCert.hide();
                            }

                            if (accion == 'MOD' || accion == 'DEL') {
                                vista.btnModificar.disable();
                                vista.btnEliminar.disable();
                            }

                            vista.CargarReportesCertificaciones(this.identidad, this.tiporeportescertificaciones.data.idconfreportescertificaciones);

                        }.createDelegate(this)
                    });
                }


            } else {
                mostrarMensaje(1, 'Debe seleccionar un tipo de reportes y certificaciones.');
                return;
            }
        };

        this.devolverBarradeHerramientaparaElementos = function () {
            var estado = null, idusuarioreporte = null;
            if (vista.tpReportesCertificaciones.getActiveTab().id == 'tabActual') {
                estado = this.reportecertificacionactualseleccionado.data.estado;
                idusuarioreporte = this.reportecertificacionactualseleccionado.data.idusuario;
            }
            else {
                estado = this.reportecertificacionhistoricoseleccionado.data.estado;
                idusuarioreporte = this.reportecertificacionhistoricoseleccionado.data.idusuario;
            }

            var ocultarconformar = true,
                ocultaraprobar = true,
                ocultarelaborar = true,
                ocultaradicionar = true,
                ocultareliminar = true,
                ocultarguardar = true;
            ocultaractualizar = true;
            ocultaractualizarxexcel = true;
            ocultaractualizarxexceltrt = true;
            ocultarnotificacionlicmatsubsidios = true;
            ocultaractualizarservicioasistencia = true;
            ocultarcalcularacumulado = true;
            ocultarcalcularsalariopromedio = true;
            ocultaractualizarantiguedad = true;
            ocultaractualizarreportes = true;
            ocultaractualizarreportesdescuentosnoaplicados = true;
            ocultaractualizarreportesdesdenominasalario = true;
            ocultaractualizartalleres = true;
            ocultaractualizarreportepagodestajo = true;
            //if (idusuarioreporte == modelo.datosModelo.idusuario) {
            //ocultaradicionar = (UCID.acciones[window.parent.idFuncionalidad].btnadicionarelementoreportecertificaciones && estado == 1 ? false : true);
            ocultaradicionar = (estado == 1 ? false : true);
            ocultareliminar = (estado == 1 ? false : true);
            //ocultareliminar = (UCID.acciones[window.parent.idFuncionalidad].btneliminarelementoreportecertificaciones && estado == 1 ? false : true);
            //}

            //if(UCID.acciones[window.parent.idFuncionalidad].btnguardarelementosreportecertificaciones && estado != 3)
            if (estado != 3)
            //ocultarguardar = (estado == 2 || estado == 1 && idusuarioreporte == modelo.datosModelo.idusuario ? false : true);
                ocultarguardar = (estado == 2 || estado == 1 ? false : true);
            else
                ocultarguardar = true;   
            // ocultarconformar = (UCID.acciones[window.parent.idFuncionalidad].btnconformarreportecertificacion && estado == 1 && idusuarioreporte == modelo.datosModelo.idusuario ? false : true);
            ocultarconformar = (estado == 1 ? false : true);
            //ocultarconformar = (estado == 1 && idusuarioreporte == modelo.datosModelo.idusuario ? false : true);
            // ocultaraprobar = (UCID.acciones[window.parent.idFuncionalidad].btnaprobarreportecertificacion && estado == 2 ? false : true);
            //ocultaraprobar = (estado == 2 ? false : true);
            ocultaraprobar = (estado == 1 ? false : true);
            // ocultarelaborar = (UCID.acciones[window.parent.idFuncionalidad].btnelaborarreportecertificacion && estado == 2 ? false : true);
            ocultarelaborar = (estado == 3 ? false : true);
            ocultaractualizar = (this.tiporeportescertificaciones.data.deresultados == 5 || this.tiporeportescertificaciones.data.deresultados == 6 && estado == 1 ? false : true);
            ocultaractualizarxexcel = (estado == 1 ? false : true);
            ocultaractualizarxexceltrt = (this.tiporeportescertificaciones.data.deresultados == 11 && estado == 1 ? false : true);
            ocultaractualizarservicioasistencia = ((this.tiporeportescertificaciones.data.deresultados == 4 || this.tiporeportescertificaciones.data.deresultados == 2 || this.tiporeportescertificaciones.data.deresultados == 3 || this.tiporeportescertificaciones.data.deresultados == 8) && estado == 1 ? false : true);
            ocultarcalcularacumulado = (this.tiporeportescertificaciones.data.deresultados == 2 && estado == 1 ? false : true);
            ocultaractualizarantiguedad = (this.tiporeportescertificaciones.data.deresultados == 7 && estado == 1 ? false : true);
            ocultaractualizarreportes = (this.tiporeportescertificaciones.data.deresultados == 50 && estado == 1 ? false : true);
            ocultarnotificacionlicmatsubsidios = ((this.tiporeportescertificaciones.data.comportamientoreportesc4 != 1) ? false : true);
            ocultaractualizarreportesdescuentosnoaplicados = (this.tiporeportescertificaciones.data.deresultados == 12 && estado == 1 ? false : true);
            ocultaractualizarreportesdesdenominasalario = (this.tiporeportescertificaciones.data.deresultados == 13 && estado == 1 ? false : true);
            ocultaractualizartalleres= (this.tiporeportescertificaciones.data.deresultados == 10 && estado == 1 ? false : true);
            ocultaractualizarreportepagodestajo = (this.tiporeportescertificaciones.data.comportamientoreportesc4 == '5' ? false : true);

            var btnConformar = new Ext.Button({
                id: 'btnconformarreportecertificacion',
                text: 'Aprobar',
                tooltip: 'Aprobar reporte de certificación',
                hidden: ocultarconformar,
                iconCls: 'crearreporte'
            });

            var btnAprobar = new Ext.Button({
                id: 'btnaprobarreportecertificacion',
                text: 'Aprobar',
                tooltip: 'Aprobar reporte de certificación (<b>Alt+Q</b>)',
                hidden: ocultaraprobar,
                iconCls: 'aprobar',
                hidden: true
            });

            var btnElaborar = new Ext.Button({
                id: 'btnelaborarreportecertificacion',
                text: 'Elaborar',
                tooltip: 'Elaborar reporte de certificación',
                hidden: false,
                iconCls: 'crearreporte'
            });

            var btnAdicionarElemento = new Ext.Button({
                id: 'btnadicionarelementoreportecertificaciones',
                iconCls: 'adicionar',
                text: 'Ad<u>i</u>cionar',
                tooltip: 'Ad<u>i</u>cionar elementos al reporte de certificación (<b>Alt+I</b>)',
                hidden: ocultaradicionar
            });

            var btnEliminarElemento = new Ext.Button({
                id: 'btneliminarelementoreportecertificaciones',
                iconCls: 'eliminar',
                text: 'Eliminar',
                tooltip: 'Eliminar elementos del reporte de certificación (<b>DEL</b>)',
                disabled: true,
                hidden: ocultareliminar
            });

            var btnGuardar = new Ext.Button({
                disabled: false,
                id: 'btnguardarelementosreportecertificaciones',
                iconCls: 'guardar',
                text: '<u>G</u>uardar ',
                tooltip: '<u>G</u>uardar reporte de certificación (<b>Alt+G</b>)',
                hidden: ocultarguardar,
                handler: function () {
                }.createDelegate(this)
            });

            var btnActualizar = new Ext.Button({
                disabled: false,
                id: 'btnactualizarreporte',
                iconCls: 'actualizar',
                text: 'Actualizar',
                tooltip: 'Actualizar reporte de certificación (<b>Ctrl+Alt+Z</b>)',
                hidden: ocultaractualizar
            });

            var btnRecargar = new Ext.Button({
                disabled: false,
                id: 'btnrecargarreporte',
                iconCls: 'recargar',
                text: 'Recargar',
                tooltip: 'Actualizar valores reporte (SNC-225, Campos calculables)',
                hidden: false
            });

            var btnActualizarxExcel = new Ext.Button({
                disabled: false,
                id: 'btnActualizarxExcel',
                iconCls: 'actualizar',
                text: 'Excel',
                tooltip: 'Actualizar desde un Excel',
                hidden: ocultaractualizarxexcel
            });

            var btnActualizarxExcelTRT = new Ext.Button({
                disabled: false,
                id: 'btnActualizarxExcelTRT',
                iconCls: 'actualizar',
                text: 'Excel',
                tooltip: 'Actualizar desde un Excel',
                hidden: ocultaractualizarxexceltrt
            });

            var btnActualizarAusenciasServicio = new Ext.Button({
                disabled: false,
                id: 'btnActualizarAusenciasServicio',
                iconCls: 'actualizar',
                text: 'M&oacute;dulo de asistencia',
                tooltip: 'Actualizar desde el m&oacute;dulo de asistencia',
                hidden: ocultaractualizarservicioasistencia
            });

            var btnCalcularAcumuladoVacaciones = new Ext.Button({
                disabled: false,
                id: 'btnCalcularAcumuladoVacaciones',
                iconCls: 'calcular',
                text: 'Calcular acumulado',
                tooltip: 'Calcular acumulado',
                hidden: ocultarcalcularacumulado
            });

            var btnCalcularSalarioPromedio = new Ext.Button({
                disabled: false,
                id: 'btnCalcularSalarioPromedio',
                iconCls: 'calcular',
                text: 'Salario promedio',
                tooltip: 'Salario promedio',
                hidden: true
            });

            var btnActualizarAntiguedad = new Ext.Button({
                disabled: false,
                id: 'btnActualiarAntiguedad',
                iconCls: 'calcular',
                text: 'Actualizar',
                tooltip: 'Actualizar antiguedad',
                hidden: ocultaractualizarantiguedad
            });

            var btnExportarExcel = new Ext.Button({
                disabled: false,
                id: 'btnExportarExcel',
                iconCls: 'exportar',
                text: 'Exportar',
                tooltip: 'Exportar reporte de certificación (<b>Alt+Q</b>)',
                hidden: false
            });

            var btnModeloSubsidiosLicencias = new Ext.Button({
                disabled: true,
                id: 'btnModeloSubsidiosLicencias',
                iconCls: 'exportar',
                text: 'MODELO SC-4-04',
                tooltip: 'Exportar Notificación de Licencias y Subsidios(<b>Alt+M</b>)',
                hidden: ocultarnotificacionlicmatsubsidios
            });

            var btnActualizarDesdeReporte = new Ext.Button({
                disabled: btnActualizarDesdeReporte,
                id: 'btnDesdeReporte',
                iconCls: 'historial',
                text: 'Reporte',
                tooltip: 'Reporte',
                hidden: ocultaractualizarreportes
            });

            var btnActualizarDescuentoNoAplicado = new Ext.Button({
                disabled: false,
                id: 'btnActualizarDescuentoNoAplicado',
                iconCls: 'historial',
                text: 'Excel',
                tooltip: 'Importar reporte de descuento no aplicados',
                hidden: ocultaractualizarreportesdescuentosnoaplicados
            });

            var btnActualizarReporteDesdeNominas = new Ext.Button({
                disabled: false,
                id: 'btnActualizarReporteDesdeNominas',
                iconCls: 'actualizar',
                text: 'Actualizar',
                tooltip: 'Actualizar desde n&oacute;minas aprobadas',
                hidden: ocultaractualizarreportesdesdenominasalario
            });

            var btnActualizarModuloTalleres = new Ext.Button({
                disabled: false,
                id: 'btnActualizarModuloTalleres',
                iconCls: 'actualizar',
                text: 'M&oacute;dulo de talleres',
                tooltip: 'Actualizar desde el m&oacute;dulo de talleres',
                hidden: ocultaractualizartalleres
            });

            var btnActualizarReportePagoDestajo = new Ext.Button({
                disabled: false,
                id: 'btnActualizarReportePagoDestajo',
                iconCls: 'actualizar',
                text: 'Pago destajo',
                tooltip: 'Actualizar desde Pago destajo',
                hidden: ocultaractualizarreportepagodestajo
            });

            return [btnAdicionarElemento, btnEliminarElemento, btnConformar, btnAprobar, btnGuardar, btnElaborar, btnActualizar, btnActualizarxExcel, btnCalcularAcumuladoVacaciones, btnCalcularSalarioPromedio, btnActualizarAusenciasServicio, btnExportarExcel, btnActualizarAntiguedad, btnActualizarDesdeReporte, btnActualizarxExcelTRT, btnActualizarDescuentoNoAplicado, btnActualizarReporteDesdeNominas, btnRecargar, btnModeloSubsidiosLicencias, btnActualizarModuloTalleres, btnActualizarReportePagoDestajo];


        }.createDelegate(this);

        this.CargarElementos = function () {
            var idRC = -1, idCRC = -1, idusuarioreporte = -1, modo = 'EDICION', estado = -1;
            if (vista.tpReportesCertificaciones.getActiveTab().id == 'tabActual') {
                idRC = this.reportecertificacionactualseleccionado.data.idreportescertificaciones;
                idCRC = this.reportecertificacionactualseleccionado.data.idconfreportescertificaciones;
                idusuarioreporte = this.reportecertificacionactualseleccionado.data.idusuario;
                modo = 'EDICION';
                estado = this.reportecertificacionactualseleccionado.data.estado;
            }
            else {
                idRC = this.reportecertificacionhistoricoseleccionado.data.idreportecertificacion;
                idCRC = this.reportecertificacionhistoricoseleccionado.data.idconfreportescertificaciones;
                idusuarioreporte = this.reportecertificacionhistoricoseleccionado.data.idusuario;
                modo = 'VISTA';
                estado = this.reportecertificacionhistoricoseleccionado.data.estado;
            }

            Ext.Ajax.request({
                url: 'obtenerdatosconfiguracionvariables',
                timeout: 300000,
                method: 'POST',
                params: {
                    idconfreportescertificaciones: idCRC,
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta) {
                        if (vista.tpReportesCertificaciones.getActiveTab().id == 'tabActual') {
                            this.winElemPers = new Pvd.Nomina.ReportesyCertificaciones.WinElementosPersona({
                                valoresVariables: respuesta,
                                idreportescertificaciones: idRC,
                                idconfreportescertificaciones: this.tiporeportescertificaciones.data.idconfreportescertificaciones,
                                idtipoconfreportescertificaciones: this.tiporeportescertificaciones.data.deresultados,
                                comportamientoreportesc4: this.tiporeportescertificaciones.data.comportamientoreportesc4,
                                tiposeleccionpersonas: this.tiporeportescertificaciones.data.tiposeleccionpersonas,
                                btnacciones: this.devolverBarradeHerramientaparaElementos(),
                                idusuario: modelo.datosModelo.idusuario,
                                idusuarioreporte: idusuarioreporte,
                                identidad: this.identidad,
                                estado: estado,
                                modo: modo,
                                historico: 0,
                                self: self,
                                keys: [
                                    {
                                        /**botón btnBuscarP del componente elementospersonacomp.js*/
                                        key: 'b',
                                        alt: true,
                                        stopEvent: true,
                                        fn: function () {
                                            self.winElemPers.btnBuscarP.handler();
                                        }
                                    }, {
                                        /**botón btnLimpiar del componente elementospersonacomp.js*/
                                        key: 'l',
                                        alt: true,
                                        stopEvent: true,
                                        fn: function () {
                                            self.winElemPers.btnLimpiar.handler();
                                        }

                                    }, {
                                        /**botón btnAdicionarElemento de la funcion  this.devolverBarradeHerramientaparaElementos*/
                                        key: 'i',
                                        alt: true,
                                        stopEvent: true,
                                        fn: function () {
                                            if (self.devolverBarradeHerramientaparaElementos()[0].hidden == false) {
                                                self.winElemPers.btnacciones[0].handler();
                                            }
                                        }
                                    }, {
                                        /*botón btnEliminarElemento de la funcion  this.devolverBarradeHerramientaparaElementos*/
                                        key: Ext.EventObject.DELETE,
                                        stopEvent: true,
                                        fn: function () {
                                            if (self.devolverBarradeHerramientaparaElementos()[1].hidden == false) {
                                                self.winElemPers.btnacciones[1].handler();
                                            }
                                        }
                                    }, {
                                        /* botón btnAprobar de la funcion  this.devolverBarradeHerramientaparaElementos*/
                                        key: 'q',
                                        alt: true,
                                        stopEvent: true,
                                        fn: function () {
                                            if (self.devolverBarradeHerramientaparaElementos()[3].hidden == false) {
                                                self.winElemPers.btnacciones[3].handler();
                                            }

                                        }
                                    }, {
                                        /* botón btnGuardar de la funcion  this.devolverBarradeHerramientaparaElementos*/
                                        key: 'g',
                                        alt: true,
                                        stopEvent: true,
                                        fn: function () {
                                            if (self.devolverBarradeHerramientaparaElementos()[4].hidden == false) {
                                                self.winElemPers.btnacciones[4].handler();
                                            }
                                        }
                                    }, {
                                        /* botón btnGuardar de la funcion  this.devolverBarradeHerramientaparaElementos*/
                                        key: 'z',
                                        alt: true,
                                        crtl: true,
                                        stopEvent: true,
                                        fn: function () {
                                            if (self.devolverBarradeHerramientaparaElementos()[6].hidden == false) {
                                                self.winElemPers.btnacciones[6].handler();
                                            }
                                        }
                                    }, {
                                        /*botón btnExportarExcel de la funcion  this.devolverBarradeHerramientaparaElementos*/
                                        key: 'e',
                                        alt: true,
                                        stopEvent: true,
                                        fn: function () {
                                            if (self.devolverBarradeHerramientaparaElementos()[11].hidden == false) {
                                                self.winElemPers.btnacciones[11].handler();
                                            }
                                        }
                                    }
                                ]
                            });
                        } else {
                            this.winElemPers = new Pvd.Nomina.ReportesyCertificaciones.WinElementosPersona({
                                valoresVariables: respuesta,
                                idreportescertificaciones: idRC,
                                idconfreportescertificaciones: this.tiporeportescertificaciones.data.idconfreportescertificaciones,
                                idtipoconfreportescertificaciones: this.tiporeportescertificaciones.data.deresultados,
                                comportamientoreportesc4: this.tiporeportescertificaciones.data.comportamientoreportesc4,
                                tiposeleccionpersonas: this.tiporeportescertificaciones.data.tiposeleccionpersonas,
                                btnacciones: this.devolverBarradeHerramientaparaElementos(),
                                idusuario: modelo.datosModelo.idusuario,
                                idusuarioreporte: idusuarioreporte,
                                estado: estado,
                                modo: modo,
                                self: self,
                                historico: 1,
                                keys: [
                                    {
                                        key: 'b',
                                        alt: true,
                                        stopEvent: true,
                                        fn: function () {
                                            self.winElemPers.btnBuscarP.handler();
                                        }
                                    }, {
                                        key: 'l',
                                        alt: true,
                                        stopEvent: true,
                                        fn: function () {
                                            self.winElemPers.btnLimpiar.handler();
                                        }
                                    }
                                ],
                            });
                        }
                        this.winElemPers.on('reporteconformado', function (obj) {
                            vista.CargarReportesCertificaciones(this.identidad, this.tiporeportescertificaciones.data.idconfreportescertificaciones);
                        }.createDelegate(this));

                        this.winElemPers.on('reporteaprobado', function (obj) {
                            vista.CargarReportesCertificaciones(this.identidad, this.tiporeportescertificaciones.data.idconfreportescertificaciones);
                        }.createDelegate(this));

                        this.winElemPers.on('reporteelaborado', function (obj) {
                            vista.CargarReportesCertificaciones(this.identidad, this.tiporeportescertificaciones.data.idconfreportescertificaciones);
                        }.createDelegate(this));

                        this.winElemPers.show();
                        this.winElemPers.maximize();
                        this.winElemPers.Cargar();
                    } else {
                        mostrarMensaje(1, 'El reporte y certificaci&oacute;n no est&aacute; configurado.');
                    }

                }.createDelegate(this)
            });
        }.createDelegate(this);

        this.winElemPers = null;
        this.winElemCargs = null;
        vista.btnElementos.setHandler(this.CargarElementos);

        vista.btnElementosHistorico.setHandler(this.CargarElementos);

        vista.gpRepCertHistorico.on('rowselect', function (gp, n, i) {
            vista.btnActivar.enable();
        });

        vista.gpRepCertHistorico.on('rowdeselect', function (gp, n, i) {
            vista.btnActivar.disable();
        });

        vista.btnActivar.setHandler(function () {
            mostrarMensaje(2, '¿Está seguro que desea pasar el reporte a la ventana de actual?', function (btn) {
                if (btn == "ok") {
                    PVD.mostrarMascara('idmaskactivar', 'Por favor espere...', 'Activando el reporte eliminado');
                    Ext.Ajax.request({
                        url: 'activarreporteeliminado',
                        timeout: 3000000,
                        method: 'POST',
                        params: {
                            idreportescertificaciones: vista.gpRepCertHistorico.getSelectionModel().getSelected().get('idreportecertificacion')

                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmaskactivar');
                            if (respuesta.codigo == 'ACT') {
                                var idreporte = vista.winRepCert.idreportescertificaciones;
                                modelo.stRepCertHistorico.removeAll();
                                modelo.stRepCertHistorico.baseParams.identidad = identidadaux;
                                modelo.stRepCertHistorico.baseParams.idconfreportescertificaciones = vista.pTiposReportesCertificaciones.gpTipoRepCert.getSelectionModel().getSelected().get('idconfreportescertificaciones');
                                modelo.stRepCertHistorico.load({params: {start: 0, limit: 1000}});
                                vista.btnElementosHistorico.disable();
                                vista.btnActualizar.disable();
                            }

                        }.createDelegate(this)
                    });
                }
            });
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarreportesycertificaciones', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    variablesGlobales.perfil = arguments[0];

    /*Configuracion inicial*/
    //Hago la peticion para cargar los datos iniciales
    PVD.mostrarMascara('idmaskcargardatosreportescertificaciones', 'Por favor espere...', 'Cargando datos de reportes y certificaciones');
    Ext.Ajax.request({
        url: 'obtenerconfiguracioninicial',
        timeout: 3000000,
        method: 'POST',
        callback: function (options, success, response) {
            PVD.ocultarMascara('idmaskcargardatosreportescertificaciones');
            //Inicializando el modelo
            var modelo = Pvd.Nomina.ReportesyCertificaciones.GestReportesyCertificaciones.Modelo;
            modelo.init(idioma);

            modelo.datosModelo = Ext.decode(response.responseText);

            modelo.cargarConfiguracion();

            //Inicializando la vista.
            var vista = Pvd.Nomina.ReportesyCertificaciones.GestReportesyCertificaciones.Vista;
            vista.init(perfil, idioma, modelo);

            //Inicializar controlador.
            Pvd.Nomina.ReportesyCertificaciones.GestReportesyCertificaciones.Controlador.init(idioma, vista, modelo);
            UCID.portal.cargarAcciones(10000000019);
        }.createDelegate(this)
    });
});
