<?php

/**
 * Controlador para el control de elementos en el calendario
 **
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
$address = dirname(dirname(__FILE__));
$address = str_ireplace('o/plan', 'o/comun/recursos/', $address);
include_once($address . 'IcalExporter.php');


class CmpcalendarionuevoController extends ZendExt_Controller_Secure
{


    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }


    /**
     * Accion para mostrar la vista calendario.phtml
     */
    function cmpcalendarionuevoAction()
    {
//        try {
//            $usargd = false; //$this->pIntegrator->planpdo->verificarGestorDoc();
//        } catch (Exception $e) {
//            $usargd = false;
//        }
//        if ($usargd) {
//            $this->view->gestdoc
//                = $this->integrator->gestordocumental->devolverJSContenido();
//            $this->view->usarGD = '<script> var usarGD = false; </script>';
//        } else {
//            $this->view->usarGD = '<script> var usarGD = false; </script>';
//            $this->view->gestdoc = '';
//        }
        $this->render();
    }


    /**
     * Accion para cargar los calendarios iniciales del usuario
     */
    function cargarcalendariosinicialesAction()
    {
        $arraycalendarios = array();
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->nolimit = 1;
        $parametros->actual = ($this->_request->getPost('actual'))
            ? $this->_request->getPost('actual') : 0;
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
     * Accion para cargar las actividades a mostrar en el calendario
     */
    //function cargaractividadesAction() {
//		
//		for($i = 0;$i < 6;$i++)
//		{
//			$pos = $i+1;
//			$arrayactividades[$i]["idactividad"] = $i+1;
//			$arrayactividades[$i]["cid"] = 1;
//			$arrayactividades[$i]["title"] = "Actividad_Numero_".$i;
//			$arrayactividades[$i]["start"] = "2013-0".$pos."-05 08:30:00";
//			$arrayactividades[$i]["end"] = "2013-0".$pos."-05 08:30:00";
//			$arrayactividades[$i]["ad"] = "false";
//		}
//		echo json_encode(array("campos"=>$arrayactividades,"total"=>5));
//	}


    /**
     * Accion para cargar los elementos en el calendario
     */

    function CargarElementosCalAction()
    {
        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->idconfiguracion = $this->_request->getPost(
            'idconfiguracion'
        );
        $parametros->actual = $this->_request->getPost('actual');
        //$parametros->personal = 1;
        $parametros->personal = ($this->_request->getPost('personal') == 0) ? 0 : 1;
        $parametros->idcalendario = json_decode(
            stripslashes($this->_request->getPost('idcalendario'))
        );
        $parametros->busqueda = json_decode(
            stripslashes($this->_request->getPost('busqueda'))
        );
        $fechainicio = $this->_request->getPost('start');
        $fechafin = $this->_request->getPost('end');
        $filista = explode('-', $fechainicio);
        $fflista = explode('-', $fechafin);
        $parametros->fechainicio
            = $filista[1] . '/' . $filista[0] . '/' . $filista[2];
        $parametros->fechafin
            = $fflista[1] . '/' . $fflista[0] . '/' . $fflista[2];

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

        $guardarCal = $this->_request->getPost('guardarCal');

        if (!isset($parametros->arrayautores[0])){
            $autor->idautor = $parametros->idusuariosession;
            $parametros->arrayautores[0] = $autor;
        }
        $objcmpcalendariomodel = new CmpcalendarionuevoModel();
        $arrayactividades = $objcmpcalendariomodel->CargarElCalendario($parametros);
        
        if ($guardarCal) {
            $objcmpintercambio = new CmpIntercambioModel();
            $idusuario = $parametros->idusuariosession;
            $arrayidelementos = array_column($arrayactividades, 'idelemento');
            $export = new ICalExporter();
            $respuesta = $objcmpintercambio->ExportarElementos(
                $idusuario, $arrayidelementos, $tipoelemento = 3,
                $opcionformato = '.ics',
                $relacionEntreElem = 0, $descendencia = 0,
                $repeticiones = 0, $sincronizar = 0,
                $dominioSincronizar = '', $escenario = '', $export, $guardarCal
            );
            echo json_encode(array('mensaje' => $respuesta));
        } else {
            if (isset($arrayactividades[0])) {
                echo json_encode(array('data' => $arrayactividades));
            } else {
                echo json_encode(array('data' => array()));
            }
        }

    }

    function cargarelementoscalendarioAction()
    {
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

        $objcmpcalendariomodel = new CmpcalendarionuevoModel();
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
    function verificarformatoshoraAction()
    {
        $objcalmodel = new CmpcalendarionuevoModel();
        $respuesta = $objcalmodel->VerificarHorarioFormato();
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function modificarSoloDiasActividadAction()
    {
        $parametros->idactividad = $this->_request->getPost('idactividad');
        $parametros->fechainicio = $this->_request->getPost('finiact');
        $parametros->fechafin = $this->_request->getPost('ffinact');
        $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
        $respuesta = $objcmpgestionaractividadesmodel->ModificarFechaActividad(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function modificarHorarioActAction()
    {
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

    public function modificarHorarioFechaActividadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idactividad = $this->_request->getPost('idactividad');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->horainicio = $this->_request->getPost('horainicio');
        $parametros->horafin = $this->_request->getPost('horafin');
        $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
        $respuesta = $objcmpgestionaractividadesmodel->actualizarHorarioFechaAct(
            $parametros
        );
        //para generar notificaciones (ARA)
        if ($respuesta) {
            $objNotificacion = new CmpnotificacionesModel();
            $accion = 2;
            $idelemento = $parametros->idactividad;
            $idtipoelemento = 3;
            $idautor = $this->global->Perfil->idusuario;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha
            );
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

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
}
