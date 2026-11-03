<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/05/16
 * Time: 14:20
 */
class DatInterrupto extends BaseDatInterrupto
{
    public function setUp()
    {
        parent :: setUp();
        $this->hasOne(
            'DatInterrupcion',
            array('local' => 'idinterrupcion', 'foreign' => 'idinterrupcion')
        );
    }

    public function getById($idinterrupto)
    {
        return Doctrine::getTable('DatInterrupto')->find($idinterrupto);
    }

    public function existeInterrupto($idsituacionlaboralp)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idinterrupto')
            ->from('DatInterrupto m')
            ->where(
                "m.idsituacionlaboralp = $idsituacionlaboralp
                AND (m.fdesde <= now() AND (m.fhasta > now() OR m.fhasta IS NULL))"
            );
        return $queryObj->fetchArray();
    }

    public function getInterruptoByIdCargo($filtro, $fdesde, $fhasta, $cargos, $inicio, $limite, $activo)
    {
        $sql = "SELECT
          i.idinterrupto
        , i.idsituacionlaboralp
        , i.fdesde
        , i.fhasta
        , i.reubicado
        , i.idsituacionint
        , i.idcausanoreubicado
        , dint.idmotivointerrupcion
        , nmi.denominacion as motivointerrupcion
        , ncnr.denominacion as causanoreubicado
        , nsi.denominacion as situacionactual
        , pe.idpersona
        , pe.identidad
        , sl.idcargo
        , sl.idarea as idarea
        , ident.numero AS numid
        , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
            END AS nombreyapellidos
        FROM mod_fuerzatrabajo.dat_interrupto AS i
        INNER JOIN mod_fuerzatrabajo.dat_interrupcion AS dint ON (dint.idinterrupcion = i.idinterrupcion)
        INNER JOIN mod_ftinterrupto.nom_motivointerrupcion AS nmi ON (nmi.idmotivointerrupcion = dint.idmotivointerrupcion)
        LEFT JOIN mod_ftinterrupto.nom_situacionint AS nsi ON (nsi.idsituacionint = i.idsituacionint)
        LEFT JOIN mod_ftinterrupto.nom_causanoreubicado AS ncnr ON (ncnr.idcausanoreubicado = i.idcausanoreubicado)
        INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idsituacionlaboralp = i.idsituacionlaboralp)
        LEFT JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
        LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
        LEFT JOIN mod_persona.dat_docidentidad AS ident
          ON (dp.idpersona = ident.idpersona AND ident.principal = 1
          AND (ident.fhasta > now() OR ident.fhasta IS NULL))";

        if (count($cargos)>0) {
            $sql .= "WHERE sl.idcargo in (".implode(',', $cargos).")";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' 
            or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%' 
            or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
            or dp.sapel ilike '%$filtro%')";
        }
        if (!empty($fdesde)) {
            $sql .= " AND i.fdesde >= '$fdesde'";
        }
        if (!empty($fhasta)) {
            $sql .= " AND i.fhasta <= '$fhasta'";
        }
        if ($activo == 1) {
            $sql .= "AND i.fdesde <= now() AND (now() <= i.fhasta OR i.fhasta is null)";
        } else {
            $sql .= " AND i.fhasta < now()";
        }
        $sql = $sql." ORDER BY sl.idarea OFFSET $inicio LIMIT $limite";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantInterruptoIdCargo($filtro, $fdesde, $fhasta, $cargos, $activo)
    {
        $sql = "SELECT
            i.idinterrupto
            FROM mod_fuerzatrabajo.dat_interrupto AS i
            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idsituacionlaboralp = i.idsituacionlaboralp)
            LEFT JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
            LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
            LEFT JOIN mod_persona.dat_docidentidad AS ident
              ON (dp.idpersona = ident.idpersona AND ident.principal = 1
              AND (ident.fhasta > now() OR ident.fhasta IS NULL))";
        if (count($cargos)>0) {
            $sql .= "WHERE sl.idcargo in (".implode(',', $cargos).")";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
            or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
            or dp.sapel ilike '%$filtro%')";
        }
        if (!empty($fdesde)) {
            $sql .= " AND i.fdesde >= '$fdesde'";
        }
        if (!empty($fhasta)) {
            $sql .= " AND i.fhasta <= '$fhasta'";
        }
        if ($activo == 1) {
            $sql .= "AND i.fdesde <= now() AND (now() <= i.fhasta OR i.fhasta is null)";
        } else {
            $sql .= " AND i.fhasta < now()";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function getInterruptoByIdInterrupcion($interrupcion, $filtro, $inicio, $limite)
    {
        $sql = "SELECT
          i.idinterrupto
        , i.idsituacionlaboralp
        , i.fdesde
        , i.fhasta
        , i.horas
        , i.reubicado
        , i.idsituacionint
        , i.idcausanoreubicado
        , dint.idmotivointerrupcion
        , nmi.denominacion as motivointerrupcion
        , ncnr.denominacion as causanoreubicado
        , nsi.denominacion as situacionactual
        , pe.idpersona
        , pe.identidad
        , sl.idcargo
        , sl.idarea as idarea
        , ident.numero AS numid
        , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
            END AS nombreyapellidos
        FROM mod_fuerzatrabajo.dat_interrupto AS i
        INNER JOIN mod_fuerzatrabajo.dat_interrupcion AS dint ON (dint.idinterrupcion = i.idinterrupcion)
        INNER JOIN mod_ftinterrupto.nom_motivointerrupcion AS nmi ON (nmi.idmotivointerrupcion = dint.idmotivointerrupcion)
        LEFT JOIN mod_ftinterrupto.nom_situacionint AS nsi ON (nsi.idsituacionint = i.idsituacionint)
        LEFT JOIN mod_ftinterrupto.nom_causanoreubicado AS ncnr ON (ncnr.idcausanoreubicado = i.idcausanoreubicado)
        INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idsituacionlaboralp = i.idsituacionlaboralp)
        LEFT JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
        LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
        LEFT JOIN mod_persona.dat_docidentidad AS ident ON (dp.idpersona = ident.idpersona AND ident.principal = 1
          AND (ident.fhasta > now() OR ident.fhasta IS NULL))
        WHERE i.idinterrupcion = $interrupcion";

        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' 
            or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%' 
            or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
            or dp.sapel ilike '%$filtro%')";
        }

        $sql = $sql . " ORDER BY sl.idarea OFFSET $inicio LIMIT $limite";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantInterruptoIdInterrupcion($interrupcion, $filtro)
    {
        $sql = "SELECT
            i.idinterrupto
            FROM mod_fuerzatrabajo.dat_interrupto AS i
            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idsituacionlaboralp = i.idsituacionlaboralp)
            LEFT JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
            LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
            LEFT JOIN mod_persona.dat_docidentidad AS ident
              ON (dp.idpersona = ident.idpersona AND ident.principal = 1
              AND (ident.fhasta > now() OR ident.fhasta IS NULL))
            WHERE i.idinterrupcion = $interrupcion";

        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
            or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
            or dp.sapel ilike '%$filtro%')";
        }

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }
}