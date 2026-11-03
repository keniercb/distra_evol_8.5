<?php
/**
 * Esta clase controla la gestión de los productos de movimiento lento
 * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class BalancecontableController extends BaseController
{
    private $serviciosAyuda, $balanceContable;
    private $serviciosDepositos;


    function init()
    {
        parent::init('log.inv.balancecontable');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->balanceContable = new BalancecontableModel();       
    }

    public function gestBalancecontableAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.balancecontable');
        $this->rendertemplate();
    }

    public function cargarDatosPrincipalesAction(){
		$fecha = $this->uiParams['fecha'];
		/*$fecha = */
	
		$this->datos = $this->balanceContable->getDatosPrincipales($fecha);
    }
    
    public function cargarBalanceAperturaAction(){
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'aperturaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $this->iddoc = $objDocPrim->iddoc;
        $this->datos = $this->balanceContable->getBalanceApertua();
    }
	
	public function operacionesPeridoAction(){
		$datos = $this->balanceContable->getOperaciones($this->uiParams);
		$this->datos = $datos['datos'];
		$this->cantidad = $datos['cantidad'];
	}

    public function adicionarBalanceAction($uiParams) {
        $this->uiParams['arrayCuentas'] = (array) Zend_Json::decode(
            $this->uiParams['arrayCuentas']
        );
        $datos = $this->balanceContable->adicionarBalance($this->uiParams);  
         
     }
     public function cargarHistorialBalanceAction(){
        $this->datos = $this->balanceContable->cargarHistorialBalance($this->uiParams);  
    }

}
