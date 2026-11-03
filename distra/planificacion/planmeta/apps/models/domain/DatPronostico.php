<?php

class DatPronostico extends BaseDatPronostico {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'idmes', 'foreign' => 'iddatosnomenclador')
        );
    }

    //Lista los indicadores con cantidad mayor que cero dada una entidad, un plan y un ejercicio (entidad hija)
    public function listarIndEjec($parametros, $WHERE, $Having, $offsetLimit) {
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $conn = Doctrine_Manager::connection();
        $sql = "
SELECT p.idindicador,
       ind.codigo,
       ind.denominacion,
       p.idunidadmedida,
       SUM(p.cantidad + p.ajuste) as cantplanif,
       COALESCE(pr.pronostico, 0) as pronostico,
       COUNT(*) OVER() as total
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN mod_planificacion.dat_pronostico pr ON (p.idindicador = pr.idindicador AND  pr.idmes = 693 AND(pr.idejercicio = {$parametros['idejercicio']}) AND pr.identidad IN( {$parametros['identidades']}))

where em.identidad IN({$parametros['identidades']})  AND
      p.idejercicio = {$parametros['idejercicio']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4
       $addwhere
      $WHERE
      GROUP BY
      p.idindicador,
      ind.codigo,
      ind.denominacion,
      p.idunidadmedida,
      pr.pronostico
      having sum (p.cantidad + p.ajuste) >0
      $Having
      $offsetLimit";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data [0]['total'];
        return $data;
    }

    public function listarOrganosSatisface($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT 
       os.denominacion as denominacionOS,
       os.idorganosatisface
        
FROM  mod_datosmaestros.nom_organosatisface os 
 INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios ON (
       ios.idorganosatisface = os.idorganosatisface AND os.ordender -
       os.ordenizq = 1)
     INNER JOIN mod_planificacion.dat_planificacion p ON p.idindicador =
       ios.idindicador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
       ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       ind.idindicador
where em.identidad IN ({$parametros['identidad']}) AND
      p.idejercicio = {$parametros['idejercicio']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4 AND
      ind.estado = 1 order by os.denominacion";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_NUM);
        return $data;
    }

    public function validarIndicador($idindicador, $entidad, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT p.idindicador
 FROM mod_planificacion.dat_planificacion p
      INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
        em.identidadmodelo
 WHERE p.idindicador = $idindicador AND
       em.identidad = $entidad AND
       p.idejercicio = $idejercicio AND
       p.idaprobaciondemanda = 4
       group by p.idindicador
       having SUM(p.cantidad + p.ajuste)>0";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function validarIndicadorOs($idindicador, $idos) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idindicadorviaadquisicionorganosatisface as id
FROM mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
WHERE idindicador = $idindicador AND
       idorganosatisface = $idos";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
