<?php

/**
 * Controlador para gestionar objetivos
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarobjetivosController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionarobjetivoss.phtml
     */
    function cmpgestionarobjetivosAction()
    {
        try {
            $usargd = true; //$this->pIntegrator->planpdo->verificarGestorDoc();
        } catch (Exception $e) {
            $usargd = false;
        }
        if ($usargd) {
            //$this->view->gestdoc = $this->integrator->gestordocumental->devolverJSContenido();
            $this->view->usarGD = '<script> var usarGD = true; </script>';
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }
        $this->render();
    }

    private function testGD()
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $gestordocumental
            = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/gestordocumental/comun/recursos/xml/ioc.xml';
        $configuracion = new ConfiguracionGD(
            (string)Zend_Registry::getInstance(
            )->config->xml->RepositorioAlfresco
        );
        $data = parse_url(
            $configuracion->obtenerDireccionRepositorio() . 'api'
        ); /* $this->direccionRepositorio */
        $fp = fsockopen(
            $data['host'], isset($data['port']) ? $data['port'] : 80, $errno,
            $errstr, 30
        );
        //if ($fp) {
        /* && $this->integrator->gestordocumental->estaAutenticadoUsuarioActual() == 1 */
        //$autenticacion = $this->integrator->gestordocumental->obtenerAutenticacion();
        //}
        if (file_exists($gestordocumental) && $fp) {
            return true;
        }
        return false;
    }

  /**
   * Accion para actualizar parametors de los objetivos
   */
  function actualizarParametrosAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $respuesta=0;
    try {
      $parametros->idusuariocrea = $this->global->Perfil->idusuario;
      $parametros->idpersona = $this->global->Perfil->idpersona;
      $parametros->fechainicio = $this->_request->getPost('f_inicio_actParams');
      $parametros->fechafin = $this->_request->getPost('f_fin_actParams');
      $parametros->idcategoria = $this->_request->getPost('idcategoria');
      $parametros->denomcategoria = $this->_request->getPost('denomcategoria');
      $arrayidobjetivos = json_decode(
        stripslashes($this->_request->getPost('arrayidobjetivos'))
      );

      foreach ($arrayidobjetivos as $idelemento) {
        $objobjetivo = Doctrine::getTable('DatObjetivo')->find($idelemento);
        $datelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if($parametros->fechainicio!=''){
          $objobjetivo->fechainicio = $parametros->fechainicio;
        }
        if($parametros->fechafin!=''){
          $objobjetivo->fechafin = $parametros->fechafin;
        }
        //obtengo relacion con nomencladores y modifico
        if ($parametros->idcategoria!='') {
          $objelemnom = new DatElementosNomNomencladorModel();
          /*$elemnom =*/
          $objelemnom->ModificarRelacionNomElem(
            $datelemento, $parametros->idcategoria, $tiponomenclador = 11
          );
        }

        $objobjetivo->save();
        $respuesta++;

      }
    }catch (Exception $exc) {
      $respuesta++;
    }

    echo json_encode(array('mensaje' => $respuesta));
  }


  /**
     * Accion para cargar los objetivos en el grid
     */
    function cargarobjetivosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idobjetivo = $this->_request->getPost('anode');
        $filtros = $this->_request->getPost('filtros');
        //$parametros->anode = $this->_request->getPost('anode');
        $parametros->sort = $this->_request->getPost('sort');
        $parametros->dir = $this->_request->getPost('dir');
        $parametros->reorganizar = json_decode(
            stripslashes($this->_request->getPost('objetivosreorganizar'))
        );
        $eshija = $this->_request->getPost('eshija');
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $idelementotributa = $this->_request->getPost('idelementotributa');
        $enaprobacion = $this->_request->getPost('enaprobacion');
        $estadoaprob = $this->_request->getPost('estadoaprob');
        $denominacion = $this->_request->getPost('denominacion');
        $idtipoelementotributa = $this->_request->getPost(
            'idtipoelementotributa'
        );
        $idtipoelementotributasuperior = $this->_request->getPost(
            'idtipoelementotributasuperior'
        );
        $fechainicio = json_decode(
            stripslashes($this->_request->getPost('fechainicio'))
        );
        $busqueda = $this->_request->getPost('busqueda');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $arrayautores = json_decode(
            stripslashes($this->_request->getPost('arrayautores'))
        );
        $arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        $objobjetivomodel = new CmpgestionarobjetivosModel();
        $arrayobjetivos = $objobjetivomodel->CargarObjetivos(
            $idobjetivo, $idusuario, $iddominio, $certificado,
            $idelementotributa, $enaprobacion, $arrayautores,
            $arrayinvolucrados, $start, $limit, $idtipoelementotributa,
            $idtipoelementotributasuperior, $busqueda,
            $arrayelementosrelacionados, $filtros, $parametros
        );
        if (isset($arrayobjetivos['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $arrayobjetivos['total'],
                      'campos'  => $arrayobjetivos['resultado'])
            );
        }
        if (!isset($arrayobjetivos)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    /**
     * Accion para cargar los indicadores del criterio de medida
     */
    function cargarindicadoresAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

//        $filtros = $this->_request->getPost('filtros');

//        $parametros->sort = $this->_request->getPost('sort');
//        $parametros->dir = $this->_request->getPost('dir');

        $params->idautor = $this->global->Perfil->idusuario;
        $params->idobjetivo   = $this->_request->getPost(
          'idobjetivo'
        );

//        $start = $this->_request->getPost('start');
//        $limit = $this->_request->getPost('limit');

        $indicador=new DatIndicadorobjcritModel();

        $indicadores=$indicador->cargarindicadores($params);
            echo json_encode(
                array('success' => true, 'total' => count($indicadores), 'campos' => $indicadores)
            );

    }

    /**
     * Accion para adicionar los indicadores
     */
    function adicionarindicadorAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $params->idautor = $this->global->Perfil->idusuario;
      $params->denominacion   = $this->_request->getPost(
        'denominacion'
      );
      $params->descripcion   = $this->_request->getPost(
        'descripcion'
      );
      $params->idobjetivo   = $this->_request->getPost(
        'idobjetivo'
      );

      $DatIndicadorobjcritModel=new DatIndicadorobjcritModel();

      $resultado=$DatIndicadorobjcritModel->adicionarindicador($params);

      echo json_encode(array('mensaje' => $resultado));

    }
    /**
     * Accion para adicionar los indicadores
     */
    function modificarindicadorAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $params->idautor = $this->global->Perfil->idusuario;
      $params->denominacion   = $this->_request->getPost(
        'denominacion'
      );
      $params->descripcion   = $this->_request->getPost(
        'descripcion'
      );
      $params->idobjetivo   = $this->_request->getPost(
        'idobjetivo'
      );
      $params->idindicadorobjcrit   = $this->_request->getPost(
        'idindicadorobjcrit'
      );

      $DatIndicadorobjcritModel=new DatIndicadorobjcritModel();

      $resultado=$DatIndicadorobjcritModel->modificarindicador($params);

      echo json_encode(array('mensaje' => $resultado));

    }

    /**
     * Accion para eliminar los indicadores
     */
    function eliminarIndicadorAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $params->idautor = $this->global->Perfil->idusuario;
      $params->arrayindicadores  =  json_decode(
        stripslashes($this->_request->getPost('arrayindicadores'))
      );

      $DatIndicadorobjcritModel=new DatIndicadorobjcritModel();

      $resultado=$DatIndicadorobjcritModel->eliminarIndicador($params);

      echo json_encode(array('mensaje' => $resultado));

    }

  /**
   * Accion para cargar los criterios de evaluacion del indicador
   */
  function cargarcriterioevalcriteriomedidaAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora

    $params->idautor = $this->global->Perfil->idusuario;
    $params->idobjetivo   = $this->_request->getPost(
      'idobjetivo'
    );
    $params->idindicadorobjcrit   = $this->_request->getPost(
      'idindicadorobjcrit'
    );

//        $start = $this->_request->getPost('start');
//        $limit = $this->_request->getPost('limit');

    $indicador=new DatCriterioevaluacionindModel();

    $indicadores=$indicador->cargarcriterioevalcriteriomedida($params);
    echo json_encode(
      array('success' => true, 'total' => count($indicadores), 'campos' => $indicadores)
    );

  }

  /**
   * Accion para cargar los criterios de evaluacion del objetivo
   */
  function cargarCriterioEvaluacionObjetivoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora

    $params->idautor = $this->global->Perfil->idusuario;
    $params->idobjetivo   = $this->_request->getPost(
      'idobjetivo'
    );

//        $start = $this->_request->getPost('start');
//        $limit = $this->_request->getPost('limit');

    $DatCriterioevaluacionobjModel=new DatCriterioevaluacionobjModel();

    $indicadores=$DatCriterioevaluacionobjModel->cargarCriterioEvaluacionObjetivo($params);
    echo json_encode(
      array('success' => true, 'total' => count($indicadores), 'campos' => $indicadores)
    );

  }


  /**
   * Accion para adicionar criterio de evaluación del criterio de medida
   */
  function eliminarRelacionCriterioMedidaIndicadorAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $params->idautor = $this->global->Perfil->idusuario;

    $params->idindicadorobjcrit   = $this->_request->getPost(
      'idindicadorobjcrit'
    );

    $params->arraycriteriosmedidaindicador  =  json_decode(
      stripslashes($this->_request->getPost('arraycriteriosmedidaindicador'))
    );


    $DatIndicadorcriteriomedidaModel=new DatIndicadorcriteriomedidaModel();

    $resultado=$DatIndicadorcriteriomedidaModel->eliminarRelacionCriterioMedidaIndicador($params);


    echo json_encode(array('mensaje' => $resultado));

  }


    /**
     * Accion para adicionar criterio de evaluación del criterio de medida
     */
    function adicionarEvaluacionCriterioMedidaAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $params->idautor = $this->global->Perfil->idusuario;

      $params->idobjetivo   = $this->_request->getPost(
        'idobjetivo'
      );
      $params->idnomencladorcriterioeval   = $this->_request->getPost(
        'idnomencladorcriterioeval'
      );
      $params->idindicadorobjcrit   = $this->_request->getPost(
        'idindicadorobjcrit'
      );

      $params->arrayformulas  =  json_decode(
        stripslashes($this->_request->getPost('arrayformulas'))
      );

//     print_r($params->arrayformulas);die;

      $DatIndicadorcriteriomedidaModel=new DatCriterioevaluacionindModel();

      $resultado=$DatIndicadorcriteriomedidaModel->adicionarEvaluacionCriterioMedida($params);


      echo json_encode(array('mensaje' => $resultado));

    }

  /**
   * Accion para adicionar criterio de evaluación del objetivo
   */
  function adicionarEvaluacionObjetivoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $params->idautor = $this->global->Perfil->idusuario;

    $params->idobjetivo   = $this->_request->getPost(
      'idobjetivo'
    );
    $params->idnomencladorcriterioeval   = $this->_request->getPost(
      'idnomencladorcriterioeval'
    );

    $params->arrayformulas  =  json_decode(
      stripslashes($this->_request->getPost('arrayformulas'))
    );

//     print_r($params->arrayformulas);die;

    $DatCriterioevaluacionobjModel=new DatCriterioevaluacionobjModel();

    $resultado=$DatCriterioevaluacionobjModel->adicionarEvaluacionObjetivo($params);


    echo json_encode(array('mensaje' => $resultado));

  }

  /**
   * Accion para modificar criterio de evaluación del objetivo
   */
  function modificarEvaluacionObjetivoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $params->idautor = $this->global->Perfil->idusuario;

    $params->idobjetivo   = $this->_request->getPost(
      'idobjetivo'
    );
    $params->idcriterioevaluacionobj   = $this->_request->getPost(
      'idcriterioevaluacionobj'
    );
    $params->idnomencladorcriterioeval   = $this->_request->getPost(
      'idnomencladorcriterioeval'
    );

    $params->formulaseliminar   = json_decode(
      stripslashes($this->_request->getPost('formulaseliminar'))
    );

    $params->arrayformulas  =  json_decode(
      stripslashes($this->_request->getPost('arrayformulas'))
    );

//     print_r($params->arrayformulas);die;

    $DatCriterioevaluacionobjModel=new DatCriterioevaluacionobjModel();

    $resultado=$DatCriterioevaluacionobjModel->modificarEvaluacionObjetivo($params);


    echo json_encode(array('mensaje' => $resultado));

  }

  /**
   * Accion para adicionar criterio de evaluación del criterio de medida
   */
  function modificarEvaluacionCriterioMedidaAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $params->idautor = $this->global->Perfil->idusuario;

    $params->idobjetivo   = $this->_request->getPost(
      'idobjetivo'
    );
    $params->idindicadorobjcrit   = $this->_request->getPost(
      'idindicadorobjcrit'
    );

    $params->idcriterioevaluacionind   = $this->_request->getPost(
      'idcriterioevaluacionind'
    );

    $params->idnomencladorcriterioeval   = $this->_request->getPost(
      'idnomencladorcriterioeval'
    );

    $params->formulaseliminar   = json_decode(
      stripslashes($this->_request->getPost('formulaseliminar'))
    );

    $params->arrayformulas  =  json_decode(
      stripslashes($this->_request->getPost('arrayformulas'))
    );

    $DatIndicadorcriteriomedidaModel=new DatCriterioevaluacionindModel();

    $resultado=$DatIndicadorcriteriomedidaModel->modificarEvaluacionCriterioMedida($params);


    echo json_encode(array('mensaje' => $resultado));

  }

  /**
   * Accion para eliminar los indicadores
   */
  function eliminarCriterioEvaluacionIndicadorAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $params->idautor = $this->global->Perfil->idusuario;
    $params->arraycriterios  =  json_decode(
      stripslashes($this->_request->getPost('arraycriterios'))
    );

    $DatIndicadorcriteriomedidaModel=new DatCriterioevaluacionindModel();

    $resultado=$DatIndicadorcriteriomedidaModel->eliminarCriterioEvaluacionIndicador($params);

    echo json_encode(array('mensaje' => $resultado));

  }

  /**
   * Accion para eliminar los criterios evaluacion del objetivo
   */
  function eliminarCriterioEvaluacionObjetivoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $params->idautor = $this->global->Perfil->idusuario;
    $params->arraycriterios  =  json_decode(
      stripslashes($this->_request->getPost('arraycriterios'))
    );

    $DatCriterioevaluacionobjModel=new DatCriterioevaluacionobjModel();

    $resultado=$DatCriterioevaluacionobjModel->eliminarCriterioEvaluacionObjetivo($params);

    echo json_encode(array('mensaje' => $resultado));

  }

  /**
   * Accion para ontener informacion del criterio de evaluacion del indicador
   */
  function obtenerinformacionCriterioEvaluacionIndicadorAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $params->idautor = $this->global->Perfil->idusuario;
    $params->idcriterioevaluacionind  =  $this->_request->getPost('idcriterioevaluacionind');

    $DatIndicadorobjcritModel=new DatCriterioevaluacionindModel();

    $resultado=$DatIndicadorobjcritModel->obtenerinformacionCriterioEvaluacionIndicador($params);

    echo json_encode(array('informacion' => $resultado));

  }

  /**
   * Accion para ontener informacion del criterio de evaluacion del objetivo
   */
  function obtenerinformacionCriterioEvaluacionObjetivoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $params->idautor = $this->global->Perfil->idusuario;
    $params->idcriterioevaluacionobj  =  $this->_request->getPost('idcriterioevaluacionobj');

    $DatCriterioevaluacionobjModel=new DatCriterioevaluacionobjModel();

    $resultado=$DatCriterioevaluacionobjModel->obtenerinformacionCriterioEvaluacionObjetivo($params);

    echo json_encode(array('informacion' => $resultado));

  }


  /**
   * Accion para cargar el combo con las categorias de la actividad
   */
  function cargarcriterioevaluacionAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $idusuario = $this->global->Perfil->idusuario;
    $tiponomenclador = 12;
    $nomencladores
      = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
      $tiponomenclador, $idusuario
    );
    if ($nomencladores != null) {
      foreach ($nomencladores as $val) {
        $dat->data [] = array('id' => $val['idnomenclador'],
                              'den' => $val['denom']);
      }
    } else {
      $dat->data = array();
    }
    echo json_encode($dat);
  }



    /**
     * Accion para relacionar los criterios de medida a el indicador
     */
    function relacionarCriteriosIndicadoresAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $params->idautor = $this->global->Perfil->idusuario;
      $params->arraycriteriosseleccionados  =  json_decode(
        stripslashes($this->_request->getPost('arraycriteriosseleccionados'))
      );

      $params->idindicadorobjcrit  =  $this->_request->getPost('idindicadorobjcrit');

      $DatIndicadorcriteriomedidaModel=new DatIndicadorcriteriomedidaModel();

      $resultado=$DatIndicadorcriteriomedidaModel->relacionarCriteriosIndicadores($params);

      echo json_encode(array('mensaje' => $resultado));

    }

    /**
     * Accion para ontener informacion del indicador
     */
    function obtenerinformacionIndicadorAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $params->idautor = $this->global->Perfil->idusuario;
      $params->idindicadorobjcrit  =  $this->_request->getPost('idindicadorobjcrit');

      $DatIndicadorobjcritModel=new DatIndicadorobjcritModel();

      $resultado=$DatIndicadorobjcritModel->obtenerinformacionIndicador($params);

      echo json_encode(array('informacion' => $resultado));

    }

      /**
     * Accion para adicionar los objetivos
     */
    function adicionarobjetivoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost(
            'tfdenominacionobj'
        );
        $parametros->denelemento = str_ireplace('"', "'", $parametros->denelemento);
        $parametros->descelemento = $this->_request->getPost(
            'hedescripcionobj'
        );
        if ($this->_request->getPost('porcientocumpobj') == "") {
            $parametros->gradocumplimiento = 0;
        } else {
            $parametros->gradocumplimiento
                = $this->_request->getPost('porcientocumpobj') * 1;
        }
        $parametros->fechainicio = $this->_request->getPost('finiobj');
        $parametros->fechafin = $this->_request->getPost('ffinobj');
        $parametros->tiempoestimado = $this->_request->getPost(
            'tiempoestimadobj'
        );
        $parametros->idcategoriaobj = $this->_request->getPost(
            'idcategoriaobj'
        );
        $parametros->dirigentes = $this->_request->getPost('hedirigentesobj');
        $parametros->participantes = $this->_request->getPost(
            'heparticipantesobj'
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        $parametros->idtipoelemento = 1;
        $parametros->eshija = $this->_request->getPost('eshija');
        $parametros->idobjetivopadre = $this->_request->getPost(
            'idobjetivopadre'
        );
        $parametros->principal = $this->_request->getPost('principal');
        $parametros->documentos = json_decode(
            stripslashes($this->_request->getPost('documentos'))
        );
        $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
        $respuesta = $objcmpgestionarobjetivosmodel->AdicionarObjetivo(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para modificar los objetivos
     */
    function modificarobjetivoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idobjetivo = $this->_request->getPost('idobjetivo');
        $parametros->denelemento = $this->_request->getPost(
            'tfdenominacionobj'
        );
        $parametros->denelemento = str_ireplace('"', "'", $parametros->denelemento);
        $parametros->arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        $parametros->idobjetivopadre = $this->_request->getPost(
            'idobjetivopadre'
        );
        $parametros->descelemento = $this->_request->getPost(
            'hedescripcionobj'
        );
        if ($this->_request->getPost('porcientocumpobj') == "") {
            $parametros->gradocumplimiento = 0;
        } else {
            $parametros->gradocumplimiento
                = $this->_request->getPost('porcientocumpobj') * 1;
        }
        $parametros->fechainicio = $this->_request->getPost('finiobj');
        $parametros->fechafin = $this->_request->getPost('ffinobj');
        $parametros->hora = $this->_request->getPost('tmfhoraobj');
        $parametros->horafin = $this->_request->getPost('tmfhorafinobj');
        $parametros->tiempoestimado = $this->_request->getPost(
            'tiempoestimadobj'
        );
        $parametros->idcategoriaobj = $this->_request->getPost(
            'idcategoriaobj'
        );
        $parametros->idtipo = $this->_request->getPost('idtipo');
        $parametros->idcategoria = $this->_request->getPost('idcategoria');
        $parametros->lugar = $this->_request->getPost('tflugarobj');
        $parametros->dirigentes = $this->_request->getPost('hedirigentesobj');
        $parametros->participantes = $this->_request->getPost(
            'heparticipantesobj'
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayinvolucradoseliminar = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucradoseliminar'))
        );
        $parametros->documentos = json_decode(
            stripslashes($this->_request->getPost('documentos'))
        );
        $parametros->idtipoelemento = 3;
        $parametros->principal = $this->_request->getPost('principal');
        //***historial***
        $arrayinvolucrados = array();
        foreach ($parametros->arrayinvolucrados as $involucrado) {
            $arrayinvolucrados[] = $involucrado->idusuario;
        }
        $involucradoshisto = implode(',', $arrayinvolucrados);
        //***
        $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
        $objcambiohorario = $objcmpgestionarobjetivosmodel->CambioHorario(
            $parametros
        );
        $respuesta = $objcmpgestionarobjetivosmodel->ModificarObjetivo(
            $parametros
        );
        /*if ($respuesta) {
            $accion = 2;
            $idelemento = $parametros->idobjetivo;
            $idtipoelemento = 1;
            $idautor = $parametros->idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                $objcambiohorario, $parametros, $involucradoshisto
            );
        }*/
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para eliminar los objetivos
     */
    function eliminarobjetivosAction()
    {

        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayidobjetivos = json_decode(
            stripslashes($this->_request->getPost('arrayidobjetivos'))
        );
        $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
        //para generar notificaciones (ARA)
        $arrayNotif = array();
        $objNotificacion = new CmpnotificacionesModel();
        $accion = 3;
        $idtipoelemento = 1;
        $idautor = $idusuariosession;
        $fecha = date('d/m/Y H:i:s');
        foreach ($arrayidobjetivos as $key => $idelemento) {
            //***historial***
            $objhistoantes = Doctrine::getTable('DatElementos')->find(
                $idelemento
            );
            $objhisto->denelemento = $objhistoantes->denelemento;
            $objhisto->descelemento = $objhistoantes->descelemento;
            $objhisto->dirigente = $objhistoantes->dirigente;
            $objhisto->gradocumplimiento = $objhistoantes->gradocumplimiento;
            $objhisto->participante = $objhistoantes->participante;
            $relaciones = DatElementosDatElementos::obtenerRelacionObj(
                $idelemento
            );

            $objhisto->relaciones = $relaciones;
            $objobjetivo = Doctrine::getTable('DatObjetivo')->find($idelemento);
            $parametros->idobjetivo = $idelemento;
            $parametros->fechainicio = $objobjetivo->fechainicio;
            $parametros->fechafin = $objobjetivo->fechafin;
            $objcambiohorario = $objcmpgestionarobjetivosmodel->CambioHorario(
                $parametros
            );
            $involucradoshisto = Doctrine::getTable(
                'DatElementosDatInvolucrados'
            )->findByDql("idelemento = '$idelemento'");
            $arrayinvolucrados = array();
            foreach ($involucradoshisto as $key => $involucrado) {
                $involucradosuser = Doctrine::getTable('DatInvolucrados')->find(
                    $involucrado->idinvolucrado
                );
                $arrayinvolucrados[] = $involucradosuser->idusuario;
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);
            //***
            $arrayNotif = $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                $objcambiohorario, $objhisto, $involucradoshisto
            );
        }

        $respuesta = $objcmpgestionarobjetivosmodel->EliminarObjetivos(
            $arrayidobjetivos, $idusuariosession
        );
        //print_r($relaciones);die;
        if ($respuesta != 1) {
            if (isset($arrayNotif)) {
                $objNotificacion->eliminarArrayNotificaciones($arrayNotif);
            }
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para eliminar los criterios
     */
    function eliminarcriteriosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayidcriterios = json_decode(
            stripslashes($this->_request->getPost('arrayidcriterios'))
        );
        $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
        //para generar notificaciones(ARA)
        $objNotificacion = new CmpnotificacionesModel();
        $arrayNotif = array();
        $accion = 3;
        $idtipoelemento = 4;
        $idautor = $idusuariosession;
        $fecha = date('d/m/Y H:i:s');
        foreach ($arrayidcriterios as $idelemento) {
            $arrayNotif[] = $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, ''
            );
        }
        $respuesta = $objcmpgestionarobjetivosmodel->EliminarCriterios(
            $arrayidcriterios
        );
        if ($respuesta != 1) {
            if (isset($arrayNotif)) {
                $objNotificacion->eliminarArrayNotificaciones($arrayNotif);
            }
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para adicionar los criterios
     */
    function adicionarcriterioAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->dencriterio = $this->_request->getPost(
            'tfdenominacioncrit'
        );
        $parametros->descriterio = $this->_request->getPost(
            'hedescripcioncrit'
        );
        /* if($this->_request->getPost ( 'porcientocumpcrit' )=="") $parametros->gradocumplimiento = 0;
          else $parametros->gradocumplimiento 		= $this->_request->getPost ( 'porcientocumpcrit' )*1; */
        $parametros->fechainicio = $this->_request->getPost('finicrit');
        $parametros->fechafin = $this->_request->getPost('ffincrit');
        $parametros->participantes = $this->_request->getPost(
            'heparticipantescrit'
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->idcriterio = $this->_request->getPost('idcriterio');
        $parametros->evaluacion = $this->_request->getPost('reval');
        $parametros->idobjetivo = $this->_request->getPost('idobjetivo');
        $parametros->valormeta = $this->_request->getPost('tfvalormeta');
        $parametros->valorreal = $this->_request->getPost('tfvalorreal');
        $parametros->idumedida = $this->_request->getPost('idum');
        $deno = "'" . $parametros->dencriterio . "'";
        $criterio = Doctrine::getTable('DatCriteriomedida')->findByDql(
            " dencriterio = $deno"
        );
        $denominacion = $criterio[0]->dencriterio;
        //$id = $criterio[0]->idcriteriomedida;
        if ($denominacion == $parametros->dencriterio) {
            echo json_encode(array('mensaje' => 2));
        } else {
            $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
            $respuesta = $objcmpgestionarobjetivosmodel->AdicionarCriterio(
                $parametros
            );
            echo json_encode(array('mensaje' => $respuesta));
        }
    }

    /**
     * Accion para modificar los criterios
     */
    function modificarcriterioAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->dencriterio = $this->_request->getPost(
            'tfdenominacioncrit'
        );
        $parametros->descriterio = $this->_request->getPost(
            'hedescripcioncrit'
        );
        /* if($this->_request->getPost ( 'porcientocumpcrit' )=="") $parametros->gradocumplimiento = 0;
          else $parametros->gradocumplimiento 		= $this->_request->getPost ( 'porcientocumpcrit' )*1; */
        $parametros->fechainicio = $this->_request->getPost('finicrit');
        $parametros->fechafin = $this->_request->getPost('ffincrit');
        $parametros->participantes = $this->_request->getPost(
            'heparticipantescrit'
        );
        $parametros->idcriterio = $this->_request->getPost('idcriterio');
        $parametros->idobjetivo = $this->_request->getPost('idobjetivo');
        $parametros->valormeta = $this->_request->getPost('tfvalormeta');
        $parametros->valorreal = $this->_request->getPost('tfvalorreal');
        $parametros->idumedida = $this->_request->getPost('idum');
        $parametros->evaluacion = $this->_request->getPost('reval');
        $parametros->idcriterio = $this->_request->getPost('idcriterio');
        $deno = "'" . $parametros->dencriterio . "'";
        $criterio = Doctrine::getTable('DatCriteriomedida')->findByDql(
            " dencriterio = $deno"
        );
        $denominacion = $criterio[0]->dencriterio;
        $id = $criterio[0]->idcriteriomedida;
        if ($denominacion == $parametros->dencriterio
            && $parametros->idcriterio != $id
        ) {
            echo json_encode(array('mensaje' => 2));
        } else {
            $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
            $objcambiohorario = $objcmpgestionarobjetivosmodel->CambioHorario(
                $parametros
            );
            $respuesta = $objcmpgestionarobjetivosmodel->ModificarCriterio(
                $parametros
            );
            //para generar notificaciones (Ariadna RA)
            if ($respuesta) {
                $accion = 2;
                $idelemento = $parametros->idcriterio;
                $idtipoelemento = 4;
                $idautor = $parametros->idusuariocrea;
                $fecha = date('d/m/Y H:i:s');
                $objNotificacion = new CmpnotificacionesModel();
                $objNotificacion->generarNotificacion(
                    $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                    $objcambiohorario, $parametros, ''
                );
            }
            echo json_encode(array('mensaje' => $respuesta));
        }
    }

    /**
     * Accion para salvar  los campos del criterios modificados
     */
    function salvarCambiosCriterioAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $criterios = json_decode(
            stripslashes($this->_request->getPost('criterios'))
        );
        $idobjetivo = $this->_request->getPost('idobjetivo');
        foreach ($criterios as $criterio) {
            $criterio->idobjetivo = $idobjetivo;
            $criterio->accion = 'btnsalvar';
            $objcmpgestionarobjetivosmodel = new CmpgestionarobjetivosModel();
            $objcambiohorario = $objcmpgestionarobjetivosmodel->CambioHorario(
                $criterio
            );
            $respuesta = $objcmpgestionarobjetivosmodel->ModificarCriterio(
                $criterio
            );
        }
        //para generar notificaciones (Ariadna RA)
        if ($respuesta) {
            $accion = 2;
            $idelemento = $parametros->idcriterio;
            $idtipoelemento = 4;
            $idautor = $parametros->idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                $objcambiohorario, $parametros, ''
            );
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para actualizar el porciento de los criterios de medida
     * @post array listadoId Arreglo de objetivos o de criterios de medida
     * @post text campo Nombre del campo por el que se filtra (idobjetivo o idcriteriomedida)
     * @post int porciento Porciento de cumplimiento del criterio de medida (0 - 100)
     * @author Drisis Silvia Diaz Rodriguez
     * @created 28/05/2018
     */
    public function actualizarPorcientoCMAction()
    {
        $listadoId = json_decode(
            stripslashes($this->_request->getPost('listadoId'))
        );
        $campo = $this->_request->getPost('campo');
        $porciento = $this->_request->getPost('porciento');
        $objetivosModel = new CmpgestionarobjetivosModel();
        $objetivosModel->actualizarPorcientoCM($listadoId, $campo, $porciento);

        echo json_encode(array('success'=>'true'));
    }


  public function actualizarCumplimientoAction()
  {
    $arrayparametros->cumplimiento = $this->_request->getPost(
      'cumplimiento'
    );
    $arrayparametros->arrayidelementos = json_decode(
      stripslashes($this->_request->getPost('arrayidobjetivos'))
    );

    $arrayparametros->metodo = $this->_request->getPost('metodo');
    $objelementomodel = new CmpgestionarelementoModel();
    $respuesta = $objelementomodel->actualizarCumplimiento(
      $arrayparametros
    );

    echo json_encode(array('respuesta' => $respuesta));
  }

	
	/**
     * Funcion para cargar el combo de categorias de los objetivos
     */
    function cargarcategoriaobjetivoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 11;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            $dat->data = array();
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idcategoriaobj' => $val['idnomenclador'],
                                      'dennomenclador' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Funcion para cargar el combo de estados de aprobacion de los objetivos
     */
    function cargarcmbestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = 3; //$this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idusuariosession, $idtipodoc
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    /**
     * Funcion para cargar un objetivo en el formulario
     */
    function cargarformobjetivoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idobjetivo = $this->_request->getPost('idobjetivo');
        $actualizagradocump = 1;
        $objelemento = Doctrine::getTable('DatElementos')->find($idobjetivo);
        $elementosrelacionados
            = DatElementosDatElementos::buscarElementosRelacionadosObj(
            $idobjetivo
        );
        if (isset($elementosrelacionados[0])) {
            $actualizagradocump = 0;
        }
        if (isset($objelemento->idelemento)) {
            $objcmpelementosmodel = new CmpgestionarelementoModel();
            $categoriaobj
                = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
                $idobjetivo, $tiponomenclador = 11, $tipoelemento = 1
            );
            $objobjetivo = Doctrine::getTable('DatObjetivo')->find($idobjetivo);
            $dat->data [] = array(
                'idobjetivo'          => $objobjetivo->idobjetivo,
                'idelemento'          => $objelemento->idelemento,
                /* 'autor'               => $this->integrator->seguridad->nombreUsuario(
                  $objelemento->idusuariocrea
                  ), */
                'autor'               => $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $objelemento->idusuariocrea, 'usuario', null
                ),
                'denominacion'        => $objelemento->denelemento,
                'descripcion'         => empty($objelemento->descelemento) ? ''
                    : $objelemento->descelemento,
                'dirigentes'          => empty($objelemento->dirigente) ? ''
                    : $objelemento->dirigente,
                'participantes'       => empty($objelemento->participante) ? ''
                    : $objelemento->participante,
                'fechainicio'         => $objobjetivo->fechainicio,
                'fechafin'            => $objobjetivo->fechafin,
                'tiempoestimado'      => $objobjetivo->tiempoestimado,
                'gradocumplimiento'   => $objelemento->gradocumplimiento,
                'estadocumplimiento'  => $objelemento->estadocumplimiento,
                'actualiza_gradocump' => $actualizagradocump,
                'categoriaobj'        => array('idcategoriaobj' => $categoriaobj->idnomenclador,
                                               'denominacion'   => $categoriaobj->dennomenclador),
                'mensaje'             => 1
            );
            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Funcion para cargar un criterio en el formulario
     */
    function cargarformcriterioAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idcriterio = $this->_request->getPost('idcriterio');
        $objcriterio = Doctrine::getTable('DatCriteriomedida')->find(
            $idcriterio
        );
        if (isset($objcriterio->idcriteriomedida)) {
            $objcmpelementosmodel = new CmpgestionarelementoModel();
            /* $criteriomedida
              = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
              $idcriterio, 1, 6
              ); */
            $criteriomedida = $objcriterio->ObtenerUnidadMedida(
                $objcriterio->idumedida
            );
            $dat->data [] = array(
                'idcriteriomedida'   => $objcriterio->idcriteriomedida,
                'denominacion'       => $objcriterio->dencriterio,
                'autor'              => $this->integrator->seguridad->nombreUsuario(
                    $objcriterio->idusuariocrea
                ),
                'denominacion'       => $objcriterio->dencriterio,
                'descripcion'        => empty($objcriterio->descriterio) ? ''
                    : $objcriterio->descriterio,
                'participantes'      => empty($objcriterio->participante) ? ''
                    : $objcriterio->participante,
                'fechainicio'        => $objcriterio->fechainicio,
                'evaluacion'         => $objcriterio->evaluacion,
                'fechafin'           => $objcriterio->fechafin,
                'gradocumplimiento'  => $objcriterio->gradocumplimiento,
                'estadocumplimiento' => $objcriterio->estadocumplimiento,
                'valormeta'          => $objcriterio->valormeta,
                'valoreal'           => $objcriterio->valoreal,
                'um'                 => array('idumedida'    => $criteriomedida[0]['idunidadmedida'],
                                              'denominacion' => $criteriomedida[0]['abreviaturaunidadmedida']),
                'mensaje'            => 1
            );
            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Accion para cargar los criterios en el grid
     */
    function cargarcriteriosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idobjetivo = $this->_request->getPost('idobjetivo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idusuario = $this->global->Perfil->idusuario;
        $objobjetivomodel = new CmpgestionarobjetivosModel();
        $arraycriterios = $objobjetivomodel->CargarCriterios(
            $idobjetivo, $idusuario, $limit, $start
        );
        if (isset($arraycriterios['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $arraycriterios['total'],
                      'campos'  => $arraycriterios['resultado'])
            );
        }
        if (!isset($arraycriterios)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    /**
     * Accion para cargar los criterios relacionados con los indicadores
     */
    function cargarcriteriosindicadoresAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idobjetivo = $this->_request->getPost('idobjetivo');
        $idindicadorobjcrit = $this->_request->getPost('idindicadorobjcrit');
        $relacionado_indicador = $this->_request->getPost('relacionado_indicador');
//        $limit = $this->_request->getPost('limit');
//        $start = $this->_request->getPost('start');
        $idusuario = $this->global->Perfil->idusuario;
        $objobjetivomodel = new CmpgestionarobjetivosModel();
        $arraycriterios = $objobjetivomodel->CargarCriteriosIndicadores(
            $idobjetivo,$idindicadorobjcrit, $relacionado_indicador, $idusuario, $limit, $start
        );
        if (isset($arraycriterios['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $arraycriterios['total'],
                      'campos'  => $arraycriterios['resultado'])
            );
        }
        if (!isset($arraycriterios)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    function cargarunidadesmedidasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 1;
        /* $nomencladores
          = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
          $tiponomenclador, $idusuario
          ); */
        /* if ($nomencladores != null) {
          foreach ($nomencladores as $val) {
          $dat->data [] = array('idumedida'    => $val['idnomenclador'],
          'denominacion' => $val['denom']);
          }
          } else {
          $dat->data = array();
          } */
        $node = $this->_request->getPost('node');
        $nd['node'] = $node;
        $dat = $this->integrator->datosmaestros->obtenerDatosArbolUM($nd);
        //print_r($dat);die;
        echo json_encode($dat);
    }

    /**
     * Funcion para mostrar el desgloce del objetivo
     */
    public function desglozarobjetivoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arraydatos->idelemento = $this->_request->getPost('idelemento');
        $arraydatos->idplan = $this->_request->getPost('idplan');
        $arraydatos->idtipoelemento = $this->_request->getPost(
            'idtipoelemento'
        );
        $arraydatos->trinomio = $this->_request->getPost('trinomio');
        $arraydatos->idarc = $this->_request->getPost('idarc');
        $arraydatos->idusuario = $this->global->Perfil->idusuario;
        $objcmpelmodel = new CmpgestionarelementoModel();
        $arrayelementos = $objcmpelmodel->DezglozarElementos($arraydatos);
        echo json_encode($arrayelementos);
    }

    /**
     * Accion para reorganizar los subobjetivos
     */
    function reorganizarobjetivosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuariosession = $this->global->Perfil->idusuario;
        $datos->arraysubobjetivos = json_decode(
            stripslashes($this->_request->getPost('arraysubobjetivos'))
        );
        $datos->arrayobjetivospadres = json_decode(
            stripslashes($this->_request->getPost('arrayobjetivospadres'))
        );
        $objactmodel = new CmpgestionarobjetivosModel();
        $respuesta = $objactmodel->ReorganizarSubObjetivos($datos);
        echo json_encode(array('mensaje' => $respuesta));
    }

    function hacerRaizObjetivosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrayidobjetivos = json_decode(
            stripslashes($this->_request->getPost('arrayidobjetivos'))
        );
        $objactmodel = new CmpgestionarobjetivosModel();
        $respuesta = $objactmodel->hacerRaizObjetivo($arrayidobjetivos);

        echo json_encode(array('mensaje' => $respuesta));
    }

    function importarActividadesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idpersona = $this->global->Perfil->idpersona;
        $padreglobal = $this->_request->getPost('idpadre') ? $this->_request->getPost('idpadre') : '';

        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;

        // obtener el tamano maximo aceptado por el servidor
        $uploadmax = (Integer)substr(ini_get('upload_max_filesize'), 0, strlen(ini_get('upload_max_filesize')) - 1);
        // obtener el tamano maximo que se puede enviar por POST
        $maxsize = (Integer)substr(ini_get('post_max_size'), 0, strlen(ini_get('post_max_size')) - 1);
        // comprobando cual de ambos valores son menosres para entonces utilizar ese como referencia
        if ($uploadmax < $maxsize) {
            $maxsize = $uploadmax;
        }

        try {
            if ($_FILES['file']) {

                $filename = $_FILES['file']['tmp_name'];
                $params['file'] = $filename;
                $fileextension = $_FILES['file']['type'];
                $filename = explode('.', $_FILES['file']['name']);
                if ($fileextension == 'application/vnd.ms-excel'
                    || $fileextension == 'application/xls'
                    || $fileextension == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    || $filename[count($filename) - 1] == 'xls'
                    || $filename[count($filename) - 1] == 'xlsx'
                ) {

                    $ruta = '../models/bussines/ReaderModel.php';
                    include_once(dirname(__FILE__) . $ruta);
                    $data = new ReaderModel();
                    $data->setOutputEncoding('CP1251');
                    $data->read($params['file']);
                    $clientesAux = $data->sheets[0]['cells'];

                    $obj = new CmpgestionarobjetivosModel();

                    $salto = 0;
                    $arrayId = array();
                    $arrayPadres = array();

                    //obtengo el involucrado del nodo Mi Usuario
                    $usuario
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        'nodo1', $parametros->idusuariocrea, undefined, 2, 'nodo1',
                        0, 2, 1, $certificado,
                        $parametros->idusuariocrea);

                    //obtengo los usuarios subordinados
                    $usersdomain
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        'nodo3', $parametros->idusuariocrea, undefined, 2, 'nodo3',
                        0, 3, 1, $certificado, $parametros->idusuariocrea);

                    //obtengop los usuarios de los permisos otrorgados por el nivel superior
                    $otros
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        'nodo4', $parametros->idusuariocrea, undefined, 2, 'nodo4',
                        0, 3, 1, $certificado, $parametros->idusuariocrea);

                    //uno los resultados en un mismo array
                    $arrayMisInvol = array_merge((isset($usuario) ? $usuario : array()), (isset($usersdomain) ? $usersdomain : array()), (isset($otros) ? $otros : array()));


                    foreach ($clientesAux as $key => $value) {

                        //hago el salto porque en 0 vienen los encabezados
                        if ($salto != 0) {

                            //si es decimal va a ser hija
                            if (fmod($value[0], 1) !== 0.00) {
                                $k = explode('.', $value[0]);

                                //busco si el id de su padre que esta en el arreglo
                                if (isset($arrayPadres[$k[0]])) {
                                    $parametros->eshija = 1;
                                    $parametros->idobjetivopadre = $arrayPadres[$k[0]];
                                } else {
                                    //si no encuentra el padre en el array y tiene un padre global, lo pongo como hijo de ese global
                                    if ($padreglobal != '') {
                                        $parametros->eshija = 1;
                                        $parametros->idobjetivopadre = $padreglobal;
                                    } else {
                                        //sino no tiene padre
                                        $parametros->eshija = 0;
                                        $parametros->idobjetivopadre = '';
                                    }
                                }

                            } else {
                                //si tiene padre global lo pongo como hijo de ese global
                                if ($padreglobal != '') {
                                    $parametros->eshija = 1;
                                    $parametros->idobjetivopadre = $padreglobal;
                                } else {
                                    //sino no tiene padre
                                    $parametros->idobjetivopadre = '';
                                    $parametros->eshija = 0;
                                }
                            }

                            $parametros->recursoasociado = Array();
                            $parametros->accion = '';
                            $parametros->documentos = Array();
                            $parametros->denelemento = $value[1];
                            $parametros->descelemento = '';
                            $parametros->gradocumplimiento = $value[6] ? $value[6] : '0';
                            $parametros->fechainicio = $value[2];
                            $parametros->fechafin = $value[4];
                            $parametros->horainicio = $value[3] ? $value[3] : '08:00';
                            $parametros->horafin = $value[5] ? $value[5] : '17:00';
                            $parametros->idtipo = null;
                            $parametros->idcategoriaobj = null;
                            $parametros->lugar = '';
                            $parametros->dirigentes = '';
                            $parametros->participantes = '';
                            $parametros->arrayrepeticiones = Array();
                            $parametros->idtipoelemento = 1;
                            $parametros->principal = 0;
                            $parametros->duplicando = 0;
                            $parametros->autoManual = 0;
                            $parametros->porcientoRe = 0;
                            $parametros->peso = 1;
                            $parametros->tiempoestimado = 0;
                            $parametros->criterioeval = 'NE';
                            $parametros->denomtipo = '';
                            $parametros->denomcategoria = '';
                            $parametros->duracion = 0;
                            $parametros->idsubsistema = 1;

                            //creo el array de involucrados de la actividad
                            $referencia = Array();
                            if (isset($value[7])) {
                                $invol = explode(';', $value[7]);
                                $i = 0;
                                foreach ($invol as $key => $user) {

                                    $parametros->usuario = $user;

                                    $idusuario = $obj->getIdUsuario($parametros);

                                    for ($w = 0; $w < count($arrayMisInvol); $w++) {
                                        if ($usersdomain[$w]['idusuario'] == $idusuario) {

                                            if ($idusuario != '' || $idusuario != 0) {

                                                $referencia[$i]->idinvolucrado = $idusuario;
                                                $referencia[$i]->llaveinvolucrado = $idusuario;
                                                $referencia[$i]->denominacion = $user;
                                                $referencia[$i]->idusuario = $idusuario;
                                                $referencia[$i]->idgrupo = '';
                                                $referencia[$i]->tipo = 1;
                                                $referencia[$i]->nombretipo = 'Usuario';
                                                $referencia[$i]->tipoinvol = 1;
                                                $referencia[$i]->idtipoinvolucrado = null;
                                                $i++;

                                                $parametros->arrayinvolucrados = $referencia;
                                            }
                                        }
                                    }
                                }

                            } else {
                                $parametros->arrayinvolucrados = Array();
                            }
//                            $parametros->arrayinvolucrados = Array();

                            //creo el array de dependencias de la actividad
                            /*$relaciones = Array();
                            if (isset($value[8])) {
                                $dep = explode(';', $value[8]);
                                $a = 0;
                                foreach ($arrayId as $key => $id) {
                                    foreach ($dep as $rel) {
                                        if ($key == $rel) {
                                            $relaciones[$a]->idplan = null;
                                            $relaciones[$a]->idarc = null;
                                            $relaciones[$a]->idobjetivo = null;
                                            $relaciones[$a]->idfip = null;
                                            $relaciones[$a]->iddesviacion = null;
                                            $relaciones[$a]->idactividad = $id;
                                            $relaciones[$a]->tipoelemento = 3;
                                            $relaciones[$a]->origen = 6;
                                            $relaciones[$a]->porcientoinicio = null;
                                            $a++;

                                            $parametros->arrayelementosrelacionados = $relaciones;
                                        }
                                    }
                                }
                            } else {
                                $parametros->arrayelementosrelacionados = Array();
                            }*/
                            $parametros->arrayelementosrelacionados = Array();

                            $parametros->documentos = Array();

                            $result = $obj->AdicionarObjetivoImportar($parametros);
                            $arrayId[$value[0]] = $result;

                            //si son numeros enteros es que son objetivos, guardo sus id en el array de padres
                            if (fmod($value[0], 1) === 0.00) {
                                $arrayPadres[$value[0]] = $result;
                            }

                        }
                        $salto++;
                    }

                    if (isset($result)) {
                        echo json_encode(array('mensaje' => 1));
                    }

                } else {
                    echo json_encode(array('cod' => 4, 'mensaje' => 'El fichero importado no tiene el formato establecido.'));
                    return;
                }
            } else {
                echo json_encode(array('success' => false, 'max_file_size' => true, 'max_upload_size' => $maxsize, 'mensaje' => ('El tama&ntilde;o del archivo excede el l&iacute;mite de ' . $maxsize . ' permitido por el servidor.')));
                return;
            }

        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 3, 'msgText' => $e->getMessage())); // mensaje de error
        }

    }

}
