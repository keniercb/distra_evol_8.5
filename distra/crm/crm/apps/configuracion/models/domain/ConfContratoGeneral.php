<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class ConfContratoGeneral extends BaseConfContratoGeneral
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        parent::setUp();
    }

    public function getConfig()
    {
        return Doctrine_Query::create()
            ->from('ConfContratoGeneral')
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

}
