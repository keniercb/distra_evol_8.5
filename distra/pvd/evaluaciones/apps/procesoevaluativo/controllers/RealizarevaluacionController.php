<?php
$dir_www = $_SERVER['DOCUMENT_ROOT'];
$dir_rel_mt = '/'; //Direccion del Marco de trabajo relativa a la carpeta de publicacion.
//Direccion absoluta del marco de trabajo
$dir_abs_mt = str_replace("//", "/", str_replace('web','',$dir_www). $dir_rel_mt);
include $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'pvd' . DIRECTORY_SEPARATOR . 'comun' . DIRECTORY_SEPARATOR
    . 'recursos' . DIRECTORY_SEPARATOR . 'PHPMailer_v5.1' . DIRECTORY_SEPARATOR . 'class.phpmailer.php';
include $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'pvd' . DIRECTORY_SEPARATOR . 'comun' . DIRECTORY_SEPARATOR
    . 'recursos' . DIRECTORY_SEPARATOR . 'PHPMailer_v5.1' . DIRECTORY_SEPARATOR . 'class.smtp.php';

$dir_wwwexcel = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_wwwexcel . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_wwwexcel . '/pvd/comun/recursos/PHPExcel/Reader/Excel5.php');
include_once($dir_wwwexcel . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class RealizarevaluacionController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function realizarevaluacionAction()
    {
       // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->scriptFichaProcesoEval = $this->pIntegrator->procesoevaluativo->getScriptFichaProcesoEval();
		//$this->view->gestdoc = $this->integrator->gestordocumental->devolverJSContenido();
        $this->render();
    }

    function getEvaluadosPEAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idPeriodoProceso = $this->_request->getPost('idperiodoproceso');
        $idPersonaEvaluador = $this->_request->getPost('idpersonaevaluador');

        $filtro = $this->_request->getPost('denominacion');
        $firstParent = false;
        if (empty($idPersonaEvaluador)) {
            $idusuario = $this->global->Perfil->idusuario;

            if($idusuario!=null || $idusuario!=''){
                $evaluador = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
                $idPersonaEvaluador = $evaluador[0]['idpersona'];
                $firstParent = true;
            }
        }
        if($idPersonaEvaluador!=null || $idPersonaEvaluador!=''){
            $objModel = new DatEvalpersonaevaluacionModel();
            $r['datos'] = $objModel->getEvaluadosPeriodo($idPeriodoProceso, $idPersonaEvaluador, $firstParent, $filtro);
        }
        else{
            $r['datos'] = array();
        }

        echo json_encode($r);
    }

    private function SincronizarImgBDconFicheroServer($idfoto, $foto, $extension)
    {
        $ffp = fopen("views/images/personas/" . "{$idfoto}" . "{$extension}", "wb");
        fclose($ffp);
        file_put_contents("views/images/personas/" . "{$idfoto}" . "{$extension}", $foto);
    }

    function cargarPlanillaAction()
    {
        $id = $this->_request->getPost('_id');
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $idplanilla = $this->_request->getPost('idplanilla');
        $r = null;
        if ($id == null) {
            //Obtengo planilla evaluativa
            $planilla = $this->pIntegrator->evaluaciones->ObtenerPlanillaPorId($idplanilla);
            //Obtengo evaluacion de la persona
            $objEvaluacion = DatEvalpersonaevaluacion::Buscar($idpersonaevaluacion);
            $r->data[0]->denom = $planilla[0]->denom;
            $r->data[0]->_id = -1;
            $r->data[0]->idindicador = '';
            $r->data[0]->_parent = null;
            $r->data[0]->_is_leaf = 0;
            $r->data[0]->complementotextual = '';
            if ($objEvaluacion) {
                $valorMostrar = '';
                if (empty($objEvaluacion->idescala)) {
                    $valorMostrar = $objEvaluacion->valor;
                } else {
                    $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($objEvaluacion->idescala);
                    foreach ($valoresEscala as $valorEscala) {
                        if ($valorEscala['valor'] == $objEvaluacion->valor) {
                            $valorMostrar = $valorEscala['denom'];
                            break;
                        }
                    }
                }

                $r->data[0]->valorMostrar = '<b style="font-size:11px;">' . $valorMostrar . '</b>';
            } else {
                $r->data[0]->valorMostrar = '';
            }
        } else {
            $indicadores = $this->pIntegrator->evaluaciones->ObtenerIndicadoresPorPlanilla($idplanilla, $id);
            $arrIndTexto = array();
            $arrIndImagen = array();
            foreach ($indicadores as $indicador) {
                if ($indicador['tipo'] == true) {
                    $arrIndTexto[] = $indicador['idindicador'];
                } else {
                    $arrIndImagen[] = $indicador['idindicador'];
                }
            }

            if (count($arrIndTexto) > 0) {
                $arrIndTexto = $this->pIntegrator->evaluaciones->ObtenerIndicadoresTextPorId($arrIndTexto);
            }
            if (count($arrIndImagen) > 0) {
                $arrIndImagen = $this->pIntegrator->evaluaciones->ObtenerIndicadoresImagenPorId($arrIndImagen);
            }
            $result = array();
            if (count($indicadores) > 0) {
                foreach ($indicadores as $indicador) {
                    foreach ($arrIndTexto as $indTexto) {
                        if ($indicador['idindicador'] == $indTexto['idindicadortexto']) {
                            $result[] = array_merge($indicador, $indTexto);
                        }
                    }
                    foreach ($arrIndImagen as $indImg) {
                        if ($indicador['idindicador'] == $indImg['idindicadorimagen']) {
                            $result[] = array_merge($indicador, $indImg);
                        }
                    }
                }
            }
            $nodos = array();
            if (count($result) > 0) {
                foreach ($result as $v) {
                    $idindicadorevaluacion = '';
                    $valorComplementotextual = '';
                    $valorMostrar = '';
                    $valor = '';
                    $objIndEval = new DatEvalindicadoresevaluacion();
                    $objIndicadorEvaluacion = $objIndEval->getIndicadorEvaluacion(
                        $idpersonaevaluacion, $v['idindicadorplanilla']
                    );

                    if (!$objIndicadorEvaluacion) {
                        $DatEvalindicadoresevaluacion = new DatEvalindicadoresevaluacion();
                        $DatEvalindicadoresevaluacion->idpersonaevaluacion = $idpersonaevaluacion;
                        $DatEvalindicadoresevaluacion->idindicadorplanilla = $v['idindicadorplanilla'];
                        $DatEvalindicadoresevaluacion->idescala = $v['idescala'];
                        $DatEvalindicadoresevaluacion->save();
                        $idindicadorevaluacion = $DatEvalindicadoresevaluacion->idindicadorevaluacion;
                    } else {
                        $valorComplementotextual = $objIndicadorEvaluacion[0]['complementotextual'];
                        $valor = $objIndicadorEvaluacion[0]['valor'];
                        $idindicadorevaluacion = $objIndicadorEvaluacion[0]['idindicadorevaluacion'];
                        if (!empty($v['idescala'])) {
                            $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($v['idescala']);
                            foreach ($valoresEscala as $valorEscala) {
                                if ($valorEscala['valor'] == $valor) {
                                    $valorMostrar = $valorEscala['denom'];
                                    break;
                                }
                            }
                        } else {
                            if ($v['idexpresionmatematica']) {
                                $valor = $objIndicadorEvaluacion[0]['valor'];
                                $valorMostrar = $objIndicadorEvaluacion[0]['valor'];
                            }
                        }
                    }

                    $escalaNumerica = null;
                    if($v['idescala']) {
                        $escala = $this->pIntegrator->evaluaciones->getConfigEscalaNum($v['idescala']);
                        if(!empty($escala)){
                            $escalaNumerica = $escala[0];
                        }
                    }

                    $nodos[] = array(
                        '_id' => $v['idindicadorplanilla'],
                        'idindicador' => $v['idindicador'],
                        'ayuda' => $v['ayuda'],
                        'descripcion' => $v['descripcion'],
                        'complementotextual' => $v['complementotextual'],
                        'denom' => $v['denom'],
                        'calculado' => $v['calculado'],
                        '_parent' => ($id == -1 ? -1 : $v['idpadre']),
                        'idescala' => $v['idescala'],
                        'escalaNumerica' => $escalaNumerica,
                        '_is_leaf' => $v['eshoja'] == 0 ? false : true,
                        'idindicadorevaluacion' => $idindicadorevaluacion,
                        'valor' => $valor,
                        'valorMostrar' => $valorMostrar ? $valorMostrar : $valor,
                        'valorComplementotextual' => $valorComplementotextual
                    );
                }
            }
            $r->data = $nodos;
        }
        $r->success = true;

        echo json_encode($r);
    }

    //////////////////////////////////////////////////////////////////////////////////////
 function cargarpreprocesosevaluativosAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idnodo = $this->_request->getPost('idnodo');
        $idestructura = $this->global->Estructura->idestructura;
        if($idnodo == 'raizProceso')
        {
	    $objPreProcesos = new DatEvalpreprocesoevaluativo();
        $r = $objPreProcesos->ObtenerTodosProcesos($idpreprocesoevaluativo);
        $r[0]['text'] = $r[0]['denom'];
        $r[0]['id'] = -1;
        echo json_encode($r);
		}
		else
		{
			$nodos = array();
			$objPreProcesos = new DatEvalpreprocesoevaluativo();
            $r->datos = $objPreProcesos->ObtenerTodosPeriodos($idestructura,$idpreprocesoevaluativo);

            if(count($r->datos)>0)
          {
            foreach($r->datos as $datos)
            {
				$icono = "";
                    if ($datos['_parent'] == true) {
                        $icono = "task-folder";
                    } else {
                        if ($datos['_is_leaf'] == true) {
                            $icono = "indicadorTexto";
                            $a = true;
                        }
                    }
                 $valorComplementotextual = "";
                    $idindicadorevaluacion = null;
                    $idindicadorevalfueraproceso = null;
                    $idvalor = null;
                    $valor = '';
				$nodos[] = array(
                        'id' => $datos['idperiodoproceso'],
                        'idperiodoproceso' => $datos['idperiodoproceso'],
                        'qtip' => ($datos['estado'] != '' ?
                            '<b>Descripci&oacute;n</b></br>' . $datos['estado'] : ''),
                        'text' => $datos['denominacion'],
                        'idpadre' => $datos['_parent'],
                        'tipo' => $v['tipo'],
                        'iconCls' => $icono,
                        'leaf' => $v['_is_leaf'] == 1 ? false : true,
                        'checked' => $v['_is_leaf'] == 1 ? null : false,
                        //'idindicadorevaluacion' => $idindicadorevaluacion,
                        //'idindicadorevalfueraproceso' => $idindicadorevalfueraproceso,
                        'idvalor' => $idvalor,
                        'valor' => $valor,
                        'valorComplementotextual' => $valorComplementotextual
                        );

			}

		}
			echo json_encode($nodos);
	   }

    }
 /////////////////////////////////////////////////////////////////////////////////////

    function cargarPlanillaPerfilAction()
    {
        $idplanilla = $this->_request->getPost('idplanilla');
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $resultado = Array();

        if($idplanilla!='null'){

            $planilla = $this->pIntegrator->evaluaciones->ObtenerPlanillaPorId($idplanilla);

            $resultado[0]['text'] = $planilla[0]->denom;
            $resultado[0]['denom'] = $planilla[0]->denom;
            $resultado[0]['id'] = -1;
            $resultado[0]['idpadre'] = -1;
            $resultado[0]['leaf'] = false;
            $resultado[0]['expanded'] = true;
            if (!empty($idpersonaevaluacion)) {
                $objEvaluacion = DatEvalpersonaevaluacion::Buscar($idpersonaevaluacion);

                if ($objEvaluacion) {
                    $valorMostrar = '';

                    if (empty($objEvaluacion->idescala)) {
                        $valorMostrar = $objEvaluacion->valor;
                    } else {
                        $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($objEvaluacion->idescala);
                        foreach ($valoresEscala as $valorEscala) {
                            if ($valorEscala['valor'] == $objEvaluacion->valor) {
                                $valorMostrar = $valorEscala['denom'];
                                break;
                            }
                        }
                    }
                    if (!empty($valorMostrar)) {
                        $resultado[0]['text'] = $planilla[0]->denom.'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right><b>'.$valorMostrar.'</b></div>'   ;

                    }
                }
            }
            $indicadores = $this->obtenerIndicadores($idpersonaevaluacion, $idplanilla);

            for($i = 0;$i<count($indicadores);$i++){
                if(($indicadores[$i]['id']==$indicadores[$i]['idpadre']) && ($indicadores[$i]['valor']!=null || $indicadores[$i]['valor']!='')){
                    $indicadores[$i]['text'] = $indicadores[$i]['text'].'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right><b>'.$indicadores[$i]['valor'].'</b></div>'   ;
                }
            }
            $children =  $this->generarArbolIndicadores($indicadores);

            for($i = 0;$i<count($children);$i++){
                $arrayestyle = explode('style',$children[$i]['text']);
                if(count($arrayestyle)==3){
                    $children[$i]['text'] = $children[$i]['denom'].'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right>'.$children[$i]['valorMostrar'].'</div>';
                }
            }

            if (count($children) > 0) {
                $resultado[0]['children'] = $children;
                $resultado[0]['leaf'] = false;
            } else {
                $resultado[0]['leaf'] = true;
            }


        }
        echo json_encode($resultado);


    }

    private function obtenerIndicadores($idpersonaevaluacion, $idplanilla)
    {
        $sql = "SELECT eval.nopersona
                       FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                       where eval.idpersonaevaluacion = $idpersonaevaluacion";
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        if($result[0]['nopersona']==0){
            Doctrine_Manager::connection()->execute("Select mod_evaluaciones.f_indicadoresevaluacion_insert('$idpersonaevaluacion', '$idplanilla')");
        }else if($result[0]['nopersona']==1){
                Doctrine_Manager::connection()->execute("Select mod_evaluaciones.f_indicadoresevaluacion_insertarea('$idpersonaevaluacion', '$idplanilla')");
            }

        $indicadores = $this->pIntegrator->evaluaciones->ObtenerIndicadoresPorPlanilla($idplanilla, '');

        $arrIndTexto = array();
        $arrIndImagen = array();
        foreach ($indicadores as $indicador) {
            if ($indicador['tipo'] == true) {
                $arrIndTexto[] = $indicador['idindicador'];
            } else {
                $arrIndImagen[] = $indicador['idindicador'];
            }
        }

        if (count($arrIndTexto) > 0) {
            $arrIndTexto = $this->pIntegrator->evaluaciones->ObtenerIndicadoresTextPorId($arrIndTexto);
        }
        if (count($arrIndImagen) > 0) {
            $arrIndImagen = $this->pIntegrator->evaluaciones->ObtenerIndicadoresImagenPorId($arrIndImagen);
        }

        $result = array();
        if (count($indicadores) > 0) {
            foreach ($indicadores as $key => $indicador) {
                foreach ($arrIndTexto as $indTexto) {
                    if ($indicador['idindicador'] == $indTexto['idindicadortexto']) { //revisar..
                        $result[] = array_merge($indicador, $indTexto);
                    }
                }
                foreach ($arrIndImagen as $indImg) {
                    if ($indicador['idindicador'] == $indImg['idindicadorimagen']) { //revisar
                        $result[] = array_merge($indicador, $indImg);
                    }
                }
            }
        }
        $nodos = array();

        if (count($result) > 0) {
            foreach ($result as $p => $v) {
                $idindicadorevaluacion = '';
                $valorComplementotextual = '';
                $valorMostrar = '';
                $valor = '';
                if (!empty($idpersonaevaluacion)) {

                    $objIndEval = new DatEvalindicadoresevaluacion();
                    $objIndicadorEvaluacion = $objIndEval->getIndicadorEvaluacion(
                        $idpersonaevaluacion, $v['idindicadorplanilla']
                    );
                        $valorComplementotextual = $objIndicadorEvaluacion[0]['complementotextual'];
                        $valor = $objIndicadorEvaluacion[0]['valor'];
                        $idindicadorevaluacion = $objIndicadorEvaluacion[0]['idindicadorevaluacion'];
                        if (!empty($v['idescala'])) {
                            $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($v['idescala']);
                            foreach ($valoresEscala as $valorEscala) {
                                if ($valorEscala['valor'] == $valor) {
                                    $valorMostrar = $valorEscala['denom'];
                                    break;
                                }
                            }
                        } else {
                            if ($v['idexpresionmatematica']) {
                                $valor = $objIndicadorEvaluacion[0]['valor'];
                                $valorMostrar = $objIndicadorEvaluacion[0]['valor'];
                            }
                        }
                    $escalaNumerica = null;
                    if($v['idescala']) {
                        $escala = $this->pIntegrator->evaluaciones->getConfigEscalaNum($v['idescala']);
                        if(!empty($escala)){
                            $escalaNumerica = $escala[0];
                        }
                    }
                }
                $icono = "";
                if ($v['calculado'] == false) {
                    $icono = "task-folder";
                } else {
                    if ($v['tipo'] == true && $v['calculado'] == true) {
                        $icono = "indicadorTexto";
                        $a = true;
                    } else {
                        if ($v['tipo'] == false && $v['calculado'] == true) {
                            $icono = "indicadorImagen";
                        }
                    }
                }

                $idindicadorevalfueraproceso = null;
                $nodos[] = array(
                    'id' => $v['idindicadorplanilla'],
                    'idindicador' => $v['idindicador'],
                    'ayuda' => $v['ayuda'],
                    'qtip' => ($v['descripcion'] != '' ?
                        '<b>Denominaci&oacute;n:</b></br>' . $v['denom'].'</br><b>Descripci&oacute;n:</b></br>' . $v['descripcion']
                        : '<b>Denominaci&oacute;n:</b></br>' . $v['denom']),
                    'complementotextual' => $v['complementotextual'],
                    'denom' => $v['denom'],
                    'idpadre' => $v['idpadre'],
                    'idescala' => $v['idescala'],
                    'escalaNumerica' => $escalaNumerica,
                    'calculado' => $v['calculado'],
                    'tipo' => $v['tipo'],
                    'iconCls' => $icono,
                    'leaf' => $v['eshoja'] == 0 ? false : true,
                    'checked' => $v['eshoja'] == 0 ? null : false,
                    'idindicadorevaluacion' => $idindicadorevaluacion,
                    'idindicadorevalfueraproceso' => $idindicadorevalfueraproceso,
                    'valor' => $valor,
                    'valorMostrar' => $valorMostrar ? $valorMostrar : $valor,
                    'valorComplementotextual' => $valorComplementotextual);
                if (empty($idpersonaevaluacion) || $v['eshoja'] == 0) {
                    $den = (strlen($v['denom'])>60)?substr($v['denom'], 0, 59).'...':$v['denom'];
                    $nodos[$p]['text'] = $den;
                } else {
                    $den = (strlen($v['denom'])>60)?substr($v['denom'], 0, 59).'...':$v['denom'];
                    if ($valor == '') {
                        $nodos[$p]['text'] = $den.'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right>-</div>';
                    }  else {
                        $nodos[$p]['text'] = $den.'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right>'.$valorMostrar.'</div>';
                    }
                }
            }
        }

        return $nodos;
    }

    private function generarArbolIndicadores(array &$array, $idPadre = null, &$len = -1)
    {
        $treeFormat = array();
        $len = isset($len) && $len >= 0 ? $len : count($array);
        $cont = 0;
        while ($len > $cont) {
            $v = $array[$cont];
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['id'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['id'] = $v['id'];
                    $treeFormat[$lenght]['idpadre'] = -1;
                    $treeFormat[$lenght]['expanded'] = true;
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generarArbolIndicadores($array, $v['id'], $len);
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                        $treeFormat[$lenght]['leaf'] = false;
                    } else {
                        $treeFormat[$lenght]['leaf'] = true;
                    }
                } else {
                    $cont++;
                }
            } else if ($v['idpadre'] == $idPadre && $v['id'] != $idPadre) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['id']= $v['id'];
                $treeFormat[$lenght]['expanded'] = false;
                array_splice($array, $cont, 1);
                $len--;
                $children = $this->generarArbolIndicadores($array, $v['id'], $len);
                if (count($children) > 0) {
                    $treeFormat[$lenght]['children'] = $children;
                    $treeFormat[$lenght]['leaf'] = false;
                    $treeFormat[$lenght]['expanded'] = true;

                } else {
                    $treeFormat[$lenght]['leaf'] = true;
                }
            } else {
                $cont++;
            }
        }
        return $treeFormat;
    }

	function cargarEscalaAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $r->datos = $this->pIntegrator->evaluaciones->getValuesByIdEscala($idescala);
        echo json_encode($r);
    }

    public function getPersonaRecomendacionAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = $this->pIntegrator->procesoevaluativo->getPersonaRecomendacion(
            $idpersonaevaluacion, $limit, $start
        );
        $r['cantidad'] = $this->pIntegrator->procesoevaluativo->getCantPersonaRecomendacion($idpersonaevaluacion);
        echo json_encode($r);
    }

    public function getPersonaSenalamientoAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = $this->pIntegrator->procesoevaluativo->getPersonaSenalamiento(
            $idpersonaevaluacion, $limit, $start
        );
        $r['cantidad'] = $this->pIntegrator->procesoevaluativo->getCantPersonaSenalamiento($idpersonaevaluacion);
        echo json_encode($r);
    }

    public function getRecomendacionesPEAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = $this->pIntegrator->procesoevaluativo->getRecomendacionesPE(
            $iddefprocesoevaluativo, $limit, $start
        );
        $r['cantidad'] = $this->pIntegrator->procesoevaluativo->getCantRecomendacionesPE($iddefprocesoevaluativo);
        echo json_encode($r);
    }

    public function adicionarPersonaRecomendacionAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $arrRecomendaciones = json_decode(stripslashes($this->_request->getPost('arrRecomendaciones')));
        $existe = false;
        $cantFallidos = 0;
        foreach ($arrRecomendaciones as $r) {
            $existe = $this->pIntegrator->procesoevaluativo->existePersonaRecomendacion($r, $idpersonaevaluacion);
            if (!$existe) {
                $this->pIntegrator->procesoevaluativo->adicionarPersonaRecomendacion($r, $idpersonaevaluacion);
            } else {
                ++$cantFallidos;
            }
        }
        if ($cantFallidos > 0) {
            $p['codMsg'] = 1;
            $p['continuar'] = false;
            $p['mensaje'] = "Algunas recomendaciones no se adicionaron porque ya existen.";
            echo json_encode($p);
        } else {
            $result['codMsg'] = 1;
            $result['continuar'] = true;
            $result['mensaje'] = "La recomendaci&oacute;n ha sido adicionada satisfactoriamente.";
            echo json_encode($result);
        }
    }

    function eliminarPersonaRecomendacionAction()
    {
        $idpersonarecomendaciones = $this->_request->getPost('idpersonarecomendaciones');
        $varAux = $this->pIntegrator->procesoevaluativo->eliminarPersonaRecomendacion($idpersonarecomendaciones);
        $r['codMsg'] = 1;
        $r['mensaje'] = "La recomendaci&oacute;n ha sido eliminada satisfactoriamente.";
        echo json_encode($r);
    }

    function getSenalamientosPEAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = $this->pIntegrator->procesoevaluativo->getSenalamientosPE(
            $iddefprocesoevaluativo, $limit, $start
        );
        $r['cantidad'] = $this->pIntegrator->procesoevaluativo->getCantSenalamientosPE($iddefprocesoevaluativo);
        echo json_encode($r);
    }

    public function adicionarPersonaSenalamientoAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $arrSenalamientos = json_decode(stripslashes($this->_request->getPost('arrSenalamientos')));
        $existe = false;
        $cantFallidos = 0;
        foreach ($arrSenalamientos as $r) {
            $existe = $this->pIntegrator->procesoevaluativo->existePersonaSenalamiento($r, $idpersonaevaluacion);
            if (!$existe) {
                $this->pIntegrator->procesoevaluativo->adicionarPersonaSenalamiento($r, $idpersonaevaluacion);
            } else {
                ++$cantFallidos;
            }
        }
        if ($cantFallidos > 0) {
            $p['codMsg'] = 1;
            $p['continuar'] = false;
            $p['mensaje'] = "Algunos se&ntilde;alamientos no se adicionaron porque ya existen.";
            echo json_encode($p);
        } else {
            $result['codMsg'] = 1;
            $result['continuar'] = true;
            $result['mensaje'] = "El se&ntilde;alamiento ha sido adicionado satisfactoriamente.";
            echo json_encode($result);
        }
    }

    function eliminarPersonaSenalamientoAction()
    {
        $idpersonasenyalamientos = $this->_request->getPost('idpersonasenyalamientos');
        $varAux = $this->pIntegrator->procesoevaluativo->eliminarPersonaSenalamiento($idpersonasenyalamientos);
        $r['codMsg'] = 1;
        $r['mensaje'] = "El se&ntilde;alamiento ha sido eliminado satisfactoriamente.";
        echo json_encode($r);
    }
/********************************************MODIFICADO PARA SACAR EL CALCULO DEL INDICADOR PADRE***********************************/
    function guardarValorEvalIndicadorAction()
    {
        $arrIndicadores = json_decode(stripslashes($this->_request->getPost('indicadores')));
        $arrIndPadres = json_decode(stripslashes($this->_request->getPost('padreindicadores')));
        $arrvalores = json_decode(stripslashes($this->_request->getPost('valores')));
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $complementotextual = $this->_request->getPost('complementotextual');
        $idpersona = $this->_request->getPost('idrecurso');
        $idindicadorevaluacionPadre = $this->_request->getPost('idindicadorevaluacionPadre');
        $idexpresionmatematica=0;
        $calcular = json_decode($this->_request->getPost('calcular'));
        $r->success = false;

        foreach($arrIndPadres as $p){
            if($p->idpadre == -1){
                if (count($arrIndicadores)>0) {
                    foreach ($arrIndicadores as $p => $val) {
                        $valor = (count($arrvalores) == 1)?$arrvalores[0]:$arrvalores[$p];
                        $idindicadorevaluacion = $val->idindicadorevaluacion;

                        if (!empty($idindicadorevaluacion)) {
                            $objQuery = Doctrine_Query::create();
                            $objQuery->update('DatEvalindicadoresevaluacion')
                                ->where('idindicadorevaluacion = ?', $idindicadorevaluacion);
                            $objQuery->set('valor', "'$valor'");

                           // if ($complementotextual) {
                                $objQuery->set("complementotextual", "'$complementotextual'");
                           // }
                            $objQuery->execute();
                        }
                    }
                    //Pregunta si hay que calcular la evaluacion final
                    if ($calcular == true) {
                        $objDatEstructurapersona = new DatEstructurapersona();
                        $datosPersona = $objDatEstructurapersona->getDatosPlanillaModeloPersona($idpersonaevaluacion);
                        $idmodelo = $datosPersona[0]['idmodelo'];
                        $resultado = $this->aplicarmodelosmatematicos($idpersonaevaluacion, $idmodelo);
                        $objAuxModel = new DatEvalpersonaevaluacionModel();
                        $objAux = $objAuxModel->getPersonaEvaluacion($idpersonaevaluacion);
                        $objAux->valor = $resultado->valor;
                        if (isset($resultado->idescala)) {
                            $objAux->idescala = $resultado->idescala;
                        }
                        $objAux->save();
                        $valorMostrar = $resultado->valor;

                        if (!empty($resultado->idescala)) {

                            $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($resultado->idescala);

                            $valorMostrar = '';
                            foreach ($valoresEscala as $valorEscala) {
                                if ($valorEscala['valor'] == $resultado->valor) {
                                    $valorMostrar = $valorEscala['denom'];
                                    break;
                                }
                            }
                        }

                        $r->resultadoEvaluacion = $valorMostrar;
                    }
                }
            }
            else{
                $indicador = $p->idindicadorevaluacion;
                $query = Doctrine_Manager::getInstance();
                $sql = "SELECT ip.idindicadorplanilla,ip.idindicador,ip.tipo,ip.abreviatura,ip.idpadre,ip.calculado,ip.ayuda,die.idescala,
                  die.complementotextual, ip.eshoja, dic.idindicadorcalculado, idexpresionmatematica
					FROM mod_evaluaciones.dat_evalindicadoresevaluacion e
					left join  mod_evaluaciones.dat_evalindicadoresplanilla ip on(ip.idindicadorplanilla = e.idindicadorplanilla)
					left JOIN mod_evaluaciones.dat_evalindicadoresevaluar die ON (ip.idindicadorplanilla = die.idindicadorplanilla)
                    left JOIN mod_evaluaciones.dat_evalindicadorescalculado dic ON (ip.idindicadorplanilla = dic.idindicadorplanilla)
					WHERE  e.idindicadorevaluacion = $indicador	";
                $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

                $p->idindicadorplanilla=$result[0]['idindicadorplanilla'];
                if($result[0]['idexpresionmatematica']!=null || $result[0]['idexpresionmatematica']!=''){
                    $p->idexpresionmatematica=$result[0]['idexpresionmatematica'];
                }
            }
        }

        if (count($arrIndicadores)>0) {

            foreach ($arrIndicadores as $p => $val) {

                $valor = (count($arrvalores) == 1)?$arrvalores[0]:$arrvalores[$p];
                $idindicadorevaluacion = $val->idindicadorevaluacion;

                if (!empty($idindicadorevaluacion)) {
                    $objQuery = Doctrine_Query::create();
                    $objQuery->update('DatEvalindicadoresevaluacion')
                        ->where('idindicadorevaluacion = ?', $idindicadorevaluacion);
                    $objQuery->set('valor', "'$valor'");

                   // if ($complementotextual) {
                        $objQuery->set("complementotextual", "'$complementotextual'");
                   // }
                    $objQuery->execute();
                }
            }
            /********************Para actualizar los padres****************************/
            $cont = 0;

            if (count($arrIndPadres)>0) {

                for ($i=0;$i<count($arrIndPadres);$i++) {
                    $idpadre = $arrIndPadres[$i]->idindicadorplanilla;
                    $idindicadorevaluacion = $arrIndPadres[$i]->idindicadorevaluacion;
                    $idexpresionmatematica = $arrIndPadres[$i]->idexpresionmatematica;
                    if (!empty($idindicadorevaluacion)) {
                        //Pregunto si el indicador padre es calculado por una expresion matematica  y evaluo la expresion matematica
                        if ($idexpresionmatematica!=0) {

                            $arrIndicadores = DatEvalindicadoresevaluacion::getEvalIndicadoresHijos($idpersona, $idpadre, $idpersonaevaluacion);
                            //Verifico que si hay algun indicador que no ha sido evaluado y le pongo de valor 0 por defecto.
                            foreach ($arrIndicadores as &$ind) {
                                if (empty($ind['valor'])) {
                                    $ind['valor'] = 0;
                                }
                            }
                            $aux = $this->pIntegrator->comun->EvaluarExpresionMatematica(
                                $idexpresionmatematica, $arrIndicadores
                            );

                            $idindicadorevaluacionPadre = $arrIndPadres[$i]->idindicadorevaluacion;

                            if ($aux->codigo == 1) {
                                $valor = round($aux->valor);
                                $objQueryIndParent = Doctrine_Query::create();
                                //Guarda el resultado del calculo para el indicador padre
                                $objQueryIndParent->update('DatEvalindicadoresevaluacion')
                                    ->set('valor', floatval($valor))
                                    ->where('idindicadorevaluacion = ?', $idindicadorevaluacionPadre)
                                    ->execute();
                                if($arrIndPadres[$i]->idindicadorevaluacion != $arrIndPadres[$i+1]->idindicadorevaluacion){
                                    $r->padre->mostrar[$cont]['valor'] = $valor;
                                    $r->padre->mostrar[$cont]['valorMostrar'] = $valor;
                                    $r->padre->mostrar[$cont]['idindicadorevaluacion'] =  $arrIndPadres[$i]->idindicadorevaluacion;
                                    $r->padre->mostrar[$cont]['idpadre'] =  $arrIndPadres[$i]->idpadre;
                                    $cont++;
                                }

                            }

                        }else{
                            $r->padre->mostrar[$cont]['valor'] = 0;
                            $r->padre->mostrar[$cont]['valorMostrar'] = 0;
                            $r->padre->mostrar[$cont]['idindicadorevaluacion'] =  $arrIndPadres[$i]->idindicadorevaluacion;
                            $r->padre->mostrar[$cont]['idpadre'] =  $arrIndPadres[$i]->idpadre;
                        }
                    }
                }

            }
            /*****************************************************************************************************************/
            //Pregunta si hay que calcular la evaluacion final
            if ($calcular == true) {
                $objDatEstructurapersona = new DatEstructurapersona();
                $datosPersona = $objDatEstructurapersona->getDatosPlanillaModeloPersona($idpersonaevaluacion);
                $idmodelo = $datosPersona[0]['idmodelo'];
                $resultado = $this->aplicarmodelosmatematicos($idpersonaevaluacion, $idmodelo);

                $objAuxModel = new DatEvalpersonaevaluacionModel();
                $objAux = $objAuxModel->getPersonaEvaluacion($idpersonaevaluacion);
                $objAux->valor = $resultado->valor;
                if (isset($resultado->idescala)) {
                    $objAux->idescala = $resultado->idescala;
                }
                $objAux->save();
                $valorMostrar = $resultado->valor;

                if (!empty($resultado->idescala)) {

                    $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($resultado->idescala);

                    $valorMostrar = '';
                    foreach ($valoresEscala as $valorEscala) {
                        if ($valorEscala['valor'] == $resultado->valor) {
                            $valorMostrar = $valorEscala['denom'];
                            break;
                        }
                    }
                }

                $r->resultadoEvaluacion = $valorMostrar;

            }
        }
        /*if($arrIndPadres[0]->idpadre == -1){
            if (count($arrIndicadores)>0) {

                foreach ($arrIndicadores as $p => $val) {

                    $valor = (count($arrvalores) == 1)?$arrvalores[0]:$arrvalores[$p];
                    $idindicadorevaluacion = $val->idindicadorevaluacion;

                    if (!empty($idindicadorevaluacion)) {
                        $objQuery = Doctrine_Query::create();
                        $objQuery->update('DatEvalindicadoresevaluacion')
                            ->where('idindicadorevaluacion = ?', $idindicadorevaluacion);
                        $objQuery->set('valor', "'$valor'");

                        if ($complementotextual) {
                            $objQuery->set("complementotextual", "'$complementotextual'");
                        }
                        $objQuery->execute();
                    }
                }

                //Pregunta si hay que calcular la evaluacion final
                if ($calcular == true) {
                    $objDatEstructurapersona = new DatEstructurapersona();
                    $datosPersona = $objDatEstructurapersona->getDatosPlanillaModeloPersona($idpersonaevaluacion);
                    $idmodelo = $datosPersona[0]['idmodelo'];
                    $resultado = $this->aplicarmodelosmatematicos($idpersonaevaluacion, $idmodelo);
                    $objAuxModel = new DatEvalpersonaevaluacionModel();
                    $objAux = $objAuxModel->getPersonaEvaluacion($idpersonaevaluacion);
                    $objAux->valor = $resultado->valor;
                    if (isset($resultado->idescala)) {
                        $objAux->idescala = $resultado->idescala;
                    }
                    $objAux->save();
                    $valorMostrar = $resultado->valor;

                    if (!empty($resultado->idescala)) {

                        $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($resultado->idescala);
                        $valorMostrar = '';
                        foreach ($valoresEscala as $valorEscala) {
                            if ($valorEscala['valor'] == $resultado->valor) {
                                $valorMostrar = $valorEscala['denom'];
                                break;
                            }
                        }
                    }
                    $r->resultadoEvaluacion = $valorMostrar;
                }
            }

        }*/
        /*else{
            for($i = 0;$i<count($arrIndPadres);$i++){
                $indicador = $arrIndPadres[$i]->idindicadorevaluacion;
                if($arrIndPadres[$i]->idpadre!=-1){
                    $query = Doctrine_Manager::getInstance();
                    $sql
                        = "SELECT ip.idindicadorplanilla,ip.idindicador,ip.tipo,ip.abreviatura,ip.idpadre,ip.calculado,ip.ayuda,die.idescala,
                          die.complementotextual, ip.eshoja, dic.idindicadorcalculado,
                  idexpresionmatematica
					FROM mod_evaluaciones.dat_evalindicadoresevaluacion e
					left join  mod_evaluaciones.dat_evalindicadoresplanilla ip on(ip.idindicadorplanilla = e.idindicadorplanilla)
					left JOIN mod_evaluaciones.dat_evalindicadoresevaluar die ON (ip.idindicadorplanilla = die.idindicadorplanilla)
                    left JOIN mod_evaluaciones.dat_evalindicadorescalculado dic ON (ip.idindicadorplanilla = dic.idindicadorplanilla)
					WHERE  e.idindicadorevaluacion = $indicador	";
                    $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

                    $arrIndPadres[$i]->idindicadorplanilla=$result[0]['idindicadorplanilla'];
                    if($result[0]['idexpresionmatematica']!=null || $result[0]['idexpresionmatematica']!=''){
                        $arrIndPadres[$i]->idexpresionmatematica=$result[0]['idexpresionmatematica'];
                    }
                }
            }
            if (count($arrIndicadores)>0) {
                foreach ($arrIndicadores as $p => $val) {

                    $valor = (count($arrvalores) == 1)?$arrvalores[0]:$arrvalores[$p];
                    $idindicadorevaluacion = $val->idindicadorevaluacion;

                    if (!empty($idindicadorevaluacion)) {
                        $objQuery = Doctrine_Query::create();
                        $objQuery->update('DatEvalindicadoresevaluacion')
                            ->where('idindicadorevaluacion = ?', $idindicadorevaluacion);
                        $objQuery->set('valor', "'$valor'");

                        if ($complementotextual) {
                            $objQuery->set("complementotextual", "'$complementotextual'");
                        }
                        $objQuery->execute();
                    }
                }
                //Pregunta si hay que calcular la evaluacion final
                if ($calcular == true) {
                    $objDatEstructurapersona = new DatEstructurapersona();
                    $datosPersona = $objDatEstructurapersona->getDatosPlanillaModeloPersona($idpersonaevaluacion);
                    $idmodelo = $datosPersona[0]['idmodelo'];
                    $resultado = $this->aplicarmodelosmatematicos($idpersonaevaluacion, $idmodelo);
                    $objAuxModel = new DatEvalpersonaevaluacionModel();
                    $objAux = $objAuxModel->getPersonaEvaluacion($idpersonaevaluacion);
                    $objAux->valor = $resultado->valor;
                    if (isset($resultado->idescala)) {
                        $objAux->idescala = $resultado->idescala;
                    }
                    $objAux->save();
                    $valorMostrar = $resultado->valor;

                    if (!empty($resultado->idescala)) {

                        $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($resultado->idescala);
                        $valorMostrar = '';
                        foreach ($valoresEscala as $valorEscala) {
                            if ($valorEscala['valor'] == $resultado->valor) {
                                $valorMostrar = $valorEscala['denom'];
                                break;
                            }
                        }
                    }
                    $r->resultadoEvaluacion = $valorMostrar;
                }
            }

            $cont = 0;

            if (count($arrIndPadres)>0) {
                for ($i=0;$i<count($arrIndPadres);$i++) {

                    $idpadre = $arrIndPadres[$i]->idindicadorplanilla;
                    $idindicadorevaluacion = $arrIndPadres[$i]->idindicadorevaluacion;
                    $idexpresionmatematica = $arrIndPadres[$i]->idexpresionmatematica;
                    if (!empty($idindicadorevaluacion)) {
                        //Pregunto si el indicador padre es calculado por una expresion matematica  y evaluo la expresion matematica
                        if ($idexpresionmatematica!=0) {

                            $arrIndicadores = DatEvalindicadoresevaluacion::getEvalIndicadoresHijos($idpersona, $idpadre, $idpersonaevaluacion);
                            //Verifico que si hay algun indicador que no ha sido evaluado y le pongo de valor 0 por defecto.

                            foreach ($arrIndicadores as &$ind) {
                                if (empty($ind['valor'])) {
                                    $ind['valor'] = 0;
                                }
                            }
                            $aux = $this->pIntegrator->comun->EvaluarExpresionMatematica(
                                $idexpresionmatematica, $arrIndicadores
                            );
                            $idindicadorevaluacionPadre = $arrIndPadres[$i]->idindicadorevaluacion;

                            if ($aux->codigo == 1) {
                                $valor = round($aux->valor);
                                $objQueryIndParent = Doctrine_Query::create();
                                //Guarda el resultado del calculo para el indicador padre
                                $objQueryIndParent->update('DatEvalindicadoresevaluacion')
                                    ->set('valor', floatval($valor))
                                    ->where('idindicadorevaluacion = ?', $idindicadorevaluacionPadre)
                                    ->execute();
                                if($arrIndPadres[$i]->idindicadorevaluacion != $arrIndPadres[$i+1]->idindicadorevaluacion){
                                    $r->padre->mostrar[$cont]['valor'] = $valor;
                                    $r->padre->mostrar[$cont]['valorMostrar'] = $valor;
                                    $r->padre->mostrar[$cont]['idindicadorevaluacion'] =  $arrIndPadres[$i]->idindicadorevaluacion;
                                    $r->padre->mostrar[$cont]['idpadre'] =  $arrIndPadres[$i]->idpadre;
                                    $cont++;
                                }

                            }

                        }else{
                            $r->padre->mostrar[$cont]['valor'] = 0;
                            $r->padre->mostrar[$cont]['valorMostrar'] = 0;
                            $r->padre->mostrar[$cont]['idindicadorevaluacion'] =  $arrIndPadres[$i]->idindicadorevaluacion;
                            $r->padre->mostrar[$cont]['idpadre'] =  $arrIndPadres[$i]->idpadre;
                        }
                    }
                }

            }
        }*/


        $r->success = true;
        echo json_encode($r);
    }


    function validarIndicadoresEvaldosAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $idpersonaevalfueraproceso = $this->_request->getPost('idpersonaevalfueraproceso');
        $idpersonalistadocandidatos = $this->_request->getPost('idpersonalistadocandidatos');
        $idperiodo = $this->_request->getPost('idperiodo');
        $bandera = false;
        $indicadores = array();
        if ($idpersonaevaluacion) {
            $objDatEvalindicadoresevaluacion = new DatEvalindicadoresevaluacion();
            $indicadores = $objDatEvalindicadoresevaluacion->getIndicadoresByPersonEvaluacion($idpersonaevaluacion);
        }
        foreach ($indicadores as $indicador) {
            if ($indicador['idescala'] != "" && $indicador['valor'] == "") {
                $bandera = true;
                break;
            }
        }
        $r->success = !$bandera;
        echo json_encode($r);
    }

    public function guardarEvalFinalAction()
    {
       // $existe = $this->pIntegrator->evaluaciones->getEvaluadosByPeriodo(206);
        $idpersona = $this->_request->getPost('idpersona');
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');

        $objDatEstructurapersona = new DatEstructurapersona();
        $datosPersona = $objDatEstructurapersona->getDatosPlanillaModeloPersona($idpersonaevaluacion);

        $idmodelo = $datosPersona[0]['idmodelo'];

        $integrador = ZendExt_IoC::getInstance();
        $datosPersona = ZendExt_IoC::getInstance()->pvd->obtenerDatosdePersonaparaJabber($idpersona);

        $DatProcesoNotifModel = new DatProcesonotifModel();
        $datos = $DatProcesoNotifModel->getDatosProceso($iddefprocesoevaluativo);

       /* if (count($datosPersona['correoelectronico']) > 0 && count($datos) > 0) {
            $hora = date("H:i:s");
            $arr = explode(':', $hora);
            if ($arr[0] > 11 && $arr[0] < 19) {
                $saludo = 'Buenas tardes. ';
            }
            if ($arr[0] > 18 && $arr[0] < 24) {
                $saludo = 'Buenas noches. ';
            }
            if ($arr[0] > 00 && $arr[0] < 12) {
                $saludo = 'Buenas d&iacute;as. ';
            }
            $rsa = new ZendExt_RSA();
            $keys = $rsa->generate_keys('9990454949', '9990450271', 0);
            $contraCorreo = $rsa->decrypt($datos[0]['contrasenna'], $keys[2], $keys[0]);

            $mail = new PHPMailer();
            $mail->IsSMTP();

            $mail->SMTPSecure = "tls";
            $mail->SMTPAuth = true;
            $mail->Host = "smtp.xetid.cu";
            $mail->Port = 25;
            $mail->Username = $datos[0]['remitente'];
            $mail->Password = $contraCorreo;
            $mail->Mailer = "smtp";
            $mail->Timeout = 50;

            //====== DE QUIEN ES ========
            $mail->From = $datos[0]['remitente'];
            $mail->FromName = $datos[0]['remitente'];
            //====== PARA QUIEN =========
            $mail->Subject = $datos[0]['asunto'];

            $mail->AddAddress($datosPersona['correoelectronico'], $datosPersona['nombre']);

            //Cuerpo del mensaje
            $body .= $saludo . " " . $datosPersona['nombre'];
            $body
                .=
                "  Por este medio se le informa que tiene una notificaci&oacute;n, mensaje de la notificadi&oacute;n :  "
                . "<b>" . $datos[0]['mensaje'] . "</b>" . " ..Saludos.";
            $mail->Body = $body;
            $mail->IsHTML(true);

            ob_start();
            $mail->Send();
            ob_get_clean();
        }*/

        $resultado = $this->aplicarmodelosmatematicos($idpersonaevaluacion, $idmodelo);

        $objAuxModel = new DatEvalpersonaevaluacionModel();
        $objAux = $objAuxModel->getPersonaEvaluacion($idpersonaevaluacion);
        $objAux->estado = 1;
        $objAux->valor = $resultado->valor;
        if (isset($resultado->idescala)) {
            $objAux->idescala = $resultado->idescala;
        }
        $objAuxModel->Actualizar($objAux);
        $r->success = true;
        $r->valor = $objAux->valor;
        $r->estado = $objAux->estado;

        echo json_encode($r);


    }

    public function guardarEvalFinalOpinionEvaldoAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $deacuerdo = $this->_request->getPost('deacuerdo');
        $hareclamado = $this->_request->getPost('hareclamado');
        $opinionevaluado = $this->_request->getPost('opinionevaluado');
        $objAuxModel = new DatEvalpersonaevaluacionModel();
        $objAux = $objAuxModel->getPersonaEvaluacion($idpersonaevaluacion);
        $objAux->estado = $hareclamado == 2 ? 3 : 1;
        $objAux->deacuerdo = $deacuerdo;
        $objAux->hareclamado = $hareclamado;
        $objAux->opinionevaluado = $opinionevaluado;
        $objAuxModel->Actualizar($objAux);
        $r->success = true;
        echo json_encode($r);
    }

    function exiteRecomendacionSenamientosPEAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $limit = 1;
        $start = 0;
        //$r['datos'] = $this->pIntegrator->procesoevaluativo->getSenalamientosPE($iddefprocesoevaluativo, $limit, $start);
        $cantRecomendaciones = $this->pIntegrator->procesoevaluativo->getCantRecomendacionesPE($iddefprocesoevaluativo);
        $cantSenalamientos = $this->pIntegrator->procesoevaluativo->getCantSenalamientosPE($iddefprocesoevaluativo);
        $r = false;
        if ($cantRecomendaciones > 0 || $cantSenalamientos > 0) {
            $r = true;
        }
        echo json_encode($r);
    }

    private function aplicarmodelosmatematicos($idpersonaevaluacion, $idmodelo)
    {
        //Obtengo indicadores
        $arrIndicadores = $this->getIndicadoresEvalTextByPersona($idpersonaevaluacion);

        //Comprueba que los indicadores que no han sido evaluados les pone 0
        foreach ($arrIndicadores as $k => $ind) {
            if (empty($ind['valor'])) {
                $arrIndicadores[$k]['valor'] = 0;
            }
        }

        //Obtengo modelo
        $modelo = $this->pIntegrator->evaluaciones->getModeloById($idmodelo);

        $r->valor = 0;
        if (empty($modelo[0]->idescala)) {
            //Caso en que el modelo matematico es el resultado de una expresion matematica
            $aux = $this->pIntegrator->comun->EvaluarExpresionMatematica(
                $modelo[0]->idexpresionmatematica, $arrIndicadores
            );

            $r->valor = round($aux->valor, 2);
        } else {
            $r->idescala = $modelo[0]->idescala;
            //Caso en que el modelo matematico se calcula con hechos
            $arrHechos = $this->pIntegrator->evaluaciones->getHechosByModelo($idmodelo);
            if (!empty($arrHechos)) {
                foreach ($arrHechos as $hecho) {
                    $aux = $this->pIntegrator->comun->EvaluarExpresionMatematica(
                        $hecho['idexpresionmatematica'], $arrIndicadores
                    );
                    //Verifico que se haya cumplido la expresion matematica para este hecho
                    if ($aux->codigo == 1 && $aux->valor == 1) {
                        $r->valor = $hecho['peso'];
                        break;
                    }
                }
            } else {
                return false;
            }
        }

        return $r;
    }

    function getModelosPorPlanillaAction()
    {
        $idplanilla = $this->_request->getPost('idplanilla');
        $arrModelos['datos'] = $this->pIntegrator->evaluaciones->getModelosActivosPorPlanilla($idplanilla);
        echo json_encode($arrModelos);
    }

    public function getIndicadoresEvalTextByPersona($idpersonaevaluacion)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = " SELECT inp.idindicador, ie.valor
            FROM mod_evaluaciones.dat_evalindicadoresevaluacion ie
            INNER JOIN mod_evaluaciones.dat_evalindicadoresplanilla inp ON(ie.idindicadorplanilla = inp.idindicadorplanilla)
            WHERE ie.idpersonaevaluacion = {$idpersonaevaluacion}";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function cargarcbCausaNoEvalAction()
    {
        $causa = new NomCausanoevaluadoModel();
        $datos['datos'] = $causa->getCausaNoEvalaluados();
        echo(json_encode($datos));
    }

    public function cambiarestadodesarrolloAction()
    {
        $idestadodesarrollo = $this->_request->getPost('idestadodesarrollo');
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $objPersonaEval = new DatEvalpersonaevaluacion();
        $objPersonaEval->CambiarEstadoDesarrollo($idestadodesarrollo, $idpersonaevaluacion);
        $r->modificado = true;
        echo(json_encode($r));
    }

    public function modevalpersonaAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $idcausa = $this->_request->getPost('idcausa');
        $estado = 3;
        $objPersonaEval = new DatEvalpersonaevaluacion();
        $objPersonaEval->CambiarEvaluacion($idpersonaevaluacion, $idcausa, $estado);
        $r->modificado = true;
        echo(json_encode($r));
    }

    public function agregarOpinionAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $opinion = $this->_request->getPost('opinion');
        $acuerdo = $this->_request->getPost('acuerdo');
//        $noreclama = $this->_request->getPost('noreclama');
        $objPersonaEval = new DatEvalpersonaevaluacionModel();
        $objPersonaEval->agregarOpinion($idpersonaevaluacion, $acuerdo, $opinion);
        $r['success'] = true;
        $r['modificado'] = true;
        echo json_encode($r);
    }

    public function reclamarAction()
    {
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $objPersonaEval = new DatEvalpersonaevaluacion();
        $objPersonaEval->Reclamar($idpersonaevaluacion);
        $r->modificado = true;
        echo(json_encode($r));
    }

    public function printEvalAction()
    {
        $arrIdPersona = json_decode($this->_request->get('arridpersona'));
        $idperiodoproceso = $this->_request->get('idperiodoproceso');
        $idpreprocesoevaluativo = $this->_request->get('idpreprocesoevaluativo');
        $complemento = $this->_request->get('complemento');
        $formato =  $this->_request->get('formato');

        //Periodo a evaluar
        $startDate = $this->_request->get('fechainicio');
        $endDate = $this->_request->get('fechafin');

        $idestructura =$this->global->Estructura->idestructura;

        $idusuario = $this->global->Perfil->idusuario;
        $segUserPers = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);


        $objEvaluados = new DatEvalpersonaevaluacion();
        $arrEvaluados = $objEvaluados->getEvaluacionToPrint(
            $idperiodoproceso, $segUserPers[0]['idpersona'], $arrIdPersona
        );

        if( $complemento==0){
            $arrEvaluados[0]['complemento'] = 0;
            $obj = new PrintEvaluacionModel('P','mm',$formato);

            $obj->createPDF($arrEvaluados, $startDate, $endDate,$idestructura,$formato,0);
        }else{
            $arrEvaluados[0]['complemento'] = 1;
            $obj = new PrintEvaluacionComplementoModel('P','mm',$formato);

            $obj->createPDF($arrEvaluados, $startDate, $endDate,$idestructura,$formato,0);
        }
    }

    public function printEvalCuadrosAction()
    {
        $arrIdPersona = json_decode($this->_request->get('arridpersona'));
        $idperiodoproceso = $this->_request->get('idperiodoproceso');
        $idpreprocesoevaluativo = $this->_request->get('idpreprocesoevaluativo');
        $complemento = $this->_request->get('complemento');
        $formato = $this->_request->get('formato');
        //Periodo a evaluar
        $startDate = $this->_request->get('fechainicio');
        $endDate = $this->_request->get('fechafin');
        $idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $segUserPers = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);

        $objEvaluados = new DatEvalpersonaevaluacion();
        $arrEvaluados = $objEvaluados->getEvaluacionToPrint(
            $idperiodoproceso, $segUserPers[0]['idpersona'], $arrIdPersona
        );
        $obj = new PrintEvaluacionCuadrosModel('P','mm',$formato);
        $obj->createPDF($arrEvaluados, $startDate, $endDate,$idestructura,$formato);
    }

    public function firmarEvalAction()
    {
        $arrIdPersona = json_decode($this->_request->get('arridpersona'));
        $idperiodoproceso = $this->_request->get('idperiodoproceso');
        $complemento = $this->_request->get('complemento');
        $startDate = $this->_request->get('fechainicio');
        $endDate = $this->_request->get('fechafin');
        $idestructura =$this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $segUserPers = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);

        $objEvaluados = new DatEvalpersonaevaluacion();
        $arrEvaluados = $objEvaluados->getEvaluacionToPrint(
            $idperiodoproceso, $segUserPers[0]['idpersona'], $arrIdPersona
        );
        $result = array();
        if( $complemento == 0){
            $arrEvaluados[0]['complemento'] = 0;
            foreach ($arrEvaluados as $j => $evaluado) {
                $obj = new PrintEvaluacionModel('P', 'mm', 'A4');
                $result[$j] = $obj->createPDF(array($evaluado), $startDate, $endDate, $idestructura, $formato, 1);
            }
        }else{
            $arrEvaluados[0]['complemento'] = 1;
            foreach ($arrEvaluados as $j => $evaluado){
                $obj = new PrintEvaluacionComplementoModel('P','mm','A4');
                $result[$j] = $obj->createPDF(array($evaluado), $startDate, $endDate,$idestructura,$formato,1);
            }
        }
        echo(json_encode($result));
    }

    public function guardarIdCasoAction()
    {
        $idspersonasevaluacion = json_decode($this->_request->get('idspersonasevaluacion'));
        $idcaso = $this->_request->getPost('idcaso');
        $direcciones = json_decode($this->_request->get('direcciones'));
        foreach ($idspersonasevaluacion as $idpersonevaluacion){
            $objAux = DatEvalpersonaevaluacionModel::getPersonaEvaluacion($idpersonevaluacion);
            $objAux->idcaso = $idcaso;
            DatEvalpersonaevaluacionModel::Actualizar($objAux);
        }
        foreach ($direcciones as $dir){
            unlink($dir);
        }
        $r['firma'] = true;
        $r['success'] = true;
        echo json_encode($r);
    }

    public function visualizarCasoAction()
    {
        $idpersona = $this->_request->get('idpersona');
        $idperiodoproceso = $this->_request->get('idperiodoproceso');
        $idusuario = $this->global->Perfil->idusuario;
        $segUserPers = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $objEvaluados = new DatEvalpersonaevaluacion();
        $evaluado = $objEvaluados->getEvaluacionToPrint(
            $idperiodoproceso, $segUserPers[0]['idpersona'], array($idpersona)
        );
        $r = $evaluado[0]['idcaso'];
        echo json_encode($r);
    }

    public function eliminarCasoAction()
    {
        $arrIdPersona = json_decode($this->_request->get('arridpersona'));
        $idperiodoproceso = $this->_request->get('idperiodoproceso');
        $idusuario = $this->global->Perfil->idusuario;
        $segUserPers = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $idspersonasevaluacion = array();
        $objEvaluados = new DatEvalpersonaevaluacion();
        $evaluados = $objEvaluados->getEvaluacionToPrint(
            $idperiodoproceso, $segUserPers[0]['idpersona'], $arrIdPersona
        );
        foreach ($evaluados as $evaluado){
           array_push($idspersonasevaluacion, $evaluado['idpersonaevaluacion']);
        }
        $objEvaluados->deleteCaso($idspersonasevaluacion);
        $r->success = true;
        echo json_encode($r);
    }

	function printExportAction()
    {
        $arrIdPersona = json_decode($this->_request->get('arridpersona'));
        $idperiodoproceso = $this->_request->get('idperiodoproceso');

        $startDate = $this->_request->get('fechainicio');
        $endDate = $this->_request->get('fechafin');

        $modo = $this->_request->get('modo');

        $idusuario = $this->global->Perfil->idusuario;
        $segUserPers = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);

       $objEvaluados = new DatEvalpersonaevaluacion();
       $objPHPExcel = new PHPExcel();


        $arrEvaluados = $objEvaluados->getEvaluacionToPrint(
            $idperiodoproceso, $segUserPers[0]['idpersona'], $arrIdPersona
        );
        foreach($arrEvaluados as $k=>$r){
            $idmodelo = $r['idmodelo'];
            $idpersonaevaluacion = $r['idpersonaevaluacion'];
            $resultado = $this->aplicarmodelosmatematicos($idpersonaevaluacion, $idmodelo);
            $arrEvaluados[$k]['valorMostrar'] = $resultado->valor;

        }

        $objEvaluados->fnPintarEncabezado($objPHPExcel,$arrEvaluados);
        $objEvaluados->fnPintarCuerpo($objPHPExcel,$arrEvaluados,$modo);
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();

        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Evaluaciones.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();

        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        /*header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Evaluaciones.xls" ');
        header('Cache-Control: max-age=0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));

        $objPHPExcel->disconnectWorksheets();*/
        unset($objPHPExcel);
    }
	
    function getserieAction()
    {
        $objIndEval = new DatEvalindicadoresevaluacion();
        $arrIdpersonaevaluacion = json_decode($this->_request->getPost('arrIdpersonaevaluacion'));
        $arrIndicadores = json_decode($this->_request->getPost('arrInd'));
        $objResumen = new ResumenprocesoevaluativoModel();
        $r = $objResumen->getSerieIndicadoresPersona($arrIdpersonaevaluacion, $arrIndicadores);

        echo json_encode($r);
    }
    ////////////////////////////
    function getserieperiodoAction()
    {
        $arrIdpersonaevaluacion = json_decode($this->_request->getPost('arrIdpersonaevaluacion'));
        $arrPeriodo = json_decode($this->_request->getPost('arrInd'));
        $objResumen = new ResumenprocesoevaluativoModel();
        $r = $objResumen->getSeriePeriodoPersona($arrIdpersonaevaluacion, $arrPeriodo);
        echo json_encode($r);
    }
    ////////////////////////////

    function getValoresEscalaAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $valores = $this->pIntegrator->evaluaciones->getValuesByIdEscala($idescala);
        $r['datos'] = $valores;
        echo json_encode($r);
    }
    /////////////////////////////////////////
    function getReclamacionesAction()
    {
        $idpersona = $this->_request->getPost('idpersona');
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        $idPeriodoProceso = $this->_request->getPost('idperiodoproceso');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objReclamacion = new DatEvalpersonaevaluacionModel();
        $r['datos'] = $objReclamacion->getResumenReclamacion($idpersona, $idpersonaevaluacion,$idPeriodoProceso,$limit, $start);

        echo json_encode($r);
    }

	///////////////////////////////////////////nivel superior//////////////////////////////////
	function getNivelsuperiorAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $idpersonaevaluador = $this->_request->getPost('idpersonaevaluador');
        $idnivelreclamacion = $this->_request->getPost('idnivelreclamacion');
		$idreclamacion = $this->_request->getPost('idreclamacion');
		$idperiodo = $this->_request->getPost('idperiodo');
		$respuesta = $this->_request->getPost('respuesta');

		$objetoNivel = new DatNivelreclamacion();
		$cant = $objetoNivel->CantNivel($iddefprocesoevaluativo);

        $objetoEvaluacion = new DatEvalpersonaevaluacion();
        $evaluador = $objetoEvaluacion->Evaluadorsuperior($idpersonaevaluador,$idperiodo);

        if($cant > 1)
		{
		$objRespuesta = new DatRespuestareclamacion();
        $objRespuesta->idresponsable = $evaluador;
		$objRespuesta->idreclamacion = $idreclamacion;
		$objRespuesta->idnivelreclamacion = $idnivelreclamacion + 1;
		$objRespuesta->respuesta = $respuesta;
		$objRespuesta->procede = 0;
		$objRespuesta->fecha = null;

        $objRespuestaModel = new DatRespuestareclamacionModel();
        $objRespuestaModel->Insertar($objRespuesta);
		$r->codResult = 1;
        $r->mensaje = "La reclamacion cambio de nivel satisfactoriamente.";
		}
		else
		{
         $r->codResult = 3;
         $r->mensaje = "No existen mas niveles para reclamar.";
		}
        echo(json_encode($r));
    }

    function getPeriodosConcluidosAction()
    {
        $r = array();
        $idplanilla = $this->_request->getPost('idplanilla');
        $idmodelo = $this->_request->getPost('idmodelo');
        $idpersonaevaluado = $this->_request->getPost('idpersona');
        $identidad = $this->global->Estructura->idestructura;
        if($idplanilla!=null){
            $datos = DatPeriodoproceso::getPeriodosConcluidos($identidad, $idplanilla, $idmodelo, $idpersonaevaluado);
        }
        if(count($datos)>0){
            $r['datos'] = $datos;
        }

        echo json_encode($r);
    }

    function actualizarEvaluacionAction()
    {
        $idpersonaevaluacionanterior = $this->_request->getPost('idpersonaevaluacionanterior');
        $idpersonaevaluacionactual = $this->_request->getPost('idpersonaevaluacion');
        $valorindicadores = DatEvalindicadoresevaluacion::getIndicadoresByPersonEvaluacion($idpersonaevaluacionanterior);
        if($valorindicadores!=null){
            foreach ($valorindicadores as $ind) {
                $r = DatEvalindicadoresevaluacion::updateValorIndicador($ind['indicadorplanilla'], $ind['valor'], $idpersonaevaluacionactual);
            }
            $objPerEvalAnt = DatEvalpersonaevaluacion::Buscar($idpersonaevaluacionanterior);
            $objPerEvalActual = DatEvalpersonaevaluacion::Buscar($idpersonaevaluacionactual);
            $objPerEvalActual->valor = $objPerEvalAnt->valor;
            $objPerEvalActual->save();

            echo json_encode($r);
        }
        else
        {
            $r = false;
            echo json_encode($r);
        }

    }

    public function importarDatosExcelAction()
    {
        $idpersonaevaluacion = $this->_getParam('idpersonaevaluacion');
        $idmodelo = $this->_getParam('idmodelo');
        $idplanilla = $this->_getParam('idplanilla');
        $numid = $this->_getParam('numid');
        $identidad = $this->global->Estructura->idestructura;
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $nameFile = explode('.', $_FILES['fileUpload']['name']);
        if ($nameFile[count($nameFile)-1] == 'xls'/* || $nameFile[count($nameFile)-1] == 'xlsx'*/) {
            $dir_file = $_FILES['fileUpload']['tmp_name'];
            //Si la direccion del archivo existe
            if (file_exists($dir_file)) {
                $configImportar = ZendExt_IoC_Inter::getInstance()->maestro->obtenerConfImportarExcel(1, $identidad, array($idplanilla));
                if (count($configImportar)>0) {
                    $inputFileType = ($configImportar[0]['extension'] == 'xls')?'Excel5':'Excel2007';
                    //Creando un Reader de PhpExcel para 2005
                    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
                    $objReader->setReadDataOnly(true);
                    $objPHPExcel = $objReader->load($dir_file);
                    $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
                    $valorindicadores = DatEvalindicadoresevaluacion::getIndicadoresByPersonEvaluacion($idpersonaevaluacion);
                    foreach ($configImportar[0]['ConfImportarcamposexcel'] as $i => $conf) {
                        $encontrado = false;
                        foreach ($valorindicadores as $pind => $ind) {
                            if ($conf['idcampo'] == $ind['indicadorplanilla']) {
                                $encontrado = true;
                            }
                        }
                        if ($encontrado == true) {
                            $columnafila = explode(':', $conf['columnafila']);
                            $eval = (empty($worksheettoarray[$columnafila[1]][$columnafila[0]]))?0:$worksheettoarray[$columnafila[1]][$columnafila[0]];
                            if (is_numeric($eval)) {
                                DatEvalindicadoresevaluacion::updateValorIndicador($conf['idcampo'], $eval, $idpersonaevaluacion);
                            } else {
                                $respuesta->codMsg = 1;
                                $respuesta->failure = 'true';
                                echo json_encode($respuesta);
                                return;
                            }
                        }
                    }
                    $resultado = $this->aplicarmodelosmatematicos($idpersonaevaluacion, $idmodelo);
                    $objAux = DatEvalpersonaevaluacionModel::getPersonaEvaluacion($idpersonaevaluacion);
                    $objAux->valor = $resultado->valor;
                    if (isset($resultado->idescala)) {
                        $objAux->idescala = $resultado->idescala;
                    }
                    $objAux->save();
                    $respuesta->success = 'true';
                    echo json_encode($respuesta);
                    return;
                } else {
                    $respuesta->codMsg = 2;
                    $respuesta->failure = 'true';
                    echo json_encode($respuesta);
                }
            }  else {
                $respuesta->codMsg = 3;
                $respuesta->failure = 'true';
                echo json_encode($respuesta);
            }
        }  else {
            $respuesta->codMsg = 5;
            $respuesta->failure = 'true';
            echo json_encode($respuesta);
        }

    }

    function todosperiodosAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idplanilla = $this->_request->getPost('idplanilla');
        $idmodelo = $this->_request->getPost('idmodelo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $filtro = $this->_request->getPost('query');
        $obj = new DatEvalpersonaevaluacion();
        $r['datos'] = $obj->gettodosperiodos($idpreprocesoevaluativo, $idplanilla,$idmodelo,$filtro,$limit, $start);
        $r['cantidad'] = $obj->GetCantTotal($filtro);
        echo json_encode($r);
    }

    function getseriepersonaAction()
    {
        $arrIdperiodo = json_decode($this->_request->getPost('arrIdperiodo'));
        $arrIdpersonaevaluacion = json_decode($this->_request->getPost('arrIdpersonaevaluacion'));
        $arrIndicadores = json_decode($this->_request->getPost('arrInd'));
        $idpersona = json_decode($this->_request->getPost('idpersona'));
        $objResumen = new ResumenprocesoevaluativoModel();
        $r = $objResumen->getSeriePersona($arrIdpersonaevaluacion,$arrIdperiodo, $arrIndicadores, $idpersona);

        echo json_encode($r);
    }

    function getpersonasAction()
    {
        $arrInd = json_decode($this->_request->getPost('arrInd'));
        $idpersona = $this->global->Perfil->idpersona;


        $objResumen = new DatEvalpersonaevaluacion();
        $r = $objResumen->getPersona($arrInd,$idpersona);

        echo Zend_Json::encode(array('datos' => $r));

    }

    function cargarperiodosprocesosAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idnodo = $this->_request->getPost('idnodo');
        $idestructura = $this->global->Estructura->idestructura;
        if($idnodo == 'raizProceso')
        {
            $objPreProcesos = new DatEvalpreprocesoevaluativo();
            $r = $objPreProcesos->ObtenerTodosProcesos($idpreprocesoevaluativo);
            $r[0]['text'] = $r[0]['denom'];
            $r[0]['id'] = -1;
            echo json_encode($r);
        }
        else
        {
            $nodos = array();
            $objPreProcesos = new DatEvalpreprocesoevaluativo();
            $r->datos = $objPreProcesos->ObtenerTodosPeriodos($idestructura,$idpreprocesoevaluativo);

            if(count($r->datos)>0)
            {
                foreach($r->datos as $datos)
                {
                    $icono = "";
                    if ($datos['_parent'] == true) {
                        $icono = "task-folder";
                    } else {
                        if ($datos['_is_leaf'] == true) {
                            $icono = "indicadorTexto";
                            $a = true;
                        }
                    }
                    $valorComplementotextual = "";
                    $idindicadorevaluacion = null;
                    $idindicadorevalfueraproceso = null;
                    $idvalor = null;
                    $valor = '';
                    $nodos[] = array(
                        'id' => $datos['idperiodoproceso'],
                        'idperiodoproceso' => $datos['idperiodoproceso'],
                        'qtip' => ($datos['estado'] != '' ?
                                '<b>Descripci&oacute;n</b></br>' . $datos['estado'] : ''),
                        'text' => $datos['denominacion'],
                        'idpadre' => $datos['_parent'],
                        'tipo' => $v['tipo'],
                        'iconCls' => $icono,
                        'leaf' => $v['_is_leaf'] == 1 ? false : true,
                        'checked' => $v['_is_leaf'] == 1 ? null : false,
                        //'idindicadorevaluacion' => $idindicadorevaluacion,
                        //'idindicadorevalfueraproceso' => $idindicadorevalfueraproceso,
                        'idvalor' => $idvalor,
                        'valor' => $valor,
                        'valorComplementotextual' => $valorComplementotextual
                    );

                }

            }
            echo json_encode($nodos);
        }

    }

    function getPeriodosAction()
    {
        $identidad = $this->global->Estructura->idestructura;
        $datos = DatPeriodoproceso::getPeriodos($identidad);
        $r['datos'] = $datos;
        echo json_encode($r);
    }

    function cargarpersonasgraficarAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $idnodo = $this->_request->getPost('idnodo');
        $idpersona = $this->global->Perfil->idpersona;

        if($idnodo == 'raizProcesoP')
        {
            $objPreProcesos = new DatEvalpersonaevaluacion();
            $r = $objPreProcesos->ObtenerTodosPersona($idperiodoproceso);

            $r[0]['text'] = $r[0]['fullname'];
            $r[0]['id'] = -1;
            echo json_encode($r);
        }
        else
        {
            $nodos = array();
            $objPreProcesos = new DatEvalpersonaevaluacion();
            $r->datos = $objPreProcesos->ObtenerTodosPersonasEvaluador($idpersona,$idperiodoproceso);

            if(count($r->datos)>0)
            {
                foreach($r->datos as $datos)
                {

                    $icono = "task-folder";
                    if ($datos['_parent'] == true) {
                        $icono = "task-folder";
                    } else {
                        if ($datos['_is_leaf'] == true) {
                            $icono = "indicadorTexto";
                            $a = true;
                        }
                    }
                    $idvalor = null;
                    $valor = '';
                    $nodos[] = array(
                        'id' => $datos['idpersona'],
                        'idllave' =>$datos['idpersona'],
                        'idperiodoproceso' => $datos['idperiodoproceso'],
                        'qtip' => ($datos['fullname'] != '' ?
                                '<b>Evaluación</b></br>' . $datos['valor'] : ''),
                        'text' => $datos['fullname'],
                        'idpadre' => $datos['_parent'],
                        'tipo' => $v['tipo'],
                        'iconCls' => $icono,
                        'leaf' => $v['_is_leaf'] == 1 ? false : true,
                        'checked' => $v['_is_leaf'] == 1 ? null : false,
                        'idvalor' => $idvalor,
                        'valor' => $valor
                    );

                }

            }
            echo json_encode($nodos);
        }

    }

    function getseriepersonadispersionAction()
    {
        $idperiodoproceso = json_decode($this->_request->getPost('idperiodoproceso'));
        $arrPersona = json_decode($this->_request->getPost('arrInd'));
        $idusuario = $this->global->Perfil->idpersona;
        $nombre = $this->global->Perfil->nombre;

        $objResumen = new ResumenprocesoevaluativoModel();
        $r = $objResumen->getSeriePersonadispersion($idperiodoproceso, $arrPersona, $nombre);
        echo json_encode($r);
    }

    public function guardarEvaluacionDirAction(){
        //$idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');
        //$idpersona = $this->_request->getPost('idpersona');
        $personas = json_decode(stripslashes($this->_request->getPost('arraypersona')));

        $valor = $this->_request->getPost('valor');

        $objModel = new DatEvalpersonaevaluacionModel();
        //$bol =  $objModel->updValorfinal($idpersonaevaluacion,$idpersona,$valor);
        $bol =  $objModel->updValorfinal($personas,$valor);

        if($bol){
            $r->codigo = 1;
            $r->success = true;
        }
        else
        {
            $r->codigo = 51;
            $r->success = false;
        }
        echo json_encode($r);
    }

    public function importarEvaluacionExcelAction()
    {
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $idestructura = $this->global->Estructura->idestructura;
        $nameFile = explode('.', $_FILES['fileUpload']['name']);
        if($nameFile[count($nameFile)-1] == 'xls'){
            $dir_file = $_FILES["fileUpload"]["tmp_name"];
            if(file_exists($dir_file)){
                $objReader = PHPExcel_IOFactory::createReaderForFile($dir_file);
                $objReader->setReadDataOnly(true);
                $excelObject = $objReader->load($dir_file);
                $excelObject->setActiveSheetIndex(0);
                $array_aux = $excelObject->getActiveSheet()->toArray('', true, true, true);

                $objtPersona = new DatEvalpersonaevaluacion();
                $result = $objtPersona->ImportarEvaluaciones($array_aux) ;

                if($result==true){
                    $respuesta->codMsg = 1;
                    $respuesta->success = 'true';
                    echo json_encode($respuesta);
                    return;
                } else {
                    $respuesta->codMsg = 3;
                    $respuesta->failure = 'true';
                    echo json_encode($respuesta);
                    return;
                }
            } else {
                $respuesta->codMsg = 5;
                $respuesta->failure = 'true';
                echo json_encode($respuesta);
            }
        } else {
            $respuesta->codMsg = 6;
            $respuesta->failure = 'true';
            echo json_encode($respuesta);
        }
    }

    public function guardaropinionAction(){
        $opinion = $this->_request->getPost('opinion');
        $idpersonaevaluacion = $this->_request->getPost('idpersonaevaluacion');


        $objModel = new DatEvalpersonaevaluacionModel();
        $bol =  $objModel->updOpinionEval($opinion,$idpersonaevaluacion);

        if($bol){
            $r->codigo = 1;
            $r->success = true;
        }
        else
        {
            $r->codigo = 51;
            $r->success = false;
        }
        echo json_encode($r);
    }

    public function obtenerReporteAction()
    {
        $params = json_decode($_GET['params']);
        $fecha = gmdate("d/m/Y H:i:s");

        $idestructura =$this->global->Estructura->idestructura;

        $idusuario = $this->global->Perfil->idusuario;
        $segUserPers = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);

       $objEvaluados = new DatEvalpersonaevaluacion();
       $paramsreporte = $objEvaluados->getEvaluacionAnual($params,$segUserPers[0]['idpersona']);

        $obj = new ReporteEvaluacionAnualModel();

        $obj->createPDF($params, $fecha, $endDate,$idestructura,$paramsreporte,$segUserPers[0]['idpersona']);



    }
    function obtenerObligatorioAction()
    {
        $indicador = $this->_request->getPost('indicadores');

        $query = Doctrine_Manager::getInstance();
        $sql = " SELECT iev.obligatorio
            FROM mod_evaluaciones.dat_evalindicadoresevaluacion ie
            INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluar iev ON(ie.idindicadorplanilla = iev.idindicadorplanilla)
            WHERE ie.idindicadorevaluacion = {$indicador}";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        $m->codMsg = $result[0]['obligatorio'];
        echo json_encode($m);
    }

}
