/*
 * Nomencladores.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.MovimientosLaborales.Nomencladores');

Pvd.MovimientosLaborales.Nomencladores.Controlador = {
    init: function(idioma, vista) {
        vista.tpMenuNomencladores.expandAll();

        vista.tpMenuNomencladores.on('collapse', function() {
            vista.tabPanel.doLayout();
        });

        vista.tpMenuNomencladores.on('expand', function() {
            vista.tabPanel.doLayout();
        });

        vista.tabPanel.on('remove', function(container, cmp) {
            vista.tpMenuNomencladores.getNodeById(cmp.id).getUI().toggleCheck(false);
        });

        vista.tpMenuNomencladores.on('click', function(n) {
            if (n.isLeaf()) {
                if (!Ext.isEmpty(n)) {
                    let nodeUI = n.ui;
                    nodeUI.checked = true;
                    nodeUI.checkbox.checked = true;
                    nodeUI.checkbox.defaultChecked = true;
                    n.attributes.checked = true;
                    cargarPanel(n);
                }
            }
        });

        vista.tpMenuNomencladores.on('checkchange', function(node, ch) {
            if (ch === true) {
                cargarPanel(node);
            } else {
                vista.tabPanel.remove(node.id);
            }
        });

        function cargarPanel(node) {
            if (!vista.tabPanel.getItem(node.id)) {
                let panel;
                switch (node.id) {
                    case 'situacion':
                        panel =  new Pvd.MovimientosLaborales.Nomencladores.Situacion({idioma:idioma});
                        break;
                    case 'motbaja':
                        panel = new  Pvd.MovimientosLaborales.Nomencladores.Motivobaja({idioma:idioma});
                        break;
                    case 'motmov':
                        panel = new Pvd.MovimientosLaborales.Nomencladores.Motivomovimiento({idioma:idioma});
                        break;
                    case 'tipocontrato':
                        panel = new Pvd.MovimientosLaborales.Nomencladores.Tipocontrato({idioma:idioma});
                        break;
                    case 'suplementos':
                        panel = new Pvd.MovimientosLaborales.Nomencladores.Suplementos({idioma:idioma});
                        break;
                    case 'configcomplementos':
                        panel = new Pvd.MovimientosLaborales.ComplementosSalariales({idioma:idioma});
                        break;
                    case 'configentidad':
                        panel = new Pvd.MovimientosLaborales.Nomencladores.ConfigEntidad({idioma:idioma});
                        break;
                    case 'procedencia':
                        panel = new Pvd.MovimientosLaborales.Nomencladores.Procedenciasocial({idioma:idioma});
                        break;
                    case 'plaboral':
                        panel = new Pvd.MovimientosLaborales.Nomencladores.ProgramaLaboral({idioma:idioma});
                        break;
                    case 'confignivelprep':
                        panel = new Pvd.MovimientosLaborales.CompNivelPreparacion({idioma:idioma});
                        break;
                    case 'configmotbaja':
                        panel = new Pvd.MovimientosLaborales.CmpConfigMotBaja({idioma: idioma});
                        break;
                    case 'mempleo':
                        panel = new Pvd.MovimientosLaborales.Nomencladores.CmpModalidadEmpleo({idioma: idioma});
                        break;
                    default: break;
                }
                vista.tabPanel.add(panel);
            }
            vista.tabPanel.setActiveTab(node.id);
        }
    }
};