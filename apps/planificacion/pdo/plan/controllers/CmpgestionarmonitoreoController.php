<?php

/**
 * Controlador para gestionar actividades
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarmonitoreoController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionaractividades.phtml
     */
    function cmpgestionarmonitoreoAction()
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
        // $this->view->perfil = $this->pIntegrator->configuracionpdo->getJsPerfil();
        $this->render();
    }

    public function insertaralarmaAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->fechainicio = $this->_request->getPost('fecha');
        $parametros->asunto = $this->_request->getPost('asunto');
        $parametros->cantdiashoras = $this->_request->getPost('cantdias');
        $parametros->estadoaprov = $this->_request->getPost('estadoaprov');
        $parametros->estadocump = $this->_request->getPost('estadocump');
        $parametros->hora = $this->_request->getPost('hora');
        $parametros->operador = $this->_request->getPost('operad');
        $parametros->iguala = $this->_request->getPost('igualporc');
        $parametros->mayorque = $this->_request->getPost('mayorporc');
        $parametros->menorque = $this->_request->getPost('menorporc');
        $parametros->vianotificacion = $this->_request->getPost('vianotificacion');
        $parametros->involucrados = json_decode(
            stripslashes($this->_request->getPost('involucrados'))
        );
        $parametros->porciento = $this->_request->getPost('porciento');
        $parametros->tipoaviso = $this->_request->getPost('tipoaviso');
        $objactmodel = new CmpgestionmonitoreoModel();// new CmpgestionaractividadesModel();
        $respuesta = $objactmodel->InsertarAlarma($parametros);
        echo json_encode($respuesta);
    }

    public function eliminaralarmaAction()
    {
        ini_set("max_execution_time", 3600);
        $objactmodel = new CmpgestionmonitoreoModel();
        $arrayalarmas = json_decode(
            stripslashes($this->_request->getPost('arrayalarmas'))
        );
        $respuesta = $objactmodel->eliminarAlarma(
            $arrayalarmas
        );
        echo json_encode($respuesta);
    }

    function verificarAlarmasPorIniciarAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idpersona = $this->global->Perfil->idpersona;
        $obj = new CmpgestionmonitoreoModel();
        $notificaciones = $obj->obtenerListadoAlarmas($parametros);
        echo json_encode(array('mensaje' => (count($notificaciones) > 0 ? 1 : 0), 'notificaciones' => $notificaciones));
    }

    public function cargarAlarmasAction()
    {
        ini_set("max_execution_time", 3600);
        $objactmodel = new CmpgestionmonitoreoModel();
        $respuesta = $objactmodel->listarAlarmas(
            $this->_request->getPost('idelemento')
        );
        if (isset($respuesta['resultado'][0])) {
            echo json_encode(
                array('success' => true, 'total' => $respuesta['total'],
                    'campos' => $respuesta['resultado'])
            );
        } else {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

  public function verificarAlarmaAction()
  {
    ini_set("max_execution_time", 3600);
    $parametros->idusuariocrea = $this->global->Perfil->idusuario;
    $parametros->idpersona = $this->global->Perfil->idpersona;
    $objactmodel = new CmpgestionmonitoreoModel();
    $respuesta = $objactmodel->verificarAlarma($parametros);

      echo json_encode(
        array('mensaje' => $respuesta)
      );

  }


}
