/*
 *Certificar competencias.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Certificarcompetencias
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Competencia.Certificarcompetencias');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Competencia.Certificarcompetencias.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            tooltip: idioma.textToolTipAyuda,
            text: idioma.BtnAyuda
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            inicial: perfil.idestructuracomun,
            split: true,
            region: 'center'
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            {
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'entidad_area',
                sortable : false
            },
            {
                header: 'No. de identidad',
                width: 150,
                dataIndex: 'numid',
                sortable : false
            },
            {
                header: 'Apellidos y nombres',
                width: 350,
                sortable : false,
                dataIndex: 'nombreyapellidos'
            },
            {
                header: 'Cargo',
                width: 300,
                sortable : false,
                dataIndex: 'cargo'
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stPersonas,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        //Listado de personas.
        this.gpPersonas = new Ext.grid.GridPanel({
            title: 'Listado de trabajadores',
            region: 'north',
            height: 400,
            border: true,
            tbar: ['Buscar trabajador: ', this.sfBuscar, '->', this.btnAyuda],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPersonas,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            split: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonas,
                displayInfo: true
            })
        });

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Certifi&oacute;n:</b> {certificacion}</p><br>'
            )
        });

        function getAgrup(value) {
            if (value == 1) {
                return 'Competencias del cargo'
            } else {
                return 'Otras';
            }
        }

        function certificado(val, metaData) {
            if(val == 1) {
                return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
            } else if (val == 2) {
                metaData.attr = 'ext:qtip="La competencia tiene la certificacion vencida."';
                return '<span style="color: #d10811;">' + '&#10004;' + '</span>';
            } else {
                metaData.attr = 'ext:qtip="La competencia no est&aacute; certificada."';
            }
        }

        this.expanderComc = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>DATOS DE LA CERTIFICACIÓN:</b></p><p><b>Desde:</b> {fdesdec}</p>' +
                '<p><b>Hasta:</b> {fhastac}</p><p><b>Proceso:</b> {proceso}</p><p><b>Periodo:</b> {periodo}</p>'
            )
        });

        this.columnasgpcomp = new Ext.grid.ColumnModel([
            this.expanderComc,
            {
                header: 'Competencia',
                width: 250,
                dataIndex: 'competencia',
                sortable : false
            },
            {
                header: 'Fecha inicio',
                width:100,
                dataIndex: 'fdesde'
            } ,
            {
                header: 'Fecha fin',
                width:100,
                dataIndex: 'fhasta'
            },
            {
                header: 'Evaluaci&oacute;n',
                width: 80,
                sortable : false,
                dataIndex: 'valor'
            },
            {
                header: 'Certificada',
                width: 80,
                align: 'center',
                sortable : false,
                dataIndex: 'certificacionactiva',
                renderer: certificado
            },
            {
                width: 80,
                hidden: true,
                sortable : false,
                dataIndex: 'cargo',
                renderer: getAgrup
            }
        ]);

        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarComp,
            iconCls: 'adicionar'
        });

        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.BtnModificar,
            tooltip: idioma.lbBtnModificarComp,
            iconCls: 'modificar'
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarComp,
            iconCls: 'eliminar'
        });

        this.btnCertificar = new Ext.Button({
            id: 'btnCertificar',
            text: 'Certificar',
            disabled: true,
            tooltip: 'Certificar competencias',
            iconCls: 'certificacion'
        });

        //Listado de competencias lab.
        this.gpComp = new Ext.grid.GridPanel({
            id: 'gpComp',
            split: true,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Competencias" : "Competencia"]})'
            }),
            disabled: true,
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnCertificar],
            title: 'Listado de competencias',
            region: 'center',
            border: true,
            plugins: this.expanderComc,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stCompetencia,
            autoScroll: true,
            cm: this.columnasgpcomp
        });

        this.smselectCC = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicio',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            allowBlank: false,
            readOnly : true,
            maxValue: '31/12/2100',
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.dfFFin = new Ext.form.DateField({
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFInicio',
            vtype:'daterange'
        });

        this.cbEvaluacion = new Ext.form.ComboBox({
            store: modelo.stValores,
            anchor: '98%',
            height: 100,
            name:'idvalor',
            hiddenName:'idvalor',
            displayField: 'valor',
            valueField: 'idvalor',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            listeners: {
                select: function(combo, r) {
                    self.gpCompCargo.getSelectionModel().getSelected().set('idvalor', combo.getValue());
                    combo.setValue(combo.getRawValue());
                }
            }
        });

        function formatDateD(value) {
            if (value) {
                var f;
                if (value instanceof Date) {
                    f = value.format('d/m/Y');
                    self.gpCompCargo.getSelectionModel().getSelected().set('fdesde', self.dfFInicio.getRawValue());
                } else {
                    f = value;
                }
                return f
            }
        }
        function formatDateH(value) {
            if (value) {
                var f;
                if (value instanceof Date) {
                    f = value.format('d/m/Y');
                    self.gpCompCargo.getSelectionModel().getSelected().set('fhasta', self.dfFFin.getRawValue());
                } else {
                    f = value;
                }
                return f
            }
        }

        this.columnasgpC = new Ext.grid.ColumnModel([
            this.smselectCC,
            {
                header: 'Denominaci&oacute;n de la competencia',
                width:260,
                dataIndex: 'competencia',
                sortable : false
            },
            {
                header: 'Fecha inicio',
                width:100,
                dataIndex: 'fdesde',
                editor: this.dfFInicio,
                renderer: formatDateD
            } ,
            {
                header: 'Fecha fin',
                width:100,
                dataIndex: 'fhasta',
                editor: this.dfFFin,
                renderer: formatDateH
            },
            {
                header: 'Evaluaci&oacute;n',
                width: 80,
                sortable : false,
                dataIndex: 'valor',
                editor: this.cbEvaluacion
            }
        ]);

        this.btnAdicionarComExtra = new Ext.Button({
            id: 'btnAdicionarComExtra',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarComp,
            iconCls: 'adicionar'
        });

        this.btnEliminarComExtra = new Ext.Button({
            id: 'btnEliminarComExtra',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarComp,
            iconCls: 'eliminar'
        });

        var self = this;
        this.gpCompCargo = new Ext.grid.EditorGridPanel({
            sm: this.smselectCC,
            tbar: [
                ' ', this.btnAdicionarComExtra, this.btnEliminarComExtra
            ],
            clicksToEdit: 1,
            region: 'center',
            border: false,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stCompCargo,
            autoScroll: true,
            cm: this.columnasgpC
        });

        this.btnCancelarC = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarC = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.windAddComp = new Ext.Window({
            title: 'Adicionar competencias laborales',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 590,
            height: 400,
            items: [this.gpCompCargo],
            buttons: [
                this.btnCancelarC,
                this.btnAceptarC
            ],
            listeners: {
                'hide': function()
                {
                    self.btnAdicionar.focus();
                    self.gpCompCargo.getSelectionModel().clearSelections();
                }
            }
        });

        this.smselectCCN = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        // add competencia del nomenclador
        this.columnasgpCN = new Ext.grid.ColumnModel([
            this.smselectCCN,
            {
                header: 'Denominaci&oacute;n de la competencia',
                width:380,
                dataIndex: 'denominacion',
                sortable : false
            }
        ]);

        this.sfBuscarCN = new Ext.app.SearchField({
            store: modelo.stCompNom,
            pageSize: 15,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: 'Buscar competencia <u>(Alt+B)</u>',
            emptyText: 'Criterio de búsqueda'
        });

        this.gpCompNom = new Ext.grid.GridPanel({
            sm: this.smselectCCN,
            region: 'center',
            tbar: [' Buscar competencia: ', this.sfBuscarCN],
            border: false,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stCompNom,
            autoScroll: true,
            cm: this.columnasgpCN,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stCompNom,
                displayInfo: true
            })
        });

        this.btnCancelarCN = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarCN = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.windAddCompN = new Ext.Window({
            title: 'Adicionar otras competencias laborales',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 420,
            height: 400,
            items: [this.gpCompNom],
            buttons: [
                this.btnCancelarCN,
                this.btnAceptarCN
            ],
            listeners: {
                'hide': function()
                {
                    self.btnAdicionarComExtra.focus();
                    self.gpCompNom.getSelectionModel().clearSelections();
                }
            }
        });

        //Certificar competencia

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            emptyText: 'Criterio a buscar',
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            tooltip: 'Buscar evaluaci&oacute;n <b>(Alt+B)</b>',
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            tooltip: 'Limpiar campos <b>(Alt+L)</b>',
            iconCls: 'limpiar'
        });

        this.columnasgpEv = new Ext.grid.ColumnModel([
            {header: 'Denominación', width: 250, dataIndex: 'denominacion', sortable: false},
            {header: 'Fecha inicio', width:110, dataIndex: 'fiperiodo'} ,
            {header: 'Fecha fin', width:110, dataIndex: 'ffperiodo'},
            {header: 'Evaluaci&oacute;n', width: 110, sortable: false, dataIndex: 'valor'},
            {width: 80, hidden: true, sortable: false, dataIndex: 'proceso'}
        ]);

        //Listado de competencias lab.
        this.gpEvaluaciones = new Ext.grid.GridPanel({
            id: 'gpEvaluaciones',
            tbar: [this.tfbuscar, this.btnBuscar, this.btnLimpiar],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Periodos" : "Periodo"]})'
            }),
            title: 'Listado de periodos evaluativos',
            region: 'center',
            border: true,
            height: 270,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stEvaluaciones,
            autoScroll: true,
            cm: this.columnasgpEv
        });

        this.dfDesdecert = new Ext.form.DateField({
            id: 'dfDesdecert',
            allowBlank: false,
            fieldLabel: 'Desde',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.dHastacert = new Ext.form.DateField({
            fieldLabel: 'Hasta',
            allowBlank: true,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            minValue:'01/01/1900',
            startDateField: 'dfDesdecert',
            vtype:'daterange'
        });

        //textfield para el buscar
        this.tfbuscara = new Ext.form.TextField({
            allowBlank: true,
            emptyText: 'Criterio a buscar',
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscara = new Ext.Button({
            tooltip: 'Buscar acci&oacute;n de capacitaci&oacute;n <b>(Alt+B)</b>',
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiara = new Ext.Button({
            tooltip: 'Limpiar campos <b>(Alt+L)</b>',
            iconCls: 'limpiar'
        });

        this.columnasgpacc= new Ext.grid.ColumnModel([
            {
                header: 'Denominaci&oacute;n',
                width: 260,
                dataIndex: 'denominacion',
                sortable : false
            },{
                header: 'Resultado',
                width: 100,
                dataIndex: 'resultado',
                sortable : false
            }
        ]);

        //Listado de acciones.
        this.gpAccion= new Ext.grid.GridPanel({
            id: 'gpAccion',
            tbar: [this.tfbuscara, this.btnBuscara, this.btnLimpiara],
            title: 'Acciones de capacitación',
            region: 'center',
            border: false,
            height: 270,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stAcciones,
            autoScroll: true,
            cm: this.columnasgpacc
        });

        this.tbadd = new Ext.TabPanel({
            id: 'tbadd',
            region: 'center',
            margins: '0 0 0 0',
            height: '100%',
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.gpEvaluaciones, this.gpAccion],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

        //Formulario de gestion.
        this.formCertificar = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth:0.5,
                    layout: 'form',
                    items: [this.dfDesdecert]
                },{
                    columnWidth:0.5,
                    layout: 'form',
                    items: [this.dHastacert]
                },{
                    columnWidth:1.0,
                    layout: 'form',
                    items: [this.tbadd]
                }]
            }]
        });

        this.btnCancelarCert = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarCert = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.windCertificar = new Ext.Window({
            title: 'Certificar competencia',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 420,
            height: 450,
            items: [this.formCertificar],
            buttons: [
                this.btnCancelarCert,
                this.btnAceptarCert
            ],
            listeners: {
                'hide': function()
                {
                    self.btnCertificar.focus();
                    self.gpEvaluaciones.getSelectionModel().clearSelections();
                    self.gpAccion.getSelectionModel().clearSelections();
                }
            }
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
                    items: [this.gpPersonas, this.gpComp]
                }
            ]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('certificarcompetencias', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Competencia.Certificarcompetencias.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Competencia.Certificarcompetencias.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Competencia.Certificarcompetencias.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});