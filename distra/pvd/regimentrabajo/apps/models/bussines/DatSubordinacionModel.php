<?php

class DatSubordinacionModel extends ZendExt_Model
{
    private $datSubordinacion;

    function __construct()
    {
        $this->datSubordinacion = new DatSubordinacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /*
     * Obtener un listado de los datos
    */
    public function GetAllPersonasSubordinadas()
    {
      return $this->datSubordinacion->GetAllPersonasSubordinadas();
    }


}

