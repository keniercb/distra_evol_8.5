<?php
class ZendExt_Restrict_Domain_NomRolanalista extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_compartimentacion.nom_rolanalista');
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'fechafin', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('fechaini', 'timestamp without time zone', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idrolanalista', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_compartimentacion.sec_nomrolanalista')
        );
    }

    public function setUp()
    {
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatRolusuariodominio',
            array('local' => 'idrolanalista', 'foreign' => 'idrolanalista')
        );
        $this->HasMany(
            'ZendExt_Restrict_Domain_DatConfcompartimentacion',
            array('local' => 'idrolanalista', 'foreign' => 'idrolanalista')
        );
        parent::setUp();
    }
} 
