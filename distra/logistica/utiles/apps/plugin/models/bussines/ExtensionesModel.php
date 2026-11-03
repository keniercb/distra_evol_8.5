<?php

/**
 * @class         ExtensionesModel
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Maricet Estevez
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
abstract class ExtensionesModel extends ZendExt_Model
{
    private $servConfig;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->servConfig = ServiciosConfiguracionGeneralHelper::__init();

    }

    abstract public function cargarDatos($parametros);


}
