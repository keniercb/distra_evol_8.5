<?php

class Confreporte extends BaseConfreporte {

    public function setUp () {
        parent::setUp ();
      //  $this->hasMany ('DatMatrizprecio', array('local' => 'idprecio', 'foreign' => 'idprecio'));

    }
	public function cargarReportes ( $params ) {
        $query = Doctrine_Query::create();
        $result = $query->select ('*')
		                ->from ('Confreporte cr')
		                ->where ('cr.visible =?', array( $params['visible'] ) )
						->fetchArray();
        return $result;
    }
}

