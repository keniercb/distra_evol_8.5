<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatObjetivo extends BaseDatObjetivo {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatArcDatPlanObjetivo', array('local' => 'idobjetivo', 'foreign' => 'idobjetivo')
        );
        $this->hasOne(
                'DatElementos', array('local' => 'idobjetivo', 'foreign' => 'idelemento')
        );
        $this->hasMany(
                'DatCriteriomedida', array('local' => 'idobjetivo', 'foreign' => 'idobjetivo')
        );
    }

    public function Buscar($idobjetivo) {
        return Doctrine::getTable('DatObjetivo')->find($idobjetivo);
    }

    public function ObjetivosSubordinados($idElemento) {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
                ->innerJoin('e.DatElementosDatElementos t')
                ->where(
                        'e.idtipoelemento = 1 and t.idelementopadre = ?', $idElemento
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function ObtenerTodosObjetivosyElementos($limit, $start) {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
                ->innerJoin('e.DatObjetivo o')
                ->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function GetTodos() {
        $query = new Doctrine_Query();
        $result = $query->from('DatObjetivo')
                ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query();
        $result = $query->from('DatObjetivo o')
                ->limit($limite = 10)
                ->offset($inicio = 0)
                ->execute()
                ->toArray();
        return $result;
    }

    public function IdPadreIdHijo($idElementoHijo) {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosDatElementos t')
                ->where('t.idelementohijo = ?', $idElementoHijo)
                ->execute()
                ->toArray();
        return $result;
    }

    public function buscarObj($parametros) {
        $idUsuarioSesion = $parametros['id_usuario'];
        $denomin = $parametros['denominacion'];
        $fechaI = $parametros['fecha_inicio'];
        $fechaF = $parametros['fecha_fin'];
        $arrayAutores = $parametros['array_autores'];
        $arrayInvolucrados = $parametros['array_involucrados'];
        $idElementoRelacionA = $parametros['id_ElementoRelacion'];
        $idElementoPlanA = $parametros['id_ElementoPlan'];
        $tipoElementoRelacion = $parametros['tipo_ElementoRelacion'];
        $fechaInicioElemento = $parametros['fecha_inicio_elemento'];
        $fechaFinElemento = $parametros['fecha_fin_elemento'];
        $arraySubordinados = $parametros['array_subordinados'];
        $estaaprobando = $parametros['estaaprobando'];
        $idestadoaprobacion = $parametros['idestadoaprobacion'];
        $certificado = $parametros['certificado'];
        $iddominio = $parametros['iddominio'];
        $arrayestados = $parametros['arrayestadosverdoc'];
        $idfipsuperior = $parametros['idfipsuperior'];
        $offset = $parametros['offset'];
        $limit = $parametros['limit'];
        $connA = Doctrine_Manager:: connection();
        //cadena con sentencia sql para los posibles autores e involucrados
        $cadenaautoresinvol = '';
        if (isset($arrayAutores[0])) {
            $cadenaautoresinvol = " AND ((";
            $totalaut = count($arrayAutores);
            $operator = " OR ";
            foreach ($arrayAutores as $key => $autor) {
                $idusuariocrea = $autor['idusuariocrea'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (e.idusuariocrea = '$idusuariocrea') "
                        . $operator;
            }
            $cadenaautoresinvol .= ") ";
            if (isset($arrayInvolucrados[0])) {
                $cadenaautoresinvol .= " OR ";
            } else {
                $cadenaautoresinvol .= ")";
            }
        }
        //cadena sql con involucrados para sentencia final
        if (isset($arrayInvolucrados[0])) {
            if (!$arrayAutores[0]) {
                $cadenaautoresinvol .= " AND ";
            }
            $cadenaautoresinvol .= " (";
            $totalinvol = count($arrayInvolucrados);
            $operator = " OR ";
            foreach ($arrayInvolucrados as $key => $invol) {
                $idinvolucrado = $invol['idinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (ei.idinvolucrado = '$idinvolucrado') "
                        . $operator;
            }
            $cadenaautoresinvol .= ") ";
            if ($arrayAutores[0]) {
                $cadenaautoresinvol .= ") ";
            }
        }
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = '  ';
        if (isset($arrayestados['data'][0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados['data']);
            foreach ($arrayestados['data'] as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (e.idestadoaprob = '$idestadoaprob') "
                        . $operator;
            }
            $cadenaestados .= ") ";
        }

        //query con sintaxis general a usar en todos los casos
        $cadena
                = "SELECT distinct(e.idelemento),e.denelemento,e.descelemento,
                e.activo,e.idtipoelemento, e.idusuariocrea,e.llevahistorial,
                e.gradocumplimiento,e.estadocumplimiento,e.privado,o.fechafin,
                o.fechainicio, e.participante AS participantes,
                e.dirigente AS dirigentes,e.idestadoaprob
            FROM mod_objetivos.dat_elementos e 
            INNER JOIN mod_objetivos.dat_objetivo o 
            ON e.idelemento = o.idobjetivo 
            LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
            ON ei.idelemento = e.idelemento ";

        if ($tipoElementoRelacion != null) {
            switch ($tipoElementoRelacion) {
                case 'FIP':
                    $cadena
                            .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos
                        ee ON e.idelemento = ee.idelementohijo
                        WHERE e.idtipoelemento = '1' 
                        AND ee.idelementopadre = '$idElementoRelacionA' ";
                    break;

                case 'ARC':
                    $cadena
                            .= " INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo
                        apo ON o.idobjetivo = apo.idobjetivo
                        WHERE e.idtipoelemento = '1' 
                        AND  apo.idarc = '$idElementoRelacionA' 
                        AND apo.idplan = '$idElementoPlanA' ";
                    break;
            }
            $cadena .= " ";
        } else {
            $cadena .= " WHERE e.idtipoelemento = '1' ";
        }
        if ($denomin != null) {
            $cadena .= " AND  e.denelemento LIKE '%$denomin%' ";
        }
        if ($fechaI != null) {
            $cadena .= " AND  o.fechainicio >= '$fechaI' ";
        }
        if ($fechaF != null) {
            $cadena .= " AND  o.fechafin <= '$fechaF' ";
        }
        if ($fechaInicioElemento != null) {
            $cadena .= " AND  o.fechainicio >= '$fechaInicioElemento' ";
        }
        if ($fechaFinElemento != null) {
            $cadena .= " AND  o.fechafin <= '$fechaFinElemento' ";
        }
        $cadena .= $cadenaautoresinvol . $cadenaestados;
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        if ($offset == null) {
            $offset = 0;
        }
        $cadena .= " OFFSET(" . $offset . ") LIMIT(" . $limit . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        $resultado[] = $total;
        $resultado[] = $result;
        return $resultado;
        return $resultado;
    }

    public function dameObjetivosDadoPlanArc($idusuario, $idplan, $idelem) {
        $query = new Doctrine_Query();
        $result = $query->from('DatObjetivo o')
                ->innerJoin('o.DatArcDatPlanObjetivo apo')
                ->where('apo.idarc =?', $idarc)
                ->addWhere('apo.idplan =?', $idplan)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function CargarObservaciones($idElemento) {
        $query = new Doctrine_Query();
        $result = $query->from('DatObservacionesPdo o')
                ->where('o.idelemento = ?', $idElemento)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

  public function getObjPlan($idplan, $idusuariocrea,& $arrayObjetivos)
  {
    $hijos1 = DatElementosDatElementos::HijosDadoIdPadre($idplan, $idusuariocrea);
    $hijos2 = DatArcDatPlan::ObtenerArcPorPlanesSQL($idplan, $idusuariocrea);
    $hijos = array();
    $hijos = array_merge(
      $hijos, $hijos1, $hijos2
    );
    foreach ($hijos as $hijo) {
      if ($hijo['idtipoelemento'] == 1) {
        array_push($arrayObjetivos, $hijo['idelementohijo']);
      }
      if ($hijo['idtipoelemento'] == 32) {
        $hijos4 = DatArcDatPlanActividades::getArcPlanActSQL($idplan, $hijo['idelementohijo']);
        $hijos5=DatArcDatPlanObjetivo::ObtenerObjDadoPlanARCReporte($idplan, $hijo['idelementohijo']);
        $hijos4 = array_merge(
          $hijos4, $hijos5
        );
        foreach ($hijos4 as $hijo4) {
          if ($hijo4['idtipoelemento'] == 1) {
            array_push($arrayObjetivos, $hijo4['idelementohijo']);
          }
          self::getObjPlan($hijo4['idelementohijo'], $idusuariocrea,$arrayObjetivos);
        }
      }
      self::getObjPlan($hijo['idelementohijo'], $idusuariocrea,$arrayObjetivos);
    }
    return $arrayObjetivos;
  }

    public function getDatosReporteObjetivos($datos){
      $connA = Doctrine_Manager:: connection();
      $whereplan='';
      if($datos->str_idelementos!="") {
        $whereplan.= " e.idelemento in ($datos->str_idelementos) ";
      }
      if($datos->str_idelementos=="" && $datos->idplan!="")
        return array();

      $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
      $fechafinD = $datos->arraydatosreporte['fechafinD'];
//      print_r($fechainicioD." ".$fechafinD);die;
      $cadena_1=" SELECT 
                e.idelemento,
                e.denelemento, e.denelemento as objcriteriomedida , 0 as orden 
                ,o.fechafin ,o.fechainicio ,e.gradocumplimiento || '' as gradocumplimiento, 0 || '' as valormeta,0 || '' as valorreal,e.dirigente,e.participante, 
                (select * from mod_objetivos.fa_devolver_nombres_involucrados (array_agg( distinct dei.idinvolucrado),0)) 
                as involucrados, replace(e.descelemento,'&nbsp;', '') as descripcion, arc.denarc
        FROM mod_objetivos.dat_elementos e  
        
               INNER JOIN mod_objetivos.dat_objetivo o                 
               ON o.idobjetivo = e.idelemento
               
               
               INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo arc_obj
               ON o.idobjetivo = arc_obj.idobjetivo
               
               INNER JOIN mod_objetivos.dat_arc arc
               ON arc.idarc = arc_obj.idarc
               
                                                                      
               LEFT JOIN mod_objetivos.dat_criteriomedida cm
               ON o.idobjetivo = cm.idobjetivo
                                                                                   
               LEFT JOIN mod_flujotrabajo.dat_estado es           
               ON e.idestadoaprob = es.idestado  
              
               LEFT JOIN  mod_objetivos.dat_elementos_dat_involucrados dei 
               ON (dei.idelemento = e.idelemento)   
               
               LEFT JOIN mod_objetivos.dat_elementos_dat_elementos ee
               ON (e.idelemento = ee.idelementohijo )
               
               LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
               ON (ei.idelemento = e.idelemento) 
                
               LEFT JOIN mod_objetivos.dat_involucrados i 
               ON (ei.idinvolucrado = i.idinvolucrado)
               
      ";
      $cadena_where1=" (e.idusuariocrea = {$datos->idusuariosession} 
                OR i.idusuario = {$datos->idusuariosession}) ";

//      e.idestadoaprob IN (1000000356,1000000358,1000000362,1000000042,1000000071,1000000357,
//                          1000000359,1000000363)

      $cadena_group_by1=" group by e.idelemento,
                e.denelemento, e.denelemento  
                ,o.fechafin ,o.fechainicio ,e.gradocumplimiento,e.dirigente,e.participante, arc.denarc, e.descelemento ";


      $cadena_2=" SELECT 
                cm.idcriteriomedida,
                e.denelemento,cm.dencriterio as objcriteriomedida , 1 as orden 
                ,cm.fechafin ,cm.fechainicio ,cm.gradocumplimiento ::varchar,cm.valormeta ::varchar, cm.valoreal ::varchar,''::varchar as dirigente,
                cm.participante,(select * from mod_objetivos.fa_devolver_nombres_involucrados (array_agg(distinct dcmi.idinvolucrado),0)) as involucrados,
                replace(cm.descriterio,'&nbsp;', '') as descripcion, arc.denarc
                 
                FROM mod_objetivos.dat_elementos e                
                
                INNER JOIN mod_objetivos.dat_objetivo o          
                ON o.idobjetivo = e.idelemento   
                
                
                INNER JOIN mod_objetivos.dat_arc_dat_plan_objetivo arc_obj
                ON o.idobjetivo = arc_obj.idobjetivo
               
                INNER JOIN mod_objetivos.dat_arc arc
                ON arc.idarc = arc_obj.idarc
                
                
                INNER JOIN mod_objetivos.dat_criteriomedida cm
                ON o.idobjetivo = cm.idobjetivo  
                       
                LEFT JOIN mod_flujotrabajo.dat_estado es     
                ON e.idestadoaprob = es.idestado               
                
                LEFT JOIN  mod_objetivos.dat_criteriomedida_dat_involucrados dcmi 
                ON (dcmi.idcriteriomedida = cm.idcriteriomedida)   
                
                LEFT JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementohijo )
                
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                
                LEFT JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado)
                
                  ";

      $cadena_where2=" (e.idusuariocrea = {$datos->idusuariosession} 
                OR i.idusuario = {$datos->idusuariosession}) ";

//      e.idestadoaprob IN (1000000356,1000000358,1000000362,1000000042,1000000071,1000000357,
//                          1000000359,1000000363)

      $cadena_group_by2=" group by 
                cm.idcriteriomedida,
                e.denelemento,cm.dencriterio 
                ,cm.fechafin ,cm.fechainicio ,cm.gradocumplimiento ::numeric(19,2),cm.valormeta, cm.valoreal,cm.participante, arc.denarc,
                 cm.gradocumplimiento,
                 cm.descriterio ";

      $cadena_order_by=" 
             order by denelemento,orden,objcriteriomedida
        ";


      if ($datos->idplan!="") {
        $cadena_where1 .=($cadena_where1=="")? $whereplan:"  AND  ". $whereplan;

        $cadena_where2 .=($cadena_where2=="")? $whereplan:"  AND  ". $whereplan;
      }

      if ($fechainicioD != null && $fechafinD != null) {
        $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
        $cadena_where2 .= ($cadena_where2=="")?"":" AND ";
        $cadena_where1 .=" (
          (o.fechainicio <= '$fechainicioD' AND o.fechafin >= '$fechainicioD')
          OR (o.fechainicio <= '$fechafinD'                        AND o.fechafin >= '$fechafinD')
          OR (o.fechainicio >= '$fechainicioD'                         AND o.fechafin <= '$fechafinD')) ";

        $cadena_where2 .=" (
          (o.fechainicio <= '$fechainicioD' AND o.fechafin >= '$fechainicioD')
          OR (o.fechainicio <= '$fechafinD'                        AND o.fechafin >= '$fechafinD')
          OR (o.fechainicio >= '$fechainicioD'                         AND o.fechafin <= '$fechafinD')) ";
      }

      if ($fechainicioD != null && $fechafinD == null) {
        $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
        $cadena_where2 .= ($cadena_where2=="")?"":" AND ";
        $cadena_where1 .=" (
          (o.fechainicio <= '$fechainicioD' AND o.fechafin >= '$fechainicioD')
          OR o.fechainicio >= '$fechainicioD' ) ";

        $cadena_where2 .=" (
          (o.fechainicio <= '$fechainicioD' AND o.fechafin >= '$fechainicioD')
          OR o.fechainicio >= '$fechainicioD' ) ";
      }

      if ($fechainicioD == null && $fechafinD != null) {
        $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
        $cadena_where2 .= ($cadena_where2=="")?"":" AND ";
        $cadena_where1 .=" (
          OR (o.fechainicio <= '$fechafinD'                        AND o.fechafin >= '$fechafinD')
          OR  o.fechafin <= '$fechafinD') ";

        $cadena_where2 .=" (
          OR (o.fechainicio <= '$fechafinD'                        AND o.fechafin >= '$fechafinD')
          OR  o.fechafin <= '$fechafinD') ";
      }


      $cadena_where1=($cadena_where1=="")?"":" WHERE ".$cadena_where1;
      $cadena_where2=($cadena_where2=="")?"":" WHERE ".$cadena_where2;

      $cadena  = $cadena_1 . $cadena_where1 . $cadena_group_by1 . " union " . $cadena_2 . $cadena_where2 . $cadena_group_by2 . $cadena_order_by;

//      print_r($cadena);die;
     $res = $connA->execute($cadena);
     $result = $res->fetchAll();
     return $result;
    }

    public function getDatosReporteObjetivosTrabajoCriteriosMedida($datos){
      $idplan =($datos->str_idelementos=="")?"null":"array[".$datos->str_idelementos."]";

      $fechainicioD = ($datos->arraydatosreporte['fechainicioD']=="")?"null":
                    "'".str_replace("-", "/", $datos->arraydatosreporte['fechainicioD'])."'";
      $fechafinD = ($datos->arraydatosreporte['fechafinD']=="")?"null":
                    "'".str_replace("-", "/", $datos->arraydatosreporte['fechafinD'])."'";

      $connA = Doctrine_Manager:: connection();
      $cadena  = " SELECT * FROM mod_objetivos.f_objetivoscriterioevaluacion($idplan,$fechainicioD,$fechafinD, $datos->idusuariosession) ";

//      print_r($cadena);die;
      $res = $connA->execute($cadena);
      $result = $res->fetchAll();
      return $result;
    }

    public function getDatosReporteObjetivosTodosLoscampos($datos){
        $connA = Doctrine_Manager:: connection();
        $cadena  = "  --listado de objetivos 
                        --consulta para buscar solo los objetivos que tienen criterio de medida
                        SELECT 
                        e.idelemento,
                        e.denelemento, e.denelemento as objcriteriomedida , 0 as orden 
                        ,to_char(o.fechafin, 'dd/mm/YYYY') as fechafin  ,o.fechainicio ,e.gradocumplimiento, 0 as valormeta,0 as valorreal,
                        e.dirigente,e.participante, (select * from mod_objetivos.fa_devolver_nombres_involucrados (array_agg( distinct dei.idinvolucrado),0)) as involucrados
                         
                                                                            FROM mod_objetivos.dat_elementos e                
                                                                            INNER JOIN mod_objetivos.dat_objetivo o                 ON o.idobjetivo = e.idelemento   
                        													INNER JOIN mod_objetivos.dat_criteriomedida cm                 ON o.idobjetivo = cm.idobjetivo                                                                     
                                                                            LEFT JOIN mod_flujotrabajo.dat_estado es                ON e.idestadoaprob = es.idestado  
                                                                            left join  mod_objetivos.dat_elementos_dat_involucrados dei on (dei.idelemento = e.idelemento)            
                                                                             
                                                                                            WHERE 
                                                                                                                                                                
                                                                                            ( 
                                                                                            (o.fechainicio <= '01-01-2019' AND o.fechafin >= '01-01-2019')  
                                                                                             OR (o.fechainicio <= '31-01-2019'                        AND o.fechafin >= '31-01-2019')                   
                                                                                              OR (o.fechainicio >= '01-01-2019'                         AND o.fechafin <= '31-01-2019'))
                                                                                              
                                                          
                                                                                               
                                                                                              AND e.idestadoaprob IN (1000000356,1000000358,1000000362,1000000042,
                                                                                              1000000071,1000000357,1000000359,1000000363)
                                                                                              group by e.idelemento,
                        e.denelemento, e.denelemento  
                        ,o.fechafin ,o.fechainicio ,e.gradocumplimiento,e.dirigente,e.participante
                                                                                               
                           union 
                           --consulta para buscar los criterio de medida para los objetivos
                        SELECT 
                        cm.idcriteriomedida,
                        e.denelemento,cm.dencriterio as objcriteriomedida , 1 as orden 
                        ,to_char(cm.fechafin, 'dd/mm/YYYY') as fechafin  ,cm.fechainicio ,cm.gradocumplimiento ::numeric(19,2),cm.valormeta, 
                        cm.valoreal,''::varchar as dirigente,cm.participante,(select * from mod_objetivos.fa_devolver_nombres_involucrados (array_agg(distinct dcmi.idinvolucrado),0))
                         as involucrados
                         
                                                                            FROM mod_objetivos.dat_elementos e                
                                                                            INNER JOIN mod_objetivos.dat_objetivo o                 ON o.idobjetivo = e.idelemento   
                        													INNER JOIN mod_objetivos.dat_criteriomedida cm                 ON o.idobjetivo = cm.idobjetivo                                                                     
                                                                            LEFT JOIN mod_flujotrabajo.dat_estado es                ON e.idestadoaprob = es.idestado               
                                                                             left join  mod_objetivos.dat_criteriomedida_dat_involucrados dcmi on (dcmi.idcriteriomedida = cm.idcriteriomedida)    
                                                                                            WHERE 
                                                                                                                                                                
                                                                                            ( 
                                                                                            (o.fechainicio <= '01-01-2019' AND o.fechafin >= '01-01-2019')  
                                                                                             OR (o.fechainicio <= '31-01-2019'                        AND o.fechafin >= '31-01-2019')                   
                                                                                              OR (o.fechainicio >= '01-01-2019'                         AND o.fechafin <= '31-01-2019'))
                                                                                              
                                                          
                                                                                               
                                                                                              AND e.idestadoaprob IN (1000000356,1000000358,1000000362,1000000042,1000000071,
                                                                                              1000000357,1000000359,1000000363)
                        group by 
                        cm.idcriteriomedida,
                        e.denelemento,cm.dencriterio 
                        ,cm.fechafin ,cm.fechainicio ,cm.gradocumplimiento ::numeric(19,2),cm.valormeta, cm.valoreal,cm.participante
                        order by denelemento,orden,objcriteriomedida


                 ";
    $res = $connA->execute($cadena);
    $result = $res->fetchAll();
    return $result;
  }

  public function getDatosReporteObjetivosActividadesAseguran($datos){
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


  public function getDatosActividad($idelemento){
    $connA = Doctrine_Manager:: connection();
    $cadena= " SELECT 
                  distinct 
                  ef.idelemento,
                  ef.denelemento, ef.denelemento as actividades , 0 as orden ,
                  to_char(a.fechainicio, 'dd/mm/YYYY') ||' - ' || to_char(a.fechafin, 'dd/mm/YYYY') as plazo,
                  ef.dirigente AS dirigentes,
                  ef.participante AS participantes
                  FROM mod_objetivos.dat_elementos ef                
                  INNER JOIN mod_objetivos.dat_actividades a 
                  ON (a.idactividad = ef.idelemento AND a.suspendida=0 AND a.idactividad=$idelemento)   ";
    //    print_r($cadena);die;
    $res = $connA->execute($cadena);
    $result = $res->fetchAll();
    return $result;
  }

    public function GetFipRelacionadosConObjetivo($idObjetivo) {
        $query = new Doctrine_Query();
        $result = $query->from("DatElementos e")
                ->innerJoin(
                        "e.DatElementosDatElementos dede 
                    ON e.idelemento = dede.idelementopadre"
                )
                ->innerJoin("e.DatFip f")
                ->where(
                        "dede.idelementohijo = $idObjetivo and dede.origen in (1, 3)"
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function GetARCRelacionadosConObjetivo($idObjetivo) {
        $select = "select da.*, dadpo.*";
        $from = "from dat_arc da ";
        $innerJ = "inner join dat_arc_dat_plan_objetivo dadpo ";
        $on = "on da.idarc = dadpo.idarc ";
        $where = "where dadpo.idobjetivo = $idObjetivo ";
        $conn = Zend_Registry::get('conexion');
        $aux = $conn->execute($select . $from . $innerJ . $on . $where);
        $result = $aux->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function ObjetivoEstaRelacionadoConFip($idObjetivo, $idFip) {
        $query = new Doctrine_Query();
        $result = $query->from("DatElementosDatElementos dede")
                ->where(
                        "dede.idelementopadre = $idFip 
                    and dede.idelementohijo = $idObjetivo"
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function ObjetivoEstaRelacionadoConARCPlan(
    $idObjetivo, $idPlan, $idArc
    ) {
        $query = new Doctrine_Query();
        $result = $query->from("DatArcDatPlanObjetivo dadpo")
                ->where(
                        "dadpo.idobjetivo = $idObjetivo and dadpo.idplan = $idPlan 
                    and dadpo.idarc = $idArc"
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function ArcEstaRelacionadoConPlan($idArc, $idPlan) {
        $query = new Doctrine_Query();
        $result = $query->from("DatArcDatPlan dadp")
                ->where("dadp.idarc = $idArc and dadp.idplan = $idPlan")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function EliminarRelacionObjFip($idObjetivo, $idFip) {
        $query = new Doctrine_Query();
        $result = $query->delete("DatElementosDatElementos")
                ->from("DatElementosDatElementos dede")
                ->where(
                        "dede.idelementopadre = $idFip 
                    and dede.idelementohijo = $idObjetivo"
                )
                ->execute();
    }

    public function EliminarRelacionObjARC($idObjetivo, $idArc, $idplan) {
        $query = new Doctrine_Query();
        $result = $query->delete("DatArcDatPlanObjetivo")
                ->from("DatArcDatPlanObjetivo dadpo")
                ->where(
                        "dadpo.idobjetivo = $idObjetivo and dadpo.idarc = $idArc 
                    and dadpo.idplan = $idplan"
                )
                ->execute();
    }

    public function dameObjetivosDadoId($idobjetivo) {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e')
                ->innerJoin('e.DatObjetivo o')
                ->where('e.idelemento = ?', $idobjetivo)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function existeObjetivo($idObjetivo) {
        $query = new Doctrine_Query();
        $result = $query->from('DatObjetivo o')
                ->where("o.idobjetivo = $idObjetivo")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function dameObjetivosDeArc($idArc, $idPlan) {
        $query = new Doctrine_Query();
        $result = $query->select('e.*, o.*, apo.*')
                ->from('DatElementos e')
                ->innerJoin('e.DatObjetivo o')
                ->innerJoin('o.DatArcDatPlanObjetivo apo')
                ->where("apo.idarc = $idArc and apo.idplan = $idPlan")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function dameCriterioMedida($idObjetivo) {
        $query = new Doctrine_Query();
        $result = $query->select('cm.*, cmi.*')
                ->from('DatCriteriomedida cm')
                ->innerJoin('cm.DatCriterioDatInvolucrados cmi')
                ->where("cm.idobjetivo = $idObjetivo")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    /*
     *
     * Retorna criterios para cargarlos  en el grid de Gestionar criterios
     */

    public function CargarCriterios($idobjetivo, $idusuario, $limit, $start) {
        $connA = Doctrine_Manager:: connection();
        //query con sintaxis general a usar en todos los casos
        $cadena
                = "SELECT distinct(c.idcriteriomedida),c.dencriterio AS denominacion,
            c.descriterio, c.estadocumplimiento,c.gradocumplimiento,
            c.idusuariocrea AS idautor,c.participante AS participantes,c.fechainicio,
            c.fechafin,c.valormeta,c.valoreal,c.evaluacion
            FROM mod_objetivos.dat_criteriomedida c
            WHERE c.idobjetivo = '$idobjetivo'";
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        if ($start == null) {
            $start = 0;
        }
        $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limit
                . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        $resultado['total'] = $total;
        $resultado['resultado'] = $result;
        return $resultado;
    }

  /*
*
* Retorna criterios para cargarlos  en el grid de Gestionar criterios
*/

  public function CargarCriteriosIndicadores($idobjetivo,$idindicadorobjcrit,$relacionado_indicador, $idusuario, $limit, $start) {
    $connA = Doctrine_Manager:: connection();
    //query con sintaxis general a usar en todos los casos
    if($relacionado_indicador==0){
      $cadena
        = "  
           SELECT distinct(c.idcriteriomedida),c.dencriterio AS denominacion,
            c.descriterio, c.estadocumplimiento,c.gradocumplimiento,
            c.idusuariocrea AS idautor,c.participante AS participantes,c.fechainicio,
            c.fechafin,c.valormeta,c.valoreal,c.evaluacion
            FROM mod_objetivos.dat_criteriomedida c
            WHERE c.idobjetivo = '$idobjetivo' and c.idcriteriomedida not in
            ( SELECT distinct(cm.idcriteriomedida)
            FROM mod_objetivos.dat_criteriomedida cm
            INNER JOIN mod_objetivos.dat_indicadorcriteriomedida r
            ON r.idcriteriomedida = cm.idcriteriomedida
            WHERE cm.idobjetivo = '$idobjetivo' and r.idindicadorobjcrit='$idindicadorobjcrit' ) 
            order by c.idcriteriomedida
            ";
    }
    else{
      $cadena
        = "SELECT distinct(c.idcriteriomedida),c.dencriterio AS denominacion,
            c.descriterio, c.estadocumplimiento,c.gradocumplimiento, r.idindicadorcriteriomedida,
            c.idusuariocrea AS idautor,c.participante AS participantes,c.fechainicio,
            c.fechafin,c.valormeta,c.valoreal,c.evaluacion
            FROM mod_objetivos.dat_criteriomedida c
            INNER JOIN mod_objetivos.dat_indicadorcriteriomedida r
            ON r.idcriteriomedida = c.idcriteriomedida
            WHERE c.idobjetivo = '$idobjetivo' and r.idindicadorobjcrit='$idindicadorobjcrit' 
            order by c.idcriteriomedida
            ";
    }


//    print_r($cadena);die;
    $resnopag = $connA->execute($cadena);
    $resultnopag = $resnopag->fetchAll();
    $total = count($resultnopag);
    if ($start == null) {
      $start = 0;
    }
//    $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limit
//      . ")";
    $res = $connA->execute($cadena);
    $result = $res->fetchAll();
    $resultado['total'] = $total;
    $resultado['resultado'] = $result;
    return $resultado;
  }


    public function datosCriterioMedida($idobjetivo) {
        $query = new Doctrine_Query();
        $result = $query->select('dcm.*')
                ->from('DatCriteriomedida dcm')
                ->innerJoin('dcm.DatObjetivo do')
                ->where("do.idobjetivo = $idobjetivo")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function ActualizarInfObjetivo() {
        $query = new Doctrine_Query();
        $array = $this->getData();
        $idobjetivo = $array['idobjetivo'];
        $query->update('DatObjetivo do');
        foreach ($array as $key => $value) {
            if (strlen((string) $value) > 0) {
                $definicion = $this->getTable()->getColumnDefinition($key);
                if ($definicion['type'] != 'numeric') {
                    $value = "'" . $value . "'";
                }
                $query->set('do.' . $key, $value);
            }
        }
        $query->where("do.idobjetivo = $idobjetivo")->execute();
    }

    public function objConCriterio($parametros) {

      $cadenainvolucrados='';
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

      }else{
        $cadenainvolucrados.= " (e.idusuariocrea = {$parametros->idusuario}
                        OR i.idusuario = {$parametros->idusuario}) ";
      }

        $cadenaestados = (isset($parametros->arregloestados[0])) ?
                " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) " : "";
        $cadenaSelect = " SELECT DISTINCT (o.idobjetivo), e.denelemento ";
        $cadenaQUERY
                = " FROM mod_objetivos.dat_objetivo o

                        INNER JOIN mod_objetivos.dat_criteriomedida c
                        ON ( c.idobjetivo = o.idobjetivo)

                        INNER JOIN  mod_objetivos.dat_elementos e
                        ON ( e.idelemento = o.idobjetivo)

                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                        ON (ei.idelemento = e.idelemento)
                        LEFT JOIN mod_objetivos.dat_involucrados i
                        ON (ei.idinvolucrado = i.idinvolucrado)

                        WHERE {$cadenainvolucrados} {$cadenaestados} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function objValorMeta($idobjetivo, $tipo, $parametros) {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (c.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                    = " AND (c.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($tipo == 1) {
            $cadenaSelect = " SELECT SUM (c.valoreal) ";
        } else {
            $cadenaSelect = " SELECT SUM (c.valormeta) ";
        }
        $cadenaQUERY
                = " FROM mod_objetivos.dat_criteriomedida c
                    INNER JOIN mod_objetivos.dat_objetivo o
                    ON (c.idobjetivo = o.idobjetivo)
                    WHERE o.idobjetivo = {$idobjetivo}
                     {$cadenaFechaI} {$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function obtenerObjs($parametros) {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (o.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF = " AND (o.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
                " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) " : "";
        $cadenaSelect
                = " SELECT DISTINCT(o.idobjetivo), e.denelemento ";
        $cadenaQUERY
                = " FROM mod_objetivos.dat_objetivo o

                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = o.idobjetivo)

                WHERE (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function obtenerObjsReporte($datos) {
        if ($datos->idplan != '') {
            $cadenaPlan = " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (ee.idelementohijo = o.idobjetivo
                AND ee.idelementopadre = {$datos->idplan}) ";
        } else {
            $cadenaPlan = "";
        }
        if ($datos->fechainicio != '') {
            $cadenaFechaI = " AND (o.fechafin >= '$datos->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($datos->fechafin != '') {
            $cadenaFechaF = " AND (o.fechainicio <= '{$datos->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaestados = (isset($datos->arregloestados[0])) ?
                " AND (e.idestadoaprob IN (" . $datos->arrayestados . ")) " : "";
        $cadenaSelect
                = " SELECT DISTINCT(o.idobjetivo), * ";
        $cadenaQUERY
                = " FROM mod_objetivos.dat_objetivo o
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = o.idobjetivo)
                {$cadenaPlan}
                WHERE (e.idelemento = o.idobjetivo)
                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF}";
        /* OR e.idelemento IN (SELECT ei.idelemento
          FROM mod_objetivos.dat_elementos_dat_involucrados ei
          LEFT JOIN mod_objetivos.dat_involucrados i
          ON (ei.idinvolucrado = i.idinvolucrado)
          WHERE i.idusuario = {$datos->idusuario})) */
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $result;
    }

    /* Funcion para obtener los criterios de medidas de un obj para los reportes
     * */

    public function obtenerCMReporte($idobjetivo) {
        $cadena
                = "SELECT distinct(c.idcriteriomedida), *
            FROM mod_objetivos.dat_criteriomedida c
            WHERE c.idobjetivo = '$idobjetivo'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function obtenerObjConCriteriosDeMedidas($parametros) {
        $consulta = " SELECT COUNT(*) OVER() as total, o.idobjetivo, o.fechainicio, o.fechafin, o.tiempoestimado, e.denelemento, e.gradocumplimiento
                      FROM mod_objetivos.dat_objetivo o
                        INNER JOIN mod_objetivos.dat_elementos e
                          ON (e.idelemento = o.idobjetivo) ";

        if (isset($parametros->arrayobjetivos)) {
            $parametros->arrayobjetivos = implode(',', $parametros->arrayobjetivos);
            $cadenaWhere = " WHERE o.idobjetivo NOT IN (" . $parametros->arrayobjetivos . ") ";
        } else {
            $cadenaWhere = "";
        }
        $consulta .= $cadenaWhere;
        $consulta .= " ORDER BY o.idobjetivo ASC ";
        $consulta .= " LIMIT(" . $parametros->limit . ") OFFSET(" . $parametros->start . ")";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($consulta)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function obtenerDatosDadoArrayObjetivos($parametros) {
        $consulta = " SELECT o.idobjetivo, o.fechainicio, o.fechafin, o.tiempoestimado, e.denelemento, e.gradocumplimiento
                      FROM mod_objetivos.dat_objetivo o
                        INNER JOIN mod_objetivos.dat_elementos e
                          ON (e.idelemento = o.idobjetivo) ";

        if (isset($parametros->arrayobjetivos)) {
            $parametros->arrayobjetivos = implode(',', $parametros->arrayobjetivos);
            $cadenaWhere = " WHERE o.idobjetivo IN (" . $parametros->arrayobjetivos . ") ";
        } else {
            $cadenaWhere = " WHERE o.idobjetivo IN (-1) ";
        }
        $consulta .= $cadenaWhere;
        $consulta .= " ORDER BY o.idobjetivo ASC ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($consulta)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function obtenerDatosCriteriosMedidasDadoIdObj($parametros) {
        $cadena = "SELECT distinct(c.idcriteriomedida), *
                     FROM mod_objetivos.dat_criteriomedida c
                        WHERE c.idobjetivo = '$parametros->idobjetivo'";
        $consulta .= " ORDER BY c.idcriteriomedida ASC ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function obtenerDatosCriteriosMedidasDadoArrayIdObjetivos($parametros) {
        $cadena = "SELECT distinct(c.idcriteriomedida), *
                     FROM mod_objetivos.dat_criteriomedida c ";

        if (isset($parametros->arrayidcriteriomedida)) {
            $parametros->arrayidcriteriomedida = implode(',', $parametros->arrayidcriteriomedida);
            $cadenaWhere = " WHERE c.idcriteriomedida IN (" . $parametros->arrayidcriteriomedida . ") ";
        } else {
            $cadenaWhere = " WHERE c.idcriteriomedida IN (-1) ";
        }
        $cadena .= $cadenaWhere;
        $consulta .= " ORDER BY c.idcriteriomedida ASC ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}

//fin clase 



