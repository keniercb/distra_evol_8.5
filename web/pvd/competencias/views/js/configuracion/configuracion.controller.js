/**
 * @name configuracion.controller - Controlador de la vista de la interfaz.
 * @package   Pvd.Competencia
 * @uses      Pvd.Competencia.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Eddy Santana Navarro
 * @version   1.0
 */
Ext.ns('Pvd.Competencia.Configuracion');
Pvd.Competencia.Configuracion.Controlador = {
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
                if (node.id == 'nomcompetencia') {
                    var pCompetencia = new Pvd.Competencia.Configuracion.Nomencladores.Competencia({idioma:idioma});
                    vista.tabPanel.add(pCompetencia);
                    itemTab.push(node.id);
                    pCompetencia.doLayout();
                }
                if (node.id == 'nomclasificaciondecompetencia') {
                    var pClasificaciondecompetencia = new Pvd.Competencia.Configuracion.Nomencladores.Clasificaciondecompetencia({idioma:idioma});
                    vista.tabPanel.add(pClasificaciondecompetencia);
                    itemTab.push(node.id);
                    pClasificaciondecompetencia.doLayout();
                }
                vista.tabPanel.setActiveTab(node.id);
            }
        }
    }
}
