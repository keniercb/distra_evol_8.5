/**
 * Panel para el componente de Curvaconflicto
 *
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.MapPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    layout: 'border',
    border: false,
    region: 'center',
    initComponent: function () {
        // definicion de las variables
        var me = this;
        me.idCmp = this.id;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MapController();
        me.etiquetas = me.controller._getLabel('Map');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        //parametros del concepto
        me.conceptoproyecto = (me.conceptoproyecto) ? me.conceptoproyecto : {
            concepto: "DatEstudiomatrizdanalisispolitico",
            campoid: "idestudiomatrizdanalisispolitico",
            nativo: true
        };

        /**
         * Instanciacion del componente Planificacion.Integracion.PanelProyecto que contendra el listado de todos los proyectos
         * @param controller: Controlador del componente
         * @param concepto: Objeto que contiene el modelo a salvar, id de la relacion y si es nativo
         * @param region: Region donde se mostrara el componente
         * @type {Planificacion.Integracion.PanelProyecto}
         *
         */
        me.panelProyectoMap = new Planificacion.Integracion.PanelProyecto({
            concepto: me.conceptoproyecto,
            region: 'center'
        });
        /**
         * TabPanel para el listado de los proyectos del componente Curvaconflicto y todos los proyectos asociados a el.
         * @type {Ext.TabPanel}
         */
        me.tabsProyecto = new Ext.TabPanel({
            frame: false,
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            plain: true,
            defaults: {autoScroll: true, layout: 'border'},
            items: [{
                title: 'Proyectos',
                items: [me.panelProyectoMap]
            }],
            listeners: {
                tabchange: function (pTabP, pTab) {
                    pTab.doLayout();
                }
            }
        });

        // escuchar el evento "verproyecto" del componente "PanelProyecto" que permite ver los detalles del proyecto seleccionado
        me.panelProyectoMap.on('verproyecto', function (record) {
            me.verProyectoMap(record);
        });

        // items del panel
        me.items = [me.tabsProyecto];

        Planificacion.Integracion.MapPanel.superclass.initComponent.call(me);
    },
    /**
     * Permite ver los detalles del proyecto modelo analisis politico seleccionado
     * @copyright XETID Cuba
     * @param record
     */
    verProyectoMap: function (record) {
        var me = this;
        me.objproyecto = new DatMap();
        if (record != null) {
            // obtener el tab del componente
            var cmp = Ext.getCmp('MapComponent' + '&' + record.idproyecto);
            // si ye esta definido el tab solo lo debo activar
            if (cmp) {
                me.tabsProyecto.setActiveTab(cmp);
            }
            else {// en caso de no estar activo pues se realiza la peticion y se le adiciona al tabpanel de proyectos
                // Setear el idproyecto al model del componente
                me.objproyecto.set('idproyecto', record.idproyecto);
                // Invocar a la ruta de obtener los datos del proyecto
                me.objproyecto.findBy();
                Secodena.mostrarMascara('mses1', 'Cargando...');
                // el objeto ha sido encontrado
                me.objproyecto.on("objetocargado", function (obj, resp) {
                    Secodena.ocultarMascara('mses1');
                    // instanciacon del componente
                    me.mapComponente = new Planificacion.Integracion.MapComponent({
                        id: 'MapComponent' + '&' + record.idproyecto,
                        objproyecto: me.objproyecto,
                        idestudiomap: resp[0].idestudiomatrizdanalisispolitico,
                        region: 'center',
                        closable: true,
                        conceptoproyecto: me.conceptoproyecto
                    });
                    // establecerle el titulo al tab
                    me.mapComponente.setTitle(me.objproyecto.get('denominacion'));
                    // adicionar el tab y ponerlo activo
                    me.tabsProyecto.add(me.mapComponente).show();
                });
                // el objeto no ha sido encontrado
                me.objproyecto.on("objetonoencontrado", function () {
                    Secodena.ocultarMascara('mses1');
                });
            }
        }
    }
});
Ext.reg('Planificacion.Integracion.MapPanel', Planificacion.Integracion.MapPanel);