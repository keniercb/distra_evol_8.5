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
class ConfiguracioninventarioService extends ZendExt_Model
{
    private $medel, $confInventario;
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new ConfiguracioninventarioModel();
        $this->confInventario = new ConfInventario();
    }

    public function getJsConfiguracion()
    {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps
        . '/logistica/inventario/configuracion/'
        . 'views/scripts/configuracioninventario/configuracioninventario.phtml';
        $js .= file_get_contents($dirPhtml);
        return $js;
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna la configuracion si existe
     *
     */
    public function devolverConfiguracion($idestructuracomun)
    {
        return $this->model->devolverConfiguracion($idestructuracomun);
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si la configuracion si existe
     *
     */
    public function existeConfiguracion($idestructuracomun)
    {
        return $this->confInventario->existeConfiguracion($idestructuracomun);
    }
    
     /**
     * @author Maricet Estevez
      *@params $idestructuracomun id de la entidad registrada
     * @return Retorna true si se va a utilizar ubicacion
     *
     */
    public function utilizarUbicacion($idestructuracomun)
    {
      return  $this->confInventario->utilizarUbicacion($idestructuracomun);
        
      
    }

    

}
