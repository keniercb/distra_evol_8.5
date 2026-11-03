<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class GestionarcertificaciondeannosserviciosController extends ZendExt_Controller_Secure
{

    public $datosModelo;
    protected $model;

    public function init()
    {
        parent::init();
        $this->model = new DatCargosOcupadosModel();
        $this->datosModelo->hora = date("d/m/Y");
        $objDomain = new NomSituacionLaboral();
        $arrSituacion = $objDomain->obtenerListadoSituacionesCB();
        $this->datosModelo->situacion = $arrSituacion;
    }

    public function gestionarcertificaciondeannosserviciosAction()
    {
        $this->render();
    }

    public function obtenercargainicialAction()
    {
        echo json_encode($this->datosModelo);
    }

    public function getPersonaentidadAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $texto = $this->_request->getPost('texto');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $arraPersonas = GestionarcertificaciondeannosserviciosModel::getPersonaentidad($identidad, $texto, $limit, $start);
        foreach ($arraPersonas as $i => $persona) {
            if ($persona['nombreplantilla'] != 'Sin plantilla nominal') {
                list($ordenplantilla,) = explode('-', $persona['nombreplantilla']);
                $longorden = strlen($ordenplantilla . '');
                $arraPersonas[$i]['nombreplantilla'] = chr(96 + $longorden) . $persona['nombreplantilla'];//chr(96) caracter antes de letra "a"
            } else {
                $arraPersonas[$i]['nombreplantilla'] = 'z-' . $persona['nombreplantilla'];
            }
        }
        //print_r($arraPersonas);die;
        $cantidad = GestionarcertificaciondeannosserviciosModel::getCantidadPersonaentidad($identidad, $texto);
        echo Zend_Json::encode(array('data' => $arraPersonas, 'quantity' => $cantidad));
    }

    public function addAnnosserviciosAction()
    {
        $datos = json_decode(stripslashes($this->_getParam('datos')));
        $arraPersonas = GestionarcertificaciondeannosserviciosModel::addAnnosservicios($datos);
        echo Zend_Json::encode($arraPersonas);
    }

    /**
     * Accion usada para obtener el reporte de la Certificación de años de servicio.
     */
    //Exportar  a Excel
    public function exportarAnnosserviciosAction()
    {
        $identidad = $this->_getParam('identidad');
        $fechaactual = new DateTime();

        $objExp = new ReporteExportarExcelCertificacionAnnosServicioModel();//hacer mi clase llamarla y a exportar
        $rExp = $objExp->exportarReporte($identidad, $fechaactual);
        echo json_encode($rExp);
    }
}
