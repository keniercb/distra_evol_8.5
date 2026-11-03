/*
 * Jubilacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Fuerzatrabajo
 * @uses Pvd.Fuerzatrabajo.Jubilacion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Fuerzatrabajo.Jubilacion');
Ext.QuickTips.init();
Pvd.Fuerzatrabajo.Jubilacion.Vista = {
    init: function (idioma, modelo) {
        let self = this;
        this.btnJubilar = new Ext.Button({
            id: 'idbtnJubilar',
            iconCls: 'probar',
            disabled: true,
            tooltip: 'Jubilar trabajador',
            text: 'Jubilar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaMovimiento',
            iconCls: 'ayuda',
            tooltip: idioma.textToolTipAyuda,
            text: idioma.BtnAyuda
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border             : false,
            width              : '20%',
            excluirConceptos   :  [9],
            inicial            : perfil.idestructuracomun,
            disponibilidadCargo: true,
            disponibilidad     : false,
            split              : true,
            region             : 'center'
        });

        this.lbBuscarPers = new Ext.form.Label({
            text  : 'Buscar persona: ',
            hidden: false
        });

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stPersonas,
            width: 130,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: 'Limpiar',
            toolTipTrigger2: 'Buscar',
            //emptyText: 'Criterio a buscar'
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            {header: 'Area', width: 10, hidden: true, dataIndex: 'entidad_area', sortable: false},
            {header: 'No Identidad', width: 20, dataIndex: 'numid', sortable: false},
            {header: 'Nombre y apellidos', width: 100, sortable: false, dataIndex: 'nombreyapellidos'},
            {header: 'Edad', sortable: false, width: 20, dataIndex: 'edad'},
            {header: 'Cargo', width: 100, sortable: false, dataIndex: 'cargo'},
            {header: 'Desde', sortable: false, width: 20, dataIndex: 'fdesde'},
            {header: 'Hasta', sortable: false, width: 20, dataIndex: 'fhasta'},
            {header: 'Fecha de alta', sortable: false, width: 200, dataIndex: 'faltaentidad'}
        ]);

        //Listado de personas.
        this.gpPersonasTrab = new Ext.grid.GridPanel({
            region    : 'center',
            border    : false,
            tbar      : [this.lbBuscarPers, this.sfBuscar],
            loadMask  : {msg: 'Cargando...'},
            store     : modelo.stPersonasTrab,
            view      : new Ext.grid.GroupingView({
                forceFit      : true,
                startCollapsed: false,
                groupTextTpl  : '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            cm        : this.columnasgp,
            bbar      : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stPersonasTrab,
                displayInfo: true
            })
        });

        this.pTrabajadores = new Ext.Panel({
            layout             : 'border',
            region             : 'center',
            tbar: [this.btnJubilar, '->', this.btnAyuda],
            border             : false,
            items              : [this.gpPersonasTrab]
        });

        //ventana que muestra los datos de la jubilación

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text   : idioma.btnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text   : idioma.textbtnCancelar,
            tooltip: idioma.textToolTipCancelar
        });

        this.gpTrayectoria = new Ext.grid.GridPanel({
            region: 'center',
            width: '50%',
            title: 'Trayectoria laboral',
            store: modelo.stTrayectoria,
            loadMask: {msg: 'Cargando...'},
            columns: [{header: 'Cargo', width: 200, dataIndex: 'cargo'},
                {header: 'Desde', width: 80, dataIndex: 'fdesde'},
                {header: 'Hasta', width: 80, dataIndex: 'fhasta'}
                ],
            bbar: new Ext.PagingToolbar({pageSize: 15, store: modelo.stTrayectoria, displayInfo: true})
        });

        this.gpSalarios = new Ext.grid.GridPanel({
            region: 'east',
            width: '50%',
            title: 'Salarios',
            store: modelo.stSalarios,
            loadMask: {msg: 'Cargando...'},
            columns: [
                {header: 'Año', width: 100, dataIndex: 'anno'},
                {header: 'Valor', width: 100, dataIndex: 'salario'},
                {header: 'Tiempo(meses)', width: 100, dataIndex: 'meses'}
            ],
            bbar: new Ext.PagingToolbar({pageSize: 15, store: modelo.stSalarios, displayInfo: true})
        });

        this.winJubilar = new Ext.Window({
            title      : 'Datos de la Jubilación',
            closeAction: 'hide',
            constrain  : true,
            resizable  : false,
            width      : 700,
            height     : 400,
            layout     : 'border',
            modal      : true,
            buttons    : [this.btnCancelar, this.btnAceptar],
            items      : [this.gpTrayectoria, this.gpSalarios]
        });

        new Ext.Viewport({
            layout: 'border',
            items : [
                {
                    region     : 'west',
                    xtype      : 'panel',
                    id         : 'east-panel',
                    autoHeight : false,
                    split      : true,
                    width      : '30%',
                    border     : false,
                    collapsible: true,
                    title      : idioma.titleEstructura,
                    layout     : 'border',
                    items      : [this.tpEstructura]
                },
                this.pTrabajadores
            ]
        });

    }
};

UCID.portal.cargarEtiquetas('jubilacion', function (perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Pvd.Fuerzatrabajo.Jubilacion.Modelo;
    modelo.init();

    var vista = Pvd.Fuerzatrabajo.Jubilacion.Vista;
    vista.init(idioma, modelo);

    Pvd.Fuerzatrabajo.Jubilacion.Controlador.init(idioma, vista, modelo);
    UCID.portal.cargarAcciones(window.frameElement.id);
});