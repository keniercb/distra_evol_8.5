/**
 * Fichero que contiene el objeto del Panel General del componente Causa y Efecto.
 * 
 * @author ohgonzalez 
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.Proyecto = ExtExtend.Class({
    $extend: Ext.Panel,
    layout: 'border',
    region: 'center',
    border: false,
    initComponent: function() {
        var _this = this;

        /**
         * Crear el objeto controller - CausaefectoController
         * @type Std.Base.Controller
         */
        _this.controller = (_this.controller) ? _this.controller : new Planificacion.Integracion.FmpeirmatrizController();

        /**
         * 
         * Crear el objeto idioma
         * @type json
         */
        _this.idioma = _this.controller._getLabel('MatrizFmPeir');

        /**
         * Instanciar los componentes comunes
         * @type function
         */
        _this.extendCmp = ExtExtend.Components;

        /**
         * Crear los datos necesarios para la vista inicial de proyectos/estudios
         * @type json
         */
        var conceptoProyecto = {
            concepto: "DatEstudiomatrizfmpeir",
            campoid: "idestudiomatrizfmpeir",
            nativo: true
        };

        /**
         * Instanciar el panel que contiene el listado de proyectos/estudios         
         * @type Planificacion.Integracion.PanelProyecto
         */
        var listProyectos = new Planificacion.Integracion.PanelProyecto({
            concepto: conceptoProyecto,
            controller: _this.controller,
            region: 'center'
        });

        // Capturar el evento 'verproyecto' para mostrar el proyecto/estudio
        listProyectos.on('verproyecto', function(record) {
            _this.mostrarProyecto(record.idproyecto, record.denominacion);
        });

        // Crear el tab principal  
        _this.tabProyectos = _this.obtenerProyectosTabPanel(listProyectos);

        _this.items = [_this.tabProyectos];

        Planificacion.Integracion.MatrizFmPanelIndicador.superclass.initComponent.call(Ext.apply(_this, arguments));
    },
    /**
     * Crear el tab principal con el listado de proyectos/estudios.
     * @param {Planificacion.Integracion.PanelProyecto} listProyectos
     * @returns {Ext.TabPanel}
     */
    obtenerProyectosTabPanel: function(listProyectos) {
        var _this = this;

        var tabProyecto = new Ext.TabPanel({
            frame: false,
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            plain: true,
            defaults: {
                autoScroll: true,
                layout: 'border'
            },
            items: [{
                    title: "Proyectos",
                    items: listProyectos
                }
            ],
            listeners: {
                tabchange: function(obj, tab) {
                    tab.doLayout();
                }
            }
        });

        return tabProyecto;
    },
    /**
     * Mostrar el tab correspondiente al proyecto/estudio
     * @param {string} idproyecto
     * @param {string} denominacion 
     */
    mostrarProyecto: function(idproyecto, denominacion) {
        var _this = this;

        var tabs = _this.tabProyectos.items.items;

        var flag = false;
        Ext.each(tabs, function(tab) {
            if (tab.title === denominacion) {
                flag = true;
            }
        });

        if (flag) {

        } else {

         
            var MatrizIntegracionLogica = new Planificacion.Integracion.MatrizIntegracionLogica({
                title: denominacion,
                extendCmp: _this.extendCmp,
                controller: _this.controller,
                idproyecto: idproyecto,
                denominacion:denominacion,
                closable: true
            });

            _this.tabProyectos.add(MatrizIntegracionLogica);
            _this.tabProyectos.activate(MatrizIntegracionLogica);


        }
    }
});
Ext.reg('Planificacion.Integracion.Proyecto', Planificacion.Integracion.Proyecto);



