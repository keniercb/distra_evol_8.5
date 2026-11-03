<?php

class ScfprintviewController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function savePostAction()
    {
        try {
            $flashMessenger = $this->_helper->_flashMessenger;
            $flashMessenger->addMessage($this->_request->getPost('reportType'));
            $flashMessenger->addMessage($this->_request->getPost('reportOrientation'));
            $flashMessenger->addMessage($this->_request->getPost('reportPaperSize'));
            $flashMessenger->addMessage($this->_request->getPost('dataSources'));
            echo ("{info: true}");
        } catch (Exception $ex) {
            echo ("{info: false}");
        }
    }

    function buildReportAction()
    {
        $dataSources = $this->_helper->_flashMessenger->getMessages();
        if (count($dataSources) > 0) {
            if (@file_exists(
                Zend_Registry::get('config')->dir_aplication . "configuracion/reportes/comun/ReportConfGnralModel.php"
            )
            ) {
                require_once(Zend_Registry::get('config')->dir_aplication
                    . "configuracion/reportes/comun/ReportConfGnralModel.php");
                $objReportModel = new ReportConfGnralModel();
                $result = json_decode(stripslashes($dataSources[3]));
                if (!is_array($result)) {
                    $result = array($result);
                }
                $objReportModel->buildReport($result, array($dataSources[0], $dataSources[1], $dataSources[2]));
            } else {
                die('LA CLASE <b>ReportModel.php</b> NO HA SIDO ENCONTRADA EN EL SERVIDOR.');
            }
        } else {
            die('NO EXISTEN DATOS QUE MOSTRAR.');
        }
    }

}