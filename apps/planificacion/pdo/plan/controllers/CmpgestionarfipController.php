<?php

/**
 * Controlador para gestionar fips(Ffipores que Influyen en el Plan-->ordenes, resoluciones, acuerdos, etc)
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarfipController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionarfip.phtml
     */
    function cmpgestionarfipAction()
    {
        try {
            $usargd = $this->pIntegrator->planpdo->verificarGestorDoc();
        } catch (Exception $e) {
            $usargd = false;
        }
        if ($usargd) {
            $this->view->gestdoc
                = $this->integrator->gestordocumental->devolverJSContenido();
            $this->view->usarGD = '<script> var usarGD = true; </script>';
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }
        $this->render();
    }

    function getHoraAction(){
      $fecha = date('d/m/Y H:i')."";
      $hora = explode(' ', $fecha);
      echo json_encode(array('hora' => $hora[1]));
    }

  /**
   * Accion para generar el reporte
   */
  function generarActaTrabajoFipAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $datos=new stdClass();
    $datos->idusuariosession = $this->global->Perfil->idusuario;
    $datos->nombreusuario = $this->global->Perfil->usuario;
    $datos->logo = json_decode(stripslashes($this->_request->getPost('logo')));
    $datos->titulo = $this->_request->getPost('titulo');
    $datos->organismo = $this->_request->getPost('organismo');
    $datos->numero = $this->_request->getPost('numero');
    $datos->fecha = $this->_request->getPost('fecha');
    $datos->hora = $this->_request->getPost('hora');
    $datos->lugar = $this->_request->getPost('lugar');
    $datos->idopcion = $this->_request->getPost('idopcion');
    $datos->ordendeldia = $this->_request->getPost('ordendeldia');

    $datos->dirigentes = json_decode(
                     stripslashes($this->_request->getPost('dirigentes')));
    $datos->asistentes = json_decode(
                     stripslashes($this->_request->getPost('asistentes')));
    $datos->acuerdos = json_decode(
                     stripslashes($this->_request->getPost('acuerdos')));
    $datos->piedefirma = json_decode(
                         stripslashes($this->_request->getPost('piedefirma')));

    $objcmpreportes = new CmpreportesModel();
    $cuerporeporte = $objcmpreportes->generarActaTrabajoFip($datos);
    echo json_encode($cuerporeporte);
  }

    /**
     * Accion para cargar las fip en el grid
     */
    function cargarfipsAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idfip = $this->_request->getPost('anode');
        //$eshija = $this->_request->getPost('eshija');
        $filtros = $this->_request->getPost('filtros');
        $idusuario = $this->global->Perfil->idusuario;
        //$iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        //$certificado = $session->certificado;
        $idelementotributa = $this->_request->getPost('idelementotributa');
        //$denominacion = $this->_request->getPost('denominacion');
        /* $fechainicio = json_decode(
             stripslashes($this->_request->getPost('fechainicio'))
         );*/
        $reorganizar = json_decode(
          stripslashes($this->_request->getPost('fipsreorganizar'))
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
        $nivelacceso = $this->_request->getPost('nivelacceso');
        $tipofip = $this->_request->getPost('tipofip');
        //$car = $this->_request->getPost('car');
        $objfipmodel = new CmpgestionarfipModel();

        $arrayfips = $objfipmodel->CargarFips(
            $idfip, $idusuario, $idelementotributa, $arrayautores,
            $arrayinvolucrados, $nivelacceso, $tipofip, $start, $limit,
            $busqueda, $filtros, $reorganizar
        );
        //print_r('swswswsws');die;


        if (isset($arrayfips['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $arrayfips['total'],
                      'campos'  => $arrayfips['resultado'])
            );
        }
        if (!isset($arrayfips)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    public function actualizarCumplimientoAction()
    {
      $arrayparametros->cumplimiento = $this->_request->getPost(
        'cumplimiento'
      );
      $arrayparametros->arrayidelementos = json_decode(
        stripslashes($this->_request->getPost('arrayidfips'))
      );

      $arrayparametros->metodo = $this->_request->getPost('metodo');
      $objelementomodel = new CmpgestionarelementoModel();
      $respuesta = $objelementomodel->actualizarCumplimientoFips(
        $arrayparametros
      );

      echo json_encode(array('respuesta' => $respuesta));
    }

    /**
     * Accion para reorganizar las subactividades
     */
    function reorganizarfipsAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $datos->idusuariosession = $this->global->Perfil->idusuario;
      $datos->arraysubactividades = json_decode(
        stripslashes($this->_request->getPost('arraysubfips'))
      );
      $datos->arrayactividadespadres = json_decode(
        stripslashes($this->_request->getPost('arrayfipseleccionadas'))
      );
      $objactmodel = new CmpgestionaractividadesModel();
      $respuesta = $objactmodel->ReorganizarSubActividades($datos);
      echo json_encode(array('mensaje' => $respuesta));
    }


    function hacerRaizActividadesAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $arrayidfips = json_decode(
        stripslashes($this->_request->getPost('arrayidfips'))
      );
      $objactmodel = new CmpgestionaractividadesModel();
      $respuesta = $objactmodel->hacerRaizActividad($arrayidfips);

      echo json_encode(array('mensaje' => $respuesta));
    }

  /**
   * Accion para actualizar parametors de los fips
   */
  function actualizarParametrosAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $respuesta=0;
    try {
      $parametros->idusuariocrea = $this->global->Perfil->idusuario;
      $parametros->idpersona = $this->global->Perfil->idpersona;
      $parametros->fechaemision = $this->_request->getPost('femision_actParams');
      $parametros->fechacumplimiento = $this->_request->getPost('fcumplimiento_actParams');
      $parametros->fechacumplio = $this->_request->getPost('fcumplio_actParams');
      $parametros->idtipo = $this->_request->getPost('idtipo');
      $parametros->idnivel = $this->_request->getPost('idnivel');
      $arrayidfips = json_decode(
        stripslashes($this->_request->getPost('arrayidfips'))
      );

      foreach ($arrayidfips as $idelemento) {
        $objfip = Doctrine::getTable('DatFip')->find($idelemento);
        $datelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if($parametros->fechaemision!=''){
          $objfip->fechaemision = $parametros->fechaemision;
        }
        if($parametros->fechacumplimiento!=''){
          $objfip->fechacumplimiento = $parametros->fechacumplimiento;
        }
        if($parametros->fechacumplio!=''){
          $objfip->fechacumplio = $parametros->fechacumplio;
        }
        $objelemnom = new DatElementosNomNomencladorModel();
        //obtengo relacion con nomencladores y modifico
        if ($parametros->idnivel!='') {
          /*$elemnom =*/
          $objelemnom->ModificarRelacionNomElem(
            $datelemento, $parametros->idnivel, $tiponomenclador = 7
          );
        }

        if ($parametros->idtipo) {
          /* $elemnomtipo = */
          $objelemnom->ModificarRelacionNomElem(
            $datelemento, $parametros->idtipo, $tiponomenclador = 4
          );
        }

        $objfip->save();
        $respuesta++;

      }
    }catch (Exception $exc) {
      $respuesta=0;
    }

    echo json_encode(array('mensaje' => $respuesta));
  }



    /**
     * Accion para adicionar los FIP
     */
    function adicionarfipAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idpersona = $this->global->Perfil->idpersona;
        $parametros->denelemento = $this->_request->getPost(
            'tfdenominacionfip'
        );
        $parametros->descelemento = $this->_request->getPost(
            'hedescripcionfip'
        );
        if ($this->_request->getPost('porcientocumpfip') == "") {
            $parametros->gradocumplimiento = 0;
        } else {
            $parametros->gradocumplimiento
                = $this->_request->getPost('porcientocumpfip') * 1;
        }
        $parametros->fechaemision = $this->_request->getPost('femifip');
        $parametros->fechacumplimiento = $this->_request->getPost('fcumpfip');
        $parametros->fechacumplio = $this->_request->getPost('fcumpliofip');
        if (!$parametros->fechacumplio || $parametros->fechacumplio == '') {
            $parametros->fechacumplio = null;
        }
        $parametros->idtipo = $this->_request->getPost('idtipo');
        $parametros->idnivel = $this->_request->getPost('idnivel');
        $parametros->dirigentes = $this->_request->getPost('hedirigentesfip');
        $parametros->participantes = $this->_request->getPost(
            'heparticipantesfip'
        );
        $parametros->emite = $this->_request->getPost('heemitefip');
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayfechascontrol = json_decode(
            stripslashes($this->_request->getPost('arrayfechascontrol'))
        );
        $parametros->idtipoelemento = 2;
        $parametros->eshija = $this->_request->getPost('eshija');
        $parametros->idfippadre = $this->_request->getPost('idfippadre');
        $parametros->numfip = $this->_request->getPost('numfip');
        $parametros->documentos = json_decode(
            stripslashes($this->_request->getPost('documentos'))
        );
        $objcmpgestionarfipesmodel = new CmpgestionarfipModel();
        $respuesta = $objcmpgestionarfipesmodel->AdicionarFip($parametros);
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para modificar los FIP
     */
    function modificarfipAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost(
            'tfdenominacionfip'
        );
        $parametros->descelemento = $this->_request->getPost(
            'hedescripcionfip'
        );
        if ($this->_request->getPost('porcientocumpfip') == "") {
            $parametros->gradocumplimiento = 0;
        } else {
            $parametros->gradocumplimiento
                = $this->_request->getPost('porcientocumpfip') * 1;
        }
        $parametros->fechaemision = $this->_request->getPost('femifip');
        $parametros->fechacumplimiento = $this->_request->getPost('fcumpfip');
        $parametros->fechacumplio = $this->_request->getPost('fcumpliofip');
        if (!$parametros->fechacumplio || $parametros->fechacumplio == '') {
            $parametros->fechacumplio = null;
        }
        $parametros->idtipo = $this->_request->getPost('idtipo');
        $parametros->idnivel = $this->_request->getPost('idnivel');
        $parametros->dirigentes = $this->_request->getPost('hedirigentesfip');
        $parametros->participantes = $this->_request->getPost(
            'heparticipantesfip'
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayinvolucradoseliminar = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucradoseliminar'))
        );
        $parametros->emite = $this->_request->getPost('heemitefip');
        $parametros->idtipoelemento = 2;
        $parametros->eshija = $this->_request->getPost('eshija');
        $parametros->idfippadre = $this->_request->getPost('idfippadre');
        $parametros->numfip = $this->_request->getPost('numfip');
        $parametros->idfip = $this->_request->getPost('idfip');
        $parametros->documentos = json_decode(
            stripslashes($this->_request->getPost('documentos'))
        );
        $objcmpgestionarfipesmodel = new CmpgestionarfipModel();
        $respuesta = $objcmpgestionarfipesmodel->ModificarFip($parametros);

        if ($respuesta == 1) {

            $objhisto->denelemento = $parametros->denelemento;
            $objhisto->descelemento = $parametros->descelemento;
            $objhisto->dirigente = '';
            $objhisto->gradocumplimiento = $parametros->gradocumplimiento;
            $objhisto->participante = '';

            $objcambiohorario->fechainicio = $parametros->fechaemision;
            $objcambiohorario->fechafin = $parametros->fechacumplimiento;

            $objNotificacion = new CmpnotificacionesModel();
            $accion = 2;
            $idelemento = $parametros->idfip;
            $idtipoelemento = 2;
            $idautor = $parametros->idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                $objcambiohorario, $objhisto, ''
            );
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para eliminar las FIP
     */
    function eliminarfipAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayidfips = json_decode(
            stripslashes($this->_request->getPost('arrayidfips'))
        );

        $objNotificacion = new CmpnotificacionesModel();
        $arrayNotif = array();
        $accion = 3;
        $idtipoelemento = 2;
        $idautor = $idusuariosession;
        $fecha = date('d/m/Y H:i:s');

        foreach ($arrayidfips as $idelemento) {
            //***historial***
            $objhistoantes = Doctrine::getTable('DatElementos')->find(
                $idelemento
            );
            $objhisto->denelemento = $objhistoantes->denelemento;
            $objhisto->descelemento = $objhistoantes->descelemento;
            $objhisto->dirigente = $objhistoantes->dirigente;
            $objhisto->gradocumplimiento = $objhistoantes->gradocumplimiento;
            $objhisto->participante = $objhistoantes->participante;

            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, '', $objhisto, ''
            );
        }

        $objcmpgestionarfipmodel = new CmpgestionarfipModel();
        $respuesta = $objcmpgestionarfipmodel->EliminarFip(
            $arrayidfips, $idusuariosession
        );
        if ($respuesta == 0) {
            if (!empty($arrayNotif)) {
                $objNotificacion->eliminarArrayNotificaciones($arrayNotif);
            }
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para cargar el combo con los tipos de fip
     */
    function cargartiposfipAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 4;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idtipo'       => $val['idnomenclador'],
                                      'denominacion' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Accion para cargar el combo con losniveles de acceso del fip
     */
    function cargarnivelaccesoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 7;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idnivel'      => $val['idnomenclador'],
                                      'denominacion' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Funcion para cargar una actividad en el formulario
     */
    function cargarformfipAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idfip = $this->_request->getPost('idfip');
        $objelemento = Doctrine::getTable('DatElementos')->find($idfip);
        if (isset($objelemento->idelemento)) {
            $objfip = Doctrine::getTable('DatFip')->find($idfip);
            $objcmpelementosmodel = new CmpgestionarelementoModel();
            $nivelacceso = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
                $idfip, 7, 2
            );
            $tipofip = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
                $idfip, 4, 2
            );
            $dat->data [] = array(
                'idfip'              => $objfip->idfip,
                'idelemento'         => $objelemento->idelemento,
                'autor'              => $this->pIntegrator->configuracionpdo->
                getDenominacionIdUsuario($objelemento->idusuariocrea, 'usuario', null),/*$this->integrator->seguridad->nombreUsuario(
                    $objelemento->idusuariocrea
                ),*/
                'denominacion'       => $objelemento->denelemento,
                'descripcion'        => empty($objelemento->descelemento) ? ''
                    : $objelemento->descelemento,
                'dirigentes'         => empty($objelemento->dirigente) ? ''
                    : $objelemento->dirigente,
                'participantes'      => empty($objelemento->participante) ? ''
                    : $objelemento->participante,
                'emite'              => empty($objfip->emite) ? ''
                    : $objfip->emite,
                'numfip'             => $objfip->numfip,
                'fechaemision'       => $objfip->fechaemision,
                'fechacumplimiento'  => $objfip->fechacumplimiento,
                'fechacumplio'       => $objfip->fechacumplio,
                'nivelacceso'        => array('idnivel'      => $nivelacceso->idnomenclador,
                                              'denominacion' => $nivelacceso->dennomenclador),
                'tipo'               => array('idtipo'       => $tipofip->idnomenclador,
                                              'denominacion' => $tipofip->dennomenclador),
                'gradocumplimiento'  => $objelemento->gradocumplimiento,
                'estadocumplimiento' => $objelemento->estadocumplimiento,
                'mensaje'            => 1
            );
            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Funcion para mostrar el desgloce del fip
     */
    public function desglozarfipAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arraydatos->idelemento = $this->_request->getPost('idelemento');
        $arraydatos->idplan = $this->_request->getPost('idplan');
        $arraydatos->idtipoelemento = $this->_request->getPost(
            'idtipoelemento'
        );
        $arraydatos->trinomio = $this->_request->getPost('trinomio');
        $arraydatos->idfip = $this->_request->getPost('idfip');
        $arraydatos->idusuario = $this->global->Perfil->idusuario;
        $objcmpelmodel = new CmpgestionarelementoModel();
        $arrayelementos = $objcmpelmodel->DezglozarElementos($arraydatos);

        echo json_encode($arrayelementos);
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
   * Accion para enviar correo
   */
  function enviarCorreoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros = new stdClass();
    $parametros->arrayidfips = json_decode(
      stripslashes($this->_request->getPost('arrayidfips'))
    );
    $parametros->idusuariocrea = $this->global->Perfil->idusuario;
    $parametros->idpersona = $this->global->Perfil->idpersona;

    $objcmpgestionaractividadesModel = new CmpgestionaractividadesModel();
    $respuesta=0;
    try {
      //Envio de notificacion por email
      $parametros->emails = array();
      $parametros->body = '';
      $parametros->body .= '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
        . "Estado de lo(s) siguiente(s) fip(s): <br><br>";
      foreach ($parametros->arrayidfips as $pos => $idfip){
        $parametros->body .= ($pos==0)?'':
          '----------------------------------------------------------------<br><br>';
        $objelemento = Doctrine::getTable('DatElementos')->find(
          $idfip
        );

        $objfip = Doctrine::getTable('DatFip')->find(
          $idfip
        );

        $parametros->idelemento = $objelemento->idelemento;
        $parametros->denelemento = $objelemento->denelemento;
        $parametros->descelemento = $objelemento->descelemento;
        $parametros->dirigente = $objelemento->dirigente;
        $parametros->gradocumplimiento = $objelemento->gradocumplimiento;
        $parametros->participante = $objelemento->participante;

        $parametros->fechacumplimiento = $objfip->fechacumplimiento;
        $parametros->fechacumplio = $objfip->fechacumplio;
        $parametros->fechaemision = $objfip->fechaemision;

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
            = ($datosautor->data[0]['nombreapellidos']);
        } else {
          $usuarioautor
                 = $this->integrator->seguridad->nombreUsuario(
            $objelemento->idusuariocrea
          );
          $autor = $usuarioautor;
        }


        $parametros->body .= '<b>CAR: </b>' . $parametros->idelemento . '<br>
                                <b>Denominaci&oacute;n: </b>'
          . $parametros->denelemento . '<br>
                                <b>Estado de cumplimiento: </b>'
          . $objelemento->estadocumplimiento . '<br>
                                <b>Descripci&oacute;n: </b>'
          . $parametros->descelemento . '<br>
                                <b>Fecha de cumplimiento: </b>'
          . $parametros->fechacumplimiento . '<br>
                                <b>Fecha de cumplido: </b>' . $parametros->cumplio . '<br>
                                <b>Fecha de emisi&oacute;n: </b>'
          . $parametros->fechaemision . '<br>
                                <b>Autor: </b>' . $autor . '<br><br>';



        $emailinvolucrados = array();
        $arrayInvolucrados
                           = DatElementosDatInvolucrados::datosRelacionElemInvolColumn(
          $idfip
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

        $parametros->idelemento = $idfip;
        $emailparticipantes = self::extract_email_address(
          $objelemento->participante
        );
        $emaildirigentes = self::extract_email_address($objelemento->dirigente);
        $parametros->emails = array_merge(
          $parametros->emails, $emailparticipantes, $emaildirigentes, $emailinvolucrados
        );

        $respuesta++;
      }
      $parametros->asunto = "Estado de los fip(s)";
      $parametros->body .= " <br><i>No responder este correo. Enviado desde el Sistema de Planificaci&oacute;n.</i></p>";

      $envio = $objcmpgestionaractividadesModel->enviarCorreo($parametros);

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

    }
    catch (Exception $e) {
//      print_r($e->getMessage());die;
      $respuesta = -1;
      $notice = $e->getMessage();
    }
    echo json_encode(array('mensaje' => $respuesta, 'notice' => $notice, 'error' => $error));
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
