<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Controller
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class ConfModelosContabilizacion extends BaseConfModelosContabilizacion
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getModelos($idplantilla){
        try{
            $query = Doctrine_Query::create()
                ->select('cm.*, ca.*, cs.*')
                ->from('ConfModelosContabilizacion cm')
                ->where('idplantilla=?',array($idplantilla));
            return $query->fetchArray();
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }
}
