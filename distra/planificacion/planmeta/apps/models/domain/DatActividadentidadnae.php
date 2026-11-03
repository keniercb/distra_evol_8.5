<?php

class DatActividadentidadnae extends BaseDatActividadentidadnae
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatPlanificacionnaegeneral',
            array('local'   => 'idplanificacionnaegeneral',
                  'foreign' => 'idplanificacionnaegeneral')
        );
        $this->hasOne(
            'DatActividadentidad', array('local'   => 'idactividadentidad',
                                         'foreign' => 'idactividadentidad')
        );
    }

    public function getModeloAsocEntidadDemandados($arrayIdent, $arrayIdesp)
    {
        $conn = Doctrine_Manager::connection();
        if ($arrayIdent[0] == null || $arrayIdesp[0] == null) {
            return array();
        }
        $strEnts = implode(",", $arrayIdent);
        $strIdesp = implode(",", $arrayIdesp);

        $sql
            = "SELECT DISTINCT em.idmodelo,mo.denominacion
                FROM mod_planificacion.dat_entidadmodelo em
                INNER JOIN mod_planificacion.dat_actividadmodelo am
                ON am.idmodelo = em.idmodelo
                INNER JOIN mod_planificacion.nom_actividad a
                ON a.idactividad = am.idactividad
                INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                ON a.idactividad = aec.idactividad AND aec.idespecialidad In($strIdesp)
                INNER JOIN mod_planificacion.nom_datosnomenclador dn
                ON( aec.iddatosnomenclador = dn.iddatosnomenclador AND dn.uridatosnomenclador = 'demandada' )
                INNER JOIN mod_planificacion.dat_modelo mo
                ON mo.idmodelo = em.idmodelo 
                WHERE em.identidad IN($strEnts)";
        $result = $conn->execute($sql)->fetchAll(); //PDO::FETCH_UNIQUE |
        return $result;
    }

    public function buscarActEntNae($idactividadentidad, $idnae)
    {
        $query = new Doctrine_Query();
        return $query
            ->from('DatActividadentidadnae aenae')
            ->innerJoin('aenae.DatPlanificacionnaegeneral png')
            ->leftJoin('png.DatPlanificacionnaeobjetogasto pnog')
            ->leftJoin('png.DatPlanificacionnaeingreso pning')
            ->where(
                'aenae.idactividadentidad = ? AND aenae.idnae = ? ',
                array($idactividadentidad, $idnae)
            )->execute()->getFirst();
    }

}
