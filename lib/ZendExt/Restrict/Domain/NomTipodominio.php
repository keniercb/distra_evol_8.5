<?php
class ZendExt_Restrict_Domain_NomTipodominio extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.nom_tipodominio');
        $this->hasColumn('idfuentedato', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function setUp()
    {
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatFuentedato', array('local' => 'idfuentedato', 'foreign' => 'idfuentedato')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatRolusuariodominio',
            array('local' => 'idfuentedato', 'foreign' => 'idtipodominio')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatFuentedominio', array('local' => 'idfuentedato', 'foreign' => 'idtipodominio')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatConfcompartimentacion',
            array('local' => 'idfuentedato', 'foreign' => 'idtipodominio')
        );
        parent::setUp();
    }
} 
