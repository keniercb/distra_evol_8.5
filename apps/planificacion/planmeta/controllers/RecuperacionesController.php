<?php

/**
 * Recuperaciones para planificacion
 * Controlador para gestionar los nomencladores
 *
 * @ package Planificación
 * @ subpackage Planificacion material
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class RecuperacionesController extends ZendExt_Controller_Secure {

    /**
     * funcion init()
     * Para inicializar el modulo
     *
     * @author Dionisdel Ponce Santana
     * */
    function init() {
        parent::init();
    }

    public function recuperacionesAction() {
        $this->render();
    }

    public function getEjerciciosAction() {
        $data = null;
        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        echo json_encode($data);
    }

    //CARGA ATRIBUTOS QUE SE NECESITAN PARA HACER LA RECUPERACION DEL BALANCE MATERIAL
    public function cargaInicialAction() {
        //servicio para obtener el id de la entidad que esta logueada
        $identidad = $this->global->Estructura->idestructura;

        $denoEntidad = $this->global->Estructura->denominacion;
        $compEntidad = DatEntidaddatosnomenclador::getComportamientoDadoEntidad(
                        $identidad
        );
        $entidadCB = NomIndicador::entidadEsCB($identidad);
        $entidadOD = NomIndicador::entidadEsOD($identidad);

        $formato = $this->integrator->datosmaestros->listarFormatos();
        foreach ($formato as $valor) {
            if ($valor->nombre == 'Indicadores') {
                $idformatoInd = $valor->idformato;
                $nombreFormatoInd = "Indicadores";
            }
        }
        if ($idformatoInd == '') {
            echo("{'codMsg':21 }");
        } else {
            echo json_encode(
                    array('identidad' => $identidad,
                        'idformatoInd' => $idformatoInd,
                        'nombreFormatoInd' => $nombreFormatoInd,
                        'entidadCB' => $entidadCB,
                        'entidadOD' =>
                        $entidadOD, 'denoEntidad' => $denoEntidad,
                        'compEntidad' => $compEntidad[0][identidaddatosnomenclador])
            );
        }
    }

    public function obtenerformatodocumentoAction() {
        $direccion = 'Location: http://' . $_SERVER['HTTP_HOST'] . '/' .
                'report_generator.php/api/getFormats';
        echo header($direccion);
    }

    public function listarPlanesAction() {
        $model = new DatPlanModel();
        $data = $model->listarplanes();
        echo json_encode($data);
    }

    public function listarEjerciciosAction() {
        $model = new NomEjercicioplanificacionModel();
        $data = $model->listarejercicios();
        echo json_encode($data);
    }

    public function listarCentrobalanceAction() {
        $model = new CentrodebalanceModel();
        $data = $model->listarTodos("CB");
        echo json_encode($data);
    }

    public function listarOrganosdemandantesAction() {
        $model = new CentrodebalanceModel();
        $data = $model->listarTodos("OD");
        echo json_encode($data);
    }

    public function listarNivelAction() {
        $data->data[] = array('idnivelarbol' => 1, 'nivelarbol' => 'Genérico');
        $data->data[] = array('idnivelarbol' => 2,
            'nivelarbol' => 'Subgenérico');
        $data->data[] = array('idnivelarbol' => 3,
            'nivelarbol' => 'Específico');
        $data->data[] = array('idnivelarbol' => 4, 'nivelarbol' => 'Surtido');
        echo json_encode($data);
    }

    public function listarOACEAction() {
        //$parametros->arrayidvia = $this->_request->getPost('idvia');
        $model = new NomOrganosatisfaceModel();
        $data = $model->listarOrganoSatisfaceSustitucionImp();
        echo json_encode($data);
    }

    public function listarViasadquisicionAction() {
        $model = new NomViaadquisicionModel();
        $data = $model->listarViaAdq();
        echo json_encode($data->data);
    }

    public function listarSRAction() {
        $model = new NomDatosnomencladorModel();
        $data = $model->listarSR();
        $arraysecotresramas = array();
        if (isset($data[0]['iddatosnomenclador'])) {
            foreach ($data as $pos => $sectorrama) {
                $arraysecotresramas[$pos]['idsector'] = $sectorrama['iddatosnomenclador'];
                $arraysecotresramas[$pos]['denominacion'] = $sectorrama['nom_datosnomenclador_denominacion'];
            }
        }
        echo json_encode($arraysecotresramas);
    }

    public function listarDestinosAction() {
        $model = new NomDatosnomencladorModel();
        $data = $model->listarDestinos();
        $arraydestinos = array();
        if (isset($data[0]['iddatosnomenclador'])) {
            foreach ($data as $pos => $destino) {
                $arraydestinos[$pos]['iddestino'] = $destino['iddatosnomenclador'];
                $arraydestinos[$pos]['denominacion'] = $destino['nom_datosnomenclador_denominacion'];
            }
        }
        echo json_encode($arraydestinos);
    }

    public function generarReporteAction() {
        $params['tipo'] = $_GET['tipo'];
        $params['formato'] = $_GET['formato'];
        RecuperacionesModel::generarReporte($params);
    }

    public function mostrarReportesAction() {

        ini_set("max_execution_time", 1600); //10 minutos
        $parametros = json_decode(
                stripslashes($this->_getParam('parametrosReporte'))
        );

        //identifica la entidad que esta haciendo la peticion(para la compartimentacion)
        $parametros->entidad = $this->global->Perfil->idestructuracomun;

        $parametros->identidadlog = $this->global->Estructura->idestructura;
        $parametros->denominacionlog = $this->global->Estructura->denominacion;
        $parametros->integ = $this->integrator;

        $parametros->origenreporte = 1;
        $quitarMascara = '<script type="text/javascrip">window.parent.Ext.MessageBox.hide();</script>';
        $objrecuperacionesmodel = new RecuperacionesModel();
        ini_set('memory_limit', '1024M');

        echo $objrecuperacionesmodel->mostrarReporte($parametros);
        echo $quitarMascara;
    }

    public function obtenerPlanesPorEjercicioAction() {
        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $parametros->clasificplan = $this->_request->getPost('clasif');
        $parametros->denclasificplan = $this->_request->getPost('denclasif');
        $parametros->arraytipogasto = json_decode(
                stripslashes($this->_request->getPost('arrayTipogasto'))
        );
        $objrecuperacionesmodel = new RecuperacionesModel();
        $arrayplanes = $objrecuperacionesmodel->obtenerPlanesPorEjercicio(
                $parametros
        );
        echo json_encode($arrayplanes);
    }

    public function obtenerPlanesPorEjercicioReporteAction() {
        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $parametros->idejercicioanterior = $this->_request->getPost(
                'idejercicioanterior'
        );
        $parametros->clasificplan = $this->_request->getPost('clasif');
        $parametros->denclasificplan = $this->_request->getPost('denclasif');
        $parametros->arraytipogasto = json_decode(
                stripslashes($this->_request->getPost('arrayTipogasto'))
        );
        $objrecuperacionesmodel = new RecuperacionesModel();
        $arrayplanes = $objrecuperacionesmodel->obtenerPlanesPorEjercicioReporte_3(
                $parametros
        );
        echo json_encode($arrayplanes);
    }

    function cargartipohojasAction() {
        $data->data[] = array("idtipohoja" => "4", "denominacion" =>
            "Tabloide (27.94cm x 43.18cm)", "ancho" => "27.94",
            "alto" => "43.18");
        echo json_encode($data);
    }

    public function cargarOrganosDemandantesAction() {
        $arrayorganosdemandantes = RecuperacionesModel::cargarOrganosDemandantes();
        echo json_encode($arrayorganosdemandantes);
    }

    public function imprimirAction() {
        ini_set('memory_limit', '1024M');
        $session = Zend_Registry::get('session');
        echo $session->cuerporeporte;
    }

    public function cargarTipoGastosAction() {
        $arraytiposgastos[0]['idtipogasto'] = '1';
        $arraytiposgastos[0]['denominacion'] = 'Corriente';
        $arraytiposgastos[1]['idtipogasto'] = '2';
        $arraytiposgastos[1]['denominacion'] = 'Capital';
        echo json_encode($arraytiposgastos);
    }

    public function cargarClasifPlanesAction() {
        $parametros = array();
        $parametros['nodo'] = $this->_request->getPost('iddatosnomenclador');
        $parametros['uri'] = $this->_request->getPost('uri');
        $parametros['ruta'] = $this->_request->getPost('ruta');

        $objPlan = new DatPlanModel();

        $datos = $objPlan->listarArbolTipoPlanes($parametros);

        echo json_encode($datos);
    }

    //LISTA LOS CENTROS DE BALANCE EN DEPENDENCIA DE LA ENTIDAD LOGUEADA
    //SE USA SOLO PARA LA RECUPERACION DE BALANCE
    public function ListarComboCentroBalanceRecuperacionAction() {
        $rector = $this->_request->getPost('rect');
        $cb = $this->_request->getPost('soyCB');
        $od = $this->_request->getPost('soyDem');
        $identidad = $this->_request->getPost('ident');
        $cbrecuperacion = new RecuperacionesModel();
        $data = $cbrecuperacion->listarCentrosBalanceRecuperacion(
                $rector, $cb, $od, $identidad
        );
        if ($data == 1) {
            echo("{'codMsg':22 }");
        } else {
            echo json_encode(array('data' => $data));
        }
    }

    //LISTA LAS ENTIDADES DEL DOMINIO POR EL QUE SE ESTA LOGUEADO
    public function listarArbolEntidadesRecuperacionAction() {
        /*
          si tipo == 0 : devuelvo los datos de la entidad que esta logueada
          si tipo == 1 : devuelvo los organos demandantes del CB señalado
         */
        $parametros = array();
        $parametros['node'] = $this->_request->getPost('node');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $parametros['idmodelo'] = $this->_request->getPost('idmode');
        $parametros['orgrecto'] = $this->_request->getPost('rect');
        $parametros['soyCB'] = $this->_request->getPost('cb');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['ordem'] = $this->_request->getPost('ordem');
        $parametros['identidadlog'] = $this->global->Estructura->idestructura;
        $parametros['valor'] = ($this->_request->getPost('valor')) ? $this->_request->getPost('valor') : null;
        $cbmodel = new RecuperacionesModel();
        echo json_encode(
                array('data' => $cbmodel->listarEntidadesRecuperacion($parametros))
        );
    }

    public function listarEntidadesDemandantesProyPlanifAction() {
        $parametros['identidadlog'] = $this->global->Estructura->idestructura;
        $parametros['componente'] = $this->_request->getPost('componente');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $cbmodel = new RecuperacionesModel();
        echo json_encode(
                array('data' => $cbmodel->listarEntidadesDemandantesProyPlanif($parametros))
        );
    }

    //LISTA LAS ENTIDADES QUE ESTAN DEMANDANDO ALGUN INDICADOR A ALGUN CENTRO DE BALANCE, Y ESTAS
    //SON HIJAS DIRECTAS DEL RECTOR DEL BALANCE (ECONOMIA)
    public function ListarEntidadesRecuperacionAction() {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idEstructura = ($this->_request->getPost('node')) ? $this->_request->getPost('node') :
                0;
        $valor = ($this->_request->getPost('valor')) ? $this->_request->getPost(
                        'valor'
                ) : null;
        $checked = $this->_request->getPost('checked');
        $dominios = $security->getDomain($idEstructura);

        $idEstructuraPadre = $this->_request->getPost('idEstructuraPadre');

        if ($idEstructuraPadre == 'undefined' && $idEstructura != '900000235') {
            $idEstructuraPadre = $idEstructura;
        }
        $result = array();
        foreach ($dominios as $key => $val) {
            $result[$key] = $val;
            $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
            $result[$key]['entidades_productoras'] = "";
            if ($checked == 'true') {
                $result[$key]['checked'] = true;
            } else {
                $result[$key]['checked'] = false;
            }
        }

        if ($valor != null) {
            foreach ($result as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($result[$key]);
                }
            }


            $res = array();
            $i = 0;
            foreach ($result as $key => $val) {
                $res[$i++] = $val;
                $res[$i++]['checked'] = false;
            }
        }
        if ($res != null) {
            $result = $res;
        }

        echo json_encode($result);
    }

    public function listarComboModelosRecuperacionAction() {
        ini_set("max_execution_time", 3600); //1hora
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['idcb'] = $this->_request->getPost('idcb');
        $parametros['esrector'] = $this->_request->getPost('esrector');
        $parametros['comportamiento'] = $this->_request->getPost(
                'comportamiento'
        );
        $parametros['cb'] = $this->_request->getPost('cb');
        $parametros['check'] = $this->_request->getPost('check');
        $parametros['identidadlog'] = $this->global->Estructura->idestructura;
        $identidades = explode(",", $parametros['identidad']);
        $parametros['selectent'] = 0;
        if ($identidades[0] != null) {
            foreach ($identidades as $key => $k) {
                $parametros['hijosentidad'][$key] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $k
                );
                array_push($parametros['hijosentidad'][$key], $k);
            }
            $parametros['selectent'] = 1;
        } else {
            if ($parametros['esrector'] == 'true') {
                $arrayorganosdemandantes = DatEntidaddatosnomenclador::obtenerEntidadRectora();
                $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun($arrayorganosdemandantes[0]['identidad']);
            } else {
                if ($parametros['comportamiento'] == 2) {

                    $parametros['hijosentidad'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                    $parametros['identidadlog']
                    );
                    array_push(
                            $parametros['hijosentidad'], $parametros['identidadlog']
                    );
                } else {
                    $objrec = new RecuperacionesModel();

                    $parametros['hijosentidad'] = $objrec->EntidadesQueDemandanAUnCB($parametros, true);
                }
            }
        }

        $cbrecuperacion = new DatPlanModel();
        $data = $cbrecuperacion->obtenerPlanesEntidades($parametros);
        echo json_encode(array('data' => $data));
    }

    public function listarComboModelosPPAction() {
        ini_set("max_execution_time", 3600); //1hora

        $parametros['caso'] = $this->_request->getPost('caso');
        $parametros['componente'] = $this->_request->getPost('componente');
        $idejecicio = $this->_request->getPost('idejercicio');
        if ($parametros['caso'] == 1)
            $parametros['identidades'] [0] = $this->_request->getPost('identidades');
        else
            $parametros['identidades'] = json_decode($this->_request->getPost('identidades'));

        $arrentp = array();

        foreach ($parametros['identidades'] as $entidad) {
            $arrentp = array_merge(
                    $arrentp, DatActividadentidad::auxObtenerEntidadesHijasComun($entidad)
            );
        }
        $identidades = implode(",", $arrentp);
        $cbrecuperacion = new DatPlanModel();
        if ($parametros['componente'] == 2 || $parametros['componente'] == 3) {
            $data = $cbrecuperacion->obtenerPlanesEntidadesPP($identidades, $idejecicio);
        } else {
            $data = $cbrecuperacion->obtenerPlanesEntidadesPPN($identidades, $idejecicio);
        }
        echo json_encode(array('data' => $data));
    }

    public function calcularImporteTotalAction() {
        ini_set("max_execution_time", 3600); //1hora

        $parametros['caso'] = $this->_request->getPost('caso');
        $parametros['componente'] = $this->_request->getPost('componente');
        $parametros['casop'] = $this->_request->getPost('casop');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        if ($parametros['caso'] == 1)
            $parametros['identidades'] [0] = $this->_request->getPost('identidades');
        else
            $parametros['identidades'] = json_decode($this->_request->getPost('identidades'));

        if ($parametros['casop'] == 1)
            $parametros['planes'] = $this->_request->getPost('planes');
        else {
            $planes = json_decode($this->_request->getPost('planes'));
            $parametros['planes'] = implode(",", $planes);
        }

        $arrentp = array();

        foreach ($parametros['identidades'] as $entidad) {
            $arrentp = array_merge(
                    $arrentp, DatActividadentidad::auxObtenerEntidadesHijasComun($entidad)
            );
        }
        $parametros['identidades'] = implode(",", $arrentp);
        $parametros['porc'] = 100;
        $cbrecuperacion = new DatPlanModel();
        $data = $cbrecuperacion->calcularImporteTotal($parametros);
        $dataF[] = number_format($data[0]['importegasto'], '3', '.', ',');
        $dataF[] = number_format($data[0]['importeingreso'], '3', '.', ',');
        echo json_encode(
                array('importe' => $data, 'importeformato' => $dataF)
        );
    }

    public function calcularImporteCalculadoAction() {
        ini_set("max_execution_time", 3600); //1hora

        $parametros['importebaseG'] = $this->_request->getPost('importebaseG');
        $parametros['importebaseV'] = $this->_request->getPost('importebaseV');
        $parametros['porciento1'] = $this->_request->getPost('porciento1');
        $parametros['porciento2'] = $this->_request->getPost('porciento2');
        $parametros['porciento3'] = $this->_request->getPost('porciento3');
        $parametros['porciento4'] = $this->_request->getPost('porciento4');
        $parametros['porciento5'] = $this->_request->getPost('porciento5');
        $parametros['porcientoEntreAnnos'] = $this->_request->getPost('porcientoEntreAnnos');
        $parametros['porcientoEA'] = $this->_request->getPost('porcientoEA');

        $datos = array();
        if ($parametros['porcientoEntreAnnos'] == 'false') {
            $datos[] = number_format((($parametros['importebaseG'] * $parametros['porciento1']) / 100), '3', '.', ',');
            $datos[] = number_format((($parametros['importebaseG'] * $parametros['porciento2']) / 100), '3', '.', ',');
            $datos[] = number_format((($parametros['importebaseG'] * $parametros['porciento3']) / 100), '3', '.', ',');
            $datos[] = number_format((($parametros['importebaseG'] * $parametros['porciento4']) / 100), '3', '.', ',');
            $datos[] = number_format((($parametros['importebaseG'] * $parametros['porciento5']) / 100), '3', '.', ',');

            $datos[] = number_format((($parametros['importebaseV'] * $parametros['porciento1']) / 100), '3', '.', ',');
            $datos[] = number_format((($parametros['importebaseV'] * $parametros['porciento2']) / 100), '3', '.', ',');
            $datos[] = number_format((($parametros['importebaseV'] * $parametros['porciento3']) / 100), '3', '.', ',');
            $datos[] = number_format((($parametros['importebaseV'] * $parametros['porciento4']) / 100), '3', '.', ',');
            $datos[] = number_format((($parametros['importebaseV'] * $parametros['porciento5']) / 100), '3', '.', ',');
        } else {
            $Vcero = $parametros['importebaseG'] * $parametros['porcientoEA'] / 100;
            $Vuno = $Vcero * $parametros['porciento1'] / 100;
            $Vdos = $Vuno * $parametros['porciento2'] / 100;
            $Vtres = $Vdos * $parametros['porciento3'] / 100;
            $Vcuatro = $Vtres * $parametros['porciento4'] / 100;
            $Vcinco = $Vcuatro * $parametros['porciento5'] / 100;

            $datos[] = number_format(($Vuno), '3', '.', ',');
            $datos[] = number_format(($Vdos), '3', '.', ',');
            $datos[] = number_format(($Vtres), '3', '.', ',');
            $datos[] = number_format(($Vcuatro), '3', '.', ',');
            $datos[] = number_format(($Vcinco), '3', '.', ',');

            $Vcero = $parametros['importebaseV'] * $parametros['porcientoEA'] / 100;
            $Vuno = $Vcero * $parametros['porciento1'] / 100;
            $Vdos = $Vuno * $parametros['porciento2'] / 100;
            $Vtres = $Vdos * $parametros['porciento3'] / 100;
            $Vcuatro = $Vtres * $parametros['porciento4'] / 100;
            $Vcinco = $Vcuatro * $parametros['porciento5'] / 100;

            $datos[] = number_format(($Vuno), '3', '.', ',');
            $datos[] = number_format(($Vdos), '3', '.', ',');
            $datos[] = number_format(($Vtres), '3', '.', ',');
            $datos[] = number_format(($Vcuatro), '3', '.', ',');
            $datos[] = number_format(($Vcinco), '3', '.', ',');
        }
        echo json_encode(array('data' => $datos));
    }

}
