<?php
class ZendExt_Restrict_Domain_DatRolusuariodominio extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_rolusuariodominio');
        $this->hasColumn('idelementodominio', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idrolanalista', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idtipodominio', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('dominio', 'bit', 1, array('notnull' => true, 'primary' => false, 'default' => '1'));
    }

    public function setUp()
    {
        $this->hasOne('ZendExt_Restrict_Domain_SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomTipodominio', array('local' => 'idtipodominio', 'foreign' => 'idfuentedato')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomRolanalista', array('local' => 'idrolanalista', 'foreign' => 'idrolanalista')
        );
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatConfcompartimentacion',
            array('local' => 'idtipodominio', 'foreign' => 'idtipodominio')
        );
        parent::setUp();
    }
}
