/*
 * Gestionar Interrupcion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Movimientoslaborales
 * @uses Pvd.Movimientoslaborales.Gestionarinterrupcion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Movimientoslaborales.Gestionarinterrupcion');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Movimientoslaborales.Gestionarinterrupcion.Vista = {
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
            id: 'btnAdicionarim',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarNDC,
            iconCls: 'adicionar',
            //hidden: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificarim',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarNDC,
            iconCls: 'modificar',
            //hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminarim',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarNDC,
            iconCls: 'eliminar',
            //hidden: true
        });      

        this.expanderAcc = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Observaci&oacute;n:</b> {observacion}</p>'
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
                header: 'Motivo de interrupci&oacute;n',
                width: 300,
                dataIndex: 'motivo',
                sortable : false
            },
            {
                header: 'Fecha inicio',
                width: 100,
                sortable : false,
                dataIndex: 'fdesde'
            },
            {
                header: 'Fecha fin',
                width: 100,
                sortable : false,
                dataIndex: 'fhasta'
            },
            {
                header: 'Horas',
                width: 100,
                sortable : false,
                dataIndex: 'horas'
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stInterrupcion,
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
                modelo.stInterrupcion.load({params:{
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
                modelo.stInterrupcion.baseParams.query = null;
                modelo.stInterrupcion.load({params:{start:0,limit:15}});
                self.btnLimpiar.disable();
            }.createDelegate(this)
        });

        //Listado de interrupcion.
        this.gpInterrupcion = new Ext.grid.GridPanel({
            region: 'center',
            height: 400,
            plugins: this.expanderAcc,
            border: false,
            tbar: ['Buscar interrupci&oacute;n: ', this.sfBuscar,'-',
                'Fecha inicio:', this.dfFInicioBuscar, '-',
                'Fecha fin:', this.dfFFinBuscar,
                this.btnBuscar,
                this.btnLimpiar
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Interrupciones" :' +
                ' "Interrupci&oacute;n"]})'
            }),
            loadMask: {msg: 'Cargando...'},
            store: modelo.stInterrupcion,
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stInterrupcion,
                displayInfo: true
            })
        });

        // Componentes para adicionar y modificar interrupcion

        
        this.cbMotivo = new Ext.form.ComboBox({
            store: modelo.stMotivos,
            fieldLabel: 'Motivo de interrupción',
            anchor: '98%',
            height: 100,
            hiddenName:'idmotivointerrupcion',
            displayField: 'denominacion',
            valueField: 'idmotivointerrupcion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });


        var fecha = new Date();
        this.dfFDesde = new Ext.form.DateField({
            id: 'dfFDesde',
            fieldLabel: 'Fecha inicio',
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
            fieldLabel: 'Fecha fin',
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

        this.tfHora = new Ext.form.NumberField({
            fieldLabel: 'Horas',
            allowBlank: true,
            maxLength: 100,
            enableKeyEvents: true,
            anchor:	'99%',
            name: 'horas'
        });

        // Area de texto Observación del interrupcion
        this.taObservacion = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observacion',
            anchor: '99%',
            height: 80,
            hiddenname: 'observacion',
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
                        columnWidth:0.7,
                        layout: 'form',
                        items: [this.cbMotivo]
                    },{
                        columnWidth: 0.3,
                        layout: 'form',
                        items: [this.tfHora]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.dfFDesde]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.dfFHasta]
                    }, {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.taObservacion]
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
            height: 280,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });
        var self = this;
        this.pInterruptos = new Pvd.Movimientoslaborales.PanelInterruptos({idioma:idioma});
        this.pImputables = new Pvd.Movimientoslaborales.PanelImputables({idioma:idioma});

        this.tabPanel = new Ext.TabPanel({
            region: 'south',
            margins: '0 0 0 0',
            height: 300,
            disabled: true,
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.pInterruptos, this.pImputables],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
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
                    title: 'Listado de interrupciones',
                    split: true,
                    width: '75%',
                    border: false,
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnAyuda],
                    layout: 'border',
                    items: [this.gpInterrupcion, this.tabPanel]
                }

            ]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarinterrupto', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Movimientoslaborales.Gestionarinterrupcion.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Movimientoslaborales.Gestionarinterrupcion.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Movimientoslaborales.Gestionarinterrupcion.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});