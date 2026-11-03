<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 1/20/2016
 * Time: 3:53 PM
 */
abstract class BaseDatVehiculoTipoTramite extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_vehiculotipotramite');

        $this->hasColumn('idvehiculotipotramite', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true)
        );

        $this->hasColumn('idregistrovehiculo', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('idtipotramite', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
