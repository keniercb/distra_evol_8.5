<?php
/**
 * Esta clase controla la gestión de los lotes vencidos
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class FacturasenprocesoController extends BaseController
{

    private $serviciosAyuda,$facturasenproceso;

    function init()
    {
        parent::init('log.fac.facturasenproceso');
        
        $this->facturasenproceso=new FacturasEnProcesoModel();
    }

    public function gestFacturasenprocesoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $subsistemaInv = $this->serviciosLogisticaGlobal->estaAperturadoSubsistema(
            LogisticaGlobal::SUBSISTEMA_INV
        );
        
        $this->view->uiVariables = array_merge(
            [
                "subsistemaInv" => $subsistemaInv
            ], $this->view->uiVariables
        );
        $this->initComponent('log.fac.facturasenproceso');
        $this->rendertemplate();
    }

    public function getFacturasAction()
    {
        $this->uiParams['estado'] = json_decode($this->uiParams['estado']);
        $result = $this->facturasenproceso->cargarFacturasenproceso($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

}
