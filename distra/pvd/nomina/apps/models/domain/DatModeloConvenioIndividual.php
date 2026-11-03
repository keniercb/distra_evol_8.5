<?php

class DatModeloConvenioIndividual extends BaseDatModeloConvenioIndividual {

       public static function obtenerDatModeloConvenioIndDadoId($idmodeloconvenio) {
        return Doctrine::getTable('DatModeloConvenioIndividual')->find($idmodeloconvenio);
    }
	
	public static function getModeloxConvenios($idconvenio) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
                ->from('DatModeloConvenioIndividual')
				->where('idconvenio = ?', array($idconvenio))
			    ->fetchArray();
    }
	
	public static function getModeloxIdPersona($idpersona) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
                ->from('DatModeloConvenioIndividual')
				->where('idpersona = ?', array($idpersona))
			    ->fetchArray();
    }
	
	public static function existeModeloIndividualxConvenio($idconvenio) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
                ->select('count(idmodeloconvenioindividual) as cantidadindividual')
                ->from('DatModeloConvenioIndividual')
				->where('idconvenio = ?', array($idconvenio))
			    ->fetchOne()
			    ->cantidadindividual;
    }

    public static function existePersonaConvenio($idconvenio, $idpersona) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
            ->select('count(idmodeloconvenioindividual) as cantidadindividual')
            ->from('DatModeloConvenioIndividual')
            ->where('idconvenio = ? and idpersona = ?', array($idconvenio, $idpersona))
            ->fetchOne()
            ->cantidadindividual;
    }
	
}