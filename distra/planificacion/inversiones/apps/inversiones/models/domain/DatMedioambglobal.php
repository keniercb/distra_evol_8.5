<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/03/16
 * Time: 9:23
 */
class DatMedioambglobal extends BaseDatMedioambglobal {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idmedio) {
        return Doctrine::getTable('DatMedioambglobal')->find($idmedio)->toArray();
    }

    public function eliminarDat($parametros, $datos) {
        if (count($datos['datos']) > 0 && $parametros['idinversion'] != '') {
            $query = new Doctrine_Query();
            $sql_query = "DELETE FROM mod_planifinversiones.dat_medioambglobal 
                            WHERE (idinversion = " . $parametros['idinversion'] . " AND idmedioambglobal IN 
                            (" . $datos . "))";
            $conn = Doctrine_Manager::connection();
            $conn->execute($sql_query);
        }
    }

    public function addvalorGlobal($tabla, $valor, $moneda, $ejercicio, $medio) {
        $conn = Doctrine_Manager::connection();
        $sql = "INSERT INTO  mod_planifinversiones." . $tabla . " (idmonedaentidad,idejercicio,idmedioambglobal,valor)
                VALUES (" . $moneda . "," . $ejercicio . "," . $medio . "," . $valor . ")";
        $res1 = $conn->execute($sql);
        return $res1;
                
    }

    public function findPresMedioAmb($imon, $glob) {
        $sql_query = "SELECT idmedioambpresupuesto
                FROM mod_planifinversiones.dat_medioambpresupuesto 
                WHERE  idmonedaentidad = $imon AND idmedioambglobal = $glob ";


        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) != 0) {
            return 1;
        } else {
            return 2;
        }
    }

    public function addPresupuestoGlobal($idglobal, $moneda, $valor) {
        if ($idglobal != "" && $moneda != "" && $valor != "" && $valor != 0) {
            $cant = self::findPresMedioAmb($moneda, $idglobal);
            $conn = Doctrine_Manager::connection();
            if ($cant == 2) {
                $sql = "INSERT INTO  mod_planifinversiones.dat_medioambpresupuesto (idmedioambglobal,idmonedaentidad,valor)
                VALUES (" . $idglobal . "," . $moneda . "," . $valor . ")";
            } else {
                $sql = "UPDATE mod_planifinversiones.dat_medioambpresupuesto
                    SET  valor = " . $valor . " 
                    WHERE   idmedioambglobal = " . $idglobal . " and idmonedaentidad = " . $moneda;
            }
            $res1 = $conn->execute($sql);
            return $res1;
        }
    }

    public function eliminarGlobal($tabla, $idinversion, $idtext, $id) {
        if ($idinversion != '') {
            $query = new Doctrine_Query();
            $sql_query = "DELETE FROM mod_planifinversiones." . $tabla . " 
                            WHERE (" . $idtext . " = " . $id . ")";
            $conn = Doctrine_Manager::connection();
            $conn->execute($sql_query);
        }
    }

    public function modDatos($iddatosnomenclador, $idmedio, $idnomen) {
        if ($iddatosnomenclador != "" && $idmedio != "" && $idnomen != "") {
            $conn = Doctrine_Manager::connection();
            $sql = "UPDATE mod_planifinversiones.dat_medioambglobal
            SET  iddatosnomenclador = " . $iddatosnomenclador . " 
            WHERE   idmedioambglobal = " . $idmedio . " and idnomenclador = " . $idnomen;
            $res1 = $conn->execute($sql);
            return $res1;
        } else {
            return 0;
        }
    }

    public function getIdNomen($idglobal) {
        $conn = Doctrine_Manager::connection();
        $sql = "select idnomenclador
                                FROM mod_planifinversiones.dat_medioambglobal 
                                where idmedioambglobal =" . $idglobal;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function findMeGlobal($iddatos, $idnomenclador, $idpadre, $idinversion) {
        if ($idpadre != 0) {
            $ADDWHERE = " AND idpadre = $idpadre ";
        }
        if ($idinversion != '') {
            $ADDWHERE .= " and idinversion = {$idinversion}";
        } else {
            $ADDWHERE .= ' and true';
        }
        $sql_query = "SELECT *
                FROM mod_planifinversiones.dat_medioambglobal 
                WHERE iddatosnomenclador = $iddatos AND idnomenclador = $idnomenclador $ADDWHERE";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) != 0) {
            return 1;
        } else {
            return 2;
        }
    }

    public function getMAplan($idinversion) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                coalesce(sum(map.valor), 0) as sum,
                map.idmonedaentidad,
                i.idinversion,
                me.idmoneda,
                nm.codigoiso
              FROM
                mod_planifinversiones.dat_medioambplan map
                INNER JOIN mod_planifinversiones.dat_medioambglobal mag ON (map.idmedioambglobal = mag.idmedioambglobal)
                INNER JOIN mod_planifinversiones.dat_inversion i ON (mag.idinversion = i.idinversion)
                INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (map.idmonedaentidad = me.idmonedaentidad)
                INNER JOIN mod_datosmaestros.nom_moneda nm ON (me.idmoneda = nm.idmoneda)
              WHERE
                i.idinversion =  " . $idinversion . "
             GROUP BY map.idmonedaentidad, i.idinversion, me.idmoneda, nm.codigoiso ORDER BY nm.codigoiso";
//pre_r($sql);die;
        return $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function totalSectoresAmbientalesPorOrganismos($params, $totalizarOrganismo) {
        if ($totalizarOrganismo == 0) {
            $selectSumOrg = " ";
            $groupByOrg = " ";
        } else {
            $selectSumOrg = "select sum(o.valormp) as valormp,
                               sum(o.valorusd) as valorusd,
                               o.estorganismo,
                               o.denominacion
                             from ( ";
            $groupByOrg = " )o
                          group by
                          o.estorganismo,
                          o.denominacion ";
        }

        $conn = Doctrine_Manager::connection();
        $sql_query = $selectSumOrg . " select
                           sum(r.valormp) as valormp,
                           sum(r.valorusd)as valorusd,
                           r.idsector,
                           r.denomsector,
                           r.estorganismo,
                           r.denominacion
                      from

                      (
                         SELECT
                             case when mon.codigoiso='CUP' then plan.valor else 0 end as valormp,
                             case when mon.codigoiso='USD' then plan.valor else 0 end as valorusd,
                             ds.idsector,
                             i.codigo,
                             --estpadre.denominacion,
                             --fepadre.idfila as idestpadre,
                             dn.denominacion as denomsector,
                             case when (select fepadre1.idpadre from mod_estructuracomp.nom_filaestruc fepadre1 where fepadre1.idfila = fepadre.idfila)= fepadre.idfila
                                  then est.denominacion
                                  else estpadre.denominacion end as denominacion,
                             case when (select fepadre1.idpadre from mod_estructuracomp.nom_filaestruc fepadre1 where fepadre1.idfila = fepadre.idfila)= fepadre.idfila
                                  then est.idestructura
                                  else estpadre.idestructura end as estorganismo

                            FROM mod_planifinversiones.dat_inversion i
                            INNER JOIN mod_planifinversiones.dat_medioambglobal glo ON(i.idinversion = glo.idinversion AND glo.idnomenclador = 21)
                            inner join mod_planificacion.nom_datosnomenclador dn ON (glo.iddatosnomenclador = dn.iddatosnomenclador)
                            inner join mod_planifinversiones.dat_sector ds ON (dn.iddatosnomenclador = ds.iddatosnomenclador)
                            inner join mod_estructuracomp.nom_filaestruc fe ON(i.idestructuracomun = fe.idfila)
                            inner join mod_estructuracomp.nom_filaestruc fepadre ON(fe.idpadre = fepadre.idfila)
                            inner join mod_estructuracomp.dat_estructura estpadre ON(fepadre.idfila = estpadre.idestructura)
                            inner join mod_estructuracomp.dat_estructura est ON(fe.idfila = est.idestructura)

                            LEFT JOIN mod_planifinversiones.dat_medioambplan plan ON(glo.idmedioambglobal = plan.idmedioambglobal)
                            INNER JOIN mod_datosmaestros.dat_monedaentidad monent ON(monent.idmonedaentidad = plan.idmonedaentidad)
                            INNER JOIN mod_datosmaestros.nom_moneda mon ON(mon.idmoneda = monent.idmoneda )


                        WHERE i.eliminada = 0 and i.idestadoinversion=1 and 
                        i.idestructuracomun in({$params['todas_entidades']})
                        and plan.idejercicio = {$params['idejercicio']}
                        {$params['provincia']}
                        {$params['cadenaWHERE']}
                    )r
                    group by r.idsector,r.denominacion,r.estorganismo,r.denomsector " . $groupByOrg;
        /* pre_r($sql_query); pre_r('--------'); */
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function totalPlanEjercicioInversiones($params) {

        $conn = Doctrine_Manager::connection();
        $sql_query = " select sum(r.planmp) as planmp,
        sum(r.planusd) as planusd
 from (
        SELECT COALESCE(sum(iepl.valor), 0) as planmp,
               COALESCE(sum(iepl1.valor), 0) as planusd
        FROM mod_planifinversiones.dat_inversion i
             INNER JOIN mod_planifinversiones.dat_etapainversion ei on (
             i.idinversion = ei.idinversion)
             LEFT JOIN mod_planifinversiones.dat_inversetapaplan iepl ON (
             ei.idetapainversion = iepl.idetapainversion AND iepl.idejercicio = {$params['idejercicio']}
             AND iepl.idmoneda IN (9900000103))
             LEFT JOIN mod_planifinversiones.dat_inversetapaplan iepl1 ON (
             ei.idetapainversion = iepl1.idetapainversion AND iepl1.idejercicio = {$params['idejercicio']} AND iepl1.idmoneda IN (9900000046))
             LEFT JOIN mod_planificacion.nom_ejercicioplanificacion ejp ON (
             ejp.idejercicio = {$params['idejercicio']})
        WHERE i.eliminada = 0 and i.idestadoinversion=1 and i.idestructuracomun IN ({$params['entidadesaux']})
        GROUP BY ejp.ejercicio
        union
        SELECT COALESCE(sum(eq.cantidad * eq.precio), 0) as planmp,
               COALESCE(sum(eq.cantidad * eq.preciodivisa), 0) as planusd
        FROM mod_planifinversiones.dat_inversion i
             INNER JOIN mod_planifinversiones.dat_etapainversion ei on (
             i.idinversion = ei.idinversion)
             left JOIN mod_planifinversiones.dat_etapaequipos eq ON (
             ei.idetapainversion = eq.idetapainversion)
        WHERE i.eliminada = 0 and i.idestadoinversion=1 and i.idestructuracomun IN ({$params['entidadesaux']})
      ) r";
        //{$params['cadenaWHERE']}
        //print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function totalSectoresAmbientales($params) {

        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT
     COALESCE(sum(plan1.valor),0) as valormp,
     COALESCE(sum(plan.valor),0) as valorusd
 FROM mod_planifinversiones.dat_inversion i
 INNER JOIN mod_planifinversiones.dat_medioambglobal glo ON(i.idinversion = glo.idinversion AND glo.idnomenclador = 21)

 LEFT JOIN mod_planifinversiones.dat_medioambplan plan ON(glo.idmedioambglobal = plan.idmedioambglobal)
 INNER JOIN mod_datosmaestros.dat_monedaentidad monent ON(monent.idmonedaentidad = plan.idmonedaentidad)
 INNER JOIN mod_datosmaestros.nom_moneda mon ON(mon.idmoneda = monent.idmoneda AND mon.codigoiso='USD')

 LEFT JOIN mod_planifinversiones.dat_medioambplan plan1 ON(glo.idmedioambglobal = plan1.idmedioambglobal)
 INNER JOIN mod_datosmaestros.dat_monedaentidad monent1 ON(monent1.idmonedaentidad = plan1.idmonedaentidad)
 INNER JOIN mod_datosmaestros.nom_moneda mon1 ON(mon1.idmoneda = monent1.idmoneda AND mon1.codigoiso='CUP')

 WHERE i.eliminada = 0 and i.idestadoinversion=1 and i.idestructuracomun in({$params['entidadesaux']}) and plan.idejercicio = {$params['idejercicio']} and plan1.idejercicio = {$params['idejercicio']}
 {$params['cadenaWHERE']}";

        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarTodosSectoresPorOrganismo($params) {
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT
     glo.iddatosnomenclador,
     dnom.denominacion,
     COALESCE(sum(plan.valor),0) as valorusd,
     COALESCE(sum(plan1.valor),0) as valormp

 FROM mod_planifinversiones.dat_inversion i
 INNER JOIN mod_planifinversiones.dat_medioambglobal glo ON(i.idinversion = glo.idinversion)
 INNER JOIN mod_planifinversiones.dat_sector sect ON(sect.iddatosnomenclador = glo.iddatosnomenclador)
 LEFT JOIN mod_planifinversiones.dat_medioambplan plan ON(glo.idmedioambglobal = plan.idmedioambglobal)
 INNER JOIN mod_datosmaestros.dat_monedaentidad monent ON(monent.idmonedaentidad = plan.idmonedaentidad)
 INNER JOIN mod_datosmaestros.nom_moneda mon ON(mon.idmoneda = monent.idmoneda AND mon.codigoiso='USD')
 LEFT JOIN mod_planifinversiones.dat_medioambplan plan1 ON(glo.idmedioambglobal = plan1.idmedioambglobal)
 INNER JOIN mod_datosmaestros.dat_monedaentidad monent1 ON(monent1.idmonedaentidad = plan1.idmonedaentidad)
 INNER JOIN mod_datosmaestros.nom_moneda mon1 ON(mon1.idmoneda = monent1.idmoneda AND mon1.codigoiso='CUP')
 INNER JOIN mod_planificacion.nom_datosnomenclador dnom ON(dnom.iddatosnomenclador = glo.iddatosnomenclador)
 INNER JOIN mod_planifinversiones.nom_nomenclador nom ON(nom.idnomenclador = glo.idnomenclador)

 WHERE i.eliminada = 0 and i.idestadoinversion=1 and i.idestructuracomun in({$params['entidadesaux']}) and i.idejercicio = {$params['idejercicio']} {$params['cadenaWHERE']}
 GROUP BY
    glo.iddatosnomenclador,dnom.denominacion";

        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarCuencasBahiasAcciones($params) {
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT
     COALESCE(sum(plan1.valor),0) as valormp,
     COALESCE(sum(plan.valor),0) as valorusd,
     dnom.denominacion,nom.nombrecampo,glo.idnomenclador,glopadre.iddatosnomenclador
 FROM mod_planifinversiones.dat_inversion i
 INNER JOIN mod_planifinversiones.dat_medioambglobal glo ON(i.idinversion = glo.idinversion and glo.idnomenclador!=21)
 INNER JOIN mod_planifinversiones.dat_medioambglobal glopadre ON(glo.idpadre = glopadre.idmedioambglobal)
 INNER JOIN mod_planificacion.nom_datosnomenclador dnom ON(dnom.iddatosnomenclador = glo.iddatosnomenclador)
 INNER JOIN mod_planificacion.nom_datosnomenclador dnom1 ON(dnom1.iddatosnomenclador = glopadre.iddatosnomenclador)
 INNER JOIN mod_planifinversiones.nom_nomenclador nom ON(nom.idnomenclador = glo.idnomenclador)
 LEFT JOIN mod_planifinversiones.dat_medioambplan plan ON(glo.idmedioambglobal = plan.idmedioambglobal)
 INNER JOIN mod_datosmaestros.dat_monedaentidad monent ON(monent.idmonedaentidad = plan.idmonedaentidad)
 INNER JOIN mod_datosmaestros.nom_moneda mon ON(mon.idmoneda = monent.idmoneda AND mon.codigoiso='USD')

 LEFT JOIN mod_planifinversiones.dat_medioambplan plan1 ON(glo.idmedioambglobal = plan1.idmedioambglobal)
 INNER JOIN mod_datosmaestros.dat_monedaentidad monent1 ON(monent1.idmonedaentidad = plan1.idmonedaentidad)
 INNER JOIN mod_datosmaestros.nom_moneda mon1 ON(mon1.idmoneda = monent1.idmoneda AND mon1.codigoiso='CUP')

 WHERE i.eliminada = 0 and i.idestadoinversion=1 and i.idestructuracomun in({$params['entidadesaux']}) and plan.idejercicio = {$params['idejercicio']} and plan1.idejercicio = {$params['idejercicio']}
 {$params['cadenaWHERE']}
 GROUP BY nom.idnomenclador, dnom.denominacion, nom.nombrecampo, glo.idnomenclador,glopadre.iddatosnomenclador";
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function totalPlanProvinciaOrgSector($params, $totalizarOrganismo, $totalizarSector, $totalizarEntidad) {

        if ($totalizarOrganismo == 0) {
            $selectSumProvincia = " ";
            $groupByProvincia = " ";
        } else {
            $selectSumProvincia = "select
                                      sum(p.valormp) as valormp,
                                      sum(p.valorusd) as valorusd,
                                      p.idprovincia,
                                      p.provincia
                                    from
                                    ( ";
            $groupByProvincia = " )p group by p.idprovincia,p.provincia ";
        }

        if ($totalizarSector == 0) {
            $selectSumProvinciaOrgSect = " ";
            $groupByProvinciaOrgSect = " ";
        } else {
            $selectSumProvinciaOrgSect = "select
                                      sum(p.valormp) as valormp,
                                      sum(p.valorusd) as valorusd,
                                      p.idsector,
                                      p.denomsector
                                    from
                                    (  ";
            $groupByProvinciaOrgSect = " )p group by p.idsector,
                                      p.denomsector ";
        }

        if ($totalizarEntidad == 0) {
            $selectSumProvinciaOrgSectEnt = " ";
            $groupByProvinciaOrgSectEnt = " ";
        } else {
            $selectSumProvinciaOrgSectEnt = "select
                                      sum(p.valormp) as valormp,
                                      sum(p.valorusd) as valorusd,
                                      p.estructura,
                                      p.codigoestructura,
                                      p.denomestructura
                                    from
                                    (   ";
            $groupByProvinciaOrgSectEnt = " )p group by p.estructura,
                                      p.codigoestructura,p.denomestructura ";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = $selectSumProvincia . $selectSumProvinciaOrgSect . $selectSumProvinciaOrgSectEnt . "select
                       sum(r.valormp) as valormp,
                       sum(r.valorusd)as valorusd,
                       r.idsector,
                       r.denomsector,
                       r.idprovincia,
                       r.provincia,
                       r.organismopadre,
                       r.denominacionpadre,
                       r.estructura,
                       r.codigoestructura,
                       r.denomestructura,
                       r.inversion
                      from

                      ( SELECT
                         case when mon.codigoiso='CUP' then plan.valor else 0 end as valormp,
                         case when mon.codigoiso='USD' then plan.valor else 0 end as valorusd,
                         ds.idsector,
                         i.codigo ||' '|| i.denominacion as inversion,
                         i.idprovincia,
                         --estpadre.denominacion,
                         --fepadre.idfila as idestpadre,
                         pro.denominacion as provincia,
                         dn.denominacion as denomsector,
                         case when (select fepadre1.idpadre from mod_estructuracomp.nom_filaestruc fepadre1 where fepadre1.idfila = fepadre.idfila)= fepadre.idfila
                              then est.denominacion
                              else estpadre.denominacion end as denominacionpadre,
                         case when (select fepadre1.idpadre from mod_estructuracomp.nom_filaestruc fepadre1 where fepadre1.idfila = fepadre.idfila)= fepadre.idfila
                              then est.idestructura
                              else estpadre.idestructura end as organismopadre,
                         est.idestructura as estructura,
                         est.codigo as codigoestructura,
                         est.denominacion as denomestructura

                        FROM mod_planifinversiones.dat_inversion i
                        inner join mod_datosmaestros.nom_dpt pro ON(i.idprovincia = pro.iddpt)
                        INNER JOIN mod_planifinversiones.dat_medioambglobal glo ON(i.idinversion = glo.idinversion AND glo.idnomenclador = 21)
                        inner join mod_planificacion.nom_datosnomenclador dn ON (glo.iddatosnomenclador = dn.iddatosnomenclador)
                        inner join mod_planifinversiones.dat_sector ds ON (dn.iddatosnomenclador = ds.iddatosnomenclador)
                        inner join mod_estructuracomp.nom_filaestruc fe ON(i.idestructuracomun = fe.idfila)
                        inner join mod_estructuracomp.nom_filaestruc fepadre ON(fe.idpadre = fepadre.idfila)
                        inner join mod_estructuracomp.dat_estructura estpadre ON(fepadre.idfila = estpadre.idestructura)
                        inner join mod_estructuracomp.dat_estructura est ON(fe.idfila = est.idestructura)

                        LEFT JOIN mod_planifinversiones.dat_medioambplan plan ON(glo.idmedioambglobal = plan.idmedioambglobal)
                        INNER JOIN mod_datosmaestros.dat_monedaentidad monent ON(monent.idmonedaentidad = plan.idmonedaentidad)
                        INNER JOIN mod_datosmaestros.nom_moneda mon ON(mon.idmoneda = monent.idmoneda )

                        WHERE i.eliminada = 0 and i.idestadoinversion=1 and 
                        i.idestructuracomun in({$params['todas_entidades']})
                        and plan.idejercicio = {$params['idejercicio']}
                        {$params['provincia']}
                        {$params['cadenaWHERE']}

                    )r
                    group by r.idsector,r.denominacionpadre,r.idprovincia,r.provincia, r.organismopadre,r.denomsector,r.estructura,
                       r.codigoestructura, r.denomestructura,
                       r.inversion" . $groupByProvincia . $groupByProvinciaOrgSect . $groupByProvinciaOrgSectEnt;

        /* if($totalizarEntidad == 0 and $totalizarOrganismo=0 and $totalizarSector=0){
          print_r($sql_query);die;
          } */
        //print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }


    public function getMedioAmbByInversion($idinversion) {

        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT glo.idmedioambglobal
                      from  mod_planifinversiones.dat_medioambglobal glo
                      WHERE glo.idinversion = $idinversion";

        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }



}
