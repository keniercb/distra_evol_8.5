/*
 * Ranking de trabajadores por cargo.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Rankingcargo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Pvd.Competencia.Rankingcargo');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Competencia.Rankingcargo.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaML',
            iconCls: 'ayuda',
            tooltip: 'Mostrar ayuda',
            text: idioma.BtnAyuda
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
            store: modelo.stRanking,
            pageSize: 15,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        //Listado de personas.
        this.gpPersonas = new Ext.grid.GridPanel({
            region: 'center',
            height: 400,
            border: true,
            tbar: ['Buscar trabajador: ', this.sfBuscar, '->', this.btnAyuda],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stRanking,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            cm: this.columnasgp,
           /* bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonas,
                displayInfo: true
            })*/
        });

        this.columnasgpv = new Ext.grid.ColumnModel([
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
                header: 'Rendimiento',
                width: 60,
                sortable : false,
                dataIndex: 'rendimiento'
            }
        ]);

        this.sfBuscarv = new Ext.app.SearchField({
            store: modelo.stPersonas,
            pageSize: 15,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        //Listado de personas.
        this.gpPersonasv = new Ext.grid.GridPanel({
            region: 'center',
            height: 400,
            border: true,
            tbar: ['Buscar trabajador: ', this.sfBuscarv],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPersonas,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            cm: this.columnasgpv,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonas,
                displayInfo: true
            })
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
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
                    width: '30%',
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
                    width: '70%',
                    border: false,
                    layout: 'fit',
                    items: [this.gpPersonas]
                }
            ]
        });
    }
}
;

//Inicializando la vista.
UCID.portal.cargarEtiquetas('rankingcargo', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Competencia.Rankingcargo.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Competencia.Rankingcargo.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Competencia.Rankingcargo.Controlador.init(idioma, vista, modelo);
});