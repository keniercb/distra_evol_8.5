<?php

class HisEventoDespachado extends BaseHisEventoDespachado
{

    public function setUp()
    {
        parent::setUp();
        $this->HasOne(
            'DatEvent', array('local' => 'idevento', 'foreign' => 'idevento')
        );
        $this->hasMany(
            'HisTareaAviso', array('local' => 'ideventodespachado',
                                   'foreign' => 'ideventodespachado')
        );
    }

    private static function getCommonQuery($params)
    {
        return Doctrine_Query:: create()
            ->from(__CLASS__ . ' ed');
    }

    public static function getDispatchedEvents($start, $limit, $params)
    {
        $q = self::getCommonQuery($params);
        if (array_key_exists('sort', $params)) {
            $q = $q->orderBy(
                'ed.' . $params['sort']['field'] . ' ' . $params['sort']['dir']
            );
        }

        return $q->select(
            'ed.ideventodespachado ideventodespachado,
                                      e.nombre nombre,
                                      ed.idevento,
                                      ed.originadopor sender,
                                      ed.fecha fecha,
                                      ed.exito exito,
                                      ed.detalle detalle'
        )
            ->innerJoin('ed.DatEvent e')
            ->offset($start)
            ->limit($limit)
            ->execute()
            ->toArray();
    }

    public static function getTotal($params)
    {
        return self:: getCommonQuery($params)
            ->select('count(ideventodespachado)')
            ->setHydrationMode(Doctrine :: HYDRATE_SINGLE_SCALAR)
            ->execute();
    }

    public static function getAvisosEnviadosCommonQuery(
        $id, $params, $start, $limit, $toCount = false
    )
    {
        $subQueryBase
            = "SELECT task.idaviso,
                                task.ideventodespachado, 
                                min(task.fechacreacion) as fechaenvio FROM his_tareaaviso task ";
        $where = " WHERE ";
        if ($id) {
            $subQueryBase .= " WHERE task.ideventodespachado = $id";
        }
        $subQueryBase .= " GROUP BY 1, 2 ";
        $havingCond = " <= NOW()";
        if ($params->desde && $params->hasta) {
            $havingCond
                = " BETWEEN cast('$params->desde' as date) AND cast('$params->hasta' as date)";
        } elseif ($params->desde && !$params->hasta) {
            $havingCond = " >= cast('$params->desde' as date)";
        } elseif (!$params->desde && $params->hasta) {
            $havingCond = "<= cast('$params->hasta' as date)";
        }
        $subQueryBase .= " HAVING cast(min(task.fechacreacion) as date) $havingCond";
        $query
            = "SELECT  a.denominacion as denominacion,
                          a.idaviso as idaviso,
                          ta.denominacion as tipo,
                          a.creadopor as creadopor,
                          a.fechacreacion as fechacreacion,
                          reals.ideventodespachado,
                          reals.fechaenvio
                  FROM dat_aviso a
                  INNER JOIN nom_tipoaviso ta ON ta.idtipoaviso = a.idtipoaviso
                  INNER JOIN (" . $subQueryBase
            . ") as reals on reals.idaviso = a.idaviso";
        if ($params->nombre) {
            $query .= " WHERE lower(a.denominacion) like lower('%$params->nombre%')";
        }
        if ($toCount) {
            return $query;
        }
        $query .= " ORDER BY 7 DESC";
        if (isset ($start) && isset ($limit)) {
            $query .= " LIMIT $limit OFFSET $start";
        }

        return $query;
    }
}