<?php

class DatEvalpersonaevaluacionfinalModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalpersonaevaluacionfinal $DatEvalpersonaevaluacionfinal) {
        $DatEvalpersonaevaluacionfinal->save();
    }
    
    public function Eliminar($idpreprocesoevaluativo, $idmodelo){
        $query = Doctrine_Manager::getInstance();
        $sql = "DELETE FROM mod_evaluaciones.dat_evalpersonaevaluacionfinal pef
            WHERE pef.idmodelo = {$idmodelo} and pef.idpreprocesoevaluativo = {$idpreprocesoevaluativo}";

        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    
    }


}

?>