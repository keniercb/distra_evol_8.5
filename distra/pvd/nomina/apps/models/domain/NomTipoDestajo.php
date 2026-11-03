<?php

/**
 * NomTipoDestajo
 *
 * @author Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @copyright UCID
 * @version 1.0
 */
class NomTipoDestajo extends BaseNomTipoDestajo {

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int       $inicio Inicio de la busqueda.
     * @param int       $limite Limite maximo de la busqueda.
     * @return array    Listado de los datos de los tipos de nómina.
     */

    public static function obtenerListadoDestajo($inicio = 0, $limite = 1000) {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT idnomtipodestajo, denominacion, fechainicio, fechafin, descripcion
            FROM mod_nomina.nom_tipodestajo ;";
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public static function adicionarDestajo($denominacion, $fechainicio, $fechafin, $descripcion) 
    {               
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $existeDenom = NomTipoDestajo::filtrarTipoDestajoByDenom($denominacion);

        if ($existeDenom < 1) {  
            if ($fechafin != null) {
                $sql = "INSERT INTO mod_nomina.nom_tipodestajo
                    (
                    denominacion,
                    fechainicio,
                    fechafin,
                    descripcion
                    ) VALUES (
                    '$denominacion',
                    '$fechainicio',
                    '$fechafin',
                    '$descripcion'
                );";
                $conn->execute($sql);
            } else {
                $sql = "INSERT INTO mod_nomina.nom_tipodestajo
                    (
                    denominacion,
                    fechainicio,
                    fechafin,
                    descripcion
                    ) VALUES (
                    '$denominacion',
                    '$fechainicio',
                    NULL,
                    '$descripcion'
                );";
                $conn->execute($sql);
            }
            return 2;
        } else {
            return 3;
        }
    }

    public static function modificarDestajo($idnomtipodestajo, $denominacion, $fechainicio, $fechafin = null, $descripcion) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $existeDenom = NomTipoDestajo::filtrarTipoDestajoByDenom($denominacion);        
        if ($fechafin != null) {        
            $sql = "UPDATE mod_nomina.nom_tipodestajo 
                SET 
                denominacion = '$denominacion',
                fechainicio = '$fechainicio',
                fechafin = '$fechafin',
                descripcion = '$descripcion'
                WHERE 
                idnomtipodestajo = $idnomtipodestajo;";
            $conn->execute($sql);
        } else {      
            $sql = "UPDATE mod_nomina.nom_tipodestajo 
                SET 
                denominacion = '$denominacion',
                fechainicio = '$fechainicio',
                fechafin = null,
                descripcion = '$descripcion'
                WHERE 
                idnomtipodestajo = $idnomtipodestajo;";            
            $conn->execute($sql);
        }
        return 2;
    }

    public static function eliminarTiposDestajo($idnomtipodestajo) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomTipoDestajo')
                ->where('idnomtipodestajo = ?', $idnomtipodestajo)
                ->execute();
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                return 2;
            } else {
                return 1;
            }
        }
    }

    public static function filtrarTipoDestajoByDenom($denominacion, $idnomtipodestajo = null)
    {        
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT count(idnomtipodestajo) FROM mod_nomina.nom_tipodestajo 
                Where fechainicio <= now() and (fechafin is null or fechafin > now()) and denominacion ilike '$denominacion';";
        if (!empty($idnomtipodestajo)) {
            $sql .= " and idnomtipodestajo != $idnomtipodestajo";
        }
        $cont = $conn->fetchOne($sql);
        return $cont;
    }

    public static function obtenerDenomTipoDestajoById($idnomtipodestajo)
    {        
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "SELECT denominacion FROM mod_nomina.nom_tipodestajo WHERE idnomtipodestajo = $idnomtipodestajo;";        
        $r = $conn->fetchOne($sql);
        
        return $r;
    }
    
}
