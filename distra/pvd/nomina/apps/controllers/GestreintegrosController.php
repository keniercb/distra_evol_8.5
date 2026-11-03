<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
/*Componente para gestionar el registro de Salarios y tiempo de servicio (SNC - 225)
 *@author 1er Tte. Frank Rodriguez Berroa
 *@email fberroa@xetid.cu
 */
class GestreintegrosController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista.
     */
    public function gestreintegrosAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
       // $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar el snc 225.
     */
   public function obtenerListadoReintegrosAction() {
        $idpersona = $this->_request->getPost('idpersona');
        $idestructura = $this->_request->getPost('idestructura');
        $objDomain = new DatReintegrosModel();
        $arrayreturn = $objDomain->obtenerListadoReintegros($idpersona, $idestructura);
        echo Zend_Json::encode(array('datos' => $arrayreturn, 'cantidad' => count($arrayreturn)));
    }

  /*  public function obtenerMesesAction(){
        echo json_encode(array('datos'=>NomMes::obteneTodosNomMes(), 'cantidad'=>count(NomMes::obteneTodosNomMes())));
    }

    /**
     * Accion para adicionar.
     */
   /* public function adicionarRegistroSalarioAction() {
        $idpersona = $this->_request->getPost('idpersona');
        $anno = $this->_request->getPost('anno');
        $mes = $this->_request->getPost('mes');
        $diasacum = $this->_request->getPost('diasacum');
        $salariodev = $this->_request->getPost('salariodev');
        $idestructura = $this->_request->getPost('idestructura');
        $objDomain = new GestRegistroSalarioTiempoServicioModel();
        $add = $objDomain->adicionarRegistroSalario($idpersona, $anno, $mes, $diasacum, $salariodev, $idestructura);
        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo json_encode($add);
    }

    /**
     * Accion para modificar un RegistroSalario.
     */
   /* public function modificarRegistroSalarioAction() {
        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codMsg':'1'}";
    }

    /**
     * Accion para eliminar.
     */
  /*  public function eliminarRegistroSalarioAction() {
        $idregistrosalariotiemposervicio = $this->_request->getPost('idregistrosalariotiemposervicio');
        $objDomain = new GestRegistroSalarioTiempoServicioModel();
        $delete = $objDomain->eliminarRegistroSalario($idregistrosalariotiemposervicio);
        echo json_encode($delete);
    }

    /**
     * Accion usada para obtener el reporte del snc 225.
     */
   /* public function exportarSNC225Action() {
        $idpersona = $this->_getParam('idpersona');
        $idestructura = $this->_getParam('idestructura');
        $model = new GestRegistroSalarioTiempoServicioModel();
        $respuesta = $model->exportarSNC225($idpersona, $idestructura);
        echo json_encode($respuesta);
    }*/

}
