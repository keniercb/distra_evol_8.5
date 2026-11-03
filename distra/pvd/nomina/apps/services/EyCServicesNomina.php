<?php

/**
 * Class EstructurayComposicionService
 */
class EyCServicesNomina
{
    /**
     * @var
     */
    private $inyector;

    /**
     *
     */
    function __construct()
    {
        $this->inyector = ZendExt_IoC::getInstance();
    }

    /**
     * @param $id
     *
     * @return mixed
     * @throws Exception
     */
    public function getHijosEstructura($id)
    {
        try {
            return $this->inyector->metadatos->DameHijosEstructura($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $id
     *
     * @return mixed
     * @throws Exception
     */
    public function getEstructura($id)
    {
        try {
            return $this->inyector->metadatos->DameEstructura($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $id
     *
     * @return mixed
     * @throws Exception
     */
    public function getCargosByEstructura($id)
    {
        try {
            return $this->inyector->metadatos->obtenerCargosEstructura($id, true);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNomMilitaryDegrees($start = 0, $limit = 1000)
    {
        try {
            return $this->inyector->metadatos->buscarGradoMilitar($start, $limit);
        } catch (Exception $e) {
            throw $e;
        }

    }
    public function getDenomGradoById($idgrado)
    {
        try {
            return $this->inyector->metadatos->dameGrado($idgrado);
        } catch (Exception $e) {
            throw $e;
        }

    }
    public function getDatosCargo($id)
    {
        try {
            return $this->inyector->metadatos->obtenerDatosCargo($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function agregarDQLDatosCargo(Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect)
    {
        try {
            return $this->inyector->metadatos->agregarDqlDatosCargo($objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getRutaEstructura(array $id)
    {
        try {
            return $this->inyector->metadatos->getRutaEstructura($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerIUEstructura(){
        try {
            return $this->inyector->metadatos->obtenerIUEstructura();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function syncCompletamientoCargo($idcargo, $cant){
        try {
            return $this->inyector->metadatos->registrarAltasBajas($idcargo, $cant);
        } catch (Exception $e) {
            throw $e;
        }
    }
}