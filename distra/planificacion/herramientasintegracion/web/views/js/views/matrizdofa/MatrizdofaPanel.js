/*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.MatrizdofaPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    layout: 'border',
    border: false,
    region: 'center',

    initComponent: function () {
        var me = this;
        me.idCmp = this.id;
        me.flag = '';
        var comps = ExtExtend.Components;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.etiquetas = me.controller._getLabel('Matrizdofa');
        me.directorioImagenes = me.controller._getGlobals('dirImg');


        me.conceptoProyecto = {concepto: "DatEstudiomatrizdofa", campoid: "idestudiomatrizdofa", nativo: true};
        me.listProyectos = new Planificacion.Integracion.PanelProyecto({concepto: me.conceptoProyecto, region: 'center'});


        me.tabGeneralMatrizDofa = new Ext.TabPanel({
            frame: false,
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            plain: true,
            defaults: {autoScroll: true, layout: 'border'},
            items: [
                {
                    title: me.etiquetas.proyectos,
                    items: me.listProyectos
                }
            ],
            listeners: {
                tabchange: function (pTabP, pTab) {
                    pTab.doLayout();
                }
            }

        });
        me.listProyectos.on('verproyecto', function (record) {
            me.verProyectoDofa(record);
        });

        me.items = [me.tabGeneralMatrizDofa];


        Planificacion.Integracion.MatrizdofaPanel.superclass.initComponent.call(me);
    },
    verProyectoDofa: function (record) {

        var me= this;
        me.objproyecto = new DatMatrizdofa();
        if(record != null){
            me.objproyecto.set('idproyecto', record.idproyecto);
            me.objproyecto.findBy();
            Secodena.mostrarMascara('mses1', 'cargando');
            me.objproyecto.on("objetocargado", function(obj, resp) {
                Secodena.ocultarMascara('mses1');
                if (!me.tabGeneralMatrizDofa.findById(me.objproyecto.get('idproyecto')+ me.idCmp)) {
                    var conceptoDofa = {concepto:'DatEstudiomatrizdofa',campoid:'idestudiomatrizdofa',idestudiomatriz: me.objproyecto.get('idestudiomatrizdofa')};
                    me.matrizdofa = new Planificacion.Integracion.MatrizdofaComponent({
                        objproyecto: me.objproyecto,
                        //region: 'center',
                        closable: true,
                        concepto:conceptoDofa,
                        id: me.objproyecto.get('idproyecto') + me.idCmp
                    });
                    me.matrizdofa.setTitle(record.denominacion);
                    me.tabGeneralMatrizDofa.add(me.matrizdofa).show();
                }else{
                    me.tabGeneralMatrizDofa.setActiveTab(me.objproyecto.get('idproyecto') + me.idCmp);
                }
            });
            me.objproyecto.on("objetonoencontrado", function() {
                Secodena.ocultarMascara('mses1');
            });
        }

    }
});
Ext.reg('Planificacion.Integracion.MatrizdofaPanel', Planificacion.Integracion.MatrizdofaPanel);