<?php
class ZendExt_Restrict_Domain_DatCompartimentacionElementoplanifUsuario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_compartimentacion_elementoplanif_usuario');
        $this->hasColumn('idambito', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn(
            'permisos', 'ARRAY', null, array('notnull' => false, 'primary' => false, 'default' => '{0,0,0,0}')
        );
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'ZendExt_Restrict_Domain_DatCompartimentacionElementoplanif',
            array('local' => 'idelemento', 'foreign' => 'idelemento')
        );
        $this->hasOne('ZendExt_Restrict_Domain_SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
        parent::setUp();
    }

} 
 
