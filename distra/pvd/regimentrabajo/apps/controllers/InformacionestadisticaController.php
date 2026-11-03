<?php
class InformacionestadisticaController extends ZendExt_Controller_Secure 
{	
	function init()
	{	
		parent::init();
	}

	function informacionestadisticaAction()
	{
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->fecha = date('d/m/Y');
		$this->render();
	}

    function getIndicadoresValoresAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idreporte= $this->_request->getPost('idreporte');
        $mes = $this->_request->getPost('mes');
        $year = $this->_request->getPost('year');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $temp = $this->_request->getPost('filtro');
        $filtro = (empty($temp))?null:$temp;
        $estr = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array
        ($_SESSION['Zeolides']['perfil']['idpersona']),null,null,null,null,null,null);
        $modelAM = new DatInformacionestadisticaModel();
        $result = $modelAM->getIndicadoresValores($idestructura,$idreporte,$mes,$year,$limit,
            $start,$filtro);
         $arr=array();
        if(is_array($result))
        {
            foreach($result as $key=> $value)
            {
                array_push($arr,$value);
            }
            $r['datos'] = $arr;
            $r['cantidad'] = count($arr);
            $r['asist'] = 1;
        }
        else
        {
            $r['datos'] = Array();
            $r['cantidad'] = 0;
            $r['asist'] = 0;
        }
        echo (json_encode ($r));
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
        echo (json_encode ($this->response));
    }

}
?>