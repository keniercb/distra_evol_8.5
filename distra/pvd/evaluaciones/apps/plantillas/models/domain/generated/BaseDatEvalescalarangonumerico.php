<?php
abstract class BaseDatEvalescalarangonumerico extends Doctrine_Record
 {
   public function setTableDefinition()
    {
		$this->setTableName('mod_evaluaciones.dat_evalescalarangonumerico');
		$this->hasColumn('idescalarangonumerico', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' =>'mod_evaluaciones.sec_evalrangonumerico'));
		$this->hasColumn('idescala', 'numeric', null, array('notnull' => true, 'primary' => false));
		$this->hasColumn('valorinicial', 'numeric', null, array('notnull' => true, 'primary' => false));
		$this->hasColumn('valorfinal', 'numeric', null, array('notnull' => true, 'primary' => false));
		$this->hasColumn('paso', 'numeric', null, array('notnull' => true, 'primary' => false));
		$this->hasColumn('precision', 'numeric', null, array('notnull' => false, 'primary' => false));
		$this->hasColumn('representacion', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

   public function Setup()
    {
       parent::setUp();
    }
 }