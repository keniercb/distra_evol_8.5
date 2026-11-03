<?php

class ConfOperacionesentidad extends BaseConfOperacionesentidad
{

    public function setUp()
    {
        $this->hasOne('NomOperaciones', array('local' => 'idnomoperaciones', 'foreign' => 'idnomoperaciones'));
        $this->hasOne('NomConceptoOperacion', array('local' => 'signo', 'foreign' => 'idconceptooperacion'));
        parent::setUp();
    }

    public function getOperaciones($idplantilla){
        try{
            $manager = Doctrine_Manager::getInstance();
            $conexion = $manager->getCurrentConnection();
            $query = "SELECT m1.* FROM mod_datosmaestros.conf_operacionesentidad m1
                      WHERE m1.idplantilla = $idplantilla";
            return $conexion->fetchAll($query);
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

}
