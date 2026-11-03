<?php
/**
 *
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */


if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class FacturasemitidasController extends BaseController
{
    private $mFacturasEmitidas;
    private $logistEstrucUbica;

    function init()
    {
        parent::init('log.fac.facturasemitidas');
        
        $this->mFacturasEmitidas = new FacturasEmitidasModel();
        $this->logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
    }

    public function gestacturasemitidasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->arrayjs = array(
            
            $this->serviciosCFG->mostrarNomencladoresGenerales(),
            $this->serviciosCFG->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.fac.facturasemitidas');
        $this->rendertemplate();
    }
    
    public function cargarActividadesExistentesAction(){
        $this->uiParams['start'] = $this->uiParams['start'] ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = $this->uiParams['limit'] ? $this->uiParams['limit'] : 30;
        $this->objectHelper->synchronize($this, $this->mFacturasEmitidas->cargarActividadesExistentes($this->uiParams));
    }


}
