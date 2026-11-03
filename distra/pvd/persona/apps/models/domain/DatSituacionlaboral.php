<?php

class DatSituacionlaboral extends BaseDatSituacionlaboral
{
    protected $_objEstructuraService;

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomSituacion', array('local' => 'idsituacion', 'foreign' => 'idsituacion'));
        //$this->hasOne('NomMotivobaja', array('local' => 'idmotivo', 'foreign' => 'idmotivobaja'));
        $this->hasOne('DatPersonaentidad', array('local' => 'idpersonaentidad', 'foreign' => 'idpersonaentidad'));
        $this->hasMany('DatCargo', array('local' => 'idcargo', 'foreign' => 'idcargo'));
		$this->hasOne('NomFilaestruc', array('local' => 'idarea', 'foreign' => 'idfila'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idpersonaentidad
     *
     * @return Doctrine_Record
     */
    public function getById($idsituacionlaboralp)
    {
        if (is_array($idsituacionlaboralp) && count($idsituacionlaboralp) > 0) {
            return Doctrine_Query::create()->from('DatSituacionlaboral')->whereIn(
                'idsituacionlaboralp', $idsituacionlaboralp
            )->execute();
        } else {
            return Doctrine::getTable('DatSituacionlaboral')->find($idsituacionlaboralp);
        }
    }

    /**
     * Devuelve un objeto de la clase dado el $idpersonaentidad
     * @params $idpersonaentidad
     *
     * @return Doctrine_Record
     */
    public function getByIdPersonaEntidad($idpersonaentidad)
    {
        if (is_array($idpersonaentidad) && count($idpersonaentidad) > 0) {
            return Doctrine_Query::create()->from('DatSituacionlaboral')->whereIn(
                'idpersonaentidad', $idpersonaentidad
            )->execute();
        } else {
            return Doctrine_Query::create()->from('DatSituacionlaboral')->where(
                'idpersonaentidad = ?', $idpersonaentidad
            )->execute();
        }
    }

    public function getSitLabByPersonaEntidad($idpersonaentidad)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('sl.*')
            ->from('DatSituacionlaboral sl')
            ->where("sl.idpersonaentidad = '$idpersonaentidad' AND (now() < sl.fhasta OR sl.fhasta is null)")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function existeConSitLaboralyEntidad($idpersona, $identidad, $idsituacion)
    {
        $query = Doctrine_Query::create()
            ->select("sl.idsituacionlaboralp")
            ->from('DatSituacionlaboral sl')
            ->innerJoin('sl.DatPersonaentidad e')
            ->where("sl.idsituacion = '$idsituacion' AND e.idpersona = '$idpersona' AND e.identidad = '$identidad' AND sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)");
        return $query->execute()->toArray();
    }
	
	 public function existePersonaCargoMismaNaturaleza($idpersona, $idcargo)
    {
        $sql = "SELECT sl.idcargo
                FROM mod_persona.dat_situacionlaboral sl
                INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (sl.idcargo = dc.idcargo)
                INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (nc.idnomcargo = dc.idnomcargo)
                WHERE (sl.fhasta is null OR sl.fhasta > now()) AND pe.idpersona = $idpersona
                  AND nc.idnomcargo IN (SELECT nc.idnomcargo
                    FROM  mod_estructuracomp.dat_cargo AS dc
                    INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (nc.idnomcargo = dc.idnomcargo)
                    WHERE dc.idcargo = $idcargo)";

        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function existeConOcupacionPrincipalEntidad($idpersona, $identidad)
    {
        $query = Doctrine_Query::create()
            ->select("sl.idsituacionlaboralp")
            ->from('DatSituacionlaboral sl')
            ->innerJoin('sl.DatPersonaentidad e')
            ->where("sl.principal = 1 AND e.idpersona = '$idpersona' AND e.identidad = '$identidad' AND sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)");
        return $query->execute()->toArray();
    }


    public function removeRecord($id)
    {
        if (!empty($id)) {
            Doctrine_Query::create()->delete('DatSituacionlaboral')->whereIn(
                'idsituacionlaboralp', Utiles::reflectArray($id)
            )->execute();
        }
    }

    public function getCantPersonaCargo($id)
    {
        if (isset($id)) {
            return Doctrine_Query::create()
                ->from('DatSituacionlaboral dslab')
                ->innerJoin('dslab.DatPersonaentidad dpe WITH dpe.fdesde <= now() AND (dpe.fhasta > now() OR dpe.fhasta IS NULL)')
               // ->innerJoin('dslab.NomTipocontrato tc WITH tc.determinado = 0')
                ->where('dslab.idcargo = ?', $id)
                ->andWhere('dslab.fdesde <= now() AND (dslab.fhasta >= now() OR dslab.fhasta IS NULL)')
                ->count();
        }
    }

    public function getCargosByIds($idSituacion = null, $idPersonaEntidad = null)
    {
        if (isset($idSituacion) || isset($idPersonaEntidad)) {
            $query = Doctrine_Query::create()->select('dslab.idcargo')->from('DatSituacionlaboral dslab')->innerJoin(
                'dslab.DatPersonaentidad dpe WITH dpe.fdesde <= now() '
                . 'AND (dpe.fhasta >= now() OR dpe.fhasta IS NULL)'
            )->where('dslab.fdesde <= now() AND (dslab.fhasta >= now() OR dslab.fhasta IS NULL)')->setHydrationMode(
                Doctrine::HYDRATE_NONE
            )->groupBy('dslab.idcargo');
            $idSitu = Utiles::reflectArray($idSituacion);
            if (count($idSitu) > 0) {
                $query->andWhereIn('dslab.idsituacionlaboralp', $idSitu);

                return $query->execute();
            }
            $idPE = Utiles::reflectArray($idPersonaEntidad);
            if (count($idPE) > 0) {
                $query->andWhereIn('dpe.idpersonaentidad', $idPE);

                return $query->execute();
            }
        }
    }

    public function getCargosByPerson($idpersona)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT DISTINCT ab0.idpersona AS idpersona, (CASE WHEN ab0.snombre is not null THEN ab0.nombre || ' ' || ab0.snombre || ' ' || ab0.papel || ' ' || ab0.sapel
                ELSE ab0.nombre || ' ' || ab0.papel || ' ' ||  ab0.sapel END)  AS \"nombreapellidos\",ab9.idcargo,ab11.denominacion AS \"denomcargo\",ab8.identidad as identidad
                ,ab12.denominacion as entidad,ab9.idsituacion as idsituacion,ab13.denominacion as situacionlaboral,ab9.principal,ab9.fdesde,ab9.fhasta,ab9.idsituacionlaboralp,ab9.idarea,
                (CASE
                WHEN ab9.fdesde <= now() and (now() <= ab9.fhasta or ab9.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico
                FROM mod_persona.dat_persona ab0
                 LEFT JOIN mod_persona.dat_personaentidad ab8 ON(  ab8.idpersona = ab0.idpersona)
                 LEFT JOIN mod_persona.dat_situacionlaboral ab9 ON(  ab9.idpersonaentidad = ab8.idpersonaentidad)
                 LEFT JOIN mod_estructuracomp.dat_cargo ab10 ON(  ab10.idcargo = ab9.idcargo)
                 LEFT JOIN mod_estructuracomp.nom_cargo ab11 ON(  ab11.idnomcargo = ab10.idnomcargo)
                 LEFT JOIN mod_estructuracomp.dat_estructura ab12 ON( ab12.idestructura = ab8.identidad AND ab12.idproyecto = 0)
                 LEFT JOIN mod_persona.nom_situacion ab13 ON(  ab13.idsituacion = ab9.idsituacion)
                 where ab8.idpersona = ". $idpersona ." and ab9.estado = 0";
        return $conn->fetchAll($sql);
    }


}

