<?php

require_once __DIR__ . '/../../planmeta/controllers/AnalisisplanificacionController.php';

class AnalisisplanificacionsisplanproduccionesController extends AnalisisplanificacionController
{

    //Datos para graficar el tab Act-Niveles de actividad
    public function graficarActNivelesActividadAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->actNivelesActividad($this->_request->getPost()));
    }

    //Datos para graficar el tab Niveles de actividad
    public function graficarNivelesActividadAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->nivelesActividad($this->_request->getPost()));
    }

    //Datos para cargar combo de variables de control
    public function listarVariablesAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->listarVariables($this->_request->getPost()));
    }

    //Datos para cargar la grafica Ocupación de la capacidad por variable
    public function graficarOcupacionCapacidadPorVariableAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->graficarOcupacionCapacidadPorVariable($this->_request->getPost()));
    }

    //Datos para cargar la grafica Producción mensual por producto 
    public function graficarProduccionMensualPorProductoAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->graficarProduccionMensualPorProducto($this->_request->getPost()));
    }

    //Datos para cargar el Grid de Producciones por etapas
    public function graficarProduccionPorEtapasAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        $data = $modelAnalisisplanificacion->graficarProduccionPorEtapas($this->_request->getPost());
        echo json_encode(array('data' => $data, 'total' => count($data)));

    }

    public function listarEtapasProduccionesAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        $data = $modelAnalisisplanificacion->listarEtapasProducciones($this->_request->getPost());
        echo json_encode(array('data' => $data, 'total' => count($data[0])));

    }

    public function graficarOcupacionCampoXCultivoAction()
    {
        $idvariable = $this->_request->getPost('idvariable');
        if (empty($idvariable)) {
            echo json_encode(array('data' => array(), 'total' => 0, 'codMsgN' => 2));
        } else {
            $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
            $data = $modelAnalisisplanificacion->listarcampoXcultivo($this->_request->getPost());
            echo json_encode(array('data' => $data['data'], 'meses' => $data['meses'], 'variable' => $data['variable'], 'capacidad' => $data['capacidad']));
        }
    }

    public function listarProduccionesRecursosPorMesAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        $data = $modelAnalisisplanificacion->listarProduccionesRecursosPorMes($this->_request->getPost());
        echo json_encode(array('data' => $data['datos'], 'meses' => $data['meses'], 'total' => count($data['datos'])));


    }

    public function listarRecursosProduccionesPorMesAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        $data = $modelAnalisisplanificacion->listarRecursosProduccionesPorMes($this->_request->getPost());
        echo json_encode(array('data' => $data, 'total' => count($data)));


    }

    public function listarNomencladorMesAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        $data = $modelAnalisisplanificacion->listarNomencladorMes($this->_request->getPost());
        echo json_encode(array('data' => $data, 'total' => count($data)));


    }

    public function listarMesesAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        $data = $modelAnalisisplanificacion->listarMeses($this->_request->getPost());
        echo json_encode(array('data' => $data, 'total' => count($data)));


    }


}
