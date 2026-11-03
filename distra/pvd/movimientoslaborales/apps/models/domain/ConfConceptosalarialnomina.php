<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/05/16
 * Time: 13:37
 */
class ConfConceptosalarialnomina extends BaseConfConceptosalarialnomina
{
    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($idcsn)
    {
        return Doctrine::getTable('ConfConceptosalarialnomina')->find($idcsn);
    }

    public function getConfig($idconceptosalarial)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idconceptosalarialnomina, m.idconceptosalarial')
            ->from('ConfConceptosalarialnomina m')
            ->where("m.idconceptosalarial = '$idconceptosalarial'");
        return $queryObj->fetchArray();
    }

    public function getConfigAll($reporte = -1)
    {
        $sql = "SELECT cn.idconceptosalarialnomina as idestructurarmodelonomina,
                cn.idconceptosalarial, c.denominacion
                FROM mod_fuerzatrabajo.conf_conceptosalarialnomina cn
                INNER JOIN mod_fuerzatrabajo.nom_conceptosalarial c 
                ON (c.idconceptosalarial = cn.idconceptosalarial)";
        if ($reporte == 1) {
            $sql .= " WHERE c.reporte_registro_trabajadores = 1; ";
        }
        
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);

    }

    public function deleteByIdconceptosalarial($idconceptosalarial)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('ConfConceptosalarialnomina m')
            ->where("m.idconceptosalarial = $idconceptosalarial");
        $queryObj->execute();
    }

    public function getConceptosPD()
    {
        $sql = "SELECT idconceptopercepciondescuento, denominacion
                FROM mod_nomina.nom_conceptopercepciondescuento AS ncpd
                WHERE (ncpd.fechafin IS NULL OR ncpd.fechafin > now());";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }
}