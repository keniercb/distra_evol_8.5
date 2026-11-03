/*
 * Componente Historico.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Movimientoslaborales
 * @uses Pvd.Movimientoslaborales.GestMovLab.PanelHistorico
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Movimientoslaborales.GestMovLab');
Pvd.Movimientoslaborales.GestMovLab.PanelHistorico = Ext.extend(Ext.Panel, {
    layout: 'fit',
    border: false,
    id: 'historico',
    title: 'Hist&oacute;rico',
    region: 'center',
    height: '100%',
    initComponent: function () {
        var self = this;
        var perhist = null;
        var objseleccionadas = null;

        //Fuente de datos del listado de personas histórico.
        this.stPersonasHistorico = new Ext.data.GroupingStore({
            url: 'getHistorico',
            reader: new Ext.data.JsonReader(
                    {root: "datos", id: "idsituacionlaboralp", totalProperty: "cantidad"},
                    [{name: 'idpersona'}, {name: 'motivo'}, {name: 'entidad'}, {name: 'informacion'}, {name: 'idsituacion'}, {name: 'situacion'}, {name: 'idsituacionlaboralp'},
                        {name: 'cargo'}, {name: 'fdesde'}, {name: 'fhasta'}, {name: 'estado'}, {name: 'nombreyapellidos'}, {name: 'numid'}, {name: 'entidad_area'}, {name: 'p'},
                        {name: 'idcargo'}, {name: 'identidad'}]
                    ),
            sortInfo: {
                field: 'p',
                direction: "ASC"
            },
            remoteGroup: true,
            groupField: 'entidad_area',
            listeners: {
                'load': function () {
                    Ext.getCmp('idbtnbtnReporteMovNomHist').disable();
                }
            }
        });

        this.dfFInicioBuscar = new Ext.form.DateField({
            id: 'dfFInicioBuscar',
            fieldLabel: 'Desde',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            endDateField: 'dfFFinBuscar',
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            emptyText: 'Fecha inicio...',
        });

        this.dfFInicioBuscar.on('valid', function (n, m, o) {
            if (self.btnBuscarHist.disabled) {
                self.btnBuscarHist.enable();
            }
            if (self.btnLimpiarHist.disabled) {
                self.btnLimpiarHist.enable();
            }
        });

        this.dfFFinBuscar = new Ext.form.DateField({
            id: 'dfFFinBuscar',
            fieldLabel: 'Hasta',
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFInicioBuscar',
            emptyText: 'Fecha fin...',
        });

        this.dfFFinBuscar.on('valid', function (n, m, o) {
            if (self.btnBuscarHist.disabled) {
                self.btnBuscarHist.enable();
            }
            if (self.btnLimpiarHist.disabled) {
                self.btnLimpiarHist.enable();
            }
        });

        this.sfBuscarHistorico = new Ext.app.SearchField({
            width: 130,
            store: self.stPersonasHistorico,
            emptyText: self.idioma.lbCriterioBusc,
            toolTipTrigger1: self.idioma.ttipLimpiar,
            toolTipTrigger2: self.idioma.ttipBuscar
        });

        this.stEstado = new Ext.data.SimpleStore({
            fields: ['id', 'denom'],
            data: [
                [1, 'Movimiento'],
                [2, 'Baja'],
                [3, 'Cambio de contrato']
            ]
        });

        this.tlMotivo = new Ext.tree.TreeLoader({
            dataUrl: 'getMotivoBaja',
            preloadChildren: false
        });

        this.tcbMotivo = new Ext.components.TreeComboBox({
            width: 130,
            disabled: true,
            //emptyText: 'Motivo',
            fieldLabel: 'Motivo',
            treeConfig: {
                rootVisible: false,
                loader: this.tlMotivo,
                border: false,
                autoScroll: true
            }
        });

        this.tcbMotivo.emptyText = 'Motivo...';

        this.cbEstado = new Ext.form.ComboBox({
            store: this.stEstado,
            displayField: 'denom',
            valueField: 'id',
            hiddenName: 'id',
            forceSelection: true,
            typeAhead: true,
            hidden: false,
            width: 130,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Estado...',
            editable: true,
            fieldLabel: 'Estado',
            listeners: {
                select: {
                    fn: function (sm, record) {
                        if (self.btnBuscarHist.disabled) {
                            self.btnBuscarHist.enable();
                        }
                        if (self.btnLimpiarHist.disabled) {
                            self.btnLimpiarHist.enable();
                        }
                        self.tcbMotivo.reset();
                        self.tcbMotivo.clearValue();
                        if (record.data.id == 3) {
                            self.tcbMotivo.disable();
                        } else {
                            self.tcbMotivo.enable();
                            self.tlMotivo.dataUrl = (record.data.id == 2) ? 'getMotivoBaja' : 'getMotivoMovimiento';
                            self.tcbMotivo.tree.getLoader().load(self.tcbMotivo.tree.getRootNode());
                        }
                    }
                }
            }
        });

        //Botón para Buscar.
        this.btnBuscarHist = new Ext.Button({
            //text: this.self.idioma.BtnBuscar,
            tooltip: self.idioma.ttipBuscar,
            disabled: false,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stPersonasHistorico.load({params: {
                        query: self.sfBuscarHistorico.getValue(),
                        desde: self.dfFInicioBuscar.getRawValue(),
                        hasta: self.dfFFinBuscar.getRawValue(),
                        estado: self.cbEstado.getValue(),
                        motivo: self.tcbMotivo.getValue(),
                        start: 0,
                        limit: self.stPersonasHistorico.lastOptions.params.limit}});
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiarHist = new Ext.Button({
            text: self.idioma.BtnLimpiar,
            tooltip: self.idioma.ttipLimpiar,
            //            disabled: true,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.sfBuscarHistorico.reset();
                self.dfFInicioBuscar.reset();
                self.dfFFinBuscar.reset();
                self.cbEstado.reset();
                self.tcbMotivo.clearValue();
                self.stPersonasHistorico.load({params: {start: 0, limit: self.stPersonasHistorico.lastOptions.params.limit}});
                //                self.btnLimpiarHist.disable();
                self.filtrosPersonasHistorico.clearFilters();
            }.createDelegate(this)
        });

        //Boton para modificar motivo.
        this.btnModificarMot = new Ext.Button({
            id: 'btnModificarMot',
            hidden: false,
            //text: self.idioma.BtnModificar,
            disabled: true,
            tooltip: 'Modificar motivo',
            iconCls: 'modificar',
            handler: function ()
            {
                var urlm = 'getMotivoBaja';
                if (self.gpPersonasHistorico.getSelectionModel().getSelected().data.estado == 1) {
                    urlm = 'getMotivoMovimiento'
                }
                this.tlMotivo = new Ext.tree.TreeLoader({
                    dataUrl: urlm,
                    preloadChildren: false
                });
                this.tcbMotivo = new Ext.components.TreeComboBox({
                    anchor: '98%',
                    allowBlank: false,
                    emptyText: self.idioma.lbSeleccione,
                    fieldLabel: 'Motivo',
                    treeConfig: {
                        rootVisible: false,
                        loader: self.tlMotivo,
                        border: false,
                        autoScroll: true
                    }
                });
                this.fpMm = new Ext.FormPanel({
                    labelAlign: 'top',
                    frame: true,
                    autoHeight: true,
                    trackResetOnLoad: true,
                    items: [
                        {
                            layout: 'form',
                            border: 'false',
                            items: [this.tcbMotivo]
                        }
                    ]
                });

                this.btnAceptarMm = new Ext.Button({
                    iconCls: 'aceptar',
                    text: self.idioma.btnAceptar,
                    tooltip: self.idioma.textToolTipAceptar,
                    handler: function ()
                    {
                        Ext.Ajax.request({
                            url: 'updMotivo',
                            params: {
                                idsituacionlaboralp: self.gpPersonasHistorico.getSelectionModel().getSelected().data.idsituacionlaboralp,
                                idmotivo: self.tcbMotivo.getValue()
                            },
                            callback: function () {
                            },
                            success: function (r) {
                                var responseData = Ext.decode(r.responseText);
                                if (responseData) {
                                    mostrarMensaje(1, 'El motivo ha sido modificado satisfactoriamente.');
                                    self.stPersonasHistorico.load(
                                            {
                                                params: {
                                                    query: self.sfBuscarHistorico.getValue(),
                                                    desde: self.dfFInicioBuscar.getRawValue(),
                                                    hasta: self.dfFFinBuscar.getRawValue(),
                                                    estado: self.cbEstado.getValue(),
                                                    motivo: self.tcbMotivo.getValue(),
                                                    start: 0,
                                                    limit: self.stPersonasHistorico.lastOptions.params.limit
                                                }
                                            });
                                    self.winMm.close();
                                }
                            }
                        });
                    }
                });

                this.btnCancelarMm = new Ext.Button({
                    iconCls: 'cancelar',
                    text: self.idioma.textbtnCancelar,
                    tooltip: self.idioma.textToolTipCancelar,
                    handler: function ()
                    {
                        self.winMm.close();
                    }
                });

                this.winMm = new Ext.Window({
                    title: 'Modificar motivo',
                    closeAction: 'hide',
                    constrain: true,
                    resizable: false,
                    width: 300,
                    height: 125,
                    layout: 'fit',
                    modal: true,
                    buttons: [this.btnCancelarMm, this.btnAceptarMm],
                    items: [this.fpMm]
                });
                this.winMm.show();
            }.createDelegate(this)
        });

        //Botón para exportar.
        var exphistexcel;
        this.btnExportarHist = new Ext.Toolbar.MenuButton({
            id: 'btnExportarHist',
            //text    : 'Exportar',
            tooltip: 'Exportar reporte histórico',
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Exportar relación de cargos histórico <spam style="color: #a61120">(*.pdf)</spam>',
                        iconCls: 'informe',
                        id: 'histpdf',
                        handler: function ()
                        {
                            self.winRepHist.show();
                            self.fpRepHist.getForm().reset();
                            self.stFacultad.load();
                            self.stCategOcup.load();
                            exphistexcel = 2;
                        }.createDelegate(this)
                    },
                    {
                        text: 'Exportar relación de cargos histórico <spam style="color: #0a56c8">(*.xls)</spam>',
                        iconCls: 'informe',
                        id: 'histexcel',
                        handler: function ()
                        {
                            self.winRepHist.show();
                            self.fpRepHist.getForm().reset();
                            self.stFacultad.load();
                            self.stCategOcup.load();
                            exphistexcel = 1;
                        }.createDelegate(this)
                    },
                    '-',
                    '<b>Resoluci&oacute;n 15/2007 MFP</b>',
                    {
                        text: '<b>SC-4-01</b> Movimiento de n&oacute;minas',
                        iconCls: 'informe',
                        disabled: true,
                        id: 'idbtnbtnReporteMovNomHist'
                    }
                ]
            }
        });

        function mostrarFila(val, metaData) {
            metaData.attr = 'ext:qtip="Doble click para mostrar ficha de la persona."';
            return val;
        }

        function mostrarBaja(val, metaData) {
            metaData.attr = 'ext:qtip="Doble click para mostrar ficha de la persona."';
            if (val == 2) {
                return '<span>Baja</span>';
            } else if (val == 1) {
                return '<span>Movimiento</span>';
            } else if (val == 3) {
                return '<span>Cambio de contrato</span>';
            }
        }

        this.smselectHist = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.filtrosPersonasHistorico = new Ext.grid.GridFilters({
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
                    type: 'date',
                    dataIndex: 'fdesde'
                }, {
                    type: 'date',
                    dataIndex: 'fhasta'
                }
            ]
        });

        //Listado de personas.
        this.gpPersonasHistorico = new Ext.grid.GridPanel({
            region: 'center',
            border: false,
            loadMask: {msg: 'Cargando...'},
            store: self.stPersonasHistorico,
            plugins: this.filtrosPersonasHistorico,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            sm: this.smselectHist,
            columns: [
                {
                    header: 'Entidad',
                    width: 100,
                    hidden: true,
                    dataIndex: 'entidad_area',
                    renderer: function (v) {
                        return v;
                    }
                },
                {
                    header: self.idioma.lbNoIdentidad,
                    width: 80,
                    dataIndex: 'numid',
                    sortable: false,
                    renderer: mostrarFila
                },
                {
                    header: self.idioma.lbApellidosyNombres,
                    width: 160,
                    sortable: false,
                    dataIndex: 'nombreyapellidos',
                    renderer: mostrarFila
                },
                {
                    header: self.idioma.lbSituacion,
                    width: 130,
                    dataIndex: 'situacion',
                    renderer: mostrarFila
                },
                {
                    header: self.idioma.lbCargo,
                    width: 180,
                    dataIndex: 'cargo',
                    renderer: mostrarFila
                },
                {
                    header: 'Estado',
                    width: 80,
                    dataIndex: 'estado',
                    renderer: mostrarBaja
                },
                {
                    header: 'Motivo',
                    width: 130,
                    dataIndex: 'motivo',
                    renderer: mostrarFila
                },
                {
                    header: 'Desde',
                    width: 100,
                    dataIndex: 'fdesde',
                    renderer: mostrarFila
                },
                {
                    header: 'Hasta',
                    width: 100,
                    dataIndex: 'fhasta',
                    renderer: mostrarFila
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: self.stPersonasHistorico,
                displayInfo: true
            })
        });

        this.gpPersonasHistorico.getSelectionModel().on('rowselect', function () {
            perhist = self.gpPersonasHistorico.getSelectionModel().getSelected().data;
            objseleccionadas = self.gpPersonasHistorico.getSelectionModel().getSelections();
            Ext.getCmp('idbtnbtnReporteMovNomHist').enable();
            if (perhist.estado != 3) {
                self.btnModificarMot.enable();
            } else {
                self.btnModificarMot.disable();
            }
        });

        this.gpPersonasHistorico.getSelectionModel().on('rowdeselect', function () {
            Ext.getCmp('idbtnbtnReporteMovNomHist').disable();
            self.btnModificarMot.disable();
        });

        this.tbar = [this.sfBuscarHistorico, ' ', this.cbEstado, ' ', this.tcbMotivo, ' ', this.dfFInicioBuscar, ' ',
            this.dfFFinBuscar, this.btnBuscarHist, this.btnLimpiarHist, '-', this.btnModificarMot, '-', this.btnExportarHist];

        this.items = [this.gpPersonasHistorico];

        this.stPersonasHistorico.on('beforeload', function (store, options) {
            options.params.estado = self.cbEstado.getValue();
            options.params.motivo = self.tcbMotivo.getValue();
            options.params.desde = self.dfFInicioBuscar.getRawValue();
            options.params.hasta = self.dfFFinBuscar.getRawValue();
            options.params.query = self.sfBuscarHistorico.getValue();
        });

        this.cbEstado.on('select', function (combo, record) {
            self.stPersonasHistorico.load({
                params: {
                    query: self.sfBuscarHistorico.getValue(),
                    desde: self.dfFInicioBuscar.getRawValue(),
                    hasta: self.dfFFinBuscar.getRawValue(),
                    estado: record.data.id,
                    motivo: self.tcbMotivo.getValue(),
                    start: 0,
                    limit: 15
                }
            });
        });

        this.stPersonasHistorico.filter([
            {
                property: 'estado',
                value: self.cbEstado.getValue()
            }
        ]);

        this.stCategOcup = new Ext.data.Store({
            url: 'getCatOcup',
            reader: new Ext.data.JsonReader(
                    {root: "", id: "idcategocup"},
                    [{name: 'idcategocup'}, {name: 'denominacion'}, {name: 'descripcion'}]
                    )
        });

        this.cbCategOcup = new Ext.ux.form.LovCombo({
            store: this.stCategOcup,
            displayField: 'denominacion',
            fieldLabel: 'Categoría ocupacional',
            mode: 'local',
            allowBlank: true,
            anchor: '98%',
            hiddenName: 'idcategocup',
            typeAhead: true,
            enableQtip: true,
            triggerAction: 'all',
            editable: true,
            emptyText: 'Seleccione...',
            listeners: {
                render: function (combo) {
                    this.triggers[1].remove();
                },
                beforeselect: function (combo, record, index) {
                    this.valueField = 'idcategocup';
                },
                blur: function () {
                    this.valueField = 'idcategocup';
                    this.isValid();
                    if (this.getRawValue() != '') {
                        this.clearInvalid();
                    }
                }
            }
        });

        this.stFacultad = new Ext.data.Store({
            url: 'getCargosNomencladorTodos',
            reader: new Ext.data.JsonReader(
                    {root: "", id: "idcargo"},
                    [{name: 'idcargo'}, {name: 'denominacion'}, {name: 'descripcion'}]
                    )
        });

        this.cbFacultad = new Ext.form.ComboBox({
            store: this.stFacultad,
            displayField: 'denominacion',
            valueField: 'idcargo',
            hiddenName: 'idcargo',
            forceSelection: true,
            fieldLabel: 'Facultad',
            typeAhead: true,
            allowBlank: true,
            anchor: '98%',
            width: '98%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: self.idioma.lbSeleccione,
            editable: true,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.chbDecesorio = new Ext.form.Checkbox({
            id: 'chbDecesorio',
            boxLabel: 'Decisorio',
            hideLabel: true,
            labelSeparator: '',
            name: 'decisorio',
            anchor: '98%'
        });

        var fecha = new Date();
        this.dfFDHist = new Ext.form.DateField({
            id: 'dfFDHist',
            fieldLabel: self.idioma.lbDesde,
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

        this.dfFHHist = new Ext.form.DateField({
            id: 'dfFHHist',
            fieldLabel: self.idioma.lbHasta,
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            value: fecha.format('d/m/Y'),
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: false,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFDHist',
            vtype: 'daterange'
        });

        this.fpRepHist = new Ext.FormPanel({
            labelAlign: 'top',
            margins: '5px 5px 5px 5px',
            border: false,
            region: 'center',
            frame: true,
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    border: 'false',
                    items: [
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [this.cbCategOcup]
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [this.cbFacultad]
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [this.dfFDHist]
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [this.dfFHHist]
                        }, {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.chbDecesorio]
                        }
                    ]
                }
            ]
        });

        this.btnCancelarFH = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: self.idioma.textToolTipCancelar,
            text: self.idioma.textbtnCancelar,
            handler: function ()
            {
                self.winRepHist.hide();
            }.createDelegate(this)
        });

        this.btnAceptarFH = new Ext.Button({
            iconCls: 'aceptar',
            text: self.idioma.btnAceptar,
            tooltip: self.idioma.textToolTipAceptar,
            handler: function ()
            {
                var params = Ext.urlEncode({
                    idestructura: self.idnode,
                    idcategocup: self.cbCategOcup.getValue(),
                    categocup: self.cbCategOcup.getRawValue(),
                    idfacultad: self.cbFacultad.getValue(),
                    facultad: self.cbFacultad.getRawValue(),
                    decisorio: (self.chbDecesorio.getValue() == true) ? 1 : 0,
                    fdesde: self.dfFDHist.getRawValue(),
                    fhasta: self.dfFHHist.getRawValue(),
                    excel: exphistexcel
                });
                self.winRepHist.hide();
                var idIframe = Ext.id();

                if (exphistexcel == 1) {
                    var winload = new Ext.PVD.comun.window.winLoad({
                        title: 'Por favor espere...',
                        mensaje: 'Generando reporte'
                    });

                    winload.showMask();
                    window.open('http://' + window.location.host + '\/pvd/movimientoslaborales/index.php/movimientopersona/generarRepHistorico?' + params);
                    winload.hideMask();
                } else {
                    new Ext.Window({
                        title: 'Reporte de cargos',
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
                                src: document.location.protocol + '//' + document.location.host +
                                        '/pvd/movimientoslaborales/index.php/movimientopersona/generarRepHistorico?' + params
                            }
                        }
                    }).show();
                    Ext.getCmp('winreporte').maximize();
                    PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
                    document.getElementById(idIframe).onload = function () {
                        PVD.ocultarMascara('rep01');
                    }
                }
            }.createDelegate(this)
        });

        this.winRepHist = new Ext.Window({
            title: 'Seleccionar filtros',
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            width: 500,
            height: 210,
            closable: true,
            layout: 'fit',
            modal: true,
            buttons: [this.btnCancelarFH, this.btnAceptarFH],
            items: [this.fpRepHist]
        });

        Ext.getCmp('idbtnbtnReporteMovNomHist').on('click', function () {
            var acmn;
            var datosper = new Array();
            Ext.each(objseleccionadas, function (rec) {
                if (rec.data.estado == 1 || rec.data.estado == 3) {
                    acmn = 3;
                } else if (rec.data.estado == 2) {
                    acmn = 2;
                }
                datosper.push({
                    idpersona: rec.data.idpersona,
                    idestructura: rec.data.identidad,
                    idsl: rec.data.idsituacionlaboralp,
                    idcargo: rec.data.idcargo,
                    hist: 1,
                    accion: acmn
                });
            });
            var params = Ext.urlEncode({
                datos: Ext.encode(datosper)
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Movimiento de nómina',
                width: 800,
                height: 500,
                id: 'winmovimientonomina',
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
                        src: document.location.protocol + '//' + document.location.host +
                                '/pvd/movimientoslaborales/index.php/movimientopersona/exportarMovimientonomina?' + params
                    }
                }
            }).show();
            Ext.getCmp('winmovimientonomina').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte de movimiento de nómina');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        });

        this.keys = [
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnBuscarHist.disabled) {
                        self.btnBuscarHist.handler();
                    } else if (self.sfBuscarHistorico.getValue() != '') {
                        self.sfBuscarHistorico.onTrigger2Click();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnLimpiarHist.disabled) {
                        self.btnLimpiarHist.handler();
                    } else if (self.sfBuscarHistorico.getValue() != '') {
                        self.sfBuscarHistorico.onTrigger1Click();
                    }
                }
            }];

        Pvd.Movimientoslaborales.GestMovLab.PanelHistorico.superclass.initComponent.call(this);
    }
});
