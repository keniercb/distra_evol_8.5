<?php

class HisVacacionesPersonaBaja extends BaseHisVacacionesPersonaBaja
{
    public static function obtenerObjHisVacacionesPersonaBajaDadoId($hisvacacionespersonabaja)
    {
        return Doctrine::getTable('HisVacacionesPersonaBaja')->find($hisvacacionespersonabaja);
    }

    public static function obtenerHisVacacionesPersonaBaja($idvacacionespersonabaja)
    {
        //Devolviendo los datos de las vacaciones de una persona baja en forma de arreglo.
        return Doctrine_Query::create()
            ->from('HisVacacionesPersonaBaja vac')
            ->where('vac.idvacacionespersonabaja = ?', array($idvacacionespersonabaja))
            ->fetchArray();
    }

    public function obtenerOperacionesPersonasBajas($identidad, $periodo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select hpb.idpersona, hvpb.*
                from mod_nomina.his_vacacionespersonabaja hvpb
                inner join mod_nomina.his_personabaja hpb on (hpb.idpersonabaja = hvpb.idpersonabaja)
		        where hpb.identidad = ? and hvpb.periodo = ? order by hvpb.idhisvacacionespersonabaja DESC;";
        return $conn->fetchAll($sql, array($identidad, $periodo));
    }

    public function obtenerOperacionesPersonasBajasEntidad($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select hpb.*, hvpb.*
                from mod_nomina.his_vacacionespersonabaja hvpb
                inner join mod_nomina.his_personabaja hpb on (hpb.idpersonabaja = hvpb.idpersonabaja)
		        where hpb.identidad = ? order by  hvpb.idhisvacacionespersonabaja,hvpb.periodo ASC;";
        return $conn->fetchAll($sql, array($identidad));
    }

    public function actualizarSaldoTiempoImportePersonaBaja(&$conn, $idhisvacacionespersonabaja, $saldoentiempo, $saldoenimporte)
    {
        /* Actualizar el estado de las nominas a certificadas */
        $sqlN = "UPDATE mod_nomina.his_vacacionespersonabaja SET saldoentiempo='$saldoentiempo', saldoenimporte='$saldoenimporte' WHERE idhisvacacionespersonabaja = ?;";
        return $conn->fetchAll($sqlN, array($idhisvacacionespersonabaja));
    }

    public function ordenarOperacionesPersonasBajas(&$conn, $operaciones)
    {
        foreach ($operaciones as $op) {
            //Delete in HisVacacionesPersonaBaja
            $sqldelete = "DELETE FROM mod_nomina.his_vacacionespersonabaja where idhisvacacionespersonabaja = ?";
            $conn->execute($sqldelete, array($op['idhisvacacionespersonabaja']));

            //Save in HisVacacionesPersonaBaja
            $sqlinsert = "INSERT INTO mod_nomina.his_vacacionespersonabaja(
            idpersonabaja, idnomina, tipooperacion, fechaoperacion,
            tiempoacumulado, importeacumulado, saldoentiempo, saldoenimporte, 
            ajusteimporte, ajustetiempo, tipoajuste, observaciones, periodo)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) returning idhisvacacionespersonabaja;";
            $conn->execute($sqlinsert, array(
                $op['idpersonabaja'], $op['idnomina'], $op['tipooperacion'], $op['fechaoperacion'],
                $op['tiempoacumulado'], $op['importeacumulado'], $op['saldoentiempo'], $op['saldoenimporte'],
                $op['ajusteimporte'], $op['ajustetiempo'], $op['tipoajuste'], $op['observaciones'], $op['periodo']
            ));
        }

        return 1;
    }

    public function cantidadHistoricoSubMayorBajas($idpersonabaja)
    {
        $sql = "select count(hvb.idpersonabaja) as cantidad
		from mod_nomina.his_vacacionespersonabaja hvb
		where hvb.idpersonabaja = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idpersonabaja));
        return $r[0]['cantidad'];
    }

    public static function obtenerUltimaOperacionSubMayorBajas($idpersonabaja, $ascendencia)
    {
        $sql = "select hvb.*
		from mod_nomina.his_vacacionespersonabaja hvb
		where hvb.idpersonabaja = ? order by hvb.idhisvacacionespersonabaja " . $ascendencia . " limit 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idpersonabaja));
    }

    public function obtenerHistoricoSubMayorBaja($idpersonabaja, $inicio = null, $limite = null)
    {
        $sql = "select hvb.*, dn.numeronomina
		from mod_nomina.his_vacacionespersonabaja hvb
		left join mod_nomina.dat_nomina dn on (dn.idnomina = hvb.idnomina)
		where hvb.idpersonabaja = ? order by hvb.idhisvacacionespersonabaja DESC";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idpersonabaja));
    }

    public function actualizarDatosGeneralesHistoricoVacacionesBajas($idpersonabaja, $identidad, $idhisvacacionespersonabaja, $ajustetiempo, $ajusteimporte, $tipoajuste, $observaciones)
    {
        $objHisVacPerAdicionar = Doctrine::getTable('HisVacacionesPersonaBaja')->find($idhisvacacionespersonabaja);
        if ($tipoajuste == 1) {
            $saldotiempo = $objHisVacPerAdicionar->saldoentiempo + $ajustetiempo;
            $saldoimporte = $objHisVacPerAdicionar->saldoenimporte + $ajusteimporte;
        } else {
            $saldotiempo = $objHisVacPerAdicionar->saldoentiempo - $ajustetiempo;
            $saldoimporte = $objHisVacPerAdicionar->saldoenimporte - $ajusteimporte;
        }

        if ($saldotiempo < 0 || $saldoimporte < 0) {
            return 3;
        } else {
            $objHisVacPerAdicionar->saldoentiempo = $saldotiempo;
            $objHisVacPerAdicionar->saldoenimporte = $saldoimporte;
            $objHisVacPerAdicionar->ajustetiempo = $ajustetiempo;
            $objHisVacPerAdicionar->ajusteimporte = $ajusteimporte;
            $objHisVacPerAdicionar->tipoajuste = $tipoajuste;
            $objHisVacPerAdicionar->observaciones = $observaciones;

            //Guardando los datos.
            $objHisVacPerAdicionar->save();
            return 1;
        }
    }

    public function borrarAjustesBajas($idhisvacacionespersonabaja)
    {
        $objHisVac = Doctrine::getTable('HisVacacionesPersonaBaja')->find($idhisvacacionespersonabaja);
        $objHisVac->ajustetiempo = null;
        $objHisVac->ajusteimporte = null;
        $objHisVac->tipoajuste = null;
        $objHisVac->observaciones = null;
        //Guardando los datos.
        $objHisVac->save();
    }

    public function obtenerCantidadOperacionesPersonasBajas($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT DISTINCT(hpb.idpersona) AS idpersona,  hpb.idpersonabaja, hpb.tiempoacumuladoinicial, hpb.importeacumuladoinicial,
        (CASE WHEN dp.snombre is not null THEN dp.nombre||' '||dp.snombre||' '||dp.papel||' '||dp.sapel ELSE dp.nombre ||' '||dp.papel||' '||dp.sapel END) as nombre, 
        (select count(hvb.*) from mod_nomina.his_vacacionespersonabaja hvb  where hvb.idpersonabaja = hpb.idpersonabaja) 
        AS cantidadoperaciones 
		FROM mod_nomina.his_personabaja hpb
		INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = hpb.idpersona)
		WHERE hpb.identidad = ?	";
        return $conn->fetchAll($sql, array($identidad));
    }
}
