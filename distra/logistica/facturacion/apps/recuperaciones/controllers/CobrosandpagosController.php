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

class CobrosandpagosController extends BaseController
{
    private $serviciosAyuda;
    private $mFacturasEmitidas;
    private $logistEstrucUbica;

    function init()
    {
        parent::init('log.fac.cobroandpago');
        
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
        $this->initComponent('log.fac.cobroandpago');
        $this->rendertemplate();
    }

    public function cargardepositosAction()
    {
        $depositos = $this->logistEstrucUbica->cargardepositos();
        $this->datos = $depositos['depositos'];
    }

    public function cargarClientTransportAction()
    {
        $depositos = $this->logistEstrucUbica->cargardepositos();
        $this->datos = $depositos['depositos'];
    }

}
