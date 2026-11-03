/*
 * Movimiento de personas.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Fuerzatrabajo
 * @uses Pvd.Fuerzatrabajo.Movimientoslaborales
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Fuerzatrabajo.Movimientoslaborales');
Ext.QuickTips.init();
Pvd.Fuerzatrabajo.Movimientoslaborales.Vista = {
    init: function (idioma, modelo) {
        let self = this;
        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaMovimiento',
            iconCls: 'ayuda',
            tooltip: idioma.textToolTipAyuda,
            text: idioma.BtnAyuda
        });

        this.btnAlta = new Ext.Button({
            id: 'btnAlta',
            hidden: true,
            disabled: true,
            text: idioma.BtnAlta,
            tooltip: idioma.msgdarAltatt,
            iconCls: 'daralta'
        });

        this.btnMovimiento = new Ext.Button({
            id: 'btnMovimiento',
            hidden: true,
            disabled: true,
            text: idioma.BtnMov,
            tooltip: idioma.msgMov,
            iconCls: 'movimiento'
        });

        this.btnBaja = new Ext.Button({
            id: 'btnBaja',
            hidden: true,
            disabled: true,
            text: 'Baja',
            tooltip: idioma.msgdarBajatt,
            iconCls: 'darbaja'
        });

        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            hidden: true,
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificar,
            iconCls: 'modificar'
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            hidden: true,
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminar,
            iconCls: 'eliminar'
        });

        //////// actualizar
        this.btnSincronizar = new Ext.Button({
            id: 'btnSincronizar',
            text: idioma.lbBtnSincronizar,
            tooltip: idioma.textToolTipS,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'sincronizar',
        });

        this.btnSincronizar.on('click', function () {
            modelo.stEspecialidad.load();
        }),
//////////// seleccion 

                this.btnAceptarSeleccion = new Ext.Button({
                    id: 'btnaceptars',
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    tooltip: idioma.textToolTipAceptar,
                    handler: function () {
                        if (self.dfFDesdeSelecc.getRawValue() && self.dfFHastaSelecc.getRawValue() && self.dfFDesdeTit.getRawValue() && self.dfFHastaTit.getRawValue()) {
                            self.winEspecialidad.show();
                            self.seleccionER.hide();
                            // self.dfFDesdeSelecc.reset();
                            // self.dfFHastaSelecc.reset();
                            // self.dfFDesdeTit.reset();
                            // self.dfFHastaTit.reset();
                        }
                    }
                });

        // this.btnAceptarSeleccion.on('click',function(btn){
        //     self.winEspecialidad.show();
        //     self.seleccionER.hide();
        // });

        this.btnCancelarSeleccion = new Ext.Button({
            id: 'btncancelars',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: idioma.textToolTipCancelar
        });

        this.btnCancelarSeleccion.on('click', function (btn) {
            self.seleccionER.hide();
            self.dfFDesdeSelecc.reset();
            self.dfFHastaSelecc.reset();
            self.dfFDesdeTit.reset();
            self.dfFHastaTit.reset();
        });



        ////// especialidad

        this.btnBuscarEspecialidad = new Ext.Button({
            disabled: false,
            text: idioma.textBtnBuscar,
            tooltip: idioma.textBtnBuscar,
            iconCls: 'modificar',
            hidden: true
        });

        this.lbBuscarEspecialidad = new Ext.form.Label({
            text: 'Buscar Especialidad: ',
            hidden: false
        });

        this.sfBuscarEspecialidad = new Ext.app.SearchField({
            store: modelo.stEspecialidad,
            width: 200,
            pageSize: 15,
            disabled: false,
            toolTipTrigger1: 'Limpiar',
            toolTipTrigger2: 'Buscar',
            emptyText: idioma.lbCriterioBusc
        });

        this.btnAceptarEspecialidad = new Ext.Button({
            id: 'btnaceptare',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: idioma.textToolTipAceptar
        });

        this.btnAceptarEspecialidad.on('click', function (btn) {
            onItemClickModeloER();
            self.winEspecialidad.hide();
        });

        this.btnCancelarEspecialidad = new Ext.Button({
            id: 'btncancelare',
            iconCls: 'cancelar',
            text: 'Cancelar',

            tooltip: idioma.textToolTipCancelar
        });

        this.btnCancelarEspecialidad.on('click', function (btn) {
            self.winEspecialidad.hide();
        });

        ////////////// Reporte Proteccion

        this.btnAceptarPeriodo = new Ext.Button({
            id: 'btnaceptarp',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: idioma.textToolTipAceptar,
            handler: function () {
                if (self.dfFHastaPS.getRawValue() && self.dfFHastaPT.getRawValue() && self.dfFDesdePS.getRawValue() && self.dfFDesdePT.getRawValue()) {
                    onItemClickModeloPTSC();
                    self.seleccionPeriodos.hide();
                    //self.seleccionPeriodos.destroy();  
                }
            }
        });

        // this.btnAceptarPeriodo.on('click',function(btn){
        //     onItemClickModeloPTSC();
        //     self.seleccionPeriodos.hide()      
        // });


        this.btnCancelarPeriodo = new Ext.Button({
            id: 'btncancelarp',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: idioma.textToolTipCancelar
        });

        this.btnCancelarPeriodo.on('click', function (btn) {
            self.seleccionPeriodos.hide();
            self.dfFDesdePT.reset();
            self.dfFHastaPT.reset();
            self.dfFDesdePS.reset();
            self.dfFHastaPS.reset();
        });


        this.btnTraslado = new Ext.Toolbar.MenuButton({
            id: 'btnTraslado',
            hidden: true,
            text: 'Traslado',
            tooltip: 'Realizar traslados entre UEBs.',
            iconCls: 'traspaso',
            //disabled: true,
            menu: {
                items: [{
                        text: 'Enviar',
                        iconCls: 'salida',
                        disabled: true,
                        id: 'idTrasladoEnviar'
                    }, {
                        text: 'Confirmar',
                        iconCls: 'entrada',
                        //disabled: true,
                        id: 'idConfirmarTraslado'
                    }]
            }
        });

        this.gpEnvioTrasladoUEB = new Ext.grid.GridPanel({
            store: modelo.stConfigUEB,
            border: false,
            loadMask: {msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Unidades" : "Unidad"]})'
            }),
            columns: [
                {header: '', width: 300, hidden: true, dataIndex: 'entidad'},
                {header: 'Unidad empresarial de base', width: 100, dataIndex: 'estructura'}
            ]
        });

        this.btnAceptarEnvioTraslado = new Ext.Button({
            id: 'btnAceptarEnvioTraslado',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: '',
            disabled: true
        });

        this.btnCancelarEnvioTraslado = new Ext.Button({
            id: 'btnCancelarEnvioTraslado',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: ''
        });

        this.winEnvioTraslado = new Ext.Window({
            title: 'Enviar traslado a UEB',
            closeAction: 'hide',
            constrain: true,
            width: 560,
            height: 400,
            resizable: false,
            layout: 'fit',
            modal: true,
            buttons: [this.btnAceptarEnvioTraslado, this.btnCancelarEnvioTraslado],
            items: [this.gpEnvioTrasladoUEB]
        });

        this.gpConfirmarTrasladoUEB = new Ext.grid.GridPanel({
            store: modelo.stConfirmarTraslados,
            border: false,
            loadMask: {msg: 'Cargando...'},
            columns: [
                {header: 'No. Identidad', width: 100, dataIndex: 'ci'},
                {header: 'Nombre y apellidos', width: 250, dataIndex: 'nombreyapellido'},
                {header: 'Destino', width: 200, dataIndex: 'ueb'}
            ]
        });

        this.btnConfirmarTraslado = new Ext.Button({
            id: 'btnConfirmarTraslado',
            iconCls: 'aprobar',
            text: 'Confirmar',
            tooltip: '',
            disabled: true
        });

        this.btnCancelarConfirmarTraslado = new Ext.Button({
            id: 'btnCancelarConfirmarTraslado',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: ''
        });

        this.winConfirmarTraslado = new Ext.Window({
            title: 'Confirmar traslado a UEB',
            closeAction: 'hide',
            constrain: true,
            width: 560,
            height: 400,
            resizable: false,
            layout: 'fit',
            modal: true,
            buttons: [this.btnConfirmarTraslado, this.btnCancelarConfirmarTraslado],
            items: [this.gpConfirmarTrasladoUEB]
        });

        this.gpSuplementos = new Ext.grid.GridPanel({
            title: 'Listado de suplementos',
            store: modelo.stSuplementos,
            loadMask: {msg: 'Cargando...'},
            columns: [{header: idioma.lbDenominacion, width: 400, dataIndex: 'denominacion'}],
            bbar: new Ext.PagingToolbar({pageSize: 15, store: modelo.stSuplementos, displayInfo: true}),
            keys: [{
                    key: 'd',
                    alt: true,
                    fn: function () {
                        if (!self.btnAceptarS.disabled) {
                            self.btnAceptarS.handler();
                        }
                    }
                }]
        });

        this.btnAceptarS = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'ver',
            text: idioma.lbGuardar,
            tooltip: idioma.textToolTipVer,
            disabled: true
        });

        this.winSuple = new Ext.Window({
            title: idioma.lbWindowS,
            closeAction: 'hide',
            constrain: true,
            width: 560,
            height: 400,
            resizable: false,
            layout: 'fit',
            modal: true,
            buttons: [this.btnAceptarS],
            items: [this.gpSuplementos]
        });

        //Botón para ver contrato y suplemento.
        this.btnVer = new Ext.Toolbar.MenuButton({
            id: 'btnVercontrato',
            hidden: true,
            text: 'Generar',
            tooltip: 'Generar contratos y suplementos',
            iconCls: 'acrobat',
            disabled: true,
            menu: {
                items: [{
                        text: 'Contrato <spam style="color: #a61120">(*.pdf)</spam>',
                        iconCls: 'contratar',
                        id: 'contrato'
                    }, {
                        text: 'Contrato <spam style="color: #2a579a">(*.docx)</spam>',
                        iconCls: 'contratar',
                        id: 'contratoDoc'
                    }, {
                        text: 'Suplementos',
                        iconCls: 'contratar',
                        id: 'suplementos'
                    }]
            }
        });

        this.btnSyncCargos = new Ext.Button({
            iconCls: 'actualizar',
            tooltip: idioma.ttUpdatePlantilla
        });

        this.busquedaDisponibilidad = new Ext.form.Checkbox({
            hideLabel: false,
            id: 'chxDisponibilidad',
            boxLabel: 'Disponibilidad de cargos',
            disabled: false,
            name: 'disponibilidadcargo',
            listeners: {
                check: function () {
                    self.tpEstructura.disponibilidad = Ext.getCmp('chxDisponibilidad').getValue();
                }
            }
        });

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stPersonas,
            width: 130,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.ttipLimpiar,
            toolTipTrigger2: idioma.ttipBuscar,
            emptyText: idioma.lbCriterioBusc
        });

        this.btnDocumentos = new Ext.Toolbar.MenuButton({
            id: 'btnDocumentos',
            text: 'Documentos',
            tooltip: 'Documentos',
            disabled: true,
            iconCls: 'documentos',
            menu: {
                items: [
                    '<b>Resoluci&oacute;n 29/2014 MTSS</b>',
                    {text: '<b>ANEXO No. 1</b> Información de plazas vacantes', iconCls: 'informe', disabled: true, id: 'idbtnanexo1', handler: onItemClickDocument},
                    {text: '<b>ANEXO No. 3</b> Control de trabajadores con m&aacute;s de un contrato', iconCls: 'informe', disabled: true, id: 'idbtnanexo3'},
                    {text: '<b>ANEXO No. 14 B, Inc. a)</b> Registro de datos principales', iconCls: 'informe', disabled: true, id: 'datosprincipales', handler: onItemClick},
                    {text: '<b>ANEXO No. 14 B, Inc. b)</b> Registro de Altas y Bajas', iconCls: 'informe', disabled: true, id: 'altasbajas'},
                    '-',
                    '<b>Resoluci&oacute;n 15/2007 MFP</b>',
                    {text: '<b>SC-4-02</b> Movimiento de n&oacute;minas', iconCls: 'informe', disabled: true, id: 'idbtnbtnReporteMovimientonomina'},
                    '-',
                     '<b>ONEI</b>',
                    {text: 'Modelo No.5205-01', iconCls: 'informe', disabled: true, hidden: false, id: 'idbtnModelo520501', handler: onItemClickModelo},
                    {text: 'Modelo No.5201-06', iconCls: 'informe', disabled: true, hidden: true, id: 'idbtnModelo520106', handler: periodos},
                    {text: 'Modelo No.5202-05', iconCls: 'informe', disabled: true, hidden: true, id: 'idbtnModelo520205', handler: seleccionEVR},
                    '-',
                    '<b>Otros</b>',
                    {text: 'Listado de personas que no cumplen requisitos del cargo', iconCls: 'informe', disabled: false, id: 'btnListadoReqCargos'},
                    {text: 'Listado de Cuadros', iconCls: 'informe', disabled: false, id: 'btnListadoCuadros'},
                    {text: 'Reporte de Cantidad de Plazas Aprobadas y Cubiertas', iconCls: 'informe', disabled: false, id: 'btnPlazasaprobadasyCubiertas'},
                    {text: 'Funciones específicas', iconCls: 'informe', disabled: true, id: 'btnListadoFunciones'},
                    {
                        text: 'Exportar Listado Cargos <spam style="color: #217346">(*.xls)</spam>',
                        iconCls: 'informe',
                        handler: function () {
                            let winload = new Ext.PVD.comun.window.winLoad({
                                title: 'Por favor espere...',
                                mensaje: 'Generando reporte'
                            });
                            let params = Ext.urlEncode({
                                idestructura: self.tpEstructura.tree.getSelectionModel().getSelectedNode().id,
                                estructura: self.tpEstructura.tree.getSelectionModel().getSelectedNode().text,
                                tipo: 2
                            });
                            winload.showMask();
                            window.open('http://' + window.location.host + '\/pvd/movimientoslaborales/index.php/movimientopersona/generarListadoCargos?' + params);
                            winload.hideMask();
                        }.createDelegate(this)
                    }
                ]
            }
        });

        //Botón para exportar
        this.btnExportarFT = new Ext.Toolbar.MenuButton({
            id: 'btnExportarFT',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar',
            hidden: true,
            menu: {
                items: [{
                        text: 'Exportar listado cargos <spam style="color: #217346">(*.xls)</spam>',
                        iconCls: 'informe',
                        id: 'btnlistcargo',
                        handler: function () {
                            let winload = new Ext.PVD.comun.window.winLoad({
                                title: 'Por favor espere...',
                                mensaje: 'Generando reporte'
                            });
                            let params = Ext.urlEncode({
                                idestructura: self.tpEstructura.tree.getSelectionModel().getSelectedNode().id,
                                estructura: self.tpEstructura.tree.getSelectionModel().getSelectedNode().text,
                                tipo: 1
                            });
                            winload.showMask();
                            window.open('http://' + window.location.host + '\/pvd/movimientoslaborales/index.php/movimientopersona/generarListadoCargos?' + params);
                            winload.hideMask();
                        }.createDelegate(this)
                    }, {
                        text: 'Exportar existencia de fuerza de trabajo <spam style="color: #217346">(*.zip)</spam>',
                        iconCls: 'informe',
                        id: 'btnlistexistencia',
                        handler: function () {
                            let winload = new Ext.PVD.comun.window.winLoad({
                                title: 'Por favor espere...',
                                mensaje: 'Generando archivo'
                            });
                            let params = Ext.urlEncode({
                                idestructura: self.tpEstructura.tree.getSelectionModel().getSelectedNode().id
                            });
                            winload.showMask();
                            window.open('http://' + window.location.host + '\/pvd/movimientoslaborales/index.php/movimientopersona/exportarExistenciaFT?' + params);
                            winload.hideMask();
                        }.createDelegate(this)
                    }]
            }
        });

        this.btnImportarExistencia = new Ext.Button({
            disabled: false,
            id: 'btnImportarExistencia',
            tooltip: 'Importar existencia de fuerza de trabajo',
            hidden: true,
            iconCls: 'importar',
            text: 'Importar'
        });

        this.btnCambiarContrato = new Ext.Button({
            id: 'btnCambiarContrato',
            text: 'Cambiar',
            disabled: true,
            hidden: false,
            tooltip: 'Cambiar contrato',
            iconCls: 'cambiar'
        });

        this.btnActualizarMN = new Ext.Button({
            id: 'btnActualizarMN',
            text: 'Actualizar',
            disabled: false,
            tooltip: 'Actualizar movimientos de nóminas con cambios salariales',
            iconCls: 'actualizar'
        });

        this.smselect = new Ext.grid.CheckboxSelectionModel({singleSelect: false});

        function  mostrarFila(val, metaData, record) {
            if (record.get('vencido') === 1) {
                metaData.attr = 'ext:qtip="El contrato de la persona est&aacute; vencido"';
                return '<span style="color:#ff0b3a;"><b>' + val + '</b></span>';
            } else if ((record.get('cantd') <= 30 && record.get('cantd') >= 0) && val != null && record.get('fhasta') != null) {
                let t = record.get('cantd');
                metaData.attr = 'ext:qtip="El contrato vence en ' + t + ' días"';
                return '<span style="color:#ff9e0b;"><b>' + val + '</b></span>';
            } else {
                metaData.attr = 'ext:qtip="Doble click para mostrar ficha de la persona."';
                return val;
            }
        }

        function mostrarArea(val, metaData, record) {
            if (val && record.get('cargo')) {
                return val;
            } else if (val) {
                return '<span style="color:#ff0b3a;"><b>' + 'SIN SITUACIÓN PRINCIPAL' + '</b></span>';
            } else {
                return '<span style="color:#ff0b3a;"><b>' + 'NO ASIGNADO A CARGO' + '</b></span>';
            }
        }
        function renderEstado(val, metaData, record) {
            if (val > 0) {
                metaData.attr = 'ext:qtip="' + 'Sí' + '"';
                metaData.css = 'icondistra-true verde'
            } else {
                metaData.attr = 'ext:qtip="' + 'No' + '"';
                metaData.css = 'icondistra-false rojo'
            }
        }
        this.btnBuscarPorCriterios = new Ext.Button({
            disabled: false,
            text: idioma.textBtnBuscar,
            tooltip: idioma.textBtnBuscar,
            iconCls: 'modificar',
            hidden: true
        });

        this.lbBuscarPers = new Ext.form.Label({
            text: idioma.lbBuscarPer,
            hidden: false
        });


        this.expanderFT = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                    '<div><p><b>Modalidad de empleo: </b>{modalidadempleo}</p>' +
                    '<p><b>Procedencia social: </b>{procedencia}</p>' +
                    '<p><b>Categoría: </b>{categoria}</p>' +
                    '<p><b>No. Alta/Resolución/Orden: </b>{noalta}</p></div>'
                    )
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            this.smselect, /*this.expanderFT,*/
            {header: 'Área', width: 10, hidden: true, dataIndex: 'entidad_area', sortable: false, renderer: mostrarArea},
            {header: idioma.lbNoIdentidad, width: 20, dataIndex: 'numid', sortable: false, renderer: mostrarFila},
            {header: idioma.lbApellidosyNombres, width: 100, sortable: false, dataIndex: 'nombreyapellidos', renderer: mostrarFila},
            {header: idioma.lbSituacion + ' laboral', width: 80, sortable: false, dataIndex: 'situacion', renderer: mostrarFila},
            {header: idioma.lbCargo, width: 100, sortable: false, dataIndex: 'cargo', renderer: mostrarFila},
            {header: 'Tipo de contrato', width: 80, sortable: false, dataIndex: 'tipocontrato', renderer: mostrarFila},
            {header: 'Desde', sortable: false, width: 20, dataIndex: 'fdesde', renderer: mostrarFila},
            {header: 'Hasta', sortable: false, width: 20, dataIndex: 'fhasta', renderer: mostrarFila},
            {header: 'Fecha de alta', sortable: false, width: 20, dataIndex: 'faltaentidad', renderer: mostrarFila},
            {header: 'Principal', sortable: false, width: 200, dataIndex: 'principal', renderer: renderEstado}, //si le pongo un valor mas pequeño en el width no se muestra completo(se aplasta)
        ]);
        this.filtrosgp = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string_adaptado',
                    dataIndex: 'numid',
                    xtype: 'numberfield',
                    idTextField: 'filtrocodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                    strEmptyText: ''
                }, {
                    type: 'string',
                    dataIndex: 'nombreyapellidos'
                }, {
                    type: 'string',
                    dataIndex: 'situacion'
                }, {
                    type: 'string',
                    dataIndex: 'cargo'
                }, {
                    type: 'string',
                    dataIndex: 'tipocontrato'
                }, {
                    type: 'date',
                    dataIndex: 'fdesde'
                }, {
                    type: 'date',
                    dataIndex: 'fhasta'
                }, {
                    type: 'date',
                    dataIndex: 'faltaentidad'
                }, {
                    type: 'list',
                    dataIndex: 'principal',
                    options: [[0, 'No'], [1, 'Sí']]
                }]
        });
        this.btnLimpiarPersonas = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarPersonas',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar',
            handler: function () {
                self.filtrosgp.clearFilters();
            }
        });

        //Listado de personas.
        this.gpPersonas = new Ext.grid.GridPanel({
            region: 'center',
            border: false,
            plugins: [this.expanderFT, this.filtrosgp],
            tbar: [this.lbBuscarPers, this.sfBuscar, ' ', this.btnBuscarPorCriterios, ' ', this.btnLimpiarPersonas],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPersonas,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            sm: this.smselect,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonas,
                displayInfo: true
            })
        });

        modelo.stPersonas.on('beforeload', function(store, options) {
            // Asegura que los filtros actuales se envíen en cada paginación
            options.params = options.params || {};
            if (self.dfFDesde && self.dfFDesde.getValue()) {
                options.params.fdesde = self.dfFDesde.getValue().format('d/m/Y');
            }
            if (self.dfFHasta && self.dfFHasta.getValue()) {
                options.params.fhasta = self.dfFHasta.getValue().format('d/m/Y');
            }
            if (self.cbAnio && self.cbAnio.getValue()) {
                options.params.anio = self.cbAnio.getValue();
            }
            // Agrega otros filtros si es necesario
        });

        //Tipo de contrato
        this.cbTipoContrato = new Ext.form.ComboBox({
            id: 'cbTipoContrato',
            store: modelo.stTipoContrato,
            displayField: 'denominacion',
            valueField: 'idtipocontrato',
            hiddenName: 'idtipocontrato',
            forceSelection: true,
            fieldLabel: idioma.lbTipoContrato,
            typeAhead: true,
            allowBlank: false,
            anchor: '98%',
            width: '98%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: idioma.lbSeleccione,
            editable: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbProcedenciaSocial = new Ext.components.TreeComboBox({
            anchor: '98%',
            allowBlank: false,
            valueField: 'idprocedenciasocial',
            hiddenName: 'idprocedenciasocial',
            fieldLabel: 'Procedencia social',
            emptyText: idioma.lbSeleccione,
            id: 'tcbProcedencia',
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlProcedencia,
                border: false,
                autoScroll: true
            }
        });

        this.tcbSituacion = new Ext.components.TreeComboBox({
            anchor: '98%',
            allowBlank: false,
            emptyText: idioma.lbSeleccione,
            fieldLabel: idioma.lbSitLab,
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlSituacion,
                border: false,
                autoScroll: true
            }
        });

        this.tfNoAlta = new Ext.form.TextField({
            fieldLabel: idioma.lb_NoAlta,
            maxLength: 40,
            anchor: '98%',
            allowBlank: true,
            name: 'numeroacta'
        });

        let fecha = new Date();
        this.dfFDesde = new Ext.form.DateField({
            id: 'dfFDesde',
            fieldLabel: idioma.lbDesde,
            name: 'fdesde',
            hiddenname: 'fdesde',
            value: fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });

        this.dfFHasta = new Ext.form.DateField({
            id: 'dfFHasta',
            fieldLabel: idioma.lbHasta,
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDesde',
            vtype: 'daterange'
        });

        this.tfEntidad = new Ext.form.TextField({
            id: 'tfEntidad',
            fieldLabel: idioma.lbEntidad,
            enableKeyEvents: true,
            anchor: '98%',
            readOnly: true,
            allowBlank: false,
            name: 'entidad'
        });

        this.tfArea = new Ext.form.TextField({
            id: 'tfArea',
            fieldLabel: idioma.lbArea,
            enableKeyEvents: true,
            anchor: '98%',
            readOnly: true,
            allowBlank: true,
            name: 'area'
        });

        this.tfCargo = new Ext.form.TextField({
            id: 'tfCargo',
            fieldLabel: idioma.lbCargo,
            enableKeyEvents: true,
            anchor: '99%',
            readOnly: true,
            allowBlank: true,
            name: 'cargo'
        });

        this.chbPrincipal = new Ext.form.Checkbox({
            id: 'chbPrincipal',
            boxLabel: idioma.lbPrinc,
            hidden: false,
            labelSeparator: '',
            name: 'principal',
            anchor: '98%'
        });

        this.dfFDesdeTit = new Ext.form.DateField({
            id: 'dfFDesdeTit',
            fieldLabel: 'Desde',
            name: 'fdesde',
            hiddenname: 'fdesde',
            //    value     : fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });


        this.dfFHastaTit = new Ext.form.DateField({
            id: 'dfFHastaTit',
            fieldLabel: 'Hasta',
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDesdeTit',
            vtype: 'daterange'
        });

        // Cargos
        this.tcbCargosMod = new Ext.components.TreeComboBox({
            anchor: '98%',
            allowBlank: true,
            fieldLabel: idioma.lbCargo,
            id: 'tcbCargosMod',
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlcargos,
                border: false,
                autoScroll: true
            }
        });

        this.cbCargosEsp = new Ext.form.ComboBox({
            store: modelo.stCargosEsp,
            displayField: 'denominacion',
            valueField: 'id',
            hiddenName: 'id',
            forceSelection: true,
            fieldLabel: 'Especializaci&oacute;n del cargo',
            typeAhead: true,
            allowBlank: true,
            anchor: '98%',
            width: '98%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            editable: false
        });

        this.cbPrograma = new Ext.form.ComboBox({
            store: modelo.stPrograma,
            displayField: 'denominacion',
            valueField: 'idprogramalaboral',
            hiddenName: 'idprogramalaboral',
            forceSelection: true,
            fieldLabel: 'Programa laboral',
            typeAhead: true,
            allowBlank: true,
            anchor: '98%',
            width: '98%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            editable: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbProgramaM = new Ext.form.ComboBox({
            store: modelo.stProgramaM,
            displayField: 'denominacion',
            valueField: 'idprogramalaboral',
            fieldLabel: 'Programa laboral',
            allowBlank: true,
            anchor: '98%',
            width: '98%',
            mode: 'local',
            emptyText: 'Seleccione...',
            editable: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            nextTab: 'cbTipoContrato',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.textbtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            nextTab: 'cbTipoContrato',
            iconCls: 'guardar',
            tooltip: idioma.textToolTipGuardar,
            text: '<u>G</u>uardar',
            listeners: {
                'enable': function () {
                    self.btnCancelar.nextTab = 'btnAceptar';
                },
                'disable': function () {
                    self.btnCancelar.nextTab = 'cbTipoContrato';
                }
            }
        });

        this.cbModalidadEmpleo = new Ext.form.ComboBox({
            store: modelo.stModalidadEmpleo,
            displayField: 'denominacion',
            valueField: 'idmodalidadempleo',
            hiddenName: 'idmodalidadempleo',
            fieldLabel: 'Modalidad de empleo',
            forceSelection: true,
            allowBlank: true,
            typeAhead: true,
            triggerAction: 'all',
            anchor: '98%',
            width: '98%',
            mode: 'local',
            emptyText: 'Seleccione...',
            editable: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.fpAlta = new Ext.FormPanel({
            labelAlign: 'top',
            margins: '5px 5px 5px 5px',
            border: false,
            region: 'center',
            frame: true,
            autoHeight: false,
            autoScroll: true,
            items: [
                {
                    layout: 'column',
                    border: 'false',
                    items: [
                        {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [this.cbTipoContrato]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [this.tcbSituacion]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [this.cbProcedenciaSocial]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [this.tfNoAlta]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [this.dfFDesde]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [this.dfFHasta]
                        }, {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.tfEntidad]
                        }, {
                            columnWidth: 1.0,
                            layout: 'form',
                            id: 'tfarea',
                            items: [this.tfArea]
                        }, {
                            columnWidth: 0.9,
                            layout: 'form',
                            id: 'tf',
                            hidden: true,
                            items: [this.tfCargo]
                        }, {
                            columnWidth: 0.1,
                            layout: 'form',
                            items: [this.chbPrincipal]
                        }, {
                            columnWidth: 0.9,
                            layout: 'form',
                            id: 'tc',
                            hidden: true,
                            items: [this.tcbCargosMod]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            id: 'tch',
                            hidden: true,
                            items: [this.cbCargosEsp]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [this.cbPrograma]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [this.cbModalidadEmpleo]
                        }
                    ]
                }
            ]
        });

        this.tafunciones = new Ext.form.TextArea({
            fieldLabel: 'Funciones del cargo',
            name: 'funciones',
            anchor: '99%',
            height: 100,
            hiddenname: 'funciones',
            maxLength: 1000,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            allowBlank: true
        });

        this.tabPanelAlta = new Ext.TabPanel({
            region: 'center',
            margins: '0 5 5 0',
            height: '100%',
            width: '70%',
            border: false,
            defaults: {autoScroll: true},
            activeTab: 0,
            items: [
                {
                    title: 'Datos generales',
                    autoScroll: true,
                    layout: 'fit',
                    items: [this.fpAlta]
                }, {
                    title: 'Funciones en el cargo',
                    autoScroll: true,
                    layout: 'fit',
                    items: [this.tafunciones]
                }
            ]
        });

        this.winAlta = new Ext.Window({
            title: idioma.msgdarAlta,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            width: 800,
            height: 410,
            closable: false,
            layout: 'fit',
            modal: true,
            buttons: [this.btnCancelar, this.btnAceptar],
            items: [this.tabPanelAlta]
        });

        this.pPersonas = new Ext.Panel({
            layout: 'border',
            region: 'center',
            tbar: [this.btnAlta, this.btnMovimiento, this.btnCambiarContrato, this.btnBaja, this.btnTraslado, '-', this.btnModificar, /*this.btnEliminar,*/ this.btnVer, this.btnDocumentos, this.btnExportarFT, this.btnImportarExistencia, this.btnActualizarMN, '->', this.btnAyuda],
            border: false,
            items: [this.gpPersonas]
        });

        this.pPersonasHistorico = new Pvd.Movimientoslaborales.GestMovLab.PanelHistorico({idioma: idioma});

        this.pProblemasDetectados = new Pvd.Movimientoslaborales.GestMovLab.PanelProblemasDetectados({idioma: idioma});

        this.tabPanel = new Ext.TabPanel({
            region: 'center',
            margins: '0 5 5 0',
            height: '100%',
            width: '70%',
            border: false,
            defaults: {autoScroll: true},
            activeTab: 0,
            disabled: true,
            items: [
                {
                    title: idioma.lbActual,
                    id: 'actual',
                    autoScroll: true,
                    layout: 'fit',
                    tabTip: idioma.lbActual,
                    items: [this.pPersonas]
                }, this.pPersonasHistorico, /*this.pPersonasReserva, this.pTrabInterruptos,
                 this.pTrabDisponibles,*/ this.pProblemasDetectados
            ]
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            excluirConceptos: [9],
            inicial: perfil.idestructuracomun,
            disponibilidadCargo: true,
            disponibilidad: false,
            split: true,
            region: 'center'
        });
        // Componentes de la Ventana dar baja

        // Motivo de baja
        this.tcbMotivoBaja = new Ext.components.TreeComboBox({
            anchor: '98%',
            allowBlank: false,
            emptyText: idioma.lbSeleccione,
            fieldLabel: idioma.lbMotivobaja,
            id: 'tcbMotivoBaja',
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlMotivoBaja,
                border: false,
                autoScroll: true
            }
        });
        // Fecha de baja
        this.dfHasta = new Ext.form.DateField({
            name: 'dfHasta',
            fieldLabel: 'Fecha fin',
            anchor: '98%',
            format: 'd/m/Y',
            editable: true,
            readOnly: false,
            allowBlank: false,
            value: fecha.format('d/m/Y')
        });

        this.fpDarBaja = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            trackResetOnLoad: true,
            items: [
                {
                    layout: 'form',
                    border: 'false',
                    items: [this.tcbMotivoBaja, this.dfHasta]
                }
            ]
        });

        this.btnAceptarBaja = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.btnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        this.btnCancelarBaja = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.textbtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });

        this.winDarBaja = new Ext.Window({
            title: idioma.msgdarBaja,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            width: 300,
            height: 180,
            layout: 'fit',
            modal: true,
            buttons: [this.btnCancelarBaja, this.btnAceptarBaja],
            items: [this.fpDarBaja]
        });

        this.btnAceptarMovimiento = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.btnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        this.btnCancelarMovimiento = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.textbtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });
        // Cargos
        this.tcbCargos = new Ext.components.TreeComboBox({
            anchor: '99%',
            allowBlank: false,
            emptyText: idioma.lbSeleccione,
            fieldLabel: idioma.lbNewCargo,
            id: 'tcbCargos',
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlcargos,
                border: false,
                autoScroll: true
            }
        });

        this.cbCargosEspMov = new Ext.form.ComboBox({
            store: modelo.stCargosEspMov,
            displayField: 'denominacion',
            valueField: 'id',
            hiddenName: 'id',
            forceSelection: true,
            fieldLabel: 'Especializaci&oacute;n del cargo',
            typeAhead: true,
            allowBlank: true,
            anchor: '99%',
            width: '99%',
            mode: 'local',
            disabled: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            editable: false
        });

        this.cbTipoContratoM = new Ext.form.ComboBox({
            store: modelo.stTipoContrato,
            displayField: 'denominacion',
            valueField: 'idtipocontrato',
            hiddenName: 'idtipocontrato',
            forceSelection: true,
            fieldLabel: idioma.lbTipoContrato,
            typeAhead: true,
            allowBlank: false,
            anchor: '98%',
            width: '98%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: idioma.lbSeleccione,
            editable: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.tcbSituacionM = new Ext.components.TreeComboBox({
            anchor: '98%',
            allowBlank: false,
            emptyText: idioma.lbSeleccione,
            fieldLabel: idioma.lbSitLab,
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlSituacion,
                border: false,
                autoScroll: true
            }
        });

        this.dfFDesdeM = new Ext.form.DateField({
            id: 'dfFDesdeM',
            fieldLabel: idioma.lbDesde,
            name: 'fdesde',
            hiddenname: 'fdesde',
            value: fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });

        this.dfFHastaM = new Ext.form.DateField({
            id: 'dfFHastaM',
            fieldLabel: idioma.lbHasta,
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDesdeM',
            vtype: 'daterange'
        });

        this.tfNoAltaM = new Ext.form.TextField({
            fieldLabel: idioma.lb_NoAlta,
            maxLength: 19,
            anchor: '98%',
            allowBlank: true,
            name: 'numeroacta'
        });

        // Motivo movimiento
        this.tcbMotivoMovimiento = new Ext.components.TreeComboBox({
            anchor: '98%',
            allowBlank: false,
            fieldLabel: idioma.lbMotMov,
            emptyText: idioma.lbSeleccione,
            id: 'tcbMotivoMovimiento',
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlMotivoMovimiento,
                border: false,
                autoScroll: true
            }
        });

        this.cbModalidadEmpleoM = new Ext.form.ComboBox({
            store: modelo.stModalidadEmpleo,
            displayField: 'denominacion',
            valueField: 'idmodalidadempleo',
            fieldLabel: 'Modalidad de empleo',
            allowBlank: true,
            anchor: '99%',
            width: '99%',
            mode: 'local',
            emptyText: 'Seleccione...',
            editable: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.fpMovimiento = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            trackResetOnLoad: true,
            items: [
                {
                    layout: 'column',
                    border: 'false',
                    items: [
                        {columnWidth: 1.0, layout: 'form', items: [this.tcbCargos]},
                        {columnWidth: 0.5, layout: 'form', items: [this.cbCargosEspMov]},
                        {columnWidth: 0.5, layout: 'form', items: [this.cbTipoContratoM]},
                        {columnWidth: 0.5, layout: 'form', items: [this.tcbSituacionM]},
                        {columnWidth: 0.5, layout: 'form', items: [this.cbModalidadEmpleoM]},
                        {columnWidth: 0.5, layout: 'form', items: [this.dfFDesdeM]},
                        {columnWidth: 0.5, layout: 'form', items: [this.dfFHastaM]},
                        {columnWidth: 0.5, layout: 'form', items: [this.tfNoAltaM]},
                        {columnWidth: 0.5, layout: 'form', items: [this.tcbMotivoMovimiento]},
                        {columnWidth: 1.0, layout: 'form', items: [this.cbProgramaM]}
                    ]
                }
            ]
        });

        this.tafuncionesM = new Ext.form.TextArea({
            fieldLabel: 'Funciones del cargo',
            name: 'funciones',
            width: '99%',
            height: 100,
            hiddenname: 'funciones',
            maxLength: 1000,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            allowBlank: true
        });

        this.tabPanelMov = new Ext.TabPanel({
            region: 'center',
            margins: '0 5 5 0',
            height: '100%',
            width: '70%',
            border: false,
            defaults: {autoScroll: true},
            activeTab: 0,
            items: [
                {
                    title: 'Datos generales',
                    autoScroll: true,
                    layout: 'fit',
                    items: [this.fpMovimiento]
                }, {
                    title: 'Funciones en el cargo',
                    autoScroll: true,
                    layout: 'fit',
                    items: [this.tafuncionesM]
                }
            ]
        });

        this.winMovimiento = new Ext.Window({
            title: idioma.msgRealizarMov,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            width: 600,
            height: 394,
            layout: 'fit',
            modal: true,
            buttons: [this.btnCancelarMovimiento, this.btnAceptarMovimiento],
            items: [this.tabPanelMov]
        });

        //Actualizar tipo de contrato
        this.cbTipoContratoCC = new Ext.form.ComboBox({
            store: modelo.stTipoContrato,
            displayField: 'denominacion',
            valueField: 'idtipocontrato',
            hiddenName: 'idtipocontrato',
            forceSelection: true,
            fieldLabel: idioma.lbTipoContrato,
            typeAhead: true,
            allowBlank: false,
            anchor: '98%',
            width: '98%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: idioma.lbSeleccione,
            editable: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.tcbSituacionCC = new Ext.components.TreeComboBox({
            anchor: '98%',
            allowBlank: false,
            emptyText: idioma.lbSeleccione,
            fieldLabel: idioma.lbSitLab,
            treeConfig: {
                rootVisible: false,
                loader: modelo.tlSituacion,
                border: false,
                autoScroll: true
            }
        });

        this.lbDesde = new Ext.form.Label({
            text: 'Desde: ',
            hidden: false
        });
        this.lbHasta = new Ext.form.Label({
            text: 'Hasta : ',
            hidden: false
        });

        this.dfFDesdeCC = new Ext.form.DateField({
            id: 'dfFDesdeCC',
            fieldLabel: idioma.lbDesde,
            name: 'fdesde',
            hiddenname: 'fdesde',
            value: fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });

        this.dfFHastaCC = new Ext.form.DateField({
            id: 'dfFHastaCC',
            fieldLabel: idioma.lbHasta,
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDesdeM',
            vtype: 'daterange'
        });

        this.fpActContrato = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            trackResetOnLoad: true,
            items: [
                {
                    layout: 'column',
                    border: 'false',
                    items: [
                        {columnWidth: 0.5, layout: 'form', items: [this.cbTipoContratoCC]},
                        {columnWidth: 0.5, layout: 'form', items: [this.tcbSituacionCC]},
                        {columnWidth: 0.5, layout: 'form', items: [this.dfFDesdeCC]},
                        {columnWidth: 0.5, layout: 'form', items: [this.dfFHastaCC]}
                    ]
                }
            ]
        });

        this.btnAceptarCC = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.btnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        this.btnCancelarCC = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.textbtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });

        this.winCC = new Ext.Window({
            title: 'Actualizar contrato',
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            width: 600,
            height: 180,
            layout: 'fit',
            modal: true,
            buttons: [this.btnCancelarCC, this.btnAceptarCC],
            items: [this.fpActContrato]
        });


        this.plantillaCompletamiento = new Ext.XTemplate(
                '<table style="border-collapse: collapse; background-color: #dfe8f6;">',
                '<tr>',
                '<td width="10px" />',
                '<td colspan=2><div class="text"><b>Plantilla:</b> </div></td>',
                '<td colspan=2 align="right"><div class="text">{plantilla} </div></td>',
                '<td width="10px" />',
                '</tr>',
                '<tr>',
                '<td width="10px" />',
                '<td colspan=2><div class="text"><b>Indeterminados:</b></div></td>',
                '<td colspan=2 align="right"><div class="text">{indeterminados} </div></td>',
                '</tr>',
                '<tr>',
                '<td width="10px" />',
                '<td colspan=2><div class="text"><b>Determinados:</b></div></td>',
                '<td colspan=2 align="right"><div class="text">{determinados} </div></td>',
                '</tr>',
                '<tr>',
                '<td width="10px" />',
                '<td colspan=2><div class="total"><b>Total:</b></div></td>',
                '<td colspan=2 align="right"><div class="total"><b>{total} </b></div></td>',
                '<td width="10px" />',
                '</tr>',
                '<tr>',
                '<td width="10px" />',
                '<td colspan=2><div class="total"><b>Porciento:</b></div></td>',
                '<td colspan=2 align="right"><div class="total"><b>{porciento} </b></div></td>',
                '<td width="10px" />',
                '</tr>',
                '</table>',
                '<br/>'
                );
        //Panel Completamiento
        this.pCompletamiento = new Ext.Panel({
            title: 'Resumen de la plantilla',
            //layout: 'fit',
            region: 'south',
            height: 120,
            frame: true,
            items: [this.plantillaCompletamiento]
        });

        this.dfFDCuad = new Ext.form.DateField({
            id: 'dfFDCuad',
            fieldLabel: idioma.lbDesde,
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });

        this.dfFHCuad = new Ext.form.DateField({
            id: 'dfFHCuad',
            fieldLabel: idioma.lbHasta,
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDCuad',
            vtype: 'daterange'
        });

        new Ext.Viewport({
            layout: 'border',
            items: [
                {
                    region: 'west',
                    xtype: 'panel',
                    id: 'east-panel',
                    autoHeight: false,
                    split: true,
                    width: '30%',
                    border: false,
                    collapsible: true,
                    title: idioma.titleEstructura,
                    layout: 'border',
                    items: [this.tpEstructura, this.pCompletamiento]
                },
                this.tabPanel
            ]
        });

        function onItemClickDocument() {
            let node = self.tpEstructura.tree.getSelectionModel().getSelectedNode();
            let idestructura = node.id;
            let idconcepto = (node.attributes.idtipo) ? node.attributes.idtipo : node.attributes.idconcepto;
            let params = Ext.urlEncode({idestructura: idestructura, idconcepto: idconcepto});
            let idIframe = Ext.id();

            new Ext.Window({
                title: 'Información de plazas vacantes',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarPlazasVac?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

        function onItemClick() {
            let node = self.tpEstructura.tree.getSelectionModel().getSelectedNode();
            let idestructura = node.id;
            let idconcepto = (node.attributes.idtipo) ? node.attributes.idtipo : node.attributes.idconcepto;
            let params = Ext.urlEncode({
                tiporeporte: 2,
                idestructura: idestructura,
                idconcepto: idconcepto
            });
            let idIframe = Ext.id();

            new Ext.Window({
                title: 'Registro de trabajadores',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarPdfReportes?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de trabajadores.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

        function onItemClickModelo() {
            let node = self.tpEstructura.tree.getSelectionModel().getSelectedNode();
            let idestructura = node.id;
            let idconcepto = (node.attributes.idtipo) ? node.attributes.idtipo : node.attributes.idconcepto;
            let params = Ext.urlEncode({idestructura: idestructura, idconcepto: idconcepto});
            let idIframe = Ext.id();

            new Ext.Window({
                title: 'Modelo No. 5205-01',
                width: 800,
                height: 500,
                id: 'winreporte',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarReporteModelo?' + params
                    }
                }
            }).show();
            Ext.getCmp('winreporte').maximize();
            PVD.mostrarMascara('repmodelo1', 'Por favor espere...', 'Generando reporte');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('repmodelo1');
            }
        }

        function periodos() {
            self.seleccionPeriodos.show();

        }

        this.dfFDesdePT = new Ext.form.DateField({
            id: 'dfFDesdePT',
            fieldLabel: 'Trimestre desde ',
            name: 'dfFDesdePT',
            // value     : fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });

        this.dfFHastaPT = new Ext.form.DateField({
            id: 'dfFHastaPT',
            fieldLabel: 'Trimestre hasta ',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDesdePT',
            vtype: 'daterange'
        });

        this.dfFDesdePS = new Ext.form.DateField({
            id: 'dfFDesdePS',
            fieldLabel: 'Semestre desde ',
            // value     : fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });

        this.dfFHastaPS = new Ext.form.DateField({
            id: 'dfFHastaPS',
            fieldLabel: 'Semestre hasta ',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDesdePS',
            vtype: 'daterange'
        });

        this.seleccionPeriodos = new Ext.Window({
            title: 'Período a Buscar',
            width: 260,
            height: 300,
            id: 'winperiodo',
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [
                new Ext.FormPanel({
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
                                {columnWidth: .99, layout: 'form', items: [self.dfFDesdePT]},
                                {columnWidth: .99, layout: 'form', items: [self.dfFHastaPT]},
                                {columnWidth: .99, layout: 'form', items: [self.dfFDesdePS]},
                                {columnWidth: .99, layout: 'form', items: [self.dfFHastaPS]}
                            ]
                        }],
                    buttons: [self.btnCancelarPeriodo, self.btnAceptarPeriodo],
                })
            ],
            listeners: {
                show: function () {
                    self.dfFDesdePT.reset();
                    self.dfFHastaPT.reset();
                    self.dfFDesdePS.reset();
                    self.dfFHastaPS.reset();
                }
            }

        })

        function onItemClickModeloPTSC() {
            let node = self.tpEstructura.tree.getSelectionModel().getSelectedNode();
            let idestructura = node.id;
            let idconcepto = (node.attributes.idtipo) ? node.attributes.idtipo : node.attributes.idconcepto;
            let iniciot = self.dfFDesdePT.getRawValue();
            let fint = self.dfFHastaPT.getRawValue();
            let inicios = self.dfFDesdePS.getRawValue();
            let fins = self.dfFHastaPS.getRawValue();
            let params = Ext.urlEncode({
                idestructura: idestructura,
                idconcepto: idconcepto,
                iniciot: iniciot,
                fint: fint,
                inicios: inicios,
                fins: fins
            });
            let idIframe = Ext.id();

            new Ext.Window({
                title: 'Modelo No. 5201-06',
                width: 800,
                height: 500,
                id: 'winreporte',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarReporteModeloPTSC?' + params
                    }
                }
            }).show();
            Ext.getCmp('winreporte').maximize();
            PVD.mostrarMascara('repmodelo1', 'Por favor espere...', 'Generando reporte');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('repmodelo1');
            }
        }

        function  ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('estado') == "Abierto" && val != null) {
                return '<span style="color:#0000ff;">' + val + '</span>';
            } else if (record.get('estado') == "Cerrado" && val != null) {
                return '<span style="color:green;">' + val + '</span>';
            } else {
                return '<span style="color:red;">' + val + '</span>';
            }
            return val;
        }

        function seleccionEVR() {
            self.seleccionER.show();

        }
        this.dfFDesdeSelecc = new Ext.form.DateField({
            id: 'dfFDesdeSelecc',
            fieldLabel: 'Desde',
            name: 'fdesde',
            hiddenname: 'fdesde',
            //    value     : fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange'
        });

        this.dfFHastaSelecc = new Ext.form.DateField({
            id: 'dfFHastaSelecc',
            fieldLabel: 'Hasta',
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDesdeSelecc',
            vtype: 'daterange'
        });

        this.seleccionER = new Ext.Window({
            title: 'Período a Buscar',
            width: 250,
            height: 300,
            id: 'winseleccion',
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [
                new Ext.FormPanel({
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
                                {columnWidth: .99, layout: 'form', items: [self.dfFDesdeSelecc]},
                                {columnWidth: .99, layout: 'form', items: [self.dfFHastaSelecc]},
                                {columnWidth: .99, layout: 'form', items: [self.dfFDesdeTit]},
                                {columnWidth: .99, layout: 'form', items: [self.dfFHastaTit]}


                            ]
                        }],
                    buttons: [self.btnCancelarSeleccion, self.btnAceptarSeleccion],
                })
            ],
            listeners: {
                show: function () {
                    self.dfFDesdeSelecc.reset();
                    self.dfFHastaSelecc.reset();
                    self.dfFDesdeTit.reset();
                    self.dfFHastaTit.reset();
                }
            }
        })


        // especialidad
        this.smEspecialidad = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.rowEspecialidad = new Ext.grid.RowNumberer();

        this.gpEspecialidad = new Ext.grid.GridPanel({
            region: 'center',
            store: modelo.stEspecialidad,
            border: false,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smEspecialidad,
                this.rowEspecialidad,
                {
                    header: 'id',
                    width: 50,
                    dataIndex: 'idespecialidad',
                    hidden: true
                },
                {
                    header: 'Especialidad',
                    width: 850,
                    dataIndex: 'denespecialidad'
                },
            ],
            sm: this.smEspecialidad,
            tbar: [this.lbBuscarEspecialidad, this.sfBuscarEspecialidad, this.btnSincronizar]

        });



        this.pEspecialidad = new Ext.Panel({
            layout: 'border',
            region: 'center',
            tbar: [],
            border: false,
            items: [this.gpEspecialidad]
        });


        this.winEspecialidad = new Ext.Window({
            title: 'Resúmen de Títulos',
            width: 650,
            height: 550,
            id: 'winespecialidad',
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            border: false,
            layout: 'fit',
            modal: true,
            buttons: [this.btnCancelarEspecialidad, this.btnAceptarEspecialidad],
            items: [this.pEspecialidad]

        });



        function onItemClickModeloER() {
            let node = self.tpEstructura.tree.getSelectionModel().getSelectedNode();
            let idestructura = node.id;
            let fdesde = self.dfFDesdeSelecc.getRawValue();
            let fhasta = self.dfFHastaSelecc.getRawValue();
            let idconcepto = (node.attributes.idtipo) ? node.attributes.idtipo : node.attributes.idconcepto;
            let semi = self.dfFDesdeTit.getRawValue();
            let semf = self.dfFHastaTit.getRawValue();
            let idesp = Array();
            let seleccionados = self.gpEspecialidad.getSelectionModel().getSelections();
            Ext.each(seleccionados, function (rec) {
                idesp.push(rec.get('idespecialidad'));
            });
            console.info(seleccionados);
            let params = Ext.urlEncode({
                idestructura: idestructura,
                idconcepto: idconcepto,
                fdesde: fdesde,
                fhasta: fhasta,
                semi: semi,
                semf: semf,
                idesp: Ext.encode(idesp)
            });
            let idIframe = Ext.id();

            new Ext.Window({
                title: 'Modelo No. 5202-05',
                width: 800,
                height: 500,
                id: 'winreporte',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarReporteModeloER?' + params
                    }
                }
            }).show();
            Ext.getCmp('winreporte').maximize();
            PVD.mostrarMascara('repmodelo1', 'Por favor espere...', 'Generando reporte');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('repmodelo1');
            }
        }

        this.btnCancelarF = new Ext.Button({
            id: 'btncancelarw',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: idioma.textToolTipCancelar
        });

        this.btnAceptarF = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: idioma.textToolTipAceptar,
            handler: function () {
                let tipo = 2;
                let titulo = 'trabajadores';
                let node = self.tpEstructura.tree.getSelectionModel().getSelectedNode();
                let idestructura = node.id;
                let idconcepto = (node.attributes.idtipo) ? node.attributes.idtipo : node.attributes.idconcepto;
                let params = Ext.urlEncode({
                    tiporeporte: tipo,
                    idestructura: idestructura,
                    idconcepto: idconcepto,
                    aprueba: self.cbAp.getRawValue(),
                    elabora: self.cbElb.getRawValue()
                });
                let idIframe = Ext.id();
                new Ext.Window({
                    title: 'Registro de ' + titulo,
                    width: 800,
                    height: 500,
                    id: 'winregistro',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrain: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarPdfReportes?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winregistro').maximize();
                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de ' + titulo + '.');
                document.getElementById(idIframe).onload = function () {
                    PVD.ocultarMascara('rep01');
                }
            }
        });

        this.cbElb = new Ext.form.ComboBox({
            store: modelo.stElaborado,
            displayField: 'nombreapellidos',
            valueField: 'idpersona',
            forceSelection: true,
            fieldLabel: ' Elaborado por',
            allowBlank: false,
            anchor: '100%',
            width: '100%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            editable: false
        });

        this.cbAp = new Ext.form.ComboBox({
            store: modelo.stAprobado,
            displayField: 'nombreapellidos',
            valueField: 'idpersona',
            forceSelection: true,
            fieldLabel: ' Aprobado  por',
            typeAhead: true,
            allowBlank: false,
            anchor: '100%',
            width: '100%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            editable: false
        });

        this.wdFirmas = new Ext.Window({
            id: 'wdReg',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            title: 'Firmas',
            width: 500,
            height: 190,
            items: [
                new Ext.FormPanel({
                    labelAlign: 'top',
                    frame: true,
                    width: 500,
                    height: 190,
                    items: [{
                            layout: 'column',
                            items: [
                                {columnWidth: 0.5, layout: 'form', items: [self.cbElb]},
                                {columnWidth: 0.5, layout: 'form', items: [self.cbAp]}
                            ]
                        }]
                })
            ],
            buttons: [this.btnCancelarF, this.btnAceptarF]
        });
    }
};

UCID.portal.cargarEtiquetas('movimientopersona', function (perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Pvd.Fuerzatrabajo.Movimientoslaborales.Modelo;
    modelo.init();

    var vista = Pvd.Fuerzatrabajo.Movimientoslaborales.Vista;
    vista.init(idioma, modelo);

    Pvd.Fuerzatrabajo.Movimientoslaborales.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.frameElement.id);
});