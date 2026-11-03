<?php
class ConfGradopeligrosidad extends BaseConfGradopeligrosidad
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idgradopeligrosidad)
    {
        return Doctrine::getTable('ConfGradopeligrosidad')->find($idgradopeligrosidad);
    }

    public function getConfGradopeligrosidad($start, $limit)
    {
        $sql = "SELECT
				 em.denominacion as denomformula, ca.*
				FROM mod_sstriesgo.conf_gradopeligrosidad AS ca
				INNER JOIN mod_utiles.dat_expresionmatematica AS em ON (em.idexpresionmatematica = ca.idexpresionmatematica)";

        if (!empty($start) && !empty($limit)) {
            $sql = $sql . "  OFFSET $start LIMIT $limit";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function deleteAll()
    {
        $sql = "DELETE FROM mod_sstriesgo.conf_gradopeligrosidad";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->execute($sql);
    }

}