<?php
class ZendExt_Restrict_Domain_NomPermisoinformacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.nom_permisoinformacion');
        $this->hasColumn('actualizar', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('eliminar', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn(
            'idpermiso', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_compartimentacion.sec_nompermisoinformacion')
        );
        $this->hasColumn('insertar', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('lectura', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
    }

    public function setUp()
    {
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatConfcompartimentacion',
            array('local' => 'idpermiso', 'foreign' => 'idpermisosalida')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatConfcompartimentacion',
            array('local' => 'idpermiso', 'foreign' => 'idpermisonivel')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatConfcompartimentacion',
            array('local' => 'idpermiso', 'foreign' => 'idpermisoentrada')
        );
        parent::setUp();
    }
}
