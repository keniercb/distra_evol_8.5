<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 01/10/2018
 * Time: 15:39
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}


class ListadobalanceController extends BaseController
{

    function init()
    {
        parent::init('log.aft.listadobalance');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
    }

    public function gestListadobalanceAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.listadobalance');
        $this->rendertemplate();
    }

    public function cargarDatosAction()
    {
        $model = new RecuperacionesModel();
        $parametros = $this->uiParams;
        $this->datos = $model->getDatosBalanceContable($parametros);
    }

    public function cargarEjercicioContabilidadAction(){
        try{
            $idEstructura = $this->global->Estructura->idestructura;
            $idEjercicioActual = $this->integrator->datosmaestros->ejercicioActualSubsistema($idEstructura, 4);
            $this->idejerciciocontabilidad = $idEjercicioActual;
            $this->codigoMsg = 1;
        }catch (Exception $exc){
            $this->codigoMsg = 3;
        }
    }
}