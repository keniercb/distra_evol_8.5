<?php
/**
 *  Esta clase controla la gestión de los documentos en proceso
 * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class PedidospendcumplimientoController extends BaseController
{
    private $serviciosAyuda;

    private $docPedModel;
    private $sConfGeneral;

    function init()
    {
        parent::init('log.inv.pedidospendcumplimiento');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->docPedModel = new PedidospendcumplimientoModel();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function gestPedidospendcumplimientoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.inv.pedidospendcumplimiento');
        $this->rendertemplate();
    }

    public function cargarPedidosPendientesAction()
    {
        $this->uiParams['estado'] = 3;
        $res = $this->docPedModel->getDocumentos($this->uiParams);
        $this->datos = $res['datos'];
        $this->iddoc = $res['iddoc'];
        $this->cantidad = $res['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;

    }

    public function cargarClientesAction()
    {
        $respuesta = $this->docPedModel->cargarClientes($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->total = $respuesta['cantidad'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }
}