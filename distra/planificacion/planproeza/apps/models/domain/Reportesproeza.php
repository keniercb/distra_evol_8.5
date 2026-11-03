<?php

class Reportesproeza {

    public function listarReportePlanControlxMes($params) {
   
        $data = self::generarColumnasDinamicasPorPeriodo($params);       
        $SelectVentanaPlan = $data->SelectVentanaPlan;
        $SelectVentanaControlEjecucion = $data->SelectVentanaControlEjecucion;
        $SelectVentanaControl = $data->SelectVentanaControl;
        $SelectP = $data->SelectP;       
        $SelectC = $data->SelectC;
        $GroupByP = $data->GroupByP;
        $cumplimiento = "";
        if ($params['idcumplimiento']==1) {
              $cumplimiento = " HAVING sum(c.cantreal) > p.plan";
        }else if ($params['idcumplimiento']==2) {
              $cumplimiento = " HAVING sum(c.cantreal) < p.plan";
        }
        $conn = Doctrine_Manager::connection();
        $query = " WITH plan AS (SELECT DISTINCT
                     dem.idejercicio,
                     dem.iddemanda,
                     dem.extraplan,
                     dem.idprograma,
                     dem.iddestino,
                     eos.identidad as identidadproveedor,
                     dem.identidadcliente,
                     ind.codigo,
                     ind.denominacion,
                     ind.idumedida,                    
                     $SelectVentanaPlan
                     sum(COALESCE(demt.cantidaddesglosada, 0.000) +  COALESCE(demt.ajusteplan, 0.000)) as plan,
                     sum(COALESCE(demt.importeajustado, 0.000)) as importeplan,
                     sum(COALESCE(demt.importeajustadodivisa, 0.000)) as importeplancuc
              FROM mod_planproeza.dat_demanda dem
                   INNER JOIN mod_datosmaestros.nom_indicador ind 
                   ON (dem.idindicador = ind.idindicador AND ind.estado = 1)
                   INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                   ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                   LEFT JOIN mod_planproeza.dat_demandatiempo demt 
                   ON (dem.iddemanda = demt.iddemanda )
                   INNER JOIN mod_planproeza.dat_entidadorganosatisface eos 
                   ON (eos.identidadorganosatisface = dem.identidadorganosatisface AND eos.identidad IN ({$params['entidadesUIM']}))
              WHERE dem.idaprobacionplan = 4 AND
                    dem.idejercicio = {$params['idejercicio']} AND 
                    dem.identidadcliente IN ({$params['clientes']}) AND 
                    dem.iddestino IN ({$params['iddestinos']}) AND 
                    dem.idprograma IN ({$params['idprogramas']})
              GROUP BY ind.codigo,
                       ind.denominacion,
                       ind.idumedida,                       
                       dem.identidadcliente,
                       dem.idprograma,
                       dem.iddestino,
                       dem.iddemanda,
                       eos.identidad), 
                       control AS (WITH ejecucion AS (SELECT demt.iddemandatiempo,
                                                             dem.iddemanda,
                                                             ind.codigo,
                                                             demt.preciodesglosado,
                                                             demt.preciodesglosadodivisa,
                                                             $SelectVentanaControlEjecucion
                                                             sum(COALESCE(ce.cantidadproducida, 0.000)) as cantreal,
                                                             demt.preciodesglosado * sum(COALESCE(ce.cantidadproducida, 0.000)) as importereal,
                                                             demt.preciodesglosadodivisa * sum(COALESCE(ce.cantidadproducida, 0.000)) as importerealcuc
                                                        FROM mod_planproeza.dat_demanda dem
                                                        INNER JOIN mod_datosmaestros.nom_indicador ind 
                                                        ON (dem.idindicador = ind.idindicador AND ind.estado = 1)
                                                        INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                                                        ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND   indp.idaprobacion = 4)
                                                        LEFT JOIN mod_planproeza.dat_demandatiempo demt 
                                                        ON (dem.iddemanda = demt.iddemanda )
                                                        INNER JOIN mod_planproeza.dat_entidadorganosatisface eos 
                                                        ON (eos.identidadorganosatisface = dem.identidadorganosatisface AND eos.identidad IN ({$params['entidadesUIM']}))
                                                        LEFT JOIN mod_planproeza.dat_controlejecucion ce 
                                                        ON (ce.iddemandatiempo = demt.iddemandatiempo)
                                                        LEFT JOIN mod_planificacion.nom_ejercicioplanificacion e 
                                                        ON (dem.idejercicio = e.idejercicio AND dem.idejercicio = {$params['idejercicio']} AND e.ejercicio = EXTRACT(YEAR FROM ce.fecha)::VARCHAR)
                                                        WHERE dem.idaprobacionplan = 4 AND dem.identidadcliente IN ({$params['clientes']}) AND 
                                                              dem.iddestino IN ({$params['iddestinos']}) AND dem.idprograma IN ({$params['idprogramas']})
                                                                      GROUP BY ind.codigo,
                                                                               ce.fecha,
                                                                               demt.iddemandatiempo,
                                                                               dem.iddemanda,
                                                                               indp.precio,
                                                                               indp.preciodivisa,
                                                                               demt.preciodesglosado,
                                                                               demt.preciodesglosadodivisa) 
                                                                               SELECT  e.iddemanda,
                                                                                       e.codigo,
                                                                                       $SelectVentanaControl
                                                                                       sum(e.cantreal) as cantreal,
                                                                                       sum(e.importereal) as importereal,
                                                                                       sum(e.importerealcuc) as importerealcuc
                                                                                       FROM ejecucion e
                                                                                       GROUP BY                                                                                                            
                                                                                       e.codigo,
                                                                                       e.iddemanda,
                                                                                       e.preciodesglosado,
                                                                                       e.preciodesglosadodivisa) 
                                                     SELECT DISTINCT 
                                                     p.iddemanda,
                                                     p.idprograma,
                                                     p.iddestino,
                                                     p.identidadcliente,
                                                     p.identidadproveedor,
                                                     p.codigo,
                                                     p.denominacion as denominacion,
                                                     p.idumedida,
                                                     CASE WHEN   p.extraplan = 1
                                                     THEN 0
                                                     ELSE  p.plan END as plan,
                                                     $SelectP
                                                     $SelectC
                                                     sum( c.cantreal) as cantreal,
                                                     CASE WHEN   p.extraplan = 1
                                                     THEN 0
                                                     ELSE
                                                     p.importeplan END as importeplanMN,
                                                      CASE WHEN   p.extraplan = 1
                                                     THEN 0
                                                     ELSE
                                                     p.importeplancuc END as importeplanCUC,
                                                      CASE WHEN   p.extraplan = 1
                                                     THEN 0
                                                     ELSE
                                                     p.importeplan + p.importeplancuc  END as importeplanTotal,
                                                     sum(c.importereal) as importerealMN,
                                                     sum(c.importerealcuc) as importerealCUC,                                                     
                                                     sum(c.importereal) + sum(c.importerealcuc) as importerealTotal,
       COALESCE(sum(p.importeplan) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmn,                                                  
       COALESCE(sum(p.importeplancuc) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalcuc,                                                 
       COALESCE(sum(p.importeplan + p.importeplancuc) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmonedatotal                                             
                                              FROM plan p
                                                   INNER JOIN control c 
                                                   ON (p.codigo = c.codigo AND p.iddemanda = c.iddemanda)
                                              GROUP BY p.identidadproveedor,
                                                       p.codigo,
                                                       p.denominacion,
                                                       p.idumedida,                                              
                                                       p.identidadcliente,
                                                       p.idprograma,
                                                       p.iddestino,
                                                       p.extraplan,
                                                       p.iddemanda,
                                                       $GroupByP
                                                       p.plan,
                                                       p.importeplan,
                                                       p.importeplancuc,
                                                       p.idejercicio
                                              $cumplimiento
                                              ORDER BY p.codigo";
        //print_r($query);die;
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function generarColumnasDinamicasPorPeriodo($params) {
        $SelectVentanaPlan = "";
        $SelectVentanaControlEjecucion = "";
        $SelectVentanaControl = "";
        $SelectP = "";
        $SelectC = "";
        switch ($params['uriperiodo']) {
            //mes
            case 'Mes':
                $meses = NomDatosnomenclador::getDatosNomPorUriTipoNom('MES', false, "-");
                $meses_posiciones = array();
                foreach ($meses as $key => $value) {
                    $meses_posiciones[$value[uridatosnomenclador]] = $key + 1;
                }
                unset($meses);
                foreach ($params['columnas'] as $columna) {
                    
                    $SelectVentanaPlan = $SelectVentanaPlan .
                            " COALESCE(sum(demt.{$columna->uridatosnomenclador}), 0.000) as {$columna->uridatosnomenclador},
                               sum(demt.preciodesglosado * COALESCE(demt.{$columna->uridatosnomenclador}, 0.000)) as importePlanMN{$columna->uridatosnomenclador}, 
                               sum(demt.preciodesglosadodivisa * COALESCE(demt.{$columna->uridatosnomenclador}, 0.000)) as importePlanCUC{$columna->uridatosnomenclador}, ";
                    $SelectVentanaControlEjecucion = $SelectVentanaControlEjecucion .
                            " CASE
                                WHEN EXTRACT(MONTH FROM ce.fecha) = {$meses_posiciones[$columna->uridatosnomenclador]} 
                                    THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                ELSE 0
                              END as {$columna->uridatosnomenclador}, ";
                    $SelectVentanaControl = $SelectVentanaControl .
                            "COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as {$columna->uridatosnomenclador},                                
                            e.preciodesglosado * COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as importe{$columna->uridatosnomenclador}MN,
                            e.preciodesglosadodivisa * COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as importe{$columna->uridatosnomenclador}CUC, ";
                    $SelectP = $SelectP .
                            " p.{$columna->uridatosnomenclador} as {$columna->uridatosnomenclador}Plan,
                              p.importePlanMN{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}MN,
                              COALESCE(sum(p.importePlanMN{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmn{$columna->uridatosnomenclador},
                              p.importePlanCUC{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}CUC,
                              COALESCE(sum(p.importePlanCUC{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalcuc{$columna->uridatosnomenclador},
                              p.importePlanMN{$columna->uridatosnomenclador} + p.importePlanCUC{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}Total, 
                              COALESCE(sum(p.importePlanMN{$columna->uridatosnomenclador} + p.importePlanCUC{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmt{$columna->uridatosnomenclador},";
                    $GroupByP = $GroupByP .
                            " p.{$columna->uridatosnomenclador},
                              p.importePlanMN{$columna->uridatosnomenclador},
                              p.importePlanCUC{$columna->uridatosnomenclador}, ";
                    $SelectC = $SelectC .
                            "sum(c.{$columna->uridatosnomenclador}) as {$columna->uridatosnomenclador},
                            sum(importe{$columna->uridatosnomenclador}MN) as importe{$columna->uridatosnomenclador}MN,
                            sum(importe{$columna->uridatosnomenclador}CUC) as importe{$columna->uridatosnomenclador}CUC ,
                            sum(importe{$columna->uridatosnomenclador}MN) +  sum(importe{$columna->uridatosnomenclador}CUC) as importe{$columna->uridatosnomenclador}Total, ";
                }
                $data->SelectVentanaPlan = $SelectVentanaPlan;
                $data->SelectVentanaControlEjecucion = $SelectVentanaControlEjecucion;
                $data->SelectVentanaControl = $SelectVentanaControl;
                $data->SelectP = $SelectP;
                $data->GroupByP = $GroupByP;
                $data->SelectC = $SelectC;
                return $data;
            //trimestre
            case 'Trimestre':
                $trimestres = NomDatosnomenclador::getDatosNomPorUriTipoNom('TRIMESTRE', false, "-");
                $trimestres_posiciones = array();
                foreach ($trimestres as $key => $value) {
                    $trimestres_posiciones[$value[uridatosnomenclador]] = $key + 1;
                }
                unset($trimestres);
                foreach ($params['columnas'] as $columna) {
                    switch ($columna->uridatosnomenclador) {
                        case 'ITRIMESTRE':
                            $SelectVentanaPlan = $SelectVentanaPlan .
                                    "   COALESCE(sum(demt.enero), 0.000) + COALESCE(sum(demt.febrero), 0.000) + COALESCE(sum(demt.marzo), 0.000) as {$columna->uridatosnomenclador},
                                         sum(demt.preciodesglosado * (COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000))) as importePlanMN{$columna->uridatosnomenclador}, 
                                         sum(demt.preciodesglosadodivisa * (COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000))) as importePlanCUC{$columna->uridatosnomenclador}, ";
                            break;
                        case 'IITRIMESTRE':
                            $SelectVentanaPlan = $SelectVentanaPlan .
                                    "   COALESCE(sum(demt.abril), 0.000) + COALESCE(sum(demt.mayo), 0.000) + COALESCE(sum(demt.junio), 0.000) as {$columna->uridatosnomenclador},
                                        sum(demt.preciodesglosado * (COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000))) as importePlanMN{$columna->uridatosnomenclador},
                                        sum(demt.preciodesglosadodivisa * (COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000))) as importePlanCUC{$columna->uridatosnomenclador}, ";
                            break;
                        case 'IIITRIMESTRE':
                            $SelectVentanaPlan = $SelectVentanaPlan .
                                    "   COALESCE(sum(demt.julio), 0.000) + COALESCE(sum(demt.agosto), 0.000) + COALESCE(sum(demt.septiembre), 0.000) as {$columna->uridatosnomenclador},
                                        sum(demt.preciodesglosado * (COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000))) as importePlanMN{$columna->uridatosnomenclador}, 
                                        sum(demt.preciodesglosadodivisa * (COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000))) as importePlanCUC{$columna->uridatosnomenclador}, ";
                            break;
                        case 'IVTRIMESTRE':
                            $SelectVentanaPlan = $SelectVentanaPlan .
                                    "   COALESCE(sum(demt.octubre), 0.000) + COALESCE(sum(demt.noviembre), 0.000) + COALESCE(sum(demt.diciembre), 0.000) as {$columna->uridatosnomenclador},
                                        sum(demt.preciodesglosado * (COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000))) as importePlanMN{$columna->uridatosnomenclador}, 
                                        sum(demt.preciodesglosadodivisa * (COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000))) as importePlanCUC{$columna->uridatosnomenclador}, ";
                            break;
                    }
                    $SelectVentanaControlEjecucion = $SelectVentanaControlEjecucion .
                            " CASE
                                WHEN EXTRACT(quarter FROM ce.fecha) = {$trimestres_posiciones[$columna->uridatosnomenclador]} 
                                    THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                ELSE 0
                              END as {$columna->uridatosnomenclador}, ";
                    $SelectVentanaControl = $SelectVentanaControl .
                            " COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as {$columna->uridatosnomenclador},
                                       e.preciodesglosado * COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as importe{$columna->uridatosnomenclador}MN,
                                       e.preciodesglosadodivisa * COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as importe{$columna->uridatosnomenclador}CUC, ";
                    $SelectP = $SelectP .
                            " p.{$columna->uridatosnomenclador} as {$columna->uridatosnomenclador}Plan,
                              p.importePlanMN{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}MN,
                              COALESCE(sum(p.importePlanMN{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmn{$columna->uridatosnomenclador},
                              p.importePlanCUC{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}CUC,
                              COALESCE(sum(p.importePlanCUC{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalcuc{$columna->uridatosnomenclador},
                              p.importePlanMN{$columna->uridatosnomenclador} + p.importePlanCUC{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}Total, 
                              COALESCE(sum(p.importePlanMN{$columna->uridatosnomenclador} + p.importePlanCUC{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmt{$columna->uridatosnomenclador},";
                    $GroupByP = $GroupByP .
                            " p.{$columna->uridatosnomenclador},
                              p.importePlanMN{$columna->uridatosnomenclador},
                              p.importePlanCUC{$columna->uridatosnomenclador}, ";
                    $SelectC = $SelectC .
                            " sum(c.{$columna->uridatosnomenclador}) as {$columna->uridatosnomenclador},
                              sum(importe{$columna->uridatosnomenclador}MN) as importe{$columna->uridatosnomenclador}MN,
                              sum(importe{$columna->uridatosnomenclador}CUC) as importe{$columna->uridatosnomenclador}CUC ,
                              sum(importe{$columna->uridatosnomenclador}MN) +  sum(importe{$columna->uridatosnomenclador}CUC) as importe{$columna->uridatosnomenclador}Total, ";
                }
                $data->SelectVentanaPlan = $SelectVentanaPlan;
                $data->SelectVentanaControlEjecucion = $SelectVentanaControlEjecucion;
                $data->SelectVentanaControl = $SelectVentanaControl;
                $data->SelectP = $SelectP;
                $data->GroupByP = $GroupByP;
                $data->SelectC = $SelectC;
                return $data;

            //Semestre
            case 'Semestre':
                $trimestres = NomDatosnomenclador::getDatosNomPorUriTipoNom('TRIMESTRE', false, "-");
                $trimestres_posiciones = array();
                foreach ($trimestres as $key => $value) {
                    $trimestres_posiciones[$value[uridatosnomenclador]] = $key + 1;
                }
                unset($trimestres);
                foreach ($params['columnas'] as $columna) {
                    switch ($columna->uridatosnomenclador) {
                        case 'ISEMESTRE':
                            $SelectVentanaPlan = $SelectVentanaPlan .
                                    "   COALESCE(sum(demt.enero), 0.000) + COALESCE(sum(demt.febrero), 0.000) + COALESCE(sum(demt.marzo), 0.000) + COALESCE(sum(demt.abril), 0.000) + COALESCE(sum(demt.mayo), 0.000) + COALESCE(sum(demt.junio), 0.000) as {$columna->uridatosnomenclador},
                                        sum(demt.preciodesglosado * (COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000))) as importePlanMN{$columna->uridatosnomenclador},
                                        sum(demt.preciodesglosadodivisa * (COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000))) as importePlanCUC{$columna->uridatosnomenclador}, ";

                            $SelectVentanaControlEjecucion = $SelectVentanaControlEjecucion .
                                    "  CASE
                                            WHEN (EXTRACT(quarter FROM ce.fecha) = 1 OR EXTRACT(quarter FROM ce.fecha) = 2) 
                                            THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                            ELSE 0
                                          END as $columna->uridatosnomenclador, ";
                            break;
                        case 'IISEMESTRE':
                            $SelectVentanaPlan = $SelectVentanaPlan .
                                    "   COALESCE(sum(demt.julio), 0.000) + COALESCE(sum(demt.agosto), 0.000) + COALESCE(sum(demt.septiembre), 0.000) + COALESCE(sum(demt.octubre), 0.000) + COALESCE(sum(demt.noviembre), 0.000) + COALESCE(sum(demt.diciembre), 0.000) as {$columna->uridatosnomenclador},
                                        sum(demt.preciodesglosado * (COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000))) as importePlanMN{$columna->uridatosnomenclador}, 
                                        sum(demt.preciodesglosadodivisa * (COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000))) as importePlanCUC{$columna->uridatosnomenclador}, ";
                            $SelectVentanaControlEjecucion = $SelectVentanaControlEjecucion .
                                    "  CASE
                                            WHEN (EXTRACT(quarter  FROM ce.fecha) = 3 OR EXTRACT(quarter FROM ce.fecha) = 4) 
                                            THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                            ELSE 0
                                          END as $columna->uridatosnomenclador, ";
                            break;
                    }

                    $SelectVentanaControl = $SelectVentanaControl .
                            " COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as {$columna->uridatosnomenclador},
                                       e.preciodesglosado * COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as importe{$columna->uridatosnomenclador}MN,
                                       e.preciodesglosadodivisa * COALESCE(sum(e.{$columna->uridatosnomenclador}), 0.000) as importe{$columna->uridatosnomenclador}CUC, ";
                  $SelectP = $SelectP .
                            " p.{$columna->uridatosnomenclador} as {$columna->uridatosnomenclador}Plan,
                              p.importePlanMN{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}MN,
                              COALESCE(sum(p.importePlanMN{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmn{$columna->uridatosnomenclador},
                              p.importePlanCUC{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}CUC,
                              COALESCE(sum(p.importePlanCUC{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalcuc{$columna->uridatosnomenclador},
                              p.importePlanMN{$columna->uridatosnomenclador} + p.importePlanCUC{$columna->uridatosnomenclador} as importePlan{$columna->uridatosnomenclador}Total, 
                              COALESCE(sum(p.importePlanMN{$columna->uridatosnomenclador} + p.importePlanCUC{$columna->uridatosnomenclador}) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmt{$columna->uridatosnomenclador},";
                    $GroupByP = $GroupByP .
                            " p.{$columna->uridatosnomenclador},
                              p.importePlanMN{$columna->uridatosnomenclador},
                              p.importePlanCUC{$columna->uridatosnomenclador}, ";
                    $SelectC = $SelectC .
                            " sum(c.{$columna->uridatosnomenclador}) as {$columna->uridatosnomenclador},
                              sum(importe{$columna->uridatosnomenclador}MN) as importe{$columna->uridatosnomenclador}MN,
                              sum(importe{$columna->uridatosnomenclador}CUC) as importe{$columna->uridatosnomenclador}CUC ,
                              sum(importe{$columna->uridatosnomenclador}MN) +  sum(importe{$columna->uridatosnomenclador}CUC) as importe{$columna->uridatosnomenclador}Total, ";
                }
                $data->SelectVentanaPlan = $SelectVentanaPlan;
                $data->SelectVentanaControlEjecucion = $SelectVentanaControlEjecucion;
                $data->SelectVentanaControl = $SelectVentanaControl;
                $data->SelectP = $SelectP;
                $data->GroupByP = $GroupByP;
                $data->SelectC = $SelectC;
                return $data;
        }
    }

}

//fin clase


