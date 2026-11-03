<?php
class ZendExt_Restrict_Domain_NomClasificacioninformacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_nomsecodena.nom_clasificacioninformacion');
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'fechafin', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('fechaini', 'timestamp without time zone', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idclasificacioninformacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_nomsecodena.sec_nomclasificacioninformacion')
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
