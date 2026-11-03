<?php

/**
 * Description of LogisticaDoctrineHelper
 *
 * @author Kenier
 */
class LogisticaDoctrineHelper implements ISingletonClass
{

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;
    private $serviciosConfigGenral;
    private $connection;

    /**
     * Inicializando las variables
     *
     */
    private function __construct()
    {
        $this->serviciosConfigGenral = ServiciosConfiguracionGeneralHelper::__init();
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
        $this->connection = Doctrine_Manager::connection();
    }

    /**
     * Una instancia unica de LogisticaDoctrineHelper
     *
     * @var LogisticaDoctrineHelper
     */
    private static $instance = null;

    /**
     * Creates a new instance of class LogisticaDoctrineHelper
     *
     * @return LogisticaDoctrineHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new LogisticaDoctrineHelper;
        }
        return self::$instance;
    }

    /*
     * @name obtenerDatosTabla - Función para obtener los datos de una tupla 
     * de una tabla
     * @param string $nombreTabla - contiene el nombre de la clase doctrine
     * @param integer $valorTupla - contiene el identificador de la tupla
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
     * @name         generarModificarObjeto - Función para generar un objeto
     *                                      doctrine con sus valores
     *
     * @param string $objCrear              - contiene el nombre del objeto doctrine a crear
     * @param        object                 /array $datosIndiceValor - array o objeto que contiene
     *                                      los indices y datos del objeto a crear
     * @param array  $arrIdValor            - identificador del objeto a modificar
     *                                      [idtabla => idtupla] "un par indice 'el identificador de
     *                                      la tabla' y valor 'valor asociado al identificador' "
     *
     * @return object $objNuevo
     */
    public function generarModificarObjeto($objCrear, $datosIndiceValor, $arrIdValor = null)
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
        $codigo = "";
        foreach ($datosIndiceValor as $atributo => $valor) {
            if (!empty($valor) || (intval($valor) === 0 && is_numeric($valor))) {
                $codigo .= "\$objNuevo->$atributo = '$valor';";
            }
        }
        eval($codigo);
        return $objNuevo;
    }

    /**
     * @name          verificarDependenciasTabla  - Función para verificar las d
     *                                            ependencias de una tabla
     *
     * @param string  $nombreTabla                - contiene el nombre de la clase doctrine
     * @param integer $valorTupla                 - contiene el identificador de la tupla
     * @param integer $arrDependenciasEspecificas - contiene un array con
     *                                            dependencias especificas
     *                                            [idtabla => NombreTabla]  "un par indice 'el identificador de la tabla'
     *                                            y NombreTabla 'nombre de la tabla' "
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
                $cantidad = Doctrine:: getTable($nombre)->findByDql("$foreign = ?", array($valorTupla))->count();
                if ($cantidad > 0) {
                    return true;
                }
            }
        } else {
            foreach ($arrDependenciasEspecificas as $id => $relacionEspecifica) {
                $cantidad = Doctrine:: getTable($relacionEspecifica)->findByDql("$id = ?", array($valorTupla))->count();
                if ($cantidad > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @name commitTransaction - Función que cierra la transaccion para
     *                         que la secuencia devuelva el valor y poder utilizarlo en la otra tabla
     * @return bool
     */
    public function commitTransaction()
    {
        $this->connection->beginTransaction();
        $this->connection->commit();
        return true;
    }

    public function rolbackTransaction()
    {
        $this->connection->rollback();
    }

    /**
     * Metedo para inyectar las relaciones a una clase en tiempo de ejecucio
     * $relation es un arreglo array('cardinalidad'=> 'one',
     * 'relation' => 'DatReciboventaproducto',
     * 'properties' => array('local'=> 'idmovimiento', 'foreign' => 'idmovimiento'));
     *
     * @author Kenier Cumba, Lester A. Gonzalez
     */
    public function tryInyectRelactions(Doctrine_Record $obj, $relations)
    {
        foreach ($relations as $value) {
            if ($value['cardinalidad'] == 'one') {
                //parent::hasOne($value['relation'], $value['properties']);
                $obj->hasOne($value['relation'], $value['properties']);
            } else {
                //parent::hasMany($value['relation'], $value['properties']);
                $obj->hasMany($value['relation'], $value['properties']);
            }
        }
    }

    /**
     * Metodo para incluir las relaciones de un doctrine_record
     * e.g: UtilesDoctrineModel::hasRelation(array('DatUserRole',
     * array('foreign' => 'iduserrole', 'local' => 'iduserrole')), $this, 'many')
     *
     * e.g: $rels [] = array('DatUserProfile',
     * array('foreign' => 'idprofile', 'local' => 'idprofile'))
     *        $rels [] = array('DatDomain',
     * array('foreign' => 'iddomain', 'local' => 'iddomain'))
     *
     * UtilesDoctrineModel::hasRelation($resl, $this, 'one')
     */
    public function hasRelation($array_relations, Doctrine_Record $_caller, $_relType = 'one')
    {
        if (!is_array($array_relations[0])) {
            $array_relations = array($array_relations);
        }
        foreach ($array_relations as $_index => $_relation) {
            if (!is_string($relation[0])) {
                throw new Exception('Class name is not a valid string');
            }
            if (!is_array($_relation[1]) || !array_key_exists('local') || !array_key_exists('foreign')) {
                throw new Exception('Relation array is not correctly defined');
            }
            if (class_exists($relation[0])) {
                if ($_relType == 'one') {
                    $_caller->hasOne($relation[0], $relaction[1]);
                } else {
                    $_caller->hasOne($relation, $relation[1]);
                }
            }
        }
    }

    /**
     * Funcion que parametriza la cantidad de resultados que se devuelve en una consulta
     *
     * @param Doctrine_Query $dql
     * @param array          $params Arreglo que contiene los parametros de offset y limite
     *
     * @return Doctrine_Query El query
     */
    public function addQueryLimits(Doctrine_Query $dql, $params = array())
    {
        if (is_numeric($params['limit']) && is_numeric($params['start'])) {
            $dql->offset($params['start'])->limit($params['limit']);
        }
        return $dql;
    }

    /**
     *
     * @param type $dql
     */
    public function query($dql)
    {
        return $this->connection->query($dql);
    }

    /**
     * Executes an sql query
     * @param $sql String SqlQuery to execute
     * @param null $connName Connection name to
     * @return mixed
     */
    public function executeQuery($sql, $connName = null){
        $connObj = is_null($connName) ? $this->connection : $this->openConnectionByName($connName);
        return $connObj->execute($sql);
    }
    public function getStrSelectString($arrayQueryStrings, $alias, $patern)
    {
        $string = '';
        $sqlParts = 0;
        foreach ($arrayQueryStrings as $key => $field) {
            if ($sqlParts > 0) {
                $string .= ', ';
            }
            $string .= str_replace($patern, $alias, $field);
            if ($key != 'no_key') {
                $string .= " as {$key}";
            }
            $sqlParts++;
        }
        return $string;
    }

    public function getConnection()
    {
        return $this->connection;
    }
    private function openConnectionByName($name)
    {
        $configApp = new ZendExt_App_Config();
        $configApp->addBdToConfig($name, $name);
        $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
        return $transactionManager->openConections($name);
    }

}
