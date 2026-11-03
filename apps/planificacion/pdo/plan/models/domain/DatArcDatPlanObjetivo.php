<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArcDatPlanObjetivo extends BaseDatArcDatPlanObjetivo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatObjetivo',
            array('local' => 'idobjetivo', 'foreign' => 'idobjetivo')
        );
        $this->hasOne(
            'DatArcDatPlan', array('local' => 'idplan', 'foreign' => 'idplan')
        );
    }

    public function Buscar($idarc)
    {
        $temp = $this->conn->getTable('DatArcDatPlanObjetivo')
            ->find($idarc);
        return $temp->toArray();
    }

    public function ObtenerRelacionObjetivoArcActByPlanArc(
        $idplan, $idarc, $idautor
    ) {
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
                    INNER JOIN mod_objetivos.dat_objetivo o 
                    ON e.idelemento = o.idobjetivo
                    INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo apo 
                    ON apo.idobjetivo = o.idobjetivo
                    WHERE apo.idplan = '$idplan' AND apo.idarc = '$idarc' 
                    AND apo.idautor = '$idautor'"; //die($cadena);
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerRelacionesDadoPlanARC($idplan, $idarc)
    {
        $cadena
            = "SELECT apo.idobjetivo,e.denelemento,o.fechainicio,o.fechafin
                    FROM mod_objetivos.dat_arc_dat_plan_objetivo apo
                    INNER JOIN mod_objetivos.dat_objetivo o 
                    ON o.idobjetivo = apo.idobjetivo
                    INNER JOIN mod_objetivos.dat_elementos e 
                    ON e.idelemento = o.idobjetivo
                    WHERE apo.idplan = '$idplan' AND apo.idarc = '$idarc' 
                    ORDER BY e.denelemento ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return  $result;
    }

    public function ObtenerRelacionesActividadesDadoPlanARCBICSA(
        $idplan, $idarc, $datos
    ) {
        $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
        $fechafinD = $datos->arraydatosreporte['fechafinD'];
        if ($fechafinD != null && $fechainicioD != null) {
            $wherfecha .= " AND (a.fechainicio >= '$fechainicioD' AND a.fechafin <= '$fechafinD')";
        }
        //por lili agregado devolver el campo tipo repeticion
        $cadenaestados
            = "SELECT apa.idactividad as idelemento,
            e.denelemento as denelemento,a.fechainicio,a.fechafin,
            e.participante AS participantes,e.dirigente AS dirigentes,
            a.horainicio,a.horafin,a.lugar,a.tiporepeticion
            FROM mod_objetivos.dat_arc_dat_plan_actividades apa
            INNER JOIN mod_objetivos.dat_actividades a 
            ON a.idactividad = apa.idactividad
            INNER JOIN mod_objetivos.dat_elementos e 
            ON e.idelemento = a.idactividad
            WHERE apa.idplan = '$idplan' AND apa.idarc = '$idarc'";
        $cadena .= $cadenaestados . $wherfecha
            . " ORDER BY a.fechainicio,a.horainicio ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerRelacionesActividadesDadoPlanARC(
        $idplan, $idarc, $datos
    ) {
        $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
        $fechafinD = $datos->arraydatosreporte['fechafinD'];
        if ($fechainicio != null) {
            $wherfecha
                .= " AND ( (a.fechainicio <= '$fechainicio'
                AND a.fechafin >= '$fechainicio') ";
            if ($fechafin != null) {
                $wherfecha
                    .= " OR (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')								
            OR (a.fechainicio >= '$fechainicio' AND a.fechafin <= '$fechafin')";
            }
            $wherfecha .= ")";
        }
        if ($fechafin != null && $fechainicio == null) {
            $wherfecha
                .= " AND (a.fechainicio <= '$fechafin'
                AND a.fechafin >= '$fechafin')";
        }
        if ($fechainicioD != null) {
            $wherfecha
                .= " AND ( (a.fechainicio <= '$fechainicioD'
                AND a.fechafin >= '$fechainicioD') ";
            if ($fechafinD != null) {
                $wherfecha
                    .= " OR (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechafinD')
                    OR (a.fechainicio >= '$fechainicioD' 
                    AND a.fechafin <= '$fechafinD')";
            }
            $wherfecha .= ")";
        }
        if ($fechafinD != null && $fechainicioD == null) {
            $wherfecha .= " AND (a.fechainicio <= '$fechafinD' AND a.fechafin >= '$fechafinD')";
        }
        $cadenaestados
            = "SELECT apa.idactividad as idelemento,
            e.denelemento as denelemento,a.fechainicio,a.fechafin,
            e.participante AS participantes,e.dirigente AS dirigentes,
            a.horainicio,a.horafin,a.lugar
            FROM mod_objetivos.dat_arc_dat_plan_actividades apa
            INNER JOIN mod_objetivos.dat_actividades a 
            ON a.idactividad = apa.idactividad
            INNER JOIN mod_objetivos.dat_elementos e 
            ON e.idelemento = a.idactividad
            WHERE apa.idplan = '$idplan' AND apa.idarc = '$idarc'
                AND e.cantrelacascdcorigen4 = 0 ";
        $cadena .= $cadenaestados . $wherfecha
            . " ORDER BY a.fechainicio,a.horainicio ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerObjDadoPlanARC($idplan, $idarc)
    {
        $cadena
            = "SELECT apo.idobjetivo,e.denelemento,o.fechainicio,o.fechafin
                    FROM mod_objetivos.dat_arc_dat_plan_objetivo apo
                    INNER JOIN mod_objetivos.dat_objetivo o 
                    ON o.idobjetivo = apo.idobjetivo
                    INNER JOIN mod_objetivos.dat_elementos e 
                    ON e.idelemento = o.idobjetivo
                    WHERE apo.idplan = '$idplan' AND apo.idarc IN ('$idarc')";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

  public function ObtenerObjDadoPlanARCReporte($idplan, $idarc)
  {
    $cadena
            = "SELECT apo.idobjetivo as idelementohijo,e.idtipoelemento
                    FROM mod_objetivos.dat_arc_dat_plan_objetivo apo
                    INNER JOIN mod_objetivos.dat_objetivo o 
                    ON o.idobjetivo = apo.idobjetivo
                    INNER JOIN mod_objetivos.dat_elementos e 
                    ON e.idelemento = o.idobjetivo
                    WHERE apo.idplan = '$idplan' AND apo.idarc IN ('$idarc')";
    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($cadena);
    $result = $res->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanObjetivo')
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanObjetivo')
            ->limit($limite = 10)
            ->offset($inicio = 0)
            ->execute();
        return $result->toArray();
    }

    public function ExisteAreaEnObjPlan($idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanObjetivo apo')
            ->where("apo.idarc = $idarc")
            ->execute();
        return $result->toArray();
    }

    public function obtenerObjXUsuarioPlanArc($idusuario, $idelem, $idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatObjetivo o')
            ->innerJoin('o.DatArcDatPlanObjetivo apo')
            ->innerJoin('o.DatElementos e')
            ->where('apo.idarc =?', $idarc)
            ->addWhere('apo.idplan=?', $idelem)
            ->addWhere('e.idusuariocrea=?', $idusuario)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function ObtenerObjetivosPorPlanesSQL($idplan)
    {
        $cadena
            = "SELECT apo.idobjetivo,e.denelemento,o.fechainicio,o.fechafin
                    FROM mod_objetivos.dat_arc_dat_plan_objetivo apo
                    INNER JOIN mod_objetivos.dat_objetivo o 
                    ON o.idobjetivo = apo.idobjetivo
                    INNER JOIN mod_objetivos.dat_elementos e 
                    ON e.idelemento = o.idobjetivo
                    WHERE apo.idplan = '$idplan'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerRelacionPlanArcObjByObj($idobjetivo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanObjetivo apo')
            ->where("apo.idobjetivo = $idobjetivo")
            ->execute();
        return $result->toArray();
    }

    public function ExisteRelacioncionArc_Obj($idobjetivo, $idusuario)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanObjetivo dadpo')
            ->where(
                "dadpo.idobjetivo = $idobjetivo AND dadpo.idautor = $idusuario"
            )
            ->execute();
        return $result->toArray();
    }

    public function ObtenerObjetivosARCPlan($idplan, $idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatObjetivo o')
            ->innerJoin('o.DatArcDatPlanObjetivo apo')
            ->innerJoin('o.DatElementos e')
            ->where('apo.idarc =?', $idarc)
            ->addWhere('apo.idplan=?', $idplan)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function ObtenerPlanYObjetivosDadoIdArc($idarc, $idautor)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanObjetivo apo')
            ->where("apo.idarc = $idarc AND apo.idautor = $idautor")
            ->execute();

        return $result->toArray();
    }

    public function ObtenerRelacionPlanArcObj($idplan, $idarc, $idobjetivo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlanObjetivo apo')
            ->where(
                "apo.idplan = $idplan AND apo.idarc = $idarc 
                    AND apo.idobjetivo = $idobjetivo"
            )
            ->execute();
        return $result->toArray();
    }

}

//fin clase 



