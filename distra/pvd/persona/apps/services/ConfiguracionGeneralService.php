<?php

/**
 * Class ConfiguracionGeneralService
 */
class ConfiguracionGeneralService
{
    /**
     * @var null|ZendExt_IoC
     */
    private $_inyector;

    /**
     *
     */
    function __construct()
    {
        $this->_inyector = ZendExt_IoC::getInstance();
    }

    public function getNivelEstructuralPorPais($idPais, $idConceptoNivel)
    {
        try {
            return $this->_inyector->datosmaestros->obtenerNivelEstructuralPorPais($idPais, $idConceptoNivel);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDptDadoArrayIds($ids)
    {
        try {
            return $this->_inyector->datosmaestros->getElementoid($ids);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getChilds($idPadre)
    {
        try {
            return $this->_inyector->datosmaestros->dameHijos($idPadre);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCountrys()
    {
        try {
            return $this->_inyector->datosmaestros->obtenerPaises();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function findContryById($idpais)
    {
        try {
            return $this->_inyector->datosmaestros->obtenerPais($idpais);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEspecialidadesArbol($idespecialidad, $buscar = 0, $busqueda = false)
    {
        try {
            return $this->_inyector->datosmaestros->obtenerArbolEspecialidad($idespecialidad, $buscar, $busqueda);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEspecialidadesHojas()
    {
        try {
            return $this->_inyector->datosmaestros->obtenerEspecialidadesHojas();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getEspecialidadPorId($idespecialidad)
    {
        try {
            return $this->_inyector->datosmaestros->obtenerEspecialidadPorId($idespecialidad);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getBancos()
    {
        try {
            return $this->_inyector->datosmaestros->obtenerBancos();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getMoneda($idmoneda = null, $idEntidad = null)
    {
        try {
            return $this->_inyector->datosmaestros->buscarNomMoneda($idmoneda, $idEntidad);
        } catch (Exception $e) {
            throw $e;
        }
    }
}