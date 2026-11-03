Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

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

//Vista principal del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.VistaPrincipal = {
    /**
     * Inicializar la vista.
     *
     * @param perfil            Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma            Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo            Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos(Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Modelo).
     * @param vistaConcepto    Vista de gestionar conceptos (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaConcepto).
     * @param vistaTarifa        Vista de gestionar tarifas (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaTarifa).
     * @param vistaVarAuxiliar    Vista de gestionar variables auxiliares (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaVariableAuxiliar).
     * @param vistaBusqdaHistorico    Vista de busqda en historico (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaBusqdaHistorico).
     * @param vistaEstEscalar    Vista de gestionar estructura escalar (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaEstructuraEscalar).
     * @param vistaAdyacente    Vista de gestionar estructuras adyacentes (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaAdyacente).
     * @param vistaEscala        Vista de gestionar escalas (Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.VistaEscala).
     */
    init: function (perfil, idioma, modelo, vistaConcepto, vistaTarifa, vistaBusqdaHistorico, vistaVarAuxiliar, vistaEstEscalar, vistaAdyacente, vistaEscala) {

        //TabPanel de Escala de valores.
        this.tabPanelEscala = new Ext.TabPanel({
            id: 'idtabPanelEscala',
            enableTabScroll: true,
            defaults: {autoScroll: true},
            resizeTabs: true,
            border: false,
            width: '100%',
            height: '100%',
            activeTab: 0,
            tabWidth: 130,
            items: [{
                id: 'idtabconfig',
                title: idioma.lbTitleTabConfigEscala,
                border: false,
                layout: 'border',
                items: [{
                    region: 'west',
                    width: '80%',
                    border: true,
                    layout: 'fit',
                    tbar: [vistaEstEscalar.btnAdicionarEstEsc, vistaEstEscalar.btnModificarEstEsc, vistaEstEscalar.btnEliminarEstEsc],
                    items: [vistaEstEscalar.gpEstrucEsc]
                }, {
                    region: 'center',
                    width: '20%',
                    border: true,
                    layout: 'fit',
                    tbar: [vistaAdyacente.btnAdicionarMatrizAdy, vistaAdyacente.btnEliminarMatrizAdy],
                    items: [vistaAdyacente.gpMatrizAdy]
                }]
            }, {
                id: 'idtabescala',
                title: idioma.lbTitleTabEscala,
                layout: 'fit',
                border: false,
                tbar: [vistaEscala.btnAdicionarEscala, vistaEscala.btnModificarEscala, vistaEscala.btnEliminarEscala],
                items: [vistaEscala.gpEscala]
            }]
        });

        //Vista general de la interfaz.
        new Ext.Viewport({
            layout: 'border',
            items: [{
                region: 'west',
                width: '35%',
                heigth: '100%',
                layout: 'fit',
                tbar: [vistaConcepto.btnAdicionarConcepto, vistaConcepto.btnModificarConcepto, vistaConcepto.btnEliminarConcepto, '', '', '', '', '', '', '', '', vistaConcepto.tfbuscar, vistaConcepto.btnBuscar, '->', vistaConcepto.btnAyudaConcepto],
                items: [vistaConcepto.gpConcepto],
            }, {
                region: 'center',
                width: '75%',
                heigth: '100%',
                layout: 'ux.row',
                items: [{
                    rowHeight: .35,
                    width: '100%',
                    layout: 'border',
                    items: [{
                        region: 'center',
                        width: '45%',
                        heigth: '100%',
                        layout: 'fit',
                        //frame:true,
                        tbar: [vistaTarifa.btnAdicionarTarifa, vistaTarifa.btnModificarTarifa, vistaTarifa.btnEliminarTarifa],
                        items: [vistaTarifa.gpTarifa]
                    }/*,{
								region:'center',
								width: '55%', 
								heigth: '100%',
								layout:'fit',
								//frame:true,
								//tbar:[vistaBusqdaHistorico.btnAdicionarVariable, vistaBusqdaHistorico.btnModificarVariable, vistaBusqdaHistorico.btnEliminarVariable],
								items:[vistaBusqdaHistorico.formularioHistorico]
							}*/]

                }, {
                    rowHeight: .65,
                    width: '100%',
                    //frame:true,
                    layout: 'fit',
                    items: [this.tabPanelEscala]
                }]
            }
            ]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('nomconceptopercepciondescuento', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Nomencladores.ConceptoPD.Modelo;
    modelo.init();

    //Inicializando la vista de gestionar concepto.
    var vistaConcepto = Pvd.Nomina.Nomencladores.ConceptoPD.VistaConcepto;
    vistaConcepto.init(perfil, idioma, modelo);

    //Inicializando la vista de gestionar tarifas.
    var vistaTarifa = Pvd.Nomina.Nomencladores.ConceptoPD.VistaTarifa;
    vistaTarifa.init(perfil, idioma, modelo);

//    //Inicializando la vista de gestionar variables auxiliares.
//    var vistaBusqdaHistorico = Pvd.Nomina.Nomencladores.ConceptoPD.VistaBusqdaHistorico;
//    vistaBusqdaHistorico.init(perfil, idioma, modelo);

    //Inicializando la vista de gestionar variables auxiliares.
    var vistaVarAuxiliar = Pvd.Nomina.Nomencladores.ConceptoPD.VistaVariableAuxiliar;
    vistaVarAuxiliar.init(perfil, idioma, modelo);

    //Inicializando la vista de gestionar estructura escalar.
    var vistaEstEscalar = Pvd.Nomina.Nomencladores.ConceptoPD.VistaEstructuraEscalar;
    vistaEstEscalar.init(perfil, idioma, modelo);

    //Inicializando la vista de gestionar adyacentes.
    var vistaAdyacente = Pvd.Nomina.Nomencladores.ConceptoPD.VistaAdyacente;
    vistaAdyacente.init(perfil, idioma, modelo);

    //Inicializando la vista de gestionar escalas.
    var vistaEscala = Pvd.Nomina.Nomencladores.ConceptoPD.VistaEscala;
    vistaEscala.init(perfil, idioma, modelo);

    //Inicializando la vista principal.
    var vista = Pvd.Nomina.Nomencladores.ConceptoPD.VistaPrincipal;
    vista.init(perfil, idioma, modelo, vistaConcepto, vistaTarifa, null, vistaVarAuxiliar, vistaEstEscalar, vistaAdyacente, vistaEscala);

    //Inicializar controlador.
    Pvd.Nomina.Nomencladores.ConceptoPD.Controlador.init(idioma, vista, vistaConcepto, vistaTarifa, null, vistaVarAuxiliar, vistaEstEscalar, vistaAdyacente, vistaEscala, modelo);
});