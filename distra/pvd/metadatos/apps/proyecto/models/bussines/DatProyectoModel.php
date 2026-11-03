<?php

/**
 * Class DatProyectoModel
 */
class DatProyectoModel extends ZendExt_Model
{
    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Descripción del método: Inserta un nuevo proyecto
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param      $data
     *
     * @return bool : boolm Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
        $fecha = $data['fecha'];
        $usuario = $data['usuario'];
        $object = new DatProyecto();
        $valores = $data['parametros'][1];
        $denominacion = $valores->denominacion;
        $descripcion = $valores->descripcion;
        $object->denominacion = ucfirst($denominacion);
        $object->descripcion = $descripcion;
        $object->idusuario = $usuario;
        $object->fecha = $fecha;
        $object->save();

        return true;
    }

    /**
     * Descripción del método: Modifica una instancia de la tabla proyecto
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Permite modificar el elemento en la base de datos
     * @copyright Copyright (c) 2014 xetid
     */
    public function modificar($data)
    {
        $valores = $data['parametros'];
        $idProyecto = $valores[0];
        $valores = $valores[1];
        $denominacion = $valores->denominacion;
        $descripcion = $valores->descripcion;
        $proyecto = Doctrine::getTable('DatProyecto')->find($idProyecto);
        if (is_object($proyecto)) {
            $proyecto->denominacion = ucfirst($denominacion);
            $proyecto->descripcion = $descripcion;
            $proyecto->save();

            return true;
        }

        return false;
    }

    /**
     * Descripción del método: Elimina un proyecto especificado segun el id
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Elimina la instancia de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
        $valores = $data['parametros'];
        $idProyecto = $valores[0];
        $object = Doctrine::getTable('DatProyecto')->find($idProyecto);
        if (is_object($object)) {
            $object->delete();

            return true;
        }

        return false;
    }

    /**
     * @param $idresponsable
     * @param $idproyecto
     * @param $disponibles
     * @param $asignados
     *
     * @return bool
     */
    public function asignarPermisos($idresponsable, $idproyecto, $disponibles, $asignados)
    {
        $model = new DatProyectoUsuarioModel();
        $model->eliminar($idproyecto, $idresponsable, $disponibles);
        $model->insertar($idproyecto, $idresponsable, $asignados);

        return true;
    }

    /**
     * Descripción del método: Fusiona 1 o mas proyectos seleccionados
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, Crea un nuevo proyecto con las modificaciones de los proyectos seleccionados
     *                      y actualiza el idpadre de los mismos
     * @copyright Copyright (c) 2013 xetid
     */
    public function fusionar($data)
    {
        $usuario = $data['usuario'];
        $idProyectos = $data['parametros'];
        $values = implode(',', $idProyectos);
   //     Util::msg($idProyectos);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->fetchAll("Select mod_estructuracomp.f_merge_proyecto(ARRAY [$values], $usuario)");

        return true;
    }

    /***
     * Descripción del método: Devuelve la cantidad de proyectos segun los filtros de busqueda
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return int Retorna la cantidad de proyectos que cumplen con el filtro
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
        $usuario = $data['usuario'];
        $modelProyectoUsuario = new DatProyectoUsuarioModel();
        $asignados = $modelProyectoUsuario->dameProyectosAsignadosEnviados($usuario);
        $idProyectosAsignados = Util::getArrayByField($asignados, 'idproyecto');
        $idProyectosAsignados = implode(',', $idProyectosAsignados);
        $whereAsignados = ($idProyectosAsignados) ? "OR (c.idproyecto IN ($idProyectosAsignados))" : '';
        $where = "(c.idproyecto = 0 OR (c.aprobado = 0 AND ((c.idusuario = $usuario) $whereAsignados)))";
        if (count($data[0]) > 0) {
            $valores = $data[0][0];
            $denominacion = $valores->denominacion;
            if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
                $where .= " AND LOWER(c.denominacion) LIKE LOWER ('%$denominacion%')";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->from('DatProyecto c')->where($where)->execute()->count();

        return $result;
    }

    /**
     * Descripción del método: Busca uno o varios proyectos
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : Permite buscar uno o varios elemento en la base de datos atendiendo a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscar($data)
    {
        $usuario = $data['usuario'];
        $limit = $data[0];
        $start = $data[1];
        $data = $data[2];
        $valores = $data[0];

        $denominacion = $valores->tfFiltroDenoP;
        $modelProyectoUsuario = new DatProyectoUsuarioModel();
        $asignados = $modelProyectoUsuario->dameProyectosAsignadosEnviados($usuario);
        $enviados = $modelProyectoUsuario->dameProyectosAsignadosEnviados($usuario, true);
        $idProyectosAsignados = Util::getArrayByField($asignados, 'idproyecto');
        $idProyectosAsignados = implode(',', $idProyectosAsignados);
        $whereAsignados = ($idProyectosAsignados) ? "OR (c.idproyecto IN ($idProyectosAsignados))" : '';
        $selectAsignados
            = ($idProyectosAsignados) ? "(CASE WHEN c.idproyecto IN ($idProyectosAsignados) THEN 1 ELSE 0 END)" : '0';
        $idProyectosEnviados = Util::getArrayByField($enviados, 'idproyecto');
        $idProyectosEnviados = implode(',', $idProyectosEnviados);
        $selectEnviados
            = ($idProyectosEnviados) ? "(CASE WHEN c.idproyecto IN ($idProyectosEnviados) THEN 1 ELSE 0 END)" : '0';
        $where = "(c.idproyecto = 0 OR (c.aprobado = 0 AND ((c.idusuario = $usuario) $whereAsignados)))";
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
            $where .= " AND LOWER(c.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        $query = Doctrine_Query::create();
        $result = $query->select(
                        "c.*,
            ((SELECT COUNT(p.idproyecto)
              FROM DatProyecto p
              WHERE p.idpadre = c.idproyecto ) > 0) AS fusionado,
              ($selectAsignados) as asignado,
              ($selectEnviados) as enviado
          "
        )->from('DatProyecto c')->where($where)->orderBy('c.idproyecto')->limit($limit)->offset($start)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $result = self::completarValoresResult($result, $asignados, $usuario);
       // Util::msg($result);
        return $result;
    }

    /**
     * @param $result
     * @param $asignados
     * @param $usuario
     *
     * @return mixed
     */
    private static function completarValoresResult($result, $asignados, $usuario)
    {
        foreach ($result as $index => $proyecto) {
            if ($proyecto['asignado']) {
                foreach ($asignados as $permiso) {
                    if ($permiso['idproyecto'] == $proyecto['idproyecto'] && $permiso['idusuario'] == $usuario) {
                        $datosPersona = MetadatosServices::getInstance()->dameNombreUsuario($usuario);
                        $result[$index]['asignado'] = $datosPersona;
                        $result[$index]['nuevoasignado'] = (int) $permiso['nuevo'];
                    }
                }
            }
        }

        return $result;
    }

    /**
     * @param $idProyecto
     *
     * @return bool
     */
    public static function setModificar($idProyecto)
    {
        $object = Doctrine::getTable('DatProyecto')->find($idProyecto);
        if (is_object($object)) {
            if ($object->modificado == 0) {
                $object->modificado = 1;
                $object->save();
            }
        }

        return true;
    }

    /**
     * @param $idProyecto
     *
     * @return bool
     */
    public function verificarExistenciaEscala($idProyecto)
    {
        $datEstructuraModel = new DatEstructuraModel();
        $estructuraModel = new EstructuraModel();
        $domainEscala = new NomEscalaSalarial();
        $plantillas = $datEstructuraModel->damePlantillasPorProyecto($idProyecto);
        $exite = true;
        foreach ($plantillas as $plantilla) {
            $cargos = $estructuraModel->dameCargosPorEstructura($plantilla['idestructura'], $plantilla['idproyecto']);
          /* if(count($cargos)>0){
               Util::msg($cargos);

           } */
            foreach ($cargos as $cargo) {
                $tipoescala = $plantilla['idtipoescala'];
               // Util::msg($cargo['idsalario']);
                $exite = $domainEscala->existeEscala($tipoescala, $cargo['idsalario']);
                if (!$exite) {

                    return false;
                }
            }
        }

        return $exite;
    }

    /**
     * @param $data
     *
     * @return bool
     */
    public function aprobar($data)
    {
        $fecha = getdate();
        $fecha = $fecha['mday'] . '-' . $fecha['mon'] . '-' . $fecha['year'];

        $idProyecto = $data['parametros'][0];
        $idUsuario = $data['usuario'];
        if (self::verificarExistenciaEscala($idProyecto)) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();

            $conn->fetchAll("Select mod_estructuracomp.f_poner_en_vigor($idProyecto, $idUsuario)");

            $conn->fetchAll("UPDATE mod_estructuracomp.dat_proyecto SET fechafin = '$fecha' where idproyecto=0");
            return true;
        }


        return false;
    }

    /**
     * @param $data
     *
     * @return bool
     */
    public function cancelar($data)
    {
        $idProyecto = $data['parametros'][0];
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->fetchAll("Select mod_estructuracomp.f_cancelar_proyecto($idProyecto)");

        return true;
    }

    /**
     * @param $id
     * @param $idConcepto
     * @param $proyecto
     * @param $estado
     *
     * @return bool
     */
    public static function deshacerCambios($id, $idConcepto, $proyecto, $estado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->fetchAll(
             "Select mod_estructuracomp.f_deshacer_proyecto($id, $proyecto, $estado, $idConcepto, FALSE)"
        );

        return true;
    }

    /**
     * Descripción del método: Busca uno o varios proyectos asignados a un usuario
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $usuario
     *
     * @return bool : Permite buscar uno o varios elemento en la base de datos atendiendo a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameProyectosPorUsuario($usuario)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatProyecto c')->where("c.idproyecto = 0")->orWhere("c.idusuario = $usuario")->orderBy(
                        'c.idproyecto'
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * @param $idProyecto
     *
     * @return array
     */
    public function dameReporteProyecto($idProyecto)
    {
        $modelDatEstructura = new DatEstructuraModel();
        $estructuras = $modelDatEstructura->dameEstructurasPorProyecto($idProyecto);
        $proyecto = Doctrine::getTable('DatProyecto')->find($idProyecto);
        $datosPersona = MetadatosServices::getInstance()->dameNombreUsuario($proyecto['idusuario']);
        $resultado = array(
            'proyecto' => array(
                'denominacion' => $proyecto->denominacion, 'descripcion' => $proyecto->descripcion,
                'fecha'        => Util::convertirFecha($proyecto->fecha), 'usuario' => ucfirst($datosPersona)),
            'ajustes'  => $estructuras);

        return $resultado;
    }

    /**
     * Descripción del método:  Busca la cantidad de elementos que existen con la misma denominacion
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param          $denominacion
     * @param bool     $modificar
     * @param bool|int $idProyecto
     *
     * @return bool : bool Devuelve la cantidad de instancias encontradas
     * @copyright Copyright (c) 2013 xetid
     */
    function existeDenominacion($denominacion, $modificar = false, $idProyecto = false)
    {
        $idusuario = $this->global->Perfil->idusuario;
        if ($modificar) {
            $object = Doctrine::getTable('DatProyecto')->find($idProyecto);
            $denom = $object->denominacion;
            if ($denom <> $denominacion) {
                return $this->existeDenominacion($denominacion);
            } else {
                return false;
            }
        } else {
            $where = "denominacion ILIKE ('$denominacion') AND aprobado = 0 AND (idusuario = $idusuario OR idusuario
             IS NULL)";
            $query = Doctrine_Query::create();
            $resultado = $query->from('DatProyecto')->where($where)->execute()->count();

            return $resultado > 0;
        }
    }
}