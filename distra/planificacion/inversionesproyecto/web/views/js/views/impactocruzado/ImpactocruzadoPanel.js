/*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.ImpactocruzadoPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    layout: 'border',
    border: false,
    region: 'center',
    initComponent: function () {
        var me = this;
        me.idCmp = this.id;
        comps = ExtExtend.Components;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.ImpactocruzadoController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        //parametros del concepto
        me.conceptoproyecto = {
            concepto: "DatEstudiomatrizimpactocruzado",
            campoid: "idestudiomatrizimpactocruzado",
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
        me.panelProyectoImpactoCruzado = new Planificacion.Integracion.PanelProyecto({
            concepto: me.conceptoproyecto,
            region: 'center'
        });

        /**
         * TabPanel para el listado de los proyectos del componente ImpactoCruzado y todos los proyectos asociados a el.
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
                items: [me.panelProyectoImpactoCruzado]
            }],
            listeners: {
                tabchange: function (pTabP, pTab) {
                    pTab.doLayout();
                }
            }
        });

        // escuchar el evento "verproyecto" del componente "PanelProyecto" que permite ver los detalles del proyecto seleccionado
        me.panelProyectoImpactoCruzado.on('verproyecto', function (record) {
            me.verProyectoImpactocruzado(record);
        });

        me.items = [me.tabsProyecto];

        Planificacion.Integracion.ImpactocruzadoPanel.superclass.initComponent.call(me);
    },
    /**
     * Permite ver los detalles del proyecto curva conflicto seleccionado
     * @copyright XETID Cuba
     * @param record
     */
    verProyectoImpactocruzado: function (record) {
        var me = this;
        me.objproyecto = new DatImpactocruzado();
        if (record != null) {
            // obtener el tab del componente
            var cmp = Ext.getCmp('ImpactocruzadoComponent' + '&' + record.idproyecto);
            // si ya esta definido el tab solo lo debo activar
            if (cmp) {
                me.tabsProyecto.setActiveTab(cmp);
            }
            else {

                // Setear el idproyecto al model del componente
                me.objproyecto.set('idproyecto', record.idproyecto);
                me.objproyecto.set('denominacion', record.denominacion);
                // Invocar a la ruta de obtener los datos del proyecto
                me.objproyecto.findBy();
                Secodena.mostrarMascara('estudio', 'Cargando...');
                // el objeto ha sido encontrado
                me.objproyecto.on("objetocargado", function (obj, resp) {
                    Secodena.ocultarMascara('estudio');
                    me.impactocruzadoComponente = new Planificacion.Integracion.ImpactocruzadoComponent({
                        id: 'ImpactocruzadoComponent' + '&' + record.idproyecto,
                        closable: true,
                        objproyecto: me.objproyecto,
                        denominacion: record.denominacion,
                        conceptoproyecto: me.conceptoproyecto
                    });
                    // establecerle el titulo al tab
                    me.impactocruzadoComponente.setTitle(record.denominacion);
                    // adicionar el tab y ponerlo activo
                    me.tabsProyecto.add(me.impactocruzadoComponente).show();
                });
                // el objeto no ha sido encontrado
                me.objproyecto.on("objetonoencontrado", function () {
                    Secodena.ocultarMascara('estudio');
                });
            }
        }
    }
});
Ext.reg('Planificacion.Integracion.ImpactocruzadoPanel', Planificacion.Integracion.ImpactocruzadoPanel);