<?php
class DatNominaAprobacionCertificacionModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function DatNominaAprobacionCertificacionModel() {
        parent::ZendExt_Model();
    }

    /*Adiciona las nominas que se generan por periodo de pago*/    
    public function adicionarCertificacionAprobacion($datos) {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();

        $objNominaAC = new DatNominaAprobacionCertificacion();
        $objNominaAC->idnomina 								= $datos['idnomina'];
        $objNominaAC->idcompartimentacionnomina 	= $datos['idcompartimentacionnomina'];
        $objNominaAC->operacionpermiso 					= $datos['operacionpermiso'];
        $objNominaAC->save();
        
        $conn->commit();
		return true;
    }

}
