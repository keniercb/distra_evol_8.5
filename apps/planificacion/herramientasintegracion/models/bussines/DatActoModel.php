<?php

class DatActoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    /**
     * @copyright XETID CUba
     * @author Ing Grabiel Montero Coello
     * @name obtenerActos
     * @param $start : Inicio de la selección de elementos
     * @param $limit : Cantidad de elementos a seleccionar
     * @param $idEstudioMap : Identificador del estudio de análisis político
     * @use Función para obtener los actos
     * @return array
     */
    public static function obtenerActos($start = null, $limit = null, $idEstudioMap) {
        $data = DatActo::obtenerActosMap($start, $limit, $idEstudioMap);
        $cantidad = DatActo::getCantidad($idEstudioMap);
        return array('root' => $data, 'cantidad_filas' => $cantidad);
    }

    /**
     * @copyright XETID CUba
     * @author Ing Grabiel Montero Coello
     * @name adicionarActo
     * @param $acto : Datos del acto
     * @param $idEstudioMap : Identificador del estudio de análisis político
     * @use Función para adicionar un acto
     * @return mixed
     */
    public static function adicionarActo($acto, $idEstudioMap) {
        return DatActo::adicionarActo($acto, $idEstudioMap);
    }

    public static function existeActo($acto, $idEstudioMap) {
        try {
            $select = ' select *';
            $from = ' from mod_planifintegracion.dat_acto den';
            $where = " where den.denominacion = '{$acto}' and den.idestudiomatrizdanalisispolitico = {$idEstudioMap} ";
            $sql = $select . $from . $where;
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC); //¿o_0? 
            return $result;
        } catch (Exception $exc) {
            echo($exc->getMessage());
           
        }
    }

    /**
     * @copyright XETID CUba
     * @author Ing Grabiel Montero Coello
     * @name modificarActo
     * @param $actos : Arrelgo de actos
     * @use Función para modificar los actos
     * @return array
     */
    public static function modificarActo($actos) {
        $idActos = array();
        foreach ($actos as $acto) {
            $idActos[] = DatActo::modificarActo($acto);
        }
        return $idActos;
    }

    /**
     * @copyright XETID CUba
     * @author Ing Grabiel Montero Coello
     * @name eliminarActo
     * @param $actos : Arreglo con los identificadores de los actos
     * @use Función para eliminar los actos
     * @return array
     */
    public static function eliminarActo($actos) {
        $idActos = array();
        foreach ($actos as $id) {
            $act = Doctrine::getTable('DatActo')->find($id);
            $idActos[] = $id;
            $act->delete();
        }
        return $idActos;
    }

}
