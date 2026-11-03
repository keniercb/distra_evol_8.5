<?php

class ConfigurarejercicioModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function obtenerListadoEjercicios($parametros) {
        return NomEjercicioplanificacion::obtenerListadoEjercicios($parametros);
    }

    public function eliminarEjercicio($idejercicio) {
        $query = new Doctrine_Query();
        $query->delete()
                ->from('NomEjercicioplanificacion n')
                ->where("n.idejercicio= $idejercicio ")
                ->execute();
        return 1;
    }

    public function cambiarEjercicioActual($parametros) {
        $objejercicio = Doctrine::getTable('NomEjercicioplanificacion')->find($parametros->idejercicio);
        $objejercicio->actual = 1;
        NomEjercicioplanificacion::cambiarActual();
        $objejercicio->save();
        NomActividadModel::actualizarNormadaSegunEjercicioActual($parametros->idejercicio);
        return 1;
    }

    public function cambiarEstado($parametros) {
        $objejercicio = Doctrine::getTable('NomEjercicioplanificacion')->find($parametros->idejercicio);
        $objejercicio->idestado = $parametros->iddatosnomenclador;
        $objejercicio->save();
        return 1;
    }

    public function adicionarModificarEjercicio($parametros) {
        if ($parametros->idejercicioplanificacion && $parametros->accion == 'modificar') {
            $objejercicio = Doctrine::getTable('NomEjercicioplanificacion')->find($parametros->idejercicioplanificacion);
            //se modifico la denominacion
            if ($objejercicio->ejercicio != $parametros->denominacion) {
                $objejercicio->ejercicio = $parametros->denominacion;
                $objejercicio->idjerciciocontable = $parametros->idejerciciodatosmaestros;
                ConfTiempoxnomenclador::eliminarConfiguracionTiempoEjercicio($parametros->idejercicioplanificacion);
            }
        } else {
            $objejercicio = new NomEjercicioplanificacion();
        }
        if ($parametros->accion == 'adicionar') {
            $objejercicio->ejercicio = $parametros->denominacion;
            $objejercicio->idjerciciocontable = $parametros->idejerciciodatosmaestros;
            $objejercicio->idestado = $parametros->idestado;
            $objejercicio->fechainicio = '' . $parametros->denominacion . '-01-01';
            $objejercicio->fechafin = '' . $parametros->denominacion . '-12-31';
        }
        if ($parametros->ejercicioactual == 1) {
            NomEjercicioplanificacion::cambiarActual();
        }

        $objejercicio->actual = $parametros->ejercicioactual;
        $objejercicio->idusuario = $parametros->idusuario;
        $objejercicio->fecha = NULL;
        $de = Doctrine_Manager::getInstance();
        $conn = $de->getCurrentConnection();
        $objejercicio->save();

        $conn->commit();
        $conn->beginTransaction();
        if ($parametros->ejercicioactual == 1) {
            if ($parametros->accion == 'adicionar') {
                $ejer = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("ejercicio = '$parametros->denominacion' ");
                $idejercicio = $ejer[0]->idejercicio;
            } else
                $idejercicio = $objejercicio->idejercicio;
            NomActividadModel::actualizarNormadaSegunEjercicioActual($idejercicio);
        }
        //modificando las configuraciones de fechas para ese ejercicio
        $queryConfTiemposEjercicio = "select * from mod_planificacion.f_actualizar_tiempoejercicios()";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($queryConfTiemposEjercicio);
        $result->fetchAll(PDO::FETCH_ASSOC);
        //adicionando la relacion columna ejercicio de energetica
        //si se va a adicionar y viene el recurso cargainicialenergetica
        if ($parametros->accion == 'adicionar' && $parametros->cargainicialenergetica == 1) {           
            $arrayParametros = array();
            $arrayParametros[0] = $parametros->idusuario;           
            $query = "select * from mod_planifenergetica.f_relacionarcolumnasnuevoejercicio(?)";
            $conn = Doctrine_Manager::connection();
            $result = $conn->execute($query, $arrayParametros);
            $result->fetchAll();
        }
        return 1;
    }

    public function validarExistenciaDatos($idejercicio, $identidad) {
        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
        $datos = array();
        $datos['plan'] = false;
        $datos['na'] = false;
        $datos['des'] = false;
        $datos['norma'] = false;
        if (DatPlanificacion::validarExistenciaDatos($idejercicio, $entidades) != 0) {
            $datos['plan'] = true;
        }
        if (DatActividadentidad::validarExistenciaDatos($idejercicio, $entidades) != 0) {
            $datos['na'] = true;
        }
        if (DatDesgloseentidadnivel::validarExistenciaDatos($idejercicio, $entidades) != 0) {
            $datos['des'] = true;
        }
        if (DatNorma::validarExistenciaDatos($idejercicio) != 0) {
            $datos['norma'] = true;
        }
        if (DatRegla::validarExistenciaDatos($idejercicio) != 0) {
            $datos['reg'] = true;
        }
        return $datos;
    }

    public function obtenerDenominacionEjercicoNoContable($idejercicio, $ejercicio) {
        $queryConfTiemposEjercicio = "select * from mod_planificacion.f_generarejercicios()";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($queryConfTiemposEjercicio);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        $ejercicios = substr($data[0]['f_generarejercicios'], 1);
        $ejercicios = substr($ejercicios, 0, -1);
        $ejercicios = explode(',', $ejercicios);
        $result = array();
        $total = 0;
        foreach ($ejercicios as $key => $value) {
            $result[$key]['idejercicio'] = $value;
            $result[$key]['ejercicio'] = $value;
            $total = $key;
        }
        $total = $total + 1;
        if ($idejercicio != null) {
            $result[$total]['idejercicio'] = $idejercicio;
            $result[$total]['ejercicio'] = $ejercicio;
        }
        return $result;
    }

}
