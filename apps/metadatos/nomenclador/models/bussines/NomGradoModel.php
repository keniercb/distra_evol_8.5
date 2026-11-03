<?php

/***
 * Class NomGradoModel
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class NomGradoModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomGrado();
    }

    /**
     * Descripción del método: Inserta un nuevo grado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool, bool TRUE si se logro adicionar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($data)
    {
        $object = new NomGrado();
        $valores = $data[2];
        $abreviatura = $valores->abreviatura;
        $idicono = $valores->idicono;
        $idcategoriamilitar = $valores->idcategoriamilitar;
        $fechainicio = $valores->fechainicio;
        $fechafin = $valores->fechafin;
        $orden = json_decode($valores->orden);
        $orden = (!is_bool($orden)) ? $valores->orden + 1 : NomGrado::dameOrden();
        $denominacion = $valores->denominacion;
        if (UtilModel::check_in_range($fechainicio, (empty($fechafin) ? date("d/m/Y") : $fechafin))) {
            $actual = UtilModel::getRealValue($valores->actual);
            $visible = UtilModel::getRealValue($valores->visible);
        } else {
            $actual = 0;
            $visible = 0;
        }
        $marina = UtilModel::getRealValue($valores->marina);
        /*VALORES*/
        $object->idgrado = self::buscarIdProximo();
        $object->denominacion = ucfirst($denominacion);
        $object->abreviatura = ucfirst($abreviatura);
        $object->orden = $orden;
        $object->actual = $actual;
        $object->visible = $visible;
        $object->marina = $marina;
        $object->idicono = $idicono;
        $object->idcategoriamilitar = $idcategoriamilitar;
        $object->fechainicio = $fechainicio;
        $object->fechafin = $fechafin;
        $object->save();
        self::updateOrden($object->idgrado, $object->orden);
        return TRUE;
    }

    /**
     * Descripción del método: Modifica un grado especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro modificar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($data)
    {
        $idGrado = $data[0];
        $valores = $data[2];
        $idicono = $valores->idicono;
        $idcategoriamilitar = $valores->idcategoriamilitar;
        $denominacion = $valores->denominacion;
        $abreviatura = $valores->abreviatura;
        $fechainicio = $valores->fechainicio;
        $fechafin = ($valores->fechafin != "") ? $valores->fechafin : NULL;
        if (UtilModel::check_in_range($fechainicio, $fechafin)) {
            $actual = UtilModel::getRealValue($valores->actual);
            $visible = UtilModel::getRealValue($valores->visible);
        } else {
            if ($valores->fechafin == "") {
                $actual = 1;
                $visible = 1;
            } else {
                $actual = 0;
                $visible = 1;
            }
        }
        $marina = UtilModel::getRealValue($valores->marina);
        $grado = Doctrine::getTable('NomGrado')->find($idGrado);
        if (is_object($grado)) {
            $grado->denominacion = ucfirst($denominacion);
            $grado->abreviatura = ucfirst($abreviatura);
            $grado->idcategoriamilitar = $idcategoriamilitar;
            $grado->idicono = $idicono;
            $grado->actual = $actual;
            $grado->visible = $visible;
            $grado->marina = $marina;
            $grado->fechainicio = $fechainicio;
            $grado->fechafin = $fechafin;
            $grado->save();
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Descripción del método: Elimina el grado especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro eliminar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($data)
    {
        $idGrado = $data[0];
        $object = Doctrine::getTable('NomGrado')->find($idGrado);
        if (is_object($object)) {
            $object->delete();
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Descripción del método: Desactiva el grado especificado atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro desactivar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function desactivar($data)
    {
        $idGrado = $data[0];
        try{
            $object = Doctrine::getTable('NomGrado')->find($idGrado);
            $object->actual = 0;
            $object->visible = 0;
            $object->save();
            return TRUE;
        } catch (Doctrine_Exception $ee){
            return FALSE;
        }
    }

    /**
     * Descripción del método: Activa el grado especificado atendiendo al id pasado por parametro
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $data
     *
     * @return bool : bool TRUE si se logro activar satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function activar($data)
    {
        $idGrado = $data[0];
        try{
            $object = Doctrine::getTable('NomGrado')->find($idGrado);
            $object->actual = 1;
            $object->visible = 1;
            $object->save();
            return TRUE;
        } catch (Doctrine_Exception $ee){
            return FALSE;
        }
    }

    /**
     * Funcion para reordenar los grados militares
     *
     * @author: Ing. Osbaldo Manuel Gonzalez Ortiz
     *
     * @param $data
     *
     * @return bool
     */
    public function ordenar($data)
    {
        $accion = $data[3]['accion'];
        $hijo = $data[1]->hijo;
        $padre = $data[2]->padre;
        $hijo = Doctrine::getTable('NomGrado')->find($hijo);
        $padre = Doctrine::getTable('NomGrado')->find($padre);
        switch ($accion){
            case 'encima':
                $hijo->orden = $padre->orden;
                $hijo->save();
                break;
            case 'debajo':
                $hijo->orden = $padre->orden + 1;
                $hijo->save();
                break;
            case 'intercambiar':
                $tempOrden = $hijo->orden;
                $hijo->orden = $padre->orden;
                $padre->orden = $tempOrden;
                $hijo->save();
                $padre->save();
                break;
        }
        self::updateOrden($hijo->idgrado, $hijo->orden);
        return TRUE;
    }

    /**
     * @param $id
     * @param $jerarquia
     */
    private function updateOrden($id, $jerarquia)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "SELECT mod_estructuracomp.f_update_orden_grado($id, $jerarquia)";
        $conn->fetchAll($sql);
    }

    /**
     * Descripción del método: Devuelve el proximo identificador de los grados
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @return int : int, Devuelve el siguiente identificador
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
        $query = Doctrine_Query::create();
        $result = $query->select('max(a.idgrado) as maximo')->from('NomGrado a')->execute()->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;
        return $proximo;
    }

    /**
     * Descripción del método: Devuelve la cantidad de grados que cumplen con la condicion insertada
     *
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Pedro Alberto Jiménez
     *
     * @param $data
     *
     * @return mixed : int, Retorna la cantidad de elementos encontrados durante la busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function cantidad($data)
    {
        $where = '1=1';
        if (count($data) > 1) {
            $valores = $data[1];
            $denominacion = $valores->denominacion;
            $abreviatura = $valores->abreviatura;
            $idcategoriamilitar = $valores->idcategoriamilitar;
            $marina = $valores->marina;
            if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
                $where .= " AND LOWER(g.denominacion) LIKE LOWER ('%$denominacion%')";
            }
            if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
                $where .= " AND LOWER(g.abreviatura) LIKE LOWER ('%$abreviatura%')";
            }
            if (is_numeric($idcategoriamilitar)) {
                $where .= " AND g.idcategoriamilitar = $idcategoriamilitar";
            }
            if (is_numeric($marina)) {
                $where .= " AND g.marina = $marina";
            }
        }
        $query = Doctrine_Query::create();
        $result = $query->from('NomGrado g')->where($where)->execute()->count();
        return $result;
    }

    /**
     * Descripción del método: Devuelve un arreglo con los grados
     *
     * @autor     : Ing. Pedro Alberto Jiménez
     *
     * @param     $data
     *
     * @return mixed, devuelve un arreglo con los identificadores, denominaciones y abreviatura de los grados
     * @copyright Copyright (c) 2013 xetid
     */
    function buscar($data)
    {
        $limit = $data[0];
        $start = $data[1];
        $dir = $data[3];
        $sort = $data[4];
        /* if ($sort === 'tipoescala') {
           $sort    = 'denominacion';
           $esquema = "te." . $sort;
         }
         if ($sort === 'grupocomplejidad') {
           $sort    = 'denominacion';
           $esquema = "gc." . $sort;
         }
         if ($sort === 'salario') {
           $esquema = "sal." . $sort;
         }
         if ($sort === 'fechainicio') {
           $esquema = "esc." . $sort;
         }
         if ($sort === 'fechafin') {
           $esquema = "esc." . $sort;
         }*/
        if ($sort === 'categoriamilitar') {
            $sort = 'denominacion';
            $esquema = "cm." . $sort;
        }
        $campo = ($sort != "") ? "g." . $sort : 'g.orden';
        $orden = ($dir === "ASC") ? " ASC" : " DESC";
        $data = $data[2];
        $valores = $data[1];
        $idcategoriamilitar = $valores->idcategoriamilitar;
        $marina = $valores->marina;
        $denominacion = $valores->denominacion;
        $abreviatura = $valores->abreviatura;
        $where = '1=1';
        if (!empty($denominacion) && $denominacion != "Criterio a buscar...") {
            $where .= " AND LOWER(g.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if (!empty($abreviatura) && $abreviatura != "Criterio a buscar...") {
            $where .= " AND LOWER(g.abreviatura) LIKE LOWER ('%$abreviatura%')";
        }
        if (is_numeric($idcategoriamilitar)) {
            $where .= " AND g.idcategoriamilitar = $idcategoriamilitar";
        }
        if (is_numeric($marina)) {
            $where .= " AND g.marina = $marina";
        }
        $query = Doctrine_Query::create();
        $result = $query->select(
                        'g.*, g.idgrado as id, i.*,cm.*,
                        cm.denominacion as categoriamilitar, i.denominacion as icono_name'
        )->from('NomGrado g')->innerJoin('g.NomIcono i')->innerJoin('g.NomCategoriaMilitar cm')->where($where)->orderBy(
                        $campo . $orden
            )->limit($limit)->offset($start)->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
            )->execute();
        return $result;
    }

    /**
     * Descripción del método: Devuelve la dirección fisica del icono del grado
     *
     * @autor     : Ing. Osvaldo Manuel Gonzalez Ortis
     *
     * @param     $idGrado
     *
     * @return string, Devuelve la dirección fisica del icono del grado
     * @copyright Copyright (c) 2013 xetid
     */
    static function dameGrado($idGrado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "
        SELECT g.idgrado, g.denominacion, g.abreviatura, g.idicono, i.icono, i.denominacion as icono_name,nom_cm.denominacion as categoriaMilitar
        FROM mod_estructuracomp.nom_grado g
        INNER JOIN mod_estructuracomp.nom_icono i ON (g.idicono = i.idicono)
        INNER JOIN mod_estructuracomp.nom_categoriamilitar nom_cm ON (g.idcategoriamilitar = nom_cm.idcategoriamilitar)
        WHERE  g.fechafin IS NULL AND g.visible = 1 AND g.idgrado = $idGrado ORDER BY g.idgrado";
        $resultado = $conn->fetchAll($sql);
        return $resultado;
    }
}