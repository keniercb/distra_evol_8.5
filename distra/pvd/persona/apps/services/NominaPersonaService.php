<?php

class NominaPersonaService
{
    protected $_response;

    private $_inyector;

    function __construct()
    {
        $this->_inyector = ZendExt_IoC_Inter::getInstance();
    }

    public function obtenerCargoOficialPersonaNomina($idPersona, $principal = 1)
    {
        try {
            return $this->_inyector->nomina->obtenerCargoOficialPersonaNomina($idPersona, $principal);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function ObtenerDatosNominaPersona($idCargo, $idPersona, $idEntidad)
    {
        try {
            return $this->_inyector->nomina->ObtenerDatosNominaPersona($idCargo, $idPersona, $idEntidad);
        } catch (Exception $e) {
            throw $e;
        }
    }
}