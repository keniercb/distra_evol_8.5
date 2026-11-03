<?php

/**
 * @class      OrdenTrabajoTalleresService
 * @package    talleres
 * @author     Daniel Arias Epinosa
 * @copyright  XETID
 */
class SolicitudService extends ZendExt_Model
{
    private $_model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(
            LogisticaGlobal::SUBSISTEMA_AFT
        );
        $this->_model = new SolicitudModel(
            array('alias' => 'solServicio', 'subsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES), $aperturaAFT
        );
    }
    public function getUtilesServices(){
        return $this->_model->getUtilesServices();
        return $this->_model->getUtilesServices();
    }

    public function getDocAFTServices(){
        return $this->_model->getDocAFTServices();
    }
    /**
     * Devuelve los servicios a terceros
     *
     * @param $parametrosz
     *
     * @return array
     */
    public function getServiciosTerceros($parametros)
    {
        $result = $this->_model->devolverServicios($parametros);
        return $result;
    }

    /**
     * Devuelve los solicitudes a terceros
     *
     * @param $parametrosz
     *
     * @return array
     */
    public function getSolicitudTerceros($parametros)
    {
        $result = $this->_model->devolverSolicitudesTercerosAprobadas($parametros);
        return $result;
    }

    /**
     * Devuelve los solicitudes en estado aprobado
     *
     * @param $parametrosz
     *
     * @return array
     */
    public function getSolicitudesAprobadas($parametros)
    {
        $result = $this->_model->devolverSolicitudesAprobadas($parametros);
        return $result;
    }


}
