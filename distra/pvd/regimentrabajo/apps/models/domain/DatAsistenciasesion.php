<?php
class DatAsistenciasesion extends BaseDatAsistenciasesion
 { 
   public function setUp() 
    {   parent::setUp();
        $this->hasOne('DatAsistencia', array('local' => 'idasistencia', 'foreign' => 'idasistencia'));
    }
 
   

   public function InsertSesiones($arrDatos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "insert into mod_regimentrabajo.dat_asistenciasesion
                    (idasistencia,
                     idsesion,
                     fechahoraentrada,
                     fechahorasalida)
                  VALUES ".implode(',',$arrDatos).";";
        return $conn->execute($sql);
    }






}//fin clase 
?>