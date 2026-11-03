<?php

/**
 * Controlador para gestionar plan 2023
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarplanController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionarplan.phtml
     */
    function cmpgestionarplanAction()
    {
        try {
            $usargd = false; //$this->pIntegrator->planpdo->verificarGestorDoc();
        } catch (Exception $e) {
            $usargd = false;
        }
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        if ($usargd) {
            //$this->view->gestdoc = $this->integrator->gestordocumental->devolverJSContenido();
            $this->view->usarGD = '<script> var usarGD = true; </script>';
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }
        try {
            $this->view->extensionesPLAN
                = $this->pIntegrator->integracion->extensionesPLAN();
            $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
            $this->view->matrizrelacionesComponent
                = $this->pIntegrator->integracion->matrizrelacionesComponent();
        } catch (Exception $e) {
            $this->view->matrizrelacionesComponent = null;
            $this->view->extensionesPLAN = null;
            $this->view->pyeComun = null;
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
            (string)Zend_Registry::getInstance()->config->xml->RepositorioAlfresco
        );
        $data = parse_url(
            $configuracion->obtenerDireccionRepositorio() . 'api'
        ); /* $this->direccionRepositorio */
        $fp = fsockopen(
            $data['host'], isset($data['port']) ? $data['port'] : 80, $errno, $errstr, 30
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
   * Accion para actualizar parametors de los planes
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
      $arrayidplan = json_decode(
        stripslashes($this->_request->getPost('arrayidplan'))
      );

      foreach ($arrayidplan as $idelemento) {
        $datplanpdo = Doctrine::getTable('DatPlanPdo')->find($idelemento);
        $datelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if($parametros->fechainicio!=''){
          $datplanpdo->fechainicio = $parametros->fechainicio;
        }
        if($parametros->fechafin!=''){
          $datplanpdo->fechafin = $parametros->fechafin;
        }
        //obtengo relacion con nomencladores y modifico
        if ($parametros->idcategoria!='') {
          $objelemnom = new DatElementosNomNomencladorModel();
          /*$elemnom =*/
          $objelemnom->ModificarRelacionNomElem(
            $datelemento, $parametros->idcategoria, $tiponomenclador = 0
          );
        }

        $datplanpdo->save();
        $respuesta++;

      }
    }catch (Exception $exc) {
      $respuesta++;
    }

    echo json_encode(array('mensaje' => $respuesta));
  }

    /**
     * Accion para cargar los planes
     */
    function cargarplanesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idplan = $this->_request->getPost('anode');
        $idusuario = $this->global->Perfil->idusuario;
        $filters = $this->_request->getPost('filtros');
        //print_r($filters);die;
        $iddominio = $this->global->Perfil->iddominio;
        $parametros->sort = $this->_request->getPost('sort');
        $parametros->dir = $this->_request->getPost('dir');
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $enaprobacion = $this->_request->getPost('enaprobacion');
        //$denominacion = $this->_request->getPost('denom');
        $offset = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $arrayautores = json_decode(
            stripslashes($this->_request->getPost('arrayautores'))
        );
        $categplan = $this->_request->getPost('categplan');
        $objplanmodel = new CmpgestionarplanModel();
        $arrayplanes = $objplanmodel->CargarPlanes(
            $idplan, $idusuario, $iddominio, $certificado, $enaprobacion, $arrayautores, $categplan, $offset, $limit, $filters, $parametros
        );
        if (isset($arrayplanes[1][0]['idelemento'])) {
            echo json_encode(
                array('total' => $arrayplanes[0], 'campos' => $arrayplanes[1])
            );
        }
        if (!isset($arrayplanes[1][0]['idelemento'])) {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    /**
     * Accion para cargar los planes
     */
    function cargarplanesTraspasarAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        //print_r($filters);die;
        $iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        $idplan_origen = $this->_request->getPost('idplan_origen');
        $certificado = $session->certificado;
        $offset = 0;
        $limit = 10000;
        $arrayautores = json_decode(stripslashes([])
        );
        $objplanmodel = new CmpgestionarplanModel();
        $arrayplanes = $objplanmodel->CargarPlanes(
            $idplan = null, $idusuario, $iddominio, $certificado, $enaprobacion = 0, $arrayautores, $categplan = null, $offset, $limit, $filters = null, $parametros = null
        );
        $repuesta = [];
        $index = 0;
        if (isset($arrayplanes[1][0]['idelemento'])) {
            for ($i = 0; $i < count($arrayplanes[1]); $i++) {
                if ($arrayplanes[1][$i]['idelemento'] != $idplan_origen) {
                    $repuesta[$index] = $arrayplanes[1][$i];
                    $index++;
                }
            }
            echo json_encode(array('data' => $repuesta));

        }
        if (!isset($arrayplanes[1][0]['idelemento'])) {
            echo json_encode(array('data' => array()));
        }
    }


    /**
     * Accion para adicionar los planes
     */
    function adicionarplanAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacion');
        $denelemento = str_ireplace('"', "'", $denelemento);
        $descelemento = $this->_request->getPost('hedescripcion');
        $documentos = json_decode(
            stripslashes($this->_request->getPost('documentos'))
        );
        $arraydesvasociadas = json_decode(
            stripslashes($this->_request->getPost('array_desvasociadas'))
        );
        if ($this->_request->getPost('porcientocump') == "") {
            $gradocumplimiento = 0;
        } else {
            $gradocumplimiento = $this->_request->getPost('porcientocump') * 1;
        }
        $idcategoria = $this->_request->getPost('idcategoria');
        $idestadocump = $this->_request->getPost('idestadocump');
        $fechainicio = $this->_request->getPost('fini');
        $fechafin = $this->_request->getPost('ffin');
        $objcmpgestionarplanmodel = new CmpgestionarplanModel();
        $temp = $objcmpgestionarplanmodel->AdicionarPlan(
            $idusuariocrea, $denelemento, $descelemento, $gradocumplimiento, $idcategoria, $idestadocump, $fechainicio, $fechafin, $idtipoelemento = 0, $documentos, $arraydesvasociadas
        );
        if ($temp == false) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Accion para modificar los planes
     */
    function modificarplanAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacion');
        $denelemento = str_ireplace('"', "'", $denelemento);
        $descelemento = $this->_request->getPost('hedescripcion');
        if ($this->_request->getPost('porcientocump') == "") {
            $gradocumplimiento = 0;
        } else {
            $gradocumplimiento = $this->_request->getPost('porcientocump');
        }
        $idplan = $this->_request->getPost('idplan');
        $idcategplan = $this->_request->getPost('idcategoria');
        $fechainicio = $this->_request->getPost('fini');
        $fechafin = $this->_request->getPost('ffin');
        $documentos = json_decode(
            stripslashes($this->_request->getPost('documentos'))
        );
        $arraydesvasociadas = json_decode(
            stripslashes($this->_request->getPost('array_desvasociadas'))
        );
        //***historial***
        $objhisto->denelemento = $denelemento;
        $objhisto->descelemento = $descelemento;
        $objhisto->dirigente = '';
        $objhisto->gradocumplimiento = $gradocumplimiento;
        $objhisto->participante = '';
        //***
        $objcmpgestionarplanmodel = new CmpgestionarplanModel();
        $objcambiohorario = $objcmpgestionarplanmodel->CambioHorario(
            $idplan, $fechainicio, $fechafin
        );
        $temp = $objcmpgestionarplanmodel->ModificarPlan(
            $idplan, $idusuariocrea, $denelemento, $descelemento, $gradocumplimiento, $idcategplan, $fechainicio, $fechafin, $idtipoelemento = 0, $documentos, $arraydesvasociadas
        );
        //para generar notificaciones (ARA)
        if ($temp == 1) {
            $objNotificacion = new CmpnotificacionesModel();
            $accion = 2;
            $idelemento = $idplan;
            $idtipoelemento = 0;
            $idautor = $idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $objhisto, ''
            );
        }
        echo json_encode(array('mensaje' => $temp));
    }

    /**
     * Accion para eliminar los planes
     */
    function eliminarplanAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidplan = json_decode(
            stripslashes($this->_request->getPost('arrayidplan'))
        );
        //para generar notificaciones (ARA)
        $objNotificacion = new CmpnotificacionesModel();
        $arrayNotif = array();
        $accion = 3;
        $idtipoelemento = 0;
        $idautor = $idusuariocrea;
        $fecha = date('d/m/Y H:i:s');
        foreach ($arrayidplan as $idelemento) {
            //***historial***
            $objhistoantes = Doctrine::getTable('DatElementos')->find(
                $idelemento
            );
            $objhisto->denelemento = $objhistoantes->denelemento;
            $objhisto->descelemento = $objhistoantes->descelemento;
            $objhisto->dirigente = $objhistoantes->dirigente;
            $objhisto->gradocumplimiento = $objhistoantes->gradocumplimiento;
            $objhisto->participante = $objhistoantes->participante;

            $objplan = Doctrine::getTable('DatPlanPdo')->find($idelemento);
            $objcmpgestionarplanmodel = new CmpgestionarplanModel();
            $objcambiohorario = $objcmpgestionarplanmodel->CambioHorario(
                $idelemento, $objplan->fechainicio, $objplan->fechafin
            );
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $objhisto, ''
            );
        }
        $objcmpplanmodel = new CmpgestionarplanModel();
        $resp = $objcmpplanmodel->EliminarPlan($arrayidplan);
        if ($resp == 0) {
            if (!empty($arrayNotif)) {
                $objNotificacion->eliminarArrayNotificaciones($arrayNotif);
            }
        }
        echo json_encode(array('mensaje' => $resp));
    }

    /**
     * Accion para activar o desactivar los planes
     */
    function activardesactivarplanAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $estado = $this->_request->getPost('accion');
        $arrayidplan = json_decode(
            stripslashes($this->_request->getPost('arrayidplan'))
        );
        $objcmpplanmodel = new CmpgestionarplanModel();
        $resp = $objcmpplanmodel->ActivarDesactivarPlan($arrayidplan, $estado);
        echo json_encode(array('mensaje' => $resp));
    }

    /**
     * Accion para cargar el combo con las categorias del plan
     */
    function cargarcategoriasplanAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 0;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idcategoria' => $val['idnomenclador'],
                    'denominacion' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Funcion para cargar el combo de estados de aprobacion de los planes
     */
    function cargarcmbestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idusuariosession, $idtipodoc = 0
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    /**
     * Funcion para cargar un plan en el formulario
     */
    function cargarFormPlanAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idplan = $this->_request->getPost('idplan');
        $plan = DatPlanPdo::GetPlanDadoId($idplan);
        //$obj 		= new DatPlanPdoModel();
        if ($plan != null) {
            /* tipo de nomenclador estado de cumplimiento */
            $estadocumplimiento = 6;
            /* tipo de nomenclador categoria */
            $categoriaplan = 0;
            /* tipo de elemento plan */
            $tipoelemento = 0;

            $estcump = $this->getNomencladorDadoIdPlan(
                $idplan, $estadocumplimiento, $tipoelemento
            );
            $categplan = $this->getNomencladorDadoIdPlan(
                $idplan, $categoriaplan, $tipoelemento
            );
            $dat->data [] = array(
                'idplan' => $plan['idplan'],
                /* 'autor' => $this->integrator->seguridad->nombreUsuario(
                  $plan['DatElementos']['idusuariocrea']
                  ), */
                'autor' => $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $plan['DatElementos']['idusuariocrea'], 'usuario', null
                ),
                'denominacion' => $plan['DatElementos']['denelemento'],
                'desc' => $plan['DatElementos']['descelemento'],
                'porcientocump' => $plan['DatElementos']['gradocumplimiento'],
                'estaprob' => array('idestadoaprob' => "1",
                    'denominacion' => "Estado 1"),
                'estadocump' => array('idestadocump' => $estcump->idnomenclador,
                    'denominacion' => $estcump->dennomenclador),
                'categoria' => array('idcategoria' => $categplan->idnomenclador,
                    'denominacion' => $categplan->dennomenclador),
                'fini' => $plan['fechainicio'],
                'estadocumplimiento' => $plan['DatElementos']['estadocumplimiento'],
                'hedescripcion' => $plan['DatElementos']['descelemento'],
                'ffin' => $plan['fechafin'], 'mensaje' => 1
            );
            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Funcion para obtener los valores de un nomenclador dado el id del plan
     */
    private function getNomencladorDadoIdPlan(
        $idplan, $tiponomenclador/* , $tipoelemento */
    )
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        //Obtener el id del nomenclador asociado al plan
        $elemnom = DatPlanPdo::GetNomDadoIdPlan($idplan, $tiponomenclador);
        $idusuario = $this->global->Perfil->idusuario;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        //Obtener la denomicacion del nomenclador asociado al plan
        if (isset($nomencladores[0])) {
            foreach ($nomencladores as $value) {
                if ($elemnom['idnomenclador'] == $value['idnomenclador']) {
                    $nomenclador->idnomenclador = $value['idnomenclador'];
                    $nomenclador->dennomenclador = $value['denom'];
                }
            }
        }
        return $nomenclador;
    }

    /**
     * Funcion para relacionar el plan con otros elementos
     */
    function relacionarplanAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idelementopadre = $this->_request->getPost('idelementopadre');
        $tipoelementopadre = $this->_request->getPost('tipoelementopadre');
        $arrayidplan = json_decode(
            stripslashes($this->_request->getPost('arrayidplan'))
        );
        $objplanmodel = new CmpgestionarplanModel();
        $respuesta = $objplanmodel->RelacionarPlan(
            $idusuariosession, $idelementopadre, $tipoelementopadre, $arrayidplan
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Funcion para mostrar el desgloce del plan
     */
    public function desglozarplanAction()
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

    public function actualizarrelacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objcmpelmodel = new CmpgestionarelementoModel();
        $respuesta = $objcmpelmodel->ActualizarRelaciones();
        echo json_encode(array('mensaje' => $respuesta));
    }

    function importarPlanAnualAction()
    {
        ini_set("max_execution_time", 7200); //7200 1hora
        ini_set('memory_limit', '-1');

        //$parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idplan = $this->_request->getPost('idplan');
        $parametros->idestado = $this->_request->getPost('idestado');
        //ver con adis como es el proceso de los estado de aprobacion de las actividades
        //$parametros->retornar = (isset($parametros->idestado) ? 1 : '');
        $parametros->annoPlan = $this->_request->getPost('tfanno');

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
                if ($fileextension == 'application/vnd.ms-excel' || $fileextension == 'application/xls' || $fileextension == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || $filename[count($filename) - 1] == 'xls' || $filename[count($filename) - 1] == 'xlsx'
                ) {

                    $ruta = '../models/bussines/ReaderModel.php';
                    include_once(dirname(__FILE__) . $ruta);
                    $data = new ReaderModel();
                    $data->setOutputEncoding('CP1251');
                    $data->read($params['file']);
                    $planAnual = $data->sheets[0]['cells'];

                    //print_r($data);die;

                    $obj = new CmpgestionaractividadesModel();

                    //obtengo el involucrado del nodo Mi Usuario
                    $usuario
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        'nodo1', $parametros->idusuariocrea, undefined, 2, 'nodo1', 0, 2, 1, $certificado, $parametros->idusuariocrea);

                    //obtengo los usuarios subordinados
                    $usersdomain
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        'nodo3', $parametros->idusuariocrea, undefined, 2, 'nodo3', 0, 3, 1, $certificado, $parametros->idusuariocrea);

                    //obtengo los usuarios de los permisos otrorgados por el nivel superior
                    $otros
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        'nodo4', $parametros->idusuariocrea, undefined, 2, 'nodo4', 0, 3, 1, $certificado, $parametros->idusuariocrea);

                    //uno los resultados en un mismo array
                    $arrayMisInvol = array_merge((isset($usuario) ? $usuario : array()), (isset($usersdomain) ? $usersdomain : array()), (isset($otros) ? $otros : array()));


                    $data = Array();
                    $arrayNumArc = Array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X');
                    $IdArcPadre = '';
                    $IdACTPadre = '';
                    $IdUsuarioPadre = '';
                    $IdUsuarioActPadre = '';
                    $IdArcHijo = '';
                    $arrayId = array();
                    $arrayPadres = array();

                    $arraytotalrepeticiones = array();
                    $arraytotalerrores = array();

                    foreach ($planAnual as $key => $value) {
                        if ($key >= 6) {
                          // a partir de aqui segun el formato comienzan los ARC y las Act asociadas
                            //creo el autor
                            if (isset($value[17])) {
                                $parametros->usuario = $value[17];
                                $idusuario = $obj->getIdUsuario($parametros);
                                if (!empty($idusuario)) {
                                    $parametros->idusuariocrea = $idusuario;
                                } else {
                                    $parametros->idusuariocrea = $this->global->Perfil->idusuario;
                                }
                            } else {
                                $parametros->idusuariocrea = $this->global->Perfil->idusuario;
                            }
                            //var_dump($parametros->idusuariocrea.';');
                            if (count($value) <= 3) { // es un ARC
                                if (isset($value[1])) {  // pregunto si posee denominacion
                                    $denominacion = explode('-', $value[1]); // en $denominacion[0] se guarda 'I', 'II', 'III', 'IV', 'V' para poder comparar y ver si es un capitulo
//
                                  if (in_array(trim($denominacion[0]), $arrayNumArc)) {
                                        //Si es padre
                                        //creo todos los paramertos necesarios para insertar el ARC
                                        $idusuariocrea = $parametros->idusuariocrea;
                                        $denarc = utf8_encode($value[1]);
                                        $descarc = null;
                                        $fechainicio = date('d/m' . '/' . $parametros->annoPlan);
                                        $fechafin = null;
                                        $idarcp = null;
                                        $eshija = 0;

                                        $arrayinvolucrados = Array();

                                        // array elementos relacionados
                                        $arrayelementosrelacionados = array();
                                        $arrayelementosrelacionados[0]->idplan = $parametros->idplan;
                                        $arrayelementosrelacionados[0]->idarc = '';
                                        $arrayelementosrelacionados[0]->idobjetivo = '';
                                        $arrayelementosrelacionados[0]->idfip = '';
                                        $arrayelementosrelacionados[0]->iddesviacion = '';
                                        $arrayelementosrelacionados[0]->idactividad = '';
                                        $arrayelementosrelacionados[0]->tipoelemento = 0;
                                        $arrayelementosrelacionados[0]->origen = '';
                                        $arrayelementosrelacionados[0]->porcientoinicio = '';
                                        // inserto el ARC
                                        $objcmpgestionararcmodel = new CmpgestionararcModel();
                                        $idarc = $objcmpgestionararcmodel->AdicionarArcImportar(
                                            $idusuariocrea, $denarc, $descarc, $fechainicio, $fechafin, $arrayinvolucrados, $idarcp, $eshija, $arrayelementosrelacionados
                                        );
                                        // guardo su ID para poder insertarle los hijos si los posee
                                        $IdArcPadre = $idarc;
                                        $IdUsuarioPadre = $idusuariocrea;

                                        //se crea el objeto 'arc-involucrados' y se registra
                                        if (isset($arrayinvolucrados[0])) {
                                            $objclasificadorinvolmodel = new ClasificadorinvolModel();
                                            foreach ($arrayinvolucrados as $involucrado) {
                                                $objclasificadorinvolmodel->Involucrar(
                                                    $involucrado, $idarc, $idtipoelemento = 5, $estamodificando = 0
                                                );
                                            }
                                        }
                                        //se crea el objeto 'relacion' y se registra
                                        if (isset($arrayelementosrelacionados[0])) {
                                            $objclasificadorinvolmodel = new CmprelacionesModel();
                                            $objclasificadorinvolmodel->RelacionarElementos(
                                                $idarc, $idtipoelemento = 5, $arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $idusuariocrea
                                            );
                                        }

                                    } else {
                                        //creo todos los paramertos necesarios para insertar el ARC hija
                                        $idusuariocrea = $parametros->idusuariocrea;
                                        $denarc = utf8_encode($value[1]);
                                        $descarc = null;
                                        $fechainicio = date('d/m' . '/' . $parametros->annoPlan);
                                        $fechafin = null;
                                        $idarcp = $IdArcPadre;
                                        $eshija = 1;
                                        $referencia = array();
                                        //creo el array de involucrados del ARC
                                        /*if (isset($value[17])) {
                                            $referencia = Array();
                                            $parametros->usuario = $value[17];
                                            $idusuario = $obj->getIdUsuario($parametros);
                                            if (($idusuario != '' || $idusuario != 0)) {
                                                if (in_array($idusuario, $arrayMisInvol)) {
                                                    if ($idusuariocrea != $IdUsuarioPadre) {
                                                        $invol->idinvolucrado = $idusuario;
                                                        $invol->llaveinvolucrado = $idusuario;
                                                        $invol->denominacion = $value[17];
                                                        $invol->idusuario = $idusuario;
                                                        $invol->idgrupo = '';
                                                        $invol->tipo = 1;
                                                        $invol->nombretipo = 'Usuario';
                                                        $invol->tipoinvol = 1;
                                                        $invol->idtipoinvolucrado = null;
                                                        array_push($referencia, $invol);
                                                    }
                                                } else {
                                                    $msg = "El ARC " . $denarc . " tiene error en el valor  Autor ({$parametros->usuario}) no se encuentra configurado como involucrado de su usuario en el sistema";
                                                    array_push($arraytotalerrores, $msg);
                                                }
                                            } else {
                                                $msg = "El ARC " . $denarc . " tiene error en el valor  Autor ({$parametros->usuario}) no se encuentra en el formato especificado";
                                                array_push($arraytotalerrores, $msg);
                                            }
                                        } else {
                                            if ($this->global->Perfil->idusuario != $IdUsuarioPadre) {
                                                $idusuario = $this->global->Perfil->idusuario;
                                                $usuario = $this->global->Perfil->usuario;
                                                $invol->idinvolucrado = $idusuario;
                                                $invol->llaveinvolucrado = $idusuario;
                                                $invol->denominacion = $usuario;
                                                $invol->idusuario = $idusuario;
                                                $invol->idgrupo = '';
                                                $invol->tipo = 1;
                                                $invol->nombretipo = 'Usuario';
                                                $invol->tipoinvol = 1;
                                                $invol->idtipoinvolucrado = null;
                                                array_push($referencia, $invol);
                                            }
                                        }*/
                                        $arrayinvolucrados = array();
                                        $arrayinvolucradosPAdre = (count($referencia) > 0) ? $referencia : array();

                                        // array elementos relacionados
                                        $arrayelementosrelacionados = array();
                                        $arrayelementosrelacionados[0]->idplan = $parametros->idplan;
                                        $arrayelementosrelacionados[0]->idarc = '';
                                        $arrayelementosrelacionados[0]->idobjetivo = '';
                                        $arrayelementosrelacionados[0]->idfip = '';
                                        $arrayelementosrelacionados[0]->iddesviacion = '';
                                        $arrayelementosrelacionados[0]->idactividad = '';
                                        $arrayelementosrelacionados[0]->tipoelemento = 0;
                                        $arrayelementosrelacionados[0]->origen = '';
                                        $arrayelementosrelacionados[0]->porcientoinicio = '';

                                        // inserto el ARC
                                        $objcmpgestionararcmodel = new CmpgestionararcModel();
                                        $idarc = $objcmpgestionararcmodel->AdicionarArcImportar(
                                            $idusuariocrea, $denarc, $descarc, $fechainicio, $fechafin, $arrayinvolucrados, $idarcp, $eshija, $arrayelementosrelacionados
                                        );

                                        // guardo su ID para poder insertarle los hijos si los posee
                                        $IdArcHijo = $idarc;

                                        //se crea el objeto 'arc-involucrados' y se registra
                                        if (isset($arrayinvolucradosPAdre[0])) {
                                            $objclasificadorinvolmodel = new ClasificadorinvolModel();
                                            foreach ($arrayinvolucradosPAdre as $involucrado) {
                                                $objclasificadorinvolmodel->Involucrar(
                                                    $involucrado, $idarcp, $idtipoelemento = 5, $estamodificando = 0
                                                );
                                            }
                                        }

                                        //se crea el objeto 'relacion' y se registra
                                        if (isset($arrayelementosrelacionados[0])) {
                                            $objclasificadorinvolmodel = new CmprelacionesModel();
                                            $objclasificadorinvolmodel->RelacionarElementos(
                                                $idarc, $idtipoelemento = 5, $arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $idusuariocrea
                                            );
                                        }
                                    }
                                }
                            } else if (count($value) > 3 && count($value) <= 18) { // es una actividad
                                $idusuariocrea = $parametros->idusuariocrea;
                                //si es decimal va a ser hija
                                if (fmod($value[1], 1) !== 0.00) {
                                    $k = explode('.', $value[1]);

                                    //busco si el id de su padre que esta en el arreglo
                                    if (isset($arrayPadres[$k[0]])) {
                                        $parametros->eshija = 1;
                                        $parametros->idactividadpadre = $arrayPadres[$k[0]];
                                        $IdACTPadre = $parametros->idactividadpadre;
                                        $referencia = array();
                                        //creo el array de involucrados del ARC
                                        /*if (isset($value[17])) {
                                            $referencia = Array();
                                            $parametros->usuario = $value[17];
                                            $idusuario = $obj->getIdUsuario($parametros);
                                            //$parametros->idusuariocrea = $idusuario;
                                            if (($idusuario != '' || $idusuario != 0)) {
                                                if (in_array($idusuario, $arrayMisInvol)) {
                                                    if ($idusuariocrea != $IdUsuarioActPadre) {
                                                        $invol->idinvolucrado = $idusuario;
                                                        $invol->llaveinvolucrado = $idusuario;
                                                        $invol->denominacion = $value[17];
                                                        $invol->idusuario = $idusuario;
                                                        $invol->idgrupo = '';
                                                        $invol->tipo = 1;
                                                        $invol->nombretipo = 'Usuario';
                                                        $invol->tipoinvol = 1;
                                                        $invol->idtipoinvolucrado = null;
                                                        array_push($referencia, $invol);
                                                    }
                                                } else {
                                                    $msg = "La actividad " . $parametros->denelemento . " tiene error en el valor  Autor ({$parametros->usuario}) no se encuentra configurado como involucrado de su usuario en el sistema";
                                                    array_push($arraytotalerrores, $msg);
                                                }
                                            } else {
                                                $msg = "La actividad " . $parametros->denelemento . " tiene error en el valor  Autor ({$parametros->usuario}) no se encuentra en el formato especificado";
                                                array_push($arraytotalerrores, $msg);
                                            }
                                        } else {
                                            if ($this->global->Perfil->idusuario != $IdUsuarioActPadre) {
                                                $idusuario = $this->global->Perfil->idusuario;
                                                $usuario = $this->global->Perfil->usuario;
                                                $invol->idinvolucrado = $idusuario;
                                                $invol->llaveinvolucrado = $idusuario;
                                                $invol->denominacion = $usuario;
                                                $invol->idusuario = $idusuario;
                                                $invol->idgrupo = '';
                                                $invol->tipo = 1;
                                                $invol->nombretipo = 'Usuario';
                                                $invol->tipoinvol = 1;
                                                $invol->idtipoinvolucrado = null;
                                                array_push($referencia, $invol);
                                            }
                                        }*/

                                    } else {
                                        //si no encuentra el padre en el array y tiene un padre global, lo pongo como hijo de ese global
//                                        if ($padreglobal != '') {
//                                            $parametros->eshija = 1;
//                                            $parametros->idactividadpadre = $padreglobal;
//                                        } else {
                                        //sino no tiene padre
                                        $parametros->eshija = 0;
                                        $parametros->idactividadpadre = '';
//                                        }
                                    }
                                } else {

                                    //si tiene padre global lo pongo como hijo de ese global
//                                    if ($padreglobal != '') {
//                                        $parametros->eshija = 1;
//                                        $parametros->idactividadpadre = $padreglobal;
//                                    } else {
                                    //sino no tiene padre
                                    $parametros->eshija = 0;
                                    $parametros->idactividadpadre = '';
                                    $IdUsuarioActPadre = $parametros->idusuariocrea;
//                                    }
                                }

                                $arrayinvolucrados = array();
                                $arrayinvolucradosActPadre = (count($referencia) > 0) ? $referencia : array();

                                $parametros->recursoasociado = Array();
                                $parametros->accion = '';
                                $parametros->documentos = Array();
                                $parametros->denelemento = str_replace("'", "", utf8_encode($value[2]));
                                $parametros->descelemento = '';
                                $parametros->gradocumplimiento = '0';
                                $parametros->fechainicio = date('d/m' . '/' . $parametros->annoPlan);
                                $parametros->fechafin = date('d/m' . '/' . $parametros->annoPlan);
                                $parametros->horainicio = '08:00';
                                $parametros->horafin = '17:00';
                                $parametros->idtipo = null;
                                $parametros->idcategoria = null;
                                $parametros->lugar = '';
                                $parametros->dirigentes = str_replace("'", "", utf8_encode($value[15]));
                                $parametros->participantes = str_replace("'", "", utf8_encode($value[16]));
                                $parametros->arrayrepeticiones = Array();
                                $parametros->idtipoelemento = 3;
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
//                                if (isset($value[17])) {
//                                    $referencia = Array();
//                                    $invol = explode(';', $value[17]);
//                                    $i = 0;
//                                    foreach ($invol as $key => $user) {
//
//                                        $parametros->usuario = $user;
//
//                                        $idusuario = $obj->getIdUsuario($parametros);
//
//                                        if ($idusuario != '' || $idusuario != 0) {
//
//                                            for ($w = 0; $w < count($arrayMisInvol); $w++) {
//                                                if ($arrayMisInvol[$w]['idusuario'] == $idusuario) {
//
//                                                    $referencia[$i]->idinvolucrado = $idusuario;
//                                                    $referencia[$i]->llaveinvolucrado = $idusuario;
//                                                    $referencia[$i]->denominacion = $user;
//                                                    $referencia[$i]->idusuario = $idusuario;
//                                                    $referencia[$i]->idgrupo = '';
//                                                    $referencia[$i]->tipo = 1;
//                                                    $referencia[$i]->nombretipo = 'Usuario';
//                                                    $referencia[$i]->tipoinvol = 1;
//                                                    $referencia[$i]->idtipoinvolucrado = null;
//                                                    $i++;
//
//                                                    $parametros->arrayinvolucrados = $referencia;
//                                                    break;
//                                                }
//                                            }
//                                        }
//                                    }
//                                } else {
//                                    $parametros->arrayinvolucrados = Array();
//                                }

                                //creo el array de elementos relacionados de la actividad
                                $relaciones = Array();
                                $relaciones[0]->idplan = $parametros->idplan;
                                $relaciones[0]->idarc = $IdArcHijo;
                                $relaciones[0]->idobjetivo = null;
                                $relaciones[0]->idfip = null;
                                $relaciones[0]->iddesviacion = null;
                                $relaciones[0]->idactividad = null;
                                $relaciones[0]->tipoelemento = 50;
                                $relaciones[0]->origen = null;
                                $relaciones[0]->porcientoinicio = null;

                                $parametros->arrayelementosrelacionados = $relaciones;

//                                repeticiones de la actividad
                                $firstInstance = false;
                                $secondInstance = false;
                                $arrayaux = array();
                                $auxc = 0;
                                foreach ($value as $c => $valor) {
                                    if ($c > 2 && $c < 15) {
                                        if (isset($valor) && $valor != '' && !empty($valor) && $valor != null && $valor != false) {
                                            $repeticiones = ($secondInstance == true) ? $arrayaux : array();
                                            $mes = 1;
                                            switch ($c) {
                                                case 3:
                                                    $mes = 1;
                                                    break;
                                                case 4:
                                                    $mes = 2;
                                                    break;
                                                case 5:
                                                    $mes = 3;
                                                    break;
                                                case 6:
                                                    $mes = 4;
                                                    break;
                                                case 7:
                                                    $mes = 5;
                                                    break;
                                                case 8:
                                                    $mes = 6;
                                                    break;
                                                case 9:
                                                    $mes = 7;
                                                    break;
                                                case 10:
                                                    $mes = 8;
                                                    break;
                                                case 11:
                                                    $mes = 9;
                                                    break;
                                                case 12:
                                                    $mes = 10;
                                                    break;
                                                case 13:
                                                    $mes = 11;
                                                    break;
                                                case 14:
                                                    $mes = 12;
                                                    break;
                                            }

                                            // elimino los espacios de la cadena para poder trabajar y sustituyo la 'y' por una ','
                                            $arrayDias = explode(',', preg_replace('[\s+]', '', str_replace('y', ',', $valor)));
                                            foreach ($arrayDias as $w => $v1) {
                                                $pos = strpos($arrayDias[$w], '-');
                                                if ($pos === false && intval($arrayDias[$w]) != 0) {

                                                    if ($firstInstance == false) {
                                                        $parametros->fechainicio = $this->validar_fecha_espanol(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan) ? date(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan) : $parametros->fechainicio;
                                                        $parametros->fechafin = $this->validar_fecha_espanol(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan) ? date(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan) : $parametros->fechafin;
                                                        $firstInstance = true;
                                                    }

                                                    if ($secondInstance == true) {
                                                        if ($this->validar_fecha_espanol(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) {
                                                            $repeticiones[$w + 1]->fechainicio = date(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                            $repeticiones[$w + 1]->fechafin = date(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                            $repeticiones[$w + 1]->hora = '08:00';
                                                            $repeticiones[$w + 1]->horafin = '17:00';
                                                            $repeticiones[$w + 1]->lugar = '';
                                                            $repeticiones[$w + 1]->tiporepeticion = 1;
                                                            $repeticiones[$w + 1]->involucrados = array();
                                                            $secondInstance = false;
                                                        } else {
                                                            $msg = "La actividad " . $parametros->denelemento . ' tiene error en el mes ' . $mes . ' en el valor ' . $arrayDias[$w];
                                                            array_push($arraytotalerrores, $msg);
                                                        }

                                                    } else {
                                                        if ($this->validar_fecha_espanol(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) {
                                                            $repeticiones[$w]->fechainicio = date(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                            $repeticiones[$w]->fechafin = date(intval($arrayDias[$w]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                            $repeticiones[$w]->hora = '08:00';
                                                            $repeticiones[$w]->horafin = '17:00';
                                                            $repeticiones[$w]->lugar = '';
                                                            $repeticiones[$w]->tiporepeticion = 1;
                                                            $repeticiones[$w]->involucrados = array();
                                                            $secondInstance = false;
                                                        } else {
                                                            $msg = "La actividad " . $parametros->denelemento . ' tiene error en el mes ' . $mes . ' en el valor ' . $arrayDias[$w];
                                                            array_push($arraytotalerrores, $msg);
                                                        }

                                                    }
                                                } else if (intval($arrayDias[$w]) != 0 && is_string($arrayDias[$w])) {
                                                    $arrayRango = explode('-', $arrayDias[$w]);

                                                    if ($firstInstance == false) {
                                                        $parametros->fechainicio = ($this->validar_fecha_espanol(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) ? date(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan) : $parametros->fechainicio;
                                                        $parametros->fechafin = ($this->validar_fecha_espanol(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) ? date(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan) : $parametros->fechafin;
                                                        $firstInstance = true;
                                                    }


                                                    //si el - esta al final de la cadena, es decir 1- o 22-
                                                    if (($pos == 1 || $pos == 2) && empty($arrayRango[1])) {
                                                        $auxc = $w;
                                                        if ($this->validar_fecha_espanol(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) {
                                                            $repeticiones[$w]->fechainicio = date(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                            $repeticiones[$w]->fechafin = date(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                            $repeticiones[$w]->hora = '08:00';
                                                            $repeticiones[$w]->horafin = '17:00';
                                                            $repeticiones[$w]->lugar = '';
                                                            $repeticiones[$w]->tiporepeticion = 1;
                                                            $repeticiones[$w]->involucrados = array();
                                                            $arrayaux = $repeticiones;
                                                            $secondInstance = true;
                                                        } else {
                                                            $msg = "La actividad " . $parametros->denelemento . ' tiene error en el mes ' . $mes . ' en el valor ' . $arrayDias[$w];
                                                            array_push($arraytotalerrores, $msg);
                                                        }


                                                    } elseif ($pos == 0) { // si esta delante de la cadena , es decir -4 o -19
                                                        if ($secondInstance != false) {
                                                            if ($this->validar_fecha_espanol(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) {
                                                                $repeticiones[$auxc]->fechafin = date(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                            } else {
                                                                $msg = "La actividad " . $parametros->denelemento . ' tiene error en el mes ' . $mes . ' en el valor ' . $arrayDias[$w];
                                                                array_push($arraytotalerrores, $msg);
                                                            }
                                                            $secondInstance = false;
                                                        } else {

                                                            if ($this->validar_fecha_espanol(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) {
                                                                $repeticiones[$w]->fechainicio = date(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                                $repeticiones[$w]->fechafin = date(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                                $repeticiones[$w]->hora = '08:00';
                                                                $repeticiones[$w]->horafin = '17:00';
                                                                $repeticiones[$w]->lugar = '';
                                                                $repeticiones[$w]->tiporepeticion = 1;
                                                                $repeticiones[$w]->involucrados = array();
                                                                $arrayaux = $repeticiones;
                                                                $secondInstance = false;
                                                            } else {
                                                                $msg = "La actividad " . $parametros->denelemento . ' tiene error en el mes ' . $mes . ' en el valor ' . $arrayDias[$w];
                                                                array_push($arraytotalerrores, $msg);
                                                            }

                                                        }
                                                    } else {

                                                        if ($secondInstance == true) {
                                                            if ($this->validar_fecha_espanol(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan) && $this->validar_fecha_espanol(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) {
                                                                $repeticiones[$w + 1]->fechainicio = date(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                                $repeticiones[$w + 1]->fechafin = date(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                                $repeticiones[$w + 1]->hora = '08:00';
                                                                $repeticiones[$w + 1]->horafin = '17:00';
                                                                $repeticiones[$w + 1]->lugar = '';
                                                                $repeticiones[$w + 1]->tiporepeticion = 1;
                                                                $repeticiones[$w + 1]->involucrados = array();
                                                                $secondInstance = false;
                                                            } else {
                                                                $msg = "La actividad " . $parametros->denelemento . " tiene error en el mes " . $mes . ' en el valor ' . $arrayDias[$w];
                                                                array_push($arraytotalerrores, $msg);
                                                            }

                                                        } else {
                                                            if ($this->validar_fecha_espanol(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan) && $this->validar_fecha_espanol(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan)) {
                                                                $repeticiones[$w]->fechainicio = date(intval($arrayRango[0]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                                $repeticiones[$w]->fechafin = date(intval($arrayRango[1]) . '/' . intval($mes) . '/' . $parametros->annoPlan);
                                                                $repeticiones[$w]->hora = '08:00';
                                                                $repeticiones[$w]->horafin = '17:00';
                                                                $repeticiones[$w]->lugar = '';
                                                                $repeticiones[$w]->tiporepeticion = 1;
                                                                $repeticiones[$w]->involucrados = array();
                                                                $secondInstance = false;
                                                            } else {
                                                                $msg = "La actividad " . $parametros->denelemento . " tiene error en el mes " . $mes . " en el valor " . $arrayDias[$w];
                                                                array_push($arraytotalerrores, $msg);
                                                            }


                                                        }

                                                    }

                                                }
                                            }
//                                            print_r($repeticiones);
                                            if ($secondInstance == false) {
                                                foreach ($repeticiones as $rep) {
                                                    array_push($parametros->arrayrepeticiones, $rep);
                                                }
                                            }
                                        }
                                    }
                                }
                                //Elimiar la 1ra pos del array de repeticiones porque es la fecha de la actividad adicionada
                                if (isset($parametros->arrayrepeticiones[0])) {
                                    unset($parametros->arrayrepeticiones[0]);
                                    $parametros->arrayrepeticiones = array_values($parametros->arrayrepeticiones);
                                }
                                $result = $obj->AdicionarActividadImportar($parametros);

                                if (isset($arrayinvolucradosActPadre[0])) {
                                    $objclasificadorinvolmodel = new ClasificadorinvolModel();
                                    foreach ($arrayinvolucradosActPadre as $involucrado) {
                                        $objclasificadorinvolmodel->Involucrar(
                                            $involucrado, $IdACTPadre, $idtipoelemento = 3, $estamodificando = 0
                                        );
                                    }
                                }
//                                $arraytotalrepeticiones[$result]= $parametros->arrayrepeticiones;
                                $arrayId[$value[1]] = $result;

                                //si son numeros enteros es que son objetivos, guardo sus id en el array de padres
                                if (fmod($value[1], 1) === 0.00) {
                                    $arrayPadres[$value[1]] = $result;
                                }
                            }
                        }
                    }
                    $html = implode(',', $arraytotalerrores);
                    if (isset($result)) {
                        echo Zend_Json_Encoder::encode(array('mensaje' => 1, 'arrayErrores' => $arraytotalerrores, 'html' => $html));
                        return;
                    } else {
                        echo Zend_Json_Encoder::encode(array('mensaje' => 1, 'arrayErrores' => $arraytotalerrores, 'html' => $html));
                    }
                } else {
                    echo json_encode(array('cod' => 4, 'mensaje' => 'El fichero importado no tiene el formato establecido.'));
                    return;
                }
            } else {
                echo json_encode(array('success' => false, 'max_file_size' => true, 'max_upload_size' => $maxsize, 'mensaje' => ('El tama&ntilde;o del archivo excede el l&iacute;mite de ' . $maxsize . ' permitido por el servidor.')));
                return;
            }
        } catch
        (Exception $e) {
            echo json_encode(array('mensaje' => 3, 'msgText' => $e->getMessage() . '</br>' . $e->getTraceAsString(), 'arrayErrores' => $arraytotalerrores)); // mensaje de error
            return;
        }
    }


  public function number2roman($num,$isUpper=true) {
    $n = intval($num); $res = ''; /*** roman_numerals array ***/
    $roman_numerals = array( 'M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400, 'C' => 100, 'XC' => 90,
                             'L' => 50, 'XL' => 40, 'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1 );
    foreach ($roman_numerals as $roman => $number) {
      /*** divide to get matches ***/ $matches = intval($n / $number);
      /*** assign the roman char * $matches ***/ $res .= str_repeat($roman, $matches);
      /*** substract from the number ***/ $n = $n % $number; } /*** return the res ***/
    if($isUpper) return $res; else return strtolower($res);
  }

  function importarPuntualizacionesAction()
  {
    ini_set("max_execution_time", 36000); //3600 1hora
    ini_set('upload_max_filesize', '5000000M');
    ini_set('post_max_size', '5000000M');

    $parametros=new stdClass();

    $parametros->idplan = $this->_request->getPost('idplan');
    $parametros->idestado = $this->_request->getPost('idestado');
    $parametros->annoPlan = $this->_request->getPost('tfanno');
    $parametros->idmes = $this->_request->getPost('idmes');

    $session = Zend_Registry::get('session');
    $certificado = $session->certificado;

    $arraytotalerrores = array();


    $archivo = $_FILES['file']['tmp_name'];


    $extension=explode('.',$_FILES['file']['name']);
    $strextension=$extension[count($extension)-1];


    if($strextension=="xls" || $strextension=="xlsx"){

      try{
        $dir_www = $_SERVER ['DOCUMENT_ROOT'];
        $dir_rel_mt = '/';
        $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);

        require $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/PHPExcel/Classes/PHPExcel.php';

        $inputFileType = PHPExcel_IOFactory::identify($_FILES['file']['tmp_name']);
        $objReader = PHPExcel_IOFactory::createReader($inputFileType);
        $objPHPExcel = $objReader->load($archivo);
        $sheet = $objPHPExcel->getSheet(0);
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        $arrayNumArc = array();

        $cant=100;
        while ($cant>0){
          $arrayNumArc [] = self::number2roman($cant,true);
          $cant--;
        }

        $obj = new CmpgestionaractividadesModel();
        //print_r($arrayNumArc);die;

        $IdArcPadre = '';
        $IdArcHijo = '';
        $arrayPadres = array();
        $tipo_anterior="";

        $otras_actividades=false;

        //$columns=["A", "B", "C", "D", "E", "F","G", "H", "I", "J", "K", "L"];

        for ($row = 5; $row <= $highestRow; $row++){

//          if ($sheet->getCell("L".$row)->getValue()!=null) {
//            $parametros->usuario = $sheet->getCell("L".$row)->getValue();
//            $idusuario = $obj->getIdUsuario($parametros);
//            if (!empty($idusuario)) {
//              $parametros->idusuariocrea = $idusuario;
//            } else {
//              $parametros->idusuariocrea = $this->global->Perfil->idusuario;
//            }
//          } else {
            $parametros->idusuariocrea = $this->global->Perfil->idusuario;
//          }

            if($sheet->cellExists("B".$row)){

              if(str_replace(' ','',strtoupper($sheet->getCell("B".$row)->getValue()))=="OTRASACTIVIDADES")
                 $otras_actividades=true;


              if($sheet->getCell("B".$row)->getValue()!=null && str_replace(' ','',strtoupper($sheet->getCell("B".$row)->getValue()))!="OTRASACTIVIDADES" &&
                           $sheet->getCell("C".$row)->getValue()==null){

                $arrayPadres = array();

                $denominacion = explode('.', $sheet->getCell("B".$row)->getValue()); // en $denominacion[0] se guarda 'I', 'II', 'III', 'IV', 'V' para poder comparar y ver si es un capitulo

                //creo todos los paramertos necesarios para insertar el ARC

                $date=date($parametros->annoPlan."-".$parametros->idmes."-01");


                $fini=strtotime(date("Y-m-d", strtotime($date)).", first day of this month");
                $firt_date=date("d/m/Y", $fini);
                $finf=strtotime(date("Y-m-d", strtotime($date)).", last day of this month");
                $last_date=date("d/m/Y", $finf);

                $idusuariocrea = $parametros->idusuariocrea;
                $denarc = utf8_encode($sheet->getCell("B".$row)->getValue());
                $descarc = null;
                $fechainicio = $firt_date;
                $fechafin = $last_date;


                $arrayinvolucrados = Array();

                // array elementos relacionados
                $arrayelementosrelacionados = array();
                $arrayelementosrelacionados[0]->idplan = $parametros->idplan;
                $arrayelementosrelacionados[0]->idarc = '';
                $arrayelementosrelacionados[0]->idobjetivo = '';
                $arrayelementosrelacionados[0]->idfip = '';
                $arrayelementosrelacionados[0]->iddesviacion = '';
                $arrayelementosrelacionados[0]->idactividad = '';
                $arrayelementosrelacionados[0]->tipoelemento = 0;
                $arrayelementosrelacionados[0]->origen = '';
                $arrayelementosrelacionados[0]->porcientoinicio = '';
                // inserto el ARC
                $objcmpgestionararcmodel = new CmpgestionararcModel();

                // array elementos relacionados
                $arrayelementosrelacionados = array();
                $arrayelementosrelacionados[0]->idplan = $parametros->idplan;
                $arrayelementosrelacionados[0]->idarc = '';
                $arrayelementosrelacionados[0]->idobjetivo = '';
                $arrayelementosrelacionados[0]->idfip = '';
                $arrayelementosrelacionados[0]->iddesviacion = '';
                $arrayelementosrelacionados[0]->idactividad = '';
                $arrayelementosrelacionados[0]->tipoelemento = 0;
                $arrayelementosrelacionados[0]->origen = '';
                $arrayelementosrelacionados[0]->porcientoinicio = '';



                if (in_array(trim($denominacion[0]), $arrayNumArc)) {// Es un ARC
                  $idarcp = null;
                  $eshija = 0;

                  $existe_arc=$objcmpgestionararcmodel->existeARCImport($denarc);
                  if($existe_arc>0){
                    $idarc = $existe_arc;
                    $tipo_anterior="ARC";
                    $IdArcPadre = $idarc;
                  }else{
                    $idarc = $objcmpgestionararcmodel->AdicionarArcImportar(
                      $idusuariocrea, $denarc, $descarc, $fechainicio, $fechafin, $arrayinvolucrados, $idarcp, $eshija, $arrayelementosrelacionados
                    );

                    $tipo_anterior="ARC";
                    $IdArcPadre = $idarc;

                    //se crea el objeto 'relacion' y se registra
                    if (isset($arrayelementosrelacionados[0])) {
                      $objclasificadorinvolmodel = new CmprelacionesModel();
                      $objclasificadorinvolmodel->RelacionarElementos(
                        $idarc, $idtipoelemento = 5, $arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $idusuariocrea
                      );
                    }
                  }

                }else if (!in_array(trim($denominacion[0]), $arrayNumArc)){
                  $idarcp = ($tipo_anterior=="ACT")?null:$IdArcPadre;
                  $eshija = 1;

                  $existe_arc=$objcmpgestionararcmodel->existeARCImport($denarc);
                  if($existe_arc>0){
                    $idarc = $existe_arc;
                    $tipo_anterior="ARC";
                    $IdArcHijo = $idarc;
                  }else{
                    $idarc = $objcmpgestionararcmodel->AdicionarArcImportar(
                      $idusuariocrea, $denarc, $descarc, $fechainicio, $fechafin, $arrayinvolucrados, $idarcp, $eshija, $arrayelementosrelacionados
                    );
                    $tipo_anterior="ARC";
                    $IdArcHijo = $idarc;

                    //se crea el objeto 'relacion' y se registra
                    if (isset($arrayelementosrelacionados[0])) {
                      $objclasificadorinvolmodel = new CmprelacionesModel();
                      $objclasificadorinvolmodel->RelacionarElementos(
                        $idarc, $idtipoelemento = 5, $arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $idusuariocrea
                      );
                    }
                  }

                }

              }else{ // Es una actividad

                $col=["H", "I", "J", "K", "L"];
                $insertar_act=false;

                $fecha_I=date('d/'.$parametros->idmes . '/' . $parametros->annoPlan);
                $fecha_F=date('d/'.$parametros->idmes . '/' . $parametros->annoPlan);
                $hora_inicio = '08:00';
                $hora_fin = '17:00';
                $lugar='';

                $array_dias_repeticion=array();

                foreach ($col as $c){
                    if($sheet->getCell($c.$row)->getValue()!=null && $sheet->getCell($c.$row)->getValue()!=''){
                      $insertar_act=true;

                      switch ($c){
                        case 'H':
                          $pos=strpos($sheet->getCell($c.$row)->getValue(), '-');
                          if($pos!==false){
                              $array_dias=explode('-', $sheet->getCell($c.$row)->getValue());
                              $fecha_I=date($array_dias[0].'/'.$parametros->idmes . '/' . $parametros->annoPlan);
                              $fecha_F=date($array_dias[1].'/'.$parametros->idmes . '/' . $parametros->annoPlan);
                            break;
                          }
                          $pos=strpos($sheet->getCell($c.$row)->getValue(), ',');
                          if($pos!==false){
                              $array_dias_repeticion=explode(',', $sheet->getCell($c.$row)->getValue());
                              $fecha_I=date($array_dias_repeticion[0].'/'.$parametros->idmes . '/' . $parametros->annoPlan);
                              $fecha_F=date($array_dias_repeticion[0].'/'.$parametros->idmes . '/' . $parametros->annoPlan);
                            break;
                          }

                          $fecha_I=date($sheet->getCell($c.$row)->getValue().'/'.$parametros->idmes . '/' . $parametros->annoPlan);
                          $fecha_F=date($sheet->getCell($c.$row)->getValue().'/'.$parametros->idmes . '/' . $parametros->annoPlan);

                          break;
                        case 'I':
                          $hora_inicio=$sheet->getCell($c.$row)->getValue();
                          break;
                        case 'J':
                          $hora_fin=$sheet->getCell($c.$row)->getValue();
                          break;
                        case 'K':
                          $lugar=$sheet->getCell($c.$row)->getValue();
                          break;
                      }

                    }
                }


                $repeticiones = array();

                foreach ($array_dias_repeticion as $r){
                    $stdRepeticion=new stdClass();
                    $stdRepeticion->fechainicio = date($r.'/'.$parametros->idmes . '/' . $parametros->annoPlan);
                    $stdRepeticion->fechafin = date($r.'/'.$parametros->idmes . '/' . $parametros->annoPlan);
                    $stdRepeticion->hora = $hora_inicio;
                    $stdRepeticion->horafin = $hora_fin;
                    $stdRepeticion->lugar = $lugar;
                    $stdRepeticion->tiporepeticion = 1;
                    $stdRepeticion->involucrados = array();
                    array_push($repeticiones, $stdRepeticion);

                }

                if (isset($repeticiones[0])) {
                  unset($repeticiones[0]);
                  $repeticiones = array_values($repeticiones);
                }

                if($insertar_act){
                  $tipo_anterior="ACT";
                  if (fmod($sheet->getCell("B".$row)->getValue(), 1) === 0.00) {
                    $k = explode('.', $sheet->getCell("B".$row)->getValue());
                    if (isset($arrayPadres[$k[0]])) {
                      $parametros->eshija = 1;
                      $parametros->idactividadpadre = $arrayPadres[$k[0]];
//                    $IdACTPadre = $parametros->idactividadpadre;

                    }else{
                      $parametros->eshija = 0;
                      $parametros->idactividadpadre = '';
                    }
                  }else{
                    $parametros->eshija = 0;
                    $parametros->idactividadpadre = '';
                  }


                  $denelemento = str_replace('ú', 'u', str_replace('ó', 'o', str_replace('í', 'i', str_replace('é', 'e', str_replace('á', 'a', $sheet->getCell("C".$row)->getValue())))));

                  $parametros->recursoasociado = Array();
                  $parametros->accion = '';
                  $parametros->documentos = Array();
                  $parametros->denelemento = str_replace("'", "", utf8_encode($denelemento));
                  $parametros->descelemento = '';
                  $parametros->gradocumplimiento = '0';
                  $parametros->fechainicio = $fecha_I;
                  $parametros->fechafin = $fecha_F;
                  $parametros->horainicio = $hora_inicio;
                  $parametros->horafin = $hora_fin;
                  $parametros->idtipo = null;
                  $parametros->idcategoria = null;
                  $parametros->lugar = $lugar;
                  $parametros->dirigentes = str_replace("'", "", utf8_encode($sheet->getCell("F".$row)->getValue()));
                  $parametros->participantes = str_replace("'", "", utf8_encode($sheet->getCell("G".$row)->getValue()));
                  $parametros->arrayrepeticiones = $repeticiones;
                  $parametros->idtipoelemento = 3;
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

                  //creo el array de elementos relacionados de la actividad
                  $relaciones = Array();

                  if($otras_actividades){
                    $relaciones[0]->idplan = $parametros->idplan;
                    $relaciones[0]->idarc = '';
                    $relaciones[0]->idobjetivo = null;
                    $relaciones[0]->idfip = null;
                    $relaciones[0]->iddesviacion = null;
                    $relaciones[0]->idactividad = null;
                    $relaciones[0]->tipoelemento = 0;
                    $relaciones[0]->origen = null;
                    $relaciones[0]->porcientoinicio = null;
                  }else{
                    $relaciones[0]->idplan = $parametros->idplan;
                    $relaciones[0]->idarc = $IdArcHijo;
                    $relaciones[0]->idobjetivo = null;
                    $relaciones[0]->idfip = null;
                    $relaciones[0]->iddesviacion = null;
                    $relaciones[0]->idactividad = null;
                    $relaciones[0]->tipoelemento = 50;
                    $relaciones[0]->origen = null;
                    $relaciones[0]->porcientoinicio = null;
                  }

                  $parametros->arrayelementosrelacionados = $relaciones;

                  $result = $obj->AdicionarActividadImportar($parametros);

                  //se crea el objeto 'relacion' y se registra
                  if ($otras_actividades && isset($arrayelementosrelacionados[0])) {
                    $objclasificadorinvolmodel = new CmprelacionesModel();
                    $objclasificadorinvolmodel->RelacionarElementos(
                      $result, $idtipoelemento = 3, $parametros->arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
                    );
                  }

                 // print_r($parametros);die;

                  if (fmod($sheet->getCell("B".$row)->getValue(), 1) === 0.00) {
                    $arrayPadres[$sheet->getCell("B".$row)->getValue()] = $result;
                  }
                }
              }
            }

        }

        $html = implode(',', $arraytotalerrores);
        echo Zend_Json_Encoder::encode(array('mensaje' => 1, 'arrayErrores' => $arraytotalerrores, 'html' => $html)); // mensaje de success
        } catch (Exception $e) {
          echo json_encode(array('mensaje' => 2, 'msgText' => $e->getMessage())); // mensaje de error
        }


    }else{
      echo json_encode(array('mensaje' => 3, 'msgText' => "Error archivo con extensión incorrecta")); // mensaje de error
    }







  }


  public function ordenarArrayFechas(&$arrayfechas)
    {
        foreach ($arrayfechas as $fechas) {
            $fecha = str_replace('/', '-', $fechas->fechainicio);
            $fechas->fechainicio = $fecha;
        }

        usort($arrayfechas, function ($a1, $a2) {
            $v1 = strtotime($a1->fechainicio);
            $v2 = strtotime($a2->fechainicio);
            return ($v1 < $v2) ? -1 : 1;
        });
        return $arrayfechas;
    }

    /**
     * Accion para adicionar los planes
     */
    function TrasladarplanAction()
    {
        $idusuariosession = $this->global->Perfil->idusuario;
        $obj = new CmpgestionarplanModel();

        $estado_inicial=$obj->EstadoPorDefecto($idusuariosession, 0);

        $datos = json_decode(stripslashes($this->_request->getPost('datos')))[0];


        $datos->estado=$estado_inicial[0]['idestado'];

        $resultado = $obj->TrasladarPlan($idusuariosession, $datos);
        $msg = 'Ha ocurrido un error en el servidor.';
        if ($resultado == 1)
            $msg = 'El plan ha sido trasladado satisfactoriamente.';
        echo json_encode(array('mensaje' => $resultado, 'msgText' => $msg));
    }



  /***
     * Cargar estados
     **/

    function cargarestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idusuariosession, $idtipodoc = 0
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    function validar_fecha_espanol($fecha)
    {
        $valores = explode('/', $fecha);
        if (count($valores) == 3 && checkdate($valores[1], $valores[0], $valores[2])) {
            return true;
        }
        return false;
    }

}
