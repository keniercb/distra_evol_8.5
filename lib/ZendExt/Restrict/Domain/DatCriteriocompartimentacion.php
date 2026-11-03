<?php
class ZendExt_Restrict_Domain_DatCriteriocompartimentacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_criteriocompartimentacion');
        $this->hasColumn('idfuentedato', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function setUp()
    {
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatFuentedato', array('local' => 'idfuentedato', 'foreign' => 'idfuentedato')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatConfcompartimentacion',
            array('local' => 'idfuentedato', 'foreign' => 'idcriterioinformacion')
        );
        parent::setUp();
    }
} 
