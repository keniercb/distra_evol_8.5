<?php

class DatOportunidad extends BaseDatOportunidad
{

    public function setUp()
    {
        $this->hasOne(
            'DatCampanna',
            array('local' => 'idcampanna', 'foreign' => 'idcampanna')
        );
        $this->hasOne(
            'NomCanal',
            array('local' => 'idcanal', 'foreign' => 'idcanal')
        );
        $this->hasOne(
            'NomPrioridad',
            array('local' => 'idprioridad', 'foreign' => 'idprioridad')
        );
        $this->hasOne(
            'NomTipo',
            array('local' => 'idtipo', 'foreign' => 'idtipo')
        );
        $this->hasMany(
            'DatClienteOportunidad',
            array('local' => 'idoportunidad', 'foreign' => 'idoportunidad')
        );
        parent::setUp();
    }

    public function getOportunidad($params, $idestrucutura)
    {
        $query = new Doctrine_Query();
        $query->select(
            'do.*,np.denominacion as denomprioridad,dc.denominacion as denomcampanna,nc.denominacion as denomcanal,
            tp.denominacion as denomtipo'
        )
            ->from('DatOportunidad do')
            ->innerjoin('do.NomPrioridad np')
            ->innerjoin('do.DatCampanna dc')
            ->innerjoin('do.NomCanal nc')
            ->innerjoin('do.NomTipo tp')
            ->offset($params['start'])
            ->limit($params['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if ($params['sort']) {
            $sort = json_decode($params['sort'])[0];
            $query->orderby($sort->property . ' ' . $sort->direction);
        } else {
            $query->orderby('do.idoportunidad DESC');
        }
        if ($idestrucutura) {
            $query->addWhere('do.idestructura=' . $idestrucutura);
        }

        if ($params['filter']) {
            $query = $this->applyFilter($query, $params['filter']);
        }
        $result = $query->execute();
        return array('data' => $result, 'count' => $query->count());
    }

    private function applyFilter($query, $filters)
    {
        $condition = [];
        $alias = array('denomprioridad' => 'np.denominacion', 'denomcampanna' => 'dc.denominacion',
                       'denomcanal'     => 'nc.denominacion', 'denomtipo' => 'tp.denominacion',
                       'idestructura'   => 'dp.idestructura', 'idtipo' => 'dp.idtipo');

        foreach ($filters as $filter) {
            $field = $filter['field'];
            if ($alias[$field]) {
                $field = $alias[$field];
            }
            $type = $filter['data']['type'];
            $value = $filter['data']['value'];
            $comparison = $filter['data']['comparison'];
            if ($type == 'string') {
                $condition[] = "lower(" . $field . " :: varchar) LIKE '%" . strtolower((string)$value) . "%'";
            }
            if ($type == 'date') {
                $operator = $this->getOperator($comparison);
                list($moth, $day, $year) = explode('/', $value);
                $condition[] = $field . "" . $operator . "'$day/$moth/$year'";
            }
            if ($type == 'numeric') {
                $operator = $this->getOperator($comparison);
                $condition[] = $field . "" . $operator . "'$value'";
            }
        }
        $condition = implode(' AND ', $condition);
        if (count($condition) && $query) {
            $query->addWhere($condition);
            return $query;
        }
        return $condition;
    }

    private function getOperator($comparison)
    {
        $operator = " = ";
        if ($comparison) {
            if ($comparison === 'lt') {
                $operator = " < ";
            } else {
                if ($comparison === 'gt') {
                    $operator = " > ";
                }
            }
        }
        return $operator;
    }

    public function getCantOportunidadesMes($params)
    {
        $doctrine = Doctrine_Manager::getInstance();
        $conn = $doctrine->getCurrentConnection();
        $mesanno = "mes,anno,";
        $orderby = " order by mes";
        $params = array_merge(
            $params, array(
                array("field" => "anno", "data" => array("type" => "numeric", "value" => 2016)),
                array("field" => "idestructura",
                      "data"  => array("type" => "numeric", "value" => $params['idestructura'])),
                array("field" => "idtipo", "data" => array("type" => "numeric", "value" => 3))
            )
        );
        if ($params['include']) {
            array_pop($params);
            $mesanno = "";
            $orderby = "";
        }

        $condition = $this->applyFilter('', $params);
        if ($condition) {
            $condition = "WHERE " . $condition;
        }

        $query = "select $mesanno idtipo,denominacion,count(idoportunidad) as cant
                from (select dop.idoportunidad,dop.idestructura,nt.*,extract(month from fecha) as mes,extract(year from fecha) as anno
                from mod_crmmarketing.dat_oportunidad dop inner join mod_crmmarketing.nom_tipo nt on nt.idtipo = dop.idtipo)dp
               $condition group by $mesanno idtipo,denominacion$orderby";

        $result = $conn->fetchAll($query);
        return array('data' => $result);
    }

    public function getClientesPotenciales($params)
    {
        $doctrine = Doctrine_Manager::getInstance();
        $conn = $doctrine->getCurrentConnection();
        $condition = $this->applyFilter('', $params['filter']);
        if ($condition) {
            $condition = " WHERE " . $condition;
        }
        $query
            = "select clpr.idclientesproveedores,(CASE WHEN clpr.registrado = 0 THEN clpr.nombre else
                  COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as nombre,
                  count(dco.idclientesproveedores) as cant from mod_crmmarketing.dat_clienteoportunidad dco
                  INNER JOIN mod_crmmarketing.dat_oportunidad dp on dp.idoportunidad = dco.idoportunidad
                  INNER JOIN mod_datosmaestros.nom_clientesproveedor clpr ON clpr.idclientesproveedores = dco.idclientesproveedores
                  LEFT JOIN mod_estructuracomp.dat_estructura estru ON (clpr.idestructura = estru.idestructura and estru.idproyecto=0)
                  LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona) $condition
                  GROUP BY clpr.idclientesproveedores,estru.denominacion,per.nombre,per.papel,per.sapel ORDER BY cant desc limit 10;";
        $result = $conn->fetchAll($query);
        return array('data' => $result);
    }

    public function getCampannasPotenciales($params)
    {
        $doctrine = Doctrine_Manager::getInstance();
        $conn = $doctrine->getCurrentConnection();
        $condition = $this->applyFilter('', $params['filter']);
        if ($condition) {
            $condition = " WHERE " . $condition;
        }
        $query
            = "SELECT dc.idcampanna,dc.denominacion,count(dcop.idclienteoportunidad) as cant
                  from mod_crmmarketing.dat_oportunidad dp INNER JOIN mod_crmmarketing.dat_campanna dc
                  on dc.idcampanna = dp.idcampanna INNER JOIN mod_crmmarketing.dat_clienteoportunidad dcop
                   on dp.idoportunidad = dcop.idoportunidad $condition GROUP BY dc.idcampanna,dc.denominacion";
        $result = $conn->fetchAll($query);
        return array('data' => $result);
    }


}