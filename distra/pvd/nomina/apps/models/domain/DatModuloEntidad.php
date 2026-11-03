<?php

class DatModuloEntidad extends BaseDatModuloEntidad {

    public static function obtenerListadoModulosEntidad($identidad)
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('DatModuloEntidad m')
            ->orderBy('m.idmoduloentidad ASC')
            ->fetchArray();
    }

    public static function adicionarModulosEntidad($identificador, $denominacion, $cobroypago, $apertura, $fijaretencionesporpagar, $identidad){
        $sqldatos = "INSERT INTO mod_rrhhmaestro.dat_moduloentidad
                (
                identificador,
                denominacion,
                cobroypago,
                apertura,
                parrafofiscal,
                fijaretencionesporpagar,
                sncsigerh,
                identidad
                ) VALUES (
                '$identificador',
                '$denominacion',
                $cobroypago,
                $apertura,
                null,
                $fijaretencionesporpagar,
                null,
                $identidad);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->execute($sqldatos);
    }

    public static function modificarModulosEntidad($identificador, $denominacion, $cobroypago, $apertura, $fijaretencionesporpagar, $identidad, $idmoduloentidad){
        $sqldatos = "UPDATE mod_rrhhmaestro.dat_moduloentidad 
            SET 
            identificador = '$identificador',
            denominacion = '$denominacion',
            cobroypago = $cobroypago,
            apertura = $apertura,
            fijaretencionesporpagar = $fijaretencionesporpagar
            WHERE idmoduloentidad = $idmoduloentidad;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->execute($sqldatos);
    }

    public static function eliminarModulosEntidad($idmoduloentidad){
        $sqldatos = "DELETE FROM mod_rrhhmaestro.dat_moduloentidad WHERE idmoduloentidad = $idmoduloentidad;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->execute($sqldatos);
    }

    public static function existeObjDatModulosEntidadDadoIdentificador($identificador, $identidad)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatModuloEntidad m')
            ->where("m.identificador = ? and m.identidad = ?", array($identificador, $identidad))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return count($result);        
    }
}
