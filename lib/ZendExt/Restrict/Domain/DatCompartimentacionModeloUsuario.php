<?php
class ZendExt_Restrict_Domain_DatCompartimentacionModeloUsuario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_compartimentacion_modelo_usuario');
        $this->hasColumn('idactor', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idubicacion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('permisos', 'ARRAY', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne('DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasOne('ZendExt_Restrict_Domain_DatFuente', array('local' => 'idactor', 'foreign' => 'idactor'));
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomUbicacion', array('local' => 'idubicacion', 'foreign' => 'idubicacion')
        );
        $this->hasMany('ZendExt_Restrict_Domain_SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
        parent::setUp();
    }
}

