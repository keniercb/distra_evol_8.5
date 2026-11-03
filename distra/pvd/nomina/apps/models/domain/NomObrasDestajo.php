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
class NomObrasDestajo extends BaseNomObrasDestajo {
    

    public static function obtenerListadoNomenclador($texto, $inicio = 0, $limite = 1000, $identidad) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sqlconcat = (!empty($texto)) ? "where (nod.codigo ilike '%$texto%' or nod.denominacion ilike '%$texto%')" : "";
        $sql = "SELECT nod.*
            FROM mod_nomina.nom_obrasdestajo nod " . $sqlconcat . " ORDER BY nod.codigo ASC";
        $datos = $conn->fetchAll($sql);

        $arrayfinal = array();
        $cont = 0;
        foreach ($datos as $k => $nom) {
            $arrayfinal[$cont]['idnomobrasdestajo'] = $nom['idnomobrasdestajo'];
            $arrayfinal[$cont]['codigo'] = $nom['codigo'];
            $arrayfinal[$cont]['denominacion'] = $nom['denominacion'];
            $arrayfinal[$cont]['estado'] = $nom['estado'];
            $arrayfinal[$cont]['fechainicio'] = $nom['fechainicio'];
            $arrayfinal[$cont]['fechafin'] = $nom['fechafin'];
            $arrayfinal[$cont]['activo'] = NomObrasDestajo::obtenerActivoNomencladorEntidad($identidad, $nom['idnomobrasdestajo']) ? NomObrasDestajo::obtenerActivoNomencladorEntidad($identidad, $nom['idnomobrasdestajo']) : '0';
            $cont++;
        }

        return $arrayfinal;
    }

    public function obtenerActivoNomencladorEntidad($identidad, $idnomobrasdestajo)
    {        
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT activo FROM mod_nomina.nom_obrasdestajoentidad WHERE idnomobrasdestajo = $idnomobrasdestajo AND identidad = $identidad;";
        $activo = $conn->fetchOne($sql);
        return $activo;
    }

    public function fnObtenerCodigoDisponible()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT MAX(codigo)  as codigo FROM mod_nomina.nom_obrasdestajo;";
        $r = $conn->fetchAll($sql);
        $r[0]['codigo'] = !empty($r) ? $r[0]['codigo'] + 1 : 1;
        return $r[0];
    }

    public static function adicionarNomenclador($denominacion, $fechainicio, $fechafin, $codigo, $identidad) 
    {         
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $existeDenom = NomObrasDestajo::filtrarTipoNomenclador($denominacion);

        if ($existeDenom < 1) {  
            if ($fechafin == null) {
                $sql = "INSERT INTO mod_nomina.nom_obrasdestajo
                        (codigo, denominacion, estado, fechainicio, fechafin)
                    VALUES  
                        ($codigo, '$denominacion', 0, '$fechainicio', NULL) returning idnomobrasdestajo;";
                $r = $conn->fetchAll($sql);
                $idnomobrasdestajo = $r[0]['idnomobrasdestajo'];

                $sqlactivo = "INSERT INTO mod_nomina.nom_obrasdestajoentidad
                        (idnomobrasdestajo, identidad, activo)
                    VALUES ($idnomobrasdestajo, $identidad, 0);";
                $conn->execute($sqlactivo);

            } else {
                $sql = "INSERT INTO mod_nomina.nom_obrasdestajo
                        (codigo, denominacion, estado, fechainicio, fechafin)
                    VALUES  
                        ($codigo, '$denominacion', 0, '$fechainicio', '$fechafin') returning idnomobrasdestajo;";
                $r = $conn->fetchAll($sql);
                $idnomobrasdestajo = $r[0]['idnomobrasdestajo'];

                $sqlactivo = "INSERT INTO mod_nomina.nom_obrasdestajoentidad
                        (idnomobrasdestajo, identidad, activo)
                    VALUES ($idnomobrasdestajo, $identidad, 0);";
                $conn->execute($sqlactivo);
            }
            

            return 2;
        } else {
            return 3;
        }
    }

    public function filtrarTipoNomenclador($denominacion)
    {        
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT count(idnomobrasdestajo) FROM mod_nomina.nom_obrasdestajo 
                Where fechainicio <= now() and (fechafin is null or fechafin > now()) and denominacion ilike '$denominacion';";
        $cont = $conn->fetchOne($sql);
        return $cont;
    }

    public static function modificarNomencladorObras($idnomobrasdestajo, $denominacion, $fechainicio, $fechafin = null, $codigo) 
    { 
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
      
        if ($fechafin != null) {        
            $sql = "UPDATE mod_nomina.nom_obrasdestajo 
                SET 
                codigo = $codigo,
                denominacion = '$denominacion', 
                fechainicio = '$fechainicio',
                fechafin = '$fechafin'
                WHERE 
                idnomobrasdestajo = $idnomobrasdestajo;";
            $conn->execute($sql);
        } else {          
            $sql = "UPDATE mod_nomina.nom_obrasdestajo 
                SET 
                codigo = $codigo,
                denominacion = '$denominacion', 
                fechainicio = '$fechainicio',
                fechafin = NULL
                WHERE 
                idnomobrasdestajo = $idnomobrasdestajo;";
            $conn->execute($sql);
        }
        return 2;
    }

    public static function eliminarNomenclador($idnomobrasdestajo) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomObrasDestajo')
                ->where('idnomobrasdestajo = ?', $idnomobrasdestajo)
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

    public function modificarNomencladorEntidad($idnomobrasdestajo, $activo, $identidad)
    {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $filtro = NomObrasDestajo::existeNomencladorEntidad($idnomobrasdestajo, $identidad);
        if ($filtro > 0) {
            $sql = "UPDATE mod_nomina.nom_obrasdestajoentidad 
                    SET activo = $activo
                    WHERE idnomobrasdestajo = $idnomobrasdestajo AND identidad = $identidad;";
            $conn->execute($sql);
        } else{
            $sql = "INSERT INTO mod_nomina.nom_obrasdestajoentidad
                        (idnomobrasdestajo, identidad, activo)
                    VALUES ($idnomobrasdestajo, $identidad, $activo);";
            $conn->execute($sql);
        }

    }

    public function modificarNomencladorEstado($idnomobrasdestajo, $estado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "UPDATE mod_nomina.nom_obrasdestajo 
                SET estado = $estado
                WHERE idnomobrasdestajo = $idnomobrasdestajo;";
        $conn->execute($sql);

    }

    public function existeNomencladorEntidad($idnomobrasdestajo, $identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "SELECT count(*) FROM mod_nomina.nom_obrasdestajoentidad WHERE idnomobrasdestajo = $idnomobrasdestajo AND identidad = $identidad;";
        $r = $conn->fetchOne($sql);

        return $r;

    }
    
    
    
}
