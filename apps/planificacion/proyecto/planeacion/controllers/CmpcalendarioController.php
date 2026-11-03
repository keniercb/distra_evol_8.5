<?php

/**
 * Controlador para el control de elementos en el calendario
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpcalendarioController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase
     */
    function init() {
        parent::init();
    }

    /* public function setearIncludePath() {
      $dir = split("apps/", __FILE__);
      //apps/planificacion/pdo/plan
      $dir_abs_mt = $dir[0];
      $include_path =
      PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain' . DIRECTORY_SEPARATOR . 'generated'
      . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain'
      . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'bussines';
      set_include_path(get_include_path() . $include_path);
      } */

    /**
     * Accion para mostrar la vista calendario.phtml
     */
    function cmpcalendarioAction() {
        //$this->view->gestdoc = $this->integrator->gestordocumental->devolverJSContenido();
        /*if ($this->pIntegrator->planpdo->verificarGestorDoc()) {
            $this->view->gestdoc
                    = ''; //$this->integrator->gestordocumental->devolverJSContenido();

            $this->view->usarGD = '<script> var usarGD = false; </script>';
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }*/

       /* $this->view->usarGD = '<script> var usarGD = false; </script>';
        $this->view->gestdoc = '';*/
        $this->render();
    }

    /**
     * Accion para cargar los calendarios iniciales del usuario
     */
    function cargarcalendariosinicialesAction() {
        $arraycalendarios = array();
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->nolimit = 1;
        $parametros->actual = ($this->_request->getPost('actual')) ? $this->_request->getPost('actual') : 0;
        $parametros->idconfiguracion = $this->_request->getPost(
                'idconfiguracion'
        );
        $arraycalendarios
                = $this->pIntegrator->configuracionpdo->listarCalendariosConfigurados(
                $parametros
        );
        if (count($arraycalendarios) > 0) {
            echo json_encode($arraycalendarios);
        } else {
            echo json_encode(array());
        }
    }

    /**
     * Accion para cargar los elementos en el calendario
     */
    function CargarElementosCalAction() {

        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $parametros->idproyecto = $this->_request->getPost('idproyecto');
        $parametros->idhito = $this->_request->getPost('idhito');

        $parametros->personal = 1;
        $parametros->busqueda = json_decode(stripslashes($this->_request->getPost('busqueda')));

        $fechainicio = $this->_request->getPost('start');
        $fechafin = $this->_request->getPost('end');
        $filista = explode('-', $fechainicio);
        $fflista = explode('-', $fechafin);

        $parametros->fechainicio = $filista[1] . '/' . $filista[0] . '/' . $filista[2];
        $parametros->fechafin = $fflista[1] . '/' . $fflista[0] . '/' . $fflista[2];

        $parametros->arrayinvolucrados = json_decode(stripslashes($this->_request->getPost('arrayinvolucrados')));
        $parametros->arrayautores = json_decode(stripslashes($this->_request->getPost('arrayautores')));

        $objcmpcalendariomodel = new CmpcalendarioModel();
        $arrayactividades = $objcmpcalendariomodel->CargarElCalendario($parametros);

        if (isset($arrayactividades[0])) {
            echo json_encode(array('data' => $arrayactividades));
        } else {
            echo json_encode(array('data' => array()));
        }
    }

    function cargarelementoscalendarioAction() {
        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->personal = $this->_request->getPost('personal');
        $parametros->idcalendario = $this->_request->getPost('idcalendario');
        $parametros->busqueda = $this->_request->getPost('busqueda');
        $parametros->fechainicio = json_decode(
                stripslashes($this->_request->getPost('fechainicio'))
        );
        $parametros->fechafin = json_decode(
                stripslashes($this->_request->getPost('fehchafin'))
        );
        $parametros->arrayinvolucrados = json_decode(
                stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayautores = json_decode(
                stripslashes($this->_request->getPost('arrayautores'))
        );
        $parametros->arraycategoriasact = json_decode(
                stripslashes($this->_request->getPost('arraycategoriasact'))
        );
        $parametros->arraytipoact = json_decode(
                stripslashes($this->_request->getPost('arraytipoact'))
        );
        $parametros->arrayelementostributa = json_decode(
                stripslashes($this->_request->getPost('arrayelementostributa'))
        );
        $objcmpcalendariomodel = new CmpcalendarioModel();
        $arrayactividades = $objcmpcalendariomodel->CargarElementosCalendario(
                $parametros
        );
        if (isset($arrayactividades[0])) {
            echo json_encode(array('data' => $arrayactividades));
        } else {
            echo json_encode(array('data' => array()));
        }
    }

    /**
     * Accion para verificar el formato de la shoras de la actividades
     * esto es un parche a utilziar solo una vez
     */
    function verificarformatoshoraAction() {
        $objcalmodel = new CmpcalendarioModel();
        $respuesta = $objcalmodel->VerificarHorarioFormato();
        echo json_encode(array('mensaje' => $respuesta));
    }

    function modificarSoloDiasActividadAction() {

        $parametros->idtarea = $this->_request->getPost('idtarea');
        $parametros->fechainicio = $this->_request->getPost('finiact');
        $parametros->fechafin = $this->_request->getPost('ffinact');

        $objModel = new CmpgestionartareaModel();
        $respuesta = $objModel->ModificarFechaActividad($parametros);
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function modificarHorarioActAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idactividad = $this->_request->getPost('idactividad');
        $horainicio = $this->_request->getPost('horainicio');
        $horafin = $this->_request->getPost('horafin');
        $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
        $respuesta = $objcmpgestionaractividadesmodel->actualizarHorarioAct(
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

    function cargarcmbestadosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = 3; //$this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuariosession, $idtipodoc
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    function cargarTareasDadoHitoAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = 3; //$this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuariosession, $idtipodoc
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    function cargarTareasDadoProyectoAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = 3; //$this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuariosession, $idtipodoc
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    function cargarTareasAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = 3; //$this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuariosession, $idtipodoc
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    function obtenerreporteAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $parametros->nombreusuario = $this->global->Perfil->usuario;
        $parametros->valueanno = $this->_request->getPost('valueanno');
        $parametros->textomeses = $this->_request->getPost('valuetextomeses');
        $parametros->valuemeses = $this->_request->getPost('valuenummeses');

        $parametros->idopcion = $this->_request->getPost('idopcion');
        $parametros->orientacionhoja = $this->_request->getPost('orientacionhoja');
        $parametros->altohoja = $this->_request->getPost('altohoja');
        $parametros->anchohoja = $this->_request->getPost('anchohoja');
        $parametros->tipoletra = $this->_request->getPost('tipoletra');
        $parametros->tamanoletra = $this->_request->getPost('tamanoletra');

        $parametros->posicionaprobado = explode("px", $parametros->tamanoletra);
        $parametros->posicionaprobado = $parametros->posicionaprobado[0] + 2;

        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $filista = explode('-', $fechainicio);
        $fflista = explode('-', $fechafin);

        $parametros->fechainicio = $filista[1] . '/' . $filista[0] . '/' . $filista[2];
        $parametros->fechafin = $fflista[1] . '/' . $fflista[0] . '/' . $fflista[2];

        $parametros->idtiporeporte = $this->_request->getPost('idtiporeporte');
        switch ($parametros->idtiporeporte) {
            case 5:
                $parametros->idtipoelemento = 1;
                break;
            case 8:
                if (!$parametros->textomeses) {
                    $parametros->textomeses = $this->traducirMesEsp();
                }
                if (!$parametros->valuemeses) {
                    $parametros->valuemeses = date("m");
                }
                $parametros->idtipoelemento = 3;
                break;
            default:
                $parametros->idtipoelemento = 3;
        }
        $parametros->idversionreporte = $this->_request->getPost('idversionreporte');
        $parametros->versionadoSelecionado = $this->_request->getPost('versionadoSelecionado');
        $parametros->confidencialidad = $this->_request->getPost('confidencialidad');
        $parametros->tituloreporte = $this->_request->getPost('tituloreporte');

        $parametros->arrayinvolucrados = json_decode(stripslashes($this->_request->getPost('arrayinvolucrados')));
        $parametros->arrayautores = json_decode(stripslashes($this->_request->getPost('arrayautores')));

        $objcmpcalendariomodel = new CmpcalendarioModel();
        $cuerporeporte = $objcmpcalendariomodel->ObtenerReporte($parametros);

        echo json_encode($cuerporeporte);
    }

}
