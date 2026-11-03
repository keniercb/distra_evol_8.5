<?php

/**
 * @author    Equipo Desarrollo
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatPuntualizacion extends BaseDatPuntualizacion {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatActividades', array('local' => 'idactividad', 'foreign' => 'idactividad'));
		$this->hasOne('DatActividades', array('local' => 'idactividadpuntualizacion', 'foreign' => 'idactividad'));
    }

  public function Buscar($idpuntualizacion)
  {
    $temp = $this->conn->getTable('DatPuntualizacion')
                       ->find($idpuntualizacion);
    return $temp;
  }

  public function getDatosPuntualizacion($datos){

    $joinnom = '';
    $cadenanom = '';
    $joinplan='';

    if($datos->str_idelementos!="") {
      $joinplan.= " AND plan.idelemento in ($datos->str_idelementos) ";
    }
    if($datos->str_idelementos=="" && $datos->idplan!="")
      return array();

    $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
    $fechafinD = $datos->arraydatosreporte['fechafinD'];

    $arrayidautores = implode(',', $datos->arrayidautores);
    $arrayidinvolucrados = implode(',', $datos->arrayidinvolucrados);

    $arrayidnom = implode(',', $datos->arrayidnom);

    //cadena sql con los nomencladores
    if (isset($arrayidnom[0])) {
      $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON plan.idelemento = en.idelemento ";
      $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
    }

    $cadenaautoresinvol="(plan.idusuariocrea = {$datos->idusuariosession} 
                            OR i.idusuario = {$datos->idusuariosession}) ";

    if (isset($arrayidautores[0]) || isset($arrayidinvolucrados[0])) {
      if (isset($arrayidautores[0])) {
        $cadenaautoresinvol = " (plan.idusuariocrea IN (" . $arrayidautores . ")";
        if (isset($arrayidinvolucrados[0])) {
          $cadenaautoresinvol .= " OR ";
        }
      }
      if (isset($arrayidinvolucrados[0])) {
        if (!isset($arrayidautores[0])) {
          $cadenaautoresinvol = " ";
        }
        $cadenaautoresinvol
                      .= " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
      }
      $cadenaautoresinvol .= (isset($arrayidautores[0])) ? ")" : "";
    }

    $cadena_where1="";
    if ($fechainicioD != null && $fechafinD != null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where1 .=" (   
              (actpuntualizada.fechainicio >= '$fechainicioD' AND actpuntualizada.fechainicio <= '$fechafinD')  OR
              (actpuntualizada.fechafin >= '$fechainicioD' AND actpuntualizada.fechafin <= '$fechafinD')                                                                
            )";

    }

    if ($fechainicioD != null && $fechafinD == null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where1 .=" (                                                                   
              actpuntualizada.fechainicio >= '$fechainicioD'
            ) ";

    }

    if ($fechainicioD == null && $fechafinD != null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where1 .=" (                                                                   
                       actpuntualizada.fechafin <= '$fechafinD')                   
             ";
    }

    $cadena_where1 = ($cadena_where1=="")?"":" AND ".$cadena_where1;

    $connA = Doctrine_Manager:: connection();
    $cadena  = "   SELECT 
  DISTINCT(act.idactividad), 
  plan.denelemento as denomactividad,
  to_char(act.fechainicio, 'dd/mm/YYYY') as fechainicio,
  act.fechafin,
  act.horainicio,
  act.horafin,
  act.lugar,
  plan.dirigente,
  plan.participante,  
  planpuntualizada.denelemento as puntualizcion,
  actpuntualizada.fechainicio as fechainiciopuntualizacion,
  actpuntualizada.fechafin as fechafinpuntualizacion,
  actpuntualizada.horainicio as horainiciopuntualizacion,
  actpuntualizada.horafin as horafinpuntualizacion,
  actpuntualizada.lugar as lugarpuntualizacion,
  planpuntualizada.dirigente as dirigentepuntualizacion,
  planpuntualizada.participante as participantepuntualizacion,
  (select array (SELECT 
  mod_objetivos.dat_observaciones_pdo.cuerpo
FROM
  mod_objetivos.dat_observaciones_pdo
WHERE
  mod_objetivos.dat_observaciones_pdo.idelemento = act.idactividad)) as observaciones
  
  
FROM

  mod_objetivos.dat_elementos plan
  
   inner join mod_objetivos.dat_actividades act ON (plan.idelemento = act.idactividad)
   
   inner join mod_objetivos.dat_puntualizacionaprobada ap on (ap.idactividad = act.idactividad)  
   
   
   inner join mod_objetivos.dat_actividades actpuntualizada ON (actpuntualizada.idactividad = ap.idactividad)
   
   inner join mod_objetivos.dat_elementos planpuntualizada on (planpuntualizada.idelemento = ap.idactividad)
   
   LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                  ON (ei.idelemento = plan.idelemento) 
                
                  LEFT JOIN mod_objetivos.dat_involucrados i 
                  ON (ei.idinvolucrado = i.idinvolucrado)
                  
   
   $joinnom               
                  
                  
   WHERE 
                 $cadenaautoresinvol
                 
                 $joinplan
                 
                 $cadenanom
                 
                 
                      
                            
                            $cadena_where1             
   

                 ";


//    print_r($cadena);die;

    $res = $connA->execute($cadena);
    $result = $res->fetchAll();
    return $result;
  }

  public function getDatosPuntualizacionGobierno($datos){

    $joinnom = '';
    $cadenanom = '';

    $joinplan='';

    if($datos->str_idelementos!="") {
      $joinplan.= " AND plan.idelemento in ($datos->str_idelementos) ";
    }
    if($datos->str_idelementos=="" && $datos->idplan!="")
      return array();

    $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
    $fechafinD = $datos->arraydatosreporte['fechafinD'];

    $arrayidautores = implode(',', $datos->arrayidautores);
    $arrayidinvolucrados = implode(',', $datos->arrayidinvolucrados);

    $arrayidnom = implode(',', $datos->arrayidnom);

    //cadena sql con los nomencladores
    if (isset($arrayidnom[0])) {
      $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON plan.idelemento = en.idelemento ";
      $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
    }

    $cadenaautoresinvol="(plan.idusuariocrea = {$datos->idusuariosession} 
                            OR i.idusuario = {$datos->idusuariosession}) ";

    if (isset($arrayidautores[0]) || isset($arrayidinvolucrados[0])) {
      if (isset($arrayidautores[0])) {
        $cadenaautoresinvol = " (plan.idusuariocrea IN (" . $arrayidautores . ")";
        if (isset($arrayidinvolucrados[0])) {
          $cadenaautoresinvol .= " OR ";
        }
      }
      if (isset($arrayidinvolucrados[0])) {
        if (!isset($arrayidautores[0])) {
          $cadenaautoresinvol = " ";
        }
        $cadenaautoresinvol
                      .= " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
      }
      $cadenaautoresinvol .= (isset($arrayidautores[0])) ? ")" : "";
    }

    $cadena_where1="";
    if ($fechainicioD != null && $fechafinD != null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where1 .=" (   
              (actpuntualizada.fechainicio >= '$fechainicioD' AND actpuntualizada.fechainicio <= '$fechafinD')  OR
              (actpuntualizada.fechafin >= '$fechainicioD' AND actpuntualizada.fechafin <= '$fechafinD')                                                                
            )";

    }

    if ($fechainicioD != null && $fechafinD == null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where1 .=" (                                                                   
              actpuntualizada.fechainicio >= '$fechainicioD' 
            ) ";

    }

    if ($fechainicioD == null && $fechafinD != null) {
      $cadena_where1 .= ($cadena_where1=="")?"":" AND ";
      $cadena_where1 .=" (                                                                   
                       actpuntualizada.fechafin <= '$fechafinD')                   
             ";
    }

    $cadena_where1 = ($cadena_where1=="")?"":" AND ".$cadena_where1;

    $connA = Doctrine_Manager:: connection();
    $cadena  = "   
                SELECT 
                  DISTINCT(arc.idarc),
                  arc.denarc, 
                  plan.denelemento as denomacti,
                  act.idactividad,
                  act.fechainicio,
                  act.fechafin,
                  act.horainicio,
                  act.horafin,
                  act.lugar,
                  plan.dirigente,
                  plan.participante,  
                  planpuntualizada.denelemento as puntualizcion,
                  actpuntualizada.fechainicio as fechainiciopuntualizacion,
                  actpuntualizada.fechafin as fechafinpuntualizacion,
                  actpuntualizada.horainicio as horainiciopuntualizacion,
                  actpuntualizada.horafin as horafinpuntualizacion,
                  actpuntualizada.lugar as lugarpuntualizacion,
                  planpuntualizada.dirigente as dirigentepuntualizacion,
                  planpuntualizada.participante as participantepuntualizacion,
                  (select array (SELECT 
                  mod_objetivos.dat_observaciones_pdo.cuerpo
                  FROM
                  mod_objetivos.dat_observaciones_pdo
                  WHERE
                  mod_objetivos.dat_observaciones_pdo.idelemento = act.idactividad)) as observaciones
                    
                  FROM

                  mod_objetivos.dat_elementos plan
                  
                   inner join mod_objetivos.dat_actividades act ON (plan.idelemento = act.idactividad)
                   
                   inner join mod_objetivos.dat_puntualizacionaprobada ap on (ap.idactividad = act.idactividad)  
                   
                   
                   inner join mod_objetivos.dat_actividades actpuntualizada ON (actpuntualizada.idactividad = ap.idactividad)
                   
                   inner join mod_objetivos.dat_elementos planpuntualizada on (planpuntualizada.idelemento = ap.idactividad)
                   
                   inner join mod_objetivos.dat_arc_dat_plan_actividades arcact on (arcact.idactividad = act.idactividad)
                   
                   inner join mod_objetivos.dat_arc arc on (arc.idarc = arcact.idarc)
                   
                      LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                  ON (ei.idelemento = plan.idelemento) 
                
                  LEFT JOIN mod_objetivos.dat_involucrados i 
                  ON (ei.idinvolucrado = i.idinvolucrado)
   
                  
                  $joinnom 
                   
                 WHERE 
                     $cadenaautoresinvol
                     
                     $joinplan
                     
                     $cadenanom
                      
                            
                            $cadena_where1   
                   
                   order by      
                  arc.denarc, 
                  act.idactividad,  
                  plan.denelemento,
                  arc.idarc
                 ";
//    print_r($cadena);die;
    $res = $connA->execute($cadena);
    $result = $res->fetchAll();
    return $result;
  }


}

//fin clase 

