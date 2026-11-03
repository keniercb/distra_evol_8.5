<?php
class HisTrayectorialaboral extends BaseHisTrayectorialaboral
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    public function getById($idtrayectorialaboral)
    {
        try {
            if (count($idtrayectorialaboral) > 0) {
                $query = Doctrine_Query::create()
                    ->from('HisTrayectorialaboral')
                    ->whereIn('idtrayectorialaboral', $idtrayectorialaboral);
                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
	

    public function getTrayectoriaLaboralByPersona($idpersona)
    {
        $sqlQuery = "SELECT htl.*, mb.denominacion,
                      date_part('year',age(htl.fhasta, htl.fdesde)) AS tiempoa,
                      date_part('month',age(htl.fhasta, htl.fdesde)) AS tiempom,
                      date_part('day',age(htl.fhasta, htl.fdesde)) AS tiempod
                     FROM mod_personaext.his_trayectorialaboral htl
                     LEFT JOIN mod_fuerzatrabajo.nom_motivobaja mb ON (htl.motivobaja = mb.idmotivobaja)
                     WHERE idpersona = $idpersona ORDER BY fdesde";
        $manager = Doctrine_Manager::getInstance();
        $conexion = $manager->getCurrentConnection();
        return $conexion->fetchAll($sqlQuery);
    }

    public function getTrayectoriaLaboralGetSituacionLab($idpersona)
    {
        $sqlQuery = "SELECT dp.idpersona, (select de.denominacion from mod_estructuracomp.dat_estructura de WHERE de.idestructura = pe.identidad limit 1) as orgentidad,  
                           pe.fdesde as falta, pe.fhasta as fbaja, sl.idsituacionlaboralp, sl.fdesde, sl.fhasta,sl.noalta,sl.estado, nc.denominacion AS cargo, ncateg.denominacion AS categocup,
                           date_part('year',age(sl.fhasta, sl.fdesde)) AS tiempoa,
                            date_part('month',age(sl.fhasta, sl.fdesde)) AS tiempom,
                            date_part('day',age(sl.fhasta, sl.fdesde)) AS tiempod
                        FROM mod_persona.dat_situacionlaboral AS sl
                             INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (sl.idcargo = dc.idcargo AND dc.idproyecto = 0)
                              INNER JOIN mod_estructuracomp.dat_cargocivil AS dcc ON (dc.idcargo = dcc.idcargo AND dcc.idproyecto = 0)
                              INNER JOIN mod_estructuracomp.nom_categocup AS ncateg ON (dcc.idcategocup = ncateg.idcategocup)
                             INNER JOIN mod_estructuracomp.nom_cargo AS nc ON (dc.idnomcargo = nc.idnomcargo)
                             INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
                             INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
                        WHERE dp.idpersona = $idpersona AND
                              sl.fhasta <= now() AND
                              sl.estado != 0
                        ORDER BY sl.fdesde";
        $manager = Doctrine_Manager::getInstance();
        $conexion = $manager->getCurrentConnection();
        return $conexion->fetchAll($sqlQuery);
    }

    public function getMotivoBajaSituacionLabById($id, $estado)
    {
        $sqlQuery = "SELECT m.denominacion as motivo
                        FROM mod_persona.dat_situacionlaboral sl";
        if($estado == 1)
            $sqlQuery .= " INNER JOIN mod_fuerzatrabajo.nom_motivomovimiento m ON sl.idmotivo = m.idmotivomovimiento";
        else if($estado == 2)
            $sqlQuery .= " INNER JOIN mod_fuerzatrabajo.nom_motivobaja m ON sl.idmotivo = m.idmotivobaja";
        $sqlQuery .= " WHERE (sl.idsituacionlaboralp = $id)";
        $manager = Doctrine_Manager::getInstance();
        $conexion = $manager->getCurrentConnection();
        return $conexion->fetchAll($sqlQuery);
    }

    public function getCantTrayectoriaLaboralByPersona($idpersona, $filtro = null)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('HisTrayectorialaboral')
                ->whereIn('idpersona', $idpersona);
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delTrayectoriaLaboral(array $idtrayectorialaboral, $idpersona = null)
    {
        try {
            if (count($idtrayectorialaboral) > 0) {
                $query = Doctrine_Query::create()
                    ->delete('HisTrayectorialaboral')
                    ->whereIn('idtrayectorialaboral', $idtrayectorialaboral);

                if ($idpersona) {
                    $query->andWhere('idpersona = ?', $idpersona);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    public function getEntidad()
    {
        try {
            $query = Doctrine_Query::create()
                ->select('distinct(t.orgentidad) as orgentidad')
                ->from('HisTrayectorialaboral t');
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    public function getDenomEntidad($orgentidad)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('distinct(t.orgentidad) as orgentidad')
                ->from('HisTrayectorialaboral t');
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerCategOcupacional()
    {
        $sqlQuery = "SELECT denominacion AS categocup FROM mod_estructuracomp.nom_categocup";
        $manager = Doctrine_Manager::getInstance();
        $conexion = $manager->getCurrentConnection();
        return $conexion->fetchAll($sqlQuery);
    }
}
