<?php

class DatEvalpersonaevaluacionfinal extends BaseDatEvalpersonaevaluacionfinal {

    private $query;
    
    public function __construct() {
        parent::__construct();
        $this->query = Doctrine_Manager::getInstance();
    }
    
    public function setUp() {
        parent::setUp();
    }

    public function getResultadosByProcesoModelo($idpreprocesoevaluativo, $idmodelo) {
        $sql = "SELECT pef.idpersonaevaluacion, pe.idrecurso, pef.resultado, pef.idmodelo, pe.estado
            FROM mod_evaluaciones.dat_evalpersonaevaluacionfinal pef
            INNER JOIN mod_evaluaciones.dat_evalpersonaevaluacion pe ON(pef.idpersonaevaluacion = pe.idpersonaevaluacion)
            WHERE pef.idmodelo = {$idmodelo} and pe.idpreprocesoevaluativo = {$idpreprocesoevaluativo}";
            
        $result = $this->query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
    
    public function getEvaluacionesByIdPersona($idpersona){		
        $sql = "SELECT dpe.denom as procesoevaluativo, ple.denom as planilla, pef.resultado, pe.idpersonaevaluacion
                FROM mod_evaluaciones.dat_evalpersonaevaluacionfinal pef
                left JOIN mod_evaluaciones.dat_evalpersonaevaluacion pe ON (pef.idpersonaevaluacion = pe.idpersonaevaluacion)
                left JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo ppe ON (ppe.idpreprocesoevaluativo = pef.idpreprocesoevaluativo)
                left JOIN mod_evaluaciones.dat_evaldefprocesoevaluativo dpe ON (dpe.iddefprocesoevaluativo = ppe.iddefprocesoevaluativo)
                left JOIN mod_evaluaciones.dat_evalplanillasevaluativas ple ON (ple.idplanilla = pe.idplanilla)
                WHERE pe.idpersonaevaluacion = {$idpersona}";
        $result = $this->query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        
        return $result;
    }

}

//fin clase 
?>


