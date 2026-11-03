<?php

class ConfEspecialidadreporte extends BaseConfEspecialidadreporte {

    public function setUp () {
        parent::setUp ();
       $this->hasMany ('Confreporte', array('local' => 'idreporte', 'foreign' => 'idconfreporte'));

    }
	
	public function existsEspecialidadRectora ( $params ) {
        $query = Doctrine_Query::create();
        $result = $query->select ('*')
		                ->from ('ConfEspecialidadreporte cer')
		                ->where ('cer.idespecialidad <>? and cer.rectora = 1', array( $params['idespecialidad'] ) )
						->count(); 		
        return $result;
    }
	
	public function cargarEspecialidad ( $params ) {
        $query = Doctrine_Query::create();
        $result = $query->select ('*')
		                ->from ('ConfEspecialidadreporte cer')
		                ->where ('cer.idespecialidad =?', array( $params['idespecialidad'] ) )
						->fetchArray();
        return $result;
    }
	
	public function cargarReportes ( $params ) {  
	    $result = Array(); 	
		if ( $params ['all'] ) {
			$result = Confreporte::cargarReportes ( $params );
		} else {
			 $query = Doctrine_Query::create()
			    ->select ('*')	
     		    ->from ('ConfEspecialidadreporte cer')
			    ->innerJoin ('cer.Confreporte cr')
			    ->addWhere ('cer.idespecialidad =? and cr.visible =?', array( $params['idespecialidad'] , $params['visible'] ) );
				$result = $query->fetchArray();			
		}		
        return $result;
    }
	
}

