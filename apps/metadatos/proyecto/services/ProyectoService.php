<?php

/**
 * Class CargoService
 */
class  ProyectoService extends ZendExt_Model
{
    /**
     * @var DatProyectoModel
     */
    var $proyecto;

    /**
     *
     */
    function __construct()
    {
        $this->proyecto = new DatProyectoModel();
    }
}
