/**
 * @name configuracion.controller - Controlador de la vista de la interfaz.
 * @package   Pvd.Capacitacion
 * @uses      Pvd.Capacitacion.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Eddy Santana Navarro
 * @version   1.0
 */
Ext.ns('Pvd.Capacitacion.Configuracion');
Pvd.Capacitacion.Configuracion.Controlador = {
    init: function(idioma, vista, modelo) {
        var itemTab = new Array(); //Inicializando arreglos de elementos del TabPanel
        //Evento click en el menú
        vista.tpMenu.on('click', function(n){
            if (n.isLeaf()) {
                if (!Ext.isEmpty(n)) {
                    var nodeUI = n.ui;
                    nodeUI.checked = true;
                    nodeUI.checkbox.checked = true;
                    nodeUI.checkbox.defaultChecked = true;
                    n.attributes.checked = true;
                    cargarPanel(n);
                }
            }
        });

        vista.tabPanel.on('remove', function(container, cmp){
            vista.tpMenu.getNodeById(cmp.id).getUI().toggleCheck(false);
        });

        vista.tpMenu.on('checkchange', function(node, ch){
            if (ch == true) {
                cargarPanel(node);
            }  else {
                vista.tabPanel.remove(node.id);
            }
        });

        /**
         * @method cargarPanel - Carga el panel dado un elemento seleccionado en el menú.
         * @param node - Nodo seleccionado en el menú(TreePanel).
         */
        function cargarPanel(node){
            if(!vista.tabPanel.getItem(node.id)) {
                if (node.id == 'modoformacion') {
                    var pModoFormacion = new Pvd.Capacitacion.Configuracion.Nomencladores.Modoformacion({idioma:idioma});
                    vista.tabPanel.add(pModoFormacion);
                    itemTab.push(node.id);
                    pModoFormacion.doLayout();
                }
                if (node.id == 'indicadoramedir') {
                    var pIndicadorAMedir = new Pvd.Capacitacion.Configuracion.Nomencladores.Indicadoramedir({idioma:idioma});
                    vista.tabPanel.add(pIndicadorAMedir);
                    itemTab.push(node.id);
                    pIndicadorAMedir.doLayout();
                }
                if (node.id == 'necesidaddecapacitacion') {
                    var pNecesidadDeCapacitacion = new Pvd.Capacitacion.Configuracion.Nomencladores.Necesidaddecapacitacion({idioma:idioma});
                    vista.tabPanel.add(pNecesidadDeCapacitacion);
                    itemTab.push(node.id);
                    pNecesidadDeCapacitacion.doLayout();
                }
                if (node.id == 'curso') {
                    var pCurso = new Pvd.Capacitacion.Configuracion.Nomencladores.Curso({idioma:idioma});
                    vista.tabPanel.add(pCurso);
                    itemTab.push(node.id);
                    pCurso.doLayout();
                }
                if (node.id == 'limites01') {
                    var pLimites = new Pvd.Capacitacion.Configuracion.Configuraciones.Limites({idioma:idioma});
                    vista.tabPanel.add(pLimites);
                    itemTab.push(node.id);
                    pLimites.doLayout();
                }
                if (node.id == 'aseguramiento') {
                    var pAseguramiento = new Pvd.Capacitacion.Configuracion.Nomencladores.Aseguramiento({idioma:idioma});
                    vista.tabPanel.add(pAseguramiento);
                    itemTab.push(node.id);
                    pAseguramiento.doLayout();
                }
                if (node.id == 'tipoaccion') {
                    var pTipoAccion = new Pvd.Capacitacion.Configuracion.Nomencladores.TipoAccion({idioma:idioma});
                    vista.tabPanel.add(pTipoAccion);
                    itemTab.push(node.id);
                    pTipoAccion.doLayout();
                }
                if (node.id == 'periodo') {
                    var pPeriodo = new Pvd.Capacitacion.Configuracion.Nomencladores.Periodo({idioma:idioma});
                    vista.tabPanel.add(pPeriodo);
                    itemTab.push(node.id);
                    pPeriodo.doLayout();
                }
            }
            vista.tabPanel.setActiveTab(node.id);
        }
    }
};
