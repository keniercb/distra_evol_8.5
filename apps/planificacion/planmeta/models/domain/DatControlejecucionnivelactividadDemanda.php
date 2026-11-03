<?php

class DatControlejecucionnivelactividadDemanda extends BaseDatControlejecucionnivelactividaddemanda {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatActividadentidad', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
    }

    //Lista los niveles de actividad mayores que cero dada una entidad y un ejercicio
    public function listarNivelesAct($params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having
    ) {
        $nivel = NomActividad::getNivel();
        $conn = Doctrine_Manager::connection();
        $sql = "
  SELECT x.idactividad as idactividad,
    x.codigo,
    x.denominacion,
    SUM(x.nivelactividadfinal) as nivelactividadfinal,
       SUM(x.nivelactvreal) as nivelactvreal,
       COALESCE((SUM(x.nivelactividadfinal) - COALESCE(SUM(x.nivelactvreal),0)),0) as pendiente
                FROM
                (WITH valioso AS (
SELECT
   COALESCE(sum(nivelactividadreal),0) as nivelactvreal,
  idactividadentidad
FROM
  mod_planificacion.dat_controlejecucionnivelactividaddemanda

  GROUP BY idactividadentidad)
SELECT
a.idactividad as idactividad,
a.codigo,
a.denominacion,
(COALESCE(aem.nivelactividadmanual,0)+
COALESCE(aea.nivelactividadautomatico,0) +
COALESCE(aep.nivelactividadproduccion,0) +
COALESCE(ae.ajuste,0) ) as nivelactividadfinal,
       COALESCE (v.nivelactvreal,0) as nivelactvreal

            FROM mod_planificacion.nom_actividad a

            INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                ON (a.idactividad = aec.idactividad AND aec.idespecialidad IN
                ({$strEspecialidades}))
            INNER JOIN mod_planificacion.dat_actividadentidad ae
                ON (ae.idactespcomportamiento = aec.idactespcomportamiento
      AND (ae.idejercicio =  {$params['idejercicio']} or ae.idejercicio is null)
             AND (ae.identidad IN ({$strEntidades}) or ae.identidad is null) )

            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON(aem.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON(aea.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( aep.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN valioso v ON (ae.idactividadentidad=v.idactividadentidad)

            WHERE a.nivel={$nivel} AND a.idaprobacion =4 AND a.estado=1
            " . $WHERE . "
            GROUP BY
                a.idactividad,
                a.codigo,
                a.denominacion,
                aea.nivelactividadautomatico,
                aem.nivelactividadmanual,
                aep.nivelactividadproduccion,
                ae.ajuste,
                v.nivelactvreal
                ORDER BY a.codigo) as x
                GROUP BY
                x.idactividad,
                x.codigo,
                x.denominacion
                Having  SUM(x.nivelactividadfinal)>0
                " . $Having . "
		ORDER BY x.codigo
      $offsetLimit";
        $sqlT = "

 Select count(z.idactividad) from (SELECT
    x.idactividad as idactividad
                FROM
                (WITH valioso AS (
SELECT
   COALESCE(sum(nivelactividadreal),0) as nivelactvreal,
  idactividadentidad
FROM
  mod_planificacion.dat_controlejecucionnivelactividaddemanda

  GROUP BY idactividadentidad)
SELECT
a.idactividad as idactividad,
a.codigo,
a.denominacion,
(COALESCE(aem.nivelactividadmanual,0)+
COALESCE(aea.nivelactividadautomatico,0) +
COALESCE(aep.nivelactividadproduccion,0) +
COALESCE(ae.ajuste,0) ) as nivelactividadfinal,
       COALESCE (v.nivelactvreal,0) as nivelactvreal

            FROM mod_planificacion.nom_actividad a

            INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                ON (a.idactividad = aec.idactividad AND aec.idespecialidad IN
                ({$strEspecialidades}))
            LEFT JOIN mod_planificacion.dat_actividadentidad ae
                ON (ae.idactespcomportamiento = aec.idactespcomportamiento
      AND (ae.idejercicio =  {$params['idejercicio']} or ae.idejercicio is null)
             AND (ae.identidad IN ({$strEntidades}) or ae.identidad is null) )

            LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON(aem.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON(aea.idactividadentidad = ae.idactividadentidad)

            LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( aep.idactividadentidad = ae.idactividadentidad)
                LEFT JOIN valioso v ON (ae.idactividadentidad=v.idactividadentidad)

            WHERE a.nivel={$nivel} AND a.idaprobacion =4 AND a.estado=1
            " . $WHERE . "
           ) as x
                GROUP BY
                x.idactividad
                Having  SUM(x.nivelactividadfinal)>0
                 " . $Having . ")as z";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['total'];

        return $data;
    }

    //Lista la cantidad real de la ejecución dado un idactividadentidad
    public function listarEjecucionNiveles($parametros, $offsetLimit, $WHERE) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
  idcontrolejecucionnivelactividaddemanda,
  nivelactividadreal,
  fechareal,
  idactividadentidad,
  idusuario
FROM
  mod_planificacion.dat_controlejecucionnivelactividaddemanda
  where idactividadentidad={$parametros['idactividadentidad']}
  $WHERE
      $offsetLimit";
        $sqlT = "SELECT COUNT (idcontrolejecucionnivelactividaddemanda)
FROM
  mod_planificacion.dat_controlejecucionnivelactividaddemanda
  where idactividadentidad={$parametros['idactividadentidad']}
  $WHERE
      ";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['total'];
        return $data;
    }

    //Inserta la cantidad real de la ejecución dado un idactividadentidad
    public function insertarEjecNiv($params) {
        if ($params['eliminar'][0] != null) {
            $actv = implode(',', $params['eliminar']);
            //eliminar
            $conn = Doctrine_Manager::connection();
            $sql = "DELETE FROM mod_planificacion.dat_controlejecucionnivelactividaddemanda cep
                WHERE cep.idcontrolejecucionnivelactividaddemanda IN ($actv)";
            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            foreach ($params['ejec'] as $ejec) {

                if ($ejec->idcontrolejecucionnivel == null
                ) {
                    $objEjecNiv = new DatControlejecucionnivelactividad();
                    $objEjecNiv->nivelactividadreal = $ejec->nivelactividadreal;
                    $objEjecNiv->fechareal = $ejec->fecha;
                    $objEjecNiv->idactividadentidad = $params['idactividadentidad'];
                    $objEjecNiv->idusuario = $params['idusuario'];
                    $objEjecNiv->save();
                } else {
                    $objeto = Doctrine::getTable(
                                    'DatControlejecucionnivelactividad'
                            )->find(
                            $ejec->idcontrolejecucionnivel
                    );
                    //modificar
                    $objeto->nivelactividadreal = $ejec->nivelactividadreal;
                    $objeto->fechareal = $ejec->fecha;
                    $objeto->save();
                }
            }
        }
        return true;
    }

//Gráfica ejecución global Niveles x entidad
    public function graficaEjecucionglobalxentidadAct($parametros) {
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT sum(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
aea.nivelactividadautomatico, 0)) +
COALESCE(aep.nivelactividadproduccion, 0) +
  ae.ajuste)) as nivel,
        sum(COALESCE(ce.nivelactividadreal, 0)) as nivelejecutado,
        (sum(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
        aea.nivelactividadautomatico, 0)) +
COALESCE(aep.nivelactividadproduccion
        , 0) + ae.ajuste))) -(sum(COALESCE(ce.nivelactividadreal, 0))) as
         pendiente
FROM mod_planificacion.dat_actividadentidad ae
      LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
      ae.idactividadentidad = aem.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
      ae.idactividadentidad = aea.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
      aep.idactividadentidad = ae.idactividadentidad)
      LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividaddemanda ce ON
       ae.idactividadentidad = ce.idactividadentidad
where ae.identidad IN ($entidades) AND
       ae.idejercicio = {$parametros['idejercicio']}
      ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Indicadores fuera de plan más valiosos(adiciones)
    public function graficaIndicadoresFueraPlanMasValiososAct($parametros) {
        $especialidades = implode(',', $parametros['id_especialidades']);
        $entidades = implode(',', $parametros['identidad']);
        $nivel = NomActividad::getNivel();

        $conn = Doctrine_Manager::connection();
        $sql = "--Actividades mas valiosos(adiciones)
  SELECT a.idactividad,
         a.denominacion,
         COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0) as
          adiciones
  FROM mod_planificacion.dat_desviacionnivelactividad dna
       LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
        ON dna.iddesviacionnivelactividaddemanda = dnas.iddesviacionnivelactividaddemanda
       INNER JOIN mod_planificacion.dat_actividadentidad ae ON
        dna.idactividadentidad = ae.idactividadentidad
        INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON (
     ae.idactespcomportamiento = aec.idactespcomportamiento AND (ae.idejercicio
      = {$parametros['idejercicio']} or ae.idejercicio is null) AND (ae.identidad IN ($entidades) or
       ae.identidad is null))
        INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
        aec.idactividad
        where aec.idespecialidad IN ($especialidades) AND
        dnas.iddesviacionnivelactividaddemanda is null AND
        a.nivel = {$nivel} AND
        a.idaprobacion = 4 AND
        a.estado = 1 AND
        ae.idejercicio =  {$parametros['idejercicio']}
  GROUP BY a.idactividad
  ORDER BY adiciones DESC
  LIMIT 10";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    //Gráfica ejecución de indicadores más valiosos
    public function graficaEjecucionMasValiososAct($parametros) {
        $nivel = NomActividad::getNivel();
        $especialidades = implode(',', $parametros['id_especialidades']);
        $entidades = implode(',', $parametros['identidad']);

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "--ejecucion NA los mas valiosos
            WITH consulta AS
            (
            SELECT a.idactividad,
                   a.denominacion,
                   sum((n.necesidad) * ip.precio *((COALESCE(
                   aem.nivelactividadmanual, 0) + COALESCE(aea.nivelactividadautomatico, 0))
                    + COALESCE(aep.nivelactividadproduccion, 0) + ae.ajuste)) as
                     importeplan,
                   sum((COALESCE(ce.nivelactividadreal, 0)) * ip.precio) as importeejecutado
            FROM mod_planificacion.dat_actividadentidad ae
                 LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
                 ae.idactividadentidad = aem.idactividadentidad)
                 LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
                 ae.idactividadentidad = aea.idactividadentidad)
                 LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
                 aep.idactividadentidad = ae.idactividadentidad)
                 INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON (
                 ae.idactespcomportamiento = aec.idactespcomportamiento AND (ae.idejercicio
                  = {$parametros['idejercicio']} or ae.idejercicio is null) AND (ae.identidad IN ($entidades) or
                   ae.identidad is null))
                 INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
                  aec.idactividad
                 INNER JOIN mod_planificacion.dat_norma n ON a.idactividad = n.idactividad
                 INNER JOIN mod_datosmaestros.nom_indicador ind ON n.idindicador =
                  ind.idindicador
                 INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
                  ind.idindicador
                 LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividaddemanda ce ON
                  ae.idactividadentidad = ce.idactividadentidad
            where aec.idespecialidad IN ($especialidades) AND
                  a.nivel = {$nivel} AND
                  a.idaprobacion = 4 AND
                  a.estado = 1 AND
                  ip.nivelplanif = 1 AND
                  ip.idaprobacion = 4 AND
                  n.idejercicio = {$parametros['idejercicio']} $addwhere
            GROUP BY a.idactividad,
                     a.denominacion)

            SELECT c.idactividad,
                   c.denominacion,
                   c.importeplan,
                   c.importeejecutado
            from consulta c
            ORDER BY c.importeejecutado DESC
            Limit 10
      ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x meses
    public function graficaEjecucionglobalxentidadejecutadoxmesesAct($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--ejecutado por meses
WITH
ejecutado AS (
SELECT CASE
         WHEN EXTRACT(MONTH
FROM ce.fechareal) = 1 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
         ELSE 0
       END as ejecutadoenero,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 2 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
       ELSE 0
     END as ejecutadofebrero,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 3 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
       ELSE 0
     END as ejecutadomarzo,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 4 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
       ELSE 0
     END as ejecutadoabril,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 5 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
       ELSE 0
     END as ejecutadomayo,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 6 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
       ELSE 0
     END as ejecutadojunio,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 7 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
       ELSE 0
     END as ejecutadojulio,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 8 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
       ELSE 0
     END as ejecutadoagosto,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 9 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)
       ELSE 0
     END as ejecutadoseptiembre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 10 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0
)
       ELSE 0
     END as ejecutadooctubre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 11 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0
)
       ELSE 0
     END as ejecutadonoviembre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 12 THEN COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0
)
       ELSE 0
     END as ejecutadodiciembre
FROM mod_planificacion.dat_controlejecucionnivelactividaddemanda ce
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON
      ae.idactividadentidad = ce.idactividadentidad
where ae.identidad IN ($entidades) AND
      ae.idejercicio = {$parametros['idejercicio']}
GROUP BY ce.fechareal)

SELECT sum(e.ejecutadoenero) as ejecutadoenero,
       sum(e.ejecutadofebrero) as ejecutadofebrero,
       sum(e.ejecutadomarzo) as ejecutadomarzo,
       sum(e.ejecutadoabril) as ejecutadoabril,
       sum(e.ejecutadomayo) as ejecutadomayo,
       sum(e.ejecutadojunio) as ejecutadojunio,
       sum(e.ejecutadojulio) as ejecutadojulio,
       sum(e.ejecutadoagosto) as ejecutadoagosto,
       sum(e.ejecutadoseptiembre) as ejecutadoseptiembre,
       sum(e.ejecutadooctubre) as ejecutadooctubre,
       sum(e.ejecutadonoviembre) as ejecutadonoviembre,
       sum(e.ejecutadodiciembre) as ejecutadodiciembre
FROM ejecutado e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x meses
    public function graficaEjecucionglobalxentidadsustituirxmesesAct($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);


        $conn = Doctrine_Manager::connection();
        $sql = "--sustituciones por meses
WITH
sustituciones AS (
SELECT CASE
         WHEN EXTRACT(MONTH
FROM dna.fechareal) = 1 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
         ELSE 0
       END as sustitucionenero,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 2 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionfebrero,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 3 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionmarzo,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 4 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionabril,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 5 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionmayo,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 6 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionjunio,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 7 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionjulio,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 8 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionagosto,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 9 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionseptiembre,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 10 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionoctubre,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 11 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustitucionnoviembre,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 12 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion ), 0)
       ELSE 0
     END as sustituciondiciembre
FROM mod_planificacion.dat_desviacionnivelactividad dna
     INNER JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
      ON dna.iddesviacionnivelactividaddemanda = dnas.iddesviacionnivelactividaddemanda
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON
      dna.idactividadentidad = ae.idactividadentidad

where ae.identidad IN ($entidades) AND
      ae.idejercicio = {$parametros['idejercicio']}
GROUP BY dna.fechareal)

SELECT COALESCE(sum(e.sustitucionenero),0) as sustitucionenero,
       COALESCE(sum(e.sustitucionfebrero),0) as sustitucionfebrero,
       COALESCE(sum(e.sustitucionmarzo),0) as sustitucionmarzo,
       COALESCE(sum(e.sustitucionabril),0) as sustitucionabril,
       COALESCE(sum(e.sustitucionmayo),0) as sustitucionmayo,
       COALESCE(sum(e.sustitucionjunio),0) as sustitucionjunio,
       COALESCE(sum(e.sustitucionjulio),0) as sustitucionjulio,
       COALESCE(sum(e.sustitucionagosto),0) as sustitucionagosto,
       COALESCE(sum(e.sustitucionseptiembre),0) as sustitucionseptiembre,
       COALESCE(sum(e.sustitucionoctubre),0) as sustitucionoctubre,
       COALESCE(sum(e.sustitucionnoviembre),0) as sustitucionnoviembre,
       COALESCE(sum(e.sustituciondiciembre),0) as sustituciondiciembre
FROM sustituciones e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x meses
    public function graficaEjecucionglobalxentidadadicionadoxmesesAct($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--adiciones por meses
WITH
adiciones AS (
SELECT CASE
         WHEN EXTRACT(MONTH
FROM dna.fechareal) = 1 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
         ELSE 0
       END as adicionenero,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 2 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adicionfebrero,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 3 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adicionmarzo,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 4 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adicionabril,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 5 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adicionmayo,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 6 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adicionjunio,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 7 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adicionjulio,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 8 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adicionagosto,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 9 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adicionseptiembre,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 10 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0
)
       ELSE 0
     END as adicionoctubre,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 11 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0
)
       ELSE 0
     END as adicionnoviembre,
     CASE
       WHEN EXTRACT(MONTH
FROM dna.fechareal) = 12 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0
)
       ELSE 0
     END as adiciondiciembre
FROM mod_planificacion.dat_desviacionnivelactividad dna
     LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
      ON dna.iddesviacionnivelactividaddemanda = dnas.iddesviacionnivelactividaddemanda
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON
      dna.idactividadentidad = ae.idactividadentidad
where dnas.iddesviacionnivelactividaddemanda is null AND
      ae.identidad IN ($entidades) AND
      ae.idejercicio = {$parametros['idejercicio']}
GROUP BY dna.fechareal)

SELECT COALESCE(sum(e.adicionenero), 0) as adicionenero,
       COALESCE(sum(e.adicionfebrero), 0) as adicionfebrero,
       COALESCE(sum(e.adicionmarzo), 0) as adicionmarzo,
       COALESCE(sum(e.adicionabril), 0) as adicionabril,
       COALESCE(sum(e.adicionmayo), 0) as adicionmayo,
       COALESCE(sum(e.adicionjunio), 0) as adicionjunio,
       COALESCE(sum(e.adicionjulio), 0) as adicionjulio,
       COALESCE(sum(e.adicionagosto), 0) as adicionagosto,
       COALESCE(sum(e.adicionseptiembre), 0) as adicionseptiembre,
       COALESCE(sum(e.adicionoctubre), 0) as adicionoctubre,
       COALESCE(sum(e.adicionnoviembre), 0) as adicionnoviembre,
       COALESCE(sum(e.adiciondiciembre), 0) as adiciondiciembre
FROM adiciones e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Indicadores ejecutados más valiosos
    public function graficaIndicadoresMasEjecutadosAct($parametros) {
        $nivel = NomActividad::getNivel();
        $especialidades = implode(',', $parametros['id_especialidades']);
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--los NA mas ejecutados
WITH consulta AS
(
SELECT a.idactividad,
       a.denominacion,
       sum(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
       aea.nivelactividadautomatico, 0)) + COALESCE(aep.nivelactividadproduccion
       , 0) + ae.ajuste)) as plan,
       sum((COALESCE(ce.nivelactividadreal, 0))) as ejecutado
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
     ae.idactividadentidad = aem.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
     ae.idactividadentidad = aea.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
     aep.idactividadentidad = ae.idactividadentidad)
      INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON (
     ae.idactespcomportamiento = aec.idactespcomportamiento AND (ae.idejercicio
      = {$parametros['idejercicio']} or ae.idejercicio is null) AND (ae.identidad IN ($entidades) or
       ae.identidad is null))
     INNER JOIN mod_planificacion.nom_actividad a ON a.idactividad =
      aec.idactividad
     LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividaddemanda ce ON
      ae.idactividadentidad = ce.idactividadentidad
 where aec.idespecialidad IN ($especialidades) AND
      ae.idejercicio = {$parametros['idejercicio']}
      AND
      a.nivel = {$nivel} AND
      a.idaprobacion = 4 AND
      a.estado = 1
GROUP BY a.idactividad,
         a.denominacion)

SELECT c.idactividad,
       c.denominacion,
       c.plan,
       c.ejecutado
from consulta c
ORDER BY c.ejecutado {$parametros['orden']},c.denominacion";


        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x trimestres
    public function graficaEjecucionglobalxentidadejecutadoxtrimestreAct($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--NA ejecutado por trimestre
WITH
ejecutado AS (
SELECT CASE
         WHEN EXTRACT(QUARTER
FROM ce.fechareal) = 1 THEN COALESCE(sum((COALESCE(ce.nivelactividadreal, 0))),
 0)
         ELSE 0
       END as ejecutadotrimestre1,
     CASE
       WHEN EXTRACT(QUARTER
FROM ce.fechareal) = 2 THEN COALESCE(sum((COALESCE(ce.nivelactividadreal, 0))),
 0)
       ELSE 0
     END as ejecutadotrimestre2,
     CASE
       WHEN EXTRACT(QUARTER
FROM ce.fechareal) = 3 THEN COALESCE(sum((COALESCE(ce.nivelactividadreal, 0))),
 0)
       ELSE 0
     END as ejecutadotrimestre3,
     CASE
       WHEN EXTRACT(QUARTER
FROM ce.fechareal) = 4 THEN COALESCE(sum((COALESCE(ce.nivelactividadreal, 0))),
 0)
       ELSE 0
     END as ejecutadotrimestre4
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividaddemanda ce ON
      ae.idactividadentidad = ce.idactividadentidad
where ae.identidad IN ($entidades) AND
      ae.idejercicio = {$parametros['idejercicio']}
GROUP BY ce.fechareal)

SELECT sum(e.ejecutadotrimestre1) as ejecutadotrimestre1,
       sum(e.ejecutadotrimestre2) as ejecutadotrimestre2,
       sum(e.ejecutadotrimestre3) as ejecutadotrimestre3,
       sum(e.ejecutadotrimestre4) as ejecutadotrimestre4
FROM ejecutado e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x trimestres
    public function graficaEjecucionglobalxentidadadicionadoxtrimestreAct($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--adiciones por trimestre
WITH
adiciones AS (
SELECT CASE
         WHEN EXTRACT(QUARTER
FROM dna.fechareal) = 1 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
         ELSE 0
       END as adiciontrimestre1,
     CASE
       WHEN EXTRACT(QUARTER
FROM dna.fechareal) = 2 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adiciontrimestre2,
     CASE
       WHEN EXTRACT(QUARTER
FROM dna.fechareal) = 3 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adiciontrimestre3,
     CASE
       WHEN EXTRACT(QUARTER
FROM dna.fechareal) = 4 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as adiciontrimestre4
FROM mod_planificacion.dat_desviacionnivelactividad dna
     LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
      ON dna.iddesviacionnivelactividaddemanda = dnas.iddesviacionnivelactividaddemanda
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON
      dna.idactividadentidad = ae.idactividadentidad
where ae.identidad IN ($entidades) AND
      dnas.iddesviacionnivelactividaddemanda is null AND
      ae.idejercicio = {$parametros['idejercicio']}
GROUP BY dna.fechareal)

SELECT sum(e.adiciontrimestre1) as adiciontrimestre1,
       sum(e.adiciontrimestre2) as adiciontrimestre2,
       sum(e.adiciontrimestre3) as adiciontrimestre3,
       sum(e.adiciontrimestre4) as adiciontrimestre4
FROM adiciones e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x trimestres
    public function graficaEjecucionglobalxentidadsustituirxtrimestreAct($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "--sustituciones por trimestre
WITH
sustituciones AS (
SELECT CASE
         WHEN EXTRACT(QUARTER
FROM dna.fechareal) = 1 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
         ELSE 0
       END as sustituciontrimestre1,
     CASE
       WHEN EXTRACT(QUARTER
FROM dna.fechareal) = 2 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as sustituciontrimestre2,
     CASE
       WHEN EXTRACT(QUARTER
FROM dna.fechareal) = 3 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as sustituciontrimestre3,
     CASE
       WHEN EXTRACT(QUARTER
FROM dna.fechareal) = 4 THEN COALESCE(sum(dna.nivelactividadrealxdesviacion), 0)
       ELSE 0
     END as sustituciontrimestre4
FROM mod_planificacion.dat_desviacionnivelactividad dna
     LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
      ON dna.iddesviacionnivelactividaddemanda = dnas.iddesviacionnivelactividaddemanda
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON
      dna.idactividadentidad = ae.idactividadentidad
where ae.identidad IN ($entidades) AND
      ae.idejercicio = {$parametros['idejercicio']}
GROUP BY dna.fechareal)

SELECT sum(e.sustituciontrimestre1) as sustituciontrimestre1,
       sum(e.sustituciontrimestre2) as sustituciontrimestre2,
       sum(e.sustituciontrimestre3) as sustituciontrimestre3,
       sum(e.sustituciontrimestre4) as sustituciontrimestre4
FROM sustituciones e
 ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad
    public function graficaEjecucionglobalxentidadxAct($parametros) {
        $nivel = NomActividad::getNivel();
        $entidades = implode(',', $parametros['identidad']);

        $conn = Doctrine_Manager::connection();
        $sql = "WITH
desviacionsust AS (SELECT COALESCE(sum(dna.nivelactividadrealxdesviacion), 0) as
 sustituciones,
                          dna.idactividadentidad
                   FROM mod_planificacion.dat_desviacionnivelactividad dna
                        LEFT JOIN
                         mod_planificacion.dat_desviacionnivelactividadxsustitucion
                          dnas ON dna.iddesviacionnivelactividaddemanda =
                           dnas.iddesviacionnivelactividaddemanda
                   GROUP BY dna.idactividadentidad),
  desviacionadicion AS (
  SELECT COALESCE(sum(dna.nivelactividadrealxdesviacion), 0) as adiciones,
         dna.idactividadentidad
  FROM mod_planificacion.dat_desviacionnivelactividad dna
       LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustitucion dnas
        ON dna.iddesviacionnivelactividaddemanda = dnas.iddesviacionnivelactividaddemanda
  where dnas.iddesviacionnivelactividaddemanda is null
  GROUP BY dna.idactividadentidad)


SELECT a.idactividad,
       a.denominacion,
       sum(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
       aea.nivelactividadautomatico, 0)) + COALESCE(aep.nivelactividadproduccion
       , 0) + ae.ajuste)) as nivel,
       COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0) as nivelejecutado,
       COALESCE(sum(d.sustituciones), 0) as sustitucion,
       COALESCE(sum(ad.adiciones), 0) as adicion,
       ((COALESCE(sum(COALESCE(ce.nivelactividadreal, 0)), 0)) +(COALESCE(sum(
       d.sustituciones), 0)) +(COALESCE(sum(ad.adiciones), 0))) as totalejecutado
FROM mod_planificacion.dat_actividadentidad ae
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
     ae.idactividadentidad = aem.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
     ae.idactividadentidad = aea.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
     aep.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_controlejecucionnivelactividaddemanda ce ON
      ae.idactividadentidad = ce.idactividadentidad
     INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad =
      a.idactividad
     LEFT JOIN desviacionsust d ON (ae.idactividadentidad = d.idactividadentidad
     )
     LEFT JOIN desviacionadicion ad ON (ae.idactividadentidad =
      ad.idactividadentidad)
where ae.identidad IN ($entidades) AND
      ae.idejercicio = {$parametros['idejercicio']} AND
      a.nivel = {$nivel} AND
      a.idaprobacion = 4 AND
      a.estado = 1 GROUP BY a.idactividad";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
