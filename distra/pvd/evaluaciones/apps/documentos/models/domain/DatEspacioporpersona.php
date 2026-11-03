<?php

  /**
   * Created by PhpStorm.
   * User: Daymel
   * Date: 27-Oct-16
   * Time: 10:38 AM
   */
  class DatEspacioporpersona extends BaseDatEspacioporpersona
  {
    public function setUp()
    {
      parent::setUp();

    }

    public function verificarDatos($idpersona)
    {
      $query  = new Doctrine_Query ();
      $result = $query->select('espacio')->from('DatEspacioporpersona')->where(
        "idpersona = $idpersona"
      )->execute();
//      print_r($query->getSqlQuery());
//      die;

      return $result->toArray();
    }

    public function insertarDatos($idpersona, $espacio)
    {
      $obj            = new DatEspacioporpersona();
      $obj->idpersona = $idpersona;
      $obj->espacio   = $espacio;
      $obj->save();
    }
  }