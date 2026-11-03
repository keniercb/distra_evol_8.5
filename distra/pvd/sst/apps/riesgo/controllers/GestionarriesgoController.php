<?php
/**
 * Created by Netbeans.
 * User: eddy
 * Date: 01/12/17
 * Time: 10:15
 */
class GestionarriesgoController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestionarriesgoAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de los riesgos
     * @return Arreglo con los riesgos
     * @author Eddy Santana Navarro
     */
    function getRiesgoAction()
    {
        $objriesgo = new DatRiesgoModel();
        $filtro = $this->_getParam('query');
        $idestructura = $this->_getParam('idestructura');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = $objriesgo->getRiesgo($filtro, $idestructura, $limit, $start);
        echo Zend_Json::encode($datos);
    }

    /**
     * Adiciona riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function addRiesgoAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->addRiesgo(
            $this->_getParam('idnriesgo'),
            $this->_getParam('idestructura'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdeteccion'),
            $this->_getParam('idfrecuencia'),
            $this->_getParam('idprobabilidad'),
            $this->_getParam('idnivelriesgo'),
            $this->_getParam('idsistema'),
            $this->_getParam('idpartesistema')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function updateRiesgoAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->updateRiesgo(
            $this->_getParam('idriesgo'),
            $this->_getParam('idnriesgo'),
            $this->_getParam('idestructura'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdeteccion'),
            $this->_getParam('idfrecuencia'),
            $this->_getParam('idprobabilidad'),
            $this->_getParam('idnivelriesgo'),
            $this->_getParam('idsistema'),
            $this->_getParam('idpartesistema')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function deleteRiesgoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idsriesgos')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRiesgoModel::deleteRiesgo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    /**
     * Obtiene los valores del nomenclador de riesgo
     * @return Arreglo con todos los valores del nomenclador de riesgo
     * @author Eddy Santana Navarro
     */
    function getNomRiesgoAction()
    {
        $modeloNegocio = new NomRiesgoModel();
        $arr = $modeloNegocio->getRiesgosActivos();
        echo Zend_Json::encode($arr);
    }
    
    /**
     * Obtiene los valores de estado de riesgo
     * @return Arreglo con todos los valores de estado de riesgo
     * @author Eddy Santana Navarro
     */
    function getFrecuenciaRiesgoAction()
    {
        $modeloNegocio = new NomFrecuenciaModel();
        $arr = $modeloNegocio->getFrecuenciasActivos();
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene los valores de probabilidad
     * @return Arreglo con todos los valores de probabilidad
     * @author Eddy Santana Navarro
     */
    function getProbabilidadAction()
    {
        $modeloNegocio = new NomProbabilidadModel();
        $arr = $modeloNegocio->getProbabilidadesActivos();
        echo Zend_Json::encode($arr);
    }
    
    /**
     * Obtiene los valores de nivel de riesgo
     * @return Arreglo con todos los valores de nivel de riesgo
     * @author Eddy Santana Navarro
     */
    function getNivelRiesgoAction()
    {
        $modeloNegocio = new NomNivelriesgoModel();
        $arr = $modeloNegocio->getNivelesActivos();
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de medidas
     * @return Arreglo con las medidas de un riesgo
     * @author Eddy Santana Navarro
     */
    function getMedidasAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->getMedidas(
            $this->_getParam('idriesgo'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }

    function getEventosAction()
    {
        $modeloNegocio = new NomEventoModel();
        $arr = $modeloNegocio->getEventosActivos();
        echo Zend_Json::encode($arr);
    }

    function getSistemasAction()
    {
        $modeloNegocio = new NomSistemaModel();
        $arr = $modeloNegocio->getSistemasActivos();
        echo Zend_Json::encode($arr);
    }

    function getPartesSistemasAction()
    {
        $modeloNegocio = new NomParteSistemaModel();
        $arr = $modeloNegocio->getPartesistemasActivos();
        echo Zend_Json::encode($arr);
    }

    function getConsecuenciasAction()
    {
        $modeloNegocio = new NomConsecuencia();
        $arr = $modeloNegocio->getConsecuenciasActivos();
        echo Zend_Json::encode($arr);
    }

    function getPeligrosAction()
    {
        $modeloNegocio = new NomPeligro();
        $arr = $modeloNegocio->getPeligrosActivos();
        echo Zend_Json::encode($arr);
    }
    
    /**
     * Adiciona una medida a un riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function addMedidaAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->addMedida(
            $this->_getParam('idriesgo'),
            $this->_getParam('medida'),
            $this->_getParam('responsable'),
            $this->_getParam('fcumplimiento')
        );
        echo Zend_Json::encode($arr);
    }
    
    /**
     * Modifica una medida de un riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function updateMedidaAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->updateMedida(
            $this->_getParam('idmedida'),
            $this->_getParam('idriesgo'),
            $this->_getParam('medida'),
            $this->_getParam('responsable'),
            $this->_getParam('fcumplimiento')
        );
        echo Zend_Json::encode($arr);
    }
    
    /**
     * Elimina medidas de un riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function deleteMedidaAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idsmedida')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRiesgoModel::deleteMedida($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    /**
     * Obtiene el listado de recursos
     * @return Arreglo con los recursos de un riesgo
     * @author Eddy Santana Navarro
     */
    function getRecursosAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->getRecursos(
            $this->_getParam('idriesgo'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }
    
    /**
     * Adiciona un recurso a un riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function addRecursoAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->addRecurso(
            $this->_getParam('idriesgo'),
            $this->_getParam('idrecurso'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($arr);
    }
    
    /**
     * Modifica un recurso de un riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function updateRecursoAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->updateRecurso(
            $this->_getParam('iddrecurso'),
            $this->_getParam('idriesgo'),
            $this->_getParam('idrecurso'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($arr);
    }
    
    /**
     * Elimina recursos de un riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Eddy Santana Navarro
     */
    function deleteRecursoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idsrecurso')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRiesgoModel::deleteRecurso($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function addEventoAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->addEvento(
            $this->_getParam('idriesgo'), $this->_getParam('idevento'),  $this->_getParam('fregistro'),
            $this->_getParam('observaciones')
        );
        echo Zend_Json::encode($arr);
    }

    function updateEventoAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->updateEvento(
            $this->_getParam('idriesgoevento'), $this->_getParam('idriesgo'), $this->_getParam('idevento'),
            $this->_getParam('fregistro'), $this->_getParam('observaciones')
        );
        echo Zend_Json::encode($arr);
    }

    function deleteEventoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('eventos')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRiesgoModel::deleteEvento($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function addConsecuenciaAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->addConsecuencia(
            $this->_getParam('idriesgo'), $this->_getParam('idconsecuencia'), $this->_getParam('fregistro'),
            $this->_getParam('observaciones'), $this->_getParam('principal')
        );
        echo Zend_Json::encode($arr);
    }

    function updateConsecuenciaAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->updateConsecuencia(
            $this->_getParam('idrconsecuencia'), $this->_getParam('idriesgo'), $this->_getParam('idconsecuencia'),
            $this->_getParam('fregistro'), $this->_getParam('observaciones'), $this->_getParam('principal')
        );
        echo Zend_Json::encode($arr);
    }

    function deleteConsecuenciaAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('consecuencias')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRiesgoModel::deleteConsecuencia($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function addPeligrosAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->addPeligro(
            $this->_getParam('idriesgo'), $this->_getParam('idpeligro'), $this->_getParam('fregistro'),
            $this->_getParam('observaciones')
        );
        echo Zend_Json::encode($arr);
    }

    function updatePeligrosAction()
    {
        $modeloNegocio = new DatRiesgoModel();
        $arr = $modeloNegocio->updatePeligro(
            $this->_getParam('idrpeligro'), $this->_getParam('idriesgo'), $this->_getParam('idpeligro'),
            $this->_getParam('fregistro'), $this->_getParam('observaciones')
        );
        echo Zend_Json::encode($arr);
    }

    function deletePeligrosAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('peligros')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRiesgoModel::deletePeligro($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    /**
     * Obtiene los valores del nomenclador de recurso
     * @return Arreglo con todos los valores del nomenclador de recurso
     * @author Eddy Santana Navarro
     */
    function getNomRecursoAction()
    {
        $modeloNegocio = new NomRecursoModel();
        $arr = $modeloNegocio->getRecursosActivos();
        echo Zend_Json::encode($arr);
    }

    public function getEventosRiesgoAction()
    {
        $objModel = new DatRiesgoModel();
        $arr = $objModel->getEventosByRiesgo(
            $this->_getParam('idriesgo'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }

    public function getConsecuenciasRiesgoAction()
    {
        $objModel = new DatRiesgoModel();
        $arr = $objModel->getConsecuenciasByRiesgo(
            $this->_getParam('idriesgo'), $this->_getParam('limit'), $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }

    public function getPeligrosRiesgoAction()
    {
        $objModel = new DatRiesgoModel();
        $arr = $objModel->getPeligrosByRiesgo(
            $this->_getParam('idriesgo'), $this->_getParam('limit'), $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }

    function generarPdfReporteAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $entidad = $this->_getParam('entidad');
        $objReportePDF = new ReportepdfevaluacionriesgoModel();
        $objReportePDF->CrearReportePDF($idestructura, $entidad);
        return true;
    }
}