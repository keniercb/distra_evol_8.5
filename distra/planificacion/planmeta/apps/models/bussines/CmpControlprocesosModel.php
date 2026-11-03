<?php

class CmpControlprocesosModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function cargarProcesosPlanificacion() {

        $arrayprocesos = NomDatosnomenclador::getDatosNomPorUriTipoNom('procesosplanificacion');
        if (isset($arrayprocesos[0])) {
            foreach ($arrayprocesos as $pos => $proceso) {
                $arrayprocesos[$pos]['id'] = $proceso['iddatosnomenclador'];
                $arrayprocesos[$pos]['text'] = $proceso['denominacion'];
                $arrayprocesos[$pos]['draggable'] = false;
                $arrayprocesos[$pos]['leaf'] = true;
                $arrayprocesos[$pos]['idtiponomenclador'] = $proceso['idtiponomenclador'];
            }
        }
        return $arrayprocesos;
    }

    public function cargarEstados() {
        $arrayprocesos = NomDatosnomenclador::getDatosNomPorUriTipoNomCtrlProc('estadosprocesos');
        if (isset($arrayprocesos[0])) {
            foreach ($arrayprocesos as $pos => $proceso) {
                $arrayprocesos[$pos]['id'] = $proceso['iddatosnomenclador'];
                $arrayprocesos[$pos]['text'] = $proceso['denominacion'];
                $arrayprocesos[$pos]['draggable'] = false;
                $arrayprocesos[$pos]['leaf'] = true;
                $arrayprocesos[$pos]['idtiponomenclador'] = $proceso['idtiponomenclador'];
            }
        }
        return $arrayprocesos;
    }

    public function listarEjercicios() {
        $query = new Doctrine_Query();
        $data = $query->select("n.idejercicio,n.ejercicio")
                ->from('NomEjercicioplanificacion n')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    public function cargarFuncionalidadesAsociadas($idproceso) {
        $arrayfuncionalidadesasoc = DatProcesofuncionalidad::obtenerFuncionalidadesPorProcesos($idproceso);

        if (isset($arrayfuncionalidadesasoc[0])) {
            foreach ($arrayfuncionalidadesasoc as $pos => $funcionalidad) {
                $arrayidfuncionalidades = array();
                $arrayidfuncionalidades[0] = $funcionalidad['idfuncionalidad'];

                $objfuncionalidad = $this->integrator->seguridad->obtenerDatosFuncionalidades($arrayidfuncionalidades);

                $arrayfuncionalidadesasoc[$pos]['id'] = $funcionalidad['idprocesofuncionalidad'];
                $arrayfuncionalidadesasoc[$pos]['idfuncionalidad'] = $funcionalidad['idfuncionalidad'];
                $arrayfuncionalidadesasoc[$pos]['text'] = $objfuncionalidad[0]['denominacion'];
                $arrayfuncionalidadesasoc[$pos]['referencia'] = $objfuncionalidad[0]['referencia'];
                $arrayfuncionalidadesasoc[$pos]['leaf'] = true;
                $arrayfuncionalidadesasoc[$pos]['draggable'] = false;
                $arrayfuncionalidadesasoc[$pos]['checked'] = false;
            }
        }
        return $arrayfuncionalidadesasoc;
    }

    public function cargarFuncionalidadesSinAsociar($parametros) {
        $idsubsistema = $parametros->idsubsistema;
        $certificado = $this->global->Perfil->certificado;
        $identidad = $this->global->Estructura->idestructura;
        $func = $this->integrator->seguridad->ObtenerSistemaFuncionalidades(
                $certificado, $parametros->idsubsistema, $identidad
        );

        $arrayfuncsnoasociadas = array();

        if (isset($func[0])) {
            $idsubsistema = $parametros->idsusbsistema;
            $posicion = 0;

            foreach ($func as $funcionalidad) {

                $idfuncionalidad = $funcionalidad['idfuncionalidad'];
                $existeasociacion = Doctrine::getTable(
                                "DatProcesofuncionalidad"
                        )->findByDql(
                        "idfuncionalidad = $idfuncionalidad"
                );
                if (!isset($existeasociacion[0]->idproceso) || $existeasociacion[0]->idproceso == null || $existeasociacion[0]->idproceso == ''
                ) {
                    $arrayfuncsnoasociadas[$posicion]['id'] = $idfuncionalidad;
                    $arrayfuncsnoasociadas[$posicion]['text'] = $funcionalidad['text'];
                    $arrayfuncsnoasociadas[$posicion]['referencia'] = $funcionalidad['referencia'];
                    $arrayfuncsnoasociadas[$posicion]['leaf'] = true;
                    $arrayfuncsnoasociadas[$posicion]['draggable'] = false;
                    $arrayfuncsnoasociadas[$posicion]['checked'] = false;
                    $posicion++;
                }
            }
        }
        return $arrayfuncsnoasociadas;
    }

    public function obtenerIdFuncionalidades($certificado, $idsubsistema, $identidad
    ) {
        $func = $this->integrator->seguridad->ObtenerModulosFuncionalidades(
                $certificado, $idsubsistema, $identidad
        );

        $arrayfunc = Array();
        foreach ($func as $funcionalidades) {
            if ($funcionalidades['leaf'] === 1) {
                $arrayfunc[] = $funcionalidades['idfuncionalidad'];
            } else {
                $certificado = $this->global->Perfil->certificado;
                $identidad = $this->global->Estructura->idestructura;
                $arrayfunc = array_merge(
                        $arrayfunc, self::obtenerIdFuncionalidades(
                                $certificado, $funcionalidades['idsistema'], $identidad
                        )
                );
            }
        }

        return $arrayfunc;
    }

    public function adicionarAsociacionProcesoFuncionalidad($parametros) {
        $procede = 1;
        $objproceso = Doctrine::getTable('NomDatosnomenclador')->find(
                $parametros->idproceso
        );
        if (isset($objproceso->idproceso)) {
            $procede = 0;
            $respuesta = 0;
        }
        if ($procede == 1) {
            foreach ($parametros->arrayfuncionalidades as $funcionalidad) {
                $objprocesofuncionalidad = new DatProcesofuncionalidad();
                $objprocesofuncionalidad->idproceso = $parametros->idproceso;
                $objprocesofuncionalidad->idfuncionalidad = $funcionalidad->idfuncionalidad;
                $objprocesofuncionalidad->referencia = $funcionalidad->referencia;

                $objprocesofuncionalidad->save();
            }
            $respuesta = 1;
        }
        return $respuesta;
    }

    public function eliminarAsociacionProcesoFuncionalidad($parametros) {
        if ($parametros->idprocesofuncionalidad) {
            $objproceso = Doctrine::getTable('DatProcesofuncionalidad')->find(
                    $parametros->idprocesofuncionalidad
            );
            if (isset($objproceso)) {
                $objproceso->delete();
                return 1;
            } else {
                return 3;
            }
        } else {
            return 3;
        }
    }

    public function adicionarPermisos($parametros) {
        if ($parametros->evento == 'Adicionar') {
            $objprocesofuncionalidad = new DatProcesofuncionalidadentidad();
            $result = $objprocesofuncionalidad->Insertar($parametros);

            return $result;
        } else {
            $objprocesofuncionalidad = Doctrine::getTable(
                            'DatProcesofuncionalidadentidad'
                    )->findByDql(
                    "idprocesofuncionalidadestado=$parametros->idprocesofuncionalidadestado
                 and identidad=$parametros->identidad "
            );

            if ($objprocesofuncionalidad[0]->idprocesofuncionalidadentidad != null
            ) {
                $objprocesofuncionalidad[0]->guardar = $parametros->guardar;
                $objprocesofuncionalidad[0]->eliminar = $parametros->eliminar;
                $objprocesofuncionalidad[0]->modificar = $parametros->modificar;
                $objprocesofuncionalidad[0]->insertar = $parametros->insertar;
                $objprocesofuncionalidad[0]->save();
            }
        }
        return $objprocesofuncionalidad;
    }

    public function addEstadoFunc($parametros) {
        /* $de = Doctrine_Manager::getInstance();
          $conn = $de->getCurrentConnection(); */
        $objprocesofuncionalidadestado = new DatProcesofuncionalidadestado();
        if ($parametros->idprocesofuncionalidad) {
            $objprocesofuncionalidadestado->idprocesofuncionalidad = $parametros->idprocesofuncionalidad;
        }
        if ($parametros->idestado) {
            $objprocesofuncionalidadestado->idestado = $parametros->idestado;
        }
        if ($parametros->idejercicio) {
            $objprocesofuncionalidadestado->idejercicio = $parametros->idejercicio;
        }
        $objprocesofuncionalidadestado->activo = 0;
        $objprocesofuncionalidadestado->save();
        /* $conn->commit();
          $conn->beginTransaction(); */

        return $objprocesofuncionalidadestado;
    }

    public function listarPermisos($parametros) {

        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'denomentidad') {
                    $parametros['denomentidad'] = $datos['data']['value'];
                } else {
                    if ($datos['field'] == 'ejercicio') {
                        $parametros['ejercicio'] = $datos['data']['value'];
                    } else {
                        if ($datos['field'] == 'guardar') {
                            $parametros['guardar'] = $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'insertar') {
                                $parametros['insertar'] = $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'modificar') {
                                    $parametros['modificar'] = $datos['data']['value'];
                                } else {
                                    if ($datos['field'] == 'eliminar') {
                                        $parametros['eliminar'] = $datos['data']['value'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $lista = new DatProcesofuncionalidadentidad();
        $result = $lista->listarPermisos($parametros);
        return $result;
    }

    public function eliminarPermisos($id, $parametros) {
        $objprcesfuncentidad = new DatProcesofuncionalidadentidad();
        $resul = $objprcesfuncentidad->BuscaridFuncionalidadestadodadoid($id);
        $entidades = implode(',', $parametros->hijas);
        $objprcesfuncentidad->EliminarDadoEstadoeidentidad($entidades, $resul);
        $objprcesfuncentidad->Eliminar($id);
        return 1;
    }

    public function listarEntidades($parametros) {
        $centbal = DatProcesofuncionalidadentidad::getCB($parametros);

        if ($centbal) {
            foreach ($centbal as $key => $valor) {
                if ($parametros->evento != 'Modificar') {
                    $centbal[$key]['checked'] = false;
                }
                $valor['leaf'] = true;
            }
            $datos = $centbal;
        } else {
            $datos = 1;
        }
        return $datos;
    }

    public function listarEntidadesFiltro() {
        $centbal = DatEntidaddatosnomenclador::getOD();
        $i = 0;
        $dat = array();

        if ($centbal) {
            foreach ($centbal as $valor) {
                $dat[$i]['id'] = $valor['identidad'];
                $enti = $this->integrator->metadatos->DameEstructura($valor['identidad']);
                $dat[$i]['text'] = $enti[0]->denominacion;
                $i++;
            }

            $datos = $dat;
        } else {
            $datos = 1;
        }
        return $datos;
    }

    public function listarModificarEntidades($parametros) {

        $i = 0;
        $dat = array();

        $lista = new DatProcesofuncionalidadentidad();
        $result = $lista->listarModificarPermisos($parametros);


        if ($result) {
            foreach ($result as $valor) {

                $dat[$i]['id'] = $valor['identidad'];
                $enti = $this->integrator->metadatos->DameEstructura(
                        $valor['identidad']
                );
                $dat[$i]['idpadre'] = $enti[0]->idpadre;
                $dat[$i]['text'] = $enti[0]->denominacion;

                if ($parametros->evento == 'ModificarXEjercicio') {
                    $dat[$i]['checked'] = false;
                }
                $dat[$i]['leaf'] = true;
                if ($dat[$i]['idpadre'] != 900000235) {
                    unset($dat[$i]);
                } else {
                    $i++;
                }
            }

            $datos = $dat;
        } else {
            $datos = 1;
        }
        return $datos;
    }

    public function activarEstado($arrayejercicio, $parametros) {

        foreach ($arrayejercicio as $id) {

            $query = new Doctrine_Query();
            $query->update('DatProcesofuncionalidadestado e')
                    ->set('e.activo', $parametros->activo)
                    ->where(
                            'e.idprocesofuncionalidad=? and e.idestado=? and e.idejercicio=?', array($parametros->idprocesofuncionalidad,
                        $parametros->idestado, $id)
                    )
                    ->execute();
        }
        return 1;
    }

    public function buscarIdprocesofuncionalidadestado($parametros
    ) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT
  mod_planificacion.dat_procesofuncionalidadestado.idprocesofuncionalidadestado
FROM mod_planificacion.dat_procesofuncionalidadestado
WHERE
  mod_planificacion.dat_procesofuncionalidadestado.idejercicio=" . $parametros->idejercicio . " AND
  mod_planificacion.dat_procesofuncionalidadestado.idestado=" . $parametros->idestado . " AND
  mod_planificacion.dat_procesofuncionalidadestado.idprocesofuncionalidad=" . $parametros->idprocesofuncionalidad . "";
        $result = $conn->execute($query);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function insertarProcesofuncionalidadestado($parametros
    ) {
        $conn = Doctrine_Manager::connection();
        $query = "INSERT INTO
  mod_planificacion.dat_procesofuncionalidadestado
( idprocesofuncionalidad,idestado,idejercicio,activo) VALUES (
   " . $parametros->idprocesofuncionalidad . ",
  " . $parametros->idestado . ", " . $parametros->idejercicio . ", 0
)";
        $result = $conn->execute($query);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        //$conn->commit();
        return $data;
    }

}
