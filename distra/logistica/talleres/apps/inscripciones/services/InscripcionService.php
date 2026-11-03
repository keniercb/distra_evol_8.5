<?php

/**
 * @class      OrdenTrabajoTalleresService
 * @package    talleres
 * @author     Daniel Arias Epinosa
 * @copyright  XETID
 */
class InscripcionService extends ZendExt_Model
{
    private $_model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_model = new InscripcionModel(
            array('alias' => 'INS', 'subsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES)
        );
    }

    /**
     * Devuelve  las inscripciones y filtra por idcliente, idproducto, fechainicio y estado
     *
     * @param      $params
     * @param bool $dqlResult
     *
     * @return array|Doctrine_Query
     */
    public function devolverInscripciones($params, $dqlResult)
    {
        return $this->_model->devolverInscripciones($params, $dqlResult);
    }


}
