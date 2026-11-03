<?php
class ZendExt_Restrict_Domain_DatFuentedato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_fuentedato');
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fuente', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idfuentedato', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_compartimentacion.sec_datfuentedato')
        );
        $this->hasColumn('uri', 'character varying', 50, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        $this->HasMany(
            'ZendExt_Restrict_Domain_NomTipodominio', array('local' => 'idfuentedato', 'foreign' => 'idfuentedato')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatFuenteinformacion',
            array('local' => 'idfuentedato', 'foreign' => 'idfuentedato')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatCriteriocompartimentacion',
            array('local' => 'idfuentedato', 'foreign' => 'idfuentedato')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatConfigfuentedato', array('local' => 'idfuentedato', 'foreign' => 'idfuentedato')
        );
        parent::setUp();
    }
} 
