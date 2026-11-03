<?php
class ZendExt_Restrict_Domain_DatConfcompartimentacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_confcompartimentacion');
        $this->hasColumn('idcriterioinformacion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idpermisoentrada', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpermisonivel', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpermisosalida', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idrolanalista', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn(
            'idtipocriteriocompartimentacion', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn('idtipodominio', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn(
            'permisodominio', 'ARRAY', null, array('notnull' => false, 'primary' => false, 'default' => '{0,0,0,0}')
        );
        $this->hasColumn(
            'permisofueradominio', 'ARRAY', null,
            array('notnull' => false, 'primary' => false, 'default' => '{0,0,0,0}')
        );
        $this->hasColumn(
            'permisohijosdominio', 'ARRAY', null,
            array('notnull' => false, 'primary' => false, 'default' => '{0,0,0,0}')
        );
        $this->hasColumn(
            'revocaraccesodenegado', 'bit', 1, array('notnull' => true, 'primary' => false, 'default' => '0')
        );
    }

    public function setUp()
    {
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomTipodominio', array('local' => 'idtipodominio', 'foreign' => 'idfuentedato')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomRolanalista', array('local' => 'idrolanalista', 'foreign' => 'idrolanalista')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomPermisoinformacion',
            array('local' => 'idpermisosalida', 'foreign' => 'idpermiso')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomPermisoinformacion',
            array('local' => 'idpermisonivel', 'foreign' => 'idpermiso')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomPermisoinformacion',
            array('local' => 'idpermisoentrada', 'foreign' => 'idpermiso')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatCriteriocompartimentacion',
            array('local' => 'idcriterioinformacion', 'foreign' => 'idfuentedato')
        );
        parent::setUp();
    }
}
