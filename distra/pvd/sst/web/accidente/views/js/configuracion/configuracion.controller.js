/**
 * @name configuracion.controller - Controlador de la vista de la interfaz.
 * @package   Pvd.Sst.Accidente
 * @uses      Pvd.Sst.Accidente.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Eddy Santana Navarro
 * @version   1.0
 */
Ext.ns('Pvd.Sst.Accidente.Configuracion');
Pvd.Sst.Accidente.Configuracion.Controlador = {
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
                if (node.id == 'tipoaccidente') {
                    var pTipoAccidente = new Pvd.Sst.Accidente.Configuracion.Nomencladores.Tipoaccidente({idioma:idioma});
                    vista.tabPanel.add(pTipoAccidente);
                    itemTab.push(node.id);
                    pTipoAccidente.doLayout();
                }
                if (node.id == 'formaaccidente') {
                    var pFormaAccidente = new Pvd.Sst.Accidente.Configuracion.Nomencladores.Formaaccidente({idioma:idioma});
                    vista.tabPanel.add(pFormaAccidente);
                    itemTab.push(node.id);
                    pFormaAccidente.doLayout();
                }
                if (node.id == 'partecuerpo') {
                    var pParteCuerpo = new Pvd.Sst.Accidente.Configuracion.Nomencladores.Partecuerpo({idioma:idioma});
                    vista.tabPanel.add(pParteCuerpo);
                    itemTab.push(node.id);
                    pParteCuerpo.doLayout();
                }
                if (node.id == 'tipoinvalidez') {
                    var pTipoInvalidez = new Pvd.Sst.Accidente.Configuracion.Nomencladores.Tipoinvalidez({idioma:idioma});
                    vista.tabPanel.add(pTipoInvalidez);
                    itemTab.push(node.id);
                    pTipoInvalidez.doLayout();
                }
                if (node.id == 'naturalezalesion') {
                    var pNaturalezaLesion = new Pvd.Sst.Accidente.Configuracion.Nomencladores.Naturalezalesion({idioma:idioma});
                    vista.tabPanel.add(pNaturalezaLesion);
                    itemTab.push(node.id);
                    pNaturalezaLesion.doLayout();
                }
                if (node.id == 'agente') {
                    var pAgente = new Pvd.Sst.Accidente.Configuracion.Nomencladores.Agente({idioma:idioma});
                    vista.tabPanel.add(pAgente);
                    itemTab.push(node.id);
                    pAgente.doLayout();
                }
                if (node.id == 'causaaccidente') {
                    var pCausaAccidente = new Pvd.Sst.Accidente.Configuracion.Nomencladores.Causaaccidente({idioma:idioma});
                    vista.tabPanel.add(pCausaAccidente);
                    itemTab.push(node.id);
                    pCausaAccidente.doLayout();
                }
            }
            vista.tabPanel.setActiveTab(node.id);
        }
    }
};
