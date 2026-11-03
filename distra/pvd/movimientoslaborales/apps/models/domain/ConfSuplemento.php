<?php

/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/05/16
 * Time: 13:39
 */
class ConfSuplemento extends BaseConfSuplemento
{
    public function setUp()
    {
        parent:: setUp();
    }

    public function getById($idsuplemento)
    {
        $queryObj = Doctrine_Query::create()
            ->from('ConfSuplemento m')
            ->where("m.idsuplemento = '$idsuplemento'");
        return $queryObj->fetchOne();
    }


    public function getSuplementos($idestructura, $denominacion, $start, $limit)
    {

        $sql = "SELECT
                  cs.idsuplemento,
                  cs.idplantilla,
                  p.denominacion as denominacion
				FROM mod_fuerzatrabajo.conf_suplemento cs
				INNER JOIN mod_rrhhmaestro.dat_plantilladoc p on(cs.idplantilla=p.idplantilladoc)
				INNER JOIN mod_rrhhmaestro.conf_plantillafuncionalidad pf on (pf.idplantilla=p.idplantilladoc AND pf.idconfiguracion = 203)
				WHERE p.fdesde <= now()
				  AND ((p.fhasta > now()) OR (p.fhasta IS NULL))";
        if ($idestructura) {
            $sql = $sql . ' ' . "and p.identidad = $idestructura";
        }
        if ($denominacion) {
            $sql = $sql . ' ' . "and p.denominacion ilike '%$denominacion%'";
        }
        $sql = $sql . ' ' . "LIMIT $limit OFFSET $start";

        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);

    }

}