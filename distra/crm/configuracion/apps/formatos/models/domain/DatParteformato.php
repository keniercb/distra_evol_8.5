<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatParteformato extends BaseDatParteformato
{

    /**
     * Constuctor de la clase
     */
    public function setUp() 
    {
        $this->hasOne(
                'DatParteFormato', array(
                    'local' => 'idformato', 'foreign' => 'idformato', 'onDelete' => 'CASCADE'
                    )
                );
        parent::setUp();
    }
    /**
     * Aplicar filtros
     *
     * @param  array $cond Arreglo de condiciones
     * @return string Retorna una cadena con los filtros 
     * 
     */
    private function aplicarFiltros($cond = array()) 
    {
        $filter = " 0 = 0 ";
        if ($cond['idparteformato'])
            $filter.="and e.idparteformato = '" . $cond['idparteformato'] . "'";
        if ($cond['nombre'] )
            $filter.=" and e.nombre = '" . $cond['nombre'] . "'";
       
        if ($cond['abreviatura'] )
            $filter.=" and e.abreviatura = '" . $cond['abreviatura'] . "'";
        
        if ($cond['nivel'] )
            $filter.=" and e.nivel = '" . $cond['nivel'] . "'";
        
        if ($cond['longitud'] )
            $filter.=" and e.longitud = '" . $cond['longitud'] . "'";
        
        if ($cond['idformato'] )
            $filter.=" and e.idformato = '" . $cond['idformato'] . "'";
        
        if ($cond['version'] )
            $filter.=" and e.version = '" . $cond['version'] . "'";
        
        return $filter;
    }

/**
     * Buscar parte formato
     *
     * @param  array $cond Arreglo de condiciones
     * @param  int $limit Limite de la busqueda
     * @param int $start Indice donde comienza la busqueda
     * @return array Retorna un arreglo con la cantidad y con los datos del nivel de formato  
     * @throws Doctrine_Exception $ee
     */
    public function buscarParteFormato($cond = array(), $limit = 10, $start = 0) 
    {
        try {
            $filter = self::aplicarFiltros($cond);
            

            $q = new Doctrine_Query();
            $estudiant = ($filter) ? $q
             ->select("e.idparteformato,e.nombre,e.abreviatura,e.nivel,e.longitud,e.idformato,e.descripcion,e.version")
                    ->from('DatParteformato e')
                    ->where($filter)->limit($limit)
                    ->offset($start)->execute() : $q
                    ->select(
                            "e.idparteformato,e.nombre,e.abreviatura,
                                e.nivel,e.longitud,e.idformato,e.descripcion,e.version"
                            )
                    ->from('DatParteformato e')->limit($limit)->offset($start)->execute();
            $estudiantes = $estudiant->toArray();
            $cantidad = self::Cantidad($filter);

            $resultado = array('cant' => $cantidad, 'datos' => $estudiantes);

            return $resultado;
        } catch (Doctrine_Exception $ee) {

            return false;
        }
    }

    /**
     * Cantidad
     *
     * @param  object $filter Objeto de tipo filtro
     * @return int Retorna la cantidad de parte formato
     * 
     */
    public function Cantidad($filter) 
    {
        $q = new Doctrine_Query();
        if ($filter)
            $count = $q->select("COUNT(e.idparteformato) cant ")->from("DatParteformato e")->where($filter)->execute();
        else
            $count = $q->select("COUNT(e.idparteformato) cant ")->from("DatParteformato e")->execute();

        $cant = $count->toArray();
        return $cant[0]['cant'];
    }

    /**
     * Parte Formato
     *
     * @param  string $select Query
     * @param array $cond Arreglo de condiciones
     * @return array Retorna un arreglo con los datos pedidos en la query
     * @throws Doctrine_Exception $ee
     */
    public function ParteFormato($select = '', $cond = array()) 
    {
        try {
            $filter = self::aplicarFiltros($cond);
            $q = Doctrine_Query::create();

            if (!$select) {
                if ($filter)
                    $estudiant = $q
                    ->select(
                            "e.idparteformato,e.nombre,e.abreviatura,
                                e.nivel,e.longitud,e.idformato,e.descripcion,e.version"
                            )
                        ->from('DatParteformato e')
                        ->where($filter)->orderby("nivel")->execute();
                else
                    $estudiant = $q
                   ->select(
                           "e.idparteformato,e.nombre,e.abreviatura,
                               e.nivel,e.longitud,e.idformato,e.descripcion,e.version"
                           )
                   ->from('DatParteformato e')->orderby("nivel")->execute();
            } else {
                if ($filter)
                    $estudiant = $q->select($select)->from('DatParteformato e')
                                    ->where($filter)->orderby("nivel")->execute();
                else
                    $estudiant = $q->select($select)->from('DatParteformato e')->orderby("nivel")->execute();
            }
            $estudiantes = $estudiant->toArray();

            return $estudiantes;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Parte Formato Contabilidad
     *
     * @param  string $select Query
     * @param array $cond Arreglo de condiciones
     * @return array Retorna un arreglo con los datos pedidos en la query
     * @throws Doctrine_Exception $ee
     */
    public function ParteFormatoC($select = '', $cond = array()) 
    {
        try {
            $filter = self::aplicarFiltros($cond);
            

            $q = Doctrine_Query::create();

            if (!$select) {
                if ($filter)
                    $estudiant = $q
                                    ->select(
                                            "e.idparteformato,e.nombre,e.abreviatura,e.nivel,
                                    e.longitud,e.idformato,e.descripcion,e.version"
                                    )
                                    ->from('DatParteformato e')
                                    ->where($filter)->orderby("nivel")->execute();
                else
                    $estudiant = $q
                                    ->select(
                                            "e.idparteformato,e.nombre,e.abreviatura,e.nivel,
                                    e.longitud,e.idformato,e.descripcion,e.version"
                                    )
                                    ->from('DatParteformato e')->orderby("nivel")->execute();
            } else {
                if ($filter)
                    $estudiant = $q->select($select)
                                    ->from('DatParteformato e')->where($filter)->orderby("nivel")->execute();
                else
                    $estudiant = $q->select($select)->from('DatParteformato e')->orderby("nivel")->execute();
            }
            $estudiantes = $estudiant->toArray();

            return $estudiantes;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtener parte formato
     *
     * @param  array $cond Arreglo de condiciones
     * @param  int $limit Limite de la busqueda
     * @param int $start Indice donde comienza la busqueda
     * @return array Retorna un arreglo con la cantidad y con los datos del nivel de formato  
     * @throws Doctrine_Exception $ee
     */
    public function getParteFormato($cond = array(), $limit = 10, $start = 0) 
    {
        try {
            if (!isset($start))
                $start = 0;
            $filter = self::aplicarFiltros($cond);
            

            $q = new Doctrine_Query();
            $estudiant = ($filter) ? $q
            ->select("e.idparteformato,e.nombre,e.abreviatura,e.nivel,e.longitud,e.idformato,e.version,e.idconfapertura")
             ->from('DatParteformato e')->where($filter)->orderby("e.nivel")
             ->limit($limit)->offset($start)->execute() : $q
             ->select("e.idparteformato,e.nombre,e.abreviatura,e.nivel,e.longitud,e.idformato,e.version,e.idconfapertura")
             ->from('DatParteformato e')->orderby("e.nivel")->limit($limit)->offset($start)->execute();
            $estudiantes = $estudiant->toArray();

            $cantidad = self::Cantidad($filter);
            $resultado = array('cant' => $cantidad, 'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtener partes formato
     *
     * @param int $idformato Identificador de formato
     * @return array Retorna un arreglo con los datos del nivel de formato 
     * 
     */
    public function obtenerPartesFomato($idformato) 
    {
        $query = new Doctrine_Query();
        $partesFormatos = $query->from("DatParteformato pformato")
        ->where("pformato.idformato = ?", array($idformato))->execute();
        return $partesFormatos;
    }

    /**
     * Obtener partes formato por nivel
     *
     * @param int $agIdformato Identificador de formato
     * @param int $agNivel Valor del nivel
     * @return object Retorna un objeto con los datos del nivel de formato 
     * 
     */
    static public function obtenerParteFormatoPorNivel($agIdFormato, $agNivel) 
    {
        $query = new Doctrine_Query();
        return ZendExt_ClassStandard::Object(
                $query
                ->from('DatParteformato p')
                ->where('p.idformato = ? AND p.nivel = ?', array($agIdFormato, $agNivel))
                ->execute()->toArray(true)
                );
    }

}

