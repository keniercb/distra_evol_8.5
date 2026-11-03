<?php

/**
 * Controlador para exportar-importar datos
 *
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmppuntualizacionController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista notificaciones.phtml
     */
    function cmppuntualizacionAction()
    {
        try {
            $usargd = $this->pIntegrator->planpdo->verificarGestorDoc();
        } catch (Exception $e) {
            $usargd = false;
        }
        if ($usargd) {
            $this->view->gestdoc
                = '';//$this->integrator->gestordocumental->devolverJSContenido();
            $this->view->usarGD = '<script> var usarGD = false; </script>';
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }
        $this->render();
    }

  /**
   * Accion para mostrar la vista notificaciones.phtml
   */
  function cambiarEstPuntualizacionAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $idusuariosession = $this->global->Perfil->idusuario;
    $arrayidpuntualizacion = json_decode(
      stripslashes($this->_request->getPost('arrayidpuntualizacion'))
    );
    $idestado = $this->_request->getPost('idestadofinal');
    $objpuntdmodel = new CmpgestionarpuntualizacionModel();
    $respuesta=$objpuntdmodel->cambiarEstPuntualizacion($idusuariosession, $idestado, $arrayidpuntualizacion);
    echo json_encode(array('mensaje' => $respuesta));
  }

    function cargarpuntualizacionAction()
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
        $objpuntdmodel = new CmpgestionarpuntualizacionModel();
        $arrayactividades = $objpuntdmodel->CargarPuntualizacion(
            $idactividad, $idusuario, $idelementotributa, $enaprobacion,
            $arrayautores, $arrayinvolucrados, $categact, $tipoact, $start,
            $limit, $idtipoelementotributa, $idtipoelementotributasuperior,
            $busqueda, $arrayelementosrelacionados, $filtros, $parametros, 3
        );

        if (isset($arrayactividades['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $arrayactividades['total'],
                      'campos'  => $arrayactividades['resultado'])
            );
        }
        if (!isset($arrayactividades)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    function compActualActividadAction($parametros)
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idactividad');
        // $parametros->idpuntual = $this->_request->getPost('idpuntualizacion');
        // $parametros->punt = $this->_request->getPost('puntualizacion');


        $model = new CmphistorialModel();
        $actual = $model->comActualActividad($parametros);
        //rint_r($actual);die;
        $parametros->idelemento = $this->_request->getPost('idpuntualizacion');;
        $seleccionada = $model->comActualActividad($parametros);
        echo json_encode(
            array('seleccionada' => $seleccionada, 'actual' => $actual[0])
        );
    }

    function adicionarPuntualizacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idrecursoasociado = json_decode(
            stripslashes($this->_request->getPost('asociados'))
        );
        $parametros->accion = $this->_request->getPost('accion');

        $parametros->documentos = json_decode(
            stripslashes($this->_request->getPost('documentos'))
        );
        $parametros->denelemento = json_decode(
            stripslashes($this->_request->getPost('denominactividad'))
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
            'tiempoestimado'
        );
        $parametros->criterioeval = $this->_request->getPost('criterioeval');

        $objcmpgestionaractividadesmodel = new CmpgestionarpuntualizacionModel(
        );
        $respuesta = $objcmpgestionaractividadesmodel->adicionarPuntualizacion(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function eliminarPuntualizacionAction()
    {

        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayidactividades = json_decode(
            stripslashes($this->_request->getPost('arrayidactividades'))
        );
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
        foreach ($arrayidactividades as $idelemento) {
            //***historial***
            $objhistoantes = Doctrine::getTable('DatElementos')->find(
                $idelemento
            );
            $objhisto->denelemento = $objhistoantes->denelemento;
            $objhisto->descelemento = $objhistoantes->descelemento;
            $objhisto->dirigente = $objhistoantes->dirigente;
            $objhisto->gradocumplimiento = $objhistoantes->gradocumplimiento;
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
            $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
                $parametros
            );
            $involucradoshisto = Doctrine::getTable(
                'DatElementosDatInvolucrados'
            )->findByDql("idelemento = '$idelemento'");
            $arrayinvolucrados = array();
            foreach ($involucradoshisto as $involucrado) {
                $involucradosuser = Doctrine::getTable('DatInvolucrados')->find(
                    $involucrado->idinvolucrado
                );
                $arrayinvolucrados[] = $involucradosuser->idusuario;
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);
            //*** fin historial***
            $arrayNotif[] = $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                $objcambiohorario, $objhisto, $involucradoshisto
            );
        }
        $respuesta = $objcmpgestionaractividadesmodel->EliminarActividades(
            $arrayidactividades, $idusuariosession, $idtipoelemento
        );
        if ($respuesta != 1) {
            if (isset($arrayNotif)) {
                $objNotificacion->eliminarArrayNotificaciones($arrayNotif);
            }
        }
        echo json_encode(array('mensaje' => $respuesta = 1));
    }

}

