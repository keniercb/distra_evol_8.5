<?php
class IndicadoresController extends ZendExt_Controller_Secure
{
    private $parte = array();
    private $parte1 = array();

	function init()
	{	
		parent::init();

	}

	function indicadoresAction()
	{
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
		$this->render('indicadores');
	}

    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : TRUE;
        echo json_encode($this->response);
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

                $this->response =
                    $objModel->getIndicadoresFormula($idreporte, $query,
                        $limit, $start);

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function getIndicadoresCausaAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $idreporte = $this->_getParam('idreporte');
            $objModel = new NomCausaModel();
            $arr=array();
                $arr1 =
                    $objModel->GetHojas($idreporte, $query,
                        $limit, $start);
            $objModel = new DatIndicadorModel();
            $arr=$objModel->getIndicadoresNoGestionables($idreporte, $query,
                $limit, $start);
            $arrRes=array_merge($arr1,$arr->data);
            $this->response=$arrRes;
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function addIndicadorAction()
    {
        try {
            $objModel = new DatIndicadorModel();

            $denominacion = $this->_request->getPost('denominacion');
            $descripcion = $this->_request->getPost('descripcion');
            $fdesde = $this->_request->getPost('fdesde');
            $fhasta = $this->_request->getPost('fhasta');
            $unidadmedida = $this->_request->getPost('unidadmedida');
            $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
            $idindicador = $this->_request->getPost('idindicador');
            $this->response =$objModel->addIndicador($idindicador,$denominacion,$descripcion,$fdesde,$fhasta,$unidadmedida,$idexpresionmatematica);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function modIndicadorAction()
    {
        try {
            $objModel = new DatIndicadorModel();
            $denominacion = $this->_request->getPost('denominacion');
            $descripcion = $this->_request->getPost('descripcion');
            $fdesde = $this->_request->getPost('fdesde');
            $fhasta = $this->_request->getPost('fhasta');
            $unidadmedida = $this->_request->getPost('unidadmedida');
            $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
            $idindicador = $this->_request->getPost('idindicador');
            $this->response =$objModel->modIndicador($idindicador,$denominacion,$descripcion,$fdesde,$fhasta,$unidadmedida,$idexpresionmatematica);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

    public function eliminarIndicadorAction()
    {
        try {
            $objModel = new DatIndicadorModel();
            $arrindicadores= $this->_request->getPost('arrindicador');
            $arrindicador =json_decode(stripslashes($arrindicadores));
            $this->response =$objModel->eliminarIndicador($arrindicador);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        return $this->responseRequest();
    }

}
?>