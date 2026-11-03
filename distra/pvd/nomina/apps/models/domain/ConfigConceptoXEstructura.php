<?php

class ConfigConceptoXEstructura extends BaseConfigConceptoXEstructura {

    
	//Funcionalidad que devuelve el obj dado el id de la tabla 
	public static function obtenerConfigConceptoXEstructura($idconceptoxestructura) {
        return Doctrine::getTable('ConfigConceptoXEstructura')->find($idconceptoxestructura);
    }
	
	//Funcionalidad que devuelve los conceptos por estructura
	public static function obtenerListadoConfigConceptoXEstructura($identidad) {

        //Devolviendo el listado de plantillas nominales en forma de arreglo.
        return Doctrine_Query::create()
                ->select('idconceptopdxestructura, idconceptopd, idestructura')
                ->from('ConfigConceptoXEstructura')
                ->where('idestructura = ?', array($identidad))
                ->fetchArray();
				
    }
	
	//Funcionalidad que devuelve la cantidad de conceptos por estructura
	public static function obtenerCantidadConfigConceptoXEstructura($identidad) {
        
        //Devolviendo el listado de plantillas nominales en forma de arreglo.
        return Doctrine_Query::create()
                ->select('count(idconceptopdxestructura) as cantidad')
                ->from('ConfigConceptoXEstructura')
                ->where('idestructura = ?', array($identidad))
                ->fetchOne()
				->cantidad;
    }
	
	//Funcionalidad que devuelve los conceptos por estructura
	public static function obtenerIDConfiguracionXIDConcepto($idconcepto, $idestructura) {

        //Devolviendo el listado de plantillas nominales en forma de arreglo.
        return Doctrine_Query::create()
                ->select('count(idconceptopdxestructura) as cantidad')
                ->from('ConfigConceptoXEstructura')
                ->where('idestructura = ? and idconceptopd = ?', array($idestructura, $idconcepto))
                ->fetchOne()
                ->cantidad;
				
    }
}
