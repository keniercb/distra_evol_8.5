<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatCargoModel extends ZendExt_Model
{
    /**
     * CONSTRUCTOR
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new DatCargo();
    }

    /**
     * Descripción del método: Inserta un nuevo cargo
     *
     * @author      : Ing. Javier Limonta
     * @modified    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idcargo
     * @param $datos
     * @param $proyecto
     * @param $modificar
     *
     * @return bool Retorna TRUE en caso de insertar satisfactoriamente
     * @copyright   Copyright (c) 2013 xetid
     */
    public function insertarCargo($idcargo, $datos, $proyecto, $modificar = false)
    {
        $cantidadReal = 0;
        if ($modificar) {
            $cargo = Doctrine::getTable('DatCargo')->findByDql("idcargo = $idcargo AND idproyecto = 0")->getFirst();
            if (is_object($cargo)) {
                $cantidadReal = $cargo->cantidadreal;
            }
        }
        $object = new DatCargo();
        $object->idcargo = $idcargo;
        $object->cantidad = $datos['cantidad'];
        $object->cantidadreal = $cantidadReal;
        $object->idespecialidadpreparacion = $datos['idEspecialidad_preparacion'];
        $object->idespecialidadempleo = $datos['idEspecialidad_empleo'];
        $object->idnomcargo = $datos['idNomCargo'];
        $object->idpreparacion = $datos['idPreparacion'];
        $object->idsalario = $datos['idSalario'];
        $object->temporal = $datos['temporal'];
        $object->directo = $datos['directo'];
        $object->idproyecto = $proyecto;
        $object->idtipoescala = $datos['idtipoescala'];
        $object->idestado = ($proyecto != 0) ? ($modificar) ? 2 : 1 : 0;
        $object->idsector = $datos['idsector'];
        $object->idnivelcargo = $datos['idnivelcargo'];
        $object->idfacultado = $datos['idfacultado'];
        $object->principal = ($datos['principal'] == '0') ? 0 : 1;
        $object->jefebrigada = ($datos['jefebrigada'] == '0') ? 0 : 1;
        $object->decisorio = ($datos['decisorio']) ? 1 : 0;
        $object->alias = $datos['alias'];
        $object->save();

        return true;
    }

    /**
     * Descripción del método: Modifica un cargo especificado
     *
     * @author      : Ing. Javier Limonta
     * @modified    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idcargo
     * @param $datos
     * @param $proyecto
     *
     * @return bool Retorna TRUE en caso de modificar satisfactoriamente
     * @copyright   Copyright (c) 2013 xetid
     */
    public function modificarCargo($idcargo, $datos, $proyecto)
    {
        $object = Doctrine::getTable('DatCargo')->findByDql("idcargo = $idcargo AND idproyecto = $proyecto")->getFirst();
        if (is_object($object)) {
            $object->cantidad = $datos['cantidad'];
            $object->idespecialidadpreparacion = $datos['idEspecialidad_preparacion'];
            $object->idespecialidadempleo = $datos['idEspecialidad_empleo'];
            $object->idnomcargo = $datos['idNomCargo'];
            $object->idpreparacion = $datos['idPreparacion'];
            $object->idsalario = $datos['idSalario'];
            $object->idtipoescala = $datos['idtipoescala'];
            $object->temporal = $datos['temporal'];
            $object->directo = $datos['directo'];
            $object->idsector = $datos['idsector'];
            $object->idnivelcargo = $datos['idnivelcargo'];
            $object->idfacultado = $datos['idfacultado'];
            $object->principal = ($datos['principal'] == '0') ? 0 : 1;
            $object->jefebrigada = ($datos['jefebrigada'] == '0') ? 0 : 1;
            $object->alias = $datos['alias'];
            //print_r(($datos['decisorio']) ? UtilModel::getRealValue($datos['decisorio']) : 0);die;
            $object->decisorio = ($datos['decisorio']) ? UtilModel::getRealValue($datos['decisorio']) : 0;
            $object->save();
        } else {
            $this->insertarCargo($idcargo, $datos, $proyecto, true);
        }
    }

    /**
     * Descripción del método: Obtiene los datos de un cargo
     *
     * @author      : Ing. Daymel Machado
     *
     * @param $arrIdCargos
     *
     * @return array|null
     * @copyright   Copyright (c) 2013 xetid
     */
    public function obtenerDatosCargo($arrIdCargos)
    {
        $where = "dc.idcargo IN (" . implode(',', $arrIdCargos) . ")";
        if (!is_array($arrIdCargos)) {
            $where = "dc.idcargo IN ($arrIdCargos)";
        }
        $query = Doctrine_Query::create();
        $query->select('de.denominacion as padre,fila.idpadre as idpadre,dc.idcargo, dc.cantidad,
            dc.cantidadreal,dc.idespecialidadempleo as idespecialidad,dc.temporal,dc.directo')->from("DatCargo dc")
            ->leftJoin(
                "dc.DatCargocivil cc WITH cc.idproyecto = 0")
            ->leftJoin("dc.DatCargomilitar cm WITH cm.idproyecto = 0")
            ->innerJoin("dc.NomFilaestruc fila")
            ->leftJoin("fila.DatEstructuraop de on de.idestructuraop = fila.idpadre")
            ->where($where)->addWhere("dc.idproyecto = 0");
        $query = $this->integrator->metadatos->getSqlCargo($query);
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $resultado = array();
        $i = 0;
        foreach ($result as $value) {
            $resultado[$i] = $value;
            $i++;
        }

        return $resultado;
    }

    /**
     * Descripción del método: Agrega al objeto de Doctrine_Query las tablas y los datos a seleccionar
     * (DatCargo, DatCargocivil, DatCargomilitar)
     *
     * @param Doctrine_Query $objDoctrineQuery
     * @param string $aliasTablaReferencia
     * @param string $aliasTabla
     * @param string $relation
     * @param boolean $includeDqlSelect
     *
     * @return Doctrine_Query
     */
    public function agregarDqlDatosCargo(
        Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $relation = 'leftJoin',
        $includeDqlSelect = false
    )
    {
        if ($includeDqlSelect) {
            $addSelect = "$aliasTabla.idcargo AS idcargo, $aliasTabla.cantidad AS cantidad,
            $aliasTabla.temporal AS temporal";
            $objDoctrineQuery->addSelect(
                $addSelect
            );
        }
        switch (strtolower($relation)) {
            case 'leftjoin':
                $objDoctrineQuery->leftJoin(
                    "$aliasTablaReferencia.DatCargo $aliasTabla WITH $aliasTabla.idproyecto = 0"
                );
                break;
            default:
                $objDoctrineQuery->innerJoin(
                    "$aliasTablaReferencia.DatCargo $aliasTabla WITH $aliasTabla.idproyecto = 0"
                );
                break;
        }
        $aliaDCC = $aliasTabla . 'dcc';
        $aliaDCM = $aliasTabla . 'dcm';
        $objDoctrineQuery->leftJoin("$aliasTabla.DatCargocivil $aliaDCC WITH $aliaDCC.idproyecto =0");
        $objDoctrineQuery->leftJoin("$aliasTabla.DatCargomilitar $aliaDCM WITH $aliaDCM.idproyecto =0");
        $objDoctrineQuery = $this->integrator->metadatos->agregarDQLCargo(
            $objDoctrineQuery, $aliasTabla, $aliaDCC, $aliaDCM,
            $includeDqlSelect
        );

        return $objDoctrineQuery;
    }

    /**
     * Obtiene los cargos que contengan un nomenclador de cargo especifico
     */
    public function dameCargosXIdNomCargo($idnomcargo, $dominio, $datos = false)
    {
        $where = " AND 1=1";
        if ($dominio) {
            $iddominio = $this->global->Perfil->iddominio;
            $where = " AND f.dominiofila[$iddominio] = '1'";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if (is_array($idnomcargo)) {
            $idnomcargo = implode(',', $idnomcargo);
        }
        $sql = "SELECT f.idfila as id
                FROM mod_estructuracomp.nom_filaestruc f
                INNER JOIN mod_estructuracomp.dat_cargo c ON (c.idcargo = f.idfila AND c.idproyecto = 0)
                where f.fechafin is null AND c.idnomcargo IN ($idnomcargo)" . $where;
        $cargos = $conn->fetchAll($sql);
        $resultado = array();
        if ($datos) {
            $model = new EstructuraModel();
            foreach ($cargos as $cargo) {
                $dato = $model->dameDatosEstructura($cargo['id']);
                $resultado [] = $dato[0];
            }
        } else {
            $resultado = $cargos;
        }

        return $resultado;
    }

    /**
     * Actualiza las cantidades reales de los cargos ocupados por Capital Humano
     *
     * @param $idCargo
     * @param $cantidad
     *
     * @return bool
     */
    public function actualizarCantidadRealCargo($idCargo, $cantidad)
    {
        $object = Doctrine::getTable('DatCargo')->findByDql("idcargo = $idCargo AND idproyecto = 0")->getFirst();
        if (is_object($object)) {
            $object->cantidadreal = $cantidad;
            $object->save();

            return true;
        } else {
            if (is_array($object)) {
                foreach ($object as $cargo) {
                    $cargo->cantidadreal = $cantidad;
                    $cargo->save();
                }

                return true;
            }
        }

        return false;
    }

    public function dameIdCargosEspecificos($militares = false, $limit = 0, $start = 0)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql
            = "
        SELECT DISTINCT (nc.idnomcargo),
               nc.idnomcargo as id,
               nc.denominacion as denominacion,
               nc.abreviatura as abreviatura
        FROM mod_estructuracomp.nom_cargo nc
        INNER JOIN mod_estructuracomp.dat_cargo dc ON (dc.idnomcargo = nc.idnomcargo) ";
        if ($militares) {
            $sql
                .= "INNER JOIN mod_estructuracomp.dat_cargomilitar dcm
                        ON (dcm.idcargo = dc.idcargo AND dcm.idproyecto = dc.idproyecto) ";
        } else {
            $sql
                .= "INNER JOIN mod_estructuracomp.dat_cargocivil dcc
                        ON (dcc.idcargo = dc.idcargo AND dcc.idproyecto = dc.idproyecto) ";
        }
        $sql .= "WHERE dc.idestado = 0
             OFFSET $start ";
        if ($limit) {
            $sql .= "LIMIT $limit ";
        }
        $resultado = $conn->fetchAll($sql);

        return $resultado;
    }
}
