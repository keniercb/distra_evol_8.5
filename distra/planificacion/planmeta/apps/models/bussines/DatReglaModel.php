<?php

/**
 * DatReglaModel
 *
 *
 * @ author Drisis Silvia Díaz Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatReglaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatRegla $DatRegla) {
        $DatRegla->save();
    }

    public function Actualizar(DatRegla $DatRegla) {
        $DatRegla->save();
    }

    public function Eliminar($DatRegla) {
        $DatRegla->delete();
    }

    public function listarReglas($params) {
        $data = DatRegla::listarReglas($params);
        return $data;
    }

    public function listarActividadesAddRegla($params) {
        $data = DatRegla::listarActividadesAddRegla($params);
        return $data;
    }

    public function adicionarRegla($params) {
        $nuevaregla = new DatRegla();

        $nuevaregla->idnorma = $params['idnorma'];
        $nuevaregla->denominacion = $params['denominacion'];
        $nuevaregla->valorcontrol = $params['valorcontrol'];
        $nuevaregla->nivelactividadbase = $params['nivelbase'];
        $nuevaregla->idactividadorigen = $params['idactividad'];
        $nuevaregla->idactividaddestino = $params['idactividaddestino'];
        $nuevaregla->idejercicio = $params['idejercicio'];
        $nuevaregla->idusuario = $params['idusuario'];
        $nuevaregla->save();

        return true;
    }

    public function eliminarRegla($params) {
        $idreglas_array = array();

        foreach ($params['reglas'] as $regla) {
            $idreglas_array [] = $regla->idregla;
        }
        $idreglas = implode(',', $idreglas_array);
        DatRegla::eliminarRegla($idreglas);

        return count($idreglas);
    }

    public function actualizarReglas($params) {
        $modificados = 0;
        $fechaActual = date("d-m-Y H:i:s");

        foreach ($params['reglas'] as $regla) {
            $reglamod = Doctrine::getTable('DatRegla')->find($regla->idregla);
            if (is_object($reglamod)) {
                $reglamod->valorcontrol = ($regla->valorcontrol != null) ? $regla->valorcontrol : '1';
                $reglamod->nivelactividadbase = ($regla->nivelactividadbase != null) ? $regla->nivelactividadbase : '1';
                $reglamod->idusuario = $params['idusuario'];
                $reglamod->fecha = $fechaActual;
                $reglamod->save();
                $modificados++;
            }
        }

        return $modificados;
    }

    /* private function eliminarSecActivGeneradasXRegla($idactividadquegenera,
      $idespecialidad,
      $iddatosnomenclador, &$traceo
      )
      {
      $actividadesGenxRegla = DatReglaModel::obtenerSoloSecAutomatica(
      $idactividadquegenera,
      $idespecialidad, $traceo
      );
      if ($actividadesGenxRegla[0] != null) {
      $query = Doctrine_Query::create();
      $query->delete('DatActespcomportamiento')->from(
      'DatActespcomportamiento aed'
      )->addWhere('aed.idespecialidad <> ?', $idespecialidad)->addWhere(
      'aed.idactividad = ?',
      $idactividadquegenera
      )->addWhere(
      'aed.iddatosnomenclador = ? or aed.iddatosnomenclador = ? ',
      array($iddatosnomenclador['compartidaautomatico'],
      $iddatosnomenclador['demandadaautomatico'])
      )->execute();
      $query = Doctrine_Query::create();
      $query->delete('DatActespcomportamiento')->from(
      'DatActespcomportamiento aed'
      )->addWhere('aed.idespecialidad <> ?', $idespecialidad)->whereIn(
      'aed.idactespcomportamiento',
      $actividadesGenxRegla
      )->addWhere(
      'aed.iddatosnomenclador = ? or aed.iddatosnomenclador = ? ',
      array($iddatosnomenclador['compartidaautomatico'],
      $iddatosnomenclador['demandadaautomatico'])
      )->execute();
      }
      } */

    /* private function obtenerSoloSecAutomatica($idactividad, $idespLog, &$res, $arraySecuenciaActvs = array(), $conn = null
      ) {
      if ($conn == null) {
      $conn = Doctrine_Manager::connection();
      }
      $sql = "SELECT  n.idactividad as idactividadgeneradora,
      aec1.idactespcomportamiento as idactespcomportamiento_actgeneradora ,
      aec1.iddatosnomenclador as iddatosnomenclador_actgeneradora,
      aec1.idespecialidad as idespecialidad_actgeneradora,
      r.idactividadquegenera,
      aec.iddatosnomenclador,
      aec.idespecialidad,
      aec.idactespcomportamiento
      FROM mod_planificacion.dat_regla r
      INNER JOIN mod_planificacion.dat_norma n
      ON(n.idnorma = r.idnorma AND n.idactividad  = ? )
      INNER JOIN mod_planificacion.dat_actespcomportamiento aec
      ON(r.idactividadquegenera = aec.idactividad AND aec.idespecialidad <> ?
      AND aec.iddatosnomenclador IN(
      SELECT dn.iddatosnomenclador
      FROM mod_planificacion.nom_datosnomenclador dn
      WHERE dn.uridatosnomenclador = 'compartidaautomatico') )
      left JOIN mod_planificacion.dat_actespcomportamiento aec1
      ON( aec1.idactividad = n.idactividad AND aec1.idespecialidad = aec.idespecialidad
      AND aec.iddatosnomenclador = aec1.iddatosnomenclador )
      ";
      $arrayReglaquegenera = $conn->execute(
      $sql, array($idactividad, $idespLog)
      )->fetchAll(PDO::FETCH_ASSOC);
      foreach ($arrayReglaquegenera as $regla) {
      $res = $res . " [" . $idactividad . ", "
      . $regla['idactividadquegenera'] . "] ";
      $arraySecuenciaActvs[] = $regla['idactespcomportamiento'];
      $arraySecuenciaActvs = DatReglaModel::obtenerSoloSecAutomatica(
      $regla['idactividadquegenera'], $idespLog, $res, $arraySecuenciaActvs, $conn
      );
      }
      return $arraySecuenciaActvs;
      } */

    /* private function asociarSecActivGeneradasXRegla($idactividadquegenera,
      $idespecialidad,
      $iddatosnomenclador
      )
      {
      $actividadesGenxRegla = DatRegla::obtenerSecuenciaActvGenPorRegla(
      $idactividadquegenera
      );
      foreach ($actividadesGenxRegla as $idactividad) {
      $actespcompExistente
      = DatActespcomportamiento::buscarEspComportamiento(
      $idactividad,
      $idespecialidad
      )->getFirst();
      if ($actespcompExistente->idactespcomportamiento == null) {
      $objDatActEspDem = new DatActespcomportamiento();
      $objDatActEspDem->idactividad = $idactividad;
      $objDatActEspDem->idespecialidad = $idespecialidad;
      $objDatActEspDem->iddatosnomenclador
      = $iddatosnomenclador['compartidaautomatico'];
      $objDatActEspDem->save();
      }
      }
      } */

    /* temporal no se modifica la actividad que genera la regla */

    /* public function modificarReglas(array $arrayreglas
      ) {
      $almacenados = array();
      foreach ($arrayreglas as $regla) {
      $objregla = Doctrine::getTable('DatRegla')->find($regla->idregla);
      $objregla->valorcontrol = $regla->valorcontrol;
      $objregla->nivelactividadbase = $regla->nivelactividadbase;
      $objregla->save();
      $almacenados[] = $objregla->toArray();
      }
      return $almacenados;
      }

      public function eliminarVariasReglas(array $reglas, $idejercicio, array
      $actividad
      ) {

      //este if es en el caso de que el arreglo reglas este vacio y el arreglo actividad no lo este
      if (count($reglas) == 0 && count($actividad) > 0) {
      foreach ($actividad as $value) {
      $idactividades[] = DatRegla::DameIddadoActividad(
      $value->denomicionactgenera
      );
      }

      foreach ($actividad as $value) {
      $idreglas[] = DatRegla::DameIdRegladadoActividad(
      $value->denomicionactgenera
      );
      }


      //            foreach ($idactividades as $value) {
      //                DatActividadregla::eliminarReglasActividad(
      //                        $value[0]['idactividad']
      //                );
      //            }

      foreach ($idreglas as $value) {
      $result[] = $this->eliminarRegla(
      $value[0]['idregla'], $idejercicio
      );
      }
      }


      //este if es en el caso de que el arreglo reglas no este vacio y el arreglo actividad lo este
      if (count($reglas) != 0 && count($actividad) == 0) {

      foreach ($reglas as $regla) {
      $result[] = $idactividadquegenera = $this->eliminarRegla(
      $regla->idregla, $idejercicio
      );
      }
      }

      //este if es en el caso de que el arreglo reglas no este vacio y el arreglo actividad tampoco
      if (count($reglas) != 0 && count($actividad) > 0) {

      foreach ($reglas as $regla) {
      $result[] = $idactividadquegenera = $this->eliminarRegla(
      $regla->idregla, $idejercicio
      );
      }

      foreach ($actividad as $value) {
      $idactividades[] = DatRegla::DameIddadoActividad(
      $value->denomicionactgenera
      );
      }

      //            foreach ($idactividades as $value) {
      //                DatActividadregla::eliminarReglasActividad(
      //                        $value[0]['idactividad']
      //                );
      //            }
      }


      return $result;
      }

      private function eliminarRegla($idregla, $idejercicio) {

      DatActividadentidadautomaticoModel::eliminarAutomaticoPorRegla(
      $idregla
      );
      $regla = Doctrine::getTable('DatRegla')->findByDql(
      "idregla = $idregla AND idejercicio=$idejercicio"
      );
      //$regla = Doctrine::getTable('DatRegla')->find($idregla);
      $regla->delete();
      return $regla->idactividadquegenera;
      }

      public function eliminarReglasDadoIdActividad($idactividad, $idejercicio) {
      DatRegla::eliminarReglas($idactividad, $idejercicio);
      //DatActividadregla::eliminarReglasActividad($idactividad);
      } */

    /* funcion para obtener las actividades relacionadas a las reglas de una actividad */

    public function buscarActividadesRelacionadasPorReglasAUnaActiv($idactividad, $idejercicio, $idespecialidadDemandante
    ) {
        return DatRegla::buscarActividadesRelacionadasPorReglasAUnaActiv($idactividad, $idejercicio, $idespecialidadDemandante
        );
    }

}

//fin clase DatReglaModel

