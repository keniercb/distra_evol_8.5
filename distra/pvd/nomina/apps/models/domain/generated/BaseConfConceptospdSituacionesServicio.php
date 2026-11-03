<?php

abstract class BaseConfConceptospdSituacionesServicio extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_conceptospdsituacionesservicio');

        $this->hasColumn('idconceptospdsituacionesservicio', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_conceptospdsituacionesservicio'
        ));
        
        $this->hasColumn('idsituacionservicio', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('idconceptopercepciondescuento', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));



    }
	
	public function setUp(){

        parent::setUp();
        
        $this->hasMany('NomConceptoPercepcionDescuento', array(
             'local' => 'idconceptopercepciondescuento',
             'foreign' => 'idconceptopercepciondescuento'
        ));

        $this->hasMany('NomSituacionLaboral', array(
             'local' => 'idsituacionservicio',
             'foreign' => 'idsituacionlaboral'
        ));


    }
}
