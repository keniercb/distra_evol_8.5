<?php

class DatConvenio extends BaseDatConvenio {

       public static function obtenerDatConvenioDadoId($idconvenio) {
        return Doctrine::getTable('DatConvenio')->find($idconvenio);
    }
	
	public static function getConvenios($identidad, $inicio = 0, $limite = 20) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
                ->from('DatConvenio')
				->where('identidad = ?', array($identidad))
				->orderBy('idconvenio ASC')
                //->limit($limite)
                //->offset($inicio)
                ->fetchArray();
    }
	
	public static function getTotalCount($identidad) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
                ->select('count(idconvenio) as cantidad')
                ->from('DatConvenio')
                ->where('identidad = ?', array($identidad))
				->fetchOne()
				->cantidad;
    }
}
