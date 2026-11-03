<?php

require_once __DIR__ . '/../../planmeta/controllers/AnalisisplanificacionController.php';

class AnalisisplanificacionsisplaninversionesController extends AnalisisplanificacionController
{
    public function init() {
        parent::init();
    }

    //Datos para graficar el tab Act-Niveles de actividad
    public function graficarActNivelesActividadAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplaninversionesModel();
        echo json_encode($modelAnalisisplanificacion->actNivelesActividad($this->_request->getPost()));
    }

    //Datos para graficar el tab Niveles de actividad
    public function graficarNivelesActividadAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplaninversionesModel();
        echo json_encode($modelAnalisisplanificacion->nivelesActividad($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - global * entidad
    public function graficarCENAglobalEntidadAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplaninversionesModel();
        echo json_encode($modelAnalisisplanificacion->graficarCENAglobalEntidad($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - mas valiosas
    public function graficarCENAMasValiosasAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplaninversionesModel();
        echo json_encode($modelAnalisisplanificacion->CENAmasValiosos($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - mas ejecutadas
    public function graficarCENAMasEjecutadasAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplaninversionesModel();
        echo json_encode($modelAnalisisplanificacion->CENAmasMenosEjecutados($this->_request->getPost()));
    }

    //Datos para graficar el tab CE - NA - total * entidad
    public function graficarCENAtotalEntidadAction()
    {
        $modelAnalisisplanificacion = new AnalisisplanificacionsisplaninversionesModel();
        echo json_encode($modelAnalisisplanificacion->graficarCENATotal($this->_request->getPost()));
    }

}
