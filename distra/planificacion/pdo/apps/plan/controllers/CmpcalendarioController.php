<?php

/**
 * Controlador para el control de elementos en el calendario
 *
 * @author    Luis Angel Del Rosario Guevara
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpcalendarioController extends ZendExt_Controller_Secure
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
    function cmpcalendarioAction()
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
     * Accion para cargar los elementos en el calendario
     */
    function cargarelementoscalendarioAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
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
            stripslashes($this->_request->getPost('arraytiposact'))
        );
        $parametros->arrayelementostributa = json_decode(
            stripslashes($this->_request->getPost('arrayelementostributa'))
        );
        $objcmpcalendariomodel = new CmpcalendarioModel();
        $arrayactividades = $objcmpcalendariomodel->CargarElementosCalendario(
            $parametros
        );
        if (isset($arrayactividades[0])) {
            echo json_encode(
                array('data'  => $arrayactividades,
                      'total' => count($arrayactividades))
            );
        } else {
            echo json_encode(array('data' => array()));
        }
    }


    /**
     * Funcion para cargar el combo de estados de aprobacion de los objetivos
     */
    function cargarcmbestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        //esto es provisional
        $idtipodoc = 3;//$this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idusuariosession, $idtipodoc
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }


}
