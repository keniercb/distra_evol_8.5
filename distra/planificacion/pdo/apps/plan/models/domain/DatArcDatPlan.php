<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArcDatPlan extends BaseDatArcDatPlan
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatPlanPdo', array('local' => 'idplan', 'foreign' => 'idplan')
        );
    }


  public function getActPlan($idplan, $idusuariocrea,& $arrayTareas)
  {
    $hijos1 = DatElementosDatElementos::HijosDadoIdPadre($idplan, $idusuariocrea);
    $hijos2 = self::ObtenerArcPorPlanesSQL($idplan, $idusuariocrea);
    $hijos = array();
    $hijos = array_merge(
      $hijos, $hijos1, $hijos2
    );
    foreach ($hijos as $hijo) {
      if ($hijo['idtipoelemento'] == 3) {
        array_push($arrayTareas, $hijo['idelementohijo']);
      }
      if ($hijo['idtipoelemento'] == 32) {
        $hijos4 = DatArcDatPlanActividades::getArcPlanActSQL($idplan, $hijo['idelementohijo']);
        $hijos5=DatArcDatPlanObjetivo::ObtenerObjDadoPlanARCReporte($idplan, $hijo['idelementohijo']);
        $hijos4 = array_merge(
          $hijos4, $hijos5
        );
        foreach ($hijos4 as $hijo4) {
          if ($hijo4['idtipoelemento'] == 3) {
            array_push($arrayTareas, $hijo4['idelementohijo']);
          }
          self::getActPlan($hijo4['idelementohijo'], $idusuariocrea,$arrayTareas);
        }
      }
      self::getActPlan($hijo['idelementohijo'], $idusuariocrea,$arrayTareas);
    }
    return $arrayTareas;
  }
    /*
      public function Buscar($idarc)
      {
      $temp = $this->conn->getTable('DatArcDatPlan')
      ->find($idarc);
      return $temp->toArray();
      }
      public function GetTodos()
      {
      $query = new Doctrine_Query();
      $result = $query->from('DatArcDatPlan o')
      ->execute ();
      return $result->toArray();
      }
      public function GetPorLimite($limite = 10,$inicio = 0)
      {
      $query = new Doctrine_Query();
      $result = $query->from('DatArcDatPlan')
      ->limit($limite = 10)
      ->offset($inicio = 0)
      ->execute ();
      return $result->toArray();
      }
      public function CargarPlanesXArea($idusuario,$idarea)
      {
      $query = new Doctrine_Query();
      $result = $query->select('pp.idplan, apo.idarc, e.denelemento')/
      ->from ('DatArcDatPlan apo')
      ->innerJoin('apo.DatPlanPdo pp')
      ->innerJoin('pp.DatElementos e')
      ->where("apo.idarc='$idarea' AND e.idusuariocrea='$idusuario'")
      ->setHydrationMode( Doctrine :: HYDRATE_ARRAY )
      ->execute();
      return $result;
      }
      public function buscarAreas($idareas)
      {
      $sqlBuscarAreas	= ' ';
      $cant					= count($idareas);
      $i						= 1 ;
      foreach($idareas as $area=>$a)
      {
      if( $i == $cant)
      $sqlBuscarAreas	.= ' ap.idarc =  '.$a['_id'].' ';
      else
      $sqlBuscarAreas	.= ' ap.idarc =  '.$a['_id'].' OR';
      $i	++;
      }
      $query = Doctrine_Query::create();
      return   $res = $query->from('DatArcDatPlan ap')
      ->where($sqlBuscarAreas)
      ->execute()->toArray();
      }
      public function EliminarPlnsDadoIdarc($idarc)
      {
      $query = new Doctrine_Query();
      $result = $query->delete( 'DatArcDatPlan ap' )
      ->where ( "ap.idarc = '$idarc'" )
      ->setHydrationMode( Doctrine :: HYDRATE_ARRAY )
      ->execute ();
      return $result;
      }
      public function ObtenerAreasPorPlanesSQL($idplan)
      {
      $cadena = "SELECT ap.idarc,a.denarc,a.idarcp
      FROM mod_objetivos.dat_arc_dat_plan ap
      INNER JOIN mod_objetivos.dat_arc a ON a.idarc = ap.idarc
      WHERE ap.idplan = '$idplan'";
      $conn2 = Doctrine_Manager :: connection ();
      $res = $conn2->execute($cadena);
      $result = $res->fetchAll();
      return $result;
      }
      public function ObtenerIdAreasPorPlanes($idplan)
      {
      $query = new Doctrine_Query();
      $result = $query->select('o.idarc')->from('DatArcDatPlan o')
      ->where("o.idplan = $idplan")
      ->execute ();
      return $result->toArray();
      }
      public function ObtenerRelacionPlanArc($idplan,$idarc)
      {
      $query = new Doctrine_Query();
      $result = $query->from('DatArcDatPlan ap')
      ->where("ap.idplan = $idplan AND ap.idarc = $idarc")
      ->execute ();
      return $result->toArray();
      }

     */

//-----------------------------------------------------------------------------

    /*
     *
     * Consulta que retorna un array de relaciones arc-plan dado un idarc
     */
    public function ExisteAreaEnPlan($idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlan ap')
            ->where("ap.idarc = $idarc")
            ->execute();
        return $result->toArray();
    }

    /*
     *
     * Consulta que retorna un array segun el idplan
     */

    /*
     *
     * Consulta que retorna un array segun el idplan
     */

    public function ObtenerAreasPorPlanes($idplan)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlan o')
            ->where("o.idplan = $idplan")
            ->execute();
        return $result->toArray();
    }

    /*
     *
     * Consulta que retorna un array sin arc hijas segun el idplan
     */

    public function ObtenerAreasPorPlanesNohijas($idplan)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT * FROM mod_objetivos.dat_arc_dat_plan ap
                INNER JOIN mod_objetivos.dat_arc a ON a.idarc = ap.idarc
                WHERE ap.idplan = '$idplan' AND a.idarcp = a.idarc AND a.activo = 1 ";
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function getDatosCaracterizacionPlanRango($datos)
    {
      $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
      $fechafinD = $datos->arraydatosreporte['fechafinD'];

      $whereplan=($datos->idplan!='')?" AND
                               ap.idplan = $datos->idplan ": "";

      $wherefecha="";

      if ($fechainicioD != null && $fechafinD != null){
        $wherefecha=" AND ( da.fechainicio >= '$fechainicioD' and da.fechafin <= '$fechafinD' ) ";
      }

      if ($fechainicioD != null && $fechafinD == null){
        $wherefecha=" AND ( da.fechainicio >= '$fechainicioD' ) ";
      }

      if ($fechainicioD == null && $fechafinD != null){
        $wherefecha=" AND ( da.fechafin <= '$fechafinD' ) ";
      }

      $connA = Doctrine_Manager:: connection();
      $cadena
             = " 
                select 
                r.idarc,
                r.denarc,
                sum (cantidadactividades) as cantidadtotalactividades,
                sum (cantidadtareas) as cantidadtotaltareas,
                sum (actexterna) as cantidadactexterna,
                sum (tareaasegexterna) as cantidadtareaasegexterna,
                sum(actpropia) as cantidadactpropia,
                sum(tareaasegpropia) as cantidadtareaasegpropia
                from 
                (
                
                SELECT 
                ap.idarc
                ,a.denarc
                ,de.idusuariocrea as idusuariocreaactividad
                ,aap.idactividad
                ,de.denelemento as actividad
                ,di.idusuario as idusuarioinvolucrado
                ,( count (distinct de.denelemento)) as cantidadactividades
                ,( count (detarea.denelemento)) as cantidadtareas
                ,(case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end )  as actexterna
                ,sum(  case when $datos->idusuariosession <> ee.idautor and ee.idautor in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0 end)    as tareaasegexterna
                ,sum  (case when $datos->idusuariosession = de.idusuariocrea or de.idusuariocrea in  (select p.idpsobre from mod_objetivos.dat_permiso  p where p.idppara = $datos->idusuariosession ) then 1  else 0  end )  as actpropia 
                ,sum  (case when $datos->idusuariosession = ee.idautor or ee.idautor in  (select p.idpsobre from mod_objetivos.dat_permiso  p where p.idppara = $datos->idusuariosession ) then 1  else 0  end )  as tareaasegpropia 
                
                        FROM mod_objetivos.dat_arc_dat_plan ap 
                        INNER JOIN mod_objetivos.dat_arc a  ON a.idarc = ap.idarc        
                        INNER JOIN mod_objetivos.dat_arc_dat_plan_actividades aap on ( aap.idplan = ap.idplan and aap.idarc = ap.idarc)        
                        INNER JOIN mod_objetivos.dat_elementos de on (aap.idactividad = de.idelemento)  
                        INNER join mod_objetivos.dat_actividades da on (da.idactividad = de.idelemento AND da.suspendida=0)        
                        left join mod_objetivos.dat_elementos_dat_involucrados aei on (aei.idelemento = aap.idactividad   ) 
                        left join mod_objetivos.dat_involucrados di on (di.idinvolucrado = aei.idinvolucrado)   
                        left join mod_objetivos.dat_elementos_dat_elementos ee on (ee.idelementopadre = aap.idactividad and ee.origen = 0)
                        left JOIN mod_objetivos.dat_elementos detarea on (detarea.idelemento = ee.idelementohijo)         
                        left join mod_objetivos.dat_actividades datareas on (datareas.idactividad = detarea.idelemento) 
                        
                        WHERE 
                        (  aap.idautor = $datos->idusuariosession or di.idusuario = $datos->idusuariosession )
                        
                        $whereplan
                
                        $wherefecha
                
                     group by 
                     ap.idarc
                ,a.denarc
                ,de.idusuariocrea
                ,aap.idactividad
                ,de.denelemento 
                ,di.idusuario 
                   )r
                      group by r.idarc,
                r.denarc 
                        ORDER BY denarc  ";

//      print_r($cadena);die;

      $res = $connA->execute($cadena);
      $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
      return $resultado;
    }

    public function getDatosCaracterizacionCumplimiento($datos)
    {

      $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
      $fechafinD = $datos->arraydatosreporte['fechafinD'];

      $arrayTareas=array();
      $str_idelementos="";
      if($datos->idplan!=''){
        self::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
        foreach ($arrayTareas as $value){
          $str_idelementos.= ($str_idelementos=="")?$value:",".$value;
        }
      }

      if($str_idelementos=="")
        return array();

      $wherefecha="";

      if ($fechainicioD != null && $fechafinD != null){
        $wherefecha=" AND ( da.fechainicio >= '$fechainicioD' and da.fechafin <= '$fechafinD' ) ";
      }

      if ($fechainicioD != null && $fechafinD == null){
        $wherefecha=" AND ( da.fechainicio >= '$fechainicioD' ) ";
      }

      if ($fechainicioD == null && $fechafinD != null){
        $wherefecha=" AND ( da.fechafin <= '$fechafinD' ) ";
      }

      $connA = Doctrine_Manager:: connection();
      $cadena
             = " 
          select 
          
          sum (r.cantidadactividades) as cantidadtotalactividades,
          sum (r.cumplidas) as cantidadcumplidas,
          sum (r.simcumplir) as cantidadsincumplir,
          sum (r.pospuestaosuspendidas) as pospuestaosuspendidas, 
          sum (r.actextraplan) as cantidadactextraplan,
          sum (r.actexterna) as cantidadactexterna,
          sum (r.externascumplidas) as cantidadexternascumplidas,
          sum(r.externassimcumplir) as cantidadexternassimcumplir,
          sum(r.externaspospuestaosuspendidas) as externaspospuestaosuspendidas,
          sum (r.externaactextraplan) as cantidadexternasactextraplan
          
          
          from 
          (
          
          
          SELECT 
          de.idusuariocrea as idusuariocreaactividad
          ,de.denelemento as actividad
          ,de.gradocumplimiento
          --,di.idusuario as idusuarioinvolucrado
          ,( count (distinct de.denelemento)) as cantidadactividades
          
          
          
          ,case when de.gradocumplimiento = 100 then 1 else 0 end as cumplidas
          ,case when de.gradocumplimiento <> 100 then 1 else 0 end as simcumplir
          
          --
          ,case when da.suspendida = 1 then 1 else case when actpuntualizada.fechainicio > da.fechainicio or actpuntualizada.fechafin > da.fechafin then 1 else 0 end end as pospuestaosuspendidas
          --
            , case when actpuntualizada.fechainicio > da.fechainicio or actpuntualizada.fechafin > da.fechafin then 1 else 0 end as pospuesta 
          ,case when da.suspendida = 1 then 1 else 0 end as suspendidas
          
          ,case when de.fechacreacion > da.fechafin then 1 else 0 end as actextraplan
          -----------------------------------------------
          ,(case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end )  as actexterna
          
          ,case when de.gradocumplimiento = 100 then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externascumplidas
          ,case when de.gradocumplimiento <> 100 then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externassimcumplir
          
          ,case when da.suspendida = 1 then case when actpuntualizada.fechainicio > da.fechainicio or actpuntualizada.fechafin > da.fechafin then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end else 0 end as externaspospuestaosuspendidas
          
            , case when actpuntualizada.fechainicio > da.fechainicio or actpuntualizada.fechafin > da.fechafin then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externapospuesta 
          
          
          ,case when da.suspendida = 1 then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externassuspendidas
          
          ,case when de.fechacreacion > da.fechafin then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externaactextraplan
          
          ,de.fechacreacion
          ,da.fechainicio
          ,da.fechafin
          
          
           ,actpuntualizada.fechainicio as fechainiciopuntualizacion
           ,actpuntualizada.fechafin as fechafinpuntualizacion
            
           
            
            
                  FROM mod_objetivos.dat_elementos de 
                  inner join mod_objetivos.dat_actividades da on (da.idactividad = de.idelemento)        
                  left join mod_objetivos.dat_elementos_dat_involucrados aei on (aei.idelemento = de.idelemento   ) 
                  left join mod_objetivos.dat_involucrados di on (di.idinvolucrado = aei.idinvolucrado)   
                  left join mod_objetivos.dat_puntualizacionaprobada actpuntualizada on (actpuntualizada.idactividad = da.idactividad and actpuntualizada.ultima=1)  
                	--inner join mod_objetivos.dat_actividades actpuntualizada ON (actpuntualizada.idactividad = ap.idactividadpuntualizacion)
             	  	--inner join mod_objetivos.dat_elementos planpuntualizada on (planpuntualizada.idelemento = ap.idactividadpuntualizacion)
             
             
                  
                  WHERE 
                  de.idelemento in ($str_idelementos)
                  
          and  (  de.idusuariocrea = $datos->idusuariosession or di.idusuario = $datos->idusuariosession )
          
          $wherefecha
          
               group by 
           de.idusuariocrea
          ,de.denelemento 
          --,di.idusuario
          ,de.gradocumplimiento
          ,da.suspendida
          ,de.fechacreacion
          ,da.fechafin
          
          ,da.fechainicio
          ,actpuntualizada.fechainicio
          ,actpuntualizada.fechafin
           )r  ";

//      print_r($cadena);die;
      $res = $connA->execute($cadena);
      $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
      return $resultado;
    }


    public function getDatosCaracterizacionPuntualizaciones($datos)
    {
      $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
      $fechafinD = $datos->arraydatosreporte['fechafinD'];

      $arrayTareas=array();
      $str_idelementos="";
      if($datos->idplan!=''){
        self::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
        foreach ($arrayTareas as $value){
          $str_idelementos.= ($str_idelementos=="")?$value:",".$value;
        }
      }

      if($str_idelementos=="")
        return array();

      $wherefecha="";

      if ($fechainicioD != null && $fechafinD != null){
        $wherefecha=" AND ( da.fechainicio >= '$fechainicioD' and da.fechafin <= '$fechafinD' ) ";
      }

      if ($fechainicioD != null && $fechafinD == null){
        $wherefecha=" AND ( da.fechainicio >= '$fechainicioD' ) ";
      }

      if ($fechainicioD == null && $fechafinD != null){
        $wherefecha=" AND ( da.fechafin <= '$fechafinD' ) ";
      }

      $connA = Doctrine_Manager:: connection();
      $cadena
             = " 
                select 
              sum (r.cantidadactividades) as cantidadtotalactividades,
              sum (r.cumplidas) as cantidadcumplidas,
              sum (r.simcumplir) as cantidadsincumplir,
              sum (r.actextraplan) as cantidadactextraplan,
              sum (r.modificada) as cantidadmodificadas,
              sum (r.pospuesta) as cantidadpospuestas,
              sum (r.suspendidas) as cantidadsuspendidas,
              sum (r.actexterna) as cantidadactexterna,
              sum (r.externascumplidas) as cantidadexternascumplidas,
              sum(r.externassimcumplir) as cantidadexternassincumplir,
              sum (r.externaactextraplan) as cantidadexternasactextraplan,
              sum (r.externamodificada) as cantidadexternasmodificadas,
              sum (r.externapospuesta) as cantidadexternaspospuestas,
              sum(r.externassuspendidas) as cantidadexternassuspendidas
              
              
              from 
              (
              
              
              SELECT 
              de.idusuariocrea as idusuariocreaactividad
              ,de.denelemento as actividad
              ,de.gradocumplimiento
              ,di.idusuario as idusuarioinvolucrado
              ,( count (distinct de.denelemento)) as cantidadactividades
              
              ,case when de.gradocumplimiento = 100 then 1 else 0 end as cumplidas
              ,case when de.gradocumplimiento <> 100 then 1 else 0 end as simcumplir
              ,case when de.fechacreacion > da.fechafin then 1 else 0 end as actextraplan
              
                , case when actpuntualizada.fechainicio <> da.fechainicio or actpuntualizada.fechafin <> da.fechafin then 1 else 0 end as modificada
                , case when actpuntualizada.fechainicio > da.fechainicio or actpuntualizada.fechafin > da.fechafin then 1 else 0 end as pospuesta 
              ,case when da.suspendida = 1 then 1 else 0 end as suspendidas
              -----------------------------------------------
              ,(case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end )  as actexterna
              
              ,case when de.gradocumplimiento = 100 then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externascumplidas
              ,case when de.gradocumplimiento <> 100 then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externassimcumplir
              
              ,case when de.fechacreacion > da.fechafin then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externaactextraplan
              
              
                , case when actpuntualizada.fechainicio <> da.fechainicio or actpuntualizada.fechafin <> da.fechafin then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externamodificada
                , case when actpuntualizada.fechainicio > da.fechainicio or actpuntualizada.fechafin > da.fechafin then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externapospuesta 
              
              
              ,case when da.suspendida = 1 then (case when $datos->idusuariosession <> de.idusuariocrea and de.idusuariocrea in  (select p.idppara from mod_objetivos.dat_permiso  p where p.idpsobre = $datos->idusuariosession ) then 1  else 0  end ) else 0 end as externassuspendidas
              
              
              ,de.fechacreacion
              ,da.fechainicio
              ,da.fechafin
              
              
               ,actpuntualizada.fechainicio as fechainiciopuntualizacion
               ,actpuntualizada.fechafin as fechafinpuntualizacion
                
               
                
                
                      FROM mod_objetivos.dat_elementos de 
                      inner join mod_objetivos.dat_actividades da on (da.idactividad = de.idelemento)        
                      left join mod_objetivos.dat_elementos_dat_involucrados aei on (aei.idelemento = de.idelemento   ) 
                      left join mod_objetivos.dat_involucrados di on (di.idinvolucrado = aei.idinvolucrado)   
                      inner join mod_objetivos.dat_puntualizacionaprobada ap on (ap.idactividad = da.idactividad /*and de.idestadoaprob  = ap.idestadoaprobpunt*/)  
                    	inner join mod_objetivos.dat_actividades actpuntualizada ON (actpuntualizada.idactividad = ap.idactividad)
                 		inner join mod_objetivos.dat_elementos planpuntualizada on (planpuntualizada.idelemento = ap.idactividad)
                 
                 
                      
                      WHERE 
                       (  de.idusuariocrea = $datos->idusuariosession or di.idusuario = $datos->idusuariosession )
                   
                    AND  de.idelemento in ($str_idelementos)
                      
               
              
              $wherefecha
              
                   group by 
               de.idusuariocrea
              ,de.denelemento 
              ,di.idusuario
              ,de.gradocumplimiento
              ,da.suspendida
              ,de.fechacreacion
              ,da.fechafin
              
              ,da.fechainicio
              ,actpuntualizada.fechainicio
              ,actpuntualizada.fechafin
               )r  ";

//      print_r($cadena);die;
      $res = $connA->execute($cadena);
      $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
      return $resultado;
    }


    public function ObtenerAreasPorPlanesHijas($idplan, $idarc)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT * FROM mod_objetivos.dat_arc_dat_plan ap
                    INNER JOIN mod_objetivos.dat_arc a ON a.idarc = ap.idarc
                    WHERE ap.idplan = '$idplan' AND a.idarcp <> a.idarc 
                    AND a.idarcp = '$idarc' AND a.activo = 1";
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function datosRelacionPlanArc($idarc)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlan ap')
            ->where("ap.idarc = $idarc")
            ->execute();
        return $result->toArray();
    }

    public function ObtenerAreasPorPlanesSQL($idplan)
    {
        $cadena
            = "SELECT ap.idarc,a.denarc,a.idarcp, a.orden
                    FROM mod_objetivos.dat_arc_dat_plan ap
                    INNER JOIN mod_objetivos.dat_arc a
                    ON a.idarc = ap.idarc
                    WHERE ap.idplan = '$idplan'
                    GROUP BY ap.idarc,a.denarc, a.idarcp, a.orden
                    ORDER BY a.orden ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
//        print_r($cadena);die;
        $result = $res->fetchAll(PDO::FETCH_ASSOC);

//        try{
//          usort($result, function ($a1, $a2) {
//            $num_roman1=explode('-', trim($a1['denarc']))[0];
//            $num_roman2=explode('-', trim($a2['denarc']))[0];
//            if(strlen($num_roman1)>3 || $num_roman1=="")
//              $num_roman1="M";
//            if(strlen($num_roman2)>3 || $num_roman2=="")
//              $num_roman2="M";
//
//            $v1 = self::converRomanToInteger($num_roman1);
//            $v2 = self::converRomanToInteger($num_roman2);
//            return ($v1 < $v2) ? -1 : 1;
//          });
//        }catch (Exception $e){
//          return  $result;
//        }

        return  $result;
    }

    public function converRomanToInteger($num) {
      $number = new Zend_Measure_Number($num, Zend_Measure_Number::ROMAN);
      $number->convertTo (Zend_Measure_Number::DECIMAL);
      return $number->getValue();
    }

    public function ObtenerArcPorPlanesSQL($idplan, $idautor)
    {
      $cadena
             = "SELECT ap.idarc as idelementohijo,32 as idtipoelemento
                    FROM mod_objetivos.dat_arc_dat_plan ap
                    INNER JOIN mod_objetivos.dat_arc a
                    ON a.idarc = ap.idarc
                    WHERE ap.idplan = '$idplan '
                    GROUP BY ap.idarc,a.denarc, a.idarcp
                    ORDER BY a.denarc ";
      $connA = Doctrine_Manager:: connection();
      $res = $connA->execute($cadena);
      //print_r($cadena);die;
      $result = $res->fetchAll(PDO::FETCH_ASSOC);
      return  $result;
    }


    public function getArcHijasPorPlanes($idplan, $idarcp)
    {
        $cadena = " SELECT ap.idarc,a.denarc

                FROM mod_objetivos.dat_arc_dat_plan ap

                INNER JOIN mod_objetivos.dat_arc a
                ON a.idarc = ap.idarc

                WHERE ap.idplan = {$idplan}
                AND a.idarcp = {$idarcp}
                AND a.idarcp != a.idarc ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        //print_r($cadena);die;
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function obtenerPlanDadoArc($idarc, $idautor)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlan ap')
            ->where("ap.idarc = $idarc AND idautorrelacion = $idautor")
            ->execute();
        return $result->toArray();
    }

    public function obtenerArcDadoPlan($idplan, $idautor)
    {
        $query = new Doctrine_Query();
        $result = $query->select('DISTINCT ap.idarc')->from('DatArcDatPlan ap')
            ->where("ap.idplan = $idplan AND idautorrelacion = $idautor")
            ->execute();
        return $result->toArray();
    }

    public function ExisteArea_Plan($idarc, $idplan)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArcDatPlan ap')
            ->where("ap.idarc = $idarc AND ap.idplan = $idplan")
            ->execute();
        return $result->toArray();
    }

}
//fin clase 




