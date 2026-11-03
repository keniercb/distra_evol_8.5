/**
 * Panel para el componente de Curvaconflicto
 *
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.CurvaconflictoPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    layout: 'border',
    border: false,
    region: 'center',
    initComponent: function () {
        // definicion de las variables
        var me = this;
        me.idCmp = this.id;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.CurvaconflictoController();
        me.etiquetas = me.controller._getLabel('Curvaconflicto');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        //parametros del concepto
        me.conceptoproyecto = {concepto: "DatEstudiocurvaconflicto", campoid: "idestudiocurvaconflicto", nativo: true};

        /**
         * Instanciacion del componente Planificacion.Integracion.PanelProyecto que contendra el listado de todos los proyectos
         * @param concepto: Objeto que contiene el modelo a salvar, id de la relacion y si es nativo
         * @param region: Region donde se mostrara el componente
         * @type {Planificacion.Integracion.PanelProyecto}
         *
         */
        me.panelProyectoCurvaconflicto = new Planificacion.Integracion.PanelProyecto({
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
                items: [me.panelProyectoCurvaconflicto]
            }],
            listeners: {
                tabchange: function (pTabP, pTab) {
                    pTab.doLayout();
                }
            }
        });

        // escuchar el evento "verproyecto" del componente "PanelProyecto" que permite ver los detalles del proyecto seleccionado
        me.panelProyectoCurvaconflicto.on('verproyecto', function (record) {
            me.verProyectoCurvaconflicto(record);
        });

        // items del panel
        me.items = [me.tabsProyecto];

        Planificacion.Integracion.CurvaconflictoPanel.superclass.initComponent.call(me);
    },
    /**
     * Permite ver los detalles del proyecto curva conflicto seleccionado
     * @copyright XETID Cuba
     * @param record
     */
    verProyectoCurvaconflicto: function (record) {
        var me = this;
        me.objproyecto = new DatCurvaconflicto();
        if (record != null) {
            // obtener el tab del componente
            var cmp = Ext.getCmp('CurvaconflictoComponent' + '&' + record.idproyecto);
            // si ye esta definido el tab solo lo debo activar
            if (cmp) {
                me.tabsProyecto.setActiveTab(cmp);
            }
            else {
                // en caso de no estar activo pues se realiza la peticion y se le adiciona al tabpanel de proyectos
                // Setear el idproyecto al model del componente
                me.objproyecto.set('idproyecto', record.idproyecto);
                // Invocar a la ruta de obtener los datos del proyecto
                me.objproyecto.findBy();
                Secodena.mostrarMascara('mses1', 'Cargando...');
                // el objeto ha sido encontrado
                me.objproyecto.on("objetocargado", function (obj, resp) {
                    Secodena.ocultarMascara('mses1');
                    // instanciacion del componente
                    me.curvaconflictoComponente = new Planificacion.Integracion.CurvaconflictoComponent({
                        id: 'CurvaconflictoComponent' + '&' + record.idproyecto,
                        objproyecto: me.objproyecto,
                        region: 'center',
                        closable: true,
                        conceptoproyecto: me.conceptoproyecto,
                        recordproyectos: {
                            nombreproyecto: record.denominacion,
                            idproyecto: record.idproyecto
                        }
                    });
                    // establecerle el titulo al tab
                    me.curvaconflictoComponente.setTitle(me.objproyecto.get('denominacion'));
                    // adicionar el tab y ponerlo activo
                    me.tabsProyecto.add(me.curvaconflictoComponente).show();
                });
                // el objeto no ha sido encontrado
                me.objproyecto.on("objetonoencontrado", function () {
                    Secodena.ocultarMascara('mses1');
                });
            }
        }
    }
});
Ext.reg('Planificacion.Integracion.CurvaconflictoPanel', Planificacion.Integracion.CurvaconflictoPanel);