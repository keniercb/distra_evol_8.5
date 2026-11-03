Ext.ns('Pvd.Nomina.Banco.ExportarBanco');
Ext.QuickTips.init();

//Para la ventana para la exportación del talón de pago
Pvd.Nomina.Banco.winTalonPago = Ext.extend(Ext.Window, {
    initComponent: function () {
        var scope = this;
        this.id = (this.id) ? this.id : 'winTalonPagoEvt';
        this.identidad = (this.identidad) ? this.identidad : null;
        this.idelaborarpagos = (this.idelaborarpagos) ? this.idelaborarpagos : null;
        this.estado = (this.estado) ? this.estado : null;
        this.tiposeleccion = 1;
        var idCmp = this.id;
        this.btnAcpReporteTalon = new Ext.Button({
            id: 'btnAcpReporteTalon&' + idCmp,
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            handler: function () {
                if (this.aceptarPersonas(true))
                    this.destroy();
            }.createDelegate(this)
        });
        this.btnCancReporteTalon = new Ext.Button({
            disabled: false,
            id: 'btnCancReporteTalon&' + idCmp,
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
            iconCls: 'cancelar',
            text: 'Cancelar',
            handler: function () {
                this.destroy();
            }.createDelegate(this)
        });
        this.layout = 'fit';
        this.modal = true;
        this.closeAction = 'destroy';
        this.title = 'Tal&oacute;n de pago';
        this.resizable = false;
        this.width = 600;
        this.height = 500;
        this.buttons = [this.btnCancReporteTalon, this.btnAcpReporteTalon];

        //Check desglose
        this.chbMostrarDesglose = new Ext.form.Checkbox({
            id: 'idchbMostrarDesglose',
            fieldLabel: 'Mostrar desglose',
            anchor: '99%',
            name: 'mostrardesglose',
        });

        //Store del combobox tipo seleccion del talon de pago
        this.storeTipoSeleccionPersonas = new Ext.data.SimpleStore({
            fields: [{name: 'valor'}, {name: 'denominacion'}]
        });
        var tipos = [[1, 'Todas las personas'], [2, 'Personas sin correo'], [3, 'Personas específicas']];
        this.storeTipoSeleccionPersonas.loadData(tipos);

        //Combo box tipo de seleccion
        this.cbTipoSeleccion = new Ext.form.ComboBox({
            id: 'idcbTipoSeleccion',
            fieldLabel: 'Tipo de selecci&oacute;n',
            anchor: '90%',
            tabIndex: 3,
            triggerAction: 'all',
            valueField: 'valor',
            displayField: 'denominacion',
            hiddenName: 'valor',
            mode: 'local',
            readOnly: true,
            store: this.storeTipoSeleccionPersonas
        });

        //Grid de Personas
        this.pbuscarpersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            id: 'pbuscarpersona' + this.id,
            singleSelect: false,
            height: 350,
            modulo: 'NOMINA',
            funcionalidad: 'TALON',
            identidad: this.identidad,
            cantidadPorPaginas: 100,
            region: 'south',
            disabled: true
        });

        this.pbuscarpersona.on('personaselecionada', function (fila) {
            if (scope.tiposeleccion == 3) {
                if (scope.pbuscarpersona.getSelectedRows().length > 0)
                    scope.btnAcpReporteTalon.enable();
                else
                    scope.btnAcpReporteTalon.disable();
            }
        }.createDelegate(this));

        this.pbuscarpersona.on('personanoselecionada', function (fila) {
            if (scope.tiposeleccion == 3) {
                if (scope.pbuscarpersona.getSelectedRows().length > 0)
                    scope.btnAcpReporteTalon.enable();
                else
                    scope.btnAcpReporteTalon.disable();
            }
        }.createDelegate(this));

        this.pbuscarpersona.stpersonabuscar.on('beforeload', function (st) {
            st.baseParams.idelaborarpagos =  Ext.encode(scope.idelaborarpagos);
        });

        this.pbuscarpersona.btnDarAlta.hide();

        this.pbuscarpersona.btnDarBaja.hide();

        //Formulario
        this.formTalonPago = new Ext.FormPanel({
            id: 'idformTalonPago',
            width: 600,
            layout: 'border',
            region: 'center',
            border: true,
            frame: true,
            //bodyStyle: 'padding: 20px;',
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Seleccione...',
                    region: 'center',
                    width: 500,
                    height: 80,
                    items: [
                        {
                            layout: 'column',
                            items: [
                                {columnWidth: .75, layout: 'form', items: [this.cbTipoSeleccion]},
                                {columnWidth: .25, layout: 'form', items: [this.chbMostrarDesglose]}
                            ]
                        }
                    ]
                }, this.pbuscarpersona]
        });

        this.items = [this.formTalonPago];

        this.cbTipoSeleccion.setValue(1);
        this.cbTipoSeleccion.on('select', function(comb,data,pos){
            switch(pos){
                case 0:
                    scope.tiposeleccion = 1;
                    scope.pbuscarpersona.disable();
                    scope.pbuscarpersona.CambiarEntidad(-1);
                    scope.pbuscarpersona.Buscar();
                    scope.btnAcpReporteTalon.enable();
                    break;
                case 1:
                    scope.tiposeleccion = 2;
                    scope.pbuscarpersona.disable();
                    scope.pbuscarpersona.CambiarEntidad(-1);
                    scope.pbuscarpersona.Buscar();
                    scope.btnAcpReporteTalon.enable();
                    break;
                case 2:
                    scope.tiposeleccion = 3;
                    scope.pbuscarpersona.enable();
                    scope.pbuscarpersona.CambiarEntidad(scope.identidad);
                    scope.pbuscarpersona.Buscar();
                    scope.btnAcpReporteTalon.disable();
                    break;
            }
        });

        Pvd.Nomina.Banco.winTalonPago.superclass.initComponent.call(this);
    },
    aceptarPersonas: function () {
        var desglose = this.chbMostrarDesglose.getValue() ? 1 : 0;
        //Array Personas
        var seleccion = this.pbuscarpersona.getSelectedRows();
        var arrPersonas = new Array();
        Ext.each(seleccion, function (sel) {
            arrPersonas.push(sel.data.idpersona);
        });
        if (this.estado != 0) {
            Ext.Ajax.request({
                timeout: 300000,
                url: '/pvd/nomina/index.php/exportarbanco/exportartalonpago',
                method: 'POST',
                params: {
                    accionvalidacion: 1,
                    identidad: this.identidad,
                    idelaborarpagos: Ext.encode(this.idelaborarpagos),
                    tiposeleccion: this.tiposeleccion,
                    personas: Ext.encode(arrPersonas),
                    desglose: desglose
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    switch (respuesta.validacion) {
                        case '0': {
                            //Mascara
                            var winload = new Ext.PVD.comun.window.winLoad({
                                title: 'Por favor espere...',
                                mensaje: 'Generando reporte'
                            });
                            winload.showMask();

                            //Frame
                            var iframe = document.createElement("iframe");
                            iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/nomina/index.php/exportarbanco/exportartalonpago?' +
                                'identidad=' + this.identidad +
                                '&idelaborarpagos=' + Ext.encode(this.idelaborarpagos) +
                                '&tiposeleccion=' + this.tiposeleccion +
                                '&personas=' + Ext.encode(arrPersonas) +
                                '&desglose=' + desglose;
                            iframe.style.display = 'none';
                            this.destroy();
                            iframe.onload = function () {
                                winload.hideMask();
                            };
                            document.body.appendChild(iframe);
                            break;
                        }
                        case '1': {
                            mostrarMensaje(3, 'El tipo de n&oacute;mina ' + '<b>"' + respuesta['denomtiponomina'] + '"</b>' + ' no tiene configurado los campos a mostrar en el Tal&oacute;n de pago, en la funcionalidad <b>Estructurar modelos de n&oacute;mina</b>.');
                            break;
                        }
                        case '2': {
                            mostrarMensaje(3, 'No existen personas sin el correo configurado, para el tipo de n&oacute;mina ' + '<b>"' + respuesta['denomtiponomina'] + '"</b>');
                            break;
                        }
                    }
                    PVD.ocultarMascara('idmasktalon');
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, 'Las n&oacute;minas deben estar al menos certificadas.');
        }

    }
});

Pvd.Nomina.Banco.ExportarBanco.Vista = {

    init: function (perfil, idioma, modelo) {
        this.acumuladoneto = 0.00;
        this.acumuladocuc = 0.00;
        this.tipobusqueda = 0;
        this.tipoentidad = 0;
        this.estado = 0;
        var self = this;
        this.recordperiodopagoexportarseleccionado = null;

        this.arrayidelaborarpagos = new Array();

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
            //icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar'
        });

        //Vista para el componente Buscar estructura 
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            closable: false,
            constrain: true,
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

        //Radios de tipos de busqueda
        //Ventana para escoger la asociación automática o manual
        this.rbActual = new Ext.form.Radio({
            id: 'rbActual',
            boxLabel: 'Actual',
            name: 'tipobusqueda',
            inputValue: 1
        });

        this.rbHistorico = new Ext.form.Radio({
            id: 'rbHistorico',
            boxLabel: 'Hist&oacute;rico',
            name: 'tipobusqueda',
            inputValue: 2
        });

        this.rgTipoBusqueda = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.50, .50],
            style: 'padding-left: 20px;',
            items: [this.rbActual, this.rbHistorico]
        });

        //Radios de misma entidad o entidades subordinadas
        this.rbSimpleEntidad = new Ext.form.Radio({
            id: 'rbSimpleEntidad',
            boxLabel: 'Misma',
            name: 'tipoentidad',
            checked: true,
            disabled: true,
            inputValue: 1
        });

        this.rbEntidadesSubordinadas = new Ext.form.Radio({
            id: 'idrbEntidadesSubordinadas',
            boxLabel: 'Subordinada',
            name: 'tipoentidad',
            disabled: true,
            inputValue: 2
        });

        this.rgTipoEntidad = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.50, .50],
            style: 'padding-left: 20px;',
            items: [this.rbSimpleEntidad,this.rbEntidadesSubordinadas]
        });

        this.formularioTipoBusqueda = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 500,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: 'Res&uacute;menes de los periodos al banco',
                height: 80,
                width: '93%',
                region: 'center',
                items: [
                    this.rgTipoBusqueda
                ]
            }, {
                xtype: 'fieldset',
                title: 'Entidades',
                height: 80,
                width: '93%',
                region: 'center',
                items: [
                    this.rgTipoEntidad
                ]
            }]
        });

        this.btnAceptarTipoBusqueda = new Ext.Button({
            id: 'btnAceptarTipoBusqueda',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true
        });

        this.btnCancelarTipoBusqueda = new Ext.Button({
            id: 'btnCancelarTipoBusqueda',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaTipoBusqueda = new Ext.Window({
            region: 'center',
            title: 'Res&uacute;menes de los per&iacute;odos al banco',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.formularioTipoBusqueda],
            //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
            bbar: ['->', this.btnCancelarTipoBusqueda, this.btnAceptarTipoBusqueda]
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //Grid con los resumenes de los periodos de pago
        this.expanderFechasCierre = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p><b>&nbsp;&nbsp;Tipos de pago:&nbsp;</b>{listadotipospagos}</p><br/></div>'
            ), enableCaching: false
        });

        this.gpFechasCierre = new Ext.grid.GridPanel({
            id: 'gpFechasCierre',
            title: 'Listado de fechas de los res&uacute;menes',
            region: 'center',
            layout: 'fit',
            border: true,
            columns: [
                new Ext.grid.RowNumberer(),
                self.expanderFechasCierre,
                {
                    header: 'Fecha cierre',
                    dataIndex: 'fechacierre',
                    width: 40,
                    hideable: false,
                    sortable: true
                },
                {
                    header: 'Año',
                    dataIndex: 'anno',
                    width: 50,
                    hideable: false,
                    sortable: true,
                    hidden: true
                },
                {
                    header: 'Monto CUP - Cajero',
                    dataIndex: 'cajeromontocup',
                    width: 50,
                    hideable: false,
                    sortable: true
                },
                {
                    header: 'Monto CUC - Cajero',
                    dataIndex: 'cajeromontocuc',
                    width: 50,
                    hideable: false,
                    sortable: true
                },
                {
                    header: 'Monto CUP - Caja',
                    dataIndex: 'cajamontocup',
                    width: 50,
                    hideable: false,
                    sortable: true
                },
                {
                    header: 'Monto CUC - Caja',
                    dataIndex: 'cajamontocuc',
                    width: 50,
                    hideable: false,
                    sortable: true
                }
            ],
            stripeRows: true,
            autoScroll: true,
            width: 600,
            height: 350,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.stFechasCierre,
            plugins: self.expanderFechasCierre,
            sm: new Ext.grid.RowSelectionModel({
                multiSelect: true
            }),
            loadMask: {msg: 'Cargando'}
        });

        this.btnAceptarResumenPeriodos = new Ext.Button({
            id: 'btnAceptarResumenPeriodos',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true
        });

        this.btnCancelarResumenPeriodos = new Ext.Button({
            id: 'btnCancelarResumenPeriodos',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaResumenPeriodos = new Ext.Window({
            region: 'center',
            layout: 'fit',
            title: 'Resumen de los per&iacute;odos de pago',
            modal: true,
            resizable: true,
            draggable: true,
            autoWidth: true,
            autoHeight: true,
            closeAction: 'hide',
            closable: true,
            items: [this.gpFechasCierre],
            //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
            bbar: ['->', this.btnCancelarResumenPeriodos, this.btnAceptarResumenPeriodos]
        });
        /////////////////////////////////////////////////////////////////////////////////////////////////

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',
            //  icon: perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',

        });

        this.btnResumenGeneral = new Ext.Button({
            id: 'btnResumenGeneral',
            text: 'Resumen general',
            tooltip: 'Resumen general de las n&oacute;minas',
            iconCls: 'exportar'

        });

        this.btnDescAplicados = new Ext.Button({
            id: 'idbtnDescAplicados',
            text: 'Descuentos Aplicados.pdf',
            tooltip: 'Reporte de descuentos aplicados',
            iconCls: 'exportar',
        });

        this.btnCerrarResumen = new Ext.Button({
            id: 'btnCerrarResumen',
            text: 'Cerrar',
            tooltip: 'Cerrar resumen de los per&iacute;odos de pago',
            iconCls: 'terminar',
            disabled: true
        });

        this.btnActualizarResumen = new Ext.Button({
            id: 'btnActualizarResumen',
            text: 'Actualizar',
            tooltip: 'Actualizar datos registro personas',
            iconCls: 'actualizar',
            disabled: true
        });


        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            modoview: 2,
            estado: 1
        });

        this.btnAceptarPeriodosPagos = new Ext.Button({
            id: 'btnAceptarPeriodosPagos',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            // icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar'
        });

        this.winPeriodosPagos = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            modal: true,
            height: 400,
            width: 700,
            closable: true,
            constrain: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'border',
            items: [this.objListarPeriodosPagos],
            buttons: [this.btnAceptarPeriodosPagos]
        });


        this.btnExportarBanco = new Ext.Button({
            id: 'btnExportarBanco',
            text: '<u>E</u>xportar .dbf',
            tooltip: '<u>E</u>xportar .dbf (<b>Alt+E</b>)',
            iconCls: 'exportar'
        });

        this.btnExportarCajero = new Ext.Toolbar.MenuButton({
            id: 'btnExportarCajero',
            text: '<u>E</u>xportar',
            tooltip: '<u>E</u>xportar (<b>Alt+E</b>)',
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Exportar PDF', handler: function (items, p) {
                        }
                    },
                    // {
                    //     text: 'Exportar Excel', handler: function (items, p) {
                    // }
                    // }
                ]
            }
        });

        this.btnExportarCaja = new Ext.Button({
            id: 'btnExportarCaja',
            text: '<u>E</u>xportar .pdf caja',
            tooltip: '<u>E</u>xportar .pdf caja  (<b>Alt+E</b>)',
            //icon: perfil.dirImg+'exportar.png',
            hidden: true,
            iconCls: 'exportar'
        });

        this.btnNotificarCorreo = new Ext.Button({
            id: 'btnNotificarCorreo',
            text: 'Notificar',
            //tooltip: '',
            //icon: perfil.dirImg+'aprobar.png',
            iconCls: 'aprobar'
        });

        this.btnTalonPagoBanco = new Ext.Button({
            id: 'btnTalonPagoBanco',
            text: 'Tal&oacute;n de pago',
            iconCls: 'talonario'
        });

        this.fnRenderExportar = function (val) {
            return '<span style="color:#006400;">' + '<center>' + val + '</center>' + '</span>';
        };

        this.fnRenderExportarName = function (val) {
            return '<span style="color:#006400;">' + val + '</span>';
        };

        this.fnPintarCantidadesBilletes = function (val) {
            if (val == '-')
                return '<span style=" font-weight: bold ; color:#700000;">' + val + '</span>';
            else
                return '<span style="color:#700000;">' + val + '</span>';
        };

        this.fnPintarMontosBilletes = function (val) {
            var primercaracter = Ext.util.Format.substr(val, 0, 1);
            if (primercaracter == ' ')
                return '<span style=" font-weight: bold ; color:#700000;">' + val + '</span>';
            else
                return '<span style="color:#700000;">' + val + '</span>';
        };

        this.fnRenderPintarBilletesMenudo = function (val) {
            var primercaracter = Ext.util.Format.substr(val, 0, 1);
            var ultimocaracter = Ext.util.Format.substr(val, -1, 1);
            if (primercaracter == '$')
                return '<span style="color:#006600;">' + val + '</span>';
            if (ultimocaracter == 'c')
                return '<span style="color:#c9750f;">' + val + '</span>';

            if (primercaracter == 'T')
                return '<span style="font-weight: bold ; color:#700000;">' + val + '</span>';
        };

        this.fnRenderName = function (val) {
            return '<span style="color:#700000;">' + val + '</span>';
        };

        this.fnRenderCaja = function (val) {
            if (val == null) {
                return '<span style="color:#700000;">' + '<center>' + "0.00" + '</center>' + '</span>';
            } else {
                return '<span style="color:#700000;">' + '<center>' + val + '</center>' + '</span>';
            }
        };

        this.fnRenderVal = function (val) {
            if (val == null) {
                return '';
            } else {
                return '<span style="color:#006400;">' + '<center>' + val + '</center>' + '</span>';
            }
        };

        this.nfAcumulado = new Ext.form.TextField({
            name: 'denominacion',
            width: '90%',
            id: 'nfAcumulado',
            readOnly: true
        });

        this.nfAcumuladoCUC = new Ext.form.TextField({
            name: 'acumuladocuc',
            width: '90%',
            id: 'nfAcumuladoCUC',
            readOnly: true
        });

        this.smExportarBanco = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpExportarBanco = new Ext.grid.EditorGridPanel({
            title: 'Listado de personas por Cajero',
            store: modelo.stExportarBanco,
            region: 'center',
            border: true,
            loadMask: {text: 'Cargando...'},
            width: '100%',
            autoScroll: true,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            columns: [
                {header: 'idpersona', dataIndex: 'idpersona', width: 100, hidden: true, hideable: true},
                new Ext.grid.RowNumberer(),
                this.smExportarBanco,
                {
                    header: 'Plantilla nominal',
                    dataIndex: 'denominacion',
                    width: 90,
                    hideable: true,
                    hidden: true,
                    renderer: function (val) {
                        return '<span style="color:darkgreen;">' + val.split("--")[1] + '</span>';
                    }
                },
                {
                    header: 'Cod. contable',
                    dataIndex: 'cdgocontable',
                    width: 90,
                    hideable: false,
                    renderer: this.fnRenderName,
                    sortable: true
                },
                {
                    header: 'Nombre y apellidos',
                    dataIndex: 'nombreyapellidos',
                    width: 200,
                    hideable: false,
                    renderer: this.fnRenderExportarName,
                    sortable: true
                },
                {
                    dataIndex: 'cod_tipid',
                    header: 'COD_TIPID',
                    width: 80,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'cod_paexid',
                    header: 'COD_PAEXID',
                    width: 80,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'num_ideper',
                    header: 'NUM_IDEPER',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'cta_mnac',
                    header: 'CTA_MNAC',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'importe_n',
                    header: 'IMPORTE_N',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderVal,
                    sortable: true
                },
                {
                    dataIndex: 'cta_mlc',
                    header: 'CTA_MLC',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderExportar,
                    sortable: true
                },
                {
                    dataIndex: 'importe_d',
                    header: 'IMPORTE_D',
                    width: 100,
                    hideable: false,
                    renderer: this.fnRenderVal,
                    sortable: true
                }
            ],
            sm: this.smExportarBanco,
            tbar: [this.btnExportarBanco, this.btnExportarCajero, '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', "Total CUP:", this.nfAcumulado, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', "Total CUC:", this.nfAcumuladoCUC]
            , keys: [
                {
                    key: 'e',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnExportarBanco.handler();
                    }
                }
            ]
        });

        this.nfAcumuladoCajaCup = new Ext.form.TextField({
            name: 'denominacioncup',
            width: '90%',
            id: 'nfAcumuladoCajaCup',
            readOnly: true
        });

        this.nfAcumuladoCajaCUC = new Ext.form.TextField({
            name: 'acumuladocajacuc',
            width: '90%',
            id: 'nfAcumuladoCajaCUC',
            readOnly: true
        });

        this.smPersonasCaja = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpPersonasCaja = new Ext.grid.GridPanel({
            id: 'idgpConcepto',
            title: 'Listado de personas por Caja',
            region: 'center',
            border: true,
            columns: [{header: 'id', dataIndex: 'idpersona', width: 100, hidden: true, hideable: true},
                new Ext.grid.RowNumberer(),
                this.smPersonasCaja,
                {
                    header: 'Plantilla nominal',
                    dataIndex: 'denominacion',
                    width: 90,
                    hideable: false,
                    hidden: true,
                    renderer: function (val) {
                        return '<span style="color:darkgreen;">' + val.split("--")[1] + '</span>';
                    }
                },
                {
                    header: 'Cod. contable',
                    dataIndex: 'cdgocontable',
                    width: 90,
                    hideable: false,
                    renderer: this.fnRenderName,
                    sortable: true
                },
                {
                    header: 'CI',
                    dataIndex: 'num_ideper',
                    width: 90,
                    hideable: false,
                    renderer: this.fnRenderName,
                    sortable: true
                },
                {
                    header: 'Nombre y apellidos',
                    dataIndex: 'nombreyapellidos',
                    width: 120,
                    hideable: false,
                    renderer: this.fnRenderName,
                    sortable: true
                },
                {
                    dataIndex: 'importe_n',
                    header: 'CUP',
                    width: 60,
                    hideable: false,
                    renderer: this.fnRenderCaja,
                    sortable: true
                },
                {
                    dataIndex: 'importe_d',
                    header: 'CUC',
                    width: 60,
                    hideable: false,
                    renderer: this.fnRenderCaja,
                    sortable: true
                }
            ],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.stPersonasCaja,
            sm: this.smPersonasCaja,
            loadMask: {msg: 'Cargando'},
            tbar: ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', "Total CUP:", this.nfAcumuladoCajaCup, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', "Total CUC:", this.nfAcumuladoCajaCUC],
            keys: [
                {
                    key: 'e',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnExportarCaja.handler();
                    }
                }
            ]
        });

        this.usuario = new Ext.form.TextField({
            name: 'usuario',
            width: '100%',
            id: 'usuario',
            fieldLabel: 'Usuario',
            allowBlank: false

        });

        this.pass = new Ext.form.TextField({
            name: 'password',
            width: '100%',
            id: 'password',
            fieldLabel: 'Password',
            allowBlank: false,
            inputType: 'password'


        });

        this.formularioNotificar = new Ext.FormPanel({
            id: 'formularioNotificar',
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            items: [this.usuario, this.pass]
        });

        this.winNotificar = new Ext.Window({
            title: 'Notificar por correo',
            modal: true,
            height: 200,
            width: 300,
            closable: true,
            constrain: true,
            labelAlign: 'top',
            closeAction: 'hide',
            resizable: false,
            //buttons:[this.btnCancelarNotificacion,this.btnAceptarNotificacion],
            items: [this.formularioNotificar]
        });

        //Desglose de Billetes
        this.btnExportarDesglose = new Ext.Button({
            id: 'btnExportarDesglose',
            text: '<u>E</u>xportar desglose',
            tooltip: '<u>E</u>xportar desglose de billetes (<b>Alt+B</b>)',
            // icon: perfil.dirImg+'exportar.png',
            iconCls: 'exportar'
        });

        //Desglose de Billetes por personas
        this.btnExportarDesglosePersonas = new Ext.Button({
            id: 'btnExportarDesglosePersonas',
            text: '<u>E</u>xportar desglose por personas',
            tooltip: '<u>E</u>xportar desglose de billetes por personas(<b>Alt+P</b>)',
            iconCls: 'exportar'
        });

        this.gpDesgloseCUP = new Ext.grid.GridPanel({
            id: 'idgpDesgloseCUP',
            title: 'Desglose CUP',
            region: 'center',
            border: true,
            columns: [
                {header: 'Billete', dataIndex: 'billete', width: 90, renderer: this.fnRenderPintarBilletesMenudo},
                {
                    header: 'Cantidad',
                    dataIndex: 'cantidadbillete',
                    width: 90,
                    renderer: this.fnPintarCantidadesBilletes
                },
                {header: 'Monto', dataIndex: 'producto', width: 90, renderer: this.fnPintarMontosBilletes}
            ],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            viewConfig: {forceFit: true},
            store: modelo.stBilletesCUP,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {msg: 'Cargando'}
        });

        //Panel de DesgloseCUP
        this.pDesgloseCUP = new Ext.Panel({
            region: 'center',
            layout: 'border',
            width: '100%',
            height: 0.38 * screen.height,
            collapsible: false,
            collapsed: false,
            resizable: false,
            split: true,
            items: [this.gpDesgloseCUP],
            autoScroll: true
        });

        this.gpDesgloseCUC = new Ext.grid.GridPanel({
            id: 'idgpDesgloseCUC',
            title: 'Desglose CUC',
            region: 'center',
            border: true,
            columns: [
                {header: 'Billete', dataIndex: 'billete', width: 90, renderer: this.fnRenderPintarBilletesMenudo},
                {
                    header: 'Cantidad',
                    dataIndex: 'cantidadbillete',
                    width: 90,
                    renderer: this.fnPintarCantidadesBilletes
                },
                {header: 'Monto', dataIndex: 'producto', width: 90, renderer: this.fnPintarMontosBilletes}
            ],
            stripeRows: true,
            autoScroll: true,
            width: '100%',
            viewConfig: {forceFit: true},
            store: modelo.stBilletesCUC,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {msg: 'Cargando'}
        });

        //Panel de DesgloseCUC
        this.pDesgloseCUC = new Ext.Panel({
            region: 'south',
            layout: 'border',
            width: '100%',
            height: 0.32 * screen.height,
            collapsible: false,
            collapsed: false,
            resizable: false,
            split: true,
            items: [this.gpDesgloseCUC],
            autoScroll: true
        });

        //Panel de Cajero
        this.pEntidades = new Ext.Panel({
            region: 'west',
            layout: 'border',
            width: '85%',
            collapsible: false,
            resizable: false,
            split: true,
            items: [this.gpExportarBanco]
        });

        //Panel de Caja
        this.pPeriodosPago = new Ext.Panel({
            region: 'center',
            layout: 'border',
            //width: '20%',
            collapsible: false,
            resizable: false,
            split: true,
            items: [this.gpPersonasCaja]
        });

        //Panel de Desglose
        this.pResumen = new Ext.Panel({
            title: 'Desglose de billetes de personas por caja',
            region: 'east',
            layout: 'border',
            width: '50%',
            height: '100%',
            collapsible: false,
            resizable: false,
            items: [this.pDesgloseCUP, this.pDesgloseCUC],
            tbar: [this.btnExportarDesglose, this.btnExportarDesglosePersonas]
        });

        //Ventana Principal
        this.winExportarBanco = new Ext.Window({
            title: 'Listado de personas por cajero y caja',
            modal: true,
            height: 600,
            width: 800,
            closable: true,
            constrain: true,
            collapsible: false,
            resizable: false,
            closeAction: 'hide',
            layout: 'border',
            tbar: [this.btnCerrarResumen, this.btnActualizarResumen, '->', this.btnTalonPagoBanco, this.btnNotificarCorreo, this.btnDescAplicados, this.btnResumenGeneral, '|', this.btnAyuda],
            items: [this.pEntidades, this.pPeriodosPago, this.pResumen]
        });
    }
};
