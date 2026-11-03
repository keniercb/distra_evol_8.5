/*
 *Resumen individual de capacitación.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Resumenindividual
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Resumenindividual');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Capacitacion.Resumenindividual.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            tooltip: idioma.textToolTipAyuda,
            text: idioma.BtnAyuda
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            cargos: false,
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
            },
            {
                header: 'Categor$&iacute;a',
                width: 200,
                sortable : false,
                dataIndex: 'categoria'
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
            title: 'Listado de participantes',
            region: 'north',
            height: 400,
            border: false,
            tbar: ['Buscar persona: ', this.sfBuscar, '->', this.btnAyuda],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPersonas,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonas,
                displayInfo: true
            })
        });

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Observaci&oacute;n:</b> {observacion}</p><br>'
            )
        });

        this.columnasgpacc = new Ext.grid.ColumnModel([
            this.expander,
            {
                header: 'Acci&oacute;n de capacitaci&oacute;n',
                width: 250,
                dataIndex: 'denominacion',
                sortable : false
            },
            {
                header: 'Fecha inicio',
                width: 80,
                sortable : false,
                dataIndex: 'fdesde'
            },
            {
                header: 'Fecha fin',
                width: 80,
                sortable : false,
                dataIndex: 'fhasta'
            },
            {
                header: 'Modo de formaci&oacute;n',
                width: 250,
                sortable : false,
                dataIndex: 'modoformacion'
            },
            {
                header: 'Lugar',
                width: 200,
                sortable : false,
                dataIndex: 'lugar'
            }
        ]);

        this.dfFInicioBuscar = new Ext.form.DateField({
            id: 'dfFInicioBA',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            allowBlank: true,
            endDateField: 'dfFFinBA',
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
            id: 'dfFFinBA',
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            allowBlank: true,
            editable: false,
            readOnly: true,
            maxValue: '31/12/2100',
            minValue: '01/01/1900',
            startDateField: 'dfFInicioBA'
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
                modelo.stAcciones.load({params:{
                    fdesde: self.dfFInicioBuscar.getRawValue(),
                    fhasta: self.dfFFinBuscar.getRawValue(),
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
                self.dfFInicioBuscar.reset();
                self.dfFFinBuscar.reset();
                modelo.stAcciones.load({params:{start:0,limit:15}});
                self.btnLimpiar.disable();
            }.createDelegate(this)
        });

        //Botón para exportar plan.
        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: '<u>E</u>xportar',
            tooltip: 'Exportar plan individual de capacitaci&oacute;n <b>(Alt+E)</b>',
            iconCls: 'exportar'
        });

        //Listado de acciones.
        this.gpAcciones = new Ext.grid.GridPanel({
            id: 'gpAcciones',
            title: 'Listado de acciones de capacitaci&oacute;n',
            region: 'center',
            tbar: [
                'Fecha inicio:', this.dfFInicioBuscar, '-',
                'Fecha fin:', this.dfFFinBuscar,
                this.btnBuscar,
                this.btnLimpiar,
                this.btnExportar
            ],
            border: false,
            plugins: this.expander,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stAcciones,
            autoScroll: true,
            cm: this.columnasgpacc,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stAcciones,
                displayInfo: true
            })
        });

        this.expanderhist = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Observaci&oacute;n:</b> {observacion}</p><br>'
            )
        });

        this.columnasgphist = new Ext.grid.ColumnModel([
            this.expanderhist,
            {
                header: 'Acci&oacute;n de capacitaci&oacute;n',
                width: 250,
                dataIndex: 'denominacion',
                sortable : false
            },
            {
                header: 'Fecha inicio',
                width: 80,
                sortable : false,
                dataIndex: 'frdesde'
            },
            {
                header: 'Fecha fin',
                width: 80,
                sortable : false,
                dataIndex: 'frhasta'
            },
            {
                header: 'Modo de formaci&oacute;n',
                width: 250,
                sortable : false,
                dataIndex: 'modoformacion'
            },
            {
                header: 'Lugar',
                width: 200,
                sortable : false,
                dataIndex: 'lugar'
            }
        ]);

        //Listado de acciones histórico.
        this.gpAccionesHist = new Ext.grid.GridPanel({
            id: 'gpAccionesHist',
            title: 'Hist&oacute;rico',
            region: 'center',
            border: false,
            plugins: this.expanderhist,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stAccionesHist,
            autoScroll: true,
            cm: this.columnasgphist,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stAccionesHist,
                displayInfo: true
            })
        });

        this.tabPanel = new Ext.TabPanel({
            region: 'center',
            disabled: true,
            margins: '0 0 0 0',
            height: '100%',
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.gpAcciones, this.gpAccionesHist],
            listeners: {
                activate: function (p) {
                    p.doLayout();
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
                    items: [this.gpPersonas, this.tabPanel]
                }
            ]
        });

    }
}
;

//Inicializando la vista.
UCID.portal.cargarEtiquetas('resumenindividual', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Capacitacion.Resumenindividual.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Capacitacion.Resumenindividual.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Capacitacion.Resumenindividual.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});