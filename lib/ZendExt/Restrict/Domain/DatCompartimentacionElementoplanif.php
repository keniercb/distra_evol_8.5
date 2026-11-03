<?php
class ZendExt_Restrict_Domain_DatCompartimentacionElementoplanif extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.dat_compartimentacion_elementoplanif');
        $this->hasColumn('dominiousuario', 'ARRAY', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idambito', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idelemento', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

    public function setUp()
    {
        $this->hasOne('DatElementoplanif', array('local' => 'idelemento', 'foreign' => 'idelemento'));
        $this->HasMany(
            'DatCompartimentacionElementoplanifUsuario', array('local' => 'idelemento', 'foreign' => 'idelemento')
        );
        $this->hasOne('ZendExt_Restrict_Domain_NomAmbitos', array('local' => 'idambito', 'foreign' => 'idambito'));
        $this->hasOne(
            'ZendExt_Restrict_Domain_SegUsuario', array('local' => 'dominiousuario', 'foreign' => 'posiciondominio')
        );
        parent::setUp();
    }
}
