<?php

/**
 * Class ReccomplejaService
 */
class RecuperadorComplejoService
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

    public function obtenerReporte($idconfiguracion, $condiciones, $orden, $limit, $start)
    {
        try {
            return $this->_inyector->reccomplejas->obtenerReporte(
                $idconfiguracion, $condiciones, $orden, $limit, $start
            );
        } catch (Exception $e) {
            throw $e;
        }
    }
}