<?php

class AnalisispersonaController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function analisispersonaAction()
    {
        $this->render();
    }


    function exportarestadoAction()
    {
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = $this->global->Estructura->idestructura;
        $estructura = $filters[0]->value;

        //$estructura=$filters[0]->value;
        $horas = $filters[1]->value;
        $trabajados = $filters[2]->value;


        //var_dump($estructura);die;
        // $model=new ReportepdfEstadosModel();
        $model = new Anexo2Model();
        $result = $model->exportarestado($estructura);

        echo json_encode('ok');

        /*   $filters=json_decode(stripslashes($this->_request->getParam('filters')));
           $idestructura = $this->global->Estructura->idestructura;

           //print_r($filters);die;
           // $model=new ReportepdfEstadosModel();
           $model=new Anexo2Model();
           //$result=$model->construirReporte($filters,$idestructura);
           $result=$model->exportarestado($filters,$idestructura);

           ///*$resumen = ResumenEstadisticoModel::getResumenEstadistico(null);
           echo json_encode('ok');*/
    }

    function exportarestadoCertificacionAction()
    {
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = $this->global->Estructura->idestructura;
        $estructura = $filters[0]->value;

        //$estructura=$filters[0]->value;
        $horas = $filters[1]->value;
        $trabajados = $filters[2]->value;


        //var_dump($estructura);die;
        // $model=new ReportepdfEstadosModel();
        $model = new CertificaciondelpersonalModel();
        $result = $model->exportarestadoCertificacion($estructura);

        echo json_encode('ok');


    }

    function exportarestadoPromedioAction()
    {
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $idestructura = $this->global->Estructura->idestructura;
        $estructura = $filters[0]->value;

        //$estructura=$filters[0]->value;
        $horas = $filters[1]->value;
        $trabajados = $filters[2]->value;


        //var_dump($estructura);die;
        // $model=new ReportepdfEstadosModel();
        $model = new PromediotrabajadoresacumuladoModel();
        $result = $model->exportarestadoPromedio($estructura);

        echo json_encode('ok');


    }

    public function reporteAlimentacionAction()
    {
        //die('fkdjfk');
        $idestructura = $this->global->Estructura->idestructura;
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReporteAlimentacionModel();
        $result = $model->exportarAlimentacion($filters, $idestructura);
        echo json_encode('ok');
    }

    public function reporteAlimentacionEstaAction()
    {
        //die('fkdjfk');
        $idestructura = $this->global->Estructura->idestructura;
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReporteAlimentacionEstaModel();
        $result = $model->exportarAlimentacionE($filters, $idestructura);
        echo json_encode('ok');
    }

    public function reporteNominaltransporteAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReporteNominalTransModel();
        $result = $model->exportarTransportacion($filters, $idestructura);
        echo json_encode('ok');
    }


    public function reporteTransporteAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReporteEstadisticoTransModel();
        $result = $model->exportarTransportacion($filters, $idestructura);
        echo json_encode('ok');

    }

    public function reporteEstadoviviendaAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReporteNominalAlojamientoModel();
        $result = $model->exportarAlojamiento($filters, $idestructura);
        echo json_encode('ok');
    }

    public function reporteAlojamienotoEstaAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReporteAlojamientoEstaModel();
        $result = $model->exportarAlojamiento($filters, $idestructura);
        echo json_encode('ok');
    }

    public function reporteSituacExcepAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReporteSituacExcepModel();
        $result = $model->exportarSituacExcep($filters, $idestructura);
        echo json_encode('ok');
    }


    public function reporteSituacExcepEstaAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $model = new ReporteSituacExcepEstaModel();
        $result = $model->exportarSituacExcepE($filters, $idestructura);
        echo json_encode('ok');
    }

    public function reporteSituaDefensaAction()
    {

        $idasignaciondefensa = $this->_request->getParam('idasignaciondefensa');
        $exportar = $this->_request->getParam('exportar');
        $model = new DatSituaciondefensaModel();
        $result = $model->getPersonasByAsig($idasignaciondefensa);

        if ($exportar == 1) {
            $objReportePDF = new ReporteSituaciondefensaModel();
            $objReportePDF->CrearReportePDF($result->data);
            echo json_encode('ok');
        } else if ($exportar == 2) {
            $objFicha = new ReporteSituaciondefensaRTF($result->data);
            $objFicha->CrearFicha();
            $r->msg = "";
            $r->url = "/pvd/persona/Reporte.rtf";
            echo json_encode($r);
        } else {
            echo json_encode($result);
        }
    }


    public function getCurvaTallajeAction()
    {
        $idprenda = $this->_request->getParam('idprenda');
        $exportar = $this->_request->getParam('exportar');
        $model = new DatTallajeModel();
        $result = $model->getTallajesAll($idprenda);

        if ($exportar == 1) {
            $objReportePDF = new ReportepdftallajeModel();
            $objReportePDF->CrearReportePDF($result);
            echo json_encode('ok');
        } else if ($exportar == 2) {
            $objFicha = new ReporteTallajeRTF($result);
            $objFicha->CrearFicha();
            $r->msg = "";
            $r->url = "/pvd/persona/Reporte.rtf";
            echo json_encode($r);
        } else if ($result->data) {
            echo json_encode($result);
        } else {
            $result->data = [];
            echo json_encode($result);
        }
    }

    public function getCantTallasbyPersonaAction()
    {
        $idprenda = $this->_request->getParam('idprenda');
        $model = new DatTallajeModel();
        $result = $model->getCantTallasbyPersona($idprenda);
        echo json_encode($result);

    }

    public function getCantPersonaBySituacionAction()
    {
        $model = new DatSituaciondefensaModel();
        $result = $model->getCantPersonaBySituacion();
        echo json_encode($result);

    }

    public function estadoViviendaAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $exportar = $this->_request->getParam('exportar');
        $model = new DatEstadoviviendaModel();
        $result = $model->personabyEstado($idestructura);
        //print_r($result);die;
        if ($exportar == 1) {
            $objReportePDF = new ReporteEstadoviviendaModel();
            $objReportePDF->CrearReportePDF($result->data);
            echo json_encode('ok');
        } else if ($exportar == 2) {
            $objFicha = new ReporteEstadoviviendaRTF($result->data);
            $objFicha->CrearFicha();
            $r->msg = "";
            $r->url = "/pvd/persona/Reporte.rtf";
            echo json_encode($r);
        } else {
            echo json_encode($result);
        }
    }

    public function getCantPersonaByEstadoAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $model = new DatEstadoviviendaModel();
        $result = $model->getCantPersonaByEstado($idestructura);
//      print_r($result);
//        die;
        echo json_encode($result);

    }

    public function getCantPersonaBySituacionDeConvAction()
    {
        /* $model = new DatEstadoviviendaModel();
         $result = $model->getCantPersonaBySituacion();
         echo json_encode($result);*/

    }
    
    public function obtenerEstructuraAction()
    {
        try {
            $result = Array();
            if ($this->_getParam('node') == 0) {
                $id = $this->global->Estructura->idestructura;
                $estr = ZendExt_IoC::getInstance()->metadatos->DameEstructura($id);
                array_push($result, $estr[0]);
            } else {
                $id = $this->_getParam('node');
                $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
                foreach ($r as $t => $est) {
                    if ($est->idconcepto == 7) {
                        $est->text = $est->text . " <b>($est->cantidad | $est->cantidad_real)</b>";
                    }
                    array_push($result, $est);
                }
            }
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    public function cargarComboTiposDocIdentidadAction()
    {
        $model = new ReporteTiposDocumentoModel();
        $result = $model->getTiposDocumentoIdentidad();
        if (is_array($result)) {
            $resultUno = array('cant' => count($result), 'datos' => $result);
            echo(json_encode($resultUno));
        }
    }
    
    public function getDatosDocIdentificacionAction()
    {
        $idsTiposDocIdent = $this->_request->getPost('idsTiposDocIdent');
        $idestructura = $this->_request->getPost('idestructura');
        
        $model = new ReporteTiposDocumentoModel();
        $datos = $model->getDatosTiposDocIdentificacion($idsTiposDocIdent, $idestructura);
        $array = array('data' => $datos, 'quantity' => null);
        echo json_encode($array);
    }
    
    public function getPDFDocIdentificacionAction()
    {
        $idsTiposDocIdent = $this->_request->getParam('idsTiposDocIdent');
        $idestructura = $this->_request->getParam('idestructura');
        
        $model = new ReporteTiposDocumentoModel();
        $datos = $model->getDatosTiposDocIdentificacion($idsTiposDocIdent, $idestructura);
        
        $objReportePDF = new ReportePDFTiposDocumentoModel();
        $objReportePDF->CrearReportePDF($datos, false);
        echo json_encode('ok');
    }
    
    public function getDatosEstructuraQueSeEntroAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $denomestructura = $this->global->Estructura->denominacion;
        
        $result = ['idestructura' => $idestructura, 'denomestructura' => $denomestructura];
        
        echo json_encode($result);
    }
    
    public function getPersonasPorTipoDeDocAction()
    {
        $idTipoDocIdent = $this->_request->getPost('idTipoDocIdent');
        $idestructura = $this->_request->getPost('idestructura');
        $idcolumna = $this->_request->getPost('idcolumna');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        
        $model = new ReporteTiposDocumentoModel();
        $datos = $model->getPersonasPorTipoDeDoc($idestructura, $idTipoDocIdent, $idcolumna, $limit, $start);
        $cantidad = $model->getCantPersonasPorTipoDeDoc($idestructura, $idTipoDocIdent, $idcolumna);
        $cantidad = $cantidad[0]['cantidad'];
        
        $array = array('data' => $datos, 'quantity' => $cantidad);
        echo json_encode($array);
    }
    
    public function getPDFListadoPersonasAction()
    {
        $idTipoDocIdent = $this->_request->getParam('idTipoDocIdent');
        $idestructura = $this->_request->getParam('idestructura');
        $idcolumna = $this->_request->getParam('idcolumna');
        
        $model = new ReporteTiposDocumentoModel();
        $datos = $model->getPersonasPorTipoDeDoc($idestructura, $idTipoDocIdent, $idcolumna, null, null);
        
        $objReportePDF = new ReportePDFTiposDocumentoModel();
        $objReportePDF->CrearReportePDF($datos, true);
        echo json_encode('ok');
    }
    
}