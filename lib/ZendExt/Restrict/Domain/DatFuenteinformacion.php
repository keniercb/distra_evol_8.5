<?php
class ZendExt_Restrict_Domain_DatFuenteinformacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_fuenteinformacion');
        $this->hasColumn('idfuentedato', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function setUp()
    {
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatFuentedato', array('local' => 'idfuentedato', 'foreign' => 'idfuentedato')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatFuentedominio',
            array('local' => 'idfuentedato', 'foreign' => 'idfuenteinformacion')
        );
        parent::setUp();
    }
}
