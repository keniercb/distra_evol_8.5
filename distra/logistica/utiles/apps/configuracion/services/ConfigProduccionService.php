<?php

/**
 * Clase service para brindar servicios a los sistemas
 *
 * @package    Produccion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    1.0
 */
class ConfigProduccionService extends BaseModel
{

    public function __construct()
    {

    }

    /**
     * Funcion para cargar los js dinamicamente
     * en la phtml de la configuracion general
     *
     * @return content Retorna el contenido de la phtml de Contenedores
     */
    public function getJsConfig()
    {
        $dirPhtml = Zend_Registry::getInstance()->config->dir_aplication . '/logistica/utiles/configuracion/views/scripts/configuracionprod/configuracionprod.phtml';

        return file_get_contents($dirPhtml);
    }

}
