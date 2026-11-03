<?php

class RegimenTrabajoService
{
    protected $response;
    /**
     * @var null|ZendExt_IoC
     */
    private $inyector;

    function __construct()
    {
        $this->inyector = ZendExt_IoC_Inter::getInstance();

    }

    public function getRegimenTrabajo($filtro = null, $limit = null, $start = 0)
    {
        try {
            return $this->inyector->regimentrabajo->GetRegimenTrabajo();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTurnoTrabajo()
    {
        try {
            return $this->inyector->regimentrabajo->getTurnoTrabajo();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getGruposRegimenTrabajo($idregimentrabajo = null, $filtro = null, $limit = null, $start = 0)
    {
        try {
            return $this->inyector->regimentrabajo->GetGruposRegimenTrabajo($idregimentrabajo, $filtro, $limit, $start);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function saveRegimentrabajoMasivo($data, $idregimentrabajo, $idgrupodescanso, $fdesde)
    {
        try {
            $objDomain = new DatRegimentrabajoModel();
            $objDomain->addRegimenTrabajoMasivo($data, $idregimentrabajo, $idgrupodescanso, $fdesde);
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addDQLRegimenTrabajo(Doctrine_Query &$objDQ, $aTR, $aT, $typeR = 'leftJoin', $inDQL = false)
    {
        $obDomain = new DatRegimentrabajo();
        $obDomain->addDQLRegimenTrabajo($objDQ, $aTR, $aT, $typeR, $inDQL);
    }

    public function addSelectDQLRegimenTrabajo(Doctrine_Query &$objDQ, $aT)
    {
        $obDomain = new DatRegimentrabajo();
        $obDomain->addSelectDQLOcupacion($objDQ, $aT);
    }

}