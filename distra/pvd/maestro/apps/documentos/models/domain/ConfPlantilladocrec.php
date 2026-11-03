<?php
class ConfPlantilladocrec extends BaseConfPlantilladocrec
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idplantilladocrec)
    {
        return Doctrine::getTable('ConfPlantilladocrec')->find($idplantilladocrec);
    }

    public function getConfigByIdplantilla($idplantilladoc)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idplantilladocrec, v.idconfiguracion, v.idplantilladoc')
            ->from('ConfPlantilladocrec v')
            ->where("v.idplantilladoc = '$idplantilladoc'");
        return $queryObj->fetchArray();
    }

    public function deleteByIdPlantilla($idplantilladoc)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('ConfPlantilladocrec c')
            ->where("c.idplantilladoc = '$idplantilladoc'")
            ->execute();
    }

    //Para obtener la sit lab para mostrar en otros conceptos
    public function getSituacionLabPorPersonaEntidad($idpersona)
    {
        $sql = "SELECT
                    dpe.idpersonaentidad,
                    dpe.identidad,
                    dsl.idarea,
                    dsl.idsituacionlaboralp,
                    dsl.idcargo,
                    dsl.fdesde,
                    dsl.fhasta,
                    nc.idnomcargo,
                    nc.denominacion
                FROM mod_persona.dat_personaentidad AS dpe
                INNER JOIN mod_persona.dat_situacionlaboral AS dsl
                    ON (dpe.idpersonaentidad = dsl.idpersonaentidad
                    AND (dsl.fhasta > now() OR dsl.fhasta IS NULL))
                INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (dsl.idcargo = dc.idcargo AND dc.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
                WHERE idpersona = $idpersona";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}