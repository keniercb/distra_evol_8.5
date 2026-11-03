<?php

class AnalisisInversiones {

    /*public function graficarControlEjecucion($entidad, $ejercicios) {
        $identidad = implode(',', $entidad);
        $ejers = implode(',', $ejercicios);
        $conn = Doctrine_Manager::connection();
        $sql = "select '1ejecutado' as etapa, f.idmoneda,
                sum( f.valor)as valor,
                 f.idejercicio,
                 f.ejercicio
                 from (SELECT 
                 ices.idinverscontadoejecutado as id,
                 dme.idmoneda,
                 ices.valor,
                 ices.idejercicio,
                 ep.ejercicio
               FROM
                 mod_planifinversiones.dat_inverscontadoejecutado ices
                 INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
                 INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (ices.idmonedaentidad = dme.idmonedaentidad)
                 where dme.idestructuracomun in ($identidad)
                 and ices.idejercicio in ($ejers)
                 and dme.idmoneda = 9900000103

               union 
                 SELECT 
                 ices.idinversfinancejecutado as id,
                 dme.idmoneda,
                 ices.valor,
                 ices.idejercicio,
                 ep.ejercicio
               FROM
                 mod_planifinversiones.dat_inversfinancejecutado ices
                 INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
                 INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (ices.idmonedaentidad = dme.idmonedaentidad)
                 where dme.idestructuracomun in ($identidad)
                 and ices.idejercicio in ($ejers)
                 and dme.idmoneda = 9900000103
                )f
                 group by f.idmoneda,f.idejercicio,f.ejercicio
                 ---------------------------------------------------------------
               union

               select '2plan' as etapa,f.idmoneda,
                sum( f.valor) as valor,
                 f.idejercicio,
                 f.ejercicio
                 from (SELECT 
                 icp.idinverscontadoplan as id,
                 dme.idmoneda,
                 icp.valor,
                 icp.idejercicio,
                 ep.ejercicio
               FROM
                 mod_planifinversiones.dat_inverscontadoplan icp
                 INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (icp.idejercicio = ep.idejercicio)
                 INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (icp.idmonedaentidad = dme.idmonedaentidad)
                 where dme.idestructuracomun in ($identidad)
                 and icp.idejercicio in ($ejers)
                 and dme.idmoneda = 9900000103
                 union 
                 SELECT
                 icp.idinversfinancplan as id, 
                 dme.idmoneda,
                 icp.valor,
                 icp.idejercicio,
                 ep.ejercicio
               FROM
                 mod_planifinversiones.dat_inversfinancplan icp
                 INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (icp.idejercicio = ep.idejercicio)
                 INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (icp.idmonedaentidad = dme.idmonedaentidad)
                 where dme.idestructuracomun in ($identidad)
                 and icp.idejercicio in ($ejers)
                 and dme.idmoneda = 9900000103
               )f
                 group by f.idmoneda,f.idejercicio,f.ejercicio
                 -------------------------------------------------------------------------------------
                 union 

                 select '3estimado' as etapa, f.idmoneda,
                sum( f.valor) as valor,
                 f.idejercicio,
                 f.ejercicio
                 from (SELECT 
                 icp.idinverscontadoestimado as id,
                 dme.idmoneda,
                 icp.valor ,
                 icp.idejercicio,
                 ep.ejercicio
               FROM
                 mod_planifinversiones.dat_inverscontadoestimado icp
                 INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (icp.idejercicio = ep.idejercicio)
                 INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (icp.idmonedaentidad = dme.idmonedaentidad)
                 where dme.idestructuracomun in ($identidad)
                 and icp.idejercicio in ($ejers)
                 and dme.idmoneda = 9900000103

                 union 
                 SELECT 
                 icp.idinversfinancestimado as id,
                 dme.idmoneda,
                 icp.valor ,
                 icp.idejercicio,
                 ep.ejercicio
               FROM
                 mod_planifinversiones.dat_inversfinancestimado icp
                 INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (icp.idejercicio = ep.idejercicio)
                 INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (icp.idmonedaentidad = dme.idmonedaentidad)
                 where dme.idestructuracomun in ($identidad)
                 and icp.idejercicio in ($ejers)
                 and dme.idmoneda = 9900000103
               )f
                 group by f.idmoneda,f.idejercicio,f.ejercicio


                  ------------------------------------------------------------------------------------
               union 

               select '4proyectado' as etapa,f.idmoneda,
                 sum( f.valor) as valor,
                 f.idejercicio,
                 f.ejercicio
                 from (SELECT 
                 icproy.idinverscontadoproyectado as id,
                 dme.idmoneda,
                 icproy.valor,
                 icproy.idejercicio,
                 ep.ejercicio
               FROM
                 mod_planifinversiones.dat_inverscontadoproyectado icproy
                 INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (icproy.idejercicio = ep.idejercicio)
                 INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (icproy.idmonedaentidad = dme.idmonedaentidad)
                 where dme.idestructuracomun in ($identidad)
                 and icproy.idejercicio in ($ejers)
                 and dme.idmoneda = 9900000103

                union

                 SELECT 
                 icproy.idplaninversfinancproyectado as id,
                 dme.idmoneda,
                 icproy.valor,
                 icproy.idejercicio,
                 ep.ejercicio
               FROM
                 mod_planifinversiones.dat_inversfinancproyectado icproy
                 INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (icproy.idejercicio = ep.idejercicio)
                 INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (icproy.idmonedaentidad = dme.idmonedaentidad)
                 where dme.idestructuracomun in ($identidad)
                 and icproy.idejercicio in ($ejers)
                 and dme.idmoneda = 9900000103
                 )f
                 group by f.idmoneda,f.idejercicio,f.ejercicio

               order by 
               idejercicio,etapa";
        
        print_r($sql);die;
        
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }*/

    /* public function graficarControlEjecucion($entidad, $ejercicios) {
         $identidad = implode(',', $entidad);
         $ejers = implode(',', $ejercicios);
         $conn = Doctrine_Manager::connection();
         $sql = "select '1ejecutado' as etapa, f.idmoneda,
      sum(f.valor) as valor,
      f.idejercicio,
      f.ejercicio
      from (SELECT

      m.idmoneda,
      ices.valor,
      ices.idejercicio,
      ep.ejercicio
        FROM
      mod_planifinversiones.dat_inversion i
      inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
      inner join mod_planifinversiones.dat_inversetapaejecutado ices ON(ei.idetapainversion = ices.idetapainversion)
      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
      INNER JOIN mod_datosmaestros.nom_moneda m ON (ices.idmoneda = m.idmoneda)

      where i.idestructuracomun in ($identidad)
      and ices.idejercicio in ($ejers)
      and m.codigoiso = 'CUP'

       )f
      group by f.idmoneda,f.idejercicio,f.ejercicio


 ---------------------------------------------------------------
 union

 select '2plan' as etapa, f.idmoneda,
      sum(f.valor) as valor,
      f.idejercicio,
      f.ejercicio
      from (SELECT

      m.idmoneda,
      ices.valor,
      ices.idejercicio,
      ep.ejercicio
        FROM
      mod_planifinversiones.dat_inversion i
      inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
      inner join mod_planifinversiones.dat_inversetapaplan ices ON(ei.idetapainversion = ices.idetapainversion)
      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
      INNER JOIN mod_datosmaestros.nom_moneda m ON (ices.idmoneda = m.idmoneda)

      where i.idestructuracomun in ($identidad)
      and ices.idejercicio in ($ejers)
      and m.codigoiso = 'CUP'

       )f
      group by f.idmoneda,f.idejercicio,f.ejercicio

 ---------------------------------------------------------------
 union

 select '3estimado' as etapa, f.idmoneda,
      sum(f.valor) as valor,
      f.idejercicio,
      f.ejercicio
      from (SELECT

      m.idmoneda,
      ices.valor,
      ices.idejercicio,
      ep.ejercicio
        FROM
      mod_planifinversiones.dat_inversion i
      inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
      inner join mod_planifinversiones.dat_inversetapaestimado ices ON(ei.idetapainversion = ices.idetapainversion)
      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
      INNER JOIN mod_datosmaestros.nom_moneda m ON (ices.idmoneda = m.idmoneda)

      where i.idestructuracomun in ($identidad)
      and ices.idejercicio in ($ejers)
      and m.codigoiso = 'CUP'

       )f
      group by f.idmoneda,f.idejercicio,f.ejercicio

 ---------------------------------------------------------------
 union

 select '4proyectado' as etapa, f.idmoneda,
      sum(f.valor) as valor,
      f.idejercicio,
      f.ejercicio
      from (SELECT

      m.idmoneda,
      ices.valor,
      ices.idejercicio,
      ep.ejercicio
        FROM
      mod_planifinversiones.dat_inversion i
      inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
      inner join mod_planifinversiones.dat_inversetapaproyectado ices ON(ei.idetapainversion = ices.idetapainversion)
      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
      INNER JOIN mod_datosmaestros.nom_moneda m ON (ices.idmoneda = m.idmoneda)

      where i.idestructuracomun in ($identidad)
      and ices.idejercicio in ($ejers)
      and m.codigoiso = 'CUP'

       )f
      group by f.idmoneda,f.idejercicio,f.ejercicio

 order by idejercicio,etapa";

         //print_r($sql);die;

         $datosListar = $conn->execute($sql);
         $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
         return $datos;
     }*/

    public function graficarControlEjecucion($entidad, $ejercicios) {
        $identidad = implode(',', $entidad);
        $ejers = implode(',', $ejercicios);
        $conn = Doctrine_Manager::connection();
        $sql = "select ep.idejercicio,'1ejecutado' as etapa,(select m.idmoneda from mod_datosmaestros.nom_moneda m where m.codigoiso = 'CUP'),
	 coalesce(r.valor,0) as valor,
	 ep.ejercicio
	from mod_planificacion.nom_ejercicioplanificacion ep
	left join (select '1ejecutado' as etapa, f.idmoneda,
	 sum(f.valor) as valor,
	 f.idejercicio,
	 f.ejercicio
	 from (SELECT
	 m.idmoneda,
	 ices.valor,
	 ices.idejercicio,
	 ep.ejercicio
       FROM
	 mod_planifinversiones.dat_inversion i
	 inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
	 inner join mod_planifinversiones.dat_inversetapaejecutado ices ON(ei.idetapainversion = ices.idetapainversion
)
	 inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
	 inner JOIN mod_datosmaestros.nom_moneda m ON (ices.idmoneda = m.idmoneda)

	 where i.idestructuracomun in ($identidad)
	 and ices.idejercicio in ($ejers)
	 and (m.codigoiso = 'CUP')
	 and i.idestadoinversion = 1
     and ((ep.ejercicio::numeric) >=(date_part('year', i.fechainicio))::numeric
     and  (ep.ejercicio::numeric) <=(date_part('year', i.fechafin))::numeric)

      )f
	 group by f.idmoneda,f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

	 where ep.idejercicio in ($ejers)

---------------------------------------------------------------
union

 select ep.idejercicio,'2plan' as etapa,(select m.idmoneda from mod_datosmaestros.nom_moneda m where m.codigoiso = 'CUP'),
	 coalesce(r.valor,0) as valor,
	 ep.ejercicio
	from mod_planificacion.nom_ejercicioplanificacion ep
	left join (select '2plan' as etapa, f.idmoneda,
	 sum(f.valor) as valor,
	 f.idejercicio,
	 f.ejercicio
	 from (SELECT
	 m.idmoneda,
	 ices.valor,
	 ices.idejercicio,
	 ep.ejercicio
       FROM
	 mod_planifinversiones.dat_inversion i
	 inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
	 inner join mod_planifinversiones.dat_inversetapaplan ices ON(ei.idetapainversion = ices.idetapainversion
)
	 inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
	 inner JOIN mod_datosmaestros.nom_moneda m ON (ices.idmoneda = m.idmoneda)

	 where i.idestructuracomun in ($identidad)
	 and ices.idejercicio in ($ejers)
	 and (m.codigoiso = 'CUP')
	 and i.idestadoinversion = 1
     and ((ep.ejercicio::numeric) >=(date_part('year', i.fechainicio))::numeric
     and  (ep.ejercicio::numeric) <=(date_part('year', i.fechafin))::numeric)

      )f
	 group by f.idmoneda,f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

	 where ep.idejercicio in ($ejers)

---------------------------------------------------------------
union

select ep.idejercicio,'3estimado' as etapa,(select m.idmoneda from mod_datosmaestros.nom_moneda m where m.codigoiso = 'CUP'),
	 coalesce(r.valor,0) as valor,
	 ep.ejercicio
	from mod_planificacion.nom_ejercicioplanificacion ep
	left join (select '3estimado' as etapa, f.idmoneda,
	 sum(f.valor) as valor,
	 f.idejercicio,
	 f.ejercicio
	 from (SELECT
	 m.idmoneda,
	 ices.valor,
	 ices.idejercicio,
	 ep.ejercicio
       FROM
	 mod_planifinversiones.dat_inversion i
	 inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
	 inner join mod_planifinversiones.dat_inversetapaestimado ices ON(ei.idetapainversion = ices.idetapainversion
)
	 inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
	 inner JOIN mod_datosmaestros.nom_moneda m ON (ices.idmoneda = m.idmoneda)

	 where i.idestructuracomun in ($identidad)
	 and ices.idejercicio in ($ejers)
	 and (m.codigoiso = 'CUP')
	 and i.idestadoinversion = 1
     and ((ep.ejercicio::numeric) >=(date_part('year', i.fechainicio))::numeric
     and  (ep.ejercicio::numeric) <=(date_part('year', i.fechafin))::numeric)

      )f
	 group by f.idmoneda,f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

	 where ep.idejercicio in ($ejers)
 ---------------------------------------------------------------
union

select ep.idejercicio,'4proyectado' as etapa,(select m.idmoneda from mod_datosmaestros.nom_moneda m where m.codigoiso = 'CUP'),
	 coalesce(r.valor,0) as valor,
	 ep.ejercicio
	from mod_planificacion.nom_ejercicioplanificacion ep
	left join (select '4proyectado' as etapa, f.idmoneda,
	 sum(f.valor) as valor,
	 f.idejercicio,
	 f.ejercicio
	 from (SELECT
	 m.idmoneda,
	 ices.valor,
	 ices.idejercicio,
	 ep.ejercicio
       FROM
	 mod_planifinversiones.dat_inversion i
	 inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
	 inner join mod_planifinversiones.dat_inversetapaproyectado ices ON(ei.idetapainversion = ices.idetapainversion
)
	 inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)
	 inner JOIN mod_datosmaestros.nom_moneda m ON (ices.idmoneda = m.idmoneda)

	 where i.idestructuracomun in ($identidad)
	 and ices.idejercicio in ($ejers)
	 and (m.codigoiso = 'CUP')

	 and i.idestadoinversion = 1
     and ((ep.ejercicio::numeric) >=(date_part('year', i.fechainicio))::numeric
     and  (ep.ejercicio::numeric) <=(date_part('year', i.fechafin))::numeric)

      )f
	 group by f.idmoneda,f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

	 where ep.idejercicio in ($ejers)

order by ejercicio,etapa";




        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        /*print_r($datos);
        print_r('-------');die;*/
        return $datos;
    }

    public function buscarEjercicioAnterior($ejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "
            SELECT
                'anterior' as anno, 
                idejercicio,
                ejercicio,
                actual,
                margenc,
                idestado
              FROM 
                mod_planificacion.nom_ejercicioplanificacion
                where ejercicio::numeric = ($ejercicio - 1)::numeric
              UNION  
                SELECT
                'aanterior' as anno, 
                idejercicio,
                ejercicio,
                actual,
                margenc,
                idestado
              FROM 
                mod_planificacion.nom_ejercicioplanificacion
                where ejercicio::numeric = ($ejercicio - 2)::numeric
              UNION  
                SELECT
                'posterior' as anno, 
                idejercicio,
                ejercicio,
                actual,
                margenc,
                idestado
              FROM 
                mod_planificacion.nom_ejercicioplanificacion
                where ejercicio::numeric = ($ejercicio + 1)::numeric
              order by ejercicio";
        //print_r($sql);die;
        $datosSql = $conn->execute($sql);
        $datos = $datosSql->fetchAll(PDO::FETCH_ASSOC);


        return $datos;
    }


    public function graficarFormaPropiedad($identidades, $idejercicio) {
        $identidades = implode(',', $identidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  i.idformapropiedad,
                        dn.denominacion,
                        count(distinct i.idinversion) as cantidad,
                        count(distinct i.idinversion) * 100/(SELECT count(distinct i.idinversion) as cantidad
                    FROM mod_planifinversiones.dat_inversion i
                    INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                    INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                    INNER JOIN mod_planifinversiones.dat_formapropiedad fp ON(i.idformapropiedad = fp.idformapropiedad)
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(fp.iddatosnomenclador = dn.iddatosnomenclador)
                    where iep.idejercicio = $idejercicio
                    and i.idestadoinversion = 1
                    and iep.valor <> 0
                    and i.idestructuracomun in($identidades))::numeric as porciento

                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                INNER JOIN mod_planifinversiones.dat_formapropiedad fp ON(i.idformapropiedad = fp.idformapropiedad)
                INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(fp.iddatosnomenclador = dn.iddatosnomenclador)
                where iep.idejercicio = $idejercicio
                and i.idestadoinversion = 1
                and iep.valor <> 0
                and i.idestructuracomun in($identidades)
                group by i.idformapropiedad,dn.denominacion";
        //print_r($sql);die;
        $datosSql = $conn->execute($sql);
        $datos = $datosSql->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function graficarFormaPropiedadPorMoneda($identidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $identidades);
        $conn = Doctrine_Manager::connection();
        $sql = "
                SELECT
                  f.idformapropiedad,
                  f.denominacion,
                  f.idmoneda,
                  f.codigoiso,
                  coalesce(sum(f.valor), 0) AS valor
                  FROM
                (
                SELECT
                 'componentes' as origen,
                  i.idformapropiedad,
                  dn.denominacion,
                  iep.idmoneda,
                  m.codigoiso,
                  COALESCE(iep.valor,0) AS valor
                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(iep.idmoneda = m.idmoneda)
                INNER JOIN mod_planifinversiones.dat_formapropiedad fp ON(i.idformapropiedad = fp.idformapropiedad)
                INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(fp.iddatosnomenclador = dn.iddatosnomenclador)
                  where iep.idejercicio = $idejercicio
                  and i.idestructuracomun in($identidades)
                  and i.idestadoinversion = 1
     and ($ejercicio >=(date_part('year', i.fechainicio))::numeric
     and  $ejercicio <=(date_part('year', i.fechafin))::numeric)

               /* UNION

                SELECT
                 'planprep' as origen,
                  i.idformapropiedad,
                  dn.denominacion,
                  m.idmoneda,
                  m.codigoiso,
                  COALESCE(ppp.valor,0) AS valor
                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_presanteproy pp ON(i.idinversion = pp.idinversion)
                INNER JOIN mod_planifinversiones.dat_presupplan ppp ON(pp.idpresanteproy = ppp.idpresanteproy)
                INNER JOIN mod_datosmaestros.dat_monedaentidad me ON(pp.idmonedaentidad = me.idmonedaentidad)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                INNER JOIN mod_planifinversiones.dat_formapropiedad fp ON(i.idformapropiedad = fp.idformapropiedad)
                INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(fp.iddatosnomenclador = dn.iddatosnomenclador)
                  where ppp.idejercicio = $idejercicio
                  and i.idestructuracomun in($identidades)*/
                )f

                group by f.idformapropiedad,f.denominacion,f.idmoneda,f.codigoiso
                order by f.idmoneda,f.denominacion
                      ";
        //print_r($sql);die;
        $datosSql = $conn->execute($sql);
        $datos = $datosSql->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function monedasPorEntidad($identidades,$idMonedaentidad) {
        if(is_array($identidades))
            $identidades = implode(',', $identidades);

        $selectIdMonedaentidad= " ";
        if($idMonedaentidad == null || $idMonedaentidad == 0){
            $selectIdMonedaentidad = " ";
        }elseif($idMonedaentidad == 1){
            $selectIdMonedaentidad = ",me.idmonedaentidad  ";
        }

        $conn = Doctrine_Manager::connection();
        $sql = "
                SELECT DISTINCT
                  m.codigoiso,
                  m.idmoneda
                  $selectIdMonedaentidad
                FROM
                  mod_datosmaestros.dat_monedaentidad me
                  INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                WHERE me.idestructuracomun in($identidades);";

        $datosSql = $conn->execute($sql);
        $datos = $datosSql->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }
    public function monedasPorIdMonedaentidad($idmonedaentidad) {

        $conn = Doctrine_Manager::connection();
        $sql = "
                SELECT DISTINCT
                  m.codigoiso,
                  m.idmoneda
                FROM
                  mod_datosmaestros.dat_monedaentidad me
                  INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                WHERE me.idestructuracomun = $idmonedaentidad;
                                      ";
        $datosSql = $conn->execute($sql);
        $datos = $datosSql->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function graficarComoFinancia($entidades, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 'contado' as como,
                    sum(dic.valor),
                    sum(dic.valor) /
                    (
                      select sum(r.valor)
                      from (
                             SELECT 'contado' as como,
                                    sum(dic.valor) as valor
                             FROM mod_planifinversiones.dat_inversion di
                             INNER JOIN mod_planifinversiones.dat_inverscontadoplan dic ON (dic.idinversion = di.idinversion)
                             WHERE di.idestructuracomun in ($identidades) AND di.idestadoinversion = 1 AND dic.idejercicio = $idejercicio
                             UNION
                             SELECT 'credito' as como,
                                    sum(dif.valor) as valor
                             FROM mod_planifinversiones.dat_inversion di
                             INNER JOIN mod_planifinversiones.dat_inversfinancplan dif ON (dif.idinversion = di.idinversion)
                             WHERE di.idestructuracomun in ($identidades) AND di.idestadoinversion = 1 AND dif.idejercicio = $idejercicio
                           ) r
                    ) * 100 as porciento
             FROM mod_planifinversiones.dat_inversion di
             INNER JOIN mod_planifinversiones.dat_inverscontadoplan dic ON (dic.idinversion = di.idinversion)
             WHERE di.idestructuracomun in ($identidades) AND dic.idejercicio = $idejercicio
             UNION
             SELECT 'credito' as como,
                    sum(dif.valor),
                    sum(dif.valor) /
                    (
                      select sum(r.valor)
                      from (
                             SELECT 'contado' as como,
                                    sum(dic.valor) as valor
                             FROM mod_planifinversiones.dat_inversion di
                             INNER JOIN mod_planifinversiones.dat_inverscontadoplan dic ON (dic.idinversion = di.idinversion)
                             WHERE di.idestructuracomun in ($identidades) AND di.idestadoinversion = 1 AND dic.idejercicio = $idejercicio
                             UNION
                             SELECT 'credito' as como,
                                    sum(dif.valor) as valor
                             FROM mod_planifinversiones.dat_inversion di
                             INNER JOIN mod_planifinversiones.dat_inversfinancplan dif ON (dif.idinversion = di.idinversion)
                             WHERE di.idestructuracomun in ($identidades) AND di.idestadoinversion = 1 AND dif.idejercicio = $idejercicio
                           ) r
                    ) * 100 as porciento
             FROM mod_planifinversiones.dat_inversion di
             INNER JOIN mod_planifinversiones.dat_inversfinancplan dif ON (dif.idinversion = di.idinversion)

             WHERE di.idestructuracomun in ($identidades)
              AND di.idestadoinversion = 1
             AND dif.idejercicio = $idejercicio";
        //pre_r($sql);die;
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getQuienFinancia($entidades,$idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                    distinct ndn.denominacion 
                FROM mod_planifinversiones.dat_inversion di
                INNER JOIN mod_planifinversiones.dat_inversfinancistaplan dfp ON (dfp.idinversion = di.idinversion)
                INNER JOIN mod_planifinversiones.dat_financista df ON (df.idfinancista = dfp.idfinancista)
                INNER JOIN mod_planificacion.nom_datosnomenclador ndn ON (ndn.iddatosnomenclador = df.iddatosnomenclador) 
                INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON  (dfp.idmonedaentidad = dme.idmonedaentidad and di.idestructuracomun = dme.idestructuracomun)
                INNER JOIN mod_datosmaestros.nom_moneda nme ON (nme.idmoneda = dme.idmoneda)
                WHERE di.idestructuracomun in ($identidades) AND di.idestadoinversion = 1 AND dfp.idejercicio = $idejercicio
                order by ndn.denominacion ";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_COLUMN);
    }

    public function graficarQuienFinancia($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    ndn.denominacion,
                    sum(dfp.valor) as valor,
                    dme.idmoneda ,
                    nme.codigoiso
                FROM mod_planifinversiones.dat_inversion di
                INNER JOIN mod_planifinversiones.dat_inversfinancistaplan dfp ON (dfp.idinversion = di.idinversion)
                INNER JOIN mod_planifinversiones.dat_financista df ON (df.idfinancista = dfp.idfinancista)
                INNER JOIN mod_planificacion.nom_datosnomenclador ndn ON (ndn.iddatosnomenclador = df.iddatosnomenclador) 
                INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON  (dfp.idmonedaentidad = dme.idmonedaentidad and di.idestructuracomun = dme.idestructuracomun)
                INNER JOIN mod_datosmaestros.nom_moneda nme ON (nme.idmoneda = dme.idmoneda)
                WHERE di.idestructuracomun in ($identidades) AND
                dfp.idejercicio = $idejercicio
                and di.idestadoinversion = 1
                 and ($ejercicio >=(date_part('year', di.fechainicio))::numeric
                 and  $ejercicio <=(date_part('year', di.fechafin))::numeric)
                GROUP BY ndn.denominacion,  dme.idmoneda,nme.codigoiso
                order by ndn.denominacion,nme.codigoiso";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graficarInversionesMasCostosas($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  f.idinversion,
                  f.denominacion || ' (' || f.denomorganismo || ')' as denominacion,
                  f.idmoneda,
                  f.codigoiso,
                  coalesce(sum(f.valor), 0) AS valor
                  FROM
                (
                SELECT
                 'componentes' as origen,
                  i.idinversion,
                  i.denominacion,
                  case when (select fepadre1.idpadre from mod_estructuracomp.nom_filaestruc fepadre1 where fepadre1.idfila = fepadre.idfila)= fepadre.idfila
                              then est.denominacion
                              else estpadre.denominacion end as denomorganismo,
                  iep.idmoneda,
                  m.codigoiso,
                  COALESCE(iep.valor,0) AS valor
                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)

                 inner join mod_estructuracomp.nom_filaestruc fe ON(i.idestructuracomun = fe.idfila)
		inner join mod_estructuracomp.nom_filaestruc fepadre ON(fe.idpadre = fepadre.idfila)
		inner join mod_estructuracomp.dat_estructura estpadre ON(fepadre.idfila = estpadre.idestructura)
		inner join mod_estructuracomp.dat_estructura est ON(fe.idfila = est.idestructura)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(iep.idmoneda = m.idmoneda)
                  where iep.idejercicio = $idejercicio
                  and i.idestructuracomun in($identidades)
                  and i.idestadoinversion = 1
                     and ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                     and  $ejercicio <=(date_part('year', i.fechafin))::numeric)

                /*union

                SELECT
                 'pp' as origen,
                  i.idinversion,
                  i.denominacion,
                  m.idmoneda,
                  m.codigoiso,
                  COALESCE(pp.valor,0) AS valor
                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_presanteproy pp ON(i.idinversion = pp.idinversion)
                INNER JOIN mod_datosmaestros.dat_monedaentidad me ON(pp.idmonedaentidad = me.idmonedaentidad)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                  where i.idejercicio = $idejercicio
                  and i.idestructuracomun in($identidades)se mando a quitar por los usuarios*/
                )f
                where f.idinversion in(select
                          y.idinversion
                        from(SELECT
                         'componentes' as origen,
                          i.idinversion,
                          i.denominacion,
                          COALESCE(iep.valor,0) AS valor
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                        INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                          where iep.idejercicio = $idejercicio
                          and i.idestructuracomun in($identidades)
                          and i.idestadoinversion = 1
                     and ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                     and  $ejercicio <=(date_part('year', i.fechafin))::numeric)

                        /*union

                        SELECT
                         'pp' as origen,
                          i.idinversion,
                          i.denominacion,
                          COALESCE(ppp.valor,0) AS valor
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.dat_presanteproy pp ON(i.idinversion = pp.idinversion)
                        INNER JOIN mod_planifinversiones.dat_presupplan ppp ON(pp.idpresanteproy = ppp.idpresanteproy)
                          where i.idejercicio = $idejercicio
                          and i.idestructuracomun in($identidades)*/)y
                        group by
                          y.idinversion,
                          y.denominacion
                        order by sum(y.valor) desc
                        limit 10
                )
                group by f.idinversion,f.denominacion,f.denomorganismo, f.idmoneda,f.codigoiso
                order by f.codigoiso,valor desc";
        //pre_r($sql);die;
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }
    public function graficarEquiposGenericos($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  sum(eqp.valor) as cantidad,
                  indp.idindicador as indpadre,
                  indp.denominacion as equipopadre
                FROM
                  mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (ei.idetapainversion = eq.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos = eqg.idetapaequipos)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoplan eqp ON(eqg.idetapaequipoglobal = eqp.idetapaequipoglobal)
                  INNER JOIN mod_datosmaestros.nom_indicador ind ON (eq.idindicador = ind.idindicador)
                  INNER JOIN mod_datosmaestros.nom_indicador indp ON (ind.idarbol = indp.idindicador)
                WHERE
                  eqp.idejercicio = $idejercicio
                  and i.idestadoinversion = 1
                  and i.idestructuracomun in($identidades)
                  and  ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                  and  $ejercicio <=(date_part('year', i.fechafin))::numeric)
                group by
                  indp.idindicador,
                  indp.denominacion
                order by
                   indp.idindicador";

        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function indicadoresEquiposPrimerNivel() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  indp.idindicador as indpadre,
                  indp.denominacion as equipopadre
                FROM
                  mod_datosmaestros.nom_indicador indp
                WHERE
                 indp.nivel = 1";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graficarEquiposplan($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  sum(eqp.valor) as cantidad,
                  m.idmodelo,
                  m.denominacion
                FROM
                  mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (ei.idetapainversion = eq.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos = eqg.idetapaequipos)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoplan eqp ON(eqg.idetapaequipoglobal = eqp.idetapaequipoglobal)
                  inner JOIN mod_planificacion.dat_entidadmodelo em ON(eq.identidadmodelo = em.identidadmodelo)
                  INNER JOIN mod_planificacion.dat_modelo m ON (em.idmodelo = m.idmodelo)
                WHERE
                  eqp.idejercicio = $idejercicio
                  and i.idestructuracomun in($identidades)
                  and i.idestadoinversion = 1
                  and  ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                  and  $ejercicio <=(date_part('year', i.fechafin))::numeric)
                group by
                  m.idmodelo,
                  m.denominacion
                order by
                   m.denominacion";
        //print_r($sql);die;
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }


    public function planesEquipos($entidades) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct m.denominacion
                FROM mod_planificacion.dat_entidadmodelo em
                  inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)
                where em.identidad in($identidades);";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graficarEquiposAdquisicion($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  sum(eqp.valor) as cantidad,
                  dn.iddatosnomenclador,
                  dn.denominacion
                FROM
                  mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (ei.idetapainversion = eq.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos = eqg.idetapaequipos)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoplan eqp ON(eqg.idetapaequipoglobal = eqp.idetapaequipoglobal)
                  inner JOIN  mod_planifinversiones.dat_adquisicion  va ON(eq.idadquisicion = va.idadquisicion)
                  INNER JOIN  mod_planificacion.nom_datosnomenclador dn ON (va.iddatosnomenclador = dn.iddatosnomenclador)
                WHERE
                  eqp.idejercicio = $idejercicio
                  and i.idestadoinversion = 1
                  and i.idestructuracomun in($identidades)
                  and  ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                  and  $ejercicio <=(date_part('year', i.fechafin))::numeric)
                group by
                  dn.iddatosnomenclador,
                  dn.denominacion
                order by
                   dn.denominacion";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function viasAdquisicionEquipos() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct dn.denominacion
                FROM
                  mod_planifinversiones.dat_adquisicion va
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (va.iddatosnomenclador = dn.iddatosnomenclador)";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_COLUMN);
    }



    public function sectoresEstrategicos() {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dn.denominacion, se.iddatosnomenclador
                FROM
                  mod_planifinversiones.dat_sectorestrategico se
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (se.iddatosnomenclador = dn.iddatosnomenclador)";

        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }


    public function graficarMasEquipos($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  sum(eqp.valor) as cantidad,
                  i.idinversion,
                  i.denominacion || ' (' || case when (fe.idfila <> fe.idpadre)
                     then
                       ( select estpadre.denominacion from mod_estructuracomp.dat_estructura estpadre
                         where estpadre.idestructura = fe.idpadre )
                     else
                  estr.denominacion end || ')' as denominacion
                FROM
                  mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (ei.idetapainversion = eq.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos = eqg.idetapaequipos)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoplan eqp ON(eqg.idetapaequipoglobal = eqp.idetapaequipoglobal)

                  inner join mod_estructuracomp.nom_filaestruc fe ON(i.idestructuracomun = fe.idfila)
                  inner join mod_estructuracomp.dat_estructura estr ON(fe.idfila = estr.idestructura)
                WHERE
                  eqp.idejercicio = $idejercicio
                  and i.idestadoinversion = 1
                  and i.idestructuracomun in($identidades)
                  and  ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                  and  $ejercicio <=(date_part('year', i.fechafin))::numeric)
                group by
                   i.idinversion,
                   estr.denominacion,
                   fe.idfila
                order by
                   cantidad desc,
                   i.idinversion
                limit 10";
        //print_r($sql);die;
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graficarInversionesPorTipo($entidades, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                    i.idtipoinversion,
                    ti.denominacion,
                    count(i.idinversion) as cantidad,
                    count(i.idinversion) * 100/(SELECT count(i.idinversion) as cantidad
                    FROM mod_planifinversiones.dat_inversion i
                    INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                    INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                    INNER JOIN mod_planifinversiones.nom_tipoinversion ti ON(i.idtipoinversion = ti.idtipoinversion)
                    where iep.idejercicio = $idejercicio
                    and i.idestructuracomun in($identidades))::numeric as porciento

                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                INNER JOIN mod_planifinversiones.nom_tipoinversion ti ON(i.idtipoinversion = ti.idtipoinversion)
                where iep.idejercicio = $idejercicio
                and i.idestadoinversion = 1
                and i.idestructuracomun in($identidades)
                group by i.idtipoinversion,ti.denominacion";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graficarInversionesPorTipoYMonedas($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  f.idtipoinversion,
                  f.denominacion,
                  f.idmoneda,
                  f.codigoiso,
                  coalesce(sum(f.valor), 0) AS valor
                  FROM
                (
                SELECT
                 'componentes' as origen,
                  i.idtipoinversion,
                  ti.denominacion,
                  iep.idmoneda,
                  m.codigoiso,
                  COALESCE(iep.valor,0) AS valor
                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(iep.idmoneda = m.idmoneda)
                INNER JOIN mod_planifinversiones.nom_tipoinversion ti ON(i.idtipoinversion = ti.idtipoinversion)
                  where iep.idejercicio = $idejercicio
                  and i.idestructuracomun in($identidades)
                  and i.idestadoinversion = 1
                     and ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                     and  $ejercicio <=(date_part('year', i.fechafin))::numeric)

                /*UNION

                SELECT
                 'planprep' as origen,
                  i.idtipoinversion,
                  ti.denominacion,
                  m.idmoneda,
                  m.codigoiso,
                  COALESCE(ppp.valor,0) AS valor
                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_presanteproy pp ON(i.idinversion = pp.idinversion)
                INNER JOIN mod_planifinversiones.dat_presupplan ppp ON(pp.idpresanteproy = ppp.idpresanteproy)
                INNER JOIN mod_datosmaestros.dat_monedaentidad me ON(pp.idmonedaentidad = me.idmonedaentidad)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                INNER JOIN mod_planifinversiones.nom_tipoinversion ti ON(i.idtipoinversion = ti.idtipoinversion)
                  where
                  ($ejercicio >= (date_part('year',  i.fechainicio))::numeric
                      and
                      $ejercicio <= (date_part('year',  i.fechafin))::numeric
                  )
                  and i.idestructuracomun in($identidades)*/
                )f

                group by f.idtipoinversion,f.denominacion,f.idmoneda,f.codigoiso
                order by f.idmoneda,f.denominacion";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function inversionesObjetivos($entidades, $ejercicio, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "  SELECT
                  i.idobjetivo,
                  dn.denominacion,
                  count (i.idinversion) as cantidad
                  FROM mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_objetivo o ON(i.idobjetivo = o.idobjetivo)
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(o.iddatosnomenclador = dn.iddatosnomenclador)
                  where i.idejercicio = $idejercicio
                  and i.idestadoinversion = 1
                  and
                  ($ejercicio >= (date_part('year',  i.fechainicio))::numeric
                  and
                  $ejercicio <= (date_part('year',  i.fechafin))::numeric)

                        and i.idestructuracomun in($identidades)

                  group by
                    i.idobjetivo,
                    dn.denominacion

                  order by
                    dn.denominacion";
        //pre_r($sql);die;
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function inversionesObjetivosImporte($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "  SELECT
                  i.idobjetivo,
                  dn.denominacion,
                  iep.idmoneda,
                  m.codigoiso ,
                  sum(COALESCE(iep.valor,0)) AS valor
                  FROM mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                  INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                  INNER JOIN mod_datosmaestros.nom_moneda m ON(iep.idmoneda = m.idmoneda)
                  INNER JOIN mod_planifinversiones.dat_objetivo o ON(i.idobjetivo = o.idobjetivo)
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(o.iddatosnomenclador = dn.iddatosnomenclador)
                  where iep.idejercicio = $idejercicio
                          and i.idestructuracomun in($identidades)
                          and i.idestadoinversion = 1
                  and
                  ($ejercicio >= (date_part('year',  i.fechainicio))::numeric
                  and
                  $ejercicio <= (date_part('year',  i.fechafin))::numeric)

                  group by
                    i.idobjetivo,
                    dn.denominacion,
                    iep.idmoneda,
                    m.codigoiso

                  order by
                    m.codigoiso";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }
    public function inversionesEfecto($entidades, $ejercicio, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = " SELECT
                  i.idefectocomercial,
                  dn.denominacion,
                  count (i.idinversion) as cantidad
                  FROM mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_efectocomercial e ON(i.idefectocomercial = e.idefectocomercial)
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(e.iddatosnomenclador = dn.iddatosnomenclador)
                  where i.idejercicio = $idejercicio
                  and i.idestadoinversion = 1
                  and
                  ($ejercicio >= (date_part('year',  i.fechainicio))::numeric
                  and
                  $ejercicio <= (date_part('year',  i.fechafin))::numeric
                  )

                        and i.idestructuracomun in($identidades)

                  group by
                    i.idefectocomercial,
                    dn.denominacion

                  order by
                    dn.denominacion";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function inversionesEfectoImporte($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = " SELECT
                  i.idefectocomercial,
                  dn.denominacion,
                  iep.idmoneda,
                  m.codigoiso ,
                  sum(COALESCE(iep.valor,0)) AS valor
                  FROM mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_etapainversion ie ON(i.idinversion = ie.idinversion)
                  INNER JOIN mod_planifinversiones.dat_inversetapaplan iep ON(ie.idetapainversion = iep.idetapainversion)
                  INNER JOIN mod_datosmaestros.nom_moneda m ON(iep.idmoneda = m.idmoneda)
                  INNER JOIN mod_planifinversiones.dat_efectocomercial e ON(i.idefectocomercial = e.idefectocomercial)
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(e.iddatosnomenclador = dn.iddatosnomenclador)
                  where iep.idejercicio = $idejercicio
                          and i.idestructuracomun in($identidades)
                          and i.idestadoinversion = 1
                  and
                  ($ejercicio >= (date_part('year',  i.fechainicio))::numeric
                  and
                  $ejercicio <= (date_part('year',  i.fechafin))::numeric
                  )

                  group by
                    i.idefectocomercial,
                    dn.denominacion,
                    iep.idmoneda,
                    m.codigoiso

                  order by
                    m.codigoiso";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function inversionesSectores($entidades, $ejercicio, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = " SELECT
                  dn.iddatosnomenclador,
                  dn.denominacion,
                  count (i.idinversion) as cantidad
                  FROM mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_medioambglobal dmb ON(i.idinversion = dmb.idinversion)
                  INNER JOIN mod_planifinversiones.dat_sector ds ON(ds.iddatosnomenclador = dmb.iddatosnomenclador and ds.idnomenclador = dmb.idnomenclador)

                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(ds.iddatosnomenclador = dn.iddatosnomenclador  )

                  where
                    i.idestadoinversion = 1
                   and
                  ($ejercicio >= (date_part('year',  i.fechainicio))::numeric
                  and
                  $ejercicio <= (date_part('year',  i.fechafin))::numeric
                  )

                        and i.idestructuracomun in($identidades)
                  group by
                    dn.iddatosnomenclador,
                    dn.denominacion

                  order by
                    dn.denominacion";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function inversionesSectoresImporte($entidades, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = " SELECT
                  dn.iddatosnomenclador,
                  dn.denominacion,
                  m.idmoneda,
                  m.codigoiso ,
                  sum(COALESCE(map.valor,0)) AS valor
                  FROM mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_medioambglobal dmb ON(i.idinversion = dmb.idinversion)
                  INNER JOIN mod_planifinversiones.dat_sector ds ON(ds.iddatosnomenclador = dmb.iddatosnomenclador and ds.idnomenclador = dmb.idnomenclador)

                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(ds.iddatosnomenclador = dn.iddatosnomenclador  )
                  INNER JOIN mod_planifinversiones.dat_medioambplan map on (map.idmedioambglobal = dmb.idmedioambglobal)
                  INNER JOIN mod_datosmaestros.dat_monedaentidad me ON(me.idmonedaentidad = map.idmonedaentidad)
                  INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                  where map.idejercicio = $idejercicio
                          and i.idestadoinversion = 1
                          and i.idestructuracomun in($identidades)

                  group by
                    dn.iddatosnomenclador,
                    dn.denominacion,
                    m.idmoneda,
                    m.codigoiso

                  order by
                    m.codigoiso";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function inversionesCuencas($entidades, $ejercicio, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  dn.iddatosnomenclador,
                  dn.denominacion,
                  count (i.idinversion) as cantidad
                  FROM mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_medioambglobal dmb ON(i.idinversion = dmb.idinversion)
                  INNER JOIN mod_planifinversiones.dat_cuenca dc ON(dc.iddatosnomenclador = dmb.iddatosnomenclador and dc.idnomenclador = dmb.idnomenclador)

                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(dc.iddatosnomenclador = dn.iddatosnomenclador  )

                  where /*i.idejercicio = $idejercicio*/
                  ($ejercicio >= (date_part('year',  i.fechainicio))::numeric
                  and
                  $ejercicio <= (date_part('year',  i.fechafin))::numeric
                  )
                  and i.idestadoinversion = 1

                  and i.idestructuracomun in($identidades)
                  group by
                    dn.iddatosnomenclador,
                    dn.denominacion

                  order by
                    dn.denominacion";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function inversionesCuencasImporte($entidades, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "  SELECT
                  dn.iddatosnomenclador,
                  dn.denominacion,
                  m.idmoneda,
                  m.codigoiso ,
                  sum(COALESCE(map.valor,0)) AS valor
                  FROM mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_medioambglobal dmb ON(i.idinversion = dmb.idinversion)
                  INNER JOIN mod_planifinversiones.dat_cuenca dc ON(dc.iddatosnomenclador = dmb.iddatosnomenclador and dc.idnomenclador = dmb.idnomenclador)

                  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(dc.iddatosnomenclador = dn.iddatosnomenclador  )
                  INNER JOIN mod_planifinversiones.dat_medioambplan map on (map.idmedioambglobal = dmb.idmedioambglobal)
                  INNER JOIN mod_datosmaestros.dat_monedaentidad me ON(me.idmonedaentidad = map.idmonedaentidad)
                  INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                  where map.idejercicio = $idejercicio
                          and i.idestadoinversion = 1
                          and i.idestructuracomun in($identidades)

                  group by
                    dn.iddatosnomenclador,
                    dn.denominacion,
                    m.idmoneda,
                    m.codigoiso

                  order by
                    m.codigoiso";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graficarPlanPreparacion($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  f.idmoneda,
                  f.codigoiso,
                  coalesce(sum(f.valor), 0) AS valor
                  FROM
                (
                SELECT
                  m.idmoneda,
                  m.codigoiso,
                  COALESCE(p.valor,0) AS valor
                FROM mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_presanteproy pp ON(i.idinversion = pp.idinversion)
                INNER JOIN mod_planifinversiones.dat_presupplan p ON(pp.idpresanteproy = p.idpresanteproy)
                INNER JOIN mod_datosmaestros.dat_monedaentidad me ON(pp.idmonedaentidad = me.idmonedaentidad)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)

                  where p.idejercicio = $idejercicio
                  and i.idestructuracomun in($identidades)
                  and i.idestadoinversion = 1
                     and ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                     and  $ejercicio <=(date_part('year', i.fechafin))::numeric)
                )f

                group by f.idmoneda,f.codigoiso
                order by f.idmoneda";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }


    public function graficarEquiposSectorFisico($entidades, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  r.cantidad,
                  r.idsectorestrategico,
                  dn.denominacion
                FROM
                  mod_planificacion.nom_datosnomenclador dn
                  left join(
                      SELECT
                       coalesce(sum(eqp.valor),0) as cantidad,
                       se.iddatosnomenclador,
                       se.idsectorestrategico

                      from mod_planifinversiones.dat_inversion i
                      INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                      INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (ei.idetapainversion = eq.idetapainversion)
                      INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos = eqg.idetapaequipos)
                      INNER JOIN mod_planifinversiones.dat_etapaequipoplan eqp ON(eqg.idetapaequipoglobal = eqp.idetapaequipoglobal)
                      inner JOIN  mod_planifinversiones.dat_sectorestrategico se ON(i.idsectorestrategico = se.idsectorestrategico)

                    WHERE
                      eqp.idejercicio = $idejercicio
                      and i.idestadoinversion = 1
                      and i.idestructuracomun in($identidades)
                    group by
                      se.iddatosnomenclador,
                      se.idsectorestrategico

                )r ON(dn.iddatosnomenclador = r.iddatosnomenclador)
                inner JOIN  mod_planifinversiones.dat_sectorestrategico se ON(dn.iddatosnomenclador = se.iddatosnomenclador)
                order by
                   dn.denominacion";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graficarEquiposSectorMonto($entidades, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  r.valor,
                  r.valordivisa,
                  r.idsectorestrategico,
                  dn.denominacion
                FROM
                  mod_planificacion.nom_datosnomenclador dn
                  left join(
                      SELECT
                       sum(eqp.valor * eq.precio) as valor,
                           sum(eqp.valor * eq.preciodivisa) as valordivisa,
                       se.iddatosnomenclador,
                       se.idsectorestrategico

                      from mod_planifinversiones.dat_inversion i
                      INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                      INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (ei.idetapainversion = eq.idetapainversion)
                      INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos = eqg.idetapaequipos)
                      INNER JOIN mod_planifinversiones.dat_etapaequipoplan eqp ON(eqg.idetapaequipoglobal = eqp.idetapaequipoglobal)
                      inner JOIN  mod_planifinversiones.dat_sectorestrategico se ON(i.idsectorestrategico = se.idsectorestrategico)
                     WHERE
                      eqp.idejercicio = $idejercicio
                      and i.idestadoinversion = 1
                      and i.idestructuracomun in($identidades)
                    group by
                      se.iddatosnomenclador,
                      se.idsectorestrategico

                )r ON(dn.iddatosnomenclador = r.iddatosnomenclador)
                inner JOIN  mod_planifinversiones.dat_sectorestrategico se ON(dn.iddatosnomenclador = se.iddatosnomenclador)
                order by
                   dn.denominacion";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function graficarEquiposOrganismoSectorMonto($entidades, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                   sum(eqp.valor * eq.precio) as valor,
                   sum(eqp.valor * eq.preciodivisa) as valordivisa,
                   se.iddatosnomenclador,
                   i.idestructuracomun,
                   e.denominacion as denomestructura
                  from mod_planifinversiones.dat_inversion i
                  inner join mod_estructuracomp.dat_estructura e on (i.idestructuracomun = e.idestructura and e.idproyecto = 0)
                  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (ei.idetapainversion = eq.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos = eqg.idetapaequipos)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoplan eqp ON(eqg.idetapaequipoglobal = eqp.idetapaequipoglobal)
                  inner JOIN  mod_planifinversiones.dat_sectorestrategico se ON(i.idsectorestrategico = se.idsectorestrategico)
                  inner JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = se.iddatosnomenclador)
                 WHERE
                  eqp.idejercicio = $idejercicio
                  and i.idestadoinversion = 1
                  and i.idestructuracomun in($identidades)
                group by
                  i.idestructuracomun,
            e.denominacion,
                  se.iddatosnomenclador,
                  dn.denominacion
            order by
            e.denominacion,
            dn.denominacion";

        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }


    public function graficarComoFinanciaMonedas($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 'Contado' as como,
                    m.idmoneda,
                    m.codigoiso,
                    sum(dic.valor) as valor
                    FROM mod_planifinversiones.dat_inversion di
                     INNER JOIN mod_planifinversiones.dat_inverscontadoplan dic ON (dic.idinversion = di.idinversion)
                INNER JOIN mod_datosmaestros.dat_monedaentidad me ON(dic.idmonedaentidad = me.idmonedaentidad)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                     WHERE di.idestructuracomun in ($identidades) and dic.idejercicio = $idejercicio
                     and di.idestadoinversion = 1
                     and ($ejercicio >=(date_part('year', di.fechainicio))::numeric
                     and  $ejercicio <=(date_part('year', di.fechafin))::numeric)
                group by m.idmoneda
                     UNION
                     SELECT 'Credito' as como,
                     m.idmoneda,
                     m.codigoiso,
                        sum(dif.valor) as valor
                     FROM mod_planifinversiones.dat_inversion di
                     INNER JOIN mod_planifinversiones.dat_inversfinancplan dif ON (dif.idinversion = di.idinversion)
                INNER JOIN mod_datosmaestros.dat_monedaentidad me ON(dif.idmonedaentidad = me.idmonedaentidad)
                INNER JOIN mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda)
                     WHERE di.idestructuracomun in ($identidades)and dif.idejercicio = $idejercicio
                     and di.idestadoinversion = 1
                     and ($ejercicio >=(date_part('year', di.fechainicio))::numeric
                     and  $ejercicio <=(date_part('year', di.fechafin))::numeric)
                group by m.idmoneda

                order by como";

        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }


    public function organosSatisface($entidades, $idejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idorganosatisface, denominacion
                  FROM mod_datosmaestros.nom_organosatisface
                  where estado = 1";
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }



    public function graficarEquiposOrganoSatisf($entidades, $idejercicio, $ejercicio) {
        $identidades = implode(',', $entidades);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  sum(eqp.valor) as cantidad,
                  ivo.idorganosatisface,
                  o.denominacion
                FROM
                  mod_planifinversiones.dat_inversion i
                  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipos eq ON (ei.idetapainversion = eq.idetapainversion)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eqg ON(eq.idetapaequipos = eqg.idetapaequipos)
                  INNER JOIN mod_planifinversiones.dat_etapaequipoplan eqp ON(eqg.idetapaequipoglobal = eqp.idetapaequipoglobal)
                  inner join mod_datosmaestros.nom_indicador iv on(eq.idindicador = iv.idindicador)
                  inner join (select distinct idorganosatisface,idindicador from mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface) ivo on (iv.idindicador = ivo.idindicador)
                  inner join mod_datosmaestros.nom_organosatisface o on (o.idorganosatisface = ivo.idorganosatisface)

                WHERE
                  eqp.idejercicio = $idejercicio
                  and i.idestructuracomun in($identidades)
                  and i.idestadoinversion = 1
                  and ($ejercicio >=(date_part('year', i.fechainicio))::numeric
                  and  $ejercicio <=(date_part('year', i.fechafin))::numeric)
                group by
                  ivo.idorganosatisface,
                  o.denominacion
                order by
                   o.denominacion";
        //print_r($sql);die;
        $datosSql = $conn->execute($sql);
        return $datosSql->fetchAll(PDO::FETCH_ASSOC);
    }







}
