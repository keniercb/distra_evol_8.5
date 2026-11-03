<?php

class Modelosestadisticos {

//    private $nivel;
//
//    public function __construct() {
//        $this->nivel = NomActividad::getNivel();
//    }
//implementacion de los modelos estadisticos
    //1
    public function interEmiyEconomia($params) {
        $filtros = Modelosestadisticos::construirFiltros($params);

        $sqlQuery = "
SELECT dem.identidadcliente,      
        {$filtros['importeMn']} as importemn,
        {$filtros['importeMLC']} as importedivisa       
FROM mod_planproeza.dat_demanda dem
     INNER JOIN mod_datosmaestros.nom_indicador ind ON (dem.idindicador =
       ind.idindicador AND ind.estado = 1)
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
       indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
     LEFT JOIN mod_planproeza.dat_demandatiempo demt ON (dem.iddemanda =
       demt.iddemanda)
WHERE dem.idejercicio = {$params['idejercicio']} AND
      dem.idaprobacion = 4 AND
      dem.extraplan = 0  
      {$filtros['programa']}
      {$filtros['destino']}
      {$filtros['cliente']}
GROUP BY dem.identidadcliente
ORDER BY {$filtros['importeMn']}  {$params['orden']} 
/*OFFSET {$params['start']} 
LIMIT {$params['limit']} */";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //2.1
    public function planInterEmiMayorCantdemandas($params) {
        //Año, Proveedores, Programas, Destinos.
        $filtros = Modelosestadisticos::construirFiltros($params);
        $sqlQuery = "  
SELECT DISTINCT eos.identidad as identidadproveedor,            
       count(dem.iddemanda) cantdemandas
FROM mod_planproeza.dat_demanda dem
     INNER JOIN mod_datosmaestros.nom_indicador ind ON (dem.idindicador =
       ind.idindicador AND ind.estado = 1)
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (
       ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND
       indp.idaprobacion = 4)
     INNER JOIN mod_planproeza.dat_entidadorganosatisface eos ON (
       eos.identidadorganosatisface = dem.identidadorganosatisface)         
WHERE dem.idejercicio = {$params['idejercicio']} AND
      dem.idaprobacion = 4 AND
      dem.extraplan = 0           
      {$filtros['programa']}
      {$filtros['destino']}
      {$filtros['proveedor']}
GROUP BY eos.identidad
ORDER BY count(dem.iddemanda) {$params['orden']} 
/*OFFSET {$params['start']} 
LIMIT {$params['limit']}*/";
//print_r($sqlQuery);        die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //2.2
    public function planInterEmiMayorPorcientoImportes($params) {
        //Año, Proveedores, Programas, Destinos.
        $filtros = Modelosestadisticos::construirFiltros($params);
        $sqlQuery = "  
SELECT x.identidadproveedor,
         ((sum(x.importemn) + sum(x.importedivisa)) * 100) / sum(x.importemn +
           x.importedivisa) OVER(PARTITION BY x.idejercicio) as
           porcientoimportetotal
  FROM (
         SELECT eos.identidad as identidadproveedor,
                dem.idejercicio,
                 {$filtros['importeMn']} as importemn,
                 {$filtros['importeMLC']} as importedivisa                
         FROM mod_planproeza.dat_demanda dem
              INNER JOIN mod_datosmaestros.nom_indicador ind ON (dem.idindicador
                = ind.idindicador AND ind.estado = 1)
              INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (
                ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND
                indp.idaprobacion = 4)
              INNER JOIN mod_planproeza.dat_entidadorganosatisface eos ON (
                eos.identidadorganosatisface = dem.identidadorganosatisface)
              LEFT JOIN mod_planproeza.dat_demandatiempo demt ON (dem.iddemanda
                = demt.iddemanda)
         WHERE dem.idejercicio = {$params['idejercicio']} AND
               dem.idaprobacion = 4 AND
               dem.extraplan = 0 
              {$filtros['programa']}
              {$filtros['destino']}
              {$filtros['proveedor']}
         GROUP BY dem.idejercicio,
                  eos.identidad
       ) x
  GROUP BY x.identidadproveedor,
           x.importemn,
           x.idejercicio,
           x.importedivisa
  ORDER BY ((sum(x.importemn) + sum(x.importedivisa)) * 100) / sum(x.importemn
    + x.importedivisa) OVER(PARTITION BY x.idejercicio) {$params['orden']} 
/*OFFSET {$params['start']} 
LIMIT {$params['limit']}*/";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //3.1
    public function planEconomiaImportes($params) {
        //Año,Periodo, Programas, Destinos.
        $filtros = Modelosestadisticos::construirFiltros($params);
        $sqlQuery = "  
WITH comportamientos AS (
    SELECT ednon.identidad
    FROM mod_planificacion.dat_entidaddatosnomenclador ednon
         INNER JOIN mod_planificacion.nom_datosnomenclador datnom ON
           ednon.iddatosnomenclador = datnom.iddatosnomenclador
    WHERE datnom.uridatosnomenclador <> 'organoconsumidor'
)
SELECT dem.identidadcliente,
       {$filtros['importeMn']} as importemn,
       {$filtros['importeMLC']} as importedivisa   
FROM mod_planproeza.dat_demanda dem
     INNER JOIN mod_datosmaestros.nom_indicador ind ON 
        dem.idindicador = ind.idindicador AND 
        ind.estado = 1
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON 
        ind.idindicador = indp.idindicador AND 
        indp.nivelplanif = 1 AND 
        indp.idaprobacion = 4
     INNER JOIN mod_planificacion.dat_entidaddatosnomenclador ednon ON 
       dem.identidadcliente = ednon.identidad AND 
       ednon.identidad NOT IN (
                                SELECT identidad
                                FROM comportamientos
                                )
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON 
       ednon.iddatosnomenclador = dn.iddatosnomenclador AND
       dn.uridatosnomenclador = 'organoconsumidor'     
     LEFT JOIN mod_planproeza.dat_demandatiempo demt ON 
       dem.iddemanda = demt.iddemanda
WHERE dem.idejercicio = {$params['idejercicio']} AND
      dem.idaprobacion = 4 AND
      dem.extraplan = 0 
      {$filtros['programa']}
      {$filtros['destino']}  
          --ver si se puede dejar el filtro de cliente
      {$filtros['cliente']}
GROUP BY dem.identidadcliente
ORDER BY {$filtros['importeMn']}{$params['orden']} 
/*OFFSET {$params['start']} 
LIMIT {$params['limit']}*/";
       // print_r($sqlQuery);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //3.2
    public function planEconomiaPorcientoImportes($params) {
        //Año,Periodo, Programas, Destinos.
        $filtros = Modelosestadisticos::construirFiltros($params);
        $sqlQuery = "
  SELECT x.identidadcliente,         
         ((sum(x.importemn) + sum(x.importedivisa)) * 100) / sum(
           x.importemn + x.importedivisa) OVER(PARTITION BY x.idejercicio)
           as porcientoimportetotal
  FROM (WITH comportamientos AS (
                                 SELECT ednon.identidad
                                 FROM mod_planificacion.dat_entidaddatosnomenclador ednon
                                     INNER JOIN mod_planificacion.nom_datosnomenclador datnom ON
                                       ednon.iddatosnomenclador = datnom.iddatosnomenclador
                                 WHERE datnom.uridatosnomenclador <> 'organoconsumidor'
       )
  SELECT dem.identidadcliente, 
         dem.idejercicio,
         {$filtros['importeMn']} as importemn,
         {$filtros['importeMLC']} as importedivisa  
  FROM mod_planproeza.dat_demanda dem
       INNER JOIN mod_datosmaestros.nom_indicador ind ON 
         dem.idindicador = ind.idindicador AND 
         ind.estado = 1
       INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON 
         ind.idindicador = indp.idindicador AND 
         indp.nivelplanif = 1 AND 
         indp.idaprobacion = 4
       INNER JOIN mod_planificacion.dat_entidaddatosnomenclador ednon ON 
         dem.identidadcliente = ednon.identidad AND 
         ednon.identidad NOT IN (
                                SELECT identidad
                                FROM comportamientos
                                )
       INNER JOIN mod_planificacion.nom_datosnomenclador dn ON 
         ednon.iddatosnomenclador = dn.iddatosnomenclador AND
         dn.uridatosnomenclador = 'organoconsumidor'      
       LEFT JOIN mod_planproeza.dat_demandatiempo demt ON 
         dem.iddemanda = demt.iddemanda
  WHERE dem.idejercicio = {$params['idejercicio']} AND
      dem.idaprobacion = 4 AND
      dem.extraplan = 0 
      {$filtros['programa']}
      {$filtros['destino']}  
          --ver si se puede dejar el filtro de cliente
      {$filtros['cliente']}
  GROUP BY  dem.identidadcliente, 
            dem.idejercicio
) x
  GROUP BY x.identidadcliente,
           x.importemn,
           x.idejercicio,
           x.importedivisa
  ORDER BY ((sum(x.importemn) + sum(x.importedivisa)) * 100) / sum(
    x.importemn + x.importedivisa) OVER(PARTITION BY x.idejercicio) {$params['orden']} 
/*OFFSET {$params['start']} 
LIMIT {$params['limit']}*/";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //4.1
    public function cantidadProduccionesCaptadas($params) {
        //Año
        $sqlQuery = "
WITH demandas AS (SELECT CASE
                           WHEN dem.idaprobacion = 4 THEN count(dem.iddemanda)
                           else 0
                         END as aprobadorector,
                         CASE
                           WHEN dem.idaprobacion <> 4 THEN count(dem.iddemanda)
                           else 0
                         END as otrasaprobaciones
                  FROM mod_planproeza.dat_demanda dem
                       INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                         dem.idindicador = ind.idindicador AND ind.estado = 1)
                       INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON
                         (ind.idindicador = indp.idindicador AND
                         indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                  WHERE dem.idejercicio = {$params['idejercicio']} AND
                        dem.extraplan = 0
                  GROUP BY dem.idaprobacion)
SELECT sum(d.aprobadorector) as aprobadorector,
       sum(d.otrasaprobaciones) as otrasaprobaciones
FROM demandas d ";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //7.1 Plan Vs Real Semestre
    //7.2 Plan Vs Real Trimestre
    //7.3 Plan Vs Real Mes
    public function planVsReal($params) {
        //Año,Cliente, Proveedor
        $filtros = Modelosestadisticos::construirFiltros($params);
        $sqlQuery = "
WITH plan AS (
SELECT dem.iddemanda,
    --semestre
    sum(demt.preciodesglosado *(COALESCE(demt.enero,
      0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(
      demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) +
      COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio,
      0.000))) + sum(demt.preciodesglosadodivisa *(
      COALESCE(demt.enero, 0.000) + COALESCE(
      demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000)
      + COALESCE(demt.abril, 0.000) + COALESCE(
      demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)))
      as importe1semestre,
    sum(demt.preciodesglosado *(COALESCE(demt.julio,
      0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(
      demt.septiembre, 0.000) + COALESCE(demt.octubre,
      0.000) + COALESCE(demt.noviembre, 0.000) +
      COALESCE(demt.diciembre, 0.000))) + sum(
      demt.preciodesglosadodivisa *(COALESCE(demt.julio,
      0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(
      demt.septiembre, 0.000) + COALESCE(demt.octubre,
      0.000) + COALESCE(demt.noviembre, 0.000) +
      COALESCE(demt.diciembre, 0.000))) as
      importe2semestre,
    --trimestre
    sum(demt.preciodesglosado *(COALESCE(demt.enero, 0.000) + COALESCE(
     demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000))) +
   sum(demt.preciodesglosadodivisa *(COALESCE(demt.enero, 0.000) + COALESCE(
     demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000))) as importePlan1TRIMESTRE,       
   sum(demt.preciodesglosado *(COALESCE(demt.abril, 0.000) + COALESCE(
     demt.mayo, 0.000) + COALESCE(demt.junio, 0.000))) +
   sum(demt.preciodesglosadodivisa *(COALESCE(demt.abril, 0.000) + COALESCE(
     demt.mayo, 0.000) + COALESCE(demt.junio, 0.000))) as importePlan2TRIMESTRE,       
   sum(demt.preciodesglosado *(COALESCE(demt.julio, 0.000) + COALESCE(
     demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000))) +
   sum(demt.preciodesglosadodivisa *(COALESCE(demt.julio, 0.000) + COALESCE(
     demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000))) as  importePlan3TRIMESTRE,       
   sum(demt.preciodesglosado *(COALESCE(demt.octubre, 0.000) + COALESCE(
     demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000))) +
   sum(demt.preciodesglosadodivisa *(COALESCE(demt.octubre, 0.000) +
     COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000))) as importePlan4TRIMESTRE,
   --Mes
    sum(demt.preciodesglosado * COALESCE(demt.Enero, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Enero, 0.000)) as importePlanEnero,
    sum(demt.preciodesglosado * COALESCE(demt.Febrero, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Febrero, 0.000)) as importePlanFebrero,
    sum(demt.preciodesglosado * COALESCE(demt.Marzo, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Marzo, 0.000)) as importePlanMarzo,
    sum(demt.preciodesglosado * COALESCE(demt.Abril, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Abril, 0.000)) as importePlanAbril,
    sum(demt.preciodesglosado * COALESCE(demt.Mayo, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Mayo, 0.000)) as importePlanMayo,
    sum(demt.preciodesglosado * COALESCE(demt.Junio, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Junio, 0.000)) as importePlanJunio,
    sum(demt.preciodesglosado * COALESCE(demt.Julio, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Julio, 0.000)) as importePlanJulio,
    sum(demt.preciodesglosado * COALESCE(demt.Agosto, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Agosto, 0.000)) as importePlanAgosto,
    sum(demt.preciodesglosado * COALESCE(demt.Septiembre, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Septiembre, 0.000)) as importePlanSeptiembre,
    sum(demt.preciodesglosado * COALESCE(demt.Octubre, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Octubre, 0.000)) as importePlanOctubre,
    sum(demt.preciodesglosado * COALESCE(demt.Noviembre, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Noviembre, 0.000)) as importePlanNoviembre,
    sum(demt.preciodesglosado * COALESCE(demt.Diciembre, 0.000)) +
    sum(demt.preciodesglosadodivisa * COALESCE(demt.Diciembre, 0.000)) as importePlanDiciembre
                     FROM mod_planproeza.dat_demanda dem
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                            dem.idindicador = ind.idindicador AND ind.estado = 1
                            )
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                            ON (ind.idindicador = indp.idindicador AND
                            indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                          LEFT JOIN mod_planproeza.dat_demandatiempo demt ON (
                            dem.iddemanda = demt.iddemanda)
                          INNER JOIN mod_planproeza.dat_entidadorganosatisface
                            eos ON (eos.identidadorganosatisface =
                            dem.identidadorganosatisface 
                          {$filtros['proveedor']})
                     WHERE dem.extraplan = 0 AND
                           dem.idejercicio = {$params['idejercicio']} AND
                           dem.idaprobacionplan = 4 
                          {$filtros['cliente']}
                             
                     GROUP BY dem.iddemanda),
control AS (
WITH ejecucion AS (
   SELECT dem.iddemanda,
          demt.preciodesglosado,
          demt.preciodesglosadodivisa,
   CASE WHEN (EXTRACT(quarter  FROM ce.fecha) = 1 OR 
              EXTRACT(quarter  FROM ce.fecha) = 2) THEN 
                sum(COALESCE(ce.cantidadproducida, 0.000))
            ELSE 0
   END as ISEMESTRE,
   CASE WHEN (EXTRACT(quarter FROM ce.fecha) = 3 OR 
              EXTRACT(quarter FROM ce.fecha) = 4) THEN 
                sum(COALESCE(ce.cantidadproducida, 0.000))
          ELSE 0
   END as IISEMESTRE,
 --trimestre 
  CASE
         WHEN EXTRACT(quarter FROM ce.fecha) = 1 THEN 
            sum(COALESCE(ce.cantidadproducida, 0.000))
         ELSE 0
  END as ITRIMESTRE,
  CASE
       WHEN EXTRACT(quarter FROM ce.fecha) = 2 THEN 
        sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
  END as IITRIMESTRE,
  CASE
       WHEN EXTRACT(quarter FROM ce.fecha) = 3 THEN 
        sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as IIITRIMESTRE,
  CASE
       WHEN EXTRACT(quarter FROM ce.fecha) = 4 THEN 
        sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as IVTRIMESTRE,
--Mes
 CASE WHEN EXTRACT(MONTH FROM ce.fecha) = 1 THEN 
            sum(COALESCE(ce.cantidadproducida, 0.000))
         ELSE 0
 END as Enero,
 CASE WHEN EXTRACT(MONTH FROM ce.fecha) = 2 THEN 
    sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Febrero,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 3 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Marzo,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 4 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Abril,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 5 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Mayo,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 6 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Junio,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 7 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Julio,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 8 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Agosto,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 9 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Septiembre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 10 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Octubre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 11 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Noviembre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fecha) = 12 THEN sum(COALESCE(ce.cantidadproducida, 0.000))
       ELSE 0
     END as Diciembre
   FROM mod_planproeza.dat_demanda dem
        INNER JOIN mod_datosmaestros.nom_indicador ind ON (dem.idindicador =
          ind.idindicador AND ind.estado = 1)
        INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (
          ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND
          indp.idaprobacion = 4)
        LEFT JOIN mod_planproeza.dat_demandatiempo demt ON (dem.iddemanda =
          demt.iddemanda)
        INNER JOIN mod_planproeza.dat_entidadorganosatisface eos ON (
          eos.identidadorganosatisface = dem.identidadorganosatisface 
          {$filtros['proveedor']})
        LEFT JOIN mod_planproeza.dat_controlejecucion ce ON (ce.iddemandatiempo
          = demt.iddemandatiempo)
        LEFT JOIN mod_planificacion.nom_ejercicioplanificacion e ON (
          dem.idejercicio = e.idejercicio AND dem.idejercicio = {$params['idejercicio']} AND
          e.ejercicio = EXTRACT(YEAR
   FROM ce.fecha)::VARCHAR)
   WHERE dem.idaprobacionplan = 4 
   {$filtros['cliente']}
   GROUP BY ce.fecha,
            dem.iddemanda,
            demt.preciodesglosado,
            demt.preciodesglosadodivisa)
   SELECT e.iddemanda,
   --semestre
          COALESCE(sum(e.preciodesglosado * e.ISEMESTRE), 0.000) + COALESCE(sum(
            e.preciodesglosadodivisa * e.ISEMESTRE), 0.000) as importe1semestre,
          COALESCE(sum(e.preciodesglosado * e.IISEMESTRE), 0.000) + COALESCE(sum
            (e.preciodesglosadodivisa * e.IISEMESTRE), 0.000) as importe2semestre,
   --trimestre
COALESCE(sum(e.preciodesglosado * e.ITRIMESTRE), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.ITRIMESTRE), 0.000) as importe1TRIMESTRE,
COALESCE(sum(e.preciodesglosado * e.IITRIMESTRE), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.IITRIMESTRE), 0.000) as importe2TRIMESTRE,
COALESCE(sum(e.preciodesglosado * e.IIITRIMESTRE), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.IIITRIMESTRE), 0.000) as importe3TRIMESTRE,
COALESCE(sum(e.preciodesglosado * e.IVTRIMESTRE), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.IVTRIMESTRE), 0.000) as importe4TRIMESTRE,
--mes
COALESCE(sum(e.preciodesglosado * e.Enero), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Enero), 0.000) as importeEnero,
COALESCE(sum(e.preciodesglosado * e.Febrero), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Febrero), 0.000) as importeFebrero,
COALESCE(sum(e.preciodesglosado * e.Marzo), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Marzo), 0.000) as importeMarzo,
COALESCE(sum(e.preciodesglosado * e.Abril), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Abril), 0.000) as importeAbril,
COALESCE(sum(e.preciodesglosado * e.Mayo), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Mayo), 0.000) as importeMayo  ,
COALESCE(sum(e.preciodesglosado * e.Junio), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Junio), 0.000) as importeJunio,
COALESCE(sum(e.preciodesglosado * e.Julio), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Julio), 0.000) as importeJulio,
COALESCE(sum(e.preciodesglosado * e.Agosto), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Agosto), 0.000) as importeAgosto,
COALESCE(sum(e.preciodesglosado * e.Septiembre), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Septiembre), 0.000) as importeSeptiembre,
COALESCE(sum(e.preciodesglosado * e.Octubre), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Octubre), 0.000) as importeOctubre,
COALESCE(sum(e.preciodesglosado * e.Noviembre), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Noviembre), 0.000) as importeNoviembre,
COALESCE(sum(e.preciodesglosado * e.Diciembre), 0.000) +
COALESCE(sum(e.preciodesglosadodivisa * e.Diciembre), 0.000) as importeDiciembre
FROM ejecucion e
GROUP BY e.iddemanda)

SELECT 
       --semestre
       sum(p.importe1semestre) AS plan1semestre,
       sum(c.importe1semestre) AS real1semestre,
       sum(p.importe2semestre) AS plan2semestre,
       sum(c.importe2semestre) AS real2semestre,
       --trimestre
       sum(p.importePlan1TRIMESTRE) as plan1trimestre, 
       sum(c.importe1TRIMESTRE) as real1trimestre,       
       sum(p.importePlan2TRIMESTRE) as plan2trimestre,
       sum(c.importe2TRIMESTRE) as real2trimestre,        
       sum(p.importePlan3TRIMESTRE) as plan3trimestre,
       sum(c.importe3TRIMESTRE) as real3trimestre, 
       sum(p.importePlan4TRIMESTRE) as plan4trimestre,
       sum(c.importe4TRIMESTRE) as real4trimestre, 
       --mes
       sum(p.importePlanEnero) as importePlanEnero,
        sum(p.importePlanFebrero) as importePlanFebrero,
        sum(p.importePlanMarzo) as importePlanMarzo,
        sum(p.importePlanAbril) as importePlanAbril,
        sum(p.importePlanMayo) as importePlanMayo,
        sum(p.importePlanJunio) as importePlanJunio,
        sum(p.importePlanJulio) as importePlanJulio,
        sum(p.importePlanAgosto) as importePlanAgosto,
        sum(p.importePlanSeptiembre) as importePlanSeptiembre,
        sum(p.importePlanOctubre) as importePlanOctubre,
        sum(p.importePlanNoviembre) as importePlanNoviembre,
        sum(p.importePlanDiciembre) as importePlanDiciembre,
        sum(c.importeEnero) as realEnero,
        sum(c.importeFebrero) as realFebrero,
        sum(c.importeMarzo)  as realMarzo,
        sum(c.importeAbril)  as realAbril,
        sum(c.importeMayo)  as realMayo  ,
        sum(c.importeJunio)  as realJunio,
        sum(c.importeJulio)  as realJulio,
        sum(c.importeAgosto)  as realAgosto,
        sum(c.importeSeptiembre)  as realSeptiembre,
        sum(c.importeOctubre)  as realOctubre,
        sum(c.importeNoviembre)  as realNoviembre,
        sum(c.importeDiciembre)  as realDiciembre
FROM plan p
LEFT JOIN control c ON 
    p.iddemanda = c.iddemanda AND 
    p.iddemanda = c.iddemanda ";
//        print_r($sqlQuery);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //4.2
    public function importeProduccionesCaptadas($params) {
        //Año
        $sqlQuery = "
WITH demandas AS (SELECT CASE
                           WHEN dem.idaprobacion = 4 THEN sum(dem.cantidadconfirmada * indp.precio) + sum(dem.cantidadconfirmada * indp.preciodivisa)
                           else 0
                         END as importeaprobadorector,
                         CASE
                           WHEN dem.idaprobacion <> 4 THEN sum(dem.cantidadconfirmada * indp.precio) + sum(dem.cantidadconfirmada * indp.preciodivisa)
                           else 0
                         END as importeotrasaprobaciones
                  FROM mod_planproeza.dat_demanda dem
                       INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                         dem.idindicador = ind.idindicador AND ind.estado = 1)
                       INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON
                         (ind.idindicador = indp.idindicador AND
                         indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                  WHERE dem.idejercicio = {$params['idejercicio']} AND
                        dem.extraplan = 0
                  GROUP BY dem.idaprobacion)
SELECT sum(d.importeaprobadorector) as importeaprobadorector,
       sum(d.importeotrasaprobaciones) as importeotrasaprobaciones
FROM demandas d";
        //print_r($sqlQuery);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //5
    public function produccionesAtrasadasSobrecumplimientos($params) {
        //atraso
        if ($params['atraso'] == 1) {
            $comparacion = "<";
        } else {
            //Sobrecumplimiento
            $comparacion = ">";
        }
        //Año, Programas, Destinos.
        $filtros = Modelosestadisticos::construirFiltros($params);
        $sqlQuery = "
SELECT x.identidadproveedor,      
       sum(x.cantatrasos) as cantcumplimiento
FROM (WITH plan AS (
                     SELECT eos.identidad as identidadproveedor,
                            dem.iddemanda,
                            CASE
                              WHEN dem.extraplan = 1 THEN 0
                              ELSE sum(COALESCE(demt.cantidaddesglosada, 0.000)
                                + COALESCE(demt.ajusteplan, 0.000))
                            END as plan
                     FROM mod_planproeza.dat_demanda dem
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                            dem.idindicador = ind.idindicador AND ind.estado = 1
                            )
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                            ON (ind.idindicador = indp.idindicador AND
                            indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                          LEFT JOIN mod_planproeza.dat_demandatiempo demt ON (
                            dem.iddemanda = demt.iddemanda)
                          INNER JOIN mod_planproeza.dat_entidadorganosatisface
                            eos ON (eos.identidadorganosatisface =
                            dem.identidadorganosatisface )
                     WHERE dem.idejercicio = {$params['idejercicio']} AND
                           dem.idaprobacionplan = 4 
                           {$filtros['programa']}
                           {$filtros['destino']}
                     GROUP BY dem.iddemanda,
                              eos.identidad
     ), control AS (
                     SELECT eos.identidad as identidadproveedor,
                            dem.iddemanda,
                            sum(COALESCE(ce.cantidadproducida, 0.000)) as creal
                     FROM mod_planproeza.dat_demanda dem
                          INNER JOIN mod_datosmaestros.nom_indicador ind ON (
                            dem.idindicador = ind.idindicador AND ind.estado = 1
                            )
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                            ON (ind.idindicador = indp.idindicador AND
                            indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                          LEFT JOIN mod_planproeza.dat_demandatiempo demt ON (
                            dem.iddemanda = demt.iddemanda)
                          INNER JOIN mod_planproeza.dat_entidadorganosatisface
                            eos ON (eos.identidadorganosatisface =
                            dem.identidadorganosatisface )
                          LEFT JOIN mod_planproeza.dat_controlejecucion ce ON (
                            ce.iddemandatiempo = demt.iddemandatiempo)
                     WHERE dem.idejercicio = {$params['idejercicio']} AND
                           dem.idaprobacionplan = 4   
                           {$filtros['programa']}
                           {$filtros['destino']}
                     GROUP BY dem.iddemanda,
                              eos.identidad
     )
SELECT p.identidadproveedor, 
       count(p.iddemanda) as cantatrasos 
FROM plan p
    LEFT JOIN control c ON 
        p.identidadproveedor = c.identidadproveedor AND
        p.iddemanda = c.iddemanda
GROUP BY p.iddemanda, 
         p.identidadproveedor
HAVING sum(COALESCE(c.creal, 0.000)) $comparacion sum(COALESCE(p.plan, 0.000))
) x 
GROUP BY x.identidadproveedor 
ORDER BY cantcumplimiento  {$params['orden']}";
//        print_r($sqlQuery);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //8.1
    //9.1
    public function programasODestinosPorciento($params) {
        //Año,  Programas, Destinos.
        $filtros = Modelosestadisticos::construirFiltros($params);
        //si se escoge programa {$params['clasificacion']} = idprograma
        //si se escoge destino {$params['clasificacion']} = iddestino
        $sqlQuery = " 
  WITH cantclasificacion AS (
  SELECT dem.{$params['clasificacion']},
         count(dem.iddemanda) as cant
  FROM mod_planproeza.dat_demanda dem
       INNER JOIN mod_datosmaestros.nom_indicador ind ON (dem.idindicador =
         ind.idindicador AND ind.estado = 1)
       INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador
         = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
  WHERE dem.idejercicio = {$params['idejercicio']} AND
        dem.idaprobacion = 4 AND
        dem.extraplan = 0  
        {$filtros['programa']}
        {$filtros['destino']}
  GROUP BY dem.{$params['clasificacion']},
           dem.idejercicio),
canttotal AS (
SELECT DISTINCT dem.{$params['clasificacion']},
       count(dem.iddemanda) OVER(PARTITION BY dem.idejercicio) as canttotal
FROM mod_planproeza.dat_demanda dem
     INNER JOIN mod_datosmaestros.nom_indicador ind ON (dem.idindicador =
       ind.idindicador AND ind.estado = 1)
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
       indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
WHERE dem.idejercicio = {$params['idejercicio']} AND
      dem.idaprobacion = 4 AND
      dem.extraplan = 0  
        {$filtros['programa']}
        {$filtros['destino']}
GROUP BY dem.{$params['clasificacion']},
         dem.iddemanda)
SELECT c.{$params['clasificacion']},
       round((round(c.cant, 2) * 100) / round(t.canttotal, 2),2) as porciento
FROM cantclasificacion c
     LEFT JOIN canttotal t ON c.{$params['clasificacion']} = t.{$params['clasificacion']}";
      
     $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //8.2
    //9.2
    public function programasODestinosImporte($params) {
        //Año,  Programas, Destinos.
        $filtros = Modelosestadisticos::construirFiltros($params);
        //si se escoge programa {$params['clasificacion']} = idprograma
        //si se escoge destino {$params['clasificacion']} = iddestino
        $sqlQuery = " 
    SELECT dem.{$params['clasificacion']},
       COALESCE(sum(demt.importe), 0.000) as importe,
       COALESCE(sum(demt.importedivisa), 0.000) as importetotaldivisa
    FROM mod_planproeza.dat_demanda dem
     INNER JOIN mod_datosmaestros.nom_indicador ind ON 
        dem.idindicador = ind.idindicador AND 
        ind.estado = 1
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON 
        ind.idindicador = indp.idindicador AND 
        indp.nivelplanif = 1 AND 
        indp.idaprobacion = 4
     LEFT JOIN mod_planproeza.dat_demandatiempo demt ON 
        dem.iddemanda = demt.iddemanda
    WHERE dem.idejercicio = {$params['idejercicio']} AND
        dem.idaprobacion = 4 AND
        dem.extraplan = 0 
       {$filtros['programa']}
       {$filtros['destino']}
    GROUP BY dem.{$params['clasificacion']}
    ORDER BY COALESCE(sum(demt.importe), 0.000) {$params['orden']}";
//        print_r($sqlQuery);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function construirFiltros($params) {

        //Año, Mes, Trimestre, Semestre, Cliente, Programas, Destinos.
        $filtros = array();
        // $filtrodestino = "";
        if ($params['destinos']) {
            $filtros['destino'] = "AND dem.iddestino IN ({$params['destinos']})";
        }
//        $filtroprograma = "";
        if ($params['programas']) {
            $filtros['programa'] = "AND dem.idprograma IN ({$params['programas']})";
        }
//        $filtrocliente = "";
        if ($params['clientes']) {
            $filtros['cliente'] = "AND dem.identidadcliente IN ({$params['clientes']})";
        }
        if ($params['proveedores']) {         
            $filtros['proveedor'] = "AND  eos.identidad IN ({$params['proveedores']})";
        }
//el param de las columnas debe estar conformado asi, lo pueden coger de los reportes
//Array ( [0] => stdClass Object ( [uridatosnomenclador] => Enero [denominacion] => Enero ) [1] => stdClass Object ( [uridatosnomenclador] => Febrero [denominacion] => Febrero ) ) 

        $importeMn = "";
        $importeMLC = "";
        if ($params['columnas']) {
            //si se filtra periodo construir el select segun el periodo
            switch ($params['uriperiodo']) {

                case 'Mes':
                    foreach ($params['columnas'] as $columna) {
                        if ($importeMn == "") {
                            $importeMn = "COALESCE(sum(demt.{$columna->uridatosnomenclador} * demt.preciodesglosado), 0.000)";
                        } else {
                            $importeMn = $importeMn . "+ COALESCE(sum(demt.{$columna->uridatosnomenclador} * demt.preciodesglosado), 0.000)";
                        }
                        if ($importeMLC == "") {
                            $importeMLC = "COALESCE(sum(demt.{$columna->uridatosnomenclador} * demt.preciodesglosadodivisa), 0.000)";
                        } else {
                            $importeMLC = $importeMLC . "+ COALESCE(sum(demt.{$columna->uridatosnomenclador} * demt.preciodesglosadodivisa), 0.000)";
                        }
                    }

                case 'Trimestre':
                    foreach ($params['columnas'] as $columna) {
                        switch ($columna->uridatosnomenclador) {
                            case 'ITRIMESTRE':
                                if ($importeMn == "") {
                                    $importeMn = " COALESCE(sum(((COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000)) * demt.preciodesglosado)), 0.000)";
                                } else {
                                    $importeMn = $importeMn . "+  COALESCE(sum(((COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000)) * demt.preciodesglosado)), 0.000)";
                                }
                                if ($importeMLC == "") {
                                    $importeMLC = "COALESCE(sum(((COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000)) * demt.preciodesglosadodivisa)), 0.000)";
                                } else {
                                    $importeMLC = $importeMLC . "+ COALESCE(sum(((COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000)) * demt.preciodesglosadodivisa)), 0.000)";
                                }
                                break;
                            case 'IITRIMESTRE':
                                if ($importeMn == "") {
                                    $importeMn = " COALESCE(sum(((COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)) * demt.preciodesglosado)), 0.000)";
                                } else {
                                    $importeMn = $importeMn . "+  COALESCE(sum(((COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)) * demt.preciodesglosado)), 0.000)";
                                }
                                if ($importeMLC == "") {
                                    $importeMLC = "COALESCE(sum(((COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)) * demt.preciodesglosadodivisa)), 0.000)";
                                } else {
                                    $importeMLC = $importeMLC . "+ COALESCE(sum(((COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)) * demt.preciodesglosadodivisa)), 0.000)";
                                }
                                break;
                            case 'IIITRIMESTRE':
                                if ($importeMn == "") {
                                    $importeMn = " COALESCE(sum(((COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000)) * demt.preciodesglosado)), 0.000)";
                                } else {
                                    $importeMn = $importeMn . "+  COALESCE(sum(((COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000)) * demt.preciodesglosado)), 0.000)";
                                }
                                if ($importeMLC == "") {
                                    $importeMLC = "COALESCE(sum(((COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000)) * demt.preciodesglosadodivisa)), 0.000)";
                                } else {
                                    $importeMLC = $importeMLC . "+ COALESCE(sum(((COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000)) * demt.preciodesglosadodivisa)), 0.000)";
                                }
                                break;
                            case 'IVTRIMESTRE':
                                if ($importeMn == "") {
                                    $importeMn = " COALESCE(sum(((COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) * demt.preciodesglosado)), 0.000)";
                                } else {
                                    $importeMn = $importeMn . "+  COALESCE(sum(((COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) * demt.preciodesglosado)), 0.000)";
                                }
                                if ($importeMLC == "") {
                                    $importeMLC = "COALESCE(sum(((COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) * demt.preciodesglosadodivisa)), 0.000)";
                                } else {
                                    $importeMLC = $importeMLC . "+ COALESCE(sum(((COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) * demt.preciodesglosadodivisa)), 0.000)";
                                }
                                break;
                        }
                    }

                case 'Semestre':
                    foreach ($params['columnas'] as $columna) {
                        switch ($columna->uridatosnomenclador) {
                            case 'ISEMESTRE':
                                if ($importeMn == "") {
                                    $importeMn = " COALESCE(sum((((COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero,
                                                    0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) +
                                                    COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)) *
                                                    demt.preciodesglosado))), 0.000)";
                                } else {
                                    $importeMn = $importeMn . "+  COALESCE(sum((((COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero,
                                                    0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) +
                                                    COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)) *
                                                    demt.preciodesglosado))), 0.000)";
                                }
                                if ($importeMLC == "") {
                                    $importeMLC = "COALESCE(sum((((COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero,
                                                    0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) +
                                                    COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)) *
                                                    demt.preciodesglosadodivisa))), 0.000)";
                                } else {
                                    $importeMLC = $importeMLC . "+ COALESCE(sum((((COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero,
                                                    0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) +
                                                    COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000)) *
                                                    demt.preciodesglosadodivisa))), 0.000)";
                                }

                                break;
                            case 'IISEMESTRE':
                                if ($importeMn == "") {
                                    $importeMn = "  COALESCE(sum((((COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000
                                                    ) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) +
                                                    COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) *
                                                    demt.preciodesglosado))), 0.000)";
                                } else {
                                    $importeMn = $importeMn . "+   COALESCE(sum((((COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000
                                                    ) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) +
                                                    COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) *
                                                    demt.preciodesglosado))), 0.000)";
                                }
                                if ($importeMLC == "") {
                                    $importeMLC = " COALESCE(sum((((COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000
                                                    ) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) +
                                                    COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) *
                                                    demt.preciodesglosadodivisa))), 0.000)";
                                } else {
                                    $importeMLC = $importeMLC . "+ COALESCE(sum((((COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000
                                                    ) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) +
                                                    COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) *
                                                    demt.preciodesglosadodivisa))), 0.000)";
                                }
                                break;
                        }
                    }
            }
        } else {
            //si no se filtra periodo
            $importeMn = "COALESCE(sum(demt.importe), 0.000)";
            $importeMLC = "COALESCE(sum(demt.importedivisa), 0.000)";
        }

        $filtros['importeMn'] = $importeMn;
        $filtros['importeMLC'] = $importeMLC;
        return $filtros;
    }

// Fin implementacion de los modelos estadisticos
}
