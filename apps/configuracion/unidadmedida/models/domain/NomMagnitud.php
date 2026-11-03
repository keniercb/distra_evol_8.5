<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class NomMagnitud extends BaseNomMagnitud
{

    /**
     * Constuctor de la clase
     */
    public function setUp() 
    {

        parent::setUp();
        $this->HasMany('NomUnidadmedida', array('local' => 'idmagnitud', 'foreign' => 'idmagnitud'));
    }

    /**
     * Obtener todas las magnitudes
     *
     * @param int $start Indice de inicio
     * @param int $limit Limite de la busqueda
     * @return array Retorna con los objetos de tipo magnitud encontrados
     * @throws Doctrine_Exception $ee
     */
    public function getTodos($start = 0, $limit = 20) 
    {
        try {
            $query = Doctrine_Query::create();

            $result = $query->select(
            'cum.idmagnitud, (case when (Current_Date <= (case when (cum.fechafin is null) then 
             Current_Date else cum.fechafin end) 
             and Current_Date >= cum.fechainicio) then 0 else 1 end) as red'
                    )
             ->from('NomMagnitud cum')->offset($start)->limit($limit)
             ->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $ee) {
            return $ee->getMessage();
        }
    }

    public function getTodosReporteMagnitud()
    {
        try {
            $query = Doctrine_Query::create();

            $result = $query->select(
                'cum.idmagnitud, cum.fechafin, cum.fechainicio'
            )
                ->from('NomMagnitud cum')
                ->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $ee) {
            return $ee->getMessage();
        }
    }

    /**
     * Buscar magnitud por nombre
     * 
     * @param string $cond Nombre a buscar
     * @param int $start Valor de comienso
     * @param int $limit Valor limite
     * @throws Doctrine_Exception
     * @return array Retorna un array con los datos de la magnitud
     * 
     */
    static public function buscarMagnitudPorNombre($cond, $start = 0, $limit = 20) 
    {
        try {
            $query = new Doctrine_Query();
            $magnitudes = $query->select(
            'cum.idmagnitud, (case when (Current_Date <= (case when (cum.fechafin is null) 
            then Current_Date else cum.fechafin end) and Current_Date >= cum.fechainicio) 
            then 0 else 1 end) as red'
                    )
             ->from('NomMagnitud cum')
              ->where("lower(cum.denominacionmagnitud) like '%" . strtolower($cond) . "%'")
              ->offset($start)->limit($limit)->execute()->toArray();
            $cant = $query->select('COUNT(cum.idmagnitud) as total')->from('NomMagnitud cum')
                ->where("lower(cum.denominacionmagnitud) like '%" . strtolower($cond) . "%'")
                ->execute()->getFirst()->total;
            if ($cond) {
                include_once Zend_Registry::get('config')->dir_aplication .
                    'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
                $magnitudes = UtilesDatosMaestros::colorSearch($magnitudes, 'denominacionmagnitud', $cond);
            }
            return array('total' => $cant, 'data' => $magnitudes);
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtener total
     * 
     * @return int Retorna un entero con la cantidad de magnitudes
     * 
     */
    function getTotal() 
    {
        $query = Doctrine_Query::create();
        return $query->select('COUNT(idmagnitud) as total')->from('NomMagnitud')->execute()->getFirst()->total;
    }

    /**
     * Dame todas las Unidades de medida
     * @param int $idmagnitud Identificador de la magnitud
     * @return array Retorna un arreglo con las unidades de medida asociadas a la magnitud
     * 
     */
    function dameTodasUM($idmagnitud) 
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomUnidadmedida n')
        ->where('n.idmagnitud =?', $idmagnitud)
        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    /**
     * Existe denominación magnitud
     * @param int $denominacion tipo de denominación
     * @param int $idmagnitud Identificador de la magnitud
     * @return int Retorna la cantidad de magnitudes que existe con una denominación
     * 
     */
    function existeDenominacionMagnitud($denominacion, $idmagnitud = null) 
    {
        $query = Doctrine_Query::create();
        $query->select('COUNT(um.idmagnitud) as total')
        ->from('NomMagnitud um')->where('lower(um.denominacionmagnitud)=?', $denominacion);
        if (isset($idmagnitud))
            $query->addWhere('idmagnitud != ?', $idmagnitud);
        $total = $query->execute()->getFirst()->total;
        return $total;
    }

    /**
     * Existe denominación magnitud
     * @param int $denominacion tipo de denominación
     * @param int $idmagnitud Identificador de la magnitud
     * @return int Retorna la cantidad de magnitudes que existe con una denominación
     * 
     */
    function existeDenominacionMagnitudGest($denominacion, $idmagnitud) 
    {
        $query = Doctrine_Query::create();
        $query->select('COUNT(um.idmagnitud) as total')
        ->from('NomMagnitud um')
        ->where(
        'lower(um.denominacionmagnitud)=? and um.idmagnitud <>?', 
         array($denominacion, $idmagnitud)
         );
        $total = $query->execute()->getFirst()->total;


        return $total;
    }

}

