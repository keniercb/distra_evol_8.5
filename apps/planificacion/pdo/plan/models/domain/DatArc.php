<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArc extends BaseDatArc
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatInvolucrados',
            array('local' => 'idarc', 'foreign' => 'idinvolucrado',
                'refClass' => 'DatArcDatInvolucrados')
        );
        $this->hasMany(
            'DatPlanPdo', array('local' => 'idarc', 'foreign' => 'idplan',
                'refClass' => 'DatArcDatPlan')
        );
    }

    /**
     * Consulta que modifica el campo activo
     */
    public function cambiarEstado($node, $estado)
    {
        $query = new Doctrine_Query();
        $query->update('DatArc a')->set('activo', '?', "$estado")->where(
            "a.idarc = $node"
        )->execute();
    }

  public function getArcactividadesAseguran($datos){
    $connA = Doctrine_Manager:: connection();
    $whereplan="";
    if($datos->idplan!='' && $datos->str_idelementos!=""){
      $whereplan=" AND o.idobjetivo in (".$datos->str_idelementos.")";
    }
    if($datos->idplan!='' && $datos->str_idelementos==""){
      return array();
    }
    $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
    $fechafinD = $datos->arraydatosreporte['fechafinD'];
    $arrayidnom = implode(',', $datos->arrayidnom);
    $cadena1  = " SELECT 
                  distinct 
                  ef.idelemento,
                  ef.denelemento, ef.denelemento as actividades , 0 as orden ,
                  to_char(o.fechainicio, 'dd/mm/YYYY') ||' - ' || to_char(o.fechafin, 'dd/mm/YYYY') as plazo,
                  '' AS dirigentes,
                  '' AS participantes
                  FROM mod_objetivos.dat_elementos ef                
                  INNER JOIN mod_objetivos.dat_objetivo o                 ON o.idobjetivo = ef.idelemento   
                  INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (ef.idelemento = ee.idelementopadre ) 
                  INNER JOIN mod_objetivos.dat_actividades a ON (a.idactividad = ee.idelementohijo AND a.suspendida=0)                                                                  
                  LEFT JOIN mod_flujotrabajo.dat_estado es                ON ef.idestadoaprob = es.idestado    
                  
                  LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                  ON (ei.idelemento = ef.idelemento) 
                
                  LEFT JOIN mod_objetivos.dat_involucrados i 
                  ON (ei.idinvolucrado = i.idinvolucrado)
                  
                  LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON ef.idelemento = en.idelemento
                             
                  WHERE 
                    (ef.idusuariocrea = {$datos->idusuariosession} 
                            OR i.idusuario = {$datos->idusuariosession})
                            
                            $whereplan
                  --(                                                                   
                  --((o.fechainicio <= '01-01-2019' AND o.fechafin >= '01-01-2019')  
                  --OR (o.fechainicio <= '31-01-2019'                        AND o.fechafin >= '31-01-2019')                   
                  --OR (o.fechainicio >= '01-01-2019'                         AND o.fechafin <= '31-01-2019'))
                  --and                                                                       
                  --( (a.fechainicio <= '01-02-2019'                    AND a.fechafin >= '01-02-2019')  
                  --OR (a.fechainicio <= '28-02-2019'                        AND a.fechafin >= '28-02-2019')                   
                  --OR (a.fechainicio >= '01-02-2019'                         AND a.fechafin <= '28-02-2019')) )
                                                                                        
                  --AND e.idestadoaprob IN (1000000356,1000000358,1000000362,1000000042,1000000071,1000000357,1000000359,1000000363)
                  ";

    $cadena_where1="";

    $join="";

    $cadena2  = "                   
                  SELECT distinct
                  a.idactividad,
                  ef.denelemento,  
                  e.denelemento as objetivo,    
                  1 as orden ,
                  to_char(a.fechainicio, 'dd/mm/YYYY')  ||' - ' ||  to_char(a.fechafin, 'dd/mm/YYYY') as plazo,
                  e.dirigente AS dirigentes,
                  e.participante AS participantes
                  FROM mod_objetivos.dat_elementos e                
                  INNER JOIN mod_objetivos.dat_actividades a ON (a.idactividad = e.idelemento AND a.suspendida=0)     
                  INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (e.idelemento = ee.idelementohijo ) 
                  INNER JOIN mod_objetivos.dat_elementos ef         on (ef.idelemento = ee.idelementopadre)        
                  INNER JOIN mod_objetivos.dat_objetivo o                 ON (o.idobjetivo = ef.idelemento)
                  
                  LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                  ON (ei.idelemento = ef.idelemento) 
                
                  LEFT JOIN mod_objetivos.dat_involucrados i 
                  ON (ei.idinvolucrado = i.idinvolucrado) 
                  
                  LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON ef.idelemento = en.idelemento
                  
                  WHERE 
                    (ef.idusuariocrea = {$datos->idusuariosession} 
                            OR i.idusuario = {$datos->idusuariosession})
                            
                            $whereplan
                      
                  -- where 
                  --( (a.fechainicio <= '01-02-2019'                    AND a.fechafin >= '01-02-2019')  
                  --OR (a.fechainicio <= '28-02-2019'                        AND a.fechafin >= '28-02-2019')                   
                  --OR (a.fechainicio >= '01-02-2019'                         AND a.fechafin <= '28-02-2019')) 
                  --AND e.idestadoaprob IN (1000000356,1000000358,1000000362,1000000042,1000000071,1000000357,1000000359,1000000363)
                 ";

    $cadena_where2="";

    if ($fechainicioD != null && $fechafinD != null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where2 .= ($cadena_where2=="")?"":" AND ";

      $cadena_where1 .=" (                                                                   
            ((o.fechainicio <= '$fechainicioD' AND o.fechafin >= '$fechainicioD')  
            OR (o.fechainicio <= '$fechafinD'                        AND o.fechafin >= '$fechafinD')                   
            OR (o.fechainicio >= '$fechainicioD'                         AND o.fechafin <= '$fechafinD'))
            and                                                                       
            ( (a.fechainicio <= '$fechainicioD'                    AND a.fechafin >= '$fechainicioD')  
            OR (a.fechainicio <= '$fechafinD'                        AND a.fechafin >= '$fechafinD')                   
            OR (a.fechainicio >= '$fechainicioD'                         AND a.fechafin <= '$fechafinD')) ) ";

      $cadena_where2 .=" (                                                                   
            ((o.fechainicio <= '$fechainicioD' AND o.fechafin >= '$fechainicioD')  
            OR (o.fechainicio <= '$fechafinD'                        AND o.fechafin >= '$fechafinD')                   
            OR (o.fechainicio >= '$fechainicioD'                         AND o.fechafin <= '$fechafinD'))
            and                                                                       
            ( (a.fechainicio <= '$fechainicioD'                    AND a.fechafin >= '$fechainicioD')  
            OR (a.fechainicio <= '$fechafinD'                        AND a.fechafin >= '$fechafinD')                   
            OR (a.fechainicio >= '$fechainicioD'                         AND a.fechafin <= '$fechafinD')) ) ";

    }

    if ($fechainicioD != null && $fechafinD == null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where2 .= ($cadena_where2=="")?"":" AND ";

      $cadena_where1 .=" (                                                                   
            ((o.fechainicio <= '$fechainicioD' AND o.fechafin >= '$fechainicioD')        
            OR o.fechainicio >= '$fechainicioD')
            and                                                                       
            ( (a.fechainicio <= '$fechainicioD'                    AND a.fechafin >= '$fechainicioD')                
            OR a.fechainicio >= '$fechainicioD' ) ) ";

      $cadena_where2 .=" (                                                                   
            ((o.fechainicio <= '$fechainicioD' AND o.fechafin >= '$fechainicioD')        
            OR o.fechainicio >= '$fechainicioD')
            and                                                                       
            ( (a.fechainicio <= '$fechainicioD'                    AND a.fechafin >= '$fechainicioD')                
            OR a.fechainicio >= '$fechainicioD' ) ) ";

    }

    if ($fechainicioD == null && $fechafinD != null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where2 .= ($cadena_where2=="")?"":" AND ";

      $cadena_where1 .=" (                                                                   
            (
            OR (o.fechainicio <= '$fechafinD'                        AND o.fechafin >= '$fechafinD')                   
            OR  o.fechafin <= '$fechafinD')
            and                                                                       
            (  
            OR (a.fechainicio <= '$fechafinD'                        AND a.fechafin >= '$fechafinD')                   
            OR a.fechafin <= '$fechafinD') ) ";

      $cadena_where2 .=" (                                                                   
            (
            OR (o.fechainicio <= '$fechafinD'                        AND o.fechafin >= '$fechafinD')                   
            OR  o.fechafin <= '$fechafinD')
            and                                                                       
            (  
            OR (a.fechainicio <= '$fechafinD'                        AND a.fechafin >= '$fechafinD')                   
            OR a.fechafin <= '$fechafinD') ) ";

    }

    if (isset($arrayidnom[0])) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where2 .= ($cadena_where2=="")?"":" AND ";
      $cadena_where1 .= ' en.idnomenclador IN (' . $arrayidnom . ')';
      $cadena_where2 .= ' en.idnomenclador IN (' . $arrayidnom . ')';
    }

    /***
    Excluir las repeticiones
     **/

    $cadena_where1 .= ($cadena_where1=="")?" a.tiporepeticion IS NULL ":" AND a.tiporepeticion IS NULL ";
    $cadena_where2 .= ($cadena_where2=="")?" a.tiporepeticion IS NULL ":" AND a.tiporepeticion IS NULL ";


    $order_by=" order by denelemento,orden,actividades ";
    $cadena_where1=($cadena_where1=="")?"":" AND ".$cadena_where1;
    $cadena_where2=($cadena_where2=="")?"":" AND ".$cadena_where2;
    $cadena=$cadena1 . $join . $cadena_where1 . " union " . $cadena2 . $join . $cadena_where2 .$order_by;
//    print_r($cadena);die;
    $res = $connA->execute($cadena);
    $result = $res->fetchAll();
    return $result;
  }

    /**
     * Consulta que retorna un array de arc que coinciden con el nombre, y el idusuariocrea
     */
    public function ExisteArcNombre($idusuariocrea, $denarc)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArc a')
            ->where("a.denarc =?", $denarc)
            ->addWhere("a.idusuariocrea =?", $idusuariocrea)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna un array de arc para mostrar en el grid
     */
    public function ObtenerAreas(
        $idarc, $start, $limit, $arrayautoresact, $arrayinvolact,
        $arrayelementosrelacionados, $filtros
    )
    {
        $cadenaautoresinvol = '';
        //cadena sql con autores para sentencia final
        if (isset($arrayautoresact[0])) {
            $cadenaautoresinvol = " ((";
            $totalaut = count($arrayautoresact);
            $operator = " OR ";
            foreach ($arrayautoresact as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (a.idusuariocrea = '$idusuariocrea') "
                    . $operator;
            }
            $cadenaautoresinvol .= ") ";
            if (isset($arrayinvolact[0])) {
                $cadenaautoresinvol .= " OR ";
            } else {
                $cadenaautoresinvol .= ")";
            }
        }
        //cadena sql con involucrados para sentencia final
        if (isset($arrayinvolact[0])) {
            //if(!$arrayautoresact[0]){$cadenaautoresinvol.= " AND ";}
            $cadenaautoresinvol .= " (";
            $totalinvol = count($arrayinvolact);
            $operator = " OR ";
            foreach ($arrayinvolact as $key => $invol) {
                $llaveinvolucrado = $invol['llaveinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (ai.llaveinvolucrado = '$llaveinvolucrado') "
                    . $operator;
            }
            $cadenaautoresinvol .= ") ";
            if ($arrayautoresact[0]) {
                $cadenaautoresinvol .= ") ";
            }
        }
        //tratamientos de filtros
        $addwhere = "";
        //$arrayParams = array();
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos ['field'] == 'idarea') {
                    $addwhere = $addwhere . "AND a.uriidarc LIKE '%"
                        . $datos ['data'] ['value'] . "%'";
                } elseif ($datos ['field'] == 'denom') {
                    $addwhere
                        = $addwhere . " AND upper(a.denarc) LIKE '%"
                        . strtoupper(
                            $datos ['data'] ['value']
                        ) . "%'";
                } elseif ($datos ['field'] == 'fdesde') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta la fecha como un entero
                    $arrayfechainicio = explode(' ', $datos ['data'] ['value']);
                    $fechainicio = explode('-', $arrayfechainicio[0]);
                    $addwhere = $addwhere . " AND a.fechainicio {$cond} '"
                        . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                        . $fechainicio[2] . "'";
                } elseif ($datos ['field'] == 'fhasta') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta la fecha como un entero
                    $arrayfechafin = explode(' ', $datos ['data'] ['value']);
                    $fechafin = explode('-', $arrayfechafin[0]);
                    $addwhere
                        = $addwhere . " AND a.fechafin {$cond} '" . $fechafin[0]
                        . '-' . $fechafin[1] . '-' . $fechafin[2] . "'";
                } elseif ($datos ['field'] == 'activo') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $addwhere = $addwhere . " AND a.activo = '1' ";
                    } else {
                        $addwhere = $addwhere . " AND a.activo = '0' ";
                    }
                }
            }
        }
        $cadena
            = "SELECT distinct(a.idarc),a.idarc AS idarea,a.denarc AS denom,
                a.descrip,a.idarcp,a.fechainicio AS fdesde,
                a.fechafin AS fhasta,a.activo,a.idusuariocrea AS autor,a.caduca, a.escapitulo, 
                a.orden,u.nombreusuario as denominacionautor
                FROM mod_objetivos.dat_arc a
                LEFT JOIN mod_objetivos.dat_arc_dat_involucrados ai 
                ON ai.idarc = a.idarc 
                left join mod_seguridad.seg_usuario u on (u.idusuario = a.idusuariocrea)";
        $cadenarelacion = '';
        if (isset($arrayelementosrelacionados[0])) {
            $cadenarelacion .= " AND (";
            $cadena
                .= " INNER JOIN mod_objetivos.dat_arc_dat_plan ap
                ON a.idarc = ap.idarc ";
            //$inneree = 0;
            //$innerapa = 0;
            //$existetipoelCicta = 0;
            //$existereldifCicta = 0;
            foreach (
                $arrayelementosrelacionados as $key => $elementorelacionado
            ) {
                $idplan = $elementorelacionado->idplan;
                if ($key != 0) {
                    $cadenarelacion .= " OR ";
                }
                $cadenarelacion .= " (ap.idplan = '$idplan') ";
            }
            $cadenarelacion .= ") ";
        }
        $cadena .= " WHERE " . $cadenaautoresinvol . $cadenarelacion;
        if ($idarc != null) {
            $cadena .= " AND a.idarcp = $idarc AND a.idarc <> $idarc";
        }
        $cadena .= " {$addwhere} ";//die($cadena);
        $connA = Doctrine_Manager:: connection();
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        if ($start == null) {
            $start = 0;
        }
        $cadena .= " ORDER BY orden ASC";
        $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limit . ")";
        $res = $connA->execute($cadena);
        $result['total'] = $total;
        $result['resultado'] = $res->fetchAll();
        return $result;
    }

    public function ObtenerIdAreas(
        /* $idarc, $start, $limit,*/
        $denominacion, $fechainicio, $fechafin,
        $arrayautoresact, $arrayinvolact, $tfcar, $activas,
        $arrayelementosrelacionados
    )
    {
        $cadenaautoresinvol = '';
        //cadena sql con autores para sentencia final
        if (isset($arrayautoresact[0])) {
            $cadenaautoresinvol = " ((";
            $totalaut = count($arrayautoresact);
            $operator = " OR ";
            foreach ($arrayautoresact as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (a.idusuariocrea = '$idusuariocrea') "
                    . $operator;
            }
            $cadenaautoresinvol .= ") ";
            if (isset($arrayinvolact[0])) {
                $cadenaautoresinvol .= " OR ";
            } else {
                $cadenaautoresinvol .= ")";
            }
        }
        //cadena sql con involucrados para sentencia final
        if (isset($arrayinvolact[0])) {
            //if(!$arrayautoresact[0]){$cadenaautoresinvol.= " AND ";}
            $cadenaautoresinvol .= " (";
            $totalinvol = count($arrayinvolact);
            $operator = " OR ";
            foreach ($arrayinvolact as $key => $invol) {
                $llaveinvolucrado = $invol['llaveinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (ai.llaveinvolucrado = '$llaveinvolucrado') "
                    . $operator;
            }
            $cadenaautoresinvol .= ") ";
            if ($arrayautoresact[0]) {
                $cadenaautoresinvol .= ") ";
            }
        }
        $cadena
            = "SELECT distinct(a.idarc),a.idarc,a.idarcp
            FROM mod_objetivos.dat_arc a
            LEFT JOIN mod_objetivos.dat_arc_dat_involucrados ai 
            ON ai.idarc = a.idarc ";
        $cadenarelacion = '';
        if (isset($arrayelementosrelacionados[0])) {
            $cadenarelacion .= " AND (";
            $cadena
                .= " INNER JOIN mod_objetivos.dat_arc_dat_plan ap
                ON a.idarc = ap.idarc ";
            //$inneree = 0;
            //$innerapa = 0;
            //$existetipoelCicta = 0;
            //$existereldifCicta = 0;
            foreach (
                $arrayelementosrelacionados as $key => $elementorelacionado
            ) {
                $idplan = $elementorelacionado->idplan;
                if ($key != 0) {
                    $cadenarelacion .= " OR ";
                }
                $cadenarelacion .= " (ap.idplan = '$idplan') ";
            }
            $cadenarelacion .= ") ";
        }
        $cadena .= " WHERE " . $cadenaautoresinvol . $cadenarelacion;
        if ($denominacion != null) {
            $cadena .= " AND a.denarc LIKE '%$denominacion%'";
        }
        if ($fechainicio != null) {
            $cadena .= " AND a.fechainicio >= '$fechainicio'";
        }
        if ($fechafin != null) {
            $cadena .= " AND a.fechafin <= '$fechafin'";
        }
        if ($tfcar != null) {
            $cadena .= " AND a.idarc = '$tfcar'";
        }
        /*if ($idarc != null) {
            $cadena.= " AND a.idarcp = '$idarc' AND a.idarcp <> a.idarc";
        }
        if ($idarc == null) {
            $cadena.= " AND a.idarcp = a.idarc";
        }*/
        if ($activas != 10) {
            $cadena .= " AND a.activo = '$activas'";
        }
        if ($activas == 10) {
            $cadena .= " AND (a.activo = '1' OR a.activo = '0')";
        }
        $connA = Doctrine_Manager:: connection();
        $resnopag = $connA->execute($cadena);
        $result = $resnopag->fetchAll();
        return $result;
    }

    public function GetARCImport($arrayARC)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT distinct(a.idarc),a.idarc AS idarea,a.denarc AS denom,
            a.descrip,a.idarcp,a.fechainicio AS fdesde,
            a.fechafin AS fhasta,a.activo,a.idusuariocrea AS autor,a.caduca
            FROM mod_objetivos.dat_arc a
            LEFT JOIN mod_objetivos.dat_arc_dat_involucrados ai 
            ON ai.idarc = a.idarc 
            WHERE a.idarc IN(" . implode(
                ", ", $arrayARC
            ) . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        $resultado['total'] = count($result);
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function existeARCImport($denarc)
    {
      $connA = Doctrine_Manager:: connection();
      $cadena
             = "SELECT distinct(a.idarc),a.idarc AS idarea,a.denarc AS denom,
              a.descrip,a.idarcp,a.fechainicio AS fdesde,
              a.fechafin AS fhasta,a.activo,a.idusuariocrea AS autor,a.caduca
              FROM mod_objetivos.dat_arc a
              LEFT JOIN mod_objetivos.dat_arc_dat_involucrados ai 
              ON ai.idarc = a.idarc 
              WHERE a.denarc = '". $denarc ."'";
      $res = $connA->execute($cadena);
      $result = $res->fetchAll();
      $resultado=(count($result)==0)?0:$result[0]['idarc'];
      return $resultado;
    }

    /**
     * Consulta que retorna un array con arc descendientes de un arc determinado
     */
    public function buscarFamiliaFechas($idarea)
    {
        $ordenes = DatArc::buscarOrdenIzqDer($idarea);
        $ordend = $ordenes[0]['ordenderecho'];
        $ordeni = $ordenes[0]['ordenizquierdo'];
        $query = new Doctrine_Query();
        $result = $query->select(
            'a.idarc _id, a.fechainicio fechai, a.fechafin fechaf'
        )
            ->from('DatArc a')
            ->where("a.ordender <'$ordend' AND a.ordenizq >'$ordeni'")
            ->orderby('a.ordenizq  DESC')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna valores del orden izquierdo-derecho de un arc
     */
    public function buscarOrdenIzqDer($idarea)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'a.ordender as ordenderecho, a.ordenizq as ordenizquierdo'
        )
            ->from('DatArc a')
            ->where('a.idarc= ?', $idarea)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Consulta que retorna un array con arc descendientes de un arc determinado
     */
    public function buscarFamilia($idarea)
    {
        $ordenes = DatArc::buscarOrdenIzqDer($idarea);
        $ordend = $ordenes[0]['ordenderecho'];
        $ordeni = $ordenes[0]['ordenizquierdo'];
        $query = new Doctrine_Query();
        $result = $query->select('a.idarc _id')
            ->from('DatArc a')
            ->where("a.ordender <='$ordend' AND a.ordenizq >='$ordeni'")
            ->orderby('a.ordenizq  DESC')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function dameDatosARC($idArea)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArc a')
            ->where("a.idarc = '$idArea'")
            ->execute()->toArray();
        return $result;
    }

    public function DameHijosPorIdpadre($idarc, $idusuario)
    {
        $result = Doctrine_Query::create()
            ->from('DatArc a')
            ->where(
                " a.idarcp = $idarc AND a.idarcp <> a.idarc 
                    AND a.idusuariocrea = $idusuario "
            )
            ->execute();
        return $result->toArray();
    }

    public function ObtenerArcExistentes($arrayArc)
    {
        $result = Doctrine_Query::create()
            ->select('da.idarc')->from('DatArc da')->whereIn(
                "da.idarc", $arrayArc
            )->execute();
        return $result->toArray();
    }

    public function BuscarArcPersistida($idarc)
    {
        $query = new Doctrine_Quer();
        $result = $query->select('da.*')
            ->from('DatArc da')
            ->where("da.idarc = $idarc")
            ->execute();
        return $result->toArray();
    }

    public function ActualizarInfArc()
    {
        $connection = Doctrine_Manager:: connection();
        $sql = "UPDATE mod_objetivos.dat_arc SET ";
        $array = $this->getData();
        foreach ($array as $key => $value) {
            if (strlen((string)$value) > 0) {
                $sql = $sql . $key . " = " . "'" . $value . "',";
            }
        }
        $sql = substr($sql, 0, strlen($sql) - 1) . " WHERE idarc = "
            . $array['idarc'];
        $connection->execute($sql);
    }

    public function buscarSuperioresMismoARC1($idelemento, $fechaini, $fechafin, &$resultado)
    {
        $query = new Doctrine_Query();
        $result = $query->from("DatArc arc")
            ->where("arc.idarc = $idelemento and arc.fechainicio BETWEEN '$fechaini' and '$fechafin'")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        if ($result[0]['idarc'] != $result[0]['idarcp']) {
            $resultado[] = self::buscarSuperioresMismoARC($result[0]['idarcp'],
                $fechaini, $fechafin, $resultado);
        }
        return $idelemento;

    }

    public function buscarArcFechaInicio($idarc,$parametros)
    {
        $query = new Doctrine_Query();
        $result = $query->from("DatArc arc")
            ->where("arc.idarc = $idarc and arc.fechainicio BETWEEN '$parametros->fechainicio' 
                        and '$parametros->fechafin'")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;

    }

}

//fin clase 




    