
/*
 * Nomencladores.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Nomencladores
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Seleccion.Nomencladores');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Seleccion.Nomencladores.Controlador = {

    init: function(idioma, vista, modelo) {
        vista.tpMenuNomencladores.expandAll();
        var itemTab = new Array();

        vista.tpMenuNomencladores.on('collapse', function(){
            vista.tabPanel.doLayout();
        });

        vista.tpMenuNomencladores.on('expand', function(){
            vista.tabPanel.doLayout();
        });

        vista.tabPanel.on('remove', function(container, cmp){
            vista.tpMenuNomencladores.getNodeById(cmp.id).getUI().toggleCheck(false);
        });

        vista.tpMenuNomencladores.on('click', function(n){
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

        vista.tpMenuNomencladores.on('checkchange', function(node, ch){
            if (ch == true) {
                cargarPanel(node);
            }  else {
                vista.tabPanel.remove(node.id);
            }
        });

        function cargarPanel(node){
            if (!vista.tabPanel.getItem(node.id)) {
                var panelGest;
                if (node.id == 'viareclutamiento') {
                    panelGest = new Pvd.Seleccion.Nomencladores.ViaReclutamiento({idioma:idioma});
                } else if (node.id == 'motseguimiento') {
                    panelGest = new Pvd.Seleccion.Nomencladores.MotSeguimiento({idioma:idioma});
                } else if (node.id == 'valorescualitativos') {
                    panelGest = new Pvd.Seleccion.Nomencladores.ViaReclutamiento({idioma:idioma});
                } else if (node.id == 'tecnicas') {
                    panelGest = new Pvd.Seleccion.Nomencladores.TecSeleccion({idioma:idioma});
                } else if (node.id == 'comites') {
                    panelGest = new Pvd.Seleccion.Nomencladores.Comite({idioma:idioma});
                } else if (node.id == 'reincorporacion') {
                    panelGest = new Pvd.Seleccion.Nomencladores.MotReincorporacion({idioma:idioma});
                } else if (node.id == 'motivoexclusion') {
                    panelGest = new Pvd.Seleccion.Nomencladores.MotivoExclusion({idioma:idioma});
                }

                vista.tabPanel.add(panelGest);
                itemTab.push(node.id);
            }
            vista.tabPanel.setActiveTab(node.id);
        }
    }
};
