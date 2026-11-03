/*
 * Gestionar recién graduado.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionarreciengraduado
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Gestionarreciengraduado');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Capacitacion.Gestionarreciengraduado.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        this.elemento = 0;
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            tooltip: idioma.textToolTipAyuda,
            text: idioma.BtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            //disabled: true,
            id: 'btnAdicionar',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
            hidden: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificar,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminar,
            iconCls: 'eliminar',
            hidden: true
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            inicial: perfil.idestructuracomun,
            split: true,
            region: 'center'
        });

        this.smselect = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            this.smselect,{
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'area',
                sortable : false
            },
            {
                header: 'No. de identidad',
                width: 120,
                dataIndex: 'numid',
                sortable : false
            },
            {
                header: 'Nombre y apellidos',
                width: 250,
                sortable : false,
                dataIndex: 'nombreyapellidos'
            },
            {
                header: 'Fecha fin del servicio social',
                width: 150,
                sortable : false,
                dataIndex: 'fhastass'
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stRecienGraduados,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        //Listado de personas.
        this.gpReciengraduado = new Ext.grid.GridPanel({
            title: 'Listado de reci&eacute;n graduados',
            region: 'north',
            height: 550,
            split: true,
            sm: this.smselect,
            border: false,
            tbar: ['Buscar persona: ', this.sfBuscar],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stRecienGraduados,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stRecienGraduados,
                displayInfo: true
            })
        });

        //Botón para adicionar extensión.
        this.btnAdicionarExt = new Ext.Button({
            //disabled: true,
            id: 'btnAdicionarExt',
            text: idioma.BtnAdicionar,
            tooltip: 'Adicionar extensi&oacute;n de preparaci&oacute;n <b>(Alt+I)</b>',
            iconCls: 'adicionar',
            hidden: true
        });

        //Botón para eliminar extensión.
        this.btnEliminarExt = new Ext.Button({
            id: 'btnEliminarExt',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: 'Eliminar extensi&oacute;n de preparaci&oacute;n <b>(DEL)</b>',
            iconCls: 'eliminar',
            hidden: true
        });

        this.gpExtensiones = new Ext.grid.GridPanel({
            id: 'gpExtensiones',
            title   : 'Extensiones de preparaci&oacute;n',
            tbar    : [this.btnAdicionarExt, this.btnEliminarExt],
            store   : modelo.stExtensiones,
            loadMask: {msg: 'Cargando ...'},
            columns : [
                {
                    header   : 'Desde',
                    width    : 100,
                    dataIndex: 'fextension'
                },
                {
                    header   : 'Hasta',
                    width    : 100,
                    dataIndex: 'fhasta'
                },
                {
                    header   : 'Tiempo (meses)',
                    width    : 100,
                    dataIndex: 'tiempo'
                }
            ]
        });

        // Componentes para adicionar y modificar candidatos

        this.tfRecienGraduado = new Ext.form.TriggerField({
            id: 'tfRecienGraduado',
            displayField: 'nombreyapellidos',
            disabled: true,
            valueField: 'idpersona',
            triggerClass: 'x-form-search-trigger',
            onTriggerClick: function (e) {
                if (!self.tfRecienGraduado.disabled) {
                    self.elemento = 1;
                    self.windPersonas.show();
                    var node1 = self.tpEstructura.tree.getSelectionModel().getSelectedNode();
                    if (node1.attributes.idconcepto == 7) {
                        modelo.stPersonas.baseParams.idcargo = node1.id;
                        modelo.stPersonas.baseParams.idestructura = null;
                    } else {
                        modelo.stPersonas.baseParams.idcargo = null;
                        modelo.stPersonas.baseParams.idestructura = node1.id;
                    }
                    modelo.stPersonas.load({params: {start: 0, limit: 15, query: self.sfBuscarPer.getValue()}});
                    self.windPersonas.setTitle('Seleccionar reci&eacute;n graduado');
                    self.gpPersonas.getSelectionModel().clearSelections();
                }
            }.createDelegate(this),
            selectOnFocus: true,
            readOnly: true,
            allowBlank: false,
            fieldLabel: 'Nombre y apellidos',
            anchor: '99%',
            emptyText: 'Seleccione...'
        });

        this.tcbCargosJefe = new Ext.components.TreeComboBox({
            anchor    : '99%',
            allowBlank: false,
            fieldLabel: 'Jefe inmediato',
            id        : 'tcbCargosMod',
            treeConfig: {
                rootVisible: false,
                loader     : modelo.tlcargos,
                border     : false,
                autoScroll : true
            }
        });

        this.tfTutor = new Ext.form.TriggerField({
            id: 'tfTutor',
            displayField: 'tutor',
            valueField: 'idtutor',
            triggerClass: 'x-form-search-trigger',
            onTriggerClick: function (e) {
                self.elemento = 2;
                self.windPersonas.show();
                var node1 = self.tpEstructura.tree.getSelectionModel().getSelectedNode();
                if (node1.attributes.idconcepto == 7) {
                    modelo.stPersonas.baseParams.idcargo = node1.id;
                    modelo.stPersonas.baseParams.idestructura = null;
                } else {
                    modelo.stPersonas.baseParams.idcargo = null;
                    modelo.stPersonas.baseParams.idestructura = node1.id;
                }
                modelo.stPersonas.load({params: {start: 0, limit: 15, query: self.sfBuscarPer.getValue()}});
                self.windPersonas.setTitle('Seleccionar tutor');
                self.gpPersonas.getSelectionModel().clearSelections();
            }.createDelegate(this),
            selectOnFocus: true,
            readOnly: true,
            allowBlank: false,
            fieldLabel: 'Tutor',
            anchor: '99%',
            emptyText: 'Seleccione...'
        });

        this.nfPeriodoPrep = new Ext.form.NumberField({
            id: 'nfPeriodoPrep',
            fieldLabel: 'Tiempo de preparaci&oacute;n (meses)',
            minLength: 1,
            maxLength: 2,
            allowBlank: false,
            enableKeyEvents: true,
            allowDecimals: false,
            minValue: 6,
            maxValue: 24,
            width: '99%',
            name: 'tiempo'
        });

        var fecha = new Date();
        this.dfFechaIP = new Ext.form.DateField({
            fieldLabel: 'Fecha inicio de preparaci&oacute;n',
            value: fecha.format('d/m/Y'),
            name: 'fdesde',
            allowBlank: false,
            hiddenname:'fdesde',
            anchor:'98%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            vtype:'daterange'
        });

        this.dfFechaFSS = new Ext.form.DateField({
            fieldLabel: 'Fecha fin del servicio social',
            name: 'fhastass',
            allowBlank: false,
            hiddenname:'fhastass',
            anchor:'98%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            vtype:'daterange'
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tfRecienGraduado]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tcbCargosJefe]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tfTutor]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.nfPeriodoPrep]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFechaIP]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFechaFSS]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            //nextTab: 'tfRecienGraduado',
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'tfRecienGraduado',
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 340,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfRecienGraduado.focus(true, 500);
                }
            }
        });

        this.sfBuscarPer = new Ext.app.SearchField({
            store: modelo.stPersonas,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        this.gpPersonas = new Ext.grid.GridPanel({
            //title   : 'Listado de personas',
            tbar: ['Buscar persona: ', this.sfBuscarPer],
            store   : modelo.stPersonas,
            loadMask: {msg: 'Cargando ...'},
            columns : [
                {
                    header   : 'No. identidad',
                    width    : 100,
                    dataIndex: 'numid'
                }, {
                    header   : 'Nombre y apellidos',
                    width    : 300,
                    dataIndex: 'nombreyapellidosorden'
                }
            ],
            bbar    : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stPersonas,
                displayInfo: true
            })
        });

        //Ventana con el listado de personas
        this.windPersonas= new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 450,
            height: 320,
            items: [this.gpPersonas]
        });


        this.plantillaDatos = new Ext.XTemplate(
            '<table style="border-collapse: collapse; background-color: #dfe8f6;">',
            '<tr><td height="10px" /></tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Jefe inmediato:</b> {jefeinmediato} </div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Tutor:</b> {tutor} </div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Fecha inicio de preparaci&oacute;n:</b> {fdesde} </div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Fecha fin de preparaci&oacute;n:</b> {ffinprep} </div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Tiempo de preparaci&oacute;n:</b> {tiempo} </div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Periodo de evaluaci&oacute;n:</b> {periodo} </div></td>',
            '<td width="10px" />',
            '</tr>',
            '<tr><td height="10px" /></tr>',
            '</table>',
            '<br/>'
        );
        //Panel datos
        this.pDatos = new Ext.Panel({
            id: 'pDatos',
            title : 'Otros datos',
            layout: 'fit',
            height: 100,
            frame : true,
            items : [this.plantillaDatos]
        });

        //Botón para adicionar.
        this.btnAdicionarPer = new Ext.Button({
            id: 'btnAdicionarPer',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarPer,
            iconCls: 'adicionar'
        });

        this.btnModificarPer = new Ext.Button({
            id: 'btnModificarPer',
            text: idioma.BtnModificar,
            tooltip: idioma.lbBtnModificarPer,
            iconCls: 'modificar'
        });

        //Botón para eliminar.
        this.btnEliminarPer = new Ext.Button({
            id: 'btnEliminarPer',
            text: idioma.BtnEliminar,
            //disabled: true,
            tooltip: idioma.lbBtnEliminarPer,
            iconCls: 'eliminar'
        });

        this.btnIndicador = new Ext.Toolbar.MenuButton({
            text: 'Indicadores',
            tooltip: 'Indicadores',
            iconCls: 'indicadores',
            menu: {
                items: [
                    {
                        text: 'Adicionar',
                        iconCls: 'adicionar',
                        id: 'idbtnaddind'
                    },
                    {
                        text: 'Evaluar',
                        iconCls: 'evaluar',
                        disabled: true,
                        id: 'idbtnevalind'
                    }
                ]
            }
        });

        this.btnExportarEval = new Ext.Button({
            id: 'btnExportarEval',
            text: '<u>E</u>xportar',
            tooltip: 'Exportar evaluaci&oacute;n del reci&eacute;n graduado',
            iconCls: 'exportar'
        });


        this.columnasgpPer = new Ext.grid.ColumnModel([
            {
                header: 'Denominaci&oacute;n del periodo',
                width: 300,
                dataIndex: 'denominacion',
                sortable: false
            },
            {
                header: 'Fecha inicio',
                width: 100,
                dataIndex: 'fdesde',
                sortable: false
            },
            {
                header: 'Fecha fin',
                width: 100,
                dataIndex: 'fhasta',
                sortable: false
            }
        ]);

        this.smselectper = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        //Listado de periodos del recién graduado.
        this.gpPeriodosRG = new Ext.grid.EditorGridPanel({
            id: 'pPeriodos',
            sm: this.smselectper,
            title: 'Evaluación',
            tbar: [this.btnAdicionarPer, this.btnModificarPer, this.btnEliminarPer, this.btnIndicador, this.btnExportarEval],
            region: 'center',
            border: false,
            height: 200,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPeriodosRG,
            autoScroll: true,
            cm: this.columnasgpPer
        });

        this.pTareas = new Pvd.Capacitacion.Gestionaraccidentes.PanelTareas({idioma: idioma});

        this.tabPanel = new Ext.TabPanel({
            region: 'center',
            disabled: true,
            margins: '0 0 0 0',
            height: '30%',
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.pDatos, this.gpExtensiones, this.gpPeriodosRG, this.pTareas],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

        var fecha = new Date();
        this.dfFechaExt = new Ext.form.DateField({
            fieldLabel: 'Fecha inicio',
            value: fecha.format('d/m/Y'),
            name: 'fdesde',
            allowBlank: false,
            hiddenname:'fdesde',
            anchor:'98%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            vtype:'daterange'
        });

        this.nfTiempo = new Ext.form.NumberField({
            id: 'nfTiempo',
            fieldLabel: 'Tiempo (meses)',
            allowBlank: false,
            minLength: 1,
            maxLength: 2,
            enableKeyEvents: true,
            allowDecimals: false,
            minValue: 1,
            maxValue: 12,
            width: '99%',
            name: 'tiempoext'
        });

        //Formulario de add ext.
        this.formAddExt = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFechaExt]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.nfTiempo]
                    }]
            }]
        });

        this.btnCancelarExt = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarExt = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        //Ventana de add extensión.
        this.windAddExtension = new Ext.Window({
            title: 'Adicionar extensi&oacute;n de preparaci&oacute;n',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 150,
            items: [this.formAddExt],
            buttons: [
                this.btnCancelarExt,
                this.btnAceptarExt
            ],
            listeners: {
                'beforeshow': function()
                {
                }
            }
        });

        this.cbEvaluacion = new Ext.form.ComboBox({
            store: modelo.stValores,
            anchor: '98%',
            height: 100,
            hiddenName: 'idvalor',
            displayField: 'valor',
            valueField: 'idvalor',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            listeners: {
                select: function (v) {
                    var idrgperiodo = self.gpPeriodosRG.getSelectionModel().getSelected().data.idrgperiodo;
                    var idrgindicador = self.gpIndicadoresRG.getSelectionModel().getSelected().data.idrgindicador;
                    Ext.Ajax.request({
                        url: 'updateIndicador',
                        params: {
                            idrgindicador: idrgindicador,
                            idrgperiodo: idrgperiodo,
                            idvalorescala: v.getValue()
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                mostrarMensaje(1, 'La evaluación ha sido guardada satisfactoriamente');
                            } else {
                                mostrarMensaje(6, 'Ocurrió un error mientras se guardaban los datos.');
                            }
                            modelo.stIndRG.reload();
                        }
                    });
                    v.setValue(v.getRawValue());
                }
            }
        });

        this.smselectindrg = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.columnasgpind = new Ext.grid.ColumnModel([
            this.smselectindrg,
            {
                header: 'Denominaci&oacute;n',
                width: 300,
                dataIndex: 'indicador',
                sortable: false
            },
            {
                header: 'Evaluaci&oacute;n',
                width: 80,
                dataIndex: 'valor',
                editor: this.cbEvaluacion,
                sortable: false
            }
        ]);

        //Listado de indicadores del recién graduado.
        this.gpIndicadoresRG = new Ext.grid.EditorGridPanel({
            id: 'pIndicadores',
            clicksToEdit: 1,
            sm: this.smselectindrg,
            region: 'center',
            border: false,
            height: 200,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stIndRG,
            autoScroll: true,
            cm: this.columnasgpind
        });

        this.btnCancelarInd = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarInd = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.windAddIndRG = new Ext.Window({
            title: 'Adicionar indicador',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 420,
            height: 350,
            items: [this.gpIndicadoresRG],
            buttons: [
                this.btnCancelarInd,
                this.btnAceptarInd
            ]
        });

        //Adicionar periodo

        this.tfdenom = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            allowBlank: false,
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            anchor: '99%',
            name: 'denominacion'
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFIniciop',
            fieldLabel: 'Fecha inicio',
            allowBlank: false,
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor: '97%',
            format: 'd/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            vtype: 'daterange',
        });

        this.dfFFin = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '97%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: false,
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFIniciop',
            vtype: 'daterange',
        });

        //Formulario de gestion.
        this.formAddPeriodo = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.dfFInicio]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.dfFFin]
                    }]
            }]
        });

        this.btnCancelarp = new Ext.Button({
            nextTab: 'tfdenomp',
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar,
            handler: function () {
                self.formAddPeriodo.getForm().reset();
                self.winAddPer.hide();
            }.createDelegate(this)
        });

        this.btnAceptarp = new Ext.Button({
            nextTab: 'tfdenomp',
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar,
            listeners: {
                'enable': function () {
                    self.btnCancelar.nextTab = 'btnAplicarp';
                },
                'disable': function () {
                    self.btnCancelar.nextTab = 'tfdenomp';
                }
            },
            handler: function () {
                //guardarDatosPer('ACP');
            }.createDelegate(this)
        });

        this.btnAplicarp = new Ext.Button({
            id: 'btnAplicarp',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar,
            handler: function () {
                //guardarDatosPer('APL');
            }.createDelegate(this)
        });

        this.winAddPer = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 180,
            items: [this.formAddPeriodo],
            buttons: [
                this.btnCancelarp,
                this.btnAplicarp,
                this.btnAceptarp
            ],
            listeners: {
                'beforeshow': function () {
                    self.tfdenom.focus(true, 500);
                },
                'hide': function () {
                    self.btnAdicionarPer.focus();
                    self.formAddPeriodo.getForm().reset();
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnCancelarp.disabled) {
                        self.btnCancelarp.handler();
                    }
                }
            },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarp.disabled) {
                            self.btnAplicarp.handler();
                        }
                    }
                },
                {
                    key: 13,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarp.disabled) {
                            self.btnAceptarp.handler();
                        }
                    }
                }]
        });

        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items: [
                {region: 'west',
                    xtype: 'panel',
                    id: 'east-panel',
                    autoHeight: false,
                    split: true,
                    width: '25%',
                    border: false,
                    collapsible: true,
                    title: 'Estructura organizativa',
                    layout: 'fit',
                    items: [this.tpEstructura]
                },
                {region: 'center',
                    xtype: 'panel',
                    id: 'center-panel',
                    autoHeight: false,
                    split: true,
                    width: '75%',
                    border: false,
                    layout: 'border',
                    tbar: [/*this.btnAdicionar, */this.btnModificar, this.btnEliminar, '->', this.btnAyuda],
                    items: [this.gpReciengraduado, this.tabPanel]
                }
            ]
        });

    }
}
;

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarreciengraduado', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Capacitacion.Gestionarreciengraduado.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Capacitacion.Gestionarreciengraduado.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Capacitacion.Gestionarreciengraduado.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});