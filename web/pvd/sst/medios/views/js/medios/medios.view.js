/*
 * Gestionar riesgo.
 *
 * @author Ing. Beatriz Selema Alvarez
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestionarriesgo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Medios');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Medios.Gestionarmedio.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;

        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaMedios',
            iconCls: 'ayuda',
            text: idioma.BtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            //disabled: true,
            id: 'btnAdicionarMedios',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
             hidden: true,
            //  disabled: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificarMedios',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificar,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminarMedios',
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
            this.smselect, this.expander, {
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'estructura',
                sortable: false
            },
            {
                header: 'Denominaci&oacute;n',
                width: 120,
                dataIndex: 'denominacion',
                sortable: false
            },
            {
                header: 'Cantidad',
                width: 100,
                sortable: false,
                dataIndex: 'cantidad'
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stMedios,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        //Listado de riesgos.
        this.gpMedios = new Ext.grid.GridPanel({
            region: 'center',
            height: 550,
            split: true,
            sm: this.smselect,
            plugins: this.expander,
            border: false,
            //tbar: ['Buscar riesgo: ', this.sfBuscar],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stMedios,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Medios" : "Medio"]})'
            }),
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stMedios,
                displayInfo: true
            }),
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, 'Buscar medio: ', this.sfBuscar, '->', this.btnAyuda]
        });

        // Componentes para adicionar y modificar medios

        this.cbNomMedios = new Ext.form.ComboBox({
            store: modelo.stNomMedios,
            fieldLabel: 'Denominaci&oacute;n del medio',
            anchor: '99%',
            id: 'cbNomMedios',
            hiddenName: 'idmedio',
            displayField: 'denominacion',
            valueField: 'idmedio',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.nfCant = new Ext.form.NumberField({
            id: 'nfCant',
            fieldLabel: 'Cantidad',
            allowBlank: true,
            //minLength: 3,
            maxLength: 11,
            enableKeyEvents: true,
            name: 'cantidad',
            anchor: '99%',
        });


        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.cbNomMedios]
                        },
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.nfCant]
                        }
                    ]
                }
            ]
        });

        this.btnCancelar = new Ext.Button({
            //nextTab: 'cbNomRiesgo',
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'cbNomRiesgo',
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
            width: 280,
            height: 180,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function () {
                    // self.cbNomRiesgo.focus(true, 500);
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
                    width: '30%',
                    border: false,
                    collapsible: true,
                    title: 'Estructura organizativa',
                    layout: 'fit',
                    items: [this.tpEstructura]
                },
                {region: 'center',
                    title: 'Listado de medios',
                    xtype: 'panel',
                    id: 'center-panel',
                    autoHeight: false,
                    split: true,
                    width: '70%',
                    border: false,
                    layout: 'border',
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnAyuda],
                    items: [this.gpMedios]
                }
            ]
        });

    }
}
;

//Inicializando la vista.
UCID.portal.cargarEtiquetas('medios', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Medios.Gestionarmedio.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Medios.Gestionarmedio.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Medios.Gestionarmedio.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});