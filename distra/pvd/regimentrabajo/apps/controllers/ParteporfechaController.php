<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class ParteporfechaController extends ZendExt_Controller_Secure 
{
    private $parte = array();

	function init()
	{	
		parent::init();

	}

	function parteporfechaAction()
	{
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
		$this->view->fecha = date('d/m/Y');
		$this->render();
	}
	
    function GetDataReporte($idcausas,$idestructura,$idturnotrabajo,$fecha,$start,$limit,$filtro,$agrupador)
    {
        $model = new DatAsistenciaModel();
        if($idcausas == '')
            $causas='';
        else
            $causas= explode(',',$idcausas);

        $arrReporte = $model->GetReporteAsist(
            $idestructura,
            $causas,
            $idturnotrabajo,
            $fecha,
            $start,
            $limit,
            $filtro,
            $agrupador
        );
        return $arrReporte;
    }
    
    function getReporteAction()
	{
	    //$fecha = date('d/m/Y');
       $arrReporte = $this->GetDataReporte($this->_request->getPost('idcausa'),
            $this->_request->getPost('idestructura'),
            $this->_request->getPost('idturnotrabajo'),
            $this->_request->getPost('fecha'),
            $this->_request->getPost('start'),
            $this->_request->getPost('limit'),
            $this->_request->getPost('filtro'),
            $this->_request->getPost('agrupador'));

        $r['datos'] = $arrReporte['datos'];
        $r['resumen'] = $arrReporte['resumen'];
        $r['cantidad'] = $arrReporte['cantidad'];
        $_SESSION['parte'] = $arrReporte['datos'];
        echo (json_encode ($r));
	}

    function cargacausasausenciaAction()
    {
        $obj = new NomCausa();
        $causas = $obj->GetLeafs();

        $c['idcausa'] = -1;
        $c['denominacion'] = 'SIN REGISTRO';
        array_unshift($causas,$c);

        $p['idcausa'] = -2;
        $p['denominacion'] = 'SIN CAUSA';
        array_unshift($causas,$p);

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
        $fecha = date('d/m/Y');
        $agrupador = $this->_request->get('agrupador');
        $datos = $_SESSION['parte'];
        $obj = new DatpdfModel();
        $var = $obj->construirReporte($datos, $fecha, $agrupador);
        echo (json_encode ('ok'));
    }

    function exportarnominalExcelAction()
    {
        $arreglo = $_SESSION['parte'];
        $obj = new DatParteporfechaModel();
        $var = $obj->GetDatosExportarNominalExcel($arreglo);
        return true;
    }

    function exportarestAction()
    {
		$model = new DatAsistenciaModel();
        $fecha = date('d/m/Y');
        $datos = $_SESSION['parte'];
        $obj = new DatpdfEstModel();
        $var = $obj->construirReporte($datos, $fecha);
        echo (json_encode ('ok'));
    }

    function exportarestadisticoExcelAction()
    {
        $model = new DatAsistenciaModel();
        $datos = $_SESSION['parte'];
        $obj = new DatParteporfechaModel();
        $var = $obj->GetDatosExportarEstadisticoExcel($datos);
        return true;
    }
}
?>