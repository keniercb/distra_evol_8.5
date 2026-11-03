<?php

class EvaluacionesService
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

    public function getEvaluacionesByPersona($idpersona, $limit = null, $start = null, $idprocesoevaluativo = null)
    {
        try {
            return $this->inyector->evaluaciones->getEvaluacionesPersona($idpersona, $limit, $start, $idprocesoevaluativo);
        } catch (Exception $e) {
            throw $e;
        }
    }
}