<?php

class ReportConfGnralModel extends ZendExt_Model
{

    public function buildReport($argArrayReportData, $argReportFormat)
    {
        $reportList = array();
        if (file_exists(
            Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/models/FactoryReportConfGnral.php"
        )
        ) {
            require_once(Zend_Registry::get('config')->dir_aplication
                . "/configuracion/reportes/models/FactoryReportConfGnral.php");
            foreach ($argArrayReportData as $objReportData) {
//                print('hayayaya');
                print_r($objReportData->reporte);die;
                $objReport = FactoryReportConfGnral::Create(
                    ($objReportData->datoGeneral->reporte) ? $objReportData->datoGeneral->reporte
                        : $objReportData->reporte
                );
                $objReport->generalData = $objReportData->datoGeneral;
                $objReport->bodyData = $objReportData->datoCuerpo;
                $objReport->footData = (isset($objReportData->datoPie)) ? $objReportData->datoPie : null;
                $reportList[] = $objReport;
            }
        } else {
            die('LA CLASE <b>FactoryReportConfGnral.php</b> NO HA SIDO ENCONTRADA EN EL SERVIDOR.');
        }
        if (file_exists(
            Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/CoreReportConfGnral.php"
        )
        ) {
            require_once(
                Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/CoreReportConfGnral.php");
            new CoreReportConfGnral($argReportFormat, $reportList);
        } else {
            die('LA CLASE <b>CoreReport.php</b> NO HA SIDO ENCONTRADA EN EL SERVIDOR.');
        }
    }

}

?>