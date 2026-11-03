<?php

require_once __DIR__ . '/../../planmeta/controllers/AnalisisplanificacionController.php';

class AnalisisplanificacionsisplanproduccionesController extends AnalisisplanificacionController {

    //Datos para graficar el tab Act-Niveles de actividad
    public function graficarActNivelesActividadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->actNivelesActividad($this->_request->getPost()));
    }

    //Datos para graficar el tab Niveles de actividad
    public function graficarNivelesActividadAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->nivelesActividad($this->_request->getPost()));
    }

    //Datos para cargar combo de variables de control
    public function listarVariablesAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->listarVariables($this->_request->getPost()));
    }

    //Datos para cargar la grafica Ocupación de la capacidad por variable
    public function graficarOcupacionCapacidadPorVariableAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->graficarOcupacionCapacidadPorVariable($this->_request->getPost()));
    }

    //Datos para cargar la grafica Producción mensual por producto 
    public function graficarProduccionMensualPorProductoAction() {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplanproduccionesModel();
        echo json_encode($modelAnalisisplanificacion->graficarProduccionMensualPorProducto($this->_request->getPost()));
    }

}
