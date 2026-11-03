<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 17/02/2015
 * Time: 10:13
 */
class OcupacionService extends ZendExt_Model
{
    /**
     * @var
     */
    protected $_objOcupacion;

    /**
     *
     */
    function __construct()
    {
    }

    /**
     * @throws ZendExt_Exception
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addDQLOcupacion(
        Doctrine_Query &$objDQ, $aTR, array $aliasTablas = array(), $typeR = 'leftJoin', $active = true, $inDQL = false,
        $inOT = false
    )
    {
        $_objOcupacion = new SituacionLaboralRepository();
        $_objOcupacion->addDQLOcupacion($objDQ, $aTR, $aliasTablas, $typeR, $active, $inDQL, $inOT);
    }

    public function addSelectDQLOcupacion(Doctrine_Query &$objDQ, array $aliasTablas = array(), $inOT = false)
    {
        $_objOcupacion = new SituacionLaboralRepository();
        $_objOcupacion->addSelectDQLOcupacion($objDQ, $aliasTablas, $inOT);
    }
}