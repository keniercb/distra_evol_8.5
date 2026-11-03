<?php

/**
 *  Esta clase
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class TablerocontrolController extends BaseController
{
   protected $rotacionService;
   protected $model;

    function init()
    {
        parent::init('log.lb.tablerocontrol');
        $this->model = new TablerocontrolModel();
    }

    public function tablerocontrolAction()
    {
        if (class_exists('RotacionService')) {
            $this->rotacionService = new RotacionService();
        }
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()

        );
        $monedas = (array) LogisticaGlobal::__init()->getMonedaEntidad();
        $monedas['codigoiso'] = "'". $monedas['codigoiso'] ."'";
        if(isset($monedas['codigoisoalt'])){
            $monedas['codigoisoalt'] = "'" . $monedas['codigoisoalt'] . "'";
        }
        $reserva = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_RESERVA);
        $parametros = array();
        if ($reserva) {
            $cfgReserva = new ConfreservaService();
            $cfg = $cfgReserva->obtenerConfiguracionGeneral();
            $idejercicio = $this->configuracionHelper->getEjercicioActualSubsistema(
                $cfg['idestructurapadre'], LogisticaGlobal::SUBSISTEMA_RESERVA
            );
            $arrayDelegaciones = $this->rotacionService->obtenerDelegaciones($cfg['idestructurapadre']);
            $delegaciones = implode(',', $arrayDelegaciones);
            $empresassubordinacion =
                implode(',', $this->rotacionService->obtenerHijosPorSubordinacion($arrayDelegaciones));
            $depositos = implode(',', $this->rotacionService->obtenerDespositosArbolInre());
            $this->view->uiVariables = array_merge(
                array('depositoreserva' => "'" . $depositos . "'", 'delegaciones' => "'" . $delegaciones . "'",
                    'hijossubordinacion' => "'" . $empresassubordinacion . "'", 'idejercicio' => $idejercicio),
                $this->view->uiVariables
            );
            $parametros['delegaciones'] = $delegaciones;
        }
        $sql = $this->model->getSqlGraficas($parametros);
        $this->view->uiVariables = array_merge(
            array('idestructura' => $this->global->Estructura->idestructura), $monedas, $sql, $this->view->uiVariables
        );
        $this->initComponent('log.lb.tablerocontrol');
        $this->rendertemplate();
    }
    
}
