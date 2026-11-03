<?php

/**
 * Componente para gestionar las fechas de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Fecha/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatFechaconf extends BaseDatFechaconf
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
        try{
            $query = Doctrine_Query::create();
            $result = $query->from("DatFechaconf s")
                ->where("s.idestructurasubsist=?", $estructurasubsist)
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
            return $result;
        }catch (Exception $e){
            throw $e;
        }
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
        $query = new Doctrine_Query();
        $result = $query->select(
                        "s.idfecha,s.fecha,s.idestructurasubsist,s.incremento,s.fechasist,s.precedencia,s.version"
                )
                ->from("DatFechaconf s")
                ->WhereIn("s.idestructurasubsist", $condicion)->orderby("s.precedencia")
                ->limit($limit)->offset($start)
                ->execute();
        $cant = self::Cantidad($condicion);
        return array($cant, $result->toArray());
    }

    /**
     * Fechas por Subsistema
     *
     * @param array $agArrayIdEntidadSubSys Arreglo de identificadores de entidadsubsistema
     * @return array Retorna un arreglo con las fechas encontradas
     * 
     */
    static public function getFechasBySubSistema($agArrayIdEntidadSubSys)
    {
        $query = new Doctrine_Query();
        return $query->select("s.*")->from("DatFechaconf s")
                        ->whereIn("s.idestructurasubsist", $agArrayIdEntidadSubSys)->orderby("s.precedencia")
                        ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
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
        $query = new Doctrine_Query();
        if (empty($condicion)) {
            $count = $query->select("COUNT(s.idfecha) cant")->from("DatFechaconf s")->execute();
        } else {
            $count = $query->select("COUNT(s.idfecha) cant")->from("DatFechaconf s")
                            ->whereIn("s.idestructurasubsist", $condicion)->execute();
        }
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
        $query = new Doctrine_Query();
        return $query->select(
                                "s.idfecha,s.fechasist,s.precedencia,s.incremento,s.idestructurasubsist,s.version"
                        )
                        ->from("DatFechaconf s")
                        ->whereIn("s.idfecha", $idfechas)->orderby("s.precedencia DESC")
                        ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
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
        $query = new Doctrine_Query();
        return $query->select(
                                "s.idfecha,s.fecha,s.idestructurasubsist,
                                 s.incremento,s.fechasist,s.precedencia,s.version"
                        )
                        ->from("DatFechaconf s")
                        ->WhereIn("s.idestructurasubsist", $condicion)->orderby("s.precedencia DESC")
                        ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
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
        $query = Doctrine_Query::create();
        return $query->select(
                                "s.idfecha,s.fecha,s.idestructurasubsist,
                                    s.incremento,s.fechasist,s.precedencia,s.version"
                        )
                        ->from("DatFechaconf s")
                        ->WhereIn("s.idestructurasubsist", $condicion)->orderby("s.precedencia DESC")
                        ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
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
        if ($cond['idfecha']) {
            $filter.=" and e.idfecha = '" . $cond['idfecha'] . "'";
        }
        if ($cond['fecha']) {
            $filter.=" and e.fecha = '" . $cond['fecha'] . "'";
        }
        if ($cond['idestructurasubsist']) {
            $filter.=" and e.idestructurasubsist = '" . $cond['idestructurasubsist'] . "'";
        }
        $query = Doctrine_Query::create();
        return $query->select('s.idfecha,s.fecha,s.idestructurasubsist,s.incremento')->from("DatFechaconf s")
                        ->where($filter)->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
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
        $query = new Doctrine_Query();
        return $query->select(
                                "s.idfecha,s.fecha,s.idestructurasubsist,
                                    s.incremento,s.fechasist,s.precedencia,s.version"
                        )
                        ->from("DatFechaconf s")
                        ->Where("s.idfecha='$idfecha'")->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
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
        $query = Doctrine_Query::create();
        return $query->select(
                                's.idfecha,s.fecha,s.idestructurasubsist,
                                    s.incremento,s.fechasist,s.precedencia,s.version'
                        )
                        ->from("DatFechaconf s")
                        ->where("s.idestructurasubsist=?", $estructurasubsist)
                        ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
    }

}
