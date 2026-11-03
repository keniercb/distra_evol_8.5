<?php

/**
 * @class      ConfiguraciondistribucionController
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @modified   Yadrian Aguila Ferran
 * @copyright  XETID
 * @version    2.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConfiguracionpedidoController extends BaseController
{
    private $modelSetting, $idestructuraComun, $modelPlanConsumo;

    public function init()
    {
        parent::init('log.dist.configuracion');
        $this->idestructuraComun = $this->global->Estructura->idestructura;
        $this->modelSetting = new ConfiguraciondistribucionModel();
    }

    public function configuracionpedidoAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se salvo la configuracion correctamente
     */
    public function salvarconfiguracionAction()
    {
        $this->uiParams['idestructuracomun'] = $this->idestructuraComun;
        $this->modelSetting->salvarConfiguracion($this->uiParams);
        $this->success = true;
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna los datos de la configuracion en caso de existir
     */
    public function cargarconfigdistribucionAction()
    {
        $this->datos = $this->modelSetting->devolverConfiguracion($this->idestructuraComun);
    }


}
