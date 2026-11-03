<?php
class ApaController extends ZendExt_Controller_Secure
{
    private $parte = array();
    private $parte1 = array();

    function init()
    {
        parent::init();

    }

    function apaAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render('apa');
    }

    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : TRUE;
        echo json_encode($this->response);
    }

    public function getReporteAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $objModel = new NomReporteModel();
            if ($query != '') {
                $this->response = $objModel->getReporte($query, $limit, $start);
            } else {
                $this->response = $objModel->getReporte(null, $limit, $start);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function getTodosIndicadoresAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $objModel = new DatIndicadorModel();

            $this->response = $objModel->getTodosIndicadores($query, $limit, $start);

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function getIndicadoresReporteAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $idreporte = $this->_getParam('idreporte');
            $objModel = new DatIndicadorModel();
            if ($idreporte) {
                $this->response =
                    $objModel->getIndicadoresReporte($idreporte, $query,
                        $limit, $start);
            } else {
                $this->response->data = [];
                $this->response->quantity = 0;
            }


        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function getVistaReporteAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $idreporte = $this->_getParam('idreporte');
            $objModel = new DatIndicadorModel();
            if ($idreporte) {
                $this->response =
                    $objModel->getVistaReporte($idreporte, $query,
                        $limit, $start);
            } else {
                $this->response->data = [];
                $this->response->quantity = 0;
            }

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }

        return $this->responseRequest();
    }

    public function addReporteAction()
    {
        try {
            $arregloI = $this->_request->getPost('arrIndicadores');
            $arregloIndicadores = json_decode(stripslashes($arregloI));
            $arregloIC = $this->_request->getPost('arrIndicadoresCausa');
            $arregloIndicadoresC = json_decode(stripslashes($arregloIC));
            $objModel = new DatIndicadorModel();
            $denominacion = $this->_request->getPost('denominacion');
            $descripcion = $this->_request->getPost('descripcion');
            $fdesde = $this->_request->getPost('fdesde');
            $fhasta = $this->_request->getPost('fhasta');
            $idreporte = $this->_request->getPost('idreporte');
            $this->response = $objModel->addReporte($arregloIndicadores, $arregloIndicadoresC, $denominacion, $descripcion, $fdesde, $fhasta, $idreporte);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function modReporteAction()
    {
//        try {
            $arregloI = $this->_request->getPost('arrIndicadores');
            $arregloIndicadores = json_decode(stripslashes($arregloI));
            $arregloIC = $this->_request->getPost('arrIndicadoresCausa');
            $arregloIndicadoresC = json_decode(stripslashes($arregloIC));
            $objModel = new DatIndicadorModel();

            $denominacion = $this->_request->getPost('denominacion');
            $descripcion = $this->_request->getPost('descripcion');
            $fdesde = $this->_request->getPost('fdesde');
            $fhasta = $this->_request->getPost('fhasta');
            $idreporte = $this->_request->getPost('idreporte');

            $result = $objModel->modReporte($arregloIndicadores, $arregloIndicadoresC, $denominacion, $descripcion, $fdesde, $fhasta, $idreporte);
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El reporte ha sido modificado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "El reporte ya existe.";
            }
//        } catch (Exception $e) {
//            $this->responseExceptions($e);
//            return;
//        }
        return $this->responseRequest();
    }

    public function eliminarReporteAction()
    {
        try {
            $objModel = new DatIndicadorModel();
            $arrreportes = $this->_request->getPost('arrreporte');
            $arrreporte = json_decode(stripslashes($arrreportes));
            $this->response = $objModel->eliminarReporte($arrreporte);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function obtenerEstructuraAction()
    {
        try {
            $result = Array();
            $vioc = ZendExt_IoC::getInstance();
            $idestruc = $this->_getParam('idestructura');
            if ($this->_getParam('node') == 0 && $idestruc != 0) {
                $id = $idestruc;
                $estr = $vioc->metadatos->DameEstructura($id);
                array_push($result, $estr[0]);
            } else {
                $id = $this->_getParam('node');
                $result = $vioc->metadatos->DameHijosEstructura($id);
            }
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    public function obtenerReporteAction()
    {
        $idreporte = $this->_request->getPost('idreporte');
        $idestructura = $this->_request->getPost('idestructura');
        $fini = $this->_request->getPost('fechaini');
        $ffin = $this->_request->getPost('fechafin');
        $model = new DatApaModel();
        $result = $model->getReporte($idreporte, $idestructura, $fini, $ffin);
        echo json_encode($result);
    }

    public function exportarAction()
    {
        $idreporte = $this->_getParam('idreporte');
        $idestructura = $this->_getParam('idestructura');
        $fini = $this->_getParam('fechaini');
        $ffin = $this->_getParam('fechafin');
        $model = new ReportepdfCausas();
        $result = $model->exportar($idreporte, $idestructura, $fini, $ffin);
        echo json_encode('ok');
    }

}

?>