<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/05/16
 * Time: 14:27
 */
class DatPlantillatipocontrato extends BaseDatPlantillatipocontrato
{
    public function setUp()
    {
        parent :: setUp();
        $this->hasOne(
            'NomTipoperiodo',
            array('local' => 'idtipoperiodo',
                'foreign' => 'idtipoperiodo')
        );
    }

    public function eliminarByTipocontrato($idtipocontrato, $identidad)
    {
        $sql = "DELETE
				FROM mod_fuerzatrabajo.dat_plantillatipocontrato ptc
				WHERE ptc.idtipocontrato = $idtipocontrato 
				AND ptc.idplantilla in (SELECT p.idplantilladoc as idplantilla
				FROM mod_rrhhmaestro.dat_plantilladoc p WHERE p.identidad = $identidad)";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->execute($sql);
    }

    public function getPlantillaByConfig($idconfiguracion, $identidad)
    {
        $sql = "SELECT c.idplantilla 
                FROM mod_rrhhmaestro.conf_plantillafuncionalidad c
                WHERE c.idconfiguracion = '$idconfiguracion'";
        if (!empty($identidad)) {
            $sql = "SELECT c.idplantilla 
                FROM mod_rrhhmaestro.conf_plantillafuncionalidad c
                INNER JOIN mod_rrhhmaestro.dat_plantilladoc AS p
				  ON (p.idplantilladoc = c.idplantilla AND p.identidad = $identidad)
                WHERE c.idconfiguracion = '$idconfiguracion'";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchOne($sql);
    }

    public function getByTipocontratoEnt($idtipocontrato, $identidad)
    {
        $sql = "SELECT ptc.*
				FROM mod_fuerzatrabajo.dat_plantillatipocontrato ptc
				WHERE ptc.idtipocontrato = $idtipocontrato 
				AND ptc.idplantilla in (SELECT p.idplantilladoc as idplantilla
				    FROM mod_rrhhmaestro.dat_plantilladoc p 
				    WHERE p.identidad = $identidad)";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->execute($sql);
    }
}