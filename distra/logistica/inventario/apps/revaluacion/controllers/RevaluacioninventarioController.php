<?php

/**
 * @class      RevaluacioninventarioController
 *
 * @package    Inventario
 * @subpackage Revaluacion
 * @author     Jorge Luis Cuellar Mondeja
 * @copyright  XETID
 * @version    2.0.1
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RevaluacioninventarioController extends BaseController
{
    private $model;
    private $idUsuario;

    public function init($cmp = 'log.inv.revaluacion')
    {
        parent::init($cmp);
        $this->model = new RevaluacioninventarioModel();
        $this->idUsuario = $this->global->Perfil->idusuario;
    }

    public function revaluacioninventarioAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.inv.revaluacion');
        $this->renderTemplate();
    }

    public function revaluarProductosAction()
    {
        try {
            $arrEstados = array(1, 2, 13);
            $datos = $this->model->getDocumentos($this->uiParams['start'], $this->uiParams['limit'], false, $arrEstados, true);
            if ($datos['total']) {
                $this->codigoMsg = 4;

            } else {
                $this->model->insertProductosEvaluacion();

            }

        } catch (Exception $e) {
            $this->codigoMsg = 3;
            $this->error = $e->getMessage();
        }
    }

    public function revisarEvaluacionProductosAction()
    {
        $this->model->revisarRevaluacion($this->idUsuario, $this->uiParams['idDeposito']);
    }

    public function aprobarEvaluacionProductosAction()
    {
        $this->model->aprobarRevaluacion($this->idUsuario, $this->uiParams['idDeposito']);
    }

    /**
     *  Mostrar los datos correspondientes a los documentos que serán anulados al realizarse la revaluación puesto que
     *  se encuentran en estado de Elaboración o Preparado.
     */
    public function getDocPendintesEvaluacionProductosAction()
    {
        $arrEstados = array(1, 2, 13);
        $datos = $this->model->getDocumentos($this->uiParams['start'], $this->uiParams['limit'], false, $arrEstados, false, $this->uiParams['identidad']);

        $this->datos = $datos['datos'];
        $this->cantidad = $datos['total'];
    }

    /**
     *  Mostrar los documentos que han sido anulados al realizarse la revaluación.
     */
    public function getDocAnuladosEvaluacionProductosAction()
    {
        $arrEstados = array(7);
        $datos = $this->model->getDocumentos($this->uiParams['start'], $this->uiParams['limit'], $this->uiParams['idestructura'], $arrEstados);

        $this->datos = $datos['datos'];
        $this->cantidad = $datos['total'];
    }

    /**
     *  Mostrar los productos ha evaluar.
     */
    public function getProductosEvaluacionAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;

        $datos = $this->model->getProductosEvaluacion($this->uiParams['start'], $this->uiParams['limit'], $this->uiParams['idestructura'], $this->uiParams['criterio']);

        $this->datos = $datos['datos'];
        $this->cantidad = $datos['total'];

        $this->evaluado = $datos['evaluado'];
        $this->revisado = $datos['revisado'];
        $this->aprobado = $datos['aprobado'];

        $this->impTotal = number_format($datos['impTotal'], 2, '.', ',');
        $this->impRevTotal = number_format($datos['impRevTotal'], 2, '.', ',');
        $this->difTotal = number_format($datos['difTotal'], 2, '.', ',');
    }

    public function getConfiguracionEvaluacionAction()
    {
        $configuracion = $this->model->getConfiguracionEvaluacion();

        $this->tasa = $configuracion->tasa;
        $this->coeficiente = $configuracion->coeficiente;
    }

    public function setConfiguracionEvaluacionAction()
    {
        try {
            $this->model->setConfiguracionEvaluacion($this->uiParams['tasa'], $this->uiParams['coeficiente']);

        } catch (Exception $e) {
            $this->codigoMsg = 3;
            $this->error = $e->getMessage();
        }

    }
    
    public function getEstructurasAction(){
        $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        $retorno = array('datos'=>$estructuras, 'cantidad'=>count($estructuras));
        $this->objectHelper->synchronize($this, $retorno);
    }
}
