<?php

class DatTrasladoUeb extends BaseDatTrasladoUeb
{
    public function setUp()
    {
        parent:: setUp();
    }

    function obetenerTrasladoUEB()
    {
        $sql = "SELECT
                    ddi.numero AS ci,
                    CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
                        WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                            THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
                        WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                            THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
                        ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre END AS nombreyapellido,
                deop.denominacion AS ueb,
                dt.*
                FROM mod_fuerzatrabajo.dat_trasladoueb AS dt
                    INNER JOIN mod_persona.dat_persona AS dp ON (dt.idpersona = dp.idpersona)
                    INNER JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona AND ddi.principal = 1)  
                    INNER JOIN mod_estructuracomp.dat_estructuraop AS deop ON (dt.idueb = deop.idestructuraop AND deop.idproyecto = 0)
                WHERE dp.feliminado IS NULL";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    function eliminarTrasladoPorSituacionLaboral($idsituacionlaboral)
    {
        $sql = "DELETE FROM mod_fuerzatrabajo.dat_trasladoueb WHERE idsituacionlaboral = '$idsituacionlaboral'";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}