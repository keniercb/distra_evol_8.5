<?php

class GestequipoaltoriesgoController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestequipoaltoriesgoAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    function getEquipoaltoriesgoAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $filtro = $this->_getParam('filtro');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $objModel = new DatEquipoaltoriesgoModel();
        $datos = $objModel->getEquipoaltoriesgoByEstructura($idestructura, $filtro, $start, $limit);
        echo Zend_Json::encode($datos);
    }

    function getPaisesAction()
    {
        $datos = ZendExt_IoC::getInstance()->datosmaestros->obtenerPaises();
        echo Zend_Json::encode($datos);
    }

    function getClasificacionesAction()
    {
        $modeloNegocio = new NomClasifequipoModel();
        $arr = $modeloNegocio->getClasificacionesActivos();
        echo Zend_Json::encode($arr);
    }

    function getTipoInspeccionesAction()
    {
        $modeloNegocio = new NomTipoinspeccion();
        $arr = $modeloNegocio->getTipoInspeccionActivos();
        echo Zend_Json::encode($arr);
    }

    function getResultadoInspeccionAction()
    {
        $modeloNegocio = new NomResultadoinspeccion();
        $arr = $modeloNegocio->getResultadoinspeccionActivos();
        echo Zend_Json::encode($arr);
    }

    function getInspeccionesAction()
    {
        $modeloNegocio = new DatInspeccionequipoModel();
        $arr = $modeloNegocio->getInspeccionesByEquipo(
            $this->_getParam('idequipoaltoriesgo'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }

    function getObservacionesAction()
    {
        $modeloNegocio = new DatObservacionequipo();
        $arr = $modeloNegocio->getObservacionByEquipo(
            $this->_getParam('idequipoaltoriesgo'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }

    function addEquipoaltoriesgoAction()
    {
        $objModelo = new DatEquipoaltoriesgoModel();
        $datos = $objModelo->addEquipoaltoriesgo(
            $this->_getParam('idestructura'),
            $this->_getParam('idclasifequipo'),
            $this->_getParam('denominacion'),
            $this->_getParam('inventario'),
            $this->_getParam('modelo'),
            $this->_getParam('idpaisfabricante'),
            $this->_getParam('annofabricacion'),
            $this->_getParam('serie'),
            $this->_getParam('presioncalculo'),
            $this->_getParam('presionautorizada'),
            $this->_getParam('capacidadcalculo'),
            $this->_getParam('capacidadautorizada'),
            $this->_getParam('ubicacion')
        );
        echo Zend_Json::encode($datos);
    }

    function addInspeccionAction()
    {
        $objModelo = new DatInspeccionequipoModel();
        $datos = $objModelo->addInspeccionequipo(
            $this->_getParam('idequipoaltoriesgo'), $this->_getParam('idtipoinspeccion'),
            $this->_getParam('idresultadoinspeccion'), $this->_getParam('fplan'), $this->_getParam('finspeccion')
        );
        echo Zend_Json::encode($datos);
    }

    function addObservacionAction()
    {
        $objModelo = new DatObservacionequipoModel();
        $datos = $objModelo->addObservacionequipo(
            $this->_getParam('idequipoaltoriesgo'), $this->_getParam('observacion')
        );
        echo Zend_Json::encode($datos);
    }

    function modEquipoaltoriesgoAction()
    {
        $objModelo = new DatEquipoaltoriesgoModel();
        $datos = $objModelo->modEquipoaltoriesgo(
            $this->_getParam('idequipoaltoriesgo'),
            $this->_getParam('idestructura'),
            $this->_getParam('idclasifequipo'),
            $this->_getParam('denominacion'),
            $this->_getParam('inventario'),
            $this->_getParam('modelo'),
            $this->_getParam('idpaisfabricante'),
            $this->_getParam('annofabricacion'),
            $this->_getParam('serie'),
            $this->_getParam('presioncalculo'),
            $this->_getParam('presionautorizada'),
            $this->_getParam('capacidadcalculo'),
            $this->_getParam('capacidadautorizada'),
            $this->_getParam('ubicacion')
        );
        echo Zend_Json::encode($datos);
    }

    function modInspeccionAction()
    {
        $objModelo = new DatInspeccionequipoModel();
        $datos = $objModelo->updateInspeccionequipo(
            $this->_getParam('idinspeccionequipo'), $this->_getParam('idequipoaltoriesgo'),
            $this->_getParam('idtipoinspeccion'), $this->_getParam('idresultadoinspeccion'), $this->_getParam('fplan'),
            $this->_getParam('finspeccion')
        );
        echo Zend_Json::encode($datos);
    }

    function modObservacionAction()
    {
        $objModelo = new DatObservacionequipoModel();
        $datos = $objModelo->updateObservacionequipo(
            $this->_getParam('idobservacionequipo'), $this->_getParam('idequipoaltoriesgo'),
            $this->_getParam('observacion')
        );
        echo Zend_Json::encode($datos);
    }

    function delEquipoaltoriesgoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idequipoaltoriesgo')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $objModel = new DatEquipoaltoriesgoModel();
            $r = $objModel->delEquipoaltoriesgo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function deleteInspeccionAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('inspecciones')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $objModel = new DatInspeccionequipoModel();
            $r = $objModel->deleteInspeccionequipo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function deleteObservacionAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('observaciones')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $objModel = new DatObservacionequipoModel();
            $r = $objModel->deleteObservacionequipo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
}