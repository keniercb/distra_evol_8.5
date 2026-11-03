<?php
abstract class BaseNomSector extends Doctrine_Record
 {
   public function setTableDefinition()
    {
       $this->setTableName('mod_persona.nom_sector');
       $this->hasColumn('idsector', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_nom_sector'));
       $this->hasColumn('denom', 'character varying', 100 , array('notnull' => true, 'primary' => false));
       $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
       $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
	    $this->hasColumn('descripcion', 'string', 255, array('fixed' => false, 'notnull' => false, 'primary' => false));

    }

   public function Setup()
    {
       parent::setUp();
    }
 }//fin clase
?>
