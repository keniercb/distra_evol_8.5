<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatActividades extends BaseDatActividades
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatArcDatPlanActividades',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasOne(
            'DatElementos',
            array('local' => 'idactividad', 'foreign' => 'idelemento')
        );
        $this->hasMany(
            'DatElementosNomNomenclador',
            array('local' => 'idactividad', 'foreign' => 'idelemento')
        );
    }

    public function Buscar($idactividad)
    {
        $temp = $this->conn->getTable('DatActividades')
            ->find($idactividad);
        return $temp;
    }

    public function dameActvsDadoIdObj($idobj)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos e, DatObjetivo o')
            ->innerJoin('e.o')
            ->where('DatElementosDatElementos.idelementopadre = ?', $idobj)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function GetDatosAct($idelemento)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatActividades')->where(
            "idactividad = ?", $idelemento
        )->execute();
        return $result->toArray();
    }

    public function GetDatosActDadoUser($idelemento, $idusuario)
    {
        /*$query = new Doctrine_Query();
        $result = $query->from('DatActividades da')
                ->innerJoin('da.DatElementos e')
                ->where("e.idelemento = ?", $idelemento)
                ->where("e.idusuariocrea = ?", $idusuario)
                ->execute();
        return $result->toArray();*/

        $cadenaQUERY
            = " SELECT a.* , e.*
                   FROM mod_objetivos.dat_actividades a
                    INNER JOIN mod_objetivos.dat_elementos e
                       ON (e.idelemento = a.idactividad)
                         WHERE a.idactividad = {$idelemento}
                             AND e.idusuariocrea = {$idusuario} ";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;


    }

    public function getIdRepeticiones($idelemento)
    {
      $cadena
        = " SELECT 
                 CASE WHEN (SELECT LIST(elem.idelementohijo||'') FROM  mod_objetivos.dat_elementos_dat_elementos elem
                                    INNER JOIN mod_objetivos.dat_elementos dee 
                                    ON (dee.idelemento=elem.idelementohijo)
                                    INNER JOIN mod_objetivos.dat_actividades act 
                                    ON (act.idactividad = dee.idelemento 
                                    --AND act.suspendida=0
                                    ) 
                                    WHERE elem.idelementopadre = e.idelemento
                                        AND elem.origen = 4) = '' THEN NULL ELSE 
                                    (SELECT LIST(elem.idelementohijo||'') FROM  mod_objetivos.dat_elementos_dat_elementos elem
                                    INNER JOIN mod_objetivos.dat_elementos dee 
                                    ON (dee.idelemento=elem.idelementohijo)
                                    INNER JOIN mod_objetivos.dat_actividades act 
                                    ON (act.idactividad = dee.idelemento
                                     --AND act.suspendida=0
                                    ) 
                                    WHERE elem.idelementopadre = e.idelemento
                                        AND elem.origen = 4) END as idrepeticiones
                FROM 
                  mod_objetivos.dat_elementos as e
                  WHERE
                  e.idelemento = " . $idelemento . " ;";                  

      $conn = Doctrine_Manager::connection();
      $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
      return $result;


    }

  public function getInfoActividadArcPlan($idplan, $idarc)
  {
    $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON ar.idactividad = r.idelemento
            WHERE ar.tiporepeticion IS NOT NULL ";

    $cadena = " SELECT apa.idarc, apa.idplan, e.idelemento, e.denelemento,
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
    $res = $connA->execute($cadena);
    $result = $res->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  public function InformeResumenPlanTrabajo($datos)
  {

    $cadenanom = '';
    $cadenaestados = '';
    $joinnom = '';
    $cadenaautoresinvol='';
    $arrayestados = implode(',', $datos->arrayestados);

    //cadena sql con los estados en que puedo ver el documento
    if (isset($arrayestados[0])) {
      $cadenaestados .= " AND de.idestadoaprob IN (" . $arrayestados . ")";
    }

    $arrayidnom = implode(',', $datos->arrayidnom);
    //cadena sql con los nomencladores
    if (isset($arrayidnom[0])) {
      $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON de.idelemento = en.idelemento ";
      $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
    }

    $arrayidautores = implode(',', $datos->arrayidautores);
    $aux_involucrados =
      array_merge(
        $datos->arrayinvolucrados, $datos->arrayidinvolucrados
      );

    $arrayidinvolucrados = implode(',', $aux_involucrados);

    //cadena sql con posibles autores e involucrados

    if (isset($datos->arrayidautores[0]) && !isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " de.idusuariocrea IN (".$arrayidautores.") ";
    }
    else if (!isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " aei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
    }
    else if (isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " (de.idusuariocrea IN (".$arrayidautores.") 
                      OR aei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
    }
    else if (isset($arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " (de.idusuariocrea IN (".$arrayidinvolucrados.") 
                      OR aei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
    }

    $whereplan="";
    if($datos->str_idelementos!=""){
      $whereplan= " AND  de.idelemento in (
                       $datos->str_idelementos
                       ) " ;
    }

    $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
    $fechafinD = $datos->arraydatosreporte['fechafinD'];

    $wherefecha="";

    if ($fechainicioD != null && $fechafinD != null){
      $wherefecha=" AND ( da.fechainicio BETWEEN '$fechainicioD' AND '$fechafinD' or da.fechafin BETWEEN '$fechainicioD' AND '$fechafinD' ) ";
    }

    if ($fechainicioD != null && $fechafinD == null){
      $wherefecha=" AND ( da.fechainicio >= '$fechainicioD' ) ";
    }

    if ($fechainicioD == null && $fechafinD != null){
      $wherefecha=" AND ( da.fechafin <= '$fechafinD' ) ";
    }


    $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON ar.idactividad = r.idelemento
            WHERE ar.tiporepeticion IS NOT NULL ";

    $cadena = "   SELECT
                  de.idusuariocrea as idusuariocreaactividad
                  ,de.denelemento as actividad
                  ,de.gradocumplimiento
                  ,( count (distinct de.denelemento)) as cantidadactividades
                  ,case when de.gradocumplimiento = 100 then 1 else 0 end as cumplidas
                  ,case when de.gradocumplimiento <> 100 then 1 else 0 end as sincumplir
                  ,case when de.fechacreacion > da.fechafin then 1 else 0 end as actextraplan
                  ,case when (select ap.fechainicio from mod_objetivos.dat_puntualizacionaprobada ap where ap.idactividad = da.idactividad and ap.ultima = 1) is not null

                        then

                            case when
                             ((select (ap.fechainicio || ' ' || ap.horainicio) ::timestamp from mod_objetivos.dat_puntualizacionaprobada ap where ap.idactividad = da.idactividad and ap.ultima = 1)
                                    <> (select (dh.fechainicio || ' ' || dh.horainicio) ::timestamp from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion = 1 )
                                or (select (ap.fechafin || ' ' || ap.horafin) ::timestamp from mod_objetivos.dat_puntualizacionaprobada ap where ap.idactividad = da.idactividad and ap.ultima = 1)
                                    <> (select (dh.fechafin || ' ' || dh.horafin) ::timestamp from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion = 1 )

                                or  ((select count (distinct (dh.fechainicio || ' ' || dh.horainicio) ::timestamp) from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion in ( 1,2)) <> 1
                                      or (select count (distinct (dh.fechafin || ' ' || dh.horafin) ::timestamp) from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion in ( 1,2)) <> 1)
                                 )
                                    then 1
                            else
                                0
                            end

              else
                      case when
                               ((select count (distinct (dh.fechainicio || ' ' || dh.horainicio) ::timestamp) from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion in ( 1,2)) <> 1
                                      or (select count (distinct (dh.fechafin || ' ' || dh.horafin) ::timestamp) from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion in ( 1,2)) <> 1)

                                    then 1
                            else
                                0
                            end

              end modificada
                  ,de.fechacreacion
                  ,da.fechainicio
                  ,da.fechafin

                          FROM mod_objetivos.dat_elementos de
                          inner join mod_objetivos.dat_actividades da on (da.idactividad = de.idelemento)
                          left join mod_objetivos.dat_elementos_dat_involucrados aei on (aei.idelemento = de.idelemento   )
                          left join mod_objetivos.dat_involucrados di on (di.idinvolucrado = aei.idinvolucrado)
                          $joinnom

                          WHERE
                           $cadenaautoresinvol
                           
                           $whereplan
                           
                           $cadenanom
                           
                           $cadenaestados
                           
                           $wherefecha

                        ";

    if ($datos->repeticiones == 0) {
      $cadena .=   "AND da.idactividad NOT IN (" . $cadenarepeticion . ")";
    }

    $cadena .= "   
                    group by
                   da.idactividad,
                   de.idusuariocrea
                  ,de.denelemento
                  ,de.gradocumplimiento
                  ,de.fechacreacion
                  ,da.fechafin
                  ,da.fechainicio
                 ";

//    print_r($cadena);die;
    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($cadena);
    $result = $res->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }

  public function ResumenCumplimientoPlanTrabajo($datos)
  {

    $cadenanom = '';
    $cadenaestados = '';
    $joinnom = '';
    $cadenaautoresinvol='';
    $arrayestados = implode(',', $datos->arrayestados);

    //cadena sql con los estados en que puedo ver el documento
    if (isset($arrayestados[0])) {
      $cadenaestados .= " AND de.idestadoaprob IN (" . $arrayestados . ")";
    }

    $arrayidnom = implode(',', $datos->arrayidnom);
    //cadena sql con los nomencladores
    if (isset($arrayidnom[0])) {
      $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON de.idelemento = en.idelemento ";
      $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
    }

    $arrayidautores = implode(',', $datos->arrayidautores);
    $aux_involucrados =
      array_merge(
        $datos->arrayinvolucrados, $datos->arrayidinvolucrados
      );

    $arrayidinvolucrados = implode(',', $aux_involucrados);



   // print_r($arrayidinvolucrados);die;

    //cadena sql con posibles autores e involucrados

    if (isset($datos->arrayidautores[0]) && !isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " de.idusuariocrea IN (".$arrayidautores.") ";
    }
    else if (!isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
                    .=  " aei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
    }
    else if (isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
                    .=  " (de.idusuariocrea IN (".$arrayidautores.") 
                      OR aei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
    }
    else if (isset($arrayidinvolucrados[0])) {
      $cadenaautoresinvol
                    .=  " (de.idusuariocrea IN (".$arrayidinvolucrados.") 
                      OR aei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
    }

    $whereplan="";
    if($datos->str_idelementos!=""){
      $whereplan= " AND  de.idelemento in (
                       $datos->str_idelementos
                       ) " ;
    }

    $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
    $fechafinD = $datos->arraydatosreporte['fechafinD'];

    $wherefecha="";

    if ($fechainicioD != null && $fechafinD != null){
      $wherefecha=" AND ( da.fechainicio BETWEEN '$fechainicioD' AND '$fechafinD' or da.fechafin BETWEEN '$fechainicioD' AND '$fechafinD' ) ";
    }

    if ($fechainicioD != null && $fechafinD == null){
      $wherefecha=" AND ( da.fechainicio >= '$fechainicioD' ) ";
    }

    if ($fechainicioD == null && $fechafinD != null){
      $wherefecha=" AND ( da.fechafin <= '$fechafinD' ) ";
    }


    $cadenarepeticion = "SELECT distinct r.idelemento
            FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_actividades ar 
            ON ar.idactividad = r.idelemento
            WHERE ar.tiporepeticion IS NOT NULL ";

    $whererepeticion="";
    if ($datos->repeticiones == 0) {
      $whererepeticion .=   "AND da.idactividad NOT IN (" . $cadenarepeticion . ")";
    }


    $cadena = "        select  r.nombrecompleto
            ,sum(r.cantidadactividades) as cantidadactividades
            ,sum(r.cumplidas) as cumplidas
            ,sum(r.simcumplir) as sincumplir
            ,sum(r.actextraplan) as actextraplan
            ,sum(r.modificada) as modificada

    from (SELECT
                  de.idusuariocrea as idusuariocreaactividad
                  ,de.denelemento as actividad
                  ,de.gradocumplimiento
                  ,( count (distinct de.denelemento)) as cantidadactividades
                  ,case when de.gradocumplimiento = 100 then 1 else 0 end as cumplidas
                  ,case when de.gradocumplimiento <> 100 then 1 else 0 end as simcumplir
                  ,case when de.fechacreacion > da.fechafin then 1 else 0 end as actextraplan
                  ,case when (select ap.fechainicio from mod_objetivos.dat_puntualizacionaprobada ap where ap.idactividad = da.idactividad and ap.ultima = 1) is not null
                            then
                                case when
                                 ((select (ap.fechainicio || ' ' || ap.horainicio) ::timestamp from mod_objetivos.dat_puntualizacionaprobada ap where ap.idactividad = da.idactividad and ap.ultima = 1)
                                        <> (select (dh.fechainicio || ' ' || dh.horainicio) ::timestamp from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion = 1 )
                                    or (select (ap.fechafin || ' ' || ap.horafin) ::timestamp from mod_objetivos.dat_puntualizacionaprobada ap where ap.idactividad = da.idactividad and ap.ultima = 1)
                                        <> (select (dh.fechafin || ' ' || dh.horafin) ::timestamp from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion = 1 )

                                    or  ((select count (distinct (dh.fechainicio || ' ' || dh.horainicio) ::timestamp) from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion in ( 1,2)) <> 1
                                          or (select count (distinct (dh.fechafin || ' ' || dh.horafin) ::timestamp) from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion in ( 1,2)) <> 1)
                                     )
                                        then 1
                                else
                                    0
                                end

                  else
                          case when
                                   ((select count (distinct (dh.fechainicio || ' ' || dh.horainicio) ::timestamp) from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion in ( 1,2)) <> 1
                                          or (select count (distinct (dh.fechafin || ' ' || dh.horafin) ::timestamp) from mod_objetivos.dat_historial dh where dh.idelemento = da.idactividad  and dh.idaccion in ( 1,2)) <> 1)
                                    then 1
                             else
                                    0
                             end
                  end modificada

                  ,(da.fechainicio || ' ' || da.horainicio) ::timestamp as fechahora

                  ,(select ap.fechainicio from mod_objetivos.dat_puntualizacionaprobada ap where ap.idactividad = da.idactividad and ap.ultima = 1) as fechapunt
                  ,de.fechacreacion
                  ,u.nombreusuario
                  ,case when u.idpersona is null then
                             u.nombreusuario
                          else
                             u.nombreusuario || ' (' ||( select * from mod_objetivos.fa_devolver_nombres_involucrados (array_agg( di.idinvolucrado),1))|| ')'
                        end as nombrecompleto

                          FROM mod_objetivos.dat_elementos de
                          inner join mod_objetivos.dat_actividades da on (da.idactividad = de.idelemento)
                          inner join mod_objetivos.dat_elementos_dat_involucrados aei on (aei.idelemento = de.idelemento   )
                          inner join mod_objetivos.dat_involucrados di on (di.idinvolucrado = aei.idinvolucrado)
                          inner join mod_seguridad.seg_usuario u ON (di.idusuario = u.idusuario)
                          left join mod_persona.dat_persona p on (p.idpersona = u.idpersona)
                          $joinnom
                          
                          WHERE
                          
                         $cadenaautoresinvol

                        
                        $whereplan
                        
                        $cadenaestados
                        
                        $cadenanom
                        
                        $wherefecha
                        
                       $whererepeticion
                    group by
                   da.idactividad,
                   de.idusuariocrea
                  ,de.denelemento
                  ,de.gradocumplimiento
                  ,de.fechacreacion
                  ,u.idpersona
                  ,u.nombreusuario
                 )r
                 
                 group by r.nombrecompleto
                ,r.nombreusuario

                order by r.nombreusuario
                        ";



//    print_r($cadena);die;
    $connA = Doctrine_Manager:: connection();
    $res = $connA->execute($cadena);
    $result = $res->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }



    public function ActualizarInfActividad()
    {
        $query = new Doctrine_Query();
        $array = $this->getData();
        $idactividad = $array['idactividad'];
        $query->update('DatActividades da');
        foreach ($array as $key => $value) {
            if (strlen((string)$value) > 0) {
                $definicion = $this->getTable()->getColumnDefinition($key);
                if ($definicion['type'] != 'numeric') {
                    $value = "'" . $value . "'";
                }
                $query->set('da.' . $key, $value);
            }
        }
        $query->where("da.idactividad = $idactividad")->execute();
    }

    public function actulizarFechaActividad($parametros)
    {
        $query = new Doctrine_Query();
        $query->update('DatActividades da')
            ->set('da.fechainicio', '?', $parametros->fechainicio)
            ->set('da.fechafin', '?', $parametros->fechafin)
            ->where('da.idactividad = ?', $parametros->idactividad)
            ->execute();
        return 1;
    }

    public function actualizarHorarioAct($idactividad, $horainicio, $horafin)
    {
        $query = new Doctrine_Query();
        $query->update('DatActividades da')
            ->set('da.horainicio', '?', $horainicio)
            ->set('da.horafin', '?', $horafin)
            ->where('da.idactividad = ?', $idactividad)
            ->execute();
        return 1;
    }

    public function obtenerRangoDeFechas(
        $arrayidinvolucrados, $fechainicio, $fechafin
    )
    {
        $query = new Doctrine_Query();
        $res = $query->select('da.fechainicio, da.fechafin')
            ->from('DatActividades da')
            ->innerJoin('da.DatElementos e')
            ->innerJoin('e.DatElementosDatInvolucrados ei')
            ->innerJoin('ei.DatInvolucrados i')
            ->where(
                'da.fechainicio >= ? AND da.fechafin <= ?',
                array($fechainicio, $fechafin)
            )
            ->whereIn("i.idusuario", $arrayidinvolucrados)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $res;
    }

    public function verificarConflicto($idinvolucrado, $fechainicio, $fechafin)
    {
        $query = new Doctrine_Query();
        if ($fechafin) {
            $query->addWhere(
                'da.fechainicio >= ? AND da.fechafin <= ? AND i.idusuario = ?',
                array($fechainicio, $fechafin, $idinvolucrado)
            );
        } else {
            $query->addWhere(
                'da.fechainicio <= ? AND da.fechafin >= ? AND i.idusuario = ?',
                array($fechainicio, $fechainicio, $idinvolucrado)
            );
        }
        $result = $query->select(
            'da.fechainicio, da.fechafin, da.horainicio, da.horafin, 
                e.denelemento as denominacion, e.idelemento, ei.idelemento,
                i.idusuario as idusuario'
        )
            ->from('DatActividades da')
            ->innerJoin('da.DatElementos e')
            ->innerJoin('e.DatElementosDatInvolucrados ei')
            ->innerJoin('ei.DatInvolucrados i')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function selecionardatosdeactividad($idelemento)
    {
        $consulta
            = "SELECT a.fechafin, a.fechainicio, a.horainicio, a.horafin
                    FROM mod_objetivos.dat_actividades a
                    WHERE a.idactividad = '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll();
        return $result;
    }

    public function getTarea($idelementohijo)
    {
        $consulta
            = "SELECT t.idtarea AS idactividad, *
                FROM   mod_planifproyecto.dat_tarea t
                WHERE t.idtarea = {$idelementohijo}";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_CLASS);
        return $result;
    }

    public function InsertarAlarma($parametros)
    {
        $var = $parametros->idelemento . ',' . $parametros->idcomparacion . ',' . "'"
            . $parametros->fecha . "'" . ',' .
            "'" . $parametros->hora . "'";

        if ($parametros->porciento == 0) {
            $var = $var . ',null';
        } else {
            $var = $var . ',' . $parametros->porciento;
        }
        if ($parametros->estadocump == '') {
            $var = $var . ',null';
        } else {
            $var = $var . ',' . "'" . $parametros->estadocump . "'";
        }
        if ($parametros->estadoaprov == '') {
            $var = $var . ',null';
        } else {
            $var = $var . ',' . $parametros->estadoaprov;
        }
        try{
            $consulta
                = "INSERT INTO mod_objetivos.dat_alarma(
            idelemento, idcomparacion, fecha, hora, porciento,
            estadocumplimiento, idestadoaprobacion, asunto, idtipoaviso,
            idtipocont, involucrados,cantidaddias)
            VALUES ($var,
            '$parametros->asunto', $parametros->tipoaviso,
            '$parametros->vianotificacion','$parametros->usuarios',$parametros->cantdiashoras)";
            $connA = Doctrine_Manager:: connection();
//            print_r($consulta);die;
            $res = $connA->execute($consulta);
            return 1;
        } catch (Exception $e) {
            return 0;
        }
    }
    public function InsertarAlarmaOld($parametros)
    {
        $var = $parametros->idelemento . ',' . 900000016 . ',' . "'"
            . $parametros->fecha . "'" . ',' .
            "'" . $parametros->hora . "'";

        if ($parametros->porciento == 0) {
            $var = $var . ',null';
        } else {
            $var = $var . ',' . $parametros->porciento;
        }
        if ($parametros->estadocump == '') {
            $var = $var . ',null';
        } else {
            $var = $var . ',' . "'" . $parametros->estadocump . "'";
        }
        if ($parametros->estadoaprov == '') {
            $var = $var . ',null';
        } else {
            $var = $var . ',' . $parametros->estadoaprov;
        }
        //  if (($parametros->idcomparacion) != '') {
        $consulta
            = "INSERT INTO mod_objetivos.dat_alarma(
            idelemento, idcomparacion, fecha, hora, porciento,
            estadocumplimiento, idestadoaprobacion, asunto, idtipoaviso,
            idtipocont, involucrados,cantidaddias)
            VALUES ($var,
            '$parametros->asunto', $parametros->tipoaviso,
            '$parametros->vianotificacion','$parametros->usuarios',$parametros->cantdiashoras)";
        $connA = Doctrine_Manager:: connection();
        //print_r($consulta);die;
        $res = $connA->execute($consulta);
        $result = $res->fetchAll();
        return $result;
    }


    public function listarAlarmasHoraFechaInvolucrado($parametros)
    {
        //  if (($parametros->idcomparacion) != '') {
        $consulta
            = "SELECT DISTINCT (a.idalarma), 
                      a.idelemento,
                      a.idcomparacion, 
                      a.fecha,
                      a.hora,
                      a.porciento,
                      a.estadocumplimiento,
                      a.idestadoaprobacion,
                      a.asunto,
                      a.idtipoaviso,
                      a.idtipocont,
                      a.involucrados, 
                      a.cantidaddias,
                      o.operador,
                      o.descripcion
          FROM mod_objetivos.dat_alarma a 
          INNER JOIN mod_objetivos.nom_operador o
          ON o.idoperador=a.idcomparacion
          WHERE (a.fecha = '{$parametros['fecha']}' AND a.hora = '{$parametros['hora']}')
         -- AND  a.involucrados in ({$parametros['idinvolucrado']})
          ";
//        print_r($consulta);die;
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($consulta)->fetchAll();
        return $result;
    }

    public function listarAlarmas($idelemento)
    {
        //  if (($parametros->idcomparacion) != '') {
        $consulta
            = "SELECT a.idalarma, 
                      a.idelemento,
                      a.idcomparacion, 
                      a.fecha,
                      a.hora,
                      a.porciento,
                      a.estadocumplimiento,
                      a.idestadoaprobacion,
                      a.asunto,
                      a.idtipoaviso,
                      a.idtipocont,
                      a.involucrados, 
                      a.cantidaddias,
                      o.operador,
                      o.descripcion
          FROM mod_objetivos.dat_alarma a 
          INNER JOIN mod_objetivos.nom_operador o
          ON o.idoperador=a.idcomparacion
          WHERE a.idelemento='$idelemento'";
        $connA = Doctrine_Manager:: connection();
        //print_r($consulta);die;
        $result = $connA->execute($consulta)->fetchAll();
        $resultado['resultado'] = $result;
        $resultado['total'] = count($result);
        return $resultado;
    }

    public function verificarAlarma($parametros)
    {
      $currentDateTime = date('Y-m-d H:i:s');

      $consulta
             = " SELECT 
                    a.idalarma,
                    a.idelemento,
                    a.asunto,
                    a.idtipoaviso,
                    a.idcomparacion,
                    a.porciento,
                    a.estadocumplimiento,
                    a.idestadoaprobacion,
                    a.involucrados
                    , a.fecha,
                    a.hora
                    ,(a.fecha ||' '|| a.hora)::timestamp
                  , a.activo  
                  FROM 
                    mod_objetivos.dat_alarma as a 
                    where a.activo=1 and 
                    a.involucrados like '%".$parametros->idusuariocrea."%'
                    and (a.fecha ||' '|| a.hora)::timestamp < ' ".$currentDateTime." ' ";
      $connS = Doctrine_Manager:: connection();
      $resultado = $connS->execute($consulta)->fetchAll();

      return $resultado;
    }

  public function desactivarAlarma($idalarma)
  {
   try{
     $update=" UPDATE 
                    mod_objetivos.dat_alarma
                  SET 
                    activo = 0
                    where  
                    idalarma = $idalarma
                    
                    ";

     $connUP = Doctrine_Manager:: connection();
     $connUP->execute($update);
     return true;
   }catch (Exception $e){
     return false;
   }
  }

    /**
     * Gantt
     */
    public function ActividadesParaGantt($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaFROM
            = " FROM mod_objetivos.dat_actividades a 
                INNER JOIN mod_objetivos.dat_elementos e 
                ON (a.idactividad = e.idelemento) ";
        $cadenaJOIN
            = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                LEFT JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado) ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario} 
                OR i.idusuario = {$parametros->idusuario}) {$cadenaestados} ";
        $cadenaSELECT
            = " SELECT MIN(a.fechainicio) as primerafecha,
                MAX(a.fechafin) AS ultimafecha ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result->fechas = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function planesParaGantt($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaFROM
            = " FROM mod_objetivos.dat_plan_pdo a 
                INNER JOIN mod_objetivos.dat_elementos e 
                ON (a.idplan = e.idelemento) ";
        $cadenaJOIN
            = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                LEFT JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado) ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario} 
                OR i.idusuario = {$parametros->idusuario})  {$cadenaestados} ";
        $cadenaSELECT
            = " SELECT MIN(a.fechainicio) as primerafecha,
                MAX(a.fechafin) AS ultimafecha ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result->fechas = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function arcParaGantt($parametros)
    {
        $cadenaSELECT
            = ' SELECT MIN(a.fechainicio) as primerafecha,
                MAX(a.fechafin) AS ultimafecha ';
        $cadenaFROM
            = ' FROM mod_objetivos.dat_arc a ';
        $cadenaWHERE
            = '  WHERE (a.idusuariocrea = ' . $parametros->idusuario . ' OR
                        a.idarc IN (
                            SELECT ei.idarc
                            FROM mod_objetivos.dat_arc_dat_involucrados ei
                                LEFT JOIN mod_objetivos.dat_involucrados i ON (
                                    ei.idinvolucrado = i.idinvolucrado)
                            WHERE i.idusuario = ' . $parametros->idusuario . '
                        )) ';

        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();

        $result->fechas = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para cargar el combo de planes de gantt
     */
    public function cargarComboPlanes($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaFROM = " FROM mod_objetivos.dat_elementos e ";
        $cadenaJOIN
            = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                LEFT JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado) ";
        $cadenaWHERE
            = " WHERE e.idtipoelemento = 0                         
                AND (e.idusuariocrea = {$parametros->idusuario} 
                OR i.idusuario = {$parametros->idusuario})  {$cadenaestados} ";
        $cadenaSELECT
            = " SELECT e.idelemento AS idplan, e.denelemento As denominacion ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE;

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function objetivosParaGantt($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaFROM
            = " FROM mod_objetivos.dat_objetivo a 
                INNER JOIN mod_objetivos.dat_elementos e 
                ON (a.idobjetivo = e.idelemento) ";
        $cadenaJOIN
            = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                LEFT JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado) ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario} 
                OR i.idusuario = {$parametros->idusuario})  {$cadenaestados}  ";

        $cadenaSELECT
            = " SELECT MIN(a.fechainicio) as primerafecha,
                MAX(a.fechafin) AS ultimafecha ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result->fechas = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para obtener todos los elementos de Gantt
     */
    public function elementosParaGantt($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            ' AND (e.idestadoaprob IN (' . $parametros->arrayestados . ')) '
            : '';
        $cadenaSELECT
            = ' SELECT e.idelemento, e.denelemento, e.gradocumplimiento, 1 as open,
                       e.idtipoelemento, e.actualizarporciento, e.idusuariocrea, dact.idplan as idplanarcact, 
                       dact.idarc as idarcplanact, dobj.idplan as idplanobj, dobj.idarc as idarcobj, 
                       array_agg(eh.idelementopadre) as idelementopadre, 0 as escapitulo, e.idtipoelemento as ordenelemento ';
        $cadenaFROM
            = ' FROM mod_objetivos.dat_elementos e ';
        $cadenaJOIN
            = ' LEFT JOIN mod_objetivos.dat_elementos_dat_elementos eh 
                ON (e.idelemento = eh.idelementohijo AND eh.origen < 4 
                AND eh.idelementopadre IN (SELECT ele.idelemento 
                    FROM mod_objetivos.dat_elementos ele
                    WHERE ele.idtipoelemento IN (0,1,3)))
                LEFT JOIN mod_objetivos.dat_arc_dat_plan_actividades dact 
                ON e.idelemento =  dact.idactividad';
        $cadenaJOIN .= '
                LEFT JOIN mod_objetivos.dat_actividades da on (da.idactividad =
                    e.idelemento and ((da.fechainicio BETWEEN ' . "'$parametros->fechainicio'" . ' and ' . "'$parametros->fechafin'" . ')
                    or (da.fechafin BETWEEN ' . "'$parametros->fechainicio'" . ' and ' . "'$parametros->fechafin'" . ')))';
        $cadenaJOIN .= '
                LEFT JOIN mod_objetivos.dat_arc_dat_plan_objetivo dobj 
                ON e.idelemento =  dobj.idobjetivo ';
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario}
                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaestados} ";
        if ($parametros->denominacion) {
            $cadenaWHERE .= " AND upper(e.denelemento) LIKE '%"
                . strtoupper($parametros->denominacion) . "%'";
        }
        if ($parametros->arrayTiposElementos) {
            $cadenaWHERE .= ' AND e.idtipoelemento IN ('
                . $parametros->arrayTipos . ') ';
        }
        $cadenaCase = ' and (case when e.idtipoelemento = 3 and da.idactividad is null then 0 else 1 end) = 1';
        $cadenaGROUP = ' group by e.idelemento, e.denelemento, e.gradocumplimiento, e.idtipoelemento, e.actualizarporciento, 
                                    e.idusuariocrea, dact.idplan,  dact.idarc, dobj.idplan, dobj.idarc ';

        $cadenaORDER = ' ORDER BY e.idelemento';
        //Mostar ARC
        /*if ($parametros->arrayTipos == '') {
            if ($parametros->listarARC == 'false' && $parametros->listarCapitulos == 'false') {
                $cadenaORDER .= ' ordenelemento, idelemento ';
                $cadenaUNION = ' UNION ' . self::sqlArcParaGantt($parametros);
            } else {
                $result = self::arcParaGannt($parametros);
                return $result;
            }
        } else {
            if ($parametros->listarARC == 'false' && $parametros->listarCapitulos == 'false') {
                $cadenaORDER .= ' e.idelemento ';
                $cadenaUNION = '';
            } else {
                $cadenaORDER .= ' ordenelemento, idelemento ';
                $cadenaUNION = ' UNION ' . self::sqlArcParaGantt($parametros);
            }
        }*/
        //Fin Mostar ARC

        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE . $cadenaCase . $cadenaGROUP . $cadenaUNION . $cadenaORDER;
        /*print_r($cadenaQUERY);
        die;*/
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function sqlArcParaGantt($parametros)
    {
        $cadenaSelect = ' SELECT arc.idarc, arc.denarc, 0 as gradocumplimiento, 1 as open, 4 as idtipoelemento, 0 as actualizarporciento, 
                                arc.idusuariocrea, null as idplanarcact, null as idarcplanact, null as idplanobj, null as idarcobj, 
                                array_agg(arcp.idplan) as idelementopadre, arc.escapitulo, 0.1 as ordenelemento ';
        $cadenaFrom = ' FROM mod_objetivos.dat_arc arc
                             left join mod_objetivos.dat_arc_dat_plan arcp on arc.idarc = arcp.idarc ';
        $cadenaWhere = "WHERE (arc.fechainicio BETWEEN '{$parametros->fechainicio}' and '{$parametros->fechafin}' ) 
                               and (arc.idusuariocrea = $parametros->idusuario" . ' OR arc.idarc IN (
                                    SELECT ei.idarc
                                    FROM mod_objetivos.dat_arc_dat_involucrados ei
                                    LEFT JOIN mod_objetivos.dat_involucrados i ON (ei.idinvolucrado = i.idinvolucrado)
                                    WHERE i.idusuario = ' . $parametros->idusuario . '))';
        if ($parametros->listarCapitulos == 'true' && $parametros->listarARC == 'false') {
            $cadenaWhere .= ' AND arc.escapitulo = 1 ';
        } elseif ($parametros->listarCapitulos == 'false' && $parametros->listarARC == 'true') {
            $cadenaWhere .= ' AND arc.escapitulo = 0 ';
        }
        $cadenaGroup = ' group by arc.idarc, arc.denarc, arc.idusuariocrea, arc.escapitulo ';
        return $cadenaSelect . $cadenaFrom . $cadenaWhere . $cadenaGroup;
    }

    public function arcParaGannt($parametros)
    {
        $cadenaQUERY = self::sqlArcParaGantt($parametros);
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function elementosParaGanttOld1($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            ' AND (e.idestadoaprob IN (' . $parametros->arrayestados . ')) '
            : '';
        $cadenaSELECT
            = ' SELECT e.idelemento, e.denelemento,
                e.gradocumplimiento, 1 as open, e.idtipoelemento,
                e.actualizarporciento, e.idusuariocrea, dact.idplan as idplanact,
                dobj.idplan as idplanobj, eh.idelementopadre ';
        $cadenaFROM
            = ' FROM mod_objetivos.dat_elementos e ';
        $cadenaJOIN
            = ' LEFT JOIN mod_objetivos.dat_elementos_dat_elementos eh 
                ON (e.idelemento = eh.idelementohijo AND eh.origen < 4 
                AND eh.idelementopadre IN (SELECT ele.idelemento 
                    FROM mod_objetivos.dat_elementos ele
                    WHERE ele.idtipoelemento IN (0,1,3)))
                LEFT JOIN mod_objetivos.dat_arc_dat_plan_actividades dact 
                ON e.idelemento =  dact.idactividad';
        $cadenaJOIN .= '
                LEFT JOIN mod_objetivos.dat_actividades da on (da.idactividad =
                    e.idelemento and ((da.fechainicio BETWEEN ' . "'$parametros->fechainicio'" . ' and ' . "'$parametros->fechafin'" . ')
                    or (da.fechafin BETWEEN ' . "'$parametros->fechainicio'" . ' and ' . "'$parametros->fechafin'" . ')))';
        $cadenaJOIN .= '
                LEFT JOIN mod_objetivos.dat_arc_dat_plan_objetivo dobj 
                ON e.idelemento =  dobj.idobjetivo ';
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario}
                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaestados} ";
        if ($parametros->denominacion) {
            $cadenaWHERE .= " AND upper(e.denelemento) LIKE '%"
                . strtoupper($parametros->denominacion) . "%'";
        }
        if ($parametros->arrayTiposElementos) {
            $cadenaWHERE .= ' AND e.idtipoelemento IN ('
                . $parametros->arrayTipos . ') ';
        }
        $cadenaCase = ' and (case when e.idtipoelemento = 3 and da.idactividad is null then 0 else 1 end) = 1';
        $cadenaORDER
            = ' ORDER BY e.idelemento ';
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE . $cadenaCase . $cadenaORDER;
        //print_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );

        return $result;
    }

    public function elementosParaGanttOld0($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaSELECT
            = " SELECT e.idelemento, e.denelemento,
                e.gradocumplimiento, 1 as open, e.idtipoelemento,
                e.actualizarporciento, e.idusuariocrea, dact.idplan as idplanact,
                dobj.idplan as idplanobj, eh.idelementopadre ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_elementos e ";
        $cadenaJOIN
            = " LEFT JOIN mod_objetivos.dat_elementos_dat_elementos eh 
                ON (e.idelemento = eh.idelementohijo AND eh.origen < 4 
                AND eh.idelementopadre IN (SELECT ele.idelemento 
                    FROM mod_objetivos.dat_elementos ele
                    WHERE ele.idtipoelemento IN (0,1,3)))
                LEFT JOIN mod_objetivos.dat_arc_dat_plan_actividades dact 
                ON e.idelemento =  dact.idactividad
                LEFT JOIN mod_objetivos.dat_arc_dat_plan_objetivo dobj 
                ON e.idelemento =  dobj.idobjetivo ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaestados} ";
        if ($parametros->denominacion) {
            $cadenaWHERE .= " AND upper(e.denelemento) LIKE '%"
                . strtoupper($parametros->denominacion) . "%'";
        }
        if ($parametros->arrayTiposElementos) {
            $cadenaWHERE .= " AND e.idtipoelemento IN ("
                . $parametros->arrayTipos . ") ";
        }
        $cadenaORDER
            = " ORDER BY e.idelemento ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE
            . $cadenaORDER;
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
    * Funcion para obtener todos los elemen de planificacion de proyecto de Gantt
    */
    public function elemenDeProyParaGantt($parametros)
    {
        $cadenaSELECT
            = " SELECT e.idelemento, e.denelemento,
                e.gradocumplimiento, 1 as open, e.idtipoelemento,
                e.actualizarporciento, eh.idelementopadre ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_elementos e ";
        $cadenaJOIN
            = " LEFT JOIN mod_objetivos.dat_elementos_dat_elementos eh
                ON (e.idelemento = eh.idelementohijo AND eh.origen < 4
                AND eh.idelementopadre IN (SELECT ele.idelemento
                FROM mod_objetivos.dat_elementos ele
                WHERE ele.idtipoelemento IN (8,9,10))) ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario})
                AND e.idtipoelemento IN (8,9,10) ";
        if ($parametros->denominacion) {
            $cadenaWHERE .= " AND upper(e.denelemento) LIKE '%"
                . strtoupper($parametros->denominacion) . "%'";
        }
        if ($parametros->arrayTiposElementos) {
            $cadenaWHERE .= " AND e.idtipoelemento IN ("
                . $parametros->arrayTipos . ") ";
        }
        $cadenaORDER
            = " ORDER BY e.idelemento ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE
            . $cadenaORDER;
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para obtener un plan de Gantt
     */
    public function planParaGantt($idplan, $parametros)
    {
        $cadena
            = "SELECT p.fechainicio, p.fechafin
                    FROM mod_objetivos.dat_plan_pdo p
                    WHERE p.idplan = $idplan ";
        if ($parametros->fechafin) {
            $cadena
                .= " AND p.fechainicio <= '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadena
                .= " AND p.fechafin >= '{$parametros->fechainicio}' ";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para obtener un proyecto de Gantt
     */
    public function proyectoParaGantt($idproyecto, $parametros)
    {
        $cadena
            = "SELECT p.fechainicio, p.fechafin
                    FROM mod_planifproyecto.dat_proyecto p
                    WHERE p.idproyecto = $idproyecto
                    AND p.plantilla = 0 ";
        if ($parametros->fechafin) {
            $cadena
                .= " AND p.fechainicio < '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadena
                .= " AND p.fechafin > '{$parametros->fechainicio}' ";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para obtener un proyecto de Gantt
     */
    public function hitoParaGantt($idhito, $parametros)
    {
        $cadena
            = "SELECT h.fechainicio, h.fechafin
                    FROM mod_planifproyecto.dat_hito h
                    WHERE h.idhito = $idhito
                    AND h.plantilla = 0 ";
        if ($parametros->fechafin) {
            $cadena
                .= " AND h.fechainicio < '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadena
                .= " AND h.fechafin > '{$parametros->fechainicio}' ";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para obtener un proyecto de Gantt
     */
    public function tareaParaGantt($idtarea, $parametros)
    {
        $cadena
            = "SELECT t.fechainicio, t.fechafin
                    FROM mod_planifproyecto.dat_tarea t
                    WHERE t.idtarea = $idtarea
                    AND t.plantilla = 0 ";
        if ($parametros->fechafin) {
            $cadena
                .= " AND t.fechainicio < '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadena
                .= " AND t.fechafin > '{$parametros->fechainicio}' ";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para obtener un plan de Gantt
     */
    public function objetivoParaGantt($idobjetivo, $parametros)
    {
        $cadena
            = "SELECT o.fechainicio, o.fechafin
                    FROM mod_objetivos.dat_objetivo o
                    WHERE o.idobjetivo =  $idobjetivo ";
        if ($parametros->fechafin) {
            $cadena
                .= " AND o.fechainicio <= '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadena
                .= " AND o.fechafin >= '{$parametros->fechainicio}' ";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para obtener un plan de Gantt
     */
    public function actividadParaGantt($idactividad, $parametros)
    {
        $cadena
            = "SELECT a.fechainicio, a.fechafin
                    FROM mod_objetivos.dat_actividades a
                    WHERE a.idactividad =  $idactividad ";
        if ($parametros->fechafin) {
            $cadena
                .= " AND a.fechainicio <= '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadena
                .= " AND a.fechafin >= '{$parametros->fechainicio}' ";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function fechaArcParaGantt($idarc, $parametros)
    {
        $cadena
            = 'SELECT a.fechainicio, a.fechafin
                    FROM mod_objetivos.dat_arc a
                    WHERE a.idarc = ' . $idarc;
        if ($parametros->fechafin) {
            $cadena
                .= " AND a.fechainicio <= '{$parametros->fechafin}' ";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Funcion para obtener un plan padre de un objetivo
     */
    public function existePadrePlanDeObj($idobjetivo, $idplan)
    {
        $cadena
            = "SELECT po.idplan
            FROM mod_objetivos.dat_arc_dat_plan_objetivo po
            WHERE po.idobjetivo = $idobjetivo
            AND po.idplan = $idplan ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    /*
     * Funcion para obtener un plan padre de una actividad por ARC
     */
    public function existePadrePlanDeAct($idactividad, $idplan)
    {
        $cadena
            = "SELECT po.idplan
            FROM mod_objetivos.dat_arc_dat_plan_actividades po
            WHERE po.idactividad = $idactividad
            AND po.idplan = $idplan ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    /*
     * Funcion para obtener un plan padre de una actividad por elementos
     */
    public function existePadrePlanDeActE($idactividad, $idplan)
    {
        $cadena
            = "SELECT ee.idelementopadre
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            WHERE ee.idelementohijo = $idactividad
            AND ee.idelementopadre = $idplan ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    /*
     * Funcion para obtener un plan padre de una actividad
     */
    public function tipoElemento($idelemento)
    {
        $cadena
            = "SELECT e.idtipoelemento
            FROM mod_objetivos.dat_elementos e
            WHERE e.idelemento =  $idelemento ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function DependenciasDeGantt($parametros)
    {
        $cadenaSELECT
            = " SELECT  ee.idelementopadre, 
                ee.idelementohijo, ee.origen, 3 as type";
        $cadenaFROM = " FROM mod_objetivos.dat_elementos_dat_elementos ee ";
        $cadenaWHERE
            = " WHERE /*ee.idautor = {$parametros->idusuario}
                AND*/ ee.origen > 5; ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /**
     * Pareto
     */
    public function ActividadesParaPareto($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaSELECT
            = "SELECT DISTINCT(e.idelemento) as id,e.idestadoaprob,
                e.actualizarporciento ,e.denelemento as text,
                a.fechainicio as start_date, a.fechafin as end_date, e.peso ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_actividades a 
                INNER JOIN mod_objetivos.dat_elementos e 
                ON (a.idactividad = e.idelemento) ";
        $cadenaJOIN
            = " LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                LEFT JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado)";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario} 
                OR i.idusuario = {$parametros->idusuario})
                AND e.gradocumplimiento < 100 {$cadenaestados} ";
        $cadenaOrder = " ORDER BY e.peso DESC ";
        //Filtros
        if ($parametros->fechainicio) {
            $cadenaWHERE .= " AND a.fechainicio >= '{$parametros->fechainicio}' ";
        }
        if ($parametros->fechafin) {
            $cadenaWHERE .= " AND a.fechafin <= '{$parametros->fechafin}' ";
        }
        if ($parametros->idplan) {
            $cadenaJOIN
                .= " LEFT JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementohijo AND e.idtipoelemento = 3)

                LEFT JOIN mod_objetivos.dat_arc_dat_plan_actividades apa
                ON (e.idelemento =  apa.idactividad ) ";
            $cadenaWHERE
                .= " AND (ee.idelementopadre = {$parametros->idplan}
            OR apa.idplan = {$parametros->idplan}) ";
        }
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE
            . $cadenaOrder;
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        $cadenaSELECTSUM = "SELECT SUM(d.peso) as pesototal FROM ( ";
        $cadenaQUERY
            = $cadenaSELECTSUM . $cadenaSELECT . $cadenaFROM . $cadenaJOIN
            . $cadenaWHERE . $cadenaOrder . " ) AS d ";
        $result->pesototal = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function miPeso($idelemento)
    {
        $cadenaQUERY
            = " SELECT e.peso
                FROM mod_objetivos.dat_elementos e
                WHERE e.idelemento = {$idelemento} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    ////******   Graficas  ********/////
    //Cant de actividades por criterio de evaluacion
    public function actsEvaluacion($parametros)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                    INNER JOIN mod_objetivos.dat_elementos e
                    ON (e.idelemento = a.idactividad)
                    
                    $joininvolucrados

                    WHERE a.criterioevaluacion = " . "'" . $parametros->eval
            . "'" . "
                    {$cadenainvolucrados}
                    {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    // actividades incumplidas hasta la fecha
    public function actIncumplidas($parametros)
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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }


      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
        if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
        ) {
          $cadenainvolucrados
            .= " AND ( ";
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
          $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

                    OR e.idelemento IN (SELECT ei.idelemento
                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
                    LEFT JOIN mod_objetivos.dat_involucrados i
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    WHERE i.idusuario = {$parametros->idusuario})) ";
        }




//        $cadenaQUERY
//            = " FROM mod_objetivos.dat_actividades a
//                    INNER JOIN mod_objetivos.dat_elementos e
//                    ON (e.idelemento = a.idactividad)
//
//                    WHERE e.gradocumplimiento < 100
//                    AND a.fechafin < " . "'" . date('Y-m-d') . "'" . "
//                    AND (e.idusuariocrea = {$parametros->idusuario}
//
//                    OR e.idelemento IN (SELECT ei.idelemento
//                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
//                    LEFT JOIN mod_objetivos.dat_involucrados i
//                    ON (ei.idinvolucrado = i.idinvolucrado)
//                    WHERE i.idusuario = {$parametros->idusuario}))
//                    {$cadenaestados}
//                    {$cadenaFechaI}
//                    {$cadenaFechaF} ";

      $cadenaQUERY
        = " FROM mod_objetivos.dat_actividades a
                    INNER JOIN mod_objetivos.dat_elementos e
                    ON (e.idelemento = a.idactividad)
                    
                    {$joininvolucrados}

                    WHERE e.gradocumplimiento < 100
                    AND a.fechafin < " . "'" . date('Y-m-d') . "'" . "
                    {$cadenainvolucrados}
                    {$cadenaestados}
                    {$cadenaFechaI}
                    {$cadenaFechaF} ";


//        print_r($cadena . $cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    //actividades Parcialmente cumplidas hasta la fecha
    public function actPcumplidas($parametros)
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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.=" AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario})) ";
      }


        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a

                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                {$joininvolucrados}

                WHERE e.gradocumplimiento < 100
                AND e.gradocumplimiento > 0
                AND a.fechafin >= " . "'" . date('Y-m-d') . "'" . "
                {$cadenainvolucrados}
                {$cadenaestados}{$cadenaFechaI}{$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    //actividades No iniciadas
    public function actNoIniciadas($parametros)
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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

                    OR e.idelemento IN (SELECT ei.idelemento
                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
                    LEFT JOIN mod_objetivos.dat_involucrados i
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    WHERE i.idusuario = {$parametros->idusuario})) ";
      }


//        $cadenaQUERY
//            = " FROM mod_objetivos.dat_actividades a
//                INNER JOIN mod_objetivos.dat_elementos e
//                ON (e.idelemento = a.idactividad)
//
//                WHERE e.gradocumplimiento = 0
//                AND a.fechafin >= " . "'" . date('Y-m-d') . "'" . "
//                AND a.fechainicio <= " . "'" . date('Y-m-d') . "'" . "
//                AND (e.idusuariocrea = {$parametros->idusuario}
//
//                OR e.idelemento IN (SELECT ei.idelemento
//                FROM mod_objetivos.dat_elementos_dat_involucrados ei
//                LEFT JOIN mod_objetivos.dat_involucrados i
//                ON (ei.idinvolucrado = i.idinvolucrado)
//                WHERE i.idusuario = {$parametros->idusuario}))
//                {$cadenaestados}{$cadenaFechaI}{$cadenaFechaF}";

        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                {$joininvolucrados}

                WHERE e.gradocumplimiento = 0
                AND a.fechafin >= " . "'" . date('Y-m-d') . "'" . "
                AND a.fechainicio <= " . "'" . date('Y-m-d') . "'" . "
                {$cadenainvolucrados}
                {$cadenaestados}{$cadenaFechaI}{$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    //actividades Cumplidas
    public function actCumplidas($parametros)
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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

                    OR e.idelemento IN (SELECT ei.idelemento
                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
                    LEFT JOIN mod_objetivos.dat_involucrados i
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    WHERE i.idusuario = {$parametros->idusuario})) ";
      }

//        $cadenaQUERY
//            = " FROM mod_objetivos.dat_actividades a
//                INNER JOIN mod_objetivos.dat_elementos e
//                ON (e.idelemento = a.idactividad)
//
//                WHERE e.gradocumplimiento = 100
//                AND (e.idusuariocrea = {$parametros->idusuario}
//
//                OR e.idelemento IN (SELECT ei.idelemento
//                FROM mod_objetivos.dat_elementos_dat_involucrados ei
//                LEFT JOIN mod_objetivos.dat_involucrados i
//                ON (ei.idinvolucrado = i.idinvolucrado)
//                WHERE i.idusuario = {$parametros->idusuario}))
//                {$cadenaestados}{$cadenaFechaI}{$cadenaFechaF}";

        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                {$joininvolucrados}
                 
                WHERE e.gradocumplimiento = 100
                {$cadenainvolucrados}
                {$cadenaestados}{$cadenaFechaI}{$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    //actividades incumplidas sin iniciar y fuera de fecha
    public function incumpSinIFueraFecha($parametros)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

                    OR e.idelemento IN (SELECT ei.idelemento
                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
                    LEFT JOIN mod_objetivos.dat_involucrados i
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    WHERE i.idusuario = {$parametros->idusuario})) ";
      }


        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                $joininvolucrados

                WHERE a.fechafin < " . "'" . date('Y-m-d') . "'" . "
                AND e.gradocumplimiento = 0
                {$cadenainvolucrados}
                {$cadenaestados} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    //actividades parcialmente cumplidas fuera de fecha
    public function parcialCFueraFecha($parametros)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                $joininvolucrados

                WHERE a.fechafin < " . "'" . date('Y-m-d') . "'" . "
                AND e.gradocumplimiento < 100
                AND e.gradocumplimiento > 0
                {$cadenainvolucrados}
                {$cadenaestados}{$cadenaFechaI}{$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    //actividades parcialmente cumplidas en tiempo
    public function parcialCEnTiempo($parametros)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                $joininvolucrados

                WHERE a.fechafin >= " . "'" . date('Y-m-d') . "'" . "
                AND e.gradocumplimiento < 100
                AND e.gradocumplimiento > 0
                {$cadenainvolucrados}
                {$cadenaestados}
                {$cadenaFechaI}
                {$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    //actividades no iniciadas y en tiempo
    public function noIniciadasEnTiempo($parametros)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                $joininvolucrados

                WHERE a.fechafin >= " . "'" . date('Y-m-d') . "'" . "
                AND e.gradocumplimiento = 0
                {$cadenainvolucrados}
                {$cadenaestados}
                {$cadenaFechaI}
                {$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    //actividades que inician la proxima semana
    public function proximaSemana($proximoLunes, $proximoDomingo, $parametros)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

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
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(a.idactividad)";
        }
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                $joininvolucrados

                WHERE a.fechainicio >= '{$proximoLunes}'
                AND a.fechainicio <= '{$proximoDomingo}'
                AND e.gradocumplimiento = 0

                {$cadenainvolucrados}
                {$cadenaestados}
                {$cadenaFechaI}
                {$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function actividadesPlanif($parametros, $fechaI, $fechaF)
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
        $cadenaSelect
            = " SELECT DISTINCT(a.idactividad), a.fechainicio, a.fechafin,
            a.horainicio, a.horafin, e.gradocumplimiento ";
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a

                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                $joininvolucrados

                WHERE {$cadenainvolucrados}

                AND (a.fechafin >= '$fechaI')
                AND (a.fechainicio <= '$fechaF')
                {$cadenaestados} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function actividadesCalidad($parametros)
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
            = " SELECT DISTINCT(a.idactividad), a.fechainicio, a.fechafin,
            a.criterioevaluacion ";
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a

                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                $joininvolucrados

                WHERE {$cadenainvolucrados}
                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    //Tipos de actividades
    public function tiposAct($parametros)
    {
        $cadenaQUERY
            = " SELECT  n.idnomenclador,  n.dennomenclador
                        FROM mod_objetivos.nom_nomenclador n
                        WHERE n.tiponomenclador = 3
                        AND n.idusuariocrea = {$parametros->idusuario} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    public function ActPorTiposAct($parametros)
    {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
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
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

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
        if ($parametros->peso == 1) {
            $cadenaSelect
                = " SELECT  n.idnomenclador,  n.dennomenclador, e.peso ";
        } else {
            $cadenaSelect
                = " SELECT  n.idnomenclador, n.dennomenclador, a.fechafin,
                a.horainicio, a.horafin, a.fechainicio ";
        }
        $cadenaQUERY
            = " FROM mod_objetivos.nom_nomenclador n
                        LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                        ON ( n.idnomenclador = en.idnomenclador )
                        LEFT JOIN mod_objetivos.dat_elementos e
                        ON ( e.idelemento = en.idelemento )
                        LEFT JOIN mod_objetivos.dat_actividades a
                        ON ( a.idactividad = e.idelemento)
                        LEFT JOIN mod_objetivos.dat_grupo_nom_nomenclador g
                        ON (n.idnomenclador = g.idnomenclador)
                        
                        $joininvolucrados

                        WHERE n.tiponomenclador = 3
                        AND n.idusuariocrea = {$parametros->idusuario}
                        AND n.idnomenclador = {$parametros->idnomenclador}

                        {$cadenainvolucrados}
                        {$cadenaestados}{$cadenaFechaI}{$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*
     * Actividades para Pareto hijas de act o de obj
     */
    public function actParetoPlan($parametros)
    {
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaSELECT
            = "SELECT DISTINCT(e.idelemento) as id,e.idestadoaprob,
                e.actualizarporciento ,e.denelemento as text,
                a.fechainicio as start_date, a.fechafin as end_date, e.peso,
                ee.idelementopadre as padre";
        $cadenaFROM
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (a.idactividad = e.idelemento) ";
        $cadenaJOIN
            = " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (e.idelemento = ee.idelementohijo AND ee.origen < 4
                AND ee.idelementopadre IN (
                SELECT ele.idelemento
                FROM mod_objetivos.dat_elementos ele
                WHERE ele.idtipoelemento IN (1,3) )) ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario}
                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaestados} ";
        $cadenaOrder = " ORDER BY e.peso DESC ";
        //Filtros
        if ($parametros->fechainicio) {
            $cadenaWHERE .= " AND a.fechainicio >= '{$parametros->fechainicio}' ";
        }
        if ($parametros->fechafin) {
            $cadenaWHERE .= " AND a.fechafin <= '{$parametros->fechafin}' ";
        }
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE
            . $cadenaOrder;
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        $cadenaSELECTSUM = "SELECT SUM(d.peso) as pesototal FROM ( ";
        $cadenaQUERY
            = $cadenaSELECTSUM . $cadenaSELECT . $cadenaFROM . $cadenaJOIN
            . $cadenaWHERE . $cadenaOrder . " ) AS d ";
        $result->pesototal = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function EliminarAlarma($idelemento)
    {
        $consulta
            = "DELETE FROM mod_objetivos.dat_alarma
		WHERE dat_alarma.idalarma = '$idelemento'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll();
        return $result;
    }

    public function obtenerActs($parametros)
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
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        $cadenaSelect
            = " SELECT DISTINCT(a.idactividad), e.denelemento ";
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a

                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                
                $joininvolucrados

                WHERE {$cadenainvolucrados}
                {$cadenaestados} {$cadenaFechaI} {$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }


    /*Funcion para obtener la acts de un mes, para el reporte de Coordinacion*/
    public function actsDadoMesReporte($datos)
    {
        if ($datos->idplan != '') {
            $cadenaPlan = " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (ee.idelementohijo = a.idactividad
                AND ee.idelementopadre = {$datos->idplan}) ";
        } else {
            $cadenaPlan = "";
        }
        $cadenaestados = (isset($datos->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $datos->arrayestados . ")) "
            : "";
        $cadenaSelect
            = " SELECT DISTINCT(a.idactividad), e.denelemento, a.fechainicio, a.fechafin ";
        $cadenaQUERY
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = a.idactividad)
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                   ON (ei.idelemento = e.idelemento) 
                   LEFT JOIN mod_objetivos.dat_involucrados i 
                   ON (ei.idinvolucrado = i.idinvolucrado)
                {$cadenaPlan}
                WHERE (e.idusuariocrea = {$datos->idusuariosession} 
                OR i.idusuario = {$datos->idusuariosession}) AND (a.fechainicio <= '{$datos->ffin}'
                AND a.fechafin >= '{$datos->fini}')
                {$cadenaestados} ";
//        print_r($cadenaSelect . $cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }


    /*Funcion para obtener la acts de un mes, para el reporte de Coordinacion*/
    public function actsPorDiasMesReporte($datos)
    {

      $arrayidautores = implode(',', $datos->arrayidautores);
      $aux_involucrados =
        array_merge(
          $datos->arrayinvolucrados, $datos->arrayidinvolucrados, $datos->arrayidautores
        );
      $arrayidinvolucrados = implode(',', $aux_involucrados);

        $whereplan = '';
        if ($datos->str_idelementos != "") {
            $whereplan .= " AND e.idelemento in ($datos->str_idelementos) ";
        }

        if ($datos->str_idelementos == "" && $datos->idplan != "")
            return array();

        $cadenaSelect
            = " select count (res.fecha) as cantidad, 
                        to_char(res.fecha, 'dd/mm/YYYY') as fecha, date_part('day',res.fecha ) as dia, date_part('month',res.fecha ) as mes ";

        $cadenaForm = " 
                  from
                        (
                        select resp.idactividad, resp.fecha 
                  
                  from
                  (SELECT
                  DISTINCT(a.idactividad), e.denelemento, a.fechainicio, a.fechafin,
                    unnest( (
                   select array_agg(i.fecha) as dias from ( select  generate_series(a.fechainicio,
                    a.fechafin, '1 day'::interval)::date as fecha)i ) ) as fecha
                   FROM mod_objetivos.dat_actividades a
                   INNER JOIN mod_objetivos.dat_elementos e ON (e.idelemento = a.idactividad AND a.suspendida=0) 
                   LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                   ON (ei.idelemento = e.idelemento) 
                   LEFT JOIN mod_objetivos.dat_involucrados i 
                   ON (ei.idinvolucrado = i.idinvolucrado)
                   ";

//        $cadenaQUERY = " (e.idusuariocrea = {$datos->idusuariosession}
//                OR i.idusuario = {$datos->idusuariosession}) ";

      $cadenaQUERY = "  ";
      //cadena sql con posibles autores e involucrados

      if (isset($datos->arrayidautores[0]) && !isset($datos->arrayidinvolucrados[0])) {
        $cadenaQUERY
          .=  " e.idusuariocrea IN (".$arrayidautores.") ";
      }
      else if (!isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
        $cadenaQUERY
                      .=  " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
      }
      else if (isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
        $cadenaQUERY
                      .=  " (e.idusuariocrea IN (".$arrayidautores.") 
                      OR ei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
      }
      else {
        $cadenaQUERY = " (e.idusuariocrea = {$datos->idusuariosession} 
                OR i.idusuario = {$datos->idusuariosession}) ";
      }



        if (isset($datos->arregloestados[0])) {
            $cadenaQUERY .= ($cadenaQUERY == "") ? " (e.idestadoaprob IN (" . $datos->arrayestados . ")) " :
                " AND (e.idestadoaprob IN (" . $datos->arrayestados . ")) ";
        }

        $cadenaQUERY .= ($cadenaQUERY == "") ?
            "  
       --a.esprincipal = 1 AND
        ( 
               
               ('" . $datos->fini . "' BETWEEN a.fechainicio AND a.fechafin or '" . $datos->ffin . "' BETWEEN a.fechainicio AND a.fechafin) or 
               
               
                (a.fechainicio BETWEEN '" . $datos->fini . "' and '" . $datos->ffin . "' or  a.fechafin BETWEEN '" . $datos->fini . "' and '" . $datos->ffin . "')
                )
       " :
            " AND
           --a.esprincipal = 1 AND
        ( 
               
               ('" . $datos->fini . "' BETWEEN a.fechainicio AND a.fechafin or '" . $datos->ffin . "' BETWEEN a.fechainicio AND a.fechafin) or 
               
               
                (a.fechainicio BETWEEN '" . $datos->fini . "' and '" . $datos->ffin . "' or  a.fechafin BETWEEN '" . $datos->fini . "' and '" . $datos->ffin . "')
                )
       ";


        $cadenaQUERY = ($cadenaQUERY == "") ? "" : " WHERE " . $cadenaQUERY . $whereplan;

        $cadenaGroupby = " group by a.idactividad, e.denelemento 
                              )resp
                              
                              where resp.fecha BETWEEN '" . $datos->fini . "' AND '" . $datos->ffin . "'

                              )res
                              
                              group by
                              res.fecha ";

        $cadenaOrdenby = " order by res.fecha ";

        $cadena = $cadenaSelect . $cadenaForm . $cadenaQUERY . $cadenaGroupby . $cadenaOrdenby;

//    print_r($cadena);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

    /*Funcion para obtener la acts de un mes, para el reporte de Coordinacion*/
    public function actsPorDiasMesReporteDetallado($datos)
    {

        $arrayidautores = implode(',', $datos->arrayidautores);
        $aux_involucrados =
          array_merge(
            $datos->arrayinvolucrados, $datos->arrayidinvolucrados, $datos->arrayidautores
          );
        $arrayidinvolucrados = implode(',', $aux_involucrados);

        $whereplan = '';
        if ($datos->str_idelementos != "") {
            $whereplan .= " e.idelemento in ($datos->str_idelementos) ";
        }

        if ($datos->str_idelementos == "" && $datos->idplan != "")
            return array();

        $arrayidnom = implode(',', $datos->arrayidnom);

        $cadenaSelect
            = " 
         select res.idactividad,res.horainicio || ' ' || res.denelemento || CASE WHEN res.lugar IS NOT NULL AND res.lugar <> '' THEN ' LUGAR: ' || res.lugar ELSE '' END AS 
            denominacion,  '#'||res.color as color, res.horainicio, res.denelemento, res.categoriaactividad,
            to_char(res.fecha, 'dd/mm/YYYY') as fecha, date_part('day',res.fecha ) as dia, date_part('month',res.fecha ) as mes 
          ";

        $cadenaForm = " 
                   from
                    (
                    
                    SELECT 
                    DISTINCT(a.idactividad), e.denelemento, a.fechainicio, a.fechafin, a.lugar,a.horainicio, 
                      unnest( (
                     select array_agg(i.fecha) as dias from ( select  generate_series(a.fechainicio, 
                      a.fechafin, '1 day'::interval)::date as fecha)i ) ) as fecha
                    ,nn.dennomenclador , ca.color, nn.dennomenclador as categoriaactividad
                    ,e.idusuariocrea  
                      
                     FROM mod_objetivos.dat_actividades a
                     INNER JOIN mod_objetivos.dat_elementos e ON (e.idelemento = a.idactividad AND a.suspendida=0)
                     left join mod_objetivos.dat_elementos_nom_nomenclador denn on (denn.idelemento = e.idelemento and denn.tiponomenclador = 2)
                     left join mod_objetivos.nom_nomenclador nn on (nn.idnomenclador = denn.idnomenclador)
                     left join mod_objetivos.nom_categactividad ca on (ca.idnomenclador = denn.idnomenclador)
                     
                      LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                                       ON (ei.idelemento = e.idelemento)
                                       LEFT JOIN mod_objetivos.dat_involucrados i
                                       ON (ei.idinvolucrado = i.idinvolucrado)
                   
                   ";

//        $cadenaQUERY = " (e.idusuariocrea = {$datos->idusuariosession}
//                OR i.idusuario = {$datos->idusuariosession}) ";

      $cadenaQUERY = "  ";
      //cadena sql con posibles autores e involucrados

      if (isset($datos->arrayidautores[0]) && !isset($datos->arrayidinvolucrados[0])) {
        $cadenaQUERY
          .=  " e.idusuariocrea IN (".$arrayidautores.") ";
      }
      else if (!isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
        $cadenaQUERY
          .=  " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
      }
      else if (isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
        $cadenaQUERY
          .=  " (e.idusuariocrea IN (".$arrayidautores.") 
                      OR ei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
      }
      else {
        $cadenaQUERY = " (e.idusuariocrea = {$datos->idusuariosession} 
                OR i.idusuario = {$datos->idusuariosession}) ";
      }

        if ($datos->idplan != '') {
            $cadenaQUERY .= ($cadenaQUERY == "") ? $whereplan :
                " AND " . $whereplan;
        }

        if (isset($datos->arregloestados[0])) {
            $cadenaQUERY .= ($cadenaQUERY == "") ? " (e.idestadoaprob IN (" . $datos->arrayestados . ")) " :
                " AND (e.idestadoaprob IN (" . $datos->arrayestados . ")) ";
        }

        $cadenaQUERY .= ($cadenaQUERY == "") ?
            " 
            --a.esprincipal = 1 AND
        ( 
               
               ('" . $datos->fini . "' BETWEEN a.fechainicio AND a.fechafin or '" . $datos->ffin . "' BETWEEN a.fechainicio AND a.fechafin) or 
               
               
                (a.fechainicio BETWEEN '" . $datos->fini . "' and '" . $datos->ffin . "' or  a.fechafin BETWEEN '" . $datos->fini . "' and '" . $datos->ffin . "')
                )
        " :
            " AND 
            --a.esprincipal = 1 AND
        ( 
               
               ('" . $datos->fini . "' BETWEEN a.fechainicio AND a.fechafin or '" . $datos->ffin . "' BETWEEN a.fechainicio AND a.fechafin) or 
               
               
                (a.fechainicio BETWEEN '" . $datos->fini . "' and '" . $datos->ffin . "' or  a.fechafin BETWEEN '" . $datos->fini . "' and '" . $datos->ffin . "')
                )
       ";

        if (isset($arrayidnom[0])) {
            $cadenaQUERY .= ' AND denn.idnomenclador IN (' . $arrayidnom . ')';
        }

        $cadenaQUERY = ($cadenaQUERY == "") ? "" : " WHERE " . $cadenaQUERY;

        $cadenaGroupby = " group by a.idactividad, e.denelemento  ,nn.dennomenclador , ca.color, e.idusuariocrea, nn.dennomenclador
                              )res
                             
                              where res.fecha BETWEEN '" . $datos->fini . "' AND '" . $datos->ffin . "'
                             ";

        $cadenaOrdenby = " order by res.fecha, res.horainicio, res.denelemento ";

        $cadena = $cadenaSelect . $cadenaForm . $cadenaQUERY . $cadenaGroupby . $cadenaOrdenby;

//    print_r($cadena);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }


}

//fin clase 



