<?php
require_once __DIR__ . '/../comun/lib/SVG/SVGHelper.php';

class AnalisisinversionesController extends ZendExt_Controller_Secure
{

    public function init()
    {
        // $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }


    public function analisisinversionesAction()
    {
        $jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    //Este metodo carga las entidades...
    public function cargarTreeNomencladoresAction()
    {
        $node = $this->_request->getPost('node');
        $valor = $this->_request->getPost('valor');
        $modelInversiones = new InversionesModel();
        echo json_encode($modelInversiones->cargarEntidades($node, $valor));
    }

    //Carga los ejercicios del sistema
    public function listarEjerciciosAction()
    {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    public function graficarControlEjecucionAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->controlEjecucion($this->_request->getPost()));
    }

    public function graficarFormaPropiedadYMonedasAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->formaPropiedadYMonedas($this->_request->getPost()));
    }

    public function graficarFinanciamientoAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->financiamiento($this->_request->getPost()));
    }

    public function graficarMasCostosasAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->inversionesMasCostosas($this->_request->getPost()));
    }

    public function graficarEquiposAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->equipos($this->_request->getPost()));
    }

    public function graficarMasEquiposAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->inversionesMasEquipos($this->_request->getPost()));
    }

    public function graficarTipoInversionAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->inversionesPorTipo($this->_request->getPost()));
    }

    public function graficarPlanPreparacionAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->inversionesPlanPreparacion($this->_request->getPost()));
    }

    public function graficarEquiposOrganoSatisfaceAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->EquiposOrganoSatisf($this->_request->getPost()));
    }

    public function graficarEquiposSectorEstrategicoAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->equiposSectorEstrategico($this->_request->getPost()));
    }

    public function graficarEquiposOrganoSectorEstrategicoAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->graficarEquiposOrganoSectorEstrategico($this->_request->getPost()));
    }

    public function graficarInversionesObjetivosAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->inversionesObjetivos($this->_request->getPost()));
    }

    public function graficarInversionesEfectosAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->inversionesEfecto($this->_request->getPost()));
    }

    public function graficarInversionesSectoresCuencasAction()
    {
        $modelAnalisisInversiones = new AnalisisInversionesModel();
        echo json_encode($modelAnalisisInversiones->inversionesSectores($this->_request->getPost()));
    }

    public function exportarGraficosAction()
    {
        $svg = $this->_request->getPost('svg');
        $model = new AnalisisInversionesModel();
        $anexosvg = $model->getBase64FromSvg($svg, $svg, $limpiar = false);
        print_r($anexosvg);die;

//        $anexosvg = str_replace('data:image/png;base64,', '', $anexosvg]);
        echo '<img src="data:image/jpg;base64,' . base64_encode($anexosvg) . '"/>';
    }


}