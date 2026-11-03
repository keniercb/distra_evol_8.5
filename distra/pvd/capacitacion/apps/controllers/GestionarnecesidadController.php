<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 09/10/17
 * Time: 17:25
 */
class GestionarnecesidadController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestionarnecesidadAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de personas
     * @return Arreglo con las personas
     * @author Yaricel Guerra Vel�zquez
     */
    function getPersonasAction()
    {
        $filtro = $this->_getParam('query');
        $idestructura = $this->_getParam('idestructura');
        $idcargo = $this->_getParam('idcargo');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        if ($this->_getParam('cargartodo') == 1) {
            $datos = DatNecesidadModel::getPersonasActivas($filtro, $start, $limit, null);
        } else {
            $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
                $filtro,
                $idestructura,
                $idcargo,
                $start,
                $limit,
                1
            );
        }
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de necesidades
     * @return Arreglo con las necesidades dad una persona
     * @author Yaricel Guerra Vel�zquez
     */
    function getNecesidadesAction()
    {
        $modeloNegocio = new DatNecesidadModel();
        $arr = $modeloNegocio->getNecesidades(
            $this->_getParam('activo'),
            $this->_getParam('idpersona'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de las necesidades de capacitaci�n nomencladas
     * @return Arreglo con todas las necesidades de capacitacion
     * @author Yaricel Guerra Vel�zquez
     */
    function getNecesidadesDeCapacitacionAction()
    {
        $modeloNegocio = new NomNecesidaddecapacitacionModel();
        $arr = $modeloNegocio->getNecesidadesActivos();
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de los modos de formaci�n
     * @return Arreglo con todas las necesidades de capacitaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function getModoFormacionAction()
    {
        $modeloNegocio = new NomModoformacionModel();
        $arr = $modeloNegocio->getModosActivos();
        echo Zend_Json::encode($arr);
    }

    /**
     * Adiciona necesidades individuales de capacitaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addNecesidadAction()
    {
        $modeloNegocio = new DatNecesidadModel();
        $arr = $modeloNegocio->addNecesidad(
            $this->_getParam('idpersona'),
            $this->_getParam('idnecesidad'),
            $this->_getParam('descripcion'),
            $this->_getParam('fhasta'),
            $this->_getParam('idmodoformacion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica necesidades individuales de capacitaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateNecesidadAction()
    {
        $modeloNegocio = new DatNecesidadModel();
        $arr = $modeloNegocio->updateNecesidad(
            $this->_getParam('iddnecesidad'),
            $this->_getParam('idpersona'),
            $this->_getParam('idnecesidad'),
            $this->_getParam('descripcion'),
            $this->_getParam('fhasta'),
            $this->_getParam('idmodoformacion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina necesidades individuales de capacitaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteNecesidadAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idsnecesidad')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatNecesidadModel::deleteNecesidad($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    /**
     * Obtiene el listado de las competencias del cargo
     * @return Arreglo con las competencias del cargo
     * @author Yaricel Guerra Velazquez
     */
    function getCompetenciasByCargoAction()
    {
        $datos = ZendExt_IoC_Inter::getInstance()->competencias->getCompetenciaByPersonaCargo(
            $this->_getParam('idcargo'), 
            $this->_getParam('idpersona')
        );
        echo Zend_Json::encode($datos);
    }

    function generarPdfReportesAction()
    {
        set_time_limit(30000);
        $tiporeporte = $this->_getParam('tiporeporte');
        $idpersona = $this->_getParam('idpersona');
        $idestructura = $this->_getParam('idestructura');
        if ($tiporeporte == 1) {
            $objReportePDF = new ReportepdfnecesidadesindivModel();
            $objReportePDF->CrearReportePDF($idpersona);
        } else if ($tiporeporte == 2) {
            $objReportePDF = new ReportepdfnecesidadescolectModel();
            $objReportePDF->CrearReportePDF($idestructura);
        }
        return true;
    }

    /**
     * Obtiene las cantidades de necesidades de capacitaci�n por estructuras
     * @return Arreglo con las series y las categorias para graficar
     * @author Yaricel Guerra Vel�zquez
     */
    function getNecesidadesGraficaAction()
    {
        $modeloNegocio = new DatNecesidadModel();
        $arr = $modeloNegocio->getNecesidadesGrafica($this->_getParam('idestructura'));
        echo Zend_Json::encode($arr);
    }
}