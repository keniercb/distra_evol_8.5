Ext.QuickTips.init();
Ext.ns('Ext.Persona');
/**
 * Inicializar la vista.
 *
 * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
 * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
 * @param modelo Modelo de la vista del modulo Gestionar comisiones (Tipo: Pvd.Seleccion.Gestionarcomisiones.Modelo).
 */
Ext.Persona.View = function (perfil, idioma, modelo) {
    this.id = Ext.id();
    this.init = function () {
        initPanelEstructura.call(this);
        initPanelPersonas.call(this);

        this.pPrincipal = new Ext.Panel({
            width: '80%',
            region: 'center',
            split: true,
            margins: '5 5 5 0',
            border: false,
            layout: 'fit',
            items: [this.pPersonas]
        });
        return this;
    };
    function initPanelEstructura() {

        this.pEstructura = new Ext.estructura.panel.PanelEstructura({
            title: idioma.pEstructura,
            region: 'west',
            //collapsed: true,
            collapsible: true,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            split: true
            //Otros parametros
            //inicial : codigo|id, Indica a partir de que estructura debe abrir el arbol
            //cargos: false, //Para que no salgan los cargos
            //checker: true | [2,7,9],  //Muestra si va user checked o restringe los elementos que solo pueden tener checked
            //checked: {
            //  id:       [100000011],
            //  concepto: [3]
            //}  //Marca chequeado todos o las estructuras especificas
            //limit: [1,2,3,4,5,6,7,8,9]  //Define los conceptos que no se deben expandir
            //menu: false //Muestra u oculta el context menu por defecto true
        });
    };
    function initPanelPersonas() {
        this.pActualidad = new Ext.Persona.gestionABM({
            idioma: idioma
        });

        this.pReservaCargo = new Ext.Persona.reservaCargo();

        this.gpListPersonaHist = new Ext.Persona.trayectoriaLaboral();

        //this.pContratacion = new Ext.Persona.Contratacion();

        this.pPersonas = new Ext.TabPanel({
            heigth: 200,
            activeTab: 0,
            items: [this.pActualidad, this.pReservaCargo, this.gpListPersonaHist]
        });
    };
};
(function () {
    var models = Ext.Persona.Model;
    models.init();
    var view = new Ext.Persona.View(perfil, Ext.MovimientoPersona.idioma, models).init();
    new Ext.Persona.Controller(Ext.MovimientoPersona.idioma, view, models);
    new Ext.Viewport({
        layout: 'border',
        items: [view.pEstructura, view.pPrincipal]
    });
})();
