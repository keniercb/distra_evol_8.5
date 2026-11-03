<?php
/**
 * @name RankingcargoController
 * @package   competencia
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class RankingcargoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function rankingcargoAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de personas
     * @return Arreglo con las personas
     * @author Yaricel Guerra Velazquez
     */
    function getPersonasAction()
    {
        $filtro = $this->_getParam('query');
        $idcargo = $this->_getParam('idcargo');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
            $filtro,
            null,
            $idcargo,
            $start,
            $limit,
            1
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el ranking de trabajadores
     * @return Arreglo con el ranking de trabajadores
     * @author Yaricel Guerra Velazquez
     */
    function ejecutarRankingAction()
    {
        //Hola
        echo Zend_Json::encode($datos);
    }
}