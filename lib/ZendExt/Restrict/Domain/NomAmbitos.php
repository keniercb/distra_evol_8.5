<?php
class ZendExt_Restrict_Domain_NomAmbitos extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_nomsecodena.nom_ambitos');
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'fechafin', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('fechaini', 'timestamp without time zone', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idambito', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_nomsecodena.sec_nomambitos')
        );
        $this->hasColumn('idambitopadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconcepto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnivelestructural', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('lft', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'posiciondominio', 'numeric', null, array('notnull' => false, 'primary' => false,
                                                      'sequence' => 'mod_nomsecodena.sec_nomambitos_posiciondominio')
        );
        $this->hasColumn('rgt', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('dominio', 'bit', 1, array('notnull' => true, 'primary' => false, 'default' => '1'));
    }

    public function setUp()
    {
        //$this->hasOne('NomNivelestructural', array('local'=>'idnivelestructural','foreign'=>'idnivelestructural'));
        //$this->hasOne('NomConceptonivel', array('local'=>'idconcepto','foreign'=>'idconceptonivel'));
        $this->HasMany(
            'ZendExt_Restrict_Domain_NomAmbitos', array('local' => 'idambito', 'foreign' => 'idambitopadre')
        );
        $this->hasOne('ZendExt_Restrict_Domain_NomAmbitos', array('local' => 'idambitopadre', 'foreign' => 'idambito'));
        $this->hasOne(
            'ZendExt_Restrict_Domain_NomAmbitosDominio', array('local' => 'idambito', 'foreign' => 'idambito')
        );
        parent::setUp();
    }
}
