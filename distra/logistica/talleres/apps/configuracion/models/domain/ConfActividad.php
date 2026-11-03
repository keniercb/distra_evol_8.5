<?php

/**
 * @autor:Daniel Arias Espinosa
 */
class ConfActividad extends BaseConfActividad
{

    public function setUp()
    {
      $this->hasMany('DatActividadOrden', array('local' => 'idactividad', 'foreign' => 'idactividad'));
      $this->hasMany('ConfNorma', array('local' => 'idactividad', 'foreign' => 'idactividad'));
      $this->hasMany('ConfActividad', array('local' => 'idactividad', 'foreign' => 'idpadre'));
      $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
      $this->hasMany('DatTrabajoServicio', array('local' => 'idactividad', 'foreign' => 'idservicio'));
      $this->hasMany('ConfServicioArea', array('local' => 'idactividad', 'foreign' => 'idservicio'));
    }
}
