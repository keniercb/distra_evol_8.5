<?php

/**
 * Componente para gestionar las fechas de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Fecha/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatFecha extends BaseDatFecha
{

    /**
     * Constuctor de la clase
     */
    public function setUp() 
    {
        $this->hasOne(
                'DatEstructurasubsist', array(
                    'local' => 'idestructurasubsist', 'foreign' => 'idestructurasubsist'
                    )
                );
        parent::setUp();
    }

    /**
     * Buscar fecha
     *
     * @param int $estructurasubsist Identificador de estructura subsistema
     * @return array Retorna un arreglo con los datos de la fecha
     * 
     */
    static public function BuscarFecha($estructurasubsist) 
    {
        $q = Doctrine_Query::create();
        $result = $q->select('s.idfecha,s.fecha,s.idestructurasubsist,s.incremento,s.fechasist,s.precedencia')
                ->from("DatFecha s")
                ->where("s.idestructurasubsist=?", $estructurasubsist)
                ->execute();
        return $result->toArray();
    }

    /**
     * Fechas
     *
     * @param int $limit Cantidad de objetos a devolver
     * @param int $start Indice donde se inicia la busqueda
     * @param array $condicion Arreglo de condiciones
     * @return array Retorna un arreglo con la cantidad de fechas y los objetos fechas
     * 
     */
    static public function Fechas($limit, $start, $condicion) 
    {
        $qd = new Doctrine_Query();
        $result = $qd->select(
                "s.idfecha,s.fecha,s.idestructurasubsist,s.incremento,s.fechasist,s.precedencia,s.version"
                )
                ->from("DatFecha s")
                ->WhereIn("s.idestructurasubsist", $condicion)->orderby("s.precedencia")->limit($limit)->offset($start)
                ->execute();
        $cant = self::Cantidad($condicion);
        return array($cant, $result->toArray());
    }

    /**
     * Cantidad
     *
     * @param array $condicion Arreglo de condiciones
     * @return array Retorna un arreglo con la cantidad de fechas en la posición 0
     * 
     */
    static public function Cantidad($condicion = array()) 
    {
        $q = new Doctrine_Query();
        if (empty($condicion))
            $count = $q->select("COUNT(s.idfecha) cant")->from("DatFecha s")->execute();
        else
            $count = $q->select("COUNT(s.idfecha) cant")
                ->from("DatFecha s")
                ->whereIn("s.idestructurasubsist", $condicion)->execute();
        $cant = $count->toArray();
        return $cant[0]['cant'];
    }

    /**
     * Buscar precedencias
     *
     * @param array $idfechas Identificadores de fechas
     * @return array Retorna un arreglo de fechas
     * 
     */
    static public function BuscarPrecedencias($idfechas) 
    {
        $q = new Doctrine_Query();
        $prec = $q->select("s.idfecha,s.fechasist,s.precedencia,s.incremento,s.idestructurasubsist,s.version")
                ->from("DatFecha s")
                ->whereIn("s.idfecha", $idfechas)->orderby("s.precedencia DESC")
                ->execute();
        return $prec->toArray();
    }

    /**
     * Todas las fechas
     *
     * @param array $condicion Arreglo de condiciones
     * @return array Retorna un arreglo de fechas por precedencia
     * 
     */
    static public function TodaslasFechas($condicion) 
    {
        $qd = new Doctrine_Query();
        $result = $qd->select(
                "s.idfecha,s.fecha,s.idestructurasubsist,s.incremento,s.fechasist,s.precedencia,s.version"
                )
                ->from("DatFecha s")
                ->WhereIn("s.idestructurasubsist", $condicion)->orderby("s.precedencia DESC")
                ->execute();
        return $result->toArray();
    }

    /**
     * Todas las fechas por procedencia
     *
     * @param array $condicion Arreglo de condiciones
     * @return array Retorna un arreglo de fechas por precedencia
     * 
     */
    static public function TodaslasFechasXProcedencia($condicion) 
    {
        $qd = Doctrine_Query::create();
        $result = $qd->select(
                "s.idfecha,s.fecha,s.idestructurasubsist,s.incremento,s.fechasist,s.precedencia,s.version"
                )
                ->from("DatFecha s")
                ->WhereIn("s.idestructurasubsist", $condicion)->orderby("s.precedencia DESC")
                ->execute();
        return $result->toArray();
    }

    /**
     * Buscar fecha por campo
     *
     * @param array $cond Arreglo de condiciones
     * @return array Retorna un arreglo de con los datos de una fecha
     * 
     */
    static public function BuscarFechaPorCampos($cond) 
    {
        $filter = " 0 = 0 ";
        if ($cond['idfecha'])
            $filter.=" and e.idfecha = '" . $cond['idfecha'] . "'";
        if ($cond['fecha'])
            $filter.=" and e.fecha = '" . $cond['fecha'] . "'";
        if ($cond['idestructurasubsist'])
            $filter.=" and e.idestructurasubsist = '" . $cond['idestructurasubsist'] . "'";
        $q = Doctrine_Query::create();
        $result = $q->select('s.idfecha,s.fecha,s.idestructurasubsist,s.incremento')->from("DatFecha s")
                ->where($filter)
                ->execute();
        return $result->toArray();
    }

    /**
     * Buscar fecha por id
     *
     * @param int $idfecha Identificador de fecha
     * @return array Retorna un arreglo de con los datos de una fecha
     * 
     */
    static public function FechaPorId($idfecha) 
    {
        $qd = new Doctrine_Query();
        $result = $qd->select(
                "s.idfecha,s.fecha,s.idestructurasubsist,s.incremento,s.fechasist,s.precedencia,s.version"
                )
                ->from("DatFecha s")
                ->Where("s.idfecha='$idfecha'")
                ->execute();
        return $result->toArray();
    }

    /**
     * Buscar fecha id estructura subsistema
     *
     * @param int $estructurasubsist Identificador de estructura subsistema
     * @return array Retorna un arreglo con los datos de la fecha
     * 
     */
    static public function BuscarFechaIdsubsistest($estructurasubsist) 
    {
        $q = Doctrine_Query::create();
        $result = $q->select('s.idfecha,s.fecha,s.idestructurasubsist,s.incremento,s.fechasist,s.precedencia,s.version')
                ->from("DatFecha s")
                ->where("s.idestructurasubsist=?", $estructurasubsist)
                ->execute();
        return $result->toArray();
    }

}
