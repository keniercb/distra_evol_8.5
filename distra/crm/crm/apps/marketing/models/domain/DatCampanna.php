<?php

class DatCampanna extends BaseDatCampanna
{

    public function setUp()
    {
        $this->hasMany(
            'DatActividad',
            array('local' => 'idcampanna', 'foreign' => 'idcampanna')
        );
        $this->hasMany(
            'DatOportunidad',
            array('local' => 'idprioridad', 'foreign' => 'idprioridad')
        );
        $this->hasMany(
            'DatCampannaProducto',
            array('local' => 'idcampannaproducto', 'foreign' => 'idcampannaproducto')
        );
        $this->hasOne(
            'NomPrioridad',
            array('local' => 'idprioridad', 'foreign' => 'idprioridad')
        );

        parent::setUp();
    }

    public function getCampanna($params, $idestrucutura)
    {
        $query = new Doctrine_Query();
        $query->select('dc.*, np.denominacion as denomprioridad')
            ->from('DatCampanna dc')
            ->orderby('dc.idcampanna DESC')
            ->innerjoin('dc.NomPrioridad np')
            ->offset($params['start'])
            ->limit($params['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if ($params['denominacion']) {
            $query->addWhere(
                "lower(dc.denominacion) LIKE '%" . strtolower(
                    $params['denominacion']
                ) . "%'"
            );
        }

        if ($idestrucutura) {
            $query->addWhere('dc.idestructura=' . $idestrucutura);
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
        $alias = array('denomprioridad' => 'np.denominacion');

        foreach ($filters as $filter) {
            $field = $filter['field'];
            if($alias[$field]){
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
        if (count($condition)) {
            $query->addWhere(implode(' AND ', $condition));
        }
        return $query;
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
}