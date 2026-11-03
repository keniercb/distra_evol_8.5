<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArcDatPlanActividades extends BaseDatArcDatPlanActividades
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatArcDatPlan', array('local' => 'idplan', 'foreign' => 'idplan')
        );
        $this->hasOne(
            'DatActividades',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
    }

    public function ObtenerRelacionPlanArcAct($idplan, $idarc, $idactividad)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanActividades apa')
            ->where(
                "apa.idplan = $idplan AND apa.idarc = $idarc 
                    AND apa.idactividad = $idactividad"
            )
            ->execute();
        return $result->toArray();
    }

    public function ObtenerRelacionPlanArcActByPlanArc(
        $idplan, $idarc, $idautor
    ) {
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
        INNER JOIN mod_objetivos.dat_actividades a 
        ON e.idelemento = a.idactividad
        INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apa 
        ON apa.idactividad = a.idactividad
        WHERE apa.idplan = '$idplan' AND apa.idarc = '$idarc' 
        AND apa.idautor = '$idautor'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function ObtenerRelacionPlanArcActByAct($idactividad)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanActividades apa')
            ->where("apa.idactividad = $idactividad")
            ->execute();
        return $result->toArray();
    }

    public function ExisteRelacioncionArc_Act($idactividad, $idautor)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanActividades dadpa')
            ->where(
                "dadpa.idactividad = $idactividad AND dadpa.idautor = $idautor"
            )
            ->execute();
        return $result->toArray();
    }

    public function ObtenerActividadesARCPlan($idplan, $idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatActividades a')
            ->innerJoin('a.DatArcDatPlanActividades apa')
            ->innerJoin('a.DatElementos e')
            ->where('apa.idarc =?', $idarc)
            ->addWhere('apa.idplan=?', $idplan)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function ObtenerPlanYActividadesDadoIdArc($idarc, $idautor)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanActividades apa')
            ->where("apa.idarc = $idarc AND apa.idautor = $idautor")
            ->execute();
        return $result->toArray();
    }

    public function ObtenerActividadesDadoIdArcIdPlan($idarc, $idplan)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanActividades apa')
            ->where("apa.idarc = $idarc AND apa.idplan = $idplan")
            ->execute();
        return $result->toArray();
    }

    public function getArcPlanAct($idplan, $idarc)
    {
      $cadenarepeticion = "SELECT distinct r.idelemento
              FROM mod_objetivos.dat_elementos r
              INNER JOIN mod_objetivos.dat_actividades ar 
              ON ar.idactividad = r.idelemento
              WHERE ar.tiporepeticion IS NOT NULL ";

      $cadena = " SELECT apa.idarc, apa.idplan, e.idelemento, e.denelemento, e.dirigente as dirigentes, e.participante as participantes,
                      a.fechainicio, a.fechafin
                  FROM mod_objetivos.dat_arc_dat_plan_actividades apa
                  INNER JOIN mod_objetivos.dat_elementos e
                  ON(e.idelemento = apa.idactividad)
                  INNER JOIN mod_objetivos.dat_actividades a
                  ON (a.idactividad = e.idelemento AND a.suspendida=0) 
                  WHERE apa.idarc = {$idarc}
                  AND apa.idplan = {$idplan} 
                  AND a.idactividad NOT IN (" . $cadenarepeticion . ") ";
      $connA = Doctrine_Manager:: connection();
      //print_r($cadena);die;
      $res = $connA->execute($cadena);
      $result = $res->fetchAll(PDO::FETCH_ASSOC);
      return $result;
    }

    public function getArcPlanActAseguran($datos, $idarc)
    {
      $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON ar.idactividad = r.idelemento
            WHERE ar.tiporepeticion IS NOT NULL ";

        $cadena = " SELECT distinct a.idactividad, 
                  e.denelemento,    
                  to_char(a.fechainicio, 'dd/mm/YYYY')  ||' - ' ||  to_char(a.fechafin, 'dd/mm/YYYY') as plazo,
                  CASE WHEN e.dirigente is NULL THEN '' ELSE e.dirigente END as dirigentes,
                  CASE WHEN e.participante is NULL THEN '' ELSE e.participante END as participantes
                FROM mod_objetivos.dat_arc_dat_plan_actividades apa
                INNER JOIN mod_objetivos.dat_elementos e
                ON(e.idelemento = apa.idactividad)
                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = e.idelemento AND a.suspendida=0) 
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                LEFT JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado)  
                WHERE 
                (e.idusuariocrea = {$datos->idusuariosession} 
                            OR i.idusuario = {$datos->idusuariosession})
                AND apa.idarc = {$idarc}
                AND apa.idplan = {$datos->idplan} 
                AND a.idactividad NOT IN (" . $cadenarepeticion . ") ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

  public function getArcPlanActSQL($idplan, $idarc)
  {
    $cadena = " SELECT e.idelemento as idelementohijo, e.idtipoelemento
                FROM mod_objetivos.dat_arc_dat_plan_actividades apa
                INNER JOIN mod_objetivos.dat_elementos e
                ON(e.idelemento = apa.idactividad)
                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = e.idelemento AND a.suspendida=0) 
                WHERE apa.idarc = {$idarc}
                AND apa.idplan = {$idplan} ";
    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($cadena);
    $result = $res->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

}

//fin clase 



