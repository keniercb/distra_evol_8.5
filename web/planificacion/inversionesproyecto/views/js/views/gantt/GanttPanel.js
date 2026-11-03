Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.GanttPanel = ExtExtend.Class({
    $extend: Ext.Panel,    
    layout: 'border',
    border: false,
    region: 'center',
    initComponent: function () {
        // definicion de las variables
        var me = this;
        me.idCmp = this.id;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.GanttController();
        me.etiquetas = me.controller._getLabel('Gantt');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.perfil = me.controller._getGlobals('perfil');
        //parametros del concepto
        me.conceptoproyecto = {concepto: "DatEstudiogantt", campoid: "idestudiogantt", nativo: true};
        
        me.panelProyectoMap = new Planificacion.Integracion.PanelProyecto({
            concepto: me.conceptoproyecto,
            region: 'center',
            border: false
        });
        
        me.tabsProyecto = new Ext.TabPanel({            
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            plain: true,
            border: false,
            defaults: {autoScroll: true, layout: 'border', border: false},
            items: [{
                title: 'Proyectos',
                border: false,
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
            me.verProyectoGantt(record);
        });

        // items del panel
        me.items = [me.tabsProyecto];

        Planificacion.Integracion.GanttPanel.superclass.initComponent.call(me);
    },    
    verProyectoGantt: function (record) {
        var me = this;
        me.objproyecto = new DatGantt();
       
        if (record != null) {
            // obtener el tab del componente
            var cmp = Ext.getCmp('GanttComponent' + '&' + record.idproyecto);
            
            // si ye esta definido el tab solo lo debo activar
            if (cmp) {
                me.tabsProyecto.setActiveTab(cmp);
            }
            // en caso de no estar activo pues se realiza la peticion y se le adiciona al tabpanel de proyectos
            else {                
                // Setear el idproyecto al model del componente
                me.objproyecto.set('idproyecto', record.idproyecto);
                
                // Invocar a la ruta de obtener los datos del proyecto
                me.objproyecto.findBy();
                Secodena.mostrarMascara('cargarProyecto', 'Cargando...');
                
                // el objeto ha sido encontrado
                me.objproyecto.on("objetocargado", function (obj, resp) {
                    Secodena.ocultarMascara('cargarProyecto');
                    // instanciacon del componente
                    me.ganttComponente = new Planificacion.Integracion.GanttComponent({
                        id: 'GanttComponent' + '&' + record.idproyecto,
                        closable: true,
                        objproyecto: me.objproyecto,
                        controller: me.controller,
                        etiquetas: me.etiquetas,
                        perfil: me.perfil
                    });
                    // establecerle el titulo al tab
                    me.ganttComponente.setTitle(me.objproyecto.get('denominacion'));
                    // adicionar el tab y ponerlo activo
                    me.tabsProyecto.add(me.ganttComponente).show();
                });
                
                // el objeto no ha sido encontrado
                me.objproyecto.on("objetonoencontrado", function () {
                    Secodena.ocultarMascara('cargarProyecto');
                });
            }
        }
    }
});
Ext.reg('Planificacion.Integracion.GanttPanel', Planificacion.Integracion.GanttPanel);