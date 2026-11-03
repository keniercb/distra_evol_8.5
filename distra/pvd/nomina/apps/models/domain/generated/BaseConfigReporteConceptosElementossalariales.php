<?php

/**
 * BaseConfigReporteConceptosElementossalariales
 *
 * 
 *
 * 
 * @author Ing. Milena Gainza Rodríguez.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @copyright XETID
 * @version 1.0
 */
abstract class BaseConfigReporteConceptosElementossalariales extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_reporteconceptoselementossalariales');

		$this->hasColumn('idconfconceptoselementossalariales', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
			'sequence'=>'mod_nomina.sec_conf_reporteconceptoselementossalariales'
        ));
		
		$this->hasColumn('idconceptopd', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false,
        ));
        

    }

    public function setUp(){

        parent::setUp();
		
		$this->hasOne('NomConceptoPercepcionDescuento', array(
             'local' => 'idconceptopd',
             'foreign' => 'idconceptopercepciondescuento'
        ));
		

    }
}