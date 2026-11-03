<?php

class ExportarReporteService extends ZendExt_Model {

    public function ExportarReporteService() {
        parent::ZendExt_Model();
    }

    public function GetReporte($formato, $tituloReporte, $datos, $header,$usuario,$fecha,$objLogo) {
        $rpt = new ExportarReporteModel();
        $rpt->generarReporte($formato, $tituloReporte, $datos, $header,$usuario,$fecha,$objLogo);
    }

}