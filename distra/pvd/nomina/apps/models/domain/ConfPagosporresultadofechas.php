<?php

class ConfPagosporresultadofechas extends BaseConfPagosporresultadofecha
{
    public static function getPPorId($idpagoporresultadofecha)
    {
        return Doctrine::getTable('ConfPagosporresultadofechas')->find($idpagoporresultadofecha);
    }

    public static function obtenerArrayXId($idpagoporresultadofecha)
    {

        //Devolviendo el listado de tipos de pago en forma de arreglo.
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfPagosporresultadofechas')
            ->where('idpagoporresultadofechas = ?', array($idpagoporresultadofecha))
            ->fetchArray();
    }

    public static function obtenerArrayXIdEntidad($idpagoresultado, $identidad)
    {

        //Devolviendo el listado de tipos de pago en forma de arreglo.
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfPagosporresultadofechas')
            ->where('idpagoporresultado = ? and identidad = ?', array( $idpagoresultado,$identidad))
            ->fetchArray();
    }



    public function getIdConfXIdEntidad($identidad)
    {
        return Doctrine_Query::create()->select('idpagoporresultadofechas')
            ->from('ConfPagosporresultado')
            ->where("identidad = ?", array($identidad))
            ->fetchOne()
            ->cantidad;
    }


}

