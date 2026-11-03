<?php

class DatFuerzaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    /**
     * @copyright XETID Cuba
     * @name obtenerFuerzas
     * @author Ing Grabiel Montero Coello
     * @param $start : Inicio de la selección de elementos
     * @param $limit : Cantidad de elemntos a seleccionar
     * @param $idEstudioMap : Identificador del estudio de análisis político
     * @use Función para obtener las fuerzas
     * @return array
     */
    public static function obtenerFuerzas($start, $limit, $idEstudioMap) {
        $data = DatFuerza::obtenerFuerzasMap($start, $limit, $idEstudioMap);
        $cantidad = DatFuerza::getCantidad($idEstudioMap);
        return array('root' => $data, 'cantidad_filas' => $cantidad);
    }

    /**
     * @copyright XETID Cuba
     * @name adicionarFuerza
     * @author Ing Grabiel Montero Coello
     * @param $fuerza : Datos de la fuerza
     * @param $idEstudioMap : Identificador del estudio de análisis político
     * @use Función para adicionar una fuerza
     * @return mixed
     */
    public static function adicionarFuerza($fuerza, $idEstudioMap) {
        return DatFuerza::adicionarFuerza($fuerza, $idEstudioMap);
    }

    /**
     * @copyright XETID Cuba
     * @name modificarFuerza
     * @author Ing Grabiel Montero Coello
     * @param $fuerza : Datos de la fuerza
     * @use Función para modificar una fuerza
     * @return mixed
     */
    public static function modificarFuerza($fuerza) {
        return DatFuerza::modificarFuerza($fuerza);
    }

    /**
     * @copyright XETID Cuba
     * @name eliminarFuerza
     * @author Ing Grabiel Montero Coello
     * @param $id : Identificador de la fuerza
     * @use Función para eliminar una fuerza
     * @return mixed
     */
    public static function eliminarFuerza($id) {
        $fuerza = Doctrine::getTable('DatFuerza')->find($id);
        $fuerza->delete();
        return $id;
    }

    public static function existeFuerza($den, $idEstudioMap) {
        try {
            $select = ' select *';
            $from = ' from mod_planifintegracion.dat_fuerza den';
            $where = " where den.denominacion = '{$den}' and den.idestudiomatrizdanalisispolitico = {$idEstudioMap} ";
            $sql = $select . $from . $where;
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC); //¿o_0? 
            return $result;
        } catch (Exception $exc) {
            echo($exc->getMessage());
        }
    }

}
