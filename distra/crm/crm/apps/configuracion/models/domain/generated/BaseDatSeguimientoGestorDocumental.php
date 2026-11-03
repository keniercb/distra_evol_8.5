<?php

abstract class BaseDatSeguimientoGestorDocumental extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmadministracion.dat_seguimientogestordocumental');
        $this->hasColumn(
            'idseguimientogestordocumental', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmadministracion.sec_contratogestordocumental')
        );
        $this->hasColumn('denominacion', 'varchar', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idespaciotrabajo', 'varchar', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('activo', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('organizacion', 'json', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
