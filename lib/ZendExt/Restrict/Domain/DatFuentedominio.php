<?php
class ZendExt_Restrict_Domain_DatFuentedominio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_fuentedominio');
        $this->hasColumn('campoiddominio', 'character varying', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('campoidfuente', 'character varying', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fuente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfuenteinformacion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idtipodominio', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function setUp()
    {
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomTipodominio', array('local' => 'idtipodominio', 'foreign' => 'idfuentedato')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatFuenteinformacion',
            array('local' => 'idfuenteinformacion', 'foreign' => 'idfuentedato')
        );
        parent::setUp();
    }
} 
