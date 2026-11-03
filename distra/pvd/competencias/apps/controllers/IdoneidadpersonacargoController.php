<?php
/**
 * @name IdoneidadpersonacargoController
 * @package   competencia
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class IdoneidadpersonacargoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function idoneidadpersonacargoAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de personas con idoneidad
     * @return Arreglo con las personas
     * @author Yaricel Guerra Velazquez
     */
    function getPersonasAction()
    {
        $filtro = $this->_getParam('query');
        $idestructura = $this->_getParam('idestructura');
        $idcargo = $this->_getParam('idcargo');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');

        $tipo = (empty($idcargo))?DatIdoneidad::getCongigIdon($idestructura):Array();;
        if (count($tipo)==0 || $tipo[0]['tipo'] == 1) {
            $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
                $filtro,
                $idestructura,
                $idcargo,
                $start,
                $limit,
                1
            );
            $modeloNegocio = new DatCompetenciaModel();
            foreach ($datos->datos as $p=>$per) {
                $datos->datos[$p]['tipo'] = 1;
                $comp = $modeloNegocio->getCompetenciaByPersonaCargo($per['idcargo'], $per['idpersona']);
                if (count($comp) > 0) {
                    $datos->datos[$p]['idoneo'] = 1; // idoneo
                    foreach ($comp as $valc) {
                        if ($valc['idoneo'] == 2) {
                            $datos->datos[$p]['idoneo'] = 2;
                        }
                    }
                }
            }
        } else {
            $datos = DatIdoneidadModel::getPersonasByEstructura($idestructura, $filtro, $start, $limit);
        }

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
        $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
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

    function getIdoneidadAction()
    {
        $personas = json_decode(stripslashes($this->_getParam('personas')));
        $modeloNegocio = new DatCompetenciaModel();
        $res = Array();
        foreach ($personas as $p=>$per) {
            $res[$p]['idpersona'] = $per;
            $comp = $modeloNegocio->getCompetenciaByPersonaCargo($this->_getParam('idcargo'), $per);
            if (count($comp) > 0) {
                $res[$p]['idoneo'] = 1; // idoneo
                foreach ($comp as $valc) {
                    if ($valc['idoneo'] == 2) {
                        $res[$p]['idoneo'] = 2;
                    }
                }
            }
        }
        echo Zend_Json::encode($res);
    }
    
    /**
     * Obtiene el listado de las competencias del cargo
     * @return Arreglo con las competencias del cargo
     * @author Yaricel Guerra Velazquez
     */
    function getCompetenciasByCargoAction()
    {
        $modeloNegocio = new DatCompetenciaModel();
        $arr = $modeloNegocio->getCompetenciaByPersonaCargo($this->_getParam('idcargo'), $this->_getParam('idpersona'));
        echo Zend_Json::encode($arr);
    }

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

    function exportarResumenAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $idcargo = $this->_getParam('idcargo');
        $tipo = $this->_getParam('tipo');
        $objReportePDF = new ReportepdfresumenidoneidadModel();
        $objReportePDF->CrearReportePDF($idestructura, $idcargo, $tipo);
        return true;
    }

    function exportarIdoneidadcargoAction()
    {
        $parametros = $this->_request->getParams();
        $personas = json_decode($parametros['datos']);
        $idcargo = $this->_getParam('idcargo');
        $objReportePDF = new ReportepdfidoneidadcargoModel();
        $objReportePDF->CrearReportePDF($personas, $idcargo);
        return true;
    }

    function exportarNoidoneoAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $idcargo = $this->_getParam('idcargo');
        $tipo = $this->_getParam('tipo');
        $objReportePDF = new ReportepdfnoidoneoModel();
        $objReportePDF->CrearReportePDF($idestructura, $idcargo, $tipo);
        return true;
    }
}