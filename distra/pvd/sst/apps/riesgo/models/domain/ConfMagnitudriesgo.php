<?php
class ConfMagnitudriesgo extends BaseConfMagnitudriesgo
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idmagnitudriesgo)
    {
        return Doctrine::getTable('ConfMagnitudriesgo')->find($idmagnitudriesgo);
    }

    public function getConfMagnitudriesgo($start, $limit)
    {
        $sql = "SELECT
				 em.denominacion as denomformula, ca.*
				FROM mod_sstriesgo.conf_magnitudriesgo AS ca
				INNER JOIN mod_utiles.dat_expresionmatematica AS em ON (em.idexpresionmatematica = ca.idexpresionmatematica)
				ORDER BY ca.orden";

        if (!empty($start) && !empty($limit)) {
            $sql = $sql . "  OFFSET $start LIMIT $limit";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantConf()
    {
        $sql = "SELECT count(ca.idmagnitudriesgo) as cantidad
				FROM mod_sstriesgo.conf_magnitudriesgo AS ca";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function maxOrden()
    {
        $sql = "SELECT max(ca.orden) as maxorden
				FROM mod_sstriesgo.conf_magnitudriesgo AS ca";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchOne($sql);
    }

}