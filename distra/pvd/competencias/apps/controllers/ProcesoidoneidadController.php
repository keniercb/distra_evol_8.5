<?php
/**
 * @name ProcesoidoneidadController
 * @package   competencia
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ProcesoidoneidadController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function procesoidoneidadAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de procesos de idoneidad
     * @return Arreglo con los procesos
     * @author Yaricel Guerra Velazquez
     */
    function getProcesosAction()
    {
        $filtro = $this->_getParam('query');
        $idestructura = $this->_getParam('idestructura');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $modeloNegocio = new DatProcesoModel();
        $datos = $modeloNegocio->getProcesos($idestructura, $filtro, $start, $limit);
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de Comisiones
     * @return Arreglo con las comisiones
     * @author Yaricel Guerra Vel�zquez
     */
    function getComisionesAction()
    {
        $modeloNegocio = new DatProceso();
        $datos = $modeloNegocio->getComisiones();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de trabajadores implicados en el proceso
     * @return Arreglo con las personas
     * @author Yaricel Guerra Velazquez
     */
    function getMiembrosAction()
    {
        $idproceso = $this->_getParam('idproceso');
        $query = $this->_getParam('query');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $modeloNegocio = new DatPersonaprocesoModel();
        $datos = $modeloNegocio->getPersonasByProceso($idproceso, $query, $start, $limit);
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de recomendaciones
     * @return Arreglo con las recomendaciones
     * @author Yaricel Guerra Velazquez
     */
    function getRecomendacionesAction()
    {
        $idproceso = $this->_getParam('idpersonaproceso');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $modeloNegocio = new DatPersonarecomendacionModel();
        $datos = $modeloNegocio->getRecomendaciones($idproceso, $start, $limit);
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado simple de personas
     * @return Arreglo con las personas
     * @author Yaricel Guerra Velazquez
     */
    function getPersonasAllAction()
    {
        $filtro = $this->_getParam('query');
        $idestructura = $this->_getParam('idestructura');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
            $filtro,
            $idestructura,
            null,
            $start,
            $limit,
            1
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Adiciona procesos
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addProcesoAction()
    {
        $modeloNegocio = new DatProcesoModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('idcomision'),
            $this->_getParam('idestructura')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica prpcesos
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateProcesoAction()
    {
        $modeloNegocio = new DatProcesoModel();
        $arr = $modeloNegocio->update(
            $this->_getParam('idproceso'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('idcomision')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina procesos
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteProcesoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('procesos')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatProcesoModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona personas a un proceso
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addPersonaAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('personas')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatPersonaprocesoModel::add($this->_request->getPost('idproceso'), $p);
            if ($r != true) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Elimina personas del proceso
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deletePersonaAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('personas')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatPersonaprocesoModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Modifica idoneidad
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateIdoneidadAction()
    {
        $modeloNegocio = new DatPersonaprocesoModel();
        $a = $modeloNegocio->updateIdoneidad(
            $this->_getParam('idpersonaproceso'),
            $this->_getParam('idoneo')
        );
        echo Zend_Json::encode($a);
    }

    /**
     * Adiciona recomendaciones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addRecAction()
    {
        $modeloNegocio = new DatPersonarecomendacionModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('idpersonaproceso'),
            $this->_getParam('recomendacion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica recomendaciones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateRecAction()
    {
        $modeloNegocio = new DatPersonarecomendacionModel();
        $arr = $modeloNegocio->update(
            $this->_getParam('idpersonarecomendacion'),
            $this->_getParam('idpersonaproceso'),
            $this->_getParam('recomendacion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina recomendaciones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteRecAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('recomendaciones')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatPersonarecomendacionModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
}