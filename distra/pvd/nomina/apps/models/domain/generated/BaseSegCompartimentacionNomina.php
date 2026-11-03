<?php

abstract class BaseSegCompartimentacionNomina extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.seg_compartimentacionnomina');

        $this->hasColumn('idcompartimentacionnomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_seg_compartimentacionnomina'
        ));

		$this->hasColumn('idcargo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
    }
}
