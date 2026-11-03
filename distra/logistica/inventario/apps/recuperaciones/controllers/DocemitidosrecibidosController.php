<?php
/**
 *  Esta clase controla la gestión de los productos de movimiento lento
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class DocemitidosrecibidosController extends BaseController
{
    private $serviciosAyuda;
    private $model;


    function init()
    {
        parent::init('log.inv.docemitidosrecibidos');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new DocEmitidosRecibidosModel();
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $alternativa = 0;
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['codigoAlternativa'] = $value['codigoiso'];
                $moneda['monedaalternativa'] = $value['idmoneda'];
            } else {
                $moneda['codigoContable'] = $value['codigoiso'];
                $moneda['monedacontable'] = $value['idmoneda'];
            }
        }
        $fecha = new DateTime();
        $this->view->uiVariables = array_merge(array(
                'alternativa' => $alternativa == 1 ? 'true' : 'false',
                'codigoContable' => "'" . "{$moneda['codigoContable']}" . "'",
                'codigoAlternativa' => "'" . "{$moneda['codigoAlternativa']}" . "'",
                'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
                'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'"
            ), $this->view->uiVariables
        );
    }

    public function gestdocemitidosrecibidosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.docemitidosrecibidos');
        $this->rendertemplate();
    }

    public function cargardepositosAction()
    {
        $datas = $this->model->loadDepositos();
        $this->datos = $datas['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function cargarTipoDocAction()
    {
        $datos = $this->model->devolverTipoDocumento($this->uiParams['criterio']);
        $this->datos = $datos;
        $this->cantidad = count($datos);
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function cargarClientesProveedoresAction()
    {
        $clientesProveedores=$this->model->devolverClientesProveedores($this->uiParams);
        $this->datos = $clientesProveedores['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

}
