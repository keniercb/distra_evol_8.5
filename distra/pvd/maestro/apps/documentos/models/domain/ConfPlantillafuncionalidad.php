<?php
class ConfPlantillafuncionalidad extends BaseConfPlantillafuncionalidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatPlantilladoc', array('local'=>'idplantilla','foreign'=>'idplantilladoc'));
    }

    public function getById($idconfiguracion)
    {
        return Doctrine::getTable('ConfPlantillafuncionalidad')->find($idconfiguracion);
    }

    public function deleteConf($idconfiguracion, $identidad, $idplantilla)
    {
        $sql = "DELETE FROM mod_rrhhmaestro.conf_plantillafuncionalidad m
          WHERE m.idconfiguracion = '$idconfiguracion'";

        if (isset($idplantilla)) {
            $sql .= " AND m.idplantilla IN (SELECT m2.idplantilladoc FROM mod_rrhhmaestro.dat_plantilladoc as m2 
            WHERE m2.idplantilladoc = '$idplantilla' AND m2.identidad = '$identidad')";
        } else {
            $sql .= " AND m.idplantilla IN (SELECT m2.idplantilladoc FROM mod_rrhhmaestro.dat_plantilladoc as m2 
            WHERE m2.identidad = '$identidad')";
        }

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->execute($sql);
    }

    public function deleteConfAll($identidad, $idplantilla)
    {
        $sql = "DELETE FROM mod_rrhhmaestro.conf_plantillafuncionalidad m";
        if (isset($idplantilla)) {
            $sql .= " WHERE m.idplantilla IN (SELECT m2.idplantilladoc FROM mod_rrhhmaestro.dat_plantilladoc as m2 
            WHERE m2.idplantilladoc = '$idplantilla' AND m2.identidad = '$identidad')";
        } else {
            $sql .= " WHERE m.idplantilla IN (SELECT m2.idplantilladoc FROM mod_rrhhmaestro.dat_plantilladoc as m2 
            WHERE m2.identidad = '$identidad')";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->execute($sql);
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
}