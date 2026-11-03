<?php

class DatInversnivelactividaddesglose extends BaseDatInversnivelactividaddesglose {

    public function setUp() {
        parent :: setUp();
    }

    public function listarInvNivelActividad($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "select x.idinversnivelactividad,
                       x.idactividad,
                       x.idactespcomportamiento,
                       x.identidad,
                       x.nivelact,
                       x.nivelactividadinversion as cantidad,
                       sum(idaante) as idaante,
                       sum(idante) as idante,
                       sum(idactual) as idactual,
                       sum(idpos) as idpos,
                       sum(ejecutado1) as aantetotal,
                       sum(estimado1)as aanteestimado,
                       sum(plan1) as aanteplan,
                       sum(proyeccion1)as aanteproyeccion,
                       sum(ejecutado2) as antetotal,
                       sum(estimado2)as anteestimado,
                       sum(plan2) as anteplan,
                       sum(proyeccion2)as anteproyeccion,
                       sum(ejecutado3) as actualtotal,
                       sum(estimado3)as actualestimado,
                       sum(plan3) as actualplan,
                       sum(proyeccion3)as actualproyeccion,
                       sum(ejecutado4) as postotal,
                       sum(estimado4)as posestimado,
                       sum(plan4) as posplan,
                       sum(proyeccion4)as posproyeccion from (


                ------------------------------------------------------------------------------
                SELECT nei.idinversnivelactividad,
                       aec.idactividad,
                       aec.idactespcomportamiento,
                       nei.identidad,
                       ice.idinversnivelactividaddesglose as idaante,
                       0 as idante,
                       0 as idactual,
                       0 as idpos,
                       dn.denominacion nivelact,
                       nei.nivelactividadinversion,
                       COALESCE(ice.ejecutado,0) as ejecutado1,
                       COALESCE(ice.estimado,0) as estimado1,
                       COALESCE(ice.plan,0) as plan1,
                       COALESCE(ice.proyeccion,0) as proyeccion1,
                       0 as ejecutado2,
                       0 as estimado2,
                       0 as plan2,
                       0 as proyeccion2,
                       0 as ejecutado3,
                       0 as estimado3,
                       0 as plan3,
                       0 as proyeccion3,
                       0 as ejecutado4,
                       0 as estimado4,
                       0 as plan4,
                       0 as proyeccion4
                FROM mod_planifintegracion.dat_inversnivelactividad nei
                     left join mod_planifinversiones.dat_inversnivelactividaddesglose ice ON(nei.idinversnivelactividad
=ice.idinversnivelactividad AND ice.idejercicio = {$params['aaejercicio']} )
                     left JOIN mod_planificacion.dat_actespcomportamiento  aec ON(nei.idactespcomportamiento = aec.idactespcomportamiento)
                     INNER JOIN mod_planificacion.nom_actividad dn ON (aec.idactividad = dn.idactividad)
                WHERE nei.idetapainversion = {$params['idetapainversion']}
                ------------------------------------------------------------------------------
                union

                SELECT nei.idinversnivelactividad,
                       aec.idactividad,
                       aec.idactespcomportamiento,
                       nei.identidad,
                       0 as idaante,
                       ice.idinversnivelactividaddesglose as idante,
                       0 as idactual,
                       0 as idpos,
                       dn.denominacion nivelact,
                       nei.nivelactividadinversion,
                       0 as ejecutado1,
                       0 as estimado1,
                       0 as plan1,
                       0 as proyeccion1,
                       COALESCE(ice.ejecutado,0) as ejecutado2,
                       COALESCE(ice.estimado,0) as estimado2,
                       COALESCE(ice.plan,0) as plan2,
                       COALESCE(ice.proyeccion,0) as proyeccion2,
                       0 as ejecutado3,
                       0 as estimado3,
                       0 as plan3,
                       0 as proyeccion3,
                       0 as ejecutado4,
                       0 as estimado4,
                       0 as plan4,
                       0 as proyeccion4
                FROM mod_planifintegracion.dat_inversnivelactividad nei
                     left join mod_planifinversiones.dat_inversnivelactividaddesglose ice ON(nei.idinversnivelactividad
=ice.idinversnivelactividad AND ice.idejercicio = {$params['aejercicio']} )
                     left JOIN mod_planificacion.dat_actespcomportamiento  aec ON(nei.idactespcomportamiento = aec.idactespcomportamiento)
                     INNER JOIN mod_planificacion.nom_actividad dn ON (aec.idactividad = dn.idactividad)
                WHERE nei.idetapainversion = {$params['idetapainversion']}
                ------------------------------------------------------------------------------
                union

                SELECT nei.idinversnivelactividad,
                       aec.idactividad,
                       aec.idactespcomportamiento,
                       nei.identidad,
                       0 as idaante,
                       0 as idante,
                       ice.idinversnivelactividaddesglose as idactual,
                       0 as idpos,
                       dn.denominacion nivelact,
                       nei.nivelactividadinversion,
                       --ice.idinverscapexplot,
                       --ice.idejercicio,
                       0 as ejecutado1,
                       0 as estimado1,
                       0 as plan1,
                       0 as proyeccion1,
                       0 as ejecutado2,
                       0 as estimado2,
                       0 as plan2,
                       0 as proyeccion2,
                       COALESCE(ice.ejecutado,0) as ejecutado3,
                       COALESCE(ice.estimado,0) as estimado3,
                       COALESCE(ice.plan,0) as plan3,
                       COALESCE(ice.proyeccion,0) as proyeccion3,
                       0 as ejecutado4,
                       0 as estimado4,
                       0 as plan4,
                       0 as proyeccion4
                FROM mod_planifintegracion.dat_inversnivelactividad nei
                     left join mod_planifinversiones.dat_inversnivelactividaddesglose ice ON(nei.idinversnivelactividad
=ice.idinversnivelactividad AND ice.idejercicio = {$params['idejercicio']} )
                     left JOIN mod_planificacion.dat_actespcomportamiento  aec ON(nei.idactespcomportamiento = aec.idactespcomportamiento)
                     INNER JOIN mod_planificacion.nom_actividad dn ON (aec.idactividad = dn.idactividad)
                WHERE nei.idetapainversion = {$params['idetapainversion']}

                ------------------------------------------------------------------------------
                union

                SELECT nei.idinversnivelactividad,
                       aec.idactividad,
                       aec.idactespcomportamiento,
                       nei.identidad,
                       0 as idaante,
                       0 as idante,
                       0 as idactual,
                       ice.idinversnivelactividaddesglose as idpos,
                       dn.denominacion nivelact,
                       nei.nivelactividadinversion,
                       --ice.idinverscapexplot,
                       --ice.idejercicio,
                       0 as ejecutado1,
                       0 as estimado1,
                       0 as plan1,
                       0 as proyeccion1,
                       0 as ejecutado2,
                       0 as estimado2,
                       0 as plan2,
                       0 as proyeccion2,
                       0 as ejecutado3,
                       0 as estimado3,
                       0 as plan3,
                       0 as proyeccion3,
                       COALESCE(ice.ejecutado,0) as ejecutado4,
                       COALESCE(ice.estimado,0) as estimado4,
                       COALESCE(ice.plan,0) as plan4,
                       COALESCE(ice.proyeccion,0) as proyeccion4
                FROM mod_planifintegracion.dat_inversnivelactividad nei
                     left join mod_planifinversiones.dat_inversnivelactividaddesglose ice ON(nei.idinversnivelactividad
=ice.idinversnivelactividad AND ice.idejercicio = {$params['pejercicio']} )
                     left JOIN mod_planificacion.dat_actespcomportamiento  aec ON(nei.idactespcomportamiento = aec.idactespcomportamiento)
                     INNER JOIN mod_planificacion.nom_actividad dn ON (aec.idactividad = dn.idactividad)
                WHERE nei.idetapainversion = {$params['idetapainversion']}
                )x

                group by x.idinversnivelactividad,
                       x.idactividad,
                       x.idactespcomportamiento,
                       x.identidad,
                       x.nivelact,
                       x.nivelactividadinversion

                order by x.nivelact
                OFFSET " . $params['start'] . "
                LIMIT " . $params['limit'];
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        //pre_r($datos);die;
        return $datos;
    }



}

