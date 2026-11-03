/*
 * Gestionar Accidentes.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.SST.Gestionaraccidentes');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.SST.Gestionaraccidentes.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaML',
            iconCls: 'ayuda',
            tooltip: idioma.textToolTipAyuda,
            text: idioma.BtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarNDC,
            iconCls: 'adicionar',
            hidden: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarNDC,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarNDC,
            iconCls: 'eliminar',
            hidden: true
        });

        //Boton para asociar comité de ingreso.
        this.btnAsociar = new Ext.Button({
            id: 'btnAsociar',
            disabled: true,
            text: 'Comisiones',
            tooltip: 'Asociar comisiones',
            iconCls: 'organizacion'
        });

        this.btnExportar = new Ext.Toolbar.MenuButton({
            id: 'btnExportar',
            text    : 'Exportar',
            tooltip : 'Exportar',
            iconCls : 'exportar',
            menu    : {
                items: [
                    {text: 'Exportar indicadores seleccionados de protecci&oacute;n y seguridad social', iconCls: 'informe', id: 'idbtn1'},
                    {text: 'Exportar expediente del accidente', iconCls: 'informe', disabled: true, id: 'idbtn2'}
                ]
            }
        });

        this.expanderAcc = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Lugar del accidente:</b> {lugar}</p><p><b>Descripci&oacute;n:</b> {descripcion}</p>'
            )
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            this.expanderAcc,
            {
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'estructura',
                sortable : false
            },
            {
                header: 'Tipo de accidente',
                width: 250,
                dataIndex: 'tipoaccidente',
                sortable : false
            },
            {
                header: 'Forma del accidente',
                width: 250,
                sortable : false,
                dataIndex: 'formaaccidente'
            },
            {
                header: 'Tipo de agente',
                width: 250,
                sortable : false,
                dataIndex: 'tipoagente'
            },
            {
                header: 'Agente',
                width: 250,
                sortable : false,
                dataIndex: 'agente'
            },
            {
                header: 'Fecha',
                width: 80,
                sortable : false,
                dataIndex: 'fecha'
            },
            {
                header: 'Hora',
                width: 80,
                sortable : false,
                dataIndex: 'hora'
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stAccidentes,
            pageSize: 15,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        this.dfFInicioBuscar = new Ext.form.DateField({
            id: 'dfFInicioBuscar',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            endDateField: 'dfFFinBuscar',
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900'
        });

        this.dfFInicioBuscar.on('valid',function(n, m, o){
            if (self.btnBuscar.disabled) {
                self.btnBuscar.enable();
            }
            if (self.btnLimpiar.disabled) {
                self.btnLimpiar.enable();
            }
        });

        this.dfFFinBuscar = new Ext.form.DateField({
            id: 'dfFFinBuscar',
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFInicioBuscar'
        });

        this.dfFFinBuscar.on('valid',function(n, m, o){
            if (self.btnBuscar.disabled) {
                self.btnBuscar.enable();
            }
            if (self.btnLimpiar.disabled) {
                self.btnLimpiar.enable();
            }
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            tooltip: idioma.lbBtnBuscar,
            disabled: true,
            iconCls: 'buscar',
            handler: function ()
            {
                modelo.stAccidentes.load({params:{
                    query: self.sfBuscar.getValue(),
                    desde: self.dfFInicioBuscar.getRawValue(),
                    hasta: self.dfFFinBuscar.getRawValue(),
                    start: 0,
                    limit: 15}});
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            tooltip: idioma.lbBtnLimpiar,
            disabled: true,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.sfBuscar.reset();
                self.dfFInicioBuscar.reset();
                self.dfFFinBuscar.reset();
                modelo.stAccidentes.load({params:{start:0,limit:15}});
                self.btnLimpiar.disable();
            }.createDelegate(this)
        });

        //Listado de accidentes.
        this.gpAccidentes = new Ext.grid.GridPanel({
            region: 'center',
            height: 400,
            plugins: this.expanderAcc,
            border: false,
            tbar: ['Buscar accidente: ', this.sfBuscar,'-',
                'Fecha inicio:', this.dfFInicioBuscar, '-',
                'Fecha fin:', this.dfFFinBuscar,
                this.btnBuscar,
                this.btnLimpiar
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Accidentes" : "Accidente"]})'
            }),
            loadMask: {msg: 'Cargando...'},
            store: modelo.stAccidentes,
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stAccidentes,
                displayInfo: true
            })
        });

        // Componentes para adicionar y modificar accidentes

        // Area de texto Lugar del accidente
        this.taLugar = new Ext.form.TextArea({
            fieldLabel: 'Lugar',
            name: 'lugar',
            anchor: '99%',
            height: 80,
            hiddenname: 'lugar',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	false
        });

        this.chbEquiparado = new Ext.form.Checkbox({
            id: 'chbEquiparado',
            boxLabel: 'Accidente equiparado al de trabajo',
            hidden: false,
            labelSeparator: '',
            hideLabel: true,
            name: 'equiparado',
            anchor: '98%'
        });

        this.cbTipoAccidente = new Ext.form.ComboBox({
            store: modelo.stTiposAcc,
            fieldLabel: 'Tipo de accidente',
            anchor: '98%',
            height: 100,
            hiddenName:'idtipoaccidente',
            displayField: 'denominacion',
            valueField: 'idtipoaccidente',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbFormaAccidente = new Ext.form.ComboBox({
            store: modelo.stFormaAcc,
            fieldLabel: 'Forma del accidente',
            anchor: '98%',
            height: 100,
            hiddenName:'idformaaccidente',
            displayField: 'denominacion',
            valueField: 'idformaaccidente',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbTipoAgente = new Ext.form.ComboBox({
            store: modelo.stTiposAgente,
            fieldLabel: 'Tipo de agente',
            anchor: '98%',
            height: 100,
            hiddenName:'idtipoagente',
            displayField: 'denominacion',
            valueField: 'idtipoagente',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbAgente = new Ext.form.ComboBox({
            store: modelo.stAgente,
            fieldLabel: 'Agente',
            anchor: '98%',
            height: 100,
            disabled: true,
            hiddenName:'idagente',
            displayField: 'denominacion',
            valueField: 'idagente',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        var fecha = new Date();

        this.dfFecha = new Ext.form.DateField({
            id: 'dfFecha',
            allowBlank: false,
            fieldLabel: 'Fecha',
            name: 'fecha',
            hiddenname: 'fecha',
            anchor:'98%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: '31/12/2100',
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.tfHora = new Ext.form.TextField({
            fieldLabel: 'Hora(hh:mm)',
            allowBlank: false,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /(0[0-9]|1\d|2[0-3]):([0-5]\d)$/,
            anchor:	'99%',
            name: 'hora'
        });

        // Area de texto Descripción del accidente
        this.taDescripcion = new Ext.form.TextArea({
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            anchor: '99%',
            height: 80,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	true
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            id: 'formularioGestion',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.taLugar]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.cbTipoAccidente]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.cbFormaAccidente]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.cbTipoAgente]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.cbAgente]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFecha]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.tfHora]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.chbEquiparado]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.taDescripcion]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptar = new Ext.Button({
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
            height: 470,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.taLugar.focus(true, 500);
                }
            }
        });
        var self = this;
        this.pImplicadoss = new Pvd.SST.Gestionaraccidentes.PanelImplicados({idioma:idioma});
        this.pCausas = new Pvd.SST.Gestionaraccidentes.PanelCausas({idioma:idioma});
        this.pRecomendaciones = new Pvd.SST.Gestionaraccidentes.PanelRecomendaciones({idioma:idioma});
        this.pConclusiones = new Pvd.SST.Gestionaraccidentes.PanelConclusiones({idioma:idioma});
        this.pCostos = new Pvd.SST.Gestionaraccidentes.PanelCostos({idioma:idioma});
        this.pDatosAccidente = new Pvd.SST.Gestionaraccidentes.PanelDatosAccidente({idioma:idioma});

        this.tabPanel = new Ext.TabPanel({
            region: 'south',
            margins: '0 0 0 0',
            // collapsed: true,
            // collapsible: true,
            // hideCollapseTool: true,
            height: 300,
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.pImplicadoss, this.pCausas, this.pRecomendaciones, this.pConclusiones, this.pCostos/*, this.pDatosAccidente*/],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

        ////////Componentes de la ventana de asociar comisión
        this.smComision = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        //Listado de comisiones.
        this.gpComision = new Ext.grid.GridPanel({
            store: modelo.stComision,
            height: 400,
            loadMask:{msg: idioma.lbCargando},
            sm: this.smComision,
            columns: [this.smComision,
                {
                    header: 'Denominaci&oacute;n',
                    width:370,
                    dataIndex: 'denominacion'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stComision,
                displayInfo: true
            })
        });

        this.btnCancelarCom = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarCom = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.winAsociarComision = new Ext.Window({
            title: 'Listado de comisiones',
            width: 420,
            validate: false,
            constrain:true,
            height: 400,
            layout: 'fit',
            autoHeight: true,
            closable: true,
            resizable: false,
            closeAction: 'hide',
            items: [this.gpComision],
            modal: true,
            buttons: [this.btnCancelarCom, this.btnAceptarCom]
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            cargos: false,
            inicial: perfil.idestructuracomun,
            split: true,
            region: 'center'
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
                },{region: 'center',
                    xtype: 'panel',
                    id: 'center-panel',
                    autoHeight: false,
                    split: true,
                    width: '75%',
                    border: false,
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnAsociar, this.btnExportar, '->', this.btnAyuda],
                    layout: 'border',
                    items: [this.gpAccidentes, this.tabPanel]
                }

            ]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionaraccidentes', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.SST.Gestionaraccidentes.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.SST.Gestionaraccidentes.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.SST.Gestionaraccidentes.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});