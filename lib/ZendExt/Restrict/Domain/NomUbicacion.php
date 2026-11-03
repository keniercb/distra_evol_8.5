<?php
class ZendExt_Restrict_Domain_NomUbicacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estadistica.nom_ubicacion');
        $this->hasColumn(
            'idubicacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_estadistica.sec_ubicacion')
        );
        $this->hasColumn('dominio', 'bit', 1, array('notnull' => true, 'primary' => false, 'default' => '1'));
    }

    public function setUp()
    {
        parent::setUp();
    }
}
