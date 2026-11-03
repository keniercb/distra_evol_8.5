<?php
class PartediarioController extends ZendExt_Controller_Secure 
{
    private $parte = array();
    private $parte1 = array();

	function init()
	{	
		parent::init();

	}

	function partediarioAction()
	{
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
		$this->render();
	}
    
    function getReporteNominalAction()
	{
        $model = new DatAsistenciaModel();
        $arrResumen = $model->getResumen($this->_request->getPost('idestructura'),null,
                                        $this->_request->getPost('fecha'),array(),
                                        null,null);
         $r['datos'] = $arrResumen['datos'];
         $r['resumen'] = $arrResumen['resumen'];
         $r['cantidad'] = count($arrResumen['cantidad']);
        $_SESSION['parte'] = $arrResumen['datos'];
         echo (json_encode ($r));
	}

    function getReporteEstadisticoAction()
    {
        $idsestructura= Zend_Json::decode(stripslashes($this->_getParam('idestructuras')));
        $idstipoestructura= Zend_Json::decode(stripslashes($this->_getParam('idtipoestructuras')));
        $denomestructuras= Zend_Json::decode(stripslashes($this->_getParam('denomestructuras')));
        $tienecategorias = $this->_getParam('tienecategoria');
        $asistModel = new DatAsistenciaModel();
        $result = $asistModel->GetReporteEstadistico($idsestructura, $idstipoestructura,$denomestructuras,$tienecategorias,
            $this->_request->getPost('fecha'));

        $_SESSION['parte1'] = $result['datos'];
        $r['datos'] = $result['datos'];
        $r['resumen'] = $result['resumen'];
        $r['cantidad'] = $result['cantidad'];
        echo (json_encode ($r));
    }

    function cargacausasausenciaAction()
    {
        $obj = new NomCausaModel();
        $r['causasAgrupadas'] = $obj->GetTreeCausas();
        $r['hojas'] = $obj->getHojas();
        echo (json_encode ($r));
    }

    function exportarAction()
    {
        $arreglo = $_SESSION['parte'];
        $fecha = $this->_request->get('fecha');
        $estructura = $this->_request->get('estructura');
        $horareporte = $this->_request->get('horareporte');
        $array = array();
        foreach($arreglo as $key => $value){

            $array[$value['idarea']] = $value['denomarea'];
        }
        $resultado = array_unique($array);
        $obj = new DatpdfpartediarionominalModel();
        $var = $obj->construirReporte($arreglo, $fecha, $estructura,$horareporte,$resultado);
        echo (json_encode ('ok'));
    }

    function exportarestadisticoAction()
    {
        $arreglo = $_SESSION['parte1'];
        $fecha = $this->_request->get('fecha');
        $horareporte = $this->_request->get('horareporte');

        $cantidad= Zend_Json::decode(stripslashes($this->_getParam('cantidad')));
        $tienecategorias= $this->_getParam('tienecategorias');
        $categorias= Zend_Json::decode(stripslashes($this->_getParam('categorias')));

        $obj = new DatpdfpartediarioestadisticoModel();
        $var = $obj->construirReporte($arreglo, $fecha,$horareporte,$cantidad,$categorias, $tienecategorias);

        echo (json_encode ('ok'));
    }
}
?>