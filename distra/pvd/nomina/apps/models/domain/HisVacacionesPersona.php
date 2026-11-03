<?php

class HisVacacionesPersona extends BaseHisVacacionesPersona
{

    public static function obtenerObjHisVacacionesPersonaDadoId($hisvacacionespersona)
    {
        return Doctrine::getTable('HisVacacionesPersona')->find($hisvacacionespersona);
    }

    public static function obtenerTodoHisVacacionesPersona($idhisvacacionespersona)
    {
        $sql = "SELECT * FROM mod_nomina.his_vacacionespersona WHERE idhisvacacionespersona = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idhisvacacionespersona));
    }

    public static function obtenerHisVacacionesPersona($idvacacionespersona)
    {
        $concat = ($ajuste = true) ? " and m.tipoajuste in (1,2)" : "";
        $sql = "SELECT * FROM mod_nomina.his_vacacionespersona m
            WHERE (m.idvacacionespersona = ?)" .$concat;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idvacacionespersona));
    }

    public static function obtenerUltimaOperacionSubMayor($idvacacionespersona)
    {
        $sql = "select hv.*
		from mod_nomina.his_vacacionespersona hv
		where hv.idvacacionespersona = ? order by hv.idhisvacacionespersona DESC limit 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idvacacionespersona));
    }

    public static function obtenerSaldoTiempoUltimaOperacion($idpersona, $identidad)
    {
        $sql = "select hv.*
		from mod_nomina.his_vacacionespersona hv
		left join mod_nomina.dat_vacacionespersona dv on(dv.idvacacionespersona = hv.idvacacionespersona)
		where dv.idpersona = ? and dv.identidad = ? order by hv.idhisvacacionespersona DESC limit 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idpersona, $identidad));
    }

    public function obtenerUltimaOperacionSubMayorRangoFechas($idvacacionespersona, $fechainicio, $fechafin)
    {
        $sql = "select hv.*
		from mod_nomina.his_vacacionespersona hv
		where hv.idvacacionespersona = ? and (hv.fechaoperacion::date BETWEEN '{$fechainicio}' AND '{$fechafin}') 
		order by hv.idhisvacacionespersona DESC limit 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idvacacionespersona));
    }

    public function obtenerHistoricoSubMayor($idvacacionespersona, $inicio, $limite)
    {
        $sql = "select hv.*, dn.numeronomina
		from mod_nomina.his_vacacionespersona hv
		left join mod_nomina.dat_nomina dn on (dn.idnomina = hv.idnomina)
		where hv.idvacacionespersona = ? order by hv.idhisvacacionespersona DESC";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idvacacionespersona));
    }

    public static function existePersonaOperacionNomina($idpersona, $idnomina)
    {
        $sql = "select count(hv.idhisvacacionespersona) as cantidad
		from mod_nomina.his_vacacionespersona hv
		inner join mod_nomina.dat_vacacionespersona dv on (dv.idvacacionespersona = hv.idvacacionespersona)
		inner join mod_nomina.dat_nomina dn on (dn.idnomina = hv.idnomina)
		where dv.idpersona = ? and hv.idnomina = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idpersona, $idnomina));
    }

    public function cantidadHistoricoSubMayor($idvacacionespersona)
    {
        $sql = "select count(hv.idhisvacacionespersona) as cantidad
		from mod_nomina.his_vacacionespersona hv
		where hv.idvacacionespersona = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idvacacionespersona));
        return $r[0]['cantidad'];
    }

    public static function obtenerOperacionesNominas($idnomina)
    {

        //Devolviendo los datos de las vacaciones de una persona en forma de arreglo.
        return Doctrine_Query::create()
            ->select('idhisvacacionespersona')
            ->from('HisVacacionesPersona vac')
            ->where('vac.idnomina = ?', array($idnomina))
            ->fetchArray();
    }

    public static function obtenerImporteTotalAcumulacion($identidad)
    {

        //Devolviendo el total de las vacacione acumuladas en forma de arreglo.
        $sql = "select sum(his.importeacumulado) as vacacumuladas
                  from mod_nomina.his_vacacionespersona his
                  inner join mod_nomina.dat_vacacionespersona vac on (his.idvacacionespersona = vac.idvacacionespersona)
                  inner join mod_nomina.conf_vacacionespersona cvac on (cvac.idpersona = vac.idpersona)
                  inner join mod_nomina.dat_cargosocupados dco on (dco.idpersona = cvac.idpersona)
                  where dco.identidad = $identidad and cvac.idestructura = $identidad and vac.identidad = $identidad and his.tipooperacion = 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sql);        
    }

    public static function obtenerImporteTotalLiquidacion($identidad)
    {

        //Devolviendo el total de las liquidaciones en forma de arreglo.
        $sql = "select sum(his.importeacumulado) as vacacumuladas
                  from mod_nomina.his_vacacionespersona his
                  inner join mod_nomina.dat_vacacionespersona vac on (his.idvacacionespersona = vac.idvacacionespersona)
                  inner join mod_nomina.conf_vacacionespersona cvac on (cvac.idpersona = vac.idpersona)
                  inner join mod_nomina.dat_cargosocupados dco on (dco.idpersona = cvac.idpersona)
                  where dco.identidad = $identidad and cvac.idestructura = $identidad and vac.identidad = $identidad and his.tipooperacion = 2";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sql);

    }

    //Listado de saldos acumulados de vacaciones
    public function datosPersonaDadoId($identidad)
    {
        $sql = "select distinct(dp.idpersona), ddi.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel,cpn.orden,nfe.nivel,
                   (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                   (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idarea,
                   ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as area
               
                   from mod_persona.dat_persona dp
                   left join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona and principal = 1)
                   inner join mod_nomina.dat_cargosocupados dco on(dco.idpersona = dp.idpersona and dco.identidad = " . $identidad . ")
                   inner join mod_nomina.conf_plantillanominalcargo cpnca on(cpnca.idcargo = dco.idcargo)
                   inner join mod_nomina.conf_plantillanominal cpn on(cpn.idplantillanominal = cpnca.idplantillanominal and cpn.identidad = " . $identidad . ")
                   inner join mod_nomina.conf_vacacionespersona cvp on(cvp.idpersona = dp.idpersona)
                   inner join mod_nomina.dat_vacacionespersona dv on(dv.idpersona = dp.idpersona)
                   LEFT JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo and dc.idproyecto = 0)
                   INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
                   LEFT JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
		           where cvp.idestructura = " . $identidad . " and dv.identidad = " . $identidad . " and dco.fechavencimiento is null order by cpn.orden ASC,nfe.nivel ASC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        return $conn->fetchAll($sql);
    }

    public function obtenerTodasOperacionesDePeriodoSubMayor($identidad, $periodo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $sql = "select hv.*,dvp.idpersona
		from mod_nomina.his_vacacionespersona hv
		inner join mod_nomina.dat_nomina dn on(dn.idnomina = hv.idnomina)
        inner join mod_nomina.dat_elaborarpagos dep on(dep.idelaborarpagos = dn.idelaborarpago)
        inner join mod_nomina.dat_vacacionespersona dvp on(dvp.idvacacionespersona = hv.idvacacionespersona)
		where dep.identidad = ? and  hv.periodo = ?	and dvp.identidad = ? and dvp.fechafin is null order by hv.idhisvacacionespersona DESC";
        $r = $conn->fetchAll($sql, array($identidad, $periodo, $identidad));
        $conn->commit();
        return $r;
    }

    public function obtenerOperacionesLiquidacionDePeriodoSubMayor($identidad, $periodo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $sql = "select hv.*,dvp.idpersona from mod_nomina.his_vacacionespersona hv
        inner join mod_nomina.dat_nomina dn on(dn.idnomina = hv.idnomina)
        inner join mod_nomina.dat_elaborarpagos dep on(dep.idelaborarpagos = dn.idelaborarpago)
        inner join mod_nomina.dat_vacacionespersona dvp on(dvp.idvacacionespersona = hv.idvacacionespersona)
        where hv.tipooperacion = 2 and hv.periodo = ? and dep.identidad = ? and dvp.identidad = ? and dvp.fechafin is null order by hv.idhisvacacionespersona DESC";
        $r = $conn->fetchAll($sql, array($periodo, $identidad, $identidad));
        $conn->commit();
        return $r;
    }

    public static function obtenerSaldoTiempoUltimaOperacionIdEntidad($identidad)
    {
        $sql = "select dv.idpersona,hv.*
		from mod_nomina.his_vacacionespersona hv
		left join mod_nomina.dat_vacacionespersona dv on(dv.idvacacionespersona = hv.idvacacionespersona)
		where dv.identidad = ? order by hv.idhisvacacionespersona DESC limit 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad));
    }

    public function obtenerTodasOperacionesDeSubMayorVac($identidad,$personasvacaciones=null)
    {
        $personasvac = ($personasvacaciones != null)?" and hv.idvacacionespersona in (" . implode(',', $personasvacaciones) . ") " : "";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $sql = "select hv.*
		from mod_nomina.his_vacacionespersona hv
		inner join mod_nomina.dat_nomina dn on(dn.idnomina = hv.idnomina)
        inner join mod_nomina.dat_elaborarpagos dep on(dep.idelaborarpagos = dn.idelaborarpago)
        inner join mod_nomina.dat_vacacionespersona dvp on(dvp.idvacacionespersona = hv.idvacacionespersona)
		where dep.identidad = ?	and dvp.fechafin is null ".$personasvac." order by  hv.idhisvacacionespersona,periodo ASC";
        $r = $conn->fetchAll($sql, array($identidad));
        $conn->commit();
        return $r;
    }

    public function actualizarSaldoTiempoImportePersona(&$conn, $idhisvacacionespersona, $saldoentiempo, $saldoenimporte)
    {
        /* Actualizar el estado de las nominas a certificadas */
        $sqlN = "UPDATE mod_nomina.his_vacacionespersona SET saldoentiempo={$saldoentiempo}, saldoenimporte={$saldoenimporte} WHERE idhisvacacionespersona = ?;";
        return $conn->fetchAll($sqlN, array($idhisvacacionespersona));
    }

    public function obtenerCantidadOperacionesPersonas($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql= "SELECT dvp.idpersona,
                CONCAT_WS(' ', dp.nombre, dp.snombre, dp.papel, dp.sapel) as nombre,
                COUNT(hv.idhisvacacionespersona) AS cantidadoperaciones 
            FROM mod_nomina.dat_vacacionespersona dvp
            INNER JOIN mod_persona.dat_persona dp ON dp.idpersona = dvp.idpersona
            LEFT JOIN mod_nomina.his_vacacionespersona hv ON hv.idvacacionespersona = dvp.idvacacionespersona
            WHERE dvp.identidad = ?
            GROUP BY dvp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel;";
        return $conn->fetchAll($sql, array($identidad));
    }

    public static function obtenerPeriodosSubmayor($identidad)
    {
        $sql = "select periodo
                  from mod_nomina.his_vacacionespersona his
                  inner join mod_nomina.dat_vacacionespersona vac on (his.idvacacionespersona = vac.idvacacionespersona)
                  where vac.identidad = ?";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad));
    }    

    public function ordenarOperacionesPersonasPorPeriodos(&$conn, $operaciones)
    {
        foreach ($operaciones as $op) {
            //Delete in HisVacacionesPersona
            $sqldelete = "DELETE FROM mod_nomina.his_vacacionespersona where idhisvacacionespersona = ?";
            $conn->execute($sqldelete, array($op['idhisvacacionespersona']));

            //Save in HisVacacionesPersona
            $sqlinsert = "INSERT INTO mod_nomina.his_vacacionespersona(
            idvacacionespersona, idnomina, tipooperacion, fechaoperacion,
            tiempoacumulado, importeacumulado, saldoentiempo, saldoenimporte, 
            ajusteimporte, ajustetiempo, tipoajuste, observaciones, periodo)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) returning idhisvacacionespersona;";
            $conn->execute($sqlinsert, array(
                $op['idvacacionespersona'], $op['idnomina'], $op['tipooperacion'], $op['fechaoperacion'],
                $op['tiempoacumulado'], $op['importeacumulado'], $op['saldoentiempo'], $op['saldoenimporte'],
                $op['ajusteimporte'], $op['ajustetiempo'], $op['tipoajuste'], $op['observaciones'], $op['periodo']
            ));
        }
        return 1;
    }

    public static function obtenerPeriodosAcumulados($idvacacionespersona)
    {
        $sql = "select distinct (hv.periodo), hv.idhisvacacionespersona
		from mod_nomina.his_vacacionespersona hv
		left join mod_nomina.dat_vacacionespersona dv on(dv.idvacacionespersona = hv.idvacacionespersona)
		where dv.idvacacionespersona = ? order by hv.idhisvacacionespersona DESC";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idvacacionespersona));
    }

    public function borrarAjustesBajas($idhisvacacionespersona)
    {
        $objHisVac = Doctrine::getTable('HisVacacionesPersona')->find($idhisvacacionespersona);
        $objHisVac->ajustetiempo = null;
        $objHisVac->ajusteimporte = null;
        $objHisVac->tipoajuste = null;
        $objHisVac->observaciones = null;
        //Guardando los datos.
        $objHisVac->save();
    }
}