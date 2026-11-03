<?php

/**
 * Controlador para gestionar actividades
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionaractividadesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
        $this->setearIncludePath();
    }

    public function setearIncludePath()
    {
        $dir = split("apps/", __FILE__);
        //apps/planificacion/pdo/plan
        $marco = strstr(__FILE__, "opt/");
        $dir_abs_mt = ($marco) ? $dir[0] . 'apps/' . $dir[1] : $dir[0];
        $include_path =
            PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain' . DIRECTORY_SEPARATOR . 'generated'
            . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain'
            . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'bussines';
        set_include_path(get_include_path() . $include_path);
    }

    /**
     * Accion para mostrar la vista gestionaractividades.phtml
     */
    function cmpgestionaractividadesAction()
    {
        try {
            $usargd = false; //$this->pIntegrator->planpdo->verificarGestorDoc();  
        } catch (Exception $e) {
            $usargd = false;
        }
        if ($usargd) {
            try {
                $this->view->gestdoc = $this->integrator->gestordocumental->devolverJSContenido();
                $this->view->usarGD = '<script> var usarGD = true; </script>';
            } catch (Exception $e) {
                $this->view->usarGD = '<script> var usarGD = false; </script>';
                $this->view->gestdoc = '';
            }
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }
        $this->render();
    }
    /**
     * Accion para cargar las actividades en el grid
     */
    function cargaractividades_oldAction()
    {
        $idactividad = $this->_request->getPost('anode');
        //$eshija = $this->_request->getPost('eshija');
        $parametros->repeticiones = $this->_request->getPost(
            'incluirrepeticiones'
        );
        $parametros->reasignaciones = $this->_request->getPost(
            'incluireasignaciones'
        );
        $parametros->sort = $this->_request->getPost('sort');
        $parametros->dir = $this->_request->getPost('dir');
        $filtros = $this->_request->getPost('filtros');
        $idtipoelemento = $this->_request->getPost('idtipoelem');
        $parametros->reorganizar = json_decode(
            stripslashes($this->_request->getPost('actividadesreorganizar'))
        );
        $idusuario = $this->global->Perfil->idusuario;
        //$iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        //$certificado = $session->certificado;
        $idelementotributa = $this->_request->getPost('idelementotributa');
        $parametros->idelementoafiltrar = $this->_request->getPost(
            'idelementoafiltrar'
        );
        $parametros->dependenciaTotal = $this->_request->getPost(
            'dependenciaTotal'
        );
        $parametros->dependenciaPorcentual = $this->_request->getPost(
            'dependenciaPorcentual'
        );
        $parametros->dependenciaPuertaAbierta = $this->_request->getPost(
            'dependenciaPuertaAbierta'
        );
        $enaprobacion = $this->_request->getPost('enaprobacion');
        $idtipoelementotributa = $this->_request->getPost(
            'idtipoelementotributa'
        );
        $idtipoelementotributasuperior = $this->_request->getPost(
            'idtipoelementotributasuperior'
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
        $categact = $this->_request->getPost('categact');
        $tipoact = $this->_request->getPost('tipoact');
        $objactividadmodel = new CmpgestionaractividadesModel();
        $arrayactividades = $objactividadmodel->CargarActividades(
            $idactividad, $idusuario, $idelementotributa, $enaprobacion, $arrayautores, $arrayinvolucrados, $categact, $tipoact, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $busqueda, $arrayelementosrelacionados, $filtros, $parametros, $idtipoelemento
        );
        if (isset($arrayactividades['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $arrayactividades['total'],
                    'campos' => $arrayactividades['resultado'])
            );
        }
        if (!isset($arrayactividades)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    /*     * **Cargar actividades optimizado*** */

    function cargaractividadesAction()
    {
        $parametros=new stdClass();
        $parametros->idactividad = $this->_request->getPost('anode');
        $parametros->repeticiones = $this->_request->getPost(
            'incluirrepeticiones'
        );
        $parametros->reasignaciones = $this->_request->getPost(
            'incluireasignaciones'
        );
        $parametros->bienestar = $this->_request->getPost(
            'bienestar'
        );
        $parametros->sort = $this->_request->getPost('sort');
        $parametros->dir = $this->_request->getPost('dir');
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->idtipoelemento = $this->_request->getPost('idtipoelem');
        $parametros->idusuario = $this->global->Perfil->idusuario;

        $parametros->idelementotributa = $this->_request->getPost(
            'idelementotributa'
        );
        $parametros->reorganizar = json_decode(
            stripslashes($this->_request->getPost('actividadesreorganizar'))
        );
        $parametros->dependenciaTotal = $this->_request->getPost(
            'dependenciaTotal'
        );
        $parametros->dependenciaPorcentual = $this->_request->getPost(
            'dependenciaPorcentual'
        );
        $parametros->dependenciaPuertaAbierta = $this->_request->getPost(
            'dependenciaPuertaAbierta'
        );
        $parametros->idelementoafiltrar = $this->_request->getPost(
            'idelementoafiltrar'
        );
        $parametros->enaprobacion = $this->_request->getPost('enaprobacion');
        $parametros->idtipoelementotributa = $this->_request->getPost(
            'idtipoelementotributa'
        );
        $parametros->idtipoelementotributasuperior = $this->_request->getPost(
            'idtipoelementotributasuperior'
        );
        $parametros->busqueda = $this->_request->getPost('busqueda');
        $parametros->start = $this->_request->getPost('start');
        $parametros->limit = $this->_request->getPost('limit');
        $parametros->arrayautores = json_decode(
            stripslashes($this->_request->getPost('arrayautores'))
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        $parametros->categact = $this->_request->getPost('categact');
        $parametros->tipoact = $this->_request->getPost('tipoact');
        $parametros->opciontributar = $this->_request->getPost('opciontributar');
        $objactmodel = new CmpgestionaractividadesModel();
        $arrayactividades = $objactmodel->CargarActividades($parametros);
        if (isset($arrayactividades['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $arrayactividades['total'],
                    'campos' => $arrayactividades['resultado'])
            );
        }
        if (!isset($arrayactividades)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    /**
     * Accion para adicionar las actividades
     */
    function SuspenderActividadAction()
    {
      ini_set("max_execution_time", 3600);
      $parametros->idusuariocrea = $this->global->Perfil->idusuario;
      $parametros->idpersona = $this->global->Perfil->idpersona;
      $parametros->accion='Suspender';
      $parametros->idrecursoasociado=[];
      $parametros->arrayinvolucrados=[];
      $parametros->arrayrepeticiones=[];
      $parametros->arrayelementosrelacionados=[];


      $objgestionarpuntualizacionmodel
        = new CmpgestionarpuntualizacionModel();

      $arrayidactividades = json_decode(stripslashes($this->_request->getPost('idsactividades')));

      foreach ($arrayidactividades as $idelemento) {
        //***historial***
        $obj_elemento = Doctrine::getTable('DatElementos')->find(
          $idelemento
        );

        $obj_actividad = Doctrine::getTable('DatActividades')->find(
          $idelemento
        );

        $ElementoNomenclador=new DatElementosNomNomenclador();
        $idcategoria=$ElementoNomenclador->GetIdNomencladorDatoIdelemento($idelemento, 2);
        $idtipo=$ElementoNomenclador->GetIdNomencladorDatoIdelemento($idelemento, 3);

        $parametros->denelemento = $obj_elemento->denelemento;
        $parametros->denelemento = str_ireplace('"', "'", $parametros->denelemento);
        $parametros->gradocumplimiento = $obj_elemento->gradocumplimiento;
        $parametros->fechainicio = $obj_actividad->fechainicio;
        $parametros->fechafin = $obj_actividad->fechafin;
        $parametros->horainicio = $obj_actividad->horainicio;
        $parametros->horafin = $obj_actividad->horafin;
        $parametros->lugar = $obj_actividad->lugar;
        $parametros->idcategoria = $idcategoria;
        $parametros->idtipo = $idtipo;
        $parametros->idtipoelemento=7;
        $parametros->eshija=1;
        $parametros->idactividadpadre=$obj_actividad->idactividad;
        $parametros->duplicando=0;
        $parametros->principal=$obj_actividad->esprincipal;
        $parametros->porcientoRe=0;
        $parametros->duracion=$obj_actividad->duracion;
        $parametros->peso=$obj_elemento->peso;
        $parametros->dirigentes=$obj_elemento->dirigente;
        $parametros->tiempoestimado=$obj_actividad->tiempoestimado;
        $parametros->descelemento=$obj_elemento->descelemento;
        $parametros->idelemento_suspender=$idelemento;
        $respuesta= $objgestionarpuntualizacionmodel->adicionarPuntualizacion($parametros);
      }
      echo json_encode(array('mensaje' => $respuesta));
    }

  /**
   * Accion para enviar correo
   */
  function enviarCorreoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros = new stdClass();
    $parametros->arrayidactividades = json_decode(
      stripslashes($this->_request->getPost('arrayidactividades'))
    );
    $parametros->idusuariocrea = $this->global->Perfil->idusuario;
    $parametros->idpersona = $this->global->Perfil->idpersona;

    $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
    $respuesta=0;
    try {
      //Envio de notificacion por email
        $parametros->emails = array();
        $parametros->body = '';
        $parametros->body .= '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
        . "Estado de la(s) siguiente(s) actividades: <br><br>";
        foreach ($parametros->arrayidactividades as $pos => $idactividad){
          $parametros->body .= ($pos==0)?'':
                             '----------------------------------------------------------------<br><br>';
          $objelemento = Doctrine::getTable('DatElementos')->find(
            $idactividad
          );

          $objactividad = Doctrine::getTable('DatActividades')->find(
            $idactividad
          );

          $parametros->idelemento = $objelemento->idelemento;
//          $parametros->denelemento = $objelemento->denelemento;
          $parametros->denelemento = utf8_decode($objelemento->denelemento);
          $parametros->descelemento = utf8_decode($objelemento->descelemento);
          $parametros->dirigente = $objelemento->dirigente;
          $parametros->gradocumplimiento = $objelemento->gradocumplimiento;
          $parametros->participante = $objelemento->participante;

          $parametros->fechainicio = $objactividad->fechainicio;
          $parametros->fechafin = $objactividad->fechafin;
          $parametros->horainicio = $objactividad->horainicio;
          $parametros->horafin = $objactividad->horafin;
          $parametros->lugar = utf8_decode($objactividad->lugar);

          $arrayidpersona
                     = $this->integrator->seguridad->getIdPersonaByIdUsuario(
            $objelemento->idusuariocrea
          );
          $idpersona = $arrayidpersona[0]['idpersona'];

          $datosautor
            = $this->integrator->pvd->getPrincipalesDatosPersona(
            $params[] = $idpersona
          );
          if (isset($datosautor->data[0])) {
            $autor
              = utf8_decode($datosautor->data[0]['nombreapellidos']);
          } else {
            $usuarioautor
                   = $this->integrator->seguridad->nombreUsuario(
              $parametros->idusuariocrea
            );
            $autor = $usuarioautor;
          }

          $arrayestadosaprob = $this->pIntegrator->workflow->DenomEstado(
            $objelemento->idestadoaprob
          );
          $nombreestadoapro='';
          if (isset($arrayestadosaprob[0])) {
            $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
          }

          $parametros->body .= '<b>CAR: </b>' . $parametros->idelemento . '<br>
                                <b>Denominaci&oacute;n: </b>'
            . $parametros->denelemento . '<br>
                                <b>Estado de Aprobaci&oacute;n: </b>'
            . $nombreestadoapro . '<br>
                                <b>Descripci&oacute;n: </b>'
            . $parametros->descelemento . '<br>
                                <b>Fecha de inicio: </b>'
            . $parametros->fechainicio . '<br>
                                <b>Fecha de fin: </b>' . $parametros->fechafin . '<br>
                                <b>Hora de inicio: </b>'
            . $parametros->horainicio . '<br>
                                <b>Hora de fin: </b>' . $parametros->horafin . '<br>
                                <b>Lugar: </b>' . $parametros->lugar . '<br>
                                <b>Autor: </b>' . $autor . '<br><br>';



          $emailinvolucrados = array();
          $arrayInvolucrados
                             = DatElementosDatInvolucrados::datosRelacionElemInvolColumn(
            $idactividad
          );
          $arrayInvolucrados[]=$objelemento->idusuariocrea;
          if (isset($arrayInvolucrados[0])) {
            $idpersonas
              = $this->integrator->seguridad->getArrayIdPersonaByArrayUsers(
              $arrayInvolucrados
            );
            if (isset($idpersonas[0])) {
              foreach ($idpersonas as $persona) {
                $datoscontacto
                  = $this->integrator->pvd->obtenerDatosdePersonaparaJabber(
                  $persona['idpersona']
                );
                if (isset($datoscontacto['correoelectronico']) && $datoscontacto['correoelectronico'] != ''
                ) {
                  $emailinvolucrados[]
                    = $datoscontacto['correoelectronico'];
                }
              }
            }
          }

          $parametros->idelemento = $parametros->idactividad;
          $emailparticipantes = self::extract_email_address(
            $objelemento->participante
          );
          $emaildirigentes = self::extract_email_address($objelemento->dirigente);
          $parametros->emails = array_merge(
            $parametros->emails, $emailparticipantes, $emaildirigentes, $emailinvolucrados
          );

          $respuesta++;
        }
        $parametros->asunto = "Estado de las actividades";
        $parametros->body .= " <br><i>No responder este correo. Enviado desde el Sistema de Distra-Planificaci&oacute;n.</i></p>";

        $envio=$objcmpgestionaractividadesmodel->enviarCorreo($parametros);

        if($envio[0] == 0){
            $respuesta = -1;
            $error = $envio[2];
        }else{
            $respuesta = 1;
            $error = $envio[2];
        }

        if($envio[1] > 0){
            $notice = 'Algunos usuarios no recibieron la notificaci&oacute;n porque no tienen un correo v&aacute;lido configurado.';
        }else{
            $notice = 'Todos los usuarios fueron notificados satisfactoriamente.';

        }
        echo json_encode(array('mensaje' => $respuesta, 'notice' => $notice, 'error' => $error));
    }
    catch (Exception $e) {
//      print_r($e->getMessage());die;
        $respuesta = '-1';
        $notice = $e->getMessage();
        echo json_encode(array('mensaje' => $respuesta, 'notice' => $notice, 'error' => $error));
    }
        
      
//        if(!$envio)
//          $respuesta = -1;
//      }
//    catch (Exception $e) {
////      print_r($e->getMessage());die;
//        $respuesta=-1;
//      }
//    echo json_encode(array('mensaje' => $respuesta));
  }


    /**
     * Accion para actualizar parametors de las actividades
     */
    function actualizarParametrosAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      try {
        $parametros = new stdClass();
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idpersona = $this->global->Perfil->idpersona;
        $parametros->idrecursoasociado = json_decode(stripslashes($this->_request->getPost('asociados')));
        $parametros->fechainicio = $this->_request->getPost('f_inicio_actParams');
        $parametros->fechafin = $this->_request->getPost('f_fin_actParams');
        $parametros->horainicio = $this->_request->getPost('h_inicio');
        $parametros->horafin = $this->_request->getPost('h_fin');
        $parametros->idtipo = $this->_request->getPost('idtipo');
        $parametros->principal = $this->_request->getPost('principal');
        $parametros->idcategoria = $this->_request->getPost('idcategoria');
        $parametros->idcategoria = $this->_request->getPost('idcategoria');
        $parametros->denomtipo = $this->_request->getPost('denomtipo');
        $parametros->denomcategoria = $this->_request->getPost('denomcategoria');
        $parametros->arrayidactividades = json_decode(
          stripslashes($this->_request->getPost('arrayidactividades'))
        );

        $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
        $respuesta=$objcmpgestionaractividadesmodel->actualizarParametros($parametros);

      }catch (Exception $exc) {
        $respuesta=0;
      }

      echo json_encode(array('mensaje' => $respuesta));
    }

    /**
       * Accion para adicionar las actividades
       */

    function adicionaractividad_originalAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idpersona = $this->global->Perfil->idpersona;
        $parametros->idrecursoasociado = json_decode(stripslashes($this->_request->getPost('asociados')));
        $parametros->accion = $this->_request->getPost('accion');
        $parametros->documentos = json_decode(stripslashes($this->_request->getPost('documentos')));
        $parametros->denelemento = $this->_request->getPost('denominactividad');
        $parametros->denelemento = str_ireplace('"', "'", $parametros->denelemento);
        $parametros->descelemento = $this->_request->getPost('hedescripcionact');
        if ($this->_request->getPost('porcientocumpact') == "") {
            $parametros->gradocumplimiento = 0;
        } else {
            $parametros->gradocumplimiento
                = $this->_request->getPost('porcientocumpact') * 1;
        }
        $parametros->fechainicio = $this->_request->getPost('finiact');
        $parametros->fechafin = $this->_request->getPost('ffinact');
        $parametros->horainicio = $this->_request->getPost('tmfhoraact');
        $parametros->horafin = $this->_request->getPost('tmfhorafinact');
        $parametros->idtipo = $this->_request->getPost('idtipo');
        $parametros->idcategoria = $this->_request->getPost('idcategoria');
        $parametros->lugar = $this->_request->getPost('tflugaract');
        $parametros->dirigentes = $this->_request->getPost('hedirigentesact');
        $parametros->participantes = $this->_request->getPost(
            'heparticipantesact'
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayrepeticiones = json_decode(
            stripslashes($this->_request->getPost('arrayrepeticiones'))
        );
        $parametros->arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        //$parametros->idtipoelemento = 3;
        $parametros->idtipoelemento = $this->_request->getPost(
            'idtipoelemento'
        );
        $parametros->eshija = $this->_request->getPost('eshija');
        $parametros->idactividadpadre = $this->_request->getPost(
            'idactividadpadre'
        );
        $parametros->principal = $this->_request->getPost('principal');
        $parametros->duplicando = $this->_request->getPost('duplicando');
        $parametros->autoManual = $this->_request->getPost('auto_manual');
        $parametros->porcientoRe = $this->_request->getPost('porciento_re');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->tiempoestimado = $this->_request->getPost(
            'tiempoestimadoact'
        );
        $parametros->criterioeval = $this->_request->getPost('criterioeval');
        $parametros->denomtipo = $this->_request->getPost('denomtipo');
        $parametros->denomcategoria = $this->_request->getPost(
            'denomcategoria'
        );
        $parametros->duracion = $this->_request->getPost(
            'duracion'
        );
        $parametros->idsubsistema = $this->_request->getPost(
            'idsubsistema'
        );
        $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
        if ($parametros->idtipoelemento == 7) {
            $objgestionarpuntualizacionmodel
                = new CmpgestionarpuntualizacionModel();
            $respuesta
                = $objgestionarpuntualizacionmodel->adicionarPuntualizacion(
                $parametros
            );
        } else {
            $respuesta = $objcmpgestionaractividadesmodel->AdicionarActividad(
                $parametros
            );
        }
        echo json_encode(array('mensaje' => $respuesta));
    }


  /**
   * Accion para adicionar las actividades sin recargar listado de actividades
   */

  function adicionaractividadAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros->idusuariocrea = $this->global->Perfil->idusuario;
    $parametros->idpersona = $this->global->Perfil->idpersona;

    $parametros->idrecursoasociado = json_decode(stripslashes($this->_request->getPost('asociados')));
    $parametros->accion = $this->_request->getPost('accion');
    $parametros->documentos = json_decode(stripslashes($this->_request->getPost('documentos')));
    $parametros->denelemento = $this->_request->getPost('denominactividad');
    $parametros->denelemento = str_ireplace('"', "'", $parametros->denelemento);
    $parametros->descelemento = $this->_request->getPost('hedescripcionact');
    if ($this->_request->getPost('porcientocumpact') == "") {
      $parametros->gradocumplimiento = 0;
    } else {
      $parametros->gradocumplimiento
        = $this->_request->getPost('porcientocumpact') * 1;
    }
    $parametros->fechainicio = $this->_request->getPost('finiact');
    $parametros->fechafin = $this->_request->getPost('ffinact');
    $parametros->horainicio = $this->_request->getPost('tmfhoraact');
    $parametros->horafin = $this->_request->getPost('tmfhorafinact');
    $parametros->idtipo = $this->_request->getPost('idtipo');
    $parametros->idcategoria = $this->_request->getPost('idcategoria');
    $parametros->lugar = $this->_request->getPost('tflugaract');
    $parametros->dirigentes = $this->_request->getPost('hedirigentesact');
    $parametros->participantes = $this->_request->getPost('heparticipantesact');
    $parametros->arrayinvolucrados = json_decode(
      stripslashes($this->_request->getPost('arrayinvolucrados'))
    );
    $parametros->arrayrepeticiones = json_decode(
      stripslashes($this->_request->getPost('arrayrepeticiones'))
    );
    $parametros->arrayelementosrelacionados = json_decode(
      stripslashes($this->_request->getPost('arrayelementosrelacionados'))
    );
    //$parametros->idtipoelemento = 3;
    $parametros->idtipoelemento = $this->_request->getPost(
      'idtipoelemento'
    );
    $parametros->eshija = $this->_request->getPost('eshija');
    $parametros->idactividadpadre = $this->_request->getPost(
      'idactividadpadre'
    );
    $parametros->principal = $this->_request->getPost('principal');
    $parametros->duplicando = $this->_request->getPost('duplicando');
    $parametros->autoManual = $this->_request->getPost('auto_manual');
    $parametros->porcientoRe = $this->_request->getPost('porciento_re');
    $parametros->peso = $this->_request->getPost('peso');
    $parametros->tiempoestimado = $this->_request->getPost(
      'tiempoestimadoact'
    );
    $parametros->criterioeval = $this->_request->getPost('criterioeval');
    $parametros->denomtipo = $this->_request->getPost('denomtipo');
    $parametros->denomcategoria = $this->_request->getPost(
      'denomcategoria'
    );
    $parametros->duracion = $this->_request->getPost(
      'duracion'
    );
    $parametros->idsubsistema = $this->_request->getPost(
      'idsubsistema'
    );

    $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();

    if ($parametros->idtipoelemento == 7) {

      $objgestionarpuntualizacionmodel
        = new CmpgestionarpuntualizacionModel();
      $respuesta
        = $objgestionarpuntualizacionmodel->adicionarPuntualizacion(
        $parametros
      );

      $resultado=array('mensaje' => $respuesta, 'tipoactividad' => 2);

    } else {
      $respuesta = $objcmpgestionaractividadesmodel->AdicionarActividad(
        $parametros
      );
      $resultado=array('mensaje' => $respuesta->mensaje,
                       'tipoactividad' => 1,
                       'actividad'=>$respuesta->actividad,
                       'parametros'=>$respuesta->parametros);
    }
    echo json_encode($resultado);
  }

    function compactualactividadAction($parametros)
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idhistorial = $this->_request->getPost('idpadre');
        $parametros->punt = $this->_request->getPost('puntualizacion');
        $model = new CmphistorialModel();
        $actual = $model->comActualActividad($parametros);
        if (isset($parametros->punt)) {
            $parametros->idelemento = $this->_request->getPost('idhistorial');
            $seleccionada = $model->comActualActividad($parametros);
        } else {
            $seleccionada = $model->seleccionada($parametros);
        }

        echo json_encode(
            array('seleccionada' => $seleccionada, 'actual' => $actual[0])
        );
    }

    /**
     * Accion para modificar las actividades
     */
    function modificaractividadAction_original()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idpersona = $this->global->Perfil->idpersona;
        $parametros->punt = $this->_request->getPost('puntualizar');
        if (isset($parametros->punt)) {
            $arrayidactividades = json_decode(
                stripslashes($this->_request->getPost('arrayidactividades'))
            );
            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $respuesta
                = $objcmpgestionaractividadesmodel->AprobarPuntualizacion(
                $arrayidactividades[0]->punt, $arrayidactividades[0]->idelemento
            );
        } else {
            $parametros->idrecursoasociado = json_decode(
                stripslashes($this->_request->getPost('asociados'))
            );
            $parametros->idactividad = $this->_request->getPost('idactividad');
            $parametros->documentos = json_decode(
                stripslashes($this->_request->getPost('documentos'))
            );
            //$parametros->denelemento = json_decode(stripslashes($this->_request->getPost('denominactividad')));
            $parametros->denelemento = $this->_request->getPost('denominactividad');
            $parametros->denelemento = str_ireplace('"', "'", $parametros->denelemento);
            $parametros->arrayelementosrelacionados = json_decode(
                stripslashes(
                    $this->_request->getPost('arrayelementosrelacionados')
                )
            );
            $parametros->descelemento = $this->_request->getPost(
                'hedescripcionact'
            );
            if ($this->_request->getPost('porcientocumpact') == "") {
                $parametros->gradocumplimiento = 0;
            } else {
                $parametros->gradocumplimiento
                    = $this->_request->getPost('porcientocumpact') * 1;
            }
            $parametros->fechainicio = $this->_request->getPost('finiact');
            $parametros->fechafin = $this->_request->getPost('ffinact');
            $parametros->horainicio = $this->_request->getPost('tmfhoraact');
            $parametros->horafin = $this->_request->getPost('tmfhorafinact');
            $parametros->idtipo = $this->_request->getPost('idtipo');
            $parametros->idcategoria = $this->_request->getPost('idcategoria');
            $parametros->lugar = $this->_request->getPost('tflugaract');
            $parametros->dirigentes = $this->_request->getPost(
                'hedirigentesact'
            );
            $parametros->participantes = $this->_request->getPost(
                'heparticipantesact'
            );
            $parametros->arrayinvolucrados = json_decode(
                stripslashes($this->_request->getPost('arrayinvolucrados'))
            );
            $parametros->arrayinvolucradoseliminar = json_decode(
                stripslashes(
                    $this->_request->getPost('arrayinvolucradoseliminar')
                )
            );
            $parametros->eshija = $this->_request->getPost('eshija');
            $parametros->idtipoelemento = 3;
            $parametros->principal = $this->_request->getPost('principal');
            $parametros->efectocadena = $this->_request->getPost(
                'efectocadena'
            );
            $parametros->porcientoRe = $this->_request->getPost('porciento_re');
            $parametros->autoManual = $this->_request->getPost('auto_manual');
            $parametros->actividadpadre = $this->_request->getPost(
                'actividadpadre'
            );
            $parametros->tiempoestimado = $this->_request->getPost(
                'tiempoestimadoact'
            );
            $parametros->criterioevaluacion = $this->_request->getPost(
                'criterioeval'
            );
            $parametros->peso = ($this->_request->getPost('peso') != '') ? $this->_request->getPost('peso') : 0;
            $parametros->denomtipo = $this->_request->getPost('denomtipo');
            $parametros->denomcategoria = $this->_request->getPost(
                'denomcategoria'
            );
            $parametros->duracion = $this->_request->getPost(
                'duracion'
            );
            $parametros->idsubsistema = $this->_request->getPost(
                'idsubsistema'
            );
            if ($parametros->actividadpadre) {
                $actualizarporciento = DatElementos::getAuto_manualPadre(
                    $parametros->actividadpadre
                );
                $parametros->autoManualPadre
                    = $actualizarporciento[0]['actualizarporciento'];
            }
            //Verificar permisos para modificar
            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $objelemento = Doctrine::getTable('DatElementos')->find(
                $parametros->idactividad
            );
            if (isset($objelemento->idelemento)) {
                $idautoractividad = $objelemento->idusuariocrea;
                $idusuariosession = $this->global->Perfil->idusuario;
                $parametros->idautoractividad = $idautoractividad;
                $parametros->idusuariosession = $idusuariosession;
                $permisos = $objcmpgestionaractividadesmodel->comprobarPermisos(
                    $parametros
                );
                if ($permisos['modificar'] == 0) {
                    $respuesta->mensaje = 6;
                } else {
                    $respuesta
                        = $objcmpgestionaractividadesmodel->ModificarActividad(
                        $parametros
                    );
                }
            } else {
                $respuesta->mensaje = 3;
            }
        }
        echo json_encode(
            array('mensaje' => $respuesta->mensaje,
                'padre_raiz' => $respuesta->padreRaiz)
        );
    }

    /**
     * Accion para modificar las actividades
     */
    function modificaractividadAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros->idusuariocrea = $this->global->Perfil->idusuario;
    $parametros->idpersona = $this->global->Perfil->idpersona;
    $parametros->punt = $this->_request->getPost('puntualizar');
    if (isset($parametros->punt)) {
      $arrayidactividades = json_decode(
        stripslashes($this->_request->getPost('arrayidactividades'))
      );
      $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
      $respuesta
        = $objcmpgestionaractividadesmodel->AprobarPuntualizacion(
        $arrayidactividades[0]->punt, $arrayidactividades[0]->idelemento
      );
    } else {
      $parametros->idrecursoasociado = json_decode(
        stripslashes($this->_request->getPost('asociados'))
      );
      $parametros->idactividad = $this->_request->getPost('idactividad');
      $parametros->documentos = json_decode(
        stripslashes($this->_request->getPost('documentos'))
      );
      //$parametros->denelemento = json_decode(stripslashes($this->_request->getPost('denominactividad')));
      $parametros->denelemento = $this->_request->getPost('denominactividad');
      $parametros->denelemento = str_ireplace('"', "'", $parametros->denelemento);
      $parametros->arrayelementosrelacionados = json_decode(
        stripslashes(
          $this->_request->getPost('arrayelementosrelacionados')
        )
      );
      $parametros->descelemento = $this->_request->getPost(
        'hedescripcionact'
      );

      $parametros->act_bienestar = $this->_request->getPost('act_bienestar');

      if ($this->_request->getPost('porcientocumpact') == "") {
        $parametros->gradocumplimiento = 0;
      } else {
        $parametros->gradocumplimiento
          = $this->_request->getPost('porcientocumpact') * 1;
      }

      $parametros->fechainicio = $this->_request->getPost('finiact');
      $parametros->fechafin = $this->_request->getPost('ffinact');
      $parametros->horainicio = $this->_request->getPost('tmfhoraact');
      $parametros->horafin = $this->_request->getPost('tmfhorafinact');
      $parametros->idtipo = $this->_request->getPost('idtipo');
      $parametros->idcategoria = $this->_request->getPost('idcategoria');
      $parametros->lugar = $this->_request->getPost('tflugaract');
      $parametros->dirigentes = $this->_request->getPost(
        'hedirigentesact'
      );
      $parametros->participantes = $this->_request->getPost(
        'heparticipantesact'
      );
      $parametros->arrayinvolucrados = json_decode(
        stripslashes($this->_request->getPost('arrayinvolucrados'))
      );
      $parametros->arrayinvolucradoseliminar = json_decode(
        stripslashes(
          $this->_request->getPost('arrayinvolucradoseliminar')
        )
      );
      $parametros->eshija = $this->_request->getPost('eshija');
      $parametros->idtipoelemento = 3;
      $parametros->principal = $this->_request->getPost('principal');
      $parametros->efectocadena = $this->_request->getPost(
        'efectocadena'
      );
      $parametros->porcientoRe = $this->_request->getPost('porciento_re');
      $parametros->autoManual = $this->_request->getPost('auto_manual');
      $parametros->actividadpadre = $this->_request->getPost(
        'actividadpadre'
      );
      $parametros->tiempoestimado = $this->_request->getPost(
        'tiempoestimadoact'
      );
      $parametros->criterioevaluacion = $this->_request->getPost(
        'criterioeval'
      );
      $parametros->peso = ($this->_request->getPost('peso') != '') ? $this->_request->getPost('peso') : 0;
      $parametros->denomtipo = $this->_request->getPost('denomtipo');
      $parametros->denomcategoria = $this->_request->getPost(
        'denomcategoria'
      );
      $parametros->duracion = $this->_request->getPost(
        'duracion'
      );
      $parametros->idsubsistema = $this->_request->getPost(
        'idsubsistema'
      );
      if ($parametros->actividadpadre) {
        $actualizarporciento = DatElementos::getAuto_manualPadre(
          $parametros->actividadpadre
        );
        $parametros->autoManualPadre
                             = $actualizarporciento[0]['actualizarporciento'];
      }
      //Verificar permisos para modificar
      $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
      $objelemento = Doctrine::getTable('DatElementos')->find(
        $parametros->idactividad
      );
      if (isset($objelemento->idelemento)) {
        $idautoractividad = $objelemento->idusuariocrea;
        $idusuariosession = $this->global->Perfil->idusuario;
        $parametros->idautoractividad = $idautoractividad;
        $parametros->idusuariosession = $idusuariosession;
        $permisos = $objcmpgestionaractividadesmodel->comprobarPermisos(
          $parametros
        );
        if ($permisos['modificar'] == 0) {
          $respuesta->mensaje = 6;
        } else {
          $respuesta
            = $objcmpgestionaractividadesmodel->ModificarActividad(
            $parametros
          );
        }
      } else {
        $respuesta->mensaje = 3;
      }
    }

    echo json_encode(
      array('mensaje' => $respuesta->mensaje,
            'tipoactividad' => 1,
            'actividad'=>$respuesta->actividad,
            'parametros'=>$respuesta->parametros,
            'padre_raiz' => $respuesta->padreRaiz)
    );
  }

    /**
     * Accion para modificar el horario de la actividad
     */
    function modificarhorarioactividadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idactividad = $this->_request->getPost('idactividad');
        $fechahorainicio = $this->_request->getPost('horainicio');
        $fechainicio = explode(' ', $fechahorainicio);
        $horainicio = explode(':', $fechainicio[1]);
        if ($fechainicio[2] == 'am') {
            $fechainicio[2] = 'AM';
        }
        if ($fechainicio[2] == 'pm') {
            $fechainicio[2] = 'PM';
        }
        $hora = $this->ObtenerHoraNoMilitar($horainicio[0]);
        $horainicio = $hora . ':' . $horainicio[1] . ' ' . $fechainicio[2];
        $fechahorafin = $this->_request->getPost('horafin');
        $fechafin = explode(' ', $fechahorafin);
        $horafin = explode(':', $fechafin[1]);
        if ($fechafin[2] == 'am') {
            $fechafin[2] = 'AM';
        }
        if ($fechafin[2] == 'pm') {
            $fechafin[2] = 'PM';
        }
        $hora = $this->ObtenerHoraNoMilitar($horafin[0]);
        $horafin = $hora . ':' . $horafin[1] . ' ' . $fechafin[2];
        $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
        $parametros->hora = $horainicio;
        $parametros->horafin = $horafin;
        $parametros->idactividad = $idactividad;
        $objcmpgestionaractividadesmodel->CambioHorario($parametros);
        $respuesta
            = $objcmpgestionaractividadesmodel->ModificarHorarioActividad(
            $idactividad, $horainicio, $horafin
        );
        //para generar notificaciones (ARA)
        if ($respuesta == 1) {
            $objNotificacion = new CmpnotificacionesModel();
            $accion = 2;
            $idelemento = $idactividad;
            $idtipoelemento = 3;
            $idautor = $this->global->Perfil->idusuario;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha
            );
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para eliminar las actividades
     */
    function eliminaractividadesAction()
    {

        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayidactividades = json_decode(
            stripslashes($this->_request->getPost('arrayidactividades'))
        );
        $puntualizacion = ($this->_request->getPost('puntualizacion')) ? $this->_request->getPost('puntualizacion') : 0;
        $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
        //para generar notificacion (ARA)
        $arrayNotif = array();
        $objNotificacion = new CmpnotificacionesModel();
        $accion = 3;
        // $idtipoelemento = 3;
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $idtipoelemento = !isset($tipoelemento) ? 3 : 7;
        $idautor = $idusuariosession;
        $fecha = date('d/m/Y H:i:s');
        $permitireliminar = 1;
        $arrayIdActPermisoEliminar = array();

        foreach ($arrayidactividades as $idelemento) {
            //***historial***
            $objhistoantes = Doctrine::getTable('DatElementos')->find(
                $idelemento
            );
            //Comprobar permiso de eliminar
            $objactmodel = new CmpgestionaractividadesModel();
            $idautoractividad = $objhistoantes->idusuariocrea;
            $parametros->idautoractividad = $idautoractividad;
            $parametros->idusuariosession = $idusuariosession;
            $permisos = $objactmodel->comprobarPermisos(
                $parametros
            );
            if (!$permisos['eliminar']) {
                $permitireliminar = 0;
            } else {
                array_push($arrayIdActPermisoEliminar, $idelemento);
                $objhisto->denelemento = $objhistoantes->denelemento;
                $objhisto->descelemento = $objhistoantes->descelemento;
                $objhisto->dirigente = $objhistoantes->dirigente;
                $objhisto->gradocumplimiento
                    = $objhistoantes->gradocumplimiento;
                $objhisto->participante = $objhistoantes->participante;
                $objactividad = Doctrine::getTable('DatActividades')->find(
                    $idelemento
                );
                $relaciones = DatElementosDatElementos::obtenerRelacionAct(
                    $idelemento
                );

                $objhisto->relaciones = $relaciones;
                $parametros->idactividad = $idelemento;
                $parametros->fechainicio = $objactividad->fechainicio;
                $parametros->fechafin = $objactividad->fechafin;
                $parametros->horainicio = $objactividad->horainicio;
                $parametros->horafin = $objactividad->horafin;
                $objcambiohorario
                    = $objcmpgestionaractividadesmodel->CambioHorario(
                    $parametros
                );

                $involucradoshisto = Doctrine::getTable(
                    'DatElementosDatInvolucrados'
                )->findByDql("idelemento = '$idelemento'");
                $arrayinvolucrados = array();
                foreach ($involucradoshisto as $involucrado) {
                    $involucradosuser = Doctrine::getTable('DatInvolucrados')
                        ->find(
                            $involucrado->idinvolucrado
                        );
                    $arrayinvolucrados[] = $involucradosuser->idusuario;
                }
                $involucradoshisto = implode(',', $arrayinvolucrados);
                //*** fin historial***
                $arrayNotif[] = $objNotificacion->generarNotificacion(
                    $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $objhisto, $involucradoshisto
                );
            }
        }
        if (isset($arrayIdActPermisoEliminar[0])) {
            $respuesta = $objcmpgestionaractividadesmodel->EliminarActividades(
                $arrayIdActPermisoEliminar, $idusuariosession, $idtipoelemento
            );

            if ($respuesta) {
                (!$permitireliminar) ? $respuesta = 3 : null;
                //Eliminando notificacion si viene de una puntualizacion aprobada
                if ($puntualizacion && isset($arrayNotif[0])) $objNotificacion->eliminarArrayNotificaciones($arrayNotif);
            } else {
                if (isset($arrayNotif)) {
                    $objNotificacion->eliminarArrayNotificaciones($arrayNotif);
                }
            }
        } else {
            $respuesta = 2;
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para cargar el combo con las categorias de la actividad
     */
    function cargarcategoriasactividadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 2;
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
     * Accion para cargar el combo con los tipos de la actividad
     */
    function cargartiposactividadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 3;
        $tiponomn = $this->_request->getPost('tiponomenclador');
        $inicial = $this->_request->getPost('inicial');
        if ($tiponomn) {
            $tiponomenclador = 9;
        }
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            $dat->data = array();
            foreach ($nomencladores as $val) {
                if ($inicial == 1) {
                    if ($val['inicial'] == 1) {
                        $dat->data [] = array('idtipo' => $val['idnomenclador'],
                            'denominacion' => $val['denom'],
                            'incidencia' => $val['incidencia'],
                            'inicial' => $val['inicial']);
                    }
                } else {
                    $dat->data [] = array('idtipo' => $val['idnomenclador'],
                        'denominacion' => $val['denom'],
                        'incidencia' => $val['incidencia'],
                        'inicial' => $val['inicial']);
                }
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    function cargaractividadinicialAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 9;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                if ($val['inicial'] == 1) {
                    $dat->data [] = array('idtipo' => $val['idnomenclador'],
                        'denominacion' => $val['denom'],
                        'incidencia' => $val['incidencia']);
                    break;
                }
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Funcion para cargar el combo de estados de aprobacion de las actividades
     */
    function cargarcmbestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = 3; //$this->_request->getPost('idtipodoc');
        if($this->_request->getPost('accion')){
          $objcmpactmodel = new CmpgestionaractividadesModel();
          $arrayestadosverdoc = $objcmpactmodel->EstadosVerReasignar($idusuariosession, $idtipodoc);
        }else{
          $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idusuariosession, $idtipodoc
          );
        }

        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    /**
     * Funcion para cargar una actividad en el formulario
     */
    function cargarformactividadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idactividad = $this->_request->getPost('idactividad');
        $objelemento = Doctrine::getTable('DatElementos')->find($idactividad);
        if (isset($objelemento->idelemento)) {
            $objactividad = Doctrine::getTable('DatActividades')->find(
                $idactividad
            );
            $objcmpelementosmodel = new CmpgestionarelementoModel();
            $categoriaactividad
                = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
                $idactividad, 2, 3
            );
            $tipoactividad
                = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
                $idactividad, 3, 3
            );
            $puedeActualizarporciento = self::verificarDependencias(
                $idactividad
            );
            $porcientocumpli = DatElementos::obtenerPorcientoCmplimiento(
                $idactividad
            );
            $arrayestadosaprob = $this->pIntegrator->workflow->DenomEstado(
                $objelemento->idestadoaprob
            );
            if (isset($arrayestadosaprob[0])) {
                $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
            }

            $dat->data [] = array(
                'idactividad' => $objactividad->idactividad,
                'idelemento' => $objelemento->idelemento,
                /* 'autor'               => $this->integrator->seguridad->nombreUsuario(
                  $objelemento->idusuariocrea
                  ), */
                'autor' => $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $objelemento->idusuariocrea, 'usuario', null
                ),
                'denominacion' => $objelemento->denelemento,
                'descripcion' => empty($objelemento->descelemento) ? '' : $objelemento->descelemento,
                'dirigentes' => empty($objelemento->dirigente) ? '' : $objelemento->dirigente,
                'participantes' => empty($objelemento->participante) ? '' : $objelemento->participante,
                'fechainicio' => $objactividad->fechainicio,
                'fechafin' => $objactividad->fechafin,
                'hora' => $this->ConvertirHora(
                    'militar', $objactividad->horainicio
                ), //$objactividad->horainicio,
                'horafin' => $this->ConvertirHora(
                    'militar', $objactividad->horafin
                ), //$objactividad->horafin,
                'lugar' => $objactividad->lugar,
                'esprincipal' => $objactividad->esprincipal,
                'categoria' => array('idcategoria' => $categoriaactividad->idnomenclador,
                    'denominacion' => $categoriaactividad->dennomenclador),
                'tipo' => array('idtipo' => $tipoactividad->idnomenclador,
                    'denominacion' => $tipoactividad->dennomenclador),
                'gradocumplimiento' => $objelemento->gradocumplimiento,
                'estadocumplimiento' => $objelemento->estadocumplimiento,
                'estado' => $nombreestadoapro,
                'deshabilitarxciento' => $puedeActualizarporciento,
                'auto_manual' => $porcientocumpli[0]['actualizarporciento'],
                'porcientoinicio' => $porcientocumpli[0]['porcientoinicio'],
                'peso' => $objelemento->peso,
                'mensaje' => 1,
                'tiempoestimado' => $objactividad->tiempoestimado,
                'criterioevaluacion' => $objactividad->criterioevaluacion
            );
            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Funcion para cargar las repeticiones de una actividad
     */
    function cargarrepeticionesactividadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idactividad = $this->_request->getPost('idactividad');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idusuariosession = $this->global->Perfil->idusuario;
        $objactmodel = new CmpgestionaractividadesModel();
        $arrayrepeticiones = $objactmodel->ObtenerRepeticionesActividadPaginado(
            $idactividad, $idusuariosession, $limit, $start
        );
        if ($arrayrepeticiones['total'] > 0) {
            echo json_encode(
                array('total' => $arrayrepeticiones['total'],
                    'campos' => $arrayrepeticiones['resultado'])
            );
        } else {
            echo json_encode(array('campos' => array(), 'total' => 0));
        }
    }

    /**
     * Accion para adicionar las repeticiones de una determninada actividad
     */
    function adicionarrepeticionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idactividad = $this->_request->getPost('idactividad');
        $arrayrepeticiones = json_decode(
            stripslashes($this->_request->getPost('arrayrepeticiones'))
        );
        $objcmpactmodel = new CmpgestionaractividadesModel();
        foreach ($arrayrepeticiones as $key => $repeticion) {
            $fechainicio = $repeticion->fechainicioRe;
            $fechafin = $repeticion->fechafinRe;
            $horainicio = $repeticion->horaRe;
            $horafin = $repeticion->horafinRe;
            $tiporepeticion = $repeticion->tipoDeRep;
            $arrayrepeticiones[$key]->fechainicio
                = $objcmpactmodel->ConvertirFecha($fechainicio, 'T');
            $arrayrepeticiones[$key]->fechafin
                = $objcmpactmodel->ConvertirFecha($fechafin, 'T');
            $arrayrepeticiones[$key]->hora/* inicio */ = $horainicio;
            $arrayrepeticiones[$key]->horafin = $horafin;
            $arrayrepeticiones[$key]->tiporepeticion = $tiporepeticion;
        }
        $objelemento = Doctrine::getTable('DatElementos')->find($idactividad);
        if (isset($objelemento->idelemento)) {
            $objactividad = Doctrine::getTable('DatActividades')->find(
                $idactividad
            );
            $arrayobjrelaciones = array();
            $objrelacionesmodel = new CmprelacionesModel();
            $arrayrelaciones = $objrelacionesmodel->CargarRelacionesSuperiores(
                $tipoelemento = 3, $idactividad, $idusuariosession
            );
            if ($arrayrelaciones['contador'] > 0) {
                foreach ($arrayrelaciones['array'] as $key => $relacion) {
                    $arrayobjrelaciones[$key]->idrelacion
                        = $relacion['idrelacion'];
                    $arrayobjrelaciones[$key]->idarc = $relacion['idarc'];
                    $arrayobjrelaciones[$key]->idplan = $relacion['idplan'];
                    $arrayobjrelaciones[$key]->idobjetivo
                        = $relacion['idobjetivo'];
                    $arrayobjrelaciones[$key]->idactividad
                        = $relacion['idactividad'];
                    $arrayobjrelaciones[$key]->idfip = $relacion['idfip'];
                    $arrayobjrelaciones[$key]->tipoelemento
                        = $relacion['tipoelemento'];
                }
            }
            $arrayobjinvolucrados = array();
            $objclasificadorinvolmodel = new ClasificadorinvolModel();
            $arrayinvolucrados
                = $objclasificadorinvolmodel->MostrarInvolucrados(
                $idactividad, $idtipoelemento = 3
            );


            if (isset($arrayinvolucrados[0])) {
                foreach ($arrayinvolucrados as $key => $involucrado) {
                    $arrayobjinvolucrados[$key]->tipo = $involucrado['tipo'];
                    $arrayobjinvolucrados[$key]->idinvolucrado
                        = $involucrado['idinvolucrado'];
                    $arrayobjinvolucrados[$key]->llaveinvolucrado
                        = $involucrado['llaveinvolucrado'];
                    $arrayobjinvolucrados[$key]->idgrupo
                        = $involucrado['idgrupo'];
                    $arrayobjinvolucrados[$key]->idusuario
                        = $involucrado['idusuario'];
                    $arrayobjinvolucrados[$key]->tipoinvol = 1;
                }
            }
            $objcmpelementosmodel = new CmpgestionarelementoModel();
            $categoriaactividad
                = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
                $idactividad, 2, 3
            );
            $tipoactividad
                = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
                $idactividad, 3, 3
            );
            $objcmpactmodel->AdicionarRepeticionesActividad(
                $arrayobjrelaciones, $objelemento, $objactividad, $arrayrepeticiones, $arrayobjinvolucrados, $categoriaactividad->idnomenclador, $tipoactividad->idnomenclador, $objelemento->estadocumplimiento, $objactividad->esprincipal, $objelemento->idusuariocrea
            );
            $respuesta = 1;
        } else {
            $respuesta = 0;
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para modificar las repeticiones de una determninada actividad
     */
    function modificarrepeticionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        //$idusuariosession = $this->global->Perfil->idusuario;
        $fechainicio = $this->_request->getPost('dffechainiciorepaleatoria');
        $fechafin = $this->_request->getPost('dffechafinrepaleatoria');
        $horainicio = $this->_request->getPost('tmfhorarepaleatoria');
        $horafin = $this->_request->getPost('tmfhorafinrepaleatoria');
        $lugar = $this->_request->getPost('tflugarrepaleatoria');
        $tiporepeticion = 2;
        $idactividad = $this->_request->getPost('idactividad');
        $idactrepeticion = $this->_request->getPost('idactrepeticion');
        $arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $arrayinvolucradoseliminar = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucradoseliminar'))
        );
        $objcmpactmodel = new CmpgestionaractividadesModel();
        $respuesta = $objcmpactmodel->ModificarRepeticion(
            $fechainicio, $fechafin, $horainicio, $horafin, $lugar, $tiporepeticion, $idactividad, $idactrepeticion, $arrayinvolucrados, $arrayinvolucradoseliminar
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para eliminar las repeticiones de una determninada actividad
     */
    function eliminarrepeticionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idactividad = $this->_request->getPost('idactividad');
        $arrayrepeticiones = json_decode(
            stripslashes($this->_request->getPost('arrayrepeticiones'))
        );
        $objactmodel = new CmpgestionaractividadesModel();
        $respuesta = $objactmodel->EliminarRepeticiones(
            $idactividad, $arrayrepeticiones
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para reorganizar las subactividades
     */
    function reorganizaractividadesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuariosession = $this->global->Perfil->idusuario;
        $datos->arraysubactividades = json_decode(
            stripslashes($this->_request->getPost('arraysubactividades'))
        );
        $datos->arrayactividadespadres = json_decode(
            stripslashes($this->_request->getPost('arrayactividadespadres'))
        );
        $objactmodel = new CmpgestionaractividadesModel();
        $respuesta = $objactmodel->ReorganizarSubActividades($datos);
        echo json_encode(array('mensaje' => $respuesta));
    }

    function comprobarPermisosAction()
    {
        $parametros = new stdClass();
        $parametros->idautoractividad = json_decode(
            stripslashes($this->_request->getPost('idautoractividad'))
        );
        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->idactividad = json_decode(
            stripslashes($this->_request->getPost('idactividad'))
        );
        $parametros->superior = json_decode(
            $this->_request->getPost('superior')
        );

        $objelemento = Doctrine::getTable('DatElementos')->find(
          $parametros->idactividad
        );

        $arrayestadosaprob = $this->pIntegrator->workflow->DenomEstado(
          $objelemento->idestadoaprob
        );
        $nombreestadoapro='';
        if (isset($arrayestadosaprob[0])) {
          $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
        }

        $objactmodel = new CmpgestionaractividadesModel();
        $respuesta = $objactmodel->comprobarPermisos($parametros);

        if(count(explode('Aprobado', $nombreestadoapro))==2){
           $respuesta['modificar'] = 0;
           $respuesta['eliminar'] = 0;
        }

        echo json_encode(array('respuesta' => $respuesta));
    }

    function ObtenerHoraNoMilitar($horamilitar)
    {
        switch ($horamilitar) {
            case 13:
                $horamilitar = 1;
                break;
            case 14:
                $horamilitar = 2;
                break;
            case 15:
                $horamilitar = 3;
                break;
            case 16:
                $horamilitar = 4;
                break;
            case 17:
                $horamilitar = 5;
                break;
            case 18:
                $horamilitar = 6;
                break;
            case 19:
                $horamilitar = 7;
                break;
            case 20:
                $horamilitar = 8;
                break;
            case 21:
                $horamilitar = 9;
                break;
            case 22:
                $horamilitar = 10;
                break;
            case 23:
                $horamilitar = 11;
                break;
            case 24:
                $horamilitar = 12;
                break;
        }
        return $horamilitar;
    }

    function ConvertirHora($convertirtipohora, $hora)
    {
        if ($convertirtipohora == 'militar') {
            $cadenahora = explode(' A', $hora);
            if ($cadenahora[1]) {
                $caden = explode(':', $cadenahora[0]);

                if (($caden[0] * 1) < 10) {
                    $hora = '0' . $cadenahora[0];
                } else {
                    if (($caden[0] * 1) == 12) {
                        $hora = '00' . $caden[1];
                    }
                }
            } else {
                $cadenahor = explode(' P', $hora);
                if ($cadenahor[1]) {
                    $cadenahoraini = explode(':', $cadenahor[0]);
                    switch ($cadenahoraini[0]) {
                        case '01':
                            $hora = '13:' . $cadenahoraini[1];
                            break;
                        case '02':
                            $hora = '14:' . $cadenahoraini[1];
                            break;
                        case '03':
                            $hora = '15:' . $cadenahoraini[1];
                            break;
                        case '04':
                            $hora = '16:' . $cadenahoraini[1];
                            break;
                        case '05':
                            $hora = '17:' . $cadenahoraini[1];
                            break;
                        case '06':
                            $hora = '18:' . $cadenahoraini[1];
                            break;
                        case '07':
                            $hora = '19:' . $cadenahoraini[1];
                            break;
                        case '08':
                            $hora = '20:' . $cadenahoraini[1];
                            break;
                        case '09':
                            $hora = '21:' . $cadenahoraini[1];
                            break;
                        case '10':
                            $hora = '22:' . $cadenahoraini[1];
                            break;
                        case '11':
                            $hora = '23:' . $cadenahoraini[1];
                            break;
                        case '12':
                            $hora = '00:' . $cadenahoraini[1];
                            break;
                    }
                }
            }
        } else {
            $cadenahora = explode(':', $hora);
            if (($cadenahora[0] * 1) < 13) {
                $hora = $cadenahora[0] . ':' . $cadenahora[1] . ' AM';
            } else {
                switch ($cadenahora[0]) {
                    case '13':
                        $hora = '01:' . $cadenahora[1] . ' PM';
                        break;
                    case '14':
                        $hora = '02:' . $cadenahora[1] . ' PM';
                        break;
                    case '15':
                        $hora = '03:' . $cadenahora[1] . ' PM';
                        break;
                    case '16':
                        $hora = '04:' . $cadenahora[1] . ' PM';
                        break;
                    case '17':
                        $hora = '05:' . $cadenahora[1] . ' PM';
                        break;
                    case '18':
                        $hora = '06:' . $cadenahora[1] . ' PM';
                        break;
                    case '19':
                        $hora = '07:' . $cadenahora[1] . ' PM';
                        break;
                    case '20':
                        $hora = '08:' . $cadenahora[1] . ' PM';
                        break;
                    case '21':
                        $hora = '09:' . $cadenahora[1] . ' PM';
                        break;
                    case '22':
                        $hora = '10:' . $cadenahora[1] . ' PM';
                        break;
                    case '23':
                        $hora = '11:' . $cadenahora[1] . ' PM';
                        break;
                    case '00':
                        $hora = '12:' . $cadenahora[1] . ' PM';
                        break;
                }
            }
        }
        return $hora;
    }

    public function getConfiguracionPerfilAction()
    {
        $tipelemento = $this->_request->getPost('idtipoelemento');
        $idconfi = $this->_request->getPost('idconfiguracion');
        $idcargaxdefecto = $this->_request->getPost('idcargapordefecto');
        $idusuario = $this->global->Perfil->idusuario;
        $result
            = $this->pIntegrator->configuracionpdo->getConfPerfilxtipoelytipoconf(
            $tipelemento, $idconfi, $idusuario, $idcargaxdefecto
        );
        if (isset($result[0]['fechainicio'])) {
            $fechainicio = explode('/', $result[0]['fechainicio']);
            $result[0]['fechainicio']
                = $fechainicio[2] . '/' . $fechainicio[1] . '/'
                . $fechainicio[0]; //.' '.'00:00:00';
        }
        if (isset($result[0]['fechafin'])) {
            $fechafin = explode('/', $result[0]['fechafin']);
            $result[0]['fechafin']
                = $fechafin[2] . '/' . $fechafin[1] . '/'
                . $fechafin[0]; //.' '.'00:00:00';
        }
        if (isset($result[0])) {
            $result[0]['ejecutar'] = true;
            echo json_encode($result[0]);
        } else {
            echo json_encode(array('ejecutar' => false));
        }
    }

    public function cargarrecursossinasociarAction()
    {

        ini_set("max_execution_time", 3600); //3600 1hora
        $filtros = $this->_request->getPost('filtros');
        $idactividad = $this->_request->getPost('idactividad');
        $estamodificando = $this->_request->getPost('estamodificando');
        if ($estamodificando == 1) {
            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $respuesta
                = $objcmpgestionaractividadesmodel->BuscarRecursoActividad(
                $idactividad
            );
            $idusuario = $this->global->Perfil->idusuario;
            $tiponomenclador = 5;
            $nomencladores
                = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
                $tiponomenclador, $idusuario
            );
            if ($nomencladores != null) {
                foreach ($nomencladores as $val) {
                    if (!in_array($val['idnomenclador'], $respuesta) && $val['enuso'] == 0
                    ) {
                        if ($filtros) {
                            $ese = $filtros[0][data][value];
                            $resultado = strpos($val['denom'], $ese);
                            if ($resultado !== false) {
                                $dat->data []
                                    = array('idcategoria' => $val['idnomenclador'],
                                    'denominacion' => $val['denom']);
                            }
                        } else {
                            $dat->data []
                                = array('idcategoria' => $val['idnomenclador'],
                                'denominacion' => $val['denom']);
                        }
                    }
                }
            } else {
                $dat->data = array();
            }
        } else {
            $idusuario = $this->global->Perfil->idusuario;
            $tiponomenclador = 5;
            $nomencladores
                = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
                $tiponomenclador, $idusuario
            );
            if ($nomencladores != null) {
                foreach ($nomencladores as $val) {
                    if ($val['enuso'] == 1) {
                        if ($filtros) {
                            $ese = $filtros[0][data][value];
                            $resultado = strpos($val['denom'], $ese);
                            if ($resultado !== false) {
                                $dat->data []
                                    = array('idcategoria' => $val['idnomenclador'],
                                    'denominacion' => $val['denom']);
                            }
                        }
                    } else {
                        $dat->data []
                            = array('idcategoria' => $val['idnomenclador'],
                            'denominacion' => $val['denom']);
                    }
                }
            } else {
                $dat->data = array();
            }
        }
        if (!$dat->data) {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    public function cargarrecursosasociadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idactividad = $this->_request->getPost('idactividad');
        $filtros = $this->_request->getPost('filtros');
        $estamodificando = $this->_request->getPost('estamodificando');
        if ($estamodificando == 1) {
            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $respuesta
                = $objcmpgestionaractividadesmodel->BuscarRecursoActividad(
                $idactividad
            );
            $idusuario = $this->global->Perfil->idusuario;
            $tiponomenclador = 5;
            $nomencladores
                = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
                $tiponomenclador, $idusuario
            );
            if ($nomencladores != null) {
                foreach ($nomencladores as $val) {
                    if (in_array($val['idnomenclador'], $respuesta)) {
                        if ($filtros) {
                            $ese = $filtros[0][data][value];
                            $resultado = strpos($val['denom'], $ese);
                            if ($resultado !== false) {
                                $dat->data []
                                    = array('idcategoria' => $val['idnomenclador'],
                                    'denominacion' => $val['denom']);
                            }
                        } else {
                            $dat->data []
                                = array('idcategoria' => $val['idnomenclador'],
                                'denominacion' => $val['denom']);
                        }
                    }
                }
            } else {
                $dat->data = array();
            }
        } else {
            $dat->data = array();
        }
        if (!$dat->data) {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    function obtenerrangodefechasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        //$idusuario = $this->global->Perfil->idusuario;
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $objcmpactmodel = new CmpgestionaractividadesModel();
        $arrayfechas = $objcmpactmodel->obtenerRangoDeFechas(
            $arrayinvolucrados, $fechainicio, $fechafin
        );
        echo json_encode($arrayfechas);
    }

    function verificarconflictoAction()
    {
        ini_set("max_execution_time", 3600);  //3600 1hora
        //$idusuario = $this->global->Perfil->idusuario;
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $objcmpactmodel = new CmpgestionaractividadesModel();
        $arraydenominvolucrados = array();
        $arraydenominvolucrados = $objcmpactmodel->verificarConflicto(
            $arrayinvolucrados, $fechainicio, $fechafin
        );
        /* if (isset($arraydenominvolucrados[0])) { */
        echo json_encode(
            array('success' => true, 'total' => count($arraydenominvolucrados),
                'campos' => $arraydenominvolucrados)
        );
        /* }
          else
          echo json_encode(array('ejecutar' => false)); */
    }

    function generarDependenciaAction()
    {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->arraydependencias = json_decode(
            stripslashes($this->_request->getPost('arraysubactividades'))
        );
        $parametros->origen = $this->_request->getPost('origen');
        $parametros->idelementohijo = $this->_request->getPost('actpadre');
        $parametros->porcientoinicio = ($this->_request->getPost(
            'porcientoinicio'
        )
        ) ? $this->_request->getPost('porcientoinicio') : 0;
        $parametros->idmodulo = $this->_request->getPost('idmodulo');
        $dependenciaModel = new DependenciaModel();
        $result = $dependenciaModel->GenerarDependencia($parametros);
        if ($result == 1) {
            echo json_encode(array('success' => $result));
        } else {
            echo json_encode(array('success' => $result));
        }
    }

    function asociarInvolucradosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->arrayinvolucrados = json_decode(
            $this->_request->getPost('arrayinvolucrados')
        );
        $parametros->arrayactividadesseleccionadas = json_decode(
            $this->_request->getPost('arrayactividadesseleccionadas')
        );
        if (isset($parametros->arrayinvolucrados[0]) && isset($parametros->arrayactividadesseleccionadas[0])
        ) {
            $objcmpactmodel = new CmpgestionaractividadesModel();
            $result = $objcmpactmodel->asociarInvolucradosAct($parametros);
            echo json_encode(array('mensaje' => $result));
        } else {
            $result = 0;
            echo json_encode(array('mensaje' => $result));
        }
    }

    function verificarDependencias($idactividad)
    {
        $procede = 1;
        $existendependencias = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql("idelementohijo = '$idactividad' AND origen >= 6");
        if ($existendependencias[0]->idelementopadre != null) {
            foreach ($existendependencias as $dependencia) {
                if ($dependencia->origen == 6) {
                    $objpadre = Doctrine::getTable('DatElementos')->find(
                        $dependencia->idelementopadre
                    );
                    if ($objpadre->gradocumplimiento != 100) {
                        $procede = 0;
                        continue;
                    }
                } else {
                    if ($dependencia->origen == 7) {
                        $objpadre = Doctrine::getTable('DatElementos')->find(
                            $dependencia->idelementopadre
                        );
                        if ($objpadre->gradocumplimiento < $dependencia->porcientoinicio
                        ) {
                            $procede = 0;
                            continue;
                        }
                    } else {
                        $objpadre = Doctrine::getTable('DatElementos')->find(
                            $dependencia->idelementopadre
                        );
                        $objhijo = Doctrine::getTable('DatElementos')->find(
                            $dependencia->idelementohijo
                        );
                        if ($objpadre->gradocumplimiento == 0 && $objhijo->gradocumplimiento == 0
                        ) {
                            $procede = 0;
                            continue;
                        }
                    }
                }
            }
        }
        return $procede;
    }

    function ExportarGanttPDFAction()
    {
        $parametros->html = $this->_request->getPost('html');
        $parametros->ancho = $this->_request->getPost('ancho');
        //$objcmpactmodel = new CmpgestionaractividadesModel();
        //$objcmpactmodel->ExportarGanttApdf($parametros);
        $variable
            = "<html><head><meta http-equiv=\"Content-Type\" content=
                \"text/html; charset=UTF-8\"><link rel='stylesheet'
                type='text/css'
                href='/planificacion/pdo/comun/css/dhtmlxgantt_skyblue.css' />
                <script type='text/javascript' src='/planificacion/pdo/comun
                /gantt/dhtmlxgantt.js'></script>
                <script type='text/javascript' src='/planificacion/pdo/comun/gantt
                /dhtmlxgantt_tooltip.js'></script><script type='text/javascript'
                src='/planificacion/pdo/comun/gantt/reportegant.js'></script>
                </head><body><div id='gantt_here' style='width:100%; height:100%;'>"
            . $parametros->html . "</div></body></html>";
        echo json_encode($variable);
    }

    public function listarCargasxDefectoAction()
    {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 80;
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->integrator = $this->integrator;
        $result = $this->pIntegrator->configuracionpdo->getCargaxdefecto(
            $parametros
        );
        /* $model = new CmpconfigurarperfilModel();
          $result = $model->listarCargasxdefecto($parametros);
          echo json_encode($result); */
    }

    public function ObtenerPorcientoReAction()
    {
        $parametros->actpadre = $this->_request->getPost('actividadpadre');
        $objcmpactmodel = new CmpgestionaractividadesModel();
        $porciento = $objcmpactmodel->porcientoLeft($parametros->actpadre);
        echo json_encode($porciento);
    }

    public function ActualizarporcientodecumplimientoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $id = $this->_request->getPost('id');
        $porcientocumplimiento = $this->_request->getPost(
            'porcientocumplimiento'
        );
        $redondeado = round($porcientocumplimiento, 2);
        $datelemento = Doctrine::getTable('DatElementos')->find($id);
        if (isset($datelemento->idelemento)) {
            $datelemento->gradocumplimiento = $redondeado * 100;

            $objelemmodel = new CmpgestionarelementoModel();
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $datelemento->gradocumplimiento
            );
            $datelemento->estadocumplimiento = $estadocumplimiento;
            $datelemento->save();
            echo json_encode(1);
            //Guardar en Historial
            $objAct = Doctrine::getTable('DatActividades')->find($id);
            $parametros->fechainicio = $objAct->fechainicio;
            $parametros->fechafin = $objAct->fechafin;
            $parametros->horainicio = $objAct->horainicio;
            $parametros->horafin = $objAct->horafin;
            $parametros->denelemento = $datelemento->denelemento;
            $parametros->descelemento = $datelemento->descelemento;
            $parametros->dirigente = $datelemento->dirigente;
            $parametros->gradocumplimiento = $datelemento->gradocumplimiento;
            $parametros->participante = $datelemento->participante;
            $arrayinvol = DatInvolucrados::involucrados($objAct->idactividad);
            $arrayinvolucrados = array();
            foreach ($arrayinvol as $involucrado) {
                $arrayinvolucrados[] = $involucrado['idusuario'];
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);
            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
                $parametros
            );
            $accion = 2;
            $idelemento = $objAct->idactividad;
            $idtipoelemento = 3;
            $idautor = $parametros->idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
            );
        } else {
            echo json_encode(0);
        }
        /* $objcmpactmodel = new CmpgestionaractividadesModel();
          $porciento = $objcmpactmodel->porcientoLeft($parametros->actpadre);
         */
    }

    public function actualizarCumplimientoAction()
    {
        $arrayparametros->cumplimiento = $this->_request->getPost(
            'cumplimiento'
        );
        $arrayparametros->arrayidelementos = json_decode(
            stripslashes($this->_request->getPost('arrayidactividades'))
        );

        $arrayparametros->metodo = $this->_request->getPost('metodo');
        $objelementomodel = new CmpgestionarelementoModel();
        $respuesta = $objelementomodel->actualizarCumplimiento(
            $arrayparametros
        );

      $idelemento=$arrayparametros->arrayidelementos[0];
      $parametros->idusuariocrea = $this->global->Perfil->idusuario;
      $objAct = Doctrine::getTable('DatActividades')->find($idelemento);
      $datelemento = Doctrine::getTable('DatElementos')->find($idelemento);
      $parametros->fechainicio = $objAct->fechainicio;
      $parametros->fechafin = $objAct->fechafin;
      $parametros->horainicio = $objAct->horainicio;
      $parametros->horafin = $objAct->horafin;
      $parametros->denelemento = $datelemento->denelemento;
      $parametros->descelemento = $datelemento->descelemento;
      $parametros->dirigente = $datelemento->dirigente;
      $parametros->gradocumplimiento = $datelemento->gradocumplimiento;
      $parametros->participante = $datelemento->participante;

      $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
      $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
        $parametros
      );

      $arrayinvol = DatInvolucrados::involucrados($objAct->idactividad);
      $arrayinvolucrados = array();
      foreach ($arrayinvol as $involucrado) {
        $arrayinvolucrados[] = $involucrado['idusuario'];
      }
      $involucradoshisto = implode(',', $arrayinvolucrados);
      $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
      $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
        $parametros
      );

      $accion = 2;
      $idtipoelemento = 3;
      $idautor = $this->global->Perfil->idusuario;
      $fecha = date('d/m/Y H:i:s');

      $objNotificacion = new CmpnotificacionesModel();
      $objNotificacion->generarNotificacion(
        $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
      );

        echo json_encode(array('respuesta' => $respuesta));
    }

    function hacerRaizActividadesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrayidactividades = json_decode(
            stripslashes($this->_request->getPost('arrayidactividades'))
        );
        $objactmodel = new CmpgestionaractividadesModel();
        $respuesta = $objactmodel->hacerRaizActividad($arrayidactividades);

        echo json_encode(array('mensaje' => $respuesta));
    }

    function modificarFechaActividadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->fecha = $this->_request->getPost('fecha');
        $parametros->idactividad = json_decode(
            $this->_request->getPost('idactividad')
        );
        if ($parametros->idactividad != '') {
            $objactmodel = new CmpgestionaractividadesModel();
            $result = $objactmodel->ModificarFechaActividad($parametros);
            echo json_encode(array('mensaje' => $result));
        } else {
            $result = 2;
            echo json_encode(array('mensaje' => $result));
        }
    }

    function diffDias($fechaInicio, $fechaFin)
    {
        $fechaInicial = explode('-', $fechaInicio);
        $fechaFinal = explode('-', $fechaFin);


        $timestamp1 = mktime(0, 0, 0, $fechaInicial[1], $fechaInicial[2], $fechaInicial[0]);
        $timestamp2 = mktime(0, 0, 0, $fechaFinal[1], $fechaFinal[2], $fechaFinal[0]);

        $segundos_diferencia = $timestamp1 - $timestamp2;
        $dias_diferencia = $segundos_diferencia / (60 * 60 * 24);
        $dias_diferencia = abs($dias_diferencia);
        $dias_diferencia = floor($dias_diferencia);

        return $dias_diferencia;
    }

    function importarActividadesAction()
    {        
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idusuariocrea = $this->global->Perfil->idusuario;

        $parametros->idpersona = $this->global->Perfil->idpersona;
        $parametros->accion = $this->_request->getPost('accion');

        $padreglobal = $this->_request->getPost('idpadre') ? $this->_request->getPost('idpadre') : '';

        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;

        //** Se quitó la opcioón en enviar por correo al importar las actividades porque se add una nueva opcion para notificar por correo las actividades seleccioandas */

        /**Enviar correooo**/

        /* $dir_www = $_SERVER ['DOCUMENT_ROOT'];
        $dir_rel_mt = '/';
        $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);


        $configFile = $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR .
          'comun' . DIRECTORY_SEPARATOR . 'recursos' . DIRECTORY_SEPARATOR . 'xml' . DIRECTORY_SEPARATOR . 'config_mailer.xml';
        if (file_exists($configFile)) {
          $xmlCargado = simplexml_load_file($configFile);
        }


      $RSA = new ZendExt_RSA();
      $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
      $passDesencriptado = $RSA->decrypt((string)$xmlCargado->config['pwd'], $keys[2], $keys[0]);
      require $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/PHPMailer2/class.phpmailer.php';
      $mail = new PHPMailer();
      $mail->IsSMTP();
      $mail->SMTPDebug = 1;
      //OJO
      $mail->SMTPAuth = false;
      $mail->SMTPSecure = "none";

      $mail->Host = (string)$xmlCargado->config['host'];
      $mail->Port = (string)$xmlCargado->config['port'];
      $mail->Username = (string)$xmlCargado->config['nombre'];
      $mail->Password = $passDesencriptado;
//        $mail->Mailer = (string)$xmlCargado->config['mailer'];
      $mail->Timeout = 50;
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      //====== DE QUIEN ES ========
      $mail->From = (string)$xmlCargado->config['user'];
      $mail->FromName = (string)$xmlCargado->config['user'];

      $parametros->mail=$mail; */
        /***************
        ********************/


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

                    $obj = new CmpgestionaractividadesModel();

                    $salto = 0;
                    $arrayId = array();
                    $arrayPadres = array();

                    //obtengo el involucrado del nodo Mi Usuario
                    $usuario
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        'nodo1', $parametros->idusuariocrea, undefined, 2, 'nodo1',
                        0, 2, 1, $certificado, $parametros->idusuariocrea);

                    //obtengo los usuarios subordinados
                    $usersdomain
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        'nodo3', $parametros->idusuariocrea, undefined, 2, 'nodo3',
                        0, 3, 1, $certificado, $parametros->idusuariocrea);

                    //obtengo los usuarios de los permisos otrorgados por el nivel superior
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
                                    $parametros->idactividadpadre = $arrayPadres[$k[0]];
                                } else {
                                    //si no encuentra el padre en el array y tiene un padre global, lo pongo como hijo de ese global
                                    if ($padreglobal != '') {
                                        $parametros->eshija = 1;
                                        $parametros->idactividadpadre = $padreglobal;
                                    } else {
                                        //sino no tiene padre
                                        $parametros->eshija = 0;
                                        $parametros->idactividadpadre = '';
                                    }
                                }

                            } else {
                                //si tiene padre global lo pongo como hijo de ese global
                                if ($padreglobal != '') {
                                    $parametros->eshija = 1;
                                    $parametros->idactividadpadre = $padreglobal;
                                } else {
                                    //sino no tiene padre
                                    $parametros->idactividadpadre = '';
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
                            $parametros->idcategoria = null;
                            $parametros->lugar = '';
                            $parametros->dirigentes = '';
                            $parametros->participantes = '';
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
                            $referencia = Array();
                            if (isset($value[7])) {
                                $invol = explode(';', $value[7]);
                                $i = 0;
                                foreach ($invol as $key => $user) {

                                    $parametros->usuario = $user;

                                    $idusuario = $obj->getIdUsuario($parametros);

                                    if ($idusuario != '' || $idusuario != 0) {

                                        for ($w = 0; $w < count($arrayMisInvol); $w++) {
                                            if ($arrayMisInvol[$w]['idusuario'] == $idusuario) {

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
                                                break;
                                            }
                                        }
                                    }
                                }

                            } else {
                                $parametros->arrayinvolucrados = Array();
                            }
//                            $parametros->arrayinvolucrados = Array();

                            //creo el array de dependencias de la actividad
                            $relaciones = Array();
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
                            }

                            $result = $obj->AdicionarActividadImportar($parametros);
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

  private
  function extract_email_address($string)
  {
    $response = array();
    foreach (preg_split('/\s/', $string) as $token) {
      $email = filter_var(
        filter_var($token, FILTER_SANITIZE_EMAIL), FILTER_VALIDATE_EMAIL
      );
      if ($email !== false) {
        $response[] = $email;
      }
    }
    return $response;
  }
}
