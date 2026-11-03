<?php

class ConfAfiliaciones extends BaseConfAfiliaciones
{

    public static function obtenerListadoAfiliaciones()
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfAfiliaciones ca')
            ->orderBy('ca.idconfafiliacion ASC')
            ->fetchArray();
    }

    public static function obtenerTiposPagoAfiliaciones($idconfafiliacion)
    {
        return Doctrine_Query::create()
            ->select('ca.tipospagos')
            ->from('ConfAfiliaciones ca')
            ->where("ca.idconfafiliacion = ?", array($idconfafiliacion))
            ->orderBy('ca.idconfafiliacion ASC')
            ->fetchOne()->tipospagos;
    }

    public static function obtenerFormulaEscala($idconfafiliacion)
    {
        return Doctrine_Query::create()
            ->select('ca.idformula')
            ->from('ConfAfiliaciones ca')
            ->where("ca.idconfafiliacion = ?", array($idconfafiliacion))
            ->orderBy('ca.idconfafiliacion ASC')
            ->fetchOne()->idformula;
    }
    public static function obtenerFormulaDevengadoTotal($idconfafiliacion)
    {
        return Doctrine_Query::create()
            ->select('ca.idformuladevengadototal')
            ->from('ConfAfiliaciones ca')
            ->where("ca.idconfafiliacion = ?", array($idconfafiliacion))
            ->orderBy('ca.idconfafiliacion ASC')
            ->fetchOne()->idformuladevengadototal;
    }

    public static function obtenerCantidadAfiliaciones()
    {
        return Doctrine_Query::create()
            ->select('COUNT(*) AS cantidad')
            ->from('ConfAfiliaciones ca')
            ->fetchOne()->cantidad;
    }

    public static function obtenerObjConfAfiliacionesDadoId($idconfig)
    {
        return Doctrine::getTable('ConfAfiliaciones')->find($idconfig);
    }

    public static function existeObjConfAfiliacionesDadoIdAfiliacion($idafiliacion)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('ConfAfiliaciones ca')
            ->where("ca.idafiliacion=?", array($idafiliacion))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        if (count($result)) {
            return 1;
        } else {
            return 2;
        }
    }

    public function obtenerTodasOrganizaciones()
    {
        //,nomo.idtipoorganizacion
        $sql = "SELECT nomo.idorganizacion ,nomo.denominacion
                FROM  mod_personaext.nom_organizacion nomo 
                WHERE nomo.fhasta < now() or nomo.fhasta is null";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }



}
