<?php

class ConfModulos extends BaseConfModulos
{

    public static function obtenerListadoModulos()
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfModulos m')
            ->orderBy('m.idmodulo ASC')
            ->fetchArray();
    }

    public static function obtenerCantidadModulos()
    {
        return Doctrine_Query::create()
            ->select('COUNT(*) AS cantidad')
            ->from('ConfModulos m')
            ->fetchOne()->cantidad;
    }
    
    public static function obtenerListadoModulosEntidadConfiguracion($identidad)
    {
        $sqlmodulo = "select idmoduloentidad, trim(identificador) as identificador, 
                    denominacion, cobroypago, apertura, parrafofiscal, 
                    fijaretencionesporpagar, sncsigerh, 1 as tabla
                from mod_rrhhmaestro.dat_moduloentidad
                where identidad = $identidad
            union
            select idmodulo, trim(identificador) as identificador, 
                    denominacion, cobroypago, apertura, parrafofiscal, 
                    fijaretencionesporpagar, sncsigerh, 2 as tabla
                from mod_rrhhmaestro.dat_modulo
                where trim(identificador) not in (select trim(identificador) as identificador
                from mod_rrhhmaestro.dat_moduloentidad where identidad = $identidad);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrmodulo = $conn->fetchAll($sqlmodulo);
        return $arrmodulo;
    }

    public static function obtenerCantidadModulosEntidadConfiguracion($identidad)
    {
        $sqlmodulo = "select idmoduloentidad, trim(identificador) as identificador, 
                    denominacion, cobroypago, apertura, parrafofiscal, 
                    fijaretencionesporpagar, sncsigerh
                from mod_rrhhmaestro.dat_moduloentidad
                where identidad = $identidad
            union
            select idmodulo, trim(identificador) as identificador, 
                    denominacion, cobroypago, apertura, parrafofiscal, 
                    fijaretencionesporpagar, sncsigerh
                from mod_rrhhmaestro.dat_modulo
                where trim(identificador) not in (select trim(identificador) as identificador
                from mod_rrhhmaestro.dat_moduloentidad where identidad = $identidad);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrmodulo = $conn->fetchAll($sqlmodulo);
        $countarrmodulo = count($arrmodulo);
        return $countarrmodulo;
    }

    public static function obtenerObjConfModulosDadoId($idmodulo)
    {
        return Doctrine::getTable('ConfModulos')->find($idmodulo);
    }

    public static function existeObjConfModulosDadoDenom($denominacion)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('ConfModulos m')
            ->where("m.denominacion=?", array($denominacion))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        if (count($result)) {
            return 1;
        } else {
            return 2;
        }
    }

    public static function existeObjConfModulosDadoIdentificador($identificador)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('ConfModulos m')
            ->where("m.identificador=?", array($identificador))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return count($result);        
    }
}
