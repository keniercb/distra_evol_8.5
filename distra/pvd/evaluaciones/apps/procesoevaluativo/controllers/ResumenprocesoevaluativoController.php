<?php

class ResumenprocesoevaluativoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function resumenprocesoevaluativoAction()
    {
       // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        //$this->view->gestdoc = $this->integrator->gestordocumental->devolverJSContenido();
        $this->render();
    }

    public function obtenerResumenProcEvaluativoAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $idestructura = json_decode(stripslashes($this->_request->getPost('idestructura')));
        $idestructuranodo = $this->_request->getPost('idestructuranodo');
        $bool = $this->_request->getPost('bool');
        $objPersEval = new DatEvalpersonaevaluacion();
        $idpersona = $this->global->Perfil->iddominio;
        $idpersonaevaluador = $this->global->Perfil->idpersona;

        if ($bool == 0) {
          //  $arrCargos = $this->integrator->metadatos->obtenerCargosEstructura($idestructuranodo,$idpersona,false);
            $arrCargos = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null, null, $idestructuranodo);

           /* $strIdCargo = '-1';
            foreach ($arrCargos as $cargo) {
                if ($cargo['idcargo']) {
                    $strIdCargo .= ',' . $cargo['idcargo'];
                }
            }*/
            $strIdCargo = '-1';
            foreach ($arrCargos->data as $cargo) {
                if ($cargo['idpersona']) {
                    $strIdCargo .= ',' . $cargo['idpersona'];
                }
            }

            $r->datos = $objPersEval->resumenProcesoEvald($idperiodoproceso, $strIdCargo,$idestructuranodo);
            $r->grafico = $objPersEval->cantPersonasEvaluaciond($idperiodoproceso, $strIdCargo,$idestructuranodo);
            $r->graficoDispersion = $objPersEval->cantPersonasDispersiond($idperiodoproceso, $strIdCargo,$idestructuranodo,$idpersonaevaluador);
            $r->evalByPerson = $objPersEval->evalByPersond($idperiodoproceso, $strIdCargo,$idestructuranodo);
            $r->evalByPersonDispersion = $objPersEval->evalByPersonDispersiond($idperiodoproceso, $strIdCargo,$idestructuranodo,$idpersonaevaluador);

        } else {
            $r->datos = $objPersEval->resumenProcesoEval($idperiodoproceso, $idestructura);
            $r->grafico = $objPersEval->cantPersonasEvaluacion($idperiodoproceso, $idestructura);
            $r->evalByPerson = $objPersEval->evalByPerson($idperiodoproceso, $idestructura);

        }
        //@TODO Hacer que calcule el promedio de la evaluacion sin importar que escala sea
        $r->average->total = 0;
        $r->average->real = 0;
        $cantTotal = count($r->evalByPerson);
        if ($cantTotal > 0) {
            $sum = 0;
            $cualitativo = 0;
            foreach ($r->evalByPerson as $k => $eval) {

                if (!empty($eval['idescala'])) {
                    $v = ResumenprocesoevaluativoModel::sumaIndicadoresEvalTextByPersona($eval['idpersona']);
                    $r->evalByPerson[$k]['valor'] = $v['suma'];
                    $sum += $v['suma'];
                    $cualitativo = 1;
                } else {
                    $sum += $eval['valor'];
                }
            }
            $r->average->real = round($sum / $cantTotal, 2);
            $r->average->resto = 10 - $r->average->real;
            if ($cualitativo == 1) {
                foreach ($r->datos as $h => $per) {
                    $r->datos[$h]['promedio'] = $per['promindicador'];
                }
            }
        }
        echo json_encode($r);
    }

    function getEvaluadosAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $idpersonaEvaluador = $this->_request->getPost('idpersonaEvaluador');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');


        $objResumen = new ResumenprocesoevaluativoModel();
        $r = $objResumen->getEvaluadosProceso($idperiodoproceso, $idpersonaEvaluador, $query, $limit, $start);
        echo json_encode($r);
    }

    public function showListadoPersonasAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $idestadodesarrollo = $this->_request->getPost('idestadodesarrollo');
        $valorInicial = $this->_request->getPost('valorinicial');
        $valorFinal = $this->_request->getPost('valorfinal');
        $noColumna = $this->_request->getPost('nocolumna');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $filtro = $this->_request->getPost('query');
        $idestructura = json_decode(stripslashes($this->_request->getPost('idestructura')));
        $idestructuranodo = $this->_request->getPost('idestructuranodo');
        $idpersonaevaluador = $this->global->Perfil->idpersona;

        $boole = $this->_request->getPost('boole');
        $objResumen = new ResumenprocesoevaluativoModel();
        /************************Estrcutura de nodos*************************************/
        if ($boole == 0) {

            $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null, null, $idestructuranodo);

            $strIdCargod = '-1';
            foreach ($persona->data as $cargo) {
                if ($cargo['idpersona']) {
                    $strIdCargod .= ',' . $cargo['idpersona'];
                }
            }

            $r['datos'] = $objResumen->getEvaluadosPeriodod(
                $idperiodoproceso, $strIdCargod,$idestructuranodo,
                $limit, $start, $idestadodesarrollo, $noColumna, $valorInicial,
                $valorFinal, $filtro
            );

            $r['cantidad'] = $objResumen->countListPersProcesoEvald(
                $idperiodoproceso, $strIdCargod, $idestadodesarrollo, $noColumna, $valorInicial, $valorFinal, $filtro
            );

        } else {
          /*********************************Estructura de evaluativa****************************/
            $r['datos'] = $objResumen->getEvaluadosPeriodo(
                $idperiodoproceso, $idestructura,
                $limit, $start, $idestadodesarrollo, $noColumna, $valorInicial,
                $valorFinal, $filtro
            );

            $r['cantidad'] = $objResumen->countListPersProcesoEval(
                $idperiodoproceso, $idestructura, $idestadodesarrollo, $noColumna, $valorInicial, $valorFinal, $filtro
            );
        }


        echo json_encode($r);
    }

    public function getListadoEvaluadosProcesoAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');

        $objResumen = new ResumenprocesoevaluativoModel();
        $r = $objResumen->getEvaluadosProceso($idpreprocesoevaluativo, null, $query, $limit, $start);
        echo json_encode($r);
    }
/***************************El reporte para poner el tipo que quieres exportar y el titulo que quieres******************************/
    public function obtenerReporteAction()
    {
        $formato = $_GET['formato'];
        $titulo = $_GET['titulo'];
        $usuario = json_decode($_GET['usuario']);
        $fecha = json_decode($_GET['fecha']);
        $params = json_decode($_GET['params']);
        $header = json_decode($_GET['header']);
        $tiporeporte = $_GET['tiporeporte'];
        $idestructura = json_decode(stripslashes($params->idestructura));

        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            $fecha = gmdate("d/m/Y H:i:s");
        }

        for ($i = 0; $i < count($header) - 2; $i++) {
            $cabecera[$i] = $header[$i + 2];
        }

        $objResumen = new ResumenprocesoevaluativoModel();

        if ($params->boole == 0) {
            $arrCargos = $this->integrator->metadatos->obtenerCargosEstructura($params->idestructuranodo,true,true);

            $strIdCargo = '-1';
            foreach ($arrCargos as $cargo) {
                if ($cargo['idestructura']) {
                    $strIdCargo .= ',' . $cargo['idestructura'];
                }
            }
            foreach ($arrCargos as $k=>$cargo) {
                if ($cargo['idestructura']) {
                    $strId[] = $cargo['idestructura'];
                }
            }
            $personas =ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null,null,null,null,null,$strId,null);

            $strIdP = '-1';
            foreach ($personas->data as $k=>$p) {
                $strIdP .= ',' .$p['idpersona'];

            }
            ///////////////////estrcutura dominio////////////////////

            if ($tiporeporte == 'resumen   ') {

                $resumen = DatEvalpersonaevaluacion::resumenProcesoEvald(
                    $params->idperiodoproceso, $strIdCargo, $params->idestructuranodo
                );

                for ($i = 0; $i < count($resumen); $i++) {
                    $r[$i]['estadodesarrollo'] = $resumen[$i]['estadodesarrollo'];
                    $r[$i]['total'] = $resumen[$i]['total'];
                    $r[$i]['porcientototal'] = $resumen[$i]['porcientototal'];
                    $r[$i]['porevaluar'] = $resumen[$i]['porevaluar'];
                    $r[$i]['evaluado'] = $resumen[$i]['evaluado'];
                    $r[$i]['noevaluado'] = $resumen[$i]['noevaluado'];
                    $r[$i]['desacuerdo'] = $resumen[$i]['desacuerdo'];
                    $r[$i]['reclamacion'] = $resumen[$i]['reclamacion'];
                    $r[$i]['promedio'] = $resumen[$i]['promedio'];
                }

                ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                    $formato, $titulo, $r, $header, $usuario, $fecha
                );
            } else {
                if ($tiporeporte == 'listpersona') {

                    $data = $objResumen->getListPersProcesoEvald(
                        $params->idperiodoproceso, null, null, $params->idestadodesarrollo,
                        $params->nocolumna, $params->valorinicial, $params->valorfinal, $params->query,$params->idestructuranodo,$strIdP
                    );

                    for ($i = 0; $i < count($data); $i++) {

                        $datos[$i]['nombre'] = $data[$i]['nombre'];
                        $datos[$i]['snombre'] = $data[$i]['snombre'];
                        $datos[$i]['papel'] = $data[$i]['papel'];
                        $datos[$i]['sapel'] = $data[$i]['sapel'];
                        $datos[$i]['evaluacion'] = $data[$i]['valor'];
                    }
                    ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                        $formato, $titulo, $datos, $cabecera, $usuario, $fecha
                    );
                }
            }
        } else {
            if ($tiporeporte == 'resumen') {
                $resumen = DatEvalpersonaevaluacion::resumenProcesoEval(
                    $params->idperiodoproceso, $idestructura
                );

                for ($i = 0; $i < count($resumen); $i++) {
                    $r[$i]['estadodesarrollo'] = $resumen[$i]['estadodesarrollo'];
                    $r[$i]['total'] = $resumen[$i]['total'];
                    $r[$i]['porcientototal'] = $resumen[$i]['porcientototal'];
                    $r[$i]['porevaluar'] = $resumen[$i]['porevaluar'];
                    $r[$i]['evaluado'] = $resumen[$i]['evaluado'];
                    $r[$i]['noevaluado'] = $resumen[$i]['noevaluado'];
                    $r[$i]['desacuerdo'] = $resumen[$i]['desacuerdo'];
                    $r[$i]['reclamacion'] = $resumen[$i]['reclamacion'];
                    $r[$i]['promedio'] = $resumen[$i]['promedio'];
                }

                ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                    $formato, $titulo, $r, $header, $usuario, $fecha
                );
            } else {
                if ($tiporeporte == 'listpersona') {
                    $data = $objResumen->getListPersProcesoEval(
                        $params->idperiodoproceso, $idestructura, null, null, $params->idestadodesarrollo,
                        $params->nocolumna, $params->valorinicial, $params->valorfinal, $params->query
                    );

                    for ($i = 0; $i < count($data); $i++) {
                        $datos[$i]['nombre'] = $data[$i]['nombre'];
                        $datos[$i]['snombre'] = $data[$i]['snombre'];
                        $datos[$i]['papel'] = $data[$i]['papel'];
                        $datos[$i]['sapel'] = $data[$i]['sapel'];
                        $datos[$i]['evaluacion'] = $data[$i]['evaluacion'];
                    }
                    ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                        $formato, $titulo, $datos, $cabecera, $usuario, $fecha
                    );
                }
            }
        }


    }

    public function obtenerReportePAction()
    {
        $formato = $_GET['formato'];
        $titulo = $_GET['titulo'];
        $usuario = json_decode($_GET['usuario']);
        $fecha = json_decode($_GET['fecha']);
        $params = json_decode($_GET['params']);
        $header = json_decode($_GET['header']);
        $tiporeporte = $_GET['tiporeporte'];
        $idestructura = json_decode($params->idestructura);

        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            $fecha = gmdate("d/m/Y H:i:s");
        }

        for ($i = 0; $i < count($header) - 2; $i++) {
            $cabecera[$i] = $header[$i + 2];
        }

        $objResumen = new ResumenprocesoevaluativoModel();

        if ($params->boole == 0) {

            $arrCargos = $this->integrator->metadatos->obtenerCargosEstructura($params->idestructuranodo, true, true);

            $strIdCargo = '-1';
            foreach ($arrCargos as $k=>$cargo) {
                if ($cargo['idestructura']) {
                    $strIdCargo .= ',' .$cargo['idestructura'];
                }
            }
            foreach ($arrCargos as $k=>$cargo) {
                if ($cargo['idestructura']) {
                    $strId[] = $cargo['idestructura'];
                }
            }
            $personas =ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null,null,null,null,null,$strId,null);

            $strIdP = '-1';
            foreach ($personas->data as $k=>$p) {
                $strIdP .= ',' .$p['idpersona'];

            }
            ///////////////////estructura dominio////////////////////

            if ($tiporeporte == 'listpersona' && count($strIdCargo)>0) {

                $data = $objResumen->getListPersProcesoEvald(
                    $params->idperiodoproceso, null, null, $params->idestadodesarrollo,
                    $params->nocolumna, $params->valorinicial, $params->valorfinal, $params->query, $params->idestructuranodo, $strIdP
                );

                for ($i = 0; $i < count($data); $i++) {
                    $datos[$i]['no'] = $i + 1;
                    //$datos[$i]['numid'] = $data[$i]['numid'];
                    $datos[$i]['nombre'] = $data[$i]['nombre'];
                    $datos[$i]['snombre'] = $data[$i]['snombre'];
                    $datos[$i]['papel'] = $data[$i]['papel'];
                    $datos[$i]['sapel'] = $data[$i]['sapel'];
                    $datos[$i]['numid'] = $data[$i]['numid'];
                    $datos[$i]['denomcargo'] = $data[$i]['denomcargo'];
                    $datos[$i]['evaluacion'] = $data[$i]['valor'];
                    if (!empty($data[$i]['idescala'])) {
                        $v = $objResumen->sumaIndicadoresEvalTextByPersona($data[$i]['idpersonaevaluacion']);
                        $datos[$i]['valor'] = $v['suma'];
                    }  else {
                        $datos[$i]['valor'] = $data[$i]['valor'];
                    }
                    $datos[$i]['estadodesarrollo'] = $data[$i]['estadodesarrollo'];
                    $datos[$i]['otorgado'] = '';
                    $datos[$i]['valoracion'] = '';
                    $datos[$i]['conformidad'] = '';
                    $datos[$i]['firma'] = '';
                    $datos[$i]['periodo'] = $data[$i]['periodo'];
                    $datos[$i]['proceso'] = $data[$i]['proceso'];
                }
                $obj = new ReporteEvaluacionModel();

                $obj->createPDF($datos, $fecha, $endDate);
            }

        } else {
            /*************************Estructura evaluativa***************************/
            if ($tiporeporte == 'listpersona' && $idestructura!= null) {
                $data = $objResumen->getListPersProcesoEval(
                    $params->idperiodoproceso, $idestructura, null, null, $params->idestadodesarrollo,
                    $params->nocolumna, $params->valorinicial, $params->valorfinal, $params->query
                );

                for ($i = 0; $i < count($data); $i++) {
                    $datos[$i]['no'] = $i + 1;
                    $datos[$i]['nombre'] = $data[$i]['nombre'];
                    $datos[$i]['snombre'] = $data[$i]['snombre'];
                    $datos[$i]['papel'] = $data[$i]['papel'];
                    $datos[$i]['sapel'] = $data[$i]['sapel'];
                    $datos[$i]['numid'] = $data[$i]['numid'];
                    $datos[$i]['denomcargo'] = $data[$i]['cargo'];
                    $datos[$i]['evaluacion'] = $data[$i]['evaluacion'];
                    if (!empty($data[$i]['idescala'])) {
                        $v = $objResumen->sumaIndicadoresEvalTextByPersona($data[$i]['idpersonaevaluacion']);
                        $datos[$i]['valor'] = $v['suma'];
                    }  else {
                        $datos[$i]['valor'] = $data[$i]['valor'];
                    }
                    $datos[$i]['estadodesarrollo'] = $data[$i]['estadodesarrollo'];
                    $datos[$i]['otorgado'] = '';
                    $datos[$i]['valoracion'] = '';
                    $datos[$i]['conformidad'] = '';
                    $datos[$i]['firma'] = '';
                    $datos[$i]['periodo'] = $data[$i]['periodo'];
                    $datos[$i]['proceso'] = $data[$i]['proceso'];
                }
                $obj = new ReporteEvaluacionModel();
                $obj->createPDF($datos, $fecha, $endDate);
            }
        }


    }

   public function printEvalAction()
    {
        $idperiodoproceso = $this->_request->get('idperiodoproceso');
        $idestructura = $this->_request->get('idestructura');
        $arrIdPersona = json_decode(stripslashes($this->_request->get('arridpersona')));

        //Periodo a evaluar
        $startDate = $this->_request->get('fechainicio');
        $endDate = $this->_request->get('fechafin');

        $idusuario = $this->global->Perfil->idusuario;
        $segUserPers = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);

        $objEvaluados = new DatEvalpersonaevaluacion();
        $arrEvaluados = $objEvaluados->getEvaluacionToPrintResumen(
            $idperiodoproceso, $segUserPers[0]['idpersona'], $arrIdPersona, $idestructura
        );
        $obj = new PrintEvaluacionModel();
        $obj->createPDF($arrEvaluados, $startDate, $endDate,$idestructura);
    }

    public function getEstructuraEvaluativaAction()
    {
        $idperiodoproceso = $this->_getParam('idperiodoproceso');
        $idpersona = $this->_getParam('idpersona');

        $objPersEval = new DatEvalpersonaevaluacion();

        if (empty($idpersona)) {
            $idpersona = $this->global->Perfil->idpersona;
            $evaluados = $objPersEval->getEvaluadosByPeriodo($idperiodoproceso, null, null, null, $idpersona, true);
        } else {

            $evaluados = $objPersEval->getEvaluadosByPeriodo($idperiodoproceso, null, null, null, $idpersona);
        }


        foreach ($evaluados as &$evaluado) {
            $evaluado['id'] = $evaluado['idpersonaevaluado'];
            switch ($evaluado['nopersona']) {
                case 1:
                    $name = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($evaluado['idpersonaevaluado']));
                    $estructura = explode('/', $name[0]['rutaDenominacion']);

                    $evaluado['text'] = count($name) > 0 ?  $estructura[0] . '/' . $estructura[3] : $evaluado['idpersonaevaluado'];
                    $evaluado['qtip'] = count($name) > 0 ?  $estructura[0] . '/' . $estructura[3] : $evaluado['idpersonaevaluado'];
                    break;
                default:
                    $name = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersonaevaluado']);
                    $evaluado['text'] = $name->quantity > 0 ? $name->data[0]['nombreapellidos'] : $evaluado['idpersonaevaluado'];
                    $evaluado['qtip'] = $name->quantity > 0 ? $name->data[0]['denomcargo'] : $evaluado['idpersonaevaluado'];
                    break;
            }
        }

        echo json_encode($evaluados);
    }

    private static function generateChilds(&$array, $idPadre)
    {
        $tree = array();

        $c = 0;
        while ($c < count($array)) {
            $v = $array[$c];

            if ($v['idpersonaevaluador'] == $idPadre) {
                $children = self::generateChilds($array, $v['idpersonaevaluado']);

                $nodo = array(
                    'id' => $v['idpersonaevaluado'],
                    'children' => $children,
                    'leaf' => (count($children) > 0) ? false : true
                );
                switch ($v['nopersona']) {
                    case 1:
                        $name = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($v['idpersonaevaluado']));
                        $nodo['text'] = count($name) > 0 ? $name[0]['rutaDenominacion'] : $v[0];
                        $nodo['qtip'] = count($name) > 0 ? $name[0]['rutaDenominacion'] : $v[0];
                        break;
                    default:
                        $name = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($v['idpersonaevaluado']);
                        $nodo['text'] = $name->quantity > 0 ? $name->data[0]['nombreapellidos'] : $v['idpersonaevaluado'];
                        $nodo['qtip'] = $name->quantity > 0 ? $name->data[0]['denomcargo'] : $v['idpersonaevaluado'];
                        break;
                }
                array_push($tree, $nodo);
                array_splice($array, $c, 1);
            } else {
                $c++;
            }
        }
        return $tree;
    }

    private static function existeByClave($array, $clave, $id)
    {
        foreach ($array as $v) {
            if ($v[$clave] == $id) {
                return true;
            }
        }
        return false;
    }

    function getserieAction()
    {
        $estructura = $this->_request->getPost('estructura');
        $bool = $this->_request->getPost('bool');
        $idperiodoproceso =$this->_request->getPost('idperiodoproceso');
        $nombrenodo = json_decode($this->_request->getPost('nombrenodo'));
        $idestructura = json_decode($this->_request->getPost('idestructura'));


        $objResumen = new ResumenprocesoevaluativoModel();
        if($bool == 0){
            $arrCargos = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null, null, $estructura);
            $strIdCargo = '-1';
            foreach ($arrCargos->data as $cargo) {
                if ($cargo['idpersona']) {
                    $strIdCargo .= ',' . $cargo['idpersona'];
                }
            }
            $r = $objResumen->getSerieResumen($estructura,$strIdCargo,$idperiodoproceso,$nombrenodo);

        }
        else {
            $r = $objResumen->getSerieResumenevaluativa($idestructura,$idperiodoproceso,$nombrenodo);
        }

        echo json_encode($r);

    }
    public function showListadoPersonasGestorAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $filtro = $this->_request->getPost('query');


        $objResumen = new ResumenprocesoevaluativoModel();


            $r['datos'] = $objResumen->getEvaluadosPeriodoGestor($idperiodoproceso, $limit, $start, $filtro);

            $r['cantidad'] = $objResumen->countListPersProcesoEvalGestor(
                $idperiodoproceso, $filtro
            );

        echo json_encode($r);
    }


}