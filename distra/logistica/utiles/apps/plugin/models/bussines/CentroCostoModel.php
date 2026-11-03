<?php

/**
 * @class         CentroCostoModel
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Maricet Estevez
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class CentroCostoModel extends ExtensionesModel
{
    private $servContFinzas;

    public function __construct()
    {
        parent::__construct();
        $this->servContFinzas = ServiciosContabilidadFinanzasHelper::__init();
    }

    public function cargarDatos($parametros)
    {
        return $this->servContFinzas->obtenerCentrosCosto($this->global->Estructura->idestructura);
    }
}