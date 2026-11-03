<?php

/**
 * @class      MunicionesController *
 * @package    Inventario
 * @subpackage Municiones
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class MunicionesController extends BaseController
{
    /**
     * Modelo de municiones.
     * @var MunicionesModel 
     */
    private $model,
        /**
         * @var LogisticaEstructuraUbicHelper
         */
        $ubicacionHelper;

    function init()
    {
        parent::init('log.inv.municiones');
        $this->ubicacionHelper = LogisticaEstructuraUbicHelper::__init();
        $this->model = new MunicionesModel();
    }

    function municionesAction()
    {
        $this->autoShow = false;
        $this->view->arrayJs = array(
            $this->configuracionHelper->obtenerJSVentanaIndicadore(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza(),
            $this->configuracionHelper->mostrarNomencladoresGenerales()
        );
        $this->render('municiones');
    }

    /**
     *  Devuelve las ubicaciones.
     */
    public function cargarDepositosAction()
    {
        $this->autoShow = false;
        if ($this->params['node'] == 0) {
            if ($this->params['tipo'] == 1) {
                $arrayDepositos = $this->ubicacionHelper->cargardepositos();
                $cont = 0;
                foreach ($arrayDepositos['depositos'] as $deposito) {
                    $cont = $cont + 1;
                    $obj = new stdClass();
                    $obj->id = $deposito['iddeposito'];
                    $obj->text = $deposito['deposito'];
                    $arbolDepositos[] = $obj;
                }
                echo json_encode($arbolDepositos);
            } elseif ($this->params['tipo'] == 2) {
                $idarea = $this->params['idarea'] ? $this->params['idarea'] : $this->global->Estructura->idestructura;
                echo json_encode($this->estructuraHelper->getEstructurasInternas($idarea));
            }
        }
    }

    /**
     * Devuelve las clasifaciones de municiones.
     */
    public function cargarMunicionesAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarMuniciones($this->uiParams));
    }

    /**
     *  Adiciona la clasifacion de municiones.
     */
    public function adicionarPartidaAction()
    {
        $this->uiParams = Zend_Json::decode($this->uiParams['data']);
        if ($this->uiParams['salida']) {
            $this->objectHelper->synchronize(
                $this, $this->model->adicionarPartidaSalida($this->uiParams['partidas'], $this->uiParams['afecta'])
            );
        } else {
            $this->objectHelper->synchronize(
                $this, $this->model->adicionarPartida($this->uiParams['partidas'], $this->uiParams['indice'], $this->uiParams['desglose'])
            );
        }
    }

    /**
     * Elimina las clasifaciones de municiones especificadas.
     */
    public function eliminarPartidaAction()
    {
        $this->uiParams['id'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize(
            $this, $this->model->eliminarPartida($this->uiParams['id'], $this->uiParams['afecta'])
        );
    }

    /**
     * Devuelve el fichero con los datos de las partidas.
     */
    public function cargarMunicionesExportarAction()
    {
        $this->unsetParam('limit');
        $this->unsetParam('start');
        $this->uiParams['pornombre'] = true;
        $this->objectHelper->synchronize($this, $this->model->crearExcelPartidas($this->uiParams));
    }

    /**
     * Aprueba las clasificaciones de municiones especificadas.
     */
    public function aprobarPartidaAction()
    {
        $this->uiParams['iddocumento'] = Zend_Json::decode($this->uiParams['iddocumento']);
        $this->objectHelper->synchronize(
            $this, $this->model->aprobarPartidaDesglose($this->uiParams['iddocumento'])
        );
    }
}