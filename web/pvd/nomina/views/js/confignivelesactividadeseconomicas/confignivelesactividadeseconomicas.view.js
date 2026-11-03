Ext.ns('Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas');

Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize: true,

    // private
    isValidParent: function (c, target) {
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout: function (ct, target) {
        var rs = ct.items.items, len = rs.length, r, i;

        if (!this.innerCt) {
            target.addClass('ux-row-layout-ct');
            this.innerCt = target.createChild({cls: 'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if (size.width < 1 && size.height < 1) { // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height: h});

        // some rows can be percentages while others are fixed
        // so we need to make 2 passes

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (!r.rowHeight) {
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for (i = 0; i < len; i++) {
            r = rs[i];
            if (r.rowHeight) {
                r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
            }
        }
    }

    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;

Ext.QuickTips.init();

//Vista del componente Gestionar submayor de vacaciones.
Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas.Vista = {
    /**
     * Inicializar la vista.
     */
    init: function (perfil, idioma, modelo) {
        var self = this;
        //Componenete para seleccionar la entidad de la cual obtener las personas.
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            border: false,
            nivel: 3,
            nivelchequear: 3
        });

        //Ventana para seleccionar la entidad.
        this.btnAceptarEntidad = new Ext.Button({
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAceptar,
            disabled: true,
            iconCls: 'aceptar'
        });

        this.winEstructura = new Ext.Panel({
            title: idioma.lbTitleWinEstructura,
            modal: true,
            height: '100%',
            width: '100%',
            layout: 'fit',
            border: false,
            items: [this.pobjestructura]

        });

        //Panel y botones del adicionar los tipos de nominas y niveles de actividades economicas
        this.btnCancelarNAE = new Ext.Button({
            text: 'Cancelar',
            tooltip: 'Cancelar',
            iconCls: 'cancelar'
        });

        this.btnAceptarNAE = new Ext.Button({
            text: 'Aceptar',
            tooltip: 'Aceptar',
            iconCls: 'aceptar',
            disabled: true
        });

        this.winAddNAE = new Ext.Window({
            title: idioma.lbTitlewinAddNAE,
            closeAction: 'hide',
            height: 400,
            width: 500,
            constrain: true,
            resizable: true,
            layout: 'fit',
            bbar: ['->',this.btnCancelarNAE, this.btnAceptarNAE]
        });

        //Botones de add, del, mod Niveles de actividades economicas
        this.btnAdicionarNAE = new Ext.Button({
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar nivel de actividad económica(<b>Alt + I</b>>).',
            disabled: true,
            iconCls: 'adicionar'
        });

        this.btnModificarNAE = new Ext.Button({
            id: 'btnModificarNAE',
            text: "<u>M</u>odificar",
            tooltip: "<u>M</u>odificar",
            disabled: true,
            iconCls: 'modificar'
        });

        this.btnEliminarNAE = new Ext.Button({
            id: 'btnEliminarNAE',
            text: 'Eliminar',
            tooltip: 'Eliminar',
            disabled: true,
            iconCls: 'eliminar'
        });

        //Selections models
        this.smNivelesActividadesEconom = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        //Grid de Configuracion de niveles de actividades economicas
        this.gpNivelesActividadesEconom = new Ext.grid.GridPanel({
            id: 'gpNivelesActividadesEconomicas',
            title: 'Listado de niveles de actividades econ&oacute;micas',
            region: 'center',
            columns: [
                this.smNivelesActividadesEconom,
                {
                    header: 'idconfiguracionnivelae',
                    hidden: true,
                    dataIndex: 'idconfiguracionnivelae'
                },
                {
                    header: 'idtiponomina',
                    hidden: true,
                    dataIndex: 'idtiponomina'
                },
                {
                    header: 'idnivelactividadeconomica',
                    hidden: true,
                    dataIndex: 'idnivelactividadeconomica'
                },
                {
                    header: 'Tipo de n&oacute;mina',
                    sortable: true,
                    width: 200,
                    align: 'center',
                    sortable: true,
                    dataIndex: 'tiponomina'
                }, {
                    header: 'Nivel de actividad econ&oacute;mica',
                    sortable: true,
                    width: 700,
                    align: 'center',
                    dataIndex: 'nivelactividadeconomica'
                }
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                groupTextTpl: '{text}'
            }),
            store: modelo.storeNivelActividadEconom,
            sm: this.smNivelesActividadesEconom,
            loadMask: {msg: idioma.lbMaskGridCargando}
        });

        //Panel de Configuracion de niveles de actividades economicas
        this.panelNAEDerecho = new Ext.Panel({
            id: 'panelNAEDerecho',
            heigth: '100%',
            width: '50%',
            split: true,
            region: 'center',
            border: false,
            layout: 'fit',
            items: [this.gpNivelesActividadesEconom],
            tbar: [this.btnAdicionarNAE, this.btnModificarNAE, this.btnEliminarNAE]
        });

        //Panel de estructuras
        this.panelestructuraNAE = new Ext.Panel({
            id: 'panelestructuraNAE',
            heigth: '60%',
            width: '100%',
            split: true,
            region: 'center',
            border: false,
            layout: 'border',
            items: [{
                xtype: 'panel',
                region: 'center',
                height: '100%',
                width: '30%',
                split: true,
                layout: 'fit',
                items: [this.winEstructura]
            }, {
                xtype: 'panel',
                region: 'east',
                height: '100%',
                width: '70%',
                split: true,
                layout: 'fit',
                items: [this.panelNAEDerecho]
            }]
        });

        //Ventana para gestionar las vacaciones de las personas por entidades.
        this.winGestNivelesActivEconom = new Ext.Window({
            title: idioma.lbTitleWinConfNAE,
            modal: true,
            height: '100%',
            width: '100%',
            closeAction: 'hide',
            constrain: true,
            maximized: true,
            closable: true,
            resizable: false,
            layout: 'border',
            items: this.panelestructuraNAE
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('confignivelesactividadeseconomicas', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    var modelo = Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas.Modelo;
    modelo.init(idioma);

    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas.Vista;
    vista.init(perfil, idioma, modelo);

    //Inicializar controlador.
    Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas.Controlador.init(idioma, vista, modelo);
});