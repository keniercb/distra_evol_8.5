<?php

/**
 * @class      GestplanconteoinventarioController
 * @package    Inventario
 * @subpackage comun_inv
 * @author     DGE
 * @copyright  XETID
 * @version    1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestplanconteoaftController extends BaseController
{

    private $plancontaftModel;

    public function init()
    {
        parent::init('log.aft.utilconteoaft');
    }

    public function gestplanconteoaftAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        // $this->arrayjs = array($this->serviciosAyuda->getJSAyuda());
        $this->initComponent('log.aft.utilconteoaft');
        $this->renderTemplate();
    }

    public function cargarSistemaAction()
    {
        $this->plancontaftModel->pruebaModelo();
    }

    public function getentidadAction()
    {
        //$datos = $this->estructuraHelper->getEstructura($this->global->Estructura->idestructura);
        $datos = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
        $result = array();
        $result['entidad'] = $datos[0]->denominacion;
        $result['identidad'] = $datos[0]->idestructura;
        $this->datos = $result;
    }
	
	public function cargarPlanesConteoAction()
    {
		$comunAft = ComunAFTModel::getInstance();
		$this->uiParams['idestructura'] = $comunAft->getIdsAreasHijas();		
		$planConteoModel = new GestPlanConteoModel();
		
        $source = $planConteoModel->cargarPlanesConteo($this->uiParams);
		$_sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
		
		
		foreach($source as &$plan){
			$area = $_sEstrComposicion->getAreasPorId($plan['idestructuraop']);
			$area = $area[0];
			$area = $area['denominacion'];
			$plan['area'] = $area;
		}
		
		$this->datos = $source;
        $this->cantidad = count($source);
    }
	
	public function adicionarPlanConteoAction()
    {
		$planConteoModel = new GestPlanConteoModel();
        $this->uiParams['data'] = Zend_Json::decode($this->uiParams['data']);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        $this->objectHelper->unsetArrayValues($this->uiParams,array('data'));
		
		$comunAft = ComunAFTModel::getInstance();
		$idestructuras = $comunAft->getIdsAreasHijas();
		
		foreach($idestructuras as $idestructura){
			$this->uiParams['idestructura'] = $idestructura;
			$bandera = $planConteoModel->crearPlanConteo($this->uiParams);
		}
		
		$this->success = $bandera;
    }
	
	public function eliminarPlanConteoAction()
    {
        //$param = Zend_Json::decode($this->uiParams['id']);
		
		$comunAft = ComunAFTModel::getInstance();
		$params['idestructura'] = $comunAft->getIdsAreasHijas();		
		$params['subsistema'] = 11;
		$planConteoModel = new GestPlanConteoModel();
		
        $source = $planConteoModel->cargarPlanesConteo($params);
		
		
		
		$arreliminados = array();
		foreach($source as $plan){
			if(in_array($plan['idplan'], $arreliminados)){
				continue;
			}
			$this->datos = $planConteoModel->eliminarPlanConteo($plan['idplan']);
			array_push($arreliminados, $plan['idplan']);
		}
    }
	
	public function confirmarPeriodoPlanAction()
    {
		$comunAft = ComunAFTModel::getInstance();
		$params['idestructura'] = $comunAft->getIdsAreasHijas();		
		$params['subsistema'] = 11;
		$planConteoModel = new GestPlanConteoModel();
		$conn = Zend_Registry::get('conexion');
		$estructura = 'Estructura';
        $idestructura = $this->global->$estructura->idestructura;
		$idperiodo = Zend_Json::decode($this->uiParams['idperiodo']);
        $idejerciciosubsistema = $this->configuracionHelper
        ->getEjercicioActualSubsistema($idestructura,11);
       	$sql = "select 
                pco.idplanconteom
                from mod_logistica.dat_planconteo pc
                inner join mod_logistica.dat_planconteom pco on pco.idplan = pc.idplan
                where pc.idestructuraop in (
                select 
                idfila
                    from mod_estructuracomp.nom_filaestruc nf 
                where  (select parent_path from mod_estructuracomp.nom_filaestruc where idfila = {$idestructura}) operator (public.@>)  nf.parent_path 
                
                ) and pco.estado = 1 and pc.idejercicio = {$idejerciciosubsistema} ";
         $resultsql = $conn->fetchAll($sql);
       	 $idplanescont = array_column($resultsql,'idplanconteom');

        $source = $planConteoModel->cargarPlanesConteo($params);
		foreach($source as $plan){
			$this->datos = $planConteoModel->confirmarPeriodoPlanConteo(
				$plan['idplanconteom'],
				$plan['idplan'],
				$idperiodo,
				$idplanescont
			);
		}
    }

    public function aprobarPeriodoPlanAction()
    {
		$comunAft = ComunAFTModel::getInstance();
		$params['idestructura'] = $comunAft->getIdsAreasHijas();		
		$params['subsistema'] = 11;
		$planConteoModel = new GestPlanConteoModel();
		$idperiodo = Zend_Json::decode($this->uiParams['idperiodo']);
		$conn = Zend_Registry::get('conexion');
		$estructura = 'Estructura';
        $idestructura = $this->global->$estructura->idestructura;
        $idejerciciosubsistema = $this->configuracionHelper
        ->getEjercicioActualSubsistema($idestructura,11);
       	$sql = "select 
                pco.idplanconteom
                from mod_logistica.dat_planconteo pc
                inner join mod_logistica.dat_planconteom pco on pco.idplan = pc.idplan
                where pc.idestructuraop in (
                select 
                idfila
                    from mod_estructuracomp.nom_filaestruc nf 
                where  (select parent_path from mod_estructuracomp.nom_filaestruc where idfila = {$idestructura}) operator (public.@>)  nf.parent_path 
                
                ) and pco.estado = 2 and pc.idejercicio = {$idejerciciosubsistema} ";
         $resultsql = $conn->fetchAll($sql);
       	 $idplanescont = array_column($resultsql,'idplanconteom');

        $source = $planConteoModel->cargarPlanesConteo($params);
		foreach($source as $plan){
			$this->datos = $planConteoModel->aprobarPeriodoPlanConteo(
				$plan['idplanconteom'],
				$plan['idplan'],
				$idperiodo,
				$idplanescont

			);
		}
    }
	
	public function anularPeriodoPlanAction()
    {
	
		$comunAft = ComunAFTModel::getInstance();
		$params['idestructura'] = $comunAft->getIdsAreasHijas();		
		$params['subsistema'] = 11;
		$planConteoModel = new GestPlanConteoModel();
		$idperiodo = Zend_Json::decode($this->uiParams['idperiodo']);
		$conn = Zend_Registry::get('conexion');
		$estructura = 'Estructura';
		$idestructura = $this->global->$estructura->idestructura;
        $idejerciciosubsistema = $this->configuracionHelper
		->getEjercicioActualSubsistema($idestructura,11);
		$sql = "select 
		pco.idplanconteom
		from mod_logistica.dat_planconteo pc
		inner join mod_logistica.dat_planconteom pco on pco.idplan = pc.idplan
		where pc.idestructuraop in (
		select 
		idfila
			from mod_estructuracomp.nom_filaestruc nf 
		where  (select parent_path from mod_estructuracomp.nom_filaestruc where idfila = {$idestructura}) operator (public.@>)  nf.parent_path 
		
		) and pco.estado = 2 and pc.idejercicio = {$idejerciciosubsistema} ";
 $resultsql = $conn->fetchAll($sql);
	$idplanescont = array_column($resultsql,'idplanconteom');
		
        $source = $planConteoModel->cargarPlanesConteo($params);
		foreach($source as $plan){
			$this->datos = $planConteoModel->anularPeriodoPlanConteo(
				$plan['idplanconteom'],
				$plan['idplan'],
				$idperiodo,
				$idplanescont
			);
		}
    }

    public function aplicarPorcientoPeriodosAction()
    {
        $param = Zend_Json::decode($this->uiParams['data']);
        $planConteoModel = new GestPlanConteoModel();
        $this->datos = $planConteoModel->aplicarPorcientoTodosPeridos($param['idplan'][0], $param['porciento']);
    }
}
