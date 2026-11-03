<?php
class ZendExt_Restrict_Domain_DatModeloestadistico extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estadistica.dat_modeloestadistico');
        $this->hasColumn('denominacionmodelo', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcionmodelo', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestatusmodelo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_estadistica.sec_modelo')
        );
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ordender', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ordenizq', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('dominio', 'bit', 1, array('notnull' => true, 'primary' => false, 'default' => '1'));
    }

    public function setUp()
    {
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatModeloestadistico', array('local' => 'idmodelo', 'foreign' => 'idpadre')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatModeloestadistico', array('local' => 'idpadre', 'foreign' => 'idmodelo')
        );
        parent::setUp();
    }
}
