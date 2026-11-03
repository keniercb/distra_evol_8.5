<?php

class HisPersonaBaja extends BaseHisPersonaBaja
{
    public function obtenerObjHisPersonaBajaDadoId($hispersonabaja)
    {
        return Doctrine::getTable('HisPersonaBaja')->find($hispersonabaja);
    }

    public function obtenerHisPersonaBaja($idpersonabaja)
    {
        //Devolviendo los datos de una persona que ha sido baja en forma de arreglo.
        return Doctrine_Query::create()
            ->from('HisPersonaBaja vac')
            ->where('vac.idpersonabaja = ?', array($idpersonabaja))
            ->fetchArray();
    }

    public function obtenerDatosPrincipalesPersonasBajas($identidad, $periodo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select DISTINCT(dp.idpersona), ddi.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, 
                cpn.orden as orden, hpb.*,(CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                (CASE WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END) as area
                from mod_persona.dat_persona dp
                left join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona and ddi.principal = 1)
                inner join mod_nomina.his_personabaja hpb on (hpb.idpersona = dp.idpersona)
                inner join mod_nomina.his_vacacionespersonabaja hvpb on (hvpb.idpersonabaja = hpb.idpersonabaja)
                left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = hpb.idplantillanominal)
		        where hpb.identidad = ? and hvpb.periodo = ?";
        return $conn->fetchAll($sql, array($identidad, $periodo));
    }

    public function obtenerDatosVacacionesPersonaBajas($identidad, $texto, $inicio = 0, $limite = 1000)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $iniSql = '';
        $limitSql = '';

        if($inicio) {
            $iniSql = "offset $inicio";
        }

        if($limite) {
            $limitSql = "limit $limite";
        }

        $sqlconcat = (!empty($texto)) ? "and (ddi.numero ilike '%$texto%' or dp.nombre ilike '%$texto%' or dp.snombre ilike '%$texto%' or dp.papel ilike '%$texto%' or dp.sapel ilike '%$texto%')" : "";
        $sqlDatosPersona = "select DISTINCT(dp.idpersona), ddi.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel, 
                cpn.orden as orden, hpb.*,(CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre,
                (CASE WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END) as area
                from mod_persona.dat_persona dp
                left join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona and ddi.principal = 1)
                inner join mod_nomina.his_personabaja hpb on (hpb.idpersona = dp.idpersona)
                inner join mod_nomina.his_vacacionespersonabaja hvpb on (hvpb.idpersonabaja = hpb.idpersonabaja)
                left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = hpb.idplantillanominal)
		        where hpb.identidad = ? " . $sqlconcat . " $limitSql $iniSql";
        $resultado = $conn->fetchAll($sqlDatosPersona, array($identidad));
        $cont = 0;
        $arrayfinal = array();
        foreach ($resultado as $i => $value) {
            $arrayfinal[$cont]['idvacacionespersona'] = $value['idpersonabaja'];
            $arrayfinal[$cont]['idpersona'] = $value['idpersona'];
            $arrayfinal[$cont]['idestructura'] = $value['identidad'];
            $arrayfinal[$cont]['nombreapellidos'] = $value['nombre'] . (!empty ($value['snombre']) ? ' ' . $value['snombre'] : '') . ' ' . $value['papel'] . ' ' . $value['sapel'];
            $arrayfinal[$cont]['noidentidad'] = ($value['numero'] != null) ? $value['numero'] : '';
            $arrayfinal[$cont]['cargo'] = ($value['idcargo'] != null) ? $value['denomcargo'] : '';
            $arrayfinal[$cont]['idcargo'] = $value['idcargo'];
            $arrayfinal[$cont]['ordencargo'] = $value['ordencargo'];
            $arrayfinal[$cont]['orden'] = $value['orden'];
            //$divisor = 1;
            //$arrayfinal[$cont]['ordenplantilla'] = DatGestionarNominasModel::fnOrganizarPlantillas($value['orden'], $divisor) . "--" . $value['plantilla'];
            $arrayfinal[$cont]['plantillanominal'] = $value['area'];
            $arrayfinal[$cont]['idplantillanominal'] = $value['idplantillanominal'];
            $cont++;
        }
        return $arrayfinal;
    }

    public function cantidadDatosVacacionesPersonaBajas($identidad, $texto)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlconcat = (!empty($texto)) ? "and (ddi.numero ilike '%$texto%' or dp.nombre ilike '%$texto%' or dp.snombre ilike '%$texto%' or dp.papel ilike '%$texto%' or dp.sapel ilike '%$texto%')" : "";
        $sqlDatosPersona = "select count( DISTINCT(dp.idpersona))
                from mod_persona.dat_persona dp
                left join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona and ddi.principal = 1)
                inner join mod_nomina.his_personabaja hpb on (hpb.idpersona = dp.idpersona)
                inner join mod_nomina.his_vacacionespersonabaja hvpb on (hvpb.idpersonabaja = hpb.idpersonabaja)
                left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = hpb.idplantillanominal)
		        where hpb.identidad = $identidad " . $sqlconcat ;
        $resultado = $conn->fetchOne($sqlDatosPersona);

        return $resultado;
    }

    public function obtenerDatosVacacionesPersonaBaja($idpersona, $identidad)
    {
        //Devolviendo los datos de las vacaciones de una persona en forma de arreglo.
        $sql = Doctrine_Query::create()
            ->from('HisPersonaBaja h')
            ->where('h.idpersona = ? and h.identidad = ?', array($idpersona, $identidad))
            ->fetchArray();
        return $sql;
    }

    public function modificarDatosVacacionesPersonaBajas($idvacperson, $idpersona, $identidad, $tiempacuminci, $saldoacuminci, $finicio, $ffin)
    {

        //Obteniendo los datos de vacaciones de la persona a modificar.
        $objVacPer = Doctrine::getTable('HisPersonaBaja')->find($idvacperson);

        //Modificando los datos.
        $objVacPer->tiempoacumuladoinicial = $tiempacuminci;
        $objVacPer->importeacumuladoinicial = $saldoacuminci;

        //Guardando los datos.
        $objVacPer->save();
    }

    public function obtenerPersonasBajasQueNoEstanArrayIdPers($identidad, $arrayidpersona)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if(count($arrayidpersona)>0){
            $sql = "select hpb.*, doc.numero, cpn.orden,
                 (CASE WHEN dp.snombre is not null THEN dp.nombre||' '||dp.snombre||' '||dp.papel||' '||dp.sapel ELSE dp.nombre ||' '||dp.papel||' '||dp.sapel END) as nombrecompleto,
                 ((CASE WHEN hpb.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion
                 from mod_nomina.conf_plantillanominal cpx
                 where cpx.idplantillanominal = hpb.idplantillanominal) WHEN cpn.denominacion <> ''
                 THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla
                 
                from mod_nomina.his_personabaja hpb
                inner join mod_persona.dat_persona dp on(dp.idpersona = hpb.idpersona)
                inner join mod_nomina.conf_plantillanominal cpn on(cpn.idplantillanominal = hpb.idplantillanominal)
                left join mod_persona.dat_docidentidad doc on(doc.idpersona = hpb.idpersona and doc.principal = 1)
                where hpb.identidad = ? and hpb.idpersona not in(" . implode(',', $arrayidpersona) . ")";
            return $conn->fetchAll($sql, array($identidad));
        }else{
            $sql = "select hpb.*, doc.numero, cpn.orden,
                 (CASE WHEN dp.snombre is not null THEN dp.nombre||' '||dp.snombre||' '||dp.papel||' '||dp.sapel ELSE dp.nombre ||' '||dp.papel||' '||dp.sapel END) as nombrecompleto,
                 ((CASE WHEN hpb.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion
                 from mod_nomina.conf_plantillanominal cpx
                 where cpx.idplantillanominal = hpb.idplantillanominal) WHEN cpn.denominacion <> ''
                 THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla
                 
                from mod_nomina.his_personabaja hpb
                inner join mod_persona.dat_persona dp on(dp.idpersona = hpb.idpersona)
                left join mod_nomina.conf_plantillanominal cpn on(cpn.idplantillanominal = hpb.idplantillanominal)
                left join mod_persona.dat_docidentidad doc on(doc.idpersona = hpb.idpersona and doc.principal = 1)
                where hpb.identidad = ?";
            return $conn->fetchAll($sql, array($identidad));
        }

    }

}
