<?php

class DatEstadovivienda extends BaseDatEstadovivienda
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomConvivencia', array('local' => 'idconvivencia', 'foreign' => 'idconvivencia'));
        $this->hasOne('NomEstadovivienda', array('local' => 'idestadovivienda', 'foreign' => 'idestadovivienda'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idestadoviviendap
     *
     * @return Doctrine_Record
     */

    public function getById($idestadoviviendap)
    {
        return Doctrine::getTable('DatEstadovivienda')->find($idestadoviviendap);
    }


    public function getEstadoViviendaByPersona(array $idpersona)
    {

        try {
            $query = Doctrine_Query::create()->select(
                'df.*,nc.denominacion as denomconvivencia,ne.denominacion as denomestado'
            )->from('DatEstadovivienda df')
                ->leftJoin('df.NomConvivencia nc')->leftJoin('df.NomEstadovivienda ne')
                ->whereIn('df.idpersona', $idpersona);

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getEntidad($idestructura)
    {

        $sql = "SELECT  idestructura
                 FROM mod_fuerzatrabajo.conf_entidad
                 where mod_fuerzatrabajo.conf_entidad.identidad=$idestructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getDatos($entidades)
    {
        $ueb = (implode(',', $entidades));
        $sql = "SELECT  ev.idpersona, ev.idestadovivienda,ev.idconvivencia,sl.ueb,nc.denominacion as convivencia,nev.denominacion as estadovivienda,sl.idarea
              FROM mod_personaext.dat_estadovivienda as ev
              left join mod_persona.dat_personaentidad as pe on(ev.idpersona=pe.idpersona)
              left join mod_persona.dat_situacionlaboral as sl on(sl.idpersonaentidad=pe.idpersonaentidad)
              left join mod_personaext.nom_convivencia as nc on (ev.idconvivencia=nc.idconvivencia)
              left join mod_personaext.nom_estadovivienda as nev on (ev.idestadovivienda=nev.idestadovivienda)
               left join mod_fuerzatrabajo.conf_entidad as cnf on(cnf.idestructura= sl.ueb)
              where sl.principal=1 and sl.fhasta is null";
        if (count($entidades)>0) {
            $sql .= " and sl.ueb in ($ueb)";
        }
        $sql .= "  order By sl.ueb";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

}

