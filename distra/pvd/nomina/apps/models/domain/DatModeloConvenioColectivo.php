<?php

class DatModeloConvenioColectivo extends BaseDatModeloConvenioColectivo {

       public static function obtenerDatModeloConvenioColectivoDadoId($idmodeloconvenio) {
        return Doctrine::getTable('DatModeloConvenioColectivo')->find($idmodeloconvenio);
    }
	
	public static function getModeloxConvenios($idconvenio) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
                ->from('DatModeloConvenioColectivo')
				->where('idconvenio = ?', array($idconvenio))
			    ->fetchArray();
    }
	
	public static function getModeloxIdPersona($idpersona) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
                ->from('DatModeloConvenioColectivo')
				->where('idpersona = ?', array($idpersona))
			    ->fetchArray();
    }
	
	public static function existeModeloColectivoxConvenio($idconvenio) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
                ->select('count(idmodeloconveniocolectivo) as cantidadcolectivo')
                ->from('DatModeloConvenioColectivo')
				->where('idconvenio = ?', array($idconvenio))
			    ->fetchOne()
			    ->cantidadcolectivo;
    }

    public static function existePersonaConvenio($idconvenio, $idpersona) {
        //Devolviendo el listado de convenios.
        return Doctrine_Query::create()
            ->select('count(idmodeloconveniocolectivo) as cantidadcolectivo')
            ->from('DatModeloConvenioColectivo')
            ->where('idconvenio = ? and idpersona = ?', array($idconvenio, $idpersona))
            ->fetchOne()
            ->cantidadcolectivo;
    }
	
}
