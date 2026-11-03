<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 11/04/19
 * Time: 14:20
 */
class DatImputable extends BaseDatImputable
{
    public function setUp()
    {
        parent :: setUp();
        $this->hasOne(
            'DatInterrupcion',
            array('local' => 'idinterrupcion', 'foreign' => 'idinterrupcion')
        );
    }

    public function getById($idimputable)
    {
        return Doctrine::getTable('DatImputable')->find($idimputable);
    }

    public function existeImputable($idpersona, $idinterrupcion)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idimputable')
            ->from('DatImputable m')
            ->where("m.idpersona = $idpersona AND m.idinterrupcion = $idinterrupcion");
        return $queryObj->fetchArray();
    }

    public function getImputableByIdInterrupcion($interrupcion, $filtro, $inicio, $limite)
    {
        $sql = "SELECT
          i.idimputable
        , i.idpersona
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
        FROM mod_fuerzatrabajo.dat_imputable AS i 
        LEFT JOIN mod_persona.dat_personaentidad AS pe ON (i.idpersona = pe.idpersona)
        LEFT JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND sl.estado = 0)
        INNER JOIN mod_fuerzatrabajo.dat_interrupcion AS dint ON (dint.idinterrupcion = i.idinterrupcion)
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

    public function cantImputableIdInterrupcion($interrupcion, $filtro)
    {
        $sql = "SELECT
            i.idimputable
            FROM mod_fuerzatrabajo.dat_imputable AS i
            LEFT JOIN mod_persona.dat_persona AS dp ON (i.idpersona = dp.idpersona)
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