<?php

/**
 * UtilesDoctrineModel
 *
 * @author    Alien Fern\xE1ndez Fuentes
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Común/Models/Bussines
 * @version    1.0
 */
class UtilesDoctrineModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Función para obtener los datos de una tupla de una tabla
     *
     * @param string  $nombreTabla - contiene el nombre de la clase doctrine
     * @param integer $valorTupla  - contiene el identificador de la tupla
     *
     * @return array $arrDatosTabla
     */
    public function obtenerDatosTabla($nombreTabla, $valorTupla)
    {
        $objDoctrine = Doctrine::getTable($nombreTabla)->find($valorTupla);
        if ($objDoctrine) {
            $arrDatosTabla = $objDoctrine->toArray();
        }
        return $arrDatosTabla;
    }

    /**
     * Función para generar un objeto doctrine con sus valores
     *
     * @param string       $objCrear                - contiene el nombre del objeto doctrine a crear
     * @param object|array $datosIndiceValor        - array o objeto que contiene los indices y datos
     *                                              del objeto a crear
     * @param array        $arrIdValor              - identificador del objeto a modificar
     * [idtabla => idtupla] "un par indice 'el identificador de la tabla' y valor 'valor asociado al identificador' "
     *
     * @return object $objNuevo
     */
    static public function generarModificarObjeto($objCrear, $datosIndiceValor, $arrIdValor = null)
    {
        if (!is_array($datosIndiceValor) && is_object($datosIndiceValor)) {
            $datosIndiceValor = get_object_vars($datosIndiceValor);
        }
        if ($arrIdValor == null) {
            $objNuevo = new $objCrear ();
        } else {
            $valor = array_values($arrIdValor);
            $campo = array_keys($arrIdValor);
            $objNuevo = Doctrine::getTable($objCrear)->find($valor[0]);
            if (!$objNuevo->{$campo[0]}) {
                $objNuevo = new $objCrear ();
                $objNuevo->{$campo[0]} = $valor[0];
            }
        }
        $codigo = self::obtenerCodigo($datosIndiceValor);
        //print_r($codigo);die;
        eval($codigo);
        return $objNuevo;
    }

    /**
     * Obtiene el código
     *
     * @param array $datosIndiceValor Datos índice valor
     *
     * @return string
     */
    private static function obtenerCodigo($datosIndiceValor)
    {
        $codigo = "";
        foreach ($datosIndiceValor as $atributo => $valor) {
            if (!empty($valor) || (intval($valor) === 0 && is_numeric($valor))) {
                $codigo .= "\$objNuevo->$atributo = '$valor';";
            }
        }
        return $codigo;
    }

    /**
     * Función para verificar las dependencias de una tabla
     *
     * @param string  $nombreTabla                - contiene el nombre de la clase doctrine
     * @param integer $valorTupla                 - contiene el identificador de la tupla
     * @param array $arrDependenciasEspecificas - contiene un array con dependencias especificas
     * [idtabla => NombreTabla]  "un par indice 'el identificador de la tabla' y NombreTabla 'nombre de la tabla' "
     *
     * @return bool $dependencia
     */
    public function verificarDependenciasTabla($nombreTabla, $valorTupla, $arrDependenciasEspecificas = array())
    {
        $cantDependenciasEspecificas = count($arrDependenciasEspecificas);
        if ($cantDependenciasEspecificas == 0) {
            $relaciones = Doctrine::getTable($nombreTabla)->getRelations();
            foreach ($relaciones as $nombre => $relacion) {
                $foreign = $relacion->getForeign();
                $cantidad = Doctrine :: getTable($nombre)->findByDql("$foreign = ?", array($valorTupla))->count();
                if ($cantidad > 0) {
                    return true;
                }
            }
        } else {
            foreach ($arrDependenciasEspecificas as $id => $relacionEspecifica) {
                $cantidad = Doctrine :: getTable($relacionEspecifica)->findByDql("$id = ?", array($valorTupla))->count(
                );
                if ($cantidad > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Función que cierra la transaccion para que la secuencia devuelva el
     *                        valor y poder utilizarlo en la otra tabla
     * @return bool
     */
    static public function cerrarAbrirTransaccion()
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->commit();
        $conn->beginTransaction();
        return true;
    }

    /**
     * Método para inyectar las relaciones a una clase en tiempo de ejecucio
     *
     * @author Kenier Cumba, Lester A. Gonzalez
     */

    static public function tryInyectRelactions(Doctrine_Record $obj, $relations)
    {
        foreach ($relations as $value) {
            //parent::hasOne($value['relation'], $value['properties']);
            if ($value['cardinalidad'] == 'one') {
                $obj->hasOne($value['relation'], $value['properties']);
            } else { //parent::hasMany($value['relation'], $value['properties']);
                $obj->hasMany($value['relation'], $value['properties']);
            }
        }
    }

    /**
     * Metodo para incluir las relaciones de un doctrine_record
     *
     * @param array           $arrayRelations Arreglo de relaciones
     * @param Doctrine_Record $caller
     * @param string          $relType
     */
    static public function hasRelation($arrayRelations, Doctrine_Record $caller, $relType = 'one')
    {
        if (!is_array($arrayRelations[0])) {
            $arrayRelations = array($arrayRelations);
        }
        foreach ($arrayRelations as $relation) {
            self::isException($relation);
            if (class_exists($relation[0])) {
                if ($relType == 'one') {
                    $caller->hasOne($relation[0], $relation[1]);
                } else {
                    $caller->hasOne($relation, $relation[1]);
                }
            }
        }
    }

    /**
     * Verifica si existe exepción
     *
     * @param $relation
     *
     * @throws Exception
     */
    private static function isException($relation)
    {
        if (!is_string($relation[0])) {
            throw new Exception('Class name is not a valid string');
        }
        if (!is_array($relation[1]) || !array_key_exists('local') || !array_key_exists('foreign')) {
            throw new Exception('Relation array is not correctly defined');
        }
    }
}
