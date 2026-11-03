<?php
class ZendExt_Restrict_Domain_DatConfigfuentedato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_configfuentedato');
        $this->hasColumn('campo', 'character varying', 50, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idconfigfuentedato', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_compartimentacion.sec_datconfigfuentedatos')
        );
        $this->hasColumn('identificador', 'character varying', 50, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfuentedato', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nivel', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('padre', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('pk', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
    }

    public function setUp()
    {
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatFuentedato', array('local' => 'idfuentedato', 'foreign' => 'idfuentedato')
        );
        parent::setUp();
    }
}
