<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 09/10/17
 * Time: 17:25
 */
class GestionarreciengraduadoController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestionarreciengraduadoAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de los reci�n graduados
     * @return Arreglo con los reci�n graduados
     * @author Yaricel Guerra Vel�zquez
     */
    function getRecienGraduadoAction()
    {
        $filtro = $this->_getParam('query');
        $idestructura = $this->_getParam('idestructura');
        $idcargo = $this->_getParam('idcargo');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = DatReciengraduadoModel::getRecienGraduado($filtro, $idestructura, $idcargo, $limit, $start);
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de personas
     * @return Arreglo con las personas
     * @author Yaricel Guerra Vel�zquez
     */
    function getPersonasAction()
    {
        $filtro = $this->_getParam('query');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $idcargo = $this->_getParam('idcargo');
        $idestructura = $this->_getParam('idestructura');
        $arrayCargo = Array();
        if (!empty($idcargo)) {
            array_push($arrayCargo, $idcargo);
        } else {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                foreach ($cargos as $carg) {
                    array_push($arrayCargo, $carg['idcargo']);
                }
            }
        }
        $obj = new DatNecesidad();
        $datos->datos = $obj->getSituacionByIdCargo($arrayCargo, $filtro, 1);
        $datos->cantidad = $obj->cantSituacionByIdCargo($arrayCargo, $filtro, 1);
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el arbol de estructuras organizativas
     * @return Arreglo con las estructuras organizativas
     * @author Yaricel Guerra Vel�zquez
     */
    function getEstructuraCargoAction()
    {
        try {
            $result = Array();
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
                $estr = ZendExt_IoC::getInstance()->metadatos->DameEstructura($id);
                array_push($result, $estr[0]);

            } else {
                $id = $this->_getParam('node');
                $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
                foreach ($r as $t => $est) {
                    if ($est->idconcepto == 7) {
                        $est->text = $est->text . " <b>($est->cantidad | $est->cantidad_real)</b>";
                    }
                    array_push($result, $est);
                }
            }
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }
    //getIndicadoresRecienG

    /**
     * Obtiene el listado de indicadores del recien graduado
     *
     * @return Arreglo con los indicadores
     * @author Yaricel Guerra Vel�zquez
     */
    function getIndicadoresRecienGAction()
    {
        $modeloNegocio = new DatRgindicadorModel();
        $datos = $modeloNegocio->getIndicadoresRecienG(
            $this->_getParam('idrgperiodo'), $this->_getParam('idreciengraduado'),
            $this->_getParam('query'), $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de tareas
     *
     * @return Arreglo con las tareas
     * @author Yaricel Guerra Vel�zquez
     */
    function getTareasAction()
    {
        $modeloNegocio = new DatRgtareaModel();
        $datos = $modeloNegocio->getTareas(
            $this->_getParam('idreciengraduado'), $this->_getParam('query'), $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de indicadores Nomenclados
     *
     * @return Arreglo con los indicadores
     * @author Yaricel Guerra Vel�zquez
     */
    function getIndicadoresAction()
    {
        $modeloNegocio = new NomIndicadoramedirModel();
        $datos = $modeloNegocio->getIndicadoresActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de las extensiones de preparaci�n
     *
     * @return Arreglo con los reci�n graduados
     * @author Yaricel Guerra Vel�zquez
     */
    function getExtensionesAction()
    {
        $idreciengraduado = $this->_getParam('idreciengraduado');
        $datos = DatExtensionprepModel::getExtensiones($idreciengraduado);
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de valores de la escala del indicador Nomenclados
     *
     * @return Arreglo con los valores
     * @author Yaricel Guerra Vel�zquez
     */
    function getValoresIndAction()
    {
        $valores =
            ZendExt_IoC_Inter::getInstance()->maestro->getValoresByEscala($this->_request->getPost('idescala'));
        echo Zend_Json::encode($valores);
    }

    function getPeriodosAction()
    {
        $modeloNegocio = new DatRgperiodoModel();
        $datos = $modeloNegocio->getPeriodoesRecienG($this->_getParam('idreciengraduado'));
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de los l�mites
     *
     * @return Arreglo con todas los l�mites
     * @author Yaricel Guerra Velazquez
     */
    function getLimitesAction()
    {
        $obj = new ConflimitesModel();
        $arr = $obj->getLimites();
        echo Zend_Json::encode($arr);
    }

    /**
     * Adiciona reci�n graduados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addRecienGraduadoAction()
    {
        $modeloNegocio = new DatReciengraduadoModel();
        $arr = $modeloNegocio->addRecienGraduado(
            $this->_getParam('idpersona'),
            $this->_getParam('idjefeinmediato'),
            $this->_getParam('idtutor'),
            $this->_getParam('tiempo'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhastass'),
            $this->_getParam('idperiodo')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica reci�n graduados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateRecienGraduadoAction()
    {
        $modeloNegocio = new DatReciengraduadoModel();
        $arr = $modeloNegocio->updateRecienGraduado(
            $this->_getParam('idreciengraduado'),
            $this->_getParam('idpersona'),
            $this->_getParam('idjefeinmediato'),
            $this->_getParam('idtutor'),
            $this->_getParam('tiempo'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhastass'),
            $this->_getParam('idperiodo')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina reci�n graduados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteRecienGraduadoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idsreciengraduado')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatReciengraduadoModel::deleteRecienGraduado($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona extensi�n al periodo de preparaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addExtensionAction()
    {
        $modeloNegocio = new DatExtensionprepModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('idreciengraduado'),
            $this->_getParam('tiempo'),
            $this->_getParam('fextension')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina extensiones de preparaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteExtensionAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idextensiones')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatExtensionprepModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona periodos
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addPeriodoAction()
    {
        $modeloNegocio = new DatRgperiodoModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('idreciengraduado'), $this->_getParam('denominacion'),
            $this->_getParam('fdesde'), $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica periodos
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updatePeriodoAction()
    {
        $modeloNegocio = new DatRgperiodoModel();
        $arr = $modeloNegocio->update(
            $this->_getParam('idrgperiodo'), $this->_getParam('denominacion'),
            $this->_getParam('fdesde'), $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina periodos
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deletePeriodosAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('periodos')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRgperiodoModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona tareas
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addTareaAction()
    {
        $modeloNegocio = new DatRgtareaModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('idreciengraduado'), $this->_getParam('tarea')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica tareas
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateTareaAction()
    {
        $modeloNegocio = new DatRgtareaModel();
        $arr = $modeloNegocio->update(
            $this->_getParam('idrgtarea'), $this->_getParam('tarea')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina tareas
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteTareaAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('tareas')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRgtareaModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona indicadores
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addIndicadorAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idindicadores')));
        DatRgindicador::eliminarByIndicador($arrayids, $this->_getParam('idreciengraduado'));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRgindicadorModel::add($this->_getParam('idreciengraduado'), $p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo Zend_Json::encode($respuesta);
    }

    /**
     * Modifica indicadores
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateIndicadorAction()
    {
        $modeloNegocio = new DatRgindicadorModel();
        $arr = $modeloNegocio->evaluar(
            $this->_getParam('idrgindicador'), $this->_getParam('idvalorescala'),
            $this->_getParam('idrgperiodo')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina indicadores
     *
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteIndicadorAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('indicadores')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatRgindicadorModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function generarEvaluacionAction()
    {
        $idreciengraduado = $this->_getParam('idreciengraduado');
        $objReportePDF = new ReportepdfEvalRGModel();
        $objReportePDF->CrearReportePDF($idreciengraduado);
        return true;
    }
}