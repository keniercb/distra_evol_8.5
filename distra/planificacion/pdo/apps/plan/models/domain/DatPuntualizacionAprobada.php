<?php

/**
 * @author    Equipo Desarrollo
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatPuntualizacionAprobada extends BaseDatPuntualizacionAprobada {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatActividades', array('local' => 'idactividad', 'foreign' => 'idactividad'));
    }

  public function Buscar($idactividad)
  {
    $temp = $this->conn->getTable('DatPuntualizacionAprobada')
                       ->find($idactividad);
    return $temp;
  }
}

//fin clase 

