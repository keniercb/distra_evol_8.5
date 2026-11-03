<?php

abstract class BaseCfgGruposCuentas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_gruposcuentas');
        $this->hasColumn(
            'idgrupocuenta', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'secuence' => 'mod_activofijotangible.sec_confgrupocuenta')
        );
        $this->hasColumn(
            'idgruposubgrupo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcuentaactivo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcuentadepreciacion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcuentaactivoalternativa', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcuentadepreciacionalternativa', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
