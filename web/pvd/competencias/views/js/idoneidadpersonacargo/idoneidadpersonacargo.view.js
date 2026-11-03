/*
 * Idoneidad de la persona en su cargo.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Idoneidadpersonacargo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Competencia.Idoneidadpersonacargo');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Competencia.Idoneidadpersonacargo.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            tooltip: 'Mostrar ayuda',
            text: idioma.BtnAyuda
        });

        function idoneo(val) {
            if(val == 1) {
                return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
            } else if (val != '' && (val == 2 || val == 0)) {
                return '<span style="color: #aa2113;">' + '&#10005;' + '</span>';
            }
        }

        //color del estado
        function colorEstado(val, metaData, record) {
            if(val != null && record.data.idoneo != '' && (record.data.idoneo == 2 || record.data.idoneo == 0)) {
                return '<span style="color:rgba(204, 30, 12, 0.89);"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

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
                sortable : false,
                renderer: colorEstado
            },
            {
                header: 'Apellidos y nombres',
                width: 350,
                sortable : false,
                dataIndex: 'nombreyapellidos',
                renderer: colorEstado
            },
            {
                header: 'Cargo',
                width: 300,
                sortable : false,
                dataIndex: 'cargo',
                renderer: colorEstado
            },
            {
                header: 'Id&oacute;neo',
                width: 60,
                align: 'center',
                sortable : false,
                dataIndex: 'idoneo',
                renderer: idoneo
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stPersonas,
            pageSize: 15,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        this.btnExportar = new Ext.Toolbar.MenuButton({
            text    : '<u>E</u>xportar',
            iconCls : 'exportar',
            menu    : {
                items: [
                    {text: 'Resumen de idoneidad', iconCls: 'informe', id: 'btnExportar1'},
                    {text: 'Trabajadores no id&oacute;neos', iconCls: 'informe', id: 'btnExportar'}
                ]
            }
        });

        //Listado de personas.
        this.gpPersonas = new Ext.grid.GridPanel({
            region: 'center',
            height: 400,
            border: true,
            tbar: ['Buscar trabajador: ', this.sfBuscar, this.btnExportar, '->', this.btnAyuda],
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
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        this.columnasgpcom = new Ext.grid.ColumnModel([
            this.expander,
            {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion', sortable : false},
            {header: 'Nivel requerido', width: 120, sortable : false, dataIndex: 'nivelrequerido'},
            {header: 'Nivel certificado', width: 120, sortable : false, dataIndex: 'nivelcertificado' }
        ]);

        this.tcbCargos = new Ext.components.TreeComboBox({
            width: 260,
            allowBlank: true,
            fieldLabel: 'Cargo',
            treeConfig: {
                rootVisible: false,
                loader     : modelo.tlcargos,
                border     : false,
                autoScroll : true
            }
        });

        this.resultado = new Ext.form.Label({
            //text: 'No hay resultados que mostrar',
            width: 260,
            html: "<marquee>No hay resultados que mostrar</marquee>",
            style: "font-family:arial,serif; font-size:12px; text-align:center; color:#15428B;"
        });
        
        //Listado de competencias.
        this.gpCompetencias = new Ext.grid.GridPanel({
            title: 'Listado de competencias del cargo',
            region: 'south',
            collapsible: true,
            border: false,
            split: true,
            tbar: ['Cargo: ', this.tcbCargos],
            height: 300,
            plugins: this.expander,
            disabled: true,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stCompetencias,
            autoScroll: true,
            cm: this.columnasgpcom,
            bbar: [this.resultado]
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            inicial: perfil.idestructuracomun,
            split: true,
            region: 'center'
        });

        this.columnasgp2 = new Ext.grid.ColumnModel([
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
                header: 'Id&oacute;neo',
                width: 60,
                align: 'center',
                sortable : false,
                dataIndex: 'idoneo',
                renderer: idoneo
            }
        ]);

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            disabled: true,
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
            //hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminar,
            iconCls: 'eliminar',
            //hidden: true
        });

        this.btnExportar2 = new Ext.Button({
            text: '<u>E</u>xportar',
            tooltip: 'Exportar resumen de idoneidad',
            iconCls: 'exportar'
        });

        //Listado de personas.
        this.gpPersonas2 = new Ext.grid.GridPanel({
            region: 'center',
            height: 400,
            border: true,
            tbar: [this.btnAdicionar, this.btnEliminar, this.btnExportar2],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPersonas2,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            cm: this.columnasgp2,
            /*bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonas2,
                displayInfo: true
            })*/
        });

        this.tabPanel = new Ext.TabPanel({
            id       : 'idTabPanel',
            region   : 'center',
            margins  : '0 5 5 0',
            height   : '100%',
            width    : '75%',
            border   : false,
            activeTab: 0,
            items    : [
                {
                    title : 'Idoneidad del trabajador',
                    id    : 'idoneidad',
                    layout: 'border',
                    tabTip: 'Idoneidad del trabajador',
                    items : [this.gpPersonas, this.gpCompetencias]
                }, {
                    title : 'Idoneidad por cargos',
                    id    : 'idoneidadcargo',
                    layout: 'border',
                    tabTip: 'Idoneidad por cargos',
                    items : [this.gpPersonas2]
                }
            ]
        });

        this.smselect = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.columnasgpAll = new Ext.grid.ColumnModel([
            this.smselect,
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

        this.sfBuscarAll = new Ext.app.SearchField({
            store: modelo.stPersonasAll,
            pageSize: 15,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        //Listado de personas.
        this.gpPersonasAll = new Ext.grid.GridPanel({
            region: 'center',
            sm: this.smselect,
            height: 400,
            border: true,
            tbar: ['Buscar persona: ', this.sfBuscarAll],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPersonasAll,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            cm: this.columnasgpAll,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonasAll,
                displayInfo: true
            })
        });
        
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.btnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        this.btnCancelar= new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.textbtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            handler: function() {
                self.winAdd.hide();
            }
        });

        this.winAdd = new Ext.Window({
            title: 'Adicionar persona',
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            width: 600,
            height: 400,
            layout: 'fit',
            modal: true,
            buttons: [this.btnCancelar, this.btnAceptar],
            items: [this.gpPersonasAll],
            keys: [
                {
                    key: 'x',
                    alt: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelar.disabled) {
                            self.btnCancelar.handler();
                        }

                    }
                },{
                    key: 'b',
                    alt: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.sfBuscarAll.getValue() != '') {
                            self.sfBuscarAll.onTrigger2Click();
                        }
                    }
                },{
                    key: 'l',
                    alt: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.sfBuscarAll.getValue() != '') {
                            self.sfBuscarAll.onTrigger1Click();
                        }
                    }
                }
            ]
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
                },this.tabPanel
            ]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('idoneidadpersonacargo', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Competencia.Idoneidadpersonacargo.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Competencia.Idoneidadpersonacargo.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Competencia.Idoneidadpersonacargo.Controlador.init(idioma, vista, modelo);
});