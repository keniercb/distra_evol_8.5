<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class ReportediarioController extends ZendExt_Controller_Secure 
{
    private $parte = array();

	function init()
	{	
		parent::init();

	}

	function reportediarioAction()
	{
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
		$this->view->fecha = date('d/m/Y');
		$this->render();
	}

    function GetDataReporte($idcausas,$idestructura,$idturnotrabajo,$fecha,$start,$limit)
    {
        $model = new DatAsistenciaModel();
        if($idcausas == '')
        {
            $causas='';
        }
        else{
            $causas= explode(',',$idcausas);
        }
        $arrReporte = $model->GetReporteAsist(
            $idestructura,
            $causas,
            $idturnotrabajo,
            $fecha,
            $start,
            $limit
        );
        return $arrReporte;
    }
    
    function getReporteAction()
	{
        $arrReporte = $this->GetDataReporte($this->_request->getPost('idcausa'),
            $this->_request->getPost('idestructura'),
            $this->_request->getPost('idturnotrabajo'),
            $this->_request->getPost('fecha'),
            $this->_request->getPost('start'),
            $this->_request->getPost('limit'));

        $r['datos'] = $arrReporte['datos'];
        $r['resumen'] = $arrReporte['resumen'];
        $r['cantidad'] = $arrReporte['cantidad'];
        $_SESSION['parte'] = $arrReporte['datos'];
        echo (json_encode ($r));
	}

    function cargacausasausenciaAction()
    {
        $obj = new NomCausaModel();
        $causas = $obj->GetAll();
        $r['datos'] = $causas;
        echo (json_encode ($r));
    }

    function cargaturnodetrabajoAction()
    {
        $obj = new NomTurnotrabajoModel();
        $turnos = $obj->GetAll();
        $r['datos'] = $turnos;
        echo (json_encode ($r));
    }

    function exportarAction()
    {
        $fecha = $this->_request->get('fecha');
		$model = new DatAsistenciaModel();
        $arrReporte = $model->GetDatosAsistencia($this->_request->get('idestructura'),
            $this->_request->get('idcausa'),
            $this->_request->get('idturnotrabajo'),
            $fecha);	
        $estructura = $this->_request->get('estructura');
        $idestructura = $this->_request->get('idestructura');
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $codigo = $entidad[0]->codigo;
        $turnotrabajo = $this->_request->get('turnotrabajo');
        $horareporte = $this->_request->get('horareporte');
        $arreglo = $arrReporte['datos'];
        $array = array();
        foreach($arreglo as $key => $value){

            $array[$value['idarea']] = $value['denomarea'];
        }
        $resultado = array_unique($array);
        $obj = new DatpdfreportediarioModel();
        $var = $obj->construirReporte($arreglo, $fecha, $estructura, $turnotrabajo,$horareporte,$resultado,$codigo);
        echo (json_encode ('ok'));
    }
}
?>