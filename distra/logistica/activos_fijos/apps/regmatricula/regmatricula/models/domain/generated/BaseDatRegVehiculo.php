<?php

/**
 * Created by JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 11/03/15
 * Time: 8:28
 * To change this template use File | Settings | File Templates.
 */
abstract class BaseDatRegVehiculo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_registrovehiculo');

        $this->hasColumn('idregistrovehiculo', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true,
            'sequence' => 'sec_datregistrovehiculo')
        );

        $this->hasColumn('foliocirculacion', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('idtipotramite', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('numerolaser1', 'character varying', 255, array('notnull' => false, 'primary' => false));

        $this->hasColumn('numerolaser2', 'character varying', 255, array('notnull' => false, 'primary' => false));

        $this->hasColumn('idestructura', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('tonelage', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('idcolorchapa', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('idtipochapa', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('idpersona', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('idsector', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('tipo', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('idregnumerico', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('registro', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );

        $this->hasColumn('idmoneda', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idinspectormatricula', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn('jefe', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('acreditador', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('funcionario', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
