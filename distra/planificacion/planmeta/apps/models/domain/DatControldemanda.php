<?php

class DatControldemanda extends BaseDatControldemanda {

    public function setUp() {
        parent::setUp();
        $this->hasOne('NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasOne('NomAprobacion', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion'));
    }

    public function listarControlDemanda($params) {
        $conn = Doctrine_Manager::connection();
        $groupCondMes = "";
        if ($params['idmes']) {
            $condMes = "  AND cdf.iddatosnomenclador={$params['idmes']}";
            $selectContEjec = "
                    cdf.idcontroldemandafecha,
                    COALESCE(cdf.idaprobacionejecucion,1) as idaprobacionejecucion,
                    round(COALESCE(cdf.cantidadcontratada,0),3) as  cantidadcontratada,
                    CASE
                        WHEN cdf.idcontroldemanda is not NULL
                            THEN round(COALESCE(cdf.preciocontratacion, 0), 3)
                        ELSE round(COALESCE(cd.precio, 0), 3)
                    END as preciocontratacion,
                    round(COALESCE(cdf.cantidadcontratada,0) * COALESCE(cdf.preciocontratacion,0),3) as  importecontratacion,
                    round(COALESCE(cdf.cantidadejecutada,0),3) as  cantidadejecutada,
                    CASE
                        WHEN cdf.idcontroldemanda is not NULL THEN round(COALESCE(cdf.precioejecucion, 0), 3)
                        ELSE round(COALESCE(cd.precio, 0), 3)
                    END as precioejecucion,
                    round(COALESCE(cdf.cantidadejecutada,0) * COALESCE(cdf.precioejecucion,0),3) as  importeejecucion,";
            $selectuserfecha = "cdf.idusuario,
                                cdf.fecha";
            $selectContEjecAfuera = "
                    r.idcontroldemandafecha,
                    r.idaprobacionejecucion,
                    r.cantidadcontratada,
                    r.preciocontratacion,
                    r.importecontratacion,
                    r.cantidadejecutada,
                    r.precioejecucion,
                    r.importeejecucion,
                    sum(r.importecontratacion) OVER() as importecontrataciontotal,
                    sum(r.importeejecucion) OVER() as importeejecuciontotal,";
        } else {
            $ejercicio = explode(' ', $params['ejercicio']);
            $params['ejercicio'] = $ejercicio[0];
            if ($params['fecha'] == null) {
                $fecha = date("d/m");
                $fecha .= "/" . $ejercicio[0];
            } else {
                $fecha = $params['fecha'];
            }
            $selectuserfecha = "cd.idusuario,
                                cd.fecha";
            $iddatosnom = self::obtenerFecha($params, $fecha);
            $condMes = "  and cdf.iddatosnomenclador IN($iddatosnom)";
            $selectContEjec = "
                    round(COALESCE(SUM(cdf.cantidadcontratada),0),3) as  cantidadcontratada,
                    round(COALESCE((SUM(cdf.cantidadcontratada * cdf.preciocontratacion)),0),3) as importecontratacion,
                    round(COALESCE(SUM(cdf.cantidadejecutada),0),3) as  cantidadejecutada,
                    round(COALESCE((SUM(cdf.cantidadejecutada * cdf.precioejecucion)),0),3) as importeejecucion,";
            $selectContEjecAfuera = "
                    r.cantidadcontratada,
                    r.importecontratacion,
                    r.cantidadejecutada,
                    r.importeejecucion,
                    sum(r.importecontratacion) OVER() as importecontrataciontotal,
                    sum(r.importeejecucion) OVER() as importeejecuciontotal,";
            $groupCondMes = "GROUP BY cd.idcontroldemanda,
                                      i.codigo,
                                      i.denominacion,
                                      cd.idunidadmedida,
                                      i.idindicador
                                      {$params['having']}";
        }
        $delimitar = "";
        if ($params['delimitar'])
            $delimitar = "OFFSET {$params['start']}
                        LIMIT {$params['limit']}";

        $sql = "select count(*) OVER() as total,
                    r.idcontroldemanda,
                    r.idindicador,
                    r.codigo,
                    r.denominacion,
                    r.idunidadmedida,
                    r.demanda,
                    r.precio,
                    r.importe,
                    sum(r.importe) OVER() as importetotal,
                    r.adicionado,
                    r.puntualizacion,
                    r.idaprobacion,
                    $selectContEjecAfuera
                    r.viasadquisicion,
                    r.organossatisface,
                    r.idusuario,
                    r.fecha
                    from (
            SELECT
                    cd.idcontroldemanda,
                    cd.idindicador,
                    i.codigo,
                    i.denominacion,
                    cd.idunidadmedida,
                    round(cd.cantidad,3) as demanda,
                    round(cd.precio,3) as precio,
                    round((cd.cantidad * cd.precio),3) as importe,
                    cd.adicionado as adicionado,
                    cd.puntualizacion,
                    cd.idaprobacion,
                    $selectContEjec
                    cd.viasadquisicion,
                    cd.organossatisface,
                    $selectuserfecha
                  FROM
                    mod_planificacion.dat_controldemanda cd
                    INNER JOIN mod_datosmaestros.nom_indicador i
                    ON(cd.idindicador=i.idindicador)
                    LEFT JOIN mod_planificacion.dat_controldemandafecha cdf
                    ON(cd.idcontroldemanda=cdf.idcontroldemanda $condMes)
                    WHERE cd.idejercicio={$params['idejercicio']}
                          AND cd.identidad={$params['identidad']}
                          {$params['addWhere']}
                    $groupCondMes
                    )r
                    {$params['addWhereAfuera']}
                    ORDER BY r.codigo $delimitar";
        //print_r($sql);die;
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        $data->importeAprobado = $data->data[0]['importetotal'];
        $data->importeContratadoTotal = $data->data[0]['importecontrataciontotal'];
        $data->importeEjecutadoTotal = $data->data[0]['importeejecuciontotal'];
        return $data;
    }

    public function listarCentrosBalanceDominio($identidadesHijas) {
        $conn = Doctrine_Manager::connection();
        $sql = "select
                edn.identidaddatosnomenclador,
                fe.idfila as identidad,
                CASE WHEN e.idestructura is not null
                THEN e.denominacion
                ELSE eop.denominacion
                END as denominacion

                FROM mod_estructuracomp.nom_filaestruc fe
                INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                ON(fe.idfila=edn.identidad and edn.iddatosnomenclador=1)
                LEFT JOIN mod_estructuracomp.dat_estructura e
                ON(e.idestructura=fe.idfila)
                LEFT JOIN mod_estructuracomp.dat_estructuraop eop
                ON(eop.idestructuraop=fe.idfila)
                WHERE fe.idfila in($identidadesHijas)
                order by denominacion";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function eliminarControles($idejercicio, $cadenaidentidades) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM
                        mod_planificacion.dat_controldemanda c
                        WHERE  c.idejercicio = $idejercicio
                                AND c.identidad in($cadenaidentidades)";
        $conn->execute($sql);
    }

    public function listarIndicadoresAdd($params) {
        $condiciónCB = "";
        if ($params['configuracion'] == 'true') {
            $condiciónCB = "INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb
        ON(icb.idindicador=i.idindicador and icb.identidaddatosnomenclador={$params['idcb']})";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count(r.*) OVER() as total, r.*
                        FROM (SELECT DISTINCT i.idindicador,
                                              i.codigo,
                                              i.denominacion,
                                              i.idumedida as idunidadmedida,
                                              ROUND(ipl.precio,3) as precio
                            FROM mod_datosmaestros.nom_indicador i
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif ipl
                             ON (i.idindicador = ipl.idindicador AND ipl.nivelplanif = 1 AND ipl.idaprobacion = 4)
                             INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva
                             ON (i.idindicador = iva.idindicador)
                             INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
                             ON (i.idindicador = ios.idindicador)
                              $condiciónCB
                             ) r
                             LEFT JOIN mod_planificacion.dat_controldemanda cd
                             ON (r.idindicador = cd.idindicador AND cd.idejercicio = {$params['idejercicio']} AND cd.identidad = {$params['identidad']})
                             WHERE cd.idindicador is null
                             {$params['addWhere']}
                             ORDER BY r.codigo
                             OFFSET {$params['start']}
                             LIMIT {$params['limit']}";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function obtenerFecha($params, $fecha) {
        $conn = Doctrine_Manager::connection();
        $sqlMeses = "SELECT
                            iddatosnomenclador
                          FROM
                            mod_planificacion.conf_tiempoxnomenclador
                            where idejercicio={$params['idejercicio']} and (fechainicio BETWEEN '1/1/{$params['ejercicio']}' and '$fecha') ;";
        $iddatosnom = $conn->execute($sqlMeses)->fetchAll(PDO::FETCH_COLUMN);
        $iddatosnom = implode(',', $iddatosnom);
        return $iddatosnom;
    }

    public function exportarEjecucionOSDE($params) {
        $joinVia = "";
        $Where = "";
        $WhereVentana = "";
        if ($params['cbVA'] != 0) {
            //filtrado por VA
            $joinVia = "INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion ivia ON i.idindicador = ivia.idindicador ";
            $Where = " AND ivia.idviaadquisicion = {$params['cbVA']}";
            $WhereVentana = " AND iva.idviaadquisicion = {$params['cbVA']}";
        }
        $condCB = "";
        if ($params['idcb'] != null) {
            $condCB = "and icb.identidaddatosnomenclador={$params['idcb']}";
        }

        if ($params['tipo'] == 3) {
            $select = ",r.organos as os";
            $group = ",r.organos";
            $order = ",r.organos";
            $selectAfuera = ",q.os";
            //$groupAfuera = ",r.organos";
            $orderAfuera = ",q.os";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "
        SELECT q.osde,
                q.importeaprobado,
                q.importecontratadototal,
                q.porccont,
                q.importeejecutadototal,
                q.porcejec,
                q.porcejecplan,
                sum(q.importeaprobado) OVER() as importeaprobadototalafuera,
                sum(q.importecontratadototal) OVER() as importecontratadototalafuera,
                sum(q.importeejecutadototal) OVER() as importeejecutadototalafuera
                $selectAfuera
        FROM (
                select round(COALESCE(SUM(r.importeaprobado),0),3) as importeaprobado,
                round(COALESCE(SUM(r.importecontratadototal),0),3) as importecontratadototal,

                       (CASE WHEN COALESCE(SUM(r.importeaprobado), 0) = 0
                THEN round((COALESCE(SUM(r.importecontratadototal), 0) * 100) / 1, 3)
                ELSE round((COALESCE(SUM(r.importecontratadototal), 0) * 100) / COALESCE(SUM(r.importeaprobado), 0), 3) END) AS porccont,

                round(COALESCE(SUM(r.importeejecutadototal),0),3) as importeejecutadototal,

                       (CASE WHEN COALESCE(SUM(r.importecontratadototal), 0) = 0
                THEN round((COALESCE(SUM(r.importeejecutadototal), 0) * 100) / 1, 3)
                ELSE round((COALESCE(SUM(r.importeejecutadototal), 0) * 100) / COALESCE(SUM(r.importecontratadototal), 0), 3) END) AS porcejec,

                       (CASE WHEN COALESCE(SUM(r.importeaprobado), 0) = 0
                THEN round((COALESCE(SUM(r.importeejecutadototal), 0) * 100) / 1, 3)
                ELSE round((COALESCE(SUM(r.importeejecutadototal), 0) * 100) / COALESCE(SUM(r.importeaprobado), 0), 3) END) AS porcejecplan,

                rtrim(split_part(r.organos,'-',1)) as osde
       $select
FROM (
      SELECT round(COALESCE((cd.cantidad * cd.precio),0),3) as importeaprobado,
			 (select round(COALESCE((sum(cdf.cantidadcontratada * cdf.preciocontratacion)),0),3)
              FROM mod_planificacion.dat_controldemandafecha cdf
              where cd.idcontroldemanda=cdf.idcontroldemanda and cdf.iddatosnomenclador IN({$params['iddatosnom']})) as importecontratadototal,

              (select round(COALESCE((sum(cdf.cantidadejecutada * cdf.precioejecucion)),0),3)
              FROM mod_planificacion.dat_controldemandafecha cdf
              where cd.idcontroldemanda=cdf.idcontroldemanda and cdf.iddatosnomenclador IN({$params['iddatosnom']})) as importeejecutadototal,

              (
                        select LIST(DISTINCT os.denominacion)
                        from mod_datosmaestros.dat_indicadorviaadquisicion iva
                             LEFT JOIN
                               mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
                               ivos ON (iva.idindicador = ivos.idindicador AND
                               iva.idviaadquisicion = ivos.idviaadquisicion)
                             LEFT JOIN mod_datosmaestros.nom_organosatisface os ON (
                               ivos.idorganosatisface = os.idorganosatisface AND os.ordender
                               - os.ordenizq = 1)
                        WHERE i.idindicador = iva.idindicador $WhereVentana
               ) as organos

          FROM  mod_planificacion.dat_controldemanda cd
          INNER JOIN mod_datosmaestros.nom_indicador i
          ON(cd.idindicador=i.idindicador)
          INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb
          ON(icb.idindicador=i.idindicador $condCB)
          $joinVia
          WHERE cd.idejercicio={$params['idejercicio']} $Where
          group by cd.idcontroldemanda, i.idindicador) as r
          group by rtrim(split_part(r.organos,'-',1)) $group
          having round(COALESCE(SUM(r.importeaprobado),0),3)>0
          order by rtrim(split_part(r.organos,'-',1)) $order
         ) q
         ORDER BY q.osde $orderAfuera";
//        print_r($sql);        die;
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarImportesTotalesCentrosBalanceEjercicio($params) {
        if ($params['cbVA'] != 0) {
            //filtrado por VA
            $joinVia = "INNER JOIN mod_planificacion.dat_indicadorviaadquisicion ivia ON i.idindicador = ivia.idindicador ";
            $WhereVia = " AND ivia.idviaadquisicion = {$params['cbVA']}";
        }
        $where = "";
        $sel = "";
        if ($params['iddatosnom']) {
            $where = "and cdf.iddatosnomenclador IN({$params['iddatosnom']})";
            $sel = "(CASE WHEN COALESCE(SUM(r.importeaprobado),0) = 0
                    THEN round((COALESCE(SUM(r.importecontratadototal),0) * 100) / 1, 3)
                    ELSE round((COALESCE(SUM(r.importecontratadototal),0) * 100) / COALESCE(SUM(r.importeaprobado),0), 3) END) AS porccont,

                    (CASE WHEN COALESCE(SUM(r.importecontratadototal),0) = 0
                    THEN round((COALESCE(SUM(r.importeejecutadototal),0) * 100) / 1, 3)
                    ELSE round((COALESCE(SUM(r.importeejecutadototal),0) * 100) / COALESCE(SUM(r.importecontratadototal),0), 3) END) AS porcejec,

                    (CASE WHEN COALESCE(SUM(r.importeaprobado),0) = 0
                    THEN round((COALESCE(SUM(r.importeejecutadototal),0) * 100) / 1, 3)
                    ELSE round((COALESCE(SUM(r.importeejecutadototal),0) * 100) / COALESCE(SUM(r.importeaprobado),0), 3) END) AS porcejecplan,";
        }
        /* if ($params['demandaValida']) {
          //si es exportar solo quiero demandas mayores que 0
          $addHaving=" AND round(COALESCE(SUM(r.importeaprobado),0),3)>0";
          } */
        $conn = Doctrine_Manager::connection();
        $sqlImportesTotales = "select  round(COALESCE(SUM(r.importeaprobado),0),3) as importeaprobado,
                                     round(COALESCE(SUM(r.importecontratadototal),0),3) as importecontratadototal,
                                     $sel
                                     round(COALESCE(SUM(r.importeejecutadototal),0),3) as importeejecutadototal
                                        FROM (
                                        SELECT
                                        round(COALESCE((cd.cantidad * cd.precio),0),3) as importeaprobado,

                                        (select round(COALESCE((sum(cdf.cantidadcontratada * cdf.preciocontratacion)),0),3)
                                         FROM mod_planificacion.dat_controldemandafecha cdf
                                          where cd.idcontroldemanda=cdf.idcontroldemanda $where) as importecontratadototal,

                                         (select round(COALESCE((sum(cdf.cantidadejecutada * cdf.precioejecucion)),0),3)
                                         FROM mod_planificacion.dat_controldemandafecha cdf
                                          where cd.idcontroldemanda=cdf.idcontroldemanda $where) as importeejecutadototal
                                     FROM
                                        mod_planificacion.dat_controldemanda cd
                                        INNER JOIN mod_datosmaestros.nom_indicador i
                                        ON(cd.idindicador=i.idindicador)
                                        INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb
                                        ON(icb.idindicador=i.idindicador and icb.identidaddatosnomenclador={$params['idcb']})
                                        $joinVia
                                     WHERE cd.idejercicio={$params['idejercicio']} $WhereVia
                                        group by cd.idcontroldemanda) as r";
        $importes = $conn->execute($sqlImportesTotales)->fetchAll(PDO::FETCH_ASSOC);
        return $importes;
    }

}
