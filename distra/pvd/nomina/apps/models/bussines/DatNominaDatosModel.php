<?php
class DatNominaDatosModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function DatNominaDatosModel() {
        parent::ZendExt_Model();
    }

    /*Adiciona las nominas que se generan por periodo de pago*/    
    public function adicionarDatos($idnomina, $datos) {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        
        $objNominaDatos = new DatNominaDatos();
         $objNominaDatos->idnomina = $idnomina;
              
        $objNominaDatos->campos = serialize($datos->campos);
        $objNominaDatos->valores = serialize($datos->valores);
        $objNominaDatos->estructura = serialize($datos->estructura);
        $objNominaDatos->save();
        
        $conn->commit();
		return true;
    }

}
