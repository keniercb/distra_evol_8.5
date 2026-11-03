<?php

class DatDesviacionnivelactividadDemanda extends BaseDatDesviacionnivelactividaddemanda {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatActividadentidad', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasMany(
                'DatDesviacionnivelactividadxsustitucion', array('local' => 'iddesviacionnivelactividaddemanda',
            'foreign' => 'iddesviacionnivelactividaddemanda')
        );
    }

    //Lista la desviación en actividades
    public function listarDesvNiveles($parametros, $offsetLimit, $WHERE) {
        $actv_ent = [];
        $actv_entaux = [];
        $modeloActEnt = new DatActividadentidad();
        foreach ($parametros['idactividades'] as $idactv) {
            $actv_entaux[] = DatActividadentidad::BuscarIdactividadEntidades1(
                            $parametros['identidad'], $idactv, $parametros['idejercicio']
                    )[0]['idactividadentidad'];
        }
        $actv_ent = implode(',', $actv_entaux);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
  dniv.iddesviacionnivelactividaddemanda,dniv.nivelactividadrealxdesviacion,
  dniv.fechareal,dniv.idactividadentidad,a.idactividad,a.denominacion,a.codigo
FROM mod_planificacion.dat_desviacionnivelactividaddemanda dniv
INNER JOIN mod_planificacion.dat_actividadentidad ae ON dniv.idactividadentidad = ae.idactividadentidad
INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad = a.idactividad
INNER JOIN mod_planificacion.dat_desviacionnivelactividadxsustituciondemanda sust on dniv.iddesviacionnivelactividaddemanda = sust.iddesviacionnivelactividaddemanda
WHERE ae.idejercicio = {$parametros['idejercicio']} AND sust.idactividadentidad = "
                . "'" . "{" . $actv_ent . "}" . "'" . "
  $WHERE
      $offsetLimit";

        $sqlT = "SELECT COUNT (sust.iddesviacionnivelactividaddemanda)
FROM mod_planificacion.dat_desviacionnivelactividaddemanda dniv
INNER JOIN mod_planificacion.dat_actividadentidad ae ON dniv.idactividadentidad = ae.idactividadentidad
INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad = a.idactividad
INNER JOIN mod_planificacion.dat_desviacionnivelactividadxsustituciondemanda sust on dniv.iddesviacionnivelactividaddemanda = sust.iddesviacionnivelactividaddemanda
WHERE ae.idejercicio = {$parametros['idejercicio']} AND sust.idactividadentidad = "
                . "'" . "{" . $actv_ent . "}" . "'" . "
  $WHERE ";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

    //Lista la adicion en actividades
    public function listarAdicNiveles($parametros, $offsetLimit, $WHERE) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
  dniv.iddesviacionnivelactividaddemanda,dniv.nivelactividadrealxdesviacion,
  dniv.fechareal,dniv.idactividadentidad,a.idactividad,a.denominacion,a.codigo
FROM mod_planificacion.dat_desviacionnivelactividaddemanda dniv
INNER JOIN mod_planificacion.dat_actividadentidad ae ON dniv.idactividadentidad = ae.idactividadentidad
INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad = a.idactividad
LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustituciondemanda sust on dniv.iddesviacionnivelactividaddemanda = sust.iddesviacionnivelactividaddemanda
WHERE ae.idejercicio = {$parametros['idejercicio']} AND sust.iddesviacionnivelactividaddemanda is null AND ae.identidad = {$parametros['identidad']}
  $WHERE
      $offsetLimit";
        $sqlT = "SELECT COUNT (dniv.iddesviacionnivelactividaddemanda)
FROM mod_planificacion.dat_desviacionnivelactividaddemanda dniv
INNER JOIN mod_planificacion.dat_actividadentidad ae ON dniv.idactividadentidad = ae.idactividadentidad
INNER JOIN mod_planificacion.nom_actividad a ON ae.idactividad = a.idactividad
LEFT JOIN mod_planificacion.dat_desviacionnivelactividadxsustituciondemanda sust on dniv.iddesviacionnivelactividaddemanda = sust.iddesviacionnivelactividaddemanda
WHERE ae.idejercicio = {$parametros['idejercicio']} AND sust.iddesviacionnivelactividaddemanda is null AND ae.identidad = {$parametros['identidad']}
  $WHERE ";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

    //Inserta la desviación de la ejecución dado un idactividadentidad
    public function insertarDesvNiv($params) {
        if ($params['eliminar'][0] != null) {
            $actv = implode(',', $params['eliminar']);
            //eliminar
            $conn = Doctrine_Manager::connection();
            $sql = "DELETE FROM mod_planificacion.dat_desviacionnivelactividaddemanda cep
                WHERE cep.iddesviacionnivelactividaddemanda IN ($actv)";
            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $idactividadentidadsust = "";
            $iddatosnomenclador = DatActespcomportamiento::obtenerIdDatosNom();
            $arrayIddatosnomenclador = array($iddatosnomenclador['demandada'],
                $iddatosnomenclador['compartida'],
                $iddatosnomenclador['propia']);
            unset($iddatosnomenclador);
            $iddesviacionnivelactividaddemanda = "";
            $modeloActEnt = new DatActividadentidad();
            foreach ($params['ejec'] as $ejec) {
                if ($ejec->iddesviacionnivelactividaddemanda == null || $ejec->adicion == 1
                ) {
                    //insertar
                    $objDesvNiv = new DatDesviacionnivelactividad();
                    $objDesvNiv->nivelactividadrealxdesviacion = $ejec->nivelactividadreal;
                    $objDesvNiv->fechareal = $ejec->fecha;


                    $params['idactividadentidadsust'] = DatActividadentidad::BuscarIdactividadEntidades1(
                                    $params['identidad'], $ejec->idactividad, $params['idejercicio']
                    );

                    if ($params['idactividadentidadsust'] == null) {
                        $modeloAct = new DatActividadentidadModel();
                        $nuevaAsocactent = $modeloAct->crearAsociacionActEnt(
                                $ejec->idactividad, $arrayIddatosnomenclador, $ejec->idactespcomportamiento, $params['identidad'], $params['idejercicio']
                        );
                        $idactividadentidadsust = $nuevaAsocactent->idactividadentidad;
                    } else {
                        $idactividadentidadsust = $params['idactividadentidadsust'][0]['idactividadentidad'];
                    }
                    $objDesvNiv->idactividadentidad = $idactividadentidadsust;

                    $objDesvNiv->idusuario = $params['idusuario'];

                    $objDesvNiv->save();

                    $iddesviacionnivelactividaddemanda = $objDesvNiv->iddesviacionnivelactividaddemanda;
                } else {
                    $objDesv = Doctrine::getTable('DatDesviacionnivelactividad')
                            ->find($ejec->iddesviacionnivelactividaddemanda);
                    //modificar
                    $objDesv->nivelactividadrealxdesviacion = $ejec->nivelactividadreal;
                    $objDesv->fechareal = $ejec->fecha;
                    $objDesv->save();
                }
            }
        }
        if ($iddesviacionnivelactividaddemanda != "") {
            return $iddesviacionnivelactividaddemanda;
        } else {
            return true;
        }
    }

    public
            function insertarDesvXSustNiv($params
    ) {
        $idactv_entidadaux = [];
        $modeloActEnt = new DatActividadentidad();
        foreach ($params['ejec'] as $ejec) {
            foreach ($ejec->idactividadessust as $idactv) {
                $idactv_entidadaux[] = DatActividadentidad::BuscarIdactividadEntidades1(
                                $params['identidad'], $idactv, $params['idejercicio']
                        )[0]['idactividadentidad'];
            }
        }
        $idactv_entidad = implode(',', $idactv_entidadaux);
        $objDesvSust = new DatDesviacionnivelactividadxsustitucion();
        $objDesvSust->iddesviacionnivelactividaddemanda = $params['iddesviacionnivelactividaddemanda'];
        $objDesvSust->idactividadentidad = "{" . $idactv_entidad . "}";
        $objDesvSust->save();
        return true;
    }

//Lista las actividades para adicionar una desviacion
    public function listarActAddDesviacion($parametros, $offsetLimit, $WHERE
    ) {
        if ($parametros['idactividades'][0] != null) {
            $actividades = implode(',', $parametros['idactividades']);
            $NotIn = " AND na.idactividad NOT IN ($actividades)";
        } else {
            $NotIn = "";
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct (na.idactividad),
       na.codigo,
       na.denominacion,
       daec.idactespcomportamiento
FROM mod_planificacion.nom_actividad na
     INNER JOIN mod_planificacion.dat_actespcomportamiento daec ON (
     na.idactividad = daec.idactividad AND daec.idespecialidad = {$parametros['idespecialidad']})
     INNER JOIN mod_planificacion.dat_norma n ON (na.idactividad = n.idactividad
      AND n.idejercicio = {$parametros['idejercicio']})
     LEFT JOIN mod_planificacion.dat_actividadentidad dae ON (
     dae.idactespcomportamiento = daec.idactespcomportamiento AND dae.identidad
      = {$parametros['identidad']} AND dae.idejercicio = {$parametros['idejercicio']})
WHERE na.idaprobacion >= 3 AND na.estado = 1 $NotIn $WHERE $offsetLimit";

        $sqlT = "SELECT COUNT (distinct na.idactividad)
FROM mod_planificacion.nom_actividad na
     INNER JOIN mod_planificacion.dat_actespcomportamiento daec ON (
     na.idactividad = daec.idactividad AND daec.idespecialidad = {$parametros['idespecialidad']})
     INNER JOIN mod_planificacion.dat_norma n ON (na.idactividad = n.idactividad
      AND n.idejercicio = {$parametros['idejercicio']})
     LEFT JOIN mod_planificacion.dat_actividadentidad dae ON (
     dae.idactespcomportamiento = daec.idactespcomportamiento AND dae.identidad
      = {$parametros['identidad']} AND dae.idejercicio = {$parametros['idejercicio']})
WHERE na.idaprobacion >= 3 AND na.estado = 1 $NotIn $WHERE";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total[0]['count'];
        return $data;
    }

//Lista las actividades para adicionar una desviacion x adicion
    /* public function listarActAddDesviacionAdicion($parametros, $offsetLimit, $WHERE)
      {
      if ($parametros['idactividades'][0] != null) {
      $actividades = implode(',', $parametros['idactividades']);
      $NotIn = " AND na.idactividad NOT IN ($actividades)";
      } else {
      $NotIn = "";
      }

      $conn = Doctrine_Manager::connection();
      $sql
      = "SELECT distinct (na.idactividad),na.codigo,na.denominacion
      FROM mod_planificacion.nom_actividad na
      INNER JOIN mod_planificacion.dat_actespcomportamiento daec ON (
      na.idactividad = daec.idactividad)
      INNER JOIN mod_planificacion.dat_norma n ON (na.idactividad = n.idactividad
      AND n.idejercicio = {$parametros['idejercicio']})
      LEFT JOIN mod_planificacion.dat_actividadentidad dae ON (
      dae.idactespcomportamiento = daec.idactespcomportamiento AND dae.identidad
      = {$parametros['identidad']} AND dae.idejercicio = {$parametros['idejercicio']})
      WHERE na.idaprobacion >= 3 AND
      na.estado = 1  --aqui ver lo del estado para el ej actual
      $NotIn $WHERE $offsetLimit";
      $sqlT
      = "SELECT COUNT (na.idactividad)
      FROM mod_planificacion.nom_actividad na
      INNER JOIN mod_planificacion.dat_actespcomportamiento daec ON (
      na.idactividad = daec.idactividad)
      INNER JOIN mod_planificacion.dat_norma n ON (na.idactividad = n.idactividad
      AND n.idejercicio = {$parametros['idejercicio']})
      LEFT JOIN mod_planificacion.dat_actividadentidad dae ON (
      dae.idactespcomportamiento = daec.idactespcomportamiento AND dae.identidad
      = {$parametros['identidad']} AND dae.idejercicio = {$parametros['idejercicio']})
      WHERE na.idaprobacion >= 3 AND
      na.estado = 1 --aqui ver lo del estado para el ej actual
      $NotIn  $WHERE";
      $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
      $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
      $data->total = $data->total [0]['count'];
      return $data;
      } */
}
