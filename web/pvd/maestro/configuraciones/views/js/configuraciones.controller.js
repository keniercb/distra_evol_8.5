/**
 * @name configuracion.controller - Controlador de la vista de la interfaz.
 * @package   Pvd.Maestro
 * @uses      Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Orestes Rodríguez Lorenzo
 * @version   1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.Controlador = {
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
                var lang = {gen: idioma.generico, cte: null};
                //Nomencladores
                if (node.id == 'nomcargocomision') {
                    lang.cte = idioma.nomcargocomision;
                    var pNomCargoComision = new Pvd.Maestro.Configuraciones.NomCargoComision({idioma:lang});
                    vista.tabPanel.add(pNomCargoComision);
                    itemTab.push(node.id);
                    pNomCargoComision.doLayout();
                }
                if (node.id == 'pValorCualitativo') {
                    var pValorC = new Pvd.Maestro.Configuraciones.NomValorCualitativo({idioma:idioma});
                    vista.tabPanel.add(pValorC);
                    itemTab.push(node.id);
                    pValorC.doLayout();
                }
                if (node.id == 'pPeriodoVacacional') {
                    var pPeriodoVac = new Pvd.Maestro.Configuraciones.NomPeriodoVacaciones({idioma:idioma});
                    vista.tabPanel.add(pPeriodoVac);
                    itemTab.push(node.id);
                    pPeriodoVac.doLayout();
                }
                if (node.id == 'pEscala') {
                    var pEscala = new Pvd.Maestro.Configuraciones.Escala({idioma:idioma});
                    vista.tabPanel.add(pEscala);
                    itemTab.push(node.id);
                    pEscala.doLayout();
                }
                if (node.id == 'pidoneidad') {
                    var pidoneidad = new Pvd.Maestro.Configuraciones.ConfigIdoneidad({idioma:idioma});
                    vista.tabPanel.add(pidoneidad);
                    itemTab.push(node.id);
                    pidoneidad.doLayout();
                }
                //Configuraciones
                if (node.id == 'pEstructConcepto') {
                    var pEstructConcepto = new Pvd.Maestro.Configuraciones.EstructuraConcepto({idioma:idioma});
                    vista.tabPanel.add(pEstructConcepto);
                    itemTab.push(node.id);
                    pEstructConcepto.doLayout();
                }
                if (node.id == 'pCategOcupacional') {
                    var pCategOcupacional = new Pvd.Maestro.Configuraciones.CmpCategOcupacional({idioma:idioma});
                    vista.tabPanel.add(pCategOcupacional);
                    itemTab.push(node.id);
                    pCategOcupacional.doLayout();
                }
                if (node.id == 'pRegUnico') {
                    var pRegUnico = new Pvd.Maestro.Configuraciones.RegUnico({idioma:idioma});
                    vista.tabPanel.add(pRegUnico);
                    itemTab.push(node.id);
                    pRegUnico.doLayout();
                }
                if (node.id == 'pConfconceptos') {
                    var pConfconceptos = new Pvd.Maestro.Configuraciones.CmpConfConceptos({idioma:idioma});
                    vista.tabPanel.add(pConfconceptos);
                    itemTab.push(node.id);
                    pConfconceptos.doLayout();
                }if (node.id == 'pAprueba') {
                    var pAprueba = new Pvd.Maestro.Configuraciones.CmpApruebaElabora({idioma:idioma});
                    vista.tabPanel.add(pAprueba);
                    itemTab.push(node.id);
                    pAprueba.doLayout();
                }
                if (node.id == 'pConfCamposConcepto') {
                    var pConfCamposConcepto = new Pvd.Maestro.Configuraciones.CmpConfCamposConcepto({idioma:idioma});
                    vista.tabPanel.add(pConfCamposConcepto);
                    itemTab.push(node.id);
                    pConfCamposConcepto.doLayout();
                }
                if (node.id == 'pPieFirma') {
                    var pPieFirma = new Pvd.Maestro.Configuraciones.CmpPieFirma({idioma:idioma});
                    vista.tabPanel.add(pPieFirma);
                    itemTab.push(node.id);
                    pPieFirma.doLayout();
                }
                if (node.id == 'pImportarExcel') {
                    var CmpImportarExcel = new Pvd.Maestro.Configuraciones.CmpImportarExcel({idioma:idioma});
                    vista.tabPanel.add(CmpImportarExcel);
                    itemTab.push(node.id);
                    CmpImportarExcel.doLayout();
                }
                if (node.id == 'pNotificacion') {
                    var CmpNotificacion = new Pvd.Maestro.Configuraciones.CmpNotificacion({idioma:idioma.confnotificacion});
                    vista.tabPanel.add(CmpNotificacion);
                    itemTab.push(node.id);
                    CmpNotificacion.doLayout();
                }
                if (node.id == 'pComision') {
                    var pComision = new Pvd.Maestro.Configuraciones.Comision({idioma:idioma});
                    vista.tabPanel.add(pComision);
                    itemTab.push(node.id);
                    pComision.doLayout();
                }
                if (node.id == 'pRangoEdades') {
                    var pRangoEdades = new Pvd.Maestro.Configuraciones.CmpRangoEdades({idioma:idioma});
                    vista.tabPanel.add(pRangoEdades);
                    itemTab.push(node.id);
                    pRangoEdades.doLayout();
                }
            }
            vista.tabPanel.setActiveTab(node.id);
        }
    }
}
