<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatElementosDatElementos extends BaseDatElementosDatElementos
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatElementos',
            array('local' => 'idelementopadre', 'foreign' => 'idelemento')
        );
    }

    public function BuscarElementoPadre($idelementohijo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos dede')->where(
            'dede.idelementohijo = ?', $idelementohijo
        )->execute()->toArray();
        return $result;
    }

    public function BuscarElementoPadreOrigen($idelementohijo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos dede')->where(
            'dede.idelementohijo = ? AND (dede.origen = 0 OR dede.origen = 4) ',
            $idelementohijo
        )->execute()->toArray();
        return $result;
    }

    public function BuscarElementosHijos(
        $idelementopadre, $arrayidtipoelemento, $arrayorigen, $idautorrelacion
    ) {
        $cadenatipoel = " (";
        $operator = " OR ";
        $totalidel = count($arrayidtipoelemento);
        foreach ($arrayidtipoelemento as $key => $idtipoel) {
            $idtipoelemento = $idtipoel['idtipoelemento'];
            if ($key == $totalidel - 1) {
                $operator = " ";
            }
            $cadenatipoel .= " e.idtipoelemento = '$idtipoelemento' "
                . $operator;
        }
        $cadenatipoel .= ")";
        $cadenaorigen = " AND (";
        $operator = " OR ";
        $totalorigen = count($arrayorigen);
        foreach ($arrayorigen as $key => $origen) {
            $origen = $origen['origen'];
            if ($key == $totalorigen - 1) {
                $operator = " ";
            }
            $cadenaorigen .= " ee.origen = '$origen' " . $operator;
        }
        $cadenaorigen .= " )";
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
            ON e.idelemento = ee.idelementohijo
            WHERE " . $cadenatipoel . " 
            AND ee.idelementopadre = '$idelementopadre' 
            AND ee.idautor = '$idautorrelacion' "
            . $cadenaorigen;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarDescendenciaDelElemento(
        $idelemento, $tipoelemento, $arrayorigen, $idautorrelacion
    ) {
        $idarraydescendencia = array();
        $descendencia = $this->BuscarElementosHijos(
            $idelemento, $tipoelemento, $arrayorigen, $idautorrelacion
        );
        foreach ($descendencia as $value) {
            $idarraydescendencia [] = $value['idelemento'];
        }
        foreach ($idarraydescendencia as $value) {
            $result = $this->BuscarDescendenciaDelElemento(
                $value, $tipoelemento, $arrayorigen, $idautorrelacion
            );
            $idarraydescendencia = array_merge($idarraydescendencia, $result);
        }
        return $idarraydescendencia;
    }

    public function BuscarActividadesAlPlanSinRepeticion(
        $idactividad, $idplan, $arrayorigen, $idautorrelacion, $arrayestados
    ) {
        $cadenaestado = '';
        if (isset($arrayestados[0])) {
            $cadenaestado .= " AND e.idestadoaprob IN (" . $arrayestados . ") ";
        }
        //empiezo a construir query generel obtener repeticiones de la actividad
        /* $cadenarepeticion = "SELECT distinct r.idelemento
          FROM mod_objetivos.dat_elementos r
          INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
          ON r.idelemento = eer.idelementohijo
          INNER JOIN mod_objetivos.dat_elementos_dat_elementos eeb 
          ON r.idelemento = eeb.idelementohijo
          WHERE r.idtipoelemento = '3' AND eer.origen = '4' 
          AND  eeb.idelementopadre = '$idplan'"; */
        $cadenarepeticion
            = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON r.idelemento = ar.idactividad
            WHERE ar.tiporepeticion IS NOT NULL";
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadenadescendencia
            = "SELECT distinct f.idelemento
            FROM mod_objetivos.dat_elementos f 
            INNER JOIN mod_objetivos.dat_actividades af 
            ON af.idactividad = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
            ON f.idelemento = eef.idelementohijo 
            WHERE (eef.origen = '0' OR eef.origen = '2') 
            AND eef.idelementopadre = e.idelemento ";
        $cadenaorigen = " AND (";
        $operator = " OR ";
        $totalorigen = count($arrayorigen);
        foreach ($arrayorigen as $key => $origen) {
            $origen = $origen['origen'];
            if ($key == $totalorigen - 1) {
                $operator = " ";
            }
            $cadenaorigen .= " ee.origen = '$origen' " . $operator;
        }
        $cadenaorigen .= " )";
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON a.idactividad = e.idelemento
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
                ON e.idelemento = ee.idelementohijo
                WHERE e.idtipoelemento = '3' 
                AND ee.idelementopadre = '$idplan' "
            . $cadenaorigen;
        $cadena
            .= $cadenaestado . " AND e.idelemento NOT IN(" . $cadenarepeticion
            . ") AND e.idelemento NOT IN (" . $cadenadescendencia . ")";
        $connA = Doctrine_Manager:: connection();
        // print_r($cadena);die;
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarActividadesAlFipSinRepeticion($idfip, $arrayorigen)
    {
        //empiezo a construir query generel obtener repeticiones de la actividad
        $cadenarepeticion
            = "SELECT distinct r.idelemento
        FROM mod_objetivos.dat_elementos r
        INNER JOIN mod_objetivos.dat_actividades ar 
        ON ar.idactividad = r.idelemento 
        INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
        ON r.idelemento = eer.idelementohijo
        INNER JOIN mod_objetivos.dat_elementos_dat_elementos eeb 
        ON r.idelemento = eeb.idelementohijo
        WHERE eer.origen = '4' AND  eeb.idelementopadre = '$idfip'";
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadenadescendencia
            = "SELECT distinct f.idelemento
            FROM mod_objetivos.dat_elementos f 
            INNER JOIN mod_objetivos.dat_actividades af 
            ON af.idactividad = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
            ON f.idelemento = eef.idelementohijo 
            WHERE (eef.origen = '0' OR eef.origen = '3') 
            AND eef.idelementopadre = e.idelemento ";
        $cadenaorigen = " AND (";
        $operator = " OR ";
        $totalorigen = count($arrayorigen);
        foreach ($arrayorigen as $key => $origen) {
            $origen = $origen['origen'];
            if ($key == $totalorigen - 1) {
                $operator = " ";
            }
            $cadenaorigen .= " ee.origen = '$origen' " . $operator;
        }
        $cadenaorigen .= " )";
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON a.idactividad = e.idelemento
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
                ON e.idelemento = ee.idelementohijo
                WHERE e.idtipoelemento = '3' 
                AND ee.idelementopadre = '$idfip' "
            . $cadenaorigen;
        $cadena .= " AND e.idelemento NOT IN(" . $cadenarepeticion
            . ") AND e.idelemento NOT IN (" . $cadenadescendencia . ")";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    //busco las desviaciones que se relacionan del objetivo   
    public function BuscarDesviacionesRelacionadas($idobjetivo)
    {
        $cadenaSelect
            = " SELECT * FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_desviacion d
                ON d.iddesviacion = e.idelemento
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
                ON e.idelemento = ee.idelementopadre ";
        $cadenaWhere
            = " WHERE e.idtipoelemento = '6'
                AND ee.idelementohijo = '$idobjetivo'  
                AND ( ee.origen = '3' OR ee.origen = '1' ) ";
        $cadena = $cadenaSelect . $cadenaWhere;
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarObjetivosAlFip($idfip, $arrayorigen)
    {
        //empiezo a construir query generel obtener subojetivos del objetivo
        $cadenadescendencia
            = "SELECT distinct f.idelemento
            FROM mod_objetivos.dat_elementos f 
            INNER JOIN mod_objetivos.dat_objetivo of 
            ON of.idobjetivo = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
            ON f.idelemento = eef.idelementohijo 
            WHERE (eef.origen = '0' OR eef.origen = '3') 
            AND eef.idelementopadre = e.idelemento ";
        $cadenaorigen = " AND (";
        $operator = " OR ";
        $totalorigen = count($arrayorigen);
        foreach ($arrayorigen as $key => $origen) {
            $origen = $origen['origen'];
            if ($key == $totalorigen - 1) {
                $operator = " ";
            }
            $cadenaorigen .= " ee.origen = '$origen' " . $operator;
        }
        $cadenaorigen .= " )";
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_objetivo o 
                ON o.idobjetivo = e.idelemento
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
                ON e.idelemento = ee.idelementohijo
                WHERE e.idtipoelemento = '1' AND ee.idelementopadre = '$idfip' "
            . $cadenaorigen;
        $cadena .= " AND e.idelemento NOT IN (" . $cadenadescendencia . ")";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarActividadesAlArcPlanSinRepeticion(
        $idactividad, $idplan, $idarc, $arrayorigen, $idautorrelacion
    ) {
        //empiezo a construir query generel obtener repeticiones de la actividad
        $cadenarepeticion
            = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON ar.idactividad = r.idelemento 
            WHERE ar.tiporepeticion IS NOT NULL";
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadenadescendencia
            = "SELECT distinct f.idelemento
            FROM mod_objetivos.dat_elementos f 
            INNER JOIN mod_objetivos.dat_actividades af 
            ON af.idactividad = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
            ON f.idelemento = eef.idelementohijo 
            INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apa 
            ON af.idactividad = apa.idactividad
            WHERE (eef.origen = '0' OR eef.origen = '3') 
            AND apa.idplan = '$idplan' AND apa.idarc = '$idarc'";
        $cadenaorigen = " AND (";
        $operator = " OR ";
        $totalorigen = count($arrayorigen);
        foreach ($arrayorigen as $key => $origen) {
            $origen = $origen['origen'];
            if ($key == $totalorigen - 1) {
                $operator = " ";
            }
            $cadenaorigen .= " ee.origen = '$origen' " . $operator;
        }
        $cadenaorigen .= " )";
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_actividades a 
            ON a.idactividad = e.idelemento
            INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apaf 
            ON a.idactividad = apaf.idactividad
            WHERE e.idtipoelemento = '3' AND apaf.idplan = '$idplan' 
            AND apaf.idarc = '$idarc' ";
        $cadena .= " AND e.idelemento NOT IN(" . $cadenarepeticion
            . ") AND e.idelemento NOT IN (" . $cadenadescendencia . ")";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarSubActividadesAlArcPlanSinRepeticion(
        $idactividad, $idplan, $idarc, $arrayorigen, $idautorrelacion
    ) {
        //empiezo a construir query generel obtener repeticiones de la actividad
        $cadenarepeticion
            = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON ar.idactividad = r.idelemento 
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
            ON r.idelemento = eer.idelementohijo
            WHERE eer.origen = '4' AND eer.idelementopadre = '$idactividad'";
        $cadenaorigen = " AND (";
        $operator = " OR ";
        $totalorigen = count($arrayorigen);
        foreach ($arrayorigen as $key => $origen) {
            $origen = $origen['origen'];
            if ($key == $totalorigen - 1) {
                $operator = " ";
            }
            $cadenaorigen .= " ee.origen = '$origen' " . $operator;
        }
        $cadenaorigen .= " )";
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_actividades a 
            ON a.idactividad = e.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
            ON ee.idelementohijo = e.idelemento
            INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades apaf 
            ON a.idactividad = apaf.idactividad
            WHERE e.idtipoelemento = '3' AND apaf.idplan = '$idplan' 
            AND apaf.idarc = '$idarc' AND ee.idelementopadre = '$idactividad'"
            . $cadenaorigen;
        $cadena .= " AND e.idelemento NOT IN(" . $cadenarepeticion . ")";
        //die($cadena);
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarActivHijasDeObjet($idobjetivo, $idautorrelacion)
    {
        $cadena
            = "SELECT r.idelemento FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ra 
            ON r.idelemento = ra.idactividad
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos re 
            ON r.idelemento = re.idelementohijo
            WHERE (re.origen = 3 OR re.origen = 1) 
            AND re.idelementopadre = $idobjetivo 
            AND re.idautor = $idautorrelacion";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    //Dependencias para mostar en relaciones
    public function cargarRelacionesDependencias($idelementohijo)
    {
        $cadena
            = "SELECT *
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            WHERE ee.idelementohijo = {$idelementohijo}
            ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function CargarGridRelaciones($idelementohijo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos dede')->where(
            "dede.idelementohijo = $idelementohijo AND (dede.origen = '1' 
                OR dede.origen = '3' OR dede.origen = '6' OR dede.origen = '7' 
                OR dede.origen = '8')"
        )->execute()->toArray();
        return $result;
    }

    public function CargarGridRelacionesDependencias($idelementohijo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos dede')->where(
            "dede.idelementopadre = $idelementohijo AND (dede.origen = '1' 
                OR dede.origen = '3' OR dede.origen = '6' OR dede.origen = '7' 
                OR dede.origen = '8')"
        )->execute()->toArray();
        return $result;
    }


    public function repeticionesPorActividad($original)
    {
      $query = new Doctrine_Query();
      $result = $query->from('DatElementosDatElementos dede')->where(
        "dede.idelementopadre = $original AND (dede.origen = '4')"
      )->execute()->toArray();
      return $result;
    }

    public function BuscarElementos($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos dede')->where(
            "dede.idelementohijo = $idelemento 
                OR dede.idelementopadre = $idelemento"
        )->execute()->toArray();
        return $result;
    }

    public function BuscarElementosHijo($idelementopadre)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('DatElementosDatElementos dede')->where(
                'dede.idelementopadre = ?', $idelementopadre
            )->execute();
            //$dh = Doctrine_Manager::getInstance();
            //$conn = $dh->getCurrentConnection();            
            //$conn->commit ();
            //$conn->beginTransaction (); 
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function BuscarElementosHijoMismoTipo($idelementopadre)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos dede')->where(
            "dede.idelementopadre = $idelementopadre and dede.origen in (0, 3)"
        )->execute();
        return $result->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos')->limit($limite = 10)
            ->offset($inicio = 0)->execute();
        return $result->toArray();
    }




    public function EsPadredeActividad($idelementopadre, $origen, $datos)
    {
        $query = new Doctrine_Query();
        $fechainicio = $datos->fechainicio;
        $fechafin = $datos->fechafin;
        $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
        $fechafinD = $datos->arraydatosreporte['fechafinD'];
        $idplan = $datos->idplan;
        $arrayestados = implode(',', $datos->arrayestados);
        $arrayidautores = implode(',', $datos->arrayidautores);
        $arrayidinvolucrados = implode(',', $datos->arrayidinvolucrados);
        $arrayidnom = implode(',', $datos->arrayidnom);
        $joininvolaut = "";
        $joinnom = "";
        $cadena = "";
        if ($idplan != null) {
            $joinplan = " AND ee.idelementopadre  = '$idplan'";
        }
        $joinplan = ")";
        if (isset($arrayidautores[0]) || isset($arrayidinvolucrados[0])) {
            if (isset($arrayidautores[0])) {
                $cadenaautoresinvol
                    = " AND (de.idusuariocrea IN (" . $arrayidautores . ")";
                if (isset($arrayidinvolucrados[0])) {
                    $cadenaautoresinvol .= " OR ";
                }
            }
            if (isset($arrayidinvolucrados[0])) {
                if (!isset($arrayidautores[0])) {
                    $cadenaautoresinvol = " AND ";
                }
                $joininvolaut
                    = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados 
                        ei ON ei.idelemento = de.idelemento ";
                $cadenaautoresinvol
                    .= " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
            }
            $cadenaautoresinvol .= (isset($arrayidautores[0])) ? ")" : "";
        }
        //cadena sql con los estados en que puedo ver el documento 		
        if (isset($arrayestados[0])) {
            $cadenaestados .= " AND de.idestadoaprob IN (" . $arrayestados
                . ")";
        }
        //cadena sql con los nomencladores  	   		   	
        if (isset($arrayidnom[0])) {
            $joinnom
                = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en 
                    ON de.idelemento = en.idelemento ";
            $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
        }
        $cadena
            .= " SELECT DISTINCT e.idelementohijo, a.fechainicio FROM  mod_objetivos.dat_elementos_dat_elementos e
                    INNER JOIN mod_objetivos.dat_elementos de 
                    ON (de.idelemento=e.idelementohijo "
            . ($joinplan) . "
                    INNER JOIN mod_objetivos.dat_actividades a 
                    ON (a.idactividad = de.idelemento 
                    --AND a.suspendida=0
                    ) 
                    " . ($joininvolaut . $joinnom) . "
                    WHERE e.idelementopadre = {$idelementopadre} 
                        AND e.origen = {$origen} ";
        if ($fechainicio != null) {
            $cadena
                .= " AND ( (a.fechainicio <= '$fechainicio'
                AND a.fechafin >= '$fechainicio') ";
            if ($fechafin != null) {
                $cadena
                    .= " OR (a.fechainicio <= '$fechafin'
                    AND a.fechafin >= '$fechafin')
                    OR (a.fechainicio >= '$fechainicio' 
                        AND a.fechafin <= '$fechafin')";
            }
            $cadena .= ")";
        }
        if ($fechafin != null && $fechainicio == null) {
            $cadena
                .= " AND (a.fechainicio <= '$fechafin'
                AND a.fechafin >= '$fechafin')";
        }
        if ($fechainicioD != null) {
            $cadena
                .= " AND ( (a.fechainicio <= '$fechainicioD'
                AND a.fechafin >= '$fechainicioD') ";
            if ($fechafinD != null) {
                $cadena
                    .= " OR (a.fechainicio <= '$fechafinD'
                    AND a.fechafin >= '$fechafinD')
                    OR (a.fechainicio >= '$fechainicioD' 
                        AND a.fechafin <= '$fechafinD')";
            }
            $cadena .= ")";
        }
        if ($fechafinD != null && $fechainicioD == null) {
            $cadena
                .= " AND (a.fechainicio <= '$fechafinD'
                AND a.fechafin >= '$fechafinD')";
        }

        $cadena = $cadena . $cadenaautoresinvol . $cadenaestados . $cadenanom;

        $cadena .= " ORDER BY a.fechainicio";

        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute(
           $cadena
        );
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function EsHijadeActividad($idelementohijo, $origen)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->addWhere(
            "e.idelementohijo = $idelementohijo AND e.origen = $origen"
        )->execute();
        return $result->toArray();
    }

    public function EsElementoHijo($idelementohijo)
    {
        $origen = 0;
        $origenA = 3;
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->where(
            "e.idelementohijo = $idelementohijo AND (e.origen = $origen 
                OR e.origen = $origenA)"
        )->execute();
        return $result->toArray();
    }

    public function EsElementoP($idelementopadre)
    {
        $origen = 0;
        $origenA = 3;
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->where(
            "e.idelementopadre = $idelementopadre AND (e.origen = $origen 
                OR e.origen = $origenA)"
        )->execute();
        return $result->toArray();
    }

    public function EsElementoPadre($idelementopadre)
    {
        $origen = 0;
        $origenA = 3;
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->innerJoin(
            'e.DatElementos d'
        )->where(
            "e.idelementopadre = $idelementopadre AND (e.origen = $origen 
                OR e.origen = $origenA)"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function Eliminar($idelementopadre, $idelementohijo)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatElementosDatElementos')->from(
            'DatElementosDatElementos e'
        )->where(
            'e.idelementopadre = ? AND e.idelementohijo = ?',
            array($idelementopadre, $idelementohijo)
        )->execute();
        return $result;
    }

    public function EliminarDesviacionRelacionada($idelementopadre)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatElementosDatElementos e')
            ->where('e.idelementopadre = ?', $idelementopadre)
            ->execute();
    }

    public function EliminarAsosiacionDesviacionElementos($idelemento)
    {
        $consulta
            = "DELETE  FROM mod_objetivos.dat_elementos_dat_elementos
            elem_elem
            WHERE elem_elem.idelementopadre IN 
            (SELECT  distinct elem_elem.idelementopadre
            FROM mod_objetivos.dat_elementos_dat_elementos elem_elem
            INNER JOIN mod_objetivos.dat_elementos e 
            ON elem_elem.idelementohijo = e.idelemento
            WHERE elem_elem.idelementopadre = '$idelemento' AND
            (e.idtipoelemento = 0 OR e.idtipoelemento = 1 
            OR e.idtipoelemento = 3)) AND
            elem_elem.idelementohijo IN 
            (SELECT  distinct elem_elem.idelementohijo
            FROM mod_objetivos.dat_elementos_dat_elementos elem_elem
            INNER JOIN mod_objetivos.dat_elementos e 
            ON elem_elem.idelementohijo = e.idelemento
            WHERE elem_elem.idelementopadre = '$idelemento' AND
            (e.idtipoelemento = 0 OR e.idtipoelemento = 1 
            OR e.idtipoelemento = 3))";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
    }

    //funcion creada para ser utilizada desde el componente de Planes
    public function DesasociarDesviacionElementos($idelemento)
    {
        $consulta
            = "DELETE  FROM mod_objetivos.dat_elementos_dat_elementos
            elem_elem
            WHERE elem_elem.idelementohijo = '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function EliminarRelaciones($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatElementosDatElementos')->from(
            'DatElementosDatElementos e'
        )->where(
            'e.idelementopadre = ? OR e.idelementohijo = ?',
            array($idelemento, $idelemento)
        )->execute();
        return $result;
    }

    public function ElementosRelacionados($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->where(
            'e.idelementopadre = ?', $idelemento
        )->execute();
        return $result->toArray();
    }

    public function IsHijo($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos')->where(
            "idelementohijo = ?", $idelemento
        )->execute();
        return $result->toArray();
    }

    public function isPadre($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->where(
            "e.idelementopadre = ? AND origen = 0", $idelemento
        )->execute();
        return $result->toArray();
    }

    public function BuscarPadreHijo($idelementopadre, $idelementohijo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->where(
            'e.idelementopadre = ? AND e.idelementohijo = ?',
            array($idelementopadre, $idelementohijo)
        )->execute();
        return $result->toArray();
    }

    public function DameElementoPadreMismaEspecie($idelementohijo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->where(
            "e.idelementohijo = $idelementohijo AND e.origen = '0'"
        )->execute();
        return $result->toArray();
    }

    public function ObtenerRepeticiones($idactividad)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos_dat_elementos ee
                WHERE ee.idelementopadre = '$idactividad' AND ee.origen = 4";
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function ObtenerReasignacionesDadoActividad($idelementopadre)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->where(
            "e.idelementopadre = $idelementopadre AND e.origen = '5'"
        )->execute();
        return $result->toArray();
    }

    public function ObtenerReasignacionesDadoIdAutor($idelementopadre, $idautor)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->where(
            "e.idelementopadre = $idelementopadre AND e.origen = '5' 
                AND e.idautor = '$idautor'"
        )->execute();
        return $result->toArray();
    }

    public function VerSiEsPadre($idelemento)
    {
        $origen = 0;
        //TODO revisar esto con Nestor 
        $origenA = 4; //4
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')
            ->where(
                "e.idelementopadre = $idelemento AND (e.origen = $origen 
                    OR e.origen = $origenA)"
            )
            ->execute();
        return $result->toArray();
    }

    public function ElementosHijoDadoIdPadre($idelemento, $idusuario)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')
            ->where(
                "e.idelementopadre = $idelemento AND e.idautor = $idusuario"
            )
            ->execute();
        return $result->toArray();
    }

  public function ElementosHijosDadoIdPadre($idelemento, $idusuariocrea)
  {
    $consulta
            = " SELECT ee.idelementohijo, e.idtipoelemento
                FROM mod_objetivos.dat_elementos_dat_elementos ee
                INNER JOIN mod_objetivos.dat_elementos e
                ON ee.idelementohijo=e.idelemento
                
                INNER JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                
                INNER JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado)
                
                where ee.idelementopadre=$idelemento AND ee.origen IN (0,1,2,3)
                AND (e.idusuariocrea=$idusuariocrea OR i.idusuario=$idusuariocrea)
                ; ";
//    print_r($consulta);die;
    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($consulta);
    $result = $res->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  public function HijosDadoIdPadre($idelemento, $idusuariocrea)
  {
    $consulta
      = " SELECT ee.idelementohijo, e.idtipoelemento
                FROM mod_objetivos.dat_elementos_dat_elementos ee
                INNER JOIN mod_objetivos.dat_elementos e
                ON ee.idelementohijo=e.idelemento
                
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento)   
                where ee.idelementopadre=$idelemento AND ee.origen IN (0,1,2,3)
                ; ";
//    print_r($consulta);die;
    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($consulta);
    $result = $res->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

    public function ElementosRelacionadosDadoIdElemento($idelemento, $idusuario)
    {
        $result = Doctrine_Query::create()
            ->from('DatElementosDatElementos dat')
            ->where(
                "((dat.idautor = $idusuario AND dat.idelementopadre = $idelemento) 
                AND (dat.origen = '4' OR dat.origen = '0' OR dat.origen = '1'))
                OR (dat.idelementohijo = $idelemento AND dat.origen = '1' 
                AND dat.idautor = $idusuario)"
            )
            ->execute();
        return $result->toArray();
    }

    public function BuscarElementospadres($idelementohijo)
    {
        $origen = 1;
        $origenA = 3;
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos e')->innerJoin(
            'e.DatElementos d'
        )->where(
            "e.idelementohijo = $idelementohijo AND (e.origen = $origen 
                OR e.origen = $origenA)"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function BuscarSubObjetivosAlArcPlan(
        $idobjetivopadre, $idplan, $idarc
    ) {
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadena
            = "SELECT distinct f.idelemento,*
            FROM mod_objetivos.dat_elementos f 
            INNER JOIN mod_objetivos.dat_objetivo of 
            ON of.idobjetivo = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
            ON f.idelemento = eef.idelementohijo 
            INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo apof 
            ON apof.idobjetivo = of.idobjetivo
            WHERE (eef.origen = '0' OR eef.origen = '3') 
            AND eef.idelementopadre = '$idobjetivopadre'
            AND apof.idplan = '$idplan' AND apof.idarc = '$idarc'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarObjetivosAlPlan($idplan)
    {
        $cadena
            = "SELECT distinct f.idelemento ,*
            FROM mod_objetivos.dat_elementos f
            INNER JOIN mod_objetivos.dat_objetivo of
            ON of.idobjetivo = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef
            ON f.idelemento = eef.idelementohijo
            WHERE (eef.origen = '0'
            OR eef.origen = '3'
            OR eef.origen = '1')
            AND eef.idelementopadre ='$idplan'";
        $connA = Doctrine_Manager:: connection();
//        print_r($cadena);die;
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarObjetivosEnArcAlPlan($idplan)
    {
        $cadena
            = "SELECT distinct f.idelemento,*
            FROM mod_objetivos.dat_elementos f
            INNER JOIN mod_objetivos.dat_objetivo of
            ON of.idobjetivo = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef
            ON f.idelemento = eef.idelementohijo
            INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo apof
            ON apof.idobjetivo = of.idobjetivo
            WHERE (eef.origen = '0' OR eef.origen = '1' OR eef.origen = '3')
            AND apof.idplan = '$idplan'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarSubObjetivosAlFIP($idobjetivopadre, $idfip)
    {
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadena
            = "SELECT distinct f.idelemento,*
            FROM mod_objetivos.dat_elementos f 
            INNER JOIN mod_objetivos.dat_objetivo of 
            ON of.idobjetivo = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
            ON f.idelemento = eef.idelementohijo 
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
            ON f.idelemento = eer.idelementohijo
            WHERE (eef.origen = '0' OR eef.origen = '3') 
            AND eef.idelementopadre = '$idfip'
            AND ((eef.origen = '1' OR eef.origen = '3') 
            AND eer.idelementopadre = '$idobjetivopadre')";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarSubActividadesAlElementoPadre(
        $idactividadpadre, $idelementopadre
    ) {
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadena
            = "SELECT distinct f.idelemento,*
            FROM mod_objetivos.dat_elementos f 
            INNER JOIN mod_objetivos.dat_actividades af 
            ON af.idactividad = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
            ON f.idelemento = eef.idelementohijo ";
        if ($idelementopadre) {
            $cadena
                .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                eer ON f.idelemento = eer.idelementohijo ";
        }
        $cadena
            .= " WHERE (eef.origen = '0' OR eef.origen = '2')
            AND eef.idelementopadre = '$idactividadpadre' ";
        if ($idelementopadre) {
            $cadena .= " AND eer.idelementopadre = '$idelementopadre'";
        }
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarSubObjetivos($idobjetivopadre)
    {
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadena
            = "SELECT distinct f.idelemento,*
                FROM mod_objetivos.dat_elementos f 
                INNER JOIN mod_objetivos.dat_objetivo of 
                ON of.idobjetivo = f.idelemento
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
                ON f.idelemento = eef.idelementohijo 
                WHERE (eef.origen = '0' OR eef.origen = '3') 
                AND eef.idelementopadre = '$idobjetivopadre' ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarSubFips($idfippadre)
    {
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadena
            = "SELECT distinct f.idelemento,*
                FROM mod_objetivos.dat_elementos f 
                INNER JOIN mod_objetivos.dat_fip ff 
                ON ff.idfip = f.idelemento
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
                ON f.idelemento = eef.idelementohijo 
                WHERE (eef.origen = '0' OR eef.origen = '3') 
                AND eef.idelementopadre = '$idfippadre' ";

        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function BuscarActividadesTributanElementos(
        $idelementopadre, $idtipoelemento
    ) {
        //empiezo a construir query generel obtener subactividades de la actividad
        $cadena
            = "SELECT distinct f.idelemento,*
            FROM mod_objetivos.dat_elementos f 
            INNER JOIN mod_objetivos.dat_objetivo of 
            ON of.idobjetivo = f.idelemento
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eef 
            ON f.idelemento = eef.idelementohijo 
            WHERE (eef.origen = '0' OR eef.origen = '3') 
            AND eef.idelementopadre = '$idobjetivopadre' ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    public function CargarGridReasignaciones(
        $idelementopadre, $idautor, $limit, $start
    ) {
        /* $connA 	= Doctrine_Manager :: connection();
          $cadena = "SELECT distinct(e.idelemento),
          e.fechacreacion AS fechareasignacion ,i.tipoinvolucrado,
          i.idusuario,i.idgrupo, g.dengrupo
          FROM mod_objetivos.dat_elementos_dat_elementos ee
          INNER JOIN mod_objetivos.dat_elementos e 
          ON ee.idelementohijo = e.idelemento
          INNER JOIN mod_objetivos.dat_actividades a 
          ON e.idelemento = a.idactividad
          INNER JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
          ON e.idelemento = ei.idelemento
          INNER JOIN mod_objetivos.dat_involucrados i 
          ON ei.idinvolucrado = i.idinvolucrado
          LEFT JOIN mod_objetivos.dat_grupo g ON i.idgrupo = g.idgrupo
          WHERE ee.idelementopadre = '$idelementopadre' 
          AND ee.origen = '5' AND ee.idautor = '$idautor'
          LIMIT(".$limit.") OFFSET(".$start.")";
          $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
          return $result; */
        $query = new Doctrine_Query();
        $result = $query->select(
            'e.fechacreacion,dede.idautor,ei.idinvolucrado,i.idgrupo,
                i.idusuario,i.tipoinvolucrado'
        )
            ->from('DatElementosDatElementos dede')
            ->innerJoin(
                'dede.DatElementos e ON dede.idelementohijo = e.idelemento'
            )
            ->innerJoin('e.DatElementosDatInvolucrados ei')
            ->innerJoin('ei.DatInvolucrados i')
            ->where(
                "dede.idelementopadre = $idelementopadre AND dede.origen = '5' 
                    AND dede.idautor = $idautor"
            )
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

  public function CargarGridReasignacionesALL(
    $idelementopadre
  ) {
    /* $connA 	= Doctrine_Manager :: connection();
      $cadena = "SELECT distinct(e.idelemento),
      e.fechacreacion AS fechareasignacion ,i.tipoinvolucrado,
      i.idusuario,i.idgrupo, g.dengrupo
      FROM mod_objetivos.dat_elementos_dat_elementos ee
      INNER JOIN mod_objetivos.dat_elementos e
      ON ee.idelementohijo = e.idelemento
      INNER JOIN mod_objetivos.dat_actividades a
      ON e.idelemento = a.idactividad
      INNER JOIN mod_objetivos.dat_elementos_dat_involucrados ei
      ON e.idelemento = ei.idelemento
      INNER JOIN mod_objetivos.dat_involucrados i
      ON ei.idinvolucrado = i.idinvolucrado
      LEFT JOIN mod_objetivos.dat_grupo g ON i.idgrupo = g.idgrupo
      WHERE ee.idelementopadre = '$idelementopadre'
      AND ee.origen = '5' AND ee.idautor = '$idautor'
      LIMIT(".$limit.") OFFSET(".$start.")";
      $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
      return $result; */
    $query = new Doctrine_Query();
    $result = $query->select(
      'e.fechacreacion,dede.idautor,ei.idinvolucrado,i.idgrupo,
                i.idusuario,i.tipoinvolucrado'
    )
                    ->from('DatElementosDatElementos dede')
                    ->innerJoin(
                      'dede.DatElementos e ON dede.idelementohijo = e.idelemento'
                    )
                    ->innerJoin('e.DatElementosDatInvolucrados ei')
                    ->innerJoin('ei.DatInvolucrados i')
                    ->where(
                      "dede.idelementopadre = $idelementopadre AND dede.origen = '5' 
                    "
                    )
//                    ->limit($limit)
//                    ->offset($start)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
    return $result;
  }

    public function ExisteRelacionEntreElementos($elementoA, $elementoB)
    {
        $result = Doctrine_Query::create()
            ->from('DatElementosDatElementos dat')
            ->where(
                "(dat.idelementopadre = $idelementoA 
                    AND dat.idelementohijo = $idelementoB) 
                    OR (dat.idelementopadre = $idelementoB 
                    AND dat.idelementohijo = $idelementoA) "
            )
            ->execute();
        return $result->toArray();
    }

    public function devolverHijos($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->select('dede.*')
            ->from('DatElementosDatElementos dede')
            ->where(
                "dede.idelementopadre = $idelemento 
                    AND (dede.origen = 1 OR dede.origen = 3) "
            )
            ->execute();
        return $result->toArray();
    }

    public function devolverPadres($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->select('dede.*')
            ->from('DatElementosDatElementos dede')
            ->where(
                "dede.idelementohijo = $idelemento 
                    AND (dede.origen = 1 OR dede.origen = 3)"
            )
            ->execute();
        return $result->toArray();
    }

    public function ElementosRelacionadosDifTipos($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->select('de')
            ->from('DatElementosDatElementos dede')
            ->where(
                "dede.idelementopadre = $idelemento 
                    AND (dede.origen = 1 OR dede.origen = 3) "
            )
            ->execute();
        return $result->toArray();
    }

    // por lili Adicionar nueva function que devuelva el id del padre de la actividad  
    public function IdPadreActividad($idelementohi)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT e.idelementopadre, (SELECT a.fechainicio
            FROM mod_objetivos.dat_actividades a
               WHERE a.idactividad = e.idelementopadre ) as fechai, 
               (SELECT a.fechafin FROM mod_objetivos.dat_actividades a
               WHERE a.idactividad = e.idelementopadre ) as fechaf 
               FROM  mod_objetivos.dat_elementos_dat_elementos e
               INNER JOIN mod_objetivos.dat_elementos de 
               ON de.idelemento=e.idelementohijo
               INNER JOIN mod_objetivos.dat_actividades a 
               ON a.idactividad = de.idelemento 
               WHERE e.idelementohijo = '$idelementohi' AND e.origen = 4 ";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    // por lili function buscar si est'a id
    public function BuscarSiEstaId($id, $arrayid)
    {
        $var = false;
        foreach ($arrayid as $key) {
            if ($key == $id) {
                $var = true;
            }
        }
        return $var;
    }

    public function ContarElementosDadoId($idelemento)
    {
        $cadena
            = "SELECT COUNT(*)
        FROM mod_objetivos.dat_elementos_dat_elementos ee
        WHERE ee.idelementopadre = '$idelemento'
        OR ee.idelementohijo = '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function RetornarElementosDadoId($idelemento)
    {
        $cadena
            = "SELECT ee.idelementopadre
        FROM mod_objetivos.dat_elementos_dat_elementos ee
        WHERE ee.idelementohijo = '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function ContarElementosRelacionados($idelemento)
    {
        $cadena
            = "SELECT count(*) as cantasociados
               FROM mod_objetivos.dat_elementos_dat_elementos elem_elem
               INNER JOIN mod_objetivos.dat_elementos e 
               ON elem_elem.idelementohijo = e.idelemento
               WHERE elem_elem.idelementopadre = '$idelemento' AND
               e.idtipoelemento = 5";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ContarDocumentosAfectados($idelemento)
    {
        $cadena
            = "SELECT count(*) as cantdocafectados
               FROM mod_objetivos.dat_elementos_dat_elementos elem_elem
               INNER JOIN mod_objetivos.dat_elementos e 
               ON elem_elem.idelementohijo = e.idelemento
               WHERE elem_elem.idelementopadre = '$idelemento' AND
               (e.idtipoelemento = 0 OR e.idtipoelemento = 1 
               OR e.idtipoelemento = 3)";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerDocumentosAfectados($idelemento)
    {
        $cadena
            = "SELECT  distinct e.idelemento, *
               FROM mod_objetivos.dat_elementos e
               INNER JOIN mod_objetivos.dat_elementos_dat_elementos elem_elem 
               ON elem_elem.idelementohijo = e.idelemento
               WHERE elem_elem.idelementopadre = '$idelemento' AND
               (e.idtipoelemento = 0 OR e.idtipoelemento = 1 
               OR e.idtipoelemento = 3)";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObtenerDesviacionesAsociadasAplanes($idelemento)
    {
        $cadena
            = "SELECT  distinct e.idelemento, *
               FROM mod_objetivos.dat_elementos e
               INNER JOIN mod_objetivos.dat_elementos_dat_elementos elem_elem 
               ON elem_elem.idelementopadre = e.idelemento
               WHERE elem_elem.idelementohijo = '$idelemento' 
               AND e.idtipoelemento = 6";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function IDsDeIncidenciasAsociadas($idelemento)
    {
        $cadena
            = "SELECT distinct ee.idelementohijo AS idincidenciaasociada
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            INNER JOIN mod_objetivos.dat_elementos e 
            ON ee.idelementohijo = e.idelemento
            WHERE ee.idelementopadre = '$idelemento'
            AND e.idtipoelemento = 5";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function IDsDeDesviacionAsociadasAIncidenciaDada($idincidencia)
    {
        $cadena
            = "SELECT dat_elementos_dat_elementos.idelementopadre
                AS iddesviacion
                FROM mod_objetivos.dat_elementos_dat_elementos
                WHERE dat_elementos_dat_elementos.idelementohijo = '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function InsertarelementoDadoIdpadreehijo(
        $padre, $hijo, $origen, $idautor
    ) {
        $cadena
            = "INSERT INTO mod_objetivos.dat_elementos_dat_elementos(
            idelementopadre, idelementohijo, origen, idautor)
            VALUES ('$padre', '$hijo','$origen','$idautor')
            ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function InsertarDependencia($parametros)
    {
        $cadena
            = "INSERT INTO mod_objetivos.dat_elementos_dat_elementos(
            idelementopadre, idelementohijo, origen, idautor,porcientoinicio)
         VALUES ('$parametros->idactpadre', '$parametros->idelementohijo',
             '$parametros->origen','$parametros->idusuario',
                 '$parametros->porcientoinicio')";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function EliminarAsociacion($iddesviacion)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatElementosDatElementos')
            ->where("idelementohijo = ?", $iddesviacion)
            ->execute();
        return $result;
    }

    public function buscarPadreHijos($parametros)
    {
        $cadena
            = "SELECT dede.idelementohijo as hijos, dede.porcientoinicio,
            dede.ponderacion,dede.idelementopadre,de.gradocumplimiento
                FROM mod_objetivos.dat_elementos_dat_elementos dede
                INNER JOIN mod_objetivos.dat_elementos de 
                ON de.idelemento = idelementohijo
                WHERE dede.idelementopadre = (SELECT dedel.idelementopadre as padre
                FROM mod_objetivos.dat_elementos_dat_elementos dedel
                INNER JOIN mod_objetivos.dat_elementos del 
                ON dedel.idelementopadre = del.idelemento
                WHERE dedel.idelementohijo = '$parametros->idactividad' 
                AND del.actualizarporciento = 1 AND (dedel.origen = 0 
                OR dedel.origen = 2) LIMIT 1) 
                AND (dede.origen = 0 OR dede.origen = 2)";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarElementosRelacionados($parametros)
    {
        $cadena
            = "SELECT dede.idelementohijo as hijos,dede.idelementopadre,de.gradocumplimiento
                FROM mod_objetivos.dat_elementos_dat_elementos dede
                INNER JOIN mod_objetivos.dat_elementos de 
                ON de.idelemento = idelementohijo
                WHERE dede.idelementopadre = (SELECT dedel.idelementopadre as padre
                    FROM mod_objetivos.dat_elementos_dat_elementos dedel
                INNER JOIN mod_objetivos.dat_elementos del 
                ON dedel.idelementopadre = del.idelemento
                WHERE dedel.idelementohijo = '$parametros->idactividad' 
                AND (dedel.origen = 1 OR dedel.origen = 3) LIMIT 1) 
                AND (dede.origen = 1 OR dede.origen = 3)";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    //devuelve el actualizarporciento de un padre
    public function getAutoManualPadre($idelemento)
    {
        $cadena
            = "SELECT e.actualizarporciento AS autoManualPadre
                FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (ee.idelementopadre = e.idelemento
                AND ee.idelementohijo = '$idelemento'
                AND (ee.origen = 0 OR ee.origen = 2))";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function buscarElementosRelacionadosObj($ideobjetivo)
    {
        $cadena
            = "SELECT dede.idelementohijo as hijos
                    FROM mod_objetivos.dat_elementos_dat_elementos dede
                    WHERE dede.idelementopadre = '$ideobjetivo' 
                        AND (dede.origen = 1 OR dede.origen = 3)";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function setPorcientoRepresentaHijo(
        $idelementohijo, $porcientoelemento
    ) {
        $query = new Doctrine_Query();
        $query->update('DatElementosDatElementos dede')
            ->set('dede.porcientoelemento', '?', "$porcientoelemento")
            ->where("dede.idelementohijo = $idelementohijo")
            ->execute();
    }

    public function ObtenerPorcientoRe($idpadre)
    {
        $cadena
            = "SELECT dede.idelementohijo as hijos, porcientoinicio
                    FROM mod_objetivos.dat_elementos_dat_elementos dede
                    WHERE dede.idelementopadre = '$idpadre'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function BuscarTodasActividadesAlPlanConRepeticion($idplan)
    {
        $cadena
            = "SELECT * FROM mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_actividades a 
                ON a.idactividad = e.idelemento
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee 
                ON e.idelemento = ee.idelementohijo
                WHERE e.idtipoelemento = '3' AND ee.idelementopadre = '$idplan' 
                AND (ee.origen = '3' OR ee.origen = '1')";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resul;
    }

    /*
     * Funcion para buscar las actividades hijas del plan por Dat Elementos y ARC
     */
    public function obtenerActHijasDePlan($parametros, $idplan)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (a.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (a.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect
            = "(SELECT e.idelemento, a.fechafin, e.denelemento, e.gradocumplimiento

                FROM mod_objetivos.dat_elementos_dat_elementos ee

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = ee.idelementohijo AND ee.idelementopadre = {$idplan})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)

                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON (ei.idelemento = e.idelemento )

                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)

                WHERE ( a.fechafin < " . "'" . date('Y-m-d') . "'" . ") AND
                (e.idusuariocrea = {$parametros->idusuario}
                OR i.idusuario = {$parametros->idusuario})
                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF} )

                UNION

                (SELECT e.idelemento, a.fechafin, e.denelemento, e.gradocumplimiento

                FROM mod_objetivos.dat_arc_dat_plan_actividades apa

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = apa.idactividad AND apa.idplan = {$idplan})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON (ei.idelemento = e.idelemento)

                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)

                WHERE ( a.fechafin < " . "'" . date('Y-m-d') . "'" . ") AND
                (e.idusuariocrea = {$parametros->idusuario}
                OR i.idusuario = {$parametros->idusuario})
                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF}) ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para buscar las actividades hijas del plan por Dat Elementos y ARC
     */
    public function actHijasDePlanNom($parametros, $idplan)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (a.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (a.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect
            = "(SELECT e.idelemento, a.fechafin, a.fechainicio, e.denelemento,
                e.gradocumplimiento, e.peso, n.idnomenclador,  n.dennomenclador,
                a.horainicio, a.horafin

                FROM mod_objetivos.dat_elementos_dat_elementos ee

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = ee.idelementohijo AND ee.idelementopadre = {$idplan})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)

                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                ON ( e.idelemento = en.idelemento )

                LEFT JOIN mod_objetivos.nom_nomenclador n
                ON ( n.idnomenclador = en.idnomenclador)

                WHERE n.tiponomenclador = 3
                AND n.idusuariocrea = {$parametros->idusuario}
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaestados}
                {$cadenaFechaI}
                {$cadenaFechaF} )

                UNION

                (SELECT e.idelemento, a.fechafin, a.fechainicio, e.denelemento,
                e.gradocumplimiento, e.peso, n.idnomenclador,  n.dennomenclador,
                a.horainicio, a.horafin

                FROM mod_objetivos.dat_arc_dat_plan_actividades apa

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = apa.idactividad AND apa.idplan = {$idplan})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)

                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                ON ( e.idelemento = en.idelemento )

                LEFT JOIN mod_objetivos.nom_nomenclador n
                ON ( n.idnomenclador = en.idnomenclador )

                WHERE n.tiponomenclador = 3
                AND n.idusuariocrea = {$parametros->idusuario}
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaestados}
                {$cadenaFechaI}
                {$cadenaFechaF} ) ";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para buscar las actividades hijas del plan por Dat Elementos y ARC
     */
    public function actHijasDePlan($parametros, $idplan)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " ( ";
        if (isset($parametros->arrayautores[0])) {
          $cadenainvolucrados
            .= " e.idusuariocrea IN ({$parametros->arrayautores}) ";
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " OR ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
          }
        } elseif (isset($parametros->arrayinvolucrados[0])) {
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
          }
        }
        $cadenainvolucrados
          .= " ) ";

        $joininvolucrados.=" LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON e.idelemento = ei.idelemento ";

      }else{
        $cadenainvolucrados.= " (e.idusuariocrea = {$parametros->idusuario}
                    OR e.idelemento IN (SELECT ei.idelemento
                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
                    LEFT JOIN mod_objetivos.dat_involucrados i
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    WHERE i.idusuario = {$parametros->idusuario})) ";
      }


        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (a.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (a.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect
            = "(SELECT e.idelemento, a.fechafin, a.fechainicio, e.denelemento,
                e.gradocumplimiento, e.peso, a.horainicio, a.horafin,
                a.criterioevaluacion

                FROM mod_objetivos.dat_elementos_dat_elementos ee

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = ee.idelementohijo
                AND ee.idelementopadre = {$idplan})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)
                
                $joininvolucrados

                WHERE {$cadenainvolucrados}

                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF} )

                UNION

                (SELECT e.idelemento, a.fechafin, a.fechainicio, e.denelemento,
                e.gradocumplimiento, e.peso, a.horainicio, a.horafin,
                a.criterioevaluacion

                FROM mod_objetivos.dat_arc_dat_plan_actividades apa

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = apa.idactividad AND apa.idplan = {$idplan})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)
                
                $joininvolucrados

                WHERE {$cadenainvolucrados}

                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF} ) ";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para buscar los objs hijos del plan por Dat Elementos y ARC
     */
    public function obtenerObjHijosDePlan($parametros, $idplan)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " ( ";
        if (isset($parametros->arrayautores[0])) {
          $cadenainvolucrados
            .= " e.idusuariocrea IN ({$parametros->arrayautores}) ";
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " OR ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
          }
        } elseif (isset($parametros->arrayinvolucrados[0])) {
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
          }
        }
        $cadenainvolucrados
          .= " ) ";

        $joininvolucrados.=" LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON e.idelemento = ei.idelemento ";

      }else{
        $cadenainvolucrados.= " (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario})) ";
      }


        if ($parametros->desviacion == 1) {
            if ($parametros->fechainicio != '') {
                $cadenaFechaI
                    = " AND (o.fechafin >= '$parametros->fechainicio') ";
            } else {
                $cadenaFechaI = "";
            }
            if ($parametros->fechafin != '') {
                $cadenaFechaF
                    = " AND (o.fechainicio <= '{$parametros->fechafin}') ";
            } else {
                $cadenaFechaF = "";
            }
        } else {
            $cadenaFechaI = "";
            $cadenaFechaF = "";
        }
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaSelect
            = "(SELECT e.idelemento, o.fechafin, e.denelemento

                FROM mod_objetivos.dat_elementos_dat_elementos ee

                INNER JOIN mod_objetivos.dat_objetivo o
                ON (o.idobjetivo = ee.idelementohijo AND ee.idelementopadre = {$idplan})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (o.idobjetivo = e.idelemento)
                
                $joininvolucrados

                WHERE {$cadenainvolucrados}
                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF})

                UNION

                (SELECT e.idelemento, o.fechafin, e.denelemento

                FROM mod_objetivos.dat_arc_dat_plan_objetivo apo

                INNER JOIN mod_objetivos.dat_objetivo o
                ON (o.idobjetivo = apo.idobjetivo AND apo.idplan = {$idplan})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (o.idobjetivo = e.idelemento)
                
                $joininvolucrados

                WHERE {$cadenainvolucrados}
                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF}) ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /**
     * Funcion obtener todas las actividades relacionadas a un objetivo
     */
    public function obtenerActsHijasDeObj($parametros, $idObjetivo)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (a.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (a.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect
            = "(SELECT e.idelemento, a.fechafin, e.denelemento, e.gradocumplimiento

                FROM mod_objetivos.dat_elementos_dat_elementos ee

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = ee.idelementohijo AND ee.idelementopadre = {$idObjetivo})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)

                WHERE ( a.fechafin < " . "'" . date('Y-m-d') . "'" . ") AND
                (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF})";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /**
     * Funcion obtener todas las actividades relacionadas a un objetivo
     */
    public function actsHijasDeObjNom($parametros, $idObjetivo)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (a.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (a.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect
            = "(SELECT e.idelemento, a.fechafin, a.fechainicio, e.denelemento,
                e.gradocumplimiento, e.peso, n.idnomenclador,  n.dennomenclador,
                a.horainicio, a.horafin

                FROM mod_objetivos.dat_elementos_dat_elementos ee

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = ee.idelementohijo AND ee.idelementopadre = {$idObjetivo})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)

                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                ON ( e.idelemento = en.idelemento )

                LEFT JOIN mod_objetivos.nom_nomenclador n
                ON ( n.idnomenclador = en.idnomenclador )

                WHERE n.tiponomenclador = 3
                AND n.idusuariocrea = {$parametros->idusuario}
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaestados}
                {$cadenaFechaI}
                {$cadenaFechaF} )";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /**
     * Funcion obtener todas las actividades relacionadas a un objetivo
     */
    public function actsHijasDeObj($parametros, $idObjetivo)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " ( ";
        if (isset($parametros->arrayautores[0])) {
          $cadenainvolucrados
            .= " e.idusuariocrea IN ({$parametros->arrayautores}) ";
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " OR ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
          }
        } elseif (isset($parametros->arrayinvolucrados[0])) {
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
          }
        }
        $cadenainvolucrados
          .= " ) ";

        $joininvolucrados.=" LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON e.idelemento = ei.idelemento ";

      }else{
        $cadenainvolucrados.= " (e.idusuariocrea = {$parametros->idusuario}

                    OR e.idelemento IN (SELECT ei.idelemento
                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
                    LEFT JOIN mod_objetivos.dat_involucrados i
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    WHERE i.idusuario = {$parametros->idusuario})) ";
      }

        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (a.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (a.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect
            = "(SELECT e.idelemento, a.fechafin, a.fechainicio, e.denelemento,
                e.gradocumplimiento, e.peso, a.horainicio, a.horafin,
                a.criterioevaluacion

                FROM mod_objetivos.dat_elementos_dat_elementos ee

                INNER JOIN mod_objetivos.dat_actividades a
                ON (a.idactividad = ee.idelementohijo
                AND ee.idelementopadre = {$idObjetivo})

                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento)
                
                $joininvolucrados

                WHERE $cadenainvolucrados
                {$cadenaestados}
                {$cadenaFechaI}
                {$cadenaFechaF} )";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para buscar los hijos inmediatos de un elemento(del mismo tipo)
     */
    public function obtenerHijosInmediatos($idElementopadre)
    {
        $cadena
            = "SELECT ee.idelementohijo
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            WHERE ee.idelementopadre = '$idElementopadre'
            AND (ee.origen = 0 OR ee.origen = 2)";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }

    public function obtenerPadreInmediato($idElementohijo)
    {
        $cadena
            = "SELECT ee.idelementopadre
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            WHERE ee.idelementohijo = '$idElementohijo'
            AND (ee.origen = 0 OR ee.origen = 2)";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }

    /**
     * Funcion para obtener todos los elementos relacionados a una actividad
     */
    public function obtenerElemenRelacionados($idActividad, $tipo)
    {
        $cadena
            = "SELECT ee.idelementopadre
                FROM mod_objetivos.dat_elementos_dat_elementos ee
                INNER JOIN  mod_objetivos.dat_elementos e
                ON(ee.idelementopadre = e.idelemento)
                WHERE ee.idelementohijo = '$idActividad'
                AND e.idtipoelemento = '$tipo'
                AND (ee.origen = 1 OR ee.origen = 3)";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;

    }

    /**
     * Funcion obtener todas las actividades relacionadas a un objetivo
     */
    public function ObtenerActsRelacionadas($idObjetivo)
    {
        $cadena
            = "SELECT ee.idelementohijo
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            INNER JOIN  mod_objetivos.dat_elementos e
            ON(  ee.idelementohijo = e.idelemento)
            WHERE ee.idelementopadre = '$idObjetivo'
            AND e.idtipoelemento = 3
            AND  (ee.origen = 1 OR ee.origen = 3)";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }


    /**
     * Funcion para obtener los planes relacionados a un objetivo por ARC
     */
    public function obtenerPlanRelacionadoObjvoARC($idObjetivo)
    {
        $cadena
            = "SELECT apo.idplan
            FROM mod_objetivos.dat_arc_dat_plan_objetivo apo
            WHERE apo.idobjetivo = '$idObjetivo'";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }

    /**
     * Funcion para obtener los planes relacionados a una actividad por ARC
     */
    public function obtenerPlanRelacionadoARC($idActividad)
    {
        $cadena
            = "SELECT apa.idplan
            FROM mod_objetivos.dat_arc_dat_plan_actividades apa
            WHERE apa.idactividad = '$idActividad'";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }

    /**
     * Funcion para obtener los grados de cumplimiento de los hijos dat-Elem-Elem
     */
    public function obtenerGradoCumpHijosE($idElement)
    {
        $cadena
            = "SELECT e.gradocumplimiento
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            INNER JOIN mod_objetivos.dat_elementos e
            ON(e.idelemento = ee.idelementohijo)
            WHERE ee.idelementopadre = '$idElement'
            AND (ee.origen = 0 OR ee.origen = 1 OR ee.origen = 3) ";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }

    /**
     * Funcion para obtener los grados de cumplimiento de los obj hijos dat-ARC
     */
    public function obtenerGradoCumpObj($idElement)
    {
        $cadena
            = "SELECT   e.gradocumplimiento
                FROM   mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo ao
                ON(e.idelemento = ao.idobjetivo)
                WHERE ao.idplan = '$idElement' ";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }

    /**
     * Funcion para obtener los grados de cumplimiento de las act hijos dat-ARC
     */
    public function obtenerGradoCumpAct($idElement)
    {
        $cadena
            = "SELECT   e.gradocumplimiento
                FROM   mod_objetivos.dat_elementos e
                INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades aa
                ON(e.idelemento = aa.idactividad)
                WHERE aa.idplan = '$idElement' ";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }

    /**
     * Funcion para obtener los padres en las relaciones de una act
     */
    public function obtenerRelacionAct($idAct)
    {
        $cadena
            = "SELECT apa.idplan as idelementopadre
                FROM mod_objetivos.dat_arc_dat_plan_actividades apa
                WHERE  apa.idactividad = '$idAct'
                UNION
                SELECT  ee.idelementopadre
                FROM mod_objetivos.dat_elementos_dat_elementos ee
                WHERE   ee.idelementohijo = '$idAct'
                AND (ee.origen =1 OR ee.origen =3)";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }

    /**
     * Funcion para obtener los padres en las relaciones de una act
     */
    public function obtenerRelacionObj($idObj)
    {
        $cadena
            = "SELECT apa.idplan as idelementopadre
                FROM mod_objetivos.dat_arc_dat_plan_objetivo apa
                WHERE  apa.idobjetivo = '$idObj'
                UNION
                SELECT  ee.idelementopadre
                FROM mod_objetivos.dat_elementos_dat_elementos ee
                WHERE   ee.idelementohijo = '$idObj'
                AND (ee.origen = 1 OR ee.origen = 3)";
        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($cadena);
        $resul = $res->fetchAll(PDO::FETCH_COLUMN);
        return $resul;
    }


}

//fin clase 



