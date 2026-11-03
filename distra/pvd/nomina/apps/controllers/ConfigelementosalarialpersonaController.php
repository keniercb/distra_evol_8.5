<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
/**
 * Controlador para gestionar elementos salariales a las personas.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses 
 * @copyright UCID
 * @version 1.0
 */
class ConfigelementosalarialpersonaController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();   
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de nómina.
     */
    public function configelementosalarialpersonaAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }
   /*
    * Función para mostrar elementos en el grid de personas. 
    */   
    public function obtenerListadoPersonasAction() {
		$identidad = $this->_request->getPost('identidad');
		$objCargosOcupados = new DatCargosOcupados();
        $arrCargoOcup = $objCargosOcupados->obtenerListadoCargosOcupadosEntidad($identidad,15,0);
        //print_r($arrCargoOcup);die;
        $arrReturn = array();
        $arrCargos = array();
        $arrId = array();
        $pos=0;
        foreach ($arrCargoOcup as $n => $s) {
		   $arrId[0] = $s['idpersona'];
		   //$datospersona = ZendExt_IoC_Inter::getInstance()->pvd->DevolverPersonasPrincipalesPersonaById($arrId);
		   $arrReturn[$n]['idpersona'] = $s['idpersona'];
		   $arrReturn[$n]['numid'] = $datospersona[0]->numid;
		   $arrReturn[$n]['nombre'] = $datospersona[0]->nombre;
		   $arrReturn[$n]['snombre'] = $datospersona[0]->snombre;
		   $arrReturn[$n]['papel'] = $datospersona[0]->papel;
		   $arrReturn[$n]['sapel'] = $datospersona[0]->sapel;
		   $arrReturn[$n]['idsexo'] =$datospersona[0]->idsexo;
		   $arrReturn[$n]['idcategoriapersona'] = $datospersona[0]->idcategoriapersona;
		   $arrReturn[$n]['idcargo'] = $s['idcargo'];
		   $arrReturn[$n]['idsituacionlaboral'] = $s['idsituacionlaboral'];
		   $arrReturn[$n]['idcargosocupados'] = $s['idcargosocupados'];;
		}
		$cantTotalFinal= count($arrReturn);
		//print_r($arrReturn);die;
		echo Zend_Json::encode(array('datos' => $arrReturn, 'cantidad' => $cantTotalFinal));
	}
	
	public function obtenerListadoCargosAction(){
	  $idpersona = $this->_request->getPost('idpersona');
	  $identidad = $this->_request->getPost('identidad');
	  $limit = $this->_request->getPost('limit');
	  $start = $this->_request->getPost('start');
	  $objDomainCargosOcupados = new DatCargosOcupados();
	  $arrCargoOcupPersona = $objDomainCargosOcupados->obtenerListadoCargosOcupadosActual($idpersona, $identidad, $start, $limit);
	  $i=0;
	  $idcargo = 0;
	  $arrCargo = array();
	  $arrCargosSituacion = array();
	  foreach ($arrCargoOcupPersona as $n => $s) {
		$idcargo = $s['idcargo'];
		$arrCargo = $this->integrator->metadatos->DameEstructura($idcargo);
		$arrCargosSituacion[$i]['idcargo'] = $s['idcargo']; 
		$arrCargosSituacion[$i]['denomcargo'] = $arrCargo[0]->denominacion; 
		if($s['idsituacionlaboral'] != null){
		$arrCargosSituacion[$i]['idsituacionlaboral'] = $s['idsituacionlaboral']; 
		$arrCargosSituacion[$i]['denomsituacionlaboral'] = $s['denomsituacionlaboral']; 
	     }else{
	    $arrCargosSituacion[$i]['idsituacionlaboral'] = null; 
		$arrCargosSituacion[$i]['denomsituacionlaboral'] = "Sin situaci&oacute;n"; 
	    }
		$arrCargosSituacion[$i]['idcargosocupados'] = $s['idcargosocupados']; 
		$i++;
	   }
	    $cantTotalFinal= $objDomainCargosOcupados->cantdCargosOcupadosxPersona($idpersona, $identidad);
		echo Zend_Json::encode(array('datos' => $arrCargosSituacion, 'cantidad' => $cantTotalFinal));
	}
    
   /*
    * Función para mostrar elementos salariales de la situacion del servicio. 
    */
    public function obtenerListadoConfigElementoSalarialAction() {
		        $idpersona = $this->_request->getPost('idpersona');
		        $idcargo = $this->_request->getPost('idcargo');
		        $idcargoocupado = $this->_request->getPost('idcargoocupado');
		        $i=0;
		        $arr = array();
                $objModel = new ConfigElementoSalarialSituacionServicio();
                $arrelemsal = $objModel->obtenerElemSalPersonaCargoOcupado($idpersona, $idcargoocupado);
                /*
                 * Obteniendo el idelementosalarialcargo y asignandoselo al grid
                 */
                foreach ($arrelemsal as $valores => $valor) {
                $arr[$i]['idelementosalarialsituacionservicio'] = $valor['idelementosalarialsituacionservicio'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]['idsistemapago'] = $valor['idsistemapago'];
                $objDomainSistemaPago = new NomSistemaPago();
                $arrSistemaPago = $objDomainSistemaPago->obtenerObjSistemaPagoDadoId($valor['idsistemapago']);
                $arr[$i]['sistemapago'] = $arrSistemaPago['denominacion'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]['idperiodopago'] = $valor['idperiodopago'];
                $objDomainPeriodoPago = new NomPeriodoPago();
                $arrSistemaPago = $objDomainPeriodoPago->obtenerObjPeriodoPagoDadoId($valor['idperiodopago']);
                $arr[$i]['periodopago'] = $arrSistemaPago['denominacion'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]['idgrupoescala'] = $valor['idgrupoescala'];
                $objDomainGrupoEscala = new NomGrupoEscala();
                $arrGrupoEscala = $objDomainGrupoEscala->obtenerObjGrupoEscalaDadoId($valor['idgrupoescala']);
                $arr[$i]['grupoescala'] = $arrGrupoEscala['denominacion'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]['idsectorsalarial'] = $valor['idsectorsalarial'];
                $objDomainSectorSalarial = new NomSectorSalarial();
                $arrSector = $objDomainSectorSalarial->obtenerObjSectorDadoId($valor['idsectorsalarial']);
                $arr[$i]['sectorsalarial'] = $arrSector['denominacion'];
                /*
                 * Obteniendo el idsistemapago y la denominacion del sistema de pago y asignandoselo al grid
                 */
                $arr[$i]['idescalasueldocargo'] = $valor['idescalasueldocargo'];
                $objDomainEscalaSueldoCargo = new NomEscalaSueldoCargo();
                $arrEscalaSueldoCargo = $objDomainEscalaSueldoCargo->obtenerObjEscalaSueldoCargoDadoId($valor['idescalasueldocargo']);
                $arr[$i]['escalasueldocargo'] = $arrEscalaSueldoCargo['denominacion'];

                $arr[$i]['importe'] = $valor['importe'];
                $arr[$i]['fechainicio'] = $valor['fechainicio'];
                $arr[$i]['fechafin'] = $valor['fechafin'];
                $arr[$i]['idcargoocupado'] = $valor['idcargo'];
                $arr[$i]['idpersona'] = $valor['idpersona'];
                $i++;
			    }
			    $cantTotalFinal = count($arr);
           echo Zend_Json::encode(array('datos' => $arr, 'cantidad' => $cantTotalFinal));
    }
     /*
   * Función para mostrar elementos en el combo de denominacion del cargo. 
   */
    public function obtenerListadoFormularioSueldoPorCargoAction() {
           $idcargoocupado = $this->_request->getPost('idcargoocupado');
           $idescalasueldoporcargo = 0;
           $denominacionsector = "";
           $idsalarioespecifico = 0;
           $idsueldoporcargo = 0;
           $idelemsalcargo = 0;
           //$idsector = 0;
           $idsueldoporcargo = 0;
           $denomcargo = "";
           $importe = 0;
           $flag = 0;
           $arrayDatos = array();
           $objDomainNomSector = new NomSectorSalarial();
           $objDomainCargosOcupados = new DatCargosOcupados();
           $objDomainNomSalarioEspecifico = new NomSalarioEspecifico();
           $objDomainDatSueldoPorCargo = new DatSueldoPorCargo();
           $objDomainConfigElementoSalarialCargo = new ConfigElementoSalarialCargo();
           $objDomainConfigElementoSalarialSituacionServicio = new ConfigElementoSalarialSituacionServicio();
           $idcargo = $objDomainCargosOcupados->obtenerIdCargosXIdCargoOcupado($idcargoocupado);
           $existe = $objDomainConfigElementoSalarialSituacionServicio->existeConfElementoSalarialCargoOcupado($idcargoocupado);
           $existeElemSalCargo = $objDomainConfigElementoSalarialCargo->existeConfElementoSalarialCargoXIdCargo($idcargo);
           if($existe==1){
           $idelementosalarialsituacion = $objDomainConfigElementoSalarialSituacionServicio->obtenerIdElementoSalarialXIdCargosOcupados($idcargoocupado);
           $idescalasueldoporcargo = $objDomainConfigElementoSalarialSituacionServicio->obtenerIdEscalaSueldoCargoXIdCargosOcupados($idcargoocupado);
           if($idescalasueldoporcargo == 1 || $idescalasueldoporcargo == 3){
           //$idsector = $objDomainConfigElementoSalarialSituacionServicio->obtenerIdSectorSalarialXIdCargosOcupados($idcargoocupado);
           $importe = $objDomainConfigElementoSalarialSituacionServicio->obtenerImporteXIdCargosOcupados($idcargoocupado);
           //$denominacionsector = $objDomainNomSector->obtenerDenominacionXId($idsector);
           $arrayDatos['idsueldoporcargo'] = $idsueldoporcargo;
           //$arrayDatos['denominacionsector'] = $denominacionsector;
           $arrayDatos['elementosalarial'] = $idelementosalarialsituacion;
           $arrayDatos['denomcargo'] = $denomcargo;
           $arrayDatos['importe'] = $importe;
           $arrayDatos['flag'] = $flag;
	       }else{
		   $existeSueldoporCargo = $objDomainDatSueldoPorCargo->existeIdSueldoporCargoXIdElementoSalarialSituacion($idelementosalarialsituacion);
		   if($existeSueldoporCargo==1){
		   $idsueldoporcargo = $objDomainDatSueldoPorCargo->obtenerIdSueldoporCargoXIdElementoSalarialSituacion($idelementosalarialsituacion);
		   $idsalarioespecifico = $objDomainDatSueldoPorCargo->obtenerIdSalarioEspecificoXIdElementoSalarialSituacion($idelementosalarialsituacion);
		   //$idsector = $objDomainNomSalarioEspecifico->obtenerIdSectorXIdSalario($idsalarioespecifico);
		   //$denominacionsector = $objDomainNomSector->obtenerDenominacionXId($idsector);
		   $importe = $objDomainNomSalarioEspecifico->obtenerImporteXIdSalario($idsalarioespecifico);
		   $denomcargo = $objDomainNomSalarioEspecifico->obtenerDenomCargoXIdSalario($idsalarioespecifico);
		   $arrayDatos['idsueldoporcargo'] = $idsueldoporcargo;
		   //$arrayDatos['denominacionsector'] = $denominacionsector;
           $arrayDatos['elementosalarial'] = $idelementosalarialsituacion;
           $arrayDatos['denomcargo'] = $denomcargo;
           $arrayDatos['importe'] = $importe;
           $arrayDatos['flag'] = 3;
	       }else{
		   $flag = 1;
		   $arrayDatos['idsueldoporcargo'] = $idsueldoporcargo;
		   $arrayDatos['denominacionsector'] = "";
           $arrayDatos['elementosalarial'] = $idelementosalarialsituacion;
           $arrayDatos['denomcargo'] = "";
           $arrayDatos['importe'] = "";
           $arrayDatos['flag'] = $flag;
		   }
		   }
           }else if($existeElemSalCargo==1){
		   $idelemsalcargo = $objDomainConfigElementoSalarialCargo->obtenerIdElemSalCargo($idcargo);
		   $idescalasueldoporcargo = $objDomainConfigElementoSalarialCargo->obtenerIdEscalaSueldoCargoXIdElementoSalarial($idelemsalcargo);
		   if($idescalasueldoporcargo == 1 || $idescalasueldoporcargo == 3){
		   //$idsector = $objDomainConfigElementoSalarialCargo->obtenerIdSectorXIdElementoSalarial($idelemsalcargo);
		   //$denominacionsector = $objDomainNomSector->obtenerDenominacionXId($idsector);
		   $importe = $objDomainConfigElementoSalarialCargo->obtenerImporteXIdElementoSalarial($idelemsalcargo);
		   $arrayDatos['idsueldoporcargo'] = $idsueldoporcargo;
		   //$arrayDatos['denominacionsector'] = $denominacionsector;
           $arrayDatos['elementosalarial'] = $idelemsalcargo;
           $arrayDatos['denomcargo'] = $denomcargo;
           $arrayDatos['importe'] = $importe;
           $arrayDatos['flag'] = $flag;
	       }else{
		   $existeSueldoporCargo = $objDomainDatSueldoPorCargo->existeIdSueldoporCargoXIdElementoSalarialCargo($idelemsalcargo);
		   if($existeSueldoporCargo==1){
		   $idsueldoporcargo = $objDomainDatSueldoPorCargo->obtenerIdSueldoporCargoXIdElementoSalarialCargo($idelemsalcargo);
		   $idsalarioespecifico = $objDomainDatSueldoPorCargo->obtenerIdSalarioEspecificoXIdElementoSalarialCargo($idelemsalcargo);
		   $idsector = $objDomainNomSalarioEspecifico->obtenerIdSectorXIdSalario($idsalarioespecifico);
		   //$denominacionsector = $objDomainNomSector->obtenerDenominacionXId($idsector);
		   $importe = $objDomainNomSalarioEspecifico->obtenerImporteXIdSalario($idsalarioespecifico);
		   $denomcargo = $objDomainNomSalarioEspecifico->obtenerDenomCargoXIdSalario($idsalarioespecifico);
		   $arrayDatos['idsueldoporcargo'] = $idsueldoporcargo;
		   //$arrayDatos['denominacionsector'] = $denominacionsector;
           $arrayDatos['elementosalarial'] = $idelemsalcargo;
           $arrayDatos['denomcargo'] = $denomcargo;
           $arrayDatos['importe'] = $importe;
           $arrayDatos['flag'] = 4;
	       }else{
		   $flag = 2;
		   $arrayDatos['idsueldoporcargo'] = $idsueldoporcargo;
		   //$arrayDatos['denominacionsector'] = "";
           $arrayDatos['elementosalarial'] = $idelemsalcargo;
           $arrayDatos['denomcargo'] = "";
           $arrayDatos['importe'] = "";
           $arrayDatos['flag'] = $flag;
		   }
		   }
		   }else{
		   $flag = 5;
		   $arrayDatos['idsueldoporcargo'] = $idsueldoporcargo;
		   //$arrayDatos['denominacionsector'] = "";
           $arrayDatos['elementosalarial'] = $idelemsalcargo;
           $arrayDatos['denomcargo'] = "";
           $arrayDatos['importe'] = "";
           $arrayDatos['flag'] = $flag;
		   }
          echo(json_encode($arrayDatos));
    }
    
  public function obtenerListadoSectoresSalarialesAction() {
        $arrayAux = array();
        $desactivar = $this->_request->getPost('desactivar');
        if($desactivar==0){
        $objdomainNomSectorSalarial = New NomSectorSalarial();
        $array = $objdomainNomSectorSalarial->obtenerListadoSectores(0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idsectorsalarial'] = $valor['idsectorsalarial'];
            $arr[$valores]['denominacion'] = $valor['denominacion'];
        }
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
	    }else{
		$arrayfinal = array('datos' => $arrayAux, 'cantidad' => 0);
		echo(json_encode($arrayfinal));
		}
    }
  
  /*
   * Función para mostrar elementos en el combo de denominacion del cargo. 
   */
    public function obtenerListadoDenomCargoAction() {
        $idsector = $this->_request->getPost('idsector');
        $objdomain = New NomSalarioEspecifico();
        $array = $objdomain->obtenerListadoSalarioEspecifico($idsector, 0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idsalarioespecifico'] = $valor['idsalarioespecifico'];
            $arr[$valores]['denominacion'] = $valor['denominacioncargo'];
            $arr[$valores]['salario'] = $valor['salario'];
        }
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }
    
    public function adicionarSalarioEspecificoAction() {
        $idsalarioespecifico = $this->_request->getPost('idsalarioespecifico');
        $idelementosalarial = $this->_request->getPost('idelementosalarial');
        $flag = $this->_request->getPost('flag');
        $objDomainDatSueldoPorCargo = new DatSueldoPorCargo();
        if($flag==1){
		$objDomainDatSueldoPorCargo->idsalarioespecifico = $idsalarioespecifico;
		$objDomainDatSueldoPorCargo->idelementosalarialcargo = null;
		$objDomainDatSueldoPorCargo->idelementosalarialsituacionservicio = $idelementosalarial;
		$objDomainDatSueldoPorCargo->save();
		echo "{'codMsg':'1'}";
		}else{
		$objDomainDatSueldoPorCargo->idsalarioespecifico = $idsalarioespecifico;
		$objDomainDatSueldoPorCargo->idelementosalarialcargo = $idelementosalarial;
		$objDomainDatSueldoPorCargo->idelementosalarialsituacionservicio = null;
		$objDomainDatSueldoPorCargo->save();
		echo "{'codMsg':'1'}";
		}
        
    }
    
    public function modificarSalarioEspecificoAction() {
        $idsueldocargo = $this->_request->getPost('idsueldocargo');
        $idsalarioespecifico = $this->_request->getPost('idsalarioespecifico');
        $idelementosalarial = $this->_request->getPost('idelementosalarial');
        $flag = $this->_request->getPost('flag');
        $objDomainDatSueldoPorCargo = new DatSueldoPorCargo();
        $objTableDatSueldoPorCargo = $objDomainDatSueldoPorCargo->obtenerObjDatosSueldoPorCargo($idsueldocargo); 
        if($flag==3){
		$objTableDatSueldoPorCargo->idsalarioespecifico = $idsalarioespecifico;
		$objTableDatSueldoPorCargo->idelementosalarialcargo = null;
		$objTableDatSueldoPorCargo->idelementosalarialsituacionservicio = $idelementosalarial;
		$objTableDatSueldoPorCargo->save();
		echo "{'codMsg':'1'}";
		}else{
		$objTableDatSueldoPorCargo->idsalarioespecifico = $idsalarioespecifico;
		$objTableDatSueldoPorCargo->idelementosalarialcargo = $idelementosalarial;
		$objTableDatSueldoPorCargo->idelementosalarialsituacionservicio = null;
		$objTableDatSueldoPorCargo->save();
		echo "{'codMsg':'1'}";
		}
        
    }
    
  /*
   * Función para mostrar elementos en el combo de sistema de pago de la situacion del servicio. 
   */
   public function cargarSistemaPagoAction() {
        $objdomaiFormaP = new NomFormaPago();
        $formasP = $objdomaiFormaP->obtenerListadoFormasPago(0, 500);
        foreach ($formasP as $k => $v) {
            $objdomaiSistemaP = new NomSistemaPago();
            $arrHijos = $objdomaiSistemaP->obtenerListadoSistemasPago(0, 500, $v['idformapago']);

            $arr[$k]['id'] = "sector" . "" . $v['idformapago'] . "";
            $arr[$k]['text'] = $v['denominacion'];
            $arr[$k]['leaf'] = false;
            $arr[$k]['children'] = $this->cargarHijos($v['idformapago']);
        }
        //print_r($arr);die;
        echo (json_encode($arr));
        return;
    }

    function cargarHijos($idformapago) {
        $objdomaiSistemaP = new NomSistemaPago();
        $hijos = $objdomaiSistemaP->obtenerListadoSistemasPago(0, 500, $idformapago);
        foreach ($hijos as $m => $b) {
            $arreg[$m]['id'] = $b['idsistemapago'];
            $arreg[$m]['text'] = $b['denominacion'];
            $arreg[$m]['leaf'] = true;
        }
        return $arreg;
    }

   /*
   * Función para mostrar elementos en el combo de periodo de pago de la situacion del servicio. 
   */
    public function cargarPeriodoPagoAction() {
        $objdomain = New NomPeriodoPago();
        $array = $objdomain->obtenerListadoPeriodosPago(0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idperiodopago'] = $valor['idperiodopago'];
            $arr[$valores]['denominacion'] = $valor['denominacion'];
        }
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

   /*
   * Función para mostrar elementos en el combo de grupo escala de la situacion del servicio. 
   */
    public function cargarGrupoEscalaAction() {
        $objdomain = New NomGrupoEscala();
        $array = $objdomain->obtenerListadoGruposEscala(0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idgrupoescala'] = $valor['idgrupoescala'];
            $arr[$valores]['denominacion'] = $valor['denominacion'];
        }
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

   /*
   * Función para mostrar elementos en el combo de sector salarial de la situacion del servicio. 
   */
    public function cargarSectorSalarialAction() {
        $objdomain = New NomSectorSalarial();
        $array = $objdomain->obtenerListadoSectores(0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idsectorsalarial'] = $valor['idsectorsalarial'];
            $arr[$valores]['denominacion'] = $valor['denominacion'];
        }
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

   /*
   * Función para mostrar elementos en el combo de escala sueldo por cargo de la situacion del servicio. 
   */
    public function cargarEscalaSueldoxCargoAction() {
        /*$objdomain = New NomEscalaSueldoCargo();
        $array = $objdomain->obtenerListadoEscalaSueldoCargo(0, 50);
        foreach ($array as $valores => $valor) {
            $arr[$valores]['idescalasueldocargo'] = $valor['idescalasueldocargo'];*/
			$arr = array();
			$arr[0]['idescalasueldocargo'] = 3;
            $arr[0]['denominacion'] = 'Importe fijo';
        //}
		
        $arrayfinal = array('datos' => $arr, 'cantidad' => count($arr));
        echo(json_encode($arrayfinal));
    }

   /*
   * Función para el importe del elemento salarial de la situacion del servicio. 
   */
    function buscarImporteSalarioEscalaAction() {
        $objDomaiSalario = new NomSalarioEscala();
        $salario = $objDomaiSalario->obtenerSalariosEscalasByIdGrupoSector($this->_request->getPost('idgrupoescala'), $this->_request->getPost('idsectorsalarial'));
        if($salario == ""){
	       echo(json_encode(-1));
	     }else{
           echo(json_encode($salario));
	    }
    }

  /*
   * Función para adicionar una configuracion de elementos salariales a la situacion del servicio. 
   */
    public function adicionarConfigElementoSalarialAction() {
        $arrayidsituacionlaboral = Zend_Json::decode(stripslashes($this->_getParam('arrayidsituacionlaboral')));
        $idsistpago = $this->_request->getPost('idsistpago');
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $idgrupoescala = $this->_request->getPost('idgrupoescala');
        $idsector = $this->_request->getPost('idsector');
        $idescalasueldocargo = $this->_request->getPost('idescalasueldocargo');
        $importe = $this->_request->getPost('importe');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idcargoocupado = $this->_request->getPost('idcargoocupado');
        $idpersona = $this->_request->getPost('idpersona');
        $checked = $this->_request->getPost('checked');
		$objModel = new ConfigElementoSalarialSituacionServicioModel();
		 //Si viene checkeado para todas las personas
		if($checked=='true'){
		   $objCargosOcupados = new DatCargosOcupados();
            foreach ($arrayidsituacionlaboral as $i => $v){
                $listidcargosocupados = $objCargosOcupados->obtenerLisPerDadoIDSituacionServicio($v);
                //print_r($listidcargosocupados);die;
                foreach ($listidcargosocupados as $j => $k) {
                    $boolexiste = $objModel->existeConfElementoSalarialPersonaCargoOcupado($k['idpersona'], $k['idcargosocupados']);
                    if(!$boolexiste){
                        $objModel->adicionarElementoSalarial($idsistpago, $idperiodopago, $idgrupoescala, $idsector
                            , $idescalasueldocargo, $importe, $fechainicio, $fechafin, $k['idcargosocupados'], $k['idpersona']);
                    }
                }
            }
            echo "{'codMsg':'1'}";
		}else{
		  $boolexiste = $objModel->existeConfElementoSalarialPersonaCargoOcupado($idpersona, $idcargoocupado);
		  if(!$boolexiste){
			  $objModel->adicionarElementoSalarial($idsistpago, $idperiodopago, $idgrupoescala, $idsector
              , $idescalasueldocargo, $importe, $fechainicio, $fechafin, $idcargoocupado, $idpersona);			  
               //Mensaje a mostrar
               echo "{'codMsg':'1'}";
	           }else{
		       echo "{'codMsg':'2'}";   
		       }
		   
		}       
	}

   /*
    * Función para modificar una configuracion de elementos salariales a la situacion del servicio. 
    */
    public function modificarConfigElementoSalarialAction() {
        $arrayidsituacionlaboral = Zend_Json::decode(stripslashes($this->_getParam('arrayidsituacionlaboral')));
		$idelementosalarial = $this->_request->getPost('idelementosalarial');
        $idsistpago = $this->_request->getPost('idsistpago');
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $idgrupoescala = $this->_request->getPost('idgrupoescala');
        $idsector = $this->_request->getPost('idsector');
        $idescalasueldocargo = $this->_request->getPost('idescalasueldocargo');
        $importe = $this->_request->getPost('importe');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idcargoocupado = $this->_request->getPost('idcargoocupado');
        $idpersona = $this->_request->getPost('idpersona');
        $checked = $this->_request->getPost('checked');
        $objDomainDatSueldoPorCargo = new DatSueldoPorCargo();
        $objModel = new ConfigElementoSalarialSituacionServicioModel();
        if($checked==true){
            $objCargosOcupados = new DatCargosOcupados();
             foreach ($arrayidsituacionlaboral as $i => $v){
                 //print_r($listidcargosocupados);die;
                 $listidcargosocupados = $objCargosOcupados->obtenerLisPerDadoIDSituacionServicio($v);
                 foreach ($listidcargosocupados as $j => $k) {
                     $existeSueldoporCargo = $objDomainDatSueldoPorCargo->existeIdSueldoporCargoXIdElementoSalarialSituacion($idelementosalarial);
                     if($existeSueldoporCargo == 1){
                         $idsueldoporcargo = $objDomainDatSueldoPorCargo->obtenerIdSueldoporCargoXIdElementoSalarialSituacion($idelementosalarial);
                         $objTableDatSueldoPorCargo = $objDomainDatSueldoPorCargo->obtenerObjDatosSueldoPorCargo($idsueldoporcargo);
                         $objTableDatSueldoPorCargo->delete();
                         $objModel->modificarElementoSalarial($idelementosalarial, $idsistpago, $idperiodopago, $idgrupoescala, $idsector
                             , $idescalasueldocargo, $importe, $fechainicio, $fechafin, $k['idcargosocupados'], $k['idpersona']);

                         //Mensaje a mostrar
                         echo "{'codMsg':'1'}";
                     }
                 }
             }
        }else{
		$existeSueldoporCargo = $objDomainDatSueldoPorCargo->existeIdSueldoporCargoXIdElementoSalarialSituacion($idelementosalarial);
        if($existeSueldoporCargo == 1){
		$idsueldoporcargo = $objDomainDatSueldoPorCargo->obtenerIdSueldoporCargoXIdElementoSalarialSituacion($idelementosalarial);
		$objTableDatSueldoPorCargo = $objDomainDatSueldoPorCargo->obtenerObjDatosSueldoPorCargo($idsueldoporcargo);
		$objTableDatSueldoPorCargo->delete();
	    }

        $objModel->modificarElementoSalarial($idelementosalarial, $idsistpago, $idperiodopago, $idgrupoescala, $idsector
        , $idescalasueldocargo, $importe, $fechainicio, $fechafin, $idcargoocupado, $idpersona);

            //Mensaje a mostrar
            echo "{'codMsg':'1'}";
        }
    }

   /*
    * Función para eliminar una configuracion de elementos salariales a la situacion del servicio. 
    */
    public function eliminarConfigElementoSalarialAction() {
        $idelementosalarial = $this->_request->getPost('idelementosalarial');
        //Creando el modelo de negocio de gestion de tipos de nómina.
        $objModel = new ConfigElementoSalarialSituacionServicioModel();

        //Eliminando el tipo de nómina.
        $objModel->eliminarElementoSalarial($idelementosalarial);

        echo "{'codMsg':'1'}";
    }
    
   /*
    * Función para mostrar elementos en el grid de conceptos de la situación del servicio. 
    */
    function obtenerListadoConceptosPagoDescuentoAction(){
		$idcargo = $this->_request->getPost('idcargosocupados');
		$limit = $this->_request->getPost('limit');
		$start = $this->_request->getPost('start');
		//Creando el modelo de negocio de gestion de conceptos.
        $modeloNegocioConcepto = new ConfigConceptospdElementosSalarialesSituacionServicioModel();
        //Obteniendo el listado de conceptos.
        $conceptoPagoDescuento = $modeloNegocioConcepto->obtenerConceptospdElementoSalarialxElementoSalSituacion($idcargo, $start, $limit);
        $arrResult = array();
        $pos = 0;
        foreach ($conceptoPagoDescuento as $i => $v) {
                $arrResult[$pos]['idconceptpelementsalarialessituacionservicio'] = $v['idconceptpelementsalarialessituacionservicio'];
                
                $arrResult[$pos]['idconceptopercepciondescuento'] = $v['idconceptopercepciondescuento'];
                $objDomainConcepto = new NomConceptoPercepcionDescuento();
                $denomconcepto = $objDomainConcepto->obtenerDenomXId($v['idconceptopercepciondescuento']);
                $arrResult[$pos]['denomconceptopercepciondescuento'] = $denomconcepto;
                 
                $objConceptoPercD = $objDomainConcepto->obtenerObjConceptoDadoId($v['idconceptopercepciondescuento']);
                $idtipoconcepto = $objConceptoPercD->idtipoconceptopd;
                $arrResult[$pos]['idtipoconcepto'] = $idtipoconcepto;
                
                $objDomainTipoConcepto = new NomTipoConceptoPD();
                $denomTipoconcepto = $objDomainTipoConcepto->obtenerDenomXId($idtipoconcepto);
                $arrResult[$pos]['denomtipoconcepto'] = $denomTipoconcepto;
                                
                $arrResult[$pos]['idtarifa'] = $v['idtarifa'];
                $objTarifa = new NomTarifa();
                $denomTarifa  = $objTarifa->obtenerDenomXId($v['idtarifa']);
                $arrResult[$pos]['denomtarifa'] = $denomTarifa;
                $objConceptopdTarifa = new NomConceptoPDTarifa();
                $importeTarifa = $objConceptopdTarifa->obtenerImporteXIdConceptoTarifa($v['idtarifa'],$v['idconceptopercepciondescuento']);
                $arrResult[$pos]['importetarifa'] = $importeTarifa;
                $idformacalculoTarifa = $objConceptopdTarifa->obtenerIdFormaCalcXIdConceptoTarifa($v['idtarifa'],$v['idconceptopercepciondescuento']);
                if($idformacalculoTarifa == 1){
			      $objConceptopdTarifa = new NomConceptoPDTarifa();
                  $importeTarifa = $objConceptopdTarifa->obtenerImporteXIdConceptoTarifa($v['idtarifa'],$v['idconceptopercepciondescuento']);
                  $arrResult[$pos]['importetarifa'] = $importeTarifa;
			    }else{
				  $arrResult[$pos]['importetarifa'] = "";
				}
				
                $arrResult[$pos]['idformacalculo'] = $idformacalculoTarifa;
                $arrResult[$pos]['fechainicio'] = $v['fechainicio'];
                $arrResult[$pos]['fechafin'] = $v['fechafin'];
                $arrResult[$pos]['idcargo'] = $v['idcargosocupados'];
                $pos++;
          }
        
	   // print_r($arrResult);die;
        //Obteniendo la cantidad total de conceptos.
        $cantTotalFinal = $modeloNegocioConcepto->obtenerCantidadTotalConceptospdElementoSalarialxElementoSalSituacion($idcargo);

        //Imprimiendo el listado de conceptos.
        echo Zend_Json::encode(array('datos' => $arrResult, 'cantidad' => $cantTotalFinal));
    }
    
   /*
    * Función para mostrar elementos en el grid de escalas de la situación del servicio. 
    */
    function obtenerListadoEscalasAction(){
		$idconfconceptospdelementossalariales = $this->_request->getPost('idconfconceptospdelementossalariales');
		$idcargosocupados = $this->_request->getPost('idcargosocupados');
		$objDomainEscala = new ConfEscalaElementoSalarialSituacionServicio();
		$arr = $objDomainEscala->obtenerConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales);
		$arrResult = array();
		$objNomReferencia = new NomNomencladorReferencia();
		$objNomEscalaTarifa = new NomEscalaTarifa();
		$objDomainEstructuraEsc = new NomEstructuraEscalar();
		foreach ($arr as $i => $v) {
                $arrResult[$i]['idescalaelementosalarialsituacionservicio'] = $v['idescalaelementosalarialsituacionservicio'];
                $idescalatarifa = $v['idescalatarifa'];
                $arrResult[$i]['idescalatarifa'] = $idescalatarifa;
                $idestructura = $objNomEscalaTarifa->obtenerIdEstructuraXIdEscala($arrResult[$i]['idescalatarifa']);
                $idtipocampo = $objDomainEstructuraEsc->obtenerTipoCampoXId($idestructura);
                if($idtipocampo == 2){
				  $denomesc = $objNomEscalaTarifa->obtenerValorEscalarXIdEscala($arrResult[$i]['idescalatarifa']);
				  $arrResult[$i]['escala'] = $denomesc;
				}else{
				  $idnomreferencia = $objDomainEstructuraEsc->obtenerIdNomencladoXId($idestructura);
				  $valorescalar = $objNomEscalaTarifa->obtenerValorEscalarXIdEscala($idescalatarifa);
				  $tuplanomenclador = $objNomReferencia->obtenerTuplaNomenclador($idnomreferencia, $valorescalar);
				  $denominacionnom = $tuplanomenclador[0]['denominacion'];
				  $arrResult[$i]['escala'] = $denominacionnom;
				}
                
                $arrResult[$i]['idconceptopercepciondescuento'] = $v['idconceptopercepciondescuento'];
                $arrResult[$i]['importe'] = $v['importe'];
                $arrResult[$i]['fechainicio'] = $v['fechainicio'];
                $arrResult[$i]['fechafin'] = $v['fechafin'];
                $arrResult[$i]['idconceptpelementsalarialessituacionservicio'] = $v['idconceptpelementsalarialessituacionservicio'];
           }
		$cantTotalFinal = count($arrResult);
		echo Zend_Json::encode(array('datos' => $arrResult, 'cantidad' => $cantTotalFinal));
	}    
    
   /*
    * Función para mostrar elementos en el treecombo de escalas. 
    */
    function obtenerListadoEscalaXConceptoAction(){
		$idconceptopercepciondescuento = $this->_request->getPost('idconceptopercepciondescuento');
		$idconfconceptopercepciondescuento = $this->_request->getPost('idconfconceptopercepciondescuento');
		$idtarifa = $this->_request->getPost('idtarifa');
		$tipo = $this->_request->getPost('tipo');
		$arrArbol = array();
		$objConceptopdTarifa = new NomConceptoPDTarifa();
		$arrTarifa = $objConceptopdTarifa->obtenerTarifaXConceptoPD($idconceptopercepciondescuento, $idtarifa);
		$arbol = array();
		if(count($arrTarifa) > 0){
			$objEstructuraEscalar = new NomEstructuraEscalar();
			$arrEstructuraEscalar = $objEstructuraEscalar->obtenerListadoEstructurasEscalaresTipoEntradaPersonaCargo($arrTarifa[0]['idconceptopdtarifa']);
			$arrEstEscBuscar = array();
			$arrIds = array();
			$arrValoresEstEscBuscar = array();
			$objNomReferencia = new NomNomencladorReferencia();
		  $objConfEscala = new ConfEscalaElementoSalarial();
		  $idEscalaTarifa = $objConfEscala->obtenerIdEscalaXIdConfConceptoPD($idconfconceptopercepciondescuento);
		      foreach($arrEstructuraEscalar as $k => $v){
				   // if($v['idtipoentrada'] == 3 || $v['idtipoentrada'] == 4){
					$arrEstEscBuscar[] = $v['idestructuraescalar'];
					$arrValoresEstEscBuscar[$v['idestructuraescalar']]['tipocampo'] = $v['idtipocampo'];
					if($v['idtipocampo'] == 1){
						$arrValoresEstEscBuscar[$v['idestructuraescalar']]['valores'] = $objNomReferencia->ObtenerDatosNomenclador($v['idnomencladorreferencia'], null);
			   	        }
			   	 //   }else{
				 //   $arrIds[$k] = $v['idestructuraescalar'];
			        //}
			}
			//print_r($arrEstEscBuscar);die;
			if(count($arrEstEscBuscar)>0){
			$objEscalaTarifa = new NomEscalaTarifa();
			$arrEscalaTarifa = $objEscalaTarifa->obtenerEscalasTarifaPorIdsEstructuraEscalar($arrTarifa[0]['idconceptopdtarifa'], $arrEstEscBuscar);
			
			
			$arraux = array();
			foreach($arrEscalaTarifa as $n => $val){
			  if($val['idpadre'] == ""){
			   $arraux[$n] = $val;
			 }
			}
			$escalaTarifaHija = $objEscalaTarifa->obtenerEscalaTarifaXIdPadre($idEscalaTarifa);
			$arrayTipocampo = array();
		      foreach($arraux as $b => $arrnodos){
		      $idestrucesc = $arrnodos['idestructuraescalar'];
		      $tipoentrada = $objEstructuraEscalar->obtenerTipoEntrada($idestrucesc);
		      $tipocampo = $objEstructuraEscalar->obtenerTipoCampoXId($idestrucesc);
			  $arrayTipocampo['tipocampo'] = $tipocampo;
		      $counthijos = $objEscalaTarifa->countEscalaTarifaSituacionServicioXIdPadre($arrnodos['idescalatarifa']);
		      $leaf = ($counthijos > 0 ? false : true);
		      $nodo = $this->construirNodoEscala($arrnodos, $arrayTipocampo, $leaf);
		      $nodo['children'] = $this->construirArbolEscalas($arrEscalaTarifa, $arrnodos, $arrValoresEstEscBuscar);
              $arrArbol[] = $nodo; 
            }
		 }
	 }
	          echo json_encode($arrArbol);
	}
	
	private function buscarHijosArbol($idpadre, $arrEscalaTarifa){
		$arrHijos = array();
		foreach($arrEscalaTarifa as $k => $v){
			if($v['idpadre'] == $idpadre){
				$arrHijos[] = $v;
			}
		}
		return $arrHijos;
	}
	
	private function construirArbolEscalas($arrEscalaTarifa, $v, $arrValoresEstEscBuscar){
		$arrHijos = $this->buscarHijosArbol($v['idescalatarifa'], $arrEscalaTarifa);
		if(count($arrHijos) > 0){
			$arrArbol = array();
			foreach($arrHijos as $k => $h){
				$arrH = $this->buscarHijosArbol($h['idescalatarifa'], $arrEscalaTarifa);
				$leaf = (count($arrH) > 0 ? false : true);
				$n = $this->construirNodoEscala($h, $arrValoresEstEscBuscar[$h['idestructuraescalar']], $leaf);
				$n['children'] = $this->construirArbolEscalas($arrEscalaTarifa, $h, $arrValoresEstEscBuscar);
				$arrArbol[] = $n;
			}
			return $arrArbol;
		}else return null;
		
    }
    
    private function construirNodoEscala($nodoEscala, $arrEstEsc, $hoja){
		$denominacion = '';
		$objNomEscalaTarifa = new NomEscalaTarifa();
		$objDomainEstructuraEsc = new NomEstructuraEscalar();
		$objNomReferencia = new NomNomencladorReferencia();
		$arr = array();
		if($arrEstEsc['tipocampo'] == 1){
		  $denominacion = $nodoEscala['valorescalar'];
		  $arr['id']     = $nodoEscala['idescalatarifa'];
		  
		  $arr['leaf'] = $hoja;
		  $arr['qtip'] ='<b>'.$denominacion.'</b>';
		  $arr['importe'] = $nodoEscala['importe'];
		   $idestructura = $objNomEscalaTarifa->obtenerIdEstructuraXIdEscala($nodoEscala['idescalatarifa']);
           $idnomreferencia = $objDomainEstructuraEsc->obtenerIdNomencladoXId($idestructura);
           $valorescalar = $objNomEscalaTarifa->obtenerValorEscalarXIdEscala($nodoEscala['idescalatarifa']);
           $tuplanomenclador = $objNomReferencia->obtenerTuplaNomenclador($idnomreferencia, $valorescalar);
           $denominacionnom = $tuplanomenclador[0]['denominacion'];
           $arr['text']   = $denominacionnom;
           $arr['qtip'] ='<b>'.$denominacionnom.'</b>';
			
		}else{ 
		$denominacion = $nodoEscala['valorescalar'];
		
		$arr['id']     = $nodoEscala['idescalatarifa'];
		$arr['text']   = $nodoEscala['valorescalar'];
		$arr['leaf'] = $hoja;
		$arr['qtip'] ='<b>'.$nodoEscala['valorescalar'].'</b>';
		$arr['importe'] = $nodoEscala['importe'];
		
       }
       return $arr;
   }
    
   /*
    * Función para cargar elementos en el combo de conceptos de la situación del servicio. 
    */
    function cargarConceptospagodescuentoAction() {
        $modeloNegocioConcepto = new NomConceptoPercepcionDescuentoModel();
        $arrConcepto= $modeloNegocioConcepto->obtenerListadoTodosConceptosPD();
        //Imprimiendo el listado de conceptos.
        echo Zend_Json::encode(array('datos' => $arrConcepto, 'cantidad' => count($arrConcepto)));
        
    }
    
   /*
    * Función para cargar elementos en el combo de tarifas de la situación del servicio.  
    */
    function cargarTarifasAction() {
		$idconcepto = $this->_request->getPost('idconcepto');
        $modeloNegocioConcpdTarifa = new NomConceptoPDTarifaModel();
        $arrTarifas = $modeloNegocioConcpdTarifa->obtenerListadoTarifaConcepto($idconcepto);
        
        //Imprimiendo el listado de tarifas.
        echo Zend_Json::encode(array('datos' => $arrTarifas, 'cantidad' => count($arrTarifas)));
    }
    
   /*
    * Función para buscar el importe de la escala de la situación del servicio.  
    */
    function calcularImporteAction(){
	  $idescala = $this->_request->getPost('idescala');
	  $objDomainEscalaTarifa = new NomEscalaTarifa();
	  $idformacalculo = $objDomainEscalaTarifa->obtenerIdFormaCalculoXIdEscala($idescala);
	  $importe = ""; 
	   if($idformacalculo == ""){
		   $importe = -1;
		    }else if($idformacalculo == 1){
		       $importe = $objDomainEscalaTarifa->obtenerValorImporteXIdEscala($idescala);
		     }else{
	            $idformula = $objDomainEscalaTarifa->obtenerIdFormulaXIdEscala($idescala);
	            $arreglo = array();
	            $arreglo[0] = $idformula;
	            $rExpMat = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica($arreglo);
	            $importe = $rExpMat[0]['expresionamostrar'];
	         }
      echo Zend_Json::encode($importe);	
	}
    
   /*
    * Función para adicionar un concepto de la situación del servicio.  
    */
    function adicionarConceptoPagoDescuentoAction() {
		$idconcepto = $this->_request->getPost('idconcepto');
        $idtarifa = $this->_request->getPost('idtarifa');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idcargo = $this->_request->getPost('idcargosocupados');
        $checked = $this->_request->getPost('checked');
		$modelConfig = new ConfigConceptospdElementosSalarialesSituacionServicioModel();
		if($checked=="true"){
		$idsituacionlaboral = 19;
		//Busco los idcargosocupados de todas las personas que esten en servicio especial
		$sqlCargo = "select dcocp.idcargosocupados from mod_nomina.dat_cargosocupados dcocp 
							inner join mod_nomina.conf_elementosalarialsituacionservicio elem on (elem.idcargoocupado = dcocp.idcargosocupados)
							where dcocp.idsituacionlaboral = ?;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$arrIdsCOcup = $conn->fetchAll($sqlCargo, array($idsituacionlaboral));
		foreach($arrIdsCOcup as $cont=>$valor){
		$modelConfig->adicionarConceptospdElementosSalariales($idconcepto, $idtarifa, $fechainicio, $fechafin, 
        $valor['idcargosocupados']);
		}
		}else{
	    $modelConfig->adicionarConceptospdElementosSalariales($idconcepto, $idtarifa, $fechainicio, $fechafin, 
        $idcargo);
        }
        //Mensaje a mostrar
        echo "{'codMsg':'1'}";
        
            
    }
    
   /*
    * Función para modificar un concepto de la situación del servicio.  
    */
    function modificarConceptoPagoDescuentoAction() {
        $idconceptopdSituacion = $this->_request->getPost('idconceptopdSituacion');
        $idconcepto = $this->_request->getPost('idconcepto');
        $idtarifa = $this->_request->getPost('idtarifa');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idcargo = $this->_request->getPost('idcargosocupados');
        $modelConfig = new ConfigConceptospdElementosSalarialesSituacionServicioModel();
        $modelConfig->modificarConceptospdElementosSalariales($idconceptopdSituacion, $idconcepto, $idtarifa, 
        $fechainicio, $fechafin, $idcargo);
        //Mensaje a mostrar
        echo "{'codMsg':'2'}";
    }
    
   /*
    * Función para eliminar un concepto de la situación del servicio.  
    */
    function eliminarConceptoPagoDescuentoAction() {
//		$idconceptoPd = $this->_request->getPost('idconceptoPd');
		$arrayIdconceptoPd = Zend_Json::decode(stripslashes($this->_request->getPost('arrayIdconceptoPd')));
//      print_r($arrayIdconceptoPd);die;
		$checked = $this->_request->getPost('checked');
		
		$modelConfig = new ConfigConceptospdElementosSalarialesSituacionServicioModel();
		if($checked=="true"){
      for($i=0;$i<count($arrayIdconceptoPd);$i++){
        $idconceptoPd= $arrayIdconceptoPd[$i];
        $objConfigConceptospdElementosSalarialesSituacionServicio = new ConfigConceptospdElementosSalarialesSituacionServicio();
        $idconcepto = $objConfigConceptospdElementosSalarialesSituacionServicio->obtenerConceptospdxIdConf($idconceptoPd);
        $arrIdsConceptosConf = $objConfigConceptospdElementosSalarialesSituacionServicio->obtenerIDsConceptospdElementoSalarialxConcepto($idconcepto);
        foreach($arrIdsConceptosConf as $i=>$ids){
          $bool = $modelConfig->eliminarConceptospdElementosSalariales($ids['idconceptpelementsalarialessituacionservicio']);
        }
      }
		 echo "{'codMsg':'1'}";
		}else{
      for($i=0;$i<count($arrayIdconceptoPd);$i++){
        $idconceptoPd= $arrayIdconceptoPd[$i];
        $bool = $modelConfig->eliminarConceptospdElementosSalariales($idconceptoPd);
      }

        //Mensaje a mostrar
        if($bool == 2){
		 echo "{'codMsg':'3'}"; 
		}else{
       //Devolviendo una notificación de que todo ocurrió correctamente
         echo "{'codMsg':'1'}";
	    }
		}
        
        
    }
    
   /*
    * Función para adicionar una escala de la situación del servicio.  
    */
    function adicionarEscalaXConceptoAction(){
        $idestructuraescalar = $this->_request->getPost('idestructuraescalar');
        $idconceptopercepciondescuento = $this->_request->getPost('idconceptopercepciondescuento');
        $importe = $this->_request->getPost('importe');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idconceptpelementsalarialessituacionservicio = $this->_request->getPost('idconceptpelementsalarialessituacionservicio');
        $modelConfig = new ConfEscalaElementoSalarialSituacionServicioModel();
           $boolexiste = $modelConfig->existeConfEscalaElementoSalarialDadoIdConfConfepto($idconceptpelementsalarialessituacionservicio);
            if(!$boolexiste){
             $modelConfig->adicionarEscalaXConcepto($idestructuraescalar, $idconceptopercepciondescuento,$importe, 
             $fechainicio, $fechafin, $idconceptpelementsalarialessituacionservicio);
             //Mensaje a mostrar
             echo "{'codMsg':'1'}";
	       }else{
		     echo "{'codMsg':'2'}";   
		  }
	  }
    
    /*
    * Función para modificar una escala de la situación del servicio.  
    */
    function modificarEscalaXConceptoAction() {
        $idescalaelementosalarialsituacionservicio = $this->_request->getPost('idescalaelementosalarialsituacionservicio');
        $idestructuraescalar = $this->_request->getPost('idestructuraescalar');
        $idconceptopercepciondescuento = $this->_request->getPost('idconceptopercepciondescuento');
        $importe = $this->_request->getPost('importe');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $idconceptpelementsalarialessituacionservicio = $this->_request->getPost('idconceptpelementsalarialessituacionservicio');
        $modelConfig = new ConfEscalaElementoSalarialSituacionServicioModel();
        $modelConfig->modificarEscalaXConcepto($idescalaelementosalarialsituacionservicio, $idestructuraescalar, $idconceptopercepciondescuento,
        $importe, $fechainicio, $fechafin,  $idconceptpelementsalarialessituacionservicio);
        //Mensaje a mostrar
        echo "{'codMsg':'1'}";
	      
    }
   
    /*
    * Función para eliminar una escala de la situación del servicio.  
    */
    function eliminarEscalaXConceptoAction() {
		$idconfescalaelementosalarial = $this->_request->getPost('idconfescala');
		$modelConfig = new ConfEscalaElementoSalarialSituacionServicioModel();
		$modelConfig->eliminarEscalaXConcepto($idconfescalaelementosalarial);
        //Mensaje a mostrar
        echo "{'codMsg':'1'}";
     }
	 
	  function obtenerSituacionesServAction() {
	  $idsituacionlaboral = $this->_request->getPost('idsituacionlaboral');
      $denomsituacionlaboral = $this->_request->getPost('denominacion');

          $modeloSituacionLaorales = new NomSituacionLaboralModel();
          $arrSituaciones = $modeloSituacionLaorales->obtenerListadoDenomSituacionesLaborales();
         // print_r($arrSituaciones);die;
      echo json_encode(array('datos'=>$arrSituaciones, 'cantidad'=>count($arrSituaciones))) ;
	  }

     function exportarelementossalnoconfigAction() {
    $identidad = $this->_getParam('identidad');

    $objNomina = new ReporteElementoSalarialPersonaModel();
    $respuesta = $objNomina->exportarElementosSalNoConfig($identidad);



    echo Zend_Json::encode('ok');


  }
	  
	  
  }

