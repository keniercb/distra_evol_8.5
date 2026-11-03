<?php

/**
 * @class      ConfiguracioninventarioService
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class ConfiguraciondelcodigoService extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getJsConfBalanceo()
    {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps
            . '/logistica/distribucion/configuracion/views/scripts/'
            . 'configuraciondelcodigo/configuraciondelcodigo.phtml';
        $js .= file_get_contents($dirPhtml);

        return $js;
    }
}