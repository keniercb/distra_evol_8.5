<?php

/**
 * @class         ProveedoresModel
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Maricet Estevez
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class ProveedoresModel extends ExtensionesModel
{

    private $servConfig;

    public function __construct()
    {
        parent::__construct();
        $this->servConfig = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function cargarDatos($parametros)
    {

        if ($parametros['tipo'] == 'clientes') {
            return $this->servConfig->getClientesProveedorByParams(
                null, $this->global->Estructura->idestructura, true,
                true, false, $parametros, $parametros['start'], $parametros['limit']
            );
        } else {
            if ($parametros['tipo'] == 'proveedores') {
                return $this->servConfig->getClientesProveedorByParams(
                    null, $this->global->Estructura->idestructura, true,
                    false, true, $parametros, $parametros['start'], $parametros['limit']
                );
            }
        }
    }

}
